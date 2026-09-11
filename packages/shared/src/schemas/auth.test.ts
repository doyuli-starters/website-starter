import { describe, expect, it } from 'vitest'
import { loginSchema, registerSchema } from '..'

describe('auth schemas', () => {
  it('接受合法的登录输入', () => {
    expect(loginSchema.safeParse({ email: 'user@example.com', password: 'x' }).success).toBe(true)
  })

  it('拒绝非法邮箱', () => {
    expect(loginSchema.safeParse({ email: 'nope', password: 'x' }).success).toBe(false)
  })

  it('注册要求强密码', () => {
    expect(registerSchema.safeParse({ email: 'user@example.com', password: 'weak' }).success).toBe(false)
    expect(registerSchema.safeParse({ email: 'user@example.com', password: 'Strong123' }).success).toBe(true)
  })
})
