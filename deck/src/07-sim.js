/* ============================================================================================
   sim: a small 2D frame solver for the deck's force simulations: lattices, arches, flat plates, beams, the board as a
   tie. Linear, small deflection, Euler-Bernoulli beams with rigid joints (or pin-jointed bars with `truss: true`).
   Units: mm, N, MPa (N/mm²), g. Every number a slide prints from it is DERIVED, and the slide says the model in a
   line: "2D frame, PP-C-20A (13.5 GPa), 0.9 mm ribs, 10 N at the crown".

   Solving is slow (a dense Cholesky, ~0.05 s for 600 unknowns), so solve once per load case with simSolve(key, fn) and
   animate the result: the model is linear, so a load scaled by k scales every displacement, force and stress by k.

   model = { nodes: [[x, y], ...], els: [{ i, j, w, h, E, rho, truss }], fix: { [node]: 'xy' | 'xyr' | 'x' | 'y' },
             loads: { [node]: [fx, fy, m] } }
     w = the section's width out of the plane (mm), h = its depth in the plane (mm): A = w·h, I = w·h³ / 12
   result = { d (3 per node: u, v, θ), N (axial, tension +), M1, M2, V, sig (peak fibre stress, MPa), U (strain energy,
              N·mm), mass (g per element), L, comp (f·d), mech (true when the frame is a mechanism: it cannot carry the load) }
   ============================================================================================ */
const SIM = { cache: new Map() };
/* materials with their sources (keys in SRC); print a property only with its source */
const SIM_MAT = {
  ppcf: { name: 'PP-C-20A', E: 13500, rho: 1.01e-3, src: 'shlPyrofil' },       /* Theseus: Pyrofil, 20 % carbon polypropylene */
  abs: { name: 'ABS', E: 2550, rho: 1.05e-3, src: 'denkaAbs' },                 /* most mice */
  mg: { name: 'Mg AZ91D', E: 46000, rho: 1.81e-3, src: 'az91d' },              /* metal shells */
  fr4: { name: 'FR4', E: 19000, rho: 1.85e-3, ft: 430, src: 'shlFr4' }         /* the board */
};
/** solve once and keep the result: key names the load case, fn builds the model */
function simSolve(key, fn) {
  let r = SIM.cache.get(key);
  if (!r) { const m = fn(); r = feSolve(m); r.model = m; SIM.cache.set(key, r); }
  return r;
}
function feSolve(m) {
  const nn = m.nodes.length, n = nn * 3, K = new Float64Array(n * n), F = new Float64Array(n);
  const ne = m.els.length, kl = [], Tm = [], Ls = [];
  for (let e = 0; e < ne; e++) {
    const el = m.els[e], [x1, y1] = m.nodes[el.i], [x2, y2] = m.nodes[el.j], L = Math.hypot(x2 - x1, y2 - y1) || 1e-9;
    const c = (x2 - x1) / L, s = (y2 - y1) / L, A = el.w * el.h, I = el.truss ? 0 : el.w * Math.pow(el.h, 3) / 12, E = el.E;
    const a = E * A / L, b1 = 12 * E * I / (L * L * L), b2 = 6 * E * I / (L * L), b3 = 4 * E * I / L, b4 = 2 * E * I / L;
    const k = [a, 0, 0, -a, 0, 0, 0, b1, b2, 0, -b1, b2, 0, b2, b3, 0, -b2, b4, -a, 0, 0, a, 0, 0, 0, -b1, -b2, 0, b1, -b2, 0, b2, b4, 0, -b2, b3];
    const T = [c, s, 0, 0, 0, 0, -s, c, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, c, s, 0, 0, 0, 0, -s, c, 0, 0, 0, 0, 0, 0, 1];
    /* kg = Tᵀ k T */
    const kT = new Float64Array(36), kg = new Float64Array(36);
    for (let r = 0; r < 6; r++) for (let q = 0; q < 6; q++) { let v = 0; for (let p = 0; p < 6; p++) v += k[r * 6 + p] * T[p * 6 + q]; kT[r * 6 + q] = v; }
    for (let r = 0; r < 6; r++) for (let q = 0; q < 6; q++) { let v = 0; for (let p = 0; p < 6; p++) v += T[p * 6 + r] * kT[p * 6 + q]; kg[r * 6 + q] = v; }
    const dof = [el.i * 3, el.i * 3 + 1, el.i * 3 + 2, el.j * 3, el.j * 3 + 1, el.j * 3 + 2];
    for (let r = 0; r < 6; r++) for (let q = 0; q < 6; q++) K[dof[r] * n + dof[q]] += kg[r * 6 + q];
    kl.push(k); Tm.push(T); Ls.push(L);
  }
  /* a node held only by pin-jointed bars has no rotational stiffness: give every rotation a whisper of it */
  let dmax = 0; for (let i = 0; i < n; i++) dmax = Math.max(dmax, K[i * n + i]);
  for (let i = 2; i < n; i += 3) K[i * n + i] += dmax * 1e-9;
  for (const [nd, f] of Object.entries(m.loads || {})) for (let q = 0; q < 3; q++) F[+nd * 3 + q] += f[q] || 0;
  const fixed = new Uint8Array(n);
  for (const [nd, how] of Object.entries(m.fix || {})) { const b = +nd * 3; if (how.includes('x')) fixed[b] = 1; if (how.includes('y')) fixed[b + 1] = 1; if (how.includes('r')) fixed[b + 2] = 1; }
  const free = []; for (let i = 0; i < n; i++) if (!fixed[i]) free.push(i);
  const nf = free.length, A = new Float64Array(nf * nf), bv = new Float64Array(nf);
  for (let r = 0; r < nf; r++) { bv[r] = F[free[r]]; for (let q = 0; q < nf; q++) A[r * nf + q] = K[free[r] * n + free[q]]; }
  /* Cholesky, in place; a pivot that vanishes means the frame is a mechanism */
  let mech = false;
  for (let j = 0; j < nf; j++) {
    let s = A[j * nf + j]; for (let p = 0; p < j; p++) s -= A[j * nf + p] * A[j * nf + p];
    if (!(s > dmax * 1e-11)) { mech = true; s = dmax * 1e-11; }
    const Ljj = Math.sqrt(s); A[j * nf + j] = Ljj;
    for (let i = j + 1; i < nf; i++) { let v = A[i * nf + j]; for (let p = 0; p < j; p++) v -= A[i * nf + p] * A[j * nf + p]; A[i * nf + j] = v / Ljj; }
  }
  const y = new Float64Array(nf); for (let i = 0; i < nf; i++) { let v = bv[i]; for (let p = 0; p < i; p++) v -= A[i * nf + p] * y[p]; y[i] = v / A[i * nf + i]; }
  const xf = new Float64Array(nf); for (let i = nf - 1; i >= 0; i--) { let v = y[i]; for (let p = i + 1; p < nf; p++) v -= A[p * nf + i] * xf[p]; xf[i] = v / A[i * nf + i]; }
  const d = new Float64Array(n); free.forEach((g, r) => { d[g] = xf[r]; });
  /* element forces */
  const N = [], M1 = [], M2 = [], V = [], sig = [], U = [], mass = [];
  let comp = 0; for (let i = 0; i < n; i++) comp += F[i] * d[i];
  for (let e = 0; e < ne; e++) {
    const el = m.els[e], T = Tm[e], k = kl[e], dg = [el.i * 3, el.i * 3 + 1, el.i * 3 + 2, el.j * 3, el.j * 3 + 1, el.j * 3 + 2].map(g => d[g]);
    const dl = new Float64Array(6); for (let r = 0; r < 6; r++) { let v = 0; for (let q = 0; q < 6; q++) v += T[r * 6 + q] * dg[q]; dl[r] = v; }
    const f = new Float64Array(6); for (let r = 0; r < 6; r++) { let v = 0; for (let q = 0; q < 6; q++) v += k[r * 6 + q] * dl[q]; f[r] = v; }
    const A0 = el.w * el.h, I0 = el.w * Math.pow(el.h, 3) / 12, Nn = f[3], Mm = Math.max(Math.abs(f[2]), Math.abs(f[5]));
    N.push(Nn); M1.push(-f[2]); M2.push(f[5]); V.push(f[1]);
    sig.push(Math.abs(Nn) / A0 + (el.truss ? 0 : Mm * (el.h / 2) / I0));
    let u = 0; for (let r = 0; r < 6; r++) u += dl[r] * f[r]; U.push(u / 2);
    mass.push((el.rho || 0) * A0 * Ls[e]);
  }
  return { d, N, M1, M2, V, sig, U, mass, L: Ls, comp, mech, dmax: Math.max(...m.nodes.map((_, i) => Math.hypot(d[i * 3], d[i * 3 + 1]))), smax: Math.max(...sig) };
}
/** the displacement of node i, [u, v] (mm) */
const feDisp = (r, i) => [r.d[i * 3], r.d[i * 3 + 1]];
/** points along element e, deflected by scale (Hermite shape functions, so a bent beam draws as a curve), in model mm */
function feElPts(r, e, scale = 1, nSeg = 10) {
  const m = r.model, el = m.els[e], [x1, y1] = m.nodes[el.i], [x2, y2] = m.nodes[el.j], L = r.L[e], c = (x2 - x1) / L, s = (y2 - y1) / L;
  const g = i => [r.d[i * 3], r.d[i * 3 + 1], r.d[i * 3 + 2]], [u1g, v1g, t1] = g(el.i), [u2g, v2g, t2] = g(el.j);
  const u1 = c * u1g + s * v1g, v1 = -s * u1g + c * v1g, u2 = c * u2g + s * v2g, v2 = -s * u2g + c * v2g, out = [];
  const nS = el.truss ? 1 : nSeg;
  for (let q = 0; q <= nS; q++) {
    const xi = q / nS, x2i = xi * xi, x3i = x2i * xi;
    const u = (1 - xi) * u1 + xi * u2;
    const v = el.truss ? (1 - xi) * v1 + xi * v2 : (1 - 3 * x2i + 2 * x3i) * v1 + L * (xi - 2 * x2i + x3i) * t1 + (3 * x2i - 2 * x3i) * v2 + L * (-x2i + x3i) * t2;
    const lx = xi * L + u * scale, ly = v * scale;
    out.push([x1 + c * lx - s * ly, y1 + s * lx + c * ly]);
  }
  return out;
}
/** the share of the frame's mass that is working: stressed above frac of the peak. Returns { g (grams working), total (g), share } */
function feEngaged(r, frac = 0.3) {
  let g = 0, tot = 0; r.sig.forEach((s, e) => { tot += r.mass[e]; if (s >= frac * r.smax) g += r.mass[e]; });
  return { g, total: tot, share: tot ? g / tot : 0 };
}
/** heat: how hard a part of the frame works, 0..1, as a colour. Cool is the ground's grey; hot is amber, then a bright
   pale orange. Never red: red is Theseus */
function heatCol(k) {
  k = clamp(k);
  const stops = TH ? ['#B9B8B2', '#C9A267', '#E07A10', '#B34E00'] : ['#4A4A46', '#9A7438', '#FF9A2E', '#FFE2B0'];
  const f = k * (stops.length - 1), i = Math.min(stops.length - 2, Math.floor(f));
  return mix(stops[i], stops[i + 1], f - i);
}
/**
 * draw a solved frame. P maps model mm to stage px ([x, y] → [sx, sy]).
 * o = { scale (deflection exaggeration), load (0..1, how much of the load is on now), heat (true: colour by stress),
 *       smax (the stress that reads as hot; default this frame's peak), w (px per mm of section depth, or a fixed px
 *       width with wpx), color, alpha, ghost (draw the unloaded frame faintly), nodes (dots at the joints),
 *       hide (e → true to skip an element), crack: e (draw that element breaking), crackK }
 */
function feDraw(r, P, o = {}) {
  const m = r.model, k = o.load == null ? 1 : o.load, sc = (o.scale || 1) * k, a = o.alpha == null ? 1 : o.alpha, smax = o.smax || r.smax || 1;
  if (a <= 0.003) return;
  G.save(); G.lineCap = 'round'; G.lineJoin = 'round';
  if (o.ghost) {
    G.globalAlpha = a * 0.35; G.strokeStyle = C.faint; G.lineWidth = 1.2; G.setLineDash([4, 4]); G.beginPath();
    m.els.forEach((el, e) => { if (o.hide && o.hide(e)) return; const p1 = P(m.nodes[el.i]), p2 = P(m.nodes[el.j]); G.moveTo(p1[0], p1[1]); G.lineTo(p2[0], p2[1]); });
    G.stroke(); G.setLineDash([]);
  }
  /* cool members first, hot ones on top */
  const order = m.els.map((_, e) => e).sort((p, q) => r.sig[p] - r.sig[q]);
  for (const e of order) {
    if (o.hide && o.hide(e)) continue;
    const el = m.els[e], pts = feElPts(r, e, sc, o.seg || 10).map(P);
    const hk = r.sig[e] * k / smax;
    G.globalAlpha = a; G.strokeStyle = o.heat === false ? (o.color || C.ink2) : heatCol(hk);
    G.lineWidth = o.wpx || Math.max(1.2, (o.w || 3) * el.h);
    G.beginPath(); pts.forEach((p, q) => q ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.stroke();
  }
  if (o.nodes) { G.globalAlpha = a; G.fillStyle = C.ink2; m.nodes.forEach((n0, i) => { const p = P([n0[0] + r.d[i * 3] * sc, n0[1] + r.d[i * 3 + 1] * sc]); G.beginPath(); G.arc(p[0], p[1], o.nodes === true ? 2.5 : o.nodes, 0, TAU); G.fill(); }); }
  G.restore();
}
/** force running through the frame, as dashes that travel along each member: their speed and weight follow |N|,
   tension runs out from the middle of a member, compression runs in. t drives the motion. o = { scale, load, alpha, color, nmax } */
function feFlow(r, P, t, o = {}) {
  const m = r.model, k = o.load == null ? 1 : o.load, sc = (o.scale || 1) * k, a = (o.alpha == null ? 1 : o.alpha) * clamp(k * 3);
  if (a <= 0.003) return;
  const nmax = o.nmax || Math.max(1e-9, ...r.N.map(Math.abs));
  G.save(); G.lineCap = 'round';
  m.els.forEach((el, e) => {
    const f = Math.abs(r.N[e]) / nmax; if (f < 0.04) return;
    const pts = feElPts(r, e, sc, 6).map(P), [p1, p2] = [pts[0], pts[pts.length - 1]], L = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]); if (L < 4) return;
    const dir = r.N[e] >= 0 ? 1 : -1, sp = 14 + 60 * f, ph = ((t * sp) % 22 + 22) % 22;
    G.globalAlpha = a * (0.35 + 0.65 * f); G.strokeStyle = o.color || (TH ? '#111111' : '#FFFFFF'); G.lineWidth = 1 + 3 * f;
    G.setLineDash([6, 16]); G.lineDashOffset = dir > 0 ? -ph : ph;
    /* from the middle outward (tension) or inward (compression): two halves, dashed in opposite senses */
    const mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    G.beginPath(); G.moveTo(mid[0], mid[1]); G.lineTo(p1[0], p1[1]); G.stroke();
    G.beginPath(); G.moveTo(mid[0], mid[1]); G.lineTo(p2[0], p2[1]); G.stroke();
  });
  G.setLineDash([]); G.restore();
}
/** a support glyph under a stage point: 'pin' (a triangle) or 'fix' (a hatched wall) or 'roll' (a triangle on rollers) */
function feSupport(p, kind = 'pin', o = {}) {
  const col = o.color || C.mute, a = o.alpha == null ? 1 : o.alpha, s = o.s || 14;
  G.save(); G.globalAlpha = a; G.strokeStyle = col; G.fillStyle = col; G.lineWidth = 1.5;
  if (kind === 'fix') { G.beginPath(); G.moveTo(p[0] - s, p[1]); G.lineTo(p[0] + s, p[1]); G.stroke(); for (let i = -s; i < s; i += 6) { G.beginPath(); G.moveTo(p[0] + i, p[1]); G.lineTo(p[0] + i - 6, p[1] + 7); G.stroke(); } }
  else { G.beginPath(); G.moveTo(p[0], p[1]); G.lineTo(p[0] - s * 0.7, p[1] + s); G.lineTo(p[0] + s * 0.7, p[1] + s); G.closePath(); G.stroke(); if (kind === 'roll') { circle(p[0] - s * 0.4, p[1] + s + 4, 3, { color: col, w: 1.5, alpha: a }); circle(p[0] + s * 0.4, p[1] + s + 4, 3, { color: col, w: 1.5, alpha: a }); } }
  G.restore();
}
/** helpers to build models: a polyline as a chain of beams, and a lattice of triangles or hexagons over a box */
function feChain(nodes, pts, sec, closed = false) {
  const base = nodes.length; pts.forEach(p => nodes.push(p));
  const els = []; for (let i = 0; i < pts.length - (closed ? 0 : 1); i++) els.push(Object.assign({ i: base + i, j: base + (i + 1) % pts.length }, sec));
  return { first: base, last: base + pts.length - 1, els };
}
/** a planar lattice of cells over [x0, x0 + w] × [y0, y0 + h], cell size s (mm): kind 'tri' or 'hex' (hexagons, pointy
   top) or 'sq'. Returns { nodes, els } with duplicate nodes merged; sec is spread into every element */
function feLattice(kind, x0, y0, w, h, s, sec) {
  const nodes = [], els = [], key = new Map(), seen = new Set();
  const nodeAt = (x, y) => { const kx = Math.round(x * 1000), ky = Math.round(y * 1000), k = kx + ',' + ky; if (!key.has(k)) { key.set(k, nodes.length); nodes.push([x, y]); } return key.get(k); };
  const bar = (p, q) => { const a = nodeAt(p[0], p[1]), b = nodeAt(q[0], q[1]); if (a === b) return; const k = a < b ? a + ',' + b : b + ',' + a; if (seen.has(k)) return; seen.add(k); els.push(Object.assign({ i: a, j: b }, sec)); };
  const inside = p => p[0] >= x0 - 1e-6 && p[0] <= x0 + w + 1e-6 && p[1] >= y0 - 1e-6 && p[1] <= y0 + h + 1e-6;
  if (kind === 'tri') {
    const rh = s * Math.sqrt(3) / 2, rows = Math.round(h / rh);
    for (let r = 0; r <= rows; r++) {
      const y = y0 + r * rh, off = (r % 2) * s / 2;
      for (let x = x0 - s; x <= x0 + w + s; x += s) {
        const p = [x + off, y];
        const q = [x + off + s, y]; if (inside(p) && inside(q)) bar(p, q);
        if (r < rows) { const u1 = [x + off + s / 2, y + rh], u2 = [x + off - s / 2, y + rh]; if (inside(p) && inside(u1)) bar(p, u1); if (inside(p) && inside(u2)) bar(p, u2); }
      }
    }
  } else if (kind === 'hex') {
    const R = s / Math.sqrt(3), dx = s, dy = 1.5 * R;
    for (let r = -1; r * dy <= h + dy; r++) for (let c = -1; c * dx <= w + dx; c++) {
      const cx = x0 + c * dx + (r % 2 ? dx / 2 : 0), cy = y0 + r * dy;
      const v = [0, 1, 2, 3, 4, 5].map(i => [cx + R * Math.cos(Math.PI / 6 + i * Math.PI / 3), cy + R * Math.sin(Math.PI / 6 + i * Math.PI / 3)]);
      for (let i = 0; i < 6; i++) { const p = v[i], q = v[(i + 1) % 6]; if (inside(p) && inside(q)) bar(p, q); }
    }
  } else {
    for (let y = y0; y <= y0 + h + 1e-6; y += s) for (let x = x0; x <= x0 + w + 1e-6; x += s) { if (x + s <= x0 + w + 1e-6) bar([x, y], [x + s, y]); if (y + s <= y0 + h + 1e-6) bar([x, y], [x, y + s]); }
  }
  /* drop nodes no bar uses */
  return { nodes, els };
}
