import { Injectable } from '@nestjs/common'
import { left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CatechizingRepository } from '../repositories/catechizing.repository'
import { ArchiveCatechizingResponseDto } from '../dtos/response/archive-catechizing.dto'

@Injectable()
export class ArchiveCatechizingUseCase {
  constructor(private catechizingRepository: CatechizingRepository) {}

  async execute(id: string): Promise<ArchiveCatechizingResponseDto> {
    const catechizing = await this.catechizingRepository.findById(id)

    if (!catechizing) {
      return left(new ResourceNotFoundError())
    }

    if (catechizing.archivedAt) {
      return left(new NotAllowedError())
    }

    await this.catechizingRepository.archive(id)

    return right(null)
  }
}
