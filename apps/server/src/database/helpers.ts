import type { AnyMySqlColumn } from 'drizzle-orm/mysql-core'
import { isNull, sql } from 'drizzle-orm'
import { datetime, varchar } from 'drizzle-orm/mysql-core'

export const baseColumns = {
  id: varchar('id', { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  createdAt: datetime('createdAt', { mode: 'date', fsp: 6 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(6)`)
    .$defaultFn(() => new Date()),
  updatedAt: datetime('updatedAt', { mode: 'date', fsp: 6 })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`)
    .$defaultFn(() => new Date()),
}

export const softDeleteColumns = {
  deletedAt: datetime('deletedAt', { mode: 'date', fsp: 6 }),
}

export function notDeleted(table: { deletedAt: AnyMySqlColumn }) {
  return isNull(table.deletedAt)
}

export function isDuplicateError(error: unknown) {
  if (!(error instanceof Error)) {
    return false
  }

  const cause = (
    error as Error & { cause?: { code?: string, errno?: number } }
  ).cause

  return cause?.code === 'ER_DUP_ENTRY' || cause?.errno === 1062
}
