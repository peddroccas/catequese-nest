import { Injectable } from '@nestjs/common'
import { right } from '@/core/either'
import { CatechizingRepository } from '../repositories/catechizing.repository'
import { FetchArchivedCatechizingsResponseDto } from '../dtos/response/fetch-archived-catechizings.dto'

@Injectable()
export class FetchArchivedCatechizingsUseCase {
  constructor(private catechizingRepository: CatechizingRepository) {}

  async execute(): Promise<FetchArchivedCatechizingsResponseDto> {
    const catechizings = await this.catechizingRepository.findManyArchived()

    return right({ catechizings })
  }
}
