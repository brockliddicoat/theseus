const { LAY, RHO } = require('./models.js');
const { solveDesign } = require('./m2.js');
const f = LAY.frame, nodes = f.nodes, As = LAY.areas.skin;
const Lm = f.members.map(([i, j]) => Math.hypot(nodes[j][0] - nodes[i][0], nodes[j][1] - nodes[i][1]));
const prim = f.members.map(m => m[2] !== 'fine');
const cs = ['lens', 'pill', 'twist'];
/* every member sized to its own stress (fully stressed), primary at wh, fine at fh; total volume fixed */
function design(o) {
  const H = prim.map(p => (p ? o.wh : o.fh)), bossV = 4 * Math.PI * 3.1 ** 2 / 2 * o.wh;
  const V = (o.M0 || 3.40) / RHO - As * o.ts - bossV;
  let w = Lm.map((L, e) => (prim[e] ? o.w0p : o.w0f));
  /* a member may be built as two walls side by side (o.twin: the kinds, each wall at most o.wmaxp): its cap is then twice */
  const cap = e => (prim[e] ? (o.twin && o.twin.includes(f.members[e][2]) ? 2 * o.wmaxp : o.wmaxp) : o.wmaxf);
  const norm = () => { for (let c = 0; c < 8; c++) { const v = w.reduce((s, x, e) => s + x * Lm[e] * H[e], 0); w = w.map((x, e) => Math.min(cap(e), Math.max(prim[e] ? o.wminp : o.wminf, x * V / v))); } };
  norm();
  const mk = () => f.members.map(([i, j, kind], e) => ({ i, j, kind, w: w[e], h: H[e], split: (o.twin && o.twin.includes(kind) && w[e] > o.wmaxp + 1e-9) ? 2 : 1 }));
  let R;
  for (let it = 0; it < o.it; it++) {
    R = solveDesign(nodes, mk(), o.ts, ['lens', 'pill', 'twist']);
    const idx = new Map(R.els.map((e, k) => [e.i + ',' + e.j, k]));
    const s = f.members.map(([i, j], e) => { const k = idx.get(i + ',' + j); if (k == null) return 0;
      if (o.crit === 'sed') return (R.cases.lens.r.en[k] + o.kp * R.cases.pill.r.en[k] * (o.pw || 1)) / (w[e] * Lm[e] * H[e]);
      return Math.max(R.cases.lens.r.sig[k], o.kp * R.cases.pill.r.sig[k], o.kt * R.cases.twist.r.sig[k]); });
    const ref = s.reduce((a, v, e) => a + v * Lm[e] * H[e] * w[e], 0) / s.reduce((a, v, e) => a + Lm[e] * H[e] * w[e], 0);
    w = w.map((x, e) => x * Math.pow(Math.max(1e-3, s[e] / ref), o.eta || 0.5));
    norm();
  }
  R = solveDesign(nodes, mk(), o.ts, cs); R.w = w; R.vol = As * o.ts + w.reduce((a, x, e) => a + x * Lm[e] * H[e], 0) + bossV; return R;
}
module.exports = { design, Lm, prim };
if (require.main === module) {
  const base = { ts: 0.45, wh: 2.3, w0p: 0.9, w0f: 0.4, wminp: 0.55, wmaxp: 1.3, wminf: 0.35, wmaxf: 0.6, it: 6, kp: 0.15, kt: 0.06 };
  const plain = 495, pill = 7812, tw = 15435;
  for (const fh of [0.6, 0.9, 1.2, 1.5]) for (const ts of [0.45]) {
    const R = design(Object.assign({}, base, { fh, ts })), c = R.cases;
    const wp = R.w.filter((x, e) => prim[e]), wf = R.w.filter((x, e) => !prim[e]);
    console.log('fh', fh, 'ts', ts, '| lens', (c.lens.w * 1e3).toFixed(0), 'um', (plain / (c.lens.w * 1e3)).toFixed(2) + 'x', '| pill', (pill / (c.pill.w * 1e3)).toFixed(2) + 'x', '| twist', (tw / (c.twist.w * 1e3)).toFixed(2) + 'x', '| P99', c.lens.p99.toFixed(1), 'max', c.lens.max.toFixed(1), '| mass', (R.vol * RHO).toFixed(2), '| wp', Math.min(...wp).toFixed(2), Math.max(...wp).toFixed(2), 'wf', Math.min(...wf).toFixed(2), Math.max(...wf).toFixed(2));
  }
}
