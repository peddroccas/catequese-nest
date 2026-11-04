import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { AttendanceRequestDto } from './attendance.dto'

export class UpdateFormationRequestDto {
  @IsUUID()
  id: string

  @IsString()
  @IsNotEmpty()
  theme: string

  // Vazio remove o formador
  @Transform(({ value }) => (typeof value === 'string' && value.trim()) || null)
  @IsOptional()
  @IsString()
  instructor?: string | null

  @Type(() => Date)
  @IsDate()
  date: Date

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRequestDto)
  attendances: AttendanceRequestDto[]
}
