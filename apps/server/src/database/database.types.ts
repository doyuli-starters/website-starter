import type { MySql2Database } from 'drizzle-orm/mysql2'
import type * as schema from './schema/index.js'
import { Pool } from 'mysql2'

export type Database = MySql2Database<typeof schema> & { $client: Pool }
