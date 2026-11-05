import { Transform } from 'class-transformer'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator'

class RiteDataRequestDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty({ message: 'Informe o nome do rito' })
  @MaxLength(120)
  name: string

  // Vazio remove a descrição
  @Transform(({ value }) => (typeof value === 'string' && value.trim()) || null)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null
}

export class CreateRiteRequestDto extends RiteDataRequestDto {}

export class UpdateRiteRequestDto extends RiteDataRequestDto {
  @IsUUID()
  id: string
}
