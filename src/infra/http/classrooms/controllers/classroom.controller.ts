import { CreateClassroomRequestDto } from '@/domain/classroms/dtos/request/create-classroom.dto'
import { FetchAllClassroomsRequestDto } from '@/domain/classroms/dtos/request/fetch-all-classrooms.dto'
import { UpdateClassroomRequestDto } from '@/domain/classroms/dtos/request/update-classroom.dto'
import { Role } from '@/domain/catechists/enums/role'
import { CreateClassroomUseCase } from '@/domain/classroms/use-cases/create-classroom.use-case'
import { DeleteClassroomUseCase } from '@/domain/classroms/use-cases/delete-classroom.use-case'
import { FetchAllClassroomsUseCase } from '@/domain/classroms/use-cases/fetch-all-classroom.use-case'
import { FetchClassroomByIdUseCase } from '@/domain/classroms/use-cases/fetch-classroom-by-id.use-case'
import { UpdateClassroomUseCase } from '@/domain/classroms/use-cases/update-classroom.use-case'
import { Roles } from '@/infra/auth/roles.decorator'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ArchiveClassroomUseCase } from '@/domain/classroms/use-cases/archive-classroom.use-case'
import { RestoreClassroomUseCase } from '@/domain/classroms/use-cases/restore-classroom.use-case'
import { FetchArchivedClassroomsUseCase } from '@/domain/classroms/use-cases/fetch-archived-classrooms.use-case'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ClassroomPresenter } from '../presenters/classroom.presenter'
import { ClassroomDetailsPresenter } from '../presenters/classroom-details.presenter'

@Controller('/classrooms')
export class ClassroomController {
  constructor(
    private createClassroom: CreateClassroomUseCase,
    private updateClassroom: UpdateClassroomUseCase,
    private deleteClassroom: DeleteClassroomUseCase,
    private fetchAllClassrooms: FetchAllClassroomsUseCase,
    private fetchClassroomById: FetchClassroomByIdUseCase,
    private archiveClassroom: ArchiveClassroomUseCase,
    private restoreClassroom: RestoreClassroomUseCase,
    private fetchArchivedClassrooms: FetchArchivedClassroomsUseCase
  ) {}

  @Post()
  @Roles([Role.COORDINATOR])
  @HttpCode(201)
  async create(@Body() createClassroomRequestDto: CreateClassroomRequestDto) {
    const response = await this.createClassroom.execute(
      createClassroomRequestDto
    )

    if (response.isLeft()) {
      throw new NotFoundException('Catequista não encontrado')
    }

    return ClassroomPresenter.toHTTP(response.value.classroom)
  }

  @Get()
  async fetchAll(
    @Query() fetchAllClassroomsRequestDto: FetchAllClassroomsRequestDto
  ) {
    const response = await this.fetchAllClassrooms.execute(
      fetchAllClassroomsRequestDto
    )

    return response.value?.classrooms.map(ClassroomPresenter.toHTTP)
  }

  @Get('/archived')
  @Roles([Role.COORDINATOR])
  async fetchArchived() {
    const response = await this.fetchArchivedClassrooms.execute()

    return response.value?.classrooms.map(ClassroomPresenter.toHTTP)
  }

  @Patch('/:id/archive')
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async archive(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.archiveClassroom.execute(id)

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new BadRequestException('A turma já está arquivada')
        default:
          throw new NotFoundException()
      }
    }
  }

  @Patch('/:id/restore')
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.restoreClassroom.execute(id)

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new BadRequestException('A turma não está arquivada')
        default:
          throw new NotFoundException()
      }
    }
  }

  @Get('/:id')
  async fetchById(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.fetchClassroomById.execute(id)

    if (response.isLeft()) {
      throw new NotFoundException()
    }

    return ClassroomDetailsPresenter.toHTTP(response.value.classroom)
  }

  @Put()
  @Roles([Role.COORDINATOR])
  async update(@Body() updateClassroomRequestDto: UpdateClassroomRequestDto) {
    const response = await this.updateClassroom.execute(
      updateClassroomRequestDto
    )

    if (response.isLeft()) {
      throw new NotFoundException()
    }

    return ClassroomPresenter.toHTTP(response.value.classroom)
  }

  @Delete('/:id')
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.deleteClassroom.execute(id)

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new BadRequestException('Arquive a turma antes de excluir')
        default:
          throw new NotFoundException()
      }
    }
  }
}
