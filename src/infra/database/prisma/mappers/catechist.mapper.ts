import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Catechist } from '@/domain/catechists/entities/catechist'
import { Role } from '@/domain/catechists/enums/role'
import { Catechist as PrismaCatechist } from '@prisma/client'

export class CatechistMapper {
  static toDomain(
    raw: PrismaCatechist & { classrooms?: { id: string }[] }
  ): Catechist {
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
        classroomIds: (raw.classrooms ?? []).map(
          classroom => new UniqueEntityID(classroom.id)
        ),
        archivedAt: raw.archivedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  // archivedAt só muda pelos métodos archive/restore do repositório
  static toPrisma(catechist: Catechist): Omit<PrismaCatechist, 'archivedAt'> {
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
      id: catechist.id.toString(),
      nickname: catechist.nickname,
      role: catechist.role,
    }
  }
}
