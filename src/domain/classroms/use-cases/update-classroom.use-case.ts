import { CatechistRepository } from '@/domain/catechists/repositories/catechist.repository'
import { Injectable } from '@nestjs/common'
import { ClassroomRepository } from '../repositories/classroom.repository'
import { UpdateClassroomRequestDto } from '../dtos/request/update-classroom.dto'
import { left } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Catechist } from '@/domain/catechists/entities/catechist'
import { Classroom } from '../entities/classroom'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

@Injectable()
export class UpdateClassroomUseCase {
  constructor(
    private catechistRepository: CatechistRepository,
    private classroomRepository: ClassroomRepository
  ) {}

  async execute({
    catechistsId,
    id,
    roomNumber,
    segment,
    startedAt,
  }: UpdateClassroomRequestDto) {
    const currentClassroom = await this.classroomRepository.findById(id)

    if (!currentClassroom) {
      return left(new ResourceNotFoundError())
    }

    const catechists: Catechist[] = []

    for (const catechistId of catechistsId) {
      const catechist = await this.catechistRepository.findById(catechistId)
      if (catechist) {
        catechists.push(catechist)
      }
    }

    if (!catechists.length) {
      return left(new ResourceNotFoundError())
    }

    const classroom = Classroom.create(
      {
        catechists,
        roomNumber,
        catechizings: currentClassroom.catechizings,
        segment,
        startedAt,
      },
      new UniqueEntityID(id)
    )

    await this.classroomRepository.update(classroom)
  }
}
