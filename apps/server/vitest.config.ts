import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '#': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    name: 'server',
    globals: true,
    root: fileURLToPath(new URL('.', import.meta.url)),
    include: ['**/*.spec.ts', '**/*.test.ts'],
  },
})
