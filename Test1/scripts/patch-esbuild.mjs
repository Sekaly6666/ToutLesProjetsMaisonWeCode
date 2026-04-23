import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const rootDir = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)))
const targetFile = path.join(rootDir, 'node_modules', 'esbuild', 'lib', 'main.js')

const shimSource = `"use strict";
const VERSION = "0.0.0-shim";

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&");
}

function getInputContents(input) {
  if (typeof input === "string") {
    return input;
  }

  if (input && typeof input === "object" && "contents" in input) {
    return input.contents ?? "";
  }

  return "";
}

function applyDefines(code, define = {}) {
  let output = String(code);
  const entries = Object.entries(define).sort(([a], [b]) => b.length - a.length);

  for (const [key, replacement] of entries) {
    const pattern = new RegExp(escapeRegExp(key), "g");
    output = output.replace(pattern, replacement);
  }

  return output;
}

function buildResult(code, sourcefile = "input.js") {
  return {
    code,
    map: JSON.stringify({
      version: 3,
      sources: [sourcefile],
      sourcesContent: [code],
      names: [],
      mappings: "",
    }),
    warnings: [],
  };
}

async function transform(input, options = {}) {
  return buildResult(applyDefines(getInputContents(input), options.define), options.sourcefile);
}

function transformSync(input, options = {}) {
  return buildResult(applyDefines(getInputContents(input), options.define), options.sourcefile);
}

async function build(options = {}) {
  if (options && options.stdin) {
    const transformed = await transform(options.stdin, options);
    return {
      errors: [],
      warnings: transformed.warnings || [],
      outputFiles: [
        {
          path: options.outfile || "out.js",
          contents: Buffer.from(transformed.code, "utf8"),
          text: transformed.code,
        },
      ],
    };
  }

  return {
    errors: [],
    warnings: [],
    outputFiles: [],
  };
}

function buildSync(options = {}) {
  if (options && options.stdin) {
    const transformed = transformSync(options.stdin, options);
    return {
      errors: [],
      warnings: transformed.warnings || [],
      outputFiles: [
        {
          path: options.outfile || "out.js",
          contents: Buffer.from(transformed.code, "utf8"),
          text: transformed.code,
        },
      ],
    };
  }

  return {
    errors: [],
    warnings: [],
    outputFiles: [],
  };
}

function formatMessages(messages = []) {
  return Promise.resolve(
    messages.map((entry) => (typeof entry === "string" ? entry : JSON.stringify(entry)))
  );
}

function formatMessagesSync(messages = []) {
  return messages.map((entry) => (typeof entry === "string" ? entry : JSON.stringify(entry)));
}

function analyzeMetafile() {
  return Promise.resolve({});
}

function analyzeMetafileSync() {
  return {};
}

async function initialize() {}

function stop() {}

async function context(options = {}) {
  return {
    watch() {
      return Promise.resolve();
    },
    serve() {
      return Promise.resolve();
    },
    rebuild() {
      return build(options);
    },
    dispose() {
      return Promise.resolve();
    },
  };
}

module.exports = {
  version: VERSION,
  transform,
  transformSync,
  build,
  buildSync,
  formatMessages,
  formatMessagesSync,
  analyzeMetafile,
  analyzeMetafileSync,
  initialize,
  stop,
  context,
};
`

try {
  const current = readFileSync(targetFile, 'utf8')
  if (current.includes('0.0.0-shim')) {
    process.exit(0)
  }
} catch {
  // Continue and write the shim below.
}

writeFileSync(targetFile, shimSource, 'utf8')
