// Geometry helpers for the Theseus small parts. Units: millimetres.
// Everything here is deterministic and synchronous.
import * as THREE from 'three';

const { ShapeUtils } = THREE;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------------------------
// Normals: area-weighted smooth normals that split across creases (sharper than creaseDeg).
// three's toCreasedNormals hashes positions at 0.01 units, too coarse for 0.05 mm features,
// so this version hashes at `precision` (default 1e-4 mm) and weights faces by area.
// Returns a NON-indexed geometry (all attributes de-indexed).
export function creaseNormals(geometry, creaseDeg = 35, precision = 1e-4) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  if (g !== geometry) geometry.dispose();
  const pos = g.attributes.position.array;
  const n = pos.length / 3, faces = n / 3;
  const fn = new Float64Array(faces * 3), fa = new Float64Array(faces);
  for (let f = 0; f < faces; f++) {
    const o = f * 9;
    const ax = pos[o], ay = pos[o + 1], az = pos[o + 2];
    const ux = pos[o + 3] - ax, uy = pos[o + 4] - ay, uz = pos[o + 5] - az;
    const vx = pos[o + 6] - ax, vy = pos[o + 7] - ay, vz = pos[o + 8] - az;
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const l = Math.hypot(nx, ny, nz);
    fa[f] = l * 0.5;
    if (l > 0) { nx /= l; ny /= l; nz /= l; }
    fn[f * 3] = nx; fn[f * 3 + 1] = ny; fn[f * 3 + 2] = nz;
  }
  const inv = 1 / precision;
  const map = new Map();
  const ids = new Int32Array(n);
  let uniq = 0;
  for (let i = 0; i < n; i++) {
    const k = Math.round(pos[i * 3] * inv) + ',' + Math.round(pos[i * 3 + 1] * inv) + ',' + Math.round(pos[i * 3 + 2] * inv);
    let id = map.get(k);
    if (id === undefined) { id = uniq++; map.set(k, id); }
    ids[i] = id;
  }
  const start = new Int32Array(uniq + 1);
  for (let i = 0; i < n; i++) start[ids[i] + 1]++;
  for (let i = 0; i < uniq; i++) start[i + 1] += start[i];
  const cur = start.slice(0, uniq), bucket = new Int32Array(n);
  for (let i = 0; i < n; i++) bucket[cur[ids[i]]++] = (i / 3) | 0;
  const cd = Math.cos(THREE.MathUtils.degToRad(creaseDeg));
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const f = (i / 3) | 0, id = ids[i];
    const fx = fn[f * 3], fy = fn[f * 3 + 1], fz = fn[f * 3 + 2];
    let sx = 0, sy = 0, sz = 0;
    for (let b = start[id]; b < start[id + 1]; b++) {
      const g2 = bucket[b];
      const gx = fn[g2 * 3], gy = fn[g2 * 3 + 1], gz = fn[g2 * 3 + 2];
      if (fx * gx + fy * gy + fz * gz >= cd) { const w = fa[g2] + 1e-12; sx += gx * w; sy += gy * w; sz += gz * w; }
    }
    const l = Math.hypot(sx, sy, sz) || 1;
    out[i * 3] = sx / l; out[i * 3 + 1] = sy / l; out[i * 3 + 2] = sz / l;
  }
  g.setAttribute('normal', new THREE.BufferAttribute(out, 3));
  return g;
}

/** Build an indexed BufferGeometry from flat arrays. */
export function makeGeometry(positions, indices, uvs) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  if (uvs) g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  if (indices) g.setIndex(indices);
  return g;
}

// ---------------------------------------------------------------------------------------------
// 2D shapes
export function roundedRectShape(w, h, r, cx = 0, cy = 0, segs = 8) {
  const s = new THREE.Shape();
  addRoundedRect(s, w, h, r, cx, cy, false);
  return s;
}
export function roundedRectPath(w, h, r, cx = 0, cy = 0) {
  const p = new THREE.Path();
  addRoundedRect(p, w, h, r, cx, cy, true);
  return p;
}
function addRoundedRect(p, w, h, r, cx, cy, cw) {
  r = Math.min(r, w / 2 - 1e-6, h / 2 - 1e-6);
  const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2;
  if (!cw) {
    p.moveTo(x0 + r, y0); p.lineTo(x1 - r, y0); p.absarc(x1 - r, y0 + r, r, -Math.PI / 2, 0, false);
    p.lineTo(x1, y1 - r); p.absarc(x1 - r, y1 - r, r, 0, Math.PI / 2, false);
    p.lineTo(x0 + r, y1); p.absarc(x0 + r, y1 - r, r, Math.PI / 2, Math.PI, false);
    p.lineTo(x0, y0 + r); p.absarc(x0 + r, y0 + r, r, Math.PI, Math.PI * 1.5, false);
  } else {
    p.moveTo(x0 + r, y0); p.absarc(x0 + r, y0 + r, r, Math.PI * 1.5, Math.PI, true);
    p.lineTo(x0, y1 - r); p.absarc(x0 + r, y1 - r, r, Math.PI, Math.PI / 2, true);
    p.lineTo(x1 - r, y1); p.absarc(x1 - r, y1 - r, r, Math.PI / 2, 0, true);
    p.lineTo(x1, y0 + r); p.absarc(x1 - r, y0 + r, r, 0, -Math.PI / 2, true);
  }
}
export function circlePath(r, cx = 0, cy = 0, hole = true) {
  const p = hole ? new THREE.Path() : new THREE.Shape();
  p.absarc(cx, cy, r, 0, TAU, hole);
  return p;
}
/** Polygon with every corner filleted (radius per corner or one radius). pts: [[x,y],...] CCW. */
export function filletPolygon(pts, radius, asHole = false, arcSegs = 6) {
  const n = pts.length;
  const P = pts.map(p => new THREE.Vector2(p[0], p[1]));
  const out = [];
  for (let i = 0; i < n; i++) {
    const r = Array.isArray(radius) ? radius[i] : radius;
    const a = P[(i - 1 + n) % n], b = P[i], c = P[(i + 1) % n];
    const u = a.clone().sub(b).normalize(), v = c.clone().sub(b).normalize();
    const ang = Math.acos(THREE.MathUtils.clamp(u.dot(v), -1, 1));
    if (r <= 0 || ang > Math.PI - 1e-3) { out.push(b.clone()); continue; }
    const t = r / Math.tan(ang / 2);
    const p1 = b.clone().addScaledVector(u, t), p2 = b.clone().addScaledVector(v, t);
    const bis = u.clone().add(v).normalize();
    const ctr = b.clone().addScaledVector(bis, r / Math.sin(ang / 2));
    let a1 = Math.atan2(p1.y - ctr.y, p1.x - ctr.x), a2 = Math.atan2(p2.y - ctr.y, p2.x - ctr.x);
    const cross = u.x * v.y - u.y * v.x; // >0: convex for CW? determine sweep direction
    let da = a2 - a1;
    while (da > Math.PI) da -= TAU; while (da < -Math.PI) da += TAU;
    for (let s = 0; s <= arcSegs; s++) {
      const aa = a1 + da * s / arcSegs;
      out.push(new THREE.Vector2(ctr.x + r * Math.cos(aa), ctr.y + r * Math.sin(aa)));
    }
    void cross;
  }
  let pts2 = out;
  const cwNow = ShapeUtils.isClockWise(pts2);
  if (asHole !== cwNow) pts2 = pts2.slice().reverse();
  const p = asHole ? new THREE.Path(pts2) : new THREE.Shape(pts2);
  return p;
}

// ---------------------------------------------------------------------------------------------
// Extrusion with independent fillet/chamfer on each cap. The nominal contour is the side wall;
// caps are inset by the bevel. Extrudes along +Z from z = 0 to z = depth.
//   front/back: { r: inset, t: height along Z (default r), s: segments (1 = chamfer) } or null
export function extrude(shape, o = {}) {
  const depth = o.depth ?? 1;
  const curveSegments = o.curveSegments ?? 12;
  const F = normBevel(o.front), B = normBevel(o.back);
  const ext = shape.extractPoints(curveSegments);
  let outer = dedupe(ext.shape), holes = ext.holes.map(dedupe);
  if (ShapeUtils.isClockWise(outer)) outer = outer.slice().reverse();
  holes = holes.map(h => (ShapeUtils.isClockWise(h) ? h : h.slice().reverse()));
  const contours = [outer, ...holes];
  const moves = contours.map(insetDirs);

  // Ring levels: [inset, z]
  const levels = [];
  if (B) for (let j = 0; j <= B.s; j++) { const a = (j / B.s) * Math.PI / 2; levels.push([B.r * (1 - Math.sin(a)), B.t * (1 - Math.cos(a))]); }
  else levels.push([0, 0]);
  if (F) for (let j = 0; j <= F.s; j++) { const a = (j / F.s) * Math.PI / 2; levels.push([F.r * (1 - Math.cos(a)), depth - F.t + F.t * Math.sin(a)]); }
  else levels.push([0, depth]);

  const P = [], UV = [], I = [];
  const uvs = o.uvScale ?? 1;
  let base = 0;
  contours.forEach((c, ci) => {
    const mv = moves[ci], m = c.length;
    // arc length for UVs
    const len = [0];
    for (let i = 1; i <= m; i++) len.push(len[i - 1] + c[i % m].distanceTo(c[i - 1]));
    for (let L = 0; L < levels.length; L++) {
      const [d, z] = levels[L];
      for (let i = 0; i <= m; i++) {
        const k = i % m;
        P.push(c[k].x + mv[k].x * d, c[k].y + mv[k].y * d, z);
        UV.push(len[i] * uvs, z * uvs);
      }
    }
    for (let L = 0; L < levels.length - 1; L++) {
      for (let i = 0; i < m; i++) {
        const a = base + L * (m + 1) + i, b = a + 1, d2 = a + (m + 1), cc = d2 + 1;
        I.push(a, b, cc, a, cc, d2);
      }
    }
    base += levels.length * (m + 1);
  });
  // caps
  const capAt = (d, z, front) => {
    const oc = contours.map((c, ci) => c.map((p, k) => new THREE.Vector2(p.x + moves[ci][k].x * d, p.y + moves[ci][k].y * d)));
    const tris = ShapeUtils.triangulateShape(oc[0].slice(), oc.slice(1).map(h => h.slice()));
    const flat = oc.flat();
    const b0 = P.length / 3;
    for (const p of flat) { P.push(p.x, p.y, z); UV.push(p.x * uvs, p.y * uvs); }
    for (const t of tris) {
      const [a, b, c] = t;
      const A = flat[a], Bv = flat[b], C = flat[c];
      const area = (Bv.x - A.x) * (C.y - A.y) - (Bv.y - A.y) * (C.x - A.x);
      const ccw = area > 0;
      if (ccw === front) I.push(b0 + a, b0 + b, b0 + c); else I.push(b0 + a, b0 + c, b0 + b);
    }
  };
  capAt(B ? B.r : 0, 0, false);
  capAt(F ? F.r : 0, depth, true);
  const g = makeGeometry(P, I, UV);
  return o.raw ? g : creaseNormals(g, o.crease ?? 35);
}
function normBevel(b) {
  if (!b) return null;
  if (typeof b === 'number') return { r: b, t: b, s: 4 };
  return { r: b.r, t: b.t ?? b.r, s: b.s ?? 4 };
}
function dedupe(pts) {
  const out = [];
  for (const p of pts) if (!out.length || out[out.length - 1].distanceToSquared(p) > 1e-12) out.push(p);
  if (out.length > 1 && out[0].distanceToSquared(out[out.length - 1]) < 1e-12) out.pop();
  return out;
}
// inward (into material) miter directions; contour must have material on its LEFT
function insetDirs(c) {
  const m = c.length, out = [];
  for (let i = 0; i < m; i++) {
    const p0 = c[(i - 1 + m) % m], p1 = c[i], p2 = c[(i + 1) % m];
    const e1 = p1.clone().sub(p0).normalize(), e2 = p2.clone().sub(p1).normalize();
    const n1 = new THREE.Vector2(-e1.y, e1.x), n2 = new THREE.Vector2(-e2.y, e2.x);
    const v = n1.clone().add(n2);
    if (v.lengthSq() < 1e-12) { out.push(n1); continue; }
    v.normalize();
    const s = 1 / Math.max(0.35, v.dot(n1));
    out.push(v.multiplyScalar(s));
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Lathe around +Y. profile: [[r, y], ...] walked with the material on the LEFT
// (outer surfaces bottom→top; start/end on the axis for closed solids).
// Points may be {r, y} or [r, y]. Returns creased-normal geometry, uv.x = angle/TAU, uv.y = arc length.
export function lathe(profile, o = {}) {
  const segs = o.segments ?? 64, phi0 = o.phiStart ?? 0, phiL = o.phiLength ?? TAU;
  const pts = profile.map(p => (Array.isArray(p) ? p : [p.r, p.y]));
  const m = pts.length;
  const P = [], UV = [], I = [];
  const len = [0];
  for (let j = 1; j < m; j++) len.push(len[j - 1] + Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]));
  const uScale = o.uScale ?? 1, vScale = o.vScale ?? 1;
  for (let i = 0; i <= segs; i++) {
    const a = phi0 + phiL * i / segs, s = Math.sin(a), c = Math.cos(a);
    for (let j = 0; j < m; j++) {
      const [r, y] = pts[j];
      P.push(r * s, y, r * c);
      UV.push((i / segs) * uScale, len[j] * vScale);
    }
  }
  for (let i = 0; i < segs; i++) for (let j = 0; j < m - 1; j++) {
    const a = i * m + j, b = (i + 1) * m + j, c = b + 1, d = a + 1;
    // skip degenerate triangles on the axis
    if (pts[j][0] > 1e-9 || pts[j + 1][0] > 1e-9) {
      if (pts[j][0] > 1e-9) I.push(a, b, d);
      if (pts[j + 1][0] > 1e-9) I.push(b, c, d);
    }
  }
  const g = makeGeometry(P, I, UV);
  return o.raw ? g : creaseNormals(g, o.crease ?? 35);
}

/** Profile helper: quarter/partial arc from angle a0 to a1 (radians, in r-y plane) around (cr, cy). */
export function arc(cr, cy, rad, a0, a1, n = 6) {
  const out = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; out.push([cr + rad * Math.cos(a), cy + rad * Math.sin(a)]); }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Helical thread surface around +Y (one start). R(φ) is the radius as a function of the phase φ ∈ [0,1)
// within one pitch (φ = 0 at the crest of an external thread). The surface is a single helical strip,
// clamped to [y0, y1] and limited by envelope(y) (chamfers / run-out): r = clamp(R(φ), lo(y), hi(y)).
//   internal: true flips the winding (normals toward the axis).
export function helixThread(o) {
  const P = o.pitch, segs = o.segments ?? 48, y0 = o.y0, y1 = o.y1;
  const prof = o.profile; // array of [φ, r]
  const phase = o.phase ?? 0;
  const lo = o.lo || (() => -Infinity), hi = o.hi || (() => Infinity);
  const turns0 = Math.floor((y0 - phase * P) / P) - 1;
  const turns1 = Math.ceil((y1 - phase * P) / P) + 1;
  const nT = (turns1 - turns0) * segs;
  const m = prof.length;
  const Pos = [], UV = [], I = [];
  for (let i = 0; i <= nT; i++) {
    const t = turns0 + i / segs;       // turns
    const a = t * TAU;
    const s = Math.sin(a), c = Math.cos(a);
    for (let j = 0; j < m; j++) {
      const [ph, r0] = prof[j];
      let y = (t + ph + phase) * P;
      y = Math.min(y1, Math.max(y0, y));
      const r = Math.min(hi(y), Math.max(lo(y), r0));
      Pos.push(r * s, y, r * c);
      UV.push(t, ph);
    }
  }
  for (let i = 0; i < nT; i++) for (let j = 0; j < m - 1; j++) {
    const a = i * m + j, b = (i + 1) * m + j, c = b + 1, d = a + 1;
    if (o.internal) I.push(a, d, b, b, d, c); else I.push(a, b, d, b, c, d);
  }
  // (the strip edge at φ = 1 of turn t coincides with φ = 0 of turn t + 1, so the helix closes itself)
  const g = makeGeometry(Pos, I, UV);
  return creaseNormals(g, o.crease ?? 40);
}

/** ISO metric 60° thread profile in phase space (crest flat P/8 at φ=0, root flat P/4 at φ=0.5). */
export function isoProfile(rMajor, rMinor, rootRound = 0.0) {
  const pts = [[0, rMajor], [1 / 16, rMajor], [3 / 8, rMinor], [0.5, rMinor - rootRound], [5 / 8, rMinor], [15 / 16, rMajor], [1, rMajor]];
  return pts;
}

// ---------------------------------------------------------------------------------------------
// Helical straight knurl band around +Y: `count` ridges, helix lead `lead` (mm of Y per full turn of a
// ridge; Infinity = straight), triangular ridges of depth `depth`, tapering in over `taper` at both ends.
export function knurlBand(o) {
  const { R, depth, y0, y1, count } = o;
  const lead = o.lead ?? Infinity, taper = o.taper ?? 0.15, rings = o.rings ?? 24;
  const rCore = R - depth;
  const Pos = [], UV = [], I = [];
  const n = count * 2;
  for (let j = 0; j <= rings; j++) {
    const y = y0 + (y1 - y0) * j / rings;
    const twist = Number.isFinite(lead) ? (y / lead) * TAU : 0;
    const e = Math.min(1, Math.min(y - y0, y1 - y) / taper);   // 0 at ends → ridges sink to the core
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * TAU + twist;
      const ridge = i % 2 === 0;
      const r = ridge ? rCore + depth * e : rCore;
      Pos.push(r * Math.sin(a), y, r * Math.cos(a));
      UV.push(i / n, (y - y0));
    }
  }
  for (let j = 0; j < rings; j++) for (let i = 0; i < n; i++) {
    const a = j * (n + 1) + i, b = a + 1, c = a + (n + 1) + 1, d = a + (n + 1);
    I.push(a, b, c, a, c, d);
  }
  const g = makeGeometry(Pos, I, UV);
  return creaseNormals(g, o.crease ?? 30);
}

/** ISO 68-1 metric thread profiles in phase space (φ ∈ [0, 1) per pitch, φ = 0 at the external crest).
    External (rolled): crest flat P/8 at rMaj, 60° flanks, root rounded with radius `root` (ISO 965 allows 0.125P and
    up); internal: the mating groove with an axial gap `gap` on each flank and the radii given. Both return [[φ, r]]. */
export function isoExternal(P, rMaj, root = 0.18 * P, nArc = 7) {
  const t60 = Math.tan(Math.PI / 3), s0 = P / 16;                     // crest half-flat (P/8 wide)
  const rApex = rMaj - (P / 2 - s0) * t60;                            // the sharp V's root
  const rc = rApex + root / Math.sin(Math.PI / 6);                    // root circle centre (on the bisector)
  const pts = [[0, rMaj], [s0 / P, rMaj]];
  for (let i = 0; i <= nArc; i++) {                                   // root arc, tangent to both flanks (±60°)
    const th = -Math.PI / 3 + (2 * Math.PI / 3) * i / nArc;
    pts.push([(P / 2 + root * Math.sin(th)) / P, rc - root * Math.cos(th)]);
  }
  pts.push([1 - s0 / P, rMaj], [1, rMaj]);
  return pts;
}
export function isoInternal(P, rMaj, rMin, refMaj, gap = 0.02) {
  // flank position of the external thread (major refMaj, crest half-flat P/16) at radius r, from its crest centre
  const t60 = Math.tan(Math.PI / 3), sAt = r => P / 16 + (refMaj - r) / t60 + gap;
  const a = sAt(rMaj) / P, b = sAt(rMin) / P;
  return [[0, rMaj], [a, rMaj], [b, rMin], [1 - b, rMin], [1 - a, rMaj], [1, rMaj]];
}

/** Knurled band of sharp helical teeth around +Y (a heat-set insert's knurl): `count` teeth from rRoot to rTip, each
    tooth a trapezoid (root flat, flank, tip flat, flank) in angle, twisting with `lead` (mm of Y per turn; sign = hand).
    The tooth tops are cut by 45° chamfer cones at both ends of the band (`chamfer`), so every tooth ends in a crisp
    conical facet, as a rolled or cut knurl does; at the band's ends the surface sits at rRoot, against the body. */
export function knurlTeeth(o) {
  const { rRoot, rTip, y0, y1, count } = o;
  const lead = o.lead ?? Infinity, rings = o.rings ?? 36, per = o.per ?? 10;
  const tipFlat = o.tipFlat ?? 0.12, rootFlat = o.rootFlat ?? 0.1;   // fractions of the tooth period
  const ch = o.chamfer ?? 1.0;                                         // chamfer slope (Δr per Δy), 1 = 45°
  // one tooth period, as [u, r]: root flat, flank up, tip flat, flank down
  const u1 = rootFlat / 2, u2 = 0.5 - tipFlat / 2, u3 = 0.5 + tipFlat / 2, u4 = 1 - rootFlat / 2;
  const prof = u => (u < u1 || u > u4) ? 0 : u < u2 ? (u - u1) / (u2 - u1) : u <= u3 ? 1 : (u4 - u) / (u4 - u3);
  const us = [0, u1];
  const nf = Math.max(1, Math.round((per - 4) / 2));
  for (let i = 1; i < nf; i++) us.push(u1 + (u2 - u1) * i / nf);
  us.push(u2, u3);
  for (let i = 1; i < nf; i++) us.push(u3 + (u4 - u3) * i / nf);
  us.push(u4);
  const ring = [];
  for (let t = 0; t < count; t++) for (const u of us) ring.push((t + u) / count);
  const m = ring.length;
  const Pos = [], UV = [], I = [];
  for (let j = 0; j <= rings; j++) {
    const y = y0 + (y1 - y0) * j / rings;
    const twist = Number.isFinite(lead) ? (y / lead) * TAU : 0;
    const cap = rRoot + Math.max(0, Math.min(y - y0, y1 - y)) * ch;    // chamfer cones at both ends
    for (let i = 0; i <= m; i++) {
      const f = ring[i % m], u = (f * count) % 1;
      const r = Math.min(cap, rRoot + (rTip - rRoot) * prof(u));
      const a = f * TAU + twist;
      Pos.push(r * Math.sin(a), y, r * Math.cos(a));
      UV.push(i / m, y - y0);
    }
  }
  for (let j = 0; j < rings; j++) for (let i = 0; i < m; i++) {
    const a = j * (m + 1) + i, b = a + 1, c = a + (m + 1) + 1, d = a + (m + 1);
    I.push(a, b, c, a, c, d);
  }
  return creaseNormals(makeGeometry(Pos, I, UV), o.crease ?? 28);
}

// ---------------------------------------------------------------------------------------------
// Decode geometry produced by parts/tools/build_geo.py (quantized Uint16 positions + indices).
export function decodeGeo(rec, creaseDeg) {
  const b = Uint8Array.from(atob(rec.v), ch => ch.charCodeAt(0));
  const q = new Uint16Array(b.buffer, b.byteOffset, b.byteLength / 2);
  const n = q.length / 3, pos = new Float32Array(n * 3);
  const mn = rec.min, mx = rec.max;
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) pos[i * 3 + k] = mn[k] + (q[i * 3 + k] / 65535) * (mx[k] - mn[k]);
  const ib = Uint8Array.from(atob(rec.i), ch => ch.charCodeAt(0));
  const idx = rec.i32 ? new Uint32Array(ib.buffer) : new Uint16Array(ib.buffer);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  if (rec.uvBox) boxUV(g, rec.uvBox);
  return creaseNormals(g, creaseDeg ?? rec.crease ?? 32);
}
/** Planar UVs from a box projection axis ('x' | 'y' | 'z'). */
export function boxUV(g, axis = 'y', scale = 1) {
  const p = g.attributes.position, n = p.count, uv = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (axis === 'y') { uv[i * 2] = x * scale; uv[i * 2 + 1] = z * scale; }
    else if (axis === 'x') { uv[i * 2] = z * scale; uv[i * 2 + 1] = y * scale; }
    else { uv[i * 2] = x * scale; uv[i * 2 + 1] = y * scale; }
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return g;
}

// ---------------------------------------------------------------------------------------------
// Sweep a closed 2D section along a 3D polyline with rotation-minimizing frames.
// section: [[u, v], ...] (CCW, u along frame N, v along frame B). Ends capped (fan) if caps.
export function sweep(path, section, o = {}) {
  const pts = path.map(p => (p.isVector3 ? p.clone() : new THREE.Vector3(...p)));
  const n = pts.length, m = section.length;
  const T = [], N = [], Bn = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    T.push(b.clone().sub(a).normalize());
  }
  // initial normal
  let up = o.up ? new THREE.Vector3(...o.up) : new THREE.Vector3(0, 1, 0);
  if (Math.abs(up.normalize().dot(T[0])) > 0.95) {
    const t = T[0], ax = [Math.abs(t.x), Math.abs(t.y), Math.abs(t.z)];
    const i = ax.indexOf(Math.min(...ax));
    up = new THREE.Vector3(i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0);
  }
  N.push(up.clone().sub(T[0].clone().multiplyScalar(up.dot(T[0]))).normalize());
  Bn.push(new THREE.Vector3().crossVectors(T[0], N[0]));
  for (let i = 1; i < n; i++) {
    // double reflection (rotation minimizing)
    const v1 = pts[i].clone().sub(pts[i - 1]);
    const c1 = v1.dot(v1) || 1e-12;
    const rL = N[i - 1].clone().sub(v1.clone().multiplyScalar(2 * v1.dot(N[i - 1]) / c1));
    const tL = T[i - 1].clone().sub(v1.clone().multiplyScalar(2 * v1.dot(T[i - 1]) / c1));
    const v2 = T[i].clone().sub(tL);
    const c2 = v2.dot(v2) || 1e-12;
    const r = rL.sub(v2.clone().multiplyScalar(2 * v2.dot(rL) / c2)).normalize();
    N.push(r); Bn.push(new THREE.Vector3().crossVectors(T[i], r));
  }
  const scale = o.scale || (() => 1);
  const twist = o.twist || (() => 0);
  const P = [], UV = [], I = [];
  let L = 0;
  for (let i = 0; i < n; i++) {
    if (i) L += pts[i].distanceTo(pts[i - 1]);
    const s = scale(i / (n - 1)), tw = twist(i / (n - 1));
    const cs = Math.cos(tw), sn = Math.sin(tw);
    for (let j = 0; j <= m; j++) {
      const [u0, v0] = section[j % m];
      const u = (u0 * cs - v0 * sn) * s, v = (u0 * sn + v0 * cs) * s;
      P.push(pts[i].x + N[i].x * u + Bn[i].x * v, pts[i].y + N[i].y * u + Bn[i].y * v, pts[i].z + N[i].z * u + Bn[i].z * v);
      UV.push(j / m, L);
    }
  }
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < m; j++) {
    const a = i * (m + 1) + j, b = a + 1, c = a + (m + 1) + 1, d = a + (m + 1);
    I.push(a, d, c, a, c, b);
  }
  if (o.caps !== false) {
    for (const [i, flip] of [[0, true], [n - 1, false]]) {
      const c0 = P.length / 3;
      const s = scale(i / (n - 1));
      P.push(pts[i].x, pts[i].y, pts[i].z); UV.push(0.5, 0.5);
      for (let j = 0; j < m; j++) {
        const k = i * (m + 1) + j;
        P.push(P[k * 3], P[k * 3 + 1], P[k * 3 + 2]); UV.push(0, 0);
      }
      for (let j = 0; j < m; j++) {
        const a = c0 + 1 + j, b = c0 + 1 + ((j + 1) % m);
        if (flip) I.push(c0, b, a); else I.push(c0, a, b);
      }
      void s;
    }
  }
  const g = makeGeometry(P, I, UV);
  return o.raw ? g : creaseNormals(g, o.crease ?? 40);
}

/** Rounded rectangle section for sweeps (w along N, h along B), CCW. */
export function rectSection(w, h, r = 0, segs = 3) {
  if (r <= 0) return [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]];
  const out = [];
  const cs = [[w / 2 - r, -h / 2 + r, -Math.PI / 2], [w / 2 - r, h / 2 - r, 0], [-w / 2 + r, h / 2 - r, Math.PI / 2], [-w / 2 + r, -h / 2 + r, Math.PI]];
  for (const [cx, cy, a0] of cs) for (let s = 0; s <= segs; s++) { const a = a0 + (Math.PI / 2) * s / segs; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return out;
}
export function circleSection(r, n = 12) {
  const out = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * TAU; out.push([r * Math.cos(a), r * Math.sin(a)]); }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Small conveniences
export function meshOf(geom, mat, name, o = {}) {
  const m = new THREE.Mesh(geom, mat);
  m.name = name || '';
  m.castShadow = o.cast ?? true;
  m.receiveShadow = o.receive ?? true;
  return m;
}
/** Collect and dispose every geometry/material/texture under root (skipping those in `keep`). */
export function disposeTree(root, keep = new Set()) {
  const seen = new Set();
  root.traverse(o => {
    if (o.geometry && !seen.has(o.geometry)) { seen.add(o.geometry); o.geometry.dispose(); }
    const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
    for (const m of mats) {
      if (seen.has(m) || keep.has(m)) continue;
      seen.add(m);
      for (const k in m) { const v = m[k]; if (v && v.isTexture && !seen.has(v)) { seen.add(v); v.dispose(); } }
      m.dispose();
    }
  });
}
export const clamp01 = k => Math.min(1, Math.max(0, +k || 0));
export const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const lerp = (a, b, t) => a + (b - a) * t;

/** Seeded PRNG (mulberry32) for deterministic variation. */
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
