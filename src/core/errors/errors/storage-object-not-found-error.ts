import { UseCaseError } from '@/core/errors/use-case-error'

// O arquivo não está (mais) no armazenamento, ainda que o banco o liste
export class StorageObjectNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Storage object not found')
  }
}
