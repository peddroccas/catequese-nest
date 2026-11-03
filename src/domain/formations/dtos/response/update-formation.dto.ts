import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Formation } from '../../entities/formation'

export type UpdateFormationResponseDto = Either<
  ResourceNotFoundError,
  { formation: Formation }
>
