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
  /* sources shared with other chapters are cited by their first key (one source per fact): b01GwPlusPro, b01GwWarg,
     b01TpuHtsU, b01X2f, b01X2fWt (b01), shlFr4 (Gund: moduli and flexural strengths both ways) */
  b07OudeHengel: { t: 'K. M. Oude Hengel, B. J. Houwink, D. Odell, J. H. van Dieën and J. T. Dennerlein, "Smaller external notebook mice have different effects on posture and muscle activity", Clinical Biomechanics 23 (2008) 727-734: 30 adults, a 121 × 64 mm mouse against five smaller ones; the smallest raised wrist-extensor activity by up to 4.1 % MVC, larger hands on an 87 × 36 mm mouse up to 5.5 % MVC; "not optimal to use, particularly for participants with larger hands"', u: 'https://stacks.cdc.gov/view/cdc/223122/cdc_223122_DS1.pdf' },
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
  b07Fe: { t: 'This deck, 2D frames solved in the page (07-sim.js): the shell cut across at the board\'s rearmost rib row (z −0.77, sliced from the Theseus shell), CF-PP ' + fmtN(SIM_MAT.ppcf.E / 1000, 1) + ' GPa, a 10 N press at the crown; its feet held by the rim (a CF-PP ring, 4.0 × 3.6 mm, the Sora outline) alone, or tied to the board (FR4 ' + fmtN(SIM_MAT.fr4.E / 1000, 0) + ' GPa across the weave, Gund; ' + fmtN(BOARD_T, 1) + ' mm, two layers, F47.4; plan 5) by the side ribs; the plan frame under a 10 N squeeze each side, the board tied by six small arms cut from the same board or by every rib along its edge, each rib tied both ways (how a foot joins the board is open, F47.3)', n: 'derived, this model' }
});

/* ============================== data ============================== */
const B07 = { c: {} };
/** compute once, keep */
function b07_once(k, fn) { if (!(k in B07.c)) B07.c[k] = fn(); return B07.c[k]; }
/** a number rounded toward zero, as text (DESIGN §9) */
const b07_dn = (v, d = 0) => { const k = Math.pow(10, d); return fmtN(Math.floor(v * k + 1e-6) / k, d); };
/** a slide whose `answers` are written from the live models (pass answers: () => rows): built when read, after every file
   has loaded, so the numbers in the answers are the numbers on the frames and follow KEY_PARTS when the hardware moves */
function b07_live(o) {
  const rows = o.answers; delete o.answers;
  Object.defineProperty(o, 'answers', { enumerable: true, configurable: true, get: () => { try { return rows(); } catch (e) { return [['(answers)', 'The model behind these answers could not be read: ' + e.message]]; } } });
  return o;
}

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
/* the budget (THESEUS.mass: 29.31 g until 2026-11-06 17:10, 27.71 g with EEMB's 6.40 g battery in place of Jauch's 8 g,
   27.95 g with the board's waterproof coat, Brock ~19:40: ntr_coat, 0.24 g, onto the total).
   F44.2 (Brock): the two side switches (full-size SPDT, about 0.5 g each) come out of the shell's allowance, 10.35 → 9.35
   g; the battery's saving and the coat change the total, not the shell. F42.2: the board's 5.6 g is a target */
const B07_BUD = { shell: 9.35, sideSw: 1.0, btn: 3.328, wheel: 1.02, screws: 0.418, ins: 0.516, wires: 0.08,
  /* V3: the board and the battery read from the deck's own figures (THESEUS.pcb; the budget's battery pack), so a change there
     reaches this slide (main, 17:10: the battery is being changed) */
  get board() { return typeof THESEUS !== 'undefined' && THESEUS.pcb ? THESEUS.pcb : 5.6; },
  get batt() { const B = typeof ntr_budget === 'function' ? ntr_budget() : null; return B && B.cell && B.cell.g ? B.cell.g : 8.0; },
  /* the board's coat: the deck's one figure (ntr_coat, 14-b-intro-ex.js), the budget's line */
  get coat() { return typeof ntr_coat === 'function' ? ntr_coat() : 0.24; } };
/** a weight as said on the slide: whole grams when it is whole, else one decimal */
const b07_gTxt = g => (Math.abs(g - Math.round(g)) < 0.05 ? fmtN(Math.round(g), 0) : fmtN(g, 1));
/* where each part sits: z forward of the middle, y above the pad (mm). H2's balance model (3d/pcb/tools/balance.py; review
   b07 "HARDWARE", 10:14), number for number: the rest of the shell at the body's volume centroid; the two side switches
   (0.5 g each, F44.2: out of the shell's allowance) where shell.js puts them; the four boss posts over the board's holes, an
   ESTIMATE until S1 models them (MH1/MH2 would hang from the triggers, so an upper bound), also inside the shell's 9.35 g;
   the board's own centre of mass at its 5.6 g target (F42.2: bare board at its core's centroid, every part, the encoder and
   its support in); the board's four screws, driven from below (#54; the film's mouse has no bottom plate), heads under the
   board, their brass inserts at the foot of the posts; the battery from KEY_PARTS (b07_battZ / b07_battY).
   H5: every place balance.py uses is read from it (KEY_PARTS.balance, generated by key_parts.py from 3d/pcb/pcb-balance.json),
   so the slide's model is the 3D model's, the board as built (H3) included; the numbers below are H2's run, kept only for a
   build without KEY_PARTS. Re-run balance.py, then key_parts.py, when the shell gets its posts */
const B07_KB = typeof KEY_PARTS !== 'undefined' && KEY_PARTS.balance ? KEY_PARTS.balance : null;
const b07_zy = (v, d) => (v ? { z: v[0], y: v[1] } : d);
const B07_POS = {
  sideSws: B07_KB ? B07_KB.sideSws.map(v => b07_zy(v)) : [{ z: 15.00, y: 19.82 }, { z: -3.55, y: 22.65 }],   /* the two side switches, 0.5 g each */
  posts: B07_KB ? B07_KB.posts.map(([g, z, y]) => ({ g, z, y })) : [{ g: 2 * 0.272, z: 26.62, y: 15.34 }, { g: 2 * 0.387, z: -5.13, y: 19.69 }], /* boss posts over MH1-MH4 (estimate) */
  boardCom: b07_zy(B07_KB && B07_KB.boardCom, { z: 23.44, y: 6.51 }),   /* the board's centre of mass from its parts at its 5.6 g target, mouse frame */
  screws: b07_zy(B07_KB && B07_KB.screws, { z: 10.74, y: 4.0 }), inserts: b07_zy(B07_KB && B07_KB.inserts, { z: 10.74, y: 6.5 }), wires: b07_zy(B07_KB && B07_KB.wires, { z: 0, y: 8.0 }),
  body: b07_zy(B07_KB && B07_KB.body, { z: -10.41, y: 16.44 }), bay: { z: 36.0, y: 13.21 }, btn: b07_zy(B07_KB && B07_KB.btn, { z: 31.97, y: 22.05 }), board: { z: 19.09, y: 5.0 },
  wheel: b07_zy(B07_KB && B07_KB.wheel, { z: 34.87, y: 17.03 }),
  coat: b07_zy(B07_KB && B07_KB.coat, { z: 18.77, y: 4.73 }),   /* the board's coat, at the board's centroid (balance.py) */
  battHigh: { z: -14.0, y: 20.0 }, battOld: { z: -22.72, y: 7.46 }, battH1: { z: -24.95, y: 7.46 }, battH2: { z: -26.98, y: 7.46 },
  sensorOld: 1.12, sensorNew: 16.57, grip: 12.0
};
/* the mass model's source line, written from the places the balance uses (B07_POS; the battery from KEY_PARTS), so it follows
   the hardware when H2/H3 move a part */
{
  const mm = v => (v < 0 ? '−' : '') + fmtN(Math.abs(v), 1), P = B07_POS;
  SRC.b07Mass3d.t = 'This deck, mass model from the 3D assets, part for part as H2\'s balance model (3d/pcb/tools/balance.py; review b07, HARDWARE 10:14): the Theseus shell (3d/shell/shell-theseus-1seam.glb): its body centred at z ' + mm(P.body.z) + ' mm (behind the middle), ' + mm(P.body.y) + ' mm up; triggers at z ' + mm(P.btn.z) + ', ' + mm(P.btn.y) + ' mm up; wheel at z ' + mm(P.wheel.z) + ', ' + mm(P.wheel.y) + ' mm up; the board (plan 5, 3d/pcb/plans/outline_v5.json) at its 5.6 g target (F42.2), its centre of mass at z ' + mm(P.boardCom.z) + ', ' + mm(P.boardCom.y) + ' mm up; the two side switches, the four boss posts (estimated until the shell models them), the board\'s screws and inserts and its coat (' + fmtN(B07_BUD.coat, 2) + ' g) at their places; the battery (' + (typeof ntr_thsPack === 'function' ? ntr_thsPack().maker + ' ' + ntr_thsPack().part : 'EEMB LP402535') + ', ' + fmtN(B07_BUD.batt, 2) + ' g, ' + b07_battBox() + ') where the model balances the mouse (H5; KEY_PARTS, 03-parts.js): z ' + mm(b07_battZ()) + ', ' + mm(b07_battY()) + ' mm up; the weight budget\'s masses (' + THS.massG + '); the grip 12 mm up. Every place from 3d/pcb/tools/balance.py (KEY_PARTS.balance), the board as built (H3)';
}
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
   inside the Sora outline). The board is the plan-5 outline as a BOARD_T (0.6 mm) FR4 plate, modelled as a pin-jointed triangle
   lattice of 5 mm pitch whose bars carry the plate's in-plane stiffness (area 0.866 · s · t). It is tied to the rim:
     'none'   not at all (it floats on its screw bosses, as most boards do),
     'arms'   by six small FR4 arms, 3.8 mm wide, three on each long edge where G-Wolves puts them (Brock's photo: 52, 68 and
              84 % of the board's length back from its front),
     'whole'  by every side rib that reaches it (the study's rows over the board, a CF-PP rib foot each side).
   Load: a squeeze, 10 N inward on each side at z 4 (thumb and fingers on the sides over the board). Each element's stress
   is in MPa for that squeeze. */
/* bt: the board's thickness. F47.4 (Brock, "0.6 mm, 5.63 g"): a 0.6 mm two-layer board (was 1.0 mm). It ties the feet in its own
   plane, so its stiffness here goes with its thickness (60 % of the 1.0 mm board's), not with its cube (22 %, the bending
   figure); the arms in the 'arms' case are cut from the same board, so they are 0.6 mm too */
const B07_PLAN = { ring: { w: 4.0, h: 3.6 }, ringIn: 2.1, lat: 5, armZ: [-1.0, 8.5, 18.0], armW: 3.8, rib: { w: 1.1, h: 1.2 }, sqZ: 4.0, sqN: 10, bt: BOARD_T };   /* BOARD_T: 03-parts.js, KEY_PARTS.board.t (H3) */
const B07_ARM_L = 6.5;   /* the tab's free length, estimated from Brock's photo (5 to 8 mm): one length for the plan model and the edge-on tab */
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
    const s = B07_PLAN.lat, L = feLattice('tri', -25, -15, 50, 75, s, { w: B07_PLAN.bt, h: 0.866 * s, E: fr.E, rho: fr.rho / 3, truss: true, part: 'board' });
    const keep = L.nodes.map(p => b07_inside(B, p[0], p[1])), map = new Map();
    L.nodes.forEach((p, i) => { if (keep[i]) { map.set(i, nodes.length); m.board.push(nodes.length); nodes.push(p); } });
    L.els.forEach(e => { if (keep[e.i] && keep[e.j]) els.push(Object.assign({}, e, { i: map.get(e.i), j: map.get(e.j) })); });
    const zs = kind === 'arms' ? B07_PLAN.armZ : ribRows;
    for (const z of zs) for (const sd of [1, -1]) {
      const ri = rowNode[z + ':' + sd];
      let bi = -1, bx = -1; for (const k of m.board) { const q = nodes[k]; if (Math.abs(q[1] - z) < s * 0.62 && Math.sign(q[0]) === sd && Math.abs(q[0]) > bx) { bx = Math.abs(q[0]); bi = k; } }
      if (kind === 'arms') {
        /* the tab: 6.5 mm of FR4 from the board's edge (the photo's length, the same tab as the edge-on panel), then the rim's
           flange reaching in over its tip to the rim (a rim section) */
        const a = nodes[bi], b = nodes[ri], Lr = Math.hypot(b[0] - a[0], b[1] - a[1]), f = Math.min(0.95, B07_ARM_L / Lr), mi = nodes.length;
        nodes.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f)]);
        m.links.push({ e: els.length, z, sd, board: bi, ring: ri, mid: mi });
        els.push({ i: bi, j: mi, w: B07_PLAN.bt, h: B07_PLAN.armW, E: fr.E, rho: fr.rho, part: 'arm' });
        els.push({ i: mi, j: ri, w: B07_PLAN.ring.w, h: B07_PLAN.ring.h, E: pp.E, rho: pp.rho, part: 'flange' });
      } else {
        m.links.push({ e: els.length, z, sd, board: bi, ring: ri });
        els.push({ i: bi, j: ri, w: B07_PLAN.rib.w, h: B07_PLAN.rib.h, E: pp.E, rho: pp.rho, part: 'rib' });
      }
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

/** the same squeeze moved along the board, rear to front: how far the sides move (mm) with arms and with every rib tied */
const B07_SWEEP_Z = [-8, -3, 2, 7, 12, 17, 22, 27, 32, 37, 42, 46];
function b07_sweep() {
  return b07_once('sweep', () => {
    const z0 = B07_PLAN.sqZ, out = { z: B07_SWEEP_Z, arms: [], whole: [] };
    try {
      for (const z of B07_SWEEP_Z) {
        B07_PLAN.sqZ = z;
        for (const kind of ['arms', 'whole']) {
          const r = simSolve('b07-sweep-' + kind + '-' + z, () => b07_planModel(kind)), M = r.model, iL = M.rowNode[z + ':1'], iR = M.rowNode[z + ':-1'];
          out[kind].push(Math.abs(r.d[iL * 3] - r.d[iR * 3]));
        }
      }
    } finally { B07_PLAN.sqZ = z0; }
    const mx = a => Math.max(...a), mean = a => a.reduce((x, y) => x + y, 0) / a.length;
    out.worstArms = mx(out.arms); out.worstWhole = mx(out.whole); out.meanArms = mean(out.arms); out.meanWhole = mean(out.whole);
    out.zWorstArms = out.z[out.arms.indexOf(out.worstArms)]; out.zWorstWhole = out.z[out.whole.indexOf(out.worstWhole)];
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
/* the same weight of FR4 and magnesium alloy, pulled until it breaks: strips 50 mm long, FR4 10 × 1.0 mm (0.93 g, a test
   strip, not the board), the magnesium 1.0 mm thick and as wide as the same weight allows. SIM_MAT (KIT §4): FR4 Gund 430 MPa,
   1.85 g/cm³ (shlFr4); magnesium MatWeb 230 MPa, 1.81 g/cm³ (shlMg) */
const B07_PULL = (() => { const L = 50, aF = 10, rF = matOf('fr4').rho, rM = matOf('mg').rho, g = rF * aF * L / 1000, aM = g * 1000 / (rM * L), fF = SIM_MAT.fr4.ft * aF, fM = SIM_MAT.mg.ft * aM; return { L, aF, aM, g, fF, fM, ratio: fF / fM }; })();

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
   Each part of the budget (THESEUS.mass) at its place (B07_POS), the shell split between the body and the wheel bay by their volumes
   (12,166 and 1,375 mm³). Returns the centre of mass's z (forward of the middle) and height for the battery at a place. */
function b07_cg(batt) {
  const B = B07_BUD, P = B07_POS, postG = P.posts.reduce((a, q) => a + q.g, 0);
  const parts = [[B.shell - postG, P.body], ...P.posts.map(q => [q.g, q]), ...P.sideSws.map(q => [B.sideSw / 2, q]), [B.btn, P.btn], [B.board, P.boardCom], [B.wheel, P.wheel], [B.screws, P.screws], [B.ins, P.inserts], [B.wires, P.wires], [B.coat, P.coat], [B.batt, batt]];
  const m = parts.reduce((s, p) => s + p[0], 0);
  return { m, z: parts.reduce((s, p) => s + p[0] * p[1].z, 0) / m, y: parts.reduce((s, p) => s + p[0] * p[1].y, 0) / m, parts };
}
/* F42.1 (Brock, "Forward and up": a balance at the centre). H2 placed the 8 g pack in KEY_PARTS where the corrected model
   balanced (side switches and boss posts in): its centre at z −26.98, 7.46 mm up, 2.03 mm behind H1's place, no rise (review
   b07 "HARDWARE"): B07_POS.battH2. EEMB's 6.40 g pack there put the balance 1.7 mm ahead of the middle (the board as built);
   Brock (17:10, F64.11): "Move it back (Recommended)". H5 moved it to where balance.py balances the mouse, at the same height:
   its centre at z −34.32, clear of the tail (3d/pcb/tools/clear.py). Read from KEY_PARTS; these numbers only if it is missing */
const B07_BATT = { z: -34.32, y: 7.46 };
/** the battery's centre in the mouse (z forward of the middle, mm) */
function b07_battZ() { const kp = typeof KEY_PARTS !== 'undefined' ? KEY_PARTS.battery : null; return kp ? -(kp.y + kp.h / 2) : B07_BATT.z; }
/** the battery's box as said: across × along × thick (mm), from KEY_PARTS (EEMB's maximums, research/data/batteries.json) */
function b07_battBox() { const kp = typeof KEY_PARTS !== 'undefined' ? KEY_PARTS.battery : null; return kp ? fmtN(kp.w, 1) + ' × ' + fmtN(kp.h, 1) + ' × ' + fmtN(kp.t, 1) + ' mm' : '37.0 × 25.5 × 4.3 mm'; }
/** the battery's centre height over the pad (mm) */
function b07_battY() { const kp = typeof KEY_PARTS !== 'undefined' ? KEY_PARTS.battery : null; return kp && kp.yMid != null ? kp.yMid : B07_BATT.y; }
function b07_balance() {
  return b07_once('bal', () => {
    const P = B07_POS, zb = b07_battZ(), low = b07_cg({ z: zb, y: b07_battY() }), high = b07_cg(P.battHigh), old = b07_cg(P.battOld);
    const lvLow = low.y - P.grip, lvHigh = high.y - P.grip, atH2 = b07_cg(P.battH2);   /* atH2: the 6.40 g pack at the 8 g pack's place */
    /* the rest of the mouse without its battery: where the battery has to pull the balance from */
    const rest = (() => { const q = low.parts.slice(0, -1), m = q.reduce((a, p) => a + p[0], 0); return { m, z: q.reduce((a, p) => a + p[0] * p[1].z, 0) / m }; })();
    return { low, high, old, atH2, rest, zb, lvLow, lvHigh, twistCut: 1 - Math.abs(lvLow) / Math.abs(lvHigh) };
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

/** the rival's fix on the same slice (review R2-b07-1): a 2 mm pultruded carbon rod glued across the feet (E 134 GPa,
   1.5 g/cm³: TAP Plastics, research b07-10), as long as the feet are apart, with the rim still there; the same squeeze */
function b07_rodTie() {
  return b07_once('rod', () => {
    const m = b07_archModel(1), span = Math.abs(m.nodes[m.N][0] - m.nodes[0][0]), A = Math.PI * 1 * 1, kRod = 134000 * A / span, kN = b07_tieK('none');
    const r = simSolve('b07-sq-rod', () => b07_sqModel(kN + kRod));
    return { flex: -(r.d[r.model.grip[0] * 3] - r.d[r.model.grip[1] * 3]), g: 1.5e-3 * A * span, span, kRod };
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
const B07_ELL = 0.010 * 0.5 * 0.5 / 1.1 * 1000;   /* ℓ = m·v²/F: a 10 g fingertip at 0.5 m/s pressing 1.1 N (illustrative), 2.27 mm */
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
const B07_BRD = { ex: 10, by: BOARD_TOP - B07_PLAN.bt / 2, bt: B07_PLAN.bt, rodY: 2.2, rodR: 1.0, z: -0.77 };   /* the board's top stays at BOARD_TOP (5.03 mm, the posts' ends), F47.4's 0.6 mm below it */
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
    const v = i ? Math.floor(F * kb / 10) * 10 : Math.ceil(F * kb / 10 - 1e-9) * 10;   /* one precision (10 N): the board's FR4 floored, the rival rounded up */
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
  if (gl > 0.01) { G.shadowColor = rgba(C.hero, 0.8 * gl); G.shadowBlur = 18 * gl; G.fillStyle = rgba(C.hero, 0.25 * gl); G.fillRect(-bw - 0.3, -(by + bt / 2) - 0.3, 2 * bw + 0.6, bt + 0.6); G.shadowBlur = 0; }
  pcbSec(-bw, bw, -(by + bt / 2), bt, { brk: [0, 0] });   /* the shared board section (H1): mask skin, FR4 cut face */
  if (gl > 0.01) { G.strokeStyle = C.hero; G.globalAlpha = PA * a * gl; G.lineWidth = lw(2); G.strokeRect(-bw - 0.3, -(by + bt / 2) - 0.3, 2 * bw + 0.6, bt + 0.6); }
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
S(b07_live({
  id: 'b07_board', ch: 'shell', theme: 'night', title: 'The board you already carry', settle: 11, ideas: [94],
  replaces: ['shlPcbRib', 'shcCarry', 'shlStructs'],
  src: ['b07Fe', 'b07Fr4Wiki', 'shlFr4', 'shlMg', 'b01GwPlusPro', 'b01GwWarg', 'b07Sabre', 'b07Harpe', 'shlPyrofil'],
  answers: () => {
    /* written from the live models (b07_live): the numbers on the frames, rounded as they are (the rim alone floored, Theseus up) */
    const R = b07_squeeze(), Bd = b07_board(), RB = b07_rodTie(), dn2 = v => b07_dn(v, 2), up2 = v => fmtN(Math.ceil(v * 100 - 1e-9) / 100, 2);
    const fr = v => b07_k(Math.floor(v / 10) * 10), mgv = v => b07_k(Math.ceil(v / 10 - 1e-9) * 10);
    return [
      ['shlPcbRib: "unintuitive"', 'One demonstration on the real shell, cut across the board\'s rear rib row, problem first: squeeze it at the grip and its feet slide inward, the sides come in ' + dn2(R.flex0) + ' mm; the usual added part; then the board, anchored to the ribs, holds the feet and the same squeeze moves the sides ' + up2(R.flex1) + ' mm (the rim alone floored, Theseus rounded up).'],
      ['"explain how fr4 is like carbon fiber because it\'s also a woven composite"', 'A panel sets the two weaves side by side, carbon cloth in epoxy and glass cloth in epoxy (Wikipedia, FR-4: "woven fiberglass cloth with an epoxy resin binder"), and the narration says it: carbon fibre\'s recipe, made with glass cloth.'],
      ['"using the pcb is an alternative to having carbon fiber rods in your mouse"', 'The rival fix is drawn in place and named: a carbon rod, as G-Wolves braces its HTS Plus Pro 8K and Warg 8K ("Single-shell + carbon rod", the maker\'s words; where the rod sits isn\'t published, so it is drawn generically across the feet), with the paid route, carbon or magnesium shells, in the narration. Solved on the same slice, a 2 mm rod does about the same (' + dn2(RB.flex) + ' mm against the board\'s ' + up2(R.flex1) + '), and the slide says so: the board\'s win is the part it doesn\'t add.'],
      ['"that doesn\'t require extra parts with extra tolerancing"', 'The rod is tagged "+1 part" and "2 glued joints to hold to size" (the next slides take up tolerance); Theseus\'s result says "with no added part".'],
      ['"you\'re just using what you already have"', 'The title, and the line "the board already spans the feet": the board is carried anyway (its 5.6 g is a target, F42.2).'],
      ['shcCarry: "meg slide"', 'Read as "meh": the square-per-gram grid is gone. Its point, use the weight you already carry (the board, 5.6 g target), is this slide\'s result (+0 g, no added part).'],
      ['shlStructs: "viewer will have no idea what that spec means in big blue poor setup"', 'The published N/mm figure is left out. The measurement is set up on screen instead: 10 N on each side (the weight of a 1 kg bag of sugar) and how far the sides move, in mm (six sheets of copy paper), solved for this shell.'],
      ['F2.26 (FR4 as strong as magnesium; the whole board)', 'The same weight of each pulled until it breaks: FR4 ' + fr(B07_PULL.fF) + ' N, magnesium alloy ' + mgv(B07_PULL.fM) + ' N, ' + fmtN(Math.floor(B07_PULL.ratio * 10) / 10, 1) + '× (Gund; MatWeb, the higher magnesium figure, so the ratio is the cautious one; one precision, the magnesium rounded up).'],
      ['F47.4 (the 0.6 mm board)', 'Re-solved with the ' + fmtN(BOARD_T, 1) + ' mm two-layer board (FR4 ' + fmtN(SIM_MAT.fr4.E / 1000, 0) + ' GPa across the weave). The board ties the feet in its own plane, so there it keeps ' + Math.round(BOARD_T / 1.0 * 100) + ' % of the 1.0 mm board\'s stiffness (the 22 % is its bending stiffness); its tie is still ' + Math.floor(Bd.kW / Bd.kN) + '× the rim\'s (' + Math.round(Bd.kW) + ' against ' + fmtN(Bd.kN, 1) + ' N/mm), so the sides move ' + up2(R.flex1) + ' mm (' + fmtN(R.flex1, 4) + ' solved; 0.2073 with the 1.0 mm board): the verdict stands, and the section draws the board ' + fmtN(BOARD_T, 1) + ' mm thick.']
    ];
  },
  draw: t => {
    const R = b07_squeeze(), ex = B07_BRD.ex;
    header(t, 'The board you already carry');
    captions(t, [[0.6, 'Ribs stiffen the walls, but squeeze the shell at the grip and its feet slide inward: the sides come in.'],
      [3.3, 'Makers stiffen a light shell by adding something stiff: a carbon or magnesium shell, or a carbon rod, as G-Wolves braces its HTS Plus Pro and Warg. One more part, two more joints to hold to size.'],
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
    else wipeTo(t, 7.7, 1.0, box, () => scene(R.s0, 0), () => scene(R.s1, 1), { rival: 'Rim alone', right: 'Theseus', ly: box[1] - 4 });
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
    if (t >= 8.9) { const r = R.s1, M = r.model, f = est.P(M.nodes[M.N][0], -M.nodes[M.N][1]), bw = b07_boardHalfW(B07_BRD.z), e = est.P(bw, -B07_BRD.by), p = [(f[0] + e[0]) / 2, (f[1] + e[1]) / 2]; fixTag(t, 8.9, p, 'Ribs anchored to the board', { to: [p[0] - 40, p[1] - 150], side: 'l' }); }
    /* phase 1, top right: how far the sides bow in, live, with its human scale */
    const kr = ep(t, 1.6, 1.9) * (1 - ep(t, 4.8, 5.1));
    if (kr > 0.003) {
      const v = R.flex0 * ep(t, 1.6, 2.4, E.io3);   /* shown floored: the same 0.63 the verdict strikes (never rounded in Theseus's favour) */
      text('How far the sides come in', RM, 330, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: kr });
      rich([{ s: b07_dn(v, 2), font: 'disp', size: 84, weight: 800, color: C.ink, tnum: true }, { s: 'mm', font: 'disp', size: 32, weight: 700, color: C.mute, gap: 10, caps: false }], RM, 418, { align: 'right', alpha: kr });
      if (t > 2.5) { const s6 = 'about six sheets of copy paper'; scaleNote(RM - 34 - tw(s6, { role: 'small', size: 23, weight: 600 }), 466, s6, { t, t0: 2.5, size: 23 }); }
    }
    if (t > 2.1) scaleNote(LM, 920, 'a side, a hard press: a 1 kg bag of sugar, five times the hardest grip measured at a desk', { lead: '10 N', t, t0: 2.1, size: 22 });
    /* phase 2, the right column: the two weaves, the same-weight pull, and the result */
    const rx = LM + 1100, rw = RM - rx;
    b07_weavePanel(t, 5.3, [rx, 286, rw, 216]);
    b07_pullPanel(t, 6.3, [rx, 518, rw, 190]);
    /* the rival's fix, solved the same way (R2-b07-1): a 2 mm pultruded carbon rod (134 GPa, TAP Plastics, research b07-10) glued
       across the feet ties them about as well, for a part, its weight and two joints: the board's win is the added nothing */
    { const RB = b07_rodTie(), kr2 = ep(t, 8.0, 8.4); if (kr2 > 0.003) text('A 2 mm carbon rod glued across does about the same (' + fmtN(RB.flex, 2) + ' mm), for +1 part, +' + fmtN(RB.g, 2) + ' g and 2 glued joints.', rx, 744, { role: 'small', size: 21, weight: 600, color: C.mute, maxW: rw, lh: 1.25, alpha: kr2 }); }
    verdict(t, 8.4, rx, 905, { from: Math.floor(R.flex0 * 100 + 1e-9) / 100, to: Math.ceil(R.flex1 * 100 - 1e-9) / 100, unit: 'mm', dec: 2, label: 'How far the sides come in', better: 'lower', who: ['Rim alone', 'Tied to the board'], rivalCol: 'grey', size: 84, netWord: 'with no added part', maxW: rw });
    source(t, 'Solved here in 2D: one 10 mm slice of the CF-PP shell, on its rim or tied to the ' + fmtN(BOARD_T, 1) + ' mm board; 10 N a side, drawn ' + ex + '× real. The tie raises the wall\'s peak stress ' + fmtN(Math.ceil((R.pk1 / R.pk0 - 1) * 1000 - 1e-9) / 10, 1) + ' %. Rod: 134 GPa, 1.5 g/cm³ (TAP Plastics).', { t0: 2.2, maxW: rx - LM - 40 });
    if (kx > 0.003) text('One 10 mm slice, solved in 2D', box[0] + box[2], box[1] + 18, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kx * (1 - ep(t, 7.6, 7.8)) + ep(t, 8.7, 9.0) });
  }
}));

/* ============================== 2. b07_arms: Small arms snap, the whole board holds ==============================
   Brock (shcArms, 6/10): "these aren't what the arms or pcb would look like, important idea tho"; F2.26, F6.3 (the arms on
   his HTS Ultra broke in shipping), F28.3 (his two G-Wolves photos). The plan frame (model 1) under one squeeze, 10 N on
   each side over the board: six small arms where G-Wolves puts them against every rib tied to the board's own edge, the
   FR4 coloured by its stress on one scale. The arm, edge on: a fixed-guided FR4 tab 6.5 mm long and 1.0 mm thick (G-Wolves'
   own board: its length estimated from the photo, its thickness an estimate): σ = 3·E·h·δ / L², so 0.38 mm at its tip takes
   its root to 483 MPa (Gund, crosswise flexural). Only the squeeze is modelled on both; the drop is shown on the arm alone. */
const B07_ARM = { L: B07_ARM_L, h: 1.0, E: SIM_MAT.fr4.E, sf: SIM_MAT.fr4.fb };   /* crosswise FR4 (a tab off the long edge): SIM_MAT's 18 GPa, 483 MPa bent (Gund, shlFr4); h: G-Wolves' board, est. */
B07_ARM.perMM = 3 * B07_ARM.E * B07_ARM.h / (B07_ARM.L * B07_ARM.L);
B07_ARM.snap = B07_ARM.sf / B07_ARM.perMM;
/** the board's outline in the top view's frame (key plan: x as given, y = −z) */
function b07_boardPathKey() {
  const B = typeof KEY_PARTS !== 'undefined' && KEY_PARTS.board && KEY_PARTS.board.pts ? KEY_PARTS.board.pts : b07_boardOut().map(p => [p[0], -p[1]]);
  G.beginPath(); B.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.closePath();
}
/** the board as a plate, in mm in the current transform: mask, a gold edge, a few traces */
function b07_boardPlate(a, o = {}) {
  if (a <= 0.003) return;
  /* the shared plan-5 board (H1's boardMM: real outline, holes, pads, silk), moved from its own frame (y = 21.92 − layout z)
     into the key plan's (y = 2.88 − layout z) */
  if (o.rival) {   /* a rival's board: grey, as the shared convention draws rivals' boards (pcbSec o.rival) */
    G.save(); G.globalAlpha = PA * a; b07_boardPathKey(); G.fillStyle = C.comp; G.fill(); G.strokeStyle = C.mute; G.lineWidth = lw(1.5); G.stroke(); G.restore();
    return;
  }
  if (typeof boardMM === 'function' && typeof GEO2D !== 'undefined' && GEO2D.board2d) {
    G.save(); G.globalAlpha = PA * a; G.translate(0, 2.88 - BRD.z0); boardMM({ dim: o.dim || 0 }); G.restore();
    return;
  }
  G.save(); G.globalAlpha = PA * a;
  b07_boardPathKey(); G.fillStyle = MT.mask.g[0]; G.fill();
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
/** the squeeze moved along the board: how far the sides move (µm), arms and every rib, drawn as far as the fingers have got */
function b07_sweepChart(t, t0, r, SW, kw) {
  const [x, y, w, h] = r, a = ep(t, t0, t0 + 0.4); if (a <= 0.003) return;
  demoWindow(x, y, w, h, a);
  text('How far the sides move (µm), a hard 10 N squeeze', x + 24, y + 38, { role: 'label', size: 20, color: C.mute, alpha: a });
  const px0 = x + 74, px1 = x + w - 140, py0 = y + 70, py1 = y + h - 46, vmax = 60;
  const X = z => lerp(px0, px1, (z - SW.z[0]) / (SW.z[SW.z.length - 1] - SW.z[0])), Y = v => lerp(py1, py0, v * 1000 / vmax);
  line(px0, py1, px1, py1, { color: C.hair, w: 1.5, alpha: a });
  for (const v of [0, 20, 40, 60]) { text(String(v), px0 - 12, Y(v / 1000) + 6, { role: 'tick', size: 19, color: C.faint, align: 'right', alpha: a }); if (v) line(px0, Y(v / 1000), px1, Y(v / 1000), { color: C.hair, w: 1, alpha: a * 0.5 }); }
  text('Rear of the board', px0, py1 + 30, { role: 'tick', size: 19, color: C.faint, alpha: a });
  text('Front', px1, py1 + 30, { role: 'tick', size: 19, color: C.faint, align: 'right', alpha: a });
  /* the arms' places, marked on the axis */
  for (const z of B07_PLAN.armZ) { const xx = X(z); line(xx, py1 - 6, xx, py1 + 6, { color: C.second, w: 3, alpha: a }); }
  const zNow = lerp(SW.z[0], SW.z[SW.z.length - 1], kw);
  [['arms', C.second, C.secondText, 'Arms'], ['whole', C.hero, C.heroText, 'Every rib']].forEach(([k, col, tcol, lab]) => {
    const pts = []; SW.z.forEach((z, i) => { if (z <= zNow + 1e-6) pts.push([X(z), Y(SW[k][i])]); });
    if (pts.length > 1) poly(pts, { color: col, w: k === 'whole' ? 3.5 : 3, alpha: a });
    pts.forEach(p => circle(p[0], p[1], 4.5, { fill: col, alpha: a }));
    if (kw >= 1) { const last = pts[pts.length - 1]; text(lab, last[0] + 12, last[1] + (k === 'arms' ? -4 : 16), { role: 'label', size: 19, color: tcol, alpha: a }); }
  });
  if (kw > 0 && kw < 1) line(X(zNow), py0, X(zNow), py1, { color: C.ink2, w: 1.5, dash: [4, 4], alpha: a * 0.6 });
}
S(b07_live({
  id: 'b07_arms', ch: 'shell', theme: 'paper', title: 'Small arms snap, the whole board holds', settle: 11, ideas: [94],
  replaces: ['shcArms'],
  src: ['b07Fe', 'shcTpuHati', 'shcTpuHatiR', 'b01TpuHtsU', 'b07GwPhoto', 'shlFr4'],
  answers: () => {
    /* written from the live models (b07_live); the two checks in the last row were run by P4 on the same model (tools/armsrob.js,
       co.js in /home/claude/work/p4/tools): G-Wolves' arms on their own 1.0 mm board, and push-only feet */
    const SW = b07_sweep(), aS = Math.floor(SW.worstArms * 1000), wS = Math.ceil(SW.worstWhole * 1000);
    return [
      ['"these aren\'t what the arms or pcb would look like"', 'Drawn from his two photos: narrow FR4 tabs on the board\'s long edge, square at the root, silkscreen corner marks at the tips and a locating hole in one, reaching under the shell\'s rim (a close-up tile), placed along the board where G-Wolves puts them (52, 68 and 84 % back from its front) in the top view.'],
      ['"important idea tho"', 'Kept and led with the failure he lived: a jolt snaps an arm at its root, and the edge-on arm shows how little it takes (a ' + fmtN(B07_ARM.L, 1) + ' mm tab breaks when its tip moves ' + fmtN(B07_ARM.snap, 2) + ' mm). Then the important idea itself: the whole board, every rib tied along its edge, stiffens the length of the board instead of three spots.'],
      ['F2.26 (small FR4 arms easy to snap; THE WHOLE PCB)', 'The same 10 N squeeze moved along the board (solved): arms hold the shell hard at their three places and leave the front soft; every rib tied along the edge spreads it, so the softest spot moves less (derived). No strength claim: a drop is not modelled, and the slide says so.'],
      ['F6.3, F28.3 (his HTS Ultra\'s arms broke in shipping; his photos)', 'Said in the narration; the photos are the drawing\'s reference (drawn, not shown, F34.1).'],
      ['F33.5, F41.1', 'One of his important ideas, problem first. Its point leads with stiffness (F41.1): under a squeeze nothing here comes near breaking, and a drop is not modelled.'],
      ['F47.3, F47.4 (the rib feet\'s joint is open; the 0.6 mm board)', 'Re-solved with the ' + fmtN(BOARD_T, 1) + ' mm two-layer board (FR4 ' + fmtN(SIM_MAT.fr4.E / 1000, 0) + ' GPa across the weave), the arms cut from the same board: the softest spot along the board ' + aS + ' → ' + wS + ' µm (each rounded against Theseus; ' + fmtN(SW.worstArms * 1000, 1) + ' and ' + fmtN(SW.worstWhole * 1000, 1) + ' solved). It holds if G-Wolves\' arms keep their own 1.0 mm board (51.0 µm, checked on the same model). The model ties each rib to the board both ways, and the source line says so: how a foot joins the board is still open (Brock: "keep as options"); a push-only joint would let the pulling feet go and lose this lead (55.7 µm, worse than the arms). No drop claim.']
    ];
  },
  draw: t => {
    const R = b07_plan(), Ca = R.arms, Cw = R.whole, SW = b07_sweep();
    header(t, 'Small arms snap, the whole board holds');
    captions(t, [[0.6, 'G-Wolves had the right idea: use the board to stiffen the shell. It reaches the shell through six small FR4 arms.'],
      [2.6, 'Short, stiff tabs with square roots: a jolt in shipping snapped the arms on Brock\'s HTS Ultra 8K.'],
      [4.8, 'Theseus ties every rib along the board\'s edge instead, with no tab to snap. Arms hold three spots hard and leave the front soft; every rib spreads the hold along the board.']]);
    /* ---------- the main view: the whole mouse from above, then onto the board ---------- */
    const jolt = t > 2.9 ? Math.exp(-(t - 2.9) * 7) * Math.sin((t - 2.9) * 38) * 9 : 0;
    const box = [LM, 286, 1000, 650];
    const est = establish(t, 0, [box[0], box[1] + jolt, box[2], box[3]], { view: 'top', hi: ['board'], col: 'ink', focus: [-36, -54, 72, 72], locator: 'tl', fade: 0.55 });
    const kd = est.kd, P = q => [q[0], -q[1]];
    const hot = Ca.r.model.links.find(l => l.z === B07_PLAN.armZ[1] && l.sd === 1) || Ca.r.model.links[0];
    const drawCase = hero => est.draw(() => {
      const c = hero ? Cw : Ca, r = c.r, M = r.model;
      b07_boardPlate(kd, { rival: !hero });
      if (kd <= 0.01) return;
      /* the rim, neutral; the rival's tabs from Brock's photo, each held under the rim's flange; Theseus's ribs in blue */
      feDraw(r, P, { load: 0, alpha: kd, hide: e => M.els[e].part !== 'ring' && M.els[e].part !== 'flange', heat: false, color: C.comp, w: 1 });
      if (hero) { feDraw(r, P, { load: 0, alpha: kd, hide: e => M.els[e].part !== 'rib', heat: false, color: C.hero, w: 1.3, seg: 1 }); return; }
      M.links.forEach((l, i) => {
        const snapped = l === hot && t >= 3.35, b = P(M.nodes[l.board]), g = P(M.nodes[l.mid]);
        if (!snapped) { b07_armDetail(...b, ...g, B07_PLAN.armW, kd, { hole: i % 3 === 1 }); return; }
        /* the snapped tab: free of the board at its root, hanging from the flange */
        const dx = g[0] - b[0], dy = g[1] - b[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, fall = ep(t, 3.35, 3.8, E.out3);
        const ang = 0.18 * fall * (b[1] < 0 ? -1 : 1), gap = 0.9 * fall, w2 = B07_PLAN.armW / 2;
        G.save(); G.globalAlpha = PA * kd; G.translate(g[0], g[1]); G.rotate(ang); G.translate(-g[0], -g[1]);
        G.beginPath(); G.moveTo(b[0] + ux * gap - uy * w2, b[1] + uy * gap + ux * w2); G.lineTo(g[0] - uy * w2, g[1] + ux * w2); G.lineTo(g[0] + uy * w2, g[1] - ux * w2); G.lineTo(b[0] + ux * gap + uy * w2, b[1] + uy * gap - ux * w2); G.closePath();
        G.fillStyle = C.red; G.fill(); G.restore();
      });
    });
    wipeTo(t, 4.6, 0.9, box, () => drawCase(false), () => drawCase(true), { rival: 'G-Wolves arms', right: 'Theseus, every rib' });
    /* the arm that breaks: its root cracks in the jolt */
    if (t < 4.65) {
      const M = Ca.r.model, b = M.nodes[hot.board], g = M.nodes[hot.mid], pb = est.P(...P(b)), pg = est.P(...P(g)), ux = (pg[0] - pb[0]), uy = (pg[1] - pb[1]), Lp = Math.hypot(ux, uy) || 1, nx = -uy / Lp, ny = ux / Lp;
      const kc = ep(t, 3.05, 3.35, E.out3), root = [pb[0] + ux / Lp * 4, pb[1] + uy / Lp * 4], half = B07_PLAN.armW / 2 * est.s + 4;
      if (kc > 0) poly([[root[0] - nx * half, root[1] - ny * half], [root[0] + 3, root[1] + 2], [root[0] - 2, root[1] - 1], [root[0] + nx * half * (2 * kc - 1), root[1] + ny * half * (2 * kc - 1)]], { color: C.red, w: 3.6, alpha: kd });
      if (kc > 0) circle(root[0], root[1], 16 + 10 * kc, { color: C.red, w: 2, alpha: kd * 0.6 * (1 - ep(t, 3.6, 4.4)) });
    }
    /* act 3: the squeeze walks along the board, rear to front, and the chart draws both answers */
    const kw = ep(t, 5.8, 8.4, E.lin), zNow = lerp(SW.z[0], SW.z[SW.z.length - 1], kw), kf = ep(t, 5.5, 5.8) * (1 - ep(t, 8.6, 9.0));
    if (kf > 0.003) {
      const hw = msHalfW ? msHalfW(-zNow) : 30.5, pl = est.P(-hw - 0.4, -zNow), pr = est.P(hw + 0.4, -zNow);
      /* a squeeze is the thumb and the ring finger lying along the sides, pads in (FG), to scale with the board (est.s) */
      finger(pl[0], pl[1], -Math.PI / 2, { s: est.s, digit: 'thumb', press: 0.6, alpha: kf, len: 30 });
      finger(pr[0], pr[1], -Math.PI / 2, { s: est.s, flip: true, press: 0.6, alpha: kf, len: 30 });
    }
    /* ---------- the right column: the photo's tabs, the tab in a jolt, then the squeeze along the board ---------- */
    const rx = LM + 1040, rw = RM - rx;
    b07_gwTile(t, 0.4, [rx, 286, rw, 252]);
    const dJ = B07_ARM.snap * ep(t, 2.9, 3.3, E.in3), crackJ = ep(t, 3.3, 3.5), kE = ep(t, 2.6, 3.0) * (1 - ep(t, 5.2, 5.5));
    b07_armEdge(t, [rx, 560, rw, 196], dJ, crackJ, kE);
    if (t > 3.6 && t < 5.35) scaleNote(rx, 790, 'about four sheets of copy paper', { lead: fmtN(B07_ARM.snap, 2) + ' mm', t, t0: 3.6, size: 23 });
    b07_sweepChart(t, 5.5, [rx, 560, rw, 250], SW, kw);
    verdict(t, 8.6, rx, 912, { from: Math.floor(SW.worstArms * 1000), to: Math.ceil(SW.worstWhole * 1000), unit: 'µm', dec: 0, label: 'Softest spot along the board', better: 'lower', who: ['G-Wolves arms', 'Every rib tied'], size: 72, maxW: rw });
    source(t, 'Solved here in 2D: CF-PP rim and ribs, the ' + fmtN(BOARD_T, 1) + ' mm board, 10 N a side. Tabs 3.8 × ' + fmtN(B07_ARM_L, 1) + ' × ' + fmtN(B07_ARM.h, 1) + ' mm (est.), FR4 ' + fmtN(B07_ARM.E / 1000, 0) + ' GPa, ' + B07_ARM.sf + ' MPa bent across the weave (Gund). Ribs tied both ways (joint open). No drop modelled.', { t0: 2.2, maxW: rx - LM - 40 });
  }
}));

/** what a missed seam is to its owner: two seams magnified, flush inside the allowance and stepped outside it, a fingertip
   gliding across each (it slides over the flush one and catches on the step) */
function b07_seamInset(t, t0, r) {
  const [x, y, w, h] = r, a = ep(t, t0, t0 + 0.4); if (a <= 0.003) return;
  demoWindow(x, y, w, h, a);
  text('What a miss feels like, magnified', x + 20, y + 32, { role: 'label', size: 19, color: C.mute, alpha: a });
  const hw = (w - 40 - 20) / 2;
  [[0, 'Inside: flush', C.ink2], [1, 'Outside: a step', C.red]].forEach(([i, lab, col]) => {
    const hx = x + 20 + i * (hw + 20), sy = y + 80, st = i ? 8 : 0, mid = hx + hw / 2;
    G.save(); G.globalAlpha = a;
    G.fillStyle = C.comp; G.fillRect(hx, sy, hw / 2 - 1.5, 22); G.fillRect(mid + 1.5, sy - st, hw / 2 - 1.5, 22 + st);
    G.restore();
    /* the fingertip glides from the left; on the step it stops at the edge */
    const u = ep(t, t0 + 0.6, t0 + 2.0, E.io3), xf = i ? Math.min(lerp(hx + 26, hx + hw - 14, u), mid - 2) : lerp(hx + 26, hx + hw - 14, u);
    finger(xf, sy, 0, { s: 1.6, view: 'side', press: 0.25, len: 26, alpha: a });
    if (i && xf >= mid - 3) { const kc = ep(t, t0 + 1.3, t0 + 1.6); circle(mid, sy - st / 2, 8, { color: C.red, w: 2.5, alpha: a * kc }); }
    text(lab, hx, y + h - 14, { role: 'small', size: 21, weight: 650, color: col, alpha: a });
  });
}
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
    const TOL = b07_tol(), T = B07_TOL.T, Sx = B07_TOL.S, V = B07_TOLV, outF = k => TOL[k].mcOut;
    header(t, 'Tolerance stack-up');
    captions(t, [[0.6, 'Every part comes out a little off its drawing. Stack parts and their errors add up, like coins in a stack.'],
      [3.0, 'One sloppy part owns most of the spread. The others can be perfect, and the seam still misses.'],
      [5.4, 'Four shell parts: 1 mouse in ' + Math.ceil(1 / Math.max(1e-9, outF('four')) - 1e-9) + ' misses a seam\'s allowance. Rim, hump and sides in one body: 1 in ' + Math.floor(1 / Math.max(1e-9, outF('two')) + 1e-9) + '.'],   /* "1 in N": the four parts' N rounded up, Theseus's down (never in its favour) */
      [9.7, 'Every part you remove is a tolerance you don\'t stack. And a miss isn\'t a number to its owner: it\'s a step at the seam under a finger.']]);
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
    const wcBad = (3 + V.badK) * step;
    b07_bracket(cx + 202, nom - lerp(wcPx, wcBad, kb), nom + lerp(wcPx, wcBad, kb), bad ? rgba(C.red, 0.8) : C.mute, kw, null, { dir: 1, dash: [5, 4] });
    b07_bracket(cx + 222, nom - lerp(rsPx, rsBad, kb), nom + lerp(rsPx, rsBad, kb), bad ? C.red : C.ink, kr, null, { dir: 1, w: 2.5 });
    if (t >= 3.6) { const p = [cx - 178, tops[2] + ths[2] * 0.5]; faultTag(t, 3.6, p, 'One sloppy part: ' + Math.round(TOL.bad.share[3] * 100) + ' % of the spread', { to: [cx - 70, pan[1] + 112], elbow: cx - 204, side: 'r', prose: true, maxW: 300 }); }
    /* the formulas: big on the stage while the coins play, then they settle into the panel as the build line comes in */
    const kf = ep(t, 4.5, 5.25, E.cam), fs = lerp(50, 30, kf), fBig = [LM + 700, 380], fSmall = [inner[0], base + 92];
    const fxp = lerp(fBig[0], fSmall[0], kf), fyp = lerp(fBig[1], fSmall[1], kf), gapY = lerp(96, 54, kf), ls = lerp(24, 20, kf), ns = lerp(30, 24, kf);
    /* both laws count up together when the sloppy part goes in, so the pair always describes the same stack */
    const wcNow = lerp(TOL.four.wc, TOL.bad.wc, kb), rsNow = lerp(TOL.four.rss, TOL.bad.rss, kb);
    rich([{ s: 'Worst case', role: 'label', size: ls, color: C.mute }, { s: 'T₁ + T₂ + T₃ + T₄', font: 'disp', size: fs, weight: 700, color: C.ink2, gap: 16, caps: false },
      { s: '±' + fmtN(wcNow, 2) + ' mm', role: 'num', size: ns, color: kb > 0.5 ? C.red : C.mute, gap: 18, tnum: true }], fxp, fyp, { alpha: kw });
    rich([{ s: 'Likely', role: 'label', size: ls, color: C.mute }, { s: '√(T₁² + T₂² + T₃² + T₄²)', font: 'disp', size: fs, weight: 700, color: C.ink, gap: 16, caps: false },
      { s: '±' + fmtN(rsNow, 2) + ' mm', role: 'num', size: ns, color: kb > 0.5 ? C.red : C.ink2, gap: 18, tnum: true }], fxp, fyp + gapY, { alpha: kr });
    text('Each part varies by up to ±' + fmtN(T, 3) + ' mm (Protolabs\' mould tolerance, taken as the scatter). Coins drawn thick: real errors are hundredths of a millimetre.', fxp, fyp + gapY + lerp(56, 44, kf), { role: 'small', size: lerp(25, 22, kf), weight: 560, color: C.faint, maxW: lerp(1000, inner[2], kf), lh: 1.3, alpha: kr });
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
    /* once the builds start, the classroom panel steps back (one focal point, M7) */
    { const kdim = ep(t, 5.6, 6.2) * 0.3; if (kdim > 0.003) { G.save(); G.globalAlpha = kdim; rrPath(pan[0] + 2, pan[1] + 2, pan[2] - 4, pan[3] - 4, 6); G.fillStyle = C.bg; G.fill(); G.restore(); } }
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
      rich([{ s: (b.hero ? fmtN(Math.ceil(outNow * 1e4 - 1e-9) / 100, 2) : fmtN(Math.floor(outNow * 1e4 + 1e-9) / 100, 2)) + ' %', font: 'disp', size: 34, weight: 800, color: outNow > 0.02 ? C.red : b.hero ? C.heroText : C.ink, tnum: true }, { s: 'out', role: 'label', size: 19, color: C.mute, gap: 10 }], ox + 24, baseY + 70, { alpha: a * ep(t, b.t0 + 0.2, b.t0 + 0.5) });
    });
    const ky = ep(t, 5.4, 5.8);
    text('Seam gap, off nominal, {mm}', RM, R0[1] + R0[3] + 30, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ky });
    scaleNote(R0[0], R0[1] + R0[3] + 30, 'one sheet of copy paper, the allowance either way', { lead: '0.10 mm', t, t0: 5.6 });
    /* ---------------- the payoff ---------------- */
    const v0 = outF('four') * 100, v1 = outF('two') * 100;
    verdict(t, 8.7, R0[0], 872, { from: Math.floor(v0 * 100 + 1e-9) / 100, to: Math.ceil(v1 * 100 - 1e-9) / 100, unit: '%', dec: 2, label: 'Seams outside the allowance', better: 'lower', who: ['Four parts', 'Theseus'], size: 96, maxW: 760 });
    b07_seamInset(t, 9.8, [RM - 500, 826, 500, 136]);
    source(t, 'Parts ±T at 3σ, normal, independent (Scholz 1995). 24,000 mice a build, one seed. The allowance is an example. Starlight X: three parts, down from four (Back2Gaming).', { t0: 5.4 });
  }
});

/* ============================== 4. b07_poron: Poron pads, not grease ==============================
   Where a shell post meets the board, a squeeze makes them rub: friction holds, then lets go (stick-slip, TU Delft's tray
   on a spring), and each slip is a creak. Grease quiets it while it lasts (newer UltralightX batches are lubed with Krytox,
   Brock #96), then wears; a Poron pad at the contact shears instead of sliding, so nothing sticks or slips. Players already
   add these to their G-Wolves mice (his note); Theseus fits them at the factory. The stick-slip is a one-mass model, drawn
   to show the mechanism (illustrative units). */
/** stick-slip, one mass: a post dragged by a spring (the shell's flex) over the board, static friction mus, sliding muk;
   returns samples over T s of the post's place, the friction force and the slip start times */
function b07_stick(mus, muk, o = {}) {
  return b07_once('stick' + mus + ':' + muk + ':' + (o.pad ? 1 : 0), () => {
    /* m 1, k 987 (a slip lasts about 0.1 s), N 10, the drive at 0.0101 per s: the force climbs about 10 per s while stuck */
    const T = 2.0, n = 4000, dt = T / n, m = 1, k = 987, v = 0.0101, N = 10, c = 2;
    let x = 0, u = 0, stuck = true; const xs = [], fs = [], slips = [];
    for (let i = 0; i <= n; i++) {
      const tt = i * dt, xd = v * tt, fsp = k * (xd - x);
      if (o.pad) { xs.push(0); fs.push(124 * xd); continue; }   /* the pad shears: nothing slides, the force rises smoothly */
      if (stuck && fsp > mus * N) { stuck = false; slips.push(tt); }
      if (!stuck) { const a = (fsp - muk * N - c * u) / m; u += a * dt; x += u * dt; if (u <= 0) { u = 0; stuck = true; } }
      xs.push(x); fs.push(stuck ? fsp : muk * N + c * u);
    }
    return { T, n, xs, fs, slips, fmax: Math.max(...fs), xmax: v * T };
  });
}
/** one contact, magnified: the board, a shell post on it (or on a Poron pad), driven by the squeeze; its friction trace */
function b07_contact(t, t0, r, S, o) {
  const [x, y, w, h] = r, a = ep(t, t0 - 0.4, t0); if (a <= 0.003) return 0;
  demoWindow(x, y, w, h, a);
  text(o.name, x + 22, y + 36, { role: 'label', size: 20, color: o.hero ? C.heroText : o.bad ? C.red : C.mute, alpha: a });
  const u = clamp((t - t0) / 2.0), i = Math.min(S.n, Math.floor(u * S.n)), cx = x + w / 2, by = y + 196;
  /* the board, edge on (the shared section) */
  G.save(); G.globalAlpha = a; part(cx, by, 9, () => pcbSec(-18, 18, 0, null, {})); G.restore();   /* Theseus's board: th null draws BOARD_T (0.6 mm, H3); its top face, where the post stands, stays at by */
  /* the post, from the shell above; on Theseus a Poron pad between */
  const sc = 60 / S.xmax, dx = o.pad ? 0 : S.xs[i] * sc - 30, padH = 18, shear = o.pad ? 26 * u : 0;
  const px = cx + dx - 24, pyTop = y + 74, pyBot = by - (o.pad ? padH : 0);
  if (o.pad) {
    G.save(); G.globalAlpha = a; G.beginPath(); G.moveTo(cx - 34, by); G.lineTo(cx + 34, by); G.lineTo(cx + 34 + shear, by - padH); G.lineTo(cx - 34 + shear, by - padH); G.closePath();
    G.fillStyle = C.comp; G.fill(); G.strokeStyle = C.mute; G.lineWidth = 1.2; G.stroke();
    G.fillStyle = C.bg; for (let q = 0; q < 14; q++) { const fx = cx - 28 + (q % 7) * 9 + shear * (q < 7 ? 0.3 : 0.75), fy = by - 5 - (q < 7 ? 0 : 8); G.beginPath(); G.arc(fx, fy, 1.6, 0, TAU); G.fill(); }
    G.restore();
  }
  const postX = o.pad ? cx - 24 + shear : px;
  rr(postX, pyTop, 48, pyBot - pyTop, 6, TH ? MT.shell.g[0] : C.comp2, null, 0, a);
  if (o.first) text('Shell post', postX + 56, pyTop + 20, { role: 'tick', size: 19, color: C.faint, alpha: a });
  /* the creaks: a burst at each slip */
  S.slips.forEach(ts => { const k = clamp(((t - t0) - ts) / 0.35); if (k <= 0 || k >= 1 || t - t0 > 2.2) return; for (const rr2 of [10, 18]) { G.save(); G.globalAlpha = a * (1 - k); G.strokeStyle = C.red; G.lineWidth = 2.5; G.beginPath(); G.arc(postX + 24, pyBot, rr2 + k * 22, Math.PI * 1.1, Math.PI * 1.9); G.stroke(); G.restore(); } });
  /* the friction force against time */
  const gx = x + 22, gw = w - 44, gy = y + 228, gh = h - 228 - 44;
  line(gx, gy + gh, gx + gw, gy + gh, { color: C.hair, w: 1.5, alpha: a });
  const pts = []; for (let q = 0; q <= i; q += 10) pts.push([gx + gw * q / S.n, gy + gh - gh * 0.92 * S.fs[q] / (o.fmax || S.fmax)]);
  if (pts.length > 1) poly(pts, { color: o.hero ? C.hero : o.bad ? C.red : C.ink2, w: 2.5, alpha: a });
  text('Friction at the contact', gx, gy + gh + 26, { role: 'tick', size: 19, color: C.faint, alpha: a });
  return S.slips.filter(ts => ts <= (t - t0)).length;
}
S({
  id: 'b07_poron', ch: 'shell', theme: 'paper', title: 'Poron pads, not grease', settle: 11, ideas: [97, 96],
  replaces: ['grind'],
  src: ['b07Delft', 'poron4701', 'b07RogersGap', 'b07Creak', 'b07Josh', 'shlRtingsSoraUlx', 'shlDoc'],
  answers: [
    ['grind: "factory poron pads"', 'The title and the result: Theseus fits the pads at the factory, where each shell post meets the board.'],
    ['"many people already mod there g wolves mice with these"', 'Said in the narration as his note: players already add Poron to their G-Wolves mice (no public source found; research gap 2 logged).'],
    ['"for where it hits the pcb"', 'The demonstration is exactly that contact, magnified: a shell post on the board\'s edge (the shared board section).'],
    ['"to reduce creaking"', 'The creak shown as what it is, stick-slip (TU Delft\'s classroom demonstration: a tray on a spring, "jump ahead, stand still, jump ahead"), a burst at each slip; grease quiets it until it wears (Krytox on newer UltralightX batches); the pad shears instead of sliding, so the trace runs smooth.'],
    ['F33.8 (examples professors use)', 'TU Delft\'s ShowingPhysics stick-slip demonstration is the classroom version.']
  ],
  draw: t => {
    header(t, 'Poron pads, not grease');
    captions(t, [[0.6, 'Where a shell post meets the board, a squeeze makes them rub. Friction holds, then lets go: stick, slip, stick. Each slip is a creak.'],
      [4.1, 'Grease quiets it while it lasts: newer UltralightX batches are lubed with Krytox. It wears and gathers dust, and the creak comes back.'],
      [6.5, 'Theseus fits Poron pads at the factory. The foam shears instead of sliding, so nothing sticks or slips. Players already add them to their G-Wolves.']]);
    /* the classroom version: TU Delft's tray on a spring */
    const pan = [LM, 286, 520, 440], inner = demoPanel(t, -1, pan, { label: 'Classroom version', src: 'TU Delft' });
    { const S = b07_stick(0.4, 0.25), u = clamp((t - 0.4) / 2.2), i = Math.min(S.n, Math.floor(u * S.n)), fy = inner[1] + 110, x0 = inner[0] + 20, sc = 170 / S.xmax;
      line(inner[0], fy, inner[0] + inner[2], fy, { color: C.ink2, w: 2 });
      G.save(); G.strokeStyle = TH ? 'rgba(17,17,17,0.18)' : 'rgba(255,255,255,0.2)'; G.lineWidth = 1; G.beginPath(); for (let q = inner[0]; q < inner[0] + inner[2]; q += 14) { G.moveTo(q, fy); G.lineTo(q - 10, fy + 10); } G.stroke(); G.restore();
      const bx = x0 + S.xs[i] * sc, hand = x0 + 190 + u * S.xmax * sc;
      rr(bx, fy - 46, 110, 46, 6, C.comp, null, 0, 1); text('Tray', bx + 55, fy - 16, { role: 'label', size: 19, color: C.ink2, align: 'center' });
      /* the spring from the tray to the hand that pulls at a steady pace */
      const sp = []; const n = 14, xa = bx + 110, xb = Math.max(xa + 20, Math.min(hand, inner[0] + inner[2] - 20)); for (let q = 0; q <= n; q++) sp.push([lerp(xa, xb, q / n), fy - 23 + (q % 2 ? -8 : 8) * (q > 0 && q < n ? 1 : 0)]);
      poly(sp, { color: C.ink2, w: 2 }); circle(xb, fy - 23, 6, { fill: C.ink });
      text('pulled at a steady pace', xb, fy - 62, { role: 'tick', size: 19, color: C.faint, align: 'right' });
      const gx = inner[0], gw = inner[2], gy = fy + 40, gh = 120, pts = [];
      for (let q = 0; q <= i; q += 10) pts.push([gx + gw * q / S.n, gy + gh - gh * 0.9 * S.fs[q] / S.fmax]);
      line(gx, gy + gh, gx + gw, gy + gh, { color: C.hair, w: 1.5 });
      if (pts.length > 1) poly(pts, { color: C.red, w: 2.5 });
      text('Spring force: it jumps ahead, stands still, jumps ahead', gx, gy + gh + 30, { role: 'small', size: 22, weight: 600, color: C.mute, maxW: gw });
    }
    /* the three contacts: dry, greased, padded */
    const cx0 = LM + 560, cw = (RM - cx0 - 2 * 20) / 3, cy = 286, ch = 440, dry = b07_stick(0.4, 0.25), wet = b07_stick(0.13, 0.12), worn = b07_stick(0.36, 0.25), pad = b07_stick(0, 0, { pad: true });
    const fm = Math.max(dry.fmax, worn.fmax, pad.fmax);
    const nDry = b07_contact(t, 2.2, [cx0, cy, cw, ch], dry, { name: 'Dry: it creaks', bad: true, fmax: fm, first: true });
    const months = t > 6.1;
    b07_contact(t, months ? 6.1 : 4.2, [cx0 + cw + 20, cy, cw, ch], months ? worn : wet, { name: months ? 'Grease, months later' : 'Grease: quiet, for now', fmax: fm });
    b07_contact(t, 6.7, [cx0 + 2 * (cw + 20), cy, cw, ch], pad, { name: 'Poron pad: nothing slides', hero: true, fmax: fm, pad: true });
    const kd = ep(t, 2.4, 2.8);
    if (kd > 0.003) text('Contacts drawn magnified; one-mass model, illustrative', RM, cy + ch + 30, { role: 'tick', size: 19, color: C.faint, align: 'right', alpha: kd });
    verdict(t, 8.9, cx0, 880, { from: dry.slips.length, to: 0, unit: 'slips', dec: 0, label: 'Creaks in one squeeze (modelled)', better: 'lower', who: ['Dry', 'Poron'], rivalCol: 'grey', size: 84, net: 'Silent', netWord: 'for a few square millimetres of foam', maxW: 900 });
    /* under the Poron panel, the pad it describes, right-aligned to the margin (review R3-b07-1: at LM it ran into the verdict's label) */
    if (t > 7.2) scaleNote(RM - 601, 846, 'soft, 21 to 62 kPa at a quarter squeeze', { lead: 'PORON 4701-30', t, t0: 7.2, size: 21 });
    source(t, 'Stick-slip: static friction above sliding friction (TU Delft demo 17.5). Pads: Rogers PORON, which "fill gaps caused by variations in manufacturing tolerances".', { t0: 2.0 });
  }
});

/* ============================== 5. b07_sheet: The rest of the shell ==============================
   Three ideas that belong nowhere else, each problem → same input → result: PPS triggers (#6), graded walls (#93), joined
   struts (#53, #55). Not here: the closed wheel well (#58, with the cutouts on b02_seams), the optional plate (later), the
   film sticker (Brock to decide). */
/** one frame drawn small in a tile: the solved shape under its load, grey for the rival, blue for Theseus */
function b07_miniFrame(r, P, sq, ex, col, a, o = {}) {
  feDraw(r, P, { load: sq, scale: ex, w: o.w || 1, heat: false, color: col, alpha: a * PA, seg: 6 });
}
S({
  id: 'b07_sheet', ch: 'shell', theme: 'night', title: 'The rest of the shell', settle: 13, ideas: [6, 93, 53, 55],
  replaces: ['shlsheet2'],
  src: ['cfpps', 'shlMg', 'b07Fe', 'shlDoc'],
  answers: [
    ['shlsheet2 (5/10, no note)', 'Rebuilt as three demonstrations, each the same input on the rival way and Theseus\'s: PPS triggers against magnesium, graded walls against an even wall at the same weight, joined struts against separate ones at the same strut weight.'],
    ['F12.10 (the optional plate)', 'Not on this slide: the bottom cover comes later, as the brief says.'],
    ['The closed wheel well (#58)', 'Left to b02_seams, with the other cutouts, as he asked; the film sticker is not shown (he was unsure: asked in the report).'],
    ['F41.1 (lead with stiffness)', 'Walls and struts lead with flex and sink at equal weight; the struts\' peak stress rising 13 % is said, not hidden.']
  ],
  draw: t => {
    const GR = b07_grade(), ST = b07_struts(), mg = matOf('mg').rho, pps = 1.40, cut = 1 - pps / mg;   /* magnesium from SIM_MAT; carbon PPS isn't in it (MakeItFrom) */
    header(t, 'The rest of the shell');
    captions(t, [[0.6, 'Three more ideas, each tested the same way: the usual part, then Theseus\'s, under the same load.'],
      [3.6, 'Walls graded thicker toward the rim flex less than even walls of the same weight. It costs nothing to mould, only to draw.'],
      [7.0, 'Struts joined into an arch hold the low front better than separate struts of the same weight.']]);
    const tw = (RM - LM - 2 * 24) / 3, ty = 286, th = 560;
    const tiles = [0, 1, 2].map(i => [LM + i * (tw + 24), ty, tw, th]);
    /* ---- 1: PPS triggers ---- */
    { const [x, y, w, h] = tiles[0], a = 1;
      demoWindow(x, y, w, h, a);
      text('Triggers: carbon-filled PPS, not magnesium', x + 24, y + 40, { role: 'label', size: 19, color: C.mute, alpha: a, maxW: w - 48 });
      text('The Starlight\'s crisp metal click, in a plastic that sounds metallic (Brock, #6)', x + 24, y + 76, { role: 'small', size: 21, weight: 560, color: C.mute, maxW: w - 48, lh: 1.3, alpha: a });
      const kb = ep(t, 0.6, 1.6, E.out3), bx = x + 24, bw = w - 180;
      [['Magnesium alloy', mg, C.comp, C.mute], ['Carbon-filled PPS', pps, C.hero, C.heroText]].forEach(([nm, d, col, tc], i) => {
        const yy = y + 190 + i * 96;
        text(nm, bx, yy, { role: 'label', size: 19, color: tc, alpha: a });
        rr(bx, yy + 14, bw * (d / mg) * kb, 30, 4, col, null, 0, a);
        text(fmtN(d, 2) + ' g/cm³', bx + bw * (d / mg) * kb + 12, yy + 37, { role: 'num', size: 21, weight: 700, color: tc, alpha: a * kb });
      });
      text('The same shape: ' + b07_dn(cut * 100) + ' % lighter (magnesium is the stiffer: ' + fmtN(SIM_MAT.mg.E / 1000, 0) + ' against 17 GPa)', bx, y + 352, { role: 'tick', size: 19, color: C.faint, alpha: a, maxW: w - 48 });
      verdict(t, 1.8, x + 24, y + 470, { from: 100, to: Math.ceil((1 - cut) * 100 - 1e-9), unit: '%', dec: 0, label: 'Trigger weight, the same shape', better: 'lower', who: ['Magnesium', 'PPS'], size: 52, maxW: w - 48 });
    }
    /* ---- 2: graded walls ---- */
    { const [x, y, w, h] = tiles[1], a = ep(t, 3.2, 3.6);
      if (a > 0.003) {
        demoWindow(x, y, w, h, a);
        text('Walls graded toward the rim (#93)', x + 24, y + 40, { role: 'label', size: 19, color: C.mute, alpha: a });
        text('The same weight: even, or thicker low', x + 24, y + 76, { role: 'small', size: 21, weight: 560, color: C.mute, alpha: a });
        const sq = ep(t, 4.2, 4.9, E.io3), box = [x + 20, y + 96, w - 40, 236], cf = camFit([-40, -40, 80, 44], box, 0.06), P0 = q => [q[0], -q[1]];
        withCam(cf, box, () => { for (const [r, col, dx] of [[GR.ev, C.comp, -0.0], [GR.gr, C.hero, 0]]) { G.save(); G.translate(dx, 0); b07_miniFrame(r, P0, sq, 25, col, a * (col === C.hero ? 1 : 0.85), { w: 1 }); G.restore(); } });
        text('Grey: even. Blue: graded. Squeeze drawn 25× real.', x + 24, y + 352, { role: 'tick', size: 19, color: C.faint, alpha: a });
        verdict(t, 5.0, x + 24, y + 470, { from: Math.floor(Math.abs(GR.flexEv) * 1000 + 1e-9) / 1000, to: Math.ceil(Math.abs(GR.flexGr) * 1000 - 1e-9) / 1000, unit: 'mm', dec: 3, label: 'Flex, 10 N each side', better: 'lower', who: ['Even wall', 'Graded'], rivalCol: 'grey', size: 72, maxW: w - 48 });
      }
    }
    /* ---- 3: joined struts ---- */
    { const [x, y, w, h] = tiles[2], a = ep(t, 6.6, 7.0);
      if (a > 0.003) {
        demoWindow(x, y, w, h, a);
        text('Struts joined into an arch (#53, #55)', x + 24, y + 40, { role: 'label', size: 19, color: C.mute, alpha: a });
        text('The low front, cut across', x + 24, y + 76, { role: 'small', size: 21, weight: 560, color: C.mute, maxW: w - 48, alpha: a });
        const sq = ep(t, 7.6, 8.3, E.io3), P0 = q => [q[0], -q[1]];
        [[ST.sep, C.comp, 'Separate'], [ST.jo, C.hero, 'Joined']].forEach(([r, col, nm], i) => {
          const box = [x + 20, y + 100 + i * 118, w - 40, 112], cf = camFit([-34, -17, 68, 19], box, 0.04);
          withCam(cf, box, () => b07_miniFrame(r, P0, sq, 120, col, a, { w: 1 }));
          text(nm, x + 30, y + 118 + i * 118, { role: 'label', size: 19, color: i ? C.heroText : C.mute, alpha: a });
        });
        text('5 N on the roof, drawn 120× real; same strut weight. Peak stress +' + Math.round((ST.pkJo / ST.pkSep - 1) * 100) + ' %.', x + 24, y + 352, { role: 'tick', size: 19, color: C.faint, alpha: a, maxW: w - 48 });
        verdict(t, 8.4, x + 24, y + 470, { from: Math.floor(ST.sinkSep * 1e4 + 1e-9) / 10, to: Math.ceil(ST.sinkJo * 1e4 - 1e-9) / 10, unit: 'µm', dec: 1, label: 'Roof sink', better: 'lower', who: ['Separate struts', 'Joined'], rivalCol: 'grey', size: 52, maxW: w - 48 });
      }
    }
    if (t > 9) text('Elsewhere: the closed wheel well is with the cutouts. Not shown: the bottom cover (later).', LM, ty + th + 40, { role: 'small', size: 21, weight: 560, color: C.faint, alpha: ep(t, 9, 9.4) });
    source(t, 'Carbon-filled PPS 1.40 g/cm³, 17 GPa (MakeItFrom); magnesium AZ91D ' + fmtN(matOf('mg').rho, 2) + ' g/cm³, ' + fmtN(SIM_MAT.mg.E / 1000, 1) + ' GPa (MatWeb). Walls and struts: 2D frames solved here in CF-PP, 10 mm deep.', { t0: 2.0 });
  }
});

/* ============================== 6. b07_shcard: the Shape chapter card ==============================
   The compromise, struck: shapes cut down for weight, or chosen by taste (LEDGER, with the X2F CrazyLight as its flagship);
   the answer in blue: a shape measured on hands. This chapter's slides in film order; the simplified mouse from the side. */
S({
  id: 'b07_shcard', ch: 'shape', card: true, first: true, theme: 'night', title: 'Shape', settle: 5.5,
  replaces: ['shapecard'],
  answers: [
    ['shapecard (not rated): the chapter opener', 'Rebuilt in the kit\'s chapter-card family: the ledger\'s Shape compromise ("Shapes cut down for weight, or chosen by taste") struck, its flagship line (the X2F CrazyLight, cut to 87.5 mm, from b01), the answer in blue ("A shape measured on hands"), this chapter\'s slides in film order, the simplified mouse from the side with its hump lit.'],
    ['Hand-off in (b10_software)', 'Every setting changes in the browser; a shape can\'t, so it has to be measured before it ships: the card\'s answer.']
  ],
  draw: t => chapterCard2(t, { ch: 'shape', turn: 2.1, part: { view: 'left', hi: ['hump', 'sides'] },
    /* film order (FILM F27): the slide that answers the card's flagship (the X2F, cut to 87.5 mm) plays first */
    list: [[['size', 40], 'Sized against real hands'], [['newton', 42], 'Newtonian shape analysis'], [[93], 'Flat low sides, the same on both'], [[45], 'EMG on every revision'], [[95], 'Balance at the centre']] })
});

/* ============================== 7. b07_newton: Newtonian shape analysis ==============================
   Problem first: a sharp shoulder throws the finger off the mouse. The classroom version is McCloskey's curved tube: a ball
   leaves a curved tube in a straight line, along the curve's last direction (most people draw it still curving). A
   fingertip pressed onto a profile and sliding over it is that ball: where the profile turns tighter than the press can
   hold it (ℓ = m·v²/F), it carries on along the tangent. Three illustrative profiles (F21.12) and their rate of change of
   slope; Theseus's rule: round but defined, so the finger is carried onto the side. */
const B07_NEWT = { m: 0.010, v: 0.5, F: 1.1 };   /* illustrative: a 10 g fingertip at 0.5 m/s pressing 1.1 N */
/** the curved tube from above, a ball rolled through it: it leaves straight on (Newton); the curve most people draw */
function b07_tube(t, inner) {
  const [x, y, w, h] = inner, cx = x + w * 0.36, cy = y + h * 0.58, R = Math.min(w, h) * 0.25, tw = 26;
  /* the tube turns half a circle: in at the bottom heading left, round the left side, out at the top heading right */
  const a0 = Math.PI * 0.5, a1 = Math.PI * 1.5;
  G.save(); G.lineCap = 'round';
  for (const rr2 of [R - tw / 2, R + tw / 2]) { G.beginPath(); G.arc(cx, cy, rr2, a0, a1); G.strokeStyle = C.ink2; G.lineWidth = 3; G.stroke(); }
  G.restore();
  const kb = ep(t, 0.4, 1.6, E.lin), ang = lerp(a0, a1, kb), ex = [cx, cy - R];
  const kout = ep(t, 1.6, 2.4, E.lin), L = 220 * kout;
  /* the wrong answer: still curving after the exit */
  const kw = ep(t, 2.1, 2.5);
  if (kw > 0.003) {
    G.save(); G.globalAlpha = kw; G.strokeStyle = C.red; G.lineWidth = 3; G.setLineDash([8, 7]); G.beginPath(); G.arc(cx, cy, R, a1, a1 + 1.1); G.stroke(); G.restore();
    const pw = [cx + R * Math.cos(a1 + 1.1), cy + R * Math.sin(a1 + 1.1)];
    faultTag(t, 2.3, pw, 'Most draw this', { to: [pw[0] + 24, y + h - 30], elbow: pw[0] - 8, side: 'r' });
  }
  /* the ball's path: round the tube, then straight on */
  if (kout > 0) line(ex[0], ex[1], ex[0] + L, ex[1], { color: C.hero, w: 3, dash: [2, 7], alpha: 0.9 });
  const bp = kb < 1 ? [cx + R * Math.cos(ang), cy + R * Math.sin(ang)] : [ex[0] + L, ex[1]];
  circle(bp[0], bp[1], 10, { fill: C.ink });
  if (kout >= 1) fixTag(t, 2.6, [ex[0] + 150, ex[1]], 'Newton: straight on', { to: [ex[0] + 110, ex[1] - 50], side: 'l' });
}
/** one profile's tile: the profile from the crown round the shoulder, a fingertip following it 1:1, where it ends up */
function b07_newtTile(t, t0, r, P, o) {
  const [x, y, w, h] = r, a = ep(t, t0 - 0.3, t0); if (a <= 0.003) return;
  demoWindow(x, y, w, h, a);
  text(o.name, x + 24, y + 40, { role: 'label', size: 20, color: o.hero ? C.heroText : C.mute, alpha: a });
  const s = 7.6, ox = x + 46, oy = y + 120, X = q => ox + q.x * s, Y = q => oy + q.y * s;
  /* the shell, as a band under the profile */
  G.save(); G.globalAlpha = a; G.lineJoin = 'round'; G.lineCap = 'round';
  G.beginPath(); P.forEach((q, i) => (i ? G.lineTo(X(q), Y(q)) : G.moveTo(X(q), Y(q)))); G.strokeStyle = C.comp; G.lineWidth = 9; G.stroke();
  G.strokeStyle = o.hero ? C.hero : C.ink2; G.lineWidth = 3; G.stroke();
  G.restore();
  /* the fingertip, sliding from the crown at a steady pace */
  const u = ep(t, t0 + 0.2, t0 + 1.5, E.lin), f = b07_follow(P, u, 0.5, P[P.length - 1].s);
  const fx = ox + f.x * s - Math.sin(f.th) * 13 * (f.off ? 0 : 1), fy = oy + f.y * s - Math.cos(f.th) * 13 * (f.off ? 0 : 1);
  if (f.off) { const q = P[f.iSep]; line(X(q), Y(q), fx, fy, { color: C.red, w: 2.5, dash: [6, 5], alpha: a }); }
  circle(fx, fy, 11, { fill: TH ? C.comp : C.mute, alpha: a * ep(t, t0, t0 + 0.2) });
  circle(fx, fy, 11, { color: C.ink, w: 2, alpha: a * ep(t, t0, t0 + 0.2) });
  const kr = ep(t, t0 + 1.4, t0 + 1.8);
  text(o.verdict, x + 24, y + 86, { role: 'h2', size: 34, color: o.hero ? C.heroText : o.bad ? C.red : C.ink2, grad: o.hero ? C.heroGrad : null, alpha: a * kr });
}
/** the rate of change of the slope along each profile, °/mm, against the rate a finger can follow */
function b07_newtPlot(t, t0, r, P, o) {
  const [x, y, w, h] = r, a = ep(t, t0, t0 + 0.4); if (a <= 0.003) return;
  demoWindow(x, y, w, h, a);
  const thr = 180 / Math.PI / (B07_NEWT.m * B07_NEWT.v * B07_NEWT.v / B07_NEWT.F * 1000), vmax = 70, px0 = x + 58, px1 = x + w - 20, py0 = y + 36, py1 = y + h - 30;
  const L = P[P.length - 1].s, X = s2 => lerp(px0, px1, s2 / L), Y = v => lerp(py1, py0, Math.min(v, vmax) / vmax);
  G.save(); G.globalAlpha = a * 0.9; G.fillStyle = rgba(C.red, TH ? 0.08 : 0.12); G.fillRect(px0, py0, px1 - px0, Y(thr) - py0); G.restore();
  line(px0, Y(thr), px1, Y(thr), { color: C.red, w: 1.5, dash: [6, 5], alpha: a });
  line(px0, py1, px1, py1, { color: C.hair, w: 1.5, alpha: a });
  for (const v of [0, 25, 50]) text(String(v), px0 - 10, Y(v) + 6, { role: 'tick', size: 19, color: C.faint, align: 'right', alpha: a });
  const kd = ep(t, t0 + 0.2, t0 + 1.2, E.lin), pts = [];
  P.forEach((q, i) => { if (i % 3 === 0 && q.s <= L * kd) pts.push([X(q.s), Y(q.k * 180 / Math.PI)]); });
  if (pts.length > 1) poly(pts, { color: o.hero ? C.hero : o.bad ? C.red : C.ink2, w: 3, alpha: a });
  const pk = b07_peakK(P);
  if (kd >= 1) text('Peak ' + fmtN(pk, pk < 10 ? 1 : 0) + ' °/mm', px1, y + 24, { role: 'label', size: 19, color: o.hero ? C.heroText : o.bad ? C.red : C.mute, align: 'right', alpha: a });
}
S({
  id: 'b07_newton', ch: 'shape', theme: 'paper', title: 'Newtonian shape analysis', settle: 11, ideas: ['newton', 42],
  replaces: ['shp_newton'],
  src: ['b07McCloskey', 'shpBrock', 'shlDoc'],
  answers: [
    ['F2.44 (name Newtonian shape analysis)', 'The concept\'s name is the title and is said in the narration.'],
    ['F21.12 (three illustrative profiles until the shape is final)', 'Kept as three illustrative profiles, drawn from their curvature, and the source line says so.'],
    ['F33.8 (examples professors use)', 'The classroom version is McCloskey, Caramazza & Green\'s curved tube (Science, 1980): a ball leaves a curved tube in a straight line; most people draw it still curving. The fingertip on a shoulder is that ball.'],
    ['Problem first (M1)', 'The sharp shoulder goes first and throws the fingertip off the mouse along its tangent; then too gentle; then Theseus\'s rule, round but defined, which carries it onto the side.']
  ],
  draw: t => {
    const SH = b07_shp();
    header(t, 'Newtonian shape analysis');
    captions(t, [[0.6, 'A ball rolled through a curved tube leaves it straight on, along the curve\'s last direction. Most people draw it still curving.'],
      [2.9, 'A fingertip sliding over a mouse is that ball. Where the shoulder turns tighter than the press can hold it, the finger carries straight on.'],
      [6.2, 'Newtonian shape analysis charts how fast the slope turns. Past the red line the finger flies off; with no turn there is no edge to rest on.']]);
    /* the classroom version, on screen from frame one */
    const pan = [LM, 286, 540, 490], inner = demoPanel(t, -1, pan, { src: 'McCloskey 1980' });
    b07_tube(t, inner);
    text('A ball through a curved tube, seen from above: which way does it leave?', inner[0], inner[1] + 8, { role: 'small', size: 22, weight: 600, color: C.mute, maxW: inner[2], alpha: 1 });
    /* the three profiles, rival first */
    const tx0 = LM + 580, tw2 = (RM - tx0 - 2 * 20) / 3, ty = 286, th2 = 330;
    const tiles = [[SH.sharp, { name: 'Sharp shoulder', verdict: 'Off the mouse', bad: true }, 3.0], [SH.soft, { name: 'Shoulder too gentle', verdict: 'Nowhere to rest' }, 3.7], [SH.round, { name: 'Round, defined: Theseus', verdict: 'Onto the side', hero: true }, 4.4]];
    tiles.forEach(([P, o, t0], i) => {
      const x = tx0 + i * (tw2 + 20);
      b07_newtTile(t, t0, [x, ty, tw2, th2], P, o);
      b07_newtPlot(t, 6.3 + i * 0.25, [x, ty + th2 + 14, tw2, 156], P, o);
    });
    if (t > 6.3) text('How fast the slope turns along it, °/mm; red: faster than a finger can follow', tx0, ty + th2 + 14 + 156 + 30, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: ep(t, 6.3, 6.7) });
    const pkS = b07_peakK(SH.sharp), pkR = b07_peakK(SH.round), thr = 180 / Math.PI / (B07_NEWT.m * B07_NEWT.v * B07_NEWT.v / B07_NEWT.F * 1000);
    verdict(t, 8.2, LM, 868, { from: pkS, to: pkR, unit: '°/mm', dec: 0, label: 'Sharpest turn on the shoulder', who: ['Sharp shoulder', 'Theseus'], size: 72, net: 'In the band', netWord: 'an edge to feel, a turn to follow', maxW: 540 });
    source(t, 'Illustrative profiles, drawn from their curvature. A 10 g fingertip at 0.5 m/s pressing 1.1 N turns no tighter than ' + fmtN(B07_NEWT.m * B07_NEWT.v * B07_NEWT.v / B07_NEWT.F * 1000, 1) + ' mm.', { t0: 2.0, maxW: 1260, x: RM, align: 'right' });
  }
});

/* ============================== 8. b07_sides: Flat low sides, held the same on both ==============================
   Curving a sheet stiffens it (Bhatia 2014, Gauss): the hump is an arch, the low sides nearly flat, so a squeeze bends the
   low sides. The lattice runs thicker on both low sides, the same on both (F13.4, F19.2), and the same squeeze on both
   sides (his note: "equal pressure on both sides, just for show") flexes it less than the same weight spread evenly.
   Model 5: the real section across the hump (mirror-averaged), 10 N on each side 12 mm up. */
const B07_SIDE_EX = 15;
/** the classroom version: a sheet held at one end, flat (it flops) and curved across (it holds) */
function b07_sheetDemo(t, inner) {
  const [x, y, w, h] = inner, L = w - 120, k = ep(t, 0.4, 1.4, E.out3);
  [[0, 'Flat: it flops', C.red], [1, 'Curved across: it holds', C.heroText]].forEach(([i, lab, col]) => {
    const y0 = y + 40 + i * (h / 2), x0 = x + 34, droop = i ? 0 : 92 * k;
    rect(x0 - 26, y0 - 16, 26, 32, { fill: C.comp });   /* the hand's grip on the sheet's end */
    const pts = []; for (let q = 0; q <= 40; q++) { const u = q / 40; pts.push([x0 + L * u * (1 - 0.18 * (droop / 92) * u * u), y0 + droop * u * u]); }
    poly(pts, { color: i ? C.hero : C.ink2, w: 4 });
    if (i) { /* the sheet seen end on: a shallow arc */
      G.save(); G.strokeStyle = C.hero; G.lineWidth = 3; G.beginPath(); G.arc(x0 + L + 50, y0 + 36, 26, Math.PI * 1.15, Math.PI * 1.85); G.stroke(); G.restore();
      text('end on', x0 + L + 50, y0 + 58, { role: 'tick', size: 19, color: C.faint, align: 'center' });
    }
    text(lab, x0, y0 + (i ? 52 : 126), { role: 'small', size: 23, weight: 650, color: col, alpha: i ? 1 : k });
  });
}
S({
  id: 'b07_sides', ch: 'shape', theme: 'night', title: 'Flat low sides, held the same on both', settle: 11, ideas: [93, 'shape'],
  replaces: ['shbSides'],
  src: ['b07Bhatia', 'b07Fe', 'shlPyrofil'],
  answers: [
    ['shbSides: "show equal pressure on both sides, just for show"', 'Ten newtons on each side, the arrows mirrored, the section mirror-averaged, so the squeeze and the answer are the same on both sides.'],
    ['"the asymmetry looks bad"', 'Everything drawn and solved symmetric: the band runs on both low sides (F13.4, F19.2 "same on both"); only the label "thumb rest" sits on the left, in the top view.'],
    ['"this should be in the shape category"', 'It is: chapter shape, after the Newtonian shape analysis.'],
    ['F2.20 (why the flat low sides need a thicker lattice)', 'Shown on the real section across the hump: the hump is an arch (26.5 mm rise over 61.5 mm), the low sides nearly flat (0.6 mm over 13 mm), so a squeeze bends them; the classroom version is a sheet of paper, flat and curved (Bhatia 2014).'],
    ['F41.1 (lead with stiffness)', 'The result is the flex at the same added weight (band against even), not a break.']
  ],
  draw: t => {
    const R = b07_sides(), ex = B07_SIDE_EX;
    header(t, 'Flat low sides, held the same on both');
    captions(t, [[0.6, 'Curve a sheet across and it stiffens; leave it flat and it flops. The hump is an arch, but the low sides are nearly flat.'],
      [2.7, 'Squeeze the shell the same on both sides, a hard press of 10 N each, and the flat low sides take the bend.'],
      [4.9, 'So the lattice runs thicker on both low sides, the same on both. The same weight spread evenly holds less.']]);
    /* the classroom version */
    const pan = [LM, 286, 480, 410], inner = demoPanel(t, -1, pan, { label: 'Classroom version', src: 'Bhatia 2014' });
    b07_sheetDemo(t, inner);
    /* the section across the hump, front view: plain wall, then the band */
    const box = [LM + 520, 286, RM - LM - 520, 470], c = camFit([-46, -44, 92, 50], box, 0.04), draw = fn => withCam(c, box, fn), P = draw(null);
    const sq1 = ep(t, 2.8, 3.5, E.io3) * (1 - ep(t, 4.4, 4.8, E.io3)), sq2 = ep(t, 5.6, 6.3, E.io3), kband = ep(t, 4.9, 5.5, E.io3);
    const scene = (r, sq, a, band) => draw(() => {
      const M = r.model, Pm = q => [q[0], -q[1]];
      G.save(); G.globalAlpha = PA * a; G.strokeStyle = C.hair; G.lineWidth = lw(2); G.beginPath(); G.moveTo(-44, 0); G.lineTo(44, 0); G.stroke(); G.restore();
      if (sq > 0.02) { G.save(); G.globalAlpha = PA * a * 0.7; G.strokeStyle = C.faint; G.lineWidth = lw(1.5); G.setLineDash([lw(7), lw(6)]); G.beginPath(); M.nodes.forEach((n, i) => { const p = Pm(n); i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1]); }); G.stroke(); G.restore(); }
      feDraw(r, Pm, { load: sq, scale: ex, w: 1, smax: R.pk0, alpha: a * PA, heat: sq > 0.02, color: C.ink2, seg: 6 });
      if (band) feDraw(r, Pm, { load: sq, scale: ex, w: 1, alpha: a * PA * 0.55, heat: false, color: C.hero, hide: e => !(M.els[e].band > 0.5), seg: 6 });
    });
    if (kband < 1) scene(R.RB, sq1, 1 - kband, false);
    if (kband > 0) scene(R.RX, sq2, kband, true);
    /* the squeeze: the same on both sides, mirrored */
    const kq = Math.max(ep(t, 2.8, 3.25, E.snap) * (1 - ep(t, 4.4, 4.8)), ep(t, 5.6, 6.05, E.snap));
    if (kq > 0.003) for (const sd of [1, -1]) { const p = P(sd * 31.4, -12); forceArrow(p[0] + sd * 8, p[1], sd > 0 ? Math.PI : 0, 120, { N: 10, dec: 0, k: kq, side: 'end' }); }
    /* the section's own numbers: the arch and the flat */
    const kn = ep(t, 1.2, 1.6) * (1 - ep(t, 2.6, 2.9));
    if (kn > 0.003) {
      const ph = P(0, -38.1);
      text('An arch: ' + fmtN(R.rise, 1) + ' mm rise over ' + fmtN(R.span, 1) + ' mm', ph[0], ph[1] - 18, { role: 'label', size: 20, color: C.ink2, align: 'center', alpha: kn });
      for (const sd of [1, -1]) { const p = P(sd * 30.8, -11.6); text(sd > 0 ? 'Nearly flat: ' + fmtN(R.bulge, 1) + ' mm over ' + fmtN(R.chord, 0) + ' mm' : 'Nearly flat', p[0] + sd * 26, p[1] - 30, { role: 'label', size: 20, color: C.mute, align: sd > 0 ? 'left' : 'right', alpha: kn }); }
    }
    if (t >= 3.4 && t < 4.6) { const p = P(30.6, -7.6); faultTag(t, 3.4, p, 'The low sides bend', { to: [p[0] - 150, p[1] - 120], side: 'l', alpha: 1 - ep(t, 4.3, 4.6) }); }
    if (t >= 5.4) { const p = P(-30.6, -9); fixTag(t, 5.4, p, 'Thicker lattice, both low sides', { to: [p[0] - 50, p[1] - 110], side: 'l' }); }
    /* the top view: the bands on both sides, the thumb rest on the left */
    const kt = ep(t, 7.0, 7.4);
    if (kt > 0.003) {
      const tr = [LM, 716, 480, 244]; demoWindow(tr[0], tr[1], tr[2], tr[3], kt);
      text('From above: both sides the same', tr[0] + 24, tr[1] + 36, { role: 'label', size: 19, color: C.mute, alpha: kt });
      const s = 1.75, cx = tr[0] + 350, cy = tr[1] + 140;
      G.save(); G.globalAlpha = kt; G.translate(cx, cy); G.rotate(-Math.PI / 2); G.scale(s, s); mouseSimple('top', { hi: ['sides'], col: 'hero', lit: 1, lw: 1.5 }); G.restore();
      text('Fingers', tr[0] + 24, cy - 44, { role: 'label', size: 19, color: C.heroText, alpha: kt });
      text('Thumb rest', tr[0] + 24, cy + 58, { role: 'label', size: 19, color: C.heroText, alpha: kt });
    }
    verdict(t, 6.8, LM + 560, 870, { from: Math.floor(R.fE * 1000 + 1e-9) / 1000, to: Math.ceil(R.fB * 1000 - 1e-9) / 1000, unit: 'mm', dec: 3, label: 'Flex for the same added weight', better: 'lower', who: ['Spread evenly', 'On the low sides'], rivalCol: 'grey', size: 84, netWord: 'the same added weight', maxW: 700 });
    /* the heat key (F19.3, KIT §2): the section is coloured by stress against the even section's own peak, linear (the slide is about
       flex, not breaking), from the first squeeze */
    heatKey(t, 2.8, 1530, 420, 240, { mode: 'peak' });
    source(t, 'Solved here in 2D: the shell cut across the hump, mirror-averaged, a 10 mm CF-PP strip; 10 N a side, 12 mm up; drawn ' + ex + '× real. The band adds 10 % weight.', { t0: 2.4 });
  }
});

/* ============================== 9. b07_size: Sized against real hands ==============================
   The Shape chapter's compromise is "shapes cut down for weight": Pulsar cut the X2F CrazyLight to 87.5 mm to reach 29 g (its own
   figure, ± 2 g; no scale weight is published: BROADCAST-0945, b01X2fWt).
   Theseus keeps a full 119.3 mm at THS.massG, the shortest of the full-size flagships. Hands from ANSUR II (US Army 2012,
   the full public sample), lengths on one ruler; his rule for a flat mouse quoted word for word (F21.13). */
const B07_X2F = { L: 87.5, g: 29 };
S({
  id: 'b07_size', ch: 'shape', theme: 'paper', title: 'Sized against real hands', settle: 10, ideas: ['size', 40, 38, 39, 43],
  after: 'b07_shcard',   /* FILM F27: Shape opens on the slide that answers its card's flagship (the X2F, cut to 87.5 mm) */
  replaces: ['size'],
  src: ['b07Ansur', 'b01X2f', 'b01X2fWt', 'b07OudeHengel', 'shlDoc'],
  answers: [
    ['F21.13 (the flatter-mouse line, word for word)', 'Quoted exactly in its own card: "for a flatter mouse, its better to be too small than too big, because big hands will still be able to fingertip grip" (his doc, line 627), and called his rule, not a measured finding (Theseus is 39.9 mm tall).'],
    ['119.3 mm against the flagships and the average hand', 'One ruler: hand lengths from ANSUR II (women 5th 165, mean 181; men mean 193.3, 95th 210 mm; 193.3 is his 19.3 cm) and the flagships\' lengths (Viper V4 Pro 127.1, G Pro X Superlight 2 125.0, Starlight X 124.8, UltralightX 121.3, Theseus 119.3).'],
    ['FILM F1 (the chapter\'s flagship, X2F CrazyLight: cut to 87.5 mm)', 'The slide answers the card\'s flagship: the X2F cut to 87.5 mm to reach 29 g (Pulsar\'s figure, ± 2 g); Theseus keeps a full 119.3 mm at ' + THS.massG + '. The cost of too short, sourced: Oude Hengel 2008, an 87 mm mouse raised big hands\' wrist-extensor load by up to 5.5 % MVC (office mice; no length-to-hand ratio rule exists, research gap 8).']
  ],
  draw: t => {
    header(t, 'Sized against real hands');
    captions(t, [[0.6, 'To reach 29 g, Pulsar cut the X2F CrazyLight to 87.5 mm. Under an average hand, that is less than half the hand\'s length.'],
      [3.6, 'Theseus keeps a full 119.3 mm at ' + THS.massG + ': the shortest of the full-size flagships, sized to the rule below.']]);
    const mice = [['Pulsar X2F CrazyLight', B07_X2F.L, 'rival', 'Cut down for weight']].concat(B07_LEN.map(([id, nm, d]) => [nm, b07_len(id, d), 'comp'])).concat([['Theseus', 119.3, 'hero']]);
    mice.sort((a, b) => a[1] - b[1]);
    const hands = [['Women, 5th percentile', B07_HAND.women.p5], ['Women, average', B07_HAND.women.mean], ['Men, average', B07_HAND.men.mean], ['Men, 95th percentile', B07_HAND.men.p95]];
    /* one ruler, 0 to 220 mm */
    const x0 = LM + 300, x1 = LM + 1180, X = v => lerp(x0, x1, v / 220), y0 = 300;
    const ka = 1;
    for (let v = 0; v <= 220; v += 20) { line(X(v), y0, X(v), 880, { color: C.hair, w: 1, alpha: ka * 0.6 }); text(String(v), X(v), 900, { role: 'tick', size: 19, color: C.faint, align: 'center', alpha: ka }); }
    text('{mm}', x1 + 18, 900, { role: 'tick', size: 19, color: C.faint, alpha: ka });
    text('Hand length, wrist crease to fingertip (ANSUR II)', LM, y0 + 10, { role: 'label', size: 20, color: C.mute, alpha: ka });
    hands.forEach(([nm, L], i) => {
      const y = y0 + 44 + i * 40, k = 1;   /* the hands are the ruler: all four from frame one (R2-b07-8) */
      text(nm, x0 - 16, y + 7, { role: 'small', size: 21, weight: 620, color: C.ink2, align: 'right', alpha: ka });
      rr(x0, y - 10, Math.max(2, (X(L) - x0) * k), 20, 4, TH ? C.comp2 : C.comp2, null, 0, ka);
      if (k >= 1) text(fmtN(L, L % 1 ? 1 : 0), X(L) + 10, y + 7, { role: 'num', size: 21, weight: 700, color: C.ink2, alpha: ka, tnum: true });
    });
    const ym = y0 + 44 + 4 * 40 + 34;
    text('Mouse length', LM, ym + 10, { role: 'label', size: 20, color: C.mute, alpha: ka });
    mice.forEach(([nm, L, kind, note], i) => {
      const y = ym + 46 + i * 44, ti = kind === 'hero' ? 3.6 : kind === 'rival' ? 0.9 : 1.6 + i * 0.12, k = ep(t, ti, ti + 0.6, E.out3);
      const col = kind === 'hero' ? C.hero : kind === 'rival' ? C.second : C.comp, tc = kind === 'hero' ? C.heroText : kind === 'rival' ? C.secondText : C.ink2;
      text(nm, x0 - 16, y + 7, { role: 'small', size: 21, weight: kind === 'comp' ? 600 : 700, color: tc, align: 'right', alpha: ka * ep(t, ti - 0.2, ti) });
      if (k > 0.003) rr(x0, y - 11, Math.max(2, (X(L) - x0) * k), 22, 4, col, null, 0, ka);
      if (k >= 1) {
        const share = L / B07_HAND.men.mean * 100;
        rich([{ s: fmtN(L, 1), role: 'num', size: 22, weight: 750, color: tc, tnum: true }, { s: Math.round(share) + ' % of an average man\'s hand', role: 'small', size: 20, weight: 600, color: C.mute, gap: 12 }], X(L) + 10, y + 8, { alpha: ka });
      }
    });
    /* the rule, word for word */
    const qx = LM + 1300, qw = RM - qx, kq = ep(t, 5.2, 5.6);
    if (kq > 0.003) {
      demoWindow(qx, 300, qw, 330, kq);
      text('His rule for a flat mouse', qx + 26, 342, { role: 'label', size: 20, color: C.mute, alpha: kq });
      text('“for a flatter mouse, its better to be too small than too big, because big hands will still be able to fingertip grip”', qx + 26, 392, { role: 'small', size: 27, weight: 650, color: C.ink, maxW: qw - 52, lh: 1.32, alpha: kq, sentence: false });
      text('Brock, In Pursuit of an Objectively Better Mouse', qx + 26, 300 + 330 - 26, { role: 'small', size: 20, weight: 560, color: C.faint, maxW: qw - 52, alpha: kq });
    }
    const kh = ep(t, 6.2, 6.6);
    if (kh > 0.003) text('Too short costs too: in a lab study, a mouse 87 mm long raised big hands\' wrist-extensor load by up to 5.5 % of its maximum (Oude Hengel 2008, office mice).', qx, 660, { role: 'small', size: 21, weight: 560, color: C.mute, maxW: qw, lh: 1.3, alpha: kh });
    verdict(t, 6.8, qx, 860, { from: B07_X2F.L, to: 119.3, unit: 'mm', dec: 1, label: 'Full length at about 29 g', who: ['X2F', 'Theseus'], size: 72, maxW: qw });
    source(t, 'Hands: ANSUR II public data (US Army 2012), men n 4,082, women n 1,986. Lengths: the makers\'; X2F CrazyLight 87.5 mm, 29.5 g on Brock\'s scale (Pulsar lists 29 g ± 2).', { t0: 2.0 });
  }
});

/* ============================== 10. b07_emg: EMG on every shape revision ==============================
   What the electrodes read (Wang 2023: pros' forearm extensors never rest below Jonsson's 5 % even between flicks), why the
   score can't stand in for them (Tang 2023: five ZOWIE shapes, one click rate, different extensor load), and the protocol:
   every revision measured three ways, EMG, aim and comfort (Li & Wang 2025: comfort catches what a short EMG test misses).
   No numbers are drawn that the sources don't give: Tang's loads are shown as his ranking, not as bar heights. */
/** a raw surface-EMG trace and its envelope: bursts with each flick on a floor that never reaches zero (illustrative) */
function b07_emgTrace(t, t0, r, a) {
  const [x, y, w, h] = r, u = clamp((t - t0) / 2.6), n = 360, r0 = rng(7), noise = []; for (let i = 0; i <= n; i++) noise.push(r0() * 2 - 1);
  const env = q => 0.32 + 0.68 * Math.max(...[0.2, 0.45, 0.7].map(c => Math.exp(-Math.pow((q - c) / 0.05, 2))));
  const pts = [], ev = [], m = Math.floor(n * u);
  for (let i = 0; i <= m; i++) { const q = i / n, e = env(q); pts.push([x + w * q, y + h / 2 - noise[i] * e * h * 0.45]); ev.push([x + w * q, y + h / 2 - e * h * 0.45]); }
  line(x, y + h / 2, x + w, y + h / 2, { color: C.hair, w: 1, alpha: a });
  if (pts.length > 1) { poly(pts, { color: C.mute, w: 1.2, alpha: a }); poly(ev, { color: C.red, w: 2.5, alpha: a }); }
}
S({
  id: 'b07_emg', ch: 'shape', theme: 'night', title: 'EMG on every shape revision', settle: 11, ideas: [45],
  replaces: ['emg'],
  src: ['b07Wang', 'b07Tang', 'b07LiWang', 'b07Zowie', 'shlDoc'],
  answers: [
    ['emg (not rated): what the electrodes read', 'Electrodes on the extensor digitorum and extensor carpi radialis; the raw trace and its envelope; the level against Jonsson\'s 2 % and 5 % limits, with pros\' measured resting level, 5.1 to 5.9 % (Wang 2023).'],
    ['and the revision that wins', 'The protocol: each revision measured three ways (EMG, aim score, comfort), the winner is the one that wins all three; comfort is in because a 5 mm move of the peak changed comfort but not EMG (Li & Wang 2025). No revision results are invented: none exist yet.'],
    ['Brock #45 (Zowie the only company)', 'Quoted as his words, with ZOWIE\'s own page that their lab uses EMG and motion capture.']
  ],
  draw: t => {
    header(t, 'EMG on every shape revision');
    captions(t, [[0.6, 'Electrodes on the forearm read the muscles that hold the mouse. In pros they never rest: above Jonsson\'s 5 % limit, even between flicks.'],
      [3.4, 'Five ZOWIE shapes, one click rate, but not one load. The score can\'t see it; the electrodes can.'],
      [6.0, 'So every Theseus revision is measured three ways: muscle, aim and comfort, because comfort catches what a short EMG test misses.']]);
    /* ---------- left: what the electrodes read ---------- */
    const p1 = [LM, 286, 600, 640], in1 = demoPanel(t, -1, p1, { label: 'What the electrodes read', src: 'Wang 2023' });
    { /* the forearm from above, the two electrodes on the extensors */
      const fx = in1[0] + 10, fy = in1[1] + 6, fw = in1[2] - 20;
      G.save(); G.beginPath(); G.moveTo(fx, fy + 14); G.bezierCurveTo(fx + fw * 0.5, fy, fx + fw * 0.8, fy + 4, fx + fw, fy + 22); G.lineTo(fx + fw, fy + 86); G.bezierCurveTo(fx + fw * 0.8, fy + 102, fx + fw * 0.5, fy + 106, fx, fy + 92); G.closePath();
      G.fillStyle = C.comp2; G.fill(); G.strokeStyle = C.mute; G.lineWidth = 1.5; G.stroke(); G.restore();
      text('Forearm, from above', fx + 14, fy + 56, { role: 'tick', size: 19, color: C.faint });
      [[0.55, 'Extensor digitorum'], [0.75, 'Extensor carpi radialis']].forEach(([q, nm], i) => {
        const ex = fx + fw * q, ey = fy + 36 + i * 26; circle(ex, ey, 13, { fill: C.ink2 }); text(String(i + 1), ex, ey + 7, { role: 'num', size: 19, weight: 800, color: C.bg, align: 'center' });
        text((i + 1) + '  ' + nm, in1[0] + i * 250, in1[1] + 134, { role: 'small', size: 20, weight: 600, color: C.ink2 });
      });
      b07_emgTrace(t, 0.4, [in1[0], in1[1] + 160, in1[2], 140], 1);
      text('Raw signal and its envelope, three flicks (illustrative)', in1[0], in1[1] + 322, { role: 'tick', size: 19, color: C.faint });
      /* the gauge, across: % of the muscle's maximum, Jonsson's limits, pros at rest between flicks */
      const gy = in1[1] + 392, gx0 = in1[0], gw = in1[2], X = v => gx0 + gw * v / 8, kg = ep(t, 1.4, 2.6, E.out3);
      rect(gx0, gy, gw, 26, { fill: C.track });
      rect(gx0, gy, gw * 5.5 * kg / 8, 26, { fill: C.red, alpha: 0.85 });
      for (const [v, lab] of [[2, 'should not exceed'], [5, 'must not exceed']]) { line(X(v), gy - 10, X(v), gy + 36, { color: C.ink, w: 2, dash: [5, 4] }); text(v + ' %', X(v), gy + 60, { role: 'num', size: 21, weight: 750, color: C.ink, align: 'center' }); text(lab, X(v), gy + 86, { role: 'small', size: 19, weight: 600, color: C.ink2, align: 'center' }); }
      if (kg >= 1) text('Pros at rest: 5.1 to 5.9 %', X(5.5), gy - 18, { role: 'label', size: 19, color: C.red, align: 'center' });
      text('% of the muscle\'s maximum; the limits are Jonsson\'s, for an hour or more', in1[0], in1[1] + in1[3] + 4, { role: 'small', size: 20, weight: 600, color: C.mute, maxW: in1[2] });
    }
    /* ---------- middle: five ZOWIE shapes, one click rate ---------- */
    const k2 = ep(t, 3.3, 3.7), p2 = [LM + 640, 286, 560, 640];
    if (k2 > 0.003) {
      demoWindow(p2[0], p2[1], p2[2], p2[3], k2);
      text('Five ZOWIE shapes, 16 players', p2[0] + 26, p2[1] + 42, { role: 'label', size: 20, color: C.mute, alpha: k2 });
      text('Tang 2023', p2[0] + p2[2] - 26, p2[1] + 42, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: k2, caps: false });
      const names = ['FK1', 'FK1+', 'FK2', 'S1', 'S2'], cw = (p2[2] - 52) / 5;
      names.forEach((nm, i) => {
        const cx = p2[0] + 26 + cw * (i + 0.5), ka = k2 * ep(t, 3.5 + i * 0.12, 3.8 + i * 0.12);
        text(nm, cx, p2[1] + 110, { role: 'h2', size: 34, color: nm === 'S1' ? C.red : (nm === 'S2' || nm === 'FK1') ? C.ink : C.mute, align: 'center', alpha: ka });
        /* the click rate: the same bar for every shape */
        rect(cx - 16, p2[1] + 300 - 130, 32, 130, { fill: C.comp, alpha: ka });
      });
      text('Clicks per second: 6.35 to 6.37 on every shape (no difference)', p2[0] + 26, p2[1] + 336, { role: 'small', size: 21, weight: 620, color: C.ink2, maxW: p2[2] - 52, alpha: k2 * ep(t, 4.2, 4.6) });
      const k3 = ep(t, 4.6, 5.0) * k2;
      if (k3 > 0.003) {
        line(p2[0] + 26, p2[1] + 400, p2[0] + p2[2] - 26, p2[1] + 400, { color: C.hair, w: 1.5, alpha: k3 });
        text('Wrist-extensor load', p2[0] + 26, p2[1] + 440, { role: 'label', size: 20, color: C.mute, alpha: k3 });
        text('S1 loads the wrist extensors more than S2 and FK1 (p < .05)', p2[0] + 26, p2[1] + 484, { role: 'small', size: 23, weight: 650, color: C.ink, maxW: p2[2] - 52, lh: 1.3, alpha: k3 });
        text('The score can\'t see it; the electrodes can.', p2[0] + 26, p2[1] + 580, { role: 'small', size: 23, weight: 700, color: C.heroText, maxW: p2[2] - 52, alpha: ep(t, 5.2, 5.6) * k2 });
      }
    }
    /* ---------- right: every revision, three measures ---------- */
    const k4 = ep(t, 6.0, 6.4), p3 = [LM + 1240, 286, RM - LM - 1240, 640];
    if (k4 > 0.003) {
      demoWindow(p3[0], p3[1], p3[2], p3[3], k4);
      text('Every Theseus revision', p3[0] + 26, p3[1] + 42, { role: 'label', size: 20, color: C.heroText, alpha: k4 });
      [['Muscle', 'EMG on the two extensors, during play'], ['Aim', 'the same aim test, the same players'], ['Comfort', 'rated by the players: a 5 mm move of the peak changed comfort, not EMG (Li & Wang 2025)']].forEach(([h1, body], i) => {
        const ka = k4 * ep(t, 6.2 + i * 0.35, 6.6 + i * 0.35), yy = p3[1] + 104 + i * 112;
        circle(p3[0] + 40, yy - 8, 13, { fill: C.hero, alpha: ka }); text(String(i + 1), p3[0] + 40, yy - 1, { role: 'num', size: 19, weight: 800, color: C.onHero || '#FFFFFF', align: 'center', alpha: ka });
        text(h1, p3[0] + 66, yy, { role: 'h2', size: 30, color: C.ink, alpha: ka });
        text(body, p3[0] + 66, yy + 34, { role: 'small', size: 21, weight: 560, color: C.mute, maxW: p3[2] - 92, lh: 1.3, alpha: ka });
      });
      const kq = ep(t, 7.6, 8.0) * k4;
      /* the payoff for the eye (review R2-b07-6): no Theseus EMG result exists yet, so no number; the rule itself, in its type */
      text('The revision that wins all three ships.', p3[0] + 26, p3[1] + 490, { font: 'disp', size: 38, weight: 800, color: C.heroText, grad: C.heroGrad, maxW: p3[2] - 52, lh: 1.1, alpha: kq, caps: false });
      text('"Currently Zowie is the only company to take the Sports Science of shape design seriously enough to do this." Brock', p3[0] + 26, p3[1] + 574, { role: 'small', size: 20, weight: 560, color: C.faint, maxW: p3[2] - 52, lh: 1.3, alpha: kq, sentence: false });
    }
    source(t, 'Wang et al. 2023 (16 pros, Overwatch): static activity of the extensor digitorum 5.1 to 5.4 % MVC, extensor carpi radialis 5.4 to 5.9 %. Jonsson: static load under 2 %, never over 5 %.', { t0: 2.0 });
  }
});

/* ============================== 11. b07_balance: Balance at the centre ==============================
   The centre of mass moving as parts go in (F21.15, F30.10, his note on mass): the mouse on two kitchen scales, one under
   its front skates and one under its rear ones, each part landing with its weight; the balance point is the weighted mean
   of the parts' places and the scales read its share at each end. The battery, the heaviest part, lands last in the tail
   and evens them. Then both sides of the battery's height, honestly: in a flick the hand pushes at the grip and the mouse's
   weight lags at the balance point, so it twists by m·a·(balance height − grip height). A palm high on the hump pushes
   higher (a higher battery suits it); Theseus is held on its flat low sides, 12 mm up, so the battery sits low.
   Places: the 3D shell's centroids (B07_POS) and the battery from KEY_PARTS (03-parts.js). */
/** the parts as they go in, each with its weight (g) and centroid (z forward, y up; mm) */
function b07_balParts() {
  return b07_once('balParts', () => {
    /* H2's balance model (3d/pcb/tools/balance.py), so the film has one, grouped as they land: the shell (its body and its
       four boss posts, 9.35 g), the two side switches, the board at its 5.6 g target, the four screws and inserts with the
       wires and the board's coat; each group at its own weighted centroid, so the balance point is exactly b07_cg's */
    const B = B07_BUD, P = B07_POS, grp = list => { const g = list.reduce((a, q) => a + q[0], 0); return { g, z: list.reduce((a, q) => a + q[0] * q[1].z, 0) / g, y: list.reduce((a, q) => a + q[0] * q[1].y, 0) / g }; };
    const postG = P.posts.reduce((a, q) => a + q.g, 0);
    const shell = grp([[B.shell - postG, P.body], ...P.posts.map(q => [q.g, q])]), sw = grp(P.sideSws.map(q => [B.sideSw / 2, q]));
    const scw = grp([[B.screws, P.screws], [B.ins, P.inserts], [B.wires, P.wires], [B.coat, P.coat]]);   /* the small parts, the board's coat with them */
    return [
      { name: 'Shell', g: shell.g, z: shell.z, y: shell.y },
      { name: 'Buttons', g: B.btn, z: P.btn.z, y: P.btn.y },
      { name: 'Side switches', g: sw.g, z: sw.z, y: sw.y },
      { name: 'Board', g: B.board, z: P.boardCom.z, y: P.boardCom.y, target: true },
      { name: 'Wheel', g: B.wheel, z: P.wheel.z, y: P.wheel.y },
      { name: 'Screws, wires, coat', g: scw.g, z: scw.z, y: scw.y },
      { name: 'Battery', g: B.batt, z: b07_battZ(), y: b07_battY(), batt: true }
    ];
  });
}
/** a lever (mm) as one decimal, rounded against Theseus: up for its own low battery, down for the battery in the hump */
const b07_lvTxt = (v, theseus) => fmtN((theseus ? Math.ceil(Math.abs(v) * 10 - 1e-9) : Math.floor(Math.abs(v) * 10 + 1e-9)) / 10, 1);
/** where the scales sit (under the front and rear skates, mouse z) and the middle of the mouse's length */
function b07_balFrame() {
  return b07_once('balFrame', () => {
    const sk = KEY_PARTS.skates.pts.map(p => -p[1]), f = sk.filter(z => z > 0), r = sk.filter(z => z < 0), avg = a => a.reduce((s, v) => s + v, 0) / a.length;
    return { zf: avg(f), zr: avg(r), mid: (-KEY.nose - KEY.tail) / 2 };
  });
}
/** a kitchen scale under one end, in the side view's mm (x = −z): platform top on the pad, the display drawn in px */
function b07_scale(est, z, g, a, o = {}) {   /* est: { draw(fn), P(mx, my) } */
  if (a <= 0.003) return;
  const x = -z, w = 30, h = 9;
  est.draw(() => {
    G.save(); G.globalAlpha = PA * a;
    rrPath(x - w / 2, 0.15, w, 1.2, 0.4); G.fillStyle = C.comp; G.fill();
    rrPath(x - w / 2 + 1.5, 1.35, w - 3, h, 1.2); G.fillStyle = C.panel; G.fill(); G.strokeStyle = C.hair; G.lineWidth = lw(1.5); G.stroke();
    rrPath(x - 8, 3.4, 16, 5, 0.8); G.fillStyle = TH ? C.ink : C.track; G.fill();
    G.restore();
  });
  const p = est.P(x, 5.9);
  text(fmtN(g, 1) + ' g', p[0], p[1] + 8, { role: 'num', size: 24, weight: 750, color: o.col || (TH ? C.bg : C.ink), align: 'center', alpha: a, tnum: true });
}
/** the balance point's mark: a circle in four quarters, ink and ground */
function b07_comMark(x, y, r, a) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a;
  G.fillStyle = C.bg; G.beginPath(); G.arc(x, y, r, 0, TAU); G.fill();
  G.fillStyle = C.ink; for (const q of [0, 2]) { G.beginPath(); G.moveTo(x, y); G.arc(x, y, r, q * Math.PI / 2 - Math.PI / 2, q * Math.PI / 2); G.closePath(); G.fill(); }
  G.strokeStyle = C.ink; G.lineWidth = 2; G.beginPath(); G.arc(x, y, r, 0, TAU); G.stroke();
  G.restore();
}
S(b07_live({
  id: 'b07_balance', ch: 'shape', theme: 'paper', title: 'Balance at the centre', settle: 12, ideas: [95],
  replaces: ['mass'],
  src: ['b07Mass3d', 'b07Periview', 'b11GpxBatt', 'shlDoc'],
  answers: () => {
    const BAL = b07_balance(), F = b07_balFrame(), m = BAL.low.m, front = m * (BAL.low.z - F.zr) / (F.zf - F.zr);
    return [
      ['mass: "in review"', 'Rebuilt: the balance point is shown moving as each part goes in, on two kitchen scales (the classroom way to find a centre of mass), then the battery\'s height argued both ways with the flick\'s twist drawn.'],
      ['"research why some people are pushing for higher battery placement"', `No maker or test gives a reason in print (research gap 4: none found). The physics gives one, shown and credited to no one: in a flick the hand pushes where it holds, so a palm resting high on the hump pushes higher up, and a higher battery lines the weight up with that push; some mice do carry it high (the G Pro X Superlight's is glued to its top shell, iFixit). Against it: Theseus is held on its flat low sides, 12 mm up, so a low battery puts the balance ${b07_lvTxt(BAL.lvLow, true)} mm above the grip, within a millimetre (the parts' heights are known to about that), against ${b07_lvTxt(BAL.lvHigh, false)} mm with the battery in the hump (the headline, both rounded against Theseus).`],
      ['F30.10 (balance stays at the centre)', Math.abs(BAL.low.z) <= 1 ? `The scales end level (${fmtN(front, 1)} and ${fmtN(m - front, 1)} g): the balance point at the middle of the length, within a millimetre (the parts' places are known to about that), not under the sensor.`
        : `Not level since the battery went to ${fmtN(B07_BUD.batt, 2)} g (Brock, 17:10) at the place H2 set for the 8 g pack: ${fmtN(front, 1)} and ${fmtN(m - front, 1)} g, the balance ${fmtN(BAL.low.z, 1)} mm ahead of the middle. Said in red on the slide; the battery's place is to be re-run (H4).`],
      ['F21.15, F42.1, F64.11 (the battery balances the mouse; "forward and up"; "Move it back")', `The battery lands last, the heaviest part at ${fmtN(B07_BUD.batt, 2)} g, set where the mouse balances: ${fmtN(-BAL.zb, 1)} mm behind the middle, at board height (KEY_PARTS, from 3d/pcb/tools/balance.py). F42.1 asked for a balance at the centre; with the side switches and the four boss posts in the model (H2; the posts estimated) the 8 g pack balanced it ${fmtN(-B07_POS.battH2.z, 1)} mm back. The lighter pack there left the balance ${fmtN(BAL.atH2.z, 1)} mm ahead of the middle; Brock chose "Move it back": ${fmtN(B07_POS.battH2.z - BAL.zb, 1)} mm further back, at the same height, inside the tail (3d/pcb/tools/clear.py). It pulls the balance from about ${b07_dn(BAL.rest.z)} mm ahead of the middle to the centre.`],
      ['F42.2 (the board\'s 5.6 g is a target)', 'The weights list says "Board (target) 5.60 g".'],
      ['F2.40 (a better argument, more intuitive)', 'The argument is the lever between the push and the weight, drawn on the mouse, with the mouse rocking (drawn exaggerated) when the battery is high and not when it is low.']
    ];
  },
  draw: t => {
    const parts = b07_balParts(), F = b07_balFrame(), P0 = B07_POS, BAL = b07_balance();
    header(t, 'Balance at the centre');
    captions(t, [[0.2, 'Weigh the mouse at both ends as its parts go in. Each part pulls the balance point toward itself.'],
      /* V4: with the 6.40 g pack (Brock, 17:10) at the place H2 set for the 8 g one, the balance sat ahead of the middle; H5
         moved it back to where the model balances (Brock: "Move it back"). The words follow the model, never a typed claim */
      [3.4, Math.abs(BAL.low.z) <= 1 ? 'The battery is the heaviest part inside, ' + b07_gTxt(B07_BUD.batt) + ' g. Set low in the tail, where the mouse balances, it brings the balance back to the centre.'
        : 'The battery is the heaviest part inside, ' + b07_gTxt(B07_BUD.batt) + ' g. Set low in the tail, it pulls the balance from ' + b07_dn(BAL.rest.z) + ' mm ahead of the middle to ' + fmtN(Math.abs(BAL.low.z), 1) + ' mm.'],
      [4.5, 'Some want the battery higher, up in the hump. A palm resting high on the hump pushes up there, and the weight would line up with it.'],
      [7.2, 'Theseus is held on its flat low sides, 12 mm up. A low battery puts the balance on that grip, so a flick doesn\'t rock it.']]);
    /* the parts land one by one; the battery last */
    const tl = [0.9, 1.3, 1.65, 2.0, 2.35, 2.7, 3.3], kl = parts.map((p, i) => spring(t, tl[i], { f: 2.6, z: 0.7 })), kp = parts.map((p, i) => ep(t, tl[i], tl[i] + 0.35)), ib = parts.length - 1;
    /* phase 2: the battery dragged up into the hump, then back down */
    const up = ep(t, 5.3, 6.1, E.io3) * (1 - ep(t, 7.5, 8.3, E.io3)), bz = lerp(b07_battZ(), P0.battHigh.z, up), by = lerp(b07_battY(), P0.battHigh.y, up);
    const cur = parts.map(p => p.batt ? Object.assign({}, p, { z: bz, y: by }) : p);
    let m = 0, mz = 0, my = 0; cur.forEach((p, i) => { const k = clamp(kp[i]); m += p.g * k; mz += p.g * k * p.z; my += p.g * k * p.y; });
    const zc = m > 0 ? mz / m : 0, yc = m > 0 ? my / m : 0, lever = yc - P0.grip;
    /* one fixed camera on the whole mouse and the scales under it */
    const box = [LM, 290, 1100, 600], cf = camFit([-64, -44, 128, 60], box, 0.06), draw = fn => withCam(cf, box, fn), P = draw(null), S0 = cf.s;
    const k2 = ep(t, 4.9, 5.3), kScale = 1 - ep(t, 4.6, 5.0);
    draw(() => {
      if (k2 > 0.003) { G.save(); G.globalAlpha = PA * k2; G.strokeStyle = C.hair; G.lineWidth = lw(2); G.beginPath(); G.moveTo(-64, 0); G.lineTo(64, 0); G.stroke(); G.restore(); }
      /* the battery: the block below, at KEY_PARTS's place (the kit's outline, mouseSimple, draws the shell only) */
      mouseSimple('left', { alpha: lerp(0.4, 1, ep(t, 0.8, 1.2)) });
      const bb = KEY_PARTS.battery;
      if (kp[ib] > 0.003) { G.save(); G.globalAlpha = PA * kp[ib]; rrPath(-bz - bb.h / 2, -(by + bb.t / 2) - (1 - kl[ib]) * 30, bb.h, bb.t, 0.8); G.fillStyle = rgba(C.hero, 0.18); G.fill(); G.strokeStyle = C.hero; G.lineWidth = lw(2); G.stroke(); G.restore(); }
    });
    /* the scales under the skates */
    const front = m * (zc - F.zr) / (F.zf - F.zr), rear = m - front;
    b07_scale({ draw, P }, F.zf, Math.max(0, front), kScale);
    b07_scale({ draw, P }, F.zr, Math.max(0, rear), kScale);
    if (kScale > 0.003) { const pf = P(-F.zf, 12.5), pr = P(-F.zr, 12.5); text('Front skates', pf[0], pf[1] + 4, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: kScale }); text('Rear skates', pr[0], pr[1] + 4, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: kScale }); }
    /* the weights, each at its centroid, sized by its grams; in the second half only the battery keeps its label */
    const lab = { Shell: [1, -1, 'left'], Buttons: [0, -1, 'center'], 'Side switches': [0, -1, 'center'], Board: [-1, 2, 'right'], Wheel: [-1, 0, 'right'], 'Screws, wires, coat': [1, 2, 'left'], Battery: [0, -1, 'center'] };   /* the battery's label above its block: below its dot it ran into the dot, beside it past the tail (main, 19:3x) */
    const kD = 1 - 0.7 * ep(t, 4.6, 5.0), kLab = 1 - ep(t, 4.6, 5.0);
    cur.forEach((p, i) => {
      if (kp[i] <= 0.003) return;
      const q = P(-p.z, -p.y - (1 - kl[i]) * 30), r = 6 + 7 * Math.sqrt(p.g), a = kp[i] * (p.batt ? 1 : kD);
      circle(q[0], q[1], r, { fill: p.batt ? C.hero : C.comp, alpha: a * 0.9 });
      const [lx, ly0, al] = lab[p.name], ly = p.batt && up > 0.5 ? -1 : ly0, la = kp[i] * (p.batt ? 1 : kLab);
      const tx = q[0] + lx * (r + 8), ty = ly === 2 ? P(0, 0)[1] + 30 : p.batt && ly === -1 ? q[1] - (r + 34) : q[1] + ly * (r + 10) + (ly === 0 ? 7 : 0);   /* the battery's label clears the grip and lever lines drawn above its block later */
      if (la > 0.003) text(p.batt ? 'Battery ' + b07_gTxt(p.g) + ' g' : p.name, tx, ty, { role: 'label', size: 19, color: p.batt ? C.heroText : C.ink2, align: al, alpha: la * (ly === 2 ? kScale : 1) });
    });
    /* the balance point, and the trail it leaves as parts go in */
    const qc = P(-zc, -yc);
    if (m > 0) {
      for (let i = 0; i < parts.length; i++) {
        if (t < tl[i] + 0.4) continue;
        let mm = 0, z1 = 0, y1 = 0; for (let j = 0; j <= i; j++) { mm += parts[j].g; z1 += parts[j].g * parts[j].z; y1 += parts[j].g * parts[j].y; }
        const q = P(-z1 / mm, -y1 / mm); circle(q[0], q[1], 4, { fill: C.faint, alpha: 0.8 * kLab });
      }
      b07_comMark(qc[0], qc[1], 14, kp[0]);
      if (t >= 4.0 && t < 4.9) fixTag(t, 4.0, [qc[0] + 10, qc[1] - 10], Math.abs(BAL.low.z) <= 1 ? 'At the centre, within a millimetre' : fmtN(Math.abs(BAL.low.z), 1) + ' mm ahead of the centre', { to: [qc[0] + 70, qc[1] - 150], side: 'r', alpha: 1 - ep(t, 4.6, 4.9) });
    }
    /* phase 2: the grip line, the balance point's height, the lever between them */
    if (k2 > 0.003) {
      const gL = P(-60, -P0.grip), gR = P(60, -P0.grip), xr = P(61.5, 0)[0];
      line(gL[0], gL[1], gR[0], gR[1], { color: C.hero, w: 2, dash: [8, 6], alpha: k2 });
      const pl = P(-60, 0); text('Grip line: the flat low sides, ' + fmtN(P0.grip, 0) + ' mm up', pl[0], pl[1] + 34, { role: 'label', size: 19, color: C.heroText, alpha: k2 });
      const bad = lever > 1, col = bad ? C.red : C.ink2;
      line(qc[0] + 16, qc[1], xr, qc[1], { color: col, w: 1.5, dash: [3, 4], alpha: k2 * 0.8 });
      b07_bracket(xr + 4, qc[1], gR[1], col, k2, null, { dir: 1, w: 2 });
      const ym = (qc[1] + gR[1]) / 2;
      text(b07_lvTxt(lever, up < 0.5) + ' mm', xr + 24, ym - 2, { role: 'num', size: 26, weight: 750, color: bad ? C.red : C.ink, alpha: k2, tnum: true });
      text('lever', xr + 24, ym + 24, { role: 'small', size: 21, weight: 650, color: C.mute, alpha: k2 });
      /* the flicks: the hand pushes at the grip, the weight lags at the balance point */
      const f1 = ep(t, 6.3, 6.6) * (1 - ep(t, 7.3, 7.6)), f2 = ep(t, 8.5, 8.8) * (1 - ep(t, 9.4, 9.7)), fk = Math.max(f1, f2);
      if (fk > 0.003) {
        /* the push on the grip line, ending at the balance point's left; the lag at the balance point's own height: when the
           two are on one line there is no lever */
        const pg = P(-zc, -P0.grip);
        forceArrow(pg[0] - 18, pg[1], Math.PI, 110, { k: fk, color: C.ink });
        forceArrow(qc[0] + 18 + 90, qc[1], 0, 90, { k: fk, color: C.red });
      }
      const pn = P(-56, -14);
      if (t >= 6.35 && t < 7.6) faultTag(t, 6.35, pn, 'It rocks: the nose lifts', { to: [pn[0] + 50, pn[1] - 120], side: 'r', alpha: 1 - ep(t, 7.35, 7.6) });
      if (t >= 8.7) fixTag(t, 8.7, pn, 'It stays flat', { to: [pn[0] + 50, pn[1] - 120], side: 'r' });
    }
    /* the pointer that moves the battery */
    { const ka = ep(t, 5.0, 5.3) * (1 - ep(t, 6.1, 6.4)) + ep(t, 7.2, 7.5) * (1 - ep(t, 8.3, 8.6)); if (ka > 0.003) { const q = P(-bz, -by); cursorPtr(q[0] + 6, q[1] + 4, { a: ka, grab: (t > 5.3 && t < 6.1) || (t > 7.5 && t < 8.3) }); } }
    /* the right column: the parts as they go in; then the twist and the result */
    const rx = LM + 1180, rw = RM - rx, kL = 1 - ep(t, 4.6, 5.0);
    if (kL > 0.003) {
      text('Weights going in', rx, 330, { role: 'label', size: 21, color: C.mute, alpha: kL * ep(t, 0.7, 1.0) });
      parts.forEach((p, i) => {
        const a = kL * kp[i], yy = 376 + i * 40; if (a <= 0.003) return;
        text(p.target ? p.name + ' (target)' : p.name, rx, yy, { role: 'small', size: 25, weight: 620, color: p.batt ? C.heroText : C.ink2, alpha: a });
        text(fmtN(p.g, 2) + ' g', rx + rw, yy, { role: 'num', size: 25, weight: 700, color: p.batt ? C.heroText : C.ink, align: 'right', alpha: a, tnum: true });
      });
      const kt = kL * ep(t, 3.7, 4.0), yT = 376 + parts.length * 40 + 4;
      if (kt > 0.003) {
        line(rx, yT - 22, rx + rw, yT - 22, { color: C.hair, w: 1.5, alpha: kt });
        text('Balance point', rx, yT + 14, { role: 'small', size: 25, weight: 700, color: C.ink, alpha: kt });
        if (Math.abs(BAL.low.z) <= 1) text('at the middle, within 1 mm', rx + rw, yT + 14, { role: 'small', size: 25, weight: 700, color: C.heroText, align: 'right', alpha: kt });
        else { text(fmtN(Math.abs(BAL.low.z), 1) + ' mm ' + (BAL.low.z > 0 ? 'ahead of' : 'behind') + ' the middle', rx + rw, yT + 14, { role: 'small', size: 25, weight: 700, color: C.red, align: 'right', alpha: kt });
          /* the lighter battery's place is the layout's to re-run (H4): said, in red, as the deck says a gap */
          text('The ' + b07_gTxt(B07_BUD.batt) + ' g battery sits where the ' + b07_gTxt(typeof ntr_oldPack === 'function' ? ntr_oldPack().g : 8) + ' g one balanced: its place is to be re-run', rx, yT + 50, { role: 'small', size: 20, weight: 600, color: C.red, alpha: kt, maxW: rw }); }
      }
    }
    const k3 = ep(t, 5.0, 5.5);
    if (k3 > 0.003) {
      text('Twist in a flick', rx, 330, { role: 'label', size: 21, color: C.mute, alpha: k3 });
      text('mass × acceleration × lever', rx, 382, { font: 'disp', size: 34, weight: 700, color: C.ink, caps: false, alpha: k3 });
      text('The lever: how far the balance point sits above where the hand pushes.', rx, 426, { role: 'small', size: 23, weight: 560, color: C.mute, maxW: rw, lh: 1.3, alpha: k3 });
      /* the legend for the two arrows on the mouse */
      const kg = ep(t, 6.2, 6.5);
      if (kg > 0.003) {
        arrow(rx + 44, 510, rx, 510, { color: C.ink, w: 3, hs: 11, alpha: kg }); text('your push, at the grip', rx + 60, 517, { role: 'small', size: 23, weight: 620, color: C.ink2, alpha: kg });
        arrow(rx, 552, rx + 44, 552, { color: C.red, w: 3, hs: 11, alpha: kg }); text('the weight lags, at the balance point', rx + 60, 559, { role: 'small', size: 23, weight: 620, color: C.red, alpha: kg });
      }
      const kb = ep(t, 5.6, 6.0), kc = ep(t, 7.4, 7.8);
      text('A palm high on the hump pushes higher up: a higher battery suits it. Some mice carry it there: the G Pro X Superlight\'s is glued to its top shell (iFixit).', rx, 598, { role: 'small', size: 22, weight: 620, color: C.secondText, maxW: rw, lh: 1.3, alpha: kb });
      text('Theseus is held on its flat low sides: its battery sits low, on the grip.', rx, 706, { role: 'small', size: 24, weight: 650, color: C.heroText, maxW: rw, lh: 1.3, alpha: kc });
    }
    /* one decimal at most: the parts' heights are known to about a millimetre (model audit M-b07-5), so the low battery is
       "at the grip", not a percentage cut; with F44.2's side switches it sits 0.6 mm above, so "within a millimetre" */
    verdict(t, 8.8, rx, 884, { from: +b07_lvTxt(BAL.lvHigh, false), to: +b07_lvTxt(BAL.lvLow, true), unit: 'mm', dec: 1, label: 'Balance above the grip', better: 'lower', who: ['Battery in the hump', 'Theseus'], size: 96, net: 'At the grip', netWord: 'within a millimetre', maxW: rw });
    source(t, 'Derived, H2\'s balance model: the ' + fmtN(THESEUS.mass, 2) + ' g budget at the 3D centroids (the board at ' + fmtN(B07_BUD.board, 2) + ' g; side switches and four boss posts, estimated, inside the shell\'s 9.35 g); battery ' + (Math.abs(BAL.low.z) <= 1 ? 'set where the mouse balances' : 'at the place H2 set for the 8 g pack it replaced') + '. Twist = m·a·lever. Rock not to scale.', { t0: 2.0, maxW: rx - LM - 60 });
  }
}));

