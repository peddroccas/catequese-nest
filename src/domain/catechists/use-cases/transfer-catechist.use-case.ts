import { Injectable } from '@nestjs/common'
import { left, right } from '@/core/either'
import { CatechistRepository } from '../repositories/catechist.repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Catechist } from '../entities/catechist'
import { ClassroomRepository } from '@/domain/classroms/repositories/classroom.repository'
import { TransferCatechistRequestDto } from '../dtos/request/transfer-catechist.dto'
import { TransferCatechistResponseDto } from '../dtos/response/transfer-catechist.dto'

@Injectable()
export class TransferCatechistUseCase {
  constructor(
    private catechistRepository: CatechistRepository,
    private classroomRepository: ClassroomRepository
  ) {}

  async execute({
    id,
    classroomId,
  }: TransferCatechistRequestDto): Promise<TransferCatechistResponseDto> {
    const currentCatechist = await this.catechistRepository.findById(id)

    if (!currentCatechist) {
      return left(new ResourceNotFoundError())
    }

    const classroom = await this.classroomRepository.findById(classroomId)

    if (!classroom) {
      return left(new ResourceNotFoundError())
    }

    const catechist = Catechist.create(
      {
        name: currentCatechist.name,
        nickname: currentCatechist.nickname,
        email: currentCatechist.email,
        password_hash: currentCatechist.passwordHash,
        phone: currentCatechist.phone,
        address: currentCatechist.address,
        birthday: currentCatechist.birthday,
        classroomId: classroom.id,
        hasReceivedBaptism: currentCatechist.hasReceivedBaptism,
        hasReceivedConfirmation: currentCatechist.hasReceivedConfirmation,
        hasReceivedEucharist: currentCatechist.hasReceivedEucharist,
        hasReceivedMarriage: currentCatechist.hasReceivedMarriage,
        role: currentCatechist.role,
      },
      currentCatechist.id
    )

    await this.catechistRepository.update(catechist)

    return right(null)
  }
}
