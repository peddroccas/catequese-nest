import { Module } from '@nestjs/common'
import { ArchiveClassroomUseCase } from '@/domain/classroms/use-cases/archive-classroom.use-case'
import { RestoreClassroomUseCase } from '@/domain/classroms/use-cases/restore-classroom.use-case'
import { FetchArchivedClassroomsUseCase } from '@/domain/classroms/use-cases/fetch-archived-classrooms.use-case'
import { ClassroomController } from './controllers/classroom.controller'
import { CreateClassroomUseCase } from '@/domain/classroms/use-cases/create-classroom.use-case'
import { UpdateClassroomUseCase } from '@/domain/classroms/use-cases/update-classroom.use-case'
import { DeleteClassroomUseCase } from '@/domain/classroms/use-cases/delete-classroom.use-case'
import { FetchAllClassroomsUseCase } from '@/domain/classroms/use-cases/fetch-all-classroom.use-case'
import { FetchClassroomByIdUseCase } from '@/domain/classroms/use-cases/fetch-classroom-by-id.use-case'

@Module({
  controllers: [ClassroomController],
  providers: [
    CreateClassroomUseCase,
    UpdateClassroomUseCase,
    DeleteClassroomUseCase,
    FetchAllClassroomsUseCase,
    FetchClassroomByIdUseCase,
    ArchiveClassroomUseCase,
    RestoreClassroomUseCase,
    FetchArchivedClassroomsUseCase,
  ],
})
export class ClassroomModule {}
