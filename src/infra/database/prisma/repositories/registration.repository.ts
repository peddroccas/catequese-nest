import { Catechizing } from '@/domain/catechizings/entities/catechizing'
import {
  NewRegistration,
  Registration,
} from '@/domain/registrations/entities/registration'
import { RegistrationStatus } from '@/domain/registrations/enums/registration'
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

  async isOpen(): Promise<boolean> {
    const settings = await this.db.registrationSettings.findUnique({
      where: { id: SETTINGS_ID },
    })

    return settings?.isOpen ?? false
  }

  async setOpen(isOpen: boolean): Promise<void> {
    await this.db.registrationSettings.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID, isOpen },
      update: { isOpen },
    })
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
