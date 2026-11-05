import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PaymentMethod } from '../enums/payment-method'

export interface ExpenseProps {
  // Destinação: com o que foi gasto
  description: string
  amountCents: number
  date: Date
  paymentMethod: PaymentMethod
  createdById?: string | null
  // Só na leitura
  createdByName?: string | null
}

export class Expense extends Entity<ExpenseProps> {
  get description(): string {
    return this.props.description
  }

  get amountCents(): number {
    return this.props.amountCents
  }

  get date(): Date {
    return this.props.date
  }

  get paymentMethod(): PaymentMethod {
    return this.props.paymentMethod
  }

  get createdById(): string | null {
    return this.props.createdById ?? null
  }

  get createdByName(): string | null {
    return this.props.createdByName ?? null
  }

  static create(props: ExpenseProps, id?: UniqueEntityID) {
    return new Expense(props, id)
  }
}
