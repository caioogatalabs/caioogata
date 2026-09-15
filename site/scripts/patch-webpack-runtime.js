/**
 * Patches Next.js server webpack-runtime.js so chunk requires resolve correctly.
 * Next emits server chunks to .next/server/chunks/ but the runtime uses require("./702.js"),
 * which resolves to .next/server/702.js. This script changes it to require("./chunks/702.js").
 * Run after `next build` (e.g. via postbuild).
 */
const fs = require('fs');
const path = require('path');

const runtimePath = path.join(
  process.cwd(),
  '.next',
  'server',
  'webpack-runtime.js'
);

if (!fs.existsSync(runtimePath)) {
  process.exit(0);
}

let content = fs.readFileSync(runtimePath, 'utf8');
const wrong = 'require("./" + __webpack_require__.u(chunkId))';
const fixed = 'require("./chunks/" + __webpack_require__.u(chunkId))';

if (content.includes(wrong) && !content.includes(fixed)) {
  content = content.replace(wrong, fixed);
  fs.writeFileSync(runtimePath, content);
}
