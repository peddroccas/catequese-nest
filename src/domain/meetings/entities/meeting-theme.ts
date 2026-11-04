import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Itinerary } from '../enums/itinerary'

export interface MeetingThemeProps {
  itinerary: Itinerary
  // Tempo/fase do itinerário em que o tema aparece
  phase: string
  name: string
  // Ordem dentro do itinerário
  position: number
  archivedAt?: Date | null
}

export class MeetingTheme extends Entity<MeetingThemeProps> {
  get itinerary(): Itinerary {
    return this.props.itinerary
  }

  get phase(): string {
    return this.props.phase
  }

  get name(): string {
    return this.props.name
  }

  get position(): number {
    return this.props.position
  }

  // Tema excluído: some da escolha, mas segue no histórico das chamadas
  get archivedAt(): Date | null {
    return this.props.archivedAt ?? null
  }

  static create(props: MeetingThemeProps, id?: UniqueEntityID) {
    return new MeetingTheme(props, id)
  }
}
