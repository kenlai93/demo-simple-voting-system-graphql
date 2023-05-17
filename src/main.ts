import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupApp } from './setup'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  setupApp(app)
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? '*' : '*',
  })
  await app.listen(3000)
}
bootstrap()
