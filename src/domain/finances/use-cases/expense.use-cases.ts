import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import {
  CreateExpenseRequestDto,
  UpdateExpenseRequestDto,
} from '../dtos/request/expense.dto'
import { Expense } from '../entities/expense'
import { ExpenseRepository } from '../repositories/expense.repository'

@Injectable()
export class FetchExpensesUseCase {
  constructor(private expenseRepository: ExpenseRepository) {}

  async execute(): Promise<Either<null, { expenses: Expense[] }>> {
    const expenses = await this.expenseRepository.findMany()

    return right({ expenses })
  }
}

@Injectable()
export class CreateExpenseUseCase {
  constructor(private expenseRepository: ExpenseRepository) {}

  async execute(
    data: CreateExpenseRequestDto,
    userId: string
  ): Promise<Either<null, { expense: Expense }>> {
    const expense = Expense.create({ ...data, createdById: userId })

    await this.expenseRepository.create(expense)

    return right({ expense })
  }
}

@Injectable()
export class UpdateExpenseUseCase {
  constructor(private expenseRepository: ExpenseRepository) {}

  async execute({
    id,
    ...data
  }: UpdateExpenseRequestDto): Promise<
    Either<ResourceNotFoundError, { expense: Expense }>
  > {
    const current = await this.expenseRepository.findById(id)

    if (!current) {
      return left(new ResourceNotFoundError())
    }

    // Quem registrou continua sendo o mesmo
    const expense = Expense.create(
      { ...data, createdById: current.createdById },
      current.id
    )

    await this.expenseRepository.update(expense)

    return right({ expense })
  }
}

@Injectable()
export class DeleteExpenseUseCase {
  constructor(private expenseRepository: ExpenseRepository) {}

  async execute(id: string): Promise<Either<ResourceNotFoundError, null>> {
    const expense = await this.expenseRepository.findById(id)

    if (!expense) {
      return left(new ResourceNotFoundError())
    }

    await this.expenseRepository.delete(id)

    return right(null)
  }
}
