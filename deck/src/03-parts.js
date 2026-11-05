/* ============================================================================================
   parts: close-up technical drawings of single components, in millimetres (y down). The mouse's own shape
   appears only as the key plan (section 18): the Sora V2 top view, simplified, used to locate a section.
   Where a drawing has to include part of the shell or a trigger, the curvature is soft and
   deliberately generic, and the piece ends in a break line.
   Each part has a painter in mm (…MM) and a stage wrapper (part()) that places it at (x, y) with
   s pixels per millimetre. Painters report named points in stage pixels for callouts.
   Drawing conventions: cut material is hatched, fasteners and shafts are not, anything that
   continues past the drawing ends in a break line.
   ============================================================================================ */
const TAU = Math.PI * 2;

/* ---------- a transform we can read back, so parts can report stage points ---------- */
const XF = { m: [1, 0, 0, 1, 0, 0], st: [] };
let PA = 1;                                                     /* alpha of the part being drawn */
function xsave() { G.save(); XF.st.push(XF.m.slice()); }
function xrest() { G.restore(); XF.m = XF.st.pop() || [1, 0, 0, 1, 0, 0]; }
function xmove(x, y) { G.translate(x, y); const m = XF.m; m[4] += m[0] * x + m[2] * y; m[5] += m[1] * x + m[3] * y; }
function xscale(s) { G.scale(s, s); const m = XF.m; m[0] *= s; m[1] *= s; m[2] *= s; m[3] *= s; }
function xturn(a) { G.rotate(a); const m = XF.m, c = Math.cos(a), s = Math.sin(a), a0 = m[0], b0 = m[1], c0 = m[2], d0 = m[3]; m[0] = a0 * c + c0 * s; m[1] = b0 * c + d0 * s; m[2] = c0 * c - a0 * s; m[3] = d0 * c - b0 * s; }
function xabout(px, py, a) { xmove(px, py); xturn(a); xmove(-px, -py); }
function SP(x, y) { const m = XF.m; return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]; }
function SPm(M, x, y) { return [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]]; }
function SV(x, y) { const m = XF.m, vx = m[0] * x + m[2] * y, vy = m[1] * x + m[3] * y, l = Math.hypot(vx, vy) || 1; return [vx / l, vy / l]; }
function mmpx() { const m = XF.m; return 1 / Math.hypot(m[0], m[1]); }
const lw = px => px * mmpx();
function ga(a) { G.globalAlpha = PA * a; }
function part(x, y, s, fn, o = {}) {
  if (!XF.st.length) XF.m = [1, 0, 0, 1, 0, 0];
  const a = o.alpha == null ? 1 : o.alpha; if (a <= 0.003) return {};
  const pa = PA; xsave(); PA = pa * a; G.globalAlpha = PA; xmove(x, y); if (o.rot) xturn(o.rot); xscale(s);
  let r; try { r = fn(); } finally { xrest(); PA = pa; G.globalAlpha = 1; }
  return r || {};
}
function rotAbout(p, c, a) { const dx = p[0] - c[0], dy = p[1] - c[1], cs = Math.cos(a), sn = Math.sin(a); return [c[0] + dx * cs - dy * sn, c[1] + dx * sn + dy * cs]; }

/* ---------- materials ---------- */
const MT = {
  shell: { g: ['#3a3b41', '#25262b'], dark: 1 }, black: { g: ['#313237', '#1e1f23'], dark: 1 },
  pom: { g: ['#f8f6f0', '#dedcd7'] }, ptfe: { g: ['#ffffff', '#ece9e1'] }, glass: { g: ['#eef6f9', '#c4d6de'] },
  steel: { g: ['#eef1f4', '#9aa2ab', '#d4d9df'] }, spring: { g: ['#dde1e6', '#8d959e'] }, brass: { g: ['#f4dc96', '#b48b2c', '#e9c870'] },
  copper: { g: ['#f3bb88', '#b56c33'] }, silver: { g: ['#ffffff', '#b1b7bf'] },
  tin: { g: ['#f4f5f7', '#a2a8b0', '#e3e6ea'] }, fr4: { g: ['#55613c', '#424d2d'], dark: 1 }, mask: { g: ['#222327', '#141518'], dark: 1 },
  lens: { g: ['rgba(205,235,250,0.55)', 'rgba(150,200,228,0.36)'] }, rubber: { g: ['#303135', '#232427'], dark: 1 },
  foam: { g: ['#3b3c42', '#2d2e33'], dark: 1 }, cloth: { g: ['#5b5e65', '#43464c'], dark: 1 }, white: { g: ['#fdfcf9', '#dbdad5'] },
  epoxy: { g: ['#2c2d32', '#17181b'], dark: 1 }
};
function grad(mt, x0, y0, x1, y1) { const g = G.createLinearGradient(x0, y0, x1, y1), n = mt.g.length; mt.g.forEach((c, i) => g.addColorStop(n > 1 ? i / (n - 1) : 0, c)); return g; }
function edgeCol(mt, a) {
  if (mt && !mt.dark) return `rgba(16,17,20,${a == null ? 0.72 : a})`;
  return TH ? `rgba(10,10,12,${a == null ? 0.88 : a})` : `rgba(236,235,231,${a == null ? 0.4 : a})`;
}
/** fill a path with a material, optionally hatch it (cut material), then outline it */
function solid(path, mt, box, o = {}) {
  const [x, y, w, h] = box;
  path(); G.fillStyle = o.fill || (o.horiz ? grad(mt, x, y, x + w, y) : grad(mt, x, y, x, y + h)); G.fill();
  if (o.hatch) { G.save(); path(); G.clip(); hatchBox(box, o.hatch === true ? {} : o.hatch, mt); G.restore(); }
  if (o.edge !== false) { path(); G.strokeStyle = o.ec || edgeCol(mt, o.ea); G.lineWidth = lw(o.lw || 1.15); G.lineJoin = 'round'; G.stroke(); }
}
/** 45-degree section lines, anchored to the page so neighbouring pieces of one material line up */
function hatchBox(box, h, mt) {
  const [x, y, w, hh] = box, sp = (h.sp || 7) * mmpx(), dir = h.dir || 1, pad = Math.abs(hh) + 1;
  G.strokeStyle = h.color || (mt && mt.dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.24)'); G.lineWidth = lw(h.w || 1);
  G.beginPath();
  const n0 = Math.floor((x - pad) / sp) - 1, n1 = Math.ceil((x + w + pad) / sp) + 1;
  for (let i = n0; i <= n1; i++) { const x0 = i * sp; if (dir > 0) { G.moveTo(x0, y + hh + 1); G.lineTo(x0 + hh + 2, y - 1); } else { G.moveTo(x0, y - 1); G.lineTo(x0 + hh + 2, y + hh + 1); } }
  G.stroke();
}
/** a break line: the S-curve that says the part continues */
function brk(x, y0, y1, amp) { const h = y1 - y0; amp = amp == null ? Math.min(0.9, Math.abs(h) * 0.24) : amp; G.bezierCurveTo(x + amp, y0 + h * 0.32, x - amp, y0 + h * 0.68, x, y1); }
function glow(x, y, r, col, a) { const g = G.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); G.fillStyle = g; G.beginPath(); G.arc(x, y, r, 0, TAU); G.fill(); }
function mmLine(pts, col, px, o = {}) { G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); if (o.close) G.closePath(); G.strokeStyle = col; G.lineWidth = lw(px); G.setLineDash(o.dash ? o.dash.map(v => v * mmpx()) : []); G.lineCap = o.cap || 'round'; G.lineJoin = 'round'; G.stroke(); G.setLineDash([]); }
function pathRR(x, y, w, h, r) { r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2); G.beginPath(); G.moveTo(x + r, y); G.arcTo(x + w, y, x + w, y + h, r); G.arcTo(x + w, y + h, x, y + h, r); G.arcTo(x, y + h, x, y, r); G.arcTo(x, y, x + w, y, r); G.closePath(); }

/* ---------- a circuit board in section: mask, copper, glass-fibre core, plated holes full of solder ---------- */
function pcbSec(x0, x1, y0, th, o = {}) {
  const y1 = y0 + th, bl = o.brk || [1, 1], holes = o.holes || [];
  const path = () => { G.beginPath(); G.moveTo(x0, y0); G.lineTo(x1, y0); if (bl[1]) brk(x1, y0, y1, 0.3); else G.lineTo(x1, y1); G.lineTo(x0, y1); if (bl[0]) brk(x0, y1, y0, 0.3); else G.lineTo(x0, y0); G.closePath(); };
  path(); G.fillStyle = grad(MT.fr4, x0, y0, x0, y1); G.fill();
  G.save(); path(); G.clip();
  G.strokeStyle = 'rgba(214,226,170,0.16)'; G.lineWidth = lw(1); G.beginPath();
  for (let yy = y0 + th * 0.2; yy < y1 - th * 0.12; yy += th / 7) { G.moveTo(x0 - 1, yy); G.lineTo(x1 + 1, yy); } G.stroke();
  G.fillStyle = '#c98a4e'; G.fillRect(x0 - 1, y0 + th * 0.05, x1 - x0 + 2, th * 0.05); G.fillRect(x0 - 1, y1 - th * 0.1, x1 - x0 + 2, th * 0.05);
  G.fillStyle = o.mask || '#1c3a29'; G.fillRect(x0 - 1, y0 - 0.01, x1 - x0 + 2, th * 0.06); G.fillRect(x0 - 1, y1 - th * 0.05, x1 - x0 + 2, th * 0.06);
  for (const hx of holes) {
    G.fillStyle = grad(MT.tin, hx - 0.42, 0, hx + 0.42, 0); G.fillRect(hx - 0.42, y0 - 0.02, 0.84, th + 0.04);
    G.fillStyle = '#c98a4e'; G.fillRect(hx - 0.48, y0, 0.06, th); G.fillRect(hx + 0.42, y0, 0.06, th);
  }
  G.restore();
  path(); G.strokeStyle = edgeCol(MT.fr4); G.lineWidth = lw(1.1); G.stroke();
  for (const hx of holes) { G.fillStyle = '#c98a4e'; G.fillRect(hx - 0.85, y0 - 0.05, 1.7, 0.05); G.fillRect(hx - 0.85, y1, 1.7, 0.05); }
}
function solderFillet(x, yb, dir) { /* dir +1: hangs below the board, -1: sits on top */
  const h = 0.5 * dir;
  solid(() => { G.beginPath(); G.moveTo(x - 0.85, yb); G.quadraticCurveTo(x - 0.32, yb + h * 0.15, x - 0.27, yb + h); G.lineTo(x + 0.27, yb + h); G.quadraticCurveTo(x + 0.32, yb + h * 0.15, x + 0.85, yb); G.closePath(); }, MT.tin, [x - 0.85, Math.min(yb, yb + h), 1.7, Math.abs(h)], { horiz: true, lw: 0.8 });
}

/* =================================== 1. snap-action switch ===================================
   side elevation, origin at the bottom-left of the body (12.8 x 6.5 mm). o.clear shows the cover clear,
   so the leaf spring, its tongue and the three contacts are visible. press 0..1 of 0.8 mm travel; the
   moving contact snaps from NC (top) to NO (bottom) at 0.5 mm unless o.state forces it. */
const SWG = { L: 12.8, H: 6.5, TT: 0.8, OP: 0.5, pins: [1.4, 6.4, 11.4], px: 5.6, top: -7.35, base: -1.7 };
function swMM(o = {}) {
  const Q = SWG, d = clamp(o.press || 0) * Q.TT, no = o.state ? o.state === 'no' : d >= Q.OP, A = o.accent || acc(), clear = !!o.clear;
  const plm = o.plunger || MT.pom, out = {};
  if (o.board) pcbSec(o.boardX ? o.boardX[0] : -2.2, o.boardX ? o.boardX[1] : 15.0, 0.2, 1.2, { holes: Q.pins });
  for (const x of Q.pins) solid(() => { G.beginPath(); G.moveTo(x - 0.5, -0.3); G.lineTo(x + 0.5, -0.3); G.lineTo(x + 0.5, 0.45); G.lineTo(x + 0.26, 0.68); G.lineTo(x + 0.26, 3.2); G.lineTo(x + 0.1, 3.5); G.lineTo(x - 0.1, 3.5); G.lineTo(x - 0.26, 3.2); G.lineTo(x - 0.26, 0.68); G.lineTo(x - 0.5, 0.45); G.closePath(); }, MT.tin, [x - 0.5, 0, 1, 3.5], { horiz: true, lw: 0.85 });
  if (o.board) for (const x of Q.pins) { solderFillet(x, 1.4, 1); solderFillet(x, 0.2, -1); }
  const base = () => { G.beginPath(); G.moveTo(0, Q.base); G.lineTo(12.8, Q.base); G.lineTo(12.8, -0.3); G.quadraticCurveTo(12.8, 0, 12.5, 0); G.lineTo(0.3, 0); G.quadraticCurveTo(0, 0, 0, -0.3); G.closePath(); };
  for (const fx of [0.45, 11.55]) solid(() => { G.beginPath(); G.rect(fx, -0.1, 0.8, 0.3); }, MT.black, [fx, 0, 0.8, 0.2], { lw: 0.7 });
  solid(base, MT.black, [0, Q.base, 12.8, -Q.base], {});
  const pt = Q.top + d, x0 = Q.px - 0.75, x1 = Q.px + 0.75;
  const Ax = 1.85, Ay = -4.08, Bx = Q.px, By = -4.06 + d, Fx = 10.3, Fy = no ? -3.185 : -4.015;
  const u = (Bx - Ax) / (Fx - Ax), Cx = (Bx - (1 - u) * (1 - u) * Ax - u * u * Fx) / (2 * u * (1 - u)), Cy = (By - (1 - u) * (1 - u) * Ay - u * u * Fy) / (2 * u * (1 - u));
  const qb = s => [(1 - s) * (1 - s) * Ax + 2 * s * (1 - s) * Cx + s * s * Fx, (1 - s) * (1 - s) * Ay + 2 * s * (1 - s) * Cy + s * s * Fy];
  if (clear) {
    /* COM support: carries the leaf at the top and the tongue in a notch below */
    solid(() => { G.beginPath(); G.moveTo(1.15, Q.base); G.lineTo(1.15, -3.78); G.lineTo(0.72, -3.78); G.lineTo(0.72, -4.02); G.lineTo(2.4, -4.02); G.lineTo(2.4, -3.78); G.lineTo(1.65, -3.78); G.lineTo(1.65, -3.12); G.lineTo(2.32, -3.12); G.lineTo(2.32, -2.97); G.lineTo(2.06, -2.88); G.lineTo(2.32, -2.79); G.lineTo(2.32, -2.64); G.lineTo(1.65, -2.64); G.lineTo(1.65, Q.base); G.closePath(); }, MT.copper, [0.72, -4.02, 1.7, 2.3], { horiz: true, lw: 0.8 });
    /* NO contact on a pad, wired to the middle leg */
    solid(() => { G.beginPath(); G.moveTo(6.15, Q.base); G.lineTo(6.15, -1.92); G.lineTo(9.55, -1.92); G.lineTo(9.55, -2.6); G.lineTo(11.05, -2.6); G.lineTo(11.05, Q.base); G.closePath(); }, MT.copper, [6.15, -2.6, 4.9, 0.9], { lw: 0.8 });
    /* NC contact on a strip that runs down the right wall to the right leg */
    solid(() => { G.beginPath(); G.moveTo(9.25, -4.9); G.lineTo(12.08, -4.9); G.lineTo(12.08, Q.base); G.lineTo(11.76, Q.base); G.lineTo(11.76, -4.6); G.lineTo(9.25, -4.6); G.closePath(); }, MT.copper, [9.25, -4.9, 2.83, 3.2], { lw: 0.8 });
    const dome = (cx, cy, up) => { G.beginPath(); G.ellipse(cx, cy, 0.34, 0.26, 0, up ? Math.PI : 0, up ? TAU : Math.PI); G.closePath(); };
    solid(() => dome(10.3, -4.6, false), MT.silver, [9.96, -4.6, 0.68, 0.26], { lw: 0.7 });
    solid(() => dome(10.3, -2.6, true), MT.silver, [9.96, -2.86, 0.68, 0.26], { lw: 0.7 });
    /* the tongue: a compressed strip from the notch to the leaf; it pushes the leaf end over centre */
    const T = qb(0.8), mx = (2.06 + T[0]) / 2, my = (-2.88 + T[1]) / 2 + (no ? -0.36 : 0.46);
    G.beginPath(); G.moveTo(2.06, -2.88); G.quadraticCurveTo(mx, my, T[0], T[1]); G.strokeStyle = '#b88a3c'; G.lineWidth = 0.1; G.lineCap = 'round'; G.stroke();
    /* the leaf */
    G.beginPath(); G.moveTo(Ax, Ay); G.quadraticCurveTo(Cx, Cy, Fx, Fy); G.strokeStyle = '#cf9f48'; G.lineWidth = 0.13; G.lineCap = 'butt'; G.stroke();
    G.save(); G.translate(0, -0.035); G.beginPath(); G.moveTo(Ax + 0.2, Ay); G.quadraticCurveTo(Cx, Cy, Fx - 0.25, Fy); G.strokeStyle = 'rgba(255,236,190,0.75)'; G.lineWidth = 0.035; G.stroke(); G.restore();
    G.beginPath(); G.ellipse(1.42, -4.1, 0.34, 0.22, 0, Math.PI, TAU); G.closePath(); G.fillStyle = grad(MT.silver, 1.1, -4.3, 1.1, -4.1); G.fill(); G.strokeStyle = edgeCol(MT.silver); G.lineWidth = lw(0.7); G.stroke();
    /* the moving contact, a rivet through the leaf end */
    solid(() => { G.beginPath(); G.ellipse(Fx, Fy - 0.065, 0.32, 0.26, 0, Math.PI, TAU); G.closePath(); }, MT.silver, [Fx - 0.32, Fy - 0.33, 0.64, 0.26], { lw: 0.7 });
    solid(() => { G.beginPath(); G.ellipse(Fx, Fy + 0.065, 0.32, 0.26, 0, 0, Math.PI); G.closePath(); }, MT.silver, [Fx - 0.32, Fy + 0.065, 0.64, 0.26], { lw: 0.7 });
    const cp = no ? [10.3, -2.86] : [10.3, -4.34];
    if (o.glow !== false) glow(cp[0], cp[1], 0.95, A, 0.6);
    out.nc = SP(10.3, -4.75); out.no = SP(10.3, -2.45); out.com = SP(1.4, -3.3); out.leaf = SP(7.6, qb(0.68)[1]); out.tongue = SP(mx, my); out.contact = SP(cp[0], cp[1]);
    /* plunger stem and its captive flange */
    solid(() => { G.beginPath(); G.moveTo(x0 + 0.12, -6.5); G.lineTo(x1 - 0.12, -6.5); G.lineTo(x1 - 0.12, By - 0.32); G.quadraticCurveTo(x1 - 0.12, By - 0.065, Q.px, By - 0.065); G.quadraticCurveTo(x0 + 0.12, By - 0.065, x0 + 0.12, By - 0.32); G.closePath(); }, plm, [x0, -6.5, 1.5, 2.4], { horiz: true, lw: 0.8 });
    solid(() => { G.beginPath(); G.rect(x0 - 0.42, -6.04 + d, 2.34, 0.34); }, plm, [x0 - 0.42, -6.04 + d, 2.34, 0.34], { lw: 0.8 });
  }
  const cover = () => { G.beginPath(); G.moveTo(0, Q.base); G.lineTo(0, -6.0); G.quadraticCurveTo(0, -6.5, 0.5, -6.5); G.lineTo(12.3, -6.5); G.quadraticCurveTo(12.8, -6.5, 12.8, -6.0); G.lineTo(12.8, Q.base); G.closePath(); };
  if (clear) {
    cover(); G.fillStyle = TH ? 'rgba(40,60,80,0.05)' : 'rgba(200,215,232,0.06)'; G.fill();
    G.beginPath(); G.moveTo(0.45, Q.base); G.lineTo(0.45, -5.7); G.quadraticCurveTo(0.45, -6.05, 0.8, -6.05); G.lineTo(4.62, -6.05); G.moveTo(6.58, -6.05); G.lineTo(12.0, -6.05); G.quadraticCurveTo(12.35, -6.05, 12.35, -5.7); G.lineTo(12.35, Q.base);
    G.strokeStyle = inkA(0.22); G.lineWidth = lw(1); G.stroke();
    for (const gx of [4.62, 6.38]) { G.beginPath(); G.rect(gx, -6.05, 0.2, 0.95); G.fillStyle = inkA(0.06); G.fill(); G.strokeStyle = inkA(0.2); G.lineWidth = lw(0.8); G.stroke(); }
    cover(); G.strokeStyle = inkA(0.62); G.lineWidth = lw(1.25); G.stroke();
    const sh = G.createLinearGradient(0, -6.5, 6, 0); sh.addColorStop(0, 'rgba(255,255,255,0.10)'); sh.addColorStop(0.35, 'rgba(255,255,255,0)'); cover(); G.fillStyle = sh; G.fill();
  } else {
    solid(cover, MT.black, [0, -6.5, 12.8, 4.8], {});
    const sh = G.createLinearGradient(0, 0, 12.8, 0); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(0.28, 'rgba(255,255,255,0.06)'); sh.addColorStop(0.4, 'rgba(255,255,255,0)'); cover(); G.fillStyle = sh; G.fill();
    for (const [ex, ey] of [[2.4, -4.2], [10.4, -4.2]]) { G.beginPath(); G.arc(ex, ey, 0.55, 0, TAU); G.fillStyle = 'rgba(0,0,0,0.16)'; G.fill(); G.strokeStyle = 'rgba(255,255,255,0.07)'; G.lineWidth = lw(1); G.stroke(); }
    G.beginPath(); G.moveTo(0.55, -6.42); G.lineTo(12.25, -6.42); G.strokeStyle = 'rgba(255,255,255,0.16)'; G.lineWidth = lw(1); G.stroke();
    G.fillStyle = '#0a0a0b'; G.fillRect(x0 - 0.05, -6.52, 1.6, 0.1);
  }
  G.beginPath(); G.moveTo(0, Q.base); G.lineTo(12.8, Q.base); G.strokeStyle = 'rgba(0,0,0,0.55)'; G.lineWidth = lw(1.2); G.stroke();
  solid(() => { G.beginPath(); G.moveTo(x0, -6.5); G.lineTo(x0, pt + 0.38); G.quadraticCurveTo(x0, pt, x0 + 0.38, pt); G.lineTo(x1 - 0.38, pt); G.quadraticCurveTo(x1, pt, x1, pt + 0.38); G.lineTo(x1, -6.5); G.closePath(); }, plm, [x0, pt, 1.5, 1], { horiz: true, lw: 1 });
  out.plunger = SP(Q.px, pt); out.body = SP(6.4, -3.6); out.top = SP(6.4, -6.5); out.right = SP(12.8, -3.6); out.left = SP(0, -3.6); out.legs = Q.pins.map(x => SP(x, 3.5)); out.isNO = no; out.d = d;
  return out;
}
function drawSwitch(x, y, s, o = {}) { return part(x, y, s, () => swMM(o), o); }

/* =================================== 2. the click mechanism, in section ===================================
   a cut through one button, as Theseus builds it (K1, 2026-11-05, from Brock's photos of shipping top shells and his ideas #4,
   #18, #49, #50): the shell behind the rear cutout with its screw boss and brass insert; the tensioner, which is the trigger's
   own arm in the trigger's material (no steel plate): a block clamped to the boss by one screw from below (#49), and a bridge,
   an arch that thins to its crown (#50), so the trigger turns about the crown; the bridge runs square into the trigger's rear
   riser, with no fillet; the trigger with its post; one flat board; on it the switch: an upright D2F-class switch, or (o.tilt
   1) the GT01 on its 20° bottom housing (o.gt01 draws it), its axis on the trigger's arc. The arc is 20° at the plunger, the
   GT01's own angle (clk_wedge). The surface is a soft, generic crown, not the shape. Origin near the rear cutout, front right. */
const CKG = { rc: [-1.4, 0.2], foot: [30, 11.63], post: [29, 31], tPost: [4, 8], boss: [-13.2, -6.8], plateY: 0.6, gap: [-1.1, -0.1], rise: 0.8, gtApex: [4.376, 7.845] };
function surfY(x) { return -2.6 + 0.085 * x + 0.0024 * x * x; }
function clickGeo(o = {}) {
  const K = CKG, RC = K.rc, F0 = K.foot;
  const rad = Math.atan2(F0[1] - RC[1], F0[0] - RC[0]), R = Math.hypot(F0[0] - RC[0], F0[1] - RC[1]);
  const tilt = (o.tilt || 0) * rad, mis = rad - tilt, d = clamp(o.press || 0) * SWG.TT;
  return { RC, F0, rad, R, tilt, mis, d, phi: d / (R * Math.cos(mis)) };
}
function clickMM(o = {}) {
  const K = CKG, A = o.accent || acc(), g = clickGeo(o), { RC, F0, R, tilt, phi } = g;
  const x0 = o.x0 == null ? -16 : o.x0, x1 = o.x1 == null ? 44 : o.x1, out = { geo: g }, kT = clamp(o.tilt || 0);
  const ub = x => surfY(x) + 1.2;
  /* one flat board: the GT01's cap stands 7.85 mm above its top (traced), so the board sits there and never tilts */
  const yB = F0[1] + K.gtApex[1];
  pcbSec(F0[0] - 13, F0[0] + 11, yB, 1.2, { brk: [1, 1] });
  /* the upright switch: its plunger under the post, standing 0.5 mm proud on its feet; it gives way to the GT01 */
  if (kT < 0.999) { xsave(); ga(1 - kT); xmove(F0[0] - SWG.px, F0[1] - SWG.top); out.sw = swMM({ press: o.press || 0, clear: o.clear, accent: A, glow: o.glow }); xrest(); }
  if (o.ghost > 0) { xsave(); ga(o.ghost * 0.6); xmove(F0[0] - SWG.px, F0[1] - SWG.top); G.setLineDash([lw(7), lw(5)]); G.beginPath(); G.rect(0, -6.5, 12.8, 6.5); G.rect(SWG.px - 0.75, SWG.top, 1.5, 0.85); G.strokeStyle = inkA(0.7); G.lineWidth = lw(1.3); G.stroke(); G.setLineDash([]); xrest(); }
  /* the GT01, front to the right (mirrored from its own drawing), its cap's apex at the post */
  if (kT > 0.001 && o.gt01) { xsave(); ga(kT); xmove(F0[0] - K.gtApex[0], yB); G.scale(-1, 1); XF.m[0] *= -1; XF.m[1] *= -1; o.gt01(clamp((o.press || 0) * SWG.TT / 0.35)); xrest(); }
  { xsave(); xmove(F0[0], F0[1]); xturn(tilt); out.axis = [SP(0, -9), SP(0, 1.6 + 7.35)]; out.axisDir = SV(0, 1); xrest(); }
  /* the shell behind the cutout, its boss down to the block, the brass insert */
  const sx1 = K.gap[0], B = K.boss;
  const shell = () => {
    G.beginPath(); G.moveTo(x0, surfY(x0)); for (let x = x0; x < sx1; x += 0.5) G.lineTo(x, surfY(x)); G.lineTo(sx1, surfY(sx1)); G.lineTo(sx1, ub(sx1));
    for (let x = sx1; x > B[1] + 0.7; x -= 0.5) G.lineTo(x, ub(x)); G.quadraticCurveTo(B[1], ub(B[1]), B[1], ub(B[1]) + 0.7); G.lineTo(B[1], K.plateY); G.lineTo(B[0], K.plateY); G.lineTo(B[0], ub(B[0]) + 0.7); G.quadraticCurveTo(B[0], ub(B[0]), B[0] - 0.7, ub(B[0] - 0.7));
    for (let x = B[0] - 0.7; x > x0; x -= 0.5) G.lineTo(x, ub(x));
    G.lineTo(x0, ub(x0)); brk(x0, ub(x0), surfY(x0), 0.45); G.closePath();
  };
  solid(shell, MT.shell, [x0, -4.4, sx1 - x0, 5.4], { hatch: true });
  const bx = (B[0] + B[1]) / 2;
  for (const side of [-1, 1]) {
    const xi = bx + side * 1.6, xo = bx + side * 1.05;
    solid(() => { G.beginPath(); G.moveTo(xo, -1.9); for (let k = 0; k <= 12; k++) { const yy = -1.9 + k * 0.2; G.lineTo(k % 2 ? xi + side * 0.12 : xi, yy); } G.lineTo(xo, K.plateY); G.closePath(); }, MT.brass, [Math.min(xi, xo) - 0.2, -1.9, 0.8, 2.5], { hatch: { dir: -1, sp: 5 }, lw: 0.8 });
  }
  /* the tensioner: the trigger's own arm, 0.8 mm, from the block under the boss to the trigger's riser; between them the
     bridge, an arch rising K.rise to a crown at RC that thins to 0.4 mm there. Clamped flat under the boss, carried round RC
     by the trigger at the riser, a smooth bend between (Hermite on the flat arm, the arch added on top) */
  const xa = K.tPost[0], xb = B[1], yA = 1.0, Pa = rotAbout([xa, yA], RC, phi), Lh = Pa[0] - xb;
  const u = x => clamp((x - xb) / (xa - xb));
  const arch = x => x > xb && x < xa ? -K.rise * Math.sin(Math.PI * u(x)) : 0;
  const cl = x => {
    if (x <= xb) return [x, yA];
    if (x >= xa) return rotAbout([x, yA], RC, phi);
    const s = u(x), m1 = Math.tan(phi) * Lh;
    return [xb + s * Lh, (2 * s ** 3 - 3 * s * s + 1) * yA + (-2 * s ** 3 + 3 * s * s) * Pa[1] + (s ** 3 - s * s) * m1 + arch(x)];
  };
  const th = x => 0.8 - 0.4 * Math.pow(Math.sin(Math.PI * u(x)), 2);
  const top = [], bot = [];
  for (let x = B[0] - 0.4; x <= xa + 0.4001; x += 0.2) {
    const p = cl(x), q = cl(x + 0.05), a = Math.atan2(q[1] - p[1], q[0] - p[0]), h = th(x) / 2, nx = -Math.sin(a), ny = Math.cos(a);
    top.push([p[0] - nx * h, p[1] - ny * h]); bot.push([p[0] + nx * h, p[1] + ny * h]);
  }
  const arm = () => { G.beginPath(); top.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); for (let i = bot.length - 1; i >= 0; i--) G.lineTo(bot[i][0], bot[i][1]); G.closePath(); };
  solid(arm, MT.shell, [B[0], -0.6, 20, 2.2], { hatch: true, lw: 0.9 });
  if (o.bendGlow > 0) { const p = cl(RC[0]); xsave(); ga(o.bendGlow); glow(p[0], p[1], 2.4, A, 0.55); xrest(); }
  /* the one screw from below: the head under the block, the shank up through it into the insert */
  solid(() => { G.beginPath(); G.moveTo(bx - 1.0, 1.4); G.lineTo(bx - 1.0, -1.45); G.lineTo(bx - 0.7, -1.75); G.lineTo(bx + 0.7, -1.75); G.lineTo(bx + 1.0, -1.45); G.lineTo(bx + 1.0, 1.4); G.closePath(); }, MT.steel, [bx - 1, -1.75, 2, 3.2], { horiz: true, lw: 0.9 });
  G.save(); G.beginPath(); G.rect(bx - 1, -1.6, 2, 2.0); G.clip(); G.strokeStyle = 'rgba(40,45,52,0.55)'; G.lineWidth = lw(1); G.beginPath(); for (let yy = -1.6; yy < 0.5; yy += 0.4) { G.moveTo(bx - 1, yy + 0.1); G.lineTo(bx + 1, yy - 0.1); } G.stroke(); G.restore();
  solid(() => { G.beginPath(); G.moveTo(bx - 1.9, 1.4); G.lineTo(bx + 1.9, 1.4); G.lineTo(bx + 1.9, 1.95); G.quadraticCurveTo(bx + 1.85, 2.65, bx + 1.1, 2.7); G.lineTo(bx - 1.1, 2.7); G.quadraticCurveTo(bx - 1.85, 2.65, bx - 1.9, 1.95); G.closePath(); }, MT.steel, [bx - 1.9, 1.4, 3.8, 1.3], { horiz: true, lw: 0.9 });
  out.screw = SP(bx, 2.7); out.boss = SP(B[0], -0.6); out.insert = SP(bx + 1.6, -0.5); out.plate = SP(...cl(RC[0])); out.plateFix = SP(B[1], 1.4); out.crown = SP(...cl(RC[0]));
  /* the trigger, turned by phi about the crown: its skin, the rear riser the bridge runs into (square, no fillet), its post */
  xsave(); xabout(RC[0], RC[1], phi);
  const tx0 = K.gap[1], tx1 = x1, P = K.post, Tp = K.tPost;
  const trig = () => {
    G.beginPath(); G.moveTo(tx0, ub(tx0)); G.lineTo(tx0, surfY(tx0) + 0.12); G.quadraticCurveTo(tx0, surfY(tx0), tx0 + 0.12, surfY(tx0 + 0.12));
    for (let x = tx0 + 0.5; x < tx1; x += 0.5) G.lineTo(x, surfY(x));
    G.lineTo(tx1, surfY(tx1)); brk(tx1, surfY(tx1), ub(tx1), 0.45);
    for (let x = tx1; x > P[1] + 0.7; x -= 0.5) G.lineTo(x, ub(x)); G.quadraticCurveTo(P[1], ub(P[1]), P[1], ub(P[1]) + 0.7); G.lineTo(P[1], F0[1] - 1); G.arc((P[0] + P[1]) / 2, F0[1] - 1, 1, 0, Math.PI); G.lineTo(P[0], ub(P[0]) + 0.7); G.quadraticCurveTo(P[0], ub(P[0]), P[0] - 0.7, ub(P[0] - 0.7));
    for (let x = P[0] - 0.7; x > Tp[1] + 0.7; x -= 0.5) G.lineTo(x, ub(x)); G.quadraticCurveTo(Tp[1], ub(Tp[1]), Tp[1], ub(Tp[1]) + 0.7); G.lineTo(Tp[1], yA + 0.4); G.lineTo(Tp[0], yA + 0.4); G.lineTo(Tp[0], ub(Tp[0]) + 0.7); G.quadraticCurveTo(Tp[0], ub(Tp[0]), Tp[0] - 0.7, ub(Tp[0] - 0.7));
    for (let x = Tp[0] - 0.7; x > tx0; x -= 0.5) G.lineTo(x, ub(x));
    G.lineTo(tx0, ub(tx0)); G.closePath();
  };
  solid(trig, MT.shell, [tx0, -3, tx1 - tx0, 16], { hatch: true });
  { const pts = []; for (let x = tx0 + 0.15; x < tx1 - 0.2; x += 0.5) pts.push([x, surfY(x) + 0.06]); mmLine(pts, 'rgba(255,255,255,0.22)', 1); }
  { const M0 = XF.m.slice(); out.trigTop = x => SPm(M0, x, surfY(x)); }
  out.foot = SP(30, F0[1]); out.post = SP(31, F0[1] - 3); out.tip = SP(tx1, surfY(tx1)); out.stake = SP(Tp[0], yA); out.riser = SP(Tp[0] + 0.8, yA - 1.2);
  xrest();
  { const pts = []; for (let x = x0 + 0.6; x < sx1 - 0.1; x += 0.5) pts.push([x, surfY(x) + 0.06]); mmLine(pts, 'rgba(255,255,255,0.22)', 1); }
  out.cut = SP((K.gap[0] + K.gap[1]) / 2, surfY(-0.6)); out.rc = SP(RC[0], RC[1]);
  const fw = rotAbout(F0, RC, phi), v = [-(fw[1] - RC[1]), fw[0] - RC[0]], vl = Math.hypot(v[0], v[1]);
  out.footW = SP(fw[0], fw[1]); out.motion = SV(v[0] / vl, v[1] / vl); out.R = R; out.ppm = 1 / mmpx();
  if (o.pivot > 0) { xsave(); ga(o.pivot); G.beginPath(); G.arc(RC[0], RC[1], 0.9, 0, TAU); G.fillStyle = C.panel; G.fill(); G.strokeStyle = A; G.lineWidth = lw(2); G.stroke(); mmLine([[RC[0] - 1.7, RC[1]], [RC[0] + 1.7, RC[1]]], A, 1.5); mmLine([[RC[0], RC[1] - 1.7], [RC[0], RC[1] + 1.7]], A, 1.5); xrest(); }
  if (o.arc > 0) { xsave(); ga(o.arc); G.beginPath(); G.arc(RC[0], RC[1], R, g.rad - 0.2, g.rad + 0.16); G.setLineDash([lw(8), lw(6)]); G.strokeStyle = A; G.lineWidth = lw(1.8); G.stroke(); G.setLineDash([]); mmLine([[RC[0], RC[1]], [F0[0], F0[1]]], inkA(0.45), 1.2, { dash: [6, 5] }); xrest(); }
  return out;
}
function drawClick(x, y, s, o = {}) { return part(x, y, s, () => clickMM(o), o); }

/* =================================== 3. a dot skate on a cloth pad, in section ===================================
   origin: centre of the skate's sliding face on an unloaded pad. o.sink: how far the pad gives under it (mm). */
function skateMM(o = {}) {
  const sink = o.sink || 0, mat = o.mat === 'pom' ? MT.pom : o.mat === 'glass' ? MT.glass : MT.ptfe;
  const r = (o.d || 6) / 2, t = o.th || 0.8, er = o.er == null ? 0.3 : o.er, W2 = o.w || 9.5, out = {};
  const fade = x => { const ax = Math.abs(x) - (r - er); return ax <= 0 ? 1 : 1 - smooth(clamp(ax / (er + 1.9))); };
  const skB = x => { const ax = Math.abs(x); if (ax <= r - er) return sink; if (ax >= r) return -9; const k = ax - (r - er); return sink - (er - Math.sqrt(Math.max(0, er * er - k * k))); };
  const padY = x => { const f = sink * fade(x); return Math.abs(x) < r ? Math.max(f, skB(x)) : f; };
  const cloth = 0.42, foamB = 3.4, rubB = 3.95, xs = [];
  for (let x = -W2; x <= W2 + 1e-6; x += 0.05) xs.push(x);
  const band = (topFn, botY) => () => { G.beginPath(); G.moveTo(-W2, topFn(-W2)); for (const x of xs) G.lineTo(x, topFn(x)); brk(W2, topFn(W2), botY, 0.25); G.lineTo(-W2, botY); brk(-W2, botY, topFn(-W2), 0.25); G.closePath(); };
  solid(band(() => foamB, rubB), MT.rubber, [-W2, foamB, 2 * W2, rubB - foamB], { lw: 0.9 });
  const foamTop = x => padY(x) + cloth;
  const foamP = band(foamTop, foamB);
  solid(foamP, MT.foam, [-W2, cloth, 2 * W2, foamB], { lw: 0.9 });
  /* foam cells, squashed where the pad is pressed */
  G.save(); foamP(); G.clip();
  const rr = rng(11); G.strokeStyle = 'rgba(255,255,255,0.11)'; G.lineWidth = lw(1);
  for (let i = 0; i < 300; i++) {
    const x = -W2 + rr() * 2 * W2, v = rr(), rad = 0.06 + rr() * 0.13, tp = foamTop(x), y = tp + 0.08 + v * (foamB - tp - 0.16), k = (foamB - tp) / (foamB - cloth);
    G.beginPath(); G.ellipse(x, y, rad, rad * Math.max(0.3, k * k), 0, 0, TAU); G.stroke();
  }
  G.restore();
  /* the cloth: weft yarns cut across, warp yarns weaving over and under them */
  const pitch = 0.32, clothP = band(padY, 0);
  G.save(); G.beginPath(); for (const x of xs) G.lineTo(x, padY(x) - 0.05); for (let i = xs.length - 1; i >= 0; i--) G.lineTo(xs[i], padY(xs[i]) + cloth + 0.02); G.closePath(); G.fillStyle = '#3c3e44'; G.fill(); G.clip();
  for (let i = Math.floor(-W2 / pitch) - 1; i <= Math.ceil(W2 / pitch) + 1; i++) {
    const x = i * pitch, y = padY(x) + cloth * 0.5;
    G.beginPath(); G.ellipse(x, y, pitch * 0.42, cloth * 0.3, 0, 0, TAU); G.fillStyle = i % 2 ? '#6c6f76' : '#60636a'; G.fill(); G.strokeStyle = 'rgba(0,0,0,0.35)'; G.lineWidth = lw(0.7); G.stroke();
  }
  for (const ph of [0, 1]) { G.beginPath(); for (let x = -W2; x <= W2; x += 0.03) { const y = padY(x) + cloth * 0.5 + Math.sin((x / pitch + ph) * Math.PI) * cloth * 0.36; x === -W2 ? G.moveTo(x, y) : G.lineTo(x, y); } G.strokeStyle = ph ? 'rgba(160,164,172,0.8)' : 'rgba(126,130,138,0.8)'; G.lineWidth = lw(1.4); G.stroke(); }
  G.restore();
  G.beginPath(); for (const x of xs) G.lineTo(x, padY(x)); G.strokeStyle = 'rgba(0,0,0,0.35)'; G.lineWidth = lw(1); G.stroke();
  /* the skate: radiused edge, a film of adhesive, the base plate above */
  const y0 = sink;
  const sk = () => { G.beginPath(); G.moveTo(-r, y0 - t); G.lineTo(r, y0 - t); G.lineTo(r, y0 - er); G.arc(r - er, y0 - er, er, 0, Math.PI / 2); G.lineTo(-r + er, y0); G.arc(-r + er, y0 - er, er, Math.PI / 2, Math.PI); G.closePath(); };
  solid(sk, mat, [-r, y0 - t, 2 * r, t], { lw: 1.1, hatch: o.cut ? { sp: 6 } : false });
  G.fillStyle = 'rgba(214,170,74,0.8)'; G.fillRect(-r, y0 - t - 0.07, 2 * r, 0.07);
  const pt = y0 - t - 0.07;
  solid(() => { G.beginPath(); G.moveTo(-W2 + 0.6, pt - 1.0); G.lineTo(W2 - 0.6, pt - 1.0); brk(W2 - 0.6, pt - 1.0, pt, 0.25); G.lineTo(-W2 + 0.6, pt); brk(-W2 + 0.6, pt, pt - 1.0, 0.25); G.closePath(); }, MT.shell, [-W2, pt - 1, 2 * W2, 1], { hatch: true });
  out.skate = SP(r * 0.45, y0 - t * 0.5); out.edge = SP(r - er * 0.3, y0 - er * 0.3); out.tape = SP(-r * 0.4, y0 - t - 0.04); out.plate = SP(-W2 * 0.7, pt - 0.5);
  out.cloth = SP(W2 * 0.78, padY(W2 * 0.78) + cloth * 0.5); out.foam = SP(W2 * 0.7, 2.2); out.dent = SP(0, sink + cloth); out.surf = SP(r + 1.2, padY(r + 1.2)); out.top = SP(0, pt - 1.0);
  return out;
}
function drawSkate(x, y, s, o = {}) { return part(x, y, s, () => skateMM(o), o); }

/* =================================== 4. sensor and lens, in section ===================================
   origin: the lowest point of the lens (its reference plane). the surface sits 2.4 mm below plus o.lift.
   the LED shines down a light pipe whose slanted face throws it across the surface at a low angle;
   the imaging lens focuses the lit spot up through a hole in the board onto the sensor's array. */
function sensorMM(o = {}) {
  const lift = o.lift || 0, A = o.accent || acc(), bnd = [2.2, 2.6], surf = 2.4 + lift, inWin = surf >= bnd[0] - 1e-6 && surf <= bnd[1] + 1e-6, W2 = 13, out = {};
  const rayCol = inWin ? A : C.red, rays = o.rays == null ? 1 : o.rays;
  if (o.band !== false) { G.fillStyle = rgba(A, 0.16); G.fillRect(-W2, bnd[0], 2 * W2, bnd[1] - bnd[0]); mmLine([[-W2, bnd[0]], [W2, bnd[0]]], rgba(A, 0.8), 1.2, { dash: [6, 4], cap: 'butt' }); mmLine([[-W2, bnd[1]], [W2, bnd[1]]], rgba(A, 0.8), 1.2, { dash: [6, 4], cap: 'butt' }); }
  G.save(); G.beginPath(); G.rect(-W2, surf, 2 * W2, 2.2); G.clip();
  G.fillStyle = '#34363b'; G.fillRect(-W2, surf, 2 * W2, 2.2);
  for (let i = -46; i <= 46; i++) { const x = i * 0.28; G.beginPath(); G.ellipse(x, surf + 0.17, 0.12, 0.11, 0, 0, TAU); G.fillStyle = i % 2 ? '#5f6269' : '#55585f'; G.fill(); }
  G.restore(); mmLine([[-W2, surf], [W2, surf]], inkA(0.55), 1.2);
  const pcbT = -3.8, pcbB = -2.6;
  for (const [a, b, bl] of [[-W2, -8.4, [1, 0]], [-6.0, -2.4, [0, 0]], [2.4, W2, [0, 1]]]) pcbSec(a, b, pcbT, 1.2, { brk: bl });
  solid(() => { G.beginPath(); G.moveTo(-5.0, pcbT); G.lineTo(-5.0, pcbT - 2.3); G.lineTo(5.0, pcbT - 2.3); G.lineTo(5.0, pcbT); G.lineTo(1.1, pcbT); G.lineTo(1.1, pcbT - 0.45); G.lineTo(-1.1, pcbT - 0.45); G.lineTo(-1.1, pcbT); G.closePath(); }, MT.epoxy, [-5, pcbT - 2.3, 10, 2.3], {});
  G.fillStyle = 'rgba(255,255,255,0.07)'; G.fillRect(-5.0, pcbT - 2.3, 10, 0.35); G.strokeStyle = 'rgba(255,255,255,0.08)'; G.lineWidth = lw(1); G.strokeRect(-3.2, pcbT - 2.0, 6.4, 1.3);
  G.fillStyle = rgba(A, 0.9); G.fillRect(-0.9, pcbT - 0.95, 1.8, 0.28); G.fillStyle = 'rgba(0,0,0,0.35)'; for (let k = -0.8; k < 0.8; k += 0.2) G.fillRect(k, pcbT - 0.95, 0.02, 0.28);
  G.fillStyle = 'rgba(180,220,245,0.55)'; G.fillRect(-1.1, pcbT - 0.45, 2.2, 0.45);
  solid(() => { G.beginPath(); G.rect(-8.3, pcbT - 1.0, 2.2, 1.0); }, MT.white, [-8.3, pcbT - 1, 2.2, 1], { lw: 0.8 });
  G.fillStyle = 'rgba(255,255,255,0.9)'; G.fillRect(-7.6, pcbT - 0.1, 0.8, 0.12);
  const lens = () => {
    G.beginPath(); G.moveTo(-10.6, pcbB); G.lineTo(5.6, pcbB); G.lineTo(5.6, pcbB + 0.55); G.lineTo(2.6, pcbB + 0.55); G.lineTo(2.6, -0.42);
    G.quadraticCurveTo(1.6, -0.4, 0, 0); G.quadraticCurveTo(-1.6, -0.4, -2.6, -0.42); G.lineTo(-2.6, pcbB + 0.55); G.lineTo(-6.0, pcbB + 0.55);
    G.lineTo(-6.0, -1.5); G.lineTo(-7.1, -0.75); G.lineTo(-8.4, -1.25); G.lineTo(-8.4, pcbB + 0.55); G.lineTo(-10.6, pcbB + 0.55); G.closePath();
  };
  solid(lens, MT.lens, [-10.6, pcbB, 16, 2.6], { ec: 'rgba(120,175,205,0.95)', lw: 1.1 });
  G.beginPath(); G.moveTo(-2.4, pcbB); G.quadraticCurveTo(0, pcbB - 0.55, 2.4, pcbB); G.closePath(); G.fillStyle = 'rgba(205,235,250,0.55)'; G.fill(); G.strokeStyle = 'rgba(120,175,205,0.95)'; G.lineWidth = lw(1); G.stroke();
  solid(() => { G.beginPath(); G.rect(3.7, pcbT - 0.15, 0.75, 1.35); }, MT.lens, [3.7, pcbT, 0.75, 1.2], { ec: 'rgba(120,175,205,0.95)', lw: 0.8 });
  G.beginPath(); G.moveTo(-1.9, -0.36); G.quadraticCurveTo(0, 0.05, 1.9, -0.36); G.strokeStyle = 'rgba(255,255,255,0.35)'; G.lineWidth = lw(1); G.stroke();
  const spot = [0, surf], ex = [-6.9, -0.85];
  if (rays > 0) {
    xsave(); ga(rays);
    mmLine([[-7.2, pcbT], [-7.2, -1.05]], rgba(rayCol, 0.9), 2.2); mmLine([[-7.2, -1.05], ex, spot], rgba(rayCol, 0.95), 2.2);
    for (const lx of [-1.6, 0, 1.6]) { mmLine([spot, [lx, -0.3 + Math.abs(lx) * 0.05]], rgba(rayCol, 0.55), 1.2, { dash: [4, 3] }); mmLine([[lx, pcbB - 0.2], [0, pcbT - 0.8]], rgba(rayCol, 0.55), 1.2, { dash: [4, 3] }); }
    glow(spot[0], spot[1], 1.1, rayCol, 0.7); G.beginPath(); G.arc(spot[0], spot[1], 0.18, 0, TAU); G.fillStyle = rayCol; G.fill();
    xrest();
  }
  for (const side of [-1, 1]) {
    const xi = side * 5.2, xo = side * W2;
    solid(() => { G.beginPath(); G.moveTo(xi, 0.6); G.lineTo(xo, 0.6); brk(xo, 0.6, 1.6, 0.22 * side); G.lineTo(xi + side * 0.6, 1.6); G.lineTo(xi, 1.0); G.closePath(); }, MT.shell, [Math.min(xi, xo), 0.6, W2, 1], { hatch: true });
  }
  const skB = 2.4 + 0;
  solid(() => { G.beginPath(); G.moveTo(7.6, 1.6); G.lineTo(12.2, 1.6); G.lineTo(12.2, skB - 0.25); G.arc(11.95, skB - 0.25, 0.25, 0, Math.PI / 2); G.lineTo(7.85, skB); G.arc(7.85, skB - 0.25, 0.25, Math.PI / 2, Math.PI); G.closePath(); }, MT.ptfe, [7.6, 1.6, 4.6, 0.8], { lw: 0.9 });
  out.spot = SP(spot[0], spot[1]); out.lens = SP(1.8, -0.5); out.sensor = SP(3.2, pcbT - 2.3); out.array = SP(0, pcbT - 0.8); out.led = SP(-7.2, pcbT - 1.0); out.pipe = SP(-6.0, -1.6);
  out.band = SP(W2, (bnd[0] + bnd[1]) / 2); out.bandTop = SP(-W2, bnd[0]); out.bandBot = SP(-W2, bnd[1]); out.bandR = SP(W2, bnd[0]); out.skate = SP(12.2, 2.0); out.plate = SP(-9, 1.1); out.board = SP(9, pcbT + 0.6); out.inWin = inWin; out.surfL = SP(-W2, surf); out.surfR = SP(W2, surf); out.ref = SP(W2, 0);
  return out;
}
function drawSensor(x, y, s, o = {}) { return part(x, y, s, () => sensorMM(o), o); }

/* =================================== 5. scroll wheel ===================================
   side elevation: knurled rim, six straight spokes, hub, a POM bushing round a D-shaped axle. */
function wheelSideMM(o = {}) {
  const R = 10.5, n = 36, gd = 0.34, rot = o.rot || 0, A = o.accent || acc(), rr = 8.3, rh = 2.9, sw = 1.7, fr = 0.65, out = {};
  const hole = o.hole || C.panel, wm = o.mat || MT.white;
  xsave(); xturn(rot);
  const rim = () => { G.beginPath(); for (let i = 0; i < n; i++) { const a0 = i / n * TAU, a1 = (i + 0.56) / n * TAU, a2 = (i + 0.66) / n * TAU, a3 = (i + 0.9) / n * TAU, a4 = (i + 1) / n * TAU; G.arc(0, 0, R, a0, a1); G.lineTo((R - gd) * Math.cos(a2), (R - gd) * Math.sin(a2)); G.arc(0, 0, R - gd, a2, a3); G.lineTo(R * Math.cos(a4), R * Math.sin(a4)); } G.closePath(); };
  rim(); const rg = G.createRadialGradient(-3, -4, 1, 0, 0, R); rg.addColorStop(0, wm.g[0]); rg.addColorStop(1, wm.g[1]); G.fillStyle = rg; G.fill(); G.strokeStyle = edgeCol(wm); G.lineWidth = lw(1.2); G.stroke();
  for (const [r2, a] of [[R - 0.55, 0.16], [rr + 0.55, 0.1]]) { G.beginPath(); G.arc(0, 0, r2, 0, TAU); G.strokeStyle = `rgba(0,0,0,${a})`; G.lineWidth = lw(1); G.stroke(); }
  /* windows between straight spokes: drawn inset, then grown back with round joins, which fillets every corner */
  const Pt = (thA, dl, r) => { const t = Math.sqrt(r * r - dl * dl); return [t * Math.cos(thA) - dl * Math.sin(thA), t * Math.sin(thA) + dl * Math.cos(thA)]; };
  const win = k => {
    const t0 = k * TAU / 6, t1 = (k + 1) * TAU / 6, d = sw / 2 + fr, ri = rh + fr, ro = rr - fr;
    const a = Pt(t0, d, ri), b = Pt(t0, d, ro), c = Pt(t1, -d, ro), e = Pt(t1, -d, ri);
    G.beginPath(); G.moveTo(a[0], a[1]); G.lineTo(b[0], b[1]); G.arc(0, 0, ro, Math.atan2(b[1], b[0]), Math.atan2(c[1], c[0])); G.lineTo(e[0], e[1]); G.arc(0, 0, ri, Math.atan2(e[1], e[0]), Math.atan2(a[1], a[0]), true); G.closePath();
  };
  G.lineJoin = 'round';
  for (let k = 0; k < 6; k++) { win(k); G.strokeStyle = edgeCol(wm, 0.55); G.lineWidth = 2 * fr + lw(2.2); G.stroke(); }
  for (let k = 0; k < 6; k++) { win(k); G.fillStyle = hole; G.fill(); G.strokeStyle = hole; G.lineWidth = 2 * fr; G.stroke(); }
  G.beginPath(); G.arc(0, 0, 2.15, 0, TAU); G.strokeStyle = 'rgba(0,0,0,0.22)'; G.lineWidth = lw(1); G.stroke();
  G.beginPath(); G.arc(0, 0, 1.75, 0, TAU); G.fillStyle = o.hiBush ? A : grad(MT.pom, -1.7, -1.7, 1.7, 1.7); G.fill(); G.strokeStyle = edgeCol(MT.pom); G.lineWidth = lw(1); G.stroke();
  G.beginPath(); G.arc(0, 0, 1.05, -1.25, 1.25 + Math.PI); G.closePath(); G.fillStyle = grad(MT.steel, -1, -1, 1, 1); G.fill(); G.strokeStyle = edgeCol(MT.steel); G.lineWidth = lw(1); G.stroke();
  out.tread = SP(R * Math.cos(-0.9), R * Math.sin(-0.9)); out.spoke = SP(5.4, 0); out.window = SP(5.6 * Math.cos(TAU / 12), 5.6 * Math.sin(TAU / 12)); out.bush = SP(1.4, 1.0); out.axle = SP(0, 0);
  xrest();
  return out;
}
/** the wheel from the front: its width, the axle, the encoder on one side and a POM bushing in a bracket on the other */
function wheelFrontMM(o = {}) {
  const R = 10.5, w = 7.0, rot = o.rot || 0, out = {}, pcb = 6.8, wm = o.mat || MT.white;
  pcbSec(-15, -4.1, pcb, 1.2, { brk: [1, 0] }); pcbSec(4.1, 12.5, pcb, 1.2, { brk: [0, 1] });
  for (const lx of [-12.6, -10.2, -7.8]) { G.fillStyle = grad(MT.tin, lx - 0.25, 0, lx + 0.25, 0); G.fillRect(lx - 0.25, 3.6, 0.5, pcb + 1.6 - 3.6); }
  solid(() => { G.beginPath(); G.rect(-13.6, -3.6, 7.2, 7.4); }, { g: ['#c9ced5', '#7f8790'] }, [-13.6, -3.6, 7.2, 7.4], {});
  solid(() => { G.beginPath(); G.rect(-12.9, -2.9, 5.8, 6.0); }, MT.black, [-12.9, -2.9, 5.8, 6], { lw: 0.8 });
  G.fillStyle = 'rgba(255,255,255,0.08)'; G.fillRect(-12.9, -2.9, 5.8, 0.5);
  solid(() => { G.beginPath(); G.rect(-6.4, -1.0, 2.0, 2.0); }, MT.black, [-6.4, -1, 2, 2], { lw: 0.8 });
  solid(() => { G.beginPath(); G.moveTo(4.5, pcb); G.lineTo(4.5, -2.4); G.quadraticCurveTo(4.5, -3.2, 5.3, -3.2); G.lineTo(8.6, -3.2); G.quadraticCurveTo(9.4, -3.2, 9.4, -2.4); G.lineTo(9.4, pcb); G.closePath(); }, MT.shell, [4.5, -3.2, 4.9, pcb + 3.2], { hatch: true });
  solid(() => { G.beginPath(); G.rect(4.5, -1.75, 4.1, 3.5); }, MT.pom, [4.5, -1.75, 4.1, 3.5], { hatch: { sp: 5 }, lw: 0.9 });
  solid(() => { G.beginPath(); G.rect(-6.6, -1.0, 15.0, 2.0); }, MT.steel, [-6.6, -1, 15, 2], { lw: 0.9 });
  const wheel = () => { G.beginPath(); G.moveTo(-w / 2 + 1.2, -R); G.lineTo(w / 2 - 1.2, -R); G.quadraticCurveTo(w / 2, -R, w / 2, -R + 1.6); G.lineTo(w / 2, R - 1.6); G.quadraticCurveTo(w / 2, R, w / 2 - 1.2, R); G.lineTo(-w / 2 + 1.2, R); G.quadraticCurveTo(-w / 2, R, -w / 2, R - 1.6); G.lineTo(-w / 2, -R + 1.6); G.quadraticCurveTo(-w / 2, -R, -w / 2 + 1.2, -R); G.closePath(); };
  wheel(); const vg = G.createLinearGradient(0, -R, 0, R); vg.addColorStop(0, wm.g[1]); vg.addColorStop(0.35, wm.g[0]); vg.addColorStop(0.65, wm.g[0]); vg.addColorStop(1, wm.g[1]); G.fillStyle = vg; G.fill();
  G.save(); wheel(); G.clip(); G.strokeStyle = 'rgba(0,0,0,0.22)'; G.lineWidth = lw(1);
  for (let i = 0; i < 36; i++) { const a = i / 36 * TAU + rot; if (Math.cos(a) <= 0.05) continue; const y = R * Math.sin(a); G.beginPath(); G.moveTo(-w / 2, y); G.lineTo(w / 2, y); G.stroke(); }
  const hg = G.createLinearGradient(-w / 2, 0, w / 2, 0); hg.addColorStop(0, 'rgba(0,0,0,0.16)'); hg.addColorStop(0.3, 'rgba(0,0,0,0)'); hg.addColorStop(0.7, 'rgba(0,0,0,0)'); hg.addColorStop(1, 'rgba(0,0,0,0.16)'); G.fillStyle = hg; G.fillRect(-w / 2, -R, w, 2 * R);
  G.restore(); wheel(); G.strokeStyle = edgeCol(wm); G.lineWidth = lw(1.2); G.stroke();
  out.encoder = SP(-10, -3.6); out.bush = SP(6.55, -1.75); out.bracket = SP(9.4, 3.5); out.axle = SP(7.6, 0); out.wheel = SP(w / 2, -6); out.board = SP(10, pcb + 0.6);
  return out;
}

/* =================================== 6. a screw into a heat-set insert, in section ===================================
   origin: where the boss meets the bottom plate, on the screw axis. the screw is not hatched: it's a fastener. */
function insertMM(o = {}) {
  const A = o.accent || acc(), k = o.k == null ? 1 : o.k, out = {}, dy = (1 - k) * 4.2;
  solid(() => { G.beginPath(); G.moveTo(-3.3, 0); G.lineTo(-3.3, -6.6); G.bezierCurveTo(-1.6, -6.2, 1.6, -7.0, 3.3, -6.6); G.lineTo(3.3, 0); G.closePath(); }, MT.shell, [-3.3, -7, 6.6, 7], { hatch: true });
  G.beginPath(); G.rect(-1.0, -5.2, 2.0, 2.2); G.fillStyle = o.hole || C.panel; G.fill(); G.strokeStyle = edgeCol(MT.shell); G.lineWidth = lw(0.9); G.stroke();
  for (const s of [-1, 1]) {
    solid(() => { G.beginPath(); G.moveTo(s * 1.0, -3.0); for (let i = 0; i <= 15; i++) { const yy = -3.0 + i * 0.2; G.lineTo(s * (i % 2 ? 1.78 : 1.55), yy); } G.lineTo(s * 1.0, 0); for (let i = 0; i <= 7; i++) { const yy = -0.2 - i * 0.4; G.lineTo(s * 1.0, yy); G.lineTo(s * 0.86, yy - 0.2); } G.closePath(); }, MT.brass, [-1.8, -3, 3.6, 3], { hatch: { dir: -1, sp: 5 }, lw: 0.8 });
  }
  solid(() => { G.beginPath(); G.moveTo(-6.5, 0); G.lineTo(-1.2, 0); G.lineTo(-1.2, 0.25); G.lineTo(-2.3, 0.25); G.lineTo(-2.3, 1.25); G.lineTo(-6.5, 1.25); brk(-6.5, 1.25, 0, 0.25); G.closePath(); }, MT.shell, [-6.5, 0, 5.3, 1.25], { hatch: true });
  solid(() => { G.beginPath(); G.moveTo(6.5, 0); G.lineTo(1.2, 0); G.lineTo(1.2, 0.25); G.lineTo(2.3, 0.25); G.lineTo(2.3, 1.25); G.lineTo(6.5, 1.25); brk(6.5, 1.25, 0, -0.25); G.closePath(); }, MT.shell, [1.2, 0, 5.3, 1.25], { hatch: true });
  xsave(); xmove(0, dy);
  const shank = () => { G.beginPath(); G.moveTo(-0.78, -3.5); G.lineTo(-0.5, -3.75); G.lineTo(0.5, -3.75); G.lineTo(0.78, -3.5); for (let i = 0; i < 9; i++) { const yy = -3.5 + i * 0.4; G.lineTo(1.0, yy + 0.1); G.lineTo(0.78, yy + 0.3); } G.lineTo(0.78, 0.25); G.lineTo(-0.78, 0.25); for (let i = 8; i >= 0; i--) { const yy = -3.5 + i * 0.4; G.lineTo(-0.78, yy + 0.5); G.lineTo(-1.0, yy + 0.3); } G.closePath(); };
  solid(shank, MT.steel, [-1, -3.75, 2, 4], { horiz: true, lw: 0.9 });
  G.save(); shank(); G.clip(); G.strokeStyle = 'rgba(40,45,52,0.45)'; G.lineWidth = lw(1); G.beginPath(); for (let i = 0; i < 9; i++) { const yy = -3.5 + i * 0.4; G.moveTo(-1, yy + 0.3); G.lineTo(1, yy + 0.1); } G.stroke(); G.restore();
  solid(() => { G.beginPath(); G.moveTo(-1.9, 0.25); G.lineTo(1.9, 0.25); G.lineTo(1.9, 0.75); G.quadraticCurveTo(1.85, 1.24, 1.15, 1.25); G.lineTo(-1.15, 1.25); G.quadraticCurveTo(-1.85, 1.24, -1.9, 0.75); G.closePath(); }, MT.steel, [-1.9, 0.25, 3.8, 1], { horiz: true, lw: 0.9 });
  G.beginPath(); G.moveTo(-0.7, 1.25); G.lineTo(0, 0.6); G.lineTo(0.7, 1.25); G.closePath(); G.fillStyle = 'rgba(25,26,30,0.85)'; G.fill();
  out.head = SP(1.9, 1.0); out.thread = SP(1.0, -2.3);
  xrest();
  if (o.melt > 0) { xsave(); ga(o.melt); for (const s of [-1, 1]) glow(s * 1.7, -1.5, 1.6, A, 0.45); xrest(); }
  out.insert = SP(1.78, -1.9); out.knurl = SP(-1.78, -2.4); out.boss = SP(-3.3, -4.5); out.plate = SP(4.5, 0.6); out.hole = SP(0, -5.2);
  return out;
}
/** a screw head from below: a cross recess, a slight dome */
function screwHeadMM() {
  /* the Ownership chapter's head, shaded from the 3D model's exact surface, so every slide shows the same screw */
  if (typeof own_headTopMM === 'function') return own_headTopMM();
  /* an M2 pan head, brass-plated, with the combination recess: a slot for a flat blade and a cross for a Phillips (#9) */
  const g = G.createRadialGradient(-0.6, -0.6, 0.1, 0, 0, 1.95); g.addColorStop(0, '#fbecbc'); g.addColorStop(0.6, '#d6b25c'); g.addColorStop(1, '#94722a');
  G.beginPath(); G.arc(0, 0, 1.9, 0, TAU); G.fillStyle = g; G.fill(); G.strokeStyle = 'rgba(70,52,12,0.85)'; G.lineWidth = lw(1); G.stroke();
  G.beginPath(); G.arc(0, 0, 1.55, 0, TAU); G.strokeStyle = 'rgba(80,60,15,0.2)'; G.lineWidth = lw(1); G.stroke();
  G.save(); G.beginPath(); G.arc(0, 0, 1.86, 0, TAU); G.clip(); G.fillStyle = '#2f2614'; G.fillRect(-2, -0.2, 4, 0.4); G.fillStyle = 'rgba(255,240,200,0.3)'; G.fillRect(-2, -0.2, 4, 0.06); G.restore();
  G.fillStyle = '#2a2212'; G.beginPath();
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; G.moveTo(0, 0); G.lineTo(Math.cos(a - 0.17) * 1.05, Math.sin(a - 0.17) * 1.05); G.lineTo(Math.cos(a + 0.17) * 1.05, Math.sin(a + 0.17) * 1.05); G.closePath(); }
  G.fill(); G.beginPath(); G.arc(0, 0, 0.32, 0, TAU); G.fill();
  return {};
}

/* =================================== 7. the receiver, from above ===================================
   a generic desk receiver: a pixel screen, two buttons, a USB-C port at each end. its styling is
   not the product's; only the features are. */
function dongleMM(o = {}) {
  const A = o.accent || acc(), out = {}, W2 = 22, H2 = 8.5, lines = o.lines || [];
  for (const s of [-1, 1]) {
    if (o.cables === false || (s > 0 && o.pass === false)) continue;
    const x0 = s * (W2 + 0.2), x1 = s * (W2 + 7.5);
    solid(() => { G.beginPath(); G.rect(Math.min(x0, x1), -2.6, 7.3, 5.2); }, MT.black, [Math.min(x0, x1), -2.6, 7.3, 5.2], { lw: 1 });
    G.fillStyle = 'rgba(255,255,255,0.07)'; G.fillRect(Math.min(x0, x1), -2.6, 7.3, 0.8);
    solid(() => { G.beginPath(); G.rect(s > 0 ? x1 : x1 - 9, -1.15, 9, 2.3); }, MT.black, [s > 0 ? x1 : x1 - 9, -1.15, 9, 2.3], { lw: 1 });
  }
  solid(() => pathRR(-W2, -H2, 2 * W2, 2 * H2, 4.2), { g: ['#2f3035', '#18191c'], dark: 1 }, [-W2, -H2, 2 * W2, 2 * H2], { lw: 1.4 });
  pathRR(-W2 + 0.9, -H2 + 0.9, 2 * W2 - 1.8, 2 * H2 - 1.8, 3.4); G.strokeStyle = 'rgba(255,255,255,0.09)'; G.lineWidth = lw(1); G.stroke();
  const sx = -W2 + 4.2, sw = 24, sy = -5.6, sh = 11.2;
  pathRR(sx - 0.6, sy - 0.6, sw + 1.2, sh + 1.2, 1.3); G.fillStyle = '#0b0c0d'; G.fill();
  pathRR(sx, sy, sw, sh, 0.7); G.fillStyle = '#050606'; G.fill();
  G.save(); G.beginPath(); G.rect(sx + 0.4, sy + 0.4, sw - 0.8, sh - 0.8); G.clip();
  lines.forEach(l => { G.save(); G.translate(sx + 1.3 + (l.x || 0), sy + (l.y || 3.6)); const k = (l.s || 3.0) / 30; G.scale(k, k); setFont({ size: 30, weight: l.w || 700 }); G.fillStyle = l.c || '#ebeae6'; G.textAlign = 'left'; G.fillText(l.t, 0, 0); G.restore(); });
  if (o.bat != null) { const bx = sx + sw - 6.2, by = sy + 1.2; G.strokeStyle = '#ebeae6'; G.lineWidth = 0.22; G.strokeRect(bx, by, 4.2, 1.9); G.fillStyle = '#ebeae6'; G.fillRect(bx + 4.2, by + 0.55, 0.4, 0.8); G.fillRect(bx + 0.4, by + 0.4, 3.4 * clamp(o.bat), 1.1); }
  G.strokeStyle = 'rgba(0,0,0,0.65)'; G.lineWidth = 0.07; G.beginPath(); for (let u = sx; u < sx + sw; u += 0.32) { G.moveTo(u, sy); G.lineTo(u, sy + sh); } for (let v = sy; v < sy + sh; v += 0.32) { G.moveTo(sx, v); G.lineTo(sx + sw, v); } G.stroke();
  const gl = G.createLinearGradient(sx, sy, sx + sw * 0.6, sy + sh); gl.addColorStop(0, 'rgba(255,255,255,0.06)'); gl.addColorStop(0.4, 'rgba(255,255,255,0)'); G.fillStyle = gl; G.fillRect(sx, sy, sw, sh);
  G.restore();
  const bpos = [[W2 - 11.4, -2.4, 'dpi'], [W2 - 5.2, -2.4, 'hz']];
  for (const [bx, by, lab] of bpos) {
    G.beginPath(); G.arc(bx, by, 2.35, 0, TAU); G.fillStyle = '#0d0e10'; G.fill();
    G.beginPath(); G.arc(bx, by, 2.0, 0, TAU); const bg = G.createRadialGradient(bx - 0.6, by - 0.8, 0.2, bx, by, 2.1); bg.addColorStop(0, '#5a5c63'); bg.addColorStop(1, '#2a2b30'); G.fillStyle = bg; G.fill(); G.strokeStyle = 'rgba(255,255,255,0.12)'; G.lineWidth = lw(1); G.stroke();
    G.beginPath(); G.arc(bx, by, 1.2, 0, TAU); G.strokeStyle = 'rgba(0,0,0,0.35)'; G.lineWidth = lw(1); G.stroke();
    G.save(); G.translate(bx, by + 4.6); G.scale(0.06, 0.06); setFont({ size: 26, weight: 700 }); G.fillStyle = '#8e8c85'; G.textAlign = 'center'; G.fillText(lab, 0, 0); G.restore();
  }
  G.beginPath(); G.arc(W2 - 2.2, -H2 + 2.0, 0.42, 0, TAU); G.fillStyle = o.led || A; G.fill(); glow(W2 - 2.2, -H2 + 2.0, 1.2, o.led || A, 0.4);
  for (const s of [-1, 1]) { pathRR(s > 0 ? W2 - 0.55 : -W2 - 0.45, -1.6, 1.0, 3.2, 0.45); G.fillStyle = '#050506'; G.fill(); }
  out.screen = SP(sx + sw / 2, sy); out.b1 = SP(bpos[0][0], bpos[0][1] + 2.35); out.b2 = SP(bpos[1][0], bpos[1][1] + 2.35); out.portL = SP(-W2 - 7.5, 0); out.portR = SP(W2 + 7.5, 0); out.body = SP(0, H2); out.led = SP(W2 - 2.2, -H2 + 2.0);
  return out;
}

/* =================================== 8. a corner of a circuit board, from above ===================================
   black solder mask with the copper showing faintly through, gold pads, an MCU in QFN, a crystal,
   0402 passives, stitching vias, a printed antenna in its keep-out, silkscreen. a generic layout. */
function boardMM(o = {}) {
  const A = o.accent || acc(), W2 = o.w || 18, H2 = o.h || 12, out = {}, r = rng(o.seed || 9);
  const gold = '#d9b25a', mask = o.mask || '#16171a', trace = 'rgba(255,255,255,0.075)';
  const edge = () => { G.beginPath(); G.moveTo(-W2, -H2); G.lineTo(W2 - 1.6, -H2); G.quadraticCurveTo(W2, -H2, W2, -H2 + 1.6); G.lineTo(W2, H2); G.bezierCurveTo(W2 * 0.3, H2 + 0.5, -W2 * 0.3, H2 - 0.5, -W2, H2); G.bezierCurveTo(-W2 - 0.5, H2 * 0.3, -W2 + 0.5, -H2 * 0.3, -W2, -H2); G.closePath(); };
  edge(); G.fillStyle = mask; G.fill();
  G.save(); edge(); G.clip();
  const ax = W2 - 9.5, ay = -H2;
  G.fillStyle = 'rgba(255,255,255,0.025)'; G.fillRect(ax, ay, 9.5, 5.2);
  G.strokeStyle = 'rgba(217,178,90,0.55)'; G.lineWidth = 0.42; G.lineJoin = 'miter'; G.beginPath(); G.moveTo(ax + 1.2, ay + 5.2); G.lineTo(ax + 1.2, ay + 1.4); G.lineTo(ax + 8.4, ay + 1.4); G.moveTo(ax + 2.6, ay + 5.2); G.lineTo(ax + 2.6, ay + 1.4); G.stroke();
  G.strokeStyle = trace; G.lineWidth = 0.18; G.strokeRect(-W2 + 0.8, -H2 + 0.8, ax - (-W2 + 0.8) - 0.6, 2 * H2);
  const via = (x, y) => { G.beginPath(); G.arc(x, y, 0.22, 0, TAU); G.fillStyle = gold; G.fill(); G.beginPath(); G.arc(x, y, 0.1, 0, TAU); G.fillStyle = '#0a0a0b'; G.fill(); };
  for (let x = -W2 + 1.6; x < ax - 0.8; x += 1.4) via(x, -H2 + 1.6);
  const mcu = o.mcu || { x: -4, y: 1, w: 7, label: 'nRF54LM20A' };
  const traces = [[[mcu.x + 3.5, mcu.y - 1.5], [mcu.x + 6, mcu.y - 1.5], [mcu.x + 8, mcu.y - 3.5], [ax + 1.2, mcu.y - 3.5], [ax + 1.2, ay + 5.2]], [[mcu.x - 3.5, mcu.y + 1], [mcu.x - 7, mcu.y + 1], [mcu.x - 8.5, mcu.y + 2.5], [-W2 + 1, mcu.y + 2.5]], [[mcu.x + 1, mcu.y + 3.5], [mcu.x + 1, mcu.y + 6], [mcu.x + 3, mcu.y + 8], [mcu.x + 12, mcu.y + 8]], [[mcu.x - 1.5, mcu.y - 3.5], [mcu.x - 1.5, mcu.y - 6], [mcu.x - 3, mcu.y - 7.5], [-W2 + 1, mcu.y - 7.5]], [[mcu.x + 3.5, mcu.y + 2], [mcu.x + 9, mcu.y + 2], [mcu.x + 10.5, mcu.y + 3.5], [W2 - 1, mcu.y + 3.5]]];
  G.strokeStyle = trace; G.lineWidth = 0.3; G.lineJoin = 'round'; G.lineCap = 'round';
  for (const tr of traces) { G.beginPath(); tr.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.stroke(); }
  for (let i = 0; i < 14; i++) { const x = -W2 + 2 + r() * (2 * W2 - 4), y = -H2 + 6.5 + r() * (2 * H2 - 8); if (Math.abs(x - mcu.x) < 6 && Math.abs(y - mcu.y) < 6) continue; via(x, y); }
  const hw = mcu.w / 2;
  G.fillStyle = gold; for (let k = 0; k < 12; k++) { const t2 = -hw + 0.6 + k * (mcu.w - 1.2) / 11; G.fillRect(mcu.x + t2 - 0.12, mcu.y - hw - 0.55, 0.24, 0.5); G.fillRect(mcu.x + t2 - 0.12, mcu.y + hw + 0.05, 0.24, 0.5); G.fillRect(mcu.x - hw - 0.55, mcu.y + t2 - 0.12, 0.5, 0.24); G.fillRect(mcu.x + hw + 0.05, mcu.y + t2 - 0.12, 0.5, 0.24); }
  pathRR(mcu.x - hw, mcu.y - hw, mcu.w, mcu.w, 0.3); G.fillStyle = mcu.hi ? A : grad(MT.epoxy, 0, mcu.y - hw, 0, mcu.y + hw); G.fill(); G.strokeStyle = 'rgba(255,255,255,0.12)'; G.lineWidth = lw(1); G.stroke();
  G.beginPath(); G.arc(mcu.x - hw + 0.7, mcu.y - hw + 0.7, 0.28, 0, TAU); G.fillStyle = 'rgba(255,255,255,0.25)'; G.fill();
  G.save(); G.translate(mcu.x, mcu.y + 0.3); G.scale(0.034, 0.034); setFont({ size: 26, weight: 600 }); G.fillStyle = mcu.hi ? '#0d0e0f' : 'rgba(255,255,255,0.4)'; G.textAlign = 'center'; G.fillText(mcu.label, 0, 0); G.restore();
  const cx0 = mcu.x + 6.2, cy0 = mcu.y + 4.6;
  for (const [px, py] of [[-0.75, -0.55], [0.75, -0.55], [-0.75, 0.55], [0.75, 0.55]]) { G.fillStyle = gold; G.fillRect(cx0 + px - 0.45, cy0 + py - 0.35, 0.9, 0.7); }
  pathRR(cx0 - 1.0, cy0 - 0.8, 2.0, 1.6, 0.2); G.fillStyle = grad(MT.steel, cx0 - 1, cy0 - 0.8, cx0 + 1, cy0 + 0.8); G.fill(); G.strokeStyle = 'rgba(0,0,0,0.35)'; G.lineWidth = lw(0.8); G.stroke();
  const pas = [[mcu.x - 5.4, mcu.y - 2.0, 0], [mcu.x - 5.4, mcu.y - 0.4, 0], [mcu.x - 5.4, mcu.y + 3.4, 0], [mcu.x + 1.6, mcu.y - 5.3, 1], [mcu.x + 3.0, mcu.y - 5.3, 1], [mcu.x + 5.6, mcu.y - 0.2, 0], [mcu.x + 5.6, mcu.y + 1.3, 0], [mcu.x - 1.2, mcu.y + 5.4, 1], [mcu.x + 0.4, mcu.y + 5.4, 1], [ax + 4.6, ay + 3.6, 0]];
  pas.forEach(([px, py, v], i) => { G.save(); G.translate(px, py); if (v) G.rotate(Math.PI / 2); G.fillStyle = gold; G.fillRect(-0.62, -0.3, 0.4, 0.6); G.fillRect(0.22, -0.3, 0.4, 0.6); G.fillStyle = i % 3 ? '#b49a6e' : '#2a2b30'; G.fillRect(-0.32, -0.25, 0.64, 0.5); G.fillStyle = '#e6e7e9'; G.fillRect(-0.5, -0.25, 0.18, 0.5); G.fillRect(0.32, -0.25, 0.18, 0.5); G.restore(); });
  const silk = (s, x, y, sz = 0.9) => { G.save(); G.translate(x, y); const k = sz / 26; G.scale(k, k); setFont({ size: 26, weight: 700 }); G.fillStyle = 'rgba(236,235,231,0.72)'; G.textAlign = 'left'; G.fillText(s, 0, 0); G.restore(); };
  silk('U1', mcu.x - hw, mcu.y - hw - 1.0); silk('Y1', cx0 + 1.3, cy0 + 0.35); silk('ANT', ax + 4.8, ay + 4.6, 0.8); silk('C12', mcu.x - 7.6, mcu.y - 1.7, 0.7);
  G.beginPath(); G.arc(-W2 + 2.2, H2 - 2.0, 0.9, 0, TAU); G.fillStyle = 'rgba(0,0,0,0.3)'; G.fill(); G.beginPath(); G.arc(-W2 + 2.2, H2 - 2.0, 0.45, 0, TAU); G.fillStyle = gold; G.fill();
  G.restore();
  edge(); G.strokeStyle = edgeCol(MT.mask); G.lineWidth = lw(1.2); G.stroke();
  G.beginPath(); G.moveTo(-W2, -H2); G.lineTo(W2 - 1.6, -H2); G.quadraticCurveTo(W2, -H2, W2, -H2 + 1.6); G.strokeStyle = gold; G.lineWidth = lw(1.6); G.stroke();
  out.mcu = SP(mcu.x, mcu.y - hw); out.mcuR = SP(mcu.x + hw, mcu.y); out.xtal = SP(cx0, cy0 - 0.8); out.ant = SP(ax + 5, ay + 1.4); out.antArea = SP(ax + 4.75, ay + 2.6);
  return out;
}

/* =================================== 9. coating, magnified section ===================================
   a slice of a shell surface about 0.3 mm wide: carbon-filled plastic, a blasted interface, a ceramic-
   loaded film. layers are not to scale with each other; the film thickness goes in the label. */
function coatMM(o = {}) {
  const wdt = o.w || 60, film = o.film == null ? 1 : o.film, out = {};
  const iface = x => 7 + 0.55 * Math.sin(x * 1.9) + 0.3 * Math.sin(x * 4.7 + 1) + 0.15 * Math.sin(x * 11.3);
  const etch = o.etch || 0, ftop = x => 2.2 + 0.18 * Math.sin(x * 2.3 + 0.5) + 0.08 * Math.sin(x * 7.1) + etch * 1.5 * Math.pow(Math.max(0, Math.sin(x * 1.05)), 8);
  const sub = () => { G.beginPath(); G.moveTo(0, iface(0)); for (let x = 0; x <= wdt; x += 0.25) G.lineTo(x, iface(x)); G.lineTo(wdt, 24); G.bezierCurveTo(wdt * 0.66, 24.6, wdt * 0.33, 23.4, 0, 24); G.closePath(); };
  solid(sub, MT.shell, [0, 6, wdt, 18], { lw: 1.1 });
  G.save(); sub(); G.clip(); const r = rng(3);
  for (let i = 0; i < 70; i++) { const fx = r() * wdt, fy = 8 + r() * 15, a = (r() - 0.5) * 0.7, L = 2.5 + r() * 4; G.save(); G.translate(fx, fy); G.rotate(a); pathRR(-L / 2, -0.32, L, 0.64, 0.32); G.fillStyle = '#18191c'; G.fill(); G.strokeStyle = 'rgba(255,255,255,0.10)'; G.lineWidth = lw(1); G.stroke(); G.restore(); }
  G.restore();
  if (film > 0) {
    const fl = () => { G.beginPath(); G.moveTo(0, ftop(0)); for (let x = 0; x <= wdt * film; x += 0.25) G.lineTo(x, ftop(x)); for (let x = wdt * film; x >= 0; x -= 0.25) G.lineTo(x, iface(x)); G.closePath(); };
    solid(fl, o.mat || { g: ['#4a4b52', '#34353b'], dark: 1 }, [0, 1.8, wdt, 6], { lw: 1.1 });
    G.save(); fl(); G.clip(); const r2 = rng(17);
    for (let i = 0; i < 260; i++) { const px = r2() * wdt, py = 2 + r2() * 6, rad = 0.12 + r2() * 0.28, sides = 5 + Math.floor(r2() * 3); G.beginPath(); for (let k = 0; k < sides; k++) { const a = k / sides * TAU + r2(); G.lineTo(px + Math.cos(a) * rad, py + Math.sin(a) * rad); } G.closePath(); G.fillStyle = 'rgba(205,208,214,0.55)'; G.fill(); }
    G.restore();
  }
  out.film = SP(wdt * 0.7, 4.4); out.top = SP(wdt * 0.3, ftop(wdt * 0.3)); out.iface = SP(wdt * 0.5, iface(wdt * 0.5)); out.sub = SP(wdt * 0.4, 15);
  return out;
}

/* =================================== 10. a notch in a wall, with the load running round its tip ===================================
   a 1.6 mm wall loaded along its length; depth a, tip radius rho. the lines of force squeeze into the
   ligament under the notch; the peak at the tip goes as Kt = 1 + 2 sqrt(a / rho). */
function notchMM(o = {}) {
  const a = o.depth == null ? 0.6 : o.depth, rho = o.rho || 0.1, A = o.accent || acc(), wdt = 18, th = 1.6, cx = wdt / 2, half = 0.25 + a * 0.45, out = {};
  const nd = x => { const u = Math.abs(x - cx); if (u >= half) return 0; const lin = a * (1 - u / half); const tip = a - (rho - Math.sqrt(Math.max(0, rho * rho - u * u))); return u < rho ? Math.min(lin, tip) : lin; };
  const wall = () => { G.beginPath(); G.moveTo(0, 0); for (let x = 0; x <= wdt; x += 0.02) G.lineTo(x, nd(x)); G.lineTo(wdt, th); G.lineTo(0, th); G.closePath(); };
  solid(wall, MT.shell, [0, 0, wdt, th], { lw: 1.1 });
  const kt = 1 + 2 * Math.sqrt(a / rho);
  G.save(); wall(); G.clip();
  for (let k = 0; k < 9; k++) {
    const s = (k + 0.5) / 9;
    G.beginPath(); for (let x = 0; x <= wdt; x += 0.03) { const tp = nd(x), y = tp + (th - tp) * s; x === 0 ? G.moveTo(x, y) : G.lineTo(x, y); }
    const near = 1 - s; G.strokeStyle = rgba(near > 0.75 && a > 0.3 ? C.red : A, 0.35 + 0.55 * near); G.lineWidth = lw(1.2 + 1.2 * near); G.stroke();
  }
  glow(cx, a, 0.35 + 0.04 * kt, kt > 4 ? C.red : A, Math.min(0.85, 0.12 * kt));
  G.restore();
  out.tip = SP(cx, a); out.wall = SP(2, th / 2); out.kt = kt;
  return out;
}

/* =================================== 11. a side button on rails, in section ===================================
   shown pressing downward. the cap rides on two guides through slots in the side board; hooks at their ends
   stop it coming out; the switch sits under the middle. */
function railMM(o = {}) {
  const press = clamp(o.press || 0), tr = press * 0.9, out = {};
  for (const s of [-1, 1]) solid(() => { G.beginPath(); G.moveTo(s * 8.0, -2.2); G.lineTo(s * 14, -2.2); brk(s * 14, -2.2, 0.4, 0.3 * s); G.lineTo(s * 8.0, 0.4); G.quadraticCurveTo(s * 7.6, 0.4, s * 7.6, 0.0); G.lineTo(s * 7.6, -1.8); G.quadraticCurveTo(s * 7.6, -2.2, s * 8.0, -2.2); G.closePath(); }, MT.shell, [Math.min(s * 8, s * 14), -2.2, 6, 2.6], { hatch: true });
  pcbSec(-13, -6.0, 7.2, 1.2, { brk: [1, 0] }); pcbSec(-4.4, 4.4, 7.2, 1.2, { brk: [0, 0] }); pcbSec(6.0, 13, 7.2, 1.2, { brk: [0, 1] });
  solid(() => { G.beginPath(); G.rect(-2.6, 4.6, 5.2, 2.6); }, MT.black, [-2.6, 4.6, 5.2, 2.6], {});
  solid(() => { G.beginPath(); G.rect(-1.3, 4.1 + tr * 0.55, 2.6, 0.6); }, MT.pom, [-1.3, 4.1, 2.6, 0.6], { lw: 0.8 });
  for (const s of [-1, 1]) solderFillet(s * 2.2, 7.2, -1);
  xsave(); xmove(0, tr);
  for (const s of [-1, 1]) {
    solid(() => { G.beginPath(); G.moveTo(s * 4.6, 0.5); G.lineTo(s * 5.8, 0.5); G.lineTo(s * 5.8, 9.4); G.lineTo(s * 6.25, 9.4); G.lineTo(s * 6.25, 9.9); G.lineTo(s * 5.4, 10.4); G.lineTo(s * 4.6, 10.4); G.closePath(); }, MT.pom, [Math.min(s * 4.6, s * 6.25), 0.5, 1.7, 9.9], { hatch: { sp: 5 }, lw: 0.9 });
  }
  solid(() => { G.beginPath(); G.moveTo(-7.4, -1.2); G.lineTo(7.4, -1.2); G.quadraticCurveTo(7.6, -0.2, 7.0, 0.5); G.lineTo(-7.0, 0.5); G.quadraticCurveTo(-7.6, -0.2, -7.4, -1.2); G.closePath(); }, MT.shell, [-7.6, -1.2, 15.2, 1.7], { hatch: true });
  solid(() => { G.beginPath(); G.rect(-1.0, 0.5, 2.0, 3.55); }, MT.shell, [-1, 0.5, 2, 3.6], { hatch: true, lw: 0.9 });
  out.cap = SP(0, -1.2); out.rail = SP(5.8, 4.5); out.hook = SP(6.25, 9.7);
  xrest();
  out.slot = SP(-5.2, 7.8); out.boardSlot = SP(7.4, 7.8); out.sw = SP(2.6, 5.6); out.board = SP(10, 7.8); out.wall = SP(11, -1);
  return out;
}

/* =================================== 12. the tensioners, from above ===================================
   K1, 2026-11-05: the two tensioners as the triggers' own arms (the trigger's moulding, no steel), seen from above with the
   shell off, as in Brock's photos of shipping top shells: behind the bend line a block screwed to the shell by one screw (#49);
   across the bend line the bridge (#50), 10 mm wide and centred on the arm's switch line (#18), its crown dashed; in front the
   trigger's riser and its plate. o.smile 0..1 bends the bend line to follow a curved rear cutout (#17). o.built 0..1 adds what
   ships today (Brock: "overbuilt and overly complex"): a bigger block with a stacked boss and a grid of holes round the screw. */
function tensionerPlanMM(o = {}) {
  const sm = o.smile || 0, A = o.accent || acc(), out = { arms: [] }, w = 19, gap = 2.4, bt = clamp(o.built || 0);
  const edgeY = x => -sm * 4.6 * (1 - Math.pow(x / (w + gap / 2), 2));
  const gph = TH ? '#4B4C53' : '#3A3B42', lite = TH ? '#77787F' : '#5C5D64', ed = inkA(0.5);
  const run = (x0, x1, n) => Array.from({ length: n + 1 }, (_, i) => x0 + (x1 - x0) * i / n);
  /* a band between two offsets from the bend line, sampled at shared x positions so neighbouring bands meet on one line */
  const band = (x0, x1, d0, d1) => { const xs = run(x0, x1, Math.max(4, Math.round(Math.abs(x1 - x0) / 0.25))); G.beginPath(); xs.forEach((x, i) => i ? G.lineTo(x, edgeY(x) + d0) : G.moveTo(x, edgeY(x) + d0)); for (let i = xs.length - 1; i >= 0; i--) G.lineTo(xs[i], edgeY(xs[i]) + d1); G.closePath(); };
  const fillE = (f, e = ed) => { G.fillStyle = f; G.fill(); G.strokeStyle = e; G.lineWidth = lw(1.1); G.lineJoin = 'round'; G.stroke(); };
  for (const s of [-1, 1]) {
    const xa = s * gap / 2, xb = s * (gap / 2 + w), xl = Math.min(xa, xb), xr = Math.max(xa, xb), hx = s * (gap / 2 + w * 0.5), fx0 = hx - 5, fx1 = hx + 5;
    /* the trigger's plate and riser, in front of the bridge; the plate is cut off with a break line toward the front */
    band(xl, xr, -11.0, -7.4); fillE(gph);
    { const xs = run(xl, xr, 40); G.beginPath(); xs.forEach((x, i) => { const y = edgeY(x) - 11.0 + 0.35 * Math.sin(i * 0.9); i ? G.lineTo(x, y) : G.moveTo(x, y); }); G.strokeStyle = C.panel; G.lineWidth = lw(3); G.stroke(); }
    band(fx0, fx1, -7.4, -6.2); fillE(gph);
    /* the bridge, the trigger's own material, 10 mm wide; lighter where it thins; its crown dashed */
    band(fx0, fx1, -6.2, 0.6); fillE(lite);
    G.save(); band(fx0, fx1, -4.6, -1.0); G.clip(); G.fillStyle = 'rgba(255,255,255,0.10)'; G.fillRect(fx0 - 1, -20, 12, 30); G.restore();
    if (o.bend !== false) { const xs = run(fx0 + 0.6, fx1 - 0.6, 30); G.beginPath(); xs.forEach((x, i) => i ? G.lineTo(x, edgeY(x) - 2.8) : G.moveTo(x, edgeY(x) - 2.8)); G.setLineDash([lw(9), lw(6)]); G.strokeStyle = A; G.lineWidth = lw(2.2); G.stroke(); G.setLineDash([]); }
    /* the block behind the bend line and its one screw. Shipping today (built 1): a bigger block, a stacked boss on it and a
       grid of holes round the screw; Theseus (built 0): only the material the clamp needs */
    const by0 = 0.6, by1 = lerp(7.6, 9.2, bt), bx0 = lerp(fx0, hx - 6.6, bt), bx1 = lerp(fx1, hx + 6.6, bt);
    band(bx0, bx1, by0, by1); fillE(gph);
    const ys = edgeY(hx) + lerp(4.1, 5.4, bt);
    if (bt > 0.01) {
      G.save(); G.globalAlpha *= bt;
      pathRR(hx - 4.4, ys - 3.4, 8.8, 6.8, 0.5); G.strokeStyle = 'rgba(255,255,255,0.22)'; G.lineWidth = lw(1.2); G.stroke();
      for (const [dx, dy] of [[-5.4, -3.6], [5.4, -3.6], [-5.4, 3.6], [5.4, 3.6]]) { pathRR(hx + dx - 0.5, ys + dy - 0.5, 1.0, 1.0, 0.12); G.fillStyle = C.panel; G.fill(); G.strokeStyle = ed; G.lineWidth = lw(1); G.stroke(); }
      for (const dx of [-2.9, 2.9]) { G.beginPath(); G.arc(hx + dx, ys, 0.95, 0, TAU); G.fillStyle = C.panel; G.fill(); G.strokeStyle = ed; G.lineWidth = lw(1); G.stroke(); }
      G.restore();
    }
    G.beginPath(); G.arc(hx, ys, 1.75, 0, TAU); G.fillStyle = TH ? '#B8BEC6' : '#8E959E'; G.fill(); G.strokeStyle = inkA(0.45); G.lineWidth = lw(1); G.stroke();
    G.beginPath(); G.moveTo(hx - 0.9, ys); G.lineTo(hx + 0.9, ys); G.moveTo(hx, ys - 0.9); G.lineTo(hx, ys + 0.9); G.strokeStyle = inkA(0.55); G.lineWidth = lw(1.4); G.stroke();
    const M1 = XF.m.slice();
    out.arms.push({ hole: SP(hx, ys), block: SP(hx + s * (lerp(5, 6.6, bt) - 0.4), ys), stake: SP(hx, edgeY(hx) - 5.2), bendAt: x => SPm(M1, x, edgeY(x) - 2.8), slope: x => sm * 4.6 * 2 * x / Math.pow(w + gap / 2, 2), xl, xr, fx0, fx1, hx });
  }
  const M2 = XF.m.slice(); out.edge = x => SPm(M2, x, edgeY(x)); out.edgeY = edgeY; out.P = (x, y) => SPm(M2, x, y);
  return out;
}

/* =================================== 13. one button, from above ===================================
   a deliberately generic button: straight rear edge on the cutout, straight inner edge on the split,
   a soft outer curve and a rounded front. it stands in for any button; it is not the shape.
   hidden posts underneath are dashed. */
function plateMM(o = {}) {
  const A = o.accent || acc(), w = o.w || 26, l = o.l || 56, out = {};
  const outline = () => { G.beginPath(); G.moveTo(0, 0); G.lineTo(w, 0); G.bezierCurveTo(w + 1.6, -l * 0.3, w + 1.4, -l * 0.66, w - 1.2, -l * 0.9); G.bezierCurveTo(w - 3.4, -l * 1.0, w * 0.45, -l * 1.02, 0, -l * 0.99); G.closePath(); };
  solid(outline, { g: ['#3b3c42', '#2a2b30'], dark: 1 }, [0, -l, w, l], { lw: 1.3 });
  G.save(); outline(); G.clip(); const r = rng(5); G.fillStyle = 'rgba(255,255,255,0.04)'; for (let i = 0; i < 900; i++) G.fillRect(r() * (w + 2), -l * 1.02 + r() * l * 1.02, 0.12, 0.12); G.restore();
  G.setLineDash([lw(6), lw(4)]); G.strokeStyle = inkA(0.45); G.lineWidth = lw(1.2);
  pathRR(w * 0.5 - 4, -3.6, 8, 2.4, 0.4); G.stroke();
  pathRR(w * 0.48 - 1.1, -l * 0.54 - 1.1, 2.2, 2.2, 0.4); G.stroke();
  G.setLineDash([]);
  out.hinge = SP(w * 0.5, -2.4); out.p1 = SP(w * 0.48, -l * 0.54); out.p2 = SP(w * 0.84, -l * 0.84); out.edgePress = SP(w * 0.97, -l * 0.6); out.rear = SP(w * 0.5, 0); out.front = SP(w * 0.5, -l);
  { const M3 = XF.m.slice(); out.P = (x, y) => SPm(M3, x, y); } out.w = w; out.l = l;
  return out;
}

/* =================================== 14. the front stop, in section ===================================
   the trigger's front lip over a ledge in the shell's nose. both faces of the front cutout are flat and
   parallel to the ground, so the gap between them is the post-travel, and the mold tunes it by cutting one
   flat face. generic curvature, break lines where the parts continue. */
function frontStopMM(o = {}) {
  const press = clamp(o.press || 0), A = o.accent || acc(), gap = o.gap == null ? 0.8 : o.gap, tr = press * gap, out = {};
  const top = x => -4.4 + 0.03 * (x + 12) + 0.00253 * (x + 12) * (x + 12);   /* a soft, generic crown falling to the front */
  /* the nose: a ledge whose top is the stop face, and the front wall curving down */
  solid(() => { G.beginPath(); G.moveTo(6.4, 0); G.lineTo(10.2, 0); G.bezierCurveTo(11.8, 0, 12.7, 1.6, 12.8, 3.6); G.lineTo(12.9, 6.4); brk(12.9, 6.4, 6.4, 0); G.lineTo(11.7, 6.4); G.lineTo(11.6, 3.8); G.bezierCurveTo(11.5, 2.3, 11.0, 1.2, 10.2, 1.2); G.lineTo(7.0, 1.2); G.quadraticCurveTo(6.4, 1.2, 6.4, 0.6); G.closePath(); }, MT.shell, [6.4, 0, 6.5, 6.4], { hatch: true });
  /* the trigger: a 1.2 mm shell with a lip turned down onto the ledge */
  xsave(); xmove(0, tr);
  const ub = x => top(x) + 1.2, xl = 9.0;
  solid(() => {
    G.beginPath(); G.moveTo(-12, top(-12)); for (let x = -12; x <= 9.4; x += 0.4) G.lineTo(x, top(x));
    G.bezierCurveTo(10.5, top(9.4) + 0.25, 11.4, top(9.4) + 1.0, 11.4, -gap - 0.5); G.quadraticCurveTo(11.4, -gap, 10.9, -gap);
    G.lineTo(xl, -gap); G.lineTo(xl, ub(xl) + 0.6); G.quadraticCurveTo(xl, ub(xl), xl - 0.6, ub(xl - 0.6));
    for (let x = xl - 0.6; x >= -12; x -= 0.4) G.lineTo(x, ub(x)); brk(-12, ub(-12), top(-12), 0.35); G.closePath();
  }, MT.shell, [-12, -6, 24, 6], { hatch: true });
  { const pts = []; for (let x = -11.6; x <= 9.2; x += 0.5) pts.push([x, top(x) + 0.06]); mmLine(pts, 'rgba(255,255,255,0.22)', 1); }
  out.trig = SP(0, top(0)); out.face = SP(10, -gap); out.lip = SP(11.4, -gap - 1.2);
  xrest();
  out.stop = SP(8.2, 0); out.gapMid = SP(10, (-gap + tr) / 2); out.tr = tr; out.nose = SP(12.7, 3.6);
  if (o.gapMark > 0 && gap - tr > 0.05) { xsave(); ga(o.gapMark); mmLine([[xl - 3.2, -gap + tr], [xl, -gap + tr]], A, 1.4); mmLine([[xl - 3.2, 0], [6.4, 0]], A, 1.4); mmLine([[xl - 2.4, -gap + tr], [xl - 2.4, 0]], A, 1.4); xrest(); out.dimAt = SP(xl - 2.4, (-gap + tr) / 2); }
  return out;
}
/** a button's outer edge beside the side wall, cut across and seen from the front. when flush, the wall's
    top sits at the height the button reaches when pressed */
function flushMM(o = {}) {
  const press = clamp(o.press || 0), tr = press * 0.8, flush = o.flush == null ? 1 : o.flush, out = {}, A = o.accent || acc();
  const crown = x => -2.0 + 0.02 * (x + 4) * (x + 4) * 0.5;                  /* generic: the button's top falling off toward its edge */
  const edgeX = 6.6, gapX = 0.5, pressedTop = crown(edgeX) + 0.8;
  const wallTop = lerp(pressedTop - 1.0, pressedTop, flush);
  /* the side wall: a 1.2 mm shell curving down and out */
  solid(() => { G.beginPath(); G.moveTo(edgeX + gapX, wallTop + 0.3); G.quadraticCurveTo(edgeX + gapX, wallTop, edgeX + gapX + 0.4, wallTop); G.bezierCurveTo(edgeX + 2.6, wallTop, edgeX + 4.6, wallTop + 1.4, edgeX + 5.2, wallTop + 4.6); G.lineTo(edgeX + 5.4, wallTop + 7); brk(edgeX + 5.4, wallTop + 7, wallTop + 7, 0); G.lineTo(edgeX + 4.2, wallTop + 7); G.lineTo(edgeX + 4.0, wallTop + 4.8); G.bezierCurveTo(edgeX + 3.6, wallTop + 2.4, edgeX + 2.2, wallTop + 1.2, edgeX + gapX + 0.6, wallTop + 1.2); G.lineTo(edgeX + gapX, wallTop + 1.2); G.closePath(); }, MT.shell, [edgeX, wallTop, 6, 7], { hatch: true });
  xsave(); xmove(0, tr);
  solid(() => { G.beginPath(); G.moveTo(-10, crown(-10)); for (let x = -10; x <= edgeX - 0.5; x += 0.3) G.lineTo(x, crown(x)); G.quadraticCurveTo(edgeX, crown(edgeX - 0.5) + 0.05, edgeX, crown(edgeX) + 0.6); G.lineTo(edgeX, crown(edgeX) + 1.2); for (let x = edgeX; x >= -10; x -= 0.3) G.lineTo(x, crown(x) + 1.2); brk(-10, crown(-10) + 1.2, crown(-10), 0.3); G.closePath(); }, MT.shell, [-10, -3, 17, 4], { hatch: true });
  { const pts = []; for (let x = -9.6; x <= edgeX - 0.6; x += 0.4) pts.push([x, crown(x) + 0.06]); mmLine(pts, 'rgba(255,255,255,0.22)', 1); }
  out.edge = SP(edgeX - 0.3, crown(edgeX));
  xrest();
  out.wall = SP(edgeX + gapX + 1.2, wallTop); out.step = SP(edgeX + gapX / 2, (crown(edgeX) + tr + wallTop) / 2); out.flushNow = Math.abs(crown(edgeX) + tr - wallTop) < 0.15;
  if (o.ref > 0) { xsave(); ga(o.ref); mmLine([[edgeX - 6, wallTop], [edgeX + 3.6, wallTop]], A, 1.4, { dash: [6, 5] }); xrest(); }
  return out;
}
/** the plunger guide, cut across: guide walls with POM pads, the trigger's plunger post between them,
    hollowed on the side toward the user, the switch plunger below */
function guideMM(o = {}) {
  const press = clamp(o.press || 0), tr = press * 0.6, pk = o.pads == null ? 1 : o.pads, hk = o.hollow || 0, A = o.accent || acc(), out = {};
  for (const s of [-1, 1]) solid(() => { G.beginPath(); G.moveTo(s * 2.65, -4.2); G.lineTo(s * 5.6, -4.2); brk(s * 5.6, -4.2, 3.4, 0.3 * s); G.lineTo(s * 2.65, 3.4); G.closePath(); }, MT.shell, [Math.min(s * 2.65, s * 5.6), -4.2, 2.95, 7.6], { hatch: true });
  if (pk > 0) for (const s of [-1, 1]) { const w = 0.7 * pk; solid(() => { G.beginPath(); G.rect(s > 0 ? 2.65 - w : -2.65, -3.4, w, 6.0); }, MT.pom, [s > 0 ? 2.65 - w : -2.65, -3.4, w, 6], { hatch: { sp: 5 }, lw: 0.8 }); }
  /* switch below: its top and plunger */
  solid(() => { G.beginPath(); G.moveTo(-4.2, 5.4); G.lineTo(4.2, 5.4); G.lineTo(4.2, 8.2); brk(4.2, 8.2, 8.2, 0); G.lineTo(-4.2, 8.2); G.closePath(); }, MT.black, [-4.2, 5.4, 8.4, 2.8], {});
  solid(() => { G.beginPath(); G.moveTo(-0.75, 5.4); G.lineTo(-0.75, 4.92 + tr); G.quadraticCurveTo(-0.75, 4.55 + tr, -0.38, 4.55 + tr); G.lineTo(0.38, 4.55 + tr); G.quadraticCurveTo(0.75, 4.55 + tr, 0.75, 4.92 + tr); G.lineTo(0.75, 5.4); G.closePath(); }, MT.pom, [-0.75, 4.55, 1.5, 0.85], { lw: 0.9 });
  /* the post, moving with the press */
  xsave(); xmove(0, tr);
  const half = 2.65 - 0.7 * pk - 0.08;
  solid(() => { G.beginPath(); G.moveTo(-half, -5.2); G.lineTo(half, -5.2); G.lineTo(half, 3.9); G.quadraticCurveTo(half, 4.55, half - 0.65, 4.55); G.lineTo(-half + 0.65, 4.55); G.quadraticCurveTo(-half, 4.55, -half, 3.9); G.closePath(); }, MT.shell, [-half, -5.2, 2 * half, 9.75], { hatch: true });
  if (hk > 0) { G.beginPath(); pathRR(-half * 0.55, -3.2, half * 1.1, 6.2 * hk, 0.5); G.fillStyle = C.panel; G.fill(); G.strokeStyle = edgeCol(MT.shell); G.lineWidth = lw(1); G.stroke(); }
  out.post = SP(0, -4.2); out.cavity = SP(0, -0.1);
  xrest();
  out.pad = SP(-2.65 + 0.35 * pk, -1.0); out.padR = SP(2.65 - 0.35 * pk, -1.0); out.wall = SP(-4.4, 1.8); out.plunger = SP(0.75, 4.9 + tr); out.sw = SP(4.2, 6.8);
  return out;
}
/** the wheel's optical encoder, front-on, drawn as TTC's (a normal encoder's black housing in a stamped steel frame,
   the axle bushing in its face, two bent legs and a row of pins), a little taller than their photo. Origin: the axle.
   o = { clog (0..1: dust in the bushing and the frame's gaps) }. Returns { top, bush, left, right, base } in stage px.
   (Brock, F9.21: "optical encoders look no different than normal mouse encoders". From Shell A's shlEncoderMM.) */
function encoderMM(o = {}) {
  /* the scroll encoder is magnetic now (Brock, F27: "a magnetic encoder that doesn't get affected by dust and have a
     transparent top housing to see when it's broken like switches"; "Yes, switch everywhere"): see k2_encMagFront */
  return k2_encMagFront(o);
}
/* =================================== 16. a fingertip on a surface, magnified section ===================================
   units are not to scale with the parts above: 60 across is about a millimetre of skin. o.etch: a laser-etched
   texture in the film; o.wet: sweat. on a smooth film the sweat spreads into a layer the skin floats on; on an
   etched film it drains into the pits and the ridges meet the peaks. */
function gripMM(o = {}) {
  const etch = o.etch || 0, wet = o.wet || 0, A = o.accent || acc(), wdt = 60, out = {};
  const pit = x => etch * 1.3 * Math.pow(Math.max(0, Math.sin(x * 1.2)), 6);
  const surf = x => pit(x);
  /* film and substrate */
  solid(() => { G.beginPath(); G.moveTo(0, surf(0)); for (let x = 0; x <= wdt; x += 0.1) G.lineTo(x, surf(x)); G.lineTo(wdt, 3.4); G.lineTo(0, 3.4); G.closePath(); }, { g: ['#4a4b52', '#34353b'], dark: 1 }, [0, 0, wdt, 3.4], { lw: 1.1 });
  solid(() => { G.beginPath(); G.moveTo(0, 3.4); G.lineTo(wdt, 3.4); G.lineTo(wdt, 9); G.bezierCurveTo(wdt * 0.66, 9.5, wdt * 0.33, 8.5, 0, 9); G.closePath(); }, MT.shell, [0, 3.4, wdt, 5.6], { hatch: true });
  /* sweat */
  if (wet > 0) {
    G.save(); G.globalAlpha = PA * wet;
    if (etch > 0.5) { G.beginPath(); G.moveTo(0, 0); for (let x = 0; x <= wdt; x += 0.1) G.lineTo(x, Math.max(0.05, surf(x))); G.lineTo(wdt, 0.05); G.closePath(); G.fillStyle = 'rgba(110,170,230,0.75)'; G.fill(); }
    else { G.fillStyle = 'rgba(110,170,230,0.7)'; G.fillRect(0, -0.9, wdt, 0.9); }
    G.restore();
  }
  /* skin: papillary ridges on the underside, epidermis above */
  const lift = etch > 0.5 ? 0 : wet * 0.9;
  const skinB = x => -lift - 0.05 - 0.55 * (1 + Math.cos(x / 2.6 * TAU)) / 2;
  const skin = () => { G.beginPath(); G.moveTo(0, skinB(0)); for (let x = 0; x <= wdt; x += 0.1) G.lineTo(x, skinB(x)); G.lineTo(wdt, -9); G.bezierCurveTo(wdt * 0.66, -9.4, wdt * 0.33, -8.6, 0, -9); G.closePath(); };
  /* skin in a single grey, never a peach tone (Brock: skin tones always monotone) */
  solid(skin, { g: TH ? ['#C9C8C2', '#B3B2AC'] : ['#6A6964', '#55554F'] }, [0, -9, wdt, 9], { lw: 1.1, ec: TH ? 'rgba(40,40,38,0.6)' : 'rgba(230,230,225,0.45)' });
  G.save(); skin(); G.clip(); G.strokeStyle = TH ? 'rgba(40,40,38,0.3)' : 'rgba(230,230,225,0.25)'; G.lineWidth = lw(1); G.beginPath(); for (let x = 0; x <= wdt; x += 0.1) G.lineTo(x, skinB(x) - 1.6 - 0.3 * Math.sin(x * 0.7)); G.stroke(); G.restore();
  out.skin = SP(wdt * 0.5, -5); out.film = SP(wdt * 0.8, 1.6); out.sweat = SP(wdt * 0.35, etch > 0.5 ? 0.5 : -0.45); out.peak = SP(Math.PI / 1.2 * 2.5, 0);
  return out;
}
/* =================================== 17. a charging cable, cut across ===================================
   a paracord sheath over braided conductors: VBUS, ground, the two data lines, each a bundle of strands. */
function cableMM(o = {}) {
  /* a paracord-sheathed USB cable cut across, mm: the woven sheath (two layers of strands, two-tone, as the slide's braid),
     soft nylon filler, four conductors of seven copper strands each (VBUS red, GND black, D+ green, D- white) */
  const out = {}, R = 1.2, n = 32, c1 = o.c1 || '#2C3340', c2 = o.c2 || '#9AA4B2';
  G.beginPath(); G.arc(0, 0, R, 0, TAU); G.fillStyle = '#15171B'; G.fill();
  for (let layer = 0; layer < 2; layer++) for (let i = 0; i < n; i++) {
    const a = (i + layer * 0.5) / n * TAU, rr0 = R - 0.13 - layer * 0.11, x = Math.cos(a) * rr0, y = Math.sin(a) * rr0;
    G.beginPath(); G.ellipse(x, y, 0.15, 0.085, a + Math.PI / 2 + (layer ? 0.5 : -0.5), 0, TAU);
    G.fillStyle = ((i >> 1) + layer) % 2 ? c1 : c2; G.fill(); G.strokeStyle = 'rgba(0,0,0,0.45)'; G.lineWidth = lw(0.6); G.stroke();
  }
  G.beginPath(); G.arc(0, 0, R - 0.36, 0, TAU); G.fillStyle = '#E6E2D8'; G.fill(); G.strokeStyle = 'rgba(0,0,0,0.3)'; G.lineWidth = lw(1); G.stroke();
  const r2 = rng(4); G.strokeStyle = 'rgba(120,112,98,0.35)'; G.lineWidth = lw(0.5);
  for (let i = 0; i < 90; i++) { const a = r2() * TAU, rr0 = Math.sqrt(r2()) * (R - 0.42), b = r2() * TAU; G.beginPath(); G.moveTo(Math.cos(a) * rr0, Math.sin(a) * rr0); G.lineTo(Math.cos(a) * rr0 + Math.cos(b) * 0.08, Math.sin(a) * rr0 + Math.sin(b) * 0.08); G.stroke(); }
  const cond = [[-0.3, -0.3, '#c8463d'], [0.3, -0.3, '#26272b'], [-0.3, 0.3, '#3f8f4e'], [0.3, 0.3, '#f2f2f2']];
  for (const [x, y, c] of cond) {
    G.beginPath(); G.arc(x, y, 0.27, 0, TAU); G.fillStyle = c; G.fill(); G.strokeStyle = 'rgba(0,0,0,0.45)'; G.lineWidth = lw(0.9); G.stroke();
    for (let k = 0; k < 7; k++) { const a = k / 6 * TAU, rr0 = k === 6 ? 0 : 0.085; G.beginPath(); G.arc(x + Math.cos(a) * rr0, y + Math.sin(a) * rr0, 0.042, 0, TAU); G.fillStyle = '#d99a5c'; G.fill(); }
  }
  G.beginPath(); G.arc(0, 0, R, 0, TAU); G.strokeStyle = edgeCol(MT.black); G.lineWidth = lw(1.2); G.stroke();
  out.sheath = SP(R * 0.72, -R * 0.72); out.core = SP(0.3, 0.3); out.fill = SP(-0.62, 0.35); out.r = R;
  return out;
}
/** a QFN chip from above, small, with its label: for block diagrams */
function chipMM(o = {}) {
  const w = o.w || 6, hw = w / 2, A = o.accent || acc();
  G.fillStyle = '#d9b25a'; for (let k = 0; k < 10; k++) { const t2 = -hw + 0.5 + k * (w - 1) / 9; G.fillRect(t2 - 0.12, -hw - 0.5, 0.24, 0.45); G.fillRect(t2 - 0.12, hw + 0.05, 0.24, 0.45); G.fillRect(-hw - 0.5, t2 - 0.12, 0.45, 0.24); G.fillRect(hw + 0.05, t2 - 0.12, 0.45, 0.24); }
  pathRR(-hw, -hw, w, w, 0.3); G.fillStyle = o.hi ? A : grad(MT.epoxy, 0, -hw, 0, hw); G.fill(); G.strokeStyle = 'rgba(255,255,255,0.14)'; G.lineWidth = lw(1); G.stroke();
  G.beginPath(); G.arc(-hw + 0.7, -hw + 0.7, 0.26, 0, TAU); G.fillStyle = 'rgba(255,255,255,0.3)'; G.fill();
  if (o.label) { G.save(); G.translate(0, 0.35); G.scale(w / 220, w / 220); setFont({ size: 26, weight: 700 }); G.fillStyle = o.hi ? '#0d0e0f' : 'rgba(255,255,255,0.55)'; G.textAlign = 'center'; G.fillText(o.label, 0, 0); G.restore(); }
  return {};
}

/* =================================== 18. key plan: where on the mouse a drawing is taken ===================================
   the top view of a Ninjutso Sora V2, simplified: the symmetric outline traced from Brock's scan (refs/derived/sora_top_outline.json),
   the scan's mid-length notches smoothed away, resampled to 56 points per half. Note the front: a broad, nearly straight arc
   with tight shoulders, then straight sides to a round tail. Front up, mm, x right; y = -z (the scan's +z is forward).
   Seams as fine lines: the centre split, a straight rear trigger seam (idea #17) and the wheel slot.
   o.hi names what to highlight; o.cut draws the section line; o.detail circles a detail. */
const SORA_HALF = [[0,59.44],[2.84,59.29],[5.66,58.88],[8.45,58.34],[11.22,57.69],[13.97,56.95],[16.68,56.07],[19.32,55.01],[21.86,53.73],[24.21,52.13],[26.23,50.13],[27.78,47.75],[28.77,45.08],[29.34,42.3],[29.67,39.47],[29.88,36.63],[30.02,33.79],[30.1,30.94],[30.16,28.09],[30.2,25.25],[30.29,22.4],[30.44,19.56],[30.51,16.71],[30.52,13.87],[30.5,11.02],[30.5,8.17],[30.5,5.33],[30.49,2.48],[30.49,-0.37],[30.49,-3.21],[30.5,-6.06],[30.54,-8.91],[30.67,-11.75],[30.83,-14.59],[30.97,-17.43],[31.1,-20.28],[31.18,-23.12],[31.19,-25.97],[31.11,-28.82],[30.86,-31.65],[30.41,-34.46],[29.72,-37.22],[28.79,-39.91],[27.63,-42.51],[26.22,-44.98],[24.59,-47.32],[22.76,-49.49],[20.74,-51.5],[18.56,-53.32],[16.21,-54.94],[13.73,-56.33],[11.13,-57.48],[8.43,-58.39],[5.66,-59.04],[2.84,-59.42],[0,-59.55]];
const KEY_PTS = SORA_HALF.map(([x, z]) => [x, -z]).concat(SORA_HALF.slice(1, -1).reverse().map(([x, z]) => [-x, -z]));
const KEY = { seam: -4.84, wheel: [-4.7, -46.4, 9.4, 18], nose: -59.44, tail: 59.55 };   /* seam: the straight rear cutout, level with the Sora smile's deepest point (Brock, F12.9; the 3D shell, shell z 4.84);
   wheel: the 3D shell's wheel opening (wheelOpen: half-width 4.7, z 28.4 to 46.4; key-plan y = -z) */
function keyPath() {
  const P = KEY_PTS, n = P.length; G.beginPath();
  G.moveTo((P[n - 1][0] + P[0][0]) / 2, (P[n - 1][1] + P[0][1]) / 2);
  for (let i = 0; i < n; i++) { const p = P[i], q = P[(i + 1) % n]; G.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
  G.closePath();
}
/** half-width of the outline at y (mm), for placing things on the rim */
function keyHalfW(y) { let best = 0; for (let i = 1; i < SORA_HALF.length; i++) { const [x0, z0] = SORA_HALF[i - 1], [x1, z1] = SORA_HALF[i]; const a = -z0, b = -z1; if ((y - a) * (y - b) <= 0 && a !== b) best = Math.max(best, x0 + (x1 - x0) * (y - a) / (b - a)); } return best; }
function keyPlanMM(o = {}) {
  const A = o.accent || acc(), hi = o.hi || [], H = Array.isArray(hi) ? hi : [hi], out = {}, sy = KEY.seam;
  keyPath(); G.fillStyle = o.fill || inkA(TH ? 0.06 : 0.07); G.fill();
  const hiFill = f => { G.save(); keyPath(); G.clip(); G.fillStyle = rgba(A, 0.4); f(); G.restore(); };
  if (H.includes('shell')) hiFill(() => G.fillRect(-40, -70, 80, 140));
  if (H.includes('trigL')) hiFill(() => G.fillRect(-40, -70, 39.6, 70 + sy));
  if (H.includes('trigR')) hiFill(() => G.fillRect(0.4, -70, 39.6, 70 + sy));
  if (H.includes('rear')) hiFill(() => G.fillRect(-40, sy - 1.1, 80, 2.2));
  if (H.includes('sides')) hiFill(() => { G.fillRect(-40, -22, 15, 72); G.fillRect(25, -22, 15, 72); });
  if (H.includes('hump')) hiFill(() => { G.beginPath(); G.ellipse(0, 20, 16, 22, 0, 0, TAU); G.fill(); });
  keyPath(); G.strokeStyle = H.includes('rim') ? A : inkA(TH ? 0.7 : 0.62); G.lineWidth = lw(H.includes('rim') ? 2.6 : 1.6); G.lineJoin = 'round'; G.stroke();
  /* seams, as on the Sora: one centre split from the nose to the straight rear trigger seam. It does not fork round the
     wheel and there is no centre strip (Brock, 07:35): the wheel sits in the split, drawn as the wheel itself, no slot */
  const seam = inkA(TH ? 0.5 : 0.45), hw = keyHalfW(sy);
  mmLine([[0, KEY.nose + 0.4], [0, sy]], seam, 1.1); mmLine([[-hw + 0.3, sy], [hw - 0.3, sy]], seam, 1.1);
  /* the wheel as the 3D model has it: 7.0 mm wide, seen through its opening (1 mm short of each end) */
  const [wx, wy, ww, wh] = KEY.wheel, wcx = wx + ww / 2, wwid = Math.min(7.0, ww - 1.2), wl = wh - 2;
  G.save(); G.beginPath(); pathRR(wcx - wwid / 2, wy + 1, wwid, wl, wwid / 2); G.fillStyle = H.includes('wheel') ? A : (TH ? '#CFCEC9' : '#3A3B3F'); G.fill();
  if (!H.includes('wheel')) { G.clip(); for (let k = 0; k < 7; k++) { const ry = wy + 1 + (k + 0.5) * wl / 7; mmLine([[wcx - wwid / 2, ry], [wcx + wwid / 2, ry]], inkA(0.28), 0.8); } }
  G.restore();
  /* side buttons, on the left */
  for (const [y0, y1] of [[-23.5, -10.7], [-4.3, 9.7]]) { const x0 = -keyHalfW((y0 + y1) / 2); G.beginPath(); pathRR(x0 - 1.6, y0, 3.2, y1 - y0, 1.4); G.fillStyle = H.includes('side') ? A : inkA(TH ? 0.32 : 0.36); G.fill(); }
  /* hidden features underneath, dashed */
  G.setLineDash([lw(3), lw(2.5)]); G.lineWidth = lw(1.1);
  const dash = (on, f) => { G.strokeStyle = on ? A : inkA(0.3); G.fillStyle = rgba(A, 0.5); f(on); };
  /* the board where the 3D model has it (3d/pcb/pcb-layout.json: x +/-19.3, mouse z -7.9 to 49.6, the encoder under the wheel) */
  dash(H.includes('board'), on => { pathRR(-19.3, -49.6, 38.6, 57.5, 3); if (on) G.fill(); G.stroke(); });
  /* the radio's antenna keep-out, as the 3D board has it: the module turned 180 degrees, its antenna end toward the rear,
     away from the wheel (Brock, F9.13; board keep-out at mouse z 10.87 to 14.57, x +/-6.6) */
  dash(H.includes('antenna'), on => { G.beginPath(); G.rect(-6.6, -14.57, 13.2, 3.7); if (on) G.fill(); G.stroke(); });
  /* the sensor's lens under the 3D shell's lens window (shell meta.sensor: x 0, z 0) */
  dash(H.includes('sensor'), on => { G.beginPath(); G.arc(0, 0, 3.6, 0, TAU); if (on) G.fill(); G.stroke(); });
  /* the plate-off dot skates on the rim's ledge, where the 3D shell seats them (meta.skates, 6.5 mm dots) */
  dash(H.includes('skates'), on => { for (const [x, y] of [[-13.7,-47.3],[-20.0,-42.4],[-17.2,43.2],[-10.8,47.9],[19.9,-42.5],[13.5,-47.4],[11.1,47.8],[17.4,42.9]]) { G.beginPath(); G.arc(x, y, 3.25, 0, TAU); if (on) G.fill(); G.stroke(); } });
  /* the battery where the 3D model's balance puts it: in the tail behind the board, at board height, 35 mm across and
     25 mm along (the example LP402535JU), so the centre of mass lands under the sensor at the 12 mm grip */
  dash(H.includes('battery'), on => { pathRR(-17.09, 10.22, 35, 25, 2); if (on) G.fill(); G.stroke(); });
  G.setLineDash([]);
  /* the cut */
  if (o.cut) {
    const c = o.cut, a = o.cutA == null ? 1 : o.cutA; xsave(); ga(a);
    const L = c.type === 'long' ? [[c.x, -70], [c.x, 70]] : [[-38, c.y], [38, c.y]];
    G.setLineDash([lw(10), lw(3), lw(2), lw(3)]); mmLine(L, A, 1.8); G.setLineDash([]);
    for (const [px, py] of L) {
      const dx = c.type === 'long' ? -1 : 0, dy = c.type === 'long' ? 0 : 1;
      mmLine([[px, py], [px + dx * 7, py + dy * 7]], A, 1.8);
      G.beginPath(); G.moveTo(px + dx * 10, py + dy * 10); G.lineTo(px + dx * 6.5 - dy * 2.2, py + dy * 6.5 + dx * 2.2); G.lineTo(px + dx * 6.5 + dy * 2.2, py + dy * 6.5 - dx * 2.2); G.closePath(); G.fillStyle = A; G.fill();
      G.save(); G.translate(px + dx * 15, py + dy * 16 + (c.type === 'long' ? 3 : 4)); G.scale(mmpx(), mmpx()); setFont({ font: 'mono', size: 20, weight: 700 }); G.fillStyle = A; G.textAlign = 'center'; G.fillText(c.label || 'A', 0, 0); G.restore();
    }
    xrest();
  }
  if (o.detail) { const d = o.detail; G.setLineDash([lw(5), lw(3)]); G.beginPath(); G.arc(d.x, d.y, d.r, 0, TAU); G.strokeStyle = A; G.lineWidth = lw(1.8); G.stroke(); G.setLineDash([]); out.detail = SP(d.x + d.r * 0.7, d.y - d.r * 0.7); }
  return out;
}
/** place a key plan: the top-view icon (scaled up a little from the old film's), and a mono label under it */
function keyPlan(t, t0, x, y, o = {}) {
  const k = ep(t, t0, t0 + 0.5); if (k <= 0) return {};
  const s = (o.s || 1.1) * 1.18;
  const r = part(x, y, s, () => keyPlanMM(o), { alpha: k });
  text(o.label || 'where', x, y + 60 * s + 30, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: k });
  return r;
}
/** K2 (2026-11-05): the magnetic scroll encoder from the wheel side, its frame plate cut away, as 3d/parts/scrollwheel.js
   builds it: a normal encoder outline (axle at 0, 0; the board at y = 11; top 4 mm above the axle, the nose-side corner
   chamfered), a black bottom housing up to the split 3.15 mm below the axle, a clear PC top housing over the moving
   parts: the orange POM rotor on the axle's D, the 24-lobe detent star under its bronze leaf spring, and on the rotor's
   end the Ø3 mm diametric magnet (north and south halves) in front of the dark sensor board, four pins, the frame's legs.
   o.th: the wheel angle; o.field (0..1): the magnet's field lines in the drawing plane, turning with it; o.dust (0..1):
   specks inside the housing (they change nothing); o.light: the paper theme. Returns anchors in stage px. */
function k2_encMagFront(o = {}) {
  const th = o.th || 0, out = {}, N = 24, dk = o.light ? 0 : 1;
  const nick = dk ? '#C3C8CF' : '#A9AFB7', tin = dk ? '#B4B9C0' : '#9AA0A8', black = dk ? '#232428' : '#1C1D20';
  const ec = dk ? 'rgba(10,10,12,0.85)' : 'rgba(20,20,22,0.55)', clearF = dk ? 'rgba(196,214,230,0.13)' : 'rgba(150,170,190,0.16)';
  const clearE = dk ? 'rgba(226,236,246,0.62)' : 'rgba(60,80,100,0.55)';
  const fp = (f, col, st, w) => { f(); if (col) { G.fillStyle = col; G.fill('evenodd'); } if (st) { G.strokeStyle = st; G.lineWidth = lw(w || 1.1); G.lineJoin = 'round'; G.stroke(); } };
  /* four pins and the frame's two bent legs into the board */
  for (const px of [-1.875, -0.625, 0.625, 1.875]) fp(() => { G.beginPath(); G.rect(px - 0.25, 10.9, 0.5, 2.3); }, tin, ec, 0.8);
  for (const sx of [-1, 1]) fp(() => { G.beginPath(); G.moveTo(sx * 4.3, 10.8); G.lineTo(sx * 5.45, 10.8); G.lineTo(sx * 5.45, 11.6); G.quadraticCurveTo(sx * 5.6, 12.7, sx * 6.45, 13.0); G.lineTo(sx * 6.15, 13.45); G.quadraticCurveTo(sx * 4.75, 13.0, sx * 4.3, 11.7); G.closePath(); }, nick, ec, 0.8);
  /* the sensor board behind everything: a dark plate across the housing's far end, the Hall IC on it, on the axis */
  fp(() => pathRR(-3.7, -3.2, 7.4, 9.6, 0.3), dk ? '#101114' : '#141518', null);
  /* the black bottom housing, from the board up to the split */
  fp(() => { G.beginPath(); G.moveTo(-5.5, 3.15); G.lineTo(5.5, 3.15); G.lineTo(5.5, 10.75); G.quadraticCurveTo(5.5, 11, 5.25, 11); G.lineTo(-5.25, 11); G.quadraticCurveTo(-5.5, 11, -5.5, 10.75); G.closePath(); }, black, ec, 1.1);
  /* the rotor: the orange POM hub, the detent star round it, the D bore */
  const star = () => { G.beginPath(); for (let i = 0; i <= N * 12; i++) { const a = th + i / (N * 12) * TAU, f = ((a - th) * N / TAU % 1 + 1) % 1, r = 2.18 + 0.37 * Math.pow(Math.sin(Math.PI * f), 0.6); i ? G.lineTo(r * Math.cos(a), r * Math.sin(a)) : G.moveTo(r * Math.cos(a), r * Math.sin(a)); } G.closePath(); G.moveTo(1.65, 0); G.arc(0, 0, 1.65, 0, TAU, true); };
  fp(star, dk ? '#2C2D31' : '#26272B', ec, 0.9);
  fp(() => { G.beginPath(); G.arc(0, 0, 1.65, 0, TAU); }, '#D9813C', ec, 0.9);
  /* the magnet on the rotor's end: north and south halves of a diametric disc, turning with the wheel */
  const halves = [[th, dk ? '#D8DBE0' : '#C9CCD2', 'N'], [th + Math.PI, dk ? '#8E939B' : '#7D828A', 'S']];
  for (const [a0, col] of halves) fp(() => { G.beginPath(); G.moveTo(0, 0); G.arc(0, 0, 1.5, a0 - Math.PI / 2, a0 + Math.PI / 2); G.closePath(); }, col, ec, 0.8);
  /* the leaf spring over the star: bronze, its bump in a valley at the top */
  G.beginPath(); for (let i = 0; i <= 30; i++) { const z = -3.3 + 6.6 * i / 30, bump = Math.exp(-(z * z) / 0.12) * 0.22; const y = -(2.55 + 0.14 + 0.34 * Math.pow(2 * i / 30 - 1, 2) - bump); i ? G.lineTo(z, y) : G.moveTo(z, y); }
  G.strokeStyle = '#C08F4E'; G.lineWidth = lw(3.2); G.lineCap = 'round'; G.stroke();
  /* dust that got in: it sits there and changes nothing (the field passes it) */
  const dust = o.dust || 0;
  if (dust > 0) { const r = rng(31); for (let i = 0; i < Math.round(22 * dust); i++) { const x = -4.6 + 9.2 * r(), y = -3.5 + 6.4 * r(); if (x * x + y * y < 6.9) continue; G.beginPath(); G.arc(x, y, 0.1 + 0.12 * r(), 0, TAU); G.fillStyle = dk ? 'rgba(170,160,140,0.85)' : 'rgba(110,100,85,0.85)'; G.fill(); } }
  /* the field: dipole loops out of the north half and round into the south, in the drawing plane */
  const kf = o.field || 0;
  if (kf > 0.003) {
    G.save(); G.globalAlpha *= kf; G.strokeStyle = C.hero; G.lineWidth = lw(2.2); G.lineCap = 'round';
    const ux = Math.cos(th), uy = Math.sin(th);
    for (const k of [1.6, 2.4, 3.4]) for (const sd of [1, -1]) {
      G.beginPath();
      for (let i = 0; i <= 40; i++) { const t = Math.PI * (0.04 + 0.92 * i / 40), rr0 = k * Math.sin(t) * Math.sin(t), px = rr0 * Math.cos(t), py = sd * rr0 * Math.sin(t);
        const X = px * ux - py * uy, Y = px * uy + py * ux; i ? G.lineTo(X, Y) : G.moveTo(X, Y); }
      G.stroke();
    }
    G.restore();
  }
  /* the clear top housing over all of it, from the split to the top, its nose-side corner chamfered; nickel tabs on top */
  fp(() => { G.beginPath(); G.moveTo(-5.5, 3.15); G.lineTo(-5.5, -3.75); G.quadraticCurveTo(-5.5, -4.0, -5.25, -4.0); G.lineTo(2.9, -4.0); G.lineTo(5.5, -1.4); G.lineTo(5.5, 3.15); G.closePath(); }, clearF, clearE, 1.3);
  fp(() => { G.beginPath(); G.moveTo(-5.2, 2.95); G.lineTo(-5.2, -3.55); G.lineTo(2.75, -3.7); }, null, dk ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.4)', 1.0);
  for (const [x0, x1] of [[2.0, 3.6], [-1.9, -0.6]]) fp(() => { G.beginPath(); G.rect(x0, -4.45, x1 - x0, 0.45); }, nick, ec, 0.8);
  for (const sx of [-1, 1]) fp(() => { G.beginPath(); G.rect(sx > 0 ? 5.5 : -5.78, 5.6, 0.28, 1.5); }, nick, ec, 0.8);
  out.north = SP(0.8 * Math.cos(th), 0.8 * Math.sin(th)); out.south = SP(-0.8 * Math.cos(th), -0.8 * Math.sin(th));
  out.cover = SP(-3.6, -2.6); out.magnet = SP(1.06 * Math.cos(th + 2.2), 1.06 * Math.sin(th + 2.2)); out.star = SP(-2.3, 0.9); out.spring = SP(-2.4, -2.95);
  out.sensor = SP(3.2, 4.6); out.pins = SP(-1.875, 12.6); out.axle = SP(0, 0); out.top = SP(0, -4.45); out.base = SP(0, 13.45); out.s = SP(1, 0)[0] - SP(0, 0)[0];
  return out;
}
