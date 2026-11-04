import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Attendance } from './attendance'

export interface FormationProps {
  theme: string
  instructor?: string | null
  date: Date
  attendances: Attendance[]
}

export class Formation extends Entity<FormationProps> {
  get theme(): string {
    return this.props.theme
  }

  get instructor(): string | null {
    return this.props.instructor ?? null
  }

  get date(): Date {
    return this.props.date
  }

  get attendances(): Attendance[] {
    return this.props.attendances
  }

  static create(props: FormationProps, id?: UniqueEntityID) {
    const formation = new Formation(props, id)

    return formation
  }
}
