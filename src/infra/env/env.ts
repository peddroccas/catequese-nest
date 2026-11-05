import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().optional().default(3333),
  // Supabase Storage (fotos de perfil). Sem essas variáveis o upload fica desativado
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_AVATAR_BUCKET: z.string().optional().default('avatars'),
  // PDFs dos ritos (bucket público, criado no painel do Supabase)
  SUPABASE_RITES_BUCKET: z.string().optional().default('rites'),
})

export type EnvDTO = z.infer<typeof envSchema>
