import { CreateCatechizingRequestDto } from '@/domain/catechizings/dtos/request/create-catechizing.dto'
import { TransferCatechizingRequestDto } from '@/domain/catechizings/dtos/request/transfer-catechizing.dto'
import { UpdateCatechizingRequestDto } from '@/domain/catechizings/dtos/request/update-catechizing.dto'
import { Role } from '@/domain/catechists/enums/role'
import { CreateCatechizingUseCase } from '@/domain/catechizings/use-cases/create-catechizing.use-case'
import { DeleteCatechizingUseCase } from '@/domain/catechizings/use-cases/delete-catechizing.use-case'
import { FetchAllCatechizingsUseCase } from '@/domain/catechizings/use-cases/fetch-all-catechizings.use-case'
import { FetchCatechizingByClassroomUseCase } from '@/domain/catechizings/use-cases/fetch-catechizing-by-classroom.use-case'
import { TransferCatechizingUseCase } from '@/domain/catechizings/use-cases/transfer-catechizing.use-case'
import { UpdateCatechizingUseCase } from '@/domain/catechizings/use-cases/update-catechizing.use-case'
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
  Patch,
  Post,
  Put,
} from '@nestjs/common'
import { CatechizingPresenter } from '../presenters/catechizing.presenter'

@Controller('/catechizings')
export class CatechizingController {
  constructor(
    private createCatechizing: CreateCatechizingUseCase,
    private updateCatechizing: UpdateCatechizingUseCase,
    private transferCatechizing: TransferCatechizingUseCase,
    private deleteCatechizing: DeleteCatechizingUseCase,
    private fetchAllCatechizings: FetchAllCatechizingsUseCase,
    private fetchCatechizingByClassroom: FetchCatechizingByClassroomUseCase
  ) {}

  @Post()
  @Roles([Role.COORDINATOR])
  @HttpCode(201)
  async create(
    @Body() createCatechizingRequestDto: CreateCatechizingRequestDto
  ) {
    const response = await this.createCatechizing.execute(
      createCatechizingRequestDto
    )

    if (response.isLeft()) {
      throw new NotFoundException('Turma não encontrada')
    }

    return CatechizingPresenter.toHTTP(response.value.catechizing)
  }

  @Get()
  async fetchAll() {
    const response = await this.fetchAllCatechizings.execute()

    return response.value?.catechizings.map(CatechizingPresenter.toHTTP)
  }

  @Get('/classroom/:classroomId')
  async fetchByClassroom(
    @Param('classroomId', ParseUUIDPipe) classroomId: string
  ) {
    const response = await this.fetchCatechizingByClassroom.execute(classroomId)

    if (response.isLeft()) {
      throw new NotFoundException()
    }

    return response.value.catechizings.map(CatechizingPresenter.toHTTP)
  }

  @Put()
  @Roles([Role.COORDINATOR])
  async update(
    @Body() updateCatechizingRequestDto: UpdateCatechizingRequestDto
  ) {
    const response = await this.updateCatechizing.execute(
      updateCatechizingRequestDto
    )

    if (response.isLeft()) {
      throw new NotFoundException()
    }

    return CatechizingPresenter.toHTTP(response.value.catechizing)
  }

  @Patch('/transfer')
  @Roles([Role.COORDINATOR])
  async transfer(
    @Body() transferCatechizingRequestDto: TransferCatechizingRequestDto
  ) {
    const response = await this.transferCatechizing.execute(
      transferCatechizingRequestDto
    )

    if (response.isLeft()) {
      throw new NotFoundException()
    }

    return CatechizingPresenter.toHTTP(response.value.catechizing)
  }

  @Delete('/:id')
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.deleteCatechizing.execute(id)

    if (response.isLeft()) {
      throw new NotFoundException()
    }
  }
}
