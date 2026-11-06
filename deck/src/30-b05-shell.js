/* ============================== B05: Shell I, materials and strength (revamp v2, 2026-11-06) ==============================
   Ten slides that open the shell chapter on its compromise (lighter shells flex, creak and crack) and answer it with the
   material, then with where the material goes:
     b05_card      the chapter card: the compromise, the ledger, the chapter's ideas
     b05_material  ABS against PP-C-20A on a flat strip cut from the wall, a hand's press, the strips' weights
     b05_specific  six materials at one weight, pressed until they give: what each buys per gram (the bridge contest)
     b05_wall      the melt freezing short in a wall too thin: at the same weight the lighter resin gets the thicker wall
     b05_cubed     the ruler flat and on edge; the mold's tolerance on a thin wall and a thicker one, cubed
     b05_fallacy   heavier is not stronger: the GPX 2 against the Sora V2, and a solid plane's trade-off
     b05_nopick    you don't have to pick: on the chapters' test strip, triangles 1.3× as stiff, or as stiff at 27 % less weight
     b05_hotspot   why: a solid plane pressed until its one hot spot cracks; triangles milled from a thicker sheet, 15 %
                   lighter, hold its press
     b05_margin    the peak decides the break: paper tears at a nick; the strength left on each part
   (the numbers above are b05_fr()'s on b06's B06_STRIP today; the slides and their answers read it live)
     b05_work      putting that weight to work: the share of its strength each gram uses, and the choices it drives
   Breaks follow Brock's two strengths (F41.1): carbon PP 120 MPa stretched, 207 MPa bent (PP-C-20A datasheet).
   Every number comes from a source named in SRC or from a model solved in the page (07-sim.js, labelled Derived).
   The shell meter that ran through the old chapter is gone (Brock on shlShell3d: "cut the strength graphs that last
   multiple slides, they were a bad idea"). Helpers are b05_*. */

Object.assign(SRC, {
  b05Tpu: { t: 'TechPowerUp, Logitech G Pro X Superlight 2 review (2023), build quality: "When applying lateral pressure, some creaking but no flexing of the shell can be observed."', u: 'https://techpowerup.com/review/logitech-g-pro-x-superlight-2/4.html' },
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
  b05RtGpx2: { t: 'RTINGS, Logitech G Pro X Superlight 2 review (2023-10-06): measured "Default Weight" 59.4 g', u: 'https://www.rtings.com/mouse/reviews/logitech/g-pro-x-superlight-2' },
  b05Won: { t: 'Won, Johnson, Punnett & Dennerlein 2009, J Electromyogr Kinesiol 19:428-436, Table 3 (five computer tasks, a force-sensing mouse, 17 people): mean side force 0.9 to 1.0 N, mean peak side force 2.0 to 2.1 N', u: 'https://stacks.cdc.gov/view/cdc/187303/cdc_187303_DS1.pdf' },
  b05RtSora: { t: 'RTINGS, Ninjutso Sora V2 review (2024-05-24): measured "Default Weight" 40.9 g', u: 'https://www.rtings.com/mouse/reviews/ninjutso/sora-v2' },
  b05Peri: { t: 'Periview, Finalmouse ULX Competition review: "The sides are solid, which feels like a significant improvement over the more flexible, creaky bodies of previous models"', u: 'https://periview.gg/?p=3024' },
  b05Card: { t: 'ISO/IEC 7810 ID-1: a payment card is 0.76 mm thick (the kit\'s SCALE.card)', u: 'https://www.iso.org/standard/70483.html' },
  b05Fill: { t: 'This deck: walls of flow, the farthest edge from the gate under the crown (about 105 mm along the shell, measured on the 3D shell mesh by the lattice study) divided by the wall, against polypropylene\'s flow ratio of 150 to 280 (MIT 2.008); magnesium is held to its own minimum walls (Design News), no flow ratio for it being published in the guides searched (PlasticsToday, Phillips Medisize, Chicago White Metal)', n: 'derived, this model' },
});

/* ---------- the materials (datasheets in 10-d-shell.js's SRC: shlPyrofil, shlAbs, shlPc, shlMg, shlAl, shlFr4) ----------
   E: flexural modulus for the plastics and FR4 (lengthwise), elastic modulus for the metals (MPa); s: its tensile strength
   (MPa: PP-C-20A and FR4 at break, ABS and PC at yield, the metals' ultimate); fb: the stress it breaks at when BENT (F41.1,
   Brock's "two strengths": 120 MPa stretched, 207 MPa bent for PP-C-20A, JIS K7171; ABS 82 and PC 97 MPa, ISO 178; FR4 552
   MPa lengthwise, NEMA; the metals have no separate bending figure, so their ultimate, the generous one, G5); y: a metal's
   yield, where it bends for good; rho in g/cm³. Every strip on these slides is bent, so its break is fb. */
const B05_MAT = {
  /* one value per material (KIT §4, K 11:01): the four SIM_MAT carries read it; PC and aluminium aren't in SIM_MAT, so they stay
     here. FR4 is ranked as a material, so it takes its higher, along-the-weave figures (EL, fbL: the ones that don't flatter
     carbon PP; b05_specific says which) */
  pp: { key: 'pp', name: 'PP-C-20A', long: 'Carbon PP, PP-C-20A', E: SIM_MAT.ppcf.E, s: SIM_MAT.ppcf.ft, fb: SIM_MAT.ppcf.fb, rho: matOf('ppcf').rho, src: SIM_MAT.ppcf.src, hero: true },
  abs: { key: 'abs', name: 'ABS', long: 'ABS', E: SIM_MAT.abs.E, s: SIM_MAT.abs.ft, fb: SIM_MAT.abs.fb, rho: matOf('abs').rho, src: SIM_MAT.abs.src },
  pc: { key: 'pc', name: 'PC', long: 'Polycarbonate', E: 2350, s: 65, fb: 97, rho: 1.20, src: 'shlPc' },
  mg: { key: 'mg', y: SIM_MAT.mg.fy, name: 'Magnesium', long: 'Magnesium AZ91D', E: SIM_MAT.mg.E, s: SIM_MAT.mg.ft, fb: SIM_MAT.mg.fb, rho: matOf('mg').rho, src: SIM_MAT.mg.src, metal: true },
  al: { key: 'al', y: 276, name: 'Aluminium', long: 'Aluminium 6061', E: 68900, s: 310, fb: 310, rho: 2.70, src: 'shlAl', metal: true },
  fr4: { key: 'fr4', name: 'FR4', long: 'FR4 (the board)', E: SIM_MAT.fr4.EL, s: SIM_MAT.fr4.ft, fb: SIM_MAT.fr4.fbL, rho: matOf('fr4').rho, src: SIM_MAT.fr4.src, board: true }
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
    rawS: rank(r => r.m.s, true), rawE: rank(r => r.m.E, true),          /* the datasheet's order (tensile strength, modulus) */
    stiff: rank(r => r.sag, false), strong: rank(r => r.holds, true),     /* at the same weight */
    sagMax: Math.max(...rows.map(r => r.sag)), holdMax: Math.max(...rows.map(r => r.holds))
  };
})();

/* ---------- b05_wall: the same weight per area of wall (10 g per 100 cm²) in carbon PP and in magnesium ----------
   A wall's limit is its flow length, not a fixed thickness (FILM F42, decided ~12:10): polypropylene runs 150 to 280 times its
   thickness (MIT 2.008, b05Mit); the melt goes in at the gate under the crown (F19.1) and the farthest edge is about 105 mm
   along the shell (L1, computed on the 3D shell mesh). Magnesium has no flow ratio in any source found (PlasticsToday's and
   Phillips Medisize's thixomolding guides, CWM's die-casting guide: none), so it is held only to its own minimum walls (Design
   News: 0.7 mm typical, 0.5 mm only on small parts) and nothing is claimed about its reach. Protolabs' 0.889 mm and 0.635 mm
   are rules of thumb for a part of unknown flow length, not a floor. Theseus's own skin, 0.60 mm, is a target to be proven. */
const B05_FLOW = { L: 105, lo: 150, hi: 280, skin: 0.60 };
const B05_W = (() => {
  const gpa = 10, wall = rho => gpa / (rho * 100) * 10;      /* mm: g per 100 cm² ÷ (g/cm³ × 100 cm²) × 10 mm/cm */
  const pp = { m: B05_MAT.pp, t: wall(B05_MAT.pp.rho) };
  const mg = { m: B05_MAT.mg, t: wall(B05_MAT.mg.rho), typ: 0.70, small: 0.5 };
  pp.walls = B05_FLOW.L / pp.t;                 /* the flow length in walls: 106, under PP's 150 */
  pp.reach = B05_FLOW.lo * pp.t / B05_FLOW.L;   /* the melt's reach at PP's cautious end, as a share of the 105 mm: 1.41 */
  mg.walls = B05_FLOW.L / mg.t;
  mg.atTyp = B05_MAT.mg.rho * mg.typ * 100 / 10;                                      /* g per 100 cm² at its usual wall */
  return { gpa, pp, mg, kT: pp.t / mg.t, mgMore: mg.atTyp / gpa - 1, skinWalls: B05_FLOW.L / B05_FLOW.skin };
})();

/* ---------- b05_cubed: the mold's ±0.076 mm (Protolabs) on a thin wall and a thicker one ---------- */
const B05_C = (() => {
  const tol = 0.076, swing = t => ({ t, lo: Math.pow(1 - tol / t, 3) - 1, hi: Math.pow(1 + tol / t, 3) - 1 });
  const thin = swing(0.70), ths = swing(1.00);
  /* nine molds in a row, each cut a fixed amount off inside the tolerance (the two ends of it included), in an order that
     reads as a production line rather than a sorted list; the same offsets for both rows (the same molds, the same cuts) */
  const offs = [-0.35, 0.72, -1, 0.18, 0.93, -0.62, 0.41, 1, -0.08].map(f => f * tol);
  /* the ruler (F45: Brock liked the Codex version's demonstration): a 60 mm span of a 10 × 3.3 mm carbon PP strip, 2.00 g,
     pressed with 10 N; flat it bends 111 µm, on edge 12 µm: (10 / 3.3)² = 9.18× stiffer, the same grams */
  const ruler = { b: 10, h: 3.3, L: 60, P: 10 }, rulerK = (ruler.b / ruler.h) ** 2;
  ruler.g = B05_MAT.pp.rho * ruler.L * ruler.b * ruler.h / 1000; ruler.flat = b05_sag(ruler.P, B05_MAT.pp.E, ruler.h) * B05_STRIP.b / ruler.b; ruler.edge = ruler.flat / rulerK;
  return { tol, thin, ths, offs, ruler, rulerK, span: w => w.hi - w.lo, k: (thin.hi - thin.lo) / (ths.hi - ths.lo) };
})();

/* ============================== drawing helpers (stage px unless said) ============================== */
/** the material's colour on a drawing: Theseus's resin blue, everything else the ground's greys (FR4 a warmer grey: it is
   Theseus's board, named so in words, never blue on a shell slide) */
function b05_col(k, o = {}) { const m = B05_MAT[k]; return m && m.hero ? C.hero : k === 'fr4' ? C.mute : o.second ? C.second : C.comp; }
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
  path(); G.strokeStyle = o.edge || inkA(0.5); G.lineWidth = 1.2; G.lineJoin = 'round'; G.stroke();
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
  const p1 = [e1[0], e1[1] + hang], p2 = [e2[0], e2[1] + hang], ink = C.ink2, base = o.base == null ? y + hang + 90 : o.base;
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
  G.fillStyle = o.fill || C.panel; G.fill(); G.strokeStyle = o.edge || inkA(0.7); G.lineWidth = 2; G.stroke(); G.restore();
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
  G.fillStyle = o.fill || C.panel; G.fill(); G.strokeStyle = o.edge || inkA(0.7); G.lineWidth = 2; G.stroke();
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
  const bs = lerp(size, bS, km), col = mix(C.ink, C.faint, km);
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
const B05_INFO = new WeakMap();   /* my readings of each solved strip, kept off b06's shared objects */
/**
 * The shell chapters' one test strip (FILM F4, integrator 09:30), read from b06's B06_STRIP: a strip across the top, 60 mm
 * (the mouse's width) on a pin and a roller, pressed on its middle with 10 N (a 1 kg bag of sugar), PP-C-20A. Three ways
 * to spend the same weight (0.46 g): b06's triangles (Theseus's ribs, 1.0 mm wide, 2.0 mm tall), a solid plane of the same
 * outline (0.73 mm thick), and the triangles with each rib sized to its force (#93; the same total rib width, so the same
 * weight; joints zoned with b06's own b06_zones). Breaks by F41.1, Brock's two strengths: σ_axial / 120 + σ_bending / 207
 * reaching 1 (each rib's rigid joint ends read its middle, as b06 does). Called inside draw() only: b06's file loads after
 * this one. Numbers reproduced in /home/claude/work/b05/scripts/f4-strip.js.
 */
function b05_fr() {
  if (B05_FR) return B05_FR;
  const ST = B06_STRIP, FT = SHL_STR.ft, FB = SHL_STR.fb, H = ST.cell * Math.sqrt(3) / 2, P0 = ST.press, M = SIM_MAT.ppcf;
  const grams = r => r.mass.reduce((s0, v) => s0 + v, 0);
  const tri = ST.solve('tri', ST.ribW), gT = grams(tri);
  const plate = simSolve('b05-st-plate', () => shlPlateModel(gT));
  /* the sized strip: b06's Warren truss, each rib's width set by its own force, the total width kept (14 passes) */
  const sizedOf = hs => {
    const n = ST.cells, a = ST.cell, nodes = [], els = [];
    for (let i = 0; i <= n; i++) nodes.push([i * a, 0]); for (let j = 0; j < n; j++) nodes.push([(j + 0.5) * a, H]);
    const T = j => n + 1 + j, add = (i, j) => els.push({ i, j, w: ST.ribH, h: hs[els.length], E: M.E, rho: M.rho });
    for (let i = 0; i < n; i++) add(i, i + 1); for (let j = 0; j < n - 1; j++) add(T(j), T(j + 1)); for (let j = 0; j < n; j++) { add(j, T(j)); add(T(j), j + 1); }
    const m = b06_zones({ nodes, els, kind: 'tri', bl: 0, br: n, mid: T(Math.floor(n / 2)), H, span: n * a });
    m.fix = { [m.bl]: 'xy', [m.br]: 'y' }; m.loads = { [m.mid]: [0, -P0, 0] }; return m;
  };
  let hs = new Array(19).fill(ST.ribW);
  for (let it = 0; it < 14; it++) { const m = sizedOf(hs), r = feSolve(m), f = []; m.els.forEach((el, e) => { if (el.rib) f.push(Math.abs(r.N[e])); }); const mean = f.reduce((s0, v) => s0 + v, 0) / f.length, h2 = f.map(v => Math.max(0.35 * mean, v)), sc = 19 * ST.ribW / h2.reduce((s0, v) => s0 + v, 0); hs = h2.map(v => v * sc); }
  const sized = simSolve('b05-st-sized', () => sizedOf(hs));
  /* each element's use of its strength at the press (a rigid joint end reads its rib's middle), its peak, its mean */
  const read = (r, xo) => {
    /* F41.1's rule, shared (07-sim.js feUse, K 11:01): axial over FT plus bending over FB, a rigid joint zone reading its rib */
    const els = r.model.els, use = feUse(r, FT, FB), uMax = Math.max(...use);
    let s0 = 0, w = 0; els.forEach((el, e) => { if (el.rigid) return; const A = el.w * el.h, I = el.w * el.h ** 3 / 12, ax = Math.abs(r.N[e]) / A / FT, gm = r.mass[e] / 256;
      for (let i = 0; i < 16; i++) { const xi = (i + 0.5) / 16, Mx = el.truss ? 0 : r.M1[e] * (1 - xi) + r.M2[e] * xi; for (let j = 0; j < 16; j++) { const y = el.h * ((j + 0.5) / 16 - 0.5); s0 += (ax + Math.abs(Mx * y / I) / FB) * gm; w += gm; } } });
    const info = { use, uMax, crack: P0 / uMax, flex: -r.d[r.model.mid * 3 + 1], g: grams(r), mean: s0 / w, xo, heat: Object.assign({}, r, { sig: use.map(u => u * FT) }) };
    B05_INFO.set(r, info); return info;
  };
  const iP = read(plate, 0), iT = read(tri, -ST.span / 2), iS = read(sized, -ST.span / 2);
  const out = { ST, FT, FB, H, P0, g: gT, plate, tri, sized, iP, iT, iS, Fp: iP.crack, Ft: iT.crack, Fs: iS.crack };
  /* stiffness (survives any break rule, F41.1): the press that flexes each 0.1 mm (a sheet of copy paper), per gram */
  out.p01 = i => P0 * 0.1 / i.flex;
  out.stiff = iP.flex / iT.flex;                         /* Theseus's ribs against the solid plane, the same weight: 1.38× */
  out.sameFlex = iT.flex / iP.flex;                      /* their weight for the plane's stiffness: 0.723 */
  out.perG = { plate: out.p01(iP) / gT, tri: out.p01(iT) / gT };
  out.use = (r, F, f = 1) => B05_INFO.get(r).uMax * F / P0 / f;   /* the share of its strength used at its peak, at F newtons (f: weight fraction) */
  return (B05_FR = out);
}
/** the point a finger presses: the part's top middle, flexed (drawn sc × real), in stage px */
function b05_topMid(r, P, F, sc, H, f = 1) {
  const m = r.model, md = m.mid, k = F / B05_FR.P0 / f, xo = B05_INFO.get(r).xo, plate = r === B05_FR.plate;
  return P([m.nodes[md][0] + xo, (plate ? H : m.nodes[md][1]) + r.d[md * 3 + 1] * sc * k]);
}
/** the solid plane at press F (N), coloured by the share of its strength used (it is all bending: against 207 MPa), squared
   (F19.3); f = its weight as a fraction of the solved one; crack 0..1 */
function b05_drawPlane(F, P, o = {}) {
  const B = b05_fr(), k = F / B.P0 / (o.f || 1), a = o.alpha == null ? 1 : o.alpha;
  shlPlateField(B.plate, P, k, o.sc || 10, B.FB, a, { gamma: SHL_GAMMA, crack: o.crack || 0, ny: o.ny || 14 });
  if (o.supports !== false) { feSupport(P([-30, 0]), 'pin', { alpha: a }); feSupport(P([30, 0]), 'roll', { alpha: a }); }
}
/** a strip of triangles at press F (N), filleted at every joint (F9.27), each rib coloured by the share of its strength
   used, squared; the force running along the ribs while it is loaded (feFlow: moves only under load) */
function b05_drawTri(r, F, P, s, t, o = {}) {
  const B = b05_fr(), I = B05_INFO.get(r), k = F / B.P0 / (o.f || 1), a = o.alpha == null ? 1 : o.alpha, Q = p => P([p[0] + I.xo, p[1]]);
  feDraw(shlSigG(I.heat, B.FT, k), Q, { scale: o.sc || 10, load: k, smax: B.FT, w: s * 0.92 * (o.wk || 1), alpha: a, ghost: false, seg: 8, fillet: o.fillet || Math.max(3, s * 0.6) });
  if (o.flow) feFlow(r, Q, t, { scale: o.sc || 10, load: k, alpha: a * o.flow * clamp(F / B.P0) });
  if (o.supports !== false) { feSupport(P([-30, 0]), 'pin', { alpha: a }); feSupport(P([30, 0]), 'roll', { alpha: a }); }
}
/** a value rounded never in Theseus's favour: a rival's (rival true) toward its own advantage, Theseus's against it; better is
   'lower' or 'higher'. b05_rv(4.7587, 2, true, 'lower') → '4.75'; b05_rv(13.333, 1, false, 'higher') → '13.3' */
function b05_rv(v, d, rival, better) { const k = Math.pow(10, d), down = (better === 'lower') === rival; return fmtN((down ? Math.floor(v * k + 1e-9) : Math.ceil(v * k - 1e-9)) / k, d); }
/** a number rounded toward zero (DESIGN §9), as text: b05_dn(89.6) → '89' */
function b05_dn(v, d = 0) { const k = Math.pow(10, d); return fmtN(Math.floor(v * k + 1e-6) / k, d); }
/** a slide whose `answers` are written from the live model (review R2-b05-1): pass `answers: (B, Cl) => [[clause, what
   the slide does], ...]` and they are built from b05_fr() / b05_cells() when read (the rating panel reads them after every
   file has loaded; b06's B06_STRIP is not there yet while this file loads), so the numbers in the answers are the numbers
   on the frames, and they follow B06_STRIP when the lattice study changes it */
function b05_live(o) {
  const rows = o.answers; delete o.answers;
  Object.defineProperty(o, 'answers', { enumerable: true, configurable: true, get: () => { try { return rows(b05_fr(), b05_cells()); } catch (e) { return [['(answers)', 'The model behind these answers could not be read: ' + e.message]]; } } });
  return o;
}
/* the heat key: the kit's heatKey (06-motion.js, K 11:16) replaces b05's own ramp, which no slide drew */

/* ============================== b05_card: the chapter card (the kit's chapterCard2: the compromise, the ledger, the ideas) ============================== */
S({
  id: 'b05_card', ch: 'shell', card: true, first: true, theme: 'night', title: 'Shell and structure', settle: 6,
  /* the hand-off (F0c, POLISH 'All polish agents'): the card's lit shell goes on to b05_material, where a strip is cut from its wall.
     As chapterCard2 draws a { view, hi } part: mouseFit in [1000, 200, 840, 500], pad 0.04 */
  handoff: { out: { view: 'left', box: [1000, 200, 840, 500], pad: 0.04 } },
  replaces: ['shellcard'],
  answers: [
    ['shellcard (7/10, no note)', 'Rebuilt in the kit\'s chapter-card family: the compromise most light mice make, struck, and the answer in blue; the flagship line (the UltralightX, from b01); the ledger strip; the whole chapter in film order, nine lines for its 24 slides (b05\'s, then b06\'s triangles, arches, fibres and fillets, then b07\'s board, tolerance and Poron pads: FILM F22); the simplified mouse with its shell lit.'],
    ['F33.7, F38.8: the compromise named; the simplified mouse', 'The compromise is the ledger\'s shell line; the only mouse drawn is the kit\'s simplified one.']
  ],
  draw: t => chapterCard2(t, { ch: 'shell', turn: 2.1, part: { view: 'side', hi: ['shell'] },
    /* the whole chapter (FILM F22): b05's slides, then b06's and b07's, nine lines in film order */
    list: [[5, 'Carbon-filled polypropylene'], [5, 'Strength per gram'], [5, 'Walls a mold can fill, cubed'], [[15, 75], 'The strength–weight fallacy'], [[75, 15], 'You don\'t have to pick'], [[75, 93], 'Hotspots and the peak'], [[75, 53], 'Triangles and arches'], [[53, 75], 'Fibres and fillets'], [[94, 57], 'The board, tolerance, Poron']] })
});

/* ============================== b05_material: carbon-filled polypropylene (materials, 6/10) ==============================
   A strip of the wall, laid flat ("explain that this is just on a flat plane"): 60 mm between supports, 10 mm wide, 1 mm thick,
   pressed by one fingertip with 2 N (about the hardest grip measured at a desk, Won 2009). ABS, the common mouse plastic (Brock's
   baseline, #5; Finalmouse benchmarks against it): it sags 4.2 mm, drawn to scale. The same strip in PP-C-20A, the same finger
   and press: 0.80 mm. The weights (his note): 0.63 g and 0.61 g, and the carbon PP strip as stiff as the ABS one: 0.57 mm,
   0.35 g. Strength, the strip bent until it gives: on pull-test strengths ABS gives at 5.6 N, carbon PP holds to 13.3 N; on their
   bending strengths (ABS 82 MPa, PP-C-20A 207, F41.1) 9.2 (9.11 rounded up: a rival's strength) and 23.0 N (review R2-b05-3). Beam theory (b05Strip). */
const B05_MAT_T = { lift: [0.3, 1.2], press: [1.5, 2.4], swap: [4.0, 4.6], kg: 5.6, v: 6.6, thin: 7.8 };
S({
  id: 'b05_material', ch: 'shell', theme: 'paper', title: 'Carbon-filled polypropylene', settle: 10.5, ideas: [5],
  handoff: { in: { view: 'left', box: [LM, 280, 340, 220], pad: 0.06 } },   /* its first frame's mouseFit, the card's mouse arriving */
  src: ['shlPyrofil', 'shlAbs', 'b05Fm', 'b05Strip', 'b05Won'],
  replaces: ['materials'],
  answers: [
    ['"explain that this is just on a flat plane"', 'A strip is lifted out of the simplified mouse\'s wall and laid flat on two supports, and the slide says so: "A strip of the wall, laid flat: the material alone, no curve helping" (the curve\'s gain is b06_arch).'],
    ['"scale the force to what a mouse would experience from a hand and note that"', '2 N, and the slide says what that is: about the hardest grip measured at a desk (Won 2009: peaks of about 2 N).'],
    ['"do that more throughout the presentation"', 'Every b05 slide with a force says its human scale: 2 N here and on b05_specific, 10 N (a hard press, a 1 kg bag of sugar) on b05_nopick, and the presses that break things in bags of sugar.'],
    ['"add the projected weights of these 2 beams"', 'Under each strip, its weight: ABS 0.63 g, carbon PP 0.61 g; then the carbon PP strip as stiff as the ABS one, drawn beside it: 0.58 mm thick, 0.35 g (0.574 mm solved, rounded up: never in Theseus\'s favour).']
  ],
  draw: t => {
    const T = B05_MAT_T, Mt = B05_M, s = 10, x0 = 520, y0 = 560;
    header(t, 'Carbon-filled polypropylene');
    captions(t, [[0.3, 'A strip of the wall, laid flat: the material alone, no curve helping.'], [1.5, 'ABS, the common mouse plastic, under a 2 N press: it sags ' + fmtN(Mt.sagA, 1) + ' mm.'], [4.0, 'The same strip in carbon-filled PP, the same press: ' + fmtN(Mt.sagP, 2) + ' mm, and it weighs less.'], [7.8, 'Or make it as stiff as the ABS strip: ' + fmtN(Math.ceil(Mt.tMatch * 100 - 1e-9) / 100, 2) + ' mm thick, ' + fmtN(Mt.gMatch, 2) + ' g.']]);
    /* where the strip comes from: the simplified mouse, its shell lit (M4), the strip lifting out of it */
    const kl = ep(t, T.lift[0], T.lift[1], E.io3), m = mouseFit([LM, 280, 340, 220], 'left', { hi: ['shell'], col: 'ink', lit: 1 - kl * 0.6 });
    text('A strip of the wall, laid flat', LM, 540, { role: 'label', size: 20, color: C.mute });
    /* the strip on two supports, the finger pressing its middle; its sag to scale */
    const kp = ep(t, T.press[0], T.press[1], E.io3), kw = ep(t, T.swap[0], T.swap[1], E.io3), P = Mt.P * kp;
    const sag = lerp(b05_sag(P, B05_MAT.abs.E, Mt.t), b05_sag(P, B05_MAT.pp.E, Mt.t), kw);
    if (kw > 0) b05_strip(x0, y0, s, Mt.t, b05_sag(Mt.P, B05_MAT.abs.E, Mt.t), { fill: C.comp, alpha: 0.25 * kw, supports: false });
    const st = b05_strip(x0, y0, s, Mt.t, sag, { fill: kw > 0.5 ? C.hero : C.comp });
    /* the readout names one material at a time (review R3, M8): the drawing morphs, but the number is ABS's until the swap is
       half done, then carbon PP's, each at the press now on (so it agrees with the force arrow at every frame) */
    const sagNow = b05_sag(P, kw > 0.5 ? B05_MAT.pp.E : B05_MAT.abs.E, Mt.t);
    /* the finger to scale with the strip (F54.2), its pad flat on it (FG), coming from the upper right so its body stays clear of
       the sag readout; the force beside it on the left */
    if (kp > 0) { finger(st.top[0], st.top[1], Math.PI - 0.42, { s, surf: 0, press: kp, len: 26, alpha: ep(t, T.press[0] - 0.3, T.press[0]) });
      forceArrow(st.top[0] - 9 * s, st.top[1] - 4, Math.PI / 2, 70, { N: P, dec: 1, color: C.ink, k: 1, side: 'l' }); }
    rich([{ s: kw > 0.5 ? 'Carbon PP, PP-C-20A' : 'ABS', role: 'label', size: 22, color: kw > 0.5 ? C.heroText : C.ink2 }, { s: 'Sags', role: 'label', size: 19, color: C.mute, gap: 24 }, { s: (kw > 0.5 ? fmtN(Math.ceil(sagNow * 100 - 1e-9) / 100, 2) : b05_dn(sagNow, 2)) + ' mm', role: 'num', size: 30, weight: 800, color: kw > 0.5 ? C.heroText : C.ink, tnum: true, gap: 10 }], x0, y0 - 90);
    /* the weights, then the thin strip as stiff as the ABS one */
    const kg = ep(t, T.kg, T.kg + 0.4);
    rich([{ s: 'Weight', role: 'label', size: 19, color: C.mute }, { s: fmtN(Mt.gA, 2) + ' g', role: 'num', size: 26, weight: 800, color: C.ink, gap: 10 }, { s: 'ABS', role: 'small', size: 21, weight: 600, color: C.faint, gap: 8, sentence: false }, { s: fmtN(Mt.gP, 2) + ' g', role: 'num', size: 26, weight: 800, color: C.heroText, gap: 28 }, { s: 'carbon PP, the same strip', role: 'small', size: 21, weight: 600, color: C.faint, gap: 8, sentence: false }], x0, y0 + 120, { alpha: kg });
    const kt = ep(t, T.thin, T.thin + 0.5);
    if (kt > 0) { b05_strip(x0, y0 + 230, s, Mt.tMatch, b05_sag(Mt.P, B05_MAT.pp.E, Mt.tMatch), { fill: C.hero, alpha: kt }); rich([{ s: 'As stiff as the ABS strip:', role: 'small', size: 22, weight: 600, color: C.ink2, sentence: false }, { s: fmtN(Math.ceil(Mt.tMatch * 100 - 1e-9) / 100, 2) + ' mm, ' + fmtN(Mt.gMatch, 2) + ' g', role: 'num', size: 26, weight: 800, color: C.heroText, gap: 10 }, { s: '(−' + b05_dn((1 - Mt.gMatch / Mt.gA) * 100) + ' %)', role: 'small', size: 22, weight: 600, color: C.heroText, gap: 8, sentence: false }], x0, y0 + 330, { alpha: kt }); }
    /* the headline */
    verdict(t, T.v, 1300, 470, { from: Math.floor(Mt.sagA * 100 + 1e-9) / 100, to: Math.ceil(Mt.sagP * 100 - 1e-9) / 100, unit: 'mm', dec: 2, label: 'Sag under 2 N, one strip', better: 'lower', who: ['ABS', 'Carbon PP'], net: b05_dn(Mt.kE, 1) + '×', netWord: 'stiffer', size: 90, maxW: RM - 1300 });
    text('Bent until it gives, on pull-test strengths: ABS ' + fmtN(Math.ceil(Mt.givesA * 10 - 1e-9) / 10, 1) + ' N, carbon PP ' + b05_dn(Mt.givesP, 1) + ' N (' + b05_dn(Mt.kS, 1) + '×); on bending strengths ' + fmtN(Math.ceil(b05_gives(B05_MAT.abs.fb, Mt.t) * 10 - 1e-9) / 10, 1) + ' and ' + b05_dn(b05_gives(B05_MAT.pp.fb, Mt.t), 1) + ' N', 1300, 600, { role: 'small', size: 22, weight: 600, color: C.ink2, maxW: RM - 1300, sentence: false, alpha: ep(t, T.v + 1.4, T.v + 1.8) });
    scaleNote(LM, 952, 'about the hardest grip measured at a desk (Won 2009)', { lead: '2 N', t, t0: T.press[0] });
    text('Beam theory: a 60 mm span, 10 mm wide, 1 mm thick; flexural moduli 2,550 (ABS) and 13,500 MPa (PP-C-20A); sag drawn to scale', LM, 990, { role: 'small', size: 20, weight: 560, color: C.faint, sentence: false });
  }
});

/* ============================== b05_specific: specific strength and specific stiffness (F14.6; an important idea, F33.5) ==============================
   Brock: "doesn't show how higher specific strength is better ... i like the graphic but the explanation for it needs to be
   so much better". The classroom version first (the bridge contest: load held ÷ the bridge's own weight): two strips, the
   magnesium rivals sell "for its strength-to-weight" (Razer 2023) and Theseus's PP-C-20A, cut to ONE weight, loaded with the
   same hanging 1 N discs. Same size, magnesium wins (the datasheet); same weight, carbon PP bends 1.7× less and holds 1.6× the
   load (one basis for all, the pull test; review 09:45). Then the graphic he liked, now explained: two bump charts that the tests fill, all six materials, per gram. */
const B05_SPEC_T = { same: [0.45, 0.7], off: 1.5, thin: [1.75, 2.75], d2: [2.95, 3.2], more: [4.3, 4.75, 5.2, 5.65, 6.1, 6.55], crack: 6.6 };
S({
  id: 'b05_specific', ch: 'shell', theme: 'night', title: 'Specific strength and specific stiffness', settle: 12, ideas: [5, 94],
  src: ['shlPyrofil', 'shlMg', 'shlAl', 'shlFr4', 'shlAbs', 'shlPc', 'b05Strip', 'b05SciOly', 'b05Razer', 'b05Won'],
  replaces: ['shlSpecific'],
  answers: [
    ['"doesn\'t shot how higher specific strength is better"', 'It shows it happening: a magnesium strip and a PP-C-20A strip of the same weight (0.61 g) take the same hanging 1 N discs; the magnesium, nearly twice as strong on its datasheet, gives (bends for good) at 5.2 N and cracks at 8 N; the carbon PP holds them all and is good for 13.3 N on the same pull-test basis as the magnesium (23 N by its own bending strength, 207 MPa, said on the slide). Strength per gram is what each one holds for the weight you spend.'],
    ['"just feels like a graphic which is quite convoluted"', 'The slide leads with the classroom test (a bridge contest scores the load held ÷ the bridge\'s weight, Science Olympiad); the graphic comes after it and is filled by it.'],
    ['"i like the graphic"', 'Kept, simplified to two plain bump charts, stiffness and strength, each from the datasheet\'s order to the order at one weight, for all six materials.'],
    ['"but the explanation for it needs to be so much better."', 'The explanation is the demonstration: the same size first (magnesium bends less, the datasheet\'s story), then the strips cut to one weight on screen (the magnesium comes out about half as thick), the same discs, and the results land in the charts beside them.'],
    ['F14.6: "the sort of value/efficiency each material buys and how it\'s not just about who has the highest tensile strength or flexural modulus"', 'Said and shown: carbon PP is 4th of six on the datasheet for both, and, bent at one weight (the slide says so: the textbook E/ρ would rank it 3rd), 1st for stiffness and 2nd for strength behind FR4, every bar on one basis, the pull test, each labelled (yield for ABS and PC, break for PP-C-20A and FR4, ultimate for the metals); FR4, 1st, comes only as flat board (Theseus\'s own board, b07), and is ranked by its along-the-weave figures, which the slide says (20 GPa; across the weave, 18 GPa, it would bend 3.69 mm instead of 3.32, still 4th). The six: PP-C-20A, ABS, PC, magnesium alloy, aluminium, FR4.'],
    ['F33.5: one of the important ideas, executed wrong', 'Rebuilt around a demonstration, with the bump charts kept as its record and one headline: 4th → 1st in stiffness, bent at one weight. The caption says what the player gets: 1.7× less flex in the hand than magnesium at the same weight.']
  ],
  draw: t => {
    const Mp = B05_MAT.pp, Mm = B05_MAT.mg, T = B05_SPEC_T, g0 = B05_SP.g0, s = 13;
    header(t, 'Specific strength and specific stiffness');
    captions(t, [[0.5, 'Same size: magnesium bends less, as its datasheet says. It also weighs 1.8× as much.'], [1.8, 'A shell has a weight to hit, not a size. Cut to the same weight, the magnesium comes out half as thick.'], [4.2, 'Same discs on both: the magnesium bends 1.7× as far, gives at 5 N and cracks at 8 N. Carbon PP holds.'], [7.4, 'Bent at one weight, carbon PP is the stiffest of the six: in the hand, 1.7× less flex than magnesium.']]);
    /* ---- left: the classroom version, a bridge contest ---- */
    const r = demoPanel(t, -1, [LM, 280, 1040, 660], { src: 'Science Olympiad bridges: load held ÷ own weight' });
    const kThin = ep(t, T.thin[0], T.thin[1], E.io3), tMg = lerp(1.0, b05_thickFor(Mm.rho, g0), kThin);
    const rows = [{ M: Mm, t: tMg, y: 476, hero: false }, { M: Mp, t: 1.0, y: 740, hero: true }];
    const x0 = 150, gMg = b05_gives(Mm.s, b05_thickFor(Mm.rho, g0)), yMg = b05_gives(Mm.y, b05_thickFor(Mm.rho, g0)), crackK = ep(t, T.crack, T.crack + 0.3);
    /* when the discs first pass magnesium's yield (150 MPa: it bends for good, review M-b05-5), before it cracks at its 230 */
    const tYield = T.d2.concat(T.more).find((on, i) => i + 1 >= yMg);
    const discsAll = T.same.map(on => [on, T.off]).concat(T.d2.concat(T.more).map(on => [on, null]));
    rows.forEach(rw => {
      const discs = rw.hero ? discsAll : discsAll.filter(([on]) => on <= T.crack + 0.01), gives = !rw.hero && t >= T.crack;
      const n = b05_load(t, discs), P = rw.hero ? n : Math.min(n, gMg), d = b05_sag(P, rw.M.E, rw.t), frac = b05_stress(P, rw.t) / rw.M.s;
      const st = b05_strip(x0, rw.y, s, rw.t, gives ? d * (1 + 0.6 * crackK) : d, { over: 3, fill: rw.hero ? C.hero : C.comp, heat: rw.hero ? frac * 0.6 : frac, bad: !rw.hero && frac > 0.97, crack: gives ? crackK : 0 });
      b05_hanger(t, st.bot[0], st.bot[1], discs, { fall: gives ? ep(t, T.crack + 0.15, T.crack + 0.75, E.in3) : 0 });
      /* the load it carries, beside its stack, in newtons (one disc, 1 N) */
      const nDisc = discs.filter(([on, off]) => t >= on && (off == null || t < off)).length, kn = nDisc ? 1 - (gives ? ep(t, T.crack + 0.1, T.crack + 0.4) : 0) : 0;
      if (kn > 0) text(nDisc + ' N', st.bot[0] + 50, st.bot[1] + 112, { role: 'num', size: 26, weight: 800, color: rw.hero ? C.heroText : C.ink2, alpha: kn, tnum: true });
      /* its words: what it is, its weight and thickness (counting as it is cut), how far it bends at 2 N, what it holds */
      const ya = rw.y - 96, a0 = 1, rx = r[0] + r[2];
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
      const kh = ep(t, T.crack, T.crack + 0.3), ky = ep(t, tYield, tYield + 0.3);
      if (rw.hero) { if (kh > 0) text('Holds; good for ' + b05_dn(b05_gives(rw.M.s, rw.t), 1) + ' N', rx, ya + 66, { role: 'label', size: 21, color: C.heroText, align: 'right', alpha: kh }); }
      else if (ky > 0) text('Gives at ' + fmtN(yMg, 1) + ' N' + (t >= T.crack ? ', cracks at ' + fmtN(gMg, 1) + ' N' : ''), rx, ya + 66, { role: 'label', size: 21, color: C.red, align: 'right', alpha: ky });
    });
    scaleNote(LM, 985, 'about the hardest grip measured at a desk (Won 2009); a disc is 1 N (102 g)', { lead: '2 N', t, t0: 1.0, size: 23 });
    /* ---- right: the graphic he liked, filled by the tests: all six, the datasheet's order, then at one weight, like for like ---- */
    const kB = 1, bx = 1170, cA = T.d2[1] + 0.6, cB = T.crack + 0.4;
    const itemsOf = (rawRank, wRank, vf) => B05_SP.rows.map((row, i) => ({ name: row.m.name, l: rawRank[i], r: wRank[i], hero: !!row.m.hero, second: row.k === 'mg', ring: !!row.m.board, vR: vf(row) }));
    b05_bump(bx, 340, RM - bx, 28, { t, t0: cA, a: kB, title: 'Stiffness {(1st bends least)}', head: ['Datasheet', 'Bent, at one weight'], items: itemsOf(B05_SP.rawE, B05_SP.stiff, row => b05_rv(row.sag, 2, row.k !== 'pp', 'lower') + ' mm'), rightW: 330 });
    b05_bump(bx, 588, RM - bx, 28, { t, t0: cB, a: kB, title: 'Strength bent, on pull-test strengths {(1st holds most)}', head: ['Datasheet', 'Bent, at one weight'], items: itemsOf(B05_SP.rawS, B05_SP.strong, row => b05_rv(row.holds, 1, row.k !== 'pp', 'higher') + ' N (' + ({ pp: 'break', fr4: 'break', abs: 'yield', pc: 'yield', mg: 'ultimate', al: 'ultimate' })[row.k] + ')'), rightW: 330 });
    text('Bent, PP-C-20A\'s datasheet allows 207 MPa (23 N)', bx, 802, { role: 'small', size: 20, weight: 600, color: C.faint, alpha: ep(t, cB + 1.0, cB + 1.4), maxW: RM - bx, sentence: false });
    text('FR4: only flat board (#94); ranked along its weave, its stronger way', bx, 830, { role: 'small', size: 20, weight: 600, color: C.faint, alpha: ep(t, cB + 1.0, cB + 1.4), maxW: RM - bx });
    /* ---- the headline: carbon PP's rank, from the datasheet to per gram ---- */
    b05_rankVerdict(t, 7.9, bx, 984, { from: 4, to: 1, size: 116, label: 'Carbon PP\'s stiffness, bent at one weight {(1st is best)}' });
  }
});

/* ============================== b05_wall: how thin a wall can go (Brock: "super important concept"; F33.5) ==============================
   The same weight per area of wall (10 g per 100 cm²; not the shell's budget, F44.2) is a 0.99 mm wall in carbon PP and a 0.55 mm
   wall in magnesium. The melt goes in at the gate under the crown (F19.1) and has to reach the farthest edge, about 105 mm along
   the shell (L1, on the 3D shell), before its frozen skin closes the wall. A wall's limit is its flow length (FILM F42, decided
   ~12:10, "Skin: 0.60 mm, to be proven"): polypropylene runs 150 to 280 times its thickness (MIT 2.008), so carbon PP's wall needs
   107 walls of flow and fills with room to spare (shown at the cautious 150). Magnesium has no flow ratio in the sources searched,
   so it is held to its own minimum walls (Design News: 0.7 mm typical, 0.5 mm only on small parts) and no short shot is claimed.
   Theseus's own skin, 0.60 mm, is a target: 175 walls, inside PP's range; a mould-flow check or first shots confirm it. */
const B05_WALL_T = { go: 0.35, tc: 0.9, s: 46 };
/** the melt front (0..1 of the flow length) and the time it reached x (s from the start), for a free reach R (the share of the
   flow length the melt could cover: carbon PP's from its flow ratio, B05_W.pp.reach): the front x = R (1 − e^(−τ / tc)) */
function b05_front(tau, R) {
  const tc = B05_WALL_T.tc;
  return { R, xf: Math.min(1, R * (1 - Math.exp(-Math.max(0, tau) / tc))), at: x => x >= R ? Infinity : -tc * Math.log(1 - x / R), done: R >= 1 ? -tc * Math.log(1 - 1 / R) : Infinity };
}
/**
 * A mold cavity in section, the wall it makes running left to right from the gate: (x, y) the gate end of the cavity's
 * centre line, len px long, h px thick (the wall), steel above and below (hatched, the section convention). o = { tau (time
 * since the shot started), t, floor (mm), sfreeze (s: the time the skin takes to close this wall), floorPx (the floor's
 * thickness, dashed), shortK (0..1: the short shot named), hero }. Returns { xf (px of the front), stop } */
function b05_cavity(x, y, len, h, o = {}) {
  const st = 26, top = y - h / 2, bot = y + h / 2, F = b05_front(o.tau, o.R == null ? 1 : o.R), xf = x + F.xf * len;
  /* the steel, both halves, with section hatching */
  for (const [y0, hh] of [[top - st, st], [bot, st]]) {
    rr(x - 8, y0, len + 16, hh, 2, C.track, null, 0, 1);
    G.save(); G.beginPath(); G.rect(x - 8, y0, len + 16, hh); G.clip(); G.strokeStyle = C.hair; G.lineWidth = 1.2;
    for (let q = x - 40; q < x + len + 40; q += 12) { G.beginPath(); G.moveTo(q, y0 + hh); G.lineTo(q + hh, y0); G.stroke(); }
    G.restore();
  }
  /* the sprue: the melt comes down into the gate at the left end */
  rr(x - 8, top - st - 46, 18, 46 + st, 3, C.bg, null, 0, 1); line(x - 8, top - st - 46, x - 8, top, { color: C.hair, w: 1.5 }); line(x + 10, top - st - 46, x + 10, top, { color: C.hair, w: 1.5 });
  line(x, top, x + len, top, { color: C.mute, w: 1.5 }); line(x, bot, x + len, bot, { color: C.mute, w: 1.5 }); line(x + len, top, x + len, bot, { color: C.mute, w: 1.5 });
  /* the melt: a hot core with a frozen skin growing in from both cold walls behind the front (√ of the time since the melt
     arrived), meeting where the wall has frozen through */
  if (o.tau > 0) {
    const melt = mix(heatCol(0.62), C.bg, 0.08), frozen = o.hero ? mix(C.hero, C.bg, 0.3) : C.mute, n = 90;
    rr(x - 4, top - st - 46, 10, 46 + st, 2, melt, null, 0, clamp(1 - (o.tau - (F.done < Infinity ? F.done + 0.4 : 2.6)) * 1.5));
    G.save(); G.beginPath(); G.rect(x, top, Math.max(0, xf - x), h); G.clip();
    G.fillStyle = melt; G.fillRect(x, top, len, h);
    G.fillStyle = frozen; G.beginPath();
    for (let i = 0; i <= n; i++) { const X = i / n, ta = F.at(X * F.xf), d = (h / 2) * Math.min(1, Math.sqrt(Math.max(0, o.tau - ta) / o.sfreeze)); const px = x + X * (xf - x); i ? G.lineTo(px, top + d) : G.moveTo(px, top + d); }
    for (let i = n; i >= 0; i--) G.lineTo(x + i / n * (xf - x), top);
    G.closePath(); G.fill(); G.beginPath();
    for (let i = 0; i <= n; i++) { const X = i / n, ta = F.at(X * F.xf), d = (h / 2) * Math.min(1, Math.sqrt(Math.max(0, o.tau - ta) / o.sfreeze)); const px = x + X * (xf - x); i ? G.lineTo(px, bot - d) : G.moveTo(px, bot - d); }
    for (let i = n; i >= 0; i--) G.lineTo(x + i / n * (xf - x), bot);
    G.closePath(); G.fill(); G.restore();
    /* the front: a rounded meniscus, the melt fountaining to the walls */
    if (xf < x + len - 1) { G.save(); G.beginPath(); G.ellipse(xf, y, Math.min(14, h * 0.4), h / 2, 0, -Math.PI / 2, Math.PI / 2); G.fillStyle = F.xf >= F.R * 0.985 ? frozen : melt; G.fill(); G.restore(); }
  }
  /* a reference wall, dashed, centred on the cavity (magnesium's usual 0.7 mm) */
  if (o.floorA > 0) { const fh = o.floorPx; G.save(); G.globalAlpha = o.floorA; G.setLineDash([7, 5]); G.strokeStyle = o.hero ? C.heroText : C.red; G.lineWidth = 2; G.strokeRect(x, y - fh / 2, len, fh); G.restore(); }
  /* the short shot, named: the part of the wall the melt never reached */
  if (o.shortK > 0 && F.R < 1) {
    G.save(); G.globalAlpha = o.shortK; G.beginPath(); G.rect(xf + 6, top, x + len - xf - 6, h); G.clip(); G.strokeStyle = C.red; G.lineWidth = 2;
    for (let q = xf - 40; q < x + len + 40; q += 9) { G.beginPath(); G.moveTo(q, bot); G.lineTo(q + h, top); G.stroke(); } G.restore();
  }
  return { xf, R: F.R };
}
S({
  id: 'b05_wall', ch: 'shell', theme: 'paper', title: 'How thin a wall can go', settle: 11, ideas: [5, 'wall'],
  src: ['b05Mit', 'thixoDN', 'b05Fill', 'protoWall', 'shlPyrofil', 'shlMg', 'b05Razer', 'b05Card'],
  replaces: ['thinwall'],
  answers: [
    ['"confusing and lazy graphic"', 'A molding demonstration replaces it: the melt goes in at the gate under the crown and runs about 105 mm to the farthest edge while its skin freezes in from the cold steel. Carbon PP\'s same-weight wall needs 107 walls of flow, under polypropylene\'s 150 to 280 (MIT 2.008): it fills, with room to spare. Magnesium is held to its own minimum walls (0.7 mm typical, 0.5 mm only on small parts, Design News): no flow ratio for magnesium was found, so the slide claims no short shot (FILM F42).'],
    ['"hard to understand at a glance and with longer analysis"', 'At a glance: two walls of the same weight, carbon PP filling with room to spare, magnesium\'s thinner than it is usually molded (its usual 0.7 mm dashed round it), and the headline: 0.56 → 0.99 mm, the same weight (magnesium\'s 0.552 rounded up, carbon PP\'s 0.990 down: never in Theseus\'s favour). For the longer look: what magnesium has to do instead, 0.70 mm at 12.6 g where carbon PP needs 10 g (+26 %), or holes; and Theseus\'s own skin, 0.60 mm, a target: 175 walls of flow, inside the range, to be proven at the chin\'s rim (Brock, ~12:10: "Skin: 0.60 mm, to be proven").'],
    ['"super important concept though."', 'Given the chapter\'s molding demonstration and its own headline (F33.5); it hands straight to the next slide: a wall\'s stiffness goes with its thickness cubed.']
  ],
  draw: t => {
    const W0 = B05_W, T = B05_WALL_T, F0 = B05_FLOW, tau = t - T.go, x = 640, len = RM - x - 20, mgT = b05_rv(W0.mg.t, 2, true, 'higher');
    const ppWalls = Math.ceil(W0.pp.walls - 1e-9), skinWalls = Math.ceil(W0.skinWalls - 1e-9);   /* walls of flow needed: rounded up */
    header(t, 'How thin a wall can go');
    captions(t, [[0.3, 'The melt goes in at one gate and has to reach the farthest edge, about ' + F0.L + ' mm along the shell, before its skin freezes shut.'],
      [3.6, 'At the same weight, magnesium makes a ' + mgT + ' mm wall: thinner than it is usually molded.'],
      [6.2, 'Molded as usual, at 0.7 mm, magnesium is ' + b05_dn(W0.mg.atTyp, 1) + ' g of wall where carbon PP needs ' + W0.gpa + ' g. Or holes.'],
      [8.4, 'Theseus\'s skin, 0.60 mm, is a target to prove: ' + F0.L + ' mm is ' + skinWalls + ' skins, inside polypropylene\'s ' + F0.lo + ' to ' + F0.hi + '. A mould-flow check or first shots confirm it at the chin\'s rim.']]);
    /* ---- where: the simplified mouse, its wall lit, the gate under the crown, the flow to the front rim (M4) ---- */
    const m = mouseFit([LM, 270, 500, 200], 'left', { hi: ['shell'], col: 'ink', lit: 1 });
    const V = msView('left'), out = V.outPts, iTop = out.reduce((b, p, i) => (p[1] < out[b][1] ? i : b), 0);
    const path = []; for (let k = 0, i = iTop; k < out.length; k++) { path.push(m.P(out[i][0], out[i][1])); if (out[i][1] > -9.6 && k > 3) break; i = (i + 1) % out.length; }
    poly(path, { color: C.hero, w: 4, p: ep(t, 0.35, 1.9, E.lin) });
    const gp = path[0]; circle(gp[0], gp[1], 7, { fill: C.hero }); text('Gate', gp[0], gp[1] - 18, { role: 'label', size: 19, color: C.heroText, align: 'center' });
    text('From the gate under the crown to the farthest edge: about ' + F0.L + ' mm, measured on the 3D shell', LM, 520, { role: 'small', size: 22, weight: 600, color: C.mute, maxW: 500 });
    /* ---- the same weight, two walls: each process's cavity. Carbon PP's melt runs at its flow ratio's cautious end (150 walls) and
       fills; magnesium has no published flow ratio, so no melt is drawn in it: its wall is set against its own usual 0.7 mm ---- */
    const rows = [{ w: W0.mg, y: 420, hero: false }, { w: W0.pp, y: 670, hero: true }];
    const kFloor = ep(t, 3.6, 4.1), kDone = (() => { const d = b05_front(9, W0.pp.reach).done; return ep(t, T.go + d, T.go + d + 0.4); })();
    rows.forEach(rw => {
      const h = rw.w.t * T.s, sf = 2.4 * Math.pow(rw.w.t / W0.mg.t, 2);
      b05_cavity(x, rw.y, len, h, rw.hero ? { tau, t: rw.w.t, R: W0.pp.reach, sfreeze: sf, hero: true } : { tau: -1, t: rw.w.t, R: 0, floorPx: W0.mg.typ * T.s, floorA: kFloor });
      const ya = rw.y - h / 2 - 26 - 20;
      rich([{ s: rw.hero ? 'Carbon PP, PP-C-20A' : 'Magnesium AZ91D', role: 'label', size: 22, color: rw.hero ? C.heroText : C.secondText }, { s: b05_rv(rw.w.t, 2, !rw.hero, 'higher') + ' mm', role: 'num', size: 26, weight: 800, color: rw.hero ? C.heroText : C.ink, gap: 16 }, { s: 'at the same weight', role: 'small', size: 22, weight: 600, color: C.faint, gap: 12, sentence: false }], x, ya);
      /* under it: its own sourced limit, then (carbon PP) what happened, at the end of the wall */
      const yb = rw.y + h / 2 + 26 + 36;
      text(rw.hero ? 'Polypropylene runs ' + F0.lo + ' to ' + F0.hi + ' × its thickness (MIT 2.008)' : 'Thinner than its usual 0.7 mm (dashed); 0.5 mm only on small parts (Design News)', x, yb, { role: 'small', size: 22, weight: 600, color: rw.hero ? C.heroText : C.red, alpha: rw.hero ? kDone : kFloor, sentence: false });
      if (rw.hero) text('Fills: ' + ppWalls + ' walls of flow', x + len, yb, { role: 'label', size: 21, color: C.heroText, align: 'right', alpha: kDone });
    });
    text('Thickness drawn ' + T.s + '× the length\'s scale', x + len, 420 - W0.mg.typ * T.s / 2 - 46, { role: 'small', size: 21, weight: 560, color: C.faint, align: 'right', sentence: false });
    /* ---- what magnesium must do instead, and the headline ---- */
    const kp = ep(t, 6.2, 6.6), lx = LM;
    text('Magnesium at its usual wall', lx, 610, { role: 'label', size: 21, color: C.mute, alpha: kp });
    rich([{ s: '0.70 mm', role: 'num', size: 30, weight: 800, color: C.ink }, { s: 'and', role: 'small', size: 24, weight: 600, color: C.ink2, gap: 12, sentence: false }, { s: b05_dn(W0.mg.atTyp, 1) + ' g', role: 'num', size: 30, weight: 800, color: C.red, gap: 12 }, { s: 'per 100 cm²', role: 'small', size: 24, weight: 600, color: C.ink2, gap: 10, sentence: false }], lx, 652, { alpha: kp });
    rich([{ s: 'against carbon PP\'s', role: 'small', size: 24, weight: 600, color: C.ink2, sentence: false }, { s: W0.gpa + ' g', role: 'num', size: 26, weight: 800, color: C.heroText, gap: 10 }, { s: '(+' + b05_dn(W0.mgMore * 100) + ' %), or holes', role: 'small', size: 24, weight: 600, color: C.red, gap: 10, sentence: false }], lx, 692, { alpha: kp });
    text('Razer\'s magnesium Viper Mini SE: an open exoskeleton, 49 g (2023)', lx, 740, { role: 'small', size: 21, weight: 600, color: C.faint, alpha: ep(t, 6.8, 7.2), maxW: 500, sentence: false });
    verdict(t, 7.3, 1180, 900, { from: mgT, to: b05_rv(W0.pp.t, 2, false, 'higher'), unit: 'mm', dec: 2, label: 'The same weight\'s wall', better: 'thicker', who: ['Magnesium', 'Carbon PP'], size: 100, maxW: 660 });
    scaleNote(lx, 852, 'thinner than a credit card (0.76 mm)', { lead: mgT + ' mm', t, t0: 3.8 });
    text('Thickness cubed: the carbon PP wall is 1.7× stiffer, magnesium\'s modulus included.', lx, 950, { role: 'small', size: 22, weight: 650, color: C.ink2, alpha: ep(t, 8.6, 9.0), sentence: false });
    text('Derived: walls of flow = ' + F0.L + ' mm ÷ the wall (PP ' + F0.lo + ' to ' + F0.hi + ', MIT 2.008). Protolabs\' 0.889 mm is a rule of thumb, not a floor.', LM, 990, { role: 'small', size: 20, weight: 560, color: C.faint, sentence: false, maxW: 1080 });
  }
});

/* ============================== b05_cubed: shape beats weight, and a wall's tolerance is cubed (shlScatter, 7/10; F45) ==============================
   The film's one full ruler demonstration (F45: Brock liked the Codex version's, and its words): "Try bending a ruler flat.
   Release it. Turn it on its edge. Press again. The weight did not change." A 60 mm span of a 10 × 3.3 mm carbon PP strip,
   2.00 g, pressed with 10 N (a hard press): flat it bends 111 µm; turned on edge, 12 µm: 9.1× stiffer, the same grams
   (beam theory; stiffness goes with depth cubed). Structure beats weight. Then the same law against the mold: a mold's
   ±0.076 mm (Protolabs) on nine walls from nine cavities swings a 0.70 mm wall (magnesium's typical wall) from −29 % to +36 %
   in stiffness, a 1.00 mm carbon PP wall only −21 % to +25 %: 1.4× more alike. Both rows are plain walls (the cube law), so
   neither is Theseus: its shell is a 0.60 mm skin on 0.36 × 1.80 mm ribs (the lattice study), and on that study's own 3D
   model the same ±0.076 mm on every moulded size swings it −20.6 to +23.9 % against −14.2 to +16.1 % for a plain wall of
   its weight (P6, work/p6/fe: ±0.076 mm is ±21 % of a 0.36 mm rib). So the 1.00 mm row is a generic wall in neutral ink, the
   headline two plain stats, and one line says Theseus's skin is ribbed, its tolerances proven at first shots like the skin
   (main, 13:3x: plan B). The symptom, said as such: reviewers' units of one mouse disagree (RTINGS's ULX Competition
   creaked, Periview's had solid sides). The lattice-study slide calls back to this ruler (b12_ribs reads B05_C live). */
const B05_CUBE_T = { p1: [0.5, 1.6], rel: [2.0, 2.4], turn: [2.6, 3.8], p2: [4.0, 5.0], same: 5.2, rows: [6.2, 8.4], v: 9.0, sym: 9.8 };
S({
  id: 'b05_cubed', ch: 'shell', theme: 'night', title: 'Wall tolerance, cubed', settle: 12, ideas: [5, 75],
  src: ['b05Strip', 'shlPyrofil', 'b05Ji', 'b05Ucsb', 'b05ProtoTol', 'rtingsUlx', 'b05Peri', 'b05Fm', 'b05Won', 'b12Study'],
  replaces: ['shlScatter'],
  answers: [
    ['"don\'t use points"', 'No points anywhere: each wall\'s stiffness swing in %, and the headline "1.4× more alike" as two plain stats.'],
    ['"a little more intuitive"', 'The ruler first, the demonstration Brock liked (F45): pressed flat it bends; released, turned on its edge and pressed again, it barely moves: the same 2.00 g, 9.1× stiffer. Then nine walls from nine cavities, the swing landing on each.'],
    ['"but still quite lazy"', 'A demonstration now: the ruler pressed, released, turned on edge on screen and pressed again; the nine walls of each thickness laid out with their swing; and the symptom reviewers meet, units of one mouse that disagree.'],
    ['Checked (P6, 13:3x): is the 1.00 mm row Theseus?', 'No, and the slide no longer says so. Theseus is a 0.60 mm skin on 0.36 × 1.80 mm ribs. On the lattice study\'s own 3D model (fine mesh), the mould\'s ±0.076 mm on every moulded size swings its stiffness −20.6 to +23.9 % (span 44 %), a plain wall of the same 9.35 g −14.2 to +16.1 % (span 30 %): ±0.076 mm is ±21 % of a 0.36 mm rib. So both rows are generic plain walls in neutral ink (the cube law: 0.70 mm magnesium\'s typical wall against a 1.00 mm carbon PP wall), the headline is two plain stats, and one line says Theseus\'s skin is ribbed, its tolerances proven at first shots like the skin (review b05, P6).']
  ],
  draw: t => {
    const T = B05_CUBE_T, Cc = B05_C, R = Cc.ruler;
    header(t, 'Wall tolerance, cubed');
    captions(t, [[0.3, 'Try bending a ruler flat. Release it. Turn it on its edge. Press again. The weight did not change.'], [5.2, 'Shape buys more than thinning: depth goes in cubed. On edge, the same grams are ' + b05_dn(Cc.rulerK, 1) + '× as stiff.'], [6.2, 'The same law against the mold: its ±0.076 mm swings a thin wall\'s stiffness far more than a thicker one\'s.'], [9.8, 'Thin walls make mice that differ unit to unit: the one you get may not be the one in the review.']]);
    /* ---- the ruler: pressed flat, released, turned on edge, pressed again (F45) ---- */
    const r = demoPanel(t, -1, [LM, 280, 800, 400], { label: 'Try it with a ruler', src: 'Ji, Manchester; UCSB' });
    const k = ep(t, T.turn[0], T.turn[1], E.io3), th = k * Math.PI / 2, load = ep(t, T.p1[0], T.p1[1], E.io3) * (1 - ep(t, T.rel[0], T.rel[1], E.io3)) + ep(t, T.p2[0], T.p2[1], E.io3);
    const I = (R.b * R.h ** 3 / 12) * Math.cos(th) ** 2 + (R.h * R.b ** 3 / 12) * Math.sin(th) ** 2, d = R.P * R.L ** 3 / (48 * B05_MAT.pp.E * I) * load;
    const s = 8.5, x1 = r[0] + 40, y1 = r[1] + 110, Lp = R.L * s, ex = 100, hpx = lerp(R.h, R.b, Math.sin(th)) * s * 0.9;
    const pts = Array.from({ length: 41 }, (_, i) => { const u = i / 40; return [x1 + Lp * u, y1 + d * ex * s * 4 * u * (1 - u) * (u < 0.5 ? 1 : 1)]; });
    G.save(); G.lineJoin = 'round'; G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1] - hpx / 2) : G.moveTo(p[0], p[1] - hpx / 2)); for (let i = pts.length - 1; i >= 0; i--) G.lineTo(pts[i][0], pts[i][1] + hpx / 2); G.closePath();
    G.fillStyle = mix(C.hero, C.bg, 0.25); G.fill(); G.strokeStyle = C.hero; G.lineWidth = 2; G.stroke();
    for (let i = 1; i < 30; i++) { const p = pts[Math.round(i * 40 / 30)]; line(p[0], p[1] - hpx / 2, p[0], p[1] - hpx / 2 + (i % 5 ? 6 : 12), { color: C.bg, w: 1.5, alpha: 0.8 }); }
    G.restore();
    feSupport([x1, y1 + hpx / 2 + 2], 'pin', {}); feSupport([x1 + Lp, y1 + hpx / 2 + 2], 'roll', {});
    /* the finger to scale with the ruler (F54.2), lit on night (no glow: FG), from the upper right so it stays inside the panel;
       the force on its left */
    const mid = pts[20]; if (load > 0.01) { finger(mid[0], mid[1] - hpx / 2, Math.PI - 0.42, { s, surf: 0, press: load, len: 20 });
      forceArrow(mid[0] - 9 * s, mid[1] - hpx / 2 - 4, Math.PI / 2, 60, { N: R.P * load, dec: 0, color: C.ink, k: 1, side: 'l' }); }
    /* its section, end on, turning (the pointer turns it), with its size */
    const scx = r[0] + r[2] - 90, scy = r[1] + 70; G.save(); G.translate(scx, scy); G.rotate(th); rr(-R.b * 4.5, -R.h * 4.5, R.b * 9, R.h * 9, 2, mix(C.hero, C.bg, 0.25), C.hero, 2, 1); G.restore();
    if (t > T.turn[0] - 0.4 && t < T.turn[1] + 0.4) { const aa = th + 0.35; cursorAt(t, [[T.turn[0] - 0.3, [scx + 90, scy + 60]], [T.turn[0], [scx + Math.cos(aa) * 52, scy + Math.sin(aa) * 52]], [T.turn[1], [scx + Math.cos(0.35 + Math.PI / 2) * 52, scy + Math.sin(0.35 + Math.PI / 2) * 52]]], [], { a: ep(t, T.turn[0] - 0.4, T.turn[0] - 0.1) * (1 - ep(t, T.turn[1], T.turn[1] + 0.3)), grab: t > T.turn[0] }); }
    text(k < 0.5 ? '10 × 3.3 mm' : '3.3 × 10 mm', scx, scy + 74, { role: 'label', size: 19, color: C.mute, align: 'center' });
    /* what happened, under it */
    const yS = r[1] + r[3] - 70, flatA = ep(t, T.p1[1] - 0.2, T.p1[1] + 0.1);
    rich([{ s: k < 0.5 ? 'Flat' : 'On edge. Same weight', role: 'label', size: 21, color: k < 0.5 ? C.ink2 : C.heroText }, { s: fmtN(R.g, 2) + ' g', role: 'num', size: 26, weight: 800, color: C.ink, gap: 16 }, { s: 'bends', role: 'small', size: 22, weight: 600, color: C.mute, gap: 16, sentence: false }, { s: fmtN((k < 0.5 ? R.flat : R.edge) * 1000, 0) + ' µm', role: 'num', size: 26, weight: 800, color: k < 0.5 ? C.ink : C.heroText, gap: 10 }, { s: 'at 10 N', role: 'small', size: 22, weight: 600, color: C.mute, gap: 10, sentence: false }], r[0], yS, { alpha: Math.max(flatA, ep(t, T.p2[1] - 0.2, T.p2[1] + 0.1)) });
    const ks = ep(t, T.same, T.same + 0.4);
    if (ks > 0) rich([{ s: b05_dn(Cc.rulerK, 1) + '×', font: 'disp', size: 40, weight: 800, color: C.heroText, grad: C.heroGrad, caps: false }, { s: 'stiffer on edge, the same ' + fmtN(R.g, 2) + ' g', role: 'small', size: 23, weight: 650, color: C.ink2, gap: 14, sentence: false }], r[0], yS + 50, { alpha: ks });
    /* ---- the walls: nine cavities, each off by up to the mold's tolerance; each wall's stiffness against its nominal ---- */
    /* both rows are plain walls (the cube law): neither is Theseus, whose skin is ribbed (the line under the ruler says so) */
    const rows = [{ w: Cc.thin, name: 'A 0.70 mm wall (magnesium\'s typical wall, Design News)', col: C.comp, tcol: C.ink2 }, { w: Cc.ths, name: 'A 1.00 mm carbon PP wall (and lighter)', col: C.ink2, tcol: C.ink }], gx = 960, gw = 860;
    const kR = ep(t, T.rows[0] - 0.4, T.rows[0]);
    text('Nine walls, nine cavities, each within a mold\'s ±0.076 mm (Protolabs)', gx, 300, { role: 'label', size: 19, color: C.mute, maxW: RM - gx, alpha: 0.35 + 0.65 * kR });
    rows.forEach((rw, i) => {
      const yb = 470 + i * 200, ka = ep(t, T.rows[0] + i * 1.1, T.rows[0] + i * 1.1 + 1.0), md = yb - 60, sc = 160;
      text(rw.name, gx, yb - 136, { role: 'small', size: 22, weight: 600, color: rw.tcol, maxW: RM - gx - 220, alpha: 0.35 + 0.65 * kR });   /* one style for both rows (a label over 48 characters turns small) */
      line(gx, md, gx + gw, md, { color: C.hair, w: 1.5 });
      Cc.offs.forEach((o, j) => { const dd = Math.pow((rw.w.t + o) / rw.w.t, 3) - 1, x = gx + 40 + j * 92, h = -dd * sc * clamp(ka * 1.2 - j * 0.05); rr(x - 14, Math.min(md, md + h), 28, Math.abs(h), 2, rw.col, null, 0, 1); });
      const kb = ep(t, T.rows[0] + i * 1.1 + 1.0, T.rows[0] + i * 1.1 + 1.4);
      text('−' + b05_dn(-rw.w.lo * 100) + ' % to +' + fmtN(rw.w.hi * 100, 0) + ' %', gx + gw, yb - 136, { role: 'num', size: 26, weight: 800, color: rw.tcol, align: 'right', alpha: kb });
      text('stiffness', gx + gw, yb - 108, { role: 'small', size: 19, weight: 600, color: C.faint, align: 'right', alpha: kb, sentence: false });
    });
    /* ---- the headline: how far apart two walls of one design can be, thin wall → carbon PP's ---- */
    const sp0 = (Cc.thin.hi - Cc.thin.lo) * 100, sp1 = (Cc.ths.hi - Cc.ths.lo) * 100;
    /* the headline as two plain stats in neutral ink (FILM F8: blue is Theseus's alone, and neither wall is Theseus); the thin wall
       is magnesium's, so it is the one struck */
    { const k = ep(t, T.v, T.v + 0.5), k2 = ep(t, T.v + 0.4, T.v + 0.9), hy = 868, v0 = Math.round(sp0) + ' %', v1 = Math.ceil(sp1) + ' %', w0 = tw(v0, { font: 'disp', size: 64, weight: 800 });
      if (k > 0.003) {
        text('Stiffness swing between two walls of one design {(lower is better)}', gx, hy - 96, { role: 'label', size: 20, color: C.mute, alpha: k, maxW: RM - gx });
        text(v0, gx, hy, { font: 'disp', size: 64, weight: 800, color: C.mute, alpha: k, caps: false });
        line(gx - 4, hy - 22, gx + w0 + 4, hy - 22, { color: C.mute, w: 4, alpha: k * k2 });
        arrow(gx + w0 + 18, hy - 22, gx + w0 + 70, hy - 22, { color: C.faint, w: 3, hs: 12, alpha: k });
        text(v1, gx + w0 + 88, hy, { font: 'disp', size: 96, weight: 800, color: C.ink, alpha: k2, caps: false });
        text('0.70 mm wall', gx, hy + 38, { role: 'label', size: 19, color: C.mute, alpha: k });
        text('1.00 mm wall', gx + w0 + 88, hy + 38, { role: 'label', size: 19, color: C.ink2, alpha: k2 });
        text(b05_dn(sp0 / sp1, 1) + '× more alike', gx + w0 + 88 + tw(v1, { font: 'disp', size: 96, weight: 800 }) + 30, hy - 10, { role: 'small', size: 26, weight: 750, color: C.ink, alpha: k2, sentence: false });
      } }
    /* Theseus is not either wall: its skin is ribbed (the lattice study), and its tolerances are proven at first shots like its skin */
    text('Theseus\'s shell isn\'t a plain wall: a 0.60 mm skin on 0.36 × 1.80 mm ribs (the lattice study); its tolerances are proven at first shots.', LM, 862, { role: 'small', size: 21, weight: 650, color: C.ink2, maxW: 820, lh: 1.3, sentence: false, alpha: ep(t, T.sym + 0.6, T.sym + 1.0) });
    text('Thin shells differ unit to unit. One mouse, two verdicts: RTINGS\'s ULX Competition (a carbon-composite shell), "noticeable creaking, popping, and flexibility"; Periview\'s, "The sides are solid"', LM, 760, { role: 'small', size: 21, weight: 600, color: C.mute, maxW: 820, sentence: false, alpha: ep(t, T.sym, T.sym + 0.4) });
    scaleNote(LM, 952, 'a hard press: a 1 kg bag of sugar (Won 2009: five times the hardest desk grip)', { lead: '10 N', t, t0: T.p1[0], size: 22 });
    text('Beam theory: a 60 mm span, PP-C-20A (13.5 GPa); bend drawn ' + 100 + '× real. Walls: flat, stiffness ∝ thickness³', LM, 990, { role: 'small', size: 20, weight: 560, color: C.faint, sentence: false });
  }
});

/* ============================== b05_fallacy: the strength–weight fallacy (Brock, shlPick 7/10) ==============================
   The fallacy (F14.5): a heavier mouse is a stronger one. Two mice on a balance: the GPX 2 (59.4 g, RTINGS) and the Sora V2
   (40.9 g, RTINGS); the beam tips 18 g toward the GPX 2. The same squeeze at the sides of both: the heavier GPX 2 creaks
   (TechPowerUp 2023: "some creaking but no flexing of the shell"); the Sora V2 "feels solid" (RTINGS). Brock's note named the
   ULX; its Competition's build is disputed (RTINGS found creaking in its unit, Periview solid sides: BROADCAST-0945), so the
   light mouse is one whose build no source disputes.
   Nothing on the slide says the GPX 2 is well built (his note). Then the trade-off most mice live on, as one straight line
   (his notes: strength up, higher is better; weight across; the area grows to the right with the strength): a solid plane,
   the press it takes to crack against its weight (2D frames, the same pieces as the next slide). The pointer drags its
   weight up the line and the piece thickens: strength bought gram for gram. The line hands to b05_nopick, which opens on it.
   No Theseus number here: the payoff is the fallacy named. */
const B05_FAL_T = { tip: 0.35, sq: [2.0, 2.5, 3.3], line: [4.8, 5.6], drag: [6.0, 7.8], pay: 8.4 };
/** a piece of solid plane in an oblique view: the 60 × 10.4 mm face at s px/mm, its thickness out of the page (w mm, drawn
   k × real) going back at 30°; (x, y) the face's bottom left. Returns the face's right edge x */
function b05_slab(x, y, s, w, k, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha, W = 60 * s, H = 10.39 * s, d = w * k * s, dx = d * Math.cos(Math.PI / 6), dy = -d * Math.sin(Math.PI / 6);
  G.save(); G.globalAlpha = a; G.lineJoin = 'round';
  G.beginPath(); G.moveTo(x, y - H); G.lineTo(x + dx, y - H + dy); G.lineTo(x + W + dx, y - H + dy); G.lineTo(x + W, y - H); G.closePath();
  G.fillStyle = mix(C.comp, C.bg, 0.35); G.fill(); G.strokeStyle = inkA(0.5); G.lineWidth = 1.4; G.stroke();
  G.beginPath(); G.moveTo(x + W, y - H); G.lineTo(x + W + dx, y - H + dy); G.lineTo(x + W + dx, y + dy); G.lineTo(x + W, y); G.closePath();
  G.fillStyle = mix(C.comp, C.bg, 0.15); G.fill(); G.stroke();
  G.fillStyle = C.comp; G.fillRect(x, y - H, W, H); G.strokeRect(x, y - H, W, H);
  G.restore();
  return x + W + dx;
}
S({
  id: 'b05_fallacy', ch: 'shell', theme: 'paper', title: 'The strength–weight fallacy', settle: 11, ideas: [15, 75],
  src: ['b05RtGpx2', 'b05RtSora', 'b05Tpu', 'shlRtingsSoraUlx', 'shlPyrofil'],
  replaces: ['shlPick'],
  answers: [
    ['"gpx 2 has worse build quality than the ulx even though it was heavier, this demonstrates the fallacy"', 'Shown, not said: two mice on a balance, the GPX 2 (59.4 g) and the Sora V2 (40.9 g, both RTINGS), the beam tipping 18 g toward the GPX 2; then the same squeeze on both, the GPX 2 creaking at its seam (TechPowerUp: "some creaking but no flexing of the shell") and the Sora V2 holding (RTINGS: it "feels solid"). The payoff names it: 18 g heavier, and it still creaks. The ULX is not used: its Competition\'s build is disputed (RTINGS found creaking in its unit, Periview solid sides), a question for Brock in the report.'],
    ['"i dont like that it says the gpx 2 has good build quality"', 'Nothing on the slide says it. The RTINGS comparison the old slide quoted (it rates the GPX 2\'s build above its ULX Competition unit) is gone.'],
    ['"also i think the line might be unintuitive at a glance"', 'One straight line from zero, labelled in words at both ends, "Light: it flexes" and "Stiff: it\'s heavy", and the pointer drags a piece up it while the piece thickens beside the chart.'],
    ['"i think the axes need to be formatted and labeled differently"', 'Up: "Press to flex it 0.1 mm, N (higher is better)"; across: "Weight of the piece" in grams; round ticks.'],
    ['"also you expect the right to mean weaker and lighter at a glance be because it has the least area under the curve, not the other way around"', 'Higher is better on the new axis, so the line rises to the right: the right is heavier and stiffer, and the area under it grows that way.'],
    ['"maybe y should measure strength not flex, i feel as if that would be more intuitive to understand."', 'Partly: y is now a press (higher is better), not a flex: the press it takes to bend the piece by a sheet of paper. It is stiffness, not the press to break, because under his two strengths (F41.1) the triangles\' win that the next slide shows is in stiffness; a question for Brock in the report.'],
    ['F2.11: "show how most mice make you pick between strength and weight"', 'The line is the pick: a solid plane only gets stiffer by getting heavier. The next slide opens on the same line and answers it.'],
    ['F14.5: call it the fallacy', 'The title says it, and the payoff line names it on the two mice.'],
    ['FILM F34 (the ruler\'s message, structure over weight, is this slide\'s thesis)', 'The ruler stays on b05_cubed, the slide before, where it demonstrates the cube law that slide applies to the mould; this slide\'s last caption calls it back in words a clip viewer needs no slide for: "Where the material goes is: a ruler is stiffer on its edge."']
  ],
  draw: t => {
    const T = B05_FAL_T, B = b05_fr();
    header(t, 'The strength–weight fallacy');
    captions(t, [[0.4, 'The fallacy: heavier is stronger. The GPX 2 weighs 18 g more than the Sora V2.'], [2.0, 'Squeeze both at the sides: the heavier GPX 2 creaks. The Sora V2 feels solid.'], [4.8, 'A solid plane does trade weight for stiffness: the press it takes to flex it grows gram for gram.'], [8.4, 'Weight isn\'t what makes a shell solid. Where the material goes is: a ruler is stiffer on its edge.']]);
    const gGpx = 59.4, gUlx = 40.9, dG = gGpx - gUlx;
    /* ---- left, top: the balance. GPX 2 on the left pan, the Sora V2 on the right ---- */
    const bal = b05_balance(470, 330, 230, 118, { m1: gGpx, m2: gUlx, m0: 40, max: 0.16, t, t0: T.tip, panW: 210,
      draw1: (x, y) => b05_rivalSide(x, y - 3, 168, { fill: mix(C.second, C.bg, 0.78), edge: C.second }),
      draw2: (x, y) => b05_rivalSide(x, y - 3, 168, { fill: C.panel, edge: C.comp }) });
    const lab = (p, name, g, col, x) => rich([{ s: name, role: 'label', size: 21, color: col }, { s: fmtN(g, 1) + ' g', role: 'num', size: 26, weight: 800, color: C.ink, gap: 12, tnum: true }], x, p[1] + 58, { align: 'center' });
    lab(bal.p1, 'GPX 2', gGpx, C.secondText, bal.p1[0]); lab(bal.p2, 'Sora V2', gUlx, C.ink2, bal.p2[0]);
    const kd = ep(t, T.tip + 0.8, T.tip + 1.2);
    if (kd > 0) text('+' + Math.floor(dG) + ' g', bal.p1[0] - 150, bal.p1[1] - 40, { font: 'disp', size: 40, weight: 800, color: C.ink, align: 'center', alpha: kd, caps: false });
    text('Measured weights, RTINGS', LM, 572, { role: 'small', size: 20, weight: 560, color: C.faint, sentence: false });
    /* ---- left, below: the same squeeze on both, two fingertips at the sides ---- */
    const kIn = ep(t, T.sq[0], T.sq[1], E.out3), kP = ep(t, T.sq[1], T.sq[2], E.io3);
    [[260, true], [680, false]].forEach(([fx, gpx]) => {
      const yb = 772, wd = 196;
      text(gpx ? 'GPX 2' : 'Sora V2', fx, 618, { role: 'label', size: 21, color: gpx ? C.secondText : C.ink2, align: 'center' });
      if (gpx) text('The same squeeze', 470, 782, { role: 'small', size: 20, weight: 600, color: C.mute, align: 'center', alpha: kIn, sentence: false });
      const fr = b05_rivalFront(fx, yb, wd, { fill: gpx ? mix(C.second, C.bg, 0.78) : C.panel, edge: gpx ? C.second : C.comp });
      /* the squeeze: a thumb and a finger's push on each side, the same on both (M3), coming in and growing with the press */
      const ys = yb - 30, L0 = 22 + 34 * kP;
      if (kIn > 0) { forceArrow(fx - wd / 2 - 6, ys, 0, L0 * kIn, { color: C.ink, w: 4 }); forceArrow(fx + wd / 2 + 6, ys, Math.PI, L0 * kIn, { color: C.ink, w: 4 }); }
      /* the creak, where its top shell meets its sides (TechPowerUp: no flex, so the outline doesn't move) */
      if (gpx) { b05_creak(fr.L, -Math.PI * 0.8, kP); b05_creak(fr.R, -Math.PI * 0.2, kP); }
      const kq = ep(t, T.sq[2] - 0.2, T.sq[2] + 0.3);
      const q = text(gpx ? '"some creaking but no flexing of the shell"' : '"feels solid"', fx, 818, { role: 'small', size: 22, weight: 650, color: gpx ? C.red : C.ink, align: 'center', alpha: kq, sentence: false, maxW: 300, lh: 1.25 });
      text(gpx ? 'TechPowerUp, 2023' : 'RTINGS', fx, 818 + (q && q.h ? q.h : 28) + 2, { role: 'small', size: 20, weight: 560, color: C.faint, align: 'center', alpha: kq, sentence: false });
      /* (FILM F17's callback is dropped: the facts about the ULX Competition's build disagree, BROADCAST-0945) */
    });
    /* ---- right: the pick. One solid plane, its press to crack against its weight: a straight line (his notes) ---- */
    const cx = 1200, cy = 340, cw = 620, ch = 270, xr = [0, 0.6], yr = [0, 40];
    const m = axes(t, { x: cx, y: cy, w: cw, h: ch, xr, yr, xticks: [0, 0.2, 0.4, 0.6], yticks: [0, 10, 20, 30, 40], xfmt: v => fmtN(v, 1) + ' g', yfmt: v => String(v), t0: -0.6, xlabel: 'Weight of the piece' });
    text('Press to flex it 0.1 mm, N {(higher is better)}', cx - 14, cy - 34, { role: 'label', size: 21, color: C.mute });
    const kl = ep(t, T.line[0], T.line[1], E.io3), yEnd = B.perG.plate * xr[1];
    line(m.X(0), m.Y(0), m.X(xr[1]), m.Y(yEnd), { color: C.ink2, w: 3, p: kl, cap: 'round' });
    const kw = ep(t, T.line[1] - 0.1, T.line[1] + 0.3);
    text('Light: it flexes', m.X(0.04), m.Y(10), { role: 'label', size: 20, color: C.ink2, alpha: kw });
    text('Stiff: it\'s heavy', m.X(xr[1]), m.Y(yEnd) - 36, { role: 'label', size: 20, color: C.ink2, align: 'right', alpha: kw });
    /* the pointer drags the piece's weight up the line; the piece beside the chart thickens with it */
    const g0 = 0.12, g1 = 0.55, kg = ep(t, T.drag[0], T.drag[1], E.io3), gNow = lerp(g0, g1, kg), Fnow = B.perG.plate * gNow;
    const kpt = ep(t, T.drag[0] - 0.4, T.drag[0]);
    if (kpt > 0) {
      circle(m.X(gNow), m.Y(Fnow), 9, { fill: C.ink2, alpha: kpt });
      cursorAt(t, [[T.drag[0] - 0.5, [m.X(g0) + 50, m.Y(B.perG.plate * g0) + 60]], [T.drag[0], [m.X(g0) + 4, m.Y(B.perG.plate * g0) + 6]], [T.drag[1], [m.X(g1) + 4, m.Y(B.perG.plate * g1) + 6]]], [], { a: kpt * (1 - ep(t, T.drag[1] + 0.5, T.drag[1] + 0.9)), grab: t > T.drag[0] });
    }
    const w = gNow / (Mp_rho_mm3() * 60 * 10.39), sx = 1200, sy = 850;
    text('A 60 mm piece of solid plane, pressed on its edge', sx, 730, { role: 'label', size: 20, color: C.mute });
    const xe = b05_slab(sx, sy, 4.2, w, 12, {});
    rich([{ s: b05_dn(gNow, 2) + ' g', role: 'num', size: 30, weight: 800, color: C.ink, tnum: true }], xe + 30, sy - 50);
    rich([{ s: 'flexes 0.1 mm under', role: 'small', size: 22, weight: 600, color: C.mute, sentence: false }, { s: fmtN(Fnow, 1) + ' N', role: 'num', size: 30, weight: 800, color: C.ink, tnum: true, gap: 10 }], xe + 30, sy - 10);
    text('Thickness drawn 12× real (the chapters\' test strip)', sx, sy + 40, { role: 'small', size: 20, weight: 560, color: C.faint, sentence: false });
    /* ---- the payoff: the fallacy, named on the two mice. No Theseus number on this slide ---- */
    const kz = ep(t, T.pay, T.pay + 0.4);
    rich([{ s: Math.floor(dG) + ' g heavier,', font: 'disp', size: 54, weight: 800, color: C.ink, caps: false }, { s: 'and it still creaks.', font: 'disp', size: 54, weight: 800, color: C.red, gap: 18, caps: false }], LM, 985, { alpha: kz });
  }
});
/** carbon PP's density in g per mm³ */
function Mp_rho_mm3() { return B05_MAT.pp.rho / 1000; }

/* ============================== b05_nopick: you don't have to pick (Brock: "a really important concept") ==============================
   The header on frame one (G9), with the chart under it: the solid plane's line (the fallacy slide's comparison, the same
   axes) and, once the demonstration has drawn it, the method's own line (his note). The demonstration first: two pieces of
   the chapters' test strip (b06's B06_STRIP: 60 mm, the same weight), pressed on their edge (the principle in 2D: the slide
   claims nothing about a whole mouse in the hand, review M-b05-2), the same finger, the same 10 N (a hard press). It leads
   with stiffness (F41.1: under his two strengths ribs of one width break before the solid plane, so no strength is
   claimed): the triangles flex less; their point lands on the chart, their line draws through it, and the pointer slides it
   down the line to the plane's stiffness: as stiff at less weight. Every number is b05_fr()'s, and so are the answers. */
S(b05_live({
  id: 'b05_nopick', ch: 'shell', theme: 'night', title: 'You don\'t have to pick', settle: 10, ideas: [75, 15, 93],
  src: ['shlPyrofil', 'b05Won'],
  replaces: ['shlNoPick', 'shlShell3d'],
  answers: B => [
    ['"the what if uoh didn\'t have to pick shouldn\'t be the only thing on the screen for a start animation, it should just be the header"', 'The title, YOU DON\'T HAVE TO PICK, is the header from the first frame, set like every other title, with the two parts and the chart already under it. There is no question on its own anywhere.'],
    ['"i\'ve pointed this out before and im concerned you didn\'t change it, it makes me worry you\'re missing my other feedback"', 'Changed: the header leads the first frame, and every clause of his notes on the two slides this one replaces is answered in this list. The strength meter he cut is drawn by no slide in this file.'],
    ['"i have all the same comparisons here as the last slide"', 'It keeps the fallacy slide\'s comparison on purpose (the solid plane\'s line on the same axes: the press it takes to flex a piece 0.1 mm, against its weight) and adds what that slide doesn\'t have: the way out, demonstrated and drawn as its own line.'],
    ['"this graph feels even more intuitive at a glance"', 'Read as "less intuitive": the graph is rebuilt. Up: the press it takes to flex the piece 0.1 mm, a sheet of copy paper (higher is better); across: its weight; two straight lines from zero: the solid plane in grey, Theseus\'s triangles in blue above it at every weight.'],
    ['"i feel like our method should have a separate line"', `The method is its own blue line, drawn through the point the demonstration just measured: Theseus's triangles, ribs ${fmtN(B.ST.ribW, 1)} mm wide (the chapters' test strip, b06).`],
    ['"this is a really important concept, but i genuinely have no idea what it\'s show graphically"', `The demonstration says it before the chart: two ${fmtN(B.g, 2)} g pieces of the same carbon PP, a strip across the top ${B.ST.span} mm long (the mouse's width), the same finger and the same 10 N (a hard press: a 1 kg bag of sugar); the solid plane flexes ${fmtN(B.iP.flex, 3)} mm, Theseus's triangles ${fmtN(B.iT.flex, 3)} mm. Then the chart shows both ways out of the pick: ${b05_dn(B.stiff, 1)}× as stiff at the same weight (${Math.round(B.p01(B.iP))} → ${Math.floor(B.p01(B.iT))} N to flex it 0.1 mm, the headline), or as stiff at ${b05_dn((1 - B.sameFlex) * 100)} % less weight (the pointer slides the point down its line). It leads with stiffness: under his two strengths (F41.1) ribs of one width break first (${b05_dn(B.Ft / B.Fp, 2)}× the solid plane's press), so the slide claims no strength. It says it is the principle in 2D, nothing about a whole mouse in the hand.`],
    ['shlShell3d: "hard to understand"', 'The 3D stress study is not on this slide; the comparison is two plain 2D parts under one finger.'],
    ['shlShell3d: "and cut the strength graphs that last multiple slides, they were a bad idea"', 'Cut: no slide in this file draws the shell meter. This chart belongs to this slide: the fallacy slide before it draws only the solid plane\'s line, and this slide redraws that line in its first second as its own.'],
    ['F2.11: "follow that up with a what if you didn\'t have to pick... but find a good transition"', 'The fallacy slide ends on the solid plane\'s line and "where the material goes"; this slide opens on the same line and answers it.'],
    ['F2.09: "a bar of flex or strength to weight dropping"', 'Replaced by his later note on shlShell3d (cut the meter). The lattice on a lighter mouse is b06\'s.'],
    ['F33.5: an important idea, executed wrong', 'Rebuilt from the ground: a demonstration, a two-line chart and one headline.']
  ],
  draw: t => {
    const B = b05_fr(), H = B.H, sc = 150, s = 9, iP = B.iP, iT = B.iT, gLo = B.g * B.sameFlex;
    header(t, 'You don\'t have to pick');
    captions(t, [[0.6, 'A solid plane only gets stiffer by getting heavier. The same weight, the same 10 N: it flexes more.'], [5.4, 'Triangles: ' + b05_dn(B.stiff, 1) + '× as stiff at the same weight, or as stiff at ' + b05_dn((1 - B.sameFlex) * 100) + ' % less weight.']]);
    /* ---- left: the demonstration. One finger each, one press for both (M3): 10 N, a 1 kg bag of sugar (FILM F4) ---- */
    const F = lerp(0, B.P0, ep(t, 1.0, 3.2, E.io3)), a0 = 1;
    rich([{ s: 'Press', role: 'label', size: 21, color: C.mute }, { s: fmtN(F, 0), role: 'd1', size: 56, weight: 800, color: C.ink, tnum: true, gap: 14 }, { s: 'N', role: 'label', size: 24, color: C.mute, gap: 8, caps: false }, { s: 'on each, the same finger', role: 'small', size: 23, weight: 600, color: C.faint, gap: 22, sentence: false }], LM, 330, { alpha: ep(t, 0.9, 1.2) });
    const rows = [{ oy: 580, name: 'A solid plane', hero: false, r: B.plate, i: iP }, { oy: 830, name: 'Theseus\'s triangles', hero: true, r: B.tri, i: iT }], ox = 430, rx = 770;
    const kr = ep(t, 1.2, 1.6);
    text('Flex under the press', rx, 404, { role: 'label', size: 19, color: C.mute, alpha: kr });
    text('(lower is better)', rx, 430, { role: 'small', size: 21, weight: 600, color: C.faint, alpha: kr, sentence: false });
    rows.forEach(rw => {
      const P = p => [ox + p[0] * s, rw.oy - p[1] * s], ty = rw.oy - 112;
      if (!rw.hero) b05_drawPlane(F, P, { sc, alpha: a0 }); else b05_drawTri(rw.r, F, P, s, t, { sc, alpha: a0, flow: 0.45 });
      /* the finger lies along the part with its pad on the middle and rides it down; a pale edge on the night stage (R-b05-2) */
      const tp = b05_topMid(rw.r, P, F, sc, H), kf = ep(t, 0.5, 1.0, E.out3);
      finger(tp[0] - (1 - kf) * 26, tp[1] - (1 - kf) * 12, 0.42, { s, surf: 0, press: clamp(F / B.P0), len: 24, alpha: kf });   /* to scale (s), pad flat; lit on night (FG) */
      const nm = text(rw.name, rx, ty, { role: 'label', size: 22, color: rw.hero ? C.heroText : C.ink2, alpha: a0, maxW: 330, lh: 1.2 });
      const yw = ty + nm.h + 4;
      rich([{ s: 'Weight', role: 'label', size: 19, color: C.mute }, { s: fmtN(B.g, 2) + ' g', role: 'num', size: 24, weight: 750, color: rw.hero ? C.heroText : C.ink, gap: 10 }], rx, yw, { alpha: a0 });
      rich([{ s: fmtN(rw.i.flex * F / B.P0, 3), role: 'num', size: 40, weight: 800, color: rw.hero ? C.heroText : C.ink, tnum: true }, { s: 'mm', role: 'label', size: 19, color: C.mute, gap: 8, caps: false }], rx, yw + 58, { alpha: kr });
    });
    scaleNote(LM, 952, 'a hard press: a 1 kg bag of sugar, five times the hardest grip measured at a desk (Won 2009)', { lead: '10 N', t, t0: 3.2, size: 22 });
    /* the heat key (F19.3, M's must via K 11:16): the parts are coloured by the share of their strength used, squared */
    heatKey(t, 1.0, 770, 630, 240, { gamma: SHL_GAMMA, title: 'Strength used, colour squared' });
    text(fmtN(B.g, 2) + ' g pieces of a strip across the top, 60 mm (the mouse\'s width), in 2D; flex drawn ' + sc + '× real; colour: strength used, squared', LM, 990, { role: 'small', size: 21, weight: 560, color: C.faint, alpha: ep(t, 1.2, 1.6), sentence: false });
    /* ---- right: the chart. The press it takes to flex each piece 0.1 mm (a sheet of copy paper), against its weight ---- */
    const cx = 1200, cy = 340, cw = 620, ch = 270, xr = [0, 0.6], yr = [0, 40];
    const m = axes(t, { x: cx, y: cy, w: cw, h: ch, xr, yr, xticks: [0, 0.2, 0.4, 0.6], yticks: [0, 10, 20, 30, 40], xfmt: v => fmtN(v, 1) + ' g', yfmt: v => String(v), t0: -0.6, xlabel: 'Weight of the piece (added out of the page)' });
    text('Press to flex it 0.1 mm, N {(higher is better)}', cx - 14, cy - 34, { role: 'label', size: 21, color: C.mute, alpha: a0 });
    /* the solid plane's line, from frame one: stiffness bought with weight, gram for gram */
    const kg = ep(t, 0.0, 0.7, E.io3), yEnd = B.perG.plate * xr[1];
    line(m.X(0), m.Y(0), m.X(xr[1]), m.Y(yEnd), { color: C.ink2, w: 3, p: kg, cap: 'round' });
    /* the two measured points land when the press is on: the same weight */
    const gx = B.g, vP = B.p01(iP), vT = B.p01(iT), kpt = ep(t, 3.3, 3.7, E.snap), kb = ep(t, 3.6, 4.1, E.snap);
    if (kpt > 0) { circle(m.X(gx), m.Y(vP), 8 * kpt, { fill: C.ink2 }); text(fmtN(vP, 0) + ' N', m.X(gx) + 14, m.Y(vP) + 30, { role: 'num', size: 22, weight: 700, color: C.ink2, align: 'left', alpha: kpt }); }
    text('Solid plane', m.X(gx) + 14, m.Y(vP) + 56, { role: 'label', size: 19, color: C.ink2, alpha: ep(t, 0.7, 1.0) });
    if (kb > 0) {
      line(m.X(gx), m.Y(vP) - 10, m.X(gx), lerp(m.Y(vP) - 10, m.Y(vT) + 14, kb), { color: C.heroText, w: 2, dash: [5, 5] });
      heroMark(m.X(gx), m.Y(vT), 12, kb);
      text(b05_dn(vT) + ' N', m.X(gx), m.Y(vT) - 22, { role: 'num', size: 24, weight: 800, color: C.heroText, align: 'center', alpha: kb });
    }
    /* Theseus's own line, through its point */
    const kl = ep(t, 5.6, 6.4, E.io3), gTop = Math.min(xr[1], yr[1] / B.perG.tri);
    if (kl > 0) { line(m.X(0), m.Y(0), m.X(gTop), m.Y(B.perG.tri * gTop), { color: C.hero, w: 4, p: kl, cap: 'round' }); text('Theseus', m.X(gTop) - 6, m.Y(B.perG.tri * gTop) - 14, { role: 'label', size: 19, color: C.heroText, align: 'right', alpha: ep(t, 6.2, 6.5) }); }
    /* the pointer slides its point down its line to the plane's stiffness: the weight it no longer needs */
    const kd = ep(t, 6.8, 7.9, E.cam), gNow = lerp(gx, gLo, kd);
    if (t > 6.5) {
      if (kd > 0) line(m.X(gx), m.Y(vP), lerp(m.X(gx), m.X(gLo), kd), m.Y(vP), { color: C.heroText, w: 2, dash: [5, 5] });
      heroMark(m.X(gNow), m.Y(B.perG.tri * gNow), 11, ep(t, 6.5, 6.8));
      cursorAt(t, [[6.5, [m.X(gx) + 40, m.Y(vT) - 50]], [6.8, [m.X(gx) + 4, m.Y(vT) + 6]], [7.9, [m.X(gLo) + 4, m.Y(vP) + 6]]], [], { a: ep(t, 6.4, 6.7) * (1 - ep(t, 8.6, 9.0)), grab: t > 6.8 });
      const kh = ep(t, 7.8, 8.2), yb = m.Y(0) - 22;
      if (kh > 0) {
        for (const g of [gLo, gx]) line(m.X(g), m.Y(vP) + 10, m.X(g), yb, { color: C.heroText, w: 1.5, dash: [3, 4], alpha: kh * 0.8 });
        line(m.X(gLo), yb, m.X(gx), yb, { color: C.heroText, w: 2.5, alpha: kh });
        text('−' + b05_dn((1 - B.sameFlex) * 100) + ' %', (m.X(gLo) + m.X(gx)) / 2, yb - 12, { font: 'disp', size: 26, weight: 800, color: C.heroText, align: 'center', alpha: kh });
      }
    }
    /* the headline: the demonstration's own measure, the same weight (F14.10, F16.1; stiffness: F41.1) */
    verdict(t, 4.6, cx - 40, 880, { from: Math.round(vP), to: Math.floor(vT), unit: 'N', dec: 0, label: 'Press to flex it 0.1 mm, the same weight', better: 'higher', rivalCol: 'grey', net: b05_dn(B.stiff, 1) + '×', netWord: 'as stiff', size: 100, maxW: 760 });
  }
}));

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
  G.save(); G.globalAlpha = aa; const ink = C.ink2, disc = C.mute, yBar = y + 13 + rod + 8 * (dh + 1) + drop;
  G.strokeStyle = ink; G.lineWidth = 2.5; G.lineCap = 'round'; G.beginPath(); G.arc(x, y + 7 + drop, 6, -Math.PI * 0.1, Math.PI * 1.1, true); G.stroke();
  G.beginPath(); G.moveTo(x, y + 13 + drop); G.lineTo(x, yBar); G.stroke();
  G.lineWidth = 4; G.beginPath(); G.moveTo(x - dw * 0.45, yBar); G.lineTo(x + dw * 0.45, yBar); G.stroke();
  /* the discs, bottom up: each falls in from above its place and settles; one lifted off rises and fades */
  let i = 0;
  for (const [o0, o1] of discs) {
    const kIn = ep(t, o0 - 0.22, o0, E.in3), kOut = o1 != null ? ep(t, o1, o1 + 0.35, E.out3) : 0; if (kIn <= 0 || kOut >= 1) continue;
    const yy = yBar - 2 - (i + 1) * (dh + 1) - (1 - kIn) * 40 - kOut * 50, al = aa * clamp(kIn * 3) * (1 - kOut);
    rr(x - dw / 2, yy, dw, dh, 3, disc, null, 0, al); line(x - dw / 2 + 4, yy + 2, x + dw / 2 - 4, yy + 2, { color: C.faint, w: 1, alpha: al });
    if (kOut <= 0) i++;
  }
  G.restore();
}

/* ============================== b05_hotspot: stress hotspots (Brock, shlHotspot 8/10; F2.10) ==============================
   Why the solid plane loses (review R-b05-3: nopick shows the race, this slide shows the reason). The same test strip
   (b06's B06_STRIP, 60 mm) as a solid plane under the finger; the press builds from nothing to the press that cracks it
   (b05_fr's Fp, about 182 N: pressed to where it breaks, a strength test), the heat rising into the one spot under the
   finger until it cracks there (review R2-b05-2: the crack is seen happening). The camera pushes in on that one hot spot
   (all of its strength) while the rest of it averages a quarter (M4). Then a thicker sheet has triangles milled out of it,
   each rib sized to its force, the weight counting down: 15 % lighter than the solid plane. The same finger, the same press:
   it runs along every member and the part holds (F41.1: 120 MPa stretched, 207 MPa bent). Brock's reasoning, his doc: "it's
   possible to cut material out of a solid plane to make it stronger". The triangles are sized to their force because ribs of
   one width lose under two strengths (review b05 F41). Every number is b05_fr()'s, and so are the answers. */
const B05_HOT_T = { press1: [0.2, 1.25], crack: [1.25, 1.5], cam: [1.4, 2.1, 2.65, 3.25], swap: [3.25, 3.65], mill: [3.7, 5.1], press2: [5.3, 6.55], v: 6.9 };
const B05_HOT_F = 0.85;   /* the milled part's weight, a fraction of the solid plane's */
S(b05_live({
  id: 'b05_hotspot', ch: 'shell', theme: 'night', title: 'Stress hotspots', settle: 10.5, ideas: [75, 93],
  src: ['shlHot2d', 'shlPyrofil'],
  replaces: ['shlHotspot'],
  answers: B => {
    const f = B05_HOT_F, gS = B05_MAT.pp.rho / 1000 * 60 * B.H * B.ST.ribH * f, Fp = fmtN(B.Fp, 0), uM = Math.ceil(B.use(B.sized, B.Fp, f) * 100 - 1e-9);
    return [
      ['"show the weight of the 2 parts"', `Both weights are on the slide beside their parts: the solid plane ${fmtN(B.g, 2)} g (${fmtN(B.plate.model.w, 2)} mm thick, its end drawn); the milled part counts down from its ${fmtN(gS, 2)} g sheet (${fmtN(B.ST.ribH * f, 2)} mm) to ${b05_rv(B.g * f, 3, false, 'lower')} g as the mill passes, and the headline is the weight: ${b05_rv(B.g, 3, true, 'lower')} → ${b05_rv(B.g * f, 3, false, 'lower')} g, −${b05_dn((1 - f) * 100)} %, holding the ${Fp} N that cracked the solid plane.`],
      ['"and to tie into how a milled out part can be stronger a solid part, point this out"', `Pointed out in words and shown: the triangles are milled out of a thicker sheet on screen, each rib sized to its force, and the caption says it: "Cut material out, and it holds: the same ${Fp} N runs along every member." Under that press it uses ${uM} % of its strength where the solid plane used all of it and cracked.`],
      ['F2.10: hotspots, one break point, the rest of the material wasted', `The press builds from nothing on the solid plane to ${Fp} N (about 18 bags of sugar: pressed to where it breaks), the heat rising into the one spot under the finger until it cracks there; the camera pushes in on it ("It cracks here") and the slide says the rest of it averages ${fmtN(B.iP.mean / B.iP.uMax * 100, 0)} %: idle weight. On the triangles the same press runs along every member.`]
    ];
  },
  draw: t => {
    const T = B05_HOT_T, B = b05_fr(), H = B.H, f = B05_HOT_F, sc = 5, box = [LM, 290, 1060, 600];
    /* where the cracked plane's bottom middle is drawn (flex 5× real): the camera's target */
    const yb = B.plate.d[B.plate.model.mid * 3 + 1] * sc * B.Fp / 10;
    header(t, 'Stress hotspots');
    captions(t, [[0.3, 'Press a solid plane until it breaks: one hot spot under the finger cracks, while the rest of it idles.'], [T.swap[0], 'Mill triangles out of a thicker sheet, each rib sized to its force, just enough to hold: ' + b05_dn((1 - f) * 100) + ' % lighter than the solid plane.'], [T.press2[0], 'Cut material out, and it holds: the same ' + fmtN(B.Fp, 0) + ' N runs along every member.']]);
    /* ---- the camera: establish the cracked part, push in on the hot spot, pull back out for the mill (M4) ---- */
    const c = cam(t, [[0, 0, H / 2 + yb / 2, 14], [T.cam[0], 0, H / 2 + yb / 2, 14], [T.cam[1], 0, yb + 3.4, 30], [T.cam[2], 0, yb + 3.4, 30], [T.cam[3], 0, H / 2, 14]]);
    const ox = box[0] + box[2] / 2, oy = box[1] + box[3] / 2 + 20, P = p => [ox + (p[0] - c.cx) * c.s, oy - (p[1] - c.cy) * c.s];
    /* the press builds on the solid plane until it cracks (F1), held while the camera looks, released as the scene changes */
    const kSwap = ep(t, T.swap[0], T.swap[1]), F1 = B.Fp * ep(t, T.press1[0], T.press1[1], x => x * x * (2 - x)) * (1 - ep(t, T.swap[0] - 0.5, T.swap[0], E.io3)), F2 = lerp(0, B.Fp, ep(t, T.press2[0], T.press2[1], E.io3));
    const kCrack = ep(t, T.crack[0], T.crack[1], E.out3), cracked = t >= T.crack[0];
    const milling = t >= T.mill[0] && t < T.mill[1], milled = t >= T.mill[1], km = ep(t, T.mill[0], T.mill[1], E.io2 || E.io3);
    G.save(); G.beginPath(); G.rect(box[0], box[1], box[2], box[3]); G.clip();
    /* the solid plane under the rising press: its heat climbs into the one spot, and it cracks there; it lets go as the scene changes */
    if (kSwap < 1) b05_drawPlane(F1, P, { sc, crack: kCrack, alpha: 1 - kSwap, ny: 14 });
    /* the thicker sheet, then the mill: it passes left to right, leaving the triangles behind it */
    if (kSwap > 0) {
      const hw = 1.1, xc = lerp(-31.5, 31.5, km), pxC = P([xc, 0])[0], s0 = P([-31.5, H + hw]), s1 = P([31.5, -hw]);
      if (!milled) { G.save(); G.beginPath(); G.rect(Math.max(pxC, s0[0]), s0[1], s1[0] - Math.max(pxC, s0[0]), s1[1] - s0[1]); G.clip(); rr(s0[0], s0[1], s1[0] - s0[0], s1[1] - s0[1], 3, heatCol(0), inkA(0.45), 1.5, kSwap); G.restore(); }
      if (km > 0) { G.save(); if (!milled) { G.beginPath(); G.rect(box[0], box[1], pxC - box[0], box[3]); G.clip(); } b05_drawTri(B.sized, milled ? F2 : 0, P, c.s, t, { sc, f, alpha: 1, flow: milled ? 0.45 : 0 }); G.restore(); }
      if (milling) { const yz = lerp(-0.5, H + 0.5, 0.5 + 0.5 * Math.sin(t * 26)), q = P([xc, yz]); circle(q[0], q[1], 0.5 * c.s + 4, { fill: C.ink2, alpha: 0.9 }); line(q[0], q[1], q[0], box[1], { color: C.ink2, w: 0.5 * c.s, alpha: 0.35 }); }
    }
    /* the hot spot, ringed in ink as the camera arrives on it; the rest of the plane, said */
    const kr = ep(t, T.cam[1] - 0.2, T.cam[1] + 0.2) * (1 - ep(t, T.cam[2], T.cam[2] + 0.3));
    if (kr > 0) {
      const hp = P([0, yb + 0.9]); G.save(); G.globalAlpha = kr; G.strokeStyle = C.ink; G.lineWidth = 2.5; G.beginPath(); G.arc(hp[0], hp[1], 2.6 * c.s, 0, TAU); G.stroke(); G.restore();
      text('It cracks here', hp[0] - 2.9 * c.s, hp[1] + 8, { role: 'label', size: 22, color: C.ink, align: 'right', alpha: kr });
    }
    /* the finger, its pad on the top middle; the same finger and press on both */
    const r = milled ? B.sized : B.plate, Fn = milled ? F2 : F1, tp = b05_topMid(r, P, Fn, sc, H, milled ? f : 1);
    const kf = clamp((1 - ep(t, T.swap[0] - 0.5, T.swap[0])) + ep(t, T.press2[0] - 0.4, T.press2[0], E.out3));
    finger(tp[0] - (1 - kf) * 20, tp[1] - (1 - kf) * 9, 0.42, { s: c.s, surf: 0, press: clamp(Fn / 40), len: 20, alpha: kf });   /* to scale with the camera (F54.2, was 0.62×), pad flat */
    G.restore();
    /* ---- the right column: the press, the part, its weight, the share of its strength used ---- */
    const rx = 1220, kN = ep(t, T.swap[0], T.swap[1]), a1 = Math.abs(1 - 2 * kN);
    rich([{ s: 'Press', role: 'label', size: 21, color: C.mute }, { s: fmtN(milled ? F2 : F1, 0), role: 'd1', size: 56, weight: 800, color: C.ink, tnum: true, gap: 14 }, { s: 'N', role: 'label', size: 24, color: C.mute, gap: 8, caps: false }], rx, 340);
    text(kN < 0.5 ? 'A solid plane' : 'Triangles sized to their force', rx, 430, { role: 'label', size: 22, color: kN < 0.5 ? C.ink2 : C.heroText, alpha: a1 });
    const gSheet = B05_MAT.pp.rho / 1000 * 60 * H * B.ST.ribH * f, gNow = kN < 0.5 ? B.g : lerp(gSheet, B.g * f, km), thick = kN < 0.5 ? B.plate.model.w : B.ST.ribH * f;
    rich([{ s: 'Weight', role: 'label', size: 19, color: C.mute }, { s: b05_rv(gNow, 3, kN < 0.5, 'lower') + ' g', role: 'num', size: 34, weight: 800, color: kN < 0.5 ? C.ink : C.heroText, tnum: true, gap: 10 }], rx, 482, { alpha: a1 });
    b05_sheetEnd(rx + 6, 506, thick, 40, 70, { fill: kN < 0.5 ? C.comp : C.hero, alpha: a1, label: fmtN(thick, 2) + ' mm thick (drawn 40× real)', col: C.mute });
    if (milled) text('Milled from a ' + fmtN(thick, 2) + ' mm sheet of ' + fmtN(gSheet, 2) + ' g', rx, 612, { role: 'small', size: 21, weight: 600, color: C.mute, maxW: RM - rx, sentence: false, alpha: ep(t, T.mill[1], T.mill[1] + 0.3) });
    text('Strength used at its peak', rx, 676, { role: 'label', size: 19, color: C.mute });
    text('(lower is better)', rx, 702, { role: 'small', size: 21, weight: 600, color: C.faint, sentence: false });
    if (!(kN > 0 && !milled)) {
      /* the share of its strength the peak uses: the plane's climbs with the press to all of it; Theseus's never rounded down */
      const u = milled ? B.use(B.sized, F2, f) : F1 / B.Fp, pct = milled ? Math.ceil(u * 100 - 1e-9) : Math.round(u * 100);
      rich([{ s: String(pct), role: 'num', size: 44, weight: 800, color: milled ? C.heroText : cracked ? C.red : C.ink, tnum: true }, { s: '%', role: 'label', size: 19, color: C.mute, gap: 6, caps: false }], rx, 760);
      if (milled ? t >= T.press2[1] : cracked) text(milled ? 'Holds' : 'Cracked', rx + 150, 760, { role: 'label', size: 22, color: milled ? C.heroText : C.red, alpha: milled ? 1 : kCrack });
    }
    const kRest = ep(t, T.cam[1] - 0.2, T.cam[1] + 0.2) * (1 - kN);
    if (kRest > 0) text('That is its hot spot. The rest of it averages ' + fmtN(B.iP.mean / B.iP.uMax * 100, 0) + ' %: idle weight.', rx, 806, { role: 'small', size: 22, weight: 600, color: C.ink2, maxW: RM - rx, sentence: false, alpha: kRest });
    /* ---- the headline: the weight that holds the press that cracked the solid plane ---- */
    verdict(t, T.v, rx, 908, { from: b05_rv(B.g, 3, true, 'lower'), to: b05_rv(B.g * f, 3, false, 'lower'), unit: 'g', dec: 3, label: 'Weight that holds ' + fmtN(B.Fp, 0) + ' N', better: 'lower', who: ['Solid plane', 'Milled triangles'], rivalCol: 'grey', net: '−' + b05_dn((1 - f) * 100) + ' %', netWord: 'weight', size: 84, maxW: RM - rx });
    scaleNote(LM, 952, 'about 18 bags of sugar: pressed to where the solid plane breaks', { lead: fmtN(B.Fp, 0) + ' N', t, t0: -1, size: 22 });
    /* the heat key (F19.3): coloured by the share of strength used, squared, red where it breaks */
    heatKey(t, 0.3, LM + 100, 836, 240, { gamma: SHL_GAMMA, title: 'Strength used, colour squared' });
    text('Ribs sized to their force (#93): one-width ribs break first. Breaks at 120 MPa stretched, 207 bent; flex 5× real', LM, 990, { role: 'small', size: 21, weight: 560, color: C.faint, sentence: false });
  }
}));
/** the share of the sheet the mill leaves: the one-size triangles' grams over the sheet's (same outline, same thickness) */

/** a strip of printer paper gripped at both ends and pulled, seen face on. (cx, cy): its centre; s px per mm (25 mm wide,
   o.len mm between the grips). o = { pull (N now), nick (0..1 of 5 mm cut in from the bottom edge, at the middle), tear
   (0..1: the tear running from the nick's tip to the top edge), gap (px each half has moved out after tearing), strength
   (40 MPa: Bates & Dean's paper), A (2.38 mm²) }. The stress is drawn on the paper: even when it is whole, piled up at the
   nick's tip when it is not. Returns { tip, left, right } stage points */
function b05_paper(cx, cy, s, o = {}) {
  const Lm = o.len || 100, wpx = Lm * s, hpx = 25 * s, x0 = cx - wpx / 2, y0 = cy - hpx / 2, gap = o.gap || 0, nk = clamp(o.nick || 0), tr = clamp(o.tear || 0);
  const A = o.A || 2.38, sig = (o.pull || 0) / A, Sf = o.strength || 40, white = mix(C.white, C.bg, TH ? 0.03 : 0.08);
  const tipX = cx, tipY = y0 + hpx - 5 * s * nk, rng0 = rng(31), tearPts = [[tipX, tipY]];
  for (let i = 1; i <= 14; i++) tearPts.push([tipX + (rng0() - 0.5) * 7 + (i % 2 ? 2 : -2), tipY - (tipY - y0) * i / 14]);
  const nT = Math.round(tr * (tearPts.length - 1));
  /* the outline: one piece with a slot for the nick; once the tear has run, two pieces split along it */
  const piece = side => {
    G.beginPath();
    if (!side) {
      G.moveTo(x0, y0); G.lineTo(x0 + wpx, y0); G.lineTo(x0 + wpx, y0 + hpx);
      if (nk > 0.01) { G.lineTo(tipX + 1.2, y0 + hpx); G.lineTo(tipX, tipY); G.lineTo(tipX - 1.2, y0 + hpx); }
      G.lineTo(x0, y0 + hpx); G.closePath(); return;
    }
    const xe = side < 0 ? x0 : x0 + wpx; G.moveTo(xe, y0); G.lineTo(tearPts[tearPts.length - 1][0], y0);
    for (let i = tearPts.length - 1; i >= 0; i--) G.lineTo(tearPts[i][0], tearPts[i][1]);
    G.lineTo(tipX, y0 + hpx); G.lineTo(xe, y0 + hpx); G.closePath();
  };
  const drawPiece = (side, dx) => {
    G.save(); G.translate(dx, 0); piece(side); G.fillStyle = white; G.fill();
    /* the pile-up at the nick's tip (Bates & Dean: "many times higher than the stress in the rest of the material") */
    if (nk > 0.05 && !side) {
      G.save(); piece(0); G.clip();
      const kTip = clamp(sig * (1 + 1.6 * nk) / Sf), r = (6 + 12 * kTip) * s;
      if (kTip > 0.02) { const g = G.createRadialGradient(tipX, tipY, 0, tipX, tipY, r); g.addColorStop(0, rgba(kTip > 0.96 ? C.red : heatCol(kTip), 0.95 * kTip)); g.addColorStop(0.5, rgba(heatCol(kTip * 0.6), 0.45 * kTip)); g.addColorStop(1, rgba(heatCol(0.3), 0)); G.fillStyle = g; G.fillRect(tipX - r, tipY - r, r * 2, r * 2); }
      G.restore();
    }
    piece(side); G.strokeStyle = inkA(0.35); G.lineWidth = 1.2; G.lineJoin = 'round'; G.stroke(); G.restore();
  };
  if (tr <= 0) drawPiece(0, 0);
  else if (tr < 1) { drawPiece(0, 0); G.save(); G.beginPath(); for (let i = 0; i <= nT; i++) i ? G.lineTo(tearPts[i][0], tearPts[i][1]) : G.moveTo(tearPts[i][0], tearPts[i][1]); G.strokeStyle = C.red; G.lineWidth = 2.5; G.stroke(); G.restore(); }
  else { drawPiece(-1, -gap); drawPiece(1, gap); }
  return { tip: [tipX, tipY], left: [x0 - (tr >= 1 ? gap : 0), cy], right: [x0 + wpx + (tr >= 1 ? gap : 0), cy], y0, hpx, x0, wpx };
}
/** a grip (a clamp's two jaws) holding the paper's end: (x, y) the paper's end centre, h its height, side −1 left, +1 right */
function b05_grip(x, y, h, side) {
  const w = 46, x1 = side < 0 ? x - w + 14 : x - 14;
  rr(x1, y - h / 2 - 16, w, h / 2 + 12, 4, C.mute, null, 0, 1); rr(x1, y + 4, w, h / 2 + 12, 4, C.mute, null, 0, 1);
  line(x1 + 6, y - 2, x1 + w - 6, y - 2, { color: C.faint, w: 1.2 }); line(x1 + 6, y + 2, x1 + w - 6, y + 2, { color: C.faint, w: 1.2 });
}

/* ============================== b05_margin: the peak decides the break (Brock: "really hard to understand, probably important") ==============================
   Taught with paper first (F33.8; Bates & Dean 2024, Physics Education): a 25 mm strip of printer paper takes 95 N to tear,
   more than students could pull (25 to 35 N); cut a 5 mm nick in its edge, 80 % of it still there, and every student
   tore it, at about 33 N: the stress piles up at the nick's tip. Then the same idea in the part: the solid plane's hot spot
   is its nick. It cracks where its peak uses all of its strength (bent, against 207 MPa: F41.1) while the average uses a
   quarter; at that press triangles sized to their force, the same weight, have about a quarter of their strength left (b05_fr's
   figure, printed rounded toward zero; the answers are built from it too). */
const B05_MARGIN_T = { pull1: [0.3, 1.7], rel: [1.9, 2.2], cut: [2.3, 2.8], pull2: [2.95, 4.0], tear: 4.0, press: [4.9, 7.5] };
S(b05_live({
  id: 'b05_margin', ch: 'shell', theme: 'night', title: 'The peak decides the break', settle: 12, ideas: [75],
  src: ['b05Bates', 'shlHot2d', 'shlPyrofil'],
  replaces: ['shlMargin'],
  answers: B => [
    ['"really hard to understand"', `Taught with a sheet of paper first (Bates & Dean 2024): pulled whole, it holds at 35 N and needs 95 N; nicked 5 mm, it tears at about 33 N from the nick, with the stress drawn piling up at the nick's tip. Then the same idea in the part, said in one line: the solid plane's hot spot is its nick. Each part gets one gauge, the share of its strength its peak uses, with its average marked beside it (the solid plane cracks at 100 % while its average is ${fmtN(B.iP.mean / B.iP.uMax * 100, 0)} %).`],
    ['"probably important"', `Treated as one of the important ideas (F33.5): a classroom demonstration, and the margin as the headline (0 % → ${Math.floor((1 - B.use(B.sized, B.Fp)) * 100 + 1e-6)} % of the strength left at the ${fmtN(B.Fp, 0)} N that cracks the solid plane, triangles sized to their force at the same weight), from the same test strip as the slides before (b06's).`],
    ['F9.23: "show the risk of breakage ... peak force areas should also be colored in red"', 'The peak is red where it reaches the strength, and the margin left before breaking is the headline.'],
    ['F12.12 and F41.1: when it counts as broken', 'Both gauges break at 100 % of the strength by his two strengths, 120 MPa stretched and 207 MPa bent (PP-C-20A datasheet), said in the foot line.']
  ],
  draw: t => {
    const T = B05_MARGIN_T, B = b05_fr(), H = B.H;
    header(t, 'The peak decides the break');
    captions(t, [[0.3, 'Pull a strip of printer paper: it takes 95 N to tear, more than most hands can pull.'], [2.3, 'Nick its edge 5 mm and it tears at about a third of that, from the nick.'], [4.5, 'A solid plane\'s hot spot is that nick: it cracks there while most of it idles.'], [7.6, 'At the press that cracks it, the same sized triangles at the plane\'s full ' + fmtN(B.g, 2) + ' g keep ' + b05_dn((1 - B.use(B.sized, B.Fp)) * 100) + ' % of their strength in reserve.']]);
    /* ---- left: the classroom version ---- */
    const r = demoPanel(t, -1, [LM, 280, 820, 520], { src: 'Bates & Dean 2024, Physics Education' });
    const s = 6, cx = r[0] + r[2] / 2, cy = r[1] + 170;
    const p1 = lerp(0, 35, ep(t, T.pull1[0], T.pull1[1], E.io3)) * (1 - ep(t, T.rel[0], T.rel[1], E.io3));
    const torn = t >= T.tear + 0.18, p2 = t >= T.tear ? 0 : lerp(0, 33, ep(t, T.pull2[0], T.tear, E.io3)), pull = Math.max(p1, p2);
    const nick = ep(t, T.cut[0], T.cut[1], E.out3), tear = ep(t, T.tear, T.tear + 0.18, E.lin), gap = torn ? 24 * clamp(spring(t, T.tear + 0.18, { f: 2.4, z: 0.55 }), 0, 1.3) : 0;
    const pp = b05_paper(cx, cy, s, { pull, nick, tear, gap, len: 90 });
    b05_grip(pp.left[0], cy, pp.hpx, -1); b05_grip(pp.right[0], cy, pp.hpx, 1);
    /* the two hands' pull: an arrow outward from each grip, growing with the pull; the force over the left one */
    if (pull > 0.3) {
      const L = 22 + 48 * clamp(pull / 35), xl0 = pp.left[0] - 40, xr0 = pp.right[0] + 40;
      forceArrow(xl0 - L, cy, Math.PI, L, { color: C.ink }); forceArrow(xr0 + L, cy, 0, L, { color: C.ink });
      text(fmtN(pull, 0) + ' N', xl0 - L / 2, cy - 22, { role: 'num', size: 26, weight: 750, color: C.ink, align: 'center', tnum: true });
    }
    /* the pointer cuts the nick, up from the bottom edge */
    if (t > T.cut[0] - 0.4 && t < T.cut[1] + 0.5) cursorAt(t, [[T.cut[0] - 0.3, [cx + 50, pp.y0 + pp.hpx + 70]], [T.cut[0], [cx + 2, pp.y0 + pp.hpx + 8]], [T.cut[1], [cx + 2, pp.y0 + pp.hpx - 5 * s + 4]]], [], { a: ep(t, T.cut[0] - 0.4, T.cut[0] - 0.1) * (1 - ep(t, T.cut[1] + 0.1, T.cut[1] + 0.4)), grab: true });
    /* what happened, under the strip */
    const ys = cy + pp.hpx / 2 + 66;
    if (t < T.rel[1]) text(t > T.pull1[1] - 0.1 ? 'Holds at 35 N: whole, it needs 95 N' : 'Whole, 25 mm wide', r[0], ys, { role: 'label', size: 21, color: t > T.pull1[1] - 0.1 ? C.ink : C.mute });
    else if (t < T.tear) text('A 5 mm nick: 80 % of the paper is still there', r[0], ys, { role: 'label', size: 21, color: C.mute, alpha: ep(t, T.cut[0], T.cut[0] + 0.3) });
    else { text('Tears at 33 N, from the nick', r[0], ys, { role: 'label', size: 21, color: C.red }); text('A third of the strength, with 80 % of the paper', r[0], ys + 34, { role: 'small', size: 23, weight: 600, color: C.ink2, sentence: false, alpha: ep(t, T.tear + 0.3, T.tear + 0.7) }); }
    text('70 gsm printer paper, 25 mm wide. Students pulled 25 to 35 N; every one tore it once it was nicked 5 mm.', r[0], r[1] + r[3] - 30, { role: 'small', size: 21, weight: 560, color: C.faint, maxW: r[2], sentence: false });
    /* once the press starts, the classroom panel steps back so the parts lead (M7, review R-b05-6) */
    const kDim = ep(t, 4.6, 5.2); if (kDim > 0) { G.save(); G.globalAlpha = 0.5 * kDim; G.fillStyle = C.bg; G.fillRect(LM - 2, 278, 824, 524); G.restore(); }
    /* ---- right: the same idea in the part. One press on both, the same weight; a gauge each: the share of its strength its
       peak uses (F41.1: 120 MPa stretched, 207 MPa bent), and the average share, marked ---- */
    const F = lerp(0, B.Fp, ep(t, T.press[0], T.press[1], E.io3)), broke = t >= T.press[1], kc = ep(t, T.press[1], T.press[1] + 0.35), ka = 0.3 + 0.7 * ep(t, 4.4, 4.8);
    const rows = [{ oy: 560, hero: false, name: 'A solid plane', r: B.plate }, { oy: 850, hero: true, name: 'Triangles sized to their force', r: B.sized }];
    const xl = 960, sp = 7, ox = xl + 30 * sp, gx = 1570, gh = 210;
    rich([{ s: 'Press', role: 'label', size: 19, color: C.mute }, { s: fmtN(F, 0) + ' N', role: 'num', size: 30, weight: 800, color: C.ink, tnum: true, gap: 10 }, { s: 'on each, the same weight', role: 'small', size: 21, weight: 600, color: C.faint, gap: 10, sentence: false }], xl, 330, { alpha: ka });
    text('Strength used at the peak', RM, 318, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ka });
    text('(lower is better)', RM, 344, { role: 'small', size: 21, weight: 600, color: C.faint, align: 'right', alpha: ka, sentence: false });
    rows.forEach(rw => {
      const P = p => [ox + p[0] * sp, rw.oy - p[1] * sp];
      if (!rw.hero) b05_drawPlane(F, P, { sc: 5, crack: kc, alpha: ka, ny: 12 }); else b05_drawTri(rw.r, F, P, sp, t, { sc: 5, alpha: ka, flow: 0.4 });
      const tp = b05_topMid(rw.r, P, F, 5, H);
      if (F > 0.5) forceArrow(tp[0], tp[1] - 4, Math.PI / 2, 64, { color: C.ink, k: clamp(F / 40) });
      text(rw.name, xl, rw.oy - H * sp - 84, { role: 'label', size: 21, color: rw.hero ? C.heroText : C.ink2, alpha: ka });
      /* the gauge: the peak's share rising with the press; the average share marked; breaking at its top */
      const I = B05_INFO.get(rw.r), u = B.use(rw.r, F), av = I.mean * F / B.P0, gy = rw.oy - gh + 16;
      b05_gauge(gx, gy, gh, { frac: u, hero: rw.hero, a: ka });
      text('Breaks', gx - 14, gy + 7, { role: 'tick', size: 19, color: C.red, align: 'right', alpha: ka });
      const ay = gy + gh - gh * clamp(av); if (F > 1) { line(gx - 8, ay, gx + 32, ay, { color: C.ink, w: 2.5, alpha: ka }); text('Average ' + fmtN(av * 100, 0) + ' %', gx + 42, ay + 7, { role: 'label', size: 19, color: C.mute, alpha: ka, caps: false }); }
      const uPct = Math.round(Math.min(u, 1) * 100);
      rich([{ s: String(uPct), role: 'num', size: 34, weight: 800, color: rw.hero ? C.heroText : u >= 0.995 ? C.red : C.ink, tnum: true }, { s: '% used', role: 'label', size: 19, color: C.mute, gap: 8, caps: false }], gx + 42, gy + 26, { alpha: ka });
      text(!rw.hero && broke ? 'Cracks: 0 % left' : (100 - uPct) + ' % left', gx + 42, gy + 60, { role: 'label', size: 21, color: !rw.hero && broke ? C.red : rw.hero ? C.heroText : C.ink2, alpha: ka });
    });
    scaleNote(xl, 952, 'about 18 bags of sugar: pressed to where the solid plane breaks', { lead: fmtN(B.Fp, 0) + ' N', t, t0: T.press[1], size: 22 });
    /* the heat key (F19.3): the plane and the triangles are coloured by the share of strength used, squared */
    heatKey(t, B05_MARGIN_T.press[0], 480, 884, 240, { gamma: SHL_GAMMA, title: 'Strength used, colour squared' });
    text('Breaks at 120 MPa stretched, 207 bent; flex 5× real; colour: share used, squared', xl, 990, { role: 'small', size: 20, weight: 560, color: C.faint, sentence: false, alpha: ka });
    /* ---- the headline: the strength left when the solid plane cracks ---- */
    verdict(t, 7.9, LM, 928, { from: 0, to: Math.floor((1 - B.use(B.sized, B.Fp)) * 100 + 1e-6), unit: '%', dec: 0, label: 'Strength left at ' + fmtN(B.Fp, 0) + ' N, the same weight', better: 'higher', who: ['Solid', 'Sized triangles'], rivalCol: 'grey', size: 96, net: false, maxW: 760 });
  }
}));

/* ============================== b05_work: putting that weight to work (Brock, shlWork 8/10; F2.10, F14.7) ==============================
   The test strip (FILM F4) three ways at one weight, each pressed to its own limit: the solid plane, Theseus's triangles
   (ribs of one width, as b06 draws them) and the triangles with each rib sized to its force (#93). Every gram stood up by
   how much of its strength it is using at that moment (40 cells of equal weight, the hardest-working first: the old slide's
   bars, which he rated 8): the average gram of the solid plane uses 25 %, of the triangles 46 %, sized 69 %. Threshold-free
   (review M-b05-4: the mean share of strength used against the part's own peak; F41.1's two strengths). Then the design
   choices this reasoning drives, each with where the film shows it (his "tie this into how we designed the structure"). */
const B05_WORK_T = { p: [[0.5, 2.1], [2.3, 3.9], [4.1, 5.7]], v: 6.2, choices: 7.2, lit: 10.2 };
let B05_CELLS = null;
/** each part's 40 cells of equal weight, hardest-working first: each cell's mean share of strength used, as a fraction of
   the part's peak (so 1 at its limit) */
function b05_cells(n = 40) {
  if (B05_CELLS) return B05_CELLS;
  const B = b05_fr(), FT = B.FT, FB = B.FB, out = {};
  for (const [k, r] of [['plate', B.plate], ['tri', B.tri], ['sized', B.sized]]) {
    const I = B05_INFO.get(r), S0 = [];
    r.model.els.forEach((el, e) => { if (el.rigid) return; const A = el.w * el.h, Ix = el.w * el.h ** 3 / 12, ax = Math.abs(r.N[e]) / A / FT, gm = r.mass[e] / 256;
      for (let i = 0; i < 16; i++) { const xi = (i + 0.5) / 16, Mx = el.truss ? 0 : r.M1[e] * (1 - xi) + r.M2[e] * xi; for (let j = 0; j < 16; j++) { const y = el.h * ((j + 0.5) / 16 - 0.5); S0.push({ u: (ax + Math.abs(Mx * y / Ix) / FB) / I.uMax, g: gm }); } } });
    S0.sort((p, q) => q.u - p.u);
    const tot = S0.reduce((a, p) => a + p.g, 0), cells = new Array(n).fill(0), cg = new Array(n).fill(0); let acc = 0;
    for (const p of S0) { const c = Math.min(n - 1, Math.floor(acc / tot * n)); cells[c] += p.u * p.g; cg[c] += p.g; acc += p.g; }
    out[k] = { cells: cells.map((v, i) => cg[i] ? v / cg[i] : 0), mean: I.mean / I.uMax };
  }
  return (B05_CELLS = out);
}
/** a small ink icon for a design choice, centred at (x, y), about 56 px wide */
function b05_icon(kind, x, y, col, a) {
  G.save(); G.globalAlpha = a; G.strokeStyle = col; G.fillStyle = col; G.lineWidth = 2.6; G.lineJoin = 'round'; G.lineCap = 'round';
  const P = (u, v) => [x + u, y + v], path = pts => { G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.stroke(); };
  if (kind === 'tri') { path([P(-28, 16), P(28, 16)]); path([P(-14, -12), P(14, -12)]); path([P(-28, 16), P(-14, -12), P(0, 16), P(14, -12), P(28, 16)]); }
  else if (kind === 'arch') { G.beginPath(); G.moveTo(x - 28, y + 16); G.quadraticCurveTo(x, y - 30, x + 28, y + 16); G.stroke(); path([P(-34, 16), P(-22, 16)]); path([P(22, 16), P(34, 16)]); }
  else if (kind === 'fillet') { G.beginPath(); G.moveTo(x - 24, y - 18); G.lineTo(x - 24, y + 4); G.quadraticCurveTo(x - 24, y + 16, x - 12, y + 16); G.lineTo(x + 26, y + 16); G.stroke(); }
  else if (kind === 'fibre') { for (const d of [-10, 0, 10]) path([P(-26, d), P(26, d)]); path([P(18, -18), P(28, -18)]); }
  else if (kind === 'wall') { G.beginPath(); G.moveTo(x - 20, y - 18); G.lineTo(x - 14, y - 18); G.lineTo(x - 4, y + 16); G.lineTo(x - 26, y + 16); G.closePath(); G.globalAlpha = a * 0.35; G.fill(); G.globalAlpha = a; G.stroke(); path([P(4, -18), P(26, -18)]); path([P(4, 16), P(26, 16)]); }
  else if (kind === 'board') { G.strokeRect(x - 22, y - 7, 44, 14); path([P(-24, 0), P(-36, 0)]); path([P(24, 0), P(36, 0)]); path([P(-36, 0), P(-31, -4)]); path([P(-36, 0), P(-31, 4)]); path([P(36, 0), P(31, -4)]); path([P(36, 0), P(31, 4)]); }
  G.restore();
}
S(b05_live({
  id: 'b05_work', ch: 'shell', theme: 'night', title: 'Putting that weight to work', settle: 12, ideas: [75, 93, 94],
  src: ['shlPyrofil', 'b05Won'],
  replaces: ['shlWork'],
  answers: (B, Cl) => [
    ['"tie this into how we designed the structure more"', 'The last third of the slide is the design choices this reasoning drives, each drawn small with where the film shows it: triangles, not hexagons; arches; fillets at every joint; fibres along the load (b06); walls thicker where the force is (#93); the board as a tie (#94, b07). "Triangles, not hexagons" lights last: b06_lattice is next.'],
    ['"this page could be sized to have more information"', 'It carries three parts instead of one comparison, the bars with their averages, the headline, the grams at work in every 10 g, and the six choices.'],
    ['"this example is part of the reasoning for a lot of design choices"', 'Said on the slide: "The same reasoning is behind most of the shell", over the six choices.'],
    ['M-b05-4: a figure with no threshold', `Each bar is the average gram's share of its strength in use when the part is at its limit (F41.1's two strengths): ${fmtN(Cl.plate.mean * 100, 0)} %, ${b05_dn(Cl.tri.mean * 100)} %, ${b05_dn(Cl.sized.mean * 100)} %. No threshold, no feEngaged, no grams of the 3D study.`],
    ['F2.10, F14.7: the grams a force acts on; his title', `His title; the bars stand every gram up by how hard it works, and the line under the headline turns it into grams: of every 10 g, ${fmtN(Cl.plate.mean * 10, 1)} g at work in the solid plane, ${b05_dn(Cl.tri.mean * 10, 1)} g in the triangles, ${b05_dn(Cl.sized.mean * 10, 1)} g sized.`]
  ],
  draw: t => {
    const B = b05_fr(), T = B05_WORK_T, H = B.H, Cl = b05_cells();
    header(t, 'Putting that weight to work');
    captions(t, [[0.3, 'Press each piece to its limit: in the solid plane, the average gram is using a quarter of its strength.'], [2.3, 'In triangles the press runs along the ribs: the average gram does nearly twice the work.'], [4.1, 'Size each rib to its force (#93) and most of the weight works near its limit.'], [7.0, 'The same reasoning is behind most of the shell: put the weight where the force is.']]);
    const rows = [{ k: 'plate', r: B.plate, name: 'A solid plane', col: C.comp, hero: false }, { k: 'tri', r: B.tri, name: 'Theseus\'s triangles', col: C.hero, hero: true }, { k: 'sized', r: B.sized, name: 'Sized to their force: the next step (#93)', col: C.hero, hero: true }];
    const bx = 470, cw = 14, n = Cl.plate.cells.length, bh = 104, s = 5;
    text('Each gram, by the share of its strength it is using {(at the part\'s limit)}', bx, 300, { role: 'label', size: 19, color: C.mute });
    rows.forEach((rw, i) => {
      const y0 = 340 + i * 150, by = y0 + 112, kp = ep(t, T.p[i][0], T.p[i][1], E.io3), I = B05_INFO.get(rw.r), F = I.crack * kp, C0 = Cl[rw.k];
      /* the part, pressed to its limit, coloured by the share used (squared) */
      const P = p => [80 + 30 * s + p[0] * s, y0 + 92 - p[1] * s];
      if (rw.k === 'plate') b05_drawPlane(F, P, { sc: 5, ny: 10 }); else b05_drawTri(rw.r, F, P, s, t, { sc: 5, flow: 0.4 });
      text(rw.name, 80, y0 + 16, { role: 'label', size: 20, color: rw.hero ? C.heroText : C.ink2 });
      /* the bars: 40 cells of equal weight, hardest first, rising with the press */
      line(bx, by, bx + n * cw, by, { color: C.hair, w: 1.5 });
      line(bx, by - bh, bx + n * cw, by - bh, { color: C.red, w: 1.2, dash: [4, 5], alpha: 0.6 });
      C0.cells.forEach((v, j) => { const h = bh * v * kp; if (h > 0.5) rr(bx + j * cw + 1.5, by - h, cw - 3, h, 1.5, heatCol(Math.pow(clamp(v * kp), SHL_GAMMA)), null, 0, 1); });
      const ka = ep(t, T.p[i][1], T.p[i][1] + 0.3);
      if (ka > 0) { const ym = by - bh * C0.mean; line(bx - 6, ym, bx + n * cw + 6, ym, { color: rw.hero ? C.hero : C.ink, w: 2.5, alpha: ka }); rich([{ s: rw.hero ? b05_dn(C0.mean * 100) : fmtN(C0.mean * 100, 0), role: 'num', size: 40, weight: 800, color: rw.hero ? C.heroText : C.ink, tnum: true }, { s: '% on average', role: 'label', size: 19, color: C.mute, gap: 8, caps: false }], bx + n * cw + 24, ym + 14, { alpha: ka }); }
    });
    text('Breaks', bx - 10, 340 + 112 - bh + 6, { role: 'tick', size: 19, color: C.red, align: 'right' });
    /* ---- the headline: the average gram's work, solid plane → Theseus's triangles; and in grams ---- */
    verdict(t, T.v, 1330, 470, { from: Math.round(Cl.plate.mean * 100), to: Math.floor(Cl.tri.mean * 100 + 1e-6), unit: '%', dec: 0, label: 'Share at work', better: 'higher', who: ['Solid plane', 'Triangles'], rivalCol: 'grey', net: b05_dn(Cl.tri.mean / Cl.plate.mean, 1) + '×', netWord: 'the work', size: 96, maxW: RM - 1330 });
    text('Of every 10 g: ' + fmtN(Cl.plate.mean * 10, 1) + ' g at work in a solid plane, ' + b05_dn(Cl.tri.mean * 10, 1) + ' g in triangles, ' + b05_dn(Cl.sized.mean * 10, 1) + ' g sized', 1330, 590, { role: 'small', size: 22, weight: 600, color: C.ink2, maxW: RM - 1330, sentence: false, alpha: ep(t, T.v + 1.6, T.v + 2.0) });
    /* ---- the design choices this reasoning drives, and where the film shows each ---- */
    /* where the film shows each, as the viewer reads it: the slide's number in this chapter (the header's "11 / 24"), found live
       so a reordered chapter stays right; never our builders' codes (FILM F40) */
    const noOf = id => { const sl = DECK.slides.find(x => x.id === id), ci = sl && typeof chapterInfo === 'function' ? chapterInfo(sl) : null; return ci && ci.n ? ci.n : 999; };
    const here = noOf('b05_work'), at = n => n === 999 ? 'Later in the film' : n === here + 1 ? 'Next slide' : 'Slide ' + n;
    const ch = [['tri', 'Triangles, not hexagons', 'b06_lattice'], ['arch', 'Arches', 'b06_arch'], ['fillet', 'Fillets at every joint', 'b06_fillet'], ['fibre', 'Fibres along the load', 'b06_fibres'], ['wall', 'Walls graded to the force', 'b07_sheet'], ['board', 'The board as a tie', 'b07_board']]
      .map(([k, name, id]) => [k, name, noOf(id)]).sort((p, q) => p[2] - q[2]).map(([k, name, n]) => [k, name, at(n)]);   /* in the film's order */
    const cy = 850, cwid = (RM - LM) / ch.length;
    text('The choices it drives', LM, cy - 60, { role: 'label', size: 19, color: C.mute, alpha: ep(t, T.choices - 0.3, T.choices) });
    ch.forEach(([k, name, where], i) => {
      const a = ep(t, T.choices + i * 0.3, T.choices + i * 0.3 + 0.3), lit = i === 0 ? ep(t, T.lit, T.lit + 0.4) : 0, x = LM + cwid * i + 36, col = lit > 0.5 ? C.hero : C.ink2;
      b05_icon(k, x, cy, col, a);
      text(name, x + 50, cy - 4, { role: 'label', size: 19, color: lit > 0.5 ? C.heroText : C.ink2, alpha: a, maxW: cwid - 110, lh: 1.15 });
      text(where, x + 50, cy + 44, { role: 'small', size: 19, weight: 600, color: C.faint, alpha: a, sentence: false });
    });
    /* the heat key (F19.3): the parts and every bar are coloured by the share of strength used, squared */
    heatKey(t, 0.6, 1330, 716, 300, { gamma: SHL_GAMMA, title: 'Strength used, colour squared' });
    text('The test strip, ' + fmtN(B.g, 2) + ' g each, in 2D, each pressed to its own limit; breaks at 120 MPa stretched, 207 bent; colour: share used, squared', LM, 990, { role: 'small', size: 20, weight: 560, color: C.faint, sentence: false });
  }
}));
