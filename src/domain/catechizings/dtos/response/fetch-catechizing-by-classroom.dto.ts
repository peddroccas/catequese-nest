import { Either } from '@/core/either'
import { Catechizing } from '../../entities/catechizing'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

export type FetchCatechizingByClassroomResponseDto = Either<
  ResourceNotFoundError,
  { catechizings: Catechizing[] }
>
