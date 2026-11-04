import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { CatechistRepository } from '../repositories/catechist.repository'
import { AvatarStorage } from '../storage/avatar-storage'

interface UpdateCatechistAvatarRequest {
  catechistId: string
  // null remove a foto atual
  file: { body: Buffer; contentType: string } | null
}

type UpdateCatechistAvatarResponse = Either<
  ResourceNotFoundError,
  { avatarUrl: string | null }
>

@Injectable()
export class UpdateCatechistAvatarUseCase {
  constructor(
    private catechistRepository: CatechistRepository,
    private avatarStorage: AvatarStorage
  ) {}

  async execute({
    catechistId,
    file,
  }: UpdateCatechistAvatarRequest): Promise<UpdateCatechistAvatarResponse> {
    const catechist = await this.catechistRepository.findById(catechistId)

    if (!catechist) {
      return left(new ResourceNotFoundError())
    }

    const avatarUrl = file
      ? await this.avatarStorage.upload({ catechistId, ...file })
      : null

    await this.catechistRepository.updateAvatar(catechistId, avatarUrl)

    if (catechist.avatarUrl) {
      await this.avatarStorage.delete(catechist.avatarUrl)
    }

    return right({ avatarUrl })
  }
}
