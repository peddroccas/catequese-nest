import { IsOptional, IsString } from 'class-validator'

export class CreateParentRequestDto {
  @IsString()
  name: string

  @IsString()
  phone: string

  @IsOptional()
  @IsString()
  kinship: string
}
