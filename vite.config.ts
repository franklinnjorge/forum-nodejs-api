import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
    globals: true,
    coverage: {
      include: ['src/**'], // Apenas o código fonte
      exclude: ['**/*.spec.ts', '**/*.spec.js'], // Exclui arquivos de teste
    },
  },
})
