import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Installment } from '@/domain/catechizings/entities/installment'
import { Installment as PrismaInstallment } from '@prisma/client'

export class InstallmentMapper {
  static toDomain(raw: PrismaInstallment): Installment {
    return Installment.create(
      {
        payedAt: raw.payedAt,
        paymentId: new UniqueEntityID(raw.paymentId),
        value: raw.value,
      },
      new UniqueEntityID(raw.id)
    )
  }
}
