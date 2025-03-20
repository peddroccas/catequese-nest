import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Catechizing } from '../../entities/catechizing'

export type UpdateCatechizingResponseDto = Either<
  ResourceNotFoundError,
  { catechizing: Catechizing }
>
