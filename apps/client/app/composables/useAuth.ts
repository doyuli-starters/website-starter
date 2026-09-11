import type { LoginInput } from '@__name__/shared'
import type { ApiResponse } from '@/lib/api'
import { encryptPassword } from '@__name__/shared'
import { $api, authToken } from '@/lib/api'

export interface UserInfo {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
  updatedAt: string
}

export function useAuth() {
  const token = authToken
  const user = useState<UserInfo | null>('auth_user', () => null)
  const loading = useState<boolean>('auth_loading', () => false)

  const isAuthenticated = computed(() => Boolean(token.value))

  async function fetchProfile(): Promise<UserInfo | null> {
    if (!token.value) {
      user.value = null
      return null
    }

    try {
      loading.value = true
      const res = await $api<ApiResponse<UserInfo>>('/user/profile')
      user.value = res.data
      return res.data
    }
    catch {
      token.value = null
      user.value = null
      return null
    }
    finally {
      loading.value = false
    }
  }

  async function login(input: LoginInput) {
    loading.value = true
    try {
      const encryptedPassword = await encryptPassword(input.password)

      const res = await $api<ApiResponse<{ access_token: string, userId: string }>>('/auth/login', {
        method: 'POST',
        body: {
          email: input.email,
          password: encryptedPassword,
        },
      })

      token.value = res.data.access_token
      await fetchProfile()
      return res.data
    }
    finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    fetchProfile,
  }
}
