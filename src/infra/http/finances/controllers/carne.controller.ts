import { CarnePaymentRequestDto } from '@/domain/finances/dtos/request/entry.dto'
import { CARNE_TOTAL_CENTS } from '@/domain/finances/constants/carne'
import {
  CreateCarnePaymentUseCase,
  FetchCarnePaymentsUseCase,
} from '@/domain/finances/use-cases/entry.use-cases'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { UserPayload } from '@/infra/auth/token.dto'
import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common'
import { toFinanceHttpError } from '../finance-http-error'
import { EntryPresenter } from '../presenters/finance.presenter'

// Carnê dos catequizandos: a coordenação vê e registra de todos; o catequista,
// só dos catequizandos das suas turmas. Editar e apagar fica na coordenação
// (/finances/entries)
@Controller('/finances/carne')
export class CarneController {
  constructor(
    private fetchCarnePayments: FetchCarnePaymentsUseCase,
    private createCarnePayment: CreateCarnePaymentUseCase
  ) {}

  @Get()
  async fetchAll(@CurrentUser() user: UserPayload) {
    const response = await this.fetchCarnePayments.execute({
      id: user.sub,
      role: user.role,
    })

    return {
      totalCents: CARNE_TOTAL_CENTS,
      payments: response.value?.entries.map(EntryPresenter.toHTTP),
    }
  }

  @Post()
  @HttpCode(201)
  async create(
    @Body() dto: CarnePaymentRequestDto,
    @CurrentUser() user: UserPayload
  ) {
    const response = await this.createCarnePayment.execute(dto, {
      id: user.sub,
      role: user.role,
    })

    if (response.isLeft()) {
      throw toFinanceHttpError(response.value)
    }

    return EntryPresenter.toHTTP(response.value.entry)
  }
}
