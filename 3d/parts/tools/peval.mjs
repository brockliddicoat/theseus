// Debug helper: load a parts test page headless and evaluate an expression in it.
// node parts/tools/peval.mjs "<query>" "<js expression returning JSON-able>"
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module'; import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('/home/claude/.npm-global/lib/node_modules/playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const T = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json' };
const srv = http.createServer((q, r) => { const p = decodeURIComponent(q.url.split('?')[0]); const f = path.join(ROOT, p);
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); r.end(b); }); });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const pg = await b.newPage({ viewport: { width: 640, height: 400 } });
pg.on('console', m => { if (m.type() === 'error') console.log('console:', m.text()); });
pg.on('pageerror', e => console.log('PAGEERR', e.message));
await pg.goto(`http://127.0.0.1:${srv.address().port}/parts/test.html?ui=0&${process.argv[2] || ''}`);
await pg.waitForFunction('window.__ready === true || !!window.__error', null, { timeout: 90000 });
console.log(JSON.stringify(await pg.evaluate(process.argv[3] || 'window.__error || "ok"'), null, 1));
await b.close(); srv.close();
