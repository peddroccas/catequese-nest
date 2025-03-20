import { IsOptional, IsString, IsUUID } from 'class-validator'

export class UpdateParentRequestDto {
  @IsUUID()
  id: string

  @IsString()
  name: string

  @IsString()
  phone: string

  @IsOptional()
  @IsString()
  kinship: string
}
