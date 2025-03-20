import { Injectable } from '@nestjs/common'
import { ClassroomRepository } from '../repositories/classroom.repository'
import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { FetchClassroomByIdResponseDto } from '../dtos/response/fetch-classroom-by-id.dto'

@Injectable()
export class FetchClassroomByIdUseCase {
  constructor(private classroomRepository: ClassroomRepository) {}

  async execute(id: string): Promise<FetchClassroomByIdResponseDto> {
    const classroom = await this.classroomRepository.findById(id)

    if (!classroom) {
      return left(new ResourceNotFoundError())
    }

    return right({ classroom })
  }
}
