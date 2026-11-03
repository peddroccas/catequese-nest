import { IsArray, IsEnum, IsNumber, IsUUID, Min } from 'class-validator'
import { Segment } from '../../enums/segment'

const currentYear = new Date().getFullYear()
export class CreateClassroomRequestDto {
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
