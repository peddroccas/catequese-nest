import { Injectable } from '@nestjs/common'
import { right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateParentRequestDto } from '../dtos/request/create-parent.dto'
import { Parent } from '../entities/parent'
import { PaymentRepository } from '../repositories/payment.repository'
import { Payment } from '../entities/payment'
import { BOOKLET_VALUE } from '../constants/payment'

@Injectable()
export class CreatePaymentUseCase {
  constructor(private paymentRepository: PaymentRepository) {}

  async execute(catechizingId: string) {
    const payment = Payment.create({
      catechizingId: new UniqueEntityID(catechizingId),
      hasReceivedBooklet: false,
      toBePaid: BOOKLET_VALUE,
    })
    await this.paymentRepository.create(payment)

    return right({ payment })
  }
}
