import { Module } from '@nestjs/common'
import { CatechistController } from './controllers/catechist.controller'
import { CreateCatechistUseCase } from '@/domain/catechists/use-cases/create-catechist.use-case'

@Module({
  controllers: [CatechistController],
  providers: [CreateCatechistUseCase],
})
export class CatechistModule {}
