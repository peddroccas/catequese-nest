import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { CryptographyModule } from './cryptography/cryptography.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    CryptographyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
