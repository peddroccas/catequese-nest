import { AvatarStorage } from '@/domain/catechists/storage/avatar-storage'
import { RiteStorage } from '@/domain/rites/storage/rite-storage'
import { RegistrationStorage } from '@/domain/registrations/storage/registration-storage'
import { Global, Module } from '@nestjs/common'
import { SupabaseAvatarStorage } from './supabase-avatar-storage'
import { SupabaseRiteStorage } from './supabase-rite-storage'
import { SupabaseRegistrationStorage } from './supabase-registration-storage'

@Global()
@Module({
  providers: [
    { provide: AvatarStorage, useClass: SupabaseAvatarStorage },
    { provide: RiteStorage, useClass: SupabaseRiteStorage },
    { provide: RegistrationStorage, useClass: SupabaseRegistrationStorage },
  ],
  exports: [AvatarStorage, RiteStorage, RegistrationStorage],
})
export class StorageModule {}
