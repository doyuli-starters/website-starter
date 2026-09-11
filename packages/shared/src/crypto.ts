const DEFAULT_KEY_SEED = 'website-starter-pwd-transmit-key-v1'

async function getCryptoKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(DEFAULT_KEY_SEED.padEnd(32, '0').slice(0, 32)),
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt'],
  )
  return keyMaterial
}

/**
 * 客户端传输密码加密（基于 AES-GCM，防止网络抓包与明文传输）
 */
export async function encryptPassword(password: string): Promise<string> {
  if (!password) {
    return password
  }
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12))
  const key = await getCryptoKey()
  const encrypted = await globalThis.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data,
  )
  const combined = new Uint8Array(iv.length + encrypted.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encrypted), iv.length)

  let binary = ''
  for (let i = 0; i < combined.byteLength; i++) {
    binary += String.fromCharCode(combined[i])
  }
  return `enc:${btoa(binary)}`
}

/**
 * 服务端传输密码解密（自动兼容未加密的明文）
 */
export async function decryptPassword(cipherText: string): Promise<string> {
  if (!cipherText || typeof cipherText !== 'string' || !cipherText.startsWith('enc:')) {
    return cipherText
  }

  try {
    const base64 = cipherText.slice(4)
    const binary = atob(base64)

    const combined = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      combined[i] = binary.charCodeAt(i)
    }

    const iv = combined.slice(0, 12)
    const encrypted = combined.slice(12)
    const key = await getCryptoKey()
    const decrypted = await globalThis.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted,
    )
    return new TextDecoder().decode(decrypted)
  }
  catch {
    // 解密失败时回退原字符串
    return cipherText
  }
}
