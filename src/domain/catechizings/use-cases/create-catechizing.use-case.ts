import { Injectable } from '@nestjs/common'
import { CatechizingRepository } from '../repositories/catechizing.repository'
import { PaymentRepository } from '../repositories/payment.repository'
import { ParentRepository } from '../repositories/parent.repository'
import { Catechizing } from '../entities/catechizing'
import { CreateCatechistRequestDto } from '@/domain/catechists/dtos/request/create-catechist.dto'
import { CreateCatechizingRequestDto } from '../dtos/request/create-catechizing.dto'
import { right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Payment } from '../entities/payment'
import { Parent } from '../entities/parent'
import { BOOKLET_VALUE } from '../constants/payment'

@Injectable()
export class CreateCatechizingUseCase {
  constructor(
    private catechizingRepository: CatechizingRepository,
    private paymentRepository: PaymentRepository,
    private parentRepository: ParentRepository
  ) {}

  async execute({
    address,
    birthday,
    hasReceivedBaptism,
    classroomId,
    name,
    parents,
    personWithSpecialNeeds,
    hasReceivedEucharist,
    hasReceivedMarriage,
  }: CreateCatechizingRequestDto) {
    const payment = Payment.create({
      catechizingId: new UniqueEntityID(),
      hasReceivedBooklet: false,
      installments: [],
      toBePaid: BOOKLET_VALUE,
    })
    const catechizing = Catechizing.create({
      address,
      birthday,
      hasReceivedBaptism,
      hasReceivedEucharist,
      hasReceivedMarriage,
      name,
      parents,
      payment,
      personWithSpecialNeeds,
      classroomId: new UniqueEntityID(classroomId),
    })

    await this.catechizingRepository.create(catechizing)

    return right({ catechizing })
  }
}
