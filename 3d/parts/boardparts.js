// Board-mounted parts for the Theseus PCB, from Brock's reference photos (2026-11-04):
//   buildRadioModule  — the radio module, black, with the long meander PCB antenna of the Raytac MDBT50Q-style
//                       modules (Brock: "use the long antenna design i've attached", "it should be black instead of
//                       blue"); the board turns it so the antenna end sits away from the wheel's metal.
//   buildSensorModule — the sensor as a small module board with 2 × 8 castellated gold half-holes soldered to the main
//                       board (as Razer's FP-3 and the PAW39xx-class modules are built), laser-marked PAW3970DM-T5QU on
//                       top (Brock, F26.9: no code on it; the suffix is derived, see the marking below).
//   buildSnapLens     — the clear snap-on lens under the board: two optical domes under the sensor's aperture, a peg
//                       and snap head at each end through the board.
// All three: millimetres, +Y up, origin on the main board's top surface at the part's centre. The board is 1.0 thick.
// The sensor is PixArt's PAW3970 (F21.6: the Viper V4 Pro's Focus Pro 50K Gen-3 is a renamed PAW3970); the radio
// module's silicon is Nordic's nRF54LM20A; no maker's logos, IDs or certification marks are drawn.
import * as THREE from 'three';
import { partMaterials } from './lib/materials.js';
import { extrude, lathe, sweep, rectSection, roundedRectShape, circlePath, filletPolygon, meshOf, disposeTree } from './lib/geom.js';

const TAU = Math.PI * 2;
const yFlip = (g) => { g.rotateX(-Math.PI / 2); return g; };      // shape (x, y) + extrusion e → (x, e, −y)

/** deterministic module pattern for a 2D code (an L finder like a Data Matrix, not a scannable QR) */
function codePattern(n, seed) {
  let a = seed >>> 0; const r = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const g = [];
  for (let j = 0; j < n; j++) { g.push([]); for (let i = 0; i < n; i++) g[j].push(i === 0 || j === n - 1 ? 1 : (j === 0 ? i % 2 : (i === n - 1 ? (j + 1) % 2 : (r() > 0.52 ? 1 : 0)))); }
  return g;
}
function canvasTexture(w, h, draw) {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
/** a flat quad in the XZ plane, facing up, with UVs (u along +x, v along −z) */
function quadXZ(w, d, y, cx = 0, cz = 0) {
  const g = new THREE.PlaneGeometry(w, d); g.rotateX(-Math.PI / 2); g.translate(cx, y, cz);
  return g;
}

// ============================================================================================ radio module
export const RADIO_SPEC = { size: [9.9, 13.3, 2.0], name: 'Raytac AN54LM-P20A', antenna: 'long meander PCB trace, ~3.4 mm end band (the MDBT50Q-style long antenna, F21.4)', silicon: 'nRF54LM20A', label: 'representative' };

export function buildRadioModule(opts = {}) {
  const M = partMaterials(opts.materials);
  const userMats = new Set(Object.values(opts.materials || {}));
  const own = new Set(Object.values(M).filter(m => !userMats.has(m)));
  const root = new THREE.Group(); root.name = 'RadioModule';
  const W = 9.9, Lm = 13.3, T = 0.8;
  const z0 = -Lm / 2, z1 = Lm / 2, zAnt = z1 - 3.6;                 // antenna band at +z: forward, toward the sensor (board plan 5)
  // substrate: black FR4, every edge broken
  const sub = meshOf(yFlip(extrude(roundedRectShape(W, Lm, 0.18), { depth: T, front: { r: 0.04, s: 1 }, back: { r: 0.03, s: 1 }, curveSegments: 6 })).translate(0, 0.04, 0), M.maskBlack, 'substrate');
  root.add(sub);
  // castellated pads: both long sides under the shield, and the rear end; gold half-holes and pads, on the board's
  // U1 footprint (pcb.glb, AN54LM-20A land pattern: 12 a side and 11 across the end, 0.8 mm pitch), so they land on its
  // pads once the board has turned them with the module (pcb.js flipFootprint)
  const cast = new THREE.Group(); cast.name = 'castellations';
  const halfHole = (x, z, rot) => {
    const g = lathe([[0.24, T + 0.04], [0.24, 0.04]], { segments: 10, phiStart: rot, phiLength: Math.PI });   // faces the hole's axis
    g.translate(x, 0, z); return meshOf(g, M.gold, 'halfHole');
  };
  const padTop = (x, z, w, d) => meshOf(yFlip(extrude(roundedRectShape(w, d, 0.06), { depth: 0.02, curveSegments: 2 })).translate(x, T + 0.04, z), M.gold, 'pad');
  for (let i = 0; i < 12; i++) {
    const z = z0 + 0.75 + i * 0.8;
    for (const s of [1, -1]) { cast.add(halfHole(s * W / 2, z, s > 0 ? -Math.PI : 0)); cast.add(padTop(s * (W / 2 - 0.28), z, 0.56, 0.5)); }
  }
  for (let i = 0; i < 11; i++) { const x = -4.0 + i * 0.8; cast.add(halfHole(x, z0, -Math.PI / 2)); cast.add(padTop(x, z0 + 0.28, 0.5, 0.56)); }
  root.add(cast);
  // shield can: drawn nickel silver over the radio end, a laser-marked top
  const shW = 9.1, shZ0 = z0 + 0.35, shZ1 = zAnt - 0.25, shH = 1.15, yS = T + 0.04;
  const can = meshOf(yFlip(extrude(roundedRectShape(shW, shZ1 - shZ0, 0.35), { depth: shH, front: { r: 0.12, s: 3 }, curveSegments: 6 })).translate(0, yS, (shZ0 + shZ1) / 2), M.shieldNickel, 'shield');
  root.add(can);
  const tex = canvasTexture(1024, 1060, (x, w, h) => {
    x.fillStyle = '#000'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#fff'; x.textBaseline = 'alphabetic';
    const F = (wt, s) => `${wt} ${s}px Inter, "Helvetica Neue", Arial, sans-serif`;
    x.save(); x.translate(w * 0.86, h * 0.08); x.rotate(Math.PI / 2);
    x.font = F(600, 92); x.fillText('nRF54LM20A', 0, 0);
    x.font = F(500, 70); x.fillText('BLE 6.0  2.4 GHz', 0, 118); x.fillText('MODULE  PCB ANTENNA', 0, 218);
    x.font = F(500, 58); x.fillText('PROPOSAL  REV A', 0, 318);
    x.restore();
    const g = codePattern(14, 54), cs = 22, ox = 70, oy = h - 70 - 14 * cs;
    for (let j = 0; j < 14; j++) for (let i = 0; i < 14; i++) if (g[j][i]) x.fillRect(ox + i * cs, oy + j * cs, cs, cs);
  });
  if (tex) {
    const lm = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, alphaMap: tex, metalness: 0.6, roughness: 0.62, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    lm.color.set(0x6d6c68); own.add(lm);
    const lab = new THREE.Mesh(quadXZ(shW - 0.9, shZ1 - shZ0 - 0.9, yS + shH + 0.002, 0, (shZ0 + shZ1) / 2), lm); lab.name = 'laser';
    root.add(lab);
  }
  // the meander antenna: copper under the black mask, seen as relief (feed near the shield, ~6 turns across)
  const pts = [], zA = zAnt + 0.55, zB = z1 - 0.55, x0 = -W / 2 + 0.85, x1 = W / 2 - 0.75, nT = 6;
  pts.push(new THREE.Vector3(x0, 0, zA - 0.35), new THREE.Vector3(x0, 0, zB));
  for (let i = 0; i < nT; i++) {
    const xa = x0 + (x1 - x0) * (i + 0.5) / nT, xb = x0 + (x1 - x0) * (i + 1) / nT;
    const top = i % 2 === 0 ? zB : zA, bot = i % 2 === 0 ? zA : zB;
    pts.push(new THREE.Vector3(xa, 0, top), new THREE.Vector3(xa, 0, bot), new THREE.Vector3(xb, 0, bot));
  }
  const path = [];
  for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], n = Math.max(2, Math.ceil(a.distanceTo(b) / 0.15)); for (let k = 0; k < n; k++) path.push(a.clone().lerp(b, k / n)); }
  path.push(pts[pts.length - 1].clone());
  // (a sweep across sharp 90° turns: round them a little so the relief reads as an etched trace)
  const trace = sweep(path.map(p => new THREE.Vector3(p.x, T + 0.04 + 0.018, p.z)), rectSection(0.032, 0.42, 0.012), { up: [0, 1, 0], crease: 60 });
  root.add(meshOf(trace, M.maskRelief, 'antenna'));
  // the matching part at the feed: an 0402 with tin ends
  const r0402 = new THREE.Group(); r0402.name = 'matching';
  r0402.add(meshOf(yFlip(extrude(roundedRectShape(0.5, 0.62, 0.04), { depth: 0.34, front: { r: 0.03, s: 1 }, curveSegments: 2 })).translate(0, 0, 0), M.ceramic, 'body'));
  for (const s of [1, -1]) r0402.add(meshOf(yFlip(extrude(roundedRectShape(0.52, 0.2, 0.04), { depth: 0.36, front: { r: 0.04, s: 1 }, curveSegments: 2 })).translate(0, 0, s * 0.4), M.tin, 'end'));
  r0402.position.set(x0 + 0.95, T + 0.04, zAnt + 0.05); r0402.rotation.y = Math.PI / 2;
  root.add(r0402);
  root.userData.spec = { ...RADIO_SPEC, antennaBand: [zAnt, z1] };
  root.userData.parts = { substrate: sub, shield: can, castellations: cast, antenna: root.getObjectByName('antenna') };
  root.dispose = () => { disposeTree(root, userMats); for (const m of own) m.dispose?.(); };
  return root;
}

// ============================================================================================ sensor module
export const SENSOR_SPEC = { size: [8.4, 9.8, 0.6], pads: '2 × 8 castellated, 1.2 mm pitch', label: 'PixArt PAW3970 in a module package, marked PAW3970DM-T5QU (suffix derived)',
  marking: ['PAW3970DM', '-T5QU'] };

export function buildSensorModule(opts = {}) {
  const M = partMaterials(opts.materials);
  const userMats = new Set(Object.values(opts.materials || {}));
  const own = new Set(Object.values(M).filter(m => !userMats.has(m)));
  const root = new THREE.Group(); root.name = 'SensorModule';
  const W = 8.4, Lz = 9.8, T = 0.62, y0 = 0.05, pitch = 1.2, n = 8;
  // outline with stepped corners, as the photographed modules have
  const hw = W / 2, hl = Lz / 2, cx = 0.55, cz = 0.4;
  const out = [[hw, -hl + cz], [hw, hl - cz], [hw - cx, hl - cz], [hw - cx, hl], [-hw + cx, hl], [-hw + cx, hl - cz], [-hw, hl - cz], [-hw, -hl + cz], [-hw + cx, -hl + cz], [-hw + cx, -hl], [hw - cx, -hl], [hw - cx, -hl + cz]];
  const shp = filletPolygon(out, 0.08, false, 2);
  const sub = meshOf(yFlip(extrude(shp, { depth: T, front: { r: 0.03, s: 1 }, back: { r: 0.02, s: 1 }, curveSegments: 4 })).translate(0, y0, 0), M.maskBlack, 'substrate');
  root.add(sub);
  // castellations + the solder fillets that run out onto the main board's pads (x 4.03 → 5.07 on the board)
  const cast = new THREE.Group(); cast.name = 'castellations';
  const fil = new THREE.Shape(); fil.moveTo(0, 0); fil.lineTo(0.86, 0); for (let i = 1; i <= 8; i++) { const a = (i / 8) * Math.PI / 2; fil.lineTo(0.86 - 0.86 * Math.sin(a), 0.5 - 0.5 * Math.cos(a)); }
  fil.lineTo(0, 0);
  for (let i = 0; i < n; i++) {
    const z = (i - (n - 1) / 2) * pitch;
    for (const s of [1, -1]) {
      const hh = lathe([[0.27, y0 + T], [0.27, y0]], { segments: 10, phiStart: s > 0 ? -Math.PI : 0, phiLength: Math.PI });
      hh.translate(s * hw, 0, z); cast.add(meshOf(hh, M.gold, 'halfHole'));
      cast.add(meshOf(yFlip(extrude(roundedRectShape(0.62, 0.62, 0.08), { depth: 0.02, curveSegments: 3 })).translate(s * (hw - 0.3), y0 + T, z), M.gold, 'pad'));
      const fg = extrude(fil, { depth: 0.56, curveSegments: 2 }); fg.translate(0, 0, -0.28);   // in the (x, y) plane, across z
      if (s < 0) fg.scale(-1, 1, 1);
      fg.translate(s * hw, 0.03, z);
      if (s < 0) { const idx = fg.index; if (!idx) { const p = fg.attributes.position.array; for (let k = 0; k < p.length; k += 9) for (let c = 0; c < 3; c++) { const t = p[k + 3 + c]; p[k + 3 + c] = p[k + 6 + c]; p[k + 6 + c] = t; } } fg.computeVertexNormals(); }
      cast.add(meshOf(fg, M.solder, 'fillet'));
    }
  }
  root.add(cast);
  // test pads, fiducials, the label
  for (const [x, z] of [[-2.6, -3.85], [-1.7, -3.85], [1.7, 3.85], [2.6, 3.85]]) root.add(meshOf(yFlip(extrude(roundedRectShape(0.62, 0.62, 0.05), { depth: 0.02, curveSegments: 2 })).translate(x, y0 + T, z), M.gold, 'testPad'));
  for (const [x, z] of [[-2.9, 3.6], [2.9, -3.6]]) {
    const ring = new THREE.Shape(); ring.absarc(0, 0, 0.42, 0, TAU, false); ring.holes.push(circlePath(0.26));
    root.add(meshOf(yFlip(extrude(ring, { depth: 0.012, curveSegments: 24 })).translate(x, y0 + T, z), M.goldSatin, 'fiducial'));
  }
  // the marking (Brock, F26.9: "remove the qr code off the sensor and engrave the sensor with PAW3970 and then whatever
  // letters are on the actual sensor to make it look like a real sku ... derive"): laser-marked into the black top, no
  // sticker, no code. PixArt's gaming navigation chips read <PMW|PAW><model>DM-T<n>QU (PMW3360DM-T2QU, PMW3389DM-T3QU,
  // PAW3395DM-T6QU, PAW3950DM-T5QU: DM is the 16-pin package); the PAW3970 keeps its predecessor PAW3950's -T5QU.
  const tex = canvasTexture(1024, 448, (x, w, h) => {
    x.clearRect(0, 0, w, h);
    x.fillStyle = '#b4b3ae'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = '700 132px Inter, "Helvetica Neue", Arial, sans-serif'; x.fillText(SENSOR_SPEC.marking[0], w / 2, h * 0.33, w * 0.86);
    x.font = '700 116px Inter, "Helvetica Neue", Arial, sans-serif'; x.fillText(SENSOR_SPEC.marking[1], w / 2, h * 0.74, w * 0.86);
  });
  const labMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: tex, transparent: true, roughness: 0.85, metalness: 0,
    depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  own.add(labMat);
  // read from above with the nose up (the user's right on the right, -x): u runs along -x, the text's top toward +z
  const lab = new THREE.Mesh(quadXZ(6.6, 2.9, y0 + T + 0.004).rotateY(Math.PI), labMat); lab.name = 'marking';
  lab.renderOrder = 2;
  if (!tex) lab.visible = false;
  root.add(lab);
  root.userData.spec = { ...SENSOR_SPEC };
  root.userData.parts = { substrate: sub, castellations: cast, label: lab };
  root.dispose = () => { disposeTree(root, userMats); for (const m of own) m.dispose?.(); };
  return root;
}

// ============================================================================================ snap-on lens
// H1, 2026-11-06 (b04's catch): PixArt's Z, lens reference plane to the surface, is 2.4 mm (2.2 to 2.6, PAW3395 / PMW3360
// datasheets). With the board's top 5.03 mm over the pad, the lens's lowest point (the imaging dome) sits 2.63 below the board's
// top, 1.12 mm shallower than before (it was 1.28 mm over the pad, out of focus): the upper block to board top − 1.75, the
// lower block to − 2.13, the collars to − 2.20, the imaging dome to − 2.63, the light dome to − 2.50; the optics unchanged
export const LENS_SPEC = { body: [5.2, 9.6, 1.63], belowBoardTop: 2.63, referencePlaneOverPad: 2.40, pegs: 'Ø1.7 through the board, split snap heads', label: 'proposal' };

export function buildSnapLens(opts = {}) {
  const M = partMaterials(opts.materials);
  const userMats = new Set(Object.values(opts.materials || {}));
  const own = new Set(Object.values(M).filter(m => !userMats.has(m)));
  const root = new THREE.Group(); root.name = 'SnapLens';
  const tB = opts.boardThickness ?? 1.0, yb = -tB;                    // the board's underside
  const mat = M.lensPC;
  const body = new THREE.Group(); body.name = 'lensBody';
  // the body: a rounded block under the board, with a shoulder step along its length
  const blk = (w, d, ya, yz, r, bev) => yFlip(extrude(roundedRectShape(w, d, r), { depth: yz - ya, front: bev ? { r: bev, s: 3 } : null, back: { r: 0.08, s: 2 }, curveSegments: 8 })).translate(0, ya, 0);
  body.add(meshOf(blk(5.2, 9.6, yb - 0.75, yb - 0.004, 0.6, 0.12), mat, 'upper'));
  body.add(meshOf(blk(4.4, 7.2, yb - 1.13, yb - 0.75, 0.5, 0.0).translate(0, 0, 0.3), mat, 'lower'));
  // the boss that sits in the board's sensor aperture
  body.add(meshOf(lathe([[0, yb - 0.01], [1.12, yb - 0.01], [1.12, -0.18], [1.04, -0.1], [0, -0.1]], { segments: 48 }), mat, 'boss'));
  // the optics on the bottom face: the imaging dome and the smaller illumination dome, each on a short collar
  body.add(meshOf(lathe((() => { const p = [[0, yb - 1.63], ...Array.from({ length: 12 }, (_, i) => { const a = (1 - (i + 1) / 12) * Math.PI / 2; return [1.25 * Math.cos(a), yb - 1.20 - 0.43 * Math.sin(a)]; }), [1.42, yb - 1.20], [1.42, yb - 1.126]]; return p; })(), { segments: 56 }).translate(0, 0, 1.1), mat, 'imagingLens'));
  body.add(meshOf(lathe((() => { const p = [[0, yb - 1.50], ...Array.from({ length: 10 }, (_, i) => { const a = (1 - (i + 1) / 10) * Math.PI / 2; return [0.85 * Math.cos(a), yb - 1.20 - 0.3 * Math.sin(a)]; }), [1.0, yb - 1.20], [1.0, yb - 1.126]]; return p; })(), { segments: 48 }).translate(0, 0, -1.9), mat, 'lightLens'));
  root.add(body);
  // the clips: an arm from each end of the body to a peg through the board, a split snap head above it
  const clips = new THREE.Group(); clips.name = 'clips';
  for (const s of [1, -1]) {
    const zc = s * 6.0;
    const arm = yFlip(extrude(roundedRectShape(2.4, 1.9, 0.5), { depth: 0.65, front: { r: 0.12, s: 2 }, back: { r: 0.1, s: 2 }, curveSegments: 6 })).translate(0, yb - 0.75, zc - s * 0.25);
    clips.add(meshOf(arm, mat, 'clipArm'));
    const peg = lathe([[0, yb - 0.1], [0.82, yb - 0.1], [0.82, 0.05], [1.02, 0.1], [0.98, 0.42], [0.62, 0.72], [0, 0.72]], { segments: 40, crease: 40 });
    peg.translate(0, 0, zc); clips.add(meshOf(peg, mat, 'peg'));
    // the split in the snap head (a dark slot reads as the gap between the two fingers)
    const slit = yFlip(extrude(roundedRectShape(0.22, 2.2, 0.05), { depth: 0.66, curveSegments: 2 })).translate(0, 0.08, zc);
    clips.add(meshOf(slit, M.lensSlit, 'slit'));
  }
  root.add(clips);
  root.userData.spec = { ...LENS_SPEC };
  root.userData.parts = { body, clips };
  root.dispose = () => { disposeTree(root, userMats); for (const m of own) m.dispose?.(); };
  return root;
}
