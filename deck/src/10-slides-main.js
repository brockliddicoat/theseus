/* ============================================================================================
   main deck: in pursuit of an objectively better mouse. Every feature the best possible mouse needs,
   and why each one objectively helps. Voice: Brock, first person, straight and technical.
   The mouse's shape never appears: the shape is the part most likely to change. Every visual is a
   single part, a section through one, or a chart.
   ============================================================================================ */
const DECK = {
  chapters: [
    { key: 'intro', name: 'Intro' }, { key: 'click', name: 'Clicks' }, { key: 'glide', name: 'Glide and tracking' },
    { key: 'shell', name: 'Shell and structure' }, { key: 'surface', name: 'Surface and details' }, { key: 'elec', name: 'Electronics' },
    { key: 'shape', name: 'Shape' }, { key: 'own', name: 'Ownership' }, { key: 'end', name: 'Close' }
  ],
  slides: []
};
const S = o => (DECK.slides.push(o), o);
function chapterIdeaCount(key) { const set = new Set(); DECK.slides.filter(s => s.ch === key).forEach(s => (s.ideas || []).forEach(i => set.add(String(i)))); return set.size; }
/** a click: trigger travel 0..1 with a hard stop, in a cycle; phase c from cyc() */
function clickCurve(c) { return c < 0 ? 0 : c < 0.03 ? E.hit(c / 0.03) : c < 0.09 ? 1 : c < 0.13 ? 1 - E.out3((c - 0.09) / 0.04) : 0; }
/** a switch pressed in a loop, with the contact's hysteresis: it snaps to NO at 0.5 mm and back at 0.3 mm */
function swCycle(t, t0, per) { const c = cyc(t, t0, per), pr = clickCurve(c), d = pr * SWG.TT, down = c >= 0 && c < 0.09; return { c, pr, state: (down ? d >= SWG.OP : d > 0.3) ? 'no' : 'nc' }; }
/* when the moving contact lands, on NO and again back on NC: the phase of each, found once */
const SNAPC = (() => { let no = 0, nc = 0; for (let c = 0; c < 0.2; c += 0.0002) { const d = clickCurve(c) * SWG.TT; if (!no && c < 0.09 && d >= SWG.OP) no = c; if (!nc && c > 0.09 && d <= 0.3) nc = c; } return { no, nc }; })();
/** a contact landing: a flash and a few sparks for 0.16 s after dt = 0 */
function contactSpark(p, dt, col, s = 1, seed = 1) {
  if (!p || dt < 0 || dt > 0.16) return;
  const k = 1 - dt / 0.16; glow(p[0], p[1], 30 * s, col, 0.75 * k); glow(p[0], p[1], 9 * s, '#ffffff', 0.9 * k);
  const r = rng(seed); for (let i = 0; i < 7; i++) { const a = r() * TAU, d = (5 + dt * 280 * (0.6 + r() * 0.6)) * s; circle(p[0] + Math.cos(a) * d, p[1] + Math.sin(a) * d * 0.7, 1.6 * s, { fill: '#e8f2ff', alpha: k * 0.9 }); }
}
/** a small indicator lamp */
function lamp(x, y, label, on, col, a = 1) { circle(x, y, 8, { fill: on ? col : 'rgba(0,0,0,0)', color: on ? col : C.faint, w: 2, alpha: a }); if (on) circle(x, y, 15, { color: col, w: 1.5, alpha: 0.35 * a }); text(label, x + 18, y + 8, { role: 'label', color: on ? col : C.faint, alpha: a }); }
/** a figure label in the drafting style: number and name */
function figLabel(t, t0, x, y, n, name, o = {}) { const a = ep(t, t0, t0 + 0.4); rich([{ s: 'Fig. ' + pad2(n), role: 'label', size: 21, color: o.color || C.mute }, { s: name, role: 'small', size: 24, weight: 500, color: C.faint, sentence: true, gap: 16 }], x, y, { alpha: a }); }

/* ---------- cover ---------- */
S({
  id: 'cover', ch: 'intro', theme: 'night', title: 'in pursuit of an objectively better mouse', settle: 6,
  sfxLoop: [{ t0: 4.0, per: 3.2, cues: [[0.0, 'click'], [0.1, 'release']] }],
  draw: t => {
    text('nitrite labs', LM, 120, { role: 'h3', size: 30, color: C.mute, t, t0: 0.05, cps: 40, ls: 1 });
    text('in pursuit of an\nobjectively better\nmouse', LM, 300, { size: 80, weight: 800, lh: 1.08, ls: -3, t, t0: 0.3, cps: 26, caret: true });
    text('optimization over opinion.', LM, 590, { size: 30, weight: 600, color: C.ink2, t, t0: 2.0, cps: 40 });
    text('every feature the best possible mouse needs,\nand why each one objectively helps.', LM, 690, { role: 'body', color: C.mute, t, t0: 2.6, cps: 70, lh: 1.5 });
    text('brock liddicoat  //  nitrite labs  //  shape designer of the finalmouse slx', LM, 1030, { role: 'small', color: C.faint, t, t0: 3.2, cps: 90 });
    /* the hero: a switch with its cover clear, 48 px per mm */
    const X0 = 1030, Y0 = 690, s = 48, k = ep(t, 0.9, 1.8), sc = swCycle(t, 4.0, 3.2);
    const A = C.blue;
    const o = drawSwitch(X0, Y0, s, { press: sc.pr, state: sc.state, clear: true, accent: A, alpha: k });
    if (sc.c >= 0 && k > 0.5) {
      const ts = sc.c * 3.2, n = Math.floor((t - 4.0) / 3.2); contactSpark(o.contact, ts - SNAPC.no * 3.2, A, 1, 7 + n); contactSpark(o.contact, ts - SNAPC.nc * 3.2, A, 0.6, 31 + n);
      /* the click, seen: two thin rings run out from the plunger as it snaps */
      for (const d0 of [0.07, 0.16]) { const u = (ts - d0) / 0.7; if (u > 0 && u < 1 && o.plunger) circle(o.plunger[0], o.plunger[1] - 30, 30 + u * 230, { color: A, w: 1.5, alpha: 0.35 * (1 - u) * (1 - u) }); }
    }
    const lab = (t0, p, label, to, side) => callout(t, t0, p, label, { to, side, color: C.ink2, tcolor: C.ink2, role: 'label' });
    lab(2.4, o.plunger, 'plunger', [X0 + 4.0 * s, Y0 - 9.4 * s], 'r');
    lab(2.6, o.leaf, 'leaf spring', [X0 + 9.2 * s, Y0 - 9.4 * s], 'r');
    lab(2.8, o.nc, 'NC contact', [X0 + 14.0 * s, Y0 - 6.0 * s], 'r');
    lab(3.0, o.no, 'NO contact', [X0 + 14.0 * s, Y0 - 2.2 * s], 'r');
    lab(3.2, o.com, 'COM', [X0 - 1.6 * s, Y0 - 8.2 * s], 'l');
    dim(t, 3.4, [X0, Y0 + 0.15 * s], [X0 + 12.8 * s, Y0 + 0.15 * s], '12.8 mm', 4.4 * s);
    lamp(X0 + 1.2 * s, Y0 + 6.3 * s, 'NC', sc.state === 'nc', A, ep(t, 3.6, 4.0));
    lamp(X0 + 3.6 * s, Y0 + 6.3 * s, 'NO', sc.state === 'no', A, ep(t, 3.6, 4.0));
    figLabel(t, 3.8, X0 + 6.2 * s, Y0 + 6.42 * s, 1, 'snap-action switch, cover clear');
  }
});

/* ---------- the targets: the best number anyone has shown in each category, and mine ---------- */
/** a compact evidence label for table cells: the pill, and a short note on who measured it */
function evCell(x, y, kind, note, a) { pill(x, y, kind, a); if (note) text(note, x, y + 26, { role: 'label', size: 17, color: C.faint, alpha: a, maxW: 260 }); }
/** the bar: per category, the best number anyone has shown, who showed it, how we know, and the Theseus target in yellow */
function targetTable(t, rows, o = {}) {
  /* rows: [category, best shown, who, evidence kind, who-note, Theseus target]. A row is a band of height rh;
     one-line cells sit on its centre line, the who cell carries its note as a second, smaller line. */
  const x = LM, y = 300, w = RM - LM, rh = Math.min(66, 640 / rows.length);
  const cx = [x, x + 330, x + 620, x + 1090, x + 1360], tx = cx[4];
  const a0 = ep(t, 0.4, 0.8);
  /* the Theseus column: a yellow cap and rule, and its head on a yellow chip */
  const kc = ep(t, 0.6, 1.2, E.snap);
  rect(tx - 20, y - 46, RM - tx + 20, 6 * kc, { fill: YEL });
  rect(tx - 20, y - 46, 2, (rh * rows.length + 60) * kc, { fill: TH ? '#111111' : YEL, alpha: 0.9 });
  ['Category', 'Best shown so far', 'Who, and on what', 'How we know'].forEach((h, i) => text(h, cx[i], y - 4, { role: 'label', size: 20, color: C.mute, alpha: a0 }));
  rich([{ s: 'Theseus target', role: 'label', size: 20, color: '#111111', chip: YEL }], tx + 6, y - 4, { alpha: a0 });
  line(x, y + 14, RM, y + 14, { color: C.hair, w: 1.5, alpha: a0 });
  rows.forEach((r, i) => {
    const bt = y + 14 + rh * i, yy = bt + rh / 2 + 9, t0 = 0.9 + i * 0.12, k = ep(t, t0, t0 + 0.3);
    if (i) line(x, bt, RM, bt, { color: C.hair, w: 1, alpha: k });
    const cur = t > 5.2 ? Math.floor((t - 5.2) / 1.7) % rows.length : -1, hl = cur === i ? Math.sin(clamp(((t - 5.2) % 1.7) / 1.7) * Math.PI) : 0;
    if (hl > 0) rect(x - 12, bt + 2, w + 24, rh - 4, { fill: inkA(0.035 * hl) });
    text(r[0], cx[0], yy, { role: 'small', size: 25, weight: 600, color: C.ink, sentence: true, t, t0, cps: 130, maxW: 320 });
    text(r[1], cx[1], yy, { font: 'mono', size: 24, weight: 700, color: C.ink, t, t0: t0 + 0.08, cps: 100, maxW: 280 });
    text(r[2], cx[2], r[4] ? bt + rh / 2 - 1 : yy, { role: 'small', size: 24, weight: 500, color: C.ink2, t, t0: t0 + 0.12, cps: 150, maxW: 450 });
    if (r[4]) text(r[4], cx[2], bt + rh / 2 + 21, { role: 'label', size: 19, color: C.faint, alpha: ep(t, t0 + 0.15, t0 + 0.45), maxW: 450 });
    pill(cx[3], yy + 2, r[3], ep(t, t0 + 0.15, t0 + 0.45));
    text(r[5], tx, yy, { role: 'small', size: 25, weight: 700, color: C.ink, sentence: true, t, t0: t0 + 0.2, cps: 100, maxW: RM - tx });
  });
}
const TARGETS_SPEED = [
  ['Motion latency, wired', '0.13 ms', 'XBAB XA25, before SensorLock', 'measured', '{piaknow}, 8 kHz', '0.13 ms or less'],
  ['Motion latency, wireless', '0.34 ms', 'Razer Viper V4 Pro', 'measured', '{piaknow}, 8 kHz', '0.14 ms, on the same rig'],
  ['Frame sync', '163 µs ahead', 'SensorLock against FrameSync', 'claim', 'Its developers\' test', 'Synced on every report'],
  ['Click latency, wired', '65 µs', 'XBAB XA25, contact to USB', 'claim', 'XBAB\'s own analyzer', '65 µs or less'],
  ['Click latency, wireless', '0.175 ms', 'VGN Dragonfly 3 Master GT', 'claim', 'VGN', '0.1 ms or less'],
  ['Press to PC, with travel', '2.0 ms', 'Finalmouse Starlight X', 'claim', 'Finalmouse\'s own rig', '2.0 ms, on an outside rig'],
  ['Report rate', '8 kHz', 'Wired and wireless', 'datasheet', 'USB high speed', '8 kHz both ways, no gaps'],
  ['Lost reports rescued', '99 to 100%', 'Kunai Second Shot, 4 kHz', 'claim', 'Its developer\'s test', '99% or more, every rate']
];
const TARGETS_REST = [
  ['Battery, 1 kHz', '180 h', 'Razer Viper V4 Pro, 49 g', 'claim', 'Razer; the SLX gives no rating', '200 h or more, measured'],
  ['Battery, 8 kHz', '40 h', 'Razer Viper V4 Pro', 'measured', 'TechPowerUp', '45 h or more, measured'],
  ['Charge current', '0.28 A', 'Pulsar X2H', 'measured', 'TechPowerUp', '0.3 A, with a fuel gauge'],
  ['Weight, full shell', '29 g', 'Finalmouse ULX, size small', 'claim', 'Finalmouse', '29 g at medium, weighed'],
  ['Sensor', '930 IPS, 90 G', 'Razer Focus Pro 50K', 'claim', 'Razer only', 'PixArt\'s best, LGA package'],
  ['Lift-off', '0.7 mm', 'PAW3955 mice, the SLX', 'datasheet', 'Spec sheets; set in 0.1 mm steps', '0.7 mm or less, measured'],
  ['Set-down smoothing', '2 frames, 12 ms', 'XBAB XA25; 3950 default 16', 'claim', 'XBAB\'s blog', '12 ms or less, by default'],
  ['Button sensing', '40 × 0.01 mm', 'Finalmouse SLX, TMR-DS', 'claim', 'Finalmouse', 'Magnetic, with a real snap'],
  ['Idle sleep', '10 s', 'Kunai Smart sleep', 'claim', 'Its developer', '10 s, woken by a touch'],
  ['Software', 'A browser tab', 'XBAB Xpanel', 'datasheet', 'Settings live on the mouse', 'Every OS, latency published'],
  ['Coating hardness', '8H pencil', 'Cerakote H, on steel', 'datasheet', 'Cerakote', '8H, tested on the shell']
];
S({
  id: 'targets', ch: 'intro', theme: 'paper', title: 'the bar, part one: speed', settle: 9,
  src: ['piaknow', 'kunai', 'xbab', 'xbabFw', 'xbabSensorLock', 'razerHs', 'vgnClick', 'pcgSlx', 'usbHs'],
  draw: t => {
    header(t, 'The bar, part one: speed', { eyebrow: 'intro // The targets, 1 of 2' });
    targetTable(t, TARGETS_SPEED);
    captions(t, [[0.6, 'Each row is the best number anyone has shown, who showed it, and how we know. A maker\'s claim is labelled as one.'], [4.6, 'The hard one is wireless: 0.14 ms is 0.2 ms faster than the fastest wireless mouse anyone has measured.']]);
  }
});
S({
  id: 'targets2', ch: 'intro', theme: 'night', title: 'the bar, part two: everything else', settle: 9,
  src: ['nbcV4', 'slxB2g', 'tpuX2h', 'nbcUlx', 'razerFocus', 'mkb3955', 'kc3955', 'xbabSmooth', 'slxPdf', 'slxXt', 'kunai', 'cerakoteH'],
  draw: t => {
    header(t, 'The bar, part two: everything else', { eyebrow: 'intro // The targets, 2 of 2' });
    targetTable(t, TARGETS_REST);
    captions(t, [[0.6, 'The same rule for the rest: the best figure shown anywhere, and a target at or past it.'], [5.0, 'One row can\'t be won outright. Razer\'s sensor is Razer\'s alone, so the target is the best one PixArt makes.']]);
  }
});

/* ---------- the map: seven areas, each shown by one of its parts ---------- */
function groovePart(t) {
  /* a slice through a grip surface, generic: a soft curve, and the push it gives back to a fingertip */
  const A = acc('shape');
  solid(() => { G.beginPath(); for (let x = -9; x <= 9; x += 0.3) G.lineTo(x, -0.035 * x * x); for (let x = 9; x >= -9; x -= 0.3) G.lineTo(x, -0.035 * x * x + 1.2); G.closePath(); }, MT.shell, [-9, -3, 18, 4.4], { hatch: true });
  for (const x of [-5, 0, 5]) { const nx = 0.07 * x, ny = 1, l = Math.hypot(nx, ny), y = -0.035 * x * x, ux = -nx / l, uy = -ny / l, x1 = x + ux * 4.2, y1 = y + uy * 4.2; mmLine([[x + ux * 0.3, y + uy * 0.3], [x1, y1]], A, 2.4); G.beginPath(); G.moveTo(x1 + ux * 0.9, y1 + uy * 0.9); G.lineTo(x1 - uy * 0.45, y1 + ux * 0.45); G.lineTo(x1 + uy * 0.45, y1 - ux * 0.45); G.closePath(); G.fillStyle = A; G.fill(); }
}
S({
  id: 'map', ch: 'intro', theme: 'paper', title: 'seven areas, each down to the part', settle: 8,
  draw: t => {
    header(t, 'Seven areas, each down to the part');
    const tiles = [
      ['click', 'clicks', 'snap-action switch', (x, y) => { const sc = swCycle(t, 1.6, 2.4); drawSwitch(x - 6.4 * 15, y + 22, 15, { clear: true, press: sc.pr, state: sc.state }); }],
      ['glide', 'glide and tracking', 'dot skate on cloth', (x, y) => drawSkate(x, y + 8, 12.5, { sink: 0.22 + 0.12 * (0.5 + 0.5 * Math.sin(t * 1.6)) })],
      ['shell', 'shell and structure', 'screw into a brass insert', (x, y) => part(x, y + 40, 15, () => insertMM({ k: 0.55 + 0.45 * pingpong(t, 6) }))],
      ['surface', 'surface and details', 'scroll wheel', (x, y) => part(x, y, 7.4, () => wheelSideMM({ rot: t * 0.2 }))],
      ['elec', 'electronics', 'radio and MCU', (x, y) => part(x, y, 5.4, () => boardMM({}))],
      ['shape', 'shape', 'how a surface pushes back', (x, y) => part(x, y + 20, 14, () => groovePart(t))],
      ['own', 'ownership', 'a screw you can reach', (x, y) => { part(x - 46, y, 22, () => screwHeadMM(), { rot: t * 0.5 }); part(x + 46, y, 22, () => screwHeadMM(), { rot: -t * 0.5 }); }]
    ];
    const gap = 24, tw2 = (RM - LM - 3 * gap) / 4, th2 = 336;
    tiles.forEach(([key, name, partName, fn], i) => {
      const row = i < 4 ? 0 : 1, col = row ? i - 4 : i, n = row ? 3 : 4;
      const x0 = LM + (RM - LM - (n * tw2 + (n - 1) * gap)) / 2 + col * (tw2 + gap), y0 = 280 + row * (th2 + gap), t0 = 0.4 + i * 0.12;
      demoWindow(x0, y0, tw2, th2, ep(t, t0, t0 + 0.4));
      G.save(); rrPath(x0, y0, tw2, th2, 12); G.clip();
      part(0, 0, 1, () => fn(x0 + tw2 / 2, y0 + 128), { alpha: ep(t, t0 + 0.2, t0 + 0.7) });
      G.restore();
      const cnt = chapterIdeaCount(key), A = acc(key), k = ep(t, t0 + 0.3, t0 + 0.6), ci = DECK.chapters.findIndex(c => c.key === key);
      text(partName, x0 + 24, y0 + 40, { role: 'label', size: 20, color: C.faint, alpha: k });
      line(x0 + 24, y0 + 236, x0 + tw2 - 24, y0 + 236, { color: C.hair, w: 1.2, alpha: k });
      chapterIcon(key, x0 + 24, y0 + 256, 20, A, k);
      text(pad2(ci), x0 + 54, y0 + 273, { role: 'label', size: 20, color: A, alpha: k });
      text(name, x0 + 24, y0 + 312, { role: 'h3', size: 30, color: C.ink, sentence: true, t, t0: t0 + 0.3, cps: 70 });
      if (cnt) { rich([{ s: String(cnt), role: 'stat', size: 60, color: C.ink, tnum: true, count: [t0 + 0.4, 0.9] }], x0 + tw2 - 24, y0 + 314, { t, align: 'right', alpha: k }); text('Ideas', x0 + tw2 - 24, y0 + 250, { role: 'label', size: 20, color: C.faint, align: 'right', alpha: k }); }
    });
    captions(t, [[0.8, 'Seven areas, one chapter each. Every claim on every slide says how we know it.']]);
  }
});

/* ============================== clicks ============================== */
S({
  id: 'clicks', ch: 'click', card: true, theme: 'night', title: 'clicks', settle: 5,
  sfxLoop: [{ t0: 3.4, per: 3.2, cues: [[0, 'click'], [0.09, 'release']] }],
  draw: t => {
    chapterCard(t, {
      name: 'clicks', gloss: 'the path a press takes from your finger to the switch, and the milliseconds after it.',
      list: [['#2', 'switches rotated to the trigger\'s arc'], ['#3', 'two plungers per trigger'], ['#4', 'one tensioner per switch'], ['#17', 'straight rear trigger cutouts'], ['#50', 'a bridge-shaped tensioner'], ['#79', 'SPDT switches, zero debounce'], ['mag', 'a magnetic sensor under each button'], ['#80', 'side buttons on rails']]
    });
    const pr = clickCurve(cyc(t, 3.4, 3.2));
    const o = drawClick(1300, 600, 12.6, { press: pr, x0: -12, longBoard: true, clear: true, alpha: ep(t, 1.0, 1.7) });
    figLabel(t, 2.0, 1130, 920, 2, 'A button, in section');
  }
});

/* ---------- clicks 1: rotate the switch to the trigger's arc (#2) ---------- */
S({
  id: 'arc', ch: 'click', theme: 'paper', title: 'push the switch along its own axis', settle: 8, ideas: [2], src: ['omronD2fPre', 'omronD2f'],
  sfxLoop: [{ t0: 2.6, per: 3, cues: [[0.0, 'click'], [0.09, 'release']] }],
  draw: t => {
    header(t, 'push the switch along its own axis');
    const wx = LM, wy = 272, ww = 900, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const tilt = ep(t, 5.0, 6.4, E.io3), pr = clickCurve(cyc(t, 2.6, 3)) * 0.75;
    const o = drawClick(wx + 240, wy + 190, 12.4, { press: pr, tilt, ghost: ep(t, 5.0, 5.6) * (tilt > 0.02 ? 1 : 0), pivot: ep(t, 1.0, 1.4), arc: ep(t, 1.6, 2.2), accent: A, alpha: Math.max(0.004, ep(t, 0.4, 1.0)) });
    callout(t, 1.2, o.rc, 'the trigger turns about the tensioner\'s bend', { to: [wx + 236, wy + 336], side: 'l', color: C.ink2, tcolor: C.ink2, role: 'small', maxW: 190 });
    /* the motion at the plunger, split along the switch axis and across it, in a detail bubble */
    const g = o.geo, mis = g.mis, ax = o.axisDir, mv = o.motion;
    const bx = wx + ww - 130, by = wy + 158, br = 96, kb = ep(t, 2.4, 2.9);
    if (kb > 0) {
      line(o.footW[0], o.footW[1], bx - br * 0.72, by + br * 0.7, { color: C.faint, w: 1.2, dash: [4, 4], alpha: kb });
      circle(bx, by, br, { fill: C.panel, color: C.ink, w: 1.5, alpha: kb });
      const L = 150, P0 = [bx - mv[0] * L * 0.5, by - mv[1] * L * 0.5], along = mv[0] * ax[0] + mv[1] * ax[1];
      const P1 = [P0[0] + mv[0] * L, P0[1] + mv[1] * L], Pa = [P0[0] + ax[0] * L * along, P0[1] + ax[1] * L * along];
      G.save(); G.beginPath(); G.arc(bx, by, br - 2, 0, TAU); G.clip();
      line(P0[0] - ax[0] * 80, P0[1] - ax[1] * 80, P0[0] + ax[0] * 200, P0[1] + ax[1] * 200, { color: A, w: 1.5, dash: [5, 5], alpha: kb });
      arrow(P0[0], P0[1], P1[0], P1[1], { color: C.ink, w: 3.5, hs: 14, alpha: kb });
      arrow(P0[0], P0[1], Pa[0], Pa[1], { color: A, w: 4, hs: 14, alpha: kb });
      if (Math.hypot(P1[0] - Pa[0], P1[1] - Pa[1]) > 4) arrow(Pa[0], Pa[1], P1[0], P1[1], { color: C.red, w: 3.5, hs: 11, alpha: kb });
      G.restore();
      text('At the plunger', bx, by - br - 16, { role: 'label', size: 20, color: C.mute, align: 'center', alpha: kb });
    }
    const deg = mis * 180 / Math.PI, k3 = ep(t, 3.0, 3.4);
    [['Off-axis angle', deg.toFixed(1) + '°', C.ink], ['Along the axis', (Math.cos(mis) * 100).toFixed(1) + '%', A], ['Sideways', (Math.sin(mis) * 100).toFixed(1) + '%', C.red]].forEach(([l, v, c], i) => {
      const x = wx + 32 + i * 260; text(l, x, wy + wh - 82, { role: 'label', size: 20, color: C.mute, alpha: k3 }); text(v, x, wy + wh - 30, { font: 'disp', size: 50, weight: 800, track: -0.01, color: c, alpha: k3, tnum: true });
    });
    text('Example: plunger 31 mm from the bend', wx + 28, wy + 46, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 3.2, 3.6) });
    /* the chart: how much goes sideways at each angle */
    const cx = 1040, cy = 272, cw = W - LM - 1040, ch = 568;
    demoWindow(cx, cy, cw, ch, ep(t, 0.5, 0.9));
    text('share of the press that pushes sideways', cx + 28, cy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(cx, cy, cw, ['derived'], ep(t, 1.0, 1.4));
    const m = axes(t, { x: cx + 90, y: cy + 120, w: cw - 140, h: 330, xr: [0, 20], yr: [0, 0.35], xticks: [0, 5, 10, 15, 20], yticks: [0, 0.1, 0.2, 0.3], xfmt: v => v + '°', yfmt: v => Math.round(v * 100) + '%', xlabel: 'angle between the motion and the switch axis', t0: 1.0 });
    const pts = []; for (let d = 0; d <= 20; d += 0.5) pts.push([d, Math.sin(d * Math.PI / 180)]);
    series(m, pts, { color: C.red, w: 3, p: ep(t, 1.3, 2.4, E.lin) });
    const pts2 = []; for (let d = 0; d <= 20; d += 0.5) pts2.push([d, 1 - Math.cos(d * Math.PI / 180)]);
    series(m, pts2, { color: A, w: 2.5, dash: [6, 5], p: ep(t, 1.6, 2.6, E.lin) });
    text('Sideways: {sin θ}', m.X(20) - 6, m.Y(Math.sin(20 * Math.PI / 180)) - 18, { role: 'label', color: C.red, align: 'right', alpha: ep(t, 2.4, 2.8) });
    text('Lost along the axis: {1 − cos θ}', m.X(20) - 6, m.Y(1 - Math.cos(20 * Math.PI / 180)) - 16, { role: 'label', color: A, align: 'right', alpha: ep(t, 2.6, 3.0) });
    for (const d of [5, 10, 15]) { const k = ep(t, 2.6 + d * 0.04, 3.0 + d * 0.04); const v = Math.sin(d * Math.PI / 180); circle(m.X(d), m.Y(v), 5, { fill: C.red, alpha: k }); text((v * 100).toFixed(1) + '%', m.X(d) - 10, m.Y(v) - 14, { role: 'label', color: C.red, align: 'right', alpha: k }); }
    const dd = clamp(deg, 0, 20); circle(m.X(dd), m.Y(Math.sin(dd * Math.PI / 180)), 9, { color: C.ink, w: 2.5, alpha: k3 });
    keyPlan(t, 2.0, wx + ww - 70, wy + 330, { s: 0.75, hi: 'trigL', cut: { type: 'long', x: -14, label: 'A' }, label: 'Section A' });
    gloss(t, 3.0, 'Off-axis load', 'The part of a press that pushes the plunger sideways instead of down. It scrapes the plunger in its guide and adds nothing to the click.');
    featureCard(t, 3.4, 'Rotated switches', ['derived', 'datasheet', 'proposal'], 'Turned to the trigger\'s arc at the plunger. Omron rates no off-axis load; it asks for a flat mount and a straight stroke.');
    captions(t, [[0.6, 'the trigger turns about the bend in its tensioner, so at the switch it doesn\'t travel straight down. it travels along an arc.'], [3.6, 'a switch standing straight up only gets the part of that motion along its axis. the rest pushes the plunger sideways.'], [6.4, 'rotate the switch to match the arc and the whole press goes into the plunger, with nothing left to scrape.']]);
  }
});

/* ---------- clicks 2: straight rear cutouts (#17), tensioner square to the press (#18), flat front cutouts (#46), flush walls (#48), (#47) ---------- */
S({
  id: 'cutouts', ch: 'click', theme: 'night', title: 'cut the triggers straight', settle: 8, ideas: [17, 18, 46, 48, 47],
  draw: t => {
    header(t, 'cut the triggers straight');
    const wx = LM, wy = 272, ww = 980, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('the tensioner, flat, from above', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    const sm = 1 - ep(t, 3.2, 4.8, E.io3), s = 18;
    const o = part(wx + ww / 2, wy + 330, s, () => tensionerPlanMM({ smile: sm, accent: A }), { alpha: ep(t, 0.4, 0.9) });
    /* the arms swing square to their bend line: on a curve that's a diagonal */
    const k = ep(t, 1.6, 2.2), col = sm > 0.5 ? C.red : A;
    if (o.arms) for (const arm of o.arms) for (let i = 0; i < 4; i++) {
      const x = lerp(arm.xl + 3, arm.xr - 3, i / 3), slope = arm.slope(x), y = o.edgeY(x) - 1.6, nl = Math.hypot(slope, 1), nx = slope / nl, ny = -1 / nl;
      const p = o.P(x, y - 1.6), q = o.P(x + nx * 6, y - 1.6 + ny * 6);
      arrow(p[0], p[1], q[0], q[1], { color: col, w: 3, hs: 11, alpha: k });
    }
    if (o.P) callout(t, 2.0, o.P(-8, o.edgeY(-8) - 1.6), 'The bend line follows the rear cutout', { to: [wx + 470, wy + 506], side: 'r', color: C.ink2, tcolor: C.ink2, maxW: 470 });
    text(sm > 0.5 ? 'Curved cutout: each arm swings on a diagonal' : 'Straight cutout: each arm swings square to the press', wx + 28, wy + wh - 28, { role: 'label', size: 21, color: col, alpha: k });
    /* the front: a flat stop, and walls flush with a pressed button */
    const fx = 1116, fw = W - LM - fx;
    demoWindow(fx, wy, fw, wh, ep(t, 0.5, 0.9));
    text('the front cutout, in section', fx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const fp = clickCurve(cyc(t, 5.4, 2.6)), fo = part(fx + 380, wy + 170, 17, () => frontStopMM({ press: fp, gapMark: ep(t, 5.6, 6.0), accent: A }), { alpha: ep(t, 0.8, 1.3) });
    callout(t, 5.5, fo.stop, 'Both faces flat, level with the ground', { to: [fx + 40, wy + 268], side: 'r', color: A, maxW: 330, sub: 'The gap is the post-travel.' });
    if (fo.dimAt) text('gap', fo.dimAt[0] - 10, fo.dimAt[1] + 5, { role: 'label', color: A, align: 'right', alpha: ep(t, 5.8, 6.2) });
    rule(fx + 28, wy + 372, fx + fw - 28, ep(t, 6.2, 6.6));
    text('Beside the button, from the front', fx + 28, wy + 410, { role: 'label', color: C.ink, alpha: ep(t, 6.4, 6.8) });
    const lp = clickCurve(cyc(t, 6.8, 2.6)), lo = part(fx + 230, wy + 470, 15, () => flushMM({ press: lp, ref: ep(t, 7.0, 7.4), accent: A }), { alpha: ep(t, 6.5, 7.0) });
    callout(t, 7.0, lo.wall, 'Wall level with the pressed button', { to: [fx + fw - 30, wy + 520], side: 'l', color: A, maxW: 260 });
    keyPlan(t, 1.4, wx + ww - 90, wy + 130, { s: 0.55, hi: 'rear', label: 'Rear cutout' });
    keyPlan(t, 5.4, fx + fw - 70, wy + 150, { s: 0.55, hi: ['trigL', 'trigR'], detail: { x: -14, y: -55, r: 8 }, label: 'Front' });
    gloss(t, 2.4, 'Tensioner', 'The spring arm under each button. It sets how hard the button presses and how fast it comes back.');
    featureCard(t, 5.0, 'Straight rear cutouts', ['derived', 'proposal'], 'The bend sits square to the press (#17, #18). Flat fronts tune travel in the mold (#46); flush walls (#48).');
    captions(t, [[0.6, 'the tensioner has to take the shape of the rear cutout, because that\'s where the trigger bends.'], [3.0, 'curve the cutout and each arm bends on a diagonal, which splits the press into two directions again.'], [5.4, 'at the front, two flat faces make the gap between them the post-travel, and a flat face is the easiest thing to recut in a mold.']]);
  }
});

/* ---------- clicks 3: two anchors per trigger (#3), POM pads beside the plunger (#28), hollow plungers (#56) ---------- */
S({
  id: 'anchors', ch: 'click', theme: 'paper', title: 'two anchors per trigger', settle: 9, ideas: [3, 28, 56], src: ['tpuUlx', 'delrin150'],
  sfxLoop: [{ t0: 2.2, per: 2.4, cues: [[0, 'click'], [0.09, 'release']] }],
  draw: t => {
    header(t, 'two anchors per trigger');
    const wx = LM, wy = 272, ww = 860, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const dual = t > 5.2, c = cyc(t, 2.2, 2.4), pr = clickCurve(c);
    const sway = dual ? 0 : 0.11 * pr;
    const o = part(wx + 110, wy + 512, 8.2, () => plateMM({ accent: A }), { alpha: ep(t, 0.4, 0.9), rot: sway });
    figLabel(t, 0.8, wx + 28, wy + 44, 3, 'one button, from above (schematic)');
    const hinge = o.hinge, a1 = o.p1, a2 = o.p2, press = o.edgePress;
    if (hinge) {
      circle(hinge[0], hinge[1], 8, { fill: C.ink, alpha: ep(t, 0.9, 1.3) }); text('tensioner tab', hinge[0] + 16, hinge[1] + 36, { role: 'label', color: C.mute, alpha: ep(t, 1.0, 1.4) });
      circle(a1[0], a1[1], 9, { fill: A, alpha: ep(t, 1.0, 1.4) }); text('Plunger 1', a1[0], a1[1] + 36, { role: 'label', size: 20, color: '#F3F2EE', align: 'center', alpha: ep(t, 1.2, 1.6) });
      const a2k = ep(t, 5.2, 5.7, E.snap); if (a2k > 0) { circle(a2[0], a2[1], 9 * a2k, { fill: A }); text('Plunger 2', a2[0], a2[1] + 36, { role: 'label', size: 20, color: '#F3F2EE', align: 'center', alpha: a2k }); }
      const ex = [a1[0] + (a1[0] - hinge[0]) * 0.25, a1[1] + (a1[1] - hinge[1]) * 0.25], ex0 = [hinge[0] - (a1[0] - hinge[0]) * 0.08, hinge[1] - (a1[1] - hinge[1]) * 0.08];
      line(ex0[0], ex0[1], ex[0], ex[1], { color: C.red, w: 2, dash: [6, 5], alpha: (1 - a2k) * ep(t, 1.6, 2.0) });
      if (!dual) text('roll axis', ex[0] + 10, ex[1] - 8, { role: 'label', color: C.red, alpha: ep(t, 1.8, 2.2) });
      circle(press[0], press[1], 14 + 10 * pr, { color: C.ink, w: 2.5, alpha: ep(t, 2.0, 2.3) });
      if (!dual && pr > 0.05) arrow(press[0] + 20, press[1], press[0] + 20 + 60 * pr, press[1], { color: C.red, w: 4, hs: 14 });
    }
    const tx = wx + 400;
    text(dual ? 'press near the edge: the button stays put' : 'press near the edge: the button rolls about one line', tx, wy + 120, { role: 'label', color: dual ? A : C.red, alpha: ep(t, 2.2, 2.6), maxW: 420, lh: 1.35 });
    text('"Can move laterally quite a bit when pushed": TechPowerUp, on the ULX.', tx, wy + 236, { role: 'small', color: C.mute, alpha: ep(t, 3.0, 3.4), maxW: 420, lh: 1.36 });
    text('A second anchor turns that line into a triangle, and a triangle can\'t roll.', tx, wy + 360, { role: 'small', weight: 600, color: C.ink, t, t0: 5.4, cps: 70, maxW: 420, lh: 1.36 });
    /* cross-section through the plunger guide */
    const sx = 990, sw = W - LM - sx;
    demoWindow(sx, wy, sw, wh, ep(t, 0.5, 0.9));
    text('section through the plunger guide', sx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const gp = clickCurve(cyc(t, 2.2, 2.4)), g = part(sx + sw / 2, wy + 282, 30, () => guideMM({ press: gp, pads: ep(t, 3.4, 3.9, E.snap), hollow: ep(t, 6.4, 6.9), accent: A }), { alpha: ep(t, 0.6, 1.1) });
    callout(t, 3.6, g.pad, 'POM pads, both sides', { to: [sx + 222, wy + 116], side: 'l', color: A, sub: 'Dry, μ 0.20', maxW: 200, prose: true });
    callout(t, 6.6, g.cavity, 'Hollow: a chamber that rings', { to: [sx + sw - 232, wy + 120], side: 'r', color: A, maxW: 210 });
    callout(t, 1.4, g.plunger, 'Switch plunger', { to: [sx + sw - 250, wy + 480], side: 'r', color: C.ink2, tcolor: C.mute, maxW: 220 });
    keyPlan(t, 1.0, wx + ww - 90, wy + 440, { s: 0.7, hi: 'trigR', label: 'One button' });
    gloss(t, 2.6, 'Lateral play', 'How far a button moves sideways when pressed near its edge. It reads as wobble and moves the click.');
    featureCard(t, 5.4, 'Two anchors per trigger', ['proposal'], 'A second plunger far from the first (#3), POM pads (#28), hollow plungers (#56).');
    captions(t, [[0.6, 'one plunger and one tensioner give a trigger a single line to roll around. press near the edge and it rolls.'], [5.2, 'a second plunger far from the first takes that line away, so every part of the button presses the same way.'], [7.2, 'POM pads keep the plunger aligned without grinding, and a hollow plunger gives the click a little room to ring.']]);
    source(t, 'ULX lateral play: TechPowerUp review. POM friction: Delrin 150 datasheet. Pads and hollow plungers: proposals.', { t0: 3 });
  }
});

/* ---------- clicks 4: where the tensioner bends (#50), how long it is (#59), one per switch (#4, #18), one screw (#49) ---------- */
function beamShape(n, bridge) {
  /* cantilever, fixed at x = 0, tip load at x = 1. h(x): thickness; curvature k = M/EI with M = (1 - x), I ~ h^3. deflection by double integration. */
  const xs = [], h = [], kap = [], y = [];
  for (let i = 0; i <= n; i++) { const x = i / n; xs.push(x); const hh = bridge ? 1 - 0.5 * Math.exp(-Math.pow((x - 0.55) / 0.13, 2)) : 1; h.push(hh); kap.push((1 - x) / Math.pow(hh, 3)); }
  let a = 0, d = 0; y.push(0);
  for (let i = 1; i <= n; i++) { a += (kap[i] + kap[i - 1]) / 2 / n; d += a / n; y.push(d); }
  return { xs, h, kap, y };
}
const BEAM_U = beamShape(120, false), BEAM_B = beamShape(120, true);
S({
  id: 'tensioner', ch: 'click', theme: 'night', title: 'decide where the tensioner bends', settle: 9, ideas: [50, 59, 4, 18, 49],
  draw: t => {
    header(t, 'decide where the tensioner bends');
    const wx = LM, wy = 272, ww = 900, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const load = 0.5 + 0.5 * Math.sin(Math.max(0, t - 2.6) * 2.2 - Math.PI / 2);
    const drawBeam = (B, y0, label, col, t0) => {
      const x0 = wx + 110, L = 600, k = ep(t, t0, t0 + 0.6);
      text(label, x0 - 40, y0 - 58, { role: 'label', color: C.ink, t, t0, cps: 60 });
      part(0, 0, 1, () => {
        /* clamp block with its screw, then the arm, in spring steel */
        solid(() => { G.beginPath(); G.rect(x0 - 64, y0 + 6, 64, 40); }, MT.shell, [x0 - 64, y0 + 6, 64, 40], { hatch: true });
        solid(() => { G.beginPath(); G.rect(x0 - 64, y0 - 30, 64, 20); }, MT.shell, [x0 - 64, y0 - 30, 64, 20], { hatch: true });
        solid(() => { G.beginPath(); G.moveTo(x0 - 50, y0 - 30); G.lineTo(x0 - 14, y0 - 30); G.lineTo(x0 - 14, y0 - 38); G.quadraticCurveTo(x0 - 16, y0 - 50, x0 - 28, y0 - 50); G.lineTo(x0 - 36, y0 - 50); G.quadraticCurveTo(x0 - 48, y0 - 50, x0 - 50, y0 - 38); G.closePath(); }, MT.steel, [x0 - 50, y0 - 50, 36, 20], { horiz: true });
        const top = [], bot = [];
        for (let i = 0; i <= 120; i++) { const x = x0 + B.xs[i] * L, dy = B.y[i] / BEAM_U.y[120] * 46 * load; top.push([x, y0 - B.h[i] * 8 + dy]); bot.push([x, y0 + B.h[i] * 8 + dy]); }
        solid(() => { G.beginPath(); G.moveTo(x0 - 64, y0 - 8); top.forEach(p => G.lineTo(p[0], p[1])); for (let i = bot.length - 1; i >= 0; i--) G.lineTo(bot[i][0], bot[i][1]); G.lineTo(x0 - 64, y0 + 8); G.closePath(); }, MT.spring, [x0, y0 - 10, L, 20], {});
      }, { alpha: k });
      /* curvature along the beam: where it actually bends */
      const kmax = Math.max(...BEAM_B.kap);
      G.save(); G.globalAlpha = ep(t, t0 + 0.8, t0 + 1.4); G.beginPath(); G.moveTo(x0, y0 + 120);
      for (let i = 0; i <= 120; i++) G.lineTo(x0 + B.xs[i] * L, y0 + 120 - B.kap[i] / kmax * 64);
      G.lineTo(x0 + L, y0 + 120); G.closePath(); G.fillStyle = rgba(col, 0.32); G.fill(); G.strokeStyle = col; G.lineWidth = 2; G.stroke(); G.restore();
      text('Bending along the arm', x0 + L, y0 + 150, { role: 'label', size: 20, color: C.mute, align: 'right', alpha: ep(t, t0 + 1.0, t0 + 1.4) });
      arrow(x0 + L, y0 - 72, x0 + L, y0 - 14 + B.y[120] / BEAM_U.y[120] * 46 * load, { color: C.ink, w: 3, hs: 12, alpha: ep(t, 2.4, 2.8) });
    };
    drawBeam(BEAM_U, wy + 140, 'Flat arm: bends at the screw', C.gray, 0.6);
    drawBeam(BEAM_B, wy + 380, 'Bridge arm: bends where it\'s thin', A, 1.4);
    /* stiffness against free length */
    const cx = 1036, cw = W - LM - cx;
    demoWindow(cx, wy, cw, 372, ep(t, 0.5, 0.9));
    text('stiffness against free length', cx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(cx, wy, cw, ['derived'], ep(t, 1.0, 1.4));
    const m = axes(t, { x: cx + 96, y: wy + 112, w: cw - 140, h: 170, xr: [0.8, 1.3], yr: [0, 2], xticks: [0.8, 0.9, 1, 1.1, 1.2, 1.3], yticks: [0, 0.5, 1, 1.5, 2], xfmt: v => v.toFixed(1) + '×', yfmt: v => v.toFixed(1) + '×', xlabel: 'free length, relative', t0: 1.0 });
    const pts = []; for (let L = 0.8; L <= 1.301; L += 0.01) pts.push([L, 1 / (L * L * L)]);
    series(m, pts, { color: A, w: 3, p: ep(t, 1.4, 2.4, E.lin) });
    const k11 = ep(t, 2.6, 3.0); circle(m.X(1.1), m.Y(1 / 1.331), 6, { fill: A, alpha: k11 }); text('10% longer, 25% lighter', m.X(1.1) - 12, m.Y(1 / 1.331) - 18, { role: 'label', size: 20, color: A, align: 'right', alpha: k11 });
    /* one tensioner per switch */
    const sy = wy + 392;
    demoWindow(cx, sy, cw, wh - 392, ep(t, 0.7, 1.1));
    text('One tensioner per switch', cx + 28, sy + 42, { role: 'label', color: C.ink, t, t0: 1.2, cps: 70 });
    const tilt = Math.sin(Math.max(0, t - 4) * 1.6) * 0.06 * ep(t, 4, 4.4);
    const sh = [cx + 60, sy + 100], sp = [cx + cw / 2 + 30, sy + 100];
    part(0, 0, 1, () => {
      xsave(); xmove(sh[0] + 140, sh[1]); xturn(tilt); solid(() => { G.beginPath(); G.rect(-150, -7, 300, 14); }, MT.spring, [-150, -7, 300, 14], {}); xrest();
      part(sh[0] + 140, sh[1], 5.2, () => screwHeadMM());
      for (const dx of [0, 170]) { solid(() => { G.beginPath(); G.rect(sp[0] + dx, sp[1] - 7, 120, 14); }, MT.spring, [sp[0] + dx, sp[1] - 7, 120, 14], {}); part(sp[0] + dx + 18, sp[1], 5.2, () => screwHeadMM()); }
    }, { alpha: ep(t, 1.4, 1.9) });
    text('Shared: one screw', sh[0], sh[1] + 50, { role: 'label', size: 20, color: C.red, alpha: ep(t, 1.6, 2.0) });
    text('Split: one each', sp[0], sp[1] + 50, { role: 'label', size: 20, color: A, alpha: ep(t, 1.8, 2.2) });
    keyPlan(t, 1.0, wx + ww - 80, wy + 240, { s: 0.55, hi: 'rear', label: 'Tensioners' });
    gloss(t, 3.0, 'Free length', 'The part of the tensioner that can bend. A taller fulcrum gives it more, so the click gets lighter.');
    featureCard(t, 3.6, 'Bridge tensioner', ['derived', 'proposal'], 'Thin in the middle, so it bends where we choose (#50). Taller fulcrum (#59). Split, one screw each (#4, #18, #49).');
    captions(t, [[0.6, 'a flat tensioner bends hardest at its screw, so where it bends is set by the fastener, not by design.'], [2.8, 'thin the middle into a bridge and the bend moves to where you put the thin part. the curve under each arm is the bending, computed.'], [5.6, 'and since stiffness falls with the cube of free length, a taller fulcrum is the cheapest way to a lighter click.']]);
  }
});

/* ---------- clicks 5: SPDT and the milliseconds after contact (#79), mechanical over optical (#78) ---------- */
function traceSig(kind, tms) {
  /* signals in volts (0..1) against time in ms; contact at 1.0 ms */
  if (kind === 'spdt_nc') return tms < 0.55 ? 1 : 0;
  if (kind === 'spdt_no') { if (tms < 1.0) return 0; return 1; }
  const end = kind === 'worn' ? 12.6 : 1.6;
  if (tms < 1.0) return 0; if (tms > end) return 1;
  const n = Math.floor((tms - 1.0) / (kind === 'worn' ? 0.22 : 0.07));
  return (Math.sin(n * 12.9898 + (kind === 'worn' ? 3 : 1)) * 43758.5453 % 1 + 1) % 1 > 0.42 ? 1 : 0;
}
S({
  id: 'latency', ch: 'click', theme: 'paper', title: 'the milliseconds after contact', settle: 10, ideas: [79, 78],
  src: ['tpuAtlantis', 'tomsBounce', 'tomsDebounce', 'tpuOp1', 'logiHybrid', 'omronD2fp', 'omronD2f'],
  sfx: [[7.2, 'snap']], sfxLoop: [{ t0: 1.2, per: 2.6, cues: [[0, 'click'], [0.1, 'release']] }],
  jolt: t => joltAt(t, 7.1),
  draw: t => {
    header(t, 'the milliseconds after contact');
    const wx = LM, wy = 272, ww = 780, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    figLabel(t, 0.6, wx + 28, wy + 44, 1, 'snap-action switch, cover clear');
    const sc = swCycle(t, 1.2, 2.6), X0 = wx + 44, Y0 = wy + 392, s = 33;
    const o = drawSwitch(X0, Y0, s, { press: sc.pr, state: sc.state, clear: true, accent: A, alpha: ep(t, 0.4, 1.0) });
    if (sc.c >= 0) { const ts = sc.c * 2.6, n = Math.floor((t - 1.2) / 2.6); contactSpark(o.contact, ts - SNAPC.no * 2.6, A, 0.8, 11 + n); contactSpark(o.contact, ts - SNAPC.nc * 2.6, A, 0.5, 53 + n); }
    callout(t, 1.0, o.com, 'COM', { to: [X0 + 0.6 * s, Y0 - 8.0 * s], side: 'r', color: C.ink2, tcolor: C.ink2, role: 'small' });
    callout(t, 1.2, o.nc, 'NC: closed at rest', { to: [X0 + 13.4 * s, Y0 - 8.4 * s], side: 'r', color: C.ink2, tcolor: C.ink2, maxW: 170, prose: true });
    callout(t, 1.4, o.no, 'NO: closed when pressed', { to: [X0 + 13.4 * s, Y0 - 1.4 * s], side: 'r', color: C.ink2, tcolor: C.ink2, maxW: 170, prose: true });
    lamp(X0 + 14.4 * s, Y0 + 1.6 * s, 'NC', sc.state === 'nc', A, ep(t, 1.6, 2.0)); lamp(X0 + 14.4 * s, Y0 + 2.8 * s, 'NO', sc.state === 'no', A, ep(t, 1.6, 2.0));
    text('Single-throw reads NO only. Double-throw reads both.', wx + 28, wy + wh - 28, { role: 'small', color: C.mute, alpha: ep(t, 2.0, 2.4), maxW: ww - 56 });
    /* traces */
    const rx = 910, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    const x0 = rx + 236, x1 = rx + rw - 36, T = 14, X = ms => x0 + (x1 - x0) * ms / T;
    const now = clamp((t - 1.6) / 3.6) * T;
    const rows = [['SPST, new', 'new'], ['SPST, worn', 'worn'], ['SPDT', 'spdt']];
    for (let ms = 0; ms <= T; ms += 2) { line(X(ms), wy + 50, X(ms), wy + 312, { color: C.hair, w: 1, alpha: ep(t, 0.9, 1.3) }); text(ms + ' ms', X(ms), wy + 336, { role: 'tick', color: C.mute, align: 'center', alpha: ep(t, 0.9, 1.3) }); }
    rows.forEach(([label, kind], i) => {
      const yb = wy + 116 + i * 86, amp = 44;
      text(label, rx + 28, yb - 14, { role: 'label', color: C.ink, t, t0: 1.0 + i * 0.15, cps: 70 });
      const sig = kind === 'spdt' ? ['spdt_no', 'spdt_nc'] : [kind];
      sig.forEach((sg, j) => {
        const pts = []; let prev = traceSig(sg, 0);
        for (let ms = 0; ms <= now; ms += 0.01) { const v = traceSig(sg, ms); if (v !== prev) pts.push([X(ms), yb - prev * amp]); pts.push([X(ms), yb - v * amp]); prev = v; }
        poly(pts, { color: j ? C.faint : (kind === 'spdt' ? A : C.ink), w: 2.2, dash: j ? [5, 4] : null });
      });
      if (kind === 'spdt') text('NO solid, NC dashed', rx + 28, yb + 14, { role: 'small', size: 21, color: C.mute, alpha: ep(t, 1.4, 1.8) });
      const reg = kind === 'spdt' ? 1.0 : 4.0;
      if (now > reg) { line(X(reg), yb - amp - 12, X(reg), yb + 8, { color: kind === 'spdt' ? A : C.red, w: 3 }); text(kind === 'spdt' ? 'Counted at first contact' : kind === 'new' ? 'Counted after a 3 ms wait' : 'Still bouncing at 12 ms: a double click', X(reg) + 10, yb - amp - 12, { role: 'small', size: 23, weight: 600, color: kind === 'spdt' ? A : C.red }); }
    });
    rule(rx + 28, wy + 360, rx + rw - 28, ep(t, 5.4, 5.8));
    /* the measured cost */
    text('Click latency, Lamzu Atlantis, by debounce', rx + 28, wy + 400, { role: 'label', color: C.ink, t, t0: 5.6, cps: 80 });
    pill(rx + rw - 24 - pillW('measured'), wy + 402, 'measured', ep(t, 5.8, 6.2));
    const bx0 = rx + 150, bw = rw - 540, BX = v => bx0 + bw * v / 6;
    [['0 ms', 2.4, A], ['4 ms', 5.4, C.red]].forEach(([l, v, col], i) => { const yy = wy + 462 + i * 40, k = ep(t, 6.2 + i * 0.3, 6.8 + i * 0.3, E.snap); text(l, rx + 28 + 104, yy + 6, { role: 'label', color: C.ink2, align: 'right', alpha: k }); rect(bx0, yy - 9, (BX(v) - bx0) * k, 18, { fill: col }); text(v.toFixed(1) + ' ms', BX(v) * 1 + 12, yy + 8, { role: 'num', size: 24, color: col, alpha: k }); });
    slam(t, 7.1, rx + rw - 96, wy + 540, '+3.0', 'ms', { size: 64, color: C.red, align: 'right' });
    keyPlan(t, 1.8, wx + ww - 80, wy + 420, { s: 0.5, hi: 'trigL', detail: { x: -13, y: -32, r: 7 }, label: 'Switch' });
    gloss(t, 2.4, 'Debounce', 'The wait a mouse adds after a switch makes contact, so the bouncing metal isn\'t read as extra clicks.');
    featureCard(t, 7.6, 'SPDT, zero debounce', ['measured', 'proposal'], 'Mechanical switches read on both throws (#79), with no always-on LED as optical ones need (#78).');
    captions(t, [[0.6, 'every switch has two fixed contacts. a single-throw mouse only reads one of them, so it has to wait out the bounce.'], [5.2, 'that wait is real time on your click. here is what it measured on one mouse.'], [8.0, 'read both throws and the moment NO closes is proof NC already opened, so the press counts immediately, even on a worn switch.']]);
  }
});

/* ---------- clicks: a magnetic sensor under each main button (SLX TMR-DS, Kunai, Superstrike) ---------- */
/** one press as a button sensor sees it: travel in mm against time in ms (an illustration on the example switch) */
function pressTravel(ms) {
  const seg = (a, b, v0, v1) => v0 + (v1 - v0) * E.io3(clamp((ms - a) / (b - a)));
  if (ms < 10) return 0; if (ms < 18) return seg(10, 18, 0, 0.03); if (ms < 30) return 0.03;
  if (ms < 48) return seg(30, 48, 0.03, 0.8); if (ms < 70) return 0.8; if (ms < 88) return seg(70, 88, 0.8, 0.03);
  if (ms < 104) return 0.03; if (ms < 112) return seg(104, 112, 0.03, 0); return 0;
}
const MAGB = (() => { let fire = 0, rel = 0, rt = 0; for (let ms = 0; ms < 120; ms += 0.05) { const d = pressTravel(ms); if (!fire && ms < 60 && d >= 0.5) fire = ms; if (!rt && ms > 60 && d <= 0.58) rt = ms; if (!rel && ms > 60 && d <= 0.3) rel = ms; } return { fire, rel, rt, t0: 1.4, dur: 4.4 }; })();
const magT = ms => MAGB.t0 + MAGB.dur * ms / 120;
/* after the first press is drawn, the chart fades and draws the next press, so the slide keeps time while it's talked over */
const MAGL = { T1: MAGB.t0 + MAGB.dur + 2.6, P: MAGB.dur + 2.6 };
const magLocal = t => t < MAGL.T1 ? t : MAGB.t0 - 0.5 + ((t - MAGL.T1) % MAGL.P);
S({
  id: 'magbuttons', ch: 'click', theme: 'night', title: 'a sensor under each main button', settle: 10, ideas: [78, 79, 'magnetic'],
  src: ['slxPdf', 'slxXt', 'logiSuperstrike', 'kunai'],
  sfx: [[magT(MAGB.fire), 'click'], [magT(MAGB.rel), 'release']],
  sfxLoop: [{ t0: MAGL.T1, per: MAGL.P, cues: [[(magT(MAGB.fire) - MAGB.t0 + 0.5) / MAGL.P, 'click'], [(magT(MAGB.rel) - MAGB.t0 + 0.5) / MAGL.P, 'release']] }],
  draw: t => {
    header(t, 'a sensor under each main button');
    const wx = LM, wy = 272, ww = 1040, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('one press, as the sensor under the button sees it', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 0.9, 1.3)); text('Illustration on the example switch', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const px0 = wx + 130, px1 = wx + ww - 50, py0 = wy + 150, py1 = wy + 450, X = ms => px0 + (px1 - px0) * ms / 120, Y = d => py0 + (py1 - py0) * d / 0.8, a0 = ep(t, 1.0, 1.4);
    for (const ms of [0, 20, 40, 60, 80, 100, 120]) { line(X(ms), py0, X(ms), py1, { color: C.hair, w: 1, alpha: a0 }); text(ms + ' ms', X(ms), py1 + 30, { role: 'tick', color: C.mute, align: 'center', alpha: a0 }); }
    for (const d of [0, 0.2, 0.4, 0.6, 0.8]) text(d.toFixed(1) + ' mm', px0 - 14, Y(d) + 7, { role: 'tick', color: C.mute, align: 'right', alpha: a0 });
    text('Travel', px0 - 14, py0 - 22, { role: 'label', size: 20, color: C.faint, align: 'right', alpha: a0 });
    for (const [d, l] of [[0.5, 'snaps closed'], [0.3, 'snaps open']]) { line(px0, Y(d), px1, Y(d), { color: C.faint, w: 1.2, dash: [6, 5], alpha: ep(t, 1.2, 1.6) }); text(l + ', ' + d + ' mm', px1, Y(d) - 8, { role: 'label', color: C.faint, align: 'right', alpha: ep(t, 1.2, 1.6) }); }
    const tl = magLocal(t), cyc0 = t < MAGL.T1 ? t - (MAGL.T1 - MAGL.P) : (t - MAGL.T1) % MAGL.P, fa = 1 - ep(cyc0, MAGL.P - 0.5, MAGL.P);
    const now = clamp((tl - MAGB.t0) / MAGB.dur) * 120;
    const tru = [], rd = []; for (let ms = 0; ms <= now; ms += 0.2) { const d = pressTravel(ms); tru.push([X(ms), Y(d)]); const q = Math.round(d / 0.01) * 0.01; if (rd.length) rd.push([X(ms), rd[rd.length - 1][1]]); rd.push([X(ms), Y(q)]); }
    poly(tru, { color: inkA(0.35), w: 5, alpha: fa }); poly(rd, { color: A, w: 2, alpha: fa });
    if (now > 0) { circle(X(now), Y(pressTravel(now)), 6, { fill: A, alpha: fa }); if (now < 120) circle(X(now), Y(pressTravel(now)), 12, { color: A, w: 1.5, alpha: fa * 0.4 }); }
    const mark = (ms, label, col, dash, ly, left) => { const k = ep(tl, magT(ms), magT(ms) + 0.3) * fa; if (k <= 0) return; line(X(ms), py0, X(ms), py1, { color: col, w: 2.5, dash, alpha: k }); text(label, X(ms) + (left ? -10 : 10), ly, { role: 'small', size: 23, weight: 600, color: col, alpha: k, align: left ? 'right' : 'left' }); };
    mark(MAGB.fire, 'Click fires at the snap', A, null, py0 + 22);
    mark(MAGB.rt, 'Rapid trigger lets go here', C.ink, [5, 4], py1 - 14, true);
    mark(MAGB.rel, 'Release at the snap back', A, null, Y(0.66));
    const kf = ep(tl, magT(18), magT(18) + 0.4) * fa; text('A finger resting on it', X(5), Y(0.03) + 34, { role: 'small', size: 23, weight: 600, color: C.ink2, alpha: kf }); line(X(22), Y(0.03) + 6, X(22), Y(0.03) + 16, { color: C.ink2, w: 1.5, alpha: kf });
    text('Colour: what the sensor reports, in 0.01 mm steps. Grey: the button.', wx + 28, wy + wh - 26, { role: 'small', size: 23, color: C.faint, alpha: ep(t, 2.0, 2.4), maxW: ww - 56 });
    /* the three ways makers already do it */
    const rx = 1176, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('who already reads the travel', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const blocks = [['Finalmouse SLX, TMR-DS', 'claim', 'A magnet per button, read in 40 steps of 0.01 mm. A Huano switch still clicks.'], ['Logitech Superstrike', 'claim', 'Inductive sensing over 0.6 mm, 10 levels, haptics for the click.'], ['Kunai', 'claim', 'Fires at the switch\'s own snap, learns each switch, feels a resting finger.']];
    let yy = wy + 100;
    blocks.forEach(([h2, ev, b], i) => { const k = ep(t, 1.2 + i * 0.5, 1.6 + i * 0.5); text(h2, rx + 28, yy, { role: 'label', color: A, alpha: k }); pill(rx + rw - 24 - pillW(ev), yy + 2, ev, k); const r = text(b, rx + 28, yy + 40, { role: 'small', color: C.ink2, t, t0: 1.3 + i * 0.5, cps: 130, maxW: rw - 56, lh: 1.36 }); yy += 40 + r.h + 26; });
    text('The switch stays for the feel. The timing comes from the sensor.', rx + 28, wy + wh - 62, { role: 'small', weight: 700, color: C.ink, t, t0: 3.4, cps: 80, maxW: rw - 56, lh: 1.36 });
    gloss(t, 2.4, 'TMR', 'Tunnel magnetoresistance: a sensor whose resistance follows a magnet\'s field, read to a hundredth of a millimetre.');
    featureCard(t, 6.4, 'A sensor per button', ['claim', 'proposal'], 'Magnetic sensing for timing, rapid trigger and a resting finger. The switch stays for the snap (#78).');
    captions(t, [[0.6, 'a switch only tells the mouse pressed or not. a magnetic sensor under the button tells it where the button is, all the time.'], [3.2, 'so the mouse can fire exactly at the snap, let go the moment the button comes back, or let go early for rapid trigger.'], [6.6, 'it also feels a finger resting on the button, which lets the mouse sleep the moment your hand leaves.']]);
  }
});
/* ---------- clicks 6: side buttons on rails (#80, #83), a divider (#29), held by switches and PCB (#64), a PCB across the mouse (#91) ---------- */
S({
  id: 'sidebuttons', ch: 'click', theme: 'night', title: 'side buttons on rails', settle: 9, ideas: [80, 83, 29, 64, 91],
  sfxLoop: [{ t0: 2.4, per: 2.6, cues: [[0, 'click'], [0.1, 'release']] }],
  draw: t => {
    header(t, 'side buttons on rails');
    const wx = LM, wy = 272, ww = 900, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    figLabel(t, 0.6, wx + 28, wy + 44, 4, 'a side button in section, shown pressing down');
    const pr = clickCurve(cyc(t, 2.4, 2.6)), o = part(wx + 340, wy + 190, 20, () => railMM({ press: pr, accent: A }), { alpha: ep(t, 0.4, 0.9) });
    callout(t, 1.2, o.rail, 'Two POM rails', { to: [wx + 640, wy + 170], side: 'r', color: A, maxW: 230 });
    callout(t, 1.5, o.boardSlot, 'Slots in the side PCB guide them', { to: [wx + 640, wy + 290], side: 'r', color: A, maxW: 230, prose: true });
    callout(t, 1.8, o.hook, 'Hooks set the end of travel', { to: [wx + 640, wy + 410], side: 'r', color: A, maxW: 230, prose: true });
    /* force needed against where the thumb lands */
    const cx = 1036, cw = W - LM - cx;
    demoWindow(cx, wy, cw, wh, ep(t, 0.5, 0.9));
    text('force needed, by where you press', cx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(cx, wy, cw, ['derived'], ep(t, 1.0, 1.4));
    const m = axes(t, { x: cx + 90, y: wy + 110, w: cw - 140, h: 330, xr: [0.15, 1], yr: [0, 4], xticks: [0.2, 0.4, 0.6, 0.8, 1], yticks: [0, 1, 2, 3, 4], xfmt: v => Math.round(v * 100) + '%', yfmt: v => v + '×', xlabel: 'press position, from the hinge end', t0: 1.0 });
    const hinge = []; for (let d = 0.15; d <= 1.001; d += 0.01) hinge.push([d, 0.6 / d]);
    series(m, hinge, { color: C.red, w: 3, p: ep(t, 1.5, 2.6, E.lin) });
    series(m, [[0.15, 1], [1, 1]], { color: A, w: 3.5, p: ep(t, 2.4, 3.2, E.lin) });
    text('Hinged: depends on where the thumb lands', m.X(0.3), m.Y(3.2), { role: 'small', size: 24, weight: 600, color: C.red, alpha: ep(t, 2.4, 2.8), maxW: 330, lh: 1.3 });
    text('On rails: the same everywhere', m.X(0.42), m.Y(1) + 38, { role: 'small', size: 24, weight: 600, color: A, alpha: ep(t, 3.0, 3.4) });
    keyPlan(t, 1.0, wx + 90, wy + 440, { s: 0.6, hi: 'side', cut: { type: 'cross', y: -18, label: 'B' }, label: 'Section B' });
    gloss(t, 3.4, 'Dual rail', 'The button slides straight in on two guides, like a keyboard switch, instead of bending on a hinge.');
    featureCard(t, 6.0, 'Side buttons on rails', ['derived', 'proposal'], 'The side PCB forms the rails (#83), carries the buttons (#64) and stiffens the wall (#91). A divider (#29).');
    captions(t, [[0.6, 'a hinged side button is a lever. press near the hinge and it takes far more force than at the tip.'], [3.4, 'on rails the whole button moves straight in, so it feels the same wherever your thumb is.'], [6.4, 'the board the switches sit on carries the rails too, so it doubles as a rib for the side wall. a divider between the two buttons gives the thumb a place to rest.']]);
  }
});

/* ============================== glide and tracking ============================== */
S({
  id: 'glide', ch: 'glide', card: true, theme: 'night', title: 'glide and tracking', settle: 5,
  draw: t => {
    chapterCard(t, { name: 'glide', gloss: 'what touches the pad, and how the sensor sees what is under it.', list: [['#10', 'two dot skates per corner'], ['#8', 'POM and PTFE both in the box'], ['#11', 'no cutouts under the skates'], ['#52', 'screws clear of the skates'], ['#37', 'a smaller sensor lens'], ['#76', 'a current sensor, set up properly'], ['lod', 'lift-off in 0.1 mm steps']] });
    const sink = 0.18 + 0.14 * (0.5 + 0.5 * Math.sin(t * 1.4));
    drawSkate(1440, 600, 34, { sink: sink * ep(t, 1.4, 2.2), alpha: ep(t, 1.0, 1.7) });
    figLabel(t, 2.0, 1130, 920, 5, 'A dot skate on a cloth pad');
  }
});
S({
  id: 'dots', ch: 'glide', theme: 'paper', title: 'eight dots, half the pressure', settle: 9, ideas: [10, 8], src: ['obsidianDots', 'plasticsFric', 'wieleba09', 'delrin150'],
  draw: t => {
    header(t, 'eight dots, half the pressure');
    const wx = LM, wy = 272, ww = 700, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    /* the hand's load rises and falls as it would in a session; both skates follow it, and the ratio never changes */
    const sk = ep(t, 2.6, 3.6, E.io3), load = 1 + 0.3 * Math.sin(Math.max(0, t - 4.4) * 1.5) * ep(t, 4.4, 5.4);
    const rows = [[wy + 52, 0.5, '4 dots of 6.5 mm', '133 mm² of contact', C.red], [wy + 318, 0.25, '8 dots of 6.5 mm', '265 mm²: half the pressure', A]];
    rows.forEach(([y0, d, l1, l2, col], i) => {
      const t0 = 0.6 + i * 0.4;
      text(l1, wx + 28, y0, { role: 'label', color: C.ink, t, t0, cps: 70 });
      text(l2, wx + 28, y0 + 30, { role: 'small', size: 24, weight: 600, color: col, t, t0: t0 + 0.3, cps: 90, alpha: ep(t, 1.6, 2.0) });
      const o = drawSkate(wx + ww / 2, y0 + 112, 28, { sink: d * sk * load, alpha: ep(t, t0, t0 + 0.5) });
      if (sk > 0.05) arrow(wx + ww / 2, y0 + 72 - 32 * load, wx + ww / 2, y0 + 72, { color: C.ink, w: 1.6 + 1.4 * load, hs: 8 + 3 * load, alpha: ep(t, 2.4, 2.8) });
      if (t > 4.6) text(i ? 'Same load, half the sink' : 'Hand load ' + load.toFixed(2) + '×', wx + 28, y0 + 64, { role: 'label', size: 20, color: i ? col : C.mute, alpha: ep(t, 4.6, 5.0) });
    });
    /* friction of skate materials */
    const cx = 840, cw = W - LM - cx;
    demoWindow(cx, wy, cw, wh, ep(t, 0.5, 0.9));
    text('friction coefficient, by material', cx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(cx, wy, cw, ['datasheet'], ep(t, 1.0, 1.4));
    hbars(t, { x: cx + 28, y: wy + 150, w: cw - 500, labelW: 290, rowH: 74, min: 0, max: 0.4, t0: 1.2, grid: [0, 0.1, 0.2, 0.3, 0.4], gridFmt: v => v.toFixed(1), rows: [
      { label: 'PTFE', v0: 0.05, v: 0.10, color: A, text: '0.05 to 0.10', sub: 'Fastest start' },
      { label: 'UHMW-PE', v0: 0.12, v: 0.25, color: C.gray, text: '0.12 to 0.25', sub: 'In between' },
      { label: 'POM (acetal)', v0: 0.11, v: 0.35, color: C.ink, text: '0.11 to 0.35', sub: 'Delrin 150: 0.20' }
    ] });
    text('Static, on steel, one rig (Wieleba 2009): PTFE 0.07 to 0.14, POM 0.14 to 0.18.', cx + 28, wy + 430, { role: 'small', size: 23, color: C.ink2, t, t0: 2.6, cps: 110, maxW: cw - 56, lh: 1.34 });
    text('PTFE for speed, POM for control and wear. Both ship in the box.', cx + 28, wy + 516, { role: 'small', weight: 700, color: A, t, t0: 3.6, cps: 60, maxW: cw - 56, lh: 1.34 });
    keyPlan(t, 1.0, wx + ww - 60, wy + 92, { s: 0.42, hi: 'skates', label: 'Skates' });
    gloss(t, 3.0, 'Static friction', 'The force to start a still mouse moving. Much above the moving friction, and small corrections jump.');
    featureCard(t, 4.0, 'Two dots per corner', ['derived', 'datasheet'], 'Round dots have no corners to catch (#10). POM and PTFE both in the box (#8).');
    source(t, 'Pad sink drawn to show the ratio, not measured. Friction: plastics datasheets, Wieleba 2009, Delrin 150.', { t0: 3 });
    captions(t, [[0.6, 'two dots in each corner doubles the contact area, so the same hand pressure is spread over twice the plastic.'], [3.0, 'on soft pads that is the difference between gliding over the cloth and sinking into it.'], [5.6, 'and since materials trade speed for control, the mouse ships with both instead of picking for you.']]);
  }
});
S({
  id: 'focus', ch: 'glide', theme: 'night', title: 'the sensor\'s 0.4 mm window', settle: 10, ideas: [11, 52, 37, 'lod'], src: ['paw3395', 'zowieSkates', 'huanLod', 'mkb3955', 'tpuUlx', 'tpuUlxLod'],
  draw: t => {
    header(t, 'the sensor\'s 0.4 mm window');
    const wx = LM, wy = 272, ww = 1060, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    figLabel(t, 0.6, wx + 28, wy + 44, 6, 'sensor and lens in section, 34 px per mm');
    const lift = 0.42 * Math.sin(Math.max(0, t - 3.4) * 0.9) * ep(t, 3.4, 4.0), s = 30;
    const o = drawSensor(wx + 560, wy + 318, s, { lift, accent: A, band: ep(t, 1.4, 1.9) > 0.5, alpha: ep(t, 0.4, 1.0) });
    const dist = 2.4 + lift;
    callout(t, 1.0, o.led, 'LED', { to: [wx + 300, wy + 128], side: 'l', color: C.ink2, tcolor: C.ink2 });
    callout(t, 1.2, o.pipe, 'Light pipe', { to: [wx + 170, wy + 300], side: 'l', color: C.ink2, tcolor: C.ink2 });
    callout(t, 1.4, o.array, 'Sensor array, through a hole in the board', { to: [wx + 600, wy + 128], side: 'r', color: C.ink2, tcolor: C.ink2, maxW: 300 });
    text('Window: lens to surface, 2.2 to 2.6 mm (PAW3395)', wx + 28, wy + wh - 28, { role: 'label', size: 21, color: A, alpha: ep(t, 1.6, 2.0) });
    if (o.spot) { text(`${dist.toFixed(2)} mm`, o.spot[0] + 22, o.spot[1] + 40, { role: 'h3', size: 30, color: o.inWin ? A : C.red, alpha: ep(t, 2.0, 2.4) }); text(o.inWin ? 'Tracking' : 'Outside: errors', o.spot[0] + 22, o.spot[1] + 64, { role: 'label', size: 20, color: o.inWin ? C.mute : C.red, alpha: ep(t, 2.0, 2.4) }); }
    
    /* right: LOD steps, and screws clear of the dots */
    const rx = 1196, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('lift-off settings', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const lx = rx + 40, lw2 = rw - 80;
    for (let i = 0; i <= 10; i++) { const x = lx + lw2 * i / 10, k = ep(t, 1.4 + i * 0.05, 1.7 + i * 0.05); line(x, wy + 110, x, wy + 140, { color: A, w: 2.5, alpha: k }); }
    text('0.1 mm steps, 0.7 to 1.7 mm: native on the PAW3955', lx, wy + 176, { role: 'small', size: 23, weight: 600, color: A, maxW: lw2, lh: 1.32, alpha: ep(t, 1.8, 2.2) });
    for (const v of [1, 2]) { const x = lx + lw2 * (v - 0.7) / 1.0; if (x < lx + lw2) line(x, wy + 236, x, wy + 266, { color: C.gray, w: 3, alpha: ep(t, 2.2, 2.6) }); }
    text('PAW3395: 1 and 2 mm presets', lx, wy + 298, { role: 'small', size: 23, weight: 600, color: C.mute, alpha: ep(t, 2.4, 2.8) });
    rule(rx + 28, wy + 330, rx + rw - 28, ep(t, 4.4, 4.8));
    /* a patch of base plate: two dots and the screw between them */
    const px0 = rx + rw / 2, py0 = wy + 430, kk = ep(t, 4.6, 5.0);
    part(px0, py0, 11, () => {
      solid(() => pathRR(-13, -6.5, 26, 13, 2.2), MT.shell, [-13, -6.5, 26, 13], {});
      for (const dx of [-7.6, 7.6]) { G.beginPath(); G.arc(dx, 0, 3.25, 0, TAU); G.fillStyle = grad(MT.ptfe, dx - 3, -3, dx + 3, 3); G.fill(); G.strokeStyle = edgeCol(MT.ptfe); G.lineWidth = lw(1); G.stroke(); G.beginPath(); G.arc(dx, 0, 2.9, 0, TAU); G.strokeStyle = 'rgba(0,0,0,0.12)'; G.lineWidth = lw(1); G.stroke(); }
      xsave(); xscale(0.8); screwHeadMM(); xrest();
    }, { alpha: kk });
    text('Screws between the dots (#52)', rx + 28, wy + wh - 28, { role: 'label', size: 21, color: A, alpha: ep(t, 5.0, 5.4), maxW: rw - 56 });
    keyPlan(t, 1.0, wx + ww - 80, wy + 380, { s: 0.6, hi: 'sensor', cut: { type: 'cross', y: 4, label: 'C' }, label: 'Section C' });
    gloss(t, 2.6, 'Lift-off distance', 'How high the mouse lifts before tracking stops. Fine steps let you set it just above your pad.');
    featureCard(t, 5.6, 'A 0.4 mm window', ['datasheet', 'derived'], 'Skates, pockets and lens height stack inside it (#11). A smaller lens (#37), 0.1 mm LOD steps.');
    captions(t, [[0.6, 'the sensor only sees the surface clearly between 2.2 and 2.6 mm from its lens. everything under the mouse stacks up inside that.'], [3.4, 'change the skate thickness by a few tenths and the surface leaves the window.'], [6.4, 'and the screws sit between the dots, so opening the mouse never costs you a set of skates.']]);
  }
});
S({
  id: 'sensor', ch: 'glide', theme: 'paper', title: 'fill every 8 kHz report', settle: 9, ideas: [76, 87, 'xy dpi'], src: ['tpu8k', 'paw3395', 'paw3950', 'eps3395', 'eps3950', 'kc3955', 'mkb3955', 'jisaku3395'],
  draw: t => {
    header(t, 'fill every 8 kHz report');
    const wx = LM, wy = 272, ww = 1000, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('Slowest hand that fills every report', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 1.0, 1.4));
    const m = axes(t, { x: wx + 110, y: wy + 120, w: ww - 170, h: 330, xr: [400, 6400], yr: [0, 21], xlog: true, xticks: [400, 800, 1600, 3200, 6400], yticks: [0, 5, 10, 15, 20], yfmt: v => v + ' in/s', xlabel: 'CPI', t0: 1.0 });
    const pts = []; for (let c = 400; c <= 6400; c *= 1.05) pts.push([c, 8000 / c]);
    series(m, pts, { color: A, w: 3.5, p: ep(t, 1.4, 2.6, E.lin) });
    for (const c of [800, 1600, 3200]) { const k = ep(t, 2.6 + c / 4000, 3.0 + c / 4000); circle(m.X(c), m.Y(8000 / c), 6, { fill: A, alpha: k }); text(`${(8000 / c).toFixed(1)} in/s`, m.X(c) + 14, m.Y(8000 / c) - 12, { role: 'num', size: 22, color: A, alpha: k }); }
    text('Below the line, some reports go out empty', m.X(450), m.Y(1.6), { role: 'small', size: 23, weight: 600, color: C.red, alpha: ep(t, 3.6, 4.0) });
    /* a probe sweeps the CPI; at a steady 4 in/s, sixteen reports show which ones carry a count */
    if (t > 6) {
      const pk = ep(t, 6, 6.6), u = 0.5 - 0.5 * Math.cos((t - 6) * TAU / 10), c = 400 * Math.pow(16, u), v = 8000 / c, cpr = 4 * c / 8000;
      line(m.X(c), m.Y(0), m.X(c), m.Y(Math.min(21, v)), { color: C.ink, w: 1.2, dash: [4, 4], alpha: pk * 0.5 });
      if (v <= 21) { circle(m.X(c), m.Y(v), 13, { color: C.ink, w: 1.5, alpha: pk * 0.35 }); circle(m.X(c), m.Y(v), 6, { fill: C.ink, alpha: pk }); }
      const sx = wx + ww - 40 - 16 * 19, sy = wy + 168;
      text(fmt(Math.round(c / 10) * 10) + ' CPI at 4 in/s', wx + ww - 40, wy + 150, { role: 'label', size: 21, color: C.ink, align: 'right', alpha: pk });
      let empty = 0;
      for (let i = 0; i < 16; i++) { const full = Math.floor((i + 1) * cpr + 1e-9) > Math.floor(i * cpr + 1e-9); if (!full) empty++; rr(sx + i * 19, sy, 15, 22, 3, full ? A : null, full ? null : C.red, 1.4, pk); }
      text(empty ? empty + ' of 16 reports empty' : 'Every report carries a count', wx + ww - 40, sy + 46, { role: 'label', size: 21, color: empty ? C.red : A, align: 'right', alpha: pk });
    }
    const rx = 1140, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('sensor generations', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['datasheet'], ep(t, 1.0, 1.4));
    const rows = [['', 'PAW3395', 'PAW3950', 'PAW3955'], ['out', '2022', '2024', '2026'], ['max speed', '650 IPS', '750 IPS', '750 IPS'], ['acceleration', '50 G', '50 G', '60 G'], ['CPI steps', '50', '50', '1'], ['run current', '2.4 mA', '1.3 mA', 'not public'], ['glass', 'no mode', 'glass mode', 'glass mode']];
    const cx = [rx + 28, rx + 200, rx + 360, rx + 520];
    rows.forEach((r, i) => { const y = wy + 120 + i * 44, k = ep(t, 1.6 + i * 0.12, 2.0 + i * 0.12); if (i) rule(rx + 28, y - 30, rx + rw - 28, k); r.forEach((c, j) => text(c, cx[j], y, j === 0 || !i ? { role: 'label', size: 19, color: j === 3 ? A : C.mute, alpha: k } : { font: 'mono', size: 22, weight: j === 3 ? 800 : 600, color: j === 3 ? A : C.ink2, alpha: k })); });
    
    text('The 3955 adds 1-CPI steps and 0.7 mm lift-off. Its LGA package solders flat, so the board sets its height.', rx + 28, wy + 470, { role: 'small', size: 24, color: C.ink, t, t0: 3.4, cps: 90, maxW: rw - 56, lh: 1.34 });
    gloss(t, 2.8, 'CPI', 'Counts per inch: movement steps reported per inch. At 8000 reports a second, each one needs a count.');
    featureCard(t, 4.2, 'A current sensor, set up right', ['datasheet', 'derived'], 'PAW3955 class, LGA package (#76). X and Y CPI apart, sensor angle in software (#87).');
    captions(t, [[0.6, 'at 8000 reports a second, the sensor has to have moved at least one count between reports, or the report goes out empty.'], [3.6, 'that sets a minimum hand speed for every CPI. the higher the CPI, the slower you can move and still use the full rate.'], [6.0, 'a newer sensor runs on about half the current, and the newest reports in single counts.']]);
  }
});

/* ============================== shell and structure ============================== */
S({
  id: 'shellcard', ch: 'shell', card: true, theme: 'night', title: 'shell and structure', settle: 5,
  draw: t => {
    chapterCard(t, { name: 'shell', gloss: 'what the mouse is made of, and how it carries a hand pressing on it.', list: [['#5', 'carbon-filled polypropylene'], ['#94', 'the PCB as structure'], ['#75', 'triangles, not hexagons'], ['#53', 'arched, connected ribbing'], ['#57', 'a more unibody shell'], ['#15', 'a fully solid shell'], ['#95', 'mass low, near the fingers']] });
    /* after it seats, the screw backs out and goes back in, the way an owner would open it, and the brass takes it each time */
    const k = t < 5.5 ? ep(t, 1.6, 3.0, E.io3) : 1 - 0.5 * (0.5 - 0.5 * Math.cos((t - 5.5) * TAU / 5));
    part(1480, 640, 40, () => insertMM({ k, melt: ep(t, 2.6, 3.0) * (1 - ep(t, 3.4, 4.2)) }), { alpha: ep(t, 1.0, 1.7) });
    figLabel(t, 2.0, 1130, 920, 7, 'A screw in a brass insert');
  }
});
S({
  id: 'materials', ch: 'shell', theme: 'paper', title: 'stiffness per gram, for a thin shell', settle: 9, ideas: [5, 94, 6],
  src: ['denkaAbs', 'plabase10', 'plabase20', 'kyron', 'az91d', 'fr4', 'cfpps'],
  draw: t => {
    header(t, 'stiffness per gram, for a thin shell');
    const wx = LM, wy = 272, ww = 1120, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('Panel stiffness at equal mass: {E^(1/3) / ρ}', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['datasheet', 'derived'], ep(t, 1.0, 1.4));
    hbars(t, { x: wx + 28, y: wy + 132, w: ww - 520, labelW: 400, rowH: 52, min: 1.0, max: 2.5, t0: 1.2, barH: 16, grid: [1.0, 1.5, 2.0, 2.5], gridFmt: v => v.toFixed(1), rows: [
      { label: 'ABS', v: 1.30, color: C.gray, text: '1.30', sub: '1.05 g/cm³, 2.55 GPa' },
      { label: 'FR4 (PCB core)', v0: 1.47, v: 1.56, color: C.gray, text: '1.47 to 1.56', sub: '1.85 g/cm³, 18 to 20 GPa' },
      { label: 'PPS, 30% carbon', v: 1.84, color: C.gray, text: '1.84', sub: '1.4 g/cm³, 17 GPa' },
      { label: 'magnesium AZ91D', v0: 1.98, v: 2.11, color: C.ink, text: '1.98 to 2.11', sub: '1.7 to 1.81 g/cm³, 46 GPa' },
      { label: 'Pyrofil PP, 10% carbon', v: 2.07, color: A, text: '2.07', sub: '0.96 g/cm³, 7.8 GPa' },
      { label: 'Pyrofil PP, 20% carbon', v: 2.36, color: A, text: '2.36', sub: '1.01 g/cm³, 13.5 GPa', bold: true },
      { label: 'KyronMAX PA66, 30%', v0: 2.28, v: 2.37, color: C.ink, dash: true, text: '~2.3*', sub: 'density not published' }
    ] });
    text('* KyronMAX density assumed 1.28 to 1.33 g/cm³. Pyrofil and ABS: flexural moduli.', wx + 28, wy + wh - 26, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 3, 3.4), maxW: ww - 56 });
    const rx = 1260, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('tensile strength', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['datasheet'], ep(t, 1.0, 1.4));
    const bars = [['FR4', 430, 430, A], ['AZ91D', 160, 220, C.ink], ['Pyrofil PP 20%', 120, 120, C.gray], ['ABS (yield)', 50, 50, C.gray]];
    bars.forEach(([l, a, b, col], i) => { const y = wy + 150 + i * 80, k = ep(t, 2.0 + i * 0.15, 2.8 + i * 0.15, E.snap), X = v => rx + 28 + (rw - 160) * v / 450; text(l, rx + 28, y - 12, { role: 'label', color: C.ink2, alpha: ep(t, 1.8 + i * 0.15, 2.2 + i * 0.15) }); rect(rx + 28, y, (X(b) - rx - 28) * k, 16, { fill: col, alpha: a !== b ? 0.45 : 1 }); if (a !== b) rect(rx + 28, y, (X(a) - rx - 28) * k, 16, { fill: col }); text(a === b ? a + ' MPa' : a + ' to ' + b + ' MPa', X(b) + 10, y + 14, { role: 'label', color: col, alpha: k }); });
    text('The PCB is about twice as strong as magnesium. Bolting the ribs to it uses weight the mouse carries anyway (#94).', rx + 28, wy + 470, { role: 'small', size: 24, color: C.ink, t, t0: 3.6, cps: 80, maxW: rw - 56, lh: 1.34 });
    gloss(t, 3.2, '{E^(1/3)/ρ}', 'Ashby\'s index for a light, stiff panel: a lighter material can be thicker, and stiffness grows with thickness cubed.');
    featureCard(t, 4.2, 'Carbon-filled polypropylene', ['datasheet', 'derived'], 'Less dense than ABS and about 5 times stiffer (#5). PPS carbon triggers on the pro model (#6).');
    captions(t, [[0.6, 'a mouse shell is a thin curved panel, and for panels the right comparison is stiffness per gram at equal mass.'], [3.4, 'by that measure 20% carbon polypropylene sits at the top, level with the best carbon nylons and ahead of magnesium.'], [6.2, 'and the strongest material in the mouse is the circuit board, so it should carry load too.']]);
  }
});

/* ---------- a mold only goes so thin: at a fixed weight a denser material gets a thinner wall ----------
   the same mass spread over the same 100 cm² of solid wall: t = m / (ρ A). carbon PP against magnesium, the
   doc's two real options for a light shell. densities from their datasheets; the floors from the sources named. */
const TW = { A: 100, pp: { rho: 1.01, name: 'carbon PP, 20%', floor: 0.89 }, mg: { rho: 1.81, name: 'magnesium AZ91D', floor: 0.7, floor2: 0.5 }, tol: 0.05 };
const twBudget = t => t < 3 ? 10 : 11 + 2 * Math.sin((t - 3) * TAU / 10 - Math.asin(0.5));
S({
  id: 'thinwall', ch: 'shell', theme: 'night', title: 'a mold only goes so thin', settle: 9, ideas: [5, 'wall'], src: ['protoWall', 'thixoDN', 'beall102', 'plabase20', 'az91d'],
  draw: t => {
    header(t, 'a mold only goes so thin');
    const wx = LM, wy = 272, ww = 1000, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const m = twBudget(t), tp = m / (TW.pp.rho * TW.A) * 10, tm = m / (TW.mg.rho * TW.A) * 10;
    text('the same weight over the same 100 cm² of wall', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 0.9, 1.3)); text('Magnesium is 1.8× as dense: its wall is 0.56 as thick', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const kb = ep(t, 1.0, 1.5);
    rich([{ s: 'Weight budget', role: 'label', size: 20, color: C.mute }, { s: m.toFixed(1) + ' g', font: 'disp', size: 40, weight: 800, color: A, tnum: true, gap: 14 }], wx + ww - 28, wy + 98, { align: 'right', alpha: kb });
    const S2 = 130, x0 = wx + 170, L = 470;
    [[TW.pp, tp, wy + 300, MT.shell], [TW.mg, tm, wy + 500, { g: ['#c9ced5', '#7f8790'] }]].forEach(([M, th, base, mt], j) => {
      const k = ep(t, 1.2 + j * 0.4, 1.8 + j * 0.4), h = th * S2, ok = th >= M.floor, col = ok ? A : C.red;
      text(M.name + ', ' + M.rho.toFixed(2) + ' g/cm³', x0 - 140, base - 136, { role: 'label', size: 20, color: C.ink, alpha: k });
      part(0, 0, 1, () => solid(() => { G.beginPath(); G.moveTo(x0, base - h); G.lineTo(x0 + L, base - h); brk(x0 + L, base - h, base, 6); G.lineTo(x0, base); brk(x0, base, base - h, -6); G.closePath(); }, mt, [x0, base - h, L, h], { hatch: { sp: 9 } }), { alpha: k });
      /* the floor: the thinnest wall the process fills well */
      const fy = base - M.floor * S2; line(x0 - 20, fy, x0 + L + 20, fy, { color: C.red, w: 1.6, dash: [7, 5], alpha: k });
      text(j ? 'Thixomolded walls: 0.7 mm' : 'Protolabs\' thinnest PP: 0.89 mm', x0 + L + 24, fy + 8, { role: 'small', size: 22, weight: 600, color: C.red, alpha: k });
      if (M.floor2) { const fy2 = base - M.floor2 * S2; line(x0 - 20, fy2, x0 + L + 20, fy2, { color: C.red, w: 1.2, dash: [3, 5], alpha: k * 0.7 }); text('Small parts: 0.5 mm', x0 + L + 24, fy2 + 8, { role: 'small', size: 22, weight: 600, color: C.red, alpha: k * 0.7 }); }
      /* the thickness, live */
      const dx = x0 - 34; line(dx, base - h, dx, base, { color: col, w: 2, alpha: k }); line(dx - 6, base - h, dx + 6, base - h, { color: col, w: 2, alpha: k }); line(dx - 6, base, dx + 6, base, { color: col, w: 2, alpha: k });
      text(th.toFixed(2) + ' mm', dx - 12, base - h / 2 + 8, { role: 'num', size: 22, color: col, align: 'right', alpha: k });
      text(ok ? 'Above its floor' : 'Below its floor: short shots', x0, base + 32, { role: 'label', size: 20, color: col, alpha: k });
    });
    
    /* the same tolerance on a thinner wall, and what equal mass does in bending */
    const rx = 1130, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('the same ±0.05 mm on a thinner wall', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['derived'], ep(t, 1.0, 1.4)); text('Stiffness goes with thickness cubed: ±3 × 0.05 / t', rx + 28, wy + 86, { role: 'small', size: 22, maxW: rw - 56, color: C.mute, alpha: ep(t, 1.1, 1.5) });
    const mx = axes(t, { x: rx + 96, y: wy + 108, w: rw - 140, h: 170, xr: [0.4, 1.4], yr: [0, 40], xticks: [0.4, 0.6, 0.8, 1.0, 1.2, 1.4], yticks: [0, 10, 20, 30, 40], xfmt: v => v.toFixed(1), yfmt: v => '±' + v + '%', xlabel: 'wall, mm', t0: 1.2 });
    const pts = []; for (let x = 0.4; x <= 1.4001; x += 0.02) pts.push([x, 300 * TW.tol / x]);
    series(mx, pts, { color: C.ink2, w: 2.5, p: ep(t, 1.6, 2.6, E.lin) });
    [[tp, A, 'PP'], [tm, C.red, 'Mg']].forEach(([th, col, l], j) => { const k = ep(t, 2.6 + j * 0.2, 3.0 + j * 0.2), v = 300 * TW.tol / th; circle(mx.X(th), mx.Y(v), 7, { fill: col, alpha: k }); text(l + ' ±' + v.toFixed(0) + '%', mx.X(th) + 12, mx.Y(v) - 10, { role: 'label', color: col, alpha: k }); });
    rule(rx + 28, wy + 338, rx + rw - 28, ep(t, 3.0, 3.4));
    text('At the same weight', rx + 28, wy + 380, { role: 'label', color: C.ink, alpha: ep(t, 3.2, 3.6) }); pill(rx + rw - 24 - pillW('datasheet'), wy + 382, 'datasheet', ep(t, 3.2, 3.6));
    const rows = [['{Strength / weight, σ/ρ}', 'Mg 88 to 129, PP 119', 'about level'], ['{Bending strength, σ/ρ²}', 'PP 1.5 to 2.4× Mg', 'PP'], ['{Bending stiffness, E/ρ³}', 'PP 1.4 to 1.7× Mg', 'PP']];
    rows.forEach(([a2, b2, c2], i) => { const y = wy + 428 + i * 46, k = ep(t, 3.4 + i * 0.3, 3.8 + i * 0.3); if (i) line(rx + 28, y - 30, rx + rw - 28, y - 30, { color: C.hair, w: 1, alpha: k }); text(a2, rx + 28, y, { role: 'small', size: 22, color: C.mute, alpha: k }); text(b2, rx + rw - 28, y, { font: 'mono', size: 22, weight: 700, color: i ? A : C.ink2, align: 'right', alpha: k }); });
    gloss(t, 2.4, 'Minimum wall', 'The thinnest section a resin fills well. Below it the melt freezes early, and the extra pressure leaves stress that warps the part.');
    featureCard(t, 5.0, 'A lighter resin, a thicker wall', ['datasheet', 'derived', 'proposal'], 'Carbon PP at about 1 mm, clear of its floor, where a denser resin sits at the edge of its own (#5).');
    captions(t, [[0.6, 'a mold can only fill a wall so thin, and the thinner the wall, the harder its size is to hold.'], [3.6, 'at a fixed weight a denser material has to be thinner. magnesium\'s wall is barely more than half the thickness of carbon PP\'s.'], [6.6, 'so a lighter material can win even when its strength to weight looks no better: it gets a wall the mold can make, and a thick wall is stiffer and stronger in bending.']]);
  }
});

/* a 2D frame solver: Euler-Bernoulli beams, 3 dof per node, dense Gaussian elimination */
function frameSolve(nodes, els, fixed, loads) {
  const n = nodes.length * 3, K = Array.from({ length: n }, () => new Float64Array(n)), F = new Float64Array(n);
  for (const e of els) {
    const [i, j] = e.n, a = nodes[i], b = nodes[j], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), c = dx / L, s = dy / L;
    const EA = e.A, EI = e.I, k1 = EA / L, k2 = 12 * EI / L ** 3, k3 = 6 * EI / L ** 2, k4 = 4 * EI / L, k5 = 2 * EI / L;
    const kl = [[k1, 0, 0, -k1, 0, 0], [0, k2, k3, 0, -k2, k3], [0, k3, k4, 0, -k3, k5], [-k1, 0, 0, k1, 0, 0], [0, -k2, -k3, 0, k2, -k3], [0, k3, k5, 0, -k3, k4]];
    const T = [[c, s, 0, 0, 0, 0], [-s, c, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0], [0, 0, 0, c, s, 0], [0, 0, 0, -s, c, 0], [0, 0, 0, 0, 0, 1]];
    const kg = Array.from({ length: 6 }, () => new Array(6).fill(0));
    for (let p = 0; p < 6; p++) for (let q = 0; q < 6; q++) { let v = 0; for (let r = 0; r < 6; r++) for (let u = 0; u < 6; u++) v += T[r][p] * kl[r][u] * T[u][q]; kg[p][q] = v; }
    const dof = [i * 3, i * 3 + 1, i * 3 + 2, j * 3, j * 3 + 1, j * 3 + 2];
    for (let p = 0; p < 6; p++) for (let q = 0; q < 6; q++) K[dof[p]][dof[q]] += kg[p][q];
  }
  for (const [k, fx, fy] of loads) { F[k * 3] += fx; F[k * 3 + 1] += fy; }
  for (const k of fixed) for (let d = 0; d < 3; d++) { const r = k * 3 + d; K[r].fill(0); for (let q = 0; q < n; q++) K[q][r] = 0; K[r][r] = 1; F[r] = 0; }
  for (let r = 0; r < n; r++) if (Math.abs(K[r][r]) < 1e-12) { K[r][r] = 1; F[r] = 0; }
  for (let col = 0; col < n; col++) {
    let piv = col; for (let r = col + 1; r < n; r++) if (Math.abs(K[r][col]) > Math.abs(K[piv][col])) piv = r;
    if (piv !== col) { const tmp = K[col]; K[col] = K[piv]; K[piv] = tmp; const tf = F[col]; F[col] = F[piv]; F[piv] = tf; }
    const d = K[col][col]; if (Math.abs(d) < 1e-14) continue;
    for (let r = col + 1; r < n; r++) { const f = K[r][col] / d; if (!f) continue; const Kr = K[r], Kc = K[col]; for (let q = col; q < n; q++) Kr[q] -= f * Kc[q]; F[r] -= f * F[col]; }
  }
  const U = new Float64Array(n);
  for (let r = n - 1; r >= 0; r--) { let v = F[r]; for (let q = r + 1; q < n; q++) v -= K[r][q] * U[q]; U[r] = K[r][r] ? v / K[r][r] : 0; }
  return U;
}
const LATTICE = (function () {
  const Wd = 300, Hd = 150, a = 40, h = a * Math.sqrt(3) / 2;
  const tri = { nodes: [], els: [] }, idx = {};
  for (let r = 0; r * h <= Hd + 0.1; r++) for (let c = 0; c * a + (r % 2) * a / 2 <= Wd + 0.1; c++) { idx[r + ',' + c] = tri.nodes.length; tri.nodes.push([c * a + (r % 2) * a / 2, r * h]); }
  for (const key in idx) { const [r, c] = key.split(',').map(Number), i = idx[key]; const nb = [[r, c + 1]].concat(r % 2 ? [[r + 1, c], [r + 1, c + 1]] : [[r + 1, c], [r + 1, c - 1]]); for (const [rr2, cc] of nb) { const j = idx[rr2 + ',' + cc]; if (j != null) tri.els.push({ n: [i, j] }); } }
  const hex = { nodes: [], els: [] }, key = p => Math.round(p[0] * 10) + ',' + Math.round(p[1] * 10), map = {};
  const R = 23.1, hw = Math.sqrt(3) * R;
  const addN = p => { const k = key(p); if (map[k] == null) { map[k] = hex.nodes.length; hex.nodes.push(p); } return map[k]; };
  for (let row = -1; row < 8; row++) for (let col = -1; col < 10; col++) {
    const cx = col * hw + (row % 2 ? hw / 2 : 0), cy = row * 1.5 * R; const vs = [];
    for (let k = 0; k < 6; k++) { const an = Math.PI / 6 + k * Math.PI / 3; vs.push([cx + R * Math.cos(an), cy + R * Math.sin(an)]); }
    for (let k = 0; k < 6; k++) { const p = vs[k], q = vs[(k + 1) % 6]; const inside = z => z[0] >= -0.1 && z[0] <= Wd + 0.1 && z[1] >= -0.1 && z[1] <= Hd + 0.1; if (inside(p) && inside(q)) { const i = addN(p), j = addN(q); if (!hex.els.some(e => (e.n[0] === i && e.n[1] === j) || (e.n[0] === j && e.n[1] === i))) hex.els.push({ n: [i, j] }); } }
  }
  const len = L => L.els.reduce((s2, e) => s2 + Math.hypot(L.nodes[e.n[1]][0] - L.nodes[e.n[0]][0], L.nodes[e.n[1]][1] - L.nodes[e.n[0]][1]), 0);
  const tt = 2.4, th = tt * len(tri) / len(hex);
  const solve = (L, t) => {
    for (const e of L.els) { e.A = t; e.I = t * t * t / 12; }
    const ys = L.nodes.map(p => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const used = new Set(); L.els.forEach(e => { used.add(e.n[0]); used.add(e.n[1]); });
    const fixed = [], top = []; L.nodes.forEach((p, i) => { if (!used.has(i)) fixed.push(i); else if (p[1] < y0 + 1) fixed.push(i); else if (p[1] > y1 - 1) top.push(i); });
    const U = frameSolve(L.nodes, L.els, fixed, top.map(i => [i, 0, -1 / top.length]));
    const dmax = Math.max(...top.map(i => -U[i * 3 + 1]));
    return { U, top, dmean: top.reduce((s2, i) => s2 - U[i * 3 + 1], 0) / top.length, dmax, len: len(L), t };
  };
  const st = solve(tri, tt), sh = solve(hex, th);
  return { tri, hex, st, sh, ratio: sh.dmean / st.dmean, Wd, Hd };
})();
S({
  id: 'lattice', ch: 'shell', theme: 'night', title: 'triangles don\'t bend', settle: 9, ideas: [75], src: ['mitHoney', 'ashby06'],
  sfx: [[3.2, 'seat']],
  draw: t => {
    header(t, 'triangles don\'t bend');
    const wx = LM, wy = 272, ww = 1150, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('same panel, same mass of material, same load on top', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 1.0, 1.4));
    text('Computed live by a frame solver in this page', wx + 28, wy + 86, { role: 'small', size: 22, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const ld = ep(t, 2.4, 4.0, E.io3) * (t > 4.0 ? 0.8 + 0.2 * Math.cos((t - 4.0) * 1.9) : 1), mag = 46 / LATTICE.sh.dmean;
    const drawL = (L, R, ox, oy, col, label, t0) => {
      const k = ep(t, t0, t0 + 0.8), sc = 1.45;
      const P = (i, f) => [ox + (L.nodes[i][0] + R.U[i * 3] * mag * f) * sc, oy - (L.nodes[i][1] + R.U[i * 3 + 1] * mag * f) * sc];
      G.save(); G.globalAlpha = k * 0.35; G.strokeStyle = C.faint; G.lineWidth = 1; G.beginPath(); for (const e of L.els) { const p = P(e.n[0], 0), q = P(e.n[1], 0); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); } G.stroke(); G.restore();
      G.save(); G.globalAlpha = k; G.strokeStyle = col; G.lineWidth = Math.max(1.5, R.t * sc * 0.9); G.lineCap = 'round'; G.beginPath(); for (const e of L.els) { const p = P(e.n[0], ld), q = P(e.n[1], ld); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); } G.stroke(); G.restore();
      part(0, 0, 1, () => solid(() => { G.beginPath(); G.rect(ox - 10, oy + 6, LATTICE.Wd * sc + 20, 12); }, MT.shell, [ox - 10, oy + 6, LATTICE.Wd * sc + 20, 12], { hatch: true }), { alpha: k });
      for (let x = 0; x <= LATTICE.Wd; x += 50) { const p = [ox + x * sc, oy - LATTICE.Hd * sc - 70]; arrow(p[0], p[1], p[0], p[1] + 44, { color: C.ink, w: 2.5, hs: 10, alpha: ep(t, 2.0, 2.4) }); }
      text(label, ox, oy + 60, { role: 'label', color: col, t, t0, cps: 60 });
    };
    drawL(LATTICE.tri, LATTICE.st, wx + 70, wy + 430, A, 'triangles', 1.2);
    drawL(LATTICE.hex, LATTICE.sh, wx + 620, wy + 430, C.red, 'hexagons', 1.5);
    text('deflection drawn ' + Math.round(mag) + '× real, the same for both', wx + ww - 28, wy + wh - 18, { role: 'small', color: C.faint, align: 'right', alpha: ep(t, 3, 3.4) });
    const rx = 1290, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    slam(t, 4.4, rx + 32, wy + 230, LATTICE.ratio.toFixed(0) + '×', '', { size: 120, color: A, label: 'More deflection for the hexagons: same load, same mass', maxW: rw - 64 });
    text('In-plane stiffness, textbook', rx + 32, wy + 400, { role: 'label', size: 20, color: C.ink2, alpha: ep(t, 5.4, 5.8) });
    text('Triangles ∝ density', rx + 32, wy + 436, { role: 'small', size: 25, weight: 700, color: A, alpha: ep(t, 5.6, 6.0) });
    text('Hexagons ∝ density³', rx + 32, wy + 470, { role: 'small', size: 25, weight: 700, color: C.red, alpha: ep(t, 5.8, 6.2) });
    text('Gibson and Ashby; MIT 3.054', rx + 32, wy + 504, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 6.0, 6.4) });
    gloss(t, 2.6, 'Statically determinate', 'A triangle can\'t change shape without stretching a side. A hexagon can, by bending at its joints.');
    featureCard(t, 6.2, 'Triangles, not hexagons', ['derived'], 'For every cutout lattice: shell, bottom plate and trigger underside (#75).');
    captions(t, [[0.6, 'here are two panels with the same outline, the same total material, and the same weight pressing on top.'], [4.0, 'the triangles carry the load along their struts. the hexagons have to bend their walls to carry it.'], [6.6, 'it is very confusing why most mice use hexagons when triangles are this much stiffer for the same weight.']]);
  }
});

/* ---------- triangles at every density and under every load ---------- */
function latSolve(L, t, mode) {
  for (const e of L.els) { e.A = t; e.I = t * t * t / 12; }
  const ys = L.nodes.map(p => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const used = new Set(); L.els.forEach(e => { used.add(e.n[0]); used.add(e.n[1]); });
  const fixed = [], top = []; L.nodes.forEach((p, i) => { if (!used.has(i)) fixed.push(i); else if (p[1] < y0 + 1) fixed.push(i); else if (p[1] > y1 - 1) top.push(i); });
  let loads, meas;
  if (mode === 'shear') { loads = top.map(i => [i, 1 / top.length, 0]); meas = U => top.reduce((a, i) => a + U[i * 3], 0) / top.length; }
  else if (mode === 'point') { const mid = top.reduce((b, i) => Math.abs(L.nodes[i][0] - 150) < Math.abs(L.nodes[b][0] - 150) ? i : b, top[0]); loads = [[mid, 0, -1]]; meas = U => -U[mid * 3 + 1]; }
  else { loads = top.map(i => [i, 0, -1 / top.length]); meas = U => -top.reduce((a, i) => a + U[i * 3 + 1], 0) / top.length; }
  const U = frameSolve(L.nodes, L.els, fixed, loads);
  return { U, d: meas(U) };
}
let LAT2 = null;
function lat2() {
  if (LAT2) return LAT2;
  const tri = LATTICE.tri, hex = LATTICE.hex, lt = LATTICE.st.len, lh = LATTICE.sh.len, area = LATTICE.Wd * LATTICE.Hd;
  const ts = [0.4, 0.6, 0.9, 1.3, 1.9, 2.7];
  const sweep = ts.map(t => { const a = latSolve(tri, t, 'press'), b = latSolve(hex, t * lt / lh, 'press'); return { rho: lt * t / area, kt: 1 / a.d, kh: 1 / b.d }; });
  const modes = ['press', 'shear', 'point'].map(m => { const a = latSolve(tri, 2.4, m), b = latSolve(hex, 2.4 * lt / lh, m); return { m, ratio: b.d / a.d }; });
  latSolve(tri, LATTICE.st.t, 'press'); latSolve(hex, LATTICE.sh.t, 'press');
  return (LAT2 = { sweep, modes });
}
S({
  id: 'lattice2', ch: 'shell', theme: 'paper', title: 'triangles win more as weight drops', settle: 9, ideas: [75], src: ['mitHoney', 'ashby06'],
  draw: t => {
    header(t, 'triangles win more as weight drops');
    const wx = LM, wy = 272, ww = 980, wh = 568, A = acc(), D = lat2();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('stiffness against how much material the panel holds', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 1.0, 1.4)); text('both panels at equal mass, solved as frames in this page', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const ks = D.sweep.flatMap(r => [r.kt, r.kh]), kmin = Math.min(...ks), kmax = Math.max(...ks), rmin = D.sweep[0].rho, rmax = D.sweep[D.sweep.length - 1].rho;
    const m = axes(t, { x: wx + 110, y: wy + 120, w: ww - 170, h: 320, xr: [rmin * 0.9, rmax * 1.1], yr: [kmin * 0.6, kmax * 1.6], xlog: true, ylog: true, xticks: [0.04, 0.06, 0.1, 0.15, 0.2], yticks: [], xfmt: v => Math.round(v * 100) + '%', xlabel: 'Relative density', t0: 1.0 });
    text('stiffer', wx + 70, wy + 132, { role: 'label', color: C.mute, alpha: ep(t, 1.2, 1.6) }); text('softer', wx + 70, wy + 440, { role: 'label', color: C.mute, alpha: ep(t, 1.2, 1.6) });
    series(m, D.sweep.map(r => [r.rho, r.kt]), { color: A, w: 3.5, p: ep(t, 1.6, 2.8, E.lin) });
    series(m, D.sweep.map(r => [r.rho, r.kh]), { color: C.red, w: 3.5, p: ep(t, 2.0, 3.2, E.lin) });
    D.sweep.forEach((r, i) => { const k = ep(t, 1.6 + i * 0.2, 2.0 + i * 0.2); circle(m.X(r.rho), m.Y(r.kt), 5, { fill: A, alpha: k }); circle(m.X(r.rho), m.Y(r.kh), 5, { fill: C.red, alpha: k }); });
    const r0 = D.sweep[0], r5 = D.sweep[D.sweep.length - 1];
    text('triangles', m.X(r5.rho) - 8, m.Y(r5.kt) - 14, { role: 'label', color: A, align: 'right', alpha: ep(t, 3.0, 3.4) });
    text('hexagons', m.X(r5.rho) - 8, m.Y(r5.kh) + 26, { role: 'label', color: C.red, align: 'right', alpha: ep(t, 3.2, 3.6) });
    /* a probe walks the density range, reading the gap between the two panels as it goes */
    if (t > 6.5) {
      const pk = ep(t, 6.5, 7.0), u = 0.5 - 0.5 * Math.cos((t - 6.5) * TAU / 9), n = D.sweep.length - 1, f = u * n, i0 = Math.min(n - 1, Math.floor(f)), fr = f - i0, P0 = D.sweep[i0], P1 = D.sweep[i0 + 1];
      const L = (a, b) => Math.exp(lerp(Math.log(a), Math.log(b), fr)), rho = L(P0.rho, P1.rho), kt = L(P0.kt, P1.kt), kh = L(P0.kh, P1.kh), px = m.X(rho);
      line(px, m.Y(kt), px, m.Y(kh), { color: C.ink, w: 1.5, dash: [4, 4], alpha: pk * 0.6 });
      circle(px, m.Y(kt), 9, { color: A, w: 2, alpha: pk }); circle(px, m.Y(kh), 9, { color: C.red, w: 2, alpha: pk });
      text(`${(rho * 100).toFixed(0)}% material: ${(kt / kh).toFixed(kt / kh < 10 ? 1 : 0)}× stiffer`, px + (u > 0.55 ? -16 : 16), (m.Y(kt) + m.Y(kh)) / 2 + 5, { role: 'label', color: C.ink, align: u > 0.55 ? 'right' : 'left', alpha: pk });
    }
    const g0 = r0.kt / r0.kh, g5 = r5.kt / r5.kh;
    text(`Triangles ${g5.toFixed(0)}× stiffer at ${Math.round(r5.rho * 100)}% material, ${g0.toFixed(0)}× at ${Math.round(r0.rho * 100)}%`, wx + 28, wy + wh - 28, { role: 'small', size: 24, weight: 700, color: A, t, t0: 3.6, cps: 70 });
    const rx = 1110, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('same panels, three ways to load them', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['derived'], ep(t, 1.0, 1.4)); text('how many times more the hexagons give', rx + 28, wy + 86, { role: 'small', size: 22, maxW: rw - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const names = { press: 'pressed evenly from above', shear: 'pushed sideways at the top', point: 'one finger in the middle' };
    const rmaxv = Math.max(...D.modes.map(x => x.ratio));
    D.modes.forEach((x, i) => { const y = wy + 140 + i * 90, k = ep(t, 1.6 + i * 0.35, 2.4 + i * 0.35, E.snap), bw = (rw - 190) * Math.log10(x.ratio) / Math.log10(rmaxv * 1.15); text(names[x.m], rx + 28, y, { role: 'label', color: C.ink2, alpha: ep(t, 1.4 + i * 0.35, 1.8 + i * 0.35) }); rect(rx + 28, y + 14, Math.max(3, bw * k), 20, { fill: C.red }); text(x.ratio.toFixed(0) + '×', rx + 28 + bw * k + 10, y + 30, { role: 'label', color: C.red, alpha: k }); });
    text('Bar length on a log scale', rx + 28, wy + 418, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 2.6, 3.0) });
    text('A triangle changes shape only by stretching a strut. A hexagon bends at its joints, the soft way to carry load.', rx + 28, wy + 462, { role: 'small', size: 24, color: C.ink, t, t0: 3.6, cps: 100, maxW: rw - 56, lh: 1.34 });
    gloss(t, 2.6, 'Relative density', 'The share of a panel that is material, not holes. A cutout shell runs low, where the gap is widest.');
    featureCard(t, 4.4, 'Triangles at every density', ['derived'], 'Stretching beats bending, and the lighter the panel, the bigger the win (#75).');
    captions(t, [[0.6, 'thin the struts to save weight and both panels get softer. the hexagons get softer much faster.'], [3.6, 'that is the textbook result: triangle stiffness scales with density, hexagon stiffness with density cubed. a light mouse lives at the bottom left of this chart.'], [6.2, 'and it holds for every way the hand loads the shell: pressing down, pushing sideways, or one finger in one spot.']]);
  }
});

/* ---------- filleting the lattice: what a rounded corner buys, and how big it should be ----------
   both slides read the study in 09-fillet-data.js: the same triangle lattice solved at eleven fillet radii, at
   the same mass (the struts thin as the fillets grow), pulled along one strut family. */
S({
  id: 'fillet', ch: 'shell', theme: 'night', title: 'round the lattice\'s corners', settle: 9, ideas: [75, 'fillet'], src: ['filletFE', 'beall106', 'doutre23'],
  draw: t => {
    header(t, 'round the lattice\'s corners');
    const wx = LM, wy = 272, ww = 1100, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('stress in the lattice, pulled along its struts', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 0.9, 1.3)); text('finite elements, solved for this deck: the same mass at every radius', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const r = filR(t), f = filAt(r), sc = 1.28, ix = wx + 28, iy = wy + 104, iw = 512 * sc, ih = 354 * sc, ka = ep(t, 0.7, 1.4);
    const I0 = FILLET.img[f.i], I1 = FILLET.img[f.i + 1];
    G.save(); rrPath(ix, iy, iw, ih, 8); G.clip();
    G.globalAlpha = ka; G.fillStyle = '#121316'; G.fillRect(ix, iy, iw, ih);
    if (I0 && I0.complete) { G.globalAlpha = ka * (1 - f.k); G.drawImage(I0, ix, iy, iw, ih); }
    if (I1 && I1.complete && f.k > 0.001) { G.globalAlpha = ka * f.k; G.drawImage(I1, ix, iy, iw, ih); }
    G.restore(); G.globalAlpha = 1;
    rr(ix, iy, iw, ih, 8, null, inkA(0.14), 1.2, ka);
    /* the hottest point, ringed */
    const hs = FILLET.hot[f.k < 0.5 ? f.i : f.i + 1], hx = ix + hs[0] * FILLET.px * sc, hy = iy + hs[1] * FILLET.px * sc, kh = ep(t, 1.8, 2.2) * ka, pul = 0.5 + 0.5 * Math.sin(t * 5);
    circle(hx, hy, 9 + 4 * pul, { color: '#ffffff', w: 2, alpha: kh * 0.9 }); circle(hx, hy, 22 + 6 * pul, { color: A, w: 1.2, alpha: kh * 0.4 });
    const lx = hx < ix + iw / 2 ? hx + 34 : hx - 34, la = hx < ix + iw / 2 ? 'left' : 'right', ly = hy < iy + ih / 2 ? hy + 44 : hy - 30;
    line(hx + (la === 'left' ? 10 : -10), hy + (ly > hy ? 8 : -8), lx, ly - 6, { color: '#ffffff', w: 1.2, alpha: kh * 0.7 });
    text('peak ' + f.scf.toFixed(1) + '× the average', lx, ly + 8, { role: 'label', color: '#ffffff', align: la, alpha: kh });
    /* scale and legend */
    const k2 = ep(t, 1.4, 1.8); line(ix + 16, iy + ih - 18, ix + 16 + FILLET.px * sc, iy + ih - 18, { color: '#ffffff', w: 2, alpha: k2 * 0.8 }); text('1 mm', ix + 16 + FILLET.px * sc + 8, iy + ih - 13, { role: 'label', color: '#ffffff', alpha: k2 * 0.8 });
    const gx = ix + iw - 214, gy = iy + ih - 26, gw = 196, gr = G.createLinearGradient(gx, 0, gx + gw, 0);
    [[0, '#2a2c33'], [0.45, '#6e5a1f'], [0.62, '#c9a630'], [0.78, '#f2d860'], [1, '#ffffff']].forEach(([o, c]) => gr.addColorStop(o, c));
    G.save(); G.globalAlpha = k2; G.fillStyle = gr; G.fillRect(gx, gy, gw, 8); G.restore();
    text('0', gx, gy - 8, { role: 'label', size: 19, color: C.mute, alpha: k2 }); text('12×', gx + gw, gy - 8, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: k2 });
    /* the readout */
    const ox = wx + 740, kr = ep(t, 1.2, 1.7), bw0 = ww - 740 - 32;
    const ro = (lab, y) => text(lab, ox, y, { role: 'label', size: 20, color: C.mute, alpha: kr });
    ro('Fillet radius', wy + 150); text(r.toFixed(2) + ' mm', ox, wy + 200, { font: 'disp', size: 46, weight: 800, color: A, alpha: kr, tnum: true });
    ro('Strut width', wy + 250); text(f.w.toFixed(2) + ' mm', ox, wy + 288, { font: 'disp', size: 34, weight: 800, color: C.ink, alpha: kr, tnum: true });
    ro('Peak stress', wy + 338); text(f.scf.toFixed(1) + '×', ox + bw0, wy + 338, { role: 'num', size: 24, color: f.scf > 12 ? C.red : A, align: 'right', alpha: kr });
    rr(ox, wy + 352, bw0, 12, 6, inkA(0.1), null, 0, kr); rr(ox, wy + 352, Math.max(12, bw0 * f.scf / 17), 12, 6, f.scf > 12 ? C.red : A, null, 0, kr);
    ro('Stiffness, same mass', wy + 408); const dE = (f.E / FILLET.ExM[0] - 1) * 100; text((dE >= 0 ? '+' : '') + dE.toFixed(1) + '%', ox, wy + 446, { font: 'disp', size: 34, weight: 800, color: dE > 0.5 ? A : C.ink, alpha: kr, tnum: true });
    text('vs a near-sharp corner', ox, wy + 478, { role: 'small', size: 22, color: C.faint, alpha: kr });
    /* what the radius buys */
    const rx = 1230, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('what the radius buys', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const items = [
      ['Half the peak stress', ['derived'], 'From 16.6 to 8.3 times the average, at the same weight.'],
      ['A stiffer panel', ['derived'], '5.5% stiffer at 0.75 mm, for no added material.'],
      ['An easier fill', ['claim'], 'The melt turns the corner: lower pressure, less stress frozen in.'],
      ['And its cost', ['study'], 'A fillet is material. At equal mass it can weaken a lattice (Doutre).']
    ];
    let yy = wy + 96;
    items.forEach(([h2, ev, b], i) => { const k = ep(t, 1.6 + i * 0.7, 2.0 + i * 0.7); text(h2, rx + 28, yy, { role: 'label', color: i === 3 ? C.ink : A, alpha: k }); cardPills(rx, yy - 50, rw, ev, k); const rr2 = text(b, rx + 28, yy + 36, { role: 'small', size: 24, color: C.ink2, t, t0: 1.7 + i * 0.7, cps: 130, maxW: rw - 56, lh: 1.32 }); yy += 36 + rr2.h + 30; });
    gloss(t, 2.8, 'Fillet', 'A rounded inside corner. Here it rounds every triangular hole where the struts meet.');
    featureCard(t, 5.2, 'Filleted lattice corners', ['derived', 'proposal'], 'Every hole rounded at its corners, the radius solved at the panel\'s real weight (#75).');
    captions(t, [[0.6, 'a sharp corner in a lattice is a notch. the load running down a strut has to turn there, and it crowds into the corner.'], [3.4, 'round the corners and the same load turns gradually. at the same weight, the peak stress halves.'], [6.6, 'a fillet is material, though, so how big it should be gets solved, not guessed.']]);
  }
});
S({
  id: 'filletsize', ch: 'shell', theme: 'paper', title: 'how big the fillet should be', settle: 10, ideas: [75, 'fillet'], src: ['filletFE', 'beall106', 'protoWall'],
  draw: t => {
    header(t, 'how big the fillet should be');
    const wx = LM, wy = 272, ww = 1100, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('peak corner stress against fillet radius', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 0.9, 1.3)); text('the lattice from the last slide, solved at eleven radii', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const m = axes(t, { x: wx + 110, y: wy + 118, w: ww - 170, h: 280, xr: [0, 1.25], yr: [4, 18], xticks: [0, 0.25, 0.5, 0.75, 1.0, 1.25], yticks: [4, 8, 12, 16], xfmt: v => v.toFixed(2) + ' mm', yfmt: v => v + '×', xlabel: 'fillet radius', t0: 1.0 });
    const R = FILLET.rs;
    /* the bottom of the curve, the pick, and where the struts get too thin to mold well */
    const kz = ep(t, 3.6, 4.2);
    rect(m.X(0.6), m.Y(18), m.X(1.05) - m.X(0.6), m.Y(4) - m.Y(18), { fill: rgba(A, 0.08), alpha: kz });
    rect(m.X(0.6), m.Y(18), m.X(0.75) - m.X(0.6), m.Y(4) - m.Y(18), { fill: rgba(A, 0.2), alpha: ep(t, 4.6, 5.2) });
    rect(m.X(1.05), m.Y(18), m.X(1.25) - m.X(1.05), m.Y(4) - m.Y(18), { fill: rgba(C.red, 0.08), alpha: ep(t, 5.4, 6.0) });
    text('Within 2% of the bottom', m.X(0.78), m.Y(17.4), { role: 'label', size: 19, color: A, align: 'center', alpha: kz });
    text('Thin', m.X(1.17), m.Y(17.4), { role: 'label', size: 19, color: C.red, align: 'center', alpha: ep(t, 5.4, 6.0) });
    series(m, R.map((r, i) => [r, FILLET.scfW[i]]), { color: C.gray, w: 2.5, dash: [7, 5], p: ep(t, 2.2, 3.4, E.lin) });
    series(m, R.map((r, i) => [r, FILLET.scfM[i]]), { color: A, w: 3.5, p: ep(t, 1.4, 2.8, E.lin) });
    R.forEach((r, i) => { const k = ep(t, 1.4 + i * 0.12, 1.8 + i * 0.12); circle(m.X(r), m.Y(FILLET.scfM[i]), 5, { fill: A, alpha: k }); });
    const ka = ep(t, 3.0, 3.4);
    text('Same mass: the struts thin as fillets grow', m.X(0.3), m.Y(10.9) - 28, { role: 'small', size: 23, weight: 600, color: A, alpha: ka });
    text('Same struts: lower, but 28% heavier', m.X(1.22), m.Y(FILLET.scfW[10]) + 30, { role: 'small', size: 23, weight: 600, color: C.mute, align: 'right', alpha: ep(t, 3.4, 3.8) });
    text('16.6×, near-sharp', m.X(0.05) + 12, m.Y(16.55) + 4, { role: 'label', color: C.ink2, alpha: ep(t, 1.6, 2.0) });
    /* a probe in step with the last slide's sweep */
    const r = filR(t), f = filAt(r), kp = ep(t, 2.6, 3.0);
    line(m.X(r), m.Y(4), m.X(r), m.Y(f.scf), { color: C.ink, w: 1.2, dash: [4, 4], alpha: kp * 0.5 });
    circle(m.X(r), m.Y(f.scf), 12, { color: C.ink, w: 1.5, alpha: kp * 0.4 }); circle(m.X(r), m.Y(f.scf), 6, { fill: C.ink, alpha: kp });
    text(r.toFixed(2) + ' mm: ' + f.scf.toFixed(1) + '×, struts ' + f.w.toFixed(2) + ' mm', m.X(r) + (r > 0.7 ? -16 : 16), m.Y(f.scf) - 18, { role: 'label', color: C.ink, align: r > 0.7 ? 'right' : 'left', alpha: kp });
    /* strut width at the same mass, under the chart */
    const sy = wy + 470, sx0 = m.X(0), sx1 = m.X(1.25), SY = v => sy + 44 - (v - 0.8) / 0.45 * 44, ks = ep(t, 2.0, 2.6);
    text('Strut width', wx + 28, sy + 14, { role: 'label', size: 20, color: C.mute, alpha: ks });
    poly(R.map((r2, i) => [m.X(r2), SY(FILLET.wM[i])]), { color: C.ink2, w: 2, alpha: ks });
    line(sx0, SY(0.9), sx1, SY(0.9), { color: C.red, w: 1.2, dash: [5, 4], alpha: ks });
    text('0.9 mm', sx1 - 4, SY(0.9) - 10, { role: 'label', size: 19, color: C.red, align: 'right', alpha: ks });
    /* how I pick it */
    const rx = 1230, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('how I pick it', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const steps = [['Hold the weight', 'Solve every radius at the real mass.'], ['Find the bottom', 'The peak falls fast, then flattens past 0.6 mm.'], ['Take its small end', '0.6 to 0.75 mm: the gain, with wide struts.'], ['Check the mold', 'No strut under 0.9 mm, the floor for PP.']];
    steps.forEach(([h2, b], i) => { const y = wy + 100 + i * 96, k = ep(t, 1.6 + i * 0.6, 2.0 + i * 0.6); text(pad2(i + 1), rx + 28, y + 6, { font: 'disp', size: 36, weight: 800, color: A, alpha: k, tnum: true }); text(h2, rx + 84, y - 8, { role: 'label', color: C.ink, alpha: k }); text(b, rx + 84, y + 26, { role: 'small', size: 23, color: C.ink2, t, t0: 1.7 + i * 0.6, cps: 130, maxW: rw - 112, lh: 1.3 }); });
    text('About half the strut, where plastics guides land too (Beall).', rx + 28, wy + 512, { role: 'small', size: 23, weight: 600, color: C.mute, t, t0: 4.6, cps: 120, maxW: rw - 56, lh: 1.3 });
    gloss(t, 3.0, 'same mass', 'every design compared at the same weight. a mouse has a weight target, so any gain that adds grams isn\'t a free one.');
    featureCard(t, 5.6, 'a fillet sized by solving', ['derived', 'proposal'], 'about half the strut width, 0.6 to 0.75 mm here, re-solved for each lattice at its real mass.');
    captions(t, [[0.6, 'held at the same weight, a fillet trades corner stress against strut width, so the curve has a bottom.'], [3.8, 'most of the gain comes in the first half millimetre. past 0.75 mm the struts thin faster than the corners improve.'], [7.0, 'so the pick is the small end of the bottom: nearly all the benefit, and struts wide enough to mold and hold.']]);
  }
});

/* ---------- the fillet sweep, solved: the stress field of a test lattice at the same weight, radius by radius ----------
   reads the study in 09-fillet-data.js: one triangle lattice solved at eleven fillet radii, at the same mass (the
   struts thin as the fillets grow), pulled along one strut family, the worse of the two directions solved. */
function filAt(r) {
  const R = FILLET.rs; let i = 0; while (i < R.length - 2 && R[i + 1] < r) i++;
  const k = clamp((r - R[i]) / (R[i + 1] - R[i])), L = a => lerp(a[i], a[i + 1], k);
  return { i, k, scf: L(FILLET.scfM), w: L(FILLET.wM), E: L(FILLET.ExM), scfW: L(FILLET.scfW), rhoW: L(FILLET.rhoW) };
}
/** the radius on screen: near-sharp, then rounded to the bottom of the curve, then the whole range in a loop */
function filR(t) {
  if (t < 3.0) return 0.05;
  if (t < 8.5) return lerp(0.05, 0.75, ep(t, 3.0, 5.2, E.io3));
  const u = (t - 8.5) % 12;
  return u < 3 ? lerp(0.75, 1.2, E.io3(u / 3)) : u < 4 ? 1.2 : u < 7 ? lerp(1.2, 0.05, E.io3((u - 4) / 3)) : u < 8 ? 0.05 : u < 11 ? lerp(0.05, 0.75, E.io3((u - 8) / 3)) : 0.75;
}
S({
  id: 'filletfe', ch: 'shell', theme: 'night', title: 'the fillet, solved at the same weight', settle: 10, ideas: [75, 'fillet'], src: ['filletFE', 'doutre23', 'envaliorRadii', 'protoWall'],
  draw: t => {
    header(t, 'the fillet, solved at the same weight');
    const wx = LM, wy = 272, ww = 1100, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('stress in a test lattice, pulled along its struts', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 0.9, 1.3)); text('finite elements, solved for this deck; the same mass at every radius', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const r = filR(t), f = filAt(r), sc = 1.28, ix = wx + 28, iy = wy + 104, iw = 512 * sc, ih = 354 * sc, ka = ep(t, 0.7, 1.4);
    const I0 = FILLET.img[f.i], I1 = FILLET.img[f.i + 1];
    G.save(); rrPath(ix, iy, iw, ih, 8); G.clip();
    G.globalAlpha = ka; G.fillStyle = '#121316'; G.fillRect(ix, iy, iw, ih);
    if (I0 && I0.complete) { G.globalAlpha = ka * (1 - f.k); G.drawImage(I0, ix, iy, iw, ih); }
    if (I1 && I1.complete && f.k > 0.001) { G.globalAlpha = ka * f.k; G.drawImage(I1, ix, iy, iw, ih); }
    G.restore(); G.globalAlpha = 1;
    rr(ix, iy, iw, ih, 8, null, inkA(0.14), 1.2, ka);
    /* the hottest point, ringed */
    const hs = FILLET.hot[f.k < 0.5 ? f.i : f.i + 1], hx = ix + hs[0] * FILLET.px * sc, hy = iy + hs[1] * FILLET.px * sc, kh = ep(t, 1.8, 2.2) * ka, pul = 0.5 + 0.5 * Math.sin(t * 5);
    circle(hx, hy, 9 + 4 * pul, { color: '#ffffff', w: 2, alpha: kh * 0.9 }); circle(hx, hy, 22 + 6 * pul, { color: A, w: 1.2, alpha: kh * 0.4 });
    const left = hx < ix + iw / 2, lx = left ? hx + 34 : hx - 34, ly = hy < iy + ih / 2 ? hy + 44 : hy - 30;
    line(hx + (left ? 10 : -10), hy + (ly > hy ? 8 : -8), lx, ly - 6, { color: '#ffffff', w: 1.2, alpha: kh * 0.7 });
    text('peak ' + f.scf.toFixed(1) + '× the average', lx, ly + 8, { role: 'label', color: '#ffffff', align: left ? 'left' : 'right', alpha: kh });
    /* scale and legend */
    const k2 = ep(t, 1.4, 1.8); line(ix + 16, iy + ih - 18, ix + 16 + FILLET.px * sc, iy + ih - 18, { color: '#ffffff', w: 2, alpha: k2 * 0.8 }); text('1 mm', ix + 16 + FILLET.px * sc + 8, iy + ih - 13, { role: 'label', color: '#ffffff', alpha: k2 * 0.8 });
    const gx = ix + iw - 214, gy = iy + ih - 26, gw = 196, gr = G.createLinearGradient(gx, 0, gx + gw, 0);
    [[0, '#2a2c33'], [0.45, '#6e5a1f'], [0.62, '#c9a630'], [0.78, '#f2d860'], [1, '#ffffff']].forEach(([o, c]) => gr.addColorStop(o, c));
    G.save(); G.globalAlpha = k2; G.fillStyle = gr; G.fillRect(gx, gy, gw, 8); G.restore();
    text('0', gx, gy - 8, { role: 'label', size: 19, color: '#c9c8c2', alpha: k2 }); text('12×', gx + gw, gy - 8, { role: 'label', size: 19, color: '#c9c8c2', align: 'right', alpha: k2 });
    /* the readout */
    const ox = wx + 740, kr = ep(t, 1.2, 1.7), bw0 = ww - 740 - 32;
    const ro = (lab, y) => text(lab, ox, y, { role: 'label', size: 20, color: C.mute, alpha: kr });
    ro('Fillet radius', wy + 150); text(r.toFixed(2) + ' mm', ox, wy + 200, { font: 'disp', size: 46, weight: 800, color: A, alpha: kr, tnum: true });
    ro('Strut width', wy + 250); text(f.w.toFixed(2) + ' mm', ox, wy + 288, { font: 'disp', size: 34, weight: 800, color: f.w < 0.9 ? C.red : C.ink, alpha: kr, tnum: true });
    ro('Peak stress', wy + 338); text(f.scf.toFixed(1) + '×', ox + bw0, wy + 338, { role: 'num', size: 24, color: f.scf > 12 ? C.red : A, align: 'right', alpha: kr });
    rr(ox, wy + 352, bw0, 12, 6, inkA(0.1), null, 0, kr); rr(ox, wy + 352, Math.max(12, bw0 * f.scf / 17), 12, 6, f.scf > 12 ? C.red : A, null, 0, kr);
    ro('Stiffness, same mass', wy + 408); const dE = (f.E / FILLET.ExM[0] - 1) * 100; text((dE >= 0 ? '+' : '') + dE.toFixed(1) + '%', ox, wy + 446, { font: 'disp', size: 34, weight: 800, color: dE > 0.5 ? A : C.ink, alpha: kr, tnum: true });
    text('vs a near-sharp corner', ox, wy + 478, { role: 'small', size: 22, color: C.faint, alpha: kr });
    /* the sweep as a curve */
    const rx = 1230, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('peak stress against radius', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const m = axes(t, { x: rx + 78, y: wy + 84, w: rw - 112, h: 214, xr: [0, 1.25], yr: [5, 17], xticks: [0, 0.25, 0.5, 0.75, 1.0, 1.25], yticks: [6, 10, 14], xfmt: v => v.toFixed(2), yfmt: v => v + '×', xlabel: 'fillet radius, mm', t0: 1.0 });
    const R = FILLET.rs, kz = ep(t, 3.6, 4.2);
    rect(m.X(0.6), m.Y(17), m.X(1.05) - m.X(0.6), m.Y(5) - m.Y(17), { fill: rgba(A, 0.08), alpha: kz });
    rect(m.X(0.6), m.Y(17), m.X(0.75) - m.X(0.6), m.Y(5) - m.Y(17), { fill: rgba(A, 0.22), alpha: ep(t, 4.6, 5.2) });
    rect(m.X(1.05), m.Y(17), m.X(1.25) - m.X(1.05), m.Y(5) - m.Y(17), { fill: rgba(C.red, 0.1), alpha: ep(t, 5.4, 6.0) });
    text('pick', m.X(0.675), m.Y(16.1), { role: 'label', color: A, align: 'center', alpha: ep(t, 4.6, 5.2) });
    text('thin', m.X(1.15), m.Y(16.1), { role: 'label', color: C.red, align: 'center', alpha: ep(t, 5.4, 6.0) });
    series(m, R.map((r2, i) => [r2, FILLET.scfW[i]]), { color: C.gray, w: 2, dash: [6, 5], p: ep(t, 2.2, 3.4, E.lin) });
    series(m, R.map((r2, i) => [r2, FILLET.scfM[i]]), { color: A, w: 3, p: ep(t, 1.4, 2.8, E.lin) });
    R.forEach((r2, i) => { const k = ep(t, 1.4 + i * 0.12, 1.8 + i * 0.12); circle(m.X(r2), m.Y(FILLET.scfM[i]), 4, { fill: A, alpha: k }); });
    const kp = ep(t, 2.6, 3.0); circle(m.X(r), m.Y(f.scf), 11, { color: C.ink, w: 1.5, alpha: kp * 0.4 }); circle(m.X(r), m.Y(f.scf), 5, { fill: C.ink, alpha: kp });
    text('same weight', m.X(0.32), m.Y(11.6), { role: 'label', color: A, alpha: ep(t, 3.0, 3.4) });
    text('Dashed: same struts, 28% heavier', m.X(0.27), m.Y(5.55), { role: 'label', size: 19, color: C.mute, alpha: ep(t, 3.4, 3.8) });
    let ny = wy + 392;
    [['The bottom is broad: 0.6 to 1.05 mm all land within 2% of the best.', C.ink2], ['Take its small end, 0.6 to 0.75 mm, with the struts kept widest.', C.ink], ['Past 1.05 mm the struts drop under 0.9 mm, the floor for PP.', C.red]].forEach(([s2, col], i) => { const r2 = text(s2, rx + 28, ny, { role: 'small', size: 23, weight: i === 1 ? 700 : 500, color: col, t, t0: 3.8 + i * 0.8, cps: 120, maxW: rw - 56, lh: 1.32 }); ny += r2.h + 10; });
    gloss(t, 2.8, 'Finite elements', 'The panel split into tens of thousands of small triangles, each solved, so the stress shows everywhere.');
    featureCard(t, 5.6, 'A fillet sized by solving', ['derived', 'proposal'], 'Half to three quarters of the strut, re-solved for each lattice at its real weight (#75).');
    captions(t, [[0.6, 'this is that sweep, solved: a test lattice pulled along its struts, held at the same weight for every radius.'], [3.6, 'from a near-sharp corner to 0.75 mm the peak stress halves, and the panel gets 5.5% stiffer for no added material.'], [7.0, 'fillets aren\'t free: held to the same mass, they weakened 3D-printed octet trusses (Doutre et al.). here the bottom is broad, so the pick is its small end.']]);
  }
});
/* ---------- triangles that form arches ---------- */
let ARCH = null;
function archSolve() {
  if (ARCH) return ARCH;
  const span = 60, rise = 14, N = 24, yA = x => -rise * (1 - Math.pow(x / (span / 2), 2));
  const build = kind => {
    const nodes = [], els = [];
    if (kind === 'flat') { for (let i = 0; i <= N; i++) nodes.push([-30 + 60 * i / N, 0]); for (let i = 0; i < N; i++) els.push({ n: [i, i + 1] }); return { nodes, els, fixed: [0, N], top: i => i } }
    if (kind === 'arch') { for (let i = 0; i <= N; i++) { const x = -30 + 60 * i / N; nodes.push([x, yA(x)]); } for (let i = 0; i < N; i++) els.push({ n: [i, i + 1] }); return { nodes, els, fixed: [0, N] }; }
    /* a triangulated arch: an outer arch, an inner arch 5 mm below it, a zig-zag of struts between */
    const M = 12; for (let i = 0; i <= M; i++) { const x = -30 + 60 * i / M; nodes.push([x, yA(x)]); }
    const inner = []; for (let i = 0; i < M; i++) { const x = -30 + 60 * (i + 0.5) / M; inner.push(nodes.length); nodes.push([x, yA(x) + 5 * Math.sin(Math.PI * (i + 0.5) / M)]); }
    for (let i = 0; i < M; i++) { els.push({ n: [i, i + 1] }); els.push({ n: [i, inner[i]] }); els.push({ n: [inner[i], i + 1] }); if (i < M - 1) els.push({ n: [inner[i], inner[i + 1]] }); }
    return { nodes, els, fixed: [0, M] };
  };
  const len = D => D.els.reduce((a, e) => a + Math.hypot(D.nodes[e.n[1]][0] - D.nodes[e.n[0]][0], D.nodes[e.n[1]][1] - D.nodes[e.n[0]][1]), 0);
  const mass = 60 * 1.6;
  const run = (kind, xLoad) => {
    const D = build(kind), t = mass / len(D);
    for (const e of D.els) { e.A = t; e.I = t * t * t / 12; }
    let li = 0, bd = 1e9; D.nodes.forEach((p, i) => { const onTop = kind !== 'truss' || i <= 12; if (!onTop) return; const d = Math.abs(p[0] - xLoad); if (d < bd) { bd = d; li = i; } });
    const U = frameSolve(D.nodes, D.els, D.fixed, [[li, 0, -1]]);
    return { D, U, t, li, d: -U[li * 3 + 1] };
  };
  const kinds = ['flat', 'arch', 'truss'];
  ARCH = { centre: kinds.map(k => run(k, 0)), off: kinds.map(k => run(k, 15)) };
  return ARCH;
}
S({
  id: 'arches', ch: 'shell', theme: 'night', title: 'triangles that form arches', settle: 10, ideas: [53, 55], src: ['comsol'],
  draw: t => {
    header(t, 'triangles that form arches');
    const wx = LM, wy = 272, ww = 1728, wh = 568, A = acc(), R = archSolve();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('the same mass of material across a 60 mm span, ends on two screw bosses', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 1.0, 1.4)); text('frames solved in this page; deflection drawn exaggerated, the same for all', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    /* after the first pass the finger keeps alternating, middle then off-centre, so the gap between the designs stays on screen */
    const c9 = t >= 9 ? (t - 9) % 8 : -1;
    const off = c9 >= 0 ? (c9 < 0.6 || c9 >= 4.0) : t > 5.6, set = off ? R.off : R.centre, base = set[0].d;
    const ld = c9 >= 0 ? (c9 < 0.6 ? 1 - ep(c9, 0, 0.6) : c9 < 4 ? ep(c9, 0.7, 1.5) * (1 - ep(c9, 3.4, 4.0)) : ep(c9, 4.1, 4.9)) : ep(t, 1.8, 2.8, E.io3) * (off ? ep(t, 5.6, 6.4, E.io3) : 1 - ep(t, 5.2, 5.6));
    const swap = c9 >= 0 ? 1 - 0.75 * Math.max(env(c9, 0.35, 0.6, 0.6, 0.85), env(c9, 3.75, 4.0, 4.0, 4.25)) : 1;
    const mag = 6 / R.centre[0].d;
    const labels = [['a flat panel', C.red], ['an arch', C.ink2], ['a triangulated arch', A]];
    set.forEach((r, ci) => {
      const ox = wx + 290 + ci * 575, oy = wy + 330, sc = 7.2, k = ep(t, 0.8 + ci * 0.3, 1.4 + ci * 0.3), D = r.D;
      const P = (i, f) => [ox + (D.nodes[i][0] + r.U[i * 3] * mag * f) * sc, oy + (D.nodes[i][1] + r.U[i * 3 + 1] * mag * f) * sc];
      const f = ld;
      G.save(); G.globalAlpha = k * 0.35; G.strokeStyle = C.faint; G.lineWidth = 1.2; G.setLineDash([4, 4]); G.beginPath(); for (const e of D.els) { const p = P(e.n[0], 0), q = P(e.n[1], 0); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); } G.stroke(); G.setLineDash([]); G.restore();
      G.save(); G.globalAlpha = k; G.strokeStyle = labels[ci][1]; G.lineCap = 'round'; G.lineWidth = Math.max(2.2, r.t * sc * 0.55); G.beginPath(); for (const e of D.els) { const p = P(e.n[0], f), q = P(e.n[1], f); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); } G.stroke(); G.restore();
      for (const sx of [-1, 1]) part(0, 0, 1, () => solid(() => { G.beginPath(); G.rect(ox + sx * 30 * sc - 18, oy - 4, 36, 60); }, MT.shell, [ox + sx * 30 * sc - 18, oy - 4, 36, 60], { hatch: true }), { alpha: k });
      const lp = P(r.li, f); arrow(lp[0], lp[1] - 86, lp[0], lp[1] - 10, { color: C.ink, w: 3.5, hs: 13, alpha: ep(t, 1.6, 2.0) });
      text(labels[ci][0], ox, wy + 140, { role: 'label', color: labels[ci][1], align: 'center', t, t0: 0.8 + ci * 0.3, cps: 60 });
      const rel = base / r.d;
      text(rel >= 10 ? rel.toFixed(0) + '× the flat panel' : rel > 1.05 ? rel.toFixed(1) + '× the flat panel' : 'baseline', ox, wy + 470, { role: 'h3', size: 30, color: labels[ci][1], align: 'center', alpha: ep(t, 3.0 + ci * 0.3, 3.4 + ci * 0.3) * swap });
    });
    text(off ? 'finger off-centre, 15 mm from the middle' : 'finger in the middle', wx + ww / 2, wy + 520, { role: 'label', color: off ? C.red : C.mute, align: 'center', alpha: ep(t, 2.0, 2.4) * swap });
    keyPlan(t, 1.0, wx + ww - 60, wy + 150, { s: 0.7, hi: 'hump', cut: { type: 'long', x: 0, label: 'E' }, label: 'section E' });
    gloss(t, 3.2, 'arch', 'a curve that turns a downward push into compression along itself, delivered to its ends. it needs solid ends to push against, like screw bosses.');
    featureCard(t, 6.8, 'arches built from triangles', ['derived', 'proposal'], 'connected arches landing on the screw bosses (#53), struts in the low front (#55).');
    captions(t, [[0.6, 'a flat span carries a press by bending, which is the soft way. curve the same material into an arch and the press becomes compression, carried to the ends.'], [3.6, 'build the arch out of triangles and no member has to bend at all: 22 times the flat panel, at the same weight.'], [6.6, 'move the finger off-centre and every design gives more, but the triangulated arch stays about two and a half times stiffer than the plain one.']]);
  }
});

/* ---------- fewer parts, tighter tolerances ---------- */
let TOL = null;
function tolSim() {
  if (TOL) return TOL;
  const r = rng(29), gauss = () => { const u = Math.max(1e-9, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v); };
  const sigma = 0.05 / 3, spec = 0.05, n = 2400;
  const sets = [1, 3, 6].map(N => { const g = []; for (let i = 0; i < n; i++) { let s = 0; for (let k = 0; k < N; k++) s += gauss() * sigma; g.push(s); } const out = g.filter(v => Math.abs(v) > spec).length / n; return { N, g, out }; });
  return (TOL = { sets, sigma, spec, n });
}
S({
  id: 'tolerance', ch: 'shell', theme: 'paper', title: 'fewer parts, tighter gaps', settle: 10, ideas: [57], src: ['dfma', 'rtingsUlx', 'xt1'],
  draw: t => {
    header(t, 'fewer parts, tighter gaps');
    const wx = LM, wy = 272, ww = 1180, wh = 568, A = acc(), T = tolSim();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('2,400 simulated mice: one seam\'s gap', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 1.0, 1.4)); text('Each part off by up to ±0.05 mm (3σ); the seam allows ±0.05 mm', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const fill = ep(t, 1.4, 4.4, E.lin);
    T.sets.forEach((st, ci) => {
      const ox = wx + 40 + ci * 375, oy = wy + 430, bw = 330, bins = 31, lo = -0.155, hi = 0.155, X = v => ox + bw * (v - lo) / (hi - lo), cnt = new Array(bins).fill(0);
      const shown = Math.floor(st.g.length * fill);
      for (let i = 0; i < shown; i++) { const b = Math.floor((st.g[i] - lo) / (hi - lo) * bins); if (b >= 0 && b < bins) cnt[b]++; }
      const cmax = T.n * 0.42, k = ep(t, 1.0 + ci * 0.2, 1.4 + ci * 0.2);
      rect(X(-T.spec), oy - 250, X(T.spec) - X(-T.spec), 250, { fill: rgba(A, 0.12), alpha: k });
      for (let b = 0; b < bins; b++) { const v0 = lo + (hi - lo) * b / bins, v1 = v0 + (hi - lo) / bins, h = Math.min(250, 250 * cnt[b] / cmax), inSpec = Math.abs((v0 + v1) / 2) <= T.spec; rect(X(v0) + 1, oy - h, X(v1) - X(v0) - 2, h, { fill: inSpec ? A : C.red }); }
      /* once the run is in, the line keeps building: each new mouse drops into its bin, red when its seam is out */
      if (t > 5) {
        const per = 0.42, j = Math.floor((t - 5) / per), ph = ((t - 5) % per) / per, v = st.g[(j * 7 + ci * 13) % st.g.length], b = Math.floor((v - lo) / (hi - lo) * bins);
        if (b >= 0 && b < bins) {
          const h = Math.min(250, 250 * cnt[b] / cmax), xx = X(lo + (hi - lo) * (b + 0.5) / bins), y1 = oy - h - 6, yy = lerp(oy - 250, y1, E.in3(clamp(ph / 0.7))), bad = Math.abs(v) > T.spec, la = ep(t, 5, 5.4);
          circle(xx, yy, 5, { fill: bad ? C.red : A, alpha: la * (1 - clamp((ph - 0.85) / 0.15)) });
          if (ph > 0.7) circle(xx, y1, 5 + (ph - 0.7) * 40, { color: bad ? C.red : A, w: 1.5, alpha: la * (1 - (ph - 0.7) / 0.3) * 0.7 });
        }
      }
      line(ox, oy, ox + bw, oy, { color: C.faint, w: 1.5, alpha: k });
      for (const v of [-0.1, 0, 0.1]) text((v > 0 ? '+' : '') + v.toFixed(1), X(v), oy + 24, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: k });
      text(st.N === 1 ? 'One part' : st.N + ' parts', ox, oy - 268, { role: 'label', color: C.ink, alpha: k });
      const outNow = shown ? st.g.slice(0, shown).filter(v => Math.abs(v) > T.spec).length / shown : 0;
      text((outNow * 100).toFixed(1) + '% out', ox, oy + 58, { role: 'num', size: 24, color: outNow > 0.05 ? C.red : A, alpha: ep(t, 1.8, 2.2) });
    });
    text('Gap error, {mm}', wx + ww - 28, wy + wh - 24, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ep(t, 1.4, 1.8) });
    const rx = 1310, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('why one part can be perfected', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const notes = [['Errors add: the spread grows with the square root of the parts, the worst case with the count.', C.ink], ['Features cut in one tool sit fixed to each other, so one part can be tuned in the steel.', C.ink], ['Across parts, every seam drifts on its own.', C.mute], ['In one DFMA case, halving the parts cut warranty cost to a tenth.', A]];
    let ny = wy + 104; notes.forEach(([s2, col], i) => { const r2 = text(s2, rx + 28, ny, { role: 'small', size: 23, weight: i ? 500 : 600, color: col, t, t0: 1.8 + i * 1.0, cps: 90, maxW: rw - 56, lh: 1.32 }); ny += Math.max(r2.h, 22) + 14; });
    gloss(t, 2.8, 'Tolerance stack', 'Every part is made slightly off. Where parts meet, their errors add up at the seam you see and feel.');
    featureCard(t, 6.2, 'A more unibody shell', ['derived', 'proposal'], 'Bottom rim, hump and sides as one part (#57): fewer seams, each tuned in the steel.');
    captions(t, [[0.6, 'every part is a little off its drawing. one part\'s error you can measure and correct in the mold.'], [3.8, 'stack the same seam through six parts and a fifth of the mice fall outside the gap, rattling or rubbing, even though every part is in spec.'], [6.8, 'that is the real case for fewer parts: each one left is a dimension you can actually perfect.']]);
  }
});

/* ---------- arches, struts and fewer parts: a generic slice across a thin shell, squeezed, solved as a frame ---------- */
const SLICE = (function () {
  /* a generic arch, 60 wide and 34 tall, clamped at the base. squeezed at mid-wall like a grip. mm and N, E folded in */
  const N = 56, nodes = [];
  for (let i = 0; i <= N; i++) { const th = Math.PI * (1 - i / N), c = Math.cos(th), s = Math.sin(th); nodes.push([30 * Math.sign(c) * Math.pow(Math.abs(c), 0.6), -34 * Math.pow(s, 0.7)]); }
  const near = (side) => { let best = 0, bd = 1e9; nodes.forEach((p, i) => { if (Math.sign(p[0]) !== side) return; const d = Math.abs(p[1] + 13); if (d < bd) { bd = d; best = i; } }); return best; };
  const iL = near(-1), iR = near(1);
  const elsFor = th => { const els = []; for (let i = 0; i < N; i++) { const t2 = th((nodes[i][1] + nodes[i + 1][1]) / 2); els.push({ n: [i, i + 1], A: t2, I: t2 * t2 * t2 / 12, t: t2 }); } return els; };
  const L = i => Math.hypot(nodes[i + 1][0] - nodes[i][0], nodes[i + 1][1] - nodes[i][1]);
  const flat = () => 1.2;
  const taperRaw = y => 0.7 + 0.6 * (1 + y / 34);                       /* thicker toward the bottom */
  let num = 0, den = 0; for (let i = 0; i < N; i++) { const y = (nodes[i][1] + nodes[i + 1][1]) / 2; num += 1.2 * L(i); den += taperRaw(y) * L(i); }
  const taper = y => taperRaw(y) * num / den;                           /* same mass as the flat wall */
  const run = (th, strut) => {
    const els = elsFor(th); if (strut) els.push({ n: [iL, iR], A: 1.6 * 1.5, I: 1.6 ** 3 / 12 * 1.5, t: 1.6, strut: true });
    const U = frameSolve(nodes, els, [0, N], [[iL, 1, 0], [iR, -1, 0]]);
    return { els, U, d: (U[iL * 3] - U[iR * 3]) / 2 };
  };
  const a = run(flat, false), b = run(taper, false), c = run(taper, true);
  return { nodes, iL, iR, a, b, c };
})();
S({
  id: 'ribs', ch: 'shell', theme: 'paper', title: 'arches, struts and fewer parts', settle: 9, ideas: [53, 55, 57, 93, 91], src: ['rtingsUlx', 'xt1', 'comsol'],
  draw: t => {
    header(t, 'arches, struts and fewer parts');
    const wx = LM, wy = 272, ww = 1000, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('A slice across a thin shell, squeezed', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 1.0, 1.4));
    text('Generic arch, solved as a frame here; same mass in the first two', wx + 28, wy + 86, { role: 'small', size: 22, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const sq = ep(t, 2.2, 3.4, E.io3) * (t > 3.4 ? 0.8 + 0.2 * Math.cos((t - 3.4) * 1.9) : 1), mag = 4 / SLICE.a.d;
    const cases = [[SLICE.a, 'Even walls', C.red, 1.2], [SLICE.b, 'Thicker low', C.ink, 1.6], [SLICE.c, 'Plus the PCB', A, 2.0]];
    cases.forEach(([R, label, col, t0], ci) => {
      const ox = wx + 170 + ci * 330, oy = wy + 410, sc = 4.2, k = ep(t, t0, t0 + 0.6);
      const P = (i, f) => [ox + (SLICE.nodes[i][0] + R.U[i * 3] * mag * f) * sc, oy + (SLICE.nodes[i][1] + R.U[i * 3 + 1] * mag * f) * sc];
      G.save(); G.globalAlpha = k * 0.4; G.strokeStyle = C.faint; G.lineWidth = 1.2; G.setLineDash([4, 4]); G.beginPath(); SLICE.nodes.forEach((p, i) => { const q = P(i, 0); i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); }); G.stroke(); G.setLineDash([]); G.restore();
      G.save(); G.globalAlpha = k; G.lineCap = 'round'; G.strokeStyle = TH ? '#2f3036' : '#3a3b41';
      for (const e of R.els) { const p = P(e.n[0], sq), q = P(e.n[1], sq); G.lineWidth = e.t * sc * 1.4; G.beginPath(); G.moveTo(p[0], p[1]); G.lineTo(q[0], q[1]); G.strokeStyle = e.strut ? A : '#3a3b41'; G.stroke(); }
      G.restore();
      part(0, 0, 1, () => solid(() => { G.beginPath(); G.rect(ox - 34 * sc, oy, 68 * sc, 10); }, MT.shell, [ox - 34 * sc, oy, 68 * sc, 10], { hatch: true }), { alpha: k });
      const pl = P(SLICE.iL, sq), pr2 = P(SLICE.iR, sq);
      arrow(pl[0] - 62, pl[1], pl[0] - 8, pl[1], { color: C.ink, w: 3, hs: 11, alpha: ep(t, 2.0, 2.4) }); arrow(pr2[0] + 62, pr2[1], pr2[0] + 8, pr2[1], { color: C.ink, w: 3, hs: 11, alpha: ep(t, 2.0, 2.4) });
      text(label, ox, oy + 44, { role: 'label', color: col, align: 'center', t, t0, cps: 70, maxW: 300 });
      const rel = R.d / SLICE.a.d;
      text(rel > 0.1 ? rel.toFixed(2) + '×' : rel.toFixed(3) + '×', ox, oy + 76, { role: 'h3', size: 30, color: col, align: 'center', alpha: ep(t, 3.6 + ci * 0.3, 4.0 + ci * 0.3) });
    });
    text('Squeeze relative to even walls; deflection exaggerated.', wx + ww - 28, wy + wh - 22, { role: 'small', size: 21, color: C.faint, align: 'right', alpha: ep(t, 4.4, 4.8) });
    const rx = 1140, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('gap stack-up, by number of parts', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['derived'], ep(t, 1.0, 1.4));
    const m = axes(t, { x: rx + 104, y: wy + 110, w: rw - 140, h: 210, xr: [1, 6], yr: [0, 0.32], xticks: [1, 2, 3, 4, 5, 6], yticks: [0, 0.1, 0.2, 0.3], yfmt: v => v.toFixed(1) + ' mm', xlabel: 'Parts in the stack', t0: 1.0 });
    series(m, [[1, 0.05], [6, 0.30]], { color: C.red, w: 3, p: ep(t, 1.4, 2.2, E.lin) });
    const rss = []; for (let n = 1; n <= 6.01; n += 0.1) rss.push([n, 0.05 * Math.sqrt(n)]); series(m, rss, { color: C.ink, w: 2.5, dash: [6, 5], p: ep(t, 1.8, 2.6, E.lin) });
    text('worst case', m.X(6) - 4, m.Y(0.30) - 12, { role: 'label', color: C.red, align: 'right', alpha: ep(t, 2.2, 2.6) });
    text('typical (RSS)', m.X(6) - 4, m.Y(0.05 * Math.sqrt(6)) + 22, { role: 'label', color: C.ink, align: 'right', alpha: ep(t, 2.6, 3.0) });
    text('Fewer parts, fewer seams to creak. RTINGS heard creaking on a multi-part carbon shell; the one-part Carbon XT1 shell was built to stop it.', rx + 28, wy + 440, { role: 'small', color: C.ink2, t, t0: 4.2, cps: 120, maxW: rw - 56, lh: 1.45 });
    keyPlan(t, 1.0, wx + ww - 80, wy + 170, { s: 0.55, cut: { type: 'cross', y: 12, label: 'D' }, label: 'Section D' });
    gloss(t, 3.6, 'Load path', 'The route a force takes to where the part is held. A rib only helps if both ends land on something stiff.');
    featureCard(t, 5.0, 'Arches and a unibody shell', ['derived', 'proposal'], 'Arches on the bosses (#53), front struts (#55), thicker low walls (#93), side PCB as a rib (#91), fewer parts (#57).');
    captions(t, [[0.6, 'grip a thin shell and the walls bow in. moving material toward the bottom, where the bending is, helps at the same weight.'], [3.6, 'a strut across the shell carries the squeeze straight through. the side-button PCB is already there to be that strut.'], [5.6, 'and every part boundary is a tolerance that stacks. a more unibody shell has fewer of them to add up.']]);
  }
});
S({
  id: 'sealed', ch: 'shell', theme: 'night', title: 'a solid shell keeps the encoder clean', settle: 9, ideas: [15, 58, 26, 98], src: ['pulsarEnc'],
  draw: t => {
    header(t, 'a solid shell keeps the encoder clean');
    const wx = LM, wy = 272, ww = 1728, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const r = rng(11), parts = [];
    for (let i = 0; i < 170; i++) parts.push([r(), r(), 0.6 + r() * 0.8]);
    const S2 = 19, pile = clamp((t - 2.2) / 7);
    const panel = (ox, holes, label, col) => {
      const w = 760, y0 = wy + 220, k = ep(t, 0.6, 1.2), hx = [], ex = ox + 230, ey = y0 + 150;
      if (holes) for (let x = ox + 34; x < ox + w - 40; x += 48) hx.push(x);
      /* the shell wall in section: a hatched strip, with or without holes */
      part(0, 0, 1, () => {
        const xs = [ox].concat(hx.flatMap(h => [h, h + 22])).concat([ox + w]);
        for (let i = 0; i < xs.length; i += 2) { const a = xs[i], b = xs[i + 1]; solid(() => { G.beginPath(); G.rect(a, y0, b - a, 26); }, MT.shell, [a, y0, b - a, 26], { hatch: true }); }
      }, { alpha: k });
      part(ex, ey, S2, () => encoderMM({}), { alpha: k });
      text('encoder', ex, ey + 5.0 * S2 + 52, { role: 'label', color: C.mute, align: 'center', alpha: k });
      const eTop = ey - 3.6 * S2, eL = ex - 3.8 * S2, eR = ex + 3.8 * S2;
      for (const [u, v, sp] of parts) {
        if (t < 1.6) continue;
        const tt = (t - 1.6) * sp * 0.45 + v, ph = tt % 1, cyc2 = Math.floor(tt);
        const x = ox + 20 + ((u * 7.31 + cyc2 * 0.37) % 1) * (w - 40); let y = wy + 70 + ph * 340;
        const overHole = hx.some(h2 => x > h2 + 2 && x < h2 + 20);
        if (y > y0 - 3 && !(holes && overHole)) y = y0 - 3;
        else if (y > y0 + 26) { if (!(x > eL && x < eR) && y > y0 + 70) continue; y = Math.min(y, x > eL && x < eR ? eTop - 3 : y); }
        circle(x, y, 2.2, { fill: y >= y0 + 26 ? C.red : C.ink2, alpha: 0.8 * (y >= y0 + 26 && !(x > eL && x < eR) ? 1 - clamp((y - y0 - 26) / 44) : 1) });
      }
      /* what builds up: inside the encoder with cutouts, on the outside without */
      const rp = rng(holes ? 5 : 9), n = Math.floor(pile * 46);
      for (let i = 0; i < n; i++) { const u = rp(), v2 = rp(); const px = holes ? lerp(eL + 10, eR - 10, u) : lerp(ox + 240, ox + 520, u), py = (holes ? eTop : y0) - 3 - v2 * 7 * Math.sin(u * Math.PI); circle(px, py, 2.6, { fill: holes ? C.red : C.ink2, alpha: k * 0.9 }); }
      if (!holes && pile > 0.4) text('on the outside: wipe it off', ox + 380, y0 - 26, { role: 'label', color: A, align: 'center', alpha: ep(t, 4.6, 5.0) });
      /* the scroll signal the encoder sends: clean pulses, or skips as dirt builds up */
      const sx = ox + 400, sy = y0 + 92, sw2 = 330, sh2 = 44, kk = ep(t, 1.4, 1.8);
      text('scroll signal', sx, sy - 14, { role: 'label', color: C.mute, alpha: kk });
      rr(sx, sy, sw2, sh2 + 14, 6, inkA(0.04), inkA(0.14), 1, kk);
      const off = (t * 70) % 22, pts = []; let skips = 0;
      for (let j = -1; j < sw2 / 22 + 1; j++) {
        const x0 = sx + 8 + j * 22 - off, id = Math.floor((t * 70) / 22) + j, h = Math.abs(Math.sin(id * 12.9898) * 43758.5453) % 1, bad = holes && h < pile * 0.42;
        if (bad) skips++;
        const hi = sy + 10, lo = sy + sh2 + 2;
        pts.push([x0, lo], [x0, bad ? lo : hi], [x0 + 11, bad ? lo : hi], [x0 + 11, lo]);
        if (bad) { G.save(); G.beginPath(); G.rect(sx + 2, sy, sw2 - 4, sh2 + 14); G.clip(); rect(x0 - 2, sy + 4, 15, sh2 + 4, { fill: rgba(C.red, 0.16), alpha: kk }); G.restore(); }
      }
      G.save(); G.beginPath(); G.rect(sx + 2, sy, sw2 - 4, sh2 + 14); G.clip(); poly(pts, { color: holes ? C.red : A, w: 2, alpha: kk }); G.restore();
      text(holes ? (pile > 0.15 ? 'Missed steps' : 'Clean, for now') : 'Clean', sx + sw2, sy + sh2 + 40, { role: 'label', color: holes && pile > 0.15 ? C.red : A, align: 'right', alpha: kk });
      text(label, ox, wy + 52, { role: 'label', color: col, t, t0: 1.0, cps: 60 });
    };
    panel(wx + 60, true, 'cutouts: dust and liquid reach the encoder', C.red);
    panel(wx + 900, false, 'solid: they stay on the outside, where you can wipe them', A);
    text('An illustration. Pulsar\'s support page blames jittery scrolling on dust, dirt or fluids in the encoder.', wx + 28, wy + wh - 22, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 2.4, 2.8), maxW: ww - 56 });
    keyPlan(t, 1.0, wx + ww - 80, wy + 150, { s: 0.5, hi: 'wheel', label: 'Encoder' });
    gloss(t, 3.0, 'Encoder', 'The part that reads the wheel turning. It\'s open, so dirt inside shows up as skipped scrolling.');
    featureCard(t, 4.4, 'A fully solid shell', ['claim', 'proposal'], 'Easier to mold (#15), no cutout by the wheel (#58), a thin bottom sticker (#26), a coated PCB (#98).');
    captions(t, [[0.6, 'cutouts save weight, but every one is an open path to the most common failure point in a mouse.'], [3.6, 'a solid shell also molds more easily: no small isolated areas for the plastic to fill.'], [6.0, 'sweat shows on a solid surface a little more, and a good coating handles that. the gunk that builds up in holes doesn\'t wipe off.']]);
  }
});
S({
  id: 'mass', ch: 'shell', theme: 'paper', title: 'keep the mass low, near the fingers', settle: 9, ideas: [95, 31], src: ['xt1'],
  draw: t => {
    header(t, 'keep the mass low, near the fingers');
    const wx = LM, wy = 272, ww = 860, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('the mouse as a rigid block, in a flick', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    const s = 8, gx = wx + 400, gy = wy + 420, hf = 11, low = ep(t, 5.0, 6.2, E.io3), hc = lerp(16, 11.5, low);
    const fl = Math.sin(Math.max(0, t - 2) * 2.2) * ep(t, 2, 2.5), M = 0.035 * 30 * (hc - hf);
    const tilt = -fl * M * 0.012;
    /* the pad */
    part(0, 0, 1, () => solid(() => { G.beginPath(); G.rect(wx + 30, gy, ww - 60, 18); }, MT.cloth, [wx + 30, gy, ww - 60, 18], {}), { alpha: ep(t, 0.4, 0.8) });
    part(gx, gy, s, () => {
      xabout(fl >= 0 ? 30 : -30, 0, tilt);
      solid(() => pathRR(-30, -34, 60, 34, 7), { g: ['#3b3c42', '#2a2b30'], dark: 1 }, [-30, -34, 60, 34], { lw: 1.3 });
      /* the heavy parts, dashed: battery and board, sliding down as the design improves */
      const by = lerp(-21, -9, low);
      G.setLineDash([lw(6), lw(4)]); G.strokeStyle = 'rgba(236,235,231,0.55)'; G.lineWidth = lw(1.4);
      pathRR(-14, by - 4, 20, 8, 1); G.stroke(); pathRR(-24, -6.5, 48, 2.2, 0.6); G.stroke(); G.setLineDash([]);
      G.save(); G.translate(-4, by + 1.3); G.scale(mmpx(), mmpx()); setFont({ role: 'label' }); G.fillStyle = 'rgba(236,235,231,0.7)'; G.textAlign = 'center'; G.fillText('battery', 0, 0); G.restore();
    }, { alpha: ep(t, 0.4, 0.9) });
    const pc = [gx - 4 * s, gy - hc * s], pg = [gx + 30 * s, gy - hf * s];
    arrow(pg[0] + 110, pg[1], pg[0] + 6, pg[1], { color: C.ink, w: 3.5, hs: 14, alpha: ep(t, 1.4, 1.8) });
    text('Fingers push here', wx + ww - 28, pg[1] - 44, { role: 'label', size: 20, color: C.ink, align: 'right', alpha: ep(t, 1.6, 2.0) });
    circle(pc[0], pc[1], 11, { fill: A, alpha: ep(t, 1.0, 1.4) }); circle(pc[0], pc[1], 11, { color: C.ink, w: 2, alpha: ep(t, 1.0, 1.4) });
    text('Centre of mass', pc[0] - 22, pc[1] - 18, { role: 'label', size: 20, color: A, align: 'right', alpha: ep(t, 1.2, 1.6) });
    line(wx + 40, pg[1], gx + 34 * s, pg[1], { color: C.faint, w: 1.2, dash: [4, 4], alpha: ep(t, 1.4, 1.8) });
    dim(t, 2.0, [wx + 64, gy], [wx + 64, gy - hf * s], hf + ' mm', -22);
    text('Rocking exaggerated. No reviewer publishes a centre of mass: I\'ll measure it.', wx + 28, wy + wh - 22, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 2.4, 2.8), maxW: ww - 56 });
    const rx = 1000, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('tipping moment in a fast flick', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['derived'], ep(t, 1.0, 1.4));
    text('M = m · a · (h − h_fingers); m = 35 g, a = 30 m/s²', rx + 28, wy + 112, { role: 'small', size: 22, color: C.mute, alpha: ep(t, 1.2, 1.6), maxW: rw - 56 });
    const m = axes(t, { x: rx + 100, y: wy + 160, w: rw - 160, h: 280, xr: [11, 18], yr: [0, 8], xticks: [11, 12, 13, 14, 15, 16, 17, 18], yticks: [0, 2, 4, 6, 8], xfmt: v => v + ' mm', yfmt: v => v + ' mN·m', xlabel: 'height of the centre of mass', t0: 1.0 });
    const Mh = h => 0.035 * 30 * (h - 11);
    series(m, [[11, 0], [18, Mh(18)]], { color: C.red, w: 3, p: ep(t, 1.6, 2.6, E.lin) });
    circle(m.X(hc), m.Y(Mh(hc)), 8, { fill: A }); text(`${Mh(hc).toFixed(1)} mN·m`, m.X(hc) + 16, m.Y(Mh(hc)) - 12, { role: 'num', size: 24, color: A });
    keyPlan(t, 1.0, wx + ww - 80, wy + 140, { s: 0.55, hi: 'battery', label: 'Battery' });
    gloss(t, 3.0, 'Tipping moment', 'The twist when you push at one height and the mass resists at another: the front lifts in a flick.');
    featureCard(t, 4.0, 'Mass low, near the fingers', ['derived', 'proposal'], 'Heavy parts low and close to the grip (#95). A modular bottom plate, as on the Carbon XT1 (#31).');
    captions(t, [[0.6, 'the fingers push the mouse low on its sides, and its mass pushes back at its centre of mass.'], [3.6, 'when those two heights differ, every flick puts a twist on the mouse that the hand has to hold down.'], [5.8, 'bring the mass down to the fingers and that twist goes toward zero, so the mouse feels easier to move.']]);
  }
});

/* ---------- fix the grind instead of greasing it (#96, #97, the doc's closing note) ---------- */
function rimMM(o = {}) {
  const pad = o.pad || 0, buzz = o.buzz || 0, A = o.accent || acc(), out = {};
  const jit = Math.sin(o.t * 90) * 0.06 * buzz;
  /* top shell wall coming down, with a groove the rim slides into */
  solid(() => { G.beginPath(); G.moveTo(-1.4, -9); G.lineTo(1.4, -9); G.lineTo(1.4, -1.0); G.lineTo(4.2, -1.0); G.lineTo(4.2, 1.2); G.lineTo(-1.4, 1.2); G.closePath(); }, MT.shell, [-1.4, -9, 5.6, 10.2], { hatch: true });
  /* the bottom rim, a separate part, slid in from the side */
  xsave(); xmove(jit, 0);
  solid(() => { G.beginPath(); G.moveTo(1.9, -0.6 + (pad ? 0.35 : 0)); G.lineTo(9, -0.6 + (pad ? 0.35 : 0)); G.lineTo(9, 2.6); G.lineTo(-1.4, 2.6); G.lineTo(-1.4, 1.5); G.lineTo(1.9, 1.5); G.closePath(); }, MT.black, [-1.4, -0.6, 10.4, 3.2], { hatch: { dir: -1 } });
  xrest();
  if (pad > 0) { xsave(); ga(pad); solid(() => { G.beginPath(); G.rect(1.9, -1.0, 2.3, 0.35); }, MT.foam, [1.9, -1.0, 2.3, 0.35], { lw: 0.8 }); const r = rng(3); G.strokeStyle = 'rgba(255,255,255,0.25)'; G.lineWidth = lw(0.8); for (let i = 0; i < 14; i++) { G.beginPath(); G.arc(2.0 + r() * 2.1, -0.82 + r() * 0.15, 0.05, 0, TAU); G.stroke(); } xrest(); }
  if (buzz > 0) { xsave(); ga(buzz); for (let k = 0; k < 3; k++) { const ph = (o.t * 2.4 + k / 3) % 1; G.beginPath(); G.arc(3.0, -0.8, 0.6 + ph * 2.6, -Math.PI * 0.95, -Math.PI * 0.05); G.strokeStyle = rgba(C.red, (1 - ph) * 0.8); G.lineWidth = lw(2); G.stroke(); } xrest(); }
  out.contact = SP(3.0, -0.8); out.rim = SP(7, 1.2); out.shell = SP(0, -6);
  return out;
}
S({
  id: 'grind', ch: 'shell', theme: 'night', title: 'fix the grind instead of greasing it', settle: 9, ideas: [97, 96], src: ['poron4701', 'plabase20'],
  draw: t => {
    header(t, 'fix the grind instead of greasing it');
    const wx = LM, wy = 272, ww = 1728, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    /* three fixes for the same joint: each gets the same squeeze, and a trace of the noise it makes */
    const cases = [[wx + 300, 'plastic on plastic', 'The rim rubs the shell and squeaks', 1, 0, C.red, 'stick'], [wx + 870, 'Krytox 205, in the groove', 'Quiet until it wears or collects dust', 0.25, 0, C.ink2, 'wear'], [wx + 1440, 'a thin Poron pad at the contact', 'A soft stop: nothing rubs, about 0.5 g', 0, 1, A, 'none']];
    const per = 2.6, sq = u => { const c = ((u % per) + per) % per / per; return c < 0.14 ? E.io3(c / 0.14) : c < 0.5 ? 1 : c < 0.64 ? 1 - E.io3((c - 0.5) / 0.14) : 0; };
    cases.forEach(([cx, l1, l2, buzz, pad, col, mode], i) => {
      const t0 = 0.6 + i * 0.5, k = ep(t, t0, t0 + 0.5), load = t > t0 + 1.0 ? sq(t - t0 - 1.0) : 0;
      const wearUp = mode === 'wear' ? 0.25 + 0.75 * clamp(((t - t0 - 1.0) % 10.4) / 10.4) : 1;
      const b2 = buzz * wearUp * load, s = 28, ox = cx - 150, oy = wy + 330;
      text(l1, cx, wy + 52, { role: 'label', color: col, align: 'center', t, t0, cps: 60 });
      const o = part(ox, oy - load * 0.12 * s, s, () => rimMM({ t, buzz: b2, pad: pad * (1 - 0.35 * load), accent: A }), { alpha: k });
      /* the squeeze: a hand pressing on the rim */
      const ax = ox + 6.6 * s, ay = oy - 0.6 * s - 8;
      arrow(ax, ay - 74 - 10 * load, ax, ay - 10 * load, { color: C.ink2, w: 3, hs: 12, alpha: k * (0.35 + 0.65 * load) });
      text('your grip', ax + 12, ay - 66, { role: 'label', color: C.mute, alpha: k });
      /* the noise, as a scope trace */
      const mx = cx - 160, my = wy + 416, mw = 320, mh = 52;
      rr(mx, my, mw, mh, 6, inkA(0.04), inkA(0.14), 1, k);
      text('noise', mx - 10, my + mh / 2 + 5, { role: 'label', color: C.faint, align: 'right', alpha: k });
      const pts = [];
      for (let j = 0; j <= 160; j++) {
        const u = t - t0 - 1.0 - (160 - j) * 0.012, L = u > 0 ? sq(u) : 0, amp = mode === 'stick' ? L : mode === 'wear' ? L * (0.25 + 0.75 * clamp(((u % 10.4) + 10.4) % 10.4 / 10.4)) * 0.8 : 0;
        const saw = ((u * 23) % 1) - 0.5, v = amp * (saw * 0.9 + 0.25 * Math.sin(u * 151)) + (mode === 'none' ? 0.03 * Math.sin(u * 40) : 0);
        pts.push([mx + 8 + (mw - 16) * j / 160, my + mh / 2 - v * (mh * 0.8)]);
      }
      poly(pts, { color: mode === 'none' ? A : col === C.ink2 ? C.orange : col, w: 1.8, alpha: k });
      if (mode === 'wear') text('louder as it wears', mx + mw, my - 8, { role: 'label', color: C.orange, align: 'right', alpha: k * ep(t, t0 + 3, t0 + 3.4) });
      text(l2, cx, wy + 500, { role: 'small', color: C.mute, align: 'center', t, t0: t0 + 0.4, cps: 90, maxW: 440 });
    });
    source(t, 'A modular rim slides into the top shell (#97). Noise traces are an illustration, not a recording.', { t0: 2.4 });
    keyPlan(t, 1.0, wx + ww - 80, wy + 150, { s: 0.55, hi: 'rim', label: 'Bottom rim' });
    gloss(t, 2.6, 'Poron', 'A microcellular urethane foam for gaskets, a third as dense as the shell. A thin layer stops hard parts rubbing.');
    featureCard(t, 3.6, 'A slide-in rim with a pad', ['proposal'], 'The rim slides into the top shell (#97). Grease hides the noise (#96); a foam pad removes it.');
    captions(t, [[0.6, 'a separate bottom rim makes the mouse easier to service, and every place two hard parts touch can grind.'], [3.0, 'grease quiets it for a while. it doesn\'t change the contact, so the noise comes back.'], [5.2, 'a thin foam pad at the contact point stops the parts rubbing at all, for about half a gram.']]);
  }
});

/* ============================== surface and details ============================== */
S({
  id: 'surfacecard', ch: 'surface', card: true, theme: 'night', title: 'surface and details', settle: 5,
  draw: t => {
    chapterCard(t, { name: 'surface', gloss: 'what your hand touches, and the small details that make a mouse look finished.', list: [['#16', 'a baked ceramic coating'], ['#60', 'a laser-etched grip texture'], ['#12', 'satin clear over carbon'], ['#34', 'shallower engravings'], ['#32', 'engravings off the trigger centres'], ['#82', 'no visible gate marks'], ['#7', 'a POM scroll wheel axle']] });
    part(1190, 500, 10, () => coatMM({ etch: ep(t, 2.4, 3.4), film: ep(t, 1.2, 2.2, E.io3) }), { alpha: ep(t, 1.0, 1.6) });
    if (t > 3.4) { const ph3 = ((t - 3.4) % 4.5) / 4.5, gx = lerp(1100, 1880, ph3), g3 = G.createLinearGradient(gx - 70, 524, gx + 70, 752); g3.addColorStop(0, 'rgba(255,255,255,0)'); g3.addColorStop(0.5, 'rgba(255,255,255,0.09)'); g3.addColorStop(1, 'rgba(255,255,255,0)'); G.save(); G.beginPath(); G.rect(1192, 524, 598, 228); G.clip(); G.globalCompositeOperation = 'lighter'; G.fillStyle = g3; G.fillRect(1192, 524, 598, 228); G.restore(); }
    figLabel(t, 2.2, 1190, 800, 8, 'ceramic film on carbon-filled plastic, magnified');
  }
});
const GRADES = ['7B', '6B', '5B', '4B', '3B', '2B', 'B', 'HB', 'F', 'H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H'];
S({
  id: 'coating', ch: 'surface', theme: 'paper', title: 'bake the coating', settle: 9, ideas: [16, 12], src: ['cerakoteH', 'cerakoteC', 'cerakoteGuide', 'cerakoteCure', 'radtech'],
  draw: t => {
    header(t, 'bake the coating');
    const wx = LM, wy = 272, ww = 860, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    figLabel(t, 0.6, wx + 28, wy + 44, 8, 'the shell surface, magnified (layers not to scale)');
    const s = 11.5, ox = wx + 85, oy = wy + 150;
    const o = part(ox, oy, s, () => coatMM({ film: ep(t, 0.8, 2.2, E.io3) }), { alpha: ep(t, 0.4, 0.9) });
    /* the pencil test: a lead at 45 degrees dragged across the film */
    const cp = t >= 8.6 ? (t - 8.6) % 7 : -1;
    const pk = cp >= 0 ? ep(cp, 0, 0.4) * (1 - ep(cp, 3.4, 3.8)) : ep(t, 4.0, 4.4) * (1 - ep(t, 7.4, 7.8)), px = cp >= 0 ? lerp(16, 46, ep(cp, 0.4, 2.8, E.io3)) : lerp(16, 46, ep(t, 4.4, 6.8, E.io3));
    G.save(); rrPath(wx, wy, ww, wh, 14); G.clip();
    if (pk > 0) part(ox, oy, s, () => { solid(() => { G.beginPath(); G.moveTo(px - 3, 2.2); G.lineTo(px + 3, 2.2); G.lineTo(px + 21, -15.8); G.lineTo(px + 15, -15.8); G.closePath(); }, { g: ['#4a4b50', '#2a2b2f'], dark: 1 }, [px - 3, -16, 24, 18], { lw: 1 }); G.fillStyle = 'rgba(255,255,255,0.12)'; G.beginPath(); G.moveTo(px - 1.4, 2.2); G.lineTo(px, 2.2); G.lineTo(px + 18, -15.8); G.lineTo(px + 16.6, -15.8); G.closePath(); G.fill(); }, { alpha: pk });
    G.restore();
    if (pk > 0) text('8H at 45°: no mark', Math.max(wx + 300, ox + (px - 4) * s), oy + 0.6 * s, { role: 'label', size: 20, color: A, alpha: pk, align: 'right' });
    callout(t, 1.6, o.film, 'ceramic-filled resin, 23 to 30 µm', { to: [wx + ww - 40, wy + 300], side: 'l', color: A, role: 'small', maxW: 170 });
    callout(t, 2.0, o.iface, 'a blasted surface for the bond', { to: [wx + 490, wy + 470], side: 'r', color: C.ink2, tcolor: C.ink2, role: 'small', maxW: 300 });
    callout(t, 2.3, o.sub, 'carbon-filled polypropylene', { to: [wx + 330, wy + 470], side: 'l', color: C.ink2, tcolor: C.ink2, role: 'small', maxW: 240 });
    text('About 0.35 g per 100 cm²: 0.3 to 0.7 g for a shell (derived).', wx + 28, wy + wh - 24, { role: 'small', size: 22, color: C.mute, t, t0: 2.8, cps: 110, maxW: ww - 220 });
    /* pencil hardness ladder */
    const rx = 990, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('pencil hardness, ASTM D3363', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['datasheet'], ep(t, 1.0, 1.4));
    const gx0 = rx + 250, gw = rw - 290, GX = i => gx0 + gw * i / 17, a0 = ep(t, 1.0, 1.5);
    GRADES.forEach((g, i) => { line(GX(i), wy + 120, GX(i), wy + 380, { color: C.hair, w: 1, alpha: a0 }); if (i % 2 === 0 || i === 17) text(g, GX(i), wy + 404, { role: 'label', color: C.mute, align: 'center', alpha: a0 }); });
    const rows = [['soft-touch rubber', 0, 4, C.red, '7B to 3B'], ['air-cured ceramic', 0, 11, C.gray, '3H'], ['oven-cured ceramic', 0, 16, C.ink, '8H'], ['top grade, oven-cured', 0, 17, A, '9H']];
    rows.forEach(([l, a, b, col, lab], i) => { const y = wy + 150 + i * 62, k = ep(t, 1.4 + i * 0.25, 2.2 + i * 0.25, E.snap); text(l, rx + 28, y + 6, { role: 'label', color: C.ink2, alpha: ep(t, 1.2 + i * 0.25, 1.6 + i * 0.25), maxW: 210 }); rect(GX(a), y - 9, (GX(b) - GX(a)) * k, 18, { fill: col }); glint(GX(a), y - 9, (GX(b) - GX(a)) * k, 18, t, 5 + i * 0.25, 8); text(lab, GX(b) + 10, y + 6, { role: 'label', color: col, alpha: k }); });
    text('soft-touch wore through in 31 to 300+ abrasion cycles, depending on the formulation (RadTech 2016).', rx + 28, wy + 450, { role: 'small', color: C.ink2, t, t0: 3.2, cps: 110, maxW: rw - 56, lh: 1.45 });
    text('same coating family: baked tests five grades harder than air-dried.', rx + 28, wy + 516, { role: 'label', color: A, t, t0: 4.2, cps: 80, maxW: rw - 56 });
    keyPlan(t, 1.0, wx + ww - 80, wy + 380, { s: 0.5, hi: 'shell', label: 'Whole shell' });
    gloss(t, 2.4, 'pencil hardness', 'graded pencils pushed across the film at 45 degrees. the hardest one that leaves no mark is the rating. 9H is the top of the scale.');
    featureCard(t, 5.0, 'a baked ceramic coating', ['datasheet', 'proposal'], 'oven-cured, not air-dried (#16). satin clear over the carbon-filled plastic: black, with the carbon showing in light (#12).');
    captions(t, [[0.6, 'a mouse coating takes sweat, skin oil and thousands of hours of hand contact. soft-touch rubber is the usual finish, and it wears through.'], [3.6, 'a ceramic-filled coating that is baked crosslinks harder. the air-dried version of the same family tests five pencil grades softer.'], [6.6, 'those figures were measured on blasted steel, and plastics cure cooler, so 8H on the shell itself is what we test for.']]);
  }
});
S({
  id: 'grip', ch: 'surface', theme: 'night', title: 'the same grip, dry or sweaty', settle: 9, ideas: [60, 'sides'], src: ['derler'],
  draw: t => {
    header(t, 'the same grip, dry or sweaty');
    const wx = LM, wy = 272, ww = 1000, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    /* after the first pass the hands keep warming and drying, and the chart follows the two fingertips live */
    const live = ep(t, 9.0, 9.6), wet = t < 9 ? ep(t, 2.2, 3.2) : 0.5 + 0.5 * Math.cos((t - 9) * TAU / 8), s = 7.2;
    const L = part(wx + 40, wy + 150, s, () => gripMM({ etch: 0, wet, accent: A }), { alpha: ep(t, 0.4, 0.9) });
    const R = part(wx + 530, wy + 150, s, () => gripMM({ etch: 1, wet, accent: A }), { alpha: ep(t, 0.6, 1.1) });
    text('smooth film', wx + 40, wy + 64, { role: 'label', color: C.ink, t, t0: 0.6, cps: 70 });
    text('laser-etched film', wx + 530, wy + 64, { role: 'label', color: A, t, t0: 0.8, cps: 70 });
    text(wet > 0.5 ? 'Sweat makes a film' : 'Dry: ridges on the film', wx + 40, wy + 238, { role: 'label', size: 20, color: wet > 0.5 ? C.red : C.mute, alpha: ep(t, 1.2, 1.6) });
    text(wet > 0.5 ? 'Sweat drains into the pits' : 'Dry: ridges on the peaks', wx + 530, wy + 238, { role: 'label', size: 20, color: wet > 0.5 ? A : C.mute, alpha: ep(t, 1.2, 1.6) });
    /* measured friction of skin: smooth vs rough, dry vs wet */
    rule(wx + 28, wy + 272, wx + ww - 28, ep(t, 3.2, 3.6));
    text('Fingertip friction, dry and wet', wx + 28, wy + 312, { role: 'label', color: C.ink, t, t0: 3.4, cps: 80 });
    pill(wx + ww - 24 - pillW('study'), wy + 314, 'study', ep(t, 3.6, 4.0));
    const bx0 = wx + 230, bw = ww - 330, BX = v => bx0 + bw * v / 2.4;
    [['smooth, dry', 2.18, C.gray], ['smooth, wet', 0.61, C.red], ['rough, dry', 0.53, C.gray], ['rough, wet', 1.43, A]].forEach(([l, v, col], i) => {
      const y = wy + 346 + i * 40 + (i > 1 ? 14 : 0), k = ep(t, 3.8 + i * 0.2, 4.4 + i * 0.2, E.snap);
      text(l, wx + 28, y + 6, { role: 'label', color: C.ink2, alpha: ep(t, 3.6 + i * 0.2, 4.0 + i * 0.2) });
      rect(bx0, y - 9, (BX(v) - bx0) * k, 18, { fill: col }); glint(bx0, y - 9, (BX(v) - bx0) * k, 18, t, 6 + i * 0.25, 8); text('μ ' + v.toFixed(2), BX(v) + 10, y + 6, { role: 'label', color: col, alpha: k });
    });
    text('Derler & Gerhardt 2012 review: glass, smooth vs rough', wx + ww - 28, wy + wh - 18, { role: 'small', color: C.faint, align: 'right', alpha: ep(t, 4.4, 4.8) });
    /* pinch force to lift */
    const cx = 1130, cw = W - LM - cx;
    demoWindow(cx, wy, cw, wh, ep(t, 0.5, 0.9));
    text('squeeze needed to lift a 35 g mouse', cx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(cx, wy, cw, ['derived'], ep(t, 1.0, 1.4));
    text('per finger, two fingers: N = m g / 2μ', cx + 150, wy + 76, { role: 'small', color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const m = axes(t, { x: cx + 96, y: wy + 120, w: cw - 140, h: 290, xr: [0.25, 2.25], yr: [0, 0.7], xticks: [0.5, 1, 1.5, 2], yticks: [0, 0.2, 0.4, 0.6], xfmt: v => 'μ ' + v, yfmt: v => v.toFixed(1) + ' N', xlabel: 'friction coefficient', t0: 1.0 });
    const pts = []; for (let u = 0.25; u <= 2.25; u += 0.02) pts.push([u, 0.035 * 9.81 / (2 * u)]);
    series(m, pts, { color: A, w: 3, p: ep(t, 1.4, 2.6, E.lin) });
    [[0.61, C.red, 'smooth, wet'], [1.43, A, 'rough, wet']].forEach(([u, col, l], i) => { const k = ep(t, 4.6 + i * 0.3, 5.0 + i * 0.3) * (1 - 0.65 * live), v = 0.035 * 9.81 / (2 * u); circle(m.X(u), m.Y(v), 7, { fill: col, alpha: k }); text(`${l}: ${v.toFixed(2)} N`, m.X(u) + (i ? -12 : 12), m.Y(v) - 14, { role: 'label', size: 20, color: col, align: i ? 'right' : 'left', alpha: k }); });
    if (live > 0) [[lerp(2.18, 0.61, wet), C.red, 'smooth'], [lerp(0.53, 1.43, wet), A, 'etched']].forEach(([u, col, l], i) => {
      const v = 0.035 * 9.81 / (2 * u), X = m.X(u), Y = m.Y(v);
      line(X, Y, X, m.Y(0), { color: col, w: 1.2, dash: [3, 4], alpha: live * 0.6 }); circle(X, Y, 13, { color: col, w: 1.5, alpha: live * 0.35 }); circle(X, Y, 6.5, { fill: col, alpha: live });
      text(`${l} now: ${v.toFixed(2)} N`, cx + cw - 40, wy + 150 + i * 24, { role: 'label', color: col, align: 'right', alpha: live });
    });
    if (live > 0) text(wet > 0.5 ? 'hands warm: wet' : 'hands cool: dry', cx + cw - 40, wy + 206, { role: 'label', color: C.mute, align: 'right', alpha: live });
    text('The sides do the lifting, so the texture goes there first.', cx + 28, wy + 516, { role: 'small', size: 23, weight: 700, color: C.ink, t, t0: 5.4, cps: 70, maxW: cw - 56, lh: 1.3 });
    keyPlan(t, 1.0, wx + ww - 80, wy + 130, { s: 0.45, hi: 'sides', label: 'Sides first' });
    gloss(t, 2.8, 'friction coefficient', 'the sideways force a surface can hold before it slips, divided by how hard you press into it. higher means you squeeze less.');
    featureCard(t, 6.0, 'a laser-etched texture', ['study', 'proposal'], 'etched into the coating (#60), grippier on the sides than on the hump.');
    captions(t, [[0.6, 'on a smooth surface, sweat spreads into a film and the fingertip floats on it. that is when a glossy mouse goes slippery.'], [3.6, 'a texture gives the moisture somewhere to go. in the lab, rough glass was less grippy dry but more than twice as grippy wet.'], [6.4, 'so the point of etching isn\'t maximum grip. it\'s grip that stays closer to the same as your hands warm up.']]);
  }
});
S({
  id: 'details', ch: 'surface', theme: 'paper', title: 'engrave shallow, away from the bend', settle: 9, ideas: [34, 32, 82, 33, 61, 62], src: ['inglis', 'vernier', 'curiosity', 'fracMech'],
  draw: t => {
    header(t, 'engrave shallow, away from the bend');
    const wx = LM, wy = 272, ww = 900, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    figLabel(t, 0.6, wx + 28, wy + 44, 9, 'an engraving in a 1.6 mm wall, under load');
    /* after the first pass the depth keeps sweeping between the two, with the stress readout following */
    const a = t < 9 ? lerp(0.6, 0.3, ep(t, 3.4, 4.6, E.io3)) : lerp(0.3, 0.6, 0.5 - 0.5 * Math.cos((t - 9) * TAU / 8)), rho = 0.15;
    const o = part(wx + 54, wy + 96, 44, () => notchMM({ depth: a, rho, accent: A }), { alpha: ep(t, 0.4, 0.9) });
    for (const dx of [0, 1]) { const x = dx ? wx + 54 + 18 * 44 + 6 : wx + 48; arrow(x + (dx ? 0 : -6), wy + 96 + 35, x + (dx ? 46 : -46), wy + 96 + 35, { color: C.ink, w: 3, hs: 10, alpha: ep(t, 1.0, 1.4) }); }
    const kt = 1 + 2 * Math.sqrt(a / rho);
    text(`depth ${a.toFixed(2)} mm, tip radius ${rho} mm`, wx + 54, wy + 214, { role: 'label', color: C.mute, alpha: ep(t, 1.2, 1.6) });
    text(`Kt = 1 + 2√(a/ρ) = ${kt.toFixed(2)}`, wx + ww - 40, wy + 214, { role: 'h3', size: 30, color: kt > 4.5 ? C.red : A, align: 'right', alpha: ep(t, 1.4, 1.8) });
    const m = axes(t, { x: wx + 110, y: wy + 262, w: ww - 170, h: 190, xr: [0, 0.8], yr: [1, 6], xticks: [0, 0.2, 0.4, 0.6, 0.8], yticks: [1, 2, 3, 4, 5, 6], xfmt: v => v.toFixed(1) + ' mm', yfmt: v => v + '×', xlabel: 'engraving depth, tip radius 0.15 mm', t0: 1.6 });
    const pts = []; for (let d = 0; d <= 0.8; d += 0.01) pts.push([d, 1 + 2 * Math.sqrt(d / rho)]);
    series(m, pts, { color: A, w: 3, p: ep(t, 2.0, 3.0, E.lin) });
    circle(m.X(a), m.Y(kt), 8, { fill: kt > 4.5 ? C.red : A, alpha: ep(t, 3.0, 3.4) });
    text('Half the depth: 23% less peak stress', m.X(0.3) + 14, m.Y(3.83) + 32, { role: 'small', size: 23, weight: 700, color: A, alpha: ep(t, 4.6, 5.0) });
    /* what the eye catches */
    const rx = 1030, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('what the eye catches at 50 cm', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['study'], ep(t, 1.0, 1.4));
    text('drawn 400× life size', rx + rw - 28, wy + 76, { role: 'small', color: C.faint, align: 'right', alpha: ep(t, 1.2, 1.6) });
    const ex0 = rx + 60, ex1 = rx + rw - 60, ey = wy + 170, k1 = ep(t, 1.6, 2.2), step = 0.012 * 400;
    line(ex0, ey, lerp(ex0, (ex0 + ex1) / 2, k1), ey, { color: C.ink, w: 3 });
    if (k1 >= 1) line((ex0 + ex1) / 2, ey + step, lerp((ex0 + ex1) / 2, ex1, ep(t, 2.2, 2.8)), ey + step, { color: C.ink, w: 3 });
    text('a break in an edge, 0.012 mm: seen', rx + 60, ey + 44, { role: 'label', color: A, alpha: ep(t, 2.6, 3.0) });
    text('vernier acuity: 2 to 5 arcseconds', rx + 60, ey + 68, { role: 'small', color: C.mute, alpha: ep(t, 2.8, 3.2) });
    const d = 0.145 * 400, dk = ep(t, 3.4, 3.9, E.snap);
    circle(rx + 60 + d / 2, wy + 330, d / 2 * dk, { fill: C.ink });
    text('Smallest dot you can see: 0.145 mm', rx + 90 + d, wy + 318, { role: 'small', size: 23, weight: 700, color: C.ink, alpha: dk, maxW: rw - 150 - d });
    text('Acuity: about 60 arcseconds', rx + 90 + d, wy + 352, { role: 'small', size: 21, color: C.mute, alpha: dk });
    text('a gate mark breaks an edge, so it shows at a twelfth of the size detail needs. gates go where no edge runs (#82).', rx + 28, wy + 470, { role: 'label', color: C.ink, t, t0: 4.6, cps: 80, maxW: rw - 56, lh: 1.45 });
    keyPlan(t, 1.0, wx + ww - 70, wy + 118, { s: 0.36, hi: ['trigL', 'trigR'], detail: { x: -13, y: -36, r: 9 }, label: 'Not here' });
    gloss(t, 2.6, 'stress concentration', 'load crowds around the tip of a notch. a sharp, deep notch multiplies the local stress several times over, and that is where cracks start.');
    featureCard(t, 5.4, 'Shallow, off-centre, lasered', ['derived', 'study', 'proposal'], 'Shallower engravings (#34) off the trigger centres (#32), on the sides (#33), lasered per colorway (#61, #62).');
    captions(t, [[0.6, 'an engraving is a notch, and a notch multiplies stress at its tip. Curiosity\'s wheels cracked at exactly those tips.'], [3.4, 'halving the depth at the same tip radius takes the peak from 5 times the average stress to 3.8.'], [5.8, 'and the eye is far more sensitive to a broken edge than to small detail, so gate marks go where no edge runs. making them small doesn\'t hide them.']]);
  }
});
S({
  id: 'wheel', ch: 'surface', theme: 'night', title: 'a wheel that turns the same in a year', settle: 9, ideas: [7, 67, 'six spokes'], src: ['delrin150', 'delrinAF'],
  draw: t => {
    header(t, 'a wheel that turns the same in a year');
    const wx = LM, wy = 272, ww = 980, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    figLabel(t, 0.6, wx + 28, wy + 44, 10, 'the wheel from the front, cut through the axle');
    const rot = t * 0.6;
    const f = part(wx + 300, wy + 300, 14, () => wheelFrontMM({ rot }), { alpha: ep(t, 0.4, 0.9) });
    const sd = part(wx + 770, wy + 270, 9.6, () => wheelSideMM({ rot: rot * 0.5, hiBush: ep(t, 2.6, 3.0) > 0.5 }), { alpha: ep(t, 0.8, 1.3) });
    callout(t, 1.2, f.bush, 'POM bushing', { to: [wx + 560, wy + 120], side: 'r', color: A, role: 'small', sub: 'runs dry, doesn\'t stick (#7)', maxW: 200 });
    callout(t, 1.5, f.encoder, 'Encoder', { to: [wx + 160, wy + 120], side: 'l', color: C.ink2, tcolor: C.ink2 });
    callout(t, 1.8, f.bracket, 'Aligner, held tighter (#67)', { to: [wx + 540, wy + 500], side: 'r', color: A, maxW: 300, prose: true });
    callout(t, 2.2, sd.spoke, 'six spokes', { to: [wx + ww - 40, wy + 430], side: 'l', color: A, role: 'small', sub: 'an even load on a thin rim', maxW: 200 });
    /* wobble at the rim from clearance at the axle */
    const cx = 1110, cw = W - LM - cx;
    demoWindow(cx, wy, cw, wh, ep(t, 0.5, 0.9));
    text('side-to-side play at the rim', cx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(cx, wy, cw, ['derived'], ep(t, 1.0, 1.4));
    text('Play = clearance × 2R / bushing length', cx + 28, wy + 86, { role: 'small', size: 22, color: C.mute, alpha: ep(t, 1.2, 1.6), maxW: cw - 56 });
    const m = axes(t, { x: cx + 104, y: wy + 120, w: cw - 140, h: 200, xr: [0, 0.08], yr: [0, 0.5], xticks: [0, 0.02, 0.04, 0.06, 0.08], yticks: [0, 0.1, 0.2, 0.3, 0.4, 0.5], xfmt: v => v.toFixed(2), yfmt: v => v.toFixed(1) + ' mm', xlabel: 'Radial clearance, {mm}', t0: 1.0 });
    series(m, [[0, 0], [0.08, 0.08 * 2 * 10.5 / 3.5]], { color: A, w: 3, p: ep(t, 1.4, 2.2, E.lin) });
    for (const c of [0.02, 0.05]) { const k = ep(t, 2.4 + c * 10, 2.8 + c * 10), v = c * 2 * 10.5 / 3.5; circle(m.X(c), m.Y(v), 6, { fill: A, alpha: k }); text(v.toFixed(2) + ' mm', m.X(c) + 10, m.Y(v) - 10, { role: 'label', color: A, alpha: k }); }
    text('POM on steel: μ 0.20 (Delrin 150). PTFE-filled: 0.19 (AF100), so the filled grade buys nothing.', cx + 28, wy + 430, { role: 'small', size: 23, color: C.ink2, t, t0: 3.4, cps: 110, maxW: cw - 56, lh: 1.32 });
    text('0.25% water uptake in 24 h: no swelling.', cx + 28, wy + 530, { role: 'small', size: 23, weight: 700, color: A, t, t0: 4.4, cps: 90, maxW: cw - 56 });
    keyPlan(t, 1.0, wx + 60, wy + 460, { s: 0.6, hi: 'wheel', label: 'wheel' });
    gloss(t, 2.8, 'radial clearance', 'the gap between the axle and the hole it turns in. any gap lets the wheel tilt, and the rim multiplies the tilt.');
    featureCard(t, 5.0, 'a POM axle, a tighter aligner', ['datasheet', 'derived', 'proposal'], 'POM bushing that runs dry (#7), the aligner redesigned and toleranced tighter (#67), six spokes.');
    captions(t, [[0.6, 'a scroll wheel turns on its axle hundreds of thousands of times. if the bearing surface wears or binds, the wheel starts to feel gritty or loose.'], [3.4, 'POM runs dry on steel and barely takes up water, so it keeps turning the same way.'], [5.6, 'and the play you feel at the rim is the clearance at the axle, multiplied. tighten the aligner and the wobble shrinks with it.']]);
  }
});

/* ============================== electronics ============================== */
S({
  id: 'eleccard', ch: 'elec', card: true, theme: 'night', title: 'electronics', settle: 5,
  draw: t => {
    chapterCard(t, { name: 'electronics', gloss: 'the radio, the power, the receiver and the software, and what each one costs in battery and latency.', list: [['#77', 'one radio chip, nRF54LM20A'], ['#90', '8 kHz wired from the same chip'], ['sync', 'each frame captured just before it\'s sent'], ['#99', 'no RGB LED'], ['pmic', 'a PMIC with a fuel gauge'], ['link', 'a spare copy of every report'], ['#68', 'the antenna forward, clear of carbon'], ['#85', 'a screen on the receiver'], ['#23', 'software in the browser']] });
    const fl = Math.sin(t * 0.8) * 4, kb = ep(t, 1.0, 1.7), bo = part(1470, 610 + fl, 12.5, () => boardMM({}), { alpha: kb });
    if (bo.mcu && bo.antArea && t > 2.2) {
      const A2 = acc(), a2 = ep(t, 2.2, 2.8);
      for (let i = 0; i < 4; i++) { const ph2 = ((t - 2.2) * 0.9 + i / 4) % 1; circle(lerp(bo.mcuR[0], bo.antArea[0], ph2), lerp(bo.mcuR[1], bo.antArea[1], ph2), 3.2, { fill: A2, alpha: a2 * Math.sin(ph2 * Math.PI) }); }
      for (let i = 0; i < 5; i++) { const ph2 = ((t - 2.2) * 0.42 + i / 5) % 1; circle(bo.antArea[0], bo.antArea[1], 24 + ph2 * 300, { color: A2, w: 2, alpha: a2 * (1 - ph2) * 0.55, a0: -2.4, a1: -0.25 }); }
    }
    figLabel(t, 2.0, 1130, 920, 11, 'The radio and MCU');
  }
});
function chipBox(t, t0, x, y, w, h, title, chips, note, col) {
  const k = ep(t, t0, t0 + 0.5);
  rr(x, y, w, h, 12, C.panel, col || inkA(0.3), 1.8, k);
  text(title, x + 18, y + 30, { role: 'label', color: C.ink, alpha: k });
  chips.forEach((c, i) => { const cx = x + 70 + i * 140; part(cx, y + h / 2 + 8, 7, () => chipMM({ w: 6, label: c.l, hi: c.hi }), { alpha: k }); text(c.s, cx, y + h - 14, { role: 'label', size: 19, color: c.hi ? acc() : C.mute, align: 'center', alpha: k }); });
  if (note) text(note, x + w + 16, y + h + 34, { role: 'label', size: 20, color: col || C.mute, alpha: k });
}
S({
  id: 'onechip', ch: 'elec', theme: 'paper', title: '8 kHz from one chip', settle: 9, ideas: [77, 90, 92], src: ['nrf54', 'nrf52', 'nrf54usb', 'tpuUlx9', 'pulsarLink', 'slxPdf'],
  draw: t => {
    header(t, '8 kHz from one chip');
    const wx = LM, wy = 272, ww = 940, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const row = (y, label, mouseChips, rxChips, wired, col, t0) => {
      text(label, wx + 28, y - 18, { role: 'label', color: col, t, t0, cps: 70 });
      chipBox(t, t0 + 0.2, wx + 28, y, 300, 150, 'mouse', mouseChips, wired, col);
      chipBox(t, t0 + 0.4, wx + 520, y, rxChips.length > 1 ? 300 : 200, 150, 'receiver', rxChips, null, col);
      const k = ep(t, t0 + 0.6, t0 + 1.0), ax = wx + 340, bx = wx + 508, ay = y + 75;
      for (let i = 0; i < 3; i++) { const r = 16 + i * 14; circle(ax + 6, ay, r, { color: col === C.red ? C.gray : A, w: 2, alpha: k * (0.8 - i * 0.2), a0: -0.7, a1: 0.7 }); }
      if (k > 0) { for (let i = 0; i < 4; i++) { const ph = ((t * 1.2 + i / 4) % 1); circle(lerp(ax + 40, bx - 10, ph), ay, 4, { fill: col === C.red ? C.gray : A, alpha: k }); } }
      arrow(wx + 520 + (rxChips.length > 1 ? 300 : 200) + 10, ay, wx + ww - 40, ay, { color: C.ink, w: 2.5, hs: 10, alpha: k }); text('PC', wx + ww - 40, ay - 14, { role: 'label', color: C.ink, align: 'right', alpha: k });
    };
    row(wy + 90, 'Most 8 kHz mice: two chips', [{ l: 'nRF52840', s: 'Full speed' }], [{ l: 'radio', s: 'Radio' }, { l: 'USB HS', s: '2nd chip' }], 'Wired 1 kHz', C.red, 0.6);
    row(wy + 350, 'One chip, both ends', [{ l: 'nRF54LM20A', s: 'High speed', hi: true }], [{ l: 'nRF54LM20A', s: 'Same chip', hi: true }], 'Wired 8 kHz', A, 1.8);
    /* the spec table, honest about where it doesn't win */
    const rx = 1070, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('the two chips', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['datasheet'], ep(t, 1.0, 1.4));
    const rows = [['', '{nRF52840}', '{nRF54LM20A}'], ['CPU', '64 MHz M4F', '128 MHz M33'], ['RAM', '256 KB', '512 KB'], ['USB', '12 Mbit/s', 'High speed'], ['RX, 0 dBm', '4.6 mA', '3.3 mA'], ['TX, 0 dBm', '4.8 mA', '5.0 mA'], ['Supply', '1.7 to 5.5 V', '1.7 to 3.6 V']];
    rows.forEach((r, i) => { const y = wy + 130 + i * 46, k = ep(t, 1.4 + i * 0.12, 1.8 + i * 0.12); if (i) rule(rx + 28, y - 30, rx + rw - 28, k); text(r[0], rx + 28, y, { role: 'small', color: C.mute, alpha: k }); text(r[1], rx + 190, y, { role: 'small', weight: i ? 700 : 800, color: C.ink2, alpha: k }); text(r[2], rx + 410, y, { font: i ? 'mono' : 'sans', size: i ? 22 : 25, weight: 700, color: i === 5 ? C.ink2 : i === 6 ? C.red : A, alpha: k }); });
    text('TX is no better; RX, the CPU and USB are. The 3.6 V limit means a PMIC, which the power slide wants anyway.', rx + 28, wy + 482, { role: 'small', size: 23, color: C.ink2, t, t0: 3.4, cps: 110, maxW: rw - 56, lh: 1.3 });
    gloss(t, 2.6, 'USB high speed', 'The USB 2.0 rate that allows 8000 reports a second. Full speed tops out at 1000, hence the second chip.');
    featureCard(t, 4.2, 'one chip for radio and USB', ['datasheet', 'proposal'], 'nRF54LM20A at both ends (#77), 8 kHz wired from the same chip (#90), parts on one side of the board (#92).');
    captions(t, [[0.6, 'most 8 kHz wireless mice pair a full-speed radio chip with a second chip in the receiver to reach 8000 reports a second.'], [3.6, 'a radio chip with high-speed USB built in does both jobs. the SLX already runs one at both ends, and it gives the mouse 8 kHz over the cable too.'], [6.2, 'where it doesn\'t win, the table says so. transmit current is the same.']]);
  }
});
/* ---------- electronics: motion latency, every 8 kHz row on piaknow's chart ---------- */
const PIAKNOW = [['XBAB XA25', 'wired', 0.13], ['Kunai', 'projected', 0.14], ['Endgame Gear OP1 8k V2', 'wired', 0.19], ['Endgame Gear XM2 8k V2', 'wired', 0.19], ['VAXEE NP01-S V3', 'wired', 0.25], ['Razer DeathAdder V3', 'wired', 0.26], ['Razer Viper V4 Pro', 'wired', 0.26], ['Endgame Gear OP1 8k', 'wired', 0.30], ['HyperX Pulsefire Haste 2', 'wired', 0.33], ['Razer Viper V4 Pro', 'wireless', 0.34], ['ELECOM VM800L', 'wired', 0.42], ['Scyrox V8', 'wireless', 0.51], ['ELECOM VM800L', 'wireless', 0.65], ['WLMOUSE Beast X 8K', 'wireless', 0.68], ['VAXEE NP01-S V3', 'wireless', 0.70], ['Razer Viper V3 Pro', 'wireless', 0.77], ['Razer Viper V2 Pro', 'wireless', 0.88], ['Logitech G Pro X2 Superstrike', 'wireless', 0.89], ['Logitech G Pro X Superlight 2', 'wireless', 0.90]];
S({
  id: 'motion', ch: 'elec', theme: 'night', title: 'the fastest mice, on one chart', settle: 10, ideas: ['latency'],
  src: ['piaknow', 'kunai', 'xbab', 'razerHs'],
  draw: t => {
    header(t, 'the fastest mice, on one chart');
    const wx = LM, wy = 272, ww = 1180, wh = 640, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('motion latency at 8000 Hz, ms. lower is faster.', wx + 28, wy + 42, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    let lx = wx + ww - 28; const leg = [['projected', C.red, true], ['wireless', A, false], ['wired', C.gray, false]];
    leg.forEach(([l, c, d]) => { const k = ep(t, 1.0, 1.4), w2 = tw(l, { role: 'label' }); text(l, lx, wy + 42, { role: 'label', color: c, align: 'right', alpha: k }); lx -= w2 + 22; if (d) { G.save(); G.globalAlpha = k; G.setLineDash([4, 3]); G.strokeStyle = c; G.lineWidth = 2; G.strokeRect(lx + 2, wy + 30, 14, 12); G.restore(); } else rect(lx + 2, wy + 30, 14, 12, { fill: c, alpha: k }); lx -= 18; });
    const bx0 = wx + 440, bw = 660, X = v => bx0 + bw * v, top = wy + 92, rh = 28.6, a0 = ep(t, 1.0, 1.4);
    for (const v of [0, 0.2, 0.4, 0.6, 0.8, 1.0]) { line(X(v), top - 22, X(v), top + rh * PIAKNOW.length - 12, { color: C.hair, w: 1, alpha: a0 }); text(v.toFixed(1), X(v), top + rh * PIAKNOW.length + 12, { role: 'small', color: C.mute, align: 'center', alpha: a0 }); }
    PIAKNOW.forEach(([name, mode, v], i) => {
      const y = top + i * rh, k = ep(t, 1.4 + i * 0.09, 2.0 + i * 0.09, E.snap), col = mode === 'wired' ? C.gray : mode === 'wireless' ? A : C.red, hi = name === 'XBAB XA25' || (name === 'Razer Viper V4 Pro' && mode === 'wireless');
      text(name + ', ' + mode, wx + 28, y + 5, { role: 'small', weight: hi || mode === 'projected' ? 800 : 600, color: hi || mode === 'projected' ? C.ink : C.ink2, alpha: ep(t, 1.2 + i * 0.09, 1.6 + i * 0.09) });
      if (mode === 'projected') { G.save(); G.globalAlpha = k; G.setLineDash([5, 4]); G.strokeStyle = col; G.lineWidth = 2; G.strokeRect(bx0, y - 8, bw * v * k, 16); G.restore(); }
      else { rect(bx0, y - 8, bw * v * k, 16, { fill: col }); glint(bx0, y - 8, bw * v * k, 16, t, 6.5 + i * 0.1, 9); }
      text(v.toFixed(2), bx0 + bw * v * k + 10, y + 5, { role: 'label', color: col, alpha: k });
    });
    const kt = ep(t, 4.2, 4.6); line(X(0.14), top - 30, X(0.14), top + rh * PIAKNOW.length - 10, { color: C.blue, w: 2, dash: [6, 5], alpha: kt });
    text('my target, wireless: 0.14', X(0.14) + 8, top - 30, { role: 'label', color: C.blue, alpha: kt });
    /* reading it */
    const rx = 1316, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('how to read it', rx + 28, wy + 42, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['measured', 'derived'], ep(t, 1.0, 1.4));
    text('piaknow times each mouse from the moment it moves to the moment the PC sees it, on one rig, so the rows compare.', rx + 28, wy + 116, { role: 'small', color: C.ink2, t, t0: 1.2, cps: 120, maxW: rw - 56, lh: 1.45 });
    bignum(t, 2.4, rx + 28, wy + 270, '0.34', 'ms', { size: 64, color: A });
    text('the fastest wireless mouse measured', rx + 28, wy + 300, { role: 'label', color: C.mute, alpha: ep(t, 2.6, 3.0) });
    text('Kunai\'s 0.14 ms is a projection: 79.6 µs from its timing model, plus 62.5 µs, half an 8 kHz report, to put it on piaknow\'s scale. it hasn\'t been on the rig yet.', rx + 28, wy + 348, { role: 'small', color: C.ink2, t, t0: 3.0, cps: 120, maxW: rw - 56, lh: 1.45 });
    text('the XA25 row is from before SensorLock, which should lower it.', rx + 28, wy + 478, { role: 'small', color: C.ink2, t, t0: 4.0, cps: 120, maxW: rw - 56, lh: 1.45 });
    text('my targets: 0.13 ms wired, 0.14 ms wireless, measured on the same rig.', rx + 28, wy + 560, { role: 'label', color: C.blue, t, t0: 5.0, cps: 90, maxW: rw - 56, lh: 1.4 });
    captions(t, [[0.6, 'every 8 kHz row on piaknow\'s chart: one rig, one method, so the mice compare.'], [4.4, 'the fastest wireless mouse measured so far takes 0.34 ms. the fastest wired one, 0.13.'], [7.2, 'a firmware still in testing projects 0.14 ms wireless. that\'s my target, measured on the same rig.']], { y: 984 });
    source(t, 'data: piaknow, "Motion Latency of Some Computer Mice 2026-09-15", 8000 Hz column, as redrawn in the Kunai tester guide. piaknow has not measured Kunai.', { y: 1058, t0: 2 });
  }
});
/* ---------- electronics: capture the frame just before it is sent (FrameSync, SensorLock, PerfectSync) ---------- */
S({
  id: 'framesync', ch: 'elec', theme: 'paper', title: 'capture each frame just in time', settle: 10, ideas: ['sync'],
  src: ['kunai', 'xbabSensorLock', 'pcgFrameSync', 'razerFocus', 'slxPdf'],
  draw: t => {
    header(t, 'capture each frame just in time');
    const wx = LM, wy = 272, ww = 1060, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('four 8 kHz reports, 500 µs', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 0.9, 1.3)); text('illustration: 12,000 frames a second against 8,000 polls, 15 µs to process a frame', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const x0 = wx + 230, x1 = wx + ww - 50, X = us => x0 + (x1 - x0) * us / 500, now = clamp((t - 1.2) / 4.0) * 500;
    const polls = [125, 250, 375, 500], lanes = [{ y: wy + 200, name: 'sensor on its own clock', frames: [10, 93.3, 176.7, 260, 343.3, 426.7], col: C.red }, { y: wy + 350, name: 'synced to the polls', frames: [105, 230, 355, 480], col: A }];
    for (const p of polls) { const k = ep(t, 1.0, 1.4); line(X(p), wy + 130, X(p), wy + 410, { color: C.ink2, w: 1.5, dash: [5, 4], alpha: k }); text('poll', X(p), wy + 428, { role: 'label', color: C.mute, align: 'center', alpha: k }); }
    lanes.forEach((L, li) => {
      const k = ep(t, 1.1 + li * 0.3, 1.5 + li * 0.3);
      text(L.name, wx + 28, L.y + 5, { role: 'label', color: L.col, alpha: k, maxW: 190 });
      line(X(0), L.y, X(500), L.y, { color: C.faint, w: 1.5, alpha: k });
      for (const f of L.frames) if (f <= now) { rect(X(f) - 3, L.y - 26, 6, 26, { fill: L.col }); circle(X(f), L.y - 30, 8, { fill: rgba(L.col, 0.25) }); }
      polls.forEach((p, pi) => { if (p > now) return; const used = L.frames.filter(f => f + 15 <= p).pop(), age = Math.round(p - used); const yb = L.y + 18 + (pi % 2) * 0; line(X(used), yb, X(p), yb, { color: L.col, w: 2.5 }); line(X(used), yb - 5, X(used), yb + 5, { color: L.col, w: 2 }); line(X(p), yb - 5, X(p), yb + 5, { color: L.col, w: 2 }); text(age + ' µs', (X(used) + X(p)) / 2, yb + 22, { role: 'label', color: L.col, align: 'center' }); });
    });
    /* once it's all drawn, a playhead keeps running the 500 µs: each frame flashes as it's captured, each poll pings as it's sent */
    if (t > 6.4) {
      const pk = ep(t, 6.4, 6.9), ph = ((t - 6.4) % 3.2) / 3.2 * 530 - 15;
      line(X(ph), wy + 118, X(ph), wy + 412, { color: C.ink, w: 1.5, alpha: 0.3 * pk });
      lanes.forEach(L => { for (const f of L.frames) { const d = Math.abs(ph - f); if (d < 16) { circle(X(f), L.y - 30, 8 + (16 - d) * 0.8, { fill: rgba(L.col, 0.4 * (1 - d / 16)), alpha: pk }); rect(X(f) - 3, L.y - 26, 6, 26, { fill: C.ink, alpha: pk * 0.5 * (1 - d / 16) }); } } });
      for (const p of polls) { const d = ph - p; if (d >= 0 && d < 34) { const q = 1 - d / 34; circle(X(p), wy + 124, 4 + 14 * (1 - q), { color: C.ink2, w: 1.6, alpha: pk * q }); } }
    }
    text('bars: a frame captured. brackets: how old the motion is when the report goes out.', wx + 28, wy + 470, { role: 'label', color: C.ink2, alpha: ep(t, 2.0, 2.4), maxW: ww - 56 });
    text('on its own clock the age jumps between reports, here 32 and 73 µs. synced, it is the same every time.', wx + 28, wy + 500, { role: 'label', color: C.ink, t, t0: 5.4, cps: 100, maxW: ww - 56 });
    /* the measured gap, and how far the trip has been cut */
    const rx = 1196, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('photon to wire, wired, 8 kHz', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['measured'], ep(t, 1.0, 1.4)); text('by SensorLock\'s developers', rx + 28, wy + 86, { role: 'small', size: 22, maxW: rw - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const bx = rx + 190, bw2 = rw - 330, BX = us => bx + bw2 * us / 210;
    [['SensorLock', 42, A, '42 µs'], ['FrameSync', 205, C.gray, '+163 µs']].forEach(([l, v, c, lab], i) => { const y = wy + 126 + i * 46, k = ep(t, 1.6 + i * 0.3, 2.4 + i * 0.3, E.snap); text(l, rx + 28, y + 6, { role: 'label', color: C.ink2, alpha: ep(t, 1.4, 1.8) }); rect(bx, y - 9, (BX(v) - bx) * k, 18, { fill: c }); text(lab, bx + (BX(v) - bx) * k + 10, y + 6, { role: 'label', color: c, alpha: k }); });
    text('SensorLock\'s 42 µs is a wired reference mouse. both mice were timed the same way.', rx + 28, wy + 226, { role: 'small', color: C.faint, alpha: ep(t, 2.6, 3.0), maxW: rw - 56, lh: 1.4 });
    rule(rx + 28, wy + 268, rx + rw - 28, ep(t, 2.8, 3.2));
    text('Kunai, light to PC, wireless, 8 kHz', rx + 28, wy + 304, { role: 'label', color: C.ink, t, t0: 3.0, cps: 70 });
    tag(rx + 28, wy + 334, 'derived', ep(t, 3.1, 3.5)); text('on paper, from measured stages', rx + 150, wy + 334, { role: 'small', color: C.mute, alpha: ep(t, 3.2, 3.6) });
    const KX = us => bx + bw2 * us / 110;
    [['Earlier builds', 100, C.gray, '~100 µs'], ['Now', 79.6, A, '79.6 µs'], ['Hardware floor', 65, C.ink, '~65 µs']].forEach(([l, v, c, lab], i) => { const y = wy + 378 + i * 40, k = ep(t, 3.4 + i * 0.25, 4.1 + i * 0.25, E.snap); text(l, rx + 28, y + 6, { role: 'label', color: C.ink2, alpha: ep(t, 3.3, 3.7) }); rect(bx, y - 8, (KX(v) - bx) * k, 16, { fill: c }); text(lab, bx + (KX(v) - bx) * k + 10, y + 6, { role: 'label', color: c, alpha: k }); });
    text('Finalmouse\'s PerfectSync does this on the SLX, "without added delay or buffering".', rx + 28, wy + 526, { role: 'small', size: 22, color: C.ink2, t, t0: 4.6, cps: 120, maxW: rw - 56, lh: 1.3 });
    gloss(t, 2.6, 'frame', 'one picture of the pad taken by the sensor\'s camera. the LED flashes once per frame, and the sensor works out movement by comparing frames.');
    featureCard(t, 6.6, 'SensorLock-class sync', ['measured', 'derived', 'proposal'], 'the frame captured just before every read, at every polling rate, wired and wireless.');
    captions(t, [[0.6, 'the sensor is a camera taking pictures of the pad. on its own clock, a finished picture waits to be read, then waits again to be sent.'], [4.2, 'sync the camera to the polls and every report carries motion that was just seen, the same age every time.'], [7.2, 'Razer calls it FrameSync. tekkusai\'s SensorLock measured 163 µs sooner, and that\'s the one I want.']]);
  }
});
S({
  id: 'power', ch: 'elec', theme: 'night', title: 'the polling tax', settle: 9, ideas: [99, 'pmic', 'gauge'], src: ['razerBatt', 'logiRgb', 'elcWs2812', 'npm1300', 'tpuVv3p', 'tpuUlx9', 'tpuX2h', 'tpuGpx2'],
  draw: t => {
    header(t, 'the polling tax');
    const wx = LM, wy = 272, ww = 940, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('battery life by polling rate, Viper V3 Pro', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['claim'], ep(t, 1.0, 1.4)); text('Razer\'s figures; average current derived from 300 mAh', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const data = [['1 kHz', 95, 3.2], ['2 kHz', 62, 4.8], ['4 kHz', 40, 7.5], ['8 kHz', 17, 17.6]];
    const bx = wx + 110, bw = 120, base = wy + 360, sc = 2.3;
    data.forEach(([l, h, ma], i) => { const x = bx + i * 170, k = ep(t, 1.4 + i * 0.25, 2.2 + i * 0.25, E.snap), col = i === 3 ? C.red : A; rect(x, base - h * sc * k, bw, h * sc * k, { fill: col }); glint(x, base - h * sc * k, bw, h * sc * k, t, 5 + i * 0.3, 7); text(h + ' h', x + bw / 2, base - h * sc * k - 12, { role: 'h3', size: 30, color: col, align: 'center', alpha: k }); text(l, x + bw / 2, base + 26, { role: 'label', color: C.ink2, align: 'center', alpha: ep(t, 1.2, 1.6) }); text(ma + ' mA', x + bw / 2, base + 50, { role: 'small', color: C.mute, align: 'center', alpha: k }); });
    line(wx + 90, base, wx + 790, base, { color: C.faint, w: 1.5, alpha: ep(t, 1.0, 1.4) });
    rule(wx + 28, wy + 440, wx + ww - 28, ep(t, 3.4, 3.8));
    text('RGB on vs off, G703 (Logitech spec): 22 h vs 30 h. The LED costs 27% of the runtime.', wx + 28, wy + 486, { role: 'small', size: 23, weight: 700, color: C.ink, t, t0: 3.6, cps: 90, maxW: ww - 56, lh: 1.3 });
    
    /* charging */
    const rx = 1070, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('charge current, measured', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['measured'], ep(t, 1.0, 1.4));
    const cr = [['UltralightX', 0.131, C.gray], ['Viper V3 Pro', 0.150, C.gray], ['Pulsar X2H', 0.28, C.ink], ['Theseus, with a PMIC', 0.30, YEL]];
    const X0 = rx + 230, XW = rw - 420, CX = v => X0 + XW * v / 0.32;
    cr.forEach(([l, v, col], i) => { const y = wy + 140 + i * 58, k = ep(t, 1.4 + i * 0.2, 2.0 + i * 0.2, E.snap); text(l, rx + 28, y + 6, { role: 'label', color: C.ink2, alpha: ep(t, 1.2 + i * 0.2, 1.6 + i * 0.2) }); rect(X0, y - 9, (CX(v) - X0) * k, 18, { fill: col }); text((v < 0.3 ? v.toFixed(3) : '0.3+') + ' A, ' + Math.round(0.3 / v * 60) + ' min', CX(v) + 10, y + 8, { role: 'num', size: 21, color: col, alpha: k }); });
    text('Minutes to fill 300 mAh, before the taper', rx + 28, wy + 396, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 2.4, 2.8), maxW: rw - 56 });
    text('nPM1300 PMIC: 32 to 800 mA charging, a fuel gauge with no extra parts, 370 nA ship mode.', rx + 28, wy + 446, { role: 'small', size: 23, weight: 700, color: C.ink, t, t0: 3.0, cps: 100, maxW: rw - 56, lh: 1.3 });
    text('Without a gauge, one flagship jumped to 60% after a power cycle (TechPowerUp).', rx + 28, wy + 526, { role: 'small', size: 22, color: C.mute, t, t0: 4.0, cps: 100, maxW: rw - 56, lh: 1.3 });
    gloss(t, 2.6, 'fuel gauge', 'a circuit that counts the charge going in and out of the battery, so the percentage you see is measured instead of guessed from the voltage.');
    featureCard(t, 5.0, 'every milliamp accounted for', ['claim', 'measured', 'proposal'], 'no RGB LED (#99), a PMIC with a fuel gauge, and the radio chip from the last slide, which spends less to receive.');
    captions(t, [[0.6, 'every report the mouse sends costs current. at 8 kHz the average draw is five times what it is at 1 kHz, and battery life falls off a cliff.'], [3.6, 'an RGB LED is a tax on top of that, and it doesn\'t stop draining when you turn it off in software.'], [6.0, 'and charging today is slow. a PMIC can set the current to what the cell can take, and count what actually went in.']]);
  }
});
/* ---------- electronics: sync saves battery too (PerfectSync, PerfectPolling, Smart sleep) ---------- */
S({
  id: 'syncpower', ch: 'elec', theme: 'paper', title: 'sync saves battery, too', settle: 9, ideas: ['sync', 'sleep'],
  src: ['razerBatt', 'nbcV4', 'slxPdf', 'slxGp', 'slxOog', 'kunai'],
  draw: t => {
    header(t, 'sync saves battery, too');
    const wx = LM, wy = 272, ww = 940, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('the Viper before and after FrameSync', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    cardPills(wx, wy, ww, ['claim'], ep(t, 0.9, 1.3)); text('Razer\'s battery figures', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const base = wy + 400, sc = 1.35, groups = [['1 kHz', 95, 180], ['8 kHz', 17, 45]];
    line(wx + 70, base, wx + ww - 60, base, { color: C.faint, w: 1.5, alpha: ep(t, 1.0, 1.4) });
    groups.forEach(([g, a, b], gi) => {
      const gx = wx + 120 + gi * 400; text(g, gx + 125, base + 30, { role: 'label', color: C.ink, align: 'center', alpha: ep(t, 1.2, 1.6) });
      [['V3 Pro', a, C.gray], ['V4 Pro', b, A]].forEach(([l, v, c], j) => { const x = gx + j * 140, k = ep(t, 1.4 + gi * 0.5 + j * 0.25, 2.2 + gi * 0.5 + j * 0.25, E.snap), h2 = v * sc * k; rect(x, base - h2, 110, h2, { fill: c }); glint(x, base - h2, 110, h2, t, 5 + gi * 0.5 + j * 0.25, 7); text(v + ' h', x + 55, base - h2 - 12, { role: 'label', color: c, align: 'center', alpha: k }); text(l, x + 55, base + 54, { role: 'label', color: C.mute, align: 'center', alpha: k }); });
      const kk = ep(t, 3.0 + gi * 0.3, 3.4 + gi * 0.3); text('×' + (b / a).toFixed(1), gx + 250, base - b * sc - 40, { role: 'h3', size: 30, color: A, alpha: kk });
    });
    text('The V4 Pro changed chips and battery too: not all of the gain is sync.', wx + 28, wy + 500, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 3.4, 3.8), maxW: ww - 56 });
    text('Finalmouse credits PerfectSync for the SLX\'s "best battery life yet", but publishes no hour rating.', wx + 28, wy + 536, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 3.8, 4.2), maxW: ww - 56 });
    /* why, and the rest of the battery work */
    const rx = 1070, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('why sync saves current', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['derived'], ep(t, 1.0, 1.4));
    text('The LED flashes once per frame. Synced, every read gets a fresh frame, so the sensor can flash less often.', rx + 28, wy + 104, { role: 'small', size: 24, color: C.ink2, t, t0: 1.2, cps: 130, maxW: rw - 56, lh: 1.32 });
    rule(rx + 28, wy + 252, rx + rw - 28, ep(t, 2.4, 2.8));
    const items = [['Smart sleep, Kunai', 'Sleeps 10 s after your hand leaves; wakes on a touch.'], ['Head start, Kunai', 'The first move after a rest goes out in the next 125 µs slot.'], ['Second Shot, Kunai', 'The spare copy runs only while packets are being lost.']];
    items.forEach(([h2, b], i) => { const y = wy + 236 + i * 92, k = ep(t, 2.6 + i * 0.4, 3.0 + i * 0.4); text(h2, rx + 28, y, { role: 'label', color: A, alpha: k }); text(b, rx + 28, y + 30, { role: 'small', size: 23, color: C.ink2, alpha: k, maxW: rw - 56, lh: 1.3 }); });
    
    text('Target: 200 h at 1 kHz, 45 h at 8 kHz, measured', rx + 28, wy + wh - 28, { role: 'label', size: 20, color: C.heroText, t, t0: 4.4, cps: 80, maxW: rw - 56 });
    featureCard(t, 5.6, 'battery from sync and sleep', ['claim', 'derived', 'proposal'], 'frames captured only when they\'re needed, sleep driven by the button sensors, a spare copy only when the room needs it.');
    captions(t, [[0.6, 'the first mouse with FrameSync also claims about twice the battery of the one before it, and nearly three times at 8 kHz.'], [3.6, 'part of that is new chips and a new battery. sync helps too: a sensor that captures at the right moment doesn\'t need to capture as often.'], [6.6, 'and a mouse that feels your hand leave can sleep ten seconds later.']]);
  }
});
S({
  id: 'antenna', ch: 'elec', theme: 'paper', title: 'keep carbon away from the antenna', settle: 9, ideas: [68, 101], src: ['cfShield', 'logiManual'],
  draw: t => {
    header(t, 'keep carbon away from the antenna');
    const wx = LM, wy = 272, ww = 980, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const o = part(wx + 300, wy + 330, 11, () => boardMM({}), { alpha: ep(t, 0.4, 0.9) });
    const ax = o.antArea ? o.antArea[0] : wx + 450, ay = o.antArea ? o.antArea[1] : wy + 220;
    /* waves leaving the antenna: through plain plastic above, through carbon to the right */
    const k = ep(t, 1.2, 1.6);
    G.save(); rrPath(wx, wy, ww, wh, 14); G.clip();
    for (let i = 0; i < 6; i++) { const ph = (t * 0.5 + i / 6) % 1, r = 30 + ph * 330; circle(ax, ay, r, { color: A, w: 2.5, alpha: k * (1 - ph) * 0.8, a0: -Math.PI * 0.95, a1: -Math.PI * 0.55 }); const fade = r > 170 ? 0.03 : 1; circle(ax, ay, r, { color: A, w: 2.5, alpha: k * (1 - ph) * 0.8 * fade, a0: -Math.PI * 0.25, a1: Math.PI * 0.05 }); }
    G.restore();
    part(0, 0, 1, () => { solid(() => { G.beginPath(); G.rect(ax + 150, ay - 160, 22, 220); }, MT.shell, [ax + 150, ay - 160, 22, 220], { hatch: true }); }, { alpha: ep(t, 1.6, 2.0) });
    text('carbon fibre wall', ax + 182, ay - 140, { role: 'label', color: C.red, alpha: ep(t, 1.8, 2.2) });
    text('30 dB: a thousandth of the power gets through', ax + 182, ay - 116, { role: 'small', color: C.mute, alpha: ep(t, 2.0, 2.4), maxW: 200 });
    callout(t, 2.4, [ax, ay], 'antenna, in a keep-out with no copper under it', { to: [wx + 40, wy + 90], side: 'r', color: A, role: 'small', maxW: 280 });
    callout(t, 2.8, o.mcu || [ax - 150, ay + 60], 'radio and MCU', { to: [wx + 40, wy + 500], side: 'r', color: C.ink2, tcolor: C.mute, role: 'small' });
    /* attenuation */
    const rx = 1110, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('signal lost through the wall', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['study'], ep(t, 1.0, 1.4));
    const bars = [['carbon-filled polymer', 30, 33, C.ink], ['continuous carbon laminate', 60, 80, C.red]];
    const X0 = rx + 28, XW = rw - 150, BXv = v => X0 + XW * v / 100;
    bars.forEach(([l, a, b, col], i) => { const y = wy + 150 + i * 80, kk = ep(t, 1.6 + i * 0.3, 2.4 + i * 0.3, E.snap); text(l, X0, y - 12, { role: 'label', color: C.ink2, alpha: kk }); rect(X0, y, (BXv(b) - X0) * kk, 18, { fill: col, alpha: 0.45 }); rect(X0, y, (BXv(a) - X0) * kk, 18, { fill: col }); text(a + ' to ' + b + ' dB', BXv(b) + 10, y + 14, { role: 'label', color: col, alpha: kk }); });
    text('shielding studies, mostly above 2.4 GHz. every 10 dB is ten times less power.', rx + 28, wy + 330, { role: 'small', color: C.faint, alpha: ep(t, 2.6, 3.0), maxW: rw - 56 });
    text('so the antenna sits as far forward as it can, behind plastic, not carbon (#68). brass inserts stay away from it too, since nearby metal detunes it (#101).', rx + 28, wy + 400, { role: 'label', color: C.ink, t, t0: 3.2, cps: 80, maxW: rw - 56, lh: 1.45 });
    text('receiver about 20 cm from the mouse (Logitech\'s manual).', rx + 28, wy + 516, { role: 'small', color: C.mute, alpha: ep(t, 4.4, 4.8) });
    keyPlan(t, 1.0, wx + ww - 46, wy + 440, { s: 0.6, hi: ['board', 'antenna'], label: 'antenna' });
    gloss(t, 2.6, 'decibel loss', 'a log scale for how much signal a wall eats. 10 dB is a tenth of the power, 30 dB a thousandth.');
    featureCard(t, 4.6, 'antenna forward, clear of carbon', ['study', 'proposal'], 'as far forward as possible (#68), with the brass inserts placed away from it (#101).');
    captions(t, [[0.6, 'carbon fibre conducts, and conductive walls shield radio. the studies put a thin carbon composite at around 30 dB.'], [3.4, 'that is a thousandth of the power. a mouse can live with it only if the antenna has a clear way out.'], [5.6, 'so the antenna goes to the front, behind plastic, with the metal kept away.']]);
  }
});
/* ---------- electronics: a spare copy of every report (Second Shot) ---------- */
S({
  id: 'secondshot', ch: 'elec', theme: 'night', title: 'a spare copy of every report', settle: 9, ideas: ['link'],
  src: ['kunai'], sfxLoop: [{ t0: 9, per: 5, cues: [[0.24, 'tick'], [0.28, 'tick']] }],
  draw: t => {
    header(t, 'a spare copy of every report');
    const wx = LM, wy = 272, ww = 1040, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('one report at 1 kHz is eight 125 µs radio slots', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    cardPills(wx, wy, ww, ['claim'], ep(t, 0.9, 1.3)); text('how Second Shot works, from Kunai\'s tester guide', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const sx0 = wx + 210, sw = (ww - 260) / 8, ly = [wy + 170, wy + 270];
    ['channel A: the report', 'channel B, 8 MHz or more away: the spare'].forEach((l, i) => text(l, wx + 28, ly[i] + 6, { role: 'label', color: i ? A : C.ink2, alpha: ep(t, 1.0 + i * 0.2, 1.4 + i * 0.2), maxW: 170, lh: 1.3 }));
    for (let i = 0; i < 8; i++) { const k = ep(t, 1.2 + i * 0.05, 1.5 + i * 0.05); for (const y of ly) rr(sx0 + i * sw + 3, y - 24, sw - 6, 48, 6, inkA(0.04), inkA(0.16), 1.2, k); text(String(i + 1), sx0 + i * sw + sw / 2, wy + 330, { role: 'label', color: C.mute, align: 'center', alpha: k }); }
    /* after the first pass the radio keeps running: a slot cursor walks the eight slots, and every other report is lost and covered by its spare */
    const c9 = t >= 9 ? (t - 9) % 5 : -1, lostNow = c9 < 0 || Math.floor((t - 9) / 5) % 2 === 1, fo = c9 < 0 ? 1 : 1 - ep(c9, 4.4, 4.9);
    const kSpare = c9 < 0 ? ep(t, 2.0, 2.4) : ep(c9, 1.2, 1.4) * fo, kRep = c9 < 0 ? ep(t, 2.6, 3.0) : ep(c9, 1.4, 1.6) * fo, kLost = lostNow ? (c9 < 0 ? ep(t, 3.4, 3.7) : ep(c9, 1.9, 2.2) * fo) : 0, kSave = lostNow ? (c9 < 0 ? ep(t, 4.2, 4.6) : ep(c9, 2.5, 2.9) * fo) : 0;
    if (c9 >= 0) {
      const sl = clamp(Math.floor(c9 / 0.2), 0, 7), sk = ep(t, 9, 9.3) * (1 - ep(c9, 1.6, 1.9));
      for (const y of ly) rr(sx0 + sl * sw + 1, y - 26, sw - 2, 52, 7, null, inkA(0.55), 1.6, sk);
      if (!lostNow) { const kd = ep(c9, 1.9, 2.2) * fo; text('✓ report arrives; the spare is dropped', sx0 + 8 * sw + 30, ly[0] + 44, { role: 'label', color: C.green, align: 'right', alpha: kd }); }
    }
    rr(sx0 + 6 * sw + 8, ly[1] - 18, sw - 16, 36, 5, A, null, 1, kSpare); text('spare', sx0 + 6.5 * sw, ly[1] + 5, { role: 'label', color: '#111', align: 'center', alpha: kSpare });
    rr(sx0 + 7 * sw + 8, ly[0] - 18, sw - 16, 36, 5, C.gray, null, 1, kRep * (1 - 0.6 * kLost)); text('report', sx0 + 7.5 * sw, ly[0] + 5, { role: 'label', color: '#111', align: 'center', alpha: kRep });
    if (kLost > 0) { const cx = sx0 + 7.5 * sw, cy = ly[0]; line(cx - 22, cy - 22, cx + 22, cy + 22, { color: C.red, w: 4, alpha: kLost }); line(cx + 22, cy - 22, cx - 22, cy + 22, { color: C.red, w: 4, alpha: kLost }); text('lost', cx, cy - 34, { role: 'label', color: C.red, align: 'center', alpha: kLost }); }
    if (kSave > 0) { arrow(sx0 + 7 * sw - 4, ly[1], sx0 + 8 * sw + 30, ly[1], { color: A, w: 3, hs: 10, alpha: kSave }); text('your PC gets the spare, on time', sx0 + 8 * sw + 30, ly[1] + 34, { role: 'label', color: A, align: 'right', alpha: kSave }); }
    rule(wx + 28, wy + 370, wx + ww - 28, ep(t, 4.8, 5.2));
    text('without it, a lost report at 1 kHz costs up to a full millisecond. with it, the PC gets motion about 200 µs older, right on time.', wx + 28, wy + 408, { role: 'label', color: C.ink, t, t0: 5.0, cps: 100, maxW: ww - 56, lh: 1.45 });
    text('at 8 kHz every report carries the full running count, so a lost packet\'s motion arrives 125 µs later, inside the next report. the link also hops channel every report and drops the ones losing packets.', wx + 28, wy + 476, { role: 'small', color: C.ink2, t, t0: 6.0, cps: 120, maxW: ww - 56, lh: 1.45 });
    /* the measured numbers */
    const rx = 1176, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('measured, by its developer', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['measured'], ep(t, 1.0, 1.4));
    bignum(t, 1.6, rx + 28, wy + 186, '99 to 100', '%', { size: 64, color: A });
    text('of lost reports rescued at 4 kHz, with a wireless headset in use nearby', rx + 28, wy + 222, { role: 'label', color: C.ink2, alpha: ep(t, 2.0, 2.4), maxW: rw - 56, lh: 1.4 });
    text('at the weakest signal tried, 0.67% of reports were lost, and 15 of 220,017 stayed lost.', rx + 28, wy + 300, { role: 'small', color: C.ink2, t, t0: 2.8, cps: 120, maxW: rw - 56, lh: 1.45 });
    text('the worst room: about 92%, next to a headset base station using nearly every channel.', rx + 28, wy + 370, { role: 'small', color: C.ink2, t, t0: 3.6, cps: 120, maxW: rw - 56, lh: 1.45 });
    text('no mouse maker publishes packet loss yet. this one should, at 8 kHz, in a crowded room.', rx + 28, wy + 470, { role: 'label', color: C.blue, t, t0: 4.6, cps: 90, maxW: rw - 56, lh: 1.4 });
    gloss(t, 2.8, 'packet loss', 'a report the receiver never hears, usually because something else was talking on that channel. the PC sees a missed poll.');
    featureCard(t, 6.4, 'a spare copy, one slot early', ['measured', 'proposal'], 'recover 99% or more of lost reports at every rate, and publish measured loss.');
    captions(t, [[0.6, '2.4 GHz is shared with headsets, phones and Wi-Fi, so some packets get lost. at 1 kHz, one lost report costs up to a full millisecond.'], [3.6, 'send a spare copy one radio slot early, on another channel, and a lost report is replaced on time.'], [6.4, 'in its developer\'s tests that rescued 99 to 100% of lost reports.']]);
  }
});
S({
  id: 'dongle', ch: 'elec', theme: 'night', title: 'a receiver that tells you things', settle: 9, ideas: [85, 86, 88, 21, 22, 25], src: ['pulsarLink', 'ulxLed', 'wiz', 'npm1300'],
  sfxLoop: [{ t0: 3.0, per: 2.2, cues: [[0, 'click'], [0.07, 'release']] }],
  draw: t => {
    header(t, 'a receiver that tells you things');
    const wx = LM, wy = 272, ww = 1080, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const presses = Math.max(0, Math.floor((t - 3.0) / 2.2) + 1), dpi = [800, 1600, 3200][presses % 3], pressing = t > 3.0 && ((t - 3.0) % 2.2) < 0.18;
    const pct = Math.min(100, 73 + Math.floor(Math.max(0, t - 2) * 0.6)), mins = Math.max(0, 41 - Math.floor(Math.max(0, t - 2) * 0.6));
    G.save(); rrPath(wx, wy, ww, wh, 14); G.clip();
    const o = part(wx + ww / 2, wy + 270, 15, () => dongleMM({ lines: [{ t: '8000 Hz', s: 3.4, y: 4.6 }, { t: dpi + ' dpi', s: 2.3, y: 8.2, c: pressing ? acc() : '#9b9a94' }, { t: pct + '%  ' + mins + ' min to full', s: 1.7, y: 10.6, c: '#9b9a94' }], bat: pct / 100, accent: A }), { alpha: Math.max(0.004, ep(t, 0.4, 0.9)) });
    G.restore();
    if (pressing) circle(o.b1[0], o.b1[1] - 2.35 * 15, 40, { color: A, w: 3, alpha: 0.6 });
    callout(t, 1.2, o.screen, 'a small mono screen (#85)', { to: [wx + 180, wy + 90], side: 'r', color: A, role: 'small', maxW: 260 });
    callout(t, 1.6, [o.screen[0] + 80, o.screen[1] + 150], 'battery % and time to full (#86, #88)', { to: [wx + 120, wy + 470], side: 'r', color: A, role: 'small', maxW: 300 });
    callout(t, 2.0, o.b1, 'DPI and polling buttons (#21)', { to: [wx + ww - 200, wy + 470], side: 'r', color: A, role: 'small', maxW: 170 });
    callout(t, 2.4, o.portR, 'passthrough USB-C: charge through the receiver (#22)', { to: [wx + ww - 250, wy + 92], side: 'r', color: A, role: 'small', maxW: 210 });
    text('receiver styling here is generic; the features are the point', wx + ww - 28, wy + wh - 18, { role: 'small', color: C.faint, align: 'right', alpha: ep(t, 2.6, 3.0) });
    /* what it replaces */
    const rx = 1210, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('the benchmark\'s receiver: one LED', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const bands = [['#46b35a', 'over 50%'], ['#e2c13e', 'under 50%'], ['#f0a43a', 'under 25%'], ['#e5484d', 'under 10%']];
    bands.forEach(([c, l], i) => { const y = wy + 110 + i * 44, k = ep(t, 1.2 + i * 0.15, 1.6 + i * 0.15); circle(rx + 44, y, 9, { fill: c, alpha: k }); text(l, rx + 66, y + 6, { role: 'label', color: C.ink2, alpha: k }); });
    text('a colour band can\'t say 73%, or how long the charge has left to run. a screen can, once a fuel gauge is measuring it.', rx + 28, wy + 330, { role: 'label', color: C.ink, t, t0: 3.0, cps: 90, maxW: rw - 56, lh: 1.45 });
    text('plug to pair (#25): wire both once and they pair, the way a DualSense pairs with a PS5 over its cable.', rx + 28, wy + 440, { role: 'small', color: C.mute, t, t0: 4.2, cps: 100, maxW: rw - 56, lh: 1.45 });
    gloss(t, 2.8, 'passthrough', 'a second port on the receiver. the cable from the PC goes into the receiver, and the mouse charges from it without a second cable to the computer.');
    featureCard(t, 5.2, 'a receiver with a screen', ['claim', 'proposal'], 'screen (#85), time to full and battery estimate (#86, #88), DPI and polling buttons, as on Pulsar\'s Link 8K (#21), passthrough (#22), plug to pair (#25).');
    captions(t, [[0.6, 'the receiver sits in front of you all day. it is the right place to show what the mouse is doing.'], [3.0, 'buttons on it change DPI and polling without flipping the mouse over or opening software.'], [5.6, 'and a second port lets it charge the mouse, so one cable from the PC does both jobs.']]);
  }
});
S({
  id: 'cable', ch: 'elec', theme: 'paper', title: 'a cable you can play on', settle: 8, ideas: [19, 20, 70], src: ['tpuCables'],
  draw: t => {
    header(t, 'a cable you can play on');
    const wx = LM, wy = 272, ww = 820, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    figLabel(t, 0.6, wx + 28, wy + 44, 12, 'the charging cable, cut across, about 2.4 mm');
    const o = part(wx + 300, wy + 300, 120, () => cableMM({}), { alpha: ep(t, 0.4, 0.9) });
    callout(t, 1.2, o.sheath, 'paracord sheath, branded (#70)', { to: [wx + 560, wy + 130], side: 'r', color: A, role: 'small', maxW: 220 });
    callout(t, 1.6, o.core, 'braided conductors inside', { to: [wx + 560, wy + 300], side: 'r', color: A, role: 'small', maxW: 220 });
    callout(t, 2.0, o.fill, 'soft filler, no stiff jacket', { to: [wx + 560, wy + 450], side: 'r', color: C.ink2, tcolor: C.ink2, role: 'small', maxW: 220 });
    const rx = 950, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('what reviewers said about the cables in the box', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['measured'], ep(t, 1.0, 1.4)); text('techpowerup reviews', rx + 28, wy + 86, { role: 'small', size: 22, maxW: rw - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const rows = [['G Pro X Superlight 2', '1.80 m rubber', 'below average flexibility'], ['Viper V3 Pro', '1.80 m braided', 'stiff'], ['UltralightX', '1.70 m braided', '"supremely stiff", restricts movement'], ['Maya X', '1.75 m braided', 'prevents playing while charging']];
    rows.forEach((r, i) => { const y = wy + 140 + i * 66, k = ep(t, 1.4 + i * 0.2, 1.8 + i * 0.2); if (i) rule(rx + 28, y - 36, rx + rw - 28, k); text(r[0], rx + 28, y, { role: 'label', color: C.ink, alpha: k }); text(r[1], rx + 28, y + 22, { role: 'small', color: C.mute, alpha: k }); text(r[2], rx + 330, y + 10, { role: 'label', color: C.red, alpha: k, maxW: rw - 360 }); });
    text('the plug angles up so the mouse can\'t run it over (#19), and it\'s thin enough that the receiver sits flat while it still charges at full current (#20).', rx + 28, wy + 440, { role: 'label', color: C.ink, t, t0: 3.2, cps: 80, maxW: rw - 56, lh: 1.45 });
    gloss(t, 2.6, 'cable drag', 'the pull and spring of a cable on a mouse. on a 35 g mouse a stiff cable is a noticeable part of the weight you move.');
    featureCard(t, 4.6, 'a soft, angled cable', ['measured', 'proposal'], 'angled plug (#19), sized for a flat receiver and full charging (#20), paracord with braided wires (#70).');
    captions(t, [[0.6, 'on all four flagship-class mice, reviewers called the cable in the box too stiff to play on while it charges.'], [3.4, 'a paracord sheath over braided conductors bends like rope, and an angled plug keeps it clear of the mouse.']]);
  }
});
S({
  id: 'software', ch: 'elec', theme: 'night', title: 'software in a browser tab', settle: 9, ideas: [23, 65, 66, 87, 'qr'], src: ['webhid', 'tpuUlx9'],
  sfx: [[3.0, 'click'], [3.12, 'release'], [4.2, 'click'], [4.5, 'tick'], [4.8, 'tick'], [5.1, 'release'], [6.5, 'click'], [7.5, 'release']],
  draw: t => {
    header(t, 'software in a browser tab');
    const wx = LM, wy = 272, ww = 980, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    /* a generic browser window with a configurator */
    const bx = wx + 40, by = wy + 40, bw = ww - 80, bh = wh - 80, k = ep(t, 0.5, 1.0);
    rr(bx, by, bw, bh, 12, TH ? '#ffffff' : '#101113', inkA(0.2), 1.5, k);
    rr(bx, by, bw, 44, 12, inkA(0.06), null, 1, k);
    for (let i = 0; i < 3; i++) circle(bx + 24 + i * 20, by + 22, 6, { fill: inkA(0.25), alpha: k });
    rr(bx + 100, by + 10, 360, 24, 8, inkA(0.06), null, 1, k); text('store  ›  configure', bx + 116, by + 27, { role: 'small', color: C.mute, alpha: k });
    /* a cursor works the page once: polling to 8 kHz, lift-off down to 0.7 mm, DPI down to 800; each change is written to the mouse */
    const cx = bx + 40, cy = by + 100, x0 = cx + 220, w0 = bw - 320, u = t - 2.2;
    const poll = u < 0.9 ? 0 : 3, lo = u < 2.0 ? 3 : u < 2.9 ? Math.round(lerp(3, 0, E.io3(prog(u, 2.0, 2.9)))) : 0, dpiF = u < 4.3 ? 0 : E.io3(prog(u, 4.3, 5.3)), dpi = Math.round(lerp(1600, 800, dpiF) / 50) * 50;
    const knob = (v2) => x0 + w0 * (v2 - 400) / 6000;
    const P = { rest: [bx + bw - 60, by + bh - 50], chip8: [x0 + 3 * 86 + 36, cy + 72], lo3: [x0 + 3 * 30, cy + 144], lo0: [x0, cy + 144], dpiA: [knob(1600), cy], dpiB: [knob(800), cy] };
    const cur = kf(u, [[0, P.rest], [0.8, P.chip8], [1.3, P.chip8], [1.9, P.lo3], [2.0, P.lo3], [2.9, P.lo0], [3.4, P.lo0], [4.2, P.dpiA], [4.3, P.dpiA], [5.3, P.dpiB], [5.8, P.dpiB], [6.8, P.rest]]);
    const rows = [['DPI', 'slider', dpi], ['polling', 'chips', ['1k', '2k', '4k', '8k']], ['lift-off', 'steps', (0.7 + lo * 0.1).toFixed(1) + ' mm'], ['debounce', 'value', '0 ms, SPDT'], ['sensor angle', 'value', '−2.0°']];
    rows.forEach(([l, kind, v], i) => {
      const y = cy + i * 72, kk = ep(t, 1.0 + i * 0.2, 1.4 + i * 0.2);
      text(l, cx, y + 6, { role: 'label', color: C.ink, alpha: kk });
      if (kind === 'slider') { line(x0, y, x0 + w0, y, { color: C.hair, w: 4, alpha: kk }); const f = (v - 400) / 6000; line(x0, y, x0 + w0 * f, y, { color: A, w: 4, alpha: kk }); circle(x0 + w0 * f, y, 10, { fill: A, alpha: kk }); if (u > 4.3 && u < 5.5) circle(x0 + w0 * f, y, 16, { color: A, w: 2, alpha: kk * 0.4 }); text(String(v), x0 + w0 + 16, y + 6, { role: 'label', color: A, alpha: kk }); }
      else if (kind === 'chips') v.forEach((c, j) => { const on = j === poll, fl = j === 3 ? env(u, 0.85, 0.95, 1.1, 1.6) : 0; rr(x0 + j * 86, y - 16, 72, 32, 8, on ? A : inkA(0.06), on ? null : inkA(0.2), 1.2, kk); if (fl > 0) rr(x0 + j * 86 - 5 * fl, y - 16 - 5 * fl, 72 + 10 * fl, 32 + 10 * fl, 11, null, A, 2, kk * fl * 0.6); text(c, x0 + j * 86 + 36, y + 6, { role: 'label', color: on ? (TH ? '#fff' : '#0d0e0f') : C.ink2, align: 'center', alpha: kk }); });
      else if (kind === 'steps') { for (let j = 0; j <= 10; j++) line(x0 + j * 30, y - 8, x0 + j * 30, y + 8, { color: j === lo ? A : C.faint, w: j === lo ? 3 : 1.5, alpha: kk }); circle(x0 + lo * 30, y, 7, { fill: A, alpha: kk }); text(v, x0 + 330, y + 6, { role: 'label', color: A, alpha: kk }); }
      else text(v, x0, y + 6, { role: 'label', color: A, alpha: kk });
    });
    /* each change lands in the mouse's own memory, so it carries to any computer */
    for (const tw0 of [1.0, 3.0, 5.4]) { const kt = env(u, tw0, tw0 + 0.25, tw0 + 1.3, tw0 + 1.6); if (kt <= 0) continue; const ty = by + bh - 40 + (1 - kt) * 12; rr(bx + 40, ty - 22, 252, 34, 17, rgba(C.green, 0.16), C.green, 1.4, kt); text('✓  saved on the mouse', bx + 62, ty, { role: 'label', color: C.green, alpha: kt }); }
    if (u > 0 && t > 1.6) {
      const ca = ep(t, 1.6, 2.0), down = [0.8, 2.0, 4.3].some(c0 => u > c0 && u < c0 + 0.12) || (u > 2.0 && u < 2.9) || (u > 4.3 && u < 5.3);
      for (const c0 of [0.8, 2.0, 4.3]) { const rk = prog(u, c0, c0 + 0.45); if (rk > 0 && rk < 1) circle(cur[0], cur[1], 8 + rk * 26, { color: A, w: 2, alpha: ca * (1 - rk) * 0.8 }); }
      G.save(); G.globalAlpha = ca; G.translate(cur[0], cur[1]); const sc = down ? 0.9 : 1; G.scale(sc, sc);
      G.beginPath(); G.moveTo(0, 0); G.lineTo(0, 24); G.lineTo(6, 18.5); G.lineTo(10.5, 28); G.lineTo(14.5, 26.2); G.lineTo(10, 17); G.lineTo(17.5, 17); G.closePath();
      G.fillStyle = TH ? '#141516' : '#f7f6f2'; G.fill(); G.strokeStyle = TH ? '#f7f6f2' : '#141516'; G.lineWidth = 1.6; G.lineJoin = 'round'; G.stroke(); G.restore();
    }
    text('a generic mock-up of the configurator', wx + ww - 52, wy + wh - 54, { role: 'small', color: C.faint, align: 'right', alpha: k });
    const rx = 1110, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('how it works, and its limits', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['datasheet'], ep(t, 1.0, 1.4));
    const notes = [['WebHID: Chrome and Edge 89 and up. not Firefox or Safari.', C.ink2], ['you pick the device in a browser prompt, one device at a time, and raw keyboard and mouse input stays blocked.', C.ink2], ['the benchmark\'s web panel only talks to the receiver, so nothing changes while it charges. a mouse that is a full wired device fixes that (#90).', C.ink], ['firmware with each drop: motion latency (#65) and sensor tuning with PixArt (#66), a QR code on the board that opens the configurator.', A]];
    let ny = wy + 130; notes.forEach(([s2, col], i) => { const r = text(s2, rx + 28, ny, { role: 'label', color: col, t, t0: 1.6 + i * 0.9, cps: 90, maxW: rw - 56, lh: 1.42 }); ny += Math.max(r.h, 22) + 22; });
    gloss(t, 2.6, 'WebHID', 'a browser standard that lets a web page talk to a USB device after you allow it. nothing to install, nothing running in the background.');
    featureCard(t, 4.6, 'software in the browser', ['datasheet', 'proposal'], 'a web app on the store\'s own domain (#23), sensor angle and position in software (#87), firmware that keeps improving (#65, #66).');
    captions(t, [[0.6, 'mouse software is usually a large download that runs all the time. a browser tab doesn\'t install anything, and settings live on the mouse.'], [4.0, 'the limits are real: it needs a Chromium browser, and you approve each device once.']]);
  }
});

/* ============================== shape ============================== */
S({
  id: 'shapecard', ch: 'shape', card: true, theme: 'night', title: 'shape', settle: 5,
  draw: t => {
    chapterCard(t, { name: 'shape', gloss: 'the shape will keep changing until it ships, so this chapter is about the rules it has to follow, not the outline.', list: [['newton', 'curves that push the hand on, not off'], ['#47', 'shallow grooves near the front'], ['#42', 'rounded, defined shoulders'], ['#40', 'a lower front'], ['#38', 'a straighter, pointier front'], ['size', 'sized against real hands'], ['#45', 'EMG to check every iteration']] });
    const ks = ep(t, 1.0, 1.7); part(1440, 600, 24, () => groovePart(t), { alpha: ks });
    if (t > 2.2) { const a4 = ep(t, 2.2, 2.7), xm = 6.5 * Math.sin((t - 2.2) * 0.7), ym = -0.035 * xm * xm, nl = Math.hypot(0.07 * xm, 1), ux = -0.07 * xm / nl, uy = -1 / nl, R = 2.2; fingerAt(1440 + (xm + ux * R) * 24, 600 + (ym + uy * R) * 24, R * 24, a4 * 0.95); }
    figLabel(t, 2.0, 1130, 920, 13, 'A slice through a grip surface');
  }
});
function fingerAt(x, y, r, a) { G.save(); G.globalAlpha = a; const g = G.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r); g.addColorStop(0, '#e2b39b'); g.addColorStop(1, '#c48a72'); G.beginPath(); G.arc(x, y, r, 0, TAU); G.fillStyle = g; G.fill(); G.strokeStyle = 'rgba(120,70,50,0.8)'; G.lineWidth = 1.5; G.stroke(); G.restore(); }
S({
  id: 'grooves', ch: 'shape', theme: 'night', title: 'curves that push the hand on, not off', settle: 9, ideas: ['newton', 47, 42], src: ['kuijt'],
  draw: t => {
    header(t, 'curves that push the hand on, not off');
    const wx = LM, wy = 272, ww = 1100, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const panel = (cx, sign, label, col, t0) => {
      /* a generic surface slice: convex (sign -1) or concave (sign +1) */
      const sc = 24, k = ep(t, t0, t0 + 0.6), y0 = wy + 330;
      const f = x => sign * 0.035 * x * x;
      part(cx, y0, sc, () => solid(() => { G.beginPath(); for (let x = -10; x <= 10; x += 0.2) G.lineTo(x, f(x)); for (let x = 10; x >= -10; x -= 0.2) G.lineTo(x, f(x) + 1.4); G.closePath(); }, MT.shell, [-10, -4, 20, 6], { hatch: true }), { alpha: k });
      /* a fingertip that settles where the surface sends it */
      /* after the first pass the finger is set down again every 6 s and the surface decides again */
      const lc = t >= 9 ? (t - 9) % 6 : -1, fk = lc >= 0 ? ep(lc, 0, 0.35) * (1 - ep(lc, 5.5, 6)) : 1 - ep(t, 8.6, 9);
      const u0 = 3.2, tt = lc >= 0 ? Math.max(0, lc - 0.6) : Math.max(0, t - t0 - 1.2), u = sign < 0 ? u0 * Math.exp(-tt * 1.1) * Math.cos(tt * 2.2) : Math.min(8.6, u0 * Math.exp(tt * 0.45));
      const slope = 2 * sign * 0.035 * u, nx = -slope, ny = 1, nl = Math.hypot(nx, ny), r = 2.4;
      const fx = cx + (u - nx / nl * r) * sc, fy = y0 + (f(u) - ny / nl * r) * sc - (lc >= 0 ? (1 - ep(lc, 0, 0.5, E.out3)) * 40 : 0);
      fingerAt(fx, fy, r * sc, k * fk);
      const px = cx + u * sc, py = y0 + f(u) * sc, Ln = 110;
      arrow(px, py, px - nx / nl * Ln * 0.01 - nx / nl * Ln, py - ny / nl * Ln, { color: col, w: 3.5, hs: 13, alpha: ep(t, t0 + 0.8, t0 + 1.2) * fk });
      const side = -nx / nl * Ln; arrow(px, py - 4, px + side, py - 4, { color: col, w: 3, hs: 11, alpha: ep(t, t0 + 1.0, t0 + 1.4) * (Math.abs(side) > 6 ? 1 : 0) * fk });
      text(label, cx, wy + 76, { role: 'label', color: col, align: 'center', t, t0, cps: 60, maxW: 420 });
    };
    panel(wx + 290, 1, 'convex: the push points outward', C.red, 0.6);
    panel(wx + 810, -1, 'concave: the push points to the middle', A, 1.0);
    text('Sideways share of the push: N · sin θ, θ the tilt under the finger', wx + ww / 2, wy + wh - 26, { role: 'small', size: 22, color: C.mute, align: 'center', alpha: ep(t, 3.0, 3.4) });
    const rx = 1230, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('what follows from it', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['derived'], ep(t, 1.0, 1.4));
    const notes = [['a convex side sheds the finger in a lift. a shallow groove holds it, like a ball in a bowl.', C.ink], ['grooves stay shallow near the front, so the front cutouts can stay flat (#47).', C.ink2], ['shoulders rounded but defined, so the ring finger has a place to rest (#42).', C.ink2], ['the counterpoint: hand-tool research asks for smooth grips without finger holes, since one shape won\'t suit every hand, so wide and shallow beats deep.', C.mute]];
    let ny2 = wy + 130; notes.forEach(([s2, col], i) => { const r = text(s2, rx + 28, ny2, { role: 'label', color: col, t, t0: 1.8 + i * 0.8, cps: 90, maxW: rw - 56, lh: 1.42 }); ny2 += Math.max(r.h, 22) + 20; });
    gloss(t, 2.6, 'normal force', 'a surface can only push straight out of itself. tilt the surface and part of that push turns sideways, toward or away from the middle.');
    featureCard(t, 4.6, 'curves checked by their forces', ['derived', 'proposal'], 'a Newtonian check on every surface the fingers rest on, shallow front grooves (#47), defined shoulders (#42).');
    captions(t, [[0.6, 'every surface the finger presses on pushes back at a right angle to itself. that push decides where the finger ends up.'], [3.4, 'on a convex curve, part of it points outward, so in a fast lift the finger slides off. in a shallow groove it points to the middle and the finger settles.']]);
  }
});
S({
  id: 'size', ch: 'shape', theme: 'paper', title: 'sized against real hands', settle: 9, ideas: ['size', 40, 38, 39, 43], src: ['ansur', 'elo', 'tpuGpx2front', 'mzl', 'coelho'],
  draw: t => {
    header(t, 'sized against real hands');
    const wx = LM, wy = 272, ww = 1060, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('mouse length as a share of the average male hand (193.7 mm, ANSUR II)', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 1.0, 1.4));
    const m = axes(t, { x: wx + 80, y: wy + 120, w: ww - 140, h: 230, xr: [112, 130], yr: [0, 1], xticks: [112, 115, 118, 121, 124, 127, 130], yticks: [], xfmt: v => v + ' mm', xlabel: 'length', t0: 1.0 });
    const band = ep(t, 3.2, 3.8); rect(m.X(120.0), wy + 120, (m.X(122.5) - m.X(120.0)) * band, 230, { fill: rgba(A, 0.18) });
    if (band > 0.5) text('target: 2 to 4% under the benchmarks', m.X(121.25), wy + 140, { role: 'label', color: A, align: 'center' });
    const mice = [['G Pro X Superlight 2', 125.0, C.ink, 0.72], ['Viper V3 Pro', 127.1, C.ink, 0.52], ['UltralightX M', 121.3, C.gray, 0.34], ['60% rule (a heuristic)', 116.2, C.mute, 0.6]];
    mice.forEach(([l, v, col, h], i) => { const k = ep(t, 1.6 + i * 0.3, 2.0 + i * 0.3, E.snap), x = m.X(v), y1 = m.Y(0), y0 = m.Y(h); line(x, y1, x, lerp(y1, y0, k), { color: col, w: 3, dash: i === 3 ? [6, 5] : null }); circle(x, y0, 6, { fill: col, alpha: k }); text(l, x + 10, y0 - 4, { role: 'label', size: 20, color: col, alpha: k }); text((v / 193.7 * 100).toFixed(1) + '%', x + 10, y0 + 20, { role: 'num', size: 21, color: C.mute, alpha: k }); });
    rule(wx + 28, wy + 430, wx + ww - 28, ep(t, 4.0, 4.4));
    text('front height (#40): G Pro X Superlight 2 12 mm, Xtrfy MZ1 11 mm. a lower front puts the fingers closer to the pad and lets a small mouse fit a big hand.', wx + 28, wy + 470, { role: 'label', color: C.ink, t, t0: 4.2, cps: 90, maxW: ww - 56, lh: 1.45 });
    const rx = 1190, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('the shape rules, in words', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['proposal'], ep(t, 1.0, 1.4));
    const notes = [['#38', 'a straighter, pointier front'], ['#39', 'less front flare, sides straight from above'], ['#43', 'the hump a touch wider, the grip width thinner underneath'], ['brainstorm', 'sides tapered on their own, semi-symmetric, like the MZ1']];
    notes.forEach(([n, s2], i) => { const y = wy + 140 + i * 74, k = ep(t, 1.6 + i * 0.3, 2.0 + i * 0.3); text(n, rx + 28, y, { role: 'label', color: A, alpha: k }); text(s2, rx + 28, y + 24, { role: 'label', color: C.ink2, alpha: k, maxW: rw - 56, lh: 1.35 }); });
    text('hand size changed muscle activity more than mouse geometry did (Coelho 2021), so the size is the first decision.', rx + 28, wy + 470, { role: 'small', color: C.mute, t, t0: 4.6, cps: 100, maxW: rw - 56, lh: 1.45 });
    gloss(t, 2.8, 'ANSUR II', 'the US Army\'s anthropometric survey: thousands of measured bodies, including hand length and breadth.');
    featureCard(t, 5.4, 'sized to the hand', ['derived', 'proposal'], '2 to 4% smaller than the popular benchmarks, a lower front (#40), and the shape rules (#38, #39, #43).');
    captions(t, [[0.6, 'the popular flagships run between 62 and 66% of the average male hand. the target sits just under them.'], [4.2, 'and since the outline will change, what stays fixed are the rules: a lower front, less flare, a straighter nose.']]);
  }
});
S({
  id: 'emg', ch: 'shape', theme: 'night', title: 'measure the strain, then the shape', settle: 9, ideas: [45], src: ['wang23', 'liwang', 'tang23'],
  draw: t => {
    header(t, 'measure the strain, then the shape');
    const wx = LM, wy = 272, ww = 1000, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('surface EMG, two forearm muscles, a flick task', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    text('signal illustrative', wx + ww - 28, wy + 44, { role: 'small', color: C.faint, align: 'right', alpha: ep(t, 1.0, 1.4) });
    const traces = [['extensor digitorum', C.red, 1.0], ['extensor carpi radialis', A, 0.7]];
    traces.forEach(([l, col, amp], i) => {
      const y0 = wy + 150 + i * 150, x0 = wx + 230, x1 = wx + ww - 40, k = ep(t, 1.0 + i * 0.3, 1.4 + i * 0.3);
      text(l, wx + 28, y0 + 6, { role: 'label', color: col, alpha: k });
      G.save(); G.globalAlpha = k; G.beginPath(); G.strokeStyle = col; G.lineWidth = 1.5;
      for (let x = x0; x <= x1; x += 1.5) { const u = (x - x0) / (x1 - x0), tt = u * 6 + t * 0.8, burst = Math.pow(Math.max(0, Math.sin(tt * 2.1)), 6), n = Math.sin(x * 12.9898 + Math.floor(t * 30) * 0.7) * 43758.5453 % 1, v = (0.15 + burst) * amp * n * 46; x === x0 ? G.moveTo(x, y0 + v) : G.lineTo(x, y0 + v); }
      G.stroke(); G.restore();
    });
    rule(wx + 28, wy + 400, wx + ww - 28, ep(t, 2.6, 3.0));
    text('in pro Overwatch players, those two muscles carried over 5% of their maximum force the whole time they played. 6 of the 10 muscles measured sat above 2% (Wang 2023, n = 16).', wx + 28, wy + 440, { role: 'label', color: C.ink, t, t0: 2.8, cps: 90, maxW: ww - 56, lh: 1.45 });
    const rx = 1130, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('a test that can actually rank shapes', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['study'], ep(t, 1.0, 1.4));
    const steps = [['16 players or more', 'split by hand size and grip, since medium hands are the most sensitive to shape'], ['EMG on the forearm', 'static load and fatigue across a session'], ['aim: Fitts throughput', 'bits per second on a fixed task, about 6.9 for pros'], ['a comfort rating', 'because EMG alone missed 5 mm hump changes that comfort scores caught (Li & Wang 2025, n = 10)']];
    steps.forEach(([a, b], i) => { const y = wy + 120 + i * 98, k = ep(t, 1.6 + i * 0.4, 2.0 + i * 0.4); rr(rx + 28, y, rw - 56, 80, 10, inkA(0.05), inkA(0.15), 1.2, k); text(a, rx + 46, y + 28, { role: 'label', color: A, alpha: k }); text(b, rx + 46, y + 52, { role: 'small', color: C.ink2, alpha: k, maxW: rw - 92, lh: 1.3 }); });
    gloss(t, 2.4, 'EMG', 'electromyography: electrodes on the skin read the electrical activity of the muscle underneath. the doc said EKG, which reads the heart.');
    featureCard(t, 4.6, 'EMG on every iteration', ['study', 'proposal'], 'muscle strain measured on each shape revision (#45), with comfort and aim scored alongside it.');
    captions(t, [[0.6, 'the forearm extensors work the hardest when you aim, and they do it without a break.'], [3.0, 'so every shape revision gets measured on real players, with enough of them to see a difference, and with comfort and aim scored next to the EMG.']]);
  }
});

/* ============================== ownership ============================== */
S({
  id: 'owncard', ch: 'own', card: true, theme: 'night', title: 'ownership', settle: 5,
  draw: t => {
    chapterCard(t, { name: 'ownership', gloss: 'opening it, fixing it, unboxing it, and the number on it that is yours.', list: [['#9', 'one screw type, any driver'], ['#73', 'the right driver in the box'], ['#71', 'a battery you can swap'], ['#51', 'wires instead of ribbon cables'], ['#31', 'a modular bottom plate'], ['#72', 'an envelope and a trifold'], ['#36', 'your serial on the right click']] });
    const turn = t < 2 ? 0 : (t - 2) * 0.7 + 0.25 * Math.sin((t - 2) * 2.2), ko = ep(t, 1.0, 1.6);
    part(1500, 600, 56, () => screwHeadMM(), { alpha: ko, rot: turn });
    if (t > 2) { const a3 = ep(t, 2.0, 2.5), ang = turn % TAU; G.save(); G.globalAlpha = a3 * 0.8; G.strokeStyle = acc(); G.lineWidth = 3; G.beginPath(); G.arc(1500, 600, 190, ang - 0.9, ang + 0.2); G.stroke(); const ex2 = 1500 + Math.cos(ang + 0.2) * 190, ey2 = 600 + Math.sin(ang + 0.2) * 190, tx = -Math.sin(ang + 0.2), ty2 = Math.cos(ang + 0.2); G.fillStyle = acc(); G.beginPath(); G.moveTo(ex2 + tx * 14, ey2 + ty2 * 14); G.lineTo(ex2 - ty2 * 8, ey2 + tx * 8); G.lineTo(ex2 + ty2 * 8, ey2 - tx * 8); G.closePath(); G.fill(); G.restore(); }
    figLabel(t, 2.0, 1130, 920, 14, 'An M2 screw head');
  }
});
S({
  id: 'repair', ch: 'own', theme: 'paper', title: 'made to be opened', settle: 9, ideas: [9, 73, 71, 51, 69, 31, 100, 54], src: ['ikea', 'ifixit', 'dfma', 'gremlin'],
  draw: t => {
    header(t, 'made to be opened');
    const wx = LM, wy = 272, ww = 860, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    part(wx + 240, wy + 330, 30, () => insertMM({ k: t < 3.4 ? ep(t, 0.8, 2.2, E.io3) : 1 - 0.7 * pingpong(t - 3.4, 6) }), { alpha: ep(t, 0.4, 0.9) });
    part(wx + 620, wy + 200, 48, () => screwHeadMM(), { alpha: ep(t, 0.8, 1.2) });
    text('Machine screw into brass (#9, #101)', wx + 70, wy + 480, { role: 'label', size: 20, color: A, alpha: ep(t, 1.4, 1.8) });
    text('Opens and closes without wearing the plastic', wx + 70, wy + 514, { role: 'small', size: 22, color: C.mute, alpha: ep(t, 1.6, 2.0) });
    text('cross and slot', wx + 620, wy + 330, { role: 'label', color: A, align: 'center', alpha: ep(t, 1.4, 1.8) });
    text('The driver in the box matches it (#73)', wx + 620, wy + 372, { role: 'small', size: 22, color: C.mute, align: 'center', maxW: 300, alpha: ep(t, 1.6, 2.0) });
    const rx = 990, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('why it\'s worth designing for', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const bars = [['IKEA effect: what builders would pay for what they built', 63, '+63%', A, 'study'], ['would buy the brand again after a successful repair', 95, '95%', C.ink, 'survey'], ['say repairability matters when they buy', 93, '93%', C.ink, 'survey']];
    bars.forEach(([l, v, lab, col, ev], i) => { const y = wy + 120 + i * 88, k = ep(t, 1.4 + i * 0.3, 2.2 + i * 0.3, E.snap); text(l, rx + 28, y, { role: 'label', color: C.ink2, alpha: ep(t, 1.2 + i * 0.3, 1.6 + i * 0.3), maxW: rw - 160 }); rect(rx + 28, y + 16, (rw - 190) * v / 100 * k, 18, { fill: col }); text(lab, rx + 28 + (rw - 190) * v / 100 * k + 10, y + 31, { role: 'label', color: col, alpha: k }); });
    text('the IKEA effect only holds when the job succeeds, so the mod has to be hard to fail: wires instead of ribbon cables that tear (#51, #69), the battery plug turned sideways (#71), ON and OFF printed on the switch (#100).', rx + 28, wy + 400, { role: 'label', color: C.ink, t, t0: 3.4, cps: 100, maxW: rw - 56, lh: 1.45 });
    text('iFixit\'s sample is self-selected: people who already repair.', rx + 28, wy + 536, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 4.4, 4.8), maxW: rw - 56 });
    gloss(t, 2.6, 'IKEA effect', 'people value things they built themselves more than the same thing built for them. it disappears if the build fails.');
    featureCard(t, 5.2, 'built to come apart', ['study', 'survey', 'proposal'], 'one screw type (#9), the driver included (#73), a modular bottom plate (#31), the board mounted to the top shell with screws from below (#54).');
    captions(t, [[0.6, 'a mouse you can open is a mouse you can keep. the cost is in the details: screws, connectors, and what tears when the shell comes off.'], [3.6, 'people value what they fixed themselves, but only when the fix works. so everything inside is chosen so the first repair goes right.']]);
  }
});
S({
  id: 'box', ch: 'own', theme: 'night', title: 'the box is the first thing they open', settle: 9, ideas: [72, 74, 13, 62, 63], src: ['knight', 'dotcom', 'gmk'],
  draw: t => {
    header(t, 'the box is the first thing they open');
    const wx = LM, wy = 272, ww = 860, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    /* an envelope opens, the trifold slides out, and unfolds into a standing display */
    const k = ep(t, 0.6, 1.2), flap = ep(t, 1.2, 2.0, E.io3), lift = ep(t, 2.0, 2.9, E.cam), open = ep(t, 2.9, 4.2, E.io3);
    const cx = wx + ww / 2, ey = wy + 400, ew = 560, eh = 150, pw = 176, ph = 236, ty0 = ey - ph / 2 + 30 - lift * 236;
    const paperC = TH ? '#ffffff' : '#1f2024', ink3 = inkA(0.5), envC = TH ? '#e7e6e1' : '#2b2c31';
    /* the envelope's back */
    rr(cx - ew / 2, ey - eh / 2, ew, eh, 8, envC, inkA(0.25), 1.5, k);
    /* the trifold: three panels on two hinges; the outer two swing open in perspective */
    const face = (x0, x1, yc, hh, fill, draw) => { G.save(); G.globalAlpha = k; G.beginPath(); G.moveTo(x0[0], yc - x0[1] / 2); G.lineTo(x1[0], yc - x1[1] / 2); G.lineTo(x1[0], yc + x1[1] / 2); G.lineTo(x0[0], yc + x0[1] / 2); G.closePath(); G.fillStyle = fill; G.fill(); G.strokeStyle = inkA(0.3); G.lineWidth = 1.5; G.stroke(); G.clip(); if (draw) draw(); G.restore(); };
    const yc = ty0 + ph / 2, sw = open, outerH = ph * (1 - 0.16 * (1 - sw));
    const flapPath = fy => { G.beginPath(); G.moveTo(cx - ew / 2, ey - eh / 2); G.lineTo(cx, fy); G.lineTo(cx + ew / 2, ey - eh / 2); G.closePath(); };
    const fyy = lerp(ey + 24, ey - eh / 2 - 96, flap);
    if (flap >= 0.5) { G.save(); G.globalAlpha = k; flapPath(fyy); G.fillStyle = TH ? '#d9d8d3' : '#25262a'; G.fill(); G.strokeStyle = inkA(0.25); G.lineWidth = 1.5; G.stroke(); G.restore(); }
    G.save(); if (lift < 1) { G.beginPath(); G.rect(wx, wy, ww, ey + eh / 2 - 4 - wy); G.clip(); }
    const ca = clamp((open - 0.75) / 0.25);
    face([cx - pw / 2, ph], [cx + pw / 2, ph], yc, ph, paperC, () => {
      text('the mouse', cx, yc - 74, { role: 'label', color: A, align: 'center', alpha: k });
      rr(cx - 52, yc - 50, 104, 120, 30, inkA(0.06), inkA(0.25), 1.2, k);
      text('in its tray', cx, yc + 14, { role: 'small', color: C.mute, align: 'center', alpha: k });
      for (let i = 0; i < 4; i++) circle(cx - 36 + i * 24, yc + 96, 6, { fill: TH ? '#ffffff' : '#e7e6e1', color: inkA(0.3), w: 1, alpha: k });
      text('spare dots', cx, yc + 116, { role: 'small', color: C.mute, align: 'center', alpha: k });
    });
    if (sw > 0.01) {
      face([cx - pw / 2, ph], [cx - pw / 2 - pw * sw, outerH], yc, ph, paperC, ca > 0 ? () => {
        const lx = cx - pw / 2 - pw * 0.5; G.globalAlpha = k * ca;
        text('setup', lx, yc - 84, { role: 'label', color: A, align: 'center', alpha: k * ca });
        const qr = rng(42); for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) { const fin = (i < 3 && j < 3) || (i > 5 && j < 3) || (i < 3 && j > 5); if (fin ? !((i % 6 === 1 || i === 1) && (j % 6 === 1 || j === 1)) : qr() < 0.5) rect(lx - 36 + i * 8, yc - 66 + j * 8, 7, 7, { fill: C.ink, alpha: k * ca }); }
        ['1  plug both in', '2  open the web app', '3  done'].forEach((l2, i) => text(l2, lx - 66, yc + 30 + i * 22, { role: 'label', color: C.ink2, alpha: k * ca }));
      } : null);
      face([cx + pw / 2, ph], [cx + pw / 2 + pw * sw, outerH], yc, ph, paperC, ca > 0 ? () => {
        const rx2 = cx + pw / 2 + pw * 0.5;
        text('inside', rx2, yc - 84, { role: 'label', color: A, align: 'center', alpha: k * ca });
        for (let i = 0; i < 6; i++) { const sx = rx2 - 44 + (i % 3) * 44, sy = yc - 44 + Math.floor(i / 3) * 52; part(sx, sy, 5.2, () => screwHeadMM(), { alpha: k * ca }); text(String(i + 1), sx + 14, sy - 10, { role: 'label', color: A, alpha: k * ca }); }
        ['M2 × 6, one driver', 'Battery: slide, lift', 'Rim: slides off'].forEach((l2, i) => text(l2, rx2 - 66, yc + 62 + i * 24, { role: 'label', size: 19, color: C.ink2, alpha: k * ca }));
      } : null);
    }
    G.restore();
    /* the envelope's front and its flap, drawn over the trifold until it has slid out */
    G.save(); G.globalAlpha = k;
    G.beginPath(); G.moveTo(cx - ew / 2, ey - eh / 2 + 10); G.lineTo(cx, ey + 16); G.lineTo(cx + ew / 2, ey - eh / 2 + 10); G.lineTo(cx + ew / 2, ey + eh / 2 - 8); G.quadraticCurveTo(cx + ew / 2, ey + eh / 2, cx + ew / 2 - 8, ey + eh / 2); G.lineTo(cx - ew / 2 + 8, ey + eh / 2); G.quadraticCurveTo(cx - ew / 2, ey + eh / 2, cx - ew / 2, ey + eh / 2 - 8); G.closePath();
    G.fillStyle = envC; G.fill(); G.strokeStyle = inkA(0.25); G.lineWidth = 1.5; G.stroke();
    if (flap < 0.5) { flapPath(fyy); G.fillStyle = TH ? '#efeeea' : '#323338'; G.fill(); G.stroke(); }
    G.restore();
    text('paper only: no plastic tray, no foam', cx, ey + eh / 2 + 30, { role: 'label', color: C.mute, align: 'center', alpha: ep(t, 4.4, 4.8) });
    text('an envelope, and a trifold that is the display and the manual (#72)', wx + 28, wy + wh - 24, { role: 'label', color: C.ink2, alpha: ep(t, 2.6, 3.0) });
    const rx = 990, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('a workspace you arranged yourself', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['study'], ep(t, 1.0, 1.4)); text('Knight & Haslam 2010, 2,000+ office workers', rx + 28, wy + 86, { role: 'small', size: 22, maxW: rw - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const bars = [['lean office', 0, C.gray], ['decorated for you', 17, C.ink], ['decorated by you', 32, A]];
    bars.forEach(([l, v, col], i) => { const y = wy + 130 + i * 60, kk = ep(t, 1.4 + i * 0.3, 2.2 + i * 0.3, E.snap); text(l, rx + 28, y + 6, { role: 'label', color: C.ink2, alpha: kk }); rect(rx + 250, y - 9, Math.max(3, (rw - 380) * v / 35) * kk, 18, { fill: col }); text(v ? '+' + v + '%' : 'Baseline', rx + 250 + (rw - 380) * v / 35 * kk + 10, y + 8, { role: 'num', size: 22, color: col, alpha: kk }); });
    text('choosing your setup mattered more than decoration. colorways matched to GMK keycap sets (#13) let people build the desk they want; those sets run about $200.', rx + 28, wy + 340, { role: 'label', color: C.ink, t, t0: 3.2, cps: 100, maxW: rw - 56, lh: 1.45 });
    text('packaging survey (a vendor\'s, sample not given): 52% likelier to buy again with premium packaging, 60% care that it\'s sustainable. paper, not a plastic tray.', rx + 28, wy + 450, { role: 'small', color: C.mute, t, t0: 4.4, cps: 110, maxW: rw - 56, lh: 1.45 });
    gloss(t, 2.8, 'trifold', 'a card folded in three. closed it holds the mouse in place; opened it stands up as a display, with the setup and repair steps printed inside.');
    featureCard(t, 5.4, 'packaging that keeps', ['study', 'survey', 'proposal'], 'envelope and trifold (#72), a thin custom battery cover (#74), GMK-matched colorways (#13), LT and RT legends (#62), art on the PCB (#63).');
    captions(t, [[0.6, 'the first thing anyone touches is the box, so it should be as considered as the mouse.'], [3.4, 'and the best-supported finding on desks is about choice: people did better in a space they arranged themselves.']]);
  }
});
S({
  id: 'serial', ch: 'own', theme: 'paper', title: 'a number that\'s yours', settle: 9, ideas: [36], src: ['scarcity', 'ladeira', 'ulxComp'],
  draw: t => {
    header(t, 'a number that\'s yours');
    const wx = LM, wy = 272, ww = 860, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    /* the right click, a patch of it from above, with the serial lasered in */
    const k = ep(t, 0.5, 1.0), px = wx + 120, py = wy + 70, pw2 = 620, ph2 = 260;
    part(0, 0, 1, () => { solid(() => pathRR(px, py, pw2, ph2, 24), { g: ['#3b3c42', '#2a2b30'], dark: 1 }, [px, py, pw2, ph2], { lw: 1.4 }); G.save(); pathRR(px, py, pw2, ph2, 24); G.clip(); const r = rng(9); G.fillStyle = 'rgba(255,255,255,0.035)'; for (let i = 0; i < 2600; i++) G.fillRect(px + r() * pw2, py + r() * ph2, 1.4, 1.4); G.restore(); }, { alpha: k });
    /* after the first one, the next units come off the line: the last number clears and the laser writes the next */
    const lc = t >= 9 ? (t - 9) % 6 : -1, idx = lc >= 0 ? Math.floor((t - 9) / 6) + 1 : 0, sn = i => String(42 + (i % 9)).padStart(3, '0');
    const engr = lc >= 0 ? ep(lc, 0.7, 2.1, E.lin) : ep(t, 1.2, 2.6, E.lin), num = sn(idx);
    G.save(); G.globalAlpha = k; setFont({ size: 150, weight: 800 }); G.textAlign = 'center';
    const glyph = (s2, a2) => { G.save(); G.globalAlpha = k * a2; G.fillStyle = 'rgba(236,235,231,0.16)'; G.fillText(s2, px + pw2 / 2, py + 190); G.fillStyle = 'rgba(0,0,0,0.25)'; G.fillText(s2, px + pw2 / 2 + 2, py + 192); G.fillStyle = 'rgba(236,235,231,0.10)'; G.fillText(s2, px + pw2 / 2, py + 190); G.restore(); };
    if (lc >= 0 && lc < 0.6) glyph(sn(idx - 1), 1 - ep(lc, 0, 0.55));
    G.save(); G.beginPath(); G.rect(px, py, pw2 * engr + 1, ph2); G.clip(); glyph(num, 1); G.restore();
    if (lc >= 0) text('unit ' + num, px + pw2 - 24, py + 40, { role: 'label', color: 'rgba(236,235,231,0.55)', align: 'right', alpha: k * ep(lc, 2.0, 2.4) * (1 - ep(lc, 5.4, 5.9)) });
    if (engr > 0 && engr < 1) { const lx = px + pw2 * engr, ly = py + 128 + 52 * Math.sin(t * 38); warm(lx, ly, 46, '#ffffff', 0.35); warm(lx, ly, 18, A, 0.9); line(lx, py, lx, py + ph2, { color: A, w: 1.5, alpha: 0.5 }); const rs = rng(Math.floor(t * 30)); for (let i = 0; i < 7; i++) { const ang = -Math.PI / 2 + (rs() - 0.5) * 2.2, d = 6 + rs() * 26; circle(lx + Math.cos(ang) * d, ly + Math.sin(ang) * d, 1.6, { fill: '#ffe7b0', alpha: 0.8 * (1 - d / 34) }); } }
    G.restore();
    text('Illustration: lasered under the clear coat, so it can\'t be felt', wx + 28, wy + wh - 24, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 2.6, 3.0), maxW: ww - 56 });
    /* the section: engraving filled flush by the clear coat */
    part(wx + 230, wy + 430, 22, () => { solid(() => { G.beginPath(); G.moveTo(0, 0); G.lineTo(7, 0); G.lineTo(7.4, 0.6); G.lineTo(9.6, 0.6); G.lineTo(10, 0); G.lineTo(18, 0); G.lineTo(18, 1.6); G.lineTo(0, 1.6); G.closePath(); }, MT.shell, [0, 0, 18, 1.6], { hatch: true }); G.beginPath(); G.moveTo(0, 0); G.lineTo(7, 0); G.lineTo(7.4, 0.6); G.lineTo(9.6, 0.6); G.lineTo(10, 0); G.lineTo(18, 0); G.lineTo(18, -0.35); G.lineTo(0, -0.35); G.closePath(); G.fillStyle = 'rgba(200,215,232,0.45)'; G.fill(); G.strokeStyle = inkA(0.5); G.lineWidth = lw(1); G.stroke(); }, { alpha: ep(t, 3.0, 3.4) });
    text('clear coat fills the engraving flush', wx + 640, wy + 440, { role: 'label', color: A, alpha: ep(t, 3.2, 3.6), maxW: 200 });
    const rx = 990, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('scarcity and wanting it, meta-analyses', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['study'], ep(t, 1.0, 1.4)); text('effect size on purchase intention', rx + 28, wy + 86, { role: 'small', size: 22, maxW: rw - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const bars = [['all scarcity cues, 131 studies', 0.31, C.ink], ['limited supply, for things you enjoy', 0.55, A], ['scarce because others bought it', 0.17, C.gray], ['with a visible social signal', 0.46, A]];
    bars.forEach(([l, v, col], i) => { const y = wy + 130 + i * 70, kk = ep(t, 1.4 + i * 0.25, 2.2 + i * 0.25, E.snap); text(l, rx + 28, y, { role: 'label', color: C.ink2, alpha: ep(t, 1.2 + i * 0.25, 1.6 + i * 0.25), maxW: rw - 56 }); rect(rx + 28, y + 14, (rw - 180) * v / 0.6 * kk, 18, { fill: col }); glint(rx + 28, y + 14, (rw - 180) * v / 0.6 * kk, 18, t, 5 + i * 0.25, 8); text('d = ' + v.toFixed(2), rx + 28 + (rw - 180) * v / 0.6 * kk + 10, y + 29, { role: 'label', color: col, alpha: kk }); });
    text('a serial marks a numbered run, and it shows. the same research warns it backfires when it reads as hype, so the numbers are for owners, not for scalpers.', rx + 28, wy + 440, { role: 'label', color: C.ink, t, t0: 3.6, cps: 100, maxW: rw - 56, lh: 1.45 });
    keyPlan(t, 1.0, wx + ww - 80, wy + 140, { s: 0.5, hi: 'trigR', label: 'Right click' });
    gloss(t, 2.8, 'effect size', 'how big a difference is, in standard deviations. 0.2 is small, 0.5 is medium. a limited run for a product you enjoy lands around medium.');
    featureCard(t, 5.0, 'a lasered serial', ['study', 'proposal'], 'three digits, laser-engraved large on the right click (#36), sealed under the clear coat.');
    captions(t, [[0.6, 'a numbered run is a small thing that makes one mouse yours instead of one of many.'], [3.6, 'the research supports it for things people enjoy owning, as long as it stays honest.']]);
  }
});

/* ============================== close ============================== */
S({
  id: 'close', ch: 'end', theme: 'night', title: 'Close', settle: 8,
  draw: t => {
    const figs = [
      (x, y) => drawSwitch(x - 6.4 * 9, y + 14, 9, { clear: true, press: clickCurve(cyc(t, 3, 3)), accent: C.blue }),
      (x, y) => drawSkate(x, y, 8, { sink: 0.22 + 0.12 * (0.5 + 0.5 * Math.sin(t * 1.5)) }),
      (x, y) => drawSensor(x, y + 4, 7.2, { accent: C.green, lift: 0.18 * Math.sin(t * 0.9) }),
      (x, y) => part(x, y + 26, 10, () => insertMM({ k: 0.55 + 0.45 * pingpong(t, 6) })),
      (x, y) => part(x, y, 5.6, () => wheelSideMM({ rot: t * 0.3 })),
      (x, y) => part(x, y, 4.2, () => boardMM({})),
      (x, y) => part(x, y, 4.6, () => dongleMM({ lines: [{ t: '8000 Hz', s: 3.4, y: 4.6 }], cables: false })),
      (x, y) => part(x, y, 30, () => screwHeadMM(), { rot: t * 0.5 })
    ];
    /* the parts, in a 4 × 2 grid of registration frames, each with its figure number */
    const names = ['Switch', 'Skate', 'Sensor', 'Insert', 'Wheel', 'Board', 'Receiver', 'Screw'];
    figs.forEach((f, i) => {
      const col = i % 4, row = Math.floor(i / 4), cw = 200, x0 = 1040 + col * cw, y0 = 250 + row * 300, x = x0 + cw / 2, y = y0 + 120 + Math.sin(t * 0.7 + i * 0.8) * 3, k = ep(t, 0.6 + i * 0.15, 1.2 + i * 0.15);
      part(0, 0, 1, () => f(x, y), { alpha: k * 0.92 });
      line(x0 + 12, y0 + 226, x0 + cw - 12, y0 + 226, { color: C.hair, w: 1.2, p: k });
      text('Fig. ' + pad2(i + 1), x0 + 12, y0 + 256, { role: 'label', size: 19, color: C.faint, alpha: k });
      text(names[i], x0 + 12, y0 + 284, { role: 'label', size: 20, color: C.ink2, alpha: k });
    });
    /* the quote, Kunai's pull-quote: a bar on its left */
    const Q = 'If there\'s something you can do to improve your product that others aren\'t doing just because it takes too much time, that\'s one of the most valuable things you can implement to show you care.';
    const qs = { role: 'h3', size: 40, weight: 700, color: C.ink, sentence: false, maxW: 820, lh: 1.3 }, qn = wrap(Q, qs, 820).length, qa = 300 + (qn - 1) * 52 + 66;
    rect(LM, 262, 6, (qa + 18 - 262) * ep(t, 1.0, 1.6, E.out3), { fill: YEL });
    text(Q, LM + 40, 300, Object.assign({ t, t0: 1.2, cps: 60 }, qs));
    text('Brock Liddicoat', LM + 40, qa, { role: 'label', size: 22, color: C.mute, t, t0: 5.0, cps: 60 });
    /* the sign-off: the name again, small and certain */
    line(LM, 800, LM + 860 * ep(t, 5.4, 6.4, E.cam), 800, { color: C.hair, w: 1.5 });
    text('Theseus', LM - 4, 912, { role: 'd2', size: 96, color: C.ink, t, rise: [5.8, 0.9] });
    text('A Nitrite Labs mouse, in development for years.', LM, 966, { role: 'small', size: 25, color: C.ink2, t, t0: 6.4, cps: 60 });
  }
});
