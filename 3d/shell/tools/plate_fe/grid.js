/* the plain grid: the same skin, edge wall, lens ring and bosses; inside, a square grid of uniform ribs */
const { LAY, build, inPoly, ringD, RHO } = require('./models.js');
const D = LAY.dims, R = LAY.ring;
function edgePoly(inset) {   // the outline inset (centroid-radial, adequate for a convex-ish outline at < 1 mm)
  const O = LAY.outline, c = O.reduce((s, p) => [s[0] + p[0] / O.length, s[1] + p[1] / O.length], [0, 0]);
  return O.map((p, k) => { const a = O[(k - 1 + O.length) % O.length], b = O[(k + 1) % O.length], tx = b[0] - a[0], tz = b[1] - a[1], L = Math.hypot(tx, tz); let nx = -tz / L, nz = tx / L; if ((c[0] - p[0]) * nx + (c[1] - p[1]) * nz < 0) { nx = -nx; nz = -nz; } return [p[0] + nx * inset, p[1] + nz * inset]; });
}
function gridModel(p, w, h, ts, wallW, ringW) {
  const E = edgePoly(D.wall.w / 2 + 0.02), nodes = [], key = new Map(), mem = [];
  const nid = q => { const k = Math.round(q[0] * 200) + ',' + Math.round(q[1] * 200); if (!key.has(k)) { key.set(k, nodes.length); nodes.push(q); } return key.get(k); };
  const inside = q => inPoly(q, E) && ringD(q) > 0;
  const onE = [], onR = [];
  const segs = [];
  /* grid lines: x = i p and z = j p; walk each, split at the region boundary (edge polygon, ring) */
  const lines = [];
  /* lines through the origin (GPX / GPZ shift them, for the phase study in the plate v3 notes) */
  const ox = +(process.env.GPX || 0), oz = +(process.env.GPZ || 0);
  for (let x = ox - Math.floor((30 + ox) / p) * p; x <= 30; x += p) lines.push([[x, -60], [x, 60]]);
  for (let z = oz - Math.floor((60 + oz) / p) * p; z <= 60; z += p) lines.push([[-30, z], [30, z]]);
  const xs = [], zs = []; for (let x = ox - Math.floor((30 + ox) / p) * p; x <= 30; x += p) xs.push(x); for (let z = oz - Math.floor((60 + oz) / p) * p; z <= 60; z += p) zs.push(z);
  for (const [a, b] of lines) {
    const vert = a[0] === b[0], stops = vert ? zs.map(z => [a[0], z]) : xs.map(x => [x, a[1]]);
    /* fine march to find boundary crossings between the crossing points */
    const N = 2400, pts = []; for (let k = 0; k <= N; k++) pts.push([a[0] + (b[0] - a[0]) * k / N, a[1] + (b[1] - a[1]) * k / N]);
    let run = null;
    for (let k = 0; k <= N; k++) {
      const q = pts[k], ins = inside(q);
      if (ins && !run) { run = [q]; const bd = inPoly(q, E) && ringD(pts[Math.max(0, k - 1)]) <= 0 ? 'r' : 'e'; run.b0 = bd; }
      if ((!ins || k === N) && run) { const q1 = pts[k - 1]; const bd = ringD(q) <= 0 ? 'r' : 'e'; const st = stops.filter(s => (vert ? s[1] > run[0][1] && s[1] < q1[1] : s[0] > run[0][0] && s[0] < q1[0])); const chain = [run[0], ...st, q1].map(nid); for (let m = 0; m < chain.length - 1; m++) mem.push({ i: chain[m], j: chain[m + 1], kind: 'grid', w, h, pitch: p }); (run.b0 === 'r' ? onR : onE).push(chain[0]); (bd === 'r' ? onR : onE).push(chain[chain.length - 1]); run = null; }
    }
  }
  /* bosses: a node on the edge at each boss */
  const bosses = Object.values(LAY.bosses).map(b => { let best = 0, bd = 1e9; E.forEach((q, k) => { const d = Math.hypot(q[0] - b[0], q[1] - b[1]); if (d < bd) { bd = d; best = k; } }); return nid(E[best]); });
  const bossC = Object.values(LAY.bosses).map(b => nid(b));
  /* the edge wall through every point on it, in order along the polygon */
  const par = q => { let best = 0, bd = 1e9, acc = 0, at = 0; for (let k = 0; k < E.length; k++) { const a = E[k], b = E[(k + 1) % E.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * (b[0] - a[0]) + (q[1] - a[1]) * (b[1] - a[1])) / (L * L))); const d = Math.hypot(a[0] + t * (b[0] - a[0]) - q[0], a[1] + t * (b[1] - a[1]) - q[1]); if (d < bd) { bd = d; best = acc + t * L; } acc += L; } return best; };
  const eN = [...new Set([...onE, ...bosses])].sort((u, v) => par(nodes[u]) - par(nodes[v]));
  for (let k = 0; k < eN.length; k++) mem.push({ i: eN[k], j: eN[(k + 1) % eN.length], kind: 'edge', w: wallW, h });
  /* each boss centre tied to its three nearest nodes by edge-wall struts (the boss is a solid disc) */
  bossC.forEach(c => { const near = nodes.map((q, i) => [Math.hypot(q[0] - nodes[c][0], q[1] - nodes[c][1]), i]).filter(([d, i]) => i !== c).sort((u, v) => u[0] - v[0]).slice(0, 3); near.forEach(([d, i]) => mem.push({ i: c, j: i, kind: 'edge', w: wallW, h })); });
  const ang = q => Math.atan2(q[1] - R.c[1], q[0] - R.c[0]);
  const rN0 = [...new Set(onR)].sort((u, v) => ang(nodes[u]) - ang(nodes[v]));
  /* plate v3: the lens ring follows the stadium, as Theseus's does (plate_layout.py): points between the grid lines' cut points
     so no ring member is longer than 2.5 mm (none within 0.8 mm of a cut point). It was a hexagon through the six cut points,
     whose two long chords ran about 1 mm into the lens window. GRIDRING=hex restores it (to reproduce the v2 numbers). */
  const rN = [];
  const onStad = th => { const d = [Math.cos(th), Math.sin(th)]; let lo = 0, hi = 20; for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (ringD([R.c[0] + d[0] * m, R.c[1] + d[1] * m]) < 0) lo = m; else hi = m; } return [R.c[0] + d[0] * lo, R.c[1] + d[1] * lo]; };
  for (let k = 0; k < rN0.length; k++) {
    const a = rN0[k], b = rN0[(k + 1) % rN0.length]; rN.push(a);
    if (process.env.GRIDRING === 'hex') continue;
    let t0 = ang(nodes[a]), t1 = ang(nodes[b]); if (t1 <= t0) t1 += 2 * Math.PI;
    const m = Math.ceil((t1 - t0) * R.hl / 2.5);
    for (let q = 1; q < m; q++) { const pq = onStad(t0 + (t1 - t0) * q / m); if (Math.min(Math.hypot(pq[0] - nodes[a][0], pq[1] - nodes[a][1]), Math.hypot(pq[0] - nodes[b][0], pq[1] - nodes[b][1])) < 0.8) continue; rN.push(nid(pq)); }
  }
  for (let k = 0; k < rN.length; k++) mem.push({ i: rN[k], j: rN[(k + 1) % rN.length], kind: 'ring', w: ringW, h, split: ringW > (+process.env.WCAP || 0.6) + 1e-9 ? 2 : 1 });
  return { nodes, mem: mem.filter(m => m.i !== m.j) };
}
function gridAt(M0, p, h, ts, wallW, ringW, cases = ['lens', 'pill', 'twist'], kappa = 1) {
  /* rib width from the mass: skin + ribs + bosses */
  const g0 = gridModel(p, 1, h, ts, wallW, ringW), L = (m) => Math.hypot(g0.nodes[m.j][0] - g0.nodes[m.i][0], g0.nodes[m.j][1] - g0.nodes[m.i][1]);
  const Lg = g0.mem.filter(m => m.kind === 'grid').reduce((s, m) => s + L(m), 0), Le = g0.mem.filter(m => m.kind === 'edge').reduce((s, m) => s + L(m), 0), Lr = g0.mem.filter(m => m.kind === 'ring').reduce((s, m) => s + L(m), 0);
  const Vg = M0 / RHO - LAY.areas.skin * ts - Le * wallW * h - Lr * ringW * h - 4 * Math.PI * 3.1 ** 2 / 2 * h;
  const w = Vg / (Lg * h);
  const g = gridModel(p, w, h, ts, wallW, ringW);
  const G = build(g.nodes, g.mem, ts, 'sq', { ringTol: 0.6, cases, kappa });
  const P = build(g.nodes, g.mem.map(m => Object.assign({}, m, { w: 0, h: 0 })), M0 / (RHO * LAY.areas.skin), 'sq', { ringTol: 0.6, cases, kappa });
  return { G, P, w, p, n: g.nodes.length };
}
module.exports = { gridAt, gridModel };
if (require.main === module) {
  const M0 = 3.40;
  for (const p of [6, 8, 10, 12]) { const r = gridAt(M0, p, 2.3, 0.45, 0.8, 0.9); const c = r.G.cases, q = r.P.cases;
    console.log('grid p', p, 'w', r.w.toFixed(2), '| lens', (c.lens.w * 1e3).toFixed(0), 'vs plain', (q.lens.w * 1e3).toFixed(0), '=', (q.lens.w / c.lens.w).toFixed(2), 'x, pk', c.lens.peak.toFixed(1), '/', q.lens.peak.toFixed(1), '| pill', (q.pill.w / c.pill.w).toFixed(2), 'x | twist', (q.twist.w / c.twist.w).toFixed(2), 'x'); }
}
