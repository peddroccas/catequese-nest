import { IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateParentRequestDto {
  @IsUUID()
  catechizingId: string

  @IsString()
  name: string

  @IsString()
  phone: string

  @IsOptional()
  @IsString()
  kinship: string
}
