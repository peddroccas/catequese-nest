import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { left, right } from '@/core/either'
import { CatechistRepository } from '../repositories/catechist.repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Catechist } from '../entities/catechist'
import { DEFAULT_PASSWORD } from '../constants/password'
import { ResetCatechistPasswordResponseDto } from '../dtos/response/reset-catechist-password.dto'

@Injectable()
export class ResetCatechistPasswordUseCase {
  constructor(
    private catechistRepository: CatechistRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute(id: string): Promise<ResetCatechistPasswordResponseDto> {
    const currentCatechist = await this.catechistRepository.findById(id)

    if (!currentCatechist) {
      return left(new ResourceNotFoundError())
    }

    // Volta para a senha padrão; o catequista é obrigado a trocar no próximo login
    const hashedPassword = await this.hashGenerator.hash(DEFAULT_PASSWORD)
    const catechist = Catechist.create(
      {
        name: currentCatechist.name,
        nickname: currentCatechist.nickname,
        email: currentCatechist.email,
        password_hash: hashedPassword,
        phone: currentCatechist.phone,
        address: currentCatechist.address,
        birthday: currentCatechist.birthday,
        classroomIds: currentCatechist.classroomIds,
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
