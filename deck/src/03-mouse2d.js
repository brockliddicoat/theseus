/* ============================================================================================
   mouse2d: the mouse as a technical illustration. Geometry in millimetres, drawn from hand-tuned
   cubic curves. Top view: x right, z forward (front up). Side view: the left (thumb) side, front left.
   122 x 61.8 x 38.6 mm: a pointed front with real corners, straight sides that converge toward the
   front, the hump set a little behind centre and high for claw, a low front and a steeper rear drop.
   ============================================================================================ */
function bez(p0, p1, p2, p3, n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    const t = i / n, u = 1 - t;
    out.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]);
  }
  return out;
}
/** a polyline from a start point and cubic segments [[c1, c2, end], ...] */
function curve(start, segs, n = 22) { let pts = [start], cur = start; for (const [c1, c2, e] of segs) { pts = pts.concat(bez(cur, c1, c2, e, n)); cur = e; } return pts; }
const MOUSE = {};
(function () {
  /* top view, right half, front centre to rear centre */
  const R = curve([0, 61.0], [
    [[6.4, 60.4], [13.2, 57.6], [19.4, 54.6]],     /* front edge: a V, the centre 6.5 mm ahead of the corners */
    [[23.2, 53.0], [25.3, 51.4], [25.6, 48.0]],    /* tight front corner */
    [[26.0, 36.0], [26.9, 22.0], [27.6, 10.0]],    /* straight side: the wedge, 51 mm at the front */
    [[28.3, -3.0], [30.9, -15.0], [30.9, -28.0]],  /* widening to 61.8 mm at the rear */
    [[30.9, -42.5], [28.8, -51.0], [23.0, -55.6]], /* rear corner */
    [[16.0, -60.2], [7.5, -60.6], [0, -60.6]]      /* rear centre */
  ]);
  MOUSE.topR = R;
  MOUSE.top = R.concat(R.slice(0, -1).reverse().map(p => [-p[0], p[1]])).slice(0, -1);
  /* side view profile (z, y), front bottom, over the top, to the rear bottom */
  MOUSE.side = curve([58.2, 1.2], [
    [[59.2, 4.4], [60.4, 8.2], [60.9, 10.6]],      /* nose: a straight face, raked forward */
    [[61.1, 11.7], [60.6, 12.5], [59.4, 12.7]],    /* a tight lip */
    [[50.0, 14.3], [40.5, 19.0], [32.0, 24.6]],    /* long, low front */
    [[18.0, 33.6], [4.0, 38.8], [-12.0, 38.8]],    /* up to the hump, set behind centre */
    [[-25.0, 38.8], [-36.0, 34.6], [-43.5, 27.0]], /* rear slope */
    [[-51.0, 19.0], [-58.0, 12.5], [-59.4, 7.0]],  /* rear drop */
    [[-60.0, 3.8], [-59.6, 1.6], [-58.2, 1.2]]     /* rear foot */
  ]);
  /* top profile y(z) for the side view, from the curve above */
  const topPts = MOUSE.side.filter(p => p[1] > 10.5 || Math.abs(p[0]) < 50).slice();
  MOUSE.topY = z => { let best = null; for (let i = 1; i < MOUSE.side.length; i++) { const a = MOUSE.side[i - 1], b = MOUSE.side[i]; if ((a[0] - z) * (b[0] - z) <= 0 && a[1] > 9 && b[1] > 9) { const k = (z - a[0]) / ((b[0] - a[0]) || 1e-6); const y = lerp(a[1], b[1], k); if (best == null || y > best) best = y; } } return best == null ? 0 : best; };
  /* half width in the top view at z */
  MOUSE.halfW = z => { let best = 0; for (let i = 1; i < R.length; i++) { const a = R[i - 1], b = R[i]; if ((a[1] - z) * (b[1] - z) <= 0) { const k = (z - a[1]) / ((b[1] - a[1]) || 1e-6); best = Math.max(best, lerp(a[0], b[0], k)); } } return best; };
  /* front view silhouette at the hump, right half (the pinky side is flatter; the thumb side curves in more) */
  MOUSE.frontR = curve([0, 38.6], [[[9, 38.6], [17.5, 37.4], [23.2, 33.2]], [[27.4, 30.0], [29.6, 24.0], [29.95, 15.0]], [[30.2, 9.0], [30.6, 3.0], [29.8, 1.0]]]);
  MOUSE.frontL = curve([0, 38.6], [[[-9, 38.6], [-17.0, 37.2], [-22.4, 32.8]], [[-26.4, 29.4], [-27.9, 23.6], [-27.9, 15.0]], [[-27.9, 9.0], [-29.6, 3.0], [-30.4, 1.0]]]);
})();

/* ---------- elevation contours: the height field from the top outline, the side profile and a superellipse section ---------- */
function heightField(x, z) {
  const a = MOUSE.halfW(z), b = MOUSE.topY(z); if (a <= 0.01 || b <= 1.2 || Math.abs(x) >= a) return 0;
  let y = 1 + (b - 1) * Math.pow(1 - Math.pow(Math.abs(x) / a, 3.0), 1 / 2.35);
  if (z > 8) { const g = 0.95 * smooth(clamp((z - 8) / 14)) * (1 - smooth(clamp((z - 44) / 14))); y -= g * Math.exp(-Math.pow((Math.abs(x) / a - 0.42) / 0.17, 2)) * smooth(clamp((y - 12) / 8)); }
  return y;
}
MOUSE.contours = (function () {
  const dx = 0.7, xs = [], zs = []; for (let x = -32; x <= 32; x += dx) xs.push(x); for (let z = -62; z <= 62; z += dx) zs.push(z);
  const F = zs.map(z => xs.map(x => heightField(x, z)));
  const out = {};
  for (const lv of [6, 12, 18, 24, 30, 34, 37, 38.4]) {
    const segs = [];
    for (let j = 0; j < zs.length - 1; j++) for (let i = 0; i < xs.length - 1; i++) {
      const v = [F[j][i], F[j][i + 1], F[j + 1][i + 1], F[j + 1][i]], p = [[xs[i], zs[j]], [xs[i + 1], zs[j]], [xs[i + 1], zs[j + 1]], [xs[i], zs[j + 1]]];
      const pts = [];
      for (let e = 0; e < 4; e++) { const a = v[e], b = v[(e + 1) % 4]; if ((a - lv) * (b - lv) < 0) { const k = (lv - a) / (b - a); pts.push([lerp(p[e][0], p[(e + 1) % 4][0], k), lerp(p[e][1], p[(e + 1) % 4][1], k)]); } }
      if (pts.length >= 2) segs.push(pts[0], pts[1]); if (pts.length === 4) segs.push(pts[2], pts[3]);
    }
    out[lv] = segs;
  }
  return out;
})();
function drawContours(V, a = 1, hiLevel) {
  if (a <= 0) return;
  G.save(); G.lineWidth = 1; G.lineCap = 'round';
  for (const lv in MOUSE.contours) {
    const segs = MOUSE.contours[lv], top = +lv >= 37;
    G.globalAlpha = a * (top ? 0.34 : 0.15); G.strokeStyle = hiLevel ? rgba(hiLevel, 1) : '#ffffff';
    G.beginPath(); for (let k = 0; k < segs.length; k += 2) { const p = V.P(segs[k][0], segs[k][1]), q = V.P(segs[k + 1][0], segs[k + 1][1]); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); } G.stroke();
  }
  G.restore();
}

/* ---------- transforms ---------- */
/** view transform: kind 'top' | 'bottom' | 'side' | 'front'; returns {P(a, b) -> [X, Y], s} */
function view(kind, cx, cy, s) {
  if (kind === 'top') return { kind, s, cx, cy, P: (x, z) => [cx + s * x, cy - s * z] };
  if (kind === 'plan') return { kind, s, cx, cy, P: (x, z) => [cx - s * z, cy - s * x] };
  if (kind === 'bottom') return { kind, s, cx, cy, P: (x, z) => [cx - s * x, cy - s * z] };
  if (kind === 'side') return { kind, s, cx, cy, P: (z, y) => [cx - s * z, cy - s * y] };
  return { kind, s, cx, cy, P: (x, y) => [cx - s * x, cy - s * y] }; /* front: looking back at the mouse, its left side is on your right */
}
function trace(V, pts, close = true) { G.beginPath(); pts.forEach((p, i) => { const q = V.P(p[0], p[1]); i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); }); if (close) G.closePath(); }
function strokePts(V, pts, col, w, a = 1, dash, close = false, p = 1) {
  if (a <= 0 || p <= 0) return;
  if (p < 1) { const all = close ? pts.concat([pts[0]]) : pts; const n = Math.max(2, Math.floor(all.length * p)); poly(all.slice(0, n).map(q => V.P(q[0], q[1])), { color: col, w, alpha: a }); return; }
  G.save(); G.globalAlpha = a; trace(V, pts, close); G.strokeStyle = col; G.lineWidth = w; G.lineJoin = 'round'; G.lineCap = 'round'; G.setLineDash(dash || []); G.stroke(); G.restore();
}
/** offset a closed polyline inward by d (positive = inside for a counter-clockwise outline) */
function offsetPts(pts, d) {
  const n = pts.length, out = [];
  for (let i = 0; i < n; i++) {
    const a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n];
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1;
    out.push([pts[i][0] - ty / l * d, pts[i][1] + tx / l * d]);
  }
  return out;
}
const INK = 'rgba(236,235,229,0.92)', INK2 = 'rgba(236,235,229,0.5)', INK3 = 'rgba(236,235,229,0.26)';
const OUT = () => inkA(0.92);

/* ---------- the body fill: lit from the upper left, edges rolling off into shadow ---------- */
function bodyFill(V, pts, o = {}) {
  G.save(); trace(V, pts); G.clip();
  const c = V.P(o.hx || 0, o.hz == null ? -8 : o.hz), r = V.s * (o.hr || 52);
  const g = G.createRadialGradient(c[0] - V.s * 6, c[1] - V.s * 8, r * 0.05, c[0], c[1], r);
  g.addColorStop(0, o.c0 || '#2a2c31'); g.addColorStop(0.55, o.c1 || '#1a1b1f'); g.addColorStop(1, o.c2 || '#0e0f11');
  G.fillStyle = g; G.fillRect(0, 0, W, H);
  /* roll-off: a wide dark stroke on the inside of the outline */
  trace(V, pts); G.strokeStyle = 'rgba(0,0,0,0.55)'; G.lineWidth = V.s * (o.roll || 6); G.stroke();
  trace(V, pts); G.strokeStyle = 'rgba(0,0,0,0.35)'; G.lineWidth = V.s * (o.roll2 || 2.2); G.stroke();
  G.restore();
}

/* ---------- top view ---------- */
/**
 * o = {a (alpha), smile (0 straight rear cutout .. 1 curved), xray (0..1 internals), hi: {part: k}, wheel (rotation phase),
 *      grooves (0..1), detail (0..1 inner lines), noFill}
 * parts for hi: trigL, trigR, cutout, wheel, grooves, chamfer, notch, shell, sideL, switches, pcb, battery, sensor, antenna, mcu, sidepcb
 */
function mouseTop(V, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0) return;
  const hi = o.hi || {}, det = o.detail == null ? 1 : o.detail, s = V.s;
  G.save(); G.globalAlpha = a;
  /* soft shadow */
  G.save(); const sh = V.P(0, -4); G.translate(sh[0] + s * 2.5, sh[1] + s * 3); if (V.kind === 'plan') G.scale(2.0, 1); else G.scale(1, 2.0); const sg = G.createRadialGradient(0, 0, 0, 0, 0, s * 38); sg.addColorStop(0, 'rgba(0,0,0,0.55)'); sg.addColorStop(1, 'rgba(0,0,0,0)'); G.fillStyle = sg; G.beginPath(); G.arc(0, 0, s * 38, 0, Math.PI * 2); G.fill(); G.restore();
  if (!o.noFill) { G.save(); G.globalAlpha = a * (o.fillA == null ? 1 : o.fillA); bodyFill(V, MOUSE.top, { hz: -10 }); G.restore(); }
  /* elevation contours every 6 mm (the comfort grooves show as dips in them) */
  drawContours(V, det * (o.contours == null ? 1 : o.contours));
  if (hi.grooves) for (const sx of [-1, 1]) { const gp = curve([sx * 11.4, 12], [[[sx * 16.2, 22], [sx * 15.8, 40], [sx * 11.6, 49.5]], [[sx * 8.0, 40], [sx * 7.4, 22], [sx * 11.4, 12]]], 18); G.save(); trace(V, gp); G.fillStyle = rgba(acc(), 0.18 * hi.grooves); G.fill(); G.restore(); strokePts(V, gp, acc(), 1.6, hi.grooves, null, true); }
  /* rear trigger cutout: straight (the proposal) or a curved "smile" */
  const sm = o.smile || 0;
  const cut = []; for (let i = 0; i <= 40; i++) { const x = lerp(-22.8, 22.8, i / 40), k = x / 22.8; cut.push([x, 3.0 - sm * 5.2 * (1 - k * k)]); }
  const sideEdge = sx => curve([sx * 22.8, 3.0], [[[sx * 22.9, 16], [sx * 22.9, 34], [sx * 23.0, 45]], [[sx * 23.1, 49.5], [sx * 22.2, 52.6], [sx * 18.4, 54.8]]], 18);
  if (det > 0) {
    strokePts(V, cut, hi.cutout ? acc() : INK2, hi.cutout ? 2.6 : 1.5, det);
    for (const sx of [-1, 1]) strokePts(V, sideEdge(sx), hi['trig' + (sx < 0 ? 'L' : 'R')] ? acc() : INK3, 1.3, det);
    /* centre seam with the wheel slot (narrow, rounded) and the notch in front of it */
    strokePts(V, [[0, 3.0 - sm * 5.2], [0, 19.2]], INK2, 1.3, det);
    strokePts(V, [[0, 43.4], [0, 61]], INK2, 1.3, det);
    const slot = curve([4.25, 23.5], [[[4.25, 21.0], [2.3, 19.1], [0, 19.1]], [[-2.3, 19.1], [-4.25, 21.0], [-4.25, 23.5]]], 10).concat([[-4.25, 37.0]], curve([-4.25, 37.0], [[[-4.25, 38.6], [-2.6, 40.0], [0, 43.4]], [[2.6, 40.0], [4.25, 38.6], [4.25, 37.0]]], 10));
    G.save(); trace(V, slot); G.fillStyle = '#050506'; G.fill(); G.restore();
    strokePts(V, slot, hi.notch ? acc() : INK2, hi.notch ? 2.2 : 1.4, det, null, true);
    /* the wheel, white, five knurl rows (seen from above: ridges across the tread) */
    G.save(); trace(V, slot); G.clip();
    const wa = V.P(-3.4, 37.6), wb = V.P(3.4, 20.6);
    const wg = G.createLinearGradient(0, wa[1], 0, wb[1]); wg.addColorStop(0, '#5d5c58'); wg.addColorStop(0.5, '#e9e7e0'); wg.addColorStop(1, '#5d5c58');
    G.fillStyle = hi.wheel ? rgba(acc(), 0.9) : wg; G.fillRect(wa[0], wa[1], wb[0] - wa[0], wb[1] - wa[1]);
    const ph = (o.wheel || 0) % 1.4;
    G.strokeStyle = 'rgba(10,10,12,0.55)'; G.lineWidth = Math.max(1, s * 0.32);
    for (let z = 20 - ph; z < 39; z += 1.4) { for (let c = 0; c < 5; c++) { const x0 = -3.4 + c * 1.36 + ((Math.round((z + ph) / 1.4) % 2) ? 0.68 : 0); const p = V.P(x0, z), q = V.P(x0 + 0.9, z); G.beginPath(); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); G.stroke(); } }
    G.restore();
    /* front chamfer on the buttons */
    const ch = curve([-20.6, 53.2], [[[-14, 55.6], [-7, 57.8], [0, 58.4]], [[7, 57.8], [14, 55.6], [20.6, 53.2]]], 16);
    strokePts(V, ch, hi.chamfer ? acc() : INK3, hi.chamfer ? 2.2 : 1.2, det);
  }
  /* x-ray internals */
  const xr = o.xray || 0;
  if (xr > 0) mouseInternalsTop(V, xr, hi);
  /* outline last */
  strokePts(V, MOUSE.top, hi.shell ? acc() : OUT(), hi.shell ? 2.8 : 2.2, o.trace == null ? 1 : 1, null, true, o.trace);
  if (hi.sideL) strokePts(V, MOUSE.top.filter(p => p[0] < -20 && p[1] > -30 && p[1] < 20), acc(), 4, hi.sideL);
  G.restore();
}
function mouseInternalsTop(V, a, hi = {}) {
  const box = (x, z, w, l, part, col) => { const p = V.P(x - w / 2, z + l / 2), q = V.P(x + w / 2, z - l / 2); const on = hi[part] || 0; G.save(); G.globalAlpha = a; G.fillStyle = on ? rgba(acc(), 0.22 * on + 0.05) : 'rgba(10,11,12,0.85)'; G.fillRect(p[0], p[1], q[0] - p[0], q[1] - p[1]); G.strokeStyle = on ? acc() : (col || INK2); G.lineWidth = on ? 2 : 1.2; G.strokeRect(p[0], p[1], q[0] - p[0], q[1] - p[1]); G.restore(); };
  /* PCB: the outline inset 4 mm */
  const pcb = MOUSE.top.map(p => [p[0] * 0.86, p[1] * 0.86 + 0.5]).filter(p => p[1] > -52 && p[1] < 54);
  G.save(); G.globalAlpha = a; trace(V, pcb); G.fillStyle = hi.pcb ? rgba(acc(), 0.12) : 'rgba(18,30,22,0.55)'; G.fill(); G.restore();
  strokePts(V, pcb, hi.pcb ? acc() : 'rgba(226,174,79,0.45)', 1.2, a, [4, 4], true);
  box(-12.8, 41, 5.8, 12.8, 'switches'); box(12.8, 41, 5.8, 12.8, 'switches');
  box(0, -31, 18, 27, 'battery');
  box(8.6, 30, 4.5, 12, 'encoder');
  box(-7, 14, 6, 6, 'mcu');
  box(0, 48.5, 18, 3.2, 'antenna', 'rgba(226,174,79,0.7)');
  box(-25.6, 3, 2.2, 32, 'sidepcb');
  const sp = V.P(0, 1.8); G.save(); G.globalAlpha = a; G.beginPath(); G.arc(sp[0], sp[1], V.s * 4.5, 0, Math.PI * 2); G.fillStyle = hi.sensor ? rgba(acc(), 0.3) : 'rgba(10,11,12,0.9)'; G.fill(); G.strokeStyle = hi.sensor ? acc() : INK2; G.lineWidth = 1.3; G.stroke(); G.restore();
}
/** named points on the top view, in mm */
const TOPPT = { trigL: [-12.5, 34], trigR: [12.5, 34], cutout: [0, 3], wheel: [0, 29], notch: [0, 42], chamfer: [10, 57], front: [0, 60], hump: [0, -10], rear: [0, -58], sideL: [-28.6, 0], sideR: [28.6, 0], grooveL: [-12.6, 32], grooveR: [12.6, 32],
  switchL: [-12.8, 41], switchR: [12.8, 41], battery: [0, -31], sensor: [0, 1.8], mcu: [-7, 14], antenna: [0, 48.5], encoder: [8.6, 30], sidepcb: [-25.6, 3], pcb: [14, -10] };
function topPt(V, name) { const p = TOPPT[name]; return V.P(p[0], p[1]); }

/* ---------- side view (left side, front to the left) ---------- */
/**
 * o = {a, xray, hi, explode (0..1), sb: [press1, press2], click (0..1 trigger travel, drawn 6x), detail}
 * parts for hi: shell, trig, sidebtn, divider, wheel, skates, pcb, switches, battery, sensor, port, hump, front
 */
function mouseSide(V, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0) return;
  const hi = o.hi || {}, s = V.s, det = o.detail == null ? 1 : o.detail, ex = o.explode || 0;
  G.save(); G.globalAlpha = a;
  /* ground shadow */
  if (!ex) { G.save(); const sp = V.P(0, 0); G.translate(sp[0], sp[1] + s * 1.2); G.scale(1, 0.09); const sg = G.createRadialGradient(0, 0, 0, 0, 0, s * 64); sg.addColorStop(0, 'rgba(0,0,0,0.75)'); sg.addColorStop(1, 'rgba(0,0,0,0)'); G.fillStyle = sg; G.beginPath(); G.arc(0, 0, s * 64, 0, Math.PI * 2); G.fill(); G.restore(); }
  const L = (dy) => ({ s, P: (z, y) => V.P(z, y + dy) });
  const Vs = L(56 * ex), Vt = L(38 * ex), Vw = L(26 * ex), Vp = L(13 * ex), Vb = L(0), Vk = L(-9 * ex);
  /* skates (dots seen edge-on) */
  for (const z of [48.4, 43.6, -46.0, -50.2]) { const p = Vk.P(z + 3.25, 1.0), q = Vk.P(z - 3.25, 0.2); G.fillStyle = hi.skates ? acc() : '#d9d7d0'; G.fillRect(p[0], p[1], q[0] - p[0], q[1] - p[1]); }
  /* scroll wheel peeking above the profile */
  const wz = 30, wy = MOUSE.topY(wz) - 6.9, wR = 10.2, wc = Vw.P(wz, wy);
  G.save();
  if (!ex) { G.beginPath(); MOUSE.side.forEach((p, i) => { const q = Vs.P(p[0], p[1]); i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); }); G.lineTo(0, 0); G.lineTo(0, H); G.lineTo(W, H); G.lineTo(W, 0); G.lineTo(0, 0); G.clip('evenodd'); }
  G.beginPath(); G.arc(wc[0], wc[1], s * wR, 0, Math.PI * 2); G.fillStyle = hi.wheel ? acc() : '#d8d6cf'; G.fill();
  G.strokeStyle = 'rgba(20,20,22,0.6)'; G.lineWidth = 1.2; for (let k = 0; k < 44; k++) { const an = k / 44 * Math.PI * 2 + (o.wheel || 0); G.beginPath(); G.moveTo(wc[0] + Math.cos(an) * s * (wR - 1.2), wc[1] + Math.sin(an) * s * (wR - 1.2)); G.lineTo(wc[0] + Math.cos(an) * s * wR, wc[1] + Math.sin(an) * s * wR); G.stroke(); }
  G.restore();
  /* internals (x-ray or exploded) */
  const xr = Math.max(o.xray || 0, ex);
  if (xr > 0) mouseInternalsSide({ Vp, Vb, Vw }, xr, hi);
  /* shell */
  if (!o.noShell) {
    const shA = (ex > 0 ? 1 : lerp(1, 0.12, o.xray || 0)) * (o.fillA == null ? 1 : o.fillA);
    G.save(); G.globalAlpha = a * shA;
    if (ex > 0) { /* exploded: the shell as a thin wall */ const inner = MOUSE.side.map(p => [p[0] * 0.985, Math.max(1.2, p[1] - 1.1)]); trace(Vs, MOUSE.side.concat(inner.reverse()), true); G.fillStyle = '#1b1c20'; G.fill(); }
    else {
      trace(Vs, MOUSE.side); const lo = Vs.P(0, 1), hiP = Vs.P(0, 38.6); const g = G.createLinearGradient(0, hiP[1], 0, lo[1]);
      g.addColorStop(0, '#2b2d32'); g.addColorStop(0.32, '#1b1c20'); g.addColorStop(1, '#0d0e10'); G.fillStyle = g; G.fill();
      /* the top catches the key light: a soft band and a thin glint just under the edge */
      G.save(); trace(Vs, MOUSE.side); G.clip();
      const topEdge = MOUSE.side.filter(p => p[1] > 12.5 && p[0] < 59 && p[0] > -55);
      trace(Vs, topEdge.map(p => [p[0], p[1] - 3.2]), false); G.strokeStyle = 'rgba(255,255,255,0.06)'; G.lineWidth = s * 4.5; G.stroke();
      trace(Vs, topEdge.map(p => [p[0], p[1] - 1.3]), false); G.strokeStyle = 'rgba(255,255,255,0.22)'; G.lineWidth = 1.2; G.stroke();
      /* bottom chamfer: a dark band with a lit edge */
      const c0 = Vs.P(0, 3.6), c1 = Vs.P(0, 1.0); G.fillStyle = 'rgba(0,0,0,0.5)'; G.fillRect(0, c0[1], W, c1[1] - c0[1]);
      G.restore();
      /* grip pocket: a darker band where the side curves in */
      G.save(); trace(Vs, MOUSE.side); G.clip(); const b0 = Vs.P(0, 22), b1 = Vs.P(0, 6); const bg2 = G.createLinearGradient(0, b0[1], 0, b1[1]); bg2.addColorStop(0, 'rgba(0,0,0,0)'); bg2.addColorStop(0.5, 'rgba(0,0,0,0.28)'); bg2.addColorStop(1, 'rgba(0,0,0,0)'); G.fillStyle = bg2; G.fillRect(0, 0, W, H); G.restore();
    }
    G.restore();
    /* trigger split line: along the shoulder from the front lip to the rear cutout, then up */
    if (det > 0) {
      const tl = []; for (let z = 58.4; z >= 3.0; z -= 1.2) tl.push([z, MOUSE.topY(z) - lerp(3.6, 7.2, smooth(clamp((58 - z) / 36)))]);
      tl.push([3.0, MOUSE.topY(3.0)]);
      const clk = (o.click || 0) * 6 * 0.45;
      const Vtt = { s, P: (z, y) => Vt.P(z, y - clk * clamp((z - 3) / 54)) };
      strokePts(Vtt, tl, hi.trig ? acc() : INK2, hi.trig ? 2.4 : 1.4, det * shellA(o, ex));
      if (ex > 0) { const tp = MOUSE.side.filter(p => p[0] >= 3.0 && p[1] > 9); trace(Vt, tp.concat(tl.slice().reverse()), true); G.save(); G.globalAlpha = a; G.fillStyle = '#202125'; G.fill(); G.restore(); strokePts(Vt, tp.concat(tl.slice().reverse()), hi.trig ? acc() : INK, 1.8, a, null, true); }
      /* bottom rim chamfer */
      strokePts(Vs, [[58.2, 3.6], [-58.6, 3.6]], 'rgba(255,255,255,0.2)', 1.1, det * shellA(o, ex));
      /* side buttons on rails, with a divider between them */
      const sbs = [[17.5, 4.2], [1.8, -11.5]];
      sbs.forEach(([z0, z1], i) => {
        const pr = (o.sb && o.sb[i]) || 0, d = pr * 0.0;
        const r = [[z0, 21.4], [z1, 21.4], [z1, 15.6], [z0, 15.6]];
        const rr = curve([z0 - 1.6, 21.6], [[[z0 - 0.4, 21.6], [z0, 21.2], [z0, 20.0]]], 6).concat([[z0, 17.2]], curve([z0, 17.2], [[[z0, 16.0], [z0 - 0.4, 15.4], [z0 - 1.6, 15.4]]], 6), [[z1 + 1.6, 15.4]], curve([z1 + 1.6, 15.4], [[[z1 + 0.4, 15.4], [z1, 16.0], [z1, 17.2]]], 6), [[z1, 20.0]], curve([z1, 20.0], [[[z1, 21.2], [z1 + 0.4, 21.6], [z1 + 1.6, 21.6]]], 6));
        const Vsb = ex > 0 ? { s, P: (z, y) => Vs.P(z, y - 34 * ex) } : Vs;
        G.save(); G.globalAlpha = a; trace(Vsb, rr); const gg = G.createLinearGradient(0, Vsb.P(0, 21.6)[1], 0, Vsb.P(0, 15.4)[1]); gg.addColorStop(0, hi.sidebtn ? rgba(acc(), 0.5) : '#2e3035'); gg.addColorStop(1, hi.sidebtn ? rgba(acc(), 0.25) : '#16171a'); G.fillStyle = gg; G.fill(); G.restore();
        strokePts(Vsb, rr, hi.sidebtn ? acc() : INK, 1.5, a, null, true);
        if (pr > 0) { const c = Vsb.P((z0 + z1) / 2, 18.5); circle(c[0], c[1], s * 2.2 * pr, { color: acc(), w: 2, alpha: pr }); }
      });
      if (hi.divider) { const p = Vs.P(4.0, 21.8), q = Vs.P(2.0, 15.2); rect(p[0], p[1], q[0] - p[0], q[1] - p[1], { fill: rgba(acc(), 0.5 * hi.divider) }); }
      /* USB-C port on the front face, angled up (#19) */
      const port = [[59.9, 6.6], [59.3, 4.4]]; strokePts(Vs, port, hi.port ? acc() : INK2, s * 1.6, det, null);
    }
    /* highlight on the top edge */
    if (!ex) { const ridge = MOUSE.side.filter(p => p[1] > 14 && p[0] < 54 && p[0] > -50); strokePts(Vs, ridge.map(p => [p[0], p[1] - 1.1]), 'rgba(255,255,255,0.16)', s * 1.4, a); }
    strokePts(Vs, MOUSE.side, hi.shell ? acc() : OUT(), hi.shell ? 2.8 : 2.2, a * shellA(o, ex), null, false, o.trace);
    if (!ex) strokePts(Vs, [[58.2, 1.2], [-58.2, 1.2]], OUT(), 2.2, a * shellA(o, ex), null, false, o.trace);
    if (hi.hump) strokePts(Vs, MOUSE.side.filter(p => p[0] < 12 && p[0] > -30), acc(), 4, hi.hump);
    if (hi.front) strokePts(Vs, MOUSE.side.filter(p => p[0] > 38), acc(), 4, hi.front);
  }
  G.restore();
}
function shellA(o, ex) { return ex > 0 ? 1 : lerp(1, 0.25, o.xray || 0); }
function mouseInternalsSide(L, a, hi = {}) {
  const { Vp, Vb } = L;
  const box = (V, z0, z1, y0, y1, part, fill) => { const p = V.P(z0, y1), q = V.P(z1, y0); const on = hi[part] || 0; G.save(); G.globalAlpha = a; G.fillStyle = on ? rgba(acc(), 0.25 * on + 0.08) : (fill || '#141518'); G.fillRect(p[0], p[1], q[0] - p[0], q[1] - p[1]); G.strokeStyle = on ? acc() : INK2; G.lineWidth = on ? 2 : 1.2; G.strokeRect(p[0], p[1], q[0] - p[0], q[1] - p[1]); G.restore(); };
  box(Vb, 58.6, -56.0, 0.8, 1.7, 'plate', '#101113');
  box(Vp, 52, -51, 2.4, 3.6, 'pcb', '#13241a');
  box(Vp, 47.4, 34.6, 3.6, 10.1, 'switches', '#1c1d21');
  box(Vp, 42.6, 39.4, 10.1, 11.4, 'switches', '#cfcdc6');
  box(Vp, -17.5, -44.5, 3.6, 8.8, 'battery', '#1a1b1e');
  box(Vp, 6.3, -2.7, 0.9, 2.4, 'sensor', '#1a1b1e');
  box(Vp, 36, 24, 3.6, 15.6, 'encoder', '#18191c');
  box(Vp, 50.1, 46.9, 3.6, 4.2, 'antenna', '#a9853f');
  box(Vp, 19.0, -14.0, 9.0, 23.0, 'sidepcb', '#13241a');
}
const SIDEPT = { front: [58, 9], lip: [56, 13.5], hump: [-9, 38.6], rear: [-58, 8], trig: [30, 24], cutout: [3, 37.5], wheel: [30, 26.5], sidebtn1: [10.8, 18.5], sidebtn2: [-4.8, 18.5], divider: [3.0, 18.5], skateF: [46, 0.6], skateR: [-48, 0.6], port: [60.2, 5.5], pcb: [10, 3], switch: [41, 7], battery: [-31, 6], sensor: [1.8, 1.6] };
function sidePt(V, name) { const p = SIDEPT[name]; return V.P(p[0], p[1]); }

/* ---------- front view ---------- */
function mouseFront(V, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0) return; const hi = o.hi || {}, s = V.s;
  G.save(); G.globalAlpha = a;
  const pts = MOUSE.frontR.slice().reverse().concat(MOUSE.frontL.slice(1));
  trace(V, pts); const lo = V.P(0, 1), top = V.P(0, 38.6); const g = G.createLinearGradient(0, top[1], 0, lo[1]); g.addColorStop(0, '#2a2c31'); g.addColorStop(0.4, '#191a1e'); g.addColorStop(1, '#0d0e10'); G.fillStyle = g; G.fill();
  /* the low front face in front of the hump */
  const ff = curve([-27.4, 1.0], [[[-27.6, 7], [-26.0, 12.0], [-20.5, 13.4]], [[-12, 14.6], [-4, 13.9], [0, 13.9]], [[4, 13.9], [12, 14.6], [20.5, 13.4]], [[26.0, 12.0], [27.6, 7], [27.4, 1.0]]], 12);
  trace(V, ff); G.fillStyle = '#16171a'; G.fill();
  strokePts(V, ff, hi.frontface ? acc() : INK2, hi.frontface ? 2.4 : 1.4, 1);
  /* flat front cutouts (#46): the trigger underside edges, flat and parallel to the ground */
  for (const sx of [-1, 1]) strokePts(V, [[sx * 3, 10.6], [sx * 20, 10.6]], hi.cutouts ? acc() : INK3, hi.cutouts ? 2.6 : 1.2, 1);
  strokePts(V, [[0, 13.9], [0, 10.6]], INK2, 1.2, 1);
  strokePts(V, pts, OUT(), 2.2, 1, null, true);
  G.restore();
}

/* ---------- bottom view ---------- */
function mouseBottom(V, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0) return; const hi = o.hi || {}, s = V.s;
  G.save(); G.globalAlpha = a;
  trace(V, MOUSE.top); G.fillStyle = '#121315'; G.fill();
  /* plate: a triangle lattice (#75), solid at the rim, around the sensor, at screw bosses and under the dots */
  const plate = offsetPts(MOUSE.top, -1.6);
  G.save(); trace(V, plate); G.clip();
  const solid = [[0, 1.8, 9], [-21, -20.6, 4], [21, -20.6, 4], [-17, 24.2, 4], [17, 24.2, 4], [0, -46, 7], [-19, -47, 9], [19, -47, 9], [-19, 46, 9], [19, 46, 9]];
  const sz = 7.2, hh = sz * Math.sqrt(3) / 2, m = 0.85;
  G.fillStyle = '#050506';
  for (let r = -10; r < 10; r++) for (let c = -6; c < 6; c++) {
    const x = c * sz + (r % 2 ? sz / 2 : 0), z = r * hh;
    for (const up of [0, 1]) {
      const tri = up ? [[x + m * 1.7, z + m], [x + sz - m * 1.7, z + m], [x + sz / 2, z + hh - m * 1.8]] : [[x + sz / 2 + m * 1.7, z + hh - m], [x + sz * 1.5 - m * 1.7, z + hh - m], [x + sz, z + m * 1.8]];
      const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cz = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
      if (MOUSE.halfW(cz) - Math.abs(cx) < 5.5 || cz > 54 || cz < -53) continue;
      if (solid.some(([sx2, sz2, rr]) => Math.hypot(cx - sx2, cz - sz2) < rr)) continue;
      G.beginPath(); tri.forEach((p, i) => { const q = V.P(p[0], p[1]); i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); }); G.closePath(); G.fill();
      if (hi.lattice) { G.strokeStyle = rgba(acc(), 0.7 * hi.lattice); G.lineWidth = 1; G.stroke(); }
    }
  }
  G.restore();
  strokePts(V, plate, INK3, 1.2, 1, null, true);
  /* sensor window and lens */
  const sp = V.P(0, 1.8); circle(sp[0], sp[1], s * 4.6, { fill: '#0b0b0c', color: hi.sensor ? acc() : INK2, w: 1.4 }); circle(sp[0], sp[1], s * 3.1, { color: hi.sensor ? acc() : INK3, w: 1.2 });
  /* screws, clear of the dots (#52) */
  for (const [x, z] of [[-21, -20.6], [21, -20.6], [-17, 24.2], [17, 24.2]]) { const p = V.P(x, z); circle(p[0], p[1], s * 1.9, { fill: '#3a3b3e', color: hi.screws ? acc() : INK2, w: 1.3 }); line(p[0] - s * 1.1, p[1], p[0] + s * 1.1, p[1], { color: '#111', w: 1.6 }); line(p[0], p[1] - s * 1.1, p[0], p[1] + s * 1.1, { color: '#111', w: 1.6 }); }
  /* dots, two per corner (#10) */
  for (const [x, z] of [[-19, -46.0], [-11.5, -50.2], [19, -46.0], [11.5, -50.2], [-22, 43.6], [-15, 48.4], [22, 43.6], [15, 48.4]]) { const p = V.P(x, z); circle(p[0], p[1], s * 3.25, { fill: hi.skates ? rgba(acc(), 0.9) : '#e4e2db', color: 'rgba(0,0,0,0.4)', w: 1 }); }
  /* power switch with clear on/off labels (#100) */
  const ps = V.P(-6, -33), pe = V.P(6, -36); rect(ps[0], ps[1], pe[0] - ps[0], pe[1] - ps[1], { fill: '#0a0a0b', color: hi.power ? acc() : INK2, w: 1.2 });
  const kn = V.P(-5.4, -33.6), kn2 = V.P(-0.6, -35.4); rect(kn[0], kn[1], kn2[0] - kn[0], kn2[1] - kn[1], { fill: '#c9c7c0' });
  const lo = V.P(0, -39.2); text('OFF        ON', lo[0], lo[1] + 6, { font: 'mono', size: Math.max(10, s * 1.7), weight: 700, color: INK2, align: 'center' });
  strokePts(V, MOUSE.top, OUT(), 2.2, 1, null, true);
  G.restore();
}
const BOTPT = { sensor: [0, 1.8], dotsF: [-18.5, 46], dotsR: [-15, -48], screw: [-17, 24.2], lattice: [10, -6], power: [0, -34.5], rim: [-27, 0] };
function botPt(V, name) { const p = BOTPT[name]; return V.P(p[0], p[1]); }
