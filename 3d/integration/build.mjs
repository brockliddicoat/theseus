// Build the deck's 3D bundle and assets.
//   node integration/build.mjs            (run from 3d/)
// 1. esbuild integration/entry.js -> ../deck/vendor/r3d.js (IIFE; import.meta.url points at the deck's assets/ folder)
// 2. copy every runtime asset into ../deck/dist/assets/, compressing .glb with meshopt (glTF-Transform)
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DECK = path.resolve(ROOT, '..', 'deck');
const OUT_JS = path.join(DECK, 'vendor', 'r3d.js');
const OUT_ASSETS = path.join(DECK, 'dist', 'assets');

await build({
  entryPoints: [path.join(ROOT, 'integration', 'entry.js')],
  bundle: true, format: 'iife', minify: true, target: 'es2020', outfile: OUT_JS, logLevel: 'warning',
  define: { 'import.meta.url': 'window.R3D_MODURL' },
});
console.log('bundle', path.relative(ROOT, OUT_JS), (fs.statSync(OUT_JS).size / 1024).toFixed(0) + ' KB');

// runtime assets: everything the builders load by URL
const want = [
  ['shell', /^shell-(theseus|sora)\.(glb|json)$/],
  ['pcb', /^pcb(-layout)?\.(glb|json)$/],
  ['parts', /\.(glb|json|bin)$/],
  ['parts/assets', /\.(glb|json|bin|png|jpg)$/],
  ['lattice/assets', /\.(glb|json|bin)$/],
  ['shell/assets', /\.(glb|json|bin|png|jpg)$/],
  ['pcb/assets', /\.(glb|json|bin|png|jpg)$/],
];
fs.mkdirSync(OUT_ASSETS, { recursive: true });
let total = 0;
for (const [dir, re] of want) {
  const d = path.join(ROOT, dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d)) {
    if (!re.test(f) || /^shots?\.json$|package/.test(f)) continue;
    // lattice.js resolves './assets/' from its own module URL, which the bundle maps to the deck's assets/ folder
    const sub = dir === 'lattice/assets' ? path.join(OUT_ASSETS, 'assets') : OUT_ASSETS; fs.mkdirSync(sub, { recursive: true });
    const src = path.join(d, f), dst = path.join(sub, f);
    if (!fs.statSync(src).isFile()) continue;
    if (fs.existsSync(dst) && fs.statSync(dst).mtimeMs >= fs.statSync(src).mtimeMs) { total += fs.statSync(dst).size; continue; }
    if (f.endsWith('.glb')) {
      try { execFileSync('node', [path.join(ROOT, 'integration', 'compress.mjs'), src, dst], { stdio: 'pipe' }); }
      catch (e) { console.log('meshopt failed for', f, '- copying raw'); fs.copyFileSync(src, dst); }
    } else fs.copyFileSync(src, dst);
    total += fs.statSync(dst).size;
    console.log('asset', f, (fs.statSync(src).size / 1024).toFixed(0) + ' KB ->', (fs.statSync(dst).size / 1024).toFixed(0) + ' KB');
  }
}
console.log('assets total', (total / 1048576).toFixed(2) + ' MB in', path.relative(ROOT, OUT_ASSETS));

// artifact hosting serves no .glb or .bin, so every binary asset also ships as <name>.gz.b64.txt (gzip, then base64);
// the bridge fetches those and decodes them (3d/integration/bridge.js, assetFetch), so the builders load as before
import zlib from 'node:zlib';
let packed = 0;
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
for (const f of walk(OUT_ASSETS)) {
  if (!/\.(glb|bin)$/.test(f)) continue;
  const out = f + '.gz.b64.txt';
  if (!fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(f).mtimeMs) fs.writeFileSync(out, zlib.gzipSync(fs.readFileSync(f), { level: 9 }).toString('base64'));
  packed += fs.statSync(out).size;
}
console.log('packed for hosting', (packed / 1048576).toFixed(2) + ' MB (.gz.b64.txt)');
