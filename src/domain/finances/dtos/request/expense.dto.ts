import { Transform, Type } from 'class-transformer'
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator'
import { PaymentMethod } from '../../enums/payment-method'

class ExpenseDataRequestDto {
  // Com o que foi gasto
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'Informe com o que foi gasto' })
  description: string

  @IsInt()
  @Min(1, { message: 'O valor deve ser maior que zero' })
  @Max(100_000_000)
  amountCents: number

  @Type(() => Date)
  @IsDate()
  date: Date

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod
}

export class CreateExpenseRequestDto extends ExpenseDataRequestDto {}

export class UpdateExpenseRequestDto extends ExpenseDataRequestDto {
  @IsUUID()
  id: string
}
