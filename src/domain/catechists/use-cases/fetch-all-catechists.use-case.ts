import { Injectable } from '@nestjs/common'
import { CatechistRepository } from '../repositories/catechist.repository'
import { right } from '@/core/either'
import { FetchAllCatechistsResponseDto } from '../dtos/response/fetch-all-catechist.dto'

@Injectable()
export class FetchAllCatechistsUseCase {
  constructor(private catechistRepository: CatechistRepository) {}

  async execute(): Promise<FetchAllCatechistsResponseDto> {
    const catechists = await this.catechistRepository.findMany()

    return right({ catechists })
  }
}
