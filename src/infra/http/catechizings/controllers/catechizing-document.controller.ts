import { Role } from '@/domain/catechists/enums/role'
import {
  BuildCatechizingDocumentsZipUseCase,
  GetCatechizingDocumentUrlUseCase,
  ListCatechizingDocumentsUseCase,
  RemoveCatechizingDocumentUseCase,
  UploadCatechizingDocumentUseCase,
} from '@/domain/catechizing-documents/use-cases/catechizing-document.use-cases'
import { DocumentKind } from '@/domain/registrations/enums/registration'
import { DocumentFileMissingError } from '@/domain/registrations/errors'
import { RegistrationStorage } from '@/domain/registrations/storage/registration-storage'
import { Roles } from '@/infra/auth/roles.decorator'
import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  ServiceUnavailableException,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { z } from 'zod'
import { CatechizingDocumentPresenter } from '../presenters/catechizing-document.presenter'

const MAX_DOCUMENT_SIZE = 6 * 1024 * 1024
const MAX_FILE_NAME_LENGTH = 80

interface UploadedPdf {
  buffer: Buffer
  originalname: string
}

// Só PDF. O tipo informado pelo navegador não é confiável: todo PDF começa
// com %PDF-
function isPdf(file: UploadedPdf) {
  return file.buffer.subarray(0, 5).toString('latin1') === '%PDF-'
}

// Só para exibir: o nome nunca é usado como caminho no armazenamento
function readFileName(file: UploadedPdf) {
  // O multer entrega o nome como latin1; converte de volta para UTF-8
  const name = Buffer.from(file.originalname, 'latin1').toString('utf8')

  return (
    name
      .replace(/[^\p{L}\p{N} ._()-]+/gu, '')
      .trim()
      .slice(0, MAX_FILE_NAME_LENGTH) || 'documento.pdf'
  )
}

const kindSchema = z.nativeEnum(DocumentKind)

// Documentos dos catequizandos: só a coordenação vê, cadastra, troca e remove
@Controller('/catechizings/:catechizingId')
@Roles([Role.COORDINATOR])
export class CatechizingDocumentController {
  private readonly logger = new Logger(CatechizingDocumentController.name)

  constructor(
    private listDocuments: ListCatechizingDocumentsUseCase,
    private uploadDocument: UploadCatechizingDocumentUseCase,
    private removeDocument: RemoveCatechizingDocumentUseCase,
    private getDocumentUrl: GetCatechizingDocumentUrlUseCase,
    private buildZip: BuildCatechizingDocumentsZipUseCase,
    private storage: RegistrationStorage
  ) {}

  @Get('/documents')
  async list(@Param('catechizingId', ParseUUIDPipe) catechizingId: string) {
    const response = await this.listDocuments.execute(catechizingId)

    if (response.isLeft()) {
      throw new NotFoundException('Catequizando não encontrado')
    }

    return response.value.documents.map(CatechizingDocumentPresenter.toHTTP)
  }

  // Cadastra o documento; se o tipo já existe, troca o arquivo
  @Post('/documents')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_DOCUMENT_SIZE, files: 1, fields: 2 },
    })
  )
  async upload(
    @Param('catechizingId', ParseUUIDPipe) catechizingId: string,
    @Body('kind') rawKind: string,
    @UploadedFile() file?: UploadedPdf
  ) {
    if (!this.storage.isEnabled()) {
      throw new ServiceUnavailableException(
        'Envio de documentos não configurado no servidor'
      )
    }

    const kind = kindSchema.safeParse(rawKind)
    if (!kind.success) {
      throw new BadRequestException('Tipo de documento inválido')
    }
    if (!file) {
      throw new BadRequestException('Envie o PDF no campo "file"')
    }
    if (!isPdf(file)) {
      throw new BadRequestException('O documento deve ser um PDF')
    }

    try {
      const response = await this.uploadDocument.execute({
        catechizingId,
        kind: kind.data,
        body: file.buffer,
        originalName: readFileName(file),
      })

      if (response.isLeft()) {
        throw new NotFoundException('Catequizando não encontrado')
      }

      return CatechizingDocumentPresenter.toHTTP(response.value.document)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      // Falha no Supabase ou no banco: o detalhe fica no log, não vai para a tela
      this.logger.error(error)
      throw new BadGatewayException(
        'Não foi possível salvar o documento agora. Tente novamente'
      )
    }
  }

  // Link temporário para abrir o documento (o bucket é privado)
  @Get('/documents/:documentId/url')
  async url(
    @Param('catechizingId', ParseUUIDPipe) catechizingId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string
  ) {
    const response = await this.getDocumentUrl.execute({
      catechizingId,
      documentId,
    })

    if (response.isLeft()) {
      throw new NotFoundException(
        response.value instanceof DocumentFileMissingError
          ? 'O arquivo deste documento não está mais no armazenamento. Envie o documento de novo.'
          : 'Documento não encontrado'
      )
    }

    return { url: response.value.url }
  }

  @Delete('/documents/:documentId')
  @HttpCode(204)
  async remove(
    @Param('catechizingId', ParseUUIDPipe) catechizingId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string
  ) {
    const response = await this.removeDocument.execute({
      catechizingId,
      documentId,
    })

    if (response.isLeft()) {
      throw new NotFoundException('Documento não encontrado')
    }
  }

  @Get('/documents-zip')
  async zip(@Param('catechizingId', ParseUUIDPipe) catechizingId: string) {
    const response = await this.buildZip.execute(catechizingId)

    if (response.isLeft()) {
      throw new NotFoundException('Este catequizando não tem documentos')
    }

    const { fileName, buffer } = response.value

    return new StreamableFile(buffer, {
      type: 'application/zip',
      disposition: `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    })
  }
}
