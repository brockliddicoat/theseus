// The optional bottom plate's mesh, from plate-layout.json (plate_layout.py): a solid 0.4 mm skin with a rounded outer edge,
// and on its inner face one layer of 2.3 mm ribs (the X, keel, ties, spokes, edge wall, lens hub ring, the fine lattice),
// their tops rounded, with the half-bosses' roofs over the screw counterbores. Writes plate-mesh.bin + .json (positions,
// normals, COLOR_0 occlusion, indices) for plate_write.py, which puts it into shell-theseus-1seam.glb's 'plate' node.
//     node shell/tools/plate_mesh.mjs        (from 3d/)
import * as THREE from 'three';
import fs from 'node:fs';
import { extrude } from '../../parts/lib/geom.js';
const HERE = new URL('.', import.meta.url);
const L = JSON.parse(fs.readFileSync(new URL('../plate-layout.json', HERE)));
const M = L.mesh;
const V2 = ([x, z]) => new THREE.Vector2(x, -z);                 // shape (x, -z), extruded along +e, then e -> +Y
const shape = (outer, holes = []) => { const s = new THREE.Shape(outer.map(V2)); for (const h of holes) s.holes.push(new THREE.Path(h.map(V2))); return s; };
const place = (g, y0) => { g.rotateX(-Math.PI / 2); g.translate(0, y0, 0); return g; };
const parts = [];
// the skin: its bottom edge (and the window's) rounded 0.3 mm
parts.push(place(extrude(shape(M.skin, [M.window]), { depth: M.ySkin - M.y0, back: { r: 0.3, t: 0.3, s: 4 }, curveSegments: 1, crease: 12 }), M.y0));
// the ribs: one layer from the skin to the top, the tops rounded 0.12 mm
const ribH = M.yTop - M.ySkin + 0.01;
parts.push(place(extrude(shape(M.ribOuter, M.ribHoles), { depth: ribH, front: { r: 0.12, t: 0.12, s: 2 }, curveSegments: 1, crease: 40 }), M.ySkin - 0.01));
// the bosses' roofs over the counterbores (the screw head bears under them)
for (const r of M.roofs) parts.push(place(extrude(shape(r), { depth: M.yTop - M.yCb, front: { r: 0.12, t: 0.12, s: 2 }, curveSegments: 1, crease: 40 }), M.yCb));
// merge, with occlusion in COLOR_0: the outer face and edge 1, the pocket floors 0.5, rising to 1 at the rib tops
const P = [], N = [], C = [], I = [];
for (const g of parts) {
  const p = g.attributes.position.array, n = g.attributes.normal.array, base = P.length / 3;
  for (let i = 0; i < p.length; i += 3) {
    const y = p[i + 1]; P.push(p[i], y, p[i + 2]);
    /* flat faces flat: smooth shading must not carry the edge round's tilt across the long cap triangles */
    if (Math.abs(n[i + 1]) > 0.985) N.push(0, Math.sign(n[i + 1]), 0); else N.push(n[i], n[i + 1], n[i + 2]);
    let ao = 1;
    if (y > M.ySkin - 0.02) { const t = Math.min(1, Math.max(0, (y - M.ySkin) / (M.yTop - M.ySkin))); ao = 0.5 + 0.5 * t * t * (3 - 2 * t); }
    C.push(ao, ao, ao, 1);
  }
  const idx = g.index ? g.index.array : Array.from({ length: p.length / 3 }, (_, k) => k);
  for (const k of idx) I.push(base + k);
}
const out = new URL('../work/', HERE); fs.mkdirSync(out, { recursive: true });
const buf = Buffer.concat([Buffer.from(new Float32Array(P).buffer), Buffer.from(new Float32Array(N).buffer), Buffer.from(new Float32Array(C).buffer), Buffer.from(new Uint32Array(I).buffer)]);
fs.writeFileSync(new URL('plate-mesh.bin', out), buf);
fs.writeFileSync(new URL('plate-mesh.json', out), JSON.stringify({ nv: P.length / 3, nt: I.length / 3 }));
console.log('plate mesh', P.length / 3, 'vertices', I.length / 3, 'triangles');
