/* ============================== surface, part 2 (chapter code srf) ==============================
   Slides for Brock's surface notes of 2026-11-04 (F2.13 to F2.15, F2.21 to F2.23), placed with `after`. The helpers they
   share are in 10-e-surface.js: srf_hl (the headline), srf_ba (before → after), srf_better, the macro engine (srf_field,
   srf_macro, srf_genFilm), srf_tip, srf_mu. */
Object.assign(SRC, {
  srf_prophecyW: { t: 'Chillblast listing, Finalmouse ULX Prophecy Tfue Edition Small: 33 g; "the paint is protected by Finalmouse\'s new ULX competition UV matte top coat"; the artwork on the sides "uses a satin undercoat process"', u: 'https://www.chillblast.com/mice/finalmouse-ulx-prophecy-tfue-edition-small', n: 'The plain ULX Small is listed at 29 g (Notebookcheck, weights.json). Finalmouse does not say what the 4 g is.' },
  srf_derler: { t: 'Derler & Gerhardt 2012, Tribology Letters 45: 1-27, skin on glass: μ 2.18 smooth and dry, 0.61 smooth and wet; 0.53 rough (Rz 45 µm) and dry, 1.43 rough and wet. Sweat floats the skin on smooth glass and drains into the roughness on rough glass', u: 'https://doc.rero.ch/record/315296/files/11249_2011_Article_9854.pdf' }
});

/* ---------- the shell's outline, from its 2D twin (geo2d shell), drawn flat ----------
   view 'top' (nose up, the user's left on the left) or 'left' (the thumb side, nose to the left), s px per mm, (cx, cy) the
   centre (Y = 19 mm on the side). Returns { P(u, v) → px (top: X, Z; left: Z, Y), M (the plane's transform), path(re) } */
function srf_shellView(view, cx, cy, s) {
  const S = typeof v2dScene === 'function' ? v2dScene('shell') : null; if (!S) return null;
  const a = view === 'top' ? '1' : '0', yc = view === 'top' ? 0 : 19;
  return { s, a, M: [-s, 0, 0, -s, cx, cy + s * yc], P: (u, v) => [cx - s * u, cy - s * (v - yc)],
    path: re => { const m = S.meshes.find(q => re.test(q.path) && q.paths[a]); return m ? m.paths[a] : null; } };
}
/** fill and stroke a twin path in a view */
function srf_vFill(V, path, fill, stroke, w = 1.5, a = 1) {
  if (!path || a <= 0.003) return;
  G.save(); G.globalAlpha *= a; G.transform(...V.M);
  if (fill) { G.fillStyle = fill; G.fill(path, 'evenodd'); }
  if (stroke) { G.strokeStyle = stroke; G.lineWidth = w / V.s; G.lineJoin = 'round'; G.stroke(path); }
  G.restore();
}
/** draw fn in stage px, clipped to a twin path (and to an optional stage rect [x0, y0, x1, y1]) */
function srf_vClip(V, path, rc, fn) {
  if (!path) return;
  const base = G.getTransform(); G.save(); G.transform(...V.M); G.clip(path, 'evenodd'); G.setTransform(base);
  if (rc) { G.beginPath(); G.rect(rc[0], rc[1], rc[2] - rc[0], rc[3] - rc[1]); G.clip(); }
  fn(rc); G.restore();
}
/** parallel lines at angle ang (0 = horizontal) over a box, pitch px apart */
function srf_lines(b, pitch, ang, col, w, a) {
  if (a <= 0.003) return;
  const [x0, y0, x1, y1] = b, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.hypot(x1 - x0, y1 - y0) / 2 + pitch, ca = Math.cos(ang), sa = Math.sin(ang);
  G.save(); G.globalAlpha *= a; G.strokeStyle = col; G.lineWidth = w; G.lineCap = 'round'; G.beginPath();
  for (let d = -R; d <= R; d += pitch) { const px = cx - sa * d, py = cy + ca * d; G.moveTo(px - ca * R, py - sa * R); G.lineTo(px + ca * R, py + sa * R); }
  G.stroke(); G.restore();
}
/** a hex lattice of dots over a box */
function srf_dots(b, pitch, r, col, a) {
  if (a <= 0.003) return;
  const [x0, y0, x1, y1] = b; G.save(); G.globalAlpha *= a; G.fillStyle = col;
  for (let y = y0, j = 0; y <= y1 + pitch; y += pitch * 0.866, j++) for (let x = x0 + (j & 1 ? pitch / 2 : 0); x <= x1 + pitch; x += pitch) { G.beginPath(); G.arc(x, y, r, 0, TAU); G.fill(); }
  G.restore();
}
/** a double-headed arrow through (x, y) at angle ang, half-length L */
function srf_arrow2(x, y, ang, L, col, w, a) {
  if (a <= 0.003) return;
  const ca = Math.cos(ang) * L, sa = Math.sin(ang) * L;
  arrow(x, y, x + ca, y + sa, { color: col, w, hs: 6 + w * 2.2, alpha: a }); arrow(x, y, x - ca, y - sa, { color: col, w, hs: 6 + w * 2.2, alpha: a });
}

/* ============================== #60 the grip map: each zone etched for its job ==============================
   Brock (F2.14): "laser etched in different shapes and spacings to create grip in exactly the right places in exactly the right
   directions, curation that grip tape doesn't allow for". Grip tape first, then a laser pass turns it into the map. The
   patterns are drawn far coarser than life (the real pitch is a fraction of a millimetre). */
S({
  id: 'srf_gripmap', ch: 'surface', theme: 'night', title: 'A grip map for the hand', settle: 10, ideas: [60], after: 'grip',
  src: ['srf_derler', 'srf_lizard', 'srf_zhang17', 'srf_doc'],
  draw: t => {
    header(t, 'A grip map for the hand');
    captions(t, [[0.6, 'Grip tape is one texture, cut to fit, and it grips the same every way.'], [3.6, 'A laser etches each zone for its job: ridges where the fingers pull or lift, dots for the thumb, nothing where the palm slides.']]);
    const T0 = [LM, 280, 1120, 680]; demoWindow(T0[0], T0[1], T0[2], T0[3], tileA(t, 0.2, 0));
    const coat = TH ? '#2B2C31' : '#2A2B30', edge = inkA(0.55), ka = ep(t, 0.4, 1.0), Hc = C.hero, Gr = TH ? 'rgba(17,17,17,0.45)' : 'rgba(243,242,238,0.5)';
    const VT = srf_shellView('top', 270, 612, 4.4), VS = srf_shellView('left', 860, 470, 4.4);
    if (!VT || !VS) return;
    /* the laser pass, left to right over the tile: tape before it, the etch after it */
    const sw = ep(t, 3.2, 5.4, E.io3), sx = lerp(T0[0] - 20, T0[0] + T0[2] + 20, sw), kT = 1 - ep(t, 3.2, 5.4), kE = ep(t, 3.2, 3.6);
    const zone = (V, path, rc, etch, tape) => {
      if (sw < 1) srf_vClip(V, path, [Math.max(rc[0], sx), rc[1], rc[2], rc[3]], tape);
      if (sw > 0) srf_vClip(V, path, [rc[0], rc[1], Math.min(rc[2], sx), rc[3]], etch);
    };
    const tapeTex = b => { const k = ep(t, 1.0, 1.6); G.save(); G.globalAlpha = k; G.fillStyle = rgba(C.second, 0.16); G.fillRect(b[0], b[1], b[2] - b[0], b[3] - b[1]); G.restore(); srf_lines(b, 7, Math.PI / 4, rgba(C.second, 0.7), 1.4, k); srf_lines(b, 7, -Math.PI / 4, rgba(C.second, 0.7), 1.4, k); };
    /* top view: the coat, the two buttons (their own outlines from the twin), the wheel in its split */
    const body = VT.path(/^body\/body$/), tL = VT.path(/triggerL\/Group\/triggerL$/), tR = VT.path(/triggerR\/Group\/triggerR$/), bay = VT.path(/wheelBay$/);
    srf_vFill(VT, body, coat, edge, 1.6, ka);
    G.save(); G.globalAlpha = ka;
    const btn = [T0[0], VT.P(0, 59.8)[1] - 4, T0[0] + 560, VT.P(0, 4.8)[1]], tapeB = [VT.P(26, 50)[0], VT.P(0, 50)[1], VT.P(-26, 50)[0], VT.P(0, 18)[1]];
    for (const p of [tL, tR]) zone(VT, p, btn, b => srf_lines(b, 6, 0, rgba(Hc, 0.9), 2, kE), b => { const c = [Math.max(b[0], tapeB[0]), tapeB[1], Math.min(b[2], tapeB[2]), tapeB[3]]; if (c[2] > c[0]) tapeTex(c); });
    G.restore();
    srf_vFill(VT, tL, null, edge, 1.2, ka); srf_vFill(VT, tR, null, edge, 1.2, ka); srf_vFill(VT, bay, coat, edge, 1.2, ka);
    /* side view, the thumb side: the side buttons from the twin; a band of ridges for the lift, dots where the thumb rests */
    const bodyS = VS.path(/^body\/body$/), sF = VS.path(/sideFront\/sideFront$/), sR = VS.path(/sideRear\/sideRear$/);
    srf_vFill(VS, bodyS, coat, edge, 1.6, ka);
    const [zx0, zy0] = VS.P(34, 15.5), [zx1, zy1] = VS.P(-27, 3.2), [dx1] = VS.P(9, 0);
    G.save(); G.globalAlpha = ka;
    zone(VS, bodyS, [dx1, zy0, zx1, zy1], b => srf_lines(b, 9, 0, rgba(Hc, 0.9), 2.6, kE), b => tapeTex(b));
    zone(VS, bodyS, [zx0, zy0, dx1, zy1], b => srf_dots(b, 10, 2.4, rgba(Hc, 0.9), kE), b => tapeTex(b));
    G.restore();
    srf_vFill(VS, sF, TH ? '#3A3B41' : '#36373D', edge, 1.2, ka); srf_vFill(VS, sR, TH ? '#3A3B41' : '#36373D', edge, 1.2, ka);
    /* the laser line */
    if (sw > 0 && sw < 1) { line(sx, T0[1] + 12, sx, T0[1] + T0[3] - 12, { color: C.hero, w: 3, alpha: 0.9 }); G.save(); G.globalAlpha = 0.25; G.fillStyle = C.hero; G.fillRect(sx - 14, T0[1] + 12, 14, T0[3] - 24); G.restore(); }
    /* which way each zone grips (blue) and glides (grey) */
    const kA = ep(t, 5.4, 6.0), [bxA, byA] = VT.P(-13, 36), [hx, hy] = VT.P(0, -30), [sxA, syA] = VS.P(-9, 9.3), [txA, tyA] = VS.P(21, 9.3);
    srf_arrow2(bxA, byA, Math.PI / 2, 40, Hc, 4, kA); srf_arrow2(bxA, byA, 0, 24, Gr, 2, kA);
    srf_arrow2(sxA, syA, Math.PI / 2, 34, Hc, 4, kA); srf_arrow2(sxA, syA, 0, 30, Gr, 2, kA);
    for (const an of [0, Math.PI / 2]) srf_arrow2(txA, tyA, an, 26, Hc, 3.5, kA);
    for (const an of [0, Math.PI / 2]) srf_arrow2(hx, hy, an, 26, Gr, 2, kA);
    text('Pull', bxA + 30, byA - 46, { role: 'label', size: 21, color: C.heroText, alpha: kA });
    text('Glide', hx + 34, hy + 8, { role: 'label', size: 21, color: C.mute, alpha: kA });
    text('Lift', sxA + 14, syA + 66, { role: 'label', size: 21, color: C.heroText, alpha: kA });
    text('Push and lift', txA, tyA + 66, { role: 'label', size: 21, color: C.heroText, align: 'center', alpha: kA });
    text('Top', 270, 924, { role: 'label', size: 21, color: C.faint, align: 'center', alpha: ka });
    text('Thumb side; the other side mirrors its ridges', 860, 356, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: ka });
    const kTp = ep(t, 1.2, 1.6) * kT;
    if (kTp > 0.003) text('Grip tape: one texture, every way', T0[0] + 40, T0[1] + 56, { role: 'label', size: 21, color: C.secondText, alpha: kTp });
    if (kE > 0.003) text('Laser-etched: each zone for its job', T0[0] + 40, T0[1] + 56, { role: 'label', size: 21, color: C.heroText, alpha: ep(t, 5.0, 5.4) });
    /* the key: pattern, then what it grips */
    const ly0 = 660, lx = 600, rows = [['Fine ridges, side to side', 'The fingertips pull the mouse back', 'lines', 0], ['Coarse ridges, front to back', 'The sides lift it', 'lines2', 0], ['Dots', 'The thumb pushes and lifts', 'dots', 0], ['Smooth', 'The palm glides', 'none', 0]];
    rows.forEach(([nm, sub, pat], i) => {
      const y = ly0 + i * 68, k = ep(t, 5.8 + i * 0.15, 6.2 + i * 0.15), b = [lx, y, lx + 64, y + 44];
      rr(b[0], b[1], 64, 44, 4, coat, edge, 1.2, k);
      G.save(); G.beginPath(); G.rect(b[0] + 1, b[1] + 1, 62, 42); G.clip();
      if (pat === 'lines') srf_lines(b, 6, 0, rgba(Hc, 0.9), 2, k); else if (pat === 'lines2') srf_lines(b, 9, 0, rgba(Hc, 0.9), 2.6, k); else if (pat === 'dots') srf_dots([b[0] + 4, b[1] + 4, b[2], b[3]], 10, 2.4, rgba(Hc, 0.9), k);
      G.restore();
      text(nm, lx + 88, y + 18, { role: 'label', size: 21, color: C.ink, alpha: k });
      text(sub, lx + 88, y + 44, { role: 'small', size: 24, weight: 600, color: C.mute, alpha: k });
    });
    text('Patterns drawn far coarser than life', 1160, 940, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ep(t, 6.4, 6.8) });
    /* the glance: the squeeze it saves where you lift, before → after, and the chart */
    const rx = 1240, mg = 0.02931 * 9.81, nS = mg / (2 * 0.61), nE = mg / (2 * 1.43);
    srf_hl(t, 1.0, rx, 448, '−57 %', { size: 150, label: 'Squeeze to lift, sweaty fingers', sub: 'Sweat floats the skin on a smooth coat and drains into an etched one.', maxW: 600 });
    srf_ba(t, 5.6, rx, 664, nS.toFixed(2), nE.toFixed(2), { size: 64, unit: 'N', label: 'Squeeze per side to lift ' + THS.massG, who: ['Smooth coat', 'Etched'] });
    const by = 790, bx = rx + 190, bw = 380, kb = ep(t, 6.2, 7.0, E.snap);
    [['Smooth coat', nS, C.comp, C.ink2], ['Etched', nE, C.hero, C.heroText]].forEach(([nm, v, col, tc], i) => {
      const yy = by + i * 46, kk = ep(t, 6.0 + i * 0.2, 6.4 + i * 0.2);
      text(nm, rx, yy + 8, { role: 'small', size: 25, weight: i ? 800 : 600, color: i ? C.ink : C.ink2, alpha: kk });
      rr(bx, yy - 9, Math.max(18, bw * v / 0.26 * kb), 18, 9, col, null, 0, kk);
      text(v.toFixed(2) + ' N', bx + bw * v / 0.26 * kb + 14, yy + 9, { font: 'disp', size: 26, weight: 800, color: tc, alpha: kk * kb, tnum: true });
    });
    srf_better(t, 6.6, rx, by + 92, 'Lower is better');
    const kp = ep(t, 7.0, 7.4); pill(rx, by + 132, 'study', kp, { by: 'Derler 2012' });
    pill(rx + pillW('study', { by: 'Derler 2012' }) + 24, by + 132, 'derived', kp);
    text('Skin on glass, smooth and roughened; N = m·g ÷ 2μ', rx, by + 166, { role: 'small', size: 24, weight: 600, color: C.mute, alpha: kp, maxW: RM - rx });
  }
});

/* ============================== solid state: no adhesive ==============================
   Brock (F2.15): "the solid state solution that doesn't need adhesives that wear down over time or collect gunk". Two
   sections drawn to one scale (160 px per mm): grip tape (Lizard Skins DSP, 0.5 mm, on a pressure-sensitive adhesive) and the
   etched coat (19 µm, the etch inside it). Six months of use run past: the adhesive creeps out at the cut edge (US 6,686,014),
   lint and skin stick to it, the edge lifts, the texture wears; the coat has nothing to creep or lift. The ageing is drawn
   from those reports (illustrative), not measured. */
S({
  id: 'srf_tape', ch: 'surface', theme: 'paper', title: 'Solid state: no adhesive', settle: 10, ideas: [60], after: 'srf_gripmap',
  src: ['srf_ooze', 'srf_lizard', 'srf_f110', 'srf_doc'],
  draw: t => {
    header(t, 'Solid state: no adhesive');
    captions(t, [[0.6, 'Grip tape is a sticker: half a millimetre of texture on a layer of glue. The glue creeps, and dirt sticks to it.'], [5.6, 'An etched coat is one solid layer. There is no glue to creep, no edge to lift, and nothing to replace.']]);
    const T0 = [LM, 280, 1160, 680]; demoWindow(T0[0], T0[1], T0[2], T0[3], tileA(t, 0.2, 0));
    const k0 = ep(t, 0.4, 1.0), age = ep(t, 1.8, 8.2, E.io3), mo = age * 6;
    /* the clock */
    const cx0 = T0[0] + 40, cw = 360, cy = T0[1] + 58;
    text('Use', cx0, cy, { role: 'label', size: 21, color: C.mute, alpha: k0 });
    rr(cx0 + 70, cy - 12, cw, 10, 5, C.track, null, 0, k0); rr(cx0 + 70, cy - 12, Math.max(10, cw * age), 10, 5, C.ink2, null, 0, k0);
    text(age < 0.03 ? 'Day 1' : mo < 1 ? Math.max(1, Math.round(mo * 30)) + ' days' : mo.toFixed(0) + (mo >= 1.5 ? ' months' : ' month'), cx0 + 70 + cw + 20, cy, { role: 'label', size: 21, color: C.ink, alpha: k0, tnum: true });
    text('Ageing drawn from the reports, not measured', T0[0] + T0[2] - 40, T0[1] + T0[3] - 30, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: k0 });
    const shell = '#2E2F34', coatC = '#1A1B1E', x0 = T0[0] + 40, x1 = T0[0] + T0[2] - 40, PXMM = 160;
    /* section 1: grip tape on the coat */
    const yS1 = 600, tapeH = 0.5 * PXMM, adh = 9, xe = 820 + 4 * age, lift = ep(t, 4.4, 8.2, E.io3);
    G.save(); G.globalAlpha = k0;
    G.fillStyle = shell; G.fillRect(x0, yS1, x1 - x0, 70); G.fillStyle = coatC; G.fillRect(x0, yS1 - 3, x1 - x0, 3);
    /* the adhesive: under the tape, then oozing out past the edge as a bead */
    const ooze = 34 * age;
    G.fillStyle = 'rgba(206,203,192,0.92)'; G.fillRect(x0, yS1 - 3 - adh, xe - x0, adh);
    if (ooze > 0.5) { G.beginPath(); G.moveTo(xe - 2, yS1 - 3 - adh); G.quadraticCurveTo(xe + ooze * 0.9, yS1 - 3 - adh * 0.9, xe + ooze, yS1 - 3); G.lineTo(xe - 2, yS1 - 3); G.closePath(); G.fill(); }
    /* the tape: its body and a raised texture that wears flat; its last stretch peels up */
    const bump = 12 * (1 - 0.7 * age), pe = 150, ang = -0.12 * lift, dk = 0.18 * age;
    const tapeBody = (xa, xb) => { G.beginPath(); G.moveTo(xa, yS1 - 3 - adh); G.lineTo(xa, yS1 - 3 - adh - tapeH + bump); for (let x = xa; x <= xb; x += 18) { G.lineTo(x + 9, yS1 - 3 - adh - tapeH); G.lineTo(Math.min(xb, x + 18), yS1 - 3 - adh - tapeH + bump); } G.lineTo(xb, yS1 - 3 - adh); G.closePath(); };
    G.fillStyle = mix('#46474D', '#2A2A2C', dk); tapeBody(x0, xe - pe); G.fill();
    G.save(); G.translate(xe - pe, yS1 - 3 - adh); G.rotate(ang); G.translate(-(xe - pe), -(yS1 - 3 - adh)); tapeBody(xe - pe - 1, xe); G.fill(); G.restore();
    if (lift > 0.02) { G.strokeStyle = 'rgba(206,203,192,0.85)'; G.lineWidth = 2; for (let i = 0; i < 5; i++) { const xx = xe - pe + 30 + i * 26, yy = yS1 - 3 - adh + Math.tan(ang) * (xx - (xe - pe)); G.beginPath(); G.moveTo(xx, yS1 - 3 - adh); G.lineTo(xx + 3, yy); G.stroke(); } }
    /* gunk: lint and skin caught on the bead and in the texture */
    const r = rng(41), nG = Math.round(46 * ep(t, 2.6, 8.2));
    for (let i = 0; i < 46; i++) { const u = r(), v = r(), sz = 2 + r() * 4, inBead = i % 3 !== 0; if (i >= nG) continue;
      const gx = inBead ? xe + u * ooze * 1.1 - 6 : x0 + 40 + u * (xe - pe - x0 - 60), gy = inBead ? yS1 - 6 - v * 10 : yS1 - 3 - adh - tapeH + bump + 3 + v * 4;
      G.fillStyle = rgba(C.bad, 0.85); G.beginPath(); G.ellipse(gx, gy, sz, sz * 0.6, u * 3, 0, TAU); G.fill(); }
    G.restore();
    text('Grip tape, 0.5 mm, on its glue', x0, yS1 - tapeH - 70, { role: 'label', size: 21, color: C.ink, alpha: k0 });
    const kL = ep(t, 3.0, 3.4);
    callout(t, 3.0, [xe + ooze * 0.6, yS1 - 6], 'The glue creeps out', { to: [930, 470], side: 'r', color: C.bad, tcolor: C.ink });
    callout(t, 5.0, [xe - pe * 0.4, yS1 - 3 - adh - tapeH * 0.2 + Math.tan(ang) * pe * 0.6], 'The edge lifts', { to: [600, 420], side: 'l', color: C.bad, tcolor: C.ink });
    text('Owners: "dead skin does get stuck"', x1, yS1 + 104, { role: 'small', size: 24, weight: 600, color: C.mute, align: 'right', alpha: ep(t, 6.0, 6.4) });
    /* section 2: the etched coat, the same scale: a 19 µm line with nothing on it */
    const yS2 = 880;
    G.save(); G.globalAlpha = k0; G.fillStyle = shell; G.fillRect(x0, yS2, x1 - x0, 70); G.fillStyle = coatC; G.fillRect(x0, yS2 - 3, x1 - x0, 3); G.restore();
    text('Etched coat, 19 µm, the etch inside it', x0, yS2 - 70, { role: 'label', size: 21, color: C.heroText, alpha: k0 });
    callout(t, 6.4, [700, yS2 - 2], 'Nothing to creep or lift', { to: [860, yS2 - 60], side: 'r', color: C.hero, tcolor: C.heroText });
    /* the glance */
    const rx = 1280;
    srf_hl(t, 1.0, rx, 460, '0', { size: 160, label: 'Glue under the grip', word: 'Adhesive', sub: 'The grip is etched into the coat, so there is nothing to stick on.', maxW: RM - rx });
    srf_ba(t, 2.4, rx, 676, '0.5', '0', { size: 64, unit: 'mm', label: 'Added to each side', who: ['Grip tape', 'Etched'] });
    sourceBox(t, 3.6, rx, 760, RM - rx, 'US 6,686,014, 2004', 'Pressure-sensitive glue creeps and oozes out from under a cut edge, and dirt sticks to what comes out.');
  }
});

/* ============================== two-tone in one coat ==============================
   Brock (F2.21): "the cerakote etching lets us do 2 tone designs without having to worry about a second coat adding weight or
   coming off (as seen in the finalmouse prophecy series)". The Prophecy's art sits on a satin undercoat under a UV top coat:
   layers on the shell. Here a laser rasters a Greek key (the labyrinth, for Theseus) out of a white coat down to the carbon
   shell: the second tone is the shell itself (Cerakote also lists Laser Imaging, a second tone in the same coat). */
const SRF_KEY = ['#######.', '#.....#.', '#.###.#.', '#.#.#.#.', '#.#...#.', '#.#####.', '#.......', '########'];
const SRF_TT = { w: 720, h: 450, cell: 20, rows: 30 };
function srf_genTwoTone(f) {
  const { w, h } = f, c = SRF_TT.cell, yb0 = Math.round(h / 2 - 5 * c), D = 4.2;
  srf_layer1(f, true); f.ramp = 0.0025;
  const inKey = (x, y) => { const j = Math.floor((y - yb0) / c), i = Math.floor(x / c) % 8; if (j === -2 || j === 9) return true; if (j < 0 || j > 7) return false; return SRF_KEY[j][i] === '#'; };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x, i = p * 3;
    const z = 0.9 * srf_fbm(x / 40, y / 40, 9, 3) + 0.35 * srf_fbm(x / 7, y / 7, 16, 2) + 0.14 * (srf_hash(x, y, 4) - 0.5), v = 4 * srf_vn(x / 3, y / 3, 12);
    f.z0[p] = z; for (let j = 0; j < 3; j++) f.a0[i + j] = [208, 209, 206][j] + v; f.g0[p] = 0.22;
    if (inKey(x, y)) {
      /* the shell under the coat: dark carbon-filled PP, short fibres lying along the flow (left to right) */
      const fib = srf_vn(x / 9, y / 1.6, 31) > 0.55 ? 14 : 0, cv = 3 * srf_vn(x / 2, y / 2, 33);
      f.z1[p] = z * 0.35 - D; for (let j = 0; j < 3; j++) f.a1[i + j] = [36, 37, 41][j] + fib + cv; f.g1[p] = 0.5;
      const row = Math.floor((y - (yb0 - 2 * c)) / ((12 * c) / SRF_TT.rows));
      f.th[p] = (clamp(row, 0, SRF_TT.rows - 1) + x / w) / SRF_TT.rows;
    }
  }
  Object.assign(f.mat, { amb: 0.2, kd: 1.0, ks: 0.5, sh: 24, rz: 1.25, aoR: 5, aoK: 0.22, kf: 0.22 });
  f.band = [yb0 - 2 * c, yb0 + 10 * c];
}
/** a stack of layers on the shell, drawn as bands; layers = [{ h, col, name, chip }]; chip (0..1) breaks a notch out of the
   layers marked chip: true. Returns the stack's top */
function srf_stack(t, x, y, w, layers, a, chip = 0) {
  if (a <= 0.003) return y;
  let yy = y; G.save(); G.globalAlpha *= a;
  const sh = 46; rr(x, yy - sh, w, sh, 3, TH ? '#2E2F34' : '#34353B', null, 0, 1); yy -= sh;
  const notch = [x + w * 0.42, x + w * 0.42 + 70 * chip];
  for (const L of layers) {
    G.fillStyle = L.col; G.fillRect(x, yy - L.h, w, L.h);
    if (L.chip && chip > 0.01) { G.fillStyle = TH ? C.panel : C.panel; G.fillRect(notch[0], yy - L.h - 1, notch[1] - notch[0], L.h + 1); }
    yy -= L.h;
  }
  if (chip > 0.01) { G.strokeStyle = C.bad; G.lineWidth = 2.5; G.strokeRect(notch[0] - 3, yy - 3, notch[1] - notch[0] + 6, y - sh - yy + 6); }
  G.restore();
  return yy;
}
S({
  id: 'srf_twotone', ch: 'surface', theme: 'night', title: 'Two-tone in one coat', settle: 10, ideas: [60, 16], after: 'srf_tape',
  src: ['srf_laserImg', 'srf_prophecy', 'srf_prophecyW', 'srf_f110', 'srf_doc'],
  draw: t => {
    header(t, 'Two-tone in one coat');
    captions(t, [[0.6, 'A laser cuts the second colour out of the first: the white coat comes off and the carbon shell under it is the other tone.'], [5.8, 'Painted art goes on top, layer over layer. Etched art adds no coat, so it adds no weight and has nothing on top to chip.']]);
    /* the macro: a white coat; a laser rasters the key band out of it; a studio light sweeps once */
    const T0 = [LM, 280, 1080, 680]; demoWindow(T0[0], T0[1], T0[2], T0[3], tileA(t, 0.2, 0), { r: SRF.r });
    const f = srf_field('twotone', SRF_TT.w, SRF_TT.h, srf_genTwoTone), kL = ep(t, 1.4, 7.4);
    const M = srf_macro(t, f, T0[0], T0[1], T0[2], T0[3], { light: srf_sweep(t, f, 0.4, 3.6, { y: -0.4 }), k: kL, zoom: 1 + 0.05 * ep(t, 0.5, 10, E.io3), alpha: ep(t, 0.3, 1.0) });
    if (kL > 0 && kL < 1) {
      const row = Math.min(SRF_TT.rows - 1, Math.floor(kL * SRF_TT.rows)), u = kL * SRF_TT.rows - row, rh = (f.band[1] - f.band[0]) / SRF_TT.rows;
      const q = M.map(u * f.w, f.band[0] + (row + 0.5) * rh);
      G.save(); rrPath(T0[0], T0[1], T0[2], T0[3], SRF.r); G.clip();
      glow(q[0], q[1], 34, C.hero, 0.6); circle(q[0], q[1], 4, { fill: '#FFFFFF' });
      G.restore();
    }
    const kc = ep(t, 1.0, 1.4);
    text('White coat', T0[0] + 32, T0[1] + 52, { role: 'label', size: 21, color: 'rgba(17,17,17,0.72)', alpha: kc });
    text('Etched through: the carbon shell is the second tone', T0[0] + 32, T0[1] + T0[3] - 32, { role: 'small', size: 24, weight: 700, color: 'rgba(17,17,17,0.85)', alpha: ep(t, 4.0, 4.4) });
    /* the glance: one coat, and the layers it replaces */
    const rx = 1200;
    srf_hl(t, 1.0, rx, 448, '1', { size: 150, label: 'Coats for two tones', word: 'Coat', sub: 'The second tone is etched out of the first, so it adds no weight.', maxW: RM - rx });
    srf_ba(t, 2.6, rx, 660, '3', '1', { size: 72, label: 'Layers on the shell, Prophecy → Theseus' });
    /* the two stacks, and a scuff that chips the painted one */
    const sy = 890, sw2 = 280, chip = ep(t, 7.2, 7.8), sc = ep(t, 6.8, 8.0, E.io3);
    const kS = ep(t, 3.4, 3.9);
    srf_stack(t, rx, sy, sw2, [{ h: 18, col: '#8C8B86' }, { h: 22, col: rgba(C.second, 0.95), chip: true }, { h: 14, col: 'rgba(230,232,236,0.55)', chip: true }], kS, chip);
    const top2 = srf_stack(t, rx + sw2 + 40, sy, sw2, [{ h: 14, col: '#D9DAD6' }], ep(t, 3.6, 4.1));
    if (kS > 0.003) { G.save(); G.globalAlpha = ep(t, 3.6, 4.1); G.fillStyle = TH ? '#2E2F34' : '#34353B'; G.fillRect(rx + sw2 + 40 + 96, top2, 70, 14); G.restore(); }
    text('Prophecy: 3 layers', rx, sy - 132, { role: 'label', size: 21, color: C.secondText, alpha: kS });
    text('Theseus: 1 coat', rx + sw2 + 40, sy - 132, { role: 'label', size: 21, color: C.heroText, alpha: ep(t, 3.6, 4.1) });
    text('Shell', rx + 14, sy - 16, { role: 'label', size: 19, color: 'rgba(255,255,255,0.7)', alpha: kS });
    if (sc > 0 && sc < 1) { const xx = lerp(rx - 10, rx + 2 * sw2 + 50, sc); line(xx - 18, sy - 170, xx, sy - 102, { color: C.mute, w: 3 }); }
    text(chip > 0.5 ? 'A scuff chips the paint' : '', rx, sy + 36, { role: 'small', size: 24, weight: 700, color: C.bad, alpha: chip });
    text(chip > 0.5 ? 'Nothing on top to chip' : '', rx + sw2 + 40, sy + 36, { role: 'small', size: 24, weight: 700, color: C.heroText, alpha: chip });
    pill(rx, sy + 72, 'claim', ep(t, 4.2, 4.6), { by: 'Finalmouse', text: 'Finalmouse: 33 g painted, 29 g plain' });
  }
});

/* ============================== the surface in section, magnified ==============================
   Pyrofil PP-C-20A: 20 % carbon fibre by weight, about 11 % by volume (1.8 against 0.9 g/cm³); fibres 7 µm across and 250 to
   500 µm long after moulding (Höftberger 2022), lying along the flow near the surface and more across it deeper in
   (Yamaguchi 2024). The section is cut along the flow, so a fibre lying in the cut shows its length, and one crossing it shows
   a short oval. Over it: the blasted profile (drawn, not measured) and Cerakote F-Series' 0.75 mil film (19 µm), which levels
   over the profile. s = px per µm; o = { blast (0..1), coat (0..1), top (the moulded surface, a fraction of h), seed, t } */
const SRF_FIB = new Map();
function srf_fibres(seed, Wu, Du) {
  const key = seed + ':' + Math.round(Wu) + ':' + Math.round(Du); if (SRF_FIB.has(key)) return SRF_FIB.get(key);
  const r = rng(seed), out = []; let area = 0;
  while (area < 0.11 * Wu * Du && out.length < 400) {
    /* phi: the fibre's angle out of the cut. Near the surface the fibres lie close to the flow (small phi: long ovals); deeper
       in more of them cross it (round ends) */
    const d = 4 + r() * (Du - 4), near = d < Du * 0.45, ang = near ? (r() - 0.5) * 0.18 : (r() - 0.5) * 0.7;
    const phi = near ? 0.03 + r() * 0.22 : 0.08 + r() * 1.45, L = Math.min(250 + r() * 250, 7 / Math.sin(phi));
    out.push({ x: r() * (Wu + 300) - 150, d, ang, L }); area += L * 7;
  }
  SRF_FIB.set(key, out); return out;
}
const srf_prof = u => 6 + 4.5 * srf_fbm(u / 11, 0.5, 21, 3) + 2.0 * srf_fbm(u / 2.6, 1.5, 22, 2);   /* blast depth, µm */
function srf_section(t, B, s, o = {}) {
  const [x, y, w, h] = B, kb = o.blast == null ? 1 : o.blast, kc = o.coat == null ? 1 : o.coat, ys = y + (o.top || 0.3) * h, film = 19;
  const Wu = w / s, Du = (y + h - ys) / s, fib = srf_fibres(o.seed || 7, Wu, Du), step = 3, N = Math.ceil(w / step);
  const P = i => ys + kb * srf_prof(i * step / s) * s, mean = ys + kb * 6 * s;
  const top = i => Math.min(P(i), mean - kc * film * s + 0.26 * (P(i) - mean));
  G.save(); rrPath(x, y, w, h, o.r == null ? 6 : o.r); G.clip();
  G.fillStyle = '#121315'; G.fillRect(x, y, w, h);
  /* the shell: PP with its fibres, cut along the flow */
  G.beginPath(); G.moveTo(x, y + h); for (let i = 0; i <= N; i++) G.lineTo(x + i * step, P(i)); G.lineTo(x + w, y + h); G.closePath();
  G.save(); G.fillStyle = '#2A2B30'; G.fill(); G.clip();
  for (const f of fib) {
    const cx = x + f.x * s, cy = ys + f.d * s, L = f.L * s, d = 7 * s;
    G.save(); G.translate(cx, cy); G.rotate(f.ang);
    rrPath(-L / 2, -d / 2, L, d, Math.min(d / 2, L / 2)); G.fillStyle = '#4E5057'; G.fill();
    G.fillStyle = 'rgba(160,164,172,0.35)'; G.fillRect(-L / 2 + d * 0.3, -d * 0.32, Math.max(0, L - d * 0.6), d * 0.18);
    G.restore();
  }
  G.restore();
  /* the film: it fills the valleys and levels over the peaks; ceramic specks in it */
  if (kc > 0.003) {
    G.beginPath(); G.moveTo(x, P(0)); for (let i = 0; i <= N; i++) G.lineTo(x + i * step, top(i)); for (let i = N; i >= 0; i--) G.lineTo(x + i * step, P(i)); G.closePath();
    G.save(); G.fillStyle = o.coatCol || '#5C5E66'; G.fill(); G.clip();
    const r = rng(77); G.fillStyle = 'rgba(220,222,228,0.5)'; for (let i = 0; i < w * 0.6; i++) { const px = x + r() * w, py = mean - r() * (film + 8) * s; G.fillRect(px, py, 1.6, 1.6); }
    G.restore();
    G.beginPath(); for (let i = 0; i <= N; i++) { const yy = top(i); i ? G.lineTo(x + i * step, yy) : G.moveTo(x, yy); } G.strokeStyle = 'rgba(235,236,240,0.55)'; G.lineWidth = 1.5; G.stroke();
  }
  G.restore();
  return { ys, mean, P: i => P(i), top: px => top(Math.round((px - x) / step)), prof: px => P(Math.round((px - x) / step)), s, film };
}
/** a beam balance: pivot (cx, cy), half-length L; mL and mR the loads (any unit); returns the pans' centres */
function srf_balance(cx, cy, L, mL, mR, a, o = {}) {
  if (a <= 0.003) return null;
  const th = clamp((mL - mR) * 0.3, -0.22, 0.22), cs = Math.cos(th), sn = Math.sin(th), col = o.col || C.ink2;
  const eL = [cx - L * cs, cy + L * sn], eR = [cx + L * cs, cy - L * sn], hang = 110;
  G.save(); G.globalAlpha *= a;
  line(cx, cy, cx, cy + 190, { color: col, w: 4 }); rr(cx - 60, cy + 186, 120, 10, 5, col, null, 0, 1);
  line(eL[0], eL[1], eR[0], eR[1], { color: col, w: 5 }); circle(cx, cy, 9, { fill: col });
  const pans = [];
  for (const [e, m, heap] of [[eL, mL, o.heapL], [eR, mR, o.heapR]]) {
    const px = e[0], py = e[1] + hang;
    line(e[0], e[1], px - 70, py, { color: col, w: 1.5 }); line(e[0], e[1], px + 70, py, { color: col, w: 1.5 });
    if (m > 0.003) { const hh = 46 * Math.sqrt(m); G.beginPath(); G.moveTo(px - 66, py); G.quadraticCurveTo(px, py - hh * 2, px + 66, py); G.closePath(); G.fillStyle = heap || C.comp; G.fill(); }
    G.beginPath(); G.moveTo(px - 84, py); G.quadraticCurveTo(px, py + 30, px + 84, py); G.strokeStyle = col; G.lineWidth = 4; G.stroke();
    pans.push([px, py]);
  }
  G.restore();
  return pans;
}

/* ============================== film thin: no added weight ==============================
   Brock (F2.22): "cerakote is film thin and is the only coating that doesn't add weight because the sandblasting process
   blasts off almost as much as it adds". The film's weight is derived from Cerakote's F-110 data (36.9 g/m² at 0.75 mil) and
   the shell's area from the scan (133 cm²): 0.49 g. What the blast takes off is Brock's estimate ("almost as much"), so the
   balance shows it as a load, with no number of its own. Soft-touch is RadTech's 2 mil film at 1.0 g/cm³ or more. */
const SRF_W = { gm2: 36.9, cm2: 133, soft: 51 };
SRF_W.coat = SRF_W.gm2 * SRF_W.cm2 / 1e4; SRF_W.softG = SRF_W.soft * 1e-4 * SRF_W.cm2 * 1.0;
S({
  id: 'srf_weight', ch: 'surface', theme: 'paper', title: 'Film thin: no added weight', settle: 10, ideas: [16], after: 'coating',
  src: ['srf_f110', 'srf_fManual', 'srf_soft', 'srf_scan', 'srf_doc'],
  draw: t => {
    header(t, 'Film thin: no added weight');
    captions(t, [[0.6, 'Before it is coated, the shell is blasted with fine grit. The blast takes a skin of plastic off.'], [4.4, 'Then a film 19 µm thin goes on, about as heavy as what came off. The shell leaves the oven at the weight it went in.']]);
    const T0 = [LM, 280, 1120, 680]; demoWindow(T0[0], T0[1], T0[2], T0[3], tileA(t, 0.2, 0));
    const kb = ep(t, 1.2, 3.6, E.io3), kc = ep(t, 4.4, 6.8, E.io3), B = [T0[0] + 40, T0[1] + 80, T0[2] - 80, 300];
    const sec = srf_section(t, B, 2, { blast: kb, coat: kc, top: 0.36, seed: 11 });
    /* the blast: grit in from the upper left; the spray: droplets down from above */
    G.save(); rrPath(B[0], B[1], B[2], B[3], 6); G.clip();
    if (kb > 0 && kb < 1) for (let i = 0; i < 46; i++) { const ph = ((t * 1.6 + i / 46) % 1), hx = B[0] + ((i * 97) % 1000) / 1000 * B[2], hy = sec.prof(hx); const px = lerp(hx - 160, hx, ph), py = lerp(B[1] - 20, hy, ph); G.fillStyle = 'rgba(236,233,224,0.9)'; G.fillRect(px - 2, py - 2, 4, 3); }
    if (kc > 0 && kc < 1) for (let i = 0; i < 60; i++) { const ph = ((t * 1.1 + i / 60) % 1), hx = B[0] + ((i * 61) % 1000) / 1000 * B[2], hy = sec.top(hx); circle(hx, lerp(B[1] - 10, hy, ph), 2.4, { fill: 'rgba(190,194,204,0.85)' }); }
    G.restore();
    const kl = ep(t, 0.6, 1.0);
    [['Blast', 1.2, kb], ['Coat', 4.4, kc]].forEach(([nm, t0, k], i) => { const on = t >= t0; text((i + 1) + '  ' + nm, T0[0] + 40 + i * 150, T0[1] + 52, { role: 'label', size: 21, color: on ? C.ink : C.faint, alpha: kl }); if (on) rect(T0[0] + 40 + i * 150, T0[1] + 62, tw((i + 1) + '  ' + nm, { role: 'label', size: 21 }) * k, 3, { fill: i ? C.hero : C.ink2 }); });
    text('Section through the shell, along the flow', B[0] + B[2], T0[1] + 52, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kl });
    /* the film's thickness, and a scale bar */
    const kd = ep(t, 6.8, 7.2), dx = B[0] + B[2] - 120, t1 = sec.top(dx), m1 = sec.mean;
    if (kd > 0.003) { line(dx, t1, dx, m1, { color: C.hero, w: 2, alpha: kd }); line(dx - 8, t1, dx + 8, t1, { color: C.hero, w: 2, alpha: kd }); line(dx - 8, m1, dx + 8, m1, { color: C.hero, w: 2, alpha: kd }); text('19 µm', dx - 14, (t1 + m1) / 2 + 8, { role: 'label', size: 21, color: '#FFFFFF', align: 'right', alpha: kd }); }
    line(B[0] + 24, B[1] + B[3] - 24, B[0] + 124, B[1] + B[3] - 24, { color: 'rgba(255,255,255,0.8)', w: 3, alpha: kl });
    text('50 µm', B[0] + 24, B[1] + B[3] - 36, { role: 'label', size: 19, color: 'rgba(255,255,255,0.8)', alpha: kl });
    /* the balance: what the blast took off against what the film put on */
    const mL = 0.95 * kb, mR = 1.0 * kc, kB = ep(t, 1.0, 1.5);
    const pans = srf_balance(T0[0] + T0[2] / 2, T0[1] + 452, 250, mL, mR, kB, { heapL: C.comp, heapR: C.hero });
    if (pans) {
      text('Blasted off', pans[0][0], pans[0][1] + 64, { role: 'label', size: 21, color: C.ink2, align: 'center', alpha: kB });
      text('Almost as much', pans[0][0], pans[0][1] + 92, { role: 'small', size: 24, weight: 600, color: C.mute, align: 'center', alpha: ep(t, 3.4, 3.8) });
      text('Coated on', pans[1][0], pans[1][1] + 64, { role: 'label', size: 21, color: C.heroText, align: 'center', alpha: kB });
      text(fmtN(SRF_W.coat, 2) + ' g of film', pans[1][0], pans[1][1] + 92, { role: 'small', size: 24, weight: 700, color: C.heroText, align: 'center', alpha: ep(t, 6.4, 6.8) });
    }
    /* the glance */
    const rx = 1240;
    srf_hl(t, 1.0, rx, 448, '≈0 g', { size: 150, label: 'Weight the coat adds, net', sub: 'The blast takes off almost as much as the film puts back.', maxW: RM - rx });
    srf_ba(t, 6.8, rx, 660, '+' + fmtN(SRF_W.coat, 2), '≈0', { size: 64, unit: 'g', label: 'The film, then the blast' });
    const rows = [['Soft-touch, 51 µm', SRF_W.softG, C.comp, '≥' + fmtN(SRF_W.softG, 2) + ' g'], ['Cerakote film, 19 µm', SRF_W.coat, C.comp, fmtN(SRF_W.coat, 2) + ' g'], ['Theseus, net', 0.02, C.hero, '≈0 g']];
    const bx = rx + 330, bw = RM - bx - 90, kb2 = ep(t, 7.4, 8.4, E.snap);
    rows.forEach(([nm, v, col, lab], i) => {
      const yy = 744 + i * 44, kk = ep(t, 7.2 + i * 0.15, 7.6 + i * 0.15), hero = i === 2;
      text(nm, rx, yy + 8, { role: 'small', size: 24, weight: hero ? 800 : 600, color: hero ? C.ink : C.ink2, alpha: kk, maxW: 320 });
      rr(bx, yy - 8, Math.max(16, bw * v / 0.7 * kb2), 16, 8, col, null, 0, kk);
      text(lab, bx + Math.max(16, bw * v / 0.7 * kb2) + 12, yy + 8, { font: 'disp', size: 24, weight: 800, color: hero ? C.heroText : C.ink2, alpha: kk * kb2, tnum: true });
    });
    srf_better(t, 7.8, rx, 884, 'Weight added, lower is better');
    pill(rx, 924, 'derived', ep(t, 8.0, 8.4));
    text('F-110 36.9 g/m² × 133 cm²; soft-touch at ≥1 g/cm³', rx + pillW('derived') + 18, 924, { role: 'small', size: 24, weight: 600, color: C.mute, alpha: ep(t, 8.0, 8.4), maxW: RM - rx - 120 });
  }
});

/* ============================== the coat and the fibres, close up ==============================
   Brock (F2.13): "improve how the texture of the cerakote looks and make the fibers look more accurate". The section at 3 px per
   µm (srf_section), the coat from above (a height field under a sweeping light), and the film against soft-touch's. */
S({
  id: 'srf_texture', ch: 'surface', theme: 'night', title: 'Ceramic film over carbon fibre', settle: 10, ideas: [16], before: 'srf_weight',
  src: ['srf_fManual', 'srf_f110', 'srf_micron', 'srf_hoft22', 'srf_yama24', 'srf_ppc20', 'srf_soft'],
  draw: t => {
    header(t, 'Ceramic film over carbon fibre');
    captions(t, [[0.6, 'Under the coat, the shell is polypropylene filled with short carbon fibres, each 7 µm across, lying along the flow.'], [5.0, 'The blast roughens it, and the ceramic film fills the roughness and levels over it: 19 µm, a fifth of a sheet of paper.']]);
    const T0 = [LM, 280, 1160, 680]; demoWindow(T0[0], T0[1], T0[2], T0[3], tileA(t, 0.2, 0));
    const kb = ep(t, 2.2, 3.6, E.io3), kc = ep(t, 4.2, 5.8, E.io3), s = 3, B = [T0[0], T0[1], T0[2], T0[3]];
    const sec = srf_section(t, B, s, { blast: kb, coat: kc, top: 0.27, seed: 5, r: 6 });
    const k1 = ep(t, 1.0, 1.5), W = C.ink, Wm = C.mute;
    text('Section along the flow', T0[0] + 32, T0[1] + 50, { role: 'label', size: 21, color: Wm, alpha: ep(t, 0.6, 1.0) });
    /* the film's thickness */
    const kd = ep(t, 5.8, 6.2), dx = T0[0] + 860, t1 = sec.top(dx), m1 = sec.mean;
    if (kd > 0.003) { line(dx, t1, dx, m1, { color: C.hero, w: 2.5, alpha: kd }); for (const yy of [t1, m1]) line(dx - 10, yy, dx + 10, yy, { color: C.hero, w: 2.5, alpha: kd }); }
    callout(t, 6.0, [dx, (t1 + m1) / 2], 'Cerakote, 19 µm', { to: [dx - 120, T0[1] + 104], side: 'l', color: C.heroText, tcolor: C.ink, sub: 'Ceramic in a binder' });
    callout(t, 3.8, [T0[0] + 330, sec.prof(T0[0] + 330)], 'Blasted profile', { to: [T0[0] + 290, T0[1] + 110], side: 'l', color: C.ink });
    /* a fibre near the surface, and one crossing the cut deeper in */
    const fib = srf_fibres(5, T0[2] / s, (T0[1] + T0[3] - sec.ys) / s);
    const near = fib.filter(f => f.d < 60 && f.x * s > 150 && f.x * s < 820 && f.L > 30).sort((a, b) => Math.abs(a.x * s - 560) - Math.abs(b.x * s - 560))[0];
    const deep = fib.filter(f => f.d > 70 && f.L < 16 && f.x * s > 200 && f.x * s < 620)[0];
    if (near) callout(t, 1.6, [T0[0] + near.x * s + Math.cos(near.ang) * near.L * s * 0.25, sec.ys + near.d * s + Math.sin(near.ang) * near.L * s * 0.25], 'Carbon fibre, 7 µm across', { to: [T0[0] + 640, T0[1] + 520], side: 'r', color: C.ink, sub: 'Lying along the flow' });
    if (deep) callout(t, 2.0, [T0[0] + deep.x * s + 16, sec.ys + deep.d * s + 10], 'One crossing the cut', { to: [T0[0] + 300, T0[1] + 610], side: 'l', color: C.ink });
    text('PP-C-20A: 20 % carbon fibre', T0[0] + T0[2] - 32, T0[1] + 50, { role: 'label', size: 21, color: Wm, align: 'right', alpha: k1 });
    line(T0[0] + T0[2] - 182, T0[1] + T0[3] - 34, T0[0] + T0[2] - 32, T0[1] + T0[3] - 34, { color: W, w: 3, alpha: k1 });
    text('50 µm', T0[0] + T0[2] - 194, T0[1] + T0[3] - 26, { role: 'label', size: 19, color: W, align: 'right', alpha: k1 });
    /* the glance: the film, and how much thinner than soft-touch */
    const rx = 1280;
    srf_hl(t, 1.0, rx, 448, '19 µm', { size: 150, label: 'Film thickness', sub: 'Cerakote F-Series\' standard film.', maxW: RM - rx });
    srf_ba(t, 2.4, rx, 616, '51', '19', { size: 64, unit: 'µm', label: 'Film, soft-touch → Cerakote', net: '−63 % thinner' });
    /* the coat from above: a satin ceramic, its grain caught by a sweeping light */
    const M0 = [rx, 720, RM - rx, 240]; demoWindow(M0[0], M0[1], M0[2], M0[3], tileA(t, 0.6, 1), { r: SRF.r });
    const f = srf_field('texture:top', 560, 240, ff => srf_genFilm(ff, { pat: 'none', seed: 8, rough: 1.2, col: [58, 60, 66] }));
    srf_macro(t, f, M0[0], M0[1], M0[2], M0[3], { light: srf_sweep(t, f, 0.8, 3.6, { y: -0.5, z: 0.26 }), zoom: 1 + 0.08 * ep(t, 0.5, 10, E.io3), alpha: ep(t, 0.7, 1.3) });
    text('The coat from above', M0[0] + 24, M0[1] + M0[3] - 24, { role: 'label', size: 19, color: 'rgba(255,255,255,0.75)', alpha: ep(t, 1.2, 1.6) });
  }
});

/* ============================== UV and chemical resistance ==============================
   Brock (F2.23): "with most coatings it's very hard to tell if they will yellow over time, but cerakote is by far one of the
   safest because of its industry leading chemical and uv resistance (like how the ulx pros yellowed)". Two white test panels
   under UV lamps for 1,000 h: each keeps a strip of its first colour at the top, so the change shows against it. Cerakote's
   panel is its QUV result (ASTM D4587, no visible degradation); the other panel's yellowing is drawn from owners' reports of
   the ULX Pro Series, not measured, and no rate is implied. */
S({
  id: 'srf_uv', ch: 'surface', theme: 'night', title: 'UV and chemical resistance', settle: 10, ideas: [16], after: 'srf_weight',
  src: ['srf_quv', 'srf_f110', 'srf_h167', 'srf_chem', 'srf_rdClix', 'srf_rdUlx', 'srf_doc'],
  draw: t => {
    header(t, 'UV and chemical resistance');
    captions(t, [[0.6, 'Most mouse coatings publish no UV or chemical data, so nobody knows if a white shell will stay white.'], [5.4, 'Cerakote publishes both. After 1,000 hours under UV lamps its film showed no visible change. The ULX Pro Series yellowed.']]);
    const T0 = [LM, 280, 1080, 680]; demoWindow(T0[0], T0[1], T0[2], T0[3], tileA(t, 0.2, 0));
    const k0 = ep(t, 0.4, 1.0), hrs = ep(t, 1.6, 7.6, E.io3), H = Math.round(hrs * 1000);
    /* the lamps, and their light falling on the panels */
    for (let i = 0; i < 4; i++) { const lx = T0[0] + 140 + i * 260, on = hrs > 0 && hrs < 1; if (on) glow(lx, T0[1] + 57, 70, '#ECEAF8', 0.35 * k0); rr(lx - 90, T0[1] + 50, 180, 14, 7, on ? '#F4F3FA' : (TH ? '#D8D6CF' : '#4A4B52'), null, 0, k0); if (hrs > 0 && hrs < 1) { G.save(); G.globalAlpha = 0.22 * k0; const g = G.createLinearGradient(0, T0[1] + 64, 0, T0[1] + 440); g.addColorStop(0, 'rgba(255,255,255,0.6)'); g.addColorStop(1, 'rgba(255,255,255,0)'); G.fillStyle = g; G.beginPath(); G.moveTo(lx - 90, T0[1] + 64); G.lineTo(lx + 90, T0[1] + 64); G.lineTo(lx + 150, T0[1] + 440); G.lineTo(lx - 150, T0[1] + 440); G.closePath(); G.fill(); G.restore(); } }
    text('UV lamps', T0[0] + T0[2] - 40, T0[1] + 104, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: k0 });
    /* the two panels: a strip of the first colour on top, the exposed face under it */
    const white = '#F1F0EB', yel = '#DCCB8E', pw = 380, ph = 330, py = T0[1] + 190;
    [[T0[0] + 100, mix(white, yel, Math.pow(hrs, 1.3)), 'White coat, no UV data', C.mute, 'Yellowed', C.bad], [T0[0] + 600, white, 'Cerakote', C.heroText, 'No visible change', C.heroText]].forEach(([px, col, nm, nc, res, rc], i) => {
      const a = ep(t, 0.6 + i * 0.2, 1.1 + i * 0.2);
      text(nm, px, py - 22, { role: 'label', size: 21, color: nc, alpha: a });
      rr(px, py, pw, ph, 6, col, null, 0, a);
      rr(px, py, pw, 56, 6, white, null, 0, a); line(px, py + 56, px + pw, py + 56, { color: 'rgba(17,17,17,0.18)', w: 1.5, alpha: a });
      text('Before', px + 20, py + 36, { role: 'label', size: 19, color: 'rgba(17,17,17,0.55)', alpha: a });
      text(H.toLocaleString('en-US') + ' h', px + 20, py + ph - 24, { role: 'label', size: 19, color: 'rgba(17,17,17,0.55)', alpha: a, tnum: true });
      const kr = ep(t, 6.8 + i * 0.3, 7.2 + i * 0.3);
      text(res, px, py + ph + 44, { role: 'small', size: 25, weight: 800, color: rc, alpha: kr });
    });
    text('Drawn from ULX Pro owners\' reports', T0[0] + 100, py + ph + 80, { role: 'small', size: 24, weight: 600, color: C.mute, alpha: ep(t, 7.2, 7.6), maxW: pw + 40 });
    text('Cerakote QUV test, ASTM D4587', T0[0] + 600, py + ph + 80, { role: 'small', size: 24, weight: 600, color: C.mute, alpha: ep(t, 7.4, 7.8), maxW: pw + 40 });
    /* the clock */
    const cy = T0[1] + 128, cx0 = T0[0] + 100, cw = 600;
    rr(cx0, cy - 8, cw, 8, 4, C.track, null, 0, k0); rr(cx0, cy - 8, Math.max(8, cw * hrs), 8, 4, C.ink2, null, 0, k0);
    text('Hours under UV', cx0 + cw + 20, cy + 2, { role: 'label', size: 19, color: C.faint, alpha: k0 });
    /* the glance: the hours with no change, and what each maker tells you */
    const rx = 1200;
    srf_hl(t, 1.0, rx, 448, '1,000 h', { size: 150, label: 'In a UV chamber', sub: 'No visible change to Cerakote\'s film.', maxW: RM - rx });
    pill(rx, 540, 'claim', ep(t, 1.4, 1.8), { by: 'Cerakote' });
    const ty = 610, c1 = rx + 300, c2 = rx + 470, ka = ep(t, 2.4, 2.8);
    text('Published data', rx, ty, { role: 'label', size: 21, color: C.mute, alpha: ka });
    text('UV', c1, ty, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: ka }); text('Chemicals', c2, ty, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: ka });
    [['Cerakote', true, C.ink, 800], ['ULX Pro Series', false, C.ink2, 600]].forEach(([nm, ok, col, wt], i) => {
      const y = ty + 52 + i * 52, k = ep(t, 2.6 + i * 0.2, 3.0 + i * 0.2);
      line(rx, y - 34, RM, y - 34, { color: C.hair, w: 1.5, alpha: k });
      text(nm, rx, y, { role: 'small', size: 25, weight: wt, color: col, alpha: k });
      for (const cx of [c1, c2]) text(ok ? '✓' : 'None', cx, y, { font: ok ? 'disp' : 'sans', size: ok ? 30 : 24, weight: 800, color: ok ? C.heroText : C.bad, align: 'center', alpha: k });
    });
    sourceBox(t, 4.0, rx, 780, RM - rx, '{r/FinalMouse}, 2025', 'Owners of white ULX Pro Series mice: one "was known to yellow very badly".');
  }
});
