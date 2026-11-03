import { UseCaseError } from '@/core/errors/use-case-error'

export class ParentRequiredError extends Error implements UseCaseError {
  constructor() {
    super('Cadastre ao menos um responsável (só turmas de adultos dispensam)')
  }
}
