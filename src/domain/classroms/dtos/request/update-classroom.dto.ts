import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
} from 'class-validator'
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
}
