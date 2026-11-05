import { UseCaseError } from '@/core/errors/use-case-error'
import { DocumentKind } from './enums/registration'

export class MissingDocumentsError extends Error implements UseCaseError {
  constructor(public readonly missing: DocumentKind[]) {
    super('Documentos obrigatórios não enviados')
  }
}

export class RegistrationsClosedError extends Error implements UseCaseError {
  constructor() {
    super('As inscrições estão encerradas')
  }
}

export class DocumentFileMissingError extends Error implements UseCaseError {
  constructor() {
    super('O arquivo deste documento não está mais no armazenamento')
  }
}

export class SegmentClosedError extends Error implements UseCaseError {
  constructor() {
    super('As inscrições para esta etapa estão encerradas')
  }
}

export class DuplicatedRegistrationError extends Error implements UseCaseError {
  constructor() {
    super('Já existe uma inscrição para este nome e data de nascimento')
  }
}

export class RegistrationNotPendingError extends Error implements UseCaseError {
  constructor() {
    super('Esta inscrição já foi analisada')
  }
}

export class ClassroomSegmentMismatchError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('A turma não é da etapa escolhida na inscrição')
  }
}
