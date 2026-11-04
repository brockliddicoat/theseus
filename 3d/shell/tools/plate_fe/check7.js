const { pltSolve, PLT_E, PLT_NU } = require('./fe.js');
const { dktK, Dplate } = require('./dkt.js');
const t = 1, P = 10, a0 = 60, Db = Dplate(PLT_E, PLT_NU, t), D = Db[0][0];
for (const [n, pat] of [[8, 'alt'], [16, 'alt'], [32, 'alt'], [16, 'same'], [16, 'jit']]) {
  const h = a0 / n, nodes = [], plates = [], rnd = (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647 - 0.5); })();
  for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) { const edge = i === 0 || j === 0 || i === n || j === n; nodes.push([i * h + (pat === 'jit' && !edge ? rnd() * 0.5 * h : 0), j * h + (pat === 'jit' && !edge ? rnd() * 0.5 * h : 0)]); }
  const id = (i, j) => j * (n + 1) + i;
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const a = id(i, j), b = id(i + 1, j), c = id(i + 1, j + 1), d = id(i, j + 1); const tr = (pat === 'alt' && (i + j) % 2) ? [[a, b, d], [b, c, d]] : [[a, b, c], [a, c, d]]; for (const q of tr) plates.push({ n: q, K: dktK(q.map(k => nodes[k]), Db) }); }
  const fix = {}; nodes.forEach((p, i) => { if (p[0] < 1e-9 || p[1] < 1e-9 || p[0] > a0 - 1e-9 || p[1] > a0 - 1e-9) fix[i] = 'w'; });
  const c = id(n / 2, n / 2); nodes[c] = [a0 / 2, a0 / 2];
  for (const q of plates) q.K = dktK(q.n.map(k => nodes[k]), Db);
  const r = pltSolve({ nodes, els: [], plates, fix, loads: { [c]: [P, 0, 0] } });
  const wT = 0.0116 * P * a0 * a0 / D;
  console.log('DKT n', n, pat, 'w', r.d[c * 3].toFixed(4), 'exact', wT.toFixed(4), 'ratio', (r.d[c * 3] / wT).toFixed(3));
}
