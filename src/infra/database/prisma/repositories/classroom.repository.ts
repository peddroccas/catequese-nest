import { Classroom } from '@/domain/classroms/entities/classroom'
import { ClassroomRepository } from '@/domain/classroms/repositories/classroom.repository'
import { Segment } from '@/domain/classroms/enums/segment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ClassroomMapper } from '../mappers/classroom.mapper'

const classroomInclude = {
  catechists: { orderBy: { name: 'asc' } },
  // Catequizandos arquivados individualmente ficam fora da turma
  catechizings: {
    where: { archivedAt: null },
    include: { parents: true },
    orderBy: { name: 'asc' },
  },
} as const

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

    return ClassroomMapper.toDomain(response)
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

    return response.map(ClassroomMapper.toDomain)
  }
  async findManyArchived(): Promise<Classroom[]> {
    const response = await this.db.classroom.findMany({
      where: { archivedAt: { not: null } },
      include: classroomInclude,
      orderBy: { archivedAt: 'desc' },
    })

    return response.map(ClassroomMapper.toDomain)
  }
  async archive(id: string): Promise<void> {
    await this.db.classroom.update({
      where: { id },
      data: { archivedAt: new Date() },
    })
  }
  async restore(id: string): Promise<void> {
    await this.db.classroom.update({
      where: { id },
      data: { archivedAt: null },
    })
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
