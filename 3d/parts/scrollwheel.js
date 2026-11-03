// Magnesium-alloy scroll wheel (#84) + POM axle (#7) + optical scroll encoder (research "step further").
// Representative / proposal geometry. Frame: origin on the PCB top surface below the wheel centre;
// axle along X (encoder on +X by default); wheel centre at Y = axleHeight.
//
// Design rules carried from Brock's doc:
//  - 6 spokes: the web is cut into 6 equilateral-triangle windows (6 × 60° = 360°)  [brainstorm, proposal]
//  - "more like a torus than cylinder": the tread is a torus section whose crown radius equals the wheel
//    radius (default), so the top of the wheel is locally spherical: the fingertip sees the same curvature
//    rolling and across, and the contact patch is round instead of a stripe  [proposal]
//  - rover-tread texture (#30): 48 gently curved grousers like Perseverance (NASA: 48 gently curved vs
//    Curiosity's 24 chevrons), 2 per encoder step; flat-topped for wear, not RGB/shiny  [proposal]
import * as THREE from 'three';
import { partMaterials } from './lib/materials.js';
import {
  extrude, lathe, sweep, arc, rectSection, roundedRectShape, circlePath, filletPolygon, meshOf,
  disposeTree, clamp01, smooth, lerp, makeGeometry, creaseNormals, circleSection,
} from './lib/geom.js';

const TAU = Math.PI * 2;

export const WHEEL_SPEC = {
  name: 'Magnesium scroll wheel + optical encoder',
  label: 'representative / proposal',
  material: 'magnesium alloy AZ31B-class (1.77 g/cm³), machined, bare passivated finish',
  axle: 'POM (acetal), hex-keyed in the hub, D-flat drive into the encoder',
  encoder: 'optical: IR emitter, slotted stainless code disc, dual phototransistor (A/B quadrature)',
  sources: {
    grousers: 'NASA, "Perseverance Mars rover gets its wheels and air brakes": 48 gently curved treads vs Curiosity 24 chevron [DS]',
    optical: 'Razer: optical encoders "3.3× more reliable" [MC]; Viper V4 Pro uses an optical scroll encoder [MC/IM]',
    size: 'Sora V2 wheel ≈ 22–23.5 × 7.5–8 mm, measured from Brock\'s PCB photo against the 8.94 mm USB-C shell [DV]',
  },
};

export function buildScrollWheel(opts = {}) {
  const D = opts.diameter ?? 22, Wd = opts.width ?? 7, R = D / 2, hw = Wd / 2;
  const Rc = opts.crownRadius ?? R;
  const nG = opts.grousers ?? 48, steps = opts.steps ?? 24;
  const AH = opts.axleHeight ?? 11;
  const side = opts.encoderSide === -1 ? -1 : 1;
  const M = partMaterials(opts.materials);
  if (opts.anisoRot !== undefined) { M.magnesium.anisotropyRotation = +opts.anisoRot; M.magnesiumFace.anisotropyRotation = +opts.anisoRot; }
  const userMats = new Set(Object.values(opts.materials || {}));
  const own = new Set(Object.values(M).filter(m => !userMats.has(m)));

  const root = new THREE.Group(); root.name = 'ScrollWheel';
  const assy = new THREE.Group(); assy.name = 'assembly'; assy.position.y = AH;
  if (side < 0) assy.scale.x = -1;   // mirror for a left-hand encoder (geometry is symmetric enough)
  root.add(assy);
  const spin = new THREE.Group(); spin.name = 'spin';        // everything that turns with the wheel
  assy.add(spin);

  // ------------------------------------------------------------------ tread ring (lathe around Y → X)
  const g = 0.22;                                   // grouser height (= groove depth)
  const crown = (y) => (R - Rc) + Math.sqrt(Rc * Rc - y * y);   // crown surface radius at axial y
  const floor = (y) => crown(y) - g;
  const Ri = R - 1.75;                               // rim inner radius (thin shell: 6 triangles carry the load)
  const fe = 0.42;                                   // tread-to-side fillet
  const ch = 0.3;                                    // inner chamfer
  const prof = [];
  prof.push([Ri, -hw + ch], [Ri + ch, -hw]);
  const yE = hw - fe;                                // start of the edge fillet (axial)
  const rE = floor(-yE);
  prof.push([rE - fe, -hw]);
  for (let i = 1; i <= 7; i++) { const a = (i / 7) * Math.PI / 2; prof.push([rE - fe + fe * Math.sin(a), -hw + fe - fe * Math.cos(a)]); }
  for (let i = 1; i < 30; i++) { const y = -yE + (2 * yE) * i / 30; prof.push([floor(y), y]); }
  for (let i = 0; i <= 7; i++) { const a = (i / 7) * Math.PI / 2; prof.push([rE - fe + fe * Math.cos(a), hw - fe + fe * Math.sin(a)]); }
  prof.push([Ri + ch, hw], [Ri, hw - ch], [Ri, -hw + ch]);
  const toX = (geo) => { geo.rotateZ(-Math.PI / 2); return geo; };
  const tread = meshOf(circTangents(toX(lathe(prof, { segments: 144, crease: 30 }))), M.magnesium, 'tread');
  spin.add(tread);

  // ------------------------------------------------------------------ grousers (48 gently curved ribs)
  const ribs = grouserGeometry({ n: nG, floor, crown, hw: yE - 0.08, g, curve: 0.55 / R, bw: 0.62, tw: 0.34 });
  const grousers = meshOf(circTangents(ribs), M.magnesiumLand, 'grousers');
  spin.add(grousers);

  // ------------------------------------------------------------------ web with 6 equilateral-triangle windows
  const tw = 1.2, rHub = 2.35, AF = 2.0;           // web thickness, hub radius, hex across flats
  const webShape = new THREE.Shape(); webShape.absarc(0, 0, Ri + 0.2, 0, TAU, false);
  const spokeHalf = 0.5, rTrunc = rHub + 0.42, rf = 0.42;
  const wins = triangleWindows({ n: 6, Ri, d: spokeHalf, rTrunc, rf, rimGap: 0.78 });
  for (const w of wins) webShape.holes.push(w);
  webShape.holes.push(hexPath(AF / 2 / Math.cos(Math.PI / 6) + 0.0, Math.PI / 6));
  const webG = extrude(webShape, { depth: tw, front: { r: 0.12, s: 3 }, back: { r: 0.12, s: 3 }, curveSegments: 64 });
  webG.rotateY(Math.PI / 2); webG.translate(-tw / 2, 0, 0);   // shape (sx, sy) → (Z = −sx, Y = sy), e → X
  const web = meshOf(circTangents(webG), M.magnesiumFace, 'web');
  spin.add(web);
  // hub (round outside, hex bore), chamfered
  const hubShape = new THREE.Shape(); hubShape.absarc(0, 0, rHub, 0, TAU, false);
  hubShape.holes.push(hexPath(AF / 2 / Math.cos(Math.PI / 6), Math.PI / 6));
  const hubW = 5.0;
  const hubG = extrude(hubShape, { depth: hubW, front: { r: 0.28, s: 4 }, back: { r: 0.28, s: 4 }, curveSegments: 48 });
  hubG.rotateY(Math.PI / 2); hubG.translate(-hubW / 2, 0, 0);
  const hub = meshOf(circTangents(hubG), M.magnesiumFace, 'hub');
  spin.add(hub);
  // fillet rings: web↔hub and web↔rim (both faces)
  for (const s of [1, -1]) {
    const fh = filletRing(rHub, tw / 2, 0.42, s, true);
    const fr = filletRing(Ri, tw / 2, 0.55, s, false);
    spin.add(meshOf(circTangents(toX(fh)), M.magnesiumFace, 'filletHub'), meshOf(circTangents(toX(fr)), M.magnesiumFace, 'filletRim'));
  }
  const wheel = new THREE.Group(); wheel.name = 'wheel';
  wheel.add(...spin.children.slice());   // move into a named sub-group
  spin.add(wheel);

  // ------------------------------------------------------------------ POM axle (round journals, hex in the hub, D drive)
  const axle = new THREE.Group(); axle.name = 'axle';
  const xL = -8.3, xR = 11.5, rJ = 1.2;
  const left = lathe([[0, xL], [rJ - 0.2, xL], [rJ, xL + 0.2], [rJ, -hubW / 2 - 0.6], [1.55, -hubW / 2 - 0.45], [1.55, -hubW / 2 + 0.05], [0, -hubW / 2 + 0.05]], { segments: 48 });
  const right = lathe([[0, hubW / 2 - 0.05], [1.55, hubW / 2 - 0.05], [1.55, hubW / 2 + 0.45], [rJ, hubW / 2 + 0.6], [rJ, 6.6], [0, 6.6]], { segments: 48 });
  axle.add(meshOf(toX(left), M.pom, 'axleL'), meshOf(toX(right), M.pom, 'axleR'));
  const hexG = extrude(hexShape(AF / 2 / Math.cos(Math.PI / 6) - 0.01, Math.PI / 6), { depth: hubW + 0.2, front: { r: 0.06, s: 1 }, back: { r: 0.06, s: 1 } });
  hexG.rotateY(Math.PI / 2); hexG.translate(-(hubW + 0.2) / 2, 0, 0);
  axle.add(meshOf(hexG, M.pom, 'axleHex'));
  const dShape = new THREE.Shape();
  { const a0 = Math.acos(0.75 / rJ); dShape.moveTo(rJ * Math.cos(a0), rJ * Math.sin(a0)); dShape.absarc(0, 0, rJ, a0, TAU - a0, false); dShape.lineTo(rJ * Math.cos(a0), rJ * Math.sin(a0)); }
  const dG = extrude(dShape, { depth: xR - 6.6, front: { r: 0.15, s: 2 }, curveSegments: 24 });
  dG.rotateY(Math.PI / 2); dG.translate(6.6, 0, 0);
  axle.add(meshOf(dG, M.pom, 'axleD'));
  spin.add(axle);

  // ------------------------------------------------------------------ encoder
  const enc = new THREE.Group(); enc.name = 'encoder';
  const x0 = hw + 0.9, x1 = x0 + 7.6, zD = 4.7, yTop = 4.9;   // housing box (assembly frame, Y rel. to axle)
  const xm = (x0 + x1) / 2;
  const hsh = roundedRectShape(x1 - x0, 2 * zD, 0.6);
  const hG = extrude(hsh, { depth: yTop + AH, front: { r: 0.45, s: 4 }, back: { r: 0.1, s: 1 }, curveSegments: 8 });
  hG.rotateX(-Math.PI / 2); hG.translate(xm, -AH, 0);
  const housing = meshOf(hG, M.housingBlack, 'housing');
  enc.add(housing);
  // bushing boss on the wheel side + mounting feet
  const boss = lathe([[1.25, 0], [2.15, 0], [2.15, 0.45], [2.0, 0.6], [1.35, 0.6], [1.25, 0.5], [1.25, 0]], { segments: 48 });
  boss.rotateZ(Math.PI / 2); boss.translate(x0, 0, 0);   // axis Y → −X (protrudes toward the wheel)
  enc.add(meshOf(boss, M.housingBlack, 'boss'));
  // code disc: photo-etched stainless, `steps` radial slots
  const discR = 4.15, rs0 = 2.75, rs1 = 3.85, tD = 0.2, xDisc = xm - 0.4;
  const discShape = new THREE.Shape(); discShape.absarc(0, 0, discR, 0, TAU, false);
  const slotW = (TAU / steps) * 0.5;
  for (let i = 0; i < steps; i++) discShape.holes.push(annularSlot(rs0, rs1, i * TAU / steps - slotW / 2, i * TAU / steps + slotW / 2, 0.08));
  discShape.holes.push(dHolePath(rJ + 0.02, 0.77));
  const discG = extrude(discShape, { depth: tD, curveSegments: 64 });
  discG.rotateY(Math.PI / 2); discG.translate(xDisc - tD / 2, 0, 0);
  const disc = meshOf(circTangents(discG), M.stainless, 'disc');
  // detent star (24 lobes) on the axle + leaf spring
  const star = new THREE.Shape();
  for (let i = 0; i <= 24 * 8; i++) {
    const a = (i / (24 * 8)) * TAU, r = 2.55 + 0.22 * Math.cos(steps * a);
    if (i === 0) star.moveTo(r * Math.cos(a), r * Math.sin(a)); else star.lineTo(r * Math.cos(a), r * Math.sin(a));
  }
  star.holes.push(dHolePath(rJ + 0.02, 0.77));
  const starG = extrude(star, { depth: 1.0, front: { r: 0.08, s: 2 }, back: { r: 0.08, s: 2 }, curveSegments: 4 });
  starG.rotateY(Math.PI / 2); starG.translate(xDisc + 2.3, 0, 0);
  const detentStar = meshOf(starG, M.pomBlack, 'detentStar');
  const rot = new THREE.Group(); rot.name = 'encoderRotor';
  rot.add(disc, detentStar);
  if (opts.encoder !== false) spin.add(rot);
  const springPts = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30, z = -3.6 + 7.2 * t;
    const bump = Math.exp(-((z - 0) ** 2) / 0.18) * 0.32;
    springPts.push(new THREE.Vector3(xDisc + 2.8, 2.95 + 0.25 * (2 * t - 1) ** 2 - bump, z));
  }
  const spring = meshOf(sweep(springPts, rectSection(0.12, 0.9, 0.02), { up: [0, 1, 0] }), M.phosBronze, 'detentSpring');
  enc.add(spring);
  // emitter (IR LED, clear epoxy dome) and dual detector (IR-pass black epoxy) straddling the disc at the top
  const beamR = 3.3, phA = 0, phB = -(TAU / steps) * 1.25;          // B lags A by 1¼ slot pitch = 90° electrical
  const beamPos = (ph) => new THREE.Vector3(0, beamR * Math.cos(ph), beamR * Math.sin(ph));
  const emitter = new THREE.Group(); emitter.name = 'emitter';
  const eBody = extrude(roundedRectShape(1.7, 1.6, 0.2), { depth: 1.0, front: { r: 0.08, s: 2 }, back: { r: 0.08, s: 2 } });
  eBody.rotateY(Math.PI / 2);
  const eb = meshOf(eBody, M.epoxyIR, 'emitterBody'); eb.position.set(xDisc - 2.6, 3.2, -0.55);
  const lens = meshOf(lathe([[0, 0], ...arc(0, 0, 0.62, 0, Math.PI / 2, 10)], { segments: 32 }), M.epoxyClear, 'emitterLens');
  lens.rotation.z = -Math.PI / 2; lens.position.set(xDisc - 1.6, 3.2, -0.55);
  const die = meshOf(new THREE.BoxGeometry(0.1, 0.35, 0.35), M.glowIR, 'emitterDie'); die.position.set(xDisc - 1.62, 3.2, -0.55);
  emitter.add(eb, lens, die);
  enc.add(emitter);
  const detector = new THREE.Group(); detector.name = 'detector';
  const dB = extrude(roundedRectShape(3.2, 1.6, 0.2), { depth: 1.1, front: { r: 0.08, s: 2 }, back: { r: 0.08, s: 2 } });
  dB.rotateY(Math.PI / 2);
  const db = meshOf(dB, M.epoxyIR, 'detectorBody'); db.position.set(xDisc + 0.9, 3.2, -0.55);
  detector.add(db);
  const winA = meshOf(new THREE.BoxGeometry(0.06, 0.34, 0.5), M.glowIR.clone(), 'windowA');
  const winB = meshOf(new THREE.BoxGeometry(0.06, 0.34, 0.5), M.glowIR.clone(), 'windowB');
  own.add(winA.material); own.add(winB.material);
  const pA = beamPos(phA), pB = beamPos(phB);
  winA.position.set(xDisc + 0.88, pA.y, pA.z); winB.position.set(xDisc + 0.88, pB.y, pB.z);
  detector.add(winA, winB);
  enc.add(detector);
  // light gates: emitter → disc (always), disc → detector (gated)
  const beams = [];
  for (const [nm, p] of [['A', pA], ['B', pB]]) {
    const m1 = M.beamIR.clone(), m2 = M.beamIR.clone(); own.add(m1); own.add(m2);
    const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 1.45, 20, 1, true), m1);
    b1.rotation.z = Math.PI / 2; b1.position.set(xDisc - 0.8, p.y, p.z);
    const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.95, 20, 1, true), m2);
    b2.rotation.z = Math.PI / 2; b2.position.set(xDisc + 0.43, p.y, p.z);
    // soft glow shells
    const gm1 = M.beamIR.clone(), gm2 = M.beamIR.clone(); own.add(gm1); own.add(gm2);
    const g1 = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.45, 1.45, 20, 1, true), gm1); g1.rotation.z = Math.PI / 2; g1.position.copy(b1.position);
    const g2 = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.95, 20, 1, true), gm2); g2.rotation.z = Math.PI / 2; g2.position.copy(b2.position);
    b1.name = 'beam' + nm + 'in'; b2.name = 'beam' + nm + 'out'; g1.name = b1.name + 'Glow'; g2.name = b2.name + 'Glow';
    for (const b of [b1, b2, g1, g2]) { b.renderOrder = 10; b.castShadow = false; b.receiveShadow = false; enc.add(b); }
    beams.push({ b1, b2, g1, g2, ph: nm === 'A' ? phA : phB, win: nm === 'A' ? winA : winB });
  }
  if (opts.encoder !== false) assy.add(enc);

  // ------------------------------------------------------------------ support bracket (−X), POM-black block with a U seat
  const sup = new THREE.Group(); sup.name = 'support';
  const sx0 = xL + 0.6, sx1 = -hw - 1.0;
  const supShape = new THREE.Shape();
  const sw = 4.2, yb = -AH, yt = 1.6, rcS = 0.8, rsS = rJ + 0.05;
  supShape.moveTo(-sw / 2, yb); supShape.lineTo(sw / 2, yb); supShape.lineTo(sw / 2, yt - rcS);
  supShape.absarc(sw / 2 - rcS, yt - rcS, rcS, 0, Math.PI / 2, false);
  supShape.lineTo(rsS + 0.35, yt); supShape.lineTo(rsS, yt - 0.35); supShape.lineTo(rsS, 0);
  supShape.absarc(0, 0, rsS, 0, -Math.PI, true);
  supShape.lineTo(-rsS, yt - 0.35); supShape.lineTo(-rsS - 0.35, yt); supShape.lineTo(-sw / 2 + rcS, yt);
  supShape.absarc(-sw / 2 + rcS, yt - rcS, rcS, Math.PI / 2, Math.PI, false);
  supShape.lineTo(-sw / 2, yb);
  const supG = extrude(supShape, { depth: sx1 - sx0, front: { r: 0.25, s: 3 }, back: { r: 0.25, s: 3 }, curveSegments: 16 });
  supG.rotateY(Math.PI / 2); supG.translate(sx0, 0, 0);
  sup.add(meshOf(supG, M.housingBlack, 'supportBlock'));
  if (opts.support !== false) assy.add(sup);

  // ------------------------------------------------------------------ x-ray (housing ghost) helpers
  const ghost = M.smokePC; ghost.transparent = false;
  const housingMats = [M.housingBlack];
  const xr = { k: 0 };

  // ------------------------------------------------------------------ state
  const st = { scroll: 0, explode: 0, xray: 0 };
  const gate = (dAng) => {
    // fraction of a beam (≈1.6° wide) inside a slot (slots: half the pitch, centred on multiples of the pitch)
    const pitch = TAU / steps; let u = ((dAng % pitch) + pitch) % pitch; if (u > pitch / 2) u -= pitch;
    const edge = slotW / 2, soft = 0.028 / beamR * 1.0 + 0.012;
    return 1 - smooth(edge - soft, edge + soft, Math.abs(u));
  };
  function apply() {
    const e = st.explode;
    spin.rotation.x = st.scroll;
    // explode: axle out to −X, support further; encoder parts spread along +X
    axle.position.x = -11 * e; sup.position.x = -17 * e;
    emitter.position.set(3.0 * e, 2.2 * e, 0);
    rot.position.x = 7.5 * e;
    detector.position.set(11.5 * e, 2.2 * e, 0);
    spring.position.set(13.5 * e, 3.2 * e, 0);
    housing.position.x = 20 * e; enc.children.forEach(c => { if (c.name === 'boss') c.position.x = 20 * e; });
    for (const b of beams) {
      const t = gate(b.ph - st.scroll);
      const vis = st.xray * (1 - e);
      b.b1.material.opacity = 0.95 * vis; b.b1.visible = vis > 0.01;
      b.b2.material.opacity = 0.95 * vis * t; b.b2.visible = vis * t > 0.01;
      b.g1.material.opacity = 0.22 * vis; b.g1.visible = vis > 0.01;
      b.g2.material.opacity = 0.22 * vis * t; b.g2.visible = vis * t > 0.01;
      b.win.material.color.setRGB(lerp(0.12, 1.0, t), lerp(0.04, 0.32, t), lerp(0.05, 0.25, t));
      b.t = t;
    }
    // x-ray: housing → smoke glass (opaque look kept until k > 0)
    const k = st.xray;
    for (const m of [housing, ...enc.children.filter(c => c.name === 'boss')]) m.material = k > 0.02 ? xrayMat : M.housingBlack;
    xrayMat.opacity = lerp(1, 0.16, k);
  }
  const xrayMat = M.ghost.clone(); own.add(xrayMat);
  xrayMat.color.set(0x9aa3ab); xrayMat.depthWrite = false; xrayMat.side = THREE.DoubleSide;
  void ghost; void housingMats; void xr;

  root.setScroll = (rad) => {
    st.scroll = +rad || 0; apply();
    const A = beams[0].t > 0.5, B = beams[1].t > 0.5;
    return { step: Math.round(st.scroll / (TAU / steps)), A, B, gateA: beams[0].t, gateB: beams[1].t };
  };
  root.setExplode = (k) => { st.explode = clamp01(k); apply(); };
  root.setXray = (k) => { st.xray = clamp01(k); apply(); };
  root.getState = () => ({ ...st, gateA: beams[0].t, gateB: beams[1].t });

  // ------------------------------------------------------------------ spec, parts, dispose
  // closed meshes only (fillet rings and grouser strips are open surfaces): add their volumes analytically
  const ribVol = nG * (2 * (yE - 0.08)) * 0.8 * g * (0.62 + 0.34) / 2;
  const filletVol = 2 * (2 * Math.PI * (rHub + 0.42 * 0.22) * 0.42 * 0.42 * (1 - Math.PI / 4) + 2 * Math.PI * (Ri - 0.55 * 0.22) * 0.55 * 0.55 * (1 - Math.PI / 4));
  const vol = [tread, web, hub].reduce((s, m) => s + meshVolume(m.geometry), 0) + ribVol + filletVol
    - Math.PI * rHub * rHub * tw;   // web disc overlaps the hub
  root.userData.spec = {
    ...WHEEL_SPEC, diameter: D, width: Wd, crownRadius: Rc, grousers: nG, steps, axleHeight: AH, axleDiameter: 2 * rJ,
    hexAF: AF, sagitta: +(crown(0) - crown(hw)).toFixed(3),
    encoderBox: { min: [x0, 0, -zD], max: [x1, AH + yTop, zD] },
    supportBox: { min: [sx0, 0, -sw / 2], max: [sx1, AH + yt, sw / 2] },
    wheelVolume_mm3: +vol.toFixed(1), massEstimate_g: +(vol * 1.77e-3).toFixed(3),
  };
  root.userData.parts = { wheel, tread, grousers, web, hub, axle, disc, detentStar, encoder: enc, housing, emitter, detector, beamA: beams[0].b2, beamB: beams[1].b2, detent: spring, support: sup, spin };
  root.dispose = () => { disposeTree(root, userMats); for (const m of own) m.dispose?.(); };
  apply();
  return root;
}

// ---------------------------------------------------------------------------------- helpers
/** Tangent attribute = circumferential direction around the X axis (for anisotropic turning marks). */
function circTangents(geo) {
  const p = geo.attributes.position, n = p.count, t = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    const y = p.getY(i), z = p.getZ(i), l = Math.hypot(y, z) || 1;
    t[i * 4] = 0; t[i * 4 + 1] = -z / l; t[i * 4 + 2] = y / l; t[i * 4 + 3] = 1;
  }
  geo.setAttribute('tangent', new THREE.BufferAttribute(t, 4));
  return geo;
}
function hexShape(rc, rot = 0) {
  const s = new THREE.Shape();
  for (let i = 0; i < 6; i++) { const a = rot + i * TAU / 6; if (!i) s.moveTo(rc * Math.cos(a), rc * Math.sin(a)); else s.lineTo(rc * Math.cos(a), rc * Math.sin(a)); }
  return s;
}
function hexPath(rc, rot = 0) {
  const pts = [];
  for (let i = 0; i < 6; i++) { const a = rot - i * TAU / 6; pts.push(new THREE.Vector2(rc * Math.cos(a), rc * Math.sin(a))); }
  return new THREE.Path(pts);
}
function dHolePath(r, flat) {
  const pts = []; const a0 = Math.acos(flat / r);
  for (let i = 0; i <= 40; i++) { const a = a0 + (TAU - 2 * a0) * i / 40; pts.push(new THREE.Vector2(r * Math.cos(a), r * Math.sin(a))); }
  return new THREE.Path(pts.reverse());
}
function annularSlot(r0, r1, a0, a1, rr) {
  const pts = [];
  const n = 6;
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([r1 * Math.cos(a), r1 * Math.sin(a)]); }
  for (let i = 0; i <= n; i++) { const a = a1 + (a0 - a1) * i / n; pts.push([r0 * Math.cos(a), r0 * Math.sin(a)]); }
  // fillet only the 4 corners (indices 0, n, n+1, 2n+1)
  const rad = pts.map((_, i) => (i === 0 || i === n || i === n + 1 || i === 2 * n + 1 ? rr : 0));
  return filletPolygon(pts, rad, true, 2);
}
/** Six equilateral-triangle windows (apex to the hub, truncated at rTrunc), spokes 2d wide. */
function triangleWindows({ n, Ri, d, rTrunc, rf, rimGap }) {
  const out = [];
  const half = Math.PI / n;               // 30°
  for (let k = 0; k < n; k++) {
    const b = (k + 0.5) * TAU / n;        // window bisector (spokes at multiples of 60°)
    const ub = [Math.cos(b), Math.sin(b)], up = [-Math.sin(b), Math.cos(b)];
    // side lines: parallel to the sector edges, offset d inward: points p with |p·n_edge| ... solve in (s, t)
    // in the bisector frame (s along ub, t along up) the sector edges are t = ±s·tan(30°); offset lines t = ±(s·tan30 − d/cos30)
    const tn = Math.tan(half), off = d / Math.cos(half);
    // base: perpendicular to the bisector at s = sb, with the base corners at radius Ri − rimGap
    // corner: (sb, tb) with tb = sb·tn − off, sb² + tb² = (Ri − rimGap)²
    const Rc = Ri - rimGap;
    const A = 1 + tn * tn, B = -2 * tn * off, C = off * off - Rc * Rc;
    const sb = (-B + Math.sqrt(B * B - 4 * A * C)) / (2 * A);
    const tb = sb * tn - off;
    // truncation at radius rTrunc: points on the side lines at |p| = rTrunc
    const C2 = off * off - rTrunc * rTrunc;
    const st = (-B + Math.sqrt(B * B - 4 * A * C2)) / (2 * A), tt = st * tn - off;
    const P = (s, t) => [s * ub[0] + t * up[0], s * ub[1] + t * up[1]];
    const arcPts = [];
    const aT = Math.atan2(tt, st);
    for (let i = 1; i < 4; i++) { const a = -aT + (2 * aT) * i / 4; arcPts.push(P(rTrunc * Math.cos(a), rTrunc * Math.sin(a))); }
    const pts = [P(st, -tt), P(sb, -tb), P(sb, tb), P(st, tt), ...arcPts.reverse()];
    const rads = pts.map((_, i) => (i < 4 ? rf : 0));
    out.push(filletPolygon(pts, rads, true, 6));
  }
  return out;
}
/** Concave fillet ring (surface of revolution around Y) between a cylinder r0 and a plane at |y| = y0. */
function filletRing(r0, y0, rad, s, outward) {
  const pts = [];
  const N = 6;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI / 2;
    const r = outward ? r0 + rad - rad * Math.cos(a) : r0 - rad + rad * Math.cos(a);
    const y = y0 + rad - rad * Math.sin(a);
    pts.push([r, y]);
  }
  // orient so the surface normal (right of the walking direction) points at the arc centre
  let p = pts.map(([r, y]) => [r, s * y]);
  const c = [outward ? r0 + rad : r0 - rad, s * (y0 + rad)];
  const d = [p[1][0] - p[0][0], p[1][1] - p[0][1]], nr = [d[1], -d[0]];
  if (nr[0] * (c[0] - p[0][0]) + nr[1] * (c[1] - p[0][1]) < 0) p = p.reverse();
  return lathe(p, { segments: 120, crease: 60 });
}
/** Grousers: trapezoidal ribs following gently curved paths on the crowned floor. */
function grouserGeometry({ n, floor, crown, hw, g, curve, bw, tw }) {
  const P = [], I = [], UV = [];
  const ns = 32;
  for (let k = 0; k < n; k++) {
    const th0 = (k / n) * TAU;
    const base = P.length / 3;
    for (let i = 0; i <= ns; i++) {
      const x = -hw + 2 * hw * i / ns;
      const u = x / hw;
      const th = th0 + curve * (u * u);                 // gentle curve: centre leads, ends trail
      const dth = curve * 2 * u / hw;                   // dθ/dx
      const rF = floor(x), rC = crown(x);
      const taper = Math.sqrt(smooth(0, 0.16, 1 - Math.abs(u)));   // ribs rise quickly from the floor at the ends
      const h = (rC - rF) * taper;
      // local frame: radial er, circumferential et, axial ex
      const er = [0, Math.cos(th), Math.sin(th)], et = [0, -Math.sin(th), Math.cos(th)];
      // lateral direction (in the surface, ⟂ to the rib): mostly circumferential, corrected for the curve
      const tang = [1, rF * dth * et[1], rF * dth * et[2]];
      const tl = Math.hypot(...tang);
      const lat = [(-rF * dth) / tl, et[1] / tl, et[2] / tl];
      const pt = (r, w) => [x + lat[0] * w, r * er[1] + lat[1] * w, r * er[2] + lat[2] * w];
      const ring = [pt(rF - 0.03, -bw / 2), pt(rF + h, -tw / 2), pt(rF + h, tw / 2), pt(rF - 0.03, bw / 2)];
      for (const q of ring) { P.push(...q); UV.push(th / TAU, x); }
    }
    for (let i = 0; i < ns; i++) for (let j = 0; j < 3; j++) {
      const a = base + i * 4 + j, b = a + 1, c = a + 4, d = a + 5;
      I.push(a, d, c, a, b, d);
    }
    // end caps
    const e0 = base, e1 = base + ns * 4;
    I.push(e0, e0 + 2, e0 + 1, e0, e0 + 3, e0 + 2);
    I.push(e1, e1 + 1, e1 + 2, e1, e1 + 2, e1 + 3);
  }
  return creaseNormals(makeGeometry(P, I, UV), 35);
}
function meshVolume(geo) {
  const p = geo.attributes.position.array; let v = 0;
  for (let i = 0; i < p.length; i += 9) {
    v += (p[i] * (p[i + 4] * p[i + 8] - p[i + 5] * p[i + 7]) - p[i + 1] * (p[i + 3] * p[i + 8] - p[i + 5] * p[i + 6]) + p[i + 2] * (p[i + 3] * p[i + 7] - p[i + 4] * p[i + 6])) / 6;
  }
  return Math.abs(v);
}
