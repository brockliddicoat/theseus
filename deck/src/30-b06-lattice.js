/* ============================== B06: Shell II: triangles, arches, fibres, fillets (revamp v2, 2026-11-06) ==============================
   Nine slides, in film order (chapter 'shell', after b05_work, before b07_board):
     b06_lattice     Triangles, not hexagons            (replaces lattice, shlDeterminate)
     b06_light       Triangles win more on a light mouse (replaces shlThin)
     b06_arches      Interwoven arches form triangles    (replaces shbArches)
     b06_arch        Why an arch holds                   (replaces shbPress, shbBend)
     b06_thrust      The thrust line                     (replaces shbThrust)
     b06_fibres      Fibres along the load               (replaces shbFibres, shbFlow)
     b06_fillet      Why corners get fillets             (replaces fillet)
     b06_filletsize  Fillet size, solved at equal mass   (replaces filletsize)
     b06_mold        What a fillet buys the mold         (replaces shbWidth, shbMill, shbMillDirect, shbTol)
   Every model number is derived and each slide names its model in a line. Reused from the old shell files (by calling
   them): 07-sim.js (feSolve, simSolve, feDraw, feFlow, heatCol), 10-d2-arches.js (shbArch, shbBlend, shbThrustLine,
   shbStokes's method, shbFibres, shbFlowCase, shbNodeOutline, SHB_SEC), 10-d-shell.js (shlFilletImg, SHL_GAMMA),
   09-fillet-data.js (FILLET), 03-parts.js (SORA_HALF). Helpers here are b06_*, data B06_*. */

Object.assign(SRC, {
  b06Johnson: { t: 'Johnson, Hagberg, Wigaeus Hjelm and Rempel, "Measuring and characterizing force exposures during computer mouse use", Scand J Work Environ Health 26(5) (2000) 398-405: in regular work, mean side (grip) force 0.43 N, mean button force 0.35 N', u: 'https://www.sjweh.fi/article/560' },
  b06PbsStraws: { t: 'PBS Building Big (WGBH), "Activity: Straw Shapes": "Straws arranged into triangles form more stable shapes than straws arranged into squares"; "When compression is applied to a square ... the joints rotate easily, and the shape changes"', u: 'https://www.pbs.org/wgbh/buildingbig/educator/act_straw_ei.html' },
  b06TeachEng: { t: 'TeachEngineering (University of Colorado Boulder, 2013), "Triangles & Trusses": "If you push down on top of the square, it will no longer be a square"; "This is why a triangle cannot collapse!"', u: 'https://www.teachengineering.org/lessons/view/cub_trusses_lesson01' },
  b06FmPatent: { t: 'Finalmouse LLC, US patent 10,983,609 (2021), "Computer mouse with lightweight housing": the openings "may be hexagonal forming a honeycomb framework that provides a rigid housing"; other polygons are possible and "the choice of shape types ... may be a matter of design choice"', u: 'https://ipiq.io/patents/2558819' },
  b06Egg: { t: 'IOP Spark (Institute of Physics), "Egg-stra tough": squeeze a raw egg evenly, "you can\'t break it by squeezing it!", thanks to its "arched shape"; Science World, "Unsqueezable Egg": squeezed top and bottom between thumb and forefinger, "the egg is strongest at the top and the bottom"; an uneven force cracks it', u: 'https://spark.iop.org/egg-stra-tough' },
  b06PontDuGard: { t: 'Wikipedia, Pont du Gard: built about 40 to 60 AD, "constructed largely without the use of mortar or clamps"; blocks of up to 6 tons; 48.8 m tall', u: 'https://en.wikipedia.org/wiki/Pont_du_Gard' },
  b06Gaudi: { t: 'Gaudí\'s hanging model for the church of Colònia Güell (commissioned 1898): "hemp ropes attached to lead-filled sacks", 1:10 scale, read upside down; only the crypt was built (1908 to 1915). Wikipedia, Church of Colònia Güell; Sagrada Família blog (J. Tomàs, 2025): "a string weighed down with a little bag of birdshot"', u: 'https://en.wikipedia.org/wiki/Church_of_Col%C3%B2nia_G%C3%BCell' },
  b06Wood: { t: 'USDA Forest Products Laboratory, Wood Handbook (FPL-GTR-190, 2010), ch. 5 (Kretschmann): Douglas-fir, interior north, clear and green: tension parallel to grain 107,600 kPa (Table 5-7), tension perpendicular to grain 2,300 kPa (Table 5-3a)', u: 'https://research.fs.usda.gov/treesearch/37427' },
  b06Comet: { t: 'FAA Lessons Learned, de Havilland DH-106 Comet 1: the "relatively squarish windows were creating stress concentrations much higher than anticipated"; G-ALYP (Elba, 10 Jan 1954, 1,290 pressurised flights) and G-ALYY (Naples, 8 Apr 1954); the tank-tested G-ALYU failed at a corner of the squarish forward escape hatch window; the Comet 1XB "changed the window shape from squarish to the conventional oval"', u: 'https://www.faa.gov/lessons_learned/transport_airplane/accidents/G-ALYV' },
  b06RapidDirect: { t: 'RapidDirect (F. Peng, 2025), "Sharp Corners in Injection Molding": "the sharp edges in injection molds themselves are subjected to high stress and repeated abrasion. They degrade faster, which reduces mold life"; "Sharp internal corners often require EDM"; melt slows or stops in dead zones at sharp corners; inside radius at least 0.5 times the wall', u: 'https://www.rapiddirect.com/blog/sharp-corner-rules-for-injection-molding/' },
  b06Model: { t: 'This deck, Shell II models: 2D frames (07-sim.js, Euler-Bernoulli beams, PP-C-20A 13.5 GPa, 120 MPa break): a 62.5 mm lattice strip of 12.5 mm cells, 2.0 mm tall ribs, on a pin and a roller, 10 N over its middle, triangles (1.0 mm ribs) against one row of hexagons at the same weight; the arch and plate of 10-d2-arches.js; a Stokes flow through a 3-arm and a 6-arm node with fibres turned by Jeffery\'s equation; plane-stress finite elements (Q4, O-grid, quarter model) of a skin with a squarish and an oval window under 2:1 biaxial tension', n: 'derived, this model' }
});

/* ============================== models ============================== */
const B06 = { c: {} };
/** compute once and keep */
function b06_once(k, fn) { if (!(k in B06.c)) B06.c[k] = fn(); return B06.c[k]; }

/* ---------- the melt at a lattice node, for any set of arms (generalises 10-d2-arches.js's shbStokes, which is the 6-arm
   case). arms: angles in degrees (ascending, 0..360), flux: the share of the melt each arm carries (outflow +, inflow -,
   summing to 0); r: the fillet radius at every corner between neighbouring arms (mm). Stream function and vorticity on a
   grid h mm, solved by over-relaxation; the steel islands between arms hold their own psi; the open ends carry a parabolic
   (Poiseuille) profile. Returns the field in the form shbFibres (10-d2-arches.js) reads. */
function b06_stokes(arms, flux, r, o = {}) {
  const W = o.W || 1.0, Lr = o.L || 4.2, h = o.h || 1 / 14, N = Math.round(2 * Lr / h) + 1, c = (N - 1) / 2, n = N * N;
  const X = i => (i - c) * h, Y = j => (j - c) * h, na = arms.length, A = arms.map(a => a * Math.PI / 180), half = W / 2;
  const U = A.map(a => [Math.cos(a), Math.sin(a)]);
  /* which island (sector between arm k and arm k + 1) an angle falls in, and that sector's bisector and half-gap */
  const gap = k => { let g = A[(k + 1) % na] - A[k]; if (g <= 0) g += TAU; return g; };
  const sect = an => { const a = ((an % TAU) + TAU) % TAU; for (let k = 0; k < na; k++) { const a0 = A[k], g = gap(k); let d = a - a0; if (d < 0) d += TAU; if (d < g) return k; } return 0; };
  const fluid = new Uint8Array(n), island = new Int8Array(n).fill(-1);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const x = X(i), y = Y(j), k = j * N + i;
    let f = false;
    for (let q = 0; q < na; q++) { const s = x * U[q][0] + y * U[q][1], p = -x * U[q][1] + y * U[q][0]; if (s >= -1e-9 && Math.abs(p) <= half + 1e-9) { f = true; break; } }
    if (Math.hypot(x, y) < half * 0.999) f = true;
    const isl = sect(Math.atan2(y, x));
    if (!f && r > 0) {
      const hg = gap(isl) / 2, b = A[isl] + hg, ux = Math.cos(b), uy = Math.sin(b), tipD = half / Math.sin(hg);
      const sAl = x * ux + y * uy - tipD, nn = -x * uy + y * ux, dc = r / Math.sin(hg), tlen = r / Math.tan(hg);
      if (sAl < tlen * Math.cos(hg) && Math.hypot(sAl - dc, nn) > r) f = true;
    }
    if (Math.hypot(x, y) > Lr) f = false;
    fluid[k] = f ? 1 : 0; if (!f) island[k] = isl;
  }
  const psiIsl = new Float64Array(na); for (let k = 0; k < na; k++) psiIsl[k] = (k ? psiIsl[k - 1] : 0) + flux[k];
  const psi = new Float64Array(n), om = new Float64Array(n), isB = new Uint8Array(n);
  for (let k = 0; k < n; k++) if (!fluid[k]) psi[k] = psiIsl[island[k]];
  const Rr = Lr - 1.5 * h;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i; if (!fluid[k]) continue; const x = X(i), y = Y(j);
    if (Math.hypot(x, y) > Rr) {
      /* the nearest arm's open end: a parabolic profile across it */
      let arm = 0, best = -2; for (let q = 0; q < na; q++) { const d = (x * U[q][0] + y * U[q][1]) / Math.hypot(x, y); if (d > best) { best = d; arm = q; } }
      const th = A[arm], eta = clamp((-Math.sin(th) * x + Math.cos(th) * y) / W + 0.5), p0 = psiIsl[(arm + na - 1) % na], q = psiIsl[arm] - p0;
      psi[k] = p0 + q * (3 * eta * eta - 2 * eta * eta * eta); om[k] = -q * (6 - 12 * eta) / (W * W); isB[k] = 1;
    }
  }
  const inner = [], wallN = [];
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const k = j * N + i;
    if (fluid[k] && !isB[k]) inner.push(k);
    if (!fluid[k]) { const nb = [k - 1, k + 1, k - N, k + N].filter(q => fluid[q]); if (nb.length) wallN.push([k, nb]); }
  }
  const h2 = h * h, wS = 1.6, wO = 1.0, relW = 0.1, its = o.iters || 2500;
  for (let it = 0; it < its; it++) {
    for (const [k, nb] of wallN) { let sm = 0; for (const q of nb) sm += -2 * (psi[q] - psi[k]) / h2; om[k] = om[k] * (1 - relW) + relW * sm / nb.length; }
    for (const k of inner) { const v = 0.25 * (om[k - 1] + om[k + 1] + om[k - N] + om[k + N]); om[k] += wO * (v - om[k]); }
    for (const k of inner) { const v = 0.25 * (psi[k - 1] + psi[k + 1] + psi[k - N] + psi[k + N] + h2 * om[k]); psi[k] += wS * (v - psi[k]); }
  }
  const u = new Float64Array(n), v = new Float64Array(n), gxx = new Float64Array(n), gxy = new Float64Array(n), gyx = new Float64Array(n), gyy = new Float64Array(n);
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) { const k = j * N + i; if (!fluid[k]) continue; u[k] = (psi[k + N] - psi[k - N]) / (2 * h); v[k] = -(psi[k + 1] - psi[k - 1]) / (2 * h); }
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const k = j * N + i; if (!fluid[k]) continue;
    gxx[k] = (u[k + 1] - u[k - 1]) / (2 * h); gxy[k] = (u[k + N] - u[k - N]) / (2 * h); gyx[k] = (v[k + 1] - v[k - 1]) / (2 * h); gyy[k] = (v[k + N] - v[k - N]) / (2 * h);
  }
  const at = (F, x, y) => { const fi = x / h + c, fj = y / h + c, i0 = Math.floor(fi), j0 = Math.floor(fj); if (i0 < 0 || j0 < 0 || i0 >= N - 1 || j0 >= N - 1) return 0; const fx = fi - i0, fy = fj - j0, k = j0 * N + i0; return (1 - fx) * (1 - fy) * F[k] + fx * (1 - fy) * F[k + 1] + (1 - fx) * fy * F[k + N] + fx * fy * F[k + N + 1]; };
  return { N, h, c, X, Y, fluid, psi, u, v, gxx, gxy, gyx, gyy, at, Lr, W, r, arms, A };
}
/** fibres through a node: shbFibres's tracer (seeded across the inlet on the left, carried and turned by Jeffery's
   equation), each fibre's exit arm taken as the nearest of this node's arms, and its alignment there (Krenchel cos⁴) */
function b06_fibreCase(key, arms, flux, r) {
  return b06_once('flow:' + key, () => {
    const F = b06_stokes(arms, flux, r), fb = shbFibres(F, { n: 160, dt: 0.04 });
    fb.forEach(f => {
      const [x, y, an] = f.smp[f.smp.length - 1], ex = Math.atan2(y, x); let best = 0, bd = 9;
      F.A.forEach((a, q) => { let d = Math.abs(((ex - a) % TAU + TAU + Math.PI) % TAU - Math.PI); if (d < bd) { bd = d; best = q; } });
      const th = F.A[best], cs = Math.abs(Math.cos(an) * Math.cos(th) + Math.sin(an) * Math.sin(th));
      f.arm = best; f.mis = Math.acos(Math.min(1, cs)) * 180 / Math.PI; f.c4 = cs * cs * cs * cs;
    });
    const out = fb.filter(f => Math.abs(F.arms[f.arm] - 180) > 1);
    const c4 = L => L.length ? L.reduce((s, f) => s + f.c4, 0) / L.length : 0, w30 = L => L.length ? L.filter(f => f.mis <= 30).length / L.length : 0;
    return { F, fb, out, all: c4(out), w30: w30(out), byArm: F.arms.map((_, q) => c4(out.filter(f => f.arm === q))) };
  });
}

/* ---------- the lattice as a bridge: a strip of it across the top of the shell (62.5 mm, about the mouse's width), laid
   flat on two supports and pressed in the middle. Triangles: a Warren truss of 12.5 mm cells (the study lattice's edge),
   19 ribs; hexagons: one row of whole 12.5 mm cells (no wall left hanging, F2.37), 26 walls, their width scaled so the two
   weigh the same. Ribs 2.0 mm tall (out of the plane), PP-C-20A. Pin under the left end, roller under the right, the
   press on the middle top node. t = the triangles' rib width (mm). */
const B06_BR = { n: 5, a: 12.5, rib: 2.0, P: 10 };
function b06_strip(kind, t) {
  const { n, a } = B06_BR, M = SIM_MAT.ppcf, nodes = [], els = [], sec = h => ({ w: B06_BR.rib, h, E: M.E, rho: M.rho });
  if (kind === 'tri') {
    const Hh = a * Math.sqrt(3) / 2;
    for (let i = 0; i <= n; i++) nodes.push([i * a, 0]);
    for (let j = 0; j < n; j++) nodes.push([(j + 0.5) * a, Hh]);
    const T = j => n + 1 + j, add = (i, j) => els.push(Object.assign({ i, j }, sec(t)));
    for (let i = 0; i < n; i++) add(i, i + 1);
    for (let j = 0; j < n - 1; j++) add(T(j), T(j + 1));
    for (let j = 0; j < n; j++) { add(j, T(j)); add(T(j), j + 1); }
    return { nodes, els, kind, bl: 0, br: n, mid: T(Math.floor(n / 2)), H: Hh, span: n * a };
  }
  const R = a / Math.sqrt(3), map = new Map(), seen = new Set(), th = t * b06_triLen() / b06_hexLen();
  const nid = p => { const k = Math.round(p[0] * 1000) + ',' + Math.round(p[1] * 1000); if (!map.has(k)) { map.set(k, nodes.length); nodes.push(p); } return map.get(k); };
  for (let c = 0; c < n; c++) {
    const cx = a / 2 + c * a, v = [0, 1, 2, 3, 4, 5].map(k => { const an = -Math.PI / 2 + k * Math.PI / 3; return nid([cx + R * Math.cos(an), R + R * Math.sin(an)]); });
    for (let k = 0; k < 6; k++) { const p = v[k], q = v[(k + 1) % 6], key = p < q ? p + ',' + q : q + ',' + p; if (!seen.has(key)) { seen.add(key); els.push(Object.assign({ i: p, j: q }, sec(th))); } }
  }
  /* supports under the two end walls' lower corners (the span the same 62.5 mm), the press on the middle cell's top */
  let bl = 0, br = 0, mid = 0;
  nodes.forEach((p, i) => { if (p[0] < 1e-6 && p[1] < R) bl = i; if (p[0] > n * a - 1e-6 && p[1] < R) br = i; if (Math.abs(p[0] - n * a / 2) < 1e-6 && p[1] > 1.5 * R) mid = i; });
  return { nodes, els, kind, bl, br, mid, H: 2 * R, span: n * a, th };
}
const b06_lenOf = m => m.els.reduce((s, el) => s + Math.hypot(m.nodes[el.j][0] - m.nodes[el.i][0], m.nodes[el.j][1] - m.nodes[el.i][1]), 0);
function b06_triLen() { return b06_once('triLen', () => b06_lenOf(b06_strip('tri', 1))); }
function b06_hexLen() { return b06_once('hexLen', () => { const a = B06_BR.a, R = a / Math.sqrt(3); return 26 * R; }); }
/** the strip solved under 10 N at the middle (cached per rib width, to the micron) */
function b06_bridge(kind, t) {
  const tk = Math.round(t * 1000) / 1000;
  return simSolve('b06br:' + kind + ':' + tk, () => { const m = b06_strip(kind, tk); m.fix = { [m.bl]: 'xy', [m.br]: 'y' }; m.loads = { [m.mid]: [0, -B06_BR.P, 0] }; return m; });
}
const b06_flex = r => -r.d[r.model.mid * 3 + 1];
const b06_grams = r => r.mass.reduce((s, v) => s + v, 0);
/** the press that takes the strip's peak to the break (PP-C-20A, 120 MPa: F12.12), N */
const B06_FT = 120;
const b06_maxPress = r => B06_BR.P * B06_FT / r.smax;
/** the hottest joint: the node at the more loaded end of the most stressed rib */
function b06_hotNode(r) { const e = r.sig.indexOf(r.smax), el = r.model.els[e]; return Math.abs(r.M1[e]) >= Math.abs(r.M2[e]) ? { node: el.i, other: el.j, e } : { node: el.j, other: el.i, e }; }
/** the weight sweep of b06_light: rib width 1.0 → 0.5 mm (the triangles'), both kinds, sampled for the chart */
function b06_sweep() {
  return b06_once('sweep', () => { const out = []; for (let i = 0; i <= 40; i++) { const t = 1.0 - 0.5 * i / 40, T = b06_bridge('tri', t), X = b06_bridge('hex', t); out.push({ t, g: b06_grams(T), mT: b06_maxPress(T), mH: b06_maxPress(X), fT: b06_flex(T), fH: b06_flex(X) }); } return out; });
}
/** the weight at which the hexagons' max press falls to the 10 N press (they break under it): by bisection on rib width */
function b06_hexBreakT() { return b06_once('hexBreakT', () => { let lo = 0.5, hi = 1.0; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (b06_maxPress(b06_bridge('hex', m)) < B06_BR.P) lo = m; else hi = m; } return Math.round(hi * 1000) / 1000; }); }

/**
 * Draw a solved strip as it sits: (x0, ys) the left support's stage point, s px per mm, E the flex exaggeration, k how much
 * of the press is on (0..1). Ribs at their true width with every joint filleted (0.6 mm, F9.27), coloured on the chapter's
 * squared heat scale against smax (F19.3), the supports, and the force running in the ribs. o = { alpha, smax, flow (0..1),
 * t (for the flow), heat (false: one colour), color, frozen: a solved frame to draw instead (a cracked strip stops moving),
 * crack (0..1) }. Returns { P, contact (the top of the rib under the press, stage px), hot (the hottest joint, stage px) }.
 */
function b06_drawStrip(r, x0, ys, s, E, k, o = {}) {
  const m = r.model, a = o.alpha == null ? 1 : o.alpha, yS = m.nodes[m.bl][1];
  const P = p => [x0 + p[0] * s, ys - (p[1] - yS) * s], def = i => [m.nodes[i][0] + r.d[i * 3] * E * k, m.nodes[i][1] + r.d[i * 3 + 1] * E * k];
  const tw0 = m.els[0].h, out = { P };
  if (a > 0.003) {
    const smax = o.smax || r.smax, rG = o.heat === false ? r : shlSigG(r, smax, Math.max(1e-6, k));
    feDraw(rG, P, { scale: E, load: k, smax, w: s, alpha: a, seg: 12, fillet: 0.6 * s, heat: o.heat, color: o.color });
    if (o.flow) feFlow(r, P, o.t, { scale: E, load: k, alpha: a * o.flow, nmax: o.nmax });
    /* supports: a pin under the left end, a roller under the right, under the rib's lower edge */
    const pl = P(m.nodes[m.bl]), pr = P(m.nodes[m.br]);
    feSupport([pl[0], pl[1] + tw0 * s * 0.5 + 2], 'pin', { alpha: a, s: 16, color: C.mute });
    feSupport([pr[0], pr[1] + tw0 * s * 0.5 + 2], 'roll', { alpha: a, s: 16, color: C.mute });
  }
  const c = P(def(m.mid)); out.contact = [c[0], c[1] - tw0 * s * 0.5];
  const hn = b06_hotNode(r); out.hot = P(def(hn.node)); out.hotOther = P(def(hn.other));
  if (o.crack > 0.003) b06_crack(out.hot, out.hotOther, tw0 * s, o.crack, a);
  return out;
}
/** a crack across a rib at a joint: a jagged red line across the rib's width, opening with k */
function b06_crack(p, q, wpx, k, a = 1) {
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1, ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L, nx = -uy, ny = ux;
  const c = [p[0] + ux * wpx * 0.9, p[1] + uy * wpx * 0.9], h = wpx * 0.5 + 6, n = 5, R0 = rng(3), pts = [];
  for (let i = 0; i <= n; i++) { const f = -1 + 2 * i / n, j = (R0() - 0.5) * wpx * 0.5; pts.push([c[0] + nx * f * h * clamp(k * 1.4) + ux * j, c[1] + ny * f * h * clamp(k * 1.4) + uy * j]); }
  G.save(); G.globalAlpha = a; G.strokeStyle = C.red; G.lineWidth = 3; G.lineJoin = 'round'; G.lineCap = 'round';
  G.beginPath(); pts.forEach((pt, i) => i ? G.lineTo(pt[0], pt[1]) : G.moveTo(pt[0], pt[1])); G.stroke(); G.restore();
}

/* the two bridges' places, shared by b06_lattice and b06_light so one hands off to the other (M9): the split, the scale,
   the supports' line */
const B06_SPLIT = [80, 290, 1760, 400], B06_S = 9.6, B06_YS = 520, B06_E = 10;
/** the press on a bridge: a fingertip straight down onto the middle (to about 2/3 scale, so it doesn't hide the cells) and
   the force growing to 10 N beside it */
function b06_press(t, c, k, a, o = {}) {
  if (a <= 0.003) return;
  finger(c[0], c[1], Math.PI / 2, { s: 6.2, press: k, len: 15, alpha: a });
  forceArrow(c[0] + 64, c[1] - 2, Math.PI / 2, 84, { k, N: B06_BR.P, dec: 0, color: C.ink, alpha: a, side: 'r', label: o.label });
}

/* ============================== the classroom version: straws and pins (PBS Building Big, "Straw Shapes") ============================== */
/** a drinking straw from p to q (stage px): a tube with a highlight, mono grey */
function b06_straw(p, q, a, w = 13) {
  if (a <= 0.003) return;
  const body = TH ? '#D9D7CF' : '#4B4B47', edge = TH ? 'rgba(17,17,17,0.42)' : 'rgba(243,242,238,0.34)', hi = TH ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.22)';
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1, nx = -(q[1] - p[1]) / L, ny = (q[0] - p[0]) / L;
  G.save(); G.globalAlpha = a; G.lineCap = 'round';
  G.strokeStyle = edge; G.lineWidth = w + 2.5; G.beginPath(); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); G.stroke();
  G.strokeStyle = body; G.lineWidth = w; G.beginPath(); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); G.stroke();
  G.strokeStyle = hi; G.lineWidth = w * 0.22; G.beginPath(); G.moveTo(p[0] + nx * w * 0.22, p[1] + ny * w * 0.22); G.lineTo(q[0] + nx * w * 0.22, q[1] + ny * w * 0.22); G.stroke();
  G.restore();
}
/** a paper-fastener pin at a joint: it lets the straws turn */
function b06_pin(p, a) { if (a <= 0.003) return; circle(p[0], p[1], 7.5, { fill: C.panel, color: C.ink2, w: 2, alpha: a }); circle(p[0], p[1], 2.2, { fill: C.ink2, alpha: a }); }
/** the pinned square, racked by phi (rad) about its fixed base A-B (stage px, side Ls): returns its corners [A, B, C, D] */
function b06_square(cx, by, Ls, phi) {
  const A = [cx - Ls / 2, by], B = [cx + Ls / 2, by], d = [Ls * Math.sin(phi), -Ls * Math.cos(phi)];
  return [A, B, [B[0] + d[0], B[1] + d[1]], [A[0] + d[0], A[1] + d[1]]];
}
/** small arrows along a member: out (stretched) or in (squeezed), k their size */
function b06_memberArrows(p, q, kind, k, a, col) {
  if (a <= 0.003 || k <= 0.003) return;
  const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], L = Math.hypot(q[0] - p[0], q[1] - p[1]), ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L, nx = -uy, ny = ux, off = 20, s = 22 * k;
  for (const sg of [-1, 1]) {
    const c = [m[0] + ux * sg * L * 0.18 + nx * off, m[1] + uy * sg * L * 0.18 + ny * off];
    const a0 = kind === 'out' ? [c[0] - ux * sg * s * 0.2, c[1] - uy * sg * s * 0.2] : [c[0] + ux * sg * s, c[1] + uy * sg * s], a1 = kind === 'out' ? [c[0] + ux * sg * s, c[1] + uy * sg * s] : [c[0] - ux * sg * s * 0.2, c[1] - uy * sg * s * 0.2];
    arrow(a0[0], a0[1], a1[0], a1[1], { color: col, w: 2.5, hs: 9, alpha: a });
  }
}

/* ============================== 1. b06_lattice: triangles, not hexagons ============================== */
S({
  id: 'b06_lattice', ch: 'shell', theme: 'paper', title: 'Triangles, not hexagons', settle: 11.5, ideas: [75],
  replaces: ['lattice', 'shlDeterminate'], src: ['b06PbsStraws', 'b06TeachEng', 'b06FmPatent', 'b06Model', 'shlMaxwell', 'mitHoney', 'shlPyrofil'],
  answers: [
    ['lattice: "use human force that would be exerted on a mouse and point that out"', 'The press is 10 N and the slide says what that is: "a firm press: about a 1 kg bag of sugar", under the bridges, with the force arrow counting up to 10 N on each.'],
    ['lattice: "make hexagons bend a lot more"', 'The lattice is now a bridge (a strip across the top on two supports, pressed in the middle) instead of a block squashed on its base: the hexagons flex 10× as far as the triangles (0.49 against 0.05 mm, drawn 10× real), where the old block showed 4.6×. Their joints go red; the triangles stay calm.'],
    ['shlDeterminate: "could be combined with another slide"', 'Combined here: the classroom version (a square of straws folds on its pins, a triangle holds) is the slide\'s first beat, and its triangle shrinks into the bridge\'s middle cell, where the press lands.'],
    ['F2.37 "one line on the right that sticks way out into no mans land"', 'Whole cells only: every hexagon wall closes a cell, nothing hangs.'],
    ['F2.37 "an accompanying animation to show how hexagons distribute force versus triangles"', 'The same press on both, side by side: the force runs along the triangles\' ribs as dashes, the hexagons\' walls carry little of it straight and bend instead, coloured by stress.'],
    ['F2.37 "talk about them being statically determinant"', 'Said on the classroom beat: a triangle of straws is statically determinate (three straws, three pins: a push can only stretch or squeeze its sides), and shown with the square that folds.'],
    ['shlLattice3d: "triangles should have less red and more spread out force"', 'On one heat scale the triangles stay grey while the hexagons\' joints go red; peak 69 against 8 MPa (−88 %).']
  ],
  draw: t => {
    header(t, 'Triangles, not hexagons');
    captions(t, [[0.6, 'Push a square of straws and its pins turn: it folds. A triangle can\'t. A push can only stretch or squeeze its sides.'],
      [3.0, 'Most mice build their lattice from hexagons. Press one and every wall has to bend at its joints.'],
      [5.2, 'The same press on triangles of the same weight runs straight along the ribs: 10× stiffer, the peak 88% lower.'],
      [8.6, 'So the shell holds still under a hard grip: no flex to feel, no creak.']]);
    const { L, R } = abSplit(t, 0.2, B06_SPLIT, { left: 'Most mice', rival: 'Hexagons', rivalCol: 'grey', right: 'Theseus', rightSub: 'Triangles' });
    const x0L = L[0] + (L[2] - 62.5 * B06_S) / 2, x0R = R[0] + (R[2] - 62.5 * B06_S) / 2;
    const rH = b06_bridge('hex', 1.0), rT = b06_bridge('tri', 1.0), smax = rH.smax;
    /* ---- 0 to 3.3 s: the classroom version, in each panel; then each shape shrinks into its bridge's middle cell ---- */
    const kTr = ep(t, 2.4, 3.0, E.io3), kOut = 1 - ep(t, 3.0, 3.35), kTxt = ep(t, 0.05, 0.4) * (1 - ep(t, 2.2, 2.6));
    const by0 = B06_YS + 40, sqC = [L[0] + L[2] / 2, by0], trC = [R[0] + R[2] / 2, by0], Ls = 150;
    const phi = 0.46 * ep(t, 0.65, 1.7, E.io3);
    const PH = b06_drawStrip(rH, x0L, B06_YS, B06_S, B06_E, 0, { alpha: 0 }).P, PT = b06_drawStrip(rT, x0R, B06_YS, B06_S, B06_E, 0, { alpha: 0 }).P;
    if (kOut > 0.003) {
      const ac = ep(t, 0.05, 0.4) * kOut;
      text('The classroom version', L[0], 360, { role: 'label', size: 20, color: C.mute, alpha: kTxt });
      text('PBS Building Big', R[0] + R[2], 360, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kTxt, caps: false });
      /* the square folds on its pins */
      const cellH = PH([31.25, 7.217]), sc = lerp(1, 0.48, kTr), ox = lerp(sqC[0], cellH[0], kTr), oy = lerp(sqC[1] - Ls / 2, cellH[1], kTr);
      const Q = b06_square(0, Ls / 2, Ls, phi).map(p => [ox + p[0] * sc, oy + p[1] * sc]);
      line(sqC[0] - 120, by0 + 8, sqC[0] + 120, by0 + 8, { color: C.hair, w: 3, alpha: kTxt });
      [[0, 1], [1, 2], [2, 3], [3, 0]].forEach(([i, j]) => b06_straw(Q[i], Q[j], ac, 13 * sc));
      Q.forEach(p => b06_pin(p, ac));
      const kf = ep(t, 0.25, 0.6) * (1 - ep(t, 2.0, 2.4));
      if (kf > 0.003) { const D = Q[3]; finger(D[0] - 9, D[1], 0, { s: 4.2, press: ep(t, 0.6, 0.9), len: 22, alpha: kf }); }
      faultTag(t, 1.4, [Q[2][0] + 2, Q[2][1]], 'Folds', { to: [Q[2][0] + 90, Q[2][1] - 40], side: 'r', alpha: kTxt });
      text('4 straws, 4 pins: the pins turn', sqC[0], by0 + 56, { role: 'small', size: 23, weight: 600, color: C.ink2, align: 'center', alpha: ep(t, 1.5, 1.9) * kTxt });
      /* the triangle holds under the same push; it becomes the truss's middle triangle, right under the press */
      const m = rT.model, small = [PT([m.nodes[m.mid][0] - 6.25, 0]), PT([m.nodes[m.mid][0] + 6.25, 0]), PT(m.nodes[m.mid])];
      const big = [[trC[0] - Ls / 2, by0], [trC[0] + Ls / 2, by0], [trC[0], by0 - Ls * Math.sqrt(3) / 2]];
      const TT = big.map((p, i) => [lerp(p[0], small[i][0], kTr), lerp(p[1], small[i][1], kTr)]);
      line(trC[0] - 120, by0 + 8, trC[0] + 120, by0 + 8, { color: C.hair, w: 3, alpha: kTxt });
      [[0, 1], [1, 2], [2, 0]].forEach(([i, j]) => b06_straw(TT[i], TT[j], ac, lerp(13, 13 * 0.48, kTr)));
      TT.forEach(p => b06_pin(p, ac));
      const kf2 = ep(t, 1.15, 1.45) * (1 - ep(t, 2.0, 2.4)), kpush = ep(t, 1.45, 1.75) * (1 - ep(t, 2.2, 2.5));
      if (kf2 > 0.003) finger(TT[2][0] - 9, TT[2][1], 0, { s: 4.2, press: kpush, len: 22, alpha: kf2 });
      if (kpush > 0.003) {
        const mL = [(TT[0][0] + TT[2][0]) / 2, (TT[0][1] + TT[2][1]) / 2], mR = [(TT[1][0] + TT[2][0]) / 2, (TT[1][1] + TT[2][1]) / 2];
        text('Stretched', mL[0] - 22, mL[1] + 6, { role: 'label', size: 19, color: C.ink2, align: 'right', alpha: kpush });
        text('Squeezed', mR[0] + 22, mR[1] + 6, { role: 'label', size: 19, color: C.ink2, alpha: kpush });
      }
      fixTag(t, 1.8, [TT[2][0] + 6, TT[2][1] + 4], 'Holds', { to: [TT[2][0] + 96, TT[2][1] - 40], side: 'r', alpha: kTxt });
      text('3 straws, 3 pins: statically determinate', trC[0], by0 + 56, { role: 'small', size: 23, weight: 600, color: C.ink2, align: 'center', alpha: ep(t, 1.9, 2.3) * kTxt });
      text('A push can only stretch one side and squeeze another', trC[0], by0 + 86, { role: 'small', size: 21, weight: 600, color: C.mute, align: 'center', alpha: ep(t, 2.0, 2.3) * kTxt });
    }
    /* ---- 2.9 s on: the lattice as a bridge, a strip across the top, laid flat; it opens out from its middle cell ---- */
    const aB = ep(t, 2.75, 3.3);
    const kH = ep(t, 3.6, 4.6, E.io3), kT = ep(t, 4.8, 5.8, E.io3);
    const dH = b06_drawStrip(rH, x0L, B06_YS, B06_S, B06_E, kH, { alpha: aB, smax, flow: 0.5 * kH, t });
    const dT = b06_drawStrip(rT, x0R, B06_YS, B06_S, B06_E, kT, { alpha: aB, smax, flow: 0.5 * kT, t });
    b06_press(t, dH.contact, kH, ep(t, 3.2, 3.6)); b06_press(t, dT.contact, kT, ep(t, 4.4, 4.8));
    if (kH > 0.5) faultTag(t, 4.5, dH.hot, 'Bends at every joint: ' + fmtN(b06_flex(rH), 2) + ' mm', { to: [dH.hot[0] - 30, dH.hot[1] + 64], side: 'l' });
    if (kT > 0.5) fixTag(t, 5.7, b06_wallMid(rT, x0R, 1, kT, true), 'Only stretches and squeezes: ' + fmtN(b06_flex(rT), 2) + ' mm', { to: [x0R + 340, B06_YS + 70], side: 'l', maxW: 300 });
    b06_stripLocator(t, 3.0);
    /* readouts: the same weight, so the hexagons' walls are wider */
    const ka = ep(t, 3.0, 3.4);
    b06_readout(L[0], 360, ['Weight', fmtN(b06_grams(rH), 2) + ' g', C.ink2], ['Walls', fmtN(rH.model.els[0].h, 2) + ' mm', C.ink2], ka);
    b06_readout(R[0], 360, ['Weight', fmtN(b06_grams(rT), 2) + ' g', C.heroText], ['Ribs', fmtN(rT.model.els[0].h, 2) + ' mm', C.heroText], ka);
    /* who builds honeycombs, and the human scale */
    text('Finalmouse patent: "a rigid housing"', 80, 394, { role: 'small', size: 21, weight: 600, color: C.faint, alpha: ep(t, 3.8, 4.3) });
    scaleNote(980, 712, 'a firm press: about a 1 kg bag of sugar', { lead: '10 N', t, t0: 3.8 });
    /* the verdicts: flex, then the peak */
    verdict(t, 6.2, 80, 850, { from: fmtN(b06_flex(rH), 2), to: fmtN(b06_flex(rT), 2), unit: 'mm', dec: 2, label: 'Flex under 10 N', better: 'lower', who: ['Hexagons', 'Triangles'], rivalCol: 'grey', net: fmtN(b06_flex(rH) / b06_flex(rT), 0) + '× stiffer, the same weight', size: 110 });
    verdict(t, 6.9, 1000, 850, { from: Math.round(rH.smax), to: Math.round(rT.smax), unit: 'MPa', dec: 0, label: 'Peak experienced stress', better: 'lower', who: ['Hexagons', 'Triangles'], rivalCol: 'grey', size: 84 });
    text('2D frames: a 62.5 mm strip of 12.5 mm cells, PP-C-20A ribs 2.0 mm tall, 10 N on its middle, the same 0.48 g both ways. Flex drawn 10× real.', 80, 978, { role: 'small', size: 19, color: C.faint, alpha: ep(t, 3.4, 3.9), maxW: 1760 });
  }
});

/* ============================== 2. b06_light: triangles win more on a light mouse ============================== */
S({
  id: 'b06_light', ch: 'shell', theme: 'night', title: 'Triangles win more on a light mouse', settle: 12, ideas: [75, 5],
  replaces: ['shlThin'], src: ['b06Model', 'shlPyrofil', 'mitHoney', 'shlMaxwell'],
  answers: [
    ['"needs a better explanation"', 'The why is drawn on the bridges themselves: a hexagon wall bends, so half the width takes a quarter of the load; a triangle rib stretches, so half the width takes half. The captions say it in those words.'],
    ['"and more information to be more intuitive"', 'Both lattices are shown live under the same 10 N press while the weight drops, with each one\'s rib width, the chart of the load each takes, the 10 N line, the point where the honeycomb breaks, and the gap at both ends.'],
    ['"i really like the fact that triangles win more as the mouse gets lighter, this really just isn\'t as compelling as it should be sits hard ti understand"', 'The pointer drags the weight down: the honeycomb sags further and further and breaks under a firm press at about three quarters of the weight, while the triangles hold to half. The verdict is the gap growing, 8.6× to 17.7×, and the last line says the triangles at half the weight still take 4.5 times what the honeycomb took at full weight.'],
    ['"max load to bend maybe?"', 'Yes: the chart\'s y axis is the max load, the press each strip takes before its peak reaches the 120 MPa break (higher is better), on one log scale, with the 10 N press drawn across it.'],
    ['F2.09 "elaborate more and do more animations on how triangles are more helpful on a lower weight mouse"', 'The whole slide is that animation: same press, the weight dropping, the honeycomb failing first.'],
    ['F2.09 "a bar of flex or strength to weight dropping"', 'The chart is strength against weight dropping, both lattices. The strip that ran across several slides is gone (Brock on shlShell3d: "they were a bad idea").']
  ],
  draw: t => {
    header(t, 'Triangles win more on a light mouse');
    const SW = b06_sweep(), tB = b06_hexBreakT(), L0 = SW[0], L1 = SW[SW.length - 1];
    const T0 = 3.2, T1 = 7.6, ribAt = u => lerp(1.0, 0.5, ep(u, T0, T1, E.io3)), tr = ribAt(t), broke = tr < tB;
    const tBreak = shbWhen(u => -ribAt(u), -tB, T0, T1), kBrk = broke ? ep(t, tBreak, tBreak + 0.45) : 0;
    const lead0 = L0.mT / L0.mH, lead1 = L1.mT / L1.mH, fracB = tB / 1.0, halfLoad = L1.mT / L0.mH;
    captions(t, [[0.6, 'A lighter mouse has thinner ribs. Halve a rib that bends and it takes a quarter of the load; halve a rib that stretches and it takes half.'],
      [4.2, 'So the hexagons fall away first. At ' + Math.round(fracB * 100) + '% of the weight the honeycomb breaks under a firm press; the triangles hold all the way to half.'],
      [8.0, 'At half the weight the triangles still take ' + Math.round(L1.mT) + ' N: ' + fmtN(halfLoad, 1) + ' times what the honeycomb took at full weight.']]);
    /* the two bridges, side by side on one scale (the same places as b06_lattice) */
    const { L, R } = abSplit(t, 0.2, B06_SPLIT, { left: 'Most mice', rival: 'Hexagons', rivalCol: 'grey', right: 'Theseus', rightSub: 'Triangles' });
    const kp = ep(t, 0.3, 1.1, E.io3), aB = ep(t, 0.15, 0.6);
    const x0L = L[0] + (L[2] - 62.5 * B06_S) / 2, x0R = R[0] + (R[2] - 62.5 * B06_S) / 2;
    /* hexagons thin with the weight until their peak passes the break under the press; then they stop there, cracked */
    const rH = b06_bridge('hex', broke ? tB : tr), rT = b06_bridge('tri', tr);
    const dH = b06_drawStrip(rH, x0L, B06_YS, B06_S, B06_E, kp, { alpha: aB, smax: B06_FT, crack: kBrk });
    const dT = b06_drawStrip(rT, x0R, B06_YS, B06_S, B06_E, kp, { alpha: aB, smax: B06_FT, flow: 0.4 * ep(t, 1.2, 1.8), t });
    b06_press(t, dH.contact, kp, aB); b06_press(t, dT.contact, kp, aB);
    if (broke) faultTag(t, tBreak + 0.1, dH.hot, 'Breaks under 10 N', { to: [dH.hot[0] + 120, dH.hot[1] + 44], side: 'r' });
    /* each strip's weight and rib width, live (the same weight until the honeycomb breaks), under each panel's name */
    const ka = ep(t, 1.0, 1.4);
    b06_readout(L[0], 360, broke ? ['Broke at', fmtN(b06_grams(rH), 2) + ' g', C.red] : ['Weight', fmtN(b06_grams(rH), 2) + ' g', C.ink2], ['Walls', fmtN(rH.model.els[0].h, 2) + ' mm', C.ink2], ka);
    b06_readout(R[0], 360, ['Weight', fmtN(b06_grams(rT), 2) + ' g', C.heroText], ['Ribs', fmtN(rT.model.els[0].h, 2) + ' mm', C.heroText], ka);
    b06_stripLocator(t, 0.6);
    /* the why, on the drawings, before the weight moves: a label under each bridge, a leader up to a rib */
    const kw = ep(t, 0.9, 1.3) * (1 - ep(t, 3.6, 4.1));
    if (kw > 0.003) {
      const wH = b06_wallMid(rH, x0L, 1, kp), wT = b06_wallMid(rT, x0R, 1, kp);
      b06_note(wH, [L[0] + 40, 646], 'A hexagon wall bends: half as wide, it takes a quarter of the load', kw, C.mute);
      b06_note(wT, [R[0] + 40, 646], 'A triangle rib stretches: half as wide, it takes half the load', kw * ep(t, 1.3, 1.7), C.heroText);
    }
    /* the chart: max press before each strip breaks, against the weight, lighter to the right; its weight axis is the slider */
    const cx0 = 250, cx1 = 1100, cyT = 762, cyB = 900, aC = ep(t, 1.6, 2.2);
    const gMax = L0.g, gMin = L1.g, X = g => cx0 + (gMax - g) / (gMax - gMin) * (cx1 - cx0), lgY = v => cyB - Math.log10(v) / Math.log10(250) * (cyB - cyT);
    scaleNote(80, 718, 'a firm press: about a 1 kg bag of sugar', { lead: '10 N', t, t0: 1.2 });
    if (aC > 0.003) {
      text('Max press before it breaks {(higher is better)}', 80, 750, { role: 'label', size: 20, color: C.mute, alpha: aC });
      legend(t, 1.8, 700, 750, [{ kind: 'line', color: C.hero, label: 'Triangles' }, { kind: 'line', color: C.comp, label: 'Hexagons' }], { size: 19, gap: 24 });
      for (const v of [3, 10, 30, 100]) { line(cx0, lgY(v), cx1, lgY(v), { color: C.hair, w: 1.2, alpha: aC }); text(v + ' N', cx0 - 14, lgY(v) + 7, { role: 'tick', size: 19, color: C.mute, align: 'right', alpha: aC }); }
      line(cx0, cyB, cx1, cyB, { color: C.faint, w: 1.5, alpha: aC });
      for (const g of [0.45, 0.4, 0.35, 0.3]) { line(X(g), cyB, X(g), cyB + 7, { color: C.faint, w: 1.5, alpha: aC }); text(fmtN(g, 2) + ' g', X(g), cyB + 30, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: aC }); }
      text('Lattice weight, lighter →', cx1, cyB + 56, { role: 'label', size: 19, color: C.ink2, align: 'right', alpha: aC });
      /* the 10 N press, across */
      line(cx0, lgY(10), cx1, lgY(10), { color: C.ink2, w: 1.5, dash: [6, 6], alpha: aC });
      text('10 N press', cx0 + 10, lgY(10) + 22, { role: 'label', size: 19, color: C.ink2, alpha: aC });
      /* both curves up to the weight on screen, the gap between them shaded */
      const gNow = lerp(gMax, gMin, (1.0 - tr) / 0.5), last = { g: gNow, mT: b06_maxPress(rT), mH: b06_maxPress(b06_bridge('hex', tr)) };
      const seq = SW.filter(q => q.g >= gNow - 1e-9).concat([last]);
      G.save(); G.globalAlpha = aC; G.fillStyle = C.heroSoft; G.beginPath(); seq.forEach((q, i) => i ? G.lineTo(X(q.g), lgY(q.mT)) : G.moveTo(X(q.g), lgY(q.mT))); seq.slice().reverse().forEach(q => G.lineTo(X(q.g), lgY(q.mH))); G.closePath(); G.fill(); G.restore();
      poly(seq.map(q => [X(q.g), lgY(q.mH)]), { color: C.comp, w: 3, alpha: aC });
      poly(seq.map(q => [X(q.g), lgY(q.mT)]), { color: C.hero, w: 3.5, alpha: aC });
      const xn = X(gNow);
      circle(xn, lgY(last.mT), 6, { fill: C.hero, alpha: aC }); circle(xn, lgY(last.mH), 6, { fill: broke ? C.red : C.comp, alpha: aC });
      /* the lead at the start, and now */
      text(fmtN(lead0, 1) + '×', X(gMax) + 14, (lgY(L0.mT) + lgY(L0.mH)) / 2 + 8, { role: 'num', size: 24, weight: 800, color: C.heroText, alpha: aC });
      if (xn > X(gMax) + 170) text(fmtN(last.mT / last.mH, 1) + '×', xn - 16, (lgY(last.mT) + lgY(last.mH)) / 2 + 8, { role: 'num', size: 24, weight: 800, color: C.heroText, align: 'right', alpha: aC });
      /* the values where the curves end */
      const ke = ep(t, T1 - 0.2, T1 + 0.3) * aC;
      text(Math.round(last.mT) + ' N', cx1 + 16, lgY(last.mT) + 8, { role: 'num', size: 22, weight: 750, color: C.heroText, alpha: ke });
      text(fmtN(last.mH, 1) + ' N', cx1 + 16, lgY(last.mH) + 8, { role: 'num', size: 22, weight: 750, color: C.mute, alpha: ke });
      /* where the honeycomb breaks: its curve crossing the press */
      if (broke) { const gb = lerp(gMax, gMin, (1.0 - tB) / 0.5); circle(X(gb), lgY(10), 7, { fill: C.red, alpha: aC * kBrk }); }
      /* the knob on the weight axis, and the pointer that drags it */
      rr(xn - 9, cyB - 9, 18, 18, 9, C.panel, C.ink, 2.5, aC);
      cursorAt(t, [[2.5, [xn + 160, cyB + 60]], [3.1, [X(gMax) + 3, cyB + 3]], [T1, [X(gMin) + 3, cyB + 3]], [8.6, [X(gMin) + 3, cyB + 3]]], [3.15], { a: ep(t, 2.3, 2.6) * (1 - ep(t, 8.2, 8.6)), grab: t > 3.1 && t < 7.8 });
    }
    /* the verdict: the triangles' lead, growing as the weight drops */
    verdict(t, 7.8, 1250, 884, { from: fmtN(lead0, 1), to: fmtN(lead1, 1), unit: '×', dec: 1, label: 'Triangles\' lead', better: 'higher', who: [fmtN(L0.g, 2) + ' g', fmtN(L1.g, 2) + ' g'], rivalCol: 'grey', size: 110 });
    text('2D frames: a 62.5 mm strip of 12.5 mm cells, PP-C-20A ribs 2.0 mm tall, pressed in the middle; it breaks at 120 MPa. Flex drawn 10× real.', 80, 976, { role: 'small', size: 19, color: C.faint, alpha: ep(t, 1.6, 2.1), maxW: 1760 });
  }
});
/** two quiet readouts in a row: [label, value, value colour] each */
function b06_readout(x, y, A, B, a, D) {
  if (a <= 0.003) return;
  let xx = x;
  for (const it of [A, B, D]) { if (!it) continue; xx += ltag(xx, y, it[0], it[1], { a, size: 20, color: it === A && it[2] === C.red ? C.red : C.mute, vcolor: it[2] }) + 28; }
}
/** where the strip comes from: the simplified mouse from above with a band across the top, between the two panels */
function b06_stripLocator(t, t0) {
  locator(t, t0, 923, 386, 74, 'top', [-31.2, 12, 62.4, 12]);
  text('A strip across the top, laid flat', 960, 574, { role: 'small', size: 19, weight: 600, color: C.mute, align: 'center', alpha: ep(t, t0 + 0.2, t0 + 0.6), maxW: 230, lh: 1.25 });
}
/** a quiet note under a drawing with a hairline up to the thing it names: p the point, (x, y) the note's first baseline */
function b06_note(p, at, s, a, col) {
  if (a <= 0.003) return;
  const [x, y] = at, r = text(s, x, y, { role: 'small', size: 23, weight: 600, color: C.ink2, alpha: a, maxW: 480, lh: 1.28 });
  const lx = Math.min(Math.max(p[0], x + 12), x + Math.min(460, r.w)), ly = y - 26;
  poly([[p[0], p[1] + 6], [lx, ly]], { color: col, w: 1.5, alpha: a * 0.9 });
  circle(p[0], p[1], 4.5, { fill: col, alpha: a });
}
/** the middle of rib e of a solved strip, as drawn (the deflected frame): for a callout */
function b06_wallMid(r, x0, pick, k, right) {
  const m = r.model, mid = m.nodes[m.mid];
  /* the rib nearest the press, left of it, picked by rank (0 nearest) */
  const cand = m.els.map((el, e) => { const a = m.nodes[el.i], b = m.nodes[el.j], c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; return { e, c, d: Math.hypot(c[0] - mid[0] + (right ? -6 : 6), c[1] - mid[1]) }; }).filter(q => right ? q.c[0] > mid[0] + 1 : q.c[0] < mid[0] - 1).sort((p, q) => p.d - q.d);
  const e = cand[Math.min(pick, cand.length - 1)].e, pts = feElPts(r, e, B06_E * k, 8), q = pts[4], yS = m.nodes[m.bl][1];
  return [x0 + q[0] * B06_S, B06_YS - (q[1] - yS) * B06_S];
}
