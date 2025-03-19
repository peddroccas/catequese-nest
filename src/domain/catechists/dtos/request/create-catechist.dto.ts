import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'
import { Role } from '../../enums/role'

export class CreateCatechistRequestDto {
  @IsString()
  name: string

  @IsString()
  nickname: string

  @IsDate()
  birthday: Date

  @IsString()
  phone: string

  @IsString()
  address: string

  @IsEmail()
  email: string

  @IsBoolean()
  hasReceivedBaptism: boolean

  @IsBoolean()
  hasReceivedConfirmation: boolean

  @IsBoolean()
  hasReceivedEucharist: boolean

  @IsBoolean()
  hasReceivedMarriage: boolean

  @IsOptional()
  @IsUUID()
  classroomId?: string

  @IsEnum(Role)
  role: Role
}
