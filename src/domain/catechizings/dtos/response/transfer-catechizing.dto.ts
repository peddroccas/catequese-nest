import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Catechizing } from '../../entities/catechizing'
import { ParentRequiredError } from '../../use-cases/errors/parent-required-error'

export type TransferCatechizingResponseDto = Either<
  ResourceNotFoundError | ParentRequiredError,
  { catechizing: Catechizing }
>
