import { Either } from '@/core/either'
import { Catechist } from '../../entities/catechist'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

export type FetchCatechistByIdResponseDto = Either<
  ResourceNotFoundError,
  { catechist: Catechist }
>
