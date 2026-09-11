import { Global, Module } from '@nestjs/common'
import { AuditLogService } from './audit-log.service.js'
import { LoggerService } from './logger.service.js'

@Global()
@Module({
  providers: [LoggerService, AuditLogService],
  exports: [LoggerService, AuditLogService],
})
export class LoggerModule {}
