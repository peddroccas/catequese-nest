import { IsUUID } from 'class-validator'

export class TransferCatechizingRequestDto {
  @IsUUID()
  id: string

  @IsUUID()
  classroomId: string
}
