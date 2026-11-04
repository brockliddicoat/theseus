/* ============================== shell and structure, part C: the board as structure, and the mass near the fingers ==============================
   Brock's notes (2026-11-04): using the board as a reinforcement wasn't demonstrated enough: how strong FR4 is against
   magnesium alloy, why you draw on every resource you have, how mice reinforce with small FR4 arms that snap, and how
   Theseus uses THE WHOLE board (one board, about 5.6 g); and the mass slide, rebuilt as an argument you can feel.
     shlPcbRib   FR4 vs magnesium alloy (rebuilds the old shlPcbRib and keeps its id)                     #94
     shcCarry    Use the mass you already carry                                                           #94
     shcArms     Small FR4 arms vs the whole board: 2D frames solved here, and the meter's 'board' step   #94 #91
     mass        Moment of inertia about the fingertips (rebuilds the old mass and keeps its id)           #95
     shcLow      A low centre of mass                                                                     #95 #40
   Every simulated number is derived here with 07-sim.js, and each slide names its model in a line.
   Colours are tokens only: C.hero is Theseus, C.second the next best, C.bad a problem (the arm that snaps), heatCol stress. */

Object.assign(SRC, {
  shcAz91: { t: 'MatWeb data sheet, magnesium AZ91D-F as cast (data from Starmet), as hosted by TEKO: 1.81 g/cm³, 230 MPa ultimate tensile, 150 MPa yield, 44.8 GPa in tension', u: 'https://www.tekogehause.de/uploads/manuali/materiali/AZ91D.pdf' },
  shcFr4Flex: { t: 'The Gund Company, NEMA FR4 typical values: flexural strength 552 MPa lengthwise and 483 MPa crosswise (ASTM D790, 1.6 mm), tensile 430 MPa lengthwise (ASTM D638), 1.85 g/cm³', u: 'https://thegundcompany.com/wp-content/uploads/2024/03/NEMA-FR4-Glass-Epoxy-Laminate-by-The-Gund-Co.pdf' },
  shcTpuHati: { t: 'TechPowerUp, G-Wolves Hati-S Plus 4K review, 28 Mar 2023: "Everything else sits on the main PCB, which has been extended at the sides to help with shell rigidity"; "All PCBs are very thin to save as much weight as possible"; four screws hold it to the bottom shell', u: 'https://www.techpowerup.com/review/g-wolves-hati-s-plus-4k/4.html' },
  shcTpuHatiR: { t: 'TechPowerUp, G-Wolves Hati-R 8K review, 31 Oct 2024: "The very thin main PCB is affixed to the bottom with four screws, and has been extended such that it supports structural rigidity of the shell"', u: 'https://www.techpowerup.com/review/g-wolves-hati-r-8k/4.html' },
  shcBrock: { t: 'Brock Liddicoat, review notes, 4 Nov 2026: one board of about 5.6 g; many mice reinforce with small arms of FR4 that are "easy to break off or snap under force"; "All G Wolves mice, I even had the arms on an HTS Ultra break during shipping once"; in engineering, draw on all the resources you have', u: '', n: 'his own account and figures' },
  shcBoardFE: { t: 'This deck, 2D frames solved in the page (07-sim.js): the shell at board height seen from above (the Sora outline; its CF-PP rim and lower wall as one 4.0 × 3.6 mm beam, 13.5 GPa), the board in 1.0 mm FR4 (19 GPa) as a plate-equivalent truss 9 mm inside the rim, joined by four 4 mm FR4 arms at the screw-boss rows or by 16 CF-PP rib feet at the study\'s arch rows; a transverse arch (the wall and one arch rib per 9.8 mm, as an equivalent section) under its 7.5 N share of a 10 N crown press, its feet held by the plan frame; the arm alone, edge on, as a fixed-guided FR4 beam', n: 'derived, this model' },
  shcMassModel: { t: 'This deck, mass model: 29.31 g in all; the board, 5.6 g, at its place on the base; a 7.5 g pack of the 250 mAh, 5 × 20 × 30 mm class (Jauch LP502030JH) either low and forward on the board or high and back in the hump; the other 16.21 g spread evenly over the shell\'s surface (Brock\'s Sora scan); the fingertips 7.5 mm ahead of centre, between the side buttons, and 11 mm up', n: 'derived, this model' }
});

/* ---------- small geometry, in the shell study's frame: x across (+ = the user's left), y up, z forward (mm) ---------- */
const SHC = {
  rows: [-31.65, -20.43, -10.64, -0.77, 9.17, 19.25, 29.76, 41.16],   /* the study shell's arch rows, where its side ribs meet the board (3d/lattice) */
  armRows: [-31.65, 9.17],                                              /* small arms at the screw-boss rows, as boards are usually screwed */
  crown: -13.09,                                                        /* the study's crown press point */
  share: { '-20.43': 0.25, '-10.64': 0.75 },                            /* a 10 N crown press splits between the arches either side, by the lever rule */
  ring: { w: 4.0, h: 3.6 }, ringIn: 2.1, boardIn: 9.2, boardZ: [-36, 54], lat: 5,
  primed: new Set(), cache: {}
};
/** the Sora's top outline (closed, as SORA_HALF in 03-parts.js gives it): [x, z] */
function shcOutline() { return SHC.out || (SHC.out = SORA_HALF.map(p => [p[0], p[1]]).concat(SORA_HALF.slice(1, -1).reverse().map(p => [-p[0], p[1]]))); }
/** the polygon moved inward by d (mm), along each vertex's normal */
function shcInset(P, d) {
  const n = P.length; let A = 0; for (let i = 0; i < n; i++) { const p = P[i], q = P[(i + 1) % n]; A += p[0] * q[1] - q[0] * p[1]; }
  const s = A > 0 ? 1 : -1;
  return P.map((p, i) => { const a = P[(i - 1 + n) % n], b = P[(i + 1) % n]; let tx = b[0] - a[0], ty = b[1] - a[1]; const L = Math.hypot(tx, ty) || 1; tx /= L; ty /= L; return [p[0] - ty * s * d, p[1] + tx * s * d]; });
}
/** n points evenly spaced along a closed polygon */
function shcResample(P, n) {
  const L = [0]; for (let i = 1; i <= P.length; i++) { const a = P[i - 1], b = P[i % P.length]; L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const T = L[L.length - 1], out = []; let j = 0;
  for (let k = 0; k < n; k++) { const s = k * T / n; while (L[j + 1] < s) j++; const a = P[j], b = P[(j + 1) % P.length], f = (s - L[j]) / Math.max(1e-9, L[j + 1] - L[j]); out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]); }
  return out;
}
function shcInside(P, x, y) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; }
/** the board's outline: the Sora outline 9.2 mm in, cut at the study board's front and back */
function shcBoardOutline() {
  if (SHC.bout) return SHC.bout;
  const B = shcInset(shcResample(shcOutline(), 240), SHC.boardIn), [z0, z1] = SHC.boardZ, out = [];
  for (let i = 0; i < B.length; i++) { const p = B[i], q = B[(i + 1) % B.length]; const pin = p[1] >= z0 && p[1] <= z1; if (pin) out.push(p); for (const zc of [z0, z1]) if ((p[1] - zc) * (q[1] - zc) < 0) { const f = (zc - p[1]) / (q[1] - p[1]); out.push([p[0] + (q[0] - p[0]) * f, zc]); } }
  return (SHC.bout = out);
}

/* ---------- the board in the shell, seen from above: 'none' (left out), 'arms' (four small FR4 arms), 'whole' (tied by every rib) ----------
   The rim at board height is a closed ring of CF-PP beams (the 4.2 × 1.2 mm flange with the lower wall, as one 4.0 × 3.6 mm
   section). The board is a 1.0 mm FR4 plate, modelled as a pin-jointed triangle lattice whose bars give the plate's in-plane
   stiffness (area 0.866 · s · t for a lattice of pitch s). The press on the crown reaches the rim as the arches' outward
   thrust at their feet, on the rows either side of the press; every member's stress is in MPa per newton of that pattern. */
function shcPlan(kind) {
  const nodes = [], els = [], rowNode = {}, pp = SIM_MAT.ppcf, fr = SIM_MAT.fr4;
  const R = shcInset(shcResample(shcOutline(), 72), SHC.ringIn);
  for (const z of SHC.rows) for (const sd of [1, -1]) {
    let bi = -1, bd = 1e9; R.forEach((p, i) => { if (Math.sign(p[0]) !== sd) return; const d = Math.abs(p[1] - z); if (d < bd) { bd = d; bi = i; } });
    /* move that ring node onto the row, at the ring's half-width there */
    const a = R[(bi - 1 + R.length) % R.length], b = R[(bi + 1) % R.length], hw = Math.abs(lerp(a[0], b[0], clamp((z - a[1]) / ((b[1] - a[1]) || 1e-9))));
    R[bi] = [sd * (Math.abs(R[bi][0]) * 0.5 + hw * 0.5), z]; rowNode[z + ':' + sd] = bi;
  }
  R.forEach(p => nodes.push(p));
  for (let i = 0; i < R.length; i++) els.push({ i, j: (i + 1) % R.length, w: SHC.ring.w, h: SHC.ring.h, E: pp.E, rho: pp.rho, part: 'ring' });
  let tail = 0, nose = 0; R.forEach((p, i) => { if (p[1] < R[tail][1]) tail = i; if (p[1] > R[nose][1]) nose = i; });
  const m = { nodes, els, fix: { [tail]: 'xy', [nose]: 'x' }, loads: {}, rowNode, nRing: R.length, links: [], board: [], kind };
  if (kind !== 'none') {
    const B = shcBoardOutline(), s = SHC.lat, L = feLattice('tri', -40, -40, 80, 100, s, { w: 1.0, h: 0.866 * s, E: fr.E, rho: fr.rho / 3, truss: true, part: 'board' });
    const keep = L.nodes.map(p => shcInside(B, p[0], p[1])), map = new Map();
    L.nodes.forEach((p, i) => { if (keep[i]) { map.set(i, nodes.length); m.board.push(nodes.length); nodes.push(p); } });
    L.els.forEach(e => { if (keep[e.i] && keep[e.j]) els.push(Object.assign({}, e, { i: map.get(e.i), j: map.get(e.j) })); });
    const zs = kind === 'arms' ? SHC.armRows : SHC.rows;
    for (const z of zs) for (const sd of [1, -1]) {
      const ri = rowNode[z + ':' + sd];
      let bi = -1, bx = -1; for (const k of m.board) { const q = nodes[k]; if (Math.abs(q[1] - z) < s * 0.62 && Math.sign(q[0]) === sd && Math.abs(q[0]) > bx) { bx = Math.abs(q[0]); bi = k; } }
      const sec = kind === 'arms' ? { w: 1.0, h: 4.0, E: fr.E, rho: fr.rho, part: 'arm' } : { w: 1.1, h: 1.2, E: pp.E, rho: pp.rho, part: 'rib' };
      m.links.push({ e: els.length, z, sd, board: bi, ring: ri }); els.push(Object.assign({ i: bi, j: ri }, sec));
    }
  }
  for (const [z, h] of Object.entries(SHC.share)) for (const sd of [1, -1]) m.loads[rowNode[z + ':' + sd]] = [sd * h, 0, 0];
  return m;
}
/** a transverse arch at the press: the wall and its arch rib over one 9.8 mm bay, as an equivalent section (same area and
   bending stiffness), 0.9 mm wall and a 1.0 × 2.0 mm rib at the crown, 1.2 mm and 1.2 × 1.1 mm at the foot (the study's
   grading); feet on the pad, the right one free to slide; a tie of stiffness k (N/mm) between the feet; P down at the crown */
function shcArchModel(k, P = 7.5) {
  const N = 48, a = 27.28, b = 32.0, nodes = [], els = [], pp = SIM_MAT.ppcf;
  for (let i = 0; i <= N; i++) { const th = Math.PI * (1 - i / N), c = Math.cos(th), s = Math.sin(th); nodes.push([a * Math.sign(c) * Math.pow(Math.abs(c), 0.6), b * Math.pow(s, 0.7)]); }
  for (let i = 0; i < N; i++) {
    const f = clamp((nodes[i][1] + nodes[i + 1][1]) / 2 / b), tw = lerp(1.2, 0.9, f), rw = lerp(1.2, 1.0, f), rh = lerp(1.1, 2.0, f), sp = 9.8;
    const A1 = sp * tw, A2 = rw * rh, yb = (A1 * tw / 2 + A2 * (tw + rh / 2)) / (A1 + A2), I = sp * tw ** 3 / 12 + A1 * (tw / 2 - yb) ** 2 + rw * rh ** 3 / 12 + A2 * (tw + rh / 2 - yb) ** 2, A = A1 + A2, h = Math.sqrt(12 * I / A);
    els.push({ i, j: i + 1, w: A / h, h, E: pp.E, rho: pp.rho, part: 'arch' });
  }
  if (k > 0) els.push({ i: 0, j: N, w: 1, h: 1, E: k * 2 * a, rho: 0, truss: true, part: 'tie' });
  return { nodes, els, fix: { 0: 'xy', [N]: 'y' }, loads: { [N / 2]: [0, -P, 0] }, crown: N / 2, N };
}
/** the arm alone, edge on: a 4 mm wide, 1.0 mm thick FR4 beam of length L, its root held by the board and its tip by the
   shell (it can move, not turn): 1 N at the tip, so the stress per millimetre of tip movement comes out */
function shcArmModel(L) {
  const n = 12, nodes = [], els = [], fr = SIM_MAT.fr4;
  for (let i = 0; i <= n; i++) nodes.push([L * i / n, 0]);
  for (let i = 0; i < n; i++) els.push({ i, j: i + 1, w: 4.0, h: 1.0, E: fr.E, rho: fr.rho, part: 'arm' });
  return { nodes, els, fix: { 0: 'xyr', [n]: 'xr' }, loads: { [n]: [0, 1, 0] }, n };
}
/** everything the board slides print, solved once */
function shcBoard() {
  if (SHC.res) return SHC.res;
  const C3 = {}, peak = (r, part, sc) => Math.max(0, ...r.model.els.map((e, q) => e.part === part ? r.sig[q] * sc : 0));
  for (const kind of ['none', 'arms', 'whole']) {
    const r = simSolve('shc-plan-' + kind, () => shcPlan(kind)), M = r.model;
    const iL = M.rowNode['-10.64:1'], iR = M.rowNode['-10.64:-1'], spread1 = r.d[iL * 3] - r.d[iR * 3], k = SHC.share['-10.64'] / spread1;
    const a = simSolve('shc-arch-' + kind, () => shcArchModel(k)), tie = a.model.els.findIndex(e => e.part === 'tie');
    const H = tie >= 0 ? a.N[tie] : 0, sc = H / SHC.share['-10.64'];   /* the plan frame's pattern, scaled to the arch's real thrust */
    const crown = -a.d[a.model.crown * 3 + 1], archS = peak(a, 'arch', 1);
    const c = { kind, r, a, k, H, sc, crown, spread: spread1 * sc, archS, ring: peak(r, 'ring', sc), board: peak(r, 'board', sc), arm: peak(r, 'arm', sc), rib: peak(r, 'rib', sc) };
    c.pp = Math.max(c.archS, c.ring, c.rib);                            /* the plastic shell's peak */
    c.fr4 = Math.max(c.board, c.arm);                                  /* the board's peak */
    if (kind === 'arms') { let best = -1, bs = -1; M.links.forEach((l, i) => { const s = r.sig[l.e]; if (s > bs) { bs = s; best = i; } }); c.hot = M.links[best]; c.armL = M.links.reduce((s, l) => s + r.L[l.e], 0) / M.links.length; }
    C3[kind] = c;
  }
  const none = C3.none, whole = C3.whole, arms = C3.arms;
  const armR = simSolve('shc-arm', () => shcArmModel(arms.armL)), tip = armR.d[armR.model.n * 3 + 1], perMM = armR.sig[0] / tip;
  const res = { cases: C3, flexF: whole.crown / none.crown, stressF: whole.pp / none.pp, armFlexF: arms.crown / none.crown,
    spreadArms: arms.spread / none.spread, spreadWhole: whole.spread / none.spread, armVsBoard: arms.arm / Math.max(whole.board, whole.rib),
    arm: { r: armR, L: arms.armL, perMM, snap: [483 / perMM, 552 / perMM] },
    smax: Math.max(none.ring, arms.ring, arms.arm, whole.ring, whole.rib, whole.board) };
  /* one exaggeration for all three, so they can be compared: the free rim's biggest move is 30 px at 1 px/mm */
  res.exag = 30 / Math.max(1e-6, none.r.dmax * none.sc);
  res.nmax = Math.max(...['none', 'arms', 'whole'].map(k => Math.max(...C3[k].r.N.map(v => Math.abs(v) * C3[k].sc))));
  return (SHC.res = res);
}
/* the shell meter's step for this slide (10-d-0-meter.js): the factors are read when the strip is drawn, so the solve runs once, then */
shellStep({ key: 'board', slide: 'shcArms', label: 'The whole board', get flex() { return shcBoard().flexF; }, get stress() { return shcBoard().stressF; }, ev: 'derived',
  how: '2D frames: a transverse arch under a 10 N crown press, its feet held by the board in plan (FR4 19 GPa, 1.0 mm; CF-PP rim 13.5 GPa)' });

/* ---------- 3D: the lattice study, with one unseen first render (it frames the scene and switches on local clipping before the cut) ---------- */
const SHC_DEF = { lattice: { cut: 0, build: 1, stress: 0, stressCase: 'press', compare: 'tri', filletZoom: 0 } };
function shc3D(key, t, x, y, w, h, st, o = {}) {
  const s = Object.assign({}, SHC_DEF[key] || {}, st), theme = o.theme || (TH ? 'paper' : 'night'), id = key + '|' + theme;
  if (!V2D.on && !SHC.primed.has(id) && typeof R3D !== 'undefined' && R3D.has(key) && R3D.ready(key, theme)) {
    const k = (APP.scale || 1) * (APP.dpr || 1) * (o.res || 1);
    try { R3D.render(key, t, Object.assign({}, s, key === 'lattice' ? { compare: 'tri' } : {}), Math.max(64, Math.round(w * k)), Math.max(36, Math.round(h * k)), theme); } catch (e) { }
    SHC.primed.add(id);
  }
  return view3D(key, t, x, y, w, h, s, o);
}
/** where a lattice point (mm) lands on that shot, in 2D or 3D (the camera rule of 3d/integration, framed on the single shell) */
function shcProj(st, box, p) {
  if (V2D.on) { const P2 = lattice2DProj(st, box); if (P2) return P2(p); }
  const V = { top: [0, 1, 0.0001], front: [0, 0.12, 1], left: [-1, 0.08, 0], right: [1, 0.08, 0], threeQuarter: [-0.78, 0.62, 0.95] };
  const nrm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  let d = nrm(Array.isArray(st.view) ? st.view : V[st.view || 'threeQuarter']);
  const yw = st.yaw || 0, cy = Math.cos(yw), sy = Math.sin(yw); d = [d[0] * cy + d[2] * sy, d[1], -d[0] * sy + d[2] * cy];
  const L0 = (typeof GEO2D !== 'undefined' && GEO2D.lattice) || { r: 69.83, center: [0, 19.075, -0.04] };
  const fov = st.fov || 22, T = st.target ? st.target.slice() : L0.center.slice();
  const asp = box[2] / box[3], dist = L0.r * 1.12 / Math.sin(fov / 2 * Math.PI / 180) / Math.min(1, asp) / (st.zoom || 1);
  const Cm = T.map((v, i) => v + d[i] * dist), up = Math.abs(d[1]) > 0.99 ? [0, 0, -Math.sign(d[1])] : [0, 1, 0];
  const f = nrm(T.map((v, i) => v - Cm[i])), r = nrm(cross(f, up)), u = cross(r, f), q = p.map((v, i) => v - Cm[i]), th = Math.tan(fov / 2 * Math.PI / 180), zc = dot(q, f);
  return [box[0] + (dot(q, r) / (zc * th * asp) + 1) / 2 * box[2], box[1] + (1 - dot(q, u) / (zc * th)) / 2 * box[3]];
}

/* ---------- drawing helpers ---------- */
/** a rounded value bar centred on y: solid to lo, translucent to hi. col: a colour or a gradient (array). returns the x of its end */
function shcBar(x, y, w, max, lo, hi, col, a, k, o = {}) {
  const h = o.h || 14, X = v => x + w * clamp(v / max), r = h / 2;
  if (o.track !== false) rr(x, y - h / 2, w, h, r, C.track, null, 0, a);
  const fill = Array.isArray(col) ? gradH(x, Math.max(2, w * clamp(hi / max)), col) : col;
  G.save();
  if (hi > lo) { G.globalAlpha = a * 0.36; rrPath(x, y - h / 2, Math.max(h, (X(hi) - x) * k), h, r); G.fillStyle = fill; G.fill(); }
  G.globalAlpha = a; rrPath(x, y - h / 2, Math.max(h, (X(lo) - x) * k), h, r); G.fillStyle = fill; G.fill();
  G.restore();
  return x + (X(hi) - x) * k;
}
/** a range as text: '160–220' or '430' */
const shcRange = (lo, hi, d = 0) => (Math.abs(hi - lo) < 0.5 * Math.pow(10, -d) ? fmtN(lo, d) : fmtN(lo, d) + '–' + fmtN(hi, d));
/** breaking length (km) of a strip that hangs from itself: σ / (ρ g), σ in MPa, ρ in g/cm³ */
const shcKm = (s, rho) => s * 1e6 / (rho * 1000 * 9.80665) / 1000;
/** the slide's tiles one after another (tileA when the shared helper is there) */
const shcTA = (t, t0, i) => typeof tileA === 'function' ? tileA(t, t0, i) : ep(t, t0 + i * 0.09, t0 + i * 0.09 + 0.55, E.snap);

/* ============================== 1. FR4 vs magnesium alloy (#94) ============================== */
const SHC_FR4 = { uts: 430, E: [18, 20], rho: 1.85 }, SHC_MG = { uts: [160, 220], E: 46, rho: 1.81 };
S({
  id: 'shlPcbRib', replaces: 'shlPcbRib', after: 'arches', ch: 'shell', theme: 'night', title: 'FR4 vs magnesium alloy', settle: 9.5, ideas: [94],
  src: ['shlFr4', 'shcFr4Flex', 'az91d', 'shcAz91', 'shlDoc'],
  draw: t => {
    header(t, 'FR4 vs magnesium alloy');
    captions(t, [[0.6, 'FR4, the glass and epoxy core of a circuit board, is stronger than the magnesium alloy in metal shells, and stronger again per gram.'], [5.2, 'It is under half as stiff. So I don\'t ask the board to bend: I load it in its plane, as a tie.']]);
    const y0 = LAY.top + 8, H0 = 960 - y0;
    /* ---- the big tile: strength per gram, as the length of a strip that hangs from itself ---- */
    { const [x, y, w, h] = [LM, y0, 1000, H0], a = shcTA(t, 0.25, 0);
      demoWindow(x, y, w, h, a, { hero: true });
      const hy = cardHead(t, 0.45, x, y, w, 'Strength per gram', ['derived']);
      text('How far a strip can hang from itself before it breaks: {L} = σ ÷ ρg.', x + 32, hy + 14, { role: 'small', size: 25, color: C.mute, alpha: ep(t, 0.8, 1.2), maxW: w - 64 });
      const kmF = shcKm(SHC_FR4.uts, SHC_FR4.rho), kmM = SHC_MG.uts.map(s => shcKm(s, SHC_MG.rho));
      const ceil = y + 186, pxk = 18.2, rate = 8.2, g0 = 1.3;            /* the ceiling, px per km, km per second while they grow */
      const grown = Math.max(0, (t - g0) * rate);
      /* the scale: km down the left */
      const ka = ep(t, 0.9, 1.4);
      for (const km of [0, 5, 10, 15, 20, 25]) { const yy = ceil + km * pxk; line(x + 92, yy, x + 470, yy, { color: C.hair, w: 1.2, alpha: ka }); text(km + (km ? '' : ' km'), x + 80, yy + 7, { role: 'tick', size: 19, color: C.faint, align: 'right', alpha: ka }); }
      line(x + 92, ceil, x + 470, ceil, { color: C.ink2, w: 3, alpha: ka });
      /* FR4: grows to its breaking length and holds */
      const cxF = x + 190, cxM = x + 360, sw = 58;
      const lenF = Math.min(kmF, grown), yF = ceil + lenF * pxk;
      if (lenF > 0) { G.save(); G.globalAlpha = a; rrPath(cxF - sw / 2, ceil, sw, Math.max(sw * 0.5, lenF * pxk), 10); G.fillStyle = C.hero; G.fill(); G.restore(); }
      /* magnesium: solid to its low figure, a lighter band to its high one, then it lets go */
      const brk = kmM[1], tb = g0 + brk / rate, lenM = Math.min(brk, grown), fall = Math.max(0, t - tb);
      if (lenM > 0) {
        G.save(); G.globalAlpha = a;
        rrPath(cxM - sw / 2, ceil, sw, Math.max(sw * 0.5, Math.min(lenM, kmM[0]) * pxk), 10); G.fillStyle = C.second; G.fill();
        if (lenM > kmM[0]) { G.globalAlpha = a * 0.42; G.fillRect(cxM - sw / 2, ceil + kmM[0] * pxk - 10, sw, (lenM - kmM[0]) * pxk + 10); }
        G.restore();
        /* the piece that breaks off falls away and fades */
        if (fall > 0) {
          const dy = 0.5 * 2600 * fall * fall, fa = clamp(1 - fall / 0.7), py = ceil + brk * pxk + 6 + dy;
          G.save(); G.globalAlpha = a * fa * 0.9; rrPath(cxM - sw / 2, py, sw, 3.2 * pxk, 10); G.fillStyle = C.second; G.fill(); G.restore();
          /* the break, jagged, in the problem colour */
          const yb = ceil + brk * pxk, kb = ep(t, tb, tb + 0.25);
          const pts = []; for (let i = 0; i <= 8; i++) pts.push([cxM - sw / 2 - 6 + (sw + 12) * i / 8, yb + (i % 2 ? 5 : -4)]);
          poly(pts, { color: C.bad, w: 3, alpha: a * kb });
        }
      }
      text('FR4', cxF, ceil - 18, { role: 'label', size: 21, color: C.heroText, align: 'center', alpha: ka });
      text('AZ91D', cxM, ceil - 18, { role: 'label', size: 21, color: C.secondText, align: 'center', alpha: ka });
      /* the numbers, in a column on the right */
      const nx = x + 540, kF = clamp(lenF / kmF), kM = clamp(lenM / brk);
      const r1 = rich([{ s: fmtN(kmF * kF, 1), role: 'd1', size: 132, color: C.heroText, grad: C.heroGrad, tnum: true }, { s: 'km', font: 'disp', size: 46, weight: 700, color: C.heroText, grad: C.heroGrad, gap: 12, caps: false }], nx, y + 330, { alpha: ep(t, g0, g0 + 0.4) });
      text('FR4, pulled along its weave: 430 MPa at 1.85 g/cm³', nx, y + 380, { role: 'small', size: 25, color: C.ink2, maxW: w - (nx - x) - 32, alpha: ep(t, g0 + 0.3, g0 + 0.7) });
      rich([{ s: fmtN(kmM[0] * Math.min(1, kM * brk / kmM[0]), 1), role: 'd1', size: 76, color: C.secondText, tnum: true }, kM * brk > kmM[0] ? { s: '–' + fmtN(Math.min(brk, kM * brk), 1), role: 'd1', size: 76, color: C.secondText, tnum: true, gap: 0 } : null, { s: 'km', font: 'disp', size: 32, weight: 700, color: C.secondText, gap: 10, caps: false }], nx, y + 500, { alpha: ep(t, g0, g0 + 0.4) });
      text('Magnesium AZ91D, die cast: 160 to 220 MPa at 1.81 g/cm³', nx, y + 544, { role: 'small', size: 25, color: C.ink2, maxW: w - (nx - x) - 32, alpha: ep(t, g0 + 0.3, g0 + 0.7) });
      const lo = kmF / kmM[1], hi = kmF / kmM[0], kr = ep(t, 4.4, 4.9);
      rule(nx, y + 590, x + w - 40, kr);
      rich([{ s: fmtN(lo, 1) + '–' + fmtN(hi, 1) + '×', font: 'disp', size: 54, weight: 800, color: C.ink, grad: C.heroGrad, tnum: true }, { s: 'the strength per gram', role: 'small', size: 25, weight: 600, color: C.ink2, gap: 18, caps: false }], nx, y + 650, { alpha: kr });
    }
    /* ---- right: strength, then stiffness and stiffness per gram, then the word ---- */
    const rx = LM + 1000 + 24, rw = RM - rx;
    { const [x, y, w, h] = [rx, y0, rw, 206], a = shcTA(t, 0.25, 1);
      demoWindow(x, y, w, h, a);
      const hy = cardHead(t, 0.6, x, y, w, 'Tensile strength, {MPa}', ['datasheet']);
      const bx = x + 140, bw = 290, k = ep(t, 1.5, 2.4, E.snap);
      [['FR4', SHC_FR4.uts, SHC_FR4.uts, C.hero, C.heroText], ['AZ91D', SHC_MG.uts[0], SHC_MG.uts[1], C.second, C.secondText]].forEach(([nm, lo, hi, col, tc], i) => {
        const yy = hy + 44 + i * 50;
        text(nm, x + 32, yy + 8, { role: 'label', size: 21, color: tc, alpha: a });
        const xe = shcBar(bx, yy, bw, 500, lo, hi, col, a, k);
        text(shcRange(lo, hi), xe + 12, yy + 9, { font: 'mono', size: 24, weight: 700, color: C.ink, alpha: clamp(k * 1.4 - 0.3) });
      });
      const kr = ep(t, 2.4, 2.8);
      rich([{ s: fmtN(SHC_FR4.uts / SHC_MG.uts[1], 1) + '–' + fmtN(SHC_FR4.uts / SHC_MG.uts[0], 1) + '×', font: 'disp', size: 50, weight: 800, color: C.heroText, grad: C.heroGrad, tnum: true }], x + w - 32, hy + 66, { align: 'right', alpha: kr });
      text('FR4 stronger', x + w - 32, hy + 102, { role: 'label', size: 20, color: C.heroText, align: 'right', alpha: kr });
    }
    { const [x, y, w, h] = [rx, y0 + 206 + 24, rw, 260], a = shcTA(t, 0.25, 2);
      demoWindow(x, y, w, h, a);
      const hy = cardHead(t, 0.7, x, y, w, 'Stiffness', ['datasheet', 'derived']);
      const bx = x + 140, bw = 290, rows = [['Modulus, {GPa}', SHC_FR4.E, SHC_MG.E, 50, 0], ['Per gram, {GPa ÷ g/cm³}', SHC_FR4.E.map(e => e / SHC_FR4.rho), SHC_MG.E / SHC_MG.rho, 30, 1]];
      rows.forEach(([lab, fr, mg, max, d], j) => {
        const yy = hy + 26 + j * 104, k = ep(t, 2.1 + j * 0.4, 2.9 + j * 0.4, E.snap), ka = ep(t, 1.9 + j * 0.4, 2.3 + j * 0.4);
        text(lab, x + 32, yy, { role: 'label', size: 19, color: C.mute, alpha: ka });
        [['FR4', fr[0], fr[1], C.hero, C.heroText], ['AZ91D', mg, mg, C.second, C.secondText]].forEach(([nm, lo, hi, col, tc], i) => {
          const yb = yy + 30 + i * 34;
          text(nm, x + 32, yb + 8, { role: 'label', size: 19, color: tc, alpha: ka });
          const xe = shcBar(bx, yb, bw, max, lo, hi, col, ka, k, { h: 12 });
          text(shcRange(lo, hi, d), xe + 12, yb + 8, { font: 'mono', size: 22, weight: 700, color: C.ink, alpha: clamp(k * 1.4 - 0.3) });
        });
      });
      const kr = ep(t, 3.3, 3.7), lo = SHC_MG.E / SHC_FR4.E[1], hi = SHC_MG.E / SHC_FR4.E[0];
      rich([{ s: fmtN(lo, 1) + '–' + fmtN(hi, 1) + '×', font: 'disp', size: 50, weight: 800, color: C.secondText, tnum: true }], x + w - 32, hy + 106, { align: 'right', alpha: kr });
      text('Magnesium stiffer', x + w - 32, hy + 142, { role: 'label', size: 20, color: C.secondText, align: 'right', alpha: kr });
    }
    { const y = y0 + 206 + 24 + 260 + 24;
      glossBox(t, 5.6, rx, y, rw, 'Tie', 'A member that holds two points together by pulling, like a bowstring. Pulled, every fibre of the board works, and its low stiffness barely matters.', { h: 960 - y });
    }
    source(t, 'Gund NEMA FR4 sheet: 430 MPa tensile along the weave, 18 to 20 GPa flexural, 1.85 g/cm³. AZ91D: makeitfrom (160 to 220 MPa, 46 GPa), MatWeb (1.81 g/cm³).', { t0: 1.2 });
  }
});

/* ============================== 2. use the mass you already carry (#94) ==============================
   Theseus's 29.31 g as one square per gram: the board (5.6 g, Brock's figure), the battery (a 7.5 g, 250 mAh pack), and
   everything else (derived). The board's squares move from carried to structure; nothing is added. */
const SHC_MASS = { total: THESEUS.mass, board: THESEUS.pcb, batt: 7.5 };
SHC_MASS.rest = +(SHC_MASS.total - SHC_MASS.board - SHC_MASS.batt).toFixed(2);
/** one square of the waffle: i = its gram, f = how much of it is filled (the last gram is 0.31), col = fill */
function shcSquare(x, y, s, f, fill, a, o = {}) {
  if (a <= 0.003 || f <= 0) return;
  G.save(); G.globalAlpha = a;
  rrPath(x, y, s, s, s * 0.22); G.clip();
  G.fillStyle = o.track || C.track; G.fillRect(x, y, s, s);
  G.fillStyle = fill; G.fillRect(x, y, s * f, s);
  if (o.lattice) {
    /* a triangle lattice laid over the board's squares: they are structure now */
    G.globalAlpha = a * o.lattice; G.strokeStyle = TH ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.4)'; G.lineWidth = 1.4; G.beginPath();
    const p = s / 3;
    for (let k = -3; k <= 6; k++) { G.moveTo(x + k * p, y); G.lineTo(x + k * p + s * 0.577, y + s); G.moveTo(x + k * p, y + s); G.lineTo(x + k * p + s * 0.577, y); }
    for (let k = 1; k < 3; k++) { G.moveTo(x, y + k * s / 3); G.lineTo(x + s, y + k * s / 3); }
    G.stroke();
  }
  G.restore();
}
S({
  id: 'shcCarry', after: 'shlPcbRib', ch: 'shell', theme: 'paper', title: 'Use the mass you already carry', settle: 9.5, ideas: [94],
  src: ['shcBrock', 'exJauch', 'shlDoc', 'shlLattice'], three: ['lattice'],
  draw: t => {
    header(t, 'Use the mass you already carry');
    captions(t, [[0.6, 'Every Theseus carries one board of about 5.6 g. Its mass is fixed, so the only question is whether it does any work.'], [4.8, 'In engineering you draw on every resource you have. Tie the side ribs to the board, and the same grams carry load.']]);
    const y0 = LAY.top + 8, H0 = 960 - y0, M = SHC_MASS;
    /* ---- left: the budget, one square per gram ---- */
    { const [x, y, w, h] = [LM, y0, 1040, H0], a = shcTA(t, 0.25, 0);
      demoWindow(x, y, w, h, a);
      const hy = cardHead(t, 0.45, x, y, w, 'Theseus, ' + THS.massG + ', one square per gram', [{ ev: 'estimate', by: 'Brock' }, 'datasheet', 'derived']);
      const s = 74, gp = 12, cols = 10, gx = x + 48, gy = hy + 70, mv = ep(t, 3.4, 4.6, E.cam);
      for (let i = 0; i < 30; i++) {
        const c = i % cols, rw = Math.floor(i / cols), sx = gx + c * (s + gp), sy = gy + rw * (s + gp + 4);
        const ka = ep(t, 0.8 + i * 0.035, 1.2 + i * 0.035, E.snap), dy = (1 - ka) * 16, f = clamp(M.total - i);
        if (f <= 0 || ka <= 0.003) continue;
        /* what this gram holds: the board, the battery or the rest (the 6th square is part board, part battery) */
        const part = g => g < M.board ? 'board' : g < M.board + M.batt ? 'batt' : 'rest';
        const segs = []; let gg = i; while (gg < Math.min(i + 1, M.total) - 1e-9) { const pt = part(gg), end = Math.min(i + 1, M.total, pt === 'board' ? M.board : pt === 'batt' ? M.board + M.batt : 1e9); segs.push([pt, gg - i, end - i]); gg = end; }
        const kf = ep(t, 3.4 + i * 0.09, 3.9 + i * 0.09, E.snap);
        G.save(); G.globalAlpha = a * ka; rrPath(sx, sy + dy, s, s, s * 0.22); G.clip(); G.fillStyle = C.track; G.fillRect(sx, sy + dy, s, s);
        for (const [pt, u0, u1] of segs) {
          G.globalAlpha = a * ka; G.fillStyle = pt === 'rest' ? C.comp2 : C.comp; G.fillRect(sx + s * u0, sy + dy, s * (u1 - u0), s);
          if (pt === 'board' && kf > 0) { G.globalAlpha = a * ka * kf; G.fillStyle = C.hero; G.fillRect(sx + s * u0, sy + dy, s * (u1 - u0), s); }
        }
        G.restore();
        if (segs[0][0] === 'board' && kf > 0) shcSquare(sx, sy + dy, s, Math.min(1, M.board - i), 'rgba(0,0,0,0)', a * ka, { lattice: kf, track: 'rgba(0,0,0,0)' });
      }
      /* the three groups, under the squares */
      const ly = gy + 3 * (s + gp + 4) + 44, kl = ep(t, 2.0, 2.4);
      const items = [['Board', THS.pcb, { ev: 'estimate', by: 'Brock' }, mv > 0.5 ? 'Structure now' : 'Carried'], ['Battery, 250 mAh', fmtN(M.batt, 1) + ' g', { ev: 'datasheet', by: 'Jauch' }, 'Carried'], ['Shell, buttons, wheel, skates, screws', fmtN(M.rest, 2) + ' g', { ev: 'derived' }, '']];
      items.forEach(([nm, g, ev, st], i) => {
        const xx = gx + [0, 330, 640][i], k = ep(t, 2.0 + i * 0.15, 2.4 + i * 0.15);
        if (i === 0) heroTag(xx, ly, nm, g, { a: k }); else ltag(xx, ly, nm, g, { a: k, color: C.mute, vcolor: C.ink2 });
        pill(xx, ly + 34, ev.ev, k, { by: ev.by });
        if (st) text(st, xx, ly + 70, { role: 'label', size: 20, color: i === 0 && mv > 0.5 ? C.heroText : C.faint, alpha: k });
      });
      /* the stat: what the move is worth */
      const ks = ep(t, 4.6, 5.2), sy = y + h - 60;
      rich([{ s: fmtN(M.board / M.total * 100, 0), role: 'd1', size: 120, color: C.heroText, grad: C.heroGrad, tnum: true, count: [4.6, 1.0] }, { s: '%', font: 'disp', size: 56, weight: 800, color: C.heroText, grad: C.heroGrad, gap: 6, caps: false }], gx, sy, { t, alpha: ks });
      text('of the mouse goes from riding along to carrying load.', gx + 250, sy - 50, { role: 'small', size: 26, weight: 600, color: C.ink2, maxW: 520, alpha: ks });
      text('Mass added: 0 g.', gx + 250, sy - 6, { role: 'small', size: 26, weight: 600, color: C.heroText, alpha: ep(t, 5.0, 5.4) });
    }
    /* ---- right: where the ribs land on the board (the study shell, cut) ---- */
    const rx = LM + 1040 + 24, rw = RM - rx;
    { const [x, y, w, h] = [rx, y0, rw, 440], a = shcTA(t, 0.25, 1);
      demoWindow(x, y, w, h, a);
      text('Side ribs landing on the board', x + 32, y + 52, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 0.6, 1.0) });
      const bx = x + 8, by = y + 70, bw = w - 16, bh = h - 78;
      const st = { view: [-0.75, 0.55, -0.25], target: in2D([0, 9, 9], [24, 9, 12]), cut: 1, zoom: lerp(in2D(2.9, 3.3), in2D(3.4, 4.0), ep(t, 0.4, 9, E.io3)), yaw: 0.05 * Math.sin(t * 0.35) };
      clipped(bx, by, bw, bh, () => shc3D('lattice', t, bx, by, bw, bh, st, { alpha: ep(t, 0.5, 1.1) }));
      /* the ties, lit one after another along the board's edge once it becomes structure */
      const ties = [[25.24, 5.3, 9.17], [25.87, 5.3, -0.77], [25.14, 5.3, 19.25], [27.28, 5.3, -10.64], [25.34, 5.3, 29.76], [28.54, 5.3, -20.43], [25.1, 5.3, 41.16]];
      ties.forEach((p, i) => {
        const q = shcProj(st, [bx, by, bw, bh], p), k = ep(t, 3.6 + i * 0.12, 4.0 + i * 0.12, E.snap);
        if (q[0] < bx + 10 || q[0] > bx + bw - 10 || q[1] < by + 10 || q[1] > by + bh - 10) return;
        circle(q[0], q[1], 6 * k, { fill: C.hero, alpha: 0.95 * a }); circle(q[0], q[1], 6 + 14 * k, { color: C.hero, w: 2, alpha: (1 - k) * 0.8 + 0.25 });
      });
      const pT = shcProj(st, [bx, by, bw, bh], ties[0]), pB = shcProj(st, [bx, by, bw, bh], [14, 4.5, 14]);
      callout(t, 4.4, pT, 'Rib meets the board', { to: [Math.min(bx + bw - 250, pT[0] + 90), by + 50], side: 'r', color: C.hero, tcolor: C.ink });
      callout(t, 5.0, pB, 'The board, 1.0 mm FR4', { to: [Math.max(bx + 30, pB[0] - 40), by + bh - 34], side: 'r', color: C.ink, tcolor: C.ink });
    }
    { const y = y0 + 440 + 24;
      sourceBox(t, 1.4, rx, y, rw, 'Brock, #94', 'The weight of the PCB is non-negotiable, so you may as well take advantage of it.', { h: 960 - y });
    }
  }
});

/* ============================== 3. small FR4 arms vs the whole board (#94, #91) ==============================
   Three ways to hold the arches' feet, under the same press: the rim alone (the board left out), four small FR4 arms to the
   screw bosses (how many mice reinforce: G-Wolves extends its boards at the sides), and the whole board tied by every side
   rib. Seen from above at board height; the arch's thrust comes from the transverse model; one exaggeration for all three. */
const SHC_CASES = [
  { kind: 'none', name: 'Board left out', sub: 'Only the rim holds the arches' },
  { kind: 'arms', name: 'Four small arms', sub: 'FR4 arms to the screw bosses' },
  { kind: 'whole', name: 'The whole board', sub: 'Tied by every side rib', hero: true }
];
/** one case from above. c = shcBoard().cases[kind]; (cx, cy) = where the shell's centre lands, s = px per mm;
   o = { k (0..1 of the press), a, crack (0..1) }. returns { P, root } (root: the hot arm's root on the stage, for the lens) */
function shcPlanDraw(t, c, cx, cy, s, o) {
  const R = shcBoard(), r = c.r, M = r.model, k = o.k * c.sc, a = o.a, exag = 26 / (R.cases.none.r.dmax * R.cases.none.sc * s);
  const P = p => [cx - p[0] * s, cy - p[1] * s], out = { P };
  if (a <= 0.003) return out;
  /* the shell from above, quietly */
  G.save(); G.globalAlpha = a; G.beginPath(); shcOutline().forEach((p, i) => { const q = P(p); i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); }); G.closePath();
  G.fillStyle = inkA(TH ? 0.03 : 0.04); G.fill(); G.strokeStyle = inkA(TH ? 0.14 : 0.16); G.lineWidth = 1.5; G.stroke(); G.restore();
  /* the board's outline: dashed when it is left out of the structure */
  const B = shcBoardOutline(), tracePath = () => { G.beginPath(); B.forEach((p, i) => { const q = P(p); i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); }); G.closePath(); };
  G.save(); G.globalAlpha = a; tracePath();
  if (c.kind === 'none') { G.setLineDash([7, 6]); G.strokeStyle = inkA(0.32); G.lineWidth = 1.5; G.stroke(); G.setLineDash([]); }
  else { G.fillStyle = c.kind === 'whole' ? C.heroSoft : inkA(TH ? 0.05 : 0.06); G.fill(); G.strokeStyle = c.kind === 'whole' ? rgba(C.hero, 0.55) : inkA(0.28); G.lineWidth = 1.5; G.stroke(); }
  G.restore();
  if (c.kind === 'none') { const q = P([0, 9]); text('Board, carried', q[0], q[1] + 8, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: a }); }
  const only = part => e => M.els[e].part !== part, base = { load: k, scale: exag, smax: R.smax, alpha: a };
  if (c.kind !== 'none') feDraw(r, P, Object.assign({}, base, { hide: only('board'), wpx: 1.4, alpha: a * 0.8 }));
  feDraw(r, P, Object.assign({}, base, { hide: only('ring'), w: s }));
  if (c.kind === 'arms') feDraw(r, P, Object.assign({}, base, { hide: only('arm'), w: s }));
  if (c.kind === 'whole') feDraw(r, P, Object.assign({}, base, { hide: only('rib'), wpx: 3.2 }));
  if (o.k > 0.25) feFlow(r, P, t, { load: k, scale: exag, nmax: R.nmax, alpha: a * 0.6 * ep(o.k, 0.25, 0.8, E.lin) });
  /* the arches' thrust, where it arrives at the rim */
  const Hm = Math.max(R.cases.none.H, R.cases.arms.H, R.cases.whole.H);
  for (const [z, sh] of Object.entries(SHC.share)) for (const sd of [1, -1]) {
    const i = M.rowNode[z + ':' + sd], n0 = M.nodes[i], q = P([n0[0] + r.d[i * 3] * k * exag, n0[1] + r.d[i * 3 + 1] * k * exag]);
    const len = 46 * (sh / 0.75) * (c.H / Hm) * o.k, dir = -sd;           /* +x (the user's left) is to the stage's left */
    if (len > 3) arrow(q[0] + dir * 10, q[1], q[0] + dir * (10 + len), q[1], { color: C.ink2, w: 2.6, hs: 10, alpha: a * 0.9 });
  }
  /* the hot arm: its root glows, then cracks */
  if (c.kind === 'arms' && c.hot) {
    const l = c.hot, nb = M.nodes[l.board], nr = M.nodes[l.ring];
    const rb = P([nb[0] + r.d[l.board * 3] * k * exag, nb[1] + r.d[l.board * 3 + 1] * k * exag]), rr0 = P([nr[0] + r.d[l.ring * 3] * k * exag, nr[1] + r.d[l.ring * 3 + 1] * k * exag]);
    const ux = rr0[0] - rb[0], uy = rr0[1] - rb[1], uL = Math.hypot(ux, uy) || 1, root = [rb[0] + ux / uL * 4, rb[1] + uy / uL * 4];
    out.root = root;
    if (o.k > 0.6) { const kp = ep(o.k, 0.6, 1), ph = (t * 0.9) % 1; circle(root[0], root[1], 12 + 16 * ph, { color: C.bad, w: 2, alpha: a * kp * (1 - ph) * 0.9 }); circle(root[0], root[1], 11, { color: C.bad, w: 2.2, alpha: a * kp }); }
    if (o.crack > 0) {
      const nx = -uy / uL, ny = ux / uL, half = 2.0 * s + 5, pts = [];
      for (let j = 0; j <= 6; j++) { const f = -1 + 2 * j / 6 * o.crack, wob = (j % 2 ? 2.2 : -2.2); pts.push([root[0] + nx * half * f + ux / uL * wob, root[1] + ny * half * f + uy / uL * wob]); }
      poly(pts, { color: C.bad, w: 3, alpha: a });
    }
  }
  return out;
}
/** the arm alone, edge on, as a fixed-guided FR4 beam: the board holds its root, the shell its tip. d = its tip's movement (mm) */
function shcArmZoom(t, x, y, w, h, d, crack, a) {
  const R = shcBoard(), A = R.arm, r = A.r, L = A.L, n = r.model.n, unit = r.d[n * 3 + 1];
  const s = Math.min((w - 180) / (L + 3), 46), ox = x + 96, oy = y + h * 0.5 + 8, P = p => [ox + p[0] * s, oy - p[1] * s];
  feDraw(r, P, { load: d / unit, scale: 1, smax: 483, wpx: s * 1.0, alpha: a, seg: 14 });
  /* the board's edge (it holds the root) and the shell's boss (it holds the tip), drawn over the beam's ends */
  G.save(); G.globalAlpha = a;
  rrPath(ox - 2.6 * s, oy - 0.5 * s, 2.6 * s, 1.0 * s, 4); G.fillStyle = C.comp; G.fill();
  G.save(); rrPath(ox - 2.6 * s, oy - 0.5 * s, 2.6 * s, 1.0 * s, 4); G.clip(); G.strokeStyle = inkA(0.18); G.lineWidth = 1; G.beginPath(); for (let k = -6; k < 30; k++) { const xx = ox - 2.6 * s + k * 8; G.moveTo(xx, oy - 0.5 * s); G.lineTo(xx + 10, oy + 0.5 * s); } G.stroke(); G.restore();
  const tip = P([L, d]); rrPath(tip[0], tip[1] - 1.4 * s, 1.6 * s, 2.8 * s, 6); G.fillStyle = C.comp2; G.fill();
  G.restore();
  text('Board', ox - 1.3 * s, oy + 0.5 * s + 30, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: a });
  text('Shell boss', tip[0] + 0.8 * s, tip[1] + 1.4 * s + 30, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: a });
  /* the crack: it starts on the stretched face at the root and runs across the 1 mm */
  if (crack > 0) {
    const pts = []; for (let j = 0; j <= 7; j++) { const f = j / 7 * crack; pts.push([ox + (0.08 + (j % 2 ? 0.07 : 0)) * s, oy + 0.5 * s - f * 1.0 * s]); }
    poly(pts, { color: C.bad, w: 3.2, alpha: a });
  }
  return { ox, oy, s, P, tip };
}
S({
  id: 'shcArms', after: 'shcCarry', ch: 'shell', theme: 'night', title: 'Small FR4 arms vs the whole board', settle: 10, ideas: [94, 91],
  src: ['shcBoardFE', 'shcTpuHati', 'shcTpuHatiR', 'shcBrock', 'shlFr4', 'shcFr4Flex', 'shlPyrofil', 'shlLattice'],
  draw: t => {
    header(t, 'Small FR4 arms vs the whole board');
    captions(t, [[0.6, 'Many mice reinforce the shell with small arms of FR4; G-Wolves extends its boards at the sides. Press the crown and follow the force.'], [5.6, 'Four arms hold the feet, but every newton goes through four roots. Tied by every rib, the whole board spreads it, and has nothing to snap off.']]);
    const R = shcBoard(), y0 = LAY.top + 8, H0 = 960 - y0;
    /* ---- the simulation, three ways, side by side ---- */
    const [sx, sy, sw, sh] = [LM, y0, 1150, H0], a0 = shcTA(t, 0.25, 0);
    demoWindow(sx, sy, sw, sh, a0);
    const colW = (sw - 48) / 3, s = 3.25, press = [1.9, 2.55, 3.2], lens = { root: null };
    SHC_CASES.forEach((cs, i) => {
      const c = R.cases[cs.kind], cx = sx + 24 + colW * (i + 0.5), cy = sy + 372, a = ep(t, 0.5 + i * 0.18, 1.0 + i * 0.18, E.snap) * a0;
      const kL = ep(t, press[i], press[i] + 0.9, E.io3), crack = cs.kind === 'arms' ? ep(t, 6.2, 6.8, E.out3) : 0;
      const o = shcPlanDraw(t, c, cx, cy, s, { k: kL, a, crack });
      if (o.root) lens.root = o.root;
      /* the press, held at the crown */
      const pc = o.P([0, SHC.crown]);
      if (t > press[i]) { circle(pc[0], pc[1], 9, { fill: cs.hero ? C.hero : C.ink, alpha: a * 0.9 }); circle(pc[0], pc[1], 16, { color: cs.hero ? C.hero : C.ink, w: 2, alpha: a * 0.35 }); }
      /* the name over each, the numbers under */
      if (cs.hero) text(cs.name, cx, sy + 62, { role: 'label', size: 22, color: C.heroText, align: 'center', alpha: a }); else text(cs.name, cx, sy + 62, { role: 'label', size: 22, color: C.ink, align: 'center', alpha: a });
      text(cs.sub, cx, sy + 96, { role: 'small', size: 25, color: C.mute, align: 'center', alpha: a });
      const kn = ep(t, press[i] + 0.9, press[i] + 1.5), ny = sy + sh - 112;
      const sp = c.spread / R.cases.none.spread * 100, spS = sp >= 10 ? fmtN(sp, 0) : fmtN(sp, 1);
      rich([{ s: spS, role: 'd1', size: 60, color: cs.hero ? C.heroText : C.ink, grad: cs.hero ? C.heroGrad : undefined, tnum: true, count: [press[i] + 0.9, 0.9] }, { s: '%', font: 'disp', size: 30, weight: 800, color: cs.hero ? C.heroText : C.ink, grad: cs.hero ? C.heroGrad : undefined, gap: 4, caps: false }], cx, ny, { t, align: 'center', alpha: kn });
      text('Feet spread', cx, ny + 34, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: kn });
      const fr = cs.kind === 'none' ? 'FR4 carries nothing' : cs.kind === 'arms' ? 'FR4 peak ' + fmtN(c.arm, 1) + ' MPa, at the roots' : 'FR4 peak ' + fmtN(Math.max(c.board, 0.05), 1) + ' MPa';
      text(fr, cx, ny + 70, { role: 'small', size: 25, weight: 600, color: cs.kind === 'arms' ? C.bad : cs.hero ? C.heroText : C.faint, align: 'center', alpha: kn });
    });
    /* the pointer presses each crown in turn */
    { const c0 = i => [sx + 24 + colW * (i + 0.5), sy + 372 - SHC.crown * s];
      cursorAt(t, [[1.3, [sx + sw * 0.2, sy + sh + 40]], [1.85, c0(0)], [2.05, c0(0)], [2.5, c0(1)], [2.7, c0(1)], [3.15, c0(2)], [3.4, c0(2)], [4.2, [sx + sw - 60, sy + sh - 160]]], press, { a: ep(t, 1.2, 1.5) * (1 - ep(t, 4.0, 4.4)) });
    }
    /* ---- right: the arm's root, close up ---- */
    const rx = LM + 1150 + 24, rw = RM - rx;
    { const [x, y, w, h] = [rx, y0, rw, 410], a = shcTA(t, 0.25, 1);
      demoWindow(x, y, w, h, a);
      const hy = cardHead(t, 0.6, x, y, w, 'One arm, edge on', ['derived']);
      const dMax = R.arm.snap[0], d = dMax * ep(t, 4.4, 6.2, E.io3), crack = ep(t, 6.2, 6.8, E.out3);
      const Z = shcArmZoom(t, x, y + 64, w, 200, d, crack, ep(t, 0.9, 1.4) * a);
      const ks = ep(t, 6.4, 7.0);
      rich([{ s: fmtN(R.arm.snap[0], 2), role: 'd1', size: 64, color: C.ink, tnum: true }, { s: 'mm', font: 'disp', size: 28, weight: 700, color: C.mute, gap: 8, caps: false }], x + 32, y + h - 72, { alpha: ks });
      text('at its tip takes the root to FR4\'s 483 MPa bending strength: it snaps there.', x + 200, y + h - 100, { role: 'small', size: 25, color: C.ink2, maxW: w - 232, lh: 1.3, alpha: ks });
      /* the lens: from the hot root in the middle panel to here */
      if (lens.root) {
        const kl = ep(t, 4.0, 4.7, E.cam), end = [x, y + 64 + 100];
        if (kl > 0) { G.save(); G.globalAlpha = 0.6 * kl * (1 - 0.6 * ep(t, 7.5, 8.5)); G.setLineDash([5, 6]); G.strokeStyle = C.bad; G.lineWidth = 1.5; G.beginPath(); G.moveTo(lens.root[0], lens.root[1]); G.lineTo(lerp(lens.root[0], end[0], kl), lerp(lens.root[1], end[1], kl)); G.stroke(); G.setLineDash([]); G.restore(); circle(lens.root[0], lens.root[1], 18, { color: C.bad, w: 2, alpha: kl * 0.9 }); }
      }
    }
    /* ---- the evidence for the arms ---- */
    { const y = y0 + 410 + 24, h = 212, a = shcTA(t, 0.25, 2), x = rx, w = rw;
      demoWindow(x, y, w, h, a);
      const k1 = ep(t, 1.0, 1.4), k2 = ep(t, 1.4, 1.8);
      pill(x + 32, y + 50, 'measured', k1, { by: 'TechPowerUp' });
      text('G-Wolves boards are "extended at the sides to help with shell rigidity."', x + 32, y + 86, { role: 'small', size: 25, color: C.ink2, maxW: w - 64, lh: 1.3, alpha: k1 });
      pill(x + 32, y + 150, 'estimate', k2, { by: 'Brock' });
      text('The arms on my HTS Ultra broke in shipping.', x + 32, y + 186, { role: 'small', size: 25, color: C.ink2, maxW: w - 64, alpha: k2 });
    }
    /* ---- the meter: this step on the strip ---- */
    shellMeter(t, 7.2, 'board', rx, y0 + 410 + 24 + 212 + 30, rw, { compact: true });
    source(t, '2D frames solved in this page: the shell at board height from above (CF-PP rim 13.5 GPa, FR4 board 19 GPa, 1.0 mm); a transverse arch under 7.5 N of a 10 N crown press; the arm as a fixed-guided beam.', { t0: 1.6 });
  }
});
