import { IsNumber, IsUUID } from 'class-validator'

export class CreateInstallmentRequestDto {
  @IsUUID()
  catechizingId: string

  @IsNumber()
  value: number
}
