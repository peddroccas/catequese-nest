import { RegistrationStorage } from '@/domain/registrations/storage/registration-storage'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvDTO } from '../env/env'
import { SupabaseBucketStorage } from './supabase-bucket-storage'

// Documentos das inscrições (RG, certidões...). O bucket é PRIVADO: a URL
// pública não funciona e a coordenação abre cada arquivo por link temporário
@Injectable()
export class SupabaseRegistrationStorage
  extends SupabaseBucketStorage
  implements RegistrationStorage
{
  constructor(config: ConfigService<EnvDTO, true>) {
    super(config, config.get('SUPABASE_REGISTRATIONS_BUCKET', { infer: true }))
  }

  async upload(
    path: string,
    body: Buffer,
    contentType: string
  ): Promise<void> {
    await this.uploadObject(
      path,
      body,
      contentType,
      'Falha ao enviar o documento'
    )
  }

  download(path: string): Promise<Buffer> {
    return this.downloadObject(path)
  }

  createSignedUrl(path: string, expiresInSeconds: number): Promise<string> {
    return this.signObject(path, expiresInSeconds)
  }

  delete(path: string): Promise<void> {
    return this.deleteObjectByPath(path)
  }
}
