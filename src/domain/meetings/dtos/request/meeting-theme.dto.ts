import { Transform } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator'
import { Itinerary } from '../../enums/itinerary'

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value

export class FetchMeetingThemesRequestDto {
  @IsOptional()
  @IsEnum(Itinerary)
  itinerary?: Itinerary
}

export class CreateMeetingThemeRequestDto {
  @IsEnum(Itinerary)
  itinerary: Itinerary

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  phase: string

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  name: string
}

export class UpdateMeetingThemeRequestDto {
  @IsUUID()
  id: string

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  phase: string

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  name: string
}
