import { Rite, RiteFile } from '@/domain/rites/entities/rite'
import { RiteRepository } from '@/domain/rites/repositories/rite.repository'
import { Injectable } from '@nestjs/common'
import { RiteMapper, riteInclude } from '../mappers/rite.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaRiteRepository implements RiteRepository {
  constructor(private db: PrismaService) {}

  async create(rite: Rite): Promise<void> {
    await this.db.rite.create({ data: RiteMapper.toPrisma(rite) })
  }

  async update(rite: Rite): Promise<void> {
    const { name, description } = RiteMapper.toPrisma(rite)

    await this.db.rite.update({
      where: { id: rite.id.toString() },
      data: { name, description },
    })
  }

  async addFile(riteId: string, file: RiteFile): Promise<void> {
    await this.db.riteFile.create({ data: { ...file, riteId } })
  }

  async removeFile(fileId: string): Promise<void> {
    await this.db.riteFile.delete({ where: { id: fileId } })
  }

  async delete(id: string): Promise<void> {
    await this.db.rite.delete({ where: { id } })
  }

  async findById(id: string): Promise<Rite | null> {
    const rite = await this.db.rite.findUnique({
      where: { id },
      include: riteInclude,
    })

    return rite ? RiteMapper.toDomain(rite) : null
  }

  async findMany(): Promise<Rite[]> {
    const rites = await this.db.rite.findMany({
      include: riteInclude,
      orderBy: [{ name: 'asc' }, { createdAt: 'asc' }],
    })

    return rites.map(RiteMapper.toDomain)
  }
}
