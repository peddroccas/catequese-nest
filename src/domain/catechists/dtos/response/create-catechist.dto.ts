import { Either } from '@/core/either'
import { DuplicatedError } from '@/core/errors/errors/duplicated-error'
import { Catechist } from '../../entities/catechist'

export type CreateCatechistResponseDto = Either<
  DuplicatedError,
  {
    catechist: Catechist
  }
>
