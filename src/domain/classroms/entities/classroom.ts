import { Catechist } from '@/domain/catechists/entities/catechist'
import { Segment } from '../enums/segment'
import { Catechizing } from '@/domain/catechizings/entities/catechizing'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ClassroomProps {
  location: string
  segment: Segment

  startedAt: number
  catechists: Catechist[]
  catechizings: Catechizing[]
  archivedAt?: Date | null
}

export class Classroom extends Entity<ClassroomProps> {
  get location(): string {
    return this.props.location
  }

  get segment(): Segment {
    return this.props.segment
  }

  get startedAt(): number {
    return this.props.startedAt
  }

  get catechists(): Catechist[] {
    return this.props.catechists
  }

  get catechizings(): Catechizing[] {
    return this.props.catechizings
  }

  // Data em que foi para o arquivo; null enquanto está ativo
  get archivedAt(): Date | null {
    return this.props.archivedAt ?? null
  }

  static create(props: ClassroomProps, id?: UniqueEntityID) {
    const classroom = new Classroom(props, id)

    return classroom
  }
}
