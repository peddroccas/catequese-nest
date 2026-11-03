import { CatechistRepository } from '@/domain/catechists/repositories/catechist.repository'
import { Injectable } from '@nestjs/common'
import { ClassroomRepository } from '../repositories/classroom.repository'
import { UpdateClassroomRequestDto } from '../dtos/request/update-classroom.dto'
import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Catechist } from '@/domain/catechists/entities/catechist'
import { Classroom } from '../entities/classroom'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UpdateClassroomResponseDto } from '../dtos/response/update-classroom.dto'

@Injectable()
export class UpdateClassroomUseCase {
  constructor(
    private catechistRepository: CatechistRepository,
    private classroomRepository: ClassroomRepository
  ) {}

  async execute({
    catechistsId,
    id,
    location,
    segment,
    startedAt,
  }: UpdateClassroomRequestDto): Promise<UpdateClassroomResponseDto> {
    const currentClassroom = await this.classroomRepository.findById(id)

    if (!currentClassroom) {
      return left(new ResourceNotFoundError())
    }

    const catechists: Catechist[] = []

    for (const catechistId of catechistsId) {
      const catechist = await this.catechistRepository.findById(catechistId)

      // A turma pode ficar sem catequistas, mas todo id informado precisa existir
      if (!catechist) {
        return left(new ResourceNotFoundError())
      }

      catechists.push(catechist)
    }

    const classroom = Classroom.create(
      {
        catechists,
        location,
        catechizings: currentClassroom.catechizings,
        segment,
        startedAt,
      },
      new UniqueEntityID(id)
    )

    await this.classroomRepository.update(classroom)

    return right({ classroom })
  }
}
