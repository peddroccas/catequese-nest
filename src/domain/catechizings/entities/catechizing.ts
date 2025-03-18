import { Entity } from '@/core/entities/entity'
import { Parent } from './parent'
import { Payment } from './payment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CatechizingProps {
  name: string
  birthday: Date
  address: string
  personWithSpecialNeeds: boolean

  hasReceivedBaptism: boolean
  hasReceivedEucharist: boolean
  hasReceivedMarriage: boolean

  classroomId?: UniqueEntityID
  parents: Parent[]
  payment: Payment
}

export class Catechizing extends Entity<CatechizingProps> {
  get name(): string {
    return this.props.name
  }

  get birthday(): Date {
    return this.props.birthday
  }

  get address(): string {
    return this.props.address
  }

  get personWithSpecialNeeds(): boolean {
    return this.props.personWithSpecialNeeds
  }

  get hasReceivedBaptism(): boolean {
    return this.props.hasReceivedBaptism
  }

  get hasReceivedEucharist(): boolean {
    return this.props.hasReceivedEucharist
  }

  get hasReceivedMarriage(): boolean {
    return this.props.hasReceivedMarriage
  }

  get parents(): Parent[] {
    return this.props.parents
  }

  get payment(): Payment {
    return this.props.payment
  }

  static create(props: CatechizingProps, id?: UniqueEntityID) {
    const catechizing = new Catechizing(props, id)

    return catechizing
  }
}
