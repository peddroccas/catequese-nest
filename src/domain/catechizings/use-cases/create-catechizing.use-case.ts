import { Injectable } from '@nestjs/common'
import { CatechizingRepository } from '../repositories/catechizing.repository'
import { Catechizing } from '../entities/catechizing'
import { CreateCatechizingRequestDto } from '../dtos/request/create-catechizing.dto'
import { right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Payment } from '../entities/payment'
import { BOOKLET_VALUE } from '../constants/payment'

@Injectable()
export class CreateCatechizingUseCase {
  constructor(private catechizingRepository: CatechizingRepository) {}

  async execute({
    address,
    birthday,
    hasReceivedBaptism,
    classroomId,
    name,
    personWithSpecialNeeds,
    hasReceivedEucharist,
    releasedToGoAwayAlone,
    hasReceivedMarriage,
  }: CreateCatechizingRequestDto) {
    const catechizing = Catechizing.create({
      address,
      birthday,
      hasReceivedBaptism,
      hasReceivedEucharist,
      hasReceivedMarriage,
      name,
      releasedToGoAwayAlone,
      personWithSpecialNeeds,
      classroomId: new UniqueEntityID(classroomId),
    })

    await this.catechizingRepository.create(catechizing)

    return right({ catechizing })
  }
}
