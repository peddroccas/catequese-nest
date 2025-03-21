import { Injectable } from '@nestjs/common'
import { Payment } from '../entities/payment'

@Injectable()
export abstract class PaymentRepository {
  abstract create(payment: Payment): Promise<void>
  abstract findById(id: string): Promise<Payment | null>
  abstract findByCatechizing(catechizingId: string): Promise<Payment>
  abstract updateToBePaid(id: string, value: number): Promise<void>
}
