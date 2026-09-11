import { NestFactory, Reflector } from '@nestjs/core'
import { ZodValidationPipe } from 'nestjs-zod'
import { AppModule } from './app.module.js'
import { AllExceptionFilter } from './common/filters/index.js'
import {
  LoggingInterceptor,
  TimeoutInterceptor,
  TransformInterceptor,
} from './common/interceptors/index.js'
import { LoggerService } from './common/logger/index.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  const reflector = app.get(Reflector)

  const logger = app.get(LoggerService)
  app.useLogger(logger)

  app.useGlobalFilters(new AllExceptionFilter())
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(),
    new TimeoutInterceptor(reflector),
  )
  app.useGlobalPipes(new ZodValidationPipe())
  app.enableShutdownHooks()
  app.enableCors()

  const port = process.env.PORT ?? 3001
  await app.listen(port)
  logger.log(
    `Application is running on: http://localhost:${port}`,
    'Bootstrap',
  )
}
await bootstrap()
