import { panHeadGeometry } from '/home/claude/theseus/3d/parts/lib/panhead.js';
const { geometry } = panHeadGeometry();
const p = geometry.attributes.position.array, n = p.length / 9, tol = 1e-5;
const key = (i) => Math.round(p[i * 3] / tol) + ',' + Math.round(p[i * 3 + 1] / tol) + ',' + Math.round(p[i * 3 + 2] / tol);
const E = new Map();
for (let f = 0; f < n; f++) for (let e = 0; e < 3; e++) { const a = key(f * 3 + e), b = key(f * 3 + (e + 1) % 3); const k = a < b ? a + '|' + b : b + '|' + a; E.set(k, (E.get(k) || 0) + 1); }
for (const [k, c] of E) if (c === 1) { const pts = k.split('|').map(s => s.split(',').map(v => (+v * tol).toFixed(4))); if (Math.abs(+pts[0][1] + 0.1) > 1e-3 || Math.abs(+pts[1][1] + 0.1) > 1e-3) console.log(pts.map(q => q.join(' ')).join('  ->  ')); }
