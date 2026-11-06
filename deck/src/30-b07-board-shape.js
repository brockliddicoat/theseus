/* ============================== b07: Shell III and Shape: the board, the build, the hand ==============================
   Revamp v2 (2026-11-06), builder b07. Eleven slides in two chapters:
     shell  b07_board      The board you already carry           (replaces shlPcbRib, shcCarry, shlStructs)
            b07_arms       Small arms snap, the whole board holds (replaces shcArms)
            b07_tolerance  Tolerance stack-up                     (replaces tolerance)
            b07_poron      Poron pads, not grease                 (replaces grind)
            b07_sheet      The rest of the shell                  (replaces shlsheet2)
     shape  b07_shcard     A shape measured on hands              (replaces shapecard)
            b07_newton     Newtonian shape analysis               (replaces shp_newton)
            b07_sides      Flat low sides, held the same on both  (replaces shbSides)
            b07_size       Sized against real hands               (replaces size)
            b07_emg        EMG on every shape revision            (replaces emg)
            b07_balance    Balance at the centre                  (replaces mass)
   Every top-level name starts with b07_ (or B07). Models are solved in the page with 07-sim.js (feSolve) and every number
   they print is derived; each slide names its model in a line. Data that come from the 3D assets were read off them with
   the scripts in /home/claude/work/b07/scripts (the shell's centroids and sections from 3d/shell/shell-theseus-1seam.glb,
   the board outline from 3d/pcb/plans/outline_v5.json, plan 5). */

Object.assign(SRC, {
  b07Fr4Wiki: { t: 'Wikipedia, "FR-4": "a NEMA grade designation for glass-reinforced epoxy laminate material"; "a composite material composed of woven fiberglass cloth with an epoxy resin binder that is flame resistant"; defined in NEMA LI 1-1998; 1.850 g/cm³, flexural strength > 415 MPa lengthwise, Young\'s modulus 24 GPa lengthwise', u: 'https://en.wikipedia.org/wiki/FR-4' },
  b07Sabre: { t: 'Tom\'s Hardware, Corsair Sabre v2 Pro Wireless CF review: "The top shell and primary buttons are made of carbon fiber", the sides too; 55 g, $199.99; the plastic Sabre v2 Pro costs roughly half as much, the magnesium version $150', u: 'https://www.tomshardware.com/peripherals/gaming-mice/corsair-sabre-v2-pro-wireless-cf-review' },
  b07Harpe: { t: 'PC Gamer, ROG Harpe Ace Extreme: "A carbon fibre composite shell has helped the Harpe shed some of its weight, down from 54 grams" to 47 g; Asus on "crafting them from individual pieces of carbon fibre"', u: 'https://www.pcgamer.com/hardware/gaming-mice/this-new-carbon-fiber-rog-gaming-mouse-is-absurd-and-awesome-in-equal-measure' },
  b07GwPhoto: { t: 'Brock Liddicoat, photos of a G-Wolves board in its lattice shell and of the lattice part with its arm (2026-11-05, re-sent 2026-11-06; refs/photos/brock-2026-11-06): narrow FR4 tabs on both long edges of the board reach under the shell\'s rim, square at the root, some with a locating hole near the tip; the board\'s rear is a frame round the battery with round lightening holes; the arms on his HTS Ultra broke in shipping', u: '', n: 'his photos and account (F6.3, F28.3); drawn, never shown' },
  b07Scholz: { t: 'F. Scholz, "Tolerance Stack Analysis Methods: A Critical Review", Boeing Information & Support Services, Nov 1995: worst case T = Σ|aᵢ|Tᵢ, "a straight sum of the Tᵢ\'s, whence the name arithmetic tolerance stacking", every assembly fits "with mathematical certainty"; statistical T = √(Σ aᵢ²Tᵢ²), "the well known RSS-formula", assuming random, independent ("the most essential corner stone"), normal, centred parts with Tᵢ = 3σᵢ: "only .27% of all assemblies will fail"', u: 'https://faculty.washington.edu/fscholz/DATAFILES498B2008/TOLSTACK.pdf' },
  b07Shraim: { t: 'Shraim and Littell, "Tolerance Stack-up Analysis in Manufacturing-Based Capstone Projects", ASEE 2019: students find the "% contribution of variation by each component" (Tᵢ² over the sum of every Tⱼ²)', u: 'https://peer.asee.org/33444.pdf' },
  b07Protolabs: { t: 'Protolabs, "Understanding injection molding tolerances" (2023): "Our machining tolerance of +/- 0.003 in. (0.076mm) refers to the tolerance built into the mold tool used"; resin tolerance "can be greater than but no less than +/- 0.002 in./in."', u: 'https://www.protolabs.com/resources/blog/injection-molding-tolerances/' },
  b07Omron: { t: 'Omron D2F datasheet, pin-plunger models D2F-F: operating position 5.5 ± 0.3 mm, pretravel 0.5 mm max, movement differential 0.12 mm max', u: 'https://html.alldatasheet.com/html-pdf/901843/OMRON/D2F-L2-D3/626/4/D2F-L2-D3.html' },
  b07Jlc: { t: 'JLCPCB PCB capabilities: board thickness tolerance ±10 % for 1.0 mm and thicker, ±0.1 mm under 1.0 mm', u: 'https://jlcpcb.com/capabilities/pcb-capabilities' },
  b07Delft: { t: 'TU Delft and NVON, ShowingPhysics, demo 17.5 "Stick-slip motion" (I. Frederik, eds. F. Pols and P. Dekkers): a tray pulled across the floor by a spring "will jump ahead, stand still, jump ahead"; "Kinetic friction is smaller than the static friction"; the same jerking makes chalk screech, brakes squeal and a violin bow sing', u: 'https://interactivetextbooks.tudelft.nl/showthephysics/demos/demo14/demo14.html' },
  b07RogersGap: { t: 'Rogers Corporation, gap filling applications: PORON foams "fill gaps caused by variations in manufacturing tolerances", with low compression set and "a very consistent level of force across a range of compressions"', u: 'https://www.rogerscorp.com/applications/gap-filling' },
  b07Creak: { t: 'Owners report creaking shells: Razer Insider threads "Razer Viper Ultimate - The entire mouse is very creaky on multiple spots" and "Razer DeathAdder V2 Pro creaking issue"; RTINGS: "The Finalmouse flexes and creaks with pressure"', u: 'https://insider.razer.com/razer-support-45/razer-viper-ultimate-the-entire-mouse-is-very-creaky-on-multiple-spots-43313' },
  b07Josh: { t: 'Comment thread on Brock\'s doc: Josh (Deconcentrated): "If you put a very, very thin layer of poron foam right on the strongest contact points ... it would add maybe half a gram of weight and act as a force break much better than a lubricant would"; Brock: "lube ... just makes them less noticeable by quieting the scraping. a small poron pads would ... mechanically solve the issue"', u: '', n: 'research/brock-doc-comments.txt' },
  b07McCloskey: { t: 'M. McCloskey, A. Caramazza and B. Green, "Curvilinear motion in the absence of external forces: naive beliefs about the motion of objects", Science 210 (1980) 1139–1141: a ball shot through a curved tube leaves it in a straight line, though many people draw it curving on', u: 'https://doi.org/10.1126/science.210.4474.1139' },
  b07Bhatia: { t: 'A. Bhatia, "How a 19th Century Math Genius Taught Us the Best Way to Hold a Pizza Slice", Empirical Zeal (Wired), 5 Sep 2014: "Dangle a sheet of paper and it flops over, but give it a fold and it becomes stiff"; "By curving a sheet in one direction, you force it to become stiff in the other direction" (Gauss\'s Theorema Egregium)', u: 'https://empiricalzeal.com/2014/09/05/curvature-and-strength/' },
  b07Ansur: { t: 'ANSUR II public data (US Army anthropometric survey, 2012), full public sample: men (n = 4,082) hand length mean 193.3 mm, SD 9.9, 5th percentile 177, 95th 210, breadth 88.3 mm; women (n = 1,986) 181.1 mm, 5th percentile 165, 95th 199', u: 'https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv' },
  b07Wang: { t: 'M. Wang, G. Li, F. Arippa, A. Barr, Y. Xue and C. Harris-Adamson, "The effects of mouse weight and connection type on performance, muscle activity, and preferences among professional gamers", International Journal of Industrial Ergonomics 97 (2023) 103493: 16 professional players, 10 min of Overwatch; static (10th percentile) activity of the extensor digitorum 5.1 to 5.4 % MVC and of the extensor carpi radialis 5.4 to 5.9 %; Jonsson\'s limit: static load "should not exceed 2% MVC and must not exceed 5% MVC"', u: 'https://stacks.cdc.gov/view/cdc/230569/cdc_230569_DS1.pdf' },
  b07Tang: { t: 'W.-T. Tang, "Evaluating the Impact of Mouse Curvature Design on Hand Ergonomics and Comfort in E-Sport Players Through EMG and 3D Kinematics Measurement Methods", icSPORTS 2023: 16 elite players, five ZOWIE shapes (FK1, FK1+, FK2, S1, S2): click rate the same, 6.35 to 6.37 clicks/s (p > .05); wrist-extensor EMG "S2 and F1 is lower than S1 (p<.05)"', u: 'https://www.scitepress.org/Papers/2023/121904/121904.pdf' },
  b07LiWang: { t: 'Y. Li and H. Wang, "Effects of Mouse Back Shape on Grip Comfort: An Ergonomic Study", AHFE 2025: the peak of a scanned mouse moved 5 mm four ways; EMG of FDI, ED and ECRL showed "no significant differences in muscle activation", comfort ratings did differ', u: 'https://openaccess-api.cms-conferences.org/articles/download/978-1-964867-46-5_1' },
  b07Zowie: { t: 'ZOWIE, "Sport science in ZOWIE U2 mouse design": the lab uses "electromyography (EMG) and motion capture"; the thumb\'s angle affects muscle firing rate; the force difference between the hand\'s two sides "less than 10%"', u: 'https://zowie.benq.com/en-au/knowledge/mouse/sport-science-in-zowie-u2-mouse-design.html' },
  b07Periview: { t: 'periview.gg, Zeromouse and Beanmouse review: the Zeromouse\'s "battery holder positioned at the rear" "shifts the center of gravity towards the back", which the reviewer found makes it feel lighter when pivoting', u: 'https://periview.gg/?p=1375' },
  b07Mass3d: { t: 'This deck, mass model from the 3D assets: the Theseus shell (3d/shell/shell-theseus-1seam.glb): body 12,166 mm³, centre at z −10.4 mm (behind the middle), 16.4 mm up; triggers centred at z 32.0, 22.1 mm up; wheel at z 34.9, 17.0 mm up; the board (plan 5, 3d/pcb/plans/outline_v5.json) x ±19.03, z −10.5 to 48.6, centred at z 19.1, 5 mm up; the battery (LP402535JU, 8 g) at board height in the tail; the weight budget\'s masses (29.31 g); the grip 12 mm up', n: 'derived, this model' },
  b07Fe: { t: 'This deck, 2D frames solved in the page (07-sim.js): the shell cut across at the board\'s rearmost rib row (z −0.77, sliced from the Theseus shell), CF-PP 13.5 GPa, a 10 N press at the crown; its feet held by the rim (a CF-PP ring, 4.0 × 3.6 mm, the Sora outline) alone, or tied to the board (FR4 19 GPa, 1.0 mm, plan 5) by the side ribs; the plan frame under a 10 N squeeze each side, the board tied by six small arms or by every rib along its edge', n: 'derived, this model' }
});

/* ============================== data ============================== */
const B07 = { c: {} };
/** compute once, keep */
function b07_once(k, fn) { if (!(k in B07.c)) B07.c[k] = fn(); return B07.c[k]; }

/* the board, plan 5 (3d/pcb/plans/outline_v5.json, Brock's approved outline), simplified to 0.06 mm: [x, z] mm in the board's
   layout frame (z toward the nose; mouse z = layout z − 2.88, H1's notes). Used for the solver where no shared outline is
   exposed: the drawing itself comes from the shared helpers. */
const B07_BOARD5 = [[0.0,51.45],[4.93,51.45],[5.57,51.37],[6.53,50.96],[10.21,48.37],[11.01,47.99],[11.88,47.84],[18.16,47.84],[18.62,47.73],[18.97,47.39],[19.03,46.97],[19.03,34.07],[18.94,33.65],[18.65,33.25],[16.24,31.1],[15.66,30.48],[15.43,29.67],[15.42,18.43],[15.6,17.68],[16.11,16.95],[18.21,15.46],[18.84,14.67],[19.02,14.03],[19.03,-6.61],[18.91,-7.07],[18.56,-7.42],[18.02,-7.61],[15.87,-7.61],[14.26,-7.16],[10.58,-4.58],[9.82,-4.15],[9.0,-4.01],[-9.0,-4.01],[-9.82,-4.15],[-10.58,-4.58],[-14.26,-7.16],[-15.87,-7.61],[-18.02,-7.61],[-18.56,-7.42],[-18.91,-7.07],[-19.03,-6.61],[-19.02,14.03],[-18.84,14.67],[-18.21,15.46],[-16.11,16.95],[-15.6,17.68],[-15.42,18.43],[-15.43,29.67],[-15.66,30.48],[-16.24,31.1],[-18.65,33.25],[-18.94,33.65],[-19.03,34.07],[-19.03,46.97],[-18.97,47.39],[-18.62,47.73],[-18.16,47.84],[-11.88,47.84],[-11.01,47.99],[-10.21,48.37],[-6.53,50.96],[-5.57,51.37],[-4.93,51.45]];
/* the shell cut across at z −0.77 mm (the board's rearmost rib row), the user's right half, outer surface then inner, [x, y] mm
   (sliced from 3d/shell/shell-theseus-1seam.glb; mirrored for the left, whose side button sits in its wall here) */
const B07_SEC0 = [[0.0,36.98],[-1.53,36.96],[-3.06,36.91],[-4.6,36.81],[-6.15,36.66],[-7.71,36.46],[-9.3,36.22],[-10.91,35.94],[-12.54,35.59],[-14.2,35.17],[-15.89,34.69],[-17.61,34.14],[-19.38,33.52],[-21.17,32.8],[-22.96,31.96],[-24.71,30.96],[-26.33,29.76],[-27.71,28.32],[-28.72,26.63],[-29.37,24.77],[-29.76,22.83],[-29.94,20.87],[-30.0,18.93],[-29.97,17.02],[-29.89,15.14],[-29.76,13.3],[-29.58,11.48],[-29.33,9.69],[-28.98,7.93],[-28.58,6.19],[-28.0,4.5],[-26.94,2.99],[-25.7,1.62],[-23.8,0.65]];
/* the rib rows of the stress study (3d/lattice): z of each arch rib where it meets the rim; those over the board tie to it */
const B07_ROWS = [-31.65, -20.43, -10.64, -0.77, 9.17, 19.25, 29.76, 41.16];
/* the weight budget (shcBudget in 10-d3-board.js and the intro's ntr_budget; restated so this file stands alone) */
const B07_BUD = { shell: 10.35, btn: 3.328, board: 5.6, batt: 8.0, wheel: 1.02, screws: 0.418, ins: 0.516, wires: 0.08 };
/* where each part sits: z forward of the middle, y above the pad (mm), from the 3D assets (see b07Mass3d). The board's
   centre is plan 5's area centroid (layout z 21.97, mouse 19.09); the battery's comes from the shared key-plan constant when
   the kit has it (MS_BATTERY: x, y = −z, across, along), so H1's move reaches this slide */
const B07_POS = {
  body: { z: -10.41, y: 16.44 }, bay: { z: 36.0, y: 13.21 }, btn: { z: 31.97, y: 22.05 }, board: { z: 19.09, y: 5.0 },
  wheel: { z: 34.87, y: 17.03 }, screws: { z: -3.5, y: 8.0 }, wires: { z: 0, y: 10.0 },
  battLow: { z: -24.95, y: 7.46 }, battHigh: { z: -14.0, y: 20.0 }, battOld: { z: -22.72, y: 7.46 },
  sensorOld: 1.12, sensorNew: 16.57, grip: 12.0
};
/* hands and mice */
const B07_HAND = { men: { mean: 193.3, sd: 9.9, p5: 177, p50: 193, p95: 210, breadth: 88.3 }, women: { mean: 181.1, sd: 10.1, p5: 165, p50: 180, p95: 199, breadth: 78.2 } };
const B07_LEN = [['razer-viper-v4-pro', 'Viper V4 Pro', 127.1], ['logitech-gpx2', 'G Pro X Superlight 2', 125.0], ['finalmouse-slx', 'Starlight X', 124.8], ['finalmouse-ulx', 'UltralightX', 121.3]];
/** a mouse's length from the research data (RDATA via exMouse) when it is there, else the table's */
function b07_len(id, d) { try { const m = typeof exMouse === 'function' ? exMouse(id) : null, v = m && (typeof rv === 'function' ? rv(m.length_mm) : null); return v ? +v : d; } catch (e) { return d; } }

/* ============================== geometry helpers (plan view: x across, + the user's left; z forward; mm) ============================== */
/** the Sora's top outline, closed (SORA_HALF, 03-parts.js): [x, z] */
function b07_outline() { return b07_once('outline', () => SORA_HALF.map(p => [p[0], p[1]]).concat(SORA_HALF.slice(1, -1).reverse().map(p => [-p[0], p[1]]))); }
/** a closed polygon moved inward by d, along each vertex's normal */
function b07_inset(P, d) {
  const n = P.length; let A = 0; for (let i = 0; i < n; i++) { const p = P[i], q = P[(i + 1) % n]; A += p[0] * q[1] - q[0] * p[1]; }
  const s = A > 0 ? 1 : -1;
  return P.map((p, i) => { const a = P[(i - 1 + n) % n], b = P[(i + 1) % n]; let tx = b[0] - a[0], ty = b[1] - a[1]; const L = Math.hypot(tx, ty) || 1; tx /= L; ty /= L; return [p[0] - ty * s * d, p[1] + tx * s * d]; });
}
/** n points evenly spaced along a closed polygon */
function b07_resample(P, n) {
  const L = [0]; for (let i = 1; i <= P.length; i++) { const a = P[i - 1], b = P[i % P.length]; L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const T = L[L.length - 1], out = []; let j = 0;
  for (let k = 0; k < n; k++) { const s = k * T / n; while (L[j + 1] < s) j++; const a = P[j], b = P[(j + 1) % P.length], f = (s - L[j]) / Math.max(1e-9, L[j + 1] - L[j]); out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]); }
  return out;
}
function b07_inside(P, x, y) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; }
/** the board's outline in plan: a shared one when the hardware builder exposes it (BOARD5 / boardOutlineMM), else plan 5's */
const B07_LAYOUT_DZ = -2.88;   /* mouse z = layout z − 2.88 (H1) */
function b07_boardOut() {
  if (typeof BOARD_OUTLINE !== 'undefined' && Array.isArray(BOARD_OUTLINE) && BOARD_OUTLINE.length > 8) return BOARD_OUTLINE;
  return b07_once('board5', () => B07_BOARD5.map(p => [p[0], p[1] + B07_LAYOUT_DZ]));
}
/** the board's half-width at z (mm): its outline's widest x at that z */
function b07_boardHalfW(z) { const P = b07_boardOut(); let w = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; if ((z - a[1]) * (z - b[1]) <= 0 && a[1] !== b[1]) w = Math.max(w, Math.abs(a[0] + (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1]))); } return w; }

/* ============================== model 1: the shell at board height, from above ==============================
   The rim at board height is a closed ring of CF-PP beams (the flange with the lower wall, one 4.0 × 3.6 mm section, 2.1 mm
   inside the Sora outline). The board is the plan-5 outline as a 1.0 mm FR4 plate, modelled as a pin-jointed triangle
   lattice of 5 mm pitch whose bars carry the plate's in-plane stiffness (area 0.866 · s · t). It is tied to the rim:
     'none'   not at all (it floats on its screw bosses, as most boards do),
     'arms'   by six small FR4 arms, 3.8 mm wide, three on each long edge where G-Wolves puts them (Brock's photo: 52, 68 and
              84 % of the board's length back from its front),
     'whole'  by every side rib that reaches it (the study's rows over the board, a CF-PP rib foot each side).
   Load: a squeeze, 10 N inward on each side at z 4 (thumb and fingers on the sides over the board). Each element's stress
   is in MPa for that squeeze. */
const B07_PLAN = { ring: { w: 4.0, h: 3.6 }, ringIn: 2.1, lat: 5, armZ: [-1.0, 8.5, 18.0], armW: 3.8, rib: { w: 1.1, h: 1.2 }, sqZ: 4.0, sqN: 10 };
function b07_planModel(kind) {
  const nodes = [], els = [], rowNode = {}, pp = SIM_MAT.ppcf, fr = SIM_MAT.fr4, B = b07_boardOut();
  const z0 = Math.min(...B.map(p => p[1])), z1 = Math.max(...B.map(p => p[1]));
  const ribRows = B07_ROWS.filter(z => z > z0 + 2 && z < z1 - 2);
  const snapRows = [...new Set([...ribRows, ...B07_PLAN.armZ, B07_PLAN.sqZ])];
  const R = b07_inset(b07_resample(b07_outline(), 80), B07_PLAN.ringIn);
  for (const z of snapRows) for (const sd of [1, -1]) {
    let bi = -1, bd = 1e9; R.forEach((p, i) => { if (Math.sign(p[0]) !== sd) return; const d = Math.abs(p[1] - z); if (d < bd) { bd = d; bi = i; } });
    const a = R[(bi - 1 + R.length) % R.length], b = R[(bi + 1) % R.length], f = clamp((z - a[1]) / ((b[1] - a[1]) || 1e-9));
    R[bi] = [lerp(a[0], b[0], f) * 0.5 + R[bi][0] * 0.5, z]; rowNode[z + ':' + sd] = bi;
  }
  R.forEach(p => nodes.push(p));
  for (let i = 0; i < R.length; i++) els.push({ i, j: (i + 1) % R.length, w: B07_PLAN.ring.w, h: B07_PLAN.ring.h, E: pp.E, rho: pp.rho, part: 'ring' });
  let tail = 0, nose = 0; R.forEach((p, i) => { if (p[1] < R[tail][1]) tail = i; if (p[1] > R[nose][1]) nose = i; });
  const m = { nodes, els, fix: { [tail]: 'xy', [nose]: 'x' }, loads: {}, rowNode, nRing: R.length, links: [], board: [], kind, ribRows };
  if (kind !== 'none') {
    const s = B07_PLAN.lat, L = feLattice('tri', -25, -15, 50, 75, s, { w: 1.0, h: 0.866 * s, E: fr.E, rho: fr.rho / 3, truss: true, part: 'board' });
    const keep = L.nodes.map(p => b07_inside(B, p[0], p[1])), map = new Map();
    L.nodes.forEach((p, i) => { if (keep[i]) { map.set(i, nodes.length); m.board.push(nodes.length); nodes.push(p); } });
    L.els.forEach(e => { if (keep[e.i] && keep[e.j]) els.push(Object.assign({}, e, { i: map.get(e.i), j: map.get(e.j) })); });
    const zs = kind === 'arms' ? B07_PLAN.armZ : ribRows;
    for (const z of zs) for (const sd of [1, -1]) {
      const ri = rowNode[z + ':' + sd];
      let bi = -1, bx = -1; for (const k of m.board) { const q = nodes[k]; if (Math.abs(q[1] - z) < s * 0.62 && Math.sign(q[0]) === sd && Math.abs(q[0]) > bx) { bx = Math.abs(q[0]); bi = k; } }
      const sec = kind === 'arms' ? { w: 1.0, h: B07_PLAN.armW, E: fr.E, rho: fr.rho, part: 'arm' } : { w: B07_PLAN.rib.w, h: B07_PLAN.rib.h, E: pp.E, rho: pp.rho, part: 'rib' };
      m.links.push({ e: els.length, z, sd, board: bi, ring: ri }); els.push(Object.assign({ i: bi, j: ri }, sec));
    }
  }
  for (const sd of [1, -1]) m.loads[rowNode[B07_PLAN.sqZ + ':' + sd]] = [-sd * B07_PLAN.sqN, 0, 0];
  return m;
}
/** the three ways, solved once: the squeeze's flex, and the peaks in the FR4 (MPa, for the 10 N squeeze each side) */
function b07_plan() {
  return b07_once('plan', () => {
    const out = {}, peak = (r, part) => Math.max(0, ...r.model.els.map((e, q) => e.part === part ? r.sig[q] : 0));
    for (const kind of ['none', 'arms', 'whole']) {
      const r = simSolve('b07-plan-' + kind, () => b07_planModel(kind)), M = r.model;
      const iL = M.rowNode[B07_PLAN.sqZ + ':1'], iR = M.rowNode[B07_PLAN.sqZ + ':-1'];
      const c = { kind, r, squeeze: r.d[iL * 3] - r.d[iR * 3], ring: peak(r, 'ring'), arm: peak(r, 'arm'), rib: peak(r, 'rib'), board: peak(r, 'board') };
      c.fr4 = Math.max(c.arm, c.board);
      if (kind === 'arms') { let best = -1, bs = -1; M.links.forEach((l, i) => { const s2 = r.sig[l.e]; if (s2 > bs) { bs = s2; best = i; } }); c.hot = M.links[best]; c.armL = M.links.reduce((s2, l) => s2 + r.L[l.e], 0) / M.links.length; }
      out[kind] = c;
    }
    out.fr4X = out.arms.fr4 / Math.max(1e-9, out.whole.fr4);
    out.flexNone = Math.abs(out.none.squeeze); out.flexWhole = Math.abs(out.whole.squeeze); out.flexArms = Math.abs(out.arms.squeeze);
    out.smax = Math.max(out.none.ring, out.arms.ring, out.arms.arm, out.whole.ring, out.whole.rib, out.whole.board);
    return out;
  });
}

/* ============================== model 2: the shell cut across over the board (z −0.77), pressed on the crown ==============================
   The wall's mid-surface from the real section (B07_SEC0 offset 0.62 mm inward, mirrored), as a chain of beams with the
   section of one 9.94 mm bay (the wall 1.2 mm at the foot to 0.9 at the crown and the arch rib under it, as the stress study
   grades them), feet on the pad (held down, free to spread), the spread resisted by a tie of stiffness k (N/mm): the rim alone,
   or the rim tied to the board. 10 N down at the crown (about a 1 kg bag of sugar resting on it). */
function b07_secMid() {
  return b07_once('secMid', () => {
    const P = B07_SEC0, n = P.length, mid = P.map((p, i) => { const a = P[Math.max(0, i - 1)], b = P[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return [p[0] + dy / L * 0.62 * -1, p[1] - dx / L * 0.62 * -1]; });
    mid[0] = [0, P[0][1] - 0.62];
    const right = mid.slice().reverse(), left = mid.slice(1).map(p => [-p[0], p[1]]);
    return right.concat(left);   /* from the user's right foot, over the crown, to the left foot */
  });
}
function b07_archModel(k) {
  const pts = b07_secMid(), N = pts.length - 1, nodes = pts.map(p => p.slice()), els = [], pp = SIM_MAT.ppcf, ytop = Math.max(...pts.map(p => p[1])), sp = 9.94;
  for (let i = 0; i < N; i++) {
    const f = clamp((nodes[i][1] + nodes[i + 1][1]) / 2 / ytop), tw = lerp(1.2, 0.9, f), rw = lerp(1.2, 1.0, f), rh = lerp(1.1, 2.0, f);
    const A1 = sp * tw, A2 = rw * rh, yb = (A1 * tw / 2 + A2 * (tw + rh / 2)) / (A1 + A2), I = sp * tw ** 3 / 12 + A1 * (tw / 2 - yb) ** 2 + rw * rh ** 3 / 12 + A2 * (tw + rh / 2 - yb) ** 2, A = A1 + A2, h = Math.sqrt(12 * I / A);
    els.push({ i, j: i + 1, w: A / h, h, E: pp.E, rho: pp.rho, part: 'arch' });
  }
  const span = Math.abs(nodes[N][0] - nodes[0][0]);
  if (k > 0) els.push({ i: 0, j: N, w: 1, h: 1, E: k * span, rho: 0, truss: true, part: 'tie' });
  let crown = 0; nodes.forEach((p, i) => { if (p[1] > nodes[crown][1]) crown = i; });
  return { nodes, els, fix: { 0: 'xy', [N]: 'y' }, loads: { [crown]: [0, -10, 0] }, crown, N };
}
/** the tie each way gives the arch's feet, from the plan frame: a unit outward pair at the row, the feet's relative spread */
function b07_tieK(kind) {
  return b07_once('tieK-' + kind, () => {
    const z = -0.77, r = simSolve('b07-tie-' + kind, () => { const m = b07_planModel(kind); m.loads = {}; for (const sd of [1, -1]) m.loads[m.rowNode[z + ':' + sd]] = [sd * 1, 0, 0]; return m; });
    const M = r.model, iL = M.rowNode[z + ':1'], iR = M.rowNode[z + ':-1'];
    return 1 / Math.max(1e-9, r.d[iL * 3] - r.d[iR * 3]);
  });
}
/** the board's job on the section: crown sink and feet spread with the rim alone and with the board tied */
function b07_board() {
  return b07_once('board', () => {
    const kN = b07_tieK('none'), kW = b07_tieK('whole');
    const a0 = simSolve('b07-arch-none', () => b07_archModel(kN)), a1 = simSolve('b07-arch-whole', () => b07_archModel(kW));
    const sink = r => -r.d[r.model.crown * 3 + 1], spread = r => r.d[r.model.N * 3] - r.d[0];
    const res = { kN, kW, a0, a1, sink0: sink(a0), sink1: sink(a1), spread0: spread(a0), spread1: spread(a1), pk0: a0.smax, pk1: a1.smax };
    res.flexCut = 1 - res.sink1 / res.sink0; res.spreadCut = 1 - res.spread1 / res.spread0;
    return res;
  });
}
/* the same weight of FR4 and magnesium alloy, pulled until it breaks: strips 50 mm long, FR4 10 × 1.0 mm (0.93 g), the
   magnesium 1.0 mm thick and as wide as the same weight allows (shlFr4 Gund 430 MPa, 1.85; shlMg MatWeb 230 MPa, 1.81) */
const B07_PULL = (() => { const L = 50, aF = 10, g = 1.85 * aF * L / 1000, aM = g * 1000 / (1.81 * L), fF = 430 * aF, fM = 230 * aM; return { L, aF, aM, g, fF, fM, ratio: fF / fM }; })();

/* ============================== model 3: tolerance stack-up (Scholz 1995) ==============================
   Parts around one seam, each off its drawing by up to ±T (T = 3σ, normal, centred, independent). Worst case: T₁ + … + Tₙ.
   Likely (RSS): √(T₁² + … + Tₙ²). The share of the spread one part owns: Tᵢ² / ΣTⱼ². Out of spec: 2Φ(−S / σ). */
const B07_TOL = { T: 0.076, S: 0.10, bad: 0.25, n: 24000 };
/** the standard normal CDF (Abramowitz and Stegun 7.1.26, |error| < 1.5e-7) */
function b07_Phi(x) { const s = x < 0 ? -1 : 1, z = Math.abs(x) / Math.SQRT2, t = 1 / (1 + 0.3275911 * z), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z); return 0.5 * (1 + s * y); }
function b07_stack(Ts, S = B07_TOL.S) {
  const wc = Ts.reduce((a, b) => a + b, 0), ss = Ts.reduce((a, b) => a + b * b, 0), rss = Math.sqrt(ss), sig = rss / 3;
  return { n: Ts.length, wc, rss, sig, out: 2 * b07_Phi(-S / sig), share: Ts.map(v => v * v / ss) };
}
function b07_tol() {
  return b07_once('tol', () => {
    const T = B07_TOL.T, cases = {
      four: b07_stack([T, T, T, T]), bad: b07_stack([T, T, T, B07_TOL.bad]), two: b07_stack([T, T]), one: b07_stack([T])
    };
    /* the build line: seeded samples, the same seed for each build so the histograms differ only by the parts */
    const sample = (Ts, seed) => { const r = rng(seed), g = () => { const u = Math.max(1e-9, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); }; const out = []; for (let i = 0; i < B07_TOL.n; i++) { let s = 0; for (const t of Ts) s += g() * t / 3; out.push(s); } return out; };
    for (const [k, Ts] of [['four', [T, T, T, T]], ['bad', [T, T, T, B07_TOL.bad]], ['two', [T, T]]]) { cases[k].g = sample(Ts, 29); cases[k].mcOut = cases[k].g.filter(v => Math.abs(v) > B07_TOL.S).length / B07_TOL.n; }
    return cases;
  });
}

/* ============================== model 4: the centre of mass, from the 3D assets ==============================
   Each part of the 29.31 g at its place (B07_POS), the shell split between the body and the wheel bay by their volumes
   (12,166 and 1,375 mm³). Returns the centre of mass's z (forward of the middle) and height for the battery at a place. */
function b07_cg(batt) {
  const B = B07_BUD, P = B07_POS, fb = 12166 / (12166 + 1375);
  const parts = [[B.shell * fb, P.body], [B.shell * (1 - fb), P.bay], [B.btn, P.btn], [B.board, P.board], [B.wheel, P.wheel], [B.screws + B.ins, P.screws], [B.wires, P.wires], [B.batt, batt]];
  const m = parts.reduce((s, p) => s + p[0], 0);
  return { m, z: parts.reduce((s, p) => s + p[0] * p[1].z, 0) / m, y: parts.reduce((s, p) => s + p[0] * p[1].y, 0) / m, parts };
}
/** the battery's centre in the mouse (z forward), from the shared key-plan constant when there is one */
function b07_battZ() { return typeof MS_BATTERY !== 'undefined' && Array.isArray(MS_BATTERY) ? -(MS_BATTERY[1] + MS_BATTERY[3] / 2) : B07_POS.battLow.z; }
function b07_balance() {
  return b07_once('bal', () => {
    const P = B07_POS, zb = b07_battZ(), low = b07_cg({ z: zb, y: P.battLow.y }), high = b07_cg(P.battHigh), old = b07_cg(P.battOld);
    const lvLow = low.y - P.grip, lvHigh = high.y - P.grip;
    return { low, high, old, lvLow, lvHigh, twistCut: 1 - Math.abs(lvLow) / Math.abs(lvHigh) };
  });
}
/** the same section squeezed at the grip: 10 N inward on each side, 12 mm up (thumb and fingers), feet held down and tied by k */
function b07_sqModel(k) {
  const m = b07_archModel(k), near = (x, y) => { let b = 0, bd = 1e9; m.nodes.forEach((p, i) => { const d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; b = i; } }); return b; };
  const xr = Math.max(...m.nodes.map(p => p[0])), iL = near(xr, 12), iR = near(-xr, 12);
  m.loads = { [iL]: [-10, 0, 0], [iR]: [10, 0, 0] }; m.grip = [iL, iR];
  return m;
}
function b07_squeeze() {
  return b07_once('squeeze', () => {
    const kN = b07_tieK('none'), kW = b07_tieK('whole');
    const s0 = simSolve('b07-sq-none', () => b07_sqModel(kN)), s1 = simSolve('b07-sq-whole', () => b07_sqModel(kW)), s2 = simSolve('b07-sq-free', () => b07_sqModel(0.001));
    const fl = r => r.d[r.model.grip[0] * 3] - r.d[r.model.grip[1] * 3];
    const ft = r => r.d[r.model.N * 3] - r.d[0];
    return { s0, s1, s2, flex0: -fl(s0), flex1: -fl(s1), flexFree: -fl(s2), feet0: ft(s0), feet1: ft(s1), pk0: s0.smax, pk1: s1.smax };
  });
}

/* ============================== model 5: the flat low sides (b07_sides) ==============================
   The Theseus shell cut across its hump (z −14, its highest point; SHB_SEC in 10-d2-arches.js, restated here): the outer
   surface, [x, y] mm, + the side-button side (the user's left, where the thumb rests). Resampled into 72 elements along
   its arc, a 10 mm strip 1.6 mm deep (the wall and its lattice as one depth), PP-C-20A, pinned at both rims. The squeeze:
   10 N inward on each side, 12 mm up, the same on both (Brock: "show equal pressure on both sides, just for show"). The
   band: extra depth on both low sides (2 to 20 mm up) worth 10 % of the strip's weight, against the same weight spread
   evenly. */
const B07_HUMP = [[24.9,0.7],[26.9,0.9],[28.3,2.3],[29.6,3.8],[30.3,5.6],[30.6,7.6],[30.8,9.6],[30.8,11.6],[30.7,13.6],[30.6,15.6],[30.4,17.6],[30.1,19.6],[29.6,21.5],[29.0,23.4],[28.3,25.3],[27.3,27.0],[26.1,28.6],[24.7,30.1],[23.2,31.3],[21.5,32.5],[19.8,33.5],[18.0,34.4],[16.2,35.2],[14.3,35.8],[12.4,36.4],[10.4,36.9],[8.5,37.3],[6.5,37.6],[4.5,37.9],[2.5,38.0],[0.5,38.1],[-1.5,38.1],[-3.5,38.0],[-5.5,37.8],[-7.4,37.5],[-9.4,37.1],[-11.4,36.7],[-13.3,36.2],[-15.2,35.5],[-17.0,34.8],[-18.9,34.0],[-20.6,33.0],[-22.3,32.0],[-23.9,30.7],[-25.4,29.4],[-26.7,27.9],[-27.8,26.2],[-28.7,24.4],[-29.3,22.5],[-29.8,20.6],[-30.2,18.6],[-30.5,16.7],[-30.7,14.7],[-30.8,12.7],[-30.8,10.7],[-30.7,8.7],[-30.5,6.7],[-30.1,4.7],[-29.0,3.1],[-27.7,1.6],[-26.0,0.7]];
const B07_SN = 72, B07_H0 = 1.6;
function b07_humpPts() {
  return b07_once('humpPts', () => {
    /* symmetric: the mean of the two halves, so both sides are the same shape (the thumb side differs by a few tenths) */
    const P = B07_HUMP, half = x => { let best = null; for (let i = 1; i < P.length; i++) { const a = P[i - 1], b = P[i]; } return best; };
    void half;
    const d = [0]; for (let i = 1; i < P.length; i++) d.push(d[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const L = d[d.length - 1], raw = []; let j = 0;
    for (let k = 0; k <= B07_SN; k++) { const s = L * k / B07_SN; while (j < d.length - 2 && d[j + 1] < s) j++; const f = (s - d[j]) / (d[j + 1] - d[j]); raw.push([P[j][0] + (P[j + 1][0] - P[j][0]) * f, P[j][1] + (P[j + 1][1] - P[j][1]) * f]); }
    /* mirror-average: point k and point N − k describe the two sides */
    const out = raw.map((p, k) => { const q = raw[B07_SN - k]; return [(p[0] - q[0]) / 2, (p[1] + q[1]) / 2]; });
    return { pts: out, L };
  });
}
const b07_sm = (e0, e1, x) => { const k = clamp((x - e0) / (e1 - e0)); return k * k * (3 - 2 * k); };
/** the band's weight at an element's middle: 1 on the low sides (2 to 20 mm up), 0 above */
function b07_bandW(m) { return b07_sm(1.5, 3.5, m[1]) * (1 - b07_sm(18, 22, m[1])); }
function b07_sideModel(band) {
  const S = b07_humpPts(), mat = SIM_MAT.ppcf, nodes = S.pts.map(p => p.slice()), els = [], mids = []; let Lb = 0, Lt = 0;
  for (let i = 0; i < B07_SN; i++) { const a = nodes[i], b = nodes[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; mids.push(m); Lt += L; Lb += L * b07_bandW(m); }
  const dh = band ? (band.even ? B07_H0 * band.add : B07_H0 * band.add * Lt / Lb) : 0;
  mids.forEach((m, i) => els.push({ i, j: i + 1, w: 10, h: B07_H0 + (band ? (band.even ? dh : dh * b07_bandW(m)) : 0), E: mat.E, rho: mat.rho, band: band && !band.even ? b07_bandW(m) : 0 }));
  const near = (x, y) => { let b = 0, bd = 1e9; nodes.forEach((p, i) => { const d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; b = i; } }); return b; };
  const iL = near(31, 12), iR = near(-31, 12);
  return { nodes, els, fix: { 0: 'xy', [B07_SN]: 'xy' }, loads: { [iL]: [-10, 0, 0], [iR]: [10, 0, 0] }, grip: [iL, iR] };
}
function b07_sides() {
  return b07_once('sides', () => {
    const RB = simSolve('b07-side-plain', () => b07_sideModel(null)), RX = simSolve('b07-side-band', () => b07_sideModel({ add: 0.1 })), RE = simSolve('b07-side-even', () => b07_sideModel({ add: 0.1, even: true }));
    const fl = r => Math.max(...r.model.grip.map(i => Math.hypot(r.d[i * 3], r.d[i * 3 + 1])));
    const f0 = fl(RB), fB = fl(RX), fE = fl(RE), cutB = 1 - fB / f0, cutE = 1 - fE / f0;
    /* the section's own numbers: the arch above the widest line (rise over span) and the low side's bulge over its chord */
    const P = b07_humpPts().pts, top = P.filter(p => p[1] >= 11.6), span = Math.max(...top.map(p => p[0])) - Math.min(...top.map(p => p[0])), rise = Math.max(...P.map(p => p[1])) - 11.6;
    const low = P.filter(p => p[0] > 0 && p[1] >= 3.8 && p[1] <= 19.6).sort((p, q) => p[1] - q[1]), c0 = low[0], c1 = low[low.length - 1], cl = Math.hypot(c1[0] - c0[0], c1[1] - c0[1]);
    const bulge = Math.max(...low.map(p => Math.abs((c1[0] - c0[0]) * (c0[1] - p[1]) - (c0[0] - p[0]) * (c1[1] - c0[1])) / cl));
    return { RB, RX, RE, f0, fB, fE, cutB, cutE, perG: cutB / cutE, pk0: RB.smax, pkB: RX.smax, pkE: RE.smax, pkG: (1 - RX.smax / RB.smax) / Math.max(1e-9, 1 - RE.smax / RB.smax), rise, span, bulge, chord: cl };
  });
}

/* ============================== model 6: Newtonian shape analysis (b07_newton) ==============================
   A profile is drawn from κ(s), the rate of change of its slope (1/mm) along the arc, from the crown (s = 0, level, heading
   outward) round the shoulder to the side; y down, mm. So the analysis is exact: the slope is θ(s) = ∫κ ds, the push is
   along the normal, the rate of change is the κ drawn. Three illustrative profiles (F21.12: "Newtonian profiles: Fine for
   now"), from the old shape chapter (10-g-shape.js). A finger pressed onto a profile and following it at a steady pace can be
   turned no tighter than a radius ℓ (pace² × mass / press, 2.2 mm here): where the curve turns tighter, it carries on along
   the derivative at that edge, as the ball leaves the curved tube (McCloskey 1980). */
function b07_profile(kfn, L) {
  const P = [], ds = 0.1; let x = 0, y = 0, th = 0;
  for (let s = 0; s <= L + 1e-9; s += ds) { const k = kfn(s); P.push({ x, y, th, k, s }); x += Math.cos(th + k * ds / 2) * ds; y += Math.sin(th + k * ds / 2) * ds; th += k * ds; }
  return P;
}
const b07_gauss = (s, c, sd, turn) => turn * Math.exp(-0.5 * ((s - c) / sd) ** 2) / (sd * Math.sqrt(TAU));
function b07_shp() {
  return b07_once('shp', () => ({
    sharp: b07_profile(s => (s < 19 ? 1 / 90 : 0) + b07_gauss(s, 19.4, 0.55, 1.6), 37),
    soft: b07_profile(s => (s < 37 ? 1 / 21.5 : 0), 39),
    round: b07_profile(s => (s < 17.5 ? 1 / 90 : 0) + b07_gauss(s, 18.5, 2.7, 1.6), 38)
  }));
}
const b07_peakK = P => P.reduce((m, q) => Math.max(m, q.k), 0) * 180 / Math.PI;   /* °/mm */
const B07_ELL = 2.2;
/** a finger following profile P 1:1 at a steady pace from s0 toward sEnd, u = 0..1: where it is, and whether it has left */
function b07_follow(P, u, s0, sEnd) {
  const ds = 0.1, last = P.length - 1, i0 = Math.round(s0 / ds), sNow = s0 + (sEnd - s0) * clamp(u), iNow = Math.min(last, Math.round(sNow / ds));
  let iSep = -1; for (let i = i0; i <= last; i++) if (P[i].k > 1 / B07_ELL) { iSep = i; break; }
  if (iSep < 0 || iNow < iSep) { const q = P[iNow]; return { x: q.x, y: q.y, th: q.th, off: false, iSep, i: iNow }; }
  const q = P[iSep], tau = sNow - q.s;
  return { x: q.x + Math.cos(q.th) * tau, y: q.y + Math.sin(q.th) * tau, th: q.th, off: true, iSep, i: iSep, tau };
}

/* ============================== model 7: graded walls and joined struts (b07_sheet) ==============================
   Graded walls (#93): an arch slice of one weight with even 1.2 mm walls, or walls graded thicker toward the rim, clamped at
   the rim, squeezed 10 N each side 15 mm up. Joined struts (#53, #55): the low front in section, a shallow roof on two side
   walls, propped by two separate floor-to-ceiling struts, or by the same material as an arch joined to the roof by posts;
   5 N on the middle of the roof. Unit-width beams of PP-C-20A. */
function b07_gradeModel(graded) {
  const N = 40, nodes = [], els = [], pp = SIM_MAT.ppcf;
  for (let i = 0; i <= N; i++) { const th = Math.PI * (1 - i / N), c = Math.cos(th), s = Math.sin(th); nodes.push([30 * Math.sign(c) * Math.pow(Math.abs(c), 0.6), 34 * Math.pow(s, 0.7)]); }
  const L = i => Math.hypot(nodes[i + 1][0] - nodes[i][0], nodes[i + 1][1] - nodes[i][1]), raw = y => 0.7 + 0.6 * (1 - y / 34);
  let num = 0, den = 0; for (let i = 0; i < N; i++) { const y = (nodes[i][1] + nodes[i + 1][1]) / 2; num += 1.2 * L(i); den += raw(y) * L(i); }
  for (let i = 0; i < N; i++) { const y = (nodes[i][1] + nodes[i + 1][1]) / 2, t2 = graded ? raw(y) * num / den : 1.2; els.push({ i, j: i + 1, w: 10, h: t2, E: pp.E, rho: pp.rho }); }
  const near = (sd, y) => { let b = 0, bd = 1e9; nodes.forEach((p, i) => { if (Math.sign(p[0]) !== sd) return; const d = Math.abs(p[1] - y); if (d < bd) { bd = d; b = i; } }); return b; };
  const sqL = near(1, 15), sqR = near(-1, 15);
  return { nodes, els, fix: { 0: 'xyr', [N]: 'xyr' }, loads: { [sqL]: [-10, 0, 0], [sqR]: [10, 0, 0] }, sq: [sqL, sqR], N };
}
function b07_grade() {
  return b07_once('grade', () => {
    const ev = simSolve('b07-grade-even', () => b07_gradeModel(false)), gr = simSolve('b07-grade-graded', () => b07_gradeModel(true));
    const fl = r => (r.d[r.model.sq[1] * 3] - r.d[r.model.sq[0] * 3]);
    const g = r => r.mass.reduce((a, b) => a + b, 0);
    return { ev, gr, flexEv: fl(ev), flexGr: fl(gr), cut: 1 - fl(gr) / fl(ev), pkEv: ev.smax, pkGr: gr.smax, gEv: g(ev), gGr: g(gr) };
  });
}
function b07_strutModel(joined, ht) {
  const nodes = [], els = [], pp = SIM_MAT.ppcf, roof = x => 14 - 0.006 * x * x;   /* the roof 14 mm up in the middle, 8.6 at the walls */
  const xs = []; for (let x = -30; x <= 30.001; x += 2.5) xs.push(+x.toFixed(2));
  const R = xs.map(x => { nodes.push([x, roof(x)]); return nodes.length - 1; });
  for (let i = 0; i < R.length - 1; i++) els.push({ i: R[i], j: R[i + 1], w: 10, h: 1.0, E: pp.E, rho: pp.rho, part: 'roof' });
  /* the side walls, down to the floor (fixed) */
  const wall = sd => { const top = sd < 0 ? R[0] : R[R.length - 1], x = sd * 30, n = 4, ids = [top]; for (let k = 1; k <= n; k++) { nodes.push([x, roof(30) * (1 - k / n)]); ids.push(nodes.length - 1); } for (let k = 0; k < n; k++) els.push({ i: ids[k], j: ids[k + 1], w: 10, h: 1.2, E: pp.E, rho: pp.rho, part: 'wall' }); return ids[n]; };
  const fl = wall(-1), fr = wall(1), fix = { [fl]: 'xyr', [fr]: 'xyr' };
  const at = x => R[xs.findIndex(v => Math.abs(v - x) < 1e-6)];
  if (!joined) {
    /* two separate struts at x ±12.5, roof to floor */
    for (const x of [-12.5, 12.5]) { const top = at(x), n = 4, ids = [top]; for (let k = 1; k <= n; k++) { nodes.push([x, roof(x) * (1 - k / n)]); ids.push(nodes.length - 1); } for (let k = 0; k < n; k++) els.push({ i: ids[k], j: ids[k + 1], w: 10, h: ht || 1.0, E: pp.E, rho: pp.rho, part: 'strut' }); fix[ids[n]] = 'xyr'; }
  } else {
    /* the same material as an arch from floor to floor under the roof, joined to the roof by four posts */
    const arch = x => 10.4 * (1 - (x / 30) ** 2), A = [];
    for (const x of xs) { if (Math.abs(x) > 29.99) { A.push(null); continue; } nodes.push([x, arch(x)]); A.push(nodes.length - 1); }
    const fA = []; for (const sd of [-1, 1]) { nodes.push([sd * 30, 0]); fA.push(nodes.length - 1); fix[nodes.length - 1] = 'xyr'; }
    const chain = [fA[0], ...A.filter(v => v != null), fA[1]];
    for (let i = 0; i < chain.length - 1; i++) els.push({ i: chain[i], j: chain[i + 1], w: 10, h: ht || 0.62, E: pp.E, rho: pp.rho, part: 'strut' });
    for (const x of [-17.5, -7.5, 7.5, 17.5]) { const k = xs.findIndex(v => Math.abs(v - x) < 1e-6); els.push({ i: R[k], j: A[k], w: 10, h: ht || 0.62, E: pp.E, rho: pp.rho, part: 'strut' }); }
  }
  return { nodes, els, fix, loads: { [at(0)]: [0, -5, 0] }, press: at(0) };
}
function b07_struts() {
  return b07_once('struts', () => {
    /* the same weight of strut material both ways: the arch at 0.62 mm, the separate struts as thick as that weight allows */
    const jo = simSolve('b07-strut-joined', () => b07_strutModel(true, 0.62)), g = (r, p) => r.mass.reduce((a, b, e) => a + (r.model.els[e].part === p ? b : 0), 0);
    const g1 = g(simSolve('b07-strut-sep1', () => b07_strutModel(false, 1.0)), 'strut'), hs = g(jo, 'strut') / g1;
    const sep = simSolve('b07-strut-sep', () => b07_strutModel(false, hs));
    const sink = r => -r.d[r.model.press * 3 + 1];
    return { sep, jo, hs, sinkSep: sink(sep), sinkJo: sink(jo), cut: 1 - sink(jo) / sink(sep), pkSep: sep.smax, pkJo: jo.smax, gSep: g(sep, 'strut'), gJo: g(jo, 'strut') };
  });
}

/* ============================== shared drawing helpers ============================== */
/** a tiny simplified mouse, from above (the kit's own outline, nose up), filled: a glyph for "one mouse" */
function b07_glyph(x, y, s, col, a = 1, rot = 0) {
  if (a <= 0.003) return;
  const V = typeof msView === 'function' ? msView('top') : null;
  G.save(); G.globalAlpha = a; G.translate(x, y); if (rot) G.rotate(rot); G.scale(s, s); G.fillStyle = col;
  if (V && V.out) G.fill(V.out); else { keyPath(); G.fill(); }
  G.restore();
}
/** a coin seen edge-on (a US quarter, 24.26 mm across, 1.75 mm thick), centred on x with its bottom at y; s px/mm; th its
   drawn thickness in px. o = { bad (a sloppy one: red edge), a } */
function b07_coin(x, y, s, th, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const w = 24.26 * s, x0 = x - w / 2, y0 = y - th, r = Math.min(th / 2, 4);
  G.save(); G.globalAlpha = a;
  const g = G.createLinearGradient(0, y0, 0, y);
  if (o.bad) { g.addColorStop(0, mix(C.track, C.red, 0.35)); g.addColorStop(1, mix(C.faint, C.red, 0.45)); }
  else if (TH) { g.addColorStop(0, C.track); g.addColorStop(0.5, C.comp); g.addColorStop(1, C.faint); }
  else { g.addColorStop(0, C.ink2); g.addColorStop(0.5, C.mute); g.addColorStop(1, C.faint); }
  rrPath(x0, y0, w, th, r); G.fillStyle = g; G.fill();
  /* the reeded edge, seen face-on: fine vertical ridges */
  G.save(); rrPath(x0, y0, w, th, r); G.clip(); G.strokeStyle = o.bad ? rgba(C.red, 0.35) : (TH ? 'rgba(0,0,0,0.16)' : 'rgba(0,0,0,0.28)'); G.lineWidth = 1;
  G.beginPath(); for (let k = x0 + 3; k < x0 + w - 2; k += 4.2) { G.moveTo(k, y0 + 2); G.lineTo(k, y - 2); } G.stroke(); G.restore();
  rrPath(x0 + 0.5, y0 + 0.5, w - 1, th - 1, r); G.strokeStyle = o.bad ? C.red : (TH ? 'rgba(17,17,17,0.35)' : 'rgba(255,255,255,0.22)'); G.lineWidth = o.bad ? 2 : 1; G.stroke();
  G.restore();
}
/** a vertical bracket from y0 to y1 at x, ticks pointing left (dir −1) or right (dir 1), with a label beside it */
function b07_bracket(x, y0, y1, col, a, label, o = {}) {
  if (a <= 0.003) return;
  const d = o.dir || 1, tk = 10;
  G.save(); G.globalAlpha = a; G.strokeStyle = col; G.lineWidth = o.w || 2; G.setLineDash(o.dash || []);
  G.beginPath(); G.moveTo(x - d * tk, y0); G.lineTo(x, y0); G.lineTo(x, y1); G.lineTo(x - d * tk, y1); G.stroke(); G.setLineDash([]); G.restore();
  if (label) text(label, x + d * 14, (y0 + y1) / 2 + 8, { role: 'label', size: o.size || 20, color: o.tcol || col, align: d > 0 ? 'left' : 'right', alpha: a });
}

/* ============================== 1. b07_board: The board you already carry ==============================
   Problem first (M1): squeeze the shell at the grip and its feet slide inward (solved: the soft rim lets them come 0.68 mm
   closer; the sides come in 0.64 mm, the crown rises 0.26). The usual fix adds a stiff part
   (a carbon or magnesium shell, or a carbon rod glued across): one more part, more joints to hold to size. The board is
   already there, spanning the feet, and FR4 is a woven composite like carbon fibre (woven glass in epoxy). Theseus anchors
   its ribs on the board's edge, which holds the feet apart: the same squeeze moves the sides a third as far, nothing added. The cut is the real shell's,
   across the board's rear rib row (model 2); the classroom panels are the two weaves side by side and the same weight of
   FR4 and magnesium pulled apart. */
const B07_BRD = { ex: 10, by: 5.0, bt: 1.0, rodY: 2.2, rodR: 1.0, z: -0.77 };
/** a plain-weave swatch in [x, y, w, h]: strands passing over and under each other, set in resin. kind 'carbon' | 'glass' */
function b07_weave(x, y, w, h, kind, a, o = {}) {
  if (a <= 0.003) return;
  const c = o.cell || 26, gp = c * 0.11, carbon = kind === 'carbon';
  G.save(); G.globalAlpha = a; rrPath(x, y, w, h, 6); G.clip();
  G.fillStyle = carbon ? MT.epoxy.g[1] : MT.fr4.g[1]; G.fillRect(x, y, w, h);
  for (let i = 0; i * c < h; i++) for (let j = 0; j * c < w; j++) {
    const x0 = x + j * c, y0 = y + i * c, across = (i + j) % 2 === 0;
    const g = across ? G.createLinearGradient(0, y0 + gp, 0, y0 + c - gp) : G.createLinearGradient(x0 + gp, 0, x0 + c - gp, 0);
    if (carbon) { g.addColorStop(0, '#202125'); g.addColorStop(0.5, '#6A6B71'); g.addColorStop(1, '#202125'); }
    else { g.addColorStop(0, 'rgba(255,255,255,0.28)'); g.addColorStop(0.5, 'rgba(255,255,255,0.78)'); g.addColorStop(1, 'rgba(255,255,255,0.28)'); }
    G.fillStyle = g;
    if (across) rrPath(x0 + 1, y0 + gp, c - 2, c - 2 * gp, gp); else rrPath(x0 + gp, y0 + 1, c - 2 * gp, c - 2, gp);
    G.fill();
    /* the fibres along each strand */
    G.strokeStyle = carbon ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.2)'; G.lineWidth = 1; G.beginPath();
    for (let q = 1; q < 4; q++) {
      if (across) { const yy = y0 + gp + (c - 2 * gp) * q / 4; G.moveTo(x0 + 2, yy); G.lineTo(x0 + c - 2, yy); }
      else { const xx = x0 + gp + (c - 2 * gp) * q / 4; G.moveTo(xx, y0 + 2); G.lineTo(xx, y0 + c - 2); }
    }
    G.stroke();
  }
  G.restore();
  rrPath(x + 0.5, y + 0.5, w - 1, h - 1, 6); G.save(); G.globalAlpha = a; G.strokeStyle = C.hair; G.lineWidth = 1; G.stroke(); G.restore();
}
/** the two weaves side by side: carbon cloth in epoxy, glass cloth in epoxy (FR4) */
function b07_weavePanel(t, t0, r) {
  if (t < t0) return;
  const inner = demoPanel(t, t0, r, { label: 'Two woven composites', src: 'Wikipedia: FR-4' });
  const sw = (inner[2] - 36) / 2, sh = inner[3] - 70, sy = inner[1] + 2;
  [['carbon', 'Carbon fibre', 'Carbon cloth set in epoxy'], ['glass', 'FR4, the board', 'Glass cloth set in epoxy']].forEach(([k, name, sub], i) => {
    const sx = inner[0] + i * (sw + 36), ka = ep(t, t0 + 0.25 + i * 0.4, t0 + 0.65 + i * 0.4);
    b07_weave(sx, sy, sw, sh, k, ka);
    text(name, sx, sy + sh + 30, { role: 'label', size: 21, color: i ? C.heroText : C.ink2, alpha: ka });
    text(sub, sx, sy + sh + 58, { role: 'small', size: 22, weight: 600, color: C.mute, alpha: ka });
  });
}
const b07_k = v => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
/** the same weight of FR4 and magnesium alloy, pulled until each breaks (B07_PULL) */
function b07_pullPanel(t, t0, r) {
  if (t < t0) return;
  const inner = demoPanel(t, t0, r, { label: 'Same weight, pulled until it breaks' });
  const rows = [['Magnesium alloy', B07_PULL.fM, C.comp, C.mute], ['FR4', B07_PULL.fF, C.hero, C.heroText]];
  const bx = inner[0] + 214, bwMax = inner[2] - 214 - 196, a = ep(t, t0 + 0.2, t0 + 0.6);
  rows.forEach(([name, F, col, tcol], i) => {
    const yy = inner[1] + 16 + i * 48, kb = ep(t, t0 + 0.35 + i * 0.35, t0 + 1.05 + i * 0.35, E.out3), bw = Math.max(3, bwMax * F / B07_PULL.fF * kb);
    text(name, inner[0], yy + 8, { role: 'label', size: 19, color: tcol, alpha: a });
    rr(bx, yy - 9, bw, 24, 3, col, null, 0, a);
    const v = Math.floor(F * kb / 50) * 50;
    rich([{ s: b07_k(v), role: 'num', size: 26, weight: 750, color: i ? C.heroText : C.ink2, tnum: true }, { s: 'N', role: 'small', size: 20, weight: 650, color: C.mute, gap: 6 },
      i && kb >= 1 ? { s: fmtN(Math.floor(B07_PULL.ratio * 10) / 10, 1) + '×', font: 'disp', size: 30, weight: 800, color: C.heroText, grad: C.heroGrad, gap: 16, caps: false } : null], bx + bw + 14, yy + 10, { alpha: a });
  });
  text('Strips of ' + fmtN(B07_PULL.g, 2) + ' g each, ' + B07_PULL.L + ' mm long (Gund; MatWeb)', inner[0], inner[1] + inner[3] + 6, { role: 'small', size: 21, weight: 560, color: C.faint, alpha: a });
}
/** the shell cut across at the board's rear rib row, as a front view sees it (mm, in establish's front frame: up is −y): the
   wall as solved (r), squeezed by sq (0..1), drawn ex× real and shown symmetric (the solve pins one foot; half the spread is
   given back to it, a rigid shift). o = { tied (0..1: the ribs reach the board's edge), rod (0..1: the rival's glued carbon
   rod), glow (0..1: the board lit), a } */
function b07_secScene(r, sq, o = {}) {
  const M = r.model, a = o.a == null ? 1 : o.a, ex = B07_BRD.ex; if (a <= 0.003) return;
  const sh = (r.d[0] + r.d[M.N * 3]) / 2, P = q => [q[0], -q[1]], Pd = q => [q[0] - sh * sq * ex, -q[1]];
  const dn = i => [M.nodes[i][0] + (r.d[i * 3] - sh) * sq * ex, M.nodes[i][1] + r.d[i * 3 + 1] * sq * ex];
  /* the pad under the feet */
  G.save(); G.globalAlpha = PA * a; G.strokeStyle = C.hair; G.lineWidth = lw(2); G.beginPath(); G.moveTo(-36, 0); G.lineTo(36, 0); G.stroke(); G.restore();
  /* the wall at rest, dashed, once it moves */
  const kg = clamp(sq * 4);
  if (kg > 0.01) { G.save(); G.globalAlpha = PA * a * 0.75 * kg; G.strokeStyle = C.faint; G.lineWidth = lw(1.5); G.setLineDash([lw(7), lw(6)]); G.beginPath(); M.nodes.forEach((n, i) => { const p = P(n); i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1]); }); G.stroke(); G.restore(); }
  /* the board, edge on */
  const bw = b07_boardHalfW(B07_BRD.z), by = B07_BRD.by, bt = B07_BRD.bt, gl = o.glow || 0;
  G.save(); G.globalAlpha = PA * a;
  if (gl > 0.01) { G.shadowColor = rgba(C.hero, 0.8 * gl); G.shadowBlur = 18 * gl; }
  G.fillStyle = TH ? MT.mask.g[0] : C.comp2; G.fillRect(-bw, -(by + bt / 2), 2 * bw, bt); G.shadowBlur = 0;
  G.strokeStyle = mix(MT.brass.g[1], C.hero, gl); G.lineWidth = lw(1.5 + gl); G.strokeRect(-bw, -(by + bt / 2), 2 * bw, bt);
  G.restore();
  /* the rival's fix: a carbon rod glued across the feet, a blob of glue at each end */
  if (o.rod > 0.003) {
    const ry = B07_BRD.rodY, rr0 = B07_BRD.rodR, xe = 23.0, dy = (1 - o.rod) * 6;
    G.save(); G.globalAlpha = PA * a * clamp(o.rod * 1.5);
    const g = G.createLinearGradient(0, -(ry + rr0) - dy, 0, -(ry - rr0) - dy); g.addColorStop(0, '#8A8B91'); g.addColorStop(0.4, '#3A3B40'); g.addColorStop(1, '#141518');
    G.fillStyle = g; G.fillRect(-xe, -(ry + rr0) - dy, 2 * xe, 2 * rr0); G.strokeStyle = C.mute; G.lineWidth = lw(1); G.strokeRect(-xe, -(ry + rr0) - dy, 2 * xe, 2 * rr0);
    const kj = ep(o.rod, 0.85, 1);
    if (kj > 0.01) for (const sd of [-1, 1]) { G.globalAlpha = PA * a * kj * 0.85; G.fillStyle = rgba(C.red, 0.55); G.beginPath(); G.ellipse(sd * (xe - 0.4), -ry - dy, 1.5, 1.7, 0, 0, TAU); G.fill(); }
    G.restore();
  }
  /* the wall */
  feDraw(r, Pd, { load: sq, scale: ex, w: 1, heat: false, color: C.ink2, alpha: a * PA, hide: e => !!M.els[e].truss, seg: 6 });
  /* Theseus: the ribs' feet tied to the board's edge */
  if (o.tied > 0.003) {
    G.save(); G.globalAlpha = PA * a; G.strokeStyle = C.hero; G.lineWidth = 1.5; G.lineCap = 'round';
    for (const i of [0, M.N]) { const f = dn(i), e = [Math.sign(f[0]) * (bw - 0.4), by], q = [lerp(f[0], e[0], o.tied), lerp(f[1], e[1], o.tied)]; G.beginPath(); G.moveTo(f[0], -f[1]); G.lineTo(q[0], -q[1]); G.stroke(); }
    G.restore();
  }
}
/** the squeeze's agents on the section, in stage px: a fingertip end-on at each grip point and the force on it */
function b07_secHands(est, r, sq, o = {}) {
  const M = r.model, ex = B07_BRD.ex, sh = (r.d[0] + r.d[M.N * 3]) / 2, out = [];
  M.grip.forEach((gi, j) => {
    const sd = j === 0 ? 1 : -1, n = M.nodes[gi], x = n[0] + (r.d[gi * 3] - sh) * sq * ex + sd * 0.8, y = n[1] + r.d[gi * 3 + 1] * sq * ex, p = est.P(x, -y);
    if (o.finger > 0.003) finger(p[0], p[1], sd > 0 ? Math.PI / 2 : -Math.PI / 2, { s: est.s, view: 'end', press: sq, alpha: o.finger });
    const back = o.finger > 0.003 ? 12.5 * est.s + 8 : 6;
    if (o.k > 0.003) forceArrow(p[0] + sd * back, p[1], sd > 0 ? Math.PI : 0, o.len || 110, o.label === false ? { k: o.k } : { N: 10, dec: 0, k: o.k, side: 'end' });
    out.push(p);
  });
  return out;
}
S({
  id: 'b07_board', ch: 'shell', theme: 'night', title: 'The board you already carry', settle: 11, ideas: [94],
  replaces: ['shlPcbRib', 'shcCarry', 'shlStructs'],
  src: ['b07Fe', 'b07Fr4Wiki', 'shlFr4', 'shlMg', 'b07Sabre', 'b07Harpe', 'shlPyrofil'],
  answers: [
    ['shlPcbRib: "unintuitive"', 'One demonstration on the real shell, cut across the board\'s rear rib row, problem first: squeeze it at the grip and its feet slide inward, the sides come in 0.64 mm; the usual added part; then the board, anchored to the ribs, holds the feet and the same squeeze moves the sides 0.21 mm.'],
    ['"explain how fr4 is like carbon fiber because it\'s also a woven composite"', 'A panel sets the two weaves side by side, carbon cloth in epoxy and glass cloth in epoxy (Wikipedia, FR-4: "woven fiberglass cloth with an epoxy resin binder"), and the narration says it: carbon fibre\'s recipe, made with glass cloth.'],
    ['"using the pcb is an alternative to having carbon fiber rods in your mouse"', 'The rival fix is drawn in place: a carbon rod glued across the feet (the paid route, carbon or magnesium shells, in the narration). It leaves, and the board does its job.'],
    ['"that doesn\'t require extra parts with extra tolerancing"', 'The rod is tagged "+1 part" and "2 glued joints to hold to size" (the next slides take up tolerance); Theseus\'s result says "with no added part".'],
    ['"you\'re just using what you already have"', 'The title, and the line "the board already spans the feet": the 5.6 g board is carried anyway.'],
    ['shcCarry: "meg slide"', 'Read as "meh": the square-per-gram grid is gone. Its point, use the weight you already carry, is this slide\'s result (+0 g, no added part).'],
    ['shlStructs: "viewer will have no idea what that spec means in big blue poor setup"', 'The published N/mm figure is left out. The measurement is set up on screen instead: 10 N on each side (the weight of a 1 kg bag of sugar) and how far the sides move, in mm (six sheets of copy paper), solved for this shell.'],
    ['F2.26 (FR4 as strong as magnesium; the whole board)', 'The same weight of each pulled until it breaks: FR4 4,300 N, magnesium alloy 2,350 N, 1.8× (Gund; MatWeb, the higher magnesium figure, so the ratio is the cautious one).']
  ],
  draw: t => {
    const R = b07_squeeze(), ex = B07_BRD.ex;
    header(t, 'The board you already carry');
    captions(t, [[0.6, 'Ribs stiffen the walls, but squeeze the shell at the grip and its feet slide inward: the sides come in.'],
      [3.3, 'The usual fix adds something stiff: a carbon or magnesium shell, or a carbon rod glued across. One more part, two more joints to hold to size.'],
      [5.3, 'But the board already spans the feet, and FR4 is woven glass in epoxy: carbon fibre\'s recipe, made with glass cloth.'],
      [7.3, 'Theseus anchors its ribs on the board\'s edge, so the board holds the feet. The same squeeze moves the sides a third as far, with nothing added.']]);
    /* the stage: centred while the problem plays, then it slides left for the two panels */
    const kx = ep(t, 5.0, 5.7, E.cam), box = [lerp(LM + 220, LM, kx), lerp(286, 300, kx), lerp(1320, 980, kx), lerp(640, 600, kx)];
    const est = establish(t, 0, box, { view: 'front', hi: ['sides'], col: 'ink', focus: msBox('front'), locator: false, fade: 0.14, hold: 0.3, dur: 0.9, mouse: { alpha: 1 - 0.94 * ep(t, 0.8, 1.35) } });
    locator(t, 0.6, LM + 14, 300, 74, 'top', [-36, B07_BRD.z * -1 - 2, 72, 4]);
    const kd = est.kd;
    /* the squeeze: on at 1.6, held, off at 3.1; again at 7.0 for the comparison */
    const sq1 = ep(t, 1.6, 2.4, E.io3) * (1 - ep(t, 3.1, 3.6, E.io3)), sq2 = ep(t, 7.0, 7.6, E.io3), sq = Math.max(sq1, sq2);
    const kRod = ep(t, 3.6, 4.2, E.out3) * (1 - ep(t, 5.0, 5.4)), glow = ep(t, 5.2, 5.7) * (1 - ep(t, 7.2, 7.6) * 0.6);
    const fing = 0;   /* end-on fingertips read as ear muffs at this size: the arrows carry the squeeze */
    const scene = (r, tied) => { est.draw(() => b07_secScene(r, sq, { a: kd, rod: kRod, glow, tied })); b07_secHands(est, r, sq, { finger: fing, k: t < 5 ? ep(t, 1.6, 2.05, E.snap) * (1 - ep(t, 3.1, 3.5)) : ep(t, 7.0, 7.45, E.snap), len: t < 5 ? 110 : 76, label: t < 5 }); };
    let hands = null;
    if (t < 7.7) { scene(R.s0, 0); hands = true; }
    else wipeTo(t, 7.7, 1.0, box, () => scene(R.s0, 0), () => scene(R.s1, 1), { rival: 'The shell alone', right: 'Theseus', ly: box[1] - 4 });
    /* the board, named while the problem plays */
    { const kb = ep(t, 1.0, 1.4) * (1 - ep(t, 5.1, 5.4)); if (kb > 0.003) { const pb = est.P(b07_boardHalfW(B07_BRD.z) - 1, -(B07_BRD.by + 2.2)); text('The board', pb[0], pb[1], { role: 'label', size: 20, color: C.mute, align: 'right', alpha: kb }); } }
    /* the feet spreading, named; the rod's cost, named */
    const M0 = R.s0.model, footP = r => { const M = r.model, sh = (r.d[0] + r.d[M.N * 3]) / 2, i = 0; return est.P(M.nodes[i][0] + (r.d[i * 3] - sh) * sq * ex, -(M.nodes[i][1] + r.d[i * 3 + 1] * sq * ex)); };
    if (t >= 2.5 && t < 3.6) { const p = footP(R.s0); faultTag(t, 2.5, p, 'Feet slide in ' + fmtN(Math.floor(Math.abs(R.feet0) * 100) / 100, 2) + ' mm', { to: [p[0] + 70, p[1] - 120], side: 'r', alpha: 1 - ep(t, 3.2, 3.6) }); }
    if (kRod > 0.01) {
      const pm = est.P(0, -B07_BRD.rodY), pj = est.P(-23, -B07_BRD.rodY);
      if (t >= 4.2) faultTag(t, 4.2, [pm[0] + 60, pm[1] - 8], '+1 part: a carbon rod', { to: [pm[0] + 120, pm[1] - 250], side: 'r', alpha: kRod });
      if (t >= 4.5) faultTag(t, 4.5, [pj[0] + 6, pj[1] - 4], '2 glued joints to hold to size', { to: [pj[0] + 70, pj[1] - 170], side: 'r', alpha: kRod });
    }
    if (t >= 5.6 && t < 7.7) { const pb = est.P(-4, -(B07_BRD.by + 0.5)); fixTag(t, 5.6, pb, 'FR4: woven glass in epoxy', { to: [pb[0] + 30, pb[1] - 150], side: 'r', alpha: 1 - ep(t, 7.2, 7.6) }); }
    if (t >= 8.9) { const r = R.s1, M = r.model, f = est.P(M.nodes[M.N][0], -M.nodes[M.N][1]), bw = b07_boardHalfW(B07_BRD.z), e = est.P(bw, -B07_BRD.by), p = [(f[0] + e[0]) / 2, (f[1] + e[1]) / 2]; fixTag(t, 8.9, p, 'Ribs anchored on the board\'s edge', { to: [p[0] - 40, p[1] - 150], side: 'l' }); }
    /* phase 1, top right: how far the sides bow in, live, with its human scale */
    const kr = ep(t, 1.6, 1.9) * (1 - ep(t, 4.8, 5.1));
    if (kr > 0.003) {
      const v = R.flex0 * ep(t, 1.6, 2.4, E.io3);
      text('How far the sides come in', RM, 330, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: kr });
      rich([{ s: fmtN(v, 2), font: 'disp', size: 84, weight: 800, color: C.ink, tnum: true }, { s: 'mm', font: 'disp', size: 32, weight: 700, color: C.mute, gap: 10, caps: false }], RM, 418, { align: 'right', alpha: kr });
      if (t > 2.5) { const s6 = 'about six sheets of copy paper'; scaleNote(RM - 34 - tw(s6, { role: 'small', size: 23, weight: 600 }), 466, s6, { t, t0: 2.5, size: 23 }); }
    }
    if (t > 2.1) scaleNote(LM, 950, 'on each side: the weight of a 1 kg bag of sugar', { lead: '10 N', t, t0: 2.1, size: 23 });
    /* phase 2, the right column: the two weaves, the same-weight pull, and the result */
    const rx = LM + 1100, rw = RM - rx;
    b07_weavePanel(t, 5.3, [rx, 286, rw, 280]);
    b07_pullPanel(t, 6.3, [rx, 586, rw, 196]);
    verdict(t, 8.4, rx, 900, { from: +fmtN(R.flex0, 2), to: +fmtN(R.flex1, 2), unit: 'mm', dec: 2, label: 'How far the sides come in', better: 'lower', size: 96, netWord: 'with no added part', maxW: rw });
    source(t, 'Solved here: the 3D shell cut at the board\'s rear rib row (CF-PP), its feet tied by the rim, or by rim and board; 10 N a side, drawn ' + ex + '× real. Peak wall stress +9 % (17.3 of 120 MPa).', { t0: 2.2 });
  }
});

/* ============================== 2. b07_arms: Small arms snap, the whole board holds ==============================
   Brock (shcArms, 6/10): "these aren't what the arms or pcb would look like, important idea tho"; F2.26, F6.3 (the arms on
   his HTS Ultra broke in shipping), F28.3 (his two G-Wolves photos). The plan frame (model 1) under one squeeze, 10 N on
   each side over the board: six small arms where G-Wolves puts them against every rib tied to the board's own edge, the
   FR4 coloured by its stress on one scale. The arm, edge on: a fixed-guided FR4 tab 6.5 mm long and 1.0 mm thick (its
   length estimated from the photo): σ = 3·E·h·δ / L², so 0.36 mm at its tip takes its root to 483 MPa (Gund, crosswise
   flexural). Only the squeeze is modelled on both; the drop is shown on the arm alone. */
const B07_ARM = { L: 6.5, h: 1.0, E: 19000, sf: 483 };
B07_ARM.perMM = 3 * B07_ARM.E * B07_ARM.h / (B07_ARM.L * B07_ARM.L);
B07_ARM.snap = B07_ARM.sf / B07_ARM.perMM;
/** the board's outline in the top view's frame (key plan: x as given, y = −z) */
function b07_boardPathKey() { const B = b07_boardOut(); G.beginPath(); B.forEach((p, i) => i ? G.lineTo(p[0], -p[1]) : G.moveTo(p[0], -p[1])); G.closePath(); }
/** the board as a plate, in mm in the current transform: mask, a gold edge, a few traces */
function b07_boardPlate(a, o = {}) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = PA * a;
  b07_boardPathKey(); G.fillStyle = MT.mask.g[0]; G.fill();
  G.save(); b07_boardPathKey(); G.clip(); G.strokeStyle = 'rgba(255,255,255,0.07)'; G.lineWidth = lw(1.2);
  G.beginPath(); for (const [x0, y0, x1, y1] of [[-14, -40, -14, -2], [-14, -2, -6, 6], [9, -44, 9, -12], [9, -12, 15, -6], [-4, -30, 6, -30], [-8, -18, 8, -18]]) { G.moveTo(x0, y0); G.lineTo(x1, y1); } G.stroke();
  G.restore();
  b07_boardPathKey(); G.strokeStyle = o.edge || MT.brass.g[1]; G.lineWidth = lw(o.ew || 1.6); G.stroke();
  G.restore();
}
/** one rival arm drawn over its solved beam, as on G-Wolves boards: a square root at the board, silkscreen corner marks at
   the tip, a locating hole in the middle one. (x0, y0) its root, (x1, y1) its tip, in mm; w its width */
function b07_armDetail(x0, y0, x1, y1, w, a, o = {}) {
  if (a <= 0.003) return;
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy * w / 2, ny = ux * w / 2;
  G.save(); G.globalAlpha = PA * a; G.strokeStyle = C.second; G.lineWidth = lw(1.6); G.lineJoin = 'miter';
  G.beginPath(); G.moveTo(x0 + nx, y0 + ny); G.lineTo(x1 + nx, y1 + ny); G.lineTo(x1 - nx, y1 - ny); G.lineTo(x0 - nx, y0 - ny); G.stroke();
  /* silkscreen corner marks near the tip */
  G.strokeStyle = 'rgba(255,255,255,0.7)'; G.lineWidth = lw(1.1); const tx = x1 - ux * 1.2, ty = y1 - uy * 1.2, m = 0.7;
  for (const sd of [1, -1]) { const cxp = tx + sd * nx * 0.62, cyp = ty + sd * ny * 0.62; G.beginPath(); G.moveTo(cxp - ux * m, cyp - uy * m); G.lineTo(cxp, cyp); G.lineTo(cxp - sd * nx / (w / 2) * m, cyp - sd * ny / (w / 2) * m); G.stroke(); }
  if (o.hole) { G.beginPath(); G.arc(x1 - ux * 2.4, y1 - uy * 2.4, 0.6, 0, TAU); G.fillStyle = C.bg; G.fill(); G.strokeStyle = MT.brass.g[1]; G.lineWidth = lw(1); G.stroke(); }
  G.restore();
}
/** the close-up from Brock's photo: the board's long edge, three narrow tabs reaching under the shell's rim */
function b07_gwTile(t, t0, r) {
  const [x, y, w, h] = r, a = ep(t, t0, t0 + 0.5); if (a <= 0.003) return;
  demoWindow(x, y, w, h, a);
  text('G-Wolves, drawn from Brock\'s photo', x + 28, y + 42, { role: 'label', size: 21, color: C.secondText, alpha: a });
  text('Narrow FR4 tabs, square at the root, under the rim', x + 28, y + 72, { role: 'small', size: 22, weight: 600, color: C.mute, alpha: a, maxW: w - 56 });
  const by = y + h - 44, ry = y + 106, rimH = 30, mask = MT.mask.g[0], rim = TH ? MT.shell.g[0] : C.comp2;
  G.save(); G.globalAlpha = a;
  /* the shell's rim: a black band with its row of small round holes, the lattice beyond it */
  rrPath(x + 20, ry, w - 40, rimH, 4); G.fillStyle = rim; G.fill();
  G.fillStyle = C.panel; for (let k = x + 44; k < x + w - 40; k += 22) { G.beginPath(); G.arc(k, ry + rimH / 2, 3.2, 0, TAU); G.fill(); }
  /* the board along the bottom: mask, a few traces and pads */
  rrPath(x + 20, by - 52, w - 40, 60, 3); G.fillStyle = mask; G.fill();
  G.strokeStyle = 'rgba(255,255,255,0.08)'; G.lineWidth = 1.4; G.beginPath(); for (let k = 0; k < 5; k++) { G.moveTo(x + 40 + k * 120, by - 10); G.lineTo(x + 90 + k * 120, by - 40); G.lineTo(x + 150 + k * 120, by - 40); } G.stroke();
  G.fillStyle = MT.brass.g[1]; for (let k = 0; k < 9; k++) G.fillRect(x + 60 + k * 66, by - 22, 7, 5);
  G.strokeStyle = MT.brass.g[1]; G.lineWidth = 1.6; G.beginPath(); G.moveTo(x + 20, by - 52); G.lineTo(x + w - 20, by - 52); G.stroke();
  G.restore();
  /* three tabs: narrow, square at the root, reaching under the rim; the middle one with its hole */
  const tabs = [x + w * 0.22, x + w * 0.5, x + w * 0.78], tw2 = 34;
  tabs.forEach((cx2, i) => {
    const ka = a * stagger(t, t0 + 0.3, i, 0.12, 0.4), x0 = cx2 - tw2 / 2, top = ry + rimH * 0.45, bot = by - 52;
    if (ka <= 0.003) return;
    G.save(); G.globalAlpha = ka; G.fillStyle = mask; G.fillRect(x0, top, tw2, bot - top + 1);
    G.strokeStyle = C.second; G.lineWidth = 2; G.beginPath(); G.moveTo(x0, bot); G.lineTo(x0, top); G.lineTo(x0 + tw2, top); G.lineTo(x0 + tw2, bot); G.stroke();
    G.strokeStyle = 'rgba(255,255,255,0.75)'; G.lineWidth = 1.5; G.beginPath(); G.moveTo(x0 + 5, top + 14); G.lineTo(x0 + 5, top + 9); G.lineTo(x0 + 10, top + 9); G.moveTo(x0 + tw2 - 5, top + 14); G.lineTo(x0 + tw2 - 5, top + 9); G.lineTo(x0 + tw2 - 10, top + 9); G.stroke();
    if (i === 1) { G.beginPath(); G.arc(cx2, top + 30, 6, 0, TAU); G.fillStyle = C.panel; G.fill(); G.strokeStyle = MT.brass.g[1]; G.lineWidth = 1.5; G.stroke(); }
    G.restore();
  });
  /* the rim passes over the tabs' tips */
  G.save(); G.globalAlpha = a * 0.92; rrPath(x + 20, ry, w - 40, rimH * 0.45, 3); G.fillStyle = rim; G.fill(); G.restore();
  /* the square roots, marked where the tabs leave the board */
  const kr2 = ep(t, t0 + 0.9, t0 + 1.3) * a;
  if (kr2 > 0.003) tabs.forEach(cx2 => { for (const sd of [-1, 1]) { const qx = cx2 + sd * tw2 / 2, qy = by - 52; circle(qx, qy, 5, { fill: C.red, alpha: kr2 }); circle(qx, qy, 10, { color: C.red, w: 1.5, alpha: kr2 * 0.45 }); } });
}
/** one arm edge on, in a jolt: the board holds its root, the shell's rim its tip; d = the tip's movement (mm) */
function b07_armEdge(t, r, d, crack, a) {
  const [x, y, w, h] = r; if (a <= 0.003) return;
  demoWindow(x, y, w, h, a);
  text('One arm, edge on, in a jolt', x + 28, y + 40, { role: 'label', size: 21, color: C.mute, alpha: a });
  const s = 22, ex = 9, L = B07_ARM.L * s, th = B07_ARM.h * s, x0 = x + 120, yc = y + 74, dd = d * s * ex, sig = d * B07_ARM.perMM;
  const ys = u => yc + dd * (3 * u * u - 2 * u * u * u);
  G.save(); G.globalAlpha = a;
  /* the board (it holds the root) and the rim (it holds the tip and moves) */
  rrPath(x0 - 70, yc - 26, 70, 52, 4); G.fillStyle = MT.mask.g[0]; G.fill();
  const broke = crack >= 1;
  rrPath(x0 + L - 2, ys(1) - 22, 64, 44, 4); G.fillStyle = TH ? MT.shell.g[0] : C.comp2; G.fill(); G.strokeStyle = inkA(0.25); G.lineWidth = 1.2; G.stroke();
  /* the arm: its centre line bent as a fixed-guided beam, coloured by the root's stress */
  const k = clamp(sig / B07_ARM.sf), col = heatCol(k);
  G.lineCap = 'butt'; G.strokeStyle = col; G.lineWidth = th; G.beginPath();
  const u0 = broke ? 0.04 : 0; for (let i = 0; i <= 30; i++) { const u = u0 + (1 - u0) * i / 30, px = x0 + L * u; i ? G.lineTo(px, ys(u) + (broke ? 6 : 0)) : G.moveTo(px, ys(u) + (broke ? 6 : 0)); } G.stroke();
  if (broke) { G.strokeStyle = heatCol(1); G.lineWidth = th; G.beginPath(); G.moveTo(x0, yc); G.lineTo(x0 + L * 0.03, yc); G.stroke(); }
  G.restore();
  if (crack > 0) { const pts = []; for (let j = 0; j <= 6; j++) pts.push([x0 + L * 0.035 + (j % 2 ? 3 : -2), yc - th / 2 + th * j / 6 * crack]); poly(pts, { color: C.red, w: 3, alpha: a }); }
  /* the counters: the tip's movement and the root's stress */
  const rx = x + w - 28;
  rich([{ s: fmtN(d, 2), font: 'disp', size: 40, weight: 800, color: C.ink, tnum: true }, { s: 'mm at the tip', role: 'label', size: 19, color: C.mute, gap: 10 }], rx, y + 92, { align: 'right', alpha: a });
  rich([{ s: fmtN(Math.min(sig, B07_ARM.sf), 0), font: 'disp', size: 40, weight: 800, color: k >= 1 ? C.red : C.ink, tnum: true }, { s: 'MPa at the root', role: 'label', size: 19, color: k >= 1 ? C.red : C.mute, gap: 10 }], rx, y + 146, { align: 'right', alpha: a });
  text('Bend drawn 9× real', x + w - 28, y + 40, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: a });
}
S({
  id: 'b07_arms', ch: 'shell', theme: 'paper', title: 'Small arms snap, the whole board holds', settle: 11, ideas: [94],
  replaces: ['shcArms'],
  src: ['b07Fe', 'shcTpuHati', 'shcTpuHatiR', 'b07GwPhoto', 'shlFr4', 'shcFr4Flex'],
  answers: [
    ['"these aren\'t what the arms or pcb would look like"', 'Drawn from his two photos: narrow FR4 tabs on the board\'s long edge, square at the root, silkscreen corner marks at the tips and a locating hole in one, reaching under the shell\'s rim (a close-up tile), placed along the board where G-Wolves puts them (52, 68 and 84 % back from its front) in the top view.'],
    ['"important idea tho"', 'Kept and led with the failure he lived: a jolt snaps the hottest arm at its root, and the edge-on arm shows how little it takes (0.36 mm at the tip of a 6.5 mm tab, 483 MPa at the root).'],
    ['F2.26 (small FR4 arms easy to snap; THE WHOLE PCB)', 'Theseus ties every rib along the board\'s own edge: no tab, and the same squeeze reaches its FR4 at a fifth of the peak (4.7 → 1.0 MPa, derived).'],
    ['F6.3, F28.3 (his HTS Ultra\'s arms broke in shipping; his photos)', 'Said in the narration; the photos are the drawing\'s reference (drawn, not shown, F34.1).'],
    ['F33.5', 'One of his important ideas: a full demonstration with the problem first.']
  ],
  draw: t => {
    const R = b07_plan(), Ca = R.arms, Cw = R.whole;
    header(t, 'Small arms snap, the whole board holds');
    captions(t, [[0.6, 'G-Wolves had the right idea: use the board to stiffen the shell. But it reaches the shell through a few small FR4 arms.'],
      [3.0, 'Every squeeze funnels through their roots, and a jolt in shipping snapped the arms on my HTS Ultra.'],
      [5.2, 'Theseus ties every rib to the board\'s own edge. No tab to snap, and the same squeeze reaches its FR4 at a fifth of the peak.']]);
    /* ---------- the main view: the whole mouse from above, then onto the board ---------- */
    const jolt = t > 2.9 ? Math.exp(-(t - 2.9) * 7) * Math.sin((t - 2.9) * 38) * 9 : 0;
    const box = [LM, 286, 1000, 650];
    const est = establish(t, 0.1, [box[0], box[1] + jolt, box[2], box[3]], { view: 'top', hi: ['board'], col: 'ink', focus: [-36, -54, 72, 72], dur: 1.1, locator: 'tl', fade: 0.55 });
    const kd = est.kd, P = q => [q[0], -q[1]];
    const squeeze = ep(t, 1.95, 2.5, E.snap), wipeK = ep(t, 4.7, 5.6, E.cam);
    const exag = 150, smax = Ca.fr4;
    const drawCase = (c, hero) => est.draw(() => {
      /* inside the camera the canvas is in mm (the key plan's frame): P maps the model's [x, z] to it */
      const r = c.r, M = r.model, only = part => e => M.els[e].part !== part, px = 1 / Math.max(1e-6, est.s);
      b07_boardPlate(kd);
      if (kd <= 0.01) return;
      /* the rim (CF-PP), neutral, at its true width; the board's FR4 by heat (thin lines over the plate); the ties: the
         rival's arms (FR4, by heat, their true width), Theseus's ribs (blue) */
      feDraw(r, P, { load: squeeze, scale: exag, smax, alpha: kd, hide: only('ring'), heat: false, color: C.comp, w: 1 });
      void px;   /* the board's FR4 stays under a quarter of the arms' peak in both cases: the plate alone says it */
      const snapped = !hero && t >= 3.35 && c.hot, hotE = snapped ? c.hot.e : -1;
      if (!hero) feDraw(r, P, { load: squeeze, scale: exag, smax, alpha: kd, hide: e => M.els[e].part !== 'arm' || e === hotE, w: 1 });
      if (snapped) {
        /* the snapped arm: free of the board at its root, hanging from the rim, still red where it broke */
        const b = P(M.nodes[c.hot.board]), g = P(M.nodes[c.hot.ring]), dx = g[0] - b[0], dy = g[1] - b[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, fall = ep(t, 3.35, 3.8, E.out3);
        const ang = 0.18 * fall * (b[1] < 0 ? -1 : 1), gap = 0.9 * fall, w2 = B07_PLAN.armW / 2;
        G.save(); G.globalAlpha = PA * kd; G.translate(g[0], g[1]); G.rotate(ang); G.translate(-g[0], -g[1]);
        G.beginPath(); G.moveTo(b[0] + ux * gap - uy * w2, b[1] + uy * gap + ux * w2); G.lineTo(g[0] - uy * w2, g[1] + ux * w2); G.lineTo(g[0] + uy * w2, g[1] - ux * w2); G.lineTo(b[0] + ux * gap + uy * w2, b[1] + uy * gap - ux * w2); G.closePath();
        G.fillStyle = heatCol(1); G.fill(); G.restore();
      }
      else feDraw(r, P, { load: squeeze, scale: exag, smax, alpha: kd, hide: only('rib'), heat: false, color: C.hero, w: 1.3, seg: 1 });
      if (!hero) M.links.forEach((l, i) => b07_armDetail(...P(M.nodes[l.board]), ...P(M.nodes[l.ring]), B07_PLAN.armW, kd * 0.9, { hole: i % 3 === 1 }));
    });
    wipeTo(t, 4.7, 0.9, box, () => drawCase(Ca, false), () => drawCase(Cw, true), { rival: 'G-Wolves arms', right: 'Theseus, every rib' });
    /* the squeeze: two fingers on the sides over the board, 10 N each */
    { const ka = ep(t, 1.7, 2.0) * kd, z = B07_PLAN.sqZ, hw = msHalfW ? msHalfW(-z) : 30.5;
      if (ka > 0.003) {
        const pl = est.P(-hw - 0.4, -z), pr = est.P(hw + 0.4, -z), push = squeeze * 6;
        finger(pl[0] + push, pl[1], 0, { s: est.s, view: 'top', press: squeeze, alpha: ka, len: 20 });
        finger(pr[0] - push, pr[1], Math.PI, { s: est.s, view: 'top', press: squeeze, alpha: ka, len: 20 });
        forceArrow(pl[0] - 46 + push, pl[1] - 92, 0, 90, { N: 10, k: squeeze, alpha: ka, side: 'end', dec: 0 });
        forceArrow(pr[0] + 46 - push, pr[1] - 92, Math.PI, 90, { N: 10, k: squeeze, alpha: ka, side: 'end', dec: 0 });
      } }
    /* the hot arm: its root cracks in the jolt */
    if (t < 4.75 && Ca.hot) {
      const M = Ca.r.model, l = Ca.hot, b = M.nodes[l.board], g = M.nodes[l.ring], pb = est.P(...P(b)), pg = est.P(...P(g)), ux = (pg[0] - pb[0]), uy = (pg[1] - pb[1]), Lp = Math.hypot(ux, uy) || 1, nx = -uy / Lp, ny = ux / Lp;
      const kc = ep(t, 3.05, 3.35, E.out3), root = [pb[0] + ux / Lp * 4, pb[1] + uy / Lp * 4], half = B07_PLAN.armW / 2 * est.s + 4;
      if (kc > 0) poly([[root[0] - nx * half, root[1] - ny * half], [root[0] + 3, root[1] + 2], [root[0] - 2, root[1] - 1], [root[0] + nx * half * (2 * kc - 1), root[1] + ny * half * (2 * kc - 1)]], { color: C.red, w: 3.6, alpha: kd });
      if (kc > 0) { circle(root[0], root[1], 16 + 10 * kc, { color: C.red, w: 2, alpha: kd * 0.6 * (1 - ep(t, 3.6, 4.4)) }); }
    }
    /* ---------- the right column: the photo's tabs, the arm in a jolt, the verdict ---------- */
    const rx = LM + 1040, rw = RM - rx;
    b07_gwTile(t, 0.4, [rx, 286, rw, 252]);
    const dJ = B07_ARM.snap * ep(t, 2.9, 3.3, E.in3), crackJ = ep(t, 3.3, 3.5);
    b07_armEdge(t, [rx, 560, rw, 196], dJ, crackJ, ep(t, 2.6, 3.0));
    if (t > 3.6) scaleNote(rx, 790, 'about three sheets of copy paper', { lead: fmtN(B07_ARM.snap, 2) + ' mm', t, t0: 3.6, size: 23 });
    verdict(t, 6.0, rx, 914, { from: +fmtN(Ca.fr4, 1), to: +fmtN(Cw.fr4, 1), unit: 'MPa', dec: 1, label: 'Peak experienced stress in the board', better: 'lower', size: 88, maxW: rw });
    source(t, '2D frames solved here: CF-PP rim (13.5 GPa), plan-5 board in 1.0 mm FR4 (19 GPa), 10 N a side; arms 3.8 × 6.5 mm FR4 (length from the photo), ribs CF-PP. Squeeze ' + exag + '× real.', { t0: 2.2 });
  }
});

/* ============================== 3. b07_tolerance: Tolerance stack-up ==============================
   Brock (tolerance, 7/10): "needs to be explained with some sort of law for more validity, don't show the theseus teardown,
   improve the diagram, the little drops should be simplified mouse parts, explain how one incorrectly tolerances mouse part
   ruins a whole mouse so this is more important than it looks". The classroom version first: coins stacked in a gauge, each
   a little off (stacked coins, F33.8); the law written on the stack (Scholz 1995: worst case, and the likely root sum of
   squares); one sloppy coin owning most of the spread. Then the coins become the parts around one seam of a shell, and three
   builds of 2,400 mice drop into the seam gap's histogram as tiny simplified mice: four shell parts (as the Starlight was,
   Back2Gaming), the same with one part off (a worn tool), and Theseus, whose rim, hump and sides are one body (#57), so a
   seam closes through two parts at most (a trigger in the body). Each part ±0.076 mm (Protolabs), the gap's allowance
   ±0.10 mm (an example: one sheet of paper). */
const B07_TOLV = {
  coinS: 13.2,                 /* px per mm for the coins: a quarter 320 px across */
  thPx: 23,                    /* a coin's drawn thickness */
  step: 9,                     /* px of drawn error per ±T (exaggerated: a coin is off by hundredths of a mm) */
  trials: 14, badK: B07_TOL.bad / B07_TOL.T
};
/** the coins' errors in units of T for trial j (seeded; the bad coin, index 2, scaled by badK once it is in) */
function b07_coinErr(j, bad) {
  const r = rng(101 + j * 7), g = () => { const u = Math.max(1e-9, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); };
  return [0, 1, 2, 3].map(i => clamp(g() / 3, -1, 1) * (bad && i === 2 ? B07_TOLV.badK : 1));
}
S({
  id: 'b07_tolerance', ch: 'shell', theme: 'night', title: 'Tolerance stack-up', settle: 12.5, ideas: [57],
  replaces: ['tolerance'],
  src: ['b07Scholz', 'b07Shraim', 'b07Protolabs', 'shlB2gSlx', 'shlDoc'],
  answers: [
    ['"needs to be explained with some sort of law for more validity"', 'The law is written under the coin stack and drawn on it: worst case T₁ + T₂ + T₃ + T₄ (every part at its limit, a dashed bracket) and the likely root sum of squares √(T₁² + … + T₄²) (a solid bracket), sourced to Scholz 1995 (Boeing), the assumptions in the source line.'],
    ['"don\'t show the theseus teardown"', 'No exploded Theseus anywhere: coins, small slabs standing for the parts round one seam, and tiny generic simplified mice.'],
    ['"improve the diagram"', 'One stack carries the law; copies of its coins fly into the build line as the parts round a seam; three histograms of 24,000 built mice on one scale, the allowance band, and the share out under each.'],
    ['"the little drops should be simplified mouse parts"', 'Every drop is a tiny simplified mouse (the kit\'s outline) falling into its bin, red when its seam misses; the parts stack above each build drops in from the coins.'],
    ['"explain how one incorrectly tolerances mouse part ruins a whole mouse so this is more important than it looks"', 'A sloppy coin swaps into the stack and owns 78 % of the spread (its T² over the sum); on the build line the same four parts with one off (a worn tool) send about 28 % of mice out of the allowance, against about 5 % with all four good.'],
    ['"you\'re on the right track here you just need to improve your execution"', 'Kept the seam and the part-count argument (#57; the Starlight X went from four parts to three), rebuilt as a demonstration: the law, the classroom version, a build line, one verdict.'],
    ['F33.5 (important, executed better)', 'A 12.5 s dense demonstration with most of the stage.'],
    ['F33.8 (stacked coins)', 'The classroom version is stacked coins in a gauge, the law drawn on the stack.']
  ],
  draw: t => {
    const TOL = b07_tol(), T = B07_TOL.T, Sx = B07_TOL.S, V = B07_TOLV, outF = k => TOL[k].mcOut, oneIn = v => Math.round(1 / Math.max(1e-9, v));
    header(t, 'Tolerance stack-up');
    captions(t, [[0.6, 'Every part comes out a little off its drawing. Stack parts and their errors add up, like coins in a stack.'],
      [3.0, 'One sloppy part owns most of the spread. The others can be perfect, and the seam still misses.'],
      [5.4, 'Four shell parts: 1 mouse in ' + oneIn(outF('four')) + ' misses a seam\'s allowance. Rim, hump and sides in one body: 1 in ' + oneIn(outF('two')) + '.']]);
    /* ---------------- the classroom version: coins in a gauge (left), the law and where the stack lands (right) ---------------- */
    /* frame one already shows the subject: the gauge in its panel with two coins in it; the other two drop in */
    const pan = [LM, 292, 600, 668], inner = demoPanel(t, -1, pan, { src: 'Scholz 1995' });
    const cx = pan[0] + 268, base = pan[1] + 360, cs = 14.6, thPx = 30, step = 11;
    const nom = base - 4 * thPx, kg = 1;
    rect(cx - 196, base, 392, 6, { fill: TH ? C.comp : C.comp2, alpha: kg });
    line(cx - 190, nom, cx + 182, nom, { color: C.faint, w: 1.5, dash: [6, 5], alpha: kg });
    text('Nominal', cx + 236, nom + 7, { role: 'label', size: 19, color: C.faint, alpha: kg });
    const tDrop = [-1, -1, 0.35, 0.75], tTr0 = 1.75, tTrD = 0.11, tBad = 2.95, tTr1 = 3.25, nTr = V.trials;
    let errs = [0, 0, 0, 0];
    const bad = t >= tBad + 0.25;
    if (t >= tTr0 && t < tBad) errs = b07_coinErr(Math.min(nTr - 1, Math.floor((t - tTr0) / tTrD)), false);
    else if (t >= tTr1) errs = b07_coinErr(100 + Math.min(nTr - 1, Math.floor((t - tTr1) / tTrD)), true);
    else if (t >= tBad) errs = b07_coinErr(nTr - 1, false).map((e, i) => i === 2 ? e * lerp(1, V.badK, ep(t, tBad, tBad + 0.25)) : e);
    let y = base; const tops = [], ths = [];
    for (let i = 0; i < 4; i++) {
      const th = thPx + errs[i] * step, ld = spring(t, tDrop[i], { f: 3.2, z: 0.55 }), drop = (1 - ld) * 240, swap = i === 2 && t >= tBad && t < tBad + 0.25;
      if (t >= tDrop[i] - 0.05) b07_coin(cx, y - drop, cs, th, { bad: bad && i === 2, a: ep(t, tDrop[i] - 0.05, tDrop[i] + 0.1) * (swap ? 1 - 0.6 * Math.sin(prog(t, tBad, tBad + 0.25) * Math.PI) : 1) });
      tops.push(y - th); ths.push(th); y -= th;
    }
    const top = y, kt = ep(t, tTr0, tTr0 + 0.2), kb = ep(t, tTr1, tTr1 + 0.8);
    if (kt > 0.003) line(cx - 182, top, cx + 182, top, { color: C.ink2, w: 2.5, alpha: kt });
    /* the law on the stack: the worst case (dashed) and the likely spread (solid), as brackets at the stack's top */
    const kw = ep(t, 1.1, 1.5), kr = ep(t, 1.5, 1.9), wcPx = 4 * step, rsPx = 2 * step, rsBad = Math.sqrt(3 + V.badK * V.badK) * step;
    b07_bracket(cx + 202, nom - wcPx, nom + wcPx, C.mute, kw, null, { dir: 1, dash: [5, 4] });
    b07_bracket(cx + 222, nom - lerp(rsPx, rsBad, kb), nom + lerp(rsPx, rsBad, kb), bad ? C.red : C.ink, kr, null, { dir: 1, w: 2.5 });
    if (t >= 3.6) { const p = [cx - 178, tops[2] + ths[2] * 0.5]; faultTag(t, 3.6, p, 'One sloppy part: ' + Math.round(TOL.bad.share[3] * 100) + ' % of the spread', { to: [cx - 70, pan[1] + 112], elbow: cx - 204, side: 'r', prose: true, maxW: 300 }); }
    /* the formulas: big on the stage while the coins play, then they settle into the panel as the build line comes in */
    const kf = ep(t, 4.5, 5.25, E.cam), fs = lerp(50, 30, kf), fBig = [LM + 700, 380], fSmall = [inner[0], base + 92];
    const fxp = lerp(fBig[0], fSmall[0], kf), fyp = lerp(fBig[1], fSmall[1], kf), gapY = lerp(96, 54, kf), ls = lerp(24, 20, kf), ns = lerp(30, 24, kf);
    const rsOld = '±' + fmtN(TOL.four.rss, 2) + ' mm', rsNew = '±' + fmtN(TOL.bad.rss, 2) + ' mm';
    rich([{ s: 'Worst case', role: 'label', size: ls, color: C.mute }, { s: 'T₁ + T₂ + T₃ + T₄', font: 'disp', size: fs, weight: 700, color: C.ink2, gap: 16, caps: false },
      { s: '±' + fmtN(TOL.four.wc, 2) + ' mm', role: 'num', size: ns, color: C.mute, gap: 18 }], fxp, fyp, { alpha: kw });
    const rl = rich([{ s: 'Likely', role: 'label', size: ls, color: C.mute }, { s: '√(T₁² + T₂² + T₃² + T₄²)', font: 'disp', size: fs, weight: 700, color: C.ink, gap: 16, caps: false },
      { s: kb > 0.5 ? rsNew : rsOld, role: 'num', size: ns, color: kb > 0.5 ? C.red : C.ink2, gap: 18 }], fxp, fyp + gapY, { alpha: kr });
    if (kb > 0.5) { const xo = rl.x0 + rl.w + 16; text(rsOld, xo, fyp + gapY, { role: 'num', size: ns * 0.8, color: C.faint, alpha: kr * ep(t, tTr1 + 0.4, tTr1 + 0.8) }); line(xo - 2, fyp + gapY - ns * 0.26, xo + tw(rsOld, { role: 'num', size: ns * 0.8 }) + 2, fyp + gapY - ns * 0.26, { color: C.faint, w: 2, alpha: kr * ep(t, tTr1 + 0.4, tTr1 + 0.8) }); }
    text('Each part ±' + fmtN(T, 3) + ' mm, a good mould\'s tolerance (Protolabs). Coins drawn thick: real errors are hundredths of a millimetre.', fxp, fyp + gapY + lerp(56, 44, kf), { role: 'small', size: lerp(25, 22, kf), weight: 560, color: C.faint, maxW: lerp(1000, inner[2], kf), lh: 1.3, alpha: kr });
    /* where every rebuilt stack's top lands, trial after trial: the likely band holds most of them, the sloppy coin spreads them */
    const kpl = ep(t, 0.7, 1.1) * (1 - ep(t, 4.4, 4.9));
    if (kpl > 0.003) {
      const px0 = LM + 700, py0 = 640, pw2 = 1000, ph2 = 270, Yv = v => py0 + ph2 / 2 - v / 0.42 * (ph2 / 2), Xv = j => px0 + 70 + j * (pw2 - 110) / (2 * nTr - 1);
      text('Where the stack\'s top lands, stack after stack', px0, py0 - 18, { role: 'label', size: 21, color: C.mute, alpha: kpl });
      G.save(); G.globalAlpha = kpl; G.fillStyle = inkA(TH ? 0.06 : 0.08); G.fillRect(px0 + 60, Yv(TOL.four.rss), pw2 - 60, Yv(-TOL.four.rss) - Yv(TOL.four.rss)); G.restore();
      for (const v of [TOL.four.wc, -TOL.four.wc]) line(px0 + 60, Yv(v), px0 + pw2, Yv(v), { color: C.mute, w: 1.5, dash: [6, 5], alpha: kpl });
      line(px0 + 60, Yv(0), px0 + pw2, Yv(0), { color: C.faint, w: 1, alpha: kpl * 0.6 });
      text('Worst case', px0 + pw2, Yv(TOL.four.wc) - 10, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: kpl });
      text('Likely', px0 + pw2, Yv(TOL.four.rss) + 26, { role: 'label', size: 19, color: C.ink2, align: 'right', alpha: kpl });
      for (const v of [-0.3, 0, 0.3]) text((v > 0 ? '+' : v < 0 ? '−' : '') + fmtN(Math.abs(v), 1), px0 + 46, Yv(v) + 7, { role: 'tick', size: 19, color: C.faint, align: 'right', alpha: kpl });
      text('{mm}', px0, Yv(0.42) + 4, { role: 'tick', size: 19, color: C.faint, alpha: kpl });
      const n0 = t < tBad ? Math.min(nTr, Math.floor((t - tTr0) / tTrD) + 1) : nTr, n1 = t >= tTr1 ? Math.min(nTr, Math.floor((t - tTr1) / tTrD) + 1) : 0;
      for (let j = 0; j < n0; j++) circle(Xv(j), Yv(b07_coinErr(j, false).reduce((a2, b2) => a2 + b2, 0) * T), 7, { fill: C.ink2, alpha: kpl });
      for (let j = 0; j < n1; j++) circle(Xv(nTr + j), Yv(b07_coinErr(100 + j, true).reduce((a2, b2) => a2 + b2, 0) * T), 7, { fill: C.red, alpha: kpl });
      if (n1) text('With the sloppy part', Xv(nTr), Yv(-0.42) + 24, { role: 'label', size: 19, color: C.red, alpha: kpl * ep(t, tTr1, tTr1 + 0.3) });
    }
    /* ---------------- the build line: 24,000 mice a build, the drops tiny simplified mice ---------------- */
    const R0 = [LM + 640, 292, RM - LM - 640, 396], builds = [
      { key: 'four', name: 'Four shell parts', sub: 'As the Starlight was', t0: 5.25, col: C.comp, tc: C.ink, slabs: ['n', 'n', 'n', 'n'] },
      { key: 'bad', name: 'One part off', sub: 'A worn tool: ±' + fmtN(B07_TOL.bad, 2) + ' mm', t0: 6.4, col: C.comp, tc: C.red, slabs: ['n', 'n', 'b', 'n'] },
      { key: 'two', name: 'Theseus', sub: 'Rim, hump and sides one body', t0: 7.55, col: C.hero, tc: C.heroText, hero: true, slabs: ['h', 'h'] }
    ];
    const pw = (R0[2] - 2 * 40) / 3, bins = 27, lo = -0.405, hi = 0.405, bw = (hi - lo) / bins, baseY = R0[1] + 300, maxH = 168, cmax = B07_TOL.n * 0.46;
    builds.forEach((b, bi) => {
      const ox = R0[0] + bi * (pw + 40), a = ep(t, b.t0 - 0.4, b.t0 - 0.05), g = TOL[b.key].g;
      if (a <= 0.003) return;
      demoWindow(ox, R0[1], pw, R0[3], a);
      text(b.name, ox + 24, R0[1] + 44, { role: 'label', size: 21, color: b.tc, alpha: a });
      text(b.sub, ox + 24, R0[1] + 74, { role: 'small', size: 22, weight: 600, color: C.mute, alpha: a, maxW: pw - 48 });
      /* the parts round the seam: slabs that dropped in from the coins (the first build's fly from the stack) */
      const sx = ox + pw - 24 - 86, sy0 = baseY + 46;
      b.slabs.forEach((k2, j) => {
        const n2 = b.slabs.length, sh = 9, sg = 4, yy = sy0 + (4 - n2) * (sh + sg) + j * (sh + sg), la = bi === 0 ? spring(t, 4.7 + j * 0.1, { f: 2.6, z: 0.7 }) : spring(t, b.t0 - 0.3 + j * 0.08, { f: 3, z: 0.6 });
        const from = bi === 0 ? [cx - 182, tops[3 - j] + 2] : [sx, yy - 30], px = lerp(from[0], sx, la), py = lerp(from[1], yy, la), wd = bi === 0 ? lerp(364, 86, la) : 86;
        if (la <= 0.003) return;
        rr(px, py, wd, sh, 3, k2 === 'h' ? C.hero : k2 === 'b' ? C.red : (TH ? C.comp : C.mute), null, 0, Math.min(a, clamp(la * 3)));
      });
      const X = v => ox + 24 + (pw - 48) * (v - lo) / (hi - lo);
      G.save(); G.globalAlpha = a * 0.9; G.fillStyle = inkA(TH ? 0.06 : 0.08); G.fillRect(X(-Sx), baseY - maxH - 4, X(Sx) - X(-Sx), maxH + 4); G.restore();
      if (bi === 0) text('Allowance ±0.10', X(0), baseY - maxH - 12, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: a });
      line(ox + 24, baseY, ox + pw - 24, baseY, { color: C.faint, w: 1.5, alpha: a });
      for (const v of [-0.3, 0, 0.3]) text((v > 0 ? '+' : v < 0 ? '−' : '') + fmtN(Math.abs(v), 1), X(v), baseY + 28, { role: 'tick', size: 19, color: C.faint, align: 'center', alpha: a });
      const fill = ep(t, b.t0, b.t0 + 1.5, E.lin), shown = Math.floor(g.length * fill), cnt = new Array(bins).fill(0), bad2 = new Array(bins).fill(0);
      let outN = 0;
      for (let i = 0; i < shown; i++) { const k = Math.floor((g[i] - lo) / bw); const o2 = Math.abs(g[i]) > Sx; if (o2) outN++; if (k >= 0 && k < bins) { cnt[k]++; if (o2) bad2[k]++; } }
      for (let k = 0; k < bins; k++) {
        if (!cnt[k]) continue;
        const h = maxH * cnt[k] / cmax, hb = maxH * bad2[k] / cmax, x0 = X(lo + k * bw) + 1, x1 = X(lo + (k + 1) * bw) - 1;
        rect(x0, baseY - h, x1 - x0, h, { fill: b.col, alpha: a });
        if (hb > 0) rect(x0, baseY - h, x1 - x0, Math.max(1.5, hb), { fill: C.red, alpha: a });
      }
      if (fill > 0 && fill < 1) {
        for (let q = 0; q < 24; q++) {
          const i = Math.min(g.length - 1, shown + q * 61), k = Math.floor((g[i] - lo) / bw); if (k < 0 || k >= bins) continue;
          const ph = 1 - q / 24, yy = lerp(R0[1] + 100, baseY - maxH * cnt[k] / cmax - 7, E.in3(ph)), o2 = Math.abs(g[i]) > Sx;
          b07_glyph(X(lo + (k + 0.5) * bw), yy, 0.12, o2 ? C.red : (b.hero ? C.hero : (TH ? C.mute : C.ink2)), a * clamp(ph * 3) * 0.95);
        }
      }
      const outNow = shown ? outN / shown : 0;
      rich([{ s: fmtN(outNow * 100, 1) + ' %', font: 'disp', size: 34, weight: 800, color: outNow > 0.02 ? C.red : b.hero ? C.heroText : C.ink, tnum: true }, { s: 'out', role: 'label', size: 19, color: C.mute, gap: 10 }], ox + 24, baseY + 70, { alpha: a * ep(t, b.t0 + 0.2, b.t0 + 0.5) });
    });
    const ky = ep(t, 5.4, 5.8);
    text('Seam gap, off nominal, {mm}', RM, R0[1] + R0[3] + 30, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ky });
    scaleNote(R0[0], R0[1] + R0[3] + 30, 'one sheet of copy paper, the allowance either way', { lead: '0.10 mm', t, t0: 5.6 });
    /* ---------------- the payoff ---------------- */
    const v0 = +fmtN(outF('four') * 100, 1), v1 = +fmtN(outF('two') * 100, 1);
    verdict(t, 8.7, R0[0], 872, { from: v0, to: v1, unit: '%', dec: 1, label: 'Seams outside the allowance', better: 'lower', who: ['Four parts', 'Theseus'], size: 96, maxW: 760 });
    text('And an error in one body is fixed once, in the steel.', RM, 840, { role: 'small', size: 24, weight: 600, color: C.ink2, align: 'right', maxW: 360, alpha: ep(t, 10.2, 10.7) });
    source(t, 'Parts ±T at 3σ, normal, independent (Scholz 1995). 24,000 mice a build, one seed. The allowance is an example. Starlight X: three parts, down from four (Back2Gaming).', { t0: 5.4 });
  }
});
