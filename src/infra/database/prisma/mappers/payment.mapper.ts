import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Payment } from '@/domain/catechizings/entities/payment'
import {
  Payment as PrismaPayment,
  Installment as PrismaInstallment,
} from '@prisma/client'
import { InstallmentMapper } from './installment.mapper'

export class PaymentMapper {
  static toDomain(
    raw: PrismaPayment & { Installments: PrismaInstallment[] }
  ): Payment {
    return Payment.create({
      catechizingId: new UniqueEntityID(raw.catechizingId),
      hasReceivedBooklet: raw.hasReceivedBooklet,
      installments: raw.Installments.map(InstallmentMapper.toDomain),
      toBePaid: raw.toBePaid,
    })
  }
}
