import { Segment } from '@/domain/classroms/enums/segment'
import { MaritalStatus } from '@/domain/catechizings/enums/marital-status'

// Etapa escolhida no formulário público. A turma só é escolhida pela
// coordenação ao aprovar, entre as turmas desta etapa
export enum RegistrationSegment {
  PRE_EUCARISTIA = 'PRE_EUCARISTIA',
  EUCARISTIA = 'EUCARISTIA',
  CRISMA = 'CRISMA',
  ADULTOS = 'ADULTOS',
}

// Inscrição nova só entra no primeiro ano (Eucaristia 1 e Crisma 1): as turmas
// "2" são de quem já está na catequese e continua para o segundo ano
export const SEGMENT_CLASSROOMS: Record<RegistrationSegment, Segment[]> = {
  [RegistrationSegment.PRE_EUCARISTIA]: [Segment.PRE_EUCARISTIA],
  [RegistrationSegment.EUCARISTIA]: [Segment.EUCARISTIA_1],
  [RegistrationSegment.CRISMA]: [Segment.CRISMA_1],
  [RegistrationSegment.ADULTOS]: [Segment.CATEQUESE_ADULTOS],
}

// Só quem faz Crisma ou a catequese de adultos já pode ter a 1ª Eucaristia
export const SEGMENTS_WITH_EUCHARIST: RegistrationSegment[] = [
  RegistrationSegment.CRISMA,
  RegistrationSegment.ADULTOS,
]

export enum RegistrationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum DocumentKind {
  PERSON_ID = 'PERSON_ID',
  GUARDIAN_ID = 'GUARDIAN_ID',
  PROOF_OF_RESIDENCE = 'PROOF_OF_RESIDENCE',
  BAPTISM = 'BAPTISM',
  EUCHARIST = 'EUCHARIST',
  MARRIAGE = 'MARRIAGE',
}

export const DOCUMENT_LABELS: Record<DocumentKind, string> = {
  [DocumentKind.PERSON_ID]: 'Certidão de nascimento ou RG',
  [DocumentKind.GUARDIAN_ID]: 'Documento do responsável',
  [DocumentKind.PROOF_OF_RESIDENCE]: 'Comprovante de residência',
  [DocumentKind.BAPTISM]: 'Lembrança do Batismo',
  [DocumentKind.EUCHARIST]: 'Lembrança da 1ª Eucaristia',
  [DocumentKind.MARRIAGE]: 'Certidão de casamento no religioso',
}

interface DocumentRules {
  segment: RegistrationSegment
  hasReceivedBaptism: boolean
  hasReceivedEucharist: boolean
  maritalStatus?: string | null
}

// Documentos que a ficha exige. Só entram os dos sacramentos marcados
export function requiredDocuments({
  segment,
  hasReceivedBaptism,
  hasReceivedEucharist,
  maritalStatus,
}: DocumentRules): DocumentKind[] {
  const isAdult = segment === RegistrationSegment.ADULTOS
  const documents = [DocumentKind.PERSON_ID]

  if (!isAdult) {
    documents.push(DocumentKind.GUARDIAN_ID)
  }
  documents.push(DocumentKind.PROOF_OF_RESIDENCE)

  if (hasReceivedBaptism) {
    documents.push(DocumentKind.BAPTISM)
  }
  if (hasReceivedEucharist && SEGMENTS_WITH_EUCHARIST.includes(segment)) {
    documents.push(DocumentKind.EUCHARIST)
  }
  if (isAdult && maritalStatus === MaritalStatus.CASADO_RELIGIOSO) {
    documents.push(DocumentKind.MARRIAGE)
  }

  return documents
}
