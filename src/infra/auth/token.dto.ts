import { Role } from '@/domain/catechists/enums/role'
import { IsEnum, IsUUID } from 'class-validator'

export class UserPayload {
  @IsUUID()
  sub: string

  @IsEnum(Role)
  role: Role
}
