import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './infra/app.module'
import { EnvDTO } from './infra/env/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // O front autentica via header Authorization (sem cookies), então não precisa de credentials
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Authorization, Content-Type',
  })

  const config = app.get<ConfigService<EnvDTO, true>>(ConfigService)

  await app.listen(config.get('PORT', { infer: true }))
}
bootstrap()
