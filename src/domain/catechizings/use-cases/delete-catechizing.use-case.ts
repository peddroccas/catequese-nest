import { Injectable } from '@nestjs/common'
import { left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CatechizingRepository } from '../repositories/catechizing.repository'
import { DeleteCatechizingResponseDto } from '../dtos/response/delete-catechizing.dto'

@Injectable()
export class DeleteCatechizingUseCase {
  constructor(private catechizingRepository: CatechizingRepository) {}

  async execute(id: string): Promise<DeleteCatechizingResponseDto> {
    const catechizing = await this.catechizingRepository.findById(id)

    if (!catechizing) {
      return left(new ResourceNotFoundError())
    }

    // Excluir de vez só a partir do arquivo
    if (!catechizing.archivedAt) {
      return left(new NotAllowedError())
    }

    await this.catechizingRepository.delete(id)

    return right(null)
  }
}
