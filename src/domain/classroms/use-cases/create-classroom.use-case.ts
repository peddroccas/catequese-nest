import { Injectable } from '@nestjs/common'
import { ClassroomRepository } from '../repositories/classroom.repository'
import { CreateClassroomRequestDto } from '../dtos/request/create-classroom.dto'
import { Classroom } from '../entities/classroom'
import { CatechistRepository } from '@/domain/catechists/repositories/catechist.repository'
import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Catechist } from '@/domain/catechists/entities/catechist'
import { CreateClassroomResponseDto } from '../dtos/response/create-classroom.dto'

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
  }: CreateClassroomRequestDto): Promise<CreateClassroomResponseDto> {
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

    return right({ classroom })
  }
}
