// Gateron GT01 mouse micro switch — REPRESENTATIVE model (no public datasheet). Brock: "the gt01 switch is literally
// just a normal SPDT switch with a special bottom housing to rotate it" — so this is a standard D2F-class SPDT micro
// switch (base, terminals, snap-action moving spring with its tongue and fulcrum, silver contacts, plunger, cover) on
// the GT01's moulded wedge, which turns it 20° and covers its terminals down to the board.
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

// switch-frame layout (mm): a standard SPDT micro switch, D2F class
const L = 12.8, W = 5.8, H = 6.5;
const Y_SHOULDER = 2.0, COVER_WALL = 0.45, CEIL = 6.0;   // base / cover joint, cover wall, cavity ceiling
const ZP = 3.4;                    // plunger axis
const PITCH = 5.08;                // COM at +PITCH, NO at 0, NC at −PITCH (D2F)
const Z_CLAMP = 4.25, Z_TIP = -4.0;   // the blade leaves the COM anchor tab at Z_CLAMP; the moving contact sits at Z_TIP
const Y_ANCHOR = 4.45, T_BLADE = 0.08, Y_BLADE = Y_ANCHOR + 0.006;   // blade 6 µm above the tab: no coplanar faces
const Z_FULC = 4.0, Y_FULC = 3.2;  // the tongue's fulcrum: the V notch at the tip of the COM terminal's lower tab
const GAP = 0.30;                  // contact gap NC→NO (representative)
const Y_NCARM = Y_BLADE + T_BLADE + 0.12 + 0.14;   // NC arm underside: its rivet's crown meets the moving contact at rest
const Y_NOTAB = Y_BLADE - GAP - 0.12 - 0.14;        // NO tab top: its rivet's crown meets the moving contact after the snap
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

  // ================================================================ the special bottom housing (world frame)
  // The GT01 is a normal SPDT micro switch on a moulded wedge that turns it 20° (Brock: "literally just a normal SPDT
  // switch with a special bottom housing to rotate it"). The wedge also covers the terminals down to the board.
  // Gateron's photos (2026-11-04): ONE black block from the board up to the cover's edge, its bottom flat on the board and
  // its top the switch's base plane, leaning with the switch; in each side, through the skin, a round hole high at the
  // back, a triangle low at the back, a slot along the tilt in the middle and a round hole toward the plunger end.
  const C = S2W(0, L / 2), F = S2W(0, -L / 2);          // the switch's bottom corners (front low, back high)
  const C2 = S2W(Y_SHOULDER - 0.004, L / 2), F2 = S2W(Y_SHOULDER - 0.004, -L / 2);   // the cover's edge, front and back
  const prof = [[F[1], 0], [C[1], 0], [C[1], C[0]], [C2[1], C2[0]], [F2[1], F2[0]], [F[1], F[0]]];
  const pr = [0.14, 0.14, 0.05, 0.2, 0.2, 0.05];
  const profShape = () => filletPolygon(prof, pr, false, 6);
  const yTopAt = (zw) => { const zs = (zw - Y_SHOULDER * sT) / cT; return Y_SHOULDER * cT - zs * sT + lift; };   // the cover's edge over world z
  const circle = (cz, cy, r) => { const h = new THREE.Path(); h.absarc(cz, cy, r, 0, Math.PI * 2, true); return h; };
  const slot = (cz, cy, len, wd) => {
    const h = new THREE.Path(), r = wd / 2, dx = (len / 2 - r) * cT, dy = -(len / 2 - r) * sT;   // along the tilt, falling forward
    const a = -tilt;
    h.absarc(cz + dx, cy + dy, r, a - Math.PI / 2, a + Math.PI / 2, false);
    h.absarc(cz - dx, cy - dy, r, a + Math.PI / 2, a + 1.5 * Math.PI, false);
    h.closePath(); return h;
  };
  const tri = () => {
    const zB = F[1] + 0.45, y0 = 0.75, z1 = -1.7;
    return filletPolygon([[zB, y0], [z1 + 0.3, y0], [zB, 3.0]], 0.3, true, 5);   // a right triangle pointing forward, as photographed
  };
  const HOLES = { back: [-3.6, Math.min(4.75, yTopAt(-3.6) - 1.4), 0.95], front: [2.9, Math.min(2.2, yTopAt(2.9) - 1.5), 0.85], slot: [-0.4, 2.45, 1.8, 0.72] };
  const pockets = [() => circle(...HOLES.back), () => circle(...HOLES.front), () => slot(...HOLES.slot), tri];
  const skinT = 1.0, coreHalf = W / 2 - skinT;
  const mkSkin = (s) => {
    const sh = profShape();
    for (const h of pockets) sh.holes.push(h());
    const bev = { r: 0.22, t: 0.22, s: 4 };
    const g = extrude(sh, { depth: skinT, front: s < 0 ? bev : null, back: s > 0 ? bev : null, curveSegments: 20 });
    g.rotateY(-Math.PI / 2);                       // shape (Z,Y), extrusion e → −X
    g.translate(s < 0 ? -coreHalf : W / 2, 0, 0);
    return g;
  };
  const coreG = extrude(profShape(), { depth: 2 * coreHalf, curveSegments: 20 });
  coreG.rotateY(-Math.PI / 2); coreG.translate(coreHalf, 0, 0);
  const base = new THREE.Group(); base.name = 'base';
  // the core shows only at the bottom of the side cutouts: a deep matte black there, so they read as holes
  const coreMat = M.lcpBlack.clone(); coreMat.color.multiplyScalar(0.35); coreMat.roughness = 0.95; if ('specularIntensity' in coreMat) coreMat.specularIntensity = 0.15; own.add(coreMat);
  const wedgeL = meshOf(mkSkin(-1), M.lcpBlack, 'wedgeSkinL'), wedgeC = meshOf(coreG, coreMat, 'wedgeCore'), wedgeR = meshOf(mkSkin(+1), M.lcpBlack, 'wedgeSkinR');
  base.add(wedgeL, wedgeC, wedgeR);
  // no locating peg under the wedge (Brock, 09:28: it read as "a 4th extra pin in the front"): the three terminals key it
  root.add(base);

  // ================================================================ the switch itself (S frame): a standard SPDT micro switch
  const box = (w, d, y0, y1, r, bev, x = 0, z = 0) => {
    const g = extrude(roundedRectShape(w, d, r), { depth: y1 - y0, front: bev ? { r: bev, s: 3 } : null, back: bev ? { r: bev * 0.6, s: 2 } : null, curveSegments: 6 });
    g.rotateX(-Math.PI / 2); g.translate(x, y0, z);   // (shape x, shape y, e) → (x, e, −y): footprint w along X, d along Z
    return g;
  };
  // ---- the switch's own base (black LCP): the lower body and the pedestals that hold the terminals inside the cover
  const core = new THREE.Group(); core.name = 'switchBase';
  const sb = (g, nm) => { const m = meshOf(g, M.lcpBlack, nm); core.add(m); return m; };
  sb(box(2 * coreHalf - 0.04, L - 0.24, 0.02, Y_SHOULDER, 0.35, 0.06), 'baseBody');   // inside the black block's core, clear of the skins, so the side holes stay open (they read as crescents when it filled them)
  sb(box(2.8, 1.25, Y_SHOULDER - 0.01, 3.0, 0.16, 0.06, 0, 5.32), 'comPedestal');
  sb(box(2.8, 0.75, Y_SHOULDER - 0.01, 4.62, 0.16, 0.06, 0, -5.62), 'ncPedestal');
  sb(box(1.7, 1.25, Y_SHOULDER - 0.01, 3.64, 0.14, 0.05, 0, -3.95), 'noPedestal');
  for (const s of [1, -1]) sb(box(0.42, 7.4, Y_SHOULDER - 0.01, 2.55, 0.1, 0.05, s * 2.1, 0.2), 'guideRail');   // the plunger/blade guides
  body.add(core);

  // ---- terminals (stamped brass, gold-plated): COM with the blade's anchor tab and the tongue's fulcrum, NC over the
  // tip, NO under it; each runs straight down out of the base at the D2F pitch
  const term = new THREE.Group(); term.name = 'terminals';
  const tm = (g, nm) => { const m = meshOf(g, M.goldSatin, nm); term.add(m); return m; };
  const ZC = PITCH, ZN = -PITCH;
  tm(box(2.2, 0.3, 0.0, Y_ANCHOR, 0.06, 0.02, 0, ZC), 'comPost');
  tm(box(2.2, 0.98, Y_ANCHOR - 0.25, Y_ANCHOR, 0.08, 0.02, 0, ZC - 0.34), 'comAnchor');
  {
    // the fulcrum: a narrow tab with a V notch at its tip, where the tongue's end seats
    const fz0 = Z_FULC, fz1 = ZC - 0.15, fy0 = Y_FULC - 0.13, fy1 = Y_FULC + 0.13;
    const sh = new THREE.Shape(); sh.moveTo(fz1, fy0); sh.lineTo(fz1, fy1); sh.lineTo(fz0, fy1); sh.lineTo(fz0 + 0.12, Y_FULC); sh.lineTo(fz0, fy0); sh.lineTo(fz1, fy0);
    const g = extrude(sh, { depth: 0.9, front: { r: 0.02, s: 1 }, back: { r: 0.02, s: 1 }, curveSegments: 2 });
    g.rotateY(-Math.PI / 2); g.translate(0.45, 0, 0);    // shape (Z, Y), extrusion → −X, centred
    tm(g, 'comFulcrum');
  }
  tm(box(2.0, 0.3, 0.0, Y_NCARM + 0.25, 0.06, 0.02, 0, ZN), 'ncPost');
  { const a0 = ZN - 0.15, a1 = Z_TIP + 0.6; tm(box(1.4, a1 - a0, Y_NCARM, Y_NCARM + 0.25, 0.1, 0.02, 0, (a0 + a1) / 2), 'ncArm'); }
  tm(box(1.4, 1.3, Y_NOTAB - 0.25, Y_NOTAB, 0.1, 0.02, 0, Z_TIP), 'noTab');
  tm(box(1.4, 0.3, 1.0, Y_NOTAB - 0.2, 0.05, 0.02, 0, Z_TIP + 0.5), 'noRiser');
  tm(box(1.4, Math.abs(Z_TIP + 0.65) + 0.15, 0.7, 1.0, 0.05, 0.02, 0, (Z_TIP + 0.65) / 2 + 0.075), 'noRun');
  tm(box(0.7, 0.3, 0.0, 0.72, 0.04, 0.02, 0, 0), 'noExit');
  body.add(term);
  // fixed contacts: silver-alloy rivets, crowned
  const dome = (r, h) => lathe([[0, 0], [r, 0], ...Array.from({ length: 8 }, (_, i) => { const a = (i + 1) / 8 * Math.PI / 2; return [r * Math.cos(a), h * Math.sin(a)]; })], { segments: 40 });
  const ncRivet = meshOf(dome(0.42, 0.14), M.silverContact, 'contactNC'); ncRivet.rotation.x = Math.PI; ncRivet.position.set(0, Y_NCARM, Z_TIP);
  const noRivet = meshOf(dome(0.42, 0.14), M.silverContact, 'contactNO'); noRivet.position.set(0, Y_NOTAB, Z_TIP);
  body.add(ncRivet, noRivet);
  // riveted anchor: the blade is fixed to the COM tab by a small rivet
  const anchorRivet = meshOf(dome(0.3, 0.07), M.silverContact, 'anchorRivet'); anchorRivet.position.set(0, Y_BLADE + T_BLADE, ZC - 0.42);
  body.add(anchorRivet);

  // ---- the moving spring (beryllium copper): a frame anchored on COM, a tongue cut out of it and bent onto the
  // fulcrum; pressing the frame near the anchor carries the tongue's line of force past the fulcrum and the free end
  // snaps from NC down to NO (and back on release, a little later: the hysteresis)
  const zA0 = Z_TIP - 0.55, zA1 = ZC + 0.12;             // blade from just past the contact to over the anchor
  const bladeShape = roundedRectShape(2.2, zA1 - zA0, 0.5, 0, 0);
  const wz0 = Z_TIP + 0.9, wz1 = Z_FULC - 0.25;          // the tongue's window
  bladeShape.holes.push(roundedRectPath(1.16, wz1 - wz0, 0.22, 0, -((wz0 + wz1) / 2 - (zA0 + zA1) / 2)));
  const bg = extrude(bladeShape, { depth: T_BLADE, front: { r: 0.015, s: 1 }, back: { r: 0.015, s: 1 }, curveSegments: 10, crease: 30 });
  bg.rotateX(-Math.PI / 2);                               // (x, y, e) → (x, e, −y)
  bg.translate(0, Y_BLADE, (zA0 + zA1) / 2);
  const blade = meshOf(bg, M.goldSatin, 'blade');               // gold-plated, as in Gateron's photos
  body.add(blade);
  const bladeRest = bg.attributes.position.array.slice();
  const bladeNRest = bg.attributes.normal.array.slice();
  const movRivet = new THREE.Group(); movRivet.name = 'contactCOM';
  const mrTop = meshOf(dome(0.42, 0.12), M.silverContact, 'movTop'); mrTop.position.y = T_BLADE;
  const mrBot = meshOf(dome(0.42, 0.12), M.silverContact, 'movBot'); mrBot.rotation.x = Math.PI;
  movRivet.add(mrTop, mrBot);
  body.add(movRivet);
  const tongue = new THREE.Mesh(new THREE.BufferGeometry(), M.goldSatin); tongue.name = 'tongue'; tongue.castShadow = true;
  body.add(tongue);

  // ---- plunger (black POM), an ordinary micro-switch plunger (Brock: "a fairly normal plunger"): a low cap 0.45 mm
  // proud of the cover with a softly domed top, a flange under the cover's ceiling, and a short nose on the leaf
  const plunger = new THREE.Group(); plunger.name = 'plunger';
  const Y_CAP = H + 0.45;
  plunger.add(meshOf(box(1.5, 2.1, 5.95, Y_CAP, 0.4, 0.34, 0, ZP), M.pomBlack, 'plungerCap'));
  plunger.add(meshOf(box(2.3, 2.9, 5.55, 5.98, 0.3, 0.07, 0, ZP), M.pomBlack, 'plungerFlange'));
  const yNose = Y_BLADE + T_BLADE + 0.002;
  const nose = extrude(roundedRectShape(1.3, 1.1, 0.3), { depth: 5.56 - yNose, back: { r: 0.18, s: 4 }, curveSegments: 6 });
  nose.rotateX(-Math.PI / 2); nose.translate(0, yNose, ZP);
  plunger.add(meshOf(nose, M.pomBlack, 'plungerNose'));
  body.add(plunger);

  // ---- cover (baked CSG, S frame): translucent, plunger hole, label recess with the raised marking
  const mk = opts.marking === undefined ? 'GT01' : opts.marking;
  const rec = GEO['cover_' + (mk ? mk : 'plain')] || GEO.cover_plain;
  const coverGeo = decodeGeo(rec, 30);
  const cover = meshOf(coverGeo, coverMat, 'cover');
  body.add(cover);

  // ================================================================ pins (world) and the terminals' run through the wedge
  const pinsSpec = [{ name: 'COM', x: 0, z: PITCH }, { name: 'NO', x: 0, z: 0 }, { name: 'NC', x: 0, z: -PITCH }];
  const pins = pinsSpec.map(p => {
    const m = meshOf(gt01PinGeometry(pinLen), M.goldSatin, 'pin' + p.name);
    m.position.set(p.x, 0, p.z);
    root.add(m);
    return m;
  });
  const runs = new THREE.Group(); runs.name = 'terminalRuns';
  for (const [zs, zw] of [[ZC, PITCH], [0, 0], [ZN, -PITCH]]) {
    const E = S2W(0.05, zs), E2 = S2W(-0.3, zs);           // out of the switch's bottom, along its −y
    const yMid = E2[0] - 0.6 > 0.6 ? E2[0] - 0.6 : (E2[0] + 0.3) / 2;
    const pts = [[0, E[0], E[1]], [0, E2[0], E2[1]], [0, yMid, zw], [0, 0.3, zw]];
    runs.add(meshOf(sweep(roundPath(pts, 0.28), rectSection(0.3, 0.6, 0.04, 2), { up: [1, 0, 0] }), M.goldSatin, 'run'));
  }
  root.add(runs);

  // ================================================================ cutaway: cover, the switch's base and the wedge, cut on x = 0
  const section = new SectionPlane(body, { normal: [1, 0, 0], from: -W / 2 - 0.6, to: 0.02 });
  section.add(cover, { capColor: 0xf7a3ae, capRoughness: 0.35 });
  core.children.forEach(m => section.add(m, { capColor: 0x2a2b2f, capRoughness: 0.75 }));
  for (const m of [wedgeL, wedgeC, wedgeR]) section.add(m, { capColor: 0x2a2b2f, capRoughness: 0.75 });
  const { lines: coverEdges, material: edgeMat } = addEdges(cover, { color: opts.edgeColor ?? 0x2fd3c0, width: 1.4, threshold: 25, clippingPlanes: [section.plane] });
  own.add(edgeMat);
  coverEdges.visible = false;
  section.set(0);

  // ================================================================ state
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
      const a = Math.atan(-slope), ca = Math.cos(a), sa = Math.sin(a);
      const ny = bladeNRest[i + 1], nz = bladeNRest[i + 2];
      n[i + 1] = ny * ca + nz * sa; n[i + 2] = -ny * sa + nz * ca;
    }
    bg.attributes.position.needsUpdate = true; bg.attributes.normal.needsUpdate = true;
    bg.computeBoundingSphere();
    const [ty, ts] = bladeDelta(Z_TIP, d, tip);
    movRivet.position.set(0, Y_BLADE + ty + lift2, Z_TIP);
    movRivet.rotation.x = Math.atan(ts);
    // the tongue: from its root at the frame's free end, bowed, to the fulcrum notch; the bow turns over at the snap
    const zr = wz0 - 0.05, [ay] = bladeDelta(zr, d, tip);
    const P0 = new THREE.Vector3(0, Y_BLADE + T_BLADE / 2 + ay + lift2, zr);
    const P2 = new THREE.Vector3(0, Y_FULC + lift2 * 0.4, Z_FULC + 0.06);
    const snap = tip / -GAP;                 // 0 before, 1 after the snap
    const bow = lerp(-0.12, 0.08, snap);     // a stamped strip under load: nearly straight, its slight arch turns over
    const mid = P0.clone().lerp(P2, 0.5); const dir = P2.clone().sub(P0).normalize();
    const nrm = new THREE.Vector3(0, dir.z, -dir.y); if (nrm.y < 0) nrm.multiplyScalar(-1);
    const P1 = mid.addScaledVector(nrm, bow);
    const pts = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
      pts.push(new THREE.Vector3().addScaledVector(P0, a).addScaledVector(P1, b).addScaledVector(P2, c));
    }
    const old = tongue.geometry;
    tongue.geometry = sweep(pts, rectSection(0.96, T_BLADE, 0.0), { up: [1, 0, 0], crease: 50 });   // flat in the leaf's plane: 0.96 wide (x) by the leaf's 0.08 (F14.3)
    old.dispose();
  }

  function apply() {
    const k = state.press, e = state.explode;
    const d = k * GT01_SPEC.travel;
    const tip = state.closed ? -GAP : 0;
    const eC = 11.5 * e, eP = 6.6 * e, eB = 3.0 * e;
    cover.position.y = eC + 0.004;     // hairline above the shoulder: no coplanar faces in the cutaway
    plunger.position.y = -d + eP;
    anchorRivet.position.y = Y_BLADE + T_BLADE + eB;
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

  // ================================================================ spec / parts / dispose
  const plTop = new THREE.Vector3(0, H + 0.45, ZP).applyEuler(body.rotation).add(body.position);
  root.userData.spec = {
    ...GT01_SPEC,
    tiltDeg: tilt / D2R,
    pins: pinsSpec.map(p => ({ ...p })),
    plungerTop: plTop.toArray().map(v => +v.toFixed(4)),
    plungerAxis: [0, +cT.toFixed(5), +sT.toFixed(5)],
    footprint: [[-W / 2, F[1]], [W / 2, F[1]], [W / 2, C[1]], [-W / 2, C[1]]],
    heightMax: +Math.max(...[[H, -L / 2], [H, L / 2], [H + 0.45, ZP]].map(([y, z]) => S2W(y, z)[0])).toFixed(3),
    mechanism: 'SPDT snap-action: BeCu frame anchored on COM, cut-out tongue on a fulcrum, AgNi contacts NC above / NO below',
  };
  root.userData.parts = { body, base, core, switchBase: core, cover, plunger, blade, tongue, contactNC: ncRivet, contactNO: noRivet, contactCOM: movRivet, terminals: term, terminalRuns: runs, pins };
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
