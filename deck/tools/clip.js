/* clip.js: one slide as a video clip, for social media and the website (F0b, 2026-11-06; Brock: "it's mostly clips that
   will be used on social media and for parts of the website").

   usage: node tools/clip.js <abs html> <slide id> <out.mp4> [--fps=30] [--hold=1.5] [--size=1920x1080]
                             [--vertical | --both] [--crf=18]
   Two kinds, both kept (Brock, F40.3: "allow for both letterboxed and the same as before as options"):
     the film's own 16:9 frame (the default: 1920 x 1080), for the website and landscape feeds; and
     --vertical, 9:16 (1080 x 1920) for phone feeds: the 16:9 stage letterboxed full width, the chapter and title above it.
     --both writes the two in one run: <out.mp4> (16:9) and <out>-vertical.mp4 (9:16).
   Renders the slide in clip mode (?clip=<id>: the slide alone, no bar, no progress tick, no page counter, a small
   THESEUS mark) frame by frame through the capture hook (?cap=1&clip=<id>&t=0, then window.__seek(t) for each frame:
   every frame is a pure function of t, so a clip is the same every time it is made), from t = 0 to the slide's settle,
   then holds the settled frame for --hold seconds, and encodes it with ffmpeg: H.264, yuv420p, BT.709, -preset veryfast,
   +faststart (plays as it downloads). --vertical makes a 1080 x 1920 clip for phone feeds: the stage letterboxed full
   width, the chapter and the title set large above it, the mark below. --size sets the frame (default 1920x1080, or
   1080x1920 with --vertical; 3840x2160 for 4K; with --both it sets the 16:9 one). Env: Q adds to the query.
   Needs NODE_PATH=/opt/npm-tools/node_modules (playwright) and ffmpeg on the PATH. Prints the frames, the length and
   any page errors. Check a clip by pulling frames back out:
     ffmpeg -ss 0.5 -i out.mp4 -frames:v 1 f05.png */
const { chromium } = require('playwright');
const { pageUrl } = require('./serve.js');
const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2), pos = args.filter(a => !a.startsWith('--'));
const opt = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => { const i = a.indexOf('='); return i < 0 ? [a.slice(2), true] : [a.slice(2, i), a.slice(i + 1)]; }));
const [file, id, out] = pos;
if (!file || !id || !out) { console.error('usage: node tools/clip.js <abs html> <slide id> <out.mp4> [--fps=30] [--hold=1.5] [--size=1920x1080] [--vertical | --both] [--crf=18]'); process.exit(2); }
const fps = +(opt.fps || 30), hold = opt.hold != null && opt.hold !== true ? +opt.hold : 1.5, crf = +(opt.crf || 18);
const even = v => Math.max(2, Math.round(v / 2) * 2);
const sizeOf = vert => String(opt.size && opt.size !== true && !(opt.both && vert) ? opt.size : vert ? '1080x1920' : '1920x1080').split(/x/i).map(Number).map(even);
const jobs = opt.both ? [[false, out], [true, out.replace(/(\.mp4)?$/i, '-vertical.mp4')]] : [[!!opt.vertical, out]];
if (!(fps > 0 && fps <= 120) || !(hold >= 0) || jobs.some(([v]) => !(sizeOf(v)[0] > 0 && sizeOf(v)[1] > 0))) { console.error('clip: bad --fps, --hold or --size'); process.exit(2); }

(async () => { for (const [vert, o] of jobs) await render(vert, o); })().catch(e => { console.error('clip:', e && e.message || e); process.exit(1); });

async function render(vert, out) {
  const [vw, vh] = sizeOf(vert);
  const t0 = Date.now();
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('Failed to load resource')) errs.push(m.text().slice(0, 200)); });
  const url = (await pageUrl(path.resolve(file))) + '?cap=1&clip=' + encodeURIComponent(id) + '&t=0' + (vert ? '&vertical=1' : '') + (process.env.Q || '');
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 240000 });
  await p.waitForFunction('window.__ready === true', null, { timeout: 240000 });
  const info = await p.evaluate(() => { const s = DECK.slides[APP.i]; return { id: s.id, title: s.title || '', settle: s.settle || 9 }; });
  if (info.id !== id) { console.error('clip: no slide "' + id + '" in ' + file); await b.close(); process.exit(1); }
  const settle = info.settle, n = Math.max(1, Math.ceil((settle + hold) * fps - 1e-6));
  console.log(`${id}: "${info.title}", settle ${settle} s + hold ${hold} s at ${fps} fps = ${n} frames, ${vw}x${vh}${vert ? ' vertical' : ''}`);

  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', String(crf), '-pix_fmt', 'yuv420p',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-movflags', '+faststart', '-r', String(fps), path.resolve(out)], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise(res => ff.on('close', code => res(code)));
  const put = buf => new Promise(res => { if (ff.stdin.write(buf)) res(); else ff.stdin.once('drain', res); });

  let last = null, shown = -1;
  for (let i = 0; i < n; i++) {
    const t = Math.min(i / fps, settle);
    /* the settled frame is drawn once and held */
    if (!(last && t >= settle)) {
      await p.evaluate(t => window.__seek(t), t);
      last = await p.screenshot({ type: 'png' });
    }
    await put(last);
    const sec = Math.floor(i / fps); if (sec !== shown && sec % 2 === 0) { shown = sec; process.stdout.write(`  ${sec} s\r`); }
  }
  ff.stdin.end();
  process.stdout.write('\n');
  const code = await done;
  await b.close();
  if (errs.length) console.log('page errors:\n  ' + [...new Set(errs)].slice(0, 12).join('\n  '));
  if (code !== 0) { console.error('clip: ffmpeg failed (' + code + ')'); process.exit(1); }
  console.log(`${path.resolve(out)}: ${n} frames, ${(n / fps).toFixed(2)} s, made in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
