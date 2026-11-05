import {
  AvatarStorage,
  AvatarUploadParams,
} from '@/domain/catechists/storage/avatar-storage'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvDTO } from '../env/env'
import { SupabaseBucketStorage } from './supabase-bucket-storage'

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

// Fotos de perfil dos catequistas
@Injectable()
export class SupabaseAvatarStorage
  extends SupabaseBucketStorage
  implements AvatarStorage
{
  constructor(config: ConfigService<EnvDTO, true>) {
    super(config, config.get('SUPABASE_AVATAR_BUCKET', { infer: true }))
  }

  upload({
    catechistId,
    body,
    contentType,
  }: AvatarUploadParams): Promise<string> {
    const extension = EXTENSIONS[contentType] ?? 'bin'
    // Nome novo a cada envio para o navegador não mostrar a foto antiga do cache
    const path = `${catechistId}/${Date.now()}.${extension}`

    return this.uploadObject(path, body, contentType, 'Falha ao enviar a foto')
  }

  delete(url: string): Promise<void> {
    return this.deleteObject(url)
  }
}
