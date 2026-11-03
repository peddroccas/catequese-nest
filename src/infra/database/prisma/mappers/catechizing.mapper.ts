import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Catechizing } from '@/domain/catechizings/entities/catechizing'
import {
  Parent as PrismaParent,
  Catechizing as PrismaCatechizing,
} from '@prisma/client'
import { ParentMapper } from './parents.mapper'
import { MaritalStatus } from '@/domain/catechizings/enums/marital-status'

export class CatechizingMapper {
  static toDomain(
    raw: PrismaCatechizing & { parents: PrismaParent[] }
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
        classroomId: new UniqueEntityID(raw.classroomId),
        releasedToGoAwayAlone: raw.releasedToGoAwayAlone,
        specialNeedsDescription: raw.specialNeedsDescription,
        maritalStatus: raw.maritalStatus as MaritalStatus | null,
        livesWithPartner: raw.livesWithPartner,
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
      specialNeedsDescription: catechizing.specialNeedsDescription,
      maritalStatus: catechizing.maritalStatus,
      livesWithPartner: catechizing.livesWithPartner,
    }
  }
}
