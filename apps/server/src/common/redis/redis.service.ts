import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'
import { RedisConfigOptions } from '#/config/redis.config.js'
import { setCacheClient } from '../decorators/cache.decorator.js'

const READY_TIMEOUT_MS = 5000
const MAX_RETRIES_PER_REQUEST = 2
const RECONNECT_DELAY_CAP_MS = 5000

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name)
  readonly client: Redis

  constructor(configService: ConfigService) {
    const config = configService.get<RedisConfigOptions>('redis')
    if (!config?.url) {
      throw new Error('Redis config is missing: REDIS_URL is required')
    }

    this.client = new Redis(config.url, {
      keyPrefix: config.keyPrefix,
      retryStrategy: times => Math.min(times * 200, RECONNECT_DELAY_CAP_MS),
      maxRetriesPerRequest: MAX_RETRIES_PER_REQUEST,
      enableOfflineQueue: false,
    })

    this.client.on('error', (err: Error) => {
      this.logger.error(`Redis error: ${err.message}`, err.stack)
    })
    this.client.on('reconnecting', (delay?: number) => {
      this.logger.warn(`Redis reconnecting in ${delay ?? 0}ms`)
    })
    this.client.on('ready', () => {
      this.logger.log('Redis connection ready')
    })
    this.client.on('close', () => {
      this.logger.log('Redis connection closed')
    })
  }

  async onModuleInit() {
    if (this.client.status === 'ready') {
      setCacheClient(this.client)
      return
    }

    try {
      await new Promise<void>((resolve, reject) => {
        let timer: ReturnType<typeof setTimeout>
        const cleanup = () => {
          clearTimeout(timer)
          this.client.off('ready', onReady)
          this.client.off('end', onEnd)
        }
        function onReady() {
          cleanup()
          resolve()
        }
        function onEnd() {
          cleanup()
          reject(new Error('Redis connection ended before becoming ready'))
        }
        timer = setTimeout(() => {
          cleanup()
          reject(
            new Error(
              `Redis not ready within ${READY_TIMEOUT_MS}ms (status: ${this.client.status})`,
            ),
          )
        }, READY_TIMEOUT_MS)

        this.client.once('ready', onReady)
        this.client.once('end', onEnd)
      })

      setCacheClient(this.client)
    }
    catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      this.logger.warn(
        `Redis connection failed to become ready: ${message}. Running in degraded mode without cache.`,
      )
      setCacheClient(null)
    }
  }

  async onModuleDestroy() {
    setCacheClient(null)
    try {
      await this.client.quit()
    }
    catch {
      this.client.disconnect()
    }
  }
}
