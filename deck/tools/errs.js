const { chromium } = require('playwright');
const { pageUrl } = require('./serve.js');
/* usage: node tools/errs.js <abs html> <slideid> ... : renders each slide frozen at several times (TIMES env, comma list) and prints ok or the first errors */
(async () => {
  const [file, ...ids] = process.argv.slice(2);
  const times = (process.env.TIMES || '0.02,0.25,0.7,1.5,3,6,11').split(',').map(Number);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message + ' ' + (e.stack || '').split('\n').slice(0, 3).join(' | ')));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('Failed to load resource')) errs.push(m.text().split('\n').slice(0, 2).join(' | ')); });
  for (const id of ids) {
    const found = [];
    for (const t of times) {
      errs.length = 0;
      await p.goto((await pageUrl(file)) + '?cap=1&s=' + id + '&t=' + t + (process.env.Q || ''), { waitUntil: 'domcontentloaded', timeout: 240000 });
      await p.waitForFunction('window.__ready === true', null, { timeout: +(process.env.READY_MS || 8000) }).catch(() => errs.push('timeout'));
      if (errs.length) found.push('t=' + t + ': ' + errs[0].slice(0, 160));
    }
    console.log(id, found.length ? found.slice(0, 2).join(' || ') : 'ok');
  }
  await b.close();
})();
