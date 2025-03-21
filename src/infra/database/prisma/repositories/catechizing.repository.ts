import { Catechizing } from '@/domain/catechizings/entities/catechizing'
import { CatechizingRepository } from '@/domain/catechizings/repositories/catechizing.repository'
import { Injectable } from '@nestjs/common'
import { CatechizingMapper } from '../mappers/catechizing.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCatechizingRepository implements CatechizingRepository {
  constructor(private db: PrismaService) {}

  async create(catechizing: Catechizing): Promise<Catechizing> {
    const data = CatechizingMapper.toPrisma(catechizing)

    const response = await this.db.catechizing.create({
      data,
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
      select: {
        id: true,
        name: true,
        address: true,
        birthday: true,
        classroomId: true,
        hasReceivedBaptism: true,
        hasReceivedEucharist: true,
        hasReceivedMarriage: true,
        personWithSpecialNeeds: true,
        releasedToGoAwayAlone: true,
        payments: {
          select: {
            toBePaid: true,
            hasReceivedBooklet: true,
            id: true,
            installments: true,
            catechizingId: true,
          },
        },
        parents: {
          select: {
            id: true,
            name: true,
            phone: true,
            kinship: true,
            catechizingId: true,
          },
        },
      },
    })

    if (!response) {
      return null
    }

    return CatechizingMapper.toDomain(response)
  }
  async findMany(): Promise<Catechizing[]> {
    const response = await this.db.catechizing.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        birthday: true,
        classroomId: true,
        hasReceivedBaptism: true,
        hasReceivedEucharist: true,
        hasReceivedMarriage: true,
        personWithSpecialNeeds: true,
        releasedToGoAwayAlone: true,
        payments: {
          select: {
            toBePaid: true,
            hasReceivedBooklet: true,
            id: true,
            installments: true,
          },
        },
        parents: {
          select: { id: true, name: true, phone: true, kinship: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    return response.map(CatechizingMapper.toDomain)
  }
  async findByClassroom(classroomId: string): Promise<Catechizing[]> {
    const response = await this.db.catechizing.findMany({
      where: { classroomId },
      select: {
        id: true,
        name: true,
        address: true,
        birthday: true,
        classroomId: true,
        hasReceivedBaptism: true,
        hasReceivedEucharist: true,
        hasReceivedMarriage: true,
        personWithSpecialNeeds: true,
        releasedToGoAwayAlone: true,
        payments: {
          select: {
            toBePaid: true,
            hasReceivedBooklet: true,
            id: true,
            installments: true,
          },
        },
        parents: {
          select: { id: true, name: true, phone: true, kinship: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    return response.map(CatechizingMapper.toDomain)
  }
  async update(catechizing: Catechizing): Promise<Catechizing> {
    const data = CatechizingMapper.toPrisma(catechizing)

    await this.db.catechizing.update({
      where: { id: catechizing.id.toString() },
      data,
    })

    return catechizing
  }
}
