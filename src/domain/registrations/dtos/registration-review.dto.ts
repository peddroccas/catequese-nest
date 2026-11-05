import { IsBoolean, IsString, IsUUID, MaxLength, MinLength } from 'class-validator'

export class ApproveRegistrationRequestDto {
  @IsUUID()
  classroomId: string
}

export class RejectRegistrationRequestDto {
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  reason: string
}

export class SetRegistrationsOpenRequestDto {
  @IsBoolean()
  isOpen: boolean
}
