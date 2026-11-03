import { Injectable } from '@nestjs/common'
import { left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ClassroomRepository } from '../repositories/classroom.repository'
import { ArchiveClassroomResponseDto } from '../dtos/response/archive-classroom.dto'

@Injectable()
export class RestoreClassroomUseCase {
  constructor(private classroomRepository: ClassroomRepository) {}

  async execute(id: string): Promise<ArchiveClassroomResponseDto> {
    const classroom = await this.classroomRepository.findById(id)

    if (!classroom) {
      return left(new ResourceNotFoundError())
    }

    if (!classroom.archivedAt) {
      return left(new NotAllowedError())
    }

    await this.classroomRepository.restore(id)

    return right(null)
  }
}
