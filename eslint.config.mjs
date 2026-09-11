// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    pnpm: true,
    vue: true,
  },
  {
    name: 'website-starter/server',
    files: ['apps/server/**/*.ts'],
    rules: {
      'ts/consistent-type-imports': 'off',
      'node/prefer-global/process': 'off',
      'antfu/no-top-level-await': 'off',
    },
  },
)
