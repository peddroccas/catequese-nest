import { Module } from '@nestjs/common'
import {
  ApproveRegistrationUseCase,
  BuildRegistrationZipUseCase,
  FetchRegistrationByCatechizingUseCase,
  FetchRegistrationsUseCase,
  GetRegistrationDocumentUrlUseCase,
  GetRegistrationSettingsUseCase,
  RejectRegistrationUseCase,
  UpdateRegistrationSettingsUseCase,
  SubmitRegistrationUseCase,
} from '@/domain/registrations/use-cases/registration.use-cases'
import { PublicRegistrationController } from './controllers/public-registration.controller'
import { RegistrationController } from './controllers/registration.controller'
import {
  RegistrationStatusRateLimitGuard,
  SubmitRegistrationRateLimitGuard,
} from './guards/rate-limit.guard'

@Module({
  controllers: [PublicRegistrationController, RegistrationController],
  providers: [
    SubmitRegistrationUseCase,
    FetchRegistrationsUseCase,
    FetchRegistrationByCatechizingUseCase,
    GetRegistrationSettingsUseCase,
    UpdateRegistrationSettingsUseCase,
    GetRegistrationDocumentUrlUseCase,
    BuildRegistrationZipUseCase,
    ApproveRegistrationUseCase,
    RejectRegistrationUseCase,
    // Singletons: os contadores do limite ficam compartilhados entre as requisições
    SubmitRegistrationRateLimitGuard,
    RegistrationStatusRateLimitGuard,
  ],
})
export class RegistrationModule {}
