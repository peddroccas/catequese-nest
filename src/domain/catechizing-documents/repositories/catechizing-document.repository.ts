import { Injectable } from '@nestjs/common'
import {
  CatechizingDocument,
  NewCatechizingDocument,
} from '../entities/catechizing-document'

@Injectable()
export abstract class CatechizingDocumentRepository {
  abstract findByCatechizing(
    catechizingId: string
  ): Promise<CatechizingDocument[]>
  abstract findById(id: string): Promise<CatechizingDocument | null>
  // Um documento por tipo: se já havia um, ele é trocado e o anterior volta
  abstract upsert(
    document: NewCatechizingDocument
  ): Promise<{ document: CatechizingDocument; replaced: CatechizingDocument | null }>
  abstract delete(id: string): Promise<void>
  // O mesmo arquivo pode estar na inscrição e no perfil: só se apaga do
  // armazenamento quando ninguém mais usa o caminho
  abstract isStoragePathInUse(path: string): Promise<boolean>
}
