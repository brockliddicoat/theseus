// Theseus main PCB — builder + state setters for the deck timeline.
//
//   import { buildPcb } from './pcb/pcb.js';
//   const pcb = await buildPcb({ placement: 'mouse' });   // THREE.Group (mm, mouse frame)
//   scene.add(pcb);
//   pcb.userData.setExplode(0.6);      // 0..1  components lift off in layers
//   pcb.userData.setPower(1, { mode: 'charge', t: 2.4 });   // animated current flow ('charge' | 'run' | 'both')
//   pcb.userData.setReflow(0.5);       // 0..1  single heat front sweeps the board once; joints settle
//   pcb.userData.setXray(0.8);         // 0..1  mask turns translucent: traces + inner layers
//   pcb.userData.setPress('L', 1);     // GT01 plunger (representative travel 0.35 mm, see README)
//   pcb.userData.dispose();
//
// Frame (same as the shell/scan, physically right-handed): +X = side-button side = the USER'S LEFT, +Y up,
// +Z forward (nose). Board top copper at local y = 0. placement:'mouse' puts the board top at y = 5.03 and shifts it
// -2.88 mm in z so the encoder axle meets the shell's wheel centre (0, 17.03, 34.87); placement:'origin' centres it.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const HERE = new URL('.', import.meta.url).href;

export const PCB_INFO = {
  thickness: 1.0,
  boardTopYInMouse: 5.03,      // = shell wheel centre y 17.03 - parts axleHeight 12
  boardOffsetZInMouse: -2.88,  // aligns the encoder/bracket axle (layout z 37.75) with the shell wheel centre z 34.87
  layers: ['board', 'passives', 'pmic', 'module', 'sensor', 'lens', 'sockets', 'switches', 'mechanics', 'wheel', 'connectors', 'wires'],
};

// explode targets (mm at k = 1) and cascade order
const EXPLODE = {
  board: { y: 0, delay: 0 },
  passives: { y: 4.5, delay: 0.10 },
  pmic: { y: 8.0, delay: 0.16 },
  sensor: { y: 6.5, delay: 0.20 },
  lens: { y: -7.0, delay: 0.20 },
  module: { y: 12.5, delay: 0.24 },
  sockets: { y: 3.0, delay: 0.30 },
  switches: { y: 15.0, delay: 0.34 },
  mechanics: { y: 10.0, delay: 0.28 },
  wheel: { y: 22.0, delay: 0.40 },
  connectors: { y: 7.0, delay: 0.26 },
  wires: { y: 7.0, delay: 0.26 },
};

function smooth(t) { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); }

/**
 * Physically-based materials calibrated for the studio IBL (black mask must read black, gold must read ENIG).
 * envMapIntensity here is RELATIVE to scene.environmentIntensity: three.js ignores a material's envMapIntensity when it
 * falls back to scene.environment, so bindEnvironment() hands each material the scene environment explicitly at render
 * time and sets envMapIntensity = envK * scene.environmentIntensity.
 */
export function pcbMaterials() {
  const P = (o) => new THREE.MeshPhysicalMaterial(o);
  return {
    mask: P({ color: 0x030304, roughness: 0.5, metalness: 0, clearcoat: 0.0, envMapIntensity: 0.05, specularIntensity: 0.5 }),
    mask_cu: P({ color: 0x060709, roughness: 0.42, metalness: 0, clearcoat: 0.0, envMapIntensity: 0.075, specularIntensity: 0.65 }),
    enig: P({ color: 0xe2a43e, roughness: 0.3, metalness: 1, envMapIntensity: 0.82 }),
    edge_gold: P({ color: 0xdc9f39, roughness: 0.26, metalness: 1, envMapIntensity: 0.8 }),
    silk: P({ color: 0xeeeeea, roughness: 0.82, metalness: 0, envMapIntensity: 0.6 }),
    fr4: P({ color: 0x4c4632, roughness: 0.85, metalness: 0, envMapIntensity: 0.5 }),
    cu_inner: P({ color: 0xd9925f, roughness: 0.32, metalness: 1, side: THREE.DoubleSide, envMapIntensity: 1.0 }),
    solder: P({ color: 0xdcdee2, roughness: 0.14, metalness: 1, envMapIntensity: 1.15 }),
    epoxy: P({ color: 0x0b0b0c, roughness: 0.62, metalness: 0, clearcoat: 0.08, clearcoatRoughness: 0.6, envMapIntensity: 0.34 }),
    laser: P({ color: 0x55565a, roughness: 0.8, metalness: 0, envMapIntensity: 0.45 }),
    ceramic: P({ color: 0x9b8566, roughness: 0.62, metalness: 0, envMapIntensity: 0.6 }),
    tin: P({ color: 0xc9cbce, roughness: 0.32, metalness: 1, envMapIntensity: 1.0 }),
    nickel: P({ color: 0xc6c5bf, roughness: 0.30, metalness: 1, envMapIntensity: 1.0 }),
    steel: P({ color: 0xd3d6da, roughness: 0.19, metalness: 1, envMapIntensity: 1.1 }),
    black_plastic: P({ color: 0x0a0a0c, roughness: 0.6, metalness: 0, envMapIntensity: 0.4 }),
    white_plastic: P({ color: 0xe9e4d8, roughness: 0.48, metalness: 0, sheen: 0.2, sheenRoughness: 0.6, envMapIntensity: 0.75 }),
    blue_plastic: P({ color: 0x2c6cc9, roughness: 0.42, metalness: 0, envMapIntensity: 0.7 }),
    module_pcb: P({ color: 0x163a8a, roughness: 0.36, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.2, envMapIntensity: 0.6 }),
    ferrite: P({ color: 0x151517, roughness: 0.7, metalness: 0.05, envMapIntensity: 0.38 }),
    label: P({ color: 0xf2f2ee, roughness: 0.6, metalness: 0, envMapIntensity: 0.6 }),
    clear: P({ color: 0xffffff, roughness: 0.05, metalness: 0, transmission: 0.92, thickness: 1.2, ior: 1.58, transparent: true, envMapIntensity: 1.0 }),
    wire_red: P({ color: 0x9e1510, roughness: 0.45, metalness: 0, clearcoat: 0.3, envMapIntensity: 0.6 }),
    wire_black: P({ color: 0x0c0c0d, roughness: 0.45, metalness: 0, clearcoat: 0.3, envMapIntensity: 0.6 }),
    wire_white: P({ color: 0xdedcd6, roughness: 0.45, metalness: 0, clearcoat: 0.3, envMapIntensity: 0.6 }),
    wire_yellow: P({ color: 0xd8a414, roughness: 0.45, metalness: 0, clearcoat: 0.3, envMapIntensity: 0.6 }),
    pom: P({ color: 0xebeae4, roughness: 0.42, metalness: 0, sheen: 0.3, envMapIntensity: 0.7 }),
    rubber: P({ color: 0x0f0f11, roughness: 0.88, metalness: 0, envMapIntensity: 0.5 }),
    gt01_cover: P({ color: 0x1a1a1d, roughness: 0.22, metalness: 0, transmission: 0.35, thickness: 0.6, ior: 1.55, transparent: true, envMapIntensity: 0.9 }),
    kapton: P({ color: 0xd18a1c, roughness: 0.3, metalness: 0, transmission: 0.3, transparent: true, envMapIntensity: 0.8 }),
  };
}

function bindEnvironment(mats) {
  for (const m of mats) {
    if (!m || !m.isMeshStandardMaterial) continue;
    m.userData.envK = m.userData.envK ?? m.envMapIntensity;
    m.onBeforeRender = function (renderer, scene) {
      const env = scene && scene.environment;
      if (!env || !env.isTexture) return;
      if (this.envMap !== env) { this.envMap = env; this.needsUpdate = true; }
      this.envMapIntensity = this.userData.envK * (scene.environmentIntensity ?? 1);
    };
  }
}

// ---------------------------------------------------------------- shader patches (reflow heat front + x-ray)
function patchHeat(mat, U, opts = {}) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uFront = U.front; sh.uniforms.uHeat = U.heat; sh.uniforms.uXray = U.xray;
    sh.uniforms.uSolder = { value: opts.solder ? 1 : 0 };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;\nuniform float uFront;\nuniform float uHeat;\nuniform float uXray;\nuniform float uSolder;')
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        // reflow: behind the front (already passed) the solder is wetted and bright; ahead of it, matte paste
        float passed = smoothstep(0.0, 1.6, vWPos.z * -1.0 + uFront);
        if (uSolder > 0.5 && uHeat > 0.0) { roughnessFactor = mix(0.78, roughnessFactor, passed); }`)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>
        if (uSolder > 0.5 && uHeat > 0.0) { metalnessFactor = mix(0.25, metalnessFactor, passed); }`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        float dz_ = (vWPos.z - uFront) / 2.2; float band = exp(-dz_ * dz_);
        float tz_ = max(vWPos.z - uFront, 0.0); float trail = smoothstep(0.0, 1.0, tz_ / 6.0) * exp(-tz_ / 9.0);
        totalEmissiveRadiance += uHeat * (vec3(1.0, 0.36, 0.08) * band * 0.85 + vec3(1.0, 0.55, 0.2) * trail * 0.18);`);
    if (opts.solder) {
      sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
        if (uHeat > 0.0) { float pas = smoothstep(0.0, 1.6, -vWPos.z + uFront); diffuseColor.rgb = mix(vec3(0.52, 0.53, 0.55), diffuseColor.rgb, pas); }`);
    }
  };
  mat.customProgramCacheKey = () => 'heat' + (opts.solder ? 's' : '');
}

function makeFlowMaterial(color) {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uK: { value: 0 }, uColor: { value: new THREE.Color(color) }, uDim: { value: 1 } },
    vertexShader: `attribute float s; attribute float side; varying float vS; varying float vSide;
      void main(){ vS = s; vSide = side; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform float uTime; uniform float uK; uniform vec3 uColor; uniform float uDim; varying float vS; varying float vSide;
      void main(){
        float edge = 1.0 - smoothstep(0.55, 1.0, abs(vSide));
        float p = fract(vS / 3.2 - uTime * 0.9);
        float pulse = smoothstep(0.0, 0.08, p) * (1.0 - smoothstep(0.08, 0.55, p));
        float base = 0.22;
        float a = uK * edge * (base + 0.95 * pulse) * uDim;
        gl_FragColor = vec4(uColor * (0.6 + 1.4 * pulse), a);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
}

function ribbon(points, w, y) {
  // flat strip along an (x,z) polyline at height y, with arc-length attribute s and side -1..1
  const pos = [], s = [], side = [], idx = [];
  let acc = 0;
  for (let i = 0; i < points.length; i++) {
    const [x, z] = points[i];
    const [xa, za] = points[Math.max(0, i - 1)], [xb, zb] = points[Math.min(points.length - 1, i + 1)];
    let dx = xb - xa, dz = zb - za; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
    if (i > 0) acc += Math.hypot(x - points[i - 1][0], z - points[i - 1][1]);
    const nx = -dz * w / 2, nz = dx * w / 2;
    pos.push(x + nx, y, z + nz, x - nx, y, z - nz); s.push(acc, acc); side.push(1, -1);
    if (i > 0) { const k = i * 2; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('s', new THREE.Float32BufferAttribute(s, 1));
  g.setAttribute('side', new THREE.Float32BufferAttribute(side, 1));
  g.setIndex(idx);
  return { geo: g, length: acc };
}

/**
 * Build the PCB.  opts:
 *   placement: 'mouse' (default; board top at boardY in the mouse frame) | 'origin' (centred, board top at y=0)
 *   boardY, boardZ: board-top height / z shift in the mouse frame (defaults 5.03 / -2.88, see PCB_INFO)
 *   glb, layout: override asset URLs
 *   gt01, wheel: optional factories (from the parts builder) replacing the stand-ins: (THREE) => Object3D
 *   battery: show a placeholder cell at the end of the battery lead (default false)
 *   materials: override any material by name
 */
export async function buildPcb(opts = {}) {
  const glbURL = opts.glb || HERE + 'pcb.glb';
  const layoutURL = opts.layout || HERE + 'pcb-layout.json';
  const [gltf, layout] = await Promise.all([
    new GLTFLoader().loadAsync(glbURL),
    fetch(layoutURL).then((r) => r.json()),
  ]);
  const own = pcbMaterials();
  bindEnvironment(Object.values(own));
  const M = Object.assign(own, opts.materials || {});
  const U = { front: { value: 999 }, heat: { value: 0 }, xray: { value: 0 } };
  for (const k of ['mask', 'mask_cu', 'enig', 'edge_gold', 'silk']) patchHeat(M[k], U);
  patchHeat(M.solder, U, { solder: true });

  const group = new THREE.Group(); group.name = 'theseus_pcb';
  const root = gltf.scene;
  const parts = {};
  const layers = {};
  const meshes = [];
  root.traverse((o) => {
    if (o.isMesh) {
      const name = o.material && o.material.name;
      if (M[name]) o.material = M[name];
      o.castShadow = true; o.receiveShadow = true;
      meshes.push(o);
    }
    const ex = o.userData || {};
    if (ex.ref) parts[ex.ref] = o;
    if (o.name && !parts[o.name]) parts[o.name] = o;
    if (ex.layer && ex.kind === 'component') { (layers[ex.layer] = layers[ex.layer] || []).push(o); }
  });
  const board = new THREE.Group(); board.name = 'pcb_board_frame';
  board.add(root);
  group.add(board);
  if ((opts.placement || 'mouse') === 'mouse') board.position.set(0, opts.boardY ?? PCB_INFO.boardTopYInMouse, opts.boardZ ?? PCB_INFO.boardOffsetZInMouse);
  else board.position.set(0, 0, -24.6);          // 'origin': board centred (local z 24.6 -> 0), top copper at y = 0

  // record rest transforms for every component node (explode + reflow settle start from these)
  const comps = [];
  for (const [layer, list] of Object.entries(layers)) {
    for (const o of list) {
      o.userData.rest = { p: o.position.clone(), q: o.quaternion.clone() };
      // deterministic pick-and-place error, removed by self-alignment during reflow
      const h = hash(o.userData.ref || o.name);
      o.userData.placeErr = { dx: (h % 7 - 3) * 0.012, dz: ((h >> 3) % 7 - 3) * 0.012, rot: (((h >> 6) % 9) - 4) * 0.004, dy: 0.05 };
      comps.push(o);
    }
  }

  // ---------------------------------------------------------------- power flow overlay
  const flow = new THREE.Group(); flow.name = 'power_flow'; flow.visible = false; board.add(flow);
  const flowMats = {
    charge: makeFlowMaterial(0xfdc316), run: makeFlowMaterial(0x7fe3ff),
  };
  for (const mode of ['charge', 'run']) {
    const segs = layout.power[mode].segments;
    for (const sg of segs) {
      const y = sg.layer === 'L3' ? 0.16 : 0.13;
      const { geo } = ribbon(sg.pts, Math.max(0.42, sg.w * 2.0), y);
      const mat = flowMats[mode].clone();
      mat.uniforms.uDim.value = sg.layer === 'L3' ? 0.6 : 1.0;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.mode = mode; mesh.renderOrder = 10; mesh.frustumCulled = false;
      flow.add(mesh);
    }
  }

  // ---------------------------------------------------------------- reflow heat sheet (a soft glowing plane moving along z)
  const sheetMat = new THREE.ShaderMaterial({
    uniforms: { uK: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `uniform float uK; varying vec2 vUv;
      void main(){ float yy = (vUv.y-0.5)/0.18; float a = exp(-yy*yy) * smoothstep(0.0,0.25,vUv.x) * (1.0-smoothstep(0.75,1.0,vUv.x));
        gl_FragColor = vec4(vec3(1.0,0.42,0.12)*1.4, a*0.55*uK); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(52, 14), sheetMat);
  sheet.rotation.y = 0; sheet.position.set(0, 4, 0); sheet.visible = false; sheet.renderOrder = 11;
  // plane in XY, facing z: a vertical curtain of heat crossing the board
  board.add(sheet);

  // ---------------------------------------------------------------- state
  const state = { explode: 0, power: 0, reflow: 0, xray: 0, press: { L: 0, R: 0 } };
  const xrayTargets = ['mask', 'mask_cu', 'silk'];
  const inner = [];
  root.traverse((o) => { if (o.isMesh && /^(inner_l2|inner_l3|via_barrels)/.test(o.parent?.name || o.name)) inner.push(o); });
  root.traverse((o) => { if (o.isMesh && o.material === M.cu_inner) { o.visible = false; if (!inner.includes(o)) inner.push(o); } });

  function applyComponents() {
    const k = state.explode;
    const reflowing = state.reflow > 0 && state.reflow < 1;
    const zf = frontZ(state.reflow);
    for (const o of comps) {
      const layer = o.userData.layer;
      const e = EXPLODE[layer] || { y: 5, delay: 0.2 };
      const kk = smooth((k - e.delay) / (1 - e.delay));
      const r = o.userData.rest;
      o.position.copy(r.p); o.quaternion.copy(r.q);
      o.position.y += e.y * kk;
      if (state.reflow > 0 && state.reflow < 1 && o.userData.smd) {
        // settle: parts ride on paste until the front passes, then pull to the pad centre (self-alignment)
        const zc = (o.userData.zc ?? r.p.z);
        const passed = smooth((zf - zc) / -1.5 + 0.5 > 0 ? (zc - zf) / 2.5 : 0);
        const pe = o.userData.placeErr; const a = 1 - smooth((zc - zf) / 2.5);
        o.position.x += pe.dx * a; o.position.z += pe.dz * a; o.position.y += pe.dy * a;
        o.rotateY(pe.rot * a);
      }
    }
  }
  function frontZ(k) { return 58 - k * 66; }   // nose -> tail, once

  function setExplode(k) { state.explode = Math.min(1, Math.max(0, k)); applyComponents(); }
  function setPress(side, k) {
    k = Math.min(1, Math.max(0, k));
    state.press[side] = k;
    // 'L' = left button = SW1 (world +X = the user's left); 'R' = right button = SW2.
    const ref = side === 'L' ? 'SW1' : 'SW2';
    if (gt01[ref]) { gt01[ref].setPress(k); return; }
    const sw = parts[ref];
    if (!sw) return;
    const pl = sw.getObjectByName(ref + '_plunger');
    if (pl) {
      if (!pl.userData.rest) pl.userData.rest = pl.position.clone();
      const travel = (opts.pressTravel ?? 0.35) * (opts.pressExaggerate ?? 1);
      const ax = pl.userData.axis || [0, -1, 0];
      pl.position.copy(pl.userData.rest).add(new THREE.Vector3(...ax).multiplyScalar(travel * k));
    }
  }
  function setXray(k) {
    k = Math.min(1, Math.max(0, k)); state.xray = k; U.xray.value = k;
    for (const n of xrayTargets) {
      const m = M[n]; m.transparent = k > 0; m.opacity = 1 - 0.88 * k; m.depthWrite = k < 0.5; m.needsUpdate = true;
    }
    M.mask_cu.color.setHex(0x060709).lerp(new THREE.Color(0xc9824e), k * 0.85);
    M.mask_cu.metalness = 0.9 * k; M.mask_cu.roughness = 0.42 - 0.1 * k; M.mask_cu.userData.envK = 0.075 + 0.8 * k;
    M.mask_cu.emissive = new THREE.Color(0xff8a3a).multiplyScalar(0.12 * k);
    for (const o of inner) { o.visible = k > 0.01; }
    M.cu_inner.transparent = true; M.cu_inner.opacity = Math.min(1, k * 1.2); M.cu_inner.emissive = new THREE.Color(0xff7a2a).multiplyScalar(0.18 * k);
    M.fr4.transparent = k > 0; M.fr4.opacity = 1 - 0.8 * k;
    M.edge_gold.transparent = k > 0; M.edge_gold.opacity = 1 - 0.5 * k;
  }
  function setPower(k, o = {}) {
    k = Math.min(1, Math.max(0, k)); state.power = k;
    const mode = o.mode || 'charge'; const t = o.t ?? 0;
    flow.visible = k > 0.001;
    flow.children.forEach((m) => {
      const on = mode === 'both' || m.userData.mode === mode;
      m.visible = on;
      m.material.uniforms.uK.value = k; m.material.uniforms.uTime.value = t;
    });
  }
  function setReflow(k) {
    k = Math.min(1, Math.max(0, k)); state.reflow = k;
    const zf = frontZ(k);
    U.front.value = zf; U.heat.value = k > 0 && k < 1 ? 1 : (k >= 1 ? 0 : 0);
    if (k <= 0) U.front.value = 999;      // nothing reflowed yet -> show paste (handled by heat=0: solder normal)
    sheet.visible = k > 0 && k < 1; sheet.position.z = zf; sheetMat.uniforms.uK.value = Math.sin(Math.PI * Math.min(1, k * 1.1));
    // before the pass starts, solder looks like paste everywhere
    if (k === 0) { U.heat.value = 0; }
    applyComponents();
  }

  // ---------------------------------------------------------------- parts builder models (3d/parts/), stand-ins as fallback
  const owned = [];
  let mods = {};
  if (opts.useParts !== false) {
    for (const f of ['gt01.js', 'millmax3305.js', 'parts.js']) {
      try { Object.assign(mods, await import(new URL('../parts/' + f, HERE).href)); } catch (e) { /* not built yet */ }
    }
  }
  const gt01 = {};
  const buildGT01 = opts.gt01 || mods.buildGT01;
  if (buildGT01) {
    for (const ref of ['SW1', 'SW2']) {
      const node = parts[ref]; if (!node) continue;
      const sw = buildGT01({ tilt: opts.switchTilt ?? 20, cover: opts.gt01Cover ?? 'pink', materials: opts.partMaterials });
      if (!sw) continue;
      node.children.forEach((c) => { c.visible = false; });       // hide the same-footprint stand-in
      sw.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      node.add(sw); gt01[ref] = sw; owned.push(sw);
    }
  }
  const buildMM = opts.millmax || mods.buildMillMax3305;
  if (buildMM) {
    for (const [ref, node] of Object.entries(parts)) {
      if (!/^SW[12]_MM\d$/.test(ref) || node.userData.kind !== 'component') continue;
      const mm = buildMM({ variant: 0, shell: 'tin', pcb: false, pin: false, materials: opts.partMaterials });
      if (!mm) continue;
      node.children.forEach((c) => { c.visible = false; });
      node.add(mm); owned.push(mm);
    }
  }
  const buildWheel = opts.wheel || mods.buildScrollWheel;
  let wheel = null;
  if (buildWheel && parts.WHEEL) {
    // parts API: origin = PCB top under the wheel centre, axle along X, centre at Y = axleHeight (12, as the shell)
    wheel = buildWheel({ diameter: 22.74, width: 7.0, axleHeight: 12, encoderSide: +1, materials: opts.partMaterials });
    if (wheel) {
      parts.WHEEL.children.forEach((c) => { c.visible = false; });
      parts.WHEEL.add(wheel); owned.push(wheel);
      for (const r of ['ENC1', 'WB1', 'SW4']) if (parts[r]) parts[r].visible = false;   // the wheel assembly brings its own encoder + support
    }
  }

  function dispose() {
    for (const o of owned) o.dispose?.();
    group.traverse((o) => { if (o.isMesh) { o.geometry?.dispose(); } });
    Object.values(M).forEach((m) => m.dispose());
    Object.values(flowMats).forEach((m) => m.dispose());
    sheetMat.dispose();
  }

  Object.assign(group.userData, {
    parts, layers, layout, materials: M, state, gt01, wheel,
    setExplode, setPower, setReflow, setXray, setPress, dispose,
    info: PCB_INFO,
  });
  return group;
}

function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h); }
