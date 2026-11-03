/* ============================================================================================
   ui: the recurring pieces. A slide reads top to bottom:
     section label (icon, chapter, n / of) ............ idea chips          y  76
     TITLE, IN CAPS, RISING OUT OF ITS MASK                                 y 150
     the narration, typed (the old captions, now the lead)                  y 206 (two lines at most)
     [ cards: drawings, charts ]                                            y 272 to 852
     — WHAT THAT MEANS (gloss)          — THE FEATURE (feature card, pills) y 880 to 990
     THESEUS / CHAPTER ................. source ................ 05 / 56   y 1046 (drawn by the app)
   Everything here is drawn on the 40 px grid; LM and RM sit on grid lines.
   ============================================================================================ */
const LM = 80, RM = W - 80;
const LAY = { labelY: 76, titleY: 150, leadY: 206, top: 272, bottom: 852, bandY: 880, ruleY: 1008, footY: 1046 };
function curSlide() { return DECK.slides[APP.i]; }
function chapterInfo(s) {
  const ch = DECK.chapters.find(c => c.key === s.ch), list = DECK.slides.filter(x => x.ch === s.ch && !x.card);
  return { name: ch ? ch.name : '', n: list.indexOf(s) + 1, of: list.length, num: DECK.chapters.indexOf(ch) };
}
const pad2 = n => String(n).padStart(2, '0');

/* ---------- a paragraph of runs that wraps: a bold run-in head, then plain text (dictionary style) ----------
   runs: [{ s, role, weight, color, font, caps }]; o: { maxW, lh (px), t, t0, cps, alpha, maxLines }. returns { h, lines } */
function para(runs, x, y, o = {}) {
  const words = [];
  runs.filter(Boolean).forEach(r0 => { const r = sty(Object.assign({ role: 'body' }, r0)); prepare(r.s, r).split(/( +|\n)/).forEach(w => { if (w && !/^( +|\n)$/.test(w)) words.push({ w, r }); }); });
  const lines = []; let cur = [], cw = 0;
  const wid = wd => { setFont(wd.r); return measureStr(wd.w, wd.r); }, spw = r => { setFont(r); return G.measureText(' ').width; };
  for (const wd of words) {
    const ww = wid(wd), sp = spw(wd.r);
    if (cur.length && cw + sp + ww > (o.maxW || 800)) { lines.push(cur); cur = []; cw = 0; }
    const s0 = cur.length ? sp : 0;
    cur.push(Object.assign({}, wd, { ww, sp: s0 })); cw += s0 + ww;
  }
  if (cur.length) lines.push(cur);
  const size = sty(Object.assign({ role: 'body' }, runs[0] || {})).size || 28, lh = o.lh || size * 1.4;
  const nL = o.maxLines ? Math.min(o.maxLines, lines.length) : lines.length;
  let shown = o.t0 != null ? Math.max(0, (o.t - o.t0) * (o.cps || 90)) : Infinity, a = o.alpha == null ? 1 : o.alpha;
  for (let i = 0; i < nL; i++) {
    let xx = x;
    for (const wd of lines[i]) {
      xx += wd.sp;
      if (shown <= 0) break;
      const vis = shown >= wd.w.length ? wd.w : wd.w.slice(0, Math.floor(shown));
      text(vis, xx, y + i * lh, Object.assign({}, wd.r, { role: undefined, caps: false, sentence: false, alpha: a * (wd.r.alpha == null ? 1 : wd.r.alpha) }));
      shown -= wd.w.length + 1; xx += wd.ww;
    }
  }
  return { h: nL * lh, lines: nL };
}

/* ---------- section icons: one small technical glyph per chapter, 2 px strokes in a 22 px box ---------- */
function chapterIcon(key, x, y, s = 22, col, a = 1) {
  if (a <= 0.003) return;
  const c = col || acc(key), k = s / 22;
  G.save(); G.globalAlpha = a; G.translate(x, y); G.scale(k, k); G.strokeStyle = c; G.fillStyle = c; G.lineWidth = 2; G.lineJoin = 'round'; G.lineCap = 'round';
  G.beginPath();
  switch (key) {
    case 'click': G.rect(3, 9, 16, 11); G.moveTo(11, 9); G.lineTo(11, 3); G.moveTo(7, 3); G.lineTo(15, 3); G.stroke(); break;                 /* a switch and its plunger */
    case 'glide': G.moveTo(1, 17); G.lineTo(21, 17); G.stroke(); G.beginPath(); G.ellipse(11, 12.5, 6.5, 3.5, 0, 0, TAU); G.fill(); break;   /* a dot skate on the pad */
    case 'shell': G.moveTo(2, 19); G.lineTo(11, 3); G.lineTo(20, 19); G.closePath(); G.moveTo(6.5, 11); G.lineTo(15.5, 11); G.moveTo(11, 19); G.lineTo(6.5, 11); G.moveTo(11, 19); G.lineTo(15.5, 11); G.stroke(); break; /* a lattice cell */
    case 'surface': G.rect(2, 8, 18, 12); G.stroke(); G.beginPath(); G.moveTo(2, 5); G.lineTo(20, 5); G.stroke(); G.beginPath(); for (let i = 0; i < 4; i++) { G.moveTo(4 + i * 5, 20); G.lineTo(8 + i * 5, 8); } G.globalAlpha = a * 0.6; G.stroke(); break; /* a coat on a section */
    case 'elec': G.rect(5, 5, 12, 12); G.stroke(); G.beginPath(); for (const v of [8, 11, 14]) { G.moveTo(v, 1); G.lineTo(v, 5); G.moveTo(v, 17); G.lineTo(v, 21); G.moveTo(1, v); G.lineTo(5, v); G.moveTo(17, v); G.lineTo(21, v); } G.stroke(); break; /* a chip */
    case 'shape': G.moveTo(1, 18); G.quadraticCurveTo(11, 4, 21, 18); G.stroke(); G.beginPath(); G.moveTo(11, 11); G.lineTo(11, 2); G.moveTo(8, 5); G.lineTo(11, 2); G.lineTo(14, 5); G.stroke(); break; /* a curve and its normal */
    case 'own': G.arc(11, 11, 9, 0, TAU); G.stroke(); G.beginPath(); G.moveTo(6.5, 11); G.lineTo(15.5, 11); G.moveTo(11, 6.5); G.lineTo(11, 15.5); G.stroke(); break; /* a screw head */
    default: G.arc(11, 11, 7, 0, TAU); G.moveTo(11, 0); G.lineTo(11, 22); G.moveTo(0, 11); G.lineTo(22, 11); G.stroke();                        /* a registration mark */
  }
  G.restore();
}
/** section label: icon, chapter name, and where we are in it. returns its width */
function sectionLabel(t, t0, x, y, o = {}) {
  const s = curSlide(), ci = chapterInfo(s), key = o.ch || s.ch, A = acc(key), a = ep(t, t0, t0 + 0.35) * (o.alpha == null ? 1 : o.alpha);
  if (a <= 0.003) return 0;
  chapterIcon(key, x, y - 19, 22, A, a);
  const name = o.text || ci.name;
  const r = rich([
    { s: name, role: 'label', size: 22, color: A, t0: t0 + 0.05, cps: 70 },
    o.n === false || !ci.n ? null : { s: `${pad2(ci.n)} / ${pad2(ci.of)}`, role: 'label', size: 22, color: C.faint, gap: 18, t0: t0 + 0.25, cps: 70 }
  ], x + 36, y, { t, alpha: a });
  return 36 + r.w;
}
/** small outlined chips (idea numbers), right-aligned at x. returns the width used */
function chips(t, t0, xr, y, items, o = {}) {
  const st = { role: 'label', size: o.size || 21, track: 0.04 }, padx = 11, gap = 10;
  setFont(sty(st));
  const labels = items.map(n => typeof n === 'number' ? '#' + n : caps(String(n)));
  const ws = labels.map(l => tw(l, st) + padx * 2);
  let x = xr - ws.reduce((a, b) => a + b, 0) - gap * (ws.length - 1);
  const x0 = x;
  labels.forEach((l, i) => {
    const a = ep(t, t0 + i * 0.06, t0 + i * 0.06 + 0.3) * (o.alpha == null ? 1 : o.alpha);
    rr(x, y - 25, ws[i], 34, 6, null, o.color || inkA(0.28), 1.5, a);
    text(l, x + padx, y - 1, Object.assign({}, st, { color: o.tcolor || C.mute, alpha: a }));
    x += ws[i] + gap;
  });
  return xr - x0;
}
/** eyebrow, title and the ideas on this slide. o = { eyebrow, size, maxW, noIdeas, sub }. returns the y under the title */
const HDR = { bottom: LAY.titleY + 10, lead: LAY.leadY };
function header(t, title, o = {}) {
  const s = curSlide();
  if (o.eyebrow) { const parts = o.eyebrow.split('//').map(p => p.trim()); sectionLabel(t, 0.05, LM, LAY.labelY, { text: parts[parts.length > 1 ? 1 : 0] || parts[0], n: false }); }
  else sectionLabel(t, 0.05, LM, LAY.labelY);
  if (s.ideas && s.ideas.length && !o.noIdeas) chips(t, 0.5, RM, LAY.labelY, s.ideas);
  const size = o.size || T.h1.size;
  const r = text(title, LM - 3, LAY.titleY, { role: 'h1', size, color: C.ink, t, rise: [0.12, 0.8], maxW: o.maxW || (RM - LM), lh: 1.0 });
  HDR.bottom = LAY.titleY + (r.lines.length - 1) * size + 14; HDR.lead = LAY.leadY + (r.lines.length - 1) * size;
  if (o.sub) text(o.sub, LM, HDR.lead, { role: 'lead', color: C.mute, sentence: true, t, t0: 0.6, cps: 90, maxW: o.subW || 1500 });
  return HDR.bottom;
}
/** the narration: steps = [[t0, 'text'], ...], typed under the title (the XBAB subtitle), one step at a time.
   o.bottom = true keeps the old place, centred at the foot of the slide. */
function captions(t, steps, o = {}) {
  let cur = -1; for (let i = 0; i < steps.length; i++) if (t >= steps[i][0]) cur = i;
  if (cur < 0) return;
  const [t0, str] = steps[cur], nxt = steps[cur + 1];
  const out = nxt ? 1 - ep(t, nxt[0] - 0.25, nxt[0]) : 1;
  if (o.bottom) { text(str, o.x || W / 2, o.y || 972, { role: 'lead', color: C.ink2, sentence: true, t, t0, cps: o.cps || 70, maxW: o.maxW || 1300, alpha: out, align: o.align || 'center', caret: true }); return; }
  text(str, o.x || LM, o.y || HDR.lead, { role: 'lead', color: o.color || C.ink2, sentence: true, t, t0, cps: o.cps || 70, maxW: o.maxW || 1560, alpha: out, caret: true, lh: 1.32 });
}
/** a footnote: where a number came from. Mono, faint, just above the footer rule, left-aligned; long ones wrap upward.
   o = { x, y, align, maxW, t0 } */
function source(t, str, o = {}) {
  const a = ep(t, o.t0 || 0.8, (o.t0 || 0.8) + 0.6), st = { role: 'foot', color: C.faint, alpha: a, sentence: true, lh: 1.3 };
  const mw = o.maxW || (RM - LM), n = wrap(sentence(str), st, mw).length;
  text(str, o.x || LM, (o.y || LAY.ruleY - 18) - (n - 1) * 25, Object.assign(st, { maxW: mw, align: o.align || 'left' }));
}
/** the largest size (down to the reading minimum) at which s, wrapped to width w, fits avail px */
function fitSize(s, size, w, avail, lhK, weight = 500) { let z = size; while (z > TYPE_MIN.read && wrap(s, { size: z, weight }, w).length > 1 + Math.floor(avail / (lhK * z))) z -= 0.5; return z; }

/* ---------- the band at the foot of a slide: what a word means (left), and the feature (right) ----------
   Both are open blocks, Kunai-style: an accent dash, a mono label, then a run-in paragraph. They grow upward from the band. */
function bandBlock(t, t0, x, w, label, head, body, o = {}) {
  const a = ep(t, t0, t0 + 0.45); if (a <= 0.003) return;
  const y = o.y || LAY.bandY, dy = (1 - E.out3(a)) * 14;
  G.save(); G.translate(0, dy);
  rect(x, y - 26, 28 * E.out3(a), 3, { fill: o.color || acc(), alpha: a });
  text(label, x + 40, y - 14, { role: 'label', size: 21, color: C.faint, alpha: a });
  if (o.right) o.right(y - 14, a);
  para([{ s: sentence(head) + (/[.:!?]$/.test(head) ? ' ' : '. '), role: 'small', size: 26, weight: 700, color: o.hcolor || C.ink }, { s: sentence(body || ''), role: 'small', size: 26, weight: 450, color: C.ink2 }],
    x, y + 30, { maxW: w, lh: 34, t, t0: t0 + 0.2, cps: 140, alpha: a, maxLines: o.maxLines || 3 });
  G.restore();
}
/** glossary block, bottom left: what a word means */
function gloss(t, t0, term, def, o = {}) {
  bandBlock(t, t0, o.x || LM, o.w || 820, 'What that means', term, def, { color: o.color, hcolor: C.ink });
}
/** feature block, bottom right: the feature on screen, how we know it (pills), one line on it */
function featureCard(t, t0, name, ev, line2, o = {}) {
  const x = o.x || W / 2 + 40, w = o.w || (RM - (W / 2 + 40)), evs = (Array.isArray(ev) ? ev : [ev]).filter(Boolean);
  bandBlock(t, t0, x, w, 'The feature', name, line2, {
    color: o.color, right: (y, a) => { let xr = x + w; for (let i = evs.length - 1; i >= 0; i--) { const pw = pillW(evs[i]); xr -= pw; pill(xr, y + 1, evs[i], a); xr -= 10; } }
  });
}

/* ---------- evidence: how we know a number ----------
   A capsule with a dot. The dot's shape is the strength of the evidence (filled: someone measured it or a datasheet says so;
   ring: a claim, a survey or our own arithmetic; dashed: our proposal or projection), its colour the kind. */
const EVID = {
  measured: { label: 'Measured', col: ['#0E9F8E', '#2CC7B4'], dot: 'fill' },
  study: { label: 'Study', col: ['#0E9F8E', '#2CC7B4'], dot: 'fill' },
  datasheet: { label: 'Datasheet', col: ['#3B74D6', '#6EA2FA'], dot: 'fill' },
  claim: { label: 'Maker claim', col: ['#D9701E', '#F59A4F'], dot: 'ring' },
  survey: { label: 'Survey', col: ['#D9701E', '#F59A4F'], dot: 'ring' },
  derived: { label: 'Derived', col: ['#7C5FD6', '#A890F5'], dot: 'ring' },
  proposal: { label: 'Proposal', col: ['#A87C00', YEL], dot: 'dash' },
  projected: { label: 'Projected', col: ['#A87C00', YEL], dot: 'half' },
  placeholder: { label: 'Placeholder data', col: ['#E5484D', '#EF7275'], dot: 'ring' }
};
const evKey = k => { k = String(k || '').toLowerCase().trim(); return k === 'maker claim' ? 'claim' : k === 'on paper' ? 'derived' : k; };
const evCol = k => { const e = EVID[evKey(k)] || EVID.derived; return e.col[TH ? 0 : 1]; };
function evLabel(k) { const e = EVID[evKey(k)]; return caps(e ? e.label : String(k)); }
const PILL = { size: 20, h: 34, padL: 30, padR: 13 };
function pillW(kind, o = {}) { return tw(o.text || evLabel(kind), { role: 'label', size: o.size || PILL.size, track: 0.08 }) + PILL.padL + PILL.padR; }
/** a dot in the evidence style, centred at (x, y) */
function evDot(x, y, kind, r = 5.5, a = 1) {
  const e = EVID[evKey(kind)] || EVID.derived, c = e.col[TH ? 0 : 1];
  if (e.dot === 'fill') circle(x, y, r, { fill: c, alpha: a });
  else if (e.dot === 'ring') circle(x, y, r - 1, { color: c, w: 2.2, alpha: a });
  else if (e.dot === 'dash') circle(x, y, r, { color: c, w: 2.2, alpha: a, dash: [2.2, 2.2] });
  else { circle(x, y, r - 1, { color: c, w: 2.2, alpha: a }); G.save(); G.globalAlpha = a; G.beginPath(); G.arc(x, y, r - 1, -Math.PI / 2, Math.PI / 2); G.closePath(); G.fillStyle = c; G.fill(); G.restore(); }
}
/** an evidence pill; (x, y) = left edge and text baseline. returns its width */
function pill(x, y, kind, a = 1, o = {}) {
  if (a <= 0.003) return pillW(kind, o);
  const label = o.text || evLabel(kind), w = pillW(kind, o), h = PILL.h;
  rr(x, y - h + 10, w, h, h / 2, o.fill || null, o.edge || inkA(TH ? 0.22 : 0.26), 1.5, a);
  evDot(x + 16, y - h / 2 + 10, kind, 5.5, a);
  text(label, x + PILL.padL, y, { role: 'label', size: o.size || PILL.size, track: 0.08, color: o.color || C.ink2, alpha: a });
  return w;
}
/** the old evidence tag, now a pill. kept for every slide that calls tag(x, y, kind, a) */
function tag(x, y, kind, a = 1) { return pill(x, y + 2, kind, a); }
/** evidence pills at a card's top right, on the row of its mono title (the Kunai card head). (x, y, w) = the card. returns the width used */
function cardPills(x, y, w, kinds, a = 1) { let xr = x + w - 24; const ks = Array.isArray(kinds) ? kinds : [kinds]; for (let i = ks.length - 1; i >= 0; i--) { xr -= pillW(ks[i]); pill(xr, y + 50, ks[i], a); xr -= 10; } return x + w - 24 - xr; }
/** a card's header row, Kunai-style: a mono label at the top left, evidence pills at the top right. returns the y below it */
function cardHead(t, t0, x, y, w, label, ev, o = {}) {
  const a = ep(t, t0, t0 + 0.4) * (o.alpha == null ? 1 : o.alpha), ly = y + (o.dy || 46);
  const evs = (Array.isArray(ev) ? ev : ev ? [ev] : []);
  let xr = x + w - 24; for (let i = evs.length - 1; i >= 0; i--) { xr -= pillW(evs[i]); pill(xr, ly + 2, evs[i], a); xr -= 10; }
  const r = text(label, x + 26, ly, { role: 'label', color: o.color || C.mute, t, t0: t0 + 0.05, cps: 80, alpha: a, maxW: xr - x - 40 });
  const n = r && r.lines ? (Array.isArray(r.lines) ? r.lines.length : r.lines) : 1;
  return ly + 30 + Math.max(0, n - 1) * 28;
}

/** a dot on a point, an elbow leader, and a label. Short names are set as mono caps labels; phrases in sentence case */
function callout(t, t0, p, label, o = {}) {
  const k = ep(t, t0, t0 + 0.5, E.snap); if (k <= 0) return;
  const col = o.color || C.ink, a = o.alpha == null ? 1 : o.alpha;
  const to = o.to || [p[0] + (o.dx == null ? 140 : o.dx), p[1] + (o.dy == null ? -60 : o.dy)];
  const right = o.side ? o.side === 'r' : to[0] >= p[0];
  circle(p[0], p[1], 5 * k, { fill: col, alpha: a }); circle(p[0], p[1], 11 * k, { color: col, w: 1.5, alpha: 0.45 * a });
  const midx = o.elbow != null ? o.elbow : p[0] + (to[0] - p[0]) * 0.3;
  poly([[p[0], p[1]], [midx, to[1]], [to[0], to[1]]], { color: col, w: 1.5, p: k, alpha: a * 0.85 });
  const short = String(label).length <= 24 && String(label).split(' ').length <= 3 && !o.prose;
  const st = short ? { role: 'label', size: 22, color: o.tcolor || C.ink } : { role: 'small', size: o.size && o.size > 25 ? o.size : 25, weight: 600, color: o.tcolor || C.ink, sentence: true };
  const r = text(label, to[0] + (right ? 12 : -12), to[1] + 8, Object.assign(st, { align: right ? 'left' : 'right', t, t0: t0 + 0.3, cps: 80, alpha: a, maxW: o.maxW ? Math.max(o.maxW, 240) : 420, lh: 1.28 }));
  if (o.sub) text(o.sub, to[0] + (right ? 12 : -12), to[1] + 8 + r.h + 2, { role: 'small', size: 24, color: C.mute, align: right ? 'left' : 'right', sentence: true, t, t0: t0 + 0.6, cps: 100, alpha: a, maxW: o.maxW ? Math.max(o.maxW, 240) : 420, lh: 1.3 });
}
/** a key number that slams in: drops big, lands with an overshoot, a ripple runs out */
function slam(t, t0, x, y, num, unit, o = {}) {
  const u = t - t0; if (u < 0) return 0;
  const size = o.size || 132, col = o.color || C.ink;
  const land = 0.16, k = clamp(u / land), sc = u < land ? lerp(1.9, 1, E.in3(k)) : 1 + 0.06 * Math.exp(-(u - land) * 14) * Math.cos((u - land) * 40);
  G.save(); G.translate(x, y); G.scale(sc, sc);
  const r = rich([{ s: num, role: 'd1', size, color: col, tnum: true }, unit ? { s: unit, role: 'label', size: Math.max(22, Math.round(size * 0.2)), color: o.ucolor || C.mute, gap: 12, caps: false } : null], 0, 0, { align: o.align || 'left', alpha: clamp(u / 0.06) });
  G.restore();
  if (u > land && u < land + 0.6) { const rp = (u - land) / 0.6; circle(x + (o.align === 'right' ? -r.w / 2 : r.w / 2), y - size * 0.35, 40 + rp * 260, { color: col, w: 3 * (1 - rp), alpha: 0.5 * (1 - rp) }); }
  if (o.label) text(o.label, x, y + (o.ly || 50), { role: 'small', color: C.mute, sentence: true, t, t0: t0 + 0.3, cps: 90, maxW: o.maxW || 560, align: o.align, lh: 1.36 });
  return r.w;
}
/** a quieter number: counts up, no slam. Display figures, a mono unit beside them */
function bignum(t, t0, x, y, num, unit, o = {}) {
  const size = o.size || 96, col = o.color || C.ink;
  const r = rich([
    { s: num, role: 'd1', size, color: col, tnum: true, count: o.count === false ? null : [t0, 0.9], alpha: ep(t, t0, t0 + 0.15) },
    unit ? { s: unit, font: 'mono', size: Math.max(22, Math.round(size * 0.24)), weight: 600, color: o.ucolor || C.mute, gap: Math.max(8, size * 0.08), alpha: ep(t, t0 + 0.3, t0 + 0.6) } : null
  ], x, y, { t, align: o.align });
  if (o.label) text(o.label, o.align === 'right' ? x : x, y + (o.ly || 44), { role: 'small', color: C.mute, sentence: true, t, t0: t0 + 0.3, cps: 100, maxW: o.maxW || 520, lh: 1.36, align: o.align });
  return r.w;
}
function rule(x1, y, x2, a = 1, col) { line(x1, y, x2, y, { color: col || C.hair, w: 1.5, alpha: a }); }
/** the stage's jolt for a slam (applied by the app) */
function joltAt(t, t0) { const u = t - t0 - 0.16; if (u < 0 || u > 0.35) return [0, 0]; const d = 9 * Math.exp(-u * 16); return [Math.sin(u * 90) * d, Math.cos(u * 70) * d * 0.6]; }
/** a registration mark (the grid's +, bigger), for the corners of a composition */
function regMark(x, y, a = 1, s = 12, col) { line(x - s, y, x + s, y, { color: col || C.ink, w: 1.5, alpha: a }); line(x, y - s, x, y + s, { color: col || C.ink, w: 1.5, alpha: a }); circle(x, y, s * 0.5, { color: col || C.ink, w: 1.5, alpha: a }); }

/* ---------- the slide's chrome, drawn by the app over every slide: a rule, THESEUS / chapter, n / N ---------- */
function slideChrome(t, s) {
  if (s.chrome === false) return;
  const i = DECK.slides.indexOf(s), N = DECK.slides.length, ch = DECK.chapters.find(c => c.key === s.ch), A = acc(s.ch);
  const a = ep(t, 0.05, 0.6), y = LAY.footY;
  line(LM, LAY.ruleY, LM + (RM - LM) * ep(t, 0.0, 0.9, E.cam), LAY.ruleY, { color: C.hair, w: 1.5 });
  /* where this slide sits in the deck: a short accent mark on the rule */
  const px = LM + (RM - LM - 28) * (i / Math.max(1, N - 1));
  rect(px, LAY.ruleY - 1.5, 28, 3, { fill: A === C.ink ? C.ink2 : A, alpha: a });
  const r = rich([{ s: 'Theseus', role: 'foot', weight: 700, track: 0.24, caps: true, color: C.ink2 }, { s: '/', role: 'foot', color: C.faint, gap: 14 }, { s: ch ? ch.name : '', role: 'foot', caps: true, track: 0.12, color: C.faint, gap: 14 }], LM, y, { alpha: a });
  text(`${pad2(i + 1)} / ${pad2(N)}`, RM, y, { role: 'foot', weight: 600, color: C.mute, align: 'right', alpha: a });
  return r;
}

/* ---------- chapter title card: the name huge, an XBAB-style count, the chapter's ideas as a numbered list, its part on the right ---------- */
function chapterCard(t, o) {
  const key = o.ch || curSlide().ch, A = acc(key), ci = DECK.chapters.findIndex(c => c.key === key), nCh = DECK.chapters.length - 2;
  /* a hairline circle opens round the part: the iris that brought us here, settling into a frame */
  const cx = o.cx || 1380, cy = o.cy || 580, R0 = o.r || 400, R = ep(t, 0.2, 1.4, E.cam) * R0;
  if (R > 1) { circle(cx, cy, R, { color: A, w: 1.5, alpha: 0.6 }); circle(cx, cy, R + 16, { color: inkA(0.08), w: 1 }); }
  const km = ep(t, 1.0, 1.4) * 0.7;
  for (const [mx, my] of [[cx - R0 - 44, cy], [cx + R0 + 44, cy], [cx, cy - R0 - 44], [cx, cy + R0 + 44]]) regMark(mx, my, km, 9, A);
  /* label row */
  chapterIcon(key, LM, LAY.labelY - 19, 22, A, ep(t, 0.3, 0.6));
  rich([{ s: 'Chapter ' + pad2(ci), role: 'label', size: 22, color: A, t0: 0.35, cps: 50 }, { s: `/ ${pad2(nCh)}`, role: 'label', size: 22, color: C.faint, gap: 12, t0: 0.6, cps: 50 }], LM + 36, LAY.labelY, { t });
  /* the count, XBAB's TOTAL: a label, a huge number, a unit */
  const n = typeof chapterIdeaCount === 'function' ? chapterIdeaCount(key) : (o.list || []).length;
  if (n) {
    text('Ideas in this chapter', RM, LAY.labelY, { role: 'label', size: 21, track: 0.18, color: C.mute, align: 'right', alpha: ep(t, 0.8, 1.2) });
    rich([{ s: String(n), role: 'd1', size: 120, color: C.ink, tnum: true, count: [1.0, 1.0] }], RM, LAY.labelY + 118, { t, align: 'right', alpha: ep(t, 0.9, 1.1) });
  }
  /* the name: as big as the column allows */
  const nm = caps(o.name), size = o.size || Math.min(176, 900 / Math.max(1, tw(nm, { role: 'd2', size: 1, caps: false })));
  text(nm, LM - size * 0.05, 370, { role: 'd2', size, weight: 900, color: C.ink, t, rise: [0.6, 0.9] });
  line(LM, 412, LM + 900 * ep(t, 0.9, 1.7, E.cam), 412, { color: C.hair, w: 1.5 });
  rect(LM, 410.5, 64 * ep(t, 1.2, 1.6, E.out3), 4, { fill: A });
  if (o.gloss) text(o.gloss, LM, 474, { role: 'lead', size: 31, color: C.ink2, sentence: true, t, t0: 1.4, cps: 70, maxW: 880, lh: 1.32 });
  if (o.list) {
    const glossH = o.gloss ? wrap(sentence(o.gloss), { role: 'lead', size: 31 }, 880).length * 41 : 0;
    const y0 = 474 + glossH + 56, rh = Math.min(50, (980 - y0) / o.list.length);
    o.list.forEach((l, i) => {
      const y2 = y0 + i * rh, tt = 2.0 + i * 0.12, k = ep(t, tt, tt + 0.4);
      if (i) line(LM, y2 - rh + 14, LM + 900 * E.out3(k), y2 - rh + 14, { color: C.hair, w: 1.2 });
      text(pad2(i + 1), LM, y2, { role: 'tick', size: 21, color: C.faint, alpha: k });
      text(l[1], LM + 58, y2, { role: 'small', size: 26, weight: 500, color: C.ink, sentence: true, t, t0: tt + 0.05, cps: 90, alpha: k });
      text(typeof l[0] === 'number' ? '#' + l[0] : caps(l[0]), LM + 900, y2, { role: 'label', size: 21, color: A, align: 'right', alpha: k });
    });
  }
}

/* ---------- charts (the simple ones; the XBAB and Kunai charts are in 07-charts.js) ---------- */
/** horizontal bars. o = {x, y, w, labelW, rowH, max, min, t0, rows: [{label, v, v0, color, text, sub, dash, bold, hero}], unit, grid, gridFmt, log} */
function hbars(t, o) {
  const lw = o.labelW == null ? 300 : o.labelW, rh = o.rowH || 62, x0 = o.x + lw, w = o.w, min = o.min || 0, max = o.max;
  const X = v => o.log ? x0 + w * (Math.log10(v) - Math.log10(min)) / (Math.log10(max) - Math.log10(min)) : x0 + w * (v - min) / (max - min);
  const a0 = ep(t, o.t0, o.t0 + 0.5);
  if (o.grid) for (const g of o.grid) { const gx = X(g); line(gx, o.y - 22, gx, o.y + rh * o.rows.length - 22, { color: C.hair, w: 1.2, alpha: a0 }); text(o.gridFmt ? o.gridFmt(g) : String(g), gx, o.y + rh * o.rows.length + 6, { role: 'tick', color: C.mute, align: 'center', alpha: a0 }); }
  if (o.unit) text(o.unit, x0 + w, o.y - 40, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: a0 });
  o.rows.forEach((r, i) => {
    const y = o.y + i * rh, d = o.stagger == null ? 0.12 : o.stagger, k = ep(t, o.t0 + 0.15 + i * d, o.t0 + 0.95 + i * d, E.snap);
    text(r.label, o.x, y + 9, { role: 'small', size: o.lsize && o.lsize > 25 ? o.lsize : 25, weight: r.bold || r.hero ? 700 : 500, color: r.lcolor || C.ink, t, t0: o.t0 + i * d, cps: 90, maxW: lw - 16, sentence: o.sentence !== false });
    const xa = X(r.v0 == null ? min : r.v0), xb = X(r.v), bh = o.barH || 20;
    const col = r.hero ? YEL : (r.color || C.comp);
    rect(xa, y - bh / 2, xb - xa, bh, { fill: C.track, alpha: a0 * (o.tracks ? 1 : 0) });
    if (r.dash) { G.save(); G.globalAlpha = 1; G.setLineDash([6, 5]); G.strokeStyle = r.hero ? C.heroText : col; G.lineWidth = 2; G.strokeRect(xa, y - bh / 2, (xb - xa) * k, bh); G.restore(); }
    else { rect(xa, y - bh / 2, Math.max(r.v0 != null ? 2 : 0, (xb - xa) * k), bh, { fill: col }); if (r.hero && TH) rect(xa, y - bh / 2, (xb - xa) * k, bh, { color: C.heroEdge, w: 1.5 }); glint(xa, y - bh / 2, (xb - xa) * k, bh, t, o.t0 + 4 + i * 0.22); }
    if (r.text) { const cu = countUp(r.text, k, r.v0 != null ? r.v0 : min); text(cu != null ? cu : r.text, xa + (xb - xa) * k + 14, y + 8, { role: 'num', size: 24, weight: 700, color: r.tcolor || (r.hero ? C.ink : r.color && r.color !== C.comp ? r.color : C.ink2), alpha: clamp(k * 1.4 - 0.3) }); }
    if (r.sub) text(r.sub, o.x, y + 36, { role: 'label', size: 21, color: C.mute, t, t0: o.t0 + 0.4 + i * d, cps: 120, maxW: lw - 16 });
  });
}
/** a soft band of light that runs along a finished bar now and then, so a settled chart still breathes */
function glint(x, y, w, h, t, t0, per = 7) {
  if (w < 6 || t < t0) return;
  const c = ((t - t0) % per) / 1.1; if (c >= 1) return;
  const bx = x - 60 + (w + 120) * E.io3(c), g = G.createLinearGradient(bx - 50, 0, bx + 50, 0);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, TH ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.22)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  G.save(); G.beginPath(); G.rect(x, y, w, h); G.clip(); G.globalAlpha = 1; G.fillStyle = g; G.fillRect(bx - 50, y, 100, h); G.restore();
}
/** an x-y frame; returns {X, Y}. Ticks in mono, gridlines as hairlines, axis titles as mono caps labels */
function axes(t, o) {
  const a = ep(t, o.t0, o.t0 + 0.6);
  const map = (v, r, log) => log ? (Math.log10(v) - Math.log10(r[0])) / (Math.log10(r[1]) - Math.log10(r[0])) : (v - r[0]) / (r[1] - r[0]);
  const X = v => o.x + o.w * map(v, o.xr, o.xlog), Y = v => o.y + o.h - o.h * map(v, o.yr, o.ylog);
  for (const v of o.yticks || []) { line(o.x, Y(v), o.x + o.w, Y(v), { color: C.hair, w: 1.2, alpha: a }); text(o.yfmt ? o.yfmt(v) : String(v), o.x - 14, Y(v) + 7, { role: 'tick', color: C.mute, align: 'right', alpha: a }); }
  for (const v of o.xticks || []) { line(X(v), o.y + o.h, X(v), o.y + o.h + 8, { color: C.faint, w: 1.5, alpha: a }); text(o.xfmt ? o.xfmt(v) : String(v), X(v), o.y + o.h + 34, { role: 'tick', color: C.mute, align: 'center', alpha: a }); }
  line(o.x, o.y + o.h, o.x + o.w, o.y + o.h, { color: C.faint, w: 1.5, alpha: a });
  if (o.xlabel) text(o.xlabel, o.x + o.w, o.y + o.h + 72, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: a });
  if (o.ylabel) text(o.ylabel, o.x - 14, o.y - 26, { role: 'label', size: 21, color: C.mute, alpha: a });
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
  G.save(); G.translate(m[0] + nx * 18 * Math.sign(off), m[1] + ny * 18 * Math.sign(off)); G.rotate(up ? ang + Math.PI : ang);
  text(label, 0, off > 0 ? 18 : -8, { role: 'num', size: o.size && o.size > 22 ? o.size : 22, weight: 700, color: o.tcolor || C.ink, align: 'center', t, t0: t0 + 0.4, cps: 60 });
  G.restore();
}
/** a number that counts up: '0.34' at k = 0.5 reads '0.17'. returns null when s isn't a plain number with a prefix or suffix */
function countUp(s, k, from = 0) {
  const m = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(\D*)$/.exec(String(s)); if (!m || k >= 1) return k >= 1 && m ? s : null;
  const raw = m[2].replace(/,/g, ''), d = (raw.split('.')[1] || '').length, v = from + (parseFloat(raw) - from) * k;
  const body = m[2].includes(',') ? v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) : v.toFixed(d);
  return m[1] + body + m[3];
}
