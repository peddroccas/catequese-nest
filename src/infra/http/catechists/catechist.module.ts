import { Module } from '@nestjs/common'
import { CatechistController } from './controllers/catechist.controller'
import { CreateCatechistUseCase } from '@/domain/catechists/use-cases/create-catechist.use-case'
import { AuthenticateCatechistUseCase } from '@/domain/catechists/use-cases/authenticate-catechist.use-case'
import { DeleteCatechistUseCase } from '@/domain/catechists/use-cases/delete-catechist.use-case'

@Module({
  controllers: [CatechistController],
  providers: [
    CreateCatechistUseCase,
    AuthenticateCatechistUseCase,
    DeleteCatechistUseCase,
  ],
})
export class CatechistModule {}
