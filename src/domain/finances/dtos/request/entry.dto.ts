import { Transform, Type } from 'class-transformer'
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from 'class-validator'
import { EntrySource } from '../../enums/entry-source'
import { PaymentMethod } from '../../enums/payment-method'

// Texto opcional: vazio vira null
const optionalText = () =>
  Transform(({ value }) => (typeof value === 'string' && value.trim()) || null)

// Recebimento do carnê (catequistas e coordenação)
export class CarnePaymentRequestDto {
  @IsUUID(undefined, { message: 'Escolha o catequizando' })
  catechizingId: string

  // Quem pagou
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'Informe quem pagou' })
  payerName: string

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

class EntryDataRequestDto {
  @IsEnum(EntrySource)
  source: EntrySource

  @IsInt()
  @Min(1, { message: 'O valor deve ser maior que zero' })
  @Max(100_000_000)
  amountCents: number

  @Type(() => Date)
  @IsDate()
  date: Date

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod

  // Obrigatório no carnê; nas outras origens é opcional
  @optionalText()
  @ValidateIf(entry => entry.source === EntrySource.CARNE)
  @IsString()
  @IsNotEmpty({ message: 'Informe quem pagou' })
  payerName?: string | null

  @optionalText()
  @IsOptional()
  @IsString()
  description?: string | null

  // Só no carnê
  @Transform(({ value }) => value || null)
  @ValidateIf(entry => entry.source === EntrySource.CARNE)
  @IsUUID(undefined, { message: 'Escolha o catequizando' })
  catechizingId?: string | null
}

export class CreateEntryRequestDto extends EntryDataRequestDto {}

export class UpdateEntryRequestDto extends EntryDataRequestDto {
  @IsUUID()
  id: string
}
