import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const Module = require('node:module')

const marker = Symbol.for('mycontacts.esbuild.patched')

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function applyDefines(code, define = {}) {
  let output = String(code)

  const entries = Object.entries(define).sort(([a], [b]) => b.length - a.length)

  for (const [key, replacement] of entries) {
    const pattern = new RegExp(escapeRegExp(key), 'g')
    output = output.replace(pattern, replacement)
  }

  return output
}

const fallbackEsbuild = {
  version: '0.0.0-shim',
  transform(input, options = {}) {
    return Promise.resolve({
      code: applyDefines(input, options.define),
      map: null,
      warnings: [],
    })
  },
  transformSync(input, options = {}) {
    return {
      code: applyDefines(input, options.define),
      map: null,
      warnings: [],
    }
  },
  build() {
    return Promise.resolve({
      errors: [],
      warnings: [],
      outputFiles: [],
    })
  },
  buildSync() {
    return {
      errors: [],
      warnings: [],
      outputFiles: [],
    }
  },
  formatMessages(messages = []) {
    return Promise.resolve(messages.map((entry) => (typeof entry === 'string' ? entry : JSON.stringify(entry))))
  },
  formatMessagesSync(messages = []) {
    return messages.map((entry) => (typeof entry === 'string' ? entry : JSON.stringify(entry)))
  },
  analyzeMetafile() {
    return Promise.resolve({})
  },
  analyzeMetafileSync() {
    return {}
  },
  initialize() {
    return Promise.resolve()
  },
  stop() {
    return Promise.resolve()
  },
  context() {
    return Promise.resolve({
      watch() {
        return Promise.resolve()
      },
      serve() {
        return Promise.resolve()
      },
      rebuild() {
        return Promise.resolve({
          errors: [],
          warnings: [],
          outputFiles: [],
        })
      },
      dispose() {
        return Promise.resolve()
      },
    })
  },
}

export function patchEsbuild() {
  if (globalThis[marker]) {
    return
  }

  globalThis[marker] = true
  const originalLoad = Module._load

  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === 'esbuild') {
      return fallbackEsbuild
    }

    return originalLoad.call(this, request, parent, isMain)
  }
}

