import { Injectable } from '@nestjs/common'
import { ClassroomRepository } from '../repositories/classroom.repository'
import { left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
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

    // Excluir de vez só a partir do arquivo
    if (!classroom.archivedAt) {
      return left(new NotAllowedError())
    }

    await this.classroomRepository.delete(id)

    return right(null)
  }
}
