// M2 machine screw with a Phillips/slotted combination drive (#9) and a brass heat-set insert (#101).
// Screw: ISO 7045-style pan head envelope (dk 4.0, k 1.6), M2 × 0.4 coarse, length 5 (Finalmouse uses M1.6 × 5;
// Brock moves to M2 for availability), brass-plated carbon-steel core (Brock: plating vs insert corrosion; steel
// core for magnetic pickup). Insert: M2 × 3.0 long × Ø3.5 brass, two opposed knurl bands (common heat-set form;
// Brock: "M2 heat set inserts are only 0.16–0.18 g").  Geometry: representative.
import * as THREE from 'three';
import { partMaterials } from './lib/materials.js';
import { lathe, helixThread, knurlBand, extrude, decodeGeo, meshOf, disposeTree, clamp01, smooth, lerp, roundedRectShape, arc } from './lib/geom.js';
import { SectionPlane } from './lib/section.js';
import GEO from './geo/fasteners.geo.js';

const TAU = Math.PI * 2;
export const FASTENER_SPEC = {
  screw: { thread: 'M2 × 0.4', length: 5, head: 'pan, ISO 7045 envelope dk 4.0 × k 1.6', drive: 'Phillips H0 + slot (combination)',
    finish: 'brass-plated carbon steel', label: 'representative' },
  insert: { thread: 'M2 × 0.4', length: 3.0, od: 3.5, material: 'brass (CuZn)', knurl: 'two bands, opposed helix', label: 'representative' },
  pitch: 0.4,
  sources: {
    screws: "Brock's doc #9 (combination drive, M2, brass plating, machine screws) and #101 (brass heat-set inserts) [PR]",
    finalmouse: 'Finalmouse M1.6 × 5.0 T5 (Brock, #101) [CA]; SLX uses 15 titanium screws ~0.02 g each [MC]',
    insertMass: 'Brock: M2 heat-set inserts 0.16–0.18 g [CA]',
  },
};

// thread radii (mm): screw crest/root, insert groove/crest — chosen with clearance so meshes never intersect
const P = 0.4;
const S_MAJ = 0.98, S_MIN = 0.75, I_MAJ = 1.02, I_MIN = 0.8;
const SCREW_PROFILE = [[0, S_MAJ], [1 / 16, S_MAJ], [3 / 8, S_MIN], [0.5, S_MIN - 0.01], [5 / 8, S_MIN], [15 / 16, S_MAJ], [1, S_MAJ]];
const INSERT_PROFILE = [[0, I_MAJ], [0.09, I_MAJ], [0.389, I_MIN], [0.5, I_MIN], [0.611, I_MIN], [0.91, I_MAJ], [1, I_MAJ]];

/** Screw meshes (head + thread + tip cap) into `group`; returns the meshes. Origin: bearing face, shank −Y. */
function screwMeshes(M, o = {}) {
  const len = o.length ?? 5, phase = o.phase ?? 0;
  const mat = { brass: M.brassPlated, steel: M.steel, black: M.blackOxide }[o.finish || 'brass'] || M.brassPlated;
  const head = meshOf(decodeGeo(GEO.m2_head, 34), mat, 'head');
  const yTip = -len, ch = 0.32;
  const rTipEnd = S_MIN - 0.12;
  const thread = meshOf(helixThread({
    pitch: P, segments: 64, y0: yTip, y1: 0.0, profile: SCREW_PROFILE, phase,
    hi: (y) => Math.min(Infinity, rTipEnd + (y - yTip) * 1.2),           // 40° point chamfer
    lo: (y) => (y > -0.55 ? S_MIN + (S_MAJ - S_MIN) * smooth(-0.55, -0.02, y) * 1.02 : -Infinity),   // under-head runout
  }), mat, 'thread');
  const tip = meshOf(lathe([[0, yTip], [rTipEnd, yTip], [rTipEnd, yTip + 0.0001]], { segments: 64 }), mat, 'tip');
  void ch;
  return { head, thread, tip, mat };
}

/** Insert meshes. Origin: top face centre, body −Y. phase: internal thread phase (see buildScrewJoint). */
function insertMeshes(M, o = {}) {
  const L = o.length ?? 3.0, R = (o.od ?? 3.5) / 2, phase = o.phase ?? 0;
  const depthK = 0.2, core = R - depthK;
  const yB = -L;
  // envelopes: countersink lead-in at the top, small chamfer at the bottom → circular thread ends
  const loT = (y) => I_MIN + Math.max(0, y + 0.3) * 1.0;
  const loB = (y) => I_MIN + Math.max(0, (yB + 0.16) - y) * 1.6;
  const lo = (y) => Math.max(loT(y), loB(y));
  const rTopEnd = lo(0), rBotEnd = lo(yB);
  const thread = meshOf(helixThread({ pitch: P, segments: 64, y0: yB, y1: 0, profile: INSERT_PROFILE, phase, internal: true, lo }), M.brass, 'insertThread');
  // body (lathe): bottom annulus → pilot → lower knurl core → groove → upper knurl core → top collar → top annulus
  const b1 = yB + 0.45, k1a = b1 + 0.05, k1b = -1.66, g0 = -1.6, g1 = -1.32, k2a = -1.26, k2b = -0.2;
  const prof = [
    [rBotEnd, yB], [R - 0.32, yB], [R - 0.2, yB + 0.12],                 // bottom face + pilot chamfer
    [R - 0.2, b1], [core - 0.01, k1a],                                    // pilot → knurl core
    [core - 0.01, k1b], [R - 0.38, g0], [R - 0.38, g1], [core - 0.01, k2a],   // groove between the bands
    [core - 0.01, k2b], [R - 0.06, -0.12], [R - 0.06, -0.06],            // collar
    ...arc(R - 0.12, -0.06, 0.06, 0, Math.PI / 2, 3).slice(1),
    [rTopEnd + 0.04, 0], [rTopEnd, 0],
  ];
  const body = meshOf(lathe(prof, { segments: 96, crease: 35 }), M.brass, 'insertBody');
  const knA = meshOf(knurlBand({ R, depth: depthK + 0.01, y0: k1a, y1: k1b, count: 18, lead: -19, rings: 20, taper: 0.12 }), M.brass, 'knurlLower');
  const knB = meshOf(knurlBand({ R, depth: depthK + 0.01, y0: k2a, y1: k2b, count: 18, lead: 19, rings: 20, taper: 0.12 }), M.brass, 'knurlUpper');
  return { thread, body, knA, knB, R };
}

export function buildM2Screw(opts = {}) {
  const M = partMaterials(opts.materials);
  const userMats = new Set(Object.values(opts.materials || {}));
  const own = new Set(Object.values(M).filter(m => !userMats.has(m)));
  const g = new THREE.Group(); g.name = 'M2Screw';
  const s = screwMeshes(M, opts);
  g.add(s.head, s.thread, s.tip);
  g.userData.spec = { ...FASTENER_SPEC.screw, length: opts.length ?? 5 };
  g.userData.parts = { head: s.head, thread: s.thread, tip: s.tip };
  g.dispose = () => { disposeTree(g, userMats); for (const m of own) m.dispose?.(); };
  return g;
}

export function buildHeatSetInsert(opts = {}) {
  const M = partMaterials(opts.materials);
  const userMats = new Set(Object.values(opts.materials || {}));
  const own = new Set(Object.values(M).filter(m => !userMats.has(m)));
  const g = new THREE.Group(); g.name = 'HeatSetInsert';
  const i = insertMeshes(M, opts);
  g.add(i.body, i.thread, i.knA, i.knB);
  const vol = Math.PI * ((i.R - 0.1) ** 2 - 0.92 ** 2) * (opts.length ?? 3);
  g.userData.spec = { ...FASTENER_SPEC.insert, massEstimate_g: +(vol * 8.5e-3).toFixed(3) };
  g.userData.parts = { body: i.body, thread: i.thread, knurls: [i.knA, i.knB] };
  g.dispose = () => { disposeTree(g, userMats); for (const m of own) m.dispose?.(); };
  return g;
}

/** Demo joint: CF-PP boss with the insert flush at its top (origin = boss top centre), a 1.0 mm clamped plate,
 *  and the screw. setDrive(k): k = 0 tip 0.6 mm above the plate, k = 1 seated (turns 360° per 0.4 mm). */
export function buildScrewJoint(opts = {}) {
  const M = partMaterials(opts.materials);
  const userMats = new Set(Object.values(opts.materials || {}));
  const own = new Set(Object.values(M).filter(m => !userMats.has(m)));
  const root = new THREE.Group(); root.name = 'ScrewJoint';
  const tPlate = opts.plate ?? 1.0, len = opts.length ?? 5;
  const ySeat = tPlate + 0.008;                          // bearing face when seated (hairline above the mask)
  const screwPhase = 0;
  // insert thread phase so its grooves meet the screw crests at the seated pose (ψ = 0)
  const insPhase = (((ySeat - 0) / P + screwPhase) % 1 + 1) % 1;

  const ins = insertMeshes(M, { phase: insPhase });
  const insert = new THREE.Group(); insert.name = 'insert';
  insert.add(ins.body, ins.thread, ins.knA, ins.knB);
  root.add(insert);

  // boss (CF-PP) with a bore at the knurl tips (+ hairline) and a deeper screw-clearance hole
  const R = ins.R, rBoss = 2.65, hBoss = 5.6, yBase = -hBoss;
  const bossProf = [
    [0.0, yBase - 0.3], [rBoss + 0.55, yBase - 0.3], [rBoss + 0.55, yBase],   // sunk 0.3 into the floor (no coplanar faces)
    ...arc(rBoss + 0.55, yBase + 0.55, 0.55, -Math.PI / 2, -Math.PI, 6).slice(1).map(([r, y]) => [r, y]),
    [rBoss, -0.25], ...arc(rBoss - 0.25, -0.25, 0.25, 0, Math.PI / 2, 5).slice(1),
    [R + 0.12, 0], [R + 0.006, -0.1], [R + 0.006, -3.0], [0.92, -3.05], [0.92, -4.6], [0.6, -4.9], [0.0, -4.9],
  ];
  // close through the axis (lathe needs material on the left: walk outer → top → bore → back to axis)
  const boss = meshOf(lathe(bossProf.concat([[0, yBase - 0.3]]), { segments: 96, crease: 35 }), M.cfpp, 'boss');
  // floor slab (shell floor stand-in) under the boss
  const floorG = extrude(roundedRectShape(11, 11, 1.2), { depth: 1.0, front: { r: 0.25, s: 3 }, back: { r: 0.25, s: 3 }, curveSegments: 8 });
  floorG.rotateX(-Math.PI / 2); floorG.translate(0, yBase - 1.0 + 0.0, 0);
  const floor = meshOf(floorG, M.cfpp, 'floor');
  root.add(boss, floor);

  // clamped plate (PCB stand-in): FR4 core + black mask, Ø2.3 clearance hole
  const plate = new THREE.Group(); plate.name = 'plate';
  const hole = new THREE.Path(); hole.absarc(0, 0, 1.15, 0, TAU, true);
  const core = roundedRectShape(9, 9, 1.0); core.holes.push(hole);
  const coreG = extrude(core, { depth: tPlate - 0.064, curveSegments: 48 }); coreG.rotateX(-Math.PI / 2); coreG.translate(0, 0.032 + 0.004, 0);
  plate.add(meshOf(coreG, M.fr4, 'plateCore'));
  for (const y0 of [0.004, tPlate - 0.03 + 0.004]) {
    const ms = roundedRectShape(9, 9, 1.0); const h2 = new THREE.Path(); h2.absarc(0, 0, 1.15, 0, TAU, true); ms.holes.push(h2);
    const mg = extrude(ms, { depth: 0.03, curveSegments: 48 }); mg.rotateX(-Math.PI / 2); mg.translate(0, y0, 0);
    plate.add(meshOf(mg, M.maskBlack, 'plateMask'));
  }
  root.add(plate);

  // screw
  const sc = screwMeshes(M, { length: len, phase: screwPhase, finish: opts.finish });
  const screw = new THREE.Group(); screw.name = 'screw';
  screw.add(sc.head, sc.thread, sc.tip);
  root.add(screw);

  // section through the axis (kept: z ≤ 0)
  const section = new SectionPlane(root, { normal: [0, 0, -1], from: -7, to: 0 });
  section.add(boss, { capColor: 0x2a2c30, capRoughness: 0.8 });
  section.add(floor, { capColor: 0x2a2c30, capRoughness: 0.8 });
  for (const m of [ins.body, ins.thread, ins.knA, ins.knB]) section.add(m, { capColor: 0xd9b25c, capRoughness: 0.32 });
  for (const m of [sc.head, sc.thread, sc.tip]) section.add(m, { capColor: 0xb9bec4, capRoughness: 0.3 });   // steel core under the plating
  plate.children.forEach(m => section.add(m, m.name === 'plateCore' ? { capColor: 0x8a8460 } : {}));
  section.set(0);

  const st = { drive: 1, section: 0, explode: 0 };
  function apply() {
    const e = st.explode;
    const yTop = ySeat + len + 0.6;                        // k = 0: tip 0.6 above the plate top
    const ys = lerp(yTop, ySeat, st.drive);
    screw.position.y = ys + 12.5 * e;
    screw.rotation.y = TAU * (ys - ySeat) / P;             // right-hand thread: clockwise from above as it descends
    plate.position.y = 7.0 * e;
    insert.position.y = 4.0 * e;
  }
  root.setDrive = (k) => { st.drive = clamp01(k); apply(); return { turns: (1 - st.drive) * (len + 0.6) / P }; };
  root.setSection = (k) => { st.section = clamp01(k); section.set(smooth(0, 1, st.section)); };
  root.setExplode = (k) => { st.explode = clamp01(k); apply(); };
  root.getState = () => ({ ...st });
  root.userData.spec = { ...FASTENER_SPEC, plateThickness: tPlate, bossOD: 2 * rBoss, seatedTipDepth: +(len - tPlate).toFixed(2) };
  root.userData.parts = { screw, insert, boss, floor, plate, head: sc.head, thread: sc.thread };
  root.dispose = () => { section.dispose(); disposeTree(root, userMats); for (const m of own) m.dispose?.(); };
  apply();
  return root;
}
