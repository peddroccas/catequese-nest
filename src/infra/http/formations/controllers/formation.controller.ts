import { CreateFormationRequestDto } from '@/domain/formations/dtos/request/create-formation.dto'
import { UpdateFormationRequestDto } from '@/domain/formations/dtos/request/update-formation.dto'
import { Role } from '@/domain/catechists/enums/role'
import { CreateFormationUseCase } from '@/domain/formations/use-cases/create-formation.use-case'
import { DeleteFormationUseCase } from '@/domain/formations/use-cases/delete-formation.use-case'
import { FetchAllFormationsUseCase } from '@/domain/formations/use-cases/fetch-all-formations.use-case'
import { FetchFormationByIdUseCase } from '@/domain/formations/use-cases/fetch-formation-by-id.use-case'
import { UpdateFormationUseCase } from '@/domain/formations/use-cases/update-formation.use-case'
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
} from '@nestjs/common'
import { FormationPresenter } from '../presenters/formation.presenter'

// Formações e chamada dos catequistas são só do coordenador
@Controller('/formations')
@Roles([Role.COORDINATOR])
export class FormationController {
  constructor(
    private createFormation: CreateFormationUseCase,
    private updateFormation: UpdateFormationUseCase,
    private deleteFormation: DeleteFormationUseCase,
    private fetchAllFormations: FetchAllFormationsUseCase,
    private fetchFormationById: FetchFormationByIdUseCase
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createFormationRequestDto: CreateFormationRequestDto) {
    const response = await this.createFormation.execute(
      createFormationRequestDto
    )

    if (response.isLeft()) {
      throw new NotFoundException('Catequista não encontrado')
    }

    return FormationPresenter.toHTTP(response.value.formation)
  }

  @Get()
  async fetchAll() {
    const response = await this.fetchAllFormations.execute()

    return response.value?.formations.map(FormationPresenter.toHTTP)
  }

  @Get('/:id')
  async fetchById(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.fetchFormationById.execute(id)

    if (response.isLeft()) {
      throw new NotFoundException()
    }

    return FormationPresenter.toHTTP(response.value.formation)
  }

  @Put()
  async update(@Body() updateFormationRequestDto: UpdateFormationRequestDto) {
    const response = await this.updateFormation.execute(
      updateFormationRequestDto
    )

    if (response.isLeft()) {
      throw new NotFoundException()
    }

    return FormationPresenter.toHTTP(response.value.formation)
  }

  @Delete('/:id')
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.deleteFormation.execute(id)

    if (response.isLeft()) {
      throw new NotFoundException()
    }
  }
}
