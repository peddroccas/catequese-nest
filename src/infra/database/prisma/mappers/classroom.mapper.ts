import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Classroom } from '@/domain/classroms/entities/classroom'
import { Catechist, Catechizing } from '@prisma/client'
import { CatechistMapper } from './catechist.mapper'
import { Segment } from '@/domain/classroms/enums/segment'
import { Classroom as PrismaClassroom } from '@prisma/client'
export class ClassroomMapper {
  static toDomain(raw: PrismaClassroom): Classroom {
    return Classroom.create(
      {
        catechists: raw.catechists.map(CatechistMapper.toDomain),
        catechizings: raw.catechizings[0],
        roomNumber: Number(raw.roomNumber),
        segment: Segment[raw.segment],
        startedAt: raw.startedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }
}
