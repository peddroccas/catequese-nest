import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Parent } from '../../entities/parent'

export type UpdateParentResponseDto = Either<
  ResourceNotFoundError,
  { parent: Parent }
>
