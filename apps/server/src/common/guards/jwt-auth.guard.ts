import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { ERROR_CODES } from '../constants/index.js'
import { Public } from '../decorators/index.js'
import { AuthException } from '../exceptions/index.js'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(Public, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    return super.canActivate(context)
  }

  override handleRequest<User = any>(err: unknown, user: User, info: unknown) {
    if (err) {
      throw err
    }

    if (info instanceof Error) {
      if (info.name === 'TokenExpiredError') {
        throw new AuthException(
          ERROR_CODES.AUTH.TOKEN_EXPIRED.code,
          ERROR_CODES.AUTH.TOKEN_EXPIRED.message,
        )
      }
      if (info.name === 'JsonWebTokenError' || info.name === 'NotBeforeError') {
        throw new AuthException(
          ERROR_CODES.AUTH.TOKEN_INVALID.code,
          ERROR_CODES.AUTH.TOKEN_INVALID.message,
        )
      }
    }

    if (!user) {
      throw new AuthException(
        ERROR_CODES.AUTH.UNAUTHORIZED.code,
        ERROR_CODES.AUTH.UNAUTHORIZED.message,
      )
    }

    return user
  }
}
