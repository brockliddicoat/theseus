const { pltSolve, PLT_E, PLT_G, PLT_NU } = require('./fe.js');
const { dktK, Dplate } = require('./dkt.js');
const { LAY, tributary, inPoly, ringD, RHO } = require('./models.js');
const { gridModel } = require('./grid.js');
const D = LAY.dims, BOSS = Object.values(LAY.bosses);
const fw = require('./models.js');
/* faces of the rib graph -> triangles (fan from a centroid node for anything bigger) */
function triangulate(nodes, mem) {
  const nd = nodes.map(p => p.slice()), edges = mem.map(m => [m.i, m.j]);
  const adj = nd.map(() => []); edges.forEach(([i, j]) => { adj[i].push(j); adj[j].push(i); });
  adj.forEach((l, i) => l.sort((a, b) => Math.atan2(nd[a][1] - nd[i][1], nd[a][0] - nd[i][0]) - Math.atan2(nd[b][1] - nd[i][1], nd[b][0] - nd[i][0])));
  const used = new Set(), tris = [];
  for (const [i0, j0] of edges) for (const [a0, b0] of [[i0, j0], [j0, i0]]) {
    if (used.has(a0 + ',' + b0)) continue;
    const f = []; let a = a0, b = b0, g = 0;
    while (!used.has(a + ',' + b) && g++ < 2000) { used.add(a + ',' + b); f.push(a); const l = adj[b], k = l.indexOf(a); const c = l[(k - 1 + l.length) % l.length]; a = b; b = c; }
    let ar = 0; for (let k = 0; k < f.length; k++) { const p = nd[f[k]], q = nd[f[(k + 1) % f.length]]; ar += p[0] * q[1] - q[0] * p[1]; }
    if (ar <= 1e-9 || f.length < 3) continue;
    { const c0 = [0, 0]; f.forEach(k => { c0[0] += nd[k][0] / f.length; c0[1] += nd[k][1] / f.length; }); if (ringD(c0) < 0) continue; }   /* the lens window: no skin inside the ring */
    if (f.length === 3) { tris.push(f.slice()); continue; }
    const c = [0, 0]; f.forEach(k => { c[0] += nd[k][0] / f.length; c[1] += nd[k][1] / f.length; }); nd.push(c); const ci = nd.length - 1;
    for (let k = 0; k < f.length; k++) tris.push([f[k], f[(k + 1) % f.length], ci]);
  }
  return { nodes: nd, tris };
}
function solveDesign(nodes0, mem, ts, cases = ['lens', 'pill', 'twist']) {
  const { nodes, tris } = triangulate(nodes0, mem);
  const Db = Dplate(PLT_E, PLT_NU, ts), plates = tris.map(n => ({ n, K: dktK(n.map(k => nodes[k]), Db) }));
  const { trib, key } = tributary(nodes0, mem.map(m => [m.i, m.j]));
  const els = mem.filter(m => m.h > 0).map(m => {
    const L = Math.hypot(nodes[m.j][0] - nodes[m.i][0], nodes[m.j][1] - nodes[m.i][1]), At = trib.get(key(m.i, m.j)) || 0;
    const be = m.kind === 'fine' ? Math.max(m.w, Math.min(m.w + 12 * ts, 2 * At / L)) : (m.kind === 'grid' ? Math.min(m.w + 12 * ts, m.pitch || 1e9) : m.w + 12 * ts), Af = be * ts, Aw = m.w * m.h, yc = (Af * ts / 2 + Aw * (ts + m.h / 2)) / (Af + Aw);
    const IT = be * ts ** 3 / 12 + Af * (yc - ts / 2) ** 2 + m.w * m.h ** 3 / 12 + Aw * (ts + m.h / 2 - yc) ** 2, Ir = IT - be * ts ** 3 / 12;
    return { i: m.i, j: m.j, kind: m.kind, L, EI: PLT_E * Ir, GJ: PLT_G * m.h * m.w ** 3 / 3, E: PLT_E, G: PLT_G, cy: Math.max(yc, ts + m.h - yc), tt: m.w, vol: Aw * L };
  });
  const bossN = BOSS.map(b => { let best = -1, bd = 1e9; nodes0.forEach((p, i) => { const d = Math.hypot(p[0] - b[0], p[1] - b[1]); if (d < bd) { bd = d; best = i; } }); return best; });
  const ringN = []; nodes0.forEach((p, i) => { if (Math.abs(ringD(p)) < 0.3) ringN.push(i); });
  const pillN = []; nodes0.forEach((p, i) => { if (p[1] > 41.5 && Math.abs(p[0]) < 20.25) pillN.push(i); });
  const near = (p) => BOSS.some(b => Math.hypot(p[0] - b[0], p[1] - b[1]) < D.boss.r);
  const out = {};
  for (const c of cases) {
    const fix = {}, loads = {}; let meas;
    if (c === 'twist') { bossN.slice(0, 3).forEach(i => { fix[i] = 'w'; }); loads[bossN[3]] = [10, 0, 0]; meas = [bossN[3]]; }
    else { bossN.forEach(i => { fix[i] = 'w'; }); const L = c === 'lens' ? ringN : pillN; L.forEach(i => { loads[i] = [10 / L.length, 0, 0]; }); meas = L; }
    const r = pltSolve({ nodes, els, plates, fix, loads });
    const w = meas.reduce((s, i) => s + r.d[i * 3], 0) / meas.length;
    /* stresses: ribs from the solver; skin at each triangle's centroid from its curvature (surface stress, von Mises) */
    const samples = [];
    els.forEach((e, k) => { const mid = [(nodes[e.i][0] + nodes[e.j][0]) / 2, (nodes[e.i][1] + nodes[e.j][1]) / 2]; if (!near(mid)) samples.push([r.sig[k], e.vol, 'rib', k]); });
    plates.forEach((pl, k) => {
      const P3 = pl.n.map(q => nodes[q]), mid = [(P3[0][0] + P3[1][0] + P3[2][0]) / 3, (P3[0][1] + P3[1][1] + P3[2][1]) / 3]; if (near(mid)) return;
      /* curvature from the DKT field at the centroid: reuse dktK's B via finite energy: κ ~ from a local quadratic fit of the nodal slopes */
      const g = q => [r.d[q * 3 + 1], r.d[q * 3 + 2]], [a, b, c2] = pl.n, x = P3.map(p => p[0]), z = P3.map(p => p[1]);
      const A2 = (x[1] - x[0]) * (z[2] - z[0]) - (x[2] - x[0]) * (z[1] - z[0]);
      const dLx = [(z[1] - z[2]) / A2, (z[2] - z[0]) / A2, (z[0] - z[1]) / A2], dLz = [(x[2] - x[1]) / A2, (x[0] - x[2]) / A2, (x[1] - x[0]) / A2];
      const S = [g(a), g(b), g(c2)];
      const kx = S.reduce((s, v, i) => s + v[0] * dLx[i], 0), kz = S.reduce((s, v, i) => s + v[1] * dLz[i], 0), kxz = S.reduce((s, v, i) => s + v[0] * dLz[i] + v[1] * dLx[i], 0);
      const f = PLT_E * ts / (2 * (1 - PLT_NU ** 2)), sx = f * (kx + PLT_NU * kz), sz = f * (kz + PLT_NU * kx), txz = PLT_E * ts / (4 * (1 + PLT_NU)) * kxz;
      samples.push([Math.sqrt(sx * sx - sx * sz + sz * sz + 3 * txz * txz), Math.abs(A2) / 2 * ts, 'skin', k]);
    });
    samples.sort((p, q) => q[0] - p[0]); const tot = samples.reduce((s, q) => s + q[1], 0); let acc = 0, p99 = samples[0][0];
    for (const q of samples) { acc += q[1]; if (acc >= 0.01 * tot) { p99 = q[0]; break; } }
    out[c] = { r, w, k: 10 / w, p99, max: samples[0][0], samples };
  }
  const vol = LAY.areas.skin * ts + els.reduce((s, e) => s + e.vol, 0);
  return { cases: out, nodes, tris, els, mass: vol * RHO, bossN, ringN };
}
module.exports = { solveDesign, triangulate };
