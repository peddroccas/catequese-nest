import { IsString, IsUUID } from 'class-validator'

export class UpdateCatechistPasswordRequestDto {
  @IsUUID()
  id: string

  @IsString()
  password: string
}
