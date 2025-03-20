import { IsArray, IsEnum, IsNumber, IsUUID, Min } from 'class-validator'
import { Segment } from '../../enums/segment'
import dayjs from 'dayjs'

const currentYear = dayjs().year()
export class UpdateClassroomRequestDto {
  @IsUUID()
  id: string

  @IsNumber()
  roomNumber: number

  @IsEnum(Segment)
  segment: Segment

  @IsNumber()
  @Min(currentYear)
  startedAt: number

  @IsArray()
  @IsUUID('4', { each: true })
  catechistsId: string[]
}
