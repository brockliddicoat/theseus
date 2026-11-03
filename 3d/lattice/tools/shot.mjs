// Headless screenshot of a 3D test page, served from /home/claude/theseus/3d so import maps resolve.
// Usage: node tools/shot.mjs <page relative to 3d/> <out.png> [--w=1600] [--h=900] [--q="view=top&t=2"] [--wait=90000] [--scale=1]
// The page must set window.__ready = true when the frame you want is drawn (and may set window.__error).
// Pages load three via an import map: { "three": "/node_modules/three/build/three.module.js", "three/addons/": "/node_modules/three/examples/jsm/" }
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');   // serves 3d/
const args = process.argv.slice(2);
const page = args[0], out = args[1];
const opt = Object.fromEntries(args.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || true]; }));
const W = +(opt.w || 1600), H = +(opt.h || 900), WAIT = +(opt.wait || 90000), SCALE = +(opt.scale || 1);
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.bin': 'application/octet-stream', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ply': 'application/octet-stream', '.css': 'text/css', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(ROOT, p);
  if (p.startsWith('/refs/')) f = path.join(ROOT, '..', p);          // /refs/... -> theseus/refs/...
  if (!f.startsWith(path.resolve(ROOT, '..'))) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('404 ' + p); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
    res.end(buf);
  });
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const p = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: SCALE });
const logs = [];
p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') logs.push(m.type() + ': ' + m.text()); });
p.on('pageerror', e => logs.push('PAGEERR ' + e.message));
const url = `http://127.0.0.1:${port}/${page.replace(/^\//, '')}${opt.q ? '?' + opt.q : ''}`;
await p.goto(url);
try {
  await p.waitForFunction('window.__ready === true || !!window.__error', null, { timeout: WAIT });
} catch (e) { logs.push('TIMEOUT waiting for window.__ready'); }
const err = await p.evaluate(() => window.__error || null);
if (err) logs.push('PAGE __error: ' + err);
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
await p.screenshot({ path: out, timeout: 600000 });
if (logs.length) console.log(logs.slice(0, 30).join('\n'));
console.log('saved', out);
await browser.close();
server.close();
