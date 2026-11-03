import { IsUUID } from 'class-validator'

export class TransferCatechistRequestDto {
  @IsUUID()
  id: string

  @IsUUID()
  classroomId: string
}
