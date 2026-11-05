import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Role } from '@/domain/catechists/enums/role'
import {
  CreateRiteRequestDto,
  UpdateRiteRequestDto,
} from '@/domain/rites/dtos/request/rite.dto'
import { RiteStorage } from '@/domain/rites/storage/rite-storage'
import {
  AddRiteFileUseCase,
  CreateRiteUseCase,
  DeleteRiteUseCase,
  FetchRitesUseCase,
  MAX_FILES_PER_RITE,
  RemoveRiteFileUseCase,
  UpdateRiteUseCase,
} from '@/domain/rites/use-cases/rite.use-cases'
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
  Put,
  ServiceUnavailableException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { RitePresenter } from '../presenters/rite.presenter'

const MAX_PDF_SIZE = 10 * 1024 * 1024
const MAX_FILE_NAME_LENGTH = 120

interface UploadedPdf {
  buffer: Buffer
  mimetype: string
  originalname: string
}

// O tipo informado pelo navegador não é confiável: todo PDF começa com %PDF-
function isPdf(file: UploadedPdf) {
  return (
    file.mimetype === 'application/pdf' &&
    file.buffer.subarray(0, 5).toString('latin1') === '%PDF-'
  )
}

// O multer entrega o nome como latin1; converte de volta para UTF-8 (acentos)
function readFileName(file: UploadedPdf) {
  return Buffer.from(file.originalname, 'latin1')
    .toString('utf8')
    .slice(0, MAX_FILE_NAME_LENGTH)
}

// Ritos: todos consultam (e baixam o PDF); só a coordenação cadastra e edita
@Controller('/rites')
export class RiteController {
  private readonly logger = new Logger(RiteController.name)

  constructor(
    private fetchRites: FetchRitesUseCase,
    private createRite: CreateRiteUseCase,
    private updateRite: UpdateRiteUseCase,
    private deleteRite: DeleteRiteUseCase,
    private addRiteFile: AddRiteFileUseCase,
    private removeRiteFile: RemoveRiteFileUseCase,
    private riteStorage: RiteStorage
  ) {}

  @Get()
  async fetchAll() {
    const response = await this.fetchRites.execute()

    return response.value?.rites.map(RitePresenter.toHTTP)
  }

  @Post()
  @Roles([Role.COORDINATOR])
  @HttpCode(201)
  async create(@Body() dto: CreateRiteRequestDto) {
    const response = await this.createRite.execute(dto)

    return RitePresenter.toHTTP(response.value!.rite)
  }

  @Put()
  @Roles([Role.COORDINATOR])
  async update(@Body() dto: UpdateRiteRequestDto) {
    const response = await this.updateRite.execute(dto)

    if (response.isLeft()) {
      throw new NotFoundException('Rito não encontrado')
    }

    return RitePresenter.toHTTP(response.value.rite)
  }

  @Delete('/:id')
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.deleteRite.execute(id)

    if (response.isLeft()) {
      throw new NotFoundException('Rito não encontrado')
    }
  }

  @Post('/:id/files')
  @Roles([Role.COORDINATOR])
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_PDF_SIZE } })
  )
  async attachFile(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file?: UploadedPdf
  ) {
    this.ensureStorageEnabled()

    if (!file) {
      throw new BadRequestException('Envie um PDF no campo "file"')
    }
    if (!isPdf(file)) {
      throw new BadRequestException('O arquivo deve ser um PDF')
    }

    try {
      const response = await this.addRiteFile.execute({
        riteId: id,
        file: { body: file.buffer, name: readFileName(file) },
      })

      if (response.isLeft()) {
        throw response.value instanceof NotAllowedError
          ? new BadRequestException(
              `Cada rito pode ter no máximo ${MAX_FILES_PER_RITE} PDFs`
            )
          : new NotFoundException('Rito não encontrado')
      }

      return RitePresenter.toHTTP(response.value.rite)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      // Falha no Supabase (bucket inexistente, chave inválida, fora do ar...)
      this.logger.error(error)
      throw new BadGatewayException(
        'Não foi possível salvar o PDF no armazenamento. Tente novamente'
      )
    }
  }

  @Delete('/:id/files/:fileId')
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async removeFile(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('fileId', ParseUUIDPipe) fileId: string
  ) {
    const response = await this.removeRiteFile.execute({ riteId: id, fileId })

    if (response.isLeft()) {
      throw new NotFoundException('Arquivo não encontrado')
    }
  }

  private ensureStorageEnabled() {
    if (!this.riteStorage.isEnabled()) {
      throw new ServiceUnavailableException(
        'Upload de arquivos não configurado no servidor'
      )
    }
  }
}
