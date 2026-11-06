/* ============================================================================================
   B03 · CLICKS II: THE SWITCH AND THE SIGNAL (revamp v2, 2026-11-06). Eight slides, in film order:
     b03_switch    A mechanical switch, for the battery        (replaces clk_switch)
     b03_binning   Provable switch binning                     (replaces clk_switch2)
     b03_spdt      Single pole, double throw                   (replaces clk_spdt)
     b03_timing    Negative latency                            (replaces latency, clk_wait, clk_methods)
     b03_debounce  Debounce: low, and yours to set             (replaces clk_debounce)
     b03_hotswap   Hot-swap switches, no solder                (replaces clk_hotswap)
     b03_rail      Four ways to guide a side rail              (new, F44.1; before: 'b03_side', FILM F36)
     b03_side      Dual rail side buttons                      (replaces sidebuttons; the chapter's last slide)
   Every top-level name here starts with b03_ (or B03). Shared drawings are called, never redrawn: the GT01 is clk_gt01MM
   (H1 owns it), a full-size SPDT switch is swMM (03-parts.js), the claw socket's numbers are the 3D asset's
   (3d/parts/millmax3305.js). The motion kit (06-motion.js) supplies the mouse, the camera, the finger, the verdict.
   ============================================================================================ */
Object.assign(SRC, {
  b03_logiHybrid: { t: 'Logitech support, "What is the difference between Hybrid and optical-only mode of the LIGHTFORCE switch?": optical-only mode "runs the IR LED and optical sensor full time, and can reduce battery life"; hybrid mode "uses the galvanic contact to turn on the IR LED ... saving power" (a maker on its own switch)', u: 'https://support.logi.com/hc/en-us/articles/16237236344727-What-is-the-difference-between-Hybrid-and-optical-only-mode-of-the-LIGHTFORCE-switch' },
  b03_d2fp: { t: 'Omron D2FP-FN2 datasheet (mirror): operating force 0.59 ± 0.15 N; LED tested at IF = 5 mA, pulse drive 30 µs ON, 970 µs OFF; four terminals and a dummy; approx. 0.54 g; 70 million operations', u: 'https://static.chipdip.ru/lib/509/DOC042509999.pdf' },
  b03_razerV4: { t: 'Razer, Viper V4 Pro page: Optical Mouse Switches Gen-4 with "no debounce delay"; an optical scroll wheel; "Mechanical Side Buttons" at 0.33 ms against a "Non-Razer Brand X" at 1.65 ms; up to 180 hours of battery life (maker claims)', u: 'https://www.razer.com/gaming-mice/razer-viper-v4-pro' },
  b03_razerStaff: { t: 'Razer staff online, via Brock (2026-11-05, F31.1): the Viper V4 Pro\'s optical switches and optical wheel take "almost half" of its battery. No public source found (Razer\'s pages and blog, Razer Insider, reviews searched 2026-11-05 and 11-06): shown as a claim', u: '' },
  b03_eloSwitches: { t: 'EloShapes spec sheets via research/data/mice.json (35 flagships, 2023 to 2026): 16 ship optical main switches and 3 (Logitech LIGHTFORCE) optical-mechanical hybrids', u: 'https://www.eloshapes.com/' },
  b03_ganssle: { t: 'Jack G. Ganssle, "A Guide to Debouncing" (2004, rev. 2008), as used in university embedded-systems courses (Univ. of Utah CS 5780, Univ. of Washington CSE 466): 16 switches averaged 1,557 µs of bounce, worst 6,200 µs; with a double-throw switch and a set-reset latch the contact "may bounce around a bit, but will never bang all the way back to the other contact"', u: 'https://my.eng.utah.edu/~cs5780/debouncing.pdf' },
  b03_toms: { t: 'Daniel Sauvageau, "Hacking Your Mouse To Fix The Misclick Of Doom", Tom\'s Hardware (2016-03-20): a new switch takes at least 840 µs from NC to NO and bounces about 500 to 800 µs on NO; a worn one can take over 10 ms to break NC; "Not all mice use SPDT switches", and the SPDT mice he saw read them as single throw; a settle-and-wait debounce adds at least 4 ms at 1,000 checks a second', u: 'https://www.tomshardware.com/uk/reviews/hack-mouse-click-do-it-yourself,4458-3.html' },
  b03_tpuHati: { t: 'TechPowerUp, G-Wolves Hati-S Plus 4K review: at the lowest debounce setting "eager-type debouncing is used ... no additional latency is introduced compared to defer-type"; "Higher debounce settings add higher levels of defer-type debouncing, which increase click latency"', u: 'https://www.techpowerup.com/review/g-wolves-hati-s-plus-4k/8.html' },
  b03_fnatic: { t: 'Fnatic help, "How To Change Click Debounce": 0 to 20 ms; "Lower debounce settings may result in the occurrence of double clicks or slam clicking"; it recommends 4 ms or higher, and 0 ms for highly competitive play (a maker\'s own guidance)', u: 'https://help.fnatic.com/support/solutions/articles/77000554472-how-to-change-click-debounce' },
  b03_razerInsider: { t: 'Razer Insider forum, user post (2022-05-12), "ADD ADJUSTABLE DEBOUNCE FOR THE RAZER VIPER V2 PRO": a Minecraft player who wants double clicks for clicks per second; "FPS and Minecrafter\'s could BOTH be good with it"', u: 'https://insider.razer.com/mice-and-surfaces-9/add-adjustable-debounce-for-the-razer-viper-v2-pro-36693' },
  b03_redlotus: { t: 'Red Lotus guide (Minecraft screensharing), "Definition and mouse abuse": very low debounce lets the vibrations of drag and butterfly clicking register as separate clicks; most mice default to roughly 8 to 10 ms', u: 'https://itzicehere.gitbook.io/redlotusguide/screensharing-minecraft-knowledge/sixth-section-mouse-macro-and-input-analysis-in-screensharing/3-debounce-time-analysis/definition-and-mouse-abuse' },
  b03_ifixit: { t: 'Kevin Purdy, iFixit (2022-02-16), "More PC Gaming Mice Should Follow ROG\'s Repairable Switches": the switches "can wear out", single clicks become double clicks; a swap "usually involves de-soldering around a dozen contact points"; ROG ships push-fit sockets', u: 'https://www.ifixit.com/News/57357/more-pc-gaming-mice-should-follow-rogs-repairable-switches' },
  b03_millmax: { t: 'Mill-Max 3305 receptacle: takes round leads 0.635 to 0.940 mm, 1.575 mm mounting hole, solder mount, 1,000 cycles minimum, 10 mΩ max; flange Ø 1.956, body Ø 1.473, 2.667 mm long, a six-finger beryllium-copper (C17200) contact with 30 µin gold (as this deck\'s 3D part has it, 3d/parts/millmax3305.js)', u: 'https://www.mill-max.com/products/receptacle/3305' },
  b03_egg: { t: 'Endgame Gear, OP1 8k v2 page: Kailh GX switches in an SPDT configuration, "hot-swappable main button switches", GX Speed mode about 1.4 ms quicker (maker claims)', u: 'https://endgamegear.com/products/op1-8k-v2-wired-gaming-mouse' },
  b03_tpuHyper: { t: 'TechPowerUp, Hitscan Hyperlight review: the side buttons use "2-pin low-profile switches from TTC", on "their own PCB screwed to the top shell and connected to the main PCB through a ribbon cable"', u: 'https://www.techpowerup.com/review/hitscan-hyperlight/4.html' },
  b03_gateronRail: { t: 'Gateron, Dual-rail Lunar Probe switch page: a "reinforced stem-guided rail structure for smoother keypress alignment and long-term stability"; operating force 45 ± 15 gf (a keyboard switch)', u: 'https://www.gateron.com/products/gateron-dual-rail-lunar-probe-switch' },
  b03_gt01: { t: 'MechKeys (2024-10-08), Gateron at ZFX Shenzhen: the GT01 operates at 55 ± 5 g over 0.35 ± 0.10 mm, "Zero Preload", 100 million clicks (maker claim; no datasheet published)', u: 'https://mechkeys.com/blogs/news/gateron-launched-magnetic-jade-gaming-switch-and-gt01-microswitch-at-zfx-shenzhen-exhibition' },
  b03_kailh: { t: 'MechKeys, Kailh GM8.0 listing: operating force 65 ± 10 gf (60 ± 5 gf for the upgraded edition)', u: 'https://mechkeys.com/products/kailh-gm8-0-micro-switch' },
  b03_pang: { t: 'Pang, Tan and Durlach (1991), "Manual discrimination of force using active finger motion", Perception & Psychophysics 49: 531 to 540: a just noticeable difference of roughly 7 % of the reference force (squeezes of 2.5 to 10 N)', u: 'https://link.springer.com/article/10.3758/BF03212187' },
  b03_gpx2Hours: { t: 'TechPowerUp, Logitech G Pro X Superlight 2 review (Logitech\'s figures): "if set to 1000 Hz, battery life will be 96 hours in optical switch mode and 104 hours in hybrid switch mode"; 290 mAh battery. Two switches\' optics full time: about 0.23 mA, 0.116 mA a switch (derived)', u: 'https://techpowerup.com/review/logitech-g-pro-x-superlight-2/7.html' },
  b03_openstax: { t: 'OpenStax, University Physics Volume 1, §10.6 Torque, Fig. 10.31: torque illustrated by a door on its hinges; "a door opens slowly if we push too close to its hinges"; |τ| = r⊥ F (read at a CC mirror)', u: 'https://openstax.org/books/university-physics-volume-1/pages/10-6-torque' },
  b03_eggBins: { t: 'TechPowerUp, Endgame Gear OP1we: "Kailh GO switches binned for an actuation force of 60-65 gf", sold separately; XM1r: "pre-sorted Kailh GM 8.0 (80 M) switches with an operating force of 55-60 gf" (bands, no published spreads)', u: 'https://techpowerup.com/review/endgame-gear-op1we/4.html' },
  b03_mvp: { t: 'TechPowerUp, Gamesense MVP Wireless and Wired: the side buttons use "Another pair of Kailh GM 4.0 (60 M) switches", full-size, on a side PCB with a 3-pin connector', u: 'https://techpowerup.com/review/gamesense-mvp-wireless/4.html' },
  b03_brockDoc: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse": #14 claw-spring hot-swap (Mill-Max 3305); #64 side buttons held by their switches (as on the Hitscan Hyperlight); #78 mechanical mains, "much more power efficient than optical microswitches"; #79 negative latency via SPDT; #80 dual rail side buttons, "sliding rails instead of a bending mechanism"; brainstorm: "omron opticals being 10gf weaker at 60gf is quite noticeable", mechanical SPDT lets the debounce timer go to zero, "likely making minecraft kids very happy"', u: '' }
});

/* ============================== shared numbers (every figure on these slides is computed here) ============================== */
const B03 = {
  /* the battery (b03_switch): an optical switch's LED at Omron's datasheet drive, against a Viper V4 Pro's whole draw */
  ledMA: 5, onUs: 30, perUs: 1000,              /* D2FP-FN2: IF 5 mA, 30 µs ON, 970 µs OFF */
  v4mAh: 306, v4h: 180,                         /* Vortex Gaming (clk_vortexV4), Razer (clk_razerV4bat), at 1 khz */
  mechUA: 3,                                     /* a mechanical contact draws nothing itself; reading it does. SPDT's NC is closed
                                                    at rest, so a pull-up left on through it draws V/R all the time (Nordic's
                                                    ~13 kΩ: 0.14 mA at 1.8 V, as much as an optical LED). Read by strobing the
                                                    pull-ups (or ~1 MΩ ones), about 3 µA a switch: a firmware commitment */
  /* the switch's force spec (b03_binning, b03_side) */
  gt01: { f: 55, tol: 5, travel: 0.35 },        /* Gateron claim */
  d2fp: { f: 60.2, tol: 15.3 },                 /* Omron datasheet: 0.59 ± 0.15 N */
  jnd: 0.07,                                    /* Pang, Tan, Durlach 1991 */
  bin: 1.5,                                     /* Theseus's bin, ± gf (proposal): two switches within 3 gf, under the 7 % (3.85 gf) of 55 a finger
                                                   can feel; ±2 would allow 4 gf, 7.3 %, just over it */
  /* timing (b03_timing, b03_spdt): ms from the moment the pole leaves NC */
  flightMs: 1.5,                                /* XBAB: NC edge precedes NO by ~1.5 ms; Tom's: at least 0.84 ms */
  tgtUs: 70, xa25Us: 72.04,                     /* F18.5 target; XBAB XA25 NC release, still, n 500 */
  debounceSet: 4, debounceCost: 3.0,            /* TechPowerUp, Lamzu Atlantis: a 4 ms setting cost 3.0 ms (5.4 − 2.4) */
  motionUs: 121,                                /* XBAB: the OP1 8k v2 adds 121 to 125 µs moving */
  /* the side buttons' lever (b03_side), an illustration: a 14.5 mm button (the 3D shell's side buttons are 14.6 and 14.9 mm)
     hinged at one end, its nub 9 mm out, pressing the same 55 gf switch the rail uses, so only the mechanism differs */
  btnL: 14.5, nubA: 9.0, spots: [3.0, 7.25, 12.375],   /* 165, 68.3 and 40 gf on the hinge */
  /* the claw socket (b03_hotswap) */
  cycles: 1000
};
/* two derivations of what an optical switch costs (BROADCAST-0945: the film claims the lower, never rounded our way):
   Logitech's own hours for the G Pro X Superlight 2 (TechPowerUp: 96 h optical-only, 104 h hybrid at 1 khz, 290 mAh) give
   0.116 mA a switch; Omron's D2FP datasheet test pulse gives 0.15 mA (the upper one, shown beside it) */
B03.logi = { mAh: 290, hOpt: 96, hHyb: 104 };
B03.optMA = (B03.logi.mAh / B03.logi.hOpt - B03.logi.mAh / B03.logi.hHyb) / 2;   /* 0.116 mA a switch (Logitech's hours) */
B03.omronMA = B03.ledMA * B03.onUs / B03.perUs;                     /* 0.15 mA a switch (Omron's pulse) */
B03.v4MA = B03.v4mAh / B03.v4h;                                     /* 1.70 mA */
B03.optShare = 2 * B03.optMA / B03.v4MA;                            /* 13.67 %, printed 13.6 % */
B03.omronShare = 2 * B03.omronMA / B03.v4MA;                        /* 17.65 %, printed 17.6 % */
B03.mechShare = 2 * B03.mechUA / 1000 / B03.v4MA;                   /* 0.35 %, printed 0.4 % (our own cost never rounded down) */
B03.lifeH = B03.v4mAh / (B03.v4MA - 2 * B03.optMA + 2 * B03.mechUA / 1000);   /* 207.6 h on the same battery */
B03.lifeGain = B03.lifeH / B03.v4h - 1;                             /* +15.4 %: printed +15 % (never rounded up) */
/** the side button on a hinge: the thumb's force to click at s mm from the hinge, gf (a lever: F × s = F_switch × a) */
const b03_leverF = s => B03.gt01.f * B03.nubA / s;
B03.leverSpread = b03_leverF(B03.spots[0]) / b03_leverF(B03.spots[2]);   /* 4.125×, printed 4.1× */
/** the force to click as printed, gf (FILM F3: click weights in gf): the hinge's floored (a rival's fault is never rounded
   up: 68.3 → 68), the rail's the switch's own 55 gf */
const b03_hingeGf = s => Math.floor(b03_leverF(s) + 1e-9), b03_railGf = () => B03.gt01.f;
/** a count kept honest: never rounded up (G5) */
const b03_floor = (v, d = 0) => (Math.floor(v * Math.pow(10, d) + 1e-9) / Math.pow(10, d)).toFixed(d);

/* ============================== drawing helpers ============================== */
/** fill and edge a path in the deck's part style (fn draws the path) */
function b03_fill(fn, fill, edge, px = 1.1) { fn(); G.fillStyle = fill; G.fill(); if (edge) { G.strokeStyle = edge; G.lineWidth = lw(px); G.lineJoin = 'round'; G.stroke(); } }
/** a closed polygon with rounded corners: r a number or one radius per corner */
function b03_path(pts, r = 0) {
  const n = pts.length; G.beginPath();
  if (!r) { pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.closePath(); return; }
  G.moveTo((pts[0][0] + pts[n - 1][0]) / 2, (pts[0][1] + pts[n - 1][1]) / 2);
  for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n], ri = Array.isArray(r) ? r[i] : r; if (ri > 0) G.arcTo(p[0], p[1], q[0], q[1], ri); else G.lineTo(p[0], p[1]); }
  G.closePath();
}
const B03C = {
  shell: () => TH ? '#4B4C53' : '#3A3B42', shellLite: () => TH ? '#6A6B72' : '#4D4E55', black: () => TH ? '#2B2C31' : '#26272C',
  pom: () => TH ? '#FAFAFA' : '#E5E5EA', fr4: () => '#45483D',   /* the cut face of a board, muted (as pcbSec draws it, 09:30) */ copper: '#C98A4E',
  mask: '#16171A', enig: '#D9B25A', maskRival: () => C.comp,   /* boards (G3, F35.1): Theseus's black with gold pads; a rival's grey */
  gold: '#D9AA4C', goldDark: '#A9822F', tin: () => TH ? '#C9CDD2' : '#AEB3BA', wire: ['#C98A4E', '#9DA3AA', '#C9CDD2'],
  rail: () => TH ? '#8E8E93' : '#5C5D64'   /* the shipping side-button moulding: a quiet grey (a rival is never coloured) */
};

/* ============================== b03_side: the side buttons, cut at button height and seen from above ==============================
   Both drawings share one frame and one scale (common.md M3): mm, x inward from the shell's outer face (the button's face at
   rest is x = 0), y toward the tail, the button's centre at y = 0; the button 14.5 mm long and 1.2 mm thick, the side wall
   1.1 mm. Everything moves at its true size (no exaggeration): a ghost of the rest position shows the travel. */
const B03_SIDE = { L: 14.5, th: 1.2, wall: 1.1, gap: 0.35, far: 14.6 };
/** cut shell (hatched), as one moulding: pts a polygon (or several, wound opposite to cut holes) */
function b03_cut(paths, box, o = {}) {
  solid(() => { G.beginPath(); for (const pts of paths) { pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.closePath(); } }, MT.shell, box, { fill: o.fill || B03C.shell(), ec: edgeCol(MT.shell), hatch: true });
}
/** the shell's side wall either side of the button's opening, cut, ending in break lines */
function b03_sideWall() {
  const S = B03_SIDE, h = S.L / 2 + S.gap;
  /* the simplified mouse draws each side button as a pill straddling the outline: the section replaces them (the rear
     button's too, which sits just past this cut) */
  G.save(); G.fillStyle = C.bg; G.fillRect(-2.4, -S.far, 2.4, 2 * S.far); G.fillStyle = TH ? '#FFFFFF' : '#1A1B1E'; G.fillRect(S.wall - 0.05, -S.far, 0.9, S.far - h); G.fillRect(S.wall - 0.05, h, 0.9, S.far - h); G.restore();
  for (const s of [-1, 1]) solid(() => { G.beginPath(); G.moveTo(0, s * h); G.lineTo(0, s * S.far); brk(0, s * S.far, s * S.far, 0); G.lineTo(S.wall, s * S.far); G.lineTo(S.wall, s * h); G.closePath(); }, MT.shell, [0, Math.min(s * h, s * S.far), S.wall, S.far - h], { fill: B03C.shell(), ec: edgeCol(MT.shell), hatch: true });
}
/** a ghost of a part's rest outline: dashed, quiet */
function b03_ghost(fn, a = 1) { G.save(); fn(); G.setLineDash([lw(5), lw(4)]); G.strokeStyle = inkA(0.42 * a); G.lineWidth = lw(1.2); G.stroke(); G.setLineDash([]); G.restore(); }

/** the side button that ships today (Brock's photos: one moulded part carrying both buttons, clipped inside the wall; the
   Hitscan Hyperlight's teardown: 2-pin low-profile switches on their own board, a ribbon cable to the main board). The
   button hangs on a thin living hinge at its front end; a nub 9 mm down it presses a 2-pin mini switch (single throw) on a
   side board. o = { at: the thumb's spot, mm from the hinge end; press 0..1 of the way to the click; over 0..1 on past it
   (the switch bottoms; a press beyond the nub then bends the button) }. Returns stage points and the state */
function b03_hingeMM(o = {}) {
  const S = B03_SIDE, L = S.L, y0 = -L / 2, hy = y0 - 0.5, hx = 0.55, a = B03.nubA, at = o.at == null ? L * 0.5 : o.at;
  const yN = y0 + a, uClick = 0.25, uBottom = 0.4, out = {}, pr = clamp(o.press || 0), ov = clamp(o.over || 0);
  const uN = pr * uClick + ov * (uBottom - uClick), th = uN / (yN - hy);
  const bendTip = at > a + 1 ? ov * 0.34 * Math.pow((at - a) / (L - a), 1.2) : 0;
  const railC = B03C.rail(), eR = edgeCol(MT.shell);
  b03_sideWall();
  /* the moulding that carries the button, clipped behind the wall above the opening, and its hinge */
  solid(() => b03_path([[S.wall, hy - 4.4], [S.wall + 1.4, hy - 4.4], [S.wall + 1.4, hy + 0.05], [hx + 0.2, hy + 0.05], [hx + 0.2, hy - 0.3], [S.wall, hy - 0.3]], 0.1), MT.shell, [S.wall, hy - 4.4, 1.4, 4.4], { fill: railC, ec: eR, hatch: true });
  /* the side board on its standoffs, its mini switch, two legs, and the ribbon cable to the main board */
  const bx0 = 4.6, bx1 = 5.4;
  solid(() => { G.beginPath(); G.rect(bx0, -9.6, bx1 - bx0, 19.2); }, MT.fr4, [bx0, -9.6, bx1 - bx0, 19.2], { fill: B03C.fr4(), ec: edgeCol(MT.fr4), hatch: { sp: 4 } });
  G.save(); G.fillStyle = B03C.maskRival(); G.fillRect(bx0, -9.6, 0.07, 19.2); G.fillRect(bx1 - 0.07, -9.6, 0.07, 19.2); G.restore();   /* its mask: a rival's board, grey */
  const sw0 = yN - 3, sw1 = yN + 3, act = Math.min(uN, uBottom);
  solid(() => pathRR(2.6, sw0, bx0 - 2.6, sw1 - sw0, 0.25), MT.black, [2.6, sw0, bx0 - 2.6, sw1 - sw0], { fill: B03C.black(), ec: edgeCol(MT.black) });
  solid(() => pathRR(2.05 + act, yN - 0.6, 0.62, 1.2, 0.18), MT.black, [2.05, yN - 0.6, 0.62, 1.2], { fill: TH ? '#55565C' : '#55565C', ec: edgeCol(MT.black) });
  for (const py of [yN - 1.9, yN + 1.9]) solid(() => { G.beginPath(); G.rect(bx1, py - 0.22, 0.6, 0.44); }, MT.tin, [bx1, py - 0.22, 0.6, 0.44], { fill: B03C.tin(), ec: edgeCol(MT.tin) });
  const cab = () => { G.beginPath(); G.moveTo(bx1, -6.4); G.bezierCurveTo(bx1 + 2.2, -6.4, bx1 + 1.4, -2.0, bx1 + 4.2, -1.6); G.lineTo(bx1 + 5.6, -1.6); };
  G.save(); cab(); G.strokeStyle = TH ? '#C9A35B' : '#B89049'; G.lineWidth = lw(10); G.lineCap = 'butt'; G.stroke(); G.restore();
  G.save(); cab(); G.strokeStyle = 'rgba(0,0,0,0.3)'; G.lineWidth = lw(1); G.setLineDash([lw(2.5), lw(2.5)]); G.stroke(); G.restore();
  out.board = SP(bx1, 5.2); out.mini = SP((2.6 + bx0) / 2, sw1); out.cable = SP(bx1 + 4.6, -1.6); out.act = SP(2.3, yN - 0.6);
  /* the button: its rest outline as a ghost, then turned about the hinge, and bent beyond the nub when pressed there */
  const bend = y => (y > y0 + a && bendTip) ? bendTip * Math.pow((y - y0 - a) / (L - a), 2) : 0;
  const outline = (bd) => { G.beginPath(); G.moveTo(hx + 0.18, hy); G.lineTo(hx + 0.18, y0); G.lineTo(S.th, y0);
    for (let y = y0; y <= y0 + L - 0.4 + 1e-9; y += 0.25) G.lineTo(S.th + bd(y), y);
    G.quadraticCurveTo(S.th + bd(y0 + L), y0 + L, S.th - 0.4 + bd(y0 + L), y0 + L); G.lineTo(0.4 + bd(y0 + L), y0 + L); G.quadraticCurveTo(bd(y0 + L), y0 + L, bd(y0 + L - 0.4), y0 + L - 0.4);
    for (let y = y0 + L - 0.4; y >= y0 - 1e-9; y -= 0.25) G.lineTo(bd(y), y);
    G.lineTo(hx - 0.18, y0); G.lineTo(hx - 0.18, hy); G.closePath(); };
  if (pr > 0.02) b03_ghost(() => outline(() => 0));
  xsave(); xmove(hx, hy); xturn(-th); xmove(-hx, -hy);
  solid(() => outline(bend), MT.shell, [0, y0, S.th, L], { fill: railC, ec: eR, hatch: true });
  solid(() => pathRR(S.th - 0.12, yN - 0.6, 2.05 - S.th + 0.12, 1.2, 0.2), MT.shell, [S.th, yN - 0.6, 0.85, 1.2], { fill: railC, ec: eR, hatch: true });
  const Mh = XF.m.slice();
  out.hinge = SP(hx, hy + 0.1); out.nub = SP(2.0, yN); out.face = y => SPm(Mh, bend(y), y); out.tip = SP(bend(y0 + L - 0.5), y0 + L - 0.5);
  out.M = Mh;
  xrest();
  out.uN = uN; out.clicked = pr >= 1; out.bend = bendTip; out.yN = yN; out.y0 = y0;
  return out;
}

/** Theseus's side button, in the same cut and scale (F48.1, Brock picked "Tied posts (wire)" from b03_rail): two posts, one
   near each end of the button, each riding between two POM pads in a 5 mm guide of the shell; a central nub rests on the
   full-size SPDT switch's plunger (swMM, the deck's D2F-class drawing, no preload), the switch behind the guides in a pocket
   of the shell; under the posts (hidden, dashed) a stabiliser wire turns in two clips on the shell, its arms up into the two
   posts, so both ends must travel together and nothing tilts (b03_rail's model: only the wire's pivots rub). 0.55 mm in,
   the button lands flat on the guides' outer faces just past the 0.5 mm click: the stop. Three wires from the legs, no side
   board. o = { press 0..1 of the way to the stop }. Everything moves at its true size. */
function b03_railMM(o = {}) {
  const S = B03_SIDE, R = B03.rail, pr = clamp(o.press || 0), stop = 0.55, u = pr * stop, out = {};
  const post = 2.4, pad = 0.54, cl = 0.06, gw = 0.85, gx0 = S.th + stop, gL = 5, gx1 = gx0 + gL, xc = (gx0 + gx1) / 2;
  const tipX = gx1 + 0.3, swTop = tipX + 0.85, ys = [-R.a, R.a];
  const fx = swTop + 6.5 + 0.2, yA = 5.6 + 0.3, yB = 5.6 - 12.8 - 0.3, h = S.L / 2 + S.gap, c0 = swTop + 0.75;
  b03_sideWall();
  /* the shell's pocket round the switch, one moulding with the wall and the guides: a 1 mm wall round the switch and a floor
     its legs pass through */
  const t1 = 0.9, P = [[S.wall - 0.02, -h - t1], [fx + t1, -h - t1], [fx + t1, yA + t1], [c0 + t1, yA + t1], [c0 + t1, h + t1], [S.wall - 0.02, h + t1],
    [S.wall - 0.02, h], [c0, h], [c0, yA], [fx, yA], [fx, yB], [S.wall - 0.02, yB]];
  b03_cut([P], [S.wall, -h - t1, fx + t1 - S.wall, 2 * h + 2 * t1]);
  /* the switch: swMM turned so its top faces the button and its length runs along it; its plunger on y = 0 */
  xsave(); xmove(swTop, 5.6); xturn(-Math.PI / 2); xmove(0, 6.5);
  const sw = swMM({ clear: true, press: Math.min(u / 0.8, 1), accent: C.hero, glow: false });
  xrest();
  out.contact = sw.contact; out.isNO = sw.isNO; out.swBody = sw.body;
  /* the three wires from the legs, gathered into the braided side-button lead (F25.3) toward the main board */
  [1.4, 6.4, 11.4].forEach((lx, k) => { const yy = 5.6 - lx, xe = swTop + 9.0; G.save(); G.beginPath(); G.moveTo(xe - 0.6, yy); G.bezierCurveTo(xe + 1.0, yy, xe + 0.8, -0.6 + k * 0.45, xe + 2.0, -0.6 + k * 0.45); G.lineTo(xe + 2.6, -0.6 + k * 0.45); G.strokeStyle = B03C.wire[k]; G.lineWidth = lw(4.2); G.lineCap = 'round'; G.stroke(); G.restore(); });
  out.pocket = SP(fx + t1, yB + 1.0); out.wires = SP(swTop + 11.6, -0.15);
  /* the stabiliser wire, under the section (hidden, dashed): along the button at the guides' middle, turning in two clips on
     the shell's floor (its pivots), its arms rising into the two posts */
  { const wc = TH ? '#5E636B' : '#B9BEC6';
    G.save(); G.setLineDash([lw(9), lw(5)]); G.lineCap = 'round';
    G.beginPath(); G.moveTo(xc + u, ys[0]); G.lineTo(xc, ys[0] + 1.2); G.lineTo(xc, ys[1] - 1.2); G.lineTo(xc + u, ys[1]); G.strokeStyle = wc; G.lineWidth = lw(4.2); G.stroke();
    for (const cy of [-2.0, 2.0]) { G.beginPath(); G.rect(xc - 1.0, cy - 0.75, 2.0, 1.5); G.strokeStyle = inkA(0.6); G.lineWidth = lw(1.5); G.stroke(); }
    G.restore();
    out.wire = SP(xc, 0.9); out.wireTop = SP(xc, -2.75); out.pivot = SP(xc + 1.0, 2.0); }
  /* the two guides: two walls each, a POM pad on each inner face; their outer faces are the stop */
  for (const yp of ys) for (const sg of [-1, 1]) {
    const yIn = yp + sg * (post / 2 + cl), yPad = sg > 0 ? yIn : yIn - pad, yW = sg > 0 ? yIn + pad : yIn - pad - gw;
    solid(() => pathRR(gx0, yW, gL, gw, 0.1), MT.shell, [gx0, yW, gL, gw], { fill: B03C.shellLite(), ec: edgeCol(MT.shell), hatch: true });
    solid(() => pathRR(gx0 + 0.1, yPad, gL - 0.2, pad, 0.08), MT.pom, [gx0, yPad, gL, pad], { fill: B03C.pom(), ec: edgeCol(MT.pom) });
  }
  out.pad = SP(gx0 + gL * 0.55, ys[1] - post / 2 - cl - pad * 0.5); out.guide = SP(gx0 + gL * 0.5, ys[1] + post / 2 + cl + pad + gw); out.stop = SP(gx0, ys[1] + post / 2 + cl + pad + gw * 0.5);
  out.guideBox = null;   /* the old ~2 mm guide's placeholder flag is gone: the drawing is Brock's pick (F48.1) */
  /* the button, its two posts and the nub on the switch, moved in by u; the rest outline as a ghost */
  const btnP = () => {
    G.beginPath(); G.moveTo(0.4, -S.L / 2); G.lineTo(S.th, -S.L / 2);
    for (const [yp, w] of [[ys[0], post], [0, 1.6], [ys[1], post]]) { const lo = yp - w / 2, hi = yp + w / 2, tx = yp === 0 ? tipX : tipX - 0.15;
      G.lineTo(S.th, lo); G.lineTo(tx - 0.3, lo); G.quadraticCurveTo(tx, lo, tx, lo + 0.3); G.lineTo(tx, hi - 0.3); G.quadraticCurveTo(tx, hi, tx - 0.3, hi); G.lineTo(S.th, hi); }
    G.lineTo(S.th, S.L / 2); G.lineTo(0.4, S.L / 2); G.quadraticCurveTo(0, S.L / 2, 0, S.L / 2 - 0.4); G.lineTo(0, -S.L / 2 + 0.4); G.quadraticCurveTo(0, -S.L / 2, 0.4, -S.L / 2); G.closePath();
  };
  if (pr > 0.02) b03_ghost(btnP);
  xsave(); xmove(u, 0);
  solid(btnP, MT.shell, [0, -S.L / 2, tipX, S.L], { fill: B03C.shell(), ec: edgeCol(MT.shell), hatch: true });
  const Mr = XF.m.slice();
  out.post = SP((S.th + tipX) / 2 + 0.6, ys[1] + post / 2); out.postA = SP((S.th + tipX) / 2, ys[0]); out.face = y => SPm(Mr, 0, y); out.btnIn = SP(S.th, -S.L / 2 + 1.5);
  out.M = Mr;
  xrest();
  out.u = u; out.landed = pr >= 0.999; out.clicked = u >= 0.5 - 1e-6;
  return out;
}

/* ============================== b03_switch: an optical switch, cut open (the rival) ==============================
   A full-size optical microswitch as Omron's D2FP is built (its datasheet: four terminals and a dummy, an LED and a photo
   receiver, 12.8 mm long): the cover is opaque (light must not leak in), so it is drawn cut open. Inside, a snap leaf
   still gives the click its feel, but nothing touches: the plunger's shutter drops into a beam of infrared between an LED
   and a receiver. To see the shutter at all, the LED must flash all the time. Frame as swMM: origin at the bottom left of
   the body, y down, the body 12.8 × 6.5. o = { press 0..1 (of 0.5 mm), flash 0..1 (the LED's light now), board (true) }.
   Returns stage points. */
function b03_opticalMM(o = {}) {
  const Q = SWG, d = clamp(o.press || 0) * 0.5, fl = clamp(o.flash || 0), out = {}, blk = B03C.black(), eB = edgeCol(MT.black);
  const pins = [1.3, 3.84, 6.38, 8.92, 11.46];
  if (o.board !== false) pcbSec(-2.2, 15.0, 0.2, 1.2, { holes: pins, rival: true });
  for (const x of pins) solid(() => { G.beginPath(); G.moveTo(x - 0.32, -0.3); G.lineTo(x + 0.32, -0.3); G.lineTo(x + 0.32, 3.2); G.lineTo(x + 0.12, 3.5); G.lineTo(x - 0.12, 3.5); G.lineTo(x - 0.32, 3.2); G.closePath(); }, MT.tin, [x - 0.32, 0, 0.64, 3.5], { horiz: true, lw: 0.8 });
  /* the body, cut open: the cover's walls hatched at the cut, the cavity dark */
  const body = () => { G.beginPath(); G.moveTo(0, 0); G.lineTo(0, -6.0); G.quadraticCurveTo(0, -6.5, 0.5, -6.5); G.lineTo(12.3, -6.5); G.quadraticCurveTo(12.8, -6.5, 12.8, -6.0); G.lineTo(12.8, 0); G.closePath(); };
  solid(body, MT.black, [0, -6.5, 12.8, 6.5], { fill: blk, ec: eB });
  G.save(); G.beginPath(); G.rect(0.55, -6.0, 11.7, 5.5); G.fillStyle = TH ? '#16171A' : '#0E0F11'; G.fill(); G.restore();
  out.cover = SP(12.2, -5.6);
  /* the LED (left) and the receiver (right), each on its pedestal, facing across the plunger's path at beam height */
  const by = -3.05;
  solid(() => pathRR(1.1, by - 0.9, 1.3, 2.3 + 1.2, 0.15), MT.black, [1.1, by - 0.9, 1.3, 3.5], { fill: TH ? '#3A3B41' : '#34353B', ec: eB });
  solid(() => { G.beginPath(); G.moveTo(2.4, by - 0.62); G.lineTo(2.75, by - 0.62); G.quadraticCurveTo(3.25, by, 2.75, by + 0.62); G.lineTo(2.4, by + 0.62); G.closePath(); }, MT.lens, [2.4, by - 0.62, 0.85, 1.24], { fill: TH ? '#E5E5EA' : '#636366', ec: eB });
  solid(() => pathRR(9.3, by - 0.9, 1.3, 3.5, 0.15), MT.black, [9.3, by - 0.9, 1.3, 3.5], { fill: TH ? '#3A3B41' : '#34353B', ec: eB });
  solid(() => pathRR(8.85, by - 0.5, 0.45, 1.0, 0.08), MT.black, [8.85, by - 0.5, 0.45, 1.0], { fill: TH ? '#1D1E22' : '#121316', ec: eB });
  out.led = SP(2.9, by); out.rx = SP(9.0, by);
  /* the snap leaf, kept for the feel: it no longer touches anything */
  const lx0 = 1.3, ly0 = -4.55, lx1 = 11.2, ly1 = -4.4 + d * 0.9;
  G.save(); G.beginPath(); G.moveTo(lx0, ly0); G.quadraticCurveTo(6.2, -4.75 + d, lx1, ly1); G.strokeStyle = '#B9BEC6'; G.lineWidth = 0.12; G.lineCap = 'butt'; G.stroke(); G.restore();
  solid(() => pathRR(0.8, -4.8, 0.9, 4.3, 0.1), MT.black, [0.8, -4.8, 0.9, 4.3], { fill: TH ? '#3A3B41' : '#34353B', ec: eB });
  out.leaf = SP(8.6, -4.55 + d * 0.6);
  /* the plunger and its shutter: a thin vane that drops into the beam when pressed */
  const px = 5.6, pt = -7.35 + d, shutterTop = -4.3 + d, shutterBot = -3.75 + d + 0.5 * clamp(o.press || 0);
  solid(() => pathRR(px - 0.75, pt, 1.5, -4.0 - pt + d, 0.3), MT.pom, [px - 0.75, pt, 1.5, 3.3], { fill: B03C.pom(), ec: edgeCol(MT.pom) });
  solid(() => pathRR(px - 0.18, shutterTop, 0.36, shutterBot - shutterTop + 0.3, 0.06), MT.black, [px - 0.18, shutterTop, 0.36, 1.2], { fill: TH ? '#2A2B30' : '#202125', ec: eB });
  out.plunger = SP(px, pt); out.shutter = SP(px, shutterBot);
  /* the beam, when the LED is on: infrared drawn as a pale red light, cut by the shutter once it is down */
  const blocked = clamp(o.press || 0) > 0.75;
  if (fl > 0.01) {
    const x0 = 3.2, x1 = blocked ? px - 0.2 : 8.85;
    G.save(); G.globalAlpha = PA * fl;
    const gr = G.createLinearGradient(x0, by, x1, by); gr.addColorStop(0, 'rgba(255,240,214,0.9)'); gr.addColorStop(1, 'rgba(255,240,214,0.4)');
    G.fillStyle = gr; G.beginPath(); G.moveTo(x0, by - 0.28); G.lineTo(x1, by - 0.42); G.lineTo(x1, by + 0.42); G.lineTo(x0, by + 0.28); G.closePath(); G.fill();
    G.beginPath(); G.arc(2.95, by, 0.55, 0, TAU); G.fillStyle = 'rgba(255,244,222,0.95)'; G.fill();
    if (!blocked) { G.beginPath(); G.arc(8.95, by, 0.32, 0, TAU); G.fillStyle = 'rgba(255,244,222,0.85)'; G.fill(); }
    G.restore();
  }
  /* the cut cover's walls, hatched */
  for (const [x0, w] of [[0, 0.55], [12.25, 0.55]]) solid(() => { G.beginPath(); G.rect(x0, -6.0, w, 6.0); }, MT.black, [x0, -6, w, 6], { fill: blk, ec: eB, hatch: { sp: 4 } });
  solid(() => { G.beginPath(); G.rect(0.5, -6.5, 11.8, 0.5); }, MT.black, [0.5, -6.5, 11.8, 0.5], { fill: blk, ec: eB, hatch: { sp: 4 } });
  solid(() => pathRR(px - 0.75, pt, 1.5, -6.5 - pt, 0.3), MT.pom, [px - 0.75, pt, 1.5, 0.85], { fill: B03C.pom(), ec: edgeCol(MT.pom) });
  out.body = SP(6.4, -3.6); out.top = SP(6.4, -6.5); out.legs = pins.map(x => SP(x, 3.5)); out.blocked = blocked; out.beam = SP(6.0, by);
  return out;
}

/* ============================== b03_spdt: the knife switch from the school lab (the classroom version) ==============================
   A single-pole, double-throw knife switch, seen from the side: a base board, a hinge post in the middle (the common, the
   pole's pivot), a copper blade with an insulated handle, and a pair of jaws at each end (the two throws). o = { throw
   (−1: in the left jaws, +1: in the right jaws; the blade swings over the top between), hi ('pole' | 'throws' | null) }.
   mm, y down, origin on the base's top at the hinge. Returns stage points. */
function b03_knifeMM(o = {}) {
  const th = clamp((o.throw == null ? -1 : o.throw), -1, 1), ang = Math.PI / 2 * (1 - th) /* 0: in the right jaws, π: the left */, out = {};
  const wood = TH ? '#D1D1D6' : '#48484A' /* a slate base: neutral, not wood (true greys, 08:45) */, woodE = edgeCol(MT.white), cu = '#C98A4E', cuD = '#A9703C', cuE = 'rgba(80,40,10,0.7)', hi = o.hi;
  const J = 40, L = 50, pv = [0, -13], bw = 1.5;
  /* the base board and its three terminal screws (the common in the middle, a throw at each end) */
  solid(() => pathRR(-60, 0, 120, 9, 1.6), MT.white, [-60, 0, 120, 9], { fill: wood, ec: woodE });
  for (const x of [-52, 0, 52]) { G.beginPath(); G.arc(x, 4.5, 2.6, 0, TAU); G.fillStyle = TH ? '#9AA0A8' : '#7E848C'; G.fill(); G.strokeStyle = edgeCol(MT.steel); G.lineWidth = lw(1); G.stroke(); mmLine([[x - 1.6, 4.5], [x + 1.6, 4.5]], 'rgba(0,0,0,0.5)', 1.2); }
  const plate = (x, h, lit, near) => solid(() => { G.beginPath(); G.moveTo(x - 1.4, 0); G.lineTo(x + 1.4, 0); G.lineTo(x + 1.4, -h + 1.6); G.lineTo(x + 2.1, -h); G.lineTo(x - 2.1, -h); G.lineTo(x - 1.4, -h + 1.6); G.closePath(); }, MT.copper, [x - 2, -h, 4, h], { fill: lit ? mix(near ? cu : cuD, C.hero, 0.6) : near ? cu : cuD, ec: cuE });
  /* far plates first (the blade lies between the plates of each pair), then the blade, then the near plates */
  plate(-J + 0.6, 15.6, hi === 'throws', false); plate(J + 0.6, 15.6, hi === 'throws', false); plate(0.6, 16.6, hi === 'pole', false);
  const ex = pv[0] + L * Math.cos(ang), ey = pv[1] - L * Math.sin(ang), nx = -Math.sin(ang), ny = -Math.cos(ang);
  const bladeC = hi === 'pole' ? C.hero : cu;
  solid(() => { G.beginPath(); G.moveTo(pv[0] + nx * bw - Math.cos(ang) * 2, pv[1] + ny * bw + Math.sin(ang) * 2); G.lineTo(ex + nx * bw, ey + ny * bw); G.lineTo(ex - nx * bw, ey - ny * bw); G.lineTo(pv[0] - nx * bw - Math.cos(ang) * 2, pv[1] - ny * bw + Math.sin(ang) * 2); G.closePath(); }, MT.copper, [-L, -L - 13, 2 * L, L], { fill: bladeC, ec: hi === 'pole' ? 'rgba(0,0,0,0)' : cuE });
  /* the insulated handle, square to the blade at its free end: upright when the blade lies in a pair of jaws */
  const hb = [ex + nx * 0.5, ey + ny * 0.5];
  G.save(); G.translate(hb[0], hb[1]); G.rotate(-ang + Math.PI / 2 * (Math.cos(ang) >= 0 ? -1 : 1) * 0 - Math.PI / 2);
  solid(() => { G.beginPath(); G.rect(-0.9, -3.2, 1.8, 3.4); }, MT.steel, [-0.9, -3.2, 1.8, 3.4], { fill: TH ? '#9AA0A8' : '#7E848C', ec: edgeCol(MT.steel) });
  solid(() => pathRR(-2.6, -15, 5.2, 12.2, 2.5), MT.black, [-2.6, -15, 5.2, 12.2], { fill: TH ? '#2B2C31' : '#3A3B41', ec: edgeCol(MT.black) });
  G.restore();
  plate(-J - 0.6, 15.6, hi === 'throws', true); plate(J - 0.6, 15.6, hi === 'throws', true); plate(-0.6, 16.6, hi === 'pole', true);
  G.beginPath(); G.arc(pv[0], pv[1], 1.8, 0, TAU); G.fillStyle = TH ? '#9AA0A8' : '#7E848C'; G.fill(); G.strokeStyle = edgeCol(MT.steel); G.lineWidth = lw(1); G.stroke();
  const hTop = [hb[0] - Math.sin(ang - Math.PI / 2) * 0 + nx * 12, hb[1] + ny * 12];
  out.pivot = SP(pv[0], pv[1]); out.handle = SP(hTop[0], hTop[1]); out.blade = SP((pv[0] + ex) / 2, (pv[1] + ey) / 2); out.jawL = SP(-J, -15.6); out.jawR = SP(J, -15.6); out.tip = SP(ex, ey);
  out.inL = th <= -0.97; out.inR = th >= 0.97;
  return out;
}

/* ============================== b03_hotswap: the claw socket, cut through its axis ==============================
   The Mill-Max 3305 as this deck's 3D part has it (3d/parts/millmax3305.js: the datasheet's outside, a representative
   inside): a brass shell, gold-plated, its flange 0.25 mm proud of the board (Ø 1.956), its body (Ø 1.473) through the
   1.575 mm hole and on below; inside it, under a lead-in funnel, a beryllium-copper barrel and its six fingers, which curl
   in to a throat 0.54 mm across and spread to grip a leg. Cut through the axis, two fingers show. The board is 0.6 mm
   (BOARD_T, Brock F47.4; it was 1.0, F21.11), so the socket's own 2.67 mm hangs 1.82 mm below it. The leg is the GT01's: 0.6 mm wide, its tip tapered to 0.2 over 0.32 mm. o = { insert 0..1 (0: the tip 2 mm
   above the flange; 1: seated), solder (true) }. mm, y down, origin on the board's top at the hole's centre. */
function b03_clawMM(o = {}) {
  const k = clamp(o.insert == null ? 1 : o.insert), out = {}, IN = 25.4;
  const rF = 0.077 * IN / 2, rB = 0.058 * IN / 2, hF = 0.010 * IN, Lt = 0.105 * IN, yBot = Lt - hF, rBore = 0.56, tP = BOARD_T, hR = 0.062 * IN / 2;
  /* the board, cut: FR4 with its copper barrel and pads, the socket soldered in */
  const bw = 3.6;
  solid(() => { G.beginPath(); G.moveTo(-bw, 0); G.lineTo(-hR, 0); G.lineTo(-hR, tP); G.lineTo(-bw, tP); brk(-bw, tP, 0, 0.12); G.closePath(); }, MT.fr4, [-bw, 0, bw - hR, tP], { fill: B03C.fr4(), ec: edgeCol(MT.fr4), hatch: { sp: 3 } });
  solid(() => { G.beginPath(); G.moveTo(bw, 0); G.lineTo(hR, 0); G.lineTo(hR, tP); G.lineTo(bw, tP); brk(bw, tP, 0, 0.12); G.closePath(); }, MT.fr4, [hR, 0, bw - hR, tP], { fill: B03C.fr4(), ec: edgeCol(MT.fr4), hatch: { sp: 3 } });
  for (const s of [-1, 1]) {
    G.fillStyle = B03C.mask; G.fillRect(s * (hR + 0.85), -0.045, s * (bw - hR - 0.85), 0.05); G.fillRect(s * (hR + 0.85), tP - 0.005, s * (bw - hR - 0.85), 0.05);   /* Theseus's mask, black */
    G.fillStyle = B03C.copper; G.fillRect(s > 0 ? hR - 0.03 : -hR, -0.035, 0.03, tP + 0.07);                                                                  /* the plated barrel */
    G.fillStyle = B03C.enig; G.fillRect(s * hR, -0.05, s * 0.85, 0.05); G.fillRect(s * hR, tP, s * 0.85, 0.05);                                                 /* its pads, gold (ENIG) */
  }
  if (o.solder !== false) for (const s of [-1, 1]) solid(() => { G.beginPath(); G.moveTo(s * rB, tP + 0.04); G.lineTo(s * (hR + 0.8), tP + 0.04); G.quadraticCurveTo(s * (rB + 0.1), tP + 0.15, s * rB, tP + 0.75); G.closePath(); }, MT.tin, [-hR - 0.8, tP, 2 * (hR + 0.8), 0.8], { fill: B03C.tin(), ec: edgeCol(MT.tin), lw: 0.8 });
  /* the shell (brass, gold over nickel), cut: the flange, the body, the funnel, the bore */
  const gold = '#E2B45A', goldE = 'rgba(90,60,10,0.75)';
  for (const s of [-1, 1]) solid(() => { G.beginPath(); G.moveTo(s * 0.72, -hF); G.lineTo(s * (rF - 0.05), -hF); G.quadraticCurveTo(s * rF, -hF, s * rF, -hF + 0.05); G.lineTo(s * rF, 0.02); G.lineTo(s * rB, 0.02); G.lineTo(s * rB, yBot - 0.07); G.lineTo(s * (rB - 0.07), yBot); G.lineTo(s * (rBore + 0.05), yBot); G.lineTo(s * rBore, yBot - 0.06); G.lineTo(s * rBore, -hF + 0.2); G.lineTo(s * (rBore + 0.02), -hF + 0.16); G.closePath(); }, MT.brass, [-rF, -hF, 2 * rF, Lt], { fill: gold, ec: goldE, hatch: { sp: 2.2, color: 'rgba(90,60,10,0.35)' } });
  out.flange = SP(-rF, -hF / 2); out.body = SP(rB, yBot * 0.62); out.bore = SP(0, yBot - 0.2);
  /* the leg: GT01's terminal, coming down the axis */
  const tipY = lerp(-hF - 2.0, yBot - 0.45, E.io3(k)), pinW = 0.6, tip0 = 0.2, tipL = 0.32;
  /* the clip: barrel at the top of the bore, then two fingers (of six) curling in to the throat; spread by the leg */
  const yC0 = -hF + 0.22, yC1 = yC0 + 0.45, yTip = yC1 + 0.95, rRoot = 0.5, rTip = 0.27, tF = 0.07;
  const halfAt = y => { const dy = tipY - y; if (dy < 0) return 0; return dy >= tipL ? pinW / 2 : lerp(tip0, pinW, dy / tipL) / 2; };
  const spread = Math.max(0, halfAt(yTip) + tF / 2 - rTip), cu2 = '#D9A06E', cuE2 = 'rgba(90,45,10,0.75)';
  for (const s of [-1, 1]) {
    solid(() => { G.beginPath(); G.rect(s > 0 ? 0.47 : -rBore + 0.005, yC0, rBore - 0.005 - 0.47, yC1 - yC0); }, MT.brass, [-rBore, yC0, 0.09, yC1 - yC0], { fill: '#E8BE6A', ec: goldE, lw: 0.8 });
    const fpts = [], n = 18;
    for (let i = 0; i <= n; i++) { const u = i / n, r = lerp(rRoot, rTip + spread * u, Math.pow(Math.sin(u * Math.PI / 2), 1.4)) + (u > 0.88 ? (u - 0.88) * 0.5 : 0); fpts.push([s * r, yC1 + (yTip - yC1) * u]); }
    G.save(); G.beginPath(); fpts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.strokeStyle = gold; G.lineWidth = tF; G.lineCap = 'round'; G.stroke();
    G.beginPath(); fpts.forEach((p, i) => i ? G.lineTo(p[0] + s * 0.02, p[1]) : G.moveTo(p[0] + s * 0.02, p[1])); G.strokeStyle = 'rgba(255,240,200,0.6)'; G.lineWidth = 0.02; G.stroke(); G.restore();
    if (s < 0) out.finger = SP(fpts[12][0], fpts[12][1]);
  }
  out.throat = SP(rTip + spread, yTip);
  /* the leg itself, over the clip (it passes between the fingers) */
  solid(() => { G.beginPath(); G.moveTo(-pinW / 2, tipY - 6); G.lineTo(-pinW / 2, tipY - tipL); G.lineTo(-tip0 / 2, tipY); G.lineTo(tip0 / 2, tipY); G.lineTo(pinW / 2, tipY - tipL); G.lineTo(pinW / 2, tipY - 6); G.closePath(); }, MT.brass, [-pinW / 2, tipY - 6, pinW, 6], { fill: '#D7B76A', ec: 'rgba(70,48,10,0.8)', horiz: true });
  out.leg = SP(pinW / 2, tipY - 1.2); out.tipY = tipY; out.seated = k >= 0.999; out.spread = spread;
  return out;
}

/* ============================== b03_switch: a mechanical switch, for the battery ==============================
   Seen from the side-button side (the kit's 'left' view, nose left), cut through the left trigger's switch on the board.
   The rival is an optical switch (Omron D2FP-class: an LED, a receiver, a shutter on the plunger), then in place the GT01
   (clk_gt01MM, H1's drawing). Each is pressed by the trigger's post; the LED's current runs on a trace beside it. */
/** the GT01's own frame (clk_gt01MM's S): zs along the switch toward the plunger end, ys up its axis → drawing mm, y down */
const b03_gS = (zs, ys) => { const K = CLK_G1, z = zs * K.c + ys * K.s; return [-z, -(K.oy - zs * K.s + ys * K.c)]; };
/** the trigger's post, cut (its moulding, hatched): a 2.4 mm bar whose flat end rests on the plunger. pts: its outline in
   mm, the tip's two corners last (they are rounded) */
function b03_postMM(pts) {
  const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]), bx = [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
  solid(() => b03_path(pts, [0, 0, 0.12, 0.12]), MT.shell, bx, { fill: B03C.shellLite(), ec: edgeCol(MT.shell), hatch: true });
}
/** where the switch sits in the kit's 'left' view (mm): the GT01's housing middle on the board's top (the 3D board: the
   left trigger's switch 36.7 mm ahead of the sensor; the board's top face BOARD_TOP over the pad, 5.03 mm: H3, F47.4) */
const B03_SW = { xG: -36.7, yB: -BOARD_TOP };
/**
 * The LED's current on a trace that scrolls right to left (stage px; the right edge is now): Omron's drive, 5 mA for 30 µs of
 * every 1 ms, slowed down. o = { t0 (the trace starts), rate (ms of trace a second of slide), tOff (no new pulses: the LED
 * is gone), presses: [[t0, t1, hero]], alpha }. Returns the LED's flash now (0..1), for the drawing.
 */
function b03_scope(t, x, y, w, h, o) {
  const win = 5, pm = w / win, tau = Math.max(0, (t - o.t0) * o.rate), tauOff = (o.tOff - o.t0) * o.rate;
  const last = Math.floor(tau - 0.5) + 0.5, flash = t >= o.t0 && last >= 0 && last <= tauOff ? clamp(1 - (tau - last) / 0.3) : 0;
  const a = ep(t, o.t0 - 0.2, o.t0 + 0.2) * (o.alpha == null ? 1 : o.alpha); if (a <= 0.003) return flash;
  const yb = y + h, yt = y + 14, X = q => x + w - (tau - q) * pm, from = Math.max(0, tau - win);
  /* the scale: 5 mA, 0, and 1 ms (line() and text() set their own alpha) */
  line(x, yt, x + w, yt, { color: C.hair, w: 1.2, dash: [5, 5], alpha: a });
  text('5 mA', x, yt - 10, { role: 'label', size: 19, color: C.faint, caps: false, alpha: a });
  text('0', x - 10, yb + 6, { role: 'label', size: 19, color: C.faint, align: 'right', caps: false, alpha: a });
  for (const [x1, y1, x2, y2] of [[x + w - pm, yb + 26, x + w, yb + 26], [x + w - pm, yb + 20, x + w - pm, yb + 32], [x + w, yb + 20, x + w, yb + 32]]) line(x1, y1, x2, y2, { color: C.mute, w: 2, alpha: a });
  text('1 ms', x + w - pm / 2, yb + 54, { role: 'label', size: 19, color: C.mute, align: 'center', caps: false, alpha: a });
  /* each press, as a band the pulses run through */
  for (const [p0, p1, hero] of o.presses || []) {
    const s0 = Math.max(from, (p0 - o.t0) * o.rate), s1 = Math.min(tau, (p1 - o.t0) * o.rate); if (s1 <= s0) continue;
    G.save(); G.globalAlpha = a * 0.8; G.fillStyle = hero ? C.heroSoft : C.track; G.fillRect(X(s0), yt - 4, X(s1) - X(s0), yb - yt + 4); G.restore();
    if (X(s1) - X(s0) > 70) text('pressed', (X(s0) + X(s1)) / 2, yt + 26, { role: 'label', size: 19, color: hero ? C.heroText : C.mute, align: 'center', alpha: a });
  }
  /* the trace: flat, with a 30 µs pulse each millisecond until the LED is gone; ink, then Theseus's blue from tOff */
  const path = () => {
    G.beginPath(); G.moveTo(X(from), yb);
    for (let q = Math.ceil(from - 0.5) + 0.5; q <= Math.min(tau, tauOff); q += 1) { if (q < from) continue; const q1 = Math.min(q + 0.03, tau); G.lineTo(X(q), yb); G.lineTo(X(q), yt); G.lineTo(X(q1), yt); G.lineTo(X(q1), yb); }
    G.lineTo(X(tau), yb);
  };
  const xo = Math.min(x + w, Math.max(x, X(tauOff)));
  G.save(); G.globalAlpha = a; G.lineJoin = 'miter'; G.lineWidth = 2.4;
  G.save(); G.beginPath(); G.rect(x - 2, y - 2, xo - x + 2, h + 6); G.clip(); path(); G.strokeStyle = C.ink2; G.stroke(); G.restore();
  if (tau > tauOff) { G.save(); G.beginPath(); G.rect(xo, y - 2, x + w - xo + 2, h + 6); G.clip(); path(); G.strokeStyle = C.hero; G.lineWidth = 3; G.stroke(); G.restore(); }
  G.restore();
  return flash;
}
const B03_SW_T = { scope: 1.3, p1: 2.3, bar: 3.3, wipe: 4.3, p2: 5.5, swap: 5.9, verdict: 6.7, makers: 8.8 };
/** one press of the trigger: the post's depth 0..1 */
const b03_swP = (t, t0) => pressCurve(t, t0, { down: 0.14, hold: 0.8, up: 0.2, bounce: 0.04 });
S({
  id: 'b03_switch', ch: 'click', theme: 'paper', title: 'A mechanical switch, for the battery', settle: 12, ideas: [78],
  replaces: ['clk_switch'], src: ['b03_gpx2Hours', 'b03_d2fp', 'clk_razerV4bat', 'clk_vortexV4', 'b03_razerStaff', 'b03_logiHybrid', 'b03_eloSwitches', 'clk_gt01', 'clk_gateronRender'],
  answers: [
    ['bottom housing doesn\'t look very accurate at all, i\'ll attach a new reference when you ask', 'Drawn with the shared clk_gt01MM, traced from the Gateron render you sent as the best reference (F28.1), with H1\'s straight 0.70 mm walls (F30.24), now landed'],
    ['show the effect on battery life', 'The slide is that demonstration: the optical switch\'s LED flashing on a current trace whether pressed or not, against the GT01\'s contact with nothing to light, then a Viper V4 Pro\'s draw with its two switches\' share: 13.6 % → 0.4 % (Logitech\'s own hours; up to 17.6 % by Omron\'s pulse), so the same battery lasts 15 % longer'],
    ['razer says their optical encoder and switched account for almost half the battery life in the viper v4 pro (find quote)', 'Searched again: no public quote (Razer\'s pages and blog, Razer Insider, reviews). On screen as Razer staff\'s claim via you (F31.1), under Logitech\'s own support page, also on screen: its optical-only mode "can reduce battery life"'],
    ['also i\'d like to switch to using a hall effect / magnetic encoder', 'The wheel is magnetic deck-wide; this slide hands on to Electronics: "nothing in Theseus lights up but the sensor"'],
    ['so we can say we should have double the battery life efficiency as razer', 'Not said as 2×: the film\'s own derivation for switches and wheel is +23 % (b10_lights), so the slide shows +15 % for the two switches (from Logitech\'s own 96 h vs 104 h; Omron\'s pulse would say up to 17.6 %), and Razer staff\'s "almost half" as their claim, higher still. A question for you in the report']
  ],
  sfx: [[2.3 + 0.12, 'click'], [2.3 + 1.1, 'release'], [5.5 + 0.12, 'click'], [5.5 + 1.1, 'release']],
  draw: t => {
    const T = B03_SW_T, box = [80, 260, 1200, 700], RX = 1320, RW = 520, K = CLK_G1, Q = B03_SW;
    header(t, 'A mechanical switch, for the battery');
    captions(t, [[0.3, '16 of 35 flagships click with light: an optical switch is a light gate, and its LED never rests.'],
      [T.wipe, 'Theseus\'s Gateron GT01 is mechanical: its contact is the signal, so there is nothing to light.'],
      [T.verdict + 1.9, '15 % more battery life from the same battery. The wheel is magnetic too: only the sensor lights up.']]);
    /* the plunger under the post: the GT01's, and the optical switch's set to meet the same post */
    const xPl = Q.xG + b03_gS(K.zN, K.cap)[0], xO = xPl - 5.6, focus = [xO - 2, -17, 26, 16];
    const est = establish(t, 0, box, { view: 'left', hi: ['triggers'], col: 'ink', focus, locator: 'tr', fade: 0.35,
      mouse: { lit: ep(t, 0.12, 0.55) * (1 - 0.75 * ep(t, 1.2, 1.8)), hide: t > 0.95 ? ['side', 'side1', 'side2'] : [] } });
    const kd = est.kd, p1 = b03_swP(t, T.p1), p2 = b03_swP(t, T.p2);
    /* the trace first: it sets the LED's flash. New pulses stop as the wipe passes the LED */
    const ks = 1 - ep(t, T.verdict - 0.3, T.verdict + 0.1);
    const flash = b03_scope(t, RX + 30, 330, RW - 30, 128, { t0: T.scope, rate: 2.5, tOff: T.wipe + 0.32, presses: [[T.p1, T.p1 + 1.16, false], [T.p2, T.p2 + 1.16, true]], alpha: ks });
    if (ks > 0.003) {
      const kt = ep(t, T.scope - 0.2, T.scope + 0.2) * ks, kr = kt * (1 - ep(t, T.wipe + 0.2, T.wipe + 0.6)), kth = kt * ep(t, T.wipe + 0.5, T.wipe + 0.9);
      ltag(RX, 290, 'LED current', 'one switch', { a: kt, size: 20 });
      text('slowed 400×', RX + RW, 290, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kt, caps: false });
      text('Omron\'s datasheet pulse: 5 mA for 30 µs of every 1 ms, pressed or not', RX, 548, { role: 'small', size: 23, weight: 600, color: C.ink2, maxW: RW - 90, lh: 1.3, alpha: kr });
      text('A contact: no light, nothing to power', RX, 548, { role: 'small', size: 23, weight: 700, color: C.heroText, maxW: RW - 90, alpha: kth });
    }
    /* the two drawings, in place under one camera: the optical switch, then the GT01, each under its post */
    let opt = {}, gt = {};
    const drawRival = () => est.draw(() => {
      xsave(); xmove(xO, Q.yB - 0.2);
      pcbSec(-14, 40, 0.2, 1.2, { holes: [1.3, 3.84, 6.38, 8.92, 11.46], rival: true });
      opt = b03_opticalMM({ press: p1, flash, board: false });
      const d = p1 * 0.5; opt.arrow = SP(5.6 + 1.75, -7.35 + d - 2.0);
      xrest();
      G.save(); G.clip(msView('left').out); xsave(); xmove(xO, Q.yB - 0.2);
      b03_postMM([[5.6 - 1.2, -7.35 + d - 16], [5.6 + 1.2, -7.35 + d - 16], [5.6 + 1.2, -7.35 + d], [5.6 - 1.2, -7.35 + d]]);
      xrest(); G.restore();
    });
    const drawOurs = () => est.draw(() => {
      xsave(); xmove(Q.xG, Q.yB);
      pcbSec(-20, 30, 0, BOARD_T, { holes: [-5.08, 0, 5.08] });   /* Theseus's board, 0.6 mm (H3, F47.4) */
      gt = clk_gt01MM({ press: p2, board: false });
      const d = p2 * K.tr; gt.arrow = SP(...b03_gS(K.zN + 1.75, K.cap - d + 2.0));
      xrest();
      G.save(); G.clip(msView('left').out); xsave(); xmove(Q.xG, Q.yB);
      b03_postMM([b03_gS(K.zN - 1.2, K.cap - d + 16), b03_gS(K.zN + 1.2, K.cap - d + 16), b03_gS(K.zN + 1.2, K.cap - d), b03_gS(K.zN - 1.2, K.cap - d)]);
      xrest(); G.restore();
    });
    if (kd > 0.001) { G.save(); G.globalAlpha = kd; wipeTo(t, T.wipe, 0.9, box, drawRival, drawOurs, { rival: 'Optical', right: 'Theseus' }); G.restore(); }
    /* the press: the trigger's post pushed down its own axis (straight down on the optical, along the GT01's 20°) */
    if (kd > 0.5) {
      const riv = t < T.wipe + 0.45, pr = riv ? p1 : p2, q = riv ? opt.arrow : gt.arrow;
      if (q && pr > 0.01) forceArrow(q[0], q[1], riv ? Math.PI / 2 : Math.atan2(K.c, K.s), 70, { k: clamp(pr / 0.7), color: C.ink, w: 3 });
    }
    /* the panel's name and what it shows, top left */
    if (kd > 0.02 && !(t > T.wipe && t < T.wipe + 0.9)) {
      const riv = t < T.wipe, kn = (riv ? ep(t, 1.2, 1.6) : ep(t, T.wipe + 0.9, T.wipe + 1.3)) * kd, sx = box[0] + 32, sy = box[1] + 50;
      const L1 = riv ? '16 of 35 flagships' : 'Theseus', L2 = riv ? 'optical' : 'mechanical', tw0 = ltagW(L1, L2, { size: 22 });
      G.save(); G.globalAlpha = kn * 0.94; rrPath(sx - 16, sy - 30, tw0 + 32, 46, TILE.r); G.fillStyle = C.panel; G.fill(); G.restore();
      ltag(sx, sy, L1, L2, { a: kn, size: 22, color: riv ? C.mute : C.heroText, vcolor: riv ? C.secondText : C.heroText });
    }
    /* the parts, named in a column right of the drawing, as they matter */
    if (kd > 0.5) {
      const lx = est.P(xO + 19.2, 0)[0], ly = i => box[1] + 196 + i * 124, C2 = { side: 'r', prose: true, maxW: 262 };
      if (t < T.wipe) {
        if (opt.beam) callout(t, 1.6, opt.beam, 'LED and receiver: a light gate', Object.assign({ to: [lx, ly(0)], color: C.ink2, tcolor: C.ink }, C2));
        if (opt.shutter && t > T.p1) callout(t, T.p1 + 0.15, opt.shutter, 'Pressed, a shutter cuts the beam', Object.assign({ to: [lx, ly(1)], color: C.ink2, tcolor: C.ink }, C2));
        if (opt.led && t > T.p1 + 1.2) faultTag(t, T.p1 + 1.2, opt.led, 'Its LED flashes 1,000 times a second, pressed or not', Object.assign({ to: [lx, ly(2)] }, C2));
      } else if (t > T.wipe + 0.9) {
        if (gt.top) callout(t, T.wipe + 1.0, gt.top, 'Gateron GT01, cover clear', Object.assign({ to: [lx, ly(0)], color: C.ink2, tcolor: C.ink }, C2));
        if (gt.leaf && t > T.p2) callout(t, T.p2 + 0.15, gt.leaf, 'Pressed, the leaf snaps from NC to NO', Object.assign({ to: [lx, ly(1)], color: C.ink2, tcolor: C.ink }, C2));
        if (gt.contact && t > T.p2 + 0.6) fixTag(t, T.p2 + 0.6, gt.contact, 'Nothing to light: the contact is the signal', Object.assign({ to: [lx, ly(2)] }, C2));
      }
    }
    /* a Viper V4 Pro's average draw at 1 khz, and the share its two optical switches take; then the same with mechanical ones */
    const kb = ep(t, T.bar, T.bar + 0.5), kw = ep(t, T.swap, T.swap + 0.8, E.io3);
    if (kb > 0.003) {
      const by = 640, bh = 36, px = RW / B03.v4MA, rest = B03.v4MA - 2 * B03.optMA, sl = lerp(2 * B03.optMA, 2 * B03.mechUA / 1000, kw), xr = RX + rest * px;
      rich([{ s: kw < 0.5 ? 'Viper V4 Pro at 1 khz' : 'The same, mechanical', role: 'label', size: 20, color: C.mute }, { s: kitNum(rest + sl, 2) + ' mA on average', role: 'small', size: 22, weight: 750, color: C.ink, caps: false, sentence: false, gap: 12 }], RX, 616, { alpha: kb });
      G.save(); G.globalAlpha = kb;
      rrPath(RX, by, rest * px * ep(t, T.bar, T.bar + 0.4, E.snap), bh, 3); G.fillStyle = C.track; G.fill();
      const ksl = ep(t, T.bar + 0.3, T.bar + 0.6);
      if (ksl > 0) {
        const kr2 = 1 - ep(kw, 0.7, 1), kb2 = ep(kw, 0.6, 1);   /* red while it shrinks, Theseus's blue once it is a sliver */
        if (kr2 > 0) { G.fillStyle = C.red; G.globalAlpha = kb * ksl * kr2; G.fillRect(xr + 1.5, by, Math.max(2.5, sl * px - 1.5), bh); }
        if (kb2 > 0) { G.fillStyle = C.hero; G.globalAlpha = kb * kb2; G.fillRect(xr + 1.5, by, 2.5, bh); }
      }
      if (kw > 0.02) { G.globalAlpha = kb * kw; G.setLineDash([5, 4]); G.strokeStyle = C.faint; G.lineWidth = 1.5; G.strokeRect(xr + sl * px + 2, by + 1, RX + RW - xr - sl * px - 3, bh - 2); G.setLineDash([]); }
      G.restore();
      text('Everything else ' + kitNum(rest, 2) + ' mA', RX + 14, by + bh / 2 + 8, { role: 'small', size: 20, weight: 650, color: C.ink2, alpha: kb * ep(t, T.bar + 0.3, T.bar + 0.7) });
      text('Two optical switches ' + kitNum(2 * B03.optMA, 2) + ' mA', RX + RW, by + bh + 34, { role: 'small', size: 22, weight: 700, color: C.red, align: 'right', alpha: kb * ksl * (1 - ep(t, T.swap, T.swap + 0.3)) });
      text('Two mechanical ' + kitNum(2 * B03.mechUA / 1000, 3) + ' mA', xr + 4, by + bh + 34, { role: 'small', size: 22, weight: 700, color: C.heroText, align: 'right', alpha: kb * ep(t, T.swap + 0.5, T.swap + 0.9) });
    }
    /* the verdict: the share of the battery the two switches take; the net, the battery life it gives back */
    verdict(t, T.verdict, RX, 440, { from: b03_floor(B03.optShare * 100, 1), to: (Math.ceil(B03.mechShare * 1000 - 1e-9) / 10).toFixed(1), unit: '%', dec: 1, label: 'Switch drain', better: 'lower', who: ['Optical', 'Theseus'], net: '+' + b03_floor(B03.lifeGain * 100, 0) + ' %', netWord: 'battery life', size: 104, maxW: RW });
    /* what the makers say: Logitech's own page, and Razer staff via Brock */
    const km = ep(t, T.makers, T.makers + 0.4), km2 = ep(t, T.makers + 0.4, T.makers + 0.8);
    if (km > 0.003) {
      text('The same, other ways', RX, 782, { role: 'label', size: 20, color: C.mute, alpha: km });
      text('By Omron\'s datasheet pulse: up to ' + b03_floor(B03.omronShare * 100, 1) + ' %', RX, 816, { role: 'small', size: 23, weight: 600, color: C.ink2, maxW: RW, lh: 1.3, alpha: km });
      /* the maker's own words (A1: the answer cited them; now on screen): Logitech's support page on its optical-only mode */
      text('Logitech\'s own page: optical-only mode "can reduce battery life"', RX, 852, { role: 'small', size: 23, weight: 600, color: C.ink2, maxW: RW, lh: 1.3, alpha: ep(t, T.makers + 0.2, T.makers + 0.6) });
      text('Razer staff, via Brock, put it higher still: switches and wheel take "almost half"', RX, 920, { role: 'small', size: 23, weight: 600, color: C.ink2, maxW: RW, lh: 1.3, alpha: km2 });
    }
    text('Derived from Logitech\'s GPX2 (TechPowerUp): 96 h with its switches\' light always on, 104 h without, 1 khz, on a V4 Pro\'s 306 mAh over 180 h; mechanical read by strobing, 3 µA', LM, 994, { role: 'foot', color: C.faint, alpha: ep(t, T.verdict + 1.0, T.verdict + 1.4), maxW: RM - LM });
  }
});
/* ============================== b03_binning: provable switch binning ==============================
   A tester (a proposal: a probe on a load cell, a magnet on the probe read by a Hall-effect sensor for travel) presses each
   GT01-style switch in turn; each one's operating force drops onto an axis as a dot (an illustrative lot). Bands: Omron's
   D2FP datasheet (60.2 ± 15.3 gf), the GT01's (55 ± 5 gf), and Theseus's bin (55 ± 1.5 gf), which closes in; the switches
   outside it go to another bin. Two from the bin become your two buttons. */
const B03_LOT = [53.1, 56.4, 55.2, 51.8, 57.6, 54.3, 55.9, 52.7, 58.4, 54.8, 55.4, 53.9, 56.9, 50.9, 54.1, 57.1];
const B03_BN_T = { test0: 0.8, per: 0.2, bin: 4.4, pair: 5.5, verdict: 6.4, note: 8.2 };
S({
  id: 'b03_binning', ch: 'click', theme: 'night', title: 'Provable switch binning', settle: 11, ideas: [78],
  replaces: ['clk_switch2'], src: ['b03_d2fp', 'b03_gt01', 'b03_pang', 'b03_brockDoc', 'b03_eggBins'],
  answers: [
    ['largely irrelevant', 'The force and rated-life chart is gone; the slide is now about one thing a player feels: two buttons that click alike'],
    ['we don\'t even know if we\'re going with the gt01 switch or just their style for the bottom housing', '"GT01-style" everywhere on the slide; the bin is Theseus\'s, not a Gateron claim'],
    ['if you want to keep this you\'d have to group it in with better binning practices', 'It is the binning slide: each switch tested, a narrow bin, the two in your mouse picked from it'],
    ['a lot of companies lie about their binning practices for switches', 'Shown as what is public: makers sell bands (Endgame Gear: "binned for 60-65 gf") and publish no test data; no company is called a liar, since nothing public proves one. The verdict sets binned against binned: Endgame Gear\'s 5.0 gf worst gap against Theseus\'s 3.0 gf, tested and published (the datasheet\'s unbinned 30.6 gf stays as context)'],
    ['whereas we could commit to proveable bins', 'The bin (55 ± 1.5 gf, a proposal) and every switch\'s test published with the mouse'],
    ['(potentially using hall effect tech)', 'The tester reads travel with a Hall-effect sensor on a magnet in the probe, force on a load cell: labelled a proposal']
  ],
  draw: t => {
    const T = B03_BN_T, n = B03_LOT.length, ax = 720, aw = RM - 40 - ax, F0 = 40, F1 = 80, X = f => ax + aw * (f - F0) / (F1 - F0), yA = 560;
    header(t, 'Provable switch binning');
    captions(t, [[0.3, 'Two switches off the same reel can click differently: a datasheet\'s band is wide.'],
      [T.bin - 0.2, 'Theseus tests every switch and keeps a narrow bin; the rest go to another bin.'],
      [T.verdict + 1.8, 'Your two buttons click alike, under what a finger can feel, and the test is published.']]);
    /* the tester (a proposal): the probe presses each switch along its axis; Hall sensor for travel, load cell for force */
    demoWindow(LM, 260, 560, 440, 1, { plain: true });
    ltag(LM + 28, 302, 'The tester', 'a proposal', { a: 1, size: 20 });
    const iNow = Math.floor((t - T.test0) / T.per), done = clamp(iNow + (t >= T.test0 ? 1 : 0), 0, n), ph = t < T.test0 ? -1 : ((t - T.test0) % T.per) / T.per;
    const pr = t >= T.test0 && iNow < n ? Math.sin(Math.PI * clamp(ph / 0.8)) : 0, K = CLK_G1;
    const tst = part(LM + 270, 652, 14, () => {
      solid(() => pathRR(-11, 0, 22, 1.4, 0.3), MT.steel, [-11, 0, 22, 1.4], { fill: TH ? '#C7CBD1' : '#5B5E64', ec: edgeCol(MT.steel) });
      const g = clk_gt01MM({ press: pr, board: false, clear: true }), d = pr * K.tr;
      const tip = b03_gS(K.zN, K.cap - d), top = b03_gS(K.zN, K.cap - d + 9.5);
      const rod = [b03_gS(K.zN - 0.5, K.cap - d + 9.5), b03_gS(K.zN + 0.5, K.cap - d + 9.5), b03_gS(K.zN + 0.5, K.cap - d), b03_gS(K.zN - 0.5, K.cap - d)];
      solid(() => b03_path(rod, [0, 0, 0.15, 0.15]), MT.steel, [tip[0] - 2, top[1], 4, tip[1] - top[1]], { fill: TH ? '#C7CBD1' : '#8E9299', ec: edgeCol(MT.steel) });
      const lc = b03_gS(K.zN, K.cap - d + 11.2);
      xsave(); xmove(lc[0], lc[1]); xturn(-Math.PI / 9);
      solid(() => pathRR(-2.6, -1.7, 5.2, 3.4, 0.4), MT.black, [-2.6, -1.7, 5.2, 3.4], { fill: B03C.black(), ec: edgeCol(MT.black) });
      xrest();
      const mg = b03_gS(K.zN - 0.5, K.cap - d + 5.5), hs = b03_gS(K.zN - 2.6, K.cap + 5.5);
      G.save(); G.fillStyle = '#B23A3A'; G.fillRect(mg[0] - 0.55, mg[1] - 0.45, 0.55, 0.9); G.fillStyle = '#3A64B2'; G.fillRect(mg[0] - 1.1, mg[1] - 0.45, 0.55, 0.9); G.restore();
      solid(() => pathRR(hs[0] - 1.0, hs[1] - 0.8, 1.4, 1.6, 0.2), MT.black, [hs[0] - 1, hs[1] - 0.8, 1.4, 1.6], { fill: B03C.black(), ec: edgeCol(MT.black) });
      return { lc: SP(lc[0], lc[1]), hs: SP(hs[0] - 0.3, hs[1]), sw: g.body || SP(0, -4), tip: SP(tip[0], tip[1]) };
    }, { alpha: 1 });
    if (tst.lc) {
      const C2 = { color: C.ink2, tcolor: C.ink, side: 'r', prose: true, maxW: 190 };
      callout(t, 0.4, tst.lc, 'Load cell: force', Object.assign({ to: [LM + 356, 380] }, C2));
      callout(t, 0.55, tst.hs, 'Hall sensor: travel', Object.assign({ to: [LM + 356, 470] }, C2));
      callout(t, 0.7, tst.sw, 'GT01-style switch', Object.assign({ to: [LM + 356, 580] }, C2));
    }
    /* the axis: operating force, gf; the bands; the dots as each switch is tested */
    const ka = 1;
    line(ax, yA, ax + aw, yA, { color: C.ink2, w: 1.5, alpha: ka });
    for (let f = F0; f <= F1; f += 5) { line(X(f), yA - 5, X(f), yA + 5, { color: C.faint, w: 1.2, alpha: ka }); text(f + (f === F1 ? ' gf' : ''), X(f), yA + 30, { role: 'label', size: 19, color: C.faint, align: 'center', caps: false, alpha: ka }); }
    text('Operating force, one dot a switch (an illustrative lot)', ax, 298, { role: 'label', size: 20, color: C.mute, alpha: ka });
    const band = (lo, hi, y, label, col, k) => { if (k <= 0.003) return; G.save(); G.globalAlpha = k * 0.5; G.fillStyle = col; G.fillRect(X(lo), y - 9, X(hi) - X(lo), 18); G.restore(); text(label, X(lo), y - 18, { role: 'small', size: 21, weight: 650, color: C.ink2, alpha: k, maxW: X(F1) - X(lo) }); };
    band(Math.max(F0, 60.2 - 15.3), Math.min(F1, 60.2 + 15.3), 354, 'Omron D2FP\'s datasheet: 60.2 ± 15.3 gf', C.comp, ep(t, 0.3, 0.7));
    /* the like-for-like rival (R2-b03-4): a maker that does bin, Endgame Gear, sells a 5 gf band and publishes no test */
    { const k = ep(t, 0.4, 0.8); if (k > 0.003) { G.save(); G.globalAlpha = k * 0.55; G.fillStyle = C.second; G.fillRect(X(60), 395, X(65) - X(60), 18); G.restore();
      text('Endgame Gear\'s bin: 60 to 65 gf, no test published', X(60), 386, { role: 'small', size: 21, weight: 650, color: C.secondText, alpha: k }); } }
    band(50, 60, 450, 'GT01\'s: 55 ± 5 gf (Gateron claim)', C.comp, ep(t, 0.5, 0.9));
    /* Theseus's bin: closes in from the GT01's band to ±1.5 gf */
    const kb = ep(t, T.bin, T.bin + 0.8, E.io3), bLo = lerp(50, 55 - B03.bin, kb), bHi = lerp(60, 55 + B03.bin, kb);
    if (t > T.bin - 0.1) {
      const k = ep(t, T.bin - 0.1, T.bin + 0.2);
      G.save(); G.globalAlpha = k * 0.22; G.fillStyle = C.hero; G.fillRect(X(bLo), 470, X(bHi) - X(bLo), yA - 470); G.restore();
      line(X(bLo), 470, X(bLo), yA, { color: C.hero, w: 2.5, alpha: k }); line(X(bHi), 470, X(bHi), yA, { color: C.hero, w: 2.5, alpha: k });
      text('Theseus\'s bin: 55 ± 1.5 gf', X(bHi) + 12, 492, { role: 'small', size: 22, weight: 750, color: C.heroText, alpha: ep(t, T.bin + 0.6, T.bin + 1.0) });
    }
    /* the dots: dropped as tested; once the bin closes, those outside it slide down to the other bin */
    const pair = [10, 14];
    B03_LOT.forEach((f, i) => {
      if (i >= done) return;
      const k0 = T.test0 + i * T.per + T.per * 0.5, kd = ep(t, k0, k0 + 0.25, E.out3), out = f < 55 - B03.bin || f > 55 + B03.bin;
      const ko = out ? ep(t, T.bin + 0.5 + i * 0.02, T.bin + 1.0 + i * 0.02, E.io3) : 0, yy = lerp(yA - 70, yA - 14 - (i % 4) * 17, kd) + ko * 96;
      const hi = t >= T.pair && pair.includes(i);
      circle(X(f), yy, hi ? 11 : 8, { fill: out && ko > 0.5 ? C.comp : t >= T.bin + 0.8 && !out ? C.hero : C.ink2, alpha: kd * (1 - 0.4 * ko) });
      if (hi) { circle(X(f), yy, 18, { color: C.hero, w: 2.5, alpha: ep(t, T.pair, T.pair + 0.3) }); }
    });
    if (t > T.bin + 0.9) text('to another bin', X(F0) + 4, yA + 150, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: ep(t, T.bin + 0.9, T.bin + 1.2) });
    /* the pair: your two buttons */
    if (t >= T.pair) {
      const k = ep(t, T.pair + 0.2, T.pair + 0.6), a0 = B03_LOT[pair[0]], a1 = B03_LOT[pair[1]];
      text('Your two buttons: ' + a0.toFixed(1) + ' and ' + a1.toFixed(1) + ' gf', ax + 140, 760, { role: 'small', size: 26, weight: 750, color: C.heroText, alpha: k });
      text('A finger notices about 7 % on firmer squeezes: ' + b03_floor(55 * B03.jnd, 1) + ' gf at 55 gf (Pang, Tan, Durlach 1991)', ax + 140, 798, { role: 'small', size: 22, weight: 600, color: C.mute, alpha: ep(t, T.pair + 0.5, T.pair + 0.9) });
    }
    /* the verdict: the worst gap between your two buttons, binned against binned (R2-b03-4): Endgame Gear's 60 to 65 gf band
       allows 5.0 gf (8 % at 62.5 gf, over the 7 % a finger notices); Theseus's ±1.5 gf, 3.0 (5.5 %). The datasheet's unbinned
       30.6 gf stays on the axis as context */
    verdict(t, T.verdict, LM + 140, 900, { from: '5.0', to: (2 * B03.bin).toFixed(1), unit: 'gf', dec: 1, label: 'Worst gap between your two buttons', better: 'lower', who: ['Endgame Gear', 'Theseus'], net: false, size: 110, maxW: 600 });
    const kn = ep(t, T.note, T.note + 0.4);
    if (kn > 0.003) {
      text('Unbinned, a datasheet allows 30.6 gf apart (Omron D2FP); Endgame Gear bins to 5 gf, and publishes no test.', ax + 140, 856, { role: 'small', size: 22, weight: 600, color: C.mute, alpha: kn, maxW: aw - 140, lh: 1.25 });
      text('Provable: the bin and every switch\'s test, published with the mouse (a proposal)', ax + 140, 926, { role: 'small', size: 22, weight: 700, color: C.heroText, alpha: ep(t, T.note + 0.3, T.note + 0.7), maxW: aw - 140 });
    }
    text('Brock: "10 gf weaker at 60 gf is quite noticeable". The JND is from 2.5 to 10 N squeezes; at 0.54 N it is taken as the same 7 %', LM, 994, { role: 'foot', color: C.faint, alpha: ep(t, T.verdict + 1.0, T.verdict + 1.4), maxW: RM - LM });
  }
});
/* ============================== b03_spdt: single pole, double throw ==============================
   The GT01 in the mouse (left, established and pushed in), and the lab's knife switch beside it as the classroom version
   (one blade: the single pole; a pair of jaws at each end: the double throw). The pointer throws the blade; it lands on NO
   and bounces, slowed down; two readers count the one press: single throw (NO only) three times, double throw once. */
const B03_SP_T = { knife: 1.2, grab: 2.2, land: 3.1, verdict: 5.5 };
/** the knife's throw against slide time: on NC, dragged over the top by its handle, landing on NO and bouncing (two bounces
   open the contact, the third stays shut), never back to NC. Returns { th (−1 NC .. 1 NO), u (s since landing) } */
function b03_knifeThrow(t) {
  const T = B03_SP_T, g0 = T.grab + 0.25, u = t - T.land;
  if (t <= g0) return { th: -1, u };
  if (u < 0) return { th: lerp(-1, 1, E.in3(clamp((t - g0) / (T.land - g0)))), u };
  const b = u > 1.6 ? 0 : 0.17 * Math.exp(-u / 0.5) * Math.abs(Math.sin(Math.PI * u / 0.5));
  return { th: 1 - 2 * b, u };
}
/** the clicks each reader has counted by slide time t: single throw counts every closing of NO (landing, and after each of
   the two bounces that open it); double throw counts once, as the pole leaves NC */
const b03_spCount = t => { const T = B03_SP_T, u = t - T.land; return { st: u < 0 ? 0 : 1 + (u >= 0.5 ? 1 : 0) + (u >= 1.0 ? 1 : 0), dt: t >= T.grab + 0.3 ? 1 : 0 }; };
S({
  id: 'b03_spdt', ch: 'click', theme: 'paper', title: 'Single pole, double throw', settle: 10.5, ideas: [79],
  replaces: ['clk_spdt'], src: ['b03_ganssle', 'b03_toms', 'clk_gt01'],
  answers: [
    ['difficult to understand', 'The lab\'s knife switch, beside the GT01\'s own pole doing the same: one blade (the single pole), a pair of jaws at each end (the double throw), thrown by the pointer. Then the one thing that matters: it bounces as it lands, so a mouse that reads only NO counts three clicks, and one that reads both counts one'],
    ['F9.4: explain that SPDT means single pole, double throw, in big letters, and demonstrate it with an animation', 'The title says it in big letters, and the demonstration names each word on the part it means: "single pole: one blade", "double throw: two places it lands"']
  ],
  sfx: [[3.1, 'click'], [3.6, 'click'], [4.1, 'click']],
  draw: t => {
    const T = B03_SP_T, box = [80, 260, 580, 440], Q = B03_SW;
    header(t, 'Single pole, double throw');
    captions(t, [[0.3, 'Every click runs on a switch with one moving contact and two places for it to land.'],
      [T.knife + 0.4, 'As on the lab\'s knife switch: one blade, the single pole, and two pairs of jaws, the double throw.'],
      [T.land, 'Slowed down, it bounces as it lands: read only NO, and one press counts three times.'],
      [T.verdict + 1.8, 'Read both throws and a bounce can\'t fake a click: it never gets back to NC.']]);
    const kt = b03_knifeThrow(t), pos = (kt.th + 1) / 2, cnt = b03_spCount(t);
    /* where: the GT01 under the left trigger, its pole doing what the blade does */
    const est = establish(t, 0, box, { view: 'left', hi: ['triggers'], col: 'ink', focus: [Q.xG - 8.5, -16.2, 17, 13.2], locator: 'tr', fade: 0.3,
      mouse: { lit: ep(t, 0.12, 0.55) * (1 - 0.8 * ep(t, 1.2, 1.8)), hide: t > 0.95 ? ['side', 'side1', 'side2'] : [] } });
    let gt = {};
    est.draw(() => { xsave(); xmove(Q.xG, Q.yB); pcbSec(-20, 30, 0, BOARD_T, { holes: [-5.08, 0, 5.08] }); gt = b03_gt01Pole({ pos, press: kt.th > -1 ? 1 : 0 }); xrest(); });
    if (est.kd > 0.5 && gt.nc) {
      const C2 = { color: C.ink2, tcolor: C.ink, side: 'r' }, xr = box[0] + box[2] - 78;
      text('GT01: 0.3 mm from NC to NO', box[0] + 24, box[1] + 44, { role: 'small', size: 22, weight: 650, color: C.ink2, alpha: ep(t, 1.4, 1.8) });
      callout(t, 1.5, gt.nc, 'NC', Object.assign({ to: [xr, box[1] + 120] }, C2));
      callout(t, 1.6, gt.contact, 'Pole', Object.assign({ to: [xr, box[1] + 166] }, C2));
      callout(t, 1.7, gt.no, 'NO', Object.assign({ to: [xr, box[1] + 212] }, C2));
    }
    /* the classroom version: the knife switch, big */
    const r = demoPanel(t, T.knife, [700, 260, RM - 700, 480], { src: 'The lab\'s knife switch' });
    const kk = ep(t, T.knife + 0.2, T.knife + 0.6);
    if (kk > 0.003) {
      const cx = r[0] + r[2] / 2, sK = 5.0, by = r[1] + r[3] - 92;
      const kn = part(cx, by, sK, () => b03_knifeMM({ throw: kt.th, hi: t > T.knife + 0.6 && t < T.grab ? 'pole' : null }), { alpha: kk });
      if (kn.pivot) {
        const C3 = { color: C.ink2, tcolor: C.ink, prose: true, maxW: 250 };
        callout(t, T.knife + 0.7, kn.jawL, 'Throw 1: NC, closed at rest', Object.assign({ to: [r[0] + 262, r[1] + 46], side: 'l' }, C3));
        callout(t, T.knife + 0.9, kn.jawR, 'Throw 2: NO, closed when pressed', Object.assign({ to: [r[0] + r[2] - 262, r[1] + 46], side: 'r' }, C3));
        text('Single pole: one blade', cx, by + 9 * sK + 40, { role: 'small', size: 25, weight: 750, color: C.heroText, align: 'center', alpha: ep(t, T.knife + 0.6, T.knife + 1.0) });
        /* the pointer throws it by the handle (F2.43), then lets go as it lands */
        const ka = ep(t, T.grab - 0.4, T.grab) * (1 - ep(t, T.land + 0.1, T.land + 0.4));
        if (ka > 0.003 && kn.tip) cursorPtr(kn.tip[0] + 4, kn.tip[1] + 2, { a: ka, press: t > T.grab && t < T.grab + 0.4 ? prog(t, T.grab, T.grab + 0.4) : 0 });
        /* the bounce stays at NO: it never gets back to NC (Ganssle) */
        if (t > T.land + 1.2) callout(t, T.land + 1.2, kn.tip, 'Its bounces stay at NO, never back to NC', Object.assign({ to: [kn.tip[0] - 70, kn.tip[1] - 120], side: 'l', color: C.ink2, tcolor: C.ink, prose: true, maxW: 280 }));
      }
    }
    /* the two readers, counting the one press, under the mouse's view */
    const kc = ep(t, T.grab - 0.2, T.grab + 0.2);
    if (kc > 0.003) {
      const x0 = LM, rows = [790, 884], bx = x0 + 250, nx = x0 + 580;
      const row = (y, name, n, hero, how, kh) => {
        text(name, x0, y, { role: 'small', size: 27, weight: 800, color: hero ? C.heroText : C.ink, alpha: kc });
        for (let i = 0; i < 3; i++) { const on = i < n, cc = hero ? C.hero : i === 0 ? C.ink2 : C.red; rrPath(bx + i * 48, y - 26, 36, 32, 4); G.save(); G.globalAlpha = kc * (on ? 1 : 0.5); if (on) { G.fillStyle = cc; G.fill(); } else { G.strokeStyle = C.hair; G.lineWidth = 1.5; G.stroke(); } G.restore(); }
        rich([{ s: String(n), role: 'stat', size: 50, weight: 800, color: hero ? C.heroText : n > 1 ? C.red : C.ink, tnum: true }, { s: n === 1 ? 'click' : 'clicks', role: 'small', size: 22, weight: 650, color: C.mute, gap: 10, sentence: false }], nx, y + 4, { align: 'right', alpha: kc });
        text(how, x0, y + 34, { role: 'small', size: 21, weight: 600, color: hero ? C.heroText : n > 1 ? C.red : C.mute, alpha: kc * kh });
      };
      row(rows[0], 'Single throw', cnt.st, false, cnt.st > 1 ? 'reads NO only: each bounce reads as a new click' : 'reads NO only', 1);
      row(rows[1], 'Theseus', cnt.dt, true, 'reads NC and NO: counted as the pole leaves NC', ep(t, T.grab + 0.3, T.grab + 0.7));
    }
    /* the verdict, under the knife switch: the rival's name set under its struck figure, right-aligned, so it clears ours */
    const vx = 860, vy = 900, vs = 120;
    verdict(t, T.verdict, vx, vy, { from: '3', to: '1', dec: 0, label: 'Clicks from one press', better: 'lower', who: ['', 'Theseus'], net: false, size: vs, maxW: RM - vx });   /* the false clicks only: "no wait" is b03_debounce's payoff (R2-b03-5) */
    { const kw = ep(t, T.verdict + 0.77, T.verdict + 1.17), wOld = tw('3', { role: 'd1', size: Math.round(vs * 0.4), weight: 800 });
      text('Single throw', vx + wOld, vy + Math.round(vs * 0.06) + 34, { role: 'label', size: 19, color: C.secondText, align: 'right', alpha: kw }); }
    text('Bounce: about 0.5 to 1.5 ms on a new switch (Tom\'s Hardware 2016; Ganssle 2004, 16 switches); three bounces here are an illustration', LM, 994, { role: 'foot', color: C.faint, alpha: ep(t, T.verdict + 1.0, T.verdict + 1.4), maxW: RM - LM });
  }
});
/* ============================== b03_timing: negative latency ==============================
   One press, slowed 1,000×, on one shared clock (the photo finish): the GT01's pole leaves NC, flies about 1.5 ms (XBAB),
   lands on NO and bounces. Theseus counts it as it leaves NC; a single-throw mouse waits for NO, then waits out the bounce
   (TechPowerUp: a 4 ms debounce cost the Lamzu Atlantis 3.0 ms). The shot shows what the player gets. */
/** the GT01 with its pole part way between NC (pos 0) and NO (pos 1). clk_gt01MM draws the pole at NC or at NO; for the
   flight its own gap (the leaf's free end's drop, CLK_G1.gap) is scaled for this one call, and put back. o = { pos, press } */
function b03_gt01Pole(o = {}) {
  const K = CLK_G1, g0 = K.gap, pos = clamp(o.pos || 0);
  if (typeof g0 !== 'number') return clk_gt01MM({ press: o.press, state: pos > 0.5 ? 'no' : 'nc', board: false });
  try { K.gap = g0 * pos; return clk_gt01MM({ press: o.press == null ? 1 : o.press, state: 'no', board: false }); } finally { K.gap = g0; }
}
/** the pole's place against the press clock tau (ms from leaving NC): the snap's flight (accelerating, 1.5 ms), then a
   bounce on NO that never gets back to NC (Ganssle) and dies out in about 0.8 ms (Tom's: 500 to 800 µs on a new switch) */
function b03_polePos(tau) {
  const F = B03.flightMs; if (tau <= 0) return 0; if (tau < F) return Math.pow(tau / F, 2);
  const u = tau - F; if (u > 0.8) return 1;
  return 1 - 0.32 * Math.exp(-u / 0.22) * Math.abs(Math.sin(Math.PI * u / 0.26));
}
/** where the click counts on each reader, ms from leaving NC: Theseus at NC release (its 70 µs target); a single-throw
   mouse when NO closes plus its debounce's cost (TechPowerUp's +3.0 ms at a 4 ms setting) */
const B03_TM = { ours: B03.tgtUs / 1000, theirs: B03.flightMs + B03.debounceCost, bounceEnd: B03.flightMs + 0.8, win: 5 };
/**
 * The photo finish (stage px): one clock from the pole leaving NC, the switch's own events on top, then Theseus's reader and
 * a single-throw reader, each marking where it counts the click. tau: the clock now (ms). Returns nothing.
 */
function b03_race(t, x, y, w, tau, a) {
  if (a <= 0.003) return;
  const M = B03_TM, lx = x, ax = x + 330, aw = w - 360, X = ms => ax + aw * ms / M.win, rows = [y + 34, y + 100, y + 166], yA = y + 202;
  /* the clock: 0 to 5 ms, and the cursor */
  line(ax, yA, ax + aw, yA, { color: C.hair, w: 1.5, alpha: a });
  for (let m = 0; m <= M.win; m++) { line(X(m), yA - 6, X(m), yA + 6, { color: C.faint, w: 1.5, alpha: a }); text(m + ' ms', X(m), yA + 32, { role: 'label', size: 19, color: C.faint, align: 'center', caps: false, alpha: a }); }
  const tc = clamp(tau, 0, M.win);
  if (tau > 0 && tau < M.win + 0.4) line(X(tc), y + 4, X(tc), yA, { color: C.ink2, w: 1.5, alpha: a * (1 - ep(tau, M.win, M.win + 0.4)) });
  /* row 0: the switch */
  text('The switch', lx, rows[0] + 8, { role: 'small', size: 25, weight: 750, color: C.ink, alpha: a });
  const ev = (ms, lab, al) => { const k = a * ep(tau, ms, ms + 0.12); if (k <= 0.003) return; circle(X(ms), rows[0], 6, { fill: C.ink2, alpha: k }); text(lab, X(ms) + (al === 'r' ? -12 : 12), rows[0] - 14, { role: 'small', size: 21, weight: 650, color: C.ink2, align: al === 'r' ? 'right' : 'left', alpha: k }); };
  line(X(0), rows[0], X(Math.min(tc, B03.flightMs)), rows[0], { color: C.faint, w: 2, dash: [4, 4], alpha: a * (tau > 0 ? 1 : 0) });
  ev(0, 'leaves NC'); ev(B03.flightMs, 'lands on NO');
  if (tau > B03.flightMs) { const b1 = Math.min(tc, M.bounceEnd); G.save(); G.globalAlpha = a * 0.5; G.fillStyle = C.track; G.fillRect(X(B03.flightMs), rows[0] - 7, X(b1) - X(B03.flightMs), 14); G.restore(); if (tau > B03.flightMs + 0.3) text('bounces', X(B03.flightMs + 0.42), rows[0] + 32, { role: 'small', size: 21, weight: 600, color: C.mute, align: 'center', alpha: a * ep(tau, B03.flightMs + 0.3, B03.flightMs + 0.5) }); }
  /* row 1: Theseus, at NC release */
  rich([{ s: 'Theseus', role: 'small', size: 25, weight: 800, color: C.heroText }, { s: 'reads NC', role: 'small', size: 21, weight: 600, color: C.mute, gap: 10, sentence: false }], lx, rows[1] + 8, { alpha: a });
  if (tau >= M.ours) { const k = a * ep(tau, M.ours, M.ours + 0.15); circle(X(M.ours), rows[1], 9, { fill: C.hero, alpha: k }); text('counted', X(M.ours) + 18, rows[1] + 8, { role: 'small', size: 23, weight: 750, color: C.heroText, alpha: k }); }
  /* row 2: a single-throw reader: nothing until NO closes, then the wait */
  rich([{ s: 'Single throw', role: 'small', size: 25, weight: 800, color: C.ink }, { s: 'at a 4 ms debounce', role: 'small', size: 21, weight: 600, color: C.mute, gap: 10, sentence: false }], lx, rows[2] + 8, { alpha: a });
  if (tau > B03.flightMs) {
    const w1 = Math.min(tc, M.theirs);
    G.save(); G.globalAlpha = a; G.fillStyle = C.track; G.fillRect(X(B03.flightMs), rows[2] - 9, X(w1) - X(B03.flightMs), 18); G.restore();
    if (tau > B03.flightMs + 0.4) text('waiting out the bounce', X(B03.flightMs) + 12, rows[2] + 7, { role: 'small', size: 19, weight: 650, color: C.ink2, alpha: a * ep(tau, B03.flightMs + 0.4, B03.flightMs + 0.7) });
  }
  if (tau >= M.theirs) {
    const k = a * ep(tau, M.theirs, M.theirs + 0.15); circle(X(M.theirs), rows[2], 9, { fill: C.comp, alpha: k });
    /* the cost, as a fault: how much later than Theseus it counts */
    rich([{ s: 'counted,', role: 'small', size: 23, weight: 750, color: C.ink }, { s: b03_floor(M.theirs - M.ours, 1) + ' ms later', role: 'small', size: 23, weight: 800, color: C.red, gap: 8, sentence: false }], X(M.theirs) - 18, rows[2] - 18, { align: 'right', alpha: k });
  }
}
/**
 * The shot (stage px), on the same clock: a flick still turning at 300 °/s (an example) crosses a head at 20 m (0.72° across)
 * as the finger clicks (tau = 0). The shot leaves where the crosshair is when the click is counted: Theseus's at +0.07 ms,
 * a single-throw mouse's at +4.5 ms, 1.35° on. 1° = deg px.
 */
function b03_shotLate(t, x, y, w, h, tau, a) {
  if (a <= 0.003) return;
  const vel = 300, deg = 118, M = B03_TM, tx = x + w * 0.38, ty = y + h * 0.52, r = 0.72 / 2 * deg, ang = ms => vel * ms / 1000;
  demoWindow(x, y, w, h, a, { fill: TH ? '#E8E8EB' : '#0B0C0E' });
  clipped(x, y, w, h, () => {
    G.save(); G.globalAlpha = a;
    /* the head, and a ring round it */
    circle(tx, ty, r * 1.7, { color: inkA(0.16), w: 1.5 }); circle(tx, ty, r, { fill: TH ? '#3A3A3E' : '#CECED2' });
    /* the crosshair: it has been turning since before the click and keeps turning */
    /* (it keeps turning; once both shots have left it fades, so the settled frame shows the shots alone) */
    const cx = tx + ang(clamp(tau, -2.2, M.win + 0.6)) * deg, ch = TH ? '#111111' : '#FFFFFF', g = 9, l2 = 15, kc = a * (1 - ep(tau, M.theirs + 0.3, M.theirs + 0.8));
    if (kc > 0.003) { for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) line(cx + dx * g, ty + dy * g, cx + dx * (g + l2), ty + dy * (g + l2), { color: ch, w: 2.5, alpha: kc }); circle(cx, ty, 2, { fill: ch, alpha: kc }); }
    /* the shots: each where the crosshair was when its click counted */
    if (tau >= M.ours) { const k = ep(tau, M.ours, M.ours + 0.2), sx = tx + ang(M.ours) * deg; circle(sx, ty, 7, { fill: C.hero, alpha: a * k }); circle(sx, ty, 7 + 22 * E.out3(clamp((tau - M.ours) / 0.5)), { color: C.hero, w: 2.5, alpha: a * (1 - clamp((tau - M.ours) / 0.5)) }); }
    if (tau >= M.theirs) { const k = ep(tau, M.theirs, M.theirs + 0.2), sx = tx + ang(M.theirs) * deg, rr = 8; line(sx - rr, ty - rr, sx + rr, ty + rr, { color: C.red, w: 3.5, alpha: a * k }); line(sx - rr, ty + rr, sx + rr, ty - rr, { color: C.red, w: 3.5, alpha: a * k }); }
    G.restore();
  });
  text('The shot', x + 20, y + 36, { role: 'label', size: 20, color: C.mute, alpha: a });
  if (tau >= M.ours) text('Theseus: a hit', tx - r * 1.7 - 14, ty + 8, { role: 'small', size: 23, weight: 750, color: C.heroText, align: 'right', alpha: a * ep(tau, M.ours, M.ours + 0.3) });
  if (tau >= M.theirs) text('4 ms debounce: ' + b03_floor(ang(M.theirs), 1) + '° wide, a miss', x + w - 20, ty + 46, { role: 'small', size: 22, weight: 750, color: C.red, align: 'right', alpha: a * ep(tau, M.theirs + 0.3, M.theirs + 0.6) });
  text('A flick still turning at 300 °/s, a head at 20 m: an example', x + 20, y + h - 18, { role: 'label', size: 19, color: C.faint, caps: false, alpha: a });
}
const B03_TM_T = { go: 2.4, slow: 1000, verdict: 7.4 };
S({
  id: 'b03_timing', ch: 'click', theme: 'night', title: 'Negative latency', settle: 12, ideas: [79],
  replaces: ['latency', 'clk_wait', 'clk_methods'], src: ['clk_xbabClick', 'b03_toms', 'b03_tpuHati', 'b03_ganssle', 'b03_egg'],
  answers: [
    ['latency: difficult to understand', 'One press, slowed 1,000×, on one clock: the pole leaves NC (Theseus counts), flies 1.5 ms, lands on NO and bounces, and a single-throw mouse counts only after its wait. Nothing else moves'],
    ['i like that it sells something though', 'It still sells: counted 1.4 ms before the switch even closes, and the shot that hits instead of missing'],
    ['its hard to tell what is changing', 'Only the press moves; each reader marks the moment it counts, on the same clock, and the cost is one red bracket: 4.4 ms later'],
    ['clk_wait: hard to understand, probably can be combined somewhere else', 'Combined here: under the verdict, "70 µs to USB, moving or still: the target (XA25: 72 µs)" (F18.5), and the footnote carries XBAB\'s finding that the OP1 8k v2 adds 121 µs moving'],
    ['(R3-b03-2) the headline', 'The verdict is the title\'s claim: when the click counts, from the switch closing, single throw 0.0 ms → Theseus −1.4 ms (a single throw at its best, with no debounce; the 4 ms debounce lane shows how much later it gets)'],
    ['clk_methods: probably can be combined somewhere else or removed', 'Removed as a slide: every number\'s method is in one quiet line at the foot']
  ],
  sfx: [[2.4, 'click']],
  draw: t => {
    const T = B03_TM_T, box = [80, 260, 860, 430], K = CLK_G1, Q = B03_SW, tau = (t - T.go) * 1000 / T.slow;
    header(t, 'Negative latency');
    captions(t, [[0.3, 'A single-throw mouse can\'t count a click until the switch closes, and many then wait out the bounce.'],
      [T.go - 0.2, 'Slowed 1,000×: the pole leaves NC, and Theseus counts the click right then.'],
      [T.go + 1.5, 'It reaches NO 1.5 ms after leaving NC, and bounces; a single-throw mouse only starts counting there.'],
      [T.verdict + 1.8, 'Counted as the pole leaves NC, 1.4 ms before the switch closes: the shot leaves when your finger says.']]);
    /* where: the mouse from the side, pushed in to the GT01's contacts (the pole between NC and NO) */
    const c0 = b03_gS(K.zC, 4.4), fx = Q.xG + c0[0], fy = Q.yB + c0[1], focus = [fx - 2.5, fy - 1.45, 5.0, 2.9];
    const est = establish(t, 0, box, { view: 'left', hi: ['triggers'], col: 'ink', focus, locator: 'tr', fade: 0.3,
      mouse: { lit: ep(t, 0.12, 0.55) * (1 - 0.8 * ep(t, 1.2, 1.8)), hide: t > 0.95 ? ['side', 'side1', 'side2'] : [] } });
    /* the press: the plunger down from 1.4 s; the pole leaves NC at T.go */
    const press = ep(t, T.go - 0.9, T.go - 0.05, E.io3), pos = b03_polePos(tau);
    let gt = {};
    est.draw(() => { xsave(); xmove(Q.xG, Q.yB); pcbSec(-20, 30, 0, BOARD_T, { holes: [-5.08, 0, 5.08] }); gt = b03_gt01Pole({ pos, press }); xrest(); });
    const kd = est.kd;
    if (kd > 0.5 && gt.nc) {
      const C2 = { prose: true, maxW: 260, side: 'l', color: C.ink2, tcolor: C.ink }, xl = box[0] + 252;
      callout(t, 1.5, gt.nc, 'NC: closed at rest', Object.assign({ to: [xl, box[1] + 64] }, C2));
      callout(t, 1.7, gt.contact, 'The pole', Object.assign({ to: [xl, box[1] + 172] }, C2));
      callout(t, 1.9, gt.no, 'NO: open at rest', Object.assign({ to: [xl, box[1] + 252] }, C2));
      /* the cause: the plunger, out of frame, pushes the leaf down the switch's axis */
      if (gt.leaf && t < T.go + 0.6) forceArrow(gt.leaf[0], gt.leaf[1], Math.atan2(K.c, K.s), 64, { k: press * (1 - ep(t, T.go + 0.2, T.go + 0.6)), color: C.ink, w: 3 });
    }
    /* the race and the shot, on the clock */
    const ka = ep(t, 1.4, 1.9);
    b03_race(t, LM, 724, RM - LM, tau, ka);
    b03_shotLate(t, 980, 260, RM - 980, 200, tau, ep(t, 1.6, 2.1));
    /* the verdict is the title's claim (R3-b03-2): when the click counts, measured from the switch closing. A single throw at its
       best (no debounce) counts as it closes, 0.0; Theseus counts as the pole leaves NC, 1.43 ms earlier with its own 70 µs to
       USB included (the rival's left out: conservative), shown −1.4. The debounce's extra wait is b03_debounce's, not repeated
       here; the end-to-end target against the quickest rival measured (XBAB's XA25, also read at NC release: F18.5) stays under it */
    verdict(t, T.verdict, 980, 600, { from: '0.0', to: '−' + b03_floor(B03.flightMs - B03_TM.ours, 1), unit: 'ms', dec: 1, label: 'When the click counts, from the switch closing', better: 'lower', who: ['Single throw, at best', 'Theseus'], net: false, size: 112, maxW: RM - 980 });
    scaleNote(980, 712, 'to USB, moving or still: the target (XA25: ' + Math.floor(B03.xa25Us) + ' µs)', { lead: B03.tgtUs + ' µs', t, t0: T.verdict + 1.6 });
    text('Electrical latency, NC edge to USB: XA25 72.04 µs, n 500 (XBAB 2026); the OP1 8k v2 adds 121 µs moving. Theseus: target. 4 ms debounce: Lamzu Atlantis, +3.0 ms (TechPowerUp)', LM, 994, { role: 'foot', color: C.faint, alpha: ep(t, T.verdict + 1.0, T.verdict + 1.4), maxW: RM - LM });
  }
});
/* ============================== b03_debounce: low, and yours to set ==============================
   One press from a drag click, slowed 200×: the pole leaves NC, lands on NO and chatters as the finger drags. A single-throw
   reader counts an NO closing, then ignores NO for its window; the pointer drags the window from Fnatic's recommended 4 ms
   down, and the chatter starts to count (the doubles drag clickers ask for). Theseus's default is double throw: counted as the
   pole leaves NC, no window, no false doubles; single throw with a window is there for those who want it (a proposal). */
const B03_DB = { closes: [1.5, 2.3, 3.0, 3.6, 4.1], opens: [2.0, 2.75, 3.35, 3.85], span: 6, wFrom: 4, wTo: 0.5, wMax: 20 };
const B03_DB_T = { draw: 0.3, drawDur: 1.4, drag: [2.4, 4.4], toTheseus: 5.4, verdict: 6.5, pay: 8.4 };
/** the closings a single-throw reader counts with a window of w ms (eager: count, then ignore NO for w) */
function b03_dbCounted(w) { const out = []; let last = -1e9; for (const c of B03_DB.closes) if (c >= last + w - 1e-9) { out.push(c); last = c; } return out; }
/** the window the pointer has set by slide time t, ms */
const b03_dbW = t => lerp(B03_DB.wFrom, B03_DB.wTo, ep(t, B03_DB_T.drag[0], B03_DB_T.drag[1], E.io3));
S({
  id: 'b03_debounce', ch: 'click', theme: 'paper', title: 'Debounce: low, and yours to set', settle: 11, ideas: [79],
  replaces: ['clk_debounce'], src: ['b03_fnatic', 'b03_razerInsider', 'b03_redlotus', 'b03_tpuHati', 'tpuAtlantis'],
  answers: [
    ['weak slide', 'Now a demonstration: one drag click\'s chatter on the contact, a reader\'s window shading what it ignores, the pointer dragging that window down from Fnatic\'s recommended 4 ms until the chatter counts, then Theseus\'s default'],
    ['minecraft kids want to be able to adjust their debounce to count more double clicks', 'They can: single-throw mode with a window from 0 to 20 ms (a proposal for the software), shown counting 1 → 5 from one press as the window comes down; Razer Insider\'s Minecraft player quoted'],
    ['so i\'m not sure how to feel about how this is being sold', 'Sold as low by default and yours to set: the default needs no window at all, and the window is there for players who want the doubles'],
    ['low debounce is good and important though to most people', 'The default is double throw: counted as the pole leaves NC, 0 ms of wait and no false doubles (the verdict, "Wait to count a click": Fnatic\'s advice 4 ms → Theseus default 0 ms)'],
    ['(R2-b03-1) what a drag click is', 'Drawn: a fingertip dragged along the button while the trace draws, the switch under it flashing at each closing of NO, so the chatter has its visible cause'],
    ['there is just a sub group of people who really dislike it', 'Said plainly: some players want the doubles, and some want none; the setting serves both, and the default gives the second group no doubles without any wait'],
    ['(integrator, on b03\'s question 7) counting at NC release can take a slam or a drop as a click', 'A third mode in the panel: "Double throw, safe", counted when the pole lands on NO, 1.4 ms later, so a drop or a slam can\'t click; still no window']
  ],
  sfx: [[5.6, 'click']],
  draw: t => {
    const T = B03_DB_T, D = B03_DB, x0 = LM, tw0 = 1120, tx = x0 + 150, tw1 = tw0 - 230, X = ms => tx + tw1 * ms / D.span;
    header(t, 'Debounce: low, and yours to set');
    captions(t, [[0.3, 'One drag click makes the contact chatter. How many clicks that counts as is a setting.'],
      [T.drag[0] + 0.6, 'Lower the window and the chatter counts: the double clicks drag clickers ask for.'],
      [T.toTheseus + 0.2, 'Theseus reads both throws by default: no window, no wait, and no false doubles.'],
      [T.pay, 'Fast and clean for most players; doubles for those who want them. One mouse.']]);
    const theseus = t >= T.toTheseus + 0.25, w = b03_dbW(t), cnt = theseus ? [0] : b03_dbCounted(w);
    /* the trace: one press, NC above and NO below, drawn in as it happens (slowed 200×) */
    demoWindow(x0, 260, tw0, 430, 1, { plain: true });   /* frame one: the trace's frame, its lanes and the mode panel are there from t = 0 */
    ltag(x0 + 28, 302, 'One drag click', 'slowed 200×', { a: 1, size: 20 });
    const now = D.span * ep(t, T.draw, T.draw + T.drawDur, E.lin), ka = 1;
    const lane = { nc: 400, no: 520 }, amp = 46;
    for (const [k, y, name] of [['nc', lane.nc, 'NC'], ['no', lane.no, 'NO']]) {
      text(name, x0 + 40, y - amp / 2 + 8, { role: 'label', size: 22, color: theseus && k === 'nc' ? C.heroText : C.ink2, alpha: ka });
      line(tx, y, tx + tw1, y, { color: C.hair, w: 1.2, alpha: ka });
    }
    for (let m = 0; m <= D.span; m++) text(m + ' ms', X(m), 630, { role: 'label', size: 19, color: C.faint, align: 'center', caps: false, alpha: ka });
    /* NC: closed until the pole leaves it at 0, then open for the whole press */
    { const pts = [[X(0) - 40, lane.nc - amp], [X(0), lane.nc - amp], [X(0), lane.nc], [X(now), lane.nc]];
      poly(now > 0 ? pts : pts.slice(0, 2), { color: theseus ? C.hero : C.ink2, w: theseus ? 3.5 : 2.4, alpha: ka }); }
    /* NO: open, then closing and opening as it chatters, then held */
    { const ev = []; D.closes.forEach((c, i) => { ev.push([c, 1]); if (D.opens[i] != null) ev.push([D.opens[i], 0]); });
      const pts = [[X(0) - 40, lane.no]]; let v = 0;
      for (const [m, nv] of ev) { if (m > now) break; pts.push([X(m), lane.no - v * amp], [X(m), lane.no - nv * amp]); v = nv; }
      pts.push([X(now), lane.no - v * amp]);
      poly(pts, { color: theseus ? C.faint : C.ink, w: 2.6, alpha: ka }); }
    /* the cause (R2-b03-1, M2): a fingertip dragged along the button as the trace draws, the switch under it flashing at each
       closing of NO; it gives its band to Theseus's note as the default is picked */
    { const kd = 1 - ep(t, T.toTheseus - 0.4, T.toTheseus);
      if (kd > 0.003) {
        const bx0 = 730, bx1 = 1150, by = 344, kdr = ep(t, T.draw, T.draw + T.drawDur, E.lin), fx = lerp(bx0 + 110, bx1 - 50, kdr), swx = (bx0 + bx1) / 2;
        rr(bx0, by, bx1 - bx0, 9, 4, TH ? C.comp2 : C.comp, inkA(0.45), 1.2, kd);
        rr(swx - 18, by + 10, 36, 15, 3, TH ? '#2C2D32' : '#0E0E10', null, 0, kd);
        let fl = 0; for (const c of D.closes) { const u = t - (T.draw + T.drawDur * c / D.span); if (u >= 0 && u < 0.18) fl = Math.max(fl, 1 - u / 0.18); }
        if (fl > 0.01) circle(swx, by + 17, 14 + 10 * (1 - fl), { color: C.ink2, w: 2, alpha: kd * fl });
        finger(fx, by, 0.16, { s: 2.2, surf: 0, press: 1, view: 'side', alpha: kd });   /* surf: the pad lies on the level button (F52.1) */
        text('Dragged along the button', bx0 - 16, by + 4, { role: 'small', size: 20, weight: 600, color: C.mute, align: 'right', alpha: kd });
      } }
    /* what the reader counts: single throw, a window of w after each counted closing; Theseus, once, as NC opens */
    const kr = ep(t, T.draw + T.drawDur - 0.2, T.draw + T.drawDur + 0.2);
    if (!theseus) {
      cnt.forEach((c, i) => {
        if (c > now) return;
        G.save(); G.globalAlpha = kr * (1 - ep(t, T.toTheseus, T.toTheseus + 0.25)) * 0.9; G.fillStyle = C.track; G.fillRect(X(c), lane.no - amp - 18, Math.max(2, X(Math.min(c + w, D.span)) - X(c)), amp + 30); G.restore();
        circle(X(c), lane.no - amp - 30, 15, { fill: C.ink2, alpha: kr });   /* neutral: the doubles drag clickers ask for (R2-b03-3) */
        text(String(i + 1), X(c), lane.no - amp - 23, { role: 'small', size: 19, weight: 800, color: C.onHero || '#FFFFFF', align: 'center', alpha: kr });
      });
      if (kr > 0.3) text('ignored: the window', X(cnt[0]) + 12, lane.no + 34, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: kr * (1 - ep(t, T.drag[0] + 0.6, T.drag[0] + 1.0)) });
    } else {
      const kt = ep(t, T.toTheseus + 0.25, T.toTheseus + 0.6);
      circle(X(0.07), lane.nc - amp - 26, 15, { fill: C.hero, alpha: kt });
      text('1', X(0.07), lane.nc - amp - 19, { role: 'small', size: 19, weight: 800, color: C.onHero || '#FFFFFF', align: 'center', alpha: kt });
      text('counted as the pole leaves NC; NO\'s chatter can\'t reopen NC', X(0.07) + 26, lane.nc - amp - 19, { role: 'small', size: 22, weight: 700, color: C.heroText, alpha: kt });
    }
    /* the count, big */
    const n = cnt.filter(c => c <= now).length, kn = ep(t, 0.6, 1.0);
    rich([{ s: String(n), role: 'stat', size: 96, weight: 800, color: theseus ? C.heroText : C.ink, tnum: true }], x0 + tw0 - 36, 470, { align: 'right', alpha: kn });
    text(n === 1 ? 'click' : 'clicks', x0 + tw0 - 36, 506, { role: 'small', size: 24, weight: 650, color: C.mute, align: 'right', alpha: kn });
    /* the window, as a setting: a slider the pointer drags */
    const sy = 760, sx0 = x0 + 270, sw = tw0 - 270 - 40, SX = ms => sx0 + sw * ms / D.wMax, ks = ep(t, 1.2, 1.6) * (1 - ep(t, T.toTheseus, T.toTheseus + 0.4) * 0.6);
    if (ks > 0.003) {
      text('Debounce window', x0, sy + 8, { role: 'small', size: 23, weight: 700, color: C.ink, alpha: ks });
      line(sx0, sy, sx0 + sw, sy, { color: C.hair, w: 6, cap: 'round', alpha: ks }); line(sx0, sy, SX(w), sy, { color: C.ink2, w: 6, cap: 'round', alpha: ks });
      for (const m of [0, 4, 10, 20]) text(m + ' ms', SX(m), sy + 40, { role: 'label', size: 19, color: m === 4 ? C.secondText : C.faint, align: 'center', caps: false, alpha: ks });
      text('Fnatic\'s advice', SX(4), sy - 30, { role: 'label', size: 19, color: C.secondText, align: 'center', alpha: ks * ep(t, 1.4, 1.8) });
      circle(SX(w), sy, 14, { fill: C.panel, color: C.ink2, w: 3, alpha: ks });
      text(kitNum(w, 1) + ' ms', SX(w), sy + 74, { role: 'small', size: 23, weight: 750, color: C.ink, align: 'center', alpha: ks });
    }
    /* the setting, in Theseus's software (a proposal): two modes */
    const px = 1240, py = 260, pw = RM - px, ph = 430, kp = 1;
    if (kp > 0.003) {
      demoWindow(px, py, pw, ph, kp, { plain: true });
      text('Click mode', px + 32, py + 56, { role: 'label', size: 21, color: C.mute, alpha: kp });
      const opt = (y, on, head, sub, hero) => {
        circle(px + 46, y - 8, 12, { color: hero && on ? C.hero : C.ink2, w: 2.5, alpha: kp }); if (on) circle(px + 46, y - 8, 6, { fill: hero ? C.hero : C.ink2, alpha: kp });
        text(head, px + 72, y, { role: 'small', size: 25, weight: 750, color: on ? (hero ? C.heroText : C.ink) : C.mute, alpha: kp, maxW: pw - 100 });
        text(sub, px + 72, y + 32, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: kp, maxW: pw - 100, lh: 1.3 });
      };
      opt(py + 118, theseus, 'Double throw (default)', 'counted as the pole leaves NC: no window, no wait, no false doubles', true);
      opt(py + 232, !theseus, 'Single throw', 'counted on NO, with a window you set: 0 to 20 ms. Low for doubles', false);
      /* the safe mode (integrator, on b03's question 7): a slam or a drop can jolt the pole off NC, so for players who'd rather,
         double throw counted when the pole lands on NO: still no window, 1.4 ms later (b03_timing's flight) */
      opt(py + 346, false, 'Double throw, safe', 'counted when the pole lands on NO, 1.4 ms later: a drop or a slam can\'t click', false);
    }
    /* the pointer: drags the window down, then picks the default */
    const kb = [[T.drag[0] - 0.6, [SX(4) + 60, sy + 60]], [T.drag[0], [SX(4), sy]], [T.drag[1], [SX(D.wTo), sy]], [T.toTheseus - 0.45, [px + 46, py + 110]], [T.toTheseus + 0.6, [px + 46, py + 110]], [T.toTheseus + 1.2, [px + 120, py + 200]]];
    if (t > T.drag[0] - 0.9 && t < T.toTheseus + 1.6) cursorAt(t, kb, [T.drag[0], T.toTheseus], { a: ep(t, T.drag[0] - 0.9, T.drag[0] - 0.5) * (1 - ep(t, T.toTheseus + 1.1, T.toTheseus + 1.5)) });
    /* the verdict: the default wait */
    /* Fnatic advises 4 ms or more; it doesn't say its default (R2-b03-2), so the rival's side is named as advice */
    verdict(t, T.verdict, 1240, 850, { from: '4', to: '0', unit: 'ms', dec: 0, label: 'Wait to count a click', better: 'lower', who: ['Fnatic\'s advice', 'Theseus default'], net: false, size: 120, maxW: RM - 1240 });
    scaleNote(1240, 962, 'and no false doubles', { lead: 'No window', t, t0: T.verdict + 1.6 });
    text('Fnatic\'s help: 0 to 20 ms, 4 ms or more advised, lower "may result in double clicks". Razer Insider (2022): "FPS and Minecrafter\'s could BOTH be good with it". Chatter illustrated', LM, 994, { role: 'foot', color: C.faint, alpha: ep(t, T.verdict + 1.0, T.verdict + 1.4), maxW: RM - LM });
  }
});
/* ============================== b03_hotswap: hot-swap switches, no solder ==============================
   Most mice solder the switch's three legs to the board, so a worn switch (it starts to double click, iFixit) means a
   soldering iron or the bin. Theseus's legs sit in Mill-Max 3305 claw sockets: one cut open, large, as a leg is pulled out
   and a new one pushed in. The same camera, the same leg; the rival first, then the wipe. */
/** the rival: a switch leg soldered through the board, cut through its axis (frame as b03_clawMM: mm, y down, origin on
   the board's top at the hole's centre). A 1.0 mm hole, a grey mask (a rival's board), solder filling the hole and a
   fillet on each side; the leg 0.6 mm, running on 2.3 mm below the board. */
function b03_solderedMM() {
  const tP = 1.0, hR = 0.5, bw = 3.6, pinW = 0.6, out = {};
  for (const s of [-1, 1]) {
    solid(() => { G.beginPath(); G.moveTo(s * bw, 0); G.lineTo(s * hR, 0); G.lineTo(s * hR, tP); G.lineTo(s * bw, tP); brk(s * bw, tP, 0, 0.12); G.closePath(); }, MT.fr4, [Math.min(s * bw, s * hR), 0, bw - hR, tP], { fill: B03C.fr4(), ec: edgeCol(MT.fr4), hatch: { sp: 3 } });
    G.fillStyle = B03C.maskRival(); G.fillRect(s * (hR + 0.6), -0.045, s * (bw - hR - 0.6), 0.05); G.fillRect(s * (hR + 0.6), tP - 0.005, s * (bw - hR - 0.6), 0.05);
    G.fillStyle = B03C.copper; G.fillRect(s > 0 ? hR - 0.03 : -hR, -0.03, 0.03, tP + 0.06); G.fillRect(s * hR, -0.04, s * 0.6, 0.04); G.fillRect(s * hR, tP, s * 0.6, 0.04);
    /* the solder: the hole full round the leg, a fillet over each pad */
    solid(() => { G.beginPath(); G.moveTo(s * pinW / 2, -0.32); G.quadraticCurveTo(s * (pinW / 2 + 0.12), -0.02, s * (hR + 0.62), -0.04); G.lineTo(s * hR, -0.04); G.lineTo(s * hR, tP + 0.04); G.lineTo(s * (hR + 0.62), tP + 0.04); G.quadraticCurveTo(s * (pinW / 2 + 0.16), tP + 0.1, s * pinW / 2, tP + 0.62); G.closePath(); }, MT.tin, [-hR - 0.62, -0.32, 2 * (hR + 0.62), tP + 0.94], { fill: B03C.tin(), ec: edgeCol(MT.tin), lw: 0.8 });
  }
  solid(() => { G.beginPath(); G.moveTo(-pinW / 2, -6); G.lineTo(-pinW / 2, tP + 2.0); G.lineTo(-0.1, tP + 2.3); G.lineTo(0.1, tP + 2.3); G.lineTo(pinW / 2, tP + 2.0); G.lineTo(pinW / 2, -6); G.closePath(); }, MT.brass, [-pinW / 2, -6, pinW, tP + 8.3], { fill: '#D7B76A', ec: 'rgba(70,48,10,0.8)', horiz: true });
  out.joint = SP(hR + 0.45, tP + 0.3); out.top = SP(-hR - 0.4, -0.08); out.leg = SP(pinW / 2, -1.6); out.board = SP(-2.4, tP / 2);
  return out;
}
const B03_HS_T = { test: 0.3, wipe: 3.5, pull: 4.6, push: 6.0, verdict: 7.1, tiles: 8.7 };
/** the leg's place in the socket by slide time: seated, pulled out, a new one pushed in (b03_clawMM's insert, 0..1) */
const b03_hsInsert = t => { const T = B03_HS_T; return 1 - ep(t, T.pull, T.pull + 0.7, E.io3) + ep(t, T.push, T.push + 0.8, E.io3); };
S({
  id: 'b03_hotswap', ch: 'click', theme: 'night', title: 'Hot-swap switches, no solder', settle: 11, ideas: [14],
  replaces: ['clk_hotswap'], src: ['b03_ifixit', 'b03_millmax', 'b03_toms', 'b03_egg', 'b03_brockDoc'],
  answers: [
    ['demonstration is plane', 'Now a demonstration in one camera: the rival\'s leg soldered through the board, wiped to Theseus\'s claw socket, then the leg pulled out and a new one pushed in while the fingers open and grip'],
    ['it\'s hard to see the claw clips', 'One Mill-Max 3305 cut through its axis, about 100 px a millimetre: the gold shell and flange, and two of its six beryllium-copper fingers spreading round the leg as it goes in'],
    ['there also is no argument as to why this is important', 'The argument first: a worn switch starts to double click, and when it is soldered in the mouse ends there (iFixit: a swap "usually involves de-soldering around a dozen contact points")']
  ],
  sfx: [[0.75, 'click'], [6.75, 'snap'], [6.85, 'click']],
  draw: t => {
    const T = B03_HS_T, box = [80, 260, 1000, 700], RX = 1140, RW = RM - 1140, Q = B03_SW;
    header(t, 'Hot-swap switches, no solder');
    captions(t, [[0.3, 'A worn switch starts to double click; when it is soldered in, that ends the mouse.'],
      [T.wipe, 'Theseus\'s switches stand in claw sockets: pull one out, push a new one in, no solder.'],
      [T.tiles, 'Keep the mouse, change the switch: a new one every week for 19 years before the sockets are spent.']]);
    /* where: the left trigger's switch, its middle leg where it meets the board, pushed in from the whole mouse */
    const est = establish(t, 0, box, { view: 'left', hi: ['triggers'], col: 'ink', focus: [Q.xG - 4.2, Q.yB - 2.7, 8.4, 5.9], locator: 'tr', fade: 0.3,
      mouse: { lit: ep(t, 0.12, 0.55) * (1 - 0.8 * ep(t, 1.2, 1.8)), hide: t > 0.95 ? ['side', 'side1', 'side2'] : [] } });
    const ins = b03_hsInsert(t);
    let rv = {}, cl = {};
    const drawRival = () => est.draw(() => { xsave(); xmove(Q.xG, Q.yB); rv = b03_solderedMM(); xrest(); });
    const drawOurs = () => est.draw(() => { xsave(); xmove(Q.xG, Q.yB); cl = b03_clawMM({ insert: ins }); xrest(); });
    if (est.kd > 0.001) { G.save(); G.globalAlpha = est.kd; wipeTo(t, T.wipe, 0.9, box, drawRival, drawOurs, { rival: 'Soldered', right: 'Theseus' }); G.restore(); }
    /* the parts, named */
    if (est.kd > 0.5) {
      const lx = box[0] + box[2] - 300, C2 = { side: 'r', prose: true, maxW: 270 };
      if (t < T.wipe) {
        if (rv.joint) faultTag(t, 1.7, rv.joint, 'Soldered: three joints a switch', Object.assign({ to: [lx, box[1] + 520] }, C2));
        if (rv.leg) callout(t, 1.9, rv.leg, 'The switch\'s leg', Object.assign({ to: [lx, box[1] + 120], color: C.ink2, tcolor: C.ink }, C2));
      } else if (t > T.wipe + 0.9) {
        if (cl.finger) fixTag(t, T.wipe + 1.0, cl.finger, 'Six beryllium-copper fingers grip the leg (two in this cut)', Object.assign({ to: [lx, box[1] + 300] }, C2));
        if (cl.flange) callout(t, T.wipe + 1.3, cl.flange, 'Mill-Max 3305, gold-plated', Object.assign({ to: [box[0] + 300, box[1] + 120], side: 'l', color: C.ink2, tcolor: C.ink, prose: true, maxW: 240 }));
        if (cl.body) callout(t, T.wipe + 1.6, cl.body, 'Soldered to the board once, at the factory', Object.assign({ to: [lx, box[1] + 560], color: C.ink2, tcolor: C.ink }, C2));
      }
      /* the hand that pulls and pushes, as a force on the leg */
      if (cl.leg && t > T.pull - 0.2 && t < T.push + 1.0) {
        const up = t < T.push - 0.2, k = up ? ep(t, T.pull - 0.2, T.pull) * (1 - ep(t, T.pull + 0.7, T.pull + 0.9)) : ep(t, T.push - 0.2, T.push) * (1 - ep(t, T.push + 0.8, T.push + 1.0));
        clipped(box[0], box[1], box[2], box[3], () => forceArrow(cl.leg[0] + 44, cl.leg[1] + (up ? -10 : 40), up ? -Math.PI / 2 : Math.PI / 2, 80, { k, color: C.ink, w: 3, label: up ? 'pull' : 'push', side: 'r' }));
      }
    }
    /* the argument: a worn switch double clicks (a click test); after the swap the same test, with the new switch, once */
    const kq = ep(t, T.test, T.test + 0.3) * (1 - ep(t, T.verdict - 0.2, T.verdict + 0.2));
    if (kq > 0.003) {
      const fresh = t >= T.push + 0.85, n = fresh ? 1 : t >= 0.75 ? (t >= 0.86 ? 2 : 1) : 0, kf = ep(t, T.push + 0.85, T.push + 1.1);
      demoWindow(RX, 260, RW, 300, kq, { plain: true });
      text('Click test: press once', RX + 30, 304, { role: 'label', size: 21, color: C.mute, alpha: kq });
      rich([{ s: String(n), role: 'stat', size: 120, weight: 800, color: fresh ? C.heroText : n > 1 ? C.red : C.ink, tnum: true }, { s: n === 1 ? 'click' : 'clicks', role: 'small', size: 26, weight: 650, color: C.mute, gap: 14, sentence: false }], RX + 30, 450, { alpha: kq });
      if (n > 1 && !fresh) text('A worn switch double clicks (iFixit 2022)', RX + 30, 510, { role: 'small', size: 23, weight: 700, color: C.red, alpha: kq * ep(t, 0.9, 1.2) });
      if (fresh) text('The new switch, pushed in', RX + 30, 510, { role: 'small', size: 23, weight: 700, color: C.heroText, alpha: kq * kf });
      text('A swap "usually involves de-soldering around a dozen contact points" (iFixit)', RX, 610, { role: 'small', size: 23, weight: 600, color: C.ink2, maxW: RW, lh: 1.3, alpha: kq * ep(t, 1.8, 2.2) * (1 - ep(t, T.wipe, T.wipe + 0.4)) });
    }
    /* the payoff */
    verdict(t, T.verdict, RX + 120, 460, { from: '3', to: '0', dec: 0, label: 'Solder joints to change a switch', better: 'lower', who: ['', 'Theseus'], net: false, size: 120, maxW: RW - 120 });
    { const kw = ep(t, T.verdict + 0.77, T.verdict + 1.17), wOld = tw('3', { role: 'd1', size: 48, weight: 800 });   /* the rival's name, right-aligned under its struck figure, clear of ours */
      text('Soldered', RX + 120 + wOld, 460 + 7 + 34, { role: 'label', size: 19, color: C.secondText, align: 'right', alpha: kw }); }
    statTile(t, T.tiles, [RX, 600, RW, 160], { value: kitNum(B03.cycles, 0), unit: 'swaps', label: 'a socket takes, at least (Mill-Max)', align: 'left' });
    statTile(t, T.tiles + 0.3, [RX, 800, RW, 160], { value: String(Math.floor(B03.cycles / 52)), unit: 'years', label: 'a new switch every week, derived', hero: true, align: 'left' });
    text('Mill-Max 3305: legs 0.635 to 0.940 mm, 1,000 cycles minimum, 10 mΩ max; ROG and Endgame Gear also swap switches. 1,000 ÷ 52 a year = 19 years', LM, 994, { role: 'foot', color: C.faint, alpha: ep(t, T.tiles, T.tiles + 0.4), maxW: RM - LM });
  }
});
/* ============================== b03_side: dual rail side buttons ============================== */
/** the classroom version: a door seen from above, hinged at its left end. A push near the hinge takes far more force than one
   at the handle, for the same swing (torque = force × distance). o = { swing 0..1 }. mm, y down, origin at the hinge */
function b03_doorMM(o = {}) {
  const L = 80, sw = clamp(o.swing || 0) * 0.15, out = {};
  solid(() => { G.beginPath(); G.rect(-10, -3, 10, 6); }, MT.shell, [-10, -3, 10, 6], { fill: B03C.shellLite(), ec: edgeCol(MT.shell), hatch: true });
  solid(() => { G.beginPath(); G.rect(L + 2, -3, 12, 6); }, MT.shell, [L + 2, -3, 12, 6], { fill: B03C.shellLite(), ec: edgeCol(MT.shell), hatch: true });
  G.save(); G.setLineDash([lw(5), lw(4)]); G.beginPath(); G.arc(0, 0, L, 0, 0.16); G.strokeStyle = inkA(0.25); G.lineWidth = lw(1.2); G.stroke(); G.restore();
  xsave(); xturn(sw);
  solid(() => pathRR(0, -1.6, L, 3.2, 0.6), MT.white, [0, -1.6, L, 3.2], { fill: TH ? '#E5E5EA' : '#48484A', ec: edgeCol(MT.white) });
  solid(() => pathRR(L - 9, 1.4, 6, 2.2, 0.8), MT.steel, [L - 9, 1.4, 6, 2.2], { fill: TH ? '#9AA0A8' : '#7E848C', ec: edgeCol(MT.steel) });
  out.at = x => SP(x, -1.6); out.M = XF.m.slice();
  xrest();
  G.beginPath(); G.arc(0, 0, 2.2, 0, TAU); G.fillStyle = TH ? '#8E8E93' : '#6E6E73'; G.fill();
  out.hinge = SP(0, 0); out.L = L;
  return out;
}
/* the timeline (s): establish, the rival's three presses, the wipe, Theseus's three, the verdict, the pull-out */
const B03_SIDE_T = { push: 0, rival: [1.65, 2.3, 2.95], wipe: 4.2, ours: [5.15, 5.8, 6.45], verdict: 6.65, facts: 8.6 };
/* the three spots, mm from the button's front end (the hinge end on the shipping part), and the order they are pressed in */
const B03_SPOTS = [{ s: 3.0, name: 'By the hinge' }, { s: 7.25, name: 'Middle' }, { s: 12.375, name: 'Tip' }];
/** one press at a spot: the thumb's depth 0..1 (pressCurve: in, held, out) */
const b03_sideP = (t, t0) => pressCurve(t, t0, { down: 0.18, hold: 0.28, up: 0.18, bounce: 0.03 });
S({
  id: 'b03_side', ch: 'click', theme: 'paper', title: 'Dual rail side buttons', settle: 11, ideas: [80, 64],
  replaces: ['sidebuttons'], src: ['b03_tpuHyper', 'b03_brockDoc', 'b03_gateronRail', 'b03_gt01', 'b03_razerV4', 'b03_openstax', 'b03_mvp'],
  answers: [
    ['left visualization feels lazy', 'The shipping button is drawn as it is built (one moulded part on a living hinge, its nub on a 2-pin mini switch on its own side board, a ribbon cable to the main board: Brock\'s photos, TechPowerUp\'s Hyperlight teardown) and demonstrated: a thumb presses it at three spots and the force to click runs from 165 gf by the hinge to 40 gf at the tip, where it bends on past the click'],
    ['right visualization doesn\'t match the other dual rail plungers with ptfe', 'Two posts like the main buttons\' (2.4 mm), each between two POM pads (F31.3), labelled "Two posts on POM pads, as the main buttons"'],
    ['it\'s way overbuilt', 'Only what the slide needs: two 5 mm guides with POM pads, two posts, the stabiliser wire in two clips (the tilt needs it: b03_rail), and a 1 mm pocket in the shell round the switch: no arms, no glove skirts'],
    ['important information though, it gets the point across okay', 'Every fact kept but one: "0 mice ship SPDT side buttons" (F11.4) turned out wrong (TechPowerUp: the Gamesense MVP\'s side buttons are Kailh GM 4.0s, full-size, on a side board), so the slide says what is true: full-size side switches are rare, and Theseus\'s are held by the shell with 0 side boards; full-size switches at 29.31 g (F9.17), held by the shell with no side board (F12.4), the stop on the guide (#64)'],
    ['it just feels lazy', 'Now a demonstration: established on the mouse, pushed in, the same three thumb presses on the hinge and on the rail, the classroom door (torque) beside it, and the verdict (FILM F3): click force spread across the button, 125 → 4 gf'],
    ['F31.4: "i\'d have to see" the guide over the full-size switch', 'Shown plainly, held by the shell, as the slide\'s second half; its friction and four ways to build the guide are shown on b03_rail, which now plays just before this slide (F44.1, FILM F36)'],
    ['(F44.1, F48.1) the guide: Brock picked "Tied posts (wire)" from b03_rail', 'Drawn as picked: two posts in 5 mm guides, tied by a stabiliser wire under them (dashed: hidden by the section), its two clips on the shell as pivots; the readouts are that design\'s (55 / 59 / 59 gf with the wire\'s pivots dry, b03_rail\'s model, the wire 0.6 mm on 3 mm arms, assumed) and the verdict its spread, 125 → 4 gf; "friction aside" and the placeholder are gone']
  ],
  sfx: B03_SIDE_T.rival.concat(B03_SIDE_T.ours).map(t0 => [t0 + 0.16, 'click']),
  draw: t => {
    const T = B03_SIDE_T, box = [80, 260, 1200, 700], RX = 1320, RW = 520;
    header(t, 'Dual rail side buttons');
    captions(t, [[0.4, 'A side button on a hinge is a lever: where your thumb lands changes the click.'],
      [T.wipe, 'Theseus\'s slides straight in on two posts and POM pads, tied by a wire so neither end can tilt.'],
      [T.facts, 'No lever and no tilt: within 4 gf of the switch\'s own 55 at every spot, with full-size switches.']]);
    /* where the front side button is on the mouse: its centre, and the shell's outer face there (the kit's top view) */
    const yc = (-23.5 - 8.9) / 2 * MS_K.y, X0 = -msHalfW(-16.2), focus = [X0 - 15, yc - 11.5, 44, 23];
    const est = establish(t, T.push, box, { view: 'top', hi: ['side1'], col: 'ink', focus, locator: 'tr', fade: 0.35, dimFill: 0.55 });
    const sx = box[0] + 32, sy = box[1] + 110;   /* the note under the panel's name: the spread, then its answer */
    const kd = est.kd, ko = 0, ka = kd;
    /* which press is on, and how deep: the rival's three, then Theseus's three, at the same spots */
    const press = list => { for (let i = list.length - 1; i >= 0; i--) if (t >= list[i]) return { i, d: b03_sideP(t, list[i]), t0: list[i] }; return null; };
    const pr = t < T.wipe ? press(T.rival) : t >= T.wipe + 0.9 ? press(T.ours) : null, spot = pr ? B03_SPOTS[pr.i] : null;
    let hinge = {}, rail = {};
    const drawRival = () => est.draw(() => { xsave(); xmove(X0, yc); hinge = b03_hingeMM({ at: spot ? spot.s : 7.25, press: pr ? clamp(pr.d / 0.82) : 0, over: pr ? clamp((pr.d - 0.82) / 0.18) : 0 }); xrest(); });
    const drawOurs = () => est.draw(() => { xsave(); xmove(X0, yc); rail = b03_railMM({ press: pr ? pr.d : 0 }); xrest(); });
    if (ka > 0.001) { G.save(); G.globalAlpha = ka; wipeTo(t, T.wipe, 0.9, box, drawRival, drawOurs, { rival: 'On a hinge', right: 'Theseus' }); G.restore(); }
    /* the panel's name: what is on screen now */
    if (ka > 0.02 && !(t > T.wipe && t < T.wipe + 0.9)) {
      const riv = t < T.wipe, kn = riv ? ep(t, 1.2, 1.6) : ep(t, T.wipe + 0.9, T.wipe + 1.3);
      ltag(box[0] + 32, box[1] + 50, riv ? 'Side button' : 'Theseus', riv ? 'on a hinge' : 'on a rail', { a: ka * kn, size: 22, color: riv ? C.mute : C.heroText, vcolor: riv ? C.secondText : C.heroText });
    }
    /* the thumb, lying along the side and pressing in with its pad at the spot; the force it takes, growing to the click */
    if (pr && kd > 0.5 && ko < 0.02) {
      const riv = t < T.wipe, o = riv ? hinge : rail, yS = -B03_SIDE.L / 2 + spot.s, fp = o.face ? o.face(yS) : null;
      if (fp) {
        const ia = ep(t, pr.t0 - 0.35, pr.t0 - 0.05) * (1 - ep(t, pr.t0 + 0.8, pr.t0 + 1.0));
        clipped(box[0], box[1], box[2], box[3], () => finger(fp[0], fp[1], -Math.PI / 2, { s: est.s, digit: 'thumb', press: pr.d, alpha: ia * 0.96, len: 40 }));
        const gf = riv ? b03_hingeGf(spot.s) : b03_tiedGf(spot.s);
        forceArrow(fp[0] - 4, fp[1], 0, 60 + 1.2 * gf, { label: gf + ' gf', k: clamp(pr.d / 0.82) * ia, color: riv ? (gf > 100 ? C.red : C.ink) : C.hero, side: 'end' });
      }
    }
    /* what each press left: its force at its spot, beside the button; red by the hinge, blue on the rail */
    if (ka > 0.01) {
      B03_SPOTS.forEach((sp, i) => {
        const yS = -B03_SIDE.L / 2 + sp.s, q = est.P(X0, yc + yS), xL = est.P(X0 - 1.6, 0)[0];
        const tR = T.rival[i] + 0.62, tO = T.ours[i] + 0.62, oursShown = t >= tO, rivalShown = t >= tR && t < T.wipe + 0.45;
        if (!rivalShown && !oursShown) return;
        const a = ka * (oursShown ? ep(t, tO, tO + 0.3) : ep(t, tR, tR + 0.3) * (1 - ep(t, T.wipe + 0.1, T.wipe + 0.45)));
        const gf = oursShown ? b03_tiedGf(sp.s) : b03_hingeGf(sp.s);
        circle(q[0] - 3, q[1], 4, { fill: oursShown ? C.hero : i === 0 ? C.red : C.ink2, alpha: a });
        rich([{ s: gf + ' gf', role: 'num', size: 26, weight: 750, color: oursShown ? C.heroText : i === 0 ? C.red : C.ink, tnum: true }], xL - 12, q[1] + 9, { align: 'right', alpha: a });
      });
      const kr = ep(t, T.rival[2] + 0.75, T.rival[2] + 1.05) * (1 - ep(t, T.wipe, T.wipe + 0.35)) * ka;
      if (kr > 0.01) { text(b03_floor(B03.leverSpread, 1) + '× the force by the hinge', sx, sy, { role: 'small', size: 26, weight: 750, color: C.red, alpha: kr }); text('as at the tip, for the same click', sx, sy + 32, { role: 'small', size: 23, weight: 600, color: C.mute, alpha: kr }); }
      const ks = ep(t, T.ours[2] + 0.8, T.ours[2] + 1.1) * ka;
      if (ks > 0.01) { text('Within 4 gf at every spot', sx, sy, { role: 'small', size: 26, weight: 750, color: C.heroText, alpha: ks }); text('two posts, tied: nothing tilts', sx, sy + 32, { role: 'small', size: 23, weight: 600, color: C.mute, alpha: ks }); }
    }
    /* the parts, named in one column to the right of the drawing, as they matter */
    if (kd > 0.5 && ko < 0.02) {
      const lx = est.P(X0 + 18.5, 0)[0], ly = i => box[1] + 216 + i * 112, C2 = { side: 'r', prose: true, maxW: 250 };
      if (t < T.wipe) {
        if (hinge.hinge) callout(t, 1.5, hinge.hinge, 'A living hinge: the button is a lever', Object.assign({ to: [lx, ly(0)], color: C.ink2, tcolor: C.ink }, C2));
        if (hinge.mini) callout(t, 1.9, hinge.mini, '2-pin mini switch: single throw', Object.assign({ to: [lx, ly(2) + 48], color: C.ink2, tcolor: C.ink }, C2));
        if (hinge.cable) callout(t, 2.3, hinge.cable, 'Its own side board and ribbon cable', Object.assign({ to: [lx, ly(1)], color: C.ink2, tcolor: C.ink, sub: 'as in the Hitscan Hyperlight', scolor: C.mute }, C2));
        if (hinge.tip && t > T.rival[2] + 0.12) faultTag(t, T.rival[2] + 0.12, hinge.tip, 'At the tip it bends on past the click', Object.assign({ to: [lx, ly(3) + 42] }, C2));
      } else if (t > T.wipe + 0.9) {
        /* top to bottom as their parts sit, so no leader crosses another; the post's runs straight down past the switch */
        if (rail.pocket) callout(t, T.wipe + 1.6, rail.pocket, 'Held by the shell: no side board', Object.assign({ to: [lx, ly(0)], color: C.ink2, tcolor: C.ink }, C2));
        if (rail.swBody) callout(t, T.wipe + 1.3, rail.swBody, 'Full-size SPDT switch', Object.assign({ to: [lx, ly(1) + 30], color: C.ink2, tcolor: C.ink }, C2));
        if (rail.post) fixTag(t, T.wipe + 1.0, rail.post, 'Two posts on POM pads', Object.assign({ to: [lx, ly(3) + 14], elbow: rail.post[0], sub: 'as the main buttons; the guides are the stop', scolor: C.mute }, C2, { maxW: 300 }));
        /* the wire named in ink, as the other parts are, and centred between the readouts, so it doesn't read as one unit with a
           blue "59 gf" (A1) */
        if (rail.wireTop) callout(t, T.wipe + 1.9, rail.wireTop, 'Stabiliser wire', { to: [478, 552], side: 'l', color: C.ink2, tcolor: C.ink, sub: 'ties the two posts', scolor: C.mute });
      }
    }
    /* the classroom version, beside the rival's presses: a door is the same lever */
    const kc = 1 - ep(t, T.wipe + 0.3, T.wipe + 0.8);
    if (t > 0.9 && kc > 0.003) {
      G.save(); G.globalAlpha = kc;
      /* "Classroom" (not the kit's longer label) so the heading clears its source; the door 30 px lower, so its force arrow (up
         to 104 px, at the hinge) starts under the heading (A1: it ran through it) */
      const r = demoPanel(t, 0.9, [RX, 260, RW, 350], { label: 'Classroom', src: 'OpenStax §10.6' });
      const dpr = t < T.wipe ? press(T.rival) : null, dsp = dpr ? B03_SPOTS[dpr.i] : null;
      const door = part(r[0] + 34, r[1] + 100, 4.6, () => b03_doorMM({ swing: dpr ? dpr.d : 0 }), { alpha: ep(t, 1.1, 1.5) });
      if (dsp && door.M) {
        const pa = SPm(door.M, 80 * dsp.s / B03.btnL, -1.6), N = b03_hingeGf(dsp.s) * 9.80665e-3, ia = 1 - ep(t, dpr.t0 + 0.8, dpr.t0 + 1.0);
        forceArrow(pa[0], pa[1], Math.PI / 2, 30 + 46 * N, { k: clamp(dpr.d / 0.82) * ia, color: N > 1 ? C.red : C.ink, w: 3, hs: 11 });
      }
      text('Push a door near its hinge and it takes far more force than at the handle. A hinged button is the same lever.', r[0], r[1] + 192, { role: 'small', size: 24, weight: 600, color: C.ink2, maxW: r[2], alpha: ep(t, 1.4, 1.8), lh: 1.3 });
      G.restore();
    }
    /* the verdict: how much more force the heaviest spot takes than the lightest */
    const spreadGf = b03_hingeGf(B03.spots[0]) - b03_hingeGf(B03.spots[2]);   /* 165 − 40 = 125 gf, exact (G5) */
    const spreadT = Math.max(...B03.spots.map(b03_tiedGf)) - Math.min(...B03.spots.map(b03_tiedGf));   /* tied posts, dry pivots: 59 − 55 = 4 gf (3.76 rounded up) */
    /* FILM F3's wording is too long for one line of the column: set as two lines, as the kit sets its label */
    verdict(t, T.verdict, RX, 450, { from: String(spreadGf), to: String(spreadT), unit: 'gf', dec: 0, label: null, better: null, who: ['On a hinge', 'Theseus'], net: false, size: 112, dur: 0.8, maxW: RW });
    { const a0 = ep(t, T.verdict, T.verdict + 0.35), yl = 450 - Math.round(112 * 0.78) - 26;
      text('Click force spread across', RX, yl - 30, { role: 'label', size: 22, color: C.mute, alpha: a0 });
      text('the button (lower is better)', RX, yl, { role: 'label', size: 22, color: C.mute, alpha: a0 }); }
    scaleNote(RX, 548, 'about an egg\'s weight', { lead: B03.gt01.f + ' to ' + Math.max(...B03.spots.map(b03_tiedGf)) + ' gf', t, t0: T.verdict + 1.7 });
    statTile(t, T.facts, [RX, 600, RW, 160], { value: '0', unit: 'side boards', label: 'SPDT side switches held by the shell', align: 'left' });
    statTile(t, T.facts + 0.3, [RX, 800, RW, 160], { value: THS.mass, unit: 'g', label: 'with four full-size SPDT switches', hero: true, align: 'left' });
    source(t, 'Lever model: 14.5 mm button, nub 9 mm from the hinge, 55 gf on both (2-pin Omron D2LS-21: 61 ± 20 gf). Tied posts, derived (Four ways to guide a side rail): only the wire\'s pivots rub, taken dry (μ 0.35, DuPont), the wire\'s size assumed (0.6 mm on 3 mm arms). Full-size side switches are rare: the Gamesense MVP\'s sit on a side board.', { t0: T.verdict + 1.9, maxW: RM - LM, y: 994 });
  }
});

/* ============================== b03_rail: four ways to guide a side rail (F44.1) ==============================
   Brock (F44.1): "show all 3, it's hard to visualize these things with text, that is the point of this presentation".
   Pressed at its tip, a button on a rail is a drawer pushed by one corner: it tilts in its guide until the guide touches it
   at two points, one at each end of the guide on opposite faces. The guide's push there is N = F·e / L each (a couple that
   answers the thumb's moment F·e), and each point rubs with μN, so the thumb needs F = S / (1 − 2μe / L): the switch's own
   55 gf, plus friction that grows with the press's offset e and shrinks with the guide's length L (it jams when 2μe ≥ L).
   Two posts tilt together (a rigid button moves both sideways alike), so two loose posts act as one guide of their length.
   Tied so both ends must travel together (a wire, as under a keyboard's space bar), nothing tilts: the tie carries the
   moment as two axial forces f = F·e / 2a, and only its pivots rub, on a lever r / R (assumed wire 0.6 mm, arms 3 mm).
   μ (FILLS, Q3, 10:09): POM on POM, dry, kinetic 0.35 to 0.40 (DuPont Delrin, the same grade on both faces); a plastics
   grease 0.02 to 0.04 in steady sliding (Molykote, measured steel on POM); grease may not lower the break-away (static) μ.
   The tie's joints: greased (0.02) to dry steel on POM (0.35, DuPont Module III). Verified in /home/claude/work/p2/scripts/
   rail_model.py: 14 mm dry 73.95-77.78 gf; 5 mm dry 194.7-305.6; 5 mm greased 57.35-59.91; tie 55.2-58.8. */
Object.assign(SRC, {
  b03_delrinPair: { t: 'DuPont, "Delrin: low wear, low friction" brochure (L-12259 04.01), table of properties: dynamic coefficient of friction against itself (the same grade on both faces, reciprocating at about 0.08 m/s and 0.196 MPa): Delrin 100 0.4, Delrin 500 0.35; PTFE-filled 100AF 0.18, 520MP 0.19', u: 'https://www.emcoplastics.com/assets/pdf/delrin/Delrin%20Low%20Wear%20Low%20Friction%20Brochure%20Dupont.pdf' },
  b03_delrinM3: { t: 'DuPont, Delrin Design Guide, Module III, Table 2 (ASTM D3702 thrust washer, no lubricant, 50 mm/s, 2 MPa, against carbon steel): standard grades static 0.20, dynamic 0.35', u: 'https://www-eng.lbl.gov/~shuman/NEXT/CURRENT_DESIGN/TP/MATERIALS/delrin_props.pdf' },
  b03_molykote: { t: 'Molykote PG-54 Plastislip data sheet (80-3212B-01): a 12.7 mm steel ball on POM, 6.3 N, 10 mm/s, 24 h: μ under 0.04; Molykote PG-75 (71-0171D-01): steel ball on POM, 5 N, 10 cm/s: μ 0.02 (lubricant makers\' figures, steady sliding)', u: 'https://www.dupont.com/content/dam/Dupont2.0/Products/transportation/Literature/Downloaded-TDS/MOLYKOTE%20PG-75%20High%20Performance%20Grease%2071-0171D-01.pdf' },
  b03_lubeStatic: { t: 'Sabet et al. 2019 (Univ. Minho), "Friction properties of POM materials in dry and lubricated conditions": lubrication "does not seem to influence the static coefficient"; Ptak et al. 2023, Aviation 27(4): 272 to 278, POM on POM: with oil the static coefficient was higher than dry', u: 'https://jest.vgtu.lt/index.php/Aviation/article/download/20650/12095' }
});
/* the rail model's numbers: one place, a constant to change (μ), every figure on the slide computed from it */
B03.rail = {
  e: B03.spots[2] - B03.btnL / 2,          /* the tip spot's offset from the post and the switch's plunger: 12.375 − 7.25 = 5.125 mm */
  mu: [0.35, 0.40],                        /* POM on POM, dry, kinetic (DuPont Delrin 500 and 100, against themselves) */
  muG: [0.02, 0.04],                       /* with a plastics grease, steady sliding (Molykote PG-75 and PG-54, steel on POM) */
  a: 5.6,                                  /* two posts: each 5.6 mm off the button's centre */
  tie: { r: 0.3, R: 3.0, n: 4, mu: [0.02, 0.35] },   /* the tie, assumed: a 0.6 mm steel wire turning in two clips, its 3 mm
                                                        arms in the two posts (four joints), greased to dry (steel on POM) */
  clr: 0.06, K: 5                          /* the post's clearance in its pads, mm a side; gaps and tilt drawn 5× */
};
/** the thumb's force at the click, gf, pressed e mm off a guide of length L with friction μ (Infinity: it jams) */
const b03_railF = (L, mu, e = B03.rail.e) => { const q = 2 * mu * e / L; return q >= 1 ? Infinity : B03.gt01.f / (1 - q); };
/** the same with the posts tied: only the tie's joints rub, carrying F·e / 2a at each post on a lever r / R */
const b03_tieF = (mu, e = B03.rail.e) => { const T = B03.rail.tie, q = T.n * mu * (T.r / T.R) * e / (2 * B03.rail.a); return B03.gt01.f / (1 - q); };
/** b03_side (F48.1, the tied posts): the force to click at a spot s mm from the front end, gf, the wire's pivots dry (the
   conservative end: 55 / 59 / 59 gf; greased they give 55 / 56 / 56), rounded up (G5) */
const b03_tiedGf = s => b03_ceil(b03_tieF(B03.rail.tie.mu[1], Math.abs(s - B03.btnL / 2)));
/** Theseus's own costs are never rounded down (G5) */
const b03_ceil = v => Math.ceil(v - 1e-9);
/* the four designs, in the order they are shown (Brock's three, then the one that reaches about ×1.0) */
const B03_RAILS = [
  { key: 'long', name: '14 mm guide', sub: 'One post, dry POM', L: 14, posts: [0], gf: () => B03.rail.mu.map(m => b03_railF(14, m)) },
  { key: 'posts', name: 'Two posts', sub: 'Both ends, 5 mm guides', L: 5, posts: [-B03.rail.a, B03.rail.a], gf: () => B03.rail.mu.map(m => b03_railF(5, m)) },
  { key: 'short', name: '5 mm guide', sub: 'Dry, then greased', L: 5, posts: [0], gf: () => B03.rail.mu.map(m => b03_railF(5, m)), gfG: () => B03.rail.muG.map(m => b03_railF(5, m)) },
  { key: 'tied', name: 'Two posts, tied', sub: 'Theseus: a wire ties them', L: 5, posts: [-B03.rail.a, B03.rail.a], tie: true, gf: () => B03.rail.tie.mu.map(m => b03_tieF(m)) }
];

/** one rail design, cut at button height and seen from above, in b03_side's frame (mm: x inward from the button's face at
   rest, y along the button toward the tail, its centre at y = 0). d: a B03_RAILS entry; o = { press 0..1 (to the click,
   0.5 mm, true size), grease 0..1, fr: [gf of friction at each contact] }. The tilt and the gaps are drawn K× (said on the
   slide). Returns stage points: contacts [{ p, n }], the thumb's spot on the face, the tie's far arm. */
function b03_guideMM(d, o = {}) {
  const S = B03_SIDE, R = B03.rail, K = R.K, th = S.th, half = S.L / 2, post = 2.4, pad = 0.54, gw = 0.85, cd = R.clr * K;
  const gx0 = th + 0.55, gx1 = gx0 + d.L, xc = (gx0 + gx1) / 2, pr = clamp(o.press || 0), u = pr * 0.5;
  const tilt = d.tie ? 0 : ep(pr, 0, 0.35, E.out3) * 2 * cd / d.L, tipX = gx1 + 0.3, swTop = tipX + 0.85, out = { contacts: [] };
  const shellF = B03C.shellLite(), eS = edgeCol(MT.shell), gap = S.gap;
  /* the side wall either side of the button's opening (the gap drawn K× too), ending in break lines */
  for (const s of [-1, 1]) {
    const y0 = s * (half + gap), y1 = s * (half + gap + 1.0);
    solid(() => { G.beginPath(); G.moveTo(0, y0); G.lineTo(0, y1); brk(0, y1, y1, 0); G.lineTo(S.wall, y1); G.lineTo(S.wall, y0); G.closePath(); }, MT.shell, [0, Math.min(y0, y1), S.wall, 1.0], { fill: B03C.shell(), ec: eS, hatch: true });
  }
  /* the switch: the shared full-size switch, turned so its plunger meets the post (or the nub) at y = 0; only its front is
     shown, ending in a break line */
  G.save(); G.beginPath(); G.rect(swTop - 1.2, -7.4, 2.2, 13.2); G.clip(); G.globalAlpha *= 0.62;
  xsave(); xmove(swTop, 5.6); xturn(-Math.PI / 2); xmove(0, 6.5); out.sw = swMM({ press: u / 0.8, accent: C.ink2, glow: false }); xrest();
  G.restore();
  G.save(); G.beginPath(); G.moveTo(swTop + 1.0, -7.2); brk(swTop + 1.0, -7.2, 5.6, 0.35); G.strokeStyle = inkA(0.55); G.lineWidth = lw(1.2); G.stroke(); G.restore();
  out.swAt = SP(swTop + 0.5, -7.4);
  /* the tie, under the section (hidden, dashed): a wire along the button, turning in two clips on the shell, its arms up
     into the posts, so both ends must travel together */
  if (d.tie) {
    const wc = TH ? '#5E636B' : '#B9BEC6';
    G.save(); G.setLineDash([lw(9), lw(5)]); G.lineCap = 'round';
    G.beginPath(); G.moveTo(xc + u, -R.a); G.lineTo(xc, -R.a + 1.2); G.lineTo(xc, R.a - 1.2); G.lineTo(xc + u, R.a); G.strokeStyle = wc; G.lineWidth = lw(4.2); G.stroke();
    for (const cy of [-2.0, 2.0]) { G.beginPath(); G.rect(xc - 1.0, cy - 0.75, 2.0, 1.5); G.strokeStyle = inkA(0.6); G.lineWidth = lw(1.5); G.stroke(); }
    G.restore();
    out.tie = SP(xc, 0); out.armFar = SP(xc + u, -R.a);
  }
  /* the guides: two shell walls a post, a POM pad on each inner face; the grease, when it comes, a glossy film on the pads */
  for (const yp of d.posts) for (const s of [-1, 1]) {
    const yIn = yp + s * (post / 2 + cd), yPad = s > 0 ? yIn : yIn - pad, yW = s > 0 ? yIn + pad : yIn - pad - gw;
    solid(() => pathRR(gx0, yW, d.L, gw, 0.1), MT.shell, [gx0, yW, d.L, gw], { fill: shellF, ec: eS, hatch: true });
    solid(() => pathRR(gx0 + 0.08, yPad, d.L - 0.16, pad, 0.08), MT.pom, [gx0, yPad, d.L, pad], { fill: B03C.pom(), ec: edgeCol(MT.pom) });
    if (o.grease > 0.003) { G.save(); G.globalAlpha *= clamp(o.grease); const gt = 0.2, gy = s > 0 ? yIn - 0.02 : yIn - gt + 0.02;
      pathRR(gx0 + 0.1, gy, d.L - 0.2, gt, 0.09); G.fillStyle = TH ? 'rgba(112,120,132,0.62)' : 'rgba(205,210,218,0.5)'; G.fill();
      G.fillStyle = 'rgba(255,255,255,0.85)'; for (let k = 0; k < d.L / 1.3; k++) G.fillRect(gx0 + 0.45 + k * 1.3, gy + 0.05, 0.42, 0.05); G.restore(); }
  }
  /* the button, its post(s) (and, for two posts, the nub on the switch), pressed in by u and turned by the tilt about the
     guide's middle; its rest outline a dashed ghost */
  const body = () => {
    G.beginPath(); G.moveTo(0.4, -half); G.lineTo(th, -half);
    const stems = d.posts.length > 1 ? [[d.posts[0], post], [0, 1.6], [d.posts[1], post]] : [[0, post]];
    for (const [yp, w] of stems) { const lo = yp - w / 2, hi = yp + w / 2, tx = yp === 0 ? tipX : tipX - 0.15;
      G.lineTo(th, lo); G.lineTo(tx - 0.3, lo); G.quadraticCurveTo(tx, lo, tx, lo + 0.3); G.lineTo(tx, hi - 0.3); G.quadraticCurveTo(tx, hi, tx - 0.3, hi); G.lineTo(th, hi); }
    G.lineTo(th, half); G.lineTo(0.4, half); G.quadraticCurveTo(0, half, 0, half - 0.4); G.lineTo(0, -half + 0.4); G.quadraticCurveTo(0, -half, 0.4, -half); G.closePath();
  };
  if (pr > 0.02) b03_ghost(body);
  xsave(); xabout(xc, 0, -tilt); xmove(u, 0);
  solid(body, MT.shell, [0, -half, tipX, S.L], { fill: B03C.shell(), ec: edgeCol(MT.shell), hatch: true });
  out.face = SP(0, R.e); out.faceFar = SP(0, -half + 1.2); out.M = XF.m.slice();
  xrest();
  /* where the tilted post touches its pads: at each guide's outer end on the tail-side face, at its inner end on the
     nose-side face (fixed points of the guide); fr[i] the friction there, gf */
  if (!d.tie) for (const yp of d.posts) {
    out.contacts.push({ p: SP(gx0 + 0.18, yp + post / 2 + cd), n: SP(gx0 + 0.18, yp + post / 2 + cd - 1), side: 1 });
    out.contacts.push({ p: SP(gx1 - 0.18, yp - post / 2 - cd), n: SP(gx1 - 0.18, yp - post / 2 - cd + 1), side: -1 });
  }
  out.guide = SP(gx0 + d.L * 0.5, d.posts[d.posts.length - 1] + post / 2 + cd + pad + gw);
  out.right = SP(swTop + 1.2, 0);
  return out;
}

/** the classroom version: a drawer seen from above in its cabinet, pushed by one front corner. o = { push 0..1 }: it slides a
   little, twists until two corners meet the cabinet's sides, and stops. mm, y down, the cabinet's mouth at y = 0 */
function b03_drawerMM(o = {}) {
  const W = 64, D = 30, c = 1.3, k = clamp(o.push || 0), slide = 4 * ep(k, 0, 0.5, E.out3), rack = ep(k, 0.1, 0.6, E.io3) * (2 * c / D) * 0.98, out = {};
  const wallF = B03C.shellLite(), eS = edgeCol(MT.shell);
  for (const s of [-1, 1]) solid(() => { G.beginPath(); G.rect(s > 0 ? W / 2 + c : -W / 2 - c - 4, -D - 10, 4, D + 10); }, MT.shell, [s > 0 ? W / 2 + c : -W / 2 - c - 4, -D - 10, 4, D + 10], { fill: wallF, ec: eS, hatch: true });
  const cy = -D / 2 + 9 - slide;
  xsave(); xmove(0, cy); xturn(rack);
  solid(() => pathRR(-W / 2, -D / 2, W, D, 1.2), MT.white, [-W / 2, -D / 2, W, D], { fill: TH ? '#E5E5EA' : '#48484A', ec: edgeCol(MT.white) });
  solid(() => pathRR(-W / 2 - 1.2, D / 2 - 2.2, W + 2.4, 2.6, 0.8), MT.white, [-W / 2, D / 2 - 2.2, W, 2.6], { fill: TH ? '#D1D1D6' : '#5A5A5E', ec: edgeCol(MT.white) });
  solid(() => pathRR(-7, D / 2 + 0.6, 14, 1.6, 0.8), MT.steel, [-7, D / 2 + 0.6, 14, 1.6], { fill: TH ? '#9AA0A8' : '#7E848C', ec: edgeCol(MT.steel) });
  out.push = SP(-W / 2 + 3, D / 2 + 0.4); out.jamA = SP(W / 2, -D / 2); out.jamB = SP(-W / 2, D / 2 - 2.2);
  xrest();
  out.k = ep(k, 0.55, 0.7);
  return out;
}

/* the timeline (s): the drawer, the one press on all four (held), the tags, the grease on the short guide, the payoff */
const B03_RL_T = { drawer: 0.5, press: 1.6, count: [1.7, 1.0], tags: [2.85, 3.15, 3.45, 3.75], grease: 5.1, pay: 7.0 };
/** a range of gf, rounded up, one precision (G5); one figure when both ends meet */
const b03_gfRange = (v, k = 1, from = B03.gt01.f) => { const a = b03_ceil(lerp(from, v[0], k)), b = b03_ceil(lerp(from, v[1], k)); return a === b ? String(a) : a + ' to ' + b; };
S({
  /* plays before b03_side (FILM F36): the rail's own problem and the tied fix first, then b03_side's "same click at every spot"
     closes the chapter on its thesis */
  id: 'b03_rail', ch: 'click', before: 'b03_side', theme: 'paper', title: 'Four ways to guide a side rail', settle: 11.5, ideas: [80],
  src: ['b03_delrinPair', 'b03_delrinM3', 'b03_molykote', 'b03_lubeStatic', 'b03_gt01'],
  answers: [
    ['F44.1: "show all 3, it\'s hard to visualize these things with text, that is the point of this presentation"', 'All three are on screen under the same press at the tip: a 14 mm guide, two posts (one at each end of the button), and a 5 mm guide (dry, then greased). Each tilts in its guide (drawn 5× larger than life, said on the slide), its contact points light red with the friction drawn there, and the force the click needs at the tip counts up, with a bar splitting it into the switch\'s 55 gf and the friction'],
    ['F44.1, the numbers (×1.2 at 14 mm, ×1.85 at 5 mm, "or two posts")', 'Recomputed at b03_side\'s tip spot (5.1 mm off the post) with POM\'s measured friction (FILLS, Q3: POM on POM dry 0.35 to 0.40, DuPont; greased 0.02 to 0.04, Molykote): 14 mm 74 to 78 gf; 5 mm dry 195 to 306 gf, greased 58 to 60 gf. The old ×1.2 and ×1.85 used μ 0.2, DuPont\'s static figure against steel. Two posts on their own tilt together and act as one 5 mm guide (195 to 306 gf), so a fourth design is shown: the two posts tied by a wire, 56 to 59 gf (only its pivots rub)'],
    ['R-b03-2 (critic): the rail\'s friction is left out of b03_side\'s 0 gf', 'Shown here in full, with measured friction; Brock picked the tied posts from this slide (F48.1), so b03_side now draws them and its verdict is their spread, 125 → 4 gf (the wire\'s pivots dry), "friction aside" gone']
  ],
  sfx: [[B03_RL_T.press + 0.2, 'click']],
  draw: t => {
    const T = B03_RL_T, s = 17;
    header(t, 'Four ways to guide a side rail');
    captions(t, [[0.3, 'Push a drawer by one corner and it twists and jams. A side button on a rail does the same when your thumb lands at its tip.'],
      [T.press - 0.1, 'It tilts until its guide touches it at two points, and dry POM rubs there: the click at the tip takes more force.'],
      [T.grease - 0.3, 'A long guide rubs less. Two loose posts tilt together, like one short guide. Grease, or tying the posts together, fixes it.'],
      [T.pay + 0.3, 'Tied, nothing tilts: the click at the tip stays within a few gf of the switch\'s own 55 gf.']]);
    /* the same press on all four, at the tip, held */
    const pr = pressCurve(t, T.press, { down: 0.4, hold: 99, bounce: 0.02 }), kc = ep(t, T.count[0], T.count[0] + T.count[1], E.out3);
    const kg = ep(t, T.grease, T.grease + 0.9, E.cam), widths = [400, 290, 290, 290], gapX = 25;
    let cx = 80;
    B03_RAILS.forEach((d, i) => {
      const x = cx, w = widths[i]; cx += w + gapX;
      if (i) line(x - gapX / 2, 268, x - gapX / 2, 840, { color: C.hair, w: 1.5, alpha: ep(t, 0, 0.4) });
      const ox = x + 82, oy = 478, short = d.key === 'short', g = short ? kg : 0;
      /* this design's force at the tip now: from the switch's 55 gf, counting as the press lands; the short guide's falls to its greased figure */
      const dry = d.gf(), wet = d.gfG ? d.gfG() : dry, F = [lerp(55, lerp(dry[0], wet[0], g), kc), lerp(55, lerp(dry[1], wet[1], g), kc)], tilted = d.tie ? 0 : 1;
      /* the friction at each contact (the drawn arrows use the upper μ): N = F e / (n L) on each, μN */
      const mu = lerp(B03.rail.mu[1], B03.rail.muG[1], g), frc = mu * F[1] * B03.rail.e / d.L / d.posts.length;
      text(d.name, x + 22, 272, { role: 'label', size: 22, color: d.tie ? C.heroText : C.ink });
      text(d.sub, x + 22, 300, { role: 'small', size: 20, weight: 600, color: C.mute, maxW: w - 30 });
      let o = {};
      const drawAt = gg => { o = part(ox, oy, s, () => b03_guideMM(d, { press: pr, grease: gg })); };
      clipped(x, 316, w, 330, () => { if (short) wipeTo(t, T.grease, 0.9, [x + 4, 322, w - 8, 318], () => drawAt(0), () => drawAt(1), { rival: 'Dry', right: 'Greased', rivalCol: 'grey', ly: 346 }); else drawAt(0); });
      /* the parts, named once, in the long guide's spare room */
      if (i === 0) { const ka0 = ep(t, 0.2, 0.6), P = (mx, my) => [ox + mx * s, oy + my * s];
        text('Guide: two POM pads', P(9.2, 0)[0], P(0, -3.4)[1] - 10, { role: 'small', size: 19, weight: 650, color: C.mute, align: 'center', alpha: ka0 });
        text('The button\'s post', P(9.2, 0)[0], P(0, 3.4)[1] + 30, { role: 'small', size: 19, weight: 650, color: C.mute, align: 'center', alpha: ka0 });
        if (o.swAt) text('Switch', o.swAt[0], o.swAt[1] - 8, { role: 'small', size: 19, weight: 650, color: C.mute, align: 'center', alpha: ka0 }); }
      /* the thumb at the tip */
      if (o.face) forceArrow(o.face[0] - 4, o.face[1], 0, 62, { k: ep(t, T.press - 0.3, T.press), color: C.ink2, w: 3, hs: 12 });
      /* the contact points and the friction there (red); the guide's push on the post (grey) */
      const kf = ep(pr, 0.3, 0.8) * tilted;
      if (kf > 0.01) for (const c of o.contacts) {
        circle(c.p[0], c.p[1], 6 * kf, { fill: C.red, alpha: kf }); circle(c.p[0], c.p[1], 12 * kf, { color: C.red, w: 1.5, alpha: 0.45 * kf });
        const L = 8 + 5.2 * Math.sqrt(frc);
        arrow(c.p[0] + 2, c.p[1], c.p[0] + 2 - L * kf, c.p[1], { color: C.red, w: 3, hs: 10, alpha: kf });
        arrow(c.n[0], c.n[1] + c.side * 18, c.n[0], c.n[1] + c.side * 3, { color: C.mute, w: 2, hs: 8, alpha: kf * 0.8, p: kf });
      }
      /* the force at the tip, counted; a bar: the switch's 55 gf, then the friction (to the low end solid, to the high end light) */
      const tx = x + 20, ka = ep(t, T.press - 0.2, T.press + 0.2), pay = d.tie ? ep(t, T.pay, T.pay + 0.6) : 0;
      /* blue is Theseus's alone: the tied pair Brock chose (F48.1); the greased 5 mm guide is an option, in neutral ink (R2-b03-6) */
      const col = d.tie ? C.heroText : short ? (g > 0.5 ? C.ink : C.red) : d.key === 'posts' ? C.red : C.ink;
      if (short) text('Dry: ' + b03_gfRange(dry, 1, 0) + ' gf', tx, 668, { role: 'small', size: 20, weight: 650, color: C.red, alpha: ep(t, T.grease + 0.5, T.grease + 0.9) });
      rich([{ s: b03_gfRange(F, 1, 0), role: 'num', size: 44, weight: 800, color: col, tnum: true, grad: pay > 0.5 ? C.heroGrad : null }], tx, 712, { alpha: ka });
      text('gf to click at the tip', tx, 742, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: ka, sentence: false });
      { const bx = tx, by = 758, pxg = 0.8, b55 = 55 * pxg, f0 = Math.max(0, F[0] - 55) * pxg, f1 = Math.max(0, F[1] - 55) * pxg;
        G.save(); G.globalAlpha = ka; G.fillStyle = C.comp; G.fillRect(bx, by, b55, 12);
        G.fillStyle = C.red; G.fillRect(bx + b55, by, f0, 12); G.globalAlpha = ka * 0.38; G.fillRect(bx + b55 + f0, by, f1 - f0, 12); G.restore(); }
      /* what happened, in a few words */
      const tags = { long: ['Barely tilts; dry POM still rubs', C.ink2], posts: ['Both tilt together, as one guide', C.red], short: g > 0.5 ? ['Greased: it slides once moving', C.ink2] : ['Short and dry: it grips hard', C.red], tied: ['Nothing tilts: the wire carries it', C.heroText] };
      const [tg, tc] = tags[d.key];
      text(tg, tx, 808, { role: 'small', size: 21, weight: 650, color: tc, maxW: w - 30, alpha: ep(t, T.tags[i], T.tags[i] + 0.35), lh: 1.25 });
    });
    /* the classroom version: the drawer pushed by one corner */
    { const r = demoPanel(t, -1, [1465, 262, 375, 380], { label: 'The classroom version' }), kp = ep(t, T.drawer, T.drawer + 0.9, E.io3);
      const dr = part(r[0] + r[2] / 2, r[1] + 160, 3.6, () => b03_drawerMM({ push: kp }));
      if (dr.push) forceArrow(dr.push[0], dr.push[1], -Math.PI / 2, 46, { k: ep(t, T.drawer - 0.2, T.drawer + 0.3), color: C.ink2, w: 3, hs: 11 });
      if (dr.k > 0.01) for (const p of [dr.jamA, dr.jamB]) { circle(p[0], p[1], 6 * dr.k, { fill: C.red, alpha: dr.k }); circle(p[0], p[1], 12 * dr.k, { color: C.red, w: 1.5, alpha: 0.45 * dr.k }); }
      text('Pushed by one corner, a drawer twists and jams.', r[0], r[1] + 236, { role: 'small', size: 21, weight: 600, color: C.ink2, maxW: r[2], lh: 1.28 }); }
    /* what the marks mean */
    { const lx = 1475, ka = ep(t, T.press + 0.5, T.press + 0.9), rows = [['dot', 'Where the post touches its guide'], ['fric', 'The friction there'], ['push', 'The guide\'s push on the post'], ['bar', 'The switch\'s 55 gf, then friction']];
      rows.forEach(([k, s0], j) => { const yy = 690 + j * 30;
        if (k === 'dot') circle(lx + 12, yy - 7, 6, { fill: C.red, alpha: ka });
        else if (k === 'bar') { G.save(); G.globalAlpha = ka; G.fillStyle = C.comp; G.fillRect(lx, yy - 13, 18, 11); G.fillStyle = C.red; G.fillRect(lx + 18, yy - 13, 10, 11); G.restore(); }
        else arrow(lx + 26, yy - 7, lx, yy - 7, { color: k === 'fric' ? C.red : C.mute, w: k === 'fric' ? 3 : 2, hs: 9, alpha: ka });
        text(s0, lx + 40, yy, { role: 'small', size: 20, weight: 600, color: C.ink2, alpha: ka }); }); }
    text('Tilt and play: 5× larger than life', 1475, 834, { role: 'small', size: 20, weight: 650, color: C.mute, alpha: ep(t, T.press + 0.6, T.press + 1.0) });
    text('Travel: 0.5 mm to the click, true size', 1475, 862, { role: 'small', size: 20, weight: 650, color: C.mute, alpha: ep(t, T.press + 0.8, T.press + 1.2) });
    /* where this is: the side button on the mouse, from above */
    { const lw0 = 40, lx = 1489, ly = 896, yc = (-23.5 - 8.9) / 2 * MS_K.y, X0 = -msHalfW(-16.2);
      locator(t, 0, lx, ly, lw0, 'top', [X0 - 3, yc - 9, 9, 18], { hi: ['side1'] });
      text('The front side button, cut at its height', lx + lw0 + 34, ly + 22, { role: 'small', size: 20, weight: 600, color: C.mute, maxW: 1840 - lx - lw0 - 34, alpha: ep(t, 0, 0.4), lh: 1.28 }); }
    source(t, 'Derived: F = 55 gf ÷ (1 − 2μe ÷ L); e 5.1 mm, the tip spot off the post; L, the guide. POM on POM dry 0.35 to 0.40 (DuPont Delrin); a plastics grease 0.02 to 0.04 sliding (Molykote; may not lower the break-away). The tie, assumed: 0.6 mm wire, 3 mm arms.', { t0: 1.2, maxW: 1350, y: 977 });
  }
});
