import { Injectable } from '@nestjs/common'
import { left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CatechistRepository } from '../repositories/catechist.repository'
import { ArchiveCatechistResponseDto } from '../dtos/response/archive-catechist.dto'

@Injectable()
export class RestoreCatechistUseCase {
  constructor(private catechistRepository: CatechistRepository) {}

  async execute(id: string): Promise<ArchiveCatechistResponseDto> {
    const catechist = await this.catechistRepository.findById(id)

    if (!catechist) {
      return left(new ResourceNotFoundError())
    }

    if (!catechist.archivedAt) {
      return left(new NotAllowedError())
    }

    await this.catechistRepository.restore(id)

    return right(null)
  }
}
