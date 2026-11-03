import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Formation } from '../../entities/formation'

export type FetchFormationByIdResponseDto = Either<
  ResourceNotFoundError,
  { formation: Formation }
>
