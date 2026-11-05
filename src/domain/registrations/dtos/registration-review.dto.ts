import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator'
import { RegistrationSegment } from '../enums/registration'

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

// Muda só o que vier: abrir/fechar tudo e/ou escolher as etapas
export class UpdateRegistrationSettingsRequestDto {
  @IsOptional()
  @IsBoolean()
  isOpen?: boolean

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(RegistrationSegment, { each: true })
  openSegments?: RegistrationSegment[]
}
