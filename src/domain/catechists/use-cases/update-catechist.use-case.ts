import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { CreateCatechistRequestDto } from '../dto/request/create-catechist.dto'
import { CreateCatechistResponseDto } from '../dto/response/create-catechist.dto'
import { CatechistRepository } from '../repositories/catechist.repository'
import { left, right } from '@/core/either'
import { WrongCredentialsError } from './errors/wrog-credentials-error'
import { Catechist } from '../entities/catechist'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UpdateCatechistRequestDto } from '../dto/request/update-catechist.dto'
import { UpdateCatechistResponseDto } from '../dto/response/update-catechist.dto'
import { DuplicatedError } from '@/core/errors/errors/duplicated-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

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
        classroomId,
      },
      currentCatechist.id
    )

    await this.catechistRepository.update(catechist)

    return right(null)
  }
}
