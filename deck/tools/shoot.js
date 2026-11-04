// usage: node tools/shoot.js <abs html> <outdir> <spec> [ids...]   env: DSF=2 (pixel ratio), PAR=4 (pages in parallel; use 1 at DSF=2)
//   spec: 'settle' (t = slide.settle), 'mid' (t = 0.4 * settle), a number (t), or 'id:t' pairs given as ids
// screenshots slides in parallel pages; prints errors
const { chromium } = require('playwright');
const { pageUrl } = require('./serve.js');
const fs = require('fs');
(async () => {
  const [file, out, spec, ...ids0] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const scale = parseFloat(process.env.DSF || '1');
  const p0 = await b.newPage();
  await p0.goto((await pageUrl(file)) + '?cap=1&s=0&t=0.01', { waitUntil: 'domcontentloaded', timeout: 240000 });
  await p0.waitForFunction('window.__ready === true', null, { timeout: 240000 }).catch(() => {});
  const all = await p0.evaluate(() => DECK.slides.map(s => [s.id, s.settle || 9]));
  await p0.close();
  let jobs = [];
  const want = ids0.length ? ids0 : all.map(a => a[0]);
  for (const w of want) {
    let [id, tt] = w.split(':'); const s = all.find(a => a[0] === id); if (!s) { console.log('no slide', id); continue; }
    let t = tt != null ? parseFloat(tt) : spec === 'settle' ? s[1] : spec === 'mid' ? +(s[1] * 0.4).toFixed(2) : parseFloat(spec);
    jobs.push([id, t, all.findIndex(a => a[0] === id)]);
  }
  const N = parseInt(process.env.PAR || '4');
  const errs = [];
  async function worker() {
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
    p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !m.text().includes('Failed to load resource') && !m.text().includes('ERR_TUN')) errs.push(m.text().slice(0, 200)); });
    while (jobs.length) {
      const [id, t, idx] = jobs.shift();
      await p.goto((await pageUrl(file)) + '?cap=1&s=' + id + '&t=' + t, { waitUntil: 'domcontentloaded', timeout: 240000 });
      await p.waitForFunction('window.__ready === true', null, { timeout: 240000 }).catch(() => errs.push('timeout ' + id));
      await p.screenshot({ path: `${out}/${String(idx).padStart(2, '0')}_${id}_${t}.png` });
    }
    await p.close();
  }
  await Promise.all(Array.from({ length: N }, worker));
  if (errs.length) console.log(errs.slice(0, 30).join('\n'));
  await b.close();
})();
