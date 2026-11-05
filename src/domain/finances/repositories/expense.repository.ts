import { Injectable } from '@nestjs/common'
import { Expense } from '../entities/expense'

@Injectable()
export abstract class ExpenseRepository {
  abstract create(expense: Expense): Promise<void>
  abstract update(expense: Expense): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findById(id: string): Promise<Expense | null>
  // Mais recentes primeiro
  abstract findMany(): Promise<Expense[]>
}
