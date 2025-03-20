import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Catechizing } from '@/domain/catechizings/entities/catechizing'
import { Prisma, Catechizing as PrismaCatechizing } from '@prisma/client'

export class CatechizingMapper {
  static toDomain(raw: PrismaCatechizing): Catechizing {
    return Catechizing.create(
      {
        address: raw.address,
        birthday: new Date(raw.birthday),
        hasReceivedBaptism: raw.hasReceivedBaptism,
        hasReceivedEucharist: raw.hasReceivedEucharist,
        hasReceivedMarriage: raw.hasReceivedMarriage,
        name: raw.name,
        personWithSpecialNeeds: raw.personWithSpecialNeeds,
        parents: raw.parents,
        classroomId: new UniqueEntityID(raw.classroomId!),
        payment: raw.parents,
      },
      new UniqueEntityID(raw.id)
    )
  }
}
