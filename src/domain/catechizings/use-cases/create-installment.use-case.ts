import { Injectable } from '@nestjs/common'
import { InstallmentRepository } from '../repositories/installment.repository'
import { PaymentRepository } from '../repositories/payment.repository'
import { CreateInstallmentRequestDto } from '../dtos/request/create-installment.dto'
import { Installment } from '../entities/installment'
import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import dayjs from 'dayjs'
import { CreateInstallmentResponseDto } from '../dtos/response/create-installment.dto'

@Injectable()
export class CreateInstallmentUseCase {
  constructor(
    private installmentRepository: InstallmentRepository,
    private paymentRepository: PaymentRepository
  ) {}

  async execute({
    catechizingId,
    value,
  }: CreateInstallmentRequestDto): Promise<CreateInstallmentResponseDto> {
    const payment =
      await this.paymentRepository.findByCatechizing(catechizingId)

    if (!payment) {
      return left(new ResourceNotFoundError())
    }

    const now = dayjs().toDate()

    const installment = Installment.create({
      value,
      paymentId: payment.id,
      payedAt: now,
    })

    await this.installmentRepository.create(installment)
    await this.paymentRepository.updateToBePaid(
      payment.id.toString(),
      payment.toBePaid - value
    )

    return right({ installment })
  }
}
