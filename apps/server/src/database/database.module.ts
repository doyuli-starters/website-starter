import type { Database } from './database.types.js'
import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema/index.js'

export const DATABASE_CONNECTION = Symbol('DATABASE_CONNECTION')

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const pool = mysql.createPool({
          uri: configService.getOrThrow<string>('database.url'),
          connectionLimit: 20,
          maxIdle: 20,
          idleTimeout: 30000,
          connectTimeout: 2000,
        })
        return drizzle({ client: pool, schema, mode: 'default' })
      },
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  onApplicationShutdown() {
    this.db.$client.end()
  }
}
