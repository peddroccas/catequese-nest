import { Injectable } from '@nestjs/common'
import { left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ClassroomRepository } from '@/domain/classroms/repositories/classroom.repository'
import { CatechizingRepository } from '../repositories/catechizing.repository'
import { RestoreCatechizingRequestDto } from '../dtos/request/restore-catechizing.dto'
import { ArchiveCatechizingResponseDto } from '../dtos/response/archive-catechizing.dto'

@Injectable()
export class RestoreCatechizingUseCase {
  constructor(
    private catechizingRepository: CatechizingRepository,
    private classroomRepository: ClassroomRepository
  ) {}

  async execute(
    id: string,
    { classroomId }: RestoreCatechizingRequestDto
  ): Promise<ArchiveCatechizingResponseDto> {
    const catechizing = await this.catechizingRepository.findById(id)

    if (!catechizing) {
      return left(new ResourceNotFoundError())
    }

    if (!catechizing.archivedAt) {
      return left(new NotAllowedError())
    }

    // Só volta para uma turma ativa
    const targetClassroomId = classroomId ?? catechizing.classroomId.toString()
    const classroomExists =
      await this.classroomRepository.exists(targetClassroomId)

    if (!classroomExists) {
      return left(new ResourceNotFoundError())
    }

    await this.catechizingRepository.restore(id, targetClassroomId)

    return right(null)
  }
}
