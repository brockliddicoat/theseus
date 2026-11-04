// Shared studio for every Theseus 3D asset: one look, one lighting rig, one camera vocabulary.
// Units are millimetres. +X = the user's LEFT (right-handed, see CONVENTIONS.md), +Y = up (Y = 0 is the mouse pad), +Z = forward (toward the scroll wheel).
//
//   import * as THREE from 'three';
//   import { createStudio } from '../lib/studio.js';
//   const studio = createStudio({ canvas, theme: 'paper' });
//   studio.scene.add(myGroup);
//   studio.frame(myGroup, { view: 'threeQuarter' });
//   studio.render();               // or studio.loop(t => { ...animate...; })
//   window.__ready = true;         // headless screenshot hook (see tools/shot.mjs)
//
// Themes match the deck: 'paper' (#f7f6f2, the XBAB light grey) and 'night' (#0d0e0f).
// Highlights are Theseus's colour (HIGHLIGHT below), flat, never a glow.

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/** Theseus's highlight, as the deck draws it (C.hero). The deck passes its live value at every render
    (R3D.setColors, so Brock's ?hue= setting reaches the 3D); these are only the defaults for standalone pages. */
export const HIGHLIGHT = { night: 0x2f8cff, paper: 0x0a6cff };

export const THEMES = {
  paper: { bg: 0xf7f6f2, ground: 0xf7f6f2, shadow: 0.30, exposure: 1.0 },
  night: { bg: 0x0d0e0f, ground: 0x0d0e0f, shadow: 0.55, exposure: 1.05 },
};

/** Named camera directions (unit vectors from target to camera, before distance). */
export const VIEWS = {
  top: [0, 1, 0.0001],
  bottom: [0, -1, 0.0001],
  front: [0, 0.12, 1],
  back: [0, 0.12, -1],
  left: [-1, 0.08, 0],
  right: [1, 0.08, 0],
  threeQuarter: [-0.78, 0.62, 0.95],     // front-left, above: the RTINGS hero angle
  threeQuarterRight: [0.78, 0.62, 0.95],
  low: [-0.9, 0.22, 0.75],
};

export function createStudio(opts = {}) {
  const theme = THEMES[opts.theme || 'paper'];
  const canvas = opts.canvas || document.querySelector('canvas');
  const w = opts.width || canvas.clientWidth || 1600, h = opts.height || canvas.clientHeight || 900;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: !!opts.transparent, preserveDrawingBuffer: true });
  renderer.setPixelRatio(opts.pixelRatio || Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(w, h, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = theme.exposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  const scene = new THREE.Scene();
  if (!opts.transparent) scene.background = new THREE.Color(theme.bg);

  // image-based light: a neutral studio room, blurred (product-shot reflections on matte plastic and gold)
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = opts.envIntensity ?? 0.9;

  // key + rim lights (soft shadow from the key)
  const key = new THREE.DirectionalLight(0xffffff, opts.key ?? 2.2);
  key.position.set(-120, 220, 140); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -120, right: 120, top: 120, bottom: -120, near: 10, far: 600 });
  key.shadow.radius = 10; key.shadow.blurSamples = 16; key.shadow.bias = -0.0004;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, opts.rim ?? 1.4); rim.position.set(160, 90, -180); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, opts.fill ?? 0.35); fill.position.set(200, 40, 120); scene.add(fill);

  // ground: only receives a soft shadow; invisible otherwise
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.ShadowMaterial({ opacity: theme.shadow }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; ground.visible = opts.ground !== false;
  scene.add(ground);

  const camera = new THREE.PerspectiveCamera(opts.fov || 22, w / h, 1, 5000);

  /** Put the camera on a named view (or a [x,y,z] direction) so the object fills the frame. */
  function frame(obj, o = {}) {
    const box = new THREE.Box3().setFromObject(obj);
    const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
    const r = 0.5 * Math.hypot(s.x, s.y, s.z) * (o.margin || 1.12);
    const dir = new THREE.Vector3(...(Array.isArray(o.view) ? o.view : VIEWS[o.view || 'threeQuarter'])).normalize();
    const dist = r / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) / Math.min(1, camera.aspect) ;
    camera.position.copy(c).addScaledVector(dir, dist);
    camera.up.set(0, 1, 0);
    if (Math.abs(dir.y) > 0.99) camera.up.set(0, 0, -1 * Math.sign(dir.y));
    camera.lookAt(o.target ? new THREE.Vector3(...o.target) : c);
    camera.near = Math.max(0.5, dist - r * 3); camera.far = dist + r * 3; camera.updateProjectionMatrix();
    return { center: c, size: s, dist };
  }

  /** Orthographic helper for silhouette checks: returns an OrthographicCamera looking down a named axis. */
  function ortho(obj, view = 'top', pad = 1.05) {
    const box = new THREE.Box3().setFromObject(obj);
    const c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
    const half = Math.max(s.x, s.y, s.z) * 0.5 * pad;
    const cam = new THREE.OrthographicCamera(-half * camera.aspect, half * camera.aspect, half, -half, 0.1, 5000);
    const dir = new THREE.Vector3(...VIEWS[view]).normalize();
    cam.position.copy(c).addScaledVector(dir, 1000);
    if (view === 'top') cam.up.set(0, 0, -1); else cam.up.set(0, 1, 0);
    cam.lookAt(c); cam.updateProjectionMatrix();
    return cam;
  }

  function render(cam = camera) { renderer.render(scene, cam); }
  let raf = 0;
  function loop(fn) {
    const t0 = performance.now();
    const tick = () => { const t = (performance.now() - t0) / 1000; fn && fn(t); render(); raf = requestAnimationFrame(tick); };
    tick();
    return () => cancelAnimationFrame(raf);
  }
  function resize(W, H) { renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); }

  return { THREE, renderer, scene, camera, key, rim, fill, ground, frame, ortho, render, loop, resize, theme, themeName: THEMES[opts.theme] ? opts.theme : 'paper' };
}

/** Material library shared by every asset, so parts look like they belong to one product. */
export function materials(themeName = 'paper') {
  const M = THREE;
  return {
    // shell: matte black, slightly satin (baked ceramic coat over carbon-filled PP)
    shell: new M.MeshPhysicalMaterial({ color: 0x111214, roughness: 0.62, metalness: 0.0, clearcoat: 0.25, clearcoatRoughness: 0.55, sheen: 0.25, sheenRoughness: 0.8, sheenColor: 0x2a2b2e }),
    shellWhite: new M.MeshPhysicalMaterial({ color: 0xe9e8e4, roughness: 0.55, clearcoat: 0.2, clearcoatRoughness: 0.5 }),
    // PCB
    mask: new M.MeshPhysicalMaterial({ color: 0x0b0c0e, roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.35 }),
    maskCopper: new M.MeshPhysicalMaterial({ color: 0x15161a, roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.3 }), // traces seen through mask
    gold: new M.MeshPhysicalMaterial({ color: 0xe8c172, metalness: 1.0, roughness: 0.28 }),          // ENIG / hard gold
    copper: new M.MeshPhysicalMaterial({ color: 0xd08a5a, metalness: 1.0, roughness: 0.32 }),
    silk: new M.MeshStandardMaterial({ color: 0xf2f2ee, roughness: 0.8 }),
    fr4: new M.MeshStandardMaterial({ color: 0x8f8a62, roughness: 0.7 }),                             // board edge core
    steel: new M.MeshPhysicalMaterial({ color: 0xc9ced3, metalness: 1.0, roughness: 0.22 }),
    magnesium: new M.MeshPhysicalMaterial({ color: 0xb8bcc0, metalness: 1.0, roughness: 0.34, anisotropy: 0.6 }),
    brass: new M.MeshPhysicalMaterial({ color: 0xd2b061, metalness: 1.0, roughness: 0.3 }),
    pom: new M.MeshPhysicalMaterial({ color: 0xf1f0ea, roughness: 0.42, sheen: 0.3 }),
    ptfe: new M.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.3 }),
    epoxyBlack: new M.MeshPhysicalMaterial({ color: 0x141416, roughness: 0.35, clearcoat: 0.5 }),       // IC packages
    ceramic: new M.MeshPhysicalMaterial({ color: 0xd9d2c3, roughness: 0.5 }),                         // MLCC body
    clearPC: new M.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.08, transmission: 0.92, thickness: 0.8, ior: 1.58, transparent: true }),
    tintPink: new M.MeshPhysicalMaterial({ color: 0xff9aa8, roughness: 0.1, transmission: 0.85, thickness: 0.8, ior: 1.58, transparent: true }), // GT01 cover tint
    rubber: new M.MeshStandardMaterial({ color: 0x1a1b1d, roughness: 0.92 }),
    accent: new M.MeshStandardMaterial({ color: HIGHLIGHT[themeName] ?? HIGHLIGHT.paper, roughness: 0.45 }),   // Theseus's highlight (was XBAB yellow); the deck's C.hero wins at run time
  };
}
