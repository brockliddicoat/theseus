// The bottom plate FE study (plate builder, 2026-11-04; v2 the same day: 0.6 mm skin, twin walls, half-moon skates).
// Order (this folder is CommonJS, see package.json): from 3d/, [WIDTHS=shell/plate-layout.json, to keep the frame; leave it out
// for a new frame, as after the sensor moved in v3] NSUB=3 FIL=0.30 EDGEBAND=0.50
// WSCALE=0.82 python3 -I shell/tools/plate_layout.py once (it writes the skates into the layout: the front-skate load case
// needs them); then here node final.js (sizes Theseus, solves the grid and the plain plate at Theseus's weight, writes the
// widths into ../../plate-layout.json and grid8.json; DRY=1 prints only; TS, WCAP, TWIN, CRIT, KP, IT, ETA for variants);
// then from 3d/ plate_layout.py again (same env), node shell/tools/plate_mesh.mjs, python3 -I shell/tools/plate_write.py;
// then here node export_viz.js and node gen_deck_data.js (the data block of deck/src/10-d4-plate.js; apply_deck.py pastes it). unit.js and check7.js
// are the solver checks (beams exact; DKT within 1 % of Timoshenko); dots.js is the plate-off sensor-dot study (NOWIN=0 for
// the v1 model with the window hole).
/* plate v2 (F20.3, "Thicker skin"): a 0.60 mm skin, and no rib wider than the skin (struts and fine ribs capped at 0.60 mm,
   the molding rule against sink marks on the solid outer face). The ribs keep the volume budget they had on the 0.40 mm
   skin, so the plate only gains the skin's extra weight (less, where the caps bind); the grid and the solid plate are then
   sized to the weight Theseus comes out at, so all three are compared at equal weight again. */
/* plate v3 (plate builder 3, 2026-11-04): four load cases (10 N on the lens ring, on the front skate, on the back skate, and
   the twist: three screws held, 10 N at the fourth), Theseus sized by design3 (opt.js: the stiffness criterion over the lens
   and both skates; twin walls allowed on every primary), and three fixes in the solver, each with a switch to the v2 model:
   WHMAX=1 (fe.js whisper), VAVG=1 (m2.js face centroid and fan), GRIDRING=hex (grid.js lens ring). CRIT=fsd|sed runs the
   v2 sizer (opt.js design). The grid is sized as in v2: the same skin, rib height, caps, edge wall (0.60) and lens ring
   (Theseus's mean ring width), its 8 mm ribs taking the rest of Theseus's weight. */
const fs = require('fs');
const o = require('./opt.js'); const { LAY, RHO } = require('./models.js'); const { solveDesign } = require('./m2.js'); const { gridModel } = require('./grid.js');
const E = process.env, TS = +(E.TS || 0.60), WCAP = +(E.WCAP || TS);
const bossV = 4 * Math.PI * 3.1 ** 2 / 2 * 2.3, As = LAY.areas.skin, f = LAY.frame;
const CS = ['lens', 'pill', 'back', 'twist'];
const TWIN = (E.TWIN ?? (E.CRIT ? 'ring,tie' : 'ring,tie,spoke,edge,keel')).split(',').filter(Boolean);
let R;
if (E.CRIT) {
  const M0 = 3.40 + As * (TS - 0.40) * RHO;     /* the v1 rib budget (3.40 g at 0.40 mm) on the thicker skin */
  const P = { ts: TS, wh: 2.3, fh: 2.3, w0p: Math.min(0.8, WCAP), w0f: 0.4, wminp: 0.5, wmaxp: WCAP, wminf: 0.35, wmaxf: Math.min(0.7, WCAP), kp: +(E.KP || 0.25), kt: 0, M0, twin: TWIN, crit: E.CRIT, it: +(E.IT || 8), eta: +(E.ETA || 0.5), pw: +(E.PW || 1) };
  R = o.design(P); R.split = f.members.map(([, , kind], e) => (TWIN.includes(kind) && R.w[e] > WCAP + 1e-9 ? 2 : 1));
  R = Object.assign(solveDesign(f.nodes, f.members.map(([i, j, kind], e) => ({ i, j, kind, w: R.w[e], h: 2.3, split: R.split[e] })), TS, CS), { w: R.w, vol: R.vol, split: R.split });
} else {
  const P = { ts: TS, wh: 2.3, fh: 2.3, w0p: 0.6, w0f: 0.45, wminp: 0.5, wminf: 0.35, wcap: WCAP, wcapf: Math.min(0.6, WCAP), M0: +(E.MASS || 4.195), twin: TWIN,
    k: { lens: 1, pill: +(E.KP || 0.35), back: +(E.KB || 0.35), twist: +(E.KT || 0) }, it: +(E.IT || 40), eta: +(E.ETA || 0.5), move: +(E.MOVE || 0.3), link: (E.LINK ?? 'ring').split(',').filter(Boolean) };
  R = o.design3(P);
}
const M1 = +(R.vol * RHO).toFixed(3);
process.env.M0 = String(M1);
const { reference, refMesh, tp } = require('./calib.js');
/* grid p = 8, at Theseus's weight; its edge wall and lens ring capped like Theseus's */
const ringWs = f.members.map((m, e) => [m[2], R.w[e]]).filter(q => q[0] === 'ring').map(q => q[1]);
const wE = Math.min(0.8, WCAP), wR = TWIN.includes('ring') ? ringWs.reduce((a, b) => a + b, 0) / ringWs.length : Math.min(0.9, WCAP);
const g1 = gridModel(8, 1, 2.3, TS, wE, wR), L = m => Math.hypot(g1.nodes[m.j][0] - g1.nodes[m.i][0], g1.nodes[m.j][1] - g1.nodes[m.i][1]);
const Lg = g1.mem.filter(m => m.kind === 'grid').reduce((s, m) => s + L(m), 0), Le = g1.mem.filter(m => m.kind !== 'grid').reduce((s, m) => s + L(m) * (m.kind === 'ring' ? wR : wE), 0);
const wg = (M1 / RHO - As * TS - Le * 2.3 - bossV) / (Lg * 2.3), g = gridModel(8, wg, 2.3, TS, wE, wR), G = solveDesign(g.nodes, g.mem, TS, CS);
const REF = reference(1.2);
/* plain plate stresses on a 2 mm DKT mesh for P99 */
const PL = solveDesign(refMesh(2).nodes, refMesh(2).mem, tp, CS);
const um = c => (c ? +(c.w * 1e3).toFixed(0) : null);
const row = (nm, c, m) => ({ nm, lens_um: um(c.lens), pill_um: um(c.pill), back_um: um(c.back), twist_um: um(c.twist), p99: c.lens.p99 != null ? +c.lens.p99.toFixed(1) : null, max: c.lens.max != null ? +c.lens.max.toFixed(1) : null, mass: m });
const model = ['WHMAX', 'VAVG', 'GRIDRING'].filter(k => E[k]).map(k => k + '=' + E[k]).join(' ') || 'v3 (corrected)';
console.log('model: ' + model + '; sizer: ' + (E.CRIT ? 'v2 opt.design CRIT=' + E.CRIT : 'v3 opt.design3') + '; twin: ' + TWIN.join(','));
console.table([row('plain plate (DKT 1.2)', REF.cases, M1), row('plain plate (DKT 2.0)', PL.cases, M1), row('grid p8 w' + wg.toFixed(2), G.cases, M1), row('Theseus', R.cases, M1)]);
console.log('mass %s g; skin %s mm; plain plate %s mm; grid ribs %s mm, edge %s, ring %s', M1, TS, tp.toFixed(3), wg.toFixed(3), wE.toFixed(2), wR.toFixed(3));
console.log('Theseus against the grid (grid / Theseus, > 1 = Theseus stiffer or lower): ' + CS.map(c => c + ' ' + (G.cases[c].w / R.cases[c].w).toFixed(2)).join(', ') + ', peak ' + (G.cases.lens.max / R.cases.lens.max).toFixed(2));
const kw = kd => { const q = f.members.map((m, e) => [m[2], R.w[e]]).filter(z => z[0] === kd).map(z => z[1]); return q.length ? kd + ' ' + Math.min(...q).toFixed(2) + '-' + Math.max(...q).toFixed(2) : ''; };
console.log('widths: ' + ['spoke', 'tie', 'keel', 'edge', 'ring', 'fine'].map(kw).filter(Boolean).join(', ') + '; walls below 0.35: ' + R.w.filter((x, e) => R.split[e] === 2 && x / 2 < 0.35 - 1e-9).length);
if (E.DRY) process.exit(0);
/* write the widths into the layout */
LAY.frame.members = f.members.map(([i, j, kind], e) => [i, j, kind, +R.w[e].toFixed(3), 2.3]);
LAY.dims.skin = TS; LAY.dims.wall.h = 2.3; LAY.dims.fine.h = 2.3;
LAY.fe = { note: 'Grillage + DKT plate FE (plate v3): PP-C-20A 13.5 GPa, nu 0.35; the skin as DKT triangles, the ribs as T-beams (flange w + 12 t); held at the four screw bosses; 10 N on the lens ring, on the front skate or on the back skate, or the twist (three screws held, 10 N at the fourth). All three at ' + M1 + ' g, no rib wider than the ' + TS + ' mm skin (wider members are twin walls). The grid\'s lens ring follows the stadium as Theseus\'s does.',
  mass: M1, skin: TS, wcap: WCAP, twin: TWIN, model, sizer: E.CRIT ? 'opt.design ' + E.CRIT : 'opt.design3 KP ' + (E.KP || 0.35) + ' KB ' + (E.KB || 0.35),
  theseus: row('Theseus', R.cases), grid: Object.assign(row('Plain grid', G.cases), { pitch: 8, w: +wg.toFixed(3), h: 2.3, wall: wE, ring: +wR.toFixed(3) }), plain: Object.assign(row('Plain plate', REF.cases), { t: +tp.toFixed(3) }), plain2: row('Plain plate, 2 mm DKT', PL.cases) };
fs.writeFileSync(E.LAYOUT || '/home/claude/theseus/3d/shell/plate-layout.json', JSON.stringify(LAY));
fs.writeFileSync('grid8.json', JSON.stringify({ nodes: g.nodes.map(p => p.map(v => +v.toFixed(3))), members: g.mem.map(m => [m.i, m.j, m.kind, +m.w.toFixed(3), m.h, m.split || 1]) }));
console.log('wrote the widths and the fe block into', E.LAYOUT || 'plate-layout.json', 'and grid8.json');
