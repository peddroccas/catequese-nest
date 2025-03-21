import { Role } from '@/domain/catechists/enums/role'
import { z } from 'zod'

export const tokenSchema = z.object({
  sub: z.string().uuid(),
  role: z.nativeEnum(Role),
})

export type UserPayload = z.infer<typeof tokenSchema>
