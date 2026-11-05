/* ============================== shell, part B: arches, fibres, fillets and the mold, the flat sides ==============================
   Builder B's slides in the shell chapter (code shb). The chapter reads lattice → arches → fibres → fillets and the mold
   → flat sides:
     shbArches    interwoven arches form triangles (replaces the old 'arches')      after shlLattice3d
     shbDome      geodesic domes: great circles make the triangles (Fuller, HI-SEAS)
     shbPress     arch action against a flat plate: the force simulation, the press ramped to the plate's break
     shbThrust    the thrust line: Hooke's hanging chain, turned over; the press dragged off the crown
     shbBend      the thrust cancels the bending moment (M = M0 - H y), and the stress through the depth
     shbFibres    fibre alignment: continuous ribs keep the fibres along the load (the research)
     shbFlow      melt through a lattice node: the fluid simulation, sharp against filleted     after filletsize
     shbGates     gate the melt along the arches; weld lines
     shbMill      fillets make the mold easier to cut
     shbTol       a fillet loosens the tightest tolerance
     shbSides     the flatter low sides and the thumb rest: a thicker lattice band (the real section)
   Every model number is DERIVED and the slide names its model in a line. Theseus is C.hero (blue), a problem C.bad, stress
   heat heatCol; only neutral material greys (mold steel, melt, electrode) are written as hex. No meter steps: see shbBend. */

Object.assign(SRC, {
  shbHiseasNasa: { t: 'NASA Goddard, HI-SEAS campaign page: "Crew members lived in a geodesic dome habitat"; HI-SEAS is "a long duration Mars analog simulation program" on Mauna Loa, run by the University of Hawai\'i at Mānoa', u: 'https://earth.gsfc.nasa.gov/acd/campaigns/hi-seas' },
  shbHiseas: { t: 'HI-SEAS: "a 1,200 square foot dome", "approximately 8,200 feet above sea level" on Mauna Loa; "five successful long-duration (4 to 12 month) NASA Mars simulation missions"', u: 'https://hi-seas.org' },
  shbHiseasWiki: { t: 'Wikipedia, HI-SEAS: "The geodesic habitation dome has an internal two-story open layout with a diameter of about 11 m (36 ft)"; NASA\'s Human Research Program funded the studies until 2018', u: 'https://en.wikipedia.org/wiki/HI-SEAS' },
  shbFuller: { t: 'R. Buckminster Fuller, US patent 2,682,235, "Building construction" (filed 1951, granted 1954): a frame "in a geodesic pattern of approximate great circle arcs intersecting to form a three-way grid" of "substantially equilateral triangles"; "My three-way grid of structural members results in substantially uniform stressing of all members"; the example dome "will support 7 lbs. with each ounce of structure"; about 0.78 lb per sq ft against "often 50 lbs." (inventor\'s claims)', u: 'https://patents.google.com/patent/US2682235A/en' },
  shbHooke: { t: 'Block, DeJong and Ochsendorf, "As Hangs the Flexible Line: Equilibrium of Masonry Arches", Nexus Network Journal 8 (2006) 13–24: Robert Hooke, 1675, "As hangs the flexible line, so but inverted will stand the rigid arch"; graphical analysis of the line of thrust', u: 'https://doi.org/10.1007/s00004-006-0015-9' },
  shbKrenchel: { t: 'Krenchel, Fibre Reinforcement (1964), as used in D. U. Shah\'s thesis chapter "Effect of orientation on PFRP tensile properties": the orientation efficiency of a fibre at θ to the load is cos⁴θ; randomly oriented fibres in 2D or 3D keep 37.5% (3/8) and 20.0% (1/5) of the reinforcing effect of aligned ones', u: 'https://kompozit.org.tr/wp-content/uploads/2022/01/Chapter_5_Effect_of_orientation_on_the_t.pdf' },
  shbHexcel: { t: 'Hexcel, HexPly 8552 datasheet, AS4/8552 unidirectional tape (77 °F, dry): 0° tensile strength 310 ksi (2,137 MPa), 90° tensile strength 9.27 ksi (63.9 MPa); 0° modulus 19.6 msi, 90° modulus 1.39 msi', u: 'https://hexcel.com/wp-content/uploads/2026/01/HexPly_8552_us_DataSheet.pdf' },
  shbChoi: { t: 'Choi, Andrian, Lee, Lee and Kim, "Fatigue Life Prediction for Injection-Molded Carbon Fiber-Reinforced Polyamide-6 Considering Anisotropy and Temperature Effects", Materials 17 (2024) 315: 20 vol% short carbon fibre PA6, tensile strength at 40 °C 130.3 MPa along the flow (0°), 101.3 MPa at 45°, 77.2 MPa across it (90°)', u: 'https://doi.org/10.3390/ma17020315' },
  shbMerseburg: { t: 'Polymer Service GmbH Merseburg (test lab), wiki "Anisotropy": in injection-moulded PP/GF parts the tensile strength along and across "can be a factor of 2", the modulus "up to a factor of 3"; the degree of anisotropy is set by fibre orientation', u: 'https://en.wiki.polymerservice-merseburg.de/index.php/Anisotropy' },
  shbWang: { t: 'Wang et al., "Mechanical Properties of Weld Lines in Injection-Molded Carbon Fiber-Reinforced Nylon (PA-CF) Composites", Polymers 15 (2023) 2476, Table 4: weld line coefficient (strength with a weld line over without) for PA66 with 20 wt% carbon fibre, tensile strength 0.32 to 0.38, Young\'s modulus 0.68 to 0.73; with 30 wt%, 0.24 to 0.27; at the weld line "a large number of carbon fibers ... were oriented perpendicular to the flow direction"', u: 'https://doi.org/10.3390/polym15112476' },
  shbMoldflow: { t: 'Autodesk Moldflow Insight help, fiber orientation: "Shearing flows tend to align fibers in the direction of flow"; "Stretching flows tend to align fibers in the direction of stretching"; converging flow gives flow-aligned fibres, diverging flow transverse alignment; shell layers flow-aligned, a core across', u: 'https://help.autodesk.com/cloudhelp/2018/ENU/MoldflowInsight/files/GUID-C69F6ED0-7155-4D37-980F-910749EAF7F4.htm' },
  shbJeffery: { t: 'G. B. Jeffery, "The motion of ellipsoidal particles immersed in a viscous fluid", Proc. R. Soc. Lond. A 102 (1922) 161–179: the rotation of a rigid rod in a slow viscous flow (Jeffery orbits)', u: 'https://doi.org/10.1098/rspa.1922.0078' },
  shbProtoCorner: { t: 'Protolabs, "How to Design Corners on Injection-Molded Parts": "the internal corners in any mold cavity cannot be smaller than the radius of the endmill used to machine them"; EDM "is often used to create features that cannot be otherwise machined" but is "prohibitively slow for most quick-turn molding"; an inside radius of at least 0.5× the wall; radii let "molten plastic to flow more easily"', u: 'https://www.protolabs.com/resources/design-tips/cutting-corners-on-injection-molded-parts/' },
  shbAutodeskEdm: { t: 'Autodesk Fusion blog (E. Rathbone, 2018), replacing EDM with CNC milling: "Milling ribs within a mold can be difficult, as they require tooling with large LD (length/diameter) ratios"; EDM makes "sharp corners that otherwise would require CNC mills of incredibly small diameters"; electrodes add steps', u: 'https://www.autodesk.com/products/fusion-360/blog/replacing-edm-manufacturing-cnc-milling-efficiency/' },
  shbCte: { t: 'Cutting Tool Engineering, "Racking up ribs" (May 2010): rib grooves 0.090 to 0.100 in wide and 0.400 to 0.900 in deep; burning them by EDM "consumed more than 300 hours"; milled with small solid-carbide tools, "just under 100 hours"', u: 'https://ctemag.com/articles/racking-ribs/' },
  shbCore77: { t: 'Core77 (Core Jr), "5 CNC Machining Pitfalls Industrial Designers Make": keep internal corner radii at R ≥ 1/3 of the cavity depth; keep pocket depth within 4× the cutter diameter; tool deflection scales with the cube of stick-out (citing Sandvik Coromant); a round tool "physically cannot produce a square internal corner"', u: 'https://www.core77.com/posts/144950/5-CNC-Machining-Pitfalls-Industrial-Designers-Make-And-How-to-Avoid-Them-in-CAD' },
  shbModel: { t: 'This deck, part B models: 2D frames (07-sim.js, Euler-Bernoulli beams, PP-C-20A 13.5 GPa, a 10 mm strip); a Stokes flow through a lattice node (stream function and vorticity, on a grid of 14 points per mm) with rigid fibres turned by Jeffery\'s equation; the Theseus hump section sliced from 3d/shell/shell-theseus.glb', n: 'derived, this model' }
});

/* ---------- data: the Theseus shell (3d/shell/shell-theseus.glb, from Brock's Sora scan), sliced for this deck ----------
   SHB_SEC: the outer surface across the hump (z = −14 mm, its highest point), mm; +x is the side-button side, the user's
   left, where the thumb rests. SHB_SIDE: the height along the mouse, sliced 7 mm off the centre split (z forward). */
const SHB_SEC = [[24.9,0.7],[26.9,0.9],[28.3,2.3],[29.6,3.8],[30.3,5.6],[30.6,7.6],[30.8,9.6],[30.8,11.6],[30.7,13.6],[30.6,15.6],[30.4,17.6],[30.1,19.6],[29.6,21.5],[29.0,23.4],[28.3,25.3],[27.3,27.0],[26.1,28.6],[24.7,30.1],[23.2,31.3],[21.5,32.5],[19.8,33.5],[18.0,34.4],[16.2,35.2],[14.3,35.8],[12.4,36.4],[10.4,36.9],[8.5,37.3],[6.5,37.6],[4.5,37.9],[2.5,38.0],[0.5,38.1],[-1.5,38.1],[-3.5,38.0],[-5.5,37.8],[-7.4,37.5],[-9.4,37.1],[-11.4,36.7],[-13.3,36.2],[-15.2,35.5],[-17.0,34.8],[-18.9,34.0],[-20.6,33.0],[-22.3,32.0],[-23.9,30.7],[-25.4,29.4],[-26.7,27.9],[-27.8,26.2],[-28.7,24.4],[-29.3,22.5],[-29.8,20.6],[-30.2,18.6],[-30.5,16.7],[-30.7,14.7],[-30.8,12.7],[-30.8,10.7],[-30.7,8.7],[-30.5,6.7],[-30.1,4.7],[-29.0,3.1],[-27.7,1.6],[-26.0,0.7]];
const SHB_SIDE = [[-59,10.53],[-56,15.27],[-53,19.21],[-50,22.45],[-47,25.14],[-44,27.48],[-41,29.67],[-38,31.51],[-35,33.12],[-32,34.39],[-29,35.44],[-26,36.38],[-23,36.96],[-20,37.33],[-17,37.51],[-14,37.58],[-11,37.57],[-8,37.49],[-5,37.29],[-2,36.96],[1,36.5],[4,35.87],[7,35.06],[10,34.19],[13,33.18],[16,32.3],[19,31.29],[22,30.26],[25,29.12],[28,28.05],[31,26.86],[34,25.57],[37,24.25],[40,22.82],[43,21.36],[46,19.88],[49,18.31],[52,16.74],[55,14.98],[58,13.23]];

/* ---------- helpers ---------- */
const SHB = { c: {} };
/** compute once, keep: models, solves, the flow field */
function shbOnce(k, fn) { if (!(k in SHB.c)) SHB.c[k] = fn(); return SHB.c[k]; }
/** linear interpolation in a table [[x, y], ...] sorted by x */
function shbLerpTab(tab, x) {
  if (x <= tab[0][0]) return tab[0][1]; const n = tab.length; if (x >= tab[n - 1][0]) return tab[n - 1][1];
  let i = 1; while (i < n - 1 && tab[i][0] < x) i++; const [x0, y0] = tab[i - 1], [x1, y1] = tab[i];
  return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
}
/** a small mono figure label: number and sentence (the shell chapter's Fig. style) */
function shbFig(t, t0, x, y, n, s, o = {}) {
  const a = ep(t, t0, t0 + 0.5) * (o.alpha == null ? 1 : o.alpha); if (a <= 0.003) return;
  rich([{ s: 'Fig. ' + n, role: 'label', size: 20, color: C.faint }, { s, role: 'small', size: 25, weight: 560, color: C.mute, sentence: true, gap: 14 }], x, y, { alpha: a, align: o.align });
}
/** a numbered step in a column: a number in Theseus's gradient (or a colour), a label, a line of text. returns the height */
function shbStep(t, t0, x, y, w, n, head, body, o = {}) {
  const a = ep(t, t0, t0 + 0.5, E.snap); if (a <= 0.003) return 0;
  const dy = (1 - a) * 10;
  text(pad2(n), x, y + 30 + dy, { font: 'disp', size: 40, weight: 800, color: o.color || C.heroText, grad: o.color ? null : C.heroGrad, alpha: a, tnum: true });
  if (o.swatch) { G.save(); G.globalAlpha = a; G.strokeStyle = o.swatch; G.lineWidth = 5; G.lineCap = 'round'; G.beginPath(); G.moveTo(x + 76, y + 6 + dy); G.lineTo(x + 76 + 44 * ep(t, t0 + 0.1, t0 + 0.6), y + 6 + dy); G.stroke(); G.restore(); }
  text(head, x + 76 + (o.swatch ? 58 : 0), y + 13 + dy, { role: 'label', size: 21, color: C.ink, alpha: a });
  const r = text(body, x + 76, y + 50 + dy, { role: 'small', size: 25, color: C.ink2, t, t0: t0 + 0.15, cps: 120, maxW: w - 76, lh: 1.32, alpha: a });
  return 50 + r.h;
}
/** a line of model or note text in a tile: small, muted, wrapped */
function shbNote(t, t0, x, y, w, s, o = {}) {
  return text(s, x, y, { role: 'small', size: o.size || 25, weight: Math.max(560, o.weight || 560), color: o.color || C.mute, alpha: ep(t, t0, t0 + 0.5) * (o.alpha == null ? 1 : o.alpha), maxW: w, lh: 1.32, t: o.type ? t : undefined, t0: o.type ? t0 : undefined, cps: 130, align: o.align });
}
/** stroke a polyline of stage points */
function shbPath(pts, col, w, a = 1, o = {}) {
  if (pts.length < 2 || a <= 0.003) return;
  G.save(); G.globalAlpha = a; G.strokeStyle = col; G.lineWidth = w; G.lineCap = o.cap || 'round'; G.lineJoin = 'round'; if (o.dash) G.setLineDash(o.dash);
  if (o.dashOff != null) G.lineDashOffset = o.dashOff;
  G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.stroke(); G.restore();
}
/** the part of a polyline up to fraction k of its length */
function shbPart(pts, k) {
  if (k >= 1) return pts; if (k <= 0 || pts.length < 2) return [];
  let L = 0; const d = [0]; for (let i = 1; i < pts.length; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); d.push(L); }
  const s = L * k, out = [pts[0]];
  for (let i = 1; i < pts.length; i++) { if (d[i] <= s) out.push(pts[i]); else { const f = (s - d[i - 1]) / (d[i] - d[i - 1] || 1); out.push([lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f), pts[i][2]]); break; } }
  return out;
}
/** an orthographic camera: yaw about the vertical, then pitch down; maps world mm [x, y, z] to [sx, sy, depth] */
function shbCam(o) {
  const cy = Math.cos(o.yaw), sy = Math.sin(o.yaw), cp = Math.cos(o.pitch), sp = Math.sin(o.pitch), T = o.T || [0, 0, 0];
  const P = p => { const x = p[0] - T[0], y = p[1] - T[1], z = p[2] - T[2], x1 = x * cy + z * sy, z1 = -x * sy + z * cy; return [o.cx + o.s * x1, o.cy - o.s * (y * cp - z1 * sp), y * sp + z1 * cp]; };
  P.view = [-sy * cp, sp, cy * cp];   /* toward the camera, in world axes */
  return P;
}
/** the shell meter, holding (Brock, F13.1: "Show it, holding"): these slides add no step, so the strip shows the latest
   step reached by this slide in deck order (the triangle lattice before the fillet slides, lattice and fillets after),
   already landed, fading in at t1. The arch is inside the lattice's number: it is the same dome */
function shbMeter(t, t1, id, x, y, w, o = {}) {
  const pos = DECK.slides.findIndex(s => s.id === id); let key = 'lattice';
  for (const st of shellStepsOrdered()) { const i = DECK.slides.findIndex(s => s.id === st.slide); if (i >= 0 && i <= pos) key = st.key; }
  return shellMeter(t, -10, key, x, y, w, Object.assign({}, o, { alpha: ep(t, t1, t1 + 0.6) * (o.alpha == null ? 1 : o.alpha) }));
}
/** PP-C-20A's tensile strength, the one the whole chapter breaks at (Shell A's SHL_STR, from the Pyrofil datasheet) */
const shbFt = () => (typeof SHL_STR !== 'undefined' ? SHL_STR.ft : 120);
/** the first time in [a, b] at which fn(t) reaches v (fn rising) */
function shbWhen(fn, v, a, b) { for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (fn(m) < v) a = m; else b = m; } return b; }
/** the outline of a filleted lattice node in mm: arms at angles angs (rad), width w, length L, fillet radius r at every
   corner between neighbouring arms (r = 0: the sharp corner). A closed polyline, counter-clockwise */
function shbNodeOutline(angs, w, L, r, seg = 12) {
  const out = [], n = angs.length, hw = w / 2;
  for (let k = 0; k < n; k++) {
    const a = angs[k], b = angs[(k + 1) % n]; let gap = b - a; if (gap <= 0) gap += TAU;
    const ua = [Math.cos(a), Math.sin(a)], na = [-Math.sin(a), Math.cos(a)], ub = [Math.cos(b), Math.sin(b)], nb = [-Math.sin(b), Math.cos(b)];
    const half = gap / 2, bis = [Math.cos(a + half), Math.sin(a + half)], dQ = hw / Math.sin(half), sQ = dQ * Math.cos(half);
    out.push([ua[0] * L + na[0] * hw, ua[1] * L + na[1] * hw]);
    if (r > 0.001) {
      const tl = r / Math.tan(half), dO = dQ + r / Math.sin(half), O = [bis[0] * dO, bis[1] * dO];
      const T1 = [ua[0] * (sQ + tl) + na[0] * hw, ua[1] * (sQ + tl) + na[1] * hw], T2 = [ub[0] * (sQ + tl) - nb[0] * hw, ub[1] * (sQ + tl) - nb[1] * hw];
      const a1 = Math.atan2(T1[1] - O[1], T1[0] - O[0]), a2 = Math.atan2(T2[1] - O[1], T2[0] - O[0]);
      let da = a2 - a1; while (da > Math.PI) da -= TAU; while (da < -Math.PI) da += TAU;
      const mid = a1 + da / 2; if (Math.hypot(O[0] + Math.cos(mid) * r, O[1] + Math.sin(mid) * r) > dO) da = da > 0 ? da - TAU : da + TAU;
      for (let q = 0; q <= seg; q++) { const an = a1 + da * q / seg; out.push([O[0] + Math.cos(an) * r, O[1] + Math.sin(an) * r]); }
    } else out.push([bis[0] * dQ, bis[1] * dQ]);
    out.push([ub[0] * L - nb[0] * hw, ub[1] * L - nb[1] * hw]);
  }
  return out;
}
/** fill a polyline of mm points through a mapping P */
function shbFill(pts, P, fill, a = 1) { if (a <= 0.003) return; G.save(); G.globalAlpha = a; G.fillStyle = fill; G.beginPath(); pts.forEach((p, i) => { const q = P(p); i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); }); G.closePath(); G.fill(); G.restore(); }
/** a press pad sitting on a stage point (x, y = the surface), wpx wide, with an arrow from above; k = how hard (0..1) */
function shbPad(x, y, wpx, k, a = 1, col) {
  if (a <= 0.003) return; col = col || C.ink2;
  rr(x - wpx / 2, y - 9, wpx, 7, 3, col, null, 0, a);
  const L = 26 + 34 * clamp(k); arrow(x, y - 14 - L, x, y - 12, { color: col, w: 2 + 2.5 * clamp(k), hs: 14, alpha: a });
}
/** a horizontal gauge of the peak against the strength (frac = peak / strength): heat-coloured, red as it reaches the
   strength, which is the red dashed tick at the right end; what is left of the track is the margin */
function shbGauge(x, y, w, frac, a = 1) {
  if (a <= 0.003) return; const h = 14, f = clamp(frac);
  rr(x, y, w, h, h / 2, C.track, null, 0, a);
  rr(x, y, Math.max(h, w * f), h, h / 2, heatCol(f), null, 0, a);
  line(x + w, y - 9, x + w, y + h + 9, { color: C.bad, w: 2.5, dash: [5, 4], alpha: a });
}
/** a linear blend of solved frames of one model (the model is linear, so this is the frame under the blended load) */
function shbBlend(rs, ws) {
  const r0 = rs[0], nd = r0.d.length, ne = r0.N.length, d = new Float64Array(nd), N = [], M1 = [], M2 = [], sig = [];
  for (let i = 0; i < nd; i++) { let v = 0; rs.forEach((r, q) => { v += r.d[i] * ws[q]; }); d[i] = v; }
  for (let e = 0; e < ne; e++) {
    let nn = 0, m1 = 0, m2 = 0; rs.forEach((r, q) => { nn += r.N[e] * ws[q]; m1 += r.M1[e] * ws[q]; m2 += r.M2[e] * ws[q]; });
    const el = r0.model.els[e], A0 = el.w * el.h, I0 = el.w * el.h * el.h * el.h / 12;
    N.push(nn); M1.push(m1); M2.push(m2); sig.push(Math.abs(nn) / A0 + Math.max(Math.abs(m1), Math.abs(m2)) * el.h / 2 / I0);
  }
  return { d, N, M1, M2, sig, smax: Math.max(...sig), model: r0.model, L: r0.L };
}

/* ============================== the dome: Theseus's top as a height field, and three families of arches over it ==============================
   Plan: the Sora outline (SORA_HALF, half-width against z). Height: the centre-line profile (SHB_SIDE) times the hump's own
   section (SHB_SEC), scaled to the half-width at each z. Above the widest line it is the dome; below it the side drops
   to the rim. The lattice is three families of straight lines in plan, 60° apart and 12.5 mm between crossings (the
   study lattice's edge), all crossing at one node on the crown; lifted onto the dome each line is an arch, rim to rim. */
function shbHalfW(z) {
  const S = SORA_HALF; if (z > S[0][1] || z < S[S.length - 1][1]) return 0;
  for (let i = 1; i < S.length; i++) { const [x0, z0] = S[i - 1], [x1, z1] = S[i]; if ((z - z0) * (z - z1) <= 0 && z0 !== z1) return x0 + (x1 - x0) * (z - z0) / (z1 - z0); }
  return 0;
}
const SHB_G = (function () {
  /* the hump's section, normalised: u = |x| / half-width, v = height / crown height, above the widest line (y ≥ 11.6) */
  const pts = SHB_SEC.filter(p => p[1] >= 11.6).map(([x, y]) => [Math.abs(x) / 30.8, y / 38.1]).sort((a, b) => a[0] - b[0]);
  const tab = [[0, 1]]; for (let u = 0.05; u <= 1.0001; u += 0.05) { const near = pts.filter(p => Math.abs(p[0] - u) < 0.045); tab.push([u, near.length ? near.reduce((s, p) => s + p[1], 0) / near.length : shbLerpTab(pts, u)]); }
  return tab;
})();
const shbCrownH = z => shbLerpTab(SHB_SIDE, z) * (38.1 / 37.58);
function shbDomeY(x, z) { const W = shbHalfW(z); if (W <= 0.5) return 0.65; return Math.max(0.65, shbCrownH(z) * shbLerpTab(SHB_G, Math.min(1, Math.abs(x) / W))); }
/** the surface normal of the dome (top surface), for visibility */
function shbDomeN(x, z) { const e = 0.6, hx = (shbDomeY(x + e, z) - shbDomeY(x - e, z)) / (2 * e), hz = (shbDomeY(x, z + e) - shbDomeY(x, z - e)) / (2 * e), l = Math.hypot(hx, 1, hz); return [-hx / l, 1 / l, -hz / l]; }
const SHB_LAT = (function () {
  const a = 12.5, z0 = -14, rh = a * Math.sqrt(3) / 2;
  const dirs = [[1, 0], [0.5, Math.sqrt(3) / 2], [-0.5, Math.sqrt(3) / 2]];
  const inside = (x, z, m = 0.3) => { const W = shbHalfW(z); return W > 1 && Math.abs(x) <= W - m; };
  /* lift a plan line to the dome: the top part, then a drop down the side to the rim at each end */
  const lift = (x, z) => [x, shbDomeY(x, z), z];
  const lines = [];
  dirs.forEach((d, fam) => {
    for (let k = -9; k <= 9; k++) {
      /* family 0: z = z0 + k rh; families 1, 2: through (k a, z0) along d */
      const o = fam === 0 ? [0, z0 + k * rh] : [k * a, z0];
      const pts = []; let best = [], cur = [];
      for (let s = -95; s <= 95; s += 0.75) { const x = o[0] + d[0] * s, z = o[1] + d[1] * s; if (inside(x, z)) cur.push([x, z]); else { if (cur.length > best.length) best = cur; cur = []; } }
      if (cur.length > best.length) best = cur;
      if (best.length < 14) continue;
      const top = best.map(([x, z]) => lift(x, z));
      /* the side drop at both ends: from the widest line down to the rim, tucked in a little, as the real section is */
      const drop = (p, sgn) => { const out = []; const W = shbHalfW(p[2]); for (let q = 1; q <= 5; q++) { const f = q / 5, y = lerp(p[1], 0.65, f); out.push([p[0] * (1 - 0.13 * f * f), y, p[2]]); } return sgn < 0 ? out.reverse() : out; };
      const P3 = drop(top[0], -1).concat(top, drop(top[top.length - 1], 1));
      lines.push({ fam, k, pts: P3, n: top.map(p => shbDomeN(p[0], p[2])) });
    }
  });
  /* crossings and triangles: nodes at (i a + j a / 2, z0 + j rh) */
  const node = (i, j) => [i * a + j * a / 2, z0 + j * rh];
  const tris = [];
  for (let j = -6; j <= 7; j++) for (let i = -9; i <= 9; i++) {
    for (const T of [[node(i, j), node(i + 1, j), node(i, j + 1)], [node(i + 1, j), node(i + 1, j + 1), node(i, j + 1)]]) {
      if (!T.every(p => inside(p[0], p[1], 1.2))) continue;
      /* the cell's outline along the surface: each edge sampled and lifted */
      const ring = []; for (let e = 0; e < 3; e++) { const p = T[e], q = T[(e + 1) % 3]; for (let s = 0; s < 6; s++) { const f = s / 6, x = lerp(p[0], q[0], f), z = lerp(p[1], q[1], f); ring.push(lift(x, z)); } }
      const cx = (T[0][0] + T[1][0] + T[2][0]) / 3, cz = (T[0][1] + T[1][1] + T[2][1]) / 3;
      tris.push({ ring, c: [cx, cz], d: Math.hypot(cx, (cz - z0) * 0.8), n: shbDomeN(cx, cz) });
    }
  }
  tris.sort((p, q) => p.d - q.d);
  /* the rim (at the foot) and the widest line, for the outline */
  const rim = [], wide = [];
  for (let z = 59.4; z >= -59.5; z -= 1.2) { const W = shbHalfW(z); rim.push([W * 0.87, 0.65, z]); wide.push([W, shbDomeY(W - 0.01, z), z]); }
  for (let z = -59.5; z <= 59.4; z += 1.2) { const W = shbHalfW(z); rim.push([-W * 0.87, 0.65, z]); wide.push([-W, shbDomeY(-W + 0.01, z), z]); }
  return { a, z0, rh, lines, tris, rim, wide, node: [0, shbDomeY(0, z0), z0] };
})();

/* ============================== 1. interwoven arches form triangles (#53, #75; Brock: "interwoven arches forming triangles") ============================== */
/** one node of the lattice, close up: three continuous ribs crossing, filleted at all six corners (F9.27). (cx, cy) its
   centre, s px per mm; the three lines are drawn in the three blues the dome uses, so each reads as one line through */
function shbNodeClose(t, t0, cx, cy, s, o = {}) {
  const a = ep(t, t0, t0 + 0.6) * (o.alpha == null ? 1 : o.alpha); if (a <= 0.003) return;
  const w = 1.0, r = 0.6, L = o.L || 3.6, angs = [0, 1, 2, 3, 4, 5].map(k => k * Math.PI / 3 + (o.rot || 0));
  const P = p => [cx + p[0] * s, cy - p[1] * s], kf = ep(t, t0 + 0.5, t0 + 1.4, E.io3);
  G.save(); G.beginPath(); G.arc(cx, cy, L * s * 0.98, 0, TAU); G.clip();
  shbFill(shbNodeOutline(angs, w, L + 1, r * kf), P, C.hero, a);
  /* each family's centre line, continuous through the node */
  [0, 1, 2].forEach(f => { const an = angs[f], dx = Math.cos(an) * (L + 1), dy = Math.sin(an) * (L + 1); shbPath([P([-dx, -dy]), P([dx, dy])], C.panel, 1.6, a * 0.5 * kf, { dash: [7, 7], cap: 'butt' }); });
  G.restore();
  /* the arms fade into the tile */
  const g = G.createRadialGradient(cx, cy, L * s * 0.55, cx, cy, L * s); g.addColorStop(0, rgba(C.panel, 0)); g.addColorStop(1, rgba(C.panel, 1));
  G.save(); G.globalAlpha = a; G.fillStyle = g; G.beginPath(); G.arc(cx, cy, L * s + 1, 0, TAU); G.fill(); G.restore();
  return P;
}
S({
  id: 'shbArches', ch: 'shell', theme: 'paper', title: 'Interwoven arches form triangles', settle: 11, replaces: 'arches', after: 'shlLattice3d',
  ideas: [53, 75], src: ['shlDoc', 'shlLattice', 'shbModel'],
  draw: t => {
    header(t, 'Interwoven arches form triangles');
    captions(t, [[0.6, 'My lattice isn\'t triangles bent into arches. It is continuous arches, rim to rim, that cross each other.'], [3.4, 'A second family of arches crosses the first at 60°. Then a third.'], [6.2, 'Where three arches cross, the crossings close into triangles. The triangles come out of the arches.'], [8.8, 'Every node is three continuous ribs passing through each other, filleted at all six corners.']]);
    const L = SHB_LAT, tx = LM, ty = 280, tw0 = 1120, th0 = 640;
    demoWindow(tx, ty, tw0, th0, tileA(t, 0.25, 0));
    /* the camera: a slow drift and a gentle push toward the crown */
    const kz = ep(t, 0.4, 10.5, E.cam), drift = 0.05 * Math.sin(t * 0.22);
    const nodeW = L.node, T0 = [0, 12, -2], fit = shbOnce('archFit', () => { const c = shbCam({ yaw: -0.59, pitch: 0.64, s: 1, cx: 0, cy: 0, T: T0 }); let a = 1e9, b = -1e9, u = 1e9, v = -1e9; L.lines.forEach(l => l.pts.forEach(p => { const q = c(p); a = Math.min(a, q[0]); b = Math.max(b, q[0]); u = Math.min(u, q[1]); v = Math.max(v, q[1]); })); return { a, b, u, v }; });
    const sF = Math.min((tw0 - 140) / (fit.b - fit.a), (th0 - 190) / (fit.v - fit.u)) * lerp(0.97, 1.03, kz), cam = shbCam({ yaw: -0.62 + drift + 0.06 * kz, pitch: lerp(0.6, 0.68, kz), s: sF, cx: tx + tw0 / 2 - sF * (fit.a + fit.b) / 2, cy: ty + 60 + (th0 - 190) / 2 - sF * (fit.u + fit.v) / 2, T: T0 });
    const vis = n => n[0] * cam.view[0] + n[1] * cam.view[1] + n[2] * cam.view[2];
    clipped(tx + 2, ty + 2, tw0 - 4, th0 - 4, () => {
      /* the shell's outline: rim and widest line, quiet */
      const ka = ep(t, 0.5, 1.6);
      shbPath(L.wide.map(cam), C.faint, 1.5, ka * 0.55);
      shbPath(L.rim.map(cam), C.faint, 1.5, ka * 0.35, { dash: [5, 7] });
      /* the triangles, filled as the third family closes them */
      L.tris.forEach((T, i) => {
        const k = ep(t, 6.3 + i * 0.012, 6.9 + i * 0.012); if (k <= 0.003) return;
        const v = vis(T.n); if (v < 0.05) return;
        const P = T.ring.map(cam); G.save(); G.globalAlpha = k * clamp(v * 2.2) * 0.14; G.fillStyle = C.hero; G.beginPath(); P.forEach((p, q) => q ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.closePath(); G.fill(); G.restore();
      });
      /* the arches: three families, each drawn rim to rim, the central ones first */
      const fam0 = [1.0, 3.4, 5.6];
      L.lines.forEach(ln => {
        const order = Math.abs(ln.k), t0 = fam0[ln.fam] + order * 0.16, k = ep(t, t0, t0 + 1.1, E.io3); if (k <= 0.003) return;
        const col = C.heroGrad[ln.fam], P = ln.pts.map(cam), w = 3.0;
        const part = shbPart(P, k), nTop = ln.n.length, off = (ln.pts.length - nTop) / 2;
        let run = [], runVis = null;
        const flush = () => { if (run.length > 1) shbPath(run, col, runVis ? w : w * 0.6, runVis ? 0.95 : 0.16); };
        part.forEach((p, q) => {
          const ti = Math.min(nTop - 1, Math.max(0, q - off)), v = q < off || q >= off + nTop ? (ln.pts[Math.min(q, ln.pts.length - 1)][0] * cam.view[0] > 0 ? 1 : -1) : vis(ln.n[ti]);
          const on = v > 0.02; if (runVis === null) runVis = on;
          if (on !== runVis) { run.push(p); flush(); run = [p]; runVis = on; } else run.push(p);
        });
        flush();
        if (k < 1) { const tip = part[part.length - 1]; if (tip) glow(tip[0], tip[1], 14, col, 0.45 * (1 - k)); }
      });
      /* the crossing at the crown: the node the close-up shows */
      const kn = ep(t, 8.8, 9.6), nodeP = cam(nodeW);
      if (kn > 0.003) { circle(nodeP[0], nodeP[1], 14 + 26 * (1 - kn), { color: C.ink, w: 2, alpha: kn * 0.8 }); circle(nodeP[0], nodeP[1], 5, { fill: C.ink, alpha: kn }); }
    });
    shbFig(t, 1.2, tx + 32, ty + th0 - 32, '01', 'The Theseus top from the front left: three families of arches, 12.5 mm apart');
    /* the column: three steps, then the node close up */
    const cx = tx + tw0 + 40, cw = RM - cx;
    shbStep(t, 1.0, cx, ty + 16, cw, 1, 'One family of arches', 'Continuous ribs, rim to rim.', { swatch: C.heroGrad[0] });
    shbStep(t, 3.4, cx, ty + 120, cw, 2, 'A second, at 60°', 'It crosses the first at every rib.', { swatch: C.heroGrad[1] });
    shbStep(t, 5.6, cx, ty + 224, cw, 3, 'A third, at 120°', 'Where all three cross, triangles close.', { swatch: C.heroGrad[2] });
    /* the node at the crown, close up, in the drawing's empty corner: three ribs straight through, filleted */
    const nx = tx + tw0 - 124, nyc = ty + 180, an = ep(t, 8.6, 9.2);
    shbNodeClose(t, 8.9, nx, nyc, 24, { alpha: an, rot: Math.PI / 6 });
    text('The crown node', nx, nyc + 118, { role: 'label', size: 19, color: C.ink, align: 'center', alpha: an });
    ['Three ribs run', 'straight through,', 'filleted 0.6 mm'].forEach((l, i) => text(l, nx, nyc + 148 + i * 27, { role: 'small', size: 21, weight: 600, color: C.ink2, align: 'center', alpha: an }));
    /* the strip, holding: the arches are inside the lattice's number, the same dome */
    shbMeter(t, 6.8, 'shbArches', cx, ty + 380, cw, { compact: true });
    shbNote(t, 7.2, cx, ty + 600, cw, 'The strip holds here: the arches are the triangle lattice\'s own ribs, on the same dome.', { color: C.ink2, size: 24 });
  }
});

/* ============================== 2. geodesic domes: great circles make the triangles (#75; Brock: "show nasa mars base triangle domes") ==============================
   A geodesic sphere (an icosahedron, each face split four ways), cut to a dome. Its struts chained into continuous lines:
   at every six-way node a strut runs straight on into the next one, so the triangles are where the lines cross. */
const SHB_GEO = (function () {
  const f = 4, t0 = (1 + Math.sqrt(5)) / 2;
  const V0 = [[-1, t0, 0], [1, t0, 0], [-1, -t0, 0], [1, -t0, 0], [0, -1, t0], [0, 1, t0], [0, -1, -t0], [0, 1, -t0], [t0, 0, -1], [t0, 0, 1], [-t0, 0, -1], [-t0, 0, 1]];
  const F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  const nrm = v => { const l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; };
  /* turn vertex 0 to the top: a five-way node at the crown, as on classic domes */
  const up = nrm(V0[0]), ax = nrm([up[2], 0, -up[0]]), ang = Math.acos(up[1]);
  const rot = v => { const c = Math.cos(ang), s = Math.sin(ang), d = ax[0] * v[0] + ax[1] * v[1] + ax[2] * v[2], cr = [ax[1] * v[2] - ax[2] * v[1], ax[2] * v[0] - ax[0] * v[2], ax[0] * v[1] - ax[1] * v[0]]; return [0, 1, 2].map(i => v[i] * c + cr[i] * s + ax[i] * d * (1 - c)); };
  const V = V0.map(v => rot(nrm(v)));
  const pts = [], key = new Map(), idx = p => { const k = p.map(v => Math.round(v * 1e4)).join(','); if (!key.has(k)) { key.set(k, pts.length); pts.push(p); } return key.get(k); };
  const edges = new Set(), E2 = [];
  const addE = (a, b) => { if (a === b) return; const k = a < b ? a + ',' + b : b + ',' + a; if (!edges.has(k)) { edges.add(k); E2.push([Math.min(a, b), Math.max(a, b)]); } };
  for (const [A, B, Cc] of F) {
    const P = (i, j) => idx(nrm([0, 1, 2].map(q => V[A][q] + (V[B][q] - V[A][q]) * i / f + (V[Cc][q] - V[A][q]) * j / f)));
    for (let i = 0; i < f; i++) for (let j = 0; j < f - i; j++) {
      const a = P(i, j), b = P(i + 1, j), c = P(i, j + 1); addE(a, b); addE(b, c); addE(c, a);
      if (i + j < f - 1) { const d = P(i + 1, j + 1); addE(b, d); addE(d, c); }
    }
  }
  const ymin = -0.02, keep = E2.filter(([a, b]) => pts[a][1] >= ymin && pts[b][1] >= ymin);
  /* chain struts into continuous lines: at each node pair a strut with the one that continues it most nearly straight */
  const adj = new Map(); keep.forEach(([a, b], e) => { for (const [u, v] of [[a, b], [b, a]]) { if (!adj.has(u)) adj.set(u, []); adj.get(u).push([v, e]); } });
  const next = new Map();
  for (const [v, list] of adj) {
    for (const [u, e] of list) {
      const d1 = nrm([0, 1, 2].map(q => pts[v][q] - pts[u][q])); let best = null, bc = 0.9;
      for (const [w, e2] of list) { if (e2 === e) continue; const d2 = nrm([0, 1, 2].map(q => pts[w][q] - pts[v][q])), c = d1[0] * d2[0] + d1[1] * d2[1] + d1[2] * d2[2]; if (c > bc) { bc = c; best = e2; } }
      if (best != null) next.set(e + '@' + v, best);
    }
  }
  /* walk the chains (a pairing counts only when it is mutual) */
  const used = new Set(), chains = [];
  const other = (e, v) => keep[e][0] === v ? keep[e][1] : keep[e][0];
  keep.forEach((_, e0) => {
    if (used.has(e0)) return;
    const seq = [e0]; used.add(e0);
    for (const dir of [0, 1]) {
      let e = e0, v = keep[e0][dir];
      for (let g = 0; g < 60; g++) {
        const n = next.get(e + '@' + v); if (n == null || used.has(n)) break;
        const w = other(n, v); if (next.get(n + '@' + v) !== e) break;
        used.add(n); if (dir) seq.push(n); else seq.unshift(n); e = n; v = w;
      }
    }
    /* the chain as points */
    let start = keep[seq[0]][0]; if (seq.length > 1) { const [a, b] = keep[seq[0]], [c, d] = keep[seq[1]]; start = (a === c || a === d) ? b : a; }
    const P = [pts[start]]; let cur = start; for (const e of seq) { cur = other(e, cur); P.push(pts[cur]); }
    chains.push({ P, n: seq.length });
  });
  chains.sort((a, b) => b.n - a.n);
  const tris = [];
  return { pts, edges: keep, chains, f };
})();

S({
  id: 'shbDome', ch: 'shell', theme: 'night', title: 'Geodesic domes: great circles make the triangles', settle: 10, after: 'shbArches',
  ideas: [75, 53], src: ['shbFuller', 'shbHiseasNasa', 'shbHiseas', 'shbHiseasWiki'],
  draw: t => {
    header(t, 'Geodesic domes: great circles make the triangles');
    captions(t, [[0.6, 'NASA ran five long Mars simulations in HI-SEAS, on a Hawaiian volcano. The crews lived in a geodesic dome.'], [3.2, 'Fuller didn\'t start from triangles. He ran great circles round a sphere and let them cross, three ways.'], [6.8, 'My shell does the same: continuous arches over the dome, and triangles where they cross.']]);
    const D = SHB_GEO, tx = LM, ty = 280, tw0 = 1080, th0 = 640;
    demoWindow(tx, ty, tw0, th0, tileA(t, 0.25, 0));
    const cx = tx + tw0 / 2, gy = ty + th0 - 160, R = 320 * lerp(0.94, 1.0, ep(t, 0.3, 9, E.cam)), yaw = 0.35 + t * 0.07, pitch = 0.2;
    const cy0 = Math.cos(yaw), sy0 = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const P = p => { const x1 = p[0] * cy0 + p[2] * sy0, z1 = -p[0] * sy0 + p[2] * cy0; return [cx + R * x1, gy - R * (p[1] * cp - z1 * sp), p[1] * sp + z1 * cp]; };
    clipped(tx + 2, ty + 2, tw0 - 4, th0 - 4, () => {
      /* the ground: the dome's footing ring and a horizon */
      const kg = ep(t, 0.4, 1.4);
      const ring = []; for (let q = 0; q <= 72; q++) { const a = q / 72 * TAU; ring.push(P([Math.cos(a), 0, Math.sin(a)])); }
      shbPath(ring, C.faint, 1.5, kg * 0.6);
      line(tx + 60, gy + R * sp * 1.05 + 40, tx + tw0 - 60, gy + R * sp * 1.05 + 40, { color: C.hair, w: 1.5, alpha: kg });
      /* every strut, faint, coming up from the ground ring */
      const ks = ep(t, 0.6, 2.6);
      G.save(); G.lineCap = 'round';
      D.edges.forEach(([a, b]) => {
        const pa = P(D.pts[a]), pb = P(D.pts[b]), hgt = (D.pts[a][1] + D.pts[b][1]) / 2, k = clamp((ks * 1.3 - (1 - hgt) * 0.3) / 1.0); if (k <= 0) return;
        const front = (pa[2] + pb[2]) / 2 > -0.05;
        G.globalAlpha = k * (front ? 0.5 : 0.13); G.strokeStyle = C.ink2; G.lineWidth = front ? 1.8 : 1.2;
        G.beginPath(); G.moveTo(pa[0], pa[1]); G.lineTo(pb[0], pb[1]); G.stroke();
      });
      G.restore();
      /* the continuous lines, lit one after another, then all of them */
      const nShow = Math.min(D.chains.length, 14);
      D.chains.slice(0, 24).forEach((ch, i) => {
        const t1 = i < nShow ? 2.8 + i * 0.26 : 6.6 + (i - nShow) * 0.04, k = ep(t, t1, t1 + 0.9); if (k <= 0.003) return;
        const pts = shbPart(ch.P.map(P), k);
        const frontF = pts.map(p => p[2] > -0.05);
        let run = [], f0 = null;
        const flush = () => { if (run.length > 1) shbPath(run, acc(), f0 ? 3.2 : 1.6, f0 ? 0.95 : 0.25); };
        pts.forEach((p, q) => { const f = frontF[q]; if (f0 === null) f0 = f; if (f !== f0) { run.push(p); flush(); run = [p]; f0 = f; } else run.push(p); });
        flush();
        if (k < 1 && pts.length) { const tip = pts[pts.length - 1]; glow(tip[0], tip[1], 14, acc(), 0.5 * (1 - k)); }
      });
    });
    shbFig(t, 1.0, tx + 32, ty + th0 - 32, '02', 'A geodesic dome: its struts chained into lines straight through each node');
    /* the column: the dome NASA's crews lived in, and Fuller's own words */
    const x2 = tx + tw0 + 40, w2 = RM - x2, B = bento(x2, ty, w2, 320, 2, 1);
    statTile(t, 1.2, B(0, 0), { value: '5', label: 'Mars missions, in a dome', ev: 'measured', by: 'HI-SEAS' });
    statTile(t, 1.4, B(1, 0), { value: '7', unit: 'lb', label: 'carried per ounce of dome', ev: 'claim', by: 'Fuller 1954' });
    sourceBox(t, 3.4, x2, ty + 360, w2, 'Fuller 1954', 'His patent: a frame "in a geodesic pattern of approximate great circle arcs intersecting to form a three-way grid", which gives "substantially uniform stressing of all members".');
  }
});

/* ============================== the arch models: a flat plate and an arch, same span, same grams, same press ==============================
   2D frames (07-sim.js), a 10 mm strip of PP-C-20A: 60 mm across (a mouse's width), pinned feet. The flat plate is 0.9 mm
   thick; the arch is a parabola with a 20 mm rise, thinned so its 60 elements weigh the same (0.55 g). The press is 10 N
   over a 10 mm pad (a fingertip), or 10 N spread evenly over the span. Every number the slides print comes from these. */
const SHB_A = { span: 60, rise: 20, h0: 0.9, w: 10, n: 60, P: 10, pad: 10 };
/* No shell-meter step comes from this file. The meter's plain wall is the mouse's own dome, so the arch effect is already
   inside Shell A's 'lattice' step (a triangle lattice on a dome is the interwoven arches); the fibre gain and the side band
   can't be stated at the same press and the same mass without a mold-flow model and a 3D model of the band. */
function shbArchModel(kind, load, xc) {
  const A = SHB_A, pts = [];
  for (let i = 0; i <= A.n; i++) { const x = -A.span / 2 + A.span * i / A.n; pts.push([x, kind === 'flat' ? 0 : A.rise * (1 - Math.pow(2 * x / A.span, 2))]); }
  let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const h = kind === 'flat' ? A.h0 : A.h0 * A.span / L, mat = SIM_MAT.ppcf, nodes = [], c = feChain(nodes, pts, { w: A.w, h, E: mat.E, rho: mat.rho }), loads = {};
  if (load === 'uni') for (let i = 0; i <= A.n; i++) loads[i] = [0, -A.P * (i === 0 || i === A.n ? 0.5 : 1) / A.n, 0];
  else { const ids = []; for (let i = 0; i <= A.n; i++) if (Math.abs(pts[i][0] - xc) <= A.pad / 2 + 1e-9) ids.push(i); ids.forEach(i => { loads[i] = [0, -A.P / ids.length, 0]; }); }
  return { nodes, els: c.els, fix: { 0: 'xy', [A.n]: 'xy' }, loads, h, kind, mid: A.n / 2 };
}
const shbArch = (kind, load = 'pad', xc = 0) => simSolve('shbA:' + kind + ':' + load + ':' + xc, () => shbArchModel(kind, load, xc));
/** the arch with the pad anywhere from −24 to 24 mm: a blend of the two nearest solves (2 mm apart) */
function shbArchAt(xc) { const u = clamp((xc + 24) / 2, 0, 24), i = Math.min(23, Math.floor(u)), f = u - i; return shbBlend([shbArch('para', 'pad', -24 + 2 * i), shbArch('para', 'pad', -22 + 2 * i)], [1 - f, f]); }
/** the stage point on the bent arch at x (mm), its deflection drawn sc× real */
function shbOnArch(r, P, x, sc) { const m = r.model, u = clamp((x + SHB_A.span / 2) / SHB_A.span * SHB_A.n, 0, SHB_A.n), i = Math.min(SHB_A.n - 1, Math.floor(u)), f = u - i, q = j => [m.nodes[j][0] + r.d[j * 3] * sc, m.nodes[j][1] + r.d[j * 3 + 1] * sc], a = q(i), b = q(i + 1); return P([lerp(a[0], b[0], f), lerp(a[1], b[1], f)]); }
/** the arch's thrust at its feet: the axial force in its crown element, which lies flat */
const shbThrustH = r => -r.N[SHB_A.n / 2];
/** the thrust line of a solved arch: each element's centre moved out along its normal by e = M / |N| (mm) */
function shbThrustLine(r) {
  const m = r.model, out = [];
  m.els.forEach((el, e) => {
    const [x1, y1] = m.nodes[el.i], [x2, y2] = m.nodes[el.j], L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L, ny = (x2 - x1) / L;
    const Mm = (r.M1[e] + r.M2[e]) / 2, ex = Math.abs(r.N[e]) > 1e-6 ? Mm / Math.abs(r.N[e]) : 0;
    out.push([(x1 + x2) / 2 + nx * ex, (y1 + y2) / 2 + ny * ex, ex, el.h]);
  });
  out.unshift([m.nodes[0][0], m.nodes[0][1], 0, m.els[0].h]); out.push([m.nodes[m.nodes.length - 1][0], m.nodes[m.nodes.length - 1][1], 0, m.els[0].h]);
  return out;
}
const SHB_MODEL_LINE = '2D frames, a 10 mm strip of PP-C-20A (13.5 GPa), 60 mm across on pinned feet, the same 0.55 g each; the press over a 10 mm pad.';

/* ============================== 3. arch action vs a flat plate (Brock: "an elaborate and in depth force simulation ... comparison to flat planes") ==============================
   the pointer drags the press up to 10 N and holds it, then on: the plate cracks at its peak (120 MPa, the chapter's
   breaking stress), the arch carries on to its own. Flex drawn 2× real for both, so the comparison stays honest. */
S({
  id: 'shbPress', ch: 'shell', theme: 'paper', title: 'Arch action vs a flat plate', settle: 10, after: 'shbDome',
  ideas: [53, 75], src: ['shbModel', 'shlPyrofil', 'shlDoc'],
  draw: t => {
    const A = SHB_A, RF = shbArch('flat'), RA = shbArch('para'), ft = shbFt(), mid = A.n / 2;
    const pkF = RF.smax, pkA = RA.smax, dF = -RF.d[mid * 3 + 1], dA = -RA.d[mid * 3 + 1], brkF = ft / pkF * A.P, brkA = ft / pkA * A.P;
    header(t, 'Arch action vs a flat plate');
    captions(t, [[0.6, 'Same span, same weight, same press. A flat plate can only carry it by bending. An arch turns it into compression along its curve.'],
      [4.4, 'At 10 N the plate gives ' + fmtN(dF, 1) + ' mm and peaks at ' + fmtN(pkF, 0) + ' MPa. The arch gives ' + fmtN(dA, 2) + ' mm and peaks at ' + fmtN(pkA, 0) + ' MPa.'],
      [7.2, 'Press on and the plate cracks at ' + fmtN(brkF, 0) + ' N, where its peak reaches ' + ft + ' MPa. The arch has ' + Math.round((1 - brkF / brkA) * 100) + '% left there and holds to ' + fmtN(brkA, 0) + ' N.']]);
    /* the press: up to 10 N, held, then on until the plate cracks, and held there: the arch keeps its margin */
    const Fof = u => u < 1.9 ? 0 : u < 4.0 ? A.P * ep(u, 1.9, 4.0, E.io3) : u < 7.0 ? A.P : lerp(A.P, brkF, ep(u, 7.0, 8.0, E.io3));
    const F = Fof(t), tB = 8.0, brokeF = t >= tB, kc = ep(t, tB, tB + 0.5);
    const x0 = LM, y0 = 280, w0 = 1760, h0 = 660, a0 = tileA(t, 0.3, 0);
    demoWindow(x0, y0, w0, h0, a0);
    const s = 7.5, by = 600, cxF = 520, cxA = 1400, PF = p => [cxF + p[0] * s, by - p[1] * s], PA = p => [cxA + p[0] * s, by - p[1] * s];
    /* the two halves' names, and their flex, live */
    const aL = ep(t, 0.6, 1.1) * a0, kF = Math.min(F, brkF) / A.P, kA = F / A.P;
    text('A flat plate', x0 + 32, y0 + 56, { role: 'label', size: 22, color: C.ink, alpha: aL });
    text(fmtN(A.h0, 2) + ' mm thick', x0 + 32, y0 + 90, { role: 'small', size: 25, color: C.mute, alpha: aL });
    text('An arch', x0 + w0 - 32, y0 + 56, { role: 'label', size: 22, color: C.heroText, align: 'right', alpha: aL });
    text(fmtN(RA.model.h, 2) + ' mm thick, ' + A.rise + ' mm rise', x0 + w0 - 32, y0 + 90, { role: 'small', size: 25, color: C.mute, align: 'right', alpha: aL });
    const aR = ep(t, 1.6, 2.1) * a0;
    rich([{ s: 'Flex', role: 'label', size: 20, color: C.mute }, { s: fmtN(dF * kF, 2), font: 'disp', size: 34, weight: 800, color: C.ink, tnum: true, gap: 12 }, { s: 'mm', role: 'label', size: 20, color: C.mute, caps: false, gap: 6 }], x0 + 32, y0 + 140, { alpha: aR });
    rich([{ s: 'Flex', role: 'label', size: 20, color: C.mute }, { s: fmtN(dA * kA, 2), font: 'disp', size: 34, weight: 800, color: C.heroText, grad: C.heroGrad, tnum: true, gap: 12 }, { s: 'mm', role: 'label', size: 20, color: C.mute, caps: false, gap: 6 }], x0 + w0 - 32, y0 + 140, { align: 'right', alpha: aR });
    /* the press: a slider the pointer drags */
    const aS = ep(t, 0.8, 1.3) * a0, sx0 = 780, sx1 = 1140, sy = y0 + 96, Fmax = 50, kx = f => sx0 + (sx1 - sx0) * clamp(f / Fmax);
    rich([{ s: 'Press', role: 'label', size: 21, color: C.mute }, { s: fmtN(F, 0), font: 'disp', size: 44, weight: 800, color: C.ink, tnum: true, gap: 14 }, { s: 'N', role: 'label', size: 22, color: C.mute, gap: 6, caps: false }], 960, y0 + 58, { align: 'center', alpha: aS });
    rr(sx0, sy - 3, sx1 - sx0, 6, 3, C.track, null, 0, aS); rr(sx0, sy - 3, Math.max(6, kx(F) - sx0), 6, 3, C.ink2, null, 0, aS);
    text('0', sx0, sy + 34, { role: 'tick', color: C.faint, align: 'center', alpha: aS }); text(Fmax + ' N', sx1, sy + 34, { role: 'tick', color: C.faint, align: 'center', alpha: aS });
    circle(kx(F), sy, 11, { fill: C.panel, color: C.ink, w: 2.5, alpha: aS });
    /* the frames, on one heat scale against the break: the plate stops at its break, cracked, in red; the arch carries the
       same press far from its own */
    const aF = ep(t, 0.9, 1.5) * a0, aA = ep(t, 1.1, 1.7) * a0;
    feDraw(RF, PF, { scale: 2, load: kF, smax: ft, w: s, alpha: aF * (1 - 0.45 * kc), seg: 8 });
    feDraw(RA, PA, { scale: 2, load: kA, smax: ft, w: s, alpha: aA, seg: 8 });
    feFlow(RA, PA, t, { scale: 2, load: kA, alpha: aA * 0.9 });
    for (const [P, a] of [[PF, aF], [PA, aA]]) { feSupport(P([-A.span / 2, 0]), 'pin', { alpha: a }); feSupport(P([A.span / 2, 0]), 'pin', { alpha: a }); }
    const topF = PF([0, RF.d[mid * 3 + 1] * 2 * kF]), topA = PA([0, A.rise + RA.d[mid * 3 + 1] * 2 * kA]);
    shbPad(topF[0], topF[1] - A.h0 * s / 2, A.pad * s, F / Fmax, aF * (1 - kc));
    shbPad(topA[0], topA[1] - RA.model.h * s / 2, A.pad * s, F / Fmax, aA);
    if (kc > 0.003) { const yb = topF[1] + A.h0 * s / 2 + 2; shbPath([[topF[0] + 1, yb], [topF[0] - 4, yb - 4], [topF[0] + 3, yb - 8], [topF[0] - 2, yb - 13]], C.bad, 3, kc * aF); }
    /* the pointer drags the press */
    const pA = ep(t, 1.0, 1.4) * (1 - ep(t, 9.0, 9.4)) * a0, kp = ep(t, 1.0, 1.8, E.cam), pk = [kx(0) + 3, sy + 3];
    cursorPtr(t < 1.8 ? lerp(960, pk[0], kp) : kx(F) + 3, t < 1.8 ? lerp(y0 + 330, pk[1], kp) : pk[1], { a: pA, press: t > 1.8 && t < 2.3 ? prog(t, 1.8, 2.3) : 0, grab: t >= 1.8 });
    /* the readouts under each frame: the full label, the gauge (the plate's on the heat scale, Theseus's in its colour),
       the peak and where it stands */
    const ry = by + 130;
    [[RF, cxF, kF, brokeF, false], [RA, cxA, kA, false, true]].forEach(([r, cx, k, broke, arch]) => {
      const a = ep(t, 1.6, 2.1) * a0, pk2 = r.smax * k, fr = pk2 / ft, gx = cx - 270, gw = 540;
      text(SHELL_PEAK_LAB, gx, ry, { role: 'label', size: 19, color: C.mute, alpha: a });
      if (arch) { rr(gx, ry + 18, gw, 14, 7, C.track, null, 0, a); rr(gx, ry + 18, Math.max(14, gw * clamp(fr)), 14, 7, C.hero, null, 0, a); line(gx + gw, ry + 9, gx + gw, ry + 41, { color: C.bad, w: 2.5, dash: [5, 4], alpha: a }); }
      else shbGauge(gx, ry + 18, gw, fr, a);
      rich([{ s: fmtN(pk2, 0), font: 'disp', size: 34, weight: 800, color: broke ? C.bad : arch ? C.heroText : C.ink, grad: arch ? C.heroGrad : null, tnum: true }, { s: 'MPa', role: 'label', size: 20, color: C.mute, caps: false, gap: 6 },
        { s: broke ? 'Cracked at ' + fmtN(brkF, 0) + ' N' : arch ? 'Margin ' + Math.round((1 - fr) * 100) + '%' : 'Margin ' + Math.round((1 - fr) * 100) + '%', role: 'label', size: 19, color: broke ? C.bad : arch ? C.heroText : C.ink2, gap: 20 }], gx, ry + 78, { alpha: a });
      text('Breaks at ' + ft + ' MPa', gx + gw, ry + 78, { role: 'label', size: 19, color: C.bad, align: 'right', alpha: a });
    });
    /* how much, at a glance, between the two: the stiffness, then the load, before → after */
    const k1 = ep(t, 4.6, 5.2), kd = ep(t, 8.2, 9.0, E.io3);
    shellHL(t, 4.6, 960, by - 70, fmtN(dF / dA, 0) + '×', 'stiffer', { size: 116, count: false, align: 'center', a: k1 });
    shellHL(t, 5.2, 960, by + 64, fmtN(brkA / brkF, 1) + '×', 'the load', { size: 84, count: false, align: 'center' });
    shellBA(t, 960, by + 150, { before: fmtN(brkF, 0), after: fmtN(brkA, 0), unit: 'N', size: 44, k: kd, a: ep(t, 8.0, 8.4), align: 'center', net: 'before it cracks' });
    /* the strip, holding: the arch is already inside the lattice's number (the same dome) */
    shbMeter(t, 2.6, 'shbPress', x0 + 32, y0 + h0 - 84, w0 - 64, { row: true });
    /* the model, in a line, and the datasheet the break comes from */
    const am = ep(t, 1.8, 2.3);
    text('2D frames: a 10 mm strip of PP-C-20A, 60 mm across on pinned feet, 0.55 g each, pressed over a 10 mm pad. Flex drawn 2× real.', LM, 968, { role: 'small', size: 22, color: C.faint, alpha: am, maxW: RM - LM - pillW('datasheet', { by: 'Pyrofil' }) - 48 });
    pill(RM - pillW('datasheet', { by: 'Pyrofil' }), 968, 'datasheet', am, { by: 'Pyrofil' });
  }
});

/* ============================== 4. the thrust line (Brock: "text explanation of why/how arches are so strong") ==============================
   Hooke's hanging chain under a spread load (pure tension), turned over into the arch (pure compression, the same
   shape: the thrust line runs inside the rib). Then the load gathers into a fingertip press and the pointer drags it
   off the crown: the thrust line (e = M / |N| off the rib's axis, from the solve) leaves the rib, and the bending shows. */
S({
  id: 'shbThrust', ch: 'shell', theme: 'night', title: 'The thrust line', settle: 10.6, after: 'shbPress',
  ideas: [53, 75], src: ['shbHooke', 'shbModel'],
  draw: t => {
    const A = SHB_A, RU = shbArch('para', 'uni'), RC = shbArch('para', 'pad', 0), mid = A.n / 2;
    header(t, 'The thrust line');
    captions(t, [[0.6, 'Hang a chain under a spread load and it takes the one shape that is pure tension.'], [2.9, 'Turn it over and it is an arch in pure compression. Hooke, 1675. That shape is the load\'s thrust line.'], [5.7, 'Gather the load into a fingertip and the thrust line becomes a peak. Where it leaves the rib, the rib bends.'], [8.4, 'Move the press off the crown and the thrust line follows it. The arch still turns most of it into thrust at its feet.']]);
    const x0 = LM, y0 = 280, w0 = 1080, h0 = 640, a0 = tileA(t, 0.3, 0);
    demoWindow(x0, y0, w0, h0, a0);
    const s = 14, cx = x0 + 540, by = y0 + 520, ym = by - A.rise * s / 2;
    /* the flip: −1 the hanging chain, +1 the arch (mirrored about the middle line) */
    const phi = lerp(-1, 1, ep(t, 2.7, 4.0, E.io3)), P = p => [cx + p[0] * s, ym + phi * (by - p[1] * s - ym)];
    /* the load: spread (0) gathering into a pad at the crown (1), then dragged to xc */
    const g = ep(t, 5.6, 6.5, E.io3), xc = lerp(0, -16, ep(t, 8.2, 9.8, E.cam));
    const R = g < 1 ? shbBlend([RU, RC], [1 - g, g]) : shbArchAt(xc);
    const aD = ep(t, 0.7, 1.3) * a0;
    clipped(x0 + 2, y0 + 2, w0 - 4, h0 - 4, () => {
      if (phi < 0) {
        /* the chain: beads, the hangers at the pins, and the weights */
        const pts = RU.model.nodes.map(P);
        G.save(); G.globalAlpha = aD; G.strokeStyle = C.ink2; G.lineWidth = 7; G.lineCap = 'round'; G.setLineDash([0.1, 11]); G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.stroke(); G.restore();
        for (const xs of [-1, 1]) { const p = P([xs * A.span / 2, 0]); line(p[0] - 22, p[1] - 12 * -phi, p[0] + 22, p[1] - 12 * -phi, { color: C.mute, w: 2, alpha: aD }); circle(p[0], p[1], 5, { fill: C.mute, alpha: aD }); }
        for (let q = 1; q < 10; q++) { const i = q * 6, p = pts[i], dl = 34 * -phi; line(p[0], p[1], p[0], p[1] + dl, { color: C.mute, w: 1.5, alpha: aD }); rr(p[0] - 6, p[1] + dl, 12, 10 * -phi, 2, C.mute, null, 0, aD); }
        /* tension runs out along the chain, toward the pins */
        feFlow(Object.assign({}, RU, { N: RU.N.map(v => -v) }), P, t, { scale: 0, alpha: aD * 0.8 * -phi, nmax: 9 });
      } else {
        const kL = ep(t, 3.6, 4.2);
        feDraw(R, P, { scale: 3, load: 1, smax: shbFt(), w: s, alpha: aD * phi, seg: 8 });
        feFlow(R, P, t, { scale: 3, load: 1, alpha: aD * phi * 0.8, nmax: 9 });
        for (const xs of [-1, 1]) feSupport(P([xs * A.span / 2, 0]), 'pin', { alpha: aD * phi });
        /* the load: small arrows spread along the top, gathering into the pad */
        for (let q = 1; q < 10; q++) {
          const x = -A.span / 2 + q * 6, xg = lerp(x, xc + (q - 5) * 1.1, g), ya = A.rise * (1 - Math.pow(2 * xg / A.span, 2)), p = P([xg, ya]);
          arrow(p[0], p[1] - 46, p[0], p[1] - 10, { color: C.mute, w: 2, hs: 10, alpha: aD * kL * (1 - ep(t, 6.3, 6.6)) });
        }
        if (g > 0.003) { const p = shbOnArch(R, P, xc, 3); shbPad(p[0], p[1] - 2, A.pad * s, 0.25, aD * ep(t, 6.2, 6.6), C.ink2); }
        /* the thrust line, from the solve: inside the rib where |e| < h / 2 */
        const kT = ep(t, 4.1, 5.0), TL = shbThrustLine(R).map(q => { const p = P([q[0], q[1]]); return [p[0], p[1], q[2], q[3]]; });
        if (kT > 0.003) {
          const pts = shbPart(TL.map(q => [q[0], q[1]]), kT);
          shbPath(pts, C.ink, 3, aD * phi);
          if (kT >= 1) { let top = TL[0]; TL.forEach(q => { if (q[1] < top[1]) top = q; }); callout(t, 4.9, [top[0], top[1]], 'Thrust line', { to: [top[0] + 110, top[1] - 36], side: 'r', color: C.ink, alpha: aD * phi }); }
        }
        /* the thrust at the feet: the abutments push back on the arch */
        const H = shbThrustH(R), kH = ep(t, 4.6, 5.2) * aD;
        if (kH > 0.003) for (const xs of [-1, 1]) { const p = P([xs * A.span / 2, 0]); arrow(p[0] + xs * 92, p[1] - 3, p[0] + xs * 22, p[1] - 3, { color: C.heroText, w: 3, hs: 14, alpha: kH }); }
        if (kH > 0.003) { const p = P([-A.span / 2, 0]); text('Thrust ' + fmtN(H, 1) + ' N', p[0] - 96, p[1] + 50, { role: 'label', size: 20, color: C.heroText, alpha: kH }); }
      }
    });
    /* the press, held and moved by the pointer */
    if (t > 6.4) {
      const p = shbOnArch(R, P, xc, 3);
      cursorPtr(p[0] + 6, p[1] - 74, { a: ep(t, 6.4, 6.9) * (1 - ep(t, 9.8, 10.2)) * a0, grab: t > 7.4, press: t > 7.0 && t < 7.45 ? prog(t, 7.0, 7.45) : 0 });
    }
    /* readouts: the peak now, against the strength */
    const ka = ep(t, 4.4, 4.9) * a0;
    text(SHELL_PEAK_LAB, x0 + w0 - 32, y0 + 52, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ka });
    rich([{ s: fmtN(R.smax, R.smax < 10 ? 1 : 0), font: 'disp', size: 40, weight: 800, color: C.heroText, grad: C.heroGrad, tnum: true }, { s: 'MPa', role: 'label', size: 20, color: C.mute, caps: false, gap: 6 }], x0 + w0 - 32, y0 + 100, { align: 'right', alpha: ka });
    text('Of ' + shbFt() + ' MPa it can take', x0 + w0 - 32, y0 + 134, { role: 'small', size: 22, color: C.mute, align: 'right', alpha: ka });
    text('2D frame: a parabolic arch, 0.72 mm rib, 10 N spread, then on a 10 mm pad. Flex drawn 3× real.', x0 + 32, y0 + h0 - 30, { role: 'small', size: 22, color: C.faint, alpha: ep(t, 1.2, 1.7) * a0, maxW: w0 - 64 });
    /* the column: three steps, and where the idea comes from */
    const cx2 = x0 + w0 + 40, cw = RM - cx2;
    shbStep(t, 0.7, cx2, y0 + 16, cw, 1, 'Hang it', 'A chain under a spread load: pure tension.');
    shbStep(t, 2.9, cx2, y0 + 124, cw, 2, 'Turn it over', 'It stands as an arch in pure compression. Hooke, 1675: "As hangs the flexible line, so but inverted will stand the rigid arch."');
    rich([{ s: 'Block, DeJong and Ochsendorf', role: 'small', size: 22, weight: 600, color: C.ink2 }, { s: '2006', role: 'small', size: 22, weight: 800, color: C.ink, gap: 8 }], cx2 + 76, y0 + 300, { alpha: ep(t, 3.3, 3.7) });
    shbStep(t, 5.7, cx2, y0 + 334, cw, 3, 'Press it', 'The thrust line moves with the press. Outside the rib, the rib bends.');
    /* the strip, holding: the arch is inside the lattice's number */
    shbMeter(t, 6.4, 'shbThrust', cx2, y0 + 484, cw, { compact: true });
  }
});

/* ============================== 5. arch thrust cancels bending (Brock: "bending simulation"; "why/how arches are so strong") ==============================
   the moment along the span: the flat plate's M0, the arch's thrust times its height H·y, and what is left, M = M0 − H·y
   (the solver's own moments, which match the identity to 0.1 N·mm). Left: the stress through the depth at the worst
   section of each: bending loads the skins and leaves the middle idle; the thrust loads all of it. */
S({
  id: 'shbBend', ch: 'shell', theme: 'paper', title: 'Arch thrust cancels bending', settle: 10.2, after: 'shbThrust',
  ideas: [53, 75], src: ['shbModel', 'shlPyrofil'],
  draw: t => {
    const A = SHB_A, RF = shbArch('flat'), RA = shbArch('para'), RU = shbArch('para', 'uni'), H = shbThrustH(RA), ft = shbFt();
    const els = RA.model.els, xm = e => (RA.model.nodes[els[e].i][0] + RA.model.nodes[els[e].j][0]) / 2, yA = e => (RA.model.nodes[els[e].i][1] + RA.model.nodes[els[e].j][1]) / 2;
    const M0 = els.map((_, e) => (RF.M1[e] + RF.M2[e]) / 2), MA = els.map((_, e) => (RA.M1[e] + RA.M2[e]) / 2);
    const m0 = Math.max(...M0), ma = Math.max(...MA.map(Math.abs)), cut = 1 - ma / m0;
    header(t, 'Arch thrust cancels bending');
    captions(t, [[0.6, 'A flat plate bends with the whole moment the press makes, M₀, biggest under the press.'], [3.8, 'An arch\'s feet push back with its thrust H. Times the arch\'s height y, that is a moment H·y, and it cancels most of M₀.'], [7.0, 'What is left bends the arch: ' + Math.round(cut * 100) + '% less. A dome does this every way round, which is why a thin curved shell is strong for its weight.']]);
    /* right: the moment along the span */
    const x0 = 680, y0 = 280, w0 = 1160, h0 = 640, a0 = tileA(t, 0.3, 1);
    demoWindow(x0, y0, w0, h0, a0);
    const gx0 = x0 + 100, gx1 = x0 + w0 - 60, gz = y0 + 560, ky = 300 / 140, X = x => gx0 + (x + A.span / 2) / A.span * (gx1 - gx0), Y = m => gz - m * ky;
    const kA = ep(t, 0.9, 2.6, E.io3), kH = ep(t, 4.0, 5.8, E.io3), kR = ep(t, 5.6, 6.4), aG = ep(t, 0.6, 1.1) * a0;
    /* the small arch over the chart, with its thrust and its height */
    const ps = 5.2, pcx = x0 + 300, pby = y0 + 190, PP = p => [pcx + p[0] * ps, pby - p[1] * ps];
    shbPath(RA.model.nodes.map(PP), C.ink2, 4, aG);
    for (const xs of [-1, 1]) { const p = PP([xs * 30, 0]); feSupport(p, 'pin', { alpha: aG, s: 10 }); if (kH > 0.003) arrow(p[0] + xs * (30 + 40 * kH), p[1] - 2, p[0] + xs * 14, p[1] - 2, { color: C.hero, w: 3, hs: 12, alpha: aG * kH }); }
    { const p = PP([-14, 0]), q = PP([-14, A.rise * (1 - Math.pow(28 / 60, 2))]); line(p[0], p[1], q[0], q[1], { color: C.mute, w: 1.5, dash: [4, 4], alpha: aG }); text('y', p[0] + 10, (p[1] + q[1]) / 2 + 8, { role: 'label', size: 21, color: C.mute, caps: false, alpha: aG }); }
    if (kH > 0.003) text('H', PP([30, 0])[0] + 52, PP([30, 0])[1] - 12, { role: 'label', size: 21, color: C.heroText, caps: false, alpha: aG * kH });
    shbPad(pcx, PP([0, A.rise])[1] - 2, A.pad * ps, 0.2, aG);
    glossBox(t, 1.6, x0 + 620, y0 + 40, 500, 'Bending moment', 'How hard a press tries to turn a section. Bending stresses a part\'s skins; thrust loads all of it.');
    /* axes */
    line(gx0, gz, gx1, gz, { color: C.hair, w: 1.5, alpha: aG }); line(gx0, Y(140), gx0, Y(-24), { color: C.hair, w: 1.5, alpha: aG });
    for (const m of [0, 50, 100]) text(String(m), gx0 - 12, Y(m) + 7, { role: 'tick', color: C.faint, align: 'right', alpha: aG });
    text('Moment, {N·mm}', gx0 - 12, Y(140) - 14, { role: 'label', size: 19, color: C.mute, alpha: aG });
    text('Along the span', gx1, gz + 40, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: aG });
    /* M0: the plate's moment, the danger */
    const xsA = els.map((_, e) => X(xm(e))), clipX = gx0 + (gx1 - gx0) * kA;
    G.save(); G.beginPath(); G.rect(gx0 - 2, y0, clipX - gx0 + 2, h0); G.clip();
    G.globalAlpha = aG * 0.22; G.fillStyle = heatCol(0.9); G.beginPath(); G.moveTo(X(-30), gz); M0.forEach((m, e) => G.lineTo(xsA[e], Y(m))); G.lineTo(X(30), gz); G.closePath(); G.fill(); G.restore();
    G.save(); G.beginPath(); G.rect(gx0 - 2, y0, clipX - gx0 + 2, h0); G.clip(); shbPath([[X(-30), gz]].concat(M0.map((m, e) => [xsA[e], Y(m)]), [[X(30), gz]]), heatCol(0.9), 3, aG); G.restore();
    /* H·y rising as the thrust turns on, and what is left: M0 − k H y */
    if (kH > 0.003) {
      const hy = els.map((_, e) => H * yA(e) * kH), res = M0.map((m, e) => m - hy[e]);
      shbPath(hy.map((v, e) => [xsA[e], Y(v)]), C.hero, 4, aG);
      G.save(); G.globalAlpha = aG * 0.55; G.fillStyle = heatCol(Math.min(1, Math.max(...res.map(Math.abs)) / m0) * 0.9); G.beginPath(); G.moveTo(X(-30), gz); res.forEach((v, e) => G.lineTo(xsA[e], Y(v))); G.lineTo(X(30), gz); G.closePath(); G.fill(); G.restore();
    }
    /* labels at the peaks */
    const kl = ep(t, 2.4, 2.9) * aG;
    text('Flat plate {M₀} ' + fmtN(m0, 0), X(0) - 40, Y(m0) - 12, { role: 'label', size: 20, color: C.ink, alpha: kl, align: 'right' });
    if (kH > 0.5) text('Arch thrust {H·y} ' + fmtN(H * A.rise, 0), X(-14), Y(H * yA(14)) - 26, { role: 'label', size: 20, color: C.heroText, alpha: ep(t, 5.2, 5.7) * aG, align: 'right' });
    text('Left to bend the arch ' + fmtN(ma, 0), X(0), gz + 40, { role: 'label', size: 20, color: C.ink, alpha: kR * aG, align: 'center' });
    rich([{ s: '−' + Math.round(cut * 100), font: 'disp', size: 84, weight: 800, grad: C.heroGrad, color: C.heroText, tnum: true }, { s: '%', font: 'disp', size: 40, weight: 700, grad: C.heroGrad, color: C.heroText, gap: 4 }], gx1, Y(118), { align: 'right', alpha: ep(t, 6.4, 7.0) * a0 });
    text('bending, same press', gx1, Y(118) + 36, { role: 'small', size: 25, color: C.ink2, align: 'right', alpha: ep(t, 6.4, 7.0) * a0 });
    text(SHB_MODEL_LINE + ' The solver\'s own moments: H = ' + fmtN(H, 2) + ' N, and M = M₀ − H·y to 0.1 N·mm.', LM, 962, { role: 'small', size: 22, color: C.faint, alpha: ep(t, 6.6, 7.1), maxW: RM - LM });
    /* left: the stress through the depth of each section, as the bending simulation sees it */
    const lx = LM, lw = 560, cards = [
      ['The plate, under the press', RF, 'pad', 0.9, 1.2], ['The arch, at its worst point', RA, 'pad', 0, 3.4]];
    /* the strip, holding, under the two sections: the arch is inside the lattice's number */
    shbMeter(t, 6.0, 'shbBend', lx, 740, lw, { compact: true });
    cards.forEach(([nm, r, ld, _, t0], i) => {
      const cy = 280 + i * 220, ch = 200, a = tileA(t, t0, 0);
      demoWindow(lx, cy, lw, ch, a);
      if (a <= 0.003) return;
      /* the worst element: its axial stress and its bending stress */
      const e = r.sig.indexOf(r.smax), el = r.model.els[e], Ar = el.w * el.h, I = el.w * el.h * el.h * el.h / 12, Mm = Math.abs(r.M1[e]) > Math.abs(r.M2[e]) ? r.M1[e] : r.M2[e];
      const sN = r.N[e] / Ar, sB = Mm * el.h / 2 / I, top = sN - sB, bot = sN + sB;
      text(nm, lx + 32, cy + 44, { role: 'label', size: 20, color: C.ink, alpha: a });
      const sx = lx + 52, sw = 44, dpx = 118, sh = el.h * dpx, syc = cy + 122, st = syc - sh / 2, kk = ep(t, t0 + 0.4, t0 + 1.3, E.io3), sc = 150 / 101;
      /* the section, in layers coloured by their stress */
      for (let q = 0; q < 12; q++) { const f = (q + 0.5) / 12, sv = lerp(top, bot, f) * kk; rect(sx, st + q * sh / 12, sw, sh / 12 + 0.5, { fill: heatCol(Math.abs(sv) / ft), alpha: a }); }
      rr(sx, st, sw, sh, 2, null, C.ink2, 1.5, a * 0.6);
      /* the stress block: an arrow per layer, squeezing in (compression) or pulling out (tension) */
      const bx = sx + sw + 24; line(bx, st - 6, bx, st + sh + 6, { color: C.mute, w: 1.5, alpha: a });
      for (let q = 0; q <= 8; q++) { const f = q / 8, sv = lerp(top, bot, f) * kk, L = sv * sc, yq = st + f * sh; if (Math.abs(L) > 3) arrow(L < 0 ? bx - L : bx, yq, L < 0 ? bx : bx + L, yq, { color: heatCol(Math.abs(sv) / ft), w: 3, hs: 9, alpha: a }); }
      if (top * bot < 0) { const f0 = top / (top - bot), yn = st + f0 * sh; line(sx - 8, yn, bx + 170, yn, { color: C.mute, w: 1.5, dash: [4, 4], alpha: a * kk }); text('Neutral axis: idle', bx + 190, yn + 8, { role: 'small', size: 22, color: C.mute, alpha: a * ep(t, t0 + 1.0, t0 + 1.4) }); }
      const vx = ld === 'uni' ? bx + 40 : bx + 190;
      text((top < 0 ? 'Squeezed ' : 'Stretched ') + fmtN(Math.abs(top * kk), Math.abs(top) < 10 ? 1 : 0) + ' MPa' + (ld === 'uni' ? ', all through' : ''), vx, ld === 'uni' ? syc + 8 : st + 6, { role: 'small', size: 22, color: C.ink2, alpha: a * ep(t, t0 + 1.0, t0 + 1.4) });
      if (ld !== 'uni') text((bot < 0 ? 'Squeezed ' : 'Stretched ') + fmtN(Math.abs(bot * kk), Math.abs(bot) < 10 ? 1 : 0) + ' MPa', vx, st + sh + 16, { role: 'small', size: 22, color: C.ink2, alpha: a * ep(t, t0 + 1.0, t0 + 1.4) });
    });
  }
});
/* ---------- the melt at a lattice node: a 2D Stokes flow and the fibres it carries (illustrative) ----------
   Three continuous ribs (1.0 mm wide) cross at 60°; the melt comes in along one of them and leaves by the other five.
   Stream function and vorticity on a grid (h mm), solved by over-relaxation; the solid islands between the ribs hold
   their own ψ (the flux each arm carries), the open ends carry a parabolic (Poiseuille) profile, the walls take Thom's
   vorticity. Fillets round each island's tip (radius r). Fibres are rigid rods carried by the flow and turned by
   Jeffery's equation (λ = 0.98, long fibres). Everything is computed once and kept. */
function shbStokes(r, o = {}) {
  const W = 1.0, Lr = o.L || 4.2, h = o.h || 1 / 14, N = Math.round(2 * Lr / h) + 1, c = (N - 1) / 2, n = N * N;
  const X = i => (i - c) * h, Y = j => (j - c) * h;
  const dirs = [0, 60, 120].map(a => [Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180)]);
  const fluid = new Uint8Array(n), island = new Int8Array(n).fill(-1), half = W / 2, tipD = half / Math.sin(Math.PI / 6);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const x = X(i), y = Y(j), k = j * N + i;
    let f = dirs.some(d => Math.abs(-d[1] * x + d[0] * y) <= half + 1e-9);
    const isl = Math.floor(((Math.atan2(y, x) + TAU) % TAU) / (Math.PI / 3));
    if (!f && r > 0) {
      const b = (30 + 60 * isl) * Math.PI / 180, ux = Math.cos(b), uy = Math.sin(b), sAl = x * ux + y * uy - tipD, nn = -x * uy + y * ux;
      const dc = r / Math.sin(Math.PI / 6), tlen = r / Math.tan(Math.PI / 6);
      if (sAl < tlen * Math.cos(Math.PI / 6) && Math.hypot(sAl - dc, nn) > r) f = true;
    }
    if (Math.hypot(x, y) > Lr) f = false;
    fluid[k] = f ? 1 : 0; if (!f) island[k] = isl;
  }
  const flux = o.flux || [0.4, 0.22, 0.08, -1, 0.08, 0.22], psiIsl = new Float64Array(6);
  for (let k = 0; k < 6; k++) psiIsl[k] = (k ? psiIsl[k - 1] : 0) + flux[k];
  const psi = new Float64Array(n), om = new Float64Array(n), isB = new Uint8Array(n);
  for (let k = 0; k < n; k++) if (!fluid[k]) psi[k] = psiIsl[island[k]];
  const Rr = Lr - 1.5 * h;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i; if (!fluid[k]) continue; const x = X(i), y = Y(j);
    if (Math.hypot(x, y) > Rr) {
      const arm = Math.round(((Math.atan2(y, x) + TAU) % TAU) / (Math.PI / 3)) % 6, th = arm * Math.PI / 3;
      const eta = clamp((-Math.sin(th) * x + Math.cos(th) * y) / W + 0.5), p0 = psiIsl[(arm + 5) % 6], q = psiIsl[arm] - p0;
      psi[k] = p0 + q * (3 * eta * eta - 2 * eta * eta * eta); om[k] = -q * (6 - 12 * eta) / (W * W); isB[k] = 1;
    }
  }
  const inner = [], wallN = [];
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const k = j * N + i;
    if (fluid[k] && !isB[k]) inner.push(k);
    if (!fluid[k]) { const nb = [k - 1, k + 1, k - N, k + N].filter(q => fluid[q]); if (nb.length) wallN.push([k, nb]); }
  }
  const h2 = h * h, wS = 1.6, wO = 1.0, relW = 0.1, its = o.iters || 2500;
  for (let it = 0; it < its; it++) {
    for (const [k, nb] of wallN) { let sm = 0; for (const q of nb) sm += -2 * (psi[q] - psi[k]) / h2; om[k] = om[k] * (1 - relW) + relW * sm / nb.length; }
    for (const k of inner) { const v = 0.25 * (om[k - 1] + om[k + 1] + om[k - N] + om[k + N]); om[k] += wO * (v - om[k]); }
    for (const k of inner) { const v = 0.25 * (psi[k - 1] + psi[k + 1] + psi[k - N] + psi[k + N] + h2 * om[k]); psi[k] += wS * (v - psi[k]); }
  }
  /* velocity, its gradient and the shear rate on the grid (zero in the steel) */
  const u = new Float64Array(n), v = new Float64Array(n), gxx = new Float64Array(n), gxy = new Float64Array(n), gyx = new Float64Array(n), gyy = new Float64Array(n), sh = new Float64Array(n);
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) { const k = j * N + i; if (!fluid[k]) continue; u[k] = (psi[k + N] - psi[k - N]) / (2 * h); v[k] = -(psi[k + 1] - psi[k - 1]) / (2 * h); }
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const k = j * N + i; if (!fluid[k]) continue;
    gxx[k] = (u[k + 1] - u[k - 1]) / (2 * h); gxy[k] = (u[k + N] - u[k - N]) / (2 * h); gyx[k] = (v[k + 1] - v[k - 1]) / (2 * h); gyy[k] = (v[k + N] - v[k - N]) / (2 * h);
    sh[k] = Math.sqrt(2 * (gxx[k] * gxx[k] + gyy[k] * gyy[k]) + (gxy[k] + gyx[k]) * (gxy[k] + gyx[k]));
  }
  const at = (F, x, y) => { const fi = x / h + c, fj = y / h + c, i0 = Math.floor(fi), j0 = Math.floor(fj); if (i0 < 0 || j0 < 0 || i0 >= N - 1 || j0 >= N - 1) return 0; const fx = fi - i0, fy = fj - j0, k = j0 * N + i0; return (1 - fx) * (1 - fy) * F[k] + fx * (1 - fy) * F[k + 1] + (1 - fx) * fy * F[k + N] + fx * fy * F[k + N + 1]; };
  return { N, h, c, X, Y, fluid, psi, u, v, gxx, gxy, gyx, gyy, sh, at, Lr, W, r };
}
/** fibres through the node: seeded evenly across the inlet with a small scatter in angle, carried and turned.
   Each comes back as samples every dt time units: [x, y, angle], and its exit arm and its misalignment there */
function shbFibres(F, o = {}) {
  const nf = o.n || 90, lam = 0.98, dt = o.dt || 0.05, R = rng(o.seed || 7), out = [];
  for (let s = 0; s < nf; s++) {
    let x = -(F.Lr - 0.35), y = (-0.44 + 0.88 * (s + 0.5) / nf), ang = (R() - 0.5) * 0.3, px = Math.cos(ang), py = Math.sin(ang), tt = 0, next = 0;
    const smp = [];
    for (let k = 0; k < 40000 && tt < 40; k++) {
      const ux = F.at(F.u, x, y), uy = F.at(F.v, x, y), sp = Math.hypot(ux, uy); if (sp < 1e-4) break;
      if (tt >= next) { smp.push([x, y, Math.atan2(py, px)]); next += dt; }
      const st = Math.min(0.02, 0.006 / sp);
      const a = F.at(F.gxx, x, y), b = F.at(F.gxy, x, y), cc = F.at(F.gyx, x, y), d = F.at(F.gyy, x, y);
      const Dxy = (b + cc) / 2, Wxy = (b - cc) / 2, Dpx = a * px + Dxy * py, Dpy = Dxy * px + d * py, pDp = px * Dpx + py * Dpy;
      const dpx = Wxy * py + lam * (Dpx - pDp * px), dpy = -Wxy * px + lam * (Dpy - pDp * py);
      px += dpx * st; py += dpy * st; const l = Math.hypot(px, py); px /= l; py /= l;
      const mx = x + ux * st / 2, my = y + uy * st / 2, ux2 = F.at(F.u, mx, my), uy2 = F.at(F.v, mx, my);
      x += ux2 * st; y += uy2 * st; tt += st;
      if (Math.hypot(x, y) > F.Lr - 0.3 && x > -(F.Lr - 0.6)) break;
    }
    const arm = Math.round(((Math.atan2(y, x) + TAU) % TAU) / (Math.PI / 3)) % 6, th = arm * Math.PI / 3, cs = Math.abs(px * Math.cos(th) + py * Math.sin(th));
    smp.push([x, y, Math.atan2(py, px)]);
    out.push({ smp, arm, mis: Math.acos(Math.min(1, cs)) * 180 / Math.PI, c4: cs * cs * cs * cs });
  }
  return out;
}
/** one flow case, solved and traced once: the field, 160 fibres, streamlines from the inlet, and the fibres' alignment
   as they leave (Krenchel's cos⁴ to the rib they leave by), per rib and overall */
function shbFlowCase(r) {
  return shbOnce('flow' + r, () => {
    const F = shbStokes(r), fb = shbFibres(F, { n: 160, dt: 0.04 });
    const g = arms => fb.filter(f => arms.includes(f.arm)), c4 = L => L.length ? L.reduce((s, f) => s + f.c4, 0) / L.length : 0, w30 = L => L.length ? L.filter(f => f.mis <= 30).length / L.length : 0;
    const arm = [0, 1, 2, 3, 4, 5].map(a => c4(g([a])));
    const lines = [];
    for (let q = 0; q < 15; q++) {
      let x = -(F.Lr - 0.3), y = -0.45 + 0.9 * (q + 0.5) / 15; const pts = [[x, y]];
      for (let k = 0; k < 6000; k++) { const ux = F.at(F.u, x, y), uy = F.at(F.v, x, y), sp = Math.hypot(ux, uy); if (sp < 1e-4) break; const st = 0.03 / sp; const mx = x + ux * st / 2, my = y + uy * st / 2; x += F.at(F.u, mx, my) * st; y += F.at(F.v, mx, my) * st; if (k % 3 === 0) pts.push([x, y]); if (Math.hypot(x, y) > F.Lr - 0.15 && x > -(F.Lr - 0.6)) break; }
      lines.push(pts);
    }
    return { F, fb, lines, arm, all: c4(fb), w30: w30(fb), turn: c4(g([2, 4])), turnW: w30(g([2, 4])), straight: c4(g([0])) };
  });
}
/** draw one case in a panel: the steel round the ribs, the melt, its streamlines and its fibres at flow time ft.
   (cx, cy) the node's centre, s px per mm */
function shbFlowDraw(t, FC, cx, cy, s, ft, a, o = {}) {
  if (a <= 0.003) return;
  const F = FC.F, P = p => [cx + p[0] * s, cy - p[1] * s], R = (F.Lr - 0.2) * s, angs = [0, 1, 2, 3, 4, 5].map(k => k * Math.PI / 3);
  G.save(); G.beginPath(); G.arc(cx, cy, R, 0, TAU); G.clip();
  /* the mold steel, hatched */
  G.globalAlpha = a; G.fillStyle = TH ? '#D9D8D2' : '#2A2B2E'; G.fillRect(cx - R, cy - R, R * 2, R * 2);
  G.strokeStyle = TH ? 'rgba(17,17,17,0.10)' : 'rgba(243,242,238,0.07)'; G.lineWidth = 1.5; G.beginPath();
  for (let d = -2 * R; d < 2 * R; d += 14) { G.moveTo(cx + d, cy - R); G.lineTo(cx + d + R * 2, cy + R); } G.stroke();
  /* the melt: the ribs and the node, with the fillet the case has */
  shbFill(shbNodeOutline(angs, F.W, F.Lr + 0.5, F.r), P, TH ? '#FFFFFF' : '#17181B', a);
  /* streamlines */
  FC.lines.forEach(pts => shbPath(pts.map(P), C.mute, 1.2, a * 0.35));
  /* the fibres: rods, ink when they lie along the flow, red as they turn across it */
  const Lc = 16, flen = 0.17;
  FC.fb.forEach((f, i) => {
    const ph = ((i * 0.6180339887) % 1) * Lc, u = ((ft - ph) % Lc + Lc) % Lc, q = Math.floor(u / 0.04); if (ft < ph || q >= f.smp.length) return;
    const [x, y, an] = f.smp[q], ux = F.at(F.u, x, y), uy = F.at(F.v, x, y);
    let d = Math.abs(((an - Math.atan2(uy, ux)) % Math.PI + Math.PI) % Math.PI); d = Math.min(d, Math.PI - d) * 180 / Math.PI;
    const p = P([x, y]), dx = Math.cos(an) * flen * s, dy = -Math.sin(an) * flen * s, fa = a * Math.min(1, (f.smp.length - q) / 8, q / 4 + 0.2);
    G.globalAlpha = fa; G.strokeStyle = mix(TH ? '#3A3A38' : '#D8D7D2', C.bad, clamp((d - 18) / 30)); G.lineWidth = 2.6; G.lineCap = 'round';
    G.beginPath(); G.moveTo(p[0] - dx, p[1] - dy); G.lineTo(p[0] + dx, p[1] + dy); G.stroke();
  });
  G.restore();
  circle(cx, cy, R, { color: C.hair, w: 1.5, alpha: a });
}

/* ============================== 6. fibre alignment: the research (Brock: "bring up specific research on how high the potential strength increases are") ============================== */
S({
  id: 'shbFibres', ch: 'shell', theme: 'night', title: 'Fibre alignment', settle: 10.4, after: 'shbBend',
  ideas: [53, 75], src: ['shbKrenchel', 'shbChoi', 'shbMerseburg', 'shbHexcel', 'shbWang', 'shlPyrofil'],
  draw: t => {
    header(t, 'Fibre alignment');
    captions(t, [[0.6, 'In a carbon-filled plastic the fibres line up with the melt\'s flow. A continuous rib is one long, steady flow, so its fibres lie along it: the way its load runs.'], [4.4, 'Krenchel: a fibre at an angle θ to the load gives cos⁴θ of its stiffness. At 45° that is a quarter; scattered in the plane, 3/8.'], [7.6, 'Measured, it is as real: carbon nylon is 1.7× stronger along its flow than across, and a weld line leaves a third of the strength.']]);
    const x0 = LM, y0 = 280, w0 = 1080, h0 = 640, a0 = tileA(t, 0.3, 0);
    demoWindow(x0, y0, w0, h0, a0);
    /* two ribs, close up: fibres along a continuous rib, and fibres scattered at random */
    const R = rng(11), rows = [['A continuous rib', 'along', y0 + 120], ['Scattered at random', 'random', y0 + 270]];
    rows.forEach(([nm, kind, ry], ri) => {
      const a = ep(t, 0.8 + ri * 0.5, 1.4 + ri * 0.5) * a0, rx0 = x0 + 32, rx1 = x0 + w0 - 200, rh = 64;
      text(nm, rx0, ry - 52, { role: 'label', size: 20, color: C.ink, alpha: a });
      rr(rx0, ry - rh / 2, rx1 - rx0, rh, 6, TH ? '#ECEBE6' : '#1E1F22', null, 0, a);
      G.save(); G.beginPath(); G.rect(rx0, ry - rh / 2, rx1 - rx0, rh); G.clip();
      for (let q = 0; q < 70; q++) {
        const u = R(), v = R(), an = kind === 'along' ? (R() - 0.5) * 0.25 : R() * Math.PI, sp = kind === 'along' ? 60 : 0;
        const fx = rx0 + (((u * (rx1 - rx0) + t * sp) % (rx1 - rx0)) + (rx1 - rx0)) % (rx1 - rx0), fy = ry - rh / 2 + 8 + v * (rh - 16), L = 14;
        G.globalAlpha = a * 0.95; G.strokeStyle = kind === 'along' ? C.hero : C.mute; G.lineWidth = 2.6; G.lineCap = 'round';
        G.beginPath(); G.moveTo(fx - Math.cos(an) * L, fy - Math.sin(an) * L); G.lineTo(fx + Math.cos(an) * L, fy + Math.sin(an) * L); G.stroke();
      }
      G.restore();
      /* the load runs along the rib */
      const kl = ep(t, 2.2 + ri * 0.3, 2.8 + ri * 0.3) * a;
      arrow(rx1 + 18, ry, rx1 + 84, ry, { color: C.ink2, w: 3, hs: 14, alpha: kl });
      rich([{ s: kind === 'along' ? '1' : '3/8', font: 'disp', size: 40, weight: 800, color: kind === 'along' ? C.heroText : C.ink, grad: kind === 'along' ? C.heroGrad : null, tnum: true }], x0 + w0 - 32, ry + 14, { align: 'right', alpha: kl });
    });
    text('Krenchel factor', x0 + w0 - 32, y0 + 56, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ep(t, 2.2, 2.7) * a0 });
    /* the curve: Krenchel's cos⁴θ, and the measured strengths of injection-moulded carbon nylon (Choi 2024) */
    const cx0 = x0 + 110, cx1 = x0 + w0 - 60, cyb = y0 + h0 - 80, cyt = y0 + 380, Xa = th => cx0 + th / 90 * (cx1 - cx0), Ya = v => cyb - v * (cyb - cyt), ka = ep(t, 4.3, 5.8, E.io3), ag = ep(t, 4.0, 4.5) * a0;
    line(cx0, cyb, cx1, cyb, { color: C.hair, w: 1.5, alpha: ag }); line(cx0, cyb, cx0, cyt - 10, { color: C.hair, w: 1.5, alpha: ag });
    for (const th of [0, 30, 45, 60, 90]) text(th + '°', Xa(th), cyb + 32, { role: 'tick', color: C.faint, align: 'center', alpha: ag });
    for (const v of [0, 0.5, 1]) text(String(v), cx0 - 14, Ya(v) + 7, { role: 'tick', color: C.faint, align: 'right', alpha: ag });
    text('Stiffness share, by fibre angle to the load', cx1, cyt - 30, { role: 'label', size: 19, color: C.mute, alpha: ag, align: 'right' });
    for (const [v, nm] of [[3 / 8, 'Random in the plane 3/8'], [1 / 5, 'Random in 3D 1/5']]) { line(cx0, Ya(v), cx1, Ya(v), { color: C.mute, w: 1.5, dash: [5, 6], alpha: ag * 0.8 }); text(nm, cx1, Ya(v) - 10, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ag }); }
    const curve = []; for (let th = 0; th <= 90 * ka + 0.01; th += 1) curve.push([Xa(th), Ya(Math.pow(Math.cos(th * Math.PI / 180), 4))]);
    shbPath(curve, C.ink, 4, ag);
    const kc = ep(t, 7.6, 8.2) * a0;
    [[0, 130.3], [45, 101.3], [90, 77.2]].forEach(([th, sMPa]) => { const p = [Xa(th), Ya(sMPa / 130.3)]; circle(p[0], p[1], 8, { fill: C.panel, color: C.ink, w: 3, alpha: kc }); if (th) text(fmtN(sMPa, 0) + ' MPa', p[0] + (th === 90 ? -16 : 16), p[1] - 14, { role: 'label', size: 19, color: C.ink2, alpha: kc, align: th === 90 ? 'right' : 'left' }); });
    { const p = [Xa(0), Ya(1)]; G.save(); G.globalAlpha = ag; G.fillStyle = C.hero; G.beginPath(); G.moveTo(p[0], p[1] - 11); G.lineTo(p[0] + 11, p[1]); G.lineTo(p[0], p[1] + 11); G.lineTo(p[0] - 11, p[1]); G.closePath(); G.fill(); G.restore(); text('Along a continuous rib', p[0] + 22, p[1] - 14, { role: 'label', size: 19, color: C.heroText, alpha: ag }); }
    text('Line: stiffness, Krenchel. Rings: strength of moulded 20% carbon nylon, along to across.', x0 + 32, y0 + h0 - 28, { role: 'small', size: 22, color: C.faint, alpha: kc, maxW: w0 - 64 });
    /* the research, one number a tile */
    const bx = x0 + w0 + 40, bw = RM - bx, B = bento(bx, y0, bw, 280, 2, 1);
    statTile(t, 7.8, B(0, 0), { value: '1.7', unit: '×', label: 'stronger along the flow', ev: 'measured', by: 'Choi 2024', hero: true });
    statTile(t, 8.2, B(1, 0), { value: '0.35', unit: '×', label: 'strength left at a weld line', ev: 'measured', by: 'Wang 2023', quiet: true });
    /* the strip, holding: the fibres are inside the lattice's number, not a step of their own */
    shbMeter(t, 6.0, 'shbFibres', bx, y0 + 320, bw, { compact: true });
    shbNote(t, 8.6, bx, y0 + 548, bw, 'Moulded glass-filled PP is up to 3× stiffer along than across (Polymer Service); continuous carbon tape, 33× stronger (Hexcel).', { color: C.ink2, size: 24 });
  }
});

/* ============================== 7. melt through a node: the fluid simulation (Brock: "show a fluid simulation of how a filleted lattice helps align fibers") ============================== */
S({
  id: 'shbFlow', ch: 'shell', theme: 'paper', title: 'Fibre orientation through a node', settle: 10.4, after: 'filletsize',
  ideas: [75, 'fillet'], src: ['shbJeffery', 'shbKrenchel', 'shbMoldflow', 'shbModel'],
  draw: t => {
    const S0 = shbFlowCase(0), S6 = shbFlowCase(0.6), gain = S6.turn / S0.turn - 1;
    header(t, 'Fibre orientation through a node');
    captions(t, [[0.6, 'An illustrative 2D model: the melt comes in along one rib and leaves by the other five, carrying its fibres.'], [3.8, 'Fibres that run straight through, along a continuous line, keep their alignment. The ones that turn 120° don\'t.'], [7.2, 'That turn is where the fillet earns its keep: its turning fibres leave ' + Math.round(gain * 100) + '% better aligned than at a sharp corner.']]);
    const ft = Math.max(0, (t - 1.0) * 1.1);
    [[S0, LM, 'Sharp corners', 0], [S6, 980, 'Filleted, {r} 0.6 mm', 1]].forEach(([FC, px, nm, i]) => {
      const py = 280, pw = 860, ph = 560, a = tileA(t, 0.3, i);
      demoWindow(px, py, pw, ph, a);
      text(nm, px + 32, py + 52, { role: 'label', size: 22, color: C.ink, alpha: a });
      const cx = px + 430, cy = py + 280, s = 48;
      shbFlowDraw(t, FC, cx, cy, s, ft, a * ep(t, 0.6, 1.2));
      text('Melt in', cx - 4.0 * s - 6, cy - 46, { role: 'label', size: 19, color: C.mute, alpha: a * ep(t, 1.0, 1.5) });
      arrow(cx - 4.6 * s, cy, cx - 4.0 * s - 8, cy, { color: C.mute, w: 2.5, hs: 12, alpha: a * ep(t, 1.0, 1.5) });
      /* the Krenchel factor of the fibres leaving each rib */
      [0, 1, 2, 4, 5].forEach((arm, j) => {
        const an = arm * Math.PI / 3, rr0 = 4.0 * s + 34, lx = cx + Math.cos(an) * rr0, ly = cy - Math.sin(an) * rr0, ka = ep(t, arm === 0 ? 4.0 : arm === 2 || arm === 4 ? 4.6 : 5.2, (arm === 0 ? 4.0 : arm === 2 || arm === 4 ? 4.6 : 5.2) + 0.5) * a;
        const turn = arm === 2 || arm === 4;
        text(fmtN(FC.arm[arm], 2), lx, ly + 9, { role: 'num', size: 26, weight: 800, color: turn ? (i ? C.heroText : C.bad) : C.ink, align: Math.cos(an) > 0.3 ? 'left' : Math.cos(an) < -0.3 ? 'right' : 'center', alpha: ka });
      });
      const kr = ep(t, 5.6, 6.2) * a;
      rich([{ s: 'Leaving within 30°', role: 'label', size: 19, color: C.mute }, { s: Math.round(FC.w30 * 100) + '%', font: 'disp', size: 34, weight: 800, color: C.ink, tnum: true, gap: 12 }], px + 32, py + ph - 36, { alpha: kr });
      rich([{ s: 'Krenchel, all', role: 'label', size: 19, color: C.mute }, { s: fmtN(FC.all, 2), font: 'disp', size: 34, weight: 800, color: C.ink, tnum: true, gap: 12 }], px + pw - 32, py + ph - 36, { alpha: kr, align: 'right' });
    });
    /* what the fillet buys, where the melt turns */
    const kg = ep(t, 7.4, 8.0);
    text('Turning fibres {(higher is better)}', 980 + 860 - 32, 280 + 40, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: kg });
    shellHL(t, 7.4, 980 + 860 - 32, 280 + 120, '+' + Math.round(gain * 100), '%', { size: 80, count: false, align: 'right' });
    shellBA(t, 980 + 860 - 32, 280 + 170, { before: fmtN(S0.turn, 2), after: fmtN(S6.turn, 2), size: 34, k: ep(t, 7.6, 8.4, E.io3), a: kg, align: 'right' });
    /* the strip, holding: the fibres are inside the shell's numbers, not a step of their own */
    shbMeter(t, 3.0, 'shbFlow', LM, 872, RM - LM, { row: true });
    const am = ep(t, 1.6, 2.1), pw0 = pillW('measured', { by: 'Jeffery 1922' });
    text('Illustrative 2D melt flow on a 14-per-mm grid, through three 1.0 mm ribs, 40% of the melt straight on; rigid fibres turned by Jeffery\'s equation.', LM, 970, { role: 'small', size: 22, color: C.faint, alpha: am, maxW: RM - LM - pw0 - 48 });
    pill(RM - pw0, 970, 'measured', am, { by: 'Jeffery 1922' });
  }
});

/* ---------- where the melt enters: the fill from the gate over the Theseus top (Brock, F13.3: "decide where you think is optimal") ----------
   The melt runs through the wall from the gate as one sheet, and the front reaches each point by the shortest path over
   the surface: Dijkstra on a 1.5 mm grid of the dome (SHB_LAT's surface), each step its 3D length. That is tile 1's own
   rule (a front that fills what it reaches first) laid over the whole top. One gate on a shell with no holes leaves no
   weld line: the front never meets itself. Two gates leave one where their fronts meet. The fibres lie along the front's
   direction of travel (Moldflow's shearing flow), so each rib keeps Krenchel's cos⁴ of its angle to the flow: sampled
   along the arches through the crown (the ones a press on the crown loads first) and along every rib. Illustrative: a
   sheet flow, no rib leading the melt, no freezing. Computed once. */
const SHB_GATES = [
  { k: 'crown', name: ['One gate,', 'under the crown'], g: [[0, -14]], hero: true },
  { k: 'rear', name: ['One gate,', 'at the rear'], g: [[0, -56.5]] },
  { k: 'two', name: ['Two gates,', 'front and rear'], g: [[0, 55.5], [0, -56.5]] }
];
function shbGateFill(gates) {
  const h = 1.5, x0 = -33, z0 = -61, nx = Math.round(66 / h) + 1, nz = Math.round(122 / h) + 1, N = nx * nz;
  const X = i => x0 + i * h, Z = j => z0 + j * h, inside = new Uint8Array(N), Yh = new Float64Array(N);
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) { const W = shbHalfW(Z(j)); if (W > 1.2 && Math.abs(X(i)) <= W - 0.6) { inside[j * nx + i] = 1; Yh[j * nx + i] = shbDomeY(X(i), Z(j)); } }
  const T = new Float64Array(N).fill(Infinity), lab = new Int8Array(N).fill(-1), heap = [];
  const push = (d, id) => { heap.push([d, id]); let c = heap.length - 1; while (c > 0) { const p = (c - 1) >> 1; if (heap[p][0] <= heap[c][0]) break; [heap[p], heap[c]] = [heap[c], heap[p]]; c = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let c = 0; for (;;) { const l = 2 * c + 1, r = l + 1; let m = c; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === c) break; [heap[m], heap[c]] = [heap[c], heap[m]]; c = m; } } return top; };
  gates.forEach((g, k) => { const i = Math.round((g[0] - x0) / h), j = Math.round((g[1] - z0) / h), id = j * nx + i; if (!inside[id]) return; T[id] = 0; lab[id] = k; push(0, id); });
  const nb = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1], [2, 1], [1, 2], [-2, 1], [-1, 2], [2, -1], [1, -2], [-2, -1], [-1, -2]];
  while (heap.length) {
    const [d, id] = pop(); if (d > T[id]) continue; const i = id % nx, j = (id - i) / nx;
    for (const [di, dj] of nb) { const a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= nx || b >= nz) continue; const q = b * nx + a; if (!inside[q]) continue;
      const L = Math.hypot(di * h, dj * h, Yh[q] - Yh[id]), nd = d + L; if (nd < T[q] - 1e-9) { T[q] = nd; lab[q] = lab[id]; push(nd, q); } }
  }
  let longest = 0; for (let q = 0; q < N; q++) if (inside[q] && T[q] < Infinity) longest = Math.max(longest, T[q]);
  /* the weld line: where two fronts from different gates meet, as cells beside a cell of the other gate */
  const weld = [];
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx - 1; i++) { const q = j * nx + i; if (inside[q] && inside[q + 1] && lab[q] >= 0 && lab[q + 1] >= 0 && lab[q] !== lab[q + 1]) weld.push([X(i) + h / 2, Z(j)]); }
  for (let j = 0; j < nz - 1; j++) for (let i = 0; i < nx; i++) { const q = j * nx + i, r = q + nx; if (inside[q] && inside[r] && lab[q] >= 0 && lab[r] >= 0 && lab[q] !== lab[r]) weld.push([X(i), Z(j) + h / 2]); }
  /* the direction the front travels at a point (plan, from the arrival time), and a rib's alignment there */
  const Tat = (x, z) => { const fi = (x - x0) / h, fj = (z - z0) / h, i = Math.floor(fi), j = Math.floor(fj); if (i < 0 || j < 0 || i >= nx - 1 || j >= nz - 1) return NaN; const u = fi - i, v = fj - j, q = j * nx + i, c = [T[q], T[q + 1], T[q + nx], T[q + nx + 1]]; if (c.some(e => !isFinite(e))) return NaN; return (c[0] * (1 - u) + c[1] * u) * (1 - v) + (c[2] * (1 - u) + c[3] * u) * v; };
  const lift = (x, z, u) => { const e = 0.6, gy = (shbDomeY(x + u[0] * e, z + u[1] * e) - shbDomeY(x - u[0] * e, z - u[1] * e)) / (2 * e), l = Math.hypot(u[0], gy, u[1]); return [u[0] / l, gy / l, u[1] / l]; };
  const align = (x, z, d) => {
    const e = 0.9, gx = (Tat(x + e, z) - Tat(x - e, z)) / (2 * e), gz = (Tat(x, z + e) - Tat(x, z - e)) / (2 * e), gl = Math.hypot(gx, gz); if (!isFinite(gl) || gl < 1e-6) return null;
    const a = lift(x, z, [d[0], d[1]]), b = lift(x, z, [gx / gl, gz / gl]), c = Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]); return c * c * c * c;
  };
  return { h, x0, z0, nx, nz, X, Z, inside, T, lab, longest, weld, align };
}
function shbGateCase(c) {
  return shbOnce('gate:' + c.k, () => {
    const F = shbGateFill(c.g), L = SHB_LAT, dirs = [[1, 0], [0.5, Math.sqrt(3) / 2], [-0.5, Math.sqrt(3) / 2]], near = (x, z) => c.g.some(g => Math.hypot(x - g[0], z - g[1]) < 4);
    /* along the three arches through the crown node, 1 mm steps, inside the top */
    let sc = 0, nc = 0, w30 = 0;
    dirs.forEach(d => { for (let s = -70; s <= 70; s += 1) { const x = d[0] * s, z = L.z0 + d[1] * s, W = shbHalfW(z); if (W <= 3 || Math.abs(x) > W - 2 || near(x, z)) continue; const k = F.align(x, z, d); if (k == null) continue; sc += k; nc++; if (k >= Math.pow(Math.cos(Math.PI / 6), 4)) w30++; } });
    /* along every rib of the lattice (each line's top, in plan) */
    let sa = 0, na = 0;
    L.lines.forEach(ln => { const d = dirs[ln.fam]; for (let q = 6; q < ln.pts.length - 6; q += 2) { const p = ln.pts[q]; if (near(p[0], p[2])) continue; const k = F.align(p[0], p[2], d); if (k == null) continue; sa += k; na++; } });
    const crown = [0, L.z0]; let wd = Infinity; F.weld.forEach(p => { wd = Math.min(wd, Math.hypot(p[0] - crown[0], p[1] - crown[1])); });
    return { F, crownK: nc ? sc / nc : 0, crownW30: nc ? w30 / nc : 0, allK: na ? sa / na : 0, welds: F.weld.length ? 1 : 0, weldToCrown: wd };
  });
}
/** one case as a plan view from above (front up): the fill, banded by when it arrived (every 10 mm of flow), the front
   while it runs, the ribs faint over it, the gates and any weld line. (cx, cy) the plan's centre, s px per mm, flow = how
   far the front has run (mm) */
function shbGatePlan(t, R, c, cx, cy, s, flow, a) {
  if (a <= 0.003) return;
  const F = R.F, P = (x, z) => [cx + x * s, cy - z * s], cw = F.h * s + 0.6, steel = TH ? '#E2E1DB' : '#25262A';
  const mA = c.hero ? (TH ? mix('#FFFFFF', C.hero, 0.22) : mix('#4A4C52', C.hero, 0.45)) : (TH ? '#FFFFFF' : '#4A4C52'), mB = c.hero ? (TH ? mix('#FFFFFF', C.hero, 0.36) : mix('#4A4C52', C.hero, 0.62)) : (TH ? '#ECEBE6' : '#5A5C63');
  G.save(); G.globalAlpha = a;
  for (let j = 0; j < F.nz; j++) for (let i = 0; i < F.nx; i++) {
    const q = j * F.nx + i; if (!F.inside[q]) continue; const T = F.T[q], p = P(F.X(i), F.Z(j));
    G.fillStyle = T > flow ? steel : T > flow - 3 ? C.ink2 : (Math.floor(T / 10) % 2 ? mB : mA); G.fillRect(p[0] - cw / 2, p[1] - cw / 2, cw, cw);
  }
  G.restore();
  /* the ribs, faint: each arch's top in plan */
  G.save(); G.globalAlpha = a * 0.32; G.strokeStyle = TH ? '#111111' : '#F3F2EE'; G.lineWidth = 1;
  SHB_LAT.lines.forEach(ln => { G.beginPath(); ln.pts.forEach((p3, q) => { const p = P(p3[0], p3[2]); q ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1]); }); G.stroke(); });
  G.restore();
  /* the outline */
  const ol = []; for (let z = 59.4; z >= -59.5; z -= 1.5) ol.push(P(shbHalfW(z), z)); for (let z = -59.5; z <= 59.4; z += 1.5) ol.push(P(-shbHalfW(z), z));
  G.save(); G.globalAlpha = a; G.strokeStyle = C.ink2; G.lineWidth = 1.5; G.beginPath(); ol.forEach((p, q) => q ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.closePath(); G.stroke(); G.restore();
  /* the weld line, once the fronts have met */
  const kw = clamp((flow - R.F.longest * 0.9) / (R.F.longest * 0.1));
  if (F.weld.length && kw > 0) { G.save(); G.globalAlpha = a * kw; G.fillStyle = C.bad; F.weld.forEach(w => { const p = P(w[0], w[1]); G.beginPath(); G.arc(p[0], p[1], 2.6, 0, TAU); G.fill(); }); G.restore(); }
  /* the gates */
  c.g.forEach(g => { const p = P(g[0], g[1]); circle(p[0], p[1], 9, { fill: c.hero ? C.hero : C.ink, alpha: a }); circle(p[0], p[1], 15, { color: c.hero ? C.hero : C.ink, w: 2, alpha: a * 0.6 }); });
}
S({
  id: 'shbGates', ch: 'shell', theme: 'night', title: 'Gating: one gate, under the crown', settle: 10, after: 'shbFlow',
  ideas: [75, 53], src: ['shbWang', 'shbMoldflow', 'shbKrenchel', 'shbModel'],
  draw: t => {
    const Rs = SHB_GATES.map(shbGateCase), [Rc, Rr, R2] = Rs;
    header(t, 'Gating: one gate, under the crown');
    captions(t, [[0.6, 'Where the melt enters sets where its fronts meet and which way its fibres lie. I tested three gates with the fill.'], [4.6, 'Two gates meet in a weld line ' + fmtN(R2.weldToCrown, 0) + ' mm from the crown, where the press peaks. From the rear, the melt crosses the arches sideways.'], [7.4, 'One gate, inside under the crown: no weld line, and the melt runs down the arches from the top, the way a press loads them.']]);
    const x = LM, y = 280, w = 1160, h = 640, a0 = tileA(t, 0.3, 0);
    demoWindow(x, y, w, h, a0);
    text('The fill from three gates, from above {(front up)}', x + 32, y + 52, { role: 'label', size: 21, color: C.mute, alpha: a0 });
    pill(x + w - 32 - pillW('derived'), y + 52, 'derived', a0);
    /* the three plans, the melt at one speed in all three: the rear gate takes longest */
    const flow = Math.max(0, t - 1.3) * 30, cxs = [x + 450, x + 700, x + 950], cy = y + 268, s = 2.45;
    SHB_GATES.forEach((c, i) => {
      const a = ep(t, 0.7 + i * 0.15, 1.2 + i * 0.15) * a0;
      c.name.forEach((l, q) => text(l, cxs[i], y + 90 + q * 22, { role: q ? 'small' : 'label', size: q ? 21 : 19, weight: 650, color: c.hero ? C.heroText : C.ink2, align: 'center', alpha: a }));
      shbGatePlan(t, Rs[i], c, cxs[i], cy, s, flow, a);
    });
    /* the table: three rows, a value under each plan */
    const rows = [
      ['Weld lines', '(fewer is better)', R => R.welds ? String(R.welds) : '0', R => R.welds > 0],
      ['Longest flow', '(shorter is better)', R => fmtN(R.F.longest, 0) + ' mm', R => R.F.longest > Rc.F.longest * 1.3],
      ['Along the crown\'s arches', '(Krenchel, higher is better)', R => fmtN(R.crownK, 2), R => R.crownK < 0.6]];
    rows.forEach(([lab, note, val, bad], j) => {
      const ry = y + 462 + j * 54, a = ep(t, 5.0 + j * 0.3, 5.4 + j * 0.3) * a0;
      text(lab, x + 32, ry, { role: 'label', size: 19, color: C.ink2, alpha: a });
      text(note, x + 32, ry + 22, { role: 'small', size: 21, weight: 600, color: C.faint, alpha: a, sentence: false });
      Rs.forEach((R, i) => { const c = SHB_GATES[i]; text(val(R), cxs[i], ry + 10, { role: 'num', size: 26, weight: 800, color: c.hero ? C.heroText : bad(R) ? C.bad : C.ink, align: 'center', alpha: a }); });
    });
    text('Every rib, on average: ' + Rs.map(R => fmtN(R.allK, 2)).join(', ') + ': three families at 60° average 3/8 in any one flow direction.', x + 32, y + h - 16, { role: 'small', size: 21, weight: 560, color: C.faint, maxW: w - 64, alpha: ep(t, 6.0, 6.4) * a0 });
    /* right: the choice, at a glance, and its reason; the weld line's cost; the strip, holding */
    const rx = x + w + 40, rw = RM - rx;
    shellHL(t, 6.6, rx, y + 110, '0', 'weld lines', { size: 120, count: false });
    text('One gate, inside under the crown. The melt runs down every arch from the top; its longest flow is ' + fmtN(Rc.F.longest, 0) + ' mm, against ' + fmtN(Rr.F.longest, 0) + ' mm from the rear.', rx, y + 168, { role: 'small', size: 24, weight: 600, color: C.ink2, maxW: rw, lh: 1.3, alpha: ep(t, 7.0, 7.4) });
    glossBox(t, 3.6, rx, y + 260, rw, 'Weld line', 'Where two melt fronts meet head-on. Its fibres lie across it: carbon nylon keeps 32 to 38% of its strength there.', { size: 24 });
    shbMeter(t, 7.6, 'shbGates', rx, y + 476, rw, { compact: true });
    text('Sheet fill over the Theseus top: the front by the shortest path over the surface, a 1.5 mm grid; fibres along the flow, cos⁴ to each rib.', LM, 962, { role: 'small', size: 22, color: C.faint, alpha: ep(t, 1.8, 2.3), maxW: RM - LM });
  }
});

/* ============================== 8b. one rib width, a fillet at every node: the rest of what the lattice does for its fibres (F2.18) ============================== */
S({
  id: 'shbWidth', ch: 'shell', theme: 'paper', title: 'One rib width, a fillet at every node', settle: 9.4, after: 'shbGates',
  ideas: [75, 53], src: ['shbMoldflow', 'shbModel'],
  draw: t => {
    const gain = shbFlowCase(0.6).turn / shbFlowCase(0).turn - 1;
    header(t, 'One rib width, a fillet at every node');
    captions(t, [[0.6, 'Two more things in the lattice\'s own design keep its fibres in line, and neither adds any weight.'], [3.6, 'Keep every rib one width, so the flow never slows and fans out.'], [6.4, 'And fillet every node: the melt that turns, turns round a curve, not a knife edge.']]);
    const B = bento(LM, 280, RM - LM, 640, 2, 1), R = rng(5);
    const rod = (x, y, an, L, col, a) => { G.globalAlpha = a; G.strokeStyle = col; G.lineWidth = 2.6; G.lineCap = 'round'; G.beginPath(); G.moveTo(x - Math.cos(an) * L, y - Math.sin(an) * L); G.lineTo(x + Math.cos(an) * L, y + Math.sin(an) * L); G.stroke(); };
    const fibreCol = an => mix(TH ? '#3A3A38' : '#D8D7D2', C.bad, clamp((Math.abs(Math.sin(an)) - 0.3) / 0.5));
    const melt = TH ? '#FFFFFF' : '#4A4C52', steel = TH ? '#E2E1DB' : '#25262A';
    void R;
    /* 1. keep the width steady: a rib that widens turns its fibres across (long fibres follow the melt like a drawn line) */
    { const [x, y, w, h] = B(0, 0), a = tileA(t, 0.3, 0); demoWindow(x, y, w, h, a);
      text('1  One rib width', x + 32, y + 52, { role: 'label', size: 21, color: C.ink, alpha: a });
      /* the one-width rib is Theseus's, so it is named in its blue (review item 23); Moldflow's finding is qualitative, so
         this panel carries no number of its own */
      [['A rib that widens', y + 190, true], ['One width: every Theseus rib', y + 360, false]].forEach(([nm, ry, wide], ri) => {
        const x0 = x + 32, x1 = x + w - 32, w1 = 40, wid = u => wide ? w1 * (1 + 1.6 * Math.exp(-Math.pow((u - 0.5) / 0.17, 2))) : w1, ka = a * ep(t, 1.4 + ri * 0.3, 1.9 + ri * 0.3);
        text(nm, x0, ry - (wide ? 80 : 40), { role: 'small', size: 22, weight: wide ? 600 : 700, color: wide ? C.mute : C.heroText, alpha: ka });
        rr(x0, ry - (wide ? 52 : 24), x1 - x0, wide ? 104 : 48, 6, steel, null, 0, ka);
        G.save(); G.globalAlpha = ka; G.fillStyle = melt; G.beginPath();
        for (let q = 0; q <= 60; q++) { const u = q / 60; G.lineTo(lerp(x0, x1, u), ry - wid(u) / 2); } for (let q = 60; q >= 0; q--) { const u = q / 60; G.lineTo(lerp(x0, x1, u), ry + wid(u) / 2); } G.closePath(); G.fill(); G.restore();
        /* fibres carried along; tan of their angle grows with the width squared where the rib widens */
        for (let q = 0; q < 34; q++) {
          const u0 = (q * 0.618034) % 1, v = ((q * 0.4142) % 1) - 0.5, u = (u0 + Math.max(0, t - 1.6) * 0.05) % 1;
          const fx = lerp(x0, x1, u), fw = wid(u), fy = ry + v * (fw - 12), an0 = (((q * 0.7548) % 1) - 0.5) * 0.18, an = Math.atan(Math.tan(an0) * Math.pow(fw / w1, 2) + (wide ? 0.06 * Math.sign(v + 0.001) * Math.pow(fw / w1 - 1, 2) : 0));
          rod(fx, fy, an, 9, fibreCol(an), ka);
        }
      });
      shbNote(t, 3.8, x + 32, y + 470, w - 64, 'Where a rib widens, the melt slows and spreads and its fibres turn across it. Ribs of one width keep the flow steady and the fibres along.', { color: C.ink2 });
      pill(x + 32, y + h - 32, 'datasheet', ep(t, 4.0, 4.5) * a, { text: 'Autodesk Moldflow' });
    }
    /* 2. fillet every node: the melt that turns, turns round a fillet */
    { const [x, y, w, h] = B(1, 0), a = tileA(t, 0.3, 1); demoWindow(x, y, w, h, a);
      text('2  A fillet at every node', x + 32, y + 52, { role: 'label', size: 21, color: C.ink, alpha: a });
      const cx = x + w / 2, cy = y + 250, s = 48, P = p => [cx + p[0] * s, cy - p[1] * s], kf = ep(t, 6.4, 7.4, E.io3), angs = [0, 1, 2, 3, 4, 5].map(k => k * Math.PI / 3);
      G.save(); G.beginPath(); G.arc(cx, cy, 3.4 * s, 0, TAU); G.clip();
      G.globalAlpha = a; G.fillStyle = steel; G.fillRect(cx - 3.4 * s, cy - 3.4 * s, 6.8 * s, 6.8 * s);
      shbFill(shbNodeOutline(angs, 1.0, 4.2, 0.6 * kf), P, melt, a);
      const turn = [], c0 = [-3.4, 0.22], c1 = [lerp(0.2, -0.45, kf), lerp(0.22, 0.5, kf)], c2 = [-1.75, 3.0];
      for (let q = 0; q <= 40; q++) { const f = q / 40, g = 1 - f; turn.push(P([g * g * c0[0] + 2 * g * f * c1[0] + f * f * c2[0], g * g * c0[1] + 2 * g * f * c1[1] + f * f * c2[1]])); }
      shbPath(turn, C.heroText, 3, a * ep(t, 6.6, 7.2), { dash: [10, 8], dashOff: -t * 30 });
      G.restore();
      circle(cx, cy, 3.4 * s, { color: C.hair, w: 1.5, alpha: a });
      const kg = ep(t, 7.2, 7.8) * a;
      shellBA(t, x + 32, y + 532, { label: 'Turning fibres, Krenchel {(higher is better)}', before: fmtN(shbFlowCase(0).turn, 2), after: fmtN(shbFlowCase(0.6).turn, 2), size: 64, k: ep(t, 7.2, 8.0, E.io3), a: kg, net: '+' + Math.round(gain * 100) + '% round a fillet, not a knife edge', netRight: true, netSize: 24, netW: w - 340 });
      pill(x + 32, y + h - 32, 'derived', kg, { text: 'The node flow model, two slides back' });
    }
  }
});

/* ============================== 9. fillets make the mold easier to cut (Brock: "the filets making milling the mold easier"; F13.2: the method is not decided) ==============================
   How the core is made is not decided: burned by EDM, or milled straight into the steel. The fillet pays either way, so
   the two get a slide each. Here the EDM case: the electrode that burns the ribs in is the lattice's positive; its
   pockets are 2 mm deep and their corners at the nodes are inside corners. A round cutter can't make a sharp inside
   corner (Protolabs) or reach deeper than about 4× its diameter (Core77). Sharp: the cutter leaves slivers it can't reach.
   Filleted at the cutter's radius: the cutter makes the fillet as it passes. Numbers: rib 2.0 mm tall, fillet 0.6 mm
   (Shell A's choice) */
S({
  id: 'shbMill', ch: 'shell', theme: 'night', title: 'Fillets make the mold easier to cut', settle: 10.4, after: 'shbWidth',
  ideas: [75, 'fillet'], src: ['shbProtoCorner', 'shbCore77', 'shbAutodeskEdm', 'shbCte'],
  draw: t => {
    const depth = 2.0, rf = 0.6, dMin = depth / 4, rGuide = depth / 3;
    header(t, 'Fillets make the mold easier to cut');
    captions(t, [[0.6, 'How the mold is made isn\'t decided yet: burned by EDM, or milled straight into the steel. The fillet pays either way.'], [3.8, 'For EDM, the electrode is the lattice milled as a positive. A round cutter can\'t cut its sharp inside corners: six slivers at every node.'], [7.0, 'Filleted at 0.6 mm, a 1.2 mm cutter makes every fillet in the same pass it cuts the ribs with.']]);
    const angs = [0, 1, 2, 3, 4, 5].map(k => k * Math.PI / 3 + Math.PI / 6), rc = 0.6, metal = TH ? '#B9BCC2' : '#5E636B', floor = TH ? '#F1F0EB' : '#1B1C1F';
    [[0, LM, 'EDM electrode, sharp nodes'], [rf, 640, 'Electrode, filleted {r} 0.6 mm']].forEach(([r, px, nm], i) => {
      const py = 280, pw = 520, ph = 640, a = tileA(t, 0.3, i); demoWindow(px, py, pw, ph, a);
      text(nm, px + 32, py + 52, { role: 'label', size: 21, color: r ? C.heroText : C.ink, alpha: a });
      const cx = px + pw / 2, cy = py + 260, s = 66, P = p => [cx + p[0] * s, cy - p[1] * s], Rv = 2.6 * s;
      G.save(); G.beginPath(); G.arc(cx, cy, Rv, 0, TAU); G.clip();
      G.globalAlpha = a; G.fillStyle = floor; G.fillRect(cx - Rv, cy - Rv, 2 * Rv, 2 * Rv);
      /* each corner's sliver shows as the cutter leaves it: the cuttable shape, clipped to that corner's slice */
      const cutK = k => ep(t, 1.6 + k * 0.75 + 0.42, 1.6 + k * 0.75 + 0.72);
      if (r < rc) for (let q = 0; q < 6; q++) { const kq = cutK(q); if (kq <= 0.003) continue; G.save(); G.beginPath(); G.moveTo(cx, cy); G.arc(cx, cy, Rv, -angs[(q + 1) % 6], -angs[q]); G.closePath(); G.clip(); shbFill(shbNodeOutline(angs, 1.0, 4, rc), P, C.bad, a * 0.85 * kq); G.restore(); }
      shbFill(shbNodeOutline(angs, 1.0, 4, r), P, metal, a);
      /* the cutter, visiting the six corners in turn */
      const tc = (t - 1.6) / 0.75, k = Math.floor(tc), f = tc - k;
      if (tc >= 0 && k < 6) {
        const A0 = angs[k], B0 = angs[(k + 1) % 6], half = Math.PI / 6, hw = 0.5, bis = A0 + half, dO = hw / Math.sin(half) + rc / Math.sin(half);
        const ua = [Math.cos(A0), Math.sin(A0)], na = [-Math.sin(A0), Math.cos(A0)], ub = [Math.cos(B0), Math.sin(B0)], nb = [-Math.sin(B0), Math.cos(B0)];
        const pA = [ua[0] * 2.0 + na[0] * (hw + rc), ua[1] * 2.0 + na[1] * (hw + rc)], O = [Math.cos(bis) * dO, Math.sin(bis) * dO], pB = [ub[0] * 2.0 - nb[0] * (hw + rc), ub[1] * 2.0 - nb[1] * (hw + rc)];
        const g = f, q = g < 0.5 ? [lerp(pA[0], O[0], g * 2), lerp(pA[1], O[1], g * 2)] : [lerp(O[0], pB[0], g * 2 - 1), lerp(O[1], pB[1], g * 2 - 1)], c = P(q);
        circle(c[0], c[1], rc * s, { fill: rgba(C.ink, 0.10), color: C.ink, w: 2.5, alpha: a });
        for (let j = 0; j < 4; j++) { const an = t * 9 + j * Math.PI / 2; line(c[0], c[1], c[0] + Math.cos(an) * rc * s * 0.8, c[1] + Math.sin(an) * rc * s * 0.8, { color: C.ink, w: 1.5, alpha: a * 0.6 }); }
      }
      G.restore();
      circle(cx, cy, Rv, { color: C.hair, w: 1.5, alpha: a });
      /* what it takes */
      const kr = ep(t, 6.6, 7.2) * a, yb = py + ph - 150;
      if (r < rc) {
        rich([{ s: 'Cutter radius it needs', role: 'label', size: 19, color: C.mute }, { s: '0', font: 'disp', size: 34, weight: 800, color: C.bad, gap: 12 }, { s: 'mm', role: 'label', size: 19, color: C.mute, caps: false, gap: 6 }], px + 32, yb, { alpha: kr });
        shbNote(t, 6.8, px + 32, yb + 40, pw - 64, 'Even Ø' + fmtN(dMin, 1) + ' mm, the finest that reaches 2 mm deep, leaves {r} ' + fmtN(dMin / 2, 2) + ' mm: a second burn.', { color: C.ink2, alpha: a });
      } else {
        rich([{ s: 'Cutter', role: 'label', size: 19, color: C.mute }, { s: 'Ø' + fmtN(2 * rc, 1), font: 'disp', size: 34, weight: 800, color: C.heroText, grad: C.heroGrad, gap: 12 }, { s: 'mm', role: 'label', size: 19, color: C.mute, caps: false, gap: 6 }], px + 32, yb, { alpha: kr });
        shbNote(t, 6.8, px + 32, yb + 40, pw - 64, '2 mm deep is ' + fmtN(depth / (2 * rc), 1) + ' diameters: a standard cutter, one pass, every corner.', { color: C.ink2, alpha: a });
      }
    });
    /* the column: how much, at a glance; the toolmaker's numbers and where they come from */
    const x2 = 1200, w2 = RM - x2;
    shellBA(t, x2, 280 + 150, { label: 'EDM burns for the ribs {(fewer is better)}', before: '2', after: '1', size: 120, k: ep(t, 7.2, 8.0, E.io3), a: ep(t, 7.0, 7.4), net: 'One electrode, cut by one standard Ø1.2 mm cutter' });
    const Bc = bento(x2, 520, w2, 240, 2, 1);
    statTile(t, 7.4, Bc(0, 0), { value: fmtN(rGuide, 2), unit: 'mm', label: 'toolmaker\'s corner, 2 mm deep', ev: 'measured', by: 'Core77', quiet: true });
    statTile(t, 7.6, Bc(1, 0), { value: '0.6', unit: 'mm', label: 'the fillet the stress asks for', hero: true });
    sourceBox(t, 2.2, x2, 800, w2, 'Protolabs', '"The internal corners in any mold cavity cannot be smaller than the radius of the endmill used to machine them."', { size: 24 });
  }
});

/* ============================== 9b. or milled straight into the steel: no knife edges (F13.2) ==============================
   The core milled direct is the part's negative: the ribs are grooves, and between them the steel stands in islands.
   At a sharp node each island ends in a 60° point: six knife edges of steel round every node, which chip, wear and won't
   take a polish. Filleting the part rounds every island's tip to the fillet's radius. The cutter fits the 1.0 mm groove:
   2 mm deep is 2 diameters of a Ø1.0 mm cutter, inside Core77's 4. */
S({
  id: 'shbMillDirect', ch: 'shell', theme: 'paper', title: 'A milled core: no knife edges of steel', settle: 9.6, after: 'shbMill',
  ideas: [75, 'fillet'], src: ['shbCore77', 'shbProtoCorner'],
  draw: t => {
    const rf = 0.6, hw = 0.5, half = Math.PI / 6, dQ = hw / Math.sin(half), dO = dQ + rf / Math.sin(half);
    header(t, 'A milled core: no knife edges of steel');
    captions(t, [[0.6, 'Milled straight into the steel, the core is the part\'s negative: the ribs are grooves, the steel stands between them.'], [3.6, 'At a sharp node every island of steel ends in a 60° point: six knife edges round every node. They chip, wear and won\'t polish.'], [6.6, 'The same 0.6 mm fillet rounds each of them, so the core holds its shape for the life of the tool.']]);
    const angs = [0, 1, 2, 3, 4, 5].map(k => k * Math.PI / 3 + Math.PI / 6), metal = TH ? '#B9BCC2' : '#5E636B', groove = TH ? '#3A3B40' : '#141518';
    [[0, 760, 'Core, sharp nodes'], [rf, 1320, 'Core, filleted {r} 0.6 mm']].forEach(([r, px, nm], i) => {
      const py = 280, pw = 520, ph = 640, a = tileA(t, 0.3, i); demoWindow(px, py, pw, ph, a);
      text(nm, px + 32, py + 52, { role: 'label', size: 21, color: r ? C.heroText : C.ink, alpha: a });
      const cx = px + pw / 2, cy = py + 270, s = 66, P = p => [cx + p[0] * s, cy - p[1] * s], Rv = 2.6 * s;
      G.save(); G.beginPath(); G.arc(cx, cy, Rv, 0, TAU); G.clip();
      G.globalAlpha = a; G.fillStyle = metal; G.fillRect(cx - Rv, cy - Rv, 2 * Rv, 2 * Rv);
      /* the grooves the cutter has cut: the part's ribs, as a negative */
      const kc = ep(t, 1.2, 3.0, E.io3);
      G.save(); G.beginPath(); G.arc(cx, cy, Rv * Math.max(0.02, kc), 0, TAU); G.clip(); shbFill(shbNodeOutline(angs, 1.0, 4, r), P, groove, a); G.restore();
      /* the cutter, Ø1.0 mm, running out along one groove after another */
      const tc = (t - 1.2) / 0.3, k = Math.floor(tc) % 6, f = tc - Math.floor(tc);
      if (t > 1.2 && t < 3.0) { const an = angs[k] - half, d = lerp(0, 3.8, f), c = P([Math.cos(an) * d, Math.sin(an) * d]); circle(c[0], c[1], 0.5 * s, { fill: rgba(C.ink, 0.12), color: C.ink, w: 2.2, alpha: a }); }
      G.restore();
      circle(cx, cy, Rv, { color: C.hair, w: 1.5, alpha: a });
      /* the island tips: knife edges at a sharp node, rounds at a filleted one */
      const kt = ep(t, 3.6, 4.2) * a;
      angs.forEach(an0 => { const bis = an0 + half;
        if (!r) { const tip = P([Math.cos(bis) * dQ, Math.sin(bis) * dQ]), back = P([Math.cos(bis) * (dQ + 0.55), Math.sin(bis) * (dQ + 0.55)]); line(tip[0], tip[1], back[0], back[1], { color: C.bad, w: 5, alpha: kt }); circle(tip[0], tip[1], 5, { fill: C.bad, alpha: kt }); }
        else { const o = P([Math.cos(bis) * dO, Math.sin(bis) * dO]); G.save(); G.globalAlpha = kt; G.strokeStyle = C.hero; G.lineWidth = 4; G.beginPath(); G.arc(o[0], o[1], rf * s, -bis + Math.PI - 0.95, -bis + Math.PI + 0.95); G.stroke(); G.restore(); }
      });
      const kr = ep(t, 4.4, 5.0) * a, yb = py + ph - 120;
      rich([{ s: 'Knife edges of steel', role: 'label', size: 19, color: C.mute }, { s: r ? '0' : '6', font: 'disp', size: 40, weight: 800, color: r ? C.heroText : C.bad, grad: r ? C.heroGrad : null, gap: 14 }, { s: 'per node', role: 'label', size: 19, color: C.mute, caps: false, gap: 8 }], px + 32, yb, { alpha: kr });
      shbNote(t, 4.6, px + 32, yb + 40, pw - 64, r ? 'Each island ends in a 0.6 mm round that holds its edge and polishes.' : 'Each island ends in a 60° point of steel: it chips, wears and won\'t polish.', { color: C.ink2, alpha: a });
    });
    /* the column: how much, at a glance, and the cutter's reach */
    const x2 = LM, w2 = 640;
    shellBA(t, x2, 280 + 150, { label: 'Knife edges per node {(fewer is better)}', before: '6', after: '0', size: 120, k: ep(t, 6.6, 7.4, E.io3), a: ep(t, 6.4, 6.8), bad: C.bad, net: 'The same 0.6 mm fillet as the EDM electrode' });
    sourceBox(t, 2.0, x2, 520, w2, 'Core77', 'Keep a pocket within 4× the cutter\'s diameter; a cutter\'s deflection grows with the cube of its stick-out. A Ø1.0 mm cutter in the 1.0 mm groove reaches 2 mm deep at 2 diameters.', { size: 24 });
    shbNote(t, 7.6, x2, 806, w2, 'So whichever way the core is made, EDM or milled, the fillet makes it easier and longer-lived.', { color: C.ink2, size: 24 });
  }
});

/* ============================== 10. a fillet loosens the tightest tolerance (Brock: "reduce the tightest tolerance") ==============================
   Shell A's fillet study (09-fillet-data.js, plane-stress FE at equal mass): the node's peak over the panel's average
   against the corner radius. Near sharp, the curve is steep, so the as-made radius (tool wear, polish) sets the peak;
   at 0.6 mm it is flat. The tolerance on the radius that holds the peak within ±5% follows from the slope. */
S({
  id: 'shbTol', ch: 'shell', theme: 'night', title: 'A fillet loosens the tightest tolerance', settle: 10.4, after: 'shbMillDirect',
  ideas: [75, 'fillet'], src: ['filletFE', 'shbModel'],
  draw: t => {
    const rs = FILLET.rs, sc = FILLET.scfM, at = r => shbLerpTab(rs.map((v, i) => [v, sc[i]]), r);
    const s0 = (sc[0] - sc[1]) / (rs[1] - rs[0]), tol0 = 0.05 * sc[0] / s0, s6 = (at(0.48) - at(0.75)) / (0.75 - 0.48), tol6 = 0.05 * at(0.6) / s6, ratio = tol6 / tol0;
    header(t, 'A fillet loosens the tightest tolerance');
    captions(t, [[0.6, 'At a sharp node the peak hangs on whatever radius the tool happens to leave. A few hundredths of a millimetre move it a lot.'], [4.6, 'At 0.6 mm the curve is flat. Tool wear and polish barely move the peak.'], [7.6, 'To hold the peak within 5%, a sharp corner needs its radius to ±' + Math.round(tol0 * 1000) + ' µm. The fillet takes ±' + fmtN(tol6, 2) + ' mm: ' + Math.round(ratio) + '× looser.']]);
    const x0 = LM, y0 = 280, w0 = 1120, h0 = 640, a0 = tileA(t, 0.3, 0); demoWindow(x0, y0, w0, h0, a0);
    const gx0 = x0 + 110, gx1 = x0 + w0 - 60, gy0 = y0 + 120, gy1 = y0 + h0 - 110, X = r => gx0 + r / 1.2 * (gx1 - gx0), Y = v => gy1 - (v - 6) / 12 * (gy1 - gy0), ag = ep(t, 0.6, 1.1) * a0;
    line(gx0, gy1, gx1, gy1, { color: C.hair, w: 1.5, alpha: ag }); line(gx0, gy1, gx0, gy0 - 10, { color: C.hair, w: 1.5, alpha: ag });
    for (const r of [0, 0.3, 0.6, 0.9, 1.2]) text(fmtN(r, 1) + (r === 1.2 ? ' mm' : ''), X(r), gy1 + 32, { role: 'tick', color: C.faint, align: r === 1.2 ? 'right' : 'center', alpha: ag });
    for (const v of [8, 12, 16]) text(v + '×', gx0 - 14, Y(v) + 7, { role: 'tick', color: C.faint, align: 'right', alpha: ag });
    text('Node peak over the average stress, by corner radius, same weight {(lower is better)}', gx0 - 14, gy0 - 34, { role: 'label', size: 19, color: C.mute, alpha: ag });
    const kc = ep(t, 1.0, 2.6, E.io3), pts = []; for (let q = 0; q <= 60; q++) { const r = lerp(rs[0], rs[rs.length - 1], q / 60); if (r > lerp(rs[0], rs[rs.length - 1], kc)) break; pts.push([X(r), Y(at(r))]); }
    shbPath(pts, C.ink2, 3.5, ag);
    rs.forEach((r, i) => { if (r <= lerp(rs[0], rs[rs.length - 1], kc)) circle(X(r), Y(sc[i]), 4.5, { fill: C.ink2, alpha: ag }); });
    /* two as-made windows the pointer swings through: near sharp, and at the fillet */
    const win = [[rs[0], rs[1], 1.6, 4.4, 'Near sharp'], [0.48, 0.75, 4.8, 7.4, 'At 0.6 mm']];
    let ptr = null;
    win.forEach(([r0, r1, t0, t1, nm], i) => {
      const a = ep(t, t0, t0 + 0.4) * a0, k = t < t0 ? 0 : t > t1 ? 0.5 : 0.5 - 0.5 * Math.cos((t - t0) / (t1 - t0) * TAU * 1.5), r = lerp(r0, r1, k), v = at(r), lo = Math.min(at(r0), at(r1)), hi = Math.max(at(r0), at(r1));
      if (a <= 0.003) return;
      G.save(); G.globalAlpha = a * 0.18; G.fillStyle = i ? C.hero : C.bad; G.fillRect(X(r0), gy0 - 10, X(r1) - X(r0), gy1 - gy0 + 10); G.fillRect(gx0, Y(hi), X(r1) - gx0, Y(lo) - Y(hi)); G.restore();
      line(gx0, Y(hi), X(r1), Y(hi), { color: i ? C.heroText : C.bad, w: 1.5, dash: [4, 4], alpha: a }); line(gx0, Y(lo), X(r1), Y(lo), { color: i ? C.heroText : C.bad, w: 1.5, dash: [4, 4], alpha: a });
      circle(X(r), Y(v), 9, { fill: i ? C.hero : C.bad, alpha: a });
      if (t >= t0 && t <= t1 + 0.3) ptr = [X(r) + 4, Y(v) + 6];
      const lx = i ? gx1 : X(r1) + 28, ly = i ? Y(hi) - 44 : Y(hi) + 8;
      text(nm + ': ' + fmtN(r1 - r0, 2) + ' mm moves the peak ' + Math.round((hi - lo) / lo * 100) + '%', lx, ly, { role: 'label', size: 19, color: i ? C.heroText : C.bad, alpha: a, align: i ? 'right' : 'left' });
    });
    if (ptr) cursorPtr(ptr[0], ptr[1], { a: a0, grab: true });
    text('Shell A\'s fillet study: plane-stress FE of the triangle lattice, 1.2 mm struts, at equal mass.', x0 + 32, y0 + h0 - 30, { role: 'small', size: 22, color: C.faint, alpha: ag });
    /* the column: the tolerance each needs */
    const x2 = x0 + w0 + 40, w2 = RM - x2, Bc = bento(x2, y0, w2, 280, 2, 1);
    statTile(t, 7.8, [x2, y0, w2, 280], { value: fmtN(ratio, 0), unit: '×', label: 'looser: ±' + fmtN(tol6, 2) + ' mm filleted, ±' + Math.round(tol0 * 1000) + ' µm sharp', ev: 'derived', hero: true, align: 'left' });
    void Bc;
    glossBox(t, 2.4, x2, y0 + 320, w2, 'Tolerance', 'How far a size may stray from the drawing. The tightest one in a tool sets how slowly, and how dearly, it has to be cut.');
    shbNote(t, 8.4, x2, y0 + 560, w2, 'The same 0.6 mm fillet that halves the node\'s peak, lines up its fibres and lets a standard cutter reach.', { color: C.ink2 });
  }
});
/* ---------- the real section across the hump: curvature, and the 2D frame under the grip ----------
   SHB_SEC resampled into 72 elements along its arc, rim to rim; a 10 mm strip, 1.6 mm deep (the wall and its lattice
   smeared into one depth), PP-C-20A, pinned at both rims. Grip: 10 N inward on each low side, 12 mm up (thumb and
   fingers). The band: extra depth on the low sides (2 to 20 mm up), the same grams as 10% of the strip. */
function shbSecPts(n) {
  const P = SHB_SEC, d = [0]; for (let i = 1; i < P.length; i++) d.push(d[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  const L = d[d.length - 1], out = []; let j = 0;
  for (let k = 0; k <= n; k++) { const s = L * k / n; while (j < d.length - 2 && d[j + 1] < s) j++; const f = (s - d[j]) / (d[j + 1] - d[j]); out.push([P[j][0] + (P[j + 1][0] - P[j][0]) * f, P[j][1] + (P[j + 1][1] - P[j][1]) * f]); }
  return { pts: out, L };
}
const SHB_SN = 72, SHB_H0 = 1.6;
const shbSm = (e0, e1, x) => { const k = clamp((x - e0) / (e1 - e0)); return k * k * (3 - 2 * k); };
/** the low-side band's weight at an element's middle: 1 on the low sides (2 to 20 mm up), 0 above; side: +1 the thumb's (x > 0), −1 the fingers', 0 both */
function shbBandW(m, side = 0) { const [x, y] = m; if (side && Math.sign(x) !== side) return 0; return shbSm(1.5, 3.5, y) * (1 - shbSm(18, 22, y)); }
function shbSecModel(load, band) {
  const S = shbSecPts(SHB_SN), mat = SIM_MAT.ppcf, nodes = S.pts.map(p => p.slice()), els = [];
  const mids = []; let Lb = 0, Lt = 0;
  for (let i = 0; i < SHB_SN; i++) { const a = nodes[i], b = nodes[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; mids.push([m, L]); Lt += L; Lb += L * (band ? shbBandW(m, band.side) : 0); }
  /* extra depth in the band that adds band.add of the strip's grams (or the same grams spread evenly: band.even) */
  const dh = band ? (band.even ? SHB_H0 * band.add : SHB_H0 * band.add * Lt / Lb) : 0;
  mids.forEach(([m], i) => els.push({ i, j: i + 1, w: 10, h: SHB_H0 + (band ? (band.even ? dh : dh * shbBandW(m, band.side)) : 0), E: mat.E, rho: mat.rho }));
  const near = (x, y) => { let b = 0, bd = 1e9; nodes.forEach((p, i) => { const d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; b = i; } }); return b; };
  const L = {}, add = (i, f) => { L[i] = L[i] ? L[i].map((v, q) => v + f[q]) : f; };
  if (load === 'grip' || load === 'thumb') add(near(31, 12), [-10, 0, 0]);
  if (load === 'grip') add(near(-31, 12), [10, 0, 0]);
  if (load === 'crown') add(near(0, 40), [0, -10, 0]);
  return { nodes, els, fix: { 0: 'xy', [SHB_SN]: 'xy' }, loads: L, near };
}
const shbSec = (load, band, key) => simSolve('shbSec:' + load + ':' + (key || 'base'), () => shbSecModel(load, band));
/** the flex under a load: the largest move of a loaded node */
const shbSecFlex = r => Math.max(...Object.keys(r.model.loads).map(Number).map(i => Math.hypot(r.d[i * 3], r.d[i * 3 + 1])));
/** the curvature along the section (1/mm) at each inner node: the turn between neighbouring elements over their mean length */
function shbSecKappa() {
  return shbOnce('secK', () => { const P = shbSecPts(SHB_SN).pts, k = [0]; for (let i = 1; i < SHB_SN; i++) { const a = P[i - 1], p = P[i], c = P[i + 1]; let dt = Math.atan2(c[1] - p[1], c[0] - p[0]) - Math.atan2(p[1] - a[1], p[0] - a[0]); while (dt > Math.PI) dt -= TAU; while (dt < -Math.PI) dt += TAU; k.push(Math.abs(dt) / (0.5 * (Math.hypot(p[0] - a[0], p[1] - a[1]) + Math.hypot(c[0] - p[0], c[1] - p[1])))); } k.push(0); return k; });
}

/* ============================== 11. the flat low sides and the thumb rest (Brock: "the left and right sides ... near the bottom being flatter and less arched") ============================== */
S({
  id: 'shbSides', ch: 'shell', theme: 'paper', title: 'Flat low sides need a thicker lattice', settle: 10.4, after: 'shbTol',
  ideas: [53, 75], src: ['shbModel', 'shlLattice'],
  draw: t => {
    const RB = shbSec('grip'), RX = shbSec('grip', { add: 0.1, side: 0 }, 'band'), RE = shbSec('grip', { add: 0.1, even: true }, 'even');
    const RT = shbSec('thumb'), RTX = shbSec('thumb', { add: 0.1, side: 1 }, 'bandT'), RTE = shbSec('thumb', { add: 0.1, even: true }, 'evenT');
    const f0 = shbSecFlex(RB), cutB = 1 - shbSecFlex(RX) / f0, cutE = 1 - shbSecFlex(RE) / f0, perG = cutB / cutE, pkG = (1 - RX.smax / RB.smax) / (1 - RE.smax / RB.smax);
    /* the thumb alone, with the band on both low sides (Brock, F13.4: "Both sides"; the thumb rest is on the left) */
    const RT0 = shbSec('thumb', { add: 0.1, side: 0 }, 'bandT0'), thG = (1 - shbSecFlex(RT0) / shbSecFlex(RT)) / (1 - shbSecFlex(RTE) / shbSecFlex(RT));
    void RTX;
    /* the section's own numbers: the hump arch above the widest line, and the low side's bulge over its chord */
    const top = SHB_SEC.filter(p => p[1] >= 11.6), span = Math.max(...top.map(p => p[0])) - Math.min(...top.map(p => p[0])), rise = Math.max(...SHB_SEC.map(p => p[1])) - 11.6;
    const low = SHB_SEC.filter(p => p[0] > 0 && p[1] >= 3.8 && p[1] <= 19.6), c0 = low[0], c1 = low[low.length - 1], cl = Math.hypot(c1[0] - c0[0], c1[1] - c0[1]);
    const bulge = Math.max(...low.map(p => Math.abs((c1[0] - c0[0]) * (c0[1] - p[1]) - (c0[0] - p[0]) * (c1[1] - c0[1])) / cl));
    header(t, 'Flat low sides need a thicker lattice');
    captions(t, [[0.6, 'Cut the shell across its hump. Above the widest line it is an arch: ' + fmtN(rise, 1) + ' mm of rise over ' + fmtN(span, 1) + ' mm.'], [3.4, 'Below it the sides drop almost straight to the rim. That is where the thumb and fingers squeeze, and there is no arch there to help.'], [6.8, 'So the lattice runs thicker along both low sides, with the thumb rest on the left. For the weight it adds, that cuts the grip\'s flex ' + fmtN(perG, 1) + '× more than spreading it evenly.']]);
    const x0 = LM, y0 = 280, w0 = 1080, h0 = 640, a0 = tileA(t, 0.3, 0); demoWindow(x0, y0, w0, h0, a0);
    /* seen from behind, as the hand sees it: the thumb's side (+x) on the left */
    const s = 11, cx = x0 + 540, by = y0 + 540, P = p => [cx - p[0] * s, by - p[1] * s];
    const kL = ep(t, 4.4, 5.6, E.io3), kB = ep(t, 6.9, 8.4, E.io3), aS = ep(t, 0.7, 1.4) * a0, smax = RB.smax;
    /* the plain strip on the heat scale, red at its peak; the banded section, Theseus's, in its own colour */
    if (kB < 1) feDraw(RB, P, { scale: 14, load: kL, smax, w: s, alpha: aS * (1 - kB), seg: 6, heat: kL > 0.01, color: C.ink2 });
    if (kB > 0) feDraw(RX, P, { scale: 14, load: kL, smax, w: s, alpha: aS * kB, seg: 6, heat: false, color: C.hero });
    for (const xs of [-1, 1]) feSupport(P([xs * 25.5, 0.6]), 'pin', { alpha: aS });
    /* the arch and the flat low sides, named */
    const ka = ep(t, 1.6, 2.4) * a0, kl = ep(t, 3.4, 4.0) * a0;
    shbPath(shbPart(top.slice().sort((p, q) => q[0] - p[0]).map(p => { const q = P(p); return [q[0], q[1] - 22]; }), ep(t, 1.4, 2.6)), C.hero, 3, ka, { dash: [8, 7] });
    if (ka > 0.003) callout(t, 2.2, P([-8, 37.6 + 2]), 'An arch: ' + fmtN(rise, 1) + ' mm over ' + fmtN(span, 1) + ' mm', { to: [cx + 220, y0 + 70], side: 'r', color: C.heroText, tcolor: C.ink, prose: true, maxW: 270 });
    for (const xs of [1, -1]) { const lowS = SHB_SEC.filter(p => Math.sign(p[0]) === xs && p[1] >= 3.8 && p[1] <= 19.6).map(p => { const q = P(p); return [q[0] - xs * 22, q[1]]; }); shbPath(lowS, C.bad, 3, kl, { dash: [6, 6] }); }
    if (kl > 0.003) text('Nearly straight: ' + fmtN(bulge, 1) + ' mm of bulge over ' + fmtN(cl, 0) + ' mm', x0 + 32, y0 + 56, { role: 'label', size: 20, color: C.bad, alpha: kl });
    /* the grip */
    const kg = ep(t, 4.2, 4.8) * a0;
    for (const [xs, nm] of [[1, 'Thumb'], [-1, 'Fingers']]) { const p = P([xs * 31.5, 12]); arrow(p[0] - xs * 96, p[1], p[0] - xs * 30, p[1], { color: C.ink2, w: 3, hs: 14, alpha: kg }); text(nm, p[0] - xs * 104, p[1] - 22, { role: 'label', size: 20, color: C.ink, align: xs > 0 ? 'right' : 'left', alpha: kg }); }
    /* the peak, before and after */
    const kp = ep(t, 5.4, 5.9) * a0, pkNow = lerp(RB.smax, RX.smax, kB) * kL;
    shellBA(t, x0 + 32, y0 + 150, { label: SHELL_PEAK_LAB, before: fmtN(RB.smax * kL, 1), after: fmtN(pkNow, 1), unit: 'MPa', size: 40, k: kB, a: kp, bad: C.ink });
    text(kB > 0.5 ? 'Band: +10% weight, both low sides' : 'A plain strip, 1.6 mm', x0 + w0 - 32, y0 + h0 - 30, { role: 'small', size: 22, color: C.mute, align: 'right', alpha: kp });
    text('2D frame of the real section (sliced from the Theseus shell, z = −14 mm), a 10 mm strip, PP-C-20A, 10 N each side. Flex drawn 14× real.', x0 + 32, y0 + h0 - 86, { role: 'small', size: 22, color: C.faint, alpha: aS, maxW: 620 });
    /* the column: what the band buys per gram, and where it goes */
    const x2 = x0 + w0 + 40, w2 = RM - x2, Bc = bento(x2, y0, w2, 280, 2, 1);
    statTile(t, 8.4, Bc(0, 0), { value: fmtN(perG, 1), unit: '×', label: 'the flex cut, for the weight, both low sides vs even', ev: 'derived', hero: true });
    statTile(t, 8.6, Bc(1, 0), { value: fmtN(pkG, 1), unit: '×', label: 'the peak cut, for the weight', ev: 'derived', quiet: true });
    const ty2 = y0 + 320, th2 = h0 - 320, ak = tileA(t, 7.0, 0); demoWindow(x2, ty2, w2, th2, ak);
    keyPlan(t, 7.2, x2 + 150, ty2 + th2 / 2, { s: 2.0, hi: 'sides', accent: C.hero, label: ' ' });
    part(x2 + 150, ty2 + th2 / 2, 2.36, () => { G.save(); keyPath(); G.clip(); G.globalAlpha = ak * ep(t, 7.8, 8.4) * 0.8; G.fillStyle = C.hero; G.fillRect(-40, -12, 15, 40); G.fillRect(25, -12, 15, 40); G.restore(); });
    text('From above', x2 + 300, ty2 + 66, { role: 'label', size: 20, color: C.ink, alpha: ak });
    shbNote(t, 7.6, x2 + 300, ty2 + 108, w2 - 332, 'The band runs down both low sides, the thumb rest on the left: for the weight, ' + fmtN(thG, 1) + '× the thumb\'s flex cut of an even layer.', { alpha: ak, color: C.ink2 });
  }
});
