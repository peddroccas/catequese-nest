import { Role } from '@/domain/catechists/enums/role'
import {
  CreateEntryRequestDto,
  UpdateEntryRequestDto,
} from '@/domain/finances/dtos/request/entry.dto'
import {
  CreateEntryUseCase,
  DeleteEntryUseCase,
  FetchEntriesUseCase,
  UpdateEntryUseCase,
} from '@/domain/finances/use-cases/entry.use-cases'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { Roles } from '@/infra/auth/roles.decorator'
import { UserPayload } from '@/infra/auth/token.dto'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common'
import { toFinanceHttpError } from '../finance-http-error'
import { EntryPresenter } from '../presenters/finance.presenter'

// Entradas do caixa (colaboração, carnê, doação e paróquia): só a coordenação.
// Os catequistas registram só o recebimento do carnê, em /finances/carne
@Controller('/finances/entries')
@Roles([Role.COORDINATOR])
export class EntryController {
  constructor(
    private fetchEntries: FetchEntriesUseCase,
    private createEntry: CreateEntryUseCase,
    private updateEntry: UpdateEntryUseCase,
    private deleteEntry: DeleteEntryUseCase
  ) {}

  @Get()
  async fetchAll() {
    const response = await this.fetchEntries.execute()

    return response.value?.entries.map(EntryPresenter.toHTTP)
  }

  @Post()
  @HttpCode(201)
  async create(
    @Body() dto: CreateEntryRequestDto,
    @CurrentUser() user: UserPayload
  ) {
    const response = await this.createEntry.execute(dto, user.sub)

    if (response.isLeft()) {
      throw toFinanceHttpError(response.value)
    }

    return EntryPresenter.toHTTP(response.value.entry)
  }

  @Put()
  async update(@Body() dto: UpdateEntryRequestDto) {
    const response = await this.updateEntry.execute(dto)

    if (response.isLeft()) {
      throw toFinanceHttpError(response.value)
    }

    return EntryPresenter.toHTTP(response.value.entry)
  }

  @Delete('/:id')
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.deleteEntry.execute(id)

    if (response.isLeft()) {
      throw toFinanceHttpError(response.value)
    }
  }
}
