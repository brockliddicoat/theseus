/* ============================== B05: Shell I, materials and strength (revamp v2, 2026-11-06) ==============================
   Ten slides that open the shell chapter on its compromise (lighter shells flex, creak and crack) and answer it with the
   material, then with where the material goes:
     b05_card      the chapter card: the compromise, the ledger, the chapter's ideas
     b05_material  ABS against PP-C-20A on a flat strip cut from the wall, a hand's press, the strips' weights
     b05_specific  six materials at one weight, pressed until they give: what each buys per gram (the bridge contest)
     b05_wall      the melt freezing short in a wall too thin: at the same weight the lighter resin gets the thicker wall
     b05_cubed     the ruler flat and on edge; the mold's tolerance on a thin wall and a thicker one, cubed
     b05_fallacy   heavier is not stronger: the GPX 2 against the ULX Competition, and a plain wall's trade-off
     b05_nopick    you don't have to pick: the same strength at 46 % less weight, Theseus's own line
     b05_hotspot   a solid plane's hot spot cracks; a milled-out part of less weight holds
     b05_margin    the peak decides the break: paper tears at a nick; the margin left on each part
     b05_work      putting that weight to work: 18, 25, 90 %, and the design choices it drives
   Every number comes from a source named in SRC or from a model solved in the page (07-sim.js, labelled Derived).
   The shell meter that ran through the old chapter is gone (Brock on shlShell3d: "cut the strength graphs that last
   multiple slides, they were a bad idea"). Helpers are b05_*. */

Object.assign(SRC, {
  b05Tpu: { t: 'TechPowerUp, Logitech G Pro X Superlight 2 review (2023), build quality: "When applying lateral pressure, some creaking but no flexing of the shell can be observed."', u: 'https://techpowerup.com/review/logitech-g-pro-x-superlight-2/4.html' },
  b05TpuUlx: { t: 'TechPowerUp, Finalmouse UltralightX review (the first batches), build quality: under lateral pressure "minor creaking and significant flexing of the shell can be observed"', u: 'https://techpowerup.com/review/finalmouse-ultralightx/4.html' },
  b05Peri: { t: 'Periview, Finalmouse ULX Competition review: "The sides are solid, which feels like a significant improvement over the more flexible, creaky bodies of previous models"; "The overall construction feels sturdier, with less flex"', u: 'https://periview.gg/?p=3024' },
  b05Fm: { t: 'Finalmouse, ULX Competition product page: "The strength to weight ratio of our unique carbon fiber composite is over three times better than ABS", "a third better than magnesium"; the main cage "now features solid sides" (maker claims)', u: 'https://finalmouse.com/products/ulx-competition-overview' },
  b05Razer: { t: 'Razer newsroom, 2023-02-02, Viper Mini Signature Edition: magnesium alloy chosen for its strength-to-weight properties; an "injection-molded exoskeleton that is then CNC machined"; 49 g (maker claims)', u: 'https://www.razer.com/newsroom/product-news/razer-unveils-the-viper-mini-signature-edition-a-magnesium-alloy-gaming-masterpiece' },
  b05Johnson: { t: 'Johnson, Hagberg, Wigaeus Hjelm & Rempel 2000, Measuring and characterizing force exposures during computer mouse use, Scand J Work Environ Health 26(5):398-405: mean force on the sides 0.43 N (0.6 % of the maximum voluntary force), on the button 0.35 N (0.8 %). Derived here: the hardest side squeeze is about 0.43 / 0.006 = 72 N', u: 'https://www.sjweh.fi/article/560' },
  b05Bates: { t: 'Bates & Dean 2024, A total rip-off: crack propagation in paper, Physics Education 59 035010: 25 mm strips of 70 gsm printer paper need 95 N uncut; students pulled 25 to 35 N; "All students easily broke the paper with a 5 mm cut ... none were able to break a 3 mm cut"; a 5 mm edge crack predicts 33 N, though 80 % of the area is left', u: 'https://eprints.whiterose.ac.uk/210831/1/Bates_2024_Phys._Educ._59_035010.pdf' },
  b05SciOly: { t: 'Science Olympiad, New Mexico state Bridges rules (2021-22): "Score of a team = (Load score in grams)/(Mass of the structure in grams)"', u: 'https://www.nmt.edu/stem/olympiad/2021-2022%20Bridges.pdf' },
  b05Mit: { t: 'MIT 2.008 Design and Manufacturing II (S. Kim, 2004), polymer processing: solidification time grows with the wall thickness squared over the diffusivity; a short shot is when "the molten plastics becomes solid before it flows to the end of the mold"; flow path ratio L/T: PP 280 to 150, ABS 280 to 120, PC 160 to 90', u: 'https://ocw.mit.edu/courses/2-008-design-and-manufacturing-ii-spring-2004/4affb4ea315d9aaf3b38353bede9b660_05polymer_2_6f1.pdf' },
  b05ProtoTol: { t: 'Protolabs, Understanding Injection Molding Tolerances (2023-02-07): mold machining tolerance ±0.003 in (0.076 mm), resin tolerance no less than ±0.002 in/in', u: 'https://www.protolabs.com/resources/blog/injection-molding-tolerances/' },
  b05Ji: { t: 'Ji, Bell & Ellis, Understanding and Using Structural Concepts (2nd ed., CRC Press, 2016), and Ji\'s University of Manchester (UMIST) teaching notes: a 1-metre wood ruler with a weight on its free end, "turned 90 degrees ... significantly smaller displacement"', u: 'https://personalpages.manchester.ac.uk/staff/tianjian.ji/teaching/ucasdis.pdf' },
  b05Ucsb: { t: 'UC Santa Barbara lecture demonstration 32.30, bending wood beams: stiffness goes with the cube of the thickness (boards 8.3 and 14.6 mm thick)', u: 'https://web.physics.ucsb.edu/~lecturedemonstrations/Composer/Pages/32.30.html' },
  b05Strip: { t: 'This deck: beam theory for a strip on two supports pressed in the middle, sag = P L³ / (48 E I), stress = P L t / (8 I); a 60 mm span, a 10 mm wide strip; moduli and strengths from the datasheets named (PP-C-20A and FR4 at break, ABS and PC at yield, the metals at their ultimate strength)', n: 'derived, beam theory' },
  b05Fill: { t: 'This deck: how far the melt gets before its frozen skin closes the wall, reach ∝ (thickness ÷ floor)², the freeze time growing with thickness squared (MIT 2.008), set so each material just fills a shell at its own floor (Protolabs, Design News)', n: 'derived, this model' }
});

/* ---------- the materials (datasheets in 10-d-shell.js's SRC: shlPyrofil, shlAbs, shlPc, shlMg, shlAl, shlFr4) ----------
   E: flexural modulus for the plastics and FR4 (lengthwise), elastic modulus for the metals (MPa); s: the stress it gives at
   (MPa): PP-C-20A and FR4 at break, ABS and PC at yield, the metals at their ultimate tensile strength (their yield is lower:
   the ultimate is the generous figure, G5); rho in g/cm³. Brock, F12.12: the shell counts as broken at 120 MPa. */
const B05_MAT = {
  pp: { key: 'pp', name: 'PP-C-20A', long: 'Carbon PP, PP-C-20A', E: 13500, s: 120, rho: 1.01, src: 'shlPyrofil', hero: true },
  abs: { key: 'abs', name: 'ABS', long: 'ABS', E: 2550, s: 50, rho: 1.05, src: 'shlAbs' },
  pc: { key: 'pc', name: 'PC', long: 'Polycarbonate', E: 2350, s: 65, rho: 1.20, src: 'shlPc' },
  mg: { key: 'mg', name: 'Magnesium', long: 'Magnesium AZ91D', E: 44800, s: 230, rho: 1.81, src: 'shlMg', metal: true },
  al: { key: 'al', name: 'Aluminium', long: 'Aluminium 6061', E: 68900, s: 310, rho: 2.70, src: 'shlAl', metal: true },
  fr4: { key: 'fr4', name: 'FR4', long: 'FR4 (the board)', E: 20000, s: 430, rho: 1.85, src: 'shlFr4', board: true }
};
/* the test strip: a 60 mm span, 10 mm wide, on two supports, pressed in the middle */
const B05_STRIP = { L: 60, b: 10 };
/** beam theory, a strip t mm thick of modulus E (MPa): the sag in the middle under P newtons (mm) */
const b05_sag = (P, E, t) => P * B05_STRIP.L ** 3 / (48 * E * B05_STRIP.b * t ** 3 / 12);
/** the press (N) at which the outer fibre reaches s (MPa) */
const b05_gives = (s, t) => 4 * s * (B05_STRIP.b * t * t / 6) / B05_STRIP.L;
/** a strip's weight (g) */
const b05_weight = (rho, t) => rho * B05_STRIP.L * B05_STRIP.b * t / 1000;
/** the thickness (mm) that makes a strip of density rho weigh g grams */
const b05_thickFor = (rho, g) => g * 1000 / (rho * B05_STRIP.L * B05_STRIP.b);
/** the stress in the middle (MPa) at press P */
const b05_stress = (P, t) => P * B05_STRIP.L / 4 * (t / 2) / (B05_STRIP.b * t ** 3 / 12);
/* human scale (Johnson 2000; Brock's 70 gf switches): said on every slide that has a force (Brock on materials: "scale the
   force to what a mouse would experience from a hand and note that, do that more throughout the presentation") */
const B05_HAND = { click: 0.35, sw: 0.69, grip: 0.43, squeeze: 72, press: 2 };

/* ---------- b05_material: the 1 mm strip (a mouse wall's thickness), 2 N ---------- */
const B05_M = (() => {
  const a = B05_MAT.abs, p = B05_MAT.pp, t = 1.0, P = B05_HAND.press;
  const tMatch = t * Math.cbrt(a.E / p.E);
  return {
    t, P, sagA: b05_sag(P, a.E, t), sagP: b05_sag(P, p.E, t), gA: b05_weight(a.rho, t), gP: b05_weight(p.rho, t),
    givesA: b05_gives(a.s, t), givesP: b05_gives(p.s, t), kE: p.E / a.E, kS: p.s / a.s,
    tMatch, gMatch: b05_weight(p.rho, tMatch)
  };
})();

/* ---------- b05_specific: six strips at one weight (the 1 mm PP strip's: 0.606 g, 10.1 g per 100 cm² of wall) ---------- */
const B05_SP = (() => {
  const g0 = b05_weight(B05_MAT.pp.rho, 1.0), keys = ['fr4', 'al', 'mg', 'pp', 'pc', 'abs'];
  const rows = keys.map(k => { const m = B05_MAT[k], t = b05_thickFor(m.rho, g0); return { k, m, t, sag: b05_sag(B05_HAND.press, m.E, t), holds: b05_gives(m.s, t) }; });
  const rank = (f, desc) => { const o = rows.map((r, i) => [f(r), i]).sort((p, q) => desc ? q[0] - p[0] : p[0] - q[0]), out = []; o.forEach(([, i], j) => { out[i] = j; }); return out; };
  return {
    g0, rows,
    rawS: rank(r => r.m.s, true), rawE: rank(r => r.m.E, true),          /* the datasheet's order */
    stiff: rank(r => r.sag, false), strong: rank(r => r.holds, true),     /* at the same weight */
    sagMax: Math.max(...rows.map(r => r.sag)), holdMax: Math.max(...rows.map(r => r.holds))
  };
})();

/* ---------- b05_wall: the same weight per area of wall (10 g per 100 cm²) in carbon PP and in magnesium ---------- */
const B05_W = (() => {
  const gpa = 10, wall = rho => gpa / (rho * 100) * 10;      /* mm: g per 100 cm² ÷ (g/cm³ × 100 cm²) × 10 mm/cm */
  const pp = { m: B05_MAT.pp, t: wall(B05_MAT.pp.rho), floor: 0.889, floorBy: 'Protolabs' };
  const mg = { m: B05_MAT.mg, t: wall(B05_MAT.mg.rho), floor: 0.70, floorBy: 'Design News', small: 0.5 };
  for (const w of [pp, mg]) w.reach = Math.min(1, Math.pow(w.t / w.floor, 2));       /* b05Fill: reach ∝ (t / floor)² */
  mg.atFloor = B05_MAT.mg.rho * mg.floor * 100 / 10;                                  /* g per 100 cm² at its floor */
  return { gpa, pp, mg, kT: pp.t / mg.t, mgMore: mg.atFloor / gpa - 1 };
})();

/* ---------- b05_cubed: the mold's ±0.076 mm (Protolabs) on a thin wall and a thicker one ---------- */
const B05_C = (() => {
  const tol = 0.076, swing = t => ({ t, lo: Math.pow(1 - tol / t, 3) - 1, hi: Math.pow(1 + tol / t, 3) - 1 });
  const thin = swing(0.70), ths = swing(1.00);
  /* nine molds in a row, each cut a fixed amount off inside the tolerance (the two ends of it included), in an order that
     reads as a production line rather than a sorted list; the same offsets for both rows (the same molds, the same cuts) */
  const offs = [-0.35, 0.72, -1, 0.18, 0.93, -0.62, 0.41, 1, -0.08].map(f => f * tol);
  const ruler = { b: 30, h: 2 }, rulerK = (ruler.h * ruler.b ** 3) / (ruler.b * ruler.h ** 3);
  return { tol, thin, ths, offs, ruler, rulerK, span: w => w.hi - w.lo, k: (thin.hi - thin.lo) / (ths.hi - ths.lo) };
})();

/* ============================== drawing helpers (stage px unless said) ============================== */
/** the material's colour on a drawing: Theseus's resin blue, everything else the ground's greys (FR4 a warmer grey: it is
   Theseus's board, named so in words, never blue on a shell slide) */
function b05_col(k, o = {}) { const m = B05_MAT[k]; return m && m.hero ? C.hero : k === 'fr4' ? (TH ? '#9C9A8F' : '#77766E') : o.second ? C.second : C.comp; }
/**
 * A test strip on two supports, pressed in the middle, seen from the side. (x0, y0): the left support's contact point (the
 * strip's underside at rest); s: px per mm along the span; ts: px per mm through the thickness (default s: to scale);
 * t: thickness (mm); d: the sag in the middle (mm, drawn at s × o.mag, mag 1 = to scale).
 * o = { fill, edge, alpha, over (mm past each support, 6), kink (0..1: a metal that has yielded keeps a sharper, permanent
 *   bend), crack (0..1: a crack up from the underside at the middle, for the brittle ones), heat (0..1: how near the middle
 *   is to giving: a warm patch grows there, never red unless o.bad), bad, supports (true), sa (the supports' alpha) }.
 * Returns { top: the top of the middle [x, y], bot: its underside, L: the span in px }
 */
function b05_strip(x0, y0, s, t, d, o = {}) {
  const L = B05_STRIP.L, over = o.over == null ? 6 : o.over, mag = o.mag || 1, ts = o.ts || s, a = o.alpha == null ? 1 : o.alpha;
  const kk = clamp(o.kink || 0), u0 = -over / L, u1 = 1 + over / L;
  const vEl = u => { const q = u <= 0.5 ? u : 1 - u; return q < 0 ? 3 * q : 3 * q - 4 * q * q * q; };
  const vK = u => { const q = u <= 0.5 ? u : 1 - u; return q < 0 ? 2 * q : 2 * q; };
  const v = u => d * lerp(vEl(u), vK(u), kk);
  const N = 72, top = [], bot = [];
  for (let i = 0; i <= N; i++) { const u = lerp(u0, u1, i / N), X = x0 + u * L * s, Y = y0 + v(u) * s * mag; bot.push([X, Y]); top.push([X, Y - t * ts]); }
  const mid = [x0 + L * s / 2, y0 + d * s * mag];
  if (a <= 0.003) return { top: [mid[0], mid[1] - t * ts], bot: mid, L: L * s };
  G.save(); G.globalAlpha = a;
  const path = () => { G.beginPath(); top.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); for (let i = bot.length - 1; i >= 0; i--) G.lineTo(bot[i][0], bot[i][1]); G.closePath(); };
  path(); G.fillStyle = o.fill || C.comp; G.fill();
  /* the warm patch at the middle as the stress there nears the material's limit */
  if (o.heat > 0.02) {
    G.save(); path(); G.clip();
    const hk = clamp(o.heat), col = o.bad ? C.red : heatCol(Math.min(0.72, hk)), rw = L * s * (0.12 + 0.2 * hk);
    const g = G.createRadialGradient(mid[0], mid[1], 0, mid[0], mid[1], rw); g.addColorStop(0, rgba(col, 0.92 * Math.pow(hk, 1.5))); g.addColorStop(1, rgba(col, 0));
    G.fillStyle = g; G.fillRect(mid[0] - rw, mid[1] - rw, rw * 2, rw * 2); G.restore();
  }
  path(); G.strokeStyle = o.edge || (TH ? 'rgba(17,17,17,0.55)' : 'rgba(243,242,238,0.5)'); G.lineWidth = 1.2; G.lineJoin = 'round'; G.stroke();
  if (o.crack > 0) {
    const r0 = rng(13), n = 7, h = t * ts * clamp(o.crack) * 1.05; G.beginPath(); G.moveTo(mid[0], mid[1]);
    for (let i = 1; i <= n; i++) G.lineTo(mid[0] + (r0() - 0.5) * Math.max(3, t * ts * 0.35), mid[1] - h * i / n);
    G.strokeStyle = o.bad === false ? C.ink : C.red; G.lineWidth = 2.4; G.stroke();
  }
  G.restore();
  if (o.supports !== false) { const sa = (o.sa == null ? 1 : o.sa) * a; feSupport([x0, y0], 'pin', { alpha: sa }); feSupport([x0 + L * s, y0], 'roll', { alpha: sa }); }
  return { top: [mid[0], mid[1] - t * ts], bot: mid, L: L * s };
}
/**
 * A beam balance: the pivot at (x, y) on a post, an arm of half-length r, two pans hung at depth hang. The beam tips toward
 * the heavier side, swinging in on a damped spring from t0 the way a real balance settles (M2). o = { m1, m2 (left and right,
 * any unit), m0 (the difference that tips it fully; default the larger), max (0.15 rad), t, t0, alpha, panW (px),
 * draw1(x, y), draw2(x, y): what sits in each pan (called with the pan's top centre), base (the post's foot y) }.
 * Returns { p1, p2 (the pans' top centres), ang }
 */
function b05_balance(x, y, r, hang, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha, m1 = o.m1 || 0, m2 = o.m2 || 0, m0 = o.m0 || Math.max(m1, m2, 1e-6), mx = o.max == null ? 0.15 : o.max;
  const target = clamp((m1 - m2) / m0, -1, 1) * mx, ang = o.t0 == null ? target : target * spring(o.t, o.t0, { f: 0.9, z: 0.32 });
  const ca = Math.cos(ang), sa = Math.sin(ang), e1 = [x - r * ca, y + r * sa], e2 = [x + r * ca, y - r * sa], pw = o.panW || 220;
  const p1 = [e1[0], e1[1] + hang], p2 = [e2[0], e2[1] + hang], ink = TH ? '#2E2E2C' : '#CFCEC9', base = o.base == null ? y + hang + 90 : o.base;
  if (a <= 0.003) return { p1, p2, ang };
  G.save(); G.globalAlpha = a; G.lineCap = 'round'; G.lineJoin = 'round';
  /* the post and its foot */
  G.strokeStyle = ink; G.lineWidth = 6; G.beginPath(); G.moveTo(x, y + 6); G.lineTo(x, base); G.stroke();
  G.lineWidth = 5; G.beginPath(); G.moveTo(x - 70, base); G.lineTo(x + 70, base); G.stroke();
  /* the arm, a slim lozenge, and the pivot */
  G.fillStyle = ink; G.beginPath(); G.moveTo(e1[0], e1[1]); G.lineTo(x - 10 * sa, y - 9 * ca); G.lineTo(e2[0], e2[1]); G.lineTo(x + 10 * sa, y + 9 * ca); G.closePath(); G.fill();
  circle(x, y, 9, { fill: C.bg, color: ink, w: 3 });
  /* the hangers and pans: each hangs plumb from its end, whatever the arm does */
  for (const [e, p] of [[e1, p1], [e2, p2]]) {
    G.strokeStyle = ink; G.lineWidth = 1.6; G.beginPath(); G.moveTo(e[0], e[1]); G.lineTo(p[0] - pw * 0.42, p[1]); G.moveTo(e[0], e[1]); G.lineTo(p[0] + pw * 0.42, p[1]); G.stroke();
    G.lineWidth = 5; G.beginPath(); G.moveTo(p[0] - pw / 2, p[1]); G.quadraticCurveTo(p[0], p[1] + 16, p[0] + pw / 2, p[1]); G.stroke();
    circle(e[0], e[1], 4.5, { fill: ink });
  }
  G.restore();
  if (o.draw1) o.draw1(p1[0], p1[1]); if (o.draw2) o.draw2(p2[0], p2[1]);
  return { p1, p2, ang };
}
/** a plain rival mouse's side outline, generic on purpose (a rounded hump, not any maker's shape: it stands for a named
   rival whose own outline the slide doesn't need), bottom centre at (x, y), length len px. o = { fill, edge, alpha, h (0.31 of
   len) } */
function b05_rivalSide(x, y, len, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; if (a <= 0.003) return;
  const h = len * (o.h || 0.31), l2 = len / 2;
  G.save(); G.globalAlpha = a; G.beginPath(); G.moveTo(x - l2, y);
  G.bezierCurveTo(x - l2 - 4, y - h * 0.55, x - l2 * 0.55, y - h * 1.02, x - l2 * 0.05, y - h);
  G.bezierCurveTo(x + l2 * 0.5, y - h * 0.98, x + l2 * 0.92, y - h * 0.58, x + l2 + 3, y - h * 0.2);
  G.quadraticCurveTo(x + l2 + 5, y, x + l2 - 6, y); G.closePath();
  G.fillStyle = o.fill || (TH ? '#FFFFFF' : '#1A1B1E'); G.fill(); G.strokeStyle = o.edge || inkA(0.7); G.lineWidth = 2; G.stroke(); G.restore();
}
/** a rival mouse seen from the front, generic (an arch on a flat base), bottom centre at (x, y), width wd px; the joint
   where its top shell meets its sides is the line at o.seam (0.42 of the height). Returns { L, R: the joint's ends, top } */
function b05_rivalFront(x, y, wd, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha, h = wd * (o.h || 0.62), w2 = wd / 2, sq = o.squeeze || 0;
  const hs = h * (o.seam || 0.42), L = [x - w2 + sq, y - hs], R = [x + w2 - sq, y - hs], top = [x, y - h];
  if (a <= 0.003) return { L, R, top };
  G.save(); G.globalAlpha = a; G.beginPath(); G.moveTo(x - w2 + 6, y);
  G.bezierCurveTo(x - w2 + sq * 0.6, y - h * 0.18, x - w2 + sq, y - h * 0.62, x - w2 * 0.55, y - h * 0.94);
  G.quadraticCurveTo(x, y - h * 1.04, x + w2 * 0.55, y - h * 0.94);
  G.bezierCurveTo(x + w2 - sq, y - h * 0.62, x + w2 - sq * 0.6, y - h * 0.18, x + w2 - 6, y); G.closePath();
  G.fillStyle = o.fill || (TH ? '#FFFFFF' : '#1A1B1E'); G.fill(); G.strokeStyle = o.edge || inkA(0.7); G.lineWidth = 2; G.stroke();
  /* the joint between the top shell and the sides */
  G.strokeStyle = o.seamCol || inkA(0.4); G.lineWidth = 1.4; G.beginPath(); G.moveTo(L[0] + 2, L[1]); G.quadraticCurveTo(x, y - hs - h * 0.05, R[0] - 2, R[1]); G.stroke();
  G.restore();
  return { L, R, top };
}
/** a creak, drawn where parts rub at a joint as a squeeze loads it: three short arcs opening outward from p, growing with k
   (the squeeze), in the fault's red. ang = the direction they open toward. Caused by the squeeze, not a loop (M2) */
function b05_creak(p, ang, k, o = {}) {
  if (k <= 0.02) return; const a = (o.alpha == null ? 1 : o.alpha) * clamp(k * 1.4);
  for (let i = 0; i < 3; i++) { const r = 10 + i * 9 * (0.6 + 0.4 * k); G.save(); G.globalAlpha = a * (1 - i * 0.22); G.strokeStyle = C.red; G.lineWidth = 2.6; G.lineCap = 'round'; G.beginPath(); G.arc(p[0], p[1], r, ang - 0.5, ang + 0.5); G.stroke(); G.restore(); }
}
/** the end of a sheet, magnified, so a reader can see how thick it is: a small rectangle t mm thick drawn at k px per mm
   (centred at x, top at y, h px tall), its thickness written beside it. o = { fill, alpha, label, side ('r'), col } */
function b05_sheetEnd(x, y, t, k, h, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; if (a <= 0.003) return;
  const w = Math.max(2, t * k); rr(x - w / 2, y, w, h, Math.min(2, w / 3), o.fill || C.comp, null, 0, a);
  if (o.label !== false) text(o.label || fmtN(t, 2) + ' mm', o.side === 'l' ? x - w / 2 - 12 : x + w / 2 + 12, y + h / 2 + 8, { role: 'label', size: 19, color: o.col || C.mute, align: o.side === 'l' ? 'right' : 'left', alpha: a, caps: false });
}
/**
 * A gauge of a part's peak stress against the material's strength: a vertical track h px tall, the fill rising with the
 * peak (in Theseus's blue on its part, the heat scale on the rival's, red when it reaches the line), the strength as a red
 * dashed line at the top, and what is left under it. (x, y) = its top left. o = { frac (peak ÷ strength), hero, a, w (24) }
 */
function b05_gauge(x, y, h, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const w = o.w || 24, f = clamp(o.frac || 0), fh = Math.max(w, h * f), col = o.hero ? C.hero : f >= 0.999 ? C.red : heatCol(f * f);
  rr(x, y, w, h, w / 2, C.track, null, 0, a); rr(x, y + h - fh, w, fh, w / 2, col, null, 0, a);
  line(x - 12, y, x + w + 12, y, { color: C.red, w: 2.5, dash: [7, 5], alpha: a });
}
/**
 * A two-column bump chart (Brock liked the old slide's: kept, small and plain): each item's name in the left column at its
 * rank there, in the right column at its rank there, and a line between them that draws from t0. (x, y) = the top left of
 * the left names' column; w the full width; rowH; o = { items: [{ name, l, r (ranks from 0), hero, ring (a Theseus part
 * that is not the hero: drawn in ink with a blue name), vR (a value written after the right name) }], head: [left, right],
 * title, t, t0 (the lines draw), dur (0.9), a }
 */
function b05_bump(x, y, w, rowH, o = {}) {
  const t = o.t, a0 = o.a == null ? 1 : o.a; if (a0 <= 0.003) return;
  const items = o.items || [], nameW = o.nameW || 150, xl = x + nameW, xr = x + w - (o.rightW || 210), yr = r => y + 40 + r * rowH;
  if (o.title) text(o.title, x, y - 34, { role: 'label', size: 21, color: C.ink, alpha: a0 });
  if (o.head) { text(o.head[0], xl, y + 4, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: a0 }); text(o.head[1], xr, y + 4, { role: 'label', size: 19, color: C.mute, alpha: a0 * ep(t, o.t0 - 0.2, o.t0 + 0.2) }); }
  const rank = it => it.hero ? 2 : it.second ? 1 : 0, order = items.map((it, i) => i).sort((p, q) => rank(items[p]) - rank(items[q]));
  for (const i of order) {
    const it = items[i], dl = it.hero ? 0.25 : 0, k = ep(t, o.t0 + dl, o.t0 + dl + (o.dur || 0.9), E.io3);
    const col = it.hero ? C.hero : it.second ? C.second : it.ring ? C.ink2 : C.comp, nameC = it.hero || it.ring ? C.heroText : it.second ? C.secondText : C.ink2;
    const y1 = yr(it.l) - 7, y2 = yr(it.r) - 7, x1 = xl + 18, x2 = xr - 18, xm = (x1 + x2) / 2;
    text(it.name, xl, yr(it.l), { role: 'label', size: 19, color: nameC, align: 'right', alpha: a0 });
    circle(x1, y1, it.hero ? 6 : 4.5, { fill: col, alpha: a0 });
    if (k > 0.003) {
      G.save(); G.globalAlpha = a0 * (it.hero ? 1 : 0.85); G.strokeStyle = col; G.lineWidth = it.hero ? 5 : it.second ? 3.2 : 2.2; G.lineCap = 'round'; G.beginPath();
      for (let q = 0; q <= 32 * k; q++) { const u = q / 32, b0 = (1 - u) ** 3, b1 = 3 * (1 - u) ** 2 * u, b2 = 3 * (1 - u) * u * u, b3 = u ** 3, X = b0 * x1 + (b1 + b2) * xm + b3 * x2, Y = (b0 + b1) * y1 + (b2 + b3) * y2; q ? G.lineTo(X, Y) : G.moveTo(X, Y); }
      G.stroke(); G.restore();
    }
    const kr = ep(t, o.t0 + 0.6 + dl, o.t0 + 1.0 + dl);
    if (kr > 0) {
      circle(x2, y2, it.hero ? 6 : 4.5, { fill: col, alpha: a0 * kr });
      rich([{ s: b05_ord(it.r + 1), role: 'num', size: it.hero ? 24 : 21, weight: it.hero ? 800 : 650, color: it.hero ? C.heroText : C.ink2 }, { s: it.name, role: 'label', size: 19, color: it.hero || it.ring ? C.heroText : it.second ? C.secondText : C.mute, gap: 12 },
        it.vR ? { s: it.vR, role: 'small', size: 21, weight: 600, color: C.faint, gap: 12, sentence: false } : null], xr, yr(it.r), { alpha: a0 * kr });
    }
  }
}
const b05_ord = n => n + (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th');
/** a rank before → after in the verdict's look (the kit's verdict counts numbers; a rank wants its ordinal): the old rank
   small, grey and struck, an arrow, the new rank huge in Theseus's gradient, the label over it with which way is better.
   (x, y) = the row's left edge and the big rank's baseline. o = { from, to (ranks, 1 = first), label, size (130), sub } */
function b05_rankVerdict(t, t0, x, y, o = {}) {
  const a = ep(t, t0, t0 + 0.35); if (a <= 0.003) return { w: 0 };
  const size = o.size || 130, bS = Math.round(size * 0.4), km = ep(t, t0 + 0.35, t0 + 0.95, E.cam), kg = ep(t, t0 + 0.8, t0 + 1.25), ks = ep(t, t0 + 0.8, t0 + 1.15);
  const sO = caps(b05_ord(o.from)), sN = caps(b05_ord(o.to)), stO = { role: 'd1', size: bS, weight: 800, track: -0.02 }, stN = { role: 'd1', size, weight: 800, track: -0.03 };
  const wO = tw(sO, stO), g1 = Math.round(size * 0.13), arW = Math.round(size * 0.34), xN = x + wO + g1 + arW + g1;
  if (o.label) text(o.label, x, y - size * 0.78 - 26, { role: 'label', size: 22, color: C.mute, alpha: a, maxW: o.maxW || 900 });
  const bs = lerp(size, bS, km), col = mix(TH ? '#111111' : '#F3F2EE', TH ? '#8A8983' : '#6E6D68', km);
  text(sO, lerp(xN, x, km), y, { role: 'd1', size: bs, weight: 800, track: -0.02, color: col, alpha: a, caps: false });
  if (ks > 0) line(x - 4, y - bS * 0.34, x - 4 + (wO + 8) * ks, y - bS * 0.34, { color: C.mute, w: Math.max(2.5, bS * 0.06), alpha: a });
  if (km > 0.2) arrow(x + wO + g1, y - bS * 0.36, x + wO + g1 + arW, y - bS * 0.36, { color: C.faint, w: Math.max(2.5, size * 0.022), hs: Math.max(12, size * 0.09), p: ep(t, t0 + 0.5, t0 + 0.9), alpha: a });
  if (kg > 0) text(sN, xN, y, Object.assign({ color: C.heroText, grad: C.heroGrad, alpha: a * kg, caps: false }, stN));
  if (o.sub) text(o.sub, x, y + 54, { role: 'small', size: 25, weight: 650, color: C.ink2, alpha: a * kg, maxW: o.subW || 900 });
  return { w: xN + tw(sN, stN) - x };
}

/* ============================== the 2D frames behind nopick, hotspot, margin and work ==============================
   The deck's own models (10-d-shell.js, shlHot; solved by 07-sim.js): a 60 mm span on a pin and a roller, PP-C-20A, pressed
   in the middle. A solid plane (a beam as deep as the triangles, thinner out of the page) and triangles of 12 mm sides,
   one size or each member sized to its own force, all at the same weight (0.276 g). The model is linear: a press of F
   newtons is the solved 10 N case times F / 10, and the same part at f × the weight (every member f × as thick out of the
   page) carries 1 / f × the stress. Brock, F12.12: it counts as broken at 120 MPa. */
let B05_FR = null;
function b05_fr() {
  if (B05_FR) return B05_FR;
  const R = shlHot(), g = r => r.mass.reduce((s, v) => s + v, 0), crack = r => SHL_STR.ft / r.peak * 10;
  const out = { R, H: SHL_HOT.H, g: g(R.plate), plate: R.plate, uni: R.uni, sized: R.sized,
    Fp: crack(R.plate), Fu: crack(R.uni), Fs: crack(R.sized), st: SHL_STR.ft };
  out.ratio = out.Fs / out.Fp;                     /* the press it takes, same weight */
  out.same = R.sized.peak / R.plate.peak;          /* the weight the triangles need for the plane's strength, as a fraction */
  out.perG = { plate: out.Fp / out.g, sized: out.Fs / out.g };
  return (B05_FR = out);
}
/** where a frame's top middle is, loaded by F newtons (flex drawn sc × real): the point a finger presses (stage px) */
function b05_topMid(r, P, F, sc, H, f = 1) {
  const m = r.model, md = m.mid, k = F / 10 / f;
  return P([m.nodes[md][0], (r === B05_FR.plate ? H : m.nodes[md][1]) + r.d[md * 3 + 1] * sc * k]);
}
/** the solid plane at press F (N), on one heat scale against the strength (squared, F19.3: the red lands on the peak);
   f = its weight as a fraction of the solved one; crack 0..1 */
function b05_drawPlane(F, P, o = {}) {
  const B = b05_fr(), k = F / 10 / (o.f || 1), a = o.alpha == null ? 1 : o.alpha;
  shlPlateField(B.plate, P, k, o.sc || 10, B.st, a, { gamma: SHL_GAMMA, crack: o.crack || 0, ny: o.ny || 14 });
  if (o.supports !== false) { feSupport(P([-30, 0]), 'pin', { alpha: a }); feSupport(P([30, 0]), 'roll', { alpha: a }); }
}
/** the triangles at press F (N), filleted at every joint (F9.27), on the same heat scale; the force running along the
   members while it is loaded (feFlow: dashes whose speed follows each member's force, so they move only under load) */
function b05_drawTri(r, F, P, s, t, o = {}) {
  const B = b05_fr(), k = F / 10 / (o.f || 1), a = o.alpha == null ? 1 : o.alpha;
  feDraw(shlSigG(r, B.st, k), P, { scale: o.sc || 10, load: k, smax: B.st, w: s * 0.92 * (o.wk || 1), alpha: a, ghost: false, seg: 8, fillet: o.fillet || Math.max(3, s * 0.5) });
  if (o.flow) feFlow(r, P, t, { scale: o.sc || 10, load: k, alpha: a * o.flow * clamp(F / 20) });
  if (o.supports !== false) { feSupport(P([-30, 0]), 'pin', { alpha: a }); feSupport(P([30, 0]), 'roll', { alpha: a }); }
}

/* ============================== b05_nopick: you don't have to pick (Brock: "a really important concept") ==============================
   The header on frame one (G9), with the chart under it: the plain wall's line (the fallacy slide's comparison) and,
   once the demonstration has drawn it, Theseus's own line (his note). The demonstration first: the same weight, the same
   finger, the press rising: the solid wall cracks at 67 N (about the hardest squeeze a hand gives); the triangles hold,
   and take 126 N. Their two points land on the chart, Theseus's line draws through its point, and the pointer slides it
   down its line to the plain wall's strength: the same press at 46 % less weight. */
S({
  id: 'b05_nopick', ch: 'shell', theme: 'night', title: 'You don\'t have to pick', settle: 10, ideas: [75, 15],
  src: ['shlHot2d', 'shlPyrofil', 'b05Johnson'],
  replaces: ['shlNoPick', 'shlShell3d'],
  answers: [
    ['"the what if uoh didn\'t have to pick shouldn\'t be the only thing on the screen for a start animation, it should just be the header"', 'The title, YOU DON\'T HAVE TO PICK, is the header from the first frame, set like every other title, with the two parts and the chart already under it. There is no question on its own anywhere.'],
    ['"i\'ve pointed this out before and im concerned you didn\'t change it, it makes me worry you\'re missing my other feedback"', 'Changed: the header leads the first frame, and every clause of his notes on the two slides this one replaces is answered in this list. The strength meter he cut is drawn by no slide in this file.'],
    ['"i have all the same comparisons here as the last slide"', 'It keeps the fallacy slide\'s comparison on purpose (the plain wall\'s line, strength against weight, the same axes) and adds what that slide doesn\'t have: Theseus\'s method, demonstrated and drawn as its own line.'],
    ['"this graph feels even more intuitive at a glance"', 'Read as "less intuitive": the graph is rebuilt. Strength goes up (the press it takes to crack, higher is better), weight goes across, two straight lines from zero: the plain wall in grey, Theseus in blue above it at every weight.'],
    ['"i feel like our method should have a separate line"', 'Theseus\'s method is its own blue line, drawn through the point the demonstration just measured.'],
    ['"this is a really important concept, but i genuinely have no idea what it\'s show graphically"', 'The demonstration says it before the chart: the same weight (0.28 g each), the same finger, the press rising; the solid wall cracks at 67 N, about the hardest a hand can squeeze, and the triangles hold. Then the chart shows both ways out of the pick: 1.8× the press at the same weight, or the same press at 46 % less weight.'],
    ['shlShell3d: "hard to understand"', 'The 3D stress study is not on this slide; the comparison is two plain 2D parts under one finger.'],
    ['shlShell3d: "and cut the strength graphs that last multiple slides, they were a bad idea"', 'Cut: no slide in this file draws the shell meter. This chart belongs to this slide: the fallacy slide before it draws only the plain wall\'s line, and this slide redraws that line in its first second as its own.'],
    ['F2.11: "follow that up with a what if you didn\'t have to pick... but find a good transition"', 'The fallacy slide ends on the plain wall\'s line and "where the material goes"; this slide opens on the same line and answers it.'],
    ['F2.09: "a bar of flex or strength to weight dropping"', 'Replaced by his later note on shlShell3d (cut the meter). The triangles\' growing lead on a lighter mouse is b06_light.'],
    ['F33.5: an important idea, executed wrong', 'Rebuilt from the ground: a demonstration, a two-line chart and one headline.']
  ],
  draw: t => {
    const B = b05_fr(), H = B.H, sc = 10, s = 9, gLo = B.g * B.same;
    header(t, 'You don\'t have to pick');
    captions(t, [[0.6, 'A plain wall only gets stronger by getting heavier. Same weight, same press: it cracks first.'], [5.4, 'Triangles sized to their force take ' + fmtN(Math.floor(B.ratio * 10) / 10, 1) + '× the press, or the same press at ' + Math.floor((1 - B.same) * 100) + ' % less weight.']]);
    /* ---- left: the demonstration. One finger each, one press for both (M3); it stops when the plain wall cracks ---- */
    const F = lerp(0, B.Fp, ep(t, 1.0, 4.2, E.io3)), broke = t >= 4.2, kc = ep(t, 4.2, 4.55), a0 = ep(t, 0, 0.3);
    rich([{ s: 'Press', role: 'label', size: 21, color: C.mute }, { s: fmtN(F, 0), role: 'd1', size: 56, weight: 800, color: C.ink, tnum: true, gap: 14 }, { s: 'N', role: 'label', size: 24, color: C.mute, gap: 8, caps: false }, { s: 'on each, the same finger', role: 'small', size: 23, weight: 600, color: C.faint, gap: 22, sentence: false }], LM, 330, { alpha: ep(t, 0.9, 1.2) });
    const rows = [{ oy: 600, name: 'A plain solid wall', hero: false }, { oy: 880, name: 'Theseus: triangles sized to their force', hero: true }], ox = 430, rx = 770;
    const kr = ep(t, 1.2, 1.6);
    text('Peak experienced stress', rx, 404, { role: 'label', size: 19, color: C.mute, alpha: kr });
    text('(lower is better)', rx, 430, { role: 'small', size: 21, weight: 600, color: C.faint, alpha: kr, sentence: false });
    rows.forEach((rw, i) => {
      const P = p => [ox + p[0] * s, rw.oy - p[1] * s], ty = rw.oy - 112;
      if (!rw.hero) b05_drawPlane(F, P, { sc, crack: kc, alpha: a0 });
      else b05_drawTri(B.sized, F, P, s, t, { sc, alpha: a0, flow: 0.45 });
      /* the finger lies along the part with its pad on the middle, as on a button, and rides it down (flex drawn 10× real) */
      const tp = b05_topMid(rw.hero ? B.sized : B.plate, P, F, sc, H), kf = ep(t, 0.5, 1.0, E.out3);
      finger(tp[0] - (1 - kf) * 26, tp[1] - (1 - kf) * 18, 0.42, { s, press: clamp(F / 25), len: 13, alpha: kf });
      /* the words for this part, beside it: what it is, its weight, its peak against the strength, what happened */
      const nm = text(rw.name, rx, ty, { role: 'label', size: 22, color: rw.hero ? C.heroText : C.ink2, alpha: a0, maxW: 330, lh: 1.2 });
      const yw = ty + nm.h + 4;
      rich([{ s: 'Weight', role: 'label', size: 19, color: C.mute }, { s: fmtN(B.g, 2) + ' g', role: 'num', size: 24, weight: 750, color: rw.hero ? C.heroText : C.ink, gap: 10 }], rx, yw, { alpha: a0 });
      const pk = (rw.hero ? B.sized.peak : B.plate.peak) * F / 10;
      rich([{ s: fmtN(pk, 0), role: 'num', size: 40, weight: 800, color: rw.hero ? C.heroText : pk >= B.st - 0.5 ? C.red : C.ink, tnum: true }, { s: 'MPa', role: 'label', size: 19, color: C.mute, gap: 8, caps: false }], rx, yw + 58, { alpha: kr });
      text(!broke ? 'Breaks at ' + B.st : rw.hero ? 'Holds' : 'Cracks', rx, yw + 92, { role: 'label', size: 21, color: !broke ? C.faint : rw.hero ? C.heroText : C.red, alpha: kr, caps: !broke ? false : true });
    });
    scaleNote(LM, 952, 'about the hardest a hand can squeeze a mouse (Johnson 2000, derived)', { lead: fmtN(B.Fp, 0) + ' N', t, t0: 4.4 });
    text('2D frames, PP-C-20A, a 60 mm span, flex drawn 10× real', LM, 990, { role: 'small', size: 21, weight: 560, color: C.faint, alpha: ep(t, 1.2, 1.6) });
    /* ---- right: the chart. Strength up (higher is better), weight across: his note on the old fallacy slide ---- */
    const cx = 1200, cy = 340, cw = 620, ch = 270, xr = [0, 0.4], yr = [0, 160];
    const m = axes(t, { x: cx, y: cy, w: cw, h: ch, xr, yr, xticks: [0, 0.1, 0.2, 0.3, 0.4], yticks: [0, 40, 80, 120, 160], xfmt: v => fmtN(v, 1) + ' g', yfmt: v => String(v), t0: 0, xlabel: 'Weight of the section' });
    text('Press it takes to crack, N {(higher is better)}', cx - 14, cy - 34, { role: 'label', size: 21, color: C.mute, alpha: a0 });
    /* the plain wall's line, from frame one: strength bought with weight, gram for gram */
    const kg = ep(t, 0.15, 0.9, E.io3), yEnd = B.perG.plate * xr[1];
    line(m.X(0), m.Y(0), m.X(xr[1]), m.Y(yEnd), { color: C.ink2, w: 3, p: kg, cap: 'round' });
    text('Plain wall', m.X(xr[1]), m.Y(yEnd) - 16, { role: 'label', size: 19, color: C.ink2, align: 'right', alpha: ep(t, 0.7, 1.0) });
    /* the two measured points land when the plain wall cracks: same weight, 1.8× the press */
    const gx = B.g, kpt = ep(t, 4.3, 4.7, E.snap), kb = ep(t, 4.6, 5.1, E.snap);
    if (kpt > 0) { circle(m.X(gx), m.Y(B.Fp), 8 * kpt, { fill: C.ink2 }); text(fmtN(B.Fp, 0) + ' N', m.X(gx) - 14, m.Y(B.Fp) - 12, { role: 'num', size: 22, weight: 700, color: C.ink2, align: 'right', alpha: kpt }); }
    if (kb > 0) {
      line(m.X(gx), m.Y(B.Fp) - 10, m.X(gx), lerp(m.Y(B.Fp) - 10, m.Y(B.Fs) + 14, kb), { color: C.heroText, w: 2, dash: [5, 5] });
      heroMark(m.X(gx), m.Y(B.Fs), 12, kb);
      text(fmtN(B.Fs, 0) + ' N', m.X(gx), m.Y(B.Fs) - 22, { role: 'num', size: 24, weight: 800, color: C.heroText, align: 'center', alpha: kb });
      text(fmtN(Math.floor(B.ratio * 10) / 10, 1) + '×', m.X(gx) + 16, (m.Y(B.Fp) + m.Y(B.Fs)) / 2 + 12, { font: 'disp', size: 32, weight: 800, color: C.heroText, grad: C.heroGrad, alpha: ep(t, 5.0, 5.4) });
    }
    /* Theseus's own line, through its point */
    const kl = ep(t, 5.6, 6.4, E.io3), gTop = Math.min(xr[1], yr[1] / B.perG.sized);
    if (kl > 0) { line(m.X(0), m.Y(0), m.X(gTop), m.Y(B.perG.sized * gTop), { color: C.hero, w: 4, p: kl, cap: 'round' }); text('Theseus', m.X(gTop) - 16, m.Y(B.perG.sized * gTop) + 8, { role: 'label', size: 19, color: C.heroText, align: 'right', alpha: ep(t, 6.2, 6.5) }); }
    /* the pointer slides Theseus's point down its line to the plain wall's strength: the weight it no longer needs */
    const kd = ep(t, 6.8, 7.9, E.cam), gNow = lerp(gx, gLo, kd);
    if (t > 6.5) {
      if (kd > 0) line(m.X(gx), m.Y(B.Fp), lerp(m.X(gx), m.X(gLo), kd), m.Y(B.Fp), { color: C.heroText, w: 2, dash: [5, 5] });
      heroMark(m.X(gNow), m.Y(B.perG.sized * gNow), 11, ep(t, 6.5, 6.8));
      cursorAt(t, [[6.5, [m.X(gx) + 40, m.Y(B.Fs) - 50]], [6.8, [m.X(gx) + 4, m.Y(B.Fs) + 6]], [7.9, [m.X(gLo) + 4, m.Y(B.Fp) + 6]]], [], { a: ep(t, 6.4, 6.7) * (1 - ep(t, 8.6, 9.0)), grab: t > 6.8 });
      /* the weight saved, as a bracket on the weight axis between the two points */
      const kh = ep(t, 7.8, 8.2), yb = m.Y(0) - 22;
      if (kh > 0) {
        for (const g of [gLo, gx]) line(m.X(g), g === gx ? m.Y(B.Fp) + 10 : m.Y(B.Fp) + 12, m.X(g), yb, { color: C.heroText, w: 1.5, dash: [3, 4], alpha: kh * 0.8 });
        line(m.X(gLo), yb, m.X(gx), yb, { color: C.heroText, w: 2.5, alpha: kh });
        text('−' + Math.floor((1 - B.same) * 100) + ' %', (m.X(gLo) + m.X(gx)) / 2, yb - 12, { font: 'disp', size: 26, weight: 800, color: C.heroText, align: 'center', alpha: kh });
      }
    }
    /* the headline: what the demonstration just showed, the same weight (F14.10, F16.1); the chart's −46 % is the other way out */
    verdict(t, 5.2, cx - 40, 880, { from: B.Fp, to: B.Fs, unit: 'N', dec: 0, label: 'Press it takes to crack, the same weight', better: 'higher', who: ['Plain wall', 'Theseus'], rivalCol: 'grey', net: fmtN(Math.floor(B.ratio * 10) / 10, 1) + '×', netWord: 'the press', size: 100, maxW: 760 });
  }
});

/**
 * A bump chart of several columns (the old slide's graphic, which Brock liked, made plain): each item a line through its
 * rank in each column, the names at both ends. (x, y) = the top of the first rank row; w; rowH.
 * o = { cols: [{ head, ranks (per item, from 0), t0 (when the lines into this column draw) }], items: [{ name, hero, second,
 *   ring }], t, a, nameW (130), endW (170) }
 */
function b05_bumpN(x, y, w, rowH, o = {}) {
  const t = o.t, a0 = o.a == null ? 1 : o.a; if (a0 <= 0.003) return;
  const cols = o.cols, items = o.items, nameW = o.nameW || 130, endW = o.endW || 170, n = cols.length;
  const cx = j => x + nameW + 22 + j * (w - nameW - endW - 44) / (n - 1), ry = r => y + r * rowH;
  cols.forEach((c, j) => text(c.head, cx(j), y - 30, { role: 'label', size: 19, color: j ? C.ink2 : C.mute, align: 'center', alpha: a0 * (j ? ep(t, c.t0 - 0.2, c.t0 + 0.2) : 1), maxW: 220, lh: 1.15 }));
  const order = items.map((it, i) => i).sort((p, q) => ((items[p].hero ? 2 : items[p].second ? 1 : 0) - (items[q].hero ? 2 : items[q].second ? 1 : 0)));
  for (const i of order) {
    const it = items[i], col = it.hero ? C.hero : it.second ? C.second : it.ring ? C.ink2 : C.comp, lwid = it.hero ? 5 : it.second ? 3.2 : 2.2;
    text(it.name, cx(0) - 18, ry(cols[0].ranks[i]) + 7, { role: 'label', size: 19, color: it.hero || it.ring ? C.heroText : it.second ? C.secondText : C.ink2, align: 'right', alpha: a0 });
    for (let j = 0; j < n; j++) {
      const kj = j ? ep(t, cols[j].t0 + (it.hero ? 0.2 : 0), cols[j].t0 + (it.hero ? 0.2 : 0) + 0.8, E.io3) : 1; if (kj <= 0.003) break;
      const X = cx(j), Y = ry(cols[j].ranks[i]);
      if (j) {
        const x1 = cx(j - 1) + 10, y1 = ry(cols[j - 1].ranks[i]), x2 = X - 10, xm = (x1 + x2) / 2;
        G.save(); G.globalAlpha = a0 * (it.hero ? 1 : 0.85); G.strokeStyle = col; G.lineWidth = lwid; G.lineCap = 'round'; G.beginPath();
        for (let q = 0; q <= 28 * kj; q++) { const u = q / 28, b0 = (1 - u) ** 3, b1 = 3 * (1 - u) ** 2 * u, b2 = 3 * (1 - u) * u * u, b3 = u ** 3, X2 = b0 * x1 + (b1 + b2) * xm + b3 * x2, Y2 = (b0 + b1) * y1 + (b2 + b3) * Y; q ? G.lineTo(X2, Y2) : G.moveTo(X2, Y2); }
        G.stroke(); G.restore();
      }
      if (kj > 0.9) circle(X, Y, it.hero ? 7 : 5, { fill: col, alpha: a0 });
    }
    /* the name again at the right, in the last column's order, once its line arrives */
    const kE = ep(t, cols[n - 1].t0 + 0.8, cols[n - 1].t0 + 1.2);
    if (kE > 0) text(it.name, cx(n - 1) + 20, ry(cols[n - 1].ranks[i]) + 7, { role: 'label', size: 19, color: it.hero || it.ring ? C.heroText : it.second ? C.secondText : C.mute, alpha: a0 * kE });
  }
}
/** a hanger under a strip's middle with slotted 1 N discs (102 g each) stacked on it, as in a bridge contest. (x, y): the
   hook on the strip's underside; discs: [[on, off], ...] (off may be null): each drops onto the stack at on and settles on a
   spring, and is lifted off at off; o = { fall (0..1: the strip gave, the load drops away), alpha, dw (disc width px, 60),
   dh (10), rod (34) }. Returns the load on now (N, springy: the strip bounces as a disc lands, M2) */
function b05_load(t, discs) { let n = 0; for (const [on, off] of discs) n += clamp(spring(t, on, { f: 3.2, z: 0.5 }), 0, 1.4) - (off != null ? clamp(spring(t, off, { f: 3.2, z: 0.7 }), 0, 1.2) : 0); return Math.max(0, n); }
function b05_hanger(t, x, y, discs, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha, dw = o.dw || 60, dh = o.dh || 10, rod = o.rod || 34, fall = o.fall || 0;
  const drop = fall * fall * 260, aa = a * (1 - fall);
  if (aa <= 0.003) return;
  const on = discs.filter(([o0, o1]) => t >= o0 - 0.25 && (o1 == null || t < o1 + 0.35)); if (!on.length && !(o.always)) return;
  G.save(); G.globalAlpha = aa; const ink = TH ? '#2E2E2C' : '#CFCEC9', disc = TH ? '#8A8983' : '#77766E', yBar = y + 13 + rod + 8 * (dh + 1) + drop;
  G.strokeStyle = ink; G.lineWidth = 2.5; G.lineCap = 'round'; G.beginPath(); G.arc(x, y + 7 + drop, 6, -Math.PI * 0.1, Math.PI * 1.1, true); G.stroke();
  G.beginPath(); G.moveTo(x, y + 13 + drop); G.lineTo(x, yBar); G.stroke();
  G.lineWidth = 4; G.beginPath(); G.moveTo(x - dw * 0.45, yBar); G.lineTo(x + dw * 0.45, yBar); G.stroke();
  /* the discs, bottom up: each falls in from above its place and settles; one lifted off rises and fades */
  let i = 0;
  for (const [o0, o1] of discs) {
    const kIn = ep(t, o0 - 0.22, o0, E.in3), kOut = o1 != null ? ep(t, o1, o1 + 0.35, E.out3) : 0; if (kIn <= 0 || kOut >= 1) continue;
    const yy = yBar - 2 - (i + 1) * (dh + 1) - (1 - kIn) * 40 - kOut * 50, al = aa * clamp(kIn * 3) * (1 - kOut);
    rr(x - dw / 2, yy, dw, dh, 3, disc, null, 0, al); line(x - dw / 2 + 4, yy + 2, x + dw / 2 - 4, yy + 2, { color: TH ? '#B9B8B2' : '#9A9993', w: 1, alpha: al });
    if (kOut <= 0) i++;
  }
  G.restore();
}

/* ============================== b05_specific: specific strength and specific stiffness (F14.6; an important idea, F33.5) ==============================
   Brock: "doesn't show how higher specific strength is better ... i like the graphic but the explanation for it needs to be
   so much better". The classroom version first (the bridge contest: load held ÷ the bridge's own weight): two strips, the
   magnesium rivals sell "for its strength-to-weight" (Razer 2023) and Theseus's PP-C-20A, cut to ONE weight, loaded with the
   same hanging 1 N discs. Same size, magnesium wins (the datasheet); same weight, carbon PP bends 1.7× less and holds 1.7×
   the load. Then the graphic he liked, now explained: two bump charts that the tests fill, all six materials, per gram. */
const B05_SPEC_T = { same: [0.45, 0.7], off: 1.5, thin: [1.75, 2.75], d2: [2.95, 3.2], more: [4.3, 4.75, 5.2, 5.65, 6.1, 6.55], crack: 6.6 };
S({
  id: 'b05_specific', ch: 'shell', theme: 'night', title: 'Specific strength and specific stiffness', settle: 12, ideas: [5, 94],
  src: ['shlPyrofil', 'shlMg', 'shlAl', 'shlFr4', 'shlAbs', 'shlPc', 'b05Strip', 'b05SciOly', 'b05Razer', 'b05Johnson'],
  replaces: ['shlSpecific'],
  answers: [
    ['"doesn\'t shot how higher specific strength is better"', 'It shows it happening: a magnesium strip and a PP-C-20A strip of the same weight (0.61 g) take the same hanging 1 N discs; the magnesium, nearly twice as strong on its datasheet, cracks at 8 N; the carbon PP holds them all and is good for 13 N. Strength per gram is what each one holds for the weight you spend.'],
    ['"just feels like a graphic which is quite convoluted"', 'The slide leads with the classroom test (a bridge contest scores the load held ÷ the bridge\'s weight, Science Olympiad); the graphic comes after it and is filled by it.'],
    ['"i like the graphic"', 'Kept, simplified to two plain bump charts, stiffness and strength, each from the datasheet\'s order to the order at one weight, for all six materials.'],
    ['"but the explanation for it needs to be so much better."', 'The explanation is the demonstration: the same size first (magnesium bends less, the datasheet\'s story), then the strips cut to one weight on screen (the magnesium comes out about half as thick), the same discs, and the results land in the charts beside them.'],
    ['F14.6: "the sort of value/efficiency each material buys and how it\'s not just about who has the highest tensile strength or flexural modulus"', 'Said and shown: carbon PP is 4th of six on the datasheet for both, and 1st per gram for stiffness, 2nd for strength behind FR4, which comes only as flat board (Theseus\'s own board, b07). The six: PP-C-20A, ABS, PC, magnesium alloy, aluminium, FR4.'],
    ['F33.5: one of the important ideas, executed wrong', 'Rebuilt around a demonstration, with the bump charts kept as its record and one headline: 4th → 1st.']
  ],
  draw: t => {
    const Mp = B05_MAT.pp, Mm = B05_MAT.mg, T = B05_SPEC_T, g0 = B05_SP.g0, s = 13;
    header(t, 'Specific strength and specific stiffness');
    captions(t, [[0.5, 'Same size: magnesium bends less, as its datasheet says. It also weighs 1.8× as much.'], [1.8, 'A shell has a weight to hit, not a size. Cut to the same weight, the magnesium comes out half as thick.'], [4.2, 'Same discs on both: the magnesium bends 1.7× as far and cracks at 8 N. Carbon PP holds.'], [7.4, 'Per gram, carbon PP is the stiffest of the six and the strongest one a mold can make.']]);
    /* ---- left: the classroom version, a bridge contest ---- */
    const r = demoPanel(t, 0.1, [LM, 280, 1040, 660], { src: 'Science Olympiad bridges: load held ÷ own weight' });
    const kThin = ep(t, T.thin[0], T.thin[1], E.io3), tMg = lerp(1.0, b05_thickFor(Mm.rho, g0), kThin);
    const rows = [{ M: Mm, t: tMg, y: 476, hero: false }, { M: Mp, t: 1.0, y: 740, hero: true }];
    const x0 = 150, gMg = b05_gives(Mm.s, b05_thickFor(Mm.rho, g0)), crackK = ep(t, T.crack, T.crack + 0.3);
    const discsAll = T.same.map(on => [on, T.off]).concat(T.d2.concat(T.more).map(on => [on, null]));
    rows.forEach(rw => {
      const discs = rw.hero ? discsAll : discsAll.filter(([on]) => on <= T.crack + 0.01), gives = !rw.hero && t >= T.crack;
      const n = b05_load(t, discs), P = rw.hero ? n : Math.min(n, gMg), d = b05_sag(P, rw.M.E, rw.t), frac = b05_stress(P, rw.t) / rw.M.s;
      const st = b05_strip(x0, rw.y, s, rw.t, gives ? d * (1 + 0.6 * crackK) : d, { over: 3, fill: rw.hero ? C.hero : C.comp, heat: rw.hero ? frac * 0.6 : frac, bad: !rw.hero && frac > 0.97, crack: gives ? crackK : 0, alpha: ep(t, 0.05, 0.4) });
      b05_hanger(t, st.bot[0], st.bot[1], discs, { fall: gives ? ep(t, T.crack + 0.15, T.crack + 0.75, E.in3) : 0 });
      /* the load it carries, beside its stack, in newtons (one disc, 1 N) */
      const nDisc = discs.filter(([on, off]) => t >= on && (off == null || t < off)).length, kn = nDisc ? 1 - (gives ? ep(t, T.crack + 0.1, T.crack + 0.4) : 0) : 0;
      if (kn > 0) text(nDisc + ' N', st.bot[0] + 50, st.bot[1] + 112, { role: 'num', size: 26, weight: 800, color: rw.hero ? C.heroText : C.ink2, alpha: kn, tnum: true });
      /* its words: what it is, its weight and thickness (counting as it is cut), how far it bends at 2 N, what it holds */
      const ya = rw.y - 96, a0 = ep(t, 0.1, 0.4), rx = r[0] + r[2];
      text(rw.hero ? 'Carbon PP, PP-C-20A' : 'Magnesium AZ91D', r[0], ya, { role: 'label', size: 22, color: rw.hero ? C.heroText : C.secondText, alpha: a0 });
      text(rw.hero ? 'Theseus\'s shell' : 'the metal Razer sells for its strength-to-weight (2023)', r[0], ya + 30, { role: 'small', size: 22, weight: 600, color: C.faint, alpha: a0, sentence: false });
      rich([{ s: 'Weight', role: 'label', size: 19, color: C.mute }, { s: fmtN(b05_weight(rw.M.rho, rw.t), 2) + ' g', role: 'num', size: 26, weight: 800, color: rw.hero ? C.heroText : C.ink, tnum: true, gap: 10 }, { s: fmtN(rw.t, 2) + ' mm thick', role: 'small', size: 22, weight: 600, color: C.faint, gap: 14, sentence: false }], rx, ya, { align: 'right', alpha: a0 });
      /* how far it bends under 2 N: at the same size first, then at the same weight (the old value kept, struck, F16.1) */
      const k1 = ep(t, T.same[1] + 0.25, T.same[1] + 0.55), k2 = ep(t, T.d2[1] + 0.3, T.d2[1] + 0.7);
      if (k1 > 0) {
        const v1 = b05_sag(2, rw.M.E, 1.0), v2 = b05_sag(2, rw.M.E, rw.hero ? 1.0 : b05_thickFor(Mm.rho, g0)), changed = !rw.hero && k2 > 0;
        rich([{ s: 'Bends', role: 'label', size: 19, color: C.mute }, changed ? { s: fmtN(v1, 2), role: 'num', size: 22, weight: 650, color: C.faint, gap: 10 } : null,
          { s: fmtN(changed ? v2 : v1, 2) + ' mm', role: 'num', size: 24, weight: 800, color: rw.hero ? C.heroText : C.ink, gap: 10, alpha: changed ? k2 : 1 }, { s: 'at 2 N', role: 'small', size: 22, weight: 600, color: C.faint, gap: 10, sentence: false }], rx, ya + 34, { align: 'right', alpha: k1 });
        if (changed) { const wv = tw(fmtN(v2, 2) + ' mm', { role: 'num', size: 24, weight: 800 }) + tw('at 2 N', { role: 'small', size: 22, weight: 600 }) + 20, w1 = tw(fmtN(v1, 2), { role: 'num', size: 22, weight: 650 }); line(rx - wv - w1 - 4, ya + 26, rx - wv - w1 - 4 + (w1 + 8) * k2, ya + 26, { color: C.mute, w: 2 }); }
      }
      const kh = ep(t, T.crack, T.crack + 0.3);
      if (kh > 0) text(rw.hero ? 'Holds; good for ' + fmtN(b05_gives(rw.M.s, rw.t), 1) + ' N' : 'Cracks at ' + fmtN(gMg, 1) + ' N', rx, ya + 66, { role: 'label', size: 21, color: rw.hero ? C.heroText : C.red, align: 'right', alpha: kh });
    });
    scaleNote(LM, 985, 'a firm press, about a phone\'s weight; one disc, 1 N, weighs 102 g', { lead: '2 N', t, t0: 1.0 });
    /* ---- right: the graphic he liked, filled by the tests: all six, the datasheet's order, then at one weight, like for like ---- */
    const kB = ep(t, 0.3, 0.8), bx = 1170, cA = T.d2[1] + 0.6, cB = T.crack + 0.4;
    const itemsOf = (rawRank, wRank, vf) => B05_SP.rows.map((row, i) => ({ name: row.m.name, l: rawRank[i], r: wRank[i], hero: !!row.m.hero, second: row.k === 'mg', ring: !!row.m.board, vR: vf(row) }));
    b05_bump(bx, 340, RM - bx, 30, { t, t0: cA, a: kB, title: 'Stiffness {(1st bends least)}', head: ['Datasheet', 'One weight'], items: itemsOf(B05_SP.rawE, B05_SP.stiff, row => fmtN(row.sag, 2) + ' mm'), rightW: 250 });
    b05_bump(bx, 612, RM - bx, 30, { t, t0: cB, a: kB, title: 'Strength {(1st holds most)}', head: ['Datasheet', 'One weight'], items: itemsOf(B05_SP.rawS, B05_SP.strong, row => fmtN(row.holds, 1) + ' N'), rightW: 250 });
    text('FR4 comes only as flat board: it is Theseus\'s board (#94)', bx, 838, { role: 'small', size: 22, weight: 600, color: C.faint, alpha: ep(t, cB + 1.0, cB + 1.4), maxW: RM - bx });
    /* ---- the headline: carbon PP's rank, from the datasheet to per gram ---- */
    b05_rankVerdict(t, 7.9, bx, 988, { from: 4, to: 1, size: 96, label: 'Carbon PP, per gram {(1st is best)}' });
  }
});
