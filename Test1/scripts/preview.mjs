import { fileURLToPath, URL } from 'node:url'

import { patchEsbuild } from './esbuild-shim.mjs'

patchEsbuild()

const [{ preview }, { default: vue }] = await Promise.all([
  import('vite'),
  import('@vitejs/plugin-vue'),
])

const server = await preview({
  configFile: false,
  optimizeDeps: {
    noDiscovery: true,
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@': fileURLToPath(new URL('../src', import.meta.url)),
    },
  },
  plugins: [vue()],
})

server.printUrls()
