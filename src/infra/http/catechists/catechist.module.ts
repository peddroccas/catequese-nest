import { Module } from '@nestjs/common'
import { CatechistController } from './controllers/catechist.controller'
import { CreateCatechistUseCase } from '@/domain/catechists/use-cases/create-catechist.use-case'
import { AuthenticateCatechistUseCase } from '@/domain/catechists/use-cases/authenticate-catechist.use-case'
import { DeleteCatechistUseCase } from '@/domain/catechists/use-cases/delete-catechist.use-case'
import { FetchAllCatechistsUseCase } from '@/domain/catechists/use-cases/fetch-all-catechists.use-case'
import { FetchCatechistByIdUseCase } from '@/domain/catechists/use-cases/fetch-catechist-by-id.use-case'
import { UpdateCatechistUseCase } from '@/domain/catechists/use-cases/update-catechist.use-case'
import { UpdatePasswordUseCase } from '@/domain/catechists/use-cases/update-catechist-password.use-case'
import { ResetCatechistPasswordUseCase } from '@/domain/catechists/use-cases/reset-catechist-password.use-case'

@Module({
  controllers: [CatechistController],
  providers: [
    CreateCatechistUseCase,
    AuthenticateCatechistUseCase,
    DeleteCatechistUseCase,
    FetchAllCatechistsUseCase,
    FetchCatechistByIdUseCase,
    UpdateCatechistUseCase,
    UpdatePasswordUseCase,
    ResetCatechistPasswordUseCase,
  ],
})
export class CatechistModule {}
