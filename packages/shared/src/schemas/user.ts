import { z } from 'zod'
import { emailSchema, strongPasswordSchema } from './common'

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, { message: '原密码不能为空' }),
  newPassword: strongPasswordSchema,
})

export const updateUserSchema = z.object({
  email: emailSchema,
  password: strongPasswordSchema,
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
