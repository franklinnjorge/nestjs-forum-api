import swc from 'unplugin-swc'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/e2e-setup.ts']
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' }
    })
  ]
})
