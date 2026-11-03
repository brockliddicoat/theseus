// Mill-Max 3305 series open-bottom, low-profile, solder-mount receptacle (hot-swap "claw spring", #14).
// Datasheet numbers (Mill-Max, "Receptacles make keyswitch hot swapping effortless"): mounting hole .062" (1.575),
// flange Ø .077" (1.956), body Ø .058" (1.473), length .105/.130/.155" (3305-0/-1/-2), above-board .010" (0.25),
// accepts round leads .025–.037" (0.635–0.940 mm), 6-finger beryllium-copper contact with 30 µin gold over nickel;
// brass shell, 200–300 µin matte tin over nickel (-80-) or 10 µin gold (-15-).
// The clip's internal shape (finger profile, throat) is representative; outer dimensions are datasheet.
// Frame: origin on the PCB top surface at the hole centre, +Y up (flange above the board, body down).
import * as THREE from 'three';
import { partMaterials } from './lib/materials.js';
import { extrude, lathe, sweep, arc, meshOf, disposeTree, clamp01, smooth, lerp, filletPolygon, makeGeometry, creaseNormals } from './lib/geom.js';
import { SectionPlane } from './lib/section.js';
import { gt01PinGeometry } from './gt01.js';

const IN = 25.4;
export const MILLMAX_3305_SPEC = {
  name: 'Mill-Max 3305 receptacle',
  label: 'datasheet (outer dims) / representative (clip interior)',
  mountingHole: 0.062 * IN, flangeD: 0.077 * IN, bodyD: 0.058 * IN, aboveBoard: 0.010 * IN,
  length: { 0: 0.105 * IN, 1: 0.130 * IN, 2: 0.155 * IN },
  accepts: [0.025 * IN, 0.037 * IN],
  contact: 'beryllium copper C17200 (Cu 98.1 / Be 1.9), 6 fingers, 30 µin Au over Ni',
  shell: { '80': 'brass, 200–300 µin matte Sn over Ni', '15': 'brass, 10 µin Au over Ni' },
  cycles: '1,000 min', resistance: '10 mΩ max',
  mass_g_brock: 0.11,
  sources: {
    dims: 'Mill-Max, "Receptacles Make KeySwitch Hot Swapping Effortless" (3305 series) [DS]',
    material: 'Mill-Max 3305 spec via Mouser (research report) [DS]',
  },
};

export function buildMillMax3305(opts = {}) {
  const variant = opts.variant ?? 0;
  const S = MILLMAX_3305_SPEC;
  const L = S.length[variant] ?? S.length[0];
  const tPCB = opts.pcbThickness ?? 1.2;
  const M = partMaterials(opts.materials);
  const userMats = new Set(Object.values(opts.materials || {}));
  const own = new Set(Object.values(M).filter(m => !userMats.has(m)));
  const shellMat = opts.shell === 'gold' ? M.gold : M.tin;

  const root = new THREE.Group(); root.name = 'MillMax3305';
  const rF = S.flangeD / 2, rB = S.bodyD / 2, hF = S.aboveBoard;
  const yBot = hF - L;                       // bottom of the body
  const rBore = 0.56;                        // bore radius (wall ≈ 0.18)
  // ---------------------------------------------------------------- shell (lathe, open bottom)
  const shellProf = [
    [rBore + 0.05, yBot], [rB - 0.07, yBot], [rB, yBot + 0.07],      // bottom chamfer
    [rB, -0.02], [rF - 0.02, -0.02], [rF, 0.0],                       // under-flange
    ...arc(rF - 0.05, hF - 0.05, 0.05, 0, Math.PI / 2, 4),            // flange top edge fillet
    [0.72, hF], [rBore + 0.02, hF - 0.16],                            // lead-in funnel
    [rBore, hF - 0.2], [rBore, yBot + 0.06], [rBore + 0.05, yBot],
  ];
  const shell = meshOf(lathe(shellProf, { segments: 96, crease: 40 }), shellMat, 'shell');
  root.add(shell);

  // ---------------------------------------------------------------- contact clip (BeCu, gold): barrel + 6 fingers
  const clip = new THREE.Group(); clip.name = 'clip';
  const yC0 = hF - 0.22, yC1 = yC0 - 0.45;   // barrel top / bottom
  const barrel = meshOf(lathe([[0.47, yC1], [rBore - 0.005, yC1], [rBore - 0.005, yC0 - 0.03], [rBore - 0.035, yC0], [0.49, yC0], [0.47, yC0 - 0.03], [0.47, yC1]], { segments: 72, crease: 40 }), M.gold, 'barrel');
  clip.add(barrel);
  const nF = 6, rRoot = 0.5, rTip = 0.27, yTip = yC1 - 0.95, wRoot = 0.34, wTip = 0.2, tF = 0.06;
  const fingers = [];
  for (let i = 0; i < nF; i++) {
    const a = Math.PI / 6 + i * (2 * Math.PI / nF);
    const f = new THREE.Group(); f.name = 'finger' + i;
    f.rotation.y = a; f.position.y = yC1;           // local +X = radial direction, pivot at the barrel bottom
    const geo = fingerGeometry({ rRoot, rTip, len: yC1 - yTip, wRoot, wTip, t: tF });
    const m = meshOf(geo, M.gold, 'finger' + i);
    m.position.x = rRoot;                           // pivot at the finger root
    f.add(m);
    clip.add(f);
    fingers.push({ f, a });
  }
  root.add(clip);

  // ---------------------------------------------------------------- PCB slice with plated hole, pads, solder
  const pcb = new THREE.Group(); pcb.name = 'pcb';
  if (opts.pcb !== false) {
    const hR = S.mountingHole / 2, pad = 1.35;
    const sq = 6.0;
    const board = new THREE.Shape(); board.moveTo(-sq / 2, -sq / 2); board.lineTo(sq / 2, -sq / 2); board.lineTo(sq / 2, sq / 2); board.lineTo(-sq / 2, sq / 2);
    board.holes.push(circleHole(hR + 0.03));
    const bg = extrude(board, { depth: tPCB - 0.064, curveSegments: 48 });     // hairline gaps to the mask layers (no coplanar faces in section)
    bg.rotateX(-Math.PI / 2); bg.translate(0, -tPCB + 0.032, 0);
    pcb.add(meshOf(bg, M.fr4, 'fr4'));
    // solder mask top/bottom (thin), with pad openings
    for (const [y0, nm] of [[-0.03, 'maskTop'], [-tPCB, 'maskBot']]) {
      const ms = new THREE.Shape(); ms.moveTo(-sq / 2, -sq / 2); ms.lineTo(sq / 2, -sq / 2); ms.lineTo(sq / 2, sq / 2); ms.lineTo(-sq / 2, sq / 2);
      ms.holes.push(circleHole(pad + 0.08));
      const mg = extrude(ms, { depth: 0.03, curveSegments: 48 }); mg.rotateX(-Math.PI / 2); mg.translate(0, y0, 0);
      pcb.add(meshOf(mg, M.maskBlack, nm));
    }
    // copper barrel + pads (ENIG gold finish)
    const barrelCu = lathe([[hR + 0.02, -tPCB + 0.0], [pad, -tPCB], [pad, -tPCB + 0.035], [hR + 0.025, -tPCB + 0.035], [hR + 0.025, -0.035], [pad, -0.035], [pad, 0.0], [hR + 0.02, 0.0], [hR + 0.02, -tPCB]], { segments: 72, crease: 40 });
    pcb.add(meshOf(barrelCu, M.gold, 'padsBarrel'));
    // solder: fills the annulus and forms a concave fillet from the bottom pad to the body
    const sol = meshOf(solderGeometry(rB, pad, hR, tPCB, yBot), M.tin, 'solder');
    pcb.add(sol);
    root.add(pcb);
  }

  // ---------------------------------------------------------------- optional insulating sock (Brock's idea)
  let sock = null;
  if (opts.sock) {
    const y1 = -tPCB - 0.02, y0 = yBot - 0.35;
    sock = meshOf(lathe([[0, y0], [rB + 0.12, y0], ...arc(rB + 0.12 - 0.2, y0 + 0.2, 0.2, -Math.PI / 2, 0, 5).slice(1), [rB + 0.32, y1], [rB + 0.6, y1], [rB + 0.6, y1 + 0.02], [0, y1 + 0.02]], { segments: 64 }), M.silicone, 'sock');
    root.add(sock);
  }

  // ---------------------------------------------------------------- pin stand-in (GT01-style flat terminal tip)
  let pin = null;
  const pinLen = 4.2;
  if (opts.pin !== false) {
    pin = new THREE.Group(); pin.name = 'pin';
    const pm = meshOf(gt01PinGeometry(pinLen), M.goldSatin, 'pinTip');
    pm.position.y = pinLen;                         // group origin = pin tip
    pin.add(pm);
    root.add(pin);
  }
  const pinW = 0.6, pinT = 0.4, pinTipLen = 0.32, pinTip0 = 0.2;   // tip: 0.2 → 0.6 wide over 0.32 mm

  // ---------------------------------------------------------------- section
  const section = new SectionPlane(root, { normal: [0, 0, -1], from: -3.6, to: 0.0 });
  section.add(shell, { capColor: 0xb7a27a, capRoughness: 0.4 });   // brass core under the tin
  section.add(barrel, { capColor: 0xd9a06e });                      // BeCu core
  const pcbMeshes = []; pcb.traverse(o => { if (o.isMesh) pcbMeshes.push(o); });
  for (const o of pcbMeshes) section.add(o, o.name === 'fr4' ? { capColor: 0x8a8460 } : o.name === 'padsBarrel' ? { capColor: 0xd08a5a } : o.name === 'solder' ? { capColor: 0xb9bcc0 } : {});
  for (const { f } of fingers) section.add(f.children[0], { cap: false });
  if (sock) section.add(sock);
  section.set(0);

  // ---------------------------------------------------------------- state
  const st = { insert: 1, section: 0, explode: 0 };
  // pin tip height for a given k: 0 → tip 2 mm above the flange; 1 → tip 0.45 mm above the shell bottom
  const tipY = (k) => lerp(hF + 2.0, yBot + 0.45, k);
  function apply() {
    const e = st.explode;
    const ty = tipY(st.insert);
    if (pin) pin.position.y = ty + 2.4 * e * 1.6;
    clip.position.y = 2.1 * e;
    // finger spread: radius the pin occupies at each finger's tip height, along the finger direction
    const yFingerTip = yTip + clip.position.y;
    const dy = yFingerTip - (ty + (pin ? 2.4 * e * 1.6 : 0));      // height of the finger tip above the pin tip
    let wHalf = 0, tHalf = 0;
    if (pin && dy > 0) {
      const w = dy >= pinTipLen ? pinW : lerp(pinTip0, pinW, dy / pinTipLen);
      wHalf = w / 2; tHalf = pinT / 2 * Math.min(1, 0.6 + dy / pinTipLen);
    }
    for (const { f, a } of fingers) {
      // rectangle support function in the finger's radial direction (pin flat faces along X/Z)
      const dir = a;    // finger radial direction angle (rotation about Y)
      const cx = Math.abs(Math.cos(dir)), sz = Math.abs(Math.sin(dir));
      const need = wHalf ? (wHalf * sz + tHalf * cx) : 0;   // pin width runs along Z (GT01 pins: width ∥ switch length)
      const r = Math.max(rTip, need + tF / 2);
      const len = yC1 - yTip;
      f.rotation.z = 0;
      // rotate about the local tangent axis (local Z) so the tip moves outward by (r − rTip)
      const ang = Math.atan2(r - rTip, len);
      f.children[0].rotation.z = ang;
    }
  }
  root.setInsert = (k) => { st.insert = clamp01(k); apply(); };
  root.setSection = (k) => { st.section = clamp01(k); section.set(smooth(0, 1, st.section)); };
  root.setExplode = (k) => { st.explode = clamp01(k); apply(); };
  root.getState = () => ({ ...st });

  root.userData.spec = { ...S, variant, lengthMm: +L.toFixed(3), pcbThickness: tPCB, protrudesBelowPCB: +(-(yBot) - tPCB).toFixed(3) };
  root.userData.parts = { shell, clip, barrel, fingers: fingers.map(x => x.f), pcb, pin, sock };
  root.dispose = () => { section.dispose(); disposeTree(root, userMats); for (const m of own) m.dispose?.(); };
  apply();
  return root;
}

function circleHole(r) { const p = new THREE.Path(); p.absarc(0, 0, r, 0, Math.PI * 2, true); return p; }

/** One finger: a tapered strip leaving the barrel bottom and curving inward to the throat (local frame:
 *  pivot at origin, radial +X, down −Y, tangent ±Z). */
function fingerGeometry({ rRoot, rTip, len, wRoot, wTip, t }) {
  const pts = [], n = 20;
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    // inward bow: straight-ish then curling in, with a small outward flare at the very tip (lead-in)
    const r = lerp(rRoot, rTip, Math.sin(s * Math.PI / 2) ** 1.4) + (s > 0.88 ? (s - 0.88) * 0.5 : 0);
    pts.push(new THREE.Vector3(r - rRoot, -len * s, 0));
  }
  const P = [], I = [], UV = [];
  for (let i = 0; i <= n; i++) {
    const s = i / n, w = lerp(wRoot, wTip, s) / 2;
    const p = pts[i], q = pts[Math.min(n, i + 1)], o = pts[Math.max(0, i - 1)];
    const tx = q.x - o.x, ty = q.y - o.y, tl = Math.hypot(tx, ty) || 1;
    const nx = -ty / tl, ny = tx / tl;       // in-plane normal (radial-ish)
    // curvature of the strip across its width (fingers are slightly curved like a tube segment)
    const sag = 0.025;
    const ring = [[-w, -t / 2], [w, -t / 2], [w, t / 2], [-w, t / 2]];
    for (const [zz, tt] of ring) {
      const bow = sag * (1 - (zz / w) ** 2);
      P.push(p.x + nx * (tt + bow), p.y + ny * (tt + bow), zz);
      UV.push(s, zz);
    }
  }
  for (let i = 0; i < n; i++) for (let j = 0; j < 4; j++) {
    const a = i * 4 + j, b = i * 4 + ((j + 1) % 4), c = a + 4, d = b + 4;
    I.push(a, c, d, a, d, b);
  }
  const e = n * 4; I.push(e, e + 1, e + 2, e, e + 2, e + 3);
  return creaseNormals(makeGeometry(P, I, UV), 40);
}

/** Solder: fills the hole around the body and forms a concave fillet from the bottom pad to the body. */
function solderGeometry(rB, pad, hR, tPCB, yBot) {
  const prof = [];
  const yPad = -tPCB, yEnd = Math.max(yBot + 0.15, yPad - 0.55);
  // start at the body below the board, fillet down/out to the pad edge, back up through the hole
  prof.push([rB + 0.001, yEnd]);
  const n = 10;
  for (let i = 1; i <= n; i++) {
    const s = i / n;
    const r = rB + (pad - 0.05 - rB) * s;
    const y = yEnd + (yPad - yEnd) * (1 - (1 - s) ** 2) - 0.012;
    prof.push([r, y]);
  }
  prof.push([pad - 0.02, yPad + 0.002], [hR + 0.018, yPad + 0.002], [hR + 0.018, -0.05], [rB + 0.06, -0.03], [rB + 0.001, -0.01], [rB + 0.001, yEnd]);
  return lathe(prof, { segments: 72, crease: 45 });
}
