import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Payment } from '../../entities/payment'

export type FetchPaymentByCatechizingResponseDto = Either<
  ResourceNotFoundError,
  { payment: Payment }
>
