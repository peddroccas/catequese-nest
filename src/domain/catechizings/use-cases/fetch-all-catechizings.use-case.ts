import { Injectable } from '@nestjs/common'
import { CatechizingRepository } from '../repositories/catechizing.repository'
import { right } from '@/core/either'
import { FetchAllCatechizingsResponseDto } from '../dtos/response/fetch-all-catechizing.dto'

@Injectable()
export class FetchAllCatechizingsUseCase {
  constructor(private catechizingRepository: CatechizingRepository) {}

  async execute(): Promise<FetchAllCatechizingsResponseDto> {
    const catechizings = await this.catechizingRepository.findMany()

    return right({ catechizings })
  }
}
