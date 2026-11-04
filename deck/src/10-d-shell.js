/* ============================== shell and structure ==============================
   What the shell is made of, how thin a mold can make it, the lattice inside it (triangles, filleted, as arches),
   the board as a tie, fewer parts, a solid skin, and where its grams go. Ideas #5 6 15 26 31 53 55 57 58 75 93 94
   95 96 97 (and #98 with the solid shell). The idea sheets for #6 #26 #58 #31 #93 #55 are in 12-20-shell.js.
   3D: the 'lattice' scene (3d/lattice) for the cutaway, the rib growth, the stress view, triangles against hexagons
   and the filleted node; the 'shell' scene for the exploded parts. Every FE number from it is "derived, this model". */

Object.assign(SRC, {
  shlRtingsSoraUlx: { t: 'RTINGS, Ninjutso Sora V2 vs Finalmouse ULX Pro Series: "The Finalmouse flexes and creaks with pressure, while the Ninjutso feels solid."', u: 'https://www.rtings.com/mouse/tools/compare/ninjutso-sora-v2-vs-finalmouse-ulx-pro-series/50319/58188' },
  shlSoraV3: { t: 'Ninjutso, Sora V3 product page: "an ultra-thin shell that\'s supported by the endoskeleton supporting structure", "2x more rigid structure-wise", 40 g (maker claims)', u: 'https://ninjutso.com/products/sora-v3-wireless-ultralight-gaming-mouse' },
  shlB2gSlx: { t: 'Back2Gaming, Finalmouse Starlight X review: "rigid unibody main shell made of three components instead of the previous four-part assembly"; "carbon fiber super composite with a density below 0.9 g/cm³"; openings "limited to a few cutouts flanking the scroll wheel and the inner edges of the main buttons"; honeycomb "confined to the underside"; 15 titanium screws of about 0.02 g; 41.58 g measured', u: 'https://www.back2gaming.com/review/finalmouse-starlight-x-nightfall-wireless-mouse/' },
  shlLattice: { t: 'This deck, the Theseus lattice study (3d/lattice): linear stiffened-shell finite elements (CST and DKT shells, eccentric rib beams), 9,508 nodes, Pyrofil PP-C-20A modulus 13.5 GPa; 10 N on the crown over a 10 mm pad, the same 7 mm right and 6 mm forward, and 10 N inward on each side at the grip; hexagons width-scaled 0.944 to the same 5.17 g of ribs; masses from the moulded geometry at 1.01 g/cm³', n: 'derived, this model' },
  shlPyrofil: { t: 'PlaBase (Mitsubishi Chemical), Pyrofil PP-C-20A: 1.01 g/cm³, flexural modulus 13,500 MPa, MVR 13 cm³/10 min, notched Charpy 6 kJ/m²; strength values behind a login', u: 'https://en.plabase.com/plastic/items/6577ab7a86df1821ce54dafc' },
  shlKyron: { t: 'Mitsubishi Chemical America: KyronMAX compounds with "tensile strengths that exceed 60,000 psi (414 MPa)" (maker claim)', u: 'https://us.mitsubishi-chemical.com/injection-moldable-material-exceeds-60000-psi-tensile-strength/' },
  shlFr4: { t: 'The Gund Company, NEMA FR4: 1.85 g/cm³, tensile 430 MPa lengthwise, flexural modulus 20 GPa lengthwise and 18 GPa crosswise', u: 'https://thegundcompany.com/wp-content/uploads/2024/03/NEMA-FR4-Glass-Epoxy-Laminate-by-The-Gund-Co.pdf' },
  shlEnvalior: { t: 'Envalior (resin maker), radii and chamfers: inside radius 25 to 60% of the nominal wall, the upper end for load-bearing parts, at least 0.5 mm; stress concentration about 1.5 at r = 0.5 t, about 3 at r = 0.1 t', u: 'https://www.envalior.com/en-us/radii-and-chamfers' },
  shlYizumi: { t: 'Yizumi (machine maker), thixomolding vs die casting: minimum wall 0.3 to 0.5 mm for thixomolding, over 1.5 mm for die casting (vendor claim)', u: 'https://www.yizumi.com/en/news/product/IMM/thixomolding-vs-die-casting' },
  shlMylar: { t: 'TAP Plastics, Mylar technical data: 1.39 g/cm³, 21,000 in²/lb, properties for 92-gauge (23 µm) general-use film', u: 'https://www.tapplastics.com/uploads/pdf/Tech_Data-_Mylar.pdf' },
  shlZkM1k: { t: 'Zaunkoenig, "M1K weight in review", 31 Aug 2020: carbon fibre shell 7.5 g; 3D-printed bottom shell 5.6 to 5.9 g regular, 4.0 to 4.2 g lightweight (maker figures, first 333 units)', u: 'https://zaunkoenig.co/blog/m1k-weight-in-review' },
  shlNimbus: { t: 'Notebookcheck on Vaidemi\'s DIY Nimbus: 29 g with skates and paint, a hole-less SLA resin shell over an internal skeleton, 30 kg load (community build)', u: 'https://www.notebookcheck.net/YouTuber-embarrasses-big-gaming-mouse-brands-with-29-g-ultralight-mouse-with-no-holes.1011756.0.html' },
  shlZeromouse: { t: 'Notebookcheck on the Zeromouse V35 kit: the battery moved to reduce the moment arm (community build)', u: 'https://www.notebookcheck.net/YouTuber-builds-16-g-gaming-mouse-and-you-can-buy-one-sort-of.876113.0.html' },
  shlDoc: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse": ideas, reasoning and comment threads (Lamzu Maya front struts, G-Wolves HTS Plus bottom sticker, Krytox 205 on newer ULX batches, Poron pads, a mouse that works with no bottom plate)', u: '', n: 'research/brock-doc-in-pursuit.txt and brock-doc-comments.txt' }
});

/* ---------- helpers ---------- */
const SHL = { R: 69.83, C0: [0, 19.075, -0.04], primed: new Set(), no3d: typeof location !== 'undefined' && /[?&]no3d=1/.test(location.search) };
const SHL_DEF = { lattice: { cut: 0, build: 1, stress: 0, stressCase: 'press', compare: 'tri', filletZoom: 0 }, shell: { explode: 0, xray: 0, scroll: 0 } };
const SHL_RAMP = ['#26272b', '#5b4314', '#a8730b', '#fdc316', '#fff2c2'];
/** view3D with every state key given (a key left out would keep the last slide's value) and one unseen first render:
   that render frames the lattice as a single shell (so 'both' never changes the framing) and switches on three.js's
   local clipping before the cut is drawn. o.alpha fades it. */
function shl3D(key, t, x, y, w, h, st, o = {}) {
  const s = Object.assign({}, SHL_DEF[key] || {}, st);
  if (SHL.no3d) { v3Wait(x, y, w, h, key, t); return false; }
  const theme = o.theme || (TH ? 'paper' : 'night'), id = key + '|' + theme;
  if (!SHL.primed.has(id) && typeof R3D !== 'undefined' && R3D.has(key) && R3D.ready(key, theme)) {
    const k = (APP.scale || 1) * (APP.dpr || 1) * (o.res || 1);
    try { R3D.render(key, t, Object.assign({}, s, key === 'lattice' ? { compare: 'tri' } : {}), Math.max(64, Math.round(w * k)), Math.max(36, Math.round(h * k)), theme); } catch (e) { }
    SHL.primed.add(id);
  }
  return view3D(key, t, x, y, w, h, s, o);
}
/** where a lattice point (mm) lands on the stage, by the same camera rule as 3d/integration (framed once on the single shell) */
function shlProj(st, box, p) {
  const V = { top: [0, 1, 0.0001], bottom: [0, -1, 0.0001], front: [0, 0.12, 1], back: [0, 0.12, -1], left: [-1, 0.08, 0], right: [1, 0.08, 0], threeQuarter: [-0.78, 0.62, 0.95], threeQuarterRight: [0.78, 0.62, 0.95], low: [-0.9, 0.22, 0.75] };
  const nrm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  let d = nrm(Array.isArray(st.view) ? st.view : V[st.view || 'threeQuarter']);
  const yw = st.yaw || 0, cy = Math.cos(yw), sy = Math.sin(yw); d = [d[0] * cy + d[2] * sy, d[1], -d[0] * sy + d[2] * cy];
  if (st.pitch) { const r0 = cross(d, [0, 1, 0]), l = Math.hypot(r0[0], r0[1], r0[2]); if (l > 1e-3) { const k = r0.map(v => v / l), c = Math.cos(st.pitch), s = Math.sin(st.pitch), kd = dot(k, d), kx = cross(k, d); d = [0, 1, 2].map(i => d[i] * c + kx[i] * s + k[i] * kd * (1 - c)); } }
  const fov = st.fov || 22, T = st.target ? st.target.slice() : SHL.C0.slice(); if (st.lift) T[1] += st.lift;
  const asp = box[2] / box[3], dist = SHL.R * 1.12 / Math.sin(fov / 2 * Math.PI / 180) / Math.min(1, asp) / (st.zoom || 1);
  const Cm = T.map((v, i) => v + d[i] * dist), up = Math.abs(d[1]) > 0.99 ? [0, 0, -Math.sign(d[1])] : [0, 1, 0];
  const f = nrm(T.map((v, i) => v - Cm[i])), r = nrm(cross(f, up)), u = cross(r, f), q = p.map((v, i) => v - Cm[i]), th = Math.tan(fov / 2 * Math.PI / 180);
  const zc = dot(q, f);
  return [box[0] + (dot(q, r) / (zc * th * asp) + 1) / 2 * box[2], box[1] + (1 - dot(q, u) / (zc * th)) / 2 * box[3]];
}
/** a yellow chip: the name of the Theseus thing on screen */
function shlChip(x, y, s, a = 1, align) { return rich([{ s, role: 'label', size: 21, color: '#111111', chip: YEL }], x, y, { alpha: a, align }); }
/** a figure label: mono number, then a sentence */
function shlFig(t, t0, x, y, n, s, o = {}) { const a = ep(t, t0, t0 + 0.4); rich([{ s: 'Fig. ' + n, role: 'label', size: 21, color: o.color || C.mute }, { s, role: 'small', size: 25, weight: 500, color: C.faint, sentence: true, gap: 16 }], x, y, { alpha: a, align: o.align }); }
/** a value bar on a track: o = { x, y (centre), w, max, v, lo, hi, col, h, a, k, dash, edge } → returns the x of its end */
function shlBar(o) {
  const h = o.h || 14, a = o.a == null ? 1 : o.a, k = o.k == null ? 1 : o.k, X = v => o.x + o.w * clamp(v / o.max);
  if (o.track !== false) rr(o.x, o.y - h / 2, o.w, h, h / 2, C.track, null, 0, a);
  const lo = o.lo != null ? o.lo : o.v, hi = o.hi != null ? o.hi : o.v, xe = X(hi);
  if (o.dash) { G.save(); G.globalAlpha = a; G.setLineDash([6, 5]); G.strokeStyle = o.col; G.lineWidth = 2; rrPath(o.x, o.y - h / 2, Math.max(h, (X(hi) - o.x) * k), h, h / 2); G.stroke(); G.setLineDash([]); G.restore(); }
  else {
    if (hi !== lo) rr(o.x, o.y - h / 2, Math.max(h, (X(hi) - o.x) * k), h, h / 2, rgba(o.col, 0.38), null, 0, a);
    rr(o.x, o.y - h / 2, Math.max(h, (X(lo) - o.x) * k), h, h / 2, o.col, o.edge || null, 1.5, a);
  }
  return o.x + (xe - o.x) * k;
}
/** the stress scale of the lattice study, drawn in 2D beside the render */
function shlRamp(t, t0, x, y, w, max, title) {
  const a = ep(t, t0, t0 + 0.4); if (a <= 0.003) return;
  const g = G.createLinearGradient(x, 0, x + w, 0); SHL_RAMP.forEach((c, i) => g.addColorStop(i / 4, c));
  G.save(); G.globalAlpha = a; G.fillStyle = g; rrPath(x, y, w, 10, 5); G.fill(); G.strokeStyle = inkA(0.25); G.lineWidth = 1; G.stroke(); G.restore();
  text(title, x, y - 14, { role: 'label', size: 19, color: C.mute, alpha: a });
  text('0', x, y + 34, { role: 'tick', size: 19, color: C.mute, alpha: a });
  text(max + ' MPa', x + w, y + 34, { role: 'tick', size: 19, color: C.mute, align: 'right', alpha: a });
}
/** a card: panel and its Kunai head. returns the y under the head */
function shlCard(t, t0, x, y, w, h, label, kinds, o = {}) {
  demoWindow(x, y, w, h, ep(t, t0, t0 + 0.4), { hero: o.hero });
  return cardHead(t, t0 + 0.2, x, y, w, label, kinds, o);
}
/** a small numbered step: big number, label, a line under it */
function shlStep(t, t0, x, y, n, head, body, w, A) {
  const k = ep(t, t0, t0 + 0.4);
  text(pad2(n), x, y + 8, { font: 'disp', size: 34, weight: 800, color: A, alpha: k, tnum: true });
  text(head, x + 58, y - 6, { role: 'label', size: 21, color: C.ink, alpha: k });
  return text(body, x + 58, y + 26, { role: 'small', size: 25, color: C.ink2, t, t0: t0 + 0.1, cps: 140, maxW: w - 58, lh: 1.3 });
}

/* ============================== 0. the chapter card: the lattice grows inside the shell ============================== */
S({
  id: 'shellcard', ch: 'shell', card: true, theme: 'night', title: 'Shell and structure', settle: 6, three: ['lattice'],
  draw: t => {
    chapterCard(t, {
      name: 'Shell', gloss: 'What the mouse is made of, and how it carries a hand pressing on it.',
      list: [[5, 'Carbon-filled polypropylene'], [75, 'Triangles, filleted, not hexagons'], [53, 'Arched, connected ribbing'], [94, 'The board as a structural tie'], [93, 'Walls thicker near the bottom'], [57, 'One body where there were parts'], [15, 'A fully solid shell'], [31, 'A bottom plate you can leave off'], [95, 'Mass low, near the fingers']]
    });
    const cx = 1380, cy = 560, bw = 760, bh = 470;
    shl3D('lattice', t, cx - bw / 2, cy - bh / 2, bw, bh, { view: 'left', cut: 1, build: ep(t, 1.3, 4.4, E.io3), zoom: 1.72, yaw: 0.2 * Math.sin(t * 0.35), pitch: 0.05 }, { alpha: ep(t, 0.9, 1.5) });
    shlFig(t, 3.4, cx, cy + 300, '01', 'The study shell, cut open, its ribs grown one by one', { align: 'center' });
  }
});

/* ============================== 1. materials: stiffness per gram for a panel (#5, #6, #94) ============================== */
const SHL_MATS = [
  { name: 'KyronMAX, 30% carbon', sub: 'ULX-class · 21–41 GPa', E: [21, 41], rho: [1.33, 1.28], dash: true, star: true },
  { name: 'Pyrofil PP-C-20A', sub: 'Theseus · 13.5 GPa', E: [13.5], rho: [1.01], hero: true },
  { name: 'Magnesium AZ91D', sub: 'Metal shells · 46 GPa', E: [46], rho: [1.81, 1.7], ref: true },
  { name: 'PPS, 30% carbon', sub: 'Pro triggers, #6 · 17 GPa', E: [17], rho: [1.4] },
  { name: 'FR4 board core', sub: 'The PCB, #94 · 18–20 GPa', E: [18, 20], rho: [1.85] },
  { name: 'ABS', sub: 'Most mice · 2.55 GPa', E: [2.55], rho: [1.05] },
  { name: 'SLX composite', sub: 'Below 0.9 g/cm³, claimed', none: true }
];
const shlIdx = m => { const v = []; for (const e of m.E) for (const r of m.rho) v.push(Math.cbrt(e) / r); return [Math.min(...v), Math.max(...v)]; };
S({
  id: 'materials', ch: 'shell', theme: 'paper', title: 'Stiffness per gram, for a thin shell', settle: 9, ideas: [5, 6, 94],
  src: ['shlPyrofil', 'denkaAbs', 'shlKyron', 'kyron', 'az91d', 'shlFr4', 'cfpps', 'shlB2gSlx', 'ashby06'],
  draw: t => {
    header(t, 'Stiffness per gram, for a thin shell');
    captions(t, [[0.6, 'A shell is a thin curved panel, so the fair comparison is stiffness at equal mass, not stiffness alone.'], [4.6, 'By that measure 20% carbon PP leads every material with published numbers, and it is 5.3× stiffer than ABS by modulus.']]);
    const A = acc();
    /* left: the Ashby index, every bar computed from its datasheet inputs */
    { const x = LM, y = LAY.top, w = 1060, h = 580, hy = shlCard(t, 0.3, x, y, w, h, 'Panel stiffness at equal mass, {E^(1/3)/ρ}', ['datasheet', 'derived']);
      const k0 = ep(t, 0.9, 1.3);
      text('E: flexural modulus, GPa. ρ: density, g/cm³. Longer is stiffer per gram.', x + 26, hy + 14, { role: 'small', size: 25, color: C.mute, alpha: k0 });
      const nx = x + 26, bx = x + 460, bw = w - 460 - 170, y0 = hy + 96, rh = 56, max = 2.8;
      for (const v of [0, 1, 2]) { const gx = bx + bw * v / max; line(gx, y0 - 38, gx, y0 + rh * SHL_MATS.length - 34, { color: C.hair, w: 1.2, alpha: k0 }); text(String(v), gx, y0 - 46, { role: 'tick', size: 19, color: C.faint, align: 'center', alpha: k0 }); }
      SHL_MATS.forEach((m, i) => {
        const yy = y0 + i * rh, t0 = 1.2 + i * 0.14, a = ep(t, t0, t0 + 0.4), k = ep(t, t0 + 0.1, t0 + 0.9, E.snap);
        text(m.name, nx, yy - 2, { role: 'small', size: 25, weight: m.hero ? 800 : 600, color: C.ink, alpha: a });
        text(m.sub, nx, yy + 22, { role: 'label', size: 19, color: m.hero ? C.heroText : C.mute, alpha: a });
        if (m.none) { text('No modulus published', bx, yy, { role: 'label', size: 19, color: C.faint, alpha: a }); return; }
        const [lo, hi] = shlIdx(m), col = m.hero ? YEL : m.ref ? C.ink : C.comp;
        const xe = shlBar({ x: bx, y: yy - 8, w: bw, max, lo, hi, col, h: 16, a, k, dash: m.dash, edge: m.hero ? '#111111' : null });
        const lab = lo.toFixed(2) === hi.toFixed(2) ? hi.toFixed(2) : lo.toFixed(2) + '–' + hi.toFixed(2) + (m.star ? '*' : '');
        text(lab, xe + 12, yy, { font: 'mono', size: 24, weight: m.hero ? 800 : 600, color: C.ink, alpha: clamp(k * 1.4 - 0.3) });
      });
      text('* KyronMAX density unpublished: 1.28 to 1.33 g/cm³ assumed.', x + 26, y + h - 18, { role: 'small', size: 25, color: C.faint, alpha: ep(t, 2.6, 3.0) });
    }
    /* right: carbon PP against ABS, and what is not verified */
    { const x = 1180, y = LAY.top, w = RM - 1180, h = 580, hy = shlCard(t, 0.5, x, y, w, h, 'Carbon PP vs ABS', ['datasheet', 'derived']);
      const kb = ep(t, 1.6, 2.0);
      const big = rich([{ s: '5.3', role: 'd1', size: 120, color: C.ink, tnum: true, count: [1.6, 1.0] }, { s: '×', font: 'disp', size: 80, weight: 800, color: C.ink, gap: 6 }], x + 26, hy + 104, { t, alpha: kb });
      text('Stiffer by modulus', x + 26 + big.w + 28, hy + 50, { role: 'label', size: 21, color: C.ink, alpha: ep(t, 2.0, 2.4) });
      text('13.5 ÷ 2.55 GPa', x + 26 + big.w + 28, hy + 90, { font: 'mono', size: 25, weight: 600, color: C.mute, alpha: ep(t, 2.1, 2.5) });
      const rows = [['Pyrofil PP-C-20A, 1.01 g/cm³', 13.5, true], ['Denka ABS GR-2000, 1.05 g/cm³', 2.55, false]];
      rows.forEach(([nm, v, hero], i) => {
        const yy = hy + 156 + i * 54, a = ep(t, 2.2 + i * 0.15, 2.6 + i * 0.15), k = ep(t, 2.3 + i * 0.15, 3.1 + i * 0.15, E.snap);
        text(nm, x + 26, yy - 12, { role: 'label', size: 19, color: hero ? C.heroText : C.mute, alpha: a });
        const xe = shlBar({ x: x + 26, y: yy + 6, w: w - 170, max: 15, v, col: hero ? YEL : C.comp, h: 14, a, k, edge: hero ? '#111111' : null });
        text(v + ' GPa', xe + 12, yy + 14, { font: 'mono', size: 24, weight: hero ? 800 : 600, color: C.ink, alpha: clamp(k * 1.4 - 0.3) });
      });
      rule(x + 26, hy + 290, x + w - 26, ep(t, 3.3, 3.7));
      text('Not verified yet', x + 26, hy + 330, { role: 'label', size: 21, color: C.red, alpha: ep(t, 3.6, 4.0) });
      text('Strength: Pyrofil\'s figures sit behind a login, so "three times stronger" stays a claim.', x + 26, hy + 368, { role: 'small', size: 25, color: C.ink2, t, t0: 3.8, cps: 120, maxW: w - 52, lh: 1.32 });
      text('Impact: notched Charpy 6 kJ/m², low, so the drop test comes first.', x + 26, hy + 442, { role: 'small', size: 25, color: C.ink2, t, t0: 4.4, cps: 120, maxW: w - 52, lh: 1.32 });
    }
    gloss(t, 3.4, '{E^(1/3)/ρ}', 'Ashby\'s index for a light, stiff panel: at equal mass a lighter material is thicker, and a panel\'s stiffness grows with thickness cubed.');
    featureCard(t, 5.2, 'Carbon-filled polypropylene', ['datasheet', 'derived'], 'The SLX claims a composite below 0.9 g/cm³ and publishes no modulus. I\'ll publish density, modulus and a drop test together (#5).');
  }
});

/* ============================== 2. a mold only goes so thin (#5, Brock's thin-wall argument) ==============================
   the same mass over the same area: t = m / (ρ A). carbon PP against magnesium, the doc's two real options for a light shell.
   floors from the sources named; the tolerance scatter is a simulation of ±0.05 mm at 3σ; the strength comparison is the
   textbook plate scaling at equal mass (bending strength ∝ σ/ρ², bending stiffness ∝ E/ρ³). */
const TW = { A: 100, pp: { rho: 1.01, name: 'Carbon PP, 20%', floor: 0.89 }, mg: { rho: 1.81, name: 'Magnesium AZ91D', floor: 0.7, floor2: 0.5 }, tol: 0.05 };
const twBudget = t => t < 4.5 ? 10 : 10.6 + 1.6 * Math.sin((t - 4.5) * TAU / 9 - Math.asin(0.6 / 1.6));
const SHL_TOLDOTS = (function () {
  const r = rng(17), g = () => { const u = Math.max(1e-9, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); };
  return [0.99, 0.552].map(t0 => Array.from({ length: 150 }, () => { const tt = t0 + g() * TW.tol / 3; return { d: Math.pow(tt / t0, 3) - 1, j: r() }; }));
})();
S({
  id: 'thinwall', ch: 'shell', theme: 'night', title: 'A mold only goes so thin', settle: 10, ideas: [5, 'wall'],
  src: ['protoWall', 'thixoDN', 'shlYizumi', 'beall102', 'shlPyrofil', 'az91d', 'shlB2gSlx'],
  draw: t => {
    header(t, 'A mold only goes so thin');
    captions(t, [[0.6, 'A mold can only fill a wall so thin, and the thinner the wall, the harder its size is to hold.'], [3.9, 'At the same weight a denser material gets a thinner wall: magnesium\'s is 0.56 as thick as carbon PP\'s.'], [7.0, 'That is why a lighter material can win with worse strength per gram: its wall molds, holds its size and bends less.']]);
    const A = acc();
    /* left: the same grams over the same area, live */
    { const x = LM, y = LAY.top, w = 880, h = 580, hy = shlCard(t, 0.3, x, y, w, h, 'Same grams, same area', ['datasheet', 'derived']);
      const m = twBudget(t), tp = m / (TW.pp.rho * TW.A) * 10, tm = m / (TW.mg.rho * TW.A) * 10, k0 = ep(t, 0.8, 1.2);
      rich([{ s: 't = m / (ρ · A)', font: 'mono', size: 26, weight: 700, color: C.ink }], x + 26, hy + 14, { alpha: k0 });
      text('Wall thickness is mass over density times area.', x + 26, hy + 50, { role: 'small', size: 25, color: C.mute, alpha: k0 });
      text('Mass per 100 cm²', x + w - 26, hy - 2, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: k0 });
      text(m.toFixed(1) + ' g', x + w - 26, hy + 50, { font: 'disp', size: 50, weight: 800, color: C.ink, align: 'right', alpha: k0, tnum: true });
      const S2 = 112, x0 = x + 180, L = 300;
      [[TW.pp, tp, hy + 252, MT.shell, 'Protolabs\' PP floor', '0.89 mm'], [TW.mg, tm, hy + 452, { g: ['#c9ced5', '#7f8790'] }, 'Thixomolded Mg', '0.7 mm typical']].forEach(([M, th, base, mt, fl, fv], j) => {
        const k = ep(t, 1.2 + j * 0.4, 1.8 + j * 0.4), hh = th * S2, ok = th >= M.floor, col = ok ? (TH ? C.heroText : YEL) : C.red;
        text(M.name + ', ' + M.rho.toFixed(2) + ' g/cm³', x + 26, j ? base - 108 : base - 146, { role: 'label', size: 21, color: C.ink, alpha: k });
        part(0, 0, 1, () => solid(() => { G.beginPath(); G.moveTo(x0, base - hh); G.lineTo(x0 + L, base - hh); brk(x0 + L, base - hh, base, 6); G.lineTo(x0, base); brk(x0, base, base - hh, -6); G.closePath(); }, mt, [x0, base - hh, L, hh], { hatch: { sp: 9 } }), { alpha: k });
        /* the floor: the thinnest wall the process fills well */
        const fy = base - M.floor * S2; line(x0 - 16, fy, x0 + L + 16, fy, { color: C.red, w: 2, dash: [8, 5], alpha: k });
        text(fl, x0 + L + 28, fy - 4, { role: 'label', size: 19, color: C.red, alpha: k });
        text(fv, x0 + L + 28, fy + 24, { font: 'mono', size: 24, weight: 700, color: C.red, alpha: k });
        if (M.floor2) { const fy2 = base - M.floor2 * S2; line(x0 - 16, fy2, x0 + L + 16, fy2, { color: C.red, w: 1.4, dash: [3, 5], alpha: k * 0.8 }); text('0.5 mm, small parts', x0 + L + 28, fy + 52, { role: 'label', size: 19, color: C.red, alpha: k * 0.8 }); }
        /* the thickness, live */
        const dx = x0 - 30; line(dx, base - hh, dx, base, { color: col, w: 2, alpha: k }); line(dx - 7, base - hh, dx + 7, base - hh, { color: col, w: 2, alpha: k }); line(dx - 7, base, dx + 7, base, { color: col, w: 2, alpha: k });
        text(th.toFixed(2) + ' mm', dx - 14, base - hh / 2 + 9, { font: 'mono', size: 26, weight: 800, color: col, align: 'right', alpha: k, tnum: true });
        text(ok ? 'Above its floor' : 'Below its floor', x0 + L + 28, base, { role: 'label', size: 21, color: col, alpha: k });
      });
    }
    /* right top: the same ±0.05 mm on both walls, as 150 simulated parts each */
    { const x = 1000, y = LAY.top, w = RM - 1000, h = 284, hy = shlCard(t, 0.5, x, y, w, h, 'The same ±0.05 mm on both', ['derived']);
      const k0 = ep(t, 1.4, 1.8), ax = x + 300, aw = w - 300 - 150, X = d => ax + aw * (d + 0.35) / 0.7;
      text('Stiffness goes with thickness cubed. 150 simulated walls:', x + 26, hy + 12, { role: 'small', size: 25, color: C.mute, alpha: k0 });
      for (const d of [-0.3, -0.15, 0, 0.15, 0.3]) { line(X(d), hy + 44, X(d), hy + 176, { color: d === 0 ? inkA(0.3) : C.hair, w: 1.2, alpha: k0 }); text((d > 0 ? '+' : d < 0 ? '−' : '') + Math.abs(d * 100).toFixed(0) + '%', X(d), hy + 202, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: k0 }); }
      [['Carbon PP, 0.99 mm', 0, '−14 to +16%'], ['Magnesium, 0.55 mm', 1, '−25 to +30%']].forEach(([nm, j, rng2], i) => {
        const cy = hy + 82 + i * 66, a = ep(t, 1.8 + i * 0.3, 2.2 + i * 0.3), col = j ? (TH ? C.ink : C.ink2) : YEL;
        text(nm, x + 26, cy + 8, { role: 'label', size: 19, color: j ? C.ink2 : (TH ? C.heroText : YEL), alpha: a });
        SHL_TOLDOTS[j].forEach((p, q) => { const kk = ep(t, 2.0 + i * 0.3 + p.j * 0.8, 2.3 + i * 0.3 + p.j * 0.8, E.out3); if (kk <= 0) return; circle(X(clamp(p.d, -0.34, 0.34)), cy + (p.j - 0.5) * 34 - (1 - kk) * 14, 3, { fill: col, alpha: kk * 0.8 }); });
        text(rng2, x + w - 26, cy + 8, { font: 'mono', size: 24, weight: 700, color: j ? C.ink : (TH ? C.heroText : YEL), align: 'right', alpha: ep(t, 2.6 + i * 0.3, 3.0 + i * 0.3) });
      });
    }
    /* right bottom: strength per gram can be worse and still tie in bending */
    { const x = 1000, y = 572, w = RM - 1000, h = 280, hy = shlCard(t, 0.7, x, y, w, h, 'Strength per gram can be worse', ['derived']);
      const bx = x + 26, bw = w - 52 - 210, rows = [
        ['Strength per gram, {σ/ρ}', [88, 122], [49, 68]],
        ['Bending strength at the same mass, {σ/ρ²}', [49, 67], [49, 67]]
      ];
      rows.forEach(([nm, mg, pp], i) => {
        const yy = hy + 8 + i * 76, a = ep(t, 3.0 + i * 0.4, 3.4 + i * 0.4), k = ep(t, 3.1 + i * 0.4, 3.9 + i * 0.4, E.snap);
        text(nm, x + 26, yy, { role: 'label', size: 19, color: C.ink, alpha: a });
        const e1 = shlBar({ x: bx, y: yy + 20, w: bw, max: 140, lo: mg[0], hi: mg[1], col: TH ? C.ink : C.ink2, h: 10, a, k });
        text('Mg ' + mg[0] + '–' + mg[1], e1 + 12, yy + 27, { font: 'mono', size: 21, weight: 600, color: C.ink2, alpha: clamp(k * 1.4 - 0.3) });
        const e2 = shlBar({ x: bx, y: yy + 44, w: bw, max: 140, lo: pp[0], hi: pp[1], col: YEL, h: 10, a, k, edge: TH ? '#111111' : null });
        text('PP needs ' + pp[0] + '–' + pp[1], e2 + 12, yy + 51, { font: 'mono', size: 21, weight: 700, color: TH ? C.heroText : YEL, alpha: clamp(k * 1.4 - 0.3) });
      });
      text('PP needs 50 to 69 MPa to tie: 44% less per gram.', x + 26, y + h - 22, { role: 'small', size: 25, weight: 600, color: C.ink, t, t0: 4.8, cps: 110 });
    }
    gloss(t, 2.4, 'Minimum wall', 'The thinnest section a resin fills well. Below it the melt freezes early, and the extra pressure leaves stress that warps the part.');
    featureCard(t, 5.6, 'A lighter resin, a thicker wall', ['datasheet', 'derived'], 'At the same grams carbon PP gets 1.8× magnesium\'s wall: above its floor, half the scatter, stiffer in bending (#5).');
  }
});

/* ============================== 3. triangles against hexagons, in a flat panel (#75) ============================== */
/* a 2D frame solver: Euler-Bernoulli beams, 3 dof per node, dense Gaussian elimination */
function frameSolve(nodes, els, fixed, loads) {
  const n = nodes.length * 3, K = Array.from({ length: n }, () => new Float64Array(n)), F = new Float64Array(n);
  for (const e of els) {
    const [i, j] = e.n, a = nodes[i], b = nodes[j], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), c = dx / L, s = dy / L;
    const EA = e.A, EI = e.I, k1 = EA / L, k2 = 12 * EI / L ** 3, k3 = 6 * EI / L ** 2, k4 = 4 * EI / L, k5 = 2 * EI / L;
    const kl = [[k1, 0, 0, -k1, 0, 0], [0, k2, k3, 0, -k2, k3], [0, k3, k4, 0, -k3, k5], [-k1, 0, 0, k1, 0, 0], [0, -k2, -k3, 0, k2, -k3], [0, k3, k5, 0, -k3, k4]];
    const T = [[c, s, 0, 0, 0, 0], [-s, c, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0], [0, 0, 0, c, s, 0], [0, 0, 0, -s, c, 0], [0, 0, 0, 0, 0, 1]];
    const kg = Array.from({ length: 6 }, () => new Array(6).fill(0));
    for (let p = 0; p < 6; p++) for (let q = 0; q < 6; q++) { let v = 0; for (let r = 0; r < 6; r++) for (let u = 0; u < 6; u++) v += T[r][p] * kl[r][u] * T[u][q]; kg[p][q] = v; }
    const dof = [i * 3, i * 3 + 1, i * 3 + 2, j * 3, j * 3 + 1, j * 3 + 2];
    for (let p = 0; p < 6; p++) for (let q = 0; q < 6; q++) K[dof[p]][dof[q]] += kg[p][q];
  }
  for (const [k, fx, fy] of loads) { F[k * 3] += fx; F[k * 3 + 1] += fy; }
  /* fixed: node index (all three dofs) or [node, dof] (one dof, e.g. a roller) */
  for (const f of fixed) for (const r of Array.isArray(f) ? [f[0] * 3 + f[1]] : [f * 3, f * 3 + 1, f * 3 + 2]) { K[r].fill(0); for (let q = 0; q < n; q++) K[q][r] = 0; K[r][r] = 1; F[r] = 0; }
  for (let r = 0; r < n; r++) if (Math.abs(K[r][r]) < 1e-12) { K[r][r] = 1; F[r] = 0; }
  for (let col = 0; col < n; col++) {
    let piv = col; for (let r = col + 1; r < n; r++) if (Math.abs(K[r][col]) > Math.abs(K[piv][col])) piv = r;
    if (piv !== col) { const tmp = K[col]; K[col] = K[piv]; K[piv] = tmp; const tf = F[col]; F[col] = F[piv]; F[piv] = tf; }
    const d = K[col][col]; if (Math.abs(d) < 1e-14) continue;
    for (let r = col + 1; r < n; r++) { const f = K[r][col] / d; if (!f) continue; const Kr = K[r], Kc = K[col]; for (let q = col; q < n; q++) Kr[q] -= f * Kc[q]; F[r] -= f * F[col]; }
  }
  const U = new Float64Array(n);
  for (let r = n - 1; r >= 0; r--) { let v = F[r]; for (let q = r + 1; q < n; q++) v -= K[r][q] * U[q]; U[r] = K[r][r] ? v / K[r][r] : 0; }
  return U;
}
const LATTICE = (function () {
  const Wd = 300, Hd = 150, a = 40, h = a * Math.sqrt(3) / 2;
  const tri = { nodes: [], els: [] }, idx = {};
  for (let r = 0; r * h <= Hd + 0.1; r++) for (let c = 0; c * a + (r % 2) * a / 2 <= Wd + 0.1; c++) { idx[r + ',' + c] = tri.nodes.length; tri.nodes.push([c * a + (r % 2) * a / 2, r * h]); }
  for (const key in idx) { const [r, c] = key.split(',').map(Number), i = idx[key]; const nb = [[r, c + 1]].concat(r % 2 ? [[r + 1, c], [r + 1, c + 1]] : [[r + 1, c], [r + 1, c - 1]]); for (const [rr2, cc] of nb) { const j = idx[rr2 + ',' + cc]; if (j != null) tri.els.push({ n: [i, j] }); } }
  const hex = { nodes: [], els: [] }, key = p => Math.round(p[0] * 10) + ',' + Math.round(p[1] * 10), map = {};
  const R = 23.1, hw = Math.sqrt(3) * R;
  const addN = p => { const k = key(p); if (map[k] == null) { map[k] = hex.nodes.length; hex.nodes.push(p); } return map[k]; };
  for (let row = -1; row < 8; row++) for (let col = -1; col < 10; col++) {
    const cx = col * hw + (row % 2 ? hw / 2 : 0), cy = row * 1.5 * R; const vs = [];
    for (let k = 0; k < 6; k++) { const an = Math.PI / 6 + k * Math.PI / 3; vs.push([cx + R * Math.cos(an), cy + R * Math.sin(an)]); }
    for (let k = 0; k < 6; k++) { const p = vs[k], q = vs[(k + 1) % 6]; const inside = z => z[0] >= -0.1 && z[0] <= Wd + 0.1 && z[1] >= -0.1 && z[1] <= Hd + 0.1; if (inside(p) && inside(q)) { const i = addN(p), j = addN(q); if (!hex.els.some(e => (e.n[0] === i && e.n[1] === j) || (e.n[0] === j && e.n[1] === i))) hex.els.push({ n: [i, j] }); } }
  }
  const len = L => L.els.reduce((s2, e) => s2 + Math.hypot(L.nodes[e.n[1]][0] - L.nodes[e.n[0]][0], L.nodes[e.n[1]][1] - L.nodes[e.n[0]][1]), 0);
  const tt = 2.4, th = tt * len(tri) / len(hex);
  const solve = (L, t) => {
    for (const e of L.els) { e.A = t; e.I = t * t * t / 12; }
    const ys = L.nodes.map(p => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const used = new Set(); L.els.forEach(e => { used.add(e.n[0]); used.add(e.n[1]); });
    const fixed = [], top = []; L.nodes.forEach((p, i) => { if (!used.has(i)) fixed.push(i); else if (p[1] < y0 + 1) fixed.push(i); else if (p[1] > y1 - 1) top.push(i); });
    const U = frameSolve(L.nodes, L.els, fixed, top.map(i => [i, 0, -1 / top.length]));
    const dmax = Math.max(...top.map(i => -U[i * 3 + 1]));
    return { U, top, dmean: top.reduce((s2, i) => s2 - U[i * 3 + 1], 0) / top.length, dmax, len: len(L), t };
  };
  const st = solve(tri, tt), sh = solve(hex, th);
  return { tri, hex, st, sh, ratio: sh.dmean / st.dmean, Wd, Hd };
})();
/* the same panels at every density and under three loads */
function latSolve(L, t, mode) {
  for (const e of L.els) { e.A = t; e.I = t * t * t / 12; }
  const ys = L.nodes.map(p => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const used = new Set(); L.els.forEach(e => { used.add(e.n[0]); used.add(e.n[1]); });
  const fixed = [], top = []; L.nodes.forEach((p, i) => { if (!used.has(i)) fixed.push(i); else if (p[1] < y0 + 1) fixed.push(i); else if (p[1] > y1 - 1) top.push(i); });
  let loads, meas;
  if (mode === 'shear') { loads = top.map(i => [i, 1 / top.length, 0]); meas = U => top.reduce((a, i) => a + U[i * 3], 0) / top.length; }
  else if (mode === 'point') { const mid = top.reduce((b, i) => Math.abs(L.nodes[i][0] - 150) < Math.abs(L.nodes[b][0] - 150) ? i : b, top[0]); loads = [[mid, 0, -1]]; meas = U => -U[mid * 3 + 1]; }
  else { loads = top.map(i => [i, 0, -1 / top.length]); meas = U => -top.reduce((a, i) => a + U[i * 3 + 1], 0) / top.length; }
  const U = frameSolve(L.nodes, L.els, fixed, loads);
  return { U, d: meas(U) };
}
let LAT2 = null;
function lat2() {
  if (LAT2) return LAT2;
  const tri = LATTICE.tri, hex = LATTICE.hex, lt = LATTICE.st.len, lh = LATTICE.sh.len, area = LATTICE.Wd * LATTICE.Hd;
  const ts = [0.4, 0.6, 0.9, 1.3, 1.9, 2.7];
  const sweep = ts.map(t => { const a = latSolve(tri, t, 'press'), b = latSolve(hex, t * lt / lh, 'press'); return { rho: lt * t / area, kt: 1 / a.d, kh: 1 / b.d }; });
  const modes = ['press', 'shear', 'point'].map(m => { const a = latSolve(tri, 2.4, m), b = latSolve(hex, 2.4 * lt / lh, m); return { m, ratio: b.d / a.d }; });
  latSolve(tri, LATTICE.st.t, 'press'); latSolve(hex, LATTICE.sh.t, 'press');
  return (LAT2 = { sweep, modes });
}
S({
  id: 'lattice', ch: 'shell', theme: 'paper', title: 'Triangles don\'t bend', settle: 10, ideas: [75], src: ['mitHoney', 'ashby06'],
  sfx: [[3.2, 'seat']],
  draw: t => {
    header(t, 'Triangles don\'t bend');
    captions(t, [[0.6, 'Two panels with the same outline, the same mass of material and the same load pressing on top.'], [4.0, 'Triangles carry it along their struts. Hexagons have to bend at every joint, and give 5.2× more for the same weight.'], [7.4, 'It is very confusing why most mice cut hexagons, when triangles are this much stiffer for the same weight.']]);
    const D = lat2();
    /* left: both panels solved as frames, the same load and mass */
    { const x = LM, y = LAY.top, w = 1100, h = 580, hy = shlCard(t, 0.3, x, y, w, h, 'Same panel, same mass, same load', ['derived']);
      text('Solved as frames in this page; deflection drawn at the same scale for both.', x + 26, hy + 12, { role: 'small', size: 25, color: C.mute, alpha: ep(t, 1.0, 1.4) });
      const ld = ep(t, 2.4, 4.0, E.io3) * (t > 4.0 ? 0.82 + 0.18 * Math.cos((t - 4.0) * 1.9) : 1), mag = 46 / LATTICE.sh.dmean;
      const tri = TH ? '#A87C00' : YEL, hexc = TH ? '#5F5E59' : '#B9B8B2';
      const drawL = (L, R, ox, oy, col, t0) => {
        const k = ep(t, t0, t0 + 0.8), sc = 1.42;
        const P = (i, f) => [ox + (L.nodes[i][0] + R.U[i * 3] * mag * f) * sc, oy - (L.nodes[i][1] + R.U[i * 3 + 1] * mag * f) * sc];
        G.save(); G.globalAlpha = k * 0.35; G.strokeStyle = C.faint; G.lineWidth = 1; G.beginPath(); for (const e of L.els) { const p = P(e.n[0], 0), q = P(e.n[1], 0); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); } G.stroke(); G.restore();
        G.save(); G.globalAlpha = k; G.strokeStyle = col; G.lineWidth = Math.max(2, R.t * sc * 0.9); G.lineCap = 'round'; G.beginPath(); for (const e of L.els) { const p = P(e.n[0], ld), q = P(e.n[1], ld); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); } G.stroke(); G.restore();
        part(0, 0, 1, () => solid(() => { G.beginPath(); G.rect(ox - 10, oy + 6, LATTICE.Wd * sc + 20, 12); }, MT.shell, [ox - 10, oy + 6, LATTICE.Wd * sc + 20, 12], { hatch: true }), { alpha: k });
        for (let xx = 0; xx <= LATTICE.Wd; xx += 50) { const p = [ox + xx * sc, oy - LATTICE.Hd * sc - 66]; arrow(p[0], p[1], p[0], p[1] + 42, { color: C.ink, w: 2.5, hs: 10, alpha: ep(t, 2.0, 2.4) }); }
      };
      clipped(x + 4, y + 120, w - 8, h - 124, () => { drawL(LATTICE.tri, LATTICE.st, x + 70, y + 470, tri, 1.2); drawL(LATTICE.hex, LATTICE.sh, x + 610, y + 470, hexc, 1.5); });
      shlChip(x + 70, y + 528, 'Triangles', ep(t, 1.4, 1.8));
      text('Hexagons, same mass', x + 610, y + 528, { role: 'label', size: 21, color: C.ink2, alpha: ep(t, 1.7, 2.1) });
    }
    /* right: the ratio, under three loads, and how it grows as the panel gets lighter */
    { const x = 1220, y = LAY.top, w = RM - 1220, h = 580, hy = shlCard(t, 0.5, x, y, w, h, 'The gap, same mass', ['derived']);
      text('Hexagons\' deflection over triangles\'', x + 26, hy + 8, { role: 'label', size: 19, color: C.mute, alpha: ep(t, 4.4, 4.8) });
      rich([{ s: LATTICE.ratio.toFixed(1), role: 'd1', size: 104, color: C.ink, tnum: true, count: [4.2, 1.0] }, { s: '×', font: 'disp', size: 68, weight: 800, color: C.ink, gap: 6 }], x + 26, hy + 106, { t, alpha: ep(t, 4.2, 4.4) });
      const names = { press: 'Pressed evenly', shear: 'Pushed sideways', point: 'One fingertip' };
      D.modes.forEach((md, i) => {
        const yy = hy + 154 + i * 42, a = ep(t, 4.8 + i * 0.2, 5.2 + i * 0.2), k = ep(t, 4.9 + i * 0.2, 5.7 + i * 0.2, E.snap);
        text(names[md.m], x + 26, yy, { role: 'small', size: 25, color: C.ink2, alpha: a });
        const xe = shlBar({ x: x + 250, y: yy - 8, w: w - 250 - 110, max: 6, v: md.ratio, col: C.ink2, h: 12, a, k });
        text(md.ratio.toFixed(1) + '×', xe + 10, yy, { font: 'mono', size: 24, weight: 700, color: C.ink, alpha: clamp(k * 1.4 - 0.3) });
      });
      rule(x + 26, hy + 264, x + w - 26, ep(t, 5.6, 6.0));
      text('The lighter the panel, the wider the gap', x + 26, hy + 302, { role: 'label', size: 19, color: C.ink, alpha: ep(t, 5.8, 6.2) });
      const pick = [D.sweep[5], D.sweep[3], D.sweep[0]];
      pick.forEach((r, i) => {
        const cx = x + 26 + i * ((w - 52) / 3), a = ep(t, 6.0 + i * 0.2, 6.4 + i * 0.2);
        text(Math.round(r.rho * 100) + '% material', cx, hy + 340, { role: 'label', size: 19, color: C.mute, alpha: a });
        text((r.kt / r.kh).toFixed(r.kt / r.kh < 10 ? 1 : 0) + '×', cx, hy + 388, { font: 'disp', size: 44, weight: 800, color: C.ink, alpha: a, tnum: true });
      });
      text('Triangles stiffen with density, hexagons with its cube (Gibson and Ashby).', x + 26, hy + 436, { role: 'small', size: 25, color: C.ink2, t, t0: 6.6, cps: 110, maxW: w - 52, lh: 1.32 });
    }
    gloss(t, 2.6, 'Statically determinate', 'A triangle can\'t change shape without stretching a side. A hexagon can, by bending at its joints.');
    featureCard(t, 6.4, 'Triangles, not hexagons', ['derived'], 'A cutout shell is the lattice, so for a honeycomb shell these factors are real. Mine keeps the wall: next slide (#75).');
  }
});

/* ============================== 4. triangles inside the real shell: the 3D study at equal rib mass (#75) ============================== */
const SHL_FE = (function () {
  const fe = { tri: { press: 465.3, press_off: 311.9, squeeze: 638.6, rib: 4.4 }, hex: { press: 390.8, press_off: 266.9, squeeze: 547.8, rib: 6.79 }, thick: { press: 286.6, press_off: 177.7, squeeze: 573.5 }, none: { press: 116.9, press_off: 70.0, squeeze: 236.8 } };
  return fe;
})();
S({
  id: 'shlLattice3d', ch: 'shell', theme: 'night', title: 'Triangles inside the real shell', settle: 10, ideas: [75, 53], src: ['shlLattice'], three: ['lattice'],
  draw: t => {
    header(t, 'Triangles inside the real shell');
    captions(t, [[0.6, 'My shell keeps a solid wall and carries the lattice inside it, as ribs. So I solved the whole shell, not a flat panel.'], [5.0, 'With the same 5.2 g of ribs, triangles are 17 to 19% stiffer than hexagons. The wall carries much of the load, so the 5× shrinks; it is still free.']]);
    /* left: both lattices from below, the same rib mass; then the press colours them */
    { const x = LM, y = LAY.top, w = 880, h = 580;
      demoWindow(x, y, w, h, ep(t, 0.3, 0.7));
      const bx = x + 8, by = y + 60, bw = w - 16, bh = h - 66, st = { view: 'bottom', compare: 'both', stress: ep(t, 3.0, 4.2), stressCase: 'press', zoom: 1.15 };
      shl3D('lattice', t, bx, by, bw, bh, st, { alpha: ep(t, 0.6, 1.2) });
      const pT = shlProj(st, [bx, by, bw, bh], [-36, 0, 0]), pH = shlProj(st, [bx, by, bw, bh], [36, 0, 0]);
      shlChip(pT[0], y + 46, 'Triangles', ep(t, 1.4, 1.8), 'center');
      text('Hexagons, same rib mass', pH[0], y + 46, { role: 'label', size: 21, color: C.ink2, align: 'center', alpha: ep(t, 1.6, 2.0) });
      shlRamp(t, 3.4, x + 26, y + h - 62, 160, 6, 'Stress at 10 N');
      text('From below', x + 26, y + 98, { role: 'label', size: 19, color: C.mute, alpha: ep(t, 0.8, 1.2) });
      pill(x + w - 22 - pillW('derived'), y + h - 22, 'derived', ep(t, 3.6, 4.0));
    }
    /* right: stiffness by design and load, N/mm */
    { const x = 1000, y = LAY.top, w = RM - 1000, h = 580, hy = shlCard(t, 0.5, x, y, w, h, 'Stiffness at 10 N, {N/mm}', ['derived']);
      const cols = [['press', 'On the crown'], ['press_off', 'Off-centre'], ['squeeze', 'Squeezed']], nw = 270, cw = (w - 26 - nw - 26) / 3;
      const rows = [['tri', 'Triangles', '5.2 g of ribs', true], ['hex', 'Hexagons', 'Same rib mass'], ['thick', 'Thicker wall', 'Same mass, no ribs'], ['none', 'Wall only', 'No ribs']];
      cols.forEach(([k, l], j) => text(l, x + 26 + nw + j * cw, hy + 6, { role: 'label', size: 19, color: C.mute, alpha: ep(t, 1.0, 1.4) }));
      line(x + 26, hy + 22, x + w - 26, hy + 22, { color: C.hair, w: 1.5, alpha: ep(t, 1.0, 1.4) });
      rows.forEach(([key, nm, sub, hero], i) => {
        const yy = hy + 74 + i * 76, a = ep(t, 1.4 + i * 0.25, 1.8 + i * 0.25);
        if (i) line(x + 26, yy - 40, x + w - 26, yy - 40, { color: C.hair, w: 1, alpha: a });
        if (hero) rect(x + 12, yy - 30, 5, 62, { fill: YEL, alpha: a });
        text(nm, x + 26, yy, { role: 'small', size: 25, weight: hero ? 800 : 600, color: C.ink, alpha: a });
        text(sub, x + 26, yy + 26, { role: 'label', size: 19, color: hero ? C.heroText : C.mute, alpha: a });
        cols.forEach(([k], j) => {
          const v = SHL_FE[key][k], cx = x + 26 + nw + j * cw, kk = ep(t, 1.6 + i * 0.25 + j * 0.1, 2.4 + i * 0.25 + j * 0.1, E.snap);
          text(countUp(String(Math.round(v)), kk) || String(Math.round(v)), cx, yy - 2, { font: 'mono', size: 24, weight: hero ? 800 : 600, color: C.ink, alpha: a });
          shlBar({ x: cx, y: yy + 18, w: cw - 30, max: 700, v, col: hero ? YEL : key === 'none' ? C.comp2 : C.comp, h: 10, a, k: kk });
        });
      });
      const ka = ep(t, 5.4, 5.8);
      rule(x + 26, y + h - 122, x + w - 26, ka);
      text('Peak rib stress at 10 N on the crown', x + 26, y + h - 84, { role: 'label', size: 19, color: C.ink, alpha: ka });
      rich([{ s: 'Hexagons 6.8 MPa', font: 'mono', size: 24, weight: 600, color: C.ink2 }, { s: 'Triangles 4.4 MPa', font: 'mono', size: 24, weight: 800, color: YEL, gap: 26 }, { s: '−35%', font: 'mono', size: 24, weight: 800, color: C.ink, gap: 26 }], x + 26, y + h - 40, { alpha: ka });
    }
    gloss(t, 2.4, 'N/mm', 'Newtons per millimetre: the force it takes to push the shell in by 1 mm. At 465 N/mm, 10 N moves the crown 21 µm.');
    featureCard(t, 6.0, 'Triangles, solved in the real shell', ['derived'], 'Same 5.2 g of ribs: 19% stiffer under a press on the crown, 17% squeezed, a third less peak stress (#75).');
  }
});

/* ============================== 5. why round the lattice's corners (#75, Brock: "the advantages of filleting") ==============================
   the 3D close-up is the study shell's own filleted node; the stress fields are the 2D study in 09-fillet-data.js:
   one triangle lattice solved at eleven fillet radii at the same mass (the struts thin as the fillets grow). */
const SHL_NODE = { root: [6.26, 36.02, -22.42], n: [-0.168, -0.971, 0.170], rib: [3.01, 36.43, -22.49], cam: { view: [-14.23, -7.71, -6.65], target: [3.55, 35.58, -22.34], fov: 26, zoom: 19.95 } };
S({
  id: 'fillet', ch: 'shell', theme: 'paper', title: 'Round every corner of the lattice', settle: 9, ideas: [75, 'fillet'],
  src: ['filletFE', 'shlLattice', 'beall106', 'doutre23', 'shlEnvalior'], three: ['lattice'],
  draw: t => {
    header(t, 'Round every corner of the lattice');
    captions(t, [[0.6, 'A sharp corner in a lattice is a notch: the load running down a strut has to turn there, and it crowds into the corner.'], [4.4, 'Round it and the same load turns gradually. At the same weight the peak stress halves and the panel gets 5.5% stiffer.']]);
    /* left: the filleted node of the study shell, close up */
    { const x = LM, y = LAY.top, w = 900, h = 580;
      demoWindow(x, y, w, h, ep(t, 0.3, 0.7));
      text('A node of the study shell, about 20× closer', x + 26, y + 46, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 0.6, 1.0) });
      pill(x + w - 24 - pillW('proposal'), y + 50, 'proposal', ep(t, 0.7, 1.1));
      const bx = x + 8, by = y + 72, bw = w - 16, bh = h - 80, st = Object.assign({}, SHL_NODE.cam, { cut: 1, filletZoom: 1, yaw: 0.1 * Math.sin(t * 0.5) });
      clipped(bx, by, bw, bh, () => shl3D('lattice', t, bx, by, bw, bh, st, { alpha: ep(t, 0.5, 1.1) }));
      const nd = SHL_NODE.root.map((v, i) => v + SHL_NODE.n[i] * 1.0), rb = SHL_NODE.rib.map((v, i) => v + SHL_NODE.n[i] * 1.0);
      const P1 = shlProj(st, [bx, by, bw, bh], nd), P2 = shlProj(st, [bx, by, bw, bh], rb), P3 = shlProj(st, [bx, by, bw, bh], [0.3, 37.6, -24.5]);
      callout(t, 2.0, P1, 'Three ribs meet on a 0.6 mm radius', { to: [P1[0] + 120, by + bh - 56], side: 'r', prose: true, color: YEL, tcolor: '#F3F2EE', maxW: 300 });
      callout(t, 2.6, P2, 'Rib: 1.0 mm wide, 2.0 mm tall', { to: [P2[0] - 110, P2[1] + 60], side: 'l', prose: true, color: YEL, tcolor: '#F3F2EE', maxW: 260 });
      callout(t, 3.2, P3, 'Shell wall, cut', { to: [P3[0] - 120, by + 44], side: 'l', color: YEL, tcolor: '#F3F2EE' });
    }
    /* right: the stress field before and after, at the same weight, and what the radius buys */
    { const x = 1020, y = LAY.top, w = RM - 1020, h = 580, hy = shlCard(t, 0.5, x, y, w, h, 'What the radius buys, same weight', ['derived']);
      const iw = 340, ih = iw * 354 / 512, sc = iw / 512;
      [[0, 0.05, 'Near-sharp, r 0.05 mm'], [7, 0.75, 'Filleted, r 0.75 mm']].forEach(([i, r, lab], j) => {
        const ix = x + 26 + j * (iw + 36), iy = hy + 6, a = ep(t, 1.0 + j * 0.8, 1.6 + j * 0.8), I = FILLET.img[i];
        G.save(); rrPath(ix, iy, iw, ih, 8); G.clip(); G.globalAlpha = a; G.fillStyle = '#121316'; G.fillRect(ix, iy, iw, ih); if (I && I.complete) G.drawImage(I, ix, iy, iw, ih); G.restore(); G.globalAlpha = 1;
        const hs = FILLET.hot[i], hx = ix + hs[0] * FILLET.px * sc, hyy = iy + hs[1] * FILLET.px * sc, pul = 0.5 + 0.5 * Math.sin(t * 5 + j);
        circle(hx, hyy, 7 + 3 * pul, { color: '#ffffff', w: 2, alpha: a * 0.9 });
        text(lab, ix, iy + ih + 32, { role: 'label', size: 19, color: C.mute, alpha: a });
        rich([{ s: 'Peak', role: 'label', size: 19, color: C.mute }, { s: FILLET.scfM[i].toFixed(1) + '×', font: 'mono', size: 26, weight: 800, color: j ? C.ink : C.red, gap: 12 }], ix, iy + ih + 66, { alpha: a });
      });
      const rows = [['−50%', 'Peak stress: 16.6× to 8.3× the average'], ['+5.5%', 'Stiffness, for no added material'], ['Fill', 'The melt turns a round corner at lower pressure'], ['Cost', 'At equal mass, fillets weakened printed lattices']];
      rows.forEach(([v, s2], i) => {
        const yy = hy + 342 + i * 46, a = ep(t, 3.0 + i * 0.4, 3.4 + i * 0.4);
        if (i) line(x + 26, yy - 31, x + w - 26, yy - 31, { color: C.hair, w: 1, alpha: a });
        text(v, x + 26, yy, { font: 'disp', size: 30, weight: 800, color: i === 3 ? C.red : C.ink, alpha: a, tnum: true });
        text(s2, x + 150, yy, { role: 'small', size: 25, color: C.ink2, t, t0: 3.0 + i * 0.4, cps: 120, alpha: a });
      });
    }
    gloss(t, 2.8, 'Fillet', 'A rounded inside corner: here where three ribs meet, and where each rib meets the wall. Beall: radiused corners fill at lower pressure.');
    featureCard(t, 5.4, 'Filleted lattice corners', ['derived', 'study'], 'Fillets can cost strength at equal mass (Doutre and colleagues, 2023), so I solve the size: next slide (#75).');
  }
});

/* ============================== 6. how big the fillet should be (#75, Brock: "how the fillet size is chosen") ============================== */
function filAt(r) {
  const R = FILLET.rs; let i = 0; while (i < R.length - 2 && R[i + 1] < r) i++;
  const k = clamp((r - R[i]) / (R[i + 1] - R[i])), L = a => lerp(a[i], a[i + 1], k);
  return { i, k, scf: L(FILLET.scfM), w: L(FILLET.wM), E: L(FILLET.ExM), scfW: L(FILLET.scfW), rhoW: L(FILLET.rhoW) };
}
/** the radius on screen: near-sharp, then rounded to the bottom of the curve, then the whole range in a loop */
function filR(t) {
  if (t < 2.4) return 0.05;
  if (t < 10.5) return lerp(0.05, 0.75, ep(t, 2.4, 4.8, E.io3));
  const u = (t - 10.5) % 12;
  return u < 3 ? lerp(0.75, 1.2, E.io3(u / 3)) : u < 4 ? 1.2 : u < 7 ? lerp(1.2, 0.05, E.io3((u - 4) / 3)) : u < 8 ? 0.05 : u < 11 ? lerp(0.05, 0.75, E.io3((u - 8) / 3)) : 0.75;
}
S({
  id: 'filletsize', ch: 'shell', theme: 'night', title: 'How big the fillet should be', settle: 10, ideas: [75, 'fillet'],
  src: ['filletFE', 'shlEnvalior', 'beall106', 'protoWall', 'doutre23', 'shlLattice'],
  draw: t => {
    header(t, 'How big the fillet should be');
    captions(t, [[0.6, 'Held at the same weight, a fillet trades corner stress against strut width, so the curve has a bottom.'], [4.0, 'Most of the gain comes in the first 0.6 mm. Past 1.05 mm the struts drop under the 0.89 mm floor and the peak climbs again.'], [7.4, 'So I take the small end of the bottom: 0.6 to 0.75 mm, nearly all the gain, with the widest struts.']]);
    const A = acc(), r = filR(t), f = filAt(r);
    /* left: the stress field at the radius on screen, and its readout */
    { const x = LM, y = LAY.top, w = 1000, h = 580, hy = shlCard(t, 0.3, x, y, w, h, 'Stress in the lattice, pulled along its struts', ['derived']);
      const sc = 1.1, ix = x + 26, iy = hy + 8, iw = 512 * sc, ih = 354 * sc, ka = ep(t, 0.7, 1.4);
      const I0 = FILLET.img[f.i], I1 = FILLET.img[f.i + 1];
      G.save(); rrPath(ix, iy, iw, ih, 8); G.clip();
      G.globalAlpha = ka; G.fillStyle = '#121316'; G.fillRect(ix, iy, iw, ih);
      if (I0 && I0.complete) { G.globalAlpha = ka * (1 - f.k); G.drawImage(I0, ix, iy, iw, ih); }
      if (I1 && I1.complete && f.k > 0.001) { G.globalAlpha = ka * f.k; G.drawImage(I1, ix, iy, iw, ih); }
      G.restore(); G.globalAlpha = 1;
      rr(ix, iy, iw, ih, 8, null, inkA(0.14), 1.2, ka);
      const hs = FILLET.hot[f.k < 0.5 ? f.i : f.i + 1], hx = ix + hs[0] * FILLET.px * sc, hyy = iy + hs[1] * FILLET.px * sc, kh = ep(t, 1.6, 2.0) * ka, pul = 0.5 + 0.5 * Math.sin(t * 5);
      circle(hx, hyy, 9 + 4 * pul, { color: '#ffffff', w: 2, alpha: kh * 0.9 }); circle(hx, hyy, 22 + 6 * pul, { color: YEL, w: 1.2, alpha: kh * 0.5 });
      const k2 = ep(t, 1.2, 1.6); line(ix + 16, iy + ih - 18, ix + 16 + FILLET.px * sc, iy + ih - 18, { color: '#ffffff', w: 2, alpha: k2 * 0.85 }); text('1 mm', ix + 24 + FILLET.px * sc, iy + ih - 11, { role: 'label', size: 19, color: '#ffffff', alpha: k2 * 0.85 });
      const gx = ix + iw - 200, gy = iy + ih - 24, gw = 184, gr = G.createLinearGradient(gx, 0, gx + gw, 0);
      [[0, '#2a2c33'], [0.45, '#6e5a1f'], [0.62, '#c9a630'], [0.78, '#f2d860'], [1, '#ffffff']].forEach(([o, c]) => gr.addColorStop(o, c));
      G.save(); G.globalAlpha = k2; G.fillStyle = gr; G.fillRect(gx, gy, gw, 8); G.restore();
      text('0', gx, gy - 8, { role: 'tick', size: 19, color: '#c9c8c2', alpha: k2 }); text('12×', gx + gw, gy - 8, { role: 'tick', size: 19, color: '#c9c8c2', align: 'right', alpha: k2 });
      text('Same mass at every radius: the struts thin as the fillets grow.', x + 26, y + h - 22, { role: 'small', size: 25, color: C.mute, alpha: ep(t, 1.4, 1.8) });
      /* the readout */
      const ox = ix + iw + 34, kr = ep(t, 1.0, 1.5), bw0 = x + w - 26 - ox;
      const ro = (lab, yy) => text(lab, ox, yy, { role: 'label', size: 19, color: C.mute, alpha: kr });
      ro('Fillet radius', hy + 30); text(r.toFixed(2) + ' mm', ox, hy + 82, { font: 'disp', size: 50, weight: 800, color: YEL, alpha: kr, tnum: true });
      ro('Strut width', hy + 134); text(f.w.toFixed(2) + ' mm', ox, hy + 176, { font: 'disp', size: 38, weight: 800, color: f.w < 0.89 ? C.red : C.ink, alpha: kr, tnum: true });
      ro('Peak stress', hy + 228); text(f.scf.toFixed(1) + '×', ox + bw0, hy + 228, { font: 'mono', size: 24, weight: 800, color: f.scf > 12 ? C.red : C.ink, align: 'right', alpha: kr });
      rr(ox, hy + 244, bw0, 12, 6, inkA(0.1), null, 0, kr); rr(ox, hy + 244, Math.max(12, bw0 * f.scf / 17), 12, 6, f.scf > 12 ? C.red : YEL, null, 0, kr);
      ro('Stiffness, same mass', hy + 306); const dE = (f.E / FILLET.ExM[0] - 1) * 100; text((dE >= 0 ? '+' : '') + dE.toFixed(1) + '%', ox, hy + 350, { font: 'disp', size: 38, weight: 800, color: dE > 0.5 ? C.ink : C.mute, alpha: kr, tnum: true });
      text('vs near-sharp', ox, hy + 382, { role: 'label', size: 19, color: C.faint, alpha: kr });
    }
    /* right: the sweep as a curve, and how I pick the radius */
    { const x = 1120, y = LAY.top, w = RM - 1120, h = 580, hy = shlCard(t, 0.5, x, y, w, h, 'Peak stress against radius', ['derived']);
      const m = axes(t, { x: x + 88, y: hy + 14, w: w - 120, h: 178, xr: [0, 1.25], yr: [5, 17], xticks: [0, 0.25, 0.5, 0.75, 1.0, 1.25], yticks: [6, 10, 14], xfmt: v => v.toFixed(2), yfmt: v => v + '×', t0: 0.9 });
      const R = FILLET.rs, kz = ep(t, 3.6, 4.2);
      rect(m.X(0.6), m.Y(17), m.X(1.05) - m.X(0.6), m.Y(5) - m.Y(17), { fill: rgba(YEL, 0.05), alpha: kz });
      rect(m.X(0.6), m.Y(17), m.X(0.75) - m.X(0.6), m.Y(5) - m.Y(17), { fill: rgba(YEL, 0.16), alpha: ep(t, 4.6, 5.2) });
      rect(m.X(1.05), m.Y(17), m.X(1.25) - m.X(1.05), m.Y(5) - m.Y(17), { fill: rgba(C.red, 0.12), alpha: ep(t, 5.4, 6.0) });
      text('Pick', m.X(0.675), m.Y(17) - 10, { role: 'label', size: 19, color: YEL, align: 'center', alpha: ep(t, 4.6, 5.2) });
      text('Thin', m.X(1.15), m.Y(17) - 10, { role: 'label', size: 19, color: C.red, align: 'center', alpha: ep(t, 5.4, 6.0) });
      series(m, R.map((r2, i) => [r2, FILLET.scfW[i]]), { color: C.comp, w: 2, dash: [6, 5], p: ep(t, 2.0, 3.2, E.lin) });
      series(m, R.map((r2, i) => [r2, FILLET.scfM[i]]), { color: YEL, w: 3, p: ep(t, 1.2, 2.6, E.lin) });
      R.forEach((r2, i) => { const k = ep(t, 1.2 + i * 0.12, 1.6 + i * 0.12); circle(m.X(r2), m.Y(FILLET.scfM[i]), 4, { fill: YEL, alpha: k }); });
      const kp = ep(t, 2.4, 2.8); circle(m.X(r), m.Y(f.scf), 11, { color: C.ink, w: 1.5, alpha: kp * 0.5 }); circle(m.X(r), m.Y(f.scf), 5, { fill: C.ink, alpha: kp });
      text('Fillet radius, {mm}', m.X(1.25), hy + 252, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ep(t, 1.0, 1.4) });
      legend(t, 2.6, x + 26, hy + 252, [{ kind: 'line', color: YEL, label: 'Same mass' }, { kind: 'dash', color: C.comp, label: 'Same struts' }], { size: 19, gap: 20 });
      const steps = [['Hold the weight', 'Every radius at the same mass'], ['Find the bottom', 'The peak flattens past 0.6 mm'], ['Take its small end', '0.6 to 0.75 mm, widest struts'], ['Check the mold', 'Struts over the 0.89 mm floor']];
      steps.forEach(([h2, b], i) => {
        const yy = hy + 300 + i * 50, k = ep(t, 3.4 + i * 0.6, 3.8 + i * 0.6);
        text(pad2(i + 1), x + 26, yy, { font: 'mono', size: 24, weight: 800, color: YEL, alpha: k });
        text(h2, x + 70, yy - 2, { role: 'label', size: 19, color: C.ink, alpha: k });
        text(b, x + 70, yy + 24, { role: 'small', size: 25, color: C.ink2, alpha: k });
      });
    }
    gloss(t, 2.6, 'Same mass', 'Every radius is compared at the same weight, so the gain is not bought with grams. The mouse has a weight target.');
    featureCard(t, 6.0, 'A fillet sized by solving', ['derived', 'datasheet'], '0.6 mm on the 1.0 mm top ribs, 0.75 on the 1.2 mm low ribs: 60% of the rib, the top of Envalior\'s 25–60% (#75).');
  }
});

/* ============================== 7. triangles that form arches (#53) ============================== */
let ARCH = null;
function archSolve() {
  if (ARCH) return ARCH;
  const span = 60, rise = 14, N = 24, yA = x => -rise * (1 - Math.pow(x / (span / 2), 2));
  const build = kind => {
    const nodes = [], els = [];
    if (kind === 'flat') { for (let i = 0; i <= N; i++) nodes.push([-30 + 60 * i / N, 0]); for (let i = 0; i < N; i++) els.push({ n: [i, i + 1] }); return { nodes, els, fixed: [0, N] }; }
    if (kind === 'arch') { for (let i = 0; i <= N; i++) { const x = -30 + 60 * i / N; nodes.push([x, yA(x)]); } for (let i = 0; i < N; i++) els.push({ n: [i, i + 1] }); return { nodes, els, fixed: [0, N] }; }
    /* a triangulated arch: an outer arch, an inner arch 5 mm below it, a zig-zag of struts between */
    const M = 12; for (let i = 0; i <= M; i++) { const x = -30 + 60 * i / M; nodes.push([x, yA(x)]); }
    const inner = []; for (let i = 0; i < M; i++) { const x = -30 + 60 * (i + 0.5) / M; inner.push(nodes.length); nodes.push([x, yA(x) + 5 * Math.sin(Math.PI * (i + 0.5) / M)]); }
    for (let i = 0; i < M; i++) { els.push({ n: [i, i + 1] }); els.push({ n: [i, inner[i]] }); els.push({ n: [inner[i], i + 1] }); if (i < M - 1) els.push({ n: [inner[i], inner[i + 1]] }); }
    return { nodes, els, fixed: [0, M] };
  };
  const len = D => D.els.reduce((a, e) => a + Math.hypot(D.nodes[e.n[1]][0] - D.nodes[e.n[0]][0], D.nodes[e.n[1]][1] - D.nodes[e.n[0]][1]), 0);
  const mass = 60 * 1.6;
  const run = (kind, xLoad) => {
    const D = build(kind), t = mass / len(D);
    for (const e of D.els) { e.A = t; e.I = t * t * t / 12; }
    let li = 0, bd = 1e9; D.nodes.forEach((p, i) => { const onTop = kind !== 'truss' || i <= 12; if (!onTop) return; const d = Math.abs(p[0] - xLoad); if (d < bd) { bd = d; li = i; } });
    const U = frameSolve(D.nodes, D.els, D.fixed, [[li, 0, -1]]);
    return { D, U, t, li, d: -U[li * 3 + 1] };
  };
  const kinds = ['flat', 'arch', 'truss'];
  ARCH = { centre: kinds.map(k => run(k, 0)), off: kinds.map(k => run(k, 15)) };
  return ARCH;
}
S({
  id: 'arches', ch: 'shell', theme: 'paper', title: 'Triangles that form arches', settle: 10, ideas: [53, 55], src: ['comsol', 'shlLattice', 'shlDoc'], three: ['lattice'],
  draw: t => {
    header(t, 'Triangles that form arches');
    captions(t, [[0.6, 'A flat span carries a press by bending, the soft way. Curve the same material into an arch and the press becomes compression.'], [4.4, 'Build the arch from triangles and no member has to bend: 22× the flat span at the same weight, 2.5× a plain arch, even off-centre.']]);
    const R = archSolve();
    /* left: three spans of the same mass, solved */
    { const x = LM, y = LAY.top, w = 1100, h = 580, hy = shlCard(t, 0.3, x, y, w, h, 'The same mass across a 60 mm span', ['derived']);
      text('Frames solved in this page, ends on screw bosses. Stiffness against the flat span:', x + 26, hy + 12, { role: 'small', size: 25, color: C.mute, maxW: w - 52, alpha: ep(t, 0.9, 1.3) });
      const c9 = t >= 9 ? (t - 9) % 8 : -1;
      const off = c9 >= 0 ? (c9 < 0.6 || c9 >= 4.0) : t > 6.2, set = off ? R.off : R.centre, base = set[0].d;
      const ld = c9 >= 0 ? (c9 < 0.6 ? 1 - ep(c9, 0, 0.6) : c9 < 4 ? ep(c9, 0.7, 1.5) * (1 - ep(c9, 3.4, 4.0)) : ep(c9, 4.1, 4.9)) : ep(t, 1.8, 2.8, E.io3) * (off ? ep(t, 6.2, 7.0, E.io3) : 1 - ep(t, 5.8, 6.2));
      const swap = c9 >= 0 ? 1 - 0.75 * Math.max(env(c9, 0.35, 0.6, 0.6, 0.85), env(c9, 3.75, 4.0, 4.0, 4.25)) : 1;
      const mag = 6 / R.centre[0].d, cols = [C.mute, C.ink2, TH ? '#A87C00' : YEL], names = ['Flat span', 'Arch', 'Triangulated arch'];
      set.forEach((r, ci) => {
        const ox = x + 190 + ci * 360, oy = y + 400, sc = 4.6, k = ep(t, 0.8 + ci * 0.3, 1.4 + ci * 0.3), D = r.D;
        const P = (i, f2) => [ox + (D.nodes[i][0] + r.U[i * 3] * mag * f2) * sc, oy + (D.nodes[i][1] + r.U[i * 3 + 1] * mag * f2) * sc];
        G.save(); G.globalAlpha = k * 0.35; G.strokeStyle = C.faint; G.lineWidth = 1.2; G.setLineDash([4, 4]); G.beginPath(); for (const e of D.els) { const p = P(e.n[0], 0), q = P(e.n[1], 0); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); } G.stroke(); G.setLineDash([]); G.restore();
        G.save(); G.globalAlpha = k; G.strokeStyle = cols[ci]; G.lineCap = 'round'; G.lineWidth = Math.max(2.4, r.t * sc * 0.6); G.beginPath(); for (const e of D.els) { const p = P(e.n[0], ld), q = P(e.n[1], ld); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); } G.stroke(); G.restore();
        for (const sx of [-1, 1]) part(0, 0, 1, () => solid(() => { G.beginPath(); G.rect(ox + sx * 30 * sc - 14, oy - 4, 28, 44); }, MT.shell, [ox + sx * 30 * sc - 14, oy - 4, 28, 44], { hatch: true }), { alpha: k });
        const lp = P(r.li, ld); arrow(lp[0], lp[1] - 80, lp[0], lp[1] - 10, { color: C.ink, w: 3, hs: 12, alpha: ep(t, 1.6, 2.0) });
        if (ci === 2) shlChip(ox, hy + 92, names[ci], k, 'center'); else text(names[ci], ox, hy + 92, { role: 'label', size: 21, color: C.ink2, align: 'center', alpha: k });
        const rel = base / r.d;
        text(rel > 1.05 ? (rel >= 10 ? rel.toFixed(0) : rel.toFixed(1)) + '×' : '1×', ox, oy + 104, { font: 'disp', size: 44, weight: 800, color: C.ink, align: 'center', alpha: ep(t, 3.0 + ci * 0.3, 3.4 + ci * 0.3) * swap, tnum: true });
      });
      text(off ? 'Finger off-centre, 15 mm from the middle' : 'Finger in the middle', x + w / 2, y + h - 30, { role: 'label', size: 21, color: off ? C.red : C.mute, align: 'center', alpha: ep(t, 2.0, 2.4) * swap });
    }
    /* right: the same idea in the study shell, cut open */
    { const x = 1220, y = LAY.top, w = RM - 1220, h = 580;
      demoWindow(x, y, w, h, ep(t, 0.5, 0.9));
      text('The study shell, cut on its centre line', x + 26, y + 46, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 0.8, 1.2) });
      const bx = x + 8, by = y + 60, bw = w - 16, bh = h - 70, st = { view: 'left', cut: ep(t, 0.9, 2.8, E.io3), zoom: 1.55, yaw: 0.12 * Math.sin(t * 0.4), pitch: 0.1 };
      shl3D('lattice', t, bx, by, bw, bh, st, { alpha: ep(t, 0.6, 1.2) });
      const pB = shlProj(st, [bx, by, bw, bh], [23.69, 11.2, 9.26]), pA = shlProj(st, [bx, by, bw, bh], [24, 22, 22]), pC = shlProj(st, [bx, by, bw, bh], [0.5, 37.6, -13]);
      callout(t, 3.0, pA, 'Ribs run rim to rim over the crown', { to: [pA[0] - 40, y + h - 62], side: 'l', prose: true, color: C.ink, tcolor: C.ink, maxW: 300 });
      callout(t, 3.5, pB, 'Screw boss', { to: [pB[0] + 78, y + 116], side: 'r', color: C.ink, tcolor: C.ink });
      callout(t, 4.0, pC, 'Wall, cut', { to: [pC[0] - 65, y + 116], side: 'l', color: C.ink, tcolor: C.ink });
    }
    gloss(t, 3.2, 'Arch', 'A curve that turns a downward push into compression along itself, delivered to its feet. It needs solid feet to push against, like screw bosses.');
    featureCard(t, 6.2, 'Arches, not separate struts', ['derived', 'proposal'], 'Lamzu\'s Maya props its low front on separate struts. I join them into arches from rim to rim, landing on the bosses (#53, #55).');
  }
});

/* ============================== 8. the board is a tie, not a beam (#94, with #31) ==============================
   FR4 against AZ91D from their datasheets, then an arch whose feet can slide apart, with and without the board tying them:
   a 2D frame solved in this page (CF-PP walls, an FR4 strip 1.0 mm thick at board height, E folded in as 19/13.5). */
const SHL_BOW = (function () {
  const N = 40, nodes = [];
  for (let i = 0; i <= N; i++) { const th = Math.PI * (1 - i / N), c = Math.cos(th), s = Math.sin(th); nodes.push([30 * Math.sign(c) * Math.pow(Math.abs(c), 0.6), -34 * Math.pow(s, 0.7)]); }
  const near = (side, y) => { let best = 0, bd = 1e9; nodes.forEach((p, i) => { if (Math.sign(p[0]) !== side) return; const d = Math.abs(p[1] - y); if (d < bd) { bd = d; best = i; } }); return best; };
  const crown = N / 2, tL = near(-1, -4.5), tR = near(1, -4.5);
  const L = i => Math.hypot(nodes[i + 1][0] - nodes[i][0], nodes[i + 1][1] - nodes[i][1]);
  const taperRaw = y => 0.7 + 0.6 * (1 + y / 34); let num = 0, den = 0; for (let i = 0; i < N; i++) { const y = (nodes[i][1] + nodes[i + 1][1]) / 2; num += 1.2 * L(i); den += taperRaw(y) * L(i); }
  const th = y => taperRaw(y) * num / den, Et = 19 / 13.5;
  const run = tie => {
    const els = []; for (let i = 0; i < N; i++) { const t2 = th((nodes[i][1] + nodes[i + 1][1]) / 2); els.push({ n: [i, i + 1], A: t2, I: t2 ** 3 / 12, t: t2 }); }
    if (tie) els.push({ n: [tL, tR], A: Et, I: Et / 12, t: 1.0, tie: true });
    const U = frameSolve(nodes, els, [[0, 0], [0, 1], [N, 1]], [[crown, 0, 1]]);
    return { els, U, d: U[crown * 3 + 1] };
  };
  const free = run(false), tied = run(true);
  return { nodes, N, crown, tL, tR, free, tied, ratio: free.d / tied.d };
})();
S({
  id: 'shlPcbRib', ch: 'shell', theme: 'night', title: 'The board is a tie, not a beam', settle: 10, ideas: [94, 31], src: ['shlFr4', 'az91d', 'shlLattice', 'shlDoc'], three: ['lattice'],
  draw: t => {
    header(t, 'The board is a tie, not a beam');
    captions(t, [[0.6, 'FR4, the core of a circuit board, is stronger in tension than magnesium alloy, but less than half as stiff.'], [4.6, 'So the board should pull, not bend. Tie the side ribs to its edge and it holds the arches\' feet together, like a bowstring.']]);
    /* left: the study shell, cut, with the ribs landing on the board edge */
    { const x = LM, y = LAY.top, w = 960, h = 580;
      demoWindow(x, y, w, h, ep(t, 0.3, 0.7));
      text('Side ribs landing on the board edge, study shell', x + 26, y + 46, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 0.6, 1.0) });
      const bx = x + 8, by = y + 62, bw = w - 16, bh = h - 70, st = { view: [-0.75, 0.55, -0.25], target: [24, 9, 12], cut: 1, zoom: 4.0, yaw: 0.06 * Math.sin(t * 0.4) };
      shl3D('lattice', t, bx, by, bw, bh, st, { alpha: ep(t, 0.5, 1.1) });
      const p1 = shlProj(st, [bx, by, bw, bh], [25.2, 5.6, 19.3]), p2 = shlProj(st, [bx, by, bw, bh], [14, 5.0, 12]), p3 = shlProj(st, [bx, by, bw, bh], [23.69, 11.2, 9.26]);
      callout(t, 2.2, p1, 'Rib meets the board edge, 24 ties', { to: [p1[0] + 110, by + 66], side: 'r', prose: true, color: YEL, tcolor: C.ink, maxW: 240 });
      callout(t, 2.8, p2, 'Board, 1.0 mm FR4', { to: [p2[0] + 120, by + bh - 30], side: 'r', color: C.ink, tcolor: C.ink });
      callout(t, 3.4, p3, 'Screw boss', { to: [p3[0] - 130, by + 60], side: 'l', color: C.ink, tcolor: C.ink });
    }
    /* right top: FR4 against magnesium */
    { const x = 1080, y = LAY.top, w = RM - 1080, h = 270, hy = shlCard(t, 0.5, x, y, w, h, 'FR4 against magnesium AZ91D', ['datasheet']);
      const rows = [['Tensile strength, {MPa}', 500, [430, 430], [160, 220], '2.0–2.7× stronger'], ['Stiffness, modulus, {GPa}', 50, [18, 20], [46, 46], 'Under half as stiff']];
      rows.forEach(([nm, max, fr, mg, verdict], i) => {
        const yy = hy + 22 + i * 92, a = ep(t, 1.2 + i * 0.6, 1.6 + i * 0.6), k = ep(t, 1.3 + i * 0.6, 2.1 + i * 0.6, E.snap);
        text(nm, x + 26, yy, { role: 'label', size: 19, color: C.ink, alpha: a });
        text(verdict, x + w - 26, yy, { role: 'label', size: 19, color: i ? C.red : YEL, align: 'right', alpha: ep(t, 2.0 + i * 0.6, 2.4 + i * 0.6) });
        const e1 = shlBar({ x: x + 100, y: yy + 26, w: w - 100 - 150, max, lo: fr[0], hi: fr[1], col: YEL, h: 12, a, k });
        text('FR4', x + 26, yy + 33, { role: 'label', size: 19, color: YEL, alpha: a }); text(fr[0] === fr[1] ? String(fr[0]) : fr[0] + '–' + fr[1], e1 + 10, yy + 34, { font: 'mono', size: 22, weight: 700, color: C.ink, alpha: clamp(k * 1.4 - 0.3) });
        const e2 = shlBar({ x: x + 100, y: yy + 56, w: w - 100 - 150, max, lo: mg[0], hi: mg[1], col: C.ink2, h: 12, a, k });
        text('AZ91D', x + 26, yy + 63, { role: 'label', size: 19, color: C.ink2, alpha: a }); text(mg[0] === mg[1] ? String(mg[0]) : mg[0] + '–' + mg[1], e2 + 10, yy + 64, { font: 'mono', size: 22, weight: 700, color: C.ink, alpha: clamp(k * 1.4 - 0.3) });
      });
    }
    /* right bottom: an arch whose feet can slide, without and with the board */
    { const x = 1080, y = 558, w = RM - 1080, h = 294, hy = shlCard(t, 0.7, x, y, w, h, 'Press the crown, feet free to slide', ['derived']);
      const B = SHL_BOW, ld = ep(t, 3.0, 4.2, E.io3) * (t > 4.2 ? 0.85 + 0.15 * Math.cos((t - 4.2) * 1.7) : 1), mag = 8 / B.free.d;
      /* both drawn at one scale: the free arch's crown drops 8 mm on screen, the tied one by the same factor less */
      [[B.free, 'No tie', x + 190, false], [B.tied, 'Tied by the board', x + w - 190, true]].forEach(([R, lab, ox, tied], j) => {
        const oy = y + h - 58, sc = 3.0, k = ep(t, 2.6 + j * 0.3, 3.0 + j * 0.3);
        const P = (i, ff) => [ox + (B.nodes[i][0] + R.U[i * 3] * mag * ff) * sc, oy + (B.nodes[i][1] + R.U[i * 3 + 1] * mag * ff) * sc];
        G.save(); G.globalAlpha = k * 0.4; G.strokeStyle = C.faint; G.lineWidth = 1.2; G.setLineDash([4, 4]); G.beginPath(); B.nodes.forEach((p, i) => { const q = P(i, 0); i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); }); G.stroke(); G.setLineDash([]); G.restore();
        G.save(); G.globalAlpha = k; G.lineCap = 'round';
        for (const e of R.els) { const p = P(e.n[0], ld), q = P(e.n[1], ld); G.lineWidth = e.tie ? 4 : Math.max(2, e.t * sc * 0.9); G.strokeStyle = e.tie ? '#6fae86' : (TH ? '#5F5E59' : '#B9B8B2'); G.beginPath(); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); G.stroke(); }
        G.restore();
        line(ox - 36 * sc, oy + 3, ox + 36 * sc, oy + 3, { color: C.faint, w: 1.5, alpha: k });
        const cp = P(B.crown, ld); arrow(cp[0], cp[1] - 46, cp[0], cp[1] - 8, { color: C.ink, w: 2.5, hs: 10, alpha: ep(t, 2.8, 3.2) });
        text(lab, ox, y + h - 20, { role: 'label', size: 19, color: tied ? '#6fae86' : C.mute, align: 'center', alpha: k });
      });
      rich([{ s: B.ratio.toFixed(1) + '×', font: 'disp', size: 40, weight: 800, color: C.ink, tnum: true }, { s: 'stiffer, tied', role: 'label', size: 19, color: C.mute, gap: 12 }], x + w / 2, hy + 30, { align: 'center', alpha: ep(t, 4.4, 4.8) });
    }
    gloss(t, 2.6, 'Tie', 'A member that holds two points together in tension, like the string of a bow. That is where FR4\'s strength counts.');
    featureCard(t, 6.0, 'The board as a structural tie', ['datasheet', 'derived', 'proposal'], 'With the board holding the arches\' feet, the bottom plate is free to come off (#31). The board\'s mass is spent anyway (#94).');
  }
});

/* ============================== 9. shell structures that ship, and the test none of them publishes (#15, #57, #53, #55) ============================== */
const SHL_STRUCTS = [
  { id: 'finalmouse-ulx', name: 'Finalmouse ULX', how: 'Honeycomb cutouts', say: '"Flexes and creaks with pressure"', who: 'RTINGS', ev: 'measured' },
  { id: 'ninjutso-sora-v2', name: 'Ninjutso Sora V2', how: 'Solid shell', say: '"Feels solid"', who: 'RTINGS', ev: 'measured' },
  { id: 'ninjutso-sora-v3', name: 'Ninjutso Sora V3', how: 'Thin shell, endoskeleton', say: '"2x more rigid structure-wise"', who: 'Ninjutso', ev: 'claim' },
  { id: 'finalmouse-slx', name: 'Finalmouse Starlight X', how: 'Three-part unibody', say: '"Rigid unibody main shell"', who: 'Finalmouse, via Back2Gaming', ev: 'claim' },
  { id: 'lamzu-maya', name: 'Lamzu Maya', how: 'Front struts to the triggers', say: 'Low front propped on struts', who: 'per Brock', ev: 'claim' },
  { hero: true, name: 'Theseus', how: 'Solid, triangle arches, board tie', g: 29, say: '465 N/mm at the crown', who: 'study model, to be measured', ev: 'derived' }
];
S({
  id: 'shlStructs', ch: 'shell', theme: 'paper', title: 'Shell structures that ship', settle: 10, ideas: [15, 57, 53, 55],
  src: ['shlRtingsSoraUlx', 'shlSoraV3', 'shlB2gSlx', 'shlDoc', 'exRtings', 'shlLattice'],
  draw: t => {
    header(t, 'Shell structures that ship');
    captions(t, [[0.6, 'RTINGS found the Sora V2 solid and the ULX flexing and creaking. The Starlight X and the Sora V3 claim rigidity.'], [5.2, 'None of them publishes a number. Mine will be in N/mm at five points, measured on the same rig against both.']]);
    /* left: the table */
    { const x = LM, y = LAY.top, w = 1200, h = 580, a0 = ep(t, 0.6, 1.0);
      demoWindow(x, y, w, h, ep(t, 0.3, 0.7));
      const cN = x + 26, cW = x + 430, wW = 230, cS = x + 790;
      text('Mouse, structure', cN, y + 46, { role: 'label', size: 19, color: C.mute, alpha: a0 });
      text('Weight, {g}', cW, y + 46, { role: 'label', size: 19, color: C.mute, alpha: a0 });
      text('Stiff, says who', cS, y + 46, { role: 'label', size: 19, color: C.mute, alpha: a0 });

      line(x + 26, y + 62, x + w - 26, y + 62, { color: C.hair, w: 1.5, alpha: a0 });
      SHL_STRUCTS.forEach((r, i) => {
        const yy = y + 110 + i * 74, t0 = 0.9 + i * 0.3, a = ep(t, t0, t0 + 0.4), k = ep(t, t0 + 0.1, t0 + 0.9, E.snap);
        if (i) line(x + 26, yy - 42, x + w - 26, yy - 44, { color: C.hair, w: 1, alpha: a });
        if (r.hero) rect(x + 10, yy - 34, 5, 66, { fill: YEL, alpha: a });
        const W0 = r.hero ? { g: r.g, ev: 'proposal' } : exWeight(r.id) || { g: null };
        text(r.name, cN, yy - 2, { role: 'small', size: 25, weight: r.hero ? 800 : 700, color: C.ink, alpha: a });
        text(r.how, cN, yy + 24, { role: 'label', size: 19, color: r.hero ? C.heroText : C.mute, alpha: a });
        if (W0.g != null) {
          const xe = shlBar({ x: cW, y: yy - 8, w: wW, max: 50, v: W0.g, col: r.hero ? YEL : C.comp, h: 14, a, k, edge: r.hero ? '#111111' : null });
          text(fmtN(W0.g, 1), xe + 10, yy, { font: 'mono', size: 24, weight: r.hero ? 800 : 600, color: C.ink, alpha: clamp(k * 1.4 - 0.3) });
        }
        evDot(cS - 14, yy - 8, r.ev, 5, a);
        text(r.say, cS, yy - 2, { role: 'small', size: 25, weight: r.hero ? 700 : 500, color: C.ink, alpha: a, t, t0: t0 + 0.2, cps: 120 });
        text(r.who, cS, yy + 24, { role: 'label', size: 19, color: r.hero ? C.heroText : C.faint, alpha: a });
      });
      text('RTINGS weights; Theseus is the target.', x + 26, y + h - 22, { role: 'small', size: 25, color: C.faint, alpha: ep(t, 3.0, 3.4) });
      text('Published N/mm: none', x + w - 26, y + h - 22, { role: 'label', size: 21, color: C.red, align: 'right', alpha: ep(t, 2.6, 3.0) });
    }
    /* right: the deflection test, on the key plan */
    { const x = 1320, y = LAY.top, w = RM - 1320, h = 580, hy = shlCard(t, 0.5, x, y, w, h, 'Published test', ['proposal']);
      const kx = x + w / 2, ky = hy + 164, s = 1.75, S2 = s * 1.18;
      keyPlan(t, 1.0, kx, ky, { s, label: 'Top view' });
      const pts = [[0, 13, 'Crown'], [-14, -35, 'Left button'], [14, -35, 'Right button'], [-28.5, 8, 'Left side'], [28.5, 8, 'Right side']];
      const cur = t < 3 ? -1 : Math.floor((t - 3) / 1.4) % 5, ph = t < 3 ? 0 : ((t - 3) % 1.4) / 1.4;
      pts.forEach(([px, py], i) => {
        const X = kx + px * S2, Y = ky + py * S2, a = ep(t, 1.6 + i * 0.15, 2.0 + i * 0.15), on = i === cur;
        circle(X, Y, 15, { fill: on ? YEL : C.panel, alpha: a }); circle(X, Y, 15, { color: C.ink, w: 1.8, alpha: a });
        text(String(i + 1), X, Y + 7, { font: 'mono', size: 19, weight: 800, color: '#111111', align: 'center', alpha: a });
        if (on) circle(X, Y, 15 + 22 * ph, { color: C.ink, w: 1.5, alpha: (1 - ph) * 0.6 });
      });
      const ka = ep(t, 3.0, 3.4), nm = cur >= 0 ? pts[cur][2] : 'Crown';
      text('10 N at each of five points', x + 26, hy + 362, { role: 'small', size: 25, color: C.ink2, maxW: w - 52, alpha: ka });
      rich([{ s: '465', font: 'disp', size: 50, weight: 800, color: C.ink, tnum: true }, { s: 'N/mm at the crown', role: 'label', size: 19, color: C.mute, gap: 12 }], x + 26, hy + 428, { alpha: ep(t, 3.4, 3.8) });
      pill(x + 26, y + h - 20, 'derived', ep(t, 3.6, 4.0), { text: 'Derived, this model' });
      void nm;
    }
    gloss(t, 2.6, 'Deflection test', 'Push the shell with a known force at a marked point and measure how far it moves. Force over distance: N/mm.');
    featureCard(t, 6.0, 'A published deflection test', ['measured', 'proposal'], 'Five points, 10 N each, the Starlight X and the Sora V3 on the same rig, raw numbers published (#15, #57).');
  }
});

/* ============================== 10. fewer parts, tighter gaps (#57) ============================== */
let TOL = null;
function tolSim() {
  if (TOL) return TOL;
  const r = rng(29), gauss = () => { const u = Math.max(1e-9, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); };
  const sigma = 0.05 / 3, spec = 0.05, n = 2400;
  const sets = [1, 3, 6].map(N => { const g = []; for (let i = 0; i < n; i++) { let s = 0; for (let k = 0; k < N; k++) s += gauss() * sigma; g.push(s); } const out = g.filter(v => Math.abs(v) > spec).length / n; return { N, g, out }; });
  return (TOL = { sets, sigma, spec, n });
}
S({
  id: 'tolerance', ch: 'shell', theme: 'night', title: 'Fewer parts, tighter gaps', settle: 10, ideas: [57], src: ['dfma', 'shlB2gSlx', 'xt1', 'rtingsUlx'], three: ['shell'],
  draw: t => {
    header(t, 'Fewer parts, tighter gaps');
    captions(t, [[0.6, 'Every part is a little off its drawing. One part\'s error I can measure and correct in the steel.'], [3.9, 'Stack the same seam through six parts and a fifth of the mice fall outside the gap, with every part in spec.'], [7.0, 'The Starlight X went from four shell parts to three. I want the rim, hump and sides as one body.']]);
    const T = tolSim();
    /* left: 2,400 simulated mice per build */
    { const x = LM, y = LAY.top, w = 1180, h = 580, hy = shlCard(t, 0.3, x, y, w, h, '2,400 simulated mice: one seam\'s gap', ['derived']);
      text('Each part off by up to ±0.05 mm at 3σ; the seam allows ±0.05 mm.', x + 26, hy + 12, { role: 'small', size: 25, color: C.mute, alpha: ep(t, 0.9, 1.3) });
      const fill = ep(t, 1.4, 4.4, E.lin);
      T.sets.forEach((st, ci) => {
        const ox = x + 40 + ci * 380, oy = y + 470, bw = 330, bins = 31, lo = -0.155, hi = 0.155, X = v => ox + bw * (v - lo) / (hi - lo), cnt = new Array(bins).fill(0);
        const shown = Math.floor(st.g.length * fill);
        for (let i = 0; i < shown; i++) { const b = Math.floor((st.g[i] - lo) / (hi - lo) * bins); if (b >= 0 && b < bins) cnt[b]++; }
        const cmax = T.n * 0.42, k = ep(t, 1.0 + ci * 0.2, 1.4 + ci * 0.2), inCol = ci ? C.comp : YEL;
        rect(X(-T.spec), oy - 240, X(T.spec) - X(-T.spec), 240, { fill: inkA(0.06), alpha: k });
        for (let b = 0; b < bins; b++) { const v0 = lo + (hi - lo) * b / bins, v1 = v0 + (hi - lo) / bins, hb = Math.min(240, 240 * cnt[b] / cmax), inSpec = Math.abs((v0 + v1) / 2) <= T.spec; rect(X(v0) + 1, oy - hb, X(v1) - X(v0) - 2, hb, { fill: inSpec ? inCol : C.red }); }
        if (t > 5) {
          const per = 0.42, j = Math.floor((t - 5) / per), ph = ((t - 5) % per) / per, v = st.g[(j * 7 + ci * 13) % st.g.length], b = Math.floor((v - lo) / (hi - lo) * bins);
          if (b >= 0 && b < bins) {
            const hb = Math.min(240, 240 * cnt[b] / cmax), xx = X(lo + (hi - lo) * (b + 0.5) / bins), y1 = oy - hb - 6, yy = lerp(oy - 240, y1, E.in3(clamp(ph / 0.7))), bad = Math.abs(v) > T.spec, la = ep(t, 5, 5.4);
            circle(xx, yy, 5, { fill: bad ? C.red : inCol, alpha: la * (1 - clamp((ph - 0.85) / 0.15)) });
            if (ph > 0.7) circle(xx, y1, 5 + (ph - 0.7) * 40, { color: bad ? C.red : inCol, w: 1.5, alpha: la * (1 - (ph - 0.7) / 0.3) * 0.7 });
          }
        }
        line(ox, oy, ox + bw, oy, { color: C.faint, w: 1.5, alpha: k });
        for (const v of [-0.1, 0, 0.1]) text((v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1), X(v), oy + 26, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: k });
        if (ci === 0) shlChip(ox, oy - 262, 'One part', k); else text(st.N + ' parts', ox, oy - 262, { role: 'label', size: 21, color: C.ink, alpha: k });
        const outNow = shown ? st.g.slice(0, shown).filter(v => Math.abs(v) > T.spec).length / shown : 0;
        text((outNow * 100).toFixed(1) + '% out', ox, oy + 66, { font: 'mono', size: 26, weight: 800, color: outNow > 0.05 ? C.red : C.ink, alpha: ep(t, 1.8, 2.2) });
      });
      text('Gap error, {mm}', x + w - 26, y + h - 22, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ep(t, 1.4, 1.8) });
    }
    /* right: the parts of the shell, apart */
    { const x = 1300, y = LAY.top, w = RM - 1300, h = 580;
      demoWindow(x, y, w, h, ep(t, 0.5, 0.9));
      text('Theseus, taken apart', x + 26, y + 46, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 0.8, 1.2) });
      const ex = t < 1.6 ? 0 : 0.8 * (0.5 - 0.5 * Math.cos((t - 1.6) * TAU / 8));
      shl3D('shell', t, x + 8, y + 64, w - 16, 300, { view: 'threeQuarter', explode: ex, zoom: 1.25, yaw: 0.1 * Math.sin(t * 0.3) }, { alpha: ep(t, 0.6, 1.2) });
      const notes = [['Starlight X', 'Three shell parts, down from four', 'claim'], ['Theseus', 'Rim, hump and sides in one body; two triggers; a plate you can leave off', 'proposal']];
      let ny = y + 404;
      notes.forEach(([who, s2, ev], i) => {
        const a = ep(t, 3.2 + i * 0.8, 3.6 + i * 0.8);
        if (i) shlChip(x + 26, ny, who, a); else text(who, x + 26, ny, { role: 'label', size: 21, color: C.ink, alpha: a });
        evDot(x + w - 32, ny - 8, ev, 5, a);
        const r2 = text(s2, x + 26, ny + 36, { role: 'small', size: 25, color: C.ink2, maxW: w - 52, lh: 1.3, t, t0: 3.3 + i * 0.8, cps: 120, alpha: a });
        ny += 36 + r2.h + 20;
      });
    }
    gloss(t, 2.8, 'Tolerance stack', 'Every part is made slightly off. Where parts meet, their errors add up at the seam you see and feel.');
    featureCard(t, 6.2, 'One body for rim, hump and sides', ['derived', 'claim', 'proposal'], 'Each seam then holds one part\'s error, tuned in the steel. I\'ll publish the panel gaps (#57).');
  }
});

/* ============================== 11. a solid shell keeps the encoder clean (#15, #98) ============================== */
S({
  id: 'sealed', ch: 'shell', theme: 'paper', title: 'A solid shell keeps the encoder clean', settle: 9, ideas: [15, 98], src: ['pulsarEnc', 'shlDoc'],
  draw: t => {
    header(t, 'A solid shell keeps the encoder clean');
    captions(t, [[0.6, 'Cutouts save weight, but each one is an open path to the encoder, one of the most common failure points in a mouse.'], [3.8, 'A solid shell also molds more easily: no small isolated areas for the plastic to reach.'], [6.4, 'Sweat shows a little more on a solid surface, and a good coating handles that. Gunk in holes doesn\'t wipe off.']]);
    const wx = LM, wy = LAY.top, ww = RM - LM, wh = 580;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const r = rng(11), parts = [];
    for (let i = 0; i < 170; i++) parts.push([r(), r(), 0.6 + r() * 0.8]);
    const S2 = 19, pile = clamp((t - 2.2) / 7);
    const panel = (ox, holes, label) => {
      const w = 780, y0 = wy + 220, k = ep(t, 0.6, 1.2), hx = [], ex = ox + 230, ey = y0 + 150;
      if (holes) for (let x = ox + 34; x < ox + w - 40; x += 48) hx.push(x);
      part(0, 0, 1, () => {
        const xs = [ox].concat(hx.flatMap(h => [h, h + 22])).concat([ox + w]);
        for (let i = 0; i < xs.length; i += 2) { const a = xs[i], b = xs[i + 1]; solid(() => { G.beginPath(); G.rect(a, y0, b - a, 26); }, MT.shell, [a, y0, b - a, 26], { hatch: true }); }
      }, { alpha: k });
      part(ex, ey, S2, () => encoderMM({}), { alpha: k });
      text('Encoder', ex, ey + 5.0 * S2 + 56, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: k });
      const eTop = ey - 3.6 * S2, eL = ex - 3.8 * S2, eR = ex + 3.8 * S2;
      for (const [u, v, sp] of parts) {
        if (t < 1.6) continue;
        const tt = (t - 1.6) * sp * 0.45 + v, ph = tt % 1, cyc2 = Math.floor(tt);
        const x = ox + 20 + ((u * 7.31 + cyc2 * 0.37) % 1) * (w - 40); let y = wy + 80 + ph * 330;
        const overHole = hx.some(h2 => x > h2 + 2 && x < h2 + 20);
        if (y > y0 - 3 && !(holes && overHole)) y = y0 - 3;
        else if (y > y0 + 26) { if (!(x > eL && x < eR) && y > y0 + 70) continue; y = Math.min(y, x > eL && x < eR ? eTop - 3 : y); }
        circle(x, y, 2.2, { fill: y >= y0 + 26 ? C.red : C.ink2, alpha: 0.8 * (y >= y0 + 26 && !(x > eL && x < eR) ? 1 - clamp((y - y0 - 26) / 44) : 1) });
      }
      const rp = rng(holes ? 5 : 9), n = Math.floor(pile * 46);
      for (let i = 0; i < n; i++) { const u = rp(), v2 = rp(); const px = holes ? lerp(eL + 10, eR - 10, u) : lerp(ox + 240, ox + 520, u), py = (holes ? eTop : y0) - 3 - v2 * 7 * Math.sin(u * Math.PI); circle(px, py, 2.6, { fill: holes ? C.red : C.ink2, alpha: k * 0.9 }); }
      if (!holes && pile > 0.4) text('On the outside: wipe it off', ox + 380, y0 - 26, { role: 'label', size: 21, color: C.ink, align: 'center', alpha: ep(t, 4.6, 5.0) });
      /* #98: the board under the encoder carries a thin urethane coat; a drop that gets in beads on it */
      if (!holes) { const by = ey + 5.0 * S2, kc = ep(t, 5.2, 5.8); line(ex - 8 * S2, by - 2, ex + 8 * S2, by - 2, { color: YEL, w: 3, alpha: kc }); const dph = ((t - 5.2) % 3) / 3, dx = ex + 5.2 * S2; if (t > 5.2) { circle(dx, by - 10 - 4 * Math.sin(dph * Math.PI), 7, { fill: rgba(C.blue, 0.75), alpha: kc }); } text('Coated board, #98', ex + 8 * S2 + 14, by + 6, { role: 'label', size: 19, color: C.heroText, alpha: kc }); }
      const sx = ox + 410, sy = y0 + 92, sw2 = 340, sh2 = 44, kk = ep(t, 1.4, 1.8);
      text('Scroll signal', sx, sy - 14, { role: 'label', size: 19, color: C.mute, alpha: kk });
      rr(sx, sy, sw2, sh2 + 14, 6, inkA(0.04), inkA(0.14), 1, kk);
      const off = (t * 70) % 22, pts = [];
      for (let j = -1; j < sw2 / 22 + 1; j++) {
        const x0 = sx + 8 + j * 22 - off, id = Math.floor((t * 70) / 22) + j, h = Math.abs(Math.sin(id * 12.9898) * 43758.5453) % 1, bad = holes && h < pile * 0.42;
        const hi = sy + 10, lo = sy + sh2 + 2;
        pts.push([x0, lo], [x0, bad ? lo : hi], [x0 + 11, bad ? lo : hi], [x0 + 11, lo]);
        if (bad) { G.save(); G.beginPath(); G.rect(sx + 2, sy, sw2 - 4, sh2 + 14); G.clip(); rect(x0 - 2, sy + 4, 15, sh2 + 4, { fill: rgba(C.red, 0.16), alpha: kk }); G.restore(); }
      }
      G.save(); G.beginPath(); G.rect(sx + 2, sy, sw2 - 4, sh2 + 14); G.clip(); poly(pts, { color: holes ? C.red : C.ink, w: 2, alpha: kk }); G.restore();
      text(holes ? (pile > 0.15 ? 'Missed steps' : 'Clean, for now') : 'Clean', sx + sw2, sy + sh2 + 42, { role: 'label', size: 19, color: holes && pile > 0.15 ? C.red : C.ink, align: 'right', alpha: kk });
      if (holes) text(label, ox, wy + 56, { role: 'label', size: 21, color: C.red, t, t0: 1.0, cps: 60 });
      else shlChip(ox, wy + 56, label, ep(t, 1.0, 1.4));
    };
    panel(wx + 50, true, 'Cutouts: dust and liquid reach the encoder');
    panel(wx + 900, false, 'Solid: they stay outside, where you can wipe them');
    text('An illustration. Pulsar\'s support page blames jittery scrolling on dust, dirt or fluids in the encoder.', wx + 26, wy + wh - 22, { role: 'small', size: 25, color: C.faint, alpha: ep(t, 2.4, 2.8), maxW: ww - 52 });
    gloss(t, 3.0, 'Encoder', 'The part that reads the wheel turning. It is open, so dirt inside shows up as skipped or jittery scrolling.');
    featureCard(t, 4.6, 'A fully solid shell', ['claim', 'proposal'], 'No path for dust or sweat to the encoder (#15), and a urethane coat on the board for whatever gets in (#98).');
  }
});

/* ============================== 12. what a solid shell weighs (#15, #31, #93) ============================== */
S({
  id: 'shlGrams', ch: 'shell', theme: 'night', title: 'What a solid shell weighs', settle: 10, ideas: [15, 31, 93],
  src: ['exXbabWeight', 'shlZkM1k', 'shlLattice', 'shlB2gSlx', 'shlNimbus', 'exJauch', 'shlDoc'],
  draw: t => {
    header(t, 'What a solid shell weighs');
    captions(t, [[0.6, 'The shell is the biggest line in a light mouse: 12.16 g of the XA25\'s 24.94 g. My 29 g budget leaves it 9.55 g.'], [5.0, 'My structure study weighs 16.4 g: it was built to compare lattices, not to make weight. Closing that gap is the next pass.']]);
    /* left: shell masses, one scale */
    { const x = LM, y = LAY.top, w = 1080, h = 580, hy = shlCard(t, 0.3, x, y, w, h, 'Shell and skates, {g}', ['claim', 'derived']);
      const bx = x + 400, bw = w - 400 - 150, max = 18, X = g => bx + bw * g / max, a0 = ep(t, 0.8, 1.2);
      for (const g of [0, 5, 10, 15]) { line(X(g), hy + 20, X(g), hy + 410, { color: C.hair, w: 1.2, alpha: a0 }); text(String(g), X(g), hy + 8, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: a0 }); }
      const rows = [
        { name: 'Theseus budget', sub: '29 g minus the other parts', seg: [[9.55, YEL]], ev: 'derived', hero: true, lab: '9.55' },
        { name: 'XBAB XA25', sub: 'Wired, 24.94 g in all', seg: [[12.16, C.comp]], ev: 'claim', lab: '12.16' },
        { name: 'Zaunkoenig M1K', sub: 'Carbon shell + printed base', seg: [[7.5, C.comp], [5.7, C.comp2]], ghost: 11.6, ev: 'claim', lab: '13.2' },
        { name: 'Theseus study shell', sub: 'Walls + ribs, no base, no skates', seg: [[11.19, rgba(YEL, 0.5)], [5.17, rgba(YEL, 0.28)]], ev: 'derived', lab: '16.4', over: true }
      ];
      rows.forEach((r, i) => {
        const yy = hy + 74 + i * 96, t0 = 1.0 + i * 0.35, a = ep(t, t0, t0 + 0.4), k = ep(t, t0 + 0.1, t0 + 1.0, E.snap);
        if (r.hero) rect(x + 10, yy - 32, 5, 64, { fill: YEL, alpha: a });
        text(r.name, x + 26, yy - 2, { role: 'small', size: 25, weight: r.hero ? 800 : 700, color: C.ink, alpha: a });
        text(r.sub, x + 26, yy + 24, { role: 'label', size: 19, color: r.hero || r.over ? C.heroText : C.mute, alpha: a });
        let gx = 0; const bh = 22;
        r.seg.forEach(([g, col], j) => { const x0 = X(gx), x1 = X(gx + g * k); rect(x0, yy - bh / 2 - 4, Math.max(0, x1 - x0 - (j < r.seg.length - 1 ? 2 : 0)), bh, { fill: col, alpha: a }); gx += g; });
        if (r.hero) rect(X(0), yy - bh / 2 - 4, X(9.55 * k) - X(0), bh, { color: TH ? '#111111' : 'rgba(0,0,0,0)', w: 1.5, alpha: a });
        if (r.ghost) { G.save(); G.globalAlpha = a * ep(t, 3.0, 3.4); G.setLineDash([5, 4]); G.strokeStyle = C.ink2; G.lineWidth = 1.5; G.strokeRect(X(0), yy - bh / 2 - 8, X(r.ghost) - X(0), bh + 8); G.restore(); text('11.6 with its light base', X(r.ghost) + 10, yy + 32, { role: 'label', size: 19, color: C.mute, alpha: a * ep(t, 3.0, 3.4) }); }
        if (r.over) { text('Walls 11.2', X(0) + 10, yy + 2, { role: 'label', size: 19, color: '#111111', alpha: a * k }); text('Ribs 5.2', X(11.19) + 10, yy + 2, { role: 'label', size: 19, color: '#111111', alpha: a * k }); }
        text(r.lab, X(gx * k) + 12, yy + 4, { font: 'mono', size: 26, weight: 800, color: C.ink, alpha: clamp(k * 1.4 - 0.3) });
        evDot(x + w - 30, yy - 6, r.ev, 5, a);
      });
      /* the budget line through every row, and the gap */
      const kb = ep(t, 2.6, 3.2);
      line(X(9.55), hy + 30, X(9.55), hy + 30 + 380 * kb, { color: YEL, w: 2.5, dash: [8, 6] });
      const kg = ep(t, 3.6, 4.2), gy = hy + 74 + 3 * 96 + 52;
      if (kg > 0) { line(X(9.55), gy, X(9.55) + (X(16.36) - X(9.55)) * kg, gy, { color: C.red, w: 2.5 }); line(X(16.36), gy - 8, X(16.36), gy + 8, { color: C.red, w: 2.5, alpha: kg }); text('6.8 g over', X(16.36) + 14, gy + 8, { role: 'label', size: 21, color: C.red, alpha: kg }); }
    }
    /* right: where the grams can come from */
    { const x = 1200, y = LAY.top, w = RM - 1200, h = 580, hy = shlCard(t, 0.5, x, y, w, h, 'Where the grams can come from', []);
      const items = [
        ['A base you can leave off', '#31', 'M1K bases: 5.7 g, or 4.1 g light.', 'claim'],
        ['A lighter resin', '#5', 'At the SLX\'s 0.9 g/cm³: 1.8 g off the study.', 'derived'],
        ['Wall where the load is', '#93', '0.9 to 1.2 mm now; less where the FE allows.', 'proposal'],
        ['A smaller cell', 'Battery', '140 mAh frees 2.5 g, for 44% fewer hours.', 'derived']
      ];
      let yy = hy + 16;
      items.forEach(([h2, tag2, b, ev], i) => {
        const a = ep(t, 2.0 + i * 0.5, 2.4 + i * 0.5);
        rich([{ s: h2, role: 'label', size: 21, color: C.ink }, { s: tag2, role: 'label', size: 19, color: C.mute, gap: 14 }], x + 26, yy, { alpha: a });
        evDot(x + w - 32, yy - 8, ev, 5, a);
        const r2 = text(b, x + 26, yy + 34, { role: 'small', size: 25, color: C.ink2, maxW: w - 52, lh: 1.3, t, t0: 2.1 + i * 0.5, cps: 130, alpha: a });
        yy += 34 + r2.h + 26;
      });
    }
    gloss(t, 3.0, 'Shell and skates', 'Every housing part plus the feet: top, sides, base and skates. The buttons, boards and battery are counted elsewhere.');
    featureCard(t, 6.0, 'A solid shell at 29 g', ['derived', 'proposal'], 'A hole-less 29 g build exists as a resin prototype (Vaidemi). Mine has to mold it: the next pass solves the shell at 9.55 g (#15).');
  }
});

/* ============================== 13. keep the mass low, near the fingers (#95) ============================== */
S({
  id: 'mass', ch: 'shell', theme: 'paper', title: 'Keep the mass low, near the fingers', settle: 9, ideas: [95], src: ['shlZeromouse'],
  draw: t => {
    header(t, 'Keep the mass low, near the fingers');
    captions(t, [[0.6, 'The fingers push the mouse low on its sides, and its mass pushes back at its centre of mass.'], [3.6, 'When those two heights differ, every flick twists the mouse, and the hand has to hold that twist down.'], [5.8, 'Bring the mass down to the fingers and the twist goes toward zero, so the mouse feels easier to move.']]);
    const A = acc();
    { const wx = LM, wy = LAY.top, ww = 860, wh = 580;
      shlCard(t, 0.3, wx, wy, ww, wh, 'The mouse as a rigid block, in a flick', ['derived']);
      const s = 8, gx = wx + 400, gy = wy + 420, hf = 11, low = ep(t, 5.0, 6.2, E.io3), hc = lerp(16, 11.5, low);
      const fl = Math.sin(Math.max(0, t - 2) * 2.2) * ep(t, 2, 2.5), M = 0.035 * 30 * (hc - hf);
      const tilt = -fl * M * 0.012;
      part(0, 0, 1, () => solid(() => { G.beginPath(); G.rect(wx + 30, gy, ww - 60, 18); }, MT.cloth, [wx + 30, gy, ww - 60, 18], {}), { alpha: ep(t, 0.4, 0.8) });
      part(gx, gy, s, () => {
        xabout(fl >= 0 ? 30 : -30, 0, tilt);
        solid(() => pathRR(-30, -34, 60, 34, 7), { g: ['#3b3c42', '#2a2b30'], dark: 1 }, [-30, -34, 60, 34], { lw: 1.3 });
        const by = lerp(-21, -9, low);
        G.setLineDash([lw(6), lw(4)]); G.strokeStyle = 'rgba(236,235,231,0.55)'; G.lineWidth = lw(1.4);
        pathRR(-14, by - 4, 20, 8, 1); G.stroke(); pathRR(-24, -6.5, 48, 2.2, 0.6); G.stroke(); G.setLineDash([]);
        G.save(); G.translate(-4, by + 1.3); G.scale(mmpx(), mmpx()); setFont({ role: 'label', size: 19 }); G.fillStyle = 'rgba(236,235,231,0.75)'; G.textAlign = 'center'; G.fillText('BATTERY', 0, 0); G.restore();
      }, { alpha: ep(t, 0.4, 0.9) });
      const pc = [gx - 4 * s, gy - hc * s], pg = [gx + 30 * s, gy - hf * s];
      arrow(pg[0] + 110, pg[1], pg[0] + 6, pg[1], { color: C.ink, w: 3.5, hs: 14, alpha: ep(t, 1.4, 1.8) });
      text('Fingers push here', wx + ww - 26, pg[1] - 30, { role: 'label', size: 21, color: C.ink, align: 'right', maxW: 150, lh: 1.25, alpha: ep(t, 1.6, 2.0) });
      heroMark(pc[0], pc[1], 12, ep(t, 1.0, 1.4));
      line(pc[0], pc[1] - 14, pc[0], gy - 34 * s - 18, { color: YEL, w: 2, alpha: ep(t, 1.2, 1.6) });
      text('Centre of mass', pc[0], gy - 34 * s - 28, { role: 'label', size: 21, color: C.ink, align: 'center', alpha: ep(t, 1.2, 1.6) });
      line(wx + 40, pg[1], gx + 34 * s, pg[1], { color: C.faint, w: 1.2, dash: [4, 4], alpha: ep(t, 1.4, 1.8) });
      dim(t, 2.0, [wx + 64, gy], [wx + 64, gy - hf * s], hf + ' mm', -22);
      text('Rocking exaggerated. No one publishes a centre of mass.', wx + 26, wy + wh - 22, { role: 'small', size: 25, color: C.faint, alpha: ep(t, 2.4, 2.8), maxW: ww - 52 });
    }
    { const rx = 1000, wy = LAY.top, rw = RM - rx, wh = 580, hy = shlCard(t, 0.5, rx, wy, rw, wh, 'Tipping moment in a fast flick', ['derived']);
      const low = ep(t, 5.0, 6.2, E.io3), hc = lerp(16, 11.5, low);
      rich([{ s: 'M = m · a · (h − h_f)', font: 'mono', size: 26, weight: 700, color: C.ink }], rx + 26, hy + 14, { alpha: ep(t, 1.0, 1.4) });
      text('Mass 35 g, times 30 m/s² of flick, times the height of the centre of mass above the fingers.', rx + 26, hy + 52, { role: 'small', size: 25, color: C.mute, maxW: rw - 52, lh: 1.3, alpha: ep(t, 1.2, 1.6) });
      const m = axes(t, { x: rx + 116, y: hy + 150, w: rw - 170, h: 250, xr: [11, 18], yr: [0, 8], xticks: [11, 12, 13, 14, 15, 16, 17, 18], yticks: [0, 2, 4, 6, 8], xfmt: v => String(v), yfmt: v => String(v), t0: 1.0 });
      text('Height of the centre of mass, {mm}', rx + rw - 54, hy + 466, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ep(t, 1.0, 1.4) });
      text('{mN·m}', rx + 26, hy + 132, { role: 'label', size: 19, color: C.mute, alpha: ep(t, 1.0, 1.4) });
      const Mh = h => 0.035 * 30 * (h - 11);
      series(m, [[11, 0], [18, Mh(18)]], { color: C.ink2, w: 3, p: ep(t, 1.6, 2.6, E.lin) });
      heroMark(m.X(hc), m.Y(Mh(hc)), 11, ep(t, 2.4, 2.8));
      rich([{ s: 'Centre at ' + hc.toFixed(1) + ' mm', role: 'label', size: 19, color: C.mute }, { s: Mh(hc).toFixed(1) + ' mN·m', font: 'mono', size: 26, weight: 800, color: C.ink, gap: 16 }], rx + rw - 54, hy + 132, { align: 'right', alpha: ep(t, 2.4, 2.8) });
    }
    gloss(t, 3.0, 'Tipping moment', 'The twist when you push at one height and the mass resists at another: in a flick the front lifts.');
    featureCard(t, 4.2, 'Mass low, near the fingers', ['derived', 'proposal'], 'The Zeromouse V35 kit moved its battery to cut this arm. I\'ll publish the centre of mass height and the yaw inertia (#95).');
  }
});

/* ============================== 14. fix the grind instead of greasing it (#96, #97) ============================== */
function rimMM(o = {}) {
  const pad = o.pad || 0, buzz = o.buzz || 0, out = {}, slide = o.slide || 0;
  const jit = Math.sin(o.t * 90) * 0.06 * buzz;
  /* top shell wall coming down, with a groove the rim slides into */
  solid(() => { G.beginPath(); G.moveTo(-1.4, -9); G.lineTo(1.4, -9); G.lineTo(1.4, -1.0); G.lineTo(4.2, -1.0); G.lineTo(4.2, 1.2); G.lineTo(-1.4, 1.2); G.closePath(); }, MT.shell, [-1.4, -9, 5.6, 10.2], { hatch: true });
  /* the bottom rim, a separate part, slid in from the side (#97) */
  xsave(); xmove(jit + slide * 6, 0);
  solid(() => { G.beginPath(); G.moveTo(1.9, -0.6 + (pad ? 0.35 : 0)); G.lineTo(9, -0.6 + (pad ? 0.35 : 0)); G.lineTo(9, 2.6); G.lineTo(-1.4, 2.6); G.lineTo(-1.4, 1.5); G.lineTo(1.9, 1.5); G.closePath(); }, MT.black, [-1.4, -0.6, 10.4, 3.2], { hatch: { dir: -1 } });
  xrest();
  if (pad > 0) { xsave(); ga(pad); solid(() => { G.beginPath(); G.rect(1.9, -1.0, 2.3, 0.35); }, MT.foam, [1.9, -1.0, 2.3, 0.35], { lw: 0.8 }); const r = rng(3); G.strokeStyle = 'rgba(255,255,255,0.25)'; G.lineWidth = lw(0.8); for (let i = 0; i < 14; i++) { G.beginPath(); G.arc(2.0 + r() * 2.1, -0.82 + r() * 0.15, 0.05, 0, TAU); G.stroke(); } xrest(); }
  if (buzz > 0) { xsave(); ga(buzz); for (let k = 0; k < 3; k++) { const ph = (o.t * 2.4 + k / 3) % 1; G.beginPath(); G.arc(3.0, -0.8, 0.6 + ph * 2.6, -Math.PI * 0.95, -Math.PI * 0.05); G.strokeStyle = rgba(C.red, (1 - ph) * 0.8); G.lineWidth = lw(2); G.stroke(); } xrest(); }
  out.contact = SP(3.0, -0.8); out.rim = SP(7, 1.2); out.shell = SP(0, -6);
  return out;
}
S({
  id: 'grind', ch: 'shell', theme: 'night', title: 'Fix the grind instead of greasing it', settle: 9, ideas: [97, 96], src: ['poron4701', 'shlDoc'],
  draw: t => {
    header(t, 'Fix the grind instead of greasing it');
    captions(t, [[0.6, 'A separate bottom rim is easier to service, and every place two hard parts touch can grind.'], [3.2, 'Newer ULX batches are greased with Krytox. Grease quiets the rub for a while; the contact stays, so the noise comes back.'], [6.0, 'A thin Poron pad at the contact stops the parts rubbing at all, for about half a gram.']]);
    const wx = LM, wy = LAY.top, ww = RM - LM, wh = 580;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const cases = [[wx + 300, 'Plastic on plastic', 'The rim rubs the shell and squeaks', 1, 0, 'stick'], [wx + 870, 'Krytox 205 in the groove', 'Quiet until it wears or collects dust', 0.25, 0, 'wear'], [wx + 1440, 'A thin Poron pad at the contact', 'A soft stop: nothing rubs, about 0.5 g', 0, 1, 'none']];
    const per = 2.6, sq = u => { const c = ((u % per) + per) % per / per; return c < 0.14 ? E.io3(c / 0.14) : c < 0.5 ? 1 : c < 0.64 ? 1 - E.io3((c - 0.5) / 0.14) : 0; };
    cases.forEach(([cx, l1, l2, buzz, pad, mode], i) => {
      const t0 = 0.6 + i * 0.5, k = ep(t, t0, t0 + 0.5), load = t > t0 + 1.0 ? sq(t - t0 - 1.0) : 0;
      const wearUp = mode === 'wear' ? 0.25 + 0.75 * clamp(((t - t0 - 1.0) % 10.4) / 10.4) : 1;
      const b2 = buzz * wearUp * load, s = 28, ox = cx - 150, oy = wy + 330, slide = 1 - ep(t, t0 + 0.2, t0 + 1.0, E.out3);
      if (mode === 'none') shlChip(cx, wy + 56, l1, k, 'center'); else text(l1, cx, wy + 56, { role: 'label', size: 21, color: mode === 'stick' ? C.red : C.ink2, align: 'center', t, t0, cps: 60 });
      part(ox, oy - load * 0.12 * s, s, () => rimMM({ t, buzz: b2, pad: pad * (1 - 0.35 * load), slide }), { alpha: k });
      const ax = ox + 6.6 * s, ay = oy - 0.6 * s - 8;
      arrow(ax, ay - 74 - 10 * load, ax, ay - 10 * load, { color: C.ink2, w: 3, hs: 12, alpha: k * (0.35 + 0.65 * load) });
      text('Your grip', ax + 12, ay - 66, { role: 'label', size: 19, color: C.mute, alpha: k });
      const mx = cx - 160, my = wy + 416, mw = 320, mh = 52;
      rr(mx, my, mw, mh, 6, inkA(0.04), inkA(0.14), 1, k);
      text('Noise', mx - 10, my + mh / 2 + 7, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: k });
      const pts = [];
      for (let j = 0; j <= 160; j++) {
        const u = t - t0 - 1.0 - (160 - j) * 0.012, L = u > 0 ? sq(u) : 0, amp = mode === 'stick' ? L : mode === 'wear' ? L * (0.25 + 0.75 * clamp(((u % 10.4) + 10.4) % 10.4 / 10.4)) * 0.8 : 0;
        const saw = ((u * 23) % 1) - 0.5, v = amp * (saw * 0.9 + 0.25 * Math.sin(u * 151)) + (mode === 'none' ? 0.03 * Math.sin(u * 40) : 0);
        pts.push([mx + 8 + (mw - 16) * j / 160, my + mh / 2 - v * (mh * 0.8)]);
      }
      poly(pts, { color: mode === 'none' ? YEL : mode === 'wear' ? C.orange : C.red, w: 1.8, alpha: k });
      if (mode === 'wear') text('Louder as it wears', mx + mw, my - 10, { role: 'label', size: 19, color: C.orange, align: 'right', alpha: k * ep(t, t0 + 3, t0 + 3.4) });
      text(l2, cx, wy + 516, { role: 'small', size: 25, color: C.mute, align: 'center', t, t0: t0 + 0.4, cps: 90, maxW: 460 });
    });
    text('The rim slides into the top shell (#97). Noise traces are an illustration, not a recording.', wx + 26, wy + wh - 22, { role: 'small', size: 25, color: C.faint, alpha: ep(t, 2.4, 2.8) });
    gloss(t, 2.6, 'Poron', 'A microcellular urethane foam for gaskets, a third as dense as the shell. A thin layer stops hard parts rubbing.');
    featureCard(t, 3.6, 'A slide-in rim with a pad', ['proposal'], 'Krytox only hides the rub, per Brock and Josh\'s thread (#96). A foam pad removes it, with the rim slid in (#97).');
  }
});
