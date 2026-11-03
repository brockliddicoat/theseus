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

