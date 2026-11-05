import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { MaritalStatus } from '../../enums/marital-status'
import { UpdateParentRequestDto } from './update-parent.dto'

export class UpdateCatechizingRequestDto {
  @IsUUID()
  id: string

  @IsString()
  name: string

  @Type(() => Date)
  @IsDate()
  birthday: Date

  @IsString()
  address: string

  @IsBoolean()
  hasReceivedBaptism: boolean

  @IsBoolean()
  hasReceivedEucharist: boolean

  @IsBoolean()
  hasReceivedMarriage: boolean

  @IsUUID()
  classroomId: string

  @IsBoolean()
  personWithSpecialNeeds: boolean

  @IsBoolean()
  releasedToGoAwayAlone: boolean

  @IsOptional()
  @IsString()
  specialNeedsDescription?: string

  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus

  @IsOptional()
  @IsBoolean()
  livesWithPartner?: boolean

  @IsOptional()
  @IsString()
  shirtSize?: string

  @IsOptional()
  @IsString()
  foodRestriction?: string

  @IsOptional()
  @IsString()
  pickupAuthorizedBy?: string

  @IsArray()
  @ValidateNested({ each: true }) // Valida cada item do array
  @Type(() => UpdateParentRequestDto) // Converte para a classe ParentDto
  parents: UpdateParentRequestDto[]
}
