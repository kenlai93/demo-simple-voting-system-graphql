import { INestApplication, ValidationPipe } from '@nestjs/common'

// setup codes that can be used in test file
export function setupApp(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  )
  return app
}
