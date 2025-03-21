import { Injectable } from '@nestjs/common'
import type { PrismaService } from '../prisma.service'
import type { Prisma } from '@prisma/client'
import { CatechistRepository } from '@/domain/catechists/repositories/catechist.repository'
import { Catechist } from '@/domain/catechists/entities/catechist'
import { CatechistMapper } from '../mappers/catechist.mapper'

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
      where: { classroomId },
    })

    return response.map(CatechistMapper.toDomain)
  }
  async findMany(): Promise<Catechist[]> {
    const response = await this.db.catechist.findMany({
      orderBy: { name: 'asc' },
    })

    return response.map(CatechistMapper.toDomain)
  }

  async create(catechist: Catechist): Promise<void> {
    const data = CatechistMapper.toPrisma(catechist)

    await this.db.catechist.create({ data })
  }

  async delete(id: string): Promise<void> {
    await this.db.catechist.delete({ where: { id } })
  }

  async findAll(): Promise<Catechist[]> {
    const response = await this.db.catechist.findMany({
      orderBy: { name: 'asc' },
    })

    return response.map(CatechistMapper.toDomain)
  }

  async findById(id: string): Promise<Catechist | null> {
    const response = await this.db.catechist.findUnique({ where: { id } })

    if (!response) {
      return null
    }

    return CatechistMapper.toDomain(response)
  }

  async findByEmail(email: string): Promise<Catechist | null> {
    const response = await this.db.catechist.findUnique({ where: { email } })

    if (!response) {
      return null
    }

    return CatechistMapper.toDomain(response)
  }

  async update(catechist: Catechist): Promise<void> {
    const data = CatechistMapper.toPrisma(catechist)

    await this.db.catechist.update({
      where: { id: catechist.id.toString() },
      data,
    })
  }
}
