import { Injectable } from '@nestjs/common'
import { CatechizingRepository } from '../repositories/catechizing.repository'
import { left, right } from '@/core/either'
import { FetchCatechizingByClassroomResponseDto } from '../dtos/response/fetch-catechizing-by-classroom.dto'
import { ClassroomRepository } from '@/domain/classroms/repositories/classroom.repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

@Injectable()
export class FetchCatechizingByIdUseCase {
  constructor(
    private catechizingRepository: CatechizingRepository,
    private classroomRepository: ClassroomRepository
  ) {}

  async execute(
    classroomId: string
  ): Promise<FetchCatechizingByClassroomResponseDto> {
    const classroom = await this.classroomRepository.findById(classroomId)

    if (!classroom) {
      return left(new ResourceNotFoundError())
    }

    const catechizings =
      await this.catechizingRepository.findByClassroom(classroomId)

    return right({ catechizings })
  }
}
