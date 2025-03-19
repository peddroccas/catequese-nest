import { Injectable } from '@nestjs/common'
import { CatechistRepository } from '../repositories/catechist.repository'
import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeleteCatechistResponseDto } from '../dtos/response/delete-catechist.dto'

@Injectable()
export class DeleteCatechistUseCase {
  constructor(private catechistRepository: CatechistRepository) {}

  async execute(id: string): Promise<DeleteCatechistResponseDto> {
    const catechist = await this.catechistRepository.findById(id)

    if (!catechist) {
      return left(new ResourceNotFoundError())
    }

    await this.catechistRepository.delete(id)

    return right(null)
  }
}
