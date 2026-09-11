import { z } from 'zod'
import { emailSchema, strongPasswordSchema } from './common'

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: '密码不能为空' }),
})

export const registerSchema = z.object({
  email: emailSchema,
  password: strongPasswordSchema,
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
