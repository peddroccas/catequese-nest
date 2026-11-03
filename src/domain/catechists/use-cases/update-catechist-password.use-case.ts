import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { left, right } from '@/core/either'
import { CatechistRepository } from '../repositories/catechist.repository'
import { UpdateCatechistPasswordRequestDto } from '../dtos/request/update-catechist-password.dto'
import { UpdateCatechistPasswordResponseDto } from '../dtos/response/update-catechist-password.dto'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Catechist } from '../entities/catechist'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { DEFAULT_PASSWORD } from '../constants/password'

@Injectable()
export class UpdatePasswordUseCase {
  constructor(
    private catechistRepository: CatechistRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute(
    id: string,
    { password }: UpdateCatechistPasswordRequestDto
  ): Promise<UpdateCatechistPasswordResponseDto> {
    const currentUser = await this.catechistRepository.findById(id)

    if (!currentUser) {
      return left(new ResourceNotFoundError())
    }

    if (password === DEFAULT_PASSWORD) {
      return left(new NotAllowedError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)
    const catechist = Catechist.create(
      {
        name: currentUser.name,
        nickname: currentUser.nickname,
        email: currentUser.email,
        password_hash: hashedPassword,
        phone: currentUser.phone,
        address: currentUser.address,
        birthday: currentUser.birthday,
        classroomIds: currentUser.classroomIds,
        hasReceivedBaptism: currentUser.hasReceivedBaptism,
        hasReceivedConfirmation: currentUser.hasReceivedConfirmation,
        hasReceivedEucharist: currentUser.hasReceivedEucharist,
        hasReceivedMarriage: currentUser.hasReceivedMarriage,
        role: currentUser.role,
      },
      currentUser.id
    )

    await this.catechistRepository.update(catechist)

    return right(null)
  }
}
