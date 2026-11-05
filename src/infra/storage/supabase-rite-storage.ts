import {
  RiteFileUploadParams,
  RiteStorage,
} from '@/domain/rites/storage/rite-storage'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvDTO } from '../env/env'
import { SupabaseBucketStorage } from './supabase-bucket-storage'

// PDFs dos ritos
@Injectable()
export class SupabaseRiteStorage
  extends SupabaseBucketStorage
  implements RiteStorage
{
  constructor(config: ConfigService<EnvDTO, true>) {
    super(config, config.get('SUPABASE_RITES_BUCKET', { infer: true }))
  }

  upload({ riteId, fileId, body }: RiteFileUploadParams): Promise<string> {
    // Nome novo a cada arquivo, então o navegador nunca mostra um PDF antigo do cache
    const path = `${riteId}/${fileId}.pdf`

    return this.uploadObject(
      path,
      body,
      'application/pdf',
      'Falha ao enviar o PDF'
    )
  }

  delete(url: string): Promise<void> {
    return this.deleteObject(url)
  }
}
