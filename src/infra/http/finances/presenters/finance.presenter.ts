import { Entry } from '@/domain/finances/entities/entry'
import { Expense } from '@/domain/finances/entities/expense'
import { toDateOnly } from '../../presenters/date.presenter'

export class ExpensePresenter {
  static toHTTP(expense: Expense) {
    return {
      id: expense.id.toString(),
      description: expense.description,
      amountCents: expense.amountCents,
      date: toDateOnly(expense.date),
      paymentMethod: expense.paymentMethod,
      createdByName: expense.createdByName,
    }
  }
}

export class EntryPresenter {
  static toHTTP(entry: Entry) {
    return {
      id: entry.id.toString(),
      source: entry.source,
      amountCents: entry.amountCents,
      date: toDateOnly(entry.date),
      paymentMethod: entry.paymentMethod,
      payerName: entry.payerName,
      description: entry.description,
      catechizingId: entry.catechizingId?.toString() ?? null,
      catechizingName: entry.catechizingName,
      createdByName: entry.createdByName,
    }
  }
}
