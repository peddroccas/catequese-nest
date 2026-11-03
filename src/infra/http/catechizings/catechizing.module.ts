import { Module } from '@nestjs/common'
import { CatechizingController } from './controllers/catechizing.controller'
import { CreateCatechizingUseCase } from '@/domain/catechizings/use-cases/create-catechizing.use-case'
import { UpdateCatechizingUseCase } from '@/domain/catechizings/use-cases/update-catechizing.use-case'
import { TransferCatechizingUseCase } from '@/domain/catechizings/use-cases/transfer-catechizing.use-case'
import { DeleteCatechizingUseCase } from '@/domain/catechizings/use-cases/delete-catechizing.use-case'
import { FetchAllCatechizingsUseCase } from '@/domain/catechizings/use-cases/fetch-all-catechizings.use-case'
import { FetchCatechizingByClassroomUseCase } from '@/domain/catechizings/use-cases/fetch-catechizing-by-classroom.use-case'

@Module({
  controllers: [CatechizingController],
  providers: [
    CreateCatechizingUseCase,
    UpdateCatechizingUseCase,
    TransferCatechizingUseCase,
    DeleteCatechizingUseCase,
    FetchAllCatechizingsUseCase,
    FetchCatechizingByClassroomUseCase,
  ],
})
export class CatechizingModule {}
