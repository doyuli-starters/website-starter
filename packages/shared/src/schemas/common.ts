import { z } from 'zod'

export const emailSchema = z.email({ message: '邮箱格式不正确' })

export const strongPasswordSchema = z
  .string()
  .min(8, { message: '密码至少8位' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: '密码必须包含大小写字母和数字',
  })
