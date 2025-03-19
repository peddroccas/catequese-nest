import { Either } from '@/core/either'
import { Catechist } from '../../entities/catechist'
import { WrongCredentialsError } from '../../use-cases/errors/wrog-credentials-error'

export type CreateCatechistResponseDto = Either<
  WrongCredentialsError,
  {
    catechist: Catechist
  }
>
