import { randomUUID } from 'node:crypto'
import { zipSync } from 'fflate'
import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Catechizing } from '@/domain/catechizings/entities/catechizing'
import { Parent } from '@/domain/catechizings/entities/parent'
import { MaritalStatus } from '@/domain/catechizings/enums/marital-status'
import { Classroom } from '@/domain/classroms/entities/classroom'
import { ClassroomRepository } from '@/domain/classroms/repositories/classroom.repository'
import {
  ClassroomSegmentMismatchError,
  DuplicatedRegistrationError,
  MissingDocumentsError,
  RegistrationNotPendingError,
  RegistrationsClosedError,
  SegmentClosedError,
} from '../errors'
import {
  NewRegistration,
  Registration,
  RegistrationData,
  RegistrationFile,
  RegistrationSettings,
} from '../entities/registration'
import {
  DOCUMENT_LABELS,
  DocumentKind,
  RegistrationStatus,
  requiredDocuments,
  SEGMENT_CLASSROOMS,
} from '../enums/registration'
import { RegistrationRepository } from '../repositories/registration.repository'
import { RegistrationStorage } from '../storage/registration-storage'

// Quanto tempo o link de um documento continua valendo
export const DOCUMENT_URL_TTL_SECONDS = 5 * 60

export interface UploadedDocument {
  kind: DocumentKind
  body: Buffer
  mimeType: string
  extension: string
  originalName: string
}

@Injectable()
export class SubmitRegistrationUseCase {
  constructor(
    private registrationRepository: RegistrationRepository,
    private registrationStorage: RegistrationStorage
  ) {}

  async execute({
    data,
    documents,
    submitterHash,
  }: {
    data: RegistrationData
    documents: UploadedDocument[]
    submitterHash: string | null
  }): Promise<
    Either<
      | RegistrationsClosedError
      | SegmentClosedError
      | MissingDocumentsError
      | DuplicatedRegistrationError,
      { registrationId: string }
    >
  > {
    // A coordenação pode fechar tudo, ou só algumas etapas, a qualquer momento
    const settings = await this.registrationRepository.getSettings()

    if (!settings.isOpen) {
      return left(new RegistrationsClosedError())
    }
    if (!settings.openSegments.includes(data.segment)) {
      return left(new SegmentClosedError())
    }

    // Só os documentos que a ficha exige: sacramento não marcado não tem arquivo
    const required = requiredDocuments(data)
    const received = required
      .map(kind => documents.find(document => document.kind === kind))
      .filter((document): document is UploadedDocument => Boolean(document))
    const missing = required.filter(
      kind => !received.some(document => document.kind === kind)
    )

    if (missing.length) {
      return left(new MissingDocumentsError(missing))
    }

    if (await this.registrationRepository.existsActive(data.name, data.birthday)) {
      return left(new DuplicatedRegistrationError())
    }

    const id = randomUUID()
    const files: RegistrationFile[] = received.map(document => {
      const fileId = randomUUID()

      return {
        id: fileId,
        kind: document.kind,
        storagePath: `${id}/${fileId}.${document.extension}`,
        originalName: document.originalName,
        mimeType: document.mimeType,
        sizeBytes: document.body.length,
      }
    })
    const uploaded: string[] = []

    try {
      for (const [index, file] of files.entries()) {
        await this.registrationStorage.upload(
          file.storagePath,
          received[index].body,
          file.mimeType
        )
        uploaded.push(file.storagePath)
      }

      const registration: NewRegistration = {
        ...data,
        id,
        files,
        // O schema só deixa chegar aqui quem marcou que concorda com o termo
        termsAcceptedAt: new Date(),
        submitterHash,
      }
      await this.registrationRepository.create(registration)
    } catch (error) {
      // Não deixa arquivo órfão no bucket se algo falhar no meio
      await Promise.allSettled(
        uploaded.map(path => this.registrationStorage.delete(path))
      )
      throw error
    }

    return right({ registrationId: id })
  }
}

@Injectable()
export class GetRegistrationSettingsUseCase {
  constructor(private registrationRepository: RegistrationRepository) {}

  async execute(): Promise<Either<null, { settings: RegistrationSettings }>> {
    return right({ settings: await this.registrationRepository.getSettings() })
  }
}

@Injectable()
export class UpdateRegistrationSettingsUseCase {
  constructor(private registrationRepository: RegistrationRepository) {}

  async execute(
    changes: Partial<RegistrationSettings>
  ): Promise<Either<null, { settings: RegistrationSettings }>> {
    const settings = await this.registrationRepository.updateSettings(changes)

    return right({ settings })
  }
}

@Injectable()
export class FetchRegistrationsUseCase {
  constructor(private registrationRepository: RegistrationRepository) {}

  async execute(
    status?: RegistrationStatus
  ): Promise<Either<null, { registrations: Registration[] }>> {
    const registrations = await this.registrationRepository.findMany(status)

    return right({ registrations })
  }
}

@Injectable()
export class FetchRegistrationByCatechizingUseCase {
  constructor(private registrationRepository: RegistrationRepository) {}

  async execute(
    catechizingId: string
  ): Promise<Either<ResourceNotFoundError, { registration: Registration }>> {
    const registration =
      await this.registrationRepository.findByCatechizing(catechizingId)

    if (!registration) {
      return left(new ResourceNotFoundError())
    }

    return right({ registration })
  }
}

@Injectable()
export class GetRegistrationDocumentUrlUseCase {
  constructor(
    private registrationRepository: RegistrationRepository,
    private registrationStorage: RegistrationStorage
  ) {}

  async execute({
    registrationId,
    fileId,
  }: {
    registrationId: string
    fileId: string
  }): Promise<Either<ResourceNotFoundError, { url: string }>> {
    const registration = await this.registrationRepository.findById(registrationId)
    const file = registration?.files.find(file => file.id === fileId)

    if (!file) {
      return left(new ResourceNotFoundError())
    }

    const url = await this.registrationStorage.createSignedUrl(
      file.storagePath,
      DOCUMENT_URL_TTL_SECONDS
    )

    return right({ url })
  }
}

@Injectable()
export class ApproveRegistrationUseCase {
  constructor(
    private registrationRepository: RegistrationRepository,
    private classroomRepository: ClassroomRepository
  ) {}

  async execute({
    registrationId,
    classroomId,
    reviewerId,
  }: {
    registrationId: string
    classroomId: string
    reviewerId: string
  }): Promise<
    Either<
      | ResourceNotFoundError
      | RegistrationNotPendingError
      | ClassroomSegmentMismatchError,
      { catechizing: Catechizing; classroom: Classroom }
    >
  > {
    const registration = await this.registrationRepository.findById(registrationId)

    if (!registration) {
      return left(new ResourceNotFoundError())
    }
    if (registration.status !== RegistrationStatus.PENDING) {
      return left(new RegistrationNotPendingError())
    }

    const classroom = await this.classroomRepository.findById(classroomId)

    if (!classroom || classroom.archivedAt) {
      return left(new ResourceNotFoundError())
    }
    // Só vai para uma turma da etapa que a pessoa escolheu na inscrição
    if (!SEGMENT_CLASSROOMS[registration.segment].includes(classroom.segment)) {
      return left(new ClassroomSegmentMismatchError())
    }

    const catechizingId = new UniqueEntityID()
    const catechizing = Catechizing.create(
      {
        name: registration.name,
        birthday: registration.birthday,
        address: registration.address,
        personWithSpecialNeeds: registration.personWithSpecialNeeds,
        specialNeedsDescription: registration.specialNeedsDescription,
        releasedToGoAwayAlone: registration.releasedToGoAwayAlone,
        maritalStatus: registration.maritalStatus as MaritalStatus | null,
        livesWithPartner: registration.livesWithPartner,
        hasReceivedBaptism: registration.hasReceivedBaptism,
        hasReceivedEucharist: registration.hasReceivedEucharist,
        hasReceivedMarriage: registration.hasReceivedMarriage,
        shirtSize: registration.shirtSize,
        foodRestriction: registration.foodRestriction,
        pickupAuthorizedBy: registration.pickupAuthorizedBy,
        classroomId: classroom.id,
        parents: registration.parents.map(parent =>
          Parent.create({ ...parent, catechizingId })
        ),
      },
      catechizingId
    )

    const approved = await this.registrationRepository.approve({
      registrationId,
      reviewerId,
      catechizing,
    })

    if (!approved) {
      return left(new RegistrationNotPendingError())
    }

    return right({ catechizing, classroom })
  }
}

@Injectable()
export class RejectRegistrationUseCase {
  constructor(private registrationRepository: RegistrationRepository) {}

  async execute({
    registrationId,
    reason,
    reviewerId,
  }: {
    registrationId: string
    reason: string
    reviewerId: string
  }): Promise<
    Either<ResourceNotFoundError | RegistrationNotPendingError, null>
  > {
    const registration = await this.registrationRepository.findById(registrationId)

    if (!registration) {
      return left(new ResourceNotFoundError())
    }
    if (registration.status !== RegistrationStatus.PENDING) {
      return left(new RegistrationNotPendingError())
    }

    const rejected = await this.registrationRepository.reject({
      registrationId,
      reviewerId,
      reason,
    })

    return rejected ? right(null) : left(new RegistrationNotPendingError())
  }
}

const EXTENSION_BY_MIME: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

function toFileName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w ()-]+/g, '')
    .trim()
}

@Injectable()
export class BuildRegistrationZipUseCase {
  constructor(
    private registrationRepository: RegistrationRepository,
    private registrationStorage: RegistrationStorage
  ) {}

  async execute(
    registrationId: string
  ): Promise<
    Either<ResourceNotFoundError, { fileName: string; buffer: Buffer }>
  > {
    const registration = await this.registrationRepository.findById(registrationId)

    if (!registration || !registration.files.length) {
      return left(new ResourceNotFoundError())
    }

    const entries: Record<string, Uint8Array> = {}
    const downloads = await Promise.all(
      registration.files.map(file => this.registrationStorage.download(file.storagePath))
    )

    registration.files.forEach((file, index) => {
      const extension = EXTENSION_BY_MIME[file.mimeType] ?? 'bin'
      const label = toFileName(DOCUMENT_LABELS[file.kind])

      entries[`${index + 1} - ${label}.${extension}`] = downloads[index]
    })

    // Fotos e PDFs já são comprimidos: só empacota (level 0)
    const buffer = Buffer.from(zipSync(entries, { level: 0 }))

    return right({
      fileName: `Inscricao - ${toFileName(registration.name)}.zip`,
      buffer,
    })
  }
}
