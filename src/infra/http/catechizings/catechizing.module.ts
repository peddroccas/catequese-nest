import { Module } from '@nestjs/common'
import { ArchiveCatechizingUseCase } from '@/domain/catechizings/use-cases/archive-catechizing.use-case'
import { RestoreCatechizingUseCase } from '@/domain/catechizings/use-cases/restore-catechizing.use-case'
import { FetchArchivedCatechizingsUseCase } from '@/domain/catechizings/use-cases/fetch-archived-catechizings.use-case'
import { CatechizingController } from './controllers/catechizing.controller'
import { CatechizingDocumentController } from './controllers/catechizing-document.controller'
import {
  BuildCatechizingDocumentsZipUseCase,
  GetCatechizingDocumentUrlUseCase,
  ListCatechizingDocumentsUseCase,
  RemoveCatechizingDocumentUseCase,
  UploadCatechizingDocumentUseCase,
} from '@/domain/catechizing-documents/use-cases/catechizing-document.use-cases'
import { CreateCatechizingUseCase } from '@/domain/catechizings/use-cases/create-catechizing.use-case'
import { UpdateCatechizingUseCase } from '@/domain/catechizings/use-cases/update-catechizing.use-case'
import { TransferCatechizingUseCase } from '@/domain/catechizings/use-cases/transfer-catechizing.use-case'
import { DeleteCatechizingUseCase } from '@/domain/catechizings/use-cases/delete-catechizing.use-case'
import { FetchAllCatechizingsUseCase } from '@/domain/catechizings/use-cases/fetch-all-catechizings.use-case'
import { FetchCatechizingByClassroomUseCase } from '@/domain/catechizings/use-cases/fetch-catechizing-by-classroom.use-case'

@Module({
  controllers: [CatechizingController, CatechizingDocumentController],
  providers: [
    CreateCatechizingUseCase,
    UpdateCatechizingUseCase,
    TransferCatechizingUseCase,
    DeleteCatechizingUseCase,
    FetchAllCatechizingsUseCase,
    FetchCatechizingByClassroomUseCase,
    ArchiveCatechizingUseCase,
    RestoreCatechizingUseCase,
    FetchArchivedCatechizingsUseCase,
    ListCatechizingDocumentsUseCase,
    UploadCatechizingDocumentUseCase,
    RemoveCatechizingDocumentUseCase,
    GetCatechizingDocumentUrlUseCase,
    BuildCatechizingDocumentsZipUseCase,
  ],
})
export class CatechizingModule {}
