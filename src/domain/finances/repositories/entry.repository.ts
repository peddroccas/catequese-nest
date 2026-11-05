import { Injectable } from '@nestjs/common'
import { Entry } from '../entities/entry'

@Injectable()
export abstract class EntryRepository {
  abstract create(entry: Entry): Promise<void>
  abstract update(entry: Entry): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Entry | null>
  // Mais recentes primeiro
  abstract findMany(): Promise<Entry[]>
  // Pagamentos do carnê; com classroomIds, só os de catequizandos dessas turmas
  abstract findManyCarne(classroomIds?: string[]): Promise<Entry[]>
  // Quanto o catequizando já pagou do carnê (ignora um pagamento, na edição)
  abstract sumCarnePaid(
    catechizingId: string,
    excludeEntryId?: string
  ): Promise<number>
}
