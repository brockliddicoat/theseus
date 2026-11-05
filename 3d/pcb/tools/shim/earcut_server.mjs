// earcut over stdin/stdout for shim/mapbox_earcut.py: one JSON line in ({v: [x0,y0,...], e: [ring ends]}), one out (indices)
import { ShapeUtils, Vector2 } from 'three';
import readline from 'node:readline';
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
  const { v, e } = JSON.parse(line);
  const rings = []; let s = 0;
  for (const end of e) { const r = []; for (let i = s; i < end; i++) r.push(new Vector2(v[2 * i], v[2 * i + 1])); rings.push(r); s = end; }
  let out = [];
  if (rings.length && rings[0].length >= 3) {
    const faces = ShapeUtils.triangulateShape(rings[0], rings.slice(1));
    out = new Array(faces.length * 3);
    for (let i = 0; i < faces.length; i++) { out[3 * i] = faces[i][0]; out[3 * i + 1] = faces[i][1]; out[3 * i + 2] = faces[i][2]; }
  }
  process.stdout.write(JSON.stringify(out) + '\n');
});
