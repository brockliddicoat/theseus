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

