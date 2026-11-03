import { Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

export type DeleteCatechizingResponseDto = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>
