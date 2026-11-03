import { Injectable } from '@nestjs/common'
import { ADULT_SEGMENTS } from '@/domain/classroms/enums/segment'
import { ParentRequiredError } from './errors/parent-required-error'
import { CatechizingRepository } from '../repositories/catechizing.repository'
import { Catechizing } from '../entities/catechizing'
import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ClassroomRepository } from '@/domain/classroms/repositories/classroom.repository'
import { TransferCatechizingRequestDto } from '../dtos/request/transfer-catechizing.dto'
import { TransferCatechizingResponseDto } from '../dtos/response/transfer-catechizing.dto'

@Injectable()
export class TransferCatechizingUseCase {
  constructor(
    private catechizingRepository: CatechizingRepository,
    private classroomRepository: ClassroomRepository
  ) {}

  async execute({
    id,
    classroomId,
  }: TransferCatechizingRequestDto): Promise<TransferCatechizingResponseDto> {
    const currentCatechizing = await this.catechizingRepository.findById(id)

    if (!currentCatechizing || currentCatechizing.archivedAt) {
      return left(new ResourceNotFoundError())
    }

    const classroom = await this.classroomRepository.findById(classroomId)

    if (!classroom || classroom.archivedAt) {
      return left(new ResourceNotFoundError())
    }

    // Só turmas de adultos dispensam responsável
    if (
      !currentCatechizing.parents.length &&
      !ADULT_SEGMENTS.includes(classroom.segment)
    ) {
      return left(new ParentRequiredError())
    }

    const catechizing = Catechizing.create(
      {
        address: currentCatechizing.address,
        birthday: currentCatechizing.birthday,
        hasReceivedBaptism: currentCatechizing.hasReceivedBaptism,
        hasReceivedEucharist: currentCatechizing.hasReceivedEucharist,
        hasReceivedMarriage: currentCatechizing.hasReceivedMarriage,
        name: currentCatechizing.name,
        releasedToGoAwayAlone: currentCatechizing.releasedToGoAwayAlone,
        personWithSpecialNeeds: currentCatechizing.personWithSpecialNeeds,
        specialNeedsDescription: currentCatechizing.specialNeedsDescription,
        maritalStatus: currentCatechizing.maritalStatus,
        livesWithPartner: currentCatechizing.livesWithPartner,
        parents: currentCatechizing.parents,
        classroomId: classroom.id,
      },
      currentCatechizing.id
    )

    await this.catechizingRepository.update(catechizing)

    return right({ catechizing })
  }
}
