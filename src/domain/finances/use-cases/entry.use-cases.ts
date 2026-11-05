import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Role } from '@/domain/catechists/enums/role'
import { CatechistRepository } from '@/domain/catechists/repositories/catechist.repository'
import { CatechizingRepository } from '@/domain/catechizings/repositories/catechizing.repository'
import {
  ClassroomAccess,
  MeetingUser,
} from '@/domain/meetings/use-cases/meeting.use-cases'
import { Injectable } from '@nestjs/common'
import { CARNE_TOTAL_CENTS } from '../constants/carne'
import {
  CarnePaymentRequestDto,
  CreateEntryRequestDto,
  UpdateEntryRequestDto,
} from '../dtos/request/entry.dto'
import { Entry } from '../entities/entry'
import { EntrySource } from '../enums/entry-source'
import { CarneLimitExceededError } from '../errors/carne-limit-exceeded-error'
import { EntryRepository } from '../repositories/entry.repository'

export type FinanceUser = MeetingUser

interface EntryData {
  source: EntrySource
  amountCents: number
  date: Date
  paymentMethod: CreateEntryRequestDto['paymentMethod']
  payerName?: string | null
  description?: string | null
  catechizingId?: string | null
}

type EntryBuildError = ResourceNotFoundError | CarneLimitExceededError

// Aplica as regras de cada origem e monta a entrada. No carnê, confere o
// catequizando e se o pagamento cabe no valor total (R$ 350,00)
@Injectable()
export class EntryBuilder {
  constructor(
    private entryRepository: EntryRepository,
    private catechizingRepository: CatechizingRepository
  ) {}

  async build(
    data: EntryData,
    createdById: string | null,
    id?: UniqueEntityID
  ): Promise<Either<EntryBuildError, Entry>> {
    const isCarne = data.source === EntrySource.CARNE

    if (isCarne) {
      const catechizing = await this.catechizingRepository.findById(
        data.catechizingId ?? ''
      )

      if (!catechizing) {
        return left(new ResourceNotFoundError())
      }

      const alreadyPaid = await this.entryRepository.sumCarnePaid(
        catechizing.id.toString(),
        id?.toString()
      )
      const remaining = Math.max(CARNE_TOTAL_CENTS - alreadyPaid, 0)

      if (data.amountCents > remaining) {
        return left(new CarneLimitExceededError(remaining))
      }
    }

    return right(
      Entry.create(
        {
          source: data.source,
          amountCents: data.amountCents,
          date: data.date,
          paymentMethod: data.paymentMethod,
          payerName: data.payerName ?? null,
          description: data.description ?? null,
          // Só o carnê é ligado a um catequizando
          catechizingId:
            isCarne && data.catechizingId
              ? new UniqueEntityID(data.catechizingId)
              : null,
          createdById,
        },
        id
      )
    )
  }
}

// Entradas (todas as origens): só a coordenação
@Injectable()
export class FetchEntriesUseCase {
  constructor(private entryRepository: EntryRepository) {}

  async execute(): Promise<Either<null, { entries: Entry[] }>> {
    const entries = await this.entryRepository.findMany()

    return right({ entries })
  }
}

@Injectable()
export class CreateEntryUseCase {
  constructor(
    private entryRepository: EntryRepository,
    private entryBuilder: EntryBuilder
  ) {}

  async execute(
    data: CreateEntryRequestDto,
    userId: string
  ): Promise<Either<EntryBuildError, { entry: Entry }>> {
    const result = await this.entryBuilder.build(data, userId)

    if (result.isLeft()) {
      return left(result.value)
    }

    await this.entryRepository.create(result.value)

    return right({ entry: result.value })
  }
}

@Injectable()
export class UpdateEntryUseCase {
  constructor(
    private entryRepository: EntryRepository,
    private entryBuilder: EntryBuilder
  ) {}

  async execute({
    id,
    ...data
  }: UpdateEntryRequestDto): Promise<
    Either<EntryBuildError, { entry: Entry }>
  > {
    const current = await this.entryRepository.findById(id)

    if (!current) {
      return left(new ResourceNotFoundError())
    }

    // Quem registrou continua sendo o mesmo
    const result = await this.entryBuilder.build(
      data,
      current.createdById,
      current.id
    )

    if (result.isLeft()) {
      return left(result.value)
    }

    await this.entryRepository.update(result.value)

    return right({ entry: result.value })
  }
}

@Injectable()
export class DeleteEntryUseCase {
  constructor(private entryRepository: EntryRepository) {}

  async execute(id: string): Promise<Either<ResourceNotFoundError, null>> {
    const entry = await this.entryRepository.findById(id)

    if (!entry) {
      return left(new ResourceNotFoundError())
    }

    await this.entryRepository.delete(id)

    return right(null)
  }
}

// Carnê: a coordenação vê todos os pagamentos; o catequista, só os dos
// catequizandos das suas turmas
@Injectable()
export class FetchCarnePaymentsUseCase {
  constructor(
    private entryRepository: EntryRepository,
    private catechistRepository: CatechistRepository
  ) {}

  async execute(
    user: FinanceUser
  ): Promise<Either<null, { entries: Entry[] }>> {
    if (user.role === Role.COORDINATOR) {
      return right({ entries: await this.entryRepository.findManyCarne() })
    }

    const catechist = await this.catechistRepository.findById(user.id)
    const classroomIds = (catechist?.classroomIds ?? []).map(id =>
      id.toString()
    )

    return right({
      entries: await this.entryRepository.findManyCarne(classroomIds),
    })
  }
}

// Recebimento do carnê: o catequista só registra de catequizandos das suas turmas
@Injectable()
export class CreateCarnePaymentUseCase {
  constructor(
    private entryRepository: EntryRepository,
    private catechizingRepository: CatechizingRepository,
    private classroomAccess: ClassroomAccess,
    private entryBuilder: EntryBuilder
  ) {}

  async execute(
    data: CarnePaymentRequestDto,
    user: FinanceUser
  ): Promise<Either<EntryBuildError | NotAllowedError, { entry: Entry }>> {
    const catechizing = await this.catechizingRepository.findById(
      data.catechizingId
    )

    if (!catechizing) {
      return left(new ResourceNotFoundError())
    }

    const canAccess = await this.classroomAccess.canAccess(
      user,
      catechizing.classroomId.toString()
    )

    if (!canAccess) {
      return left(new NotAllowedError())
    }

    const result = await this.entryBuilder.build(
      { ...data, source: EntrySource.CARNE },
      user.id
    )

    if (result.isLeft()) {
      return left(result.value)
    }

    await this.entryRepository.create(result.value)

    return right({ entry: result.value })
  }
}
