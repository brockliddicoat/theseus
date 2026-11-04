// Theseus internal structure: the shell wall, the filleted triangle lattice, arches, struts, bosses, PCB ties.
// mm; +Y up, +Z forward; the scan's side-button side is +X (see README: the scan is right-handed, so +X is the
// user's left; CONVENTIONS.md says "+X = user's right", which is the mirrored, left-handed reading).
//
//   import { buildLattice } from '../lattice/lattice.js';
//   const g = buildLattice({ materials: M });          // M = materials() from lib/studio.js (optional)
//   await g.userData.ready;                            // geometry streams from ./assets/*.bin
//   g.setCut(1); g.setBuild(0.4); g.setStress(1, 'press'); g.setCompare('hex'); g.setFilletZoom(1);
//
// Setters are pure functions of their arguments (k clamped to [0, 1]); they can be called before the data has
// loaded and are applied on arrival. dispose() frees everything this builder created.
import * as THREE from 'three';

const ASSETS = new URL('./assets/', import.meta.url).href;
const clamp01 = k => Math.min(1, Math.max(0, +k || 0));
const ease = k => k * k * (3 - 2 * k);

// stress ramp: one hue (the deck's accent), receding to the raw CF-PP tone at zero (sequential, lightness-monotonic)
const RAMP = ['#26272b', '#5b4314', '#a8730b', '#fdc316', '#fff2c2'];

async function fetchBin(url) { const r = await fetch(url); if (!r.ok) throw new Error(url + ' ' + r.status); return r.arrayBuffer(); }
function view(buf, it) {
  const T = { f32: Float32Array, i16: Int16Array, i8: Int8Array, u8: Uint8Array, u16: Uint16Array, u32: Uint32Array }[it.type];
  return new T(buf, it.offset, it.count * it.itemSize);
}
function geometryFrom(buf, items, name) {
  const g = new THREE.BufferGeometry();
  const it = k => items[name + '.' + k];
  g.setAttribute('position', new THREE.BufferAttribute(view(buf, it('position')), 3));
  g.setAttribute('normal', new THREE.BufferAttribute(view(buf, it('normal')), 3, true));
  for (const [k, n] of [['aEta', 1], ['aWallN', 3], ['aOrder', 1], ['aOuter', 1], ['aSP', 1], ['aSS', 1]])
    if (it(k)) g.setAttribute(k, new THREE.BufferAttribute(view(buf, it(k)), n, true));
  g.setIndex(new THREE.BufferAttribute(view(buf, it('index')), 1));
  g.computeBoundingSphere(); g.computeBoundingBox();
  return g;
}

/** the shared shader patch: rib growth (setBuild), coated-vs-raw interior, stress colour, macro-patch window */
function patchShell(mat, U, { cap = false, patch = false } = {}) {
  mat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
        attribute float aEta; attribute vec3 aWallN; attribute float aOrder; attribute float aOuter; attribute float aSP; attribute float aSS;
        uniform float uBuild; uniform float uBuildWin; uniform float uCase;
        varying float vOuter; varying float vStress; varying vec3 vLocal;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        float gk = clamp((uBuild * (1.0 + uBuildWin) - aOrder) / uBuildWin, 0.0, 1.0); gk = gk * gk * (3.0 - 2.0 * gk);
        transformed -= aWallN * (aEta * 8.0) * (1.0 - gk);
        vOuter = aOuter; vStress = mix(aSP, aSS, uCase); vLocal = position;`);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform float uStressK; uniform vec3 uRamp[5]; uniform vec3 uInterior; uniform vec3 uCap; uniform float uPatchK; uniform vec3 uBoxMin; uniform vec3 uBoxMax; uniform float uIsPatch;
        varying float vOuter; varying float vStress; varying vec3 vLocal;
        vec3 rampAt(float s) { s = clamp(s, 0.0, 1.0) * 4.0; int i = int(min(floor(s), 3.0)); float f = s - float(i);
          vec3 a = uRamp[0], b = uRamp[1];
          if (i == 1) { a = uRamp[1]; b = uRamp[2]; } else if (i == 2) { a = uRamp[2]; b = uRamp[3]; } else if (i == 3) { a = uRamp[3]; b = uRamp[4]; }
          return mix(a, b, f); }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        ${patch ? '' : `if (uPatchK > 0.5 && all(greaterThan(vLocal, uBoxMin)) && all(lessThan(vLocal, uBoxMax))) discard;`}
        ${cap ? `diffuseColor.rgb = mix(uCap, vec3(0.55), uStressK);` : `
        vec3 baseC = mix(uInterior, diffuseColor.rgb, vOuter);
        bool nodata = vStress > 0.998;
        vec3 sc = nodata ? baseC * 0.55 : rampAt(vStress * 255.0 / 254.0);
        diffuseColor.rgb = mix(baseC, sc, uStressK);`}`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        ${cap ? 'totalEmissiveRadiance += mix(uCap, vec3(0.42), uStressK) * 0.55;' : 'if (vStress <= 0.998) totalEmissiveRadiance += rampAt(vStress * 255.0 / 254.0) * 0.38 * uStressK;'}`);
  };
  mat.customProgramCacheKey = () => 'theseus-lattice-' + (cap ? 'cap' : '') + (patch ? 'patch' : '') + 'v1';
  return mat;
}

function insertGeometry(od = 3.5, len = 3.0, bore = 1.6) {
  // M2 heat-set insert stand-in (parts builder API: buildHeatSetInsert({length: 3.0, od: 3.5})): two knurl bands
  const r = od / 2, pts = [];
  const prof = [[bore, 0], [r - 0.18, 0], [r - 0.18, 0.25], [r, 0.4], [r, 1.1], [r - 0.3, 1.3], [r - 0.3, 1.7], [r, 1.9], [r, 2.6], [r - 0.18, 2.8], [r - 0.18, len], [bore, len], [bore, 0]];
  for (const [x, y] of prof) pts.push(new THREE.Vector2(x, -y));
  const g = new THREE.LatheGeometry(pts, 40);
  // diagonal knurl on the bands
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), rr = Math.hypot(x, z);
    if (rr > r - 0.05) { const a = Math.atan2(z, x); const k = 0.06 * Math.sign(Math.sin(a * 18 + y * 9)); p.setX(i, x * (1 + k / rr)); p.setZ(i, z * (1 + k / rr)); }
  }
  g.computeVertexNormals();
  return g;
}

export function buildLattice(opts = {}) {
  const group = new THREE.Group(); group.name = 'theseus-lattice';
  const parts = {}; group.userData.parts = parts;
  const disposables = [];
  const M = opts.materials || {};
  const state = { cut: 0, cutMode: opts.cutMode || 'half', build: 1, stress: 0, case: 'press', compare: 'tri', fillet: 0, flow: 0, pcb: 0.85, triggers: 1, ghost: 0 };
  const U = {
    uBuild: { value: 1 }, uBuildWin: { value: 0.09 }, uCase: { value: 0 }, uStressK: { value: 0 },
    uRamp: { value: RAMP.map(c => new THREE.Color(c)) }, uInterior: { value: new THREE.Color(opts.interior || 0x1f2023) },
    uCap: { value: new THREE.Color(opts.capColor || 0xfdc316) }, uPatchK: { value: 0 }, uBoxMin: { value: new THREE.Vector3() }, uBoxMax: { value: new THREE.Vector3() }, uIsPatch: { value: 0 },
  };
  // clipping: planes live in each variant's local frame and are re-expressed in world space every frame,
  // so the deck can move the group (and 'both' puts the two lattices side by side, each cut on its own midplane)
  const localPlanes = [new THREE.Plane(new THREE.Vector3(1, 0, 0), 1e4), new THREE.Plane(new THREE.Vector3(0, -1, 0), -1e4)];
  const baseCoat = (M.shell ? M.shell.clone() : new THREE.MeshPhysicalMaterial({ color: 0x111214, roughness: 0.62, clearcoat: 0.25, clearcoatRoughness: 0.55 }));
  baseCoat.color.set(opts.coatColor || 0x0a0b0c); baseCoat.roughness = 0.55; baseCoat.envMapIntensity = 0.55;
  baseCoat.sheen = 0.15; baseCoat.clearcoat = 0.18; baseCoat.clearcoatRoughness = 0.5; disposables.push(baseCoat);
  function materialSet(owner) {
    const planes = localPlanes.map(p => p.clone());
    const update = () => { owner.updateWorldMatrix(true, false); localPlanes.forEach((p, i) => planes[i].copy(p).applyMatrix4(owner.matrixWorld)); };
    const coat = baseCoat.clone(); coat.clippingPlanes = planes; coat.clipIntersection = true; coat.clipShadows = true; coat.side = THREE.FrontSide;
    patchShell(coat, U);
    const cap = patchShell(new THREE.MeshStandardMaterial({ color: 0xfdc316, roughness: 1.0, envMapIntensity: 0.3, side: THREE.BackSide, clippingPlanes: planes, clipIntersection: true }), U, { cap: true });
    const patch = patchShell(baseCoat.clone(), U, { patch: true });
    const patchCap = patchShell(new THREE.MeshStandardMaterial({ color: 0xfdc316, roughness: 1.0, envMapIntensity: 0.3, side: THREE.BackSide, clippingPlanes: planes, clipIntersection: true }), U, { cap: true, patch: true });
    patch.clippingPlanes = planes; patch.clipIntersection = true; patch.clipShadows = true; patch.polygonOffset = true; patch.polygonOffsetFactor = -1; patch.polygonOffsetUnits = -2;
    disposables.push(coat, cap, patch, patchCap);
    return { planes, update, coat, cap, patch, patchCap };
  }

  const variants = {};
  function addVariant(kind, buf, man) {
    const vg = new THREE.Group(); vg.name = 'lattice-' + kind;
    const meshes = {}; const ms = materialSet(vg); vg.userData.mats = ms;
    for (const part of ['body', 'trigL', 'trigR']) {
      const geo = geometryFrom(buf, man[kind].items, `${kind}_${part}`); disposables.push(geo);
      const m = new THREE.Mesh(geo, ms.coat); m.castShadow = true; m.receiveShadow = true; m.name = `${kind}-${part}`;
      const c = new THREE.Mesh(geo, ms.cap); c.name = `${kind}-${part}-cap`;
      m.onBeforeRender = (r) => { r.localClippingEnabled = true; ms.update(); };
      vg.add(m, c); meshes[part] = m; meshes[part + 'Cap'] = c;
    }
    // force-flow segments (FE axial force along the ribs)
    vg.userData.flow = {};
    for (const cs of ['press', 'squeeze']) {
      const it = man[kind].items[`flow_${kind}_${cs}`]; if (!it) continue;
      vg.userData.flow[cs] = view(buf, it);
    }
    variants[kind] = { group: vg, meshes };
    group.add(vg);
    parts[kind] = vg; parts[kind + 'Meshes'] = meshes;
  }

  // ---- flow lines: instanced capsules with travelling pulses (compression = load path through the arches)
  // white so the load path never reads as a stress level (the stress ramp is the accent hue)
  const flowU = { uTime: { value: 0 }, uFlowK: { value: 0 }, uColor: { value: new THREE.Color(opts.flowColor || 0xf4f7ff) }, uSrc: { value: new THREE.Vector3() } };
  function buildFlow(seg, layout, planes) {
    const n = seg.length / 7, keep = [];
    let nmax = 0; for (let i = 0; i < n; i++) nmax = Math.max(nmax, -seg[i * 7 + 6]);
    for (let i = 0; i < n; i++) if (-seg[i * 7 + 6] > 0.18 * nmax) keep.push(i);
    const geo = new THREE.CylinderGeometry(1, 1, 1, 8, 1, true); geo.translate(0, 0.5, 0);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, clippingPlanes: planes, clipIntersection: true });
    const inst = new THREE.InstancedMesh(geo, mat, keep.length);
    const mag = new Float32Array(keep.length), dist = new Float32Array(keep.length);
    const a = new THREE.Vector3(), b = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0), m4 = new THREE.Matrix4();
    const src = new THREE.Vector3(...layout.crown);
    keep.forEach((i, j) => {
      a.set(seg[i * 7], seg[i * 7 + 1], seg[i * 7 + 2]); b.set(seg[i * 7 + 3], seg[i * 7 + 4], seg[i * 7 + 5]);
      const d = b.clone().sub(a), L = d.length(); q.setFromUnitVectors(Y, d.normalize());
      const k = -seg[i * 7 + 6] / nmax; mag[j] = k; dist[j] = a.distanceTo(src);
      s.set(0.22 + 0.5 * k, L, 0.22 + 0.5 * k); m4.compose(a, q, s); inst.setMatrixAt(j, m4);
    });
    geo.setAttribute('iMag', new THREE.InstancedBufferAttribute(mag, 1)); geo.setAttribute('iDist', new THREE.InstancedBufferAttribute(dist, 1));
    mat.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, flowU);
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float iMag; attribute float iDist; varying float vMag; varying float vD;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvMag = iMag; vD = iDist + position.y * 0.0;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uTime; uniform float uFlowK; uniform vec3 uColor; varying float vMag; varying float vD;')
        .replace('#include <color_fragment>', `#include <color_fragment>
          float ph = fract(vD / 9.0 - uTime * 0.8);                         // pulses leave the finger, run down the arches
          float pulse = 0.35 + 0.65 * smoothstep(0.0, 0.25, ph) * (1.0 - smoothstep(0.25, 0.75, ph));
          diffuseColor.rgb = uColor * (0.55 + 1.6 * vMag) * (0.45 + 0.9 * pulse);
          diffuseColor.a = uFlowK * (0.35 + 0.65 * vMag);`);
    };
    disposables.push(geo, mat);
    inst.frustumCulled = false; inst.renderOrder = 5;
    return inst;
  }

  // ---- context: inserts, PCB stand-in + tie points, skates
  function addContext(layout) {
    const worldPlanes = variants.tri.group.userData.mats.planes;
    const clipIt = m => { m.clippingPlanes = worldPlanes; m.clipIntersection = true; m.clipShadows = true; disposables.push(m); return m; };
    const brass = clipIt((M.brass || new THREE.MeshPhysicalMaterial({ color: 0xd2b061, metalness: 1, roughness: 0.3 })).clone());
    const ig = insertGeometry(); disposables.push(ig);
    const inserts = new THREE.Group(); inserts.name = 'inserts';
    for (const b of layout.bosses) {
      const m = new THREE.Mesh(ig, brass); m.position.set(b.x, b.y0 + 0.05 + 3.0, b.z); m.castShadow = true; inserts.add(m);
    }
    group.add(inserts); parts.inserts = inserts;
    // PCB stand-in (the PCB builder owns the real board): FR4 slab whose edge bears on the rib feet (#94)
    const ol = layout.pcb.outline; const shape = new THREE.Shape(ol.map(([x, z]) => new THREE.Vector2(x, -z)));
    for (const [x, z] of layout.pcb.holes) { const h = new THREE.Path(); h.absarc(x, -z, 1.15, 0, Math.PI * 2, true); shape.holes.push(h); }
    const pg = new THREE.ExtrudeGeometry(shape, { depth: layout.pcb.t, bevelEnabled: false, curveSegments: 24 });
    pg.rotateX(-Math.PI / 2); pg.translate(0, layout.pcb.y0, 0); disposables.push(pg);
    const pm = new THREE.MeshPhysicalMaterial({ color: 0x1a3a2a, roughness: 0.5, transparent: true, opacity: 0.55, depthWrite: false, clippingPlanes: worldPlanes, clipIntersection: true });
    const pcb = new THREE.Mesh(pg, pm); pcb.name = 'pcb-standin'; pcb.renderOrder = 2;
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(pg, 30), new THREE.LineBasicMaterial({ color: 0x6fae86, transparent: true, opacity: 0.8, clippingPlanes: worldPlanes, clipIntersection: true }));
    disposables.push(pm, edge.geometry, edge.material);
    const pcbG = new THREE.Group(); pcbG.add(pcb, edge); group.add(pcbG); parts.pcb = pcbG;
    // tie points: the side ribs land on the board edge (yellow), bosses ringed
    const tg = new THREE.Group(); tg.name = 'ties';
    const tieGeo = new THREE.TorusGeometry(0.75, 0.22, 10, 28); const tieMat = clipIt(new THREE.MeshStandardMaterial({ color: 0xfdc316, emissive: 0xfdc316, emissiveIntensity: 0.35, roughness: 0.4 }));
    disposables.push(tieGeo, tieMat);
    for (const t of layout.ties) {
      if (!t.p.every(Number.isFinite)) continue;
      const m = new THREE.Mesh(tieGeo, tieMat); m.position.set(t.p[0], layout.pcb.y0 + layout.pcb.t + 0.25, t.p[2]); m.rotation.x = Math.PI / 2; tg.add(m);
    }
    group.add(tg); parts.ties = tg;
    // dot skates (8, two per corner, #10): stand-in for parts/buildDotSkateSet
    const sk = new THREE.Group(); sk.name = 'skates';
    const sg = new THREE.CylinderGeometry(layout.skate_d / 2, layout.skate_d / 2, layout.skate_h, 40); sg.translate(0, layout.skate_h / 2 + 0.03, 0);
    const smat = clipIt((M.pom || new THREE.MeshPhysicalMaterial({ color: 0xf1f0ea, roughness: 0.42 })).clone()); disposables.push(sg);
    for (const [x, z] of layout.skates) { const m = new THREE.Mesh(sg, smat); m.position.set(x, 0, z); sk.add(m); }
    group.add(sk); parts.skates = sk;
  }

  // ---- interior lights: the studio key comes from above, so the inside of a cutaway only sees the IBL.
  // These are owned by the asset and scale with its state (setCut / setFilletZoom / setUnderLight); setLights(0) mutes them.
  const lights = new THREE.Group(); lights.name = 'interior-lights';
  const Lcut = new THREE.PointLight(0xfff6ea, 0, 0, 2); Lcut.position.set(-16, 22, -6);
  const Lcut2 = new THREE.PointLight(0xeaf0ff, 0, 0, 2); Lcut2.position.set(-14, 12, 30);
  const Lmac = new THREE.SpotLight(0xffffff, 0, 0, Math.PI / 7, 0.65, 2);
  const Lund = new THREE.PointLight(0xffffff, 0, 0, 2); Lund.position.set(-12, -30, 18);
  lights.add(Lcut, Lcut2, Lmac, Lmac.target, Lund); group.add(lights); parts.lights = lights;
  let lightK = opts.lights ?? 1;
  function applyLights() {
    const c = ease(clamp01(state.cut)), f = ease(clamp01(state.fillet));
    Lcut.intensity = lightK * 900 * c * (1 - 0.6 * f); Lcut2.intensity = lightK * 500 * c * (1 - f);
    Lmac.intensity = lightK * 2600 * f; Lund.intensity = lightK * 5200 * (state.under || 0);
    const fl = group.userData.fillet;
    if (fl) { Lmac.position.set(...fl.light.position); Lmac.target.position.set(...fl.node); }
  }
  group.setLights = (k) => { lightK = Math.max(0, +k || 0); applyLights(); return group; };
  group.setUnderLight = (k) => { state.under = clamp01(k); applyLights(); return group; };

  // ---- fillet macro: high-resolution patch around one node (swapped in by setFilletZoom)
  function addPatch(buf, man, info) {
    const geo = geometryFrom(buf, man.items, 'patch'); disposables.push(geo);
    const ms = variants.tri.group.userData.mats;
    const m = new THREE.Mesh(geo, ms.patch); m.name = 'fillet-patch'; m.visible = false; m.castShadow = true; m.receiveShadow = false;   // shadow-map texels are ~0.1 mm: acne at macro scale
    const c = new THREE.Mesh(geo, ms.patchCap); c.visible = false;
    m.onBeforeRender = (r) => { r.localClippingEnabled = true; ms.update(); };
    variants.tri.group.add(m, c); parts.filletPatch = m; parts.filletPatchCap = c;
    U.uBoxMin.value.set(...info.box[0]).addScalar(0.18); U.uBoxMax.value.set(...info.box[1]).addScalar(-0.18);
    // section marks: the true rib profile (root fillets) and the node outline at mid-height, traced from the patch
    const marks = new THREE.Group(); marks.name = 'fillet-marks'; marks.visible = false;
    const mm = new THREE.MeshBasicMaterial({ color: opts.markColor || 0xfdc316, clippingPlanes: ms.planes, clipIntersection: true }); disposables.push(mm);
    for (const pl of info.marks || []) {
      if (pl.length < 2) continue;
      const curve = new THREE.CatmullRomCurve3(pl.map(p => new THREE.Vector3(...p)));
      const tg = new THREE.TubeGeometry(curve, Math.max(8, pl.length * 3), 0.022, 6, false); disposables.push(tg);
      marks.add(new THREE.Mesh(tg, mm));
    }
    variants.tri.group.add(marks); parts.filletMarks = marks;
  }

  // ---------------- setters ----------------
  function applyCut() {
    const k = ease(clamp01(state.cut)), mode = state.cutMode;
    // 'half': a vertical plane sweeps from the -X side to the midplane; 'quarter': same, keeping the rim band (y < 9)
    // 'top': a horizontal plane sweeps down to 60 % height
    if (k <= 0) { localPlanes[0].set(new THREE.Vector3(1, 0, 0), 1e4); localPlanes[1].set(new THREE.Vector3(0, -1, 0), -1e4); return; }
    if (mode === 'top') {
      localPlanes[0].set(new THREE.Vector3(0, -1, 0), THREE.MathUtils.lerp(40, 23, k)); localPlanes[1].set(new THREE.Vector3(0, -1, 0), THREE.MathUtils.lerp(40, 23, k));
    } else {
      const x0 = THREE.MathUtils.lerp(-33, state.cutX ?? 0, k);
      localPlanes[0].set(new THREE.Vector3(1, 0, 0), -x0);                 // clipped where x < x0
      localPlanes[1].set(new THREE.Vector3(0, -1, 0), mode === 'quarter' ? 9.0 : -1e4);  // and (quarter) y > 9; (half) always
    }
  }
  group.setCut = (k, o = {}) => { state.cut = clamp01(k); if (o.mode) state.cutMode = o.mode; if (o.x !== undefined) state.cutX = o.x; applyCut(); applyLights(); return group; };
  group.setBuild = (k) => { state.build = clamp01(k); U.uBuild.value = state.build;
    // context parts follow the build: inserts last, PCB/ties after the side ribs
    if (parts.inserts) parts.inserts.visible = state.build > 0.985;
    return group; };
  group.setStress = (k, cs) => { state.stress = clamp01(k); if (cs) state.case = cs; U.uStressK.value = state.stress; U.uCase.value = state.case === 'squeeze' ? 1 : 0;
    flowU.uFlowK.value = Math.max(state.flow, 0); applyFlow(); return group; };
  group.setFlow = (k, cs) => { state.flow = clamp01(k); if (cs) state.case = cs; flowU.uFlowK.value = state.flow; applyFlow(); return group; };
  group.setCompare = (mode = 'tri') => { state.compare = mode; applyCompare(); return group; };
  group.setFilletZoom = (k) => { state.fillet = clamp01(k); applyFillet(); return group; };
  group.setPcb = (k) => { state.pcb = clamp01(k); applyContext(); return group; };
  group.setTriggers = (k) => { state.triggers = clamp01(k); applyContext(); return group; };
  group.setTime = (t) => { flowU.uTime.value = t; return group; };

  function applyCompare() {
    const both = state.compare === 'both', gap = opts.compareGap ?? 72;
    for (const [k, v] of Object.entries(variants)) {
      v.group.visible = both || state.compare === k;
      v.group.position.x = both ? (k === 'tri' ? -gap / 2 : gap / 2) : 0;
    }
    for (const n of ['inserts', 'pcb', 'ties', 'skates']) if (parts[n]) parts[n].visible = !both && (n !== 'inserts' || state.build > 0.985) && (n === 'skates' || n === 'inserts' || state.pcb > 0.02);
    applyFlow(); applyContext();
  }
  function applyFlow() {
    for (const [k, v] of Object.entries(variants)) {
      for (const c of ['press', 'squeeze']) { const f = v.group.userData['flowMesh_' + c]; if (f) f.visible = state.flow > 0.001 && state.case === c; }
    }
  }
  function applyContext() {
    if (parts.pcb) { parts.pcb.visible = state.pcb > 0.02 && state.compare !== 'both'; parts.pcb.children[0].material.opacity = 0.55 * state.pcb; parts.pcb.children[1].material.opacity = 0.8 * state.pcb; }
    if (parts.ties) parts.ties.visible = state.pcb > 0.02 && state.compare !== 'both';
    for (const v of Object.values(variants)) for (const p of ['trigL', 'trigR']) { v.meshes[p].visible = state.triggers > 0.5; v.meshes[p + 'Cap'].visible = state.triggers > 0.5; }
  }
  function applyFillet() {
    const on = state.fillet > 0.001 && parts.filletPatch;
    U.uPatchK.value = on ? 1 : 0;
    if (parts.filletPatch) { parts.filletPatch.visible = !!on; parts.filletPatchCap.visible = !!on; }
    if (parts.filletMarks) parts.filletMarks.visible = state.fillet > 0.6 && state.marks === true;
    applyLights();
  }
  group.setFilletMarks = (on) => { state.marks = !!on; applyFillet(); return group; };
  /** camera for the fillet macro: lerp from `from` ({position, target, fov}) to the macro pose by k (eased) */
  group.getFilletCamera = (k, from) => {
    const f = group.userData.fillet; if (!f) return null;
    const e = ease(clamp01(k)), to = f.camera;
    const L = (a, b) => a.map((v, i) => v + (b[i] - v) * e);
    const fromP = from || to;
    const toWorld = v => new THREE.Vector3(...v).applyMatrix4(group.matrixWorld);
    return { position: toWorld(L(fromP.position, to.position)), target: toWorld(L(fromP.target, to.target)), fov: fromP.fov + (to.fov - fromP.fov) * e };
  };

  group.userData.ready = (async () => {
    const man = await (await fetch(ASSETS + 'lattice.json')).json();
    group.userData.manifest = man; group.userData.layout = man.layout; group.userData.fe = man.fe; group.userData.stressScale = man.stressScale;
    group.userData.fillet = man.fillet;
    const [bt, bh, bp] = await Promise.all([fetchBin(ASSETS + man.tri.file), fetchBin(ASSETS + man.hex.file), man.patch ? fetchBin(ASSETS + man.patch.file) : null]);
    addVariant('tri', bt, man); addVariant('hex', bh, man);
    for (const [k, v] of Object.entries(variants)) for (const c of ['press', 'squeeze']) {
      const seg = v.group.userData.flow[c]; if (!seg) continue;
      const f = buildFlow(seg, { crown: man.fe.crown }, v.group.userData.mats.planes); f.visible = false; v.group.add(f); v.group.userData['flowMesh_' + c] = f;
    }
    addContext(man.layout);
    if (bp) addPatch(bp, man.patch, man.fillet);
    applyCut(); group.setBuild(state.build); group.setStress(state.stress, state.case); applyCompare(); applyFillet(); applyLights();
    return group;
  })();

  group.dispose = () => { for (const d of disposables) d.dispose && d.dispose(); group.clear(); };
  return group;
}

export default buildLattice;
