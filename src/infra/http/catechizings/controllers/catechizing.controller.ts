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
import { ParentRequiredError } from '@/domain/catechizings/use-cases/errors/parent-required-error'
import { Roles } from '@/infra/auth/roles.decorator'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ArchiveCatechizingUseCase } from '@/domain/catechizings/use-cases/archive-catechizing.use-case'
import { RestoreCatechizingUseCase } from '@/domain/catechizings/use-cases/restore-catechizing.use-case'
import { FetchArchivedCatechizingsUseCase } from '@/domain/catechizings/use-cases/fetch-archived-catechizings.use-case'
import { RestoreCatechizingRequestDto } from '@/domain/catechizings/dtos/request/restore-catechizing.dto'
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
    private fetchCatechizingByClassroom: FetchCatechizingByClassroomUseCase,
    private archiveCatechizing: ArchiveCatechizingUseCase,
    private restoreCatechizing: RestoreCatechizingUseCase,
    private fetchArchivedCatechizings: FetchArchivedCatechizingsUseCase
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
      const error = response.value

      switch (error.constructor) {
        case ParentRequiredError:
          throw new BadRequestException(error.message)
        default:
          throw new NotFoundException('Turma não encontrada')
      }
    }

    return CatechizingPresenter.toHTTP(response.value.catechizing)
  }

  @Get()
  async fetchAll() {
    const response = await this.fetchAllCatechizings.execute()

    return response.value?.catechizings.map(CatechizingPresenter.toHTTP)
  }

  @Get('/archived')
  @Roles([Role.COORDINATOR])
  async fetchArchived() {
    const response = await this.fetchArchivedCatechizings.execute()

    return response.value?.catechizings.map(CatechizingPresenter.toHTTP)
  }

  @Patch('/:id/archive')
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async archive(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.archiveCatechizing.execute(id)

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new BadRequestException('O catequizando já está arquivado')
        default:
          throw new NotFoundException()
      }
    }
  }

  @Patch('/:id/restore')
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() restoreCatechizingRequestDto: RestoreCatechizingRequestDto
  ) {
    const response = await this.restoreCatechizing.execute(
      id,
      restoreCatechizingRequestDto
    )

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new BadRequestException('O catequizando não está arquivado')
        default:
          throw new NotFoundException()
      }
    }
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
      const error = response.value

      switch (error.constructor) {
        case ParentRequiredError:
          throw new BadRequestException(error.message)
        default:
          throw new NotFoundException(error.message)
      }
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
      const error = response.value

      switch (error.constructor) {
        case ParentRequiredError:
          throw new BadRequestException(error.message)
        default:
          throw new NotFoundException(error.message)
      }
    }

    return CatechizingPresenter.toHTTP(response.value.catechizing)
  }

  @Delete('/:id')
  @Roles([Role.COORDINATOR])
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.deleteCatechizing.execute(id)

    if (response.isLeft()) {
      const error = response.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new BadRequestException(
            'Arquive o catequizando antes de excluir'
          )
        default:
          throw new NotFoundException()
      }
    }
  }
}
