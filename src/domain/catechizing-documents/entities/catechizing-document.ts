import { DocumentKind } from '@/domain/registrations/enums/registration'

export interface CatechizingDocument {
  id: string
  catechizingId: string
  kind: DocumentKind
  // Caminho no bucket privado; nunca sai da API
  storagePath: string
  originalName: string
  mimeType: string
  sizeBytes: number
  createdAt: Date
}

export type NewCatechizingDocument = Omit<CatechizingDocument, 'createdAt'>
