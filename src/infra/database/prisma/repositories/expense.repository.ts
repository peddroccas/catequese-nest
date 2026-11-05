import { Expense } from '@/domain/finances/entities/expense'
import { ExpenseRepository } from '@/domain/finances/repositories/expense.repository'
import { Injectable } from '@nestjs/common'
import { ExpenseMapper, expenseInclude } from '../mappers/finance.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaExpenseRepository implements ExpenseRepository {
  constructor(private db: PrismaService) {}

  async create(expense: Expense): Promise<void> {
    await this.db.expense.create({ data: ExpenseMapper.toPrisma(expense) })
  }

  async update(expense: Expense): Promise<void> {
    const { id, ...data } = ExpenseMapper.toPrisma(expense)

    await this.db.expense.update({ where: { id }, data })
  }

  async delete(id: string): Promise<void> {
    await this.db.expense.delete({ where: { id } })
  }

  async findById(id: string): Promise<Expense | null> {
    const expense = await this.db.expense.findUnique({
      where: { id },
      include: expenseInclude,
    })

    return expense ? ExpenseMapper.toDomain(expense) : null
  }

  async findMany(): Promise<Expense[]> {
    const expenses = await this.db.expense.findMany({
      include: expenseInclude,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    })

    return expenses.map(ExpenseMapper.toDomain)
  }
}
