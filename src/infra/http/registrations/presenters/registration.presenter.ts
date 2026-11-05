import { Registration } from '@/domain/registrations/entities/registration'
import { DOCUMENT_LABELS } from '@/domain/registrations/enums/registration'
import { toDateOnly } from '../../presenters/date.presenter'

// Código curto para a família citar ao falar com a coordenação
export function registrationProtocol(id: string) {
  return id.slice(0, 8).toUpperCase()
}

export class RegistrationPresenter {
  static toHTTP(registration: Registration) {
    return {
      id: registration.id,
      protocol: registrationProtocol(registration.id),
      segment: registration.segment,
      status: registration.status,
      name: registration.name,
      birthday: toDateOnly(registration.birthday),
      address: registration.address,
      personWithSpecialNeeds: registration.personWithSpecialNeeds,
      specialNeedsDescription: registration.specialNeedsDescription,
      foodRestriction: registration.foodRestriction,
      releasedToGoAwayAlone: registration.releasedToGoAwayAlone,
      pickupAuthorizedBy: registration.pickupAuthorizedBy,
      shirtSize: registration.shirtSize,
      hasReceivedBaptism: registration.hasReceivedBaptism,
      hasReceivedEucharist: registration.hasReceivedEucharist,
      hasReceivedMarriage: registration.hasReceivedMarriage,
      maritalStatus: registration.maritalStatus,
      livesWithPartner: registration.livesWithPartner,
      parents: registration.parents,
      // O caminho no bucket não sai da API: a coordenação abre por link temporário
      files: registration.files.map(file => ({
        id: file.id,
        kind: file.kind,
        label: DOCUMENT_LABELS[file.kind],
        originalName: file.originalName,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
      })),
      rejectionReason: registration.rejectionReason,
      reviewedAt: registration.reviewedAt?.toISOString() ?? null,
      reviewedByName: registration.reviewedByName,
      catechizingId: registration.catechizingId,
      termsAcceptedAt: registration.termsAcceptedAt.toISOString(),
      createdAt: registration.createdAt.toISOString(),
    }
  }
}
