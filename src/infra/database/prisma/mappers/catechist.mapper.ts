import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Catechist } from '@/domain/catechists/entities/catechist'
import { Role } from '@/domain/catechists/enums/role'
import { Prisma, Catechist as PrismaCatechist } from '@prisma/client'

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

  static toPrisma(catechist: Catechist): PrismaCatechist {
    return {
      address: catechist.address,
      birthday: catechist.birthday,
      email: catechist.email,
      hasReceivedBaptism: catechist.hasReceivedBaptism,
      hasReceivedConfirmation: catechist.hasReceivedConfirmation,
      hasReceivedEucharist: catechist.hasReceivedEucharist,
      hasReceivedMarriage: catechist.hasReceivedMarriage,
      name: catechist.name,
      password_hash: catechist.passwordHash,
      phone: catechist.phone,
      classroomId: catechist.classroomId!.toString(),
      id: catechist.id.toString(),
      nickname: catechist.nickname,
      role: catechist.role,
    }
  }
}
