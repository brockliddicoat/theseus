/* ============================== shell, part B: arches, fibres, fillets and the mold, the flat sides ==============================
   Builder B's slides in the shell chapter (code shb). The chapter reads lattice → arches → fibres → fillets and the mold
   → flat sides:
     shbArches    interwoven arches form triangles (replaces the old 'arches')      after shlLattice3d
     shbDome      geodesic domes: great circles make the triangles (Fuller, HI-SEAS)
     shbPress     arch action against a flat plate: the force simulation
     shbThrust    the thrust line: why a curve carries a press in compression
     shbPerGram   thin curved shells are strong per gram
     shbFibres    fibre alignment: continuous ribs keep the fibres along the load
     shbFlow      fibres through a lattice node: the fluid simulation, sharp against filleted     after filletsize
     shbGates     gate the melt along the arches
     shbMill      fillets make the mold easier to cut
     shbTol       a fillet loosens the tightest tolerance
     shbSides     flatter sides need a thicker lattice (Newtonian shape analysis of the real section)
   Every model number is DERIVED and the slide names its model in a line. Theseus is C.hero (blue), the next best C.second,
   a problem C.bad; stress heat is heatCol. No colour is written as hex here. */

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
  shbModel: { t: 'This deck, part B models: 2D frames (07-sim.js, Euler-Bernoulli beams, PP-C-20A 13.5 GPa, a 10 mm strip); a Stokes flow through a lattice node (stream function and vorticity, 14 cells per mm) with rigid fibres turned by Jeffery\'s equation; the Theseus hump section sliced from 3d/shell/shell-theseus.glb', n: 'derived, this model' }
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
  rich([{ s: 'Fig. ' + n, role: 'label', size: 20, color: C.faint }, { s, role: 'small', size: 25, weight: 500, color: C.mute, sentence: true, gap: 14 }], x, y, { alpha: a, align: o.align });
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
  return text(s, x, y, { role: 'small', size: o.size || 25, weight: o.weight || 500, color: o.color || C.mute, alpha: ep(t, t0, t0 + 0.5) * (o.alpha == null ? 1 : o.alpha), maxW: w, lh: 1.32, t: o.type ? t : undefined, t0: o.type ? t0 : undefined, cps: 130, align: o.align });
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
S({
  id: 'shbArches', ch: 'shell', theme: 'paper', title: 'Interwoven arches form triangles', settle: 11, replaces: 'arches', after: 'shlLattice3d',
  ideas: [53, 75], src: ['shlDoc', 'shlLattice', 'shbModel'],
  draw: t => {
    header(t, 'Interwoven arches form triangles');
    captions(t, [[0.6, 'My lattice isn\'t triangles bent into arches. It is continuous arches, rim to rim, that cross each other.'], [3.4, 'A second family of arches crosses the first at 60°. Then a third.'], [6.2, 'Where three arches cross, the crossings close into triangles. The triangles come out of the arches.'], [8.8, 'Every node is three continuous ribs passing through each other: no rib starts or stops there.']]);
    const L = SHB_LAT, tx = LM, ty = LAY.top + 8, tw0 = 1160, th0 = 680;
    demoWindow(tx, ty, tw0, th0, tileA(t, 0.25, 0));
    /* the camera: a slow drift, then a push in on the crossing at the crown */
    const kz = ep(t, 8.6, 10.6, E.cam), drift = 0.05 * Math.sin(t * 0.22);
    const nodeW = L.node, cam = shbCam({ yaw: -0.62 + drift + 0.1 * kz, pitch: lerp(0.62, 0.78, kz), s: lerp(7.6, 19, kz), cx: tx + tw0 * 0.5, cy: ty + th0 * lerp(0.56, 0.52, kz), T: [lerp(0, nodeW[0], kz), lerp(14, nodeW[1], kz), lerp(-2, nodeW[2], kz)] });
    const vis = n => n[0] * cam.view[0] + n[1] * cam.view[1] + n[2] * cam.view[2];
    clipped(tx + 2, ty + 2, tw0 - 4, th0 - 4, () => {
      const nodeP = cam(nodeW);
      glowField(t, nodeP[0], nodeP[1], 420 + 160 * kz, { a: ep(t, 0.6, 2.0) * 0.9 });
      /* the shell's outline: rim and widest line, quiet */
      const ka = ep(t, 0.5, 1.6);
      shbPath(L.wide.map(cam), C.faint, 1.5, ka * 0.55);
      shbPath(L.rim.map(cam), C.faint, 1.5, ka * 0.35, { dash: [5, 7] });
      /* the triangles, filled as the third family closes them */
      L.tris.forEach((T, i) => {
        const k = ep(t, 6.3 + i * 0.012, 6.9 + i * 0.012); if (k <= 0.003) return;
        const v = vis(T.n); if (v < 0.05) return;
        const P = T.ring.map(cam); G.save(); G.globalAlpha = k * clamp(v * 2.2) * 0.16; G.fillStyle = C.hero; G.beginPath(); P.forEach((p, q) => q ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.closePath(); G.fill(); G.restore();
      });
      /* the arches: three families, each drawn rim to rim, the central ones first */
      const fam0 = [1.0, 3.4, 5.6];
      L.lines.forEach(ln => {
        const order = Math.abs(ln.k), t0 = fam0[ln.fam] + order * 0.16, k = ep(t, t0, t0 + 1.1, E.io3); if (k <= 0.003) return;
        const col = C.heroGrad[ln.fam], P = ln.pts.map(cam), w = lerp(2.6, 4.2, kz);
        /* split into visible and hidden runs by the surface normal (the side drops count as visible on the near side) */
        const part = shbPart(P, k), nTop = ln.n.length, off = (ln.pts.length - nTop) / 2;
        let run = [], runVis = null;
        const flush = () => { if (run.length > 1) shbPath(run, col, runVis ? w : w * 0.6, runVis ? 0.95 : 0.16); };
        part.forEach((p, q) => {
          const ti = Math.min(nTop - 1, Math.max(0, q - off)), v = q < off || q >= off + nTop ? (p[0] > 0 ? 1 : 1) * (ln.pts[Math.min(q, ln.pts.length - 1)][0] * cam.view[0] > 0 ? 1 : -1) : vis(ln.n[ti]);
          const on = v > 0.02; if (runVis === null) runVis = on;
          if (on !== runVis) { run.push(p); flush(); run = [p]; runVis = on; } else run.push(p);
        });
        flush();
        /* a light runs along a fresh arch as it is drawn */
        if (k < 1) { const tip = part[part.length - 1]; if (tip) glow(tip[0], tip[1], 16, col, 0.5 * (1 - k)); }
      });
      /* the crossing at the crown: three continuous lines, six ribs */
      const kn = ep(t, 9.4, 10.2);
      if (kn > 0.003) {
        circle(nodeP[0], nodeP[1], 12 + 30 * (1 - kn), { color: C.hero, w: 2, alpha: kn * 0.85 });
        circle(nodeP[0], nodeP[1], 6, { fill: C.hero, alpha: kn });
      }
    });
    if (ep(t, 9.6, 10.2) > 0.003) {
      const nodeP = cam(nodeW), lx = Math.min(tx + tw0 - 360, nodeP[0] + 60), ly = nodeP[1] - 70;
      callout(t, 9.6, [nodeP[0] + 6, nodeP[1] - 4], 'Three arches cross: six ribs, one node', { to: [lx + 10, ly], side: 'r', prose: true, color: C.hero, tcolor: C.ink, maxW: 300 });
    }
    shbFig(t, 1.2, tx + 32, ty + th0 - 30, '01', 'The Theseus top, from the front left: three families of arches, 12.5 mm apart');
    /* the column: three steps, then what the word means */
    const cx = tx + tw0 + 48, cw = RM - cx;
    let yy = ty + 16;
    yy += shbStep(t, 1.0, cx, yy, cw, 1, 'One family of arches', 'Continuous ribs, rim to rim, over the dome.', { swatch: C.heroGrad[0] }) + 30;
    yy += shbStep(t, 3.4, cx, yy, cw, 2, 'A second, at 60°', 'It crosses the first family at every rib.', { swatch: C.heroGrad[1] }) + 30;
    yy += shbStep(t, 5.6, cx, yy, cw, 3, 'A third, at 120°', 'Where all three cross, triangles close.', { swatch: C.heroGrad[2] }) + 40;
    glossBox(t, 7.2, cx, Math.max(yy, ty + 430), cw, 'Interwoven arches', 'Continuous arches that cross one another. A triangle is three arches crossing; no strut begins or ends at a node.');
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
    captions(t, [[0.6, 'NASA ran five long Mars simulations in HI-SEAS, on a Hawaiian volcano. The habitat is a geodesic dome.'], [3.2, 'Fuller didn\'t start from triangles. He ran great circles round a sphere and let them cross, three ways.'], [6.8, 'Same in my shell: continuous arches over the dome, and the triangles where they cross.']]);
    const D = SHB_GEO, tx = LM, ty = LAY.top + 8, tw0 = 1080, th0 = 680;
    demoWindow(tx, ty, tw0, th0, tileA(t, 0.25, 0));
    const cx = tx + tw0 / 2, gy = ty + th0 - 150, R = 330 * lerp(0.92, 1.0, ep(t, 0.3, 9, E.cam)), yaw = 0.35 + t * 0.07, pitch = 0.2;
    const cy0 = Math.cos(yaw), sy0 = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const P = p => { const x1 = p[0] * cy0 + p[2] * sy0, z1 = -p[0] * sy0 + p[2] * cy0; return [cx + R * x1, gy - R * (p[1] * cp - z1 * sp), p[1] * sp + z1 * cp]; };
    clipped(tx + 2, ty + 2, tw0 - 4, th0 - 4, () => {
      glowField(t, cx, gy - R * 0.45, 520, { a: ep(t, 0.5, 2.2) * 0.8, cols: [acc(), C.heroGrad[1], acc()] });
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
        G.globalAlpha = k * (front ? 0.55 : 0.14); G.strokeStyle = C.ink2; G.lineWidth = front ? 1.8 : 1.2;
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
        if (k < 1 && pts.length) { const tip = pts[pts.length - 1]; glow(tip[0], tip[1], 14, acc(), 0.6 * (1 - k)); }
      });
    });
    shbFig(t, 1.0, tx + 32, ty + th0 - 30, '02', 'A geodesic dome, drawn: struts chained into lines that run straight through each node');
    /* the column: the dome NASA used, and Fuller's own words */
    const x2 = tx + tw0 + 48, w2 = RM - x2, B = bento(x2, ty, w2, 300, 2, 1, 24);
    statTile(t, 1.2, B(0, 0), { value: '11', unit: 'm', label: 'HI-SEAS dome, across', ev: 'datasheet', by: 'NASA, Wikipedia' });
    statTile(t, 1.4, B(1, 0), { value: '7', unit: 'lb', label: 'carried per ounce of dome', ev: 'claim', by: 'Fuller 1954' });
    sourceBox(t, 3.4, x2, ty + 324, w2, 'Fuller, US 2,682,235', 'A frame "in a geodesic pattern of approximate great circle arcs intersecting to form a three-way grid". The grid gives "substantially uniform stressing of all members".', { kind: 'claim', label: 'Patent', value: 'Fuller, 1954' });
  }
});
