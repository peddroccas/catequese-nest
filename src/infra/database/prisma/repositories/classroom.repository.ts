import { Classroom } from '@/domain/classroms/entities/classroom'
import { ClassroomRepository } from '@/domain/classroms/repositories/classroom.repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ClassroomMapper } from '../mappers/classroom.mapper'

@Injectable()
export class PrismaClassroomRepository implements ClassroomRepository {
  constructor(private db: PrismaService) {}

  async create(classroom: Classroom): Promise<void> {
    const { startedAt, segment, roomNumber, catechists } = classroom
    await this.db.classroom.create({
      data: {
        roomNumber,
        segment,
        catechists: {
          connect: catechists.map(catechist => ({
            id: catechist.id.toString(),
          })),
        },
        startedAt,
      },
    })
  }
  async delete(id: string): Promise<void> {
    await this.db.classroom.delete({ where: { id } })
  }
  async findById(id: string): Promise<Classroom | null> {
    const response = await this.db.classroom.findUnique({
      where: { id },
      select: {
        catechizings: {
          select: {
            address: true,
            birthday: true,
            classroomId: true,
            hasReceivedBaptism: true,
            hasReceivedEucharist: true,
            hasReceivedMarriage: true,
            id: true,
            name: true,
            personWithSpecialNeeds: true,
            releasedToGoAwayAlone: true,
            payments: {
              select: {
                catechizingId: true,
                id: true,
                hasReceivedBooklet: true,
                toBePaid: true,
                installments: true,
              },
            },
            parents: true,
          },
        },
        id: true,
        segment: true,
        startedAt: true,
        roomNumber: true,
        catechists: true,
      },
    })

    if (!response) {
      return null
    }

    return ClassroomMapper.toDomain(response)
  }
  async findMany(): Promise<Classroom[]> {
    const response = await this.db.classroom.findMany({
      orderBy: { roomNumber: 'asc' },
      select: {
        catechizings: {
          select: {
            address: true,
            birthday: true,
            classroomId: true,
            hasReceivedBaptism: true,
            hasReceivedEucharist: true,
            hasReceivedMarriage: true,
            id: true,
            name: true,
            personWithSpecialNeeds: true,
            releasedToGoAwayAlone: true,
            payments: {
              select: {
                catechizingId: true,
                id: true,
                hasReceivedBooklet: true,
                toBePaid: true,
                installments: true,
              },
            },
            parents: true,
          },
        },
        id: true,
        segment: true,
        startedAt: true,
        roomNumber: true,
        catechists: true,
      },
    })

    return response.map(ClassroomMapper.toDomain)
  }
  async update(classroom: Classroom): Promise<void> {
    const data = ClassroomMapper.toPrisma(classroom)

    const currentCatechists = await this.db.classroom
      .findUnique({
        where: { id: data.id },
        select: { catechists: { select: { id: true } } },
      })
      .catechists()

    const currentCatechistIds = currentCatechists!.map(
      catechist => catechist.id
    )

    const catechistsToDisconnect = currentCatechistIds.filter(
      id =>
        !classroom.catechists.map(catechist => catechist.id.toString() === id)
    )
    await this.db.classroom.update({
      where: { id: data.id },
      data: {
        roomNumber: data.roomNumber,
        segment: data.segment,
        catechists: {
          connect: data.catechists.map(catechist => ({ id: catechist.id })),
          disconnect: catechistsToDisconnect.map(id => ({ id })),
        },
        startedAt: data.startedAt,
      },
    })
  }
}
