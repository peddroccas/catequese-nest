import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { CryptographyModule } from './cryptography/cryptography.module'
import { HttpModule } from './http/http.module'
import { APP_PIPE } from '@nestjs/core'
import { ValidationPipe } from './http/pipes/validation.pipe'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    DatabaseModule,
    CryptographyModule,
    HttpModule,
  ],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
