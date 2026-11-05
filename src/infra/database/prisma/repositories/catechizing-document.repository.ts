import {
  CatechizingDocument,
  NewCatechizingDocument,
} from '@/domain/catechizing-documents/entities/catechizing-document'
import { CatechizingDocumentRepository } from '@/domain/catechizing-documents/repositories/catechizing-document.repository'
import { DocumentKind } from '@/domain/registrations/enums/registration'
import { Injectable } from '@nestjs/common'
import { CatechizingDocument as PrismaCatechizingDocument } from '@prisma/client'
import { PrismaService } from '../prisma.service'

function toDomain(raw: PrismaCatechizingDocument): CatechizingDocument {
  return { ...raw, kind: raw.kind as DocumentKind }
}

@Injectable()
export class PrismaCatechizingDocumentRepository
  implements CatechizingDocumentRepository
{
  constructor(private db: PrismaService) {}

  async findByCatechizing(catechizingId: string): Promise<CatechizingDocument[]> {
    const raw = await this.db.catechizingDocument.findMany({
      where: { catechizingId },
      orderBy: { createdAt: 'asc' },
    })

    return raw.map(toDomain)
  }

  async findById(id: string): Promise<CatechizingDocument | null> {
    const raw = await this.db.catechizingDocument.findUnique({ where: { id } })

    return raw ? toDomain(raw) : null
  }

  async upsert(document: NewCatechizingDocument): Promise<{
    document: CatechizingDocument
    replaced: CatechizingDocument | null
  }> {
    // Leitura e troca na mesma transação: não perde o arquivo antigo de vista
    return this.db.$transaction(async tx => {
      const previous = await tx.catechizingDocument.findUnique({
        where: {
          catechizingId_kind: {
            catechizingId: document.catechizingId,
            kind: document.kind,
          },
        },
      })

      if (previous) {
        await tx.catechizingDocument.delete({ where: { id: previous.id } })
      }

      const created = await tx.catechizingDocument.create({ data: document })

      return {
        document: toDomain(created),
        replaced: previous ? toDomain(previous) : null,
      }
    })
  }

  async delete(id: string): Promise<void> {
    await this.db.catechizingDocument.delete({ where: { id } })
  }

  async isStoragePathInUse(path: string): Promise<boolean> {
    const [inProfiles, inRegistrations] = await Promise.all([
      this.db.catechizingDocument.count({ where: { storagePath: path } }),
      this.db.registrationFile.count({ where: { storagePath: path } }),
    ])

    return inProfiles + inRegistrations > 0
  }
}
