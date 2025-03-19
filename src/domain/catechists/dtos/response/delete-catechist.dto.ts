import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

export type DeleteCatechistResponseDto = Either<ResourceNotFoundError, null>
