import { CatechizingDocument } from '@/domain/catechizing-documents/entities/catechizing-document'
import { DOCUMENT_LABELS } from '@/domain/registrations/enums/registration'

export class CatechizingDocumentPresenter {
  static toHTTP(document: CatechizingDocument) {
    // O caminho no bucket não sai da API: a coordenação abre por link temporário
    return {
      id: document.id,
      kind: document.kind,
      label: DOCUMENT_LABELS[document.kind],
      originalName: document.originalName,
      mimeType: document.mimeType,
      sizeBytes: document.sizeBytes,
      createdAt: document.createdAt.toISOString(),
    }
  }
}
