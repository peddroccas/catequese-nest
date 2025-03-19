import { Injectable } from '@nestjs/common'
import { CatechistRepository } from '../repositories/catechist.repository'
import { right } from '@/core/either'
import { FetchAllCatechistResponseDto } from '../dtos/response/fetch-all-catechist.dto'

@Injectable()
export class FetchAllCatechistUseCase {
  constructor(private catechistRepository: CatechistRepository) {}

  async execute(): Promise<FetchAllCatechistResponseDto> {
    const catechists = await this.catechistRepository.findMany()

    return right({ catechists })
  }
}
