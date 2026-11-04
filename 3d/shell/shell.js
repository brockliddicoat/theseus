// Theseus hero shell: Sora V2/V3 shape from Brock's scan (fitted, cleaned) + Theseus gestures.
// Units mm. Frame (same as the scan, physically right-handed in three.js): +Y up, +Z forward (nose),
// +X = the side-button side = the USER'S LEFT.  See README "Handedness".
//
//   import { buildShell, SHELL_VIEWS } from '../shell/shell.js';
//   const shell = await buildShell({ variant: 'theseus', colorway: 'black' });
//   scene.add(shell);
//   shell.setClick('L', 1); shell.setScroll(0.6); shell.setSideButton(0, 1);
//   shell.setExplode(0.7); shell.setXray(0.5); shell.setColorway('white');
//   SHELL_VIEWS.hero -> { position, target, up, fov } (camera fitted to the RTINGS 3/4 photo)
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as STANDIN from './standins.js';

const HERE = new URL('.', import.meta.url).href;

/** Camera presets (vertical fov in degrees, for 16:9). `hero` is fitted to the RTINGS 3/4 photo (silhouette IoU, see README). */
export const SHELL_VIEWS = {
  hero: { position: [109.38, 103.14, 104.79], target: [-1.43, 7.76, 7.76], up: [-0.4482, 0.8378, -0.3117], fov: 24.74 },
  heroRear: { position: [-74, 104, -128], target: [-3, 13, 6], up: [0, 1, 0], fov: 25 },     // the user's view: legends read correctly
  heroWide: { position: [131.3, 123.8, 125.8], target: [-1.43, 9.5, 7.76], up: [-0.4482, 0.8378, -0.3117], fov: 24.74 },
  top: { position: [0, 520, 0.001], target: [0, 18, 0], up: [0, 0, 1], fov: 15.5 },
  left: { position: [520, 19, 0], target: [0, 19, 0], up: [0, 1, 0], fov: 10.2 },            // side-button side, nose at left
  right: { position: [-520, 19, 0], target: [0, 19, 0], up: [0, 1, 0], fov: 10.2 },
  front: { position: [0, 118, 330], target: [0, 14, 0], up: [0, 1, 0], fov: 12.5 },          // nose-on, slightly above: the chamfer
  frontLow: { position: [0, 26, 360], target: [0, 15, 0], up: [0, 1, 0], fov: 9.5 },
  back: { position: [0, 60, -360], target: [0, 16, 0], up: [0, 1, 0], fov: 10.5 },
  bottom: { position: [0, -520, 0.001], target: [0, 0, 0], up: [0, 0, 1], fov: 15.5 },
  exploded: { position: [196, 168, 176], target: [2, 9, 5], up: [-0.4482, 0.8378, -0.3117], fov: 30 },
  cuEngrave: { position: [-46, 92, -12], target: [-15.5, 31, 13.5], up: [0, 0.35, 1], fov: 22 },
  cuChamfer: { position: [52, 46, 108], target: [2, 12.5, 50], up: [0, 1, 0], fov: 20 },
  cuWheel: { position: [38, 58, 74], target: [0, 22.5, 36], up: [0, 1, 0], fov: 19 },
  cuJunction: { position: [-14, 78, -34], target: [0, 35.5, 7], up: [0, 1, 0], fov: 16 },
  cuSeamEnd: { position: [70, 70, -30], target: [26, 31, 7], up: [0, 1, 0], fov: 16 },
  cuSide: { position: [92, 22, 58], target: [27, 12, 36], up: [0, 1, 0], fov: 16 },
};

const COLORWAYS = {
  black: { shell: { color: 0x08090b, roughness: 0.56, clearcoat: 0.06, clearcoatRoughness: 0.6, sheen: 0.14, sheenColor: 0x2c2e32, sheenRoughness: 0.7, specularIntensity: 0.6, envMapIntensity: 0.62 },
           button: { color: 0x08090b, roughness: 0.34, clearcoat: 0.3, clearcoatRoughness: 0.3, specularIntensity: 0.85, envMapIntensity: 0.8 },
           plate: { color: 0x101113, roughness: 0.62, specularIntensity: 0.5, envMapIntensity: 0.6 },
           engrave: { color: 0x1e2023, roughness: 0.3, metalness: 0.0, specularIntensity: 1.0, envMapIntensity: 1.05 },
           bay: { color: 0x121314, roughness: 0.45 } },
  white: { shell: { color: 0xe6e5e1, roughness: 0.52, clearcoat: 0.08, clearcoatRoughness: 0.55, sheen: 0.12, sheenColor: 0xffffff, sheenRoughness: 0.8, specularIntensity: 0.55, envMapIntensity: 0.62 },
           button: { color: 0xd9d8d4, roughness: 0.4, clearcoat: 0.2, clearcoatRoughness: 0.4, specularIntensity: 0.7, envMapIntensity: 0.7 },
           plate: { color: 0xb8b7b3, roughness: 0.6, specularIntensity: 0.5, envMapIntensity: 0.6 },
           engrave: { color: 0x9c9b97, roughness: 0.42, metalness: 0.0, specularIntensity: 0.8, envMapIntensity: 0.8 },
           bay: { color: 0x6d6e70, roughness: 0.5 } },
  grey: { shell: { color: 0x8d8f92, roughness: 0.54, clearcoat: 0.06, clearcoatRoughness: 0.6, sheen: 0.12, sheenColor: 0xffffff, sheenRoughness: 0.8, specularIntensity: 0.55, envMapIntensity: 0.62 },
          button: { color: 0x7c7e81, roughness: 0.4, clearcoat: 0.2, clearcoatRoughness: 0.4, specularIntensity: 0.7, envMapIntensity: 0.7 },
          plate: { color: 0x2a2b2d, roughness: 0.6, specularIntensity: 0.5, envMapIntensity: 0.6 },
          engrave: { color: 0xc9cacc, roughness: 0.36, metalness: 0.0, specularIntensity: 0.8, envMapIntensity: 0.8 },
          bay: { color: 0x2a2b2d, roughness: 0.5 } },
  forged: { shell: { color: 0x0b0b0c, roughness: 0.42, clearcoat: 1.0, clearcoatRoughness: 0.32, sheen: 0.0, specularIntensity: 0.9, envMapIntensity: 0.9, forged: 1 },
            button: { color: 0x0a0a0b, roughness: 0.38, clearcoat: 1.0, clearcoatRoughness: 0.3, specularIntensity: 0.9, envMapIntensity: 0.9, forged: 1 },
            plate: { color: 0x101112, roughness: 0.55, clearcoat: 0.6, clearcoatRoughness: 0.4, specularIntensity: 0.7, envMapIntensity: 0.7, forged: 1 },
            engrave: { color: 0x34363a, roughness: 0.26, metalness: 0.0, specularIntensity: 1.0, envMapIntensity: 1.0 },
            bay: { color: 0x121314, roughness: 0.45 } },
};

// --- procedural surface detail (object-space, so the pattern rides with animated parts) -------------------------------
const NOISE_GLSL = `
float th_h31(vec3 p){ p = fract(p*0.3183099 + 0.1); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
vec3 th_h33(vec3 p){ return vec3(th_h31(p), th_h31(p+19.19), th_h31(p+47.47)); }
float th_vnoise(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.0-2.0*f);
  return mix(mix(mix(th_h31(i),th_h31(i+vec3(1,0,0)),f.x),mix(th_h31(i+vec3(0,1,0)),th_h31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(th_h31(i+vec3(0,0,1)),th_h31(i+vec3(1,0,1)),f.x),mix(th_h31(i+vec3(0,1,1)),th_h31(i+vec3(1,1,1)),f.x),f.y),f.z); }
// forged-carbon flakes: anisotropic Voronoi cells (random long axis per cell) -> (cellValue, cellId hash)
vec2 th_flake(vec3 p){
  vec3 ip = floor(p); float best = 1e9; float val = 0.0; float idv = 0.0;
  for (int k=-1;k<=1;k++) for (int j=-1;j<=1;j++) for (int i=-1;i<=1;i++){
    vec3 c = ip + vec3(i,j,k); vec3 r = th_h33(c);
    vec3 o = c + r; vec3 d = p - o;
    vec3 ax = normalize(th_h33(c+3.1)-0.5);
    float along = dot(d, ax); vec3 perp = d - along*ax;
    float dist = along*along*0.12 + dot(perp,perp)*1.6;
    if (dist < best){ best = dist; val = th_h31(c+7.7); idv = th_h31(c+11.3); }
  }
  return vec2(val, idv);
}`;

function patchMaterial(mat) {
  mat.userData.th = { forged: { value: 0 }, grain: { value: 1 }, ao: { value: 1 } };
  mat.vertexColors = true;   // COLOR_0 carries seam-cavity occlusion (see README)
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.thForged = mat.userData.th.forged;
    sh.uniforms.thGrain = mat.userData.th.grain;
    sh.uniforms.thAOk = mat.userData.th.ao;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vThObj;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvThObj = position;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vThObj;\nuniform float thForged;\nuniform float thGrain;\nuniform float thAOk;\n' + NOISE_GLSL)
      .replace('#include <aomap_fragment>', `#include <aomap_fragment>
        #ifdef USE_COLOR
        { float thAO = mix(1.0, vColor.r, thAOk);
          reflectedLight.directDiffuse *= thAO; reflectedLight.directSpecular *= thAO;
          reflectedLight.indirectDiffuse *= thAO; reflectedLight.indirectSpecular *= thAO; }
        #endif`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        vec2 thF = vec2(0.5);
        if (thForged > 0.5) { thF = th_flake(vThObj * 0.55); roughnessFactor = mix(0.18, 0.58, thF.x); }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        if (thForged > 0.5) { vec2 ff = th_flake(vThObj * 0.55); diffuseColor.rgb *= mix(0.55, 1.6, ff.x); }`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        {
          // baked-ceramic micro grain (fades out when it would alias)
          float px = length(fwidth(vThObj));
          float fade = thGrain * clamp(1.0 - px * 5.0, 0.0, 1.0);
          if (fade > 0.001) {
            vec3 q = vThObj * 9.0; float e = 0.35;
            float n0 = th_vnoise(q);
            vec3 gr = vec3(th_vnoise(q+vec3(e,0,0))-n0, th_vnoise(q+vec3(0,e,0))-n0, th_vnoise(q+vec3(0,0,e))-n0) / e;
            vec3 gv = (viewMatrix * vec4(gr, 0.0)).xyz;
            normal = normalize(normal - 0.045 * fade * (gv - dot(gv, normal) * normal));
          }
          if (thForged > 0.5) {
            vec2 ff = th_flake(vThObj * 0.55);
            vec3 tilt = (th_h33(vec3(ff.y*91.0, ff.y*17.0, ff.x*53.0)) - 0.5) * 0.55;
            vec3 tv = (viewMatrix * vec4(tilt, 0.0)).xyz;
            normal = normalize(normal + tv - dot(tv, normal) * normal);
          }
        }`);
  };
  mat.customProgramCacheKey = () => 'theseus-shell-v2';
  return mat;
}

function makeMaterials() {
  const P = (o) => new THREE.MeshPhysicalMaterial(o);
  const m = {
    shell: patchMaterial(P({ color: 0x0b0c0e })),
    button: patchMaterial(P({ color: 0x0b0c0e })),
    plate: patchMaterial(P({ color: 0x131416 })),
    engrave: P({ color: 0x2b2d31, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
    gold: P({ color: 0xe2c07a, metalness: 1.0, roughness: 0.24, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }),
    bay: P({ color: 0x121314, roughness: 0.45 }),
    steel: P({ color: 0xc9ced3, metalness: 1.0, roughness: 0.22 }),
    magnesium: P({ color: 0x9a9fa5, metalness: 1.0, roughness: 0.3 }),
    pom: P({ color: 0xf0eee7, roughness: 0.4, sheen: 0.25, sheenColor: 0xffffff }),
    brass: P({ color: 0xcfae62, metalness: 1.0, roughness: 0.3 }),
    lens: P({ color: 0x14181e, roughness: 0.22, clearcoat: 0.6, clearcoatRoughness: 0.25, specularIntensity: 0.6, envMapIntensity: 0.45 }),
    lensDark: P({ color: 0x050506, roughness: 0.2 }),
    cavity: new THREE.MeshBasicMaterial({ color: 0x050506 }),
  };
  return m;
}

function applyColorway(M, name) {
  const cw = COLORWAYS[name] || COLORWAYS.black;
  for (const key of ['shell', 'button', 'plate', 'engrave', 'bay']) {
    const mat = M[key], spec = cw[key];
    const forged = spec.forged ? 1 : 0;
    for (const [k, v] of Object.entries(spec)) {
      if (k === 'forged') continue;
      if (k === 'color' || k === 'sheenColor') mat[k].setHex(v); else mat[k] = v;
    }
    if (mat.userData.th) mat.userData.th.forged.value = forged;
    mat.needsUpdate = true;
  }
}

const XRAY_VS = `varying vec3 vN; varying vec3 vV;
void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`;
const XRAY_FS = `uniform vec3 color; uniform float k; uniform float power; uniform float base;
varying vec3 vN; varying vec3 vV;
void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), power); float a = (base + f) * k; gl_FragColor = vec4(color, clamp(a, 0.0, 1.0)); }`;

function smooth(a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

/**
 * Build the shell. Async (geometry is loaded from shell-<variant>.glb next to this module).
 * opts: variant ('theseus'|'sora'), colorway ('black'|'white'|'grey'|'forged'), theme ('paper'|'night', for x-ray tint),
 *       clickExaggeration (1 = 0.5 mm at the front edge), parts (module with buildScrollWheel/buildDotSkate/buildM2Screw;
 *       default: tries ../parts/parts.js, falls back to ./standins.js), glbUrl, metaUrl, grain (micro texture, default 1).
 */
export async function buildShell(opts = {}) {
  const variant = opts.variant || 'theseus';
  // the Theseus shell ships with one seam from the nose to the rear (tools/one_seam.py); the first build had a centre cap
  const glbUrl = opts.glbUrl || HERE + (variant === 'theseus' ? 'shell-theseus-1seam.glb' : `shell-${variant}.glb`);
  const metaUrl = opts.metaUrl || HERE + (variant === 'theseus' ? 'shell-theseus-1seam.json' : `shell-${variant}.json`);
  const [gltf, meta] = await Promise.all([
    new GLTFLoader().loadAsync(glbUrl),
    fetch(metaUrl).then(r => r.json()),
  ]);
  let PARTS = opts.parts || null;
  if (!PARTS) {
    try { const mod = await import('../parts/parts.js'); if (mod.buildScrollWheel) PARTS = mod; } catch (e) { /* not there yet */ }
  }
  const lib = { buildScrollWheel: (PARTS && PARTS.buildScrollWheel) || STANDIN.buildScrollWheel,
                buildDotSkate: (PARTS && PARTS.buildDotSkate) || STANDIN.buildDotSkate,
                buildM2Screw: (PARTS && PARTS.buildM2Screw) || STANDIN.buildM2Screw };

  const M = makeMaterials();
  applyColorway(M, opts.colorway || 'black');
  M.shell.userData.th.grain.value = M.button.userData.th.grain.value = M.plate.userData.th.grain.value = opts.grain ?? 1;

  const root = new THREE.Group(); root.name = 'theseusShell';
  const geoms = {};
  gltf.scene.traverse(o => { if (o.isMesh) geoms[o.name] = o.geometry; });
  const owned = new Set(Object.values(geoms));
  const matFor = { core: M.cavity, body: M.shell, bridge: M.shell, triggerL: M.shell, triggerR: M.shell, sideFront: M.button, sideRear: M.button, plate: M.plate,
                   wheelBay: M.bay, usbC: M.steel, engraveSerial: M.engrave, engraveLT: M.engrave, engraveRT: M.engrave, sideMark: M.gold };
  const mesh = (name) => {
    if (!geoms[name]) { const e = new THREE.Group(); e.name = name + '(absent)'; return e; }
    const m = new THREE.Mesh(geoms[name], matFor[name] || M.shell); m.name = name;
    m.castShadow = !name.startsWith('engrave') && name !== 'sideMark'; m.receiveShadow = true;
    return m;
  };
  const parts = {};
  // body (+ gold side mark, rides with it)
  const body = new THREE.Group(); body.name = 'body'; root.add(body);
  body.add(mesh('body'), mesh('usbC'), mesh('sideMark'));
  parts.body = body;
  // dark stand-in for the internals so seams and the lattice don't show daylight; hidden for x-ray / explode,
  // and when the real PCB is assembled into the shell (opts.core = false)
  const core = mesh('core'); core.castShadow = false; core.receiveShadow = false; core.visible = opts.core !== false && !!geoms.core;
  body.add(core); parts.core = core;
  const bay = new THREE.Group(); bay.name = 'wheelBayGroup'; root.add(bay);
  bay.add(mesh('wheelBay')); if (geoms.bridge) bay.add(mesh('bridge'));
  parts.wheelBayGroup = bay;
  // triggers on hinge pivots
  for (const s of ['L', 'R']) {
    const h = meta.hinge[s];
    const piv = new THREE.Group(); piv.name = 'trigger' + s; piv.position.fromArray(h.pivot);
    const inner = new THREE.Group(); inner.position.fromArray(h.pivot).multiplyScalar(-1); piv.add(inner);
    inner.add(mesh('trigger' + s));
    if (s === 'L') inner.add(mesh('engraveLT')); else { inner.add(mesh('engraveRT')); inner.add(mesh('engraveSerial')); }
    const ex = new THREE.Group(); ex.name = 'explode' + s; ex.add(piv); root.add(ex);
    parts['trigger' + s] = piv; parts['explode' + s] = ex;
  }
  // side buttons (slide on rails along -X)
  const sideBtns = [];
  for (const sb of meta.sideButtons) {
    const g = new THREE.Group(); g.name = sb.name; g.add(mesh(sb.name)); root.add(g); sideBtns.push({ g, sb }); parts[sb.name] = g;
  }
  // wheel (parts API frame: origin = PCB top under the wheel centre, centre at Y = axleHeight)
  const wc = meta.wheel.center, axleHeight = 12;
  const wheel = lib.buildScrollWheel({ diameter: 22.4, width: 7, axleHeight, encoder: opts.wheelEncoder ?? false, support: opts.wheelEncoder ?? false });
  wheel.position.set(wc[0], wc[1] - axleHeight, wc[2]);
  const wheelEx = new THREE.Group(); wheelEx.name = 'wheel'; wheelEx.add(wheel); root.add(wheelEx);
  parts.wheel = wheel;
  // bottom plate + lens + screws, skates on the rim pads (#10, #11, #52)
  const plate = new THREE.Group(); plate.name = 'plate'; plate.add(mesh('plate')); root.add(plate); parts.plate = plate;
  const lens = new THREE.Group(); lens.name = 'lens';
  {
    const lg = new THREE.CylinderGeometry(2.9, 2.9, 0.9, 48); owned.add(lg);
    const l = new THREE.Mesh(lg, M.lens); l.position.set(meta.sensor[0], 1.55, meta.sensor[1]); lens.add(l);
    const ag = new THREE.CylinderGeometry(1.05, 1.05, 0.2, 32); owned.add(ag);
    const a = new THREE.Mesh(ag, M.lensDark); a.position.set(meta.sensor[0], 2.1, meta.sensor[1]); lens.add(a);
    body.add(lens); parts.lens = lens;
  }
  const screws = [];
  for (const [x, z] of meta.screws) {
    const s = lib.buildM2Screw({ length: 4, finish: 'brass', detail: 'low' });   // seen by their heads only
    // head top recessed 0.1 mm inside the bottom face: bearing face up, shank up (+Y)
    const k = (s.userData.parts && s.userData.parts.head && s.userData.standIn) ? 0.9 : 1.6;
    s.rotation.x = Math.PI; s.position.set(x, meta.yBase + 0.1 + k, z);
    const g = new THREE.Group(); g.add(s); root.add(g); screws.push(g);
  }
  parts.screws = screws;
  const skates = [];
  for (const [x, z] of meta.skates) {
    const s = lib.buildDotSkate({ material: opts.skates || 'POM', diameter: 6.5, height: meta.yBase });
    s.position.set(x, 0, z);
    const g = new THREE.Group(); g.add(s); root.add(g); skates.push(g);
  }
  parts.skates = skates;
  for (const n of ['engraveSerial', 'engraveLT', 'engraveRT', 'sideMark', 'usbC', 'wheelBay', 'bridge']) parts[n] = root.getObjectByName(n) || null;

  // x-ray overlay meshes
  const xrayMat = new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(opts.theme === 'night' ? 0x9fc6ff : 0x23262b) }, k: { value: 0 }, power: { value: 2.2 }, base: { value: 0.035 } },
    vertexShader: XRAY_VS, fragmentShader: XRAY_FS, transparent: true, depthWrite: false,
    blending: opts.theme === 'night' ? THREE.AdditiveBlending : THREE.NormalBlending, side: THREE.DoubleSide,
  });
  const xrayTargets = ['body', 'triggerL', 'triggerR', 'sideFront', 'sideRear', 'plate', 'bridge'].map(n => root.getObjectByName(n)).filter(Boolean)
    .map(o => o.isMesh ? o : o.children.find(c => c.isMesh)).filter(Boolean);
  const xrayMeshes = xrayTargets.map(m => { const x = new THREE.Mesh(m.geometry, xrayMat); x.visible = false; x.renderOrder = 10; m.add(x); return x; });

  // ---------------- state setters (pure functions of their arguments)
  const state = { click: { L: 0, R: 0 }, scroll: 0, side: [0, 0], explode: 0, xray: 0 };
  const exag = opts.clickExaggeration ?? 1;
  function setClick(side, k) {
    k = Math.min(1, Math.max(0, k)); const s = side === 'R' ? 'R' : 'L'; state.click[s] = k;
    /* frontZ and travelFront live on meta.hinge itself (pivot and axis per side): reading them per side gave NaN, which
       blanked the whole scene (its bounding box, so its camera) the first time a click was set */
    const h = meta.hinge[s], frontZ = h.frontZ ?? meta.hinge.frontZ ?? 58.5, travel = h.travelFront ?? meta.hinge.travelFront ?? 0.5;
    const arm = Math.max(1, frontZ - h.pivot[2]);
    parts['trigger' + s].rotation.x = Math.asin(Math.min(1, k * travel * exag / arm));
  }
  function setScroll(rad) { state.scroll = rad; if (wheel.setScroll) wheel.setScroll(rad); }
  function setSideButton(i, k) {
    k = Math.min(1, Math.max(0, k)); const e = sideBtns[i]; if (!e) return; state.side[i] = k;
    e.g.position.fromArray(e.sb.press).multiplyScalar(k * e.sb.travel * exag);
  }
  const EXPLODE = [
    // [object, delay, direction*distance (mm at k = 1)]
    [parts.explodeL, 0.00, [11, 24, 4]], [parts.explodeR, 0.00, [-11, 24, 4]],
    [wheelEx, 0.10, [0, 40, 6]], [bay, 0.16, [0, 15, 3]],
    [parts.sideFront, 0.05, [17, 0, 0]], [parts.sideRear, 0.05, [17, 0, 0]],
    [root.getObjectByName('usbC'), 0.20, [0, 0, 16]],
    [plate, 0.08, [0, -18, 0]], [lens, 0.18, [0, -7, 0]],
    ...screws.map((s, i) => [s, 0.14 + 0.02 * i, [0, -32, 0]]),
    ...skates.map((s, i) => [s, 0.20 + 0.012 * i, [0, -26, 0]]),
  ];
  const base = new Map(EXPLODE.map(([o]) => [o, o.position.clone()]));
  function setExplode(k) {
    k = Math.min(1, Math.max(0, k)); state.explode = k;
    core.visible = coreOn();
    const aoK = 1 - 0.75 * smooth(0.0, 0.25, k);
    for (const mat of [M.shell, M.button, M.plate]) mat.userData.th.ao.value = aoK;
    for (const [o, d, v] of EXPLODE) {
      const t = smooth(d, d + 0.72, k);
      o.position.copy(base.get(o)).add(new THREE.Vector3(...v).multiplyScalar(t));
    }
    // side buttons keep their press offset on top of the explode offset
    sideBtns.forEach((e, i) => { const t = smooth(0.05, 0.77, k); e.g.position.set(17 * t, 0, 0).addScaledVector(new THREE.Vector3().fromArray(e.sb.press), state.side[i] * e.sb.travel * exag); });
  }
  const coreOn = () => opts.core !== false && !!geoms.core && state.xray < 0.02 && state.explode < 0.02;
  function setXray(k) {
    k = Math.min(1, Math.max(0, k)); state.xray = k; core.visible = coreOn();
    xrayMat.uniforms.k.value = k;
    xrayMeshes.forEach(x => { x.visible = k > 0.001; });
    for (const mat of [M.shell, M.button, M.plate, M.engrave, M.gold]) {
      const op = 1 - 0.94 * smooth(0, 1, k);
      mat.transparent = k > 0.001; mat.opacity = op; mat.depthWrite = k < 0.35; mat.needsUpdate = true;
    }
  }
  function setColorway(name) { applyColorway(M, name); }

  root.userData.parts = parts;
  root.userData.meta = meta;
  root.userData.views = SHELL_VIEWS;
  root.userData.materials = M;
  root.userData.state = state;
  root.userData.partsSource = PARTS ? 'parts/parts.js' : 'standins.js';
  Object.assign(root, { setClick, setScroll, setSideButton, setExplode, setXray, setColorway });
  root.dispose = () => {
    owned.forEach(g => g.dispose());
    Object.values(M).forEach(m => m.dispose());
    xrayMat.dispose();
    [wheel, ...screws.map(s => s.children[0]), ...skates.map(s => s.children[0])].forEach(o => o && o.dispose && o.dispose());
  };
  return root;
}

/** Apply a SHELL_VIEWS preset to a PerspectiveCamera. */
export function applyView(camera, view) {
  const v = typeof view === 'string' ? SHELL_VIEWS[view] : view;
  camera.position.fromArray(v.position); camera.up.fromArray(v.up); camera.fov = v.fov;
  camera.lookAt(new THREE.Vector3().fromArray(v.target));
  const d = camera.position.distanceTo(new THREE.Vector3().fromArray(v.target));
  camera.near = Math.max(0.5, d * 0.2); camera.far = d * 4; camera.updateProjectionMatrix();
}
