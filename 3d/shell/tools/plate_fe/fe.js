/* plt grillage solver: a plate's ribs as beams in bending and torsion, loaded out of their plane (the plane frame solver
   of 07-sim.js carries loads in its own plane; a plate pressed at the lens bends out of it). Nodes (x, z) mm; DOF per node
   w (mm, out of plane), tx = dw/dx, tz = dw/dz. Banded Cholesky after sorting the nodes along z. */
function pltSolve(m) {
  const nn = m.nodes.length, order = m.nodes.map((p, i) => i).sort((a, b) => m.nodes[a][1] - m.nodes[b][1] || m.nodes[a][0] - m.nodes[b][0]);
  const pos = new Int32Array(nn); order.forEach((o, k) => { pos[o] = k; });
  let bw = 0; for (const e of m.els) bw = Math.max(bw, Math.abs(pos[e.i] - pos[e.j]));
  for (const pl of m.plates || []) for (const a of pl.n) for (const b of pl.n) bw = Math.max(bw, Math.abs(pos[a] - pos[b]));
  const n = nn * 3, B = (bw + 1) * 3, K = new Float64Array(n * B), F = new Float64Array(n);   /* K[r*B + (c - r)], c >= r */
  const add = (r, c, v) => { if (c < r) { const t = r; r = c; c = t; } K[r * B + (c - r)] += v; };
  const info = [];
  for (const e of m.els) {
    const [x1, z1] = m.nodes[e.i], [x2, z2] = m.nodes[e.j], L = Math.hypot(x2 - x1, z2 - z1), c = (x2 - x1) / L, s = (z2 - z1) / L;
    const a = e.EI / (L * L * L), kb = [12 * a, 6 * L * a, -12 * a, 6 * L * a, 6 * L * a, 4 * L * L * a, -6 * L * a, 2 * L * L * a, -12 * a, -6 * L * a, 12 * a, -6 * L * a, 6 * L * a, 2 * L * L * a, -6 * L * a, 4 * L * L * a];
    const kt = e.GJ / L;
    /* local (w1, α1, β1, w2, α2, β2) = T · global (w1, tx1, tz1, w2, tx2, tz2) */
    const T = [[1, 0, 0], [0, c, s], [0, -s, c]];
    const kl = Array.from({ length: 6 }, () => new Float64Array(6));
    const bi = [0, 1, 3, 4]; for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++) kl[bi[r]][bi[q]] += kb[r * 4 + q];
    kl[2][2] += kt; kl[5][5] += kt; kl[2][5] -= kt; kl[5][2] -= kt;
    const Tm = (r, q) => (Math.floor(r / 3) === Math.floor(q / 3) ? T[r % 3][q % 3] : 0);
    const dof = [pos[e.i] * 3, pos[e.i] * 3 + 1, pos[e.i] * 3 + 2, pos[e.j] * 3, pos[e.j] * 3 + 1, pos[e.j] * 3 + 2];
    for (let r = 0; r < 6; r++) for (let q = r < 6 ? 0 : 0; q < 6; q++) {
      let v = 0; for (let p = 0; p < 6; p++) { const tp = Tm(p, r); if (!tp) continue; for (let u = 0; u < 6; u++) { const tu = Tm(u, q); if (tu) v += tp * kl[p][u] * tu; } }
      if (dof[q] >= dof[r]) add(dof[r], dof[q], v);
    }
    info.push({ L, c, s, kb, kt });
  }
  for (const pl of m.plates || []) {
    const dof = []; for (const nd of pl.n) dof.push(pos[nd] * 3, pos[nd] * 3 + 1, pos[nd] * 3 + 2);
    for (let r = 0; r < 9; r++) for (let q = 0; q < 9; q++) if (dof[q] >= dof[r]) add(dof[r], dof[q], pl.K[r][q]);
  }
  let dmax = 0; for (let r = 0; r < n; r++) dmax = Math.max(dmax, K[r * B]);
  /* a whisper on every DOF, 1e-10 of the MEDIAN diagonal (plate v3). It was 1e-10 of the largest: the grid's mesh has
     0.08 mm members at the back bosses (its x = 24 lines pass 0.08 mm from the boss centres), whose 12EI/L^3 made that
     whisper 0.09 N/mm on every DOF, an elastic foundation under the whole plate that held 72 % of the grid's twist energy.
     WHMAX=1 restores the old whisper (to reproduce the v2 numbers). */
  const diag = []; for (let r = 0; r < n; r++) if (K[r * B] > 0) diag.push(K[r * B]); diag.sort((a, b) => a - b);
  const wh = process.env.WHMAX ? dmax * 1e-10 : (diag.length ? diag[diag.length >> 1] : dmax) * 1e-10;
  for (let r = 0; r < n; r++) K[r * B] += wh;
  for (const [nd, how] of Object.entries(m.fix || {})) { const b0 = pos[+nd] * 3; if (how.includes('w')) K[b0 * B] += dmax * 1e8; if (how.includes('r')) { K[(b0 + 1) * B] += dmax * 1e8; K[(b0 + 2) * B] += dmax * 1e8; } }
  for (const [nd, f] of Object.entries(m.loads || {})) { const b0 = pos[+nd] * 3; F[b0] += f[0] || 0; F[b0 + 1] += f[1] || 0; F[b0 + 2] += f[2] || 0; }
  /* banded Cholesky, in place: K = Lᵀ L stored as upper rows */
  for (let j = 0; j < n; j++) {
    let s = K[j * B]; const k0 = Math.max(0, j - B + 1);
    for (let k = k0; k < j; k++) { const v = K[k * B + (j - k)]; s -= v * v; }
    const d = Math.sqrt(Math.max(s, dmax * 1e-14)); K[j * B] = d;
    const iMax = Math.min(n - 1, j + B - 1);
    for (let i = j + 1; i <= iMax; i++) {
      let v = K[j * B + (i - j)]; const kk0 = Math.max(0, i - B + 1, k0);
      for (let k = kk0; k < j; k++) v -= K[k * B + (j - k)] * K[k * B + (i - k)];
      K[j * B + (i - j)] = v / d;
    }
  }
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) { let v = F[i]; for (let k = Math.max(0, i - B + 1); k < i; k++) v -= K[k * B + (i - k)] * y[k]; y[i] = v / K[i * B]; }
  const xx = new Float64Array(n);
  for (let i = n - 1; i >= 0; i--) { let v = y[i]; for (let k = i + 1; k <= Math.min(n - 1, i + B - 1); k++) v -= K[i * B + (k - i)] * xx[k]; xx[i] = v / K[i * B]; }
  const d = new Float64Array(n); for (let o = 0; o < nn; o++) for (let q = 0; q < 3; q++) d[o * 3 + q] = xx[pos[o] * 3 + q];
  /* member forces: end moments, torque, peak stress (bending at the extreme fibre plus torsion, von Mises) */
  const M = [], Tq = [], sig = [], en = [];
  m.els.forEach((e, k) => {
    const { L, c, s, kb, kt } = info[k], g = i => [d[i * 3], d[i * 3 + 1], d[i * 3 + 2]];
    const [w1, tx1, tz1] = g(e.i), [w2, tx2, tz2] = g(e.j);
    const a1 = c * tx1 + s * tz1, b1 = -s * tx1 + c * tz1, a2 = c * tx2 + s * tz2, b2 = -s * tx2 + c * tz2, u = [w1, a1, w2, a2];
    const f = [0, 1, 2, 3].map(r => kb[r * 4] * u[0] + kb[r * 4 + 1] * u[1] + kb[r * 4 + 2] * u[2] + kb[r * 4 + 3] * u[3]);
    const Mm = Math.max(Math.abs(f[1]), Math.abs(f[3])), T0 = kt * (b2 - b1);
    M.push(Mm); Tq.push(T0); en.push(0.5 * (u[0] * f[0] + u[1] * f[1] + u[2] * f[2] + u[3] * f[3]) + 0.5 * kt * (b2 - b1) ** 2);
    const sb = Mm * e.cy / e.EI * e.E, tau = e.GJ > 0 ? Math.abs(T0) * e.tt / (e.GJ / e.G) : 0;
    sig.push(Math.sqrt(sb * sb + 3 * tau * tau));
  });
  let comp = 0; for (let i = 0; i < n; i++) comp += F[i] * xx[i];
  return { d, M, T: Tq, sig, en, smax: Math.max(...sig), comp, model: m, bw };
}
/* a section: a skin flange bf × ts with a rib w × h on it (either may be zero). Returns E I, G J, the distance to the
   extreme fibre, the thickest wall (for torsion), area */
const PLT_E = 13500, PLT_G = 13500 / (2 * 1.35), PLT_NU = 0.35;
function pltSec(bf, ts, w, h, Jskin) {
  const Af = bf * ts, Aw = w * h, A = Af + Aw, yc = (Af * ts / 2 + Aw * (ts + h / 2)) / A;
  const I = bf * ts ** 3 / 12 + Af * (yc - ts / 2) ** 2 + w * h ** 3 / 12 + Aw * (ts + h / 2 - yc) ** 2;
  const J = (Jskin != null ? Jskin : 0) + (h > 0 ? h * w ** 3 / 3 : 0);
  return { EI: PLT_E * I, GJ: PLT_G * J, E: PLT_E, G: PLT_G, cy: Math.max(yc, ts + h - yc), tt: Math.max(h > 0 ? w : 0, Jskin ? ts : 0) || ts, A };
}
module.exports = { pltSolve, pltSec, PLT_E, PLT_G, PLT_NU };
