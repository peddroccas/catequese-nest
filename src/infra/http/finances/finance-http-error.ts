import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CarneLimitExceededError } from '@/domain/finances/errors/carne-limit-exceeded-error'
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'

function formatCents(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function toFinanceHttpError(error: Error) {
  if (error instanceof CarneLimitExceededError) {
    return new BadRequestException(
      error.remainingCents > 0
        ? `O valor passa do total do carnê. Falta pagar ${formatCents(error.remainingCents)}`
        : 'O carnê deste catequizando já está quitado'
    )
  }

  if (error instanceof NotAllowedError) {
    return new ForbiddenException('Você não tem acesso a esta turma')
  }

  return new NotFoundException('Registro ou catequizando não encontrado')
}
