import { Injectable } from '@nestjs/common'
import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { FormationRepository } from '../repositories/formation.repository'
import { FetchFormationByIdResponseDto } from '../dtos/response/fetch-formation-by-id.dto'

@Injectable()
export class FetchFormationByIdUseCase {
  constructor(private formationRepository: FormationRepository) {}

  async execute(id: string): Promise<FetchFormationByIdResponseDto> {
    const formation = await this.formationRepository.findById(id)

    if (!formation) {
      return left(new ResourceNotFoundError())
    }

    return right({ formation })
  }
}
