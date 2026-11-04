const { pltSolve } = require('./fe.js');
const EI = 1000, GJ = 500, L = 10, P = 1;
const sec = { EI, GJ, E: 1, G: 1, cy: 1, tt: 1 };
// cantilever along x, and along a 30 deg direction: tip deflection PL^3/3EI
for (const ang of [0, 30, 90]) { const c = Math.cos(ang * Math.PI / 180), s = Math.sin(ang * Math.PI / 180);
  const r = pltSolve({ nodes: [[0, 0], [L * c, L * s]], els: [Object.assign({ i: 0, j: 1 }, sec)], fix: { 0: 'wr' }, loads: { 1: [P, 0, 0] } });
  console.log('cantilever', ang, r.d[3].toFixed(5), 'expect', (P * L ** 3 / (3 * EI)).toFixed(5)); }
// L-shaped: member 0-1 along x (fixed at 0), member 1-2 along z; load at 2: w = P L^3/3EI (arm 2) + bending of arm1 PL^3/3EI + torsion of arm1 (P L) L/GJ * L
{ const r = pltSolve({ nodes: [[0, 0], [L, 0], [L, L]], els: [Object.assign({ i: 0, j: 1 }, sec), Object.assign({ i: 1, j: 2 }, sec)], fix: { 0: 'wr' }, loads: { 2: [P, 0, 0] } });
  const exp = P * L ** 3 / (3 * EI) * 2 + P * L * L * L / GJ;
  console.log('L-frame', r.d[6].toFixed(5), 'expect', exp.toFixed(5)); }
// a simply supported beam split in 4 elements along z, central load: PL^3/48EI with L=40
{ const nodes = [0, 1, 2, 3, 4].map(k => [0, k * 10]); const els = [0, 1, 2, 3].map(k => Object.assign({ i: k, j: k + 1 }, sec));
  const r = pltSolve({ nodes, els, fix: { 0: 'w', 4: 'w' }, loads: { 2: [P, 0, 0] } }); console.log('SS beam', r.d[6].toFixed(5), 'expect', (P * 40 ** 3 / (48 * EI)).toFixed(5)); }
