import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { Role } from '../../enums/role'

export class UpdateCatechistRequestDto {
  @IsUUID()
  id: string

  @IsString()
  name: string

  @IsString()
  nickname: string

  @Type(() => Date)
  @IsDate()
  birthday: Date

  @IsString()
  phone: string

  @IsString()
  address: string

  @Transform(({ value }) => value?.toLowerCase())
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
  @IsArray()
  @IsUUID('4', { each: true })
  classroomIds?: string[]

  @IsEnum(Role)
  role: Role
}
