import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { AttendanceRequestDto } from './attendance.dto'

export class CreateFormationRequestDto {
  @IsString()
  @IsNotEmpty()
  theme: string

  @Type(() => Date)
  @IsDate()
  date: Date

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRequestDto)
  attendances: AttendanceRequestDto[]
}
