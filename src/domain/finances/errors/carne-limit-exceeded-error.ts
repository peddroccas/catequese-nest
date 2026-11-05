import { UseCaseError } from '@/core/errors/use-case-error'

// O pagamento passaria do valor total do carnê
export class CarneLimitExceededError extends Error implements UseCaseError {
  constructor(public remainingCents: number) {
    super('Carne limit exceeded')
  }
}
