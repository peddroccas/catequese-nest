import { Injectable } from '@nestjs/common'
import { ParentRepository } from '../repositories/parent.repository'
import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UpdateParentRequestDto } from '../dtos/request/update-parent.dto'
import { Parent } from '../entities/parent'
import { UpdateParentResponseDto } from '../dtos/response/update-parent.dto'

@Injectable()
export class UpdateParentUseCase {
  constructor(private parentRepository: ParentRepository) {}

  async execute({
    id,
    name,
    kinship,
    phone,
  }: UpdateParentRequestDto): Promise<UpdateParentResponseDto> {
    const currentParent = await this.parentRepository.findById(id)

    if (!currentParent) {
      return left(new ResourceNotFoundError())
    }

    const parent = Parent.create({
      catechizingId: currentParent.catechizingId,
      name,
      phone,
      kinship,
    })

    await this.parentRepository.update(parent)

    return right({ parent })
  }
}
