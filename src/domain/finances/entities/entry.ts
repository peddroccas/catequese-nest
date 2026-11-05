import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EntrySource } from '../enums/entry-source'
import { PaymentMethod } from '../enums/payment-method'

export interface EntryProps {
  source: EntrySource
  amountCents: number
  date: Date
  paymentMethod: PaymentMethod
  // Quem pagou/doou/colaborou (obrigatório no carnê)
  payerName?: string | null
  description?: string | null
  // Só no carnê
  catechizingId?: UniqueEntityID | null
  createdById?: string | null
  // Só na leitura
  catechizingName?: string | null
  createdByName?: string | null
}

export class Entry extends Entity<EntryProps> {
  get source(): EntrySource {
    return this.props.source
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

  get payerName(): string | null {
    return this.props.payerName ?? null
  }

  get description(): string | null {
    return this.props.description ?? null
  }

  get catechizingId(): UniqueEntityID | null {
    return this.props.catechizingId ?? null
  }

  get catechizingName(): string | null {
    return this.props.catechizingName ?? null
  }

  get createdById(): string | null {
    return this.props.createdById ?? null
  }

  get createdByName(): string | null {
    return this.props.createdByName ?? null
  }

  static create(props: EntryProps, id?: UniqueEntityID) {
    return new Entry(props, id)
  }
}
