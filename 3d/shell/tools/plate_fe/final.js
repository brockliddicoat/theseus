// The bottom plate FE study (plate builder, 2026-11-04; v2 the same day: 0.6 mm skin, twin walls, half-moon skates).
// Order (this folder is CommonJS, see package.json): from 3d/, WIDTHS=shell/plate-layout.json NSUB=3 FIL=0.30 EDGEBAND=0.50
// WSCALE=0.82 python3 -I shell/tools/plate_layout.py once (it writes the skates into the layout: the front-skate load case
// needs them); then here node final.js (sizes Theseus, solves the grid and the plain plate at Theseus's weight, writes the
// widths into ../../plate-layout.json and grid8.json; DRY=1 prints only; TS, WCAP, TWIN, CRIT, KP, IT, ETA for variants);
// then from 3d/ plate_layout.py again (same env), node shell/tools/plate_mesh.mjs, python3 -I shell/tools/plate_write.py;
// then here node export_viz.js and node gen_deck_data.js (the data block of deck/src/10-d4-plate.js). unit.js and check7.js
// are the solver checks (beams exact; DKT within 1 % of Timoshenko); dots.js is the plate-off sensor-dot study (NOWIN=0 for
// the v1 model with the window hole).
/* plate v2 (F20.3, "Thicker skin"): a 0.60 mm skin, and no rib wider than the skin (struts and fine ribs capped at 0.60 mm,
   the molding rule against sink marks on the solid outer face). The ribs keep the volume budget they had on the 0.40 mm
   skin, so the plate only gains the skin's extra weight (less, where the caps bind); the grid and the solid plate are then
   sized to the weight Theseus comes out at, so all three are compared at equal weight again. */
const fs = require('fs');
const o = require('./opt.js'); const { LAY, RHO } = require('./models.js'); const { solveDesign } = require('./m2.js'); const { gridModel } = require('./grid.js');
const TS = +(process.env.TS || 0.60), WCAP = +(process.env.WCAP || TS);
const bossV = 4 * Math.PI * 3.1 ** 2 / 2 * 2.3, As = LAY.areas.skin, f = LAY.frame;
const M0 = 3.40 + As * (TS - 0.40) * RHO;     /* the v1 rib budget (3.40 g at 0.40 mm) on the thicker skin */
const TWIN = (process.env.TWIN ?? 'ring,tie').split(',').filter(Boolean);
const P = { ts: TS, wh: 2.3, fh: 2.3, w0p: Math.min(0.8, WCAP), w0f: 0.4, wminp: 0.5, wmaxp: WCAP, wminf: 0.35, wmaxf: Math.min(0.7, WCAP), it: 8, kp: +(process.env.KP || 0.25), kt: 0, M0, twin: TWIN, crit: process.env.CRIT || 'fsd', it: +(process.env.IT || 8), eta: +(process.env.ETA || 0.5), pw: +(process.env.PW || 1) };
const R = o.design(P), M1 = +(R.vol * RHO).toFixed(3);
process.env.M0 = String(M1);
const { reference, refMesh, tp } = require('./calib.js');
/* grid p = 8, at Theseus's weight; its edge wall and lens ring capped like Theseus's */
const ringWs = LAY.frame.members.map((m, e) => [m[2], R.w[e]]).filter(q => q[0] === 'ring').map(q => q[1]);
const wE = Math.min(0.8, WCAP), wR = TWIN.includes('ring') ? ringWs.reduce((a, b) => a + b, 0) / ringWs.length : Math.min(0.9, WCAP);
const g1 = gridModel(8, 1, 2.3, TS, wE, wR), L = m => Math.hypot(g1.nodes[m.j][0] - g1.nodes[m.i][0], g1.nodes[m.j][1] - g1.nodes[m.i][1]);
const Lg = g1.mem.filter(m => m.kind === 'grid').reduce((s, m) => s + L(m), 0), Le = g1.mem.filter(m => m.kind !== 'grid').reduce((s, m) => s + L(m) * (m.kind === 'ring' ? wR : wE), 0);
const wg = (M1 / RHO - As * TS - Le * 2.3 - bossV) / (Lg * 2.3), g = gridModel(8, wg, 2.3, TS, wE, wR), G = solveDesign(g.nodes, g.mem, TS, ['lens', 'pill', 'twist']);
const REF = reference(1.2);
/* plain plate stresses on a 2 mm DKT mesh for P99 */
const PL = solveDesign(refMesh(2).nodes, refMesh(2).mem, tp, ['lens', 'pill']);
const row = (nm, c, m) => ({ nm, lens_um: +(c.lens.w * 1e3).toFixed(0), pill_um: +(c.pill.w * 1e3).toFixed(0), p99: c.lens.p99 != null ? +c.lens.p99.toFixed(1) : null, max: c.lens.max != null ? +c.lens.max.toFixed(1) : null, mass: m });
console.table([row('plain plate (DKT 1.2)', REF.cases, M1), row('plain plate (DKT 2.0)', PL.cases, M1), row('grid p8 w' + wg.toFixed(2), G.cases, M1), row('Theseus', R.cases, M1)]);
console.log('mass %s g (budget %s g); skin %s mm; plain plate %s mm; grid ribs %s mm', M1, M0.toFixed(3), TS, tp.toFixed(3), wg.toFixed(3));
console.log('twist um: Theseus %s, grid %s', (R.cases.twist.w * 1e3).toFixed(0), (G.cases.twist.w * 1e3).toFixed(0));
if (process.env.DRY) process.exit(0);
/* write the widths into the layout */
LAY.frame.members = f.members.map(([i, j, kind], e) => [i, j, kind, +R.w[e].toFixed(3), kind === 'fine' ? P.fh : P.wh]);
LAY.dims.skin = P.ts; LAY.dims.wall.h = P.wh; LAY.dims.fine.h = P.fh;
LAY.fe = { note: 'Grillage + DKT plate FE (this deck, 10-d4-plate.js solves it again in the page): PP-C-20A 13.5 GPa, nu 0.35; the skin as DKT triangles, the ribs as T-beams (flange w + 12 t); held at the four screw bosses; 10 N on the lens ring, or on the front skate. All three at ' + M1 + ' g, no rib wider than the ' + TS + ' mm skin.',
  mass: M1, skin: TS, wcap: WCAP,
  theseus: row('Theseus', R.cases), grid: Object.assign(row('Plain grid', G.cases), { pitch: 8, w: +wg.toFixed(3), h: 2.3, wall: wE, ring: wR }), plain: Object.assign(row('Plain plate', REF.cases), { t: +tp.toFixed(3) }), plain2: row('Plain plate, 2 mm DKT', PL.cases) };
fs.writeFileSync('/home/claude/theseus/3d/shell/plate-layout.json', JSON.stringify(LAY));
fs.writeFileSync('grid8.json', JSON.stringify({ nodes: g.nodes.map(p => p.map(v => +v.toFixed(3))), members: g.mem.map(m => [m.i, m.j, m.kind, +m.w.toFixed(3), m.h, m.split || 1]) }));
console.log('widths primary', Math.min(...R.w.filter((x, e) => o.prim[e])).toFixed(2), Math.max(...R.w).toFixed(2), 'fine', Math.min(...R.w.filter((x, e) => !o.prim[e])).toFixed(2), Math.max(...R.w.filter((x, e) => !o.prim[e])).toFixed(2));
