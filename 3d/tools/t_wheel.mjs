import { buildScrollWheel } from '/home/claude/theseus/3d/parts/scrollwheel.js';
for (const o of [{}, { encoderSide: 'left', axleHeight: 12, diameter: 22.74 }]) {
  const w = buildScrollWheel(o);
  let tris = 0, n = 0; w.traverse(m => { if (m.isMesh && m.geometry.attributes.position) { tris += (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3; n++; } });
  console.log('meshes', n, 'tris', Math.round(tris), JSON.stringify(w.userData.spec.encoderBox), JSON.stringify(w.userData.spec.encoderBody));
  for (const s of [0, 0.13, 0.26]) console.log('scroll', s, JSON.stringify(w.setScroll(s)));
  w.setExplode(1); w.setXray(1); w.setHighlight(0xff3b4a);
  const paths = []; w.traverse(m => { if (m.isMesh) { const p = []; let q = m; while (q && q !== w) { p.unshift(q.name); q = q.parent; } paths.push(p.join('/')); } });
  console.log(paths.filter(p => /emitterBody|disc$|detectorBody|axleR|housing|framePlate/.test(p)).join('  '));
}
