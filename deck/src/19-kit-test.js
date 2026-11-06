/* The motion kit's test page (F0a): every element of deck/src/06-motion.js animating, in both themes, and the exemplar
   demonstration in the standard's shape (common.md M1 to M10). Build: python3 tools/build.py kit → dist/kit.html.
   The API is in handoff/revamp2/KIT.md. */
const DECK = {
  chapters: [{ key: 'intro', name: 'Intro' }, { key: 'click', name: 'Clicks' }, { key: 'glide', name: 'Glide and tracking' }, { key: 'shell', name: 'Shell and structure' },
    { key: 'surface', name: 'Surface and details' }, { key: 'elec', name: 'Electronics' }, { key: 'shape', name: 'Shape' }, { key: 'own', name: 'Ownership' }, { key: 'end', name: 'Close' }],
  slides: []
};
const S = o => (DECK.slides.push(o), o);
function chapterIdeaCount(key) { return { click: 12, glide: 8, shell: 24, surface: 9, elec: 18, shape: 6, own: 8 }[key] || 0; }

/* ---------- 1. the simplified mouse, every view, parts lit ---------- */
[['night', 'n'], ['paper', 'p']].forEach(([th, sfx]) => {
  S({ id: 'kit_mouse_' + sfx, ch: 'click', theme: th, title: 'mouseSimple', settle: 3, draw: t => {
    header(t, 'The simplified mouse, five views');
    const lab = (s, x, y) => text(s, x, y, { role: 'label', size: 21, color: C.mute, align: 'center' });
    mouseFit([80, 300, 360, 600], 'top', { hi: ['rear'], lit: ep(t, 0.4, 1.0) }); lab("top: hi ['rear']", 260, 940);
    mouseFit([480, 300, 360, 600], 'bottom', { hi: ['skates'], col: 'rival', lit: ep(t, 0.5, 1.1), show: ['board'] }); lab("bottom: skates (rival), board", 660, 940);
    mouseFit([900, 300, 900, 300], 'left', { hi: ['side', 'wheel'], lit: ep(t, 0.6, 1.2) }); lab("left (side): side buttons, wheel", 1350, 620);
    mouseFit([900, 660, 520, 240], 'right', { hi: ['triggers'], lit: ep(t, 0.7, 1.3), show: ['battery', 'board'] }); lab('right: triggers; board, battery', 1160, 940);
    mouseFit([1460, 660, 380, 240], 'front', { hi: ['trigL'], col: 'bad', lit: ep(t, 0.8, 1.4) }); lab('front: trigL (bad)', 1650, 940);
  } });
});

/* ---------- 2. establish: the whole mouse, the part lit, one push-in, the locator ---------- */
S({ id: 'kit_establish', ch: 'click', theme: 'night', title: 'establish', settle: 3.2, draw: t => {
  header(t, 'Establish, then push in');
  const est = establish(t, 0.2, [80, 260, 1100, 700], { view: 'top', hi: ['rear'], focus: 'rear' });
  text('k ' + est.k.toFixed(2) + '   s ' + est.s.toFixed(1) + ' px/mm', 1240, 320, { role: 'label', size: 21, color: C.mute });
  const est2 = establish(t, 0.6, [1240, 380, 600, 580], { view: 'left', hi: ['side'], focus: 'side', locator: 'bl' });
}});

/* ---------- 3. agents and forces, time ---------- */
S({ id: 'kit_agents', ch: 'click', theme: 'paper', title: 'agents', settle: 4, draw: t => {
  header(t, 'Finger, force, press, spring');
  const d = pressCurve(t, 1.0, { hold: 0.6 }), y0 = 520;
  rect(140, y0, 520, 26, { fill: C.track }); rect(140, y0 + d * 14, 520, 26, { fill: C.comp });
  finger(330, y0 + d * 14, 0, { s: 4.2, press: d });
  forceArrow(330, y0 + d * 14 - 2, Math.PI / 2, 150, { N: 0.54, label: 'a click', t, t0: 0.9 });
  finger(1000, 560, -Math.PI / 2, { s: 5, view: 'top', press: d });
  finger(1400, 520, Math.PI + 0.12, { s: 3.4, press: d });
  /* the curves themselves */
  const gx = 140, gy = 760, gw = 700, gh = 150;
  line(gx, gy + gh, gx + gw, gy + gh, { color: C.hair, w: 1.5 });
  const pts = [], sp = [];
  for (let i = 0; i <= 140; i++) { const tt = i / 140 * 2.2; pts.push([gx + i * gw / 140, gy + gh - pressCurve(tt, 0.2, { hold: 0.6 }) * gh]); sp.push([gx + i * gw / 140, gy + gh - spring(tt, 0.2) * gh * 0.8]); }
  poly(pts, { color: C.hero, w: 3 }); poly(sp, { color: C.ink2, w: 2, dash: [6, 5] });
  text('pressCurve (blue), spring (dashed)', gx, gy - 14, { role: 'label', size: 21, color: C.mute });
  scaleNote(980, 820, 'about the weight of a 57 g egg', { lead: '0.56 N', t, t0: 1.2 });
}});

/* ---------- 4. compare: abSplit, wipeTo, verdict ---------- */
S({ id: 'kit_compare', ch: 'shell', theme: 'night', title: 'compare', settle: 4.5, draw: t => {
  header(t, 'Split, wipe, verdict');
  const { L, R } = abSplit(t, 0.2, [80, 260, 1000, 420], { rival: 'Sora V2', note: 'Same press, same scale' });
  rect(L[0] + 40, L[1] + 120, 300 * ep(t, 0.5, 1.2), 30, { fill: C.second });
  rect(R[0] + 40, R[1] + 120, 120 * ep(t, 0.7, 1.4), 30, { fill: C.hero });
  const box = [1140, 260, 700, 420];
  wipeTo(t, 1.2, 1.0, box, k => { rect(box[0] + 60, box[1] + 120, 560, 160, { fill: C.second, alpha: 0.5 }); text('Rival', box[0] + 80, box[1] + 220, { role: 'h2', color: C.ink }); },
    k => { rect(box[0] + 60, box[1] + 120, 560, 160, { fill: C.hero, alpha: 0.5 }); text('Theseus', box[0] + 80, box[1] + 220, { role: 'h2', color: C.ink }); }, { rival: 'Sora V2' });
  verdict(t, 1.6, 120, 880, { from: 48, to: 21.3, unit: 'MPa', label: 'Peak experienced stress', better: 'lower', who: ['Most mice', 'Theseus'] });
  verdict(t, 2.2, 1140, 880, { from: 1.0, to: 2.4, unit: '×', label: 'Load before it bends', better: 'higher', size: 120 });
}});

/* ---------- 5. the shot ---------- */
S({ id: 'kit_shot', ch: 'click', theme: 'night', title: 'shotInset', settle: 3, draw: t => {
  header(t, 'The missed shot, the made shot');
  shotInset(t, 0.3, 160, 320, 720, 460, { miss: true, label: 'The click twists your aim' });
  shotInset(t, 0.3, 1040, 320, 720, 460, { miss: false, label: 'The click goes straight down' });
}});

/* ---------- 6. teaching ---------- */
S({ id: 'kit_teach', ch: 'shell', theme: 'paper', title: 'demoPanel', settle: 3, draw: t => {
  header(t, 'The classroom version');
  const r = demoPanel(t, 0.3, [80, 280, 820, 560], { src: 'Gordon 1978' });
  rect(r[0] + 40, r[1] + 200, r[2] - 80, 18, { fill: C.comp, alpha: ep(t, 0.8, 1.2) });
  scaleNote(r[0], r[1] + r[3] - 10, 'thinner than a credit card (0.76 mm)', { lead: '0.6 mm wall', t, t0: 1.2 });
}});

/* ---------- 7. the ledger ---------- */
S({ id: 'kit_ledger', ch: 'end', theme: 'night', title: 'ledger', settle: 4.5, draw: t => {
  header(t, 'Zero compromises');
  ledger(t, 0.4, [80, 280, 1760, 560], { answered: 'all', turn: 1.6 });
  ledgerStrip(t, 0.6, 80, 900, 1760, { focus: 'shell', turn: 2.2 });
}});

/* ---------- 8. the chapter card ---------- */
[['night', 'n'], ['paper', 'p']].forEach(([th, sfx]) => {
  S({ id: 'kit_card_' + sfx, ch: 'click', card: true, theme: th, title: 'Clicks', settle: 5.5, draw: t => {
    chapterCard2(t, { part: { view: 'top', hi: ['triggers'] }, list: [['#17', 'Straight rear cutouts'], ['#46', 'A flat front: no wobble'], ['#2', 'Direct Drive Actuation'], ['#50', 'The bridge tensioner'], ['#3', 'Dual rail main clicks'], ['#79', 'Single pole, double throw']] });
  } });
});

/* ---------- 9. the exemplar: one complete demonstration in the standard's shape (common.md M1 to M10) ----------
   Establish on the mouse (front view, the left button lit), push in; the rival's button under a press: its bend line is
   curved, so the button turns about a tilted axis and rolls sideways under the finger; the wipe to Theseus under the same
   held press: a straight bend line, the button goes straight down; the verdict. A small top view shows the cause (the
   bend line itself) as the wipe straightens it. Generic on purpose: b02 owns the real slide (tensioners, the rival named,
   the player's benefit). Physics: a 4.6 mm smile across a 40 mm pair of tensioners (the deck's old derivation) leans the
   bend line 19.5° at the outer arm, so turning about it the button rolls tan 19.5° = 0.35° for every degree it tips; the
   front edge travels about 0.6 mm at 50 mm from the bend. Motion drawn 10×. */
const KX = { ex: 10, lean: Math.atan(0.354), tip: 0.6, arm: 50, seamY: -37.38, frontY: -10.84, pivot: [8, -37.38], contact: [17.5, -20] };
/** the left button's face seen from the front: the x ≥ 0 half of the triggers' outline (front view frame, mm) */
const KX_FACE = (() => {
  const P = MS_FRONT_TRIG.map(([x, y]) => [x, -y]), out = [];
  for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], ai = a[0] >= 0, bi = b[0] >= 0; if (ai) out.push(a); if (ai !== bi) { const k = a[0] / (a[0] - b[0]); out.push([0, a[1] + (b[1] - a[1]) * k]); } }
  return out;
})();
/** a point of the face moved by the press: tipped (front edge down by d mm, nothing at the bend) and rolled about the pivot */
function kx_move(p, d, roll) {
  const [px, py] = KX.pivot, X = p[0] - px, Y = p[1] - py, c = Math.cos(roll), s = Math.sin(roll), w = clamp((p[1] - KX.seamY) / (KX.frontY - KX.seamY));
  return [px + X * c - Y * s, py + X * s + Y * c + d * w];
}
/** draw the face (mm, in the establish camera): the rest outline as a dashed ghost, then the face where the press put it */
function kx_face(d, roll, col, k) {
  const path = pts => { const p = new Path2D(); pts.forEach((q, i) => i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])); p.closePath(); return p; };
  const rest = path(KX_FACE), moved = path(KX_FACE.map(q => kx_move(q, d, roll)));
  G.save(); G.globalAlpha = PA * k;
  G.setLineDash([lw(6), lw(5)]); G.strokeStyle = inkA(0.45); G.lineWidth = lw(1.5); G.stroke(rest); G.setLineDash([]);
  G.fillStyle = TH ? '#FFFFFF' : '#1A1B1E'; G.fill(moved);
  G.globalAlpha = PA * k * (TH ? 0.14 : 0.17); G.fillStyle = col; G.fill(moved);
  G.globalAlpha = PA * k; G.strokeStyle = col; G.lineWidth = lw(2.6); G.lineJoin = 'round'; G.stroke(moved);
  G.restore();
}
S({ id: 'kit_demo', ch: 'click', theme: 'night', title: 'The rear cutout, pressed', settle: 9, draw: t => {
  header(t, 'The rear cutout, pressed');
  captions(t, [[0.3, 'The button bends at its rear cutout. Most mice curve that cutout.'], [1.8, 'Press, and the curved bend line rolls the button sideways under your finger.'], [4.8, 'Cut it straight and the same press goes straight down.']]);
  const box = [80, 250, 1120, 640], ins = [1280, 250, 560, 400];
  /* where: the whole mouse from the front, the left button lit in neutral ink (the rival comes first), one push-in; the
     panel on the right is the locator and the cause at once (the same button from above), so establish's own is off */
  const est = establish(t, 0.0, box, { view: 'front', hi: ['trigL'], col: 'ink', focus: [-8, -43, 44, 40], hold: 0.4, dur: 1.0, locator: false, mouse: { dim: 0.5 } });
  /* the press: one input for both. Down at 2.0 s and held through the wipe; let go; pressed again on Theseus and held */
  const p1 = 1.5, p2 = 5.0, d = pressCurve(t, p1, { hold: 2.85, up: 0.25 }) + pressCurve(t, p2, { hold: 99 }), tipD = KX.ex * KX.tip * d, tipA = KX.ex * (KX.tip / KX.arm) * d;
  const kF = t < p2 - 0.2 ? ep(t, p1, p1 + 0.3, E.snap) : ep(t, p2, p2 + 0.3, E.snap), aF = clamp(d * 3);
  const side = rival => {
    const roll = rival ? tipA * Math.tan(KX.lean) : 0, col = rival ? C.second : C.hero, kd = est.kd;
    est.draw(() => kx_face(tipD, roll, col, kd));
    /* level: where the front edge sat before the press, and where it sits now */
    const xe = 26.5, e0 = est.P(0, KX.frontY), e1 = est.P(xe, KX.frontY), q0 = est.P(...kx_move([0, KX.frontY], tipD, roll)), q1 = est.P(...kx_move([xe, KX.frontY], tipD, roll));
    line(e0[0] - 24, e0[1], e1[0] + 24, e1[1], { color: inkA(0.45), w: 1.5, dash: [8, 7], alpha: kd });
    if (d > 0.02) line(q0[0], q0[1], q1[0], q1[1], { color: rival ? C.red : C.hero, w: 4, alpha: kd * clamp(d * 2) });
    const c = est.P(...kx_move(KX.contact, tipD, roll));
    forceArrow(c[0], c[1] - 4, Math.PI / 2, 130, { N: 0.54, label: 'a click', k: kF, alpha: aF * kd, color: C.ink });
    cursorPtr(c[0], c[1], { a: kd, press: d > 0.05 && d < 0.95 && t - (t < p2 ? p1 : p2) < 0.4 ? clamp((t - (t < p2 ? p1 : p2)) / 0.4) : 0 });
    const tagTo = [Math.min(box[0] + box[2] - 260, q1[0] + 120), Math.max(box[1] + 120, q1[1] - 150)];
    if (rival) faultTag(t, 1.75, q1, 'Rolls sideways', { to: tagTo, side: 'r' });
    else if (t > p2) fixTag(t, p2 + 0.25, q1, 'Straight down', { to: tagTo, side: 'r' });
  };
  wipeTo(t, 3.3, 0.9, box, () => side(true), () => side(false), { rival: 'Most mice', ly: box[1] + 44 });
  /* the panel's name: the rival's until the wipe starts, Theseus's once it has crossed (the wipe's own names carry it between) */
  ltag(box[0] + 32, box[1] + 44, 'Most mice', 'A curved rear cutout', { a: est.kd * (1 - ep(t, 3.25, 3.45)), size: 22, color: C.mute, vcolor: C.secondText });
  ltag(box[0] + 32, box[1] + 44, 'Theseus', 'A straight rear cutout', { a: ep(t, 4.15, 4.45), size: 22, color: C.heroText, vcolor: C.heroText });
  scaleNote(box[0], box[1] + box[3] + 46, 'one click, about the weight of a large egg', { lead: '0.54 N', t, t0: 1.9 });
  /* the cause, from above: the whole mouse, its bend line curved on most mice; straightened as the wipe crosses */
  const ki = ep(t, 0.15, 0.6), kw = ep(t, 3.3, 4.2, E.cam), kr = ep(t, 0.4, 0.9);
  if (ki > 0) {
    demoWindow(ins[0], ins[1], ins[2], ins[3], ki, {});
    text('From above: where it bends', ins[0] + 28, ins[1] + 44, { role: 'label', size: 21, color: C.mute, alpha: ki });
    const c = camFit(msView('top').box, [ins[0] + 60, ins[1] + 70, ins[2] - 60, ins[3] - 84], 0.04);
    withCam(c, ins, () => {
      mouseSimple('top', { hide: ['rear'], hi: ['trigL'], col: 'ink', lit: ki * (1 - kw * 0.6), dim: 0.6, alpha: ki });
      const seam = KEY.seam * MS_K.y, hw = msHalfW(seam) - 0.3, m = E.io3(kw), yAt = x => seam - 4.6 * (1 - m) * (x / 20) * (x / 20);
      const crv = new Path2D(); for (let x = -hw; x <= hw + 1e-6; x += 0.5) x === -hw ? crv.moveTo(x, yAt(x)) : crv.lineTo(x, yAt(x));
      const kc = ep(kw, 0.35, 0.65, E.lin);
      G.save(); G.lineCap = 'round'; G.lineWidth = lw(4);
      G.globalAlpha = PA * ki * (1 - kc); G.strokeStyle = mix(TH ? '#111111' : '#F3F2EE', HU.second[TH ? 0 : 1], kr); G.stroke(crv);
      G.globalAlpha = PA * ki * kc; G.strokeStyle = C.hero; G.stroke(crv);
      /* the bend at the left button's outer tensioner, against square */
      const xt = -15.4, sl = -2 * 4.6 * (1 - m) * xt / 400, L = 11, ux = 1 / Math.hypot(1, sl), uy = sl * ux, py = yAt(xt);
      G.globalAlpha = PA * kr * 0.9; G.setLineDash([lw(5), lw(4)]); G.lineWidth = lw(1.5); G.strokeStyle = inkA(0.55);
      G.beginPath(); G.moveTo(xt - L, py); G.lineTo(xt + L, py); G.stroke();
      G.strokeStyle = kc < 0.5 ? C.second : C.hero; G.lineWidth = lw(2); G.beginPath(); G.moveTo(xt - L * ux, py - L * uy); G.lineTo(xt + L * ux, py + L * uy); G.stroke(); G.setLineDash([]);
      G.restore();
    });
    const lean = Math.atan(0.354 * (1 - E.io3(kw))) * 180 / Math.PI, P = withCam(c, ins, null), lp = P(-msHalfW(KEY.seam) - 6, KEY.seam * MS_K.y - 6);
    text(lean.toFixed(1) + '°', lp[0], lp[1], { role: 'num', size: 28, weight: 750, color: kw < 0.5 ? C.secondText : C.heroText, align: 'right', alpha: kr });
  }
  /* the payoff: the cause, by how much, and what the player gets */
  verdict(t, 5.3, ins[0], 790, { from: 19.5, to: 0, unit: '°', dec: 1, size: 108, label: 'Bend line, off square', better: 'lower', who: ['Most mice', 'Theseus'], net: 'Straight down, every press' });
  source(t, 'Derived: a 4.6 mm smile over a 40 mm pair of tensioners leans the bend line 19.5°; the button rolls 0.35° per degree it tips. Motion drawn 10×.', { t0: 1.6 });
} });

/* ---------- 10. close up: the outlines and the finger at the zoom a push-in reaches ---------- */
S({ id: 'kit_zoom', ch: 'click', theme: 'night', title: 'close up', settle: 2, draw: t => {
  header(t, 'Close up: what a push-in sees');
  const cells = [[80, 260, 840, 330, 'left', [-64, -24, 30, 26], ['wheel']], [1000, 260, 840, 330, 'left', [-24, -32, 44, 22], ['side']],
    [80, 630, 560, 330, 'top', [-14, -60, 28, 36], ['wheel']], [680, 630, 560, 330, 'front', [-20, -40, 40, 26], ['seam']]];
  cells.forEach(([x, y, w, h, v, r, hi]) => { demoWindow(x, y, w, h, 1, {}); withCam(camFit(r, [x, y, w, h], 0.02), [x, y, w, h], () => mouseSimple(v, { hi, show: ['sensor'] })); text(v + ' ' + hi.join(', '), x + 20, y + h - 18, { role: 'label', size: 19, color: C.mute }); });
  demoWindow(1280, 630, 560, 330, 1, {});
  rect(1300, 860, 520, 4, { fill: C.comp });
  finger(1640, 860, 0, { s: 16, press: 0.6, len: 30 });
  text('finger, 16 px/mm', 1300, 940, { role: 'label', size: 19, color: C.mute });
} });

/* ---------- 11. the card with a two-line compromise and nine ideas (the layout's worst case) ---------- */
S({ id: 'kit_card_e', ch: 'elec', card: true, theme: 'night', title: 'Electronics', settle: 5.5, draw: t => {
  chapterCard2(t, { part: { view: 'top', hi: ['board'], show: ['battery'] }, list: [['#102', 'The radio, clear of the wheel'], ['#77', 'One chip, 8 khz'], ['sync', 'Frame sync: 202 → 42 µs'], ['link', 'Second Shot'], ['pmic', 'One chip runs the power'], ['#92', 'One board, one side, one reflow'], ['#69', 'Braided, not ribbon'], ['#23', 'Set it once, in the browser'], ['#70', 'Nothing lights up but the sensor']] });
} });

/* ---------- 12. the rival mouse (FILM F9): any mouse that isn't Theseus, five views, its anchors; beside Theseus ---------- */
[['night', 'n'], ['paper', 'p']].forEach(([th, sfx]) => {
  S({ id: 'kit_rival_' + sfx, ch: 'click', theme: th, title: 'mouseRival', settle: 3, draw: t => {
    header(t, 'A rival mouse, five views');
    const lab = (s, x, y, al = 'center') => text(s, x, y, { role: 'label', size: 20, color: C.mute, align: al });
    /* top, in x-ray: its hidden parts dashed, and the three places builders point at */
    const mt = rivalFit([80, 300, 250, 560], 'top', { show: ['switches', 'sensor', 'battery', 'board'] });
    callout(t, 0.3, mt.at('cable'), 'Cable exit', { to: [mt.at('cable')[0] + 150, mt.at('cable')[1] + 24] });
    callout(t, 0.4, mt.at('switchR'), 'Switches', { to: [mt.at('switchR')[0] + 130, mt.at('switchR')[1] + 70] });
    callout(t, 0.5, mt.at('sensor'), 'Sensor', { to: [mt.at('sensor')[0] + 150, mt.at('sensor')[1] + 40] });
    lab('top, x-ray: show board, battery,', 80, 900, 'left'); lab('switches, sensor', 80, 930, 'left');
    /* the side, nose right, the same three anchors */
    const mr = rivalFit([620, 290, 620, 250], 'right', { show: ['switches', 'sensor'] });
    callout(t, 0.6, mr.at('cable'), 'Cable exit', { to: [mr.at('cable')[0] + 20, mr.at('cable')[1] - 140], side: 'r' });
    callout(t, 0.7, mr.at('switch'), 'Switch', { to: [mr.at('switch')[0] - 150, mr.at('switch')[1] - 150], side: 'l' });
    callout(t, 0.8, mr.at('sensor'), 'Sensor', { to: [mr.at('sensor')[0] - 60, mr.at('sensor')[1] + 52], side: 'l' });
    lab("right (nose right)", 930, 600);
    /* the side, nose left, as the one named rival (yellow), with a lower hump further forward */
    rivalFit([620, 640, 620, 220], 'left', { col: 'rival', hump: 0.5, dims: [126, 64, 40] });
    lab("left: col 'rival', hump 0.5, dims 126 × 64 × 40", 930, 900);
    /* front and bottom */
    rivalFit([1420, 300, 210, 170], 'front', { show: ['port'] });
    lab('front: show port', 1525, 500);
    rivalFit([1660, 290, 180, 430], 'bottom');
    lab('bottom', 1750, 760);
    /* one scale: Theseus's simplified mouse (the only whole Theseus) beside a rival */
    const s = 2.1, yb = 920, V = msView('right'), cx = V.box[0] + V.box[2] / 2;
    part(1420 - cx * s, yb, s, () => mouseSimple('right', {}));
    part(1700, yb, s, () => mouseRival('right', {}));
    lab('Theseus: mouseSimple', 1420, 966); lab('Rival: mouseRival', 1700, 966);
  } });
});
S({ id: 'kit_rival_dims', ch: 'click', theme: 'night', title: 'mouseRival dims', settle: 3, draw: t => {
  header(t, 'Rivals sized from their dims, on one scale');
  const lab = (s, x, y, al = 'left') => text(s, x, y, { role: 'label', size: 20, color: C.mute, align: al });
  /* three sizes, side views on one pad line and top views nose right (as b01 and b09 draw rows), all at one scale */
  const s = 3.0, rows = [[[116, 60, 37], 'small 116 × 60 × 37'], [[120, 63, 39], 'default 120 × 63 × 39'], [[128, 67, 43], 'large 128 × 67 × 43']];
  rows.forEach(([d, name], i) => {
    const x = 300 + i * 520;
    part(x, 520, s, () => mouseRival('right', { dims: d }));
    part(x, 760, s, () => mouseRival('top', { dims: d }), { rot: Math.PI / 2 });
    lab(name, x - 180, 330);
  });
  line(80, 520, 1840, 520, { color: C.hair, w: 1.5 });
  /* colours: grey (any rival), the one you name (yellow), a fault in the whole body (red), and the outline drawn on */
  const cols = [['grey', 'grey (default)', 1], ['rival', "col 'rival'", 1], ['bad', "col 'bad'", 1], ['grey', 'reveal', ep(t, 0.3, 1.6)]];
  cols.forEach(([c, name, rv], i) => { const x = 220 + i * 300; part(x, 950, 1.3, () => mouseRival('right', { col: c, reveal: rv })); lab(name, x, 990, 'center'); });
  part(1500, 950, 1.3, () => mouseRival('right', { hump: 0.5 })); lab('hump 0.5', 1500, 990, 'center');
  part(1740, 950, 1.3, () => mouseRival('right', { hump: 0.66 })); lab('hump 0.66', 1740, 990, 'center');
} });

/* ---------- 13. verdict's edge cases: a short old value under a long rival name; % takes a space, ° and × attach ---------- */
S({ id: 'kit_verdict', ch: 'own', theme: 'paper', title: 'verdict', settle: 4, draw: t => {
  header(t, 'The verdict: names that never overlap');
  verdict(t, 0.2, 120, 450, { from: 0, to: 4, unit: 'repairs', dec: 0, size: 110, label: 'Switch swaps before the threads strip', better: 'higher', who: ['Plastic threads, ten re-screws', 'Theseus'] });
  verdict(t, 0.4, 1000, 450, { from: 2, to: 9, unit: 'H', dec: 0, size: 110, label: 'Pencil hardness', better: 'higher', who: ['UltralightX', 'Theseus'], net: false });
  verdict(t, 0.6, 120, 800, { from: 0.007, to: 0, unit: '%', dec: 3, size: 110, label: 'Share of the battery, idle', better: 'lower', who: ['Viper V4 Pro', 'Theseus'] });
  verdict(t, 0.8, 1000, 800, { from: 19.5, to: 0, unit: '°', dec: 1, size: 110, label: 'Bend line, off square', better: 'lower', who: ['Most mice', 'Theseus'] });
  verdict(t, 1.0, 1840, 960, { from: 1.0, to: 2.4, unit: '×', dec: 1, size: 80, label: 'Load before it bends', better: 'higher', who: ['Most mice', 'Theseus'], align: 'right' });
} });
