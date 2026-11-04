// The bottom plate FE study (plate builder, 2026-11-04). Order: node final.js (sizes Theseus, solves the grid and the plain plate,
// writes the widths into ../../plate-layout.json and grid8.json), then from 3d/: WIDTHS=<that json> NSUB=3 FIL=0.30 EDGEBAND=0.50
// WSCALE=0.82 python3 -I shell/tools/plate_layout.py, node shell/tools/plate_mesh.mjs, python3 -I shell/tools/plate_write.py;
// then node export_viz.js and node gen_deck_data.js (the data block of deck/src/10-d4-plate.js). unit.js and check7.js are
// the solver checks (beams exact; DKT within 1 % of Timoshenko); dots.js is the plate-off sensor-dot study.
/* the final design and its two rivals at 3.40 g, for the 3D mesh and the deck */
const fs = require('fs');
const o = require('./opt.js'); const { LAY, RHO } = require('./models.js'); const { solveDesign } = require('./m2.js'); const { gridModel } = require('./grid.js'); const { reference, refMesh, tp } = require('./calib.js');
const P = { ts: 0.40, wh: 2.3, fh: 2.3, w0p: 0.8, w0f: 0.4, wminp: 0.5, wmaxp: 1.4, wminf: 0.35, wmaxf: 0.7, it: 8, kp: 0.25, kt: 0 };
const R = o.design(P), f = LAY.frame;
const M0 = 3.40, As = LAY.areas.skin, bossV = 4 * Math.PI * 3.1 ** 2 / 2 * 2.3;
/* grid p = 8 */
const g1 = gridModel(8, 1, 2.3, 0.40, 0.8, 0.9), L = m => Math.hypot(g1.nodes[m.j][0] - g1.nodes[m.i][0], g1.nodes[m.j][1] - g1.nodes[m.i][1]);
const Lg = g1.mem.filter(m => m.kind === 'grid').reduce((s, m) => s + L(m), 0), Le = g1.mem.filter(m => m.kind !== 'grid').reduce((s, m) => s + L(m) * (m.kind === 'ring' ? 0.9 : 0.8), 0);
const wg = (M0 / RHO - As * 0.40 - Le * 2.3 - bossV) / (Lg * 2.3), g = gridModel(8, wg, 2.3, 0.40, 0.8, 0.9), G = solveDesign(g.nodes, g.mem, 0.40, ['lens', 'pill']);
const REF = reference(1.2);
/* plain plate stresses on a 2 mm DKT mesh for P99 */
const PL = solveDesign(refMesh(2).nodes, refMesh(2).mem, tp, ['lens', 'pill']);
const row = (nm, c, m) => ({ nm, lens_um: +(c.lens.w * 1e3).toFixed(0), pill_um: +(c.pill.w * 1e3).toFixed(0), p99: c.lens.p99 != null ? +c.lens.p99.toFixed(1) : null, max: c.lens.max != null ? +c.lens.max.toFixed(1) : null, mass: m });
console.table([row('plain plate (DKT 1.2)', REF.cases, 3.40), row('plain plate (DKT 2.0)', PL.cases, 3.40), row('grid p8 w' + wg.toFixed(2), G.cases, 3.40), row('Theseus', R.cases, +(R.vol * RHO).toFixed(2))]);
/* write the widths into the layout */
LAY.frame.members = f.members.map(([i, j, kind], e) => [i, j, kind, +R.w[e].toFixed(3), kind === 'fine' ? P.fh : P.wh]);
LAY.dims.skin = P.ts; LAY.dims.wall.h = P.wh; LAY.dims.fine.h = P.fh;
LAY.fe = { note: 'Grillage + DKT plate FE (this deck, 10-d4-plate.js solves it again in the page): PP-C-20A 13.5 GPa, nu 0.35; the skin as DKT triangles, the ribs as T-beams (flange w + 12 t); held at the four screw bosses; 10 N on the lens ring, or on the front pill. All three at 3.40 g.',
  theseus: row('Theseus', R.cases), grid: Object.assign(row('Plain grid', G.cases), { pitch: 8, w: +wg.toFixed(3), h: 2.3 }), plain: Object.assign(row('Plain plate', REF.cases), { t: +tp.toFixed(3) }) };
fs.writeFileSync('/home/claude/theseus/3d/shell/plate-layout.json', JSON.stringify(LAY));
fs.writeFileSync('grid8.json', JSON.stringify({ nodes: g.nodes.map(p => p.map(v => +v.toFixed(3))), members: g.mem.map(m => [m.i, m.j, m.kind, +m.w.toFixed(3), m.h]) }));
console.log('widths primary', Math.min(...R.w.filter((x, e) => o.prim[e])).toFixed(2), Math.max(...R.w).toFixed(2), 'fine', Math.min(...R.w.filter((x, e) => !o.prim[e])).toFixed(2), Math.max(...R.w.filter((x, e) => !o.prim[e])).toFixed(2));
