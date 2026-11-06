/* ============================================================================================
   B03 · CLICKS II: THE SWITCH AND THE SIGNAL (revamp v2, 2026-11-06). Seven slides, in film order:
     b03_switch    A mechanical switch, for the battery        (replaces clk_switch)
     b03_binning   Provable switch binning                     (replaces clk_switch2)
     b03_spdt      Single pole, double throw                   (replaces clk_spdt)
     b03_timing    Negative latency                            (replaces latency, clk_wait, clk_methods)
     b03_debounce  Debounce: low, and yours to set             (replaces clk_debounce)
     b03_hotswap   Hot-swap switches, no solder                (replaces clk_hotswap)
     b03_side      Dual rail side buttons                      (replaces sidebuttons)
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
  b03_brockDoc: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse": #14 claw-spring hot-swap (Mill-Max 3305); #64 side buttons held by their switches (as on the Hitscan Hyperlight); #78 mechanical mains, "much more power efficient than optical microswitches"; #79 negative latency via SPDT; #80 dual rail side buttons, "sliding rails instead of a bending mechanism"; brainstorm: "omron opticals being 10gf weaker at 60gf is quite noticeable", mechanical SPDT lets the debounce timer go to zero, "likely making minecraft kids very happy"', u: '' }
});

/* ============================== shared numbers (every figure on these slides is computed here) ============================== */
const B03 = {
  /* the battery (b03_switch): an optical switch's LED at Omron's datasheet drive, against a Viper V4 Pro's whole draw */
  ledMA: 5, onUs: 30, perUs: 1000,              /* D2FP-FN2: IF 5 mA, 30 µs ON, 970 µs OFF */
  v4mAh: 306, v4h: 180,                         /* Vortex Gaming (clk_vortexV4), Razer (clk_razerV4bat), at 1 khz */
  mechUA: 3,                                     /* a mechanical contact draws nothing itself; its read is a pull-up's trickle:
                                                    about 3 µA a switch read through a strobed pull-up (taken high, so the
                                                    "under 1 %" stays true whatever the firmware does) */
  /* the switch's force spec (b03_binning, b03_side) */
  gt01: { f: 55, tol: 5, travel: 0.35 },        /* Gateron claim */
  d2fp: { f: 60.2, tol: 15.3 },                 /* Omron datasheet: 0.59 ± 0.15 N */
  jnd: 0.07,                                    /* Pang, Tan, Durlach 1991 */
  bin: 2,                                       /* Theseus's bin, ± gf (proposal): two switches within 4 gf, under 7 % of 55 */
  /* timing (b03_timing, b03_spdt): ms from the moment the pole leaves NC */
  flightMs: 1.5,                                /* XBAB: NC edge precedes NO by ~1.5 ms; Tom's: at least 0.84 ms */
  tgtUs: 70, xa25Us: 72.04,                     /* F18.5 target; XBAB XA25 NC release, still, n 500 */
  debounceSet: 4, debounceCost: 3.0,            /* TechPowerUp, Lamzu Atlantis: a 4 ms setting cost 3.0 ms (5.4 − 2.4) */
  motionUs: 121,                                /* XBAB: the OP1 8k v2 adds 121 to 125 µs moving */
  /* the side buttons' lever (b03_side), an illustration: a 14.5 mm button (the 3D shell's side buttons are 14.6 and 14.9 mm)
     hinged at one end, its nub 9 mm out, pressing the same 55 gf switch the rail uses, so only the mechanism differs */
  btnL: 14.5, nubA: 9.0, spots: [3.0, 7.25, 13.0],
  /* the claw socket (b03_hotswap) */
  cycles: 1000
};
B03.optMA = B03.ledMA * B03.onUs / B03.perUs;                      /* 0.15 mA a switch */
B03.v4MA = B03.v4mAh / B03.v4h;                                     /* 1.70 mA */
B03.optShare = 2 * B03.optMA / B03.v4MA;                            /* 17.6 % */
B03.mechShare = 2 * B03.mechUA / 1000 / B03.v4MA;                   /* 0.35 % */
B03.lifeH = B03.v4mAh / (B03.v4MA - 2 * B03.optMA + 2 * B03.mechUA / 1000);   /* 216.6 h on the same battery */
B03.lifeGain = B03.lifeH / B03.v4h - 1;                             /* +20.3 %: printed as +20 % (never rounded up) */
/** the side button on a hinge: the thumb's force to click at s mm from the hinge, gf (a lever: F × s = F_switch × a) */
const b03_leverF = s => B03.gt01.f * B03.nubA / s;
B03.leverSpread = b03_leverF(B03.spots[0]) / b03_leverF(B03.spots[2]);   /* 4.33× */
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
  pom: () => TH ? '#FBFAF6' : '#E9E7E1', pcb: () => '#1C3A29', fr4: () => TH ? '#55613C' : '#424D2D', copper: '#C98A4E',
  gold: '#D9AA4C', goldDark: '#A9822F', tin: () => TH ? '#C9CDD2' : '#AEB3BA', wire: ['#C98A4E', '#9DA3AA', '#C9CDD2'],
  rail: () => TH ? '#8E8D88' : '#5C5D64'   /* the shipping side-button moulding: a quiet grey (a rival is never coloured) */
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

/** Theseus's side button, in the same cut and scale: the full-size SPDT switch (the GT01's own switch without its wedge:
   swMM, the deck's D2F-class drawing) held in a pocket of the shell, its plunger facing the button; over its top a guide
   held by the shell, two walls with a POM pad on each; the button's post (the main buttons' 2.4 mm post) rides between the
   pads and rests on the plunger (no preload); 0.55 mm in, the button lands flat on the guide just past the 0.5 mm click:
   the stop. Three wires from the legs, no side board. o = { press 0..1 of the way to the stop }. */
function b03_railMM(o = {}) {
  const S = B03_SIDE, pr = clamp(o.press || 0), stop = 0.55, u = pr * stop, out = {};
  const swTop = 3.75, post = 2.4, pad = 0.54, cl = 0.06, gw = 0.85, gx0 = S.th + stop, gx1 = swTop - 0.05, tipX = swTop - 0.85;
  const fx = swTop + 6.5 + 0.2, yA = 5.6 + 0.3, yB = 5.6 - 12.8 - 0.3, h = S.L / 2 + S.gap, c0 = swTop + 0.75;
  b03_sideWall();
  /* the shell's pocket round the switch, one moulding with the wall: a 1 mm arm on each side of the switch and a floor its
     legs pass through, joined to the wall beside the opening by short ribs (lean: Brock, "way overbuilt") */
  const t1 = 0.9, P = [[S.wall - 0.02, -h - t1], [fx + t1, -h - t1], [fx + t1, yA + t1], [c0 + t1, yA + t1], [c0 + t1, h + t1], [S.wall - 0.02, h + t1],
    [S.wall - 0.02, h], [c0, h], [c0, yA], [fx, yA], [fx, yB], [S.wall - 0.02, yB]];
  b03_cut([P], [S.wall, -h - t1, fx + t1 - S.wall, 2 * h + 2 * t1]);
  /* the switch: swMM turned so its top faces the button and its length runs along it; its plunger on y = 0 */
  xsave(); xmove(swTop, 5.6); xturn(-Math.PI / 2); xmove(0, 6.5);
  const sw = swMM({ clear: true, press: Math.min(u / 0.8, 1), accent: C.hero, glow: false });
  xrest();
  out.contact = sw.contact; out.isNO = sw.isNO; out.swBody = sw.body;
  /* the three wires from the legs, gathered into the braided side-button lead (F25.3) toward the main board */
  [1.4, 6.4, 11.4].forEach((lx, k) => { const yy = 5.6 - lx, xe = swTop + 10.0; G.save(); G.beginPath(); G.moveTo(xe - 0.6, yy); G.bezierCurveTo(xe + 1.2, yy, xe + 1.0, -0.6 + k * 0.45, xe + 2.6, -0.6 + k * 0.45); G.lineTo(xe + 3.6, -0.6 + k * 0.45); G.strokeStyle = B03C.wire[k]; G.lineWidth = lw(4.2); G.lineCap = 'round'; G.stroke(); G.restore(); });
  out.pocket = SP(fx + t1, yB + 1.0); out.wires = SP(swTop + 12.6, -0.15);
  /* the guide over the switch's top: two walls, a POM pad on each; its outer face is the stop */
  const wallY = post / 2 + cl + pad;
  for (const s of [-1, 1]) {
    solid(() => pathRR(gx0, s > 0 ? wallY : -wallY - gw, gx1 - gx0, gw, 0.1), MT.shell, [gx0, -wallY - gw, gx1 - gx0, gw], { fill: B03C.shellLite(), ec: edgeCol(MT.shell), hatch: true });
    solid(() => pathRR(gx0 + 0.12, s > 0 ? post / 2 + cl : -wallY, gx1 - gx0 - 0.24, pad, 0.08), MT.pom, [gx0, -wallY, gx1 - gx0, pad], { fill: B03C.pom(), ec: edgeCol(MT.pom) });
  }
  solid(() => pathRR(gx1 - 0.32, -wallY - gw - 0.55, 0.37, 2 * (wallY + gw + 0.55), 0.08), MT.shell, [gx1 - 0.32, -3, 0.37, 6], { fill: B03C.shellLite(), ec: edgeCol(MT.shell), hatch: true });
  out.pad = SP(gx0 + (gx1 - gx0) * 0.55, -post / 2 - cl - pad * 0.5); out.guide = SP(gx0 + (gx1 - gx0) * 0.5, wallY + gw); out.stop = SP(gx0, -wallY - gw * 0.5);
  /* the button and its post, moved in by u; the rest outline as a ghost */
  const btnP = () => { G.beginPath(); G.moveTo(0.4, -S.L / 2); G.lineTo(S.th, -S.L / 2); G.lineTo(S.th, -post / 2); G.lineTo(tipX - 0.35, -post / 2); G.quadraticCurveTo(tipX, -post / 2, tipX, -post / 2 + 0.35); G.lineTo(tipX, post / 2 - 0.35); G.quadraticCurveTo(tipX, post / 2, tipX - 0.35, post / 2); G.lineTo(S.th, post / 2); G.lineTo(S.th, S.L / 2); G.lineTo(0.4, S.L / 2); G.quadraticCurveTo(0, S.L / 2, 0, S.L / 2 - 0.4); G.lineTo(0, -S.L / 2 + 0.4); G.quadraticCurveTo(0, -S.L / 2, 0.4, -S.L / 2); G.closePath(); };
  if (pr > 0.02) b03_ghost(btnP);
  xsave(); xmove(u, 0);
  solid(btnP, MT.shell, [0, -S.L / 2, tipX, S.L], { fill: B03C.shell(), ec: edgeCol(MT.shell), hatch: true });
  const Mr = XF.m.slice();
  out.post = SP((S.th + tipX) / 2, post / 2); out.face = y => SPm(Mr, 0, y); out.btnIn = SP(S.th, -S.L / 2 + 1.5);
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
  if (o.board !== false) pcbSec(-2.2, 15.0, 0.2, 1.2, { holes: pins });
  for (const x of pins) solid(() => { G.beginPath(); G.moveTo(x - 0.32, -0.3); G.lineTo(x + 0.32, -0.3); G.lineTo(x + 0.32, 3.2); G.lineTo(x + 0.12, 3.5); G.lineTo(x - 0.12, 3.5); G.lineTo(x - 0.32, 3.2); G.closePath(); }, MT.tin, [x - 0.32, 0, 0.64, 3.5], { horiz: true, lw: 0.8 });
  /* the body, cut open: the cover's walls hatched at the cut, the cavity dark */
  const body = () => { G.beginPath(); G.moveTo(0, 0); G.lineTo(0, -6.0); G.quadraticCurveTo(0, -6.5, 0.5, -6.5); G.lineTo(12.3, -6.5); G.quadraticCurveTo(12.8, -6.5, 12.8, -6.0); G.lineTo(12.8, 0); G.closePath(); };
  solid(body, MT.black, [0, -6.5, 12.8, 6.5], { fill: blk, ec: eB });
  G.save(); G.beginPath(); G.rect(0.55, -6.0, 11.7, 5.5); G.fillStyle = TH ? '#16171A' : '#0E0F11'; G.fill(); G.restore();
  out.cover = SP(12.2, -5.6);
  /* the LED (left) and the receiver (right), each on its pedestal, facing across the plunger's path at beam height */
  const by = -3.05;
  solid(() => pathRR(1.1, by - 0.9, 1.3, 2.3 + 1.2, 0.15), MT.black, [1.1, by - 0.9, 1.3, 3.5], { fill: TH ? '#3A3B41' : '#34353B', ec: eB });
  solid(() => { G.beginPath(); G.moveTo(2.4, by - 0.62); G.lineTo(2.75, by - 0.62); G.quadraticCurveTo(3.25, by, 2.75, by + 0.62); G.lineTo(2.4, by + 0.62); G.closePath(); }, MT.lens, [2.4, by - 0.62, 0.85, 1.24], { fill: TH ? '#E8D9D9' : '#7A5F5F', ec: eB });
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
    const gr = G.createLinearGradient(x0, by, x1, by); gr.addColorStop(0, 'rgba(255,120,120,0.85)'); gr.addColorStop(1, 'rgba(255,120,120,0.35)');
    G.fillStyle = gr; G.beginPath(); G.moveTo(x0, by - 0.28); G.lineTo(x1, by - 0.42); G.lineTo(x1, by + 0.42); G.lineTo(x0, by + 0.28); G.closePath(); G.fill();
    G.beginPath(); G.arc(2.95, by, 0.55, 0, TAU); G.fillStyle = 'rgba(255,150,150,0.9)'; G.fill();
    if (!blocked) { G.beginPath(); G.arc(8.95, by, 0.32, 0, TAU); G.fillStyle = 'rgba(255,170,170,0.8)'; G.fill(); }
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
  const wood = TH ? '#DCD6C8' : '#47443E', woodE = edgeCol(MT.white), cu = '#C98A4E', cuD = '#A9703C', cuE = 'rgba(80,40,10,0.7)', hi = o.hi;
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
   in to a throat 0.54 mm across and spread to grip a leg. Cut through the axis, two fingers show. The board is 1.0 mm
   (F21.11). The leg is the GT01's: 0.6 mm wide, its tip tapered to 0.2 over 0.32 mm. o = { insert 0..1 (0: the tip 2 mm
   above the flange; 1: seated), solder (true) }. mm, y down, origin on the board's top at the hole's centre. */
function b03_clawMM(o = {}) {
  const k = clamp(o.insert == null ? 1 : o.insert), out = {}, IN = 25.4;
  const rF = 0.077 * IN / 2, rB = 0.058 * IN / 2, hF = 0.010 * IN, Lt = 0.105 * IN, yBot = Lt - hF, rBore = 0.56, tP = 1.0, hR = 0.062 * IN / 2;
  /* the board, cut: FR4 with its copper barrel and pads, the socket soldered in */
  const bw = 3.6;
  solid(() => { G.beginPath(); G.moveTo(-bw, 0); G.lineTo(-hR, 0); G.lineTo(-hR, tP); G.lineTo(-bw, tP); brk(-bw, tP, 0, 0.12); G.closePath(); }, MT.fr4, [-bw, 0, bw - hR, tP], { fill: B03C.fr4(), ec: edgeCol(MT.fr4), hatch: { sp: 3 } });
  solid(() => { G.beginPath(); G.moveTo(bw, 0); G.lineTo(hR, 0); G.lineTo(hR, tP); G.lineTo(bw, tP); brk(bw, tP, 0, 0.12); G.closePath(); }, MT.fr4, [hR, 0, bw - hR, tP], { fill: B03C.fr4(), ec: edgeCol(MT.fr4), hatch: { sp: 3 } });
  for (const s of [-1, 1]) { G.fillStyle = B03C.copper; G.fillRect(s > 0 ? hR - 0.03 : -hR, -0.035, 0.03, tP + 0.07); G.fillRect(s * hR, -0.04, s * 0.85, 0.04); G.fillRect(s * hR, tP, s * 0.85, 0.04); }
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

/* ============================== provisional slides (the kit lands next; these show the parts while it does) ============================== */
S({ id: 'b03_switch', ch: 'click', theme: 'paper', title: 'A mechanical switch, for the battery', settle: 11, replaces: ['clk_switch'],
  draw: t => { header(t, 'A mechanical switch, for the battery'); const pr = ep(t, 1, 1.4) - ep(t, 2.2, 2.5);
    demoWindow(LM, 280, 840, 600, 1, { plain: true }); part(LM + 140, 700, 42, () => b03_opticalMM({ press: pr, flash: 1 }));
    demoWindow(LM + 920, 280, 840, 600, 1, { plain: true }); part(LM + 920 + 420, 640, 42, () => clk_gt01MM({ press: pr })); } });
S({ id: 'b03_spdt', ch: 'click', theme: 'paper', title: 'Single pole, double throw', settle: 10, replaces: ['clk_spdt'],
  draw: t => { header(t, 'Single pole, double throw'); demoWindow(LM, 280, 1760, 600, 1, { plain: true }); part(W / 2, 760, 9, () => b03_knifeMM({ throw: lerp(-1, 1, ep(t, 0.5, 2.0)), hi: t > 2.5 ? 'pole' : null })); } });
S({ id: 'b03_hotswap', ch: 'click', theme: 'night', title: 'Hot-swap switches, no solder', settle: 11, replaces: ['clk_hotswap'],
  draw: t => { header(t, 'Hot-swap switches, no solder'); demoWindow(LM, 280, 1760, 680, 1, { plain: true }); part(W / 2, 520, 150, () => b03_clawMM({ insert: ep(t, 0.5, 2.5) })); } });
/* ---- */
/* ============================== b03_side: dual rail side buttons ============================== */
/** the classroom version: a door seen from above, hinged at its left end. A push near the hinge takes far more force than one
   at the handle, for the same swing (torque = force × distance). o = { swing 0..1 }. mm, y down, origin at the hinge */
function b03_doorMM(o = {}) {
  const L = 80, sw = clamp(o.swing || 0) * 0.07, out = {};
  solid(() => { G.beginPath(); G.rect(-10, -3, 10, 6); }, MT.shell, [-10, -3, 10, 6], { fill: B03C.shellLite(), ec: edgeCol(MT.shell), hatch: true });
  solid(() => { G.beginPath(); G.rect(L + 2, -3, 12, 6); }, MT.shell, [L + 2, -3, 12, 6], { fill: B03C.shellLite(), ec: edgeCol(MT.shell), hatch: true });
  G.save(); G.setLineDash([lw(5), lw(4)]); G.beginPath(); G.arc(0, 0, L, 0, 0.16); G.strokeStyle = inkA(0.25); G.lineWidth = lw(1.2); G.stroke(); G.restore();
  xsave(); xturn(sw);
  solid(() => pathRR(0, -1.6, L, 3.2, 0.6), MT.white, [0, -1.6, L, 3.2], { fill: TH ? '#E4E1D8' : '#4A4741', ec: edgeCol(MT.white) });
  solid(() => pathRR(L - 9, 1.4, 6, 2.2, 0.8), MT.steel, [L - 9, 1.4, 6, 2.2], { fill: TH ? '#9AA0A8' : '#7E848C', ec: edgeCol(MT.steel) });
  out.at = x => SP(x, -1.6); out.M = XF.m.slice();
  xrest();
  G.beginPath(); G.arc(0, 0, 2.2, 0, TAU); G.fillStyle = TH ? '#8A8983' : '#6E6D68'; G.fill();
  out.hinge = SP(0, 0); out.L = L;
  return out;
}
/* the timeline (s): establish, the rival's three presses, the wipe, Theseus's three, the verdict, the pull-out */
const B03_SIDE_T = { push: 0.1, rival: [1.85, 2.65, 3.45], wipe: 4.75, ours: [5.75, 6.35, 6.95], verdict: 7.8, facts: 9.3 };
/* the three spots, mm from the button's front end (the hinge end on the shipping part), and the order they are pressed in */
const B03_SPOTS = [{ s: 3.0, name: 'By the hinge' }, { s: 7.25, name: 'Middle' }, { s: 13.0, name: 'Tip' }];
/** one press at a spot: the thumb's depth 0..1 (pressCurve: in, held, out) */
const b03_sideP = (t, t0) => pressCurve(t, t0, { down: 0.2, hold: 0.36, up: 0.2, bounce: 0.03 });
S({
  id: 'b03_side', ch: 'click', theme: 'paper', title: 'Dual rail side buttons', settle: 12, ideas: [80, 64],
  replaces: ['sidebuttons'], src: ['b03_tpuHyper', 'b03_brockDoc', 'b03_gateronRail', 'b03_gt01', 'b03_razerV4'],
  answers: [
    ['left visualization feels lazy', 'The shipping button is drawn as it is built (one moulded part on a living hinge, its nub on a 2-pin mini switch on its own side board, a ribbon cable to the main board: Brock\'s photos, TechPowerUp\'s Hyperlight teardown) and demonstrated: a thumb presses it at three spots and the force to click runs from 1.62 N by the hinge to 0.37 N at the tip, where it bends on past the click'],
    ['right visualization doesn\'t match the other dual rail plungers with ptfe', 'It uses the main buttons\' post (2.4 mm) between two pads, POM as everywhere (F31.3), labelled "the main buttons\' post, on POM pads"'],
    ['it\'s way overbuilt', 'Stripped to a guide over the switch\'s top (two walls, two pads), the one post, and a 1 mm pocket in the shell round the switch: no arms, no rails, no glove skirts'],
    ['important information though, it gets the point across okay', 'Every fact kept: 0 mice ship SPDT side buttons (F11.4), full-size switches at 29.31 g (F9.17), held by the shell with no side board (F12.4), the stop on the guide (#64)'],
    ['it just feels lazy', 'Now a demonstration: established on the mouse, pushed in, the same three thumb presses on the hinge and on the rail, the classroom door (torque) beside it, and the verdict: a force spread of 1.25 N → 0.00 N'],
    ['F31.4: "i\'d have to see" the guide over the full-size switch', 'Shown plainly, held by the shell, as the slide\'s second half: say if the pads should face across instead (a question in the report)']
  ],
  sfx: [[1.85 + 0.17, 'click'], [2.65 + 0.15, 'click'], [3.45 + 0.12, 'click'], [5.75 + 0.18, 'click'], [6.35 + 0.18, 'click'], [6.95 + 0.18, 'click']],
  draw: t => {
    const T = B03_SIDE_T, box = [80, 260, 1200, 700], RX = 1320, RW = 520;
    header(t, 'Dual rail side buttons');
    captions(t, [[0.4, 'Most side buttons hang on a hinge, so where your thumb lands changes the click.'],
      [T.wipe, 'Theseus\'s slide straight in, on the main buttons\' post and POM pads, over a full-size SPDT switch.'],
      [T.facts, 'No sweet spot to hunt for: the same click at every spot, with full-size switches, at 29.31 g.']]);
    /* where the front side button is on the mouse: its centre, and the shell's outer face there (the kit's top view) */
    const yc = (-23.5 - 8.9) / 2 * MS_K.y, X0 = -msHalfW(-16.2), focus = [X0 - 15, yc - 11.5, 44, 23];
    const est = establish(t, T.push, box, { view: 'top', hi: ['side1'], col: 'ink', focus, hold: 0.4, dur: 1.1, locator: 'tr', fade: 0.35 });
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
      ltag(box[0] + 32, box[1] + 50, riv ? 'Most mice' : 'Theseus', riv ? 'on a hinge' : 'on a rail', { a: ka * kn, size: 22, color: riv ? C.mute : C.heroText, vcolor: riv ? C.secondText : C.heroText });
    }
    /* the thumb, lying along the side and pressing in with its pad at the spot; the force it takes, growing to the click */
    if (pr && kd > 0.5 && ko < 0.02) {
      const riv = t < T.wipe, o = riv ? hinge : rail, yS = -B03_SIDE.L / 2 + spot.s, fp = o.face ? o.face(yS) : null;
      if (fp) {
        const ia = ep(t, pr.t0 - 0.35, pr.t0 - 0.05) * (1 - ep(t, pr.t0 + 0.8, pr.t0 + 1.0));
        clipped(box[0], box[1], box[2], box[3], () => finger(fp[0], fp[1], -Math.PI / 2, { s: est.s, press: pr.d, alpha: ia * 0.96, len: 40 }));
        const N = (riv ? b03_leverF(spot.s) : B03.gt01.f) * 9.80665e-3;
        forceArrow(fp[0] - 4, fp[1], 0, 60 + 120 * N, { N, k: clamp(pr.d / 0.82) * ia, color: riv ? (N > 1 ? C.red : C.ink) : C.hero, side: 'end' });
      }
    }
    /* what each press left: its force at its spot, beside the button; red by the hinge, blue on the rail */
    if (ka > 0.01) {
      B03_SPOTS.forEach((sp, i) => {
        const yS = -B03_SIDE.L / 2 + sp.s, q = est.P(X0, yc + yS), xL = est.P(X0 - 1.6, 0)[0];
        const tR = T.rival[i] + 0.62, tO = T.ours[i] + 0.62, oursShown = t >= tO, rivalShown = t >= tR && t < T.wipe + 0.45;
        if (!rivalShown && !oursShown) return;
        const a = ka * (oursShown ? ep(t, tO, tO + 0.3) : ep(t, tR, tR + 0.3) * (1 - ep(t, T.wipe + 0.1, T.wipe + 0.45)));
        const N = (oursShown ? B03.gt01.f : b03_leverF(sp.s)) * 9.80665e-3;
        circle(q[0] - 3, q[1], 4, { fill: oursShown ? C.hero : i === 0 ? C.red : C.ink2, alpha: a });
        rich([{ s: kitNum(N, 2) + ' N', role: 'num', size: 26, weight: 750, color: oursShown ? C.heroText : i === 0 ? C.red : C.ink, tnum: true }], xL - 12, q[1] + 9, { align: 'right', alpha: a });
      });
      const kr = ep(t, T.rival[2] + 0.75, T.rival[2] + 1.05) * (1 - ep(t, T.wipe, T.wipe + 0.35)) * ka;
      if (kr > 0.01) { text(b03_floor(B03.leverSpread, 1) + '× the force by the hinge', sx, sy, { role: 'small', size: 26, weight: 750, color: C.red, alpha: kr }); text('as at the tip, for the same click', sx, sy + 32, { role: 'small', size: 23, weight: 600, color: C.mute, alpha: kr }); }
      const ks = ep(t, T.ours[2] + 0.8, T.ours[2] + 1.1) * ka;
      if (ks > 0.01) { text('The same force at every spot', sx, sy, { role: 'small', size: 26, weight: 750, color: C.heroText, alpha: ks }); text('it slides: no hinge, no lever', sx, sy + 32, { role: 'small', size: 23, weight: 600, color: C.mute, alpha: ks }); }
    }
    /* the parts, named in one column to the right of the drawing, as they matter */
    if (kd > 0.5 && ko < 0.02) {
      const lx = est.P(X0 + 18.5, 0)[0], ly = i => box[1] + 216 + i * 112, C2 = { side: 'r', prose: true, maxW: 250 };
      if (t < T.wipe) {
        if (hinge.hinge) callout(t, 1.5, hinge.hinge, 'A living hinge: the button is a lever', Object.assign({ to: [lx, ly(0)], color: C.ink2, tcolor: C.ink }, C2));
        if (hinge.mini) callout(t, 1.9, hinge.mini, '2-pin mini switch: single throw', Object.assign({ to: [lx, ly(2)], color: C.ink2, tcolor: C.ink }, C2));
        if (hinge.cable) callout(t, 2.3, hinge.cable, 'Its own side board and ribbon cable', Object.assign({ to: [lx, ly(1)], color: C.ink2, tcolor: C.ink }, C2));
        if (hinge.tip && t > T.rival[2] + 0.24) faultTag(t, T.rival[2] + 0.24, hinge.tip, 'At the tip it bends on past the click', Object.assign({ to: [lx, ly(3)] }, C2));
      } else if (t > T.wipe + 0.9) {
        if (rail.post) fixTag(t, T.wipe + 1.0, rail.post, 'The main buttons\' post, on POM pads', Object.assign({ to: [lx, ly(0)] }, C2));
        if (rail.stop) fixTag(t, T.ours[0] + 0.3, rail.stop, 'It lands flat on the guide: the stop', Object.assign({ to: [lx, ly(1)] }, C2));
        if (rail.swBody) callout(t, T.wipe + 1.4, rail.swBody, 'Full-size SPDT switch', Object.assign({ to: [lx, ly(2)], color: C.ink2, tcolor: C.ink }, C2));
        if (rail.pocket) callout(t, T.wipe + 1.8, rail.pocket, 'Held by the shell: no side board', Object.assign({ to: [lx, ly(3)], color: C.ink2, tcolor: C.ink }, C2));
      }
    }
    /* the classroom version, beside the rival's presses: a door is the same lever */
    const kc = 1 - ep(t, T.wipe + 0.3, T.wipe + 0.8);
    if (t > 0.9 && kc > 0.003) {
      G.save(); G.globalAlpha = kc;
      const r = demoPanel(t, 0.9, [RX, 260, RW, 330], { src: 'Torque = F × d' });
      const dpr = t < T.wipe ? press(T.rival) : null, dsp = dpr ? B03_SPOTS[dpr.i] : null;
      const door = part(r[0] + 34, r[1] + 70, 4.6, () => b03_doorMM({ swing: dpr ? dpr.d : 0 }), { alpha: ep(t, 1.1, 1.5) });
      if (dsp && door.M) {
        const pa = SPm(door.M, 80 * dsp.s / B03.btnL, -1.6), N = b03_leverF(dsp.s) * 9.80665e-3, ia = 1 - ep(t, dpr.t0 + 0.8, dpr.t0 + 1.0);
        forceArrow(pa[0], pa[1], Math.PI / 2, 30 + 46 * N, { k: clamp(dpr.d / 0.82) * ia, color: N > 1 ? C.red : C.ink, w: 3, hs: 11 });
      }
      text('Push a door near its hinge and it takes far more force than at the handle. A hinged button is the same lever.', r[0], r[1] + 158, { role: 'small', size: 24, weight: 600, color: C.ink2, maxW: r[2], alpha: ep(t, 1.4, 1.8), lh: 1.3 });
      G.restore();
    }
    /* the verdict: how much more force the heaviest spot takes than the lightest */
    const nR = sp => +kitNum(b03_leverF(sp) * 9.80665e-3, 2), spreadN = nR(B03.spots[0]) - nR(B03.spots[2]);   /* from the readings as printed (G5) */
    verdict(t, T.verdict, RX, 440, { from: spreadN.toFixed(2), to: '0.00', unit: 'N', dec: 2, label: 'Force spread', better: 'lower', who: ['On a hinge', 'Theseus'], net: false, size: 112, maxW: RW });
    scaleNote(RX, 540, 'wherever your thumb lands', { lead: kitNum(B03.gt01.f * 9.80665e-3, 2) + ' N', t, t0: T.verdict + 1.7 });
    statTile(t, T.facts, [RX, 600, RW, 160], { value: '0', label: 'Other mice with SPDT side buttons', align: 'left' });
    statTile(t, T.facts + 0.3, [RX, 800, RW, 160], { value: THS.mass, unit: 'g', label: 'with four full-size SPDT switches', hero: true, align: 'left' });
    text('Lever model: a 14.5 mm button, its nub 9 mm from the hinge, the same 55 gf switch on both; the rail\'s pad friction not modelled', LM, 994, { role: 'foot', color: C.faint, alpha: ep(t, T.verdict + 1.9, T.verdict + 2.3), maxW: RM - LM });
  }
});
