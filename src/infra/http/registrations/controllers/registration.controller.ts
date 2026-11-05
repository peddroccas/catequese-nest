import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  StreamableFile,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Role } from '@/domain/catechists/enums/role'
import { CatechizingPresenter } from '@/infra/http/catechizings/presenters/catechizing.presenter'
import {
  ApproveRegistrationRequestDto,
  RejectRegistrationRequestDto,
  UpdateRegistrationSettingsRequestDto,
} from '@/domain/registrations/dtos/registration-review.dto'
import { RegistrationStatus } from '@/domain/registrations/enums/registration'
import {
  ClassroomSegmentMismatchError,
  RegistrationNotPendingError,
} from '@/domain/registrations/errors'
import {
  ApproveRegistrationUseCase,
  BuildRegistrationZipUseCase,
  FetchRegistrationByCatechizingUseCase,
  FetchRegistrationsUseCase,
  GetRegistrationDocumentUrlUseCase,
  GetRegistrationSettingsUseCase,
  RejectRegistrationUseCase,
  UpdateRegistrationSettingsUseCase,
} from '@/domain/registrations/use-cases/registration.use-cases'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { Roles } from '@/infra/auth/roles.decorator'
import { UserPayload } from '@/infra/auth/token.dto'
import { RegistrationPresenter } from '../presenters/registration.presenter'

// Conferência das inscrições: só a coordenação vê os dados e os documentos
@Controller('/registrations')
@Roles([Role.COORDINATOR])
export class RegistrationController {
  constructor(
    private fetchRegistrations: FetchRegistrationsUseCase,
    private fetchByCatechizing: FetchRegistrationByCatechizingUseCase,
    private getSettings: GetRegistrationSettingsUseCase,
    private updateSettingsUseCase: UpdateRegistrationSettingsUseCase,
    private getDocumentUrl: GetRegistrationDocumentUrlUseCase,
    private buildZip: BuildRegistrationZipUseCase,
    private approveRegistration: ApproveRegistrationUseCase,
    private rejectRegistration: RejectRegistrationUseCase
  ) {}

  @Get()
  async fetchAll(
    @Query(
      'status',
      new ParseEnumPipe(RegistrationStatus, { optional: true })
    )
    status?: RegistrationStatus
  ) {
    const response = await this.fetchRegistrations.execute(status)

    return response.value?.registrations.map(RegistrationPresenter.toHTTP)
  }

  @Get('/settings')
  async settings() {
    const response = await this.getSettings.execute()

    return response.value!.settings
  }

  // Abre/fecha o formulário público e escolhe as etapas que recebem inscrição
  // (só muda o que vier no corpo)
  @Put('/settings')
  async updateSettings(@Body() dto: UpdateRegistrationSettingsRequestDto) {
    const response = await this.updateSettingsUseCase.execute({
      isOpen: dto.isOpen,
      openSegments: dto.openSegments,
    })

    return response.value!.settings
  }

  // Inscrição (com os documentos) de onde veio o catequizando
  @Get('/by-catechizing/:catechizingId')
  async byCatechizing(
    @Param('catechizingId', ParseUUIDPipe) catechizingId: string
  ) {
    const response = await this.fetchByCatechizing.execute(catechizingId)

    if (response.isLeft()) {
      throw new NotFoundException('Este catequizando não veio de uma inscrição')
    }

    return RegistrationPresenter.toHTTP(response.value.registration)
  }

  // Link temporário para abrir o documento (o bucket é privado)
  @Get('/:id/files/:fileId/url')
  async documentUrl(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('fileId', ParseUUIDPipe) fileId: string
  ) {
    const response = await this.getDocumentUrl.execute({
      registrationId: id,
      fileId,
    })

    if (response.isLeft()) {
      throw new NotFoundException('Documento não encontrado')
    }

    return { url: response.value.url }
  }

  @Get('/:id/documents.zip')
  async documentsZip(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.buildZip.execute(id)

    if (response.isLeft()) {
      throw new NotFoundException('Esta inscrição não tem documentos')
    }

    const { fileName, buffer } = response.value

    return new StreamableFile(buffer, {
      type: 'application/zip',
      disposition: `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    })
  }

  @Post('/:id/approve')
  @HttpCode(200)
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ApproveRegistrationRequestDto,
    @CurrentUser() user: UserPayload
  ) {
    const response = await this.approveRegistration.execute({
      registrationId: id,
      classroomId: dto.classroomId,
      reviewerId: user.sub,
    })

    if (response.isLeft()) {
      const error = response.value

      if (error instanceof RegistrationNotPendingError) {
        throw new ConflictException(error.message)
      }
      if (error instanceof ClassroomSegmentMismatchError) {
        throw new BadRequestException(error.message)
      }
      throw new NotFoundException(
        error instanceof ResourceNotFoundError
          ? 'Inscrição ou turma não encontrada'
          : undefined
      )
    }

    return CatechizingPresenter.toHTTP(response.value.catechizing)
  }

  @Post('/:id/reject')
  @HttpCode(204)
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RejectRegistrationRequestDto,
    @CurrentUser() user: UserPayload
  ) {
    const response = await this.rejectRegistration.execute({
      registrationId: id,
      reason: dto.reason.trim(),
      reviewerId: user.sub,
    })

    if (response.isLeft()) {
      if (response.value instanceof RegistrationNotPendingError) {
        throw new ConflictException(response.value.message)
      }
      throw new NotFoundException('Inscrição não encontrada')
    }
  }
}
