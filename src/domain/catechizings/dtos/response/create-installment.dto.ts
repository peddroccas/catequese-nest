import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Installment } from '../../entities/installment'

export type CreateInstallmentResponseDto = Either<
  ResourceNotFoundError,
  { installment: Installment }
>
