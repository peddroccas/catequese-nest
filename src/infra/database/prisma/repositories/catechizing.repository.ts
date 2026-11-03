import { Catechizing } from '@/domain/catechizings/entities/catechizing'
import { CatechizingRepository } from '@/domain/catechizings/repositories/catechizing.repository'
import { Injectable } from '@nestjs/common'
import { CatechizingMapper } from '../mappers/catechizing.mapper'
import { ParentMapper } from '../mappers/parents.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCatechizingRepository implements CatechizingRepository {
  constructor(private db: PrismaService) {}

  async create(catechizing: Catechizing): Promise<Catechizing> {
    const data = CatechizingMapper.toPrisma(catechizing)

    await this.db.catechizing.create({
      data: {
        ...data,
        parents: {
          createMany: {
            data: catechizing.parents.map(parent => {
              const { catechizingId, ...parentData } =
                ParentMapper.toPrisma(parent)

              return parentData
            }),
          },
        },
      },
    })

    return catechizing
  }
  async delete(id: string): Promise<void> {
    await this.db.catechizing.delete({
      where: { id },
    })
  }
  async findById(id: string): Promise<Catechizing | null> {
    const response = await this.db.catechizing.findUnique({
      where: { id },
      include: { parents: true },
    })

    if (!response) {
      return null
    }

    return CatechizingMapper.toDomain(response)
  }
  async findMany(): Promise<Catechizing[]> {
    const response = await this.db.catechizing.findMany({
      where: { archivedAt: null, classroom: { archivedAt: null } },
      include: { parents: true },
      orderBy: { name: 'asc' },
    })

    return response.map(CatechizingMapper.toDomain)
  }
  async findByClassroom(classroomId: string): Promise<Catechizing[]> {
    const response = await this.db.catechizing.findMany({
      where: { classroomId, archivedAt: null },
      include: { parents: true },
      orderBy: { name: 'asc' },
    })

    return response.map(CatechizingMapper.toDomain)
  }
  async findManyArchived(): Promise<Catechizing[]> {
    const response = await this.db.catechizing.findMany({
      where: { archivedAt: { not: null } },
      include: { parents: true },
      orderBy: { archivedAt: 'desc' },
    })

    return response.map(CatechizingMapper.toDomain)
  }
  async archive(id: string): Promise<void> {
    await this.db.catechizing.update({
      where: { id },
      data: { archivedAt: new Date() },
    })
  }
  async restore(id: string, classroomId: string): Promise<void> {
    await this.db.catechizing.update({
      where: { id },
      data: { archivedAt: null, classroomId },
    })
  }
  async update(catechizing: Catechizing): Promise<Catechizing> {
    const { id, ...data } = CatechizingMapper.toPrisma(catechizing)
    const parents = catechizing.parents.map(ParentMapper.toPrisma)

    // Responsáveis que não vieram na lista são removidos; os demais são criados ou atualizados
    await this.db.$transaction([
      this.db.catechizing.update({ where: { id }, data }),
      this.db.parent.deleteMany({
        where: {
          catechizingId: id,
          id: { notIn: parents.map(parent => parent.id) },
        },
      }),
      ...parents.map(parent =>
        this.db.parent.upsert({
          where: { id: parent.id },
          create: parent,
          update: parent,
        })
      ),
    ])

    return catechizing
  }
}
