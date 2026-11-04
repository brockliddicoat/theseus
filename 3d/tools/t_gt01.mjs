import { buildGT01 } from '/home/claude/theseus/3d/parts/gt01.js';
const g = buildGT01();
let tris = 0; g.traverse(m => { if (m.isMesh && m.geometry.attributes.position) tris += (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3; });
console.log('tris', Math.round(tris), JSON.stringify(g.userData.spec.plungerTop), g.userData.spec.heightMax);
for (const k of [0, 0.5, 0.7, 1]) console.log(k, JSON.stringify(g.setPress(k)));
console.log(JSON.stringify(g.setPress(0.55, { releasing: true }))); g.setCutaway(1); g.setExplode(1);
