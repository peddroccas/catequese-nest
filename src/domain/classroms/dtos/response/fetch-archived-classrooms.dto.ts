import { Either } from '@/core/either'
import { Classroom } from '../../entities/classroom'

export type FetchArchivedClassroomsResponseDto = Either<
  null,
  { classrooms: Classroom[] }
>
