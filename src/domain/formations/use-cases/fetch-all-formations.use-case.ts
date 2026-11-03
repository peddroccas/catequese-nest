import { Injectable } from '@nestjs/common'
import { right } from '@/core/either'
import { FormationRepository } from '../repositories/formation.repository'
import { FetchAllFormationsResponseDto } from '../dtos/response/fetch-all-formations.dto'

@Injectable()
export class FetchAllFormationsUseCase {
  constructor(private formationRepository: FormationRepository) {}

  async execute(): Promise<FetchAllFormationsResponseDto> {
    const formations = await this.formationRepository.findMany()

    return right({ formations })
  }
}
