import { useStorage } from '@vueuse/core'

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
  path: string
}

export const authToken = useStorage<string | null>('auth_token', null)

export const $api = $fetch.create({
  baseURL: '/api',
  onRequest({ options }) {
    if (authToken.value) {
      const headers = (options.headers = new Headers(options.headers))
      headers.set('Authorization', `Bearer ${authToken.value}`)
    }
  },
  onResponseError({ response }) {
    if (response.status === 401) {
      authToken.value = null
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
  },
})
