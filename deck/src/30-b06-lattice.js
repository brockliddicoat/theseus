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
  b06PbsStraws: { t: 'PBS Building Big (WGBH, 2000; web site 2000-2001), "Activity: Straw Shapes": "Straws arranged into triangles form more stable shapes than straws arranged into squares"; "When compression is applied to a square ... the joints rotate easily, and the shape changes"', u: 'https://www.pbs.org/wgbh/buildingbig/educator/act_straw_ei.html' },
  b06TeachEng: { t: 'TeachEngineering (University of Colorado Boulder, 2013), "Triangles & Trusses": "If you push down on top of the square, it will no longer be a square"; "This is why a triangle cannot collapse!"', u: 'https://www.teachengineering.org/lessons/view/cub_trusses_lesson01' },
  b06FmPatent: { t: 'Finalmouse LLC, US patent 10,983,609 (2021), "Computer mouse with lightweight housing": the openings "may be hexagonal forming a honeycomb framework that provides a rigid housing"; other polygons are possible and "the choice of shape types ... may be a matter of design choice"', u: 'https://ipiq.io/patents/2558819' },
  b06Egg: { t: 'IOP Spark (Institute of Physics), "Egg-stra tough": squeeze a raw egg evenly, "you can\'t break it by squeezing it!", thanks to its "arched shape"; Science World, "Unsqueezable Egg": squeezed top and bottom between thumb and forefinger, "the egg is strongest at the top and the bottom"; an uneven force cracks it', u: 'https://spark.iop.org/egg-stra-tough' },
  b06PontDuGard: { t: 'Wikipedia, Pont du Gard: built about 40 to 60 AD, "constructed largely without the use of mortar or clamps"; blocks of up to 6 tons; 48.8 m tall', u: 'https://en.wikipedia.org/wiki/Pont_du_Gard' },
  b06Gaudi: { t: 'Gaudí\'s hanging model for the church of Colònia Güell (commissioned 1898): "hemp ropes attached to lead-filled sacks", 1:10 scale, read upside down; only the crypt was built (1908 to 1915). Wikipedia, Church of Colònia Güell; Sagrada Família blog (J. Tomàs, 2025): "a string weighed down with a little bag of birdshot"', u: 'https://en.wikipedia.org/wiki/Church_of_Col%C3%B2nia_G%C3%BCell' },
  b06Wood: { t: 'USDA Forest Products Laboratory, Wood Handbook (FPL-GTR-190, 2010), ch. 5 (Kretschmann): Douglas-fir, interior north, clear and green: tension parallel to grain 107,600 kPa (Table 5-7), tension perpendicular to grain 2,300 kPa (Table 5-3a)', u: 'https://research.fs.usda.gov/treesearch/37427' },
  b06Comet: { t: 'FAA Lessons Learned, de Havilland DH-106 Comet 1: the "relatively squarish windows were creating stress concentrations much higher than anticipated"; G-ALYP (Elba, 10 Jan 1954, 1,290 pressurised flights) and G-ALYY (Naples, 8 Apr 1954); the tank-tested G-ALYU failed at a corner of the squarish forward escape hatch window; the Comet 1XB "changed the window shape from squarish to the conventional oval"', u: 'https://www.faa.gov/lessons_learned/transport_airplane/accidents/G-ALYV' },
  b06RapidDirect: { t: 'RapidDirect (F. Peng, 2025), "Sharp Corners in Injection Molding": "the sharp edges in injection molds themselves are subjected to high stress and repeated abrasion. They degrade faster, which reduces mold life"; "Sharp internal corners often require EDM"; melt slows or stops in dead zones at sharp corners; inside radius at least 0.5 times the wall', u: 'https://www.rapiddirect.com/blog/sharp-corner-rules-for-injection-molding/' },
  b06Sutanto: { t: 'Sutanto, Abu-Qbeitah, Jeselsohn, Unikewicz, Bonavia, Rudolph, Borja da Rocha, Naghibzadeh and Cohen, "Challenging common notions on how eggs break and the role of strength versus toughness", Communications Physics 8:182 (2025), MIT: whole eggs compressed between plates, 30 each way: 46.0 ± 6.6 N end to end, 45.2 ± 5.5 N on the side ("the peak forces are found to be similar")', u: 'https://doi.org/10.1038/s42005-025-02087-0' },
  b06Rae: { t: 'Atkinson, Winkworth and Norris, "Behaviour of skin fatigue cracks at the corners of windows in a Comet I fuselage", ARC R&M 3248 (1962): the RAE\'s pressure test of a whole Comet I cabin, cycled 0 to 8.25 psi; "Window: 16.6 in. wide x 14 in. high, corner radii 3 in."; the first crack at 5,248 cycles at a cabin window; stress round the windows "some two to three times that found elsewhere in the fuselage"', u: 'https://aerade.cranfield.ac.uk/bitstream/handle/1826.2/3823/arc-rm-3248.pdf' },
  b06Won: { t: 'Won, Johnson, Punnett and Dennerlein, "Variability in finger and forearm muscle activity...", J Electromyogr Kinesiol 19 (2009) 428-436, Table 3: computer work with a force-sensing mouse, mean peak side (grip) force 2.0 to 2.1 N; Johnson et al. 2000 measured 0.43 N on average. So 10 N is a hard press, about five times the hardest grip measured at a desk', u: 'https://stacks.cdc.gov/view/cdc/187303/cdc_187303_DS1.pdf' },
  b06Honeycomb: { t: 'Honeycomb mice: Finalmouse UltralightX ("hexagonal holes being used across the back, sides, and bottom") and G-Wolves Hati-S (HTS) Ultra 8K ("hexagonal holes across the entire shell"), TechPowerUp reviews; most 2026 flagships are solid shells (research FILLS, Q1)', u: 'https://techpowerup.com/review/finalmouse-ultralightx/single-page.html' },
  b06Model: { t: 'This deck, Shell II models: 2D frames (07-sim.js, Euler-Bernoulli beams, PP-C-20A 13.5 GPa; breaks at 120 MPa stretched, 207 MPa bent, F41.1): a 60 mm lattice strip of 12 mm cells (joints stiffened to their filleted size), 2.0 mm tall ribs, on a pin and a roller, 10 N over its middle, triangles (1.0 mm ribs) against one row of hexagons at the same weight; the arch and plate of 10-d2-arches.js; a Stokes flow through a 3-arm and a 6-arm node with fibres turned by Jeffery\'s equation; plane-stress finite elements (Q4, O-grid, quarter model) of a skin with a squarish and an oval window under 2:1 biaxial tension', n: 'derived, this model' }
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

/* ---------- the lattice as a bridge: a strip of it across the top of the shell (60 mm, about the mouse's width: the same span
   as b05's strip and the arch), laid
   flat on two supports and pressed in the middle. Triangles: a Warren truss of 12.5 mm cells (the study lattice's edge),
   19 ribs; hexagons: one row of whole 12.5 mm cells (no wall left hanging, F2.37), 26 walls, their width scaled so the two
   weigh the same. Ribs 2.0 mm tall (out of the plane), PP-C-20A. Pin under the left end, roller under the right, the
   press on the middle top node. t = the triangles' rib width (mm). */
/** THE SHELL CHAPTERS' TEST STRIP (FILM F4, integrator 09:30): b05 and b06 use this one specimen and this one press, so the
   numbers chain from slide to slide. A strip of the lattice across the top (the mouse's width), laid flat on a pin and a
   roller under its end feet, pressed on its middle top node, PP-C-20A (SIM_MAT.ppcf). Solve it with
   B06_STRIP.solve(kind, ribW): kind 'tri' (Theseus: a Warren truss of ribW-wide ribs) or 'hex' (one row of whole hexagons,
   their walls widened to the same weight); returns the 07-sim.js result at the press (r.model.mid is the pressed node).
   b06_flex(r), b06_grams(r), b06_use(r) / b06_breakAt(r) (F41.1: 120 MPa stretched, 207 bent) read it. Joints carry rigid
   zones the size of their filleted cores (b06_zones). Read B06_STRIP inside draw(): this file loads after b05's. */
const B06_STRIP = Object.freeze({ span: 60, cells: 5, cell: 12, ribH: 2.0, ribW: 1.0, press: 10, pressSay: 'a hard press: a 1 kg bag of sugar, five times the hardest desk grip measured', where: 'A strip across the top, laid flat', mat: 'ppcf', solve: (kind, ribW = 1.0) => b06_bridge(kind, ribW) });
const B06_BR = { n: B06_STRIP.cells, a: B06_STRIP.cell, rib: B06_STRIP.ribH, P: B06_STRIP.press };
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
    return b06_zones({ nodes, els, kind, bl: 0, br: n, mid: T(Math.floor(n / 2)), H: Hh, span: n * a });
  }
  const R = a / Math.sqrt(3), map = new Map(), seen = new Set(), th = t * b06_triLen() / b06_hexLen();
  const nid = p => { const k = Math.round(p[0] * 1000) + ',' + Math.round(p[1] * 1000); if (!map.has(k)) { map.set(k, nodes.length); nodes.push(p); } return map.get(k); };
  for (let c = 0; c < n; c++) {
    const cx = a / 2 + c * a, v = [0, 1, 2, 3, 4, 5].map(k => { const an = -Math.PI / 2 + k * Math.PI / 3; return nid([cx + R * Math.cos(an), R + R * Math.sin(an)]); });
    for (let k = 0; k < 6; k++) { const p = v[k], q = v[(k + 1) % 6], key = p < q ? p + ',' + q : q + ',' + p; if (!seen.has(key)) { seen.add(key); els.push(Object.assign({ i: p, j: q }, sec(th))); } }
  }
  /* supports under the two end walls' lower corners (the span the same 60 mm), the press on the middle cell's top */
  let bl = 0, br = 0, mid = 0;
  nodes.forEach((p, i) => { if (p[0] < 1e-6 && p[1] < R) bl = i; if (p[0] > n * a - 1e-6 && p[1] < R) br = i; if (Math.abs(p[0] - n * a / 2) < 1e-6 && p[1] > 1.5 * R) mid = i; });
  return b06_zones({ nodes, els, kind, bl, br, mid, H: 2 * R, span: n * a, th });
}
/** rigid joint zones (checked 08:4x: node-to-node beams overstate the bending of short, wide walls). Each rib is split into
   a rigid end at each joint (E x 1000, the same section, so the same weight) and its flexible middle. The rigid length per
   end is (h/2 + r/2) / tan(phi/2): the solid core of the joint plus half the 0.6 mm fillet's taper, phi the joint's
   smallest corner (60° in the triangles, 120° in the hexagons). Original node numbers are kept; el.flex points each rigid
   end at its rib's flexible middle (its stress is read there, at the joint's edge). */
function b06_zones(m, r = 0.6) {
  const N0 = m.nodes, ang = (i, j) => Math.atan2(N0[j][1] - N0[i][1], N0[j][0] - N0[i][0]);
  const phiMin = i => {
    const as = m.els.filter(e => e.i === i || e.j === i).map(e => ang(i, e.i === i ? e.j : e.i)).sort((p, q) => p - q);
    if (as.length < 2) return Math.PI;
    let mn = 9; for (let k = 0; k < as.length; k++) { const d = (k + 1 < as.length ? as[k + 1] : as[0] + TAU) - as[k]; if (d < mn) mn = d; }
    return mn;
  };
  const nodes = N0.map(p => p.slice()), els = [];
  for (const el of m.els) {
    const p = N0[el.i], q = N0[el.j], L = Math.hypot(q[0] - p[0], q[1] - p[1]), ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L;
    const zi = (el.h / 2 + r / 2) / Math.tan(phiMin(el.i) / 2), zj = (el.h / 2 + r / 2) / Math.tan(phiMin(el.j) / 2);
    const a = nodes.length; nodes.push([p[0] + ux * zi, p[1] + uy * zi]); const b = nodes.length; nodes.push([q[0] - ux * zj, q[1] - uy * zj]);
    const k = els.length;
    els.push(Object.assign({}, el, { j: a, E: el.E * 1000, rigid: true, flex: k + 1 }));
    els.push(Object.assign({}, el, { i: a, j: b, rib: true }));
    els.push(Object.assign({}, el, { i: b, E: el.E * 1000, rigid: true, flex: k + 1 }));
  }
  return Object.assign(m, { nodes, els, zones: true });
}
const b06_lenOf = m => m.els.reduce((s, el) => s + Math.hypot(m.nodes[el.j][0] - m.nodes[el.i][0], m.nodes[el.j][1] - m.nodes[el.i][1]), 0);   /* node to node: the zones keep it */
function b06_triLen() { return b06_once('triLen', () => b06_lenOf(b06_strip('tri', 1))); }
function b06_hexLen() { return b06_once('hexLen', () => { const a = B06_BR.a, R = a / Math.sqrt(3); return 26 * R; }); }
/** the strip solved under 10 N at the middle (cached per rib width, to the micron) */
function b06_bridge(kind, t) {
  const tk = Math.round(t * 1000) / 1000;
  const r = simSolve('b06br:' + kind + ':' + tk, () => { const m = b06_strip(kind, tk); m.fix = { [m.bl]: 'xy', [m.br]: 'y' }; m.loads = { [m.mid]: [0, -B06_BR.P, 0] }; return m; });
  /* a rigid end reads its rib's stress at the joint's edge, not the node's centre */
  if (!r.b06z) { r.b06z = true; r.model.els.forEach((el, e) => { if (el.rigid) r.sig[e] = r.sig[el.flex]; }); r.smax = Math.max(...r.sig); }
  return r;
}
const b06_flex = r => -r.d[r.model.mid * 3 + 1];
const b06_grams = r => r.mass.reduce((s, v) => s + v, 0);
/** the press that takes the strip's peak to the break (PP-C-20A, 120 MPa: F12.12), N */
const B06_FT = 120;
const b06_maxPress = r => B06_BR.P * B06_FT / r.smax;
/** the hottest joint: the node at the more loaded end of the most stressed rib */
function b06_hotNode(r) { const els = r.model.els; let e = 0; els.forEach((el, q) => { if (!el.rigid && r.sig[q] > (els[e].rigid ? -1 : r.sig[e])) e = q; }); const el = els[e]; return Math.abs(r.M1[e]) >= Math.abs(r.M2[e]) ? { node: el.i, other: el.j, e } : { node: el.j, other: el.i, e }; }
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
const B06_SPLIT = [80, 250, 1760, 330], B06_S = 10, B06_YS = 480, B06_E = 10, B06_RY = 320;   /* B06_RY: the readouts' row */
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
  const body = TH ? C.comp2 : C.comp, edge = TH ? 'rgba(17,17,17,0.42)' : 'rgba(243,243,245,0.34)', hi = TH ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.22)';
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
  replaces: ['lattice', 'shlDeterminate'], src: ['b06PbsStraws', 'b06TeachEng', 'b06FmPatent', 'b06Honeycomb', 'b06Won', 'b06Model', 'shlLattice', 'shlMaxwell', 'mitHoney', 'shlPyrofil'],
  answers: [
    ['lattice: "use human force that would be exerted on a mouse and point that out"', 'The press is 10 N and the slide says what that is: "10 N, a hard press: a 1 kg bag of sugar, about five times the hardest grip measured at a desk" (Won 2009), under the strips, with the force arrow counting up to 10 N on each.'],
    ['lattice: "make hexagons bend a lot more"', 'The lattice is now a bridge (a strip across the top on two supports, pressed in the middle) instead of a block squashed on its base: the hexagons flex 8.6× as far as the triangles (0.30 against 0.035 mm, drawn 10× real), where the old block showed 4.6×. Their joints go red; the triangles stay calm. The verdict says "strip": in the full shell its wall shares the load.'],
    ['shlDeterminate: "could be combined with another slide"', 'Combined here: the classroom version (a square of straws folds on its pins, a triangle holds) is the slide\'s first beat, and its triangle shrinks into the bridge\'s middle cell, where the press lands.'],
    ['F2.37 "one line on the right that sticks way out into no mans land"', 'Whole cells only: every hexagon wall closes a cell, nothing hangs.'],
    ['F2.37 "an accompanying animation to show how hexagons distribute force versus triangles"', 'The same press on both, side by side: the force runs along the triangles\' ribs as dashes, the hexagons\' walls carry little of it straight and bend instead, coloured by stress.'],
    ['F2.37 "talk about them being statically determinant"', 'Said on the classroom beat: a triangle of straws is statically determinate (three straws, three pins: a push can only stretch or squeeze its sides), and shown with the square that folds.'],
    ['shlLattice3d: "triangles should have less red and more spread out force"', 'On one heat scale the triangles stay grey while the hexagons\' joints go red; peak 59 against 8 MPa (−86 %).']
  ],
  draw: t => {
    header(t, 'Triangles, not hexagons');
    const rH = b06_bridge('hex', 1.0), rT = b06_bridge('tri', 1.0), smax = rH.smax;
    const kStiff = b06_flex(rH) / b06_flex(rT), cut = Math.round(100 * (1 - rT.smax / rH.smax));
    captions(t, [[0.6, 'Push a square of straws and its pins turn: it folds. A triangle can\'t. A push can only stretch or squeeze its sides.'],
      [3.0, 'Honeycomb mice build their shells from hexagons. Press a strip of one and every wall has to bend at its joints.'],
      [5.2, 'The same press on a strip of triangles, the same weight, runs straight along the ribs: ' + fmtN(kStiff, 1) + '× stiffer, the peak ' + cut + '% lower.'],
      [8.6, 'That is why Theseus\'s ribs run in triangles: a press is carried as stretch and squeeze, not bending.']]);
    const { L, R } = abSplit(t, -2, B06_SPLIT, { left: 'Honeycomb mice', rival: 'Hexagons', rivalCol: 'grey', right: 'Theseus', rightSub: 'Triangles' });
    const SP = B06_BR.n * B06_BR.a, x0L = L[0] + (L[2] - SP * B06_S) / 2, x0R = R[0] + (R[2] - SP * B06_S) / 2;
    /* ---- 0 to 3.3 s: the classroom version, in each panel; then each shape shrinks into its bridge's middle cell ---- */
    const kTr = ep(t, 2.4, 3.0, E.io3), kOut = 1 - ep(t, 3.0, 3.35), kTxt = 1 - ep(t, 2.2, 2.6);
    const by0 = B06_YS + 40, sqC = [L[0] + L[2] / 2, by0], trC = [R[0] + R[2] / 2, by0], Ls = 150;
    const phi = 0.46 * ep(t, 0.15, 1.2, E.io3);
    const PH = b06_drawStrip(rH, x0L, B06_YS, B06_S, B06_E, 0, { alpha: 0 }).P, PT = b06_drawStrip(rT, x0R, B06_YS, B06_S, B06_E, 0, { alpha: 0 }).P;
    if (kOut > 0.003) {
      const ac = kOut;
      text('The classroom version', L[0], B06_RY, { role: 'label', size: 20, color: C.mute, alpha: kTxt });
      text('PBS Building Big, 2000', R[0] + R[2], B06_RY, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kTxt, caps: false });
      /* the square folds on its pins */
      const cellH = PH([2.5 * B06_BR.a, B06_BR.a / Math.sqrt(3)]), sc = lerp(1, 0.48, kTr), ox = lerp(sqC[0], cellH[0], kTr), oy = lerp(sqC[1] - Ls / 2, cellH[1], kTr);
      const Q = b06_square(0, Ls / 2, Ls, phi).map(p => [ox + p[0] * sc, oy + p[1] * sc]);
      line(sqC[0] - 120, by0 + 8, sqC[0] + 120, by0 + 8, { color: C.hair, w: 3, alpha: kTxt });
      [[0, 1], [1, 2], [2, 3], [3, 0]].forEach(([i, j]) => b06_straw(Q[i], Q[j], ac, 13 * sc));
      Q.forEach(p => b06_pin(p, ac));
      const kf = 1 - ep(t, 2.0, 2.4);
      if (kf > 0.003) { const D = Q[3]; finger(D[0] - 9, D[1], 0, { s: 4.2, press: ep(t, 0.05, 0.3), len: 22, alpha: kf }); }
      faultTag(t, 1.1, [Q[2][0] + 2, Q[2][1]], 'Folds', { to: [Q[2][0] + 90, Q[2][1] - 40], side: 'r', alpha: kTxt });
      text('4 straws, 4 pins: the pins turn', sqC[0], by0 + 56, { role: 'small', size: 23, weight: 600, color: C.ink2, align: 'center', alpha: ep(t, 1.1, 1.5) * kTxt });
      /* the triangle holds under the same push; it becomes the truss's middle triangle, right under the press */
      const m = rT.model, small = [PT([m.nodes[m.mid][0] - 6.25, 0]), PT([m.nodes[m.mid][0] + 6.25, 0]), PT(m.nodes[m.mid])];
      const big = [[trC[0] - Ls / 2, by0], [trC[0] + Ls / 2, by0], [trC[0], by0 - Ls * Math.sqrt(3) / 2]];
      const TT = big.map((p, i) => [lerp(p[0], small[i][0], kTr), lerp(p[1], small[i][1], kTr)]);
      line(trC[0] - 120, by0 + 8, trC[0] + 120, by0 + 8, { color: C.hair, w: 3, alpha: kTxt });
      [[0, 1], [1, 2], [2, 0]].forEach(([i, j]) => b06_straw(TT[i], TT[j], ac, lerp(13, 13 * 0.48, kTr)));
      TT.forEach(p => b06_pin(p, ac));
      const kf2 = ep(t, 0.7, 1.0) * (1 - ep(t, 2.0, 2.4)), kpush = ep(t, 1.0, 1.3) * (1 - ep(t, 2.2, 2.5));
      if (kf2 > 0.003) finger(TT[2][0] - 9, TT[2][1], 0, { s: 4.2, press: kpush, len: 22, alpha: kf2 });
      if (kpush > 0.003) {
        const mL = [(TT[0][0] + TT[2][0]) / 2, (TT[0][1] + TT[2][1]) / 2], mR = [(TT[1][0] + TT[2][0]) / 2, (TT[1][1] + TT[2][1]) / 2];
        text('Stretched', mL[0] - 22, mL[1] + 6, { role: 'label', size: 19, color: C.ink2, align: 'right', alpha: kpush });
        text('Squeezed', mR[0] + 22, mR[1] + 6, { role: 'label', size: 19, color: C.ink2, alpha: kpush });
      }
      fixTag(t, 1.5, [TT[2][0] + 6, TT[2][1] + 4], 'Holds', { to: [TT[2][0] + 96, TT[2][1] - 40], side: 'r', alpha: kTxt });
      text('3 straws, 3 pins: statically determinate', trC[0], by0 + 56, { role: 'small', size: 23, weight: 600, color: C.ink2, align: 'center', alpha: ep(t, 1.5, 1.9) * kTxt });
      text('A push can only stretch one side and squeeze another', trC[0], by0 + 86, { role: 'small', size: 21, weight: 600, color: C.mute, align: 'center', alpha: ep(t, 1.6, 1.9) * kTxt });
    }
    /* ---- 2.9 s on: the lattice as a bridge, a strip across the top, laid flat; it opens out from its middle cell ---- */
    const aB = ep(t, 2.75, 3.3);
    const kH = ep(t, 3.6, 4.6, E.io3), kT = ep(t, 4.8, 5.8, E.io3);
    const dH = b06_drawStrip(rH, x0L, B06_YS, B06_S, B06_E, kH, { alpha: aB, smax, flow: 0.5 * kH, t });
    const dT = b06_drawStrip(rT, x0R, B06_YS, B06_S, B06_E, kT, { alpha: aB, smax, flow: 0.5 * kT, t });
    b06_press(t, dH.contact, kH, ep(t, 3.2, 3.6)); b06_press(t, dT.contact, kT, ep(t, 4.4, 4.8));
    if (kH > 0.5) faultTag(t, 4.5, dH.hot, 'Bends at every joint: ' + fmtN(b06_flex(rH), 2) + ' mm', { to: [dH.hot[0] - 30, dH.hot[1] + 64], side: 'l' });
    if (kT > 0.5) fixTag(t, 5.7, b06_wallMid(rT, x0R, 1, kT, true), 'Only stretches and squeezes: ' + fmtN(b06_flex(rT), 3) + ' mm', { to: [x0R + 340, B06_YS + 70], side: 'l', maxW: 300 });
    b06_stripLocator(t, 3.0);
    /* readouts: the same weight, so the hexagons' walls are wider */
    const ka = ep(t, 3.0, 3.4);
    b06_readout(L[0], B06_RY, ['Weight', fmtN(b06_grams(rH), 2) + ' g', C.ink2], ['Walls', fmtN(rH.model.els[0].h, 2) + ' mm', C.ink2], ka);
    b06_readout(R[0], B06_RY, ['Weight', fmtN(b06_grams(rT), 2) + ' g', C.heroText], ['Ribs', fmtN(rT.model.els[0].h, 2) + ' mm', C.heroText], ka);
    /* who builds honeycombs, and the human scale */
    text('Honeycomb mice: Finalmouse UltralightX, G-Wolves HTS Ultra 8K. Finalmouse\'s patent calls its honeycomb "a rigid housing".', 80, 646, { role: 'small', size: 21, weight: 600, color: C.faint, alpha: ep(t, 3.8, 4.3) });
    scaleNote(80, 702, B06_STRIP.pressSay, { lead: '10 N', t, t0: 3.8, size: 22 });
    /* the verdicts: flex, then the peak */
    verdict(t, 6.2, 80, 850, { from: fmtN(b06_flex(rH), 2), to: fmtN(b06_flex(rT), 3), unit: 'mm', dec: 3, label: 'Ribs alone: flex under 10 N', better: 'lower', who: ['Hexagons', 'Triangles'], rivalCol: 'grey', net: fmtN(kStiff, 1) + '× stiffer, the same weight', size: 110 });
    { const ks = ep(t, 6.9, 7.3); text('Peak experienced stress {(lower is better)}', 1000, 790, { role: 'label', size: 20, color: C.mute, alpha: ks });
      rich([{ s: Math.round(rH.smax) + ' MPa', role: 'num', size: 30, weight: 750, color: C.mute }, { s: '→', role: 'num', size: 26, weight: 600, color: C.faint, gap: 10 }, { s: Math.round(rT.smax) + ' MPa', role: 'num', size: 40, weight: 800, color: C.heroText, gap: 10 }, { s: '−' + cut + ' %', role: 'num', size: 30, weight: 800, color: C.heroText, gap: 18 }], 1000, 842, { alpha: ks });
      text('Hexagons, then triangles, at the same 10 N', 1000, 876, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: ks }); }
    shlRamp(t, 4.6, 1560, 660, 200, Math.round(rH.smax), 'Colour: stress, squared', SHL_GAMMA);
    text('In the whole shell its wall shares the load: there the triangles make the crown 1.2× stiffer and the hottest rib 38% cooler (3D study, the same rib weight).', 80, 972, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: ep(t, 7.6, 8.0), maxW: 1760 });
    text('2D frames pressed in their own plane, joints stiffened to their filleted size: a ' + SP + ' mm strip, ' + B06_BR.a + ' mm cells, PP-C-20A ribs 2.0 mm tall, the same ' + fmtN(b06_grams(rT), 2) + ' g. Flex drawn 10× real.', 80, 1002, { role: 'small', size: 19, color: C.faint, alpha: ep(t, 3.4, 3.9), maxW: 1760 });
  }
});

/* ============================== 2. b06_light: triangles win more on a light mouse ============================== */
/* Checked (08:4x): the first build's "max press before it breaks" was not a fair measure. The frame solver has no
   buckling, and at 0.5 mm the triangles' top chord would buckle near 31 N (Euler, K 0.7), well under the 79 N their
   strength gave; the hexagon walls bend, so their beam peak meets the 207 MPa bending strength before the 120 MPa tensile.
   With both, the strength lead shrinks as the weight drops. Stiffness has neither problem and is the brief's measure: the
   press that flexes each strip's middle 0.1 mm, a sheet of copy paper (SCALE.paper). */
const B06_LIM = SCALE.paper.mm, B06_EL = 30;            /* the flex limit (mm) and the flex exaggeration on this slide */
const b06_p01 = r => B06_BR.P * B06_LIM / b06_flex(r);  /* the press that flexes the strip to the limit, N (linear) */
/** the weight sweep: rib width 1.0 → 0.5 mm (the triangles'), both kinds, for the chart */
function b06_sweep() {
  return b06_once('sweep2', () => { const out = []; for (let i = 0; i <= 40; i++) { const t = 1.0 - 0.5 * i / 40, T = b06_bridge('tri', t), X = b06_bridge('hex', t); out.push({ t, g: b06_grams(T), pT: b06_p01(T), pH: b06_p01(X) }); } return out; });
}
/** the rib width at which a click's force (SCALE.click, 0.54 N) flexes the honeycomb strip to the limit: bisection */
function b06_clickT() { return b06_once('clickT', () => { let lo = 0.5, hi = 1.0; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (b06_p01(b06_bridge('hex', m)) < SCALE.click.N) lo = m; else hi = m; } return Math.round(hi * 1000) / 1000; }); }
/** the flex limit at a strip's press point: a dashed line 0.1 mm (drawn B06_EL×) under the unloaded contact, solid once
   reached, with its size beside it */
function b06_gauge(c0, s, reached, a) {
  if (a <= 0.003) return;
  const y1 = c0[1] + B06_LIM * B06_EL * s, x1 = c0[0] - 22, x0 = x1 - 62, col = reached ? C.ink : C.mute;
  line(x0, c0[1], x1, c0[1], { color: C.faint, w: 1.5, alpha: a });
  line(x0, y1, x1, y1, { color: col, w: reached ? 2.5 : 1.8, dash: reached ? null : [5, 4], alpha: a });
  arrow(x0 + 8, c0[1] + 3, x0 + 8, y1 - 2, { color: C.mute, w: 1.5, hs: 6, alpha: a });
  text('0.1 mm', x0 - 8, (c0[1] + y1) / 2 + 7, { role: 'num', size: 19, weight: 650, color: reached ? C.ink2 : C.mute, align: 'right', alpha: a });
}
S({
  id: 'b06_light', ch: 'shell', theme: 'night', title: 'Triangles win more on a light mouse', settle: 12, ideas: [75, 5],
  replaces: ['shlThin'], src: ['b06Model', 'shlPyrofil', 'mitHoney', 'shlMaxwell', 'b06Johnson'],
  answers: [
    ['"needs a better explanation"', 'The why is said on the strips themselves: a hexagon wall bends, so at half the width it is an eighth as stiff; a triangle rib stretches, so at half the width it is half as stiff (b05_cubed\'s cube against a straight line). The captions say it in those words.'],
    ['"and more information to be more intuitive"', 'Each strip is pressed until its middle flexes 0.1 mm, a sheet of copy paper, and the press is written on its arrow; then the weight drops with everything live: rib width and weight on each strip, the press each takes, the chart of both with the gap shaded, a 10 N line (a 1 kg bag of sugar) and a click line (0.54 N).'],
    ['"i really like the fact that triangles win more as the mouse gets lighter, this really just isn\'t as compelling as it should be sits hard ti understand"', 'The pointer drags the weight down: the honeycomb\'s press falls from 3.3 N to 0.38 N, less than one click (0.54 N), while the triangles\' falls only from 28 N to 13 N, still more than a 1 kg bag of sugar. The chart is the lead itself, linear, rising from 8.6× to 34×; the verdict (struck: the honeycomb) is the press each takes at half the weight, 0.4 against 12.9 N.'],
    ['"max load to bend maybe?"', 'Yes: the y axis is the max press before each strip flexes 0.1 mm (higher is better), on a log scale, against the weight. It measures bending, not breaking: checked, a break load would not be fair here (thin triangle ribs buckle first, and the solver has no buckling).'],
    ['F2.09 "elaborate more and do more animations on how triangles are more helpful on a lower weight mouse"', 'The whole slide is that animation: the same limit on both, the weight dropping, the honeycomb falling away.'],
    ['F2.09 "a bar of flex or strength to weight dropping"', 'The chart is stiffness (the press to a set flex) against the weight dropping, both lattices. The strip that ran across several slides is gone (Brock on shlShell3d: "they were a bad idea").']
  ],
  draw: t => {
    header(t, 'Triangles win more on a light mouse');
    const SW = b06_sweep(), S0 = SW[0], S1 = SW[SW.length - 1], tC = b06_clickT(), lead0 = S0.pT / S0.pH, lead1 = S1.pT / S1.pH;
    const T0 = 2.8, T1 = 6.2, ribAt = u => lerp(1.0, 0.5, ep(u, T0, T1, E.io3)), tr = ribAt(t);
    const rH = b06_bridge('hex', tr), rT = b06_bridge('tri', tr), pH = b06_p01(rH), pT = b06_p01(rT);
    /* 0.4 to 2.4 s: the same press rises on both; each stops where its strip's middle reaches the limit */
    const Fup = S0.pT * ep(t, 0.4, 2.4, E.io3), fH = Math.min(Fup, pH), fT = Math.min(Fup, pT), atH = Fup >= pH - 1e-6, atT = Fup >= pT - 1e-6;
    captions(t, [[0.6, 'Press each strip until it flexes 0.1 mm, a sheet of paper. The honeycomb gets there at ' + fmtN(S0.pH, 1) + ' N; the triangles take ' + Math.round(S0.pT) + ' N.'],
      [3.0, 'Now make the mouse lighter. A wall that bends loses stiffness with its width cubed; a rib that stretches, only in step with it.'],
      [6.6, 'At half the weight, ' + fmtN(S1.pH, 2) + ' N, less than a click, bends the honeycomb strip that far. The triangles take ' + Math.round(S1.pT) + ' N.']]);
    /* the two strips, side by side on one scale (the same places as b06_lattice), on from frame one */
    const { L, R } = abSplit(t, -2, B06_SPLIT, { left: 'Honeycomb mice', rival: 'Hexagons', rivalCol: 'grey', right: 'Theseus', rightSub: 'Triangles' });
    const SP = B06_BR.n * B06_BR.a, x0L = L[0] + (L[2] - SP * B06_S) / 2, x0R = R[0] + (R[2] - SP * B06_S) / 2;
    const dH = b06_drawStrip(rH, x0L, B06_YS, B06_S, B06_EL, fH / B06_BR.P, { heat: false, color: C.comp });
    const dT = b06_drawStrip(rT, x0R, B06_YS, B06_S, B06_EL, fT / B06_BR.P, { heat: false, color: C.hero, flow: 0.4 * ep(t, 1.2, 1.8), t });
    const c0 = (r, x0) => { const m = r.model, yS = m.nodes[m.bl][1], q = m.nodes[m.mid]; return [x0 + q[0] * B06_S, B06_YS - (q[1] - yS) * B06_S - m.els[0].h * B06_S * 0.5]; };
    const kg = ep(t, 0.2, 0.5);
    b06_gauge(c0(rH, x0L), B06_S, atH, kg); b06_gauge(c0(rT, x0R), B06_S, atT, kg);
    /* the press on each, its arrow as long as its force (100 px at 30 N) */
    const press = (c, f, a) => { if (a <= 0.003) return; finger(c[0], c[1], Math.PI / 2, { s: 6.2, press: clamp(f / 3), len: 15, alpha: a }); forceArrow(c[0] + 64, c[1] - 2, Math.PI / 2, Math.max(1, 100 * f / 30), { k: 1, N: f, dec: f < 1 ? 2 : f < 10 ? 1 : 0, color: C.ink, alpha: a, side: 'r' }); };
    const aP = ep(t, 0.15, 0.45);
    press(dH.contact, fH, aP); press(dT.contact, fT, aP);
    /* the honeycomb's press drops under one click (SCALE.click): its fault, named on the strip */
    const kClick = tr < tC ? 1 : 0, tClick = shbWhen(u => -ribAt(u), -tC, T0, T1);
    if (kClick) faultTag(t, tClick, [dH.contact[0] + 70, dH.contact[1] - 6], 'Less than one click', { to: [dH.contact[0] + 140, dH.contact[1] - 64], side: 'r', maxW: 300 });
    /* each strip's weight and rib width, live, under each panel's name */
    const ka = ep(t, 1.0, 1.4);
    b06_readout(L[0], B06_RY, ['Weight', fmtN(b06_grams(rH), 2) + ' g', C.ink2], ['Walls', fmtN(rH.model.els[0].h, 2) + ' mm', C.ink2], ka);
    b06_readout(R[0], B06_RY, ['Weight', fmtN(b06_grams(rT), 2) + ' g', C.heroText], ['Ribs', fmtN(rT.model.els[0].h, 2) + ' mm', C.heroText], ka);
    b06_stripLocator(t, 0.3);
    /* the why, on the drawings, as the weight starts to move */
    const kw = ep(t, 2.2, 2.6) * (1 - ep(t, 5.4, 5.9));
    if (kw > 0.003) {
      const wH = b06_wallMid(rH, x0L, 1, fH / B06_BR.P), wT = b06_wallMid(rT, x0R, 1, fT / B06_BR.P);
      b06_note(wH, [L[0] + 40, 592], 'A hexagon wall bends: half as wide, an eighth as stiff', kw, C.mute, 760);
      b06_note(wT, [R[0] + 40, 592], 'A triangle rib stretches: half as wide, half as stiff', kw * ep(t, 2.6, 3.0), C.heroText, 760);
    }
    scaleNote(1250, 640, 'a sheet of copy paper (drawn 30×)', { lead: '0.1 mm', t, t0: 1.2 });
    /* the chart: the triangles' lead (the press each takes to the limit, triangles ÷ hexagons) against the weight, linear,
       lighter to the right; its weight axis is the slider (critic R-b06-2: the lead itself reads at a glance) */
    const cx0 = 250, cx1 = 1100, cyT = 668, cyB = 926, aC = ep(t, 1.6, 2.2), Ymax = 40;
    const gMax = S0.g, gMin = S1.g, X = g => cx0 + (gMax - g) / (gMax - gMin) * (cx1 - cx0), Y = v => cyB - v / Ymax * (cyB - cyT);
    if (aC > 0.003) {
      text('The triangles\' lead: × the press to flex 0.1 mm, the same weight {(higher is better)}', 80, 640, { role: 'label', size: 20, color: C.mute, alpha: aC });
      for (const v of [10, 20, 30, 40]) { line(cx0, Y(v), cx1, Y(v), { color: C.hair, w: 1.2, alpha: aC }); text(v + '×', cx0 - 14, Y(v) + 7, { role: 'tick', size: 19, color: C.mute, align: 'right', alpha: aC }); }
      line(cx0, cyB, cx1, cyB, { color: C.faint, w: 1.5, alpha: aC });
      text('0×', cx0 - 14, cyB + 7, { role: 'tick', size: 19, color: C.mute, align: 'right', alpha: aC });
      for (const g of [0.45, 0.4, 0.35, 0.3, 0.25]) { line(X(g), cyB, X(g), cyB + 7, { color: C.faint, w: 1.5, alpha: aC }); text(fmtN(g, 2) + ' g', X(g), cyB + 30, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: aC }); }
      text('Lattice weight, lighter →', cx1, cyB + 58, { role: 'label', size: 19, color: C.ink2, align: 'right', alpha: aC });
      /* the lead at full weight, held as a dashed line so the growth reads against it */
      const kc = ep(t, 2.3, 2.7), gNow = lerp(gMax, gMin, (1.0 - tr) / 0.5), xn = X(gNow), lead = pT / pH;
      line(cx0, Y(lead0), cx1, Y(lead0), { color: C.mute, w: 1.5, dash: [6, 6], alpha: aC * kc });
      text(fmtN(lead0, 1) + '× at full weight', cx1 - 4, Y(lead0) + 24, { role: 'small', size: 19, weight: 600, color: C.mute, align: 'right', alpha: aC * kc });
      /* the lead so far, up to the weight on screen */
      const seq = SW.filter(q => q.g >= gNow - 1e-9).map(q => [X(q.g), Y(q.pT / q.pH)]).concat([[xn, Y(lead)]]);
      if (kc > 0.003) { poly(seq, { color: C.hero, w: 4, alpha: aC * kc }); circle(xn, Y(lead), 7, { fill: C.hero, alpha: aC * kc }); }
      /* the value now, and the two presses it divides, small */
      if (kc > 0.003) {
        text(fmtN(lead, lead < 10 ? 1 : 0) + '×', xn + 14, Y(lead) - 12, { role: 'num', size: 30, weight: 800, color: C.heroText, alpha: aC * kc });
        text(fmtN(pT, pT < 10 ? 1 : 0) + ' N ÷ ' + fmtN(pH, pH < 1 ? 2 : 1) + ' N', xn + 14, Y(lead) + 16, { role: 'num', size: 19, weight: 650, color: C.mute, alpha: aC * kc });
      }
      /* the knob on the weight axis, and the pointer that drags it */
      rr(xn - 9, cyB - 9, 18, 18, 9, C.panel, C.ink, 2.5, aC);
      cursorAt(t, [[2.0, [xn + 160, cyB + 60]], [2.7, [X(gMax) + 3, cyB + 3]], [T1, [X(gMin) + 3, cyB + 3]], [7.2, [X(gMin) + 3, cyB + 3]]], [2.75], { a: ep(t, 1.9, 2.2) * (1 - ep(t, 6.8, 7.2)), grab: t > 2.7 && t < 6.4 });
    }
    /* the verdict (FILM F8: the struck value is the rival's): at half the weight, the press each strip takes to the limit;
       the lead's growth is the chart's plain stat (8.6× at full weight, dashed) */
    verdict(t, 6.0, 1250, 900, { from: fmtN(S1.pH, 1), to: fmtN(S1.pT, 1), unit: 'N', dec: 1, label: 'Half the weight: press to flex 0.1 mm', better: 'higher', who: ['Honeycomb', 'Triangles'], rivalCol: 'grey', net: false, size: 120, maxW: 640 });
    text('2D frames pressed in their own plane, joints stiffened to their filleted size: a ' + SP + ' mm strip, ' + B06_BR.a + ' mm cells, PP-C-20A ribs 2.0 mm tall. Flex drawn 30× real.', 80, 1002, { role: 'small', size: 19, color: C.faint, alpha: ep(t, 1.6, 2.1), maxW: 1760 });
  }
});
/* ============================== 3. b06_arches: interwoven arches form triangles ============================== */
/* The dome and the three families of lines are 10-d2-arches.js's (SHB_LAT, on shbDomeY: the Sora outline and the hump's
   sampled sections). Two fixes (Brock: "arches shouldn't be on the bottom rim" and "some of the lines look wobbly"; F43.6:
   no lattice below the hard crease): each rib keeps only its top part, from shoulder to shoulder (the widest line, at or
   above the crease), never the drop to the rim; and its height is smoothed along its length (the sampled tables left
   kinks), drawn at one weight all the way (the old lines switched weight front to back). */
const B06_ARC = (function () {
  const L = SHB_LAT, g = (arr, sig) => arr.map((_, i) => { let sw = 0, sv = 0; for (let k = -3 * sig; k <= 3 * sig; k++) { const j = Math.min(arr.length - 1, Math.max(0, i + k)), w = Math.exp(-k * k / (2 * sig * sig)); sw += w; sv += arr[j] * w; } return sv / sw; });
  const lines = L.lines.map(ln => {
    const nTop = ln.n.length, off = (ln.pts.length - nTop) / 2, top = ln.pts.slice(off, off + nTop);
    /* smoothed inside, pinned at both ends (the shoulder), blended over the last 6 samples so no end lifts off the shell */
    const ys = g(top.map(p => p[1]), 4), nT = top.length, pts = top.map((p, i) => { const w = clamp(Math.min(i, nT - 1 - i) / 6); return [p[0], lerp(p[1], ys[i], w), p[2]]; });
    let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]);
    return { fam: ln.fam, k: ln.k, pts, len };
  });
  return { lines, wide: L.wide, rim: L.rim, tris: L.tris, node: L.node, a: L.a, longest: Math.max(...lines.map(l => l.len)), wall: L.a / Math.sqrt(3) };
})();
S({
  id: 'b06_arches', ch: 'shell', theme: 'paper', title: 'Interwoven arches form triangles', settle: 11, ideas: [53, 75],
  replaces: ['shbArches'], src: ['shlDoc', 'shlLattice', 'shbModel', 'b06Honeycomb'],
  answers: [
    ['shbArches: "arches shojdkne be on the photon rim" (read: shouldn\'t be on the bottom rim)', 'Every rib springs from the shoulder, the widest line, and stops there; the rim below the crease is drawn plain, with no lattice on it (F43.6 too).'],
    ['shbArches: "for some reason sole of the lines look wobbly"', 'Two causes, both fixed: the dome\'s height came from sampled tables with kinks (now smoothed along each rib), and each line switched weight from front to back (now one weight all the way).'],
    ['shbArches: "cool animation other than the poor execution"', 'The build is kept (the families one by one, the triangles closing), now established from above on the mouse\'s outline, then the camera tilts and every straight line rises into an arch over the hump.'],
    ['F2.16 (interwoven arches)', 'Said in the verdict: a rib runs unbroken from shoulder to shoulder, up to ' + Math.round(B06_ARC.longest) + ' mm, where a honeycomb\'s wall turns every ' + fmtN(B06_ARC.wall, 1) + ' mm.']
  ],
  draw: t => {
    header(t, 'Interwoven arches form triangles');
    const A = B06_ARC;
    captions(t, [[0.4, 'From above, Theseus\'s lattice is three families of straight ribs, 60° apart. Where they cross, triangles close.'],
      [3.0, 'From the side, every one of those ribs is an arch over the hump, from shoulder to shoulder. None runs onto the rim.'],
      [6.0, 'So a press on the top meets whole arches: a rib runs unbroken up to ' + Math.round(A.longest) + ' mm, where a honeycomb wall turns every ' + fmtN(A.wall, 1) + ' mm.']]);
    /* the camera: from straight above (establishing, on the mouse's own outline) tilting to three quarters */
    const kc = ep(t, 2.8, 4.8, E.io3), yaw = lerp(0, -0.62, kc), pitch = lerp(Math.PI / 2, 0.66, kc);
    const tx = 80, ty = 280, tw = 1120, th = 660;
    const fit = b06_once('arcFit:' + Math.round(kc * 40), () => { const c = shbCam({ yaw, pitch, s: 1, cx: 0, cy: 0, T: [0, 12, 0] }); let a = 1e9, b = -1e9, u = 1e9, v = -1e9; A.wide.concat(A.rim).forEach(p => { const q = c(p); a = Math.min(a, q[0]); b = Math.max(b, q[0]); u = Math.min(u, q[1]); v = Math.max(v, q[1]); }); return { a, b, u, v }; });
    const sF = Math.min((tw - 120) / (fit.b - fit.a), (th - 120) / (fit.v - fit.u)), cam = shbCam({ yaw, pitch, s: sF, cx: tx + tw / 2 - sF * (fit.a + fit.b) / 2, cy: ty + th / 2 - sF * (fit.u + fit.v) / 2, T: [0, 12, 0] });
    /* the shell: the shoulder line (where the ribs end) and the rim below the crease, plain */
    shbPath(A.wide.map(cam), C.mute, 2, 1);
    shbPath(A.rim.map(cam), C.faint, 1.5, 0.5 + 0.5 * kc, { dash: [6, 7] });
    if (kc > 0.5) { const q = cam(A.rim[Math.round(A.rim.length * 0.18)]); callout(t, 4.6, q, 'The rim below the crease: no lattice', { to: [q[0] + 90, ty + th - 30], side: 'r', color: C.mute, tcolor: C.ink2, maxW: 420 }); }
    /* the triangles, faint, once the third family closes them */
    const kT = ep(t, 2.2, 2.8);
    if (kT > 0.003) A.tris.forEach(T => { const P = T.ring.map(cam); G.save(); G.globalAlpha = kT * 0.10; G.fillStyle = C.hero; G.beginPath(); P.forEach((p, q) => q ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.closePath(); G.fill(); G.restore(); });
    /* the ribs: three families, each line growing out from its middle, one weight all the way */
    const fam0 = [0.3, 1.0, 1.7];
    A.lines.forEach(ln => {
      const t0 = fam0[ln.fam] + Math.abs(ln.k) * 0.03, k = ep(t, t0, t0 + 0.7, E.io3); if (k <= 0.003) return;
      const P = ln.pts.map(cam), n = P.length, m = (n - 1) / 2, h = Math.max(1, Math.round(m * k));
      shbPath(P.slice(Math.max(0, Math.floor(m) - h), Math.min(n, Math.ceil(m) + h + 1)), C.heroGrad[ln.fam], 3, 0.95);
    });
    /* the longest arch, picked out, once the camera has tilted */
    const kL = ep(t, 5.0, 5.6);
    if (kL > 0.003) { const best = A.lines.reduce((b, l) => l.len > b.len ? l : b, A.lines[0]), P = best.pts.map(cam); shbPath(P, C.heroText, 6, kL); const q = P[Math.round(P.length * 0.3)]; fixTag(t, 5.4, q, 'One unbroken rib: ' + Math.round(best.len) + ' mm', { to: [q[0] - 60, ty + 40], side: 'l', maxW: 300 }); }
    locator(t, -2, 1700, 268, 100, 'top', [-31, -50, 62, 100]);
    /* right: the crown node close up, three ribs straight through, filleted */
    const an = ep(t, 6.6, 7.2);
    shbNodeClose(t, 6.8, 1500, 560, 30, { alpha: an, rot: Math.PI / 6 });
    text('At the crown: three ribs run straight through, filleted 0.6 mm', 1500, 700, { role: 'small', size: 22, weight: 600, color: C.ink2, align: 'center', maxW: 420, lh: 1.3, alpha: an });
    /* the verdict: the longest unbroken run of rib */
    verdict(t, 6.4, 1260, 905, { from: fmtN(A.wall, 1), to: Math.round(A.longest), unit: 'mm', dec: 0, label: 'Longest unbroken rib', better: 'higher', who: ['Honeycomb', 'Theseus'], rivalCol: 'grey', net: false, size: 110 });
    text('The Theseus top (the Sora outline and the hump\'s sections), smoothed along each rib; 12.5 mm cells; the ribs stop at the shoulder, above the crease.', 80, 1002, { role: 'small', size: 19, color: C.faint, alpha: ep(t, 1.0, 1.5), maxW: 1760 });
  }
});

/* ============================== 4. b06_arch: why an arch holds ============================== */
/* The arch and the flat strip are 10-d2-arches.js's (shbArch: a 10 mm wide strip of PP-C-20A, 60 mm across, a parabola of
   20 mm rise thinned to 0.72 mm so it weighs the same 0.55 g as the 0.9 mm flat strip; 10 N over a 10 mm pad). Checked:
   - the flat strip is drawn on a pin and a roller. A straight strip carries no axial force in a linear model, so its numbers
     are the same as on two pins; on a roller they are also physically right (two held ends would add membrane tension that
     a linear model can't see once it sags several times its thickness).
   - the held arch reaches 120 MPa at 45 N, but a linear buckling analysis of the same frame (work/b06/tools/buckle.js,
     checked on an Euler column) puts its buckling at 41 N, and real arches buckle below that: so it is pressed to 30 N here.
   - cracks at the chapter's 120 MPa (SHL_STR.ft, the tensile break): conservative in bending, where the datasheet gives
     207 MPa; the plate's crack and the arch's margin use the same rule. */
const B06_AR = { s: 13, xc: 1260, yb: 640 };
/* the chapter's break rule (F41.1, Brock 09:2x, "two strengths"): stretching (axial) stress against 120 MPa, bending
   against 207 MPa (Pyrofil PP-C-20A: tensile breaking stress, JIS K7162; bending strength, JIS K7171), combined linearly */
const B06_FT_AX = 120, B06_FT_BEND = 207;
/** each element's use of its strength (1 = it breaks): the model auditor's feUse (proposed for 07-sim.js), under my prefix */
function b06_use(r) {
  return r.model.els.map((el, e) => { const A = el.w * el.h, I = el.w * Math.pow(el.h, 3) / 12, sa = Math.abs(r.N[e]) / A, sb = el.truss ? 0 : Math.max(Math.abs(r.M1[e]), Math.abs(r.M2[e])) * el.h / 2 / I; return sa / B06_FT_AX + sb / B06_FT_BEND; });
}
function b06_util(r) { return Math.max(...b06_use(r).filter((_, e) => !r.model.els[e].rigid)); }
/** the press (N) that breaks a strip solved at SHB_A.P, by the two-strength rule */
const b06_breakAt = (r, P = SHB_A.P) => P / b06_util(r);
/* the held arch's first buckling mode (in plane, antisymmetric: the crown sways), from a linear buckling analysis of the
   same frame (work/b06/tools/buckle.js and buckmode.js, checked on an Euler column; the model auditor's buckle.js gives the
   same 41.1 N): lam × 10 N is the buckling press; d the node displacements, largest 1 mm */
const B06_ARCH_MODE = { lam: 4.1055, d: [[0,0],[0.105,-0.08],[0.204,-0.158],[0.296,-0.234],[0.381,-0.306],[0.457,-0.373],[0.524,-0.434],[0.582,-0.49],[0.63,-0.538],[0.669,-0.578],[0.699,-0.612],[0.721,-0.637],[0.736,-0.655],[0.743,-0.665],[0.745,-0.667],[0.742,-0.662],[0.734,-0.65],[0.723,-0.631],[0.709,-0.606],[0.693,-0.576],[0.677,-0.54],[0.659,-0.499],[0.642,-0.454],[0.626,-0.405],[0.611,-0.353],[0.598,-0.299],[0.586,-0.242],[0.577,-0.183],[0.57,-0.122],[0.566,-0.061],[0.565,0],[0.566,0.061],[0.57,0.122],[0.577,0.183],[0.586,0.242],[0.598,0.299],[0.611,0.353],[0.626,0.405],[0.642,0.454],[0.659,0.499],[0.677,0.54],[0.693,0.576],[0.709,0.606],[0.723,0.631],[0.734,0.65],[0.742,0.662],[0.745,0.667],[0.743,0.665],[0.736,0.655],[0.721,0.637],[0.699,0.612],[0.669,0.578],[0.63,0.538],[0.582,0.49],[0.524,0.434],[0.457,0.373],[0.381,0.306],[0.296,0.234],[0.204,0.158],[0.105,0.08],[0,0]] };
function b06_archFree() { return simSolve('b06:archFree', () => { const m = shbArchModel('para', 'pad', 0); m.fix = { 0: 'xy', [SHB_A.n]: 'y' }; return m; }); }
/** a strip at rest bending up from flat (u 0) to the arch (u 1), as a frame result with no load (for feDraw) */
function b06_archShape(u) {
  const A = SHB_A, ra = shbArch('para'), rf = shbArch('flat'), n = A.n, nodes = [], els = [];
  for (let i = 0; i <= n; i++) { const x = -A.span / 2 + A.span * i / n; nodes.push([x, u * A.rise * (1 - Math.pow(2 * x / A.span, 2))]); }
  const h = lerp(rf.model.els[0].h, ra.model.els[0].h, u);
  for (let i = 0; i < n; i++) els.push(Object.assign({}, ra.model.els[i], { i, j: i + 1, h }));
  const z = new Array(n).fill(0);
  return { model: { nodes, els }, d: new Float64Array(3 * (n + 1)), sig: z.slice(), N: z.slice(), M1: z.slice(), M2: z.slice(), smax: 1 };
}
/**
 * Draw a solved strip (flat or arch) at the press F (N), flex true to scale. o = { feet: 'pinroll' | 'rolls' (both feet
 * slide out evenly: the same frame seen from its crown) | 'held' (blocks at both feet), crack (0..1), alpha }.
 * Returns { P, contact, hot, other, feet: [left, right] (stage px) }.
 */
function b06_archDraw(r, F, o = {}) {
  const A = B06_AR, s = A.s, k = Math.max(1e-6, F / SHB_A.P), m = r.model, n = m.nodes.length - 1, a = o.alpha == null ? 1 : o.alpha;
  /* buckling (o.buckle, mm): the mode added to the linear shape (divided by k, as feDraw multiplies the shape by the load) */
  if (o.buckle > 0) { const d = Float64Array.from(r.d); B06_ARCH_MODE.d.forEach(([u, v], i) => { d[i * 3] += u * o.buckle / k; d[i * 3 + 1] += v * o.buckle / k; }); r = Object.assign({}, r, { d }); }
  const dx = o.feet === 'rolls' ? -r.d[n * 3] * k / 2 : 0, P = p => [A.xc + (p[0] + dx) * s, A.yb - p[1] * s];
  const def = i => [m.nodes[i][0] + r.d[i * 3] * k, m.nodes[i][1] + r.d[i * 3 + 1] * k], h = m.els[0].h;
  if (a > 0.003) {
    const rU = Object.assign({}, r, { sig: b06_use(r).map(u => u * B06_FT_BEND) });   /* colour by use of strength (red at 1), F41.1 */
    feDraw(shlSigG(rU, B06_FT_BEND, k), P, { scale: 1, load: k, smax: B06_FT_BEND, w: s, alpha: a, seg: 8 });
    const fl = P(def(0)), fr = P(def(n)), dy = h * s * 0.5 + 2;
    if (o.feet === 'held') {
      for (const [f, sg] of [[fl, -1], [fr, 1]]) { G.save(); G.globalAlpha = a; G.fillStyle = C.comp2; G.strokeStyle = C.comp; G.lineWidth = 2; G.beginPath(); G.rect(sg < 0 ? f[0] - 46 : f[0] + 6, f[1] - 34, 40, 52); G.fill(); G.stroke(); G.restore(); feSupport([f[0], f[1] + dy], 'pin', { alpha: a, s: 16, color: C.mute }); }
    } else {
      feSupport([fl[0], fl[1] + dy], o.feet === 'rolls' ? 'roll' : 'pin', { alpha: a, s: 16, color: C.mute });
      feSupport([fr[0], fr[1] + dy], 'roll', { alpha: a, s: 16, color: C.mute });
    }
  }
  const mid = Math.round(n / 2), c = P(def(mid)), hn = b06_hotNode(r);
  const out = { P, contact: [c[0], c[1] - h * s * 0.5], hot: P(def(hn.node)), other: P(def(hn.other)), feet: [P(def(0)), P(def(n))] };
  if (o.crack > 0.003) b06_crack(out.hot, out.other, Math.max(14, h * s * 1.6), o.crack, a);
  return out;
}
/** an egg squeezed end to end between thumb and finger: k the squeeze, the force flowing round the shell as dashes */
function b06_egg(t, cx, cy, H, k, a) {
  if (a <= 0.003) return;
  const W = H * 0.76, pts = [];
  for (let i = 0; i <= 96; i++) { const th = i / 96 * TAU; pts.push([cx + W / 2 * Math.sin(th) * (1 + 0.07 * Math.cos(th)), cy - H / 2 * Math.cos(th)]); }
  G.save(); G.globalAlpha = a; G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.closePath();
  G.fillStyle = C.panel; G.fill(); G.strokeStyle = C.ink2; G.lineWidth = 3.5; G.stroke(); G.restore();
  if (k > 0.003) {
    /* the squeeze runs from pole to pole down both sides of the shell: compression, shown moving */
    for (const sg of [-1, 1]) {
      const side = []; for (let i = 0; i <= 48; i++) { const th = i / 48 * Math.PI; side.push([cx + sg * (W / 2 - 9) * Math.sin(th) * (1 + 0.07 * Math.cos(th)), cy - (H / 2 - 9) * Math.cos(th)]); }
      G.save(); G.globalAlpha = a * k; G.strokeStyle = C.ink2; G.lineWidth = 3; G.setLineDash([10, 12]); G.lineDashOffset = -t * 36; G.lineCap = 'round';
      G.beginPath(); side.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.stroke(); G.restore();
    }
  }
  finger(cx, cy - H / 2 - 2, Math.PI / 2, { s: 4.6, press: k, len: 18, alpha: a });
  finger(cx, cy + H / 2 + 2, -Math.PI / 2, { s: 4.6, press: k, len: 18, alpha: a, flip: true });
}
/** the Pont du Gard, simplified: three tiers of stone arches (6, 11 and 35 in the real one; fewer drawn), the thrust of one
   bottom arch shown at its feet */
function b06_pont(x, y, w, k, a) {
  if (a <= 0.003) return;
  const H = w * 0.52, tiers = [[0.44, 4], [0.34, 7], [0.22, 16]], stone = C.comp2, edge = C.comp;
  let yy = y + H;
  const arches = [];
  G.save(); G.globalAlpha = a;
  tiers.forEach(([fh, n], ti) => {
    const th = H * fh, top = yy - th, span = w / n, open = span * (ti === 2 ? 0.62 : 0.7), rad = open / 2, spring = top + th * (ti === 2 ? 0.42 : 0.38) + rad * 0.2;
    G.fillStyle = stone; G.strokeStyle = edge; G.lineWidth = 1.5; G.beginPath(); G.rect(x, top, w, th); G.fill(); G.stroke();
    for (let i = 0; i < n; i++) {
      const cxa = x + span * (i + 0.5), x0 = cxa - rad, x1 = cxa + rad;
      G.fillStyle = C.bg; G.beginPath(); G.moveTo(x0, yy); G.lineTo(x0, spring); G.arc(cxa, spring, rad, Math.PI, 0); G.lineTo(x1, yy); G.closePath(); G.fill(); G.stroke();
      if (ti === 0) arches.push([x0, x1, spring, cxa, rad]);
    }
    yy = top;
  });
  G.restore();
  if (k > 0.003 && arches.length > 1) {
    const [x0, x1, sp] = arches[1];
    arrow(x0 - 30, sp + 6, x0 - 3, sp + 6, { color: C.ink, w: 3, hs: 10, alpha: a * k });
    arrow(x1 + 30, sp + 6, x1 + 3, sp + 6, { color: C.ink, w: 3, hs: 10, alpha: a * k });
  }
}
S({
  id: 'b06_arch', ch: 'shell', theme: 'night', title: 'Why an arch holds', settle: 11, ideas: [53],
  replaces: ['shbPress', 'shbBend'], src: ['b06Sutanto', 'b06PontDuGard', 'b06Won', 'shbModel', 'shlPyrofil', 'b06Model'],
  answers: [
    ['shbPress, shbBend: "hard to understand"', 'One demonstration with one input: the same strip, the same weight, the same finger, pressed until it gives. Flat, it cracks at 20 N; curved with its feet free, they spread and it cracks at 13 N; with its feet held it takes 41 N and then buckles.'],
    ['shbPress, shbBend: "need real world examples"', 'An egg squeezed end to end between thumb and finger opens the slide: its thin dome takes about 46 N before it cracks, the weight of a 4.7 kg mass (Sutanto 2025, 30 eggs; about the same on its side, so the slide doesn\'t claim end-on is stronger); the Pont du Gard (stone arches standing largely without mortar, pushing on their neighbours and the hills) appears as the feet are held.'],
    ['shbPress, shbBend: "it\'s just unintuitive for a social media brain"', 'Press, crack; curve, crack; hold the feet, hold: three outcomes in under seven seconds, each in one short line, then two numbers: the press each takes before it gives (20 against 41 N, 2.0×) and the flex at 10 N (21× stiffer).'],
    ['shbBend: thrust cancelling bending (the brief: "shown, not described")', 'Shown by freeing and then holding the feet: free, they slide out and the arch bends worse than the flat strip; held, they push back (the thrust arrows, 23 N each at 41 N) and cancel 84 % of the bending moment. The caption says "most of the bending", not all: under a fingertip what is left is still bending (the thrust line, next slide).'],
    ['F2.24 (the arch idea needs a real-world anchor and a demonstration)', 'The egg and the Pont du Gard as anchors; the press-until-it-gives sequence as the demonstration. Breaks by F41.1\'s two strengths (207 MPa bent, 120 stretched); the held arch\'s limit is buckling, shown as a buckle, not a crack.']
  ],
  draw: t => {
    header(t, 'Why an arch holds');
    const rF = shbArch('flat'), rA = shbArch('para'), rR = b06_archFree(), Fp = b06_breakAt(rF), Fr = b06_breakAt(rR), Fb = B06_ARCH_MODE.lam * SHB_A.P;
    const cutM = Math.round(100 * (1 - Math.max(...rA.M1.map(Math.abs), ...rA.M2.map(Math.abs)) / Math.max(...rF.M1.map(Math.abs), ...rF.M2.map(Math.abs))));
    captions(t, [[0.4, 'An eggshell is thin, but it is a dome: squeezed end to end it takes about 46 N, the weight of a 4.7 kg mass.'],
      [1.6, 'A flat strip can only bend. Pressed in the middle, it cracks at ' + Math.round(Fp) + ' N.'],
      [3.6, 'Curve the same strip into an arch, the same weight. With its feet free they spread, and it cracks at ' + Math.round(Fr) + ' N.'],
      [5.2, 'Hold its feet, as a mouse\'s walls do: they push back and most bending goes. At ' + Math.round(Fb) + ' N it buckles.']]);
    /* the real world, left: the egg, then the Pont du Gard */
    const inner = demoPanel(t, -2, [80, 280, 540, 640], { label: 'The real world', src: t < 5.1 ? 'Sutanto 2025' : 'Pont du Gard' });
    const kEgg = 1 - ep(t, 5.0, 5.4), kPont = ep(t, 5.3, 5.8);
    const ksq = ep(t, 0.25, 0.9, E.io3), Fegg = 46 * clamp((t - 0.25) / 1.15), ex = inner[0] + inner[2] / 2, ey = inner[1] + 250, kcr = ep(t, 1.4, 1.6);
    b06_egg(t, ex, ey, 230, ksq, kEgg);
    if (kcr > 0.003) { const R0 = rng(11), pts = []; for (let i = 0; i <= 10; i++) { const th = 0.15 + 0.7 * i / 10 * Math.PI * kcr; pts.push([ex + 87 * 0.98 * Math.sin(th) * (1 + 0.07 * Math.cos(th)) + (R0() - 0.5) * 5, ey - 113 * Math.cos(th)]); } shbPath(pts, C.red, 3, kEgg); }
    if (t > 0.3) text(fmtN(Fegg, 0) + ' N', ex + 46, ey - 150, { role: 'num', size: 28, weight: 800, color: C.ink, alpha: kEgg });
    if (kcr > 0.5) callout(t, 1.5, [ex + 86, ey + 10], 'Cracks at 46 N: a 4.7 kg weight', { to: [ex + 120, ey + 140], side: 'r', alpha: kEgg, color: C.ink2, tcolor: C.ink, maxW: 190 });
    text('A thin dome takes about 46 N end to end (30 eggs; about the same on its side)', ex, inner[1] + 470, { role: 'small', size: 22, weight: 600, color: C.ink2, align: 'center', maxW: inner[2] - 20, lh: 1.3, alpha: ep(t, 0.9, 1.3) * kEgg });
    b06_pont(inner[0] + 10, inner[1] + 90, inner[2] - 20, ep(t, 5.9, 6.3), kPont);
    text('Its stone arches stand largely without mortar: each one pushes on its neighbours and the hillsides, and they push back', inner[0] + inner[2] / 2, inner[1] + 420, { role: 'small', size: 22, weight: 600, color: C.ink2, align: 'center', maxW: inner[2] - 20, lh: 1.3, alpha: kPont });
    /* the stage, right: one strip, pressed until it gives, three times */
    locator(t, -2, 1700, 268, 110, 'front', msBox('front', 'hump'));
    text('The hump, from the front', 1755, 360, { role: 'small', size: 19, weight: 600, color: C.mute, align: 'center' });
    const lin = (a0, a1) => clamp((t - a0) / (a1 - a0));
    let d = null, F = 0;
    if (t < 3.6) {                                  /* the flat strip, 1.6 to 2.8 s: 0 → its crack, held cracked to 3.4 */
      F = Fp * lin(1.6, 2.8); const kc = ep(t, 2.8, 3.0);
      d = b06_archDraw(rF, F, { feet: 'pinroll', crack: kc, alpha: 1 - ep(t, 3.4, 3.6) });
      if (kc > 0.003) faultTag(t, 2.8, d.hot, 'Cracks at ' + Math.round(Fp) + ' N', { to: [d.hot[0] + 150, d.hot[1] + 60], side: 'r', alpha: 1 - ep(t, 3.4, 3.6) });
    } else if (t < 5.25) {                           /* curve it (3.6 to 4.0), then press it with its feet free (4.0 to 4.6), held cracked to 5.1 */
      const u = ep(t, 3.6, 4.0, E.io3);
      if (u < 1) b06_archDraw(b06_archShape(u), 0, { feet: 'pinroll' });
      else { F = Fr * lin(4.0, 4.6); const kc = ep(t, 4.6, 4.8), ko = 1 - ep(t, 5.05, 5.25); d = b06_archDraw(rR, F, { feet: 'rolls', crack: kc, alpha: ko });
        if (F > 0.5) for (const [f, sg] of [[d.feet[0], -1], [d.feet[1], 1]]) arrow(f[0] - sg * 4, f[1] + 34, f[0] + sg * 44, f[1] + 34, { color: C.red, w: 3, hs: 10, alpha: ep(t, 4.1, 4.3) * ko });
        if (kc > 0.003) faultTag(t, 4.6, d.hot, 'Feet free: cracks at ' + Math.round(Fr) + ' N', { to: [d.hot[0] + 200, d.hot[1] + 70], side: 'r', alpha: ko });
      }
    } else {                                        /* the feet held (the walls): pressed until it buckles */
      const tB = 6.4; F = Fb * lin(5.4, tB); const kb = ep(t, 5.25, 5.4), bk = 7 * ep(t, tB, tB + 0.35, E.out3);
      d = b06_archDraw(rA, F, { feet: 'held', alpha: kb, buckle: bk });
      if (F > 0.3) { const Hb = shbThrustH(rA) * Fb / SHB_A.P; forceArrow(d.feet[0][0] - 50, d.feet[0][1] - 10, 0, 70, { k: clamp(F / Fb), N: Hb, dec: 0, color: C.heroText, side: 'end' }); forceArrow(d.feet[1][0] + 50, d.feet[1][1] - 10, Math.PI, 70, { k: clamp(F / Fb), N: Hb, dec: 0, color: C.heroText, side: 'end' }); }
      if (t > tB) callout(t, tB, [d.contact[0] + 10, d.contact[1] + 26], 'Buckles at ' + Math.round(Fb) + ' N', { to: [d.contact[0] + 180, d.contact[1] + 6], side: 'r', color: C.ink2, tcolor: C.ink });
      text('The walls hold its feet', B06_AR.xc, B06_AR.yb + 74, { role: 'small', size: 21, weight: 600, color: C.heroText, align: 'center', alpha: ep(t, 5.3, 5.6) });
    }
    shlRamp(t, 1.9, 1630, 452, 200, 'Breaks', 'Strength used, squared', SHL_GAMMA);
    /* the press: one finger and its force, the same every time */
    if (d) { finger(d.contact[0], d.contact[1], Math.PI / 2, { s: 6.6, press: clamp(F / 6), len: 16, alpha: 1 }); forceArrow(d.contact[0] + 66, d.contact[1] - 2, Math.PI / 2, 90, { k: clamp(F / Fb), N: Fb, dec: 0, color: C.ink, side: 'r' }); }
    else { const c = [B06_AR.xc, B06_AR.yb - SHB_A.rise * B06_AR.s * ep(t, 3.6, 4.0, E.io3) - 6]; finger(c[0], c[1], Math.PI / 2, { s: 6.6, press: 0, len: 16, alpha: 1 }); }
    text('The same strip, the same ' + fmtN(b06_grams(rA), 2) + ' g', 714, 376, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: ep(t, 3.6, 3.9) * (1 - ep(t, 5.05, 5.25)) });
    scaleNote(680, 300, 'a hard press: a 1 kg bag of sugar', { lead: '10 N', t, t0: 1.9, size: 22 });
    /* the verdicts: the press each takes before it gives, and the flex at the same 10 N */
    verdict(t, 6.5, 680, 885, { from: fmtN(b06_flex(rF), 1), to: fmtN(b06_flex(rA), 2), unit: 'mm', dec: 2, label: 'Flex at 10 N', better: 'lower', who: ['Flat strip', 'Arch, feet held'], rivalCol: 'grey', net: fmtN(b06_flex(rF) / b06_flex(rA), 0) + '× stiffer', size: 84 });
    verdict(t, 6.9, 1380, 885, { from: Math.round(Fp), to: Math.round(Fb), unit: 'N', dec: 0, label: 'Press before it gives', better: 'higher', who: ['Flat', 'Arch'], rivalCol: 'grey', size: 84 });
    text('2D frames: a 10 mm PP-C-20A strip, 60 mm across, ' + fmtN(b06_grams(rA), 2) + ' g either way, 10 N on a 10 mm pad. Breaks at 207 MPa bent, 120 stretched. Flex true to scale.', 80, 1002, { role: 'small', size: 19, color: C.faint, alpha: ep(t, 1.6, 2.1), maxW: 1760 });
  }
});
/* ============================== 5. b06_thrust: the thrust line ============================== */
/* The chain and the arch are the same parabola (a chain under weights spaced evenly across hangs as a parabola, the
   funicular of an even load). Checked (M-b06-4): under an even load (a palm) the arch's thrust line, e = M / |N| from the
   solve, stays within 0.005 mm of the rib's centre (the rib is 0.72 mm); under a 10 mm fingertip pad it strays 3.9 mm, out
   of the rib, and the arch carries the difference by bending (97 % of its peak). So the even load is the chain's twin; the
   fingertip is shown leaving the rib and said as bending, never as pure compression. */
const B06_TH = { s: 14, xc: 1250, yb: 700 };
/** Gaudí's hanging model, simplified: strings with small weights hanging from a beam; flip (−1 hanging .. 1 standing) turns
   it over about its middle into arches standing on the ground */
function b06_gaudi(x, y, w, h, flip, a) {
  if (a <= 0.003) return;
  const ym = y + h / 2, F = p => [p[0], ym + flip * (p[1] - ym) * -1];
  const top = y + 30, spans = [[0.06, 0.40, 0.62], [0.36, 0.64, 0.80], [0.60, 0.94, 0.56]];
  /* the beam they hang from (or the ground they stand on) */
  const b0 = F([x, top]), b1 = F([x + w, top]); line(b0[0], b0[1], b1[0], b1[1], { color: C.ink2, w: 3, alpha: a });
  for (const [u0, u1, dep] of spans) {
    const x0 = x + u0 * w, x1 = x + u1 * w, sag = (h - 70) * dep, pts = [];
    for (let i = 0; i <= 40; i++) { const u = i / 40, xx = lerp(x0, x1, u); pts.push(F([xx, top + sag * 4 * u * (1 - u)])); }
    shbPath(pts, C.ink2, 2, a);
    for (let q = 1; q < 6; q++) { const u = q / 6, xx = lerp(x0, x1, u), p = F([xx, top + sag * 4 * u * (1 - u)]), dl = 16 * (flip < 0 ? 1 : -1); line(p[0], p[1], p[0], p[1] + dl, { color: C.mute, w: 1.2, alpha: a }); circle(p[0], p[1] + dl + 4 * Math.sign(dl), 4.5, { fill: C.mute, alpha: a }); }
  }
}
S({
  id: 'b06_thrust', ch: 'shell', theme: 'paper', title: 'The thrust line', settle: 11, ideas: [53],
  replaces: ['shbThrust'], src: ['shbHooke', 'b06Gaudi', 'shbModel', 'shlPyrofil', 'b06Model'],
  answers: [
    ['shbThrust: "hard to understand"', 'One shape, three moves: a chain hangs in pure tension, turns over into an arch in pure compression, then the same arch under a palm (the line stays inside the rib) and under a fingertip (the line leaves the rib, and that part is carried by bending). The line is drawn from the solve and goes red where it leaves the rib.'],
    ['shbThrust: "need real world examples"', 'Gaudí\'s hanging model for the Colònia Güell church (strings and little bags of birdshot, read upside down) sits beside the chain and turns over with it; Hooke\'s 1675 line, "as hangs the flexible line, so but inverted will stand the rigid arch", is the caption.'],
    ['shbThrust: "it\'s just unintuitive for a social media brain"', 'Hang, flip, press: the motion is the explanation, and the numbers are two: under a palm the arch\'s peak is 65× lower than the flat strip\'s, under a fingertip 3.8× lower (the same 10 N).'],
    ['F2.24 (the thrust idea needs a demonstration and a real-world anchor)', 'The flip of the chain is the demonstration; Gaudí and Hooke are the anchors; the palm against the fingertip is the honest limit (model auditor M-b06-4).']
  ],
  draw: t => {
    header(t, 'The thrust line');
    const A = SHB_A, RU = shbArch('para', 'uni'), RC = shbArch('para', 'pad', 0), FU = shbArch('flat', 'uni'), FC = shbArch('flat');
    captions(t, [[0.4, 'Hang a chain with weights spread along it and it takes the one shape that is pure tension.'],
      [1.9, 'Turn it over and the same shape stands in pure compression: an arch. Hooke, 1675.'],
      [3.4, 'A palm pressing on the hump presses evenly: the thrust line stays inside the rib, all compression.'],
      [5.0, 'Gather it under a fingertip and the line leaves the rib. A plastic arch carries that part by bending; a stone one couldn\'t.']]);
    /* the real world, left: Gaudí's strings, turning over with the chain */
    const inner = demoPanel(t, -2, [80, 280, 520, 640], { label: 'The real world', src: 'Gaudí, Colònia Güell' });
    const flip = lerp(-1, 1, ep(t, 1.8, 3.0, E.io3));
    b06_gaudi(inner[0] + 10, inner[1] + 10, inner[2] - 20, 300, flip, 1);
    text(flip < 0 ? 'Strings and little bags of birdshot hang in pure tension' : 'Read upside down, they are the church\'s arches', inner[0] + inner[2] / 2, inner[1] + 380, { role: 'small', size: 22, weight: 600, color: C.ink2, align: 'center', maxW: inner[2] - 20, lh: 1.3, alpha: 1 - 0.85 * Math.sin(Math.PI * ep(t, 1.8, 3.0)) });
    text('Gaudí\'s hanging model for the Colònia Güell church, 1:10', inner[0] + inner[2] / 2, inner[1] + 470, { role: 'small', size: 19, weight: 600, color: C.mute, align: 'center', maxW: inner[2] - 20 });
    /* the stage: the chain, flipping into the arch */
    const s = B06_TH.s, cx = B06_TH.xc, by = B06_TH.yb, ym = by - A.rise * s / 2;
    const P = p => [cx + p[0] * s, ym + flip * (by - p[1] * s - ym)];
    locator(t, -2, 1700, 268, 110, 'front', msBox('front', 'hump'));
    text('The hump, from the front', 1755, 360, { role: 'small', size: 19, weight: 600, color: C.mute, align: 'center' });
    /* the load: a palm (even) gathering into a fingertip (a 10 mm pad at the crown) */
    const g = ep(t, 4.8, 5.6, E.io3), R = g < 1 ? shbBlend([RU, RC], [1 - g, g]) : RC;
    if (flip < 0) {
      /* the chain: beads, its pins, the weights, and tension running out to the pins */
      const pts = RU.model.nodes.map(P);
      G.save(); G.strokeStyle = C.ink2; G.lineWidth = 7; G.lineCap = 'round'; G.setLineDash([0.1, 11]); G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.stroke(); G.restore();
      for (const xs of [-1, 1]) { const p = P([xs * A.span / 2, 0]); circle(p[0], p[1], 6, { fill: C.mute }); line(p[0] - 22, p[1] - 10, p[0] + 22, p[1] - 10, { color: C.mute, w: 2 }); }
      for (let q = 1; q < 10; q++) { const p = pts[q * 6], dl = 34 * -flip; line(p[0], p[1], p[0], p[1] + dl, { color: C.mute, w: 1.5 }); rr(p[0] - 7, p[1] + dl, 14, 11, 2, C.mute, null, 0, 1); }
      feFlow(Object.assign({}, RU, { N: RU.N.map(v => -v) }), P, t, { scale: 0, alpha: 0.8 * ep(t, 0.4, 0.9) * -flip, nmax: 9 });
      if (t > 0.9) callout(t, 0.9, P([-14, A.rise * (1 - Math.pow(28 / 60, 2))]), 'Pure tension', { to: [P([-14, 0])[0] - 150, P([-14, 0])[1] + 40], side: 'l', color: C.ink2, tcolor: C.ink, alpha: -flip });
    } else {
      feDraw(R, P, { scale: 1, load: 1, w: s, alpha: flip, seg: 8, heat: false, color: C.comp });
      feFlow(R, P, t, { scale: 1, load: 1, alpha: flip * 0.7, nmax: 6 });
      for (const xs of [-1, 1]) feSupport(P([xs * A.span / 2, 0]), 'pin', { alpha: flip, s: 16 });
      /* the palm: an even press, small arrows all along the top, gathering into the fingertip's pad */
      const kL = ep(t, 3.2, 3.6) * flip;
      for (let q = 1; q < 10; q++) {
        const x = -A.span / 2 + q * 6, xg = lerp(x, (q - 5) * 1.1, g), ya = A.rise * (1 - Math.pow(2 * xg / A.span, 2)), p = P([xg, ya]);
        arrow(p[0], p[1] - 46, p[0], p[1] - 10, { color: C.mute, w: 2, hs: 10, alpha: kL * (1 - ep(t, 5.4, 5.7)) });
      }
      const kPalm = kL * (1 - ep(t, 4.8, 5.2));
      if (kPalm > 0.003) { const c = P([0, A.rise]); G.save(); G.globalAlpha = kPalm * 0.9; G.fillStyle = C.comp2; G.strokeStyle = C.comp; G.lineWidth = 2; G.beginPath(); G.ellipse(c[0], c[1] - 120, 330, 62, 0, 0, TAU); G.fill(); G.stroke(); G.restore(); text('A palm pressing on it: 10 N, spread', c[0], c[1] - 112, { role: 'small', size: 22, weight: 650, color: C.ink2, align: 'center', alpha: kPalm }); }
      if (g > 0.003) { const p = shbOnArch(R, P, 0, 1); finger(p[0], p[1] - 4, Math.PI / 2, { s: 6.6, press: g, len: 16, alpha: ep(t, 5.0, 5.4) }); }
      /* the thrust line, from the solve; red where it leaves the rib (|e| > h / 2): there the arch is bending */
      const kT = ep(t, 3.4, 4.2), TL = shbThrustLine(R);
      if (kT > 0.003) {
        const pts = shbPart(TL.map(q => { const p = P([q[0], q[1]]); return [p[0], p[1], Math.abs(q[2]) > q[3] / 2 ? 1 : 0]; }), kT);
        for (let i = 1; i < pts.length; i++) line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], { color: pts[i][2] ? C.red : C.ink, w: 3.5, alpha: flip });
        if (kT > 0.7 && g < 0.6) { const q = P([16, A.rise * (1 - Math.pow(32 / 60, 2))]); callout(t, 3.95, q, 'Thrust line: inside the rib', { to: [q[0] + 110, q[1] - 46], side: 'r', color: C.ink2, tcolor: C.ink, alpha: flip * (1 - ep(t, 5.0, 5.2)) }); }
        if (g >= 1) { let top = TL[0]; TL.forEach(q => { if (q[1] > top[1]) top = q; }); const q = P([top[0], top[1]]); faultTag(t, 5.6, q, 'Out of the rib: bending', { to: [q[0] - 190, q[1] - 26], side: 'l' }); }
      }
      /* the thrust at the feet */
      const H = shbThrustH(R), kH = ep(t, 3.8, 4.3) * flip;
      if (kH > 0.003) { for (const xs of [-1, 1]) { const p = P([xs * A.span / 2, 0]); arrow(p[0] + xs * 92, p[1] - 3, p[0] + xs * 22, p[1] - 3, { color: C.heroText, w: 3, hs: 14, alpha: kH }); } const p = P([-A.span / 2, 0]); text('Thrust ' + fmtN(H, 1) + ' N', p[0] - 140, p[1] - 22, { role: 'label', size: 20, color: C.heroText, alpha: kH }); }
    }
    /* the verdicts: the same 10 N on the arch and on b06_arch's flat strip, spread and gathered */
    text('Peak experienced stress at 10 N (lower is better)', 680, 752, { role: 'label', size: 22, color: C.mute, alpha: ep(t, 6.0, 6.35) });
    verdict(t, 6.0, 680, 880, { from: fmtN(FU.smax, 1), to: fmtN(RU.smax, 2), unit: 'MPa', dec: 2, label: 'Under a palm', who: ['Flat strip', 'Arch'], rivalCol: 'grey', net: fmtN(FU.smax / RU.smax, 0) + '× lower', size: 84 });
    verdict(t, 6.5, 1300, 880, { from: Math.round(FC.smax), to: Math.round(RC.smax), unit: 'MPa', dec: 0, label: 'Under a fingertip', who: ['Flat strip', 'Arch'], rivalCol: 'grey', net: fmtN(FC.smax / RC.smax, 1) + '× lower', size: 84 });
    text('2D frames: the arch and flat strip of b06_arch (PP-C-20A, 60 mm, 0.55 g each), 10 N spread over the span or on a 10 mm pad. Thrust line e = M / N, from the solve.', 80, 1002, { role: 'small', size: 19, color: C.faint, alpha: ep(t, 3.4, 3.9), maxW: 1760 });
  }
});
/* ============================== 6. b06_fibres: fibres along the load ============================== */
/* Checked: the node flow is 10-d2-arches.js's (shbStokes, shbFibres, shbFlowCase: a 2D creeping, Newtonian flow through a
   6-arm node of 1 mm ribs, 40 % straight on; fibres as rigid rods turned by Jeffery's equation). It is a sketch of the real
   melt (no shear thinning, no cooling, no fibre crowding), said in the method line. Krenchel's cos⁴θ is an efficiency for
   STIFFNESS (Krenchel 1964), so the verdict says stiffness. My b06_stokes reproduces shbFlowCase's 6-arm case exactly; its
   3-arm (hexagon) node gives 0.81, as straight, so this slide makes no claim that hexagon nodes tangle fibres. Choi 2024
   is carbon-filled nylon (PA6), so it is named as such. Wood: USDA Wood Handbook, Douglas-fir interior north, clear and
   green, both in kPa (107,600 along, 2,300 across): 47×. */
/** a wood bar, w × h px, its grain along (along = true) or across, pulled from both ends with force k; across, it splits
   down one grain line by gap px */
function b06_wood(x, y, w, h, along, k, gap, a) {
  if (a <= 0.003) return;
  const half = (x0, x1, off) => {
    G.save(); G.globalAlpha = a; G.translate(off, 0); rrPath(x0, y, x1 - x0, h, 5); G.fillStyle = C.comp; G.fill(); G.clip();
    G.strokeStyle = C.mute; G.lineWidth = 1.6;
    if (along) for (let j = 1; j < 7; j++) { const yy = y + h * j / 7; G.beginPath(); for (let i = 0; i <= 40; i++) { const xx = x0 + (x1 - x0) * i / 40; const v = yy + 2.2 * Math.sin(xx * 0.035 + j * 1.7); i ? G.lineTo(xx, v) : G.moveTo(xx, v); } G.stroke(); }
    else for (let j = 1; j < 16; j++) { const xx = x + w * j / 16; if (xx < x0 || xx > x1) continue; G.beginPath(); for (let i = 0; i <= 20; i++) { const yy = y + h * i / 20, v = xx + 2.2 * Math.sin(yy * 0.08 + j * 1.3); i ? G.lineTo(v, yy) : G.moveTo(v, yy); } G.stroke(); }
    G.restore();
  };
  if (along || gap <= 0.3) half(x, x + w, 0);
  else { const xm = x + w * 8 / 16; half(x, xm, -gap / 2); half(xm, x + w, gap / 2); line(xm - gap / 2, y, xm - gap / 2, y + h, { color: C.red, w: 2.5, alpha: a }); line(xm + gap / 2, y, xm + gap / 2, y + h, { color: C.red, w: 2.5, alpha: a }); }
  if (k > 0.003) { const off = along || gap <= 0.3 ? 0 : gap / 2; arrow(x - off - 6, y + h / 2, x - off - 6 - 46 * k, y + h / 2, { color: C.ink, w: 3, hs: 11, alpha: a }); arrow(x + w + off + 6, y + h / 2, x + w + off + 6 + 46 * k, y + h / 2, { color: C.ink, w: 3, hs: 11, alpha: a }); }
}
/** 10-d2-arches.js's shbFlowDraw, copied (b06 prefix) with two changes: true-grey tokens for the steel and the melt, and
   the fibres dimmed inside the node's core (r < 0.9 mm), so the arms, where a fibre's angle decides the rib's stiffness,
   carry the picture; red when a fibre lies more than about 30° off the flow */
function b06_flowDraw(t, FC, cx, cy, s, ft, a) {
  if (a <= 0.003) return;
  const F = FC.F, P = p => [cx + p[0] * s, cy - p[1] * s], R = (F.Lr - 0.2) * s, angs = [0, 1, 2, 3, 4, 5].map(k => k * Math.PI / 3);
  G.save(); G.beginPath(); G.arc(cx, cy, R, 0, TAU); G.clip();
  G.globalAlpha = a; G.fillStyle = C.track; G.fillRect(cx - R, cy - R, R * 2, R * 2);
  G.strokeStyle = C.line; G.lineWidth = 1.5; G.beginPath();
  for (let d = -2 * R; d < 2 * R; d += 14) { G.moveTo(cx + d, cy - R); G.lineTo(cx + d + R * 2, cy + R); } G.stroke();
  shbFill(shbNodeOutline(angs, F.W, F.Lr + 0.5, F.r), P, C.bg, a);
  FC.lines.forEach(pts => shbPath(pts.map(P), C.mute, 1.2, a * 0.35));
  const Lc = 16, flen = 0.17;
  FC.fb.forEach((f, i) => {
    const ph = ((i * 0.6180339887) % 1) * Lc, u = ((ft - ph) % Lc + Lc) % Lc, q = Math.floor(u / 0.04); if (ft < ph || q >= f.smp.length) return;
    const [x, y, an] = f.smp[q], ux = F.at(F.u, x, y), uy = F.at(F.v, x, y);
    let d = Math.abs(((an - Math.atan2(uy, ux)) % Math.PI + Math.PI) % Math.PI); d = Math.min(d, Math.PI - d) * 180 / Math.PI;
    const p = P([x, y]), dx = Math.cos(an) * flen * s, dy = -Math.sin(an) * flen * s, core = Math.hypot(x, y) < 0.9 ? 0.3 : 1;
    const fa = a * core * Math.min(1, (f.smp.length - q) / 8, q / 4 + 0.2);
    G.globalAlpha = fa; G.strokeStyle = mix(C.ink2, C.red, clamp((d - 20) / 15)); G.lineWidth = 2.6; G.lineCap = 'round';
    G.beginPath(); G.moveTo(p[0] - dx, p[1] - dy); G.lineTo(p[0] + dx, p[1] + dy); G.stroke();
  });
  G.restore();
  circle(cx, cy, R, { color: C.hair, w: 1.5, alpha: a });
}
S({
  id: 'b06_fibres', ch: 'shell', theme: 'night', title: 'Fibres along the load', settle: 12, ideas: [53, 75],
  replaces: ['shbFibres', 'shbFlow'], src: ['b06Wood', 'shbChoi', 'shbMerseburg', 'shbKrenchel', 'shbJeffery', 'shbMoldflow', 'srf_ppc20', 'shbModel'],
  answers: [
    ['shbFibres: "hard to understand"', 'It starts from something everyone has seen: wood splits along its grain. Pulled across, a Douglas-fir bar parts at 2.3 MPa; along, it takes 107.6 (47×). Then: carbon PP has a grain too, and the node is where that grain has to turn.'],
    ['shbFibres: "need real world examples"', 'Wood (USDA Wood Handbook figures), and PP-C-20A\'s own datasheet: it shrinks 0.1 % along the flow and 0.4 % across, because its fibres line up with the flow.'],
    ['shbFibres: "it\'s just unintuitive for a social media brain"', 'You watch the fibres: they ride through the node and turn red as they swing across a rib. Sharp, more of them go red; filleted, fewer.'],
    ['shbFlow (merged)', 'The melt flow through the node is this slide\'s right half: sharp against filleted, the same flow, the same fibres.'],
    ['F2.17 "specific research on how high the potential strength increases are"', 'Wood 47× (USDA); carbon-filled nylon 1.7× along the flow than across (Choi 2024, 130.3 against 77.2 MPa); PP or glass parts "a factor of 2" in strength and up to 3 in stiffness (Merseburg); Krenchel\'s cos⁴θ for stiffness.'],
    ['F2.18 "a fluid simulation"', 'A 2D flow solve through the node (Stokes) with each fibre turned by Jeffery\'s equation, run twice: sharp corners and 0.6 mm fillets.']
  ],
  draw: t => {
    header(t, 'Fibres along the load');
    const S0 = shbFlowCase(0), S6 = shbFlowCase(0.6), gain = S6.turn / S0.turn - 1;
    captions(t, [[0.4, 'Wood splits along its grain. Pulled across, Douglas-fir parts at 2.3 MPa; along, it takes 107.6. The fibres carry the load.'],
      [2.6, 'Carbon PP has a grain too: its fibres line up with the melt as it flows, and the part is stiffest along them.'],
      [4.6, 'At a node the melt turns. A sharp corner swings the turning fibres across the rib; a fillet steers them round.'],
      [7.6, 'Filleted, ' + Math.round(S6.turnW * 100) + '% of the turning fibres leave in line with their rib, against ' + Math.round(S0.turnW * 100) + '% sharp.']]);
    /* the real world, left: two wood bars pulled, one with the grain, one across it */
    const inner = demoPanel(t, -2, [80, 280, 540, 640], { label: 'The real world', src: 'USDA Wood Handbook' });
    const kp = ep(t, 0.3, 1.1, E.io3), split = 26 * ep(t, 1.1, 1.4, E.out3), bw = inner[2] - 130, bx = inner[0] + 65;
    text('Along the grain', inner[0] + 4, inner[1] + 30, { role: 'label', size: 20, color: C.mute });
    b06_wood(bx, inner[1] + 50, bw, 64, true, kp, 0, 1);
    if (t > 1.2) callout(t, 1.2, [bx + bw * 0.7, inner[1] + 82], 'Holds to 107.6 MPa', { to: [bx + bw * 0.7 + 20, inner[1] + 160], side: 'r', color: C.ink2, tcolor: C.ink });
    text('Across the grain', inner[0] + 4, inner[1] + 250, { role: 'label', size: 20, color: C.mute });
    b06_wood(bx, inner[1] + 270, bw, 64, false, kp, split, 1);
    if (t > 1.2) faultTag(t, 1.2, [bx + bw / 2, inner[1] + 334], 'Splits at 2.3 MPa', { to: [bx + bw / 2 + 60, inner[1] + 400], side: 'r' });
    text('Douglas-fir: 47× stronger along its grain', inner[0] + inner[2] / 2, inner[1] + 480, { role: 'small', size: 22, weight: 650, color: C.ink2, align: 'center', alpha: ep(t, 1.6, 2.0) });
    text('Carbon-filled nylon: 1.7× along the flow (Choi 2024)', inner[0] + inner[2] / 2, inner[1] + 516, { role: 'small', size: 20, weight: 600, color: C.mute, align: 'center', alpha: ep(t, 2.8, 3.2) });
    /* the node, right: the same melt through a sharp node and a filleted one; fibres ink along the flow, red across */
    const ft = Math.max(0, (t - 2.6) * 2.2), aF = 1, sN = 46, cy = 560;
    b06_flowDraw(t, S0, 990, cy, sN, ft, aF);
    b06_flowDraw(t, S6, 1530, cy, sN, ft, aF);
    text('Sharp corners', 990, 330, { role: 'label', size: 22, color: C.mute, align: 'center' });
    text('Filleted, 0.6 mm: Theseus', 1530, 330, { role: 'label', size: 22, color: C.heroText, align: 'center' });
    text('Melt in →', 990 - (S0.F.Lr - 0.2) * sN + 6, cy - 22, { role: 'small', size: 19, weight: 650, color: C.ink2, alpha: ep(t, 2.4, 2.8) });
    legend(t, 2.8, 760, 776, [{ kind: 'line', color: C.ink2, label: 'Fibre along the flow' }, { kind: 'line', color: C.red, label: 'Fibre turned across it' }], { size: 19, gap: 26 });
    /* the verdict: how much of their stiffness the turning fibres keep (Krenchel), sharp against filleted */
    verdict(t, 6.4, 760, 884, { from: Math.round(S0.turnW * 100), to: Math.round(S6.turnW * 100), unit: '%', dec: 0, label: 'Turning fibres within 30° of their rib', better: 'higher', who: ['Sharp', 'Filleted'], rivalCol: 'grey', net: '+' + Math.round(gain * 100) + ' % stiffness (Krenchel)', size: 72 });
    text('2D flow solve (Stokes) through a 6-arm node of 1 mm ribs, fibres turned by Jeffery\'s equation; stiffness kept by Krenchel\'s cos⁴θ. A sketch of the melt.', 80, 1012, { role: 'small', size: 19, color: C.faint, alpha: ep(t, 2.6, 3.1), maxW: 1760 });
  }
});
/* ============================== 7. b06_fillet: why corners get fillets ============================== */
/* The Comet: my plane-stress FE (work/b06/tools/comet_fe.js; bilinear quads on an O-grid quarter model, checked against
   Kirsch's plate with a hole: 3.05 and 2.53 in a big panel against 3 and 2.5). A skin panel 300 mm square, cabin pressure
   as biaxial tension (hoop, vertical, 1; axial 0.5), an illustrative squarish 100 × 110 mm window with 6 mm corners (the
   Comet 1's real size and radius are a research gap) against a 100 × 140 mm oval. The max principal stress at every node,
   over the hoop stress, stored as sqrt(s / smax) in bytes. The node: the deck's fillet study (09-fillet-data.js, FILLET:
   plane stress on a triangle lattice of 1.2 mm struts, the same mass at every radius, peak von Mises over the panel's
   average; 'near-sharp' is r 0.05 mm, as a sharp corner's peak has no finite value). */
const B06_COMET = { NA: 128, NR: 64, HALF: 150, A: 50, B: 42.17, RC: 18.07, Bov: 86, smax: 3.9696, sqPeak: 3.9696, ovPeak: 1.9963,
  sq: 'tbW1tba2tra2tre3t7i4ubm6uru8vL2+v8DCw8XGyMrN0NTZ4Onw9Pj6/P7////+/fz6+PXy7+vn49/a1c/KxL63saqjm5SMhHxza2JYT0Q7MikgFQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC1tbW1tra2tra3t7e3uLi5ubq6u7y8vb6/wMLDxcbIys3Q1Nng6e/0+Pr8/v7///79+/r39fLv6+fj3trVz8rEvrexqqOclIyEfHRrYllPRTsyKSAWCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALW1tba2tra2tre3t7e4uLm5urq7vL29vr/BwsPFxsjLzdDU2eHp7/T3+vz9/v7+/fz7+ff08e7q5uLe2dTPycO9t7Gqo5yUjIV8dGtjWVBGPDMrIhgMAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtbW2tra2tra2t7e3uLi4ubm6u7u8vb6+wMHCw8XHycvO0dXa4eju8/b5+vz8/fz8+/n39fPw7enl4d3Y087Iw723sKqjnJSNhX11bWRbUUg+Ni0lHBEHAwIBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC2tra2tra2tra3t7e4uLi5ubq7u7y9vr/AwcLExcfJy87R1dvh6O3x9ff5+vv7+/r59/Xz8e7r5+Pf29fSzcfCvLawqaOclY6GfnZuZl1US0I5MSkhFw4IBQQDAgICAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALa2tra2tra2t7e3t7i4ubm6uru8vL2+v8DBw8TGx8rMz9LW2+Hn7PDz9ff4+Pj49/b18/Hu6+jl4d3Z1dDLxsG7ta+po5yVjoeAeHBoYFdORj02LiYeFg8KCAYFBAQDAwMCAgICAgEBAQEBAQEBAQEAAAAAAAAAAAAAAAAAAAAAtra2tra2tre3t7e4uLi5ubq6u7y9vb6/wMLDxMbIys3P09fc4ebq7vDy9PX19fX08/Hw7evo5eLe29fSzsnEv7q1r6mjnZaQiYJ6c2tjW1NKQjs0LSYeFxINCggHBgUFBAQEAwMDAwICAgICAgICAQEBAQEBAQEBAQEBAQEBAQG2tra2tra3t7e3uLi4ubm6uru7vL2+v8DBwsTFx8nLzdDU2Nzg5ejr7u/x8fLy8fDv7uzq5+Xi39vY1NDLx8K+ubSuqaOdl5GKhH12bmdfWFBIQTozLSYgGhURDgsKCAcHBgYFBQQEBAQDAwMDAwMCAgICAgICAgICAgICAgICAra2tra3t7e3t7i4uLm5ubq7u7y9vb6/wMHDxMbHyczO0dTY3ODj5unr7O3u7u7t7Ovp6Obj4d7b2NTRzcnFwLy4s66ppJ6YkoyGgHlya2RdVU5HQTo0LigjHRkUEQ8NCwoJCAcHBgYFBQUFBAQEBAMDAwMDAwMDAwMCAgICAgICt7e3t7e3t7e4uLi4ubm6uru7vL2+v8DBwsPFxsjKzM/S1djb3+Hk5ujp6erq6eno5+Xj4d/d2tfU0c3KxsK+urayramkn5qUj4mDfXZwaWJbVU5IQjw2MSsmIR0ZFRIQDg0LCgoJCAgHBwYGBgUFBQUEBAQEBAQEAwMDAwMDAwO3t7e3t7e3uLi4uLm5urq7u7y9vb6/wMHCxMXHycvNz9LV2Nvd3+Hj5OXl5eXl5OPi4N/d2tjW09DNysfEwL25tbGtqaSgm5aRjIaAe3RuaGFbVU9JQz44My8qJSEdGhcUEhAODQwLCgkJCAgHBwcGBgYFBQUFBQUEBAQEBAQEBLe3t7e3t7i4uLi5ubq6uru8vL2+v8DBwsPExsfJy83Q0tXX2dvd3uDg4eHh4eDf3t3b2tjW1NHPzMrHxMG+u7e0sK2ppaGdmJOOiYR/eXNtZ2FbVlBLRUA7NzIuKiYiHhsYFhQSEA8ODQwLCgoJCQgIBwcHBgYGBgYFBQUFBQUFt7e3uLi4uLi4ubm5urq7u7y9vb6/wMHCxMXGyMrMztDS1NbY2drb3N3d3d3c29rZ2NfV09HPzcvJxsTBvry5trOwrammop6alpGNiIN+eHNtaGJdV1JNSEM/OjYyLionIyAdGhgWFBIRDw4NDAwLCgoJCQgICAcHBwcHBgYGBga4uLi4uLi4ubm5ubq6u7u8vL2+v8DBwsPExcfIyszOz9HT1dbX2NjZ2dnY2NfX1tTT0tDPzcvJx8XDwb68ube0sq+sqaajn5yYlJCLh4J9eHNuaGNeWVRPS0ZCPjo2Mi8rKCUiHxwaGBYUExEQDw4NDAwLCgoKCQkICAgICAgICLi4uLi4uLm5ubm6uru7vLy9vb6/wMHCw8TGx8jKzM3P0NLT1NTV1dXV1NTT09LR0M7NzMrJx8XDwsC+vLm3tbOxrqypp6SgnZqWko6KhoJ9eHNuaWVgW1ZSTklFQj46NzMwLSonJCEfHBoYFxUTEhEQDw4NDAwLCwoKCgkJCQkJuLi4uLi5ubm5urq6u7u8vL2+vr/AwcLDxMbHyMrLzM7P0NDR0dHR0dHQ0M/OzczLysnHxsXDwcC+vbu5t7WzsbCuq6mnpKKfnJiVkY6KhoF9eXRva2ZiXVlVUU1JRUI+Ozg0MS4sKSYkIR8dGxkXFhQTEhAPDw4NDAwLCwsLCwq4uLi5ubm5ubq6uru7vLy9vb6/v8DBwsPExsfIycrLzM3Ozs7Ozs7NzczLy8rJyMfGxMPCwb++vbu6uLe1s7Kwrq2rqaeloqCdmpeUkY2JhoF9eXVwbGhkX1tXVFBMSUVCPzw5NjMwLispJiQiHx0bGhgWFRMSERAPDg4NDQwMDLm5ubm5ubm5urq6u7u8vL29vr/AwMHCw8TFxsfIycrKy8vLy8vLysrJyMfGxsXEw8LBv769vLu6uLe2tLOysK+trKqpp6WjoZ6cmZaTkI2JhoJ+enZybmpmYl5aV1NQTElGQ0A9Ojg1MjAtKykmJCIgHhwaGRcWFBMSERAPDg4Oubm5ubm5ubq6urq7u7y8vb2+v7/AwcLDxMTFxsfHyMjJycnIyMfHxsXEw8PCwcC/vr28u7q5uLe2tbOysbCvrayrqqinpaOhn52bmJWTkIyJhoJ+e3dzb2toZGBdWVZTUE1KR0RBPjw5NzQyMC4rKSclIyEfHRwaGBYVFBIREBC5ubm5ubm5urq6uru7vLy9vb6/v8DBwcLDw8TFxcbGxsbGxsXExMPCwcHAv769vLu6ubm4t7a1tLOysbCvrq2sq6qpqKalo6Kgnpyal5WSj4yJhoN/fHh0cW1qZmNfXFlWU1BNSkhFQkA+Ozk3NDIwLiwqKCYkIyEfHRwaGBcWFbm5ubm5ubm6urq6u7u8vL29vr6/v8DBwcLCw8PDxMTEw8PDwsHAwL++vby7urq5uLe2trW0s7OysbCvrq6trKuqqainpqWjoqCfnZuZl5SSj4yJhoOAfHl2cm9saGViX1xZVlNQTktJRkRBPz07OTc1MzEvLSwqKCclJCIhIB8fubm5ubm5ubm6urq7u7u8vL29vr6/v8DAwMHBwcHBwcHBwMC/vr28u7u6ubi3tra1tLSzsrKxsK+vrq2trKuqqamop6alpKOioZ+enJqYlpSRj4yJhoOAfXp3dHFtamdkYV5cWVZUUU5MSkdFQ0E/PTs5NzY0MjEvLiwrKikoKCi4uLi5ubm5ubm6urq6u7u8vLy9vb6+vr+/v7+/v7+/vr69vby7urm4t7e2tbS0s7KysbCwr6+ura2srKuqqamop6empqWko6Khn56dm5mXlZORjoyJh4SBfnt4dXJvbGlmZGFeXFlWVFJPTUtJR0VDQT89PDo4NzY0MzIxMDAvL7i4uLi4uLm5ubm5urq6u7u7vLy8vL29vb29vb29vby8u7q6ubi3trW1tLOysrGwsK+vrq6trayrq6qqqamop6empqWlpKOioqGfnp2cmpiXlZORjoyJh4SCf3x5dnNxbmtoZmNhXlxZV1VSUE5MSkhGRUNBQD49PDo5ODc3NjY2uLi4uLi4uLi4ubm5ubm6urq6u7u7u7u7u7u7u7q6urm4uLe2tbSzs7KxsLCvr66traysq6urqqqpqaiop6empaWlpKSjo6KhoJ+enZybmZiWlJKQjoyJh4WCf316d3Vyb21qaGVjYF5cWVdVU1FPTUxKSEdFREJBQD8+PTw8PDy3t7e3t7e3uLi4uLi4ubm5ubm5urq6urq5ubm4uLi3tra1tLOysrGwr6+ura2srKurqqqqqamoqKenp6ampaWkpKOjo6KioaGgn56dnJuamJeVlJKQjoyJh4WCgH17eHZzcW5saWdlYmBeXFpYVlRSUE9NS0pIR0ZFRENCQkFBQba2tra3t7e3t7e3t7e4uLi4uLi4uLi4uLe3t7a2tbS0s7KxsbCvrq6trKyrq6qqqampqKinp6empqWlpaSko6OioqKioaGgoJ+fnp2cm5qZl5aVk5GPjouJh4WDgH58eXd1cnBta2lnZGJgXlxaWFdVU1FQTk1MS0lISEdGRkZGtra2tra2tra2tra2tra2tra2tra2tra2tbW0tLOzsrGwsK+ura2sq6uqqqmpqKiop6empqalpaWkpKSjo6KioqGhoaGgoKCfn56dnZybmpmYl5WUkpGPjYuJh4WDgX98enh2c3FvbWpoZmRiYF5cW1lXVlRTUVBPTk1MS0tKSkq1tbW1tbW1tbW1tbW1tbW1tbW1tbS0tLOzs7KxsbCwr66trayrq6qpqaiop6enpqampaWlpKSko6OjoqKhoaGgoKCgoJ+fn56enZ2cnJuamZiXlpWTkpCPjYuJh4WDgX99e3l2dHJwbmxqaGZkYmBeXVtaWFdVVFNSUVBPT05OTrS0tLS0tLS0tLS0tLS0tLOzs7OzsrKysbGwsK+vrq2trKurqqmpqKenp6ampaWlpKSko6OjoqKioaGhoKCgn5+fn5+fnp6enp2dnJybm5qZmJeWlZSTkZCOjYuJh4WDgX99e3l3dXNxb21raWdlZGJgX11cWllYVlVUVFNSUlJSsrKysrKysrKysrKysrKysrKxsbGwsLCvr66uraysq6qqqaiop6empqWlpKSko6OjoqKioqGhoaCgoJ+fn56enp6enp2dnZ2dnJycm5uampmYl5aVlJOSkY+OjIuJh4WDgoB+fHp4dnRycG5samlnZWRiYF9dXFtaWVhXVlZVVVWxsbGxsbGxsbGxsbGxsLCwsLCvr6+urq2trKurqqqpqKinp6alpaSkpKOjo6KioqGhoaCgoKCfn5+enp6enZ2dnJycnJycnJycm5ubmpqZmZiXl5aVlJORkI+NjIqJh4WDgoB+fHp4d3VzcW9tbGpoZ2VjYmFfXl1cW1pZWVhYWLCwsLCwsLCwr6+vr6+vr66urq2traysq6uqqamoqKempqWlpKSjo6KioqGhoaCgoKCfn5+fnp6enZ2dnZycnJubm5ubm5ubm5ubmpqamZmYmJeWlpWUk5KRj46Ni4qIh4WDgoB+fHt5d3VzcnBubWtpaGZlY2JhYF9eXVxbW1tbrq6urq6urq6urq6tra2traysq6urqqqpqainp6ampaWkpKOjoqKhoaGgoKCfn5+fnp6enp2dnZycnJybm5ubmpqampqampqampqamZmZmJiXl5aWlZSTkpGQj46Mi4mIhoWDgoB+fXt5d3Z0cnFvbWxqaWdmZWNiYWBfX15eXV2tra2tra2trKysrKysq6urqqqqqamoqKenpqalpaSjo6KioqGhoKCgn5+fnp6enp2dnZ2cnJycm5ubmpqampmZmZmZmZmZmZmZmZmZmJiYl5eXlpWVlJOSkZCPjo2MiomIhoWDgoB+fXt5eHZ0c3Fwbm1ramhnZmVkY2JhYGBgYKurq6urq6urq6uqqqqqqampqKinp6ampaWkpKOjoqKhoaCgoJ+fn56enp2dnZ2cnJycm5ubm5qampqZmZmYmJiYmJiYmJiYmJiYmJiYl5eXlpaWlZWUk5KSkZCPjoyLiomHhoSDgYB+fXt6eHZ1c3Jwb21samloZ2ZlZGNiYmJiqqqqqqqpqampqamoqKinp6empqalpaSko6OioqGhoKCfn5+enp2dnZ2cnJycm5ubm5qampqZmZmZmJiYmJeXl5eXl5eXl5eXl5eXl5eXlpaWlpWVlJSTkpKRkI+OjYyLiYiHhoSDgYB+fXt6eHd1dHJxb25sa2ppaGdmZWRkZGSoqKioqKioqKenp6empqalpaWkpKOjoqKhoaCgoJ+fnp6enZ2dnJycm5ubm5qampqZmZmZmJiYmJeXl5eWlpaWlpaWlpaWlpaWlpaWlpaWlpWVlZSUk5OSkpGQj46NjIuKiYiGhYSCgYB+fXt6eHd1dHJxcG5tbGtpaGhnZmZlZaampqampqampqWlpaWkpKSjo6KioqGhoKCfn56enp2dnZycnJubm5qampqZmZmZmJiYmJeXl5eWlpaWlZWVlZSUlZWVlZWVlZWVlZWVlZWVlZSUlJOTk5KRkZCPj46NjIuKiIeGhYSCgX9+fXt6eHd1dHNxcG9tbGtqaWhoZ2dnpaWlpaWkpKSkpKOjo6OioqKhoaCgn5+fnp6dnZ2cnJybm5uampqZmZmZmJiYmJeXl5eWlpaWlpWVlZWUlJSTk5OTlJSUlJSUlJSUlJSUlJSUlJSTk5OSkpGRkI+Pjo2Mi4qJiIeGhIOCgX9+fXt6eHd2dHNycG9ubWxramlpaGijo6Ojo6OjoqKioqGhoaGgoJ+fn56enZ2dnJycm5ubmpqamZmZmJiYmJeXl5eWlpaWlpWVlZWUlJSUk5OTk5KSkpKSk5OTk5OTk5OTk5OTk5OTk5OTkpKRkZCQj4+OjYyLi4qJh4aFhIOCgH9+fHt6eHd2dHNycG9ubWxra2pqaqGhoaGhoaGhoaCgoKCfn5+enp2dnZycnJubmpqamZmZmZiYmJeXl5eWlpaWlpWVlZWUlJSUk5OTk5KSkpKRkZGRkZGRkpKSkpKSkpOTk5OTk5KSkpKSkZGRkJCPj46NjIyLiomIh4aFhIKBgH99fHt6eHd2dHNycW9ubW1sa2troKCgoJ+fn5+fn56enp6dnZ2cnJybm5qampmZmZiYmJiXl5eXlpaWlpWVlZWUlJSUk5OTk5OSkpKSkZGRkZCQkJCQkJCRkZGRkZGRkpKSkpKSkpKSkZGRkZCQj4+Ojo2NjIuKiYiIh4WEg4KBgH99fHt5eHd2dHNycXBvbm1sbGyenp6enp6enZ2dnZ2cnJybm5uampqZmZmYmJiXl5eXlpaWlpWVlZWUlJSUk5OTk5OSkpKSkZGRkZCQkJCPj4+Pj4+Pj4+QkJCQkJGRkZGRkZGRkZGRkZCQkJCPj46OjY2Mi4qKiYiHhoWEg4KBf359fHt5eHd2dHNycXBvbm1tbZycnJycnJycnJubm5uampqamZmZmJiYl5eXlpaWlpWVlZWUlJSUk5OTk5OSkpKSkZGRkZCQkJCPj4+Pjo6Ojo2Njo6Ojo+Pj4+Pj5CQkJCQkJCQkJCQkJCPj4+Ojo6NjYyLi4qJiIeHhoWEg4GAf359fHp5eHd2dHNycXBvb25um5ubm5uampqampqZmZmZmJiYl5eXl5aWlpWVlZWUlJSUk5OTk5OSkpKSkZGRkZGQkJCQj4+Pj46Ojo6NjY2MjIyMjY2NjY6Ojo6Oj4+Pj4+Pj4+Pj4+Pj4+Pjo6OjY2MjIuLiomJiIeGhYSDgoGAf359e3p5eHd1dHNycXBwb2+ZmZmZmZmZmZiYmJiYl5eXl5aWlpWVlZWUlJSUk5OTk5OSkpKSkZGRkZGQkJCQj4+Pj46Ojo6NjY2NjIyMjIuLi4uMjIyMjY2NjY2Ojo6Ojo6Ojo+Pjo6Ojo6Ojo2NjYyMi4uKiYmIh4eGhYSDgoGAf358e3p5eHd1dHNycXFwcJiYmJeXl5eXl5eWlpaWlpWVlZWUlJSUk5OTk5KSkpKSkZGRkZCQkJCQj4+Pj4+Ojo6OjY2NjYyMjIyLi4uKioqKioqLi4uLjIyMjI2NjY2NjY2Ojo6Ojo6OjY2NjY2MjIyLi4qKiYiIh4aFhIODgoGAfn18e3p5eHd1dHNycnFxlpaWlpaWlpWVlZWVlZSUlJSTk5OTk5KSkpKRkZGRkZCQkJCQj4+Pj4+Ojo6OjY2NjYyMjIyLi4uLioqKiomJiYmJiYqKioqLi4uLi4yMjIyMjY2NjY2NjY2NjY2MjIyMi4uLioqJiIiHhoaFhIOCgYB/fn18e3p5eHd1dHNzcnKUlJSUlJSUlJSUk5OTk5OTkpKSkpGRkZGRkJCQkJCPj4+Pj46Ojo6OjY2NjY2MjIyMi4uLi4qKioqJiYmIiIiIiIiIiImJiYmKioqKi4uLi4uMjIyMjIyMjIyMjIyMjIuLi4qKiomJiIeHhoWFhIOCgYB/fn18e3p5eHd2dXRzc5OTk5OTk5OSkpKSkpKRkZGRkZGQkJCQkI+Pj4+Pjo6Ojo6OjY2NjYyMjIyMi4uLi4qKioqKiYmJiIiIiIeHh4eHh4eHiIiIiImJiYmJioqKiouLi4uLi4uLi4uLi4uLi4uKioqJiYmIiIeGhoWEg4OCgYB/fn18e3p5eHd2dXR0kZGRkZGRkZGRkZGQkJCQkJCPj4+Pj46Ojo6Ojo2NjY2NjYyMjIyMi4uLi4uKioqKiYmJiYiIiIiHh4eHhoaGhoaGhoaGh4eHh4iIiIiJiYmJiYqKioqKioqLi4uLi4qKioqKiomJiIiIh4eGhYWEg4KCgYB/fn18e3p5eHd2dXWQkJCQkJCQj4+Pj4+Pj4+Ojo6Ojo6NjY2NjY2MjIyMjIyLi4uLi4uKioqKiYmJiYmIiIiIh4eHh4aGhoaFhYWFhYWFhYWGhoaGh4eHh4eIiIiIiYmJiYmJioqKioqKioqKiomJiYmIiIiHh4aGhYSEg4KCgYB/fn18e3p5eHd3do6Ojo6Ojo6Ojo6Ojo2NjY2NjY2MjIyMjIyMi4uLi4uLioqKioqKiYmJiYmIiIiIiIeHh4eGhoaGhYWFhYSEhISEhISEhIWFhYWFhoaGhoeHh4eHiIiIiIiJiYmJiYmJiYmJiYmJiIiIiIeHhoaFhYSEg4KCgYB/fn18fHt6eXh4jY2NjY2NjYyMjIyMjIyMjIuLi4uLi4uLioqKioqKioqJiYmJiYmIiIiIiIeHh4eHhoaGhoWFhYWFhISEhIODg4ODg4OEhISEhISFhYWFhoaGhoaHh4eHh4iIiIiIiIiIiIiIiIiIiIiHh4eGhoaFhYSEg4KCgYB/f359fHt6enmLi4uLi4uLi4uLi4uLioqKioqKioqKiYmJiYmJiYmJiIiIiIiIh4eHh4eHhoaGhoaFhYWFhYSEhISDg4ODg4KCgoKCg4ODg4ODhISEhISEhYWFhYWGhoaGhoeHh4eHh4eHh4iIh4eHh4eHh4aGhoWFhISDg4KCgYCAf359fXx7e4qKioqKioqKiYmJiYmJiYmJiYmJiIiIiIiIiIiIiIeHh4eHh4eGhoaGhoaFhYWFhYWEhISEhIODg4ODgoKCgoKCgoKCgoKCgoODg4ODg4OEhISEhIWFhYWFhYaGhoaGhoeHh4eHh4eHh4eGhoaGhYWFhISEg4KCgYGAf39+fX19iIiIiIiIiIiIiIiIiIiIiIeHh4eHh4eHh4eHh4eGhoaGhoaGhoWFhYWFhYWEhISEhIODg4ODg4KCgoKCgYGBgYGBgYGBgoKCgoKCgoKCg4ODg4ODhISEhISEhYWFhYWFhYaGhoaGhoaGhoaGhoaFhYWFhISEg4OCgoGBgIB/f3+Hh4eHh4eHhoaGhoaGhoaGhoaGhoaGhoaGhoaFhYWFhYWFhYWFhYSEhISEhISDg4ODg4OCgoKCgoKBgYGBgYGBgYGBgYGBgYGBgYGBgoKCgoKCgoKDg4ODg4ODhISEhISEhYWFhYWFhYWFhYWFhYWFhYWFhISEhIODg4KCgoGBgYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYSEhISEhISEhISEhISEg4ODg4ODg4OCgoKCgoKCgYGBgYGBgYGAgICAgICAgYGBgYGBgYGBgYGBgYGBgoKCgoKCgoKCg4ODg4ODhISEhISEhISFhYWFhYWFhYWFhYWFhYSEhISEhISEg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4KCgoKCgoKCgYGBgYGBgYGAgICAgICAgICAgICAgICAgICAgYGBgYGBgYGBgYGBgYGBgYKCgoKCgoKCgoODg4ODg4SEhISEhYWFhYWFhoaGhoaGhoaGhoeCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKBgYGBgYGBgYCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBgYGBgYGBgYGBgYGBgYKCgoKCgoODg4OEhIWFhoaHh4iIiYmJioqKioCAgICAgICAgICAgICAgICAgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGBgYGBgYGCgoOEhYaHiImKi4uMjI2NjY2Of39/f39/f39/f39/f3+AgICAgICAgICAgYGBgYGBgYGBgYGBgYGBgYGAgICAgICAgICAgH9/f39/gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGCg4SGh4iJiouMjY6Oj4+Pj48=',
  ov: 'tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tLS0tLS0tLS0tLSzs7Ozs7KysrKysbGxsLCwr6+urq6trayrq6qqqaiop6alpKSjoqGgn56enZybmpqZmJiXl5eXlpa0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbS0tLS0tLS0tLS0s7Ozs7OzsrKysrKxsbGwsLCvr66urq2trKurqqqpqKinpqWkpKOioaCfnp6dnJuampmYmJeXl5eWlrS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW0tLS0tLS0tLS0tLSzs7Ozs7OysrKysbGxsbCwsK+vrq6traysq6uqqqmop6empaSko6KhoJ+enp2cm5qamZiYl5eXlpaWtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbS0tLS0tLS0tLS0tLS0s7Ozs7OzsrKysrKxsbGwsLCvr6+urq2trKyrq6qpqainp6alpKOjoqGgn56enZybmpqZmJiXl5eWlpa0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLW1tbW1tbW1tbW1tbW1tbS0tLS0tLS0tLS0tLS0tLS0s7Ozs7Ozs7KysrKysbGxsbCwsK+vrq6ura2srKuqqqmpqKempqWko6KioaCfnp2dnJuampmYmJeXl5aWlrS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSzs7Ozs7Ozs7OysrKysrGxsbGwsLCvr6+urq2trKyrq6qqqaiop6ampaSjoqGhoJ+enZycm5qZmZiYl5eXlpaWtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0s7Ozs7Ozs7Ozs7KysrKysrGxsbGxsLCwr6+vrq6tra2srKurqqmpqKenpqWkpKOioaCgn56dnJubmpmZmJiXl5aWlpa0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0s7Ozs7Ozs7Ozs7OzsrKysrKysrGxsbGxsLCwsK+vr66urq2trKyrq6qqqaiop6ampaSjo6KhoJ+fnp2cm5uamZmYl5eXlpaWlrOzs7Ozs7Ozs7Ozs7O0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0s7Ozs7Ozs7Ozs7Ozs7OzsrKysrKysrKysbGxsbGxsLCwsK+vr66urq2traysq6uqqqmpqKenpqWlpKOioaGgn56dnZybmpqZmJiXl5aWlpaWs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrKysrKysrKysbGxsbGxsbGwsLCwsK+vr6+urq6tra2srKurqqqpqainp6ampaSjo6KhoKCfnp2cnJuamZmYmJeXlpaWlpazs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7KysrKysrKysrKysbGxsbGxsbGxsLCwsLCwr6+vr66urq6tra2srKyrq6qqqamoqKempqWkpKOioaGgn56enZybm5qZmZiXl5aWlpaWlrOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7KysrKysrKysrKysrKysrKysbGxsbGxsbCwsLCwsLCwsK+vr6+vr66urq6tra2srKyrq6qqqqmpqKinpqalpaSjoqKhoJ+fnp2cnJuampmYmJeXlpaWlZWVsrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrGxsbGxsbGxsbGwsLCwsLCwr6+vr6+vr6+urq6urq2tra2srKyrq6uqqqmpqKinp6ampaWko6OioaCgn56dnZybm5qZmZiXl5aWlpWVlZWysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKxsbGxsbGxsbGxsbGxsbCwsLCwsLCvr6+vr6+vrq6urq6urq6tra2traysrKurq6uqqqmpqaiop6empqWlpKOjoqGhoJ+enp2cnJuamZmYmJeXlpaVlZWVlbKysrKysrKysbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGwsLCwsLCwsLCvr6+vr6+urq6urq6urq2tra2traysrKysq6urq6qqqqmpqaiop6enpqalpKSjo6KhoaCfn56dnZybmpqZmJiXl5aWlZWVlZWVsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsLCwsLCwsLCwsLCwsK+vr6+vr6+urq6urq6tra2tra2trKysrKysrKurq6urqqqqqqmpqaiop6enpqalpaSko6OioaGgn5+enZ2cm5uamZmYl5eWlpWVlZSUlJSxsbGxsbGxsbGxsbGxsbGxsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsK+vr6+vr6+vr6+urq6urq6tra2traysrKysrKyrq6urq6urqqqqqqqpqampqKiop6enpqalpaSko6OioqGhoJ+fnp2dnJubmpmZmJiXlpaVlZWUlJSUlLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCvr6+vr6+vr6+vr6+vrq6urq6urq6tra2traysrKysq6urq6urq6qqqqqqqqqpqampqaioqKinp6empqalpaWkpKOjoqKhoaCfn56dnZycm5qamZiYl5aWlZWVlJSUlJOTsLCwsLCwsLCwr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vrq6urq6urq6urq2tra2traysrKysrKurq6uqqqqqqqqqqampqampqaioqKiop6enp6ampqalpaSkpKOjoqKhoaCgn5+enZ2cnJuampmYmJeXlpWVlZSUlJOTk5Ovr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vrq6urq6urq6urq6urq6tra2tra2traysrKysrKurq6uqqqqqqqmpqampqaioqKioqKiop6enp6empqampaWlpaSkpKOjoqKioaGgoJ+fnp2dnJybmpqZmJiXl5aVlZWUlJOTk5OTk66urq6urq6urq6urq6urq6urq6urq6urq6urq6urq2tra2tra2tra2srKysrKysq6urq6urqqqqqqmpqamoqKioqKinp6enp6enp6empqampqWlpaWlpKSko6OjoqKioaGgoJ+fnp6dnZybm5qamZiYl5eWlpWUlJSTk5OSkpKSrq6urq6urq6urq6urq6urq2tra2tra2tra2tra2tra2trKysrKysrKyrq6urq6urqqqqqqqpqampqKioqKenp6empqampqampqampaWlpaWlpKSkpKSjo6OioqKhoaGgoJ+fnp6enZycm5uampmYmJeXlpWVlJSTk5OSkpKSkpKtra2tra2tra2tra2tra2tra2tra2trKysrKysrKysrKysrKurq6urq6uqqqqqqqqpqampqaioqKinp6empqampaWlpaWlpaWlpaSkpKSkpKSjo6Ojo6KioqGhoaGgoJ+fn56enZ2cnJubmpqZmJiXl5aVlZSUk5OTkpKSkZGRkaysrKysrKysrKysrKysrKysrKysrKysrKysq6urq6urq6urq6qqqqqqqqmpqampqaioqKinp6enpqampqWlpaSkpKSkpKSkpKSjo6Ojo6Ojo6KioqKioaGhoaCgoJ+fn56enZ2cnJubmpqZmZiYl5eWlZWUlJOTkpKSkZGRkZGRrKysrKysrKysrKysq6urq6urq6urq6urq6urq6qqqqqqqqqqqampqampqaioqKiop6enp6ampqalpaWkpKSjo6Ojo6Ojo6OjoqKioqKioqKhoaGhoaGgoKCgn5+fnp6enZ2dnJybm5qamZmYmJeWlpWVlJSTk5KSkZGRkJCQkJCrq6urq6urq6urq6urq6urq6qqqqqqqqqqqqqqqqmpqampqampqKioqKiop6enp6ampqampaWlpKSkpKOjo6KioqKioqKioaGhoaGhoaGhoaCgoKCgoJ+fn5+enp6enZ2cnJybm5qamZmZmJeXlpaVlZSUk5OSkpGRkJCQkJCPj6qqqqqqqqqqqqqqqqqqqqqqqqqqqampqampqampqaioqKioqKinp6enp6empqampaWlpaSkpKSjo6OioqKhoaGhoaGgoKCgoKCgoKCgoKCgn5+fn5+fnp6enp2dnZ2cnJybm5uampmZmJiXl5aWlZWUlJOSkpKRkZCQkI+Pj4+PqampqampqampqampqampqampqampqaioqKioqKioqKenp6enp6ampqampaWlpaWkpKSko6OjoqKioqGhoaCgoJ+fn5+fn5+fn5+fn5+fn5+enp6enp6dnZ2dnZycnJubm5qampmZmZiYl5eWlpWVlJOTkpKRkZCQkI+Pj46Ojo6pqampqampqaioqKioqKioqKioqKioqKenp6enp6enpqampqampaWlpaWkpKSkpKOjo6KioqKhoaGgoKCfn5+enp6enp6enp6enp6enp6enZ2dnZ2dnZ2cnJycm5ubm5qampmZmZiYl5eWlpWVlJSTk5KSkZGQkI+Pj46Ojo6OjqioqKioqKioqKioqKenp6enp6enp6enp6ampqampqampaWlpaWkpKSkpKOjo6OioqKioaGhoKCgoJ+fn56enp2dnZ2dnZ2dnZ2dnZ2dnZ2cnJycnJycnJubm5ubmpqampmZmZiYl5eXlpaVlZSUk5OSkpGRkJCPj46Ojo2NjY2Np6enp6enp6enp6enp6enpqampqampqampqWlpaWlpaWkpKSkpKOjo6OjoqKioqGhoaGgoKCfn5+enp6dnZ2cnJycnJycnJycnJycnJycnJubm5ubm5ubm5qampqamZmZmJiYmJeXlpaWlZWUlJOTkpKRkZCQj4+Ojo2NjY2NjIympqampqampqampqampqampaWlpaWlpaWlpaSkpKSkpKOjo6OjoqKioqKhoaGhoKCgn5+fn56enp2dnZycnJubm5ubm5ubm5ubm5ubm5ubmpqampqampqamZmZmZmZmJiYl5eXlpaWlZWUlJSTk5KSkZGQkI+Pjo6NjY2MjIyMjKWlpaWlpaWlpaWlpaWlpaWlpaSkpKSkpKSko6Ojo6OjoqKioqKhoaGhoKCgoJ+fn5+enp6dnZ2cnJybm5uampqampqampqampqampqampqamZmZmZmZmZmZmJiYmJiYl5eXlpaWlZWVlJSTk5KSkZGQkI+Pjo6NjY2MjIyLi4uLpKSkpKSkpKSkpKSkpKSkpKSkpKOjo6Ojo6OioqKioqKhoaGhoaCgoKCfn5+fnp6enZ2dnZycnJubm5qampmZmZmZmZmZmZmZmZmZmZmZmZmZmJiYmJiYmJiYmJeXl5eXlpaWlZWVlJSUk5OSkpGRkJCPj46OjY2MjIyLi4uLi4ukpKSko6Ojo6Ojo6Ojo6Ojo6OjoqKioqKioqKhoaGhoaCgoKCgn5+fn56enp6dnZ2cnJybm5ubmpqamZmZmJiYl5eXl5iYmJiYmJiYmJiYmJiYl5eXl5eXl5eXl5aWlpaWlZWVlJSUk5OTkpKRkZCQj4+Ojo2NjIyMi4uLioqKiqOjo6Ojo6OjoqKioqKioqKioqKioaGhoaGhoaCgoKCgn5+fn5+enp6enZ2dnJycnJubm5qampmZmZiYmJeXl5aWlpaWlpaXl5eXl5eXl5eXl5eXl5aWlpaWlpaWlpWVlZWVlJSUlJOTkpKSkZGQkI+Pjo6NjYyMi4uLioqKiomJoqKioqKioqKioqGhoaGhoaGhoaGgoKCgoKCgn5+fn5+enp6enp2dnZ2cnJybm5ubmpqamZmZmJiYl5eXlpaWlZWVlZWVlZWWlpaWlpaWlpaWlpaWlpaWlZWVlZWVlZWUlJSUk5OTk5KSkpGRkJCPj46OjY2MjIuLioqKiYmJiYmhoaGhoaGhoaGhoaCgoKCgoKCgoKCfn5+fn5+enp6enp2dnZ2cnJycm5ubm5qampmZmZmYmJiXl5eWlpaVlZWUlJSUlJSUlJWVlZWVlZWVlZWVlZWVlZWVlZSUlJSUlJSUk5OTk5KSkpGRkZCQj4+Ojo2NjIyLi4qKiomJiYmIiKCgoKCgoKCgoKCgoKCfn5+fn5+fn56enp6enp2dnZ2dnJycnJubm5uampqamZmZmJiYl5eXlpaWlZWVlJSUk5OTk5OTk5OTk5SUlJSUlJSUlJSUlJSUlJSUlJSUk5OTk5OTkpKSkpGRkZCQkI+Pjo6NjYyMi4uKioqJiYiIiIiIn5+fn5+fn5+fn5+fn5+enp6enp6enp2dnZ2dnZycnJybm5ubmpqampmZmZmYmJiXl5eWlpaVlZWUlJSTk5OSkpKSkpKSkpKSk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OSkpKSkpGRkZGQkJCPj46Ojo2NjIyLi4qKiYmIiIiIiIeenp6enp6enp6enp6enp6dnZ2dnZ2dnJycnJycm5ubm5qampqZmZmZmJiYmJeXl5aWlpWVlZSUlJOTk5KSkpGRkZGRkZGRkZGRkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkZGRkZGQkJCQj4+Ojo6NjYyMi4uKiomJiIiIh4eHh52dnZ2dnZ2dnZ2dnZ2dnZ2cnJycnJycm5ubm5uampqamZmZmZiYmJiXl5eXlpaWlZWVlJSUk5OTkpKSkZGQkJCQkJCQkJCQkJCRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGRkZGQkJCQj4+Pjo6OjY2MjIuLioqJiYiIiIeHh4eHnZ2dnZycnJycnJycnJycnJybm5ubm5uampqampmZmZmZmJiYmJeXl5aWlpWVlZWUlJSTk5OSkpKRkZCQkI+Pj4+Pj4+Pj4+Pj5CQkJCQkJCQkJCQkJCRkZGRkZGRkZCQkJCQkJCQj4+Pj46Ojo2NjIyLi4qKiomJiIiHh4eGhoacnJycnJycm5ubm5ubm5ubm5uampqampqZmZmZmZiYmJiXl5eXlpaWlZWVlJSUlJOTk5KSkpGRkJCQj4+Pjo6OjY6Ojo6Ojo6Ojo+Pj4+Pj4+Pj4+QkJCQkJCQkJCQkJCQkI+Pj4+Pj46Ojo6NjYyMjIuLioqJiYiIh4eHhoaGhpubm5ubm5ubm5uampqampqampmZmZmZmZiYmJiYl5eXl5aWlpaVlZWUlJSTk5OTkpKSkZGQkJCPj4+Ojo6NjYyMjI2NjY2NjY2Njo6Ojo6Ojo6Oj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pjo6Ojo6NjY2MjIyLi4qKiYmJiIiHh4aGhoaGmpqampqampqampqamZmZmZmZmZiYmJiYmJeXl5eWlpaWlZWVlZSUlJOTk5OSkpKRkZCQkI+Pj46Ojo2NjIyMi4uLi4yMjIyMjIyMjY2NjY2NjY2Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6NjY2NjIyMi4uLioqJiYiIh4eHhoaGhoaZmZmZmZmZmZmZmZmZmJiYmJiYmJeXl5eXlpaWlpaVlZWVlJSUk5OTkpKSkpGRkZCQj4+Pjo6OjY2NjIyLi4uKioqKiouLi4uLi4uMjIyMjIyMjY2NjY2NjY2NjY2Ojo6Ojo6OjY2NjY2NjYyMjIuLi4qKiomJiIiHh4aGhoaGhZiYmJiYmJiYmJiYmJiYmJeXl5eXl5aWlpaWlZWVlZSUlJSTk5OSkpKSkZGRkJCQj4+Ojo6NjY2MjIuLi4qKiomJiYmJioqKioqKiouLi4uLi4uMjIyMjIyMjI2NjY2NjY2NjY2NjY2NjIyMjIyLi4uLioqJiYiIiIeHhoaGhoWFmJiYmJiYmJeXl5eXl5eXl5aWlpaWlpWVlZWVlJSUlJOTk5KSkpKRkZGQkJCPj4+Ojo2NjYyMjIuLioqKiYmIiIiIiIiIiYmJiYmJiYqKioqKiouLi4uLi4uLjIyMjIyMjIyMjIyMjIyMjIyMi4uLi4qKiomJiIiIh4eGhoaGhYWXl5eXl5eXl5eXlpaWlpaWlpaVlZWVlZSUlJSTk5OTkpKSkpGRkZCQkI+Pj46Ojo2NjIyMi4uLioqJiYmIiIeHh4eHh4eIiIiIiIiIiYmJiYmJioqKioqKiouLi4uLi4uLi4uMjIyMi4uLi4uLi4uKioqJiYmIiIiHh4aGhoaGhZaWlpaWlpaWlpaWlpaVlZWVlZWUlJSUlJOTk5OSkpKSkZGRkJCQj4+Pjo6OjY2NjIyLi4uKioqJiYiIiIeHhoaGhoaGhoeHh4eHh4eIiIiIiIiIiYmJiYmJioqKioqKiouLi4uLi4uLi4uLi4uKioqKiomJiYiIiIeHh4aGhoaGlpaWlpaVlZWVlZWVlZWVlJSUlJSTk5OTk5KSkpKRkZGQkJCPj4+Ojo6NjY2MjIyLi4uKiomJiYiIh4eHhoaGhYWFhYWFhoaGhoaGhoeHh4eHh4eIiIiIiIiJiYmJiYmKioqKioqKioqKioqKioqKioqJiYmJiIiIh4eHhoaGhoaVlZWVlZWVlZWUlJSUlJSUlJOTk5OTkpKSkpGRkZCQkJCPj4+Ojo6NjY2MjIuLi4qKiomJiIiIh4eGhoaFhYWEhISEhIWFhYWFhYWFhoaGhoaGhoeHh4eHh4iIiIiIiImJiYmJiYmJioqKioqKioqJiYmJiYiIiIiHh4eHhoaGhpSUlJSUlJSUlJSUlJSTk5OTk5KSkpKSkZGRkZCQkI+Pj46Ojo2NjYyMjIuLi4qKiYmJiIiHh4eGhoaFhYSEhISDg4SEhISEhISEhISFhYWFhYWFhoaGhoaGh4eHh4eHiIiIiIiIiYmJiYmJiYmJiYmJiYmJiIiIiIiHh4eHh4eHlJSUlJSUlJOTk5OTk5OTkpKSkpKRkZGRkJCQj4+Pj46Ojo2NjYyMi4uLioqKiYmIiIiHh4eGhoWFhYSEhIODg4ODg4ODg4ODg4ODhISEhISEhISFhYWFhYWGhoaGhoaHh4eHh4iIiIiIiIiIiYmJiYmJiYmIiIiIiIiIh4eHh4eTk5OTk5OTk5OTk5KSkpKSkpGRkZGQkJCQj4+Pjo6OjY2NjIyMi4uLioqJiYmIiIiHh4aGhoWFhYSEhIODg4KCgoKCgoKCgoKDg4ODg4ODg4ODhISEhISEhIWFhYWFhYaGhoaGh4eHh4eIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiJOTk5OTk5OSkpKSkpKSkZGRkZGQkJCPj4+Pjo6OjY2NjIyLi4uKioqJiYiIiIeHh4aGhYWFhISEg4ODg4KCgoKBgoKCgoKCgoKCgoKCgoKCg4ODg4ODg4ODhISEhISEhYWFhYWGhoaGhoeHh4eHiIiIiIiIiIiIiYmJiYmJiYmJkpKSkpKSkpKSkpKSkZGRkZCQkJCPj4+Pjo6OjY2MjIyLi4uKiomJiYiIiIeHhoaGhYWFhISEg4ODgoKCgoGBgYGBgYGBgYGBgYGBgoKCgoKCgoKCgoKCgoODg4ODg4OEhISEhIWFhYWFhoaGhoeHh4eIiIiIiYmJiYmJiYmJiYqSkpKSkpKSkpKRkZGRkZCQkJCPj4+Pjo6OjY2MjIyLi4uKiomJiYiIh4eHhoaFhYWEhISDg4ODgoKCgoGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGCgoKCgoKCgoKCg4ODg4ODhISEhISFhYWGhoaHh4eIiIiJiYmKioqKioqLi5KSkpKSkpKRkZGRkZGQkJCQj4+Pjo6OjY2NjIyLi4uKiomJiIiIh4eGhoaFhYSEhIODg4OCgoKCgYGBgYGBgICAgICAgIGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYKCgoKCgoKCg4ODg4SEhIWFhYaGh4eIiImJioqLi4uMjIyMkpKSkpKRkZGRkZGQkJCQj4+Pjo6OjY2NjIyLi4uKiomJiIiIh4eGhoWFhYSEg4ODg4KCgoGBgYGBgYCAgICAgICAgICAgICAgICAgICAgICAgICBgYGBgYGBgYGBgYGBgYGBgYKCgoKCgoODg4SEhYaGh4iIiYqLi4yMjY2NjY2SkpKSkZGRkZGRkJCQkI+Pj46Ojo2NjIyMi4uKiomJiIiHh4eGhoWFhISEg4OCgoKCgYGBgYCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgYGBgYGBgYGBgoKCg4OEhYaHiImKi4uMjY6Ojo+Pj5KSkpKRkZGRkZGQkJCQj4+Ojo6NjYyMi4uLioqJiYiHh4aGhYWFhISDg4KCgoGBgYCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgYGBgoOEhoeIiYuMjY6Oj5CQkZGRkpKSkpGRkZGRkZCQkI+Pj46Ojo2NjIyLi4qKiYmIiIeGhoWFhISDg4OCgoGBgYCAgICAf39/f39/f3+AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBgoSFh4iKi4yNjo+QkZGRkpI=' };
function b06_holeRS(s, a, b, r) { const L1 = b - r, L2 = Math.PI * r / 2, L3 = a - r, d = s * (L1 + L2 + L3); if (d <= L1) return [a, d]; if (d <= L1 + L2) { const th = (d - L1) / r; return [a - r + r * Math.cos(th), b - r + r * Math.sin(th)]; } return [a - r - (d - L1 - L2), b]; }
function b06_elTab(a, b) { return b06_once('el:' + a + ':' + b, () => { const n = 2000, T = [0]; let P = [a, 0]; for (let i = 1; i <= n; i++) { const th = Math.PI / 2 * i / n, Q = [a * Math.cos(th), b * Math.sin(th)]; T.push(T[i - 1] + Math.hypot(Q[0] - P[0], Q[1] - P[1])); P = Q; } return T; }); }
/** a quarter ellipse by arc length (as comet_fe.js meshes it) */
function b06_holeEl(s, a, b) { const T = b06_elTab(a, b), n = 2000, d = s * T[n]; let lo = 1, hi = n; while (lo < hi) { const m = (lo + hi) >> 1; if (T[m] < d) lo = m + 1; else hi = m; } const i = Math.max(1, lo), f = (d - T[i - 1]) / ((T[i] - T[i - 1]) || 1), th = Math.PI / 2 * (i - 1 + f) / n; return [a * Math.cos(th), b * Math.sin(th)]; }
/** the field of one window as an image (once per ground): heat linear in stress, one smax (the squarish corner) for both */
function b06_cometImg(kind) {
  return b06_once('comet:' + kind + ':' + (TH ? 'p' : 'n'), () => {
    const D = B06_COMET, NA = D.NA, NR = D.NR, H = D.HALF, raw = atob(kind === 'sq' ? D.sq : D.ov);
    const hole = kind === 'sq' ? q => b06_holeRS(q, D.A, D.B, D.RC) : q => b06_holeEl(q, D.A, D.Bov);
    const outer = q => { const d = q * 2 * H; return d <= H ? [H, d] : [H - (d - H), H]; };
    const nodes = [], val = [];
    for (let j = 0; j < NR; j++) { const w = Math.pow(j / (NR - 1), 2.2); for (let i = 0; i < NA; i++) { const q = i / (NA - 1), h = hole(q), o = outer(q); nodes.push([h[0] + (o[0] - h[0]) * w, h[1] + (o[1] - h[1]) * w]); const b = raw.charCodeAt(j * NA + i) / 255; val.push(b * b); } }
    const px = 2, Wc = 2 * H * px, c = document.createElement('canvas'); c.width = Wc; c.height = Wc; const g = c.getContext('2d');
    for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      const M = k => [H * px + sx * nodes[k][0] * px, H * px - sy * nodes[k][1] * px];
      for (let j = 0; j < NR - 1; j++) for (let i = 0; i < NA - 1; i++) {
        const k = [j * NA + i, j * NA + i + 1, (j + 1) * NA + i + 1, (j + 1) * NA + i], v = (val[k[0]] + val[k[1]] + val[k[2]] + val[k[3]]) / 4, col = heatCol(v);
        g.fillStyle = col; g.strokeStyle = col; g.lineWidth = 0.7; g.beginPath(); k.forEach((q, n) => { const p = M(q); n ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }); g.closePath(); g.fill(); g.stroke();
      }
    }
    return c;
  });
}
/** the window panel at (x, y), size px square: the field (k: how much of the pressure is on), the window, pressure arrows */
function b06_cometPanel(x, y, size, kind, k, a) {
  if (a <= 0.003) return;
  const D = B06_COMET, sc = size / (2 * D.HALF), cx = x + size / 2, cy = y + size / 2;
  G.save(); G.globalAlpha = a; rrPath(x, y, size, size, 4); G.fillStyle = heatCol(0); G.fill(); G.clip();
  if (k > 0.003) { G.globalAlpha = a * k; G.drawImage(b06_cometImg(kind), x, y, size, size); }
  G.restore();
  /* the window itself */
  const pts = []; for (let q = 0; q <= 4; q++) for (let i = 0; i <= 40; i++) { const u = i / 40, quad = q % 4, hp = kind === 'sq' ? b06_holeRS(quad % 2 ? 1 - u : u, D.A, D.B, D.RC) : b06_holeEl(quad % 2 ? 1 - u : u, D.A, D.Bov), sx = quad === 0 || quad === 3 ? 1 : -1, sy = quad < 2 ? 1 : -1; if (q < 4) pts.push([cx + sx * hp[0] * sc, cy - sy * hp[1] * sc]); }
  G.save(); G.globalAlpha = a; G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.closePath(); G.fillStyle = C.bg; G.fill(); G.strokeStyle = C.ink2; G.lineWidth = 3; G.stroke(); G.restore();
  rr(x, y, size, size, 4, null, C.hair, 1.5, a);
  /* cabin pressure: the skin pulled twice as hard round the fuselage (vertical) as along it */
  if (k > 0.003) for (let i = 0; i < 4; i++) {
    const f = (i + 0.5) / 4, L = 46 * k, L2 = 26 * k;
    arrow(x + size * f, y - 6, x + size * f, y - 6 - L, { color: C.ink2, w: 2.5, hs: 9, alpha: a });
    arrow(x + size * f, y + size + 6, x + size * f, y + size + 6 + L, { color: C.ink2, w: 2.5, hs: 9, alpha: a });
    arrow(x - 6, y + size * f, x - 6 - L2, y + size * f, { color: C.ink2, w: 2.5, hs: 9, alpha: a });
    arrow(x + size + 6, y + size * f, x + size + 6 + L2, y + size * f, { color: C.ink2, w: 2.5, hs: 9, alpha: a });
  }
  return { cx, cy, sc };
}
S({
  id: 'b06_fillet', ch: 'shell', theme: 'paper', title: 'Why corners get fillets', settle: 11.5, ideas: [75, 'fillet'],
  replaces: ['fillet'], src: ['b06Rae', 'b06Comet', 'b06Model', 'filletFE', 'shlPyrofil'],
  answers: [
    ['fillet: "she\'ll study isn\'t needed to be shoes here" (read: the shell study isn\'t needed here)', 'No 3D study shell on this slide: the node is shown flat, as the fillet study\'s two stress fields, near-sharp and filleted at the same weight.'],
    ['fillet: "rest can be combined with other slides"', 'Its other claims moved: the fibres a fillet steers are b06_fibres, the mold it spares is b06_mold. This slide keeps one idea, corners gather stress and a fillet spreads it, taught first with the Comet airliner\'s windows, drawn to their real size (16.6 × 14 in, 3 in corners: ARC R&M 3248), whose corners grew the RAE test\'s first crack.']
  ],
  draw: t => {
    header(t, 'Why corners get fillets');
    const D = B06_COMET, cut = 1 - FILLET.scfM[7] / FILLET.scfM[0];
    captions(t, [[0.4, 'The Comet, the first jet airliner, had rectangular windows with rounded corners. Pressurised again and again, the skin\'s stress gathered in those corners.'],
      [2.8, 'In a test of a whole Comet cabin, the first crack grew from a window corner after 5,248 cycles. Airliners since have tall oval windows.'],
      [4.6, 'A lattice node is a corner too. Near-sharp, its peak is ' + fmtN(FILLET.scfM[0], 1) + ' times the average stress; with a fillet, at the same weight, half that.']]);
    /* left: the Comet's window, then the oval */
    const x = 170, y = 330, size = 450, kP = ep(t, 0.3, 1.2, E.io3), kOv = ep(t, 3.0, 3.6, E.io3);
    text('de Havilland Comet 1: the RAE\'s cabin test', x, y + size + 74, { role: 'label', size: 20, color: C.mute });
    if (kOv < 1) { const g = b06_cometPanel(x, y, size, 'sq', kP, 1 - kOv);
      /* the fatigue crack from a corner, as the flights count up */
      const kc = ep(t, 2.0, 2.6) * (1 - kOv);
      if (kc > 0.003) { const c0 = [g.cx + (D.A - D.RC + D.RC * 0.7071) * g.sc, g.cy - (D.B - D.RC + D.RC * 0.7071) * g.sc], L = 70 * kc, R0 = rng(5), pts = [c0];
        for (let i = 1; i <= 8; i++) { const f = i / 8; pts.push([c0[0] + L * f * 0.7071 + (R0() - 0.5) * 6, c0[1] - L * f * 0.7071 + (R0() - 0.5) * 6]); }
        shbPath(pts, C.red, 3, 1 - kOv); if (kc > 0.9) faultTag(t, 2.5, pts[8], 'Fatigue crack', { to: [pts[8][0] + 40, pts[8][1] - 40], side: 'r', alpha: 1 - kOv }); } }
    if (kOv > 0.003) b06_cometPanel(x, y, size, 'ov', 1, kOv);
    const nF = Math.round(5248 * ep(t, 0.4, 2.5));
    rich([{ s: 'Pressure cycles', role: 'label', size: 20, color: C.mute }, { s: nF.toLocaleString('en-US'), role: 'num', size: 30, weight: 800, color: C.ink, gap: 12, tnum: true }], x, y + size + 116, { alpha: 1 - kOv });
    text(kOv < 0.5 ? 'Its window, 16.6 × 14 in, 3 in corners: ' + fmtN(D.sqPeak, 1) + '× the skin\'s stress' : 'A tall oval, the same width and pressure: ' + fmtN(D.ovPeak, 1) + '×', x, y + size + (kOv < 0.5 ? 156 : 116), { role: 'small', size: 23, weight: 650, color: C.ink2, alpha: kOv < 0.5 ? ep(t, 1.2, 1.6) : ep(t, 3.4, 3.8) });
    /* right: the same at a lattice node, the fillet study's two fields at the same weight */
    locator(t, 4.2, 694, 300, 84, 'top', [-8, 12, 16, 16]);
    shlFilletFrame(t, 4.4, 0, 820, 300, 470, 400, 'Near-sharp, r 0.05 mm', { bad: true });
    shlFilletFrame(t, 5.0, 7, 1330, 300, 470, 400, 'Filleted, r 0.75 mm');
    shlRamp(t, 5.0, 1600, 740, 200, 'Peak', 'Node colour: squared', SHL_GAMMA);
    verdict(t, 6.0, 820, 850, { from: fmtN(FILLET.scfM[0], 1), to: fmtN(FILLET.scfM[7], 1), unit: '×', dec: 1, label: 'Peak experienced stress at a node', better: 'lower', who: ['Near-sharp', 'Filleted'], rivalCol: 'grey', net: '−' + Math.round(cut * 100) + ' %, the same weight', size: 100 });
    text('2D plane-stress FE. Comet: its 16.6 × 14 in window (RAE) against a tall oval, pressure 2:1, colour linear, red at 4.0×. Node: the fillet study, the same mass.', 80, 1002, { role: 'small', size: 19, color: C.faint, alpha: ep(t, 1.0, 1.5), maxW: 1760 });
  }
});
/* ============================== 8. b06_filletsize: fillet size, solved at equal mass ============================== */
/* The old 'filletsize' (Brock 10/10, no note): its content and simulation kept (the fillet study, FILLET, 09-fillet-data.js:
   plane stress, 1.2 mm struts, the same mass at every radius; checked: 'near-sharp' is r 0.05 mm, the struts thin from 1.199
   to 1.045 mm at 0.75 and under PP's 0.89 mm floor past about 1.05). The motion raised: the radius sweeps once from 0.05 to
   1.2 mm, the curve drawing itself as it goes and the strut width turning red past 1.05; then the pointer drags it back to
   the pick. No loop (M2). On from frame one. */
/** the radius on screen: near-sharp at t = 0, one sweep to 1.2 mm, then dragged back to the pick (0.75 mm) and held */
function b06_filR(t) { return t < 0.6 ? 0.05 : t < 4.5 ? lerp(0.05, 1.2, ep(t, 0.6, 3.9, E.io3)) : lerp(1.2, 0.75, ep(t, 4.5, 6.0, E.io3)); }
/** the largest radius reached so far (the curve is drawn up to it) */
function b06_filMax(t) { return t < 4.5 ? b06_filR(t) : 1.2; }
S({
  id: 'b06_filletsize', ch: 'shell', theme: 'night', title: 'Fillet size, solved at equal mass', settle: 11, ideas: [75, 'fillet'],
  replaces: ['filletsize'], src: ['filletFE', 'shlEnvalior', 'beall106', 'protoWall', 'doutre23', 'shlLattice'],
  answers: [
    ['filletsize (10/10, no note): keep it', 'Kept: the same study, the same stress fields, readouts and curve, the same pick (0.6 to 0.75 mm) and Envalior\'s rule. Raised: one sweep from 0.05 to 1.2 mm that draws the curve as it goes, the struts going red past 1.05 mm, then the pointer dragging the radius back to the pick; no loop; everything on screen from frame one.']
  ],
  draw: t => {
    header(t, 'Fillet size, solved at equal mass');
    captions(t, [[0.6, 'Held at the same weight, a fillet trades corner stress against strut width, so the curve has a bottom.'],
      [3.0, 'Past 1.05 mm the struts drop under polypropylene\'s 0.89 mm molding floor, and the peak climbs again.'],
      [5.2, 'So the pick is 0.6 to 0.75 mm: the peak halved, at the widest struts that still fill.']]);
    const r = b06_filR(t), f = filAt(r);
    /* left: the stress field at the radius on screen, and its readout */
    { const x = LM, y = 280, w = 1000, h = 640, a0 = tileA(t, -2, 0);
      demoWindow(x, y, w, h, a0);
      text('Stress in the lattice, pulled along its struts', x + 32, y + 52, { role: 'label', size: 21, color: C.mute, alpha: a0 });
      const sc = 1.1, ix = x + 32, iy = y + 80, iw = 512 * sc, ih = 354 * sc, ka = 1;
      const I0 = shlFilletImg(f.i), I1 = shlFilletImg(f.i + 1);
      G.save(); rrPath(ix, iy, iw, ih, 4); G.clip();
      if (I0) { G.globalAlpha = ka * (1 - f.k); G.drawImage(I0, ix, iy, iw, ih); }
      if (I1 && f.k > 0.001) { G.globalAlpha = ka * f.k; G.drawImage(I1, ix, iy, iw, ih); }
      G.restore(); G.globalAlpha = 1;
      const hs = FILLET.hot[f.k < 0.5 ? f.i : f.i + 1], hx = ix + hs[0] * FILLET.px * sc, hyy = iy + hs[1] * FILLET.px * sc, kh = ka, pul = 0.5 + 0.5 * Math.sin(t * 5);
      circle(hx, hyy, 10 + 4 * pul, { color: C.ink, w: 2, alpha: kh * 0.9 });
      const k2 = ep(t, 1.2, 1.6); line(ix, iy + ih + 28, ix + FILLET.px * sc, iy + ih + 28, { color: C.ink2, w: 2, alpha: k2 }); text('1 mm', ix + 10 + FILLET.px * sc, iy + ih + 35, { role: 'label', size: 19, color: C.mute, alpha: k2 });
      shlRamp(t, 1.2, ix + iw - 220, iy + ih + 28, 220, 'Peak, red', '', SHL_GAMMA);
      text('Same weight at every radius: the struts thin as the fillets grow.', x + 32, y + h - 32, { role: 'small', size: 24, weight: 560, color: C.mute, alpha: ep(t, 1.4, 1.8) });
      /* the readout */
      const ox = ix + iw + 40, kr = 1, bw0 = x + w - 32 - ox;
      const ro = (lab, yy) => text(lab, ox, yy, { role: 'label', size: 19, color: C.mute, alpha: kr });
      ro('Fillet radius', iy + 20); text(fmtN(r, 2) + ' mm', ox, iy + 72, { font: 'disp', size: 50, weight: 800, color: C.heroText, grad: C.heroGrad, alpha: kr, tnum: true });
      ro('Strut width', iy + 124); text(fmtN(f.w, 2) + ' mm', ox, iy + 166, { font: 'disp', size: 38, weight: 800, color: f.w < 0.89 ? C.bad : C.ink, alpha: kr, tnum: true });
      ro('Peak experienced stress', iy + 218); text('(lower is better)', ox, iy + 244, { role: 'small', size: 21, weight: 600, color: C.faint, alpha: kr, sentence: false });
      shellBA(t, ox, iy + 296, { before: fmtN(FILLET.scfM[0], 1) + '×', after: fmtN(f.scf, 1) + '×', size: 44, k: clamp((FILLET.scfM[0] - f.scf) / Math.max(1e-6, FILLET.scfM[0] - FILLET.scfM[7])), a: kr, bad: C.bad, good: f.scf < 12 ? undefined : false });
      rr(ox, iy + 314, bw0, 12, 6, C.track, null, 0, kr); rr(ox, iy + 314, Math.max(12, bw0 * f.scf / 17), 12, 6, f.scf < 12 ? C.hero : heatCol(f.scf / 16.6), null, 0, kr);
      ro('Stiffness, same weight', iy + 368); const dE = (f.E / FILLET.ExM[0] - 1) * 100; text((dE >= 0 ? '+' : '') + fmtN(dE, 1) + '%', ox, iy + 410, { font: 'disp', size: 38, weight: 800, color: dE > 0.5 ? C.ink : C.mute, alpha: kr, tnum: true });
      text('vs near-sharp', ox + 140, iy + 408, { role: 'label', size: 19, color: C.faint, alpha: kr });
    }
    /* right: the sweep as a curve, and how the pick lines up with the resin maker's rule */
    { const x = LM + 1040, y = 280, w = RM - x, h = 360, a0 = tileA(t, -2, 1);
      demoWindow(x, y, w, h, a0);
      text(SHELL_PEAK_LAB, x + 32, y + 52, { role: 'label', size: 19, color: C.mute, alpha: a0 });
      pill(x + w - 32 - pillW('derived'), y + 52, 'derived', a0);
      const m = axes(t, { x: x + 96, y: y + 90, w: w - 136, h: 190, xr: [0, 1.25], yr: [5, 17], xticks: [0, 0.25, 0.5, 0.75, 1.0, 1.25], yticks: [6, 10, 14], xfmt: v => v.toFixed(2), yfmt: v => v + '×', t0: -2 });
      const R = FILLET.rs, kz = ep(t, 3.6, 4.2);
      rect(m.X(0.6), m.Y(17), m.X(0.75) - m.X(0.6), m.Y(5) - m.Y(17), { fill: C.heroSoft, alpha: ep(t, 5.6, 6.2) });
      rect(m.X(1.05), m.Y(17), m.X(1.25) - m.X(1.05), m.Y(5) - m.Y(17), { fill: rgba(C.bad, 0.12), alpha: ep(t, 3.2, 3.6) });
      text('Pick', m.X(0.675), m.Y(17) - 10, { role: 'label', size: 19, color: C.heroText, align: 'center', alpha: ep(t, 5.6, 6.2) });
      text('Too thin', m.X(1.15), m.Y(17) - 10, { role: 'label', size: 19, color: C.bad, align: 'center', alpha: ep(t, 3.2, 3.6) });
      series(m, R.map((r2, i) => [r2, FILLET.scfW[i]]), { color: C.comp, w: 2, dash: [6, 5], p: 1 });
      series(m, R.map((r2, i) => [r2, FILLET.scfM[i]]), { color: C.hero, w: 3, p: clamp((b06_filMax(t) - R[0]) / (R[R.length - 1] - R[0])) });
      R.forEach((r2, i) => { const k = r2 <= b06_filMax(t) + 1e-9 ? 1 : 0; circle(m.X(r2), m.Y(FILLET.scfM[i]), 4, { fill: C.hero, alpha: k }); });
      const kp = 1; circle(m.X(r), m.Y(f.scf), 11, { color: C.ink, w: 1.5, alpha: kp * 0.5 }); circle(m.X(r), m.Y(f.scf), 5, { fill: C.ink, alpha: kp });
      legend(t, -2, x + 32, y + h - 26, [{ kind: 'line', color: C.hero, label: 'Same weight' }, { kind: 'dash', color: C.comp, label: 'Same struts' }], { size: 19, gap: 20 });
      text('Radius, {mm}', x + w - 32, y + h - 26, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ep(t, 1.0, 1.4) });
      void kz;
      /* the pointer: drags the radius back from the far end to the pick */
      cursorAt(t, [[4.0, [m.X(1.2) + 60, m.Y(9) + 50]], [4.5, [m.X(1.2) + 3, m.Y(FILLET.scfM[10]) + 3]], [6.0, [m.X(0.75) + 3, m.Y(FILLET.scfM[7]) + 3]], [7.0, [m.X(0.75) + 3, m.Y(FILLET.scfM[7]) + 3]]], [4.55], { a: ep(t, 3.9, 4.2) * (1 - ep(t, 6.6, 7.0)), grab: t > 4.5 && t < 6.1 });
    }
    sourceBox(t, 5.6, LM + 1040, 680, RM - LM - 1040, 'Envalior', 'Inside radius 25 to 60% of the wall, the upper end for parts that carry load. Mine: 0.6 mm on the 1.0 mm top ribs, 0.75 mm on the 1.2 mm low ribs, 60% of each.', { size: 24 });
  }
});

/* ============================== 9. b06_mold: what a fillet buys the mold ============================== */
/* Checked: the mold method is undecided (F13.2), so both are drawn honestly. A sharp inside corner of the part is a sharp
   CONVEX tip of steel in a milled core (millable, but a knife edge: RapidDirect, it degrades faster); in an EDM electrode
   (the ribs' positive) it is a CONCAVE corner, which no round cutter can make sharper than its own radius (Protolabs). The
   tolerance is the fillet study's (FILLET.scfM against FILLET.rs, the same mass): the radius band that keeps the node's
   peak within 5 % of its value; filleted, the band is cut off where the struts would fall under PP's 0.89 mm molding floor
   (FILLET.wM). shbWidth's "one rib width" read as contradicting the graded walls (#93): this slide says "ribs taper, never
   step" (Brock's doc, line 616) instead. */
const B06_FLOOR = 0.89;
/** the radius band (mm) round r0 where the peak stays within tol of its value at r0, inside the moldable range */
function b06_tolBand(r0, tol = 0.05) {
  const R = FILLET.rs, P = FILLET.scfM, W = FILLET.wM, at = r => { let i = 0; while (i < R.length - 2 && R[i + 1] < r) i++; const f = (r - R[i]) / (R[i + 1] - R[i]); return [lerp(P[i], P[i + 1], f), lerp(W[i], W[i + 1], f)]; };
  const p0 = at(r0)[0], ok = r => { const [p, w] = at(r); return p <= p0 * (1 + tol) && w >= B06_FLOOR; };
  let lo = r0, hi = r0; const st = 0.0005;
  while (lo - st >= R[0] && ok(lo - st)) lo -= st;
  while (hi + st <= R[R.length - 1] && ok(hi + st)) hi += st;
  /* near-sharp the curve falls steeply as r grows: the band is set by how far r can grow before the peak moves tol */
  let dn = r0; while (dn + st <= R[R.length - 1] && at(dn + st)[0] >= p0 * (1 - tol)) dn += st;
  return { lo, hi, half: Math.min(r0 - lo || Infinity, hi - r0), up: dn - r0 };
}
/** the mold steel round one node, top view: the rib channels (the part) through hatched steel; r the corner radius */
function b06_moldNode(cx, cy, s, r, a) {
  if (a <= 0.003) return;
  const Lr = 2.6, R = Lr * s, angs = [0, 1, 2, 3, 4, 5].map(k => k * Math.PI / 3), P = p => [cx + p[0] * s, cy - p[1] * s];
  G.save(); G.globalAlpha = a; G.beginPath(); G.arc(cx, cy, R, 0, TAU); G.clip();
  G.fillStyle = C.comp2; G.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  G.strokeStyle = C.comp; G.lineWidth = 1.2; G.beginPath(); for (let d = -2 * R; d < 2 * R; d += 12) { G.moveTo(cx + d, cy - R); G.lineTo(cx + d + 2 * R, cy + R); } G.stroke();
  shbFill(shbNodeOutline(angs, 1.0, Lr + 0.5, r), P, C.panel, a);
  G.restore();
  circle(cx, cy, R, { color: C.hair, w: 1.5, alpha: a });
  return { P, corners: angs.map(an => { const b = an + Math.PI / 6, dQ = 0.5 / Math.sin(Math.PI / 6), dO = dQ + r / Math.sin(Math.PI / 6); return { tip: P([Math.cos(b) * dQ, Math.sin(b) * dQ]), O: P([Math.cos(b) * dO, Math.sin(b) * dO]) }; }) };
}
S({
  id: 'b06_mold', ch: 'shell', theme: 'paper', title: 'What a fillet buys the mold', settle: 12, ideas: [75, 'fillet'],
  replaces: ['shbWidth', 'shbMill', 'shbMillDirect', 'shbTol'], src: ['b06RapidDirect', 'shbProtoCorner', 'shbAutodeskEdm', 'beall106', 'filletFE', 'protoWall'],
  answers: [
    ['shbWidth: "hard to understand, feels contradictory to things we\'ve says before at a glance"', 'The old "every rib one width" read against the graded walls (#93). This slide doesn\'t say it: its fill line says ribs taper like a funnel and never step (Brock\'s own words, his doc, line 616), and the melt runs round every fillet with no dead corner.'],
    ['shbMill: "doesn\'t need its own slide"', 'Merged here as one of three beats: a milled core\'s sharp corners are knife edges of steel (red tips) that chip and wear.'],
    ['shbMillDirect: "doesnt need its own slide"', 'Merged here: an EDM electrode\'s corners are cut by a round cutter, so a 0.6 mm fillet is one Ø1.2 mm cutter and a sharp corner is impossible. The method is undecided (F13.2); the fillet pays either way, and the slide says so.'],
    ['shbTol: "unintuitive, better visualization needed, mediocre idea"', 'Now a chart of the node\'s peak against the corner radius (the fillet study, the same weight) with the band that keeps the peak within 5 %: at a 0.05 mm corner it is a sliver, ±13 µm (a fifth of a hair); at the 0.6 mm fillet, read cautiously on the curve\'s steeper side, ±0.14 mm (two hairs). One number: about 11× looser (the old slide\'s 19× was read at a flatter point).'],
    ['F2.25, F13.2 (mold method and the corners)', 'Both methods drawn and named; the claims are the ones that hold for either.']
  ],
  draw: t => {
    header(t, 'What a fillet buys the mold');
    /* read at the 0.6 mm pick, the cautious place (M 09:19), against a 0.05 mm corner (the sharpest the study solved) */
    const rP = 0.6, Bs = b06_tolBand(FILLET.rs[0]), Bf = b06_tolBand(rP), tolS = Bs.up, tolF = Math.min(rP - Bf.lo, Bf.hi - rP), loose = tolF / tolS;
    captions(t, [[0.4, 'A sharp corner in the part is a sharp edge of steel in the mold: knife edges chip and wear, and the melt stalls in the corner.'],
      [3.0, 'Round it at 0.6 mm and one Ø1.2 mm cutter fits every corner, in an EDM electrode or in milled steel, and the steel stays whole.'],
      [5.4, 'And the radius stops being critical: at a 0.05 mm corner, ' + Math.round(tolS * 1000) + ' µm moves the peak 5%; at the 0.6 mm fillet it can drift ' + fmtN(tolF, 2) + ' mm.']]);
    /* left: the steel round one node, sharp and filleted */
    const s = 62, cy = 590;
    text('Sharp corners', 290, 400, { role: 'label', size: 22, color: C.mute, align: 'center' });
    text('Filleted, 0.6 mm: Theseus', 700, 400, { role: 'label', size: 22, color: C.heroText, align: 'center' });
    const nS = b06_moldNode(290, cy, s, 0, 1), nF = b06_moldNode(700, cy, s, 0.6, 1);
    const kk = ep(t, 0.6, 1.0);
    nS.corners.forEach(c => circle(c.tip[0], c.tip[1], 5, { fill: C.red, alpha: kk }));
    if (t > 1.0) faultTag(t, 1.0, nS.corners[3].tip, 'Six knife edges of steel', { to: [250, cy + 196], side: 'r', maxW: 270 });
    const kc = ep(t, 2.8, 3.2);
    nF.corners.forEach((c, i) => circle(c.O[0], c.O[1], 0.6 * s, { color: C.hero, w: i === 4 ? 3 : 1.5, dash: i === 4 ? null : [4, 4], alpha: kc * (i === 4 ? 1 : 0.6) }));
    if (t > 3.2) fixTag(t, 3.2, [nF.corners[4].O[0], nF.corners[4].O[1] + 0.6 * s], 'One Ø1.2 mm cutter fits every corner', { to: [720, cy + 210], side: 'r', maxW: 280 });
    text('The mold steel round one node, from above', 495, cy + 268, { role: 'small', size: 20, weight: 600, color: C.mute, align: 'center' });
    text('Fill: ribs taper like a funnel, never step, and the melt runs round each fillet with no dead corner.', 80, 912, { role: 'small', size: 22, weight: 600, color: C.ink2, maxW: 820, lh: 1.3, alpha: ep(t, 4.2, 4.6) });
    /* right: the node's peak against the corner radius, and the band that keeps it within 5 % */
    const x0 = 1080, x1 = 1760, yT = 370, yB = 680, aC = ep(t, 4.4, 4.9), X = r => x0 + r / 1.2 * (x1 - x0), Y = v => yB - v / 18 * (yB - yT);
    if (aC > 0.003) {
      text('Peak experienced stress at a node, the same weight {(lower is better)}', 980, 344, { role: 'label', size: 20, color: C.mute, alpha: aC });
      for (const v of [5, 10, 15]) { line(x0, Y(v), x1, Y(v), { color: C.hair, w: 1.2, alpha: aC }); text(v + '×', x0 - 12, Y(v) + 7, { role: 'tick', size: 19, color: C.mute, align: 'right', alpha: aC }); }
      line(x0, yB, x1, yB, { color: C.faint, w: 1.5, alpha: aC });
      for (const r of [0, 0.3, 0.6, 0.9, 1.2]) text(fmtN(r, 1) + ' mm', X(r), yB + 28, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: aC });
      text('Corner radius', x1, yB + 56, { role: 'label', size: 19, color: C.ink2, align: 'right', alpha: aC });
      /* where the struts get too thin to mold (under 0.89 mm, Protolabs) */
      const rF = (() => { const W = FILLET.wM, R = FILLET.rs; for (let i = 0; i < W.length - 1; i++) if (W[i] >= B06_FLOOR && W[i + 1] < B06_FLOOR) return lerp(R[i], R[i + 1], (W[i] - B06_FLOOR) / (W[i] - W[i + 1])); return 1.2; })();
      G.save(); G.globalAlpha = aC * 0.5; G.fillStyle = C.track; G.fillRect(X(rF), yT, x1 - X(rF), yB - yT); G.restore();
      text('Shaded: struts under 0.89 mm, too thin to mold', x0, yB + 56, { role: 'small', size: 19, weight: 600, color: C.mute, alpha: aC });
      /* the two bands */
      const kb = ep(t, 5.4, 6.0);
      G.save(); G.globalAlpha = aC * kb * 0.35; G.fillStyle = C.red; G.fillRect(X(FILLET.rs[0]) - 1.5, yT, Math.max(3, X(FILLET.rs[0] + tolS) - X(FILLET.rs[0]) + 3), yB - yT); G.fillStyle = C.hero; G.fillRect(X(rP - tolF), yT, X(rP + tolF) - X(rP - tolF), yB - yT); G.restore();
      poly(FILLET.rs.map((r, i) => [X(r), Y(FILLET.scfM[i])]), { color: C.ink, w: 3, alpha: aC });
      circle(X(FILLET.rs[0]), Y(FILLET.scfM[0]), 6, { fill: C.red, alpha: aC }); circle(X(rP), Y(FILLET.scfM[6]), 6, { fill: C.hero, alpha: aC });
      if (kb > 0.5) { callout(t, 5.8, [X(FILLET.rs[0]) + 2, Y(12)], '±' + Math.round(tolS * 1000) + ' µm, a fifth of a hair', { to: [X(0.2), Y(16.2)], side: 'r', color: C.red, tcolor: C.red });
        callout(t, 6.0, [X(rP), Y(6)], '±' + fmtN(tolF, 2) + ' mm, two hairs', { to: [X(0.48), Y(2.2)], side: 'l', color: C.hero, tcolor: C.heroText }); }
    }
    verdict(t, 6.6, 1080, 872, { from: '±' + Math.round(tolS * 1000), to: '±' + Math.round(tolF * 1000), unit: 'µm', dec: 0, label: 'Radius tolerance, peak within 5%', better: 'higher', who: ['r 0.05', 'r 0.6'], rivalCol: 'grey', net: fmtN(loose, 0) + '× looser', size: 84 });
    text('Steel: RapidDirect 2025, Protolabs. Peaks: the deck\'s fillet study (plane stress, 1.2 mm struts, the same mass). The mold method is open: EDM or milled, the same fillet pays.', 80, 1002, { role: 'small', size: 19, color: C.faint, alpha: ep(t, 1.0, 1.5), maxW: 1760 });
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
  locator(t, t0, 923, B06_RY + 18, 74, 'top', [-30, 12, 60, 12]);
  text('A strip across the top, laid flat', 960, B06_RY + 206, { role: 'small', size: 19, weight: 600, color: C.mute, align: 'center', alpha: ep(t, t0 + 0.2, t0 + 0.6), maxW: 230, lh: 1.25 });
}
/** a quiet note under a drawing with a hairline up to the thing it names: p the point, (x, y) the note's first baseline */
function b06_note(p, at, s, a, col, maxW = 480) {
  if (a <= 0.003) return;
  const [x, y] = at, r = text(s, x, y, { role: 'small', size: 23, weight: 600, color: C.ink2, alpha: a, maxW, lh: 1.28 });
  const lx = Math.min(Math.max(p[0], x + 12), x + Math.min(maxW - 20, r.w)), ly = y - 26;
  poly([[p[0], p[1] + 6], [lx, ly]], { color: col, w: 1.5, alpha: a * 0.9 });
  circle(p[0], p[1], 4.5, { fill: col, alpha: a });
}
/** the middle of rib e of a solved strip, as drawn (the deflected frame): for a callout */
function b06_wallMid(r, x0, pick, k, right) {
  const m = r.model, mid = m.nodes[m.mid];
  /* the rib nearest the press, left of it, picked by rank (0 nearest) */
  const cand = m.els.map((el, e) => { const a = m.nodes[el.i], b = m.nodes[el.j], c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; return { e, c, rigid: el.rigid, d: Math.hypot(c[0] - mid[0] + (right ? -6 : 6), c[1] - mid[1]) }; }).filter(q => !q.rigid && (right ? q.c[0] > mid[0] + 1 : q.c[0] < mid[0] - 1)).sort((p, q) => p.d - q.d);
  const e = cand[Math.min(pick, cand.length - 1)].e, pts = feElPts(r, e, B06_E * k, 8), q = pts[4], yS = m.nodes[m.bl][1];
  return [x0 + q[0] * B06_S, B06_YS - (q[1] - yS) * B06_S];
}
