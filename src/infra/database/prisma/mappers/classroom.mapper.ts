import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Classroom } from '@/domain/classroms/entities/classroom'
import {
  Catechist as PrismaCatechist,
  Catechizing as PrismaCatechizing,
  Parent as PrismaParent,
  Installment as PrismaInstallment,
  Payment as PrismaPayment,
} from '@prisma/client'
import { CatechistMapper } from './catechist.mapper'
import { Segment } from '@/domain/classroms/enums/segment'
import { Classroom as PrismaClassroom } from '@prisma/client'
import { Installment } from '@/domain/catechizings/entities/installment'
import { CatechizingMapper } from './catechizing.mapper'
export class ClassroomMapper {
  static toDomain(
    raw: PrismaClassroom & {
      catechists: PrismaCatechist[]
      catechizings: (PrismaCatechizing & {
        payments: (PrismaPayment & { Installments: PrismaInstallment[] })[]
        parents: PrismaParent[]
      })[]
    }
  ): Classroom {
    return Classroom.create(
      {
        catechists: raw.catechists.map(CatechistMapper.toDomain),
        catechizings: raw.catechizings.map(CatechizingMapper.toDomain),
        roomNumber: Number(raw.roomNumber),
        segment: Segment[raw.segment],
        startedAt: raw.startedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }
}
