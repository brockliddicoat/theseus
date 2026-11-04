/* DKT (discrete Kirchhoff triangle, Batoz-Bathe-Ho 1980), built from its definition: rotations β = ∇w quadratic over the
   triangle (6-node shape functions); at the corners β equals the nodal slopes (tx = ∂w/∂x, tz = ∂w/∂z); at each mid-side,
   the tangential part is the slope of the cubic w along the side, the normal part the mean of the corners'. Curvature
   κ = (βx,x, βz,z, βx,z + βz,x), integrated exactly at the three mid-side points. Returns the 9x9 stiffness on
   (w1, tx1, tz1, w2, tx2, tz2, w3, tx3, tz3). */
function dktK(P, Db) {
  const [p1, p2, p3] = P, x = [p1[0], p2[0], p3[0]], z = [p1[1], p2[1], p3[1]];
  const A2 = (x[1] - x[0]) * (z[2] - z[0]) - (x[2] - x[0]) * (z[1] - z[0]), A = A2 / 2;
  /* area coordinates L1..L3: dL/dx, dL/dz */
  const dLx = [(z[1] - z[2]) / A2, (z[2] - z[0]) / A2, (z[0] - z[1]) / A2], dLz = [(x[2] - x[1]) / A2, (x[0] - x[2]) / A2, (x[1] - x[0]) / A2];
  /* β at the 6 nodes as 2x9 maps: corner i -> (tx_i, tz_i); mid-side k on side (i, j) */
  const beta = [];
  for (let i = 0; i < 3; i++) { const bx = new Float64Array(9), bz = new Float64Array(9); bx[i * 3 + 1] = 1; bz[i * 3 + 2] = 1; beta.push([bx, bz]); }
  const sides = [[0, 1], [1, 2], [2, 0]];          /* mid-side nodes 4, 5, 6 on sides 1-2, 2-3, 3-1 */
  for (const [i, j] of sides) {
    const dx = x[j] - x[i], dz = z[j] - z[i], l = Math.hypot(dx, dz), s = [dx / l, dz / l], n = [s[1], -s[0]];
    /* βs(mid) = 3/(2l)(wj - wi) - 1/4 (s·∇wi + s·∇wj);  βn(mid) = 1/2 (n·∇wi + n·∇wj) */
    const bs = new Float64Array(9), bn = new Float64Array(9);
    bs[i * 3] = -1.5 / l; bs[j * 3] = 1.5 / l; bs[i * 3 + 1] = -0.25 * s[0]; bs[i * 3 + 2] = -0.25 * s[1]; bs[j * 3 + 1] = -0.25 * s[0]; bs[j * 3 + 2] = -0.25 * s[1];
    bn[i * 3 + 1] = 0.5 * n[0]; bn[i * 3 + 2] = 0.5 * n[1]; bn[j * 3 + 1] = 0.5 * n[0]; bn[j * 3 + 2] = 0.5 * n[1];
    const bx = new Float64Array(9), bz = new Float64Array(9);
    for (let q = 0; q < 9; q++) { bx[q] = s[0] * bs[q] + n[0] * bn[q]; bz[q] = s[1] * bs[q] + n[1] * bn[q]; }
    beta.push([bx, bz]);
  }
  /* quadratic shape functions: corners Ni = Li(2Li - 1), mid-sides N4 = 4 L1 L2, N5 = 4 L2 L3, N6 = 4 L3 L1; derivatives */
  const dN = (L, d) => [d[0] * (4 * L[0] - 1), d[1] * (4 * L[1] - 1), d[2] * (4 * L[2] - 1), 4 * (d[0] * L[1] + L[0] * d[1]), 4 * (d[1] * L[2] + L[1] * d[2]), 4 * (d[2] * L[0] + L[2] * d[0])];
  const K = Array.from({ length: 9 }, () => new Float64Array(9));
  for (const L of [[0.5, 0.5, 0], [0, 0.5, 0.5], [0.5, 0, 0.5]]) {
    const Nx = dN(L, dLx), Nz = dN(L, dLz), B = [new Float64Array(9), new Float64Array(9), new Float64Array(9)];
    for (let k = 0; k < 6; k++) for (let q = 0; q < 9; q++) { B[0][q] += Nx[k] * beta[k][0][q]; B[1][q] += Nz[k] * beta[k][1][q]; B[2][q] += Nz[k] * beta[k][0][q] + Nx[k] * beta[k][1][q]; }
    const w = Math.abs(A) / 3;
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) { let v = 0; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) v += B[a][r] * Db[a][b] * B[b][c]; K[r][c] += w * v; }
  }
  return K;
}
function Dplate(E, nu, t) { const D = E * t ** 3 / (12 * (1 - nu * nu)); return [[D, nu * D, 0], [nu * D, D, 0], [0, 0, D * (1 - nu) / 2]]; }
module.exports = { dktK, Dplate };
