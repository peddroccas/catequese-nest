import { Either } from '@/core/either'
import { WrongCredentialsError } from '../../use-cases/errors/wrog-credentials-error'

export type AuthenticateCatechistResponseDto = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>
