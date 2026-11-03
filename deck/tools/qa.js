const { chromium } = require('playwright');
const { pageUrl } = require('./serve.js');
/* usage: node tools/qa.js <abs html> [ids...]   (no ids = every slide)   env: T=settle|mid|<seconds>, MINPX=21
   Renders each slide frozen with ?qa=1 and reports, from the boxes text() and demoWindow() record:
   off-stage text, text over text, text crossing a card's edge, and text smaller than the floor (stage px). */
(async () => {
  const [file, ...ids0] = process.argv.slice(2);
  const spec = process.env.T || 'settle', minpx = parseFloat(process.env.MINPX || '19');
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto((await pageUrl(file)) + '?cap=1&s=0&t=0.01'); await p.waitForFunction('window.__ready === true', null, { timeout: 30000 });
  const all = await p.evaluate(() => DECK.slides.map(s => [s.id, s.settle || 9]));
  const ids = ids0.length ? ids0 : all.map(a => a[0]);
  let total = 0;
  for (const id of ids) {
    const s = all.find(a => a[0] === id); if (!s) { console.log(id, 'not found'); continue; }
    const t = spec === 'settle' ? s[1] : spec === 'mid' ? +(s[1] * 0.4).toFixed(2) : parseFloat(spec);
    await p.goto((await pageUrl(file)) + '?cap=1&qa=1&s=' + id + '&t=' + t);
    await p.waitForFunction('window.__ready === true', null, { timeout: 30000 }).catch(() => {});
    const qa = await p.evaluate(() => window.__qa);
    if (!qa) { console.log(id, 'no qa data'); continue; }
    const T = qa.text.filter(r => r.a > 0.25 && r.s.trim().length), B = qa.boxes, out = [];
    for (const r of T) {
      if (r.x0 < 2 || r.x1 > 1918 || r.y0 < 2 || r.y1 > 1078) out.push(`OFFSTAGE "${r.s}"`);
      if (r.px < minpx) out.push(`SMALL ${r.px}px "${r.s}"`);
      for (const c of B) {
        const ix = Math.min(r.x1, c.x1) - Math.max(r.x0, c.x0), iy = Math.min(r.y1, c.y1) - Math.max(r.y0, c.y0);
        if (ix > 0 && iy > 0) { const inside = r.x0 >= c.x0 - 1 && r.x1 <= c.x1 + 1 && r.y0 >= c.y0 - 1 && r.y1 <= c.y1 + 1; const over = Math.max(c.x0 - r.x0, r.x1 - c.x1, c.y0 - r.y0, r.y1 - c.y1); if (!inside && over > 6 && ix * iy > 0.15 * (r.x1 - r.x0) * (r.y1 - r.y0)) out.push(`EDGE "${r.s}" crosses card by ${over.toFixed(0)}px`); }
      }
    }
    for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) {
      const a = T[i], c = T[j];
      const ix = Math.min(a.x1, c.x1) - Math.max(a.x0, c.x0), iy = Math.min(a.y1, c.y1) - Math.max(a.y0, c.y0);
      if (ix > 3 && iy > 3) { const ar = Math.min((a.x1 - a.x0) * (a.y1 - a.y0), (c.x1 - c.x0) * (c.y1 - c.y0)); if (ix * iy > 0.12 * ar && !(a.s === c.s && Math.abs(a.x0 - c.x0) < 3)) out.push(`OVERLAP "${a.s}" / "${c.s}"`); }
    }
    const uniq = [...new Set(out)]; total += uniq.length;
    console.log(id + ' t=' + t + ': ' + (uniq.length ? uniq.length + ' issues\n   ' + uniq.slice(0, +(process.env.N || 8)).join('\n   ') : 'clean'));
  }
  console.log('TOTAL', total);
  await b.close();
})();
