/* ============================================================================================
   ui: the recurring pieces, in the old film's language. Every word types itself out the first time it
   shows (big words slowly, small print quickly). Captions sit centred at the bottom. A glossary panel
   (bottom left) explains a term; a feature card (bottom right) names what is on screen and how we know.
   Demonstrations sit in their own windows on the paper. Chapters open on a title card behind a disc wipe.
   ============================================================================================ */
const LM = 96, RM = W - 96;
function curSlide() { return DECK.slides[APP.i]; }
function chapterInfo(s) {
  const ch = DECK.chapters.find(c => c.key === s.ch), list = DECK.slides.filter(x => x.ch === s.ch && !x.card);
  return { name: ch ? ch.name : '', n: list.indexOf(s) + 1, of: list.length, num: DECK.chapters.indexOf(ch) };
}
/** eyebrow and title, typed */
function header(t, title, o = {}) {
  const s = curSlide(), ci = chapterInfo(s), A = acc(s.ch);
  const eb = o.eyebrow || `${ci.name.toLowerCase()}  //  ${ci.n} of ${ci.of}`;
  text(eb, LM, 120, { font: 'mono', size: 20, weight: 700, color: A, t, t0: 0.05, cps: 90, ls: 0.5 });
  const r = text(title, LM, 196, { size: o.size || 56, weight: 800, color: C.ink, t, t0: 0.25, cps: o.cps || 34, maxW: o.maxW || 1250, lh: 1.08, ls: -1.2, caret: true });
  if (s.ideas && s.ideas.length && !o.noIdeas) text(s.ideas.map(n => typeof n === 'number' ? '#' + n : n).join('  '), RM, 120, { font: 'mono', size: 18, weight: 600, color: C.mute, align: 'right', t, t0: 0.6, cps: 120 });
  return 196 + r.h;
}
/** centred captions at the bottom; steps = [[t0, 'text'], ...]; pages of up to two lines */
function captions(t, steps, o = {}) {
  let cur = -1; for (let i = 0; i < steps.length; i++) if (t >= steps[i][0]) cur = i;
  if (cur < 0) return;
  const [t0, str] = steps[cur], nxt = steps[cur + 1];
  const out = nxt ? 1 - ep(t, nxt[0] - 0.25, nxt[0]) : 1;
  text(str, o.x || W / 2, o.y || 990, { size: o.size || 25, weight: 500, color: C.ink, t, t0, cps: o.cps || 60, maxW: o.maxW || 1060, lh: 1.42, alpha: out, align: o.align || 'center', caret: true });
}
/** a footnote: where a number came from */
function source(t, str, o = {}) {
  text(str, o.x || W / 2, o.y || 1056, { font: 'mono', size: 15, weight: 500, color: C.faint, alpha: ep(t, o.t0 || 0.8, (o.t0 || 0.8) + 0.6), maxW: o.maxW || 1500, align: o.align || 'center' });
}
/** glossary panel, bottom left: what a word means */
/** the largest size (down to 12) at which s, wrapped to width w, fits avail px from its first baseline to its last */
function fitSize(s, size, w, avail, lhK, weight = 500) { let z = size; while (z > 12 && wrap(s, { size: z, weight }, w).length > 1 + Math.floor(avail / (lhK * z))) z -= 0.5; return z; }
function gloss(t, t0, term, def, o = {}) {
  const a = ep(t, t0, t0 + 0.4); if (a <= 0) return;
  const x = o.x || 24, y = o.y || 846, w = o.w || 372, h = o.h || 210;
  G.save(); G.translate(0, (1 - E.out3(a)) * 16);
  rr(x, y, w, h, 10, C.panel, inkA(0.12), 1.5, a);
  text('what that means', x + 20, y + 34, { font: 'mono', size: 15, weight: 700, color: C.mute, ls: 1.2, alpha: a });
  text(term, x + 20, y + 68, { size: 21, weight: 800, color: o.color || acc(), t, t0: t0 + 0.2, cps: 60, alpha: a });
  const fs = fitSize(def, 16, w - 40, h - 110, 1.45, 500);
  text(def, x + 20, y + 100, { size: fs, weight: 500, color: C.ink2, t, t0: t0 + 0.5, cps: 110, maxW: w - 40, lh: 1.45, alpha: a });
  G.restore();
}
/** feature card, bottom right: the feature on screen, the idea numbers, and how we know */
function featureCard(t, t0, name, ev, line2, o = {}) {
  const a = ep(t, t0, t0 + 0.45); if (a <= 0) return;
  const x = o.x || W - 24 - 372, y = o.y || 846, w = 372, h = o.h || 210, A = o.color || acc();
  G.save(); G.translate(0, (1 - E.out3(a)) * 16);
  rr(x, y, w, h, 10, C.panel, inkA(0.12), 1.5, a);
  const ns = Math.max(16, Math.min(22, Math.floor(22 * (w - 40) / Math.max(1, tw(name, { size: 22, weight: 800 })))));
  text(name, x + 20, y + 40, { size: ns, weight: 800, color: A, t, t0: t0 + 0.15, cps: 55, maxW: w - 40, alpha: a });
  const evs = Array.isArray(ev) ? ev : [ev]; let xx = x + 20;
  evs.forEach(e => { xx += tag(xx, y + 92, e, a) + 18; });
  if (line2) text(line2, x + 20, y + 132, { size: fitSize(line2, 16, w - 40, h - 138, 1.42, 500), weight: 500, color: C.ink2, t, t0: t0 + 0.6, cps: 110, maxW: w - 40, lh: 1.42, alpha: a });
  G.restore();
}
/** evidence tag: measured / datasheet (filled), derived (math on screen), claim (a maker says so), survey, proposal (dashed) */
function tag(x, y, kind, a = 1) {
  const st = { measured: 'fill', datasheet: 'fill', derived: 'line', claim: 'line', survey: 'line', study: 'fill', proposal: 'dash' }[kind] || 'line';
  const col = kind === 'proposal' ? acc() : C.ink;
  G.save(); G.globalAlpha = a;
  if (st === 'fill') { G.fillStyle = col; G.fillRect(x, y - 13, 13, 13); }
  else { G.strokeStyle = col; G.lineWidth = 2; G.setLineDash(st === 'dash' ? [3, 3] : []); G.strokeRect(x + 1, y - 12, 11, 11); }
  G.restore();
  text(kind, x + 21, y, { font: 'mono', size: 16, weight: 700, color: col, alpha: a });
  return tw(kind, { font: 'mono', size: 16, weight: 700 }) + 21;
}
/** a dot on a point, an elbow leader, and a label */
function callout(t, t0, p, label, o = {}) {
  const k = ep(t, t0, t0 + 0.5, E.snap); if (k <= 0) return;
  const col = o.color || C.ink, a = o.alpha == null ? 1 : o.alpha;
  const to = o.to || [p[0] + (o.dx == null ? 140 : o.dx), p[1] + (o.dy == null ? -60 : o.dy)];
  const right = o.side ? o.side === 'r' : to[0] >= p[0];
  circle(p[0], p[1], 5 * k, { fill: col, alpha: a }); circle(p[0], p[1], 11 * k, { color: col, w: 1.5, alpha: 0.45 * a });
  const midx = o.elbow != null ? o.elbow : p[0] + (to[0] - p[0]) * 0.3;
  poly([[p[0], p[1]], [midx, to[1]], [to[0], to[1]]], { color: col, w: 1.5, p: k, alpha: a * 0.85 });
  const r = text(label, to[0] + (right ? 12 : -12), to[1] + 6, { size: o.size || 19, weight: o.weight || 700, color: o.tcolor || C.ink, align: right ? 'left' : 'right', t, t0: t0 + 0.3, cps: 80, alpha: a, maxW: o.maxW || 420, lh: 1.3 });
  if (o.sub) text(o.sub, to[0] + (right ? 12 : -12), to[1] + 6 + r.h, { size: 15, weight: 500, color: C.mute, align: right ? 'left' : 'right', t, t0: t0 + 0.6, cps: 100, alpha: a, maxW: o.maxW || 420, lh: 1.35 });
}
/** a key number that slams in: drops big, lands with an overshoot, a ripple runs out */
function slam(t, t0, x, y, num, unit, o = {}) {
  const u = t - t0; if (u < 0) return 0;
  const size = o.size || 132, col = o.color || C.ink;
  const land = 0.16, k = clamp(u / land), sc = u < land ? lerp(1.9, 1, E.in3(k)) : 1 + 0.06 * Math.exp(-(u - land) * 14) * Math.cos((u - land) * 40);
  G.save(); G.translate(x, y); G.scale(sc, sc);
  const r = text(num, 0, 0, { size, weight: 800, color: col, ls: -4, align: o.align || 'left', alpha: clamp(u / 0.06) });
  if (unit) text(unit, (o.align === 'right' ? 0 : r.w) + 12, 0, { size: Math.round(size * 0.24), weight: 700, color: o.ucolor || C.mute });
  G.restore();
  if (u > land && u < land + 0.6) { const rp = (u - land) / 0.6; circle(x + (o.align === 'right' ? -r.w / 2 : r.w / 2), y - size * 0.35, 40 + rp * 260, { color: col, w: 3 * (1 - rp), alpha: 0.5 * (1 - rp) }); }
  if (o.label) text(o.label, x, y + (o.ly || 44), { size: o.lsize || 18, weight: 600, color: C.mute, t, t0: t0 + 0.3, cps: 90, maxW: o.maxW || 560, align: o.align, lh: 1.4 });
  return r.w;
}
/** a quieter number: typed, no slam */
function bignum(t, t0, x, y, num, unit, o = {}) {
  const size = o.size || 96, col = o.color || C.ink;
  const cu = o.count === false ? null : countUp(num, ep(t, t0, t0 + 0.9, E.out3));
  const r = cu != null ? text(cu, x, y, { size, weight: 800, color: col, ls: -3, align: o.align, alpha: ep(t, t0, t0 + 0.15) }) : text(num, x, y, { size, weight: 800, color: col, ls: -3, align: o.align, t, t0, cps: 24 });
  if (unit) text(unit, (o.align === 'right' ? x : x + tw(num, { size, weight: 800, ls: -3 })) + 10, y, { size: Math.round(size * 0.24), weight: 700, color: o.ucolor || C.mute, alpha: ep(t, t0 + 0.3, t0 + 0.6) });
  if (o.label) text(o.label, x, y + (o.ly || 40), { size: o.lsize || 17, weight: 600, color: C.mute, t, t0: t0 + 0.3, cps: 100, maxW: o.maxW || 520, lh: 1.4 });
  return r.w;
}
function rule(x1, y, x2, a = 1, col) { line(x1, y, x2, y, { color: col || C.hair, w: 1.5, alpha: a }); }
/** the stage's jolt for a slam (applied by the app) */
function joltAt(t, t0) { const u = t - t0 - 0.16; if (u < 0 || u > 0.35) return [0, 0]; const d = 9 * Math.exp(-u * 16); return [Math.sin(u * 90) * d, Math.cos(u * 70) * d * 0.6]; }

/* ---------- chapter title card: a disc of the accent opens from a point, the chapter name types over it ---------- */
function chapterCard(t, o) {
  const A = acc(o.ch || curSlide().ch);
  const r = ep(t, 0.0, 1.1, E.io5) * 2300, x = o.x || 300, y = o.y || 760;
  if (r > 0) { circle(x, y, r, { fill: rgba(A, TH ? 0.14 : 0.16) }); if (r < 2290) circle(x, y, r, { color: A, w: 5, alpha: 0.9 }); }
  const ci = DECK.chapters.findIndex(c => c.key === (o.ch || curSlide().ch));
  text(String(ci).padStart(2, '0'), LM, 300, { size: 26, weight: 800, color: A, t, t0: 0.6, cps: 20 });
  text(o.name, LM, 420, { size: 132, weight: 800, color: C.ink, t, t0: 0.8, cps: 14, ls: -6 });
  if (o.gloss) text(o.gloss, LM + 6, 500, { size: 26, weight: 500, color: C.ink2, t, t0: 1.6, cps: 50, maxW: 980, lh: 1.45 });
  if (o.list) o.list.forEach((l, i) => {
    const y2 = 640 + i * 40, tt = 2.3 + i * 0.16;
    text(l[0], LM + 6, y2, { size: 18, weight: 800, color: A, t, t0: tt, cps: 60 });
    text(l[1], LM + 96, y2, { size: 19, weight: 500, color: C.ink2, t, t0: tt + 0.05, cps: 90 });
  });
}

/* ---------- charts ---------- */
/** horizontal bars. o = {x, y, w, labelW, rowH, max, min, t0, rows: [{label, v, v0, color, text, sub, dash}], unit, grid, gridFmt, log} */
function hbars(t, o) {
  const lw = o.labelW == null ? 300 : o.labelW, rh = o.rowH || 62, x0 = o.x + lw, w = o.w, min = o.min || 0, max = o.max;
  const X = v => o.log ? x0 + w * (Math.log10(v) - Math.log10(min)) / (Math.log10(max) - Math.log10(min)) : x0 + w * (v - min) / (max - min);
  const a0 = ep(t, o.t0, o.t0 + 0.5);
  if (o.grid) for (const g of o.grid) { const gx = X(g); line(gx, o.y - 18, gx, o.y + rh * o.rows.length - 18, { color: C.hair, w: 1.5, alpha: a0 }); text(o.gridFmt ? o.gridFmt(g) : String(g), gx, o.y + rh * o.rows.length + 8, { font: 'mono', size: 15, weight: 600, color: C.mute, align: 'center', alpha: a0 }); }
  if (o.unit) text(o.unit, x0 + w, o.y - 34, { size: 15, weight: 600, color: C.mute, align: 'right', alpha: a0 });
  o.rows.forEach((r, i) => {
    const y = o.y + i * rh, d = o.stagger == null ? 0.12 : o.stagger, k = ep(t, o.t0 + 0.15 + i * d, o.t0 + 0.95 + i * d, E.snap);
    text(r.label, o.x, y + 7, { size: o.lsize || 20, weight: r.bold ? 800 : 600, color: r.lcolor || C.ink, t, t0: o.t0 + i * d, cps: 90, maxW: lw - 16 });
    const xa = X(r.v0 == null ? min : r.v0), xb = X(r.v), col = r.color || C.gray, bh = o.barH || 18;
    if (r.dash) { G.save(); G.setLineDash([6, 5]); G.strokeStyle = col; G.lineWidth = 2; G.strokeRect(xa, y - bh / 2, (xb - xa) * k, bh); G.restore(); }
    else { rect(xa, y - bh / 2, Math.max(r.v0 != null ? 2 : 0, (xb - xa) * k), bh, { fill: col }); glint(xa, y - bh / 2, (xb - xa) * k, bh, t, o.t0 + 4 + i * 0.22); }
    if (r.text) { const cu = countUp(r.text, k, r.v0 != null ? r.v0 : min); text(cu != null ? cu : r.text, xa + (xb - xa) * k + 14, y + 6, { size: 18, weight: 800, color: r.tcolor || col, alpha: clamp(k * 1.4 - 0.3) }); }
    if (r.sub) text(r.sub, o.x, y + 30, { size: 14, weight: 500, color: C.mute, t, t0: o.t0 + 0.4 + i * d, cps: 120, maxW: lw - 16 });
  });
}
/** a soft band of light that runs along a finished bar now and then, so a settled chart still breathes.
   phase0 staggers bars; per is the time between passes */
function glint(x, y, w, h, t, t0, per = 7) {
  if (w < 6 || t < t0) return;
  const c = ((t - t0) % per) / 1.1; if (c >= 1) return;
  const bx = x - 60 + (w + 120) * E.io3(c), g = G.createLinearGradient(bx - 50, 0, bx + 50, 0);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, TH ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.3)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  G.save(); G.beginPath(); G.rect(x, y, w, h); G.clip(); G.globalAlpha = 1; G.fillStyle = g; G.fillRect(bx - 50, y, 100, h); G.restore();
}
/** an x-y frame; returns {X, Y} */
function axes(t, o) {
  const a = ep(t, o.t0, o.t0 + 0.6);
  const map = (v, r, log) => log ? (Math.log10(v) - Math.log10(r[0])) / (Math.log10(r[1]) - Math.log10(r[0])) : (v - r[0]) / (r[1] - r[0]);
  const X = v => o.x + o.w * map(v, o.xr, o.xlog), Y = v => o.y + o.h - o.h * map(v, o.yr, o.ylog);
  for (const v of o.yticks || []) { line(o.x, Y(v), o.x + o.w, Y(v), { color: C.hair, w: 1.2, alpha: a }); text(o.yfmt ? o.yfmt(v) : String(v), o.x - 12, Y(v) + 5, { size: 15, weight: 600, color: C.mute, align: 'right', alpha: a }); }
  for (const v of o.xticks || []) { line(X(v), o.y + o.h, X(v), o.y + o.h + 8, { color: C.faint, w: 1.5, alpha: a }); text(o.xfmt ? o.xfmt(v) : String(v), X(v), o.y + o.h + 30, { size: 15, weight: 600, color: C.mute, align: 'center', alpha: a }); }
  line(o.x, o.y + o.h, o.x + o.w, o.y + o.h, { color: C.faint, w: 1.5, alpha: a });
  if (o.xlabel) text(o.xlabel, o.x + o.w, o.y + o.h + 60, { size: 16, weight: 600, color: C.mute, align: 'right', alpha: a });
  if (o.ylabel) text(o.ylabel, o.x, o.y - 22, { size: 16, weight: 600, color: C.mute, alpha: a });
  return { X, Y };
}
function series(m, pts, o) { poly(pts.map(p => [m.X(p[0]), m.Y(p[1])]), o); }

/** a drafting dimension: extension lines from a and b, offset by off (px, perpendicular), ticks at both ends, a typed label */
function dim(t, t0, a, b, label, off, o = {}) {
  const k = ep(t, t0, t0 + 0.6, E.snap); if (k <= 0) return;
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const A = [a[0] + nx * off, a[1] + ny * off], B = [b[0] + nx * off, b[1] + ny * off], col = o.color || C.mute;
  line(a[0] + nx * 8 * Math.sign(off), a[1] + ny * 8 * Math.sign(off), A[0] + nx * 10 * Math.sign(off), A[1] + ny * 10 * Math.sign(off), { color: col, w: 1.2, alpha: k });
  line(b[0] + nx * 8 * Math.sign(off), b[1] + ny * 8 * Math.sign(off), B[0] + nx * 10 * Math.sign(off), B[1] + ny * 10 * Math.sign(off), { color: col, w: 1.2, alpha: k });
  const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  line(m[0], m[1], lerp(m[0], A[0], k), lerp(m[1], A[1], k), { color: col, w: 1.5 }); line(m[0], m[1], lerp(m[0], B[0], k), lerp(m[1], B[1], k), { color: col, w: 1.5 });
  for (const P of [A, B]) { if (k < 0.98) break; line(P[0] - 5 * (nx + dx / L), P[1] - 5 * (ny + dy / L), P[0] + 5 * (nx + dx / L), P[1] + 5 * (ny + dy / L), { color: col, w: 2 }); }
  const ang = Math.atan2(dy, dx), up = Math.abs(ang) > Math.PI / 2;
  G.save(); G.translate(m[0] + nx * 16 * Math.sign(off), m[1] + ny * 16 * Math.sign(off)); G.rotate(up ? ang + Math.PI : ang);
  text(label, 0, off > 0 ? 14 : -8, { size: o.size || 17, weight: 700, color: o.tcolor || C.ink, align: 'center', t, t0: t0 + 0.4, cps: 60 });
  G.restore();
}
/** a number that counts up: '0.34' at k = 0.5 reads '0.17'. returns null when s isn't a plain number with a prefix or suffix */
function countUp(s, k, from = 0) {
  const m = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(\D*)$/.exec(String(s)); if (!m || k >= 1) return k >= 1 && m ? s : null;
  const raw = m[2].replace(/,/g, ''), d = (raw.split('.')[1] || '').length, v = from + (parseFloat(raw) - from) * k;
  const body = m[2].includes(',') ? v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) : v.toFixed(d);
  return m[1] + body + m[3];
}
