import { Injectable } from '@nestjs/common'
import { Payment } from '../entities/payment'

@Injectable()
export abstract class PaymentRepository {
  abstract findById(id: string): Promise<Payment | null>
  abstract findByCatechizing(catechizingId: string): Promise<Payment>
}
