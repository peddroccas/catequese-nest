import { Injectable } from '@nestjs/common'
import { MeetingTheme } from '../entities/meeting-theme'
import { Itinerary } from '../enums/itinerary'

@Injectable()
export abstract class MeetingThemeRepository {
  abstract create(theme: MeetingTheme): Promise<void>
  abstract update(theme: MeetingTheme): Promise<void>
  abstract archive(id: string): Promise<void>
  // Inclui temas excluídos (para o histórico)
  abstract findById(id: string): Promise<MeetingTheme | null>
  abstract findManyByIds(ids: string[]): Promise<MeetingTheme[]>
  // Só temas ativos, na ordem do itinerário
  abstract findMany(itinerary?: Itinerary): Promise<MeetingTheme[]>
  // Maior posição usada no itinerário (ou na fase, se informada)
  abstract findLastPosition(
    itinerary: Itinerary,
    phase?: string
  ): Promise<number | null>
}
