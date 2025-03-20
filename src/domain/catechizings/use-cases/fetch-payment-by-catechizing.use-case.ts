import { Injectable } from '@nestjs/common'
import { PaymentRepository } from '../repositories/payment.repository'
import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { FetchPaymentByCatechizingResponseDto } from '../dtos/response/fetch-payment-by-catechizing.dto'

@Injectable()
export class FetchPaymentByCatechizingUseCase {
  constructor(private paymentRepository: PaymentRepository) {}

  async execute(
    catechizingId: string
  ): Promise<FetchPaymentByCatechizingResponseDto> {
    const payment =
      await this.paymentRepository.findByCatechizing(catechizingId)

    if (!payment) {
      return left(new ResourceNotFoundError())
    }

    return right({ payment })
  }
}
