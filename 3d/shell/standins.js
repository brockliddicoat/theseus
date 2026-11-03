// Stand-ins with the SAME signatures and local frames as the frozen 3d/parts/ API (README there), used until
// parts/parts.js exists. Clearly marked: group.userData.standIn = true.
//   buildScrollWheel(opts): origin = PCB top under the wheel centre; axle along X; wheel centre at Y = axleHeight.
//   buildDotSkate(opts):    origin = centre of the glide face at Y = 0; stack rises to Y = height.
//   buildM2Screw(opts):     origin = centre of the head's bearing face; shank along -Y.
import * as THREE from 'three';

function lathe(profile, seg = 96) {
  return new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), seg);
}

/** Magnesium wheel stand-in: torus-like crowned rim, chevron "rover" grousers, 6 triangular windows, POM axle. */
export function buildScrollWheel(opts = {}) {
  const D = opts.diameter ?? 22, W = opts.width ?? 7, H = opts.axleHeight ?? 12, nG = opts.grousers ?? 48;
  const M = opts.materials || {};
  const mag = M.magnesium || new THREE.MeshPhysicalMaterial({ color: 0xb9bdc2, metalness: 1, roughness: 0.36 });
  const pom = M.pom || new THREE.MeshPhysicalMaterial({ color: 0xefede6, roughness: 0.42 });
  const owned = [];
  const g = new THREE.Group(); g.name = 'scrollWheel'; g.userData.standIn = true;
  const rotor = new THREE.Group(); rotor.position.y = H; g.add(rotor);
  const R = D / 2, rimT = 1.9, hw = W / 2;
  // rim cross-section (in the r-x plane): crowned outer face (torus-like), flat inner bore; lathe about the axle (X)
  const prof = [];
  const crownR = R; // spherical crown
  const N = 24;
  prof.push([R - rimT, -hw + 0.35]);
  prof.push([R - 0.9, -hw]);
  for (let i = 0; i <= N; i++) {            // crowned tread base, slightly below the grouser tips
    const x = -hw + 0.55 + (W - 1.1) * i / N;
    const r = (R - 0.55) - (x * x) / (2 * crownR) * 0.9;
    prof.push([r, x]);
  }
  prof.push([R - 0.9, hw]);
  prof.push([R - rimT, hw - 0.35]);
  prof.push([R - rimT, -hw + 0.35]);
  const rimGeo = lathe(prof, 160); rimGeo.rotateZ(-Math.PI / 2); owned.push(rimGeo);   // lathe axis Y -> X
  const rim = new THREE.Mesh(rimGeo, mag); rim.name = 'tread'; rotor.add(rim);
  // grousers: chevrons across the tread (rover-wheel inspired), 5 elements per row read as 2 strokes + apex
  const chevGeo = new THREE.BufferGeometry();
  {
    const arm = new THREE.BoxGeometry(W * 0.52, 0.42, 0.55);
    const a1 = arm.clone(); a1.rotateY(0.42); a1.translate(-W * 0.22, 0, 0.32);
    const a2 = arm.clone(); a2.rotateY(-0.42); a2.translate(W * 0.22, 0, 0.32);
    const merged = mergeGeos([a1, a2]); arm.dispose(); a1.dispose(); a2.dispose();
    chevGeo.copy(merged); merged.dispose();
  }
  owned.push(chevGeo);
  const inst = new THREE.InstancedMesh(chevGeo, mag, nG); inst.name = 'grousers';
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < nG; i++) {
    const a = (i / nG) * Math.PI * 2;
    q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), a);
    const p = new THREE.Vector3(0, R - 0.42, 0).applyQuaternion(q);
    m4.compose(p, q, s); inst.setMatrixAt(i, m4);
  }
  rotor.add(inst);
  // web: disc with 6 triangular windows (6 spokes), extruded along X
  const shape = new THREE.Shape(); const rw = R - rimT + 0.05;
  shape.absarc(0, 0, rw, 0, Math.PI * 2, false);
  const hubR = 2.6;
  for (let i = 0; i < 6; i++) {
    const a0 = (i / 6) * Math.PI * 2 + Math.PI / 6, spoke = 0.62;   // half angular width of a spoke at the rim
    const hole = new THREE.Path();
    const r0 = hubR + 1.0, r1 = rw - 1.0;
    const pA = [r0 * Math.cos(a0), r0 * Math.sin(a0)];
    const da = (Math.PI / 3) / 2 - spoke * 0.35;
    const pB = [r1 * Math.cos(a0 - da), r1 * Math.sin(a0 - da)];
    const pC = [r1 * Math.cos(a0 + da), r1 * Math.sin(a0 + da)];
    hole.moveTo(...pA); hole.lineTo(...pB);
    hole.absarc(0, 0, r1, a0 - da, a0 + da, false);
    hole.lineTo(...pA);
    shape.holes.push(hole);
  }
  const webGeo = new THREE.ExtrudeGeometry(shape, { depth: 1.6, bevelEnabled: true, bevelThickness: 0.25, bevelSize: 0.22, bevelSegments: 3, curveSegments: 48 });
  webGeo.translate(0, 0, -0.8); webGeo.rotateY(Math.PI / 2); owned.push(webGeo);
  const web = new THREE.Mesh(webGeo, mag); web.name = 'web'; rotor.add(web);
  const hubGeo = new THREE.CylinderGeometry(hubR, hubR, W - 1.2, 48); hubGeo.rotateZ(Math.PI / 2); owned.push(hubGeo);
  const hub = new THREE.Mesh(hubGeo, mag); hub.name = 'hub'; rotor.add(hub);
  const axGeo = new THREE.CylinderGeometry(1.0, 1.0, W + 4.2, 32); axGeo.rotateZ(Math.PI / 2); owned.push(axGeo);
  const axle = new THREE.Mesh(axGeo, pom); axle.name = 'axle'; rotor.add(axle);
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  g.userData.parts = { wheel: rotor, tread: rim, grousers: inst, web, hub, axle };
  g.userData.spec = { diameter: D, width: W, axleHeight: H, grousers: nG, label: 'proposal (stand-in for parts/buildScrollWheel)' };
  g.setScroll = (rad) => { rotor.rotation.x = -rad; return {}; };   // + = top of wheel moves toward +Z
  g.setExplode = () => {}; g.setXray = () => {};
  g.dispose = () => { owned.forEach(o => o.dispose()); };
  return g;
}

/** POM dot skate stand-in. */
export function buildDotSkate(opts = {}) {
  const d = opts.diameter ?? 6.5, h = opts.height ?? 0.65, r = d / 2;
  const mat = (opts.materials && opts.materials.pom) || new THREE.MeshPhysicalMaterial({ color: 0xf1efe8, roughness: 0.38, sheen: 0.3 });
  const prof = [[0, 0], [r - 0.35, 0], [r - 0.12, 0.06], [r, 0.25], [r, h], [0, h]];
  const geo = lathe(prof, 64);
  const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true;
  const g = new THREE.Group(); g.add(m); g.userData.standIn = true; g.userData.parts = { glide: m };
  g.setExplode = () => {}; g.dispose = () => geo.dispose();
  return g;
}

/** M2 screw stand-in: low wafer head with a Phillips/slot combination recess (#9), brass-plated. */
export function buildM2Screw(opts = {}) {
  const mat = (opts.materials && opts.materials.brass) || new THREE.MeshPhysicalMaterial({ color: 0xcfae62, metalness: 1, roughness: 0.3 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2a2116, roughness: 0.7, metalness: 0.3 });
  const k = opts.headHeight ?? 0.9, dk = 3.8, L = opts.length ?? 4;
  // API frame: origin = bearing face, head above (+Y), shank below (-Y)
  const prof = [[0, k], [dk / 2 - 0.35, k], [dk / 2, k * 0.45], [dk / 2, 0.02], [1.0, 0], [0, 0]];
  const head = lathe(prof, 48);
  const shank = new THREE.CylinderGeometry(0.95, 0.95, L, 24); shank.translate(0, -L / 2, 0);
  const slot = new THREE.BoxGeometry(dk * 0.86, 0.06, 0.42); slot.translate(0, k + 0.031, 0);
  const cross = new THREE.BoxGeometry(0.42, 0.06, 1.9); cross.translate(0, k + 0.031, 0);
  const g = new THREE.Group(); g.userData.standIn = true;
  const mh = new THREE.Mesh(head, mat), ms = new THREE.Mesh(shank, mat), m1 = new THREE.Mesh(slot, dark), m2 = new THREE.Mesh(cross, dark);
  [mh, ms, m1, m2].forEach(m => { m.castShadow = true; g.add(m); });
  g.userData.parts = { head: mh, shank: ms };
  g.setExplode = () => {}; g.dispose = () => { [head, shank, slot, cross].forEach(x => x.dispose()); dark.dispose(); };
  return g;
}

function mergeGeos(list) {
  // minimal non-indexed merge (positions + normals)
  const parts = list.map(gg => gg.index ? gg.toNonIndexed() : gg);
  let n = 0; parts.forEach(p => n += p.attributes.position.count);
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3);
  let o = 0;
  parts.forEach(p => { pos.set(p.attributes.position.array, o * 3); nor.set(p.attributes.normal.array, o * 3); o += p.attributes.position.count; });
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  parts.forEach((p, i) => { if (p !== list[i]) p.dispose(); });
  return out;
}
