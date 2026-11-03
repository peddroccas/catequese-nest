import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { AttendanceRequestDto } from './attendance.dto'

export class UpdateFormationRequestDto {
  @IsUUID()
  id: string

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
