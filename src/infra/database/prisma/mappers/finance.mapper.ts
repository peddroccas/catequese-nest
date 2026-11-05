import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Entry } from '@/domain/finances/entities/entry'
import { Expense } from '@/domain/finances/entities/expense'
import { EntrySource } from '@/domain/finances/enums/entry-source'
import { PaymentMethod } from '@/domain/finances/enums/payment-method'
import {
  CashEntry as PrismaCashEntry,
  Expense as PrismaExpense,
  Prisma,
} from '@prisma/client'

export const expenseInclude = {
  createdBy: { select: { name: true } },
} satisfies Prisma.ExpenseInclude

export const entryInclude = {
  createdBy: { select: { name: true } },
  catechizing: { select: { name: true } },
} satisfies Prisma.CashEntryInclude

type PrismaExpenseWithRelations = PrismaExpense & {
  createdBy: { name: string } | null
}

type PrismaEntryWithRelations = PrismaCashEntry & {
  createdBy: { name: string } | null
  catechizing: { name: string } | null
}

export class ExpenseMapper {
  static toDomain(raw: PrismaExpenseWithRelations): Expense {
    return Expense.create(
      {
        description: raw.description,
        amountCents: raw.amountCents,
        date: raw.date,
        paymentMethod: PaymentMethod[raw.paymentMethod],
        createdById: raw.createdById,
        createdByName: raw.createdBy?.name ?? null,
      },
      new UniqueEntityID(raw.id)
    )
  }

  // createdAt é preenchido pelo banco
  static toPrisma(expense: Expense): Omit<PrismaExpense, 'createdAt'> {
    return {
      id: expense.id.toString(),
      description: expense.description,
      amountCents: expense.amountCents,
      date: expense.date,
      paymentMethod: expense.paymentMethod,
      createdById: expense.createdById,
    }
  }
}

export class EntryMapper {
  static toDomain(raw: PrismaEntryWithRelations): Entry {
    return Entry.create(
      {
        source: EntrySource[raw.source],
        amountCents: raw.amountCents,
        date: raw.date,
        paymentMethod: PaymentMethod[raw.paymentMethod],
        payerName: raw.payerName,
        description: raw.description,
        catechizingId: raw.catechizingId
          ? new UniqueEntityID(raw.catechizingId)
          : null,
        catechizingName: raw.catechizing?.name ?? null,
        createdById: raw.createdById,
        createdByName: raw.createdBy?.name ?? null,
      },
      new UniqueEntityID(raw.id)
    )
  }

  // createdAt é preenchido pelo banco
  static toPrisma(entry: Entry): Omit<PrismaCashEntry, 'createdAt'> {
    return {
      id: entry.id.toString(),
      source: entry.source,
      amountCents: entry.amountCents,
      date: entry.date,
      paymentMethod: entry.paymentMethod,
      payerName: entry.payerName,
      description: entry.description,
      catechizingId: entry.catechizingId?.toString() ?? null,
      createdById: entry.createdById,
    }
  }
}
