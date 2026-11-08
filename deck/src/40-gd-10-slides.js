/* ============================================================================================
   40-gd slides. One idea per slide, each caption with its motion; outlines true scale, the millimetres in labelled,
   magnified strips. Blue: the descended shape; yellow: the Sora and the ULX; red: faults only; fingers grey.
   ============================================================================================ */

/* ============================== 1. title ============================== */
S({
  id: 'gd_title', ch: 'shape', theme: 'night', title: 'Shape, by gradient descent', settle: 8.5,
  src: ['gdModel', 'gdBrock'],
  draw: t => {
    header(t, 'Shape, by gradient descent', { noIdeas: true });
    gdCaptions(t, [[0.6, 'A mouse\'s outline is a few long curves. Fit each as an arc, and each becomes a depth, a length and an angle you can set.'],
      [4.4, 'Then let the hand at rest set them: one valley under each finger that holds the mouse, none under the ring finger.']], { maxW: 980 });
    const Tr = laTr(), box = [1120, 280, 640, 660], m = gdTopFit(box, { ur: 34 }), so = laPlan(LA.sora.planArcs);
    /* the Sora's long arcs arrive one by one, both sides at once, a handle at every join */
    for (const sd of [-1, 1]) laRegions(m, so, sd, LA_PLAN_REG, { t, t0: 0.5, dt: 0.45, w: 3, tones: [C.second, mix(C.second, TH ? '#000000' : '#FFFFFF', 0.4)] });
    /* then the descended outline, true scale, over it */
    const cL = laPlan(Tr.endArcs.planL), cR = laPlan(Tr.endArcs.planR), kd = ep(t, 3.3, 4.3, E.cam);
    if (kd > 0) poly(gdOutline(m, cL.pts, cR.pts), { color: C.hero, w: 3.5, p: kd });
    /* the four minima, and the ring finger's shoulder (no minimum) */
    const kp = ep(t, 4.6, 5.2), pulse = 1 + 0.18 * Math.sin(Math.max(0, t - 5.2) * 3) * Math.exp(-Math.max(0, t - 5.2) * 0.6), e = Tr.end;
    const zg = Tr.targets.station_z, ug = e.groove.u_bottom;
    const pts = [['Thumb', m.X(e.thumb.u_bottom, -1), m.Y(e.thumb.z_bottom), 'l'], ['Pinky', m.X(e.pinky.u_bottom, 1), m.Y(e.pinky.z_bottom), 'r'], ['Index', m.X(ug, -1), m.Y(zg), 'u'], ['Middle', m.X(ug, 1), m.Y(zg), 'u']];
    pts.forEach(([nm, x, y, sd], i) => {
      const a = kp * ep(t, 4.6 + i * 0.12, 5.0 + i * 0.12); if (a <= 0) return;
      circle(x, y, 9 * pulse, { fill: C.hero, alpha: a }); circle(x, y, 18 * pulse, { color: C.hero, w: 2, alpha: 0.35 * a });
      if (sd === 'u') text(nm, x, y - 30, { role: 'label', size: 21, color: C.heroText, align: 'center', alpha: a });
      else text(nm, x + (sd === 'l' ? -30 : 30), y + 8, { role: 'label', size: 21, color: C.heroText, align: sd === 'l' ? 'right' : 'left', alpha: a });
    });
    /* the ring's marker on the shoulder at the station (G4: the mirrored pinky valley sits at z 24 now, where it was drawn) */
    const ka = ep(t, 5.4, 5.9), rx = m.X(e.groove.ring.u, 1), ry = m.Y(zg + 2);
    circle(rx, ry, 9, { color: C.ink2, w: 2, alpha: ka }); text('Ring: no valley', rx + 30, ry + 8, { role: 'label', size: 20, color: C.mute, alpha: ka });
    text('Sora V2 as long arcs (yellow), the result (blue), true scale', box[0] + box[2] / 2, box[1] + box[3] + 24, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: ep(t, 1, 1.5) });
    const cell = bento(LM, 520, 920, 320, 3, 1);
    statTile(t, 5.6, cell(0, 0), { value: '4', label: 'Valleys, one per finger', quiet: true, count: false });
    statTile(t, 5.75, cell(1, 0), { value: fmtN(e.R.thumb, 0), unit: 'mm', label: Tr.symmetric ? 'Mirrored waist, felt over the slide' : 'Thumb\'s waist, felt over its slide', quiet: true, count: false });
    statTile(t, 5.9, cell(2, 0), { value: fmtN(e.dev.plan, 1), unit: 'mm', label: 'The most the outline moves', hero: true, count: false });
    text('Brock Liddicoat, shape designer of the Finalmouse Starlight X', LM, 900, { role: 'small', size: 25, weight: 650, color: C.mute, alpha: ep(t, 1.2, 1.8) });
    source(t, 'Sora V2 base: 3d/shell/shell-sora.glb, from Brock\'s scan. Arcs, felt strength and descent: derived (deck/tools/gd/longarcs.py).', { t0: 1.5, maxW: 960 });
  }
});

/* ============================== 2. opinion, then a number ============================== */
S({
  id: 'gd_number', ch: 'shape', theme: 'paper', title: 'Shape is opinion. Make it a number.', settle: 10,
  src: ['gdTpu', 'gdModel'],
  draw: t => {
    header(t, 'Shape is opinion. Make it a number.', { noIdeas: true });
    gdCaptions(t, [[0.6, 'A review describes a shape in words. The same shape, measured, is three widths: how far the sides come in, and how far the front flares.'],
      [5.4, 'The study turns the rules of comfort into terms of one number, the loss. Lower is better, and gradient descent lowers it.']]);
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
    text('Per side: ' + fmtN(GD.ulx.pocket, 1) + ' mm in under the hump, ' + fmtN(GD.ulx.flare, 1) + ' mm of flare (derived).', W0[0] + 32, W0[1] + 258, { role: 'small', size: 25, weight: 650, color: C.ink2, alpha: aW * kd, maxW: W0[2] - 64 });
    /* right: the loss, its terms, and the number going down */
    const R0 = [LM + 900, 300, RM - LM - 900, 640], aR = tileA(t, 5.4, 0), T_ = laTr();
    demoWindow(...R0, aR);
    text('One number to lower', R0[0] + 32, R0[1] + 52, { role: 'label', size: 21, color: C.mute, alpha: aR });
    /* G4: each side valley on its finger's slide as you grip, the grooves under the tips; symmetry a rule outside the number */
    const terms = [['Under the finger', 'Side valleys on the fingers\' slides; grooves under the tips'], ['Felt, and no more', 'The gentlest arc felt over the whole slide as you grip'],
      ['One minimum per finger', 'No second dip; none under the ring finger'], ['Still a normal mouse', 'As wide as real mice, no deeper than the ULX, close to the Sora']];
    terms.forEach(([h, b], i) => {
      const y = R0[1] + 112 + i * 86, k = ep(t, 5.7 + i * 0.35, 6.2 + i * 0.35) * aR;
      text('+', R0[0] + 32, y + 4, { role: 'h3', size: 32, color: C.heroText, alpha: k });
      text(h, R0[0] + 72, y, { role: 'h3', size: 28, color: C.ink, alpha: k });
      text(b, R0[0] + 72, y + 34, { role: 'small', size: 23, weight: 600, color: C.mute, alpha: k, maxW: R0[2] - 110 });
    });
    text('One rule stays outside the number: the shell is mirror-symmetric.', R0[0] + 72, R0[1] + 112 + 4 * 86 - 4, { role: 'small', size: 22, weight: 650, color: C.ink2, alpha: ep(t, 7.1, 7.5) * aR, maxW: R0[2] - 110 });
    const kc = ep(t, 7.3, 9.3, E.io3), Lv = lerp(T_.loss0, T_.loss, kc);
    text('Loss', R0[0] + 32, R0[1] + R0[3] - 110, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 7.2, 7.6) });
    text(gdLoss(Lv), R0[0] + 32, R0[1] + R0[3] - 32, { role: 'd2', size: 96, color: C.hero, grad: C.heroGrad, alpha: ep(t, 7.2, 7.6) });
    text('Lower is better. Trial ' + laNo(LA_K) + ', from its start to its end.', R0[0] + R0[2] - 32, R0[1] + R0[3] - 40, { role: 'small', size: 22, weight: 600, color: C.mute, align: 'right', alpha: ep(t, 8.6, 9.2) });
    source(t, 'TechPowerUp, Finalmouse UltralightX review: widths front 5.88, grip 5.66, rear 6.16 cm. The loss and its terms: derived (deck/tools/gd/longarcs.py).', { t0: 2.0 });
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
      [8.4, 'Lift the palm instead, as in orbit, and the fingertips land on the buttons with the palm 28 mm over the hump: trial ' + laNo(GD_REC) + '\'s grip.']], { maxW: 1500 });
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
    const tag = t < 8.6 ? (t < 4.8 ? ['Floating, nothing to hold', C.mute] : ['Palm on the hump, wrist back 15°', C.ink2]) : ['Palm lifted, wrist straight: trial ' + laNo(GD_REC) + '\'s grip', C.heroText];
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

/* ============================== 4. Newtonian shape analysis ============================== */
S({
  id: 'gd_landscape', ch: 'shape', theme: 'paper', title: 'Newtonian shape analysis', settle: 12.5,
  src: ['gdBrock', 'gdModel', 'gdPont', 'gdGordon'],
  draw: t => {
    header(t, 'Newtonian shape analysis', { noIdeas: true });
    gdCaptions(t, [[0.6, 'Press a fingertip onto a curve and the curve pushes back along its normal. Across a valley, the normals lean in toward its bottom.'],
      [4.6, 'That lean is what the fingertip feels, so a valley tells it where it is. One valley only: a second dip is a second place to settle.'],
      [8.6, 'The ring finger gets no valley. It rests on the shoulder, where the slope and how fast it turns are checked instead.']]);
    const T_ = laTr(), e = T_.end, box = [LM, 290, 1180, 640], aB = tileA(t, 0.2, 0);
    demoWindow(...box, aB);
    const ms = gdSecFit([box[0] + 40, box[1] + 64, box[2] - 80, 390], { ur: 34, yr: [0, 40] }), ch = laSec(T_.endArcs.sec), so = laSec(LA.sora.secArcs);
    /* the Sora's section (yellow, faint) and the result (blue), true scale; the wheel's slot open */
    laSecDraw(ms, so, { color: C.second, w: 2, alpha: aB * 0.6 });
    laSecDraw(ms, ch, { color: C.hero, w: 3.5, alpha: aB });
    text('Wheel', ms.cx, ms.Y(LA.S0[1]) - 14, { role: 'tick', size: 19, color: C.faint, align: 'center', alpha: aB });
    text('Across the buttons at z ' + T_.targets.station_z + ' mm, seen from behind, true scale', box[0] + 28, box[1] + 44, { role: 'label', size: 20, color: C.mute, alpha: aB });
    /* the normals across where the index fingertip lands, drawn long so their lean shows */
    const top = ch.pts.filter(q => q[1] > 12), us = top.map(q => q[0]), ys = top.map(q => q[1]), yAt = u => gdInterp(u, us, ys);
    const ug = e.groove.u_bottom, zone = T_.zones.groove, kn = ep(t, 1.4, 2.4);
    const nrm = u => { const d = (yAt(u + 0.2) - yAt(u - 0.2)) / 0.4, L = Math.hypot(1, d); return [d / L, 1 / L]; };   /* outward normal in mm (u, y) */
    for (let i = 0; i <= 6; i++) {
      const u = ug - zone / 2 + zone * i / 6, n = nrm(u), px = ms.X(u, -1), py = ms.Y(yAt(u)), Lh = 120 * kn;
      line(px, py, px + n[0] * Lh, py - n[1] * Lh, { color: inkA(0.55), w: 2, alpha: aB * ep(t, 1.4 + i * 0.08, 1.8 + i * 0.08) });
    }
    const n0 = nrm(ug - zone / 2), n1 = nrm(ug + zone / 2), turn = Math.abs(Math.atan2(n0[0], n0[1]) - Math.atan2(n1[0], n1[1])) * 180 / Math.PI;
    const kt = ep(t, 2.6, 3.0);
    text('Normals turn ' + fmtN(turn, 1) + '°', box[0] + 28, box[1] + 112, { role: 'num', size: 24, color: C.ink, alpha: aB * kt });
    text('across the ' + fmtN(zone, 0) + ' mm where', box[0] + 28, box[1] + 144, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: aB * kt });
    text('fingertips land; felt from ' + fmtN(LA.turn_rel_deg, 1) + '°', box[0] + 28, box[1] + 172, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: aB * kt, sentence: false });
    gdTip(ms.X(ug, -1), ms.Y(yAt(ug)) - 4.3 * ms.s, 4.3 * ms.s, aB * ep(t, 3.2, 3.6));
    gdTip(ms.X(ug, 1), ms.Y(yAt(ug)) - 4.3 * ms.s, 4.3 * ms.s, aB * ep(t, 3.3, 3.7));
    /* the button's valley against its own chord, depth x2: one valley each, the Sora's beside it */
    const ib = [box[0] + 40, box[1] + box[3] - 214, 680, 184], ki = ep(t, 5.0, 5.5) * aB;
    if (ki > 0) {
      rr(...ib, 6, TH ? '#F3F3F5' : '#0B0C0D', null, 0, ki);
      text('Button top, depth ×2', ib[0] + 16, ib[1] + 30, { role: 'label', size: 18, color: C.ink2, alpha: ki });
      /* F65.7 (Brock ~14:20): the groove's one low point counts against the button's own slope, the direction the finger presses */
      text('Its low point counts against the button\'s own slope, not level.', ib[0] + 16, ib[1] + 122, { role: 'small', size: 20, weight: 600, color: C.ink2, alpha: ki * ep(t, 6.0, 6.4) });
      const sx = (ib[2] - 60) / (LA.btn[1] - LA.btn[0]), X = u => ib[0] + 30 + (u - LA.btn[0]) * sx, Y0 = ib[1] + 66;
      line(X(LA.btn[0]), Y0, X(LA.btn[1]), Y0, { color: C.mute, w: 1.5, dash: [5, 4], alpha: ki });
      const gapOf = c => { const tp = c.pts.filter(q => q[1] > 12), U = tp.map(q => q[0]), V = tp.map(q => q[1]), y0 = gdInterp(LA.btn[0], U, V), y1 = gdInterp(LA.btn[1], U, V); return u => (y0 + (y1 - y0) * (u - LA.btn[0]) / (LA.btn[1] - LA.btn[0])) - gdInterp(u, U, V); };
      const gS = gapOf(so), gT = gapOf(ch), pl = (g, col, wd, p) => { const P = []; for (let u = LA.btn[0]; u <= LA.btn[1] + 1e-9; u += 0.2) P.push([X(u), Y0 + g(u) * 2 * sx]); poly(P, { color: col, w: wd, alpha: ki, p }); };
      pl(gS, C.second, 2, ep(t, 5.2, 6.2, E.lin)); pl(gT, C.hero, 3, ep(t, 5.4, 6.4, E.lin));
      const ka = ep(t, 6.4, 6.8) * ki; circle(X(ug), Y0 + gT(ug) * 2 * sx, 6, { fill: C.hero, alpha: ka });
      text('One valley: ' + fmtN(gT(ug), 2) + ' mm deep, at x ' + fmtN(ug, 0), ib[0] + 16, ib[1] + ib[3] - 16, { role: 'small', size: 21, weight: 650, color: C.heroText, alpha: ka });
    }
    if (!T_.grooves_under_finger) text('In this trial the index and middle tips land past z 48: the grooves are not under them', box[0] + 28, box[1] + box[3] - 24, { role: 'small', size: 22, weight: 650, color: C.red, alpha: aB });
    /* the ring finger on the shoulder: the tangent, the rate of turn */
    const kr = ep(t, 8.8, 9.4), R_ = e.groove.ring;
    if (kr > 0) {
      const j = top.reduce((b, q, i) => (Math.abs(q[0] - R_.u) < Math.abs(top[b][0] - R_.u) ? i : b), 0);
      const q0 = top[Math.max(0, j - 3)], q1 = top[Math.min(top.length - 1, j + 3)], tx = q1[0] - q0[0], ty = q1[1] - q0[1], L = Math.hypot(tx, ty);
      const px = ms.X(top[j][0], 1), py = ms.Y(top[j][1]), dx = tx / L, dy = -ty / L;
      line(px - dx * 90, py - dy * 90, px + dx * 90, py + dy * 90, { color: C.ink, w: 2, alpha: kr });
      gdTip(px + dy * 4.3 * ms.s, py - dx * 4.3 * ms.s, 4.3 * ms.s, kr * 0.95);
      circle(px, py, 6, { fill: C.ink, alpha: kr });
      text('Ring: ' + fmtN(R_.k_deg_per_mm, 1) + ' °/mm, slope ' + fmtN(Math.abs(R_.slope_deg), 0) + '°', box[0] + box[2] - 28, box[1] + box[3] - 66, { role: 'num', size: 26, color: C.ink, align: 'right', alpha: kr });
      text('In the 6 to 22 °/mm band. No valley.', box[0] + box[2] - 28, box[1] + box[3] - 30, { role: 'small', size: 22, weight: 600, color: C.mute, align: 'right', alpha: kr });
    }
    /* right: the rule, counted */
    const rx = LM + 1220, rw = RM - rx, kR = tileA(t, 4.8, 0), under = T_.grooves_under_finger;
    demoWindow(rx, 290, rw, 640, kR);
    text('One minimum per finger', rx + 32, 290 + 52, { role: 'label', size: 21, color: C.mute, alpha: kR });
    text('Counted along each finger\'s own stretch', rx + 32, 290 + 92, { role: 'small', size: 22, weight: 600, color: C.mute, alpha: kR, maxW: rw - 64 });
    const cnt = [['Thumb', e.thumb.n_minima, 1], ['Index', under ? e.groove.n_minima : null, 1], ['Middle', under ? e.groove.n_minima : null, 1], ['Ring', under ? R_.n_minima : null, 0], ['Pinky', e.pinky.n_minima, 1]];
    cnt.forEach(([nm, v, want], i) => {
      const y = 290 + 190 + i * 88, k = ep(t, 5.2 + i * 0.25, 5.7 + i * 0.25) * kR, ok = v === want;
      text(nm, rx + 32, y, { role: 'h3', size: 30, color: C.ink, alpha: k });
      text(v == null ? 'Not under it' : String(v), rx + rw - 32, y + (v == null ? 0 : 6), v == null ? { role: 'small', size: 23, weight: 650, color: C.red, align: 'right', alpha: k } : { font: 'disp', size: 52, weight: 800, color: ok ? C.heroText : C.red, align: 'right', alpha: k });
      line(rx + 32, y + 30, rx + rw - 32, y + 30, { color: C.hair, w: 1.5, alpha: k });
    });
    source(t, 'Trial ' + laNo(LA_K) + ' (' + GD_NAME[LA_K][0].toLowerCase() + ', ' + GD_NAME[LA_K][1].toLowerCase() + '). Normals and minima from the arcs; the valley measured against the button\'s chord, as the finger feels it (Pont 1999). Threshold: Gordon & Morison 1982. Derived.', { t0: 2.0, maxW: 1760 });
  }
});

/* ============================== 5. how strong a pocket should be: the first estimate, friction, felt over the slide ============================== */
S({
  id: 'gd_strength', ch: 'shape', theme: 'night', title: 'How strong a pocket should be', settle: 13.5,
  src: ['gdShi', 'gdJohnson', 'gdDerler', 'gdGordon', 'gdPont', 'gdGoodwin', 'gdSerhat', 'gdLeeJung', 'gdBuryanov', 'gdAnsur', 'gdModel'],
  draw: t => {
    header(t, 'How strong a pocket should be', { noIdeas: true });
    const St = GD.strength.table, R1 = St.thumb.R_opt_mm, Tr = laTr(), SL = LA.slide, dT = SL.p50.thumb, Rf = SL.R_felt.thumb, mu = LA.mu, fa = mu.map(v => Math.atan(v) * 180 / Math.PI);
    const turn = LA.turn_rel_deg * Math.PI / 180, Rland = Tr.contact.land.thumb / turn;
    const sag = (R, c) => R - Math.sqrt(R * R - c * c / 4), scoop = sag(R1, 60);
    gdCaptions(t, [[0.6, 'The first estimate made each pocket pull the finger back as hard as its knuckle does: R ' + fmtN(R1, 0) + ' mm along the sides, a ' + fmtN(scoop, 0) + ' mm scoop.'],
      [4.6, 'It left out friction. Skin grips plastic, so a resting fingertip stays put on any slope under about ' + fmtN(fa[0], 0) + '°. The pocket never has to hold it.'],
      [8.6, 'Its job is to be felt. Over the ' + fmtN(dT, 0) + ' mm the thumb slides as you grip, the gentlest arc a fingertip reliably feels is R ' + fmtN(Rf, 0) + ' mm.']]);
    const cell = bento(LM, 290, RM - LM, 380, 3, 1);
    /* 1. the first estimate, true scale: a 60 mm stretch of the side, the Sora's (yellow) and R 47's scoop (red: the fault) */
    { const r = cell(0, 0), a = tileA(t, 0.3, 0); demoWindow(...r, a);
      text('First estimate', r[0] + 28, r[1] + 48, { role: 'label', size: 21, color: C.mute, alpha: a });
      const s = (r[2] - 120) / 60, x0 = r[0] + 60, yb = r[1] + 150, X = z => x0 + (z + 30) * s, Y = d => yb + d * s;
      line(X(-30), Y(0), X(30), Y(0), { color: C.second, w: 2.5, alpha: a });
      const P = []; for (let z = -30; z <= 30.001; z += 0.5) P.push([X(z), Y(sag(R1, 60) - (R1 - Math.sqrt(R1 * R1 - z * z)))]);
      poly(P, { color: C.red, w: 3.5, alpha: a, p: ep(t, 1.0, 2.2, E.io3) });
      dim(t, 2.4, [X(0), Y(0)], [X(0), Y(scoop)], fmtN(scoop, 1) + ' mm', 60, { tcolor: C.ink });
      text('R ' + fmtN(R1, 0) + ' mm over 60 mm of side, true scale', r[0] + 28, r[1] + r[3] - 64, { role: 'small', size: 22, weight: 650, color: C.ink2, alpha: a * ep(t, 2.2, 2.6) });
      text('Matched to the knuckle\'s stiffness (Shi 2020)', r[0] + 28, r[1] + r[3] - 30, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: a * ep(t, 2.4, 2.8) }); }
    /* 2. friction: a fingertip on a slope, held while the slope is under the friction angle */
    { const r = cell(1, 0), a = tileA(t, 4.6, 0); demoWindow(...r, a);
      text('What it missed: friction', r[0] + 28, r[1] + 48, { role: 'label', size: 21, color: C.mute, alpha: a });
      const cx = r[0] + r[2] / 2, cy = r[1] + 205, tilt = ep(t, 5.2, 7.0, E.io3) * fa[0] * Math.PI / 180, L = r[2] * 0.36;
      line(cx - Math.cos(tilt) * L, cy + Math.sin(tilt) * L, cx + Math.cos(tilt) * L, cy - Math.sin(tilt) * L, { color: C.ink2, w: 3, alpha: a });
      line(cx - L, cy, cx + L, cy, { color: C.hair, w: 1.5, dash: [5, 5], alpha: a });
      gdTip(cx - Math.sin(tilt) * 26, cy - Math.cos(tilt) * 26, 26, a);
      G.save(); G.globalAlpha = a; G.strokeStyle = C.mute; G.lineWidth = 1.5; G.beginPath(); G.arc(cx, cy, L * 0.7, -tilt, 0); G.stroke(); G.restore();
      text(fmtN(tilt * 180 / Math.PI, 0) + '°', cx + L * 0.74, cy - 10, { role: 'num', size: 24, color: C.ink, alpha: a * ep(t, 5.2, 5.5) });
      rich([{ s: 'μ', role: 'small', size: 24, weight: 650, color: C.mute }, { s: fmtN(mu[0], 1) + ' to ' + fmtN(mu[1], 1), role: 'num', size: 26, color: C.ink, gap: 10 }, { s: 'dry skin on plastic', role: 'small', size: 21, weight: 600, color: C.mute, gap: 12 }], r[0] + 28, r[1] + r[3] - 64, { alpha: a * ep(t, 6.0, 6.4) });
      text('Holds on a slope up to ' + fmtN(fa[0], 0) + '° to ' + fmtN(fa[1], 0) + '°', r[0] + 28, r[1] + r[3] - 30, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: a * ep(t, 6.4, 6.8) }); }
    /* 3. felt over the slide: the thumb lands dT ahead of the valley's bottom and slides down into it as you grip; the surface
       turns 3.4 deg under it on the way (true scale, 60 mm of side) */
    { const r = cell(2, 0), a = tileA(t, 8.6, 0); demoWindow(...r, a, { hero: true });
      text('Its real job: to be felt', r[0] + 28, r[1] + 48, { role: 'label', size: 21, color: C.heroText, alpha: a });
      const cx = r[0] + r[2] / 2 - 40, cy = r[1] + 176, s = (r[2] - 100) / 60, X = z => cx + z * s, Yz = z => cy - (Rf - Math.sqrt(Rf * Rf - z * z)) * s;
      const P = []; for (let z = -24; z <= 36.001; z += 0.5) P.push([X(z), Yz(z)]);
      poly(P, { color: C.hero, w: 3.5, alpha: a, p: ep(t, 8.9, 9.8, E.io3) });
      const ks = ep(t, 10.0, 11.0, E.io3), zt = dT * (1 - ks), kT_ = ep(t, 9.7, 10.0) * a, rt = 22;
      const nrm = z => { const sl = -z / Math.sqrt(Rf * Rf - z * z), L_ = Math.hypot(sl, 1); return [sl / L_, 1 / L_]; };
      /* the slide's track under the arc, growing behind the fingertip */
      if (kT_ > 0) rr(X(zt), cy + 14, (dT - zt) * s, 6, 3, C.hero, null, 0, kT_);
      /* the normals at the two ends of the slide, under the fingertip: they differ by the turn the thumb feels */
      const kz = ep(t, 11.0, 11.4) * a;
      for (const z of [0, dT]) { const n = nrm(z), y = Yz(z); line(X(z), y, X(z) + n[0] * 100, y - n[1] * 100, { color: C.ink2, w: 2, alpha: kz }); }
      const nt = nrm(zt); gdTip(X(zt) + nt[0] * rt, Yz(zt) - nt[1] * rt, rt, kT_);
      text(fmtN(dT, 0) + ' mm the thumb slides as you grip', X(dT / 2), cy + 50, { role: 'small', size: 21, weight: 650, color: C.ink2, align: 'center', alpha: kz });
      rich([{ s: 'R', role: 'label', size: 22, color: C.mute }, { s: fmtN(Rf, 0), font: 'disp', size: 64, weight: 800, color: C.hero, grad: C.heroGrad, gap: 10 }, { s: 'mm turns ' + fmtN(LA.turn_rel_deg, 1) + '° over the slide', role: 'small', size: 22, weight: 650, color: C.ink2, gap: 12, sentence: false }], r[0] + 28, r[1] + r[3] - 30, { alpha: a * ep(t, 11.2, 11.6) }); }
    /* the radii on one axis, and the derivation in four steps */
    const kb = tileA(t, 11.2, 0), ch = [LM, 710, 1060, 240]; demoWindow(...ch, kb);
    text('Radius along the side, mm (log)', ch[0] + 28, ch[1] + 44, { role: 'label', size: 19, color: C.mute, alpha: kb });
    const lx = v => ch[0] + 60 + (ch[2] - 120) * (Math.log(v) - Math.log(30)) / (Math.log(1000) - Math.log(30)), ly = ch[1] + 150;
    line(lx(30), ly, lx(1000), ly, { color: C.hair, w: 2, alpha: kb });
    rr(lx(30), ly - 5, lx(Rf) - lx(30), 10, 5, C.heroSoft, null, 0, kb);
    [30, 50, 100, 200, 500, 1000].forEach(v => text(String(v), lx(v), ly + 36, { role: 'tick', size: 18, color: C.faint, align: 'center', alpha: kb }));
    /* [radius, name, colour, row (-1 above, 1 below), align] */
    const mk = [[R1, 'First estimate', C.red, -1, 'center'], [Rland, 'Where it lands', C.mute, -1, 'right'], [Rf, 'Felt over the slide', C.hero, -1, 'center'],
      [Tr.end.R.thumb, 'Trial ' + laNo(LA_K), C.hero, 1, 'right'], [LA.sora.R_waist, 'Sora V2', C.second, 1, 'left']];
    mk.forEach(([v, nm, col, up, al], i) => {
      const k = ep(t, 11.4 + i * 0.2, 11.8 + i * 0.2) * kb, x = lx(v), tx = al === 'right' ? x + 2 : al === 'left' ? x - 2 : x;
      circle(x, ly, 8, { fill: col, alpha: k });
      text(nm + ', R ' + fmtN(v, 0), tx, ly + (up < 0 ? -26 : 66), { role: 'small', size: 20, weight: 650, color: col === C.second ? C.secondText : col === C.hero ? C.heroText : col, align: al, alpha: k });
    });
    text('Felt: sharper than this', lx(30) + 6, ly + 66, { role: 'label', size: 18, color: C.heroText, alpha: kb * ep(t, 12.4, 12.8) });
    const nx = LM + 1100, nw = RM - nx, kn = tileA(t, 11.4, 0); demoWindow(nx, 710, nw, 240, kn);
    const steps = [['Thumb slides as you grip', fmtN(dT, 1) + ' mm', 'Hand model'], ['Pinky slides as you grip', fmtN(SL.p50.pinky, 1) + ' mm', 'Hand model'],
      ['Turn felt reliably', fmtN(LA.turn_rel_deg, 1) + '°', 'Gordon 1982'], ['Gentlest felt arc, thumb', 'R ' + fmtN(Rf, 0) + ' mm', 'Derived']];
    steps.forEach(([l, v, sname], i) => {
      const y = 710 + 52 + i * 46, k = ep(t, 11.6 + i * 0.25, 12.0 + i * 0.25) * kn;
      text(l, nx + 28, y, { role: 'small', size: 21, weight: 600, color: C.mute, alpha: k });
      text(v, nx + nw - 150, y, { role: 'num', size: 23, color: i === 3 ? C.heroText : C.ink, align: 'right', alpha: k }); text(sname, nx + nw - 28, y, { role: 'label', size: 17, color: C.faint, align: 'right', alpha: k, caps: false });
    });
    source(t, 'First estimate: knuckle stiffness (Shi 2020) against the press (Johnson 2000). Friction: Derler & Gerhardt 2012. Slide: the hand model, palm on the hump to palm lifted, mean hand (' + fmtN(SL.range.thumb[0], 0) + ' to ' + fmtN(SL.range.thumb[1], 0) + ' mm, 5th to 95th). Felt: Gordon & Morison 1982, mean + 2 SD = 3.4°; Pont 1999. Derived.', { t0: 2.0, maxW: 1760 });
  }
});

/* ============================== 6. the shape as long arcs ============================== */
/** a sweep's arcs at value v (mixed between its two nearest entries) */
function laSweep(sw, v) { let i = 0; while (i < sw.length - 2 && sw[i + 1].v < v) i++; const k = clamp((v - sw[i].v) / ((sw[i + 1].v - sw[i].v) || 1)); return laMix(sw[i].arcs, sw[i + 1].arcs, k); }
S({
  id: 'gd_arcs', ch: 'shape', theme: 'paper', title: 'The shape as long arcs', settle: 13,
  src: ['gdModel', 'gdGordon', 'gdPont', 'gdSerhat', 'gdAnsur'],
  draw: t => {
    header(t, 'The shape as long arcs', { noIdeas: true });
    gdCaptions(t, [[0.6, 'Regrouped, the Sora\'s outline is a few long arcs: round the nose, down the front, along the waist, round the hump and the tail.'],
      [4.6, 'Drag the waist arc and the whole side follows, at true scale. Its narrowest point is the thumb\'s one minimum, by construction.'],
      [8.8, 'Across the buttons, the same idea: a gentle groove arc spanning most of the button. Its bottom is the finger\'s one minimum.']]);
    const Tr = laTr(GD_REC), pF = Tr.final, so = laPlan(LA.sora.planArcs), Rf = 1 / Tr.k_felt.thumb;
    /* left: the top view, true scale */
    const box = [LM, 290, 700, 660], aB = tileA(t, 0.2, 0); demoWindow(...box, aB);
    const m = gdTopFit([box[0] + 20, box[1] + 50, box[2] - 300, box[3] - 80], { ur: 34 });
    text('Top view, true scale', box[0] + 28, box[1] + 44, { role: 'label', size: 20, color: C.mute, alpha: aB });
    /* the depth the cursor sets: the trial's, then shallow, deep, and back */
    const d0 = pF[1], dv = t < 5.0 ? d0 : springKeys(t, [[0, d0], [5.2, 0.35], [6.3, 2.6], [7.5, d0]], { f: 1.1, z: 0.9 });
    const mk = ep(t, 3.0, 4.2, E.cam), arcsL = mk < 1 ? laMix(LA.sora.planArcs, Tr.endArcs.planL, mk) : (t < 5.0 ? Tr.endArcs.planL : laSweep(LA.sweep.depth, dv));
    const cL = laPlan(arcsL);
    for (const sd of [1]) laRegions(m, so, sd, LA_PLAN_REG, { t, t0: 0.6, dt: 0.4, w: 3, tones: [C.second, C.secondText] });
    laRegions(m, mk > 0 ? cL : so, -1, LA_PLAN_REG, { t, t0: 0.6, dt: 0.4, w: 3, tones: [C.second, C.secondText], hl: mk > 0 ? 2 : -1 });
    /* the regions' names on the right side */
    const kn = ep(t, 2.2, 2.6) * (1 - ep(t, 3.6, 4.0));
    LA_PLAN_REG.forEach(([i0, i1, nm], r) => { const q = laPart(so, i0, i1), mid = q[Math.floor(q.length / 2)], p = m.P([mid], 1)[0]; text(nm, p[0] + 24, p[1] + 7, { role: 'label', size: 19, color: C.mute, alpha: aB * kn }); });
    /* the waist's handles: its chord (dashed), its depth, its length, its angle */
    const kh = ep(t, 3.8, 4.4) * aB, W_ = laWaist(cL);
    if (kh > 0) {
      const A_ = m.P([W_.A], -1)[0], B_ = m.P([W_.B], -1)[0], D_ = m.P([W_.deep], -1)[0], Mi = m.P([W_.M], -1)[0];
      line(A_[0], A_[1], B_[0], B_[1], { color: C.ink2, w: 1.5, dash: [6, 5], alpha: kh });
      line(Mi[0], Mi[1], D_[0], D_[1], { color: C.hero, w: 2, alpha: kh });
      for (const P of [A_, B_]) circle(P[0], P[1], 6, { fill: C.panel, color: C.hero, w: 2, alpha: kh });
      circle(D_[0], D_[1], 7, { fill: C.hero, alpha: kh });
      /* the angle: the chord against the mouse's long axis (a dashed line down from the waist's front end) */
      const ang = Math.atan2(-(B_[0] - A_[0]), B_[1] - A_[1]);
      line(A_[0], A_[1], A_[0], A_[1] + 120, { color: C.mute, w: 1.2, dash: [4, 4], alpha: kh });
      G.save(); G.globalAlpha = kh; G.strokeStyle = C.hero; G.lineWidth = 2.2; G.beginPath(); G.arc(A_[0], A_[1], 96, Math.PI / 2, Math.PI / 2 + ang, ang < 0); G.stroke(); G.restore();
    }
    /* the cursor: grabs the depth handle and drags it in and out */
    if (t > 4.6 && t < 8.4) { const D_ = m.P([W_.deep], -1)[0], pr = ep(t, 4.9, 5.05) * (1 - ep(t, 7.7, 7.9)); cursorPtr(D_[0] + 4, D_[1] + 4, { a: ep(t, 4.6, 4.9) * (1 - ep(t, 8.0, 8.4)), press: t < 5.2 ? ep(t, 4.9, 5.2) : 0, grab: pr > 0.5 }); }
    /* right of the drawing: the waist's numbers, live */
    const c = pF[0], R = c * c / (8 * dv) + dv / 2, felt = R <= Rf + 0.5, kr = ep(t, 4.0, 4.5) * aB, x1 = box[0] + box[2] - 260;
    /* how far the side comes in under the hump, live: deeper than the UltralightX's is no longer a normal mouse */
    const fU = laSideU(cL); let uh = -1, ub = 1e9; for (let z = -45; z <= 40; z += 0.5) { const u = fU(z); if (z < 0) uh = Math.max(uh, u); if (z > -20) ub = Math.min(ub, u); }
    const deep = uh - ub > LA.ulx_pocket + 0.05, state = deep ? ['Deeper than the UltralightX', C.red] : felt ? ['Felt', C.heroText] : ['Too gentle to feel', C.red];
    const rows = [['Depth', fmtN(dv, 2) + ' mm'], ['Length', fmtN(c, 0) + ' mm'], ['Middle at', 'z ' + fmtN(pF[2], 0) + ' mm'], ['Angle', fmtN(pF[3], 1) + '°'], ['Radius', fmtN(R, 0) + ' mm']];
    rows.forEach(([l, v], i) => { const y = box[1] + 130 + i * 62; text(l, x1, y, { role: 'label', size: 18, color: C.mute, alpha: kr }); text(v, x1, y + 30, { role: 'num', size: 26, color: i === 0 ? C.heroText : C.ink, alpha: kr }); });
    const kf = ep(t, 5.0, 5.3) * aB;
    text(state[0], x1, box[1] + 130 + 5 * 62 + 14, { role: 'h3', size: 26, color: state[1], alpha: kf, maxW: 240 });
    text('Felt from R ' + fmtN(Rf, 0) + ' mm', x1, box[1] + 130 + 5 * 62 + 80, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: kf });
    text('over its ' + fmtN(LA.slide.p50.thumb, 0) + ' mm slide', x1, box[1] + 130 + 5 * 62 + 106, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: kf, sentence: false });
    /* right: what sets each arc, and the section */
    const rx = LM + 740, rw = RM - rx, aR = tileA(t, 1.0, 0); demoWindow(rx, 290, rw, 300, aR);
    text('Each side, five long arcs', rx + 28, 290 + 44, { role: 'label', size: 20, color: C.mute, alpha: aR });
    const what = [['Waist', 'Depth, length, middle and angle: the numbers the descent sets'], ['Hump', 'Closes the side onto the tail at the hump\'s width'], ['Front', 'Follows from the waist; its angle is the flare, set by the numbers'], ['Nose and tail', 'The Sora\'s, never moved']];
    what.forEach(([h, b], i) => { const y = 290 + 100 + i * 54, k = ep(t, 1.4 + i * 0.3, 1.8 + i * 0.3) * aR; text(h, rx + 28, y, { role: 'small', size: 23, weight: 700, color: i === 0 ? C.heroText : C.ink, alpha: k }); text(b, rx + 230, y, { role: 'small', size: 21, weight: 560, color: C.mute, alpha: k, maxW: rw - 260 }); });
    /* the section: the button's long arcs, the groove dragged */
    const sb = [rx, 630, rw, 320], aS = tileA(t, 8.8, 0); demoWindow(...sb, aS);
    text('Across the buttons at z 30, true scale', sb[0] + 28, sb[1] + 44, { role: 'label', size: 20, color: C.mute, alpha: aS });
    const ms = gdSecFit([sb[0] + 30, sb[1] + 60, 520, sb[3] - 80], { ur: 34, yr: [0, 40] }), gd0 = pF[11];
    const gv = t < 10.2 ? gd0 : springKeys(t, [[0, gd0], [10.4, 0.04], [11.2, 0.45], [12.0, gd0]], { f: 1.2, z: 0.9 });
    const cS = laSec(t < 10.2 ? Tr.endArcs.sec : laSweep(LA.sweep.sec_depth, gv)), soS = laSec(LA.sora.secArcs);
    if (aS > 0) {
      laSecDraw(ms, soS, { color: C.second, w: 2, alpha: aS * 0.7 });
      for (const sd of [-1, 1]) laRegions(ms, cS, sd, LA_SEC_REG, { t, t0: 9.0, dt: 0.25, w: 3, hl: 1, slot: 4.8, handles: true });
      const W2 = laWaist(cS, 1), Dp = ms.P([W2.deep], -1)[0];
      if (t > 10.0 && t < 12.4) cursorPtr(Dp[0] + 4, Dp[1] + 4, { a: ep(t, 10.0, 10.2) * (1 - ep(t, 12.1, 12.4)), press: t < 10.5 ? ep(t, 10.2, 10.5) : 0, grab: t > 10.4 && t < 12.0 });
      const cg = pF[10], Rg = cg * cg / (8 * gv) + gv / 2, Rgf = 1 / Tr.k_felt.groove, x2 = sb[0] + 590;
      const r2 = [['Groove depth', fmtN(gv, 2) + ' mm'], ['Length', fmtN(cg, 0) + ' mm'], ['Radius', fmtN(Rg, 0) + ' mm']];
      r2.forEach(([l, v], i) => { const y = sb[1] + 100 + i * 60, k = ep(t, 9.6 + i * 0.15, 10.0 + i * 0.15) * aS; text(l, x2, y, { role: 'label', size: 18, color: C.mute, alpha: k }); text(v, x2, y + 30, { role: 'num', size: 26, color: i === 0 ? C.heroText : C.ink, alpha: k }); });
      const fg = Rg <= Rgf + 0.5; text(fg ? 'Felt' : 'Too gentle to feel', x2 + 220, sb[1] + 130, { role: 'h3', size: 26, color: fg ? C.heroText : C.red, alpha: ep(t, 10.4, 10.7) * aS });
      text('Felt from R ' + fmtN(Rgf, 0) + ' mm', x2 + 220, sb[1] + 162, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: ep(t, 10.4, 10.7) * aS });
    }
    source(t, 'Arcs: the fit to 3d/shell/shell-sora.glb (top view 8 arcs, 0.12 mm RMS) regrouped; the joins tangent-continuous; the nose and tail fixed, the hump and rear corner close the side. Felt: Gordon & Morison 1982, the sides over the whole slide as you grip (hand model), the grooves over where the fingertip lands (Serhat 2022, ANSUR II). Derived.', { t0: 2.0, maxW: 1760 });
  }
});

/* ============================== 7. descent ============================== */
/* the loss over the thumb's waist (depth x where its middle sits), as a smooth field on a sequential blue ramp: lower is
   bluer. Bilinear between the grid's points, cached per trial and theme */
const LA_FIELD = new Map();
function laField(L, key, w, h) {
  let cv = LA_FIELD.get(key); if (cv) return cv;
  const nd = L.d.length, nz = L.zc.length, lg = L.loss.map(r => r.map(v => Math.log(v + 1e-3)));
  let lo = Infinity, hi = -Infinity; lg.forEach(r => r.forEach(v => { lo = Math.min(lo, v); hi = Math.max(hi, v); })); hi = Math.min(hi, lo + 5.5);
  cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g2 = cv.getContext('2d'), im = g2.createImageData(w, h);
  const c0 = TH ? [242, 242, 240] : [24, 25, 27], c1 = TH ? [10, 108, 255] : [86, 166, 255], c2 = TH ? [61, 79, 224] : [196, 226, 255];
  for (let py = 0; py < h; py++) {
    const fd = (1 - py / (h - 1)) * (nd - 1), i0 = Math.min(nd - 2, Math.floor(fd)), kd = fd - i0;
    for (let px = 0; px < w; px++) {
      const fz = px / (w - 1) * (nz - 1), j0 = Math.min(nz - 2, Math.floor(fz)), kz = fz - j0;
      const v = (lg[i0][j0] * (1 - kz) + lg[i0][j0 + 1] * kz) * (1 - kd) + (lg[i0 + 1][j0] * (1 - kz) + lg[i0 + 1][j0 + 1] * kz) * kd;
      const q = 1 - clamp((v - lo) / (hi - lo)), e2 = q * q, o = (py * w + px) * 4;
      for (let c = 0; c < 3; c++) im.data[o + c] = Math.round(q < 0.85 ? c0[c] + (c1[c] - c0[c]) * e2 / 0.7225 : c1[c] + (c2[c] - c1[c]) * (q - 0.85) / 0.15);
      im.data[o + 3] = 255;
    }
  }
  g2.putImageData(im, 0, 0); cv.lo = lo; cv.hi = hi; LA_FIELD.set(key, cv); return cv;
}
/** marching squares: the segments of level v over a grid (rows i, columns j) in grid units */
function laContour(F, v) {
  const segs = [], n = F.length, m = F[0].length;
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < m - 1; j++) {
    const a = F[i][j], b = F[i][j + 1], c = F[i + 1][j + 1], d = F[i + 1][j], P = [];
    const ed = (x0, y0, x1, y1, f0, f1) => { if ((f0 < v) !== (f1 < v)) { const k = (v - f0) / (f1 - f0); P.push([x0 + (x1 - x0) * k, y0 + (y1 - y0) * k]); } };
    ed(j, i, j + 1, i, a, b); ed(j + 1, i, j + 1, i + 1, b, c); ed(j + 1, i + 1, j, i + 1, c, d); ed(j, i + 1, j, i, d, a);
    if (P.length === 2) segs.push(P); else if (P.length === 4) { segs.push([P[0], P[1]]); segs.push([P[2], P[3]]); }
  }
  return segs;
}
S({
  id: 'gd_descent', ch: 'shape', theme: 'night', title: 'Gradient descent', settle: 13.5,
  src: ['gdModel'],
  draw: t => {
    header(t, 'Gradient descent', { noIdeas: true });
    const K = LA_K, Tr = laTr(K), Ls = Tr.landscape, u = ep(t, 5.2, 10.2, E.io3), Fr = laFrame(Tr, u), p = Fr.p;
    /* G4: the end, as the trial has it: mirrored, one valley on both fingers' slides; pocketed apart, each on its own */
    const onP = laOnPath(Tr.end.thumb, Tr.targets.thumb_path) && laOnPath(Tr.end.pinky, Tr.targets.pinky_path);
    gdCaptions(t, [[0.6, 'The loss, mapped for the thumb\'s waist arc: how deep it is against where its middle sits. Each contour is one level.'],
      [5.0, 'Descent starts from the Sora\'s waist and steps downhill. Each dot is a step, and every arc\'s numbers move together.'],
      [10.0, 'It stops where nothing improves: ' + (onP ? (Tr.symmetric ? 'one mirrored valley on both fingers\' slides, just deep enough to be felt over the slide.' : 'each valley on its finger\'s slide, each waist just deep enough to be felt over it.') : 'each waist just deep enough to be felt over its whole slide.')]]);
    /* left: the landscape, built in layers: the field, its contours, the axes, then the path step by step */
    const L0 = [LM, 290, 700, 660], aL = tileA(t, 0.2, 0); demoWindow(...L0, aL);
    text('Thumb\'s waist: the loss over two of its numbers', L0[0] + 28, L0[1] + 44, { role: 'label', size: 19, color: C.mute, alpha: aL });
    const gx = L0[0] + 92, gy = L0[1] + 78, gw = L0[2] - 128, gh = L0[3] - 170, nd = Ls.d.length, nz = Ls.zc.length;
    const zF = Tr.final[2], dF = Tr.final[1], zr = [Math.max(Ls.zc[0], zF - 11), Math.min(Ls.zc[nz - 1], zF + 11)], dr = [Math.max(Ls.d[0], 0.2), Math.min(Ls.d[nd - 1], Math.max(1.3, dF * 1.8))];
    const Xz = z => gx + gw * (z - zr[0]) / (zr[1] - zr[0]), Yd = d => gy + gh * (1 - (d - dr[0]) / (dr[1] - dr[0]));
    const fx0 = Xz(Ls.zc[0]), fx1 = Xz(Ls.zc[nz - 1]), fy0 = Yd(Ls.d[nd - 1]), fy1 = Yd(Ls.d[0]);
    const cv = laField(Ls, 'f_' + K + (TH ? 'p' : 'n'), Math.round((fx1 - fx0) * 1.5), Math.round((fy1 - fy0) * 1.5)), kf = ep(t, 0.6, 1.8);
    G.save(); G.beginPath(); G.rect(gx, gy, gw, gh); G.clip();
    if (kf > 0) { G.save(); G.globalAlpha = aL * kf; G.drawImage(cv, fx0, fy0, fx1 - fx0, fy1 - fy0); G.restore(); }
    /* contours: ten levels in the log of the loss, the high ones first, settling down to the floor */
    const lg = Ls.loss.map(r => r.map(v => Math.log(v + 1e-3)));
    for (let q = 1; q <= 10; q++) {
      const v = cv.lo + (cv.hi - cv.lo) * (1 - q / 11), k = ep(t, 1.8 + (10 - q) * 0.12, 2.3 + (10 - q) * 0.12) * aL; if (k <= 0) continue;
      const segs = laContour(lg, v), sx = (fx1 - fx0) / (nz - 1), sy = (fy1 - fy0) / (nd - 1);
      G.save(); G.globalAlpha = k * (q > 7 ? 0.95 : 0.6); G.strokeStyle = q > 7 ? (TH ? '#FFFFFF' : '#E8F2FF') : (TH ? 'rgba(17,17,17,0.45)' : 'rgba(240,240,240,0.55)'); G.lineWidth = q > 7 ? 1.4 : 1.1;
      G.beginPath(); for (const [a, b] of segs) { G.moveTo(fx0 + a[0] * sx, fy1 - a[1] * sy); G.lineTo(fx0 + b[0] * sx, fy1 - b[1] * sy); } G.stroke(); G.restore();
    }
    G.restore();
    /* axes, with values */
    const ka = ep(t, 0.8, 1.3) * aL;
    line(gx, gy + gh, gx + gw, gy + gh, { color: C.mute, w: 1.5, alpha: ka }); line(gx, gy, gx, gy + gh, { color: C.mute, w: 1.5, alpha: ka });
    for (let z = Math.ceil(zr[0] / 5) * 5; z <= zr[1]; z += 5) { line(Xz(z), gy + gh, Xz(z), gy + gh + 8, { color: C.mute, w: 1.5, alpha: ka }); text(String(z), Xz(z), gy + gh + 32, { role: 'tick', size: 18, color: C.mute, align: 'center', alpha: ka }); }
    for (let d = 0; d <= dr[1] + 1e-9; d += 0.2) { if (d < dr[0] - 1e-9) continue; line(gx - 8, Yd(d), gx, Yd(d), { color: C.mute, w: 1.5, alpha: ka }); text(fmtN(d, 1), gx - 14, Yd(d) + 6, { role: 'tick', size: 18, color: C.mute, align: 'right', alpha: ka }); }
    text('Where its middle sits, z (mm)', gx + gw, gy + gh + 64, { role: 'label', size: 18, color: C.mute, align: 'right', alpha: ka });
    G.save(); G.translate(gx - 62, gy + gh / 2); G.rotate(-Math.PI / 2); text('Depth (mm), deeper ↑', 0, 0, { role: 'label', size: 18, color: C.mute, align: 'center', alpha: ka }); G.restore();
    /* the lowest point on this slice, the start, the path step by step, the end */
    let best = [0, 0]; Ls.loss.forEach((r, i) => r.forEach((v, j) => { if (v < Ls.loss[best[0]][best[1]]) best = [i, j]; }));
    const ko = ep(t, 3.2, 3.6) * aL, bx = Xz(Ls.zc[best[1]]), by = Yd(Ls.d[best[0]]);
    const P = Tr.path, n = P.length, upto = Math.round(u * (n - 1)), s0 = [Tr.start[1], Tr.start[2]], ks = ep(t, 4.2, 4.6) * aL;
    /* (G4) when the end lands on the map's lowest point, one label names both (the separate End label ran over the ring) */
    const qE = P[n - 1], nearE = Math.hypot(Xz(qE[1]) - bx, Yd(qE[0]) - by) < 44, kE = nearE ? ep(t, 10.2, 10.6) : 0;
    circle(bx, by, 14, { color: C.ink, w: 2.5, alpha: ko }); circle(bx, by, 3, { fill: C.ink, alpha: ko });
    text('Lowest on this map', bx - 22, by - 20, { role: 'label', size: 18, color: C.ink, align: 'right', alpha: ko * (1 - kE) });
    if (kE > 0) text('End: the lowest on this map', bx - 22, by - 20, { role: 'label', size: 18, color: C.heroText, align: 'right', alpha: ko * kE });
    /* start and end can sit close (the Sora's waist slid under the thumb is near the rule): start below left, end above right */
    circle(Xz(s0[1]), Yd(s0[0]), 9, { color: C.hero, w: 2.5, alpha: ks }); text('Start', Xz(s0[1]) - 14, Yd(s0[0]) + 30, { role: 'label', size: 18, color: C.heroText, align: 'right', alpha: ks });
    if (t > 5.2) {
      poly([[Xz(s0[1]), Yd(s0[0])]].concat(P.slice(0, upto + 1).map(q => [Xz(q[1]), Yd(q[0])])), { color: C.hero, w: 1.6, alpha: aL * 0.8 });
      let lx_ = Xz(s0[1]), ly_ = Yd(s0[0]);
      for (let i = 0; i <= upto; i++) { const x = Xz(P[i][1]), y = Yd(P[i][0]); if (Math.hypot(x - lx_, y - ly_) >= 9) { circle(x, y, 3.8, { fill: C.hero, alpha: aL }); lx_ = x; ly_ = y; } }
      const q = P[upto]; circle(Xz(q[1]), Yd(q[0]), 8, { fill: C.hero, alpha: aL });
      if (u >= 1 && !nearE) text('End', Xz(q[1]) + 16, Yd(q[0]) - 14, { role: 'label', size: 18, color: C.heroText, alpha: aL * ep(t, 10.2, 10.6) });
    }
    /* middle: the top view, true scale, morphing with the descent; the thumb's side against its own chord, x2 */
    const box = [LM + 740, 290, 560, 660], aT = tileA(t, 0.3, 0); demoWindow(...box, aT);
    const m = gdTopFit([box[0] + 20, box[1] + 50, 300, box[3] - 80], { ur: 34 }), cL = laPlan(Fr.planL), cR = laPlan(Fr.planR);
    poly(gdOutline(m, laPlan(LA.sora.planArcs).pts, laPlan(LA.sora.planArcs).pts), { color: C.second, w: 2, alpha: aT * 0.7 });
    poly(gdOutline(m, cL.pts, cR.pts), { color: C.hero, w: 3, alpha: aT });
    text('True scale', box[0] + 28, box[1] + 44, { role: 'label', size: 19, color: C.mute, alpha: aT });
    laChordInset(t, aT * ep(t, 2.0, 2.6), [box[0] + 336, box[1] + 70, 204, box[3] - 100], laSideU(cL), { ref: laSideU(laPlan(LA.sora.planArcs)), z: Tr.targets.thumb_z, zr: [-32, 44], title: 'Thumb side, ×2' });
    /* right: the numbers, as sliders, and the loss */
    const rx = LM + 1340, rw = RM - rx, aP = tileA(t, 0.5, 0); demoWindow(rx, 290, rw, 440, aP);
    text('The arcs\' numbers', rx + 24, 290 + 40, { role: 'label', size: 19, color: C.mute, alpha: aP });
    const sl = [['Thumb waist, depth', p[1], 0, 3, 'mm', 2], ['Thumb waist, middle z', p[2], -10, 50, 'mm', 1], ['Thumb waist, length', p[0], 25, 65, 'mm', 0], ['Pinky waist, depth', p[6], 0, 3, 'mm', 2], ['Pinky waist, middle z', p[7], -20, 40, 'mm', 1], ['Groove, depth', p[11], 0, 0.5, 'mm', 2]];
    sl.forEach(([nm, v, a0, a1, un, d], i) => {
      const y = 290 + 92 + i * 56, x0 = rx + 24, w0 = rw - 48, k = clamp((v - a0) / (a1 - a0));
      text(nm, x0, y, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: aP });
      text(fmtN(v, d) + ' ' + un, x0 + w0, y, { role: 'num', size: 21, color: C.ink, align: 'right', alpha: aP });
      line(x0, y + 20, x0 + w0, y + 20, { color: C.hair, w: 4, alpha: aP, cap: 'round' }); line(x0, y + 20, x0 + w0 * k, y + 20, { color: C.hero, w: 4, alpha: aP, cap: 'round' });
      circle(x0 + w0 * k, y + 20, 7, { fill: C.hero, alpha: aP });
    });
    const C0 = [rx, 770, rw, 180], aC = tileA(t, 0.6, 0); demoWindow(...C0, aC);
    const cv2 = Tr.curve, cgx = C0[0] + 24, cgw = C0[2] - 48, cgy = C0[1] + 60, cgh = C0[3] - 84, lo = Math.log(Math.min(...cv2)), hi = Math.log(Math.max(...cv2));
    const nC = Math.max(2, Math.round(u * cv2.length));
    if (t > 5.2) poly(cv2.slice(0, nC).map((v, i) => [cgx + cgw * i / (cv2.length - 1), cgy + cgh * (1 - (Math.log(v) - lo) / ((hi - lo) || 1))]), { color: C.hero, w: 2.5, alpha: aC });
    text('Loss, lower is better', C0[0] + 24, C0[1] + 36, { role: 'label', size: 18, color: C.mute, alpha: aC });
    text(gdLoss(t > 5.2 ? Fr.loss : Tr.loss0), C0[0] + C0[2] - 24, C0[1] + 40, { role: 'num', size: 28, color: C.heroText, align: 'right', alpha: aC });
    source(t, 'Trial ' + laNo(K) + ': ' + GD_NAME[K][0].toLowerCase() + ', ' + GD_NAME[K][1].toLowerCase() + '. Adam on central differences, ' + Tr.frames[Tr.frames.length - 1].it + ' steps. The map holds every other number at its final value; the path moves them all. Derived (deck/tools/gd/longarcs.py).', { t0: 2.0, maxW: 1760 });
  }
});

/* ============================== 8. the four trials ============================== */
/* G4 (Brock 17:18, "trial 3 is by far my favorite the right 2 don't look right at all"): each side valley is placed on its
   finger's slide as you grip (a bar beside each side, drawn from where the finger lands back to where it grips); the
   palm-on-the-hump tips past the grooves are red; symmetry is a rule, so the lopsided trials carry a red note and trial 3,
   the lowest mirrored loss, is the result */
S({
  id: 'gd_trials', ch: 'shape', theme: 'paper', title: 'Four trials', settle: 14.5,
  src: ['gdModel'],
  draw: t => {
    header(t, 'Four trials', { noIdeas: true });
    const best = laBest(), rec = GD_REC, P50 = LA.path.p50;
    gdCaptions(t, [[0.6, 'Two ways to hold it, palm on the hump or palm lifted; two ways to place the pockets, mirrored or each by its own finger.'],
      [4.4, 'Palm on the hump, the index and middle tips run past the grooves, the middle off the nose. Trials 1 and 2 fail there.'],
      [7.8, 'Each side valley belongs on its finger\'s slide as you grip. Mirrored, one valley serves both where the two slides overlap.'],
      [11.2, (best !== rec ? 'Trial ' + laNo(best) + ' scores a hair lower, but its shell is lopsided, and a traditional mouse is mirror-symmetric. ' : 'Pocketed apart, the shell reads lopsided, and a traditional mouse is mirror-symmetric. ') + 'Trial ' + laNo(rec) + ' is the result.']]);
    const cell = bento(LM, 290, RM - LM, 640, 2, 2), so = laPlan(LA.sora.planArcs);
    const kTip = ep(t, 4.6, 5.0), kBar = ep(t, 8.0, 8.9, E.io3), kDot = ep(t, 8.6, 9.0), kRule = ep(t, 11.4, 11.9);
    const pulse = t0 => 1 + 0.25 * Math.sin(Math.max(0, t - t0) * 5) * Math.exp(-Math.max(0, t - t0));
    LA.order.forEach((k, i) => {
      const r = cell(i % 2, Math.floor(i / 2)), a = tileA(t, 0.3, i), Tk = LA.trials[k], e = Tk.end, hero = k === rec, lop = !Tk.symmetric; demoWindow(...r, a, { hero: false });
      const m = gdTopFit([r[0] + 20, r[1] + 20, 230, r[3] - 40], { ur: 34 }), km = ep(t, 1.0 + i * 0.3, 2.4 + i * 0.3, E.cam);
      const cL = laPlan(laMix(LA.sora.planArcs, Tk.endArcs.planL, km)), cR = laPlan(laMix(LA.sora.planArcs, Tk.endArcs.planR, km));
      poly(gdOutline(m, so.pts, so.pts), { color: C.second, w: 1.5, alpha: a * 0.8 });
      poly(gdOutline(m, cL.pts, cR.pts), { color: C.hero, w: 2.5, alpha: a });
      /* the index and middle tips on the buttons: on the grooves (ink), or past their front end (red), with the second caption */
      for (const [f, sd] of [['index', -1], ['middle', 1]]) {
        const z = Tk.tips[f], bad = z > Tk.targets.groove_end;
        circle(m.X(e.groove.u_bottom, sd), m.Y(z), (bad ? 5 * pulse(4.6) : 4.5), { fill: bad ? C.red : C.ink2, alpha: a * kTip });
      }
      /* each finger's slide as you grip: a bar beside its side, drawn from where it lands back to where it grips */
      [[e.thumb, -1, Tk.targets.thumb_path, cL], [e.pinky, 1, Tk.targets.pinky_path, cR]].forEach(([s_, sd, P, ch]) => {
        const xb = m.X(36, sd), y1 = m.Y(P[1]), y0 = m.Y(P[0]);
        if (kBar > 0) line(xb, y1, xb, lerp(y1, y0, kBar), { color: C.mute, w: 4, cap: 'round', alpha: a * 0.6 });
        /* the valley's bottom on its slide (blue), or off it (red; with no valley, the slide's middle) */
        const good = laOnPath(s_, P), z = s_.n_minima === 1 ? s_.z_bottom : (P[0] + P[1]) / 2, f = laSideU(ch);
        circle(m.X(f(z), sd), m.Y(z), 6 * (good ? 1 : pulse(8.6)), { fill: good ? C.hero : C.red, alpha: a * Math.max(0.3, kDot) });
      });
      const tx = r[0] + 280, tw2 = r[2] - 300;
      text('Trial ' + (i + 1), tx, r[1] + 44, { role: 'label', size: 20, color: hero ? mix(C.mute, C.heroText, kRule) : C.mute, alpha: a });
      text(GD_NAME[k][0] + ', ' + GD_NAME[k][1].toLowerCase(), tx, r[1] + 78, { role: 'h3', size: 27, color: C.ink, alpha: a, maxW: tw2 });
      /* the loss; the result lights in blue with the last caption, the lopsided ones get their red note */
      const lossRun = (col, grad, al) => [{ s: 'Loss', role: 'label', size: 19, color: C.mute, alpha: al }, { s: gdLoss(Tk.loss), font: 'disp', size: 42, weight: 800, color: col, grad, gap: 12, alpha: al }];
      if (hero) { rich(lossRun(C.ink, null, 1 - kRule), tx, r[1] + 132, { alpha: a }); rich(lossRun(C.hero, C.heroGrad, kRule).concat([{ s: 'The result', role: 'label', size: 19, color: C.heroText, gap: 14 }]), tx, r[1] + 132, { alpha: a * kRule }); }
      else rich(lossRun(C.ink, null, 1).concat(lop ? [{ s: 'Lopsided: not mirrored', role: 'label', size: 19, color: C.red, gap: 14, alpha: kRule }] : []), tx, r[1] + 132, { alpha: a });
      /* each side: its waist (radius, depth over its length, felt over the slide or not), or where its valley sits instead */
      const span = P => 'z ' + fmtN(P[0], 0) + ' to ' + fmtN(P[1], 0);
      const side = (s_, P, R, Rf, c, d) => {
        if (laOnPath(s_, P)) return 'R ' + fmtN(R, 0) + ', ' + fmtN(d, 1) + ' mm deep over ' + fmtN(c, 0) + ' mm' + (R <= Rf + 0.5 ? ', felt' : ', too gentle');
        if (s_.n_minima === 1) return 'Valley ' + fmtN(laOff(s_.z_bottom, P), 0) + ' mm ' + (s_.z_bottom < P[0] ? 'behind' : 'ahead of') + ' its slide (' + span(P) + ')';
        return 'No valley on its slide (' + span(P) + ')';
      };
      const under = Tk.grooves_under_finger, F_ = Tk.final;
      const lines = [['Thumb', side(e.thumb, Tk.targets.thumb_path, e.R.thumb, 1 / Tk.k_felt.thumb, F_[0], F_[1]), !laOnPath(e.thumb, Tk.targets.thumb_path)],
        ['Pinky', side(e.pinky, Tk.targets.pinky_path, e.R.pinky, 1 / Tk.k_felt.pinky, F_[5], F_[6]), !laOnPath(e.pinky, Tk.targets.pinky_path)],
        ['Grooves', under ? 'x ±' + fmtN(e.groove.u_bottom, 0) + ', R ' + fmtN(e.R.groove, 0) + ', 1 valley each' : 'Tips past them (z ' + fmtN(Tk.tips.index, 0) + ', ' + fmtN(Tk.tips.middle, 0) + ')', !under],
        ['Moves', fmtN(e.dev.plan, 1) + ' mm at most; ' + fmtN(e.width, 1) + ' mm wide', false]];
      lines.forEach(([l, v, bad], j) => {
        const y = r[1] + 176 + j * 31, kj = ep(t, 1.4 + i * 0.2 + j * 0.12, 1.8 + i * 0.2 + j * 0.12) * a;
        text(l, tx, y, { role: 'label', size: 19, color: C.mute, alpha: kj });
        text(v, tx + 116, y, { role: 'small', size: 21, weight: 650, color: bad ? C.red : C.ink2, alpha: kj, maxW: tw2 - 116, sentence: false });
      });
    });
    source(t, 'Placed: each side valley\'s bottom on its finger\'s slide as you grip, from where it lands to where it grips (mean hand: thumb z ' + fmtN(P50.thumb[1], 0) + ' to ' + fmtN(P50.thumb[0], 0) + ', pinky ' + fmtN(P50.pinky[1], 0) + ' to ' + fmtN(P50.pinky[0], 0) + '); for hands under ' + fmtN(LA.path.overlap_hand_mm, 0) + ' mm the two slides do not overlap. Felt: each waist turns 3.4° over the slide. Grooves to z ' + fmtN(LA.path.groove_end, 0) + '. Widths 60.5 to 70 mm (mice.json); within 2.5 mm of the Sora. Derived.', { t0: 2.0, maxW: 1760 });
  }
});

/* ============================== 9. before and after ============================== */
S({
  id: 'gd_after', ch: 'shape', theme: 'night', title: 'Still a traditional mouse', settle: 12.5,
  src: ['gdModel', 'gdGordon', 'gdTpu'],
  draw: t => {
    header(t, 'Still a traditional mouse', { noIdeas: true });
    const K = LA_K, Tr = laTr(K), e = Tr.end, so = laPlan(LA.sora.planArcs), cL = laPlan(Tr.endArcs.planL), cR = laPlan(Tr.endArcs.planR);
    /* the waists against the Sora's own: depth (within 0.1 mm reads as the same) and length */
    const dS0 = LA.sora.plan_params[1], cS0 = LA.sora.plan_params[0], dd = [Tr.final[1], Tr.final[6]], cc = [Tr.final[0], Tr.final[5]];
    const sameL = cc.every(v => Math.abs(v - cS0) <= 3);
    const depthW = dd.every(v => Math.abs(v - dS0) <= 0.1) ? (sameL ? 'about as deep and as long as the Sora\'s' : 'about as deep as the Sora\'s') : dd.every(v => v > dS0) ? 'a little deeper than the Sora\'s' : dd.every(v => v < dS0) ? 'a little shallower than the Sora\'s' : 'reshaped';
    /* G4: each valley on its finger's slide as you grip; the result mirrored (a traditional mouse is mirror-symmetric) */
    const sym = Tr.symmetric, onP = laOnPath(e.thumb, Tr.targets.thumb_path) && laOnPath(e.pinky, Tr.targets.pinky_path);
    const restW = onP ? (sym ? ', on both fingers\' slides.' : ', on its finger\'s slide.') : '.';
    gdCaptions(t, [[0.6, 'At true scale it is still the Sora: the same nose, tail and side profile. ' + (sym ? 'Its mirrored waist is ' : 'Each waist is ') + depthW + restW],
      [5.0, 'Every curve now has a reason: a valley under each finger, just deep enough to be felt, and nothing anywhere else.'],
      [8.4, sym ? 'And it stays mirror-symmetric, as a traditional mouse is: one waist, mirrored, serves the thumb and the pinky.' : 'Pocketed apart, it is no longer mirror-symmetric: it reads lopsided, not a traditional mouse.']]);
    const box = [LM, 290, 760, 660], aT = tileA(t, 0.2, 0); demoWindow(...box, aT);
    const m = gdTopFit([box[0] + 220, box[1] + 50, 320, box[3] - 100], { ur: 34 }), kb = ep(t, 1.2, 2.4, E.cam);
    poly(gdOutline(m, so.pts, so.pts), { color: C.second, w: 2.5, alpha: aT });
    if (kb > 0) poly(gdOutline(m, laPlan(laMix(LA.sora.planArcs, Tr.endArcs.planL, kb)).pts, laPlan(laMix(LA.sora.planArcs, Tr.endArcs.planR, kb)).pts), { color: C.hero, w: 3.5, alpha: aT });
    text('True scale, Sora V2 in yellow', box[0] + box[2] / 2, box[1] + box[3] - 14, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: aT });
    text('Trial ' + laNo(K) + ': ' + GD_NAME[K][0].toLowerCase() + ', ' + GD_NAME[K][1].toLowerCase(), box[0] + 24, box[1] + 40, { role: 'small', size: 21, weight: 650, color: C.ink2, alpha: aT, sentence: false });
    /* each side against its own chord, x2: one valley; the Sora's own, in yellow */
    const ki = ep(t, 2.8, 3.4) * aT, sU = laSideU(so);
    const iL = laChordInset(t, ki, [box[0] + 24, box[1] + 70, 180, box[3] - 120], laSideU(cL), { ref: sU, z: e.thumb.z_bottom, zr: [-32, 44], title: 'Thumb side, ×2', p: ep(t, 3.0, 4.0, E.lin) });
    const iR = laChordInset(t, ki, [box[0] + box[2] - 204, box[1] + 70, 180, box[3] - 120], laSideU(cR), { ref: sU, z: e.pinky.z_bottom, zr: [-32, 44], title: 'Pinky side, ×2', p: ep(t, 3.0, 4.0, E.lin) });
    const kv = ep(t, 4.0, 4.4) * aT;
    for (const [I, s_] of [[iL, e.thumb], [iR, e.pinky]]) if (I && s_.n_minima === 1) { const x = I.X(Math.max(0, I.c.gap(s_.z_bottom))), y = I.Y(s_.z_bottom); circle(x, y, 6, { fill: C.hero, alpha: kv }); text('One valley', x + 12, y + 6, { role: 'label', size: 17, color: C.heroText, alpha: kv }); }
    /* the section, with the grooves */
    const sb = [LM + 800, 290, 480, 400], aS = tileA(t, 0.4, 0); demoWindow(...sb, aS);
    const ms = gdSecFit([sb[0] + 30, sb[1] + 60, sb[2] - 60, sb[3] - 90], { ur: 34, yr: [0, 40] }), cS = laSec(Tr.endArcs.sec);
    laSecDraw(ms, laSec(LA.sora.secArcs), { color: C.second, w: 2, alpha: aS });
    laSecDraw(ms, cS, { color: C.hero, w: 3, alpha: aS });
    text('Across the buttons, z ' + Tr.targets.station_z, sb[0] + 24, sb[1] + 40, { role: 'label', size: 19, color: C.mute, alpha: aS });
    if (Tr.grooves_under_finger) { const tp = cS.pts.filter(q => q[1] > 12), yb = gdInterp(e.groove.u_bottom, tp.map(q => q[0]), tp.map(q => q[1])); for (const sd of [-1, 1]) circle(ms.X(e.groove.u_bottom, sd), ms.Y(yb), 6, { fill: C.hero, alpha: aS * ep(t, 3.4, 3.8) }); }
    else text('The index and middle tips land past z 48 in this trial', sb[0] + 24, sb[1] + sb[3] - 20, { role: 'small', size: 21, weight: 650, color: C.red, alpha: aS });
    /* the hero number */
    const nb = [LM + 800, 730, 480, 220], aN = tileA(t, 3.6, 0); demoWindow(...nb, aN);
    text('The most the outline moves', nb[0] + 28, nb[1] + 46, { role: 'label', size: 20, color: C.mute, alpha: aN });
    rich([{ s: fmtN(e.dev.plan, 2), font: 'disp', size: 110, weight: 800, color: C.hero, grad: C.heroGrad, count: [3.8, 1.0, 0] }, { s: 'mm', role: 'label', size: 26, color: C.mute, gap: 10 }], nb[0] + 28, nb[1] + 170, { t, alpha: aN });
    text('Side profile untouched', nb[0] + nb[2] - 28, nb[1] + 200, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: aN });
    /* each curve, its reason */
    const rx = LM + 1320, rw = RM - rx, aR = tileA(t, 5.0, 0); demoWindow(rx, 290, rw, 660, aR);
    text('Each curve, its reason', rx + 24, 290 + 40, { role: 'label', size: 19, color: C.mute, alpha: aR });
    const felt = (R, k, over) => 'R ' + fmtN(R, 0) + (R <= 1 / k + 0.5 ? ', felt ' + over : ', felt from R ' + fmtN(1 / k, 0));
    const span = P => 'z ' + fmtN(P[0], 0) + ' to ' + fmtN(P[1], 0), PT = Tr.targets.thumb_path, PP = Tr.targets.pinky_path;
    const at = (s_, P) => laOnPath(s_, P) ? ', on its slide (' + span(P) + ')' : ', ' + fmtN(laOff(s_.z_bottom, P), 0) + ' mm off its slide';
    /* mirrored, the two waists are one arc: one row, on both slides; then the rule it keeps (or, pocketed apart, breaks) */
    const sides = sym ? [['Side waists, mirrored', felt(e.R.thumb, Tr.k_felt.thumb, 'over the ' + fmtN(LA.slide.p50.thumb, 0) + ' mm thumb slide') + '; bottom at z ' + fmtN(e.thumb.z_bottom, 0) + (onP ? ', on both fingers\' slides' : '')]]
      : [['Thumb waist', felt(e.R.thumb, Tr.k_felt.thumb, 'over its ' + fmtN(LA.slide.p50.thumb, 0) + ' mm slide') + '; bottom at z ' + fmtN(e.thumb.z_bottom, 0) + at(e.thumb, PT)],
        ['Pinky waist', felt(e.R.pinky, Tr.k_felt.pinky, 'over its ' + fmtN(LA.slide.p50.pinky, 0) + ' mm slide') + '; bottom at z ' + fmtN(e.pinky.z_bottom, 0) + at(e.pinky, PP)]];
    const why = sides.concat([['Grooves', Tr.grooves_under_finger ? felt(e.R.groove, Tr.k_felt.groove, 'where the tip lands') + ', x ±' + fmtN(e.groove.u_bottom, 0) : 'not under the fingers'], ['Ring shoulder', fmtN(e.groove.ring.k_deg_per_mm, 1) + ' °/mm, no valley'],
      ['Front flare', 'None added: the numbers chose none (the ULX has ' + fmtN(GD.ulx.flare, 1) + ' mm a side). The ' + fmtN(e.thumb.flare, 1) + ' mm front rise is the waist\'s own wall. Lifting is not modelled yet; there flare would have to earn its place.']]);
    const rule = sym ? ['Mirror-symmetric', 'One waist, mirrored, serves both fingers where their slides overlap', C.ink, C.heroText] : ['Lopsided', 'Not mirror-symmetric: each pocket by its own finger, not a traditional mouse', C.red, C.red];
    let yy = 290 + 92;
    why.forEach(([h, b], i) => {
      const k = ep(t, 5.2 + i * 0.25, 5.7 + i * 0.25) * aR;
      text(h, rx + 24, yy, { role: 'h3', size: 24, color: C.ink, alpha: k }); const r_ = text(b, rx + 24, yy + 30, { role: 'small', size: 20, weight: 600, color: C.mute, alpha: k, maxW: rw - 48 });
      yy += 30 + r_.lines.length * 26 + 24;
    });
    { const k = ep(t, 8.6, 9.1) * aR; text(rule[0], rx + 24, yy, { role: 'h3', size: 24, color: rule[2], alpha: k }); text(rule[1], rx + 24, yy + 30, { role: 'small', size: 20, weight: 600, color: rule[3], alpha: k, maxW: rw - 48 }); }
    source(t, 'Felt: the gentlest arc that turns 3.4° (Gordon & Morison 1982): on the sides over the whole slide as you grip (hand model), on the buttons over where the fingertip lands; derived. The insets plot each side against its own chord, depth ×2; the outline is true scale. ULX flare: TechPowerUp widths.', { t0: 2.0, maxW: 1760 });
  }
});
