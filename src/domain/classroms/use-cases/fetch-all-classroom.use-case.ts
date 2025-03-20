import { Injectable } from '@nestjs/common'
import { ClassroomRepository } from '../repositories/classroom.repository'
import { right } from '@/core/either'
import { FetchAllClassroomsResponseDto } from '../dtos/response/fetch-all-classrooms.dto'

@Injectable()
export class FetchAllClassroomsUseCase {
  constructor(private classroomRepository: ClassroomRepository) {}

  async execute(): Promise<FetchAllClassroomsResponseDto> {
    const classrooms = await this.classroomRepository.findMany()

    return right({ classrooms })
  }
}
