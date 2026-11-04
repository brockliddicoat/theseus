// usage: node meshcheck.mjs  (run from 3d/ so 'three' resolves) — checks closedness of generated geometries
import * as THREE from 'three';
export function edgeReport(geo, name, tol = 1e-5) {
  const p = geo.attributes.position.array, n = p.length / 9;
  const key = (i) => Math.round(p[i * 3] / tol) + ',' + Math.round(p[i * 3 + 1] / tol) + ',' + Math.round(p[i * 3 + 2] / tol);
  const E = new Map(); let area = 0, vol = 0;
  for (let f = 0; f < n; f++) {
    const ks = [key(f * 3), key(f * 3 + 1), key(f * 3 + 2)];
    for (let e = 0; e < 3; e++) {
      const a = ks[e], b = ks[(e + 1) % 3];
      const k2 = a < b ? a + '|' + b : b + '|' + a, dir = a < b ? 1 : -1;
      const r = E.get(k2) || [0, 0]; r[0]++; r[1] += dir; E.set(k2, r);
    }
    const o = f * 9, ax = p[o], ay = p[o + 1], az = p[o + 2], bx = p[o + 3], by = p[o + 4], bz = p[o + 5], cx = p[o + 6], cy = p[o + 7], cz = p[o + 8];
    vol += (ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)) / 6;
    const ux = bx - ax, uy = by - ay, uz = bz - az, vx = cx - ax, vy = cy - ay, vz = cz - az;
    area += 0.5 * Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx);
  }
  let open = 0, nonman = 0, flip = 0;
  for (const [k, [c, d]] of E) { if (c === 1) open++; else if (c > 2) nonman++; else if (c === 2 && d !== 0) flip++; }
  console.log(name, 'tris', n, 'edges', E.size, 'open', open, 'nonmanifold', nonman, 'misoriented', flip, 'area', area.toFixed(3), 'vol', vol.toFixed(4));
  return { open, nonman, flip, vol, area };
}
