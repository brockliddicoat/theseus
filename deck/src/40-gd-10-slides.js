/* ============================================================================================
   40-gd slides. One idea per slide, each caption with its motion; outlines true scale, the millimetres in labelled,
   magnified strips. Blue: the descended shape; yellow: the Sora and the ULX; red: faults only; fingers grey.
   ============================================================================================ */

/* ============================== 1. title ============================== */
S({
  id: 'gd_title', ch: 'shape', theme: 'night', title: 'Shape, by gradient descent', settle: 8,
  src: ['gdModel', 'gdBrock'],
  draw: t => {
    header(t, 'Shape, by gradient descent', { noIdeas: true });
    gdCaptions(t, [[0.6, 'Every mouse shape is a set of curves. Fit them as arcs, and every curve becomes a number you can change.'],
      [4.4, 'Then let the hand at rest set the numbers: one valley under each finger that holds the mouse, none under the ring finger.']], { maxW: 980 });
    const T_ = gdTr(), box = [1120, 280, 640, 660], m = gdTopFit(box, { ur: 34 });
    /* the Sora's outline arrives arc by arc, both sides at once, with a handle at every join */
    const arcs = GD.arcs.plan, n = arcs.length;
    arcs.forEach((A_, i) => {
      const k = ep(t, 0.5 + i * 0.32, 0.9 + i * 0.32, E.io3); if (k <= 0) return;
      for (const sd of [-1, 1]) poly(m.P(A_.pts, sd), { color: i % 2 ? C.second : mix(C.second, '#FFFFFF', 0.35), w: 3, p: k });
      if (k >= 1) for (const sd of [-1, 1]) { const q = m.P([A_.a], sd)[0]; circle(q[0], q[1], 5, { fill: C.bg, color: C.second, w: 2 }); }
    });
    /* then the descended outline, true scale, over it */
    const kd = ep(t, 3.3, 4.3, E.cam);
    if (kd > 0) poly(gdOutline(m, T_.planL, T_.planR), { color: C.hero, w: 3.5, p: kd, close: false });
    /* the four minima, and the ring finger's shoulder (no minimum) */
    const kp = ep(t, 4.6, 5.2), pulse = 1 + 0.18 * Math.sin(Math.max(0, t - 5.2) * 3) * Math.exp(-Math.max(0, t - 5.2) * 0.6);
    const zg = T_.targets.station_z, ug = T_.groove.u_bottom;
    const pts = [['Thumb', m.X(gdSide(T_.planL)(T_.thumb.z_bottom), -1), m.Y(T_.thumb.z_bottom), 'l'], ['Pinky', m.X(gdSide(T_.planR)(T_.pinky.z_bottom), 1), m.Y(T_.pinky.z_bottom), 'r'],
      ['Index', m.X(ug, -1), m.Y(zg), 'u'], ['Middle', m.X(ug, 1), m.Y(zg), 'u']];
    pts.forEach(([nm, x, y, sd], i) => {
      const a = kp * ep(t, 4.6 + i * 0.12, 5.0 + i * 0.12); if (a <= 0) return;
      circle(x, y, 9 * pulse, { fill: C.hero, alpha: a }); circle(x, y, 18 * pulse, { color: C.hero, w: 2, alpha: 0.35 * a });
      if (sd === 'u') text(nm, x, y - 30, { role: 'label', size: 21, color: C.heroText, align: 'center', alpha: a });
      else text(nm, x + (sd === 'l' ? -30 : 30), y + 8, { role: 'label', size: 21, color: C.heroText, align: sd === 'l' ? 'right' : 'left', alpha: a });
    });
    const ka = ep(t, 5.4, 5.9), rx = m.X(T_.ring.u, 1), ry = m.Y(T_.targets.station_z - 6);
    circle(rx, ry, 9, { color: C.ink2, w: 2, alpha: ka }); text('Ring: no valley', rx + 30, ry + 8, { role: 'label', size: 20, color: C.mute, alpha: ka });
    text('Sora V2, fitted with arcs, true scale', box[0] + box[2] / 2, box[1] + box[3] + 24, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: ep(t, 1, 1.5) });
    /* left: the claim, in three numbers */
    const best = GD.trials[gdBest()];
    const cell = bento(LM, 520, 920, 320, 3, 1);
    statTile(t, 5.6, cell(0, 0), { value: '4', label: 'Valleys, one per finger', quiet: true, count: false });
    statTile(t, 5.75, cell(1, 0), { value: fmtN(GD.arcs.err.plan.rms, 2), unit: 'mm', label: 'Arc fit to the Sora (top view, RMS)', quiet: true, count: false });
    statTile(t, 5.9, cell(2, 0), { value: fmtN(best.dev_sora, 2), unit: 'mm', label: 'The most the outline moves', hero: true, count: false });
    text('Brock Liddicoat, shape designer of the Finalmouse Starlight X', LM, 900, { role: 'small', size: 25, weight: 650, color: C.mute, alpha: ep(t, 1.2, 1.8) });
    source(t, 'Sora V2 base: 3d/shell/shell-sora.glb, from Brock\'s scan. Fit and descent: derived (deck/tools/gd).', { t0: 1.5, maxW: 960 });
  }
});

/* ============================== 2. opinion, then a number ============================== */
S({
  id: 'gd_number', ch: 'shape', theme: 'paper', title: 'Shape is opinion. Make it a number.', settle: 10,
  src: ['gdTpu', 'gdModel'],
  draw: t => {
    header(t, 'Shape is opinion. Make it a number.', { noIdeas: true });
    gdCaptions(t, [[0.6, 'A review describes a shape in words. The same shape, measured, is three widths: how far the sides come in, and how far the front flares.'],
      [5.4, 'The study turns every rule into a term of one number, the loss. Lower is better, and gradient descent lowers it.']]);
    /* left: the words */
    const L0 = [LM, 300, 860, 300], aL = tileA(t, 0.3, 0);
    demoWindow(...L0, aL);
    text('How a review describes the UltralightX', L0[0] + 32, L0[1] + 52, { role: 'label', size: 21, color: C.mute, alpha: aL });
    text('TechPowerUp', L0[0] + L0[2] - 32, L0[1] + 52, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: aL, caps: false });
    /* one quote (the review's word for the waist), the rest paraphrased */
    const r_ = text('"The sides do curve in, but essentially are straight at the middle."', L0[0] + 32, L0[1] + 112, { role: 'body', size: 28, color: C.ink2, t, t0: 0.9, cps: 60, alpha: aL, sentence: false, maxW: L0[2] - 64, lh: 1.25 });
    text('It adds that the ends barely flare, and that the main buttons have fairly deep comfort grooves.', L0[0] + 32, L0[1] + 112 + r_.lines.length * 35 + 30, { role: 'small', size: 24, weight: 560, color: C.mute, alpha: aL * ep(t, 2.2, 2.7), maxW: L0[2] - 64 });
    /* the same shape, measured: three widths, and what they mean per side */
    const W0 = [LM, 640, 860, 300], aW = tileA(t, 3.6, 0);
    demoWindow(...W0, aW);
    text('The same shape, measured', W0[0] + 32, W0[1] + 52, { role: 'label', size: 21, color: C.mute, alpha: aW });
    const w = GD.ulx.widths, rows = [['Rear', w.rear], ['Grip', w.grip], ['Front', w.front]];
    rows.forEach(([nm, v], i) => {
      const x = W0[0] + 32 + i * 270, k = ep(t, 3.8 + i * 0.25, 4.6 + i * 0.25);
      text(nm, x, W0[1] + 110, { role: 'label', size: 20, color: C.mute, alpha: aW * k });
      rich([{ s: fmtN(v, 1), font: 'disp', size: 64, weight: 800, color: C.secondText, count: [3.8 + i * 0.25, 0.8, 0] }, { s: 'mm', role: 'label', size: 22, color: C.mute, gap: 8 }], x, W0[1] + 186, { t, alpha: aW * k });
    });
    const kd = ep(t, 5.0, 5.5);
    text('Per side: ' + fmtN(GD.ulx.pocket, 1) + ' mm in under the hump, ' + fmtN(GD.ulx.flare, 1) + ' mm of front flare (derived).', W0[0] + 32, W0[1] + 258, { role: 'small', size: 25, weight: 650, color: C.ink2, alpha: aW * kd, maxW: W0[2] - 64 });
    /* right: the loss, its terms, and the number going down */
    const R0 = [LM + 900, 300, RM - LM - 900, 640], aR = tileA(t, 5.4, 0), T_ = gdTr();
    demoWindow(...R0, aR);
    text('One number to lower', R0[0] + 32, R0[1] + 52, { role: 'label', size: 21, color: C.mute, alpha: aR });
    const terms = [['Under the finger', 'Each valley\'s bottom where the relaxed fingertip rests'], ['As strong as the finger', 'Its curvature matches the finger\'s own pull back to rest'],
      ['One minimum per finger', 'No second dip, no rim; none under the ring finger'], ['Still a traditional mouse', 'Within 3.5 mm of the Sora, radii a mould can make, side profile kept']];
    terms.forEach(([h, b], i) => {
      const y = R0[1] + 120 + i * 92, k = ep(t, 5.7 + i * 0.35, 6.2 + i * 0.35) * aR;
      text('+', R0[0] + 32, y + 4, { role: 'h3', size: 32, color: C.heroText, alpha: k });
      text(h, R0[0] + 72, y, { role: 'h3', size: 28, color: C.ink, alpha: k });
      text(b, R0[0] + 72, y + 34, { role: 'small', size: 23, weight: 600, color: C.mute, alpha: k, maxW: R0[2] - 110 });
    });
    const kc = ep(t, 7.3, 9.3, E.io3), Lv = lerp(T_.loss0, T_.loss, kc);
    text('Loss', R0[0] + 32, R0[1] + R0[3] - 110, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 7.2, 7.6) });
    text(fmtN(Lv, 2), R0[0] + 32, R0[1] + R0[3] - 32, { role: 'd2', size: 96, color: C.hero, grad: C.heroGrad, alpha: ep(t, 7.2, 7.6) });
    text('Lower is better. Trial ' + gdNo(GD_K) + ', from its start to its end.', R0[0] + R0[2] - 32, R0[1] + R0[3] - 40, { role: 'small', size: 22, weight: 600, color: C.mute, align: 'right', alpha: ep(t, 8.6, 9.2) });
    source(t, 'TechPowerUp, Finalmouse UltralightX review: widths front 5.88, grip 5.66, rear 6.16 cm. The loss and its terms: derived (deck/tools/gd/trials.py).', { t0: 2.0 });
  }
});

/* ============================== 3. the hand at rest, in zero gravity ============================== */
S({
  id: 'gd_rest', ch: 'shape', theme: 'night', title: 'The hand at rest, in zero gravity', settle: 12.5,
  src: ['gdSts57', 'gdLeeJung', 'gdAnsur', 'gdBuryanov', 'gdModel'],
  draw: t => {
    header(t, 'The hand at rest, in zero gravity', { noIdeas: true });
    gdCaptions(t, [[0.6, 'In orbit nothing pulls on the hand, so it settles where its tendons and ligaments balance: the wrist straight, each finger gently curled.'],
      [4.6, 'Tilt the wrist back 15° to rest the palm on the hump, and the relaxed fingertips reach past the front of a mouse this long.'],
      [8.4, 'Lift the palm instead, as in orbit, and the fingertips land on the buttons with the palm 28 mm over the hump. That is trial 4\'s grip.']], { maxW: 1500 });
    const H_ = GD.hand, lifted = H_.grips.lifted, heel = H_.grips.heel;
    /* the side view: z right (the nose), y up, true scale */
    const box = [LM, 290, 1120, 660], s = Math.min((box[2] - 60) / 210, (box[3] - 110) / 105), ox = box[0] + 30 + 138 * s, oy = box[1] + box[3] - 40;
    const map = { s, X: z => ox + z * s, Y: y => oy - y * s };
    const aB = tileA(t, 0.2, 0); demoWindow(...box, aB);
    /* beats: the fingers relax (1.0 to 3.4); the palm lowers onto the hump (4.8 to 6.6); then lifts to the zero-g pose (8.6 to 10.2) */
    const relax = ep(t, 1.0, 3.4, E.io3), kM = ep(t, 4.4, 5.2), kH = ep(t, 4.8, 6.6, E.cam), kL = ep(t, 8.6, 10.2, E.cam);
    const zK = lerp(lerp(lifted.zK - 6, heel.zK, kH), lifted.zK, kL), yK = lerp(lerp(lifted.yK + 16, heel.yK, kH), lifted.yK, kL);
    const g = lerp(lerp(0, heel.gamma_deg, kH), 0, kL) * Math.PI / 180;
    G.save(); G.beginPath(); G.rect(box[0], box[1], box[2], box[3]); G.clip();
    /* the Sora's side profile and the pad line arrive with the second beat */
    line(box[0] + 24, map.Y(0), box[0] + box[2] - 24, map.Y(0), { color: C.hair, w: 1.5, alpha: aB * kM });
    poly(GD.sora.profile.map(q => [map.X(q[0]), map.Y(q[1])]), { color: C.second, w: 3, alpha: aB, p: kM });
    /* the hand, far to near: little, ring, the palm, middle, index */
    const P = gdHandPose(zK, yK, g, relax);
    G.save(); G.globalAlpha = aB * ep(t, 0.4, 1.0);
    gdFingerDraw(P.little, 'little', map); gdFingerDraw(P.ring, 'ring', map);
    const palm = gdPalmDraw(zK, yK, g, map);
    gdFingerDraw(P.middle, 'middle', map); gdFingerDraw(P.index, 'index', map);
    G.restore();
    /* the angles on the near finger count in as it relaxes, then step aside for the mouse */
    gdAngles(P.index, 'index', g, relax, map, aB * ep(t, 1.0, 1.4) * (1 - ep(t, 4.4, 4.8)));
    /* palm on the hump: the middle fingertip past the nose */
    const kF = ep(t, 6.6, 7.0) * (1 - ep(t, 8.5, 8.8));
    if (kF > 0) { const q = P.middle[3]; circle(map.X(q[0]), map.Y(q[1]), 8, { fill: C.red, alpha: kF }); circle(map.X(q[0]), map.Y(q[1]), 16, { color: C.red, w: 2, alpha: 0.45 * kF }); }
    /* palm lifted: the index and middle tips on the buttons, and the gap under the palm */
    const kT = ep(t, 10.0, 10.4);
    for (const f of ['index', 'middle']) { const q = P[f][3]; if (kT > 0) { circle(map.X(q[0]), map.Y(q[1]), 8, { fill: C.hero, alpha: kT }); circle(map.X(q[0]), map.Y(q[1]), 16, { color: C.hero, w: 2, alpha: 0.4 * kT }); } }
    G.restore();
    if (kF > 0.5) faultTag(t, 6.9, [map.X(P.middle[3][0]), map.Y(P.middle[3][1])], 'Middle tip past the nose', { to: [map.X(P.middle[3][0]) - 50, map.Y(P.middle[3][1]) + 46], side: 'l', alpha: kF });
    if (t > 10.2) {
      /* the gap: from the hump's highest point under the palm up to the palm's skin (the model's 28.3 mm) */
      const under = GD.sora.profile.filter(q => q[0] > lifted.zK - 100 && q[0] < lifted.zK), top = under.reduce((b, q) => (q[1] > b[1] ? q : b), under[0]);
      const ys = palm.skinAt(top[0]);
      dim(t, 10.2, [map.X(top[0]), map.Y(top[1])], [map.X(top[0]), map.Y(ys)], fmtN(lifted.palm_gap_mm, 0) + ' mm', -96, { tcolor: C.ink });
    }
    /* which pose, top right of the drawing */
    const tag = t < 8.6 ? (t < 4.8 ? ['Floating, nothing to hold', C.mute] : ['Palm on the hump, wrist back 15°', C.ink2]) : ['Palm lifted, wrist straight: trial 4\'s grip', C.heroText];
    const kTag = t < 4.8 ? ep(t, 1.0, 1.4) : t < 8.6 ? ep(t, 5.0, 5.4) : ep(t, 10.4, 10.8);
    text(tag[0], box[0] + box[2] - 28, box[1] + 44, { role: 'label', size: 20, color: tag[1], align: 'right', alpha: aB * kTag });
    text('Side view, true scale', box[0] + 28, box[1] + 44, { role: 'label', size: 20, color: C.mute, alpha: aB });
    /* right: what the pose is made of, one tile per beat */
    const rx = LM + 1160, rw = RM - rx, orb = H_.orbit_flex.reduce((a, b) => a + b, 0) / H_.orbit_flex.length;
    statTile(t, 1.4, [rx, 290, rw, 200], { value: fmtN(orb, 0) + '°', label: 'Finger flexion in orbit, 9 hands', quiet: true, count: false, align: 'left' });
    statTile(t, 2.2, [rx, 520, rw, 200], { value: '0°', label: 'Wrist bend in orbit, all crew but one', quiet: true, count: false, align: 'left' });
    statTile(t, 5.2, [rx, 750, rw, 200], { value: fmtN(H_.ansur.hand, 1), unit: 'mm', label: 'The hand, ANSUR II mean (men)', quiet: true, count: false, align: 'left' });
    source(t, 'Joint angles: Lee & Jung 2014 (resting, forearm neutral). Orbit: NASA TM-2003-104805, Table 1. Bones: Buryanov & Kotiuk, scaled to ANSUR II. Placement derived; the palm\'s skin 20 mm under the knuckles and the fingers\' thickness are estimates.', { t0: 2.0, maxW: 1760 });
  }
});

/* ============================== 4. a surface is a landscape ============================== */
S({
  id: 'gd_landscape', ch: 'shape', theme: 'paper', title: 'Newtonian shape analysis', settle: 12,
  src: ['gdBrock', 'gdModel'],
  draw: t => {
    header(t, 'Newtonian shape analysis', { noIdeas: true });
    gdCaptions(t, [[0.6, 'Press a fingertip onto a curve and the curve pushes back along its normal. In a valley, every push points to the bottom.'],
      [4.6, 'So a valley holds a finger with no muscle. And it must be one valley: a second dip is a second place for the finger to fall.'],
      [8.4, 'The ring finger gets no valley. It rests on the shoulder, where the slope and how fast it turns are checked instead.']]);
    const T_ = gdTr(), box = [LM, 290, 1180, 640], aB = tileA(t, 0.2, 0);
    demoWindow(...box, aB);
    const m = gdSecFit([box[0] + 40, box[1] + 64, box[2] - 80, 390], { ur: 34, yr: [0, 40] });
    /* the Sora's section (yellow, faint) and the descended (blue), true scale; the wheel's slot open */
    gdSecDraw(m, GD.sora.sec, { color: C.second, w: 2, alpha: aB * 0.6 });
    gdSecDraw(m, T_.sec, { color: C.hero, w: 3.5, alpha: aB });
    text('Wheel', m.cx, m.Y(T_.sec[0][1]) - 14, { role: 'tick', size: 19, color: C.faint, align: 'center', alpha: aB });
    text('Across the buttons at z ' + T_.targets.station_z + ' mm, seen from behind, true scale', box[0] + 28, box[1] + 44, { role: 'label', size: 20, color: C.mute, alpha: aB });
    const g = T_.groove, ug = g.u_bottom, yg = g.y_bottom, under = T_.grooves_under_finger;
    /* the pushes along the normals across the index's valley, all leaning to its bottom */
    const kp = ep(t, 1.4, 2.2);
    const sec = gdRes(T_.sec, 320), up = sec.filter(q => q[1] > 12);
    for (let uu = ug - 6; uu <= ug + 6.01; uu += 2) {
      const y0 = gdInterp(uu - 0.2, up.map(q => q[0]), up.map(q => q[1])), y1 = gdInterp(uu + 0.2, up.map(q => q[0]), up.map(q => q[1]));
      const px = m.X(uu, -1), py = m.Y((y0 + y1) / 2), tx = -0.4 * m.s, ty = -(y1 - y0) * m.s, L = Math.hypot(tx, ty);   /* screen tangent, left half mirrored */
      let nx = -ty / L, ny = tx / L; if (ny > 0) { nx = -nx; ny = -ny; }
      arrow(px, py, px + nx * 64 * kp, py + ny * 64 * kp, { color: inkA(0.6), w: 2.5, hs: 11, alpha: aB });
    }
    /* a fingertip let go on the valley's side rolls to its bottom and stays */
    const roll = ep(t, 2.4, 4.0, E.out3), uBall = lerp(ug - 5.5, ug, roll), yBall = gdInterp(uBall, up.map(q => q[0]), up.map(q => q[1]));
    gdTip(m.X(uBall, -1), m.Y(yBall) - 4.3 * m.s, 4.3 * m.s, aB * ep(t, 2.2, 2.5));
    if (t > 4.0) callout(t, 4.0, [m.X(ug, -1), m.Y(yg)], 'Index: one valley', { to: [m.X(ug, -1) - 60, m.Y(yg) - 150], side: 'l', color: C.hero, tcolor: C.heroText });
    gdTip(m.X(ug, 1), m.Y(yg) - 4.3 * m.s, 4.3 * m.s, aB * ep(t, 4.6, 5.0));
    if (t > 4.8) callout(t, 4.8, [m.X(ug, 1), m.Y(yg)], 'Middle: one valley', { to: [m.X(ug, 1) - 20, m.Y(yg) - 150], side: 'l', color: C.hero, tcolor: C.heroText });
    /* the ring finger on the shoulder: the tangent, the normal, the rate of turn */
    const kr = ep(t, 8.6, 9.2), R_ = T_.ring;
    if (kr > 0) {
      const j = up.reduce((b, q, i) => (Math.abs(q[0] - R_.u) < Math.abs(up[b][0] - R_.u) ? i : b), 0);
      const q0 = up[Math.max(0, j - 2)], q1 = up[Math.min(up.length - 1, j + 2)], tx = q1[0] - q0[0], ty = q1[1] - q0[1], L = Math.hypot(tx, ty);
      const px = m.X(up[j][0], 1), py = m.Y(up[j][1]), dx = tx / L, dy = -ty / L;
      line(px - dx * 90, py - dy * 90, px + dx * 90, py + dy * 90, { color: C.ink, w: 2, alpha: kr });
      gdTip(px + dy * 4.3 * m.s, py - dx * 4.3 * m.s, 4.3 * m.s, kr * 0.95);
      circle(px, py, 6, { fill: C.ink, alpha: kr });
      text('Ring: ' + fmtN(R_.k_deg_per_mm, 1) + ' °/mm, slope ' + fmtN(Math.abs(R_.slope_deg), 0) + '°', box[0] + box[2] - 28, box[1] + box[3] - 66, { role: 'num', size: 26, color: C.ink, align: 'right', alpha: kr });
      text('In the 6 to 22 °/mm band. No valley.', box[0] + box[2] - 28, box[1] + box[3] - 30, { role: 'small', size: 22, weight: 600, color: C.mute, align: 'right', alpha: kr });
    }
    /* the groove at x10 height, so its millimetre shows */
    const ib = [box[0] + 40, box[1] + box[3] - 214, 440, 184], ki = ep(t, 5.4, 5.9) * aB;
    if (ki > 0) {
      rr(...ib, 6, TH ? '#F3F3F5' : '#0B0C0D', null, 0, ki);
      text('Index groove, ×10 in height', ib[0] + 16, ib[1] + 30, { role: 'label', size: 19, color: C.ink2, alpha: ki });
      text('Lip outboard ' + fmtN(g.lip_mm, 2) + ' mm', ib[0] + 16, ib[1] + ib[3] - 14, { role: 'label', size: 19, color: C.mute, alpha: ki });
      const upx = T_.sec.filter(q => q[1] > 12 && q[0] > ug - 9 && q[0] < ug + 9), us = GD.sora.sec.filter(q => q[1] > 12 && q[0] > ug - 9 && q[0] < ug + 9);
      const ca = [ib[0], ib[1] + 44, ib[2], ib[3] - 44 - 36], sx = (ib[2] - 40) / 18, sy = sx * 10, X = u => ib[0] + 20 + (u - (ug - 9)) * sx, Y = y => ca[1] + ca[3] * 0.62 - (y - yg) * sy;
      clipped(...ca, () => {
        poly(us.map(q => [X(q[0]), Y(q[1])]), { color: C.second, w: 2, alpha: ki });
        poly(upx.map(q => [X(q[0]), Y(q[1])]), { color: C.hero, w: 3, alpha: ki });
        circle(X(ug), Y(yg), 6, { fill: C.hero, alpha: ki });
      });
    }
    if (!under) text('In this trial the index and middle tips land past z 48: the grooves are not under them', box[0] + 28, box[1] + box[3] - 24, { role: 'small', size: 22, weight: 650, color: C.red, alpha: aB });
    /* right: the rule, counted */
    const rx = LM + 1220, rw = RM - rx, kR = tileA(t, 4.8, 0);
    demoWindow(rx, 290, rw, 640, kR);
    text('One minimum per finger', rx + 32, 290 + 52, { role: 'label', size: 21, color: C.mute, alpha: kR });
    text('Counted along each finger\'s slide, in its own region', rx + 32, 290 + 92, { role: 'small', size: 22, weight: 600, color: C.mute, alpha: kR, maxW: rw - 64 });
    const cnt = [['Thumb', T_.thumb.n_minima, 1], ['Index', under ? g.n_minima : null, 1], ['Middle', under ? g.n_minima : null, 1], ['Ring', under ? R_.n_minima : null, 0], ['Pinky', T_.pinky.n_minima, 1]];
    cnt.forEach(([nm, v, want], i) => {
      const y = 290 + 190 + i * 88, k = ep(t, 5.2 + i * 0.25, 5.7 + i * 0.25) * kR, ok = v === want;
      text(nm, rx + 32, y, { role: 'h3', size: 30, color: C.ink, alpha: k });
      text(v == null ? 'Not under it' : String(v), rx + rw - 32, y + (v == null ? 0 : 6), v == null ? { role: 'small', size: 23, weight: 650, color: C.red, align: 'right', alpha: k } : { font: 'disp', size: 52, weight: 800, color: ok ? C.heroText : C.red, align: 'right', alpha: k });
      line(rx + 32, y + 30, rx + rw - 32, y + 30, { color: C.hair, w: 1.5, alpha: k });
    });
    source(t, 'Trial ' + gdNo(GD_K) + ' (' + GD_NAME[GD_K][0].toLowerCase() + ', ' + GD_NAME[GD_K][1].toLowerCase() + '). The pushes are along the surface normal; minima counted on the descended curves; the band is the deck\'s (Newtonian shape analysis). Derived.', { t0: 2.0, maxW: 1760 });
  }
});

/* ============================== 5. how strong a pocket should be ============================== */
S({
  id: 'gd_strength', ch: 'shape', theme: 'night', title: 'How strong a pocket should be', settle: 12.5,
  src: ['gdShi', 'gdKuo', 'gdJohnson', 'gdModel'],
  draw: t => {
    header(t, 'How strong a pocket should be', { noIdeas: true });
    gdCaptions(t, [[0.6, 'A relaxed finger already pulls back to its rest, through the stiffness of its own knuckle. A pocket adds a second pull.'],
      [4.8, 'Too shallow, and a nudge carries the finger off. Too steep, and the finger is held where the pocket is, not where the hand rests.'],
      [8.8, 'The best pocket pulls exactly as hard as the finger does: radius 29 mm across the buttons, 47 mm along the sides.']]);
    const St = GD.strength, tiles = [['Too shallow', 0.25, 'Drifts'], ['Matched', 1, 'Held'], ['Too steep', 4, 'Pinned off its rest']];
    const cell = bento(LM, 290, RM - LM, 360, 3, 1);
    tiles.forEach(([nm, rho, verdict], i) => {
      const r = cell(i, 0), a = tileA(t, 0.3, i), hero = i === 1; demoWindow(...r, a);
      text(nm, r[0] + 28, r[1] + 48, { role: 'label', size: 21, color: hero ? C.heroText : C.mute, alpha: a });
      /* the valley: y = rho * u^2 / 2, in its own units; the finger's rest marked off its bottom by e */
      const cx = r[0] + r[2] / 2, by = r[1] + r[3] - 70, sx = r[2] * 0.42, sy = 70, e = 0.32, k = rho * 0.9;
      const Y = u => by - sy * Math.min(1.6, k * u * u), pts = []; for (let u = -1; u <= 1.0001; u += 0.02) pts.push([cx + u * sx, Y(u)]);
      poly(pts, { color: hero ? C.hero : C.ink2, w: 3, alpha: a });
      line(cx + e * sx, by + 16, cx + e * sx, by - 150, { color: C.mute, w: 1.5, dash: [5, 5], alpha: a });
      text('Rest', cx + e * sx + 8, by + 34, { role: 'tick', size: 19, color: C.mute, alpha: a });
      /* settle: the tip sits between the bottom and its rest, weighted by the two pulls; then a nudge */
      const settle = e / (1 + rho), nudge = ep(t, 5.2, 5.7, E.out3) * (1 - ep(t, 7.0, 8.0)), drift = 0.55 / (1 + rho) * nudge;
      const u = settle + drift, tipY = Y(u);
      if (nudge > 0.02) arrow(cx + u * sx - 110, tipY - 30, cx + u * sx - 44, tipY - 30, { color: C.ink, w: 3, hs: 12, alpha: a * nudge });
      gdTip(cx + u * sx, tipY - 22, 22, a);
      const strain = rho / (1 + rho), drf = 1 / (1 + rho), kv = ep(t, 5.8, 6.3);
      text(verdict, r[0] + 28, r[1] + 104, { role: 'h2', size: 40, color: hero ? C.heroText : C.ink, grad: hero ? C.heroGrad : null, alpha: a * kv });
      text('Drift ' + fmtN(drf * 100, 0) + ' %, strain ' + fmtN(strain * 100, 0) + ' %', r[0] + r[2] - 28, r[1] + 48, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: a * kv });
    });
    /* the chart: drift falls, strain rises, their squares' sum is least at rho = 1 */
    const ch = [LM, 690, 920, 260], ka = tileA(t, 5.0, 0); demoWindow(...ch, ka);
    const gx = ch[0] + 70, gw = ch[2] - 110, gy = ch[1] + 40, gh = ch[3] - 90, X = v => gx + gw * v / 4, Y = v => gy + gh * (1 - v);
    line(gx, gy + gh, gx + gw, gy + gh, { color: C.hair, w: 1.5, alpha: ka });
    const ser = (key, col, dash) => poly(St.rho.map((r_, i) => [X(r_), Y(St[key][i])]), { color: col, w: key === 'J' ? 3.5 : 2.5, alpha: ka, dash, p: ep(t, 5.4, 7.0, E.lin) });
    ser('drift', C.ink2, [7, 5]); ser('strain', C.ink2, [2, 5]); ser('J', C.hero);
    const km = ep(t, 7.0, 7.4) * ka; heroMark(X(1), Y(0.5), 12, km);
    text('Matched: the pocket pulls as hard as the finger', X(1) + 24, gy + gh - 14, { role: 'label', size: 19, color: C.heroText, alpha: km });
    text('Drift', X(0.15), Y(0.86) - 8, { role: 'label', size: 19, color: C.ink2, alpha: ka }); text('Strain', X(3.3), Y(0.8) - 10, { role: 'label', size: 19, color: C.ink2, alpha: ka });
    text('Pocket\'s pull over the finger\'s, 0 to 4', gx + gw, gy + gh + 34, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ka });
    /* the numbers: the finger's pull, the press, the radius */
    const tb = St.table, nx = LM + 960, nw = RM - nx, kn = tileA(t, 8.6, 0); demoWindow(nx, 690, nw, 260, kn);
    const steps = [['Knuckle, passive', fmtN(St.k_mcp, 3) + ' N·m/rad', 'Shi 2020'], ['At the fingertip, 55 mm out', fmtN(tb.index.k_tip_N_per_mm * 1000, 1) + ' N/m', 'Derived'],
      ['Resting press on the button', fmtN(St.N_btn, 2) + ' N', 'Johnson 2000']];
    steps.forEach(([l, v, sname], i) => {
      const y = 690 + 58 + i * 50, k = ep(t, 8.8 + i * 0.3, 9.3 + i * 0.3) * kn;
      text(l, nx + 28, y, { role: 'small', size: 23, weight: 600, color: C.mute, alpha: k });
      text(v, nx + 470, y, { role: 'num', size: 26, color: C.ink, alpha: k }); text(sname, nx + nw - 28, y, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: k, caps: false });
    });
    const kz = ep(t, 9.9, 10.4) * kn;
    rich([{ s: 'R', role: 'label', size: 22, color: C.mute }, { s: fmtN(GD.trials[GD_K].R_opt.groove, 0), font: 'disp', size: 64, weight: 800, color: C.hero, grad: C.heroGrad, gap: 10 }, { s: 'mm across the buttons', role: 'small', size: 23, weight: 650, color: C.ink2, gap: 12, sentence: false },
      { s: fmtN(GD.trials[GD_K].R_opt.thumb, 0), font: 'disp', size: 64, weight: 800, color: C.hero, grad: C.heroGrad, gap: 40 }, { s: 'mm along the sides', role: 'small', size: 23, weight: 650, color: C.ink2, gap: 12, sentence: false }], nx + 28, 690 + 236, { alpha: kz });
    source(t, 'Derived: the pocket pulls back with its press times its curvature; the finger with its knuckle\'s stiffness over the lever squared. Drift and strain, each against its worst case, cost least when the two are equal. Sides: 0.43 N squeeze, little finger\'s 65 mm lever.', { t0: 2.0, maxW: 1760 });
  }
});

/* ============================== 6. the shape as arcs ============================== */
S({
  id: 'gd_arcs', ch: 'shape', theme: 'paper', title: 'The shape as arcs', settle: 12.5,
  src: ['gdModel', 'gdSerhat', 'gdAnsur', 'gdTpu', 'gdBrock'],
  draw: t => {
    header(t, 'The shape as arcs', { noIdeas: true });
    gdCaptions(t, [[0.6, 'Fitted with arcs, each one a length and a turn, the Sora\'s outline sits within 0.12 mm of the scan.'],
      [4.4, 'Each valley is one more arc: a circle at the strength its finger needs, easing back into the base. No rim, no second dip.'],
      [8.6, 'Its length is measured, not chosen: the fingertip\'s contact, plus where fingertips land across 90 % of hands.']]);
    /* left: the top view, arc by arc, alternate tones, handles; the fit error */
    const box = [LM, 290, 520, 660], m = gdTopFit([box[0] + 20, box[1] + 60, box[2] - 40, box[3] - 120], { ur: 34 }), aB = tileA(t, 0.2, 0);
    demoWindow(...box, aB);
    text('Top view, true scale', box[0] + 28, box[1] + 44, { role: 'label', size: 20, color: C.mute, alpha: aB });
    poly(m.P(GD.sora.scan_plan, -1), { color: C.hair, w: 6, alpha: aB }); poly(m.P(GD.sora.scan_plan, 1), { color: C.hair, w: 6, alpha: aB });
    GD.arcs.plan.forEach((A_, i) => {
      const k = ep(t, 0.6 + i * 0.25, 1.0 + i * 0.25); if (k <= 0) return;
      for (const sd of [-1, 1]) { poly(m.P(A_.pts, sd), { color: i % 2 ? C.ink : C.mute, w: 3, p: k }); const q = m.P([A_.a], sd)[0]; circle(q[0], q[1], 4.5, { fill: C.panel, color: C.ink, w: 1.5, alpha: k }); }
    });
    const ke = ep(t, 2.6, 3.4);
    rich([{ s: fmtN(GD.arcs.err.plan.rms, 2), font: 'disp', size: 44, weight: 800, color: C.ink, count: [2.6, 1.0, 1.0] }, { s: 'mm from the scan, RMS', role: 'small', size: 22, weight: 600, color: C.mute, gap: 10, sentence: false }], box[0] + 28, box[1] + box[3] - 28, { t, alpha: ke });
    /* middle: the valley's anatomy, in curvature (top) and in shape (bottom, x10 in depth) */
    const T_ = GD.trials[GD.recommended], D_ = GD.dip, mx = LM + 560, mw = 760, aM = tileA(t, 4.0, 0);
    demoWindow(mx, 290, mw, 660, aM);
    text('One valley: the thumb\'s, trial ' + gdNo(GD.recommended), mx + 28, 290 + 44, { role: 'label', size: 20, color: C.mute, alpha: aM });
    /* the cursor deepens the valley: kc from 60 % to the descended value */
    const kd = 0.6 + 0.4 * ep(t, 6.2, 7.6, E.io3), dip = gdDip(D_.a, D_.b, D_.kc * kd), Ex = D_.a + D_.b;
    const gx = mx + 60, gw = mw - 120, X = tt => gx + gw * (tt + Ex) / (2 * Ex);
    /* curvature strip */
    const cmax = Math.max(...gdDip(D_.a, D_.b, D_.kc).c.map(Math.abs)), cy0 = 290 + 160, ch_ = 56, Yc = c => cy0 - c / cmax * ch_;
    line(gx, cy0, gx + gw, cy0, { color: C.hair, w: 1.5, alpha: aM });
    const cpts = []; dip.t.forEach((tt, i) => cpts.push([X(tt), Yc(dip.c[i])])); const cl = cpts.slice().reverse().map(q => [2 * X(0) - q[0], q[1]]).concat(cpts);
    poly(cl, { color: C.hero, w: 3, alpha: aM, p: ep(t, 4.4, 5.6, E.lin) });
    text('Curvature: a flat core at the finger\'s strength, easing through a soft rim to zero', gx, cy0 - ch_ - 22, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: aM, maxW: gw });
    /* shape strip, x10 in depth */
    const sxm = gw / (2 * Ex), magD = Math.max(2, Math.min(10, Math.floor(200 / (gdDip(D_.a, D_.b, D_.kc).depth * sxm)))), sy0 = 290 + 330, Ys = h => sy0 - h * magD * sxm;
    line(gx, sy0, gx + gw, sy0, { color: C.second, w: 2, dash: [6, 5], alpha: aM });
    const spts = []; dip.t.forEach((tt, i) => spts.push([X(tt), Ys(dip.h[i])])); const sl = spts.slice().reverse().map(q => [2 * X(0) - q[0], q[1]]).concat(spts);
    poly(sl, { color: C.hero, w: 3.5, alpha: aM, p: ep(t, 4.8, 6.0, E.lin) });
    text('Depth ×' + magD, gx + gw, sy0 - 14, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: aM });
    /* handles: depth, length, turn */
    const kh = ep(t, 5.8, 6.3) * aM, yb = Ys(-dip.depth);
    dim(t, 5.8, [X(0) + 6, sy0], [X(0) + 6, yb], fmtN(dip.depth, 2) + ' mm deep', 60, { tcolor: C.ink });
    dim(t, 6.0, [X(-D_.a), sy0 - 34], [X(D_.a), sy0 - 34], fmtN(2 * D_.a, 1) + ' mm core', -10, { tcolor: C.ink });
    cursorAt(t, [[6.0, [X(0) + 120, yb - 120]], [6.4, [X(0), yb - 4]], [7.6, [X(0), Ys(-gdDip(D_.a, D_.b, D_.kc).depth) - 4]], [20, [X(0), Ys(-gdDip(D_.a, D_.b, D_.kc).depth) - 4]]], [6.45], { a: ep(t, 5.9, 6.2) * (1 - ep(t, 8.2, 8.6)) });
    text('Core R ' + fmtN(1 / (D_.kc * kd), 0) + ' mm. Under the pad it reads R ' + fmtN(T_.thumb.R_bottom, 0) + '; the optimum is ' + fmtN(T_.R_opt.thumb, 0) + '.', gx, 290 + 640 - 30, { role: 'small', size: 23, weight: 650, color: C.ink2, alpha: kh, maxW: gw });
    /* right: the core's length, measured; and the circle check */
    const rx = mx + mw + 40, rw = RM - rx, aR = tileA(t, 8.6, 0); demoWindow(rx, 290, rw, 660, aR);
    text('How long the core is', rx + 28, 290 + 44, { role: 'label', size: 20, color: C.mute, alpha: aR });
    const rows = [['Thumb\'s contact', fmtN(T_.contact.side, 1) + ' mm', 'Serhat 2022'], ['Spread across hands', fmtN(T_.spread.thumb[1] - T_.spread.thumb[0], 1) + ' mm', 'ANSUR II'], ['Core', fmtN(T_.cores.thumb, 1) + ' mm', 'Derived']];
    rows.forEach(([l, v, sname], i) => {
      const y = 290 + 100 + i * 96, k = ep(t, 8.8 + i * 0.3, 9.3 + i * 0.3) * aR;
      text(l, rx + 28, y, { role: 'small', size: 22, weight: 600, color: C.mute, alpha: k, maxW: rw - 56 });
      rich([{ s: v, role: 'num', size: 30, color: i === 2 ? C.heroText : C.ink }, { s: sname, role: 'label', size: 19, color: C.faint, gap: 12, caps: false }], rx + 28, y + 50, { alpha: k });
    });
    const kc = ep(t, 10.0, 10.5) * aR, cc = GD.circle_check;
    text('A ' + fmtN(cc.L, 0) + ' mm pocket at R ' + fmtN(cc.R, 0) + ' is ' + fmtN(cc.depth, 2) + ' mm deep: the UltralightX is ' + fmtN(GD.ulx.pocket, 1) + ' mm under its hump.', rx + 28, 290 + 420, { role: 'small', size: 23, weight: 650, color: C.ink, alpha: kc, maxW: rw - 56 });
    text('The core is that long only with the palm on the hump (31 mm). With the palm lifted it is 10 to 14 mm, or 32 mm when one pocket serves both fingers.', rx + 28, 290 + 530, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: kc, maxW: rw - 56 });
    source(t, 'Arcs fitted to 3d/shell/shell-sora.glb (top view 8 arcs, sections 7 arcs, RMS 0.06 to 0.12 mm). Contact: A = 98.6 F^0.50 mm² at 0.43 N (Serhat 2022). Hands: ANSUR II 177 to 210 mm. ULX widths: TechPowerUp. Derived.', { t0: 2.0, maxW: 1760 });
  }
});

/* ============================== 7. descent ============================== */
S({
  id: 'gd_descent', ch: 'shape', theme: 'night', title: 'Gradient descent', settle: 13,
  src: ['gdModel'],
  draw: t => {
    header(t, 'Gradient descent', { noIdeas: true });
    gdCaptions(t, [[0.6, 'Gradient descent nudges every arc a little at a time, always downhill on the loss: nearer where each finger rests, nearer its strength.'],
      [5.4, 'Here is the thumb pocket\'s landscape: where it sits on the side against how sharply it curves. The path runs downhill to the floor.'],
      [9.4, 'It stops where nothing improves: one valley per finger, each near its rest, all inside 3.5 mm of the Sora.']]);
    const K = GD_K, Tr = gdTr(K), Ds = GD.descent[K], F = Ds.frames, Ls = GD.landscape[K], nF = F.length;
    const u = ep(t, 1.4, 10.4, E.io3), fi = u * (nF - 1), i0 = Math.min(nF - 2, Math.floor(fi)), kk = fi - i0, A_ = F[i0], B_ = F[i0 + 1];
    const p = A_.p.map((v, i) => lerp(v, B_.p[i], kk)), lossNow = lerp(A_.loss, B_.loss, kk);
    /* left: the landscape (thumb pocket position x strength) as a quiet heat field, with the path */
    const L0 = [LM, 290, 620, 420], aL = tileA(t, 0.2, 0); demoWindow(...L0, aL);
    text('Thumb pocket: where, and how sharp', L0[0] + 24, L0[1] + 40, { role: 'label', size: 19, color: C.mute, alpha: aL });
    const gx = L0[0] + 60, gy = L0[1] + 64, gw = L0[2] - 90, gh = L0[3] - 120, nz = Ls.z.length, nk = Ls.k.length;
    const Xz = z => gx + gw * (z - Ls.z[0]) / (Ls.z[nz - 1] - Ls.z[0]), Yk = k => gy + gh * (1 - (k - Ls.k[0]) / (Ls.k[nk - 1] - Ls.k[0]));
    const lmax = 6; gdHeat('land_' + K + (TH ? 'p' : 'n'), Ls.loss, gx, gy, gw, gh, aL, v0 => { const v = Math.min(1, Math.log1p(v0) / Math.log1p(lmax)); return Math.round(TH ? 250 - 80 * v : 12 + 70 * v); });
    const path = Ls.path.slice(0, Math.max(1, Math.round(u * Ls.path.length)));
    poly(path.map(q => [Xz(q[0]), Yk(q[1])]), { color: C.hero, w: 3, alpha: aL });
    path.forEach((q, i) => { if (i % 3 === 0) circle(Xz(q[0]), Yk(q[1]), 3.5, { fill: C.hero, alpha: aL }); });
    const last = path[path.length - 1]; circle(Xz(last[0]), Yk(last[1]), 8, { fill: C.hero, alpha: aL });
    circle(Xz(Ls.z_target), Yk(Ls.k_opt), 10, { color: C.ink, w: 2, alpha: aL }); text('Rest, optimum', Xz(Ls.z_target) + 16, Yk(Ls.k_opt) - 14, { role: 'label', size: 19, color: C.ink2, alpha: aL });
    text('Position on the side, z (mm)', gx + gw, gy + gh + 30, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: aL });
    text('Sharper ↑', gx + 10, gy + 26, { role: 'label', size: 19, color: C.ink2, alpha: aL });
    /* left, below: the loss curve */
    const C0 = [LM, 750, 620, 200], aC = tileA(t, 0.4, 0); demoWindow(...C0, aC);
    const cv = Tr.curve, cgx = C0[0] + 30, cgw = C0[2] - 60, cgy = C0[1] + 54, cgh = C0[3] - 84, lo = Math.log(Math.min(...cv)), hi = Math.log(Math.max(...cv));
    const n = Math.max(2, Math.round(u * cv.length));
    poly(cv.slice(0, n).map((v, i) => [cgx + cgw * i / (cv.length - 1), cgy + cgh * (1 - (Math.log(v) - lo) / ((hi - lo) || 1))]), { color: C.hero, w: 3, alpha: aC });
    text('Loss, lower is better', C0[0] + 24, C0[1] + 36, { role: 'label', size: 19, color: C.mute, alpha: aC });
    text(fmtN(lossNow, 2), C0[0] + C0[2] - 24, C0[1] + 44, { role: 'num', size: 30, color: C.heroText, align: 'right', alpha: aC });
    /* middle: the top view, true scale, morphing, with the magnified strips on both sides */
    const box = [LM + 660, 290, 640, 660], m = gdTopFit([box[0] + 160, box[1] + 50, box[2] - 320, box[3] - 100], { ur: 34 }), aT = tileA(t, 0.3, 0);
    demoWindow(...box, aT);
    const PL = gdMix(A_.planL, B_.planL, kk), PR = gdMix(A_.planR, B_.planR, kk);
    poly(gdOutline(m, GD.sora.plan, GD.sora.plan), { color: C.second, w: 2, alpha: aT * 0.7 });
    poly(gdOutline(m, PL, PR), { color: C.hero, w: 3, alpha: aT });
    gdStrip(t, aT, m, -1, PL, { x: box[0] + 16, w: 136 }); gdStrip(t, aT, m, 1, PR, { x: box[0] + box[2] - 152, w: 136 });
    text('True scale; strips magnified', box[0] + box[2] / 2, box[1] + box[3] - 18, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: aT });
    /* right: the parameters, as sliders */
    const rx = LM + 1340, rw = RM - rx, aP = tileA(t, 0.5, 0); demoWindow(rx, 290, rw, 660, aP);
    text('The arcs\' numbers', rx + 24, 290 + 40, { role: 'label', size: 19, color: C.mute, alpha: aP });
    rr(rx + 24, 290 + 62, rw - 48, 1.5, 0, C.hair, null, 0, aP);
    const Rm = key => { const a0 = A_.R[key], b0 = B_.R[key]; return a0 && b0 ? lerp(a0, b0, kk) : (b0 || a0 || 999); };
    const sl = [['Thumb pocket, z', p[0], -30, 50, 'mm', 1], ['Thumb, radius under the pad', Rm('thumb'), 10, 120, 'mm', 0], ['Front flare, thumb side', p[3], 0, 3, 'mm', 2],
      ['Pinky pocket, z', p[4], -30, 50, 'mm', 1], ['Pinky, radius under the pad', Rm('pinky'), 10, 120, 'mm', 0], ['Groove, radius under the pad', Rm('groove'), 5, 60, 'mm', 0]];
    sl.forEach(([nm, v, a0, a1, un, d], i) => {
      const y = 290 + 176 + i * 78, x0 = rx + 24, w0 = rw - 48, k = clamp((v - a0) / (a1 - a0));
      text(nm, x0, y, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: aP });
      text(fmtN(v, d) + ' ' + un, x0 + w0, y, { role: 'num', size: 22, color: C.ink, align: 'right', alpha: aP });
      line(x0, y + 26, x0 + w0, y + 26, { color: C.hair, w: 4, alpha: aP, cap: 'round' }); line(x0, y + 26, x0 + w0 * k, y + 26, { color: C.hero, w: 4, alpha: aP, cap: 'round' });
      circle(x0 + w0 * k, y + 26, 8, { fill: C.hero, alpha: aP });
    });
    text('Trial ' + gdNo(K) + ': ' + GD_NAME[K][0].toLowerCase() + ', ' + GD_NAME[K][1].toLowerCase(), rx + 24, 290 + 94, { role: 'small', size: 21, weight: 650, color: C.ink2, alpha: aP, maxW: rw - 48, sentence: false });
    source(t, 'Adam on central differences, ' + Ds.frames[nF - 1].it + ' steps. The landscape holds the trial\'s other numbers at their final values. Derived (deck/tools/gd/trials.py).', { t0: 2.0, maxW: 1760 });
  }
});

/* ============================== 8. the four trials ============================== */
S({
  id: 'gd_trials', ch: 'shape', theme: 'paper', title: 'Four trials', settle: 10,
  src: ['gdModel'],
  draw: t => {
    header(t, 'Four trials', { noIdeas: true });
    gdCaptions(t, [[0.6, 'Two ways to hold it, palm lifted or palm on the hump; two ways to place the pockets, mirrored or each where its finger rests.'],
      [5.0, 'With the palm on the hump the relaxed fingertips reach past the front, and the thumb finds no side to rest in. Lifted, every finger finds its valley.']]);
    const cell = bento(LM, 290, RM - LM, 640, 2, 2), best = gdBest();
    GD.order.forEach((k, i) => {
      const r = cell(i % 2, Math.floor(i / 2)), a = tileA(t, 0.3, i), Tk = GD.trials[k], hero = k === best; demoWindow(...r, a, { hero: false });
      const m = gdTopFit([r[0] + 20, r[1] + 20, 230, r[3] - 40], { ur: 34 });
      poly(gdOutline(m, GD.sora.plan, GD.sora.plan), { color: C.second, w: 1.5, alpha: a * 0.8 });
      poly(gdOutline(m, Tk.planL, Tk.planR), { color: C.hero, w: 2.5, alpha: a });
      const mark = (ok, x, y) => circle(x, y, 5, { fill: ok ? C.hero : C.red, alpha: a });
      mark(Tk.thumb.n_minima === 1, m.X(gdSide(Tk.planL)(Tk.thumb.z_bottom), -1), m.Y(Tk.thumb.z_bottom));
      mark(Tk.pinky.n_minima === 1, m.X(gdSide(Tk.planR)(Tk.pinky.z_bottom), 1), m.Y(Tk.pinky.z_bottom));
      const tx = r[0] + 280, tw2 = r[2] - 300;
      text('Trial ' + (i + 1), tx, r[1] + 44, { role: 'label', size: 20, color: hero ? C.heroText : C.mute, alpha: a });
      text(GD_NAME[k][0] + ', ' + GD_NAME[k][1].toLowerCase(), tx, r[1] + 78, { role: 'h3', size: 27, color: C.ink, alpha: a, maxW: tw2 });
      rich([{ s: 'Loss', role: 'label', size: 19, color: C.mute }, { s: fmtN(Tk.loss, 2), font: 'disp', size: 42, weight: 800, color: hero ? C.hero : C.ink, grad: hero ? C.heroGrad : null, gap: 12 }, hero ? { s: 'Lowest', role: 'label', size: 19, color: C.heroText, gap: 14 } : null], tx, r[1] + 132, { alpha: a });
      const R = Tk.R_opt, under = Tk.grooves_under_finger;
      const rad = v => v && v < 999 ? fmtN(v, 0) : 'flat';
      const lines = [
        ['Thumb', 'z ' + fmtN(Tk.thumb.z_bottom, 0) + ' (rests ' + fmtN(Tk.targets.thumb_z, 0) + '), R ' + rad(Tk.thumb.R_bottom) + ' of ' + fmtN(R.thumb, 0) + ', ' + Tk.thumb.n_minima + ' min', Tk.thumb.n_minima !== 1],
        ['Pinky', 'z ' + fmtN(Tk.pinky.z_bottom, 0) + ' (rests ' + fmtN(Tk.targets.pinky_z, 0) + '), R ' + rad(Tk.pinky.R_bottom) + ' of ' + fmtN(R.pinky, 0) + ', ' + Tk.pinky.n_minima + ' min', Tk.pinky.n_minima !== 1],
        ['Grooves', under ? 'x ±' + fmtN(Tk.groove.u_bottom, 0) + ', R ' + rad(Tk.groove.R_bottom) + ' of ' + fmtN(R.groove, 0) + ', 1 min each' : 'Not under the fingers (tips at z ' + fmtN(Tk.placement.z.index, 0) + ', ' + fmtN(Tk.placement.z.middle, 0) + ')', !under],
        ['Moves', fmtN(Tk.dev_sora, 2) + ' mm at most from the Sora', false]];
      lines.forEach(([l, v, bad], j) => {
        const y = r[1] + 176 + j * 31, kj = ep(t, 1.0 + i * 0.2 + j * 0.12, 1.4 + i * 0.2 + j * 0.12) * a;
        text(l, tx, y, { role: 'label', size: 19, color: C.mute, alpha: kj });
        text(v, tx + 104, y, { role: 'small', size: 21, weight: 650, color: bad ? C.red : C.ink2, alpha: kj, maxW: tw2 - 104, sentence: false });
      });
    });
    source(t, 'Each trial descends from Brock\'s base (the ULX\'s 2.5 mm pocket, 1 mm grooves). R: found, of the optimum; z: mm from the centre. Derived.', { t0: 2.0, maxW: 1760 });
  }
});

/* ============================== 9. before and after ============================== */
S({
  id: 'gd_after', ch: 'shape', theme: 'night', title: 'Still a traditional mouse', settle: 11,
  src: ['gdModel', 'gdShi', 'gdJohnson'],
  draw: t => {
    header(t, 'Still a traditional mouse', { noIdeas: true });
    gdCaptions(t, [[0.6, 'At true scale it is still the Sora. The change is a millimetre or two, and only where a finger rests.'],
      [5.0, 'Every curve now has a reason: a valley under each finger, at the strength its knuckle sets, and nothing anywhere else.']]);
    const K = GD_K, Tr = gdTr(K);
    const box = [LM, 290, 820, 660], m = gdTopFit([box[0] + 190, box[1] + 50, box[2] - 380, box[3] - 100], { ur: 34 }), aT = tileA(t, 0.2, 0);
    demoWindow(...box, aT);
    const kb = ep(t, 1.2, 2.4, E.cam);
    poly(gdOutline(m, GD.sora.plan, GD.sora.plan), { color: C.second, w: 2.5, alpha: aT });
    if (kb > 0) poly(gdOutline(m, gdMix(GD.sora.plan, Tr.planL, kb), gdMix(GD.sora.plan, Tr.planR, kb)), { color: C.hero, w: 3.5, alpha: aT });
    const ks = ep(t, 2.6, 3.2);
    gdStrip(t, aT * ks, m, -1, Tr.planL, { x: box[0] + 16, w: 160, p: ep(t, 2.8, 4.0, E.lin) }); gdStrip(t, aT * ks, m, 1, Tr.planR, { x: box[0] + box[2] - 176, w: 160, p: ep(t, 2.8, 4.0, E.lin) });
    text('True scale, Sora V2 in yellow', box[0] + box[2] / 2, box[1] + box[3] - 14, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: aT });
    /* the section, with the grooves and the ring */
    const sb = [LM + 860, 290, 560, 400], aS = tileA(t, 0.4, 0); demoWindow(...sb, aS);
    const ms = gdSecFit([sb[0] + 30, sb[1] + 60, sb[2] - 60, sb[3] - 90], { ur: 34, yr: [0, 40] });
    gdSecDraw(ms, GD.sora.sec, { color: C.second, w: 2, alpha: aS });
    gdSecDraw(ms, Tr.sec, { color: C.hero, w: 3, alpha: aS });
    text('Across the buttons, z ' + Tr.targets.station_z, sb[0] + 24, sb[1] + 40, { role: 'label', size: 19, color: C.mute, alpha: aS });
    if (Tr.grooves_under_finger) { for (const sd of [-1, 1]) circle(ms.X(Tr.groove.u_bottom, sd), ms.Y(Tr.groove.y_bottom), 6, { fill: C.hero, alpha: aS * ep(t, 3.4, 3.8) }); }
    else text('The index and middle tips land past z 48 in this trial', sb[0] + 24, sb[1] + sb[3] - 20, { role: 'small', size: 21, weight: 650, color: C.red, alpha: aS });
    /* the hero number and the reasons */
    const nb = [LM + 860, 730, 560, 220], aN = tileA(t, 3.6, 0); demoWindow(...nb, aN);
    text('The most the outline moves', nb[0] + 28, nb[1] + 46, { role: 'label', size: 20, color: C.mute, alpha: aN });
    rich([{ s: fmtN(Tr.dev_sora, 2), font: 'disp', size: 110, weight: 800, color: C.hero, grad: C.heroGrad, count: [3.8, 1.0, 0] }, { s: 'mm', role: 'label', size: 26, color: C.mute, gap: 10 }], nb[0] + 28, nb[1] + 170, { t, alpha: aN });
    text('Side profile untouched', nb[0] + nb[2] - 28, nb[1] + 200, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: aN });
    const rx = LM + 1460, rw = RM - rx, aR = tileA(t, 5.0, 0); demoWindow(rx, 290, rw, 660, aR);
    text('Each curve, its reason', rx + 24, 290 + 40, { role: 'label', size: 19, color: C.mute, alpha: aR });
    const rad = v => v && v < 999 ? fmtN(v, 0) : 'flat';
    const why = [['Thumb pocket', 'R ' + rad(Tr.thumb.R_bottom) + ' of ' + fmtN(Tr.R_opt.thumb, 0) + ', at z ' + fmtN(Tr.thumb.z_bottom, 0)], ['Pinky pocket', 'R ' + rad(Tr.pinky.R_bottom) + ' of ' + fmtN(Tr.R_opt.pinky, 0) + ', at z ' + fmtN(Tr.pinky.z_bottom, 0)],
      ['Grooves', Tr.grooves_under_finger ? 'R ' + rad(Tr.groove.R_bottom) + ' of ' + fmtN(Tr.R_opt.groove, 0) + ', x ±' + fmtN(Tr.groove.u_bottom, 0) : 'not under the fingers'], ['Ring shoulder', fmtN(Tr.ring.k_deg_per_mm, 1) + ' °/mm, no valley'], ['Front flare', 'None: the numbers chose none (the ULX has ' + fmtN(GD.ulx.flare, 1) + ' mm a side). Lifting the mouse is not modelled yet; there flare would have to earn its place.']];
    why.forEach(([h, b], i) => {
      const y = 290 + 96 + i * 108, k = ep(t, 5.2 + i * 0.25, 5.7 + i * 0.25) * aR;
      text(h, rx + 24, y, { role: 'h3', size: 25, color: C.ink, alpha: k }); text(b, rx + 24, y + 34, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: k, maxW: rw - 48 });
    });
    text('Trial ' + gdNo(K) + ': ' + GD_NAME[K][0].toLowerCase() + ', ' + GD_NAME[K][1].toLowerCase(), box[0] + 24, box[1] + 40, { role: 'small', size: 21, weight: 650, color: C.ink2, alpha: aT, sentence: false });
    source(t, 'R found against the optimum (derived from Shi 2020 and Johnson 2000). The strips magnify how far each side moves from the Sora; the outline itself is true scale.', { t0: 2.0, maxW: 1760 });
  }
});
