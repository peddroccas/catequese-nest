import { IsOptional, IsUUID } from 'class-validator'

export class RestoreCatechizingRequestDto {
  // Turma para onde volta; sem informar, volta para a turma de antes
  @IsOptional()
  @IsUUID()
  classroomId?: string
}
