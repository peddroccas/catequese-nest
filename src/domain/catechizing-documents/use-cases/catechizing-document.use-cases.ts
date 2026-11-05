import { randomUUID } from 'node:crypto'
import { zipSync } from 'fflate'
import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { StorageObjectNotFoundError } from '@/core/errors/errors/storage-object-not-found-error'
import { DocumentFileMissingError } from '@/domain/registrations/errors'
import { CatechizingRepository } from '@/domain/catechizings/repositories/catechizing.repository'
import {
  DOCUMENT_LABELS,
  DocumentKind,
} from '@/domain/registrations/enums/registration'
import { RegistrationStorage } from '@/domain/registrations/storage/registration-storage'
import { CatechizingDocument } from '../entities/catechizing-document'
import { CatechizingDocumentRepository } from '../repositories/catechizing-document.repository'

// Quanto tempo o link de um documento continua valendo
const DOCUMENT_URL_TTL_SECONDS = 5 * 60

// Só a coordenação mexe nos documentos (garantido nas rotas)
@Injectable()
export class ListCatechizingDocumentsUseCase {
  constructor(
    private catechizingRepository: CatechizingRepository,
    private documentRepository: CatechizingDocumentRepository
  ) {}

  async execute(
    catechizingId: string
  ): Promise<
    Either<ResourceNotFoundError, { documents: CatechizingDocument[] }>
  > {
    if (!(await this.catechizingRepository.findById(catechizingId))) {
      return left(new ResourceNotFoundError())
    }

    return right({
      documents: await this.documentRepository.findByCatechizing(catechizingId),
    })
  }
}

@Injectable()
export class UploadCatechizingDocumentUseCase {
  constructor(
    private catechizingRepository: CatechizingRepository,
    private documentRepository: CatechizingDocumentRepository,
    private storage: RegistrationStorage
  ) {}

  // Cadastra o documento ou, se o tipo já existe, troca o arquivo
  async execute({
    catechizingId,
    kind,
    body,
    originalName,
  }: {
    catechizingId: string
    kind: DocumentKind
    body: Buffer
    originalName: string
  }): Promise<
    Either<ResourceNotFoundError, { document: CatechizingDocument }>
  > {
    if (!(await this.catechizingRepository.findById(catechizingId))) {
      return left(new ResourceNotFoundError())
    }

    const id = randomUUID()
    const storagePath = `catechizings/${catechizingId}/${id}.pdf`

    await this.storage.upload(storagePath, body, 'application/pdf')

    try {
      const { document, replaced } = await this.documentRepository.upsert({
        id,
        catechizingId,
        kind,
        storagePath,
        originalName,
        mimeType: 'application/pdf',
        sizeBytes: body.length,
      })

      // O arquivo antigo só sai do armazenamento se a inscrição não o usa mais
      if (
        replaced &&
        !(await this.documentRepository.isStoragePathInUse(
          replaced.storagePath
        ))
      ) {
        await this.storage.delete(replaced.storagePath).catch(() => undefined)
      }

      return right({ document })
    } catch (error) {
      // Não deixa arquivo órfão se o banco falhar
      await this.storage.delete(storagePath).catch(() => undefined)
      throw error
    }
  }
}

@Injectable()
export class RemoveCatechizingDocumentUseCase {
  constructor(
    private documentRepository: CatechizingDocumentRepository,
    private storage: RegistrationStorage
  ) {}

  async execute({
    catechizingId,
    documentId,
  }: {
    catechizingId: string
    documentId: string
  }): Promise<Either<ResourceNotFoundError, null>> {
    const document = await this.documentRepository.findById(documentId)

    if (!document || document.catechizingId !== catechizingId) {
      return left(new ResourceNotFoundError())
    }

    await this.documentRepository.delete(documentId)

    if (!(await this.documentRepository.isStoragePathInUse(document.storagePath))) {
      await this.storage.delete(document.storagePath).catch(() => undefined)
    }

    return right(null)
  }
}

@Injectable()
export class GetCatechizingDocumentUrlUseCase {
  constructor(
    private documentRepository: CatechizingDocumentRepository,
    private storage: RegistrationStorage
  ) {}

  async execute({
    catechizingId,
    documentId,
  }: {
    catechizingId: string
    documentId: string
  }): Promise<
    Either<ResourceNotFoundError | DocumentFileMissingError, { url: string }>
  > {
    const document = await this.documentRepository.findById(documentId)

    if (!document || document.catechizingId !== catechizingId) {
      return left(new ResourceNotFoundError())
    }

    try {
      return right({
        url: await this.storage.createSignedUrl(
          document.storagePath,
          DOCUMENT_URL_TTL_SECONDS
        ),
      })
    } catch (error) {
      // O banco lista o arquivo, mas ele não está mais no armazenamento
      if (error instanceof StorageObjectNotFoundError) {
        return left(new DocumentFileMissingError())
      }
      throw error
    }
  }
}

// Documentos copiados de inscrições antigas podem ser foto (JPG/PNG)
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
export class BuildCatechizingDocumentsZipUseCase {
  constructor(
    private catechizingRepository: CatechizingRepository,
    private documentRepository: CatechizingDocumentRepository,
    private storage: RegistrationStorage
  ) {}

  async execute(
    catechizingId: string
  ): Promise<
    Either<ResourceNotFoundError, { fileName: string; buffer: Buffer }>
  > {
    const catechizing = await this.catechizingRepository.findById(catechizingId)
    const documents = await this.documentRepository.findByCatechizing(catechizingId)

    if (!catechizing || !documents.length) {
      return left(new ResourceNotFoundError())
    }

    // Arquivo que não está mais no armazenamento não derruba o ZIP: entra um
    // aviso no lugar, para a coordenação saber o que enviar de novo
    const downloads = await Promise.all(
      documents.map(document =>
        this.storage.download(document.storagePath).catch(error => {
          if (error instanceof StorageObjectNotFoundError) {
            return null
          }
          throw error
        })
      )
    )
    const entries: Record<string, Uint8Array> = {}

    documents.forEach((document, index) => {
      const extension = EXTENSION_BY_MIME[document.mimeType] ?? 'bin'
      const label = toFileName(DOCUMENT_LABELS[document.kind])
      const download = downloads[index]

      if (download) {
        entries[`${index + 1} - ${label}.${extension}`] = download
      } else {
        entries[`${index + 1} - AVISO arquivo ausente - ${label}.txt`] =
          Buffer.from(
            `O arquivo "${DOCUMENT_LABELS[document.kind]}" (${document.originalName}) não está mais no armazenamento. Envie o documento de novo.`
          )
      }
    })

    return right({
      fileName: `Documentos - ${toFileName(catechizing.name)}.zip`,
      // PDFs já são comprimidos: só empacota (level 0)
      buffer: Buffer.from(zipSync(entries, { level: 0 })),
    })
  }
}
