/* ============================================================================================
   V5 (2026-11-06): moves 4 and 5 of the v23 refinement. Brock (15:12, 15:15): "show the steps to level something up to
   where it becomes the best, it has to be a process"; "the concepts should visible and statically show how they build upon
   one another". F64.13: "each slide and a recap with all the gains".
   - v5_clickRungs(): move 4's six upgrades, each with the figure its own slide proves, read from that slide's constants and
     helpers (30-b02-clicks.js, 30-b03-switch.js); nothing typed here. A rung whose figure can't be read shows none.
   - v5_cardStat(n): the line under the loadout on the move 4 and move 5 cards (FILM.moves[n].stat). Move 4 fills no bar
     (the click bar is off: Brock, 17:00, "Leave it out"), so its card says what it gains; move 5 says what earns the motion
     bar's first step.
   - clickup: move 4's ladder, after the side buttons (the shell's ladder, shellup, is V3's in 25-film.js; same layout).
   Runs after 25-film.js's top level only inside draw functions (FILM, LO and film_* are read at draw time).
   ============================================================================================ */
/** the figure the slide prints, rounded the way it rounds (never our way: the rival's figure down, Theseus's up) */
const v5_dn = (v, d) => (Math.floor(v * Math.pow(10, d) + 1e-9) / Math.pow(10, d)).toFixed(d);
const v5_up = (v, d) => (Math.ceil(v * Math.pow(10, d) - 1e-9) / Math.pow(10, d)).toFixed(d);
function v5_clickRungs() {
  if (v5_clickRungs.v) return v5_clickRungs.v;
  const tr = f => { try { return f(); } catch (e) { return null; } };
  const out = [];
  /* 1. direct drive (b02_direct): the press's share running across an upright switch, sin of the post's arc */
  const dd = tr(() => (Math.sin(B02.arc) * 100).toFixed(1));
  out.push({ name: 'Direct drive', on: 'Builds on moves 2 and 3: a top that doesn’t flex', icon: 'axis',
    fig: dd ? dd + ' → 0.0 %' : '', figL: 'of the press running across the switch' });
  /* 2. the bridge (b02_tensioner): the click the finger feels, the GT01's own force included */
  const br = tr(() => { const cF = clk_ten('flat', 'ppcf').clk, cB = clk_ten('bridge', 'ppcf').clk; return [(cF.gf + B02_TN.sw).toFixed(1), (cB.gf + B02_TN.sw).toFixed(1)]; });
  out.push({ name: 'The bridge', on: 'Builds on 1: the stiff top bends only at its crown', icon: 'bridge',
    fig: br ? br[0] + ' → ' + br[1] + ' gf' : '', figL: 'the click your finger feels' });
  /* 3. straight cutouts (b02_cutouts): the click's spread across the button, the Sora V2's smile against a straight cut */
  const ct = tr(() => { const Q = B02_CT, p = [[-B02.sw.x + Q.dx, Q.zP], [-B02.sw.x - Q.dx, Q.zP]]; return (b02_clickGf2(1, ...p[1]) - b02_clickGf2(1, ...p[0])).toFixed(1); });
  out.push({ name: 'Straight cutouts', on: 'Builds on 2: each bridge cut square to the press', icon: 'cut',
    fig: ct ? ct + ' → 0.0 gf' : '', figL: 'click force spread across the button' });
  /* 4. dual rails (b02_rails): play at the fingertip, the guide's gap times the lever */
  const rl = tr(() => { const Q = B02_RL, H = b02_hinge(0), Lp = Q.pA - H.c[1], LB = Q.pB - H.c[1], play = (g, L) => 2 * g * (Q.fz - H.c[1]) / L; return [v5_dn(play(Q.gapBare, Lp), 2), v5_up(play(Q.gapPom, LB), 2)]; });
  out.push({ name: 'Dual rails', on: 'Builds on 3: two posts, one plane of motion', icon: 'rails',
    fig: rl ? rl[0] + ' → ' + rl[1] + ' mm' : '', figL: 'side-to-side play at your fingertip' });
  /* 5. a flat front (b02_front): how far the button's outer edge rocks between two presses, grooved to the edge vs flat */
  const fr = tr(() => { const Q = B02_FT, uE = 26, y = b02_frontY(1, 1).lip(uE), pose = u => b02_frontPose(1, 1, 1, b02_frontReach(u)); return Math.abs(pose(Q.u[0]).map(uE, y)[1] - pose(Q.u[1]).map(uE, y)[1]).toFixed(2); });
  out.push({ name: 'A flat front', on: 'Builds on 4: it lands flat wherever you press', icon: 'flat',
    fig: fr ? fr + ' → 0.00 mm' : '', figL: 'rock at the button’s outer edge' });
  /* 6. the switch (b03_timing, b03_switch): counted as the pole leaves NC; drains nothing until pressed */
  const sw = tr(() => ({ ms: b03_floor(B03.flightMs - B03_TM.ours, 1), life: b03_floor(B03.lifeGain * 100, 0) }));
  out.push({ name: 'The switch', on: 'Builds on all five: the press, read first', icon: 'switch',
    fig: sw ? '−' + sw.ms + ' ms' : '', figL: 'counted before the switch closes' });
  return (v5_clickRungs.v = out);
}
/** a rung's picture, in a box (cx, cy, s: half its size), drawn in col: the shell ladder's style (film_upIcon) */
function v5_upIcon(kind, cx, cy, s, col, a) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a; G.strokeStyle = col; G.fillStyle = col; G.lineWidth = 2.6; G.lineCap = 'round'; G.lineJoin = 'round';
  const L = (pts, close) => { G.beginPath(); pts.forEach((q, i) => (i ? G.lineTo(cx + q[0] * s, cy + q[1] * s) : G.moveTo(cx + q[0] * s, cy + q[1] * s))); if (close) G.closePath(); G.stroke(); };
  if (kind === 'axis') {          /* a trigger pressing straight down the axis of a tilted switch */
    L([[-0.95, -0.55], [0.6, -0.2]]);
    G.save(); G.translate(cx + 0.2 * s, cy + 0.35 * s); G.rotate(0.35); G.strokeRect(-0.42 * s, -0.22 * s, 0.84 * s, 0.6 * s); G.restore();
    L([[0.12, -0.32], [0.24, 0.05]]); L([[0.12, 0.0], [0.24, 0.05], [0.3, -0.06]]);
  } else if (kind === 'bridge') { /* a tensioner: the screw block, and an arch thinning at its crown */
    G.fillRect(cx - s * 1.0, cy - s * 0.1, s * 0.35, s * 0.55);
    G.beginPath(); G.moveTo(cx - s * 0.65, cy + s * 0.3); G.quadraticCurveTo(cx, cy - s * 0.85, cx + s * 0.65, cy + s * 0.3); G.stroke();
    L([[0.65, 0.3], [0.65, -0.55], [1.0, -0.55]]);
  } else if (kind === 'cut') {    /* a button from above, its rear cut straight across, square to the press */
    L([[-0.55, -0.95], [0.55, -0.95], [0.55, 0.55], [-0.55, 0.55]], true); L([[-0.95, 0.55], [0.95, 0.55]]);
    G.beginPath(); G.arc(cx, cy - s * 0.2, s * 0.14, 0, TAU); G.fill();
  } else if (kind === 'rails') {  /* two posts in their guides */
    for (const x of [-0.45, 0.45]) { L([[x - 0.22, -0.9], [x - 0.22, 0.75]]); L([[x + 0.22, -0.9], [x + 0.22, 0.75]]); G.fillRect(cx + (x - 0.1) * s, cy - 0.55 * s, 0.2 * s, 1.2 * s); }
  } else if (kind === 'flat') {   /* a flat front landing flat on its ledge */
    L([[-0.95, -0.3], [0.95, -0.3]]); L([[-0.95, 0.05], [0.95, 0.05]]); L([[-0.95, 0.5], [-0.95, 0.05]]); L([[0.95, 0.5], [0.95, 0.05]]);
    L([[0, -0.95], [0, -0.45]]); L([[-0.14, -0.6], [0, -0.45], [0.14, -0.6]]);
  } else if (kind === 'switch') { /* SPDT: the pole leaving NC for NO */
    G.beginPath(); G.arc(cx - s * 0.7, cy + s * 0.3, s * 0.12, 0, TAU); G.fill();
    L([[-0.7, 0.3], [0.55, -0.45]]); L([[0.55, -0.62], [0.95, -0.62]]); L([[0.55, 0.42], [0.95, 0.42]]);
  }
  G.restore();
}
/** the card's line under the loadout (FILM.moves[n].stat) */
function v5_cardStat(n) {
  if (n === 4) {
    const R = v5_clickRungs(), f = i => (R[i] && R[i].fig) || '';
    const ft = typeof b01_pressTgt === 'function' ? fmtN(b01_pressTgt(), 1) : null, sx = typeof lo_fm === 'function' ? lo_fm('Starlight X') : null;
    const two = s0 => s0.split(' → '), sw = typeof B03 !== 'undefined' && typeof B03_TM !== 'undefined' ? b03_floor(B03.flightMs - B03_TM.ours, 1) : null;
    return 'No bar to fill: on Finalmouse’s rig the magnetic Starlight X leads press to PC' + (sx != null ? ' (' + fmtN(sx, 1) + ' ms' + (ft ? '; Theseus under ' + ft + ' ms, derived' : '') + ')' : '') + '. What it gains: ' +
      f(0) + ' of the press across the switch, a felt click of ' + (two(f(1))[1] || f(1)) + ' not ' + (two(f(1))[0] || '') + ', ' + (two(f(3))[1] || '') + ' of play' + (sw ? ', counted ' + sw + ' ms before the switch closes' : '') +
      (typeof B03 !== 'undefined' ? ', and +' + b03_floor(B03.lifeGain * 100, 0) + ' % battery for move 6' : '') + '.';
  }
  if (n === 5 && typeof B04R !== 'undefined') return 'Motion latency, the first of its two steps: after a lift the sensor’s frames go out as they come, ' + B04R.nT + ' at a time, not ' + B04R.nR + ' averaged, from a lens held in its 0.2 mm window. Move 6 sends them at 8 khz.';
  return null;
}
const V5_UP_T = { r0: 0.6, per: 0.9, res: 6.3, unl: 7.6 };
S({ id: 'clickup', ch: 'click', theme: 'night', title: 'Six upgrades, one click', settle: 9.8,
  src: ['clk_gt01', 'b03_toms', 'clk_xbabClick', 'b03_gpx2Hours'],
  draw: t => {
    header(t, 'Six upgrades, one click');
    const T = V5_UP_T, rungs = v5_clickRungs(), N = rungs.length;
    captions(t, [[0.3, 'The giants tune the switch and leave the button to flex. Theseus stacks six upgrades, each built on the one before it.'],
      [T.res - 0.2, 'Together: the same click wherever you press, counted the moment it starts, from switches that draw nothing until pressed.']]);
    /* the ladder, bottom up: the first upgrade at the foot. Frame one shows every rung, waiting; each lands in turn */
    const x = LM, w = 1060, rh = 84, gap = 14, yTop = 282, yOf = i => yTop + (N - 1 - i) * (rh + gap);
    rungs.forEach((r, i) => {
      const y = yOf(i), t0 = T.r0 + i * T.per, k = ep(t, t0, t0 + 0.45, E.snap), kf = ep(t, t0 + 0.25, t0 + 0.7), lit = k > 0.5;
      rr(x, y, w, rh, 6, lit ? rgba(C.hero, TH ? 0.08 : 0.13) : C.panel, null, 0, 1);
      if (k > 0.003) { G.save(); G.globalAlpha = k; G.strokeStyle = rgba(C.hero, 0.7); G.lineWidth = 1.6; rrPath(x + 0.8, y + 0.8, w - 1.6, rh - 1.6, 6); G.stroke(); G.restore(); }
      text(String(i + 1), x + 34, y + rh / 2 + 12, { font: 'disp', size: 32, weight: 800, color: lit ? C.heroText : C.faint, align: 'center' });
      v5_upIcon(r.icon, x + 108, y + rh / 2, 22, lit ? C.heroText : C.faint, 1);
      text(r.name, x + 160, y + 37, { role: 'h3', size: 27, weight: 750, color: lit ? C.ink : C.mute, sentence: false });
      text(r.on, x + 160, y + 68, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: lit ? 1 : 0.6, maxW: 600, sentence: false });
      if (r.fig) { text(r.fig, x + w - 26, y + 44, { font: 'disp', size: 34, weight: 800, color: C.heroText, grad: C.heroGrad, align: 'right', alpha: kf, tnum: true });
        text(r.figL, x + w - 26, y + 70, { role: 'small', size: 18, weight: 600, color: C.ink2, align: 'right', alpha: kf, maxW: 380, sentence: false }); }
      if (i > 0) { const kb = ep(t, t0 - 0.1, t0 + 0.4, E.io3), ya = yOf(i - 1) - 3, yb = y + rh + 3; if (kb > 0.003) arrow(x + 34, ya, x + 34, lerp(ya, yb, kb), { color: C.hero, w: 2.5, hs: 8, p: 1, alpha: 1 }); }
    });
    /* what the player gets, then what it hands on */
    const rx = 1220, rw = RM - rx, kR = ep(t, T.res, T.res + 0.4);
    text('What your finger gets', rx, 330, { role: 'label', size: 20, color: C.heroText, alpha: kR });
    [['The same click', 'wherever on the button you press'], ['Straight down', 'no twist, no rattle, no rock'], ['Counted first', 'the moment the press starts']].forEach(([a0, b0], j) => {
      const y = 392 + j * 82, kj = ep(t, T.res + 0.15 + j * 0.3, T.res + 0.55 + j * 0.3);
      text(a0, rx, y, { role: 'h3', size: 30, weight: 800, color: C.ink, alpha: kj, sentence: false });
      text(b0, rx, y + 32, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: kj, maxW: rw, sentence: false });
    });
    const ku = ep(t, T.unl, T.unl + 0.4);
    text('Unlocks', rx, 690, { role: 'label', size: 20, color: C.mute, alpha: ku });
    const life = typeof B03 !== 'undefined' ? b03_floor(B03.lifeGain * 100, 0) : null;
    [[6, 'Switches that draw nothing until pressed' + (life ? ': +' + life + ' % battery, same battery' : '')], [9, 'A click with nothing given up for it']].forEach(([n, s0], j) => {
      const y = 738 + j * 96, kj = ep(t, T.unl + 0.2 + j * 0.35, T.unl + 0.6 + j * 0.35);
      circle(rx + 16, y - 8, 15, { color: C.heroText, w: 2, alpha: kj });
      text(String(n), rx + 16, y - 1, { role: 'label', size: 19, color: C.heroText, align: 'center', alpha: kj });
      text('Move ' + n + ': ' + FILM.moves[n].name, rx + 48, y - 1, { role: 'small', size: 22, weight: 750, color: C.ink, alpha: kj, sentence: false });
      text(s0, rx + 48, y + 27, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: kj, maxW: rw - 48, sentence: false });
    });
    source(t, 'Each figure is its own slide’s: Direct Drive Actuation, the bridge tensioner (GT01 included), straight rear cutouts (against the Sora V2’s), dual rails, a flat front, negative latency and the switch’s drain (derived; XBAB, Tom’s Hardware, Logitech’s hours).', { t0: 1.0, maxW: 1060 });
  }
});
