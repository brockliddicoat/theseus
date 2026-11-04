import { buildRadioModule, buildSensorModule, buildSnapLens } from '/home/claude/theseus/3d/parts/parts.js';
for (const f of [buildRadioModule, buildSensorModule, buildSnapLens]) {
  const g = f(); let tris = 0; g.traverse(m => { if (m.isMesh) tris += (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3; });
  const b = new (await import('three')).Box3().setFromObject(g); console.log(g.name, Math.round(tris), b.min.toArray().map(v => +v.toFixed(2)), b.max.toArray().map(v => +v.toFixed(2)));
}
