import { Injectable } from '@nestjs/common'
import { CatechizingRepository } from '../repositories/catechizing.repository'
import { PaymentRepository } from '../repositories/payment.repository'
import { ParentRepository } from '../repositories/parent.repository'
import { Catechizing } from '../entities/catechizing'
import { left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UpdateCatechizingRequestDto } from '../dtos/request/update-catechizing.dto'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UpdateCatechizingResponseDto } from '../dtos/response/update-catechizing.dto'
import { UpdateParentRequestDto } from '../dtos/request/update-parent.dto'
import { Parent } from '../entities/parent'
import { UpdateParentResponseDto } from '../dtos/response/update-parent.dto'

@Injectable()
export class UpdateCatechizingUseCase {
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

    return right({ parent })
  }
}
