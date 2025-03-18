import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { CreateCatechistRequestDto } from '../dto/request/create-catechist.dto'
import { CreateCatechistResponseDto } from '../dto/response/create-catechist.dto'
import { CatechistRepository } from '../repositories/catechist.repository'
import { left, right } from '@/core/either'
import { Catechist } from '../entities/catechist'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DuplicatedError } from '@/core/errors/errors/duplicated-error'

@Injectable()
export class CreateCatechistUseCase {
  constructor(
    private catechistRepository: CatechistRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
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
  }: CreateCatechistRequestDto): Promise<CreateCatechistResponseDto> {
    const hasCatechistWithEmail =
      await this.catechistRepository.checkDuplicatedCredentials(email)

    if (hasCatechistWithEmail) {
      return left(new DuplicatedError())
    }

    const hashedPassword = await this.hashGenerator.hash('123456')
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
        password_hash: hashedPassword,
        classroomId: new UniqueEntityID(classroomId),
      },
      new UniqueEntityID()
    )

    await this.catechistRepository.create(catechist)

    return right({ catechist })
  }
}
