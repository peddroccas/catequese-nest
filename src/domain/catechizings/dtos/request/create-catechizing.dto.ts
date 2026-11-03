import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { CreateParentRequestDto } from './create-parent.dto'

export class CreateCatechizingRequestDto {
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

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true }) // Valida cada item do array
  @Type(() => CreateParentRequestDto) // Converte para a classe ParentDto
  parents: CreateParentRequestDto[]
}
