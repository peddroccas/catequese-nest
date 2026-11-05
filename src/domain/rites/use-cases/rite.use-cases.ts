import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import {
  CreateRiteRequestDto,
  UpdateRiteRequestDto,
} from '../dtos/request/rite.dto'
import { Rite } from '../entities/rite'
import { RiteRepository } from '../repositories/rite.repository'
import { RiteStorage } from '../storage/rite-storage'

// Máximo de PDFs por rito
export const MAX_FILES_PER_RITE = 5

// Todos os ritos valem para todas as turmas: qualquer catequista vê todos
@Injectable()
export class FetchRitesUseCase {
  constructor(private riteRepository: RiteRepository) {}

  async execute(): Promise<Either<null, { rites: Rite[] }>> {
    const rites = await this.riteRepository.findMany()

    return right({ rites })
  }
}

@Injectable()
export class CreateRiteUseCase {
  constructor(private riteRepository: RiteRepository) {}

  async execute(
    data: CreateRiteRequestDto
  ): Promise<Either<null, { rite: Rite }>> {
    const rite = Rite.create(data)

    await this.riteRepository.create(rite)

    return right({ rite })
  }
}

@Injectable()
export class UpdateRiteUseCase {
  constructor(private riteRepository: RiteRepository) {}

  async execute({
    id,
    ...data
  }: UpdateRiteRequestDto): Promise<
    Either<ResourceNotFoundError, { rite: Rite }>
  > {
    const current = await this.riteRepository.findById(id)

    if (!current) {
      return left(new ResourceNotFoundError())
    }

    // Os PDFs continuam os mesmos: só mudam ao anexar ou remover arquivos
    const rite = Rite.create({ ...data, files: current.files }, current.id)

    await this.riteRepository.update(rite)

    return right({ rite })
  }
}

@Injectable()
export class DeleteRiteUseCase {
  constructor(
    private riteRepository: RiteRepository,
    private riteStorage: RiteStorage
  ) {}

  async execute(id: string): Promise<Either<ResourceNotFoundError, null>> {
    const rite = await this.riteRepository.findById(id)

    if (!rite) {
      return left(new ResourceNotFoundError())
    }

    await this.riteRepository.delete(id)

    for (const file of rite.files) {
      await this.riteStorage.delete(file.url)
    }

    return right(null)
  }
}

interface AddRiteFileRequest {
  riteId: string
  file: { body: Buffer; name: string }
}

// Anexa mais um PDF ao rito
@Injectable()
export class AddRiteFileUseCase {
  constructor(
    private riteRepository: RiteRepository,
    private riteStorage: RiteStorage
  ) {}

  async execute({
    riteId,
    file,
  }: AddRiteFileRequest): Promise<
    Either<ResourceNotFoundError | NotAllowedError, { rite: Rite }>
  > {
    const rite = await this.riteRepository.findById(riteId)

    if (!rite) {
      return left(new ResourceNotFoundError())
    }

    if (rite.files.length >= MAX_FILES_PER_RITE) {
      return left(new NotAllowedError())
    }

    const id = randomUUID()
    const url = await this.riteStorage.upload({
      riteId,
      fileId: id,
      body: file.body,
    })

    await this.riteRepository.addFile(riteId, { id, name: file.name, url })

    const updated = await this.riteRepository.findById(riteId)

    return right({ rite: updated ?? rite })
  }
}

interface RemoveRiteFileRequest {
  riteId: string
  fileId: string
}

// Remove um dos PDFs do rito
@Injectable()
export class RemoveRiteFileUseCase {
  constructor(
    private riteRepository: RiteRepository,
    private riteStorage: RiteStorage
  ) {}

  async execute({
    riteId,
    fileId,
  }: RemoveRiteFileRequest): Promise<Either<ResourceNotFoundError, null>> {
    const rite = await this.riteRepository.findById(riteId)
    const file = rite?.files.find(item => item.id === fileId)

    if (!file) {
      return left(new ResourceNotFoundError())
    }

    await this.riteRepository.removeFile(fileId)
    await this.riteStorage.delete(file.url)

    return right(null)
  }
}
