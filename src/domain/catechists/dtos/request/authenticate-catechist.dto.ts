import { IsEmail, IsString } from 'class-validator'

export class AuthenticateCatechistRequestDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}
