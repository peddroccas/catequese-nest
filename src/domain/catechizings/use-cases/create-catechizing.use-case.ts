import { Injectable } from '@nestjs/common'
import { ADULT_SEGMENTS } from '@/domain/classroms/enums/segment'
import { ParentRequiredError } from './errors/parent-required-error'
import { CatechizingRepository } from '../repositories/catechizing.repository'
import { Catechizing } from '../entities/catechizing'
import { CreateCatechizingRequestDto } from '../dtos/request/create-catechizing.dto'
import { left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Parent } from '../entities/parent'
import { ClassroomRepository } from '@/domain/classroms/repositories/classroom.repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CreateCatechizingResponseDto } from '../dtos/response/create-catechizing.dto'

@Injectable()
export class CreateCatechizingUseCase {
  constructor(
    private catechizingRepository: CatechizingRepository,
    private classroomRepository: ClassroomRepository
  ) {}

  async execute({
    address,
    birthday,
    hasReceivedBaptism,
    classroomId,
    name,
    personWithSpecialNeeds,
    hasReceivedEucharist,
    releasedToGoAwayAlone,
    specialNeedsDescription,
    maritalStatus,
    livesWithPartner,
    hasReceivedMarriage,
    shirtSize,
    foodRestriction,
    pickupAuthorizedBy,
    parents,
  }: CreateCatechizingRequestDto): Promise<CreateCatechizingResponseDto> {
    const classroom = await this.classroomRepository.findById(classroomId)

    if (!classroom || classroom.archivedAt) {
      return left(new ResourceNotFoundError())
    }

    // Só turmas de adultos dispensam responsável
    const isAdult = ADULT_SEGMENTS.includes(classroom.segment)

    if (!parents.length && !isAdult) {
      return left(new ParentRequiredError())
    }

    const catechizingId = new UniqueEntityID()

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
        shirtSize: shirtSize || null,
        foodRestriction: foodRestriction || null,
        pickupAuthorizedBy: pickupAuthorizedBy || null,
        classroomId: classroom.id,
        parents: parents.map(parent =>
          Parent.create({
            name: parent.name,
            phone: parent.phone,
            kinship: parent.kinship,
            catechizingId,
          })
        ),
      },
      catechizingId
    )

    await this.catechizingRepository.create(catechizing)

    return right({ catechizing })
  }
}
