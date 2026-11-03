/* parts test bench: each part large, both grounds */
const DECK = { chapters: [{ key: 'click', name: 'Clicks' }, { key: 'glide', name: 'Glide' }, { key: 'shell', name: 'Shell' }, { key: 'surface', name: 'Surface' }, { key: 'elec', name: 'Electronics' }], slides: [] };
const S = o => (DECK.slides.push(o), o);
const BENCH = [
  ['switch', 'click', t => { const p = clamp(Math.sin(t * 1.3) * 0.6 + 0.5); drawSwitch(250, 760, 46, { press: 0.2, clear: true }); drawSwitch(1000, 760, 46, { press: 0.9, clear: true }); drawSwitch(1500, 760, 22, { press: 0 }); }],
  ['clicksec', 'click', t => { drawClick(560, 420, 19, { press: 1, clear: false, pivot: 1, arc: 1, ghost: 0 }); }],
  ['clicktilt', 'click', t => { drawClick(560, 420, 19, { press: 0, tilt: 1, ghost: 1, bridge: true, pivot: 1 }); }],
  ['skate', 'glide', t => { drawSkate(520, 560, 44, { sink: 0.25 }); drawSkate(1380, 560, 44, { sink: 0.55 }); }],
  ['sensor', 'glide', t => { drawSensor(520, 560, 32, { lift: 0 }); drawSensor(1380, 560, 32, { lift: 1.0 }); }],
  ['wheel', 'surface', t => { part(520, 560, 26, () => wheelSideMM({ rot: t * 0.3 })); part(1360, 560, 26, () => wheelFrontMM({})); }],
  ['insert', 'shell', t => { part(560, 640, 52, () => insertMM({ k: 1 })); part(1360, 560, 90, () => screwHeadMM()); }],
  ['dongle', 'elec', t => { part(960, 560, 24, () => dongleMM({ lines: [{ t: '8000 Hz', s: 3.4, y: 4.8 }, { t: '1600 dpi', s: 2.2, y: 8.6, c: '#9b9a94' }], bat: 0.92 })); }],
  ['board', 'elec', t => { part(960, 560, 30, () => boardMM({})); }],
  ['coat', 'surface', t => { part(400, 300, 18, () => coatMM({})); }],
  ['notch', 'surface', t => { part(200, 500, 44, () => notchMM({ depth: 0.6 })); part(1100, 500, 44, () => notchMM({ depth: 0.3, rho: 0.25 })); }],
  ['rail', 'click', t => { part(520, 520, 30, () => railMM({ press: 0 })); part(1380, 520, 30, () => railMM({ press: 1 })); }],
  ['tens', 'click', t => { part(520, 600, 16, () => tensionerPlanMM({ smile: 1 })); part(1380, 600, 16, () => tensionerPlanMM({ smile: 0 })); }],
  ['plate', 'click', t => { part(800, 930, 13, () => plateMM({})); }],
];
for (const th of ['night', 'paper']) for (const [id, ch, fn] of BENCH) S({ id: id + '-' + th, ch, theme: th, title: id, settle: 4, draw: t => { demoWindow(80, 80, 1760, 920); fn(t); text(id + ' / ' + th, 110, 130, { size: 22, weight: 700, color: C.mute }); } });
const BENCH2 = [
  ['front', 'click', t => { part(500, 520, 30, () => frontStopMM({ press: clamp(Math.sin(t * 2) * 0.5 + 0.5), gapMark: 1 })); part(1350, 520, 34, () => flushMM({ press: 1 })); }],
  ['guide', 'click', t => { part(560, 540, 44, () => guideMM({ press: 0.3, pads: 1, hollow: 1 })); part(1360, 540, 30, () => encoderMM({})); }],
  ['clicklong', 'click', t => { drawClick(560, 420, 19, { press: 0.5, longBoard: true, clear: true }); }],
];
for (const th of ['night', 'paper']) for (const [id, ch, fn] of BENCH2) S({ id: id + '-' + th, ch, theme: th, title: id, settle: 4, draw: t => { demoWindow(80, 80, 1760, 920); fn(t); text(id + ' / ' + th, 110, 130, { size: 22, weight: 700, color: C.mute }); } });
