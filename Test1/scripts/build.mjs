import { fileURLToPath, URL } from 'node:url'

import { patchEsbuild } from './esbuild-shim.mjs'

patchEsbuild()

const [{ build }, { default: vue }] = await Promise.all([
  import('vite'),
  import('@vitejs/plugin-vue'),
])

await build({
  configFile: false,
  build: {
    minify: false,
    cssMinify: false,
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@': fileURLToPath(new URL('../src', import.meta.url)),
    },
  },
  plugins: [vue()],
})
