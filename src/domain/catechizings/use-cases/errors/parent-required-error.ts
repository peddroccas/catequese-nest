import { UseCaseError } from '@/core/errors/use-case-error'

export class ParentRequiredError extends Error implements UseCaseError {
  constructor() {
    super('At least one parent is required outside adult segments.')
  }
}
