/* ============================================================================================
   idea sheets: every idea without a full slide of its own gets a panel, usually three to a slide,
   each with its own small animated drawing. Sheets are written after the main slides, and
   13-sort.js moves each sheet to the end of its chapter.
   A panel runs on its own clock: its draw() gets lt, seconds since the panel appeared, and loops.
   Same rules as the rest of the deck: the mouse's shape never appears (a generic key plan at most),
   parts are drawn close up and in detail, and every number has a source or is tagged derived.
   ============================================================================================ */
const IDEA = { x: LM, y: 236, h: 640, gap: 24, dh: 350 };
/** small evidence tags in a row; returns the width used */
function ideaTags(x, y, kinds, a, A) {
  let xx = x;
  for (const k of kinds) {
    const st = { measured: 'fill', datasheet: 'fill', study: 'fill' }[k] ? 'fill' : k === 'proposal' ? 'dash' : 'line', col = k === 'proposal' ? A : C.ink;
    G.save(); G.globalAlpha = a;
    if (st === 'fill') { G.fillStyle = col; G.fillRect(xx, y - 11, 11, 11); }
    else { G.strokeStyle = col; G.lineWidth = 1.8; G.setLineDash(st === 'dash' ? [2.5, 2.5] : []); G.strokeRect(xx + 1, y - 10, 9, 9); }
    G.restore();
    text(k, xx + 17, y, { size: 13, weight: 800, color: col, alpha: a });
    xx += 17 + tw(k, { size: 13, weight: 800 }) + 16;
  }
  return xx - x;
}
/** one panel; i = column, n = panels on the sheet. o = { n, title, body, ev, draw(lt, x, y, w, h, A, a), note, t0, dh } */
function ideaPanel(t, i, n, o) {
  const pw = (W - 2 * IDEA.x - (n - 1) * IDEA.gap) / n, x = IDEA.x + i * (pw + IDEA.gap), y = IDEA.y, h = IDEA.h;
  const t0 = o.t0 != null ? o.t0 : 0.4 + i * 0.7, a = ep(t, t0, t0 + 0.5), A = o.color || acc();
  if (a <= 0.003) return;
  G.save(); G.translate(0, (1 - E.out3(a)) * 18);
  demoWindow(x, y, pw, h, a);
  const dx = x + 16, dy = y + 16, dw = pw - 32, dh = o.dh || IDEA.dh;
  G.save(); G.globalAlpha = a; rrPath(dx, dy, dw, dh, 10); G.fillStyle = inkA(0.035); G.fill(); G.restore();
  G.save(); rrPath(dx, dy, dw, dh, 10); G.clip();
  try { o.draw(Math.max(0, t - t0 - 0.15), dx, dy, dw, dh, A, a); } finally { G.restore(); G.globalAlpha = 1; XF.st.length = 0; XF.m = [1, 0, 0, 1, 0, 0]; }
  const ty = dy + dh + 40;
  text(typeof o.n === 'number' ? '#' + o.n : o.n, x + 22, ty, { size: 18, weight: 800, color: A, alpha: a });
  ideaTags(x + 22 + Math.max(64, tw(typeof o.n === 'number' ? '#' + o.n : o.n, { size: 18, weight: 800 }) + 20), ty - 1, o.ev || [], a, A);
  const r = text(o.title, x + 22, ty + 40, { size: 21, weight: 800, color: C.ink, t, t0: t0 + 0.25, cps: 70, maxW: pw - 44, lh: 1.25 });
  text(o.body, x + 22, ty + 40 + r.h + 12, { size: 15, weight: 500, color: C.ink2, t, t0: t0 + 0.6, cps: 150, maxW: pw - 44, lh: 1.45 });
  if (o.note) { const nl = wrap(o.note, { size: 12, weight: 600 }, pw - 44).length; text(o.note, x + 22, y + h - 18 - (nl - 1) * 15, { size: 12, weight: 600, color: C.faint, alpha: ep(t, t0 + 1.0, t0 + 1.4), maxW: pw - 44, lh: 1.25 }); }
  G.restore();
}
/** a slide of idea panels. o = { id, ch, theme, title, eyebrow, panels: [...], src, captions, foot, sfx, sfxLoop } */
function ideaSheet(o) {
  const n = o.panels.length, t0s = o.panels.map((p, i) => p.t0 != null ? p.t0 : 0.4 + i * 0.7);
  return S({
    id: o.id, ch: o.ch, theme: o.theme || 'night', title: o.title, settle: o.settle || 10, sheet: true,
    ideas: o.panels.map(p => p.n), src: o.src || [],
    sfx: t0s.map(t0 => [t0 + 0.05, 'tick']).concat(o.sfx || []), sfxLoop: o.sfxLoop,
    draw: t => {
      header(t, o.title, o.eyebrow ? { eyebrow: o.eyebrow } : {});
      o.panels.forEach((p, i) => ideaPanel(t, i, n, p));
      if (o.captions) captions(t, o.captions, { y: 984 });
      if (o.foot) source(t, o.foot, { y: 1058, t0: 2 });
    }
  });
}
/* ---------- small helpers for panel drawings ---------- */
/** 0 → 1 → 0 over a period, eased */
const pingpong = (lt, per, e = E.io3) => { const c = ((lt % per) + per) % per / per; return e(c < 0.5 ? c * 2 : 2 - c * 2); };
/** a label inside a drawing, small and quiet */
function dLabel(s, x, y, o = {}) { return text(s, x, y, Object.assign({ size: 13, weight: 700, color: C.mute }, o)); }
/** a soft warm glow, for heat, light or a highlight */
function warm(x, y, r, col, a) { if (a <= 0.003) return; const g = G.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); G.fillStyle = g; G.beginPath(); G.arc(x, y, r, 0, TAU); G.fill(); }
/** a tiny chart frame inside a panel: returns {X, Y} for value → stage mapping */
function miniAxes(x, y, w, h, o) {
  const X = v => x + w * (v - o.xr[0]) / (o.xr[1] - o.xr[0]), Y = v => y + h - h * (v - o.yr[0]) / (o.yr[1] - o.yr[0]), a = o.alpha == null ? 1 : o.alpha;
  line(x, y + h, x + w, y + h, { color: C.faint, w: 1.2, alpha: a });
  for (const v of o.xticks || []) { line(X(v), y + h, X(v), y + h + 5, { color: C.faint, w: 1.2, alpha: a }); dLabel(o.xfmt ? o.xfmt(v) : String(v), X(v), y + h + 20, { align: 'center', size: 11, alpha: a }); }
  for (const v of o.yticks || []) { line(x, Y(v), x + w, Y(v), { color: C.hair, w: 1, alpha: a }); dLabel(o.yfmt ? o.yfmt(v) : String(v), x - 8, Y(v) + 4, { align: 'right', size: 11, alpha: a }); }
  return { X, Y };
}
/* ---------- shared part painters for sheets (mm, y down, board top at y = 0) ---------- */
/* one SMD part in section, sitting on a board whose top is y = 0 (mm); kind: qfn, res, cap, xtal, conn */
function smdMM(x, kind, o = {}) {
  const D = { qfn: [7, 0.85], res: [1.0, 0.35], cap: [1.6, 0.8], xtal: [2.0, 0.6], conn: [6.5, 3.2] }[kind], w = D[0], h = D[1], up = o.under ? -1 : 1, y0 = o.under ? 1.2 : 0;
  const body = kind === 'qfn' ? MT.epoxy : kind === 'xtal' ? MT.steel : kind === 'conn' ? MT.white : kind === 'cap' ? { g: ['#d8c39a', '#a88b5c'] } : MT.black;
  const top = y0 - up * h, yA = Math.min(y0, top), hh = Math.abs(h);
  solid(() => { G.beginPath(); G.rect(x - w / 2, yA, w, hh); }, body, [x - w / 2, yA, w, hh], { lw: 0.7 });
  /* end caps or pads, and a fillet of solder at each */
  const caps = kind === 'qfn' ? [[-w / 2, 0.5], [w / 2 - 0.5, 0.5]] : kind === 'conn' ? [[-w / 2 - 0.6, 0.9], [w / 2 - 0.3, 0.9]] : [[-w / 2, w * 0.22], [w / 2 - w * 0.22, w * 0.22]];
  for (const [cx, cw] of caps) {
    solid(() => { G.beginPath(); G.rect(x + cx, y0 - up * 0.12 - (up > 0 ? 0 : 0), cw, up * 0.12); }, MT.tin, [x + cx, Math.min(y0, y0 - up * 0.12), cw, 0.12], { lw: 0.5 });
    const fx = cx < 0 ? x + cx : x + cx + cw, dir = cx < 0 ? -1 : 1;
    G.beginPath(); G.moveTo(fx, y0); G.lineTo(fx + dir * 0.35, y0); G.lineTo(fx, y0 - up * Math.min(hh, 0.45)); G.closePath(); G.fillStyle = grad(MT.tin, fx - 0.4, y0 - 0.4, fx + 0.4, y0); G.fill();
  }
  return { joints: caps.map(([cx, cw]) => SP(x + cx + cw / 2, y0)) };
}
/* a stretch of board with parts on top, and optionally underneath */
function boardStripMM(o) {
  pcbSec(-30, 30, 0, 1.2, {});
  const out = { top: [], under: [] };
  for (const [x, k] of o.top) out.top.push(...smdMM(x, k).joints);
  for (const [x, k] of (o.under || [])) out.under.push(...smdMM(x, k, { under: true }).joints);
  return out;
}
