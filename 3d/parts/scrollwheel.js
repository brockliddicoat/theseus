// Magnesium-alloy scroll wheel (#84) + POM axle (#7) + optical scroll encoder (research "step further"), built like
// TTC's optical encoder (a normal mouse-encoder body: tin-plated frame, black housing, axle bushing, five pins; inside a
// slotted disc between an IR emitter and a dual phototransistor) + a POM support bracket for the far journal.
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
//  - the tread (#30, the texture; F25.1 "coarse and diamond are my favorites"): a coarse diamond knurl, the DIN 82 / IS 3403
//    left-right form with raised points: 90° V-grooves at 30° to the axis each way, 72 teeth round (1.0 mm pitch, three to an
//    encoder step), the points flattened so each tooth is a truncated pyramid, framed by plain turned bands; bare magnesium
//  - F25.2 "thinners arms": the arms run 0.95 → 0.55 mm wide; the weight they gave up went into the skin under the knurl,
//    which the deeper teeth cut into  [proposal]
import * as THREE from 'three';
import { partMaterials } from './lib/materials.js';
import { HIGHLIGHT } from '../lib/studio.js';
import {
  extrude, lathe, sweep, arc, rectSection, roundedRectShape, circlePath, filletPolygon, meshOf,
  disposeTree, clamp01, smooth, lerp, makeGeometry, creaseNormals, circleSection,
} from './lib/geom.js';

const TAU = Math.PI * 2;

export const WHEEL_SPEC = {
  name: 'Magnesium scroll wheel + optical encoder',
  label: 'representative / proposal',
  material: 'magnesium alloy AZ31B (1.77 g/cm³), machined, bare passivated finish',
  wheel: 'six thin tapered arms on an open hub, a thin crowned rim with a spine where the arms meet it; 0.9 g (Brock\'s figure, F22.1; thinner arms, F25.2)',
  tread: 'coarse diamond knurl (DIN 82 / IS 3403 left-right, points raised, then flattened): 72 teeth round, 0.99 mm pitch round the crown, 90° V-grooves 0.215 mm deep at 30° to the axis each way, three teeth to an encoder step, plain turned bands at the edges',
  axle: 'POM (acetal), hex-keyed in the hub, D-flat drive into the encoder',
  encoder: 'optical, TTC-style: tin-plated steel frame with drawn bushing collar on a black plastic body, 5 pins at 1.25 mm; inside a 24-slot code disc on the rotor, a photo-interrupter (IR emitter + dual phototransistor, A/B a quarter-cycle apart) at the bottom, 24-lobe detent star + leaf spring',
  support: 'POM bracket: U seat with lead-in chamfers for the far journal, foot with two locating pegs, gusset',
  densities: { AZ31B: 1.77, Al6061: 2.70, POM: 1.42 },
  sources: {
    pmm: 'PMM, Magnesium Scroll Wheel [PULSE, CYBER OP, OP1 8k, OP1w 4k]: magnesium alloy, 1.0 g, "the magnesium wheel only" (the pin ships beside it) [MC]',
    target: 'Brock (F22.1): "ours will be 0.9g", "closer to the pmm wheel ... but with 6 arms" [PR]',
    spokes: 'Brock\'s doc: "6 scroll wheel spokes ... allowing for the outer shell of the scroll wheel to be the thinnest" [PR]',
    az31b: 'Tech Steel & Materials, AZ31B-H24: 1.77 g/cc [DS]; aluminium 6061-T6 2.70 (Protolabs) [DS]',
    optical: 'Razer: optical encoders "3.3× more reliable" [MC]; Viper V4 Pro uses an optical scroll encoder [MC/IM]',
    ttc: "TTC optical encoder launch photo (Brock's brief): normal encoder outline, metal frame + plastic housing, bushing, pins [PR]",
    interrupter: 'Honeywell HOA0901 slotted optical switch (emitter + phototransistor across a slot) [DS]; US6380927 and US12228433 (optical scroll encoders: slotted wheel through an interrupter) [DS]',
    teardown: "Igor's Lab, Razer Basilisk V3 Pro teardown (optical scroll encoder internals) [IM]",
    size: 'Ø22.74 × 7.0 mm, the Theseus shell\'s wheel (3d/shell meta.wheel); Sora V2 wheel ≈ 22–23.5 × 7.5–8 mm from Brock\'s PCB photo [DV]',
  },
};

export function buildScrollWheel(opts = {}) {
  const D = opts.diameter ?? 22.74, Wd = opts.width ?? 7.0, R = D / 2, hw = Wd / 2;
  const Rc = opts.crownRadius ?? R;
  const nK = opts.knurl ?? 72, steps = opts.steps ?? 24, nArms = opts.arms ?? 6;
  const AH = opts.axleHeight ?? 11;
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
  const tE = opts.skinEdge ?? 0.55, tC = opts.skinCentre ?? 1.108;   // skin thickness at the edges, at the centre plane
  const skin = (y) => tE + (tC - tE) * (1 - (y / hw) ** 2);
  const rIn = (y) => crown(y) - skin(y);              // the skin's inside
  const Ri = rIn(0);                                  // at the centre plane
  const fe = 0.35, chI = 0.2;                         // tread-to-side fillet (tangent to both), inside chamfer
  const yF = hw - fe, rF = (R - Rc) + Math.sqrt((Rc - fe) ** 2 - yF * yF);   // the fillet's centre (r, y), +X side
  const phT = Math.atan2(yF, rF - (R - Rc)), yT = yF + fe * Math.sin(phT);    // where it meets the crown
  /* the diamond knurl's grid: a quarter pitch round the crown (pS / 4) by its step along the 30° grooves (dS / tan 30°), so
     every groove centre, groove edge and tooth ridge is an edge of the mesh; the band is nRow such steps (a multiple of 4,
     so it is symmetric), and a 90° V's depth is its half width: a quarter of the pitch normal to the grooves */
  const beta = (opts.knurlAngle ?? 30) * Math.PI / 180, pS = TAU * R / nK, dS = pS / 4, dY = dS / Math.tan(beta);
  const nRow = opts.knurlRows ?? 12, yK = nRow * dY / 2, kd = opts.knurlDepth ?? pS * Math.cos(beta) / 4;
  const prof = [];
  for (let i = 0; i < 3; i++) { const y = yK + (yT - yK) * i / 3; prof.push([crown(y), y]); }
  for (let i = 0; i <= 8; i++) { const a = phT + (Math.PI / 2 - phT) * i / 8; prof.push([rF + fe * Math.cos(a), yF + fe * Math.sin(a)]); }
  prof.push([rIn(hw) + chI, hw], [rIn(hw - chI), hw - chI]);
  for (let i = 1; i < 10; i++) { const y = (hw - chI) * (1 - 2 * i / 10); prof.push([rIn(y), y]); }
  prof.push([rIn(-(hw - chI)), -(hw - chI)], [rIn(-hw) + chI, -hw]);
  for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + (Math.PI / 2 - phT) * i / 8; prof.push([rF + fe * Math.cos(a), -yF + fe * Math.sin(a)]); }
  for (let i = 1; i <= 3; i++) { const y = -yT + (yT - yK) * i / 3; prof.push([crown(y), y]); }
  const toX = (geo) => { geo.rotateZ(-Math.PI / 2); return geo; };
  // 2·nK segments: every other column of the knurl's grid, so the skin's edge circles meet the knurl's edge rows
  const rim = meshOf(circTangents(toX(lathe(prof, { segments: 2 * nK, crease: 30 }))), M.magnesium, 'rim');
  spin.add(rim);

  // ------------------------------------------------------------------ the tread: a coarse diamond knurl
  // two families of 90° V-grooves at 30° to the axis each way, nK teeth round; the teeth's points flattened (their tops as
  // wide as the grooves), rising out of the plain edge bands over the band's first row. The tops are the crown itself.
  const KN = diamondKnurl({ N: nK, crown, yK, nRow, kd });
  const tread = meshOf(circTangents(KN.geometry), M.magnesium, 'tread');
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
  const xL = -8.3, rJ = 1.2;
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

  // ------------------------------------------------------------------ the optical encoder, as TTC builds one
  // Outside it is a normal mouse encoder (TTC's optical encoder, 2026 launch photos): a thin black body with one
  // chamfered top corner, a tin-plated steel frame on the wheel side (drawn collar round the rotor, heat-stake pegs,
  // folded tabs, two J-hook legs into the board), five pins in a row. Inside: a slotted disc on the rotor, a
  // photo-interrupter straddling its rim (IR emitter in one arm, a dual phototransistor in the other: channels A and B
  // a quarter-cycle apart), and a 24-lobe detent star under a leaf spring. Taller than the photo's, as Brock asks:
  // the axle sits 11 mm up, so the body runs from the board to 4 mm above it.
  const enc = new THREE.Group(); enc.name = 'encoder';
  const XF0 = 6.65, XF1 = 6.90, XB0 = XF1, XB1 = 11.5;           // frame plate, then the plastic body (along the axle)
  const ZH = 5.5, YT = 4.0, YB = -AH, CH = 2.6;                   // half width, top, board, top-front chamfer
  // the body outline in shape coordinates (u = −z, v = y); extrusion e → +X (det +1, so faces keep their winding)
  const toYZ = (geo, x0) => { geo.applyMatrix4(new THREE.Matrix4().set(0, 0, 1, x0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1)); return geo; };
  const outline = (inset = 0) => {
    const zh = ZH - inset, yt = YT - inset, yb = YB + inset, ch = CH - inset * 0.41;
    // u = −z: the chamfered (+Z, nose-side) corner is at u = −zh
    const pts = [[zh, yb], [zh, yt], [-zh + ch, yt], [-zh, yt - ch], [-zh, yb]];
    return pts;
  };
  const bodyShape = filletPolygon(outline(0), [0.25, 0.45, 0.35, 0.35, 0.25], false, 5);
  bodyShape.holes.push(circlePath(1.75));
  const bodyG = toYZ(extrude(bodyShape, { depth: XB1 - XB0, front: { r: 0.32, s: 4 }, back: { r: 0.08, s: 2 }, curveSegments: 40 }), XB0);
  const housing = meshOf(bodyG, M.housingBlack, 'housing');
  enc.add(housing);
  // steel frame on the wheel side: a plate with a drawn collar round the rotor, holes for the heat-stake pegs
  const frame = new THREE.Group(); frame.name = 'frame';
  const fShape = filletPolygon(outline(0), [0.25, 0.45, 0.35, 0.35, 0.25], false, 5);
  fShape.holes.push(circlePath(1.85));
  const pegAt = [[3.95, YB + 2.1], [-3.95, YB + 2.1], [3.95, 2.35], [-2.2, 2.35]];          // (u, v)
  for (const [u, v] of pegAt) fShape.holes.push(circlePath(0.36, u, v));
  frame.add(meshOf(toYZ(extrude(fShape, { depth: XF1 - XF0, front: { r: 0.05, s: 1 }, back: { r: 0.05, s: 1 }, curveSegments: 40 }), XF0), M.tinPlate, 'framePlate'));
  const collar = lathe([[1.85, 0], [1.85, -0.42], [1.97, -0.5], [2.28, -0.5], [2.4, -0.38], [2.4, 0]], { segments: 72, crease: 40 });
  collar.rotateZ(-Math.PI / 2); collar.translate(XF0 + 0.005, 0, 0);       // lathe axis Y → X; protrudes toward −X
  frame.add(meshOf(collar, M.tinPlate, 'frameCollar'));
  // heat-stake pegs: black plastic domes through the frame
  for (const [u, v] of pegAt) {
    const pg = lathe([[0, 0], [0.34, 0], [0.34, 0.06], ...arc(0.18, 0.06, 0.16, 0, Math.PI / 2, 4).slice(1).map(([r, y]) => [r, y]), [0, 0.22]], { segments: 20 });
    pg.rotateZ(Math.PI / 2); pg.translate(XF0 + 0.02, v, -u);                 // dome toward −X
    enc.add(meshOf(pg, M.housingBlack, 'peg'));
  }
  // folded tabs: two over the top edge, two round the sides onto the back face (the light corners on the black side)
  const tabTop = (z0, z1) => { const g = extrude(roundedRectShape(1.25, z1 - z0, 0.12), { depth: 0.34, front: { r: 0.05, s: 1 }, curveSegments: 4 });
    g.rotateX(-Math.PI / 2); g.translate(XF0 + 0.62, YT - 0.12, (z0 + z1) / 2); return g; };
  frame.add(meshOf(tabTop(-3.6, -2.0), M.tinPlate, 'tabTop'), meshOf(tabTop(0.6, 1.9), M.tinPlate, 'tabTop'));
  for (const s of [1, -1]) {
    const y0 = -3.7, y1 = -2.2, zs = s * (ZH + 0.11);
    const side = new THREE.Shape(); side.moveTo(0, y0); side.lineTo(XB1 - XF0 + 0.02, y0); side.lineTo(XB1 - XF0 + 0.02, y1); side.lineTo(0, y1); side.lineTo(0, y0);
    const sg = extrude(side, { depth: 0.22, front: { r: 0.04, s: 1 }, back: { r: 0.04, s: 1 }, curveSegments: 2 });
    sg.translate(XF0, 0, zs - 0.11);
    frame.add(meshOf(sg, M.tinPlate, 'tabSide'));
    const fold = extrude(roundedRectShape(0.95, y1 - y0, 0.1), { depth: 0.22, front: { r: 0.04, s: 1 }, curveSegments: 4 });
    fold.rotateY(Math.PI / 2); fold.translate(XB1 - 0.02, (y0 + y1) / 2, s * (ZH - 0.38));
    frame.add(meshOf(fold, M.tinPlate, 'tabFold'));
  }
  // J-hook legs at the bottom corners, in the frame's plane, into the board
  for (const s of [1, -1]) {
    const c = [];
    for (let i = 0; i <= 14; i++) { const t = i / 14, a = Math.PI * t; c.push([s * (4.55 + 0.62 * (1 - Math.cos(a))), YB + 0.55 - 0.95 * Math.sin(a * 0.5) - 0.0 * t]); }
    c.push([s * 5.79, YB - 0.9], [s * 5.79, YB - 1.75]);
    const w = 0.55, left2 = [], right2 = [];
    for (let i = 0; i < c.length; i++) {
      const a = c[Math.max(0, i - 1)], b = c[Math.min(c.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      const nx = -dy / l, ny = dx / l; left2.push([c[i][0] + nx * w / 2, c[i][1] + ny * w / 2]); right2.push([c[i][0] - nx * w / 2, c[i][1] - ny * w / 2]);
    }
    const poly = [...left2, ...right2.reverse()].map(([z, y]) => [-z, y]);
    const lg = toYZ(extrude(filletPolygon(poly, 0, false, 1), { depth: XF1 - XF0, curveSegments: 2 }), XF0);
    frame.add(meshOf(lg, M.tinPlate, 'leg'));
  }
  enc.add(frame);
  // five pins in a row along the bottom (emitter anode/cathode, receiver collector, A, B), 1.25 mm pitch
  const XP = 9.15, pins = new THREE.Group(); pins.name = 'pins';
  for (let i = 0; i < 5; i++) {
    const z = (i - 2) * 1.25;
    const pp = [[-0.25, 0.6], [-0.25, -1.45], [-0.08, -1.75], [0.08, -1.75], [0.25, -1.45], [0.25, 0.6]];
    const g = extrude(filletPolygon(pp, [0, 0.06, 0.03, 0.03, 0.06, 0], false, 2), { depth: 0.3, front: { r: 0.04, s: 1 }, back: { r: 0.04, s: 1 } });
    g.rotateY(-Math.PI / 2); g.translate(XP + 0.15, YB, z);
    pins.add(meshOf(g, M.tin, 'pin'));
  }
  enc.add(pins);

  // the rotor: an orange POM hub (the ring you see in the frame's collar) carrying the disc and the detent star
  const rot = new THREE.Group(); rot.name = 'encoderRotor';
  const hubR = 1.65;
  const hubSh = new THREE.Shape(); hubSh.absarc(0, 0, hubR, 0, TAU, false);
  hubSh.holes.push(dHolePath(rJ + 0.02, 0.77));
  const rhG = extrude(hubSh, { depth: XB1 - 0.25 - (XF0 - 0.42), front: { r: 0.1, s: 2 }, back: { r: 0.14, s: 3 }, curveSegments: 48 });
  rhG.rotateY(Math.PI / 2); rhG.translate(XF0 - 0.42, 0, 0);
  const rotorHub = meshOf(rhG, M.rotorOrange, 'rotorHub');
  // code disc: black, 24 crisp radial slots (7.5° each, half the pitch) between r 2.95 and 3.8
  const discR = 4.0, rs0 = 2.95, rs1 = 3.8, tD = 0.35, xDisc = 9.05;
  const discShape = new THREE.Shape(); discShape.absarc(0, 0, discR, 0, TAU, false);
  const slotW = (TAU / steps) * 0.5;
  for (let i = 0; i < steps; i++) discShape.holes.push(annularSlot(rs0, rs1, i * TAU / steps - slotW / 2, i * TAU / steps + slotW / 2, 0.04));
  discShape.holes.push(circlePath(hubR - 0.02));
  const discG = extrude(discShape, { depth: tD, front: { r: 0.03, s: 1 }, back: { r: 0.03, s: 1 }, curveSegments: 96 });
  discG.rotateY(Math.PI / 2); discG.translate(xDisc - tD / 2, 0, 0);
  const disc = meshOf(discG, M.discBlack, 'disc');
  // detent star (24 rounded lobes, V valleys) behind the photo-interrupter
  const star = new THREE.Shape(), nL = steps, R0 = 2.18, Rl = 2.55;
  for (let i = 0; i <= nL * 16; i++) {
    const a = (i / (nL * 16)) * TAU, f = ((a * nL / TAU) % 1 + 1) % 1;
    const r = R0 + (Rl - R0) * Math.pow(Math.sin(Math.PI * f), 0.6);   // round lobes, sharp valleys
    if (i === 0) star.moveTo(r * Math.cos(a), r * Math.sin(a)); else star.lineTo(r * Math.cos(a), r * Math.sin(a));
  }
  star.holes.push(circlePath(hubR - 0.02));
  const starG = extrude(star, { depth: 0.7, front: { r: 0.06, s: 2 }, back: { r: 0.06, s: 2 }, curveSegments: 4 });
  starG.rotateY(Math.PI / 2); starG.translate(10.55, 0, 0);
  const detentStar = meshOf(starG, M.pomBlack, 'detentStar');
  rot.add(rotorHub, disc, detentStar);
  if (opts.encoder !== false) spin.add(rot);
  // leaf spring over the star: phosphor bronze, both ends in slots of the body, a formed bump on the lobes
  const springPts = [];
  for (let i = 0; i <= 36; i++) {
    const t = i / 36, z = -3.3 + 6.6 * t;
    const bump = Math.exp(-((z - 0) ** 2) / 0.12) * 0.22;
    springPts.push(new THREE.Vector3(10.9, Rl + 0.02 + 0.12 + 0.34 * (2 * t - 1) ** 2 - bump, z));
  }
  const spring = meshOf(sweep(springPts, rectSection(0.1, 0.8, 0.02), { up: [0, 1, 0] }), M.phosBronze, 'detentSpring');
  enc.add(spring);
  // the photo-interrupter on the disc's rim, at the bottom, right over the pins: a white U holder
  const beamR = 3.38, phA = Math.PI, phB = phA - (TAU / steps) * 1.25;    // B lags A by 1¼ slot pitch = 90° electrical
  const beamPos = (ph) => new THREE.Vector3(0, beamR * Math.cos(ph), beamR * Math.sin(ph));
  const pA = beamPos(phA), pB = beamPos(phB), pM = pA.clone().lerp(pB, 0.5);
  const holder = new THREE.Group(); holder.name = 'interrupter';
  const zU0 = pM.z - 2.0, zU1 = pM.z + 2.0, yU0 = -4.95, yU1 = -2.35, xa0 = 7.25, xa1 = 8.55, xr0 = 9.55, xr1 = 10.45;
  const blockYZ = (z0, z1, y0, y1, xA, xB, r, bev, name, mat) => {
    const sh = roundedRectShape(z1 - z0, y1 - y0, r, -(z0 + z1) / 2, (y0 + y1) / 2);
    const g = toYZ(extrude(sh, { depth: xB - xA, front: bev ? { r: bev, s: 2 } : null, back: bev ? { r: bev, s: 2 } : null, curveSegments: 6 }), xA);
    return meshOf(g, mat, name);
  };
  holder.add(blockYZ(zU0, zU1, yU0, yU1, xa0, xa1, 0.18, 0.06, 'holderArmE', M.paWhite));
  holder.add(blockYZ(zU0, zU1, yU0, yU1, xr0, xr1, 0.18, 0.06, 'holderArmR', M.paWhite));
  holder.add(blockYZ(zU0, zU1, yU0, -4.4, xa1 - 0.05, xr0 + 0.05, 0.12, 0.0, 'holderBase', M.paWhite));
  enc.add(holder);
  // IR emitter: water-clear epoxy package in the near arm, its lens facing the disc; the die and its bond wire inside
  const emitter = new THREE.Group(); emitter.name = 'emitter';
  const eBody = blockYZ(pM.z - 0.8, pM.z + 0.8, pM.y - 0.75, pM.y + 0.75, 7.55, 8.5, 0.18, 0.05, 'emitterBody', M.epoxyClear);
  const lens = meshOf(lathe([[0, 0], ...arc(0, 0, 0.5, 0, Math.PI / 2, 10).map(([r, y]) => [r, y * 0.55])], { segments: 32 }), M.epoxyClear, 'emitterLens');
  lens.rotation.z = -Math.PI / 2; lens.position.set(8.5, pM.y, pM.z);
  const die = meshOf(new THREE.BoxGeometry(0.06, 0.32, 0.32), M.dieDark, 'emitterDie'); die.position.set(8.05, pM.y, pM.z);
  const cup = meshOf(lathe([[0, 0], [0.42, 0], [0.55, 0.28], [0.5, 0.3], [0.38, 0.06], [0, 0.06]], { segments: 24 }), M.silverLead, 'emitterCup');
  cup.rotation.z = -Math.PI / 2; cup.position.set(7.92, pM.y, pM.z);
  emitter.add(eBody, lens, die, cup);
  enc.add(emitter);
  // dual phototransistor: black IR-pass epoxy in the far arm, two apertures (A, B) facing the disc
  const detector = new THREE.Group(); detector.name = 'detector';
  detector.add(blockYZ(pM.z - 0.95, pM.z + 0.95, pM.y - 1.0, pM.y + 1.0, 9.6, 10.4, 0.2, 0.05, 'detectorBody', M.epoxyIR));
  const winA = meshOf(new THREE.BoxGeometry(0.05, 0.5, 0.26), M.windowDark.clone(), 'windowA');
  const winB = meshOf(new THREE.BoxGeometry(0.05, 0.5, 0.26), M.windowDark.clone(), 'windowB');
  own.add(winA.material); own.add(winB.material);
  winA.position.set(9.585, pA.y, pA.z); winB.position.set(9.585, pB.y, pB.z);
  detector.add(winA, winB);
  enc.add(detector);
  // the lead frame: five strips from the interrupter down to the pins (seen in x-ray)
  const leads = new THREE.Group(); leads.name = 'leads';
  const leadX = [7.9, 8.2, 9.75, 9.98, 10.2], leadZ0 = [pM.z - 0.4, pM.z + 0.4, pM.z - 0.6, pM.z, pM.z + 0.6];
  for (let i = 0; i < 5; i++) {
    const z1 = (i - 2) * 1.25, path = [[leadX[i], yU0 + 0.1, leadZ0[i]], [leadX[i], yU0 - 0.9, leadZ0[i]], [XP, YB + 2.0, z1], [XP, YB + 0.55, z1]];
    leads.add(meshOf(sweep(roundPathYZ(path, 0.25), rectSection(0.3, 0.14, 0.03), { up: [1, 0, 0] }), M.tin, 'lead'));
  }
  enc.add(leads);
  // light gates: emitter → disc (always), disc → detector (gated by the slots). Flat highlight colour, no glow.
  // drawn over what lies in front of them (they are only shown in x-ray, as a diagram of the light path)
  const beamMat = new THREE.MeshBasicMaterial({ color: hiColor, transparent: true, opacity: 0.92, depthWrite: false, depthTest: false, toneMapped: false });
  own.add(beamMat);
  const beams = [];
  for (const [nm, p] of [['A', pA], ['B', pB]]) {
    const m1 = beamMat.clone(), m2 = beamMat.clone(); own.add(m1); own.add(m2);
    const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, xDisc - 8.55, 16, 1, true), m1);
    b1.rotation.z = Math.PI / 2; b1.position.set((8.55 + xDisc) / 2, p.y, p.z);
    const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 9.585 - xDisc, 16, 1, true), m2);
    b2.rotation.z = Math.PI / 2; b2.position.set((xDisc + 9.585) / 2, p.y, p.z);
    b1.name = 'beam' + nm + 'in'; b2.name = 'beam' + nm + 'out';
    for (const b of [b1, b2]) { b.renderOrder = 10; b.castShadow = false; b.receiveShadow = false; enc.add(b); }
    beams.push({ b1, b2, ph: nm === 'A' ? phA : phB, win: nm === 'A' ? winA : winB });
  }
  if (opts.encoder !== false) assy.add(enc);

  // ------------------------------------------------------------------ support bracket (−X): a moulded POM bracket
  // a U seat the journal clicks into (lead-in chamfers), a foot with two locating pegs into the board, a gusset
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
  const footG = extrude(roundedRectShape(sx1 - sx0 + 1.6, sw + 2.2, 0.5), { depth: 0.9, front: { r: 0.2, s: 2 }, curveSegments: 6 });
  footG.rotateX(-Math.PI / 2); footG.translate((sx0 + sx1) / 2 - 0.4, yb, 0);
  sup.add(meshOf(footG, M.housingBlack, 'supportFoot'));
  for (const zp of [-1.75, 1.75]) {
    const pg = lathe([[0, -1.3], [0.38, -1.3], [0.5, -1.0], [0.5, 0.2], [0, 0.2]], { segments: 24 });
    pg.translate((sx0 + sx1) / 2 - 0.4, yb, zp); sup.add(meshOf(pg, M.housingBlack, 'supportPeg'));
  }
  const gus = new THREE.Shape(); gus.moveTo(0, 0); gus.lineTo(1.5, 0); gus.lineTo(0, 6.0); gus.lineTo(0, 0);
  const gusG = extrude(gus, { depth: 1.0, front: { r: 0.12, s: 2 }, back: { r: 0.12, s: 2 }, curveSegments: 2 });
  gusG.rotateY(Math.PI); gusG.translate(sx0 + 0.05, yb + 0.9, 0.5);
  sup.add(meshOf(gusG, M.housingBlack, 'supportRib'));
  if (opts.support !== false) assy.add(sup);

  // ------------------------------------------------------------------ x-ray: the housing becomes smoke glass
  const xrayMat = M.ghost.clone(); own.add(xrayMat);
  xrayMat.color.set(0x9aa3ab); xrayMat.depthWrite = false; xrayMat.side = THREE.DoubleSide;
  const xrayFrame = M.ghost.clone(); own.add(xrayFrame);
  xrayFrame.color.set(0xc9ced3); xrayFrame.depthWrite = false; xrayFrame.side = THREE.DoubleSide;
  const shellMeshes = [housing, ...enc.children.filter(c => c.name === 'peg')];
  const frameMeshes = []; frame.traverse(o => { if (o.isMesh) frameMeshes.push(o); });
  const holderMeshes = holder.children.slice();

  // ------------------------------------------------------------------ state
  const st = { scroll: 0, explode: 0, xray: 0 };
  const gate = (dAng) => {
    // fraction of a beam (≈1.6° wide) inside a slot (slots: half the pitch, centred on multiples of the pitch)
    const pitch = TAU / steps; let u = ((dAng % pitch) + pitch) % pitch; if (u > pitch / 2) u -= pitch;
    const edge = slotW / 2, soft = 0.028 / beamR * 1.0 + 0.012;
    return 1 - smooth(edge - soft, edge + soft, Math.abs(u));
  };
  const dark = new THREE.Color(0x0b0a0d), hi = new THREE.Color(hiColor);
  function apply() {
    const e = st.explode;
    spin.rotation.x = st.scroll;
    // explode: axle out to −X, support further; encoder parts spread along +X, the interrupter's parts up a little
    axle.position.x = -11 * e; sup.position.x = -17 * e;
    frame.position.x = 2.2 * e;
    rot.position.x = 6.0 * e;
    emitter.position.set(8.5 * e, 2.6 * e, 0); holder.position.set(10.5 * e, 2.6 * e, 0); detector.position.set(12.5 * e, 2.6 * e, 0); leads.position.set(10.5 * e, 2.6 * e, 0);
    spring.position.set(14.5 * e, 3.6 * e, 0);
    housing.position.x = 18 * e; pins.position.x = 18 * e;
    enc.children.forEach(c => { if (c.name === 'peg') c.position.x = 18 * e; });
    for (const b of beams) {
      const t = gate(b.ph - st.scroll);
      const vis = st.xray * (1 - e);
      b.b1.material.opacity = 0.92 * vis; b.b1.visible = vis > 0.01;
      b.b2.material.opacity = 0.92 * vis * t; b.b2.visible = vis * t > 0.01;
      b.win.material.color.copy(dark).lerp(hi, t * (0.35 + 0.65 * st.xray));
      b.t = t;
    }
    // x-ray: body and frame → smoke glass; the white holder thins so the emitter and receiver read inside it
    const k = st.xray;
    for (const m of shellMeshes) m.material = k > 0.02 ? xrayMat : M.housingBlack;
    for (const m of frameMeshes) m.material = k > 0.02 ? xrayFrame : M.tinPlate;
    for (const m of holderMeshes) m.material = k > 0.02 ? xrayHolder : M.paWhite;
    xrayMat.opacity = lerp(1, 0.14, k); xrayFrame.opacity = lerp(1, 0.18, k); xrayHolder.opacity = lerp(1, 0.4, k);
  }
  const xrayHolder = M.paWhite.clone(); own.add(xrayHolder); xrayHolder.transparent = true; xrayHolder.depthWrite = false;

  root.setScroll = (rad) => {
    st.scroll = +rad || 0; apply();
    const A = beams[0].t > 0.5, B = beams[1].t > 0.5;
    return { step: Math.round(st.scroll / (TAU / steps)), A, B, gateA: beams[0].t, gateB: beams[1].t };
  };
  root.setExplode = (k) => { st.explode = clamp01(k); apply(); };
  root.setXray = (k) => { st.xray = clamp01(k); apply(); };
  /** the deck's highlight colour (C.hero, whatever hue Brock picks): the light gates and the lit apertures */
  root.setHighlight = (c) => { hi.set(c); for (const b of beams) { b.b1.material.color.set(c); b.b2.material.color.set(c); } apply(); };
  root.getState = () => ({ ...st, gateA: beams[0].t, gateB: beams[1].t });

  // ------------------------------------------------------------------ spec, parts, dispose
  // The wheel's volume: the skin by Pappus over its profile closed along the crown, less what the knurl's grooves cut below
  // the crown; the arms and the hub ring as closed meshes, less where they overlap
  // (the arms' outer ring 0.15 mm into the skin, 0.05 mm into the hub); the fillet rings (open surfaces) analytically.
  const closedProf = prof.slice(); for (let i = 1; i < 48; i++) { const y = -yK + 2 * yK * i / 48; closedProf.push([crown(y), y]); }
  const skinV = Math.abs(revolvedVolume(closedProf));
  const grooveV = KN.grooveVolume;   // summed over the knurl's own triangles: area × the mean depth cut below the crown
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
    knurl: { type: 'diamond: DIN 82 / IS 3403 left-right, points raised, flattened', teeth: nK, perStep: nK / steps, pitch: +pS.toFixed(3), normalPitch: +(pS * Math.cos(beta)).toFixed(3), helixDeg: +(beta * 180 / Math.PI).toFixed(1), profileDeg: 90, depth: +kd.toFixed(3), band: +(2 * yK).toFixed(2), rows: nRow },
    arms: { n: nArms, width: [wH, wR], thickness: [tH, tR] }, hub: { diameter: 2 * rHub, width: hubW }, skin: { edge: tE, centre: tC, spine, inside: +Ri.toFixed(3) },
    hexAF: AF, sagitta: +(crown(0) - crown(hw)).toFixed(3),
    encoderSide: side > 0 ? 'left (+X)' : 'right (−X)',
    encoderBox: side > 0 ? encBox : { min: [-encBox.max[0], 0, encBox.min[2]], max: [-encBox.min[0], encBox.max[1], encBox.max[2]] },
    encoderBody: { thickness: +(XB1 - XF0).toFixed(2), width: 2 * ZH, height: +(AH + YT).toFixed(2), pins: 5, pitch: 1.25, pinRowX: side * XP },
    disc: { diameter: 2 * discR, slots: steps, slotDeg: +(slotW * 180 / Math.PI).toFixed(2), slotBand: [rs0, rs1], thickness: tD },
    supportBox: side > 0 ? { min: [sx0, 0, -sw / 2], max: [sx1, AH + yt, sw / 2] } : { min: [-sx1, 0, -sw / 2], max: [-sx0, AH + yt, sw / 2] },
    wheelVolume_mm3: +vol.toFixed(1), massEstimate_g: +(vol * RHO.AZ31B / 1000).toFixed(3), massAluminium_g: +(vol * RHO.Al6061 / 1000).toFixed(3),
    volumeParts_mm3: { skin: +skinV.toFixed(1), grooves: +(-grooveV).toFixed(1), arms: +armsV.toFixed(1), hub: +hubV.toFixed(1), overlaps: +(-overlapV).toFixed(1), fillets: +filletV.toFixed(1) },
    axleVolume_mm3: +axleV.toFixed(1), axleMass_g: +(axleV * RHO.POM / 1000).toFixed(3),
  };
  root.userData.parts = { wheel, rim, tread, knurl: tread, arms, web: arms, hub, axle, disc, detentStar, rotor: rot, rotorHub, encoder: enc, housing, frame, pins, leads,
    interrupter: holder, emitter, detector, beamA: beams[0].b2, beamB: beams[1].b2, detent: spring, support: sup, spin };
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
/** The diamond-knurled tread (DIN 82 / IS 3403 left-right form with raised points, the points flattened). Two families of 90°
   V-grooves cross at ±beta to the axis; in pitches, family A runs at constant a = (s − y·tan beta) / pS and family B at
   constant b = (s + y·tan beta) / pS (s round the crown). On a grid a quarter pitch round (column i) by dS / tan beta along the
   axis (row j), a = (i − j) / 4 and b = (i + j) / 4 exactly, so with each quad split by both its diagonals (a centre vertex) every
   groove centre (a or b whole), groove edge (a quarter off) and tooth ridge (a row or a column through a crossing) is an edge
   of the mesh, and the depth kd · max(V(a), V(b)) is exact on it: V is 1 at a groove's centre, 0 a quarter pitch either side
   and on the tops. The band's edge rows sit on the crown (q = 0), so they meet the skin's lathe. Built in the wheel's frame
   (axis X) as lathe() + rotateZ(−90°). Returns { geometry, grooveVolume } (mm³ cut below the crown, area × mean depth). */
function diamondKnurl({ N, crown, yK, nRow, kd }) {
  const C = 4 * N, dth = TAU / C, dY = 2 * yK / nRow, P = [], UV = [], I = [];
  const V = u => { const f = u - Math.floor(u + 1e-9), d = Math.min(f, 1 - f); return d < 0.25 - 1e-9 ? 1 - 4 * d : 0; };
  const q = j => clamp01(j) * clamp01(nRow - j);
  const dep = (i, j) => kd * q(j) * Math.max(V((i - j) / 4), V((i + j) / 4));
  const yx = j => -yK + j * dY;
  const vert = (i, j) => { const y = yx(j), th = i * dth, r = crown(y) - dep(i, j); P.push(y, -r * Math.sin(th), r * Math.cos(th)); UV.push(th / TAU, y); return P.length / 3 - 1; };
  const idx = [];
  for (let j = 0; j <= nRow; j++) { const row = []; for (let i = 0; i < C; i++) row.push(vert(i, j)); idx.push(row); }
  let vol = 0;
  const tri = (pa, pb, pc, ta, tb, tc) => {
    I.push(pa, pb, pc);
    /* the volume cut below the crown: the triangle's area on the crown (s = r θ) × its mean depth */
    const ym = (ta[1] + tb[1] + tc[1]) / 3, rr = crown(yx(ym)), sx = rr * dth;
    const ux = (tb[0] - ta[0]) * sx, uy = (tb[1] - ta[1]) * dY, vx = (tc[0] - ta[0]) * sx, vy = (tc[1] - ta[1]) * dY;
    vol += Math.abs(ux * vy - uy * vx) / 2 * (dep(...ta) + dep(...tb) + dep(...tc)) / 3;
  };
  for (let j = 0; j < nRow; j++) for (let i = 0; i < C; i++) {
    const i1 = (i + 1) % C, c = vert(i + 0.5, j + 0.5), a = idx[j][i], b = idx[j][i1], d = idx[j + 1][i], e = idx[j + 1][i1];
    const A = [i, j], B = [i + 1, j], D = [i, j + 1], Ec = [i + 1, j + 1], Cc = [i + 0.5, j + 0.5];
    /* four triangles round the centre, each counter-clockwise in (θ, y) like the lathe's, so the normals face out */
    tri(a, b, c, A, B, Cc); tri(b, e, c, B, Ec, Cc); tri(e, d, c, Ec, D, Cc); tri(d, a, c, D, A, Cc);
  }
  return { geometry: creaseNormals(makeGeometry(P, I, UV), 35), grooveVolume: vol };
}
function meshVolume(geo) {
  const p = geo.attributes.position.array; let v = 0;
  for (let i = 0; i < p.length; i += 9) {
    v += (p[i] * (p[i + 4] * p[i + 8] - p[i + 5] * p[i + 7]) - p[i + 1] * (p[i + 3] * p[i + 8] - p[i + 5] * p[i + 6]) + p[i + 2] * (p[i + 3] * p[i + 7] - p[i + 4] * p[i + 6])) / 6;
  }
  return Math.abs(v);
}
