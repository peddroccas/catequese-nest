import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvDTO } from '../env/env'

// Base dos storages no Supabase Storage. Usa a API REST direto, sem o SDK.
// Cada subclasse aponta para um bucket público
export abstract class SupabaseBucketStorage {
  private readonly logger = new Logger(SupabaseBucketStorage.name)
  private readonly url?: string
  private readonly key?: string

  protected constructor(
    config: ConfigService<EnvDTO, true>,
    private readonly bucket: string
  ) {
    this.url = config.get('SUPABASE_URL', { infer: true })?.replace(/\/$/, '')
    this.key = config.get('SUPABASE_SERVICE_ROLE_KEY', { infer: true })
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

  // Envia o arquivo e retorna a URL pública
  protected async uploadObject(
    path: string,
    body: Buffer,
    contentType: string,
    failureMessage: string
  ): Promise<string> {
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
        `${failureMessage} (${response.status}): ${await response.text()}`
      )
    }

    return `${this.url}/storage/v1/object/public/${this.bucket}/${path}`
  }

  // Só apaga URLs deste bucket; arquivo que ficou para trás não impede a troca
  protected async deleteObject(url: string): Promise<void> {
    const prefix = `${this.url}/storage/v1/object/public/${this.bucket}/`
    if (!url.startsWith(prefix)) {
      return
    }

    const response = await fetch(
      `${this.url}/storage/v1/object/${this.bucket}/${url.slice(prefix.length)}`,
      { method: 'DELETE', headers: this.authHeaders() }
    )

    if (!response.ok) {
      this.logger.warn(`Não foi possível apagar ${url} (${response.status})`)
    }
  }
}
