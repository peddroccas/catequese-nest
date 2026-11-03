import { IsString, MinLength } from 'class-validator'

export class UpdateCatechistPasswordRequestDto {
  @IsString()
  @MinLength(6)
  password: string
}
