import { createHmac } from 'node:crypto'
import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpException,
  Logger,
  Post,
  Req,
  ServiceUnavailableException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { submitRegistrationSchema } from '@/domain/registrations/dtos/submit-registration.dto'
import {
  DOCUMENT_LABELS,
  DocumentKind,
} from '@/domain/registrations/enums/registration'
import {
  DuplicatedRegistrationError,
  MissingDocumentsError,
  RegistrationsClosedError,
  SegmentClosedError,
} from '@/domain/registrations/errors'
import { RegistrationStorage } from '@/domain/registrations/storage/registration-storage'
import {
  GetRegistrationSettingsUseCase,
  SubmitRegistrationUseCase,
  UploadedDocument,
} from '@/domain/registrations/use-cases/registration.use-cases'
import { Public } from '@/infra/auth/public'
import { EnvDTO } from '@/infra/env/env'
import {
  RegistrationStatusRateLimitGuard,
  SubmitRegistrationRateLimitGuard,
} from '../guards/rate-limit.guard'
import { registrationProtocol } from '../presenters/registration.presenter'

const MAX_DOCUMENT_SIZE = 6 * 1024 * 1024
// Corpo JSON da ficha: bem mais que o necessário, mas barra abuso
const MAX_DATA_SIZE = 20 * 1024
const MAX_FILE_NAME_LENGTH = 80

// Campo do formulário -> documento
const DOCUMENT_FIELDS: Record<string, DocumentKind> = {
  personId: DocumentKind.PERSON_ID,
  guardianId: DocumentKind.GUARDIAN_ID,
  proofOfResidence: DocumentKind.PROOF_OF_RESIDENCE,
  baptism: DocumentKind.BAPTISM,
  eucharist: DocumentKind.EUCHARIST,
  marriage: DocumentKind.MARRIAGE,
}

interface UploadedFile {
  buffer: Buffer
  originalname: string
}

type UploadedFileMap = Record<string, UploadedFile[] | undefined>

interface DetectedType {
  mimeType: string
  extension: string
}

// O tipo informado pelo navegador não é confiável: olha os primeiros bytes
function detectType(buffer: Buffer): DetectedType | null {
  const head = buffer.subarray(0, 12)

  if (head.subarray(0, 5).toString('latin1') === '%PDF-') {
    return { mimeType: 'application/pdf', extension: 'pdf' }
  }
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) {
    return { mimeType: 'image/jpeg', extension: 'jpg' }
  }
  if (
    head.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    )
  ) {
    return { mimeType: 'image/png', extension: 'png' }
  }
  if (
    head.subarray(0, 4).toString('latin1') === 'RIFF' &&
    head.subarray(8, 12).toString('latin1') === 'WEBP'
  ) {
    return { mimeType: 'image/webp', extension: 'webp' }
  }

  return null
}

// Só para exibir: o nome nunca é usado como caminho no armazenamento
function readFileName(file: UploadedFile) {
  // O multer entrega o nome como latin1; converte de volta para UTF-8
  const name = Buffer.from(file.originalname, 'latin1').toString('utf8')

  return (
    name
      .replace(/[^\p{L}\p{N} ._()-]+/gu, '')
      .trim()
      .slice(0, MAX_FILE_NAME_LENGTH) || 'documento'
  )
}

// Formulário público de inscrição: sem login, por isso o corpo é validado
// com rigor, os arquivos são conferidos pelo conteúdo e há limite de envios por IP
@Controller('/public/registrations')
@Public()
export class PublicRegistrationController {
  private readonly logger = new Logger(PublicRegistrationController.name)

  constructor(
    private submitRegistration: SubmitRegistrationUseCase,
    private getSettings: GetRegistrationSettingsUseCase,
    private registrationStorage: RegistrationStorage,
    private config: ConfigService<EnvDTO, true>
  ) {}

  // A página pública consulta antes de mostrar o formulário
  @Get('/status')
  @UseGuards(RegistrationStatusRateLimitGuard)
  async status() {
    const { settings } = (await this.getSettings.execute()).value!
    // Sem nenhuma etapa aberta, para quem vê é como se estivesse tudo fechado
    const isOpen = settings.isOpen && settings.openSegments.length > 0

    return { isOpen, openSegments: isOpen ? settings.openSegments : [] }
  }

  @Post()
  @HttpCode(201)
  @UseGuards(SubmitRegistrationRateLimitGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      Object.keys(DOCUMENT_FIELDS).map(name => ({ name, maxCount: 1 })),
      {
        limits: {
          fileSize: MAX_DOCUMENT_SIZE,
          files: Object.keys(DOCUMENT_FIELDS).length,
          fields: 2,
          parts: Object.keys(DOCUMENT_FIELDS).length + 2,
          fieldSize: MAX_DATA_SIZE,
          headerPairs: 50,
        },
      }
    )
  )
  async submit(
    @Body() body: Record<string, unknown>,
    @UploadedFiles() files: UploadedFileMap | undefined,
    @Req() request: { ip?: string }
  ) {
    if (!this.registrationStorage.isEnabled()) {
      throw new ServiceUnavailableException(
        'Envio de documentos não configurado no servidor'
      )
    }

    let raw: Record<string, unknown>
    try {
      const parsed = JSON.parse(String(body?.data ?? ''))
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('invalid')
      }
      raw = parsed
    } catch {
      throw new BadRequestException('Dados da inscrição inválidos')
    }

    // Campo-armadilha: invisível para pessoas, bots costumam preencher.
    // Responde como se tivesse dado certo, sem salvar nada
    if (typeof raw.website === 'string' && raw.website.trim() !== '') {
      return { protocol: 'XXXXXXXX' }
    }

    const parsed = submitRegistrationSchema.safeParse(raw)
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.issues.map(issue => ({
          property: issue.path.join('.'),
          message: issue.message,
        }))
      )
    }

    const documents = this.readDocuments(files ?? {})

    try {
      const response = await this.submitRegistration.execute({
        data: parsed.data,
        documents,
        submitterHash: this.hashIp(request.ip),
      })

      if (response.isLeft()) {
        const error = response.value

        if (
          error instanceof RegistrationsClosedError ||
          error instanceof SegmentClosedError
        ) {
          throw new ForbiddenException(error.message)
        }
        if (error instanceof MissingDocumentsError) {
          throw new BadRequestException(
            `Faltam documentos: ${error.missing.map(kind => DOCUMENT_LABELS[kind]).join(', ')}`
          )
        }
        if (error instanceof DuplicatedRegistrationError) {
          throw new ConflictException(error.message)
        }
        throw new BadRequestException('Não foi possível enviar a inscrição')
      }

      return { protocol: registrationProtocol(response.value.registrationId) }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      // Falha no Supabase ou no banco: o detalhe fica no log, não vai para a tela
      this.logger.error(error)
      throw new BadGatewayException(
        'Não foi possível enviar a inscrição agora. Tente novamente em instantes'
      )
    }
  }

  private readDocuments(files: UploadedFileMap): UploadedDocument[] {
    const documents: UploadedDocument[] = []

    for (const [field, kind] of Object.entries(DOCUMENT_FIELDS)) {
      const file = files[field]?.[0]
      if (!file) {
        continue
      }

      const type = detectType(file.buffer)
      if (!type) {
        throw new BadRequestException(
          `${DOCUMENT_LABELS[kind]}: envie uma foto (JPG, PNG) ou um PDF`
        )
      }

      documents.push({
        kind,
        body: file.buffer,
        mimeType: type.mimeType,
        extension: type.extension,
        originalName: readFileName(file),
      })
    }

    return documents
  }

  // Para rastrear abuso sem guardar o IP de ninguém
  private hashIp(ip?: string) {
    if (!ip) {
      return null
    }

    return createHmac('sha256', this.config.get('JWT_SECRET', { infer: true }))
      .update(ip)
      .digest('hex')
      .slice(0, 32)
  }
}
