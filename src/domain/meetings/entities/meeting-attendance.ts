import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface MeetingAttendanceProps {
  catechizingId: UniqueEntityID
  // Só na leitura: o catequizando pode ter sido transferido ou arquivado
  catechizingName?: string
  isPresent: boolean
}

export class MeetingAttendance extends Entity<MeetingAttendanceProps> {
  get catechizingId(): UniqueEntityID {
    return this.props.catechizingId
  }

  get catechizingName(): string | null {
    return this.props.catechizingName ?? null
  }

  get isPresent(): boolean {
    return this.props.isPresent
  }

  static create(props: MeetingAttendanceProps, id?: UniqueEntityID) {
    return new MeetingAttendance(props, id)
  }
}
