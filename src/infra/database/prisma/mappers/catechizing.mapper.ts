import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Catechizing } from '@/domain/catechizings/entities/catechizing'
import {
  Payment as PrismaPayment,
  Installment as PrismaInstallment,
  Parent as PrismaParent,
  Catechizing as PrismaCatechizing,
} from '@prisma/client'
import { ParentMapper } from './parents.mapper'
import { PaymentMapper } from './payment.mapper'

export class CatechizingMapper {
  static toDomain(
    raw: PrismaCatechizing & {
      payments: (PrismaPayment & { installments: PrismaInstallment[] })[]
      parents: PrismaParent[]
    }
  ): Catechizing {
    return Catechizing.create(
      {
        address: raw.address,
        birthday: new Date(raw.birthday),
        hasReceivedBaptism: raw.hasReceivedBaptism,
        hasReceivedEucharist: raw.hasReceivedEucharist,
        hasReceivedMarriage: raw.hasReceivedMarriage,
        name: raw.name,
        personWithSpecialNeeds: raw.personWithSpecialNeeds,
        parents: raw.parents.map(ParentMapper.toDomain),
        classroomId: new UniqueEntityID(raw.classroomId!),
        payment: PaymentMapper.toDomain(raw.payments[0]),
        releasedToGoAwayAlone: raw.releasedToGoAwayAlone,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(catechizing: Catechizing): PrismaCatechizing {
    return {
      address: catechizing.address,
      birthday: catechizing.birthday,
      classroomId: catechizing.classroomId.toString(),
      hasReceivedBaptism: catechizing.hasReceivedBaptism,
      hasReceivedEucharist: catechizing.hasReceivedEucharist,
      hasReceivedMarriage: catechizing.hasReceivedMarriage,
      id: catechizing.id.toString(),
      name: catechizing.name,
      personWithSpecialNeeds: catechizing.personWithSpecialNeeds,
      releasedToGoAwayAlone: catechizing.releasedToGoAwayAlone,
    }
  }
}
