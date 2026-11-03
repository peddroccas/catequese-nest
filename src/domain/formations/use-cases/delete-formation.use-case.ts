import { Injectable } from '@nestjs/common'
import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { FormationRepository } from '../repositories/formation.repository'
import { DeleteFormationResponseDto } from '../dtos/response/delete-formation.dto'

@Injectable()
export class DeleteFormationUseCase {
  constructor(private formationRepository: FormationRepository) {}

  async execute(id: string): Promise<DeleteFormationResponseDto> {
    const formation = await this.formationRepository.findById(id)

    if (!formation) {
      return left(new ResourceNotFoundError())
    }

    await this.formationRepository.delete(id)

    return right(null)
  }
}
