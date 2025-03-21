import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { left, right } from '@/core/either'
import { CatechistRepository } from '../repositories/catechist.repository'
import { UpdateCatechistPasswordRequestDto } from '../dtos/request/update-catechist-password.dto'
import { UpdateCatechistResponseDto } from '../dtos/response/update-catechist.dto'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Catechist } from '../entities/catechist'

@Injectable()
export class UpdatePasswordUseCase {
  constructor(
    private catechistRepository: CatechistRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    id,
    password,
  }: UpdateCatechistPasswordRequestDto): Promise<UpdateCatechistResponseDto> {
    const currentUser = await this.catechistRepository.findById(id)

    if (!currentUser) {
      return left(new ResourceNotFoundError())
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
        classroomId: currentUser.classroomId,
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
