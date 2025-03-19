import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { CatechistRepository } from '../repositories/catechist.repository'
import { left, right } from '@/core/either'
import { Catechist } from '../entities/catechist'
import { UpdateCatechistRequestDto } from '../dtos/request/update-catechist.dto'
import { UpdateCatechistResponseDto } from '../dtos/response/update-catechist.dto'
import { DuplicatedError } from '@/core/errors/errors/duplicated-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

@Injectable()
export class UpdateCatechistUseCase {
  constructor(
    private catechistRepository: CatechistRepository,
    private hashGenerator: HashGenerator
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
    classroomId,
  }: UpdateCatechistRequestDto): Promise<UpdateCatechistResponseDto> {
    const currentCatechist = await this.catechistRepository.findById(id)

    if (!currentCatechist) {
      return left(new ResourceNotFoundError())
    }

    const hasCatechistWithEmail =
      await this.catechistRepository.checkDuplicatedCredentials(email, id)

    if (hasCatechistWithEmail) {
      return left(new DuplicatedError())
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
        classroomId: new UniqueEntityID(classroomId),
      },
      currentCatechist.id
    )

    await this.catechistRepository.update(catechist)

    return right(null)
  }
}
