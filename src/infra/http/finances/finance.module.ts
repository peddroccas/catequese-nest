import {
  CreateEntryUseCase,
  CreateCarnePaymentUseCase,
  DeleteEntryUseCase,
  EntryBuilder,
  FetchCarnePaymentsUseCase,
  FetchEntriesUseCase,
  UpdateEntryUseCase,
} from '@/domain/finances/use-cases/entry.use-cases'
import {
  CreateExpenseUseCase,
  DeleteExpenseUseCase,
  FetchExpensesUseCase,
  UpdateExpenseUseCase,
} from '@/domain/finances/use-cases/expense.use-cases'
import { ClassroomAccess } from '@/domain/meetings/use-cases/meeting.use-cases'
import { Module } from '@nestjs/common'
import { CarneController } from './controllers/carne.controller'
import { EntryController } from './controllers/entry.controller'
import { ExpenseController } from './controllers/expense.controller'

@Module({
  controllers: [ExpenseController, EntryController, CarneController],
  providers: [
    ClassroomAccess,
    EntryBuilder,
    FetchExpensesUseCase,
    CreateExpenseUseCase,
    UpdateExpenseUseCase,
    DeleteExpenseUseCase,
    FetchEntriesUseCase,
    CreateEntryUseCase,
    UpdateEntryUseCase,
    DeleteEntryUseCase,
    FetchCarnePaymentsUseCase,
    CreateCarnePaymentUseCase,
  ],
})
export class FinanceModule {}
