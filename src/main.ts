import { NestFactory } from '@nestjs/core'
import { AppModule } from './infra/app.module'
import { ValidationPipe } from './infra/http/pipes/validation.pipe'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Configuração simples de CORS permitindo todas as origens
  app.enableCors({
    origin: '*', // Permite todas as origens (teste)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Authorization, Content-Type',
    credentials: true,
  })

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
