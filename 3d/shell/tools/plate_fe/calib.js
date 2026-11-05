/* the plain-plate reference: a fine equilateral mesh on the real outline (free edges, one node per boss, the lens ring
   loaded), and the skin factor that makes each design's own mesh match it */
const { LAY, build, inPoly, ringD, inSkate, RHO } = require('./models.js');
const D = LAY.dims, OUT = LAY.outline, W = LAY.window;
const inWin = p => { const q = [p[0] - W.c[0], p[1] - W.c[1]], qz = Math.max(-(W.hl - W.hw), Math.min(W.hl - W.hw, q[1])); return Math.hypot(q[0], q[1] - qz) < W.hw; };
function refMesh(a) {
  const rh = a * Math.sqrt(3) / 2, nodes = [], key = new Map(), mem = [], seen = new Set();
  const id = (x, z) => { const k = Math.round(x * 1e3) + ',' + Math.round(z * 1e3); if (!key.has(k)) { key.set(k, nodes.length); nodes.push([x, z]); } return key.get(k); };
  const ok = p => inPoly(p, OUT) && !inWin(p);
  for (let r = -Math.ceil(56 / rh); r * rh <= 56; r++) {
    const za = r * rh, zb = za + rh, off = ((r % 2) + 2) % 2 * a / 2;
    for (let x = -30 + off; x <= 30; x += a) {
      for (const tr of [[[x, za], [x + a, za], [x + a / 2, zb]], [[x + a, za], [x + 1.5 * a, zb], [x + a / 2, zb]]]) {
        if (!tr.every(ok) || !ok([(tr[0][0] + tr[1][0] + tr[2][0]) / 3, (tr[0][1] + tr[1][1] + tr[2][1]) / 3])) continue;
        const ids = tr.map(p => id(p[0], p[1]));
        for (const [u, v] of [[ids[0], ids[1]], [ids[1], ids[2]], [ids[2], ids[0]]]) { const k = u < v ? u + ',' + v : v + ',' + u; if (!seen.has(k)) { seen.add(k); mem.push({ i: u, j: v, kind: 'skin', w: 0, h: 0 }); } }
      }
    }
  }
  return { nodes, mem };
}
const M0 = +(process.env.M0 || 3.40), tp = M0 / (RHO * LAY.areas.skin);
const cases = ['lens', 'pill', 'back', 'twist'];
function reference(a = 1.5) {
  const m = refMesh(a);
  const { dktK, Dplate } = require('./dkt.js'), { pltSolve, PLT_E, PLT_NU } = require('./fe.js');
  /* DKT on the fine equilateral mesh: triangles from the mesh's faces (all triangles) */
  const { triangulate } = require('./m2.js'); const T = triangulate(m.nodes, m.mem);
  const Db = Dplate(PLT_E, PLT_NU, tp), plates = T.tris.map(n => ({ n, K: dktK(n.map(k => T.nodes[k]), Db) }));
  const BOSS = Object.values(LAY.bosses), bossN = BOSS.map(b => { let best = -1, bd = 1e9; m.nodes.forEach((p, i) => { const d = Math.hypot(p[0] - b[0], p[1] - b[1]); if (d < bd) { bd = d; best = i; } }); return best; });
  const ringN = []; m.nodes.forEach((p, i) => { if (Math.abs(ringD(p)) < a * 0.34) ringN.push(i); });
  const pillN = []; m.nodes.forEach((p, i) => { if (inSkate(p)) pillN.push(i); });
  const backN = []; m.nodes.forEach((p, i) => { if (inSkate([p[0], -p[1]])) backN.push(i); });
  const out = {};
  for (const c of cases) { const fix = {}, loads = {}; let meas; if (c === 'twist') { bossN.slice(0, 3).forEach(i => { fix[i] = 'w'; }); loads[bossN[3]] = [10, 0, 0]; meas = [bossN[3]]; } else { bossN.forEach(i => { fix[i] = 'w'; }); const L = c === 'lens' ? ringN : c === 'back' ? backN : pillN; L.forEach(i => { loads[i] = [10 / L.length, 0, 0]; }); meas = L; }
    const r = pltSolve({ nodes: T.nodes, els: [], plates, fix, loads }); out[c] = { w: meas.reduce((s, i) => s + r.d[i * 3], 0) / meas.length }; }
  return { cases: out, nodes: m.nodes, ringN };
}
module.exports = { reference, refMesh, tp, M0 };
if (require.main === module) {
  for (const a of [3, 2, 1.5, 1.2]) { const R = reference(a); console.log('ref a', a, 'nodes', R.nodes.length, 'ring nodes', R.ringN.length, Object.entries(R.cases).map(([k, c]) => k + ' ' + (c.w * 1e3).toFixed(0) + 'um pk ' + c.peak.toFixed(1)).join(' | ')); }
}
