import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  test: {
    name: 'client',
    environment: 'node',
    include: ['app/**/*.test.ts'],
    exclude: ['node_modules/**', '.nuxt/**', 'dist/**', '.output/**'],
  },
})
