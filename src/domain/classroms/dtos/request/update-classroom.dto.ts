import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  Matches,
  Min,
} from 'class-validator'
import { Transform } from 'class-transformer'
import { Segment } from '../../enums/segment'

export class UpdateClassroomRequestDto {
  @IsUUID()
  id: string

  @IsString()
  @IsNotEmpty()
  location: string

  @IsEnum(Segment)
  segment: Segment

  // Turmas antigas continuam editáveis, por isso não exige o ano atual
  @IsInt()
  @Min(2023)
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
