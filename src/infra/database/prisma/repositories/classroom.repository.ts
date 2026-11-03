import { Classroom } from '@/domain/classroms/entities/classroom'
import { ClassroomRepository } from '@/domain/classroms/repositories/classroom.repository'
import { Segment } from '@/domain/classroms/enums/segment'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { ClassroomMapper } from '../mappers/classroom.mapper'

const classroomInclude = {
  catechists: { orderBy: { name: 'asc' } },
  catechizings: {
    include: { parents: true },
    orderBy: { name: 'asc' },
  },
} as const

type PrismaClassroomWithRelations = Prisma.ClassroomGetPayload<{
  include: typeof classroomInclude
}>

// Turma ativa mostra os catequizandos ativos; turma arquivada mostra os que
// foram arquivados junto com ela (mesmo archivedAt). Quem foi arquivado
// sozinho fica de fora nos dois casos.
function toDomain(raw: PrismaClassroomWithRelations) {
  return ClassroomMapper.toDomain({
    ...raw,
    catechizings: raw.catechizings.filter(
      catechizing =>
        catechizing.archivedAt?.getTime() === raw.archivedAt?.getTime()
    ),
  })
}

@Injectable()
export class PrismaClassroomRepository implements ClassroomRepository {
  constructor(private db: PrismaService) {}

  async create(classroom: Classroom): Promise<void> {
    const data = ClassroomMapper.toPrisma(classroom)

    await this.db.classroom.create({
      data: {
        ...data,
        catechists: {
          connect: classroom.catechists.map(catechist => ({
            id: catechist.id.toString(),
          })),
        },
      },
    })
  }
  async delete(id: string): Promise<void> {
    await this.db.classroom.delete({ where: { id } })
  }
  async findById(id: string): Promise<Classroom | null> {
    const response = await this.db.classroom.findUnique({
      where: { id },
      include: classroomInclude,
    })

    if (!response) {
      return null
    }

    return toDomain(response)
  }
  async exists(id: string): Promise<boolean> {
    const count = await this.db.classroom.count({
      where: { id, archivedAt: null },
    })

    return count > 0
  }
  async findMany(segment?: Segment): Promise<Classroom[]> {
    const response = await this.db.classroom.findMany({
      where: { segment, archivedAt: null },
      include: classroomInclude,
      orderBy: { location: 'asc' },
    })

    return response.map(toDomain)
  }
  async findManyArchived(): Promise<Classroom[]> {
    const response = await this.db.classroom.findMany({
      where: { archivedAt: { not: null } },
      include: classroomInclude,
      orderBy: { archivedAt: 'desc' },
    })

    return response.map(toDomain)
  }
  // Os catequizandos ativos vão para o arquivo junto, com a mesma data
  async archive(id: string): Promise<void> {
    const archivedAt = new Date()

    await this.db.$transaction([
      this.db.classroom.update({ where: { id }, data: { archivedAt } }),
      this.db.catechizing.updateMany({
        where: { classroomId: id, archivedAt: null },
        data: { archivedAt },
      }),
    ])
  }
  // Voltam só os catequizandos que foram arquivados junto com a turma
  async restore(id: string): Promise<void> {
    const classroom = await this.db.classroom.findUniqueOrThrow({
      where: { id },
      select: { archivedAt: true },
    })

    await this.db.$transaction([
      this.db.classroom.update({ where: { id }, data: { archivedAt: null } }),
      this.db.catechizing.updateMany({
        where: { classroomId: id, archivedAt: classroom.archivedAt },
        data: { archivedAt: null },
      }),
    ])
  }
  async update(classroom: Classroom): Promise<void> {
    const { id, ...data } = ClassroomMapper.toPrisma(classroom)

    // `set` substitui os catequistas da turma pelos informados
    await this.db.classroom.update({
      where: { id },
      data: {
        ...data,
        catechists: {
          set: classroom.catechists.map(catechist => ({
            id: catechist.id.toString(),
          })),
        },
      },
    })
  }
}
