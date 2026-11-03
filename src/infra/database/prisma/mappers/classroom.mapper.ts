import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Classroom } from '@/domain/classroms/entities/classroom'
import {
  Catechist as PrismaCatechist,
  Catechizing as PrismaCatechizing,
  Parent as PrismaParent,
  Classroom as PrismaClassroom,
} from '@prisma/client'
import { CatechistMapper } from './catechist.mapper'
import { Segment } from '@/domain/classroms/enums/segment'
import { CatechizingMapper } from './catechizing.mapper'
import { Decimal } from '@prisma/client/runtime/library'

export class ClassroomMapper {
  static toDomain(
    raw: PrismaClassroom & {
      catechists: PrismaCatechist[]
      catechizings: (PrismaCatechizing & { parents: PrismaParent[] })[]
    }
  ): Classroom {
    return Classroom.create(
      {
        catechists: raw.catechists.map(CatechistMapper.toDomain),
        catechizings: raw.catechizings.map(CatechizingMapper.toDomain),
        roomNumber: Number(raw.roomNumber),
        segment: raw.segment as Segment,
        startedAt: raw.startedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(classroom: Classroom): PrismaClassroom {
    return {
      id: classroom.id.toString(),
      roomNumber: new Decimal(classroom.roomNumber),
      segment: classroom.segment,
      startedAt: classroom.startedAt,
    }
  }
}
