import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import { Parent } from '../../entities/parent'
import { Type } from 'class-transformer'
import { CreateParentRequestDto } from './create-parent.dto'

export class CreateCatechizingRequestDto {
  @IsString()
  name: string

  @IsDate()
  birthday: Date

  @IsString()
  address: string

  @IsBoolean()
  hasReceivedBaptism: boolean

  @IsBoolean()

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

  @ValidateNested({ each: true }) // Valida cada item do array
  @Type(() => CreateParentRequestDto) // Converte para a classe ParentDto
  parents: Parent[]
}
