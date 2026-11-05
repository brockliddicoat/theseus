// M2 machine screw with a Phillips/slotted combination drive (#9) and a knurled brass heat-set insert (#101).
// Screw: ISO 7045 pan head (dk 4.0, k 1.6, rf 3.2, r 0.1 under the head), cross recess No. 0 (type H: m ≈ 1.9,
// penetration 1.0) with an ISO 1580-size slot (n 0.5, 0.8 deep: t ≥ 0.5) across it, built exactly in lib/panhead.js; rolled
// M2 × 0.4 thread (ISO 68-1 profile: 60° flanks, P/8 crest flat, rounded root), with its run-out under the head
// (x ≤ 1.0 mm, ISO 7045) and a 45° chamfered point (ISO 4753); titanium Ti-6Al-4V grade 5 (Brock, F25.4: "Titanium";
// it was brass-plated carbon steel: 'brass' and 'steel' remain as finishes). Finalmouse uses M1.6 × 5 T5; Brock moves to M2
// for availability.
// Insert: M2 × 3.0 × Ø3.5 brass, two knurl bands of sharp opposed-helix teeth with chamfered ends, a groove between
// them, a pilot and a 90° countersink (the common heat-set form; Brock: "M2 heat set inserts are only 0.16–0.18 g").
// Geometry: representative (ISO envelopes; no specific maker's drawing).
import * as THREE from 'three';
import { partMaterials } from './lib/materials.js';
import { lathe, helixThread, knurlTeeth, isoExternal, isoInternal, extrude, meshOf, disposeTree, clamp01, smooth, lerp, roundedRectShape, arc } from './lib/geom.js';
import { panHeadGeometry } from './lib/panhead.js';
import { SectionPlane } from './lib/section.js';

const TAU = Math.PI * 2;
export const FASTENER_SPEC = {
  screw: { thread: 'M2 × 0.4', length: 5, head: 'pan, ISO 7045 envelope dk 4.0 × k 1.6, rf 3.2', drive: 'cross recess No. 0 (type H) + slot 0.5 × 0.8 (combination; ISO 1580 M2: n 0.5, t ≥ 0.5)',
    finish: 'titanium Ti-6Al-4V grade 5 (4.43 g/cm³), bare', runout: 'x ≤ 1.0 mm (ISO 7045)', point: '45° chamfer (ISO 4753)', label: 'representative' },
  insert: { thread: 'M2 × 0.4', length: 3.0, od: 3.5, material: 'brass (CuZn)', knurl: 'two bands, 18 sharp teeth each, opposed 30° helix, chamfered ends', label: 'representative' },
  pitch: 0.4,
  sources: {
    iso7045: 'ISO 7045:1983 table, M2: dk max 4.0, k max 1.6, rf ≈ 3.2, r min 0.1, x max 1.0, penetration (H) 0.85–1.2 [DS]',
    iso68: 'ISO 68-1 basic profile: H = 0.866P, crest flat P/8, 60° flanks; ISO 965: external root radius ≥ 0.125P [DS]',
    screws: "Brock's doc #9 (combination drive, M2, machine screws) and #101 (brass heat-set inserts); titanium (F25.4) [PR]",
    titanium: 'ASM Aerospace Specification Metals, Ti-6Al-4V grade 5 annealed: 4.43 g/cc, 36 HRC (349 HV), 950 MPa ultimate, 880 MPa yield, permeability 1.00005 [DS]',
    finalmouse: 'Finalmouse M1.6 × 5.0 T5 (Brock, #101) [CA]; SLX uses 15 titanium screws ~0.02 g each [MC]',
    insertMass: 'Brock: M2 heat-set inserts 0.16–0.18 g [CA]',
  },
};

// thread radii (mm): screw crest/root, insert groove/crest, chosen with clearance so the meshes never intersect
const P = 0.4;
const S_MAJ = 0.985, S_ROOT = 0.18 * P;                     // external crest radius; root radius (→ root at r ≈ 0.752)
const I_MAJ = 1.02, I_MIN = 0.80;                          // internal: groove floor, crest
const SCREW_PROFILE = isoExternal(P, S_MAJ, S_ROOT, 7);
const INSERT_PROFILE = isoInternal(P, I_MAJ, I_MIN, S_MAJ, 0.02);
const S_MIN = Math.min(...SCREW_PROFILE.map(p => p[1]));
const BLANK = 0.87;                                        // rolled-thread blank ≈ pitch diameter: the shank under the head

/** a copy of a material that multiplies by the vertex colours (the baked occlusion); disposed with the tree */
function aoMat(m) { const c = m.clone(); c.vertexColors = true; if (c.clearcoat) c.clearcoat = 0; return c; }   // no clearcoat: its highlight would ignore the occlusion
/** occlusion as vertex colours from the radius: lo at r0, hi at r1 (interpolated, clamped) */
function aoByRadius(geo, r0, r1, lo, hi = 1) {
  const p = geo.attributes.position, n = p.count, c = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = Math.hypot(p.getX(i), p.getZ(i)), t = Math.min(1, Math.max(0, (r - r0) / ((r1 - r0) || 1)));
    const v = lo + (hi - lo) * t * t * (3 - 2 * t);
    c[i * 3] = c[i * 3 + 1] = c[i * 3 + 2] = v;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(c, 3));
}

/** Screw meshes: head (exact recess), thread (helical, run-out and point), tip face. Origin: bearing face, shank −Y.
    o.detail: 'high' (deck close-ups, default) | 'low' (screws seen only by their heads, e.g. in the shell). */
function screwMeshes(M, o = {}) {
  const len = o.length ?? 5, phase = o.phase ?? 0, low = o.detail === 'low';
  const mat = { titanium: M.titanium, brass: M.brassPlated, steel: M.steel, black: M.blackOxide }[o.finish || 'titanium'] || M.titanium;
  const tmat = { titanium: M.titaniumRolled, brass: M.brassPlatedRolled, steel: M.steel, black: M.blackOxide }[o.finish || 'titanium'] || M.titaniumRolled;
  const headG = panHeadGeometry(low ? { nSlot: 14, nSide: 6, nEnd: 4, radial: 7, nTrench: 6 } : {});
  const head = meshOf(headG.geometry, aoMat(mat), 'head');
  const yTip = -len, y1 = -0.1;                            // thread from the point to the under-head fillet
  const rTipEnd = S_MIN - 0.1;
  const kCrest = (S_MAJ - BLANK) / 0.25, kRoot = (BLANK - S_MIN) / 0.85;   // run-out: crests in 0.25, roots in 0.85 (≤ x 1.0)
  const thread = meshOf(helixThread({
    pitch: P, segments: low ? 40 : 80, y0: yTip, y1, profile: low ? SCREW_PROFILE.filter((_, i) => i % 2 === 0 || i === SCREW_PROFILE.length - 1) : SCREW_PROFILE, phase,
    hi: (y) => Math.min(rTipEnd + (y - yTip) * 1.0, BLANK + (y1 - y) * kCrest),     // 45° point; crests rising out of the blank
    lo: (y) => BLANK - (y1 - y) * kRoot,                                             // roots filling to the blank under the head
    crease: 38,
  }), null, 'thread');
  const tip = meshOf(lathe([[0, yTip], [rTipEnd, yTip], [rTipEnd, yTip + 1e-4]], { segments: low ? 40 : 80 }), null, 'tip');
  // occlusion baked by radius: the roots sit in shadow between the flanks; the point's face a little
  aoByRadius(thread.geometry, S_MIN, S_MAJ, 0.58); aoByRadius(tip.geometry, 0, 1, 0.9, 0.9);
  thread.material = tip.material = aoMat(tmat);
  return { head, thread, tip, mat, headSpec: headG.spec };
}

/** Insert meshes. Origin: top face centre, body −Y. phase: internal thread phase (see buildScrewJoint). */
function insertMeshes(M, o = {}) {
  const L = o.length ?? 3.0, R = (o.od ?? 3.5) / 2, phase = o.phase ?? 0;
  const rTip = R, rRoot = R - 0.25, rBody = rRoot - 0.005, rGroove = rRoot - 0.12, rPilot = rRoot - 0.08;
  const yB = -L;
  const gTop = -1.30 * L / 3, gBot = -1.62 * L / 3, pTop = -2.52 * L / 3;      // groove and pilot, scaled with length
  // bore: 90° countersink at the top, a short chamfer at the bottom → circular thread ends
  const loT = (y) => I_MIN + Math.max(0, y + 0.3) * 1.0;
  const loB = (y) => I_MIN + Math.max(0, (yB + 0.16) - y) * 1.6;
  const lo = (y) => Math.max(loT(y), loB(y));
  const rTopEnd = lo(0), rBotEnd = lo(yB);
  const brass = aoMat(M.brass), knurl = aoMat(M.brassKnurl);
  const thread = meshOf(helixThread({ pitch: P, segments: 80, y0: yB, y1: 0, profile: INSERT_PROFILE, phase, internal: true, lo, crease: 38 }), brass, 'insertThread');
  aoByRadius(thread.geometry, I_MIN, I_MAJ, 0.62, 0.42);           // inside the bore: dim, darkest in the grooves
  // body (lathe, material on the left): bottom face → pilot → lower band core → groove → upper band core → top face
  const prof = [
    [rBotEnd, yB], [rPilot - 0.12, yB], [rPilot, yB + 0.12],          // bottom face + pilot chamfer
    [rPilot, pTop], [rBody, pTop],                                      // pilot → lower band core (step)
    [rBody, gBot], [rGroove, gBot], [rGroove, gTop], [rBody, gTop],     // groove between the bands
    [rBody, -1e-3], [rBody, 0], [rTopEnd, 0],                           // upper band core → top face → countersink
  ];
  const body = meshOf(lathe(prof, { segments: 96, crease: 35 }), brass, 'insertBody');
  aoByRadius(body.geometry, rTopEnd - 0.05, rGroove, 0.62, 1.0);   // the countersink dim, the outside lit; the groove floor:
  { const p = body.geometry.attributes.position, c = body.geometry.attributes.color;
    for (let i = 0; i < p.count; i++) { const r = Math.hypot(p.getX(i), p.getZ(i)), y = p.getY(i); if (r > rGroove - 1e-4 && r < rBody - 1e-4 && y < gTop + 1e-4 && y > gBot - 1e-4) c.setXYZ(i, 0.66, 0.66, 0.66); } }
  const knA = meshOf(knurlTeeth({ rRoot, rTip, y0: pTop, y1: gBot, count: 18, lead: -19.6, rings: 30, per: 10 }), knurl, 'knurlLower');
  const knB = meshOf(knurlTeeth({ rRoot, rTip, y0: gTop, y1: 0, count: 18, lead: 19.6, rings: 40, per: 10 }), knurl, 'knurlUpper');
  aoByRadius(knA.geometry, rRoot, rTip, 0.7); aoByRadius(knB.geometry, rRoot, rTip, 0.7);
  // mass: the body ring plus the teeth (half of the tooth annulus, near enough for trapezoids with small flats)
  const ring = (ro, ri, h) => Math.PI * (ro * ro - ri * ri) * h;
  const vol = ring(rBody, 0.92, L) - ring(rBody, rGroove, gTop - gBot) - ring(rBody, rPilot, pTop - yB)
    + 0.5 * (ring(rTip, rRoot, -gTop) + ring(rTip, rRoot, gBot - pTop));
  return { thread, body, knA, knB, R, massEstimate_g: +(vol * 8.5e-3).toFixed(3) };
}

/** signed volume of a closed mesh (or of meshes that close one surface together): Σ (a · (b × c)) / 6 over its triangles */
function signedVolume(geo) {
  const g = geo.index ? geo.toNonIndexed() : geo, p = g.attributes.position.array; let v = 0;
  for (let i = 0; i < p.length; i += 9) v += (p[i] * (p[i + 4] * p[i + 8] - p[i + 5] * p[i + 7]) - p[i + 1] * (p[i + 3] * p[i + 8] - p[i + 5] * p[i + 6]) + p[i + 2] * (p[i + 3] * p[i + 7] - p[i + 4] * p[i + 6])) / 6;
  if (g !== geo) g.dispose();
  return v;
}
export function buildM2Screw(opts = {}) {
  const M = partMaterials(opts.materials);
  const userMats = new Set(Object.values(opts.materials || {}));
  const own = new Set(Object.values(M).filter(m => !userMats.has(m)));
  const g = new THREE.Group(); g.name = 'M2Screw';
  const s = screwMeshes(M, opts);
  g.add(s.head, s.thread, s.tip);
  /* the screw's volume (head, thread and point close one surface together) and its weight in grade 5 titanium */
  const vol = Math.abs([s.head, s.thread, s.tip].reduce((v, m) => v + signedVolume(m.geometry), 0));
  g.userData.spec = { ...FASTENER_SPEC.screw, length: opts.length ?? 5, head: s.headSpec, volume_mm3: +vol.toFixed(2), massEstimate_g: +(vol * 4.43e-3).toFixed(4) };
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
  g.userData.spec = { ...FASTENER_SPEC.insert, length: opts.length ?? 3, massEstimate_g: i.massEstimate_g };
  g.userData.parts = { body: i.body, thread: i.thread, knurls: [i.knA, i.knB] };
  g.dispose = () => { disposeTree(g, userMats); for (const m of own) m.dispose?.(); };
  return g;
}

/** Demo joint: CF-PP boss with the insert flush at its top (origin = boss top centre), a 1.0 mm clamped board slice
 *  (FR4, black mask, ENIG pad and plated barrel), and the screw. setDrive(k): k = 0 tip 0.6 mm above the board,
 *  k = 1 seated (turns 360° per 0.4 mm, clockwise from above, its thread meshed with the insert's at every k). */
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

  // boss (CF-PP): bore at the knurl tips (+ hairline), then a clearance hole for the screw's point (crest 0.985)
  const R = ins.R, rBoss = 2.65, hBoss = 5.6, yBase = -hBoss;
  const bossProf = [
    [0.0, yBase - 0.3], [rBoss + 0.55, yBase - 0.3], [rBoss + 0.55, yBase],   // sunk 0.3 into the floor (no coplanar faces)
    ...arc(rBoss + 0.55, yBase + 0.55, 0.55, -Math.PI / 2, -Math.PI, 8).slice(1).map(([r, y]) => [r, y]),
    [rBoss, -0.25], ...arc(rBoss - 0.25, -0.25, 0.25, 0, Math.PI / 2, 6).slice(1),
    [R + 0.12, 0], [R + 0.006, -0.1], [R + 0.006, -3.0], [1.12, -3.05], [1.12, -4.6], [0.7, -4.95], [0.0, -4.95],
  ];
  const boss = meshOf(lathe(bossProf.concat([[0, yBase - 0.3]]), { segments: 112, crease: 35 }), M.cfpp, 'boss');
  // four gussets tying the boss into the floor (as a moulded boss has), on the diagonals
  const gus = new THREE.Shape();
  gus.moveTo(rBoss - 0.3, yBase); gus.lineTo(rBoss + 1.75, yBase); gus.lineTo(rBoss - 0.3, yBase + 3.1); gus.lineTo(rBoss - 0.3, yBase);
  const gusG = extrude(gus, { depth: 0.6, front: { r: 0.08, s: 2 }, back: { r: 0.08, s: 2 }, curveSegments: 2 });
  gusG.translate(0, 0, -0.3);
  const gussets = [];
  for (const a of [0.25, 0.75, 1.25, 1.75].map(f => f * Math.PI)) {
    const gm = meshOf(gusG, M.cfpp, 'gusset'); gm.rotation.y = a - Math.PI / 2; gussets.push(gm);
  }
  // floor slab (shell floor stand-in) under the boss
  const floorG = extrude(roundedRectShape(11, 11, 1.2), { depth: 1.0, front: { r: 0.25, s: 3 }, back: { r: 0.25, s: 3 }, curveSegments: 8 });
  floorG.rotateX(-Math.PI / 2); floorG.translate(0, yBase - 1.0 + 0.0, 0);
  const floor = meshOf(floorG, M.cfpp, 'floor');
  root.add(boss, floor, ...gussets);

  // clamped board slice (PCB stand-in): FR4 core, black mask both sides, an ENIG pad under the head and a plated barrel
  const plate = new THREE.Group(); plate.name = 'plate';
  const hole = () => { const h = new THREE.Path(); h.absarc(0, 0, 1.15, 0, TAU, true); return h; };
  const core = roundedRectShape(9, 9, 1.0); core.holes.push(hole());
  const coreG = extrude(core, { depth: tPlate - 0.064, curveSegments: 64 }); coreG.rotateX(-Math.PI / 2); coreG.translate(0, 0.032 + 0.004, 0);
  plate.add(meshOf(coreG, M.fr4, 'plateCore'));
  const padR = 2.25;
  for (const [y0, top] of [[0.004, false], [tPlate - 0.03 + 0.004, true]]) {
    const ms = roundedRectShape(9, 9, 1.0); const h2 = new THREE.Path(); h2.absarc(0, 0, top ? padR + 0.08 : 1.15, 0, TAU, true); ms.holes.push(h2);
    const mg = extrude(ms, { depth: 0.03, curveSegments: 64 }); mg.rotateX(-Math.PI / 2); mg.translate(0, y0, 0);
    plate.add(meshOf(mg, M.maskBlack, 'plateMask'));
  }
  {
    const pad = new THREE.Shape(); pad.absarc(0, 0, padR, 0, TAU, false); pad.holes.push(hole());
    const pg = extrude(pad, { depth: 0.028, front: { r: 0.01, s: 1 }, curveSegments: 72 }); pg.rotateX(-Math.PI / 2); pg.translate(0, tPlate - 0.03, 0);
    plate.add(meshOf(pg, M.gold, 'platePad'));
    const barrel = lathe([[1.115, tPlate - 0.002], [1.115, 0.006], [1.15, 0.006], [1.15, tPlate - 0.002], [1.115, tPlate - 0.002]], { segments: 72, crease: 30 });
    plate.add(meshOf(barrel, M.gold, 'plateBarrel'));
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
  for (const gm of gussets) section.add(gm, { capColor: 0x2a2c30, capRoughness: 0.8 });
  for (const m of [ins.body, ins.thread, ins.knA, ins.knB]) section.add(m, { capColor: 0xd9b25c, capRoughness: 0.32 });
  for (const m of [sc.head, sc.thread, sc.tip]) section.add(m, { capColor: 0xaeaba5, capRoughness: 0.32 });   // solid titanium, no plating
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
  root.userData.spec = { ...FASTENER_SPEC, plateThickness: tPlate, bossOD: 2 * rBoss, seatedTipDepth: +(len - tPlate).toFixed(2), insertMass_g: ins.massEstimate_g };
  root.userData.parts = { screw, insert, boss, floor, plate, head: sc.head, thread: sc.thread, gussets };
  root.dispose = () => { section.dispose(); disposeTree(root, userMats); for (const m of own) m.dispose?.(); };
  apply();
  return root;
}
