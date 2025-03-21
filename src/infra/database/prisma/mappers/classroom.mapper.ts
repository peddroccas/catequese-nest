import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Classroom } from '@/domain/classroms/entities/classroom'
import {
  Catechist as PrismaCatechist,
  Catechizing as PrismaCatechizing,
  Parent as PrismaParent,
  Installment as PrismaInstallment,
  Payment as PrismaPayment,
  Prisma,
} from '@prisma/client'
import { CatechistMapper } from './catechist.mapper'
import { Segment } from '@/domain/classroms/enums/segment'
import { Classroom as PrismaClassroom } from '@prisma/client'
import { Installment } from '@/domain/catechizings/entities/installment'
import { CatechizingMapper } from './catechizing.mapper'
import { Decimal } from '@prisma/client/runtime/library'
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

  static toPrisma(classroom: Classroom): PrismaClassroom & {
    catechists: PrismaCatechist[]
    catechizings: (PrismaCatechizing & {
      payments: (PrismaPayment & { Installments: PrismaInstallment[] })[]
      parents: PrismaParent[]
    })[]
  } {
    return {
      roomNumber: Decimal(classroom.roomNumber),
      segment: classroom.segment,
      startedAt: classroom.startedAt,
      catechists: classroom.catechists.map(CatechistMapper.toPrisma),
      id: classroom.id.toString(),
      catechizings: [],
    }
  }
}
