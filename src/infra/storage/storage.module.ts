import { AvatarStorage } from '@/domain/catechists/storage/avatar-storage'
import { RiteStorage } from '@/domain/rites/storage/rite-storage'
import { Global, Module } from '@nestjs/common'
import { SupabaseAvatarStorage } from './supabase-avatar-storage'
import { SupabaseRiteStorage } from './supabase-rite-storage'

@Global()
@Module({
  providers: [
    { provide: AvatarStorage, useClass: SupabaseAvatarStorage },
    { provide: RiteStorage, useClass: SupabaseRiteStorage },
  ],
  exports: [AvatarStorage, RiteStorage],
})
export class StorageModule {}
