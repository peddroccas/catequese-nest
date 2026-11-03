import { Injectable } from '@nestjs/common'
import { left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CatechistRepository } from '@/domain/catechists/repositories/catechist.repository'
import { FormationRepository } from '../repositories/formation.repository'
import { Formation } from '../entities/formation'
import { Attendance } from '../entities/attendance'
import { UpdateFormationRequestDto } from '../dtos/request/update-formation.dto'
import { UpdateFormationResponseDto } from '../dtos/response/update-formation.dto'

@Injectable()
export class UpdateFormationUseCase {
  constructor(
    private formationRepository: FormationRepository,
    private catechistRepository: CatechistRepository
  ) {}

  async execute({
    id,
    theme,
    date,
    attendances,
  }: UpdateFormationRequestDto): Promise<UpdateFormationResponseDto> {
    const currentFormation = await this.formationRepository.findById(id)

    if (!currentFormation) {
      return left(new ResourceNotFoundError())
    }

    for (const { catechistId } of attendances) {
      const catechist = await this.catechistRepository.findById(catechistId)

      if (!catechist) {
        return left(new ResourceNotFoundError())
      }
    }

    const formation = Formation.create(
      {
        theme,
        date,
        attendances: attendances.map(attendance =>
          Attendance.create({
            catechistId: new UniqueEntityID(attendance.catechistId),
            isPresent: attendance.isPresent,
          })
        ),
      },
      currentFormation.id
    )

    await this.formationRepository.update(formation)

    return right({ formation })
  }
}
