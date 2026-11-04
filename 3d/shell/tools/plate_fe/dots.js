/* plate off: where the two sensor dots belong. The base as a DKT plate on the plate's outline (0.86 mm PP-C-20A, a stand-in
   for the open base's stiffness: only the comparison between layouts is used), standing on the eight corner dots (meta)
   plus two dots at the lens: front and back (0, +/-11.5) or left and right (+/-11.5, 0). Loads: a palm press (10 N spread
   over the rear 60 % of the base), a claw grip (6 N at the palm heel, z -40, and 2 x 2 N at the fingertips, z +36). */
const { refMesh } = require('./calib.js'); const { triangulate } = require('./m2.js'); const { dktK, Dplate } = require('./dkt.js'); const { pltSolve, PLT_E, PLT_NU } = require('./fe.js');
const M = JSON.parse(require('fs').readFileSync('/home/claude/theseus/3d/shell/shell-theseus-1seam.json'));
const m = refMesh(1.5), T = triangulate(m.nodes, m.mem), Db = Dplate(PLT_E, PLT_NU, 0.86), plates = T.tris.map(n => ({ n, K: dktK(n.map(k => T.nodes[k]), Db) }));
const near = p => { let b = -1, bd = 1e9; m.nodes.forEach((q, i) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); if (d < bd) { bd = d; b = i; } }); return b; };
const area = new Float64Array(T.nodes.length); T.tris.forEach(tr => { const P = tr.map(k => T.nodes[k]); const A = Math.abs((P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1])) / 2; tr.forEach(k => { area[k] += A / 3; }); });
const loadsOf = { palm: () => { const L = {}; let tot = 0; T.nodes.forEach((p, i) => { if (i < m.nodes.length && p[1] < 0.2 * 51 - 0.6 * 0 && p[1] < 10) { tot += area[i]; } }); T.nodes.forEach((p, i) => { if (i < m.nodes.length && p[1] < 10) L[i] = [-10 * area[i] / tot, 0, 0]; }); return L; },
  claw: () => { const L = {}; L[near([0, -40])] = [-6, 0, 0]; L[near([10, 36])] = [-2, 0, 0]; L[near([-10, 36])] = [-2, 0, 0]; return L; } };
const lens = near([0, 1.1]);
for (const [nm, extra] of [['corners only', []], ['front and back', [[0, 11.5], [0, -11.5]]], ['left and right', [[11.5, 0], [-11.5, 0]]]]) {
  const fix = {}; [...M.skates, ...extra].forEach(p => { fix[near(p)] = 'w'; });
  const out = [];
  for (const c of ['palm', 'claw']) {
    const r = pltSolve({ nodes: T.nodes, els: [], plates, fix, loads: loadsOf[c]() });
    let wmin = 0, wi = 0; for (let i = 0; i < m.nodes.length; i++) if (r.d[i * 3] < wmin) { wmin = r.d[i * 3]; wi = i; }
    out.push(c + ': lens ' + (-r.d[lens * 3] * 1000).toFixed(0) + ' um, worst sag ' + (-wmin * 1000).toFixed(0) + ' um at (' + m.nodes[wi].map(v => v.toFixed(0)).join(', ') + ')');
  }
  console.log(nm.padEnd(16), out.join(' | '));
}
