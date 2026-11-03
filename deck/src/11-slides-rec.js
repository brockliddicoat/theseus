/* ============================================================================================
   recommendations deck: the ideas in the doc that the research contradicted, couldn't confirm,
   or that Brock flagged as unsure, and what I'd change. Each slide: what the doc says, what the
   evidence says, and the change. Written as advice to Brock, not in his voice.
   ============================================================================================ */
const DECK = {
  chapters: [{ key: 'intro', name: 'Recommendations' }, { key: 'glide', name: 'Tracking and glide' }, { key: 'click', name: 'Clicks' }, { key: 'surface', name: 'Shell and surface' }, { key: 'elec', name: 'Electronics' }, { key: 'shape', name: 'Shape' }, { key: 'own', name: 'Claims' }, { key: 'end', name: 'Test plan' }],
  slides: []
};
const S = o => (DECK.slides.push(o), o);
function chapterIdeaCount() { return 0; }
const VERD = { contradicted: () => C.red, contested: () => C.orange, unverified: () => C.gray, keep: () => C.green };
function verdictChip(x, y, v, a = 1) { const col = VERD[v] ? VERD[v]() : C.mute, w = tw(v, { size: 14, weight: 800 }) + 24; rr(x, y - 18, w, 26, 13, rgba(col, 0.16), col, 1.5, a); text(v, x + 12, y, { size: 14, weight: 800, color: col, alpha: a }); return w; }
/** the right-hand panel on every detail slide: the doc, the evidence, the change */
function recPanel(t, x, y, w, h, o) {
  demoWindow(x, y, w, h, ep(t, 0.5, 0.9));
  let cx = x + 28; (Array.isArray(o.verdict) ? o.verdict : [o.verdict]).forEach((v, i) => { cx += verdictChip(cx, y + 46, v, ep(t, 0.8 + i * 0.2, 1.2 + i * 0.2)) + 12; });
  let yy = y + 96;
  const block = (label, body, col, t0) => { text(label, x + 28, yy, { size: 13, weight: 800, color: C.mute, alpha: ep(t, t0, t0 + 0.3), ls: 1 }); const r = text(body, x + 28, yy + 26, { size: 15, weight: col === C.ink ? 800 : 600, color: col, t, t0: t0 + 0.2, cps: 120, maxW: w - 56, lh: 1.42 }); yy += 26 + r.h + 22; };
  block(o.docLabel || 'THE DOC', o.doc, C.ink2, 1.0);
  block('THE EVIDENCE', o.evidence, C.ink2, 2.0);
  block('CHANGE', o.change, C.ink, 3.4);
}
/** a small labelled bar, used in the column slides */
function miniBar(t, t0, x, y, w, v, max, col, label, val) { const k = ep(t, t0, t0 + 0.7, E.snap); text(label, x, y - 10, { size: 13, weight: 700, color: C.mute, alpha: ep(t, t0 - 0.2, t0 + 0.2) }); rect(x, y, w * v / max * k, 14, { fill: col }); text(val, x + w * v / max * k + 10, y + 12, { size: 14, weight: 800, color: col, alpha: k }); }

/* ---------- cover ---------- */
S({
  id: 'cover', ch: 'intro', theme: 'night', title: 'recommendations', settle: 5,
  draw: t => {
    text('a companion to "in pursuit of an objectively better mouse"', LM, 120, { size: 20, weight: 700, color: C.mute, t, t0: 0.05, cps: 60 });
    text('what i\'d change\nbefore it ships', LM, 330, { size: 88, weight: 800, lh: 1.08, ls: -3, t, t0: 0.3, cps: 26, caret: true });
    text('the ideas the research contradicted, couldn\'t confirm, or that you flagged as unsure, with what the evidence says and what to do instead.', LM, 560, { size: 24, weight: 500, color: C.ink2, t, t0: 1.8, cps: 70, maxW: 1100, lh: 1.45 });
    const vs = ['contradicted', 'contested', 'unverified', 'keep'], defs = ['the evidence points the other way', 'studies disagree, or the claim overreaches', 'nothing public confirms it yet', 'right idea; fix the number or the reason'];
    vs.forEach((v, i) => { const y = 760 + i * 48, k = ep(t, 2.6 + i * 0.15, 3.0 + i * 0.15); verdictChip(LM, y, v, k); text(defs[i], LM + 200, y, { size: 17, weight: 600, color: C.mute, alpha: k }); });
    text('prepared for brock liddicoat, nitrite labs', LM, 1030, { size: 16, weight: 600, color: C.faint, t, t0: 3.4, cps: 90 });
  }
});

/* ---------- the overview: every flagged item on one page ---------- */
const REC_ROWS = [
  ['#27', 'move the sensor forward', 'contested', 'a small shift is free; claim the wider arc, not better aim'],
  ['#27', '"up to 14%" from a custom position', 'contradicted', 'quote about 4%; 14% is what the rear end loses'],
  ['weight', '"less weight means less inertia"', 'contested', 'stay light, but sell stiffness and where the mass sits'],
  ['#14', 'hot-swap switches on claw springs', 'contested', 'solder, or swap a switch on its own small board'],
  ['#89', 'haptic motors', 'unverified', 'leave them out of the first model'],
  ['#1', 'ceiling-facing cutouts, "voted 3x"', 'unverified', 'run a blind test before committing'],
  ['#16', '"only diamond" can rub the coating off', 'contradicted', 'quote pencil hardness, tested on the shell'],
  ['#16', 'the coating makes it grippy', 'contested', 'grip comes from the etched texture, so measure it'],
  ['#5', '"three times stronger and stiffer"', 'keep', 'five times stiffer holds; say 2.4 times stronger'],
  ['#6', 'PPS triggers: a metal-like structure', 'unverified', 'record the click before calling it crisper'],
  ['#8', 'POM skates as the default', 'contested', 'POM is the slower glide; sell it as control'],
  ['#30', 'rover-tread wheel texture', 'contested', 'more, gentler ridges, like Perseverance'],
  ['#84', 'magnesium wheel: "all high end mice"', 'unverified', 'prove a benefit before paying for it'],
  ['#76', 'undervolt the sensor', 'contested', 'use the sensor\'s own power modes instead'],
  ['#77', 'nRF54LM20A: fewer parts, less power', 'keep', 'right chip; budget for the PMIC it needs'],
  ['#81', 'Alps encoder, to match the switches', 'contested', 'pick the encoder by skip rate and height'],
  ['#41', 'hump higher and further back', 'contested', 'test it with claw players only'],
  ['#44', 'more contact area, by paint test', 'contested', 'map pressure peaks, not painted area'],
  ['#45', 'EKG monitors for muscle strain', 'contradicted', 'surface EMG, 16 or more players, split by grip'],
  ['#35', 'serial runs ending in 9', 'keep', 'a 999 run reads as hundreds; the left digit backs it'],
  ['ship', 'arrive almost fully charged', 'contested', 'ship near 30%, then make the first charge fast'],
  ['ads', 'people in photos: "up to 30%"', 'contradicted', 'expect 7 to 9%; show a hand on the mouse']
];
S({
  id: 'overview', ch: 'intro', theme: 'paper', title: 'everything flagged, on one page', settle: 8,
  draw: t => {
    header(t, 'everything flagged, on one page', { eyebrow: 'recommendations  //  overview' });
    const x = LM, y = 232, w = W - 2 * LM, h = 664;
    demoWindow(x, y, w, h, ep(t, 0.3, 0.7));
    const cols = [x + 24, x + 108, x + 590, x + 790];
    ['idea', 'what the doc proposes', 'verdict', 'what i\'d do'].forEach((s2, i) => text(s2, cols[i], y + 34, { size: 14, weight: 700, color: C.mute, alpha: ep(t, 0.5, 0.9) }));
    const n = {}; REC_ROWS.forEach(r => n[r[2]] = (n[r[2]] || 0) + 1);
    text(Object.keys(VERD).filter(v => n[v]).map(v => n[v] + ' ' + v).join('   '), x + w - 24, y + 34, { size: 14, weight: 700, color: C.mute, align: 'right', alpha: ep(t, 0.6, 1.0) });
    REC_ROWS.forEach((r, i) => {
      const yy = y + 70 + i * 26.6, k = ep(t, 0.7 + i * 0.05, 1.0 + i * 0.05);
      if (i) line(x + 18, yy - 18, x + w - 18, yy - 18, { color: C.hair, w: 1, alpha: k });
      text(r[0], cols[0], yy, { size: 14, weight: 800, color: C.ink2, alpha: k });
      text(r[1], cols[1], yy, { size: 14, weight: 600, color: C.ink2, alpha: k });
      const col = VERD[r[2]](); circle(cols[2] + 6, yy - 5, 5.5, { fill: col, alpha: k }); text(r[2], cols[2] + 20, yy, { size: 14, weight: 800, color: col, alpha: k });
      text(r[3], cols[3], yy, { size: 14, weight: 700, color: C.ink, alpha: k });
    });
    captions(t, [[1.8, 'none of these sink the mouse. most are a claim worded past its evidence, or a choice that needs a test of your own first.']], { y: 952 });
    source(t, 'details and sources on the following slides.', { y: 1046 });
  }
});

/* ---------- sensor position ---------- */
S({
  id: 'sensorpos', ch: 'glide', theme: 'night', title: 'a wider arc, not better aim', settle: 9, src: ['chi2020'],
  draw: t => {
    header(t, 'a wider arc, not better aim', { eyebrow: 'tracking  //  #27, sensor position' });
    const wx = LM, wy = 250, ww = 980, wh = 560, A = acc('glide');
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('aim by sensor position', wx + 28, wy + 44, { size: 17, weight: 800, color: C.ink, t, t0: 0.9, cps: 70 });
    tag(wx + 28, wy + 76, 'study', ep(t, 1.0, 1.4)); text('Kim, Lee, van Gemert & Oulasvirta, CHI 2020, n = 14', wx + 120, wy + 76, { size: 13, weight: 600, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    /* the generic mouse, with the positions the study tested along its length */
    const px = wx + 150, py = wy + 330, s = 2.3, Y = f => py + (-50 + 100 * f) * s;
    keyPlan(t, 0.6, px, py, { s, label: 'positions tested, front to rear' });
    [0, 0.2, 0.4, 0.5, 0.6, 0.8, 1].forEach((f, i) => { const k = ep(t, 1.2 + i * 0.08, 1.5 + i * 0.08), end = f === 0 || f === 1, mid = f === 0.5; circle(px, Y(f), end || mid ? 7 : 5, { fill: end ? C.red : mid ? A : C.gray, alpha: k }); });
    const zx = wx + 760, sc = 15, lx = wx + 380;
    line(zx, wy + 150, zx, wy + 480, { color: C.faint, w: 1.5, alpha: ep(t, 1.4, 1.8) });
    text('throughput against the centre', zx, wy + 128, { size: 13, weight: 700, color: C.faint, align: 'center', alpha: ep(t, 1.4, 1.8) });
    const rows = [[0, 'front, 0%', -10.7, '5.16 bits/s'], [0.5, 'centre, 50%', 0, '5.77 bits/s, the best'], [1, 'rear, 100%', -14.0, '4.97 bits/s']];
    rows.forEach(([f, l, v, b], i) => {
      const y = Y(f), k = ep(t, 1.8 + i * 0.3, 2.6 + i * 0.3, E.snap), col = v ? C.red : A;
      line(px + 12, y, lx - 12, y, { color: C.hair, w: 1.2, dash: [4, 5], alpha: ep(t, 1.6 + i * 0.3, 2.0 + i * 0.3) });
      text(l, lx, y - 16, { size: 15, weight: 800, color: C.ink2, alpha: ep(t, 1.6 + i * 0.3, 2.0 + i * 0.3) });
      if (v) { rect(zx + v * sc * k, y - 2, -v * sc * k, 20, { fill: col }); text(v.toFixed(1) + '%', zx + v * sc * k - 10, y + 15, { size: 16, weight: 800, color: col, align: 'right', alpha: k }); text(b, zx + 12, y + 15, { size: 14, weight: 600, color: C.mute, alpha: k }); }
      else { rect(zx - 2, y - 2, 4, 20, { fill: col, alpha: k }); text(b, zx + 14, y + 15, { size: 15, weight: 800, color: col, alpha: k }); }
    });
    text('20 to 80%: no significant difference between them', lx, Y(0.75) + 6, { size: 14, weight: 700, color: C.gray, alpha: ep(t, 2.8, 3.2) });
    const ty = wy + 520, kt = ep(t, 3.2, 3.9, E.snap);
    text('tuned to each person (an estimate)', lx, ty - 16, { size: 15, weight: 800, color: C.ink2, alpha: ep(t, 3.0, 3.4) });
    rect(zx, ty - 2, 4 * sc * kt, 20, { fill: A }); text('+4%', zx + 4 * sc * kt + 10, ty + 15, { size: 16, weight: 800, color: A, alpha: kt });
    recPanel(t, 1110, 250, W - LM - 1110, 560, { verdict: ['contested', 'contradicted'], doc: 'a more forward sensor widens the arc of a flick, and a customizable position offers "up to 14%" throughput.', evidence: 'the arc holds: in a flick game the rear position read about half the front\'s sideways travel. aim didn\'t: it peaked at the centre, both ends lost 10.7 to 14%, and 20 to 80% didn\'t differ. tuning per person adds an estimated 4%, not 14%.', change: 'a small forward shift costs nothing measurable, so take it for the arc, but don\'t claim better aim. quote 4% for a custom position, and note a moved virtual point needs a second sensor or a gyro.' });
    captions(t, [[0.6, 'the study is real, but it doesn\'t say forward is better. aim peaked near the centre, and only the two ends were clearly worse.']]);
  }
});

/* ---------- weight ---------- */
S({
  id: 'weight', ch: 'glide', theme: 'paper', title: 'below 90 g, aim stops improving', settle: 9, src: ['yan22', 'conroy', 'wang23', 'nbcUlx'],
  draw: t => {
    header(t, 'below 90 g, aim stops improving', { eyebrow: 'tracking  //  weight' });
    const wx = LM, wy = 250, ww = 980, wh = 560, A = acc('glide');
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('what each aiming study found, by the weights it tested', wx + 28, wy + 44, { size: 17, weight: 800, color: C.ink, t, t0: 0.9, cps: 70 });
    tag(wx + 28, wy + 76, 'study', ep(t, 1.0, 1.4));
    const X = g => wx + 300 + (ww - 340) * (g - 30) / 120, ay = wy + 494, a0 = ep(t, 1.0, 1.4);
    for (const g of [30, 50, 70, 90, 110, 130, 150]) { line(X(g), wy + 112, X(g), ay, { color: C.hair, w: 1, alpha: a0 }); text(g + ' g', X(g), ay + 26, { size: 13, weight: 600, color: C.mute, align: 'center', alpha: a0 }); }
    line(X(30), ay, X(150), ay, { color: C.faint, w: 1.5, alpha: a0 });
    const row = (i, name, sub, y) => { const k = ep(t, 1.3 + i * 0.5, 1.7 + i * 0.5); text(name, wx + 28, y + 5, { size: 15, weight: 800, color: C.ink, alpha: k }); text(sub, wx + 28, y + 27, { size: 13, weight: 600, color: C.mute, alpha: k }); return k; };
    const dot = (g, y, col, k, r = 7) => circle(X(g), y, r, { fill: col, alpha: k });
    let y = wy + 150, k = row(0, 'Yan 2022, n = 12', 'six mice, 40 to 140 g', y);
    line(X(40), y, X(140), y, { color: C.gray, w: 2, alpha: k * 0.6 }); dot(40, y, C.red, k); dot(60, y, A, k);
    text('highest error rate', X(40) - 8, y - 16, { size: 14, weight: 800, color: C.red, alpha: k }); text('most preferred', X(60) - 8, y + 30, { size: 14, weight: 800, color: A, alpha: k });
    y = wy + 262; k = row(1, 'Conroy 2022, n = 72', '50, 60, 90 and 100 g', y);
    line(X(50), y - 20, X(90), y - 20, { color: C.ink2, w: 1.5, alpha: k }); for (const g of [50, 90]) line(X(g), y - 26, X(g), y - 14, { color: C.ink2, w: 1.5, alpha: k });
    text('no difference among these', (X(50) + X(90)) / 2, y - 32, { size: 13, weight: 700, color: C.ink2, align: 'center', alpha: k });
    for (const g of [50, 60, 90]) dot(g, y, C.ink, k); dot(100, y, C.red, k);
    text('4% slower, 9% less accurate', X(100) + 14, y + 5, { size: 14, weight: 800, color: C.red, alpha: k });
    y = wy + 360; k = row(2, 'Wang 2023, n = 16', 'pro players, 80 and 87 g', y);
    dot(80, y, C.ink, k); dot(87, y, C.ink, k); text('6.89 vs 6.90 bits/s', X(87) + 14, y + 5, { size: 14, weight: 800, color: C.ink, alpha: k });
    y = wy + 440; k = row(3, 'today\'s lightest', 'not in any study', y);
    rect(X(29), y - 7, X(35) - X(29), 14, { fill: rgba(C.blue, 0.55), alpha: k }); text('ULX, 29 to 35 g by size (claims). no study went under 40 g.', X(35) + 12, y + 5, { size: 14, weight: 800, color: C.blue, alpha: k });
    recPanel(t, 1110, 250, W - LM - 1110, 560, { verdict: 'contested', docLabel: 'THE DOC AND THE TARGETS', doc: '"less weight means less inertia", and the targets chase the lightest mouse in its class.', evidence: 'going under 100 g helped in one study: 4% faster and 9% more accurate. but 50, 60 and 90 g didn\'t differ, and in another study the 40 g mouse had the highest error rate. no study has tested anything as light as a ULX.', change: 'keep it light, since players prefer light mice, but sell stiffness and where the mass sits (#95), not grams. run the aim test at the final weight, against a build 10 g heavier.' });
    captions(t, [[0.6, 'players prefer lighter mice, and dropping below 100 g helped. under about 90 g the studies stop finding gains.']]);
  }
});

/* ---------- smaller glide and wheel items ---------- */
function treadStrip(x, y, w, h, n, kind, col, a) {
  G.save(); G.globalAlpha = a; rr(x, y, w, h, 6, inkA(0.06), inkA(0.2), 1.2, 1);
  G.beginPath(); G.rect(x, y, w, h); G.clip(); G.strokeStyle = col; G.lineWidth = kind === 'chevron' ? 3 : 2; G.lineCap = 'round';
  const step = w / n;
  for (let i = -1; i <= n + 1; i++) { const x0 = x + i * step; G.beginPath(); if (kind === 'chevron') { G.moveTo(x0, y + 4); G.lineTo(x0 + step * 0.45, y + h / 2); G.lineTo(x0, y + h - 4); } else { G.moveTo(x0, y + 4); G.quadraticCurveTo(x0 + step * 0.5, y + h / 2, x0, y + h - 4); } G.stroke(); }
  G.restore();
}
S({
  id: 'glidefixes', ch: 'glide', theme: 'night', title: 'skates and the scroll wheel', settle: 9, src: ['plasticsFric', 'wieleba09', 'delrin150', 'curiosity', 'perseverance'],
  draw: t => {
    header(t, 'skates and the scroll wheel', { eyebrow: 'glide  //  #8, #30, #84' });
    const wx = LM, wy = 250, ww = W - 2 * LM, wh = 600, cw = (ww - 56) / 3, A = acc('glide');
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const col = (i, v, h2, t0) => { const x = wx + 28 + i * cw, k = ep(t, t0, t0 + 0.4); verdictChip(x, wy + 48, v, k); text(h2, x, wy + 100, { size: 18, weight: 800, color: C.ink, alpha: k, maxW: cw - 40 }); return x; };
    const body = (x, y, s2, t0, c) => text(s2, x, y, { size: 14, weight: c ? 800 : 600, color: c || C.ink2, t, t0, cps: 120, maxW: cw - 48, lh: 1.45 });
    for (const i of [1, 2]) line(wx + 28 + i * cw - 14, wy + 30, wx + 28 + i * cw - 14, wy + wh - 30, { color: C.hair, w: 1, alpha: ep(t, 0.6, 1.0) });
    /* #8 */
    let x = col(0, 'contested', '#8 POM skates as the default', 0.6), bw = cw - 190;
    const X = v => x + 60 + bw * v / 0.4;
    text('dynamic friction, plastics table', x, wy + 150, { size: 13, weight: 700, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    [['PTFE', 0.05, 0.10, A], ['POM', 0.11, 0.35, C.gray]].forEach(([l, a, b, c], j) => { const y = wy + 180 + j * 46, k = ep(t, 1.2 + j * 0.2, 1.9 + j * 0.2, E.snap); text(l, x, y + 13, { size: 14, weight: 800, color: c, alpha: k }); rect(X(a), y, (X(b) - X(a)) * k + 2, 16, { fill: c }); text('μ ' + a.toFixed(2) + ' to ' + b.toFixed(2), X(b) + 10, y + 13, { size: 13, weight: 800, color: c, alpha: k }); });
    body(x, wy + 300, 'the doc picks POM for its premium feel and smooth glide. the friction data says POM is the slower, more controlled one: on one rig, static friction against steel ran PTFE 0.07 to 0.14 and POM 0.14 to 0.18.', 1.6);
    body(x, wy + 470, 'change: ship both, as planned, and call POM the control option and PTFE the fast one.', 3.0, A);
    /* #30 */
    x = col(1, 'contested', '#30 a rover-tread wheel', 1.0);
    text('Curiosity: 24 chevron grousers', x, wy + 150, { size: 13, weight: 700, color: C.mute, alpha: ep(t, 1.4, 1.8) });
    treadStrip(x, wy + 162, cw - 60, 44, 6, 'chevron', C.red, ep(t, 1.5, 1.9));
    text('Perseverance: 48 gently curved ones', x, wy + 236, { size: 13, weight: 700, color: C.mute, alpha: ep(t, 1.8, 2.2) });
    treadStrip(x, wy + 248, cw - 60, 44, 12, 'curve', A, ep(t, 1.9, 2.3));
    body(x, wy + 330, 'Curiosity\'s 0.75 mm wheel skin tore starting at the chevron tips, where the stress peaked. Perseverance moved to twice as many gentler grousers, with the same or better traction in sand.', 2.0);
    body(x, wy + 470, 'change: keep the rover story, but copy Perseverance: more, gentler ridges, no sharp chevrons.', 3.4, A);
    /* #84 */
    x = col(2, 'unverified', '#84 a magnesium wheel', 1.4);
    text('density, g/cm³', x, wy + 150, { size: 13, weight: 700, color: C.mute, alpha: ep(t, 1.8, 2.2) });
    [['POM', 1.42, C.gray], ['magnesium', 1.74, C.ink], ['aluminium', 2.70, C.gray]].forEach(([l, v, c], j) => { const y = wy + 176 + j * 40, k = ep(t, 2.0 + j * 0.15, 2.7 + j * 0.15, E.snap), bx = x + 110, bw2 = cw - 250; text(l, x, y + 13, { size: 14, weight: 700, color: C.ink2, alpha: k }); rect(bx, y, bw2 * v / 2.8 * k, 16, { fill: c }); text(v.toFixed(2), bx + bw2 * v / 2.8 * k + 10, y + 13, { size: 13, weight: 800, color: c, alpha: k }); });
    body(x, wy + 330, 'the doc says all high-end mice have metal wheels now. no test turned up showing a metal wheel scrolls, grips or lasts better, and magnesium is still heavier than POM.', 2.4);
    body(x, wy + 470, 'change: treat it as a premium option, and make it earn its place in the skip and wear tests.', 3.8, A);
    captions(t, [[0.6, 'three small ones. each is a claim about feel that a datasheet or a past failure already answers.']], { y: 1000 });
  }
});

/* ---------- hot-swap ---------- */
function socketBoard(gap) {
  /* the board and three press-fit receptacles; the switch sits gap mm above where solder would put it */
  pcbSec(-2.2, 15.0, 0.2, 1.2, { holes: [] });
  for (const x of SWG.pins) {
    solid(() => { G.beginPath(); G.rect(x - 0.62, 0.05, 1.24, 1.55); }, MT.brass, [x - 0.62, 0.05, 1.24, 1.55], { horiz: true, lw: 0.8 });
    solid(() => { G.beginPath(); G.rect(x - 0.9, -0.05, 1.8, 0.2); }, MT.brass, [x - 0.9, -0.05, 1.8, 0.2], { horiz: true, lw: 0.8 });
    G.fillStyle = 'rgba(0,0,0,0.35)'; G.fillRect(x - 0.3, 0.15, 0.6, 1.4);
  }
  return { top: SP(13.4, -gap), base: SP(13.4, 0) };
}
S({
  id: 'hotswap', ch: 'click', theme: 'night', title: 'solder the main switches', settle: 9, src: ['millmax', 'trOp1', 'omronD2f'],
  draw: t => {
    header(t, 'solder the main switches', { eyebrow: 'clicks  //  #14' });
    const wx = LM, wy = 250, ww = 980, wh = 560, A = acc('click'), s = 22, oy = wy + 330;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('the switch\'s height sets the pre-travel', wx + 28, wy + 44, { size: 17, weight: 800, color: C.ink, t, t0: 0.9, cps: 70 });
    const L = wx + 90, R = wx + 530, gap = 0.3 * (0.5 - 0.5 * Math.cos(Math.max(0, t - 2.4) * 1.8)) * ep(t, 2.4, 3.0);
    text('soldered', L, wy + 110, { size: 16, weight: 800, color: A, alpha: ep(t, 0.6, 1.0) });
    drawSwitch(L, oy, s, { press: 0, board: true, alpha: ep(t, 0.4, 0.9) });
    text('in a socket', R, wy + 110, { size: 16, weight: 800, color: C.red, alpha: ep(t, 0.8, 1.2) });
    const sb = part(R, oy, s, () => socketBoard(gap), { alpha: ep(t, 0.6, 1.1) }) || {};
    drawSwitch(R, oy - gap * s, s, { press: 0, alpha: ep(t, 0.6, 1.1) });
    if (sb.top) { const k = ep(t, 2.6, 3.0); line(sb.base[0] + 2, sb.base[1], sb.base[0] + 36, sb.base[1], { color: C.red, w: 1.2, alpha: k }); line(sb.top[0] + 2, sb.top[1], sb.top[0] + 36, sb.top[1], { color: C.red, w: 1.2, alpha: k }); text('gap ' + gap.toFixed(2) + ' mm', sb.base[0] + 44, sb.base[1] + 2, { size: 14, weight: 800, color: C.red, alpha: k }); }
    text('the board sets the height', L, wy + 456, { size: 15, weight: 800, color: A, alpha: ep(t, 1.0, 1.4) });
    text('the same on every mouse', L, wy + 480, { size: 13, weight: 600, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    text('it sits where it was pushed', R, wy + 456, { size: 15, weight: 800, color: C.red, alpha: ep(t, 1.4, 1.8) });
    text('any gap adds straight onto the pre-travel', R, wy + 480, { size: 13, weight: 600, color: C.mute, alpha: ep(t, 1.6, 2.0) });
    text('gap animated from 0 to 0.3 mm; drawn to scale at 22 px per mm', wx + ww - 28, wy + wh - 20, { size: 12, weight: 600, color: C.faint, align: 'right', alpha: ep(t, 3, 3.4) });
    recPanel(t, 1110, 250, W - LM - 1110, 560, { verdict: 'contested', doc: 'hot-swap switches and encoders on Mill-Max 3305 claw springs, instead of solder.', evidence: 'the 3305 is rated for 1,000 insertions minimum. Endgame Gear already sells swappable switches, and TechRadar found the terminal hard to remove and easy to insert backwards. a trigger tuned in tenths of a millimetre needs the switch at the same height every time.', change: 'solder the SPDT main switches. if swapping matters, swap a switch soldered to its own small board that seats on a hard stop, so the socket carries current but never sets height.' });
    captions(t, [[0.6, 'swapping is a good ownership story, but the click is tuned in tenths of a millimetre, and a socket lets the height drift.']]);
  }
});

/* ---------- haptics, ceiling cutouts: flagged unsure ---------- */
/* the outer surface of a generic front section, right half only: across the top, round the shoulder, down
   the side. sampled once with arc length and inward normals, so a piece of shell can be cut anywhere on it.
   the curve is deliberately plain; it stands for any shell. */
const REC_PROF = (() => {
  const P = [], bez = (p0, p1, p2, p3, n, skip) => { for (let i = skip ? 1 : 0; i <= n; i++) { const u = i / n, v = 1 - u; P.push([v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]); } };
  bez([3, -29.6], [13, -29.4], [21, -27.8], [26.5, -23.6], 40);
  bez([26.5, -23.6], [30.2, -20.6], [31.6, -15.5], [31.6, -9.5], 30, 1);
  bez([31.6, -9.5], [31.6, -5.5], [31.3, -2.5], [30.8, 0], 12, 1);
  const Sl = [0], N = [];
  for (let i = 1; i < P.length; i++) Sl.push(Sl[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  for (let i = 0; i < P.length; i++) { const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; N.push([-dy / l, dx / l]); }
  return { P, S: Sl, N, len: Sl[Sl.length - 1] };
})();
/** a point on that surface at arc length s, with its inward normal */
function rec_at(s) {
  const { P, S: Sl, N } = REC_PROF; let i = 1; while (i < Sl.length - 1 && Sl[i] < s) i++;
  const k = clamp((s - Sl[i - 1]) / ((Sl[i] - Sl[i - 1]) || 1)), n = [lerp(N[i - 1][0], N[i][0], k), lerp(N[i - 1][1], N[i][1], k)], l = Math.hypot(n[0], n[1]) || 1;
  return { p: [lerp(P[i - 1][0], P[i][0], k), lerp(P[i - 1][1], P[i][1], k)], n: [n[0] / l, n[1] / l] };
}
/** arc length where the surface reaches height y (y only ever increases along it) or width x (on the top) */
function rec_sAt(key, v) { const { P, S: Sl } = REC_PROF, j = key === 'y' ? 1 : 0; for (let i = 1; i < P.length; i++) if (P[i][j] >= v) return lerp(Sl[i - 1], Sl[i], clamp((v - P[i - 1][j]) / ((P[i][j] - P[i - 1][j]) || 1))); return REC_PROF.len; }
/** an S-shaped break line from a to b, for a cut through the wall */
function rec_brkTo(a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], px = -dy * 0.3, py = dx * 0.3; G.bezierCurveTo(a[0] + dx * 0.32 + px, a[1] + dy * 0.32 + py, a[0] + dx * 0.68 - px, a[1] + dy * 0.68 - py, b[0], b[1]); }
/** one piece of shell between arc lengths s0 and s1, th thick, moved down by dy; each end is a cut face or a break */
function rec_piece(s0, s1, th, dy, ends) {
  const out = [], inn = [], n = Math.max(4, Math.ceil((s1 - s0) / 0.4));
  for (let i = 0; i <= n; i++) { const q = rec_at(lerp(s0, s1, i / n)); out.push([q.p[0], q.p[1] + dy]); inn.push([q.p[0] + q.n[0] * th, q.p[1] + q.n[1] * th + dy]); }
  const path = () => {
    G.beginPath(); G.moveTo(out[0][0], out[0][1]); for (const p of out) G.lineTo(p[0], p[1]);
    const a = out[n], b = inn[n]; if (ends[1] === 'brk') rec_brkTo(a, b); else G.lineTo(b[0], b[1]);
    for (let i = n; i >= 0; i--) G.lineTo(inn[i][0], inn[i][1]);
    if (ends[0] === 'brk') rec_brkTo(inn[0], out[0]); G.closePath();
  };
  const all = out.concat(inn), xs = all.map(p => p[0]), ys = all.map(p => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys);
  solid(path, MT.shell, [x0, y0, Math.max(...xs) - x0, Math.max(...ys) - y0], { hatch: true });
  return { a: out[0], b: out[n], ai: inn[0], bi: inn[n] };
}
/** a finger in section: skin, soft tissue, the bone, the nail on the far side */
function rec_fingerMM(cx, cy, r, nailDir) {
  G.beginPath(); G.arc(cx, cy, r, 0, TAU); G.fillStyle = grad({ g: ['#e2b39b', '#c98f75'] }, cx - r, cy - r, cx + r, cy + r); G.fill();
  G.strokeStyle = 'rgba(120,70,50,0.85)'; G.lineWidth = lw(1.2); G.stroke();
  G.beginPath(); G.arc(cx, cy, r - 0.9, 0, TAU); G.strokeStyle = 'rgba(120,70,50,0.22)'; G.lineWidth = lw(1); G.stroke();
  const bx = cx + nailDir * r * 0.22; G.beginPath(); G.ellipse(bx, cy, r * 0.34, r * 0.3, 0, 0, TAU); G.fillStyle = '#efeeea'; G.fill(); G.strokeStyle = 'rgba(120,90,60,0.5)'; G.lineWidth = lw(1); G.stroke();
  G.beginPath(); G.arc(cx, cy, r + 0.15, nailDir > 0 ? -0.75 : Math.PI - 0.75, nailDir > 0 ? 0.75 : Math.PI + 0.75); G.strokeStyle = '#f3d6cc'; G.lineWidth = lw(5.5); G.lineCap = 'butt'; G.stroke(); G.lineCap = 'round';
}
/** the right trigger and side wall in front section. seam 'side': the split runs along the side wall, where the
   ring finger rests; seam 'top': the split is on the top, and the side is one fixed piece. d: trigger travel, mm. */
function rec_cutSecMM(seam, d) {
  const th = 1.5, gap = 1.1, out = {};
  const sSeam = seam === 'side' ? rec_sAt('y', -14.5) : rec_sAt('x', 21.5), fr = 7, fc = [31.6 + fr - 1.0, -14.5];
  rec_fingerMM(fc[0], fc[1], fr, 1);
  const trig = rec_piece(0, sSeam - gap / 2, th, d, ['brk', 'cut']), side = rec_piece(sSeam + gap / 2, REC_PROF.len, th, 0, ['cut', 'brk']);
  out.trigEnd = SP(trig.b[0], trig.b[1]); out.sideTop = SP(side.a[0], side.a[1]); out.finger = SP(fc[0] + fr * 0.7, fc[1] - fr * 0.7);
  out.seam = SP((trig.b[0] + side.a[0]) / 2, (trig.b[1] + side.a[1]) / 2); out.press = SP(12, -30.0 + d); out.pressTop = SP(12, -35.5);
  out.labSide = SP(33.5, -2.2); out.labTop = SP(23.5, -33.2); out.labFixed = SP(28.6, -5.2); out.labFinger = SP(fc[0] + 4.6, fc[1] - 6.2);
  return out;
}
/** the haptic motor in section: a steel can, a mass on two leaf springs, the coil under it. dx shifts the mass */
function rec_lraMM(dx) {
  const L = 7.2, Hh = 3.4;
  solid(() => { G.beginPath(); G.rect(0, -Hh, L, Hh); }, MT.steel, [0, -Hh, L, Hh], { lw: 0.9 });
  G.fillStyle = '#1b1c20'; G.fillRect(0.3, -Hh + 0.3, L - 0.6, Hh - 0.6);
  for (let i = 0; i < 10; i++) { G.beginPath(); G.arc(1.3 + i * 0.5, -0.62, 0.21, 0, TAU); G.fillStyle = i % 2 ? '#d08a4f' : '#b56c33'; G.fill(); }
  const mx = 2.0 + dx; solid(() => { G.beginPath(); G.rect(mx, -2.9, 3.2, 1.8); }, { g: ['#b9bdc4', '#5d626b'] }, [mx, -2.9, 3.2, 1.8], { lw: 0.8, hatch: { sp: 4 } });
  G.fillStyle = 'rgba(200,70,61,0.85)'; G.fillRect(mx + 0.25, -2.65, 1.2, 1.3); G.fillStyle = 'rgba(70,110,200,0.85)'; G.fillRect(mx + 1.75, -2.65, 1.2, 1.3);
  const zig = (x0, x1) => { const pts = []; for (let i = 0; i <= 8; i++) pts.push([lerp(x0, x1, i / 8), -2.0 + (i % 2 ? 0.55 : -0.55) * (i && i < 8 ? 1 : 0)]); mmLine(pts, '#c9ced5', 1.1); };
  zig(0.3, mx); zig(mx + 3.2, L - 0.3);
}
/** a stretch of the mouse in section: shell floor, board, the sensor and lens, and the motor further along. the
   desk never moves; everything above it shakes by sh mm while the motor runs */
function rec_hapticMM(sh, dx, on, A, tt) {
  const out = {};
  G.fillStyle = '#34363b'; G.fillRect(-15, 2.4, 50, 1.8); for (let i = -54; i <= 125; i++) { G.beginPath(); G.ellipse(i * 0.28, 2.57, 0.12, 0.11, 0, 0, TAU); G.fillStyle = i % 2 ? '#5f6269' : '#55585f'; G.fill(); }
  mmLine([[-15, 2.4], [35, 2.4]], inkA(0.55), 1.2);
  xsave(); xmove(sh, 0);
  for (const [x0, x1, b] of [[-14.5, -5.2, [1, 0]], [5.2, 34.5, [0, 1]]]) solid(() => { G.beginPath(); G.moveTo(x0, 0.6); G.lineTo(x1, 0.6); if (b[1]) brk(x1, 0.6, 1.6, 0.22); else G.lineTo(x1, 1.6); G.lineTo(x0, 1.6); if (b[0]) brk(x0, 1.6, 0.6, 0.22); G.closePath(); }, MT.shell, [x0, 0.6, x1 - x0, 1], { hatch: true });
  for (const [x0, x1] of [[-13.4, -9.6], [24, 28]]) solid(() => { G.beginPath(); G.moveTo(x0, 1.6); G.lineTo(x1, 1.6); G.lineTo(x1, 2.15); G.quadraticCurveTo(x1, 2.4, x1 - 0.25, 2.4); G.lineTo(x0 + 0.25, 2.4); G.quadraticCurveTo(x0, 2.4, x0, 2.15); G.closePath(); }, MT.ptfe, [x0, 1.6, x1 - x0, 0.8], { lw: 0.8 });
  pcbSec(-14.5, -2.4, -3.8, 1.2, { brk: [1, 0] }); pcbSec(2.4, 34.5, -3.8, 1.2, { brk: [0, 1] });
  solid(() => { G.beginPath(); G.moveTo(-5, -3.8); G.lineTo(-5, -6.1); G.lineTo(5, -6.1); G.lineTo(5, -3.8); G.lineTo(1.1, -3.8); G.lineTo(1.1, -4.25); G.lineTo(-1.1, -4.25); G.lineTo(-1.1, -3.8); G.closePath(); }, MT.epoxy, [-5, -6.1, 10, 2.3], {});
  G.fillStyle = rgba(A, 0.9); G.fillRect(-0.9, -4.75, 1.8, 0.28);
  solid(() => { G.beginPath(); G.moveTo(-3, -2.6); G.lineTo(3, -2.6); G.lineTo(3, -0.4); G.quadraticCurveTo(1.6, -0.4, 0, 0); G.quadraticCurveTo(-1.6, -0.4, -3, -0.4); G.closePath(); }, MT.lens, [-3, -2.6, 6, 2.6], { ec: 'rgba(120,175,205,0.95)', lw: 1.1 });
  const spot = [-sh, 2.4]; mmLine([[0, -0.1], spot], rgba(on ? C.red : A, 0.7), 1.2, { dash: [4, 3] });
  xsave(); xmove(24.6, -3.8); rec_lraMM(dx); xrest();
  if (on) for (let i = 1; i <= 3; i++) { const ph2 = (tt * 3) % 1, r0 = 1.2 + (i - 1 + ph2) * 1.3; G.beginPath(); G.arc(31.6, -5.6, r0, -0.9, 0.9); G.strokeStyle = rgba(A, 0.7 * (1 - (i - 1 + ph2) / 3)); G.lineWidth = lw(1.4); G.stroke(); }
  out.motor = SP(31.8, -7.2); out.sensor = SP(-4, -6.1); out.board = SP(14, -3.8); out.lens = SP(3, -1.4);
  xrest();
  out.desk = SP(-12, 4.2); out.spot = SP(0, 2.4);
  return out;
}
S({
  id: 'unsure', ch: 'click', theme: 'paper', title: 'the two you weren\'t sure about', settle: 9, src: ['logiSuperstrike', 'superstrike'],
  sfx: [[2.05, 'click'], [4.65, 'click'], [7.25, 'click']],
  draw: t => {
    header(t, 'the two you weren\'t sure about', { eyebrow: 'clicks  //  #89, #1' });
    const wx = LM, wy = 250, ww = 840, wh = 600, A = acc('click');
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    verdictChip(wx + 28, wy + 50, 'unverified', ep(t, 0.6, 1.0));
    text('haptic motors (#89)', wx + 190, wy + 50, { size: 18, weight: 800, color: C.ink, t, t0: 0.7, cps: 70 });
    /* the test to run: the motor buzzes while the mouse sits still; does the sensor see the desk move? */
    const ph = t - 1.4, on = ph > 0 && (ph % 3.2) < 1.3, kv = ep(t, 0.9, 1.4), sh = on ? Math.sin(t * 150) * 0.16 : 0, mdx = on ? Math.sin(t * 150) * 0.55 : 0;
    const hs = 10.5, hx = wx + 40 + 15 * hs, hy = wy + 206;
    const hp = part(hx, hy, hs, () => rec_hapticMM(sh, mdx, on, A, t), { alpha: kv }) || {};
    if (hp.motor) {
      text('haptic motor', hp.motor[0] - 38, hp.motor[1] - 30, { size: 13, weight: 800, color: on ? A : C.mute, align: 'center', alpha: kv });
      text('a mass on springs, in a steel can', hp.motor[0] - 38, hp.motor[1] - 12, { size: 11, weight: 600, color: C.faint, align: 'center', alpha: kv });
      text('sensor', hp.sensor[0], hp.sensor[1] - 14, { size: 13, weight: 800, color: C.mute, align: 'center', alpha: kv });
      text('the desk, still', hp.desk[0], hp.desk[1] + 20, { size: 12, weight: 700, color: C.mute, alpha: kv });
      text(on ? 'the board shakes, and the lens sees the desk move' : 'motor off: the board sits still', hp.board[0] - 20, hp.desk[1] + 20, { size: 12, weight: 800, color: on ? C.red : C.mute, alpha: kv });
      text(on ? 'motor on' : 'motor off', wx + ww - 40, wy + 150, { size: 22, weight: 800, color: on ? C.red : C.faint, align: 'right', alpha: kv });
      text('a buzz for each click', wx + ww - 40, wy + 174, { size: 12, weight: 600, color: C.mute, align: 'right', alpha: kv });
    }
    const sx = wx + 28, sy = wy + 312, sw = ww - 56, sh2 = 84;
    text('sensor counts, mouse held still', sx, sy - 12, { size: 13, weight: 700, color: C.mute, alpha: kv });
    rr(sx, sy, sw, sh2, 6, inkA(0.04), inkA(0.14), 1, kv); line(sx + 8, sy + sh2 / 2, sx + sw - 8, sy + sh2 / 2, { color: C.hair, w: 1, alpha: kv });
    /* the trace scrolls left; each stretch keeps the colour of the state it was drawn in */
    let run = [], runOn = null; const flush = () => { if (run.length > 1) poly(run, { color: runOn ? C.red : A, w: 1.8, alpha: kv }); };
    for (let j = 0; j <= 200; j++) { const u = t - (200 - j) * 0.02, pu = u - 1.4, onU = pu > 0 && (pu % 3.2) < 1.3, n = onU ? Math.sin(u * 97) * 0.5 + Math.sin(u * 211) * 0.35 : 0, p = [sx + 8 + (sw - 16) * j / 200, sy + sh2 / 2 - n * sh2 * 0.38];
      if (runOn !== null && onU !== runOn) { run.push(p); flush(); run = [p]; } else run.push(p); runOn = onU; }
    flush();
    text(on ? 'motor on: does the cursor drift?' : 'motor off: flat', sx + sw, sy + sh2 + 20, { size: 12, weight: 800, color: on ? C.red : A, align: 'right', alpha: kv });
    text('illustration, not a result', sx + sw, sy - 12, { size: 11, weight: 600, color: C.faint, align: 'right', alpha: kv });
    let ly = wy + 458;
    ly += text('Logitech\'s Superstrike, the one flagship with haptics, uses them for click feel and lists 90 h; a retail listing says 60 to 90 h. nobody has published a jitter test: motor running, mouse still, counting what the sensor reports.', wx + 28, ly, { size: 15, weight: 600, color: C.ink2, t, t0: 1.0, cps: 130, maxW: ww - 56, lh: 1.45 }).h + 12;
    text('change: leave them out of the first model; run that test on any prototype.', wx + 28, ly, { size: 15, weight: 800, color: C.ink, t, t0: 2.6, cps: 100, maxW: ww - 56, lh: 1.45 });
    /* ceiling-facing cutouts: the doc's reason drawn out, a split on the side closes on the ring finger */
    const rx = 970, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    verdictChip(rx + 28, wy + 50, 'unverified', ep(t, 0.8, 1.2));
    text('ceiling-facing cutouts (#1)', rx + 190, wy + 50, { size: 18, weight: 800, color: C.ink, t, t0: 0.9, cps: 70 });
    const cyc2 = ((t - 2.0) % 2.6 + 2.6) % 2.6, press = t < 2.0 ? 0 : cyc2 < 0.22 ? E.out3(cyc2 / 0.22) : cyc2 < 1.0 ? 1 : cyc2 < 1.3 ? 1 - E.io3((cyc2 - 1.0) / 0.3) : 0, d = 0.85 * press;
    const cs = 8.0, Y0 = wy + 404;
    [['side', rx + 4, 'split on the side wall', C.red], ['top', rx + 414, 'split on the top', A]].forEach(([seam, X, lab, col], i) => {
      const k = ep(t, 1.1 + i * 0.3, 1.6 + i * 0.3);
      text(lab, X + 24, wy + 100, { size: 15, weight: 800, color: col, alpha: k });
      const r = part(X, Y0, cs, () => rec_cutSecMM(seam, d), { alpha: k }) || {};
      if (!r.press) return;
      arrow(r.pressTop[0], r.pressTop[1], r.press[0], r.press[1], { color: C.ink, w: 2.5, hs: 11, alpha: k * (0.35 + 0.65 * press) });
      text('press', r.pressTop[0] + 12, r.pressTop[1] + 16, { size: 12, weight: 700, color: C.mute, alpha: k });
      text('ring finger', r.labFinger[0], r.labFinger[1], { size: 12, weight: 800, color: C.ink2, alpha: k });
      const pk = clamp((press - 0.55) / 0.45) * k;
      if (seam === 'side') {
        if (pk > 0.003) glow(r.seam[0] + 4, r.seam[1], 30, C.red, 0.55 * pk);
        line(r.seam[0] + 4, r.seam[1] + 2, r.labSide[0] - 4, r.labSide[1] - 14, { color: C.red, w: 1.4, alpha: Math.max(0.4 * k, pk) });
        text(pk > 0.2 ? 'the gap closes\non the skin' : 'skin rests\nacross the gap', r.labSide[0] + 2, r.labSide[1] + 2, { size: 12, weight: 800, color: C.red, alpha: Math.max(0.6 * k, pk), lh: 1.3 });
      } else {
        line(r.trigEnd[0] + 3, r.trigEnd[1] - 4, r.labTop[0] - 2, r.labTop[1] + 4, { color: A, w: 1.4, alpha: 0.6 * k });
        text(pk > 0.2 ? 'it only slides: nothing closes' : 'the split faces up', r.labTop[0], r.labTop[1], { size: 12, weight: 800, color: A, alpha: k });
        text('the side is one fixed piece', r.labFixed[0], r.labFixed[1], { size: 12, weight: 700, color: C.mute, align: 'right', alpha: k });
      }
    });
    text('generic front section, right half. gap and travel exaggerated.', rx + rw - 28, wy + 430, { size: 11, weight: 600, color: C.faint, align: 'right', alpha: ep(t, 1.8, 2.2) });
    let ry = wy + 466;
    ry += text('"voted 3x more popular than the sideways-facing trigger cutouts": I couldn\'t trace the vote to a public poll. the reason, that a split on top can\'t pinch, holds up on paper.', rx + 28, ry, { size: 14, weight: 600, color: C.ink2, t, t0: 3.0, cps: 130, maxW: rw - 56, lh: 1.45 }).h + 12;
    text('change: build both on identical shells, tape over the cutouts, test 20 or more players in a random order, log pinches, then vote. do the straight rear cutouts (#17) anyway.', rx + 28, ry, { size: 14, weight: 800, color: C.ink, t, t0: 4.4, cps: 110, maxW: rw - 56, lh: 1.45 });
    captions(t, [[0.6, 'both could be right. neither has evidence yet, so neither belongs in the first model\'s pitch.']]);
  }
});

/* ---------- coating claims ---------- */
S({
  id: 'coatclaims', ch: 'surface', theme: 'night', title: 'say what the coating does', settle: 9, src: ['cerakoteGuide', 'cerakoteCure', 'cerakoteH', 'radtech', 'ppSurface', 'pmm', 'derler'],
  draw: t => {
    header(t, 'say what the coating does', { eyebrow: 'surface  //  #16' });
    const wx = LM, wy = 250, ww = 980, wh = 560, A = acc('surface');
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('two hardness scales that get mixed up', wx + 28, wy + 44, { size: 17, weight: 800, color: C.ink, t, t0: 0.9, cps: 70 });
    const sx0 = wx + 60, sw = ww - 120;
    text('pencil hardness (ASTM D3363), for coatings', sx0, wy + 100, { size: 15, weight: 800, color: A, alpha: ep(t, 1.0, 1.4) });
    const g = ['7B', '5B', '3B', 'B', 'HB', 'H', '3H', '5H', '7H', '8H', '9H'], gx = i => sx0 + sw * i / (g.length - 1), ky = wy + 160;
    line(gx(0), ky, gx(g.length - 1), ky, { color: C.faint, w: 1.5, alpha: ep(t, 1.1, 1.5) });
    const band = (i0, i1, label, col, t0, up) => { const k = ep(t, t0, t0 + 0.4); rect(gx(i0) - 8, ky - 8, gx(i1) - gx(i0) + 16, 16, { fill: rgba(col, 0.35), alpha: k }); text(label, (gx(i0) + gx(i1)) / 2, up ? ky - 18 : ky + 50, { size: 13, weight: 800, color: col, align: 'center', alpha: k }); };
    band(0, 2, 'soft-touch, 7B to 3B', C.red, 1.8, true); band(6, 6, 'air-cured, 3H', C.gray, 2.0, true); band(9, 9, 'oven H, 8H', A, 2.2, false); band(10, 10, 'Elite, 9H', A, 2.4, true);
    g.forEach((v, i) => { const k = ep(t, 1.2 + i * 0.04, 1.5 + i * 0.04); circle(gx(i), ky, 5, { fill: C.gray, alpha: k }); text(v, gx(i), ky + 28, { size: 13, weight: 700, color: C.mute, align: 'center', alpha: k }); });
    text('mineral hardness (Mohs), for stone and grit', sx0, wy + 266, { size: 15, weight: 800, color: C.ink, alpha: ep(t, 2.6, 3.0) });
    const my = wy + 306; line(sx0, my, sx0 + sw, my, { color: C.faint, w: 1.5, alpha: ep(t, 2.7, 3.1) });
    [['talc', 1], ['gypsum', 2], ['glass', 5.5], ['quartz sand', 7], ['corundum', 9], ['diamond', 10]].forEach(([n, v], i) => { const x = sx0 + sw * (v - 1) / 9, k = ep(t, 2.8 + i * 0.1, 3.1 + i * 0.1); circle(x, my, n === 'diamond' ? 9 : 6, { fill: n === 'diamond' ? C.red : C.gray, alpha: k }); text(n, x, my + 28, { size: 13, weight: 700, color: C.mute, align: n === 'diamond' ? 'right' : n === 'talc' ? 'left' : 'center', alpha: k }); });
    text('9H means the hardest pencil leaves no mark. it says nothing about sand or grit, which wear films away at a measured rate.', sx0, wy + 372, { size: 14, weight: 700, color: C.ink2, t, t0: 3.4, cps: 110, maxW: sw, lh: 1.45 });
    rule(wx + 28, wy + 424, wx + ww - 28, ep(t, 3.6, 4.0));
    text('and the grip: Cerakote sells Elite as its low-friction grade (μ 0.11 in its own test). on skin, texture and sweat decide the friction, which is what the etched texture (#60) is for.', wx + 28, wy + 462, { size: 15, weight: 700, color: C.ink, t, t0: 3.8, cps: 100, maxW: ww - 56, lh: 1.45 });
    recPanel(t, 1110, 250, W - LM - 1110, 560, { verdict: ['contradicted', 'contested'], doc: 'a baked ceramic coat that "cannot be rubbed off with anything short of" diamond, and grip like PMM\'s "extremely grippy" coat, without its durability issues.', evidence: 'the hardness figures are pencil grades measured on blasted steel, and plastics cure cooler. no published data covers adhesion to polypropylene, whose low surface energy resists coatings. PMM\'s grip has no published measurement.', change: 'quote "8H pencil, tested on the shell". run a cross-cut adhesion test on treated PP, and measure fingertip friction on the etched coat, dry and wet, before claiming grip.' });
    captions(t, [[0.6, 'the baked coating is the right call. both claims attached to it need one test each.']]);
  }
});

/* ---------- materials claims ---------- */
S({
  id: 'matclaims', ch: 'surface', theme: 'paper', title: 'carbon PP: the honest multiples', settle: 9, src: ['plabase20', 'denkaAbs', 'weldline', 'ppSurface', 'cfpps', 'az91d'],
  draw: t => {
    header(t, 'carbon PP: the honest multiples', { eyebrow: 'shell  //  #5, #6' });
    const wx = LM, wy = 250, ww = 980, wh = 560, A = acc('shell');
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('20% carbon PP (Pyrofil) against ABS, from the datasheets', wx + 28, wy + 44, { size: 17, weight: 800, color: C.ink, t, t0: 0.9, cps: 70 });
    tag(wx + 28, wy + 76, 'datasheet', ep(t, 1.0, 1.4)); tag(wx + 160, wy + 76, 'derived', ep(t, 1.0, 1.4));
    const bx = wx + 250, bw = ww - 400, X = v => bx + bw * v / 6, a0 = ep(t, 1.0, 1.4);
    for (const v of [0, 1, 2, 3, 4, 5, 6]) { line(X(v), wy + 120, X(v), wy + 318, { color: C.hair, w: 1, alpha: a0 }); text(v + '×', X(v), wy + 340, { size: 13, weight: 600, color: C.mute, align: 'center', alpha: a0 }); }
    const rows = [['stiffness', 5.29, '13.5 vs 2.55 GPa', A], ['strength', 2.4, '120 vs 50 MPa', C.red], ['density', 0.96, '1.01 vs 1.05 g/cm³', C.gray]];
    rows.forEach(([l, v, sub, c], i) => { const y = wy + 160 + i * 62, k = ep(t, 1.4 + i * 0.3, 2.2 + i * 0.3, E.snap), xe = bx + (X(v) - bx) * k; text(l, wx + 28, y + 6, { size: 16, weight: 800, color: C.ink, alpha: ep(t, 1.2 + i * 0.3, 1.6 + i * 0.3) }); text(sub, wx + 28, y + 28, { size: 13, weight: 600, color: C.mute, alpha: ep(t, 1.2 + i * 0.3, 1.6 + i * 0.3) }); rect(bx, y - 9, xe - bx, 20, { fill: c }); text(v.toFixed(v < 1 ? 2 : 1) + '×', xe + 10, y + 8, { size: 16, weight: 800, color: c, alpha: k }); });
    const k3 = ep(t, 2.8, 3.2); line(X(3), wy + 124, X(3), wy + 326, { color: C.ink, w: 2, dash: [7, 5], alpha: k3 }); text('the doc: "at least three times"', X(3) + 8, wy + 120, { size: 13, weight: 800, color: C.ink, alpha: k3 });
    rule(wx + 28, wy + 376, wx + ww - 28, ep(t, 3.2, 3.6));
    const cav = [['weld lines', 'where flow fronts meet, a filled part can be about half as strong'], ['anisotropy', 'fibres line up with the flow, so stiffness depends on direction'], ['surface energy', 'PP sits near 29 mN/m, so paint and glue need a treatment first']];
    cav.forEach(([h2, b], i) => { const x = wx + 28 + i * (ww - 56) / 3, k = ep(t, 3.4 + i * 0.3, 3.8 + i * 0.3); text(h2, x, wy + 414, { size: 15, weight: 800, color: A, alpha: k }); text(b, x, wy + 440, { size: 13, weight: 600, color: C.ink2, alpha: k, maxW: (ww - 56) / 3 - 24, lh: 1.45 }); });
    recPanel(t, 1110, 250, W - LM - 1110, 560, { verdict: ['keep', 'unverified'], doc: '#5: carbon PP is "at least three times stronger and stiffer" than ABS. #6: PPS triggers have a nanocrystalline structure like a metal\'s.', evidence: 'stiffness clears the bar at 5.3 times; strength doesn\'t, at 2.4. PPS is a semi-crystalline polymer, like nylon, not a metal: 30% carbon PPS is 17 GPa against magnesium\'s 46, and carbon conducts near the antenna.', change: 'say "five times stiffer and more than twice as strong". place gates so weld lines stay off load paths. call PPS crisper only after recording the click against PP.' });
    captions(t, [[0.6, 'carbon PP is still the right shell. the real multiples are a stronger pitch than the round one.']]);
  }
});

/* ---------- smaller electronics items ---------- */
S({
  id: 'elecclaims', ch: 'elec', theme: 'night', title: 'four smaller electronics fixes', settle: 9, src: ['paw3395', 'nrf54', 'nrf52', 'npm1300', 'iata'],
  draw: t => {
    header(t, 'four smaller electronics fixes', { eyebrow: 'electronics  //  #76, #77, #81, shipping' });
    const wx = LM, wy = 250, ww = W - 2 * LM, wh = 600, cw = (ww - 56) / 4, A = acc('elec');
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    for (const i of [1, 2, 3]) line(wx + 28 + i * cw - 14, wy + 30, wx + 28 + i * cw - 14, wy + wh - 30, { color: C.hair, w: 1, alpha: ep(t, 0.6, 1.0) });
    const cols = [
      ['#76 undervolt the sensor', 'contested', x => { miniBar(t, 1.2, x, wy + 176, cw - 170, 2.1, 2.4, C.gray, 'PAW3395 supply, allowed range', '1.8 to 2.1 V'); }, 'the doc wants the PAW3395 replaced, since it struggles on some glass pads, and the new sensor undervolted. the allowed supply range is narrow, and no one has published measurements of running below it.', 'use the newer sensor\'s own low-power modes; don\'t run any part out of spec.'],
      ['#77 the nRF54LM20A', 'keep', x => { miniBar(t, 1.5, x, wy + 160, cw - 190, 5.0, 6, C.gray, 'radio TX at 0 dBm, vs nRF52840', '5.0 vs 4.8 mA'); miniBar(t, 1.7, x, wy + 214, cw - 190, 3.3, 6, A, 'radio RX, vs nRF52840', '3.3 vs 4.6 mA'); }, 'right chip, partly for other reasons: transmit current isn\'t lower; receive current and CPU efficiency are. the nRF52840 already runs on one crystal with 1 MB of flash, and the 3.6 V limit means a lithium cell needs a PMIC.', 'keep it; sell the single-chip 8 kHz and the receive savings, and budget the nPM1300.'],
      ['#81 an Alps encoder, to match', 'contested', x => {
        /* side view: the encoder sets the axle, so a taller one lifts the wheel further above a low trigger */
        const k = ep(t, 1.8, 2.3), base = wy + 236, ty = wy + 196, R = 26;
        rr(x, base, cw - 60, 7, 2, '#55613c', null, 1, k);
        line(x, ty, x + cw - 60, ty, { color: C.mute, w: 1.4, dash: [6, 5], alpha: k }); text('trigger top', x, ty - 7, { size: 11, weight: 700, color: C.mute, alpha: k });
        [[x + 112, 40, C.red, 'taller encoder', 'too proud'], [x + 262, 24, A, 'lower encoder', 'sits right']].forEach(([cx, ah, col, lab, verdict], j) => {
          const ay = base - ah, kk = ep(t, 1.9 + j * 0.2, 2.4 + j * 0.2), rot = t * 1.6 + j;
          rr(cx - 15, ay - 13, 30, base - ay + 13, 3, '#8e959e', null, 1, kk); rr(cx - 11, ay - 9, 22, 18, 2, '#1e1f23', null, 1, kk);
          circle(cx, ay, R, { color: col, w: 2.2, alpha: kk }); circle(cx, ay, R - 6, { color: col, w: 1, alpha: kk * 0.4 });
          for (let n2 = 0; n2 < 20; n2++) { const a = rot + n2 * TAU / 20; line(cx + Math.cos(a) * (R - 3), ay + Math.sin(a) * (R - 3), cx + Math.cos(a) * R, ay + Math.sin(a) * R, { color: col, w: 1.2, alpha: kk * 0.6 }); }
          for (let n2 = 0; n2 < 6; n2++) { const a = rot + n2 * TAU / 6; line(cx + Math.cos(a) * 5, ay + Math.sin(a) * 5, cx + Math.cos(a) * (R - 6), ay + Math.sin(a) * (R - 6), { color: col, w: 1.4, alpha: kk * 0.55 }); }
          circle(cx, ay, 3, { fill: col, alpha: kk });
          const top = ay - R, bx = cx + R + 8; line(bx, top, bx, ty, { color: col, w: 1.6, alpha: kk }); line(bx - 4, top, bx + 4, top, { color: col, w: 1.6, alpha: kk }); line(bx - 4, ty, bx + 4, ty, { color: col, w: 1.6, alpha: kk });
          text(verdict, bx + 8, top + 4, { size: 12, weight: 800, color: col, alpha: kk });
          text(lab, cx, base + 22, { size: 11, weight: 800, color: col, align: 'center', alpha: kk });
        });
      }, 'the doc\'s own reply says it "also won\'t work with the super low trigger height". the reason given for it is the Japanese theme and a shared country of origin, and neither affects scrolling. encoders differ in detent feel, skip rate, life and height, and those can be measured.', 'test three encoders that fit the trigger height for skips over a long scroll run, and pick the winner.'],
      ['arrive almost fully charged', 'contested', x => { miniBar(t, 2.0, x, wy + 160, cw - 190, 30, 100, A, 'IATA, battery inside the device', '30% or less'); miniBar(t, 2.2, x, wy + 214, cw - 190, 90, 100, C.red, 'the doc', 'almost full'); }, 'for a battery packed inside a device (PI 967), IATA recommends shipping at 30% charge or less. it isn\'t mandatory, but carriers and forwarders work to it.', 'ship near 30%, and make the first charge fast: 0.3 A or more through the PMIC, with an honest gauge.']
    ];
    cols.forEach(([h2, v, viz, ev, ch], i) => {
      const x = wx + 28 + i * cw, k = ep(t, 0.8 + i * 0.4, 1.2 + i * 0.4);
      verdictChip(x, wy + 48, v, k);
      text(h2, x, wy + 100, { size: 17, weight: 800, color: C.ink, alpha: k, maxW: cw - 40 });
      viz(x);
      text(ev, x, wy + 280, { size: 14, weight: 600, color: C.ink2, t, t0: 1.2 + i * 0.4, cps: 130, maxW: cw - 44, lh: 1.45 });
      text('change: ' + ch, x, wy + 470, { size: 14, weight: 800, color: A, t, t0: 3.0 + i * 0.3, cps: 100, maxW: cw - 44, lh: 1.45 });
    });
    captions(t, [[0.6, 'none of these change much hardware. each swaps a guess for a measurement or a spec.']], { y: 1000 });
  }
});

/* ---------- shape tests ---------- */
S({
  id: 'shapetests', ch: 'shape', theme: 'paper', title: 'test the shape the way it\'ll be used', settle: 9, src: ['liwang', 'tang23', 'zowieLab', 'kuijt', 'aldien05'],
  draw: t => {
    header(t, 'test the shape the way it\'ll be used', { eyebrow: 'shape  //  #41, #44, #45' });
    const wx = LM, wy = 250, ww = 980, wh = 560, A = acc('shape');
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('comfort by hump position', wx + 28, wy + 44, { size: 17, weight: 800, color: C.ink, t, t0: 0.9, cps: 70 });
    tag(wx + 28, wy + 76, 'study', ep(t, 1.0, 1.4)); text('Li & Wang 2025, n = 10 general users, grip not separated', wx + 120, wy + 76, { size: 13, weight: 600, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const bars = [['baseline shape', 5.4, C.ink], ['peak 5 mm forward', 4.7, C.gray], ['peak 5 mm higher', 4.2, C.red], ['peak 5 mm further back', 4.2, C.red], ['peak 5 mm lower', 3.4, C.gray]];
    const bx = wx + 290, bw = ww - 420;
    bars.forEach(([l, v, col], i) => { const y = wy + 136 + i * 56, k = ep(t, 1.4 + i * 0.2, 2.0 + i * 0.2, E.snap); text(l, wx + 28, y + 6, { size: 15, weight: 700, color: C.ink2, alpha: k }); rect(bx, y - 10, bw * v / 7 * k, 20, { fill: col }); text(v.toFixed(1), bx + bw * v / 7 * k + 10, y + 6, { size: 16, weight: 800, color: col, alpha: k }); });
    text('comfort rating out of 7', bx + bw, wy + 420, { size: 13, weight: 600, color: C.faint, align: 'right', alpha: ep(t, 2.6, 3.0) });
    rule(wx + 28, wy + 446, wx + ww - 28, ep(t, 2.8, 3.2));
    text('the same ten people\'s muscle signals (EMG) couldn\'t tell the five shapes apart (p ≥ 0.489). their comfort ratings could (p = 0.019).', wx + 28, wy + 482, { size: 15, weight: 700, color: C.ink, t, t0: 3.0, cps: 100, maxW: ww - 56, lh: 1.45 });
    recPanel(t, 1110, 250, W - LM - 1110, 560, { verdict: ['contested', 'contradicted'], doc: '#41 move the hump higher and back for claw. #44 add contact area, found with a paint test. #45 EKG monitors for objective strain data.', evidence: 'EKG records the heart; muscle strain needs surface EMG, which ZOWIE and every study here use. higher and rear humps rated worse, but these weren\'t claw players. hand-tool research cares about pressure peaks, not total area.', change: 'use surface EMG with 16 or more players, split by grip and hand size, plus comfort scores. test #41 on claw players. keep the thermochromic contact maps, and add a pressure map: in one handle study, the largest handle went past peak-pressure limits at the base of the thumb.' });
    captions(t, [[0.6, 'these may still be right for claw grip. the data that exists wasn\'t collected on claw players, so collect it.']]);
  }
});

/* ---------- claims audit ---------- */
S({
  id: 'claims', ch: 'own', theme: 'night', title: 'numbers to reword before launch', settle: 9, src: ['facesMatter', 'airbnbPhotos', 'luJung', 'elder', 'chi2020', 'plabase20', 'denkaAbs', 'cerakoteH', 'curiosity', 'perseverance', 'lacetera', 'thomasMorwitz'],
  draw: t => {
    header(t, 'numbers to reword before launch', { eyebrow: 'claims  //  the copy deck' });
    const wx = LM, wy = 236, ww = W - 2 * LM, wh = 624;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const rows = [
      ['people in product photos', '"up to 30% more sales"', '+6.98% with reviewer faces; +8.98% occupancy for verified photos; some studies found people lowered liking', 'a hand on the mouse, turned for the viewer\'s hand (Elder & Krishna)'],
      ['custom sensor position (#27)', '"up to 14% of throughput"', 'about 4%, estimated; 14% is what the rear end of the mouse loses', '"about 4% more, tuned to you"'],
      ['ceiling-facing cutouts (#1)', '"voted 3x more popular"', 'no public poll found', 'quote your own blind test'],
      ['carbon PP (#5)', '"three times stronger and stiffer"', '5.3 times stiffer (13.5 vs 2.55 GPa), 2.4 times stronger (120 vs 50 MPa)', '"five times stiffer, over twice as strong"'],
      ['coating (#16)', '"short of diamond"', 'top of the pencil scale, 8H to 9H, measured on steel', '"8H pencil, tested on the shell"'],
      ['rover-tread wheel (#30)', 'Curiosity\'s tread', 'Curiosity\'s wheels tore at the chevron tips', 'Perseverance\'s 48 gentler grousers'],
      ['a run of 999 (#35)', '"looks more exclusive"', 'left-digit bias: cars at 79,999 miles sell like the 70,000s; 9-ending prices feel smaller', 'keep it: "one of 999"']
    ];
    const cx = [wx + 28, wx + 340, wx + 650, wx + 1220];
    ['claim', 'as written', 'what the sources say', 'say instead'].forEach((h2, i) => text(h2, cx[i], wy + 42, { size: 14, weight: 700, color: C.mute, alpha: ep(t, 0.6, 1.0) }));
    rows.forEach((r, i) => { const y = wy + 96 + i * 76, k = ep(t, 0.9 + i * 0.25, 1.3 + i * 0.25); if (i) rule(wx + 20, y - 30, wx + ww - 20, k); text(r[0], cx[0], y, { size: 15, weight: 800, color: C.ink, alpha: k, maxW: 290 }); text(r[1], cx[1], y, { size: 14, weight: 600, color: i === 6 ? C.ink2 : C.red, alpha: k, maxW: 280, lh: 1.4 }); text(r[2], cx[2], y, { size: 14, weight: 600, color: C.ink2, alpha: k, maxW: 540, lh: 1.4 }); text(r[3], cx[3], y, { size: 14, weight: 800, color: C.green, alpha: k, maxW: 470, lh: 1.4 }); });
    captions(t, [[0.6, 'the people buying this mouse check numbers. a claim that survives the check is worth more than a bigger one that doesn\'t.']], { y: 960 });
  }
});

/* ---------- the one the research backs: a run of 999 ---------- */
S({
  id: 'leftdigit', ch: 'own', theme: 'paper', title: 'one of 999 reads as hundreds', settle: 9, src: ['lacetera', 'thomasMorwitz', 'scarcity'],
  draw: t => {
    header(t, 'one of 999 reads as hundreds', { eyebrow: 'claims  //  #35, kept' });
    const wx = LM, wy = 250, ww = 980, wh = 560, A = acc('own');
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('the left digit sets the price of a used car', wx + 28, wy + 44, { size: 17, weight: 800, color: C.ink, t, t0: 0.9, cps: 70 });
    tag(wx + 28, wy + 76, 'study', ep(t, 1.0, 1.4)); text('Lacetera, Pope & Sydnor, NBER w17030, millions of wholesale car sales', wx + 120, wy + 76, { size: 13, weight: 600, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    /* an odometer rolling across the 80,000 mark */
    const ph = cyc(t, 1.4, 5), miles = t < 1.4 ? 79990 : Math.round(79990 + 20 * clamp(ph / 0.7)), ds = String(miles).padStart(6, '0'), ox = wx + 60, oy = wy + 120, kd = ep(t, 0.9, 1.4);
    for (let i = 0; i < 6; i++) { const x = ox + i * 54; rr(x, oy, 46, 64, 6, '#1c1d21', inkA(0.3), 1.2, kd); text(ds[i], x + 23, oy + 46, { size: 38, weight: 800, color: i === 1 ? (miles >= 80000 ? C.red : '#ecebe7') : '#ecebe7', align: 'center', alpha: kd }); }
    text('miles', ox + 340, oy + 44, { size: 15, weight: 700, color: C.mute, alpha: kd });
    text(miles >= 80000 ? 'now it reads as the 80,000s' : 'still reads as the 70,000s', ox + 420, oy + 44, { size: 15, weight: 800, color: miles >= 80000 ? C.red : A, alpha: kd });
    /* the price pattern: a slow slide with a step down at every 10,000 miles */
    const m = { x: wx + 90, y: wy + 240, w: ww - 140, h: 230 }, X = mi => m.x + m.w * (mi - 40000) / 80000, Y = v => m.y + m.h * (1 - v), ka = ep(t, 1.6, 2.0);
    line(m.x, m.y + m.h, m.x + m.w, m.y + m.h, { color: C.faint, w: 1.2, alpha: ka });
    for (let mi = 40000; mi <= 120000; mi += 10000) { line(X(mi), m.y, X(mi), m.y + m.h, { color: C.hair, w: 1, alpha: ka }); text((mi / 1000) + 'k', X(mi), m.y + m.h + 22, { size: 12, weight: 600, color: C.mute, align: 'center', alpha: ka }); }
    const pts = []; for (let mi = 40000; mi <= 120000; mi += 250) { const v = 0.92 - (mi - 40000) / 80000 * 0.5 - Math.floor((mi - 40000) / 10000) * 0.035; pts.push([X(mi), Y(v)]); }
    poly(pts, { color: A, w: 2.6, p: ep(t, 1.8, 3.4, E.lin) });
    text('sale price', m.x, m.y - 12, { size: 12, weight: 700, color: C.mute, alpha: ka });
    text('illustration of the pattern the paper found: prices drop discontinuously at every 10,000-mile mark', wx + 28, wy + wh - 20, { size: 12, weight: 600, color: C.faint, alpha: ep(t, 2.6, 3.0), maxW: ww - 56 });
    /* the serial run */
    const rx = 1110, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    verdictChip(rx + 28, wy + 46, 'keep', ep(t, 0.8, 1.2));
    const kb = ep(t, 1.2, 1.7);
    for (const [y0, top, tail, col] of [[wy + 120, '042', '/ 999', A], [wy + 250, '0042', '/ 1,000', C.gray]]) { rr(rx + 28, y0, rw - 56, 96, 10, inkA(0.04), inkA(0.16), 1.2, kb); text(top, rx + 52, y0 + 66, { size: 52, weight: 800, color: col, alpha: kb, ls: -2 }); text(tail, rx + 52 + tw(top, { size: 52, weight: 800, ls: -2 }) + 16, y0 + 62, { size: 26, weight: 700, color: C.mute, alpha: kb }); }
    text('a run of 999 reads as hundreds; 1,000 reads as thousands', rx + 28, wy + 392, { size: 15, weight: 800, color: C.ink, t, t0: 2.4, cps: 90, maxW: rw - 56, lh: 1.42 });
    text('the effect is measured on prices and odometers, not serials, so this is an inference. it points the same way the doc wants: smaller, rarer.', rx + 28, wy + 450, { size: 14, weight: 600, color: C.ink2, t, t0: 3.4, cps: 120, maxW: rw - 56, lh: 1.42 });
    captions(t, [[0.6, 'the doc\'s instinct holds. people read numbers from the left, and a run of 999 lands in the hundreds.']]);
  }
});

/* ---------- test plan ---------- */
S({
  id: 'testplan', ch: 'end', theme: 'paper', title: 'twelve tests before launch', settle: 9,
  draw: t => {
    header(t, 'twelve tests before launch', { eyebrow: 'test plan' });
    const wx = LM, wy = 232, ww = W - 2 * LM, wh = 640;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const tests = [['coating on PP', 'cross-cut adhesion and pencil hardness on the real shell, after plasma or flame treatment'], ['skin friction', 'fingertip μ on the etched coat, dry and wet'], ['click latency', 'wired and wireless, 1 and 8 kHz, at 0 ms debounce'], ['motion latency', 'the same rig the public charts use, so the numbers compare'], ['packet loss', 'a crowded 2.4 GHz room, carbon shell vs a window over the antenna'], ['lift-off', 'every 0.1 mm step on cloth, glass and hybrid pads'], ['aim at final weight', 'throughput at the final weight vs a build 10 g heavier'], ['EMG and comfort', '16 or more players, surface EMG, split by grip and hand size'], ['cutout blind test', 'ceiling-facing vs sideways, players not told which'], ['click sound', 'record decay and spectrum, PPS triggers vs PP'], ['encoder skips', 'skip rate over a long scroll run, three encoders'], ['haptic jitter', 'sensor counts with the motor firing and the mouse still']];
    const cw = (ww - 56) / 3;
    tests.forEach(([h2, b], i) => { const c = i % 3, r = Math.floor(i / 3), w = (ww - 56 - 48) / 3, x = wx + 28 + c * (w + 24), y = wy + 32 + r * 150, k = ep(t, 0.6 + i * 0.12, 1.0 + i * 0.12); rr(x, y, w, 128, 12, inkA(0.04), inkA(0.14), 1.2, k); text(String(i + 1).padStart(2, '0'), x + 24, y + 50, { size: 28, weight: 800, color: C.blue, alpha: k }); text(h2, x + 92, y + 46, { size: 18, weight: 800, color: C.ink, alpha: k }); text(b, x + 92, y + 76, { size: 14, weight: 600, color: C.ink2, alpha: k, maxW: w - 116, lh: 1.4 }); });
    captions(t, [[1.6, 'each of these turns a claim in the main deck into a measured number with your name on it.']], { y: 950 });
  }
});
