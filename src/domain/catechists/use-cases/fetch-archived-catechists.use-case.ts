import { Injectable } from '@nestjs/common'
import { right } from '@/core/either'
import { CatechistRepository } from '../repositories/catechist.repository'
import { FetchArchivedCatechistsResponseDto } from '../dtos/response/fetch-archived-catechists.dto'

@Injectable()
export class FetchArchivedCatechistsUseCase {
  constructor(private catechistRepository: CatechistRepository) {}

  async execute(): Promise<FetchArchivedCatechistsResponseDto> {
    const catechists = await this.catechistRepository.findManyArchived()

    return right({ catechists })
  }
}
