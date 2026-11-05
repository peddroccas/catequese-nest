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
  // Documentos das inscrições (RG, certidões...): bucket PRIVADO
  SUPABASE_REGISTRATIONS_BUCKET: z.string().optional().default('registrations'),
  // Quantos proxies existem na frente da API (Render, Railway...). A inscrição
  // pública limita envios por IP e precisa do IP real de quem enviou
  TRUST_PROXY_HOPS: z.coerce.number().int().min(0).optional().default(1),
})

export type EnvDTO = z.infer<typeof envSchema>
