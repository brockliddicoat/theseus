/* ============================================================================================
   core: stage size, palette, type, easing, time helpers, 2D drawing primitives.
   Every frame is a pure function of slide time t (seconds), so any frame can be captured.
   ============================================================================================ */
'use strict';
const W = 1920, H = 1080;

/* the old film's system: the stage is night (TH = 0) or paper (TH = 1); every slide picks one, and the
   transitions between them are where white turns to black. Accents as in the film. One typeface. */
let TH = 0;
const PAPER = '#f7f6f2', NIGHT = '#0d0e0f';
const C = {
  red: '#e5484d', redL: '#ef7275', redD: '#b8383d',
  blue: '#4a86e8', blueL: '#77a5f0', blueD: '#3466bf',
  purple: '#9a6ee0', purpleL: '#b693ec', purpleD: '#7650bd',
  green: '#46b35a', greenL: '#71c982', greenD: '#338a45',
  brown: '#9a6a3d', brownL: '#c08a52', gray: '#9da3ae', white: '#ffffff'
};
Object.defineProperties(C, {
  bg: { get: () => (TH ? PAPER : NIGHT) },
  ink: { get: () => (TH ? '#141516' : '#ecebe7') },
  ink2: { get: () => (TH ? '#2f3032' : '#c9c8c2') },
  mute: { get: () => (TH ? '#5c5b55' : '#9b9a94') },
  faint: { get: () => (TH ? '#8e8c85' : '#68675f') },
  hair: { get: () => (TH ? '#d6d4cd' : '#2c2d31') },
  panel: { get: () => (TH ? '#ffffff' : 'rgba(24,25,27,0.92)') },
  yellow: { get: () => (TH ? '#b6961c' : '#e2c13e') },
  orange: { get: () => (TH ? '#d4861c' : '#f0a43a') },
  gold: { get: () => (TH ? '#b6961c' : '#e2c13e') },
  loss: { get: () => C.red },
  steel: { get: () => C.gray },
  cool: { get: () => C.blue }
});
function hexRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }
function rgba(hex, a) { if (hex.startsWith('rgba')) return hex; const c = hexRgb(hex); return `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)},${a})`; }
function inkA(a) { return TH ? `rgba(20,21,22,${a})` : `rgba(236,235,231,${a})`; }
/** the accent of a chapter */
const ACC = { intro: () => C.ink, click: () => C.blue, glide: () => C.green, shell: () => C.yellow, surface: () => C.purple, elec: () => C.orange, shape: () => C.brownL, own: () => TH ? '#676c75' : C.gray, end: () => C.ink };
function acc(key) { const f = ACC[key || (typeof curSlide === 'function' && curSlide() ? curSlide().ch : 'intro')]; return f ? f() : C.ink; }

const FONT = {
  disp: '"JetBrains Mono", "DejaVu Sans Mono", Consolas, monospace',
  mono: '"JetBrains Mono", "DejaVu Sans Mono", Consolas, monospace'
};

/* ---------- math ---------- */
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const smooth = x => x * x * (3 - 2 * x);
const E = {
  lin: x => x,
  out2: x => 1 - (1 - x) * (1 - x),
  out3: x => 1 - Math.pow(1 - x, 3),
  out5: x => 1 - Math.pow(1 - x, 5),
  in3: x => x * x * x,
  io3: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  io5: x => x < .5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) / 2,
  cam: bezier(0.7, 0, 0.2, 1),      /* strong asymmetric in-out: camera moves */
  snap: bezier(0.2, 0, 0, 1),       /* fast attack, long settle: things arriving */
  hit: bezier(0.55, 0, 1, 0.45)     /* accelerates into contact: a plunger meeting a switch */
};
/** cubic bezier easing (x1, y1, x2, y2), solved by Newton iterations */
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const fx = s => ((ax * s + bx) * s + cx) * s, fy = s => ((ay * s + by) * s + cy) * s, dx = s => (3 * ax * s + 2 * bx) * s + cx;
  return x => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let s = x;
    for (let i = 0; i < 8; i++) { const d = dx(s); if (Math.abs(d) < 1e-6) break; s -= (fx(s) - x) / d; }
    return fy(clamp(s));
  };
}
/** eased progress of t through [a, b] */
const ep = (t, a, b, e = E.io3) => e(prog(t, a, b));
/** rises over [a, b] and falls over [c, d] */
const env = (t, a, b, c, d, e = E.io3) => Math.min(ep(t, a, b, e), 1 - ep(t, c, d, e));
/** keyframes [[t, v], ...] with easing between neighbours */
function kf(t, keys, e = E.io3) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1] = keys[i]; const k = (keys[i][2] || e)(prog(t, t0, t1)); return Array.isArray(v0) ? v0.map((v, j) => lerp(v, v1[j], k)) : lerp(v0, v1, k); }
  }
  return keys[keys.length - 1][1];
}
/** periodic event: phase 0..1 inside a cycle of `per` seconds starting at t0 (negative before t0) */
const cyc = (t, t0, per) => t < t0 ? -1 : ((t - t0) % per) / per;
/** seeded random */
function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
const fmt = (v, d = 0) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/* ---------- 2D drawing (stage units 1920 x 1080) ---------- */
let G = null; /* the overlay context, set by the app each frame */
function setFont(o) {
  const fam = FONT[o.font || 'disp'] || o.font;
  G.font = `${o.italic ? 'italic ' : ''}${o.weight || 400} ${o.size || 28}px ${fam}`;
  try { G.fontStretch = o.stretch || 'normal'; } catch (e) { /* older canvas */ }
  try { G.letterSpacing = (o.ls || 0) + 'px'; } catch (e) { }
}
/** width of a string in the given style */
function tw(s, o) { setFont(o); return G.measureText(s).width; }
/** split text into lines that fit maxW */
function wrap(s, o, maxW) {
  const out = []; for (const para of String(s).split('\n')) {
    const words = para.split(' '); let line = '';
    for (const w of words) { const test = line ? line + ' ' + w : w; if (line && tw(test, o) > maxW) { out.push(line); line = w; } else line = test; }
    out.push(line);
  }
  return out;
}
/** typing: how many characters of s are visible at time t when typing starts at t0 */
function typed(s, t, t0, cps = 55) {
  if (t0 == null) return s.length;
  return clamp(Math.floor((t - t0) * cps), 0, s.length);
}
/**
 * text: o = {size, weight, font, stretch, color, alpha, align, base, ls, maxW, lh, t, t0 (typing start), cps, caret,
 *            wipe (0..1 left-to-right reveal)}; returns {w, h, lines}
 */
function text(s, x, y, o = {}) {
  setFont(o);
  G.textAlign = o.align || 'left'; G.textBaseline = o.base || 'alphabetic';
  const lines = o.maxW ? wrap(s, o, o.maxW) : String(s).split('\n');
  const lh = (o.lh || 1.22) * (o.size || 28);
  const total = lines.reduce((n, l) => n + l.length, 0);
  let shown = o.t0 != null ? typed(s, o.t, o.t0, o.cps || 55) : Infinity;
  const a = o.alpha == null ? 1 : o.alpha;
  if (a <= 0.001) return { w: 0, h: lines.length * lh, lines };
  G.globalAlpha = a; G.fillStyle = o.color || C.ink;
  let maxw = 0, k = 0;
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i], n = clamp(shown - k, 0, L.length); k += L.length + 1;
    const vis = L.slice(0, n), ly = y + i * lh;
    const fullW = G.measureText(L).width; maxw = Math.max(maxw, fullW);
    if (o.wipe != null && o.wipe < 1) {
      if (o.wipe <= 0) continue;
      const x0 = o.align === 'center' ? x - fullW / 2 : o.align === 'right' ? x - fullW : x;
      G.save(); G.beginPath(); G.rect(x0 - 4, ly - o.size * 1.2, (fullW + 8) * o.wipe, o.size * 1.7); G.clip();
      G.fillText(vis, x, ly); G.restore();
    } else G.fillText(vis, x, ly);
    if (o.caret && o.t0 != null && n < L.length && n > 0 && shown < total) {
      const cw = G.measureText(vis).width, cx = o.align === 'center' ? x - fullW / 2 + cw : x + cw;
      G.fillRect(cx + 3, ly - o.size * 0.78, Math.max(2, o.size * 0.08), o.size * 0.9);
    }
  }
  G.globalAlpha = 1;
  return { w: maxw, h: lines.length * lh, lines };
}
function line(x1, y1, x2, y2, o = {}) {
  const p = o.p == null ? 1 : o.p; if (p <= 0) return;
  G.globalAlpha = o.alpha == null ? 1 : o.alpha; G.strokeStyle = o.color || C.ink; G.lineWidth = o.w || 2;
  G.lineCap = o.cap || 'butt'; G.setLineDash(o.dash || []);
  G.beginPath(); G.moveTo(x1, y1); G.lineTo(lerp(x1, x2, p), lerp(y1, y2, p)); G.stroke();
  G.setLineDash([]); G.globalAlpha = 1;
}
function poly(pts, o = {}) {
  if (pts.length < 2) return;
  const p = o.p == null ? 1 : o.p; if (p <= 0) return;
  G.globalAlpha = o.alpha == null ? 1 : o.alpha;
  G.beginPath();
  let total = 0; const seg = [];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); total += d; }
  let left = total * p; G.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    if (left >= seg[i - 1]) { G.lineTo(pts[i][0], pts[i][1]); left -= seg[i - 1]; }
    else { const k = left / seg[i - 1]; G.lineTo(lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)); break; }
  }
  if (o.close && p >= 1) G.closePath();
  if (o.fill) { G.fillStyle = o.fill; G.fill(); }
  if (o.color !== null) { G.strokeStyle = o.color || C.ink; G.lineWidth = o.w || 2; G.lineJoin = 'round'; G.lineCap = o.cap || 'round'; G.setLineDash(o.dash || []); G.stroke(); G.setLineDash([]); }
  G.globalAlpha = 1;
}
function rect(x, y, w, h, o = {}) {
  G.globalAlpha = o.alpha == null ? 1 : o.alpha;
  if (o.fill) { G.fillStyle = o.fill; G.fillRect(x, y, w, h); }
  if (o.color) { G.strokeStyle = o.color; G.lineWidth = o.w || 1.5; G.strokeRect(x, y, w, h); }
  G.globalAlpha = 1;
}
function circle(x, y, r, o = {}) {
  G.globalAlpha = o.alpha == null ? 1 : o.alpha;
  G.beginPath(); G.arc(x, y, Math.max(0, r), o.a0 || 0, o.a1 == null ? Math.PI * 2 : o.a1);
  if (o.fill) { G.fillStyle = o.fill; G.fill(); }
  if (o.color) { G.strokeStyle = o.color; G.lineWidth = o.w || 2; G.setLineDash(o.dash || []); G.stroke(); G.setLineDash([]); }
  G.globalAlpha = 1;
}
/** an arrow from (x1,y1) to (x2,y2), drawn to progress p, head size hs */
function arrow(x1, y1, x2, y2, o = {}) {
  const p = o.p == null ? 1 : o.p; if (p <= 0.001) return;
  const x = lerp(x1, x2, p), y = lerp(y1, y2, p), a = Math.atan2(y - y1, x - x1), hs = o.hs || 16, w = o.w || 3;
  const len = Math.hypot(x - x1, y - y1);
  const back = Math.min(hs, len);
  line(x1, y1, x - Math.cos(a) * back * 0.6, y - Math.sin(a) * back * 0.6, { color: o.color, w, alpha: o.alpha });
  G.globalAlpha = o.alpha == null ? 1 : o.alpha; G.fillStyle = o.color || C.ink;
  G.beginPath(); G.moveTo(x, y);
  G.lineTo(x - Math.cos(a - 0.42) * back, y - Math.sin(a - 0.42) * back);
  G.lineTo(x - Math.cos(a + 0.42) * back, y - Math.sin(a + 0.42) * back); G.closePath(); G.fill(); G.globalAlpha = 1;
}
/** clip all drawing in fn to a rectangle */
function clipped(x, y, w, h, fn) { G.save(); G.beginPath(); G.rect(x, y, w, h); G.clip(); fn(); G.restore(); }

/* ---------- the film's paper: a still 40 px grid, a + on every fourth crossing ---------- */
function paper(a = 1) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a; G.lineWidth = 1;
  G.strokeStyle = inkA(TH ? 0.055 : 0.035); G.beginPath();
  for (let x = 0; x <= W + 40; x += 40) { G.moveTo(x + 0.5, 0); G.lineTo(x + 0.5, H); }
  for (let y = 0; y <= H + 40; y += 40) { G.moveTo(0, y + 0.5); G.lineTo(W, y + 0.5); }
  G.stroke();
  G.strokeStyle = inkA(TH ? 0.34 : 0.24); G.lineWidth = 1.5; G.beginPath();
  for (let x = 0; x <= W + 160; x += 160) for (let y = 0; y <= H + 160; y += 160) { G.moveTo(x - 7, y); G.lineTo(x + 7, y); G.moveTo(x, y - 7); G.lineTo(x, y + 7); }
  G.stroke(); G.restore();
}
/** rounded rectangle path */
function rrPath(x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); G.beginPath(); G.moveTo(x + r, y); G.arcTo(x + w, y, x + w, y + h, r); G.arcTo(x + w, y + h, x, y + h, r); G.arcTo(x, y + h, x, y, r); G.arcTo(x, y, x + w, y, r); G.closePath(); }
function rr(x, y, w, h, r, fill, stroke, lw = 1.5, a = 1) { G.save(); G.globalAlpha = a; rrPath(x, y, w, h, r); if (fill) { G.fillStyle = fill; G.fill(); } if (stroke) { G.strokeStyle = stroke; G.lineWidth = lw; G.stroke(); } G.restore(); }
/** a demonstration's own window on the paper (nothing sits straight on the grid) */
function demoWindow(x, y, w, h, a = 1, o = {}) {
  if (a <= 0.003) return;
  const r = o.r || 14;
  /* paper windows sit on a very soft shadow, so the page reads in layers */
  if (TH && !o.plain) { G.save(); G.globalAlpha = a; G.shadowColor = 'rgba(30,32,40,0.075)'; G.shadowBlur = 26; G.shadowOffsetY = 9; rrPath(x, y, w, h, r); G.fillStyle = o.fill || C.panel; G.fill(); G.restore(); }
  rr(x, y, w, h, r, o.fill || C.panel, inkA(0.12), 1.5, a);
  if (a >= 0.999 || o.plain) return;
  /* on the way in: a soft reflection passes once across the window, and its border traces itself in */
  const p = E.io3(a), bx = x - w * 0.3 + w * 1.6 * p, g = G.createLinearGradient(bx - 140, y, bx + 140, y + Math.min(h, 400) * 0.35);
  const hi = TH ? 'rgba(120,138,168,0.10)' : 'rgba(255,255,255,0.075)';
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, hi); g.addColorStop(1, 'rgba(255,255,255,0)');
  G.save(); rrPath(x, y, w, h, r); G.clip(); G.globalAlpha = Math.sin(p * Math.PI); G.fillStyle = g; G.fillRect(x, y, w, h); G.restore();
  const per = 2 * (w + h), L = per * p, col = typeof acc === 'function' ? acc() : C.ink;
  G.save(); G.globalAlpha = 0.75 * (1 - p); G.strokeStyle = col; G.lineWidth = 2; G.setLineDash([L, per]); rrPath(x, y, w, h, r); G.stroke(); G.restore();
}
