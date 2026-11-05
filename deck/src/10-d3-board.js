/* ============================== shell and structure, part C: the board as structure, and the mass near the fingers ==============================
   Brock's notes (2026-11-04; F2.26 with F6.3, F2.40, F2.12, F9.23, F9.27): using the board as a reinforcement wasn't
   demonstrated enough: how strong FR4 is against magnesium alloy, why you draw on every resource you have, how mice
   reinforce with small FR4 arms that snap, and how Theseus uses THE WHOLE board (one board, 5.6 g); and the mass slide,
   rebuilt as an argument you can see.
     shlPcbRib   FR4 vs magnesium alloy: the same weight of each, pulled to breaking (rebuilds Shell A's slide, keeps its id)   #94
     shcCarry    Use the weight you already carry: 19 % of the mouse put to work for 0 g; one board, three jobs                     #94
     shcArms     Small FR4 arms vs the whole board: 2D frames solved here; the meter's 'board' step                                    #94 #91
     mass        Keep the mass low, near the fingers: the cell onto the board, the centre of mass down to the grip (rebuilds it)     #95 #40
   At a glance (F14.10, F16.1): each slide leads with a huge number in Theseus's colour (shellHL, 10-d-0-meter.js) and keeps
   the bad case beside the good one (shellBA). C.hero is Theseus, C.second the next best, C.bad a problem; stress heat only
   on the worse designs. Every simulated number is derived here with 07-sim.js, and each slide names its model in a line. */

Object.assign(SRC, {
  shcFr4Flex: { t: 'The Gund Company, NEMA FR4 typical values: flexural strength 552 MPa lengthwise and 483 MPa crosswise (ASTM D790, 1.6 mm), tensile 430 MPa lengthwise (ASTM D638), 1.85 g/cm³', u: 'https://thegundcompany.com/wp-content/uploads/2024/03/NEMA-FR4-Glass-Epoxy-Laminate-by-The-Gund-Co.pdf' },
  shcTpuHati: { t: 'TechPowerUp, G-Wolves Hati-S Plus 4K review, 28 Mar 2023: "Everything else sits on the main PCB, which has been extended at the sides to help with shell rigidity"; "All PCBs are very thin to save as much weight as possible"; four screws hold it to the bottom shell', u: 'https://www.techpowerup.com/review/g-wolves-hati-s-plus-4k/4.html' },
  shcTpuHatiR: { t: 'TechPowerUp, G-Wolves Hati-R 8K review, 31 Oct 2024: "The very thin main PCB is affixed to the bottom with four screws, and has been extended such that it supports structural rigidity of the shell"', u: 'https://www.techpowerup.com/review/g-wolves-hati-r-8k/4.html' },
  shcBrock: { t: 'Brock Liddicoat, review notes, 4 Nov 2026: one board of about 5.6 g, with the radio, PMIC, antenna and USB-C; many mice reinforce with small arms of FR4 that are "easy to break off or snap under force"; "All G Wolves mice, I even had the arms on an HTS Ultra break during shipping once"; in engineering, draw on all the resources you have', u: '', n: 'his own account and figures' },
  shcBoardFE: { t: 'This deck, 2D frames solved in the page (07-sim.js): the shell at board height seen from above (the Sora outline; its CF-PP rim and lower wall as one 4.0 × 3.6 mm beam, 13.5 GPa), the board in 1.0 mm FR4 (19 GPa) as a plate-equivalent truss 9 mm inside the rim, joined by four 4 mm FR4 arms at the screw-boss rows or by 16 CF-PP rib feet at the study\'s arch rows; a transverse arch (the wall and one arch rib per 9.8 mm, as an equivalent section) under its 7.5 N share of a 10 N crown press, its feet held by the plan frame; the arm alone, edge on, as a fixed-guided FR4 beam', n: 'derived, this model' },
  shcMassModel: { t: 'This deck, mass model: Theseus\'s 29.31 g as its weight budget sets it (the battery, Jauch LP402535JU, 8 g and 4.0 mm thick; the board 5.6 g; buttons, screws and wires as XBAB weighed them in the XA25; the magnesium wheel on its POM axle and four brass inserts as the intro\'s budget derives them; shell and skates the rest), each part at its height above the pad: the shell and skates at the study shell\'s centre of mass (16.1 mm) and the buttons at theirs (23.3 mm), both integrated from the moulded geometry (3d/lattice); the board 4 to 5 mm up with its parts on top (5 mm); the battery at board height in the tail, behind the board (7.46 mm, the 3D layout) or up in the hump (20 mm); wheel 22 mm, screws and inserts 8 mm, wires 10 mm (estimates); the grip 12 mm up, as in the side-wall study (shbSides)', n: 'derived, this model' }
});

/* ---------- small geometry, in the shell study's frame: x across (+ = the user's left), y up, z forward (mm) ---------- */
const SHC = {
  rows: [-31.65, -20.43, -10.64, -0.77, 9.17, 19.25, 29.76, 41.16],   /* the study shell's arch rows, where its side ribs meet the board (3d/lattice) */
  armRows: [-31.65, 9.17],                                              /* small arms at the screw-boss rows, as boards are usually screwed */
  crown: -13.09,                                                        /* the study's crown press point */
  share: { '-20.43': 0.25, '-10.64': 0.75 },                            /* a 10 N crown press splits between the arches either side, by the lever rule */
  ring: { w: 4.0, h: 3.6 }, ringIn: 2.1, boardIn: 9.2, boardZ: [-36, 54], lat: 5
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
    spreadArms: arms.spread / none.spread, spreadWhole: whole.spread / none.spread, fr4X: arms.fr4 / Math.max(1e-6, whole.fr4),
    arm: { r: armR, L: arms.armL, perMM, snap: [483 / perMM, 552 / perMM] },
    smax: Math.max(none.ring, arms.ring, arms.arm, whole.ring, whole.rib, whole.board) };
  res.nmax = Math.max(...['none', 'arms', 'whole'].map(k => Math.max(...C3[k].r.N.map(v => Math.abs(v) * C3[k].sc))));
  return (SHC.res = res);
}
/* the shell meter's step for this slide (10-d-0-meter.js): the factors are read when the strip is drawn, so the solve runs once, then */
shellStep({ key: 'board', slide: 'shcArms', label: 'The whole board', get flex() { return shcBoard().flexF; }, get stress() { return shcBoard().stressF; }, ev: 'derived',
  how: '2D frames: a transverse arch under a 10 N crown press, its feet held by the board in plan (FR4 19 GPa, 1.0 mm; CF-PP rim 13.5 GPa)' });

/* ---------- small helpers ---------- */
/** the slide's tiles one after another (tileA when the shared helper is there) */
const shcTA = (t, t0, i) => typeof tileA === 'function' ? tileA(t, t0, i) : ep(t, t0 + i * 0.09, t0 + i * 0.09 + 0.55, E.snap);
/** newtons, rounded to ten, with a thousands comma */
const shcN = v => (Math.round(v / 10) * 10).toLocaleString('en-US');   /* to 10 N: no false precision */
/** a value from RDATA ({ value } or plain) */
const shcV = v => typeof rv === 'function' ? rv(v) : (v && typeof v === 'object' && 'value' in v ? v.value : v);
/** a triangle lattice's openings over a box, each a triangle with filleted corners (the ribs between them read as filleted, F9.27):
   n openings across a row; fills the current path style */
function shcTriHoles(x, y, w, h, n) {
  const p = w / n, rh = p * 0.866, kq = 0.74, rf = p * 0.1;
  const tri = (a, b, c) => { const pts = [a, b, c].map(q => q.slice()), cx = (a[0] + b[0] + c[0]) / 3, cy = (a[1] + b[1] + c[1]) / 3; pts.forEach(q => { q[0] = cx + (q[0] - cx) * kq; q[1] = cy + (q[1] - cy) * kq; });
    G.beginPath(); for (let i = 0; i < 3; i++) { const q0 = pts[(i + 2) % 3], q1 = pts[i], q2 = pts[(i + 1) % 3]; const m0 = [(q0[0] + q1[0]) / 2, (q0[1] + q1[1]) / 2]; if (!i) G.moveTo(m0[0], m0[1]); G.arcTo(q1[0], q1[1], q2[0], q2[1], rf); } G.closePath(); G.fill(); };
  for (let r = -1; r * rh < h + rh; r++) for (let k = -1; k <= n + 1; k++) { const x0 = x + k * p + (r % 2 ? p / 2 : 0), y0 = y + r * rh; tri([x0, y0 + rh], [x0 + p, y0 + rh], [x0 + p / 2, y0]); tri([x0 + p / 2, y0], [x0 + p * 1.5, y0], [x0 + p, y0 + rh]); }
}
/** skin, in the deck's one grey (03-parts.js), never a peach tone (F9.24) */
const shcSkin = () => TH ? ['#C9C8C2', '#B3B2AC'] : ['#6A6964', '#55554F'];

/* ============================== 1. FR4 vs magnesium alloy (#94) ==============================
   The same weight of each, pulled until it breaks: strips 50 mm long, the FR4 one 10 × 1.0 mm (0.93 g), the magnesium one
   1.0 mm thick and as wide as the same weight allows. Breaking pull = tensile strength × area. The figures are the ones
   Shell A's ranking prints (shlSpecific: Gund for FR4, MatWeb for AZ91D-F); this slide is the head-to-head. */
const SHC_FR4 = { uts: 430, E: [18, 20], rho: 1.85 }, SHC_MG = { uts: 230, E: 44.8, rho: 1.81 };
const SHC_PULL = (() => { const L = 50, aF = 10, g = SHC_FR4.rho * aF * L / 1000, aM = g * 1000 / (SHC_MG.rho * L), fF = SHC_FR4.uts * aF, fM = SHC_MG.uts * aM; return { L, aF, aM, g, fF, fM, ratio: fF / fM }; })();
/** a strip seen from above: (x, y) = its left end on its centre line, len px long, h px wide; kind 'fr4' (the glass weave)
   or 'mg' (a cast face). from, to = the part of its length drawn (0..1); dx moves it */
function shcStrip(x, y, len, h, kind, a, from = 0, to = 1, dx = 0) {
  if (a <= 0.003 || to <= from) return;
  const x0 = x + len * from + dx, x1 = x + len * to + dx;
  G.save(); G.globalAlpha = a; rrPath(x0, y - h / 2, x1 - x0, h, 5); G.fillStyle = kind === 'fr4' ? C.hero : C.second; G.fill(); G.clip();
  G.globalAlpha = a * (kind === 'fr4' ? 0.2 : 0.16); G.strokeStyle = '#FFFFFF'; G.lineWidth = 1.2; G.beginPath();
  if (kind === 'fr4') for (let k = -h; k < len + h; k += 10) { G.moveTo(x + dx + k, y - h / 2); G.lineTo(x + dx + k + h, y + h / 2); G.moveTo(x + dx + k + h, y - h / 2); G.lineTo(x + dx + k, y + h / 2); }
  else for (let k = 6; k < h; k += 7) { G.moveTo(x0, y - h / 2 + k); G.lineTo(x1, y - h / 2 + k); }
  G.stroke(); G.restore();
}
/** a jagged break across a strip at x, in the problem colour */
function shcBreak(x, y, h, a, dir = 1) {
  const pts = []; for (let i = 0; i <= 8; i++) pts.push([x + dir * (i % 2 ? 5 : -3), y - h / 2 - 4 + (h + 8) * i / 8]);
  poly(pts, { color: C.bad, w: 3.2, alpha: a });
}
S({
  id: 'shlPcbRib', replaces: 'shlPcbRib', after: 'shbSides', ch: 'shell', theme: 'night', title: 'FR4 vs magnesium alloy', settle: 9.5, ideas: [94],
  src: ['shlFr4', 'shlMg', 'shlDoc'],
  draw: t => {
    const P = SHC_PULL, rx = fmtN(P.ratio, 1) + '×';
    header(t, 'FR4 vs magnesium alloy');
    captions(t, [[0.6, 'FR4 is the glass and epoxy core of a circuit board. Pull a strip of it against the same weight of the magnesium alloy in metal mice.'], [4.9, 'The magnesium lets go at ' + shcN(P.fM) + ' N. FR4 holds to ' + shcN(P.fF) + ' N: ' + rx + ' the pull for its weight, and every Theseus already carries ' + THS.pcb + ' of it.']]);
    /* the pull: up to the magnesium's break, a beat, then on to FR4's own limit */
    const tP0 = 2.2, tB = 4.6, tP2 = 6.2, F = t < tB ? P.fM * ep(t, tP0, tB, E.lin) : P.fM + (P.fF - P.fM) * ep(t, tB + 0.3, tP2, E.io3), broke = t >= tB;
    const [X, Y, W, H] = [LM, 280, RM - LM, 480], a0 = shcTA(t, 0.25, 0);
    demoWindow(X, Y, W, H, a0);
    /* the headline: by how much, in Theseus's colour */
    shellHL(t, tP2 + 0.1, X + 48, Y + 168, rx, 'stronger', { size: 140, sub: 'For its weight. The same 0.93 g of each, pulled until it breaks.', maxW: 820 });
    /* the rig: a clamp at the left, the two strips, a bar the pointer pulls at the right */
    const sx = X + 160, len = 880, sh = 44, yF = Y + 316, yM = Y + 420, ka = ep(t, 0.8, 1.3), kM = ep(t, 1.0, 1.5);
    const dxF = 46 * F / P.fF, dxB = 46 * P.fM / P.fF, gap = broke ? 8 + (dxF - dxB) + 10 * ep(t, tB, tB + 0.25, E.out3) : 0, cut = 0.44;
    text('FR4, 10 × 1.0 mm', sx + 44, yF - sh / 2 - 16, { role: 'label', size: 20, color: C.heroText, alpha: ka });
    text('Magnesium AZ91D, ' + fmtN(P.aM, 1) + ' × 1.0 mm', sx + 44, yM - sh / 2 - 16, { role: 'label', size: 20, color: C.secondText, alpha: kM });
    shcStrip(sx, yF, len, sh, 'fr4', ka, 0, 1, dxF);
    if (!broke) shcStrip(sx, yM, len, sh, 'mg', kM, 0, 1, dxF);
    else {
      shcStrip(sx, yM, len, sh, 'mg', kM, 0, cut, 0); shcStrip(sx, yM, len, sh, 'mg', kM, cut, 1, gap);
      const kb = ep(t, tB, tB + 0.2); shcBreak(sx + len * cut, yM, sh, kb, 1); shcBreak(sx + len * cut + gap, yM, sh, kb, -1);
    }
    /* the clamp, over the strips' left ends */
    G.save(); G.globalAlpha = a0; rrPath(sx - 70, yF - 44, 96, yM - yF + 88, 6); G.fillStyle = TH ? '#2B2B2E' : '#3A3B40'; G.fill(); G.clip();
    G.strokeStyle = 'rgba(255,255,255,0.12)'; G.lineWidth = 2; G.beginPath(); for (let k = -200; k < 200; k += 14) { G.moveTo(sx - 70 + k, yF - 44); G.lineTo(sx - 70 + k + 140, yM + 44); } G.stroke(); G.restore();
    /* the pull bar, pinned to both strips' right ends */
    const bx = sx + len + dxF;
    rr(bx - 6, yF - 40, 26, yM - yF + 80, 6, TH ? '#3A3B40' : '#5A5B61', null, 0, a0);
    for (const yy of [yF, yM]) circle(bx + 7, yy, 5, { fill: C.bg, alpha: a0 });
    /* the pointer: in, grabs the bar, pulls with it, leaves */
    { const grab = [bx + 22, (yF + yM) / 2 + 18], k = t < 2.0 ? 0 : t < tP2 + 0.2 ? 1 : 2;
      const p = k === 0 ? kf(t, [[1.3, [X + W - 140, Y + H - 30]], [2.0, [sx + len + 22, (yF + yM) / 2 + 18]]], E.cam) : k === 1 ? grab : kf(t, [[tP2 + 0.2, grab], [tP2 + 0.9, [grab[0] + 120, grab[1] + 90]]], E.cam);
      cursorPtr(p[0], p[1], { a: ep(t, 1.2, 1.5) * (1 - ep(t, tP2 + 0.5, tP2 + 0.9)), grab: k === 1, press: t > 2.0 && t < 2.45 ? prog(t, 2.0, 2.45) : 0 });
    }
    /* the chart: the breaking pull, higher is better */
    { const cx = X + 1180, cw = 420, kc = ep(t, 1.4, 1.8), Xb = v => cx + cw * v / P.fF;
      text('Breaking pull, {N (higher is better)}', cx, Y + 248, { role: 'label', size: 19, color: C.mute, alpha: kc });
      const rows = [[yF, Math.min(F, P.fF), C.hero, C.heroText, 'FR4', t >= tP2], [yM, Math.min(F, P.fM), C.second, C.secondText, 'AZ91D', broke]];
      rows.forEach(([yy, v, col, tc, nm, done]) => {
        rr(cx, yy - 9, cw, 18, 9, C.track, null, 0, kc);
        if (v > 0) rr(cx, yy - 9, Math.max(18, Xb(v) - cx), 18, 9, col, null, 0, kc);
        text(nm, cx, yy - 22, { role: 'label', size: 19, color: tc, alpha: kc });
        const vs = shcN(v) + ' N';
        text(vs, cx + cw, yy - 22, { font: 'disp', size: 30, weight: 800, tnum: true, color: nm === 'FR4' ? C.heroText : C.ink, grad: nm === 'FR4' && done ? C.heroGrad : null, align: 'right', alpha: kc });
        if (nm === 'AZ91D' && done) { const xe = Xb(P.fM); line(xe + 6, yy - 14, xe + 6, yy + 14, { color: C.bad, w: 3, alpha: kc }); text('Breaks', xe + 16, yy + 7, { role: 'label', size: 19, color: C.bad, alpha: kc * ep(t, tB, tB + 0.3) }); }
      });
      /* the margin FR4 still has when the magnesium breaks */
      const km = ep(t, tB + 0.2, tB + 0.6) * (1 - ep(t, tP2 - 0.4, tP2)), xm = Xb(P.fM);
      if (km > 0.003) { line(xm, yF - 14, xm, yF + 14, { color: C.ink, w: 2, alpha: km }); text(fmtN((1 - P.fM / P.fF) * 100, 0) + ' % margin left', xm, yF + 38, { role: 'label', size: 19, color: C.heroText, align: 'center', alpha: km }); }
      if (t >= tP2) text('Holds ' + rx + ' the pull', cx + cw, yF + 38, { role: 'label', size: 19, color: C.heroText, align: 'right', alpha: ep(t, tP2, tP2 + 0.4) });
    }
    /* under it: the word, and the one place magnesium wins */
    const by = Y + H + 40, bw = (W - 40) / 2, bh = 960 - by;
    glossBox(t, 6.6, X, by, bw, 'Tie', 'A member that holds two points together by pulling, like a bowstring. Pulled is how FR4 is strongest, and how Theseus uses its board.', { h: bh, size: 24 });
    noteBox(t, 7.0, X + bw + 40, by, bw, { label: 'Where magnesium wins', body: 'Bent, it is about 2.4× stiffer: 44.8 GPa against FR4\'s 18 to 20. So the board is never asked to bend. It is pulled, as a tie.', h: bh, size: 24 });
    source(t, 'Gund NEMA FR4: 430 MPa along the weave, 1.85 g/cm³. MatWeb AZ91D-F: 230 MPa, 44.8 GPa, 1.81 g/cm³. Pull = strength × area, at the same weight and length.', { t0: 1.2 });
  }
});

/* ============================== 2. use the weight you already carry (#94) ==============================
   Theseus's 29.31 g as one square per gram. The board's 5.6 g (Brock's figure) go from carried to structure; nothing is
   added. The board then has three jobs, tying this slide to the next (the tie) and to Glide (the sensor held at focus). */
S({
  id: 'shcCarry', after: 'shlPcbRib', ch: 'shell', theme: 'paper', title: 'Use the weight you already carry', settle: 9.5, ideas: [94],
  src: ['shcBrock', 'shlDoc'],
  draw: t => {
    const M = THESEUS.mass, Bg = THESEUS.pcb, share = Bg / M * 100, kMove = ep(t, 3.6, 4.8, E.io3);
    header(t, 'Use the weight you already carry');
    captions(t, [[0.6, 'Every Theseus carries one board of ' + THS.pcb + ', with the radio, PMIC, antenna and USB-C. Its weight is fixed. The question is whether it works.'], [4.6, 'In engineering you draw on every resource you have. Tie the side ribs to the board, and the same weight carries load.']]);
    /* ---- left: the headline, before and after, and Brock's line ---- */
    const lx = LM, lw0 = 600;
    shellHL(t, 4.8, lx, 440, fmtN(share, 0) + '%', 'at work', { size: 150, sub: 'Of the mouse\'s weight joins the structure: the board, ' + THS.pcb + '. The mouse gets no heavier.', maxW: lw0 });
    shellBA(t, lx, 680, { label: 'The board\'s weight that carries load', before: '0 g', after: fmtN(Bg * kMove, 1) + ' g', net: '+0 g on the scale', size: 72, k: kMove, a: ep(t, 1.4, 1.8), bad: C.ink });
    sourceBox(t, 2.0, lx, 780, lw0, 'Brock, #94', 'The weight of the PCB is non-negotiable, so you may as well take advantage of it.', { size: 25 });
    /* ---- right: one square per gram, then the board's three jobs ---- */
    const [x, y, w, h] = [720, 280, RM - 720, 680], a = shcTA(t, 0.25, 0);
    demoWindow(x, y, w, h, a);
    cardHead(t, 0.45, x, y, w, 'Theseus, ' + THS.massG + ', one square per gram', []);
    const s = 80, gp = 16, cols = 10, gx = x + (w - (cols * s + (cols - 1) * gp)) / 2, gy = y + 96;
    for (let i = 0; i < Math.ceil(M); i++) {
      const c = i % cols, r = Math.floor(i / cols), qx = gx + c * (s + gp), qy = gy + r * (s + gp);
      const ka = ep(t, 0.7 + i * 0.03, 1.1 + i * 0.03, E.snap), f = clamp(M - i), fb = clamp(Bg - i), kf2 = ep(t, 3.6 + i * 0.12, 4.1 + i * 0.12, E.snap);
      if (ka <= 0.003) continue;
      const dy = (1 - ka) * 14;
      G.save(); G.globalAlpha = a * ka; rrPath(qx, qy + dy, s, s, 6); G.clip();
      G.fillStyle = C.track; G.fillRect(qx, qy + dy, s, s);
      G.fillStyle = C.comp; G.fillRect(qx, qy + dy, s * f, s);
      if (fb > 0) {
        G.fillStyle = C.comp2; G.fillRect(qx, qy + dy, s * fb, s);
        if (kf2 > 0) {
          G.globalAlpha = a * ka * kf2; G.fillStyle = C.hero; G.fillRect(qx, qy + dy, s * fb, s);
          /* a triangle lattice over the board's squares, its openings filleted as the shell's are (F9.27): they are structure now */
          G.save(); G.beginPath(); G.rect(qx, qy + dy, s * fb, s); G.clip(); G.globalAlpha = a * ka * kf2 * 0.3; G.fillStyle = '#FFFFFF'; shcTriHoles(qx, qy + dy, s, s, 3); G.restore();
        }
      }
      G.restore();
    }
    /* what the squares hold */
    { const ly = gy + 3 * (s + gp) + 30, kl = ep(t, 1.8, 2.2);
      text(kMove > 0.5 ? 'Board, ' + THS.pcb + ': structure' : 'Board, ' + THS.pcb + ': carried', gx, ly, { role: 'label', size: 20, color: kMove > 0.5 ? C.heroText : C.ink2, alpha: kl });
      text('Everything else, ' + fmtN(M - Bg, 2) + ' g', gx + cols * s + (cols - 1) * gp, ly, { role: 'label', size: 20, color: C.mute, align: 'right', alpha: kl });
    }
    /* one board, three jobs: the middle one is new */
    { const jy = y + 470, jw = (w - 64 - 80) / 3;
      line(x + 32, jy - 24, x + w - 32, jy - 24, { color: C.hair, w: 1.5, alpha: ep(t, 5.4, 5.8) });
      text('One board, three jobs', x + 32, jy + 14, { role: 'label', size: 20, color: C.mute, alpha: ep(t, 5.4, 5.8) });
      [['The circuit', 'Radio, PMIC, antenna and USB-C. The job it always had.', false], ['The tie', 'It holds the arches\' feet together along its whole length.', true], ['The sensor\'s mount', 'Held flat by the ribs, it keeps the sensor at its focus height.', false]].forEach(([nm, b, hero], i) => {
        const jx = x + 32 + i * (jw + 40), k = ep(t, 5.6 + i * 0.3, 6.0 + i * 0.3);
        text(nm, jx, jy + 62, { role: 'label', size: 21, color: hero ? C.heroText : C.ink, alpha: k });
        text(b, jx, jy + 100, { role: 'small', size: 24, weight: 560, color: C.ink2, maxW: jw, lh: 1.3, alpha: k });
      });
    }
  }
});

/* ============================== 3. small FR4 arms vs the whole board (#94, #91) ==============================
   Three ways to hold the arches' feet, under the same press: the rim alone (the board left out), four small FR4 arms to the
   screw bosses (how many mice reinforce: G-Wolves extends its boards at the sides), and the whole board tied by every side
   rib. Seen from above at board height; the arch's thrust comes from the transverse model; one exaggeration for all three. */
const SHC_CASES = [
  { kind: 'none', name: 'Board left out', sub: 'Only the rim holds the arches' },
  { kind: 'arms', name: 'Four small arms', sub: 'As G-Wolves extends its boards' },
  { kind: 'whole', name: 'The whole board', sub: 'Tied by every side rib', hero: true }
];
/** one case from above. c = shcBoard().cases[kind]; (cx, cy) = where the shell's centre lands, s = px per mm;
   o = { k (0..1 of the press), a, crack (0..1) }. returns { P, root } (root: the hot arm's root on the stage) */
function shcPlanDraw(t, c, cx, cy, s, o) {
  const R = shcBoard(), r = c.r, M = r.model, k = o.k * c.sc, a = o.a, exag = 26 / (R.cases.none.r.dmax * R.cases.none.sc * s);
  const P = p => [cx - p[0] * s, cy - p[1] * s], out = { P };
  if (a <= 0.003) return out;
  /* the shell from above, quietly */
  G.save(); G.globalAlpha = a; G.beginPath(); shcOutline().forEach((p, i) => { const q = P(p); i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); }); G.closePath();
  G.fillStyle = inkA(TH ? 0.03 : 0.04); G.fill(); G.strokeStyle = inkA(TH ? 0.14 : 0.16); G.lineWidth = 1.5; G.stroke(); G.restore();
  /* the board: dashed when it is left out of the structure, Theseus's colour when all of it works */
  const B = shcBoardOutline(), tracePath = () => { G.beginPath(); B.forEach((p, i) => { const q = P(p); i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); }); G.closePath(); };
  G.save(); G.globalAlpha = a; tracePath();
  if (c.kind === 'none') { G.setLineDash([7, 6]); G.strokeStyle = inkA(0.32); G.lineWidth = 1.5; G.stroke(); G.setLineDash([]); }
  else { G.fillStyle = c.kind === 'whole' ? C.heroSoft : inkA(TH ? 0.05 : 0.07); G.fill(); G.strokeStyle = c.kind === 'whole' ? rgba(C.hero, 0.6) : inkA(0.3); G.lineWidth = 1.5; G.stroke(); }
  G.restore();
  if (c.kind === 'none') { const q = P([0, 9]); text('Board, carried', q[0], q[1] + 8, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: a }); }
  const only = part => e => M.els[e].part !== part, base = { load: k, scale: exag, smax: R.smax, alpha: a };
  if (o.k > 0.2) feFlow(r, P, t, { load: k, scale: exag, nmax: R.nmax, alpha: a * 0.55 * ep(o.k, 0.2, 0.7, E.lin) });
  feDraw(r, P, Object.assign({}, base, { hide: only('ring'), w: s }));
  if (c.kind === 'arms') feDraw(r, P, Object.assign({}, base, { hide: only('arm'), w: s }));
  /* Theseus's ties in its colour, filleted where they meet the rim (F9.27) */
  if (c.kind === 'whole') feDraw(r, P, Object.assign({}, base, { hide: only('rib'), wpx: 3.4, heat: false, color: C.hero, fillet: 4 }));
  /* the arches' thrust, where it arrives at the rim */
  const Hm = Math.max(R.cases.none.H, R.cases.arms.H, R.cases.whole.H);
  for (const [z, sh] of Object.entries(SHC.share)) for (const sd of [1, -1]) {
    const i = M.rowNode[z + ':' + sd], n0 = M.nodes[i], q = P([n0[0] + r.d[i * 3] * k * exag, n0[1] + r.d[i * 3 + 1] * k * exag]);
    const len = 40 * (sh / 0.75) * (c.H / Hm) * o.k, dir = -sd;           /* +x (the user's left) is to the stage's left */
    if (len > 3) arrow(q[0] + dir * 9, q[1], q[0] + dir * (9 + len), q[1], { color: C.ink2, w: 2.6, hs: 10, alpha: a * 0.9 });
  }
  /* the hot arm: its root rings, then cracks */
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
  const s = Math.min((w - 190) / (L + 3), 40), ox = x + 100, oy = y + h * 0.5, P = p => [ox + p[0] * s, oy - p[1] * s];
  feDraw(r, P, { load: d / unit, scale: 1, smax: 483, wpx: s * 1.0, alpha: a, seg: 14 });
  /* the board's edge (it holds the root) and the shell's boss (it holds the tip), drawn over the beam's ends */
  G.save(); G.globalAlpha = a;
  rrPath(ox - 2.6 * s, oy - 0.5 * s, 2.6 * s, 1.0 * s, 4); G.fillStyle = C.comp; G.fill();
  const tip = P([L, d]); rrPath(tip[0], tip[1] - 1.4 * s, 1.6 * s, 2.8 * s, 6); G.fillStyle = C.comp2; G.fill();
  G.restore();
  text('Board', ox - 1.3 * s, oy + 0.5 * s + 28, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: a });
  text('Shell', tip[0] + 0.8 * s, tip[1] - 1.4 * s - 12, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: a });
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
    const R = shcBoard(), Cn = R.cases, xF = fmtN(R.fr4X, 0) + '×';
    header(t, 'Small FR4 arms vs the whole board');
    captions(t, [[0.6, 'Many mice reinforce the shell with small arms of FR4; G-Wolves extends its boards at the sides. The arms on my HTS Ultra broke in shipping.'], [5.0, 'Four arms put every newton through four roots. Tied by every rib, the whole board spreads the load along its length, with no arm to snap off.']]);
    /* ---- the simulation, three ways, side by side ---- */
    const [sx, sy, sw, sh] = [LM, 280, 1160, 560], a0 = shcTA(t, 0.25, 0);
    demoWindow(sx, sy, sw, sh, a0);
    const colW = (sw - 48) / 3, s = 3.2, press = [1.9, 2.55, 3.2], cyP = sy + 312, lens = { root: null };
    SHC_CASES.forEach((cs, i) => {
      const c = Cn[cs.kind], cx = sx + 24 + colW * (i + 0.5), a = ep(t, 0.5 + i * 0.18, 1.0 + i * 0.18, E.snap) * a0;
      const kL = ep(t, press[i], press[i] + 0.9, E.io3), crack = cs.kind === 'arms' ? ep(t, 6.2, 6.8, E.out3) : 0;
      const o = shcPlanDraw(t, c, cx, cyP, s, { k: kL, a, crack });
      if (o.root) lens.root = o.root;
      /* the press, held at the crown */
      const pc = o.P([0, SHC.crown]);
      if (t > press[i]) { circle(pc[0], pc[1], 9, { fill: cs.hero ? C.hero : C.ink, alpha: a * 0.9 }); circle(pc[0], pc[1], 16, { color: cs.hero ? C.hero : C.ink, w: 2, alpha: a * 0.35 }); }
      /* the name over each, the board's peak under */
      text(cs.name, cx, sy + 52, { role: 'label', size: 21, color: cs.hero ? C.heroText : C.ink, align: 'center', alpha: a });
      text(cs.sub, cx, sy + 84, { role: 'small', size: 23, weight: 560, color: C.mute, align: 'center', alpha: a, maxW: colW - 16 });
      const kn = ep(t, press[i] + 0.9, press[i] + 1.4), ny = sy + sh - 22;
      const fr = cs.kind === 'none' ? 'The board carries nothing' : cs.kind === 'arms' ? 'FR4 peak ' + fmtN(c.fr4, 1) + ' MPa, at a root' : 'FR4 peak ' + fmtN(c.fr4, 2) + ' MPa';
      text(fr, cx, ny, { role: 'small', size: 24, weight: 650, color: cs.kind === 'arms' ? C.bad : cs.hero ? C.heroText : C.faint, align: 'center', alpha: kn });
    });
    /* the pointer presses each crown in turn */
    { const c0 = i => [sx + 24 + colW * (i + 0.5), cyP - SHC.crown * s];
      cursorAt(t, [[1.3, [sx + sw * 0.2, sy + sh + 40]], [1.85, c0(0)], [2.05, c0(0)], [2.5, c0(1)], [2.7, c0(1)], [3.15, c0(2)], [3.4, c0(2)], [4.2, [sx + sw - 60, sy + sh - 40]]], press, { a: ep(t, 1.2, 1.5) * (1 - ep(t, 4.0, 4.4)) });
    }
    /* ---- right: the headline, before and after, then one arm close up ---- */
    const rx = LM + 1160 + 40, rw = RM - rx;
    shellHL(t, 4.6, rx, 400, xF, 'lower peak', { size: 130, sub: 'In the board, where the load comes in.', maxW: rw });
    shellBA(t, rx, 556, { label: 'Peak experienced stress in the FR4 {(lower is better)}', before: fmtN(Cn.arms.fr4, 1), after: fmtN(lerp(Cn.arms.fr4, Cn.whole.fr4, ep(t, 4.6, 5.4)), 2), unit: 'MPa', size: 56, k: ep(t, 4.6, 5.4), a: ep(t, 4.4, 4.8), bad: C.ink });
    { const [x, y, w, h] = [rx, 600, rw, 240], a = shcTA(t, 0.25, 1);
      demoWindow(x, y, w, h, a);
      text('One arm, edge on', x + 32, y + 44, { role: 'label', size: 19, color: C.mute, alpha: a });
      const d = R.arm.snap[0] * ep(t, 5.4, 6.2, E.io3), crack = ep(t, 6.2, 6.8, E.out3);
      shcArmZoom(t, x, y + 62, w, 104, d, crack, ep(t, 0.9, 1.4) * a);
      const ks = ep(t, 6.4, 7.0);
      rich([{ s: fmtN(R.arm.snap[0], 2), font: 'disp', size: 52, weight: 800, color: C.ink, tnum: true }, { s: 'mm', font: 'disp', size: 24, weight: 700, color: C.mute, gap: 8, caps: false }], x + 32, y + 212, { alpha: ks });
      text('at its tip takes the root to 483 MPa. It snaps.', x + 236, y + 186, { role: 'small', size: 22, weight: 600, color: C.ink2, maxW: w - 268, lh: 1.25, alpha: ks });
      /* the lens: from the hot root in the middle panel to here */
      if (lens.root) { const kl = ep(t, 5.0, 5.6, E.cam), end = [x, y + 114];
        if (kl > 0) { G.save(); G.globalAlpha = 0.55 * kl * (1 - 0.6 * ep(t, 7.5, 8.5)); G.setLineDash([5, 6]); G.strokeStyle = C.bad; G.lineWidth = 1.5; G.beginPath(); G.moveTo(lens.root[0], lens.root[1]); G.lineTo(lerp(lens.root[0], end[0], kl), lerp(lens.root[1], end[1], kl)); G.stroke(); G.setLineDash([]); G.restore(); circle(lens.root[0], lens.root[1], 18, { color: C.bad, w: 2, alpha: kl * 0.9 }); }
      }
    }
    /* ---- the meter: this step on the strip, one line across the foot ---- */
    shellMeter(t, 7.2, 'board', LM, 872, RM - LM, { row: true });
    source(t, '2D frames solved in this page: the shell at board height from above (CF-PP rim 13.5 GPa; FR4 board 19 GPa, 1.0 mm), loaded by a transverse arch under 7.5 N of a 10 N crown press; one arm as a fixed-guided 4 × 1.0 mm FR4 beam (483 MPa, Gund).', { t0: 1.6 });
  }
});

/* ============================== 4. keep the mass low, near the fingers (#95, #40) ==============================
   The fingers push the mouse at its sides, 12 mm up (the grip of the side-wall study, shbSides); in a flick its mass pushes
   back at its centre of mass. The height between the two is a lever: the twist is m · a · lever, so at any flick the twist
   falls as the lever does. Theseus's 29.31 g, part by part at its height (shcMassModel); the pointer moves the 8 g battery from
   the hump down to board height in the tail, behind the board, where the 3D layout puts it (z −35.2 to −10.2 mm, 35 mm across,
   its centre 7.46 mm up; the board ends at z −7.9), and the centre of mass drops onto the grip. Drawn on the study shell, cut
   across at z = −14 mm, through the battery and behind the board (so the board is not in the cut); a small plan shows where. */
const SHC_CG0 = { grip: 12, high: 20, low: 7.46, boardY: 5, shellY: 16.07, btnY: 23.31, wheelY: 22, screwY: 8, wireY: 10 };
/** Theseus's weight budget, taken from the intro's own (ntr_budget, 14-b-intro-ex.js) so the two can't drift apart: the battery
   from Jauch, the board Brock's figure, the buttons, screws and wires as XBAB weighed them in the XA25, the magnesium wheel on
   its POM axle and the four brass inserts as the intro derives them, the shell and skates what is left. The fallback (a build
   without the intro) uses the same figures */
function shcBudget() {
  if (SHC.bud) return SHC.bud;
  const NB = typeof ntr_budget === 'function' ? ntr_budget() : null;
  if (NB && NB.ok) {
    const cell = { part: NB.cell.part, mAh: NB.cell.mAh, g: NB.cell.g, t: 4.0 };
    return (SHC.bud = { cell, btn: NB.xa.btn, wheel: NB.wheel, screws: NB.xa.screws, wires: NB.xa.fpc, ins: NB.ins, shell: NB.shell });
  }
  const RD0 = typeof RDATA !== 'undefined' ? RDATA : {}, b = ((RD0.weights || {}).breakdowns || []).find(x => /XA25/.test(x.mouse));
  const by = (re, d) => { const p = b && b.parts.find(q => re.test(q.part)); return p ? +shcV(p.mass) : d; };
  const cr = (((RD0.batteries || {}).jauch_lipo_family || {}).rows || []).find(r => r.part === 'LP402535JU');
  const cell = { part: 'LP402535JU', mAh: cr ? +shcV(cr.capacity) : 370, g: cr ? +shcV(cr.mass) : 8, t: 4.0 };
  const btn = by(/^Button/, 3.328), wheel = 1.580, ins = 0.516, screws = by(/^Screws/, 0.708), wires = by(/^FPC/, 0.121);
  return (SHC.bud = { cell, btn, wheel, screws, wires, ins, shell: THESEUS.mass - cell.g - THESEUS.pcb - btn - wheel - ins - screws - wires });
}
/** the centre of mass's height with the cell's centre at y (mm), and the two layouts */
function shcCg() {
  if (SHC.cg) return SHC.cg;
  /* the wheel at wheel height, the brass inserts with the screws they take */
  const B = shcBudget(), K = SHC_CG0, small = B.wheel + B.screws + B.ins + B.wires;
  const parts = [[B.shell, K.shellY], [B.btn, K.btnY], [THESEUS.pcb, K.boardY], [small, (B.wheel * K.wheelY + (B.screws + B.ins) * K.screwY + B.wires * K.wireY) / small]];
  const m0 = parts.reduce((s, p) => s + p[0], 0), my0 = parts.reduce((s, p) => s + p[0] * p[1], 0), at = y => (my0 + B.cell.g * y) / (m0 + B.cell.g);
  const hi = at(K.high), lo = at(K.low), lvHi = hi - K.grip, lvLo = lo - K.grip;
  return (SHC.cg = { B, at, hi, lo, lvHi, lvLo, cut: 1 - Math.abs(lvLo) / Math.abs(lvHi) });
}
/* the study shell cut across at z = −14 mm, as the side-wall study cuts it: its outer surface, right half, [x, y] mm, bottom
   to top (sliced from 3d/lattice's moulded body; the widest line is 12 mm up) */
const SHC_SEC = [[27.0, 0.6], [27.8, 1.6], [28.8, 2.6], [29.7, 3.6], [30.2, 4.6], [30.5, 6.6], [30.7, 8.6], [30.8, 10.6], [30.8, 12.6], [30.7, 14.6], [30.5, 16.6], [30.3, 18.6], [29.9, 20.6], [29.35, 22.6], [28.76, 24.6], [27.85, 26.6], [27.0, 28.4], [25.5, 30.0], [24.0, 31.1], [22.5, 32.2], [21.0, 33.3], [19.5, 34.05], [18.0, 34.7], [16.5, 35.16], [15.0, 35.84], [13.5, 36.3], [12.0, 36.7], [10.5, 36.96], [9.0, 37.2], [7.5, 37.53], [6.0, 37.78], [3.0, 38.03], [0, 38.12]];
/** the wall band: the outer surface and the inner one, 1.2 mm thick at the foot to 0.9 at the crown (the study's grading) */
function shcSecBand() {
  if (SHC.band) return SHC.band;
  const R = SHC_SEC, inner = R.map((p, i) => { const a = R[Math.max(0, i - 1)], b = R[Math.min(R.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, T = lerp(1.2, 0.9, clamp(p[1] / 38)); return [Math.max(0, p[0] - dy / L * T), p[1] + dx / L * T]; });
  inner[inner.length - 1][0] = 0;
  const outer = R.concat(R.slice(0, -1).reverse().map(p => [-p[0], p[1]])), inn = inner.concat(inner.slice(0, -1).reverse().map(p => [-p[0], p[1]]));
  return (SHC.band = { outer, inner: inn });
}
/** the centre-of-mass mark: a circle quartered, two quarters filled */
function shcCgMark(x, y, r, col, a, hollow) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a;
  if (!hollow) { G.fillStyle = col; G.beginPath(); G.moveTo(x, y); G.arc(x, y, r, -Math.PI / 2, 0); G.closePath(); G.fill(); G.beginPath(); G.moveTo(x, y); G.arc(x, y, r, Math.PI / 2, Math.PI); G.closePath(); G.fill(); }
  G.strokeStyle = col; G.lineWidth = 2.4; G.beginPath(); G.arc(x, y, r, 0, TAU); G.stroke();
  G.restore();
}
/** a flick: the mouse slides D mm in T seconds, from rest to rest (x = D (u − sin 2πu / 2π)); returns [x, a], a in −1..1 */
function shcFlick(t, t0, T, D) { const u = clamp((t - t0) / T); return [D * (u - Math.sin(TAU * u) / TAU), t > t0 && t < t0 + T ? Math.sign(D) * Math.sin(TAU * u) : 0]; }
S({
  id: 'mass', replaces: 'mass', after: 'shlGrams', ch: 'shell', theme: 'paper', title: 'Keep the mass low, near the fingers', settle: 9.5, ideas: [95],
  src: ['shcMassModel', 'ntrJauch', 'exXbabWeight', 'shcBrock', 'shlLattice', 'shlDoc'],
  draw: t => {
    const Q = shcCg(), K = SHC_CG0, pct = Math.round(Q.cut * 100), kMove = ep(t, 4.4, 5.4, E.io3);
    header(t, 'Keep the mass low, near the fingers');
    captions(t, [[0.6, 'Your fingers push the mouse at its sides, 12 mm up. In a flick its mass pushes back at its centre of mass, higher up.'], [3.6, 'The height between them is a lever, and every flick twists the mouse around it. Move the 8 g battery down to board height, in the tail behind the board.'], [6.0, 'The centre of mass drops to the grip, in line with the sensor. The flick goes nearly straight through it: almost no twist, at the same weight.']]);
    /* ---- left: the headline and the two before → after rows ---- */
    const lx = LM, lw0 = 560;
    shellHL(t, 5.6, lx, 420, '−' + pct + '%', 'twist', { size: 140, sub: 'In every flick, at the same ' + THS.massG + '.', maxW: lw0 });
    shellBA(t, lx, 600, { label: 'Lever, centre of mass to the grip {(lower is better)}', before: fmtN(Q.lvHi, 1), after: fmtN(lerp(Q.lvHi, Q.lvLo, kMove), 1), unit: 'mm', size: 60, k: kMove, a: ep(t, 1.6, 2.0), bad: C.bad });
    shellBA(t, lx, 716, { label: 'Centre of mass, above the pad', before: fmtN(Q.hi, 1), after: fmtN(lerp(Q.hi, Q.lo, kMove), 1), unit: 'mm', size: 48, k: kMove, a: ep(t, 1.8, 2.2), bad: C.ink });
    glossBox(t, 6.6, lx, 760, lw0, 'Centre of mass', 'The one point where the mouse\'s weight acts. Push through it and the mouse slides; push above or below it and it twists.', { h: 200, size: 23 });
    /* ---- right: the section, the fingers, the cell, the flick ---- */
    const [x, y, w, h] = [680, 280, RM - 680, 680], a = shcTA(t, 0.25, 0);
    demoWindow(x, y, w, h, a);
    const s = 13, cx0 = x + w / 2, padY = y + h - 86, cellY = lerp(K.high, K.low, kMove), hc = Q.at(cellY), lever = hc - K.grip;
    /* two flicks before the move, two after: the mouse slides, and twists by its lever (drawn large to be seen) */
    const fl = [shcFlick(t, 1.9, 0.8, 7), shcFlick(t, 2.7, 0.8, -7), shcFlick(t, 6.4, 0.8, 7), shcFlick(t, 7.2, 0.8, -7)];
    const xo = fl.reduce((sm, f) => sm + f[0], 0), acc = fl.reduce((sm, f) => sm + f[1], 0), roll = 6 * Math.PI / 180 * acc * lever / Q.lvHi;
    const X = (px, py) => [cx0 + (px + xo) * s, padY - py * s];
    /* the pad */
    { const kp = ep(t, 0.5, 0.9); rr(x + 24, padY, w - 48, 22, 4, inkA(TH ? 0.07 : 0.1), null, 0, kp * a); line(x + 24, padY, x + w - 24, padY, { color: inkA(0.3), w: 1.5, alpha: kp * a }); text('Mouse pad', x + w - 40, padY + 54, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kp * a }); }
    G.save();
    /* the roll pivots on the edge that presses down (the top lags, the far edge lifts) */
    { const pv = X(roll > 0 ? -27 : 27, 0.6); G.translate(pv[0], pv[1]); G.rotate(-roll); G.translate(-pv[0], -pv[1]); }
    const ks = ep(t, 0.6, 1.2, E.snap);
    /* the shell wall, cut */
    { const Bd = shcSecBand(); G.save(); G.globalAlpha = a * ks; G.beginPath(); Bd.outer.forEach((p, i) => { const q = X(p[0], p[1]); i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); }); Bd.inner.slice().reverse().forEach(p => { const q = X(p[0], p[1]); G.lineTo(q[0], q[1]); }); G.closePath(); G.fillStyle = TH ? '#3B3C41' : '#8C8D93'; G.fill(); G.restore(); }
    /* the board ends 6 mm ahead of this cut (z −7.9), so it is not drawn in it: the plan in the corner shows where it is */
    /* where the cell was, once it has moved */
    if (kMove > 0.02) { const q0 = X(-17.5, K.high + 2), q1 = X(17.5, K.high - 2); G.save(); G.globalAlpha = a * 0.6 * kMove; G.setLineDash([6, 6]); rrPath(q0[0], q0[1], q1[0] - q0[0], q1[1] - q0[1], 5); G.strokeStyle = inkA(0.45); G.lineWidth = 1.6; G.stroke(); G.setLineDash([]); G.restore(); }
    /* the cell */
    const c0 = X(-17.5, cellY + 2), c1 = X(17.5, cellY - 2), kc = ep(t, 1.0, 1.4);
    rr(c0[0], c0[1], c1[0] - c0[0], c1[1] - c0[1], 5, TH ? '#26272B' : '#D9D8D3', null, 0, a * kc);
    text('Battery, ' + fmtN(Q.B.cell.g, 0) + ' g', (c0[0] + c1[0]) / 2, (c0[1] + c1[1]) / 2 + 7, { role: 'label', size: 19, color: TH ? '#F3F2EE' : '#111111', align: 'center', alpha: a * kc });
    /* the fingers, grey, pressing the low sides at the grip */
    { const kf3 = ep(t, 1.0, 1.5, E.snap), [g0, g1] = shcSkin();
      for (const sd of [-1, 1]) {
        const e = X(sd * 30.9, K.grip), L = 13 * s, hh = 9.5 * s, x0 = sd < 0 ? e[0] - L - (1 - kf3) * 60 : e[0] + (1 - kf3) * 60, xin = sd < 0 ? x0 + L : x0, xout = sd < 0 ? x0 : x0 + L;
        G.save(); G.globalAlpha = a * kf3; rrPath(sd < 0 ? x0 - L : x0, e[1] - hh / 2, 2 * L, hh, hh / 2);
        const gr = G.createLinearGradient(xin, 0, xout, 0); gr.addColorStop(0, g0); gr.addColorStop(0.55, g1); gr.addColorStop(1, rgba(g1, 0)); G.fillStyle = gr; G.fill(); G.restore();
        /* the fingertip's rounded end, outlined where it meets the wall */
        G.save(); G.globalAlpha = a * kf3 * 0.5; G.strokeStyle = inkA(0.35); G.lineWidth = 1.4; G.beginPath(); G.arc(xin + sd * hh / 2, e[1], hh / 2, sd < 0 ? -Math.PI / 2 : Math.PI / 2, sd < 0 ? Math.PI / 2 : Math.PI * 1.5); G.stroke(); G.restore();
      }
    }
    G.restore();
    /* the grip line, the lever and the centre of mass, drawn on the moving mouse (the roll is small, so they ride with xo) */
    const gpL = X(-30.9, K.grip), gpR = X(30.9, K.grip), kg = ep(t, 1.2, 1.6);
    line(gpL[0], gpL[1], gpR[0], gpR[1], { color: C.ink2, w: 1.6, dash: [7, 6], alpha: a * kg });
    text('Grip, 12 mm up', X(-30.9 - 13, K.grip)[0], gpL[1] - 4.75 * s - 18, { role: 'label', size: 19, color: C.ink2, alpha: a * kg });
    const pc = X(0, hc), kcm = ep(t, 1.3, 1.7), still = 1 - clamp(Math.min(kMove, 1 - kMove) / 0.06);   /* labels step aside while the cell moves */
    /* the old centre, hollow, once it has moved */
    if (kMove > 0.02) { const po = X(0, Q.hi); shcCgMark(po[0], po[1], 13, inkA(0.45), a * kMove, true); }
    /* the lever: from the grip to the centre of mass */
    { const xb = X(5.5, 0)[0], yg = gpR[1], kl = ep(t, 1.5, 1.9), bad = clamp(lever / Q.lvHi), col = bad > 0.5 ? C.bad : C.hero, tc = bad > 0.5 ? C.bad : C.heroText;
      const kb2 = a * kl * still;
      line(xb, yg, xb, pc[1], { color: col, w: 3, alpha: kb2 }); line(xb - 8, yg, xb + 8, yg, { color: col, w: 3, alpha: kb2 }); line(xb - 8, pc[1], xb + 8, pc[1], { color: col, w: 3, alpha: kb2 });
      line(pc[0] + 16, pc[1], xb - 8, pc[1], { color: col, w: 1.4, dash: [4, 5], alpha: kb2 * 0.8 });
      rich([{ s: fmtN(lever, 1), font: 'disp', size: 34, weight: 800, color: tc, tnum: true }, { s: 'mm lever', role: 'label', size: 19, color: tc, gap: 8 }], xb + 18, Math.min((yg + pc[1]) / 2 + 12, yg - 12), { alpha: a * kl * still });
    }
    shcCgMark(pc[0], pc[1], 14, kMove > 0.5 ? C.hero : C.ink, a * kcm);
    text('Centre of mass', pc[0] - 26, pc[1] + 26, { role: 'label', size: 19, color: kMove > 0.5 ? C.heroText : C.ink, align: 'right', alpha: a * kcm * still });
    /* in a flick: the push at the grip, the mass lagging at its centre */
    if (Math.abs(acc) > 0.05) {
      const kA = Math.abs(acc), dir = Math.sign(acc), fx = dir > 0 ? gpL : gpR;
      /* the push, on the finger that pushes (it sits by the edge the mouse pivots on); the mass's lag, over its centre */
      const f0 = X(-dir * (30.9 + 10), K.grip), f1 = X(-dir * (30.9 + 1.2), K.grip);
      arrow(f0[0], f0[1], f1[0], f1[1], { color: C.ink, w: 3.4, hs: 13, alpha: a * kA });
      arrow(pc[0], pc[1] - 24, pc[0] - dir * (30 + 50 * kA), pc[1] - 24, { color: C.ink2, w: 2.4, hs: 10, alpha: a * kA * 0.8 });
    }
    /* the pointer moves the battery down to board height, in the tail */
    { const ch = X(0, K.high), cl = X(0, K.low), grab = t > 4.2 && t < 5.45;
      const p = kf(t, [[3.5, [x + w - 300, y + 120]], [4.15, [ch[0] + 40, ch[1] + 4]], [4.4, [ch[0] + 40, ch[1] + 4]], [5.4, [cl[0] + 40, cl[1] + 4]], [5.6, [cl[0] + 40, cl[1] + 4]], [6.2, [x + w - 320, y + 150]]], E.cam);
      cursorPtr(p[0], p[1], { a: ep(t, 3.4, 3.7) * (1 - ep(t, 5.9, 6.2)), grab, press: t > 4.15 && t < 4.6 ? prog(t, 4.15, 4.6) : 0 });
    }
    text('Twist drawn large to be seen', x + 32, y + 48, { role: 'label', size: 19, color: C.faint, alpha: a * ep(t, 2.0, 2.4) });
    /* where it all sits, from above: the battery in the tail behind the board, the sensor, and this cut (A) through the battery */
    keyPlan(t, 1.2, x + w - 96, y + 132, { s: 1.0, hi: ['battery'], accent: C.hero, cut: { y: 14, label: 'A' }, label: 'From above' });
    source(t, 'Mass model, the weight budget\'s parts at their heights: shell and skates 16.1 mm, buttons 23.3, wheel 22, board 5, screws and inserts 8, battery 7.5 behind the board or 20 in the hump.', { t0: 2.0 });
  }
});
