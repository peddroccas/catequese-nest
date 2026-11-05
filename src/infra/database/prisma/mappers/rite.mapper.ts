import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Rite } from '@/domain/rites/entities/rite'
import { Prisma, Rite as PrismaRite } from '@prisma/client'

export const riteInclude = {
  files: { orderBy: { createdAt: 'asc' } },
} satisfies Prisma.RiteInclude

type PrismaRiteWithFiles = Prisma.RiteGetPayload<{
  include: typeof riteInclude
}>

export class RiteMapper {
  static toDomain(raw: PrismaRiteWithFiles): Rite {
    return Rite.create(
      {
        name: raw.name,
        description: raw.description,
        files: raw.files.map(file => ({
          id: file.id,
          name: file.name,
          url: file.url,
        })),
      },
      new UniqueEntityID(raw.id)
    )
  }

  // createdAt é preenchido pelo banco
  static toPrisma(rite: Rite): Omit<PrismaRite, 'createdAt'> {
    return {
      id: rite.id.toString(),
      name: rite.name,
      description: rite.description,
    }
  }
}
