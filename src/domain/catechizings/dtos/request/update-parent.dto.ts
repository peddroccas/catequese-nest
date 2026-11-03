import { IsOptional, IsString, IsUUID } from 'class-validator'

export class UpdateParentRequestDto {
  @IsOptional()
  @IsUUID()
  id?: string

  @IsString()
  name: string

  @IsString()
  phone: string

  @IsString()
  kinship: string
}
