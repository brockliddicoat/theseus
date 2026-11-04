// usage: node shot.js file.html out_dir slideId:t [slideId:t ...]
const { chromium } = require('playwright');
const { pageUrl } = require('./serve.js');
(async () => {
  const [file, out, ...shots] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errs = [];
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  for (const s of shots) {
    const [id, t] = s.split(':');
    await p.goto((await pageUrl(file)) + '?cap=1&s=' + id + '&t=' + (t || 8), { waitUntil: 'domcontentloaded', timeout: 240000 });
    await p.waitForFunction('window.__ready === true', null, { timeout: 240000 }).catch(() => errs.push('timeout ' + s));
    await p.screenshot({ path: `${out}/${id}_${t || 8}.png` });
  }
  if (errs.length) console.log(errs.slice(0, 20).join('\n'));
  await b.close();
})();
