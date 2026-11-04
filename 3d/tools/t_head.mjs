import { panHeadGeometry } from '/home/claude/theseus/3d/parts/lib/panhead.js';
import { edgeReport } from './meshcheck.mjs';
const { geometry, spec } = panHeadGeometry();
console.log(spec);
edgeReport(geometry, 'head');
const b = new (await import('three')).Box3().setFromBufferAttribute(geometry.attributes.position); console.log(b.min, b.max);
