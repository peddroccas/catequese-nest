import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { CatechistRepository } from '@/domain/catechists/repositories/catechist.repository'
import { Catechist } from '@/domain/catechists/entities/catechist'
import { CatechistMapper } from '../mappers/catechist.mapper'

const catechistInclude = { classrooms: { select: { id: true } } } as const

@Injectable()
export class PrismaCatechistRepository implements CatechistRepository {
  constructor(private db: PrismaService) {}

  async checkDuplicatedCredentials(
    email: string,
    id?: string
  ): Promise<boolean> {
    const catechist = await this.db.catechist.findUnique({
      where: { email },
    })

    const emailAlreadyExists = Boolean(catechist) && catechist!.id !== id

    return emailAlreadyExists
  }
  async findByClassroom(classroomId: string): Promise<Catechist[]> {
    const response = await this.db.catechist.findMany({
      where: { classrooms: { some: { id: classroomId } } },
      include: catechistInclude,
    })

    return response.map(CatechistMapper.toDomain)
  }
  async findMany(): Promise<Catechist[]> {
    const response = await this.db.catechist.findMany({
      include: catechistInclude,
      orderBy: { name: 'asc' },
    })

    return response.map(CatechistMapper.toDomain)
  }

  async create(catechist: Catechist): Promise<void> {
    const data = CatechistMapper.toPrisma(catechist)

    await this.db.catechist.create({
      data: {
        ...data,
        classrooms: {
          connect: catechist.classroomIds.map(id => ({ id: id.toString() })),
        },
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.db.catechist.delete({ where: { id } })
  }

  async findById(id: string): Promise<Catechist | null> {
    const response = await this.db.catechist.findUnique({
      where: { id },
      include: catechistInclude,
    })

    if (!response) {
      return null
    }

    return CatechistMapper.toDomain(response)
  }

  async findByEmail(email: string): Promise<Catechist | null> {
    const response = await this.db.catechist.findUnique({
      where: { email },
      include: catechistInclude,
    })

    if (!response) {
      return null
    }

    return CatechistMapper.toDomain(response)
  }

  async update(catechist: Catechist): Promise<void> {
    const { id, ...data } = CatechistMapper.toPrisma(catechist)

    // `set` substitui as turmas do catequista pelas informadas
    await this.db.catechist.update({
      where: { id },
      data: {
        ...data,
        classrooms: {
          set: catechist.classroomIds.map(id => ({ id: id.toString() })),
        },
      },
    })
  }
}
