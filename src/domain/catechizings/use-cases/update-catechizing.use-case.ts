import { Injectable } from '@nestjs/common'
import { ADULT_SEGMENTS } from '@/domain/classroms/enums/segment'
import { ParentRequiredError } from './errors/parent-required-error'
import { CatechizingRepository } from '../repositories/catechizing.repository'
import { Catechizing } from '../entities/catechizing'
import { left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UpdateCatechizingRequestDto } from '../dtos/request/update-catechizing.dto'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UpdateCatechizingResponseDto } from '../dtos/response/update-catechizing.dto'
import { ClassroomRepository } from '@/domain/classroms/repositories/classroom.repository'
import { Parent } from '../entities/parent'

@Injectable()
export class UpdateCatechizingUseCase {
  constructor(
    private catechizingRepository: CatechizingRepository,
    private classroomRepository: ClassroomRepository
  ) {}

  async execute({
    id,
    address,
    birthday,
    hasReceivedBaptism,
    classroomId,
    name,
    personWithSpecialNeeds,
    releasedToGoAwayAlone,
    specialNeedsDescription,
    maritalStatus,
    livesWithPartner,
    hasReceivedEucharist,
    parents,
    hasReceivedMarriage,
  }: UpdateCatechizingRequestDto): Promise<UpdateCatechizingResponseDto> {
    const currentCatechizing = await this.catechizingRepository.findById(id)

    if (!currentCatechizing || currentCatechizing.archivedAt) {
      return left(new ResourceNotFoundError())
    }

    const classroom = await this.classroomRepository.findById(classroomId)

    if (!classroom || classroom.archivedAt) {
      return left(new ResourceNotFoundError())
    }

    // Só turmas de adultos dispensam responsável
    const isAdult = ADULT_SEGMENTS.includes(classroom.segment)

    if (!parents.length && !isAdult) {
      return left(new ParentRequiredError())
    }

    // Responsáveis com id precisam pertencer ao catequizando; sem id são novos
    const currentParentIds = currentCatechizing.parents.map(parent =>
      parent.id.toString()
    )
    const hasUnknownParent = parents.some(
      parent => parent.id && !currentParentIds.includes(parent.id)
    )

    if (hasUnknownParent) {
      return left(new ResourceNotFoundError())
    }

    const catechizing = Catechizing.create(
      {
        address,
        birthday,
        hasReceivedBaptism,
        hasReceivedEucharist,
        hasReceivedMarriage,
        name,
        releasedToGoAwayAlone,
        personWithSpecialNeeds,
        specialNeedsDescription: personWithSpecialNeeds
          ? (specialNeedsDescription ?? null)
          : null,
        maritalStatus: isAdult ? (maritalStatus ?? null) : null,
        livesWithPartner: isAdult ? (livesWithPartner ?? null) : null,
        classroomId: classroom.id,
        parents: parents.map(parent =>
          Parent.create(
            {
              name: parent.name,
              phone: parent.phone,
              kinship: parent.kinship,
              catechizingId: currentCatechizing.id,
            },
            parent.id ? new UniqueEntityID(parent.id) : undefined
          )
        ),
      },
      currentCatechizing.id
    )

    await this.catechizingRepository.update(catechizing)

    return right({ catechizing })
  }
}
