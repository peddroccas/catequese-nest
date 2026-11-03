import { IsBoolean, IsUUID } from 'class-validator'

export class AttendanceRequestDto {
  @IsUUID()
  catechistId: string

  @IsBoolean()
  isPresent: boolean
}
