import {
  AddRiteFileUseCase,
  CreateRiteUseCase,
  DeleteRiteUseCase,
  FetchRitesUseCase,
  RemoveRiteFileUseCase,
  UpdateRiteUseCase,
} from '@/domain/rites/use-cases/rite.use-cases'
import { Module } from '@nestjs/common'
import { RiteController } from './controllers/rite.controller'

@Module({
  controllers: [RiteController],
  providers: [
    FetchRitesUseCase,
    CreateRiteUseCase,
    UpdateRiteUseCase,
    DeleteRiteUseCase,
    AddRiteFileUseCase,
    RemoveRiteFileUseCase,
  ],
})
export class RiteModule {}
