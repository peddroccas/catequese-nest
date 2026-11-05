import { Injectable } from '@nestjs/common'
import { Rite, RiteFile } from '../entities/rite'

@Injectable()
export abstract class RiteRepository {
  abstract create(rite: Rite): Promise<void>
  // Atualiza nome e descrição (os PDFs mudam em addFile/removeFile)
  abstract update(rite: Rite): Promise<void>
  abstract addFile(riteId: string, file: RiteFile): Promise<void>
  abstract removeFile(fileId: string): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Rite | null>
  abstract findMany(): Promise<Rite[]>
}
