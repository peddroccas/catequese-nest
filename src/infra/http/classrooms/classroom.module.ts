import { Module } from '@nestjs/common'
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
  ],
})
export class ClassroomModule {}
