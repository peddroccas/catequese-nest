import { AvatarStorage } from '@/domain/catechists/storage/avatar-storage'
import { Global, Module } from '@nestjs/common'
import { SupabaseAvatarStorage } from './supabase-avatar-storage'

@Global()
@Module({
  providers: [{ provide: AvatarStorage, useClass: SupabaseAvatarStorage }],
  exports: [AvatarStorage],
})
export class StorageModule {}
