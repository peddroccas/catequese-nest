import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface InstallmenteProps {
  payedAt: Date
  value: number
  paymentId: UniqueEntityID
}

export class Installment extends Entity<InstallmenteProps> {
  get payedAt(): Date {
    return this.props.payedAt
  }

  get value(): number {
    return this.props.value
  }

  get paymentId(): UniqueEntityID {
    return this.props.paymentId
  }

  static create(props: InstallmenteProps, id?: UniqueEntityID) {
    const installment = new Installment(props, id)

    return installment
  }
}
