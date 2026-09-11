import type { Database } from '#/database/index.js'
import { Inject, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import { decryptPassword } from '@website-starter/shared'
import { eq } from 'drizzle-orm'
import { ERROR_CODES } from '#/common/constants/index.js'
import { EmitEvent } from '#/common/enums/index.js'
import { UserRegisteredEvent } from '#/common/events/events/index.js'
import { BusinessException } from '#/common/exceptions/index.js'
import { AuditAction, AuditLogService } from '#/common/logger/index.js'
import { comparePassword, hashPassword } from '#/common/utils/index.js'
import { DATABASE_CONNECTION, isDuplicateError, userTable } from '#/database/index.js'
import { LoginDto } from './dto/login.dto.js'
import { RegisterDto } from './dto/register.dto.js'

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private auditLogService: AuditLogService,
    private eventEmitter: EventEmitter2,
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  async register({ email, password }: RegisterDto, name?: string) {
    const [existing] = await this.db
      .select({ id: userTable.id })
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1)

    if (existing) {
      throw new BusinessException(
        ERROR_CODES.AUTH.EMAIL_EXISTS.code,
        ERROR_CODES.AUTH.EMAIL_EXISTS.message,
      )
    }

    const userId = crypto.randomUUID()

    const rawPassword = await decryptPassword(password)
    try {
      await this.db.insert(userTable).values({
        id: userId,
        email,
        password: await hashPassword(rawPassword),
        name: name ?? null,
      })
    }
    catch (error) {
      if (isDuplicateError(error)) {
        throw new BusinessException(
          ERROR_CODES.AUTH.EMAIL_EXISTS.code,
          ERROR_CODES.AUTH.EMAIL_EXISTS.message,
        )
      }
      throw error
    }

    this.auditLogService.log({
      action: AuditAction.USER_REGISTER,
      userId,
      metadata: { email },
    })

    this.eventEmitter.emit(
      EmitEvent.USER_REGISTERED,
      new UserRegisteredEvent(userId, email),
    )

    return this.generateToken({ id: userId, email, role: 'user' })
  }

  async login({ email, password }: LoginDto) {
    const [user] = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1)

    const rawPassword = await decryptPassword(password)
    if (!user?.password || !(await comparePassword(rawPassword, user.password))) {
      throw new BusinessException(
        ERROR_CODES.AUTH.INVALID_CREDENTIALS.code,
        ERROR_CODES.AUTH.INVALID_CREDENTIALS.message,
      )
    }

    this.auditLogService.log({
      action: AuditAction.USER_LOGIN,
      userId: user.id,
      metadata: { email },
    })

    return this.generateToken(user)
  }

  private generateToken(user: { id: string, email: string, role?: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role ?? 'user' }
    return { access_token: this.jwtService.sign(payload), userId: user.id }
  }
}
