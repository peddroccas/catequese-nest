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
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
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
    private fetchClassroomById: FetchClassroomByIdUseCase
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
      throw new NotFoundException()
    }
  }
}
