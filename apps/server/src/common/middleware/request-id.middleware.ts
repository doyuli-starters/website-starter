import { randomUUID } from 'node:crypto'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.requestId = randomUUID()

    const incomingTraceId = req.headers['x-trace-id']
    req.traceId
      = typeof incomingTraceId === 'string' ? incomingTraceId : randomUUID()

    res.setHeader('X-Request-Id', req.requestId)
    res.setHeader('X-Trace-Id', req.traceId)
    next()
  }
}
