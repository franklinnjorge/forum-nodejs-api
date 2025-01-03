import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
    coverage: {
      all: false,
    },
    dir: 'src',
  },
})
