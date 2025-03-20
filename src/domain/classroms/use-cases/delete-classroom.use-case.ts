import { Injectable } from '@nestjs/common'
import { ClassroomRepository } from '../repositories/classroom.repository'
import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeleteClassroomResponseDto } from '../dtos/response/delete-classroom.dto'

@Injectable()
export class DeleteClassroomUseCase {
  constructor(private classroomRepository: ClassroomRepository) {}

  async execute(id: string): Promise<DeleteClassroomResponseDto> {
    const classroom = await this.classroomRepository.findById(id)

    if (!classroom) {
      return left(new ResourceNotFoundError())
    }

    await this.classroomRepository.delete(id)

    return right(null)
  }
}
