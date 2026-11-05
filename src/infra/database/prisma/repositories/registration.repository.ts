import { Catechizing } from '@/domain/catechizings/entities/catechizing'
import {
  NewRegistration,
  Registration,
  RegistrationSettings,
} from '@/domain/registrations/entities/registration'
import {
  ALL_REGISTRATION_SEGMENTS,
  RegistrationSegment,
  RegistrationStatus,
} from '@/domain/registrations/enums/registration'
import { RegistrationRepository } from '@/domain/registrations/repositories/registration.repository'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CatechizingMapper } from '../mappers/catechizing.mapper'
import { ParentMapper } from '../mappers/parents.mapper'
import {
  RegistrationMapper,
  registrationInclude,
} from '../mappers/registration.mapper'
import { PrismaService } from '../prisma.service'

// Sinaliza, dentro da transação, que a inscrição já não estava pendente
class NotPendingSignal extends Error {}

const SETTINGS_ID = 1

@Injectable()
export class PrismaRegistrationRepository implements RegistrationRepository {
  constructor(private db: PrismaService) {}

  async getSettings(): Promise<RegistrationSettings> {
    const settings = await this.db.registrationSettings.findUnique({
      where: { id: SETTINGS_ID },
    })

    return {
      isOpen: settings?.isOpen ?? false,
      openSegments: (settings?.openSegments ??
        ALL_REGISTRATION_SEGMENTS) as RegistrationSegment[],
    }
  }

  async updateSettings(
    changes: Partial<RegistrationSettings>
  ): Promise<RegistrationSettings> {
    const settings = await this.db.registrationSettings.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID, ...changes },
      update: changes,
    })

    return {
      isOpen: settings.isOpen,
      openSegments: settings.openSegments as RegistrationSegment[],
    }
  }

  async create({ files, parents, ...data }: NewRegistration): Promise<void> {
    await this.db.registration.create({
      data: {
        ...data,
        parents: parents as unknown as Prisma.InputJsonValue,
        files: { create: files },
      },
    })
  }

  async findById(id: string): Promise<Registration | null> {
    const raw = await this.db.registration.findUnique({
      where: { id },
      include: registrationInclude,
    })

    return raw ? RegistrationMapper.toDomain(raw) : null
  }

  async findMany(status?: RegistrationStatus): Promise<Registration[]> {
    const raw = await this.db.registration.findMany({
      where: status ? { status } : undefined,
      include: registrationInclude,
      orderBy: { createdAt: 'asc' },
    })

    return raw.map(RegistrationMapper.toDomain)
  }

  async findByCatechizing(catechizingId: string): Promise<Registration | null> {
    const raw = await this.db.registration.findUnique({
      where: { catechizingId },
      include: registrationInclude,
    })

    return raw ? RegistrationMapper.toDomain(raw) : null
  }

  async existsActive(name: string, birthday: Date): Promise<boolean> {
    const count = await this.db.registration.count({
      where: {
        name: { equals: name, mode: 'insensitive' },
        birthday,
        status: { in: ['PENDING', 'APPROVED'] },
      },
    })

    return count > 0
  }

  async approve({
    registrationId,
    reviewerId,
    catechizing,
  }: {
    registrationId: string
    reviewerId: string
    catechizing: Catechizing
  }): Promise<boolean> {
    const data = CatechizingMapper.toPrisma(catechizing)

    try {
      // Catequizando e aprovação juntos: ou os dois acontecem, ou nenhum
      await this.db.$transaction(async tx => {
        await tx.catechizing.create({
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

        // Os documentos da inscrição passam para o perfil (só as linhas: os
        // arquivos continuam onde estão no armazenamento)
        const files = await tx.registrationFile.findMany({
          where: { registrationId },
        })
        if (files.length) {
          await tx.catechizingDocument.createMany({
            data: files.map(file => ({
              id: file.id,
              kind: file.kind,
              storagePath: file.storagePath,
              originalName: file.originalName,
              mimeType: file.mimeType,
              sizeBytes: file.sizeBytes,
              catechizingId: data.id,
            })),
          })
        }

        // Só aprova se ainda estiver pendente (duas pessoas aprovando juntas)
        const updated = await tx.registration.updateMany({
          where: { id: registrationId, status: 'PENDING' },
          data: {
            status: 'APPROVED',
            reviewedAt: new Date(),
            reviewedById: reviewerId,
            catechizingId: data.id,
            rejectionReason: null,
          },
        })

        if (updated.count === 0) {
          throw new NotPendingSignal()
        }
      })

      return true
    } catch (error) {
      if (error instanceof NotPendingSignal) {
        return false
      }
      throw error
    }
  }

  async reject({
    registrationId,
    reviewerId,
    reason,
  }: {
    registrationId: string
    reviewerId: string
    reason: string
  }): Promise<boolean> {
    const updated = await this.db.registration.updateMany({
      where: { id: registrationId, status: 'PENDING' },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
        reviewedAt: new Date(),
        reviewedById: reviewerId,
      },
    })

    return updated.count > 0
  }
}
