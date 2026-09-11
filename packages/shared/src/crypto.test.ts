import { describe, expect, it } from 'vitest'
import { decryptPassword, encryptPassword } from './crypto.js'

describe('crypto transport utility', () => {
  it('正确加密并解密密码', async () => {
    const raw = 'MySecretP@ss123'
    const encrypted = await encryptPassword(raw)

    expect(encrypted).not.toBe(raw)
    expect(encrypted.startsWith('enc:')).toBe(true)

    const decrypted = await decryptPassword(encrypted)
    expect(decrypted).toBe(raw)
  })

  it('解密未加密的明文时兼容返回原样', async () => {
    const raw = 'legacy-plain-password'
    const result = await decryptPassword(raw)
    expect(result).toBe(raw)
  })
})
