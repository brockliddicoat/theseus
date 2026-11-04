import * as P from '/home/claude/theseus/3d/parts/fasteners.js';
import { edgeReport } from './meshcheck.mjs';
const j = P.buildScrewJoint();
let tris = 0;
j.traverse(o => { if (o.isMesh && o.geometry.attributes.position && !/:cap$/.test(o.name)) { const n = o.geometry.attributes.position.count / 3; tris += n; } });
console.log('joint tris', tris, j.userData.spec.insertMass_g);
const s = j.userData.parts;
edgeReport(s.head.geometry, 'head'); edgeReport(s.thread.geometry, 'thread');
const sc = P.buildM2Screw({ length: 4, detail: 'low' }); let t2 = 0; sc.traverse(o => { if (o.isMesh) t2 += o.geometry.attributes.position.count / 3; }); console.log('low screw tris', t2);
