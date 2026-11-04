import {
  AvatarStorage,
  AvatarUploadParams,
} from '@/domain/catechists/storage/avatar-storage'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvDTO } from '../env/env'

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

// Usa a API REST do Supabase Storage direto, sem precisar do SDK
@Injectable()
export class SupabaseAvatarStorage implements AvatarStorage {
  private readonly logger = new Logger(SupabaseAvatarStorage.name)
  private readonly url?: string
  private readonly key?: string
  private readonly bucket: string

  constructor(config: ConfigService<EnvDTO, true>) {
    this.url = config.get('SUPABASE_URL', { infer: true })?.replace(/\/$/, '')
    this.key = config.get('SUPABASE_SERVICE_ROLE_KEY', { infer: true })
    this.bucket = config.get('SUPABASE_AVATAR_BUCKET', { infer: true })
  }

  // Chaves novas (sb_secret_...) vão só no header apikey; as antigas
  // (service_role, um JWT) também precisam do Authorization
  private authHeaders(): Record<string, string> {
    const headers: Record<string, string> = { apikey: this.key ?? '' }
    if (this.key?.startsWith('eyJ')) {
      headers.Authorization = `Bearer ${this.key}`
    }
    return headers
  }

  isEnabled(): boolean {
    return Boolean(this.url && this.key)
  }

  async upload({
    catechistId,
    body,
    contentType,
  }: AvatarUploadParams): Promise<string> {
    const extension = EXTENSIONS[contentType] ?? 'bin'
    // Nome novo a cada envio para o navegador não mostrar a foto antiga do cache
    const path = `${catechistId}/${Date.now()}.${extension}`

    const response = await fetch(
      `${this.url}/storage/v1/object/${this.bucket}/${path}`,
      {
        method: 'POST',
        headers: {
          ...this.authHeaders(),
          'Content-Type': contentType,
          'Cache-Control': 'max-age=31536000',
        },
        body: new Uint8Array(body),
      }
    )

    if (!response.ok) {
      throw new Error(
        `Falha ao enviar a foto (${response.status}): ${await response.text()}`
      )
    }

    return `${this.url}/storage/v1/object/public/${this.bucket}/${path}`
  }

  async delete(url: string): Promise<void> {
    const prefix = `${this.url}/storage/v1/object/public/${this.bucket}/`
    if (!url.startsWith(prefix)) {
      return
    }

    const response = await fetch(
      `${this.url}/storage/v1/object/${this.bucket}/${url.slice(prefix.length)}`,
      { method: 'DELETE', headers: this.authHeaders() }
    )

    // Arquivo antigo que ficou para trás não impede a troca de foto
    if (!response.ok) {
      this.logger.warn(`Não foi possível apagar ${url} (${response.status})`)
    }
  }
}
