import { Either } from '@/core/either'
import { Classroom } from '../../entities/classroom'

export type FetchAllClassroomsResponseDto = Either<
  null,
  { classrooms: Classroom[] }
>
