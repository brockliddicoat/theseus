/* ============================================================================================
   ELECTRONICS (chapter code elc): the radio, the power, the board, the receiver.
   Order in the chapter (13-sort.js): eleccard, onechip, elc_module, antenna, motion, elc_rate, framesync, secondshot,
   power, syncpower, elc_pmic, elc_charge, elc_safe, cells, frontier, elc_oneside, elecsheet1, cable, dongle, software,
   elc_sheet2. motion, elc_rate, cells and frontier live in 14-c-elec-ex.js; the idea sheets in 12-40 and 12-45.
   The 3D board is the 'pcb' scene (3d/pcb): positions below are its layout's board-local mm (x = the user's left,
   z = toward the nose), turned into the mouse frame by elc_W().
   ============================================================================================ */
Object.assign(SRC, {
  elcRaytac: { t: 'Raytac AN54LM-20A product page: nRF54LM20A, chip antenna, 9.9 × 13.3 × 2.0 mm, 2.0 MB flash / 512 KB RAM, high-speed USB, 66 GPIO; "Intended Certifications: FCC, IC, CE, Telec (MIC), KC, SRRC, NCC, RCM, WPC"; coming soon, est. Q3 2026', u: 'https://www.raytac.com/product/ins.php?index_id=180' },
  elcRaytacBlog: { t: 'Raytac blog, 25 Mar 2026: the AN54LM series; Bluetooth 6.0 certified, regional certifications listed as targets', u: 'https://raytaccorp.blogspot.com/2026/03/raytac-abietec-announce-new-an54lm.html' },
  elcNpm: { t: 'Nordic nPM1300 product page: 32 to 800 mA charging, 3.5 to 4.45 V termination, 4.0 to 5.5 V input with 22 V overvoltage protection, 2 × 200 mA bucks, 2 LDOs / load switches, fuel gauge, watchdog, ship mode 370 nA, hibernate 500 nA, 5 × 5 mm QFN', u: 'https://www.nordicsemi.com/Products/nPM1300' },
  elcNpmJeita: { t: 'nPM1300 product specification, battery temperature: no charging below 0 °C or above 60 °C; 50% current from 0 to 10 °C; a lower termination voltage from 45 to 60 °C (defaults, all configurable)', u: 'https://docs.nordicsemi.com/r/bundle/ps_npm1300/page/chapters/charger.html-battery-temp-monitoring' },
  elcNpmChg: { t: 'Zephyr nPM1300 charger binding: 32 to 800 mA in 2 mA steps; charging ends at 10% (default) or 20% of the set current; charging stops above a set die temperature and resumes below another', u: 'https://docs.zephyrproject.org/latest/build/dts/api/bindings/sensor/nordic,npm1300-charger.html' },
  elcGauge: { t: 'nRF Fuel Gauge library (nrfxlib): state of charge, time to empty, time to full and state of health from the nPM1300 measurements', u: 'https://nrfconnectdocs.nordicsemi.com/ncs/latest/nrfxlib/doxygen/html/group__nrf__fuel__gauge.html' },
  elcTpuV4: { t: 'TechPowerUp, Razer Viper V4 Pro review: Airoha AB1623MN; 306 mAh, 3.87 V cell; 0.169 A constant-current charge; about 40 h at 8 kHz; fuel gauge IC; 12-bit wireless counts; smoothing after lift-off (as recorded in the 2026-11-03 validation report)', u: 'https://www.techpowerup.com/review/razer-viper-v4-pro/' },
  elcB2gSlx: { t: 'Back2Gaming, Finalmouse Starlight X review: 15 graphite-coated titanium screws, about 0.02 g each; no battery-hour rating', u: 'https://www.back2gaming.com/review/finalmouse-starlight-x-nightfall-wireless-mouse/' },
  elcBu802: { t: 'Battery University BU-802b: lithium-ion self-discharge, 1 to 2% a month plus about 3% a month for the protection circuit', u: 'https://batteryuniversity.com/article/bu-802b-what-does-elevated-self-discharge-do' },
  elcCoat: { t: 'Conformal coating (Wikipedia, citing IPC): acrylic, epoxy or urethane coats are typically 30 to 130 µm thick after curing', u: 'https://en.wikipedia.org/wiki/Conformal_coating' },
  elcRazerV4: { t: 'Razer Viper V4 Pro product page: receiver LEDs for battery, connection, polling or DPI; taller antenna; weighted base', u: 'https://www.razer.com/gaming-mice/razer-viper-v4-pro' },
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
/** the step-further beat: the best shipping version (named, its number, its limit), then the Theseus step.
   o = { who, num, ev, lim, step, stepEv, dir: 'h' (side by side) | 'v' (stacked), split (v: height of the top half) } */
function elc_step(t, t0, x, y, w, h, o) {
  const a = ep(t, t0, t0 + 0.45); if (a <= 0.003) return;
  const v = o.dir === 'v', gap = 76, hw = v ? w : (w - gap) / 2, h1 = v ? (o.split || Math.round(h / 2)) : h;
  demoWindow(x, y, w, h, a);
  cardHead(t, t0 + 0.05, x, y, hw, 'Best today', o.ev || [], { dy: 40 });
  rich([{ s: o.who, role: 'small', size: 27, weight: 700, color: C.ink }, o.num ? { s: o.num, font: 'mono', size: 25, weight: 700, color: C.ink, gap: 16 } : null], x + 26, y + 84, { alpha: ep(t, t0 + 0.2, t0 + 0.6) });
  if (o.lim) text(o.lim, x + 26, y + 118, { role: 'small', color: C.ink2, maxW: hw - 52, lh: 1.3, t, t0: t0 + 0.45, cps: 150 });
  const kb = ep(t, t0 + 0.9, t0 + 1.5, E.cam);
  const x2 = v ? x : x + hw + gap, y2 = v ? y + h1 : y, w2 = v ? w : hw, h2 = v ? h - h1 : h;
  if (!v) arrow(x + hw + 12, y + h / 2, x + hw + gap - 10, y + h / 2, { color: C.heroText, w: 3, hs: 13, p: kb });
  else line(x + 26, y2, x + w - 26, y2, { color: C.hair, w: 1.5, alpha: kb });
  if (kb > 0.01) rect(x2, y2 + 14, 5, (h2 - 28) * kb, { fill: C.hero });
  cardHead(t, t0 + 1.1, x2, y2, w2, 'Theseus, one step further', o.stepEv || ['proposal'], { dy: 40, color: C.heroText });
  text(o.step, x2 + 26, y2 + 84, { role: 'small', size: 26, weight: 600, color: C.ink, maxW: w2 - 52, lh: 1.3, t, t0: t0 + 1.3, cps: 120 });
}
/** a key-value list: a mono key, the value as reading text, an optional evidence dot at the right */
function elc_kv(t, t0, x, y, w, rows, o = {}) {
  const kw = o.kw || 170, rh = o.rh || 44;
  rows.forEach((r, i) => {
    const yy = y + i * rh, k = ep(t, t0 + i * 0.1, t0 + 0.4 + i * 0.1);
    if (i && o.rules !== false) rule(x, yy - rh * 0.64, x + w, k);
    text(r[0], x, yy, { role: 'label', size: 21, color: C.mute, alpha: k });
    text(r[1], x + kw, yy, { role: 'small', size: 25, weight: r[3] ? 700 : 500, color: r[4] || C.ink, alpha: k, maxW: w - kw - (r[2] ? 26 : 0) });
    if (r[2]) evDot(x + w - 7, yy - 8, r[2], 5.5, k);
  });
}
/** a small label with a coloured dot, used as the key of a 3D shot */
function elc_key(x, y, col, label, a = 1, o = {}) { circle(x + 7, y - 7, 7, { fill: col, alpha: a }); return text(label, x + 24, y, Object.assign({ role: 'label', size: 21, color: C.ink, alpha: a }, o)); }
/** the radio chip of each wireless mouse in the dataset, grouped */
function elc_census() {
  const ms = ((RD.mice || {}).mice || []).filter(m => m.connection !== 'wired');
  const fam = s => /nRF52840/.test(s) ? 'nRF52840' : /nRF52833/.test(s) ? 'nRF52833' : /nRF54/.test(s) ? 'nRF54' : /PixArt/.test(s) ? 'PixArt' : 'Other';
  const n = {}; ms.forEach(m => { const f = fam(String(rv(m.mcu) || '')); n[f] = (n[f] || 0) + 1; });
  return { total: ms.length, n };
}
/** a chip in a box, for the receiver diagrams */
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

/* ============================== chapter card ============================== */
S({
  id: 'eleccard', ch: 'elec', card: true, theme: 'night', title: 'Electronics', settle: 5, three: ['pcb'],
  draw: t => {
    chapterCard(t, { name: 'Electronics', gloss: 'The radio, the power, the board and the receiver, and what each one costs in battery and latency.', list: [[102, 'A pre-certified radio module (intended)'], [77, 'Radio and 8 kHz USB in one chip'], ['pmic', 'A PMIC: charger, rails and fuel gauge'], [92, 'Every part on one side: one reflow'], ['sync', 'Each frame captured just before it is sent'], ['link', 'A spare copy of every report'], [68, 'The antenna forward, clear of carbon'], [85, 'A screen on the receiver'], [23, 'Software in the browser']] });
    const P = elc_v3('pcb', t, 990, 250, 780, 660, { view: [-0.62, 0.7, 0.5], view2d: 'top', yaw: 0.26 * Math.sin(t * 0.33), zoom: 1.7, target: elc_W(0, 23, 4), power: ep(t, 2.2, 3.0), powerMode: 'run', powerT: t }, { alpha: ep(t, 0.8, 1.7) });
    if (P) { const a0 = P(elc_W(0, 26.2, 2.2)), a1 = P(elc_W(0, 46, 2.2)); elc_waves(t, 2.8, a0, Math.atan2(a1[1] - a0[1], a1[0] - a0[0]), { R: 280, spread: 0.65 }); }
  }
});

/* ============================== 8 kHz from one chip (#77, #90) ============================== */
S({
  id: 'onechip', ch: 'elec', theme: 'paper', title: '8 kHz from one chip', settle: 10, ideas: [77, 90],
  src: ['nrf52', 'nrf54', 'nrf54usb', 'usbHs', 'exEloshapes', 'slxPdf', 'elcTpuV4', 'exPiaknow', 'xbabFw'],
  draw: t => {
    header(t, '8 kHz from one chip');
    captions(t, [[0.6, 'Half of these mice run an nRF52840, whose USB is full speed: 1000 reports a second at most. For 8 kHz, its receiver needs a second chip.'], [5.0, 'The nRF54LM20A has high-speed USB built in. One chip at each end does both jobs, and the mouse gets 8 kHz over its own cable too.']]);
    const A = acc();
    /* census: the radio chip in every wireless mouse in the dataset */
    const cx = LM, cy = 272, cw = 900, chh = 290;
    demoWindow(cx, cy, cw, chh, ep(t, 0.3, 0.7));
    cardHead(t, 0.4, cx, cy, cw, 'Radio chip in the wireless mice', ['datasheet']);
    const D = elc_census(), N = D.n, tot = D.total || 1;
    const segs = [['nRF52840', N.nRF52840 || 0, C.ink], ['nRF52833', N.nRF52833 || 0, C.comp], ['nRF54', N.nRF54 || 0, C.comp], ['PixArt', N.PixArt || 0, C.comp2], ['Other', N.Other || 0, C.comp2]];
    const k0 = ep(t, 0.9, 1.3);
    rich([{ s: String(N.nRF52840 || 0), role: 'd1', size: 80, color: C.ink, tnum: true, count: [0.9, 0.8] }, { s: 'of ' + tot, font: 'mono', size: 25, weight: 600, color: C.mute, gap: 14 }], cx + 26, cy + 158, { t, alpha: k0 });
    text('run an nRF52840: full-speed USB, so its cable and its receiver top out at 1000 reports a second.', cx + 250, cy + 110, { role: 'small', color: C.ink2, maxW: cw - 280, lh: 1.3, t, t0: 1.1, cps: 120 });
    const bx = cx + 26, bw = cw - 52, by = cy + 184, bh = 40;
    let xx = bx;
    segs.forEach(([nm, n, col], i) => {
      const k = ep(t, 1.3 + i * 0.1, 2.0 + i * 0.1, E.snap), sw = bw * n / tot;
      rect(xx + 1.5, by, Math.max(0, (sw - 3) * k), bh, { fill: col });
      if (sw > 34) text(String(n), xx + 12, by + 29, { font: 'mono', size: 24, weight: 700, color: i === 0 ? C.bg : C.ink, alpha: k });
      text(nm, xx + 2, by + bh + 28 + (i % 2) * 28, { role: 'label', size: 21, color: i === 0 ? C.ink : C.mute, alpha: k });
      xx += sw;
    });
    /* why it takes two chips, and how one does it */
    const dy0 = 578, dh = 234;
    demoWindow(cx, dy0, cw, dh, ep(t, 0.5, 0.9));
    const row = (ry, lab, lcol, mouse, rx, rxw, t0, cable, ccol) => {
      text(lab, cx + 26, ry + 8, { role: 'label', size: 21, color: lcol, alpha: ep(t, t0, t0 + 0.4), maxW: 140, lh: 1.15 });
      elc_chipBox(t, t0 + 0.1, cx + 170, ry - 38, 200, 76, [{ l: mouse, s: cable, sc: ccol, hi: lcol === A }], lcol);
      const k = ep(t, t0 + 0.4, t0 + 0.8), ax = cx + 380, bx2 = cx + 438;
      for (let i = 0; i < 3; i++) circle(ax, ry, 12 + i * 12, { color: lcol, w: 2, alpha: k * (0.8 - i * 0.2), a0: -0.7, a1: 0.7 });
      if (k > 0) for (let i = 0; i < 3; i++) { const ph = (t * 1.1 + i / 3) % 1; circle(lerp(ax + 24, bx2 - 8, ph), ry, 4, { fill: lcol, alpha: k }); }
      elc_chipBox(t, t0 + 0.3, bx2, ry - 38, rxw, 76, rx, lcol);
      const ex = bx2 + rxw + 12, kk = ep(t, t0 + 0.6, t0 + 1.0);
      arrow(ex, ry, cx + cw - 70, ry, { color: C.ink, w: 2.5, hs: 10, alpha: kk });
      text('8 kHz', (ex + cx + cw - 70) / 2, ry - 12, { role: 'label', size: 21, color: C.ink, align: 'center', alpha: kk });
      text('PC', cx + cw - 26, ry + 8, { role: 'label', size: 22, color: C.ink, align: 'right', alpha: kk });
    };
    row(dy0 + 72, 'Two chips', C.red, 'nRF52840', [{ l: 'nRF52840', s: 'radio' }, { l: 'USB chip', s: 'high speed', dx: 160 }], 330, 0.9, 'cable 1 kHz', C.red);
    row(dy0 + 170, 'One chip', A, 'nRF54LM20A', [{ l: 'nRF54LM20A', s: 'same chip', hi: true }], 210, 2.4, 'cable 8 kHz', A);
    /* the two chips, side by side */
    const sx = 1010, sw2 = RM - sx;
    demoWindow(sx, 272, sw2, 540, ep(t, 0.5, 0.9));
    cardHead(t, 0.6, sx, 272, sw2, 'The two radio chips', ['datasheet']);
    compareTable(t, {
      x: sx + 26, y: 272 + 118, w: sw2 - 52, t0: 1.0, rowH: 52,
      cols: [{ key: 'k', label: '', w: 0.85 }, { key: 'a', label: '{nRF52840}', w: 1 }, { key: 'b', label: 'Theseus: {nRF54LM20A}', w: 1.15, hero: true }],
      rows: [
        { cells: { k: 'CPU', a: { v: '64 MHz', sub: 'Cortex-M4F' }, b: { v: '128 MHz', sub: 'Cortex-M33 + RISC-V' } }, best: 'b' },
        { cells: { k: 'RAM', a: '256 KB', b: '512 KB' }, best: 'b' },
        { cells: { k: 'USB', a: { v: 'Full speed', sub: '12 Mbit/s' }, b: { v: 'High speed', sub: '480 Mbit/s' } }, best: 'b' },
        { cells: { k: 'Receive, 0 dBm', a: '4.6 mA', b: '3.3 mA' }, best: 'b' },
        { cells: { k: 'Transmit, 0 dBm', a: '4.8 mA', b: '5.0 mA' }, best: 'a' },
        { cells: { k: 'Supply', a: '1.7–5.5 V', b: '1.7–3.5 V' } }
      ]
    });
    text('Transmit costs 0.2 mA more. The 3.5 V ceiling needs a regulator from the cell: the PMIC, a few slides on.', sx + 26, 272 + 486, { role: 'small', color: C.ink2, maxW: sw2 - 52, lh: 1.3, t, t0: 3.6, cps: 120 });
    elc_step(t, 6.0, LM, 828, RM - LM, 136, { who: 'Razer Viper V4 Pro', num: '8 kHz wired, one MCU', ev: ['measured'], lim: 'Wired, it measures 0.26 ms at 8 kHz; the XA25, 0.13 ms.', step: 'Wired 8 kHz from the same chip, each read timed to the PC\'s poll as the XA25 does. Target: 0.13 ms.' });
    source(t, 'Chips: Nordic specifications. Mice: EloShapes via research/data/mice.json. Latency: piaknow 2026-09-15, 8 kHz. V4 Pro: TechPowerUp.', { t0: 2 });
  }
});

/* ============================== the module: Raytac AN54LM-20A (#102, #77, #68) ============================== */
S({
  id: 'elc_module', ch: 'elec', theme: 'night', title: 'A radio module, pre-certified', settle: 10, ideas: [102, 77, 68], three: ['pcb'],
  src: ['elcRaytac', 'elcRaytacBlog', 'raytac', 'nrf54', 'slxPdf', 'elcTpuV4', 'elcLayout'],
  draw: t => {
    header(t, 'A radio module, pre-certified');
    captions(t, [[0.6, 'The nRF54LM20A goes on the board inside a Raytac AN54LM-20A: the chip, its antenna and the radio layout as one 9.9 × 13.3 mm part.'], [4.8, 'Raytac lists FCC, IC, CE, MIC, KC, SRRC and NCC as intended. Until FCC IDs exist, I call it pre-certified (intended).']]);
    const A = acc(), x = LM, y = 272, w = 1000, h = 540;
    demoWindow(x, y, w, h, ep(t, 0.2, 0.6));
    const zoom = lerp(1.5, 3.7, ep(t, 0.4, 3.2, E.cam)), xr = 0.9 * ep(t, 5.4, 6.6);
    const P = elc_v3('pcb', t, x + 2, y + 2, w - 4, h - 4, { view: ELC.top, target: elc_W(0, 20.4, 1.2), zoom, xray: xr });
    text('Nose', x + w / 2, y + 40, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: ep(t, 3.0, 3.4) });
    arrow(x + w / 2, y + 78, x + w / 2, y + 54, { color: C.mute, w: 2, hs: 9, alpha: ep(t, 3.0, 3.4) });
    if (P) {
      const kko = ep(t, 6.4, 7.0), ko = [[-6.6, 23.75], [6.6, 23.75], [6.6, 27.45], [-6.6, 27.45]].map(([a, b]) => P(elc_W(a, b, 0.1)));
      if (kko > 0) { G.save(); G.globalAlpha = kko; G.setLineDash([8, 5]); G.strokeStyle = A; G.lineWidth = 2.5; G.beginPath(); ko.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.closePath(); G.fillStyle = rgba(A, 0.12); G.fill(); G.stroke(); G.restore(); }
      const m = [[4.95, 13.95], [-4.95, 13.95], [-4.95, 27.25], [4.95, 27.25]].map(([a, b]) => P(elc_W(a, b, 2.0)));
      dim(t, 3.4, m[3], m[0], '13.3 mm', 40, { color: C.mute });
      dim(t, 3.7, m[0], m[1], '9.9 mm', 40, { color: C.mute });
      const ant = P(elc_W(0, 25.9, 2.0)), fw = P(elc_W(0, 40, 2.0));
      elc_waves(t, 7.2, ant, Math.atan2(fw[1] - ant[1], fw[0] - ant[0]), { R: 240, spread: 0.75 });
      callout(t, 2.6, P(elc_W(-2.5, 17.5, 2.0)), 'Raytac AN54LM-20A', { to: [x + w - 330, y + 352], side: 'r', color: A, sub: 'The nRF54LM20A inside' });
      callout(t, 4.3, P(elc_W(2.5, 25.9, 2.0)), 'Chip antenna', { to: [x + 50, y + 132], side: 'r', color: A });
      callout(t, 6.8, P(elc_W(-6.6, 25.6, 0.1)), 'Keep-out', { to: [x + w - 300, y + 132], side: 'r', color: A, sub: 'No copper under the antenna' });
    }
    /* the part */
    const rx = 1100, rw = RM - rx;
    demoWindow(rx, 272, rw, 288, ep(t, 0.5, 0.9));
    cardHead(t, 0.6, rx, 272, rw, 'Raytac AN54LM-20A', ['datasheet']);
    elc_kv(t, 1.0, rx + 26, 272 + 110, rw - 52, [['Chip', 'nRF54LM20A, 128 MHz Cortex-M33'], ['Memory', '2 MB RRAM, 512 KB RAM'], ['Flash chip', 'None needed'], ['USB', 'High speed, 480 Mbit/s'], ['Size', '9.9 × 13.3 × 2.0 mm, 66 GPIO']], { kw: 168, rh: 40 });
    /* certifications: listed as intended, so drawn dashed */
    demoWindow(rx, 576, rw, 112, ep(t, 0.7, 1.1));
    cardHead(t, 4.6, rx, 576, rw, 'Intended certifications', ['claim'], { dy: 40 });
    let cxp = rx + 26;
    ['FCC', 'IC', 'CE', 'MIC', 'KC', 'SRRC', 'NCC'].forEach((c, i) => {
      const k = ep(t, 5.0 + i * 0.12, 5.4 + i * 0.12, E.snap), wd = tw(c, { role: 'label', size: 22 }) + 30;
      G.save(); G.globalAlpha = k; G.setLineDash([5, 4]); rrPath(cxp, 576 + 58, wd, 38, 8); G.strokeStyle = A; G.lineWidth = 2; G.stroke(); G.restore();
      text(c, cxp + 15, 576 + 85, { role: 'label', size: 22, color: C.ink, alpha: k });
      cxp += wd + 10;
    });
    /* what the flagships use */
    demoWindow(rx, 704, rw, 108, ep(t, 0.9, 1.3));
    elc_kv(t, 2.0, rx + 26, 704 + 44, rw - 52, [['Starlight X', 'nRF54LM20 at both ends', 'claim'], ['Viper V4 Pro', 'Airoha AB1623MN', 'measured']], { kw: 190, rh: 40 });
    elc_step(t, 7.6, LM, 828, RM - LM, 136, { who: 'Finalmouse Starlight X', num: 'antenna moved "northward"', ev: ['claim'], lim: 'No signal number published for the move.', step: 'Antenna end toward the nose, no carbon ribs over the keep-out, RSSI published front against rear.' });
    source(t, 'Raytac AN54LM-20A page (est. Q3 2026). Starlight X: Finalmouse overview. V4 Pro: TechPowerUp. Board: the 3D layout, a proposal.', { t0: 2 });
  }
});

/* ============================== keep carbon away from the antenna (#68, #101) ============================== */
S({
  id: 'antenna', ch: 'elec', theme: 'paper', title: 'Keep carbon away from the antenna', settle: 10, ideas: [68, 101],
  src: ['cfShield', 'finalInnov', 'slxPdf', 'antDetune', 'elcB2gSlx'],
  draw: t => {
    header(t, 'Keep carbon away from the antenna');
    captions(t, [[0.6, 'Carbon fibre conducts, and a conductive wall shields radio: studies put carbon-filled polymer at about 30 dB, a thousandth of the power.'], [5.2, 'So the antenna end faces the nose with no ribs over it, and the brass inserts, which detune an antenna, stay at the back.']]);
    const A = acc(), x = LM, y = 272, w = 900, h = 540;
    demoWindow(x, y, w, h, ep(t, 0.2, 0.6), { grid: true });
    const s = 4.1, ox = x + 300, oy = y + 286, M = (mx, my) => [ox + mx * s, oy + my * s];
    const kp = ep(t, 0.5, 1.0);
    part(ox, oy, s, () => keyPlanMM({ hi: ['antenna', 'board'] }), { alpha: kp });
    /* the shell wall, carbon-filled: a hatched rim */
    if (kp > 0) { G.save(); G.globalAlpha = kp; G.translate(ox, oy); G.scale(s, s); keyPath(); G.lineWidth = 3.2; G.strokeStyle = TH ? 'rgba(17,17,17,0.55)' : 'rgba(243,242,238,0.5)'; G.setLineDash([0.6, 0.6]); G.stroke(); G.restore(); }
    const ant = M(0, -30.5);
    elc_waves(t, 1.4, ant, -Math.PI / 2, { R: 330, spread: 0.95, wall: (59.4 - 30.5) * s, through: 0.22 });
    /* brass inserts, kept at the back */
    const ins = [M(-19, 44), M(19, 44)], ki = ep(t, 5.6, 6.1, E.snap);
    for (const p of ins) { circle(p[0], p[1], 9 * ki, { fill: '#C9A13F' }); circle(p[0], p[1], 4 * ki, { fill: '#4a3a12' }); }
    callout(t, 1.8, ant, 'Antenna end, toward the nose', { to: [x + 560, y + 120], side: 'r', color: A, maxW: 300 });
    callout(t, 2.6, M(27.5, -40), 'Shell: carbon-filled', { to: [x + 560, y + 250], side: 'r', color: C.ink2, tcolor: C.ink, sub: 'Attenuates what crosses it' });
    callout(t, 6.0, ins[1], 'Brass inserts at the back', { to: [x + 560, y + 440], side: 'r', color: C.ink2, tcolor: C.ink, sub: 'Far from the antenna (#101)' });
    text('Top view, Sora V2 placeholder shape', x + 26, y + h - 22, { role: 'label', size: 21, color: C.faint, alpha: kp });
    /* the wall, in numbers */
    const rx = 1010, rw = RM - rx;
    demoWindow(rx, y, rw, h, ep(t, 0.4, 0.8));
    cardHead(t, 0.6, rx, y, rw, 'Signal lost through the wall', ['study']);
    const X0 = rx + 26, XW = rw - 200, BX = v => X0 + XW * v / 100;
    [['Carbon-filled polymer', 30, 33, C.ink], ['Continuous carbon laminate', 60, 80, C.red]].forEach(([l, a0, b0, col], i) => {
      const yy = y + 146 + i * 84, kk = ep(t, 1.4 + i * 0.3, 2.2 + i * 0.3, E.snap);
      text(l, X0, yy - 14, { role: 'small', weight: 600, color: C.ink, alpha: ep(t, 1.2 + i * 0.3, 1.6 + i * 0.3) });
      rect(X0, yy, (BX(b0) - X0) * kk, 20, { fill: col, alpha: 0.4 }); rect(X0, yy, (BX(a0) - X0) * kk, 20, { fill: col });
      text(a0 + '–' + b0 + ' dB', BX(b0) + 14, yy + 17, { font: 'mono', size: 24, weight: 700, color: col, alpha: kk });
    });
    text('Shielding studies, mostly above 2.4 GHz and on thicker walls than a shell. Every 10 dB is a tenth of the power.', rx + 26, y + 318, { role: 'small', color: C.ink2, maxW: rw - 52, lh: 1.3, t, t0: 2.6, cps: 130 });
    /* #101: metal near an antenna pulls it off its band (illustration) */
    rule(rx + 26, y + 384, rx + rw - 26, ep(t, 3.0, 3.4));
    text('Metal nearby detunes it (#101)', rx + 26, y + 424, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 3.2, 3.6) });
    const kd = ep(t, 3.4, 3.8), near = pingpong(Math.max(0, t - 4), 6), mx0 = rx + 60, mw = rw - 260, my0 = y + 446, mh = 64;
    if (kd > 0) {
      const m = miniAxes(mx0, my0, mw, mh, { xr: [2.3, 2.6], yr: [-25, 0], xticks: [2.3, 2.4, 2.5, 2.6], xfmt: v => v.toFixed(1), alpha: kd });
      rect(m.X(2.4), my0, m.X(2.4835) - m.X(2.4), mh, { fill: rgba(A, 0.16), alpha: kd });
      const f0 = 2.44 - 0.085 * near, dep = 22 - 9 * near, bw = 0.028 + 0.01 * near, pts = [];
      for (let f = 2.3; f <= 2.6; f += 0.003) pts.push([m.X(f), m.Y(-dep / (1 + Math.pow((f - f0) / bw, 2)))]);
      poly(pts, { color: near > 0.55 ? C.red : A, w: 2.5, alpha: kd });
      text(near > 0.55 ? 'Detuned' : 'In band', rx + rw - 26, my0 + 30, { role: 'label', size: 21, color: near > 0.55 ? C.red : A, align: 'right', alpha: kd });
      text('Illustration', rx + rw - 26, my0 + 58, { role: 'label', size: 21, color: C.faint, align: 'right', alpha: kd });
    }
    elc_step(t, 6.6, LM, 828, RM - LM, 136, { who: 'Finalmouse Starlight X', num: '15 titanium screws, ~0.02 g', ev: ['claim'], lim: 'Light, but screws straight into the shell.', step: 'Brass inserts only where the mouse is opened, all at the back, far from the antenna.' });
    source(t, 'Attenuation: review of carbon-fibre polymer EMI shielding. Detuning: Antenova. Starlight X screws: Back2Gaming.', { t0: 2 });
  }
});

/* ============================== capture each frame just in time (sync) ============================== */
S({
  id: 'framesync', ch: 'elec', theme: 'night', title: 'Capture each frame just in time', settle: 10, ideas: ['sync'],
  src: ['kunai', 'xbabSensorLock', 'pcgFrameSync', 'razerFocus', 'slxPdf', 'elcTpuV4'],
  draw: t => {
    header(t, 'Capture each frame just in time');
    captions(t, [[0.6, 'The sensor is a camera taking pictures of the pad. On its own clock, a finished picture waits to be read, then waits again to be sent.'], [4.4, 'Sync the camera to the polls and every report carries motion that was just seen, the same age every time.']]);
    const wx = LM, wy = 272, ww = 1060, wh = 540, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    cardHead(t, 0.6, wx, wy, ww, 'Four 8 kHz reports, 500 µs', ['derived']);
    text('Illustration: 12,000 frames a second against 8,000 polls, 15 µs to process a frame.', wx + 26, wy + 92, { role: 'small', color: C.mute, maxW: ww - 52, alpha: ep(t, 1.0, 1.4) });
    const x0 = wx + 236, x1 = wx + ww - 50, X = us => x0 + (x1 - x0) * us / 500, now = clamp((t - 1.2) / 4.0) * 500;
    const polls = [125, 250, 375, 500], lanes = [{ y: wy + 222, name: 'Own clock', frames: [10, 93.3, 176.7, 260, 343.3, 426.7], col: C.red }, { y: wy + 372, name: 'Synced to polls', frames: [105, 230, 355, 480], col: A }];
    for (const p of polls) { const k = ep(t, 1.0, 1.4); line(X(p), wy + 150, X(p), wy + 430, { color: C.ink2, w: 1.5, dash: [5, 4], alpha: k }); text('Poll', X(p), wy + 456, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: k }); }
    lanes.forEach((L, li) => {
      const k = ep(t, 1.1 + li * 0.3, 1.5 + li * 0.3);
      text(L.name, wx + 26, L.y + 8, { role: 'label', size: 21, color: L.col, alpha: k, maxW: 190 });
      line(X(0), L.y, X(500), L.y, { color: C.faint, w: 1.5, alpha: k });
      for (const f of L.frames) if (f <= now) { rect(X(f) - 3, L.y - 26, 6, 26, { fill: L.col }); circle(X(f), L.y - 30, 8, { fill: rgba(L.col, 0.25) }); }
      polls.forEach(p => { if (p > now) return; const used = L.frames.filter(f => f + 15 <= p).pop(), age = Math.round(p - used), yb = L.y + 20; line(X(used), yb, X(p), yb, { color: L.col, w: 2.5 }); line(X(used), yb - 5, X(used), yb + 5, { color: L.col, w: 2 }); line(X(p), yb - 5, X(p), yb + 5, { color: L.col, w: 2 }); text(age + ' µs', (X(used) + X(p)) / 2, yb + 26, { role: 'label', size: 21, color: L.col, align: 'center' }); });
    });
    if (t > 6.4) {
      const pk = ep(t, 6.4, 6.9), ph = ((t - 6.4) % 3.2) / 3.2 * 530 - 15;
      line(X(ph), wy + 140, X(ph), wy + 432, { color: C.ink, w: 1.5, alpha: 0.3 * pk });
      lanes.forEach(L => { for (const f of L.frames) { const d = Math.abs(ph - f); if (d < 16) { circle(X(f), L.y - 30, 8 + (16 - d) * 0.8, { fill: rgba(L.col, 0.4 * (1 - d / 16)), alpha: pk }); } } });
    }
    text('Bars: a frame captured. Brackets: how old the motion is when the report leaves. On its own clock the age jumps, here 32 to 73 µs; synced, it is the same every time.', wx + 26, wy + 496, { role: 'small', color: C.ink2, maxW: ww - 52, lh: 1.3, t, t0: 5.4, cps: 140 });
    /* the trip, shortened */
    const rx = 1170, rw = RM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    cardHead(t, 0.7, rx, wy, rw, 'Frame to USB, wired, 8 kHz', ['claim']);
    text('Timed by SensorLock\'s developers, both mice the same way.', rx + 26, wy + 92, { role: 'small', color: C.mute, maxW: rw - 52, alpha: ep(t, 1.0, 1.4) });
    const bx = rx + 200, bw2 = rw - 340, BX = us => bx + bw2 * us / 210;
    [['SensorLock', 42, A, '42 µs'], ['FrameSync', 205, C.comp, '+163 µs']].forEach(([l, v, c, lab], i) => { const yy = wy + 150 + i * 52, k = ep(t, 1.6 + i * 0.3, 2.4 + i * 0.3, E.snap); text(l, rx + 26, yy + 8, { role: 'label', size: 21, color: C.ink, alpha: ep(t, 1.4, 1.8) }); rect(bx, yy - 11, (BX(v) - bx) * k, 22, { fill: c }); text(lab, bx + (BX(v) - bx) * k + 12, yy + 8, { font: 'mono', size: 24, weight: 700, color: i ? C.ink2 : A, alpha: k }); });
    rule(rx + 26, wy + 252, rx + rw - 26, ep(t, 2.8, 3.2));
    cardHead(t, 3.0, rx, wy + 230, rw, 'Kunai, light to PC, 8 kHz', ['derived']);
    const KX = us => bx + bw2 * us / 110;
    [['Earlier', 100, C.comp, '~100 µs'], ['Now', 79.6, A, '79.6 µs'], ['Floor', 65, C.ink, '~65 µs']].forEach(([l, v, c, lab], i) => { const yy = wy + 330 + i * 46, k = ep(t, 3.4 + i * 0.25, 4.1 + i * 0.25, E.snap); text(l, rx + 26, yy + 8, { role: 'label', size: 21, color: C.ink, alpha: ep(t, 3.3, 3.7) }); rect(bx, yy - 10, (KX(v) - bx) * k, 20, { fill: c }); text(lab, bx + (KX(v) - bx) * k + 12, yy + 8, { font: 'mono', size: 24, weight: 700, color: i === 1 ? A : C.ink2, alpha: k }); });
    text('On paper, from measured stages. Finalmouse\'s PerfectSync does the same on the Starlight X.', rx + 26, wy + 488, { role: 'small', color: C.ink2, maxW: rw - 52, lh: 1.3, t, t0: 4.6, cps: 130 });
    elc_step(t, 6.6, LM, 828, RM - LM, 136, { who: 'Razer Viper V4 Pro', num: 'FrameSync, 0.34 ms', ev: ['measured'], lim: 'Wireless counts capped at 12 bits; smoothing after each lift.', step: 'The frame locked to every report at every rate, full 16-bit counts, no smoothing after a lift, all shown on screen.' });
    source(t, 'SensorLock: XBAB Tech on X, 2026-10-07. Kunai: tester guide, pre-production. V4 Pro: piaknow 2026-09-15, TechPowerUp.', { t0: 2 });
  }
});

/* ============================== a spare copy of every report (link) ============================== */
S({
  id: 'secondshot', ch: 'elec', theme: 'paper', title: 'A spare copy of every report', settle: 9, ideas: ['link'],
  src: ['kunai'], sfxLoop: [{ t0: 9, per: 5, cues: [[0.24, 'tick'], [0.28, 'tick']] }],
  draw: t => {
    header(t, 'A spare copy of every report');
    captions(t, [[0.6, '2.4 GHz is shared with headsets, phones and Wi-Fi, so some packets get lost. At 1 kHz, one lost report costs up to a full millisecond.'], [3.6, 'Send a spare copy one radio slot early, on another channel, and a lost report is replaced on time.']]);
    const wx = LM, wy = 272, ww = 1040, wh = 580, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    cardHead(t, 0.6, wx, wy, ww, 'One 1 kHz report is eight 125 µs radio slots', ['claim']);
    text('How Second Shot works, from Kunai\'s tester guide.', wx + 26, wy + 92, { role: 'small', color: C.mute, maxW: ww - 52, alpha: ep(t, 1.0, 1.4) });
    const sx0 = wx + 220, sw = (ww - 270) / 8, ly = [wy + 190, wy + 290];
    ['Channel A: the report', 'Channel B: the spare'].forEach((l, i) => text(l, wx + 26, ly[i] + 8, { role: 'label', size: 21, color: i ? A : C.ink, alpha: ep(t, 1.0 + i * 0.2, 1.4 + i * 0.2), maxW: 180, lh: 1.15 }));
    for (let i = 0; i < 8; i++) { const k = ep(t, 1.2 + i * 0.05, 1.5 + i * 0.05); for (const y of ly) rr(sx0 + i * sw + 3, y - 24, sw - 6, 48, 6, inkA(0.04), inkA(0.16), 1.2, k); text(String(i + 1), sx0 + i * sw + sw / 2, wy + 352, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: k }); }
    const c9 = t >= 9 ? (t - 9) % 5 : -1, lostNow = c9 < 0 || Math.floor((t - 9) / 5) % 2 === 1, fo = c9 < 0 ? 1 : 1 - ep(c9, 4.4, 4.9);
    const kSpare = c9 < 0 ? ep(t, 2.0, 2.4) : ep(c9, 1.2, 1.4) * fo, kRep = c9 < 0 ? ep(t, 2.6, 3.0) : ep(c9, 1.4, 1.6) * fo, kLost = lostNow ? (c9 < 0 ? ep(t, 3.4, 3.7) : ep(c9, 1.9, 2.2) * fo) : 0, kSave = lostNow ? (c9 < 0 ? ep(t, 4.2, 4.6) : ep(c9, 2.5, 2.9) * fo) : 0;
    if (c9 >= 0) {
      const sl = clamp(Math.floor(c9 / 0.2), 0, 7), sk = ep(t, 9, 9.3) * (1 - ep(c9, 1.6, 1.9));
      for (const y of ly) rr(sx0 + sl * sw + 1, y - 26, sw - 2, 52, 7, null, inkA(0.55), 1.6, sk);
      if (!lostNow) { const kd = ep(c9, 1.9, 2.2) * fo; text('Report arrives; the spare is dropped', sx0 + 8 * sw, ly[0] - 40, { role: 'label', size: 21, color: C.good, align: 'right', alpha: kd }); }
    }
    rr(sx0 + 6 * sw + 8, ly[1] - 18, sw - 16, 36, 5, A, null, 1, kSpare); text('Spare', sx0 + 6.5 * sw, ly[1] + 7, { role: 'label', size: 21, color: '#111', align: 'center', alpha: kSpare });
    rr(sx0 + 7 * sw + 8, ly[0] - 18, sw - 16, 36, 5, C.comp, null, 1, kRep * (1 - 0.6 * kLost)); text('Report', sx0 + 7.5 * sw, ly[0] + 7, { role: 'label', size: 21, color: '#111', align: 'center', alpha: kRep });
    if (kLost > 0) { const cx = sx0 + 7.5 * sw, cy = ly[0]; line(cx - 22, cy - 22, cx + 22, cy + 22, { color: C.red, w: 4, alpha: kLost }); line(cx + 22, cy - 22, cx - 22, cy + 22, { color: C.red, w: 4, alpha: kLost }); text('Lost', cx, cy - 34, { role: 'label', size: 21, color: C.red, align: 'center', alpha: kLost }); }
    if (kSave > 0) { arrow(sx0 + 7 * sw - 4, ly[1], sx0 + 8 * sw + 26, ly[1], { color: A, w: 3, hs: 10, alpha: kSave }); text('The PC gets the spare, on time', sx0 + 8 * sw + 26, ly[1] + 44, { role: 'label', size: 21, color: A, align: 'right', alpha: kSave }); }
    rule(wx + 26, wy + 392, wx + ww - 26, ep(t, 4.8, 5.2));
    text('Without it, a lost report at 1 kHz costs up to a full millisecond. With it, the PC gets motion about 200 µs older, right on time.', wx + 26, wy + 436, { role: 'small', size: 26, weight: 600, color: C.ink, maxW: ww - 52, lh: 1.32, t, t0: 5.0, cps: 110 });
    text('At 8 kHz every report carries the full running count, so a lost packet\'s motion arrives 125 µs later, inside the next report.', wx + 26, wy + 518, { role: 'small', color: C.ink2, maxW: ww - 52, lh: 1.32, t, t0: 6.0, cps: 120 });
    const rx = 1150, rw = RM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    cardHead(t, 0.7, rx, wy, rw, 'Measured by its developer', ['claim']);
    bignum(t, 1.6, rx + 26, wy + 196, '99 to 100', '%', { size: 72, color: TH ? C.ink : A });
    text('of lost reports rescued at 4 kHz, with a wireless headset in use nearby.', rx + 26, wy + 246, { role: 'small', color: C.ink2, maxW: rw - 52, lh: 1.3, t, t0: 2.0, cps: 120 });
    text('At the weakest signal tried, 0.67% of reports were lost, and 15 of 220,017 stayed lost.', rx + 26, wy + 336, { role: 'small', color: C.ink2, maxW: rw - 52, lh: 1.3, t, t0: 2.8, cps: 120 });
    text('The worst room: about 92%, next to a headset base station using nearly every channel.', rx + 26, wy + 426, { role: 'small', color: C.ink2, maxW: rw - 52, lh: 1.3, t, t0: 3.6, cps: 120 });
    text('No mouse maker publishes packet loss yet. Theseus should, at 8 kHz, in a crowded room.', rx + 26, wy + 516, { role: 'small', weight: 700, color: C.ink, maxW: rw - 52, lh: 1.3, t, t0: 4.6, cps: 110 });
    gloss(t, 2.8, 'Packet loss', 'A report the receiver never hears, usually because something else was talking on that channel. The PC sees a missed poll.');
    featureCard(t, 6.4, 'A spare copy, one slot early', ['claim', 'proposal'], 'Recover 99% or more of lost reports at every rate, and publish the measured loss.');
    source(t, 'Kunai tester guide, firmware 96.79, pre-production (supplied by Brock).', { t0: 2 });
  }
});

/* ============================== the polling tax (battery across mice) ============================== */
S({
  id: 'power', ch: 'elec', theme: 'night', title: 'The polling tax', settle: 10, ideas: ['battery'],
  src: ['razerBatt', 'nbcV4', 'elcTpuV4', 'paw3395', 'exEloshapes', 'exNbcV4', 'exJauch'],
  draw: t => {
    header(t, 'The polling tax');
    captions(t, [[0.6, 'Every report costs current. Razer\'s own figures for one mouse: 95 hours at 1 kHz, 17 at 8 kHz, a fifth of the battery life.'], [5.4, 'Across the flagships, the 1 kHz claims run from 80 to 180 hours, and the lightest mice publish none at all.']]);
    const A = acc(), wx = LM, wy = 272, ww = 840, wh = 540;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    cardHead(t, 0.6, wx, wy, ww, 'Viper V3 Pro, hours by polling rate', ['claim']);
    const data = [['1 kHz', 95], ['2 kHz', 62], ['4 kHz', 40], ['8 kHz', 17]];
    const bx = wx + 70, bw = 120, base = wy + 360, sc = 2.2;
    line(wx + 40, base, wx + ww - 40, base, { color: C.faint, w: 1.5, alpha: ep(t, 1.0, 1.4) });
    data.forEach(([l, h], i) => {
      const x = bx + i * 180, k = ep(t, 1.3 + i * 0.25, 2.1 + i * 0.25, E.snap), col = i === 3 ? C.red : C.comp;
      rect(x, base - h * sc * k, bw, h * sc * k, { fill: col }); glint(x, base - h * sc * k, bw, h * sc * k, t, 5 + i * 0.3, 7);
      text(countUp(h + ' h', k) || h + ' h', x + bw / 2, base - h * sc * k - 14, { font: 'mono', size: 28, weight: 700, color: i === 3 ? C.red : C.ink, align: 'center', alpha: k });
      text(l, x + bw / 2, base + 34, { role: 'label', size: 22, color: C.ink, align: 'center', alpha: ep(t, 1.2, 1.6) });
    });
    rule(wx + 26, wy + 428, wx + ww - 26, ep(t, 3.0, 3.4));
    rich([{ s: 'Why', role: 'label', size: 21, color: C.mute }], wx + 26, wy + 470, { alpha: ep(t, 3.2, 3.6) });
    pill(wx + ww - 26 - pillW('datasheet'), wy + 472, 'datasheet', ep(t, 3.2, 3.6));
    text('PixArt\'s PAW3395 draws 1.7 mA in its 1 kHz mode and 10 mA in its 8 kHz corded mode: the sensor alone, about six times the current.', wx + 26, wy + 506, { role: 'small', color: C.ink2, maxW: ww - 52, lh: 1.3, t, t0: 3.4, cps: 130 });
    /* hours at 1 kHz across the mice that publish them */
    const rx = wx + ww + 30, rw = RM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    cardHead(t, 0.8, rx, wy, rw, 'Battery life at 1 kHz, claimed', ['claim', 'derived']);
    const ms = ((RD.mice || {}).mice || []).filter(m => m.connection !== 'wired' && rv(m.battery_claim_1k_h));
    const byV = {};
    ms.forEach(m => { const v = rv(m.battery_claim_1k_h), nm = exShort(m.name).replace('Razer DeathAdder V4 Pro', 'DeathAdder V4 Pro').replace('Logitech Superstrike', 'Superstrike').replace('Logitech GPX2', 'GPX2').replace('Razer ', '').replace('ZOWIE ', '').replace('Xiaomi Gaming Mouse 2', 'Xiaomi GM2').replace(/\s*\(.*$/, ''); const cap = rv(m.battery_mAh), key = v + '|' + (cap || '') + '|' + m.brand; (byV[key] = byV[key] || { v, cap, names: [], id: m.id }).names.push(nm); });
    let rows = Object.values(byV).map(g => ({ name: g.names.join(', '), qual: g.cap ? g.cap + ' mAh' : (g.id === 'razer-deathadder-v4-pro' ? 'rate not stated' : ''), v: g.v, ref: g.id === 'razer-viper-v4-pro' }));
    rows.push({ name: 'Theseus', qual: 'as budgeted', v: 146, hero: true });
    rows.sort((a, b) => b.v - a.v);
    lollipop(t, { x: rx + 26, y: wy + 148, w: rw - 52, t0: 1.0, rows: rows.length > 1 ? rows : [{ name: 'placeholder', v: 100 }], xr: [0, 200], ticks: [0, 50, 100, 150, 200], tfmt: v => v + ' h', fmt: v => v + ' h', rowH: 38, labelW: 380, valW: 76, nsize: 25, placeholder: rows.length <= 1 });
    text('No rating published: Starlight X, ULX, Sora V2, Beast X, X2 CrazyLight.', rx + 26, wy + wh - 24, { role: 'small', weight: 600, color: C.red, maxW: rw - 52, alpha: ep(t, 4.0, 4.4) });
    gloss(t, 2.8, 'Polling rate', 'How many reports a second the mouse sends. 8 kHz is one every 125 µs, eight times the radio traffic of 1 kHz.');
    featureCard(t, 5.8, 'Hours at every rate, measured', ['derived', 'proposal'], 'Theseus as budgeted: 0.96 Wh at the Viper V4 Pro\'s 6.6 mW draw, about 146 h. The published figure will be a run-down at 1, 2, 4 and 8 kHz.');
    source(t, 'Razer support; Notebookcheck; TechPowerUp; maker pages via research/data/mice.json; PixArt PAW3395 datasheet. Theseus: Jauch 250 mAh pack.', { t0: 2 });
  }
});

/* ============================== sync saves battery, too ============================== */
S({
  id: 'syncpower', ch: 'elec', theme: 'paper', title: 'Sync saves battery, too', settle: 9, ideas: ['sync', 'battery'],
  src: ['razerBatt', 'nbcV4', 'slxPdf', 'slxB2g', 'kunai', 'exJauch'],
  draw: t => {
    header(t, 'Sync saves battery, too');
    captions(t, [[0.6, 'The first mouse with FrameSync claims about twice the battery of the one before it, and nearly three times at 8 kHz.'], [3.8, 'Part of that is new chips and a new cell. Sync helps too: a sensor that captures at the right moment can capture less often.']]);
    const wx = LM, wy = 272, ww = 940, wh = 580, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    cardHead(t, 0.6, wx, wy, ww, 'The Viper before and after FrameSync', ['claim']);
    const base = wy + 420, sc = 1.45, groups = [['1 kHz', 95, 180], ['8 kHz', 17, 45]];
    line(wx + 60, base, wx + ww - 60, base, { color: C.faint, w: 1.5, alpha: ep(t, 1.0, 1.4) });
    groups.forEach(([g, a, b], gi) => {
      const gx = wx + 120 + gi * 400; text(g, gx + 125, base + 34, { role: 'label', size: 22, color: C.ink, align: 'center', alpha: ep(t, 1.2, 1.6) });
      [['V3 Pro', a, C.comp], ['V4 Pro', b, C.ink]].forEach(([l, v, c], j) => { const x = gx + j * 140, k = ep(t, 1.4 + gi * 0.5 + j * 0.25, 2.2 + gi * 0.5 + j * 0.25, E.snap), h2 = v * sc * k; rect(x, base - h2, 110, h2, { fill: c }); text(countUp(v + ' h', k) || v + ' h', x + 55, base - h2 - 14, { font: 'mono', size: 26, weight: 700, color: C.ink, align: 'center', alpha: k }); text(l, x + 55, base + 64, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: k }); });
      const kk = ep(t, 3.0 + gi * 0.3, 3.4 + gi * 0.3); text('×' + (b / a).toFixed(1), gx + 250, base - b * sc - 54, { font: 'disp', size: 40, weight: 800, color: C.ink, alpha: kk });
    });
    text('The V4 Pro changed chips and cell too, so not all of the gain is sync. Finalmouse credits PerfectSync for the Starlight X\'s battery, with no hour rating.', wx + 26, wy + 524, { role: 'small', color: C.mute, maxW: ww - 52, lh: 1.3, alpha: ep(t, 3.6, 4.0) });
    const rx = wx + ww + 30, rw = RM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    cardHead(t, 0.8, rx, wy, rw, 'Why sync saves current', ['derived']);
    text('The LED flashes once per frame. Synced, every read gets a fresh frame, so the sensor can flash less often.', rx + 26, wy + 112, { role: 'small', color: C.ink2, maxW: rw - 52, lh: 1.32, t, t0: 1.2, cps: 130 });
    const items = [['Smart sleep, Kunai', 'Sleeps 10 s after the hand leaves; wakes on a touch.'], ['Head start, Kunai', 'The first move after a rest goes out in the next 125 µs slot.'], ['Second Shot, Kunai', 'The spare copy runs only while packets are being lost.']];
    items.forEach(([h2, b], i) => { const y = wy + 248 + i * 96, k = ep(t, 2.6 + i * 0.4, 3.0 + i * 0.4); rule(rx + 26, y - 34, rx + rw - 26, k); text(h2, rx + 26, y, { role: 'label', size: 21, color: TH ? C.ink : A, alpha: k }); text(b, rx + 26, y + 34, { role: 'small', color: C.ink2, alpha: k, maxW: rw - 52, lh: 1.3 }); });
    rich([{ s: 'Theseus, as budgeted', role: 'label', size: 21, color: C.onHero, chip: C.heroChip }], rx + 32, wy + wh - 30, { alpha: ep(t, 4.4, 4.8) });
    text('146 h at 1 kHz, 32 h at 8 kHz', rx + 330, wy + wh - 30, { font: 'mono', size: 24, weight: 700, color: C.ink, alpha: ep(t, 4.6, 5.0) });
    gloss(t, 2.8, 'Frame', 'One picture of the pad taken by the sensor\'s camera. The LED flashes once per frame, and the sensor works out motion by comparing frames.');
    featureCard(t, 5.6, 'Battery from sync and sleep', ['claim', 'derived', 'proposal'], 'Frames captured only when they\'re needed, sleep driven by the button sensors, a spare copy only when the room needs it.');
    source(t, 'Razer support and Notebookcheck (claims). Theseus: 0.96 Wh at the V4 Pro\'s 6.6 mW (1 kHz, claimed) and 29.6 mW (8 kHz, measured), derived.', { t0: 2 });
  }
});

/* ============================== the PMIC: one chip runs the power (pmic) ============================== */
/** one block of the PMIC diagram */
function elc_blk(x, y, w, h, label, sub, on, a, col) {
  rr(x, y, w, h, 8, on > 0.01 ? rgba(col, (TH ? 0.16 : 0.2) * on) : null, on > 0.5 ? col : inkA(0.28), 1.6, a);
  if (on > 0.01) rr(x, y, w, h, 8, null, col, 1.8, a * on);
  text(label, x + 14, y + (sub ? 25 : h / 2 + 8), { role: 'label', size: 21, color: C.ink, alpha: a });
  if (sub) text(sub, x + 14, y + 50, { font: 'mono', size: 21, weight: 500, color: C.mute, alpha: a });
}
S({
  id: 'elc_pmic', ch: 'elec', theme: 'night', title: 'The PMIC: one chip runs the power', settle: 10, ideas: ['pmic'], three: ['pcb'],
  src: ['elcNpm', 'elcNpmChg', 'elcGauge', 'elcLayout', 'npm1300'],
  draw: t => {
    header(t, 'The PMIC: one chip runs the power');
    captions(t, [[0.6, 'The nPM1300 takes USB in, charges the cell, makes the rails for the radio and the sensor, and counts every charge in and out.'], [5.6, 'Unplugged, the current runs the other way: cell, PMIC, two small switching regulators, then the radio module and the sensor.']]);
    const A = acc(), x = LM, y = 272, w = 900, h = 580;
    demoWindow(x, y, w, h, ep(t, 0.2, 0.6));
    const run = t >= 6.0, ph = ep(t, 5.4, 6.8, E.cam);
    const pw = run ? ep(t, 6.0, 6.6) : ep(t, 1.2, 1.8) * (1 - ep(t, 5.4, 5.9));
    const P = elc_v3('pcb', t, x + 2, y + 2, w - 4, h - 4, { view: ELC.top, target: elc_W(lerp(0, -7.5, ph), lerp(24, 11.5, ph), 1), zoom: lerp(1.55, 3.0, ph), power: pw, powerMode: run ? 'run' : 'charge', powerT: t });
    const k1 = ep(t, 1.6, 2.0) * (1 - ep(t, 5.2, 5.6)), k2 = ep(t, 6.8, 7.2);
    elc_key(x + 26, y + 46, run ? ELC.run : ELC.chg, run ? 'On battery: cell, PMIC, radio and sensor' : 'Plugged in: USB-C, PMIC, cell', ep(t, 1.4, 1.8));
    if (P) {
      if (k1 > 0) {
        callout(t, 1.8, P(elc_W(0, 50.4, 2.5)), 'USB-C in', { to: [x + 160, y + 140], side: 'l', color: ELC.chg, alpha: k1 });
        callout(t, 2.6, P(elc_W(-9.6, 11.2, 0.9)), 'nPM1300', { to: [x + w - 210, y + 300], side: 'r', color: ELC.chg, alpha: k1 });
        callout(t, 3.4, P(elc_W(-14, 3.2, 1.5)), 'The cell', { to: [x + w - 210, y + 470], side: 'r', color: ELC.chg, alpha: k1, sub: 'JST plug' });
      }
      if (k2 > 0) {
        callout(t, 6.9, P(elc_W(-9.6, 11.2, 0.9)), 'nPM1300', { to: [x + w - 230, y + 120], side: 'r', color: A, alpha: k2, sub: '5 × 5 mm QFN' });
        callout(t, 7.3, P(elc_W(-14.35, 10.7, 1.0)), 'Buck inductors', { to: [x + w - 230, y + 270], side: 'r', color: A, alpha: k2, sub: 'One per regulator' });
        callout(t, 7.7, P(elc_W(1.5, 18, 2.0)), 'Radio module', { to: [x + 60, y + 150], side: 'r', color: A, alpha: k2 });
        callout(t, 8.1, P(elc_W(1.5, 4.0, 2.0)), 'Sensor', { to: [x + 60, y + 470], side: 'r', color: A, alpha: k2 });
      }
    }
    /* inside the PMIC: the blocks the current passes through */
    const rx = LM + w + 30, rw = RM - rx, ry = 272, rh = 400, kD = ep(t, 0.5, 0.9);
    demoWindow(rx, ry, rw, rh, kD);
    cardHead(t, 0.7, rx, ry, rw, 'Inside the nPM1300', ['datasheet']);
    const fx = rx + 256, fw = 290, bh = 56, gy = ry + 98, by = i => gy + 18 + i * 62;
    const chg = run ? 0 : ep(t, 1.4, 1.9), rn = run ? ep(t, 6.2, 6.8) : 0, gau = Math.max(chg, rn), col = run ? ELC.run : ELC.chg;
    rr(fx - 12, gy - 6, fw + 24, 5 * 62 + 24, 12, null, A, 2, kD);
    text('nPM1300', fx + fw / 2, gy - 18, { role: 'label', size: 22, color: A, align: 'center', alpha: kD });
    const blocks = [['Charger', '32–800 mA', chg], ['Buck 1', '200 mA, radio', rn], ['Buck 2', '200 mA, sensor', rn], ['Fuel gauge', 'charge, health', gau], ['Watchdog', 'ship 370 nA', 0]];
    blocks.forEach(([l, s, on], i) => elc_blk(fx, by(i), fw, bh, l, s, on, ep(t, 1.0 + i * 0.12, 1.4 + i * 0.12), col));
    elc_blk(rx + 26, by(0), 160, bh, 'USB-C', '4.0–5.5 V', chg, ep(t, 1.2, 1.6), col);
    elc_blk(rx + 26, by(2), 160, bh, 'Cell', '3.7 V', Math.max(chg, rn), ep(t, 1.2, 1.6), col);
    const outs = [['Radio', 'module', 1, rn], ['Sensor', 'own rail', 2, rn], ['MCU', 'over I²C', 3, gau]];
    outs.forEach(([l, s, row, on]) => elc_blk(rx + rw - 26 - 160, by(row), 160, bh, l, s, on, ep(t, 1.4, 1.8), col));
    /* the wires, with current moving on the live ones (the arrows of each list run with the current) */
    const L = rx + 186, R0 = fx, R1 = fx + fw, Ro = rx + rw - 186, mid = i => by(i) + bh / 2;
    const wires = [[[L, mid(0)], [R0, mid(0)], chg], [[R0, mid(0) + 18], [L, mid(2) - 18], chg],
      [[L, mid(2) - 6], [R0, mid(1)], rn], [[L, mid(2)], [R0, mid(2)], rn], [[R1, mid(1)], [Ro, mid(1)], rn], [[R1, mid(2)], [Ro, mid(2)], rn],
      [[L, mid(2) + 8], [R0, mid(3)], gau], [[R1, mid(3)], [Ro, mid(3)], gau]];
    wires.forEach(([a0, b0, on]) => {
      line(a0[0], a0[1], b0[0], b0[1], { color: on > 0.01 ? col : inkA(0.25), w: on > 0.01 ? 2.5 : 1.5, alpha: kD });
      if (on > 0.05) for (let i = 0; i < 3; i++) { const p = ((t * 0.9 + i / 3) % 1); circle(lerp(a0[0], b0[0], p), lerp(a0[1], b0[1], p), 4, { fill: col, alpha: on }); }
    });
    /* one IC where a discrete design has several */
    const qy = 688, qh = 164;
    demoWindow(rx, qy, rw, qh, ep(t, 0.9, 1.3));
    cardHead(t, 3.0, rx, qy, rw, 'Fewer support chips', ['derived'], { dy: 40 });
    const parts6 = ['Charger', 'LDO', 'Gauge', 'Sense R', 'Reset', 'Watchdog'], mk = ep(t, 4.0, 5.0, E.cam), ka = ep(t, 3.2, 3.6);
    let px0 = rx + 26;
    const ws = parts6.map(p => tw(p, { role: 'label', size: 21 }) + 22);
    parts6.forEach((p, i) => {
      const x0 = px0, x1 = rx + 26 + (150 - ws[i]) / 2, xx = lerp(x0, x1, mk);
      rr(xx, qy + 66, ws[i], 40, 7, C.panel, inkA(0.35), 1.5, ka * (1 - 0.85 * ep(t, 4.7, 5.0)));
      text(p, xx + 11, qy + 93, { role: 'label', size: 21, color: C.ink, alpha: ka * (1 - ep(t, 4.5, 4.9)) });
      px0 += ws[i] + 8;
    });
    const km = ep(t, 4.8, 5.2, E.snap);
    if (km > 0) { rr(rx + 26, qy + 60, 150, 52, 8, rgba(A, 0.18), A, 2, km); text('nPM1300', rx + 101, qy + 94, { role: 'label', size: 21, color: C.ink, align: 'center', alpha: km }); }
    text('One IC for four to six, plus JEITA, a gauge and a watchdog. It still needs 2 inductors and 6 capacitors on this board.', rx + 200, qy + 74, { role: 'small', color: C.ink2, maxW: rw - 226, lh: 1.28, t, t0: 5.2, cps: 120 });
    gloss(t, 3.2, 'PMIC', 'Power management IC: one chip that charges the cell, makes the supply rails, and watches the battery.');
    featureCard(t, 8.2, 'Nordic nPM1300', ['datasheet', 'proposal'], 'Charger, two 200 mA bucks, two LDOs, a fuel gauge and a watchdog, feeding the radio module and the sensor.');
    source(t, 'Nordic nPM1300 product page and specification. Board, parts and current paths: the Theseus 3D layout, a proposal.', { t0: 2 });
  }
});

/* ============================== charging: at the cell's limit, not the charger's ============================== */
const ELC_OCV = [[0, 3.0], [0.05, 3.45], [0.1, 3.6], [0.2, 3.68], [0.3, 3.73], [0.4, 3.77], [0.5, 3.81], [0.6, 3.86], [0.7, 3.93], [0.8, 4.0], [0.9, 4.08], [1.0, 4.2]];
function elc_ocv(s) { const P = ELC_OCV; if (s <= 0) return P[0][1]; for (let i = 1; i < P.length; i++) if (s <= P[i][0]) return lerp(P[i - 1][1], P[i][1], (s - P[i - 1][0]) / (P[i][0] - P[i - 1][0])); return P[P.length - 1][1]; }
/** a CC/CV charge in C-rate units: c (C) until the terminal voltage reaches 4.2 V, then 4.2 V until the current falls to 10% (the nPM1300 default).
   rq: series resistance × capacity (V per C), a typical value. returns { pts: [[min, soc]], cc: [min, soc], end: [min, soc] } */
function elc_ccv(c, s0 = 0.1, rq = 0.21) {
  const pts = []; let s = s0, tm = 0, cc = null; const dt = 0.25;
  for (let i = 0; i < 4000; i++) {
    let I = c;
    if (!cc && elc_ocv(s) + c * rq >= 4.2) cc = [tm, s];
    if (cc) I = Math.max(0, (4.2 - elc_ocv(s)) / rq);
    pts.push([tm, s]);
    if (cc && I <= 0.1 * c) break;
    s = Math.min(1, s + I * dt / 60); tm += dt;
  }
  return { pts, cc, end: pts[pts.length - 1] };
}
const ELC_CHG = { fast: null, slow: null };
S({
  id: 'elc_charge', ch: 'elec', theme: 'paper', title: 'Charge at the cell\'s limit', settle: 10, ideas: ['pmic', 'battery'],
  src: ['elcTpuV4', 'tpuUlx', 'tpuX2h', 'elcNpm', 'elcNpmChg', 'exJauch', 'elcGauge', 'exBu409'],
  draw: t => {
    header(t, 'Charge at the cell\'s limit');
    captions(t, [[0.6, 'The fastest flagships charge at 0.13 to 0.28 A. The nPM1300 can push 0.8 A, so the charger is not the limit: the cell\'s datasheet is.'], [5.0, 'At 1C instead of the Viper V4 Pro\'s 0.55C, the constant-current part takes about half as long, if the cell is rated for 1C.']]);
    const A = acc(), y = 272, h = 392;
    /* measured charge currents, and the ceilings */
    const lx = LM, lw = 860;
    demoWindow(lx, y, lw, h, ep(t, 0.3, 0.7));
    cardHead(t, 0.5, lx, y, lw, 'Charge current', ['measured', 'datasheet']);
    const x0 = lx + 300, xw = lw - 300 - 120, X = v => x0 + xw * v / 0.85;
    const rows = [['Finalmouse ULX', '', 0.131, 0.131, 'measured'], ['Razer Viper V4 Pro', '≈ 0.55C, 306 mAh', 0.169, 0.169, 'measured'], ['Pulsar X2H', '', 0.27, 0.28, 'measured'], ['Theseus, 1C cell', '250 mAh, if rated', 0.25, 0.25, 'proposal']];
    for (const v of [0, 0.2, 0.4, 0.6, 0.8]) { line(X(v), y + 110, X(v), y + 330, { color: C.hair, w: 1, alpha: ep(t, 0.8, 1.2) }); text(v.toFixed(1) + ' A', X(v), y + 362, { role: 'tick', color: C.mute, align: 'center', alpha: ep(t, 0.8, 1.2) }); }
    rows.forEach(([nm, sub, lo, hi, ev], i) => {
      const yy = y + 138 + i * 54, k = ep(t, 1.0 + i * 0.2, 1.8 + i * 0.2, E.snap), hero = ev === 'proposal';
      text(nm, lx + 26, yy + (sub ? 0 : 8), { role: 'small', weight: hero ? 800 : 600, color: C.ink, alpha: ep(t, 0.9 + i * 0.2, 1.3 + i * 0.2) });
      if (sub) text(sub, lx + 26, yy + 26, { role: 'label', size: 21, color: hero ? C.heroText : C.mute, alpha: ep(t, 0.9 + i * 0.2, 1.3 + i * 0.2) });
      if (hero) { G.save(); G.globalAlpha = 1; G.setLineDash([6, 5]); G.strokeStyle = C.heroText; G.lineWidth = 2; G.strokeRect(x0, yy - 10, (X(hi) - x0) * k, 20); G.restore(); rect(x0, yy - 10, (X(hi) - x0) * k, 20, { fill: rgba(C.hero, 0.55) }); }
      else { rect(x0, yy - 10, (X(lo) - x0) * k, 20, { fill: i === 1 ? C.ink : C.comp }); if (hi > lo) rect(X(lo), yy - 10, (X(hi) - X(lo)) * k, 20, { fill: C.comp, alpha: 0.5 }); }
      text(hi > lo ? lo.toFixed(2) + '–' + hi.toFixed(2) + ' A' : hi.toFixed(3).replace(/0$/, '') + ' A', X(hi) * 1 + 12, yy + 8, { font: 'mono', size: 24, weight: 700, color: C.ink, alpha: k });
      evDot(lx + lw - 20, yy, ev, 5.5, k);
    });
    const kc = ep(t, 2.6, 3.0);
    line(X(0.8), y + 104, X(0.8), y + 334, { color: C.ink, w: 2, dash: [5, 4], alpha: kc });
    text('nPM1300 max', X(0.8), y + 96, { role: 'label', size: 21, color: C.ink, align: 'right', alpha: kc });
    line(X(0.125), y + 104, X(0.125), y + 334, { color: C.red, w: 2.5, alpha: ep(t, 3.4, 3.8) });
    text('Jauch 250 mAh pack: 0.5C max', X(0.125) + 8, y + 96, { role: 'label', size: 21, color: C.red, alpha: ep(t, 3.4, 3.8) });
    /* one charge, two rates (a model) */
    const rx = LM + lw + 30, rw = RM - rx;
    demoWindow(rx, y, rw, h, ep(t, 0.5, 0.9));
    cardHead(t, 0.7, rx, y, rw, 'One charge, 0.55C against 1C, modelled', ['derived']);
    if (!ELC_CHG.fast) { ELC_CHG.fast = elc_ccv(1.0); ELC_CHG.slow = elc_ccv(0.55); }
    const F = ELC_CHG.fast, Sl = ELC_CHG.slow;
    const m = axes(t, { x: rx + 110, y: y + 100, w: rw - 160, h: 178, t0: 1.0, xr: [0, 120], yr: [0, 100], xticks: [0, 30, 60, 90, 120], yticks: [0, 50, 100], xfmt: v => v + ' min', yfmt: v => v + '%' });
    const kS = ep(t, 1.4, 3.0, E.io3), kF = ep(t, 1.8, 3.4, E.io3);
    series(m, Sl.pts.map(p => [p[0], p[1] * 100]), { color: C.ink, w: 3, p: kS });
    series(m, F.pts.map(p => [p[0], p[1] * 100]), { color: C.hero, w: 5, p: kF });
    const kd = ep(t, 3.6, 4.0);
    for (const [Q, col, lab, dy] of [[F, C.hero, '1C: CC ends', -16], [Sl, C.ink, '0.55C: CC ends', 30]]) {
      const px = m.X(Q.cc[0]), py = m.Y(Q.cc[1] * 100);
      if (col === C.hero) heroMark(px, py, 9, kd); else circle(px, py, 7, { fill: col, alpha: kd });
      text(lab, px + (col === C.hero ? -14 : 14), py + dy, { role: 'label', size: 21, color: C.ink, align: col === C.hero ? 'right' : 'left', alpha: kd });
    }
    /* the gauge's time to full, as the receiver would show it */
    const tp = clamp(((t - 4.6) * 9) % 76, 0, 70), soc = (F.pts.find(p => p[0] >= tp) || F.end)[1], ttf = Math.max(0, Math.round(F.end[0] - tp)), kr = ep(t, 4.4, 4.8);
    if (kr > 0) { const px = m.X(tp); line(px, y + 100, px, y + 278, { color: C.ink2, w: 1.5, dash: [4, 4], alpha: kr * 0.7 }); }
    rr(rx + rw - 300, y + 296, 274, 52, 8, '#0b0c0d', null, 1, kr);
    text(Math.round(soc * 100) + '%   Full in ' + ttf + ' min', rx + rw - 286, y + 330, { font: 'mono', size: 23, weight: 700, color: '#EBEAE6', alpha: kr });
    text('Receiver screen, from the gauge (illustration)', rx + rw - 26, y + 372, { role: 'label', size: 21, color: C.faint, align: 'right', alpha: kr });
    text('CC, then 4.2 V until the current falls to 10%. Typical cell values, not a measurement.', rx + 26, y + 312, { role: 'small', color: C.mute, maxW: rw - 340, lh: 1.25, alpha: ep(t, 3.0, 3.4) });
    elc_step(t, 6.2, LM, 680, RM - LM, 136, { who: 'Razer Viper V4 Pro', num: '0.169 A ≈ 0.55C', ev: ['measured', 'derived'], lim: 'About half the current a 1C-rated cell could take.', step: '1C only when the cell is rated for it, with the JEITA and die-temperature limits shown live on the receiver.' });
    gloss(t, 3.0, 'C-rate', 'Charge current divided by capacity. 1C on a 250 mAh cell is 250 mA, about an hour plus the slow top-off.');
    featureCard(t, 7.6, 'Fast charging, cell permitting', ['datasheet', 'proposal'], 'Up to 800 mA from the PMIC; the cell sets the real limit. A 1C cell, or no fast-charge claim.');
    source(t, 'Currents: TechPowerUp. 0.55C = 0.169 A ÷ 0.306 Ah. Jauch LP502030JH: 0.5C max charge. Curves: CC/CV model, rq 0.21 V/C.', { t0: 2 });
  }
});

/* ============================== a safer battery: JEITA, die temperature, input, ship mode ============================== */
S({
  id: 'elc_safe', ch: 'elec', theme: 'night', title: 'A safer battery', settle: 10, ideas: ['pmic', 'battery'], three: ['battery'],
  src: ['elcNpmJeita', 'elcNpmChg', 'elcNpm', 'elcBu802', 'exJauch'],
  draw: t => {
    header(t, 'A safer battery');
    captions(t, [[0.6, 'The PMIC reads the cell\'s own thermistor and follows JEITA: half current when cool, a lower charge voltage when warm, none below 0 °C or above 60 °C.'], [5.6, 'It also pauses charging if its own die runs hot, is protected to 22 V at the input, and draws 370 nA when the switch is off.']]);
    const A = acc(), x = LM, y = 272, w = 1000, h = 580;
    demoWindow(x, y, w, h, ep(t, 0.2, 0.6));
    cardHead(t, 0.4, x, y, w, 'Charge current against cell temperature', ['datasheet']);
    const m = axes(t, { x: x + 130, y: y + 150, w: w - 190, h: 290, t0: 0.8, xr: [-10, 70], yr: [0, 110], xticks: [-10, 0, 10, 20, 30, 40, 50, 60, 70], yticks: [0, 50, 100], xfmt: v => v + ' °C', yfmt: v => v + '%' });
    const ka = ep(t, 1.0, 1.6);
    const zones = [[-10, 0, 'Cold', C.red, 0], [0, 10, 'Cool', C.ink2, 50], [10, 45, 'Normal', C.ink2, 100], [45, 60, 'Warm', C.ink2, 100], [60, 70, 'Hot', C.red, 0]];
    zones.forEach(([a0, b0, l, col, v], i) => {
      const xa = m.X(a0), xb = m.X(b0), k = ep(t, 1.2 + i * 0.1, 1.6 + i * 0.1);
      if (col === C.red) rect(xa, y + 150, xb - xa, 290, { fill: rgba(C.red, 0.12), alpha: k });
      if (l === 'Warm') { G.save(); G.globalAlpha = k * 0.6; G.beginPath(); G.rect(xa, m.Y(100), xb - xa, m.Y(0) - m.Y(100)); G.clip(); G.strokeStyle = inkA(0.35); G.lineWidth = 1.2; G.beginPath(); for (let s2 = -320; s2 < 320; s2 += 12) { G.moveTo(xa + s2, m.Y(0)); G.lineTo(xa + s2 + 300, m.Y(0) - 300); } G.stroke(); G.restore(); }
      text(l, (xa + xb) / 2, y + 136, { role: 'label', size: 21, color: col === C.red ? C.red : C.mute, align: 'center', alpha: k });
    });
    const curve = [[-10, 0], [0, 0], [0, 50], [10, 50], [10, 100], [60, 100], [60, 0], [70, 0]].map(([a0, b0]) => [m.X(a0), m.Y(b0)]);
    poly(curve, { color: A, w: 4, p: ep(t, 1.6, 3.0, E.io3) });
    text('Lower charge voltage', m.X(52.5), m.Y(100) + 34, { role: 'label', size: 21, color: C.ink, align: 'center', alpha: ep(t, 3.0, 3.4) });
    /* a thermometer sweeps the range; the current follows */
    const Tc = kf(((t - 3.2) % 9 + 9) % 9, [[0, 24], [1.6, -6], [2.6, -6], [4.0, 5], [4.8, 5], [6.2, 52], [7.0, 52], [7.8, 66], [8.4, 66], [9, 24]]);
    const cur = Tc < 0 || Tc > 60 ? 0 : Tc < 10 ? 50 : 100, kt = ep(t, 3.2, 3.6);
    if (kt > 0) {
      const px = m.X(Tc);
      line(px, y + 150, px, y + 440, { color: C.ink, w: 1.5, dash: [4, 4], alpha: kt * 0.8 });
      circle(px, m.Y(cur), 10, { fill: A, alpha: kt }); circle(px, m.Y(cur), 18, { color: A, w: 2, alpha: kt * 0.5 });
      const lab = Math.round(Tc) + ' °C   ' + (cur ? Math.round(250 * cur / 100) + ' mA' : 'no charge') + (Tc > 45 && Tc <= 60 ? ', lower V' : '');
      const lw2 = tw(lab, { font: 'mono', size: 24, weight: 700 }) + 28, lx = clamp(px - lw2 / 2, x + 26, x + w - 26 - lw2);
      rr(lx, y + 476, lw2, 44, 8, rgba(A, 0.16), A, 1.5, kt);
      text(lab, lx + 14, y + 506, { font: 'mono', size: 24, weight: 700, color: C.ink, alpha: kt });
    }
    text('nPM1300 defaults, set to the cell\'s own limits. Current shown for a 250 mA charge.', x + 26, y + h - 24, { role: 'small', color: C.mute, maxW: w - 52, alpha: ep(t, 2.0, 2.4) });
    /* the thermistor is the cell's third wire */
    const rx = 1110, rw = RM - rx;
    demoWindow(rx, y, rw, 300, ep(t, 0.4, 0.8));
    cardHead(t, 0.6, rx, y, rw, 'The cell\'s third wire', ['proposal']);
    const PB = elc_v3('battery', t, rx + 2, y + 60, rw - 4, 238, { view: 'threeQuarter', view2d: 'top', zoom: in2D(1.25, 1.55), yaw: 0.15 * Math.sin(t * 0.4), explode: 0.35 * ep(t, 1.2, 2.4) });
    if (PB) {
      callout(t, 2.4, PB([13.5, 1.2, 23.5]), 'NTC lead', { to: [rx + rw - 230, y + 110], side: 'r', color: A, sub: 'Read by the PMIC' });
      callout(t, 2.9, PB([0, 4.8, 15.2]), 'Protection board', { to: [rx + 30, y + 270], side: 'r', color: A });
    }
    /* the other limits */
    const qy = y + 316, qh = h - 316;
    demoWindow(rx, qy, rw, qh, ep(t, 0.6, 1.0));
    cardHead(t, 4.0, rx, qy, rw, 'And around it', ['datasheet', 'derived'], { dy: 40 });
    elc_kv(t, 4.4, rx + 26, qy + 84, rw - 52, [['Die', 'Charging pauses above a set temperature', 'datasheet'], ['Input', '4.0–5.5 V, protected to 22 V', 'datasheet'], ['Heat', '(5 − 3.7 V) × 0.3 A ≈ 0.39 W', 'derived'], ['Off', 'Ship mode, 370 nA', 'datasheet']], { kw: 110, rh: 42 });
    gloss(t, 3.0, 'JEITA', 'The Japanese industry guideline for charging lithium cells by temperature: less current when cool, less voltage when warm, none at the extremes.');
    featureCard(t, 7.2, 'Charging that watches temperature', ['datasheet', 'proposal'], 'JEITA on the cell\'s NTC, a die-temperature stop, 22 V input protection, a watchdog, and ship mode when off.');
    source(t, 'Nordic nPM1300 specification and product page. Heat: a linear charger dissipates (Vin − Vbat) × I, derived.', { t0: 2 });
  }
});

/* ============================== one side, one reflow (#92) ============================== */
/** a board section with parts, for the double-sided pass: flip 0..1 turns it over, sag drops the heavy part */
function elc_section(cx, cy, s, flip, sag, a) {
  const sy = Math.cos(flip * Math.PI);
  G.save(); G.translate(0, cy); G.scale(1, sy); G.translate(0, -cy);
  part(cx, cy, s, () => {
    pcbSec(-30, 30, 0, 1.2, {});
    for (const [px, k] of [[-22, 'res'], [-14, 'qfn'], [-4, 'cap'], [4, 'res'], [22, 'res']]) smdMM(px, k);
    xsave(); xmove(0, -sag); smdMM(13, 'conn'); xrest();
    for (const [px, k] of [[-18, 'res'], [-8, 'cap'], [6, 'res'], [24, 'cap']]) smdMM(px, k, { under: true });
  }, { alpha: a });
  G.restore();
}
S({
  id: 'elc_oneside', ch: 'elec', theme: 'paper', title: 'One side, one reflow', settle: 10, ideas: [92], three: ['pcb'],
  src: ['dsReflow', 'elcBrock', 'elcLayout'],
  draw: t => {
    header(t, 'One side, one reflow');
    captions(t, [[0.6, 'Every part on Theseus\'s board sits on the top side, so the board goes through the reflow oven once.'], [5.4, 'A double-sided board needs a second pass, with the first side\'s parts hanging upside down while their solder melts again.']]);
    const A = acc(), x = LM, y = 272, w = 960, h = 580;
    demoWindow(x, y, w, h, ep(t, 0.2, 0.6));
    const kr = prog(t, 1.2, 5.0), sw = ep(t, 5.6, 7.4, E.cam);
    const view = [lerp(0, -0.96, sw), lerp(0.98, 0.16, sw), lerp(-0.2, 0.22, sw)];
    const P = elc_v3('pcb', t, x + 2, y + 2, w - 4, h - 4, { view, target: elc_W(0, 24, lerp(1, 6, sw)), zoom: lerp(1.6, 1.75, sw), reflow: kr > 0 && kr < 1 ? kr : 0, explode: 0.85 * ep(t, 7.0, 8.4) });
    elc_key(x + 26, y + 46, C.orange, kr < 1 ? 'Reflow: one heat front, once' : 'Done: one pass', ep(t, 1.0, 1.4) * (1 - ep(t, 5.6, 6.0)));
    if (P && kr > 0 && kr < 1) {
      const zf = 58 - kr * 66, p = P(elc_W(19.3, zf, 0)), q = P(elc_W(-19.3, zf, 0));
      text('Heat front', Math.max(p[0], q[0]) + 14, (p[1] + q[1]) / 2 + 8, { role: 'label', size: 21, color: C.orange, alpha: ep(t, 1.4, 1.8) });
    }
    if (P && sw > 0.9) {
      const kk = ep(t, 7.6, 8.0);
      callout(t, 7.8, P(elc_W(-4, 30, 9)), 'Every part on top', { to: [x + w - 330, y + 110], side: 'r', color: A, alpha: kk });
      callout(t, 8.2, P(elc_W(-14, 40, -0.6)), 'Underside: nothing soldered', { to: [x + w - 380, y + 470], side: 'r', color: A, alpha: kk, sub: 'The lens clips on' });
    }
    /* the two processes, step by step */
    const rx = x + w + 30, rw = RM - rx;
    demoWindow(rx, y, rw, h, ep(t, 0.4, 0.8));
    cardHead(t, 0.6, rx, y, rw, 'Paste, place, reflow', ['claim']);
    const step = (sx, sy, lab, on, hot, a) => { const wd = tw(lab, { role: 'label', size: 21 }) + 26; rr(sx, sy - 28, wd, 42, 8, hot > 0 ? rgba(C.orange, 0.18 * hot) : C.panel, on ? (hot > 0 ? C.orange : C.ink) : inkA(0.3), on ? 2 : 1.5, a); text(lab, sx + 13, sy, { role: 'label', size: 21, color: C.ink, alpha: a }); return wd; };
    const lane = (ly, lab, steps, t0, badge, bcol) => {
      text(lab, rx + 26, ly - 44, { role: 'label', size: 21, color: C.mute, alpha: ep(t, t0, t0 + 0.4) });
      let sx = rx + 26, yy = ly;
      steps.forEach((s2, i) => {
        if (s2 === '\n') { sx = rx + 26; yy += 58; return; }
        const k = ep(t, t0 + 0.15 * i, t0 + 0.15 * i + 0.4), on = t > t0 + 0.6 + 0.35 * i, hot = /Reflow/.test(s2) && on ? 1 - ep(t, t0 + 0.6 + 0.35 * i + 0.5, t0 + 0.6 + 0.35 * i + 1.2) * 0.5 : 0;
        const wd = step(sx, yy, s2, on, hot, k); sx += wd + 12;
        if (steps[i + 1] && steps[i + 1] !== '\n') arrow(sx - 10, yy - 7, sx - 1, yy - 7, { color: C.faint, w: 2, hs: 6, alpha: k });
      });
      rich([{ s: badge, role: 'label', size: 22, color: bcol }], rx + rw - 26, ly - 44, { align: 'right', alpha: ep(t, t0 + 1.4, t0 + 1.8) });
    };
    lane(y + 150, 'Top side only', ['Paste', 'Place', 'Reflow'], 1.0, '1 oven pass', A);
    lane(y + 268, 'Both sides', ['Paste', 'Place', 'Reflow', 'Flip', '\n', 'Paste', 'Place', 'Reflow again'], 2.2, '2 oven passes', C.red);
    /* the second pass, close up: the board upside down, the heavy part sagging as its joints melt */
    const cy = y + 452, ph2 = cyc(t, 4.4, 6), flip = ph2 < 0 ? 0 : ph2 < 0.25 ? E.io3(ph2 / 0.25) : 1, sweep = clamp((ph2 - 0.32) / 0.5), sag = flip >= 1 ? 0.9 * clamp((sweep - 0.55) / 0.3) : 0, k2 = ep(t, 4.2, 4.6);
    elc_section(rx + rw / 2, cy, 8.6, flip, sag, k2);
    if (sweep > 0 && sweep < 1) { const hx = rx + 20 + (rw - 40) * sweep; warm(hx, cy, 70, C.orange, 0.35 * k2); }
    text(flip > 0.5 ? 'Second pass, upside down' : 'First side, done', rx + 26, y + 380, { role: 'label', size: 21, color: flip > 0.5 ? C.red : C.mute, alpha: k2 });
    if (sag > 0.05) text('The heavy part sags', rx + rw / 2 + 13 * 8.6 + 34, cy + 66, { role: 'label', size: 21, color: C.red, alpha: k2 * clamp(sag * 2) });
    text('Parts over about 5 g risk falling and get glue; thin boards sag.', rx + 26, y + h - 24, { role: 'small', color: C.ink2, maxW: rw - 52, alpha: ep(t, 6.0, 6.4) });
    gloss(t, 2.8, 'Reflow', 'The oven pass that melts the solder paste. Surface tension pulls each part onto its pads, then the joints set.');
    featureCard(t, 7.0, 'Every part on the top side', ['claim', 'proposal'], 'One oven pass, no parts to crush when the board is screwed down, and a clean underside (#92).');
    source(t, 'Second-pass fallout, the 5 g rule of thumb and sag: ALLPCB. Yield numbers not verified. Board: the Theseus 3D layout.', { t0: 2 });
  }
});

/* ============================== a cable you can play on (#19, #20, #70) ============================== */
S({
  id: 'cable', ch: 'elec', theme: 'paper', title: 'A cable you can play on', settle: 9, ideas: [19, 20, 70],
  src: ['tpuCables', 'elcXa25', 'elcBrock'],
  draw: t => {
    header(t, 'A cable you can play on');
    captions(t, [[0.6, 'Reviewers called the cable in the box too stiff on all four of these flagship-class mice.'], [4.0, 'A paracord sheath over braided conductors bends like rope, and an angled plug lifts it clear of the mouse.']]);
    const A = acc(), wx = LM, wy = 272, ww = 840, wh = 540;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    cardHead(t, 0.5, wx, wy, ww, 'The cable, cut across', ['proposal']);
    const o = part(wx + 180, wy + 210, 82, () => cableMM({}), { alpha: ep(t, 0.4, 0.9) });
    if (o.sheath) {
      callout(t, 1.2, o.sheath, 'Paracord sheath (#70)', { to: [wx + 360, wy + 120], side: 'r', color: A });
      callout(t, 1.6, o.core, 'Braided conductors', { to: [wx + 360, wy + 210], side: 'r', color: A });
      callout(t, 2.0, o.fill, 'Soft filler, no stiff jacket', { to: [wx + 360, wy + 300], side: 'r', color: C.ink2, tcolor: C.ink });
    }
    /* the plug, seen from the side: straight vs angled (#19); a section through the chin only */
    rule(wx + 26, wy + 356, wx + ww - 26, ep(t, 2.4, 2.8));
    const sc = (bx, lab, angled, t0) => {
      const k = ep(t, t0, t0 + 0.5), mv = 22 * Math.sin((t - t0) * 1.4), pad = wy + 500, cx = bx + mv;
      line(bx - 150, pad, bx + 210, pad, { color: C.faint, w: 2, alpha: k });
      G.save(); G.globalAlpha = k; G.beginPath(); G.moveTo(cx - 150, pad - 46); G.quadraticCurveTo(cx - 20, pad - 50, cx, pad - 22); G.quadraticCurveTo(cx + 4, pad - 6, cx - 14, pad - 4); G.lineTo(cx - 150, pad - 4); G.closePath(); G.fillStyle = inkA(0.1); G.fill(); G.strokeStyle = inkA(0.55); G.lineWidth = 1.6; G.stroke(); G.restore();
      const px = cx + 2, py = pad - 24, ang = angled ? -0.5 : 0, ex = px + Math.cos(ang) * 26, ey = py + Math.sin(ang) * 26;
      G.save(); G.globalAlpha = k; G.translate(px, py); G.rotate(ang); G.fillStyle = C.ink2; G.fillRect(0, -6, 26, 12); G.restore();
      const hit = !angled && mv > 6;
      const c1 = angled ? [ex + 50, ey - 40] : [ex + 30, py + 4], c2 = angled ? [ex + 110, pad - 50] : [ex + 70, pad], end = [bx + 200, pad - (angled ? 10 : 2)];
      G.save(); G.globalAlpha = k; G.beginPath(); G.moveTo(ex, ey); G.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], end[0], end[1]); G.strokeStyle = hit ? C.red : C.ink; G.lineWidth = 5; G.lineCap = 'round'; G.stroke(); G.restore();
      text(lab, bx - 150, wy + 404, { role: 'label', size: 21, color: angled ? A : C.mute, alpha: k });
      if (hit) text('Runs over it', bx + 210, wy + 404, { role: 'label', size: 21, color: C.red, align: 'right', alpha: k });
    };
    sc(wx + 200, 'Straight plug', false, 2.6);
    sc(wx + 610, 'Angled plug (#19)', true, 3.0);
    text('Chin section only; the mouse moves back and forth.', wx + 26, wy + wh - 16, { role: 'label', size: 21, color: C.faint, alpha: ep(t, 3.2, 3.6) });
    const rx = wx + ww + 30, rw = RM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    cardHead(t, 0.7, rx, wy, rw, 'The cables in the box, reviewed', ['measured']);
    const rows = [['G Pro X Superlight 2', '1.80 m rubber', 'Below-average flex'], ['Viper V3 Pro', '1.80 m braided', 'Stiff'], ['UltralightX', '1.70 m braided', '"Supremely stiff"'], ['Maya X', '1.75 m braided', 'Can\'t play while charging']];
    rows.forEach((r, i) => { const yy = wy + 140 + i * 74, k = ep(t, 1.4 + i * 0.2, 1.8 + i * 0.2); if (i) rule(rx + 26, yy - 44, rx + rw - 26, k); text(r[0], rx + 26, yy, { role: 'small', weight: 700, color: C.ink, alpha: k }); text(r[1], rx + 26, yy + 28, { role: 'label', size: 21, color: C.mute, alpha: k }); text(r[2], rx + rw - 26, yy + 14, { role: 'small', weight: 600, color: C.red, align: 'right', alpha: k, maxW: rw - 380 }); });
    text('Thin enough that the receiver sits flat, thick enough to charge at full current (#20).', rx + 26, wy + wh - 52, { role: 'small', weight: 600, color: C.ink, maxW: rw - 52, lh: 1.3, t, t0: 3.6, cps: 110 });
    elc_step(t, 5.2, LM, 828, RM - LM, 136, { who: 'XBAB XA25', num: '1.9 mm, 6.9 g/m', ev: ['claim'], lim: 'Thin and still high-speed, but a straight, fixed cable.', step: 'An angled plug, an XA25-class 1.9 mm cable that still passes high speed, and the receiver\'s passthrough (#22).' });
    source(t, 'Cable notes: TechPowerUp reviews. XA25: XBAB. Paracord type I is 1.7 mm (Brock\'s note).', { t0: 2 });
  }
});

/* ============================== a receiver that tells you things (#85, #86, #88, #21, #22, #25) ============================== */
S({
  id: 'dongle', ch: 'elec', theme: 'night', title: 'A receiver that tells you things', settle: 9, ideas: [85, 86, 88, 21, 22, 25], src: ['pulsarLink', 'ulxLed', 'elcRazerV4', 'elcTpuV4', 'elcGauge', 'npm1300', 'wiz'],
  sfxLoop: [{ t0: 3.0, per: 2.2, cues: [[0, 'click'], [0.07, 'release']] }],
  draw: t => {
    header(t, 'A receiver that tells you things');
    captions(t, [[0.6, 'The receiver sits in front of you all day. It is the right place to show what the mouse is doing.'], [3.4, 'Buttons on it change DPI and polling without flipping the mouse or opening software, and a second port charges the mouse through it.']]);
    const wx = LM, wy = 272, ww = 1060, wh = 540, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const presses = Math.max(0, Math.floor((t - 3.0) / 2.2) + 1), dpi = [800, 1600, 3200][presses % 3], pressing = t > 3.0 && ((t - 3.0) % 2.2) < 0.18;
    const pct = Math.min(100, 73 + Math.floor(Math.max(0, t - 2) * 0.6)), hrs = Math.max(0, 41 - Math.floor(Math.max(0, t - 2) * 0.4));
    G.save(); rrPath(wx, wy, ww, wh, 14); G.clip();
    const o = part(wx + ww / 2, wy + 280, 15, () => dongleMM({ lines: [{ t: '8000 Hz', s: 3.4, y: 4.6 }, { t: dpi + ' dpi', s: 2.3, y: 8.2, c: pressing ? acc() : '#9b9a94' }, { t: pct + '%  ' + hrs + ' h left', s: 1.7, y: 10.6, c: '#9b9a94' }], bat: pct / 100, accent: A }), { alpha: Math.max(0.004, ep(t, 0.4, 0.9)) });
    G.restore();
    if (pressing && o.b1) circle(o.b1[0], o.b1[1] - 2.35 * 15, 40, { color: A, w: 3, alpha: 0.6 });
    if (o.screen) {
      callout(t, 1.2, o.screen, 'A small mono screen (#85)', { to: [wx + 180, wy + 92], side: 'r', color: A, maxW: 260 });
      callout(t, 1.6, [o.screen[0] + 80, o.screen[1] + 150], 'Runtime left, and time to full (#86, #88)', { to: [wx + 90, wy + 470], side: 'r', color: A, maxW: 330 });
      callout(t, 2.0, o.b1, 'DPI and polling buttons (#21)', { to: [wx + ww - 220, wy + 470], side: 'r', color: A, maxW: 190 });
      callout(t, 2.4, o.portR, 'Passthrough USB-C (#22)', { to: [wx + ww - 250, wy + 92], side: 'r', color: A, maxW: 220 });
    }
    text('Receiver styling is generic; the features are the point.', wx + ww - 26, wy + wh - 22, { role: 'label', size: 21, color: C.faint, align: 'right', alpha: ep(t, 2.6, 3.0) });
    const rx = wx + ww + 30, rw = RM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    cardHead(t, 0.7, rx, wy, rw, 'Receivers today', ['claim']);
    const bands = [['#46b35a', 'Over 50%'], ['#e2c13e', 'Under 50%'], ['#f0a43a', 'Under 25%'], ['#e5484d', 'Under 10%']];
    text('Finalmouse ULX: one LED, four colour bands', rx + 26, wy + 112, { role: 'small', weight: 700, color: C.ink, maxW: rw - 52, alpha: ep(t, 1.0, 1.4) });
    bands.forEach(([c, l], i) => { const xx = rx + 26 + (i % 2) * 230, yy = wy + 156 + Math.floor(i / 2) * 38, k = ep(t, 1.2 + i * 0.15, 1.6 + i * 0.15); circle(xx + 9, yy - 8, 9, { fill: c, alpha: k }); text(l, xx + 28, yy, { role: 'label', size: 21, color: C.ink2, alpha: k }); });
    text('Viper V4 Pro: LEDs for battery, connection, polling or DPI.', rx + 26, wy + 268, { role: 'small', color: C.ink2, maxW: rw - 52, lh: 1.3, alpha: ep(t, 1.8, 2.2) });
    text('Pulsar Link 8K: DPI and polling buttons on the receiver.', rx + 26, wy + 346, { role: 'small', color: C.ink2, maxW: rw - 52, lh: 1.3, alpha: ep(t, 2.2, 2.6) });
    text('Plug to pair (#25): wire both once and they pair, the way a DualSense pairs with a PS5 over its cable.', rx + 26, wy + 430, { role: 'small', color: C.ink, weight: 600, maxW: rw - 52, lh: 1.3, t, t0: 4.0, cps: 110 });
    elc_step(t, 5.4, LM, 828, RM - LM, 136, { who: 'Razer Viper V4 Pro', num: 'fuel gauge IC', ev: ['measured'], lim: 'Its receiver shows a level: no runtime, no time to full.', step: 'The PMIC\'s gauge: charge, health, time to full and time left, on the receiver screen and in the web driver.', stepEv: ['datasheet', 'proposal'] });
    source(t, 'ULX bands: The Gaming Setup. V4 Pro: Razer, TechPowerUp. Pulsar: iF Design. Gauge: nRF Fuel Gauge library. Screen values: illustration.', { t0: 2 });
  }
});

/* ============================== software in a browser tab (#23, #65, #66, #87) ============================== */
S({
  id: 'software', ch: 'elec', theme: 'paper', title: 'Software in a browser tab', settle: 10, ideas: [23, 65, 66, 87], src: ['webhid', 'tpuUlx9', 'elcLayout'],
  sfx: [[3.0, 'click'], [3.12, 'release'], [4.2, 'click'], [4.5, 'tick'], [4.8, 'tick'], [5.1, 'release'], [6.5, 'click'], [7.5, 'release']],
  draw: t => {
    header(t, 'Software in a browser tab');
    captions(t, [[0.6, 'Mouse software is usually a large download that runs all the time. A browser tab installs nothing, and the settings live on the mouse.'], [5.0, 'The limits are real: it needs a Chromium browser, and you approve each device once.']]);
    const wx = LM, wy = 272, ww = 980, wh = 540, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const bx = wx + 36, by = wy + 36, bw = ww - 72, bh = wh - 72, k = ep(t, 0.5, 1.0);
    rr(bx, by, bw, bh, 12, TH ? '#ffffff' : '#101113', inkA(0.2), 1.5, k);
    rr(bx, by, bw, 46, 12, inkA(0.06), null, 1, k);
    for (let i = 0; i < 3; i++) circle(bx + 24 + i * 20, by + 23, 6, { fill: inkA(0.25), alpha: k });
    rr(bx + 100, by + 9, 380, 28, 8, inkA(0.06), null, 1, k); text('store  ›  configure', bx + 116, by + 31, { role: 'label', size: 21, color: C.mute, alpha: k });
    const cx = bx + 40, cy = by + 100, x0 = cx + 220, w0 = bw - 340, u = t - 2.2;
    const poll = u < 0.9 ? 0 : 3, lo = u < 2.0 ? 3 : u < 2.9 ? Math.round(lerp(3, 0, E.io3(prog(u, 2.0, 2.9)))) : 0, dpiF = u < 4.3 ? 0 : E.io3(prog(u, 4.3, 5.3)), dpi = Math.round(lerp(1600, 800, dpiF) / 50) * 50;
    const knob = v2 => x0 + w0 * (v2 - 400) / 6000;
    const Pt = { rest: [bx + bw - 60, by + bh - 50], chip8: [x0 + 3 * 86 + 36, cy + 68], lo3: [x0 + 3 * 30, cy + 136], lo0: [x0, cy + 136], dpiA: [knob(1600), cy], dpiB: [knob(800), cy] };
    const cur = kf(u, [[0, Pt.rest], [0.8, Pt.chip8], [1.3, Pt.chip8], [1.9, Pt.lo3], [2.0, Pt.lo3], [2.9, Pt.lo0], [3.4, Pt.lo0], [4.2, Pt.dpiA], [4.3, Pt.dpiA], [5.3, Pt.dpiB], [5.8, Pt.dpiB], [6.8, Pt.rest]]);
    const rows = [['DPI', 'slider', dpi], ['Polling', 'chips', ['1k', '2k', '4k', '8k']], ['Lift-off', 'steps', (0.7 + lo * 0.1).toFixed(1) + ' mm'], ['Sensor angle', 'value', '−2.0° (#87)'], ['Firmware', 'update', '']];
    rows.forEach(([l, kind, v], i) => {
      const yy = cy + i * 68, kk = ep(t, 1.0 + i * 0.2, 1.4 + i * 0.2);
      text(l, cx, yy + 8, { role: 'label', size: 21, color: C.ink, alpha: kk });
      if (kind === 'slider') { line(x0, yy, x0 + w0, yy, { color: C.hair, w: 4, alpha: kk }); const f = (v - 400) / 6000; line(x0, yy, x0 + w0 * f, yy, { color: A, w: 4, alpha: kk }); circle(x0 + w0 * f, yy, 10, { fill: A, alpha: kk }); text(String(v), x0 + w0 + 18, yy + 8, { font: 'mono', size: 24, weight: 700, color: C.ink, alpha: kk }); }
      else if (kind === 'chips') v.forEach((c, j) => { const on = j === poll, fl = j === 3 ? env(u, 0.85, 0.95, 1.1, 1.6) : 0; rr(x0 + j * 86, yy - 16, 72, 34, 8, on ? A : inkA(0.06), on ? null : inkA(0.2), 1.2, kk); if (fl > 0) rr(x0 + j * 86 - 5 * fl, yy - 16 - 5 * fl, 72 + 10 * fl, 34 + 10 * fl, 11, null, A, 2, kk * fl * 0.6); text(c, x0 + j * 86 + 36, yy + 8, { role: 'label', size: 21, color: on ? (TH ? '#fff' : '#0d0e0f') : C.ink2, align: 'center', alpha: kk }); });
      else if (kind === 'steps') { for (let j = 0; j <= 10; j++) line(x0 + j * 30, yy - 8, x0 + j * 30, yy + 8, { color: j === lo ? A : C.faint, w: j === lo ? 3 : 1.5, alpha: kk }); circle(x0 + lo * 30, yy, 7, { fill: A, alpha: kk }); text(v, x0 + 340, yy + 8, { font: 'mono', size: 24, weight: 700, color: C.ink, alpha: kk }); }
      else if (kind === 'update') { const fu = ep(u, 4.9, 6.9, E.lin); for (const [j, lab] of [[0, 'Mouse'], [1, 'Receiver']]) { const ux = x0 + j * 300; rr(ux, yy - 12, 260, 24, 12, inkA(0.06), inkA(0.2), 1.2, kk); rr(ux, yy - 12, 260 * fu, 24, 12, A, null, 1, kk * (fu > 0.01 ? 1 : 0)); text(lab, ux + 12, yy + 8, { role: 'label', size: 21, color: fu > 0.3 ? (TH ? '#fff' : '#0d0e0f') : C.ink2, alpha: kk }); } }
      else text(v, x0, yy + 8, { font: 'mono', size: 24, weight: 700, color: C.ink, alpha: kk });
    });
    for (const tw0 of [1.0, 3.0, 5.4]) { const kt = env(u, tw0, tw0 + 0.25, tw0 + 1.3, tw0 + 1.6); if (kt <= 0) continue; const ty = by + bh - 34 + (1 - kt) * 12; rr(bx + 40, ty - 24, 272, 36, 18, rgba(C.green, 0.16), C.green, 1.4, kt); text('Saved on the mouse', bx + 62, ty, { role: 'label', size: 21, color: C.good, alpha: kt }); }
    if (u > 0 && t > 1.6) {
      const ca = ep(t, 1.6, 2.0), down = [0.8, 2.0, 4.3].some(c0 => u > c0 && u < c0 + 0.12) || (u > 2.0 && u < 2.9) || (u > 4.3 && u < 5.3);
      for (const c0 of [0.8, 2.0, 4.3]) { const rk = prog(u, c0, c0 + 0.45); if (rk > 0 && rk < 1) circle(cur[0], cur[1], 8 + rk * 26, { color: A, w: 2, alpha: ca * (1 - rk) * 0.8 }); }
      G.save(); G.globalAlpha = ca; G.translate(cur[0], cur[1]); const sc = down ? 0.9 : 1; G.scale(sc, sc);
      G.beginPath(); G.moveTo(0, 0); G.lineTo(0, 24); G.lineTo(6, 18.5); G.lineTo(10.5, 28); G.lineTo(14.5, 26.2); G.lineTo(10, 17); G.lineTo(17.5, 17); G.closePath();
      G.fillStyle = TH ? '#141516' : '#f7f6f2'; G.fill(); G.strokeStyle = TH ? '#f7f6f2' : '#141516'; G.lineWidth = 1.6; G.lineJoin = 'round'; G.stroke(); G.restore();
    }
    text('A generic mock-up of the configurator', wx + ww - 48, wy + wh - 50, { role: 'label', size: 21, color: C.faint, align: 'right', alpha: k });
    const rx = wx + ww + 30, rw = RM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    cardHead(t, 0.7, rx, wy, rw, 'How it works, and its limits', ['datasheet']);
    const notes = [['WebHID: Chrome and Edge 89 and up. Not Firefox or Safari.', C.ink2, 500], ['You pick the device in a browser prompt, one at a time; raw keyboard and mouse input stays blocked.', C.ink2, 500], ['Firmware with each drop: motion latency (#65) and sensor tuning with PixArt (#66).', C.ink, 700]];
    let ny = wy + 120; notes.forEach(([s2, col, wt], i) => { const r = text(s2, rx + 26, ny, { role: 'small', weight: wt, color: col, t, t0: 1.6 + i * 0.9, cps: 110, maxW: rw - 52, lh: 1.32 }); ny += Math.max(r.h, 30) + 26; });
    elc_step(t, 5.6, LM, 828, RM - LM, 136, { who: 'Finalmouse XPanel', num: 'web, via the receiver', ev: ['measured'], lim: 'Talks only through the receiver, so nothing changes while charging.', step: 'One driver on the store\'s domain: updates mouse and receiver together, works over the cable, opens from a QR code on the board.' });
    source(t, 'WebHID: Chrome developers. XPanel: TechPowerUp, UltralightX review. The board\'s QR code: the Theseus 3D layout.', { t0: 2 });
  }
});
