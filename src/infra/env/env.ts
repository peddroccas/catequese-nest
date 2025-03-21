import { IsJWT, IsNumber, IsUrl } from 'class-validator'

export class EnvDTO {
  @IsUrl()
  DATABASE_URL: string

  @IsJWT()
  JWT_SECRET: string

  @IsNumber()
  PORT: number
}
