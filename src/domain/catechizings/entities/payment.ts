import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Installment } from './installment'
import { Entity } from '@/core/entities/entity'

export interface PaymentProps {
  toBePaid: number
  hasReceivedBooklet: boolean
  catechizingId: UniqueEntityID
  installments: Installment[]
}

export class Payment extends Entity<PaymentProps> {
  get toBePaid(): number {
    return this.props.toBePaid
  }

  get hasReceivedBooklet(): boolean {
    return this.props.hasReceivedBooklet
  }

  get catechizingId(): UniqueEntityID {
    return this.props.catechizingId
  }

  get installments(): Installment[] {
    return this.props.installments
  }

  static create(props: PaymentProps, id?: UniqueEntityID) {
    const payment = new Payment(props, id)

    return payment
  }
}
