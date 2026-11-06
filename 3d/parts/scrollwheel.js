// Magnesium-alloy scroll wheel (#84) + POM axle (#7) + magnetic scroll encoder (Brock, 2026-11-05: "i want to use a
// magnetic encoder that doesn't get affected by dust and have a transparent top housing to see when it's broken like
// switches"; "Yes, switch everywhere"): a normal mouse-encoder outline (TTC's), a black bottom housing with four pins and a
// clear PC top housing; inside, a diametric NdFeB magnet on the rotor facing a 3D Hall angle sensor, the detent star and
// leaf spring kept for the feel; + a POM support bracket for the far journal.
// Representative / proposal geometry. Frame: origin on the PCB top surface below the wheel centre;
// axle along X; wheel centre at Y = axleHeight. Encoder on the user's RIGHT (−X) by default, as on the Sora V2
// PCB (+X is the user's left in this right-handed frame); encoderSide: 'left' puts it on +X (mirror image).
//
// The wheel (Brock, F22.1, 2026-11-04: PMM's magnesium wheel "is 1.0g, ours will be 0.9g ... it should be closer to the pmm
// wheel ... but with 6 arms, i also don't like the texture your chosen, even if it's based on rover tread"):
//  - six arms, an open hub: six tapered arms 60° apart from a small hub ring to a thin rim (his doc: "6 scroll wheel spokes
//    ... allowing for the outer shell of the scroll wheel to be the thinnest"); the bays between them are open
//  - 0.9 g: magnesium AZ31B at 1.77 g/cm³, so the wheel is sized to 508 mm³ (spec.wheelVolume_mm3, massEstimate_g)
//  - "more like a torus than cylinder": the tread is a torus section whose crown radius equals the wheel radius (default),
//    so the top of the wheel is locally spherical: the fingertip sees the same curvature rolling and across  [proposal]
//  - the tread (#30, the texture): a fine straight knurl, 144 V-grooves across the crown (6 per encoder step), 0.12 mm deep,
//    grooves and lands about equally wide, each groove running out to a point before the edges, which stay plain turned
//    bands; bare machined magnesium (Brock, 2026-11-05: "i liked the scroll wheel version with lines better", so the
//    diamond knurl of F25.1 is gone)  [proposal]
//  - F25.2 "thinners arms": the arms run 0.95 → 0.55 mm wide; the weight they gave up went into the skin  [proposal]
import * as THREE from 'three';
import { partMaterials } from './lib/materials.js';
import { HIGHLIGHT } from '../lib/studio.js';
import {
  extrude, lathe, sweep, arc, rectSection, roundedRectShape, roundedRectPath, circlePath, filletPolygon, meshOf,
  disposeTree, clamp01, smooth, lerp, makeGeometry, creaseNormals, circleSection,
} from './lib/geom.js';

const TAU = Math.PI * 2;

export const WHEEL_SPEC = {
  name: 'Magnesium scroll wheel + magnetic encoder',
  label: 'representative / proposal',
  material: 'magnesium alloy AZ31B (1.77 g/cm³), machined, bare passivated finish',
  wheel: 'six thin tapered arms on an open hub, a thin crowned rim with a spine where the arms meet it; 0.9 g (Brock\'s figure, F22.1; thinner arms, F25.2)',
  tread: 'fine straight knurl: 144 V-grooves (90°) across the crown, 6 per encoder step, 0.12 mm deep, 0.50 mm pitch, running out to points 0.35 mm before the edge fillets',
  axle: 'POM (acetal), hex-keyed in the hub, D-flat drive into the encoder',
  encoder: 'magnetic (Hall), in a normal encoder outline: nickel-silver frame (non-magnetic) with drawn bushing collar, black bottom housing with 4 pins at 1.25 mm, clear PC top housing; inside, a Ø3.0 x 0.8 mm diametric NdFeB magnet on the rotor, 0.4 mm from a 3D Hall angle sensor (KTH5791-class, QFN 3 x 3, A/B quadrature) on a small vertical board; 24-lobe detent star + leaf spring',
  support: 'POM bracket: U seat with lead-in chamfers for the far journal, foot with two locating pegs, gusset',
  densities: { AZ31B: 1.77, Al6061: 2.70, POM: 1.42 },
  sources: {
    pmm: 'PMM, Magnesium Scroll Wheel [PULSE, CYBER OP, OP1 8k, OP1w 4k]: magnesium alloy, 1.0 g, "the magnesium wheel only" (the pin ships beside it) [MC]',
    target: 'Brock (F22.1): "ours will be 0.9g", "closer to the pmm wheel ... but with 6 arms" [PR]',
    spokes: 'Brock\'s doc: "6 scroll wheel spokes ... allowing for the outer shell of the scroll wheel to be the thinnest" [PR]',
    az31b: 'Tech Steel & Materials, AZ31B-H24: 1.77 g/cc [DS]; aluminium 6061-T6 2.70 (Protolabs) [DS]',
    optical: 'Razer: optical encoders "3.3× more reliable" [MC]; Viper V4 Pro uses an optical scroll encoder [MC/IM]',
    hall: 'Conntek KTH5791: 3D Hall sensor for mouse wheels, non-contact, AB(Z) out, CPR 16-1024, 0.8 mA typ at 3.3 V, QFN 3 x 3, "10M+" life [DS/MC]',
    dust: 'MPS, Using MagAlpha devices to replace optical encoders (2015): optical encoders "subject to problems due to contamination (dirt) obstructing the optical path"; magnetic: "insensitivity to dust and dirt" [DS]',
    ttc: "TTC optical encoder launch photo (Brock's brief): normal encoder outline, metal frame + plastic housing, bushing, pins [PR]",
    interrupter: 'Honeywell HOA0901 slotted optical switch (emitter + phototransistor across a slot) [DS]; US6380927 and US12228433 (optical scroll encoders: slotted wheel through an interrupter) [DS]',
    teardown: "Igor's Lab, Razer Basilisk V3 Pro teardown (optical scroll encoder internals) [IM]",
    size: 'Ø22.74 × 7.0 mm, the Theseus shell\'s wheel (3d/shell meta.wheel); Sora V2 wheel ≈ 22–23.5 × 7.5–8 mm from Brock\'s PCB photo [DV]',
  },
};

export function buildScrollWheel(opts = {}) {
  const D = opts.diameter ?? 22.74, Wd = opts.width ?? 7.0, R = D / 2, hw = Wd / 2;
  const Rc = opts.crownRadius ?? R;
  const nK = opts.knurl ?? 144, steps = opts.steps ?? 24, nArms = opts.arms ?? 6;
  /* the axle's height over the board's top: 12, the mouse's (the shell's wheel centre 17.03 over the board's top 5.03; pcb.js
     and shell.js pass 12). H2 (2026-11-06): the default was 11, so the part on its own (and its 2D twin) stood 1 mm short */
  const AH = opts.axleHeight ?? 12;
  // geometry is built with the encoder on +X, then mirrored in X for the user's right (default)
  const es = opts.encoderSide ?? 'right';
  const side = (es === 'left' || es === 1 || es === '+1') ? 1 : -1;
  const M = partMaterials(opts.materials);
  const hiColor = opts.highlight ?? HIGHLIGHT[opts.theme] ?? HIGHLIGHT.night;      // the deck sets C.hero through setHighlight
  if (opts.anisoRot !== undefined) { M.magnesium.anisotropyRotation = +opts.anisoRot; M.magnesiumFace.anisotropyRotation = +opts.anisoRot; }
  const userMats = new Set(Object.values(opts.materials || {}));
  const own = new Set(Object.values(M).filter(m => !userMats.has(m)));

  const root = new THREE.Group(); root.name = 'ScrollWheel';
  const assy = new THREE.Group(); assy.name = 'assembly'; assy.position.y = AH;
  if (side < 0) assy.scale.x = -1;   // exact mirror: rotation about X and the scroll sign are unaffected
  root.add(assy);
  const spin = new THREE.Group(); spin.name = 'spin';        // everything that turns with the wheel
  assy.add(spin);

  // ------------------------------------------------------------------ the rim: a thin crowned skin (lathe around Y → X)
  // The skin is thinnest at the edges and thickest at the centre plane, where a low spine takes the six arms. Its outer
  // surface between ±yK is the knurled tread (below); the lathe here is the rest of the skin, an open profile walked with the
  // material on its left: the plain band and fillet at +X, the side face, the inside, the side face and fillet at −X.
  const crown = (y) => (R - Rc) + Math.sqrt(Rc * Rc - y * y);   // crown surface radius at axial y
  const tE = opts.skinEdge ?? 0.55, tC = opts.skinCentre ?? 1.040;   // skin thickness at the edges, at the centre plane (0.900 g with the straight knurl and the thin arms)
  const skin = (y) => tE + (tC - tE) * (1 - (y / hw) ** 2);
  const rIn = (y) => crown(y) - skin(y);              // the skin's inside
  const Ri = rIn(0);                                  // at the centre plane
  const fe = 0.35, chI = 0.2;                         // tread-to-side fillet (tangent to both), inside chamfer
  const yF = hw - fe, rF = (R - Rc) + Math.sqrt((Rc - fe) ** 2 - yF * yF);   // the fillet's centre (r, y), +X side
  const phT = Math.atan2(yF, rF - (R - Rc)), yT = yF + fe * Math.sin(phT);    // where it meets the crown
  /* knurl: depth, band half width, run-out, and each groove's half width in pitches (a 90° V: half as wide as it is deep
     twice over, so at 144 grooves the grooves and the lands between them are about equally wide) */
  const kd = opts.knurlDepth ?? 0.12, yK = +(yT - 0.35).toFixed(3), run = 0.45, hwU = kd * Math.tan(Math.PI / 4) / (TAU * R / nK);
  const prof = [];
  for (let i = 0; i < 3; i++) { const y = yK + (yT - yK) * i / 3; prof.push([crown(y), y]); }
  for (let i = 0; i <= 8; i++) { const a = phT + (Math.PI / 2 - phT) * i / 8; prof.push([rF + fe * Math.cos(a), yF + fe * Math.sin(a)]); }
  prof.push([rIn(hw) + chI, hw], [rIn(hw - chI), hw - chI]);
  for (let i = 1; i < 10; i++) { const y = (hw - chI) * (1 - 2 * i / 10); prof.push([rIn(y), y]); }
  prof.push([rIn(-(hw - chI)), -(hw - chI)], [rIn(-hw) + chI, -hw]);
  for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + (Math.PI / 2 - phT) * i / 8; prof.push([rF + fe * Math.cos(a), -yF + fe * Math.sin(a)]); }
  for (let i = 1; i <= 3; i++) { const y = -yT + (yT - yK) * i / 3; prof.push([crown(y), y]); }
  const toX = (geo) => { geo.rotateZ(-Math.PI / 2); return geo; };
  // nK segments, one at each groove's centre, so the skin's edge circles meet the knurl's run-out points exactly
  const rim = meshOf(circTangents(toX(lathe(prof, { segments: nK, crease: 30 }))), M.magnesium, 'rim');
  spin.add(rim);

  // ------------------------------------------------------------------ the tread: a fine straight knurl
  // nK V-grooves (90° included) across the crown, 6 per encoder step at 144; each runs out to a point over `run` as the
  // cutter leaves, so the edges stay plain turned bands. The lands are the crown itself.
  const tread = meshOf(circTangents(knurlGeometry({ N: nK, crown, yb: yK, run, kd, hwU })), M.magnesium, 'tread');
  spin.add(tread);

  // ------------------------------------------------------------------ six arms on an open hub
  // One part turned and then milled through: the arms (tapered in width and in thickness, thicker at the hub), a low spine
  // round the rim's inside and a flange round the hub, the six bays between them open, every corner filleted by the cutter.
  const AF = 2.0, rHub = 2.05, hubW = 3.6;           // hex across flats, hub radius, hub width
  const tH = 1.3, tR = 0.9;                           // arm thickness (axial) at the hub and at the rim
  const wH = 0.95, wR = 0.55;                         // arm width at the hub and at the rim (thinner, F25.2)
  const spine = 0.45, flange = 0.4;                   // the web left round the rim's inside and round the hub
  const armShape = new THREE.Shape(); armShape.absarc(0, 0, Ri + 0.15, 0, TAU, false);
  for (const w of armWindows({ n: nArms, rHub, Ri, rIn0: rHub + flange, rOut0: Ri - spine, wH, wR, rfHub: 0.32, rfRim: 0.5, phase: Math.PI / 6 })) armShape.holes.push(w);
  armShape.holes.push(circlePath(rHub - 0.05));     // inside the hub ring (hidden), so the two overlap by 0.05 mm only
  const armG = extrude(armShape, { depth: tH, front: { r: 0.12, s: 3 }, back: { r: 0.12, s: 3 }, curveSegments: 96, raw: true });
  armG.rotateY(Math.PI / 2); armG.translate(-tH / 2, 0, 0);   // shape (sx, sy) → (Z = −sx, Y = sy), e → X
  { // the turned faces are shallow cones: tH at the hub, tR from the rim's spine out
    const p = armG.attributes.position;
    for (let i = 0; i < p.count; i++) { const r = Math.hypot(p.getY(i), p.getZ(i)), k = lerp(1, tR / tH, clamp01((r - rHub) / (Ri - rHub))); p.setX(i, p.getX(i) * k); }
  }
  const arms = meshOf(circTangents(creaseNormals(armG, 35)), M.magnesiumFace, 'arms');
  spin.add(arms);
  // the hub ring (round outside, hex bore), chamfered
  const hubShape = new THREE.Shape(); hubShape.absarc(0, 0, rHub, 0, TAU, false);
  hubShape.holes.push(hexPath(AF / 2 / Math.cos(Math.PI / 6), Math.PI / 6));
  const hubG = extrude(hubShape, { depth: hubW, front: { r: 0.2, s: 4 }, back: { r: 0.2, s: 4 }, curveSegments: 48 });
  hubG.rotateY(Math.PI / 2); hubG.translate(-hubW / 2, 0, 0);
  const hub = meshOf(circTangents(hubG), M.magnesiumFace, 'hub');
  spin.add(hub);
  // fillet rings: flange↔hub and spine↔rim (both faces)
  const fHub = 0.3, fRim = 0.32;
  for (const s of [1, -1]) {
    const fh = filletRing(rHub, tH / 2, fHub, s, true);
    const fr = filletRing(Ri, tR / 2, fRim, s, false);
    spin.add(meshOf(circTangents(toX(fh)), M.magnesiumFace, 'filletHub'), meshOf(circTangents(toX(fr)), M.magnesiumFace, 'filletRim'));
  }
  const wheel = new THREE.Group(); wheel.name = 'wheel';
  wheel.add(...spin.children.slice());   // move into a named sub-group
  spin.add(wheel);

  // ------------------------------------------------------------------ POM axle (round journals, hex in the hub, D drive)
  const axle = new THREE.Group(); axle.name = 'axle';
  const xL = -7.7, rJ = 1.2;                          // the left journal ends 0.2 mm inside the support's seat (H1: the seat moved to the bracket)
  const XJ = 6.35, XD = 11.15;                        // the right journal ends inside the encoder's rotor; D drive to XD
  const left = lathe([[0, xL], [rJ - 0.2, xL], [rJ, xL + 0.2], [rJ, -hubW / 2 - 0.6], [1.55, -hubW / 2 - 0.45], [1.55, -hubW / 2 + 0.05], [0, -hubW / 2 + 0.05]], { segments: 48 });
  const right = lathe([[0, hubW / 2 - 0.05], [1.55, hubW / 2 - 0.05], [1.55, hubW / 2 + 0.45], [rJ, hubW / 2 + 0.6], [rJ, XJ], [0, XJ]], { segments: 48 });
  axle.add(meshOf(toX(left), M.pom, 'axleL'), meshOf(toX(right), M.pom, 'axleR'));
  const hexG = extrude(hexShape(AF / 2 / Math.cos(Math.PI / 6) - 0.01, Math.PI / 6), { depth: hubW + 0.2, front: { r: 0.06, s: 1 }, back: { r: 0.06, s: 1 } });
  hexG.rotateY(Math.PI / 2); hexG.translate(-(hubW + 0.2) / 2, 0, 0);
  axle.add(meshOf(hexG, M.pom, 'axleHex'));
  const dShape = new THREE.Shape();
  { const a0 = Math.acos(0.75 / rJ); dShape.moveTo(rJ * Math.cos(a0), rJ * Math.sin(a0)); dShape.absarc(0, 0, rJ, a0, TAU - a0, false); dShape.lineTo(rJ * Math.cos(a0), rJ * Math.sin(a0)); }
  const dG = extrude(dShape, { depth: XD - XJ, front: { r: 0.15, s: 2 }, curveSegments: 24 });
  dG.rotateY(Math.PI / 2); dG.translate(XJ, 0, 0);
  axle.add(meshOf(dG, M.pom, 'axleD'));
  spin.add(axle);

  // ------------------------------------------------------------------ the magnetic encoder (Brock, F27 on `sealed`: "i want to
  // use a magnetic encoder that doesn't get affected by dust and have a transparent top housing to see when it's broken
  // like switches"). The same envelope as a normal mouse encoder (TTC's), so the board and the shell see no change:
  // a black bottom housing with four pins, a clear PC top housing over the moving parts, a nickel-silver frame on the
  // wheel side (non-magnetic, so it doesn't bend the field). Inside: the orange POM rotor on the axle's D drive with the
  // 24-lobe detent star under a leaf spring (the feel stays mechanical), and on the rotor's end a diametrically
  // magnetised NdFeB disc facing a 3D Hall angle sensor (KTH5791-class, QFN 3 x 3, A/B quadrature out) on a small
  // vertical board, 0.4 mm across the gap. Nothing touches, and there is no light path for dust to block.
  const enc = new THREE.Group(); enc.name = 'encoder';
  const XF0 = 6.65, XF1 = 6.90, XB0 = XF1, XB1 = 11.5;           // frame plate, then the housing (along the axle)
  const ZH = 5.5, YT = 4.0, YB = -AH, CH = 2.6;                   // half width, top, board, top-front chamfer
  const YS = -3.15;                                               // split: black bottom housing below, clear top above
  const toYZ = (geo, x0) => { geo.applyMatrix4(new THREE.Matrix4().set(0, 0, 1, x0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1)); return geo; };
  const outline = (inset = 0) => {
    const zh = ZH - inset, yt = YT - inset, yb = YB + inset, ch = CH - inset * 0.41;
    return [[zh, yb], [zh, yt], [-zh + ch, yt], [-zh, yt - ch], [-zh, yb]];      // u = −z, v = y; chamfer on the nose side
  };
  // bottom housing (from the board to the split) and the clear top housing (the split to the top, the chamfer, the rotor's hole)
  const botPts = [[ZH, YB], [ZH, YS], [-ZH, YS], [-ZH, YB]];
  const botShape = filletPolygon(botPts, [0.25, 0.05, 0.05, 0.25], false, 4);
  const housing = meshOf(toYZ(extrude(botShape, { depth: XB1 - XB0, front: { r: 0.2, s: 3 }, back: { r: 0.08, s: 2 }, curveSegments: 12 }), XB0), M.housingBlack, 'housing');
  enc.add(housing);
  const topPts = [[ZH, YS], [ZH, YT], [-ZH + CH, YT], [-ZH, YT - CH], [-ZH, YS]];
  const topShape = filletPolygon(topPts, [0.05, 0.45, 0.35, 0.35, 0.05], false, 5);   // (the rotor enters through the frame's collar)
  const cover = meshOf(toYZ(extrude(topShape, { depth: XB1 - XB0, front: { r: 0.3, s: 4 }, back: { r: 0.12, s: 2 }, curveSegments: 40 }), XB0), M.clearPC, 'cover');
  cover.renderOrder = 3;
  enc.add(cover);
  // nickel-silver frame on the wheel side: a plate with a drawn collar round the rotor, holes for the heat-stake pegs
  const frame = new THREE.Group(); frame.name = 'frame';
  const fShape = filletPolygon(outline(0), [0.25, 0.45, 0.35, 0.35, 0.25], false, 5);
  fShape.holes.push(circlePath(1.85));
  const pegAt = [[3.95, YB + 2.1], [-3.95, YB + 2.1], [3.95, 2.35], [-2.2, 2.35]];          // (u, v)
  for (const [u, v] of pegAt) fShape.holes.push(circlePath(0.36, u, v));
  frame.add(meshOf(toYZ(extrude(fShape, { depth: XF1 - XF0, front: { r: 0.05, s: 1 }, back: { r: 0.05, s: 1 }, curveSegments: 40 }), XF0), M.shieldNickel, 'framePlate'));
  const collar = lathe([[1.85, 0], [1.85, -0.42], [1.97, -0.5], [2.28, -0.5], [2.4, -0.38], [2.4, 0]], { segments: 72, crease: 40 });
  collar.rotateZ(-Math.PI / 2); collar.translate(XF0 + 0.005, 0, 0);
  frame.add(meshOf(collar, M.shieldNickel, 'frameCollar'));
  for (const [u, v] of pegAt) {
    const pg = lathe([[0, 0], [0.34, 0], [0.34, 0.06], ...arc(0.18, 0.06, 0.16, 0, Math.PI / 2, 4).slice(1).map(([r, y]) => [r, y]), [0, 0.22]], { segments: 20 });
    pg.rotateZ(Math.PI / 2); pg.translate(XF0 + 0.02, v, -u);
    enc.add(meshOf(pg, v > YS ? M.clearPC : M.housingBlack, 'peg'));
  }
  // folded tabs over the top edge, and round the sides onto the bottom housing
  const tabTop = (z0, z1) => { const g = extrude(roundedRectShape(1.25, z1 - z0, 0.12), { depth: 0.34, front: { r: 0.05, s: 1 }, curveSegments: 4 });
    g.rotateX(-Math.PI / 2); g.translate(XF0 + 0.62, YT - 0.12, (z0 + z1) / 2); return g; };
  frame.add(meshOf(tabTop(-3.6, -2.0), M.shieldNickel, 'tabTop'), meshOf(tabTop(0.6, 1.9), M.shieldNickel, 'tabTop'));
  for (const s of [1, -1]) {
    const y0 = -5.6, y1 = -4.1, zs = s * (ZH + 0.11);
    const side = new THREE.Shape(); side.moveTo(0, y0); side.lineTo(XB1 - XF0 + 0.02, y0); side.lineTo(XB1 - XF0 + 0.02, y1); side.lineTo(0, y1); side.lineTo(0, y0);
    const sg = extrude(side, { depth: 0.22, front: { r: 0.04, s: 1 }, back: { r: 0.04, s: 1 }, curveSegments: 2 });
    sg.translate(XF0, 0, zs - 0.11);
    frame.add(meshOf(sg, M.shieldNickel, 'tabSide'));
    const fold = extrude(roundedRectShape(0.95, y1 - y0, 0.1), { depth: 0.22, front: { r: 0.04, s: 1 }, curveSegments: 4 });
    fold.rotateY(Math.PI / 2); fold.translate(XB1 - 0.02, (y0 + y1) / 2, s * (ZH - 0.38));
    frame.add(meshOf(fold, M.shieldNickel, 'tabFold'));
  }
  // two SMD feet (H1, board plan 5): the frame's side tabs run on down to the board and bend outward into feet on the
  // footprint's F1/F2 pads (1.0 x 1.2 at 8.35 from the wheel's centre, z +/-5.9). The old J-hook legs stood in the frame's
  // plane, 6.65 to 6.90 from the centre: over the wheel bay (x +/-7.20), so into nothing
  const XFT0 = 7.88, XFT1 = 8.82;                                  // the feet's span along the axle
  for (const s of [1, -1]) {
    const zs = s * (ZH + 0.11);
    const strip = new THREE.BoxGeometry(XFT1 - XFT0, (-4.1) - (YB + 0.12), 0.22);
    strip.translate((XFT0 + XFT1) / 2, ((-4.1) + (YB + 0.12)) / 2, zs);
    frame.add(meshOf(strip, M.shieldNickel, 'leg'));
    const foot = extrude(roundedRectShape(XFT1 - XFT0, 0.95, 0.08), { depth: 0.12, front: { r: 0.03, s: 1 }, curveSegments: 3 });
    foot.rotateX(-Math.PI / 2); foot.translate((XFT0 + XFT1) / 2, YB, zs + s * 0.42);
    frame.add(meshOf(foot, M.shieldNickel, 'foot'));
  }
  enc.add(frame);

  // the rotor: the orange POM hub on the D drive, the detent star near the wheel side, the magnet on its far end
  const rot = new THREE.Group(); rot.name = 'encoderRotor';
  const hubR = 1.65, XM0 = 8.95, XM1 = 9.75, magR = 1.5;              // magnet: Ø3.0 x 0.8 mm NdFeB, nickel-plated
  const hubSh = new THREE.Shape(); hubSh.absarc(0, 0, hubR, 0, TAU, false);
  hubSh.holes.push(dHolePath(rJ + 0.02, 0.77));
  const rhG = extrude(hubSh, { depth: XM0 - (XF0 - 0.42), front: { r: 0.1, s: 2 }, back: { r: 0.14, s: 3 }, curveSegments: 48 });
  rhG.rotateY(Math.PI / 2); rhG.translate(XF0 - 0.42, 0, 0);
  const rotorHub = meshOf(rhG, M.rotorOrange, 'rotorHub');
  // detent star (24 rounded lobes, V valleys)
  const star = new THREE.Shape(), nL = steps, R0 = 2.18, Rl = 2.55, XS = 7.45;
  for (let i = 0; i <= nL * 16; i++) {
    const a = (i / (nL * 16)) * TAU, f = ((a * nL / TAU) % 1 + 1) % 1;
    const r = R0 + (Rl - R0) * Math.pow(Math.sin(Math.PI * f), 0.6);
    if (i === 0) star.moveTo(r * Math.cos(a), r * Math.sin(a)); else star.lineTo(r * Math.cos(a), r * Math.sin(a));
  }
  star.holes.push(circlePath(hubR - 0.02));
  const starG = extrude(star, { depth: 0.7, front: { r: 0.06, s: 2 }, back: { r: 0.06, s: 2 }, curveSegments: 4 });
  starG.rotateY(Math.PI / 2); starG.translate(XS, 0, 0);
  const detentStar = meshOf(starG, M.pomBlack, 'detentStar');
  // the magnet: two half-discs (north and south of the diametric magnetisation), nickel-plated, a hairline between them
  const magnet = new THREE.Group(); magnet.name = 'magnet';
  const halfDisc = (a0) => { const sh = new THREE.Shape(); sh.moveTo(0.012 * Math.cos(a0 + Math.PI / 2), 0.012 * Math.sin(a0 + Math.PI / 2));
    sh.absarc(0, 0, magR, a0 + 0.008, a0 + Math.PI - 0.008, false); sh.lineTo(0.012 * Math.cos(a0 + Math.PI / 2), 0.012 * Math.sin(a0 + Math.PI / 2));
    const g = extrude(sh, { depth: XM1 - XM0, front: { r: 0.05, s: 2 }, back: { r: 0.05, s: 2 }, curveSegments: 32 });
    g.rotateY(Math.PI / 2); g.translate(XM0, 0, 0); return g; };
  const magN = meshOf(halfDisc(0), M.shieldNickel, 'magnetN'), magS = meshOf(halfDisc(Math.PI), M.nickel, 'magnetS');
  magnet.add(magN, magS);
  rot.add(rotorHub, detentStar, magnet);
  if (opts.encoder !== false) spin.add(rot);
  // leaf spring over the star: phosphor bronze, both ends in slots of the housing, a formed bump on the lobes
  const springPts = [];
  for (let i = 0; i <= 36; i++) {
    const t = i / 36, z = -3.3 + 6.6 * t;
    const bump = Math.exp(-((z - 0) ** 2) / 0.12) * 0.22;
    springPts.push(new THREE.Vector3(XS + 0.35, Rl + 0.02 + 0.12 + 0.34 * (2 * t - 1) ** 2 - bump, z));
  }
  const spring = meshOf(sweep(springPts, rectSection(0.1, 0.8, 0.02), { up: [0, 1, 0] }), M.phosBronze, 'detentSpring');
  enc.add(spring);
  // the sensor: a small vertical board (black mask) across the housing's far end, the Hall IC facing the magnet 0.4 mm
  // away, a decoupling capacitor under it, four pins down to the main board (VDD, A, B, GND)
  const sensor = new THREE.Group(); sensor.name = 'hallSensor';
  const XIC0 = XM1 + 0.4, XIC1 = XIC0 + 0.75, XSB0 = XIC1, XSB1 = XSB0 + 0.5;
  const sbShape = roundedRectShape(7.4, 9.6, 0.3, 0, -1.6);                     // u = −z, v = y: y −6.4 … 3.2
  const sb = meshOf(toYZ(extrude(sbShape, { depth: XSB1 - XSB0, front: { r: 0.04, s: 1 }, back: { r: 0.04, s: 1 }, curveSegments: 6 }), XSB0), M.maskBlack, 'sensorBoard');
  const ic = meshOf(toYZ(extrude(roundedRectShape(3.0, 3.0, 0.08), { depth: XIC1 - XIC0, front: { r: 0.05, s: 1 }, curveSegments: 3 }), XIC0), M.lcpBlack, 'hallIC');
  // the IC's exposed lands at its edges, a pin-1 dot
  for (let k = 0; k < 4; k++) for (const s of [-1, 1]) {
    const land = new THREE.BoxGeometry(0.06, 0.25, 0.4); const lm = meshOf(land, M.tin, 'icLand');
    lm.position.set(XIC1 - 0.03, s * 1.5, (k - 1.5) * 0.5); sensor.add(lm);
  }
  const dot = meshOf(new THREE.CylinderGeometry(0.16, 0.16, 0.02, 16).rotateZ(Math.PI / 2), M.housingBlack, 'icDot'); dot.position.set(XIC0 - 0.005, 1.05, -1.05);
  const cap = meshOf(new THREE.BoxGeometry(0.5, 0.5, 1.0), M.ceramic || M.paWhite, 'cap'); cap.position.set(XSB0 - 0.25, -3.0, 0);
  for (const s of [-1, 1]) { const e = meshOf(new THREE.BoxGeometry(0.52, 0.52, 0.22), M.tin, 'capEnd'); e.position.set(XSB0 - 0.25, -3.0, s * 0.42); sensor.add(e); }
  sensor.add(sb, ic, dot, cap);
  enc.add(sensor);
  // four pins in a row along the bottom, 1.25 mm pitch, from the sensor board down into the main board
  const XP = (XSB0 + XSB1) / 2, pins = new THREE.Group(); pins.name = 'pins';
  for (let i = 0; i < 4; i++) {
    const z = (i - 1.5) * 1.25;
    const pp = [[-0.25, YB + 4.6 - YB], [-0.25, -1.45], [-0.08, -1.75], [0.08, -1.75], [0.25, -1.45], [0.25, YB + 4.6 - YB]];
    const g = extrude(filletPolygon(pp, [0, 0.06, 0.03, 0.03, 0.06, 0], false, 2), { depth: 0.3, front: { r: 0.04, s: 1 }, back: { r: 0.04, s: 1 } });
    g.rotateY(-Math.PI / 2); g.translate(XP + 0.15, YB, z);
    pins.add(meshOf(g, M.tin, 'pin'));
  }
  enc.add(pins);
  // the field (x-ray only, a diagram like the old light gates): lines out of the north half, round in front of the magnet
  // through the sensor's die, back into the south half; they turn with the magnet, which is how the sensor reads the angle
  const fieldMat = new THREE.MeshBasicMaterial({ color: hiColor, transparent: true, opacity: 0.9, depthWrite: false, depthTest: false, toneMapped: false });
  own.add(fieldMat);
  const field = new THREE.Group(); field.name = 'field';
  for (const [r0, reach] of [[0.45, 0.75], [0.85, 1.05], [1.25, 1.45]]) {
    const pts = [];
    for (let i = 0; i <= 28; i++) { const a = Math.PI * i / 28; pts.push(new THREE.Vector3(XM1 + reach * Math.sin(a), r0 * Math.cos(a), 0)); }
    field.add(meshOf(sweep(pts, circleSection(0.045, 10), { up: [0, 0, 1] }), fieldMat, 'fieldLine'));
    // the arrowhead at the line's middle (pointing from north to south)
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.26, 12), fieldMat); head.position.set(XM1 + reach, 0, 0); head.rotation.z = Math.PI;
    field.add(head);
  }
  field.traverse(o => { if (o.isMesh) { o.renderOrder = 10; o.castShadow = false; o.receiveShadow = false; } });
  rot.add(field);
  if (opts.encoder !== false) assy.add(enc);

  // ------------------------------------------------------------------ support bracket (−X): a moulded POM bracket
  // H1 (board plan 5): it stands on the board's bracket footprint WB1 (10.4 from the wheel's centre, its four hold-down
  // tabs at 8.3 and 12.5, z +/-3.45) beside the wheel bay, not in it: a base with a window over the middle-click tact
  // switch, a post at the bay's edge, and the U seat the journal clicks into (lead-in chamfers) cantilevered over the bay
  const sup = new THREE.Group(); sup.name = 'support';
  const sx0 = -7.9, sx1 = -hw - 1.8;                               // the seat: 5.3 to 7.9 from the centre (WB1's boss)
  const XP0 = -9.7, BX0 = -13.05, BX1 = -7.75, BZ = 3.95, BH = 2.4;   // the post (7.9 to 9.7), the base (7.75 to 13.05)
  const supShape = new THREE.Shape();
  const sw = 4.2, yb = -2.4, yt = 1.6, rcS = 0.8, rsS = rJ + 0.05;
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
  // the base on the board, with a window over the middle-click switch (WB1: 5.4 x 7.9, the window 3.8 x 3.6)
  const baseSh = roundedRectShape(BX1 - BX0, 2 * BZ, 0.5, (BX0 + BX1) / 2, 0);
  baseSh.holes.push(roundedRectPath(3.8, 3.6, 0.3, (BX0 + BX1) / 2, 0));
  const baseG = extrude(baseSh, { depth: BH, front: { r: 0.2, s: 2 }, curveSegments: 6 });
  baseG.rotateX(-Math.PI / 2); baseG.translate(0, -AH, 0);
  sup.add(meshOf(baseG, M.housingBlack, 'supportFoot'));
  // the post from the base up to the seat's top, at the bay's edge
  const postG = extrude(roundedRectShape(sx0 - XP0, sw, 0.4, (XP0 + sx0) / 2, 0), { depth: yt - (-AH + BH), front: { r: 0.2, s: 2 }, curveSegments: 6 });
  postG.rotateX(-Math.PI / 2); postG.translate(0, -AH + BH, 0);
  sup.add(meshOf(postG, M.housingBlack, 'supportPost'));
  // four tin-plated hold-down tabs, bent from the base onto WB1's pads
  for (const [tx, tz] of [[-8.3, 3.45], [-12.5, 3.45], [-8.3, -3.45], [-12.5, -3.45]]) {
    const t = new THREE.BoxGeometry(1.0, 0.12, 0.8); t.translate(tx, -AH + 0.06, tz); sup.add(meshOf(t, M.tin, 'supportTab'));
  }
  if (opts.support !== false) assy.add(sup);

  // ------------------------------------------------------------------ x-ray: the bottom housing and the frame become smoke glass
  // (the top housing is clear already: that is the point of it, Brock: "to see when it's broken like switches")
  const xrayMat = M.ghost.clone(); own.add(xrayMat);
  xrayMat.color.set(0x9aa3ab); xrayMat.depthWrite = false; xrayMat.side = THREE.DoubleSide;
  const xrayFrame = M.ghost.clone(); own.add(xrayFrame);
  xrayFrame.color.set(0xc9ced3); xrayFrame.depthWrite = false; xrayFrame.side = THREE.DoubleSide;
  const shellMeshes = [housing, ...enc.children.filter(c => c.name === 'peg' && c.material === M.housingBlack)];
  const frameMeshes = []; frame.traverse(o => { if (o.isMesh) frameMeshes.push(o); });

  // ------------------------------------------------------------------ state
  // The sensor reads the magnet's angle and gives A/B in quadrature, one full cycle per detent step (KTH5791: ABZ out,
  // programmable 16-1024 counts per turn; 24 steps x 4 edges = 96). A and B are the signs of the cosine and sine of the
  // electrical angle (steps x the wheel's angle); gateA / gateB are their soft 0..1 levels for the deck's diagrams.
  const st = { scroll: 0, explode: 0, xray: 0 };
  const level = (v) => smooth(-0.12, 0.12, v);
  let qA = 1, qB = 0.5;
  function apply() {
    const e = st.explode;
    spin.rotation.x = st.scroll;
    // explode: axle out to −X, support further; the encoder opens along +X: rotor, then the cover lifts, sensor and pins out
    axle.position.x = -11 * e; sup.position.x = -17 * e;
    frame.position.x = 2.2 * e;
    rot.position.x = 5.0 * e;
    spring.position.set(9.0 * e, 3.2 * e, 0);
    cover.position.set(11.5 * e, 6.0 * e, 0);
    enc.children.forEach(c => { if (c.name === 'peg') c.position.set(c.material === M.clearPC ? 11.5 * e : 15 * e, c.material === M.clearPC ? 6.0 * e : 0, 0); });
    sensor.position.x = 13.0 * e; pins.position.x = 15.0 * e;
    housing.position.x = 15 * e;
    const el = st.scroll * steps;
    qA = level(Math.cos(el)); qB = level(Math.sin(el));
    field.visible = st.xray * (1 - e) > 0.01;
    fieldMat.opacity = 0.9 * st.xray * (1 - e);
    const k = st.xray;
    for (const m of shellMeshes) m.material = k > 0.02 ? xrayMat : M.housingBlack;
    for (const m of frameMeshes) m.material = k > 0.02 ? xrayFrame : M.shieldNickel;
    xrayMat.opacity = lerp(1, 0.14, k); xrayFrame.opacity = lerp(1, 0.18, k);
  }

  root.setScroll = (rad) => {
    st.scroll = +rad || 0; apply();
    return { step: Math.round(st.scroll / (TAU / steps)), A: qA > 0.5, B: qB > 0.5, gateA: qA, gateB: qB };
  };
  root.setExplode = (k) => { st.explode = clamp01(k); apply(); };
  root.setXray = (k) => { st.xray = clamp01(k); apply(); };
  /** the deck's highlight colour (C.hero, whatever hue Brock picks): the field lines */
  root.setHighlight = (c) => { fieldMat.color.set(c); apply(); };
  root.getState = () => ({ ...st, gateA: qA, gateB: qB });

  // ------------------------------------------------------------------ spec, parts, dispose
  // The wheel's volume: the skin by Pappus over its profile closed along the crown, less the knurl's grooves (a V of depth
  // kd·q and half width hwU·q pitches, q the run-out); the arms and the hub ring as closed meshes, less where they overlap
  // (the arms' outer ring 0.15 mm into the skin, 0.05 mm into the hub); the fillet rings (open surfaces) analytically.
  const closedProf = prof.slice(); for (let i = 1; i < 48; i++) { const y = -yK + 2 * yK * i / 48; closedProf.push([crown(y), y]); }
  const skinV = Math.abs(revolvedVolume(closedProf));
  let grooveV = 0; { const n = 600, dy = 2 * yK / n; for (let i = 0; i < n; i++) { const y = -yK + (i + 0.5) * dy, q = clamp01((yK - Math.abs(y)) / run); grooveV += TAU * crown(y) * kd * hwU * q * q * dy; } }
  const armsV = Math.abs(meshVolume(arms.geometry)), hubV = Math.abs(meshVolume(hub.geometry));
  const overlapV = Math.PI * ((Ri + 0.15) ** 2 - Ri ** 2) * tR + Math.PI * (rHub ** 2 - (rHub - 0.05) ** 2) * tH;
  const c4 = 1 - Math.PI / 4, cg = (10 - 3 * Math.PI) / (12 - 3 * Math.PI);   // a concave fillet: area per r², centroid per r
  const filletV = 2 * TAU * ((rHub + cg * fHub) * c4 * fHub * fHub + (Ri - cg * fRim) * c4 * fRim * fRim);
  const vol = skinV - grooveV + armsV + hubV - overlapV + filletV;
  // the axle (closed lathes and extrusions), less the hex's 0.15 mm into each collar
  const hexA = 1.5 * Math.sqrt(3) * (AF / 2 / Math.cos(Math.PI / 6) - 0.01) ** 2;
  const axleV = ['axleL', 'axleR', 'axleHex', 'axleD'].reduce((s, n) => s + Math.abs(meshVolume(axle.getObjectByName(n).geometry)), 0) - 2 * 0.15 * hexA;
  const RHO = WHEEL_SPEC.densities;
  const encBox = { min: [XF0 - 0.5, 0, -ZH - 0.4], max: [XB1, AH + YT, ZH + 0.4] };
  root.userData.spec = {
    ...WHEEL_SPEC, diameter: D, width: Wd, crownRadius: Rc, steps, axleHeight: AH, axleDiameter: 2 * rJ,
    knurl: { grooves: nK, perStep: nK / steps, depth: kd, angleDeg: 90, pitch: +(TAU * R / nK).toFixed(3), band: +(2 * yK).toFixed(2), runOut: run },
    arms: { n: nArms, width: [wH, wR], thickness: [tH, tR] }, hub: { diameter: 2 * rHub, width: hubW }, skin: { edge: tE, centre: tC, spine, inside: +Ri.toFixed(3) },
    hexAF: AF, sagitta: +(crown(0) - crown(hw)).toFixed(3),
    encoderSide: side > 0 ? 'left (+X)' : 'right (−X)',
    encoderBox: side > 0 ? encBox : { min: [-encBox.max[0], 0, encBox.min[2]], max: [-encBox.min[0], encBox.max[1], encBox.max[2]] },
    encoderBody: { thickness: +(XB1 - XF0).toFixed(2), width: 2 * ZH, height: +(AH + YT).toFixed(2), pins: 4, pitch: 1.25, pinRowX: side * XP, split: +(AH + YS).toFixed(2) },
    magnet: { diameter: 2 * magR, thickness: +(XM1 - XM0).toFixed(2), gap: +(XIC0 - XM1).toFixed(2), material: 'NdFeB, nickel-plated, diametrically magnetised' },
    sensor: { ic: '3D Hall angle sensor, QFN 3 x 3 x 0.75 (KTH5791-class)', board: '7.4 x 9.6 x 0.5 vertical board', outputs: 'A/B quadrature (+ Z)' },
    supportBox: side > 0 ? { min: [sx0, 0, -sw / 2], max: [sx1, AH + yt, sw / 2] } : { min: [-sx1, 0, -sw / 2], max: [-sx0, AH + yt, sw / 2] },
    wheelVolume_mm3: +vol.toFixed(1), massEstimate_g: +(vol * RHO.AZ31B / 1000).toFixed(3), massAluminium_g: +(vol * RHO.Al6061 / 1000).toFixed(3),
    volumeParts_mm3: { skin: +skinV.toFixed(1), grooves: +(-grooveV).toFixed(1), arms: +armsV.toFixed(1), hub: +hubV.toFixed(1), overlaps: +(-overlapV).toFixed(1), fillets: +filletV.toFixed(1) },
    axleVolume_mm3: +axleV.toFixed(1), axleMass_g: +(axleV * RHO.POM / 1000).toFixed(3),
  };
  root.userData.parts = { wheel, rim, tread, knurl: tread, arms, web: arms, hub, axle, magnet, detentStar, rotor: rot, rotorHub, encoder: enc, housing, cover, frame, pins,
    sensor, hallIC: ic, field, detent: spring, support: sup, spin };
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
/** polyline with rounded corners (bend radius r) → dense Vector3 list for sweeps */
function roundPathYZ(pts, r, n = 5) {
  const P = pts.map(p => new THREE.Vector3(...p));
  const out = [P[0]];
  for (let i = 1; i < P.length - 1; i++) {
    const a = P[i - 1], b = P[i], c = P[i + 1];
    const u = a.clone().sub(b), v = c.clone().sub(b);
    const lu = u.length(), lv = v.length(); u.normalize(); v.normalize();
    const t = Math.min(r, lu / 2, lv / 2);
    const p0 = b.clone().addScaledVector(u, t), p1 = b.clone().addScaledVector(v, t);
    for (let k = 0; k <= n; k++) { const s = k / n; out.push(p0.clone().multiplyScalar((1 - s) * (1 - s)).addScaledVector(b, 2 * (1 - s) * s).addScaledVector(p1, s * s)); }
  }
  out.push(P[P.length - 1]);
  return out;
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
/** The open bays between n tapered arms. Each is bounded by two arms' edges, the spine round the rim's inside (radius
   rOut0) and the flange round the hub (rIn0), every corner filleted as the cutter leaves it (rfRim at the rim, rfHub at the
   hub). An arm's width runs linearly from wH at the hub (rHub) to wR at the rim (Ri). Returns hole paths. */
function armWindows({ n, rHub, Ri, rIn0, rOut0, wH, wR, rfHub, rfRim, phase = 0 }) {
  const w = r => wH + (wR - wH) * (r - rHub) / (Ri - rHub);
  /* the point on an arm's edge (s = +1 its counter-clockwise side) at distance Rr from the centre */
  const edgeAt = (a, s, Rr) => { let r = Rr; for (let i = 0; i < 6; i++) r = Math.sqrt(Math.max(0, Rr * Rr - (w(r) / 2) ** 2)); const h = s * w(r) / 2; return [r * Math.cos(a) - h * Math.sin(a), r * Math.sin(a) + h * Math.cos(a)]; };
  const out = [];
  for (let k = 0; k < n; k++) {
    const a0 = phase + k * TAU / n, a1 = a0 + TAU / n;
    const A = edgeAt(a0, 1, rIn0), B = edgeAt(a0, 1, rOut0), C = edgeAt(a1, -1, rOut0), Dp = edgeAt(a1, -1, rIn0);
    const pts = [A, B], rads = [rfHub, rfRim];
    /* along the spine, B → C (counter-clockwise) */
    const aB = Math.atan2(B[1], B[0]); let aC = Math.atan2(C[1], C[0]); while (aC < aB) aC += TAU;
    const nA = 14; for (let i = 1; i < nA; i++) { const a = aB + (aC - aB) * i / nA; pts.push([rOut0 * Math.cos(a), rOut0 * Math.sin(a)]); rads.push(0); }
    pts.push(C, Dp); rads.push(rfRim, rfHub);
    /* along the flange, D → A (clockwise); few points, so the hub's fillets don't reach past them */
    const aD = Math.atan2(Dp[1], Dp[0]); let aA = Math.atan2(A[1], A[0]); while (aA > aD) aA -= TAU;
    const nB = 3; for (let i = 1; i < nB; i++) { const a = aD + (aA - aD) * i / nB; pts.push([rIn0 * Math.cos(a), rIn0 * Math.sin(a)]); rads.push(0); }
    out.push(filletPolygon(pts, rads, true, 6));
  }
  return out;
}
/** a closed polygon [[r, y], ...] revolved about the y axis: its volume, 2π ∫ r dA (signed by the walk's direction) */
function revolvedVolume(pts) {
  let s = 0;
  for (let i = 0; i < pts.length; i++) { const [r0, y0] = pts[i], [r1, y1] = pts[(i + 1) % pts.length]; s += (r0 + r1) * (r0 * y1 - r1 * y0); }
  return TAU * s / 6;
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
/** The knurled tread: N straight V-grooves across the crown between ±yb, each running out to a point over `run` at both
   ends (a cutter leaving the surface: the groove narrows with its depth, so its 90° flanks stay 90°). Three vertices a groove
   in each row (its two edges and its root); the lands between grooves are the crown itself. Built in the wheel's frame (axis
   X), the same parametrisation as lathe() + rotateZ(−90°), so its edge rows meet the skin's lathe at the groove centres. */
function knurlGeometry({ N, crown, yb, run, kd, hwU, mid = 10, nRun = 5 }) {
  const ys = [];
  for (let j = 0; j < nRun; j++) ys.push(-yb + run * j / nRun);
  for (let j = 0; j <= mid; j++) ys.push(-(yb - run) + 2 * (yb - run) * j / mid);
  for (let j = 1; j <= nRun; j++) ys.push((yb - run) + run * j / nRun);
  const P = [], UV = [], I = [], M = 3 * N;
  for (const y of ys) {
    const r = crown(y), q = clamp01((yb - Math.abs(y)) / run), dth = hwU * q * TAU / N;
    for (let k = 0; k < N; k++) {
      const th = k * TAU / N;
      for (const [a, rr] of [[th - dth, r], [th, r - kd * q], [th + dth, r]]) { P.push(y, -rr * Math.sin(a), rr * Math.cos(a)); UV.push(a / TAU, y); }
    }
  }
  for (let j = 0; j < ys.length - 1; j++) for (let i = 0; i < M; i++) {
    const a = j * M + i, b = j * M + (i + 1) % M, d = (j + 1) * M + i, c = (j + 1) * M + (i + 1) % M;
    I.push(a, b, d, b, c, d);
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
