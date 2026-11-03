import { IsArray, IsEnum, IsInt, IsNumber, IsUUID, Min } from 'class-validator'
import { Segment } from '../../enums/segment'

export class UpdateClassroomRequestDto {
  @IsUUID()
  id: string

  @IsNumber()
  roomNumber: number

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
