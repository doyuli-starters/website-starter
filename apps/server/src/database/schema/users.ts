import { mysqlTable, varchar } from 'drizzle-orm/mysql-core'
import { baseColumns } from '../helpers.js'

export const userTable = mysqlTable('users', {
  ...baseColumns,
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  name: varchar('name', { length: 255 }),
  role: varchar('role', { length: 32 }).notNull().default('user'),
})

export type User = typeof userTable.$inferSelect
export type NewUser = typeof userTable.$inferInsert
