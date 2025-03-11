import { Injectable } from '@nestjs/common'
import type { PrismaService } from '../prisma.service'
import type { Catechist, Prisma } from '@prisma/client'

@Injectable()
export class CatechistRepository {
  constructor(private db: PrismaService) {}

  async create(catechist: Prisma.CatechistCreateInput): Promise<Catechist> {
    return await this.db.catechist.create({ data: catechist })
  }

  async delete(id: string): Promise<void> {
    await this.db.catechist.delete({ where: { id } })
  }

  async findAll(): Promise<Catechist[]> {
    const catechists = await this.db.catechist.findMany({
      orderBy: { name: 'asc' },
    })

    return catechists
  }

  async findById(id: string): Promise<Catechist | null> {
    const catechist = await this.db.catechist.findUnique({ where: { id } })

    return catechist
  }

  async findByEmail(email: string): Promise<Catechist | null> {
    const catechist = await this.db.catechist.findUnique({ where: { email } })

    return catechist
  }

  async update(catechist: Catechist): Promise<Catechist> {
    return await this.db.catechist.update({
      where: { id: catechist.id! },
      data: {
        name: catechist.name,
        nickname: catechist.nickname,
        address: catechist.address,
        email: catechist.email,
        birthday: catechist.birthday,
        phone: catechist.phone,
        hasReceivedBaptism: catechist.hasReceivedBaptism,
        hasReceivedEucharist: catechist.hasReceivedEucharist,
        hasReceivedConfirmation: catechist.hasReceivedConfirmation,
        hasReceivedMarriage: catechist.hasReceivedMarriage,
      },
    })
  }
}
