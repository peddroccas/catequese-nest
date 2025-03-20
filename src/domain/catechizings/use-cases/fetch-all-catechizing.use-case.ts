import { Injectable } from '@nestjs/common'
import { CatechizingRepository } from '../repositories/catechizing.repository'
import { right } from '@/core/either'
import { FetchAllCatechizingResponseDto } from '../dtos/response/fetch-all-catechizing.dto'

@Injectable()
export class FetchAllCatechizingUseCase {
  constructor(private catechizingRepository: CatechizingRepository) {}

  async execute(): Promise<FetchAllCatechizingResponseDto> {
    const catechizings = await this.catechizingRepository.findMany()

    return right({ catechizings })
  }
}
