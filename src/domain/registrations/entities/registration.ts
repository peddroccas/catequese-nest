import {
  DocumentKind,
  RegistrationSegment,
  RegistrationStatus,
} from '../enums/registration'

export interface RegistrationParent {
  name: string
  phone: string
  kinship: string
}

export interface RegistrationFile {
  id: string
  kind: DocumentKind
  // Caminho no bucket privado; nunca sai da API
  storagePath: string
  originalName: string
  mimeType: string
  sizeBytes: number
}

// Dados da ficha, já validados, sem id nem status
export interface RegistrationData {
  segment: RegistrationSegment
  name: string
  birthday: Date
  address: string
  personWithSpecialNeeds: boolean
  specialNeedsDescription: string | null
  foodRestriction: string | null
  releasedToGoAwayAlone: boolean
  pickupAuthorizedBy: string | null
  shirtSize: string | null
  hasReceivedBaptism: boolean
  hasReceivedEucharist: boolean
  hasReceivedMarriage: boolean
  maritalStatus: string | null
  livesWithPartner: boolean | null
  parents: RegistrationParent[]
}

export interface Registration extends RegistrationData {
  id: string
  status: RegistrationStatus
  files: RegistrationFile[]
  rejectionReason: string | null
  reviewedAt: Date | null
  reviewedByName: string | null
  catechizingId: string | null
  termsAcceptedAt: Date
  createdAt: Date
}

export interface NewRegistration extends RegistrationData {
  id: string
  files: RegistrationFile[]
  termsAcceptedAt: Date
  submitterHash: string | null
}
