import { IsString } from 'class-validator'

export class CreateParentRequestDto {
  @IsString()
  name: string

  @IsString()
  phone: string

  @IsString()
  kinship: string
}
