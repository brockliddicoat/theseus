// Frames of slides as Brock saw them, for FEEDBACK.md (F50.1). Called by feedback/snap.sh; can be run alone.
// usage: node feedback/snap.js <abs html> <outdir> <slide[:t[,t...]]>...
//   t: seconds, or 'first' (t = 0, the opening frame), 'mid' (0.4 x the slide's settle), 'settle' (the slide's settle).
//   No t: first,mid,settle. Writes <outdir>/<NN>_<id>_<t>.png (NN = the slide's place in that build, from 00) and prints
//   one JSON line per frame: { i, n, id, ch, title, settle, t, png } (n = the build's slide count).
// One browser and one page (the machine is shared): each slide loads once (?cap=1&s=<id>&t=<t>&2d=1, plus env Q) and
// later times use the deck's window.__seek(t) when the build has it, else a reload. A build without the capture hook
// (?cap=1) can't be shot this way. The page is replaced every 20 slides, and once more if it crashes (a page that has
// loaded a 7 MB deck many times runs out of memory).
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/npm-tools/node_modules/playwright')); }
const path = require('path');
const fs = require('fs');
const { pageUrl } = require(path.join(__dirname, '..', 'deck', 'tools', 'serve.js'));
(async () => {
  const [file, out, ...specs] = process.argv.slice(2);
  if (!file || !out || !specs.length) { console.error('usage: node snap.js <abs html> <outdir> <slide[:t,...]>...'); process.exit(2); }
  fs.mkdirSync(out, { recursive: true });
  const Q = process.env.Q != null ? process.env.Q : '&2d=1';
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const errs = [];
  let p = null, used = 0;
  const fresh = async () => {
    if (p) await p.close().catch(() => {});
    p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_TUN/.test(m.text())) errs.push(m.text().slice(0, 200)); });
    used = 0;
  };
  const base = await pageUrl(file);
  const load = async (id, t) => {
    await p.goto(base + '?cap=1&s=' + encodeURIComponent(id) + '&t=' + t + Q, { waitUntil: 'domcontentloaded', timeout: 300000 });
    await p.waitForFunction('window.__ready === true', null, { timeout: 300000 }).catch(e => { if (/crash|closed/i.test(e.message)) throw e; errs.push('timeout ' + id + ' ' + t); });
  };
  let slides = null;
  const shoot = async spec => {
    const [id, ts0] = spec.split(':');
    const ts = (ts0 || 'first,mid,settle').split(',').filter(Boolean);
    // the first load also tells us the slide list (place, title, settle)
    await load(id, 0);
    if (!slides) slides = await p.evaluate(() => DECK.slides.map((s, i) => ({ i, id: s.id, ch: s.ch, title: s.title, settle: s.settle || 9 })));
    const s = slides.find(x => x.id === id);
    if (!s) { console.error('no slide', id); return; }
    const hasSeek = await p.evaluate(() => typeof window.__seek === 'function');
    let first = true;
    const lines = [];
    for (const w of ts) {
      const t = w === 'first' ? 0 : w === 'settle' ? s.settle : w === 'mid' ? +(s.settle * 0.4).toFixed(2) : parseFloat(w);
      if (!(t >= 0)) { console.error('bad time', spec); continue; }
      if (!(first && t === 0)) {
        if (hasSeek) { await p.evaluate(tt => window.__seek(tt), t); await p.waitForFunction('window.__ready === true', null, { timeout: 300000 }).catch(e => { if (/crash|closed/i.test(e.message)) throw e; errs.push('timeout seek ' + id + ' ' + t); }); }
        else await load(id, t);
      }
      first = false;
      const png = path.join(out, `${String(s.i).padStart(2, '0')}_${id}_${t}.png`);
      await p.screenshot({ path: png });
      lines.push(JSON.stringify({ i: s.i, n: slides.length, id, ch: s.ch, title: s.title, settle: s.settle, t, png }));
    }
    lines.forEach(l => console.log(l));   // printed once the slide is complete, so a retry never duplicates a line
  };
  await fresh();
  for (const spec of specs) {
    if (used >= 20) await fresh();
    try { await shoot(spec); }
    catch (e) {
      errs.push('retry ' + spec + ': ' + e.message.split('\n')[0]);
      await fresh();
      try { await shoot(spec); } catch (e2) { errs.push('FAILED ' + spec + ': ' + e2.message.split('\n')[0]); await fresh(); }
    }
    used++;
  }
  if (errs.length) console.error(errs.slice(0, 40).join('\n'));
  await b.close();
})();
