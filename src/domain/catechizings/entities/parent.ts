import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ParentProps {
  name: string
  phone: string
  kinship?: string
  catechizingId: UniqueEntityID
}

export class Parent extends Entity<ParentProps> {
  get name(): string {
    return this.props.name
  }

  get phone(): string {
    return this.props.phone
  }

  get kinship(): string | undefined {
    return this.props.kinship
  }

  get catechizingId(): UniqueEntityID {
    return this.props.catechizingId
  }

  static create(props: ParentProps, id?: UniqueEntityID) {
    const parent = new Parent(props, id)

    return parent
  }
}
