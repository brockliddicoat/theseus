/* ============================== shell and structure ==============================
   What the shell is made of, how thin a mold can make it, the pick most mice force (strength or weight) and the turn
   (where the material is, not how much), stress hotspots and the grams that work, the lattice inside the wall
   (triangles, statically determinate, filleted), fewer parts, a solid skin over the encoder, and where its grams go.
   Ideas #5 6 15 26 31 53 55 57 58 75 93 94 95 96 97 (and #98 with the solid shell). The idea sheets for #6 #26 #58 #31
   #93 #55 are in 12-20-shell.js. The running meter (10-d-0-meter.js) starts on shlShell3d: a plain wall = 100 %.
   3D: the 'lattice' scene (3d/lattice) for the cutaway, the rib growth, the stress view, triangles against hexagons
   and the filleted node; the 'shell' scene for the exploded parts. Every FE number from it is "derived, this model",
   read from the asset's own manifest (3d/lattice/assets/lattice.json, fe.summary). 2D models use 07-sim.js. */

Object.assign(SRC, {
  shlRtingsSoraUlx: { t: 'RTINGS, Ninjutso Sora V2 vs Finalmouse ULX Pro Series: "The Finalmouse flexes and creaks with pressure, while the Ninjutso feels solid."', u: 'https://www.rtings.com/mouse/tools/compare/ninjutso-sora-v2-vs-finalmouse-ulx-pro-series/50319/58188' },
  shlSoraV3: { t: 'Ninjutso, Sora V3 product page: "an ultra-thin shell that\'s supported by the endoskeleton supporting structure", "2x more rigid structure-wise", 40 g (maker claims)', u: 'https://ninjutso.com/products/sora-v3-wireless-ultralight-gaming-mouse' },
  shlB2gSlx: { t: 'Back2Gaming, Finalmouse Starlight X review: "rigid unibody main shell made of three components instead of the previous four-part assembly"; "carbon fiber super composite with a density below 0.9 g/cm³"; openings "limited to a few cutouts flanking the scroll wheel and the inner edges of the main buttons"; honeycomb "confined to the underside"; 15 titanium screws of about 0.02 g; 41.58 g measured', u: 'https://www.back2gaming.com/review/finalmouse-starlight-x-nightfall-wireless-mouse/' },
  shlLattice: { t: 'This deck, the Theseus lattice study (3d/lattice, assets/lattice.json): linear stiffened-shell finite elements (CST and DKT shells, eccentric rib beams), 9,304 nodes, 18,047 shells, Pyrofil PP-C-20A modulus 13.5 GPa; 10 N on the crown over a 10 mm pad, the same 7 mm right and 6 mm forward, and 10 N inward on each side at the grip. Body 15.18 g: wall 11.39 g, ribs 3.79 g; hexagons width-scaled 0.881 to the same rib volume; the plain wall is the same 15.18 g with no ribs. Crown: triangles 499 N/mm, hexagons 411, plain wall 247, wall alone 125; P99 stress: plain wall 3.84 MPa, triangle ribs 3.39, hexagon ribs 4.08', n: 'derived, this model' },
  shlRtingsUlxcGpx2: { t: 'RTINGS, Logitech G Pro X Superlight 2 vs Finalmouse UltralightX Competition: on the Finalmouse "we experienced noticeable creaking, popping, and flexibility on our unit"; the Logitech\'s "build quality is also better and much more consistent"', u: 'https://www.rtings.com/mouse/tools/compare/finalmouse-ultralightx-competition-logitech-g-pro-x-superlight-2/78570/42437' },
  shlRazerWheel: { t: 'Razer, scroll wheel technologies: the Razer Optical Scroll Wheel is "3.3 times more reliable than traditional mechanical designs" and "bypasses the issue of mechanical wear and tear" (maker claim; no test method given)', u: 'https://www.razer.com/mena-en/technology/razer-scroll-wheels' },
  shlIgorWheel: { t: 'igor\'sLAB (Igor Wallossek), Razer Basilisk V3 Pro teardown: the scroll-wheel jitter came from hair and debris in the wheel, not a failed part; "dirt or foreign objects in the sensor area"', u: 'https://www.igorslab.de/en/from-scroll-wheel-jitter-missing-light-and-nasty-hair-splitting-a-razer-basilisk-pro-v3-caught-between-frisoer-and-planned-obsolescence/' },
  shlMaxwell: { t: 'Ashby 2006, The properties of foams and lattices, Phil. Trans. R. Soc. A 364, section 4: Maxwell\'s criterion for a pin-jointed 2D frame, M = b − 2j + 3 (b struts, j joints); M < 0 is a mechanism, M = 0 statically and kinematically determinate; stretch-dominated lattices stiffen with relative density, bending-dominated ones far faster than that', u: 'https://eclass.aegean.gr/modules/document/file.php/511165/projects/foams_lattices.pdf' },
  shlHot2d: { t: 'This deck: 2D frames solved in the page (07-sim.js), Pyrofil PP-C-20A (13.5 GPa, 1.01 g/cm³), a 60 mm span on a pin and a roller, 10 N on the middle of the top; triangles of 12 mm sides, 1.2 mm thick; the solid plane is a beam of the same span, depth and grams; stress through the depth from beam theory', n: 'derived, this model' },
  shlLat2d: { t: 'This deck: 2D frames solved in the page (07-sim.js), Pyrofil PP-C-20A, lattices of 12.5 mm cells with 2.0 mm tall ribs, triangles and hexagons at the same mass; bottom edge clamped, 10 N spread over the top; pin-jointed cells checked with the same solver (a hexagon comes back as a mechanism)', n: 'derived, this model' },
  shlPyrofil: { t: 'PlaBase (Mitsubishi Chemical), Pyrofil PP-C-20A datasheet: 1.01 g/cm³; flexural modulus 13,500 MPa; tensile breaking stress 120 MPa (JIS K7162), bending strength 207 MPa (JIS K7171), strain at break 3%; Charpy 6 kJ/m² notched, 36 unnotched; MVR 13 cm³/10 min', u: 'https://en.plabase.com/plastic/items/6577ab7a86df1821ce54dafc' },
  shlKyron: { t: 'Mitsubishi Chemical America: KyronMAX compounds with "tensile strengths that exceed 60,000 psi (414 MPa)" (maker claim)', u: 'https://us.mitsubishi-chemical.com/injection-moldable-material-exceeds-60000-psi-tensile-strength/' },
  shlFr4: { t: 'The Gund Company, NEMA FR4: 1.85 g/cm³, tensile 430 MPa lengthwise, flexural modulus 20 GPa lengthwise and 18 GPa crosswise', u: 'https://thegundcompany.com/wp-content/uploads/2024/03/NEMA-FR4-Glass-Epoxy-Laminate-by-The-Gund-Co.pdf' },
  shlEnvalior: { t: 'Envalior (resin maker), radii and chamfers: inside radius 25 to 60% of the nominal wall, the upper end for load-bearing parts, at least 0.5 mm; stress concentration about 1.5 at r = 0.5 t, about 3 at r = 0.1 t', u: 'https://www.envalior.com/en-us/radii-and-chamfers' },
  shlYizumi: { t: 'Yizumi (machine maker), thixomolding vs die casting: minimum wall 0.3 to 0.5 mm for thixomolding, over 1.5 mm for die casting (vendor claim)', u: 'https://www.yizumi.com/en/news/product/IMM/thixomolding-vs-die-casting' },
  shlMylar: { t: 'TAP Plastics, Mylar technical data: 1.39 g/cm³, 21,000 in²/lb, properties for 92-gauge (23 µm) general-use film', u: 'https://www.tapplastics.com/uploads/pdf/Tech_Data-_Mylar.pdf' },
  shlZkM1k: { t: 'Zaunkoenig, "M1K weight in review", 31 Aug 2020: carbon fibre shell 7.5 g; 3D-printed bottom shell 5.6 to 5.9 g regular, 4.0 to 4.2 g lightweight (maker figures, first 333 units)', u: 'https://zaunkoenig.co/blog/m1k-weight-in-review' },
  shlNimbus: { t: 'Notebookcheck on Vaidemi\'s DIY Nimbus: 29 g with skates and paint, a hole-less SLA resin shell over an internal skeleton, 30 kg load (community build)', u: 'https://www.notebookcheck.net/YouTuber-embarrasses-big-gaming-mouse-brands-with-29-g-ultralight-mouse-with-no-holes.1011756.0.html' },
  shlZeromouse: { t: 'Notebookcheck on the Zeromouse V35 kit: the battery moved to reduce the moment arm (community build)', u: 'https://www.notebookcheck.net/YouTuber-builds-16-g-gaming-mouse-and-you-can-buy-one-sort-of.876113.0.html' },
  shlFmSupport: { t: 'Finalmouse support staff, to Brock Liddicoat: the scroll encoder is the number one failure point in a mouse', u: '', n: 'Brock, 2026-11-04 (F12.13): "cite the finalmouse support staff"' },
  shlDoc: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse": ideas, reasoning and comment threads (Lamzu Maya front struts, G-Wolves HTS Plus bottom sticker, Krytox 205 on newer ULX batches, Poron pads, a mouse that works with no bottom plate)', u: '', n: 'research/brock-doc-in-pursuit.txt and brock-doc-comments.txt' }
});

/* ---------- helpers ---------- */
const SHL = { R: 69.83, C0: [0, 19.075, -0.04], primed: new Set(), no3d: typeof location !== 'undefined' && /[?&]no3d=1/.test(location.search) };
const SHL_DEF = { lattice: { cut: 0, build: 1, stress: 0, stressCase: 'press', compare: 'tri', filletZoom: 0 }, shell: { explode: 0, xray: 0, scroll: 0 } };
/** view3D with every state key given (a key left out would keep the last slide's value) and one unseen first render:
   that render frames the lattice as a single shell (so 'both' never changes the framing) and switches on three.js's
   local clipping before the cut is drawn. o.alpha fades it. */
function shl3D(key, t, x, y, w, h, st, o = {}) {
  const s = Object.assign({}, SHL_DEF[key] || {}, st);
  if (SHL.no3d) { v3Wait(x, y, w, h, key, t); return false; }
  const theme = o.theme || (TH ? 'paper' : 'night'), id = key + '|' + theme;
  if (!V2D.on && !SHL.primed.has(id) && typeof R3D !== 'undefined' && R3D.has(key) && R3D.ready(key, theme)) {
    const k = (APP.scale || 1) * (APP.dpr || 1) * (o.res || 1);
    try { R3D.render(key, t, Object.assign({}, s, key === 'lattice' ? { compare: 'tri' } : {}), Math.max(64, Math.round(w * k)), Math.max(36, Math.round(h * k)), theme); } catch (e) { }
    SHL.primed.add(id);
  }
  return view3D(key, t, x, y, w, h, s, o);
}
/** where a lattice point (mm) lands on the stage, by the same camera rule as 3d/integration (framed once on the single shell) */
function shlProj(st, box, p) {
  if (V2D.on) { const P2 = lattice2DProj(st, box); if (P2) return P2(p); }
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
function shlChip(x, y, s, a = 1, align) { return rich([{ s, role: 'label', size: 21, color: C.onHero, chip: C.heroChip }], x, y, { alpha: a, align }); }
/** a figure label: mono number, then a sentence */
function shlFig(t, t0, x, y, n, s, o = {}) { const a = ep(t, t0, t0 + 0.4); rich([{ s: 'Fig. ' + n, role: 'label', size: 21, color: o.color || C.mute }, { s, role: 'small', size: 25, weight: 560, color: C.faint, sentence: true, gap: 16 }], x, y, { alpha: a, align: o.align }); }
/** a value bar on a track: o = { x, y (centre), w, max, v, lo, hi, col, h, a, k, dash, edge } → returns the x of its end */
function shlBar(o) {
  const h = o.h || 14, a = o.a == null ? 1 : o.a, k = o.k == null ? 1 : o.k, X = v => o.x + o.w * clamp(v / o.max);
  if (o.track !== false) rr(o.x, o.y - h / 2, o.w, h, h / 2, C.track, null, 0, a);
  const lo = o.lo != null ? o.lo : o.v, hi = o.hi != null ? o.hi : o.v, xe = X(hi);
  if (o.dash) { G.save(); G.globalAlpha = a; G.setLineDash([6, 5]); G.strokeStyle = o.col; G.lineWidth = 2; rrPath(o.x, o.y - h / 2, Math.max(h, (X(hi) - o.x) * k), h, h / 2); G.stroke(); G.setLineDash([]); G.restore(); }
  else {
    if (hi !== lo) rr(o.x, o.y - h / 2, Math.max(h, (X(hi) - o.x) * k), h, h / 2, rgba(o.col, 0.38), null, 0, a);
    const bl = Math.max(h, (X(lo) - o.x) * k);
    /* flat: gradients live only in the type (F8.1), and nothing of Theseus's is outlined (F9.10) */
    rr(o.x, o.y - h / 2, bl, h, h / 2, o.col, null, 0, a);
  }
  return o.x + (xe - o.x) * k;
}
/** the stress scale (the deck's heat scale, as the 3D lattice draws it: grey, amber, orange, red at the peak), as a
   key beside a drawing; max = the stress at the red end, or a word ('Peak') */
function shlRamp(t, t0, x, y, w, max, title) {
  const a = ep(t, t0, t0 + 0.4); if (a <= 0.003) return;
  const g = G.createLinearGradient(x, 0, x + w, 0); for (let i = 0; i <= 6; i++) g.addColorStop(i / 6, heatCol(i / 6));
  G.save(); G.globalAlpha = a; G.fillStyle = g; rrPath(x, y, w, 10, 5); G.fill(); G.strokeStyle = inkA(0.25); G.lineWidth = 1; G.stroke(); G.restore();
  text(title, x, y - 14, { role: 'label', size: 19, color: C.mute, alpha: a });
  text('0', x, y + 34, { role: 'tick', size: 19, color: C.mute, alpha: a });
  text(typeof max === 'number' ? max + ' MPa' : max, x + w, y + 34, { role: 'tick', size: 19, color: typeof max === 'number' ? C.mute : C.bad, align: 'right', alpha: a });
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
  { name: 'KyronMAX, 30% carbon', sub: 'ULX-class, 21–41 GPa', E: [21, 41], rho: [1.33, 1.28], dash: true, star: true },
  { name: 'Pyrofil PP-C-20A', sub: 'Theseus, 13.5 GPa', E: [13.5], rho: [1.01], hero: true },
  { name: 'Magnesium AZ91D', sub: 'Metal shells, 46 GPa', E: [46], rho: [1.81, 1.7], ref: true },
  { name: 'PPS, 30% carbon', sub: 'Pro triggers, #6, 17 GPa', E: [17], rho: [1.4] },
  { name: 'FR4 board core', sub: 'The PCB, #94, 18–20 GPa', E: [18, 20], rho: [1.85] },
  { name: 'ABS', sub: 'Most mice, 2.55 GPa', E: [2.55], rho: [1.05] },
  { name: 'SLX composite', sub: 'Below 0.9 g/cm³, claimed', none: true }
];
const shlIdx = m => { const v = []; for (const e of m.E) for (const r of m.rho) v.push(Math.cbrt(e) / r); return [Math.min(...v), Math.max(...v)]; };
S({
  id: 'materials', ch: 'shell', theme: 'paper', title: 'Specific stiffness: carbon PP leads', settle: 9, ideas: [5, 6, 94],
  src: ['shlPyrofil', 'denkaAbs', 'shlKyron', 'kyron', 'az91d', 'shlFr4', 'cfpps', 'shlB2gSlx', 'ashby06'],
  draw: t => {
    header(t, 'Specific stiffness: carbon PP leads');
    captions(t, [[0.6, 'A shell is a thin curved panel, so the fair test is stiffness at equal mass, not stiffness alone.'], [4.6, 'By that measure 20% carbon PP leads every material with published numbers, and its modulus is 5.3× ABS\'s.']]);
    /* left: the panel index, every bar computed from its datasheet inputs */
    { const x = LM, y = 280, w = 1080, h = 640, a0 = tileA(t, 0.3, 0);
      demoWindow(x, y, w, h, a0);
      text('Panel stiffness at equal mass, {E^(1/3)/ρ}', x + 32, y + 52, { role: 'label', size: 21, color: C.mute, alpha: a0 });
      { const p2 = pillW('derived'), p1 = pillW('datasheet'); pill(x + w - 32 - p2, y + 52, 'derived', a0); pill(x + w - 32 - p2 - 28 - p1, y + 52, 'datasheet', a0); }
      const k0 = ep(t, 0.9, 1.3);
      text('E: flexural modulus, GPa. ρ: density, g/cm³. Longer is stiffer per gram.', x + 32, y + 96, { role: 'small', size: 24, weight: 560, color: C.mute, alpha: k0 });
      const nx = x + 32, bx = x + 460, bw = w - 460 - 170, y0 = y + 190, rh = 60, max = 2.8;
      for (const v of [0, 1, 2]) { const gx = bx + bw * v / max; line(gx, y0 - 40, gx, y0 + rh * SHL_MATS.length - 36, { color: C.hair, w: 1.2, alpha: k0 }); text(String(v), gx, y0 - 48, { role: 'tick', size: 19, color: C.faint, align: 'center', alpha: k0 }); }
      SHL_MATS.forEach((m, i) => {
        const yy = y0 + i * rh, t0 = 1.2 + i * 0.14, a = ep(t, t0, t0 + 0.4), k = ep(t, t0 + 0.1, t0 + 0.9, E.snap);
        text(m.name, nx, yy - 2, { role: 'small', size: 25, weight: m.hero ? 800 : 650, color: m.hero ? C.heroText : C.ink, alpha: a });
        text(m.sub, nx, yy + 22, { role: 'label', size: 19, color: C.mute, alpha: a });
        if (m.none) { text('No modulus published', bx, yy, { role: 'label', size: 19, color: C.faint, alpha: a }); return; }
        const [lo, hi] = shlIdx(m), col = m.hero ? C.hero : m.ref ? C.second : C.comp;
        const xe = shlBar({ x: bx, y: yy - 8, w: bw, max, lo, hi, col, h: 16, a, k, dash: m.dash });
        const lab = lo.toFixed(2) === hi.toFixed(2) ? hi.toFixed(2) : lo.toFixed(2) + '–' + hi.toFixed(2) + (m.star ? '*' : '');
        text(lab, xe + 12, yy, { role: 'num', size: 24, weight: m.hero ? 800 : 650, color: m.hero ? C.heroText : C.ink, alpha: clamp(k * 1.4 - 0.3) });
      });
      text('* KyronMAX density unpublished: 1.28 to 1.33 g/cm³ assumed.', x + 32, y + h - 32, { role: 'small', size: 22, weight: 560, color: C.faint, alpha: ep(t, 2.6, 3.0) });
    }
    /* right: the modulus against ABS, the strength, and what the index means */
    const rx = LM + 1120, rw = RM - rx;
    statTile(t, 1.6, [rx, 280, rw, 240], { value: '5.3', unit: '×', label: 'the modulus of ABS: 13.5 vs 2.55 GPa', ev: 'datasheet', hero: true, align: 'left' });
    statTile(t, 2.4, [rx, 560, rw, 200], { value: String(SHL_STR.ft), unit: 'MPa', label: 'tensile strength; ' + SHL_STR.fb + ' MPa in bending', ev: 'datasheet', by: 'Pyrofil', quiet: true, align: 'left' });
    glossBox(t, 3.4, rx, 800, rw, '{E^(1/3)/ρ}', 'Ashby\'s index for a light, stiff panel: at equal mass a lighter material is thicker, and a panel\'s stiffness grows with thickness cubed.', { size: 22 });
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
  id: 'thinwall', ch: 'shell', theme: 'night', title: 'Minimum wall thickness', settle: 10, ideas: [5, 'wall'],
  src: ['protoWall', 'thixoDN', 'shlYizumi', 'beall102', 'shlPyrofil', 'az91d', 'shlB2gSlx'],
  draw: t => {
    header(t, 'Minimum wall thickness');
    captions(t, [[0.6, 'A mold can only fill a wall so thin, and the thinner the wall, the harder its size is to hold.'], [3.9, 'At the same weight a denser material gets a thinner wall: magnesium\'s is 0.56 as thick as carbon PP\'s.'], [7.0, 'So the lighter resin wins even with less strength per gram: its wall molds, holds its size and bends less.']]);
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
        const k = ep(t, 1.2 + j * 0.4, 1.8 + j * 0.4), hh = th * S2, ok = th >= M.floor, col = ok ? (TH ? C.heroText : C.hero) : C.red;
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
        const cy = hy + 82 + i * 66, a = ep(t, 1.8 + i * 0.3, 2.2 + i * 0.3), col = j ? (TH ? C.ink : C.ink2) : C.hero;
        text(nm, x + 26, cy + 8, { role: 'label', size: 19, color: j ? C.ink2 : (TH ? C.heroText : C.hero), alpha: a });
        SHL_TOLDOTS[j].forEach((p, q) => { const kk = ep(t, 2.0 + i * 0.3 + p.j * 0.8, 2.3 + i * 0.3 + p.j * 0.8, E.out3); if (kk <= 0) return; circle(X(clamp(p.d, -0.34, 0.34)), cy + (p.j - 0.5) * 34 - (1 - kk) * 14, 3, { fill: col, alpha: kk * 0.8 }); });
        text(rng2, x + w - 26, cy + 8, { font: 'mono', size: 24, weight: 700, color: j ? C.ink : (TH ? C.heroText : C.hero), align: 'right', alpha: ep(t, 2.6 + i * 0.3, 3.0 + i * 0.3) });
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
        const e2 = shlBar({ x: bx, y: yy + 44, w: bw, max: 140, lo: pp[0], hi: pp[1], col: C.hero, h: 10, a, k, edge: TH ? '#111111' : null });
        text('PP needs ' + pp[0] + '–' + pp[1], e2 + 12, yy + 51, { font: 'mono', size: 21, weight: 700, color: TH ? C.heroText : C.hero, alpha: clamp(k * 1.4 - 0.3) });
      });
      text('PP needs 50 to 69 MPa to tie: 44% less per gram.', x + 26, y + h - 22, { role: 'small', size: 25, weight: 600, color: C.ink, t, t0: 4.8, cps: 110 });
    }
    gloss(t, 2.4, 'Minimum wall', 'The thinnest section a resin fills well. Below it the melt freezes early, and the extra pressure leaves stress that warps the part.');
    featureCard(t, 5.6, 'A lighter resin, a thicker wall', ['datasheet', 'derived'], 'At the same grams carbon PP gets 1.8× magnesium\'s wall: above its floor, half the scatter, stiffer in bending (#5).');
  }
});

/* ============================== the models behind the structure slides ==============================
   1. The 3D study's numbers (3d/lattice/assets/lattice.json, fe.summary and masses): 10 N load cases on the study body.
   2. The plain wall's law, through its two solved points (the wall alone, 11.39 g; the same wall thickened to the body's
      15.18 g): crown stiffness grows with mass^n, n ≈ 2.37. It draws the trade-off curve.
   3. 2D frames (07-sim.js) for the principle: a 60 mm span pressed in the middle, the same grams as a solid plane, as
      triangles of one size, or as triangles sized to their force; and lattices of 12.5 mm cells, triangles and hexagons
      at the same mass, pinned and rigid. */
const SHL_FE = {
  tri: { press: 499.3, press_off: 329.2, squeeze: 645.7, defl: 20.0, rib: 4.33, ribP99: 3.39, wallP99: 1.98 },
  hex: { press: 411.4, press_off: 276.0, squeeze: 540.7, defl: 24.3, rib: 7.03, ribP99: 4.08, wallP99: 2.25 },
  thick: { press: 247.2, press_off: 149.9, squeeze: 474.8, defl: 40.5, wallP99: 3.84 },
  none: { press: 125.1, press_off: 74.0, squeeze: 245.5, defl: 79.9, wallP99: 6.08 },
  g: { body: 15.18, wall: 11.39, ribs: 3.79, triggers: 3.88 }
};
SHL_FE.n = Math.log(SHL_FE.thick.press / SHL_FE.none.press) / Math.log(SHL_FE.g.body / SHL_FE.g.wall);
/** a plain wall of this shape at m grams: crown stiffness (N/mm) and flex at 10 N (µm) */
const shlPlainK = m => SHL_FE.thick.press * Math.pow(m / SHL_FE.g.body, SHL_FE.n);
const shlPlainFlex = m => 10000 / shlPlainK(m);
/** the plain wall's mass that would match the lattice's crown stiffness (extrapolated along the same law) */
SHL_FE.match = SHL_FE.g.body * Math.pow(SHL_FE.tri.press / SHL_FE.thick.press, 1 / SHL_FE.n);

/* the meter's steps from this file; the hexagons are a comparison against the same plain wall, not a step */
shellStep({ key: 'lattice', slide: 'shlShell3d', label: 'Triangle lattice', flex: SHL_FE.thick.press / SHL_FE.tri.press, stress: SHL_FE.tri.ribP99 / SHL_FE.thick.wallP99, ev: 'derived', how: '3D shell FE, PP-C-20A, 10 N on the crown: the 15.18 g body as a plain wall, or as its 0.9 to 1.2 mm wall plus 3.79 g of triangle ribs; stress is the P99 of the most stressed part' });
const SHL_HEXGHOST = { flex: SHL_FE.thick.press / SHL_FE.hex.press, stress: SHL_FE.hex.ribP99 / SHL_FE.thick.wallP99, label: 'Hexagons, same mass' };

/* ---------- 2D: the same grams three ways across a 60 mm span ---------- */
const SHL_HOT = { L: 60, a: 12, b: 1.2, P: 10, h0: 1.0 };
SHL_HOT.H = SHL_HOT.a * Math.sqrt(3) / 2;
/** equilateral triangles of side a across the span: bottom chord on a pin and a roller, 10 N down on the top's middle node.
   hs = each member's depth in the plane (mm), in the order they are added; default all h0 */
function shlTrussModel(hs) {
  const { L, a, b, H, P } = SHL_HOT, n = Math.round(L / a), M = SIM_MAT.ppcf, nodes = [], els = [];
  for (let i = 0; i <= n; i++) nodes.push([-L / 2 + i * a, 0]);
  for (let j = 0; j < n; j++) nodes.push([-L / 2 + (j + 0.5) * a, H]);
  const top = j => n + 1 + j, add = (i, j) => els.push({ i, j, w: b, h: hs ? hs[els.length] : SHL_HOT.h0, E: M.E, rho: M.rho });
  for (let i = 0; i < n; i++) add(i, i + 1);
  for (let j = 0; j < n - 1; j++) add(top(j), top(j + 1));
  for (let j = 0; j < n; j++) { add(j, top(j)); add(top(j), j + 1); }
  const mid = top(Math.floor(n / 2));
  return { nodes, els, fix: { 0: 'xy', [n]: 'y' }, loads: { [mid]: [0, -P, 0] }, mid };
}
/** the same triangles, each member's depth set by its own force (fully stressed), at the same total mass */
function shlTrussSized() {
  let hs = shlTrussModel().els.map(() => SHL_HOT.h0); const total = hs.reduce((s, v) => s + v, 0);
  for (let it = 0; it < 14; it++) {
    const r = feSolve(shlTrussModel(hs)), f = r.N.map(Math.abs), mean = f.reduce((s, v) => s + v, 0) / f.length;
    const h2 = f.map(v => Math.max(0.35 * mean, v)), sc = total / h2.reduce((s, v) => s + v, 0); hs = h2.map(v => v * sc);
  }
  return shlTrussModel(hs);
}
/** a solid plane of the same span and depth, holding the same grams: a beam of depth H, thinner out of the page */
function shlPlateModel(massG) {
  const { L, H, P } = SHL_HOT, M = SIM_MAT.ppcf, n = 60, nodes = [], els = [], w = massG / (M.rho * H * L);
  for (let i = 0; i <= n; i++) nodes.push([-L / 2 + L * i / n, H / 2]);
  for (let i = 0; i < n; i++) els.push({ i, j: i + 1, w, h: H, E: M.E, rho: M.rho });
  return { nodes, els, fix: { 0: 'xy', [n]: 'y' }, loads: { [n / 2]: [0, -P, 0] }, mid: n / 2, w };
}
/** stress samples through each member's depth and along it: [{ s (MPa, abs), g (grams) }]. sigma = N/A + M(x) y / I */
function shlSamples(r, nx = 16, ny = 16) {
  const out = [];
  r.model.els.forEach((el, e) => {
    const A = el.w * el.h, I = el.w * el.h ** 3 / 12, a = r.N[e] / A, g = r.mass[e] / (nx * ny);
    for (let i = 0; i < nx; i++) { const xi = (i + 0.5) / nx, b = el.truss ? 0 : (r.M1[e] * (1 - xi) + r.M2[e] * xi) / I; for (let j = 0; j < ny; j++) { const y = el.h * ((j + 0.5) / ny - 0.5); out.push({ s: Math.abs(a + b * y), g }); } }
  });
  return out.sort((p, q) => q.s - p.s);
}
/** the grams that work: the share of the material stressed to at least frac of this frame's own peak */
function shlWorkShare(r, frac = 0.5) { const S0 = r.samples, pk = S0[0].s; let g = 0, tot = 0; for (const p of S0) { tot += p.g; if (p.s >= frac * pk) g += p.g; } return g / tot; }
/** n cells of equal mass, most stressed first: each cell's mean stress */
function shlCellsOf(r, n = 52) {
  const S0 = r.samples, tot = S0.reduce((s, p) => s + p.g, 0), cells = new Array(n).fill(0), cg = new Array(n).fill(0); let acc0 = 0;
  for (const p of S0) { const c = Math.min(n - 1, Math.floor(acc0 / tot * n)); cells[c] += p.s * p.g; cg[c] += p.g; acc0 += p.g; }
  return cells.map((v, i) => cg[i] ? v / cg[i] : 0);
}
function shlHot() {
  if (SHL.hot) return SHL.hot;
  const uni = simSolve('shl-hot-uni', () => shlTrussModel()), sized = simSolve('shl-hot-sized', shlTrussSized);
  const mass = uni.mass.reduce((s, v) => s + v, 0), plate = simSolve('shl-hot-plate', () => shlPlateModel(mass));
  for (const r of [uni, sized, plate]) { r.samples = shlSamples(r); r.k = SHL_HOT.P / -r.d[r.model.mid * 3 + 1]; r.peak = r.samples[0].s; r.work = shlWorkShare(r, 0.5); r.cells = shlCellsOf(r); }
  /* the plane's stress falls as 1/thickness: the grams it needs to match the sized triangles' peak */
  return (SHL.hot = { uni, sized, plate, mass, match: plate.peak / sized.peak });
}
/** the solid plane drawn as a field: each cell coloured by its stress, the beam's deflection exaggerated by sc.
   P maps model mm to stage px; k = load on now; smax = the stress that reads as hot; o.crack (0..1) grows a crack */
function shlPlateField(r, P, k, sc, smax, a, o = {}) {
  if (a <= 0.003) return;
  const m = r.model, H = SHL_HOT.H, ny = o.ny || 14, ne = m.els.length;
  G.save(); G.globalAlpha = a;
  for (let e = 0; e < ne; e++) {
    const el = m.els[e], A = el.w * el.h, I = el.w * el.h ** 3 / 12, n0 = m.nodes[el.i], n1 = m.nodes[el.j];
    const v0 = r.d[el.i * 3 + 1] * sc * k, v1 = r.d[el.j * 3 + 1] * sc * k;
    for (let half = 0; half < 2; half++) {
      const xi = (half + 0.5) / 2, Mx = (r.M1[e] * (1 - xi) + r.M2[e] * xi), xa = lerp(n0[0], n1[0], half / 2), xb = lerp(n0[0], n1[0], (half + 1) / 2), va = lerp(v0, v1, half / 2), vb = lerp(v0, v1, (half + 1) / 2);
      for (let j = 0; j < ny; j++) {
        const y0 = H * j / ny, y1 = H * (j + 1) / ny, yc = (y0 + y1) / 2 - H / 2, s = Math.abs(r.N[e] / A + Mx * yc / I) * k;
        const p00 = P([xa, y0 + va]), p10 = P([xb, y0 + vb]), p11 = P([xb, y1 + vb]), p01 = P([xa, y1 + va]);
        G.fillStyle = heatCol(s / smax); G.beginPath(); G.moveTo(p00[0], p00[1]); G.lineTo(p10[0] + 0.6, p10[1]); G.lineTo(p11[0] + 0.6, p11[1] - 0.6); G.lineTo(p01[0], p01[1] - 0.6); G.closePath(); G.fill();
      }
    }
  }
  /* the outline */
  const top = [], bot = []; m.nodes.forEach((n0, i) => { const v = r.d[i * 3 + 1] * sc * k; top.push(P([n0[0], H + v])); bot.push(P([n0[0], v])); });
  G.strokeStyle = inkA(0.55); G.lineWidth = 1.5; G.beginPath(); top.concat(bot.reverse()).forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.closePath(); G.stroke();
  /* a crack from the bottom of the middle, where the tension peaks */
  if (o.crack > 0) {
    const v = r.d[m.mid * 3 + 1] * sc * k, rr0 = rng(7), pts = [P([0, v])]; let x = 0;
    const nseg = 9; for (let q = 1; q <= nseg * o.crack; q++) { x += (rr0() - 0.5) * 1.1; pts.push(P([x, v + H * 0.62 * q / nseg])); }
    G.strokeStyle = C.bad; G.lineWidth = 3; G.lineJoin = 'round'; G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.stroke();
  }
  G.restore();
}
/** a load arrow onto a stage point, and the pointer pressing it: returns nothing */
function shlPress(t, t0, p, k, o = {}) {
  const a = ep(t, t0, t0 + 0.3) * (o.alpha == null ? 1 : o.alpha); if (a <= 0.003) return;
  const len = o.len || 64, col = o.color || C.ink;
  arrow(p[0], p[1] - len - 10, p[0], p[1] - 6, { color: col, w: 3, hs: 13, alpha: a * (0.35 + 0.65 * k) });
  if (o.label) text(o.label, p[0] + 16, p[1] - len + 4, { role: 'label', size: 19, color: C.mute, alpha: a });
}

/* ---------- 2D: triangle and hexagon lattices of 12.5 mm cells, at the same mass ---------- */
const SHL_LAT = { a: 12.5, nx: 7, ny: 4, w: 2.0, t: 1.0, P: 10 };
function shlTriPanel(t) {
  const { a, nx, ny, w } = SHL_LAT, M = SIM_MAT.ppcf, h = a * Math.sqrt(3) / 2, nodes = [], idx = {}, els = [];
  for (let r = 0; r <= ny; r++) { const off = (r % 2) * a / 2, n = nx + 1 - (r % 2); for (let c = 0; c < n; c++) { idx[r + ',' + c] = nodes.length; nodes.push([off + c * a, r * h]); } }
  const add = (p, q) => { if (p != null && q != null) els.push({ i: p, j: q, w, h: t, E: M.E, rho: M.rho }); };
  for (let r = 0; r <= ny; r++) { const n = nx + 1 - (r % 2); for (let c = 0; c < n; c++) { const i = idx[r + ',' + c]; add(i, idx[r + ',' + (c + 1)]); if (r < ny) { if (r % 2 === 0) { add(i, idx[(r + 1) + ',' + c]); add(i, idx[(r + 1) + ',' + (c - 1)]); } else { add(i, idx[(r + 1) + ',' + c]); add(i, idx[(r + 1) + ',' + (c + 1)]); } } } }
  return { nodes, els };
}
/** pointy-top hexagons with walls a/√3 long, whole cells only (no wall left hanging), the same width as the triangles */
function shlHexPanel(t) {
  const { a, nx, ny, w } = SHL_LAT, M = SIM_MAT.ppcf, R = a / Math.sqrt(3), nodes = [], map = new Map(), els = [], seen = new Set();
  const nid = p => { const k = Math.round(p[0] * 1000) + ',' + Math.round(p[1] * 1000); if (!map.has(k)) { map.set(k, nodes.length); nodes.push(p); } return map.get(k); };
  for (let row = 0; row < ny; row++) for (let col = 0; col < nx - (row % 2); col++) {
    const cx = a / 2 + col * a + (row % 2 ? a / 2 : 0), cy = R + row * 1.5 * R;
    const v = [0, 1, 2, 3, 4, 5].map(k => { const an = Math.PI / 6 + k * Math.PI / 3; return nid([cx + R * Math.cos(an), cy + R * Math.sin(an)]); });
    for (let k = 0; k < 6; k++) { const p = v[k], q = v[(k + 1) % 6], key = p < q ? p + ',' + q : q + ',' + p; if (!seen.has(key)) { seen.add(key); els.push({ i: p, j: q, w, h: t, E: M.E, rho: M.rho }); } }
  }
  return { nodes, els };
}
const shlLen = m => m.els.reduce((s, el) => s + Math.hypot(m.nodes[el.j][0] - m.nodes[el.i][0], m.nodes[el.j][1] - m.nodes[el.i][1]), 0);
/** clamp the bottom row, load the top row: 'press' (10 N spread down), 'point' (10 N on the middle top node), 'shear' (sideways) */
function shlLatSetup(m, mode) {
  const ys = m.nodes.map(p => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys), xs = m.nodes.map(p => p[0]), xc = (Math.min(...xs) + Math.max(...xs)) / 2, P = SHL_LAT.P;
  const fix = {}, loads = {}, top = [];
  m.nodes.forEach((p, i) => { if (p[1] < y0 + 1e-6) fix[i] = 'xyr'; else if (p[1] > y1 - 1e-6) top.push(i); });
  if (mode === 'point') { const c = top.reduce((b, i) => Math.abs(m.nodes[i][0] - xc) < Math.abs(m.nodes[b][0] - xc) ? i : b, top[0]); loads[c] = [0, -P, 0]; m.meas = [c]; m.dir = 1; }
  else if (mode === 'shear') { top.forEach(i => { loads[i] = [P / top.length, 0, 0]; }); m.meas = top; m.dir = 0; }
  else { top.forEach(i => { loads[i] = [0, -P / top.length, 0]; }); m.meas = top; m.dir = 1; }
  m.fix = fix; m.loads = loads; m.top = top; m.y1 = y1; return m;
}
const shlLatD = r => Math.abs(r.model.meas.reduce((s, i) => s + r.d[i * 3 + r.model.dir], 0) / r.model.meas.length);
/** the share of the strain energy that is bending (the rest is stretching): U_axial = N² L / (2 E A) */
function shlBendShare(r) { let ua = 0, ut = 0; r.model.els.forEach((el, e) => { ua += r.N[e] ** 2 * r.L[e] / (2 * el.E * el.w * el.h); ut += r.U[e]; }); return ut > 0 ? clamp(1 - ua / ut) : 0; }
function shlLat() {
  if (SHL.lat) return SHL.lat;
  const lt = shlLen(shlTriPanel(1)), lh = shlLen(shlHexPanel(1)), hOf = t => t * lt / lh;
  const solve = (kind, t, mode) => simSolve('shl-lat-' + kind + '-' + t + '-' + mode, () => shlLatSetup(kind === 'tri' ? shlTriPanel(t) : shlHexPanel(hOf(t)), mode));
  const out = { lt, lh, hOf, modes: {}, sweep: [] };
  for (const mode of ['press', 'point', 'shear']) { const a = solve('tri', SHL_LAT.t, mode), b = solve('hex', SHL_LAT.t, mode); out.modes[mode] = { tri: a, hex: b, ratio: shlLatD(b) / shlLatD(a) }; }
  for (const t of [1.2, 1.0, 0.8, 0.6, 0.45, 0.3]) { const a = solve('tri', t, 'press'), b = solve('hex', t, 'press'); out.sweep.push({ t, tri: a, hex: b, kt: SHL_LAT.P / shlLatD(a), kh: SHL_LAT.P / shlLatD(b), g: a.mass.reduce((s, v) => s + v, 0) }); }
  const p = out.modes.press; out.bend = { tri: shlBendShare(p.tri), hex: shlBendShare(p.hex) }; out.mass = p.tri.mass.reduce((s, v) => s + v, 0);
  /* one cell each, pin-jointed: the triangle holds, the hexagon is a mechanism */
  const l = 20, M = SIM_MAT.ppcf, bar = (i, j) => ({ i, j, w: 2.0, h: 1.0, E: M.E, rho: M.rho, truss: true });
  out.pinTri = simSolve('shl-pin-tri', () => ({ nodes: [[-l / 2, 0], [l / 2, 0], [0, l * Math.sqrt(3) / 2]], els: [bar(0, 1), bar(1, 2), bar(2, 0)], fix: { 0: 'xy', 1: 'y' }, loads: { 2: [0, -10, 0] } }));
  out.pinHex = simSolve('shl-pin-hex', () => ({ nodes: shlHexCell(l, Math.PI / 3), els: [0, 1, 2, 3, 4, 5].map(k => bar(k, (k + 1) % 6)), fix: { 0: 'xy', 1: 'y' }, loads: { 3: [0, -5, 0], 4: [0, -5, 0] } }));
  return (SHL.lat = out);
}
/** a hexagon of side l with a flat bottom on y = 0, its sides at angle th (60° is regular). Pin-jointed, it can fold
   through every th with no member changing length: [BL, BR, R, TR, TL, L] */
function shlHexCell(l, th) { const c = Math.cos(th) * l, s = Math.sin(th) * l; return [[-l / 2, 0], [l / 2, 0], [l / 2 + c, s], [l / 2, 2 * s], [-l / 2, 2 * s], [-l / 2 - c, s]]; }
/** draw a lattice panel solved by shlLat: members as bent beams (feDraw) on a clamped base, a rigid press bar on top */
function shlLatDraw(r, ox, oy, s, o = {}) {
  const P = p => [ox + p[0] * s, oy - p[1] * s], k = o.load == null ? 1 : o.load, a = o.alpha == null ? 1 : o.alpha;
  if (a <= 0.003) return P;
  const m = r.model, xs = m.nodes.map(p => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs);
  /* the clamped base */
  part(0, 0, 1, () => solid(() => { G.beginPath(); G.rect(ox + x0 * s - 14, oy + 2, (x1 - x0) * s + 28, 12); }, MT.shell, [ox + x0 * s - 14, oy + 2, (x1 - x0) * s + 28, 12], { hatch: true }), { alpha: a });
  feDraw(r, P, { scale: o.scale, load: k, smax: o.smax, w: s * 0.92, alpha: a, ghost: o.ghost !== false, seg: 12, fillet: o.fillet == null ? Math.max(3, 0.6 * s) : o.fillet });
  if (o.flow) feFlow(r, P, o.t, { scale: o.scale, load: k, alpha: a * o.flow, nmax: o.nmax });
  /* the press bar rides on the top row's mean deflection */
  if (o.bar !== false && m.dir === 1) {
    const dy = m.top.reduce((acc0, i) => acc0 + r.d[i * 3 + 1], 0) / m.top.length * (o.scale || 1) * k, yb = oy - (m.y1 + dy) * s;
    rr(ox + x0 * s - 10, yb - 16, (x1 - x0) * s + 20, 12, 6, inkA(0.72), null, 0, a);
  }
  return P;
}
/** the pointer pushing straight down onto (x, y) from above, the push k in 0..1 sinking it by depth px */
function shlPushPtr(t, t0, x, y, k, depth = 14) { const a = ep(t, t0 - 0.6, t0); cursorPtr(x + 4, y - 4 + k * depth - (1 - ep(t, t0 - 0.6, t0, E.out3)) * 120, { a, press: 0 }); }

/** snap to the stage's 40 px grid: tiles sit on it (F9.18) */
const shlG = v => Math.round(v / 40) * 40;
/** the material's strength (datasheet): PP-C-20A breaks at 120 MPa in tension (207 MPa in bending). The gauges use the
   lower, the one a crack opens against */
const SHL_STR = { ft: 120, fb: 207 };
/** a vertical gauge of the peak stress against the strength: (x, y) its top left, h tall. frac = peak ÷ strength.
   The fill runs on the heat scale and turns red as it reaches the strength (the dashed line at the top); what is left
   under the line is the margin. o = { a, w } */
function shlGauge(x, y, h, frac, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const w = o.w || 24, f = clamp(frac), fh = Math.max(w, h * f);
  rr(x, y, w, h, w / 2, C.track, null, 0, a);
  rr(x, y + h - fh, w, fh, w / 2, heatCol(f), null, 0, a);
  line(x - 12, y, x + w + 12, y, { color: C.bad, w: 2.5, dash: [7, 5], alpha: a });
}
/** the wheel's optical encoder, front-on, drawn as TTC's (a normal encoder's black housing in a stamped steel frame,
   the axle bushing in its face, two bent legs and a row of pins), a little taller than their photo. Origin: the axle.
   o = { clog (0..1: dust in the bushing and the frame's gaps) }. Returns { top, bush, left, right } in stage px */
function shlEncoderMM(o = {}) {
  const out = {}, steel = TH ? '#C9CDD3' : '#A7ADB5', steel2 = TH ? '#AEB3BA' : '#8C929B', tin = TH ? '#B9BEC5' : '#9AA0A8';
  /* pins and legs under the housing */
  for (const px of [-2.1, -0.7, 0.7, 2.1]) solid(() => { G.beginPath(); G.rect(px - 0.27, 5.4, 0.54, 3.9); }, MT.tin, [px - 0.27, 5.4, 0.54, 3.9], { fill: tin, lw: 0.8 });
  for (const sx of [-1, 1]) solid(() => { G.beginPath(); G.moveTo(sx * 4.6, 5.0); G.lineTo(sx * 5.6, 5.0); G.lineTo(sx * 5.6, 7.2); G.lineTo(sx * 6.4, 8.9); G.lineTo(sx * 5.5, 9.3); G.lineTo(sx * 4.6, 7.4); G.closePath(); }, MT.steel, [4.6, 5, 1.8, 4.3], { fill: steel2, lw: 0.9 });
  /* the black housing */
  solid(() => pathRR(-5.9, -7.0, 11.8, 12.6, 0.45), MT.black, [-5.9, -7.0, 11.8, 12.6], { fill: TH ? '#26272B' : '#1B1C1F', lw: 1 });
  /* the steel frame over its face: a plate with the bushing's hole, a tab folded over the top, two side clips */
  solid(() => { G.beginPath(); G.moveTo(-5.3, -7.0); G.lineTo(5.3, -7.0); G.lineTo(5.3, 3.2); G.lineTo(-5.3, 3.2); G.closePath(); G.moveTo(2.75, -0.6); G.arc(0, -0.6, 2.75, 0, TAU, true); }, MT.steel, [-5.3, -7, 10.6, 10.2], { fill: steel, lw: 1 });
  solid(() => { G.beginPath(); G.rect(-2.0, -7.9, 4.0, 0.9); }, MT.steel, [-2, -7.9, 4, 0.9], { fill: steel2, lw: 0.9 });
  for (const sx of [-1, 1]) solid(() => { G.beginPath(); G.rect(sx > 0 ? 5.3 : -6.2, -4.4, 0.9, 3.0); }, MT.steel, [5.3, -4.4, 0.9, 3], { fill: steel2, lw: 0.8 });
  /* the axle bushing and its D-shaped bore */
  G.beginPath(); G.arc(0, -0.6, 2.3, 0, TAU); G.fillStyle = TH ? '#8E8C86' : '#6E6C67'; G.fill(); G.strokeStyle = edgeCol(MT.black); G.lineWidth = lw(1); G.stroke();
  G.beginPath(); G.arc(0, -0.6, 1.15, -Math.PI * 0.82, Math.PI * 0.82); G.closePath(); G.fillStyle = '#141518'; G.fill();
  /* dust caught round the bushing and in the frame's gaps */
  const ck = o.clog || 0;
  if (ck > 0) { const r = rng(23); for (let i = 0; i < Math.round(26 * ck); i++) { const an = r() * TAU, d = 2.35 + r() * 0.5; G.beginPath(); G.arc(Math.cos(an) * d, -0.6 + Math.sin(an) * d, 0.17 + r() * 0.12, 0, TAU); G.fillStyle = rgba(C.bad, 0.9); G.fill(); } }
  out.top = SP(0, -7.9); out.bush = SP(0, -0.6); out.left = SP(-5.9, 0); out.right = SP(5.9, 0); out.base = SP(0, 9.3);
  return out;
}
/* the fillet study's stress frames (09-fillet-data.js), recoloured once onto the deck's heat scale, so the peak at a
   sharp corner reads red (F9.23). The frames were drawn dark → yellow → white; luminance maps back to the stress */
const SHL_FIMG = new Map();
function shlFilletImg(i) {
  const I = FILLET.img[i]; if (!I || !I.complete || !I.naturalWidth) return null;
  const key = i + (TH ? 'p' : 'n'); if (SHL_FIMG.has(key)) return SHL_FIMG.get(key);
  const stops = [[0, '#2a2c33'], [0.45, '#6e5a1f'], [0.62, '#c9a630'], [0.78, '#f2d860'], [1, '#ffffff']].map(([v, c]) => [v, hexRgb(c)]);
  const Lum = c => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2], LS = stops.map(([v, c]) => [v, Lum(c)]);
  const vOf = L => { if (L <= LS[0][1]) return 0; for (let q = 0; q < LS.length - 1; q++) if (L <= LS[q + 1][1]) return lerp(LS[q][0], LS[q + 1][0], (L - LS[q][1]) / (LS[q + 1][1] - LS[q][1])); return 1; };
  const lut = Array.from({ length: 256 }, (_, q) => hexRgb(heatCol(q / 255)).map(v => Math.round(v * 255)));
  let c;
  try {
    c = document.createElement('canvas'); c.width = I.naturalWidth; c.height = I.naturalHeight; const g = c.getContext('2d'); g.drawImage(I, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height), px = d.data;
    for (let p = 0; p < px.length; p += 4) {
      if (px[p + 3] < 8) continue;
      const L = Lum([px[p] / 255, px[p + 1] / 255, px[p + 2] / 255]);
      if (L < LS[0][1] * 0.72) { px[p + 3] = 0; continue; }
      const q = lut[Math.round(clamp(vOf(L)) * 255)]; px[p] = q[0]; px[p + 1] = q[1]; px[p + 2] = q[2];
    }
    g.putImageData(d, 0, 0);
  } catch (e) { c = I; }
  SHL_FIMG.set(key, c); return c;
}

/* ============================== 3. the pick: strength or weight (Brock: "most mice make you pick") ==============================
   left: five mice as RTINGS weighed and pressed them (their words); right: the plain wall's own trade-off, from the
   3D study's two plain-wall solutions, with the pointer dragging the wall's mass along it */
const SHL_PICK = [
  { id: 'finalmouse-ulx', i: 2, name: 'Finalmouse ULX Pro Series', say: '"Flexes and creaks with pressure"', flex: true },
  { id: 'finalmouse-ulx', i: 1, name: 'Finalmouse UltralightX Competition', say: '"Noticeable creaking, popping, and flexibility"', flex: true },
  { id: 'ninjutso-sora-v2', name: 'Ninjutso Sora V2', say: '"Feels solid"', flex: false },
  { id: 'logitech-gpx2', name: 'Logitech G Pro X Superlight 2', say: 'Build quality "much more consistent"', flex: false }
];
/** a mouse's measured weight from the dataset (entry i of a list), or null */
function shlMouseG(id, i) { const m = typeof exMouse === 'function' ? exMouse(id) : null; if (!m) return null; const f = m.weight_measured_g, x = Array.isArray(f) ? f[i || 0] : f, v = x && typeof x === 'object' ? x.value : x; return v == null ? null : +v; }
/** the plain wall's curve on an axes frame m: solid between the two solved walls, dashed where it is extrapolated */
function shlCurve(m, p, o = {}) {
  const ym = o.ymax || 200, seg = (g0, g1, dash) => { const pts = []; for (let g = g0; g <= g1 + 1e-6; g += 0.2) pts.push([m.X(g), m.Y(Math.min(ym, shlPlainFlex(g)))]); poly(pts, { color: o.color || C.ink, w: o.w || 3, dash, p, alpha: o.alpha }); };
  seg(o.g0 || 8, SHL_FE.g.wall, [7, 7]); seg(SHL_FE.g.wall, SHL_FE.g.body, null); seg(SHL_FE.g.body, o.g1 || 24, [7, 7]);
}
S({
  id: 'shlPick', ch: 'shell', theme: 'paper', title: 'The strength–weight trade-off', settle: 10, ideas: [15, 75],
  src: ['shlRtingsSoraUlx', 'shlRtingsUlxcGpx2', 'exRtings', 'shlLattice'],
  draw: t => {
    header(t, 'The strength–weight trade-off');
    captions(t, [[0.6, 'Most mice make you pick. The lightest flex and creak in reviews; the ones that feel solid weigh more.'], [5.2, 'A plain wall is why: thin it and it flexes, thicken it and it gets heavy. Every gram buys less stiffness than the last.']]);
    const y = 280, h = 640, lx = LM, lw = 640, cx = LM + 680, cw = RM - cx;
    /* left: what the reviewers found, lightest first, and Theseus's target */
    { const a0 = tileA(t, 0.3, 0); demoWindow(lx, y, lw, h, a0);
      text('Reviewers\' verdicts', lx + 32, y + 52, { role: 'label', size: 21, color: C.mute, alpha: a0 });
      pill(lx + lw - 32 - pillW('measured', { by: 'RTINGS' }), y + 52, 'measured', a0, { by: 'RTINGS' });
      const rows = SHL_PICK.map(r => Object.assign({ g: shlMouseG(r.id, r.i) }, r)).filter(r => r.g != null).sort((p, q) => p.g - q.g);
      rows.unshift({ hero: true, name: 'Theseus', say: 'A solid shell, no holes', g: THESEUS.mass });
      const bx = lx + 32, bw = lw - 64 - 110, max = 62;
      rows.forEach((r, i) => {
        const yy = y + 124 + i * 100, t0 = 0.9 + i * 0.32, a = ep(t, t0, t0 + 0.4), k = ep(t, t0 + 0.15, t0 + 1.0, E.snap);
        if (i) line(lx + 32, yy - 44, lx + lw - 32, yy - 44, { color: C.hair, w: 1, alpha: a });
        text(r.name, bx, yy, { role: 'small', size: 25, weight: 700, color: r.hero ? C.heroText : C.ink, alpha: a });
        text(r.say, bx, yy + 32, { role: 'small', size: 24, weight: 560, color: C.ink2, alpha: a, t, t0: t0 + 0.2, cps: 110 });
        text(r.hero ? 'Target' : r.flex ? 'Flexes' : 'Solid', lx + lw - 32, yy, { role: 'label', size: 21, color: r.hero ? C.heroText : r.flex ? C.bad : C.ink, align: 'right', alpha: a });
        const xe = shlBar({ x: bx, y: yy + 56, w: bw, max, v: r.g, col: r.hero ? C.hero : r.flex ? C.bad : C.comp, h: 12, a, k });
        text((r.hero ? THS.mass : fmtN(r.g, 1)) + ' g', xe + 12, yy + 63, { role: 'num', size: 22, weight: r.hero ? 800 : 650, color: r.hero ? C.heroText : C.ink, alpha: clamp(k * 1.4 - 0.3) });
      });
    }
    /* right: a plain wall, thinned and thickened, solved in the real shell */
    { const a0 = tileA(t, 0.3, 1); demoWindow(cx, y, cw, h, a0);
      text('A plain wall: flex against grams', cx + 32, y + 52, { role: 'label', size: 21, color: C.mute, alpha: a0 });
      const m = axes(t, { x: cx + 120, y: y + 130, w: cw - 190, h: 360, xr: [8, 24], yr: [0, 200], xticks: [8, 12, 16, 20, 24], yticks: [0, 50, 100, 150, 200], xfmt: v => v + ' g', yfmt: v => String(v), t0: 0.9 });
      const k0 = ep(t, 1.0, 1.4);
      text('Flex at 10 N on the crown, {µm}', cx + 32, y + 106, { role: 'label', size: 19, color: C.mute, alpha: k0 });
      text('Shell body mass', m.X(24), y + 130 + 360 + 64, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: k0 });
      /* the two ends of the pick */
      const kz = ep(t, 2.2, 2.8);
      rect(m.X(8), m.Y(200), m.X(11) - m.X(8), m.Y(0) - m.Y(200), { fill: rgba(C.bad, 0.08), alpha: kz });
      rect(m.X(20), m.Y(200), m.X(24) - m.X(20), m.Y(0) - m.Y(200), { fill: inkA(0.04), alpha: kz });
      text('Light: it flexes', m.X(8) + 14, m.Y(200) + 30, { role: 'label', size: 19, color: C.bad, alpha: kz });
      text('Stiff: it\'s heavy', m.X(24) - 14, m.Y(200) + 30, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: kz });
      shlCurve(m, ep(t, 1.2, 2.6, E.lin), { color: C.ink, w: 3 });
      /* the two solved walls */
      [[SHL_FE.g.wall, 'Wall alone'], [SHL_FE.g.body, 'Wall thickened']].forEach(([g, lab], j) => { const kk = ep(t, 1.8 + j * 0.3, 2.2 + j * 0.3), X = m.X(g), Y = m.Y(shlPlainFlex(g)); circle(X, Y, 6, { fill: C.ink, alpha: kk }); text(lab + ', solved', X + 14, Y - 14, { role: 'label', size: 19, color: C.ink2, alpha: kk }); });
      /* the pointer drags the wall's mass along the curve */
      const keys = [[2.8, 15.18], [3.4, 15.18], [4.6, 9.2], [5.2, 9.2], [6.6, 22.5], [7.2, 22.5], [8.2, 15.18]], g = kf(t, keys, E.cam), fl = shlPlainFlex(g);
      const hx = m.X(g), hyy = m.Y(Math.min(200, fl)), kh = ep(t, 2.6, 3.0);
      line(hx, hyy, hx, m.Y(0), { color: C.heroText, w: 1.5, dash: [4, 4], alpha: kh * 0.8 }); line(m.X(8), hyy, hx, hyy, { color: C.heroText, w: 1.5, dash: [4, 4], alpha: kh * 0.8 });
      circle(hx, hyy, 11, { fill: C.panel, color: C.heroText, w: 3, alpha: kh });
      cursorPtr(hx + 6, hyy + 8, { a: kh * (1 - ep(t, 8.6, 9.0)), grab: true });
      rich([{ s: fmtN(g, 1), font: 'disp', size: 44, weight: 800, color: C.ink, tnum: true }, { s: 'g', role: 'label', size: 22, color: C.mute, gap: 8 }, { s: fmtN(fl, 0), font: 'disp', size: 44, weight: 800, color: C.ink, tnum: true, gap: 36 }, { s: 'µm of flex', role: 'label', size: 22, color: C.mute, gap: 8, caps: false }], cx + cw - 32, y + 56, { align: 'right', alpha: kh });
      text('3D shell FE, PP-C-20A, 10 N on the crown. Two plain walls solved; between them flex falls with mass^2.37, dashed beyond.', cx + 32, y + h - 60, { role: 'small', size: 24, color: C.faint, maxW: cw - 64, lh: 1.3, alpha: ep(t, 3.0, 3.4) });
      pill(cx + cw - 32 - pillW('derived'), y + 106, 'derived', k0);
    }
  }
});

/* ============================== 4. the turn: what if you didn't have to pick ==============================
   the question types in, alone; it rises into the title; the trade-off redraws, and the lattice lands under it at the
   same grams: the curve breaks, and the question changes from how much material to where it is */
S({
  id: 'shlNoPick', ch: 'shell', theme: 'night', title: 'What if you didn\'t have to pick', settle: 10, ideas: [75, 15], src: ['shlLattice', 'shlDoc'],
  draw: t => {
    header(t, '');
    const q = 'What if you didn’t have to pick…', km = ep(t, 2.9, 3.9, E.cam), size = lerp(100, 62, km), wq = tw(q, { role: 'h1', size });
    text(q, lerp(W / 2 - wq / 2, LM - 3, km), lerp(590, LAY.titleY, km), { role: 'h1', size, color: C.ink, t, t0: 0.4, cps: 22, caret: t < 3.0 });
    if (t < 3.6) return;
    captions(t, [[3.9, 'The trade-off assumes a plain wall. Keep the grams, move them into a triangle lattice, and the curve stops holding.'], [7.0, 'The same 15.2 g flexes half as much. To match it, a plain wall needs about ' + fmtN(SHL_FE.match, 1) + ' g.']]);
    const x = LM, y = 280, w = RM - LM, h = 640, a0 = ep(t, 3.6, 4.1);
    demoWindow(x, y, w, h, a0);
    const m = axes(t, { x: x + 130, y: y + 110, w: 1060, h: 420, xr: [10, 24], yr: [0, 120], xticks: [10, 12, 16, 20, 24], yticks: [0, 40, 80, 120], xfmt: v => v + ' g', yfmt: v => String(v), t0: 3.8 });
    const ka = ep(t, 3.9, 4.3);
    text('Flex at 10 N on the crown, {µm}', x + 40, y + 60, { role: 'label', size: 19, color: C.mute, alpha: ka });
    text('Shell body mass', m.X(24), y + 110 + 420 + 64, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ka });
    /* the trade-off, and then the break: the curve splits at the body's mass, the far half drops out of focus */
    const kb = ep(t, 5.9, 6.5, E.out3), gB = SHL_FE.g.body, fB = shlPlainFlex(gB), cO = { color: C.ink, w: 3, g0: 10, ymax: 120 };
    if (kb <= 0) shlCurve(m, ep(t, 4.0, 5.0, E.lin), cO);
    else {
      G.save(); G.beginPath(); G.rect(m.X(10) - 4, m.Y(120) - 20, m.X(gB) - 3 - m.X(10) + 4, m.Y(0) - m.Y(120) + 40); G.clip(); shlCurve(m, 1, cO); G.restore();
      G.save(); G.beginPath(); G.rect(m.X(gB) + 3, m.Y(120) - 20, m.X(24) - m.X(gB), m.Y(0) - m.Y(120) + 60); G.clip(); G.translate(6 * kb, 14 * kb); shlCurve(m, 1, Object.assign({}, cO, { color: mix(C.ink, C.bg, 0.6 * kb) })); G.restore();
      const sp = ep(t, 5.9, 6.4); if (sp < 1) for (let i = 0; i < 7; i++) { const an = -Math.PI / 2 + (i - 3) * 0.45, d = 8 + sp * 46; circle(m.X(gB) + Math.cos(an) * d, m.Y(fB) + Math.sin(an) * d, 2.4, { fill: C.ink, alpha: (1 - sp) * 0.9 }); }
    }
    /* the plain wall at the body's mass, and the lattice at the same grams */
    const kp = ep(t, 4.8, 5.2), Xb = m.X(gB), Yp = m.Y(fB), Yl = m.Y(SHL_FE.tri.defl);
    circle(Xb, Yp, 7, { fill: C.ink, alpha: kp });
    text('Plain wall, ' + fmtN(fB, 1) + ' µm', Xb + 18, Yp - 16, { role: 'label', size: 21, color: C.ink, alpha: kp });
    const kl = ep(t, 5.3, 5.9, E.out3), yDrop = lerp(m.Y(120) - 30, Yl, kl);
    if (kl > 0) heroMark(Xb, yDrop, 13, ep(t, 5.3, 5.45));
    const kd = ep(t, 6.1, 6.6);
    if (kd > 0) {
      const bxk = Xb - 40;
      line(bxk, Yp, bxk, lerp(Yp, Yl, kd), { color: C.heroText, w: 2, alpha: kd }); line(bxk - 8, Yp, bxk + 8, Yp, { color: C.heroText, w: 2, alpha: kd }); line(bxk - 8, Yl, bxk + 8, Yl, { color: C.heroText, w: 2, alpha: kd });
      text('−' + Math.round((1 - SHL_FE.tri.defl / fB) * 100) + '%', bxk - 16, (Yp + Yl) / 2 + 9, { font: 'disp', size: 30, weight: 800, color: C.heroText, grad: C.heroGrad, align: 'right', alpha: kd });
      text('Triangle lattice, ' + fmtN(SHL_FE.tri.defl, 1) + ' µm', Xb + 22, Yl + 40, { role: 'label', size: 21, color: C.heroText, alpha: kd });
    }
    /* where a plain wall would have to go to match it */
    const kmm = ep(t, 7.2, 8.0, E.cam), Xm = m.X(SHL_FE.match);
    if (kmm > 0) { line(Xb + 18, Yl, lerp(Xb + 18, Xm, kmm), Yl, { color: C.ink2, w: 1.5, dash: [5, 5], alpha: 0.9 }); const kq = ep(t, 7.9, 8.3); circle(Xm, Yl, 6, { fill: C.ink2, alpha: kq }); text('A plain wall: ' + fmtN(SHL_FE.match, 1) + ' g', Xm + 12, Yl - 24, { role: 'label', size: 19, color: C.ink2, alpha: kq }); }
    /* right: the question changes */
    const rx = x + 1280, rw = w - 1280 - 40, kq1 = ep(t, 4.4, 4.9), flip = ep(t, 6.6, 7.4, E.cam);
    text('The question was', rx, y + 150, { role: 'label', size: 21, color: C.mute, alpha: kq1 * (1 - flip) });
    text('The question is', rx, y + 150, { role: 'label', size: 21, color: C.mute, alpha: flip });
    const sy = 1 - 2 * Math.min(flip, 1 - flip) * 0.98;
    G.save(); G.translate(0, y + 232); G.scale(1, Math.max(0.02, sy)); G.translate(0, -(y + 232));
    text(flip < 0.5 ? 'How much material' : 'Where the material is', rx, y + 232, { role: 'h2', size: 52, color: flip < 0.5 ? C.ink : C.heroText, grad: flip < 0.5 ? null : C.heroGrad, maxW: rw, lh: 1.04, alpha: kq1 });
    G.restore();
    const kn = ep(t, 7.6, 8.1);
    text('Same 15.2 g body: ' + Math.round(SHL_FE.thick.press) + ' N/mm as a plain wall, ' + Math.round(SHL_FE.tri.press) + ' N/mm as a lattice. The ' + fmtN(SHL_FE.match, 1) + ' g follows the plain wall\'s own curve past its last solved point.', rx, y + 400, { role: 'small', size: 25, color: C.ink2, maxW: rw, lh: 1.34, alpha: kn, t, t0: 7.6, cps: 120 });
    pill(rx, y + h - 40, 'derived', kn, { text: 'Derived, 3D shell FE' });
  }
});

/* ============================== 5. stress hotspots: a solid plane piles its stress into one spot (Brock, #75: "the force ... converges onto one failure point") ==============================
   the same grams across the same 60 mm span, solved as 2D frames: a solid plane (a beam of the full depth, thinner out
   of the page) and triangles whose members are sized to their own force. The pointer presses each; the camera pushes
   into the plane's hotspot; force runs through the triangles. Both on one heat scale: red is the plane's peak */
S({
  id: 'shlHotspot', ch: 'shell', theme: 'paper', title: 'Stress hotspots', settle: 10, ideas: [75, 93], src: ['shlHot2d', 'shlDoc'],
  draw: t => {
    header(t, 'Stress hotspots');
    captions(t, [[0.6, 'Press a solid plane and the stress piles into one spot under the finger. That red spot is a hotspot.'], [5.8, 'The same grams as triangles share the press along every member. The peak drops ' + Math.round((1 - shlHot().sized.peak / shlHot().plate.peak) * 100) + '%, and nothing runs red.']]);
    const R = shlHot(), smax = R.plate.peak, s = 15.5, sc = 12, H = SHL_HOT.H;
    const tx = LM, tw0 = 1240, th = 300, ya = 280, yb = 620;
    const kA = ep(t, 1.8, 3.2, E.io3), kB = ep(t, 6.0, 7.2, E.io3);
    /* tile A: the solid plane */
    const aA = tileA(t, 0.3, 0); demoWindow(tx, ya, tw0, th, aA);
    text('A solid plane', tx + 32, ya + 52, { role: 'label', size: 21, color: C.mute, alpha: aA }); pill(tx + tw0 - 32 - pillW('derived'), ya + 52, 'derived', aA);
    const oxA = tx + 40 + 465, oyA = ya + 254, PA = p => [oxA + p[0] * s, oyA - p[1] * s];
    const hot = PA([0, R.plate.d[R.plate.model.mid * 3 + 1] * sc * kA]), z = 1 + 0.85 * env(t, 3.5, 4.2, 4.7, 5.4, E.cam);
    clipped(tx + 2, ya + 70, tw0 - 260, th - 72, () => {
      G.save(); G.translate(hot[0], hot[1]); G.scale(z, z); G.translate(-hot[0], -hot[1]);
      shlPlateField(R.plate, PA, kA, sc, smax, ep(t, 0.7, 1.2));
      feSupport(PA([-30, 0]), 'pin', { alpha: ep(t, 0.8, 1.2) }); feSupport(PA([30, 0]), 'roll', { alpha: ep(t, 0.8, 1.2) });
      G.restore();
    });
    const topA = PA([0, H + R.plate.d[R.plate.model.mid * 3 + 1] * sc * kA]);
    if (z < 1.02) shlPress(t, 1.8, topA, kA);
    /* the hotspot, named while the camera is in */
    const kh = env(t, 3.9, 4.2, 4.7, 5.0);
    /* the ring is ink, so it reads on the red; a leader takes it to the peak's readout on the right */
    if (kh > 0) { const r0 = 24 + 5 * Math.sin(t * 6); circle(hot[0], hot[1] - 4, r0, { color: C.ink, w: 3, alpha: kh }); line(hot[0] + r0 + 4, hot[1] - 8, tx + tw0 - 248, ya + 152, { color: C.ink, w: 2, alpha: kh }); }
    /* tile B: the same grams as triangles, each member as thick as its force needs */
    const aB0 = tileA(t, 0.3, 1); demoWindow(tx, yb, tw0, th, aB0);
    text('The same grams as triangles', tx + 32, yb + 52, { role: 'label', size: 21, color: C.mute, alpha: aB0 }); pill(tx + tw0 - 32 - pillW('derived'), yb + 52, 'derived', aB0);
    const oxB = tx + 40 + 465, oyB = yb + 254, PB = p => [oxB + p[0] * s, oyB - p[1] * s], aB = ep(t, 0.9, 1.4);
    feDraw(R.sized, PB, { scale: sc, load: kB, smax, w: s * 0.92, alpha: aB, ghost: kB > 0.02, seg: 8, fillet: 5 });
    feFlow(R.sized, PB, t, { scale: sc, load: kB, alpha: aB });
    feSupport(PB([-30, 0]), 'pin', { alpha: aB }); feSupport(PB([30, 0]), 'roll', { alpha: aB });
    const md = R.sized.model.mid, topB = PB([R.sized.model.nodes[md][0], H + R.sized.d[md * 3 + 1] * sc * kB]);
    shlPress(t, 6.0, topB, kB);
    /* the pointer: onto the plane, a push, then across to the triangles */
    cursorAt(t, [[1.0, [tx + 1060, ya + 250]], [1.7, [topA[0] + 2, topA[1] - 70]], [3.2, [topA[0] + 2, topA[1] - 62]], [5.3, [topA[0] + 2, topA[1] - 62]], [5.9, [topB[0] + 2, topB[1] - 70]], [7.2, [topB[0] + 2, topB[1] - 62]]], [1.8, 6.0], { a: ep(t, 0.7, 1.0) * (z < 1.02 ? 1 : 0) });
    /* the readouts, right of each drawing */
    const rx = tx + tw0 - 232;
    [[R.plate, ya, 1.9, false], [R.sized, yb, 6.3, true]].forEach(([r, yy, t0, hero]) => {
      const a = ep(t, t0, t0 + 0.4);
      text('Peak stress', rx, yy + 112, { role: 'label', size: 19, color: C.mute, alpha: a });
      rich([{ s: fmtN(r.peak, 1), font: 'disp', size: 56, weight: 800, color: hero ? C.heroText : C.bad, grad: hero ? C.heroGrad : null, tnum: true, count: [t0, 1.0] }, { s: 'MPa', role: 'label', size: 21, color: C.mute, gap: 8, caps: false }], rx, yy + 172, { t, alpha: a });
      text('Flex ' + fmtN(10000 / r.k, 0) + ' µm', rx, yy + 214, { role: 'num', size: 22, weight: 650, color: C.ink2, alpha: a });
      if (hero) text('−' + Math.round((1 - R.sized.peak / R.plate.peak) * 100) + '% peak', rx, yy + 250, { role: 'label', size: 19, color: C.heroText, alpha: ep(t, 7.4, 7.8) });
      else text('One hot spot', rx, yy + 250, { role: 'label', size: 19, color: C.bad, alpha: ep(t, 4.4, 4.8) });
    });
    /* the words, and how to read the colours, in the right column */
    const cx2 = tx + tw0 + 40, cw2 = RM - cx2;
    glossBox(t, 2.4, cx2, ya, cw2, 'Stress hotspot', 'A spot where stress piles up far above the rest of the part. A crack starts there, while the material round it barely works.', { size: 25 });
    const ak = tileA(t, 3.0, 0); demoWindow(cx2, yb, cw2, th, ak);
    shlRamp(t, 3.0, cx2 + 32, yb + 76, cw2 - 64, 'Peak, red', 'Stress at 10 N, one scale for both');
    text('2D frames, PP-C-20A: a 60 mm span on a pin and a roller, 10 N in the middle. Same span, depth and grams for both. Flex drawn 12× real.', cx2 + 32, yb + 160, { role: 'small', size: 22, weight: 560, color: C.faint, maxW: cw2 - 64, lh: 1.32, alpha: ak });
  }
});

/* ============================== 6. peak stress decides the break (Brock, F9.23: "show the risk of breakage") ==============================
   the same two frames, the press rising from 10 N: each frame's peak against PP-C-20A's strength, as a gauge. The
   model is linear, so the peak scales with the press; the plane's hotspot reaches 120 MPa first and cracks there, at
   one point, while the rest of it idles; the triangles carry the press on until their own peak gets there */
S({
  id: 'shlMargin', ch: 'shell', theme: 'night', title: 'Peak stress decides the break', settle: 10.5, ideas: [75, 93], after: 'shlHotspot', src: ['shlHot2d', 'shlPyrofil'],
  draw: t => {
    const R = shlHot(), FB = R.plate.peak, FT = R.sized.peak, brkP = SHL_STR.ft / FB * 10, brkT = SHL_STR.ft / FT * 10;
    header(t, 'Peak stress decides the break');
    captions(t, [[0.6, 'A part breaks where its peak reaches the material\'s strength, not its average. So the peak sets how hard you can press.'], [4.6, 'The plane\'s hotspot hits ' + SHL_STR.ft + ' MPa at ' + Math.round(brkP) + ' N and cracks at one point. The same grams as triangles hold to ' + Math.round(brkT) + ' N.']]);
    const F = lerp(10, brkT, ep(t, 2.0, 8.4, E.lin)), tAt = f => 2.0 + 6.4 * (f - 10) / (brkT - 10), x = LM, y = 280, w = 1080, h = 640, a0 = tileA(t, 0.3, 0), s = 12.5, sc = 2, H = SHL_HOT.H;
    demoWindow(x, y, w, h, a0);
    /* the press, live */
    rich([{ s: 'Press', role: 'label', size: 21, color: C.mute }, { s: fmtN(F, 0), font: 'disp', size: 44, weight: 800, color: C.ink, tnum: true, gap: 14 }, { s: 'N', role: 'label', size: 22, color: C.mute, gap: 6, caps: false }], x + 32, y + 64, { alpha: a0 });
    const rows = [[R.plate, y + 290, 'A solid plane', brkP, false], [R.sized, y + 566, 'The same grams as triangles', brkT, true]];
    rows.forEach(([r, oy, name, brk, tri], i) => {
      const Fi = Math.min(F, brk), kL = Fi / 10, ox = x + 40 + 375, P = p => [ox + p[0] * s, oy - p[1] * s], a = ep(t, 0.8 + i * 0.2, 1.3 + i * 0.2);
      const broke = F >= brk - 0.05, kc = tri ? 0 : ep(t, tAt(brk), tAt(brk) + 0.6);
      text(name, x + 32, oy - 190, { role: 'label', size: 19, color: C.mute, alpha: a });
      if (!tri) shlPlateField(r, P, kL, sc, SHL_STR.ft, a * (broke ? 1 - 0.45 * kc : 1), { crack: kc });
      else feDraw(r, P, { scale: sc, load: kL, smax: SHL_STR.ft, w: s * 0.92, alpha: a, seg: 8, fillet: 4 });
      if (tri) feFlow(r, P, t, { scale: sc, load: kL, alpha: a * 0.8 });
      feSupport(P([-30, 0]), 'pin', { alpha: a }); feSupport(P([30, 0]), 'roll', { alpha: a });
      const md = r.model.mid, top = P([r.model.nodes[md][0], H + r.d[md * 3 + 1] * sc * kL]);
      shlPress(t, 1.6, top, clamp(F / 130 + 0.2), { len: 54 });
      /* the gauge: the peak now against the strength */
      const gx = x + 790, gy = oy - 186, gh = 180, frac = r.peak * kL / SHL_STR.ft;
      shlGauge(gx, gy, gh, frac, { a });
      text(SHL_STR.ft + ' MPa', gx + 44, gy + 7, { role: 'label', size: 19, color: C.bad, alpha: a, caps: false });
      text('Peak', gx + 44, gy + 70, { role: 'label', size: 19, color: C.mute, alpha: a });
      text(fmtN(r.peak * kL, 0) + ' MPa', gx + 44, gy + 104, { role: 'num', size: 26, weight: 800, color: broke ? C.bad : C.ink, alpha: a });
      text(broke ? (tri ? 'Holds to ' : 'Cracked at ') + Math.round(brk) + ' N' : 'Margin ' + Math.round((1 - frac) * 100) + '%', gx + 44, gy + 140, { role: 'label', size: 19, color: broke ? C.bad : tri ? C.heroText : C.ink2, alpha: a });
      if (!tri && broke) callout(t, tAt(brk) + 0.3, [ox, oy - 4], 'Cracks at one point; the rest of it idles', { to: [ox + 150, oy + 46], side: 'r', color: C.bad, tcolor: C.bad, prose: true, maxW: 300 });
    });
    /* the pointer, pressing harder: on the plane, then on the triangles once the plane has gone */
    const pT = rows.map(([r, oy, , , tri]) => { const ox = x + 40 + 375; return [ox, oy - H * s - 70]; });
    cursorAt(t, [[1.0, [x + 700, y + 120]], [1.5, [pT[0][0] + 2, pT[0][1] - 10]], [5.0, [pT[0][0] + 2, pT[0][1] - 4]], [5.6, [pT[1][0] + 2, pT[1][1] - 10]], [8.4, [pT[1][0] + 2, pT[1][1] - 4]]], [1.6, 3.0, 4.4, 6.0, 7.4], { a: ep(t, 0.8, 1.1) * (1 - ep(t, 9.0, 9.4)) });
    text('2D frames, flex drawn 2× real. PP-C-20A breaks at ' + SHL_STR.ft + ' MPa in tension.', x + 32, y + h - 28, { role: 'small', size: 22, weight: 560, color: C.faint, alpha: ep(t, 1.4, 1.8) });
    pill(x + w - 32 - pillW('datasheet', { by: 'Pyrofil' }), y + h - 28, 'datasheet', ep(t, 1.4, 1.8), { by: 'Pyrofil' });
    /* right: what it buys, and every idea in this chapter that lowers the peak */
    const rx = x + w + 40, rw = RM - rx;
    statTile(t, 8.4, [rx, y, rw, 240], { value: fmtN(brkT / brkP, 1), unit: '×', label: 'the press, same grams, before it cracks', ev: 'derived', hero: true, align: 'left' });
    const a2 = tileA(t, 1.2, 1), ty = y + 280, th2 = h - 280; demoWindow(rx, ty, rw, th2, a2);
    text('Every idea here lowers the peak', rx + 32, ty + 52, { role: 'label', size: 21, color: C.ink, alpha: a2 });
    [['Triangles', 'the press runs along the members'], ['Fillets', 'no sharp corner to crowd into'], ['Arches', 'curved ribs carry it in compression'], ['Fibres', 'aligned with the load they carry'], ['The whole board', 'a tie across the base'], ['Thicker low sides', 'wall where the stress is']].forEach(([n, d], j) => {
      const yy = ty + 104 + j * 40, kk = ep(t, 1.6 + j * 0.18, 2.0 + j * 0.18);
      rich([{ s: n, role: 'label', size: 19, color: j ? C.ink : C.heroText }, { s: d, role: 'small', size: 22, weight: 560, color: C.mute, gap: 14 }], rx + 32, yy, { alpha: a2 * kk });
    });
  }
});

/* ============================== 7. the grams that work (Brock: "the amount of grams a force will actually act on") ==============================
   the same three frames, every gram coloured by how hard it works at the same press, most stressed first; the share
   stressed to at least half of its own peak is the share that works */
S({
  id: 'shlWork', ch: 'shell', theme: 'paper', title: 'The grams that work', settle: 10, ideas: [75, 93], src: ['shlHot2d', 'shlDoc', 'shlLattice'],
  draw: t => {
    header(t, 'The grams that work');
    captions(t, [[0.6, 'Press each the same way and colour every gram by how hard it works. In the solid plane most of them idle.'], [5.4, 'Sized to the force, triangles put ' + Math.round(shlHot().sized.work * 100) + '% of their grams to work. A solid plane needs ' + fmtN(shlHot().match, 1) + '× the grams to match their peak.']]);
    const R = shlHot(), ref = R.plate.peak, rows = [[R.plate, 'Solid plane', 'plate'], [R.uni, 'Triangles, all one size', 'uni'], [R.sized, 'Triangles, sized to their force', 'sized']];
    rows.forEach(([r, name, kind], i) => {
      const y = 280 + i * 160, h = 120, a = tileA(t, 0.4, i), k = ep(t, 1.4 + i * 0.5, 3.2 + i * 0.5, E.io3), hero = kind === 'sized';
      demoWindow(LM, y, RM - LM, h, a);
      /* a small picture of the frame, coloured the same way */
      const s = 4.0, ox = LM + 160, oy = y + 84, P = p => [ox + p[0] * s, oy - p[1] * s];
      if (kind === 'plate') shlPlateField(r, P, k, 0, ref, a, { ny: 8 }); else feDraw(r, P, { load: k, smax: ref, w: s * 0.95, alpha: a, seg: 4, fillet: 2 });
      /* the grams, as 52 cells of equal mass, most stressed first */
      const bx = LM + 360, bw = 1000, by = y + 58, bh = 36, n = r.cells.length, gap = 3, cwid = (bw - gap * (n - 1)) / n;
      text(name, bx, y + 42, { role: 'label', size: 21, color: hero ? C.heroText : C.ink, alpha: a });
      for (let c = 0; c < n; c++) { const kc = ep(k, c / n * 0.7, c / n * 0.7 + 0.3, E.lin); rr(bx + c * (cwid + gap), by, cwid, bh, 3, kc > 0 ? heatCol(r.cells[c] * kc / ref) : C.track, null, 0, a); }
      /* where the cells drop under half this frame's own peak */
      const cut = r.cells.findIndex(v => v < 0.5 * r.peak), xc = bx + (cut < 0 ? n : cut) * (cwid + gap) - gap / 2, kk = ep(t, 3.6 + i * 0.3, 4.0 + i * 0.3);
      line(xc, by - 8, xc, by + bh + 8, { color: C.ink, w: 2, alpha: kk });
      if (i === 0) text('Half its own peak', xc + 10, y + 42, { role: 'label', size: 19, color: C.mute, alpha: kk });
      /* the share that works, and what that is on the study shell's body */
      const nx = LM + 1380;
      rich([{ s: String(Math.round(r.work * 100)), font: 'disp', size: 60, weight: 800, color: hero ? C.heroText : C.ink, grad: hero ? C.heroGrad : null, tnum: true, count: [3.6 + i * 0.3, 1.0] }, { s: '%', font: 'disp', size: 36, weight: 800, color: hero ? C.heroText : C.ink, grad: hero ? C.heroGrad : null, gap: 4 }], nx, y + 86, { t, alpha: kk });
      text('of its grams work', nx + 136, y + 52, { role: 'label', size: 19, color: C.mute, alpha: kk });
      text('≈ ' + fmtN(r.work * SHL_FE.g.body, 1) + ' g of 15.2 g', nx + 136, y + 86, { role: 'num', size: 22, weight: 650, color: C.ink2, alpha: kk });
    });
    /* the strength it buys, and the words */
    const yb = 760, hb = 200;
    statTile(t, 5.6, [LM, yb, 680, hb], { value: fmtN(R.match, 1), unit: '×', label: 'the grams a solid plane needs to match', ev: 'derived', align: 'left' });
    glossBox(t, 6.2, LM + 720, yb, RM - LM - 720, 'Grams that work', 'The share of a part stressed to at least half its own peak. The grams on the right put that share on the 15.2 g study body, for scale; the rest only rides along.', { size: 24 });
  }
});

/* ============================== 8. the real shell: the same grams as a triangle lattice; the meter starts here ============================== */
const SHL_CROWN = [0, 37.67, -13.09];
S({
  id: 'shlShell3d', ch: 'shell', theme: 'night', title: 'The triangle lattice, same grams', settle: 10, ideas: [75, 15], src: ['shlLattice'], three: ['lattice'],
  draw: t => {
    header(t, 'The triangle lattice, same grams');
    captions(t, [[0.6, 'Now the real shell: its 15.2 g body as a plain wall, or as a thinner wall carrying a triangle lattice.'], [4.8, 'Same grams, twice as stiff on the crown, and its busiest rib runs ' + Math.round((1 - SHL_FE.tri.ribP99 / SHL_FE.thick.wallP99) * 100) + '% under the plain wall\'s peak. The strip keeps score from here.']]);
    /* left: the study shell, cut on its centre line, ribs growing, then the press colours them */
    const x = LM, y = 280, w = 960, h = 640, a0 = tileA(t, 0.3, 0);
    demoWindow(x, y, w, h, a0);
    text('The study shell, cut on its centre line', x + 32, y + 52, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 0.6, 1.0) });
    const bx = x + 8, by = y + 72, bw = w - 16, bh = h - 80, st = { view: 'left', cut: 1, build: ep(t, 0.8, 3.0, E.io3), stress: ep(t, 3.4, 4.6), stressCase: 'press', zoom: in2D(1.62, 1.72), yaw: 0.1 * Math.sin(t * 0.4), pitch: 0.06 };
    shl3D('lattice', t, bx, by, bw, bh, st, { alpha: ep(t, 0.5, 1.1) });
    const pc = shlProj(st, [bx, by, bw, bh], SHL_CROWN), kp = ep(t, 3.2, 3.6);
    shlPress(t, 3.2, pc, kp, { len: 70 });
    cursorAt(t, [[2.6, [pc[0] + 140, pc[1] - 160]], [3.2, [pc[0] + 2, pc[1] - 84]], [4.0, [pc[0] + 2, pc[1] - 78]]], [3.3], { a: ep(t, 2.4, 2.7) });
    if (!V2D.on) shlRamp(t, 3.8, x + 32, y + h - 62, 200, 6, 'Stress at 10 N');
    /* right: the two numbers, the strip, and what the strip is */
    const rx = x + w + 40, rw = RM - rx, cw2 = (rw - 40) / 2;
    statTile(t, 1.0, [rx, y, cw2, 240], { head: 'Plain wall', ev: 'derived', value: String(Math.round(SHL_FE.thick.press)), unit: 'N/mm', label: 'on the crown, 15.2 g', align: 'left', quiet: true });
    statTile(t, 1.5, [rx + cw2 + 40, y, cw2, 240], { head: 'Triangle lattice', ev: 'derived', value: String(Math.round(SHL_FE.tri.press)), unit: 'N/mm', label: 'the same 15.2 g', hero: true, align: 'left' });
    shellMeter(t, 4.8, 'lattice', rx + 8, y + 290, rw - 16);
    glossBox(t, 5.8, rx, y + 540, rw, 'The strip', 'Flex and peak stress at the same press and mass, against a plain thin wall with no ribs: 100 %.', { size: 24 });
  }
});

/* ============================== 9. triangle and hexagon lattices at the same grams (#75) ==============================
   two panels of 12.5 mm cells, whole cells only, so no wall hangs free; the same rib mass, the base clamped, the same
   press on top through a bar the pointer pushes. Solved as rigid-jointed frames; deflection drawn at one exaggeration
   for both, chosen so the hexagons move about 20 px; members coloured on one stress scale (the hexagons' peak is red),
   force running in them; every joint filleted, as the real lattice is */
function shlLatK(r, s, px = 20) { const raw = px / (s * r.dmax), e = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / e; return (m >= 5 ? 5 : m >= 2 ? 2 : 1) * e; }
/** one lattice tile: the name and the readout on one line over the drawing, the pointer on the press bar */
function shlLatTile(t, r, x, y, w, h, s, o) {
  const a = tileA(t, 0.3, o.i), hero = o.i === 0;
  demoWindow(x, y, w, h, a);
  text(o.name, x + 32, y + 52, { role: 'label', size: 22, color: hero ? C.heroText : C.ink2, alpha: a });
  const m = r.model, xs = m.nodes.map(p => p[0]), ox = x + (w - (Math.max(...xs) - Math.min(...xs)) * s) / 2, oy = y + h - 36;
  shlLatDraw(r, ox, oy, s, { load: o.k, scale: o.K, smax: o.smax, alpha: ep(t, 0.9, 1.4), flow: o.flow == null ? 1 : o.flow, t, nmax: o.nmax, fillet: o.fillet });
  if (o.tp != null) {
    const dy = m.top.reduce((acc0, q) => acc0 + r.d[q * 3 + 1], 0) / m.top.length * o.K * o.k, bx = ox + (Math.max(...xs) + Math.min(...xs)) / 2 * s, byy = oy - (m.y1 + dy) * s - 16;
    cursorPtr(bx + 2, byy - 2 - (1 - ep(t, o.tp - 0.7, o.tp, E.cam)) * 90, { a: ep(t, o.tp - 0.9, o.tp - 0.5) * (1 - ep(t, o.tp + 1.4, o.tp + 1.8)), press: t > o.tp && t < o.tp + 0.45 ? prog(t, o.tp, o.tp + 0.45) : 0 });
  }
  const kd = ep(t, o.t1, o.t1 + 0.4);
  rich([{ s: o.lab, role: 'label', size: 19, color: C.mute }, { s: o.val, font: 'disp', size: 40, weight: 800, color: hero ? C.heroText : C.ink, grad: hero ? C.heroGrad : null, tnum: true, gap: 14 }, { s: o.unit, role: 'label', size: 21, color: C.mute, gap: 8, caps: false }], x + w - 32, y + 56, { align: 'right', alpha: kd });
}
S({
  id: 'lattice', ch: 'shell', theme: 'paper', title: 'Triangle vs hexagon lattices', settle: 10, ideas: [75], src: ['shlLat2d', 'mitHoney', 'shlMaxwell'],
  draw: t => {
    const L = shlLat(), pr = L.modes.press, s = 6.0, K = shlLatK(pr.hex, s), nmax = Math.max(...pr.tri.N.map(Math.abs)), smax = pr.hex.smax;
    header(t, 'Triangle vs hexagon lattices');
    captions(t, [[0.6, 'Two lattices, the same grams of rib, the same press on top. The hexagons give: every wall bends at its joints.'], [5.4, 'The triangles barely move: ' + fmtN(pr.ratio, 1) + '× stiffer for the same weight. Flex drawn ' + K + '× real, the same for both.']]);
    const kT = ep(t, 2.3, 3.4, E.io3), kH = ep(t, 4.1, 5.2, E.io3), br = t > 5.4 ? 0.88 + 0.12 * Math.cos((t - 5.4) * 1.6) : 1;
    [[pr.tri, LM, 880, 'Triangles', kT * br, 0, 2.2, 3.2], [pr.hex, LM + 920, RM - LM - 920, 'Hexagons, the same grams', kH * br, 1, 4.0, 5.0]].forEach(([r, x, w, name, k, i, tp, t1]) => {
      shlLatTile(t, r, x, 280, w, 400, s, { i, name, k, K, smax, nmax, tp, t1, lab: 'Top moves', val: fmtN(shlLatD(r) * 1000, 1), unit: 'µm at 10 N' });
    });
    /* the strip: the gap under three loads, what the word means, and where the law comes from */
    const ys = 720, hs = 200, a1 = tileA(t, 5.6, 0);
    demoWindow(LM, ys, 560, hs, a1);
    text('Hexagons give more, same grams', LM + 32, ys + 50, { role: 'label', size: 19, color: C.mute, alpha: a1 });
    [['press', 'Pressed evenly'], ['point', 'One fingertip'], ['shear', 'Pushed sideways']].forEach(([md, nm], j) => {
      const yy = ys + 96 + j * 40, k = ep(t, 5.9 + j * 0.15, 6.7 + j * 0.15, E.snap), v = L.modes[md].ratio;
      text(nm, LM + 32, yy + 8, { role: 'small', size: 24, weight: 600, color: C.ink2, alpha: a1 });
      const xe = shlBar({ x: LM + 270, y: yy, w: 180, max: 8, v, col: C.hero, h: 12, a: a1, k });
      text(fmtN(v, 1) + '×', xe + 12, yy + 8, { role: 'num', size: 22, weight: 750, color: C.ink, alpha: clamp(k * 1.4 - 0.3) * a1 });
    });
    glossBox(t, 6.0, LM + 600, ys, 560, 'Bending-dominated', 'A lattice that carries load by bending its walls, like a honeycomb: soft for its weight. Triangles are stretch-dominated: the load runs along them.', { size: 24 });
    sourceBox(t, 6.6, LM + 1200, ys, RM - LM - 1200, 'Ashby 2006', 'In the plane a hexagon honeycomb\'s stiffness goes with its density cubed: its walls bend. A triangulated lattice\'s goes with its density: its members stretch.', { size: 24 });
  }
});

/* ============================== 10. statically determinate triangles (#75, Brock: "talk about them being statically determinate") ==============================
   one cell each, pin-jointed: the triangle holds the push in tension and compression (07-sim.js, truss); the hexagon is
   a mechanism (the solver says mech: true) and folds with every member keeping its length (drawn by its exact folding
   motion). Then the rigid-jointed lattices: how much of the strain energy each puts into bending. The cells are drawn
   with pins on purpose: a pin is the joint that turns freely, the case the rule is about */
S({
  id: 'shlDeterminate', ch: 'shell', theme: 'night', title: 'Statically determinate triangles', settle: 10, ideas: [75], src: ['shlMaxwell', 'shlLat2d'],
  draw: t => {
    const L = shlLat(), s = 8, l = 20;
    header(t, 'Statically determinate triangles');
    captions(t, [[0.6, 'Pin the joints so they turn freely. Push a triangle and it holds: no side can move unless a member changes length.'], [4.4, 'Push a hexagon and it folds, every member the same length: a mechanism. Mold its joints solid and only their bending resists.']]);
    const x = LM, y = 280, w = 1080, h = 640;
    demoWindow(x, y, w, h, tileA(t, 0.3, 0));
    const base = y + 470, pinCol = C.ink2;
    const drawPins = pts => pts.forEach(p => { circle(p[0], p[1], 7, { fill: C.panel, color: pinCol, w: 2.2 }); });
    /* the triangle: a push on its apex, the solver's forces running in it */
    { const cx = x + 270, P = p => [cx + p[0] * s, base - p[1] * s], r = L.pinTri, kp = ep(t, 1.6, 2.4, E.io3), a = ep(t, 0.7, 1.1);
      const pts = r.model.nodes.map(P);
      G.save(); G.globalAlpha = a; G.lineCap = 'round'; G.strokeStyle = C.hero; G.lineWidth = 9; G.beginPath(); r.model.els.forEach(el => { G.moveTo(pts[el.i][0], pts[el.i][1]); G.lineTo(pts[el.j][0], pts[el.j][1]); }); G.stroke(); G.restore();
      feFlow(r, P, t, { load: kp, alpha: a, color: TH ? '#FFFFFF' : '#111111' });
      drawPins(pts); feSupport([pts[0][0], pts[0][1] + 7], 'pin', { alpha: a }); feSupport([pts[1][0], pts[1][1] + 7], 'roll', { alpha: a });
      shlPress(t, 1.6, [pts[2][0], pts[2][1] - 8], kp, { len: 60 });
      cursorAt(t, [[1.0, [cx + 160, y + 120]], [1.6, [pts[2][0] + 2, pts[2][1] - 78]]], [1.7], { a: ep(t, 0.8, 1.1) * (1 - ep(t, 3.0, 3.4)) });
      const kl = ep(t, 2.4, 2.8);
      text('Tension', (pts[0][0] + pts[1][0]) / 2, pts[0][1] + 52, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: kl });
      text('Compression', pts[1][0] - 30, (pts[1][1] + pts[2][1]) / 2 - 10, { role: 'label', size: 19, color: C.mute, alpha: kl });
      text('Triangle', cx, y + 64, { role: 'label', size: 22, color: C.heroText, align: 'center', alpha: a });
      text('3 members, 3 joints', cx, base + 110, { role: 'small', size: 25, weight: 700, color: C.ink, align: 'center', alpha: ep(t, 2.6, 3.0) });
      text('Needs 2 × 3 − 3 = 3: rigid', cx, base + 146, { role: 'small', size: 25, weight: 560, color: C.ink2, align: 'center', alpha: ep(t, 2.8, 3.2) });
      ltag(cx - ltagW('Solver', r.mech ? 'mechanism' : 'rigid', { size: 19 }) / 2, base + 186, 'Solver', r.mech ? 'mechanism' : 'rigid', { a: ep(t, 3.0, 3.4), size: 19, vcolor: C.heroText });
    }
    /* the hexagon: the same push folds it, exactly, no member changing length */
    { const cx = x + 800, th = Math.PI / 3 - ep(t, 3.8, 5.6, E.io3) * 0.42, nd = shlHexCell(l, th), P = p => [cx + p[0] * s, base - p[1] * s], pts = nd.map(P), a = ep(t, 0.9, 1.3);
      if (t > 3.8) { const g0 = shlHexCell(l, Math.PI / 3).map(P); G.save(); G.globalAlpha = a * 0.35; G.strokeStyle = C.faint; G.lineWidth = 1.5; G.setLineDash([5, 5]); G.beginPath(); g0.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.closePath(); G.stroke(); G.restore(); }
      G.save(); G.globalAlpha = a; G.lineCap = 'round'; G.lineJoin = 'round'; G.strokeStyle = C.comp; G.lineWidth = 9; G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.closePath(); G.stroke(); G.restore();
      drawPins(pts); feSupport([pts[0][0], pts[0][1] + 7], 'pin', { alpha: a }); feSupport([pts[1][0], pts[1][1] + 7], 'roll', { alpha: a });
      const top = [(pts[3][0] + pts[4][0]) / 2, pts[3][1]], kp = ep(t, 3.6, 4.0);
      shlPress(t, 3.6, [top[0], top[1] - 8], kp, { len: 60 });
      cursorAt(t, [[3.0, [cx + 170, y + 130]], [3.6, [top[0] + 2, top[1] - 78]], [5.6, [top[0] + 2, top[1] - 78]]], [3.7], { a: ep(t, 2.9, 3.2) * (1 - ep(t, 6.4, 6.8)) });
      text('Hexagon', cx, y + 64, { role: 'label', size: 22, color: C.ink2, align: 'center', alpha: a });
      text('Folds: every member keeps its length', cx, y + 104, { role: 'label', size: 19, color: C.bad, align: 'center', alpha: ep(t, 5.0, 5.4) });
      text('6 members, 6 joints', cx, base + 110, { role: 'small', size: 25, weight: 700, color: C.ink, align: 'center', alpha: ep(t, 5.2, 5.6) });
      text('Needs 2 × 6 − 3 = 9: three short', cx, base + 146, { role: 'small', size: 25, weight: 560, color: C.ink2, align: 'center', alpha: ep(t, 5.4, 5.8) });
      ltag(cx - ltagW('Solver', L.pinHex.mech ? 'mechanism' : 'rigid', { size: 19 }) / 2, base + 186, 'Solver', L.pinHex.mech ? 'mechanism' : 'rigid', { a: ep(t, 5.6, 6.0), size: 19, vcolor: C.bad });
    }
    /* right: the word, and what molded joints change */
    const rx = x + w + 40, rw = RM - rx;
    const g1 = glossBox(t, 2.8, rx, y, rw, 'Statically determinate', 'A pin-jointed frame with just the members it needs to hold its shape. In a plane that is m = 2j − 3 (Maxwell\'s rule): a triangle has 3 of 3, a hexagon 6 of the 9 it needs.', { size: 24 });
    const ty = shlG(y + g1.h + 40), thh = y + h - ty, a2 = tileA(t, 6.2, 0);
    demoWindow(rx, ty, rw, thh, a2);
    text('Molded joints: the press goes into', rx + 32, ty + 52, { role: 'label', size: 19, color: C.mute, alpha: a2 });
    [['Triangles', L.bend.tri, true], ['Hexagons', L.bend.hex, false]].forEach(([nm, v, hero], j) => {
      const yy = ty + 116 + j * 96, k = ep(t, 6.6 + j * 0.3, 7.6 + j * 0.3, E.snap);
      text(nm, rx + 32, yy, { role: 'label', size: 21, color: hero ? C.heroText : C.ink2, alpha: a2 });
      rich([{ s: fmtN(v * 100, v < 0.1 ? 1 : 0), font: 'disp', size: 48, weight: 800, color: hero ? C.heroText : C.ink, grad: hero ? C.heroGrad : null, tnum: true, count: [6.6 + j * 0.3, 1.0] }, { s: '% bending', role: 'label', size: 21, color: C.mute, gap: 10, caps: false }], rx + rw - 32, yy + 6, { t, align: 'right', alpha: a2 });
      shlBar({ x: rx + 32, y: yy + 34, w: rw - 64, max: 1, v: Math.max(0.012, v), col: hero ? C.hero : C.comp, h: 12, a: a2, k });
    });
    text('Share of the strain energy: the same lattices, grams and press as the slide before.', rx + 32, ty + thh - 40, { role: 'small', size: 22, weight: 560, color: C.faint, maxW: rw - 64, lh: 1.3, alpha: ep(t, 7.4, 7.8) });
  }
});

/* ============================== 11. triangles matter more on a light mouse (Brock: "how triangles are more helpful on a lower weight mouse") ==============================
   the same two lattices with their ribs thinned from 1.2 to 0.3 mm at the same grams, solved at six widths and drawn at
   one fixed exaggeration; a rib's bending stiffness goes with its width cubed, its stretching with its width */
function shlThinAt(L, kind, tt) {
  const S0 = L.sweep, i = Math.max(0, Math.min(S0.length - 2, S0.findIndex((q, j) => j < S0.length - 1 && tt <= q.t && tt >= S0[j + 1].t)));
  const A0 = S0[i][kind], B0 = S0[i + 1][kind], f = clamp((S0[i].t - tt) / (S0[i].t - S0[i + 1].t));
  const d = new Float64Array(A0.d.length); for (let q = 0; q < d.length; q++) d[q] = lerp(A0.d[q], B0.d[q], f);
  const sig = A0.sig.map((v, q) => lerp(v, B0.sig[q], f)), N = A0.N.map((v, q) => lerp(v, B0.N[q], f)), h = kind === 'tri' ? tt : L.hOf(tt);
  const model = Object.assign({}, A0.model, { els: A0.model.els.map(el => Object.assign({}, el, { h })) });
  const k = Math.exp(lerp(Math.log(kind === 'tri' ? S0[i].kt : S0[i].kh), Math.log(kind === 'tri' ? S0[i + 1].kt : S0[i + 1].kh), f));
  return { model, d, sig, N, L: A0.L, smax: Math.max(...sig), dmax: lerp(A0.dmax, B0.dmax, f), k, g: lerp(S0[i].g, S0[i + 1].g, f) };
}
S({
  id: 'shlThin', ch: 'shell', theme: 'paper', title: 'Triangles on a light mouse', settle: 11, ideas: [75, 5], src: ['shlLat2d', 'mitHoney', 'shlMaxwell'],
  draw: t => {
    const L = shlLat(), S0 = L.sweep, tt = lerp(1.2, 0.3, ep(t, 1.8, 7.4, E.io3)), s = 5.0, last = S0[S0.length - 1], K = shlLatK(last.hex, s, 38);
    header(t, 'Triangles on a light mouse');
    captions(t, [[0.6, 'A lighter shell means thinner ribs. A rib\'s bending stiffness falls with its width cubed, its stretching only with its width.'], [6.4, 'So the hexagons, which bend, fall away as the ribs thin. At 0.3 mm the triangles are ' + fmtN(last.kt / last.kh, 0) + '× stiffer for the same grams.']]);
    const smax = shlThinAt(L, 'hex', 0.3).smax;
    [['tri', LM, 880, 'Triangles'], ['hex', LM + 920, RM - LM - 920, 'Hexagons, the same grams']].forEach(([kind, x, w, name], i) => {
      const r = shlThinAt(L, kind, tt);
      Object.assign(r.model, { top: S0[0][kind].model.top, y1: S0[0][kind].model.y1, dir: 1 });
      shlLatTile(t, r, x, 280, w, 360, s, { i, name, k: ep(t, 0.9, 1.6), K, smax, flow: 0.7, t1: 1.2, lab: 'Stiffness', val: fmtN(r.k, 0), unit: 'N/mm', fillet: Math.max(1, 0.55 * s * (kind === 'tri' ? tt : L.hOf(tt))) });
    });
    /* the two laws on one chart, the width on screen marked */
    const cy = 680, ch = 240, cw = 1080, a2 = tileA(t, 1.4, 0), px0 = LM + 200, px1 = LM + cw - 300;
    demoWindow(LM, cy, cw, ch, a2);
    const lg = v => Math.log10(v), mX = v => px0 + (px1 - px0) * (1.2 - v) / 0.9, mY = v => cy + 186 - 116 * (lg(v) - 1) / 3;
    for (const v of [10, 100, 1000, 10000]) { line(px0, mY(v), px1, mY(v), { color: C.hair, w: 1.2, alpha: a2 }); text(v >= 1000 ? (v / 1000) + 'k' : String(v), px0 - 14, mY(v) + 7, { role: 'tick', size: 19, color: C.mute, align: 'right', alpha: a2 }); }
    for (const v of [1.2, 0.9, 0.6, 0.3]) text(fmtN(v, 1) + ' mm', mX(v), cy + 216, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: a2 });
    text('Stiffness, {N/mm}', LM + 32, cy + 44, { role: 'label', size: 19, color: C.mute, alpha: a2 });
    text('Rib width', LM + 32, cy + 216, { role: 'label', size: 19, color: C.mute, alpha: a2 });
    [['kt', true], ['kh', false]].forEach(([key, hero]) => {
      const pts = S0.map(q => [mX(q.t), mY(q[key])]), col = hero ? C.heroText : C.comp;
      poly(pts, { color: col, w: 3.5, alpha: a2, p: 1, dash: hero ? null : [8, 6] });
      S0.forEach((q, j) => circle(pts[j][0], pts[j][1], 4.5, { fill: col, alpha: a2 }));
    });
    legend(t, 1.6, LM + 300, cy + 44, [{ kind: 'line', color: C.heroText, label: 'Triangles: with width' }, { kind: 'dash', color: C.comp, label: 'Hexagons: near width cubed' }], { size: 19, gap: 28 });
    const xc = mX(tt); line(xc, cy + 64, xc, cy + 190, { color: C.ink, w: 1.5, dash: [4, 4], alpha: a2 * ep(t, 1.6, 2.0) });
    const rT = shlThinAt(L, 'tri', tt), rt = rT.k / shlThinAt(L, 'hex', tt).k, kr = a2 * ep(t, 1.8, 2.2);
    rich([{ s: fmtN(rt, rt < 10 ? 1 : 0), font: 'disp', size: 64, weight: 800, color: C.heroText, grad: C.heroGrad, tnum: true }, { s: '×', font: 'disp', size: 36, weight: 800, color: C.heroText, grad: C.heroGrad, gap: 4 }], LM + cw - 260, cy + 112, { alpha: kr });
    text('stiffer, same grams', LM + cw - 260, cy + 150, { role: 'label', size: 19, color: C.mute, alpha: kr });
    text('Ribs ' + fmtN(tt, 2) + ' mm, ' + fmtN(rT.g, 2) + ' g', LM + cw - 260, cy + 190, { role: 'num', size: 22, weight: 650, color: C.ink2, alpha: kr });
    glossBox(t, 2.4, LM + cw + 40, cy, RM - LM - cw - 40, 'Cubed against linear', 'Halve a rib\'s width and its bending stiffness drops to an eighth, its stretching stiffness only to a half. Hexagons bend; triangles stretch.', { size: 24 });
  }
});

/* ============================== 12. triangles against hexagons inside the real shell: the 3D study at equal rib mass (#75) ============================== */
S({
  id: 'shlLattice3d', ch: 'shell', theme: 'night', title: 'Triangles vs hexagons in the real shell', settle: 10, ideas: [75, 53], src: ['shlLattice'], three: ['lattice'],
  draw: t => {
    header(t, 'Triangles vs hexagons in the real shell');
    captions(t, [[0.6, 'The same shell, the same wall, the same 3.79 g of ribs: once as triangles, once as hexagons. Then 10 N on the crown.'], [5.0, 'Triangles: ' + Math.round((SHL_FE.tri.press / SHL_FE.hex.press - 1) * 100) + '% stiffer on the crown, ' + Math.round((1 - SHL_FE.tri.rib / SHL_FE.hex.rib) * 100) + '% less stress in the busiest rib, for no extra weight. The wall shares the load, so the gap is smaller than in a flat panel.']]);
    /* left: both lattices from below, the same rib mass; then the press colours them */
    { const x = LM, y = 280, w = 920, h = 480;
      demoWindow(x, y, w, h, tileA(t, 0.3, 0));
      const bx = x + 8, by = y + 64, bw = w - 16, bh = h - 72, st = { view: 'bottom', compare: 'both', stress: ep(t, 3.0, 4.2), stressCase: 'press', zoom: lerp(1.08, 1.16, ep(t, 0.5, 9, E.io3)) };
      shl3D('lattice', t, bx, by, bw, bh, st, { alpha: ep(t, 0.6, 1.2) });
      const pT = shlProj(st, [bx, by, bw, bh], [-36, 0, 0]), pH = shlProj(st, [bx, by, bw, bh], [36, 0, 0]);
      shlChip(Math.min(pT[0], x + w / 2 - 90), y + 52, 'Triangles', ep(t, 1.4, 1.8), 'center');
      text('Hexagons', Math.max(pH[0], x + w / 2 + 90), y + 52, { role: 'label', size: 21, color: C.ink2, align: 'center', alpha: ep(t, 1.6, 2.0) });
      shlRamp(t, 3.4, x + 32, y + h - 56, 200, 6, 'Stress at 10 N');
      text('From below', x + w - 32, y + h - 30, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ep(t, 0.8, 1.2) });
      glossBox(t, 2.4, x, y + h + 40, w, 'N/mm', 'Newtons per millimetre: the force it takes to push the shell in by 1 mm. At ' + Math.round(SHL_FE.tri.press) + ' N/mm, 10 N moves the crown ' + fmtN(SHL_FE.tri.defl, 0) + ' µm.', { size: 24 });
    }
    /* right: stiffness by design and load, N/mm; the busiest rib; the strip with the hexagons marked */
    { const x = LM + 960, y = 280, w = RM - x, h = 640, hy = shlCard(t, 0.5, x, y, w, h, 'Stiffness at 10 N, {N/mm}', ['derived']);
      const cols = [['press', 'Crown'], ['press_off', 'Off-centre'], ['squeeze', 'Squeezed']], nw = 240, cw = (w - 32 - nw - 32) / 3;
      const rows = [['tri', 'Triangles', '3.79 g of ribs', true], ['hex', 'Hexagons', 'Same rib mass'], ['thick', 'Plain wall', 'Same mass, no ribs'], ['none', 'Wall only', 'No ribs, 11.39 g']];
      cols.forEach(([k, l], j) => text(l, x + 32 + nw + j * cw, hy + 6, { role: 'label', size: 19, color: C.mute, alpha: ep(t, 1.0, 1.4) }));
      rows.forEach(([key, nm, sub, hero], i) => {
        const yy = hy + 58 + i * 64, a = ep(t, 1.4 + i * 0.25, 1.8 + i * 0.25);
        if (i) line(x + 32, yy - 38, x + w - 32, yy - 38, { color: C.hair, w: 1, alpha: a });
        text(nm, x + 32, yy, { role: 'small', size: 25, weight: hero ? 800 : 650, color: hero ? C.heroText : C.ink, alpha: a });
        text(sub, x + 32, yy + 26, { role: 'label', size: 19, color: C.mute, alpha: a });
        cols.forEach(([k], j) => {
          const v = SHL_FE[key][k], cx = x + 32 + nw + j * cw, kk = ep(t, 1.6 + i * 0.25 + j * 0.1, 2.4 + i * 0.25 + j * 0.1, E.snap);
          text(countUp(String(Math.round(v)), kk) || String(Math.round(v)), cx, yy - 2, { role: 'num', size: 24, weight: hero ? 800 : 650, color: hero ? C.heroText : C.ink, alpha: a });
          shlBar({ x: cx, y: yy + 18, w: cw - 30, max: 700, v, col: hero ? C.hero : key === 'none' ? C.comp2 : C.comp, h: 10, a, k: kk });
        });
      });
      const ka = ep(t, 5.4, 5.8), sy = hy + 58 + 4 * 64 - 4;
      text('Busiest rib at 10 N on the crown', x + 32, sy, { role: 'label', size: 19, color: C.ink, alpha: ka });
      rich([{ s: 'Hexagons ' + fmtN(SHL_FE.hex.rib, 1) + ' MPa', role: 'num', size: 24, weight: 650, color: C.ink2 }, { s: 'Triangles ' + fmtN(SHL_FE.tri.rib, 1) + ' MPa', role: 'num', size: 24, weight: 800, color: C.heroText, gap: 26 }, { s: '−' + Math.round((1 - SHL_FE.tri.rib / SHL_FE.hex.rib) * 100) + '%', role: 'num', size: 24, weight: 800, color: C.ink, gap: 26 }], x + 32, sy + 38, { alpha: ka });
      shellMeter(t, 6.0, 'lattice', x + 32, sy + 64, w - 64, { compact: true, ghost: SHL_HEXGHOST });
    }
  }
});

/* ---------- the old dense frame solver, kept for the arches slide (part B replaces it) and the idea sheets (12-20-shell.js) ---------- */
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

/* ============================== 13. fillets at every node (#75, Brock: "the advantages of filleting") ==============================
   the 3D close-up is the study shell's own filleted node; the stress fields are the 2D study in 09-fillet-data.js:
   one triangle lattice solved at eleven fillet radii at the same mass (the struts thin as the fillets grow), recoloured
   onto the deck's heat scale so a sharp corner's peak reads red. The meter's step is the stiffness the fillet buys at
   the same mass; the node's own peak (halved) is a local one the shell model has no corners for, so the strip's
   stress row does not take it */
const SHL_NODE = { root: [6.26, 36.02, -22.42], n: [-0.168, -0.971, 0.170], rib: [3.01, 36.43, -22.49], cam: { view: [-14.23, -7.71, -6.65], target: [3.55, 35.58, -22.34], fov: 26, zoom: 19.95 } };
shellStep({ key: 'fillet', slide: 'fillet', label: 'Fillets', flex: FILLET.ExM[0] / FILLET.ExM[7], ev: 'derived', how: '2D plane-stress triangle lattice at the same mass, fillet r 0.05 → 0.75 mm: ' + fmtN((FILLET.ExM[7] / FILLET.ExM[0] - 1) * 100, 1) + '% stiffer; the node\'s own peak halves, a local peak the shell model has no corners for' });
/** one fillet-study frame in a tile: the stress field (heat scale, red peak), the hotspot ringed, its label and peak */
function shlFilletFrame(t, t0, i, x, y, w, h, lab, o = {}) {
  const a = tileA(t, t0, 0); if (a <= 0.003) return;
  demoWindow(x, y, w, h, a);
  const iw = w - 16, ih = iw * 354 / 512, ix = x + 8, iy = y + 8, sc = iw / 512, I = shlFilletImg(i);
  G.save(); rrPath(ix, iy, iw, ih, 4); G.clip(); G.globalAlpha = a; if (I) G.drawImage(I, ix, iy, iw, ih); G.restore(); G.globalAlpha = 1;
  const hs = FILLET.hot[i], hx = ix + hs[0] * FILLET.px * sc, hyy = iy + hs[1] * FILLET.px * sc, pul = 0.5 + 0.5 * Math.sin(t * 5 + i);
  circle(hx, hyy, 9 + 3 * pul, { color: C.ink, w: 2, alpha: a * 0.9 });
  text(lab, x + 24, y + h - 48, { role: 'label', size: 19, color: C.mute, alpha: a });
  rich([{ s: 'Peak', role: 'label', size: 19, color: C.mute }, { s: fmtN(FILLET.scfM[i], 1) + '×', role: 'num', size: 26, weight: 800, color: o.bad ? C.bad : C.heroText, gap: 12 }], x + 24, y + h - 14, { alpha: a });
}
S({
  id: 'fillet', ch: 'shell', theme: 'paper', title: 'Fillets at every node', settle: 9.5, ideas: [75, 'fillet'],
  src: ['filletFE', 'shlLattice', 'beall106', 'doutre23', 'shlEnvalior'], three: ['lattice'],
  draw: t => {
    header(t, 'Fillets at every node');
    captions(t, [[0.6, 'A sharp corner in a lattice is a hotspot: the load running down a rib has to turn there, and it crowds into the corner.'], [4.0, 'Round it and the load turns gradually. At the same weight the corner\'s peak halves and the lattice gets ' + fmtN((FILLET.ExM[7] / FILLET.ExM[0] - 1) * 100, 1) + '% stiffer.'], [7.0, 'The same round corner lines up the fibres in the melt and lets the mold be milled. One fillet, three gains.']]);
    /* left: the filleted node of the study shell, close up */
    { const x = LM, y = 280, w = 840, h = 400, a0 = tileA(t, 0.3, 0);
      demoWindow(x, y, w, h, a0);
      text('A node of the study shell, about 20× closer', x + 32, y + 52, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 0.6, 1.0) });
      const bx = x + 8, by = y + 72, bw = w - 16, bh = h - 80, st = Object.assign({}, SHL_NODE.cam, { cut: 1, filletZoom: 1, yaw: 0.1 * Math.sin(t * 0.5) });
      clipped(bx, by, bw, bh, () => shl3D('lattice', t, bx, by, bw, bh, st, { alpha: ep(t, 0.5, 1.1) }));
      const nd = SHL_NODE.root.map((v, i) => v + SHL_NODE.n[i] * 1.0), rb = SHL_NODE.rib.map((v, i) => v + SHL_NODE.n[i] * 1.0);
      const P1 = shlProj(st, [bx, by, bw, bh], nd), P2 = shlProj(st, [bx, by, bw, bh], rb);
      const inBox = p => p[0] > bx + 20 && p[0] < bx + bw - 20 && p[1] > by + 20 && p[1] < by + bh - 20;
      if (inBox(P1)) callout(t, 2.0, P1, 'Three ribs meet on a 0.6 mm radius', { to: [Math.min(P1[0] + 120, bx + bw - 320), by + bh - 50], side: 'r', prose: true, color: C.hero, tcolor: '#F3F2EE', maxW: 280 });
      if (inBox(P2)) callout(t, 2.6, P2, 'Rib: 1.0 mm wide, 2.0 mm tall', { to: [Math.max(P2[0] - 110, bx + 300), P2[1] + 60], side: 'l', prose: true, color: C.hero, tcolor: '#F3F2EE', maxW: 250 });
    }
    glossBox(t, 2.8, LM, 720, 840, 'Fillet', 'A rounded inside corner: here where three ribs meet, and where each rib meets the wall. Beall: radiused corners also fill at lower pressure.', { size: 24 });
    /* right: the stress field before and after, at the same weight, and the strip */
    const rx = LM + 880, rw = RM - rx, fw = (rw - 40) / 2;
    shlFilletFrame(t, 1.0, 0, rx, 280, fw, 360, 'Near-sharp, r 0.05 mm', { bad: true });
    shlFilletFrame(t, 1.8, 7, rx + fw + 40, 280, fw, 360, 'Filleted, r 0.75 mm');
    shlRamp(t, 2.4, rx + 8, 692, 220, 'Peak, red', 'Stress, same weight');
    text('Peak: the hottest point over the panel\'s average stress.', rx + 260, 706, { role: 'small', size: 22, weight: 560, color: C.faint, maxW: rw - 268, alpha: ep(t, 2.4, 2.8) });
    shellMeter(t, 4.6, 'fillet', rx + 8, 760, rw - 16, { only: 'flex' });
  }
});

/* ============================== 14. fillet size, solved at equal mass (#75, Brock: "how the fillet size is chosen") ============================== */
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
  id: 'filletsize', ch: 'shell', theme: 'night', title: 'Fillet size, solved at equal mass', settle: 10, ideas: [75, 'fillet'],
  src: ['filletFE', 'shlEnvalior', 'beall106', 'protoWall', 'doutre23', 'shlLattice'],
  draw: t => {
    header(t, 'Fillet size, solved at equal mass');
    captions(t, [[0.6, 'Held at the same weight, a fillet trades corner stress against strut width, so the curve has a bottom.'], [4.0, 'Most of the gain comes in the first 0.6 mm. Past 1.05 mm the struts drop under the 0.89 mm floor and the peak climbs again.'], [7.4, 'So I take the small end of the bottom: 0.6 to 0.75 mm, nearly all the gain, with the widest struts.']]);
    const r = filR(t), f = filAt(r);
    /* left: the stress field at the radius on screen, and its readout */
    { const x = LM, y = 280, w = 1000, h = 640, a0 = tileA(t, 0.3, 0);
      demoWindow(x, y, w, h, a0);
      text('Stress in the lattice, pulled along its struts', x + 32, y + 52, { role: 'label', size: 21, color: C.mute, alpha: a0 });
      const sc = 1.1, ix = x + 32, iy = y + 80, iw = 512 * sc, ih = 354 * sc, ka = ep(t, 0.7, 1.4);
      const I0 = shlFilletImg(f.i), I1 = shlFilletImg(f.i + 1);
      G.save(); rrPath(ix, iy, iw, ih, 4); G.clip();
      if (I0) { G.globalAlpha = ka * (1 - f.k); G.drawImage(I0, ix, iy, iw, ih); }
      if (I1 && f.k > 0.001) { G.globalAlpha = ka * f.k; G.drawImage(I1, ix, iy, iw, ih); }
      G.restore(); G.globalAlpha = 1;
      const hs = FILLET.hot[f.k < 0.5 ? f.i : f.i + 1], hx = ix + hs[0] * FILLET.px * sc, hyy = iy + hs[1] * FILLET.px * sc, kh = ep(t, 1.6, 2.0) * ka, pul = 0.5 + 0.5 * Math.sin(t * 5);
      circle(hx, hyy, 10 + 4 * pul, { color: C.ink, w: 2, alpha: kh * 0.9 });
      const k2 = ep(t, 1.2, 1.6); line(ix, iy + ih + 28, ix + FILLET.px * sc, iy + ih + 28, { color: C.ink2, w: 2, alpha: k2 }); text('1 mm', ix + 10 + FILLET.px * sc, iy + ih + 35, { role: 'label', size: 19, color: C.mute, alpha: k2 });
      shlRamp(t, 1.2, ix + iw - 220, iy + ih + 28, 220, 'Peak, red', '');
      text('Same mass at every radius: the struts thin as the fillets grow.', x + 32, y + h - 32, { role: 'small', size: 24, weight: 560, color: C.mute, alpha: ep(t, 1.4, 1.8) });
      /* the readout */
      const ox = ix + iw + 40, kr = ep(t, 1.0, 1.5), bw0 = x + w - 32 - ox;
      const ro = (lab, yy) => text(lab, ox, yy, { role: 'label', size: 19, color: C.mute, alpha: kr });
      ro('Fillet radius', iy + 20); text(fmtN(r, 2) + ' mm', ox, iy + 72, { font: 'disp', size: 50, weight: 800, color: C.heroText, grad: C.heroGrad, alpha: kr, tnum: true });
      ro('Strut width', iy + 124); text(fmtN(f.w, 2) + ' mm', ox, iy + 166, { font: 'disp', size: 38, weight: 800, color: f.w < 0.89 ? C.bad : C.ink, alpha: kr, tnum: true });
      ro('Peak stress', iy + 218); text(fmtN(f.scf, 1) + '×', ox + bw0, iy + 218, { role: 'num', size: 24, weight: 800, color: f.scf > 12 ? C.bad : C.ink, align: 'right', alpha: kr });
      rr(ox, iy + 234, bw0, 12, 6, C.track, null, 0, kr); rr(ox, iy + 234, Math.max(12, bw0 * f.scf / 17), 12, 6, heatCol(f.scf / 16.6), null, 0, kr);
      ro('Stiffness, same mass', iy + 296); const dE = (f.E / FILLET.ExM[0] - 1) * 100; text((dE >= 0 ? '+' : '') + fmtN(dE, 1) + '%', ox, iy + 340, { font: 'disp', size: 38, weight: 800, color: dE > 0.5 ? C.ink : C.mute, alpha: kr, tnum: true });
      text('vs near-sharp', ox, iy + 372, { role: 'label', size: 19, color: C.faint, alpha: kr });
    }
    /* right: the sweep as a curve, and how the pick lines up with the resin maker's rule */
    { const x = LM + 1040, y = 280, w = RM - x, h = 360, a0 = tileA(t, 0.5, 1);
      demoWindow(x, y, w, h, a0);
      text('Peak stress against radius', x + 32, y + 52, { role: 'label', size: 21, color: C.mute, alpha: a0 });
      pill(x + w - 32 - pillW('derived'), y + 52, 'derived', a0);
      const m = axes(t, { x: x + 96, y: y + 90, w: w - 136, h: 190, xr: [0, 1.25], yr: [5, 17], xticks: [0, 0.25, 0.5, 0.75, 1.0, 1.25], yticks: [6, 10, 14], xfmt: v => v.toFixed(2), yfmt: v => v + '×', t0: 0.9 });
      const R = FILLET.rs, kz = ep(t, 3.6, 4.2);
      rect(m.X(0.6), m.Y(17), m.X(0.75) - m.X(0.6), m.Y(5) - m.Y(17), { fill: C.heroSoft, alpha: ep(t, 4.6, 5.2) });
      rect(m.X(1.05), m.Y(17), m.X(1.25) - m.X(1.05), m.Y(5) - m.Y(17), { fill: rgba(C.bad, 0.12), alpha: ep(t, 5.4, 6.0) });
      text('Pick', m.X(0.675), m.Y(17) - 10, { role: 'label', size: 19, color: C.heroText, align: 'center', alpha: ep(t, 4.6, 5.2) });
      text('Too thin', m.X(1.15), m.Y(17) - 10, { role: 'label', size: 19, color: C.bad, align: 'center', alpha: ep(t, 5.4, 6.0) });
      series(m, R.map((r2, i) => [r2, FILLET.scfW[i]]), { color: C.comp, w: 2, dash: [6, 5], p: ep(t, 2.0, 3.2, E.lin) });
      series(m, R.map((r2, i) => [r2, FILLET.scfM[i]]), { color: C.hero, w: 3, p: ep(t, 1.2, 2.6, E.lin) });
      R.forEach((r2, i) => { const k = ep(t, 1.2 + i * 0.12, 1.6 + i * 0.12); circle(m.X(r2), m.Y(FILLET.scfM[i]), 4, { fill: C.hero, alpha: k }); });
      const kp = ep(t, 2.4, 2.8); circle(m.X(r), m.Y(f.scf), 11, { color: C.ink, w: 1.5, alpha: kp * 0.5 }); circle(m.X(r), m.Y(f.scf), 5, { fill: C.ink, alpha: kp });
      legend(t, 2.6, x + 32, y + h - 26, [{ kind: 'line', color: C.hero, label: 'Same mass' }, { kind: 'dash', color: C.comp, label: 'Same struts' }], { size: 19, gap: 20 });
      text('Radius, {mm}', x + w - 32, y + h - 26, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ep(t, 1.0, 1.4) });
      void kz;
    }
    sourceBox(t, 5.6, LM + 1040, 680, RM - LM - 1040, 'Envalior', 'Inside radius 25 to 60% of the wall, the upper end for parts that carry load. Mine: 0.6 mm on the 1.0 mm top ribs, 0.75 mm on the 1.2 mm low ribs, 60% of each.', { size: 24 });
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
      const mag = 6 / R.centre[0].d, cols = [C.mute, C.ink2, C.heroText], names = ['Flat span', 'Arch', 'Triangulated arch'];
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
      callout(t, 2.2, p1, 'Rib meets the board edge, 24 ties', { to: [p1[0] + 110, by + 66], side: 'r', prose: true, color: C.hero, tcolor: C.ink, maxW: 240 });
      callout(t, 2.8, p2, 'Board, 1.0 mm FR4', { to: [p2[0] + 120, by + bh - 30], side: 'r', color: C.ink, tcolor: C.ink });
      callout(t, 3.4, p3, 'Screw boss', { to: [p3[0] - 130, by + 60], side: 'l', color: C.ink, tcolor: C.ink });
    }
    /* right top: FR4 against magnesium */
    { const x = 1080, y = LAY.top, w = RM - 1080, h = 270, hy = shlCard(t, 0.5, x, y, w, h, 'FR4 against magnesium AZ91D', ['datasheet']);
      const rows = [['Tensile strength, {MPa}', 500, [430, 430], [160, 220], '2.0–2.7× stronger'], ['Stiffness, modulus, {GPa}', 50, [18, 20], [46, 46], 'Under half as stiff']];
      rows.forEach(([nm, max, fr, mg, verdict], i) => {
        const yy = hy + 22 + i * 92, a = ep(t, 1.2 + i * 0.6, 1.6 + i * 0.6), k = ep(t, 1.3 + i * 0.6, 2.1 + i * 0.6, E.snap);
        text(nm, x + 26, yy, { role: 'label', size: 19, color: C.ink, alpha: a });
        text(verdict, x + w - 26, yy, { role: 'label', size: 19, color: i ? C.red : C.hero, align: 'right', alpha: ep(t, 2.0 + i * 0.6, 2.4 + i * 0.6) });
        const e1 = shlBar({ x: x + 100, y: yy + 26, w: w - 100 - 150, max, lo: fr[0], hi: fr[1], col: C.hero, h: 12, a, k });
        text('FR4', x + 26, yy + 33, { role: 'label', size: 19, color: C.hero, alpha: a }); text(fr[0] === fr[1] ? String(fr[0]) : fr[0] + '–' + fr[1], e1 + 10, yy + 34, { font: 'mono', size: 22, weight: 700, color: C.ink, alpha: clamp(k * 1.4 - 0.3) });
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

/* ============================== 15. a published deflection test: the shell structures that ship, and the number none of them publishes (#15, #57, #53, #55) ============================== */
const SHL_STRUCTS = [
  { id: 'finalmouse-ulx', name: 'Finalmouse ULX', how: 'Honeycomb cutouts', say: '"Flexes and creaks with pressure"', who: 'RTINGS', ev: 'measured' },
  { id: 'ninjutso-sora-v2', name: 'Ninjutso Sora V2', how: 'Solid shell', say: '"Feels solid"', who: 'RTINGS', ev: 'measured' },
  { id: 'ninjutso-sora-v3', name: 'Ninjutso Sora V3', how: 'Thin shell, endoskeleton', say: '"2x more rigid structure-wise"', who: 'Ninjutso claim', ev: 'claim' },
  { id: 'finalmouse-slx', name: 'Finalmouse Starlight X', how: 'Three-part unibody', say: '"Rigid unibody main shell"', who: 'Finalmouse, via Back2Gaming', ev: 'claim' },
  { id: 'lamzu-maya', name: 'Lamzu Maya', how: 'Front struts to the triggers', say: 'Low front propped on struts', who: 'Brock', ev: 'estimate' },
  { hero: true, name: 'Theseus', how: 'Solid, triangle lattice, board tie', say: '', who: 'Derived, 3D shell FE', ev: 'derived' }
];
S({
  id: 'shlStructs', ch: 'shell', theme: 'paper', title: 'A published deflection test', settle: 10, ideas: [15, 57, 53, 55],
  src: ['shlRtingsSoraUlx', 'shlSoraV3', 'shlB2gSlx', 'shlDoc', 'exRtings', 'shlLattice'],
  draw: t => {
    header(t, 'A published deflection test');
    captions(t, [[0.6, 'RTINGS found the Sora V2 solid and the ULX flexing and creaking. The Starlight X and the Sora V3 claim rigidity.'], [5.2, 'None of them publishes a number. I will: N/mm at five points, on the same rig, against both.']]);
    /* left: the table */
    { const x = LM, y = 280, w = 1120, h = 640, a0 = tileA(t, 0.3, 0);
      demoWindow(x, y, w, h, a0);
      const cN = x + 32, cW = x + 380, wW = 180, cS = x + 640;
      text('Mouse, structure', cN, y + 52, { role: 'label', size: 19, color: C.mute, alpha: a0 });
      text('Weight, {g}', cW, y + 52, { role: 'label', size: 19, color: C.mute, alpha: a0 });
      text('Stiff, says who', cS, y + 52, { role: 'label', size: 19, color: C.mute, alpha: a0 });
      line(x + 32, y + 70, x + w - 32, y + 70, { color: C.hair, w: 1.5, alpha: a0 });
      SHL_STRUCTS.forEach((r, i) => {
        const yy = y + 124 + i * 80, t0 = 0.9 + i * 0.3, a = ep(t, t0, t0 + 0.4), k = ep(t, t0 + 0.1, t0 + 0.9, E.snap);
        if (i) line(x + 32, yy - 44, x + w - 32, yy - 44, { color: C.hair, w: 1, alpha: a });
        const W0 = r.hero ? { g: THESEUS.mass } : exWeight(r.id) || { g: null };
        text(r.name, cN, yy - 2, { role: 'small', size: 25, weight: r.hero ? 800 : 700, color: r.hero ? C.heroText : C.ink, alpha: a });
        text(r.how, cN, yy + 26, { role: 'label', size: 19, color: C.mute, alpha: a });
        if (W0.g != null) {
          const xe = shlBar({ x: cW, y: yy - 8, w: wW, max: 50, v: W0.g, col: r.hero ? C.hero : C.comp, h: 14, a, k });
          text(fmtN(W0.g, r.hero ? 2 : 1), xe + 10, yy, { role: 'num', size: 24, weight: r.hero ? 800 : 650, color: r.hero ? C.heroText : C.ink, alpha: clamp(k * 1.4 - 0.3) });
        }
        const say = r.hero ? Math.round(SHL_FE.tri.press) + ' N/mm at the crown' : r.say;
        text(say, cS, yy - 2, { role: 'small', size: 25, weight: r.hero ? 800 : 560, color: r.hero ? C.heroText : C.ink, alpha: a, t, t0: t0 + 0.2, cps: 120 });
        text(r.who, cS, yy + 26, { role: 'label', size: 19, color: C.faint, alpha: a });
      });
      text('Published N/mm: none', x + w - 32, y + h - 32, { role: 'label', size: 21, color: C.bad, align: 'right', alpha: ep(t, 2.6, 3.0) });
      text('RTINGS weights; Theseus\'s is its target.', x + 32, y + h - 32, { role: 'small', size: 22, weight: 560, color: C.faint, alpha: ep(t, 3.0, 3.4) });
    }
    /* right: the deflection test, on the key plan, the pointer pressing each point in turn */
    { const x = LM + 1160, y = 280, w = RM - x, h = 440, a0 = tileA(t, 0.5, 1);
      demoWindow(x, y, w, h, a0);
      text('The test I\'ll publish', x + 32, y + 52, { role: 'label', size: 21, color: C.mute, alpha: a0 });
      const kx = x + w / 2, ky = y + 220, s = 1.6, S2 = s * 1.18;
      keyPlan(t, 1.0, kx, ky, { s, label: '' });
      const pts = [[0, 13, 'Crown'], [-14, -35, 'Left button'], [14, -35, 'Right button'], [-28.5, 8, 'Left side'], [28.5, 8, 'Right side']];
      const cur = t < 3 ? -1 : Math.floor((t - 3) / 1.4) % 5, ph = t < 3 ? 0 : ((t - 3) % 1.4) / 1.4;
      pts.forEach(([px, py], i) => {
        const X = kx + px * S2, Y = ky + py * S2, a = ep(t, 1.6 + i * 0.15, 2.0 + i * 0.15), on = i === cur;
        circle(X, Y, 15, { fill: on ? C.hero : C.panel, alpha: a }); circle(X, Y, 15, { color: C.ink, w: 1.8, alpha: a });
        text(String(i + 1), X, Y + 7, { role: 'num', size: 19, weight: 800, color: on ? '#FFFFFF' : C.ink, align: 'center', alpha: a });
        if (on) circle(X, Y, 15 + 22 * ph, { color: C.ink, w: 1.5, alpha: (1 - ph) * 0.6 });
      });
      if (cur >= 0) { const [px, py] = pts[cur]; cursorPtr(kx + px * S2 + 8, ky + py * S2 + 6, { a: ep(t, 2.6, 3.0), press: ph < 0.3 ? ph / 0.3 : 0 }); }
      text('10 N at each of five points' + (cur >= 0 ? ': ' + pts[cur][2].toLowerCase() : ''), x + 32, y + h - 32, { role: 'small', size: 24, weight: 600, color: C.ink2, alpha: ep(t, 3.0, 3.4) });
    }
    glossBox(t, 2.6, LM + 1160, 760, RM - LM - 1160, 'Deflection test', 'Push the shell with a known force at a marked point and measure how far it moves. Force over distance: N/mm.', { size: 24 });
  }
});

/* ============================== 16. tolerance stack-up: fewer parts, tighter gaps (#57) ============================== */
let TOL = null;
function tolSim() {
  if (TOL) return TOL;
  const r = rng(29), gauss = () => { const u = Math.max(1e-9, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); };
  const sigma = 0.05 / 3, spec = 0.05, n = 2400;
  const sets = [1, 3, 6].map(N => { const g = []; for (let i = 0; i < n; i++) { let s = 0; for (let k = 0; k < N; k++) s += gauss() * sigma; g.push(s); } const out = g.filter(v => Math.abs(v) > spec).length / n; return { N, g, out }; });
  return (TOL = { sets, sigma, spec, n });
}
S({
  id: 'tolerance', ch: 'shell', theme: 'night', title: 'Tolerance stack-up', settle: 10, ideas: [57], src: ['dfma', 'shlB2gSlx', 'xt1', 'rtingsUlx'], three: ['shell'],
  draw: t => {
    header(t, 'Tolerance stack-up');
    captions(t, [[0.6, 'Every part is a little off its drawing. One part\'s error I can measure and correct in the steel.'], [3.9, 'Stack the same seam through six parts and a fifth of the mice fall outside the gap, with every part in spec.'], [7.0, 'The Starlight X went from four shell parts to three. Mine has the rim, hump and sides as one body.']]);
    const T = tolSim();
    /* left: the parts of the shell, apart */
    { const x = LM, y = 280, w = 640, h = 440, a0 = tileA(t, 0.3, 0);
      demoWindow(x, y, w, h, a0);
      text('Theseus, taken apart', x + 32, y + 52, { role: 'label', size: 21, color: C.mute, alpha: a0 });
      const ex = t < 1.6 ? 0 : 0.8 * (0.5 - 0.5 * Math.cos((t - 1.6) * TAU / 8));
      shl3D('shell', t, x + 8, y + 70, w - 16, 250, { view: 'threeQuarter', view2d: 'right', explode: ex, zoom: in2D(1.5, 1.25), yaw: 0.1 * Math.sin(t * 0.3) }, { alpha: ep(t, 0.6, 1.2) });
      const notes = [['Starlight X', 'Three shell parts, down from four', 'claim'], ['Theseus', 'Rim, hump and sides in one body', null]];
      notes.forEach(([who, s2, ev], i) => {
        const a = ep(t, 3.2 + i * 0.8, 3.6 + i * 0.8), ny = y + 350 + i * 44;
        rich([{ s: who, role: 'label', size: 19, color: i ? C.heroText : C.ink }, { s: s2, role: 'small', size: 23, weight: 600, color: C.ink2, gap: 14 }], x + 32, ny, { alpha: a });
      });
    }
    glossBox(t, 2.8, LM, 760, 640, 'Tolerance stack', 'Every part is made slightly off. Where parts meet, their errors add up at the seam you see and feel.', { size: 24 });
    /* right: 2,400 simulated mice per build */
    { const x = LM + 680, y = 280, w = RM - x, h = 640, a0 = tileA(t, 0.5, 1);
      demoWindow(x, y, w, h, a0);
      text('2,400 simulated mice: one seam\'s gap', x + 32, y + 52, { role: 'label', size: 21, color: C.mute, alpha: a0 });
      pill(x + w - 32 - pillW('derived'), y + 52, 'derived', a0);
      text('Each part off by up to ±0.05 mm at 3σ; the seam allows ±0.05 mm.', x + 32, y + 96, { role: 'small', size: 24, weight: 560, color: C.mute, alpha: ep(t, 0.9, 1.3) });
      const fill = ep(t, 1.4, 4.4, E.lin);
      T.sets.forEach((st, ci) => {
        const ox = x + 48 + ci * 360, oy = y + 500, bw = 320, bins = 31, lo = -0.155, hi = 0.155, X = v => ox + bw * (v - lo) / (hi - lo), cnt = new Array(bins).fill(0);
        const shown = Math.floor(st.g.length * fill);
        for (let i = 0; i < shown; i++) { const b = Math.floor((st.g[i] - lo) / (hi - lo) * bins); if (b >= 0 && b < bins) cnt[b]++; }
        const cmax = T.n * 0.42, k = ep(t, 1.0 + ci * 0.2, 1.4 + ci * 0.2), inCol = ci ? C.comp : C.hero;
        rect(X(-T.spec), oy - 240, X(T.spec) - X(-T.spec), 240, { fill: inkA(0.06), alpha: k });
        for (let b = 0; b < bins; b++) { const v0 = lo + (hi - lo) * b / bins, v1 = v0 + (hi - lo) / bins, hb = Math.min(240, 240 * cnt[b] / cmax), inSpec = Math.abs((v0 + v1) / 2) <= T.spec; rect(X(v0) + 1, oy - hb, X(v1) - X(v0) - 2, hb, { fill: inSpec ? inCol : C.bad }); }
        if (t > 5) {
          const per = 0.42, j = Math.floor((t - 5) / per), ph = ((t - 5) % per) / per, v = st.g[(j * 7 + ci * 13) % st.g.length], b = Math.floor((v - lo) / (hi - lo) * bins);
          if (b >= 0 && b < bins) {
            const hb = Math.min(240, 240 * cnt[b] / cmax), xx = X(lo + (hi - lo) * (b + 0.5) / bins), y1 = oy - hb - 6, yy = lerp(oy - 240, y1, E.in3(clamp(ph / 0.7))), bad = Math.abs(v) > T.spec, la = ep(t, 5, 5.4);
            circle(xx, yy, 5, { fill: bad ? C.bad : inCol, alpha: la * (1 - clamp((ph - 0.85) / 0.15)) });
            if (ph > 0.7) circle(xx, y1, 5 + (ph - 0.7) * 40, { color: bad ? C.bad : inCol, w: 1.5, alpha: la * (1 - (ph - 0.7) / 0.3) * 0.7 });
          }
        }
        line(ox, oy, ox + bw, oy, { color: C.faint, w: 1.5, alpha: k });
        for (const v of [-0.1, 0, 0.1]) text((v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1), X(v), oy + 28, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: k });
        if (ci === 0) shlChip(ox, oy - 264, 'One part', k); else text(st.N + ' parts', ox, oy - 264, { role: 'label', size: 21, color: C.ink, alpha: k });
        const outNow = shown ? st.g.slice(0, shown).filter(v => Math.abs(v) > T.spec).length / shown : 0;
        text(fmtN(outNow * 100, 1) + '% out', ox, oy + 72, { font: 'disp', size: 30, weight: 800, color: outNow > 0.05 ? C.bad : ci ? C.ink : C.heroText, alpha: ep(t, 1.8, 2.2), tnum: true });
      });
      text('Gap error, {mm}', x + w - 32, y + h - 32, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ep(t, 1.4, 1.8) });
    }
  }
});

/* ============================== 17. the encoder, the number one failure point (#15, #98; Brock: "no dust getting in the encoder is particularly important") ==============================
   the same dust falling on a shell with cutouts and on a solid one: through the holes it reaches the encoder (drawn as
   TTC's optical encoder, the form most new ones take) and the scroll signal starts to skip; on the solid shell it stays
   outside, where it wipes off */
S({
  id: 'sealed', ch: 'shell', theme: 'paper', title: 'The encoder: the number one failure point', settle: 9.5, ideas: [15, 98], src: ['shlFmSupport', 'pulsarEnc', 'shlIgorWheel', 'shlRazerWheel', 'shlDoc'],
  draw: t => {
    header(t, 'The encoder: the number one failure point');
    captions(t, [[0.6, 'The encoder is the number one failure point in a mouse, and dust is what kills it. Every cutout is an open path to it.'], [4.4, 'A solid shell keeps dust and sweat outside, where a wipe takes them off. It molds more easily too: no small, hard-to-reach areas.']]);
    const wx = LM, wy = 280, ww = RM - LM, wh = 440;
    demoWindow(wx, wy, ww, wh, tileA(t, 0.3, 0));
    const r = rng(11), parts = []; for (let i = 0; i < 170; i++) parts.push([r(), r(), 0.6 + r() * 0.8]);
    const S2 = 14, pile = clamp((t - 2.2) / 6);
    const panel = (ox, holes, label) => {
      const w = 820, y0 = wy + 110, k = ep(t, 0.6, 1.2), hx = [], ex = ox + 260, ey = y0 + 26 + 40 + 7.9 * S2;
      if (holes) for (let x = ox + 34; x < ox + w - 40; x += 48) hx.push(x);
      /* the shell wall, cut through: with cutouts, or solid */
      part(0, 0, 1, () => { const xs = [ox].concat(hx.flatMap(h => [h, h + 22])).concat([ox + w]); for (let i = 0; i < xs.length; i += 2) { const a = xs[i], b = xs[i + 1]; solid(() => { G.beginPath(); G.rect(a, y0, b - a, 26); }, MT.shell, [a, y0, b - a, 26], { hatch: true }); } }, { alpha: k });
      /* the encoder under it, and the board it stands on (#98: a thin urethane coat on the board) */
      const E2 = part(ex, ey, S2, () => shlEncoderMM({ clog: holes ? pile : 0 }), { alpha: k });
      const by = ey + 7.6 * S2, kc = ep(t, 5.0, 5.6);
      line(ex - 9 * S2, by, ex + 9 * S2, by, { color: C.ink2, w: 3, alpha: k });
      if (!holes) { line(ex - 9 * S2, by - 3, ex + 9 * S2, by - 3, { color: C.hero, w: 2.5, alpha: kc }); text('Coated board, #98', ex + 9 * S2 + 14, by + 7, { role: 'label', size: 19, color: C.heroText, alpha: kc }); }
      text('Optical encoder', ex - 6.6 * S2 - 16, ey + 8, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: k });
      const eTop = E2.top ? E2.top[1] : ey - 7.9 * S2, eL = ex - 5.9 * S2, eR = ex + 5.9 * S2;
      /* the dust: it falls, stops on the wall unless there's a hole, and through a hole lands on the encoder */
      for (const [u, v, sp] of parts) {
        if (t < 1.6) continue;
        const tt = (t - 1.6) * sp * 0.45 + v, ph = tt % 1, cyc2 = Math.floor(tt);
        const x = ox + 20 + ((u * 7.31 + cyc2 * 0.37) % 1) * (w - 40); let y = wy + 70 + ph * 300;
        const overHole = hx.some(h2 => x > h2 + 2 && x < h2 + 20);
        if (y > y0 - 3 && !(holes && overHole)) y = y0 - 3;
        else if (y > y0 + 26) { const onEnc = x > eL && x < eR; if (!onEnc && y > y0 + 80) continue; if (onEnc) y = Math.min(y, eTop - 3); }
        const inside = y >= y0 + 26;
        circle(x, y, 2.2, { fill: inside ? C.bad : C.ink2, alpha: 0.8 * (inside && !(x > eL && x < eR) ? 1 - clamp((y - y0 - 26) / 54) : 1) });
      }
      const rp = rng(holes ? 5 : 9), n = Math.floor(pile * 46);
      for (let i = 0; i < n; i++) { const u = rp(), v2 = rp(); const px = holes ? lerp(eL + 10, eR - 10, u) : lerp(ox + 240, ox + 520, u), py = (holes ? eTop : y0) - 3 - v2 * 7 * Math.sin(u * Math.PI); circle(px, py, 2.6, { fill: holes ? C.bad : C.ink2, alpha: k * 0.9 }); }
      if (!holes && pile > 0.4) text('On the outside: wipe it off', ox + 380, y0 - 26, { role: 'label', size: 21, color: C.ink, align: 'center', alpha: ep(t, 4.6, 5.0) });
      /* the scroll signal: steps go missing as the dust gets in */
      const sx = ox + 470, sy = y0 + 110, sw2 = 320, sh2 = 44, kk = ep(t, 1.4, 1.8);
      text('Scroll signal', sx, sy - 14, { role: 'label', size: 19, color: C.mute, alpha: kk });
      rr(sx, sy, sw2, sh2 + 14, 6, inkA(0.04), null, 0, kk);
      const off = (t * 70) % 22, pts = [];
      for (let j = -1; j < sw2 / 22 + 1; j++) {
        const x0 = sx + 8 + j * 22 - off, id = Math.floor((t * 70) / 22) + j, hh = Math.abs(Math.sin(id * 12.9898) * 43758.5453) % 1, bad = holes && hh < pile * 0.42;
        const hi = sy + 10, lo = sy + sh2 + 2;
        pts.push([x0, lo], [x0, bad ? lo : hi], [x0 + 11, bad ? lo : hi], [x0 + 11, lo]);
        if (bad) { G.save(); G.beginPath(); G.rect(sx + 2, sy, sw2 - 4, sh2 + 14); G.clip(); rect(x0 - 2, sy + 4, 15, sh2 + 4, { fill: rgba(C.bad, 0.16), alpha: kk }); G.restore(); }
      }
      G.save(); G.beginPath(); G.rect(sx + 2, sy, sw2 - 4, sh2 + 14); G.clip(); poly(pts, { color: holes ? C.bad : C.ink, w: 2, alpha: kk }); G.restore();
      text(holes ? (pile > 0.15 ? 'Missed steps' : 'Clean, for now') : 'Clean', sx + sw2, sy + sh2 + 44, { role: 'label', size: 19, color: holes && pile > 0.15 ? C.bad : C.ink, align: 'right', alpha: kk });
      if (holes) text(label, ox, wy + 56, { role: 'label', size: 21, color: C.bad, t, t0: 1.0, cps: 60 });
      else shlChip(ox, wy + 56, label, ep(t, 1.0, 1.4));
    };
    panel(wx + 40, true, 'Cutouts: dust reaches the encoder');
    panel(wx + 920, false, 'Solid: dust stays outside');
    /* the evidence, under the drawing */
    /* Brock, F12.13: the number one failure point is the Finalmouse support staff's finding */
    sourceBox(t, 3.4, LM, 760, 560, 'Finalmouse support staff', 'The scroll encoder is the number one failure point in a mouse.', { size: 24 });
    sourceBox(t, 3.9, LM + 600, 760, 560, 'Pulsar support', 'Jittery or skipping scrolling comes from dust, dirt or fluids in the encoder.', { size: 24 });
    glossBox(t, 4.4, LM + 1200, 760, RM - LM - 1200, 'Optical encoder', 'Reads the wheel by light through a slotted disc. Razer claims 3.3× a mechanical one\'s reliability.', { size: 24 });
  }
});

/* ============================== 18. the lattice frees grams for the cell (#15, #31, #93; Brock: "we will be able to cut weight elsewhere with my shell design to hit that 200hr") ==============================
   to be as stiff on the crown as the lattice, a plain wall of the same shape needs 20.4 g (along its own solved law);
   the lattice body is 15.2 g. The difference goes to the cell */
S({
  id: 'shlGrams', ch: 'shell', theme: 'night', title: 'The lattice frees grams for the cell', settle: 10, ideas: [15, 31, 93],
  src: ['shlLattice', 'shlZkM1k', 'shlB2gSlx', 'shlDoc'],
  draw: t => {
    const freed = SHL_FE.match - SHL_FE.g.body;
    header(t, 'The lattice frees grams for the cell');
    captions(t, [[0.6, 'To be as stiff on the crown as my lattice, a plain wall of the same shape needs ' + fmtN(SHL_FE.match, 1) + ' g. The lattice body is ' + fmtN(SHL_FE.g.body, 1) + ' g.'], [5.0, 'Those ' + fmtN(freed, 1) + ' g go where they buy the most: into the cell, for ' + THS.hours + ' at 1 kHz.']]);
    const x = LM, y = 280, w = 1080, h = 640, a0 = tileA(t, 0.3, 0);
    demoWindow(x, y, w, h, a0);
    text('Shell body, the same crown stiffness, {g}', x + 32, y + 52, { role: 'label', size: 21, color: C.mute, alpha: a0 });
    pill(x + w - 32 - pillW('derived'), y + 52, 'derived', a0);
    const bx = x + 32, bw = w - 64 - 120, max = 22, X = g => bx + bw * g / max, a1 = ep(t, 0.8, 1.2);
    for (const g of [0, 5, 10, 15, 20]) { line(X(g), y + 110, X(g), y + 380, { color: C.hair, w: 1.2, alpha: a1 }); text(String(g), X(g), y + 100, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: a1 }); }
    /* the plain wall that would match, and the lattice */
    const kP = ep(t, 1.2, 2.2, E.snap), kL = ep(t, 2.2, 3.2, E.snap), bh = 40;
    text('A plain wall, as stiff', bx, y + 170, { role: 'label', size: 19, color: C.ink2, alpha: a1 });
    rr(X(0), y + 186, Math.max(bh, (X(SHL_FE.match) - X(0)) * kP), bh, 6, C.comp, null, 0, a1);
    text(fmtN(SHL_FE.match, 1), X(SHL_FE.match * kP) + 14, y + 216, { role: 'num', size: 26, weight: 700, color: C.ink, alpha: clamp(kP * 1.4 - 0.3) });
    text('The triangle lattice', bx, y + 290, { role: 'label', size: 19, color: C.heroText, alpha: a1 });
    const xw = X(0) + (X(SHL_FE.g.wall) - X(0)) * kL, xr = xw + (X(SHL_FE.g.body) - X(SHL_FE.g.wall)) * kL;
    rr(X(0), y + 306, Math.max(bh, xr - X(0)), bh, 6, C.hero, null, 0, a1);
    if (kL > 0.6) { line(xw, y + 306, xw, y + 306 + bh, { color: C.bg, w: 3, alpha: a1 }); text('Wall ' + fmtN(SHL_FE.g.wall, 1), X(0) + 16, y + 333, { role: 'label', size: 19, color: '#FFFFFF', alpha: ep(t, 3.0, 3.4) }); text('Ribs ' + fmtN(SHL_FE.g.ribs, 1), xw + 12, y + 333, { role: 'label', size: 19, color: '#FFFFFF', alpha: ep(t, 3.0, 3.4) }); }
    text(fmtN(SHL_FE.g.body, 1), xr + 14, y + 336, { role: 'num', size: 26, weight: 800, color: C.heroText, alpha: clamp(kL * 1.4 - 0.3) });
    /* the freed grams: a bracket, then five gram blocks that travel down into the cell */
    const kb = ep(t, 3.6, 4.2), gx0 = X(SHL_FE.g.body), gx1 = X(SHL_FE.match), gy = y + 410;
    if (kb > 0) {
      line(gx0, gy, gx0 + (gx1 - gx0) * kb, gy, { color: C.heroText, w: 2.5 }); line(gx0, gy - 8, gx0, gy + 8, { color: C.heroText, w: 2.5, alpha: kb }); line(gx1, gy - 8, gx1, gy + 8, { color: C.heroText, w: 2.5, alpha: kb });
      rich([{ s: fmtN(freed, 1), font: 'disp', size: 44, weight: 800, color: C.heroText, grad: C.heroGrad, tnum: true, count: [3.8, 0.9] }, { s: 'g freed', role: 'label', size: 21, color: C.mute, gap: 10, caps: false }], (gx0 + gx1) / 2, gy + 56, { align: 'center', t, alpha: kb });
    }
    const cx = x + 220, cy = y + 520, cw = 300, chh = 70, kc = ep(t, 4.6, 5.0);
    if (kc > 0) {
      rr(cx, cy, cw, chh, 8, null, C.ink2, 2, kc); rr(cx + cw, cy + 22, 10, 26, 3, C.ink2, null, 0, kc);
      const fillK = ep(t, 5.2, 7.6, E.io3); rr(cx + 6, cy + 6, Math.max(12, (cw - 12) * (0.62 + 0.38 * fillK)), chh - 12, 5, C.hero, null, 0, kc);
      text('The cell', cx - 20, cy + 44, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: kc });
      rich([{ s: String(THESEUS.hours), font: 'disp', size: 44, weight: 800, color: C.heroText, grad: C.heroGrad, tnum: true }, { s: 'h at 1 kHz', role: 'label', size: 21, color: C.mute, gap: 10, caps: false }], cx + cw + 40, cy + 52, { alpha: ep(t, 6.6, 7.0) });
      for (let i = 0; i < 5; i++) { const kk = ep(t, 5.0 + i * 0.32, 5.9 + i * 0.32, E.io3); if (kk <= 0 || kk >= 1) continue; const sx = lerp(gx0 + (gx1 - gx0) * (i + 0.5) / 5, cx + cw * (0.66 + i * 0.06), kk), sy = lerp(gy + 4, cy + 20, kk) - Math.sin(kk * Math.PI) * 60; rr(sx - 9, sy - 9, 18, 18, 3, C.hero, null, 0, 1 - kk * 0.3); }
    }
    text('3D shell FE, 10 N on the crown; the plain wall\'s mass follows its own solved law past 15.2 g. Body only; the triggers are the same in both.', x + 32, y + h - 32, { role: 'small', size: 22, weight: 560, color: C.faint, maxW: w - 64, alpha: ep(t, 2.4, 2.8) });
    /* right: more grams to find, each its own idea */
    const rx = x + w + 40, rw = RM - rx, a2 = tileA(t, 1.0, 1);
    demoWindow(rx, y, rw, 440, a2);
    text('More grams the shell gives back', rx + 32, y + 52, { role: 'label', size: 21, color: C.mute, alpha: a2 });
    [['A base you can leave off', '#31', 'Zaunkoenig\'s M1K bases weigh 5.7 g, 4.1 g in the light build.'], ['A lighter resin', '#5', 'At the SLX\'s 0.9 g/cm³ this body is ' + fmtN(SHL_FE.g.body * (1 - 0.9 / 1.01), 1) + ' g lighter.'], ['Wall where the load is', '#93', 'Thick low on the sides, thin where the FE runs cool.']].forEach(([h2, tg, b], i) => {
      const yy = y + 116 + i * 112, a = a2 * ep(t, 2.0 + i * 0.5, 2.4 + i * 0.5);
      rich([{ s: h2, role: 'label', size: 21, color: C.ink }, { s: tg, role: 'label', size: 19, color: C.mute, gap: 14 }], rx + 32, yy, { alpha: a });
      text(b, rx + 32, yy + 34, { role: 'small', size: 24, weight: 560, color: C.ink2, maxW: rw - 64, lh: 1.3, alpha: a });
    });
    sourceBox(t, 3.0, rx, y + 480, rw, 'Zaunkoenig 2020', 'M1K: carbon fibre shell 7.5 g; printed bottom shell 5.6 to 5.9 g, 4.0 to 4.2 g in the light build.', { size: 24 });
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
      line(pc[0], pc[1] - 14, pc[0], gy - 34 * s - 18, { color: C.hero, w: 2, alpha: ep(t, 1.2, 1.6) });
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
  id: 'grind', ch: 'shell', theme: 'night', title: 'Poron pads, not grease', settle: 9, ideas: [97, 96], src: ['poron4701', 'shlDoc'],
  draw: t => {
    header(t, 'Poron pads, not grease');
    captions(t, [[0.6, 'A separate bottom rim is easier to service, and every place two hard parts touch can grind.'], [3.2, 'Newer ULX batches are greased with Krytox. Grease quiets the rub for a while; the contact stays, so the noise comes back.'], [6.0, 'A thin Poron pad at the contact ends the rub for good, for about half a gram.']]);
    const wx = LM, wy = LAY.top, ww = RM - LM, wh = 580;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const cases = [[wx + 300, 'Plastic on plastic', 'The rim rubs the shell and squeaks', 1, 0, 'stick'], [wx + 870, 'Krytox grease in the groove', 'Quiet until it wears or collects dust', 0.25, 0, 'wear'], [wx + 1440, 'A thin Poron pad at the contact', 'A soft stop: nothing rubs, about 0.5 g', 0, 1, 'none']];
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
      poly(pts, { color: mode === 'none' ? C.hero : mode === 'wear' ? C.mute : C.bad, w: 1.8, alpha: k });
      if (mode === 'wear') text('Louder as it wears', mx + mw, my - 10, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: k * ep(t, t0 + 3, t0 + 3.4) });
      text(l2, cx, wy + 516, { role: 'small', size: 25, color: C.mute, align: 'center', t, t0: t0 + 0.4, cps: 90, maxW: 460 });
    });
    text('The rim slides into the top shell (#97). Noise traces drawn to show the pattern.', wx + 26, wy + wh - 22, { role: 'small', size: 25, color: C.faint, alpha: ep(t, 2.4, 2.8) });
    gloss(t, 2.6, 'Poron', 'A microcellular urethane foam for gaskets, a third as dense as the shell. A thin layer stops hard parts rubbing.');
    featureCard(t, 3.6, 'A slide-in rim with a pad', ['proposal'], 'Grease only hides the rub (#96). A foam pad removes it, with the rim slid in (#97).');
  }
});
