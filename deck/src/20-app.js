/* ============================================================================================
   app: one canvas. Each frame the current slide is drawn off screen on its own ground (paper or night),
   then composed onto the stage; during a change the old frame and the new one meet in one of the film's
   transitions: iris (a disc of the accent opens, the new frame opens inside it a beat later), sweep (a slanted
   band of the accent crosses), push (the new frame slides in, the old one slides away slower and dims).
   ============================================================================================ */
const APP = { i: 0, t0: 0, tPause: 0, playing: true, dpr: 1, scale: 1, trStart: -1, TR: 0.95, trans: 'push', trAcc: '#F3F2EE', frozenT: null, reduced: false, lastT: 0 };
const $ = id => document.getElementById(id);
const OFF = document.createElement('canvas'), SNAP = document.createElement('canvas');

function slideT() { if (APP.frozenT != null) return APP.frozenT; return APP.playing ? (performance.now() - APP.t0) / 1000 : APP.tPause; }
function themeOf(s) { return s.theme === 'paper' ? 1 : 0; }

function fit() {
  const cap = document.body.classList.contains('cap'), clean = document.body.classList.contains('clean');
  const bar = clean || cap ? 0 : 56, pad = cap ? 0 : 32;
  const vw = window.innerWidth - pad, vh = window.innerHeight - bar - (cap ? 0 : 24);
  const w = Math.max(200, Math.min(vw, vh * 16 / 9)), h = w * 9 / 16;
  const st = $('stage'); st.style.width = w + 'px'; st.style.height = h + 'px';
  $('bar').style.width = w + 'px';
  APP.dpr = Math.min(2, window.devicePixelRatio || 1); APP.scale = w / W;
  const cw = Math.round(w * APP.dpr), ch = Math.round(h * APP.dpr);
  for (const c of [$('fx'), OFF, SNAP]) { if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; } }
}
function go(i, opts = {}) {
  i = clamp(i, 0, DECK.slides.length - 1);
  if (i === APP.i && !opts.force) return;
  const now = performance.now(), prev = DECK.slides[APP.i], next = DECK.slides[i];
  if (!opts.instant && !APP.reduced && prev) {
    SNAP.getContext('2d').drawImage($('fx'), 0, 0);
    APP.trStart = now;
    APP.trans = next.trans || (next.card ? 'iris' : themeOf(prev) !== themeOf(next) ? 'sweep' : 'push');
    APP.back = i < APP.i;
    TH = themeOf(next); APP.trAcc = next.card ? acc(next.ch) : (themeOf(next) ? '#111111' : '#F3F2EE');
    if (APP.trans === 'sweep') APP.trAcc = acc(next.ch) === C.ink ? C.hero : acc(next.ch);
  } else APP.trStart = -1;
  APP.i = i; APP.t0 = now; APP.tPause = 0; APP.lastT = 0;
  if (APP.reduced) { APP.t0 = now - (next.settle || 9) * 1000; APP.tPause = next.settle || 9; }
  if (APP.frozenT == null) { try { history.replaceState(null, '', '#' + next.id); } catch (e) { } }
  updateBar(); renderSources();
  try { prepare3D(next); prepare3D(DECK.slides[i + 1]); } catch (e) { }
}
function updateBar() {
  const s = DECK.slides[APP.i];
  $('count').textContent = (APP.i + 1) + ' / ' + DECK.slides.length;
  const ch = DECK.chapters.find(c => c.key === s.ch); $('chap').textContent = ch ? ch.name : '';
  document.querySelectorAll('.seg').forEach(b => b.classList.toggle('on', b.dataset.ch === s.ch));
}
function buildBar() {
  const segs = $('segs'); segs.innerHTML = '';
  DECK.chapters.forEach(c => {
    const n = DECK.slides.filter(s => s.ch === c.key).length; if (!n) return;
    const b = document.createElement('button'); b.className = 'seg'; b.type = 'button'; b.dataset.ch = c.key; b.style.flexGrow = n; b.title = c.name; b.setAttribute('aria-label', 'Go to ' + c.name);
    b.appendChild(document.createElement('i'));
    b.onclick = e => { e.stopPropagation(); go(DECK.slides.findIndex(s => s.ch === c.key)); };
    segs.appendChild(b);
  });
}
function renderSources(all) {
  const box = $('src'); const s = DECK.slides[APP.i];
  const ids = all ? Object.keys(SRC) : (s.src || []);
  box.innerHTML = '';
  const h = document.createElement('h2'); h.textContent = all ? 'All sources' : 'Sources for this slide'; box.appendChild(h);
  const sub = document.createElement('p'); sub.className = 'sub'; sub.textContent = all ? ids.length + ' references' : (s.title || ''); box.appendChild(sub);
  if (!ids.length) { const p = document.createElement('p'); p.textContent = 'This slide is a design proposal, or a derivation shown on screen. It cites nothing outside the deck.'; p.style.cssText = 'margin:0;color:#c9c8c2;font-size:13px'; box.appendChild(p); }
  else {
    const ol = document.createElement('ol');
    for (const id of ids) { const r = SRC[id]; if (!r) continue; const li = document.createElement('li'); li.appendChild(document.createTextNode(r.t + ' ')); if (r.u) { const a = document.createElement('a'); a.href = r.u; a.target = '_blank'; a.rel = 'noopener'; a.textContent = r.u.replace(/^https?:\/\/(www\.)?/, '').slice(0, 70); li.appendChild(a); } if (r.n) { const n = document.createElement('div'); n.textContent = r.n; n.style.cssText = 'color:#8b8d91;font-size:12px;margin-top:2px'; li.appendChild(n); } ol.appendChild(li); }
    box.appendChild(ol);
  }
  const row = document.createElement('div'); row.className = 'row';
  const b = document.createElement('button'); b.className = 'pill'; b.type = 'button'; b.textContent = all ? 'this slide' : 'all sources'; b.onclick = e => { e.stopPropagation(); renderSources(!all); };
  row.appendChild(b); box.appendChild(row);
}
function togglePlay() {
  if (APP.playing) { APP.tPause = slideT(); APP.playing = false; } else { APP.t0 = performance.now() - APP.tPause * 1000; APP.playing = true; }
  $('playIcon').setAttribute('d', APP.playing ? 'M6 5h4v14H6zM14 5h4v14h-4z' : 'M7 5v14l11-7z');
  $('play').setAttribute('aria-label', APP.playing ? 'Pause' : 'Play');
}
/** draw slide s at time t into a 2D context */
function drawSlide(ctx, s, t) {
  G = ctx; TH = themeOf(s);
  const sc = APP.scale * APP.dpr;
  ctx.setTransform(sc, 0, 0, sc, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  try { stageLight(t, s.ch); } catch (e) { /* the light is decoration */ }
  if (QA.on) { QA.text.length = 0; QA.boxes.length = 0; }
  const j = s.jolt ? s.jolt(t) : null; if (j) ctx.translate(j[0], j[1]);
  paper(s.paper == null ? 1 : (typeof s.paper === 'function' ? s.paper(t) : s.paper));
  if (s.draw) { try { s.draw(t); } catch (e) { console.error(s.id, e); } }
  ctx.setTransform(sc, 0, 0, sc, 0, 0); ctx.globalAlpha = 1;
  /* the deck's chrome: the rule, THESEUS / chapter, n / N */
  try { slideChrome(t, s); } catch (e) { console.error(s.id, 'chrome', e); }
  /* night gets a soft lens fall-off at the edges; paper stays flat, like a printed sheet */
  if (!TH) {
    const vg = ctx.createRadialGradient(W / 2, H * 0.5, H * 0.62, W / 2, H * 0.5, H * 1.15);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }
}
function compose(k) {
  const fx = $('fx').getContext('2d'), w = $('fx').width, h = $('fx').height, sx = w / W;
  fx.setTransform(1, 0, 0, 1, 0, 0); fx.globalAlpha = 1;
  if (k >= 1 || APP.trStart < 0) { fx.drawImage(OFF, 0, 0); return; }
  const A = SNAP, B = OFF, accent = APP.trAcc, dir = APP.back ? -1 : 1;
  if (APP.trans === 'iris') {
    /* a soft iris: the new slide opens in a circle with a feathered ring of light in the chapter's colour, while the
       old one swells a little and dims behind it (no solid colour fills the screen) */
    const x = (APP.irisX || 300) * sx, y = (APP.irisY || 760) * sx, R = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 8;
    const ea = E.io3(clamp(k / 0.9)), eb = E.cam(clamp((k - 0.05) / 0.95));
    fx.save(); fx.translate(x, y); fx.scale(1 + 0.06 * ea, 1 + 0.06 * ea); fx.translate(-x, -y); fx.drawImage(A, 0, 0); fx.restore();
    fx.fillStyle = `rgba(0,0,0,${0.35 * ea})`; fx.fillRect(0, 0, w, h);
    const rr0 = Math.max(0.01, R * eb);
    fx.save(); fx.beginPath(); fx.arc(x, y, rr0, 0, Math.PI * 2); fx.clip();
    fx.translate(x, y); fx.scale(1.06 - 0.06 * eb, 1.06 - 0.06 * eb); fx.translate(-x, -y); fx.drawImage(B, 0, 0); fx.restore();
    if (eb > 0 && eb < 1) {
      const ring = fx.createRadialGradient(x, y, Math.max(0, rr0 - 60 * sx), x, y, rr0 + 6 * sx);
      ring.addColorStop(0, rgba(accent, 0)); ring.addColorStop(0.85, rgba(accent, 0.35 * (1 - eb))); ring.addColorStop(1, rgba(accent, 0));
      fx.fillStyle = ring; fx.beginPath(); fx.arc(x, y, rr0 + 6 * sx, 0, Math.PI * 2); fx.fill();
    }
  } else if (APP.trans === 'sweep') {
    /* a wipe of light: a soft diagonal edge carries the new slide across, a thin glow on its leading edge; the old
       slide drifts back and dims (no band of solid colour) */
    const sl = 0.32 * h, x0 = -sl - 80 * sx, x1 = w + 80 * sx, e = E.cam(clamp(k));
    const xe = lerp(x0, x1, e);
    fx.save(); fx.translate(-50 * sx * e, 0); fx.drawImage(A, 0, 0); fx.restore();
    fx.fillStyle = `rgba(0,0,0,${0.3 * e})`; fx.fillRect(0, 0, w, h);
    const band = xx => { fx.beginPath(); fx.moveTo(-10, 0); fx.lineTo(xx + sl, 0); fx.lineTo(xx, h); fx.lineTo(-10, h); fx.closePath(); };
    fx.save(); band(xe); fx.clip(); fx.translate(40 * sx * (1 - e), 0); fx.drawImage(B, 0, 0); fx.restore();
    if (e > 0 && e < 1) {
      fx.save(); fx.globalCompositeOperation = 'lighter';
      for (const [wd, al] of [[26, 0.10], [8, 0.22], [2, 0.6]]) { fx.strokeStyle = rgba(accent, al * Math.sin(e * Math.PI)); fx.lineWidth = wd * sx; fx.beginPath(); fx.moveTo(xe + sl, 0); fx.lineTo(xe, h); fx.stroke(); }
      fx.restore();
    }
  } else if (APP.trans === 'push') {
    const e = E.io5(k);
    fx.drawImage(A, -0.38 * w * e * dir, 0);
    fx.fillStyle = `rgba(0,0,0,${0.32 * e})`; fx.fillRect(0, 0, w, h);
    const bx = dir > 0 ? w * (1 - e) : -w * (1 - e);
    fx.drawImage(B, bx, 0);
    /* a soft shadow off the new slide's leading edge instead of a hard line */
    const lx = dir > 0 ? bx : bx + w, sw = 60 * sx, gsh = fx.createLinearGradient(lx, 0, lx - dir * sw, 0);
    gsh.addColorStop(0, `rgba(0,0,0,${0.35 * Math.sin(e * Math.PI)})`); gsh.addColorStop(1, 'rgba(0,0,0,0)');
    fx.fillStyle = gsh; fx.fillRect(dir > 0 ? lx - sw : lx, 0, sw, h);
  } else { fx.drawImage(A, 0, 0); fx.globalAlpha = E.io3(k); fx.drawImage(B, 0, 0); fx.globalAlpha = 1; }
}
function frame() {
  const s = DECK.slides[APP.i], t = slideT(), now = performance.now();
  V3.pending = 0;
  if (APP.frozenT == null) sfxRun(s, APP.lastT, t); APP.lastT = t;
  drawSlide(OFF.getContext('2d'), s, t);
  let k = APP.trStart > 0 ? prog((now - APP.trStart) / 1000, 0, APP.TR) : 1; if (k >= 1) APP.trStart = -1;
  compose(k);
  /* progress inside the chapter segment */
  const segs = [...document.querySelectorAll('.seg')], si = segs.findIndex(b => b.dataset.ch === s.ch);
  segs.forEach((b, kk) => { if (kk < si) b.firstChild.style.width = '100%'; else if (kk > si) b.firstChild.style.width = '0%'; });
  if (segs[si]) { const list = DECK.slides.filter(x => x.ch === s.ch); segs[si].firstChild.style.width = ((list.indexOf(s) + clamp(t / (s.settle || 9))) / list.length * 100) + '%'; }
}
function loop() { frame(); if (typeof R3D !== 'undefined' && (APP.gcN = (APP.gcN || 0) + 1) % 120 === 0) R3D.gc(); if (APP.frozenT == null) requestAnimationFrame(loop); }
async function start() {
  const q = new URLSearchParams(location.search);
  APP.reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (q.get('cap')) document.body.classList.add('cap', 'clean');
  fit(); window.addEventListener('resize', () => { fit(); if (APP.frozenT != null) frame(); });
  /* the fonts are embedded (00-head.html); canvas never asks for a font by itself, so load every face before the first frame */
  QA.on = !!q.get('qa');
  const faces = [];
  for (const w of [400, 500, 600, 700, 800, 900]) faces.push(`${w} 40px "Inter Display"`);
  for (const w of [400, 450, 500, 600, 700, 800]) faces.push(`${w} 28px "Inter"`);
  for (const w of [400, 500, 600, 700, 800]) faces.push(`${w} 22px "JetBrains Mono"`);
  try { await Promise.race([Promise.all(faces.map(f => document.fonts.load(f, 'THESEUS 0123456789 µs →'))).then(() => document.fonts.ready), new Promise(r => setTimeout(r, 8000))]); } catch (e) { }
  try { await Promise.race([Promise.all((window.IMGS || []).map(im => im.decode ? im.decode().catch(() => { }) : null)), new Promise(r => setTimeout(r, 3000))]); } catch (e) { }
  buildBar();
  let first = 0; const h0 = (q.get('s') || location.hash.slice(1)), h = /^(2d|3d)$/i.test(h0) ? '' : h0;
  if (h) { const n = DECK.slides.findIndex(s => s.id === h); first = n >= 0 ? n : (parseInt(h) || 0); }
  APP.i = -1; go(first, { instant: true, force: true });
  if (q.get('t') != null) {
    APP.frozenT = parseFloat(q.get('t')); frame();
    /* a 3D shot streams its geometry in: redraw until every scene on this slide has rendered (screenshots wait for it) */
    const t0w = performance.now();
    while (V3.pending > 0 && performance.now() - t0w < 120000) { await new Promise(r => setTimeout(r, 250)); frame(); }
    window.__qa = QA.on ? { text: QA.text.slice(), boxes: QA.boxes.slice() } : null; window.__ready = true; return;
  }
  $('prev').onclick = e => { e.stopPropagation(); go(APP.i - 1); };
  $('next').onclick = e => { e.stopPropagation(); go(APP.i + 1); };
  $('play').onclick = e => { e.stopPropagation(); togglePlay(); };
  $('fs').onclick = e => { e.stopPropagation(); const el = document.documentElement; const p = document.fullscreenElement ? document.exitFullscreen() : (el.requestFullscreen ? el.requestFullscreen() : null); if (p && p.catch) p.catch(() => { }); };
  $('srcBtn').onclick = e => { e.stopPropagation(); const b = $('src'); b.hidden = !b.hidden; $('srcBtn').setAttribute('aria-expanded', String(!b.hidden)); };
  $('sndBtn').onclick = e => { e.stopPropagation(); auInit(); AU.on = !AU.on; $('sndBtn').textContent = AU.on ? 'sound on' : 'sound off'; $('sndBtn').setAttribute('aria-pressed', String(AU.on)); if (AU.on) sfx('click'); };
  $('cleanBtn').onclick = e => { e.stopPropagation(); document.body.classList.toggle('clean'); fit(); };
  $('viewBtn').onclick = e => { e.stopPropagation(); setView2D(!V2D.on); };
  v2dButton();
  $('stage').addEventListener('click', e => { const r = $('stage').getBoundingClientRect(); go(APP.i + ((e.clientX - r.left) < r.width * 0.3 ? -1 : 1)); });
  let tx = null; $('stage').addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  $('stage').addEventListener('touchend', e => { if (tx == null) return; const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 40) go(APP.i + (d < 0 ? 1 : -1)); tx = null; });
  window.addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('button') && (e.key === ' ' || e.key === 'Enter')) return;
    const k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); go(APP.i + 1); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); go(APP.i - 1); }
    else if (k === 'Home') go(0); else if (k === 'End') go(DECK.slides.length - 1);
    else if (k === 'h' || k === 'H') { document.body.classList.toggle('clean'); fit(); }
    else if (k === 'p' || k === 'P') togglePlay();
    else if (k === 'r' || k === 'R') go(APP.i, { force: true, instant: true });
    else if (k === 'f' || k === 'F') $('fs').click();
    else if (k === 's' || k === 'S') $('sndBtn').click();
    else if (k === 'd' || k === 'D') setView2D(!V2D.on);
    else if (k === '2') setView2D(true);
    else if (k === '3') setView2D(false);
    else if (k === 'Escape') $('src').hidden = true;
  });
  window.addEventListener('hashchange', () => {
    const hv = location.hash.slice(1);
    if (/^(2d|3d)$/i.test(hv)) { setView2D(hv.toLowerCase() === '2d'); try { history.replaceState(null, '', '#' + DECK.slides[APP.i].id); } catch (e) { } return; }
    const n = DECK.slides.findIndex(s => s.id === hv); if (n >= 0 && n !== APP.i) go(n);
  });
  requestAnimationFrame(loop);
}
window.addEventListener('DOMContentLoaded', start);
