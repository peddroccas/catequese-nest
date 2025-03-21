import { Injectable } from '@nestjs/common'
import { CatechizingRepository } from '../repositories/catechizing.repository'
import { PaymentRepository } from '../repositories/payment.repository'
import { Catechizing } from '../entities/catechizing'
import { left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UpdateCatechizingRequestDto } from '../dtos/request/update-catechizing.dto'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UpdateCatechizingResponseDto } from '../dtos/response/update-catechizing.dto'

@Injectable()
export class CreateCatechizingUseCase {
  constructor(
    private catechizingRepository: CatechizingRepository,
    private paymentRepository: PaymentRepository
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
    hasReceivedEucharist,
    parents,
    hasReceivedMarriage,
  }: UpdateCatechizingRequestDto): Promise<UpdateCatechizingResponseDto> {
    const currentCatechizing = await this.catechizingRepository.findById(id)

    if (!currentCatechizing) {
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
        classroomId: new UniqueEntityID(classroomId),
      },
      new UniqueEntityID(id)
    )

    await this.catechizingRepository.update(catechizing)

    return right({ catechizing })
  }
}
