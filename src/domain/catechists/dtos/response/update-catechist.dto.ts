import { Either } from '@/core/either'
import { DuplicatedError } from '@/core/errors/errors/duplicated-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

export type UpdateCatechistResponseDto = Either<
  ResourceNotFoundError | DuplicatedError,
  null
>
