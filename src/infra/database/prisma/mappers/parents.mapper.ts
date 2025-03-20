import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Parent } from '@/domain/catechizings/entities/parent'
import { Parent as PrismaParent } from '@prisma/client'

export class ParentMapper {
  static toDomain(raw: PrismaParent): Parent {
    return Parent.create(
      {
        catechizingId: new UniqueEntityID(raw.catechizingId),
        name: raw.name,
        phone: raw.phone,
        kinship: raw.kinship,
      },
      new UniqueEntityID(raw.id)
    )
  }
}
