import { IsEnum, IsOptional } from 'class-validator'
import { Segment } from '../../enums/segment'

export class FetchAllClassroomsRequestDto {
  @IsOptional()
  @IsEnum(Segment)
  segment?: Segment
}
