import { Injectable } from '@nestjs/common'
import { left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CatechistRepository } from '@/domain/catechists/repositories/catechist.repository'
import { FormationRepository } from '../repositories/formation.repository'
import { Formation } from '../entities/formation'
import { Attendance } from '../entities/attendance'
import { CreateFormationRequestDto } from '../dtos/request/create-formation.dto'
import { CreateFormationResponseDto } from '../dtos/response/create-formation.dto'

@Injectable()
export class CreateFormationUseCase {
  constructor(
    private formationRepository: FormationRepository,
    private catechistRepository: CatechistRepository
  ) {}

  async execute({
    theme,
    instructor,
    date,
    attendances,
  }: CreateFormationRequestDto): Promise<CreateFormationResponseDto> {
    for (const { catechistId } of attendances) {
      const catechist = await this.catechistRepository.findById(catechistId)

      if (!catechist) {
        return left(new ResourceNotFoundError())
      }
    }

    const formation = Formation.create({
      theme,
      instructor: instructor ?? null,
      date,
      attendances: attendances.map(attendance =>
        Attendance.create({
          catechistId: new UniqueEntityID(attendance.catechistId),
          isPresent: attendance.isPresent,
        })
      ),
    })

    await this.formationRepository.create(formation)

    return right({ formation })
  }
}
