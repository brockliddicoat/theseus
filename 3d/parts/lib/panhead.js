// M2 pan head with a Phillips + slot combination recess, built exactly (no mesh booleans).
//
// The head is a solid of revolution (ISO 7045 envelope: dk 4.0, k 1.6, dome radius rf 3.2, under-head fillet r 0.1)
// with the recess cut into its dome. Seen from above, the recess (slot + cross + centre cone) is a union of convex
// shapes that all contain the axis, so it is star-shaped about it: every ray from the axis leaves it once. That lets
// the dome be meshed as two polar grids whose inner edge IS the recess outline (sampled at its own corners), and the
// floors as rectilinear grids whose lines lie on every edge of the recess. Where two neighbouring cells of the top
// surface sit at different heights, a vertical wall joins them. Every seam shares its vertices, so the head is
// watertight against the thread (closed by it at the shank ring) and section caps read as solid.
//
// Frame: origin at the bearing face centre, head along +Y; the slot runs along X, the cross arms along X and Z.
import * as THREE from 'three';
import { creaseNormals } from './geom.js';

const TAU = Math.PI * 2;
const lin = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n);
const uniq = (arr, eps = 1e-9) => { const s = arr.slice().sort((p, q) => p - q), o = []; for (const v of s) if (!o.length || Math.abs(v - o[o.length - 1]) > eps) o.push(v); return o; };

/** Triangle soup with orientation by a hint normal (each face is flipped to agree with it). */
export class Soup {
  constructor() { this.P = []; }
  tri(a, b, c, nh) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    if (nx * nx + ny * ny + nz * nz < 1e-24) return;                      // degenerate
    if (nh && nx * nh[0] + ny * nh[1] + nz * nh[2] < 0) { const t = b; b = c; c = t; }
    this.P.push(...a, ...b, ...c);
  }
  quad(a, b, c, d, nh) { this.tri(a, b, c, nh); this.tri(a, c, d, nh); }
  /** a convex planar polygon (collinear points allowed: they split an edge for a neighbour that meets it there) */
  poly(pts, nh) { for (let i = 1; i < pts.length - 1; i++) this.tri(pts[0], pts[i], pts[i + 1], nh); }
  geometry(crease = 32) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.P, 3));
    return creaseNormals(g, crease);
  }
}

export const PAN_HEAD_DEFAULTS = {
  dk: 4.0, k: 1.6, rf: 3.2, fillet: 0.32,          // ISO 7045 M2: dk 4.0 max, k 1.6 max, rf ≈ 3.2
  shank: 0.87, underFillet: 0.1, bearingRound: 0.05, // blank ≈ pitch diameter under the head; r min 0.1
  slotWidth: 0.5, slotDepth: 0.6,                    // ISO 1580 M2: n 0.5, t min 0.5
  crossSpan: 1.9, wing: 0.42, crossDepth: 1.0,       // cross recess No. 0 (H): m ≈ 1.9, penetration 0.85–1.2
  crossFlat: 0.3, coneRadius: 0.18, coneDepth: 0.16,
};

/** Returns { geometry, spec }. geometry: non-indexed, creased normals, closed except the shank ring at
    (shank, −underFillet), which the thread closes. */
export function panHeadGeometry(opts = {}) {
  const o = { ...PAN_HEAD_DEFAULTS, ...opts };
  const R = o.dk / 2, k = o.k, rf = o.rf, rF = o.fillet;
  const rb = o.shank, ru = o.underFillet, eb = o.bearingRound;
  const n2 = o.slotWidth / 2, ys = k - o.slotDepth;
  const m2 = o.crossSpan / 2, w2 = o.wing / 2, yc = k - o.crossDepth, xb = o.crossFlat;
  const rc = o.coneRadius, yApex = yc - o.coneDepth;
  const segR = o.radial ?? 12;

  // ---------------------------------------------------------------- the outer profile: dome, fillet, side
  const dc = k - rf;                                            // dome centre (y)
  const fcx = R - rF, fcy = dc + Math.sqrt((rf - rF) ** 2 - fcx * fcx);   // fillet centre, inside the dome
  const rt = rf * fcx / (rf - rF);                             // dome/fillet tangent radius
  const H0 = r => r <= rt ? dc + Math.sqrt(Math.max(0, rf * rf - r * r)) : fcy + Math.sqrt(Math.max(0, rF * rF - (r - fcx) ** 2));
  let lo = 0, hi = R; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (H0(mid) > ys) lo = mid; else hi = mid; }
  const rs = (lo + hi) / 2;                                    // where the slot floor meets the dome
  // the arm floors: flat to xb, then a ramp that meets the dome at the arm's tip
  const slope = (H0(m2) + 1e-3 - yc) / (m2 - xb);
  const F = s => yc + Math.max(0, s - xb) * slope;
  const cone = (x, z) => { const r = Math.hypot(x, z); return r < rc ? yApex + (yc - yApex) * r / rc : Infinity; };

  // ---------------------------------------------------------------- recess outline samples (angle a: x = r sin a, z = r cos a)
  const a1 = Math.atan2(w2, m2), a2 = Math.atan2(w2, n2), a0 = Math.acos(n2 / rs);
  const N1 = o.nEnd ?? 6, N2 = o.nSide ?? 10, N3 = o.nSlot ?? 30;
  const xEnd = lin(-a1, a1, N1).map(a => m2 * Math.tan(a));                     // arm end, z = m2 (x from −w2 to w2)
  const zSide = uniq([...lin(a1, a2, N2).map(a => w2 / Math.tan(a)), xb].filter(z => z >= n2 - 1e-12 && z <= m2 + 1e-12)).reverse();   // arm side, x = w2 (z from m2 down to n2)
  const x1 = xb + (ys - yc) / slope;                           // where the A_x trench floor reaches the slot floor
  const xSlot = uniq([...lin(a2, a0, N3).map(a => n2 * Math.tan(a)), xb, x1].filter(x => x >= w2 - 1e-12 && x <= Math.sqrt(rs * rs - n2 * n2) + 1e-12));   // slot edge, z = n2
  xSlot[0] = w2; xSlot[xSlot.length - 1] = Math.sqrt(rs * rs - n2 * n2);
  // the boundary of the +Z dome half, by increasing angle: slot edge (−x), arm side (−x), arm end, arm side (+x),
  // slot edge (+x). zSide runs from m2 (index 0) down to n2 (last); xSlot from w2 up to the slot's exit at rs.
  const bnd = [];
  const push = p => { const q = bnd[bnd.length - 1]; if (!q || Math.hypot(q[0] - p[0], q[1] - p[1]) > 1e-12) bnd.push(p); };
  const L = xSlot.length - 1, Sd = zSide.length - 1;
  for (let i = L; i >= 0; i--) push([-xSlot[i], n2]);
  for (let i = Sd; i >= 0; i--) push([-w2, zSide[i]]);
  for (let i = 0; i < xEnd.length; i++) push([xEnd[i], m2]);
  for (let i = 0; i <= Sd; i++) push([w2, zSide[i]]);
  for (let i = 0; i <= L; i++) push([xSlot[i], n2]);

  const S = new Soup();
  const up = [0, 1, 0];
  const v3 = (x, y, z) => [x, y, z];
  // ---------------------------------------------------------------- dome halves (polar grids from the recess outline to rs)
  const domeHalf = (sz) => {
    const pts = bnd.map(([x, z]) => [x, sz * z]);
    const rows = pts.map(([x, z]) => {
      const r0 = Math.hypot(x, z), ux = x / r0, uz = z / r0, out = [];
      for (let j = 0; j <= segR; j++) { const r = r0 + (rs - r0) * (j / segR); out.push(v3(ux * r, H0(r), uz * r)); }
      return out;
    });
    for (let i = 0; i < rows.length - 1; i++) for (let j = 0; j < segR; j++) S.quad(rows[i][j], rows[i + 1][j], rows[i + 1][j + 1], rows[i][j + 1], up);
    return pts;
  };
  domeHalf(1); domeHalf(-1);

  // ---------------------------------------------------------------- arm floors outside the slot (|x| < w2, n2 < |z| < m2)
  const Tarm = (x, z) => Math.min(H0(Math.hypot(x, z)), F(Math.abs(z)));
  for (const sz of [1, -1]) {
    const zs = zSide.slice().reverse();                        // n2 → m2
    for (let j = 0; j < zs.length - 1; j++) for (let i = 0; i < xEnd.length - 1; i++) {
      const p = (x, z) => v3(x, Tarm(x, z), sz * z);
      S.quad(p(xEnd[i], zs[j]), p(xEnd[i + 1], zs[j]), p(xEnd[i + 1], zs[j + 1]), p(xEnd[i], zs[j + 1]), up);
    }
    // arm side walls at x = ±w2: dome edge above, arm floor below; the wall faces into the arm
    for (const sx of [1, -1]) for (let j = 0; j < zs.length - 1; j++) {
      const za = zs[j], zb = zs[j + 1], x = sx * w2;
      const ta = H0(Math.hypot(x, za)), tb = H0(Math.hypot(x, zb)), fa = Tarm(x, za), fb = Tarm(x, zb);
      if (ta - fa < 1e-7 && tb - fb < 1e-7) continue;
      // at z = n2 the slot's own walls meet this one at the slot floor height: split the edge there (no T-junction)
      const mid = j === 0 && fa < ys - 1e-7 && ta > ys + 1e-7 ? [v3(x, ys, sz * za)] : [];
      S.poly([v3(x, tb, sz * zb), v3(x, fb, sz * zb), v3(x, fa, sz * za), ...mid, v3(x, ta, sz * za)], [-sx, 0, 0]);
    }
  }

  // ---------------------------------------------------------------- slot floor (|z| < n2): a rectilinear grid on every recess edge
  const zRows = uniq([-n2, -w2, w2, n2, ...lin(-w2, w2, o.nTrench ?? 8)]);
  const xIn = xEnd.slice(1, -1);                                // interior of the cross centre
  const xColsCore = [...xSlot.slice().reverse().map(x => -x), ...xIn, ...xSlot];   // from −Xe(n2) to +Xe(n2)
  const Xe = z => Math.sqrt(Math.max(0, rs * rs - z * z));
  const colsOf = z => [-Xe(z), ...xColsCore, Xe(z)];
  const Tslot = (inAx, inAz) => (x, z) => Math.min(ys, inAx ? F(Math.abs(x)) : Infinity, inAz ? F(Math.abs(z)) : Infinity, inAx && inAz ? cone(x, z) : Infinity);
  const nC = xColsCore.length + 1;                              // cells per row
  const cellFn = [];
  for (let j = 0; j < zRows.length - 1; j++) {
    const za = zRows[j], zb = zRows[j + 1], ca = colsOf(za), cb = colsOf(zb), zc = (za + zb) / 2;
    cellFn.push([]);
    for (let i = 0; i < nC; i++) {
      const xc = (ca[i] + ca[i + 1] + cb[i] + cb[i + 1]) / 4;
      const fn = Tslot(Math.abs(zc) < w2, Math.abs(xc) < w2);
      cellFn[j].push(fn);
      const p = (x, z) => v3(x, fn(x, z), z);
      S.quad(p(ca[i], za), p(ca[i + 1], za), p(cb[i + 1], zb), p(cb[i], zb), up);
    }
  }
  // walls between neighbouring slot cells at different heights (facing the lower one)
  const wallX = (x, za, zb, fl, fr) => {                        // vertical edge at x from za to zb; fl left cell, fr right cell
    const la = fl(x, za), lb = fl(x, zb), ra = fr(x, za), rb2 = fr(x, zb);
    if (Math.abs(la - ra) < 1e-7 && Math.abs(lb - rb2) < 1e-7) return;
    const leftHigh = la + lb > ra + rb2;
    S.quad(v3(x, la, za), v3(x, lb, zb), v3(x, rb2, zb), v3(x, ra, za), [leftHigh ? 1 : -1, 0, 0]);
  };
  const wallZ = (z, xa, xb2, fb, ft) => {                       // edge along x at z; fb cell below (smaller z), ft above
    const ba = fb(xa, z), bb = fb(xb2, z), ta = ft(xa, z), tb = ft(xb2, z);
    if (Math.abs(ba - ta) < 1e-7 && Math.abs(bb - tb) < 1e-7) return;
    const belowHigh = ba + bb > ta + tb;
    S.quad(v3(xa, ba, z), v3(xb2, bb, z), v3(xb2, tb, z), v3(xa, ta, z), [0, 0, belowHigh ? 1 : -1]);
  };
  for (let j = 0; j < zRows.length - 1; j++) {
    const za = zRows[j], zb = zRows[j + 1], ca = colsOf(za);
    for (let i = 0; i < nC - 1; i++) wallX(ca[i + 1], za, zb, cellFn[j][i], cellFn[j][i + 1]);
  }
  for (let j = 0; j < zRows.length - 2; j++) {
    const z = zRows[j + 1], c = colsOf(z);
    for (let i = 0; i < nC; i++) wallZ(z, c[i], c[i + 1], cellFn[j][i], cellFn[j + 1][i]);
  }
  // slot edge walls at z = ±n2 (|x| ≥ w2): the dome above, the slot floor below; they face into the slot
  for (const sz of [1, -1]) {
    const c = colsOf(sz * n2), jj = sz > 0 ? zRows.length - 2 : 0;
    for (let i = 0; i < nC; i++) {
      const xa = c[i], xb2 = c[i + 1]; if (Math.max(Math.abs(xa), Math.abs(xb2)) <= w2 + 1e-9 || Math.abs(xb2 - xa) < 1e-12) continue;
      const fn = cellFn[jj][i], z = sz * n2;
      const ta = H0(Math.hypot(xa, z)), tb = H0(Math.hypot(xb2, z)), fa = fn(xa, z), fb = fn(xb2, z);
      if (ta - fa < 1e-7 && tb - fb < 1e-7) continue;
      S.quad(v3(xa, ta, z), v3(xb2, tb, z), v3(xb2, fb, z), v3(xa, fa, z), [0, 0, -sz]);
    }
  }

  // ---------------------------------------------------------------- the lathe below the slot floor, on every angle used above
  const ang = [];
  for (const sz of [1, -1]) for (const [x, z] of bnd) ang.push(Math.atan2(x, sz * z));
  for (const z of zRows) for (const sx of [1, -1]) ang.push(Math.atan2(sx * Xe(z), z));
  const A = uniq(ang.map(a => ((a % TAU) + TAU) % TAU), 1e-10);
  const prof = [];                                              // (r, y), walked with the material on the left
  for (let i = 0; i <= 4; i++) { const t = (i / 4) * Math.PI / 2; prof.push([rb + ru - ru * Math.cos(t), -ru + ru * Math.sin(t)]); }   // under-head fillet
  prof.push([R - eb, 0]);
  for (let i = 1; i <= 4; i++) { const t = (i / 4) * Math.PI / 2; prof.push([R - eb + eb * Math.sin(t), eb - eb * Math.cos(t)]); }   // bearing edge round
  const yfc = fcy;                                              // side top = fillet centre height
  prof.push([R, yfc]);
  const tA = Math.atan2(fcy - dc, fcx);                         // fillet arc: from the side (angle 0) to the dome tangent
  for (let i = 1; i <= 10; i++) { const t = tA * i / 10; prof.push([fcx + rF * Math.cos(t), fcy + rF * Math.sin(t)]); }
  // the dome from the tangent point to rs (rs < rt in the default sizes, so this is the last point)
  if (rs < rt) prof.push([rs, ys]); else prof[prof.length - 1] = [rs, ys];
  const ring = (r, y, a) => [r * Math.sin(a), y, r * Math.cos(a)];
  for (let j = 0; j < prof.length - 1; j++) {
    const [r0, y0] = prof[j], [r1, y1] = prof[j + 1], dr = r1 - r0, dy = y1 - y0;
    for (let i = 0; i < A.length; i++) {
      const a = A[i], b = A[(i + 1) % A.length], am = (a + (b < a ? b + TAU : b)) / 2;
      const nh = [dy * Math.sin(am), -dr, dy * Math.cos(am)];   // outward: the profile tangent turned right
      S.quad(ring(r0, y0, a), ring(r0, y0, b), ring(r1, y1, b), ring(r1, y1, a), nh);
    }
  }
  const geometry = S.geometry(o.crease ?? 32);
  return { geometry, spec: { dk: o.dk, k, rf, rs: +rs.toFixed(4), slot: [o.slotWidth, o.slotDepth], cross: { m: o.crossSpan, wing: o.wing, depth: o.crossDepth }, shank: rb, underFillet: ru, angles: A.length } };
}
