import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsUUID,
  Matches,
  Min,
} from 'class-validator'
import { Transform } from 'class-transformer'
import { Segment } from '../../enums/segment'

const currentYear = new Date().getFullYear()
export class CreateClassroomRequestDto {
  @IsString()
  @IsNotEmpty()
  location: string

  @IsEnum(Segment)
  segment: Segment

  @IsNumber()
  @Min(currentYear)
  startedAt: number

  @IsArray()
  @IsUUID('4', { each: true })
  catechistsId: string[]

  // Vazio remove o link
  @Transform(({ value }) => (typeof value === 'string' && value.trim()) || null)
  @IsOptional()
  @Matches(/^https:\/\/chat\.whatsapp\.com\/\S+$/, {
    message: 'Use o link de convite do grupo (https://chat.whatsapp.com/...)',
  })
  whatsappGroupLink?: string | null
}
