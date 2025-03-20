import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Classroom } from '../../entities/classroom'

export type FetchClassroomByIdResponseDto = Either<
  ResourceNotFoundError,
  { classroom: Classroom }
>
