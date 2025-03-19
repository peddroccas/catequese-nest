import { Injectable } from '@nestjs/common'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { left, right } from '@/core/either'
import { CatechistRepository } from '../repositories/catechist.repository'
import { WrongCredentialsError } from './errors/wrog-credentials-error'
import { AuthenticateCatechistRequestDto } from '../dtos/request/authenticate-catechist.dto'
import { AuthenticateCatechistResponseDto } from '../dtos/response/authenticate-catechist.dto'

@Injectable()
export class AuthenticateCatechistUseCase {
  constructor(
    private catechistRepository: CatechistRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateCatechistRequestDto): Promise<AuthenticateCatechistResponseDto> {
    const catechist = await this.catechistRepository.findByEmail(email)

    if (!catechist) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      catechist.passwordHash
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: catechist.id.toString(),
      role: catechist.role,
    })

    return right({
      accessToken,
    })
  }
}
