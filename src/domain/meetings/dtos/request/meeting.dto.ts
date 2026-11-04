import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsUUID,
  ValidateNested,
} from 'class-validator'

export class FetchClassroomMeetingsRequestDto {
  @IsUUID()
  classroomId: string
}

export class MeetingAttendanceRequestDto {
  @IsUUID()
  catechizingId: string

  @IsBoolean()
  isPresent: boolean
}

class MeetingDataRequestDto {
  @Type(() => Date)
  @IsDate()
  date: Date

  // Pelo menos um tema; dá para juntar encontros
  @IsArray()
  @ArrayMinSize(1, { message: 'Escolha pelo menos um tema' })
  @IsUUID('all', { each: true })
  themeIds: string[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MeetingAttendanceRequestDto)
  attendances: MeetingAttendanceRequestDto[]
}

export class CreateMeetingRequestDto extends MeetingDataRequestDto {
  @IsUUID()
  classroomId: string
}

export class UpdateMeetingRequestDto extends MeetingDataRequestDto {
  @IsUUID()
  id: string
}
