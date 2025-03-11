import { UseCaseError } from '@/core/errors/use-case-error'

export class DuplicatedError extends Error implements UseCaseError {
  constructor() {
    super('Duplicated entity')
  }
}
