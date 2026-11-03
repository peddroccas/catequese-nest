import { Module } from '@nestjs/common'
import { FormationController } from './controllers/formation.controller'
import { CreateFormationUseCase } from '@/domain/formations/use-cases/create-formation.use-case'
import { UpdateFormationUseCase } from '@/domain/formations/use-cases/update-formation.use-case'
import { DeleteFormationUseCase } from '@/domain/formations/use-cases/delete-formation.use-case'
import { FetchAllFormationsUseCase } from '@/domain/formations/use-cases/fetch-all-formations.use-case'
import { FetchFormationByIdUseCase } from '@/domain/formations/use-cases/fetch-formation-by-id.use-case'

@Module({
  controllers: [FormationController],
  providers: [
    CreateFormationUseCase,
    UpdateFormationUseCase,
    DeleteFormationUseCase,
    FetchAllFormationsUseCase,
    FetchFormationByIdUseCase,
  ],
})
export class FormationModule {}
