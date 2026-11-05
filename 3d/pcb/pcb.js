// Theseus main PCB — builder + state setters for the deck timeline.
//
//   import { buildPcb } from './pcb/pcb.js';
//   import { buildGT01, buildMillMax3305, buildScrollWheel } from './parts/parts.js';
//   const pcb = await buildPcb({ placement: 'mouse', gt01: buildGT01, millmax: buildMillMax3305, wheel: buildScrollWheel });
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
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';   // the deck ships pcb.glb meshopt-compressed

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
  passives: { y: 6.0, delay: 0.10 },
  pmic: { y: 11.0, delay: 0.16 },
  sensor: { y: 9.0, delay: 0.20 },
  lens: { y: -9.0, delay: 0.20 },
  module: { y: 16.0, delay: 0.24 },
  sockets: { y: 4.5, delay: 0.30, out: 4.0 },
  switches: { y: 18.0, delay: 0.34, out: 7.0 },     // 'out': also slide away from the centre line (clears the module)
  mechanics: { y: 13.0, delay: 0.28 },
  wheel: { y: 27.0, delay: 0.40 },
  connectors: { y: 9.0, delay: 0.26 },
  wires: { y: 9.0, delay: 0.26 },
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
    // matte LPI black: low F90 (specularIntensity) so the studio rim light, which sits near the mirror direction of the
    // 3/4 views, gives a soft sheen instead of a grey sheet; mask over copper is a touch glossier so traces read
    mask: P({ color: 0x030304, roughness: 0.64, metalness: 0, clearcoat: 0.0, envMapIntensity: 0.05, specularIntensity: 0.22 }),
    mask_cu: P({ color: 0x060709, roughness: 0.47, metalness: 0, clearcoat: 0.0, envMapIntensity: 0.075, specularIntensity: 0.38 }),
    mask_b: P({ color: 0x030304, roughness: 0.64, metalness: 0, envMapIntensity: 0.05, specularIntensity: 0.22 }),
    mask_tr: P({ color: 0x060709, roughness: 0.47, metalness: 0, envMapIntensity: 0.075, specularIntensity: 0.38 }),
    mask_cub: P({ color: 0x060709, roughness: 0.47, metalness: 0, envMapIntensity: 0.075, specularIntensity: 0.38 }),
    enig: P({ color: 0xe2a43e, roughness: 0.3, metalness: 1, envMapIntensity: 0.82 }),
    edge_gold: P({ color: 0xdc9f39, roughness: 0.26, metalness: 1, envMapIntensity: 0.8 }),
    silk: P({ color: 0xeeeeea, roughness: 0.82, metalness: 0, envMapIntensity: 0.6 }),
    fr4: P({ color: 0x4c4632, roughness: 0.85, metalness: 0, envMapIntensity: 0.5 }),
    cu_inner: P({ color: 0xd9925f, roughness: 0.32, metalness: 1, side: THREE.DoubleSide, envMapIntensity: 1.0 }),
    cu_l2: P({ color: 0xc9824e, roughness: 0.4, metalness: 1, side: THREE.DoubleSide, envMapIntensity: 0.8, transparent: true, opacity: 0, depthWrite: false }),
    cu_l3: P({ color: 0x2ec4b6, roughness: 0.35, metalness: 0.2, side: THREE.DoubleSide, envMapIntensity: 0.6, emissive: 0x2ec4b6, emissiveIntensity: 0 }),
    cu_via: P({ color: 0xe2a43e, roughness: 0.3, metalness: 1, side: THREE.DoubleSide, envMapIntensity: 0.9, emissive: 0xffb347, emissiveIntensity: 0 }),
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
    module_pcb: P({ color: 0x1b5aa8, roughness: 0.4, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.25, envMapIntensity: 0.45 }),
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
  // The reflow front is a plane z = uFront in BOARD-LOCAL coordinates (layout z: nose ~52, tail ~-5), so the effect
  // stays glued to the board wherever the deck places or animates the group (uBoardInv = inverse board matrixWorld).
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uFront = U.front; sh.uniforms.uHeat = U.heat; sh.uniforms.uBoardInv = U.boardInv;
    sh.uniforms.uSolder = { value: opts.solder ? 1 : 0 };
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vLoc;\nuniform mat4 uBoardInv;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvLoc = (uBoardInv * modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vLoc;\nuniform float uFront;\nuniform float uHeat;\nuniform float uSolder;')
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        // the front travels nose -> tail (decreasing z): z > uFront has been through the peak zone
        float passed = smoothstep(-0.6, 0.6, vLoc.z - uFront);
        if (uSolder > 0.5 && uHeat > 0.0) { roughnessFactor = mix(0.82, roughnessFactor, passed); }`)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>
        if (uSolder > 0.5 && uHeat > 0.0) { metalnessFactor = mix(0.15, metalnessFactor, passed); }`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        float dz_ = (vLoc.z - uFront) / 1.1; float band = exp(-dz_ * dz_);
        float tz_ = max(vLoc.z - uFront, 0.0); float trail = smoothstep(0.0, 1.2, tz_) * exp(-tz_ / 2.5);
        float pre = exp(-max(uFront - vLoc.z, 0.0) / 1.8) * (1.0 - band);
        totalEmissiveRadiance += uHeat * (vec3(1.0, 0.34, 0.06) * band * 1.5 + vec3(1.0, 0.40, 0.10) * trail * 0.035 + vec3(0.9, 0.2, 0.03) * pre * 0.06);`);
    if (opts.solder) {
      sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
        if (uHeat > 0.0) { float pas = smoothstep(-0.6, 0.6, vLoc.z - uFront); diffuseColor.rgb = mix(vec3(0.46, 0.47, 0.49), diffuseColor.rgb, pas); }`);
    }
  };
  mat.customProgramCacheKey = () => 'heat2' + (opts.solder ? 's' : '');
}

function makeFlowMaterial(color) {
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uK: { value: 0 }, uColor: { value: new THREE.Color(color) }, uDim: { value: 1 },
      uPeriod: { value: 5.0 }, uSpeed: { value: 14.0 } },
    vertexShader: `attribute float s; attribute float side; varying float vS; varying float vSide;
      void main(){ vS = s; vSide = side; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform float uTime; uniform float uK; uniform vec3 uColor; uniform float uDim; uniform float uPeriod; uniform float uSpeed;
      varying float vS; varying float vSide;
      void main(){
        float edge = 1.0 - smoothstep(0.35, 1.0, abs(vSide));
        float core = 1.0 - smoothstep(0.0, 0.45, abs(vSide));
        // comet: bright head, exponential tail behind it (current flows toward increasing s)
        float p = fract((vS - uTime * uSpeed) / uPeriod);
        float head = smoothstep(0.80, 0.97, p) * (1.0 - smoothstep(0.97, 1.0, p));
        float tail = smoothstep(0.25, 0.97, p) * (1.0 - smoothstep(0.97, 1.0, p));
        float pulse = max(head, tail * 0.45);
        float a = uK * uDim * (edge * (0.42 + 0.9 * pulse) + core * 0.35 * pulse);
        gl_FragColor = vec4(uColor * (0.75 + 1.1 * pulse + 0.6 * core * pulse), a);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
}

function makeGlowMaterial(color) {
  return new THREE.ShaderMaterial({
    uniforms: { uK: { value: 0 }, uTime: { value: 0 }, uColor: { value: new THREE.Color(color) }, uPhase: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `uniform float uK; uniform float uTime; uniform vec3 uColor; uniform float uPhase; varying vec2 vUv;
      void main(){ vec2 d = vUv - 0.5; float r = length(d) * 2.0;
        float beat = 0.8 + 0.2 * sin(uTime * 6.2832 * 1.4 + uPhase);
        float a = (exp(-r * r * 3.2) * 0.75 + exp(-r * r * 12.0) * 0.3) * (1.0 - smoothstep(0.7, 1.0, r));
        gl_FragColor = vec4(uColor, a * uK * beat); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
}

function ribbon(points, w, y, s0 = 0) {
  // flat strip along an (x,z) polyline at height y, with arc-length attribute s (offset s0) and side -1..1
  const pos = [], s = [], side = [], idx = [];
  let acc = s0;
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
  return { geo: g, end: acc };
}

/**
 * Build the PCB.  opts:
 *   placement: 'mouse' (default; board top at boardY in the mouse frame) | 'origin' (centred, board top at y=0)
 *   boardY, boardZ: board-top height / z shift in the mouse frame (defaults 5.03 / -2.88, see PCB_INFO)
 *   glb, layout: override asset URLs
 *   gt01, millmax, wheel: factories from 3d/parts (buildGT01, buildMillMax3305, buildScrollWheel) replacing the
 *     same-footprint stand-ins; omitted -> stand-ins.  useParts: accepted for compatibility (no effect: nothing is
 *     imported at run time).  encoderSide: passed to the wheel factory (default 'left' = +X, as the Sora V2 photo)
 *   battery: show a placeholder cell at the end of the battery lead (default false)
 *   materials: override any material by name
 */
export async function buildPcb(opts = {}) {
  const glbURL = opts.glb || HERE + 'pcb.glb';
  const layoutURL = opts.layout || HERE + 'pcb-layout.json';
  const [gltf, layout] = await Promise.all([
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(glbURL),
    fetch(layoutURL).then((r) => r.json()),
  ]);
  const own = pcbMaterials();
  bindEnvironment(Object.values(own));
  const M = Object.assign(own, opts.materials || {});
  const U = { front: { value: 999 }, heat: { value: 0 }, boardInv: { value: new THREE.Matrix4() } };
  for (const k of ['mask', 'mask_cu', 'mask_tr', 'enig', 'edge_gold', 'silk']) patchHeat(M[k], U);
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
  // keep the heat-front frame glued to the board (the deck may move/rotate the group at any time)
  for (const k of ['mask', 'mask_cu', 'mask_tr', 'enig', 'edge_gold', 'silk', 'solder']) {
    const m = M[k]; const prev = m.onBeforeRender;
    m.onBeforeRender = function (r, sc, cam, geo, obj, grp) { prev.call(this, r, sc, cam, geo, obj, grp); U.boardInv.value.copy(board.matrixWorld).invert(); };
  }

  // record rest transforms for every component node (explode + reflow settle start from these)
  const comps = [];
  for (const [layer, list] of Object.entries(layers)) {
    for (const o of list) {
      o.userData.rest = { p: o.position.clone(), q: o.quaternion.clone() };
      // deterministic pick-and-place error, removed by self-alignment during reflow
      const h = hash(o.userData.ref || o.name);
      // (amplitudes are a little exaggerated so the self-alignment reads in a close-up)
      o.userData.placeErr = { dx: (h % 7 - 3) * 0.03, dz: ((h >> 3) % 7 - 3) * 0.03, rot: (((h >> 6) % 9) - 4) * 0.008, dy: 0.06 };
      comps.push(o);
    }
  }

  // ---------------------------------------------------------------- power flow overlay
  // Ribbons follow the real copper (pcb-layout.json power.*.segments). Arc length is chained across segments so the
  // comet pulses run continuously from the source: USB-C -> nPM1300 -> battery ('charge'); battery -> nPM1300 bucks ->
  // module + sensor ('run'). Glow discs mark the source, the PMIC and the loads.
  const flow = new THREE.Group(); flow.name = 'power_flow'; flow.visible = false; board.add(flow);
  const FLOW_COLORS = { charge: 0xfdc316, run: 0x6fdcff };
  const flowMats = [];
  const NODES = { charge: ['usb', 'pmic', 'battery'], run: ['battery', 'pmic', 'l1', 'l2', 'module', 'sensor'] };
  const NODE_REF = { usb: 'J1', pmic: 'U2', battery: 'J2', module: 'U1', sensor: 'U3', l1: 'L1', l2: 'L2' };
  board.updateMatrixWorld(true);
  for (const mode of ['charge', 'run']) {
    const segs = layout.power[mode].segments;
    const seen = [];           // [x, z, s] of every vertex placed so far (branch points)
    let sMax = 0;
    for (const sg of segs) {
      const [x0, z0] = sg.pts[0];
      let s0 = sMax, best = 1.6;
      for (const [x, z, sv] of seen) { const d = Math.hypot(x - x0, z - z0); if (d < best) { best = d; s0 = sv + d; } }
      const L3 = sg.layer === 'L3';
      const { geo, end } = ribbon(sg.pts, L3 ? Math.max(0.8, sg.w * 2.4) : Math.max(0.95, sg.w * 2.6), L3 ? 0.07 : 0.075, s0);
      let acc = s0;
      sg.pts.forEach((q, i) => { if (i > 0) acc += Math.hypot(q[0] - sg.pts[i - 1][0], q[1] - sg.pts[i - 1][1]); seen.push([q[0], q[1], acc]); });
      sMax = Math.max(sMax, end);
      const mat = makeFlowMaterial(FLOW_COLORS[mode]); flowMats.push(mat);
      mat.uniforms.uDim.value = L3 ? 0.7 : 1.0;
      const mesh = new THREE.Mesh(geo, mat);
      mesh.name = 'flow_' + mode; mesh.userData.mode = mode; mesh.renderOrder = 10; mesh.frustumCulled = false;
      flow.add(mesh);
    }
    NODES[mode].forEach((n, i) => {
      const at = layout.power.nodes[n]; if (!at) return;
      // a halo on the board around the part it marks (sized from the part's footprint, so it shows around the body)
      const ref = NODE_REF[n]; let r = 3.0, cx = at[0], cz = at[1];
      if (ref && parts[ref]) {
        const bb = new THREE.Box3().setFromObject(parts[ref]);
        if (isFinite(bb.max.x)) { r = Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z) * 0.75 + 1.6; cx = (bb.min.x + bb.max.x) / 2 - board.position.x; cz = (bb.min.z + bb.max.z) / 2 - board.position.z; }
      }
      const mat = makeGlowMaterial(FLOW_COLORS[mode]); flowMats.push(mat);
      mat.uniforms.uPhase.value = i * 1.3;
      const disc = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), mat);
      disc.rotation.x = -Math.PI / 2; disc.position.set(cx, 0.065, cz);
      disc.name = 'flow_node_' + mode + '_' + n; disc.userData.mode = mode; disc.renderOrder = 10; disc.frustumCulled = false;
      flow.add(disc);
    });
  }

  // ---------------------------------------------------------------- reflow: a curtain of heat crossing the board once
  const sheetMat = new THREE.ShaderMaterial({
    uniforms: { uK: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: `uniform float uK; varying vec2 vUv;
      void main(){ float h = 1.0 - vUv.y; float a = h * h * h * smoothstep(0.0, 0.12, vUv.x) * (1.0 - smoothstep(0.88, 1.0, vUv.x));
        gl_FragColor = vec4(vec3(1.0, 0.38, 0.08) * 1.3, a * 0.5 * uK); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  });
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(46, 9), sheetMat);
  sheet.position.set(0, 4.5, 0); sheet.visible = false; sheet.renderOrder = 11; sheet.name = 'reflow_curtain';
  board.add(sheet);       // plane in XY (facing z): moves along z with the front

  // ---------------------------------------------------------------- state
  const state = { explode: 0, power: 0, reflow: 0, xray: 0, press: { L: 0, R: 0 } };
  // inner layers: hidden until the X-ray state; draw order bottom -> top for the translucent stack
  const inner = [];
  root.traverse((o) => {
    if (!o.isMesh) return;
    if (o.material === M.cu_l2 || o.material === M.cu_l3 || o.material === M.cu_via || o.material === M.cu_inner) { o.visible = false; inner.push(o); }
    if (o.material === M.cu_l2) o.renderOrder = 1;
    if (o.material === M.mask) o.renderOrder = 2;
    if (o.material === M.mask_cu) o.renderOrder = 3;
    if (o.material === M.silk) o.renderOrder = 4;
    if (o.material === M.cu_l3 || o.material === M.cu_via) o.renderOrder = 5;   // drawn over the translucent stack
  });

  function applyComponents() {
    const k = state.explode;
    const zf = frontZ(state.reflow);
    for (const o of comps) {
      const layer = o.userData.layer;
      const e = EXPLODE[layer] || { y: 5, delay: 0.2 };
      const kk = smooth((k - e.delay) / (1 - e.delay));
      const r = o.userData.rest;
      o.position.copy(r.p); o.quaternion.copy(r.q);
      o.position.y += e.y * kk;
      if (e.out) o.position.x += Math.sign(r.p.x || 1) * e.out * kk;
      if (state.reflow > 0 && state.reflow < 1 && o.userData.smd) {
        // settle: parts ride on paste until the front passes, then pull to the pad centre (self-alignment)
        const zc = (o.userData.zc ?? r.p.z);
        const pe = o.userData.placeErr; const a = 1 - smooth((zc - zf) / 2.5);   // 1 ahead of the front, 0 once passed
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
  const C = (hex) => new THREE.Color(hex);
  function fade(m, op, depthWrite = op > 0.6, force = false) {
    const tr = force || op < 0.999;
    if (m.transparent !== tr) m.needsUpdate = true;
    m.transparent = tr; m.opacity = op; m.depthWrite = tr ? depthWrite : true;
  }
  function setXray(k) {
    // the solder mask clears: L1 routing lights up in copper, the GND pour dims, L3 (power + long runs) glows teal
    // through the board, the L2 ground plane is a faint copper veil and the via barrels show as gold points.
    k = Math.min(1, Math.max(0, k)); state.xray = k;
    fade(M.mask, 1 - 0.8 * k, k < 0.5);
    fade(M.silk, 1 - 0.55 * k);
    // pour: dim copper, translucent so L3 shows through
    M.mask_cu.color.setHex(0x060709).lerp(C(0x6a4026), k * 0.9);
    M.mask_cu.metalness = 0.5 * k; M.mask_cu.roughness = 0.47 - 0.05 * k; M.mask_cu.userData.envK = 0.075 + 0.3 * k;
    M.mask_cu.specularIntensity = 0.38 + 0.3 * k;
    fade(M.mask_cu, 1 - 0.58 * k, k < 0.5);
    // signal + power traces on L1: saturated copper with a warm glow (low env so AgX keeps the hue)
    M.mask_tr.color.setHex(0x060709).lerp(C(0xd9803f), k);
    M.mask_tr.metalness = 0.85 * k; M.mask_tr.roughness = 0.47 - 0.12 * k; M.mask_tr.userData.envK = 0.075 + 0.35 * k;
    M.mask_tr.specularIntensity = 0.38 + 0.5 * k;
    M.mask_tr.emissive.setHex(0xff6a1a).multiplyScalar(0.42 * k);
    for (const o of inner) o.visible = k > 0.01;
    fade(M.cu_l2, 0.10 * k, false);
    // L3 + via barrels: drawn after the translucent stack (renderOrder 5, no depth write) so they read through it
    M.cu_l3.emissiveIntensity = 1.1 * k; fade(M.cu_l3, Math.min(1, 1.25 * k), false, true);
    M.cu_via.emissiveIntensity = 0.6 * k; fade(M.cu_via, Math.min(1, 1.25 * k), false, true);
    // the bottom mask cap is the dark floor of the X-ray (seen from above through the cleared top mask)
    const ds = k > 0.001 ? THREE.DoubleSide : THREE.FrontSide;
    if (M.mask_b.side !== ds) { M.mask_b.side = ds; M.mask_b.needsUpdate = true; }
  }
  function setPower(k, o = {}) {
    // k: 0..1 intensity; mode 'charge' | 'run' | 'both'; t: seconds (pulses move at ~14 mm/s along the copper)
    k = Math.min(1, Math.max(0, k)); state.power = k;
    const mode = o.mode || 'charge'; const t = o.t ?? 0;
    state.powerMode = mode;
    flow.visible = k > 0.001;
    flow.children.forEach((m) => {
      m.visible = mode === 'both' || m.userData.mode === mode;
      m.material.uniforms.uK.value = k; m.material.uniforms.uTime.value = t;
    });
  }
  function setReflow(k) {
    // k = 0: finished board (default look). 0 < k < 1: the heat front crosses nose -> tail once; ahead of it the
    // solder is matte paste and parts sit slightly off their pads; behind it the joints are wetted and parts have
    // self-aligned. k = 1: done.
    k = Math.min(1, Math.max(0, k)); state.reflow = k;
    const zf = frontZ(k);
    const active = k > 0 && k < 1;
    U.front.value = active ? zf : 999; U.heat.value = active ? 1 : 0;
    sheet.visible = active; sheet.position.z = zf; sheetMat.uniforms.uK.value = Math.sin(Math.PI * k);
    applyComponents();
  }

  // ---------------------------------------------------------------- parts builder models (3d/parts/), stand-ins as fallback
  // Factories are passed in (no dynamic imports, so the module bundles): opts.gt01 = buildGT01,
  // opts.millmax = buildMillMax3305, opts.wheel = buildScrollWheel. Without them the same-footprint stand-ins show.
  const owned = [];
  const gt01 = {};
  const buildGT01 = opts.gt01;
  if (buildGT01) {
    for (const ref of ['SW1', 'SW2']) {
      const node = parts[ref]; if (!node) continue;
      const sw = buildGT01({ tilt: opts.switchTilt ?? 20, cover: opts.gt01Cover ?? 'pink', materials: opts.partMaterials });
      if (!sw) continue;
      node.children.forEach((c) => { c.visible = false; });       // hide the same-footprint stand-in
      sw.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      node.add(sw); gt01[ref] = sw; owned.push(sw);
    }
    // the parts GT01 has no locating peg any more (Brock: it read as a fourth pin): close the 1.0 mm peg hole that
    // pcb.glb drilled beside each switch (+1.45, +2.54 from its centre), top and bottom, in the board's own masks
    const core = root.getObjectByName('board_core'), host = core && core.parent;
    for (const ref of ['SW1', 'SW2']) {
      const c = host && gt01[ref] && (layout.components || []).find((k) => k.ref === ref); if (!c) continue;
      for (const [y, m, up] of [[0.0235, M.mask, 1], [-1.0235, M.mask_b, -1]]) {
        const g = new THREE.CircleGeometry(0.58, 24); g.rotateX(up > 0 ? -Math.PI / 2 : Math.PI / 2); g.translate(c.x + 1.45, y, c.z + 2.54);
        const d = new THREE.Mesh(g, m); d.name = ref + '_pegHoleCap'; d.receiveShadow = true; host.add(d);
      }
    }
  }
  const buildMM = opts.millmax;
  if (buildMM) {
    for (const [ref, node] of Object.entries(parts)) {
      if (!/^SW[12]_MM\d$/.test(ref) || node.userData.kind !== 'component') continue;
      const mm = buildMM({ variant: 0, shell: 'tin', pcb: false, pin: false, materials: opts.partMaterials });
      if (!mm) continue;
      node.children.forEach((c) => { c.visible = false; });
      node.add(mm); owned.push(mm);
    }
  }
  const buildWheel = opts.wheel;
  let wheel = null;
  if (buildWheel && parts.WHEEL) {
    // parts API: origin = PCB top under the wheel centre, axle along X, centre at Y = axleHeight (12, as the shell)
    // encoder on +X (the user's left): that is where the Sora V2 photo has it (top view, nose up, text not mirrored:
    // the blue encoder is image-left = +X) and where this board's encoder footprint is; the parts default is -X.
    wheel = buildWheel({ diameter: 22.74, width: 7.0, axleHeight: 12, encoderSide: opts.encoderSide ?? 'left', materials: opts.partMaterials });
    if (wheel) {
      parts.WHEEL.children.forEach((c) => { c.visible = false; });
      parts.WHEEL.add(wheel); owned.push(wheel);
      // the wheel assembly brings its own encoder + axle support; the middle-click tact (SW4) stays on the board
      for (const r of ['ENC1', 'WB1']) if (parts[r]) parts[r].visible = false;
    }
  }

  // ---------------------------------------------------------------- board parts from Brock's photos (3d/parts/boardparts.js)
  // the radio module: black, the long meander antenna, turned so the antenna end sits away from the wheel's metal;
  // the sensor as a castellated module on the 2 × 8 pads; the clear snap-on lens through the aperture and clip holes
  const swap = (ref, factory) => {
    const node = parts[ref]; if (!factory || !node) return null;
    const m = factory({ materials: Object.assign({ maskBlack: M.mask, maskRelief: M.mask_cu, solder: M.solder }, opts.partMaterials || {}) }); if (!m) return null;
    node.children.forEach((c) => { c.visible = false; });
    m.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    node.add(m); owned.push(m); return m;
  };
  const radio = swap('U1', opts.radio);
  if (radio && layout.designRevision !== 'F30.25-plan5-approved') {
    radio.rotation.y = Math.PI;                       // its antenna band (+z in the part) to the board's rear
    const oldK = layout.antennaKeepout, zc = parts.U1.position.z;
    const newK = [oldK[0], 2 * zc - oldK[3], oldK[2], 2 * zc - oldK[1]];
    flipFootprint(root, M, zc, [-5.65, zc - 7.3, 5.65, zc + 7.3]);   // its land pattern turns with it (12 a side, 11 across the end)
    moveKeepout(root, oldK, newK, M);
    layout.antennaKeepout = newK;
  }
  const sensor = swap('U3', opts.sensor);
  const lens = swap('LENS', opts.lens);

  function dispose() {
    for (const o of owned) o.dispose?.();
    group.traverse((o) => { if (o.isMesh) { o.geometry?.dispose(); } });
    for (const [k, m] of Object.entries(own)) if (M[k] === m) m.dispose();   // caller-supplied materials are left alone
    flowMats.forEach((m) => m.dispose());
    sheetMat.dispose();
  }

  Object.assign(group.userData, {
    parts, layers, layout, materials: M, state, gt01, wheel,
    setExplode, setPower, setReflow, setXray, setPress, dispose,
    info: PCB_INFO,
  });
  return group;
}

/** A part turned 180° in place takes its pads with it: the top ENIG pads inside rect [x0, z0, x1, z1] (board-local,
    whole pads only) turn about (0, zc), so the module's castellations land on them again. Traces stay as routed: the
    side pads come back within 0.2 mm of where they were, and the end row's traces go with the new keep-out. */
function flipFootprint(root, M, zc, rect) {
  root.traverse((o) => {
    if (!o.isMesh || o.material !== M.enig || !/^top_pads/.test(o.name || '')) return;
    const P = o.geometry.attributes.position, N = o.geometry.attributes.normal;
    for (let i = 0; i < P.count; i++) {
      const x = P.getX(i), z = P.getZ(i);
      if (x > rect[0] && x < rect[2] && z > rect[1] && z < rect[3]) {
        P.setX(i, -x); P.setZ(i, 2 * zc - z);
        if (N) { N.setX(i, -N.getX(i)); N.setZ(i, -N.getZ(i)); }
      }
    }
    P.needsUpdate = true; if (N) N.needsUpdate = true;
    o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere();
  });
}

/** The antenna keep-out moves with the antenna: copper on every layer (pours, traces, pads, vias, inner planes) inside
    the new rectangle goes; the silk keep-out marking moves with it. Board-local (x, z) rectangles [x0, z0, x1, z1]. */
function moveKeepout(root, oldK, newK, M) {
  const inside = (x, z, k) => x > k[0] && x < k[2] && z > k[1] && z < k[3];
  // the board's meshes carry the builder's materials by then (M[name], which have no names of their own): match those
  const COPPER = new Set(['mask_cu', 'mask_tr', 'cu_l2', 'cu_l3', 'cu_via', 'cu_inner', 'mask_cub', 'enig'].map((k) => M[k]).filter(Boolean));
  const dz = newK[1] - oldK[1];
  root.traverse((o) => {
    if (!o.isMesh || !o.geometry || !o.geometry.index) return;
    const g = o.geometry, idx = g.index.array, P = g.attributes.position;
    if (o.parent && /^(U|J|SW|L|C|R|D|TP|FID|WHEEL|ENC|WB|LENS|BAT|SIDE)/.test(o.parent.name || '')) return;   // components keep theirs
    const cen = (t) => [(P.getX(idx[t]) + P.getX(idx[t + 1]) + P.getX(idx[t + 2])) / 3, (P.getZ(idx[t]) + P.getZ(idx[t + 1]) + P.getZ(idx[t + 2])) / 3];
    if (COPPER.has(o.material)) {
      const keep = [];
      for (let t = 0; t < idx.length; t += 3) { const [x, z] = cen(t); if (!inside(x, z, newK)) keep.push(idx[t], idx[t + 1], idx[t + 2]); }
      if (keep.length !== idx.length) { g.setIndex(keep); g.computeBoundingSphere(); }
    } else if (o.material === M.silk && /top_silk/.test(o.name || o.parent?.name || '')) {
      const ng = g.toNonIndexed(), Q = ng.attributes.position, out = [], nOut = [], N = ng.attributes.normal;
      for (let v = 0; v < Q.count; v += 3) {
        const x = (Q.getX(v) + Q.getX(v + 1) + Q.getX(v + 2)) / 3, z = (Q.getZ(v) + Q.getZ(v + 1) + Q.getZ(v + 2)) / 3;
        if (inside(x, z, newK)) continue;                // whatever was printed where the antenna now is
        const sh = inside(x, z, oldK) ? dz : 0;           // the keep-out marking moves with the antenna
        for (let k = 0; k < 3; k++) { out.push(Q.getX(v + k), Q.getY(v + k), Q.getZ(v + k) + sh); if (N) nOut.push(N.getX(v + k), N.getY(v + k), N.getZ(v + k)); }
      }
      const r = new THREE.BufferGeometry(); r.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
      if (N) r.setAttribute('normal', new THREE.Float32BufferAttribute(nOut, 3));
      o.geometry = r; g.dispose(); ng.dispose();
    }
  });
}

function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return Math.abs(h); }
