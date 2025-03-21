import { Module } from '@nestjs/common'
import { CatechistController } from './catechists/controllers/catechist.controller'
import { CreateCatechistUseCase } from '@/domain/catechists/use-cases/create-catechist.use-case'
import { CatechistModule } from './catechists/catechist.module'

@Module({
  imports: [CatechistModule],
})
export class HttpModule {}
