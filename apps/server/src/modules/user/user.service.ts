import type { Database } from '#/database/index.js'
import { Inject, Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { ERROR_CODES } from '#/common/constants/index.js'
import { Cacheable, CacheEvict } from '#/common/decorators/index.js'
import { BusinessException } from '#/common/exceptions/index.js'
import { AuditAction, AuditLogService } from '#/common/logger/index.js'
import { comparePassword, hashPassword } from '#/common/utils/index.js'
import { DATABASE_CONNECTION, userTable } from '#/database/index.js'
import { ChangePasswordDto } from './dto/change-password.dto.js'

const USER_CACHE_PREFIX = 'user:profile'
const USER_CACHE_TTL = 300

const profileColumns = {
  id: userTable.id,
  email: userTable.email,
  name: userTable.name,
  role: userTable.role,
  createdAt: userTable.createdAt,
  updatedAt: userTable.updatedAt,
}

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
    private readonly auditLogService: AuditLogService,
  ) {}

  @Cacheable({
    prefix: USER_CACHE_PREFIX,
    ttl: USER_CACHE_TTL,
    key: (id: string) => id,
  })
  async findOne(id: string) {
    const [user] = await this.db
      .select(profileColumns)
      .from(userTable)
      .where(eq(userTable.id, id))
      .limit(1)

    if (!user) {
      throw new BusinessException(
        ERROR_CODES.USER.NOT_FOUND.code,
        ERROR_CODES.USER.NOT_FOUND.message,
      )
    }
    return user
  }

  @CacheEvict({
    prefix: USER_CACHE_PREFIX,
    key: (id: string) => id,
  })
  async changePassword(id: string, dto: ChangePasswordDto) {
    const [user] = await this.db
      .select({ password: userTable.password })
      .from(userTable)
      .where(eq(userTable.id, id))
      .limit(1)

    if (!user) {
      throw new BusinessException(
        ERROR_CODES.USER.NOT_FOUND.code,
        ERROR_CODES.USER.NOT_FOUND.message,
      )
    }

    if (
      !user.password
      || !(await comparePassword(dto.oldPassword, user.password))
    ) {
      throw new BusinessException(
        ERROR_CODES.AUTH.INVALID_CREDENTIALS.code,
        ERROR_CODES.AUTH.INVALID_CREDENTIALS.message,
      )
    }

    await this.db
      .update(userTable)
      .set({ password: await hashPassword(dto.newPassword) })
      .where(eq(userTable.id, id))

    this.auditLogService.log({
      action: AuditAction.PASSWORD_CHANGE,
      userId: id,
    })
  }
}
