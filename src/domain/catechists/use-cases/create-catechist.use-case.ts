import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { CreateCatechistRequestDto } from '../dtos/request/create-catechist.dto'
import { CreateCatechistResponseDto } from '../dtos/response/create-catechist.dto'
import { CatechistRepository } from '../repositories/catechist.repository'
import { left, right } from '@/core/either'
import { Catechist } from '../entities/catechist'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DuplicatedError } from '@/core/errors/errors/duplicated-error'
import { DEFAULT_PASSWORD } from '../constants/password'
import { ClassroomRepository } from '@/domain/classroms/repositories/classroom.repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

@Injectable()
export class CreateCatechistUseCase {
  constructor(
    private catechistRepository: CatechistRepository,
    private hashGenerator: HashGenerator,
    private classroomRepository: ClassroomRepository
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
    classroomIds = [],
  }: CreateCatechistRequestDto): Promise<CreateCatechistResponseDto> {
    const hasCatechistWithEmail =
      await this.catechistRepository.checkDuplicatedCredentials(email)

    if (hasCatechistWithEmail) {
      return left(new DuplicatedError())
    }

    for (const classroomId of classroomIds) {
      const classroomExists = await this.classroomRepository.exists(classroomId)

      if (!classroomExists) {
        return left(new ResourceNotFoundError())
      }
    }

    const hashedPassword = await this.hashGenerator.hash(DEFAULT_PASSWORD)
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
        classroomIds: classroomIds.map(id => new UniqueEntityID(id)),
      },
      new UniqueEntityID()
    )

    await this.catechistRepository.create(catechist)

    return right({ catechist })
  }
}
