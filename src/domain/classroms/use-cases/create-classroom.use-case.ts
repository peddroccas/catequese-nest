import { Injectable } from '@nestjs/common'
import { ClassroomRepository } from '../repositories/classroom.repository'
import { CreateClassroomRequestDto } from '../dtos/request/create-classroom.dto'
import { Classroom } from '../entities/classroom'
import { CatechistRepository } from '@/domain/catechists/repositories/catechist.repository'
import { left } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Catechist } from '@/domain/catechists/entities/catechist'

@Injectable()
export class CreateClassroomUseCase {
  constructor(
    private classroomRepository: ClassroomRepository,
    private catechistRepository: CatechistRepository
  ) {}

  async execute({
    catechistsId,
    roomNumber,
    segment,
    startedAt,
  }: CreateClassroomRequestDto) {
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

    const classroom = Classroom.create({
      catechists,
      roomNumber,
      catechizings: [],
      segment,
      startedAt,
    })

    await this.classroomRepository.create(classroom)
  }
}
