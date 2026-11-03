import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Classroom } from '../../entities/classroom'

export type UpdateClassroomResponseDto = Either<
  ResourceNotFoundError,
  { classroom: Classroom }
>
