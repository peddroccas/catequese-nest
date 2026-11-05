import {
  Registration as PrismaRegistration,
  RegistrationFile as PrismaRegistrationFile,
} from '@prisma/client'
import {
  Registration,
  RegistrationParent,
} from '@/domain/registrations/entities/registration'
import {
  DocumentKind,
  RegistrationSegment,
  RegistrationStatus,
} from '@/domain/registrations/enums/registration'

export const registrationInclude = {
  files: { orderBy: { createdAt: 'asc' as const } },
  reviewedBy: { select: { name: true } },
}

type RawRegistration = PrismaRegistration & {
  files: PrismaRegistrationFile[]
  reviewedBy: { name: string } | null
}

export class RegistrationMapper {
  static toDomain(raw: RawRegistration): Registration {
    return {
      id: raw.id,
      segment: raw.segment as RegistrationSegment,
      status: raw.status as RegistrationStatus,
      name: raw.name,
      birthday: new Date(raw.birthday),
      address: raw.address,
      personWithSpecialNeeds: raw.personWithSpecialNeeds,
      specialNeedsDescription: raw.specialNeedsDescription,
      foodRestriction: raw.foodRestriction,
      releasedToGoAwayAlone: raw.releasedToGoAwayAlone,
      pickupAuthorizedBy: raw.pickupAuthorizedBy,
      shirtSize: raw.shirtSize,
      hasReceivedBaptism: raw.hasReceivedBaptism,
      hasReceivedEucharist: raw.hasReceivedEucharist,
      hasReceivedMarriage: raw.hasReceivedMarriage,
      maritalStatus: raw.maritalStatus,
      livesWithPartner: raw.livesWithPartner,
      parents: raw.parents as unknown as RegistrationParent[],
      files: raw.files.map(file => ({
        id: file.id,
        kind: file.kind as DocumentKind,
        storagePath: file.storagePath,
        originalName: file.originalName,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes,
      })),
      rejectionReason: raw.rejectionReason,
      reviewedAt: raw.reviewedAt,
      reviewedByName: raw.reviewedBy?.name ?? null,
      catechizingId: raw.catechizingId,
      termsAcceptedAt: raw.termsAcceptedAt,
      createdAt: raw.createdAt,
    }
  }
}
