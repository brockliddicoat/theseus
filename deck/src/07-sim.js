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
/* materials with their sources (keys in SRC). ONE value per material across the film (K, 2026-11-06; MODELS-AUDIT §1): every
   file reads these and none keeps its own copy. Print a property only with its source. E: the modulus a frame uses (MPa);
   ft: the stretched (tensile) strength and fb: the bent (flexural) strength, Brock's F41.1 "two strengths" (MPa); fy: a
   metal's yield, where it bends for good; rho: g/mm³.
   FR4 is a woven laminate with two of each (Gund): across the weave (E, fb) and along it (EL, fbL). A board's weave can run
   either way, so the board's models take the lower (across); a slide that ranks FR4 as a material takes the higher (along),
   the one that doesn't flatter carbon PP, and says which. Gund gives one tensile figure, along the weave (ft).
   Magnesium is MatWeb's AZ91D-F, cast (44.8 GPa in tension; makeitfrom's 46 GPa is retired). Its source gives no bending
   strength, so fb is its ultimate, the generous figure (G5). ABS's ft is its yield (it breaks lower, at 35 MPa). */
const SIM_MAT = {
  ppcf: { name: 'PP-C-20A', E: 13500, ft: 120, fb: 207, rho: 1.01e-3, src: 'shlPyrofil' },          /* Theseus: Pyrofil, 20 % carbon PP: flexural E; JIS K7162, K7171 */
  abs: { name: 'ABS', E: 2550, ft: 50, fb: 82, rho: 1.05e-3, src: 'shlAbs' },                       /* most mice: Denka GR-2000: flexural E (ISO 178); yield; ISO 178 */
  mg: { name: 'Mg AZ91D', E: 44800, ft: 230, fb: 230, fy: 150, rho: 1.81e-3, src: 'shlMg' },        /* metal shells: MatWeb AZ91D-F, cast */
  fr4: { name: 'FR4', E: 18000, EL: 20000, ft: 430, fb: 483, fbL: 552, rho: 1.85e-3, src: 'shlFr4' } /* the board: Gund NEMA FR4, across / along the weave */
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
/** the share of the frame's mass that is working: stressed above frac of the peak. Returns { g (grams working), total (g), share }.
   Not for a printed share (M, MODELS-AUDIT §1, FLAWED as a measure): it counts an element's whole mass when one end's outer
   fibre passes the threshold (70 % where the material truly above 30 % is 34 %). Sample through each element's depth and
   length instead (shlSamples), against the true peak (r.smax), and say the rule on the slide. */
function feEngaged(r, frac = 0.3) {
  let g = 0, tot = 0; r.sig.forEach((s, e) => { tot += r.mass[e]; if (s >= frac * r.smax) g += r.mass[e]; });
  return { g, total: tot, share: tot ? g / tot : 0 };
}
/** F41.1, Brock's "two strengths": each element's use of its strength, 1 = it breaks: its axial stress over ft plus its
   bending stress at the worse end over fb (the solver's own fibre stress, split into its two parts and combined linearly:
   the model auditor's rule, review/b05.md 09:03). ft, fb: the material's (default PP-C-20A, 120 MPa stretched and 207 bent;
   for another, SIM_MAT[key].ft and .fb); an element may carry its own (el.ft, el.fb) in a model of two materials. A rigid
   joint zone (el.rigid, b06's) reports its rib's use (el.flex). Colour "how near it is to breaking" by this, red at 1, not
   by MPa: a bent part and a stretched part at the same MPa are not equally near their break.
   e.g. const u = feUse(r); feDraw(Object.assign({}, r, { sig: u.map(v => v * 207), smax: 207 }), P, { smax: 207 }) */
function feUse(r, ft = SIM_MAT.ppcf.ft, fb = SIM_MAT.ppcf.fb) {
  const els = r.model.els, u = els.map((el, e) => {
    const A = el.w * el.h, I = el.w * el.h * el.h * el.h / 12, sa = Math.abs(r.N[e]) / A;
    const sb = el.truss ? 0 : Math.max(Math.abs(r.M1[e]), Math.abs(r.M2[e])) * (el.h / 2) / I;
    return sa / (el.ft || ft) + sb / (el.fb || fb);
  });
  return u.map((v, e) => els[e].rigid && els[e].flex != null ? u[els[e].flex] : v);
}
/** SIM_MAT's figures in the old tables' units, rounded as the sources print them: E and EL in GPa, rho in g/cm³; ft, fb, fbL,
   fy in MPa. e.g. matOf('mg').E → 44.8 */
function matOf(key) { const m = SIM_MAT[key]; return { name: m.name, E: +(m.E / 1000).toFixed(2), EL: m.EL ? +(m.EL / 1000).toFixed(2) : undefined, ft: m.ft, fb: m.fb, fbL: m.fbL, fy: m.fy, rho: +(m.rho * 1000).toFixed(3), src: m.src }; }
/** the press (N) that breaks a frame solved at P newtons (the model is linear): P over its largest use (feUse; rigid joint
   zones left out: they are not material that breaks). e.g. feBreakAt(simSolve('strip', build), 10) → 109.0 */
function feBreakAt(r, P = 10, ft, fb) {
  let m = 0; feUse(r, ft, fb).forEach((u, e) => { if (!r.model.els[e].rigid) m = Math.max(m, u); });
  return m > 0 ? P / m : Infinity;
}
/** heat: how hard a part of the frame works, 0..1, as a colour. Cool is the ground's grey; then amber, orange, and red
   where it is about to fail (red is a problem in this deck; Theseus is blue) */
function heatCol(k) {
  k = clamp(k);
  const stops = TH ? ['#C4C3BD', '#E9B44C', '#F07A1A', '#D7263D'] : ['#4A4A46', '#C98F2E', '#FF7A2E', '#FF3B4A'];
  const f = k * (stops.length - 1), i = Math.min(stops.length - 2, Math.floor(f));
  return mix(stops[i], stops[i + 1], f - i);
}
/**
 * draw a solved frame. P maps model mm to stage px ([x, y] → [sx, sy]).
 * o = { scale (deflection exaggeration), load (0..1, how much of the load is on now), heat (true: colour by stress),
 *       smax (the stress that reads as hot; default this frame's peak), w (px per mm of section depth, or a fixed px
 *       width with wpx), color, alpha, ghost (draw the unloaded frame faintly), nodes (dots at the joints),
 *       hide (e → true to skip an element), fillet (px: round every joint with a fillet of that radius, as the
 *       Theseus lattice is everywhere, not only on the fillet slides) }
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
  if (o.fillet) feFillets(r, P, Object.assign({}, o, { sc, k, smax }));
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

/** fillets at every joint of a drawn frame: between each pair of neighbouring members at a node, the corner fills with
   an arc tangent to both members' edges (radius o.fillet px), in the colour of the harder-working member. Called by
   feDraw with { fillet }; P maps model mm to stage px, members are drawn o.w px per mm of depth (or o.wpx) */
function feFillets(r, P, o) {
  const m = r.model, sc = o.sc, k = o.k == null ? 1 : o.k, smax = o.smax || r.smax || 1, rf = o.fillet;
  const at = new Map();
  m.els.forEach((el, e) => { if (o.hide && o.hide(e)) return; for (const [n, other] of [[el.i, el.j], [el.j, el.i]]) { if (!at.has(n)) at.set(n, []); at.get(n).push({ e, other }); } });
  const pos = i => P([m.nodes[i][0] + r.d[i * 3] * sc, m.nodes[i][1] + r.d[i * 3 + 1] * sc]);
  G.save(); G.globalAlpha = o.alpha == null ? 1 : o.alpha;
  for (const [n, list] of at) {
    if (list.length < 2) continue;
    const p0 = pos(n);
    const arms = list.map(({ e, other }) => {
      const pts = feElPts(r, e, sc, 6).map(P), q = m.els[e].i === n ? pts[1] : pts[pts.length - 2];
      const dx = q[0] - p0[0], dy = q[1] - p0[1], L = Math.hypot(dx, dy) || 1, hw = (o.wpx || Math.max(1.2, (o.w || 3) * m.els[e].h)) / 2;
      return { e, ux: dx / L, uy: dy / L, ang: Math.atan2(dy, dx), hw };
    }).sort((p, q) => p.ang - q.ang);
    for (let i = 0; i < arms.length; i++) {
      const A = arms[i], B = arms[(i + 1) % arms.length];
      let th = B.ang - A.ang; if (th <= 0) th += TAU;
      if (th >= Math.PI * 0.98 || th < 0.05) continue;
      const hw = (A.hw + B.hw) / 2, half = th / 2;
      /* the bisector, and the fillet circle tangent to both members' facing edges */
      const bx = Math.cos(A.ang + half), by = Math.sin(A.ang + half), dC = (rf + hw) / Math.sin(half), cxp = p0[0] + bx * dC, cyp = p0[1] + by * dC;
      const tl = dC * Math.cos(half);
      const nA = [-A.uy, A.ux], nB = [B.uy, -B.ux];   /* the normals pointing into the corner */
      const T1 = [p0[0] + A.ux * tl + nA[0] * hw, p0[1] + A.uy * tl + nA[1] * hw], T2 = [p0[0] + B.ux * tl + nB[0] * hw, p0[1] + B.uy * tl + nB[1] * hw];
      const a1 = Math.atan2(T1[1] - cyp, T1[0] - cxp), a2 = Math.atan2(T2[1] - cyp, T2[0] - cxp);
      const hk = Math.max(r.sig[A.e], r.sig[B.e]) * k / smax;
      G.fillStyle = o.heat === false ? (o.color || C.ink2) : heatCol(hk);
      G.beginPath(); G.moveTo(p0[0] + A.ux * hw * 0.2, p0[1] + A.uy * hw * 0.2); G.lineTo(T1[0], T1[1]);
      /* the short way round, which is the side facing the node */
      let da = a2 - a1; while (da > Math.PI) da -= TAU; while (da < -Math.PI) da += TAU;
      G.arc(cxp, cyp, rf, a1, a1 + da, da < 0);
      G.lineTo(p0[0], p0[1]); G.closePath(); G.fill();
    }
  }
  G.restore();
}
