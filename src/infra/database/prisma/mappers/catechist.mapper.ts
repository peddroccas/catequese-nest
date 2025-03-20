import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Catechist } from '@/domain/catechists/entities/catechist'
import { Role } from '@/domain/catechists/enums/role'
import { Catechist as PrismaCatechist } from '@prisma/client'

export class CatechistMapper {
  static toDomain(raw: PrismaCatechist): Catechist {
    return Catechist.create(
      {
        address: raw.address,
        birthday: raw.birthday,
        email: raw.email,
        hasReceivedBaptism: raw.hasReceivedBaptism,
        hasReceivedConfirmation: raw.hasReceivedConfirmation,
        hasReceivedEucharist: raw.hasReceivedEucharist,
        hasReceivedMarriage: raw.hasReceivedMarriage,
        name: raw.name,
        nickname: raw.nickname,
        password_hash: raw.password_hash,
        phone: raw.phone,
        role: Role[raw.role],
        classroomId: new UniqueEntityID(raw.classroomId!),
      },
      new UniqueEntityID(raw.id)
    )
  }
}
