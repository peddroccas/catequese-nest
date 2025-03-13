import { Injectable } from '@nestjs/common'
import { CatechistRepository } from '../repositories/catechist.repository'
import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { FetchCatechistByIdResponseDto } from '../dto/response/fetch-catechist-by-id.dto'

@Injectable()
export class FetchCatechistByIdUseCase {
  constructor(private catechistRepository: CatechistRepository) {}

  async execute(id: string): Promise<FetchCatechistByIdResponseDto> {
    const catechist = await this.catechistRepository.findById(id)

    if (!catechist) {
      return left(new ResourceNotFoundError())
    }

    return right({ catechist })
  }
}
