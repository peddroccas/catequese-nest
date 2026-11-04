import { resolve } from 'node:path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_PIPE } from '@nestjs/core'
import { AuthModule } from './auth/auth.module'
import { CryptographyModule } from './cryptography/cryptography.module'
import { DatabaseModule } from './database/database.module'
import { envSchema } from './env/env'
import { HttpModule } from './http/http.module'
import { ValidationPipe } from './http/pipes/validation.pipe'
import { StorageModule } from './storage/storage.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      // .env da pasta do projeto, mesmo quando a API é iniciada de outra pasta
      envFilePath: resolve(__dirname, '../../.env'),
      validate: env => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    CryptographyModule,
    StorageModule,
    HttpModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
