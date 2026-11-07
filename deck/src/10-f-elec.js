/* ============================================================================================
   ELECTRONICS (chapter code elc): the radio, the power, the one board and its wires.
   Order in the chapter (13-sort.js): eleccard, onechip, elc_module, antenna, motion, elc_rate, framesync, secondshot,
   power, elc_pmic, elc_charge, elc_safe, cells, frontier, elc_oneside, elecsheet1, elc_tear, elc_twist, elc_lay,
   elc_flex, cable, software, elc_sheet2. motion, elc_rate, cells and frontier live in 14-c-elec-ex.js; the braided wires
   in 10-f2-elec.js; the idea sheets in 12-40 and 12-45. Brock (F2.42): no receiver (dongle) slides; syncpower was folded
   into power. Every comparison leads with a headline (elc_hl) and keeps the bad value beside the good (elc_ba).
   The 3D board is the 'pcb' scene (3d/pcb): positions below are its layout's board-local mm (x = the user's left,
   z = toward the nose), turned into the mouse frame by elc_W().
   ============================================================================================ */
Object.assign(SRC, {
  elcRaytac: { t: 'Raytac AN54LM-P20A product page: nRF54LM20A, PCB antenna (the long meander trace), 9.9 × 13.3 × 2.0 mm, 2.0 MB flash / 512 KB RAM, high-speed USB, 66 GPIO; "Intended Certifications: FCC, IC, CE, Telec (MIC), KC, SRRC, NCC, RCM, WPC"; coming soon, est. Q4 2026 (read 2026-11-04). Brock chose the AN54LM-P20A, long antenna (21:55)', u: 'https://www.raytac.com/product/ins.php?index_id=181' },
  elcEemb: { t: 'EEMB LP402535 specification (ZJQM-RD-SPC-H2310, 2022-10-25): 320 mAh nominal, 300 mAh minimum at 0.2C; 3.7 V; 4.2 V charge; maximum charge 320 mA (1.0C, CC/CV); approx. 6.4 g; ≤ 4.3 × 25.5 × 36 mm; charging 0 to 45 °C; ≥ 500 cycles at 0.5C', u: 'https://eemb.oss-accelerate.aliyuncs.com//uploads/20230315/7900a5b46fe77f926d269d99ff3a8dfa.pdf', n: 'Theseus\'s battery from 2026-11-06 (Brock). The deck counts its minimum, 300 mAh, and charges it at 1C of that, 300 mA, inside the 320 mA rating.' },
  elcLp4025: { t: 'Jauch LP402535JU datasheet (matd 246497, 2020-05-07): 380 mAh typical, 370 mAh minimum at 0.2C; 3.7 V; standard charge 0.2C, maximum charge 1.0C; 4.2 V charge; 300 cycles to 80%; about 8 g; charging from +10 to +45 °C', u: 'https://jauch.com/downloadfile/66ced46b34a2d2b034c873f2a5b325e7b/matd_246497_20200507_380mah_-_lp402535ju_1s1p_2_wire_50mm.pdf' },
  elcRaytacBlog: { t: 'Raytac blog, 25 Mar 2026: the AN54LM series; Bluetooth 6.0 certified, regional certifications listed as targets', u: 'https://raytaccorp.blogspot.com/2026/03/raytac-abietec-announce-new-an54lm.html' },
  elcNpm: { t: 'Nordic nPM1300 product page: 32 to 800 mA charging, 3.5 to 4.45 V termination, 4.0 to 5.5 V input with 22 V overvoltage protection, 2 × 200 mA bucks, 2 LDOs / load switches, fuel gauge, watchdog, ship mode 370 nA, hibernate 500 nA, 5 × 5 mm QFN', u: 'https://www.nordicsemi.com/Products/nPM1300' },
  elcNpmJeita: { t: 'nPM1300 product specification, battery temperature: no charging below 0 °C or above 60 °C; 50% current from 0 to 10 °C; a lower termination voltage from 45 to 60 °C (defaults, all configurable)', u: 'https://docs.nordicsemi.com/r/bundle/ps_npm1300/page/chapters/charger.html-battery-temp-monitoring' },
  elcNpmChg: { t: 'Zephyr nPM1300 charger binding: 32 to 800 mA in 2 mA steps; charging ends at 10% (default) or 20% of the set current; charging stops above a set die temperature and resumes below another', u: 'https://docs.zephyrproject.org/latest/build/dts/api/bindings/sensor/nordic,npm1300-charger.html' },
  elcGauge: { t: 'nRF Fuel Gauge library (nrfxlib): state of charge, time to empty, time to full and state of health from the nPM1300 measurements', u: 'https://nrfconnectdocs.nordicsemi.com/ncs/latest/nrfxlib/doxygen/html/group__nrf__fuel__gauge.html' },
  elcTpuV4: { t: 'TechPowerUp, Razer Viper V4 Pro review: Airoha AB1623MN; 306 mAh, 3.87 V battery; 0.169 A constant-current charge; about 40 h at 8 khz; fuel gauge IC; 12-bit wireless counts; smoothing after lift-off (as recorded in the 2026-11-03 validation report)', u: 'https://www.techpowerup.com/review/razer-viper-v4-pro/' },
  elcB2gSlx: { t: 'Back2Gaming, Finalmouse Starlight X review: 15 graphite-coated titanium screws, about 0.02 g each; no battery-hour rating', u: 'https://www.back2gaming.com/review/finalmouse-starlight-x-nightfall-wireless-mouse/' },
  elcBu802: { t: 'Battery University BU-802b: lithium-ion self-discharge, 1 to 2% a month plus about 3% a month for the protection circuit', u: 'https://batteryuniversity.com/article/bu-802b-what-does-elevated-self-discharge-do' },
  elcCoat: { t: 'Conformal coating (Wikipedia, citing IPC): acrylic, epoxy or urethane coats are typically 30 to 130 µm thick after curing', u: 'https://en.wikipedia.org/wiki/Conformal_coating' },
  elcXa25: { t: 'XBAB XA25 product page: cable 1.9 mm, 6.9 g/m, passes the USB 2.0 high-speed eye-pattern test', u: 'https://xbabtech.com/' },
  dsReflow: { t: 'ALLPCB: in double-sided reflow, the second pass can make first-side parts fall off as their joints re-melt; parts under about 5 g are less likely to fall; boards under 1.6 mm can sag', u: 'https://www.allpcb.com/allelectrohub/the-art-of-double-sided-reflow-preventing-component-fallout-in-second-pass-soldering' },
  antDetune: { t: 'Antenova: nearby metal (batteries, shields) absorbs or reflects RF and moves an antenna off its band', u: 'https://blog.antenova.com/designing-around-detuning-how-to-avoid-nearby-component-interference-in-crowded-pcbs' },
  elcBrock: { t: 'Brock Liddicoat, In Pursuit of an Objectively Better Mouse: the ideas doc and its comment thread', u: '', n: 'research/brock-doc-in-pursuit.txt and research/brock-doc-comments.txt' },
  elcLayout: { t: 'Theseus main PCB, 3D layout (3d/pcb/pcb-layout.json): part positions, the antenna keep-out, the power paths', u: '', n: 'a proposal: positions measured from the Sora V2 where the layout says so, the rest representative' }
});

/* ---------- helpers ---------- */
const ELC = {
  /* every key the pcb scene takes: the scene keeps whatever a call leaves out, so each call sets them all */
  pcb0: { explode: 0, xray: 0, power: 0, powerMode: 'charge', powerT: 0, reflow: 0, pressL: 0, pressR: 0 },
  top: [0, 0.98, -0.2],          /* from above with the nose at the top (the named 'top' view puts the nose at the bottom) */
  run: '#6FDCFF', chg: C.hero       /* the colours of the scene's current flow, for the 2D keys that point at it */
};
/** board-local mm (x, z, height above the top copper) to the mouse frame the scene uses (3d/pcb/pcb.js PCB_INFO) */
const elc_W = (x, z, dy = 0) => [x, 5.03 + dy, z - 2.88];
/** a 3D shot with every state key set; returns a projector (mouse-frame mm → stage px) once the scene has rendered, else null */
function elc_v3(key, t, x, y, w, h, st, o = {}) {
  const s = Object.assign({}, key === 'pcb' ? ELC.pcb0 : key === 'battery' ? { explode: 0 } : {}, st);
  if (!view3D(key, t, x, y, w, h, s, o)) return null;
  if (V3.proj) return V3.proj;                       /* the 2D twin's projector (08-v2d.js) */
  if (typeof R3D === 'undefined' || !R3D.prepare) return null;
  const e = R3D.prepare(key, o.theme || (TH ? 'paper' : 'night')), cam = e && e.studio && e.studio.camera;
  if (!cam) return null;
  const V = R3D.THREE.Vector3;
  return p => { const v = new V(p[0], p[1], p[2]).project(cam); return [x + (v.x + 1) / 2 * w, y + (1 - v.y) / 2 * h]; };
}
/** radio leaving a point: arcs that grow and fade, centred on a screen angle */
function elc_waves(t, t0, p, ang, o = {}) {
  const k = ep(t, t0, t0 + 0.6) * (o.alpha == null ? 1 : o.alpha); if (k <= 0.003 || !p) return;
  const n = o.n || 5, R = o.R || 260, sp = o.spread || 0.6, col = o.color || acc();
  for (let i = 0; i < n; i++) {
    const ph = ((t - t0) * (o.speed || 0.42) + i / n) % 1, r = (o.r0 || 16) + ph * R;
    const fade = o.wall && r > o.wall ? o.through : 1;
    circle(p[0], p[1], r, { color: col, w: o.w || 2.5, alpha: k * Math.pow(1 - ph, 1.2) * 0.85 * fade, a0: ang - sp, a1: ang + sp });
  }
}
/** a key-value list: a mono key, the value as reading text, an optional evidence dot at the right */
function elc_kv(t, t0, x, y, w, rows, o = {}) {
  const kw = o.kw || 170, rh = o.rh || 44;
  rows.forEach((r, i) => {
    const yy = y + i * rh, k = ep(t, t0 + i * 0.1, t0 + 0.4 + i * 0.1);
    if (i && o.rules !== false) rule(x, yy - rh * 0.64, x + w, k);
    text(r[0], x, yy, { role: 'label', size: 21, color: C.mute, alpha: k });
    text(r[1], x + kw, yy, { role: 'small', size: 25, weight: r[3] ? 700 : 500, color: r[4] || C.ink, alpha: k, maxW: w - kw - (r[2] ? 26 : 0), sentence: false });
    if (r[2]) evDot(x + w - 7, yy - 8, r[2], 5.5, k);
  });
}
/** the key of a 3D shot, in type (DESIGN 0.8: no plate, no dot): a short dashed stroke in the colour of the current it names,
   then the words. Set it where the tile is clear, never over the board. o = { sub (a second line), maxW, color }. Returns its height */
function elc_key(x, y, col, label, a = 1, o = {}) {
  if (a <= 0.003) return 0;
  line(x, y - 7, x + 30, y - 7, { color: col, w: 4, dash: [8, 5], alpha: a });
  const r = text(label, x + 42, y, { role: 'label', size: 21, color: o.color || C.ink, alpha: a, maxW: o.maxW ? o.maxW - 42 : 900 });
  if (!o.sub) return r.h;
  const s2 = text(o.sub, x + 42, y + r.h + 6, { role: 'small', size: 23, weight: 600, color: C.mute, alpha: a, maxW: o.maxW ? o.maxW - 42 : 900, lh: 1.25 });
  return r.h + 6 + s2.h;
}
/** the radio chip of each wireless mouse in the dataset, grouped */
function elc_census() {
  const ms = ((RD.mice || {}).mice || []).filter(m => m.connection !== 'wired');
  const fam = s => /nRF52840/.test(s) ? 'nRF52840' : /nRF52833/.test(s) ? 'nRF52833' : /nRF54/.test(s) ? 'nRF54' : /PixArt/.test(s) ? 'PixArt' : 'Other';
  const n = {}; ms.forEach(m => { const f = fam(String(rv(m.mcu) || '')); n[f] = (n[f] || 0) + 1; });
  return { total: ms.length, n };
}
/** chips in a box, for the path diagrams */
function elc_chipBox(t, t0, x, y, w, h, chips, col) {
  const k = ep(t, t0, t0 + 0.5);
  rr(x, y, w, h, 10, C.panel, col, 1.8, k);
  chips.forEach((c, i) => {
    const cx = x + 30 + i * (c.dx || 200);
    part(cx, y + h / 2, 5.2, () => chipMM({ w: 6, hi: c.hi }), { alpha: k });
    text(c.l, cx + 28, y + h / 2 - (c.s ? 4 : -8), { role: 'label', size: 21, color: C.ink, alpha: k });
    if (c.s) text(c.s, cx + 28, y + h / 2 + 24, { role: 'label', size: 21, color: c.sc || C.mute, alpha: k });
  });
}

/* ---------- at a glance (Brock, F14.10 and F16.1) ----------
   The eye lands first on a huge number in Theseus's colour that says by how much, and on a chart where Theseus visibly
   wins, with which way is better written on it. A number that improves keeps its bad value beside it: before → after. */
/** the headline: a label over a huge figure in Theseus's gradient, a word beside it, a line under it.
   (x, y) = the figure's left edge (o.align 'right': its right edge) and baseline. o = { size (150), label, sub, subW, a, count, from } */
function elc_hl(t, t0, x, y, num, word, o = {}) {
  const a = ep(t, t0, t0 + 0.5) * (o.a == null ? 1 : o.a); if (a <= 0.003) return 0;
  const sz = o.size || 150, k = E.out3(ep(t, t0, t0 + 0.7)), al = o.align || 'left';
  G.save(); G.translate(0, (1 - k) * 16);
  if (o.label) text(o.label, x, y - Math.round(sz * 0.78) - 22, { role: 'label', size: 21, color: C.heroText, alpha: a, align: al, maxW: o.subW || 640 });
  const r = rich([{ s: num, role: 'd1', size: sz, weight: 800, track: -0.035, color: C.heroText, grad: C.heroGrad, tnum: true, count: o.count === false ? null : [t0, 0.9, o.from || 0] },
    word ? { s: word, role: 'd2', size: Math.round(sz * 0.3), color: C.heroText, grad: C.heroGrad, gap: Math.round(sz * 0.08) } : null], x, y, { t, alpha: a, align: al });
  if (o.sub) text(o.sub, x, y + Math.round(sz * 0.22) + 32, { role: 'small', size: 25, weight: 600, color: C.ink2, align: al, alpha: a * ep(t, t0 + 0.3, t0 + 0.8), maxW: o.subW || 640, lh: 1.3 });
  G.restore();
  return r.w;
}
/** before → after on one line: the old value struck in grey, an arrow, the new one in Theseus's gradient, the net change
   under it in Theseus's colour. (x, y) = left, baseline. o = { size (64), label, unit, net, who: [old's name, new's name], a, maxW } */
function elc_ba(t, t0, x, y, before, after, o = {}) {
  const a = ep(t, t0, t0 + 0.5) * (o.a == null ? 1 : o.a); if (a <= 0.003) return 0;
  const sz = o.size || 64, st0 = { role: 'd1', size: sz, weight: 800, track: -0.02, color: C.faint, tnum: true }, wB = tw(before, st0);
  if (o.label) text(o.label, x, y - Math.round(sz * 0.8) - 18, { role: 'label', size: 21, color: C.mute, alpha: a, maxW: o.maxW || 640 });
  text(before, x, y, Object.assign({ alpha: a }, st0));
  line(x - 4, y - sz * 0.3, x + wB + 4, y - sz * 0.3, { color: C.mute, w: Math.max(3, sz * 0.06), alpha: a * ep(t, t0 + 0.35, t0 + 0.7) });
  const ax = x + wB + sz * 0.28, aw = sz * 0.6, x2 = ax + aw + sz * 0.28;
  arrow(ax, y - sz * 0.32, ax + aw, y - sz * 0.32, { color: C.mute, w: Math.max(2.5, sz * 0.05), hs: sz * 0.2, alpha: a, p: ep(t, t0 + 0.2, t0 + 0.7) });
  const k = ep(t, t0 + 0.45, t0 + 0.95);
  const r = rich([{ s: after, role: 'd1', size: sz, weight: 800, track: -0.03, color: C.heroText, grad: C.heroGrad, tnum: true },
    o.unit ? { s: o.unit, font: 'disp', size: Math.round(sz * 0.4), weight: 700, color: C.heroText, grad: C.heroGrad, gap: Math.round(sz * 0.08), caps: false } : null], x2, y, { t, alpha: a * k });
  if (o.who) { text(o.who[0], x, y + 36, { role: 'label', size: 19, color: C.faint, alpha: a }); text(o.who[1], x2, y + 36, { role: 'label', size: 19, color: C.heroText, alpha: a * k }); }
  if (o.net) text(o.net, x, y + (o.who ? 82 : 48), { role: 'small', size: 26, weight: 800, color: C.heroText, alpha: a * ep(t, t0 + 0.8, t0 + 1.2), maxW: o.maxW || 640, lh: 1.25 });
  return x2 + r.w - x;
}

/* ---------- the plan's cell and the draw it runs at ----------
   The cell is the Intro's (its weight budget, THESEUS.pack): EEMB's LP402535, 300 mAh minimum, 1C charge, charging 0 to
   45 °C (elcEemb; Brock, 17:08). The draw is the Viper V4 Pro's: its 1.184 Wh cell over Razer's 180 h at 1 khz, and over
   TechPowerUp's 40 h measured at 8 khz, less its two optical switches (ntr_hours: one derivation for the deck). */
function elc_cell() {
  const H = ntr_hours(), c = H.cell, r = (((RD.batteries || {}).eemb_lipo || {}).rows || []).find(x => x.part === c.part) || {}, tc = r.charge_temp_C || { min: 0, max: 45 };
  return { part: c.part, maker: c.maker, mAh: c.mAh, g: c.g, wh: c.wh, whV4: H.L.wh, w1: H.L.w1, w8: H.L.w8, keep: H.S.keep, opt: H.S.opt,
    h1: H.h1, h8: H.h8, same1: H.same1, same8: H.same8, tLo: tc.min, tHi: tc.max, cyc: r.cycles ? rv(r.cycles) : null };
}

/* ---------- the layout's numbers, board-local mm (3d/pcb/pcb-layout.json, and the scene's 2D twin) ----------
   Brock (F9.13): the module is turned 180°, so its antenna end sits away from the wheel's metal. The keep-out turned with
   it, from z 23.75–27.45 to 13.75–17.45. The antenna band's centre went from z 25.38 to 15.82; the axle is at z 37.75. */
Object.assign(ELC, { modZ: 20.6, antZ: 15.82, antZ0: 25.38, axleZ: 37.75, keep: [-6.6, 13.75, 6.6, 17.45], keep0: [-6.6, 23.75, 6.6, 27.45] });
ELC.gap = ELC.axleZ - ELC.antZ; ELC.gap0 = ELC.axleZ - ELC.antZ0;      /* 21.9 and 12.4 mm */
/** the board's outline, board-local mm (x, z), decimated from 3d/pcb/pcb-layout.json */
/** the board's outline, board-local mm (x, z), decimated from 3d/pcb/pcb-layout.json */
const ELC_OUTLINE = [[19.25, 13.36], [19.17, 15.41], [15.64, 17.3], [15.41, 17.72], [15.42, 30.38], [19.02, 33.21], [19.03, 45.88], [18.81, 46.2], [8.79, 46.28], [5.39, 49.7], [5.31, 52.18], [4.96, 52.5], [-5.03, 52.49], [-5.31, 52.22], [-5.39, 49.7], [-8.79, 46.28], [-18.81, 46.2], [-19.03, 45.88], [-19.02, 33.18], [-15.41, 30.27], [-15.43, 17.58], [-19.1, 15.48], [-19.32, 15.07], [-19.31, 13.48], [-18.52, 12.24], [-18.52, -0.4], [-18.91, -1.29], [-18.91, -2.7], [-18.65, -3.07], [-14.77, -4.94], [-13.44, -5.02], [-11.07, -3.71], [11.89, -3.71], [13.6, -4.95], [15.61, -4.63], [19.04, -2.71], [19.04, -1.24], [18.52, -0.29], [18.52, 12.23]];

/** the meander antenna's centre line, module-local mm (antenna end up, −y), as the 3D part draws it */
function elc_meander() {
  const x0 = -4.1, x1 = 4.2, yA = -3.6, yB = -6.1, n = 6, P = [[x0, -3.25], [x0, yB]];
  for (let i = 0; i < n; i++) { const xa = x0 + (x1 - x0) * (i + 0.5) / n, xb = x0 + (x1 - x0) * (i + 1) / n, top = i % 2 ? yA : yB, bot = i % 2 ? yB : yA; P.push([xa, top], [xa, bot], [xb, bot]); }
  return P;
}
/** the Raytac module from above (Brock, F9.25 and F17.1: black, the long meander antenna). Module-local mm about its centre:
   the black substrate, the nickel can over the radio, the meander across the antenna end (−y), castellated pads down both
   long sides and across the far end, the matching part at the feed. As the 3D part (3d/parts/boardparts.js).
   (cx, cy) = its centre on the stage, s px per mm, rot its turn (0: antenna end up). o = { a, t, flow (0..1, current along
   the meander), sweep (0..1, a light across the can), lift (0..1, picked up), mark (false: no laser text), mirror (true:
   local +x to the screen's left, as in a top view of the board, where +x is the user's left) }.
   Returns stage points for callouts: { ant, can, pads, end, feed } */
function elc_module(cx, cy, s, rot, o = {}) {
  const a = o.a == null ? 1 : o.a, W = 9.9, L = 13.3, hw = W / 2, hl = L / 2, lift = o.lift || 0, sc = s * (1 + 0.06 * lift);
  const mx = o.mirror ? -1 : 1, cr = Math.cos(rot), sr = Math.sin(rot), toS = (x, y) => [cx + (mx * x * cr - y * sr) * sc, cy + (mx * x * sr + y * cr) * sc];
  const out = { ant: toS(0.05, -4.85), can: toS(0.6, 1.8), pads: toS(hw, 3.3), end: toS(0, hl), feed: toS(-3.15, -3.1) };
  if (a <= 0.003) return out;
  const px = 1 / sc;
  G.save(); G.globalAlpha = a;
  if (lift > 0.003) { G.save(); G.translate(cx + 12 * lift, cy + 18 * lift); G.rotate(rot); G.scale(sc, sc); rrPath(-hw, -hl, W, L, 0.3); G.fillStyle = `rgba(0,0,0,${0.32 * lift})`; G.fill(); G.restore(); }
  G.translate(cx, cy); G.rotate(rot); G.scale(mx * sc, sc);
  /* the substrate: black, a soft sheen */
  const g = G.createLinearGradient(-hw, -hl, hw, hl); g.addColorStop(0, '#26282D'); g.addColorStop(0.5, '#16171B'); g.addColorStop(1, '#0C0D0F');
  rrPath(-hw, -hl, W, L, 0.22); G.fillStyle = g; G.fill(); G.strokeStyle = 'rgba(255,255,255,0.14)'; G.lineWidth = 1.2 * px; G.stroke();
  /* castellations: a gold pad at the edge with its plated half hole, 12 down each long side and 11 across the far end */
  for (let i = 0; i < 12; i++) {
    const y = 5.9 - i * 0.8;
    for (const sx of [-1, 1]) {
      G.fillStyle = '#C9A15C'; G.fillRect(sx > 0 ? hw - 0.56 : -hw, y - 0.25, 0.56, 0.5);
      G.fillStyle = '#6E5428'; G.beginPath(); G.arc(sx * hw, y, 0.22, sx > 0 ? Math.PI / 2 : -Math.PI / 2, sx > 0 ? Math.PI * 1.5 : Math.PI / 2); G.fill();
    }
  }
  for (let i = 0; i < 11; i++) {
    const x = -4.0 + i * 0.8;
    G.fillStyle = '#C9A15C'; G.fillRect(x - 0.25, hl - 0.56, 0.5, 0.56);
    G.fillStyle = '#6E5428'; G.beginPath(); G.arc(x, hl, 0.22, Math.PI, TAU); G.fill();
  }
  /* the can: nickel silver, brushed, over the radio end; a light can sweep across it */
  const c0 = -2.8, c1 = 6.3, cw = 4.55;
  const gc = G.createLinearGradient(-cw, c0, cw, c1); gc.addColorStop(0, '#DCDFE3'); gc.addColorStop(0.5, '#B3B7BD'); gc.addColorStop(1, '#8C9198');
  rrPath(-cw, c0, 2 * cw, c1 - c0, 0.35); G.fillStyle = gc; G.fill();
  G.save(); rrPath(-cw, c0, 2 * cw, c1 - c0, 0.35); G.clip();
  G.strokeStyle = 'rgba(255,255,255,0.12)'; G.lineWidth = 0.7 * px;
  for (let y = c0 + 0.1; y < c1; y += 0.17) { G.beginPath(); G.moveTo(-cw, y); G.lineTo(cw, y); G.stroke(); }
  if (o.sweep != null && o.sweep > 0 && o.sweep < 1) {
    const sx = lerp(-cw - 5, cw + 5, o.sweep), gs = G.createLinearGradient(sx - 2.6, c0, sx + 2.6, c1);
    gs.addColorStop(0, 'rgba(255,255,255,0)'); gs.addColorStop(0.5, 'rgba(255,255,255,0.42)'); gs.addColorStop(1, 'rgba(255,255,255,0)'); G.fillStyle = gs; G.fillRect(-cw, c0, 2 * cw, c1 - c0);
  }
  G.restore();
  G.strokeStyle = 'rgba(0,0,0,0.38)'; G.lineWidth = 1 * px; rrPath(-cw, c0, 2 * cw, c1 - c0, 0.35); G.stroke();
  /* laser marking, set at stage scale so the type stays crisp */
  if (o.mark !== false && !o.mirror && sc > 9) {
    G.save(); G.scale(px, px); G.fillStyle = 'rgba(52,54,58,0.78)'; G.textAlign = 'left'; G.textBaseline = 'alphabetic';
    const ln = (s0, y, sz, wt) => { setFont({ font: 'sans', size: sz * sc, weight: wt }); G.fillText(s0, -3.75 * sc, y * sc); };
    ln('Raytac', -1.55, 0.62, 650); ln('AN54LM-P20A', -0.45, 0.86, 800); ln('nRF54LM20A', 0.55, 0.6, 650); ln('2.4 GHz  BLE 6.0', 1.4, 0.5, 600);
    G.restore();
    G.fillStyle = 'rgba(52,54,58,0.7)';
    for (let j = 0; j < 9; j++) for (let i = 0; i < 9; i++) if (i === 0 || j === 8 || ((i * 7 + j * 13 + i * j * 3) % 5) < 2) G.fillRect(-3.75 + i * 0.2, 3.2 + j * 0.2, 0.2, 0.2);
  }
  /* the meander: copper under the black mask, seen as relief; current runs along it when the radio sends */
  const P = elc_meander(), path = () => { G.beginPath(); P.forEach(([x, y], i) => i ? G.lineTo(x, y) : G.moveTo(x, y)); };
  G.lineJoin = 'round'; G.lineCap = 'round';
  path(); G.strokeStyle = '#3A3D44'; G.lineWidth = 0.42; G.stroke();
  G.save(); G.translate(-0.06, -0.07); path(); G.strokeStyle = 'rgba(255,255,255,0.13)'; G.lineWidth = 0.12; G.stroke(); G.restore();
  if (o.flow > 0.003) { G.save(); path(); G.setLineDash([0.55, 1.5]); G.lineDashOffset = -(o.t || 0) * 7; G.strokeStyle = C.hero; G.globalAlpha = a * o.flow; G.lineWidth = 0.3; G.stroke(); G.restore(); }
  /* the matching part at the feed: an 0402 with tin ends */
  G.fillStyle = '#4A4033'; G.fillRect(-3.46, -3.35, 0.62, 0.5); G.fillStyle = '#C9CCD1'; G.fillRect(-3.46, -3.35, 0.14, 0.5); G.fillRect(-2.98, -3.35, 0.14, 0.5);
  G.restore();
  return out;
}

/** the front of the one board from above, nose up, board-local mm: the board, the wheel with its axle and encoder, the
   wheel's support and the middle click, the USB-C. Dark in both themes. (cx, cy) = the stage point of board (0, zc); s px
   per mm. o = { a, warm (0..1: the metal glows, too near the antenna), clip: [x, y, w, h] }. Returns M: (x, z) → stage */
function elc_board2d(cx, cy, s, zc, o = {}) {
  const M = (x, z) => [cx - x * s, cy - (z - zc) * s], a = o.a == null ? 1 : o.a;
  if (a <= 0.003) return M;
  const R = (x0, z0, x1, z1, r, fill, edge) => { const p = M(x1, z1), q = M(x0, z0); rr(Math.min(p[0], q[0]), Math.min(p[1], q[1]), Math.abs(q[0] - p[0]), Math.abs(q[1] - p[1]), r, fill, edge, 1.2, a); };
  G.save();
  if (o.clip) { G.beginPath(); G.rect(...o.clip); G.clip(); }
  G.globalAlpha = a;
  /* the board */
  G.beginPath(); ELC_OUTLINE.forEach(([x, z], i) => { const p = M(x, z); i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1]); }); G.closePath();
  const g = G.createLinearGradient(cx, cy - 26 * s, cx, cy + 26 * s); g.addColorStop(0, '#202227'); g.addColorStop(1, '#141519');
  G.fillStyle = g; G.fill(); G.strokeStyle = 'rgba(255,255,255,0.12)'; G.lineWidth = 1.5; G.stroke();
  /* stitching vias round the edge, faint */
  G.fillStyle = 'rgba(222,183,96,0.22)';
  for (let z = 15; z < 46; z += 2.4) for (const x of [-17.6, 17.6]) { if (z > 17 && z < 31) continue; const p = M(x, z); G.beginPath(); G.arc(p[0], p[1], 0.22 * s, 0, TAU); G.fill(); }
  G.restore();
  /* the USB-C at the nose: a steel shell */
  R(-4.47, 46.75, 4.47, 54.1, 0.6 * s, '#9CA1A8', 'rgba(0,0,0,0.3)');
  /* the wheel's support and the middle click, on the user's right */
  R(-8.9, 34.55, -4.1, 40.95, 0.4 * s, '#2B2D32', 'rgba(255,255,255,0.10)');
  R(-12.15, 36.3, -8.65, 39.2, 0.3 * s, '#1B1C20', 'rgba(255,255,255,0.12)'); R(-11.9, 36.55, -8.9, 38.95, 0.2 * s, '#8D9299', null);
  /* the encoder, on the user's left: the magnetic one (F27), seen from above through its clear top housing: the orange
     rotor, its detent star under the bronze leaf spring, the magnet on its end, the Hall sensor on its small board; the
     nickel-silver frame on the wheel side (3d/parts/scrollwheel.js) */
  const steel = mix('#A9AEB6', '#E5484D', 0.75 * (o.warm || 0));
  R(6.23, 36.1, 8.95, 39.4, 0.25 * s, '#D9813C', null);
  R(7.45, 35.2, 8.15, 40.3, 0.12 * s, '#17181B', null);
  R(7.4, 34.45, 8.2, 41.05, 0.1 * s, '#B98B4C', null);
  R(8.95, 36.25, 9.75, 39.25, 0.12 * s, mix('#C9CCD0', '#E5484D', 0.75 * (o.warm || 0)), null);
  R(10.9, 34.05, 11.4, 41.45, 0, '#0B0C0E', null); R(10.15, 36.25, 10.9, 39.25, 0.06 * s, '#202125', null);
  R(6.9, 32.25, 11.5, 43.25, 0.3 * s, 'rgba(206,222,236,0.16)', 'rgba(255,255,255,0.34)');
  R(6.65, 32.25, 6.95, 43.25, 0, steel, null); R(6.65, 31.95, 11.55, 32.3, 0, steel, null); R(6.65, 43.2, 11.55, 43.55, 0, steel, null);
  R(6.65, 34.15, 7.9, 35.75, 0.1 * s, steel, null); R(6.65, 38.35, 7.9, 39.65, 0.1 * s, steel, null);
  /* the axle, across: POM (#7), white */
  R(-8.3, 36.2, 11.15, 39.3, 1.4 * s, '#E4E2DC', 'rgba(0,0,0,0.3)');
  /* the wheel from above: bare magnesium (it is metal, so it warms with the rest), its diamond knurl across the tread (72 teeth,
     grooves at 30° each way over the 5.16 mm band, 3d/parts/scrollwheel.js; they crowd toward the ends as the tread turns away) */
  R(-3.5, 26.38, 3.5, 49.12, 3.2 * s, mix('#A4A9B0', '#E5484D', 0.75 * (o.warm || 0)), 'rgba(255,255,255,0.2)');
  G.save(); G.globalAlpha = a * 0.45; G.strokeStyle = 'rgba(16,18,22,0.6)'; G.lineWidth = 1;
  { const yK = 2.578, dl = yK * Math.tan(Math.PI / 6) / 11.37;
    for (let k = -14; k <= 14; k++) for (const sg of [1, -1]) {
      G.beginPath();
      for (let i = 0; i <= 6; i++) { const u = -1 + i / 3, th = k * TAU / 72 + sg * u * dl, p = M(u * yK, 37.75 + 11.37 * Math.sin(th)); if (i) G.lineTo(p[0], p[1]); else G.moveTo(p[0], p[1]); }
      G.stroke();
    } }
  G.restore();
  if ((o.warm || 0) > 0.01) for (const [x, z, r] of [[9, 37.75, 9], [0, 37.75, 7]]) { const p = M(x, z); warm(p[0], p[1], r * s, '#E5484D', 0.32 * o.warm * a); }
  return M;
}
/* ============================== chapter card ============================== */
S({
  id: 'eleccard', ch: 'elec', card: true, theme: 'night', title: 'Electronics', settle: 5, three: ['pcb'],
  draw: t => {
    chapterCard(t, { name: 'Electronics', gloss: 'The radio, the power, the one board and its wires, and what each one buys in latency and battery.', list: [[102, 'A pre-certified radio module (intended)'], [68, 'The antenna end turned away from the wheel'], [77, 'Radio and 8 khz USB in one chip'], ['sync', 'Each frame captured just before it is sent'], ['link', 'A spare copy of every report'], ['pmic', 'A PMIC: charger, rails and fuel gauge'], [92, 'One ' + THS.pcb + ' board, every part on top'], [69, 'Braided wires instead of ribbon cables'], [23, 'Software in a browser tab']] });
    const P = elc_v3('pcb', t, 990, 250, 780, 660, { view: [-0.62, 0.7, 0.5], view2d: 'top', yaw: 0.26 * Math.sin(t * 0.33), zoom: 1.7, target: elc_W(0, 23, 4), power: ep(t, 2.2, 3.0), powerMode: 'run', powerT: t }, { alpha: ep(t, 0.8, 1.7) });
    if (P) elc_waves(t, 2.8, P(elc_W(0, ELC.antZ, 1.0)), 0, { R: 250, spread: Math.PI, n: 4 });
  }
});


/* ============================== single-chip 8 khz (#77, #90) ============================== */
/** one path to the PC: a name, the chips in a box, a cable carrying reports at their real rate (rate in khz), the PC */
function elc_lane(t, t0, x, y, w, o) {
  const k = ep(t, t0, t0 + 0.5), col = o.col, bx = x + 220, bw = o.bw || 200, ex = bx + bw + 14, px = x + w - 70;
  if (k <= 0.003) return;
  if (o.hero) { const hw2 = heroTag(x, y - 6, 'Theseus', null, { a: k }); }
  else text(o.name, x, y - 6, { role: 'small', size: 25, weight: 700, color: C.ink, alpha: k, maxW: 200 });
  text(o.sub, x, y + 24, { role: 'label', size: 21, color: o.hero ? C.heroText : C.mute, alpha: k, maxW: 210 });
  elc_chipBox(t, t0 + 0.1, bx, y - 32, bw, 64, o.chips, col);
  const kc = ep(t, t0 + 0.3, t0 + 0.8);
  line(ex, y, ex + (px - 16 - ex) * kc, y, { color: col, w: o.hero ? 3.5 : 2.5, alpha: k });
  text(o.rate, (ex + px) / 2, y - 18, { font: 'mono', size: 24, weight: 700, color: o.hero ? C.heroText : C.ink, align: 'center', alpha: kc });
  text('PC', x + w, y + 8, { role: 'label', size: 22, color: C.ink, align: 'right', alpha: kc });
  /* the reports: one block per report, spaced by the rate, all moving at the same speed */
  if (kc > 0.98) {
    const sp = 24 * 8 / o.khz, L = px - 16 - ex, ph = (t * 150) % sp;
    G.save(); G.beginPath(); G.rect(ex, y - 14, L, 28); G.clip();
    for (let xx = ex - sp + ph; xx < ex + L; xx += sp) rr(xx, y - 9, 8, 18, 3, col, null, 1, k);
    G.restore();
  }
}
S({
  id: 'onechip', ch: 'elec', theme: 'paper', title: 'Single-chip 8 khz polling', settle: 10, ideas: [77, 90],
  src: ['nrf52', 'nrf54', 'nrf54usb', 'usbHs', 'exEloshapes', 'elcBrock'],
  draw: t => {
    header(t, 'Single-chip 8 khz polling');
    captions(t, [[0.6, 'An nRF52840 has full-speed USB: over a cable it sends 1,000 reports a second at most. For 8 khz, a mouse adds a second chip with high-speed USB.'], [5.2, 'The nRF54LM20A has high-speed USB built in. One chip runs the radio and 8 khz over the cable, with no second chip to buy, place or power (#77, #90).']]);
    const D = elc_census(), N = D.n, tot = D.total || 1;
    /* the left column: the headline, the chips before → after, the word */
    const lx = LM, lw = 600;
    elc_hl(t, 3.4, lx, 450, '8×', 'the wired rate', { label: 'From the radio chip alone', sub: '8,000 reports a second over the mouse\'s own cable, where an nRF52840 alone stops at 1,000.', subW: lw });
    elc_ba(t, 4.4, lx, 660, '2', '1', { label: 'Chips for 8 khz', unit: 'chip', net: 'No second high-speed USB chip', maxW: lw });
    glossBox(t, 5.4, lx, 760, lw, 'High-speed USB', 'Polled every 125 µs, eight times a millisecond. Full speed: once a millisecond at most.', { size: 24 });
    /* the right: three ways to a PC, the reports flowing at their real rates */
    const rx = 760, rw = RM - rx, ry = 280, rh = 360;
    demoWindow(rx, ry, rw, rh, tileA(t, 0.3, 0));
    cardHead(t, 0.5, rx, ry, rw, 'Reports over the cable, at their real rates (more is better)', ['datasheet']);
    const x0 = rx + 36, w0 = rw - 72;
    elc_lane(t, 0.9, x0, ry + 128, w0, { name: 'One nRF52840', sub: (N.nRF52840 || 0) + ' of ' + tot + ' mice', col: C.comp, khz: 1, rate: '1 khz', bw: 256, chips: [{ l: 'nRF52840', s: 'full-speed USB' }] });
    elc_lane(t, 1.7, x0, ry + 216, w0, { name: 'Two chips', sub: 'Most 8 khz mice', col: C.comp, khz: 8, rate: '8 khz', bw: 384, chips: [{ l: 'nRF52840', s: 'radio' }, { l: 'USB chip', s: 'high speed', dx: 180 }] });
    elc_lane(t, 2.5, x0, ry + 304, w0, { hero: true, sub: 'One chip', col: C.hero, khz: 8, rate: '8 khz', bw: 256, chips: [{ l: 'nRF54LM20A', s: 'radio and USB', sc: C.heroText, hi: true }] });
    /* the two chips, side by side: Theseus's wins in bold, the one spec it gives up kept honest */
    const ty = 680, th = 280;
    demoWindow(rx, ty, rw, th, tileA(t, 0.3, 1));
    const tcols = [{ key: 'k', label: '', w: 0.7 }, { key: 'a', label: 'nRF52840', w: 1 }, { key: 'b', label: 'Theseus: nRF54LM20A', w: 1.15, hero: true }];
    const tEnd = compareTable(t, {
      x: rx + 32, y: ty + 64, w: rw - 64, t0: 1.2, rowH: 34, cols: tcols,
      rows: [
        { cells: { k: 'USB', a: '12 Mbit/s, full speed', b: '480 Mbit/s, high speed' }, best: 'b' },
        { cells: { k: 'Processor', a: '64 MHz Cortex-M4F', b: '128 MHz Cortex-M33' }, best: 'b' },
        { cells: { k: 'Memory', a: '256 KB', b: '512 KB' }, best: 'b' },
        { cells: { k: 'Receive', a: '4.6 mA', b: '3.3 mA' }, best: 'b' }
      ]
    });
    /* the one row the new chip gives up, in plain type in both columns but the winner's: compareTable sets the hero column bold,
       so this row is a table of its own laid on the same columns (its head rule is the row's top rule), the hero rule run on */
    { const tt = ep(t, 1.2 + 0.4 + 4 * 0.1, 1.2 + 0.4 + 4 * 0.1 + 0.35), tw2 = rw - 64, bxs = rx + 32 + tw2 * 1.7 / 2.85;
      compareTable(t, { x: rx + 32, y: tEnd - 22, w: tw2, t0: 1.2 + 0.4, rowH: 34, cols: tcols.map(c => Object.assign({}, c, { label: '', hero: false })), rows: [{ cells: { k: 'Transmit', a: '4.8 mA', b: '5.0 mA' }, best: 'a' }] });
      rect(bxs, tEnd - 10, 2, 34, { fill: C.hero, alpha: 0.9 * tt }); }
    source(t, 'Nordic nRF52840 and nRF54LM20A specifications, currents at 0 dBm. USB 2.0 polling: 1 ms frames, 125 µs microframes. Mice: EloShapes.', { t0: 2 });
  }
});


/* ============================== the module: Raytac AN54LM-P20A, long antenna (#102, #77; Brock, 21:55) ============================== */
S({
  id: 'elc_module', ch: 'elec', theme: 'night', title: 'The Raytac radio module', settle: 10, ideas: [102, 77],
  src: ['elcRaytac', 'elcRaytacBlog', 'raytac', 'nrf54', 'elcBrock', 'elcLayout'],
  draw: t => {
    header(t, 'The Raytac radio module');
    captions(t, [[0.6, 'The nRF54LM20A goes on the board inside a Raytac AN54LM-P20A: the chip under a shield, its memory, and a long meander antenna in one 9.9 × 13.3 mm part.'], [5.2, 'Raytac lists nine certifications for it as intended. The mouse builds on the module\'s radio approvals instead of certifying a radio of its own (#102).']]);
    /* the part, big: black, the can, the long antenna; a light crosses the can, current runs the meander, radio leaves it */
    const x = LM, y = 280, w = 1040, h = 680, ka = tileA(t, 0.2, 0);
    demoWindow(x, y, w, h, ka);
    const s = 36, cx = x + w / 2 + 30, cy = y + h / 2 + 20, rot = -0.14 + 0.05 * ep(t, 0.4, 3.0, E.cam);
    const km = ep(t, 0.5, 1.4, E.snap), fl = ep(t, 2.8, 3.4);
    G.save(); G.translate(0, (1 - km) * 24);
    const pts = elc_module(cx, cy, s, rot, { a: km, t, flow: fl, sweep: prog(t, 1.4, 2.8) });
    G.restore();
    if (km > 0.98) {
      G.save(); G.beginPath(); G.rect(x, y, w, h); G.clip();
      elc_waves(t, 3.0, pts.ant, rot - Math.PI / 2, { R: 170, spread: 1.2, n: 4, color: C.hero, w: 2.5 });
      G.restore();
      const c = (lx, ly) => [cx + (lx * Math.cos(rot) - ly * Math.sin(rot)) * s, cy + (lx * Math.sin(rot) + ly * Math.cos(rot)) * s];
      dim(t, 1.6, c(-4.95, 6.65), c(4.95, 6.65), '9.9 mm', 14, { color: C.mute });
      dim(t, 1.8, c(4.95, 6.65), c(4.95, -6.65), '13.3 mm', 22, { color: C.mute });
      callout(t, 3.2, pts.ant, 'Long meander antenna', { to: [x + 290, y + 250], side: 'l', color: C.heroText, tcolor: C.ink, sub: 'A trace under the black mask', maxW: 230 });
      callout(t, 2.2, pts.can, 'Shield can', { to: [x + w - 250, y + 250], side: 'r', color: C.mute, tcolor: C.ink, sub: 'The nRF54LM20A inside', maxW: 210 });
      callout(t, 2.6, c(-4.95, 4.1), 'Castellated pads', { to: [x + 290, y + h - 150], side: 'l', color: C.mute, tcolor: C.ink, sub: 'Soldered flat to the one board', maxW: 230 });
    }
    /* the right column: the headline, the nine approvals as intended, the part in numbers */
    const rx = 1160, rw = RM - rx;
    elc_hl(t, 4.4, rx, 450, '9', 'regions', { label: 'Radio approvals, one part', sub: 'Raytac lists FCC, IC, CE, MIC, KC, SRRC, NCC, RCM and WPC for the module, as intended until the IDs are issued.', subW: rw });
    const certs = ['FCC', 'IC', 'CE', 'MIC', 'KC', 'SRRC', 'NCC', 'RCM', 'WPC'];
    let cxp = rx, cyp = 628;
    certs.forEach((c0, i) => {
      const k = ep(t, 5.0 + i * 0.1, 5.4 + i * 0.1, E.snap), wd = tw(c0, { role: 'label', size: 22 }) + 30;
      if (cxp + wd > RM) { cxp = rx; cyp += 52; }
      G.save(); G.globalAlpha = k; G.setLineDash([5, 4]); rrPath(cxp, cyp - 28, wd, 40, 6); G.strokeStyle = C.heroText; G.lineWidth = 2; G.stroke(); G.restore();
      text(c0, cxp + 15, cyp, { role: 'label', size: 22, color: C.ink, alpha: k });
      cxp += wd + 12;
    });
    text('Dashed: intended, not yet issued', rx, cyp + 46, { role: 'label', size: 20, color: C.faint, alpha: ep(t, 5.8, 6.2) });
    const sy = cyp + 80, sh = 960 - sy;
    demoWindow(rx, sy, rw, sh, tileA(t, 1.0, 1));
    elc_kv(t, 1.3, rx + 32, sy + 52, rw - 64, [['Chip', 'nRF54LM20A, 128 MHz'], ['Memory', '2 MB, 512 KB RAM: no flash chip'], ['USB', 'High speed, 480 Mbit/s'], ['Size', '9.9 × 13.3 × 2.0 mm']].slice(0, Math.max(2, Math.floor((sh - 30) / 42))), { kw: 150, rh: 42 });
    source(t, 'Raytac AN54LM-P20A product page: the long PCB antenna, 9.9 × 13.3 × 2.0 mm, est. Q4 2026. Drawing: the 3D part, a proposal.', { t0: 2 });
  }
});


/* ============================== the antenna end, turned away from the wheel (#68, #101; Brock, F9.13) ============================== */
S({
  id: 'antenna', ch: 'elec', theme: 'paper', title: 'Antenna turned away from the wheel', settle: 10, ideas: [68, 101],
  src: ['antDetune', 'elcLayout', 'elcBrock'],
  draw: t => {
    header(t, 'Antenna turned away from the wheel');
    captions(t, [[0.6, 'The wheel is magnesium and its encoder sits in a steel frame, and metal beside an antenna pulls it off its band. The antenna end sat right behind the wheel.'],
      [5.4, 'Turned 180°, the module keeps its place at the front of the board (#68), and its antenna end sits ' + fmtN(ELC.gap, 0) + ' mm from the axle. The brass inserts stay at the back (#101).']]);
    const x = LM, y = 280, w = 1080, h = 680, ka = tileA(t, 0.2, 0);
    demoWindow(x, y, w, h, ka);
    const s = 15, zc = 30.5, cx = x + w / 2 + 40, cy = y + h / 2 - 10, clip = [x, y, w, h];
    /* the turn: the pointer lifts the module, turns it 180° and sets it down */
    const kT = ep(t, 3.3, 5.0, E.io3), rot = Math.PI * kT, lift = env(t, 3.0, 3.3, 5.0, 5.3), landed = t >= 5.0;
    const zAnt = ELC.modZ + (ELC.antZ0 - ELC.modZ) * Math.cos(rot), warmK = ep(t, 1.6, 2.2) * (1 - ep(t, 4.4, 5.4));
    const M = elc_board2d(cx, cy, s, zc, { a: ep(t, 0.4, 1.2), warm: warmK, clip });
    G.save(); G.beginPath(); G.rect(...clip); G.clip();
    /* the keep-outs: copper-free under the antenna. The old one stays as a ghost once the module has turned */
    const kRect = (K, col, a, dash) => { const p = M(K[0], K[3]), q = M(K[2], K[1]); G.save(); G.globalAlpha = a; G.setLineDash(dash); G.strokeStyle = col; G.lineWidth = 2.2; G.strokeRect(Math.min(p[0], q[0]), p[1], Math.abs(q[0] - p[0]), q[1] - p[1]); G.restore(); };
    kRect(ELC.keep0, C.mute, ep(t, 1.0, 1.4) * (1 - 0.55 * ep(t, 3.3, 4.2)), [7, 6]);
    if (landed) { const kk = ep(t, 5.0, 5.5); kRect(ELC.keep, C.hero, kk, [8, 5]); const p = M(ELC.keep[2], ELC.keep[3]), q = M(ELC.keep[0], ELC.keep[1]); rect(p[0], p[1], q[0] - p[0], q[1] - p[1], { fill: C.heroSoft, alpha: kk }); }
    /* near field: rings leave the antenna end and fade with distance; before the turn they reach the metal */
    const pa = M(0, zAnt), kr = ep(t, 1.4, 2.0) * (1 - 0.7 * env(t, 3.0, 3.3, 5.0, 5.4));
    for (let i = 0; i < 5; i++) { const ph = ((t * 0.45 + i / 5) % 1), r = 14 + ph * 26 * s; circle(pa[0], pa[1], r, { color: C.hero, w: 2.2, alpha: kr * 0.55 * Math.pow(1 - ph, 1.6) }); }
    /* the module, on top while it turns */
    const pm = M(0, ELC.modZ);
    elc_module(pm[0], pm[1], s, rot, { a: ep(t, 0.8, 1.4), lift, t, mirror: true, flow: landed ? ep(t, 5.2, 5.8) : ep(t, 1.4, 2.0) * (1 - ep(t, 3.0, 3.2)), mark: false });
    G.restore();
    /* the distance, live: the antenna end's centre to the axle; the old span stays, struck, once the turn starts */
    const xd = 23.5, d = ELC.axleZ - zAnt, kd = ep(t, 1.8, 2.3);
    const vdim = (z0, z1, col, a, lab, struck) => {
      const p0 = M(xd, z0), p1 = M(xd, z1), q0 = M(6.8, z0), q1 = M(11.4, z1);
      line(q0[0], q0[1], p0[0] - 10, p0[1], { color: col, w: 1.2, dash: [3, 4], alpha: a }); line(q1[0], q1[1], p1[0] - 10, p1[1], { color: col, w: 1.2, dash: [3, 4], alpha: a });
      line(p0[0], p0[1], p1[0], p1[1], { color: col, w: 2, alpha: a });
      for (const p of [p0, p1]) line(p[0] - 7, p[1], p[0] + 7, p[1], { color: col, w: 2, alpha: a });
      const ly = (p0[1] + p1[1]) / 2 + 10, r = text(lab, p0[0] - 16, ly, { font: 'mono', size: 28, weight: 800, color: col, align: 'right', alpha: a });
      if (struck) line(p0[0] - 20 - r.w, ly - 10, p0[0] - 12, ly - 10, { color: C.mute, w: 2.5, alpha: a });
    };
    if (landed) vdim(ELC.antZ0, ELC.axleZ, C.faint, kd * ep(t, 5.0, 5.5), fmtN(ELC.gap0, 1) + ' mm', true);
    vdim(zAnt, ELC.axleZ, landed ? C.heroText : C.ink2, kd, fmtN(d, 1) + ' mm', false);
    /* the labels */
    const kl = ep(t, 1.2, 1.6);
    callout(t, 1.4, M(9.1, 32.1), 'The wheel\'s metal', { to: [x + 300, y + 92], side: 'l', color: warmK > 0.3 ? C.bad : C.mute, tcolor: C.ink, sub: 'A magnesium wheel, an encoder in a steel frame', maxW: 250 });
    if (landed) {
      callout(t, 5.2, M(-6.6, ELC.antZ), 'Antenna end', { to: [x + w - 200, y + h - 170], side: 'r', color: C.heroText, tcolor: C.ink, sub: 'In its keep-out: no copper under it', maxW: 180 });
    }
    text('Nose', x + w - 40, y + 50, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: kl });
    arrow(x + w - 64, y + 104, x + w - 64, y + 66, { color: C.mute, w: 2, hs: 9, alpha: kl });
    text('Top view', x + 28, y + h - 28, { role: 'label', size: 20, color: C.faint, alpha: kl });
    /* the pointer: in, take the module's corner, turn it, let go, out */
    if (t > 2.3) {
      const sc = s * (1 + 0.06 * lift), corner = r0 => [pm[0] + (-4.95 * Math.cos(r0) - 6.65 * Math.sin(r0)) * sc, pm[1] + (-4.95 * Math.sin(r0) + 6.65 * Math.cos(r0)) * sc];
      const c0 = corner(0), cEnd = corner(Math.PI), out = [x + w - 120, y + h - 40];
      const p = t < 3.0 ? kf(t, [[2.3, out], [3.0, c0]], E.cam) : t < 5.3 ? corner(rot) : kf(t, [[5.3, cEnd], [6.2, out]], E.cam);
      cursorPtr(p[0], p[1], { a: ep(t, 2.3, 2.6) * (1 - ep(t, 6.0, 6.3)), grab: t >= 3.0 && t < 5.3, press: t > 3.0 && t < 3.45 ? prog(t, 3.0, 3.45) : 0 });
    }
    /* the right column: by how much, before → after, and why distance */
    const rx = 1200, rw = RM - rx;
    elc_hl(t, 5.3, rx, 450, fmtN(ELC.gap / ELC.gap0, 1) + '×', 'further', { label: 'From the wheel\'s metal', sub: 'The antenna end\'s centre to the wheel\'s axle, in the 3D layout, with the module turned 180°.', subW: rw });
    elc_ba(t, 5.8, rx, 690, fmtN(ELC.gap0, 1), fmtN(ELC.gap, 1), { label: 'Antenna end to the axle', unit: 'mm', net: '+' + fmtN(ELC.gap - ELC.gap0, 1) + ' mm on the same board', maxW: rw });
    sourceBox(t, 6.4, rx, 800, rw, 'Antenova', 'Metal beside an antenna absorbs or reflects its energy and moves it off its band. Distance is the fix.', { size: 24 });
    source(t, 'Positions: the Theseus 3D layout, a proposal (module, keep-out, wheel, encoder). Detuning: Antenova.', { t0: 2 });
  }
});


/* ============================== frame sync: every report the same age (sync) ============================== */
S({
  id: 'framesync', ch: 'elec', theme: 'night', title: 'Frame sync: no jitter', settle: 10, ideas: ['sync'],
  src: ['kunai', 'xbabSensorLock', 'pcgFrameSync', 'razerFocus'],
  draw: t => {
    header(t, 'Frame sync: no jitter');
    captions(t, [[0.6, 'The sensor is a camera taking pictures of the pad. On its own clock a finished picture waits to be read, so the motion in each report is a different age.'], [4.4, 'Sync the camera to the polls and every report carries motion just seen, the same age every time. The XA25 gets each frame to USB in 42 µs on an older sensor, with better software; Theseus matches it.']]);
    const wx = LM, wy = 280, ww = RM - LM, wh = 400, A = C.hero;
    demoWindow(wx, wy, ww, wh, tileA(t, 0.2, 0));
    cardHead(t, 0.4, wx, wy, ww, 'Four 8 khz reports in 500 µs: how old is the motion in each? (younger and steadier is better)', ['derived']);
    const x0 = wx + 300, x1 = wx + ww - 60, X = us => x0 + (x1 - x0) * us / 500, now = clamp((t - 1.2) / 4.0) * 500;
    const polls = [125, 250, 375, 500], lanes = [{ y: wy + 176, name: 'Own clock', frames: [10, 93.3, 176.7, 260, 343.3, 426.7], col: C.bad }, { y: wy + 306, name: 'Synced to the polls', frames: [105, 230, 355, 480], col: A, hero: true }];
    for (const p of polls) { const k = ep(t, 1.0, 1.4); line(X(p), wy + 100, X(p), wy + 348, { color: C.ink2, w: 1.5, dash: [5, 4], alpha: k }); text('Poll', X(p), wy + 376, { role: 'label', size: 20, color: C.mute, align: 'center', alpha: k }); }
    lanes.forEach((L, li) => {
      const k = ep(t, 1.1 + li * 0.3, 1.5 + li * 0.3);
      if (L.hero) heroTag(wx + 32, L.y - 6, 'Theseus', null, { a: k });
      text(L.hero ? 'Synced to the polls' : 'Its own clock', wx + 32, L.y + (L.hero ? 24 : 8), { role: 'label', size: 21, color: L.col, alpha: k, maxW: 240 });
      line(X(0), L.y, X(500), L.y, { color: C.faint, w: 1.5, alpha: k });
      for (const f of L.frames) if (f <= now) { rect(X(f) - 3, L.y - 26, 6, 26, { fill: L.col }); circle(X(f), L.y - 30, 8, { fill: rgba(L.col, 0.25) }); }
      polls.forEach(p => { if (p > now) return; const used = L.frames.filter(f => f + 15 <= p).pop(), age = Math.round(p - used), yb = L.y + 20; line(X(used), yb, X(p), yb, { color: L.col, w: 2.5 }); line(X(used), yb - 5, X(used), yb + 5, { color: L.col, w: 2 }); line(X(p), yb - 5, X(p), yb + 5, { color: L.col, w: 2 }); text(age + ' µs', (X(used) + X(p)) / 2, yb + 28, { font: 'mono', size: 22, weight: 700, color: L.col, align: 'center' }); });
    });
    if (t > 6.4) {
      const pk = ep(t, 6.4, 6.9), ph = ((t - 6.4) % 3.2) / 3.2 * 530 - 15;
      line(X(ph), wy + 96, X(ph), wy + 350, { color: C.ink, w: 1.5, alpha: 0.3 * pk });
      lanes.forEach(L => { for (const f of L.frames) { const d = Math.abs(ph - f); if (d < 16) circle(X(f), L.y - 30, 8 + (16 - d) * 0.8, { fill: rgba(L.col, 0.4 * (1 - d / 16)), alpha: pk }); } });
    }
    /* the strip under it, at a glance (F14.10, F16.1). Brock (F22.2): Theseus's target is "Match SensorLock, 42 µs", frame to USB
       through its own firmware. The headline is before → after against the Viper V4 Pro's FrameSync (202 → 42 µs, Brock, F26.10) in Theseus's colour; the
       jitter before → after beside it; and the chart: both rivals grey, Theseus blue, SensorLock level with it, said plainly */
    const ages = lanes.map(L => polls.map(p => Math.round(p - L.frames.filter(f => f + 15 <= p).pop()))), jit = ages.map(g => Math.max(...g) - Math.min(...g));
    const FS = { razer: 202, lock: 42, ths: 42 };   /* Brock (F26.10): Viper V4 Pro 202 µs; XA25 with SensorLock 42 µs on a PAW3950 */
    elc_ba(t, 5.4, LM, 850, String(FS.razer), String(FS.ths), { size: 110, label: 'Frame to USB', unit: 'µs', who: ['Viper V4 Pro, FrameSync', 'Theseus'], net: '−' + (FS.razer - FS.ths) + ' µs, in my own firmware', maxW: 560 });
    elc_ba(t, 6.0, 700, 850, String(jit[0]), String(jit[1]), { size: 64, label: 'Jitter', unit: 'µs', who: ['Own clock', 'Synced'], net: 'Every report the same age', maxW: 440 });
    const tx = 1200, tw0 = RM - tx, ty = 720, th = 240;
    demoWindow(tx, ty, tw0, th, tileA(t, 0.4, 1));
    /* SensorLock and FrameSync are measured by SensorLock's developer: a claim (DESIGN 6); Theseus's figure is my target */
    cardHead(t, 0.6, tx, ty, tw0, 'Frame to USB, lower is better', ['claim'], { dy: 44 });
    const bx = tx + 272, bw2 = tw0 - 272 - 130, BX = us => bx + bw2 * us / 210;
    [['Viper V4 Pro', FS.razer, false], ['XA25 (PAW3950)', FS.lock, false], ['Theseus', FS.ths, true]].forEach(([l, v, hero], i) => {
      const yy = ty + 92 + i * 40, k = ep(t, 1.6 + i * 0.3, 2.4 + i * 0.3, E.snap), ka = ep(t, 1.4 + i * 0.2, 1.8 + i * 0.2);
      text(l, tx + 32, yy + 8, { role: 'small', size: 23, weight: hero ? 800 : 600, color: hero ? C.heroText : C.ink, alpha: ka });
      rr(bx, yy - 10, Math.max(20, (BX(v) - bx) * k), 20, 10, hero ? C.hero : C.comp, null, 1, ka);
      text(v + ' µs', bx + (BX(v) - bx) * k + 14, yy + 9, { font: 'mono', size: 23, weight: hero ? 800 : 700, color: hero ? C.heroText : C.ink2, alpha: k });
    });
    text('XA25: 42 µs on a weaker sensor. Theseus matches it.', tx + 32, ty + th - 22, { role: 'small', size: 22, weight: 600, color: C.ink2, alpha: ep(t, 2.8, 3.2), maxW: tw0 - 64 });
    source(t, 'Lanes: an illustration, 12,000 frames a second against 8,000 polls, 15 µs to process a frame; jitter = oldest − youngest. Frame to USB at 8 khz: Viper V4 Pro 202 µs and XA25 (PAW3950, SensorLock) 42 µs, per Brock; XBAB puts SensorLock 163 µs below FrameSync (2026-10-07).', { t0: 2 });
  }
});


/* ============================== Second Shot: a spare copy of each report (link) ============================== */
S({
  id: 'secondshot', ch: 'elec', theme: 'paper', title: 'Second Shot: a spare for each report', settle: 9, ideas: ['link'],
  src: ['kunai'], sfxLoop: [{ t0: 9.5, per: 5, cues: [[0.24, 'tick'], [0.28, 'tick']] }],
  draw: t => {
    header(t, 'Second Shot: a spare for each report');
    captions(t, [[0.6, '2.4 GHz is shared with headsets, phones and Wi-Fi, so some packets get lost. At 1 khz, one lost report costs up to a full millisecond.'], [3.6, 'Send a spare copy one radio slot early, on another channel, and a lost report is replaced on time.']]);
    /* the left column: by how much, before → after, the word */
    const lx = LM, lw = 600;
    elc_hl(t, 4.6, lx, 470, '99%', 'rescued', { size: 140, label: 'Lost reports, recovered at 4 khz', sub: 'Measured by Kunai\'s developer with a wireless headset in use nearby. The worst room, beside a headset\'s base station: about 92%.', subW: lw });
    elc_ba(t, 5.4, lx, 720, '0.67', '0.007', { size: 60, label: 'Reports lost, at the weakest signal tried', unit: '%', net: '15 of 220,017 stayed lost', maxW: lw });
    glossBox(t, 6.2, lx, 790, lw, 'Packet loss', 'A report the receiver never hears, because something else was using that channel.', { size: 24 });
    /* the right: eight radio slots of one 1 khz report, two channels; the report is lost, the spare lands on time */
    const wx = 740, wy = 280, ww = RM - wx, wh = 680;
    demoWindow(wx, wy, ww, wh, tileA(t, 0.2, 0));
    cardHead(t, 0.5, wx, wy, ww, 'One 1 khz report is eight 125 µs radio slots', ['claim']);
    const sx0 = wx + 250, sw = (ww - 290) / 8, ly = [wy + 210, wy + 330];
    ['Channel A: the report', 'Channel B: the spare'].forEach((l, i) => text(l, wx + 32, ly[i] + 8, { role: 'label', size: 21, color: i ? C.heroText : C.ink, alpha: ep(t, 1.0 + i * 0.2, 1.4 + i * 0.2), maxW: 200, lh: 1.15 }));
    for (let i = 0; i < 8; i++) { const k = ep(t, 1.2 + i * 0.05, 1.5 + i * 0.05); for (const y of ly) rr(sx0 + i * sw + 3, y - 28, sw - 6, 56, 6, inkA(0.04), inkA(0.16), 1.2, k); text(String(i + 1), sx0 + i * sw + sw / 2, ly[1] + 66, { role: 'label', size: 20, color: C.mute, align: 'center', alpha: k }); }
    const c9 = t >= 9.5 ? (t - 9.5) % 5 : -1, lostNow = c9 < 0 || Math.floor((t - 9.5) / 5) % 2 === 1, fo = c9 < 0 ? 1 : 1 - ep(c9, 4.4, 4.9);
    const kSpare = c9 < 0 ? ep(t, 2.0, 2.4) : ep(c9, 1.2, 1.4) * fo, kRep = c9 < 0 ? ep(t, 2.6, 3.0) : ep(c9, 1.4, 1.6) * fo, kLost = lostNow ? (c9 < 0 ? ep(t, 3.4, 3.7) : ep(c9, 1.9, 2.2) * fo) : 0, kSave = lostNow ? (c9 < 0 ? ep(t, 4.2, 4.6) : ep(c9, 2.5, 2.9) * fo) : 0;
    if (c9 >= 0) {
      const sl = clamp(Math.floor(c9 / 0.2), 0, 7), sk = ep(t, 9.5, 9.8) * (1 - ep(c9, 1.6, 1.9));
      for (const y of ly) rr(sx0 + sl * sw + 1, y - 30, sw - 2, 60, 7, null, inkA(0.55), 1.6, sk);
      if (!lostNow) text('Report arrives; the spare is dropped', sx0 + 8 * sw, ly[0] - 46, { role: 'label', size: 20, color: C.ink2, align: 'right', alpha: ep(c9, 1.9, 2.2) * fo });
    }
    rr(sx0 + 6 * sw + 8, ly[1] - 20, sw - 16, 40, 5, C.hero, null, 1, kSpare); text('Spare', sx0 + 6.5 * sw, ly[1] + 8, { role: 'label', size: 20, color: C.onHero, align: 'center', alpha: kSpare });
    rr(sx0 + 7 * sw + 8, ly[0] - 20, sw - 16, 40, 5, C.comp, null, 1, kRep * (1 - 0.6 * kLost)); text('Report', sx0 + 7.5 * sw, ly[0] + 8, { role: 'label', size: 20, color: '#111', align: 'center', alpha: kRep });
    if (kLost > 0) { const cx = sx0 + 7.5 * sw, cy = ly[0]; line(cx - 24, cy - 24, cx + 24, cy + 24, { color: C.bad, w: 4, alpha: kLost }); line(cx + 24, cy - 24, cx - 24, cy + 24, { color: C.bad, w: 4, alpha: kLost }); text('Lost', cx, cy - 40, { role: 'label', size: 21, color: C.bad, align: 'center', alpha: kLost }); }
    if (kSave > 0) { arrow(sx0 + 7 * sw - 4, ly[1], sx0 + 8 * sw + 10, ly[1], { color: C.heroText, w: 3, hs: 10, alpha: kSave }); text('The PC gets the spare, on time', sx0 + 8 * sw, ly[1] + 104, { role: 'label', size: 21, color: C.heroText, align: 'right', alpha: kSave }); }
    /* what it costs, before → after: a lost report at 1 khz */
    const by = wy + 500;
    rule(wx + 32, by - 34, wx + ww - 32, ep(t, 4.8, 5.2));
    text('A lost report at 1 khz', wx + 32, by + 8, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 5.0, 5.4) });
    const kb = ep(t, 5.2, 5.7);
    text('up to 1 ms late', wx + 330, by + 10, { role: 'small', size: 28, weight: 700, color: C.faint, alpha: kb });
    line(wx + 326, by - 1, wx + 334 + tw('up to 1 ms late', { role: 'small', size: 28, weight: 700 }), by - 1, { color: C.mute, w: 2.5, alpha: kb });
    text('→', wx + 580, by + 8, { font: 'disp', size: 30, weight: 700, color: C.faint, alpha: kb });
    text('on time, about 200 µs older', wx + 630, by + 10, { role: 'small', size: 28, weight: 800, color: C.heroText, alpha: ep(t, 5.6, 6.1) });
    text('At 8 khz every report carries the full running count, so a lost packet\'s motion still arrives 125 µs later, inside the next report.', wx + 32, by + 80, { role: 'small', size: 24, color: C.ink2, maxW: ww - 64, lh: 1.32, t, t0: 6.4, cps: 120 });
    source(t, 'Kunai tester guide, firmware 96.79, pre-production (supplied by Brock). No maker publishes packet loss yet; Theseus will.', { t0: 2 });
  }
});


/* ============================== battery life against polling rate (battery, sync) ============================== */
S({
  id: 'power', ch: 'elec', theme: 'night', title: 'Battery life against polling rate', settle: 10, ideas: ['battery', 'sync'],
  src: ['razerBatt', 'nbcV4', 'exNbcV4', 'elcTpuV4', 'paw3395', 'elcEemb', 'ntrEemb', 'b01Optical', 'v6Gpx2Rates'],
  draw: t => {
    const B = elc_cell();
    header(t, 'Battery life against polling rate');
    captions(t, [[0.6, 'Every report costs current. Razer\'s Viper V3 Pro runs 95 hours at 1 khz and 17 at 8 khz; the V4 Pro, with Razer\'s FrameSync and new chips, claims 180 h, and runs about 40 at 8 khz.'], [5.4, 'Theseus plans ' + THS.hours + ' at 1 khz on a ' + B.mAh + ' mAh battery, the V4 Pro\'s size: its draw without the V4 Pro\'s two optical switches, before any firmware gains.']]);
    /* the bars: three mice at two rates, Theseus tallest at both */
    const x = LM, y = 280, w = 1000, h = 680;
    demoWindow(x, y, w, h, tileA(t, 0.2, 0));
    cardHead(t, 0.4, x, y, w, 'Battery life in hours (higher is better)', ['claim', { ev: 'measured', by: 'TechPowerUp' }, 'derived']);
    const base = y + 560, sc = 2.05, bw = 112;
    /* one figure per mouse, deck-wide: the V4 Pro at 8 khz is TechPowerUp's 40 h, the draw Theseus's own 8 khz hours come from */
    const mice = [['Viper V3 Pro', [95, 17], C.comp, 'No sync'], ['Viper V4 Pro', [180, 40], C.ref, 'Razer\'s FrameSync'], ['Theseus', [THESEUS.hours, Math.floor(B.h8 + 1e-9)], C.hero, 'The plan']];
    line(x + 40, base, x + w - 40, base, { color: C.faint, w: 1.5, alpha: ep(t, 0.9, 1.3) });
    ['1 khz', '8 khz'].forEach((g, gi) => {
      const gx = x + 110 + gi * 450;
      text(g, gx + 1.5 * bw + 28, base + 80, { role: 'label', size: 22, color: C.ink, align: 'center', alpha: ep(t, 1.0, 1.4) });
      mice.forEach(([nm, hv, col, q], j) => {
        const bx = gx + j * (bw + 28), v = hv[gi], k = ep(t, 1.3 + gi * 0.9 + j * 0.25, 2.1 + gi * 0.9 + j * 0.25, E.snap), bh = v * sc * k, hero = col === C.hero;
        rr(bx, base - bh, bw, Math.max(1, bh), 6, col, null, 1, ep(t, 1.2, 1.5));
        text(countUp(v + ' h', k) || v + ' h', bx + bw / 2, base - bh - 16, { font: 'mono', size: hero ? 30 : 26, weight: 800, color: hero ? C.heroText : C.ink, align: 'center', alpha: k });
        text(hero ? 'Theseus' : nm.replace('Viper ', ''), bx + bw / 2, base + 34, { role: 'label', size: 20, color: hero ? C.heroText : C.ink2, align: 'center', alpha: ep(t, 1.1, 1.5) });
      });
    });
    const kt = ep(t, 3.4, 3.8);
    text('8 khz takes about four-fifths of every mouse\'s hours', x + 560, y + 250, { role: 'small', size: 24, weight: 600, color: C.ink2, maxW: 400, lh: 1.3, alpha: kt });
    text('No hours published: Starlight X, ULX, Sora V2, Beast X, X2 CrazyLight', x + 560, y + 340, { role: 'small', size: 22, weight: 600, color: C.bad, alpha: ep(t, 4.0, 4.4), maxW: 400, lh: 1.3 });
    /* the right column: by how much, before → after, why */
    const rx = 1120, rw = RM - rx;
    elc_hl(t, 4.2, rx, 430, String(THESEUS.hours), 'hours', { label: 'At 1 khz, the plan', sub: B.mAh + ' mAh, ' + fmtN(B.wh, 2) + ' Wh at the Viper V4 Pro\'s ' + fmtN(B.w1 * 1000, 1) + ' mW less its optical switches, ' + fmtN(B.w1 * B.keep * 1000, 1) + ' mW: ' + fmtN(Math.floor(B.h1), 0) + ' h. At 8 khz, ' + fmtN(Math.floor(B.h8), 0) + ' h.', subW: rw });
    elc_ba(t, 5.0, rx, 660, '180', String(THESEUS.hours), { label: 'The longest listed, then Theseus', unit: 'h', net: '+' + Math.floor(100 * (THESEUS.hours - 180) / 180 + 1e-9) + ' % over the Viper V4 Pro, on a battery its size', maxW: rw });
    /* V6: the 8 khz hours' basis, said (V4's open point): the switches kept at their 1 khz share of the V4 Pro's draw, which
       needs them to cost 1.05 mA at 8 khz; Logitech's own hours have that cost climbing with the rate, not fixed (V6_OPT,
       30-b14-move6.js). Replaces a frame-sync note that belonged to b09_sync */
    if (typeof V6_OPT !== 'undefined') { const O = V6_OPT, r = O.rows;
      sourceBox(t, 5.8, rx, 724, rw, 'Optical switches cost more at 8 khz', 'Logitech’s own hours: two draw ' + v6_mA(r[0].mA) + ' mA at 1 khz, ' + v6_mA(r[1].mA) + ' at 2 khz, ' + v6_mA(r[2].mA) + ' at 4 khz. The ' + Math.floor(B.h8 + 1e-9) + ' h at 8 khz takes the V4 Pro’s at ' + (Math.ceil(O.need8 * 100 - 1e-9) / 100).toFixed(2) + ' mA, their 1 khz share.', { kind: 'derived', size: 22 }); }
    source(t, 'Hours: Razer\'s claims, the V4 Pro at 8 khz TechPowerUp\'s. Theseus, derived: ' + B.maker + '\'s ' + B.mAh + ' mAh at the V4 Pro\'s draw less its optical switches (' + b01_optPct() + ', at 1 and 8 khz; Logitech\'s hours at 1, 2 and 4 khz), before any firmware gains.', { t0: 2 });
  }
});



/* ============================== the PMIC: one chip runs the power (pmic) ============================== */
/** one block of the PMIC diagram */
function elc_blk(x, y, w, h, label, sub, on, a, col) {
  rr(x, y, w, h, 6, on > 0.01 ? rgba(col, (TH ? 0.16 : 0.2) * on) : null, on > 0.5 ? col : inkA(0.28), 1.6, a);
  if (on > 0.01) rr(x, y, w, h, 6, null, col, 1.8, a * on);
  text(label, x + 12, y + (sub ? 22 : h / 2 + 8), { role: 'label', size: 20, color: C.ink, alpha: a });
  if (sub) text(sub, x + 12, y + 43, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: a, sentence: false });
}
S({
  id: 'elc_pmic', ch: 'elec', theme: 'paper', title: 'PMIC: one chip runs the power', settle: 10, ideas: ['pmic'], three: ['pcb'],
  src: ['elcNpm', 'elcNpmChg', 'elcGauge', 'elcLayout', 'npm1300'],
  draw: t => {
    header(t, 'PMIC: one chip runs the power');
    captions(t, [[0.6, 'The nPM1300 takes USB in, charges the battery, powers the radio and the sensor, and counts every charge in and out.'], [5.6, 'Unplugged, the current runs the other way: battery, power chip, two small regulators, then the radio module and the sensor.']]);
    const A = C.hero, run = t >= 6.0, ph = ep(t, 5.4, 6.8, E.cam);
    /* the left column: before → after as the headline, and inside the chip */
    const lx = LM, lw = 640;
    elc_ba(t, 3.6, lx, 440, '6', '1', { size: 130, label: 'Power parts, then the nPM1300', unit: 'chip', net: 'Charger, regulators, battery gauge and watchdog in one 5 × 5 mm chip', maxW: lw });
    const ry = 560, rh = 400, kD = tileA(t, 0.4, 0);
    demoWindow(lx, ry, lw, rh, kD);
    cardHead(t, 0.6, lx, ry, lw, 'Inside the nPM1300', ['datasheet'], { dy: 44 });
    const fx = lx + 200, fw = 240, bh = 48, gy = ry + 84, by = i => gy + 10 + i * 58;
    const chg = run ? 0 : ep(t, 1.4, 1.9), rn = run ? ep(t, 6.2, 6.8) : 0, gau = Math.max(chg, rn), col = run ? ELC.run : ELC.chg;
    rr(fx - 10, gy - 4, fw + 20, 5 * 58 + 18, 8, null, A, 2, kD);
    const blocks = [['Charger', '32–800 mA', chg], ['Regulator 1', '200 mA, radio', rn], ['Regulator 2', '200 mA, sensor', rn], ['Battery gauge', 'charge, health', gau], ['Watchdog', 'off: 370 nA', 0]];
    blocks.forEach(([l, s, on], i) => elc_blk(fx, by(i), fw, bh, l, s, on, ep(t, 1.0 + i * 0.12, 1.4 + i * 0.12), col));
    elc_blk(lx + 24, by(0), 130, bh, 'USB-C', '4.0–5.5 V', chg, ep(t, 1.2, 1.6), col);
    elc_blk(lx + 24, by(2), 130, bh, 'Battery', '3.7 V', Math.max(chg, rn), ep(t, 1.2, 1.6), col);
    [['Radio', 'module', 1, rn], ['Sensor', 'own supply', 2, rn], ['Main chip', 'reads it', 3, gau]].forEach(([l, s, row, on]) => elc_blk(lx + lw - 24 - 130, by(row), 130, bh, l, s, on, ep(t, 1.4, 1.8), col));
    const L = lx + 154, R0 = fx, R1 = fx + fw, Ro = lx + lw - 154, mid = i => by(i) + bh / 2;
    const wires = [[[L, mid(0)], [R0, mid(0)], chg], [[R0, mid(0) + 14], [L, mid(2) - 14], chg], [[L, mid(2) - 6], [R0, mid(1)], rn], [[L, mid(2)], [R0, mid(2)], rn], [[R1, mid(1)], [Ro, mid(1)], rn], [[R1, mid(2)], [Ro, mid(2)], rn], [[L, mid(2) + 8], [R0, mid(3)], gau], [[R1, mid(3)], [Ro, mid(3)], gau]];
    wires.forEach(([a0, b0, on]) => {
      line(a0[0], a0[1], b0[0], b0[1], { color: on > 0.01 ? col : inkA(0.25), w: on > 0.01 ? 2.5 : 1.5, alpha: kD });
      if (on > 0.05) for (let i = 0; i < 3; i++) { const p = ((t * 0.9 + i / 3) % 1); circle(lerp(a0[0], b0[0], p), lerp(a0[1], b0[1], p), 4, { fill: col, alpha: on }); }
    });
    /* the right: the one board, the current moving through it, plugged in and then on the cell */
    const x = 760, y = 280, w = RM - x, h = 680;
    demoWindow(x, y, w, h, tileA(t, 0.2, 1));
    const pw = run ? ep(t, 6.0, 6.6) : ep(t, 1.2, 1.8) * (1 - ep(t, 5.4, 5.9));
    const P = elc_v3('pcb', t, x + 2, y + 2, w - 4, h - 4, { view: ELC.top, target: elc_W(lerp(0, -7.5, ph), lerp(24, 11.5, ph), 1), zoom: lerp(1.55, 3.0, ph), power: pw, powerMode: run ? 'run' : 'charge', powerT: t });
    const k1 = ep(t, 1.6, 2.0) * (1 - ep(t, 5.2, 5.6)), k2 = ep(t, 6.8, 7.2);
    elc_key(x + 36, y + 54, ELC.chg, 'Plugged in', ep(t, 1.4, 1.8) * (1 - ep(t, 5.2, 5.6)), { sub: 'USB-C, power chip, battery' });
    elc_key(x + w - 270, y + 54, ELC.run, 'On battery', ep(t, 6.2, 6.6), { sub: 'Battery, power chip, radio and sensor', maxW: 250 });
    if (P) {
      if (k1 > 0) {
        callout(t, 1.8, P(elc_W(0, 50.4, 2.5)), 'USB-C in', { to: [x + 210, y + 190], side: 'l', color: ELC.chg, alpha: k1 });
        callout(t, 2.6, P(elc_W(-9.6, 11.2, 0.9)), 'nPM1300', { to: [x + w - 230, y + 300], side: 'r', color: ELC.chg, alpha: k1, sub: 'The power chip' });
        callout(t, 3.4, P(elc_W(-14, 3.2, 1.5)), 'The battery', { to: [x + w - 230, y + 470], side: 'r', color: ELC.chg, alpha: k1, sub: 'On its own plug' });
      }
      if (k2 > 0) {
        /* on the right, in the clear margin; the two on the left sit on the black board, so their words are light */
        const onBoard = '#F3F2EE';
        callout(t, 6.9, P(elc_W(-9.6, 11.2, 0.9)), 'nPM1300', { to: [x + w - 250, y + 220], side: 'r', color: A, alpha: k2, sub: '5 × 5 mm' });
        callout(t, 7.3, P(elc_W(-14.35, 10.7, 1.0)), 'Regulator coils', { to: [x + w - 250, y + 350], side: 'r', color: A, alpha: k2, sub: 'One per regulator' });
        callout(t, 7.7, P(elc_W(1.5, 18, 2.0)), 'Radio module', { to: [x + 220, y + 150], side: 'l', color: A, alpha: k2, tcolor: onBoard });
        callout(t, 8.1, P(elc_W(1.5, 4.0, 2.0)), 'Sensor', { to: [x + 272, y + 440], side: 'l', color: A, alpha: k2, tcolor: onBoard });
      }
    }
    source(t, 'Nordic nPM1300 product page and specification. The board, its parts and current paths: the Theseus 3D layout, a proposal.', { t0: 2 });
  }
});


/* ============================== fast charging at the cell's rated 1C ============================== */
const ELC_OCV = [[0, 3.0], [0.05, 3.45], [0.1, 3.6], [0.2, 3.68], [0.3, 3.73], [0.4, 3.77], [0.5, 3.81], [0.6, 3.86], [0.7, 3.93], [0.8, 4.0], [0.9, 4.08], [1.0, 4.2]];
function elc_ocv(s) { const P = ELC_OCV; if (s <= 0) return P[0][1]; for (let i = 1; i < P.length; i++) if (s <= P[i][0]) return lerp(P[i - 1][1], P[i][1], (s - P[i - 1][0]) / (P[i][0] - P[i - 1][0])); return P[P.length - 1][1]; }
/** a CC/CV charge in C-rate units: c (C) until the terminal voltage reaches 4.2 V, then 4.2 V until the current falls to 10%
   (the nPM1300 default). rq: series resistance × capacity (V per C), a typical value. returns { pts: [[min, soc]], cc, end, t80 } */
function elc_ccv(c, s0 = 0.1, rq = 0.21) {
  const pts = []; let s = s0, tm = 0, cc = null, t80 = null; const dt = 0.25;
  for (let i = 0; i < 4000; i++) {
    let I = c;
    if (!cc && elc_ocv(s) + c * rq >= 4.2) cc = [tm, s];
    if (cc) I = Math.max(0, (4.2 - elc_ocv(s)) / rq);
    pts.push([tm, s]); if (t80 == null && s >= 0.8) t80 = tm;
    if (cc && I <= 0.1 * c) break;
    s = Math.min(1, s + I * dt / 60); tm += dt;
  }
  return { pts, cc, end: pts[pts.length - 1], t80 };
}
const ELC_CHG = { fast: null, slow: null };
S({
  id: 'elc_charge', ch: 'elec', theme: 'night', title: 'Fast charging at the battery\'s 1C', settle: 10, ideas: ['pmic', 'battery'],
  src: ['elcTpuV4', 'tpuUlx', 'tpuX2h', 'elcNpm', 'elcNpmChg', 'elcLp4025', 'exBu409'],
  draw: t => {
    const B = elc_cell();
    header(t, 'Fast charging at the battery\'s 1C');
    captions(t, [[0.6, 'The flagships charge at 0.13 to 0.28 A. The nPM1300 can push 0.8 A, so the charger is not the limit: the battery\'s datasheet is.'], [5.0, 'Theseus\'s battery is rated for 1C: ' + B.mAh + ' mA, for the ' + B.mAh + ' mAh it is counted at. Against the Viper V4 Pro\'s 0.55C, the charge to 80% takes a little over half as long.']]);
    if (!ELC_CHG.fast) { ELC_CHG.fast = elc_ccv(1.0); ELC_CHG.slow = elc_ccv(0.55); }
    const F = ELC_CHG.fast, Sl = ELC_CHG.slow;
    /* one charge, two rates: the model, big */
    const x = LM, y = 280, w = 1000, h = 380;
    demoWindow(x, y, w, h, tileA(t, 0.2, 0));
    cardHead(t, 0.4, x, y, w, 'One charge from 10%, modelled (the sooner it is full, the better)', ['derived'], { dy: 46 });
    const m = axes(t, { x: x + 120, y: y + 96, w: w - 180, h: 210, t0: 0.8, xr: [0, 120], yr: [0, 100], xticks: [0, 30, 60, 90, 120], yticks: [0, 50, 100], xfmt: v => v + ' min', yfmt: v => v + '%' });
    const kS = ep(t, 1.2, 2.8, E.io3), kF = ep(t, 1.6, 3.2, E.io3);
    series(m, Sl.pts.map(p => [p[0], p[1] * 100]), { color: C.ref, w: 3.5, p: kS });
    series(m, F.pts.map(p => [p[0], p[1] * 100]), { color: C.hero, w: 5, p: kF });
    const kd = ep(t, 3.4, 3.8);
    line(m.X(0), m.Y(80), m.X(120), m.Y(80), { color: C.hair, w: 1.5, dash: [5, 5], alpha: kd });
    heroMark(m.X(F.t80), m.Y(80), 9, kd); circle(m.X(Sl.t80), m.Y(80), 7, { fill: C.ref, alpha: kd });
    text('Theseus, 1C', m.X(F.t80) - 14, m.Y(80) - 16, { role: 'label', size: 20, color: C.heroText, align: 'right', alpha: kd });
    text('Viper V4 Pro, 0.55C', m.X(Sl.t80) + 14, m.Y(80) + 34, { role: 'label', size: 20, color: C.secondText, alpha: kd });
    /* the currents: measured flagships, the cell's rating, the charger's ceiling */
    const cy0 = 700, ch = 260;
    demoWindow(x, cy0, w, ch, tileA(t, 0.3, 1));
    cardHead(t, 0.6, x, cy0, w, 'Charge current, amps (higher is faster)', ['measured', 'datasheet'], { dy: 44 });
    const x0 = x + 300, xw = w - 300 - 150, X = v => x0 + xw * v / 0.85;
    const rows = [['Finalmouse ULX', 0.131, 0.131, C.comp], ['Viper V4 Pro', 0.169, 0.169, C.ref], ['Pulsar X2H', 0.27, 0.28, C.comp], ['Theseus, 1C', B.mAh / 1000, B.mAh / 1000, C.hero]];
    rows.forEach(([nm, lo, hi, col], i) => {
      const yy = cy0 + 96 + i * 40, k = ep(t, 1.0 + i * 0.2, 1.8 + i * 0.2, E.snap), hero = col === C.hero;
      text(nm, x + 32, yy + 8, { role: 'small', size: 23, weight: hero ? 800 : 600, color: hero ? C.heroText : C.ink, alpha: ep(t, 0.9 + i * 0.2, 1.3 + i * 0.2) });
      rr(x0, yy - 9, Math.max(18, (X(hi) - x0) * k), 18, 9, col, null, 1, ep(t, 0.9, 1.2));
      text((hi > lo ? lo.toFixed(2) + '–' + hi.toFixed(2) : hi.toFixed(hero ? 2 : 3).replace(/0$/, '')) + ' A', x0 + (X(hi) - x0) * k + 12, yy + 8, { font: 'mono', size: 23, weight: 800, color: hero ? C.heroText : C.ink, alpha: k });
    });
    const kc = ep(t, 2.6, 3.0);
    line(X(0.8), cy0 + 74, X(0.8), cy0 + 226, { color: C.mute, w: 2, dash: [5, 4], alpha: kc });
    text('nPM1300: 0.8 A', X(0.8) - 10, cy0 + 236, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: kc });
    /* the right column: by how much, before → after, the word */
    const rx = 1120, rw = RM - rx;
    elc_hl(t, 4.0, rx, 430, fmtN(Sl.t80 / F.t80, 1) + '×', 'faster', { label: 'To 80%, at the battery\'s rated 1C', sub: B.maker + ' rates the ' + B.part + ' for a 1C charge (320 mA on its typical 320 mAh). The Viper V4 Pro charges at 0.169 A, 0.55C of its 306 mAh.', subW: rw });
    elc_ba(t, 4.8, rx, 660, fmtN(Sl.t80, 0), fmtN(F.t80, 0), { label: 'From 10 to 80%, minutes', unit: 'min', net: '−' + fmtN(Sl.t80 - F.t80, 0) + ' min; full in ' + fmtN(F.end[0], 0) + ' instead of ' + fmtN(Sl.end[0], 0), maxW: rw });
    glossBox(t, 5.6, rx, 760, rw, 'C-rate', 'Charge current divided by capacity. 1C on a ' + B.mAh + ' mAh battery is ' + B.mAh + ' mA.', { size: 24 });
    source(t, 'Currents: TechPowerUp. 0.55C = 0.169 A ÷ 0.306 Ah. EEMB LP402535 specification: 320 mA (1.0C) maximum charge. Curves: a CC/CV model, 4.2 V, stop at 10% current, rq 0.21 V/C.', { t0: 2 });
  }
});


/* ============================== a safer battery: the cell's own window, the die, the input, ship mode ============================== */
S({
  id: 'elc_safe', ch: 'elec', theme: 'paper', title: 'A safer battery: four guards', settle: 10, ideas: ['pmic', 'battery'], three: ['battery'],
  src: ['elcNpmJeita', 'elcNpmChg', 'elcNpm', 'elcEemb', 'elcBu802'],
  draw: t => {
    const B = elc_cell();
    header(t, 'A safer battery: four guards');
    /* V6: neither pack (EEMB's LP402535, Jauch's LP402535JU) lists a temperature sensor: both are two-wire packs (batteries.json).
       The slide said the PMIC reads "the battery's own" sensor and drew an "NTC lead" as its third wire; now the sensor is a
       thermistor on the board against the pack, said as a proposal */
    captions(t, [[0.6, 'The PMIC reads the battery\'s warmth from a sensor on the board beside it: the pack has two wires and no sensor of its own. Its default charges from 0 to 60 °C; I set it to the battery\'s datasheet: ' + B.tLo + ' to ' + B.tHi + ' °C.'], [5.6, 'It also stops charging if its own die runs hot, is protected to 22 V at the input, and draws 370 nA when the switch is off.']]);
    /* the window, full width: current against the cell's temperature; a thermometer sweeps it */
    const x = LM, y = 280, w = RM - LM, h = 420, A = C.hero;
    demoWindow(x, y, w, h, tileA(t, 0.2, 0));
    cardHead(t, 0.4, x, y, w, 'Charge current against the battery\'s temperature (none outside the battery\'s window)', ['datasheet']);
    const m = axes(t, { x: x + 150, y: y + 120, w: w - 230, h: 210, t0: 0.8, xr: [-10, 70], yr: [0, 110], xticks: [-10, 0, 10, 20, 30, 40, 50, 60, 70], yticks: [0, 50, 100], xfmt: v => v + ' °C', yfmt: v => v + '%' });
    const kw = ep(t, 1.2, 2.4, E.cam), lo = lerp(0, B.tLo, kw), hi = lerp(60, B.tHi, kw);
    /* the default window, dashed, and the cell's, filled: before → after */
    const kd = ep(t, 1.0, 1.4);
    G.save(); G.globalAlpha = kd * 0.9; G.setLineDash([7, 6]); G.strokeStyle = C.mute; G.lineWidth = 2; G.strokeRect(m.X(0), m.Y(100), m.X(60) - m.X(0), m.Y(0) - m.Y(100)); G.restore();
    text('nPM1300 default: 0 to 60 °C', m.X(60) - 12, m.Y(100) - 14, { role: 'label', size: 20, color: C.mute, align: 'right', alpha: kd * (1 - 0.4 * kw) });
    rect(m.X(lo), m.Y(100), m.X(hi) - m.X(lo), m.Y(0) - m.Y(100), { fill: C.heroSoft, alpha: ep(t, 1.4, 1.8) });
    for (const [a0, b0] of [[-10, lo], [hi, 70]]) rect(m.X(a0), m.Y(100), m.X(b0) - m.X(a0), m.Y(0) - m.Y(100), { fill: rgba(C.bad, 0.12), alpha: kw });
    const curve = [[-10, 0], [lo, 0], [lo, 100], [hi, 100], [hi, 0], [70, 0]].map(([a0, b0]) => [m.X(a0), m.Y(b0)]);
    poly(curve, { color: A, w: 4, p: ep(t, 1.6, 3.0, E.io3) });
    text('The battery\'s datasheet: ' + B.tLo + ' to ' + B.tHi + ' °C', (m.X(B.tLo) + m.X(B.tHi)) / 2, m.Y(100) + 40, { role: 'label', size: 21, color: C.heroText, align: 'center', alpha: ep(t, 2.4, 2.8) });
    /* the sweep: too cold (below the battery's floor: EEMB's is 0 °C, so -5), warm, near the top, too hot */
    const cold = Math.min(4, B.tLo - 5), Tc = kf(((t - 3.2) % 9 + 9) % 9, [[0, 24], [1.6, cold], [2.6, cold], [4.0, 12], [4.8, 12], [6.2, 42], [7.0, 42], [7.8, 52], [8.4, 52], [9, 24]]);
    const cur = Tc < B.tLo || Tc > B.tHi ? 0 : 100, kt = ep(t, 3.2, 3.6);
    if (kt > 0) {
      const px = m.X(Tc);
      line(px, m.Y(110), px, m.Y(0), { color: C.ink, w: 1.5, dash: [4, 4], alpha: kt * 0.8 });
      circle(px, m.Y(cur), 10, { fill: cur ? A : C.bad, alpha: kt }); circle(px, m.Y(cur), 18, { color: cur ? A : C.bad, w: 2, alpha: kt * 0.5 });
      const lab = Math.round(Tc) + ' °C   ' + (cur ? B.mAh + ' mA' : 'no charge'), lw2 = tw(lab, { font: 'mono', size: 24, weight: 700 }) + 28, lx = clamp(px - lw2 / 2, x + 32, x + w - 32 - lw2);
      rr(lx, y + h - 66, lw2, 44, 6, rgba(cur ? A : C.bad, 0.16), cur ? A : C.bad, 1.5, kt);
      text(lab, lx + 14, y + h - 36, { font: 'mono', size: 24, weight: 700, color: C.ink, alpha: kt });
    }
    /* the strip: the headline, two quiet guards, and the pack's two wires (no sensor of its own) */
    elc_hl(t, 4.4, LM, 860, '4', 'guards', { size: 120, label: 'Charging that watches itself', sub: 'Battery and die temperature, the input voltage and a watchdog.', subW: 540 });
    const ty = 740, th = 220, a1 = tileA(t, 5.0, 0), a2 = tileA(t, 5.0, 1);
    statTile(t, 5.0, [640, ty, 360, th], { value: '22', unit: 'V', label: 'Input protection', quiet: true, ev: 'datasheet' });
    statTile(t, 5.1, [1040, ty, 360, th], { value: '<1', unit: '% a year', label: 'Ship mode, at 370 nA', quiet: true, ev: 'derived', count: false });
    const bx = 1440, bw = RM - bx;
    demoWindow(bx, ty, bw, th, tileA(t, 5.2, 2));
    const PB = elc_v3('battery', t, bx + 150, ty + 2, bw - 152, th - 4, { view: 'threeQuarter', view2d: 'top', zoom: in2D(1.25, 1.4), yaw: 0.15 * Math.sin(t * 0.4), explode: 0.3 * ep(t, 5.4, 6.4) });
    if (PB) callout(t, 6.0, PB([13.5, 1.2, 23.5]), 'Two wires', { to: [bx + 176, ty + 92], side: 'l', color: A, sub: 'No sensor inside: one on the board, proposed', maxW: 128 });
    source(t, 'Nordic nPM1300 specification (defaults, all configurable). ' + B.maker + ' ' + B.part + ': charging from ' + B.tLo + ' to ' + B.tHi + ' °C. Ship mode: 370 nA × 8,766 h ≈ 3.2 mAh, under 1% of ' + B.mAh + ' mAh, derived.', { t0: 2 });
  }
});


/* ============================== one board, one side, one reflow (#92; Brock, F2.29 and F12.1) ============================== */
S({
  id: 'elc_oneside', ch: 'elec', theme: 'night', title: 'One board, one side, one reflow', settle: 10, ideas: [92], three: ['pcb'],
  src: ['dsReflow', 'elcBrock', 'elcLayout'],
  draw: t => {
    header(t, 'One board, one side, one reflow');
    captions(t, [[0.6, 'Theseus has one board, and every part on it sits on its top side, so it goes through the reflow oven once.'], [5.4, 'A double-sided board needs a second pass, with the first side\'s parts hanging upside down while their solder melts again.']]);
    const A = C.hero, hot = heatCol(0.75), x = LM, y = 280, w = 1000, h = 460;
    demoWindow(x, y, w, h, tileA(t, 0.2, 0));
    const kr = prog(t, 1.2, 5.0), sw = ep(t, 5.6, 7.4, E.cam);
    const view = [lerp(0, -0.96, sw), lerp(0.98, 0.16, sw), lerp(-0.2, 0.22, sw)];
    const P = elc_v3('pcb', t, x + 2, y + 2, w - 4, h - 4, { view, target: elc_W(0, 24, lerp(1, 5, sw)), zoom: lerp(1.45, 1.7, sw), reflow: kr > 0 && kr < 1 ? kr : 0 });
    /* the key in type, in the tile's clear top left (the board sits small in the middle), no plate and no dot (DESIGN 0.8) */
    text(kr < 1 ? 'The oven: one heat front, once' : 'Done: one pass', x + 36, y + 54, { role: 'label', size: 21, color: C.ink2, alpha: ep(t, 1.0, 1.4) * (1 - ep(t, 5.6, 6.0)) });
    if (P && kr > 0 && kr < 1) { const zf = 58 - kr * 66, p = P(elc_W(19.3, zf, 0)), q = P(elc_W(-19.3, zf, 0)); text('Heat front', Math.max(p[0], q[0]) + 14, (p[1] + q[1]) / 2 + 8, { role: 'label', size: 21, color: C.ink2, alpha: ep(t, 1.4, 1.8) }); }
    if (P && sw > 0.9) {
      const kk = ep(t, 7.6, 8.0);
      callout(t, 7.8, P(elc_W(0, 20.6, 2.0)), 'Every part on top', { to: [x + w - 300, y + 90], side: 'r', color: A, alpha: kk });
      callout(t, 8.2, P(elc_W(-14, 40, -0.6)), 'Underside: nothing soldered', { to: [x + w - 360, y + h - 80], side: 'r', color: A, alpha: kk, sub: 'The lens clips on' });
    }
    /* the two processes, step by step, in type: no boxes round the steps (DESIGN 0.8), no orange (F9.3). A step lights up as
       it runs; Theseus's one oven pass is blue, and the double-sided board's second pass is red, the problem */
    const ly0 = 780, lh = 180;
    demoWindow(x, ly0, w, lh, tileA(t, 0.3, 1));
    const lane = (yy, hero, lab, sub, steps, t0) => {
      const ka = ep(t, t0, t0 + 0.4);
      if (hero) heroTag(x + 32, yy - 4, 'Theseus', null, { a: ka, size: 21 }); else text(lab, x + 32, yy - 4, { role: 'label', size: 21, color: C.ink2, alpha: ka });
      text(sub, x + 32, yy + 22, { role: 'label', size: 19, color: hero ? C.heroText : C.bad, alpha: ka });
      let sx = x + 240;
      steps.forEach((s2, i) => {
        const k = ep(t, t0 + 0.12 * i, t0 + 0.12 * i + 0.4), on = t > t0 + 0.5 + 0.3 * i, second = !hero && i >= 3;
        const col = !on ? C.faint : hero && /Oven/.test(s2) ? C.heroText : second ? C.bad : C.ink;
        const r = text(s2, sx, yy + 6, { role: 'label', size: 20, color: col, alpha: k });
        sx += r.w;
        if (steps[i + 1]) { arrow(sx + 9, yy - 1, sx + 27, yy - 1, { color: C.faint, w: 2, hs: 6, alpha: k }); sx += 38; }
      });
    };
    lane(ly0 + 62, true, '', 'One pass', ['Paste', 'Place', 'Oven'], 1.0);
    lane(ly0 + 132, false, 'Double-sided', 'Two passes', ['Paste', 'Place', 'Oven', 'Flip', 'Paste', 'Place', 'Oven again'], 2.2);
    /* the right column: before → after, the one board, why the second pass hurts */
    const rx = 1120, rw = RM - rx;
    elc_ba(t, 4.2, rx, 440, '2', '1', { size: 130, label: 'Oven passes, then Theseus', unit: 'pass', net: 'Nothing hangs upside down while its solder melts again', maxW: rw });
    statTile(t, 5.0, [rx, 560, rw, 200], { value: String(THESEUS.pcb), unit: 'g', label: 'One board, with the radio module, PMIC, antenna and USB-C', hero: true, count: false });
    sourceBox(t, 5.8, rx, 800, rw, 'ALLPCB', 'In a second pass the first side\'s parts hang upside down as their joints melt again, and the heavy ones can drop.', { size: 24 });
    source(t, 'Second-pass fallout: ALLPCB. Oven: the reflow oven, where the solder paste melts. Layout: the Theseus 3D layout.', { t0: 2 });
  }
});


/* ============================== an angled paracord cable (#19, #20, #70) ============================== */
/** a paracord cable along pts (stage px), d px across: a woven sheath drawn as the braid's chevrons, two-tone, with each pic's
   trailing edge in shadow (over and under) and round shading on top. o = { c1, c2, a, slide (px the weave has moved) } */
function elc_paracord(pts, d, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003 || pts.length < 2) return;
  const S = [], step = 1.5;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(L / step));
    for (let k = (i === 1 ? 0 : 1); k <= n; k++) S.push([x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n]);
  }
  const N = S.length, T = S.map((p, i) => { const q = S[Math.min(N - 1, i + 1)], r = S[Math.max(0, i - 1)], dx = q[0] - r[0], dy = q[1] - r[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; });
  const len = [0]; for (let i = 1; i < N; i++) len.push(len[i - 1] + Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]));
  const at = (s, n) => { let i = 0, j = N - 1; while (j - i > 1) { const m = (i + j) >> 1; if (len[m] < s) i = m; else j = m; }
    const k = len[j] > len[i] ? (s - len[i]) / (len[j] - len[i]) : 0, x = lerp(S[i][0], S[j][0], k), y = lerp(S[i][1], S[j][1], k), t = T[i];
    return [x - t[1] * n, y + t[0] * n]; };
  const h = d / 2, c1 = o.c1 || '#2C3340', c2 = o.c2 || '#9AA4B2';
  G.save(); G.globalAlpha = a;
  const outlinePath = () => { G.beginPath(); for (let i = 0; i < N; i++) { const p = at(len[i], h); i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1]); } for (let i = N - 1; i >= 0; i--) { const p = at(len[i], -h); G.lineTo(p[0], p[1]); } G.closePath(); };
  outlinePath(); G.fillStyle = '#15171B'; G.fill();
  G.save(); outlinePath(); G.clip();
  const p = d * 0.62, total = len[N - 1], s0 = -(((o.slide || 0) % (2 * p)) + 2 * p) % (2 * p);
  G.lineCap = 'round'; G.lineJoin = 'round';
  for (let s = s0 - p, k = 0; s < total + p; s += p / 2, k++) {
    /* a chevron: from the top edge, forward to the centre line, back to the bottom edge */
    const A = at(s - 0.42 * p, h * 1.05), B = at(s + 0.18 * p, 0), C = at(s - 0.42 * p, -h * 1.05);
    G.beginPath(); G.moveTo(A[0], A[1]); G.lineTo(B[0], B[1]); G.lineTo(C[0], C[1]);
    G.strokeStyle = (k >> 1) % 2 ? c1 : c2; G.lineWidth = p * 0.36; G.stroke();
    const A2 = at(s - 0.42 * p - 0.2 * p, h * 1.05), B2 = at(s + 0.18 * p - 0.2 * p, 0), C2 = at(s - 0.42 * p - 0.2 * p, -h * 1.05);
    G.beginPath(); G.moveTo(A2[0], A2[1]); G.lineTo(B2[0], B2[1]); G.lineTo(C2[0], C2[1]); G.strokeStyle = 'rgba(0,0,0,0.45)'; G.lineWidth = p * 0.08; G.stroke();
  }
  /* round shading: dark toward both edges, a soft highlight a third of the way from the top */
  const band = (n0, w0, col) => { G.beginPath(); for (let i = 0; i < N; i++) { const q = at(len[i], n0); i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); } G.strokeStyle = col; G.lineWidth = w0; G.stroke(); };
  band(h * 0.86, d * 0.3, 'rgba(0,0,0,0.42)'); band(-h * 0.86, d * 0.3, 'rgba(0,0,0,0.5)'); band(h * 0.38, d * 0.16, 'rgba(255,255,255,0.16)');
  G.restore();
  outlinePath(); G.strokeStyle = 'rgba(0,0,0,0.6)'; G.lineWidth = 1; G.stroke();
  G.restore();
}
/** a USB-C plug from the side, its metal end in the port at (x, y), s px per mm. dir = +1 the plug body runs right, -1 left.
   up: the body turns up at once (Theseus's angled plug); else it runs straight out (overmold 15 × 6.5 mm, a 6 mm strain
   relief). Returns where the cable leaves it and its heading (unit vector) */
function elc_plugSide(x, y, s, dir, up, a) {
  const mold = TH ? ['#3B3E45', '#202227'] : ['#43464E', '#24262B'];
  G.save(); G.globalAlpha = a;
  const g = (x0, y0, x1, y1) => { const gr = G.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, mold[0]); gr.addColorStop(1, mold[1]); return gr; };
  /* the metal shell's lip, just visible at the port */
  G.fillStyle = '#B9BEC5'; G.fillRect(dir > 0 ? x - 0.6 * s : x, y - 1.2 * s, 0.6 * s, 2.4 * s);
  let out;
  if (!up) {
    const x0 = x, x1 = x + dir * 15 * s, t = 3.25 * s;
    rrPath(Math.min(x0, x1), y - t, 15 * s, 2 * t, 1.4 * s); G.fillStyle = g(0, y - t, 0, y + t); G.fill(); G.strokeStyle = 'rgba(0,0,0,0.5)'; G.lineWidth = 1; G.stroke();
    G.beginPath(); G.moveTo(x1, y - 2.4 * s); G.lineTo(x1 + dir * 6 * s, y - 1.1 * s); G.lineTo(x1 + dir * 6 * s, y + 1.1 * s); G.lineTo(x1, y + 2.4 * s); G.closePath(); G.fillStyle = g(0, y - 2.4 * s, 0, y + 2.4 * s); G.fill();
    out = { p: [x1 + dir * 6 * s, y], d: [dir, 0] };
  } else {
    const bw = 6.5 * s, top = y - 11 * s, x0 = dir > 0 ? x : x - bw;
    rrPath(x0, top, bw, y + 3.25 * s - top, 1.4 * s); G.fillStyle = g(x0, 0, x0 + bw, 0); G.fill(); G.strokeStyle = 'rgba(0,0,0,0.5)'; G.lineWidth = 1; G.stroke();
    const cx = x0 + bw / 2;
    G.beginPath(); G.moveTo(cx - 2.4 * s, top); G.lineTo(cx - 1.1 * s, top - 5 * s); G.lineTo(cx + 1.1 * s, top - 5 * s); G.lineTo(cx + 2.4 * s, top); G.closePath(); G.fillStyle = g(cx - 2.4 * s, 0, cx + 2.4 * s, 0); G.fill();
    out = { p: [cx, top - 5 * s], d: [0, -1] };
  }
  G.restore();
  return out;
}
/** sample a cubic Bézier into points */
function elc_bez(p0, p1, p2, p3, n = 40) { const out = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; out.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]); } return out; }
/** the mouse's nose from the side, charging: the shell's own model (3D render, or its flat twin in 2D), the hand moving it
   back and forth over the pad. A straight plug's cable lies on the pad and the chin rides onto it; Theseus's plug turns up
   and the cable arcs away. (x, y, w, h) the panel. Returns whether the chin is on the cable */
function elc_chargeSide(t, t0, x, y, w, h, up) {
  const k = ep(t, t0, t0 + 0.5); if (k <= 0.003) return false;
  const dz = 7.5 * Math.sin((t - t0) * 1.3);
  const st = { view: [-1, 0.0001, 0.0001], view2d: 'left', zoom: 2.35, target: [0, 13, 33 - dz], explode: 0, xray: 0, plate: 1, ground2d: false };
  G.save(); rrPath(x, y, w, h, 10); G.clip();
  const box = [x, y, w, h], drawn = view3D('shell', t, x, y, w, h, st, { alpha: k });
  const at = (re, f) => (typeof v3At === 'function' ? v3At('shell', st, box, re, f) : V2D.on ? v2dAt('shell', st, box, re, f) : null);
  const port = at(/body\/usbC$/, [0.5, 0.5, 1]), tail = at(/body\/usbC$/, [0.5, 0.5, 0]), base = at(/body\/body$/, [0.5, 0, 0.5]);
  let hit = false;
  if (port && tail) {
    const dir = port[0] >= tail[0] ? 1 : -1, s = Math.abs(port[0] - tail[0]) / 6.0, pad = base ? base[1] : y + h - 40;
    G.fillStyle = inkA(0.05); G.fillRect(x, pad, w, y + h - pad); line(x, pad, x + w, pad, { color: C.faint, w: 1.5, alpha: k });
    const pl = elc_plugSide(port[0], port[1], s, dir, up, k), d = 1.9 * s * 1.25, pe = pl.p, edge = dir > 0 ? x + w + 20 : x - 20;
    let path;
    if (!up) {
      /* the cable runs out, drops to the pad and lies there; the touch-down stays put while the hand moves the mouse */
      const xt = port[0] + dir * (40 * s - dz * s), chin = at(/body\/body$/, [0.5, 0.02, 1]);
      hit = chin ? dir * (chin[0] - (xt - dir * 18 * s)) > 0 : false;
      path = elc_bez(pe, [pe[0] + dir * 12 * s, pe[1]], [xt - dir * 10 * s, pad - d / 2], [xt, pad - d / 2]).concat([[edge, pad - d / 2]]);
      if (hit) warm(chin[0] + dir * 8, pad - 4, 46, C.bad, 0.55 * k);
    } else path = elc_bez(pe, [pe[0], pe[1] - 12 * s], [pe[0] + dir * 6 * s, y + 70], [edge, y + 60]);
    elc_paracord(path, d, { a: k, slide: (t - t0) * 6 });
  }
  G.restore();
  return hit;
}
S({
  id: 'cable', ch: 'elec', theme: 'night', title: 'Angled plug, paracord cable', settle: 9, ideas: [19, 20, 70], three: ['shell'], rev: 1,
  answers: [['extremely lazy visualizations', 'Redrawn: the mouse\'s real profile charging, a woven paracord cable, a detailed angled plug and its section'],
    ['paracord needs better assets', 'A woven sheath (two-tone chevrons, over and under, round shading) on every cable on the slide']],
  src: ['tpuCables', 'elcXa25', 'elcBrock'],
  draw: t => {
    header(t, 'Angled plug, paracord cable');
    captions(t, [[0.6, 'Reviewers called the cable in the box too stiff on all four of these flagship-class mice. A stiff cable drags a light mouse around (#20).'], [4.0, 'Theseus\'s cable is paracord over braided conductors, so it bends like rope, and its plug turns up at the nose, so charging never puts the cable under the chin (#19).']]);
    /* charging while you play: the same hand movement, a straight plug against Theseus's angled one */
    const x = LM, y = 272, w = 1000, h = 400;
    demoWindow(x, y, w, h, tileA(t, 0.2, 0));
    cardHead(t, 0.4, x, y, w, 'Charging while you play, from the side', ['proposal']);
    const pw = (w - 72) / 2, py = y + 76, ph = h - 96;
    const hit = elc_chargeSide(t, 1.2, x + 24, py, pw, ph, false);
    elc_chargeSide(t, 1.6, x + 48 + pw, py, pw, ph, true);
    text('Straight plug', x + 48, py + 34, { role: 'label', size: 21, color: C.ink2, alpha: ep(t, 1.2, 1.6) });
    text(hit ? 'The chin rides onto the cable' : 'Cable on the pad', x + 48, py + 64, { role: 'label', size: 20, color: hit ? C.bad : C.mute, alpha: ep(t, 1.2, 1.6) });
    heroTag(x + 72 + pw, py + 30, 'Theseus', 'angled up', { a: ep(t, 1.6, 2.0) });
    text('The cable arcs off the pad', x + 72 + pw, py + 64, { role: 'label', size: 20, color: C.heroText, alpha: ep(t, 1.8, 2.2) });
    /* the cable itself, up close: the angled plug, the woven sheath, and the cable cut across */
    const cy0 = 700, ch = 260;
    demoWindow(x, cy0, w, ch, tileA(t, 0.3, 1));
    { const k = ep(t, 0.8, 1.3), s = 9, mx = x + 120, my = cy0 + ch - 70;
      G.save(); rrPath(x, cy0, w, ch, 10); G.clip();
      rr(mx - 46, my - 30, 46, 60, 6, TH ? '#C9C8C3' : '#2A2C31', null, 0, k);
      text('Nose', mx - 40, my + 50, { role: 'label', size: 18, color: C.faint, alpha: k });
      const pl = elc_plugSide(mx, my, s, 1, true, k);
      const path = elc_bez(pl.p, [pl.p[0], pl.p[1] - 40], [pl.p[0] + 120, cy0 + 92], [x + 420, cy0 + 112]).concat(elc_bez([x + 420, cy0 + 112], [x + 520, cy0 + 126], [x + 560, cy0 + 200], [x + 640, cy0 + 212], 24).slice(1));
      elc_paracord(path, 1.9 * s * 1.6, { a: k, slide: t * 4 });
      G.restore(); }
    const o = part(x + 830, cy0 + ch / 2, 62, () => cableMM({}), { alpha: ep(t, 0.6, 1.1) });
    if (o.sheath) {
      callout(t, 1.2, o.sheath, 'Paracord sheath', { to: [x + 730, cy0 + 52], side: 'l', color: C.heroText });
      callout(t, 1.5, o.core, 'Braided conductors', { to: [x + 730, cy0 + 214], side: 'l', color: C.heroText });
    }
    text('Woven sheath, then the cable cut across', x + 32, cy0 + 34, { role: 'label', size: 20, color: C.faint, alpha: ep(t, 1.2, 1.6) });
    /* the right column: the headline, before → after, the cables in the box */
    const rx = 1120, rw = RM - rx;
    elc_hl(t, 3.4, rx, 430, '1.9', 'mm', { size: 130, count: false, label: 'Thin enough to bend like rope', sub: 'XA25-class: 1.9 mm still passes USB high speed. Thick enough to charge at full current (#20).', subW: rw });
    elc_ba(t, 4.2, rx, 640, 'Under it', 'Clear', { size: 54, label: 'The cable while charging: straight, then angled', net: 'The plug lifts it off the pad', maxW: rw });
    const ly = 720, lh = 240;
    demoWindow(rx, ly, rw, lh, tileA(t, 0.4, 2));
    cardHead(t, 0.6, rx, ly, rw, 'The cables in the box, reviewed', ['measured'], { dy: 44 });
    const rows = [['G Pro X Superlight 2', 'Below-average flex'], ['Viper V3 Pro', 'Stiff'], ['UltralightX', '"Supremely stiff"'], ['Maya X', 'Can\'t play while charging']];
    rows.forEach((r, i) => { const yy = ly + 100 + i * 36, k = ep(t, 1.2 + i * 0.15, 1.6 + i * 0.15); text(r[0], rx + 32, yy, { role: 'small', size: 23, weight: 600, color: C.ink, alpha: k }); text(r[1], rx + rw - 32, yy, { role: 'small', size: 23, weight: 700, color: C.bad, align: 'right', alpha: k }); });
    source(t, 'Cable notes: TechPowerUp reviews. XA25: XBAB, 1.9 mm, 6.9 g/m, passes the USB 2.0 high-speed eye test. Paracord type I is 1.7 mm (Brock\'s note).', { t0: 2 });
  }
});



/* ============================== web software in a browser tab (#23, #65, #66, #87) ============================== */
S({
  id: 'software', ch: 'elec', theme: 'paper', title: 'Web software, nothing to install', settle: 10, ideas: [23, 65, 66, 87], src: ['webhid', 'elcLayout'],
  sfx: [[3.0, 'click'], [3.12, 'release'], [4.2, 'click'], [4.5, 'tick'], [4.8, 'tick'], [5.1, 'release'], [6.5, 'click'], [7.5, 'release']],
  draw: t => {
    header(t, 'Web software, nothing to install');
    captions(t, [[0.6, 'Mouse software is usually a large download that runs all the time. A browser tab installs nothing, and the settings live on the mouse.'], [5.0, 'It runs in Chrome and Edge, you approve the mouse once, and firmware updates come through the same tab (#23).']]);
    const wx = LM, wy = 280, ww = 1040, wh = 680, A = C.hero;
    demoWindow(wx, wy, ww, wh, tileA(t, 0.2, 0));
    const bx = wx + 40, by = wy + 40, bw = ww - 80, bh = wh - 80, k = ep(t, 0.5, 1.0);
    rr(bx, by, bw, bh, 8, TH ? '#ffffff' : '#101113', inkA(0.2), 1.5, k);
    rr(bx, by, bw, 50, 8, inkA(0.06), null, 1, k);
    for (let i = 0; i < 3; i++) circle(bx + 26 + i * 22, by + 25, 6, { fill: inkA(0.25), alpha: k });
    rr(bx + 110, by + 10, 400, 30, 6, inkA(0.06), null, 1, k); text('store  ›  configure', bx + 128, by + 33, { role: 'label', size: 20, color: C.mute, alpha: k });
    const cx = bx + 44, cy = by + 130, x0 = cx + 230, w0 = bw - 380, u = t - 2.2;
    const poll = u < 0.9 ? 0 : 3, lo = u < 2.0 ? 3 : u < 2.9 ? Math.round(lerp(3, 0, E.io3(prog(u, 2.0, 2.9)))) : 0, dpiF = u < 4.3 ? 0 : E.io3(prog(u, 4.3, 5.3)), dpi = Math.round(lerp(1600, 800, dpiF) / 50) * 50;
    const knob = v2 => x0 + w0 * (v2 - 400) / 6000, rh = 92;
    const Pt = { rest: [bx + bw - 70, by + bh - 60], chip8: [x0 + 3 * 92 + 38, cy + rh + 4], lo3: [x0 + 3 * 32, cy + 2 * rh], lo0: [x0, cy + 2 * rh], dpiA: [knob(1600), cy], dpiB: [knob(800), cy] };
    const keys = [[0, Pt.rest], [0.8, Pt.chip8], [1.3, Pt.chip8], [1.9, Pt.lo3], [2.0, Pt.lo3], [2.9, Pt.lo0], [3.4, Pt.lo0], [4.2, Pt.dpiA], [4.3, Pt.dpiA], [5.3, Pt.dpiB], [5.8, Pt.dpiB], [6.8, Pt.rest]];
    const rows = [['DPI', 'slider', dpi], ['Polling', 'chips', ['1k', '2k', '4k', '8k']], ['Lift-off', 'steps', (0.7 + lo * 0.1).toFixed(1) + ' mm'], ['Sensor angle', 'value', '−2.0° (#87)'], ['Firmware', 'update', '']];
    rows.forEach(([l, kind, v], i) => {
      const yy = cy + i * rh, kk = ep(t, 1.0 + i * 0.2, 1.4 + i * 0.2);
      text(l, cx, yy + 8, { role: 'label', size: 21, color: C.ink, alpha: kk });
      if (kind === 'slider') { line(x0, yy, x0 + w0, yy, { color: C.hair, w: 4, alpha: kk }); const f = (v - 400) / 6000; line(x0, yy, x0 + w0 * f, yy, { color: A, w: 4, alpha: kk }); circle(x0 + w0 * f, yy, 11, { fill: A, alpha: kk }); text(String(v), x0 + w0 + 22, yy + 8, { font: 'mono', size: 25, weight: 700, color: C.ink, alpha: kk }); }
      else if (kind === 'chips') v.forEach((c, j) => { const on = j === poll, fl = j === 3 ? env(u, 0.85, 0.95, 1.1, 1.6) : 0; rr(x0 + j * 92, yy - 18, 76, 38, 6, on ? A : inkA(0.06), on ? null : inkA(0.2), 1.2, kk); if (fl > 0) rr(x0 + j * 92 - 5 * fl, yy - 18 - 5 * fl, 76 + 10 * fl, 38 + 10 * fl, 8, null, A, 2, kk * fl * 0.6); text(c, x0 + j * 92 + 38, yy + 8, { role: 'label', size: 21, color: on ? C.onHero : C.ink2, align: 'center', alpha: kk }); });
      else if (kind === 'steps') { for (let j = 0; j <= 10; j++) line(x0 + j * 32, yy - 9, x0 + j * 32, yy + 9, { color: j === lo ? A : C.faint, w: j === lo ? 3 : 1.5, alpha: kk }); circle(x0 + lo * 32, yy, 8, { fill: A, alpha: kk }); text(v, x0 + 360, yy + 8, { font: 'mono', size: 25, weight: 700, color: C.ink, alpha: kk }); }
      else if (kind === 'update') { const fu = ep(u, 4.9, 6.9, E.lin); rr(x0, yy - 14, 420, 28, 14, inkA(0.06), inkA(0.2), 1.2, kk); rr(x0, yy - 14, 420 * fu, 28, 14, A, null, 1, kk * (fu > 0.01 ? 1 : 0)); text(fu < 1 ? 'Mouse, over the cable or the radio' : 'Up to date', x0 + 16, yy + 8, { role: 'label', size: 20, color: fu > 0.8 ? C.onHero : C.ink2, alpha: kk }); }
      else text(v, x0, yy + 8, { font: 'mono', size: 25, weight: 700, color: C.ink, alpha: kk });
    });
    for (const tw0 of [1.0, 3.0, 5.4]) { const kt = env(u, tw0, tw0 + 0.25, tw0 + 1.3, tw0 + 1.6); if (kt <= 0) continue; const ty = by + bh - 40 + (1 - kt) * 12; rr(bx + 44, ty - 26, 286, 38, 19, C.heroSoft, A, 1.4, kt); text('Saved on the mouse', bx + 68, ty, { role: 'label', size: 20, color: C.heroText, alpha: kt }); }
    if (u > 0 && t > 1.6) {
      const down = [0.8, 2.0, 4.3].some(c0 => u > c0 && u < c0 + 0.12) || (u > 2.0 && u < 2.9) || (u > 4.3 && u < 5.3);
      const p = kf(u, keys, E.cam), last = [0.8, 2.0, 4.3].filter(c0 => u >= c0).pop(), pr = last == null ? 0 : prog(u, last, last + 0.45);
      cursorPtr(p[0], p[1], { a: ep(t, 1.6, 2.0), press: pr > 0 && pr < 1 ? pr : 0, grab: down && u > 2.0 });
    }
    text('A generic mock-up of the configurator', bx + bw - 24, by + bh - 28, { role: 'label', size: 20, color: C.faint, align: 'right', alpha: k });
    /* the right column: the headline, before → after, how it works and its limits */
    const rx = 1160, rw = RM - rx;
    elc_hl(t, 3.6, rx, 430, '0', 'installs', { size: 140, count: false, label: 'A browser tab, nothing to download', sub: 'WebHID in Chrome and Edge 89 and up. The settings live on the mouse, so the tab can close.', subW: rw });
    elc_ba(t, 4.4, rx, 640, 'An app', 'A tab', { size: 56, label: 'Mouse software, then Theseus', net: 'Nothing running in the background', maxW: rw });
    noteBox(t, 5.2, rx, 720, rw, { size: 24, head: 'Its limits, stated', body: 'Not Firefox or Safari. You approve the mouse once in a browser prompt. Firmware arrives in the same tab: motion latency (#65) and sensor tuning with PixArt (#66).' });
    source(t, 'WebHID: Chrome developers, Chrome and Edge 89 and up. The configurator: a generic mock-up, a proposal.', { t0: 2 });
  }
});