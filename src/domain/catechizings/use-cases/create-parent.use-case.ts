import { Injectable } from '@nestjs/common'
import { right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ParentRepository } from '../repositories/parent.repository'
import { CreateParentRequestDto } from '../dtos/request/create-parent.dto'
import { Parent } from '../entities/parent'

@Injectable()
export class CreateParentUseCase {
  constructor(private parentRepository: ParentRepository) {}

  async execute({
    catechizingId,
    kinship,
    name,
    phone,
  }: CreateParentRequestDto) {
    const parent = Parent.create({
      catechizingId: new UniqueEntityID(catechizingId),
      kinship,
      name,
      phone,
    })
    await this.parentRepository.create(parent)

    return right({ parent })
  }
}
