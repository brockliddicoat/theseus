const fs = require('fs');
process.env.LAYOUT = process.env.LAYOUT || '/home/claude/theseus/3d/shell/plate-layout.json';
const o = require('./opt.js'); const { LAY, RHO } = require('./models.js'); const { solveDesign } = require('./m2.js'); const { refMesh, tp } = require('./calib.js');
const f = LAY.frame;
/* Theseus as sized (widths in the layout), the grid as exported, the plain plate on a 2 mm DKT mesh */
const T = solveDesign(f.nodes, f.members.map(([i, j, kind, w, h]) => ({ i, j, kind, w, h })), LAY.dims.skin, ['lens']);
const g = JSON.parse(fs.readFileSync('grid8.json')), G = solveDesign(g.nodes, g.members.map(([i, j, kind, w, h]) => ({ i, j, kind, w, h, pitch: 8 })), LAY.dims.skin, ['lens']);
const rm = refMesh(2.0), Pm = solveDesign(rm.nodes, rm.mem, tp, ['lens']);
const pack = (R, ribs) => {
  const c = R.cases.lens, r = c.r, S = c.samples;
  const triS = new Float64Array(R.tris.length), ribS = new Float64Array(R.els.length);
  for (const [s, , kind, k] of S) { if (kind === 'skin') triS[k] = s; else ribS[k] = s; }
  return { nodes: R.nodes.map(p => [+p[0].toFixed(2), +p[1].toFixed(2)]), w: Array.from({ length: R.nodes.length }, (_, i) => +(r.d[i * 3] * 1000).toFixed(1)),
    tris: R.tris, triS: Array.from(triS, v => +v.toFixed(1)), ribs: R.els.map((e, k) => [e.i, e.j, +((ribs ? e.vol / (e.L * 2.3) : 0)).toFixed(2), +ribS[k].toFixed(1), e.kind === 'fine' ? 0 : 1]),
    lens: +(c.w * 1000).toFixed(0), p99: +c.p99.toFixed(1), max: +c.max.toFixed(1), bossN: R.bossN, ringN: R.ringN };
};
const out = { theseus: pack(T, true), grid: pack(G, true), plain: pack(Pm, false), fe: LAY.fe };
fs.writeFileSync('viz.json', JSON.stringify(out));
console.log('viz.json', (fs.statSync('viz.json').size / 1024).toFixed(0), 'KB; lens um', out.theseus.lens, out.grid.lens, out.plain.lens, '; max MPa', out.theseus.max, out.grid.max, out.plain.max, '; p99', out.theseus.p99, out.grid.p99, out.plain.p99);
