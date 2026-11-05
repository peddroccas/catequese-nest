import { Entry } from '@/domain/finances/entities/entry'
import { EntryRepository } from '@/domain/finances/repositories/entry.repository'
import { Injectable } from '@nestjs/common'
import { EntryMapper, entryInclude } from '../mappers/finance.mapper'
import { PrismaService } from '../prisma.service'

const newestFirst = [{ date: 'desc' }, { createdAt: 'desc' }] satisfies Array<
  Record<string, 'desc'>
>

@Injectable()
export class PrismaEntryRepository implements EntryRepository {
  constructor(private db: PrismaService) {}

  async create(entry: Entry): Promise<void> {
    await this.db.cashEntry.create({ data: EntryMapper.toPrisma(entry) })
  }

  async update(entry: Entry): Promise<void> {
    const { id, ...data } = EntryMapper.toPrisma(entry)

    await this.db.cashEntry.update({ where: { id }, data })
  }

  async delete(id: string): Promise<void> {
    await this.db.cashEntry.delete({ where: { id } })
  }

  async findById(id: string): Promise<Entry | null> {
    const entry = await this.db.cashEntry.findUnique({
      where: { id },
      include: entryInclude,
    })

    return entry ? EntryMapper.toDomain(entry) : null
  }

  async findMany(): Promise<Entry[]> {
    const entries = await this.db.cashEntry.findMany({
      include: entryInclude,
      orderBy: newestFirst,
    })

    return entries.map(EntryMapper.toDomain)
  }

  async findManyCarne(classroomIds?: string[]): Promise<Entry[]> {
    const entries = await this.db.cashEntry.findMany({
      where: {
        source: 'CARNE',
        ...(classroomIds && {
          catechizing: { classroomId: { in: classroomIds } },
        }),
      },
      include: entryInclude,
      orderBy: newestFirst,
    })

    return entries.map(EntryMapper.toDomain)
  }

  async sumCarnePaid(
    catechizingId: string,
    excludeEntryId?: string
  ): Promise<number> {
    const { _sum } = await this.db.cashEntry.aggregate({
      _sum: { amountCents: true },
      where: {
        source: 'CARNE',
        catechizingId,
        ...(excludeEntryId && { id: { not: excludeEntryId } }),
      },
    })

    return _sum.amountCents ?? 0
  }
}
