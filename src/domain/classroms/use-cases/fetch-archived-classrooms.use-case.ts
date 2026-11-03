import { Injectable } from '@nestjs/common'
import { right } from '@/core/either'
import { ClassroomRepository } from '../repositories/classroom.repository'
import { FetchArchivedClassroomsResponseDto } from '../dtos/response/fetch-archived-classrooms.dto'

@Injectable()
export class FetchArchivedClassroomsUseCase {
  constructor(private classroomRepository: ClassroomRepository) {}

  async execute(): Promise<FetchArchivedClassroomsResponseDto> {
    const classrooms = await this.classroomRepository.findManyArchived()

    return right({ classrooms })
  }
}
