// Gateron GT01 mouse micro switch — REPRESENTATIVE model (no public datasheet).
// Manufacturer claims (MechKeys / ZFX Shenzhen launch): 55 ± 5 gf, travel 0.35 ± 0.10 mm, 100 M clicks,
// "Zero Preload and Zero Delay", "Special Shape for Vertical Pressing".
// Envelope: Omron D2F class 12.8 × 5.8 × 6.5 mm (D2F datasheet), body tilted on a molded wedge
// (tilt measured ≈ 20° from Gateron's cutaway image; Brock recalls 30°). Terminals at the D2F 5.08 mm pitch.
//
// Frames: root = PCB frame (origin on the PCB top surface at the middle pin, +Y up, plunger toward +Z).
//         body = switch frame S (origin at the body's bottom centre; x width, y up, z length).
import * as THREE from 'three';
import { partMaterials } from './lib/materials.js';
import {
  extrude, lathe, sweep, rectSection, roundedRectShape, roundedRectPath, circlePath, filletPolygon,
  decodeGeo, meshOf, disposeTree, clamp01, smooth, lerp,
} from './lib/geom.js';
import { SectionPlane, addEdges } from './lib/section.js';
import GEO from './geo/gt01.geo.js';

const D2R = Math.PI / 180;

export const GT01_SPEC = {
  name: 'Gateron GT01 mouse micro switch',
  label: 'representative',
  envelope: [12.8, 5.8, 6.5],            // L × W × H of the body before tilt (D2F class, datasheet of the class)
  travel: 0.35,                          // mm, MC (± 0.10)
  opTravel: 0.22,                        // where the contact snaps (representative)
  rpTravel: 0.175,                       // release point on the way back (representative hysteresis)
  force: '55 ± 5 gf',                    // MC
  life: '100 M clicks',                  // MC
  claims: ['Zero Preload and Zero Delay', 'Special Shape for Vertical Pressing'],
  pitch: 5.08,                           // terminal pitch, D2F datasheet
  pinSection: [0.6, 0.4],                // tip width × thickness (representative; fits Mill-Max 3305 rect-lead range)
  sources: {
    claims: 'MechKeys, "Gateron launched Magnetic Jade gaming switch and GT01 microswitch at ZFX Shenzhen" [MC]',
    envelope: 'Omron D2F datasheet: 12.8 × 5.8 × 6.5 mm, terminal pitch 5.08 mm, terminal t 0.4 mm [DS, class]',
    tilt: "measured ≈ 20° from Gateron's 'Vertical push' cutaway render; Brock recalls 30° [DV/CA]",
  },
};

// switch-frame layout (mm)
const L = 12.8, W = 5.8, H = 6.5;
const Y_SHOULDER = 2.0, COVER_WALL = 0.45, CEIL = 6.0;
const ZP = 3.4;                    // plunger axis
const Z_CLAMP = 4.75, Z_TIP = -4.0;
const Y_BLADE = 4.366, T_BLADE = 0.08;   // 6 µm above the COM plate: no coplanar faces
const GAP = 0.30;                  // contact gap NC→NO (representative)
const H_MIN = 0.5;                 // wedge thickness under the low (plunger) end

export function buildGT01(opts = {}) {
  const tilt = (opts.tilt ?? 20) * D2R;
  const M = partMaterials(opts.materials);
  const userMats = new Set(Object.values(opts.materials || {}));
  const own = new Set(Object.values(M).filter(m => !userMats.has(m)));
  const coverMat = { pink: M.pinkPC, black: M.lcpBlack, clear: M.clearPC }[opts.cover || 'pink'] || M.pinkPC;
  const pinLen = opts.pinLength ?? 3.3;

  const root = new THREE.Group(); root.name = 'GT01';
  const body = new THREE.Group(); body.name = 'GT01.body';
  const sT = Math.sin(tilt), cT = Math.cos(tilt);
  const lift = (L / 2) * sT + H_MIN;
  body.rotation.x = tilt; body.position.set(0, lift, 0);
  root.add(body);
  const S2W = (y, z) => [y * cT - z * sT + lift, y * sT + z * cT];   // switch (y, z) → world (Y, Z)

  // ---------------------------------------------------------------- base (black, world frame)
  // side profile in world (Z, Y): lower base band (S y ∈ [0, 2]) + the wedge down to the PCB.
  const A = S2W(Y_SHOULDER, -L / 2), B = S2W(Y_SHOULDER, L / 2), C = S2W(0, L / 2), F = S2W(0, -L / 2);
  const prof = [[F[1], 0], [C[1], 0], [C[1], C[0]], [B[1], B[0]], [A[1], A[0]], [F[1], F[0]]];
  const pr = [0.12, 0.12, 0.3, 0.32, 0.32, 0.3];
  const profShape = () => filletPolygon(prof, pr, false, 6);
  // pockets (holes in the two skins): positions given in S, converted to world
  const pockets = [];
  const at = (y, z) => { const p = S2W(y, z); return [p[1], p[0]]; };   // → (Z, Y) shape coords
  const circ = (y, z, r) => { const [u, v] = at(y, z); return circlePath(r, u, v); };
  pockets.push(() => circ(1.0, 4.35, 0.62));
  pockets.push(() => { const [u, v] = at(1.0, 1.45); const p = stadiumPath(2.05, 0.74, u, v, -tilt); return p; });
  pockets.push(() => circ(1.0, -1.55, 0.62));
  pockets.push(() => circ(1.0, -4.55, 0.42));
  // wedge triangle (only when the wedge is tall enough): legs on the PCB and the back wall, hypotenuse ∥ body
  const zBack = F[1] + 0.85, yLow = 0.62;
  const yTopAtBack = (F[0] - 1.25) ;             // stay 1.25 below the body bottom at the back wall
  const triRight = zBack + (yTopAtBack - yLow) / Math.tan(Math.max(tilt, 1e-3));
  const triOK = yTopAtBack - yLow > 1.2 && triRight - zBack > 1.8;
  if (triOK) {
    const zr = Math.min(triRight, C[1] - 1.6);
    const yt = yLow + (zr - zBack) * 0 + (yTopAtBack - yLow) * 1;
    pockets.push(() => filletPolygon([[zBack, yLow], [zr, yLow], [zBack, yt]], 0.35, true, 5));
  }
  const skinT = 1.0, coreHalf = W / 2 - skinT;
  const mkSkin = (side) => {
    const s = profShape();
    for (const h of pockets) s.holes.push(h());
    const bev = { r: 0.24, t: 0.24, s: 4 };
    const g = extrude(s, { depth: skinT, front: side < 0 ? bev : null, back: side > 0 ? bev : null, curveSegments: 20 });
    g.rotateY(-Math.PI / 2);                       // shape (Z,Y), extrusion e → −X
    g.translate(side < 0 ? -coreHalf : W / 2, 0, 0);
    return g;
  };
  const coreG = extrude(profShape(), { depth: 2 * coreHalf, curveSegments: 20 });
  coreG.rotateY(-Math.PI / 2); coreG.translate(coreHalf, 0, 0);
  const base = new THREE.Group(); base.name = 'base';
  base.add(meshOf(mkSkin(-1), M.lcpBlack, 'baseSkinL'), meshOf(coreG, M.lcpBlack, 'baseCore'), meshOf(mkSkin(+1), M.lcpBlack, 'baseSkinR'));
  // key peg (keyed orientation) under the base
  const peg = meshOf(lathe([[0, -0.72], [0.36, -0.72], [0.45, -0.63], [0.45, 0.2], [0, 0.2]], { segments: 32 }), M.lcpBlack, 'keyPeg');
  peg.position.set(1.45, 0, 2.54);
  base.add(peg);
  root.add(base);

  // ---------------------------------------------------------------- upper core (inside the cover, S frame)
  const core = new THREE.Group(); core.name = 'upperCore';
  const box = (w, d, y0, y1, r, bev, x = 0, z = 0) => {
    const g = extrude(roundedRectShape(w, d, r), { depth: y1 - y0, front: bev ? { r: bev, s: 3 } : null, curveSegments: 6 });
    g.rotateX(-Math.PI / 2); g.translate(x, y0, z);   // shape (x, −z)… rotateX(−90°): (x, y, z) → (x, z, −y)
    return g;
  };
  // rotateX(-90°) maps shape y → −z; boxes are symmetric so only offsets matter (z passed separately)
  const coreParts = [
    box(W - 2 * COVER_WALL - 0.02, L - 2 * COVER_WALL - 0.02, Y_SHOULDER - 0.01, 2.7, 0.24, 0.08),  // floor
    box(3.0, 1.15, 2.69, 4.06, 0.18, 0.08, 0, 5.32),        // COM pedestal
    box(3.0, 0.95, 2.69, 5.36, 0.18, 0.08, 0, -5.42),       // NC pedestal (back)
    box(1.8, 1.0, 2.69, 3.45, 0.16, 0.06, 0, -4.0),         // NO pedestal
    box(1.0, 0.5, 2.69, 3.98, 0.12, 0.05, 0, 1.85),         // tongue fulcrum post
  ];
  for (const s of [1, -1]) coreParts.push(box(2.1, 0.5, 2.62, 3.56, 0.12, 0.08, 0, s * 6.12));  // latch bumps
  coreParts.forEach((g, i) => core.add(meshOf(g, M.lcpBlack, 'core' + i)));
  body.add(core);

  // ---------------------------------------------------------------- terminals + contacts (gold, S frame)
  const term = new THREE.Group(); term.name = 'terminals';
  const strip = (pts, w, t) => sweep(roundPath(pts, 0.12), rectSection(t, w, 0.04, 2), { up: [0, 1, 0] });
  // COM: plate on its pedestal + a down-strip on the +x face
  const comPlate = box(2.4, 1.05, 4.06, 4.36, 0.12, 0.04, 0, 5.3);
  term.add(meshOf(comPlate, M.goldSatin, 'comPlate'));
  term.add(meshOf(strip([[1.2, 4.21, 5.3], [1.58, 4.21, 5.3], [1.66, 4.1, 5.3], [1.66, 2.75, 5.3]], 0.7, 0.3), M.goldSatin, 'comStrip'));
  // NC: up the back pedestal's −x face, arm forward over the blade tip
  const ncArm = box(1.3, 2.3, 4.70, 5.0, 0.2, 0.05, 0, -4.35);
  term.add(meshOf(ncArm, M.goldSatin, 'ncArm'));
  term.add(meshOf(strip([[-0.5, 4.85, -5.45], [-1.58, 4.85, -5.45], [-1.66, 4.74, -5.45], [-1.66, 2.75, -5.45]], 0.7, 0.3), M.goldSatin, 'ncStrip'));
  // NO: pad on its pedestal with a down-strip
  const noPad = box(1.3, 1.1, 3.5, 3.8, 0.18, 0.04, 0, -4.0);
  term.add(meshOf(noPad, M.goldSatin, 'noPad'));
  term.add(meshOf(strip([[0.55, 3.65, -4.0], [0.98, 3.65, -4.0], [1.06, 3.55, -4.0], [1.06, 2.75, -4.0]], 0.6, 0.3), M.goldSatin, 'noStrip'));
  body.add(term);
  // contact rivets (fine gold)
  const dome = (r, h) => lathe([[0, 0], [r, 0], ...Array.from({ length: 7 }, (_, i) => { const a = (i + 1) / 7 * Math.PI / 2; return [r * Math.cos(a), h * Math.sin(a)]; })], { segments: 32 });
  const ncRivet = meshOf(dome(0.45, 0.14), M.gold, 'contactNC'); ncRivet.rotation.x = Math.PI; ncRivet.position.set(0, 4.70, Z_TIP);
  const noRivet = meshOf(dome(0.45, 0.14), M.gold, 'contactNO'); noRivet.position.set(0, 3.80, Z_TIP);
  body.add(ncRivet, noRivet);

  // ---------------------------------------------------------------- moving blade (deformable) + rivet + tongue
  const bladeShape = roundedRectShape(2.2, 10.3, 0.55, 0, 0);
  bladeShape.holes.push(roundedRectPath(1.25, 5.2, 0.3, 0, 0.4));   // window z ∈ [−2.4, 2.8]
  const bg = extrude(bladeShape, { depth: T_BLADE, front: { r: 0.02, s: 1 }, back: { r: 0.02, s: 1 }, curveSegments: 8, crease: 30 });
  // shape centre z: blade spans z ∈ [−4.55, 5.75] → centre 0.6; window centre at z = −0.2
  bg.rotateX(-Math.PI / 2);                         // (x, y, e) → (x, e, −y)
  bg.translate(0, Y_BLADE, 0.6);
  const blade = meshOf(bg, M.goldSatin, 'blade');
  body.add(blade);
  const bladeRest = bg.attributes.position.array.slice();
  const bladeNRest = bg.attributes.normal.array.slice();
  const movRivet = new THREE.Group(); movRivet.name = 'contactCOM';
  const mrTop = meshOf(dome(0.45, 0.12), M.gold, 'movTop'); mrTop.position.y = T_BLADE;
  const mrBot = meshOf(dome(0.45, 0.12), M.gold, 'movBot'); mrBot.rotation.x = Math.PI;
  movRivet.add(mrTop, mrBot);
  body.add(movRivet);
  const tongue = new THREE.Mesh(new THREE.BufferGeometry(), M.goldSatin); tongue.name = 'tongue'; tongue.castShadow = true;
  body.add(tongue);

  // ---------------------------------------------------------------- plunger (black POM, S frame)
  const plunger = new THREE.Group(); plunger.name = 'plunger';
  plunger.add(meshOf(box(1.6, 2.2, 5.9, 7.4, 0.42, 0.28, 0, ZP), M.pomBlack, 'plungerCap'));
  plunger.add(meshOf(box(2.5, 3.1, 5.45, 5.98, 0.3, 0.07, 0, ZP), M.pomBlack, 'plungerFlange'));
  const nose = extrude(roundedRectShape(2.0, 0.72, 0.2), { depth: 5.46 - (Y_BLADE + T_BLADE), back: { r: 0.12, s: 4 }, curveSegments: 6 });
  nose.rotateX(-Math.PI / 2); nose.translate(0, Y_BLADE + T_BLADE, ZP);
  plunger.add(meshOf(nose, M.pomBlack, 'plungerNose'));
  body.add(plunger);

  // ---------------------------------------------------------------- cover (baked CSG, S frame)
  const mk = opts.marking === undefined ? 'GT01' : opts.marking;
  const rec = GEO['cover_' + (mk ? mk : 'plain')] || GEO.cover_plain;
  const coverGeo = decodeGeo(rec, 30);
  const cover = meshOf(coverGeo, coverMat, 'cover');
  body.add(cover);

  // ---------------------------------------------------------------- pins (world frame) + footprint data
  const PITCH = GT01_SPEC.pitch;
  const pinsSpec = [{ name: 'COM', x: 0, z: PITCH }, { name: 'NO', x: 0, z: 0 }, { name: 'NC', x: 0, z: -PITCH }];
  const pins = pinsSpec.map(p => {
    const m = meshOf(gt01PinGeometry(pinLen), M.goldSatin, 'pin' + p.name);
    m.position.set(p.x, 0, p.z);
    root.add(m);
    return m;
  });

  // ---------------------------------------------------------------- cutaway (section + ghost edges)
  const section = new SectionPlane(body, { normal: [1, 0, 0], from: -W / 2 - 0.6, to: 0.02 });
  section.add(cover, { capColor: 0xf7a3ae, capRoughness: 0.35 });
  const { lines: coverEdges, material: edgeMat } = addEdges(cover, { color: opts.edgeColor ?? 0x2fd3c0, width: 1.4, threshold: 25, clippingPlanes: [section.plane] });
  own.add(edgeMat);
  coverEdges.visible = false;
  section.set(0);

  // ---------------------------------------------------------------- state
  const state = { press: 0, explode: 0, cutaway: 0, closed: false, travel: 0 };
  const bladeDelta = (z, d, tip) => {
    // Hermite: clamp (s=0, δ=0, δ'=0) → plunger (s_p, −d, m) → straight to the tip (s_t, tip)
    const s = Z_CLAMP - z, sp = Z_CLAMP - ZP, st = Z_CLAMP - Z_TIP;
    if (s <= 0) return [0, 0];
    const m = (tip + d) / (st - sp);
    if (s >= sp) return [-d + m * (s - sp), m];
    const t = s / sp, h = sp;
    const y = (-2 * t ** 3 + 3 * t ** 2) * (-d) + (t ** 3 - t ** 2) * h * m;
    const dy = ((-6 * t ** 2 + 6 * t) * (-d) + (3 * t ** 2 - 2 * t) * h * m) / h;
    return [y, dy];
  };
  function poseBlade(d, tip, lift2) {
    const p = bg.attributes.position.array, n = bg.attributes.normal.array;
    for (let i = 0; i < p.length; i += 3) {
      const z = bladeRest[i + 2];
      const [dy, slope] = bladeDelta(z, d, tip);
      p[i + 1] = bladeRest[i + 1] + dy + lift2;
      // rotate normals about x by the local slope (dδ/ds with s = Z_CLAMP − z ⇒ dδ/dz = −slope)
      const a = Math.atan(-slope), ca = Math.cos(a), sa = Math.sin(a);
      const ny = bladeNRest[i + 1], nz = bladeNRest[i + 2];
      n[i + 1] = ny * ca + nz * sa; n[i + 2] = -ny * sa + nz * ca;
    }
    bg.attributes.position.needsUpdate = true; bg.attributes.normal.needsUpdate = true;
    bg.computeBoundingSphere();
    const [ty, ts] = bladeDelta(Z_TIP, d, tip);
    movRivet.position.set(0, Y_BLADE + ty + lift2, Z_TIP);
    movRivet.rotation.x = Math.atan(ts);
    // tongue: from the window's back edge on the blade to the fulcrum post, bowed up before the snap
    const zA = -2.45, [ay] = bladeDelta(zA, d, tip);
    const P0 = new THREE.Vector3(0, Y_BLADE + T_BLADE / 2 + ay + lift2, zA);
    const P2 = new THREE.Vector3(0, 3.98 + 0.04 + lift2 * 0.5, 1.85);
    const snap = tip / -GAP;                 // 0 before, 1 after the snap
    const bow = lerp(0.62, -0.18, snap);
    const mid = P0.clone().lerp(P2, 0.5); const dir = P2.clone().sub(P0).normalize();
    const nrm = new THREE.Vector3(0, dir.z, -dir.y);   // perpendicular in the y-z plane (up-ish)
    if (nrm.y < 0) nrm.multiplyScalar(-1);
    const P1 = mid.addScaledVector(nrm, bow);
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
      pts.push(new THREE.Vector3().addScaledVector(P0, a).addScaledVector(P1, b).addScaledVector(P2, c));
    }
    const old = tongue.geometry;
    tongue.geometry = sweep(pts, rectSection(0.07, 0.8, 0.0), { up: [1, 0, 0], crease: 50 });
    old.dispose();
  }

  function apply() {
    const k = state.press, e = state.explode;
    const d = k * GT01_SPEC.travel;
    const tip = state.closed ? -GAP : 0;
    // explode offsets along switch +y
    const eC = 11.5 * e, eP = 6.6 * e, eB = 3.0 * e;
    cover.position.y = eC + 0.004;     // hairline above the shoulder: no coplanar faces in the cutaway
    plunger.position.y = -d + eP;
    poseBlade(d, tip, eB);
    state.travel = d;
  }

  root.setPress = (k, o = {}) => {
    k = clamp01(k);
    const d = k * GT01_SPEC.travel;
    const op = GT01_SPEC.opTravel, rp = GT01_SPEC.rpTravel;
    state.press = k;
    state.closed = o.releasing ? d >= rp : d >= op;
    apply();
    return { travel: d, closed: state.closed };
  };
  root.setExplode = (k) => { state.explode = clamp01(k); apply(); };
  root.setCutaway = (k) => {
    k = clamp01(k); state.cutaway = k;
    section.set(smooth(0, 0.85, k));
    edgeMat.opacity = 0.9 * smooth(0.25, 1, k);
    coverEdges.visible = edgeMat.opacity > 0.01;
  };
  root.getState = () => ({ ...state });

  // ---------------------------------------------------------------- spec / parts / dispose
  const plTop = new THREE.Vector3(0, 7.4, ZP).applyEuler(body.rotation).add(body.position);
  root.userData.spec = {
    ...GT01_SPEC,
    tiltDeg: tilt / D2R,
    pins: pinsSpec.map(p => ({ ...p })),
    keyPeg: { x: 1.45, z: 2.54, d: 0.9 },
    plungerTop: plTop.toArray().map(v => +v.toFixed(4)),
    plungerAxis: [0, +cT.toFixed(5), +sT.toFixed(5)],
    footprint: [[-W / 2, F[1]], [W / 2, F[1]], [W / 2, C[1]], [-W / 2, C[1]]],
    heightMax: +Math.max(...[[H, -L / 2], [H, L / 2], [7.4, ZP]].map(([y, z]) => S2W(y, z)[0])).toFixed(3),
  };
  root.userData.parts = { body, base, core, cover, plunger, blade, tongue, contactNC: ncRivet, contactNO: noRivet, contactCOM: movRivet, terminals: term, pins };
  root.dispose = () => { section.dispose(); disposeTree(root, userMats); for (const m of own) m.dispose?.(); };

  root.traverse(o => { if (o.isMesh) { o.castShadow = o.castShadow !== false; } });
  root.setPress(0);
  return root;
}

/** GT01-style terminal (representative): flat 0.4 mm blade, 0.9 wide above a shoulder at y = −0.95,
 *  0.6 wide tip, pointed end at y = −pinLen. Width runs along Z, thickness along X. Top at y = +0.35. */
export function gt01PinGeometry(pinLen = 3.3) {
  const yb = -pinLen, ys = -0.95;
  const pts = [[-0.45, 0.35], [-0.45, ys + 0.12], [-0.3, ys - 0.03], [-0.3, yb + 0.32], [-0.1, yb], [0.1, yb], [0.3, yb + 0.32], [0.3, ys - 0.03], [0.45, ys + 0.12], [0.45, 0.35]];
  const shp = filletPolygon(pts, [0, 0.05, 0.08, 0.1, 0.04, 0.04, 0.1, 0.08, 0.05, 0], false, 3);
  const g = extrude(shp, { depth: 0.4, front: { r: 0.05, s: 2 }, back: { r: 0.05, s: 2 }, curveSegments: 4 });
  g.rotateY(-Math.PI / 2); g.translate(0.2, 0, 0);
  return g;
}

// polyline with rounded corners (bend radius r) → dense point list for sweeps
function roundPath(pts, r, n = 5) {
  const P = pts.map(p => new THREE.Vector3(...p));
  const out = [P[0]];
  for (let i = 1; i < P.length - 1; i++) {
    const a = P[i - 1], b = P[i], c = P[i + 1];
    const u = a.clone().sub(b), v = c.clone().sub(b);
    const lu = u.length(), lv = v.length();
    u.normalize(); v.normalize();
    const t = Math.min(r, lu / 2, lv / 2);
    const p0 = b.clone().addScaledVector(u, t), p1 = b.clone().addScaledVector(v, t);
    for (let k = 0; k <= n; k++) {
      const s = k / n;
      const q = p0.clone().multiplyScalar((1 - s) * (1 - s)).addScaledVector(b, 2 * (1 - s) * s).addScaledVector(p1, s * s);
      out.push(q);
    }
  }
  out.push(P[P.length - 1]);
  return out;
}

function stadiumPath(len, wid, cx, cy, ang) {
  // stadium (slot) as a hole path, rotated by ang
  const r = wid / 2, hl = len / 2 - r;
  const pts = [];
  for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + Math.PI * i / 10; pts.push([hl + r * Math.cos(a), r * Math.sin(a)]); }
  for (let i = 0; i <= 10; i++) { const a = Math.PI / 2 + Math.PI * i / 10; pts.push([-hl + r * Math.cos(a), r * Math.sin(a)]); }
  const c = Math.cos(ang), s = Math.sin(ang);
  const v = pts.map(([x, y]) => new THREE.Vector2(cx + x * c - y * s, cy + x * s + y * c));
  if (!THREE.ShapeUtils.isClockWise(v)) v.reverse();
  return new THREE.Path(v);
}
