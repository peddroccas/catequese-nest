import { Either } from '@/core/either'
import { DuplicatedError } from '@/core/errors/errors/duplicated-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Catechist } from '../../entities/catechist'

export type CreateCatechistResponseDto = Either<
  DuplicatedError | ResourceNotFoundError,
  {
    catechist: Catechist
  }
>
