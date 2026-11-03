import { Injectable } from '@nestjs/common'
import { CatechistRepository } from '../repositories/catechist.repository'
import { left, right } from '@/core/either'
import { Catechist } from '../entities/catechist'
import { UpdateCatechistRequestDto } from '../dtos/request/update-catechist.dto'
import { UpdateCatechistResponseDto } from '../dtos/response/update-catechist.dto'
import { DuplicatedError } from '@/core/errors/errors/duplicated-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ClassroomRepository } from '@/domain/classroms/repositories/classroom.repository'

@Injectable()
export class UpdateCatechistUseCase {
  constructor(
    private catechistRepository: CatechistRepository,
    private classroomRepository: ClassroomRepository
  ) {}

  async execute({
    id,
    address,
    birthday,
    email,
    hasReceivedBaptism,
    hasReceivedConfirmation,
    hasReceivedEucharist,
    hasReceivedMarriage,
    name,
    nickname,
    phone,
    role,
    classroomIds = [],
  }: UpdateCatechistRequestDto): Promise<UpdateCatechistResponseDto> {
    const currentCatechist = await this.catechistRepository.findById(id)

    if (!currentCatechist || currentCatechist.archivedAt) {
      return left(new ResourceNotFoundError())
    }

    const hasCatechistWithEmail =
      await this.catechistRepository.checkDuplicatedCredentials(email, id)

    if (hasCatechistWithEmail) {
      return left(new DuplicatedError())
    }

    for (const classroomId of classroomIds) {
      const classroomExists = await this.classroomRepository.exists(classroomId)

      if (!classroomExists) {
        return left(new ResourceNotFoundError())
      }
    }

    const catechist = Catechist.create(
      {
        address,
        birthday,
        email,
        hasReceivedBaptism,
        hasReceivedConfirmation,
        hasReceivedEucharist,
        hasReceivedMarriage,
        name,
        nickname,
        phone,
        role,
        password_hash: currentCatechist.passwordHash,
        classroomIds: classroomIds.map(id => new UniqueEntityID(id)),
      },
      currentCatechist.id
    )

    await this.catechistRepository.update(catechist)

    return right(null)
  }
}
