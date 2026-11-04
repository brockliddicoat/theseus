// Deck bundle entry: three.js + the Theseus assets, registered as named scenes for the deck's view3D().
// Built by 3d/integration/build.mjs into deck/vendor/r3d.js; asset files are copied (and compressed) into
// deck/dist/assets/ next to the page. Each scene adapts one builder to a uniform state object:
//   asset state: explode, xray, clickL, clickR, pressL, pressR, press, scroll, side0, side1, power (+powerMode),
//                reflow, cut, build, stress (+stressCase), compare, cutaway, section, insert, drive, colorway, filletZoom
//   camera:      view (named, see lib/studio.js VIEWS), yaw / pitch (radians, orbit about the target), zoom (1 = framed),
//                target [x,y,z] (mm), fov (deg), lift (mm, raises the target)
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import R3D from './bridge.js';
import { VIEWS } from '../lib/studio.js';
import { buildShell } from '../shell/shell.js';
import { buildPcb } from '../pcb/pcb.js';
import * as PARTS from '../parts/parts.js';
import { buildLattice } from '../lattice/lattice.js';

// every GLTFLoader (including the ones inside the builders) can read meshopt-compressed files
const _load = GLTFLoader.prototype.load;
GLTFLoader.prototype.load = function (...a) { if (!this.meshoptDecoder) this.setMeshoptDecoder(MeshoptDecoder); return _load.apply(this, a); };

R3D.setAssetBase((typeof window !== 'undefined' && window.R3D_ASSETS) || 'assets/');
const A = n => R3D.assetUrl(n);

function call(o, fn, ...args) {
  const f = (o && typeof o[fn] === 'function' && o[fn]) || (o && o.userData && typeof o.userData[fn] === 'function' && o.userData[fn]);
  if (f) { f.apply(o, args); return true; }
  return false;
}
const last = new WeakMap();
/** apply only the keys that changed since the last frame (setters can be costly) */
function applyState(o, s) {
  const prev = last.get(o) || {}; const next = {};
  const ch = k => { next[k] = s[k]; return s[k] !== undefined && s[k] !== prev[k]; };
  if (ch('explode')) call(o, 'setExplode', s.explode);
  if (ch('xray')) call(o, 'setXray', s.xray);
  if (ch('clickL')) call(o, 'setClick', 'L', s.clickL);
  if (ch('clickR')) call(o, 'setClick', 'R', s.clickR);
  if (ch('pressL')) call(o, 'setPress', 'L', s.pressL);
  if (ch('pressR')) call(o, 'setPress', 'R', s.pressR);
  if (ch('press')) call(o, 'setPress', s.press);
  if (ch('scroll')) call(o, 'setScroll', s.scroll);
  if (ch('side0')) call(o, 'setSideButton', 0, s.side0);
  if (ch('side1')) call(o, 'setSideButton', 1, s.side1);
  if (ch('power') || ch('powerMode') || ch('powerT')) call(o, 'setPower', s.power ?? 0, { mode: s.powerMode || 'charge', t: s.powerT ?? 0 });
  if (ch('reflow')) call(o, 'setReflow', s.reflow);
  if (ch('cut')) call(o, 'setCut', s.cut);
  if (ch('build')) call(o, 'setBuild', s.build);
  if (ch('stress') || ch('stressCase')) call(o, 'setStress', s.stress ?? 0, s.stressCase);
  if (ch('compare')) call(o, 'setCompare', s.compare);
  if (ch('cutaway')) call(o, 'setCutaway', s.cutaway);
  if (ch('section')) call(o, 'setSection', s.section);
  if (ch('insert')) call(o, 'setInsert', s.insert);
  if (ch('drive')) call(o, 'setDrive', s.drive);
  if (ch('colorway')) call(o, 'setColorway', s.colorway);
  if (ch('filletZoom')) call(o, 'setFilletZoom', s.filletZoom);
  last.set(o, Object.assign({}, prev, next));
}

/** camera: frame the root at rest, then orbit/zoom from state (deterministic in state).
   The framing is measured once, when the scene is built and nothing has moved yet. (It used to be measured on the first
   frame drawn, so a scene whose first frame was exploded framed itself larger and every later zoom came out smaller:
   live playback, which enters at t = 0, and screenshots at the settled time framed the same shot differently.) */
function cameraFor(studio, root, base) {
  const box = new THREE.Box3(), c = new THREE.Vector3(), size = new THREE.Vector3();
  root.updateMatrixWorld(true); box.setFromObject(root); box.getCenter(c); box.getSize(size);
  const framed = { c: c.clone(), r: 0.5 * size.length() };
  return (cam, s) => {
    const view = s.view || base.view || 'threeQuarter';
    const d0 = new THREE.Vector3(...(Array.isArray(view) ? view : (VIEWS[view] || VIEWS.threeQuarter))).normalize();
    const yaw = (s.yaw || 0), pitch = (s.pitch || 0);
    const d = d0.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    const right = new THREE.Vector3().crossVectors(d, new THREE.Vector3(0, 1, 0));
    if (right.lengthSq() > 1e-6 && pitch) d.applyAxisAngle(right.normalize(), pitch);
    const fov = s.fov || base.fov || 22; if (cam.fov !== fov) { cam.fov = fov; }
    const tgt = s.target ? new THREE.Vector3(...s.target) : framed.c.clone();
    if (s.lift) tgt.y += s.lift;
    const dist = framed.r * (base.margin || 1.12) / Math.sin(THREE.MathUtils.degToRad(fov / 2)) / Math.min(1, cam.aspect) / (s.zoom || 1);
    cam.position.copy(tgt).addScaledVector(d, dist);
    cam.up.set(0, 1, 0); if (Math.abs(d.y) > 0.99) cam.up.set(0, 0, -1 * Math.sign(d.y));
    cam.lookAt(tgt); cam.near = Math.max(0.5, dist - framed.r * 4); cam.far = dist + framed.r * 4; cam.updateProjectionMatrix();
  };
}

/* every state key each scene takes, at rest. A frame applies these under the slide's own state, so a key a slide leaves out
   goes back to rest instead of keeping whatever the previous slide set (an exploded or recoloured shell turning up on the
   next slide that uses it, when the presenter moves faster than the idle scenes are freed). */
const REST = {
  shell: { explode: 0, xray: 0, clickL: 0, clickR: 0, side0: 0, side1: 0, scroll: 0, colorway: 'black' },
  pcb: { explode: 0, xray: 0, power: 0, powerMode: 'charge', powerT: 0, reflow: 0, pressL: 0, pressR: 0 },
  gt01: { press: 0, cutaway: 0, explode: 0 },
  wheel: { scroll: 0, explode: 0, xray: 0 },
  claw: { insert: 0, section: 0, explode: 0 },
  screw: { drive: 0, section: 0, explode: 0 },
  skates: { explode: 0 },
  battery: { explode: 0 },
  lattice: { cut: 0, build: 1, stress: 0, stressCase: 'press', compare: 'tri', filletZoom: 0 },
};
REST['shell-sora'] = REST.shell;
function scene(key, build, base = {}) {
  R3D.register(key, async (studio) => {
    const obj = await build(studio);
    const root = obj.root || obj;
    if (obj.userData && obj.userData.ready && obj.userData.ready.then) await obj.userData.ready;
    root.traverse(m => { if (m.isMesh && m.castShadow === undefined) m.castShadow = true; });
    studio.scene.add(root);
    if (base.ground === false) studio.ground.visible = false;
    const cam = cameraFor(studio, root, base);
    const api = obj.api || obj, rest = REST[key] || {};
    if (base.init) applyState(api, base.init);
    return {
      root,
      update(state, t) { applyState(api, Object.assign({}, rest, base.init || {}, state)); if (api.tick) api.tick(t); },
      camera(c, state) { cam(c, Object.assign({}, base.cam || {}, state)); },
    };
  });
}

scene('shell', () => buildShell({ variant: 'theseus', glbUrl: A('shell-theseus.glb'), metaUrl: A('shell-theseus.json'), parts: PARTS }), { view: 'threeQuarter' });
scene('shell-sora', () => buildShell({ variant: 'sora', glbUrl: A('shell-sora.glb'), metaUrl: A('shell-sora.json'), parts: PARTS }), { view: 'threeQuarter' });
scene('pcb', () => buildPcb({ glb: A('pcb.glb'), layout: A('pcb-layout.json'), useParts: false, gt01: PARTS.buildGT01, millmax: PARTS.buildMillMax3305, wheel: PARTS.buildScrollWheel }), { view: 'threeQuarter' });
scene('gt01', () => PARTS.buildGT01(), { view: 'threeQuarter', margin: 1.25 });
scene('wheel', () => PARTS.buildScrollWheel(), { view: 'threeQuarter', margin: 1.25 });
scene('claw', () => PARTS.buildMillMax3305(), { view: 'threeQuarter', margin: 1.3 });
scene('screw', () => PARTS.buildScrewJoint(), { view: 'front', margin: 1.3 });
scene('skates', () => PARTS.buildDotSkateSet ? PARTS.buildDotSkateSet() : PARTS.buildDotSkate(), { view: 'top' });
scene('battery', () => PARTS.buildBattery(), { view: 'threeQuarter', margin: 1.2 });
scene('lattice', () => buildLattice({ assetBase: A('') }), { view: 'threeQuarter' });

export default R3D;
