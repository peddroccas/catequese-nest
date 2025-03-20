import { Injectable } from '@nestjs/common'
import { CatechizingRepository } from '../repositories/catechizing.repository'
import { PaymentRepository } from '../repositories/payment.repository'
import { ParentRepository } from '../repositories/parent.repository'
import { Catechizing } from '../entities/catechizing'
import { CreateCatechizingRequestDto } from '../dtos/request/create-catechizing.dto'
import { left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Payment } from '../entities/payment'
import { BOOKLET_VALUE } from '../constants/payment'
import { UpdateCatechizingRequestDto } from '../dtos/request/update-catechizing.dto'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UpdateCatechizingResponseDto } from '../dtos/response/update-catechizing.dto'
import { Parent } from '../entities/parent'

@Injectable()
export class CreateCatechizingUseCase {
  constructor(
    private catechizingRepository: CatechizingRepository,
    private paymentRepository: PaymentRepository,
    private parentRepository: ParentRepository
  ) {}

  async execute({
    id,
    address,
    birthday,
    hasReceivedBaptism,
    classroomId,
    name,
    personWithSpecialNeeds,
    hasReceivedEucharist,
    hasReceivedMarriage,
  }: UpdateCatechizingRequestDto): Promise<UpdateCatechizingResponseDto> {
    const currentCatechizing = await this.catechizingRepository.findById(id)

    if (!currentCatechizing) {
      return left(new ResourceNotFoundError())
    }

    const payment = await this.paymentRepository.findByCatechizing(id)

    const catechizing = Catechizing.create(
      {
        address,
        birthday,
        hasReceivedBaptism,
        hasReceivedEucharist,
        hasReceivedMarriage,
        name,
        parents: [],
        payment,
        personWithSpecialNeeds,
        classroomId: new UniqueEntityID(classroomId),
      },
      new UniqueEntityID(id)
    )

    await this.catechizingRepository.update(catechizing)

    return right({ catechizing })
  }
}
