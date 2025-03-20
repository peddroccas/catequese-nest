import {
  IsArray,
  IsBoolean,
  IsDate,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import { Parent } from '../../entities/parent'
import { Type } from 'class-transformer'
import { CreateParentRequestDto } from './create-parent.dto'
import { UpdateParentRequestDto } from './update-parent.dto'

export class UpdateCatechizingRequestDto {
  @IsUUID()
  id: string

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

  @ValidateNested({ each: true }) // Valida cada item do array
  @Type(() => UpdateParentRequestDto) // Converte para a classe ParentDto
  parents: Parent[]
}
