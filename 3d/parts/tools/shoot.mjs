// Batch screenshots for the parts test bench (one browser, pages in sequence, generous timeouts).
// Usage: node parts/tools/shoot.mjs <list.json> [--only=substr] [--scale=2] [--jobs=1]
//   list.json: [{ "out": "parts/shots/x.png", "q": "part=gt01&...", "w": 1600, "h": 900 }, ...]
// Serves 3d/ like tools/shot.mjs; waits for window.__ready; writes PNGs (paths relative to 3d/).
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module'; import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright')); }
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const opt = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => { const [k, ...v] = a.slice(2).split('='); return [k, v.join('=') || true]; }));
const list = JSON.parse(fs.readFileSync(args.find(a => !a.startsWith('--')), 'utf8')).filter(s => !opt.only || s.out.includes(opt.only) || (s.q || '').includes(opt.only));
const SCALE = +(opt.scale || 2), JOBS = +(opt.jobs || 1);
const T = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg' };
const srv = http.createServer((q, r) => {
  const p = decodeURIComponent(q.url.split('?')[0]); let f = path.join(ROOT, p);
  if (p.startsWith('/refs/')) f = path.join(ROOT, '..', p);
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); r.end(b); });
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const port = srv.address().port;
const launch = () => chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
let browser = await launch();
const RESTART = +(opt.restart || 8);       // fresh browser every N shots (SwiftShader memory creeps up)
let i = 0, fails = 0, since = 0;
async function worker() {
  while (i < list.length) {
    const s = list[i++];
    if (opt.skip && fs.existsSync(path.isAbsolute(s.out) ? s.out : path.join(ROOT, s.out))) continue;
    if (JOBS === 1 && ++since > RESTART) { await browser.close(); browser = await launch(); since = 1; }
    const t0 = Date.now();
    const page = await browser.newPage({ viewport: { width: s.w || 1600, height: s.h || 900 }, deviceScaleFactor: s.scale || SCALE });
    const logs = [];
    page.on('pageerror', e => logs.push('PAGEERR ' + e.message));
    page.on('console', m => { if (m.type() === 'error') logs.push(m.text()); });
    try {
      await page.goto(`http://127.0.0.1:${port}/parts/test.html?ui=0&${s.q}`, { timeout: 120000 });
      await page.waitForFunction('window.__ready === true || !!window.__error', null, { timeout: 240000 });
      const err = await page.evaluate(() => window.__error || null);
      if (err) throw new Error(err);
      // a GPU-process crash (memory pressure) leaves a lost canvas that still screenshots "fine"
      const lost = await page.evaluate(() => { try { return window.__studio.renderer.getContext().isContextLost(); } catch { return true; } });
      if (lost) throw new Error('WebGL context lost before screenshot');
      const out = path.isAbsolute(s.out) ? s.out : path.join(ROOT, s.out);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      await page.screenshot({ path: out, timeout: 300000 });
      console.log(`ok  ${s.out}  ${((Date.now() - t0) / 1000).toFixed(1)}s ${logs.length ? logs.join(' | ').slice(0, 200) : ''}`);
    } catch (e) { fails++; console.log(`ERR ${s.out}: ${String(e.message || e).slice(0, 300)} ${logs.join(' | ').slice(0, 200)}`); }
    await page.close();
  }
}
await Promise.all(Array.from({ length: JOBS }, worker));
await browser.close(); srv.close();
if (fails) process.exitCode = 1;
