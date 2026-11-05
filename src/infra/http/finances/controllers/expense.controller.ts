import { Role } from '@/domain/catechists/enums/role'
import {
  CreateExpenseRequestDto,
  UpdateExpenseRequestDto,
} from '@/domain/finances/dtos/request/expense.dto'
import {
  CreateExpenseUseCase,
  DeleteExpenseUseCase,
  FetchExpensesUseCase,
  UpdateExpenseUseCase,
} from '@/domain/finances/use-cases/expense.use-cases'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { Roles } from '@/infra/auth/roles.decorator'
import { UserPayload } from '@/infra/auth/token.dto'
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
import { ExpensePresenter } from '../presenters/finance.presenter'

// Saídas do caixa: só a coordenação
@Controller('/finances/expenses')
@Roles([Role.COORDINATOR])
export class ExpenseController {
  constructor(
    private fetchExpenses: FetchExpensesUseCase,
    private createExpense: CreateExpenseUseCase,
    private updateExpense: UpdateExpenseUseCase,
    private deleteExpense: DeleteExpenseUseCase
  ) {}

  @Get()
  async fetchAll() {
    const response = await this.fetchExpenses.execute()

    return response.value?.expenses.map(ExpensePresenter.toHTTP)
  }

  @Post()
  @HttpCode(201)
  async create(
    @Body() dto: CreateExpenseRequestDto,
    @CurrentUser() user: UserPayload
  ) {
    const response = await this.createExpense.execute(dto, user.sub)

    return ExpensePresenter.toHTTP(response.value!.expense)
  }

  @Put()
  async update(@Body() dto: UpdateExpenseRequestDto) {
    const response = await this.updateExpense.execute(dto)

    if (response.isLeft()) {
      throw new NotFoundException('Saída não encontrada')
    }

    return ExpensePresenter.toHTTP(response.value.expense)
  }

  @Delete('/:id')
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const response = await this.deleteExpense.execute(id)

    if (response.isLeft()) {
      throw new NotFoundException('Saída não encontrada')
    }
  }
}
