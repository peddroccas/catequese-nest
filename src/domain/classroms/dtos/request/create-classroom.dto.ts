import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator'
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
}
