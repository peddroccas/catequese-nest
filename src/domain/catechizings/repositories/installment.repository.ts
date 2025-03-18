import { Injectable } from '@nestjs/common'
import { Installment } from '../entities/installment'

@Injectable()
export abstract class InstallmentRepository {
  abstract create(installment: Installment): Promise<Installment>
  abstract update(installment: Installment): Promise<Installment>
  abstract delete(id: string): Promise<void>
}
