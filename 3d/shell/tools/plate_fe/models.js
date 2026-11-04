/* the three plates at the same mass, on the real outline: Theseus (its layout), a plain grid (same skin, edge wall, lens
   ring and bosses; a square grid of uniform 2 mm ribs inside, pitch set by the mass), a plain plate (all the mass in the
   skin). Held at the four bosses, 10 N on the lens ring. */
const { pltSolve, pltSec } = require('./fe.js');
const fs = require('fs');
const LAY = JSON.parse(fs.readFileSync(process.env.LAYOUT || '/home/claude/theseus/3d/shell/plate-layout.json'));
const RHO = 1.01e-3;
/* faces of a planar straight-line graph (bounded ones), by walking each directed edge with the next edge clockwise */
function faces(nodes, edges) {
  const adj = nodes.map(() => []);
  edges.forEach(([i, j], e) => { adj[i].push(j); adj[j].push(i); });
  adj.forEach((l, i) => l.sort((a, b) => Math.atan2(nodes[a][1] - nodes[i][1], nodes[a][0] - nodes[i][0]) - Math.atan2(nodes[b][1] - nodes[i][1], nodes[b][0] - nodes[i][0])));
  const used = new Set(), out = [];
  for (const [i0, j0] of edges) for (const [a0, b0] of [[i0, j0], [j0, i0]]) {
    if (used.has(a0 + ',' + b0)) continue;
    const f = []; let a = a0, b = b0, guard = 0;
    while (!used.has(a + ',' + b) && guard++ < 1000) { used.add(a + ',' + b); f.push(a); const l = adj[b], k = l.indexOf(a); const c = l[(k - 1 + l.length) % l.length]; a = b; b = c; }
    let ar = 0; for (let k = 0; k < f.length; k++) { const p = nodes[f[k]], q = nodes[f[(k + 1) % f.length]]; ar += p[0] * q[1] - q[0] * p[1]; }
    out.push({ f, area: ar / 2 });
  }
  return out.filter(o => o.area > 1e-6);    // CCW = bounded faces (the outer face comes out CW)
}
function tributary(nodes, edges) {
  const F = faces(nodes, edges), trib = new Map(), key = (i, j) => (i < j ? i + ',' + j : j + ',' + i);
  for (const { f, area } of F) for (let k = 0; k < f.length; k++) { const kk = key(f[k], f[(k + 1) % f.length]); trib.set(kk, (trib.get(kk) || 0) + area / f.length); }
  return { trib, key, nfaces: F.length, area: F.reduce((s, o) => s + o.area, 0) };
}
const D = LAY.dims, OUT = LAY.outline, BOSS = Object.values(LAY.bosses), RING = LAY.ring;
const inPoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
/* the front skate (plate-layout.json skates.front, F20.4), or the old pill's box before the layout has one */
const inSkate = p => (LAY.skates ? inPoly(p, LAY.skates.front) : (p[1] > 41.5 && Math.abs(p[0]) < 20.25));
const ringD = p => { const q = [p[0] - RING.c[0], p[1] - RING.c[1]], qz = Math.max(-(RING.hl - RING.hw), Math.min(RING.hl - RING.hw, q[1])); return Math.hypot(q[0], q[1] - qz) - RING.hw; };
/* build a model from nodes + members [{i, j, w, h}] with a skin ts, using the triangle (3.03) or square (Hambly) rule */
function build(nodes, mem, ts, rule, opt = {}) {
  const { trib, key } = tributary(nodes, mem.map(m => [m.i, m.j]));
  const els = mem.map(m => {
    const L = Math.hypot(nodes[m.j][0] - nodes[m.i][0], nodes[m.j][1] - nodes[m.i][1]), A = trib.get(key(m.i, m.j)) || 0;
    const bf = (opt.kappa || 1) * (rule === 'tri' ? 3.03 * A / L : 2 * A / L), Js = rule === 'tri' ? 0 : bf * ts ** 3 / 6;
    return Object.assign({ i: m.i, j: m.j, kind: m.kind, L, rib: m.h > 0, w: m.w, h: m.h }, pltSec(bf, ts, m.w, m.h, Js));
  });
  /* one support node per boss: the node nearest its centre (every model has a node there) */
  const bossN = BOSS.map(b => { let best = -1, bd = 1e9; nodes.forEach((p, i) => { const d = Math.hypot(p[0] - b[0], p[1] - b[1]); if (d < bd) { bd = d; best = i; } }); return best; });
  const ringN = []; nodes.forEach((p, i) => { if (Math.abs(ringD(p)) < (opt.ringTol || 0.3)) ringN.push(i); });
  const inBoss = e => BOSS.some(b => [e.i, e.j].some(k => Math.hypot(nodes[k][0] - b[0], nodes[k][1] - b[1]) < D.boss.r));
  const cases = {
    lens: () => { const fix = {}; bossN.forEach(i => { fix[i] = 'w'; }); const loads = {}; ringN.forEach(i => { loads[i] = [10 / ringN.length, 0, 0]; }); return { fix, loads, meas: ringN }; },
    pill: () => { const fix = {}; bossN.forEach(i => { fix[i] = 'w'; }); const pn = []; nodes.forEach((p, i) => { if (inSkate(p)) pn.push(i); }); const loads = {}; pn.forEach(i => { loads[i] = [10 / pn.length, 0, 0]; }); return { fix, loads, meas: pn }; },
    twist: () => { const fix = {}; bossN.slice(0, 3).forEach(i => { fix[i] = 'w'; }); return { fix, loads: { [bossN[3]]: [10, 0, 0] }, meas: [bossN[3]] }; },
  };
  const out = {};
  for (const c of opt.cases || ['lens']) {
    const { fix, loads, meas } = cases[c]();
    const r = pltSolve({ nodes, els, fix, loads });
    const w = meas.reduce((s, i) => s + r.d[i * 3], 0) / meas.length;
    let pk = 0; els.forEach((e, k) => { if (!inBoss(e)) pk = Math.max(pk, r.sig[k]); });
    /* P99 by mass: the stress 1 % of the material (skin strip plus rib) works above, outside the bosses */
    const sm = els.map((e, k) => [r.sig[k], e.L * (e.A || 0), inBoss(e)]).filter(q => !q[2]).sort((a, b) => b[0] - a[0]);
    const tot = sm.reduce((s, q) => s + q[1], 0); let acc = 0, p99 = sm.length ? sm[0][0] : 0; for (const q of sm) { acc += q[1]; if (acc >= 0.01 * tot) { p99 = q[0]; break; } }
    out[c] = { r, w, k: 10 / w, peak: pk, p99 };
  }
  const A = out[(opt.cases || ['lens'])[0]];
  return Object.assign({ cases: out, ringN, bossN, els, nodes }, A);
}
/* ---- Theseus: the layout's frame */
function theseus(o = {}) {
  const f = LAY.frame, nodes = f.nodes, W = D.wall, Fi = D.fine, Ri = D.ring;
  const mem = f.members.map(([i, j, kind]) => {
    const s = kind === 'fine' ? (o.fine || Fi) : kind === 'ring' ? (o.ring || Ri) : (o.wall || W);
    return { i, j, kind, w: o.noRibs ? 0 : s.w, h: o.noRibs ? 0 : s.h };
  });
  return build(nodes, mem, o.ts || D.skin, 'tri', { cases: o.cases || ['lens', 'pill', 'twist'], kappa: o.kappa });
}
module.exports = { LAY, theseus, build, tributary, inPoly, ringD, inSkate, RHO };
if (require.main === module) {
  const T = theseus(), T0 = theseus({ noRibs: true });
  console.log('Theseus: w at lens %s um, k %s N/mm, peak %s MPa; members %d', (T.w * 1000).toFixed(1), T.k.toFixed(1), T.peak.toFixed(1), T.els.length);
  console.log('skin only 0.5: w %s um, peak %s', (T0.w * 1000).toFixed(1), T0.peak.toFixed(1));
  const tp = LAY.mass / (RHO * LAY.areas.skin);
  const Tp = theseus({ noRibs: true, ts: tp });
  console.log('plain plate t=%s (mass %s g): w %s um, peak %s MPa -> Theseus %sx stiffer, peak -%s%%', tp.toFixed(3), LAY.mass, (Tp.w * 1000).toFixed(1), Tp.peak.toFixed(1), (Tp.w / T.w).toFixed(2), ((1 - T.peak / Tp.peak) * 100).toFixed(0));
}
