// Export the deck's own GT01 (3d/parts/gt01.js) to a GLB for the Cycles renders: one node per part, transforms baked into
// world space (mm, the part's PCB frame: +Y up, plunger end toward +Z), one material slot per finish, named after its key in
// 3d/parts/lib/materials.js (Blender reassigns the physical shaders by these names).
//   node render/export_gt01.mjs [out.glb] [--press 0] [--cover clear]
// Uses the repo's own three.js and glTF-Transform (3d/node_modules); the cover is the plain one (no marking: no wordmarks).
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NM = path.join(ROOT, '3d', 'node_modules');
const imp = (p) => import(pathToFileURL(path.join(NM, p)).href);
const THREE = await imp('three/build/three.module.js');
const { Document, NodeIO } = await imp('@gltf-transform/core/dist/index.js');
const { buildGT01 } = await import(pathToFileURL(path.join(ROOT, '3d', 'parts', 'gt01.js')).href);
const { partMaterials } = await import(pathToFileURL(path.join(ROOT, '3d', 'parts', 'lib', 'materials.js')).href);

const args = process.argv.slice(2);
const out = path.resolve(args.find(a => a.endsWith('.glb')) || path.join(ROOT, 'render', 'build', 'gt01.glb'));
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };

// name every material by its library key, so the slots survive into Blender
const M = partMaterials();
for (const [k, m] of Object.entries(M)) if (m && m.isMaterial) m.name = k;
const gt = buildGT01({ materials: M, cover: opt('cover', 'clear'), marking: '' });
gt.setPress(+opt('press', 0));
gt.updateMatrixWorld(true);

const visible = (o) => { for (let p = o; p; p = p.parent) if (!p.visible) return false; return true; };
const doc = new Document();
const buf = doc.createBuffer();
const scene = doc.createScene('GT01');
const mats = new Map();
const matFor = (m, meshName) => {
  // the wedge's core is a darkened clone of lcpBlack: give it its own slot
  const key = meshName === 'wedgeCore' ? 'lcpBlackCore' : (m.name || 'unnamed');
  if (!mats.has(key)) {
    const c = m.color ? m.color.toArray() : [0.5, 0.5, 0.5];
    mats.set(key, doc.createMaterial(key).setBaseColorFactor([...c, 1]).setMetallicFactor(m.metalness ?? 0).setRoughnessFactor(m.roughness ?? 0.5));
  }
  return mats.get(key);
};

const names = new Map();
let nTri = 0, nMesh = 0;
gt.traverse((o) => {
  if (!o.isMesh || o.isLineSegments2 || !visible(o)) return;
  const mat = Array.isArray(o.material) ? o.material[0] : o.material;
  if (!mat || mat.visible === false || mat.isLineMaterial) return;
  const g0 = o.geometry;
  if (!g0 || !g0.attributes.position || g0.attributes.position.count === 0) return;
  const g = g0.clone();
  g.applyMatrix4(o.matrixWorld);
  if (!g.attributes.normal) g.computeVertexNormals();
  const P = new Float32Array(g.attributes.position.array.length);
  P.set(g.attributes.position.array);
  const N = new Float32Array(g.attributes.normal.array.length);
  N.set(g.attributes.normal.array);
  let I;
  if (g.index) I = new Uint32Array(g.index.array);
  else { I = new Uint32Array(P.length / 3); for (let i = 0; i < I.length; i++) I[i] = i; }
  // a mirrored world matrix flips the winding: put it back
  if (o.matrixWorld.determinant() < 0) for (let i = 0; i < I.length; i += 3) { const t = I[i + 1]; I[i + 1] = I[i + 2]; I[i + 2] = t; }
  let nm = o.name || 'mesh';
  const k = names.get(nm) || 0; names.set(nm, k + 1);
  if (k) nm = nm + '.' + k;
  const pos = doc.createAccessor(nm + '.P').setType('VEC3').setArray(P).setBuffer(buf);
  const nor = doc.createAccessor(nm + '.N').setType('VEC3').setArray(N).setBuffer(buf);
  const idx = doc.createAccessor(nm + '.I').setType('SCALAR').setArray(I).setBuffer(buf);
  const prim = doc.createPrimitive().setAttribute('POSITION', pos).setAttribute('NORMAL', nor).setIndices(idx).setMaterial(matFor(mat, o.name));
  const mesh = doc.createMesh(nm).addPrimitive(prim);
  scene.addChild(doc.createNode(nm).setMesh(mesh));
  nTri += I.length / 3; nMesh++;
});
fs.mkdirSync(path.dirname(out), { recursive: true });
await new NodeIO().write(out, doc);
const spec = gt.userData.spec;
fs.writeFileSync(out.replace(/\.glb$/, '.json'), JSON.stringify({ spec, materials: [...mats.keys()] }, null, 1));
console.log(`${out}: ${nMesh} meshes, ${nTri} tris, materials: ${[...mats.keys()].join(', ')}`);
