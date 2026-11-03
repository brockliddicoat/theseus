// Battery: LiPo pouch cell + protection PCB (PCM) + 3 wires (+, −, NTC) + JST SH 3-pin plug and a side-entry
// header (#71 "rotating the battery JST socket sideways"), with optional silicone retaining bands instead of
// adhesive (Brock: "adhesive usually gets ruined if you ever have to change the battery").
// Cell: 502030 class (5.0 × 20 × 30 mm, sold as 3.7 V 250 mAh, e.g. Akyga AKY0106 LP502030 [MC]); the SLX uses
// a Jauch 250 mAh cell [MC] and the Viper V4 Pro 306 mAh [IM]. Dimensions/internals: representative.
// Frame: origin at the centre of the cell's bottom face; width X, thickness Y, length Z; PCM/tab end toward +Z.
// connectorSide: 'left' (default, header on +X = the user's left) or 'right' (−X, exact mirror of the lead side).
import * as THREE from 'three';
import { partMaterials } from './lib/materials.js';
import { extrude, lathe, sweep, arc, rectSection, roundedRectShape, roundedRectPath, circleSection, meshOf, disposeTree, clamp01, smooth, lerp } from './lib/geom.js';

export const BATTERY_SPEC = {
  name: 'LiPo pouch cell 502030 class + PCM + JST SH 3-pin', label: 'representative',
  cell: { code: '502030', thickness: 5.0, width: 20, length: 30, nominal_V: 3.7, capacity_mAh: 250, energy_Wh: 0.925 },
  connector: 'JST SH 1.0 mm pitch, 3 circuits (SHR-03V-S-B class plug, SM03B-SRSS-TB class side-entry header)',
  wires: '3 × ~32 AWG silicone (red +, black −, white NTC), twisted (#69 braiding)',
  sources: {
    cell: 'RobotShop/Akyga 502030 listings: 30 × 20 × 5 mm, 250 mAh, 3.7 V; Akyga: 6 g net with leads [MC]',
    peers: 'Finalmouse SLX: Jauch 250 mAh [MC]; Razer Viper V4 Pro: 306 mAh 3.87 V 3-pin JST [IM, TechPowerUp]',
    jst: 'JST SH catalogue: SHR-03V-S-B width B = A + 2.0 = 4.0 mm (A = 2.0 for 3 circuits) [DS]',
  },
};

export function buildBattery(opts = {}) {
  const M = partMaterials(opts.materials);
  const userMats = new Set(Object.values(opts.materials || {}));
  const own = new Set(Object.values(M).filter(m => !userMats.has(m)));
  const W = 20, T = 5.0, Ltot = 30;
  const zEnd = Ltot / 2, zSeal = zEnd - 3.6, zBack = -Ltot / 2;
  const root = new THREE.Group(); root.name = 'Battery';
  const cell = new THREE.Group(); cell.name = 'cell';
  root.add(cell);
  const sx = opts.connectorSide === 'right' ? -1 : 1;     // +X is the user's LEFT (right-handed, +Y up, +Z forward)
  const leadSide = new THREE.Group(); leadSide.name = 'leadSide'; leadSide.scale.x = sx;   // PCM, lead, plug, header
  root.add(leadSide);

  // ---------------------------------------------------------------- pouch body (deep-drawn cup, rounded edges)
  const bodyW = W - 0.8;                      // side seals folded against the sides take 0.4 each
  const prof = roundedRectShape(bodyW, T - 0.1, 1.15);
  const bodyG = extrude(prof, { depth: zSeal - zBack - 0.2, front: { r: 0.9, s: 6 }, back: { r: 1.1, s: 6 }, curveSegments: 10 });
  // extrusion along +Z already; shape (x, y) → centre y at T/2
  bodyG.translate(0, (T - 0.1) / 2 + 0.05, zBack + 0.1);
  const pouch = meshOf(bodyG, M.pouch, 'pouch');
  cell.add(pouch);
  // side seals: thin flanges folded up against both sides
  for (const s of [-1, 1]) {
    const sg = extrude(roundedRectShape(0.22, T - 1.1, 0.08), { depth: zSeal - zBack - 1.2, front: { r: 0.05, s: 1 }, back: { r: 0.05, s: 1 } });
    sg.translate(s * (bodyW / 2 + 0.16), T / 2, zBack + 0.6);
    cell.add(meshOf(sg, M.pouch, 'sideSeal'));
  }
  // top seal flange (where the tabs exit), near the flat side
  const tsg = extrude(roundedRectShape(W - 0.4, 0.32, 0.1), { depth: 1.6, front: { r: 0.06, s: 2 }, curveSegments: 4 });
  tsg.translate(0, 0.62, zSeal - 0.25);
  cell.add(meshOf(tsg, M.pouch, 'topSeal'));

  // ---------------------------------------------------------------- label (printed wrap on the top face)
  const tex = labelTexture(opts);
  const labelMat = M.label.clone(); labelMat.map = tex; labelMat.roughness = 0.5; labelMat.clearcoat = 0.08; labelMat.specularIntensity = 0.35; own.add(labelMat);
  const lw = bodyW - 2.6, ll = zSeal - zBack - 3.0;
  const lg = new THREE.PlaneGeometry(lw, ll, 1, 1);
  lg.rotateX(-Math.PI / 2);
  const label = meshOf(lg, labelMat, 'label'); label.position.set(0, T + 0.004, (zSeal + zBack) / 2 - 0.2);
  label.castShadow = false;
  cell.add(label);

  // ---------------------------------------------------------------- tabs + PCM (protection board) under Kapton
  const pcm = new THREE.Group(); pcm.name = 'pcm';
  const tabs = [];
  for (const [x, mat, nm] of [[-4.2, M.aluminium, 'tabPos'], [4.2, M.nickel, 'tabNeg']]) {
    const pts = [[x, 0.78, zSeal + 1.2], [x, 0.78, zSeal + 2.35], [x, 1.25, zSeal + 2.95], [x, 1.9, zSeal + 3.0]];
    const tg = sweep(pts.map(p => new THREE.Vector3(...p)), rectSection(0.1, 3.0, 0.02), { up: [0, 1, 0] });
    const t = meshOf(tg, mat, nm); cell.add(t); tabs.push(t);
  }
  const pcbL = 17.0, pcbW = 3.0, pcbT = 0.6;
  const pg = extrude(roundedRectShape(pcbL, pcbW, 0.3), { depth: pcbT, front: { r: 0.05, s: 1 }, back: { r: 0.05, s: 1 } });
  pg.rotateX(-Math.PI / 2);                                   // board lies flat: shape y → −z
  const board = meshOf(pg, M.maskBlack, 'pcmBoard'); board.position.set(0, 1.9, zEnd - pcbW / 2 - 0.15);
  pcm.add(board);
  const comp = (w, d, h, x, z, mat, nm) => { const g = extrude(roundedRectShape(w, d, 0.06), { depth: h, front: { r: 0.05, s: 2 } }); g.rotateX(-Math.PI / 2); const m = meshOf(g, mat, nm); m.position.set(x, 1.9 + pcbT, zEnd - pcbW / 2 - 0.15 + z); pcm.add(m); return m; };
  comp(2.9, 1.6, 1.0, -3.0, 0, M.epoxyBlack, 'ic_DW01');           // protection IC (SOT-23-6 class)
  comp(2.9, 1.6, 1.0, 1.6, 0, M.epoxyBlack, 'fet_8205');           // dual MOSFET (SOT-23-6 class)
  comp(1.0, 0.5, 0.35, 5.2, -0.6, M.ceramic, 'r1'); comp(1.0, 0.5, 0.35, 5.2, 0.6, M.ceramic, 'c1');
  comp(1.0, 0.5, 0.35, -6.2, 0.5, M.ceramic, 'c2'); comp(0.6, 0.3, 0.3, -6.2, -0.5, M.epoxyBlack, 'ntc');
  for (const [x, nm] of [[7.0, 'padB+'], [7.0 - 1.4, 'padNTC'], [7.0 - 2.8, 'padB-']]) comp(1.0, 1.4, 0.04, x - 0.0 + 0.0, 0, M.gold, nm);
  // kapton wrap (translucent amber) around the board
  const kg = extrude(roundedRectShape(pcbL + 0.6, pcbW + 0.5, 0.4), { depth: 1.8, front: { r: 0.25, s: 3 }, back: { r: 0.15, s: 2 }, curveSegments: 6 });
  kg.rotateX(-Math.PI / 2);
  const kapton = meshOf(kg, M.kapton, 'kapton'); kapton.position.set(0, 1.75, zEnd - pcbW / 2 - 0.15);
  kapton.castShadow = false;
  pcm.add(kapton);
  leadSide.add(pcm);

  // ---------------------------------------------------------------- side-entry header on a PCB tile + plug + wires
  const conn = new THREE.Group(); conn.name = 'connector';
  // header footprint centre on the board plane; opts.headerAt is in the battery frame (world-side), stored mirrored
  const hA = opts.headerAt || [15.5 * sx, 0, 24.0];
  const H0 = new THREE.Vector3(sx * hA[0], hA[1], hA[2]);
  const header = buildJstShHeader({ materials: M, _inner: true });
  header.position.copy(H0);
  conn.add(header);
  if (opts.tile !== false) {
    const tile = extrude(roundedRectShape(9, 8, 0.8), { depth: 0.8, front: { r: 0.08, s: 2 }, curveSegments: 6 });
    tile.rotateX(-Math.PI / 2); const tm = meshOf(tile, M.maskBlack, 'pcbTile'); tm.position.set(H0.x + 1.0, -0.8, H0.z); conn.add(tm);
  }
  leadSide.add(conn);
  const plug = new THREE.Group(); plug.name = 'plug';
  const pl = jstPlug(M);
  plug.add(pl.group);
  leadSide.add(plug);
  // plug mated pose: housing inside the header opening, entering along −X (mating face toward −X)
  const mate = H0.clone().add(new THREE.Vector3(-0.7, 1.42, 0));     // plug front stops at the header's back wall
  const wires = new THREE.Group(); wires.name = 'wires';
  leadSide.add(wires);

  // ---------------------------------------------------------------- silicone bands
  const bands = new THREE.Group(); bands.name = 'bands';
  if (opts.bands !== false) {
    const bandMat = opts.bandColor === 'accent' ? M.siliconeAccent : M.silicone;
    for (const z of [-10.6, 7.2]) {
      const g = bandGeometry(W + 0.5, T + 0.12, 0.62, 2.6);
      const m = meshOf(g, bandMat, 'band'); m.position.z = z; bands.add(m);
    }
    root.add(bands);
  }

  // ---------------------------------------------------------------- state
  const st = { explode: 0, plug: 1, bands: 1 };
  let wireGeoms = [];
  function layWires(plugPos, cellLift) {
    for (const g of wireGeoms) g.dispose();
    wireGeoms = [];
    wires.clear();
    // from the PCM pads (+X end of the board) to the plug's rear, as a twisted 3-wire bundle
    const start = new THREE.Vector3(5.6, 2.55 + cellLift, zEnd - 1.6);
    const end = plugPos.clone().add(new THREE.Vector3(-1.0, 0.1, 0));
    const c1 = start.clone().add(new THREE.Vector3(1.8, 0.8, 4.2));
    const c2 = end.clone().add(new THREE.Vector3(-6.0, 0.4, 0));
    const curve = new THREE.CubicBezierCurve3(start, c1, c2, end);
    const mats = [M.wireRed, M.wireBlack, M.wireWhite];
    // twisted bundle that fans out into the three plug cavities (pitch 1.0) over its last few mm
    const fan = [new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)].map(v => v.add(end));
    const strands = twistedStrands(curve, 3, 0.36, 3.4, 160, fan, 0.12);
    strands.forEach((pts, i) => {
      const g = sweep(pts, circleSection(0.33, 12), { up: [0, 1, 0], crease: 60 });
      wireGeoms.push(g);
      wires.add(meshOf(g, mats[i], 'wire' + i));
    });
  }
  function apply() {
    const e = st.explode;
    const lift = 0;
    pcm.position.set(0, 4.5 * e, 4.0 * e);
    for (const t of tabs) t.position.set(0, 2.2 * e, 2.0 * e);
    // bands: k = 1 on the cell, 0 = lifted off and relaxed above it
    const bk = smooth(0, 1, st.bands);
    bands.position.y = lerp(9.0, 0, bk) + 7 * e;
    bands.children.forEach((b, i) => { b.scale.set(lerp(0.9, 1, bk), lerp(0.9, 1, bk), 1); b.position.z = (i ? 7.2 : -10.6) + (i ? 6 : -6) * e; });
    // plug: slides out along −X as k → 0
    const pk = smooth(0, 1, st.plug);
    const pp = mate.clone().add(new THREE.Vector3(-(1 - pk) * 6.0 - 7 * e, 4 * e, 0));
    plug.position.copy(pp);
    header.position.copy(H0).add(new THREE.Vector3(6 * e, 0, 0));
    layWires(pp, lift);
  }
  root.setExplode = (k) => { st.explode = clamp01(k); apply(); };
  root.setPlug = (k) => { st.plug = clamp01(k); apply(); };
  root.setBands = (k) => { st.bands = clamp01(k); apply(); };
  root.getState = () => ({ ...st });
  root.userData.spec = { ...BATTERY_SPEC, connectorSide: sx > 0 ? 'left (+X)' : 'right (−X)', headerAt: [sx * H0.x, H0.y, H0.z] };
  root.userData.parts = { cell, pouch, label, pcm, kapton, tabs, wires, plug, header, bands };
  root.dispose = () => { for (const g of wireGeoms) g.dispose(); disposeTree(root, userMats); for (const m of own) m.dispose?.(); tex.dispose(); header.dispose?.(); };
  apply();
  return root;
}

/** JST SH 3-pin side-entry header (SM03B-SRSS-TB class, representative). Origin: PCB top at the footprint
 *  centre; mating opening toward −X; body 4.25 deep along X. */
export function buildJstShHeader(opts = {}) {
  const M = opts.materials && opts._inner ? opts.materials : partMaterials(opts.materials);
  const own = opts._inner ? new Set() : new Set(Object.values(M));
  const g = new THREE.Group(); g.name = 'JstShHeader';
  const D = 4.25, Wb = 5.0, Hb = 3.0;
  // shell: outer rounded rect with the plug opening, extruded along X
  const sh = roundedRectShape(Wb, Hb, 0.25);
  sh.holes.push(roundedRectPath(4.12, 2.42, 0.15, 0, -0.08));
  const sg = extrude(sh, { depth: D - 0.7, front: { r: 0.12, s: 2 }, curveSegments: 6 });
  sg.rotateY(-Math.PI / 2);                 // shape (x, y) → (Z = x, Y = y), extrusion e → −X
  sg.translate(D / 2 - 0.7, Hb / 2, 0);     // X ∈ [−D/2, D/2 − 0.7]; mating face at −X
  g.add(meshOf(sg, M.nylon, 'headerShell'));
  const back = extrude(roundedRectShape(Wb, Hb, 0.25), { depth: 0.7, back: { r: 0.12, s: 2 } });
  back.rotateY(-Math.PI / 2); back.translate(D / 2 + 0.0 - (D - 0.7) + (D - 0.7), Hb / 2, 0);
  const bm = meshOf(back, M.nylon, 'headerBack'); bm.position.x = 0.0; g.add(bm);
  // contacts (gold) inside the opening + solder legs at the back
  for (const z of [-1, 0, 1]) {
    const pin = extrude(roundedRectShape(0.3, 0.16, 0.05), { depth: 3.4, front: { r: 0.06, s: 1 } });
    pin.rotateY(-Math.PI / 2); pin.translate(D / 2 - 0.2, Hb / 2 - 0.1, z);
    g.add(meshOf(pin, M.gold, 'contact'));
    const leg = sweep([[D / 2 - 0.4, Hb / 2 - 0.1, z], [D / 2 + 0.25, Hb / 2 - 0.1, z], [D / 2 + 0.35, Hb / 2 - 0.3, z], [D / 2 + 0.35, 0.05, z], [D / 2 + 0.9, 0.05, z]].map(p => new THREE.Vector3(...p)), rectSection(0.12, 0.3, 0.03), { up: [0, 1, 0] });
    g.add(meshOf(leg, M.tin, 'leg'));
  }
  // side mounting tabs (tin-plated brass): vertical plate against the housing + foot on the board
  for (const s of [-1, 1]) {
    const v = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.2, 0.15), M.tin); v.position.set(-0.2, 1.2, s * (Wb / 2 + 0.08)); v.name = 'mountTab';
    const f = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.15, 0.9), M.tin); f.position.set(-0.2, 0.075, s * (Wb / 2 + 0.5)); f.name = 'mountFoot';
    for (const m of [v, f]) { m.castShadow = m.receiveShadow = true; g.add(m); }
  }
  g.userData.spec = { connector: 'JST SH side-entry, 3 circuits (representative)', body: [D, Hb, Wb] };
  g.dispose = () => { disposeTree(g); for (const m of own) m.dispose?.(); };
  return g;
}

function jstPlug(M) {
  const g = new THREE.Group(); g.name = 'jstPlug';
  const Lp = 4.25, Wp = 4.0, Hp = 2.3;
  const sh = roundedRectShape(Wp, Hp, 0.2);
  for (const z of [-1, 0, 1]) sh.holes.push(roundedRectPath(0.62, 0.95, 0.08, z, 0.1));
  const hg = extrude(sh, { depth: Lp, front: { r: 0.1, s: 2 }, back: { r: 0.14, s: 3 }, curveSegments: 6 });
  hg.rotateY(Math.PI / 2);               // e → +X: mating face (front) at +X, wire entry at −X
  hg.translate(-Lp / 2, 0, 0);
  g.add(meshOf(hg, M.nylon, 'plugHousing'));
  for (const z of [-1, 0, 1]) {
    const c = extrude(roundedRectShape(0.42, 0.62, 0.06), { depth: 2.4, front: { r: 0.05, s: 1 } });
    c.rotateY(Math.PI / 2); c.translate(-0.7, 0.1, z);
    g.add(meshOf(c, M.goldSatin, 'crimp'));
  }
  // latch ramp on top
  const r = extrude(roundedRectShape(1.6, 0.3, 0.08), { depth: 1.4, front: { r: 0.08, s: 2 } });
  r.rotateY(Math.PI / 2); r.translate(-1.6, Hp / 2 + 0.12, 0);
  g.add(meshOf(r, M.nylon, 'plugRamp'));
  return { group: g, length: Lp };
}

/** Closed silicone band around the cell cross-section (inner w × h), section t × b (thickness × width). */
function bandGeometry(w, h, t, b) {
  const pts = [], rc = 1.3, n = 10;
  const cx = w / 2 - rc, cyT = h - rc, cyB = rc;
  const corners = [[cx, cyT, 0], [-cx, cyT, Math.PI / 2], [-cx, cyB, Math.PI], [cx, cyB, Math.PI * 1.5]];
  const R = rc + t / 2;
  for (const [x, y, a0] of corners) for (let i = 0; i <= n; i++) { const a = a0 + (Math.PI / 2) * i / n; pts.push(new THREE.Vector3(x + R * Math.cos(a), y + R * Math.sin(a), 0)); }
  pts.push(pts[0].clone(), pts[1].clone());
  return sweep(pts, rectSection(b, t, 0.22, 3), { up: [0, 0, 1], caps: false, crease: 50 });
}

/** Three strands twisted around a Bézier centreline (pitch in mm per full twist). */
function twistedStrands(curve, n, r, pitch, samples, fan, fanLen = 0.1) {
  const L = curve.getLength();
  const frames = curve.computeFrenetFrames(samples, false);
  const out = Array.from({ length: n }, () => []);
  for (let i = 0; i <= samples; i++) {
    const u = i / samples, p = curve.getPointAt(u);
    const N = frames.normals[i], B = frames.binormals[i];
    const f = fan ? smooth(1 - fanLen, 1, u) : 0;
    for (let k = 0; k < n; k++) {
      const a = (u * L / pitch) * Math.PI * 2 + k * Math.PI * 2 / n;
      const q = p.clone().addScaledVector(N, r * Math.cos(a)).addScaledVector(B, r * Math.sin(a));
      if (f > 0) q.lerp(fan[k].clone().add(p).sub(curve.getPointAt(1)), f);
      out[k].push(q);
    }
  }
  return out;
}

function labelTexture(o) {
  const c = document.createElement('canvas'); c.width = 1440; c.height = 1024;
  const x = c.getContext('2d');
  x.fillStyle = '#0f1011'; x.fillRect(0, 0, c.width, c.height);
  // accent stripe (XBAB yellow)
  x.fillStyle = '#fdc316'; x.fillRect(0, c.height - 30, c.width, 30);
  x.fillStyle = '#f2f1ec';
  const F = (w, s) => `${w} ${s}px Inter, "Helvetica Neue", Arial, sans-serif`;
  x.textBaseline = 'alphabetic';
  x.font = F(800, 96); x.fillText('LITHIUM', 96, 260);
  x.fillText('POLYMER', 96, 370);
  x.font = F(500, 50); x.fillStyle = '#cfcdc6';
  x.fillText(o.labelLine1 || '3.7 V  ·  250 mAh  ·  0.93 Wh', 96, 500);
  x.fillText(o.labelLine2 || 'Li-Po 502030  ·  PCM  ·  NTC', 96, 570);
  if (o.weight) { x.font = F(700, 70); x.fillStyle = '#fdc316'; x.fillText(o.weight, 96, 700); }
  x.fillStyle = '#6d6c68'; x.font = F(600, 40);
  x.fillText('THESEUS', 96, 900);
  x.strokeStyle = '#3a3b3e'; x.lineWidth = 3; x.strokeRect(1100, 840, 230, 80);
  x.font = F(600, 36); x.fillStyle = '#9a9890'; x.fillText('+  NTC  −', 1122, 893);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  // the plane is rotated −90° about X: canvas up → −Z (toward the back). Rotate so text reads from the +X side.
  t.center.set(0.5, 0.5); t.rotation = -Math.PI / 2;   // text runs along +Z, letter tops toward +X
  return t;
}
