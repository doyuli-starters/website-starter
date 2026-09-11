import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { EventsModule } from './common/events/events.module.js'
import { JwtAuthGuard, RolesGuard } from './common/guards/index.js'
import { LoggerModule } from './common/logger/index.js'
import { LoggerMiddleware, RequestIdMiddleware } from './common/middleware/index.js'
import { RedisModule } from './common/redis/index.js'
import { appConfig, configValidationSchema, databaseConfig, jwtConfig, redisConfig } from './config/index.js'
import { DatabaseModule } from './database/database.module.js'
import { AuthModule } from './modules/auth/auth.module.js'
import { UserModule } from './modules/user/user.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [appConfig, databaseConfig, jwtConfig, redisConfig],
      validationSchema: configValidationSchema,
    }),
    DatabaseModule,
    LoggerModule,
    RedisModule,
    EventsModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, LoggerMiddleware).forRoutes('*')
  }
}
