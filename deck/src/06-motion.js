/* ============================================================================================
   06-motion.js: THE MOTION KIT (revamp v2, F0a). One visual language for every slide of the film.
   The standard is handoff/revamp2/common.md (M1 to M10); the API with examples and the rules of use are in
   handoff/revamp2/KIT.md. Every function here is a pure function of slide time t (no state between frames
   except caches keyed by their inputs), and every one works on both grounds (paper TH = 1, night TH = 0).

     time ........ spring, springKeys, pressCurve, pressInfo, pressCross, beats, stagger, recount
     camera ...... cam, camFit, withCam
     the mouse ... mouseSimple, mouseFit, msBox, msAt, MS_DIMS   (one simplified Theseus, from the scan)
     rivals ...... mouseRival, rivalFit, rvBox, rvAt, RV_DIMS   (a neutral rival mouse: any mouse that isn't Theseus)
     place ....... establish, locator
     agents ...... finger, forceArrow, faultTag, fixTag   (and the deck's pointer: cursorAt)
     compare ..... abSplit, wipeTo, verdict, betterTag, heatKey
     the shot .... shotInset
     teaching .... demoPanel, scaleNote, SCALE
     flow ........ LEDGER, ledger, ledgerStrip, chapterCard2
   ============================================================================================ */

/* ================================ time ================================ */

/** A damped step from 0 to 1 that starts at t0 and overshoots the way a real spring does, then settles: snaps, rebounds,
   a trigger meeting its stop. o = { f: natural frequency in Hz (2.4), z: damping ratio (0.6: about 10 % overshoot, settled
   in about 0.45 s; 0.35 is snappy, 1 has no overshoot) }.
   e.g. const y = lerp(yUp, yDown, spring(t, 2.0, { f: 3, z: 0.45 })) */
function spring(t, t0, o = {}) {
  const u = t - t0; if (u <= 0) return 0;
  const f = o.f || 2.4, z = o.z == null ? 0.6 : o.z, w = TAU * f;
  if (z >= 1) return 1 - Math.exp(-w * u) * (1 + w * u);
  const wd = w * Math.sqrt(1 - z * z), e = Math.exp(-z * w * u);
  return 1 - e * (Math.cos(wd * u) + (z * w / wd) * Math.sin(wd * u));
}
/** A value driven through several targets by the same spring: keys = [[t, v], ...] (the first is the rest value; each
   later key steps the target at its time). Each step keeps the motion of the one before, as a real mechanism would.
   e.g. const x = springKeys(t, [[0, 0], [1.2, 40], [3.0, 0]], { f: 2, z: 0.7 }) */
function springKeys(t, keys, o = {}) {
  let v = keys[0][1];
  for (let i = 1; i < keys.length; i++) v += (keys[i][1] - keys[i - 1][1]) * spring(t, keys[i][0], o);
  return v;
}
/** How far a button is pressed, 0 → 1 → 0, for a press that starts at t0: the finger accelerates in (E.hit), the button
   bottoms out with a small rebound, holds, and its spring returns it. o = { down (0.12 s), hold (0.32 s), up (0.16 s),
   bounce (0.05: the rebound's depth at the stop) }. Use the same o for the rival and Theseus: the same press (M3).
   e.g. const d = pressCurve(t, 2.4); drawTrigger(d * travelPx) */
function pressCurve(t, t0, o = {}) {
  const dn = o.down == null ? 0.12 : o.down, hd = o.hold == null ? 0.32 : o.hold, up = o.up == null ? 0.16 : o.up, b = o.bounce == null ? 0.05 : o.bounce;
  const u = t - t0;
  if (u <= 0) return 0;
  if (u < dn) return E.hit(u / dn);
  const ub = u - dn;
  if (ub < hd) return 1 - b * Math.exp(-ub / 0.03) * Math.abs(Math.sin(TAU * ub / 0.06));
  const ur = ub - hd;
  return ur >= up ? 0 : 1 - E.out3(ur / up);
}
/** The press with its phases, for timing what the press causes (a contact, a sound, a count).
   Returns { d (as pressCurve), phase ('idle' | 'down' | 'hold' | 'up' | 'done'), tBottom, tUp, tEnd }.
   e.g. const p = pressInfo(t, 2.4); if (p.phase === 'hold') lamp(...) */
function pressInfo(t, t0, o = {}) {
  const dn = o.down == null ? 0.12 : o.down, hd = o.hold == null ? 0.32 : o.hold, up = o.up == null ? 0.16 : o.up;
  const tB = t0 + dn, tU = tB + hd, tE = tU + up, d = pressCurve(t, t0, o);
  const phase = t <= t0 ? 'idle' : t < tB ? 'down' : t < tU ? 'hold' : t < tE ? 'up' : 'done';
  return { d, phase, tBottom: tB, tUp: tU, tEnd: tE };
}
/** The time a press starting at t0 first reaches depth frac (0..1) on its way down: where a switch actuates (for the GT01,
   0.35 mm of 0.5 mm travel is 0.7). e.g. const tClick = pressCross(2.4, {}, 0.7) */
function pressCross(t0, o = {}, frac = 0.7) {
  const dn = o.down == null ? 0.12 : o.down; let lo = 0, hi = 1;
  for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (E.hit(m) < frac) lo = m; else hi = m; }
  return t0 + dn * (lo + hi) / 2;
}
/** Which beat of a slide is playing: list = [[t0, dur], ...]. Returns { i (the last beat started, -1 before the first),
   k (its progress 0..1), ks (every beat's progress) }. e.g. const B = beats(t, [[0.6, 1.2], [2.0, 2.5], [5.0, 1.0]]) */
function beats(t, list) {
  let i = -1; const ks = list.map(([a, d]) => prog(t, a, a + Math.max(1e-6, d)));
  for (let j = 0; j < list.length; j++) if (t >= list[j][0]) i = j;
  return { i, k: i < 0 ? 0 : ks[i], ks };
}
/** Item i of a set arriving one after another: its eased progress. e.g. const a = stagger(t, 1.0, i) */
function stagger(t, t0, i, step = 0.09, dur = 0.55, e = E.snap) { return ep(t, t0 + i * step, t0 + i * step + dur, e); }
/** A number re-counted from an old value to a new one (F16.1), formatted to one precision for both (G5).
   o = { dur (1.0), dec (decimals; default: as many as the longer of the two), e (E.out3) }. Returns a string with a true
   minus sign. e.g. text(recount(t, 3.0, 48, 21.3), x, y, ...) */
function recount(t, t0, from, to, o = {}) {
  const dec = o.dec != null ? o.dec : Math.max(kitDec(from), kitDec(to));
  return kitNum(lerp(+from, +to, (o.e || E.out3)(prog(t, t0, t0 + (o.dur || 1.0)))), dec);
}
function kitDec(v) { const m = /\.(\d+)/.exec(String(v)); return m ? m[1].length : 0; }
function kitNum(v, dec) { const s = Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); return (v < 0 && +s.replace(/,/g, '') !== 0 ? '−' : '') + s; }

/* ================================ camera ================================ */

/** The camera at time t: keys = [[t, cx, cy, s], ...], where (cx, cy) is the point at the centre of the box (in the
   drawing's units, mm) and s its scale (px per mm). Between two keys it moves with E.cam as a zoom about the one point that
   stays still on screen, so a push-in reads as travelling straight at the part (a pure pan falls back to a slide).
   Returns { cx, cy, s, k (progress of the move in play), i (its end key) }.
   e.g. const c = cam(t, [[0.5, 0, 0, 4], [1.7, -14, -30, 16]]) */
function cam(t, keys, e = E.cam) {
  if (t <= keys[0][0]) return { cx: keys[0][1], cy: keys[0][2], s: keys[0][3], k: 0, i: 0 };
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) { const k = e(prog(t, keys[i - 1][0], keys[i][0])); return Object.assign(camLerp(keys[i - 1], keys[i], k), { k, i }); }
  }
  const L = keys[keys.length - 1]; return { cx: L[1], cy: L[2], s: L[3], k: 1, i: keys.length - 1 };
}
/** between two camera keys [t, cx, cy, s] at progress k: a zoom about the fixed point (scale interpolated geometrically) */
function camLerp(A, B, k) {
  const sa = A[3], sb = B[3];
  if (Math.abs(sb - sa) < 1e-4 * Math.max(sa, sb)) return { cx: lerp(A[1], B[1], k), cy: lerp(A[2], B[2], k), s: lerp(sa, sb, k) };
  const s = sa * Math.pow(sb / sa, k), fx = (B[1] * sb - A[1] * sa) / (sb - sa), fy = (B[2] * sb - A[2] * sa) / (sb - sa);
  return { cx: fx - (fx - A[1]) * sa / s, cy: fy - (fy - A[2]) * sa / s, s };
}
/** The camera that fits a rectangle r = [x, y, w, h] (mm) into a stage box [x, y, w, h] (px), with pad (a fraction of the
   box kept clear round it). Returns { cx, cy, s }. e.g. const c0 = camFit(msBox('top'), box) */
function camFit(r, box, pad = 0.08) {
  const [bx, by, bw, bh] = box, s = Math.min(bw * (1 - 2 * pad) / Math.max(1e-6, r[2]), bh * (1 - 2 * pad) / Math.max(1e-6, r[3]));
  return { cx: r[0] + r[2] / 2, cy: r[1] + r[3] / 2, s };
}
/** Draw fn in a camera transform, clipped to box: inside fn, draw in mm (the part() conventions hold: lw(px) gives a line
   that stays px wide at any zoom, SP() reports stage px). fn(P, c) gets P(mx, my) → stage [x, y]. Returns P.
   o = { clip (true) }. e.g. withCam(c, box, P => mouseSimple('top', { hi: ['wheel'] })) */
function withCam(c, box, fn, o = {}) {
  const [x, y, w, h] = box, ox = x + w / 2, oy = y + h / 2;
  const P = (mx, my) => [ox + (mx - c.cx) * c.s, oy + (my - c.cy) * c.s];
  if (!XF.st.length) XF.m = [1, 0, 0, 1, 0, 0];
  xsave();
  if (o.clip !== false) { G.beginPath(); G.rect(x, y, w, h); G.clip(); }
  xmove(ox, oy); xscale(c.s); xmove(-c.cx, -c.cy);
  try { if (fn) fn(P, c); } finally { xrest(); }
  return P;
}

/* ================================ the simplified mouse ================================
   One Theseus for every whole-mouse view in the film (Brock: "a mouse that is clearly slightly simplified ... only showing
   the parts of the design that matter"). Traced, not drawn by hand: the top is the key plan's Sora outline (SORA_HALF), the
   side and the front are the 3D shell's flat twin (deck/geo2d/shell.json: body and triggers), smoothed, with the notches of
   the rear cutout and the nose closed, scaled to Theseus's 119.3 × 62.4 × 39.9 mm (F12.11). Key lines only: the one centre
   split from the nose to the straight rear cutout with the wheel in it (F9.28, F11.3, F12.9), the triggers, the wheel, the
   side buttons, the sensor window and the skates; the board and battery dashed when asked for.
   Frames, mm, y down: 'top' x = the user's right (nose up, the key plan's frame); 'bottom' x = the user's left (nose up,
   seen from below); 'left' (alias 'side') from the side-button side, nose left, y = 0 on the pad; 'right' from the other
   side, nose right; 'front' facing the nose, the user's left on the viewer's right. */
/* the scan's own proportions (the Sora scan, 119.2 × 62.5 × 38.1 mm): Brock's F12.11 "Use the numbers only" keeps the
   scanned shape and puts Theseus's 119.3 × 62.4 × 39.9 in the words (THS.dims), not in a stretched drawing (integrator, 2026-11-06) */
const MS_DIMS = { L: 119.2, W: 62.5, H: 38.1 };
/* the outlines, mm, from deck/geo2d/shell.json (tools: the kit test notes in handoff/revamp2/KIT.md): side (z forward, y up
   from the pad), front (x toward the user's left, y up); converted to each view's frame by msView */
const MS_SIDE = [[-59.32,9.19],[-59.28,9.46],[-59.11,10.01],[-58.61,11.09],[-57.74,12.66],[-56.35,14.97],[-55.52,16.22],[-53.6,18.91],[-52.3,20.55],[-51.15,21.94],[-48.7,24.57],[-47.85,25.42],[-46.96,26.22],[-43.5,29.11],[-40.64,31.29],[-39.43,32.17],[-36.68,34],[-35.65,34.61],[-34.59,35.17],[-33.25,35.84],[-31.34,36.7],[-30.23,37.15],[-28.82,37.65],[-27.39,38.09],[-25.95,38.48],[-24.5,38.83],[-22.45,39.26],[-20.67,39.51],[-18.6,39.74],[-17.41,39.82],[-15.32,39.89],[-12.62,39.9],[-10.52,39.84],[-8.73,39.74],[-6.36,39.52],[-3.98,39.27],[-2.8,39.1],[-1.03,38.79],[2.19,38.15],[3.64,37.82],[5.37,37.35],[8.83,36.48],[10.56,35.99],[13.99,34.93],[16.55,34.1],[20.51,32.76],[24.16,31.43],[25.55,30.89],[27.2,30.18],[27.71,29.9],[28.87,29.04],[29.63,28.6],[32.36,27.39],[37.25,25.12],[44.46,21.49],[45,21.26],[45.56,21.08],[46.66,20.91],[47.21,20.77],[48.01,20.42],[49.33,19.71],[51.65,18.35],[56.02,15.75],[57.53,14.78],[58.25,14.26],[58.69,13.87],[58.89,13.65],[59.24,13.18],[59.37,12.92],[59.49,12.65],[59.64,12.09],[59.69,11.51],[59.63,10.94],[59.52,10.37],[59.35,9.82],[59.24,9.57],[58.92,9.11],[58.36,8.48],[58.03,8],[55.63,3.19],[55.11,2.11],[54.84,1.59],[54.67,1.36],[54.49,1.17],[54.27,1.01],[54.03,0.89],[53.49,0.77],[52.9,0.74],[-52.1,0.73],[-53.59,0.76],[-54.16,0.86],[-54.42,0.96],[-54.66,1.09],[-54.88,1.26],[-55.08,1.46],[-55.43,1.93],[-56.03,2.96],[-57.13,5.09],[-57.56,5.88],[-58.03,6.65],[-59.02,8.14],[-59.25,8.66],[-59.3,8.92]];
const MS_SIDE_SEAM = [[[59.08,10.84],[54.86,10.85],[54.27,10.95],[53.99,11.05],[53.47,11.33],[52.49,12.04],[50.99,13.04],[50.21,13.51],[49.41,13.93],[46.72,15.18],[45.1,15.99],[43.69,16.53],[40.98,17.78],[37.95,19.13],[33.79,20.88],[30.12,22.22],[28.97,22.57],[27.54,23.05],[24.1,24.04],[21.19,24.76],[19.46,25.28],[17.75,25.89],[16.03,26.43],[13.79,27.31],[9.4,29.3],[8.27,29.69],[8,29.81],[6.4,30.66],[5.88,30.96],[5.65,31.15],[5.44,31.36],[5.27,31.59],[5.12,31.85],[5.01,32.12],[4.94,32.41],[4.9,33],[4.86,35.08],[4.97,36.88]]];
const MS_SIDE_BTN = [[[23.33,18.14],[23.22,17.93],[23.07,17.74],[22.89,17.58],[22.69,17.45],[22.47,17.36],[22.23,17.29],[21.75,17.27],[20.28,17.49],[19.3,17.7],[18.32,17.85],[17.35,18.05],[14.4,18.55],[13.42,18.76],[12.43,18.91],[11.46,19.12],[10.47,19.28],[10,19.41],[9.78,19.51],[9.59,19.65],[9.41,19.82],[9.14,20.22],[9,20.68],[8.95,21.17],[8.96,22.67],[9.03,23.16],[9.11,23.39],[9.22,23.6],[9.37,23.79],[9.54,23.95],[9.74,24.08],[9.96,24.18],[10.2,24.24],[10.68,24.26],[11.89,24.01],[14.3,23.41],[15.51,23.15],[17.69,22.62],[18.65,22.35],[20.58,21.91],[22.25,21.47],[22.7,21.28],[22.89,21.14],[23.06,20.97],[23.21,20.78],[23.32,20.56],[23.45,20.1],[23.49,19.61],[23.48,18.86],[23.41,18.37]],[[5.01,21.58],[4.93,21.35],[4.82,21.15],[4.67,20.97],[4.48,20.82],[4.27,20.72],[4.04,20.65],[3.55,20.61],[-7.74,21.2],[-8.24,21.24],[-8.73,21.32],[-8.95,21.4],[-9.16,21.52],[-9.34,21.68],[-9.48,21.87],[-9.6,22.09],[-9.67,22.32],[-9.74,22.8],[-9.75,23.56],[-9.74,25.31],[-9.67,25.8],[-9.6,26.03],[-9.49,26.25],[-9.35,26.44],[-9.18,26.6],[-8.97,26.72],[-8.75,26.8],[-8.27,26.85],[-6.56,26.74],[-5.13,26.59],[-3.18,26.45],[-1.97,26.32],[-0.24,26.2],[1.21,26.04],[2.95,25.93],[3.66,25.82],[4.13,25.72],[4.35,25.64],[4.55,25.52],[4.72,25.36],[4.86,25.16],[5.02,24.72],[5.11,24.25],[5.15,23.52],[5.14,22.52],[5.06,21.81]]];
const MS_SIDE_WHEEL = [[29.86,28.52],[30.4,28.78],[31.05,29.04],[31.71,29.27],[32.28,29.42],[32.96,29.56],[33.55,29.65],[34.14,29.7],[34.74,29.73],[35.33,29.71],[35.93,29.67],[36.52,29.6],[37.2,29.47],[37.78,29.32],[38.35,29.14],[39,28.9],[39.55,28.65],[40.08,28.38],[40.69,28.03],[41.19,27.69],[41.67,27.33],[42.14,26.94],[42.66,26.46],[43.15,25.94],[43.54,25.47],[43.91,24.99],[44.26,24.48],[44.57,23.95],[44.91,23.32],[45.22,22.67],[45.44,22.09],[45.64,21.5],[45.81,20.9],[45.52,20.97],[44.88,21.31],[44.63,21.39],[44.08,21.68],[43.87,21.75],[43.28,22.1],[42.3,22.56],[42.12,22.68],[41.42,23.05],[41.28,23.14],[40.87,23.28],[38.34,24.59],[38.14,24.71],[36.75,25.35],[36.54,25.5],[36.33,25.56],[35.5,25.92],[33.44,26.91],[33.17,27.01],[32.99,27.12],[32.78,27.19],[32.44,27.39],[32.16,27.47],[31.39,27.86],[29.79,28.49]];
const MS_FRONT = [[-31.15,6.81],[-31.05,8.29],[-30.95,10.69],[-30.8,12.47],[-30.69,14.27],[-30.25,19.32],[-30.07,20.8],[-29.95,22.59],[-29.78,24.08],[-29.58,25.26],[-29.27,26.42],[-28.74,27.82],[-28.34,28.62],[-27.86,29.38],[-27.49,29.85],[-26.68,30.74],[-26.05,31.37],[-25.37,31.97],[-24.67,32.53],[-23.69,33.22],[-22.68,33.88],[-21.9,34.32],[-20.04,35.29],[-18.15,36.19],[-17.04,36.64],[-15.07,37.38],[-12.8,38.11],[-11.07,38.55],[-8.74,39.06],[-7.86,39.23],[-5.79,39.53],[-4.31,39.69],[-2.22,39.86],[-1.03,39.9],[1.08,39.9],[1.97,39.87],[3.16,39.8],[4.95,39.64],[6.43,39.46],[8.49,39.1],[10.55,38.7],[12.29,38.26],[13.44,37.92],[15.15,37.36],[17.12,36.64],[20.12,35.3],[21.72,34.46],[22.76,33.86],[23.51,33.37],[24.96,32.31],[25.89,31.55],[26.55,30.94],[27.18,30.3],[27.76,29.61],[28.27,28.87],[28.58,28.35],[28.84,27.82],[29.44,26.46],[29.77,25.99],[30.35,25.36],[30.5,25.13],[30.62,24.87],[30.7,24.59],[30.8,24.01],[30.84,23.42],[30.87,21.92],[30.85,21.03],[30.77,20.45],[30.44,19.35],[30.39,19.07],[30.38,18.49],[30.92,11.96],[31.17,7.17],[31.19,6.28],[31.16,5.68],[31.06,5.1],[30.87,4.54],[30.6,4.01],[30.27,3.51],[29.17,2.09],[28.6,1.4],[28.39,1.21],[28.16,1.04],[27.91,0.91],[27.64,0.83],[27.06,0.75],[26.17,0.73],[-26.09,0.73],[-27.28,0.77],[-27.84,0.88],[-28.09,1],[-28.32,1.16],[-28.54,1.36],[-29.11,2.03],[-30.19,3.48],[-30.65,4.24],[-30.9,4.78],[-31,5.06],[-31.13,5.63],[-31.16,5.92],[-31.17,6.51]];
const MS_FRONT_TRIG = [[-29.01,25.27],[-28.91,25.86],[-28.7,26.73],[-28.51,27.3],[-28.27,27.84],[-27.96,28.35],[-27.61,28.84],[-27.05,29.54],[-26.45,30.2],[-26.01,30.62],[-25.56,31],[-24.83,31.53],[-24.08,32.03],[-23.02,32.58],[-21.08,33.4],[-20.24,33.72],[-18.26,34.4],[-16.54,34.93],[-14.81,35.38],[-12.48,35.93],[-10.42,36.34],[-5.98,37],[-3.3,37.28],[-1.51,37.37],[1.2,37.38],[3.59,37.27],[5.98,37.01],[9.24,36.52],[12.48,35.96],[15.97,35.11],[17.12,34.78],[20.79,33.52],[23,32.59],[23.8,32.19],[24.32,31.89],[24.82,31.55],[25.77,30.82],[26.67,30.03],[27.08,29.59],[27.64,28.9],[27.99,28.41],[28.3,27.9],[28.66,27.09],[28.84,26.52],[29.03,25.64],[29.11,25.05],[29.12,24.46],[29.05,23.57],[28.53,19.11],[28.43,18.52],[28.1,17.06],[27.94,16.5],[27.69,15.97],[27.38,15.47],[26.83,14.76],[26.21,14.12],[25.74,13.75],[24.99,13.26],[23.94,12.69],[23.12,12.31],[21.45,11.65],[20.31,11.27],[19.44,11.05],[18.85,10.95],[17.96,10.87],[17.06,10.84],[-16.9,10.84],[-18.1,10.89],[-18.69,10.95],[-19.28,11.05],[-20.44,11.36],[-22.43,12.03],[-23.8,12.62],[-25.11,13.36],[-25.61,13.69],[-26.08,14.06],[-26.71,14.69],[-27.26,15.4],[-27.71,16.16],[-27.92,16.7],[-28.07,17.28],[-28.39,18.73],[-28.52,19.62],[-29.02,23.79],[-29.05,24.38],[-29.04,24.98]];
const MS_FRONT_SPLIT = [10.84, 37.38];                                  /* the centre split, seen from the front: y from, to */
const MS_FRONT_WHEEL = [2.57, 20.72, 29.73];                            /* the wheel seen from the front: half-width, y from, to */
const MS_SIDE_WHEEL_C = [34.84, 17.83, 11.9];                           /* the wheel from the side: centre z, y, radius */
const MS_K = { x: MS_DIMS.W / 62.38, y: MS_DIMS.L / 118.99 };          /* SORA_HALF (62.38 × 118.99) to Theseus's numbers */
const MS_SKIRT = 9.3;                                                   /* the base chamfer's top edge, mm above the pad */
/* the hardware's places come from KEY_PARTS (03-parts.js, generated from the 3D assets by deck/tools/geo2d/key_parts.py),
   the one source keyPlanMM also reads (H1, 2026-11-06). These two names stay for the slides that read them */
const MS_CORNER_DOTS = KEY_PARTS.skates.pts;                            /* key plan (x = -X, y = -Z) */
const MS_BATTERY = [KEY_PARTS.battery.x, KEY_PARTS.battery.y, KEY_PARTS.battery.w, KEY_PARTS.battery.h];   /* key plan: x, y, across, along */
/** the 'battery' focus box (msBox), centred on the battery wherever KEY_PARTS puts it, the size it always had: 48 × 38 mm
   from above, 34 × 18 from the side (H5: they were typed for the 8 g pack's place, and the battery moved 7.3 mm back) */
function msBattBox(view) {
  const cy = MS_BATTERY[1] + MS_BATTERY[3] / 2;                         /* its centre, key plan y (= -mouse z) */
  if (view === 'top' || view === 'bottom') return [-24, cy - 19, 48, 38];
  const sg = view === 'right' ? 1 : -1; return [Math.min(sg * -(cy - 17), sg * -(cy + 17)), -16, 34, 18];
}
/** the things that move when the hardware moves (H1: the sensor went forward), from KEY_PARTS (03-parts.js), in scene
   coordinates: X (the user's left), Y (up), Z (nose). lens: [X0, Y0, Z0, X1, Y1, Z1]; board: [X0, Z0, X1, Z1] */
function msLive() {
  if (msLive.v) return msLive.v;
  const K = KEY_PARTS, ln = K.lens, bx = K.board.box, ns = ([x, y]) => [-x, -y];
  const v = { lens: [-ln.c[0] - ln.hw, ln.y0, -ln.c[1] - ln.hl, -ln.c[0] + ln.hw, ln.y0 + 1.1, -ln.c[1] + ln.hl],
    lensDots: K.lensDots.pts.map(ns), board: [-bx[2], -bx[3], -bx[0], -bx[1]], corner: K.skates.pts.map(ns) };
  return (msLive.v = v);
}
/** a closed outline moved inward by d mm along its normals (the base plate's edge seen from below) */
function msInset(P, d) {
  let A2 = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; A2 += a[0] * b[1] - b[0] * a[1]; }
  const sgn = A2 > 0 ? 1 : -1;   /* y is down: a positive area runs clockwise on screen, and the inside is on the right */
  return P.map((p, i) => { const a = P[(i - 1 + P.length) % P.length], b = P[(i + 1) % P.length], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [p[0] - sgn * dy / l * d, p[1] + sgn * dx / l * d]; });
}
/** a Path2D through points: straight segments (the outlines are sampled finely), or quadratic midpoints for the key plan */
function msPath(pts, close = true, smooth = false) {
  const p = new Path2D(), n = pts.length;
  if (!smooth) { pts.forEach((q, i) => i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])); if (close) p.closePath(); return p; }
  p.moveTo((pts[n - 1][0] + pts[0][0]) / 2, (pts[n - 1][1] + pts[0][1]) / 2);
  for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n]; p.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
  p.closePath(); return p;
}
function msRR(x, y, w, h, r) { const p = new Path2D(); r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2); p.moveTo(x + r, y); p.arcTo(x + w, y, x + w, y + h, r); p.arcTo(x + w, y + h, x, y + h, r); p.arcTo(x, y + h, x, y, r); p.arcTo(x, y, x + w, y, r); p.closePath(); return p; }
function msCirc(x, y, r) { const p = new Path2D(); p.arc(x, y, r, 0, TAU); return p; }
function msPoly(pts) { return msPath(pts, true); }
/** the top view's half-width at y (mm) */
function msHalfW(y) { return keyHalfW(y / MS_K.y) * MS_K.x; }
/* each view, built once: { box: [x, y, w, h] mm, out: the outline, len: its length, parts: { name: { fill, clip, lines,
   dash, solid } }, at: { name: [x, y] } }. A part's fill is clipped to the body when clip is true; lines are stroked in
   the part's colour when it is lit; dash parts are hidden features (drawn only when lit or shown) */
const MSV = {};
function msView(view) {
  if (view === 'side') view = 'left';
  if (MSV[view]) return MSV[view];
  const L = msLive(), V = { parts: {}, at: {} }, add = (n, o) => (V.parts[n] = Object.assign(V.parts[n] || {}, o));
  const len = pts => { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += Math.hypot(b[0] - a[0], b[1] - a[1]); } return s; };
  if (view === 'top' || view === 'bottom') {
    const sg = view === 'top' ? 1 : -1;                                   /* x = sg * (the key plan's x) */
    const P = KEY_PTS.map(([x, y]) => [x * MS_K.x * sg, y * MS_K.y]);
    V.outPts = P; V.out = msPath(P, true, true); V.len = len(P);
    const nose = KEY.nose * MS_K.y, tail = KEY.tail * MS_K.y, seam = KEY.seam * MS_K.y, hw = msHalfW(seam);
    V.box = [-MS_DIMS.W / 2, nose, MS_DIMS.W, tail - nose];
    const sideX = sg * -1;                                                /* the side buttons' side: the user's left */
    const lens = L.lens, lz0 = -lens[5] * MS_K.y, lz1 = -lens[2] * MS_K.y, lcy = (lz0 + lz1) / 2;
    V.at = { c: [0, 0], nose: [0, nose], tail: [0, tail], seam: [0, seam], seamL: [-sg * hw * 0.5, seam], seamR: [sg * hw * 0.5, seam],
      trigL: [-sg * 15, -30], trigR: [sg * 15, -30], wheel: [0, -38.4], split: [0, -52], hump: [0, 20], sensor: [0, lcy],
      side1: [sideX * msHalfW(-16.2), -16.2], side2: [sideX * msHalfW(2.35), 2.35], sides: [sideX * msHalfW(14), 14], rim: [sideX * msHalfW(30), 30] };
    if (view === 'top') {
      /* the one centre split, from the nose to the straight rear cutout, broken only where the wheel sits in it */
      const split = new Path2D(); split.moveTo(0, nose + 0.6); split.lineTo(0, -46.4 * MS_K.y); split.moveTo(0, -28.4 * MS_K.y); split.lineTo(0, seam);
      const rear = new Path2D(); rear.moveTo(-hw + 0.25, seam); rear.lineTo(hw - 0.25, seam);
      const rearL = new Path2D(); rearL.moveTo(-hw + 0.25, seam); rearL.lineTo(0, seam);
      const rearR = new Path2D(); rearR.moveTo(0, seam); rearR.lineTo(hw - 0.25, seam);
      add('triggers', { fill: msRR(-40, nose - 6, 80, seam - nose + 6, 0), clip: true, lines: [split, rear] });
      add('trigL', { fill: msRR(-40, nose - 6, 40, seam - nose + 6, 0), clip: true, lines: [split, rearL] });
      add('trigR', { fill: msRR(0, nose - 6, 40, seam - nose + 6, 0), clip: true, lines: [split, rearR] });
      add('seam', { lines: [split], lw: 4 });
      add('rear', { lines: [rear], lw: 4 });
      V.lines = [split, rear]; V.lineParts = ['seam', 'rear'];
    } else {
      /* from below: the base plate's edge, an inner line 2.6 mm in from the widest outline */
      const base = msPath(msInset(P, 2.6), true, true);
      V.lines = [base]; V.lineParts = ['base'];
      /* the base, to light (its face and its edge), and the board's four M2 screws driven from below (#54), at plan 5's
         mounting holes (KEY_PARTS.board.holes): drawn only when lit or shown, as the ownership chapter's part */
      add('base', { fill: base, clip: true, lines: [base] });
      const scr = new Path2D(), rec = new Path2D();
      for (const [hx, hy] of KEY_PARTS.board.holes) { const x = -hx * MS_K.x, y = hy * MS_K.y; scr.addPath(msCirc(x, y, 1.9)); rec.moveTo(x - 1.05, y); rec.lineTo(x + 1.05, y); rec.moveTo(x, y - 1.05); rec.lineTo(x, y + 1.05); }
      add('screws', { solid: scr, tread: rec, opt: true });
    }
    /* the wheel: 7 mm wide, 1 mm short of each end of its opening (keyPlanMM) */
    const [wx, wy, ww, wh] = KEY.wheel, wcx = (wx + ww / 2) * MS_K.x, wy0 = (wy + 1) * MS_K.y, wl = (wh - 2) * MS_K.y;
    if (view === 'top') {
      const tread = new Path2D(); for (let k = 0; k < 7; k++) { const ry = wy0 + (k + 0.5) * wl / 7; tread.moveTo(wcx - 3.5, ry); tread.lineTo(wcx + 3.5, ry); }
      add('wheel', { solid: msRR(wcx - 3.5, wy0, 7, wl, 3.5), tread });
    }
    /* the side buttons on the rim of the user's left: thin pills straddling the outline */
    const btns = [[-23.5, -8.9], [-5.1, 9.8]].map(([y0, y1], i) => { const ym = (y0 + y1) / 2, x0 = sideX * msHalfW(ym); return { n: 'side' + (i + 1), p: msRR(x0 - 1.6, y0 * MS_K.y, 3.2, (y1 - y0) * MS_K.y, 1.4) }; });
    if (view === 'top') { btns.forEach(b => add(b.n, { solid: b.p })); add('side', { solid: (() => { const p = new Path2D(); btns.forEach(b => p.addPath(b.p)); return p; })() }); }
    /* the sensor: the 3D shell's lens window (dashed from above, open from below) */
    const lx = sg === 1 ? -lens[3] : lens[0], lw2 = lens[3] - lens[0];
    add('sensor', view === 'top' ? { dash: [msRR(lx, lz0, lw2, lz1 - lz0, 1.6), msCirc(0, lcy, 1.8)] } : { solid: msRR(lx, lz0, lw2, lz1 - lz0, 1.6), lines: [msCirc(0, lcy, 1.8)] });
    /* the skates: the plate-off dots on the rim's ledges and the two at the lens (F20.2) */
    const dots = new Path2D();
    for (const [X, Z] of L.corner) dots.addPath(msCirc(sg * -X * MS_K.x, -Z * MS_K.y, 3.25));
    for (const [X, Z] of L.lensDots) dots.addPath(msCirc(sg * -X, -Z * MS_K.y, 3.25));
    add('skates', view === 'top' ? { dash: [dots] } : { solid: dots });
    /* hidden: the board (the 3D board's footprint) and the battery (keyPlanMM's place) */
    const bd = L.board; add('board', { dash: [msPath(KEY_PARTS.board.pts.map(([x, y]) => [sg * x * MS_K.x, y * MS_K.y]))] });   /* plan 5's outline */
    add('battery', { dash: [msRR(sg * MS_BATTERY[0] - (sg < 0 ? MS_BATTERY[2] : 0), MS_BATTERY[1], MS_BATTERY[2], MS_BATTERY[3], 2)] });
    const an = KEY_PARTS.antenna; add('antenna', { dash: [msRR(sg === 1 ? an.x : -(an.x + an.w), an.y * MS_K.y, an.w, an.h * MS_K.y, 0.5)] });
    /* regions for the shape and grip chapters */
    const hump = new Path2D(); hump.ellipse(0, 20, 16, 22, 0, 0, TAU);
    add('hump', { fill: hump, clip: true });
    add('sides', { fill: (() => { const p = new Path2D(); p.addPath(msRR(-40, -22, 15, 72, 0)); p.addPath(msRR(25, -22, 15, 72, 0)); return p; })(), clip: true });
    add('nose', { fill: msRR(-40, nose - 6, 80, 22, 0), clip: true });
    add('tail', { fill: msRR(-40, tail - 22, 80, 28, 0), clip: true });
    V.boxes = { triggers: [-34, nose - 4, 68, seam - nose + 14], trigL: [-34, nose - 4, 44, seam - nose + 14], trigR: [-10, nose - 4, 44, seam - nose + 14],
      rear: [-34, seam - 24, 68, 44], seam: [-20, nose - 4, 40, 40], wheel: [-18, -60, 36, 44], side: [sideX > 0 ? -4 : -40, -34, 44, 56], side1: [sideX > 0 ? -4 : -40, -34, 44, 38], side2: [sideX > 0 ? -4 : -40, -16, 44, 38],
      sensor: [-18, lcy - 18, 36, 36], skates: V.box, hump: [-34, -10, 68, 64], sides: V.box, nose: [-34, nose - 4, 68, 34], tail: [-34, tail - 34, 68, 38],
      board: [-26, -bd[3] * MS_K.y - 6, 52, (bd[3] - bd[1]) * MS_K.y + 12], battery: msBattBox('top'), antenna: [-18, -28, 36, 30] };
  } else if (view === 'left' || view === 'right') {
    const sg = view === 'right' ? 1 : -1, F = ([z, y]) => [sg * z, -y], P = MS_SIDE.map(F);
    V.outPts = P; V.out = msPath(P); V.len = len(P);
    const xs = P.map(p => p[0]); V.box = [Math.min(...xs), -MS_DIMS.H, Math.max(...xs) - Math.min(...xs), MS_DIMS.H];
    const seamPts = MS_SIDE_SEAM[0].map(F), seam = msPath(seamPts, false);
    /* the triggers from the side: everything above the seam line and ahead of the rear cutout */
    const reg = seamPts.concat([[seamPts[seamPts.length - 1][0], -60], [sg * 70, -60], [sg * 70, seamPts[0][1] + 0.4]]);
    add('triggers', { fill: msPoly(reg), clip: true, lines: [seam] }); add('trigL', V.parts.triggers); add('trigR', V.parts.triggers);
    const cut = seamPts.filter(p => sg * p[0] < 6.2);
    add('rear', { lines: [msPath(cut, false)], lw: 4 });
    add('wheel', { solid: msPoly(MS_SIDE_WHEEL.map(F)) });
    if (view === 'left') {
      MS_SIDE_BTN.forEach((b, i) => add('side' + (i + 1), { solid: msPoly(b.map(F)) }));
      add('side', { solid: (() => { const p = new Path2D(); MS_SIDE_BTN.forEach(b => p.addPath(msPoly(b.map(F)))); return p; })() });
    }
    const skirt = new Path2D(), xa = MS_SIDE.filter(p => Math.abs(p[1] - MS_SKIRT) < 1.2).map(p => p[0]);
    const z0 = Math.min(...xa) + 0.4, z1 = Math.max(...xa) - 0.4; skirt.moveTo(sg * z0, -MS_SKIRT); skirt.lineTo(sg * z1, -MS_SKIRT);
    V.lines = [seam, skirt]; V.lineParts = ['triggers', 'skirt'];
    const lens = L.lens, lz = (lens[2] + lens[5]) / 2;
    add('sensor', { dash: [msRR(sg * lens[2] - (sg < 0 ? lens[5] - lens[2] : 0), -5.2, lens[5] - lens[2], 5.2 - lens[1], 0.8)] });
    const sk = new Path2D(), zs = L.corner.map(c => c[1]).concat(L.lensDots.map(c => c[1]));
    for (const z of zs) sk.addPath(msRR(sg * z - 3.25, -0.74, 6.5, 0.74, 0.3));
    add('skates', { solid: sk });
    /* the board side on: its top at BOARD_TOP (5.03 mm), BOARD_T thick (0.6 mm, F47.4; both from KEY_PARTS.board, H3) */
    const bd = L.board; add('board', { dash: [msRR(Math.min(sg * bd[1], sg * bd[3]), -BOARD_TOP, Math.abs(bd[3] - bd[1]), BOARD_T, 0.3)] });
    const bt = KEY_PARTS.battery; add('battery', { dash: [msRR(Math.min(sg * -MS_BATTERY[1], sg * -(MS_BATTERY[1] + MS_BATTERY[3])), -(bt.yMid + bt.t / 2), MS_BATTERY[3], bt.t, 0.6)] });
    add('hump', { fill: msRR(sg * -45, -42, 70, 16, 0), clip: true });
    add('sides', { fill: msRR(-70, -31, 140, 31 - MS_SKIRT, 0), clip: true });
    add('nose', { fill: msRR(sg > 0 ? 40 : -70, -42, 30, 44, 0), clip: true });
    add('tail', { fill: msRR(sg > 0 ? -70 : 40, -42, 30, 44, 0), clip: true });
    const at = (z, y) => [sg * z, -y], hz = MS_SIDE.reduce((b, p) => (p[1] > b[1] ? p : b), [0, 0]);
    V.at = { c: at(0, MS_DIMS.H / 2), nose: at(59.5, 11), tail: at(-59, 9), hump: at(hz[0], hz[1]), cut: at(4.9, 37.3), trig: at(40, 23.6), tip: at(57.5, 13.4),
      wheel: at(MS_SIDE_WHEEL_C[0], MS_SIDE_WHEEL_C[1] + MS_SIDE_WHEEL_C[2]), sensor: at(lz, 0.7), base: at(0, 0), pad: at(0, 0), skateF: at(45, 0), skateR: at(-45, 0),
      side1: at(16.2, 20.4), side2: at(-2.3, 22.5), skirt: at(0, MS_SKIRT) };
    const trig = [Math.min(0, sg * 64), -44, 64, 38];
    V.boxes = { triggers: trig, trigL: trig, trigR: trig, rear: [sg * 4.9 - 20, -46, 40, 30], wheel: [sg * 34.8 - 22, -40, 44, 30],
      side: [sg * 7 - 27, -36, 54, 30], side1: [sg * 16.2 - 20, -33, 40, 26], side2: [sg * -2.3 - 20, -35, 40, 26],
      sensor: [sg * lz - 20, -18, 40, 22], skates: [V.box[0], -14, V.box[2], 18], hump: [sg * -15 - 36, -46, 72, 30], sides: V.box,
      nose: [sg > 0 ? 30 : -66, -32, 36, 36], tail: [sg > 0 ? -66 : 30, -32, 36, 36],
      board: [Math.min(sg * -12, sg * 54), -16, 66, 18], battery: msBattBox(view) };
  } else if (view === 'front') {
    const F = ([x, y]) => [x, -y], P = MS_FRONT.map(F);
    V.outPts = P; V.out = msPath(P); V.len = len(P); V.box = [-MS_DIMS.W / 2, -MS_DIMS.H, MS_DIMS.W, MS_DIMS.H];
    const oval = msPoly(MS_FRONT_TRIG.map(F)), [s0, s1] = MS_FRONT_SPLIT, [ww, w0, w1] = MS_FRONT_WHEEL;
    const split = new Path2D(); split.moveTo(0, -s0); split.lineTo(0, -w0); split.moveTo(0, -w1); split.lineTo(0, -s1);
    add('triggers', { fill: oval, clip: true, lines: [split] });
    add('trigL', { fill: msRR(0, -45, 40, 45, 0), clip: true, lines: [split], within: oval });
    add('trigR', { fill: msRR(-40, -45, 40, 45, 0), clip: true, lines: [split], within: oval });
    add('seam', { lines: [split], lw: 4 });
    add('wheel', { solid: msRR(-ww, -w1, 2 * ww, w1 - w0, 1.2) });
    const sk = new Path2D(); for (const x of [-15.5, 15.5]) sk.addPath(msRR(x - 3.25, -0.74, 6.5, 0.74, 0.3));
    add('skates', { solid: sk });
    /* the side buttons stand just proud of the left wall: the front one, and the rear one above and behind it */
    const sb = new Path2D(); sb.addPath(msRR(29.2, -23.3, 2.4, 6.8, 1.1)); sb.addPath(msRR(28.9, -25.7, 2.3, 3.6, 1.0));
    add('side', { solid: sb }); add('side1', { solid: msRR(29.2, -23.3, 2.4, 6.8, 1.1) }); add('side2', { solid: msRR(28.9, -25.7, 2.3, 3.6, 1.0) });
    add('usb', { solid: msRR(-4.47 * 0.998, -6.88 * 1.047, 8.94, 3.26 * 1.047, 1.4) });
    const skirt = new Path2D(), xa = MS_FRONT.filter(p => Math.abs(p[1] - MS_SKIRT) < 1.5).map(p => p[0]);
    skirt.moveTo(Math.min(...xa) + 0.4, -MS_SKIRT); skirt.lineTo(Math.max(...xa) - 0.4, -MS_SKIRT);
    V.lines = [oval, split, skirt]; V.lineParts = ['triggers', 'seam', 'skirt'];
    add('hump', { fill: msRR(-25, -42, 50, 6, 0), clip: true });
    add('sides', { fill: (() => { const p = new Path2D(); p.addPath(msRR(-40, -31, 13, 31 - MS_SKIRT, 0)); p.addPath(msRR(27, -31, 13, 31 - MS_SKIRT, 0)); return p; })(), clip: true });
    V.at = { c: [0, -MS_DIMS.H / 2], trigL: [14, -31.5], trigR: [-14, -31.5], wheel: [0, -w1], split: [0, -s0], side: [31, -20], usb: [0, -5.3], base: [0, 0], hump: [0, -MS_DIMS.H] };
    V.boxes = { triggers: [-34, -42, 68, 36], trigL: [-6, -42, 40, 36], trigR: [-34, -42, 40, 36], seam: [-16, -40, 32, 32], wheel: [-16, -38, 32, 26],
      side: [16, -34, 22, 26], side1: [16, -32, 22, 24], side2: [16, -34, 22, 24], usb: [-16, -16, 32, 18], skates: [-34, -10, 68, 12], hump: [-34, -44, 68, 20], sides: V.box };
  } else return msView('top');
  V.parts.shell = { fill: V.out }; V.parts.body = V.parts.shell;
  V.boxes.all = V.box; V.boxes.shell = V.box;
  return (MSV[view] = V);
}
/** a named rectangle in a view's mm frame, for a camera to push in on: msBox(view) is the whole mouse; names include
   triggers, trigL, trigR, rear (the rear cutout), wheel, side, sensor, skates, hump, nose, tail, board, battery.
   e.g. establish(t, 0, box, { view: 'top', focus: msBox('top', 'rear') }) */
function msBox(view, name) { const V = msView(view); return (name && V.boxes[name]) || V.box; }
/** a named point in a view's mm frame (nose, tail, hump, wheel, trigL, trigR, seam, cut, side1, side2, sensor, base, ...) */
function msAt(view, name) { const V = msView(view); return V.at[name] || V.at.c || [0, 0]; }
/** the colours a part can be lit in: Theseus's blue (hero), the rival's yellow (rival), a fault (bad), or neutral (ink) */
function msCol(c) { return c === 'rival' ? C.second : c === 'bad' ? C.red : c === 'ink' ? C.ink : c === 'grey' ? C.comp : (!c || c === 'hero') ? C.hero : c; }
/**
 * Draw the simplified mouse in mm at the current transform (inside part(), withCam() or establish()).
 * view: 'top' | 'bottom' | 'left' (= 'side') | 'right' | 'front'.
 * o = { hi: ['triggers', 'wheel', ...] or { triggers: 'rival', wheel: 'hero' }: parts to light; col: their colour
 *       ('hero' | 'rival' | 'bad' | 'ink' | a colour); lit (0..1): how far the light has come up; dim (0.42): the lines of
 *       unlit parts while something is lit; alpha; show: ['board', 'battery', 'sensor', 'skates', 'antenna']: hidden parts
 *       drawn dashed; reveal (0..1): the outline drawn on; fill (the body's fill); lw (outline px, 2); dimFill (0..1: the
 *       body fades toward the ground, for a push-in that hands over to a detail), hide: ['rear', 'seam', 'triggers',
 *       'skirt', 'wheel', 'side1', ...]: lines or parts left out because your own drawing replaces them }
 * Parts: shell, triggers, trigL, trigR, seam (the centre split), rear (the straight rear cutout), wheel, side, side1, side2,
 * sensor, skates, board, battery, antenna, hump, sides, nose, tail, usb (front). Not every part exists in every view.
 * Returns anchors in stage px for callouts: { at(name), P(mx, my), view }.
 * e.g. part(960, 560, 5, () => mouseSimple('top', { hi: ['rear'], col: 'rival' }))
 */
function mouseSimple(view, o = {}) {
  const V = msView(view), a0 = (o.alpha == null ? 1 : o.alpha) * PA;
  /* a chapter card's mouse, seen by the player's flight; while a flight draws it, the card leaves it to the flight */
  if (CARD2.cap) { CARD2.cap.push({ view: view === 'side' ? 'left' : view, m: XF.m.slice(), a0, o: Object.assign({}, o) }); if (CARD2.hide) return msAnchors(V, view); }
  /* a mouse a slide has declared (S({ handoff }) or S({ flight })) while the player's flight or hand-off draws it: the
     player learns it is really drawn there, and the slide leaves it to the player (CARD2.skip) */
  if (CARD2.skip) { const vv = view === 'side' ? 'left' : view; for (const e of CARD2.skip) if (e.view === vv && msSameM(e.m, XF.m)) { e.hit = { o: Object.assign({}, o), a0 }; return msAnchors(V, view); } }
  if (a0 <= 0.003) return msAnchors(V, view);
  const hiMap = {};
  if (Array.isArray(o.hi)) o.hi.forEach(n => (hiMap[n] = o.col || 'hero')); else if (o.hi && typeof o.hi === 'object') Object.assign(hiMap, o.hi); else if (typeof o.hi === 'string') hiMap[o.hi] = o.col || 'hero';
  const lit = o.lit == null ? 1 : clamp(o.lit), names = Object.keys(hiMap).filter(n => V.parts[n]), anyLit = names.length > 0 && lit > 0.001;
  const lA = o.lineA == null ? 1 : o.lineA, dimL = (anyLit ? lerp(1, o.dim == null ? 0.42 : o.dim, lit) : 1) * lA, ink = TH ? '17,17,17' : '243,242,238';
  const bodyF = o.fill || (TH ? '#FFFFFF' : '#1A1B1E'), lineC = a => `rgba(${ink},${a})`, solidF = TH ? '#E9E8E3' : '#2A2B2F';
  const show = new Set(o.show || []), hide = new Set(o.hide || []);
  G.save(); G.globalAlpha = a0; G.lineJoin = 'round'; G.lineCap = 'round';
  /* the body, flat, one step off the ground */
  G.fillStyle = bodyF; G.globalAlpha = a0 * (1 - (o.dimFill || 0)); G.fill(V.out); G.globalAlpha = a0;
  /* lit fills under the lines (a soft field of the colour, clipped to the body where the part is a region) */
  for (const n of names) {
    const p = V.parts[n], col = msCol(hiMap[n]); if (!p.fill) continue;
    G.save(); if (p.clip) G.clip(V.out); if (p.within) G.clip(p.within);
    G.globalAlpha = a0 * lit * (TH ? 0.2 : 0.26); G.fillStyle = col; G.fill(p.fill); G.restore();
  }
  /* solid features: wheel, side buttons, skates, the lens window, the port */
  for (const [n, p] of Object.entries(V.parts)) {
    if (!p.solid || (n === 'side' && V.parts.side1) || hide.has(n) || (p.opt && hiMap[n] == null && !show.has(n))) continue;
    const key = hiMap[n] != null ? n : /^side\d$/.test(n) && hiMap.side != null ? 'side' : null, on = key != null, col = on ? msCol(hiMap[key]) : null;
    G.globalAlpha = a0; G.fillStyle = on ? mix(solidF, col, lit * (TH ? 0.55 : 0.6)) : solidF; G.fill(p.solid);
    G.globalAlpha = a0 * (on ? lerp(dimL, 1, lit) : dimL); G.strokeStyle = on ? col : lineC(TH ? 0.55 : 0.5); G.lineWidth = lw(on ? 1.8 : 1.2); G.stroke(p.solid);
    if (p.tread) { G.save(); G.clip(p.solid); G.globalAlpha = a0 * dimL * 0.6; G.strokeStyle = lineC(0.35); G.lineWidth = lw(1); G.stroke(p.tread); G.restore(); }
  }
  /* key lines: seams, the skirt, the base plate's edge */
  G.globalAlpha = a0 * dimL; G.strokeStyle = lineC(TH ? 0.5 : 0.46); G.lineWidth = lw(1.3);
  (V.lines || []).forEach((l, i) => { if (!hide.has(V.lineParts && V.lineParts[i])) G.stroke(l); });
  /* hidden parts, dashed: when lit or asked for */
  for (const [n, p] of Object.entries(V.parts)) {
    if (!p.dash || !(hiMap[n] != null || show.has(n))) continue;
    const on = hiMap[n] != null, col = on ? msCol(hiMap[n]) : null;
    G.save(); G.setLineDash([lw(5), lw(4)]); G.lineWidth = lw(on ? 1.8 : 1.3); G.strokeStyle = on ? col : lineC(0.42); G.globalAlpha = a0 * (on ? lerp(dimL, 1, lit) : dimL);
    for (const d of p.dash) { if (on) { G.save(); G.globalAlpha = a0 * lit * (TH ? 0.16 : 0.22); G.fillStyle = col; G.fill(d); G.restore(); } G.stroke(d); }
    G.restore();
  }
  /* the outline, on top; drawn on with reveal */
  G.globalAlpha = a0 * lA * (anyLit && hiMap.shell == null ? lerp(1, 0.7, lit) : 1); G.strokeStyle = o.line || lineC(TH ? 0.78 : 0.7); G.lineWidth = lw(o.lw || 2);
  if (o.reveal != null && o.reveal < 1) { if (o.reveal > 0) { G.setLineDash([V.len * o.reveal, V.len * 2]); G.stroke(V.out); G.setLineDash([]); } }
  else G.stroke(V.out);
  /* lit outlines: the stretch of the body outline that bounds the part, and the part's own lines, in its colour */
  for (const n of names) {
    const p = V.parts[n], col = msCol(hiMap[n]);
    G.globalAlpha = a0 * lit; G.strokeStyle = col;
    if (n === 'shell') { G.lineWidth = lw(2.6); G.stroke(V.out); continue; }
    if (p.fill && p.clip) { G.save(); G.clip(p.fill); if (p.within) G.clip(p.within); G.lineWidth = lw(2.6); G.stroke(V.out); G.restore(); }
    if (p.lines) { G.lineWidth = lw(p.lw || 2.2); for (const l of p.lines) G.stroke(l); }
  }
  G.restore();
  return msAnchors(V, view);
}
/** the same placement: one transform as another (scale within 0.2 %, offset within 0.75 px) */
function msSameM(a, b) { const s = Math.abs(a[0]) || 1; for (let i = 0; i < 4; i++) if (Math.abs(a[i] - b[i]) > 0.002 * s) return false; return Math.abs(a[4] - b[4]) < 0.75 && Math.abs(a[5] - b[5]) < 0.75; }
function msAnchors(V, view) {
  const M = XF.m.slice(), P = (x, y) => SPm(M, x, y);
  return { view, P, at: n => P(...(V.at[n] || V.at.c || [0, 0])), box: V.box };
}
/** Draw the whole mouse fitted into a stage box [x, y, w, h] (with o.pad, a fraction, 0.06) and centred in it. Returns the
   anchors plus { s: px per mm }. o as mouseSimple. e.g. const m = mouseFit([1040, 300, 720, 520], 'left', { hi: ['side'] }) */
function mouseFit(box, view, o = {}) {
  const V = msView(view), c = camFit(V.box, box, o.pad == null ? 0.06 : o.pad), [x, y, w, h] = box;
  const r = part(x + w / 2 - c.cx * c.s, y + h / 2 - c.cy * c.s, c.s, () => mouseSimple(view, Object.assign({}, o, { alpha: 1 })), { alpha: o.alpha == null ? 1 : o.alpha });
  return Object.assign(r || {}, { s: c.s });
}

/* ================================ the rival mouse (FILM F9) ================================
   Any mouse that isn't Theseus, so the simplified mouse stays Theseus's alone ("whose mouse is whose"): a plain rounded
   body in the rival grey, sized from its dims [L, W, H], with no Theseus detail (no centre split, no rear cutout, no
   triggers, no side buttons, nothing lit). It has a wheel, skates and, when asked, its hidden parts dashed at a typical
   mouse's places (board, battery, switches, sensor), and anchors for callouts (the switches, the sensor, the cable exit).
   Its frames are mouseSimple's, so a rival drops in where Theseus was drawn: 'top' (nose up, the user's left on the left),
   'bottom' (seen from below: the user's left on the right), 'left' = 'side' (nose left), 'right' (nose right), 'front'
   (facing the nose: the user's left on the viewer's right); mm, y down; the length's middle at y = 0 (top, bottom) or
   x = 0 (sides); y = 0 on the pad in the side and front views; x = 0 on the centre line. The shape is generic on purpose
   (a full front, a slight waist, the widest point over the palm, a rear hump at o.hump): it stands for "a typical mouse",
   never for a named one's real outline. */
const RV_DIMS = [120, 63, 39];                                           /* a typical flagship: length, width, height, mm */
const RV_SK = 0.8;                                                       /* skate thickness, mm: the body stands this far off the pad */
/* the outlines, normalised. Top: the right half from the nose (y -1) to the tail (y 1), x in half-widths. Front: the right
   half from the pad's centre to the top, x in half-widths, y from the body's foot (0) to the top (1) */
const RV_TOP = [[0, -1], [0.30, -0.993], [0.56, -0.970], [0.76, -0.925], [0.88, -0.850], [0.935, -0.740], [0.945, -0.600], [0.925, -0.420], [0.905, -0.240],
  [0.915, -0.060], [0.955, 0.140], [0.990, 0.340], [1, 0.500], [0.975, 0.650], [0.900, 0.790], [0.760, 0.900], [0.540, 0.965], [0.280, 0.993], [0, 1]];
const RV_FRONT = [[0, 0], [0.60, 0], [0.84, 0], [0.885, 0.012], [0.915, 0.045], [0.94, 0.10], [0.965, 0.20], [0.988, 0.31], [1, 0.42], [0.995, 0.52], [0.975, 0.61],
  [0.935, 0.70], [0.865, 0.785], [0.765, 0.86], [0.635, 0.92], [0.48, 0.963], [0.31, 0.988], [0.15, 0.998], [0, 1]];
/* a typical mouse's places: u = the fraction of the length from the nose; x = of the half-width; heights in mm over the pad
   (parts keep their size whatever the shell's). Switches 12.8 × 5.8 mm (an Omron-size body, long axis along the mouse) */
const RV_AT = { wheel: 0.255, wheelL: 0.125, wheelW: 7, sw: 0.21, swX: 0.38, swS: [5.8, 12.8], swH: [5.6, 11.4], btn: 0.32, btnX: 0.5, grip: 0.40,
  sensor: 0.5, snH: [1.4, 4.0], cableH: 0.2, board: [0.10, 0.80, 0.70], bdH: [4.0, 5.6], battery: [0.535, 0.805, 0.40], btH: [6.6, 11.6],
  skates: [[0.035, 0.11], [0.89, 0.965]] };
/** centripetal Catmull-Rom through points (closed or open), per samples a span: a smooth outline from a few points, with
   no loops or overshoot where the points are unevenly spaced */
function rvSpline(P, closed = true, per = 5) {
  const n = P.length, at = i => closed ? P[(i % n + n) % n] : P[Math.max(0, Math.min(n - 1, i))], out = [];
  const dt = (a, b) => Math.max(1e-4, Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1])));
  const L = (a, b, ta, tb, t) => { const k = (t - ta) / (tb - ta); return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; };
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2), t1 = dt(p0, p1), t2 = t1 + dt(p1, p2), t3 = t2 + dt(p2, p3);
    for (let j = 0; j < per; j++) {
      const t = t1 + (t2 - t1) * j / per, A1 = L(p0, p1, 0, t1, t), A2 = L(p1, p2, t1, t2, t), A3 = L(p2, p3, t2, t3, t);
      out.push(L(L(A1, A2, 0, t2, t), L(A2, A3, t1, t3, t), t1, t2, t));
    }
  }
  if (!closed) out.push(P[n - 1]);
  return out;
}
/** the side profile's top line at u (0 the nose, 1 the tail): 0 at the body's foot, 1 at the hump (uh) */
function rvTop(u, uh) {
  const uf = 0.03, vf = 0.40, ut = 0.955, vt = 0.36;
  if (u <= uh) { const x = clamp((u - uf) / (uh - uf)); return vf + (1 - vf) * x * (1.1 + x * (0.8 - 0.9 * x)); }
  return 1 - (1 - vt) * Math.pow(clamp((u - uh) / (ut - uh)), 2.1);
}
function rvPath(pts, close = true) { const p = new Path2D(); pts.forEach((q, i) => i ? p.lineTo(q[0], q[1]) : p.moveTo(q[0], q[1])); if (close) p.closePath(); return p; }
function rvRR(x, y, w, h, r) { const p = new Path2D(); if (w < 0) { x += w; w = -w; } if (h < 0) { y += h; h = -h; } r = Math.min(r, w / 2, h / 2); p.moveTo(x + r, y); p.arcTo(x + w, y, x + w, y + h, r); p.arcTo(x + w, y + h, x, y + h, r); p.arcTo(x, y + h, x, y, r); p.arcTo(x, y, x + w, y, r); p.closePath(); return p; }
function rvCirc(x, y, r) { const p = new Path2D(); p.arc(x, y, r, 0, TAU); return p; }
/** a closed outline moved inward by d mm along its normals */
function rvInset(P, d) {
  let A2 = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; A2 += a[0] * b[1] - b[0] * a[1]; }
  const sg = A2 > 0 ? 1 : -1;
  return P.map((p, i) => { const a = P[(i - 1 + P.length) % P.length], b = P[(i + 1) % P.length], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [p[0] - sg * dy / l * d, p[1] + sg * dx / l * d]; });
}
/** a closed outline cut by the line y = y0, keeping the side toward the nose (keepFront) or the tail */
function rvCutY(P, y0, keepFront) {
  const out = [], inn = p => keepFront ? p[1] <= y0 : p[1] >= y0;
  for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length], ia = inn(a), ib = inn(b); if (ia) out.push(a); if (ia !== ib) out.push([a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0]); }
  return out;
}
function rvDims(o) { const d = o && o.dims; return !d ? RV_DIMS : Array.isArray(d) ? d : [d.L, d.W, d.H]; }
/* each view, built once per view, dims and hump: { view, dims, box, out, outPts, len, parts: { name: { solid, dash, cap,
   opt, lines } }, lines, lineParts, at: { name: [x, y] }, boxes: { name: [x, y, w, h] } } */
const RVV = {};
function rvView(view, o = {}) {
  if (view === 'side') view = 'left';
  if (!/^(top|bottom|left|right|front)$/.test(view)) view = 'top';
  const [L, W, H] = rvDims(o), uh = o.hump == null ? 0.58 : clamp(o.hump, 0.35, 0.75), id = [view, L, W, H, uh].join('|');
  if (RVV[id]) return RVV[id];
  const A = RV_AT, sk = RV_SK, hw = W / 2, hOf = v => sk + v * (H - sk), V = { view, dims: [L, W, H], hump: uh, parts: {}, at: {}, boxes: {} };
  const add = (n, p) => (V.parts[n] = p), plen = P => { let s = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; s += Math.hypot(b[0] - a[0], b[1] - a[1]); } return s; };
  const wTop = hOf(rvTop(A.wheel, uh)) + 1.0;                             /* the wheel stands 1 mm proud of the shell */
  const around = (x0, y0, x1, y1, m) => [Math.min(x0, x1) - m, Math.min(y0, y1) - m, Math.abs(x1 - x0) + 2 * m, Math.abs(y1 - y0) + 2 * m];
  if (view === 'top' || view === 'bottom') {
    const sg = view === 'top' ? 1 : -1, yOf = u => (u - 0.5) * L, half = RV_TOP.map(([x, y]) => [x * hw, y * L / 2]);
    const P = rvSpline(half.concat(half.slice(1, -1).reverse().map(([x, y]) => [-x, y])), true, 5);
    V.outPts = P; V.out = rvPath(P); V.len = plen(P); V.box = [-hw, -L / 2, W, L];
    const hwAt = y => { let b = 0; for (let i = 0; i < P.length; i++) { const a = P[i], c = P[(i + 1) % P.length]; if ((y - a[1]) * (y - c[1]) <= 0 && a[1] !== c[1]) b = Math.max(b, Math.abs(a[0] + (c[0] - a[0]) * (y - a[1]) / (c[1] - a[1]))); } return b; };
    const yW = yOf(A.wheel), wl = A.wheelL * L, ww = A.wheelW, ySw = yOf(A.sw), xSw = A.swX * hw, ySn = yOf(A.sensor), yG = yOf(A.grip);
    const [b0, b1, bx] = A.board, [t0, t1, tx] = A.battery;
    if (view === 'top') {
      const tread = new Path2D(); for (let k = 0; k < 5; k++) { const ry = yW - wl / 2 + (k + 0.5) * wl / 5; tread.moveTo(-ww / 2 + 0.8, ry); tread.lineTo(ww / 2 - 0.8, ry); }
      add('wheel', { solid: rvRR(-ww / 2, yW - wl / 2, ww, wl, ww / 2), lines: [tread], clipLines: true });
      add('sensor', { dash: [rvRR(-4, ySn - 5, 8, 10, 2), rvCirc(0, ySn, 1.8)] });
    } else {
      /* from below: the base plate's edge, the sensor's window, and two skates (front and rear) inside the edge */
      const base = rvInset(P, 2.6), sk3 = rvInset(P, 3.6);
      V.lines = [rvPath(base)]; V.lineParts = ['base'];
      add('sensor', { solid: rvRR(-4, ySn - 5, 8, 10, 2), lines: [rvCirc(0, ySn, 1.8)] });
      const skF = rvCutY(sk3, yOf(A.skates[0][1]), true), skR = rvCutY(sk3, yOf(A.skates[1][0]), false), s2 = new Path2D();
      s2.addPath(rvPath(skF)); s2.addPath(rvPath(skR)); add('skates', { solid: s2 });
    }
    const sws = new Path2D(); for (const sx of [-1, 1]) sws.addPath(rvRR(sx * xSw - A.swS[0] / 2, ySw - A.swS[1] / 2, A.swS[0], A.swS[1], 0.8));
    add('switches', { dash: [sws] });
    add('board', { dash: [rvRR(-bx * hw, yOf(b0), 2 * bx * hw, (b1 - b0) * L, 3)] });
    add('battery', { dash: [rvRR(-tx * hw, yOf(t0), 2 * tx * hw, (t1 - t0) * L, 2)] });
    const uL = -sg, sk0 = (A.skates[0][0] + A.skates[0][1]) / 2, sk1 = (A.skates[1][0] + A.skates[1][1]) / 2;
    V.at = { c: [0, 0], nose: [0, -L / 2], tail: [0, L / 2], cable: [0, -L / 2], wheel: [0, yW], sensor: [0, ySn], hump: [0, yOf(uh)],
      switches: [0, ySw], switchL: [uL * xSw, ySw], switchR: [-uL * xSw, ySw], btnL: [uL * A.btnX * hw, yOf(A.btn)], btnR: [-uL * A.btnX * hw, yOf(A.btn)],
      sideL: [uL * hwAt(yG), yG], sideR: [-uL * hwAt(yG), yG], battery: [0, yOf((t0 + t1) / 2)], board: [0, yOf((b0 + b1) / 2)], skateF: [0, yOf(sk0)], skateR: [0, yOf(sk1)] };
    V.boxes = { nose: [-hw - 2, -L / 2 - 4, W + 4, 0.3 * L], tail: [-hw - 2, L / 2 - 0.3 * L + 4, W + 4, 0.3 * L], wheel: [-18, yW - 22, 36, 44], cable: [-20, -L / 2 - 8, 40, 30],
      switches: [-hw - 2, ySw - 20, W + 4, 40], switchL: [uL * xSw - 16, ySw - 20, 32, 40], switchR: [-uL * xSw - 16, ySw - 20, 32, 40], sensor: [-18, ySn - 18, 36, 36],
      battery: around(-tx * hw, yOf(t0), tx * hw, yOf(t1), 6), board: around(-bx * hw, yOf(b0), bx * hw, yOf(b1), 5), hump: [-hw - 2, yOf(uh) - 22, W + 4, 44], skates: V.box };
  } else if (view === 'left' || view === 'right') {
    const sg = view === 'right' ? 1 : -1, xOf = u => sg * (0.5 - u) * L, M = ([u, v]) => [xOf(u), -hOf(v)];
    const front = [[0.045, 0], [0.022, 0.01], [0.01, 0.045], [0.003, 0.11], [0, 0.2], [0, 0.27], [0.004, 0.33], [0.014, 0.375], [0.03, 0.4]];
    const us = []; for (let i = 0; i <= 29; i++) us.push(0.06 + i * 0.03); if (!us.some(u => Math.abs(u - uh) < 0.012)) us.push(uh); us.sort((a, b) => a - b);
    const topL = us.map(u => [u, rvTop(u, uh)]), tail = [[0.955, rvTop(0.955, uh)], [0.975, 0.255], [0.99, 0.15], [0.998, 0.07], [0.993, 0.022], [0.975, 0]];
    const pad = [[0.8, 0], [0.6, 0], [0.4, 0], [0.2, 0]];
    const P = rvSpline(front.concat(topL, tail, pad).map(M), true, 4).map(([x, y]) => [x, Math.min(y, -sk)]);   /* no dip under the foot */
    V.outPts = P; V.out = rvPath(P); V.len = plen(P); V.box = [-L / 2, -H, L, H];
    /* the wheel: only its cap above the shell shows */
    const R = 0.29 * H, xw = xOf(A.wheel), cap = new Path2D(); cap.rect(-L, -3 * H, 2 * L, 6 * H); cap.addPath(V.out);
    add('wheel', { solid: rvCirc(xw, -(wTop - R), R), cap });
    const skP = new Path2D(); for (const [u0, u1] of A.skates) skP.addPath(rvRR(xOf(u0), -sk, xOf(u1) - xOf(u0), sk, 0.3));
    add('skates', { solid: skP });
    const box2 = (u0, u1, h0, h1) => rvRR(xOf(u0), -h1, xOf(u1) - xOf(u0), h1 - h0, 0.4);
    const swU = A.swS[1] / 2 / L, snU = 4 / L;
    add('switches', { dash: [box2(A.sw - swU, A.sw + swU, A.swH[0], A.swH[1])] });
    add('sensor', { dash: [box2(A.sensor - snU, A.sensor + snU, A.snH[0], A.snH[1])] });
    add('board', { dash: [box2(A.board[0], A.board[1], A.bdH[0], A.bdH[1])] });
    add('battery', { dash: [box2(A.battery[0], A.battery[1], A.btH[0], A.btH[1])] });
    const sk0 = (A.skates[0][0] + A.skates[0][1]) / 2, sk1 = (A.skates[1][0] + A.skates[1][1]) / 2, bm = (A.battery[0] + A.battery[1]) / 2, dm = (A.board[0] + A.board[1]) / 2;
    V.at = { c: [0, -H / 2], nose: [xOf(0), -hOf(0.235)], tail: [xOf(0.998), -hOf(0.12)], cable: [xOf(0), -A.cableH * H], hump: [xOf(uh), -H], wheel: [xw, -wTop],
      switch: [xOf(A.sw), -A.swH[1]], btn: [xOf(A.btn), -hOf(rvTop(A.btn, uh))], sensor: [xOf(A.sensor), 0], base: [0, 0], pad: [0, 0],
      skateF: [xOf(sk0), 0], skateR: [xOf(sk1), 0], battery: [xOf(bm), -(A.btH[0] + A.btH[1]) / 2], board: [xOf(dm), -(A.bdH[0] + A.bdH[1]) / 2] };
    V.boxes = { nose: [sg > 0 ? L / 2 - 36 : -L / 2 - 4, -H - 2, 40, H + 6], tail: [sg > 0 ? -L / 2 - 4 : L / 2 - 36, -H - 2, 40, H + 6], wheel: [xw - 22, -H - 4, 44, 30],
      cable: [xOf(0) - 20, -A.cableH * H - 14, 40, 28], switch: [xOf(A.sw) - 20, -24, 40, 26], sensor: [xOf(A.sensor) - 20, -18, 40, 22],
      battery: around(xOf(A.battery[0]), -A.btH[0], xOf(A.battery[1]), -A.btH[1], 6), board: around(xOf(A.board[0]), -A.bdH[0], xOf(A.board[1]), -A.bdH[1], 6),
      hump: [xOf(uh) - 36, -H - 4, 72, 30], skates: [-L / 2, -14, L, 18] };
  } else {
    const M = ([x, v]) => [x * hw, -hOf(v)], half = RV_FRONT.map(M);
    const P = rvSpline(half.concat(half.slice(1, -1).reverse().map(([x, y]) => [-x, y])), true, 5);
    V.outPts = P; V.out = rvPath(P); V.len = plen(P); V.box = [-hw, -H, W, H];
    /* the nose's front edge, where the buttons turn down into the front face; the wheel above it */
    const nose = new Path2D(), hn = hOf(0.33), hc = hOf(0.51); nose.moveTo(-0.86 * hw, -hn); nose.quadraticCurveTo(0, -hc, 0.86 * hw, -hn);
    V.lines = [nose]; V.lineParts = ['nose'];
    add('wheel', { solid: rvRR(-A.wheelW / 2, -wTop, A.wheelW, 4, 1.2) });
    const sx = 0.62 * hw; add('skates', { solid: rvRR(-sx, -sk, 2 * sx, sk, 0.3) });
    add('port', { solid: rvRR(-4.47, -(A.cableH * H + 1.63), 8.94, 3.26, 1.4), opt: true });
    const xSw = A.swX * hw, sws = new Path2D(); for (const s of [-1, 1]) sws.addPath(rvRR(s * xSw - A.swS[0] / 2, -A.swH[1], A.swS[0], A.swH[1] - A.swH[0], 0.6));
    add('switches', { dash: [sws] });
    add('sensor', { dash: [rvRR(-4, -A.snH[1], 8, A.snH[1] - A.snH[0], 0.6)] });
    add('board', { dash: [rvRR(-A.board[2] * hw, -A.bdH[1], 2 * A.board[2] * hw, A.bdH[1] - A.bdH[0], 0.4)] });
    add('battery', { dash: [rvRR(-A.battery[2] * hw, -A.btH[1], 2 * A.battery[2] * hw, A.btH[1] - A.btH[0], 0.6)] });
    const hb = hOf(rvTop(A.btn, uh)) - 2;
    V.at = { c: [0, -H / 2], hump: [0, -H], wheel: [0, -wTop], cable: [0, -A.cableH * H], base: [0, 0], pad: [0, 0], skateF: [0, 0],
      switches: [0, -A.swH[1]], switchL: [xSw, -A.swH[1]], switchR: [-xSw, -A.swH[1]], btnL: [A.btnX * hw, -hb], btnR: [-A.btnX * hw, -hb], sensor: [0, -A.snH[0]],
      sideL: [hw, -hOf(0.42)], sideR: [-hw, -hOf(0.42)], battery: [0, -(A.btH[0] + A.btH[1]) / 2], board: [0, -(A.bdH[0] + A.bdH[1]) / 2] };
    V.boxes = { wheel: [-16, -H - 2, 32, 26], cable: [-16, -A.cableH * H - 12, 32, 22], switches: [-hw - 2, -24, W + 4, 26], switchL: [xSw - 14, -24, 28, 26], switchR: [-xSw - 14, -24, 28, 26],
      sensor: [-16, -14, 32, 18], hump: [-hw - 2, -H - 4, W + 4, 22], skates: [-hw - 2, -10, W + 4, 12], battery: [-hw - 2, -18, W + 4, 18], board: [-hw - 2, -12, W + 4, 14] };
  }
  /* aliases, so code written against mouseSimple's anchors finds the same places on a rival */
  const al = { trigL: 'btnL', trigR: 'btnR', trig: 'btn', usb: 'cable', side: 'sideL', switchF: 'switch' };
  for (const [a, b] of Object.entries(al)) if (!V.at[a] && V.at[b]) V.at[a] = V.at[b];
  V.boxes.all = V.box; V.boxes.shell = V.box; V.boxes.body = V.box;
  return (RVV[id] = V);
}
/** the rival's colours: the outline (grey by default; the one rival you name in yellow), its quiet lines, body and solids */
function rvCols(col) {
  const grey = !col || col === 'grey' || col === 'comp';
  const out = grey ? mix(C.comp, C.mute, 0.4) : col === 'rival' ? C.second : col === 'bad' ? C.red : col === 'ink' ? C.ink2 : col;
  return { out, line: mix(C.comp, C.mute, 0.4), body: mix(C.bg, C.comp2, 0.5), solid: mix(C.comp2, C.comp, TH ? 0.15 : 0.3) };
}
function rvAnchors(V) {
  const M = XF.m.slice(), P = (x, y) => SPm(M, x, y);
  return { view: V.view, P, at: n => P(...(V.at[n] || V.at.c || [0, 0])), box: V.box, pts: V.outPts, dims: V.dims };
}
/**
 * Draw a rival mouse in mm at the current transform (inside part(), withCam() or establish's draw), in mouseSimple's frames.
 * view: 'top' | 'bottom' | 'left' (= 'side') | 'right' | 'front'.
 * o = { dims ([L, W, H] mm, default RV_DIMS: a typical 120 × 63 × 39), hump (0.58: where the hump peaks, a fraction of the
 *   length from the nose; side views), col ('grey' (default, C.comp's family) | 'rival' (the one rival you name, C.second) |
 *   'bad' (only when the whole body is the fault) | 'ink' | a colour: the outline), show: ['board', 'battery', 'switches',
 *   'sensor', 'port']: hidden parts dashed (the port is drawn solid, front view), hide: ['wheel', 'skates', 'sensor', 'base',
 *   'nose'], fill (the body), line (the outline's colour), lw (outline px, 2), alpha, lineA, reveal (0..1, the outline
 *   drawn on), dimFill (0..1) }
 * Anchors (m.at(name)): c, nose, tail, hump, wheel, sensor, cable (the cable exit), switchL, switchR, switches (top, bottom,
 *   front; switch in the side views: the main switches' tops), btnL, btnR (btn: where a finger presses; trigL, trigR, trig
 *   answer too), sideL, sideR, battery, board, skateF, skateR, base / pad. rvBox(view, name, o) is a part's focus rectangle.
 * Returns { view, P(mx, my), at(name), box, pts (the outline, mm), dims }.
 * e.g. part(960, 560, 4, () => mouseRival('right', { dims: [126, 64, 40], show: ['switches'] }))
 */
function mouseRival(view, o = {}) {
  const V = rvView(view, o), a0 = (o.alpha == null ? 1 : o.alpha) * PA;
  if (a0 <= 0.003) return rvAnchors(V);
  const lA = o.lineA == null ? 1 : o.lineA, cs = rvCols(o.col), show = new Set(o.show || []), hide = new Set(o.hide || []);
  G.save(); G.lineJoin = 'round'; G.lineCap = 'round';
  /* the body, flat */
  G.globalAlpha = a0 * (1 - (o.dimFill || 0)); G.fillStyle = o.fill || cs.body; G.fill(V.out);
  /* its features: the wheel (in the side views only its cap above the shell), the skates, the sensor's window from below */
  for (const [n, p] of Object.entries(V.parts)) {
    if (!p.solid || hide.has(n) || (p.opt && !show.has(n))) continue;
    G.save(); if (p.cap) G.clip(p.cap, 'evenodd');
    G.globalAlpha = a0; G.fillStyle = cs.solid; G.fill(p.solid);
    G.globalAlpha = a0 * lA * 0.9; G.strokeStyle = cs.line; G.lineWidth = lw(1.3); G.stroke(p.solid);
    if (p.lines) { if (p.clipLines) G.clip(p.solid); G.globalAlpha = a0 * lA * 0.55; G.lineWidth = lw(1); for (const l of p.lines) G.stroke(l); }
    G.restore();
  }
  /* quiet lines: the base plate's edge (from below), the nose's front edge (from the front) */
  if (V.lines) { G.globalAlpha = a0 * lA * 0.6; G.strokeStyle = cs.line; G.lineWidth = lw(1.2); V.lines.forEach((l, i) => { if (!hide.has(V.lineParts[i])) G.stroke(l); }); }
  /* hidden parts, dashed, when asked for */
  for (const [n, p] of Object.entries(V.parts)) {
    if (!p.dash || !show.has(n)) continue;
    G.save(); G.setLineDash([lw(5), lw(4)]); G.lineWidth = lw(1.3); G.strokeStyle = cs.line; G.globalAlpha = a0 * lA * 0.9;
    for (const d of p.dash) G.stroke(d);
    G.restore();
  }
  /* the outline, on top; drawn on with reveal */
  G.globalAlpha = a0 * lA; G.strokeStyle = o.line || cs.out; G.lineWidth = lw(o.lw || 2);
  if (o.reveal != null && o.reveal < 1) { if (o.reveal > 0) { G.setLineDash([V.len * o.reveal, V.len * 2]); G.stroke(V.out); G.setLineDash([]); } }
  else G.stroke(V.out);
  G.restore();
  return rvAnchors(V);
}
/** A rival fitted into a stage box [x, y, w, h] (o.pad, a fraction, 0.06) and centred in it, as mouseFit does for Theseus.
   Returns the anchors plus { s: px per mm }. o as mouseRival.
   e.g. const m = rivalFit([80, 300, 420, 560], 'top', { show: ['switches', 'sensor'] }); callout(t, 1, m.at('switchL'), 'Optical switch') */
function rivalFit(box, view, o = {}) {
  const V = rvView(view, o), c = camFit(V.box, box, o.pad == null ? 0.06 : o.pad), [x, y, w, h] = box;
  const r = part(x + w / 2 - c.cx * c.s, y + h / 2 - c.cy * c.s, c.s, () => mouseRival(view, o));
  return Object.assign(r || {}, { s: c.s });
}
/** a rival's focus rectangle (mm) for a push-in or a crop: no name, the whole mouse; names: nose, tail, wheel, cable,
   switches, switchL, switchR (switch in the side views), sensor, battery, board, hump, skates. o: { dims, hump } */
function rvBox(view, name, o = {}) { const V = rvView(view, o); return (name && V.boxes[name]) || V.box; }
/** a rival's named point (mm), as mouseRival's anchors. o: { dims, hump } */
function rvAt(view, name, o = {}) { const V = rvView(view, o); return V.at[name] || V.at.c; }

/* ================================ place: establish, then push in (M4) ================================ */

/**
 * The opening move of a part-level slide: the whole simplified mouse in box with the part lit, then one continuous push-in
 * to the part, then a small locator in a corner (M4). Frame one already shows the mouse (M6).
 * box = [x, y, w, h] stage px. o = { view ('top'), hi (parts to light), col ('hero'), focus (a part name or [x, y, w, h] mm;
 *   default the first lit part), hold (0.4: the whole mouse before the push), dur (1.0: the push), pad (0.08), fpad (0.06),
 *   fade (0.4: how far the mouse's lines dim once pushed in, so the detail leads), dimFill (0..1: the body fades too),
 *   locator ('tr' | 'tl' | 'br' | 'bl' | false), locW, mouse (more mouseSimple options), draw(P, c, k): more drawing in
 *   the same camera (mm), on top of the mouse }
 * Returns { P (mm → stage px), s (px per mm), k (push 0..1), kd (0..1: when to bring in your detail), cam, box, done,
 *   draw(fn): draw fn(P, c) in this camera, clipped to box }.
 * e.g. const est = establish(t, 0, [80, 240, 1100, 720], { view: 'top', hi: ['rear'], focus: 'rear' })
 */
function establish(t, t0, box, o = {}) {
  const view = o.view || 'top', V = msView(view), hold = o.hold == null ? 0.4 : o.hold, dur = o.dur == null ? 1.0 : o.dur;
  const hiN = Array.isArray(o.hi) ? o.hi[0] : o.hi && typeof o.hi === 'object' ? Object.keys(o.hi)[0] : o.hi;
  const fr = typeof o.focus === 'string' ? msBox(view, o.focus) : Array.isArray(o.focus) ? o.focus : msBox(view, hiN);
  const A = camFit(V.box, box, o.pad == null ? 0.08 : o.pad), B = camFit(fr, box, o.fpad == null ? 0.06 : o.fpad);
  const c = cam(t, [[t0 + hold, A.cx, A.cy, A.s], [t0 + hold + dur, B.cx, B.cy, B.s]]);
  const k = t <= t0 + hold ? 0 : c.k, kf = ep(t, t0 + hold + dur * 0.45, t0 + hold + dur);
  const kd = ep(t, t0 + hold + dur * 0.55, t0 + hold + dur + 0.15);
  const mo = Object.assign({ hi: o.hi, col: o.col, lit: ep(t, t0 + 0.12, t0 + 0.55) }, o.mouse || {});
  mo.lineA = (mo.lineA == null ? 1 : mo.lineA) * lerp(1, o.fade == null ? 0.4 : o.fade, kf);
  if (o.dimFill) mo.dimFill = o.dimFill * kf;
  const P = withCam(c, box, (Pm, cc) => { mouseSimple(view, mo); if (o.draw) o.draw(Pm, cc, k); });
  if (o.locator !== false) {
    const corner = o.locator || 'tr', LV = msView(view);
    const lwid = o.locW || (view === 'top' || view === 'bottom' ? 74 : view === 'front' ? 120 : 176), lh = lwid * LV.box[3] / LV.box[2], m = 36;
    const lx = corner[1] === 'l' ? box[0] + m : box[0] + box[2] - m - lwid, ly = corner[0] === 'b' ? box[1] + box[3] - m - lh : box[1] + m;
    locator(t, t0 + hold + dur * 0.7, lx, ly, lwid, view, fr, { hi: o.hi, col: o.col });
  }
  return { P, s: c.s, k, kd, cam: c, box, done: k >= 1, draw: fn => withCam(c, box, fn) };
}
/**
 * The small "you are here": the mouse's outline at width w (top-left at x, y), the part lit, a box on the focus (mm, in the
 * same view's frame). Fades in from t0. o = { hi, col, a }.
 * e.g. locator(t, 1.4, 1700, 260, 74, 'top', msBox('top', 'rear'), { hi: ['rear'] })
 */
function locator(t, t0, x, y, w, view, focus, o = {}) {
  const a = ep(t, t0, t0 + 0.4) * (o.a == null ? 1 : o.a); if (a <= 0.003) return 0;
  const V = msView(view), s = w / V.box[2], h = V.box[3] * s, ox = x - V.box[0] * s, oy = y - V.box[1] * s, pd = 14;
  /* a small tile behind it, so it reads over whatever the push-in shows */
  G.save(); G.globalAlpha = a * 0.94; rrPath(x - pd, y - pd, w + pd * 2, h + pd * 2, TILE.r); G.fillStyle = C.panel; G.fill(); G.restore();
  part(ox, oy, s, () => {
    mouseSimple(view, { hi: o.hi, col: o.col, lw: 1.5, dim: 0.6, fill: TH ? '#F7F6F2' : '#1E1F22' });
    if (focus) { G.save(); G.strokeStyle = C.hero; G.lineWidth = lw(2); G.globalAlpha = PA; G.strokeRect(focus[0], focus[1], focus[2], focus[3]); G.restore(); }
  }, { alpha: a });
  return h + pd * 2;
}

/* ================================ agents and forces ================================ */

/* ---------------------------------------- the finger (FG, F49.1) ----------------------------------------
   Brock, 2026-11-06 10:06: "the fingers look really bad right now". Rebuilt from one anatomical model, every view drawn from
   it, so the side, the top and the end views always agree (options sheet: /home/claude/work/fg/sheets/fg_options.png; his
   pick at ~12:10: "A Line"). The model: the finger's side silhouette (a smooth curve through measured landmarks), its width
   seen from above, and between them a generalised cylinder (each section a superellipse) with the nail as a plate on its
   back. Side and top views are its silhouettes; the end view projects it pitched toward the viewer, so the nail shows
   foreshortened on top, as a front view of a finger on a button sees it. The distal joint is a little flexed, as a finger
   on a mouse is, so only the fingertip's pad reaches the surface. Pressing moves the rigid part (bone and nail) toward the
   surface by the pad's compression and lays what would pass the surface onto it, the skin beside it bulging a little.
   Sizes (adult index, drawn so its DIP joint is 16 mm across, i.e. AIST's means x 1.03):
   - AIST Japanese hand dimension data (Kouchi 2012; 327 men): index breadth at the DIP joint 15.6 mm, at mid-nail 13.9,
     depth at the DIP 13.0, nail base to fingertip 14.2, nail breadth 10.9; thumb IP joint breadth 20.1, depth 17.3, nail
     base to tip 15.7, nail breadth 14.7, tip breadth at mid-nail 17.4 (https://www.airc.aist.go.jp/dhrt/hand/data/list.html).
   - Dandekar, Raju & Srinivasan 2003: fingertips typically 16 to 20 mm across (research/FILLS.md b02-1).
   - The press: 1.7 to 2.0 mm of pulp compression at a firm tap's peak, 2.3 to 4.3 N (Jindrich, Zhou, Becker & Dennerlein
     2003, J Biomech 36: 497-503, Table 1); a contact about 10 mm long, about 1 cm2, at 1 N (Serhat, Vardar & Kuchenbecker
     2022, PLoS ONE 17: e0269722). press 1 = 1.5 mm, which flattens about 10 mm of the pad.
   FG2 (Brock 13:18, "the nails on them don't look quite right still"; his pick: "A Soft"): the nail redrawn as a real one
   sits (a U-shaped cuticle, a rounded free edge, its sides under the folds, a thin plate from the side, in the skin's own
   greys with no outline of its own; sheet /home/claude/work/fg2/fg2_nail_options_1351_a.png), and the tip reads round:
   the shadow wraps round it in every view (the end view's light/shadow line found on the model), the pressed pad rolls
   onto the surface with no corner. */
const FINGER = { w: 14.3, top: 16, style: 'A line' };   /* the fingertip's breadth at the nail and at the joint, mm (kept for old readers) */
/** monotone cubic (Fritsch-Carlson) through [[x, y], ...] sorted by x; linear beyond the ends */
function fngMono(pts) {
  const n = pts.length, xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), d = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], h = a * a + b * b;
    if (h > 9) { const t = 3 / Math.sqrt(h); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return x => {
    if (x <= xs[0]) return ys[0] + m[0] * (x - xs[0]); if (x >= xs[n - 1]) return ys[n - 1] + m[n - 1] * (x - xs[n - 1]);
    let i = 0; while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}
/** centripetal Catmull-Rom through pts (open), k samples per segment */
function fngCR(pts, k = 8) {
  const out = [], P = [pts[0].map((v, i) => 2 * v - pts[1][i]), ...pts, pts[pts.length - 1].map((v, i) => 2 * v - pts[pts.length - 2][i])];
  const td = (a, b) => Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1]), 0.5) || 1e-4;
  for (let i = 1; i < P.length - 2; i++) {
    const p0 = P[i - 1], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2], t0 = 0, t1 = td(p0, p1), t2 = t1 + td(p1, p2), t3 = t2 + td(p2, p3);
    for (let j = 0; j < k; j++) {
      const t = t1 + (t2 - t1) * j / k, L = (a, b, ta, tb) => a.map((v, q) => (tb - t) / (tb - ta) * v + (t - ta) / (tb - ta) * b[q]);
      const A1 = L(p0, p1, t0, t1), A2 = L(p1, p2, t1, t2), A3 = L(p2, p3, t2, t3), B1 = L(A1, A2, t0, t2), B2 = L(A2, A3, t1, t3);
      out.push(L(B1, B2, t1, t2));
    }
  }
  out.push(pts[pts.length - 1].slice());
  return out;
}

/* the digits, in mm. u: back from the tip along the distal phalanx's axis. h: height above the pad's lowest point.
   side: the silhouette from the far end along the back to the tip, round the tip and back along the pad (u, h);
   hw: half-width from above (the tip's rounding a superellipse over cap mm); nail: free edge and cuticle u, its
   half-width along it, the height of its curvature seen from the side (fold), the lunula's size; dip: the joint's u;
   belly: the pad's centre (the top view's contact); flex: the joint's bend, radians (the proximal part rises). */
/* the digits, in mm. u: back from the tip along the distal phalanx's axis. h: height above the pad's lowest point.
   side: the silhouette from the far end along the back to the tip, round the tip and back along the pad (u, h);
   hw: half-width from above (the tip's rounding a superellipse over cap mm); dip: the joint's u; belly: the pad's centre
   (the top view's contact); flex: the joint's bend, radians (the proximal part rises).
   nail (FG2, Brock 13:18 "the nails on them don't look quite right still"): the plate as a real one sits. free: its free
   edge's middle, mm back from the tip; corner: where the free edge turns into the sides; hw: its visible half-width between
   the lateral folds (they hide its edges); cut: the cuticle's middle, the cuticle a U (half an ellipse sag mm deep, tangent
   to the sides); p: the free edge's roundness (a superellipse quadrant, tangent to the sides); smile: the paler free edge
   out to the onychodermal band, mm at the middle and added at the corners; lunula (the thumb shows its own).
   Index: 12.7 mm from cuticle to free edge, 10.3 mm visible across (72 % of the 14.3 mm tip), the cuticle's U 2.75 mm deep,
   curved across at about 9 mm radius (Ha et al., "Fingernail configuration", Arch Plast Surg 2015, 42: 753-760: men's index
   nail 12.3 wide x 13.0 long, transverse radius 8.9 mm; thumb 15.2 x 14.7, radius 11.4); its cuticle 7 mm ahead of the
   joint's crease (AIST: nail base to fingertip 14.2 mm x 1.03, the joint 21.9 mm back). */
const FNG_DIG = {
  index: {
    side: [[62, 16.0], [50, 15.0], [42, 14.15], [35, 13.65], [29, 13.55], [25.5, 13.75], [22.6, 14.05], [20.8, 13.85], [18.5, 13.25],
      [16.2, 12.65], [14.6, 12.3], [11.5, 11.8], [8.5, 11.4], [6.0, 10.95], [3.6, 10.35], [2.2, 9.75], [1.25, 9.05], [0.6, 8.1], [0.2, 6.9],
      [0.0, 5.6], [0.08, 4.5], [0.4, 3.5], [0.95, 2.55], [1.75, 1.7], [2.85, 0.95], [4.15, 0.42], [5.6, 0.1], [7.2, 0.0], [9.5, 0.05], [12.5, 0.2],
      [15.5, 0.4], [18.4, 0.62], [20.6, 0.9], [21.9, 1.25], [23.0, 1.2], [24.4, 0.88], [27, 0.55], [32, 0.4], [40, 0.55], [50, 0.8], [62, 1.1]],
    hw: [[6.0, 6.95], [8.5, 7.15], [12, 7.3], [14.6, 7.45], [18, 7.7], [21.5, 8.0], [25, 7.8], [30, 7.75], [36, 7.95], [42, 8.4], [48, 9.0], [62, 9.4]],
    cap: 6.0, capP: 2.25,
    nail: { free: 1.9, corner: 3.4, cut: 14.6, sag: 2.75, p: 1.9, hw: [[3.4, 4.95], [5.5, 5.15], [8.5, 5.13], [10.5, 5.0], [11.85, 4.87]], smile: [0.5, 0.4], lunula: 0 },
    dip: 21.9, belly: 7.2, flex: 0.2
  },
  thumb: {
    side: [[68, 19.8], [54, 18.7], [46, 18.15], [39, 18.3], [34.5, 18.8], [31.2, 19.25], [28.6, 18.9], [25, 17.9], [21, 16.6], [18.4, 15.9],
      [16.2, 15.45], [13, 14.9], [9.5, 14.4], [6.5, 13.8], [4.2, 13.05], [2.6, 12.25], [1.5, 11.25], [0.7, 9.95], [0.22, 8.45], [0.0, 7.0],
      [0.07, 5.8], [0.42, 4.6], [1.1, 3.4], [2.1, 2.3], [3.4, 1.38], [5.0, 0.66], [6.8, 0.18], [8.8, 0.0], [11.5, 0.06], [15, 0.3], [19, 0.62],
      [23, 0.98], [27, 1.38], [29.6, 1.85], [30.8, 1.75], [32.6, 1.35], [36, 1.0], [44, 1.0], [54, 1.25], [68, 1.7]],
    hw: [[7.8, 8.55], [10, 8.9], [13, 9.15], [16.5, 9.4], [21, 9.75], [26, 10.15], [30.5, 10.35], [34, 10.1], [40, 10.0], [48, 10.5], [68, 11.3]],
    cap: 7.8, capP: 2.35,
    nail: { free: 2.4, corner: 4.3, cut: 16.2, sag: 3.3, p: 1.9, hw: [[4.3, 6.85], [7.0, 7.12], [10.0, 7.08], [12.9, 6.78]], smile: [0.6, 0.45], lunula: 1 },
    dip: 30.2, belly: 8.8, flex: 0.14
  }
};
const FNG_CACHE = {};
function fngGeo(dig) {
  if (FNG_CACHE[dig]) return FNG_CACHE[dig];
  const D = FNG_DIG[dig] || FNG_DIG.index;
  /* the side silhouette, sampled: split at the tip's most forward point into the back and the pad */
  const sil = fngCR(D.side, 10);
  let it = 0; sil.forEach((p, i) => { if (p[0] < sil[it][0]) it = i; });
  const back = sil.slice(0, it + 1).map(p => [p[0], p[1]]), pad = sil.slice(it).map(p => [p[0], p[1]]);
  const interp = arr => { const a = arr.slice().sort((p, q) => p[0] - q[0]); return u => { if (u <= a[0][0]) return a[0][1]; for (let i = 1; i < a.length; i++) if (a[i][0] >= u) { const f = (u - a[i - 1][0]) / (a[i][0] - a[i - 1][0] || 1); return a[i - 1][1] + f * (a[i][1] - a[i - 1][1]); } return a[a.length - 1][1]; }; };
  const top = interp(back), bot = interp(pad), hwB = fngMono(D.hw);
  const hw = u => { if (u <= 0) return 0; if (u >= D.cap) return hwB(u); const k = 1 - u / D.cap; return hwB(D.cap) * Math.pow(1 - Math.pow(k, D.capP), 1 / D.capP); };
  const g = { D, sil, top, bot, hw, tipH: sil[it][1] };
  /* the nail's outline in (u, z): its visible half-width W(u) (the free edge a superellipse quadrant tangent to the sides,
     the sides between the folds, the cuticle's U half an ellipse tangent to them), and the same edges as u of z */
  const N = D.nail, nhw = fngMono(N.hw);
  g.nhw = nhw; g.corner = N.corner; g.zc = nhw(N.corner); g.ua = N.cut - N.sag; g.w0 = nhw(g.ua);
  g.W = u => {
    if (u <= N.free || u >= N.cut) return 0;
    if (u < N.corner) { const q = (N.corner - u) / (N.corner - N.free); return g.zc * Math.pow(Math.max(0, 1 - Math.pow(q, N.p)), 1 / N.p); }
    if (u <= g.ua) return nhw(u);
    const q = (u - g.ua) / N.sag; return g.w0 * Math.sqrt(Math.max(0, 1 - q * q));
  };
  g.freeAt = z => { const r = Math.min(1, Math.abs(z) / g.zc); return N.corner - (N.corner - N.free) * Math.pow(Math.max(0, 1 - Math.pow(r, N.p)), 1 / N.p); };
  g.cutAt = z => { const r = Math.min(1, Math.abs(z) / g.w0); return g.ua + N.sag * Math.sqrt(Math.max(0, 1 - r * r)); };
  /* a section at u: the heights of its top and its bottom at lateral offset z (superellipses, flatter on top) */
  g.sec = (u, z) => { const b = hw(u); if (b <= 1e-4 || Math.abs(z) >= b) return null; const t = top(u), bo = bot(u), hc = bo + (t - bo) * 0.52, r = Math.abs(z) / b;
    return [hc + (t - hc) * Math.pow(1 - Math.pow(r, 2.05), 1 / 2.05), hc - (hc - bo) * Math.pow(1 - Math.pow(r, 2.3), 1 / 2.3)]; };
  g.secTop = (u, z) => { const r = g.sec(u, z); return r ? r[0] : top(u); };
  /* the joint's flexion: a point (X = -u, Y = -h) of the straight finger turned about the joint's centre by up to flex, the
     middle phalanx toward the palm (in the fingertip's frame it drops below the fingertip's axis; the knuckle stands out) */
  g.bender = flex => {
    const J = [-D.dip, -(top(D.dip) + bot(D.dip)) / 2];
    return p => { const u = -p[0], th = flex * (u <= D.dip - 3.2 ? 0 : u >= D.dip + 3.2 ? 1 : (q => q * q * (3 - 2 * q))((u - D.dip + 3.2) / 6.4)); if (th === 0) return p;
      const c = Math.cos(-th), s = Math.sin(-th), x = p[0] - J[0], y = p[1] - J[1]; return [J[0] + x * c - y * s, J[1] + x * s + y * c]; };
  };
  FNG_CACHE[dig] = g;
  return g;
}

/** the nail in the finger's (u, z), shared by the top and end views so the two always agree: its outline; the paler free
    edge; the lunula (the thumb's); the fold: one line round its sides and the cuticle's U where the skin folds over it (the
    free edge has none); the proximal fold's soft crease behind the cuticle; the highlight's line on either side (s = -1, 1);
    the hyponychium's shadow under the free edge */
function fngNail(dig) {
  const g = fngGeo(dig), N = g.D.nail, K = 28, out = [];
  for (let i = 0; i <= K; i++) { const z = g.zc * Math.sin(-Math.PI / 2 + Math.PI * i / K); out.push([g.freeAt(z), z]); }
  for (let u = N.corner + 0.25; u < g.ua - 0.05; u += 0.25) out.push([u, g.nhw(u)]);
  for (let i = 0; i <= K; i++) { const th = Math.PI * i / K; out.push([g.ua + N.sag * Math.sin(th), g.w0 * Math.cos(th)]); }
  for (let u = g.ua - 0.25; u > N.corner + 0.05; u -= 0.25) out.push([u, -g.nhw(u)]);
  const zs = g.zc, sm = z => N.smile[0] + N.smile[1] * Math.pow(Math.abs(z) / g.zc, 2), free = [];
  for (let i = 0; i <= K; i++) { const z = zs * Math.sin(-Math.PI / 2 + Math.PI * i / K); free.push([g.freeAt(z) - 0.05, z]); }
  for (let i = K; i >= 0; i--) { const z = zs * Math.sin(-Math.PI / 2 + Math.PI * i / K); free.push([g.freeAt(z) + sm(z), z]); }
  const lun = [];
  if (N.lunula > 0) { const wl = g.w0 * 0.8, ld = 2.3 * N.lunula;
    for (let i = 0; i <= 20; i++) { const z = -wl + 2 * wl * i / 20; lun.push([g.cutAt(z) - ld * Math.sqrt(Math.max(0, 1 - (z / wl) * (z / wl))), z]); }
    for (let i = 20; i >= 0; i--) { const z = -wl + 2 * wl * i / 20; lun.push([g.cutAt(z) + 0.1, z]); } }
  /* the fold: from the left corner back along the side, round the U, forward along the right side */
  const fold = [], uf0 = N.corner - 0.3 * (N.corner - N.free), e = 0.03;
  for (let u = uf0; u < g.ua - 0.05; u += 0.25) fold.push([u, -(g.W(u) + e)]);
  for (let i = 0; i <= K; i++) { const th = Math.PI * (1 - i / K); fold.push([g.ua + (N.sag + e) * Math.sin(th), (g.w0 + e) * Math.cos(th)]); }
  for (let u = g.ua - 0.05; u >= uf0; u -= 0.25) fold.push([u, g.W(u) + e]);
  const pfold = [], wp = g.w0 * 0.78;
  for (let i = 0; i <= 16; i++) { const z = -wp + 2 * wp * i / 16; pfold.push([g.cutAt(z * 1.05) + 1.7, z]); }
  const hl = sg => { const l = []; for (let u = N.free + 2.1; u <= g.ua - 0.2; u += 0.4) l.push([u, sg * 0.42 * Math.min(g.W(u), g.w0)]); return l; };
  const um = (N.free + N.cut) / 2, cross = [[um, -g.nhw(um)], [um, g.nhw(um)]];
  return { out, free, lun, fold, pfold, hl, zs, sm, cross };
}

/* ------------------------------ the views, as outlines in the finger's frame ------------------------------
   Frame: X = -u (the tip toward +X), Y = -h (the back up = -Y). Each returns { body (closed), nail (closed), free (the
   free edge's band), lun, fold (the skin's edge round the nail), hl (its highlight's line), lines (creases), term (the
   light/shadow line), flat: [X0, X1] (the contact), far: the far end's centre, axis: the finger's direction there (for
   the fade), tipAx: the fingertip's own direction (the shading wraps round the tip about it) }. */

/** round a corner of an outline: the points within r mm either side of pts[i] give way to a quadratic through it */
function fngRound(pts, i, r) {
  const n = pts.length; if (!(i > 0 && i < n - 1) || !(r > 0)) return pts;
  const walk = dir => { let acc = 0, j = i; for (;;) { const k = j + dir; if (k < 0 || k >= n) return { j, q: pts[j] };
    const d = Math.hypot(pts[k][0] - pts[j][0], pts[k][1] - pts[j][1]); if (acc + d >= r) { const f = (r - acc) / (d || 1); return { j, q: [pts[j][0] + (pts[k][0] - pts[j][0]) * f, pts[j][1] + (pts[k][1] - pts[j][1]) * f] }; } acc += d; j = k; } };
  const a = walk(-1), b = walk(1), C = pts[i], seg = [];
  for (let k = 0; k <= 10; k++) { const t = k / 10, v = 1 - t; seg.push([v * v * a.q[0] + 2 * v * t * C[0] + t * t * b.q[0], v * v * a.q[1] + 2 * v * t * C[1] + t * t * b.q[1]]); }
  return pts.slice(0, a.j).concat(seg, pts.slice(b.j + 1));
}

/** the side view: the surface is the line Y = 0, the finger meets it pitched by `pitch` (radians, tip into it), its joint
    bent by flex, pressed by press (0..1 -> 1.5 mm of pulp). L: mm of finger. */
function fngSide(dig, L, pitch, press, flex, floor) {
  const g = fngGeo(dig), D = g.D, N = D.nail, bend = g.bender(flex);
  const body = [];
  for (const p of g.sil) if (p[0] <= L) body.push([-p[0], -p[1]]);
  /* close the far end across the finger */
  body.unshift([-L, -g.top(L)]); body.push([-L, -g.bot(L)]);
  /* the nail from the side (FG2): a thin plate on the back of the fingertip, seen edge-on at its crest. What shows is the
     strip between the crest (the silhouette) and the fold over its side: about 1.5 mm at most, tapering to nothing at the
     cuticle's U and round the free edge, as the plate curves away (9 mm radius across); the paler free edge at its front */
  const st = (u, z) => g.secTop(u, z), cov = 0.2, us = [];
  for (let u = N.free; u < N.cut; u += 0.12) us.push(u); us.push(N.cut);
  const lowAt = u => [-u, -st(u, Math.max(0, g.W(u) - cov))];
  const nail = us.map(u => [-u, -(g.top(u) + 0.01)]).concat(us.slice().reverse().map(lowAt));
  const fold = us.filter(u => u >= N.corner - 0.3).reverse().map(lowAt);
  const fedge = []; for (let i = 0; i <= 14; i++) { const z = (g.zc - cov) * (1 - i / 14), u = g.freeAt(z); fedge.push([-u, -st(u, z)]); }
  const NU = fngNail(dig), smile = [];
  for (let i = 0; i <= 14; i++) { const z = NU.zs * i / 14, u = g.freeAt(z) - 0.05; smile.push([-u, -st(u, z) - 0.01]); }
  for (let i = 14; i >= 0; i--) { const z = NU.zs * i / 14, u = g.freeAt(z) + NU.sm(z); smile.push([-u, -st(u, z)]); }
  const hl = []; for (let u = N.free + 1.1; u <= N.cut - 1.6; u += 0.4) hl.push([-u, -(g.top(u) - 0.3)]);
  /* creases: the joint's dorsal wrinkles (short arcs down from the back) and its palmar crease */
  const lines = [];
  for (const [du0, len] of [[-1.3, 2.4], [0, 3.1], [1.25, 2.3]]) { const u = D.dip + du0 - 0.4, y0 = -g.top(u) + 0.3; lines.push([[-u, y0], [-(u - 0.3), y0 + len * 0.55], [-(u - 0.12), y0 + len]]); }
  { const u = D.dip, y0 = -g.bot(u) - 0.1; lines.push([[-u, y0], [-(u - 0.45), y0 - 1.3], [-(u - 0.3), y0 - 2.3]]); }
  /* the light/shadow line along the side, 40 % up from the shadowed side (the pad's, or the back's when the light comes
     from below); round the tip it is carried on to the outline when painted, so the tip reads round */
  const termA = [], termB = [];
  for (let u = L; u >= 4.4; u -= 0.4) { const t = g.top(u), b = g.bot(u); termA.push([-u, -(b + (t - b) * 0.4)]); termB.push([-u, -(b + (t - b) * 0.62)]); }
  /* bend, pitch, contact, press */
  const c = Math.cos(pitch), s = Math.sin(pitch), rot = p => [p[0] * c - p[1] * s, p[0] * s + p[1] * c];
  const all = [body, nail, smile, fold, fedge, hl, termA, termB, ...lines].map(a => a.map(p => rot(bend(p))));
  let lo = -1e9, cx = 0;
  for (const p of all[0]) if (p[1] > lo) { lo = p[1]; cx = p[0]; }
  const delta = 1.5 * clamp(press), sh = p => [p[0] - cx, p[1] - lo + delta];
  const out = all.map(a => a.map(sh));
  let x0 = 1e9, x1 = -1e9, i0 = -1, i1 = -1;
  const fy = floor ? (X => -floor(X)) : (X => 0);
  out[0] = out[0].map((p, i) => { const f = fy(p[0]); if (p[1] > f) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); if (i0 < 0) i0 = i; i1 = i; return [p[0], f]; } return p; });
  if (x1 > x0) {
    /* the skin beside the flat bulges outward a little (the pulp is nearly incompressible) */
    const xc = (x0 + x1) / 2, hl2 = (x1 - x0) / 2, k = 0.38 * delta;
    out[0] = out[0].map(p => { const h = p[1] - fy(p[0]); if (h < -3.0) return p; const f = 1 + Math.min(0, h) / 3.0, dx = p[0] - xc; if (Math.abs(dx) < hl2 * 0.7) return p; return [p[0] + Math.sign(dx) * k * f * f, p[1]]; });
    /* and it rolls onto the surface: no corner where the pad meets it (FG2: the tip read as a chisel) */
    const rr = Math.min(1.3, 0.3 * (x1 - x0) + 0.15);
    out[0] = fngRound(out[0], i1, rr); out[0] = fngRound(out[0], i0, rr);
    for (const q of [6, 7]) out[q] = out[q].map(p => (p[1] > -0.4 ? [p[0], -0.4] : p));
  }
  const fe = out[0], far = [(fe[0][0] + fe[fe.length - 1][0]) / 2, (fe[0][1] + fe[fe.length - 1][1]) / 2];
  const th = pitch - flex;   /* the middle phalanx's direction: the fingertip's pitch less the joint's flexion */
  return { body: out[0], nail: out[1], free: out[2], fold: out[3], fedge: out[4], hl: out[5], termA: out[6], termB: out[7], lines: out.slice(8),
    flat: x1 > x0 ? [x0, x1] : null, flatPts: x1 > x0 ? [[x0, fy(x0)], [x1, fy(x1)]] : null, far, axis: [Math.cos(th), Math.sin(th)], tipAx: [c, s], L,
    tip: out[0].reduce((a, q) => (q[0] > a[0] ? q : a), [-1e9, 0]) };
}

/** the top view (the nail toward the viewer): the pad's centre (the contact) at the origin; pressed, the pulp spreads */
function fngTop(dig, L, press) {
  const g = fngGeo(dig), D = g.D, p = clamp(press), uc = D.belly, U = u => -u + uc;
  const spread = u => 0.5 * p * Math.exp(-Math.pow((u - uc + 0.5) / 4.0, 2));
  const half = [];
  for (let u = 0; u <= L + 1e-6; u += 0.2) half.push([U(u) + (u < 1.2 ? 0.25 * p * (1.2 - u) / 1.2 : 0), g.hw(u) + spread(u)]);
  const body = half.map(q => [q[0], -q[1]]).reverse().concat(half.slice(1).map(q => [q[0], q[1]]));
  const NU = fngNail(dig), T = q => [U(q[0]), q[1]];
  const lines = [];
  for (const [du0, f] of [[-1.3, 0.4], [0, 0.55], [1.25, 0.38]]) { const u = D.dip + du0 - 0.3, w = g.hw(u) * f, l = []; for (let i = 0; i <= 10; i++) { const z = -w + 2 * w * i / 10; l.push([U(u - 0.5 * (1 - Math.pow(z / w, 2))), z]); } lines.push(l); }
  return { body, nail: NU.out.map(T), free: NU.free.map(T), lun: NU.lun.map(T), fold: NU.fold.map(T), pfold: NU.pfold.map(T), hlL: NU.hl(-1).map(T), hlR: NU.hl(1).map(T), cross: NU.cross.map(T),
    lines, uc, far: [U(L), 0], axis: [1, 0], tipAx: [1, 0], L, hwAt: u => g.hw(u) + spread(u), U };
}

/** the end view: the finger comes toward the viewer, its fingertip pitched down by pitch (radians) to the surface (the
    stage line Y = 0), turned by yaw (radians, about the vertical: fingers splay a little, and a few degrees show the
    finger's side and the nail's curve), its joint flexed, pressed; contact at the origin. A point (u back along the
    fingertip's axis, h up, z across) goes to the screen as X = u sin(yaw) cos(pitch) - h sin(yaw) sin(pitch) + z cos(yaw),
    Y-up = u sin(pitch) + h cos(pitch). The silhouette is the union of every section's projection. */
/* the end view, in two parts: the projection (costly; cached by its pose) and the press (cheap; every frame) */
const FNG_ENDBASE = new Map();
function fngEnd(dig, L, pitch, press, flex, yaw = 0, floor, roll = 0, light = [-0.42, -0.91]) {
  const k0 = [dig, L, pitch, flex, yaw, roll, light[0], light[1]].map(v => (typeof v === 'number' ? v.toFixed(4) : v)).join('|');
  let B = FNG_ENDBASE.get(k0);
  if (!B) { B = fngEndBase(dig, L, pitch, flex, yaw, roll, light); FNG_ENDBASE.set(k0, B); if (FNG_ENDBASE.size > 60) FNG_ENDBASE.delete(FNG_ENDBASE.keys().next().value); }
  const delta = 1.5 * clamp(press), dY = q => [q[0], q[1] + delta];
  const fy = floor ? (X => -floor(X)) : (X => 0);
  let x0 = 1e9, x1 = -1e9;
  const CL = new Set();
  const low2 = B.lower.map(p => { const y = p[1] + delta, f = fy(p[0]); if (y > f) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); const q = [p[0], f]; CL.add(q); return q; } return [p[0], y]; });
  let body = B.upper.map(dY).concat(low2.reverse());
  if (x1 > x0) {
    const k = 0.45 * delta, mid = (x0 + x1) / 2, hl = (x1 - x0) / 2;
    body = body.map(p => { if (p[1] > -3 && Math.abs(p[0] - mid) > hl * 0.6) { const q = [p[0] + Math.sign(p[0] - mid) * k * Math.pow(1 + Math.min(0, p[1]) / 3, 2), p[1]]; if (CL.has(p)) CL.add(q); return q; } return p; });
    let i0 = -1, i1 = -1; body.forEach((p, i) => { if (CL.has(p)) { if (i0 < 0) i0 = i; i1 = i; } });
    const rr = Math.min(1.2, 0.3 * (x1 - x0) + 0.15);
    if (i1 > i0) { body = fngRound(body, i1, rr); body = fngRound(body, i0, rr); }
  }
  const tY = q => { const y = q[1] + delta; return [q[0], y > -0.35 ? -0.35 : y]; };
  return { body, nail: B.nail.map(dY), free: B.free.map(dY), lun: B.lun.map(dY), fold: B.fold.map(dY), pfold: B.pfold.map(dY), hlL: B.hlL.map(dY), hlR: B.hlR.map(dY), cross: B.cross.map(dY),
    lines: B.lines.map(l => l.map(dY)), term: B.term.map(tY),
    flat: x1 > x0 ? [x0, x1] : null, flatPts: x1 > x0 ? [[x0, fy(x0)], [x1, fy(x1)]] : null, L, far: dY(B.far), axis: B.axis, tip: [0, 0] };
}
function fngEndBase(dig, L, pitch, flex, yaw, roll, light) {
  const g = fngGeo(dig), D = g.D, c = Math.cos(pitch), s = Math.sin(pitch), cy = Math.cos(yaw), sy = Math.sin(yaw), sec = g.sec, bend = g.bender(flex);
  /* roll: the finger turned about its own axis (the stage's ang: 0 the pad down; -PI/2 the pad facing right, a finger
     lying against a side wall). The body still rises up the screen; the result is drawn in a frame turned by roll so the
     pad faces down in it (the renderer turns it back), so the press and the floor work as for an upright finger */
  const rho = -roll, cr = Math.cos(rho), sr = Math.sin(rho), hA = g.tipH;
  const P3s = (u, h, z) => { const q = bend([-u, -h]), uu = -q[0], hh = -q[1], dh = hh - hA, z2 = z * cr - dh * sr, h2 = hA + z * sr + dh * cr;
    return [uu * sy * c - h2 * sy * s + z2 * cy, h2 * c + uu * s]; };
  const P3 = (u, h, z) => { const q = P3s(u, h, z); return [q[0] * cr + q[1] * sr, -q[0] * sr + q[1] * cr]; };
  /* every section's outline, projected; binned by X for the union's top and bottom */
  const bw = 0.12, bins = new Map(), put = (X, Y) => { const k = Math.round(X / bw); const e = bins.get(k); if (!e) bins.set(k, [Y, Y]); else { if (Y > e[0]) e[0] = Y; if (Y < e[1]) e[1] = Y; } };
  let lo = 1e9, xLo = 0;
  for (let u = 0.01; u <= L; u += (u < 8 ? 0.07 : 0.14)) {
    const b = g.hw(u); if (b <= 1e-3) continue;
    for (let i = 0; i <= 36; i++) { const t = -1 + 2 * i / 36, z = b * 0.9995 * Math.sign(t) * Math.pow(Math.abs(t), 0.7), r = sec(u, z); if (!r) continue; const A = P3(u, r[0], z), Bq = P3(u, r[1], z); put(A[0], A[1]); put(Bq[0], Bq[1]);
      /* the contact is the fingertip's pad (the distal pad, u < 12), never the far body */
      if (u < 12) for (const q of [A, Bq]) if (q[1] < lo) { lo = q[1]; xLo = q[0]; } }
  }
  const ks = [...bins.keys()].sort((p, q) => p - q);
  /* the envelope, lightly smoothed (it is sampled), its ends kept */
  const sm = (arr, up) => arr.map((v, i) => { if (i < 2 || i > arr.length - 3) return v; let a = 0; for (let j = -2; j <= 2; j++) a += arr[i + j]; return up ? Math.max(v, a / 5) : Math.min(v, a / 5); });
  const tops = sm(ks.map(k => bins.get(k)[0]), true), bots = sm(ks.map(k => bins.get(k)[1]), false), xc = xLo;
  const upper = ks.map((k, i) => [k * bw - xc, -(tops[i] - lo)]), lower = ks.map((k, i) => [k * bw - xc, -(bots[i] - lo)]);
  const proj = (u, z, dh = 0.06) => { const r = sec(u, z) || [g.top(u), 0], q = P3(u, r[0] + dh, z); return [q[0] - xc, -(q[1] - lo)]; };
  const NU = fngNail(dig), PJ = q => proj(q[0], q[1]);
  const lines = [];
  /* the hyponychium: the shadow line just under the free edge */
  { const l = [], zf = g.zc * 0.86; for (let i = 0; i <= 20; i++) { const z = -zf + 2 * zf * i / 20, u = g.freeAt(z) - 0.1; l.push(proj(u, z, -0.75)); } lines.push(l); }
  for (const [du0, f] of [[-1.3, 0.36], [0, 0.48], [1.25, 0.34]]) { const u = D.dip + du0 - 0.3; if (u > L - 3) continue; const w = g.hw(u) * f, l = []; for (let i = 0; i <= 10; i++) { const z = -w + 2 * w * i / 10; l.push(proj(u - 0.5 * (1 - Math.pow(z / w, 2)), z)); } lines.push(l); }
  /* the light/shadow line, found on the model itself (FG2: it was a fixed polygon and read faceted): the light in the
     frame (from the stage's, turned by roll) tilted toward the viewer; on each section the visible point where the
     surface turns from the light, followed from the far end to the tip, where it runs out at the silhouette */
  const P3d = (u, h, z) => { const q = bend([-u, -h]), uu = -q[0], hh = -q[1], dh = hh - hA, z2 = z * cr - dh * sr, h2 = hA + z * sr + dh * cr;
    const X = uu * sy * c - h2 * sy * s + z2 * cy, Y = h2 * c + uu * s, Z = -cy * c * uu + cy * s * h2 + sy * z2; return [X * cr + Y * sr, -X * sr + Y * cr, Z]; };
  const lz = 0.42, lk = Math.sqrt(1 - lz * lz), ll = Math.hypot(light[0], light[1]) || 1, LV = [light[0] / ll * lk, -light[1] / ll * lk, lz];
  const secPt = (u, th) => { const b = g.hw(u), t = g.top(u), bo = g.bot(u), hc = bo + (t - bo) * 0.52, cs = Math.cos(th), sn = Math.sin(th);
    const pz = sn >= 0 ? 2.05 : 2.3, z = b * Math.sign(cs) * Math.pow(Math.abs(cs), 2 / pz), dh = sn >= 0 ? (t - hc) * Math.pow(sn, 2 / 2.05) : -(hc - bo) * Math.pow(-sn, 2 / 2.3);
    return P3d(u, hc + dh, z); };
  /* every section's crossings (where the surface turns from the light), then the two branches of the loop they make:
     down the side away from the light to the tip, and back from under the tip until it passes out of sight */
  const NT = 96, rows = [];
  for (let u = L; u >= 0.1; u -= (u > 9 ? 0.6 : u > 3 ? 0.3 : 0.1)) {
    const b = g.hw(u); if (b <= 1e-3) continue;
    const C0 = P3d(u, (g.top(u) + g.bot(u)) / 2, 0), du = Math.min(0.08, u * 0.5), cand = [];
    let f0 = null, v0 = null, s0 = null;
    for (let i = 0; i <= NT; i++) {
      const th = TAU * i / NT, S0 = secPt(u, th), Su = secPt(u + du, th), St = secPt(u, th + TAU / NT * 0.5);
      const a1 = [Su[0] - S0[0], Su[1] - S0[1], Su[2] - S0[2]], b2 = [St[0] - S0[0], St[1] - S0[1], St[2] - S0[2]];
      let n = [a1[1] * b2[2] - a1[2] * b2[1], a1[2] * b2[0] - a1[0] * b2[2], a1[0] * b2[1] - a1[1] * b2[0]];
      if (n[0] * (S0[0] - C0[0]) + n[1] * (S0[1] - C0[1]) + n[2] * (S0[2] - C0[2]) < 0) n = [-n[0], -n[1], -n[2]];
      const nl = Math.hypot(n[0], n[1], n[2]) || 1, f = (n[0] * LV[0] + n[1] * LV[1] + n[2] * LV[2]) / nl, vis = n[2] / nl;
      if (f0 != null && f0 * f <= 0 && Math.max(vis, v0) > -0.03) { const k = f0 / ((f0 - f) || 1e-9); cand.push({ X: s0[0] + (S0[0] - s0[0]) * k, Y: s0[1] + (S0[1] - s0[1]) * k, vis: Math.max(vis, v0) }); }
      f0 = f; v0 = vis; s0 = S0;
    }
    rows.push(cand);
  }
  /* the loop's two branches, followed out from the tip (where both are found) toward the far end while in sight; joined
     across the tip's blunt front through its rim's darkest point. Fallback: one branch from the far end */
  const dist = (p1, p2) => Math.hypot(p1.X - p2.X, p1.Y - p2.Y), R = rows.slice().reverse();
  const trace = (r0, start, avoid) => { const out = [start]; let prev = start;
    for (let r = r0 + 1; r < R.length; r++) { const cand = R[r].filter(w => !avoid || !avoid[r] || dist(w, avoid[r]) > 0.35); if (!cand.length) break;
      const pick = cand.reduce((q, w) => (dist(w, prev) < dist(q, prev) ? w : q)); if (dist(pick, prev) > 3 || pick.vis < -0.03) break; out.push(pick); out.byRow = out.byRow || {}; out.byRow[r] = pick; prev = pick; }
    return out; };
  let A1 = [], B1 = [];
  const r0 = R.findIndex(c => c.length >= 2);
  if (r0 >= 0) {
    const c = R[r0]; let i1 = 0, i2 = 1, bd = -1;
    for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++) { const d = dist(c[i], c[j]); if (d > bd) { bd = d; i1 = i; i2 = j; } }
    const br1 = trace(r0, c[i1], null), av = {}; if (br1.byRow) Object.assign(av, br1.byRow); av[r0] = c[i1];
    const br2 = trace(r0, c[i2], av);
    /* the rim point of a small section facing most away from the light */
    let dk = null, dmin = 1e9; const cc = P3d(0.05, g.tipH, 0);
    for (let i = 0; i < 48; i++) { const q = secPt(0.05, TAU * i / 48), d = (q[0] - cc[0]) * LV[0] + (q[1] - cc[1]) * LV[1]; if (d < dmin) { dmin = d; dk = q; } }
    const a0 = br1[0], b0 = br2[0], bridge = [];
    for (let j = 1; j < 8; j++) { const t = j / 8, v = 1 - t; bridge.push({ X: v * v * a0.X + 2 * v * t * dk[0] + t * t * b0.X, Y: v * v * a0.Y + 2 * v * t * dk[1] + t * t * b0.Y }); }
    A1 = br1.slice().reverse(); B1 = bridge.concat(br2);
  }
  if (A1.length + B1.length < 6) {
    A1 = []; B1 = []; let prev = null;
    for (const cand of rows) { if (!cand.length) { if (prev) break; continue; }
      const pick = prev ? cand.reduce((q, w) => (dist(w, prev) < dist(q, prev) ? w : q)) : cand.reduce((q, w) => (w.vis > q.vis ? w : q));
      if (prev && dist(pick, prev) > 4) break; A1.push(pick); prev = pick; }
  }
  let term = A1.concat(B1).map(q => [q.X - xc, -(q.Y - lo)]);
  /* eased (the bridge and the sampling leave small kinks), its ends kept */
  for (let it = 0; it < 4; it++) term = term.map((q, i) => (i === 0 || i === term.length - 1 ? q : [(term[i - 1][0] + 2 * q[0] + term[i + 1][0]) / 4, (term[i - 1][1] + 2 * q[1] + term[i + 1][1]) / 4]));
  /* the far end and the axis there (for the fade) */
  const fa = P3(L, (g.top(L) + g.bot(L)) / 2, 0), fb = P3(L - 1, (g.top(L - 1) + g.bot(L - 1)) / 2, 0), al = Math.hypot(fb[0] - fa[0], fb[1] - fa[1]) || 1;
  return { upper, lower, nail: NU.out.map(PJ), free: NU.free.map(PJ), lun: NU.lun.map(PJ), fold: NU.fold.map(q => proj(q[0], q[1], 0.02)), pfold: NU.pfold.map(q => proj(q[0], q[1], 0)),
    hlL: NU.hl(-1).map(PJ), hlR: NU.hl(1).map(PJ), cross: NU.cross.map(PJ), lines, term,
    far: [fa[0] - xc, -(fa[1] - lo)], axis: [(fb[0] - fa[0]) / al, -(fb[1] - fa[1]) / al] };
}
/* ---- the finger's drawing: Brock's pick, "A Line" (FEEDBACK F49.1, 2026-11-06 ~12:10): outlined like the deck's parts, a lit
   side and a shadow side in two flat greys, mono grey on both grounds (F9.24); true greys only ---- */
const FNG_LIGHT = [-0.42, -0.91];          /* the stage's light, as the deck's parts are lit: from above, a little left */
let FNG_LAYER = null;
const FNG_MEMO = new Map();
function fngNorm(a) { if (!isFinite(a)) return 0; while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a; }
/** a smooth closed or open path through dense points (midpoint quadratics) */
function fngPath(pts, close) {
  const n = pts.length; if (n < 2) return; G.beginPath();
  if (close) {
    const m0 = [(pts[n - 1][0] + pts[0][0]) / 2, (pts[n - 1][1] + pts[0][1]) / 2]; G.moveTo(m0[0], m0[1]);
    for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; G.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
    G.closePath();
  } else {
    G.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < n - 1; i++) { const p = pts[i], q = pts[i + 1]; G.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
    G.lineTo(pts[n - 1][0], pts[n - 1][1]);
  }
}
/** the greys, on paper and on night: lit, shadow, outline (px), creases; the nail is drawn in the skin's own greys, a
    little lighter (FNG_NAIL), never a colour of its own */
function fngPal() {
  return TH ? { lit: '#D5D5DA', sh: '#AFAFB5', edge: 'rgba(17,17,17,0.66)', ew: 1.35, line: 'rgba(17,17,17,0.36)', inkHex: '#111111', k: 0 }
    : { lit: '#A4A4AA', sh: '#77777D', edge: 'rgba(243,243,245,0.66)', ew: 1.35, line: 'rgba(12,12,14,0.45)', inkHex: '#0C0C0E', k: 1 };
}
/* the nail, Brock's pick A Soft (white and ink over the skin's greys, [paper, night]): tone, its lift over the skin;
   free, the paler free edge; fold, the skin's edge round it (a crease line, x the crease's alpha); hl, the sheen along its
   curve (alpha, width x); rim, its darkening toward its sides (it curves away under the folds); edge, a line on the free
   edge; pf, the proximal fold's crease */
const FNG_NAIL = { tone: [0.3, 0.13], free: [0.36, 0.2], fold: [0.6, 0.65], hl: [0.75, 0.42], hlw: 1, rim: [0, 0], edge: 0, pf: 0 };
/**
 * A fingertip, drawn from one anatomical model, to scale, in the deck's line style (F49.1: Brock's pick "A Line"), mono grey
 * with a lit and a shadow side on both grounds (F9.24). (x, y) is the contact on the surface it presses, ang the way it
 * points (radians: 0 right, PI/2 down; pointing left it mirrors so the pad stays down). Put (x, y) on the surface and move
 * it with the part: the finger rides the button down. The last joint is a little flexed, so only the fingertip's pad
 * reaches the surface. o = {
 *   s       px per mm (3.2). Pass the part's own scale so the finger is to scale with what it presses: an index fingertip
 *           is 14.3 mm across at the nail and 16 mm at the joint, its nail 10.3 by 12.7 mm between the folds. Inside part() or a
 *           camera pass s in its units (1 in mm): line widths and detail follow the true size on the stage.
 *   press   0..1: the bone and nail move 1.5 mm toward the surface, the pad flattens on it (about a 10 mm contact, as at
 *           1 N), the skin beside bulges, the nail stays rigid and pales from its free edge.
 *   view    'side' (default) | 'top' (from above, the nail toward the viewer; (x, y) the pad's centre) | 'end' (coming
 *           toward the viewer, pitched onto the surface so the nail shows foreshortened and the finger rises behind it;
 *           ang turns it about its own axis: 0 the pad down, -PI/2 the pad facing right, against a wall).
 *   surf    side view: the surface's direction on the stage. Pass it whenever the finger meets a part at a slant: the
 *           fingertip then meets it at ang - surf and the pad lands flat ON it; the side the finger points into is the
 *           pad's side, so a finger pressing up into an egg or poking a wall needs no flip. Without it the finger rests
 *           along ang, as before.
 *   digit   'index' (default) | 'thumb' (20.7 mm at its joint, a broad nail and its lunula).
 *   len     mm of finger shown (46); the far end fades over its last 30 %, at most 12 mm. Under about 24 shows only the
 *           fingertip; 30 to 40 shows the joint, which is what makes it read as a finger.
 *   floor   a surface that isn't flat: X (mm along the surface from the contact) -> its height (mm, + toward the finger);
 *           the pad drapes over it. floorKey: a string that changes when the floor does (it caches the shape).
 *   mark    [X0, X1, colour]: a stretch of the pad, mm along the surface from the contact (a pinch, in red).
 *   ghost   0..1: see-through, to show what is under the fingertip.
 *   alpha, flip (put the pad on the other side), flex (the joint's bend, radians), pitch (end view, 0.5), yaw (end view,
 *   0.22 cos ang), lod (2 all, 1 nail and tones, 0 silhouette and nail; by default from the size: 2.6 and 1.2 px/mm) }
 * Returns { contact: [p0, p1] (the flattened stretch's ends, when pressed), tip } in the caller's units.
 * e.g. finger(p[0], p[1] + d * 6, -0.08, { s: est.s, press: d }); finger(c[0], c[1], Math.PI / 2 - 0.45, { s, surf: 0, press: k, len: 30 })
 */
function finger(x, y, ang = 0, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; if (!(a > 0.003)) return null;
  const s = o.s || 3.2, view = o.view || 'side', dig = FNG_DIG[o.digit] ? o.digit : 'index', P = fngPal(), p = clamp(o.press || 0);
  const L = Math.max(o.len || 46, 6), D = FNG_DIG[dig], flex = o.flex == null ? D.flex : o.flex, epitch = o.pitch == null ? 0.5 : o.pitch;
  let flip = o.flip != null ? o.flip : view !== 'end' && Math.cos(ang) < -1e-6, rot = ang, geo;
  const key = a1 => a1.map(v => (typeof v === 'number' ? v.toFixed(3) : String(v))).join('|');
  const memo = (k, f) => { const c = FNG_MEMO.get(k); if (c) return c; const v = f(); FNG_MEMO.set(k, v); if (FNG_MEMO.size > 400) FNG_MEMO.delete(FNG_MEMO.keys().next().value); return v; };
  const fl = o.floor || null, flk = fl ? (o.floorKey == null ? Math.random() : o.floorKey) : 0;
  if (view === 'side') {
    /* no surface: the finger rests along ang, as the old kit's did (its middle phalanx 4.6° off the surface, the fingertip
       curled onto it by the joint's flexion). A surface: of its tangent's two directions, the one that meets the finger at
       no more than 60°; between 60° and 120° (a poke), the one that keeps the pad facing down the stage, as a hand above
       holds it; the side the finger points into is the pad's side */
    let ts = ang, pitch = flex + 0.08;
    if (o.surf != null) {
      const cand = [o.surf, o.surf + Math.PI].map(t1 => {
        const n0 = [-Math.sin(t1), Math.cos(t1)], dd = Math.cos(ang) * n0[0] + Math.sin(ang) * n0[1];
        const f1 = Math.abs(dd) > 0.02 ? dd < 0 : (o.flip != null ? o.flip : n0[1] < 0), p1 = (f1 ? -1 : 1) * fngNorm(ang - t1);
        const q = [-Math.sin(p1), Math.cos(p1) * (f1 ? -1 : 1)], padY = q[0] * Math.sin(t1) + q[1] * Math.cos(t1);
        return { t1, f1, p1, padY };
      }).filter(c => Math.abs(c.p1) <= 2.1);
      const pick = cand.find(c => Math.abs(c.p1) <= 1.05) || cand.sort((u, v) => v.padY - u.padY)[0];
      if (pick) { ts = pick.t1; flip = pick.f1; pitch = pick.p1; }
    }
    rot = ts; geo = memo(key(['s', dig, L, pitch, p, flex, flk]), () => fngSide(dig, L, pitch, p, flex, fl));
  } else if (view === 'top') geo = memo(key(['t', dig, L, p]), () => fngTop(dig, L, p));
  const m = flip ? -1 : 1;
  if (view === 'end') { const yaw = o.yaw == null ? 0.22 * Math.cos(ang) : o.yaw, c0 = Math.cos(ang), s0 = Math.sin(ang), lt = [FNG_LIGHT[0] * c0 + FNG_LIGHT[1] * s0, m * (-FNG_LIGHT[0] * s0 + FNG_LIGHT[1] * c0)];
    geo = memo(key(['e', dig, L, epitch, p, flex, yaw, flk, ang, m]), () => fngEnd(dig, L, epitch, p, flex, yaw, fl, ang, lt)); }
  /* the light in the frame (the inverse of rotate(rot), then the mirror); the true size on the stage */
  const cr = Math.cos(rot), sr = Math.sin(rot), Lx = FNG_LIGHT[0] * cr + FNG_LIGHT[1] * sr, Ly = m * (-FNG_LIGHT[0] * sr + FNG_LIGHT[1] * cr);
  const T0 = G.getTransform(), dev = (typeof APP !== 'undefined' && APP.scale ? APP.scale * (APP.dpr || 1) : 1), sEff = s * Math.hypot(T0.a, T0.b) / dev;
  const px = 1 / sEff, lod = o.lod != null ? o.lod : sEff >= 2.6 ? 2 : sEff >= 1.2 ? 1 : 0;
  /* drawn whole into a layer in the same transform (offset to its box in device pixels), then set down once: the far end
     fades cleanly and a partial alpha never shows the pieces through one another */
  const G0 = G; G0.save(); G0.translate(x, y); G0.rotate(rot); if (flip) G0.scale(1, -1); G0.scale(s, s);
  const M = G0.getTransform(); G0.restore();
  let bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9;
  for (const q of geo.body) { const X = M.a * q[0] + M.c * q[1] + M.e, Y = M.b * q[0] + M.d * q[1] + M.f; if (X < bx0) bx0 = X; if (X > bx1) bx1 = X; if (Y < by0) by0 = Y; if (Y > by1) by1 = Y; }
  const cw = G0.canvas.width, ch = G0.canvas.height;
  bx0 = Math.max(0, Math.floor(bx0) - 6); by0 = Math.max(0, Math.floor(by0) - 6); bx1 = Math.min(cw, Math.ceil(bx1) + 6); by1 = Math.min(ch, Math.ceil(by1) + 6);
  if (!(bx1 > bx0 && by1 > by0)) return null;
  const lw0 = bx1 - bx0, lh0 = by1 - by0;
  if (!FNG_LAYER) FNG_LAYER = document.createElement('canvas');
  if (FNG_LAYER.width < lw0 || FNG_LAYER.height < lh0) { FNG_LAYER.width = Math.max(FNG_LAYER.width, lw0); FNG_LAYER.height = Math.max(FNG_LAYER.height, lh0); }
  const LC = FNG_LAYER.getContext('2d');
  LC.setTransform(1, 0, 0, 1, 0, 0); LC.globalAlpha = 1; LC.globalCompositeOperation = 'source-over'; LC.clearRect(0, 0, lw0, lh0);
  LC.setTransform(M.a, M.b, M.c, M.d, M.e - bx0, M.f - by0);
  G = LC;
  try { fngPaint(geo, view, P, p, px, lod, Lx, Ly, L, epitch, dig, FNG_NAIL); } finally { G = G0; }
  G0.save(); G0.setTransform(1, 0, 0, 1, 0, 0); G0.globalAlpha = G0.globalAlpha * a * (o.ghost ? 1 - 0.75 * clamp(o.ghost) : 1);
  G0.drawImage(FNG_LAYER, 0, 0, lw0, lh0, bx0, by0, lw0, lh0); G0.restore();
  /* the contact and the tip in the caller's units; a stretch of the pad marked (a pinch) */
  const inv = G0.getTransform().inverse(), toS = q => { const X = M.a * q[0] + M.c * q[1] + M.e, Y = M.b * q[0] + M.d * q[1] + M.f; return [inv.a * X + inv.c * Y + inv.e, inv.b * X + inv.d * Y + inv.f]; };
  const out = { contact: geo.flatPts ? geo.flatPts.map(toS) : null, tip: geo.tip ? toS(geo.tip) : null };
  if (o.mark) {
    const [m0, m1, col] = o.mark, seg = geo.body.filter(q => q[0] >= m0 && q[0] <= m1 && q[1] > -2.5);
    if (seg.length > 1) { G0.save(); G0.beginPath(); seg.map(toS).forEach((q, i) => (i ? G0.lineTo(q[0], q[1]) : G0.moveTo(q[0], q[1]))); G0.strokeStyle = col || C.red; G0.lineWidth = 4 * dev / Math.hypot(T0.a, T0.b); G0.lineCap = 'round'; G0.globalAlpha *= a; G0.stroke(); G0.restore(); }
  }
  return out;
}
/** the pad's height (mm) above its lowest point, u mm back from the tip (for sections drawn at other scales: b08_tape's) */
function fingerPad(u, digit) { return fngGeo(FNG_DIG[digit] ? digit : 'index').bot(Math.max(0, u)); }

/** the shadow side as one shape that wraps the tip (FG2: the tip read as a chisel): the light/shadow line T from the far
    end, carried on by a smooth curve to the outline B where the outline's normal is square to the light (on a ball that is
    where the shadow's edge meets the silhouette), arriving along it; then the outline from there round the shadow side
    back to the far end. With snap, T already ends on the outline (the end view). */
function fngShadow(B, T, Lx, Ly, sdir, tipAx, snap) {
  const n = B.length; if (n < 4 || T.length < 2) return null;
  let sa = 0; for (let i = 0; i < n; i++) { const p = B[i], q = B[(i + 1) % n]; sa += p[0] * q[1] - q[0] * p[1]; }
  const tan = i => { const p = B[Math.max(0, i - 1)], q = B[Math.min(n - 1, i + 1)], dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
  const Te = T[T.length - 1];
  let iA = -1;
  if (snap) { let bd = 1e9; for (let i = 0; i < n; i++) { const d = Math.hypot(B[i][0] - Te[0], B[i][1] - Te[1]); if (d < bd) { bd = d; iA = i; } } }
  else {
    const ll = Math.hypot(Lx, Ly) || 1, lx = Lx / ll, ly = Ly / ll;
    let nA = [-ly, lx]; if (nA[0] * tipAx[0] + nA[1] * tipAx[1] < 0) nA = [ly, -lx];
    if (nA[0] * tipAx[0] + nA[1] * tipAx[1] < 0.18) {
      /* the light along the finger: from ahead the whole tip is lit (the edge meets the outline on the shadow side), from
         behind the whole tip is in shadow (it meets it on the lit side) */
      const ahead = lx * tipAx[0] + ly * tipAx[1] > 0, sd = ahead ? sdir : [-sdir[0], -sdir[1]], sg = (sd[0] * -tipAx[1] + sd[1] * tipAx[0]) > 0 ? 1 : -1;
      nA = [-tipAx[1] * sg + tipAx[0] * 0.2, tipAx[0] * sg + tipAx[1] * 0.2]; const l2 = Math.hypot(nA[0], nA[1]); nA = [nA[0] / l2, nA[1] / l2];
    }
    let tx = -1e9; for (const q of B) tx = Math.max(tx, q[0] * tipAx[0] + q[1] * tipAx[1]);
    let best = -2;
    for (let i = 1; i < n - 1; i++) {
      if (B[i][0] * tipAx[0] + B[i][1] * tipAx[1] < tx - 7) continue;
      const t = tan(i), nn = sa > 0 ? [t[1], -t[0]] : [-t[1], t[0]], d = nn[0] * nA[0] + nn[1] * nA[1];
      if (d > best) { best = d; iA = i; }
    }
  }
  if (iA < 0) return null;
  /* which way round the outline is the shadow side */
  const arc = dir => { const a = [], T0 = T[0]; let bi = 1, bd = 1e9; for (let k = 0; k < n; k++) { const i = ((iA + dir * k) % n + n) % n; a.push(B[i]); const d = Math.hypot(B[i][0] - T0[0], B[i][1] - T0[1]); if (d < bd) { bd = d; bi = a.length; } } return a.slice(0, bi); };
  const aP = arc(1), aM = arc(-1), mid = T[Math.floor(T.length / 2)], score = a => { let sc = 0; for (const q of a) sc += (q[0] - mid[0]) * sdir[0] + (q[1] - mid[1]) * sdir[1]; return sc / (a.length || 1); };
  const useP = score(aP) >= score(aM), sarc = useP ? aP : aM;
  const A = B[iA], tA0 = tan(iA), tA = useP ? [-tA0[0], -tA0[1]] : tA0;
  const Tp = T[T.length - 2], tl = Math.hypot(Te[0] - Tp[0], Te[1] - Tp[1]) || 1, t0 = [(Te[0] - Tp[0]) / tl, (Te[1] - Tp[1]) / tl];
  const k = 0.42 * Math.hypot(A[0] - Te[0], A[1] - Te[1]), P1 = [Te[0] + t0[0] * k, Te[1] + t0[1] * k], P2 = [A[0] - tA[0] * k, A[1] - tA[1] * k];
  const wrap = [];
  if (!snap) for (let j = 1; j < 16; j++) { const t = j / 16, v = 1 - t; wrap.push([v * v * v * Te[0] + 3 * v * v * t * P1[0] + 3 * v * t * t * P2[0] + t * t * t * A[0], v * v * v * Te[1] + 3 * v * v * t * P1[1] + 3 * v * t * t * P2[1] + t * t * t * A[1]]); }
  return T.concat(wrap, sarc);
}
/** a soft streak: a line stroked in stacked widths, faint and wide to bright and thin (no filter: it plays everywhere) */
function fngStreak(pts, w, al, col) {
  if (pts.length < 2) return;
  for (const [f, k] of [[1, 0.13], [0.66, 0.16], [0.36, 0.22]]) { fngPath(pts, false); G.strokeStyle = rgba(col, al * k); G.lineWidth = w * f; G.stroke(); }
}

/** paint a view's geometry in the current frame (into the layer): body, shadow side, nail, creases, outline, the fade */
function fngPaint(geo, view, P, p, px, lod, Lx, Ly, L, epitch, dig, NS) {
  G.lineJoin = 'round'; G.lineCap = 'round';
  const B = geo.body, ax = geo.axis, gi = P.k, white = '#FFFFFF', ink = P.inkHex;
  /* the lit side: across the axis toward the light in the side view (the back, unless the light comes from the pad's
     side); from above, the finger's side facing the light; end-on, the light's own direction */
  let dirL;
  if (view === 'side') { const n = [ax[1], -ax[0]], d = n[0] * Lx + n[1] * Ly; dirL = d >= -0.25 ? n : [-n[0], -n[1]]; }
  else if (view === 'top') dirL = [0, Ly <= 0 ? -1 : 1];
  else { const l = Math.hypot(Lx, Ly * 0.55) || 1; dirL = [Lx / l, Ly * 0.55 / l]; }
  /* 1. the body, in the lit grey */
  fngPath(B, true); G.fillStyle = P.lit; G.fill();
  /* 2. the shadow side: a flat second grey beyond a clean terminator that wraps round the tip */
  if (lod >= 1) {
    let T, snap = false;
    if (view === 'side') { const backLit = dirL[0] * ax[1] - dirL[1] * ax[0] > 0; T = backLit ? geo.termA : geo.termB; }
    else if (view === 'top') { const g = fngGeo(dig), sd = -dirL[1]; T = []; for (let u = L; u >= 4.4; u -= 0.4) T.push([geo.U(u), sd * 0.72 * geo.hwAt(u)]); }
    else { T = geo.term; snap = true; }
    const SP = fngShadow(B, T, Lx, Ly, [-dirL[0], -dirL[1]], geo.tipAx || [1, 0], snap);
    if (SP) { G.save(); fngPath(B, true); G.clip(); fngPath(SP, true); G.fillStyle = P.sh; G.fill(); G.restore(); }
  }
  /* 3. the nail (FG2): in the skin's own greys, a little lighter; no outline of its own. The skin's edge (the fold) runs
     round its sides and the cuticle's U as a crease; the free edge is paler; a soft sheen runs along its curve on the lit
     side; pressed, the nail bed pales from the free edge back toward the cuticle */
  if (geo.nail && geo.nail.length > 2) {
    const N = geo.nail, side = view === 'side';
    const tone = NS.tone[gi] * (side ? 0.8 : 1);
    G.save(); fngPath(N, true); G.clip();
    if (tone > 0 || lod === 0) { fngPath(N, true); G.fillStyle = rgba(white, Math.max(tone, lod === 0 ? 0.22 : 0)); G.fill(); }
    if (lod >= 1 && NS.rim[gi] > 0 && !side && geo.cross) { const [c0, c1] = geo.cross, gr = G.createLinearGradient(c0[0], c0[1], c1[0], c1[1]), rk = NS.rim[gi];
      gr.addColorStop(0, rgba(ink, rk)); gr.addColorStop(0.28, rgba(ink, 0)); gr.addColorStop(0.72, rgba(ink, 0)); gr.addColorStop(1, rgba(ink, rk)); G.fillStyle = gr; G.fillRect(-90, -90, 180, 180); }
    if (lod >= 2 && geo.lun && geo.lun.length) { fngPath(geo.lun, true); G.fillStyle = rgba(white, NS.free[gi] * 0.45); G.fill(); }
    if (p > 0.02 && lod >= 1 && geo.free && geo.free.length > 4) {
      const fr = geo.free, f0 = fr[Math.floor(fr.length / 4)], n0 = side ? N[Math.floor(N.length * 0.25)] : N[Math.floor(N.length / 2)];
      const gb = G.createLinearGradient(f0[0], f0[1], n0[0], n0[1]); gb.addColorStop(0, rgba(white, 0.5 * p)); gb.addColorStop(Math.min(0.95, 0.2 + 0.45 * p), rgba(white, 0.4 * p)); gb.addColorStop(1, rgba(white, 0));
      G.fillStyle = gb; G.fillRect(-90, -90, 180, 180);
    }
    if (lod >= 1 && geo.free) { fngPath(geo.free, true); G.fillStyle = rgba(white, NS.free[gi]); G.fill(); }
    /* the sheen: on the lit side (from the side, along the crest when the back is lit) */
    if (lod >= 1) {
      let H = null;
      if (side) { const backLit = dirL[0] * ax[1] - dirL[1] * ax[0] > 0; if (backLit) H = geo.hl; }
      else { const mean = l => l.reduce((a, q) => a + q[0] * dirL[0] + q[1] * dirL[1], 0) / (l.length || 1); H = mean(geo.hlL) > mean(geo.hlR) ? geo.hlL : geo.hlR; }
      if (H && H.length > 1) fngStreak(H, (side ? 0.7 : 2.2) * NS.hlw, NS.hl[gi], white);
    }
    G.restore();
    if (lod >= 1) {
      const fa = NS.fold[gi];
      if (fa > 0 && geo.fold && geo.fold.length > 1) { fngPath(geo.fold, false); G.strokeStyle = P.line; G.globalAlpha *= Math.min(1, fa); G.lineWidth = (lod >= 2 ? 1.0 : 0.8) * px * Math.max(1, fa); G.stroke(); G.globalAlpha /= Math.min(1, fa); }
      if (NS.edge && lod >= 2) { const fe = side ? geo.fedge : geo.free && geo.free.slice(0, Math.floor(geo.free.length / 2)); if (fe && fe.length > 1) { fngPath(fe, false); G.strokeStyle = P.line; G.lineWidth = 0.9 * px; G.stroke(); } }
      if (NS.pf && lod >= 2 && geo.pfold && geo.pfold.length > 1) { fngPath(geo.pfold, false); G.strokeStyle = P.line; G.globalAlpha *= 0.55; G.lineWidth = 0.9 * px; G.stroke(); G.globalAlpha /= 0.55; }
    }
  }
  /* 4. the joint's creases (and the end view's hyponychium) */
  if (lod >= 2 && geo.lines) { G.strokeStyle = P.line; G.lineWidth = px; for (const l of geo.lines) { if (l.length < 2) continue; fngPath(l, false); G.stroke(); } }
  /* 5. the outline */
  fngPath(B, true); G.strokeStyle = P.edge; G.lineWidth = (lod >= 1 ? P.ew : 1.0) * px; G.stroke();
  /* 6. the far end fades out along the finger (inside the layer only) */
  const F = Math.min(12, 0.3 * L) * (view === 'end' ? Math.sin(epitch) : 1), f0 = geo.far, f1 = [f0[0] + ax[0] * F, f0[1] + ax[1] * F];
  G.save(); G.globalCompositeOperation = 'destination-out';
  const gf = G.createLinearGradient(f0[0], f0[1], f1[0], f1[1]); gf.addColorStop(0, 'rgba(0,0,0,1)'); gf.addColorStop(1, 'rgba(0,0,0,0)');
  G.fillStyle = gf; G.fillRect(-400, -400, 800, 800); G.restore();
}
/**
 * A force, drawn as an arrow whose tip sits on the point it acts on and whose length grows with the force (M2: the load
 * grows, it doesn't fade in), labelled in newtons as it grows. ang: the direction it pushes (PI/2 = down); len: px at full.
 * o = { N (the force, newtons; the label counts up to it), label (words after the value: 'a click'), k (0..1, how much of
 *   it acts now) or t + t0 + dur (0.45, eased E.snap), color (C.ink; C.red for a fault's force, C.hero for Theseus's),
 *   w (3.5), hs (14), dec (2 under 10 N, else 1), side ('r' | 'l' | 'end': where the label sits, from the tail), alpha }.
 * e.g. forceArrow(p[0], p[1], Math.PI / 2, 120, { N: 0.54, label: 'a click', t, t0: 1.8 })
 */
function forceArrow(x, y, ang, len, o = {}) {
  const k = o.k != null ? clamp(o.k) : o.t0 != null ? ep(o.t, o.t0, o.t0 + (o.dur || 0.45), E.snap) : 1; if (k <= 0.002) return;
  const a = o.alpha == null ? 1 : o.alpha, col = o.color || C.ink, L = len * k, w = o.w || 3.5, hs = Math.min(o.hs || 14, L * 0.55);
  const tx = x - Math.cos(ang) * L, ty = y - Math.sin(ang) * L;
  arrow(tx, ty, x, y, { color: col, w, hs, alpha: a });
  if (o.N == null && !o.label) return;
  const dec = o.dec != null ? o.dec : Math.abs(o.N || 0) < 10 ? 2 : 1, side = o.side || (Math.abs(Math.sin(ang)) > 0.6 ? 'r' : 'end');
  const runs = [o.N != null ? { s: kitNum((o.N || 0) * k, dec) + ' N', role: 'num', size: o.size || 26, weight: 750, color: col === C.ink ? C.ink : col === C.hero ? C.heroText : col, tnum: true } : null,
    o.label ? { s: o.label, role: 'small', size: 24, weight: 600, color: C.mute, gap: 10, sentence: false } : null];
  const mx = (tx + x) / 2, my = (ty + y) / 2;
  if (side === 'end') { const ex = tx - Math.cos(ang) * 14, ey = ty - Math.sin(ang) * 14 + 8; rich(runs, ex, ey, { align: Math.cos(ang) > 0.3 ? 'right' : Math.cos(ang) < -0.3 ? 'left' : 'center', alpha: a }); }
  else { const sx = side === 'r' ? 1 : -1; rich(runs, lerp(tx, mx, 0.3) + sx * (w + 14), lerp(ty, my, 0.3) + 8, { align: side === 'r' ? 'left' : 'right', alpha: a }); }
}
/** The rival's fault, named on the drawing: a red mark and its name (callout's style). e.g. faultTag(t, 2.2, p, 'Twists') */
function faultTag(t, t0, p, label, o = {}) { callout(t, t0, p, label, Object.assign({ color: C.red, tcolor: C.red }, o)); }
/** Theseus's fix, named on the drawing, in its blue. e.g. fixTag(t, 5.2, p, 'Straight down') */
function fixTag(t, t0, p, label, o = {}) { callout(t, t0, p, label, Object.assign({ color: C.hero, tcolor: C.heroText }, o)); }

/* ================================ compare: the rival, then Theseus (M3) ================================ */

/**
 * Two panels on one scale: rect = [x, y, w, h] split into the rival's (left) and Theseus's (right), a hairline between that
 * draws down from t0, and a label over each in type: 'MOST MICE' and the rival's name in quiet yellow (or grey), 'THESEUS'
 * in its blue. Draw the same demonstration with the same input in both. o = { left ('Most mice'), right ('Theseus'), rival
 *   (a name: 'Sora V2'), rivalCol ('second' | 'grey'), gap (40), split (0.5), labelY (y + 34), note (a line at the foot of
 *   the divider, inside rect: 'Same press, same scale'), tR (when Theseus's label comes in; default with the left) }.
 * Returns { L: [x, y, w, h], R: [x, y, w, h] } (the panels below the labels).
 * e.g. const { L, R } = abSplit(t, 0.4, [80, 280, 1760, 600], { rival: 'Sora V2' })
 */
function abSplit(t, t0, area, o = {}) {
  const [x, y, w, h] = area, gap = o.gap == null ? 40 : o.gap, f = o.split == null ? 0.5 : o.split;
  const wl = Math.round((w - gap) * f), xm = x + wl + gap / 2, ly = o.labelY == null ? y + 34 : o.labelY, top = ly + 30;
  const kd = ep(t, t0, t0 + 0.7, E.cam), hd = o.note ? h - 46 : h;
  if (kd > 0) line(xm, y, xm, y + hd * kd, { color: C.hair, w: 1.5 });
  const kl = ep(t, t0 + 0.1, t0 + 0.5), kr = ep(t, o.tR == null ? t0 + 0.2 : o.tR, (o.tR == null ? t0 + 0.2 : o.tR) + 0.4);
  const rc = o.rivalCol === 'grey' ? C.mute : C.secondText;
  ltag(x, ly, o.left == null ? 'Most mice' : o.left, o.rival || null, { a: kl, size: 22, color: C.mute, vcolor: rc });
  ltag(x + wl + gap, ly, o.right == null ? 'Theseus' : o.right, o.rightSub || null, { a: kr, size: 22, color: C.heroText, vcolor: C.heroText });
  if (o.note) text(o.note, xm, y + h - 8, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: ep(t, t0 + 0.4, t0 + 0.8) });
  const bot = o.note ? y + h - 46 : y + h;
  return { L: [x, top, wl, bot - top], R: [x + wl + gap, top, w - wl - gap, bot - top], xm };
}
/**
 * In place, the rival becomes Theseus: a thin line in Theseus's blue crosses rect from left to right over [t0, t0 + dur]
 * (E.cam); behind it (left of the line) drawTheseus, ahead of it drawRival. Both are drawn every frame with the same input,
 * so the press, the load and the camera carry through the wipe (M3, M9). Before t0 only the rival is drawn, after only
 * Theseus. Small names ride the line while it moves. o = { rival ('Most mice' or the rival's name), right ('Theseus'),
 *   ease (E.cam), labels (true), ly (the names' baseline, rect top + 30) }. Each draw fn gets (k: the wipe's progress).
 * Keep both drawings inside rect horizontally. Returns k.
 * e.g. wipeTo(t, 4.6, 0.9, box, k => drawTrig('smile'), k => drawTrig('straight'), { rival: 'Sora V2' })
 */
function wipeTo(t, t0, dur, area, drawRival, drawTheseus, o = {}) {
  const [x, y, w, h] = area, k = ep(t, t0, t0 + dur, o.ease || E.cam);
  if (k <= 0) { drawRival(0); return 0; }
  if (k >= 1) { drawTheseus(1); return 1; }
  const xw = x + w * k;
  /* each side is clipped to its side of the line; the QA records (?qa=1) are trimmed the same way, so tools/qa.js doesn't
     report the two drawings as overlapping text */
  const trim = (n0, keepRight) => {
    if (!QA.on) return;
    for (const L of [QA.text, QA.boxes]) {
      const kept = L.splice(keepRight ? n0[L === QA.text ? 0 : 1] : n0[L === QA.text ? 0 : 1]).filter(r => keepRight ? r.x1 > xw : r.x0 < xw);
      kept.forEach(r => { if (keepRight) r.x0 = Math.max(r.x0, xw); else r.x1 = Math.min(r.x1, xw); });
      L.push(...kept);
    }
  };
  let n0 = [QA.text.length, QA.boxes.length];
  clipped(xw, -H, W * 2, H * 3, () => drawRival(k)); trim(n0, true);
  n0 = [QA.text.length, QA.boxes.length];
  clipped(-W, -H, xw + W, H * 3, () => drawTheseus(k)); trim(n0, false);
  const la = Math.min(1, Math.sin(k * Math.PI) * 2.2);
  line(xw, y, xw, y + h, { color: C.hero, w: 2, alpha: la });
  if (o.labels !== false) {
    const ly = o.ly == null ? y + 30 : o.ly;
    text(o.right || 'Theseus', xw - 14, ly, { role: 'label', size: 19, color: C.heroText, align: 'right', alpha: la * clamp((xw - x - 30) / 120) });
    text(o.rival || 'Most mice', xw + 14, ly, { role: 'label', size: 19, color: o.rivalCol === 'grey' ? C.mute : C.secondText, alpha: la * clamp((x + w - xw - 30) / 120) });
  }
  return k;
}
/** which way is better, written on a chart or beside a number: an arrow and quiet caps. dir 'l' | 'r' | 'u' | 'd'.
   e.g. betterTag(t, 1.0, x, y, 'Lower is better', 'd') */
function betterTag(t, t0, x, y, s, dir = 'd', o = {}) {
  const a = ep(t, t0, t0 + 0.4) * (o.alpha == null ? 1 : o.alpha); if (a <= 0.003) return 0;
  const g = { l: '←', r: '→', u: '↑', d: '↓' }[dir], str = dir === 'r' ? s + '  ' + g : g + '  ' + s;
  return text(str, x, y, { role: 'label', size: o.size || 21, color: o.color || C.mute, align: o.align || 'left', alpha: a }).w;
}
/**
 * The heat scale's key (M's convention, MODELS-AUDIT §11; F19.3 "disclosure is the condition"): the deck's heat colours
 * (heatCol: grey, amber, orange, red) as a bar, and what they mean under it. Every slide that colours parts by heat draws
 * one beside them. Where the slide talks about breaking, colour by the share of strength used (feUse, red at 1) and key it
 * so (mode 'use': 0, 50 %, "Breaks"); where it compares stress as stress, by MPa (mode 'mpa', max: the MPa at the red end);
 * a frame coloured against its own peak, mode 'peak' (red is "Peak"). gamma: the exponent the slide colours with (the
 * shell chapters' squared scale, SHL_GAMMA = 2): each value sits at its true place on the bar in the colour it really
 * gets, and the title says so ("colour squared").
 * (x, y) = the bar's top left, w its width. o = { mode ('use' | 'mpa' | 'peak'), max, gamma (1), title, ticks ([0, 0.5, 1],
 *   as fractions of the range), dec (MPa ticks' decimals), alpha }. Returns { w, h } (title top to labels' foot: ~60 px).
 * e.g. heatKey(t, 2.0, 1580, 720, 240, { gamma: SHL_GAMMA });   // "Share of strength used, colour squared": 0 · 50 % · Breaks
 *      heatKey(t, 2.0, 1580, 720, 240, { mode: 'mpa', max: 207 });
 */
function heatKey(t, t0, x, y, w, o = {}) {
  const a = ep(t, t0, t0 + 0.4) * (o.alpha == null ? 1 : o.alpha); if (a <= 0.003) return { w, h: 0 };
  const mode = o.mode || 'use', gm = o.gamma || 1, bh = 10, sq = Math.abs(gm - 1) > 1e-6;
  const title = o.title || ({ use: 'Share of strength used', mpa: 'Stress', peak: 'Stress, against its peak' }[mode] || 'Stress') + (sq ? ', colour squared' : '');
  text(title, x, y - 14, { role: 'label', size: 19, color: C.mute, alpha: a });
  const g = G.createLinearGradient(x, 0, x + w, 0); for (let i = 0; i <= 16; i++) g.addColorStop(i / 16, heatCol(Math.pow(i / 16, gm)));
  G.save(); G.globalAlpha = a; G.fillStyle = g; rrPath(x, y, w, bh, bh / 2); G.fill(); G.restore();
  const dec = o.dec != null ? o.dec : (o.max || 0) >= 20 ? 0 : 1;
  for (const v of o.ticks || [0, 0.5, 1]) {
    const tx = x + w * clamp(v), end = v >= 0.999, zero = v <= 0.001;
    const lab = zero ? '0' : mode === 'mpa' ? kitNum((o.max || 0) * v, dec) + (end ? ' MPa' : '') : end ? (mode === 'use' ? 'Breaks' : 'Peak') : kitNum(v * 100, 0) + ' %';
    line(tx, y + bh + 3, tx, y + bh + 9, { color: C.faint, w: 1.5, alpha: a });
    text(lab, tx, y + bh + 30, { role: 'tick', size: 19, color: end && mode !== 'mpa' ? C.red : C.mute, align: zero ? 'left' : end ? 'right' : 'center', alpha: a });
  }
  return { w, h: 33 + bh + 30 };
}
/**
 * The one before → after headline of the deck (F14.10, F16.1). The old value appears where the new one will stand, then
 * re-counts to the new value in Theseus's gradient while a copy of the old slides left, shrinks, turns grey and is struck;
 * an arrow joins them; the net change lands under the row (by how much, never rounded up); the label says which way is better.
 * (x, y) = the row's left edge (or o.align's) and the big number's baseline.
 * o = { from, to (numbers or strings: one precision for both, G5), unit ('MPa', 'mm', '%': a space before it, as the film
 *   writes "17.6 %"; only '°' (an angle) and '×' (a factor) attach, SI Brochure 9th ed. §5.4.3, §5.4.7),
 *   label ('Peak experienced stress'), better ('lower' | 'higher' | null), net ('auto' | a string | false; auto: −56 %, or
 *   2.3× when higher is better and it more than doubles), netWord (after the net: 'less stress'), size (the new value, 150),
 *   dec, who: [the rival's name, 'Theseus'] (small names under the two values), dur (the count, 1.0), morph (true: the old
 *   value starts big in the new one's place; false: it waits, small and grey, from the start), align ('left' | 'right' |
 *   'center'), rivalCol ('second' | 'grey': the colour of the rival's name), maxW (the room for the row and its label: a
 *   row wider than it is set smaller, whole) }
 * The grammar (FILM F8, F15): the struck grey value is always the rival's (or most mice's, or an old design's) and the
 * blue one Theseus's. Never strike Theseus's own alternative: show an internal contrast as plain stats.
 * The names under the values never overlap: the rival's stays left of the new value, wrapped to two lines when it is
 * longer than the old value and the arrow, and only a single word too long for that moves Theseus's name right.
 * Returns { w, h, x0 } (the row's left edge and size, for layout).
 * e.g. verdict(t, 6.4, 120, 860, { from: 33.4, to: 0, unit: '%', dec: 1, label: 'Sideways at the switch', better: 'lower', who: ['Sora V2', 'Theseus'] })
 */
function verdict(t, t0, x, y, o = {}) {
  const size = o.size || 150, dur = o.dur || 1.0, num = v => typeof v === 'number' ? v : parseFloat(String(v).replace(/−/g, '-').replace(/[^\d.\-]/g, ''));
  const f0 = num(o.from), f1 = num(o.to), dec = o.dec != null ? o.dec : Math.max(kitDec(o.from), kitDec(o.to));
  /* tight: a symbol set big (%, °, ×); glue: one that attaches to its number (° and ×; % and every unit take a space) */
  const u = o.unit || '', tight = /^(%|°|×|x)$/.test(u), glue = /^(°|×|x)$/.test(u), fmt = v => kitNum(v, dec), betterHigh = o.better === 'higher';
  /* the net, by how much, from the true values and rounded toward zero, so a claim is never rounded up (DESIGN §9) */
  let net = null;
  if (typeof o.net === 'string' && o.net !== 'auto') net = o.net;
  else if (o.net !== false && f0 !== 0 && isFinite(f0) && isFinite(f1) && !(f1 === 0 && !betterHigh) && !/^(×|x)$/.test(u)) {
    const r = f1 / f0, pct = (f1 - f0) / Math.abs(f0) * 100, mag = Math.abs(pct), down = (v, d) => Math.floor(v * Math.pow(10, d) + 1e-9) / Math.pow(10, d);
    net = betterHigh && r >= 2 ? down(r, 1).toFixed(1) + '×' : (pct < 0 ? '−' : '+') + (mag < 10 ? down(mag, 1).toFixed(1) : String(Math.floor(mag + 1e-9))) + ' %';
  }
  const a0 = ep(t, t0, t0 + 0.35); if (a0 <= 0.003) return { w: 0, h: 0, x0: x };
  /* c0: the old value peels off to the left (an identical copy, so nothing overlaps but itself); cs: once it has cleared, the
     big figure counts down to the new value; c1: it lands */
  const c0 = t0 + 0.35, morph = o.morph !== false, cs = morph ? c0 + 0.42 : c0, c1 = cs + dur;
  const kc = E.out3(prog(t, cs, c1)), kg = ep(t, c1 - 0.4, c1 + 0.05), kn = ep(t, c1 - 0.1, c1 + 0.4, E.snap);
  const km = morph ? ep(t, c0, c0 + 0.6, E.cam) : 1, ks = ep(t, c0 + 0.45, c0 + 0.8), kar = ep(t, c0 + 0.25, c0 + 0.7);
  /* sizes: the new value huge, its unit a third of it; the old value two fifths, its unit half of that */
  const bS = Math.max(36, Math.round(size * 0.4)), uK = tight ? 0.55 : 0.3, uS = Math.max(24, Math.round(size * uK));
  const uGap = z => (glue ? 0.03 : 0.16) * z, stOld = { role: 'd1', size: bS, weight: 800, track: -0.02, tnum: true }, stBig = { role: 'd1', size, weight: 800, track: -0.03, tnum: true };
  const sOld = fmt(f0), sNew = fmt(f1), uw = z => (u ? uGap(z) + tw(u, { font: 'disp', size: z === size ? uS : Math.max(21, Math.round(z * (tight ? 0.6 : 0.5))), weight: 700, caps: false }) : 0);
  const wOld = tw(sOld, stOld) + uw(bS), arW = Math.round(size * 0.34), g1 = Math.round(size * 0.13), wBig = tw(sNew, stBig) + uw(size);
  const total = wOld + g1 + arW + g1 + wBig;
  /* the row keeps within maxW (callers pass the room to the margin): a row too wide for it is set smaller, whole */
  if (o.maxW && total > o.maxW + 0.5 && (o.fitN || 0) < 4 && size > 40) return verdict(t, t0, x, y, Object.assign({}, o, { size: Math.max(40, size * o.maxW / total * 0.985), fitN: (o.fitN || 0) + 1 }));
  const x0 = o.align === 'right' ? x - total : o.align === 'center' ? x - total / 2 : x, xBig = x0 + wOld + g1 + arW + g1;
  /* the label, with which way is better (F14.8: "Peak experienced stress (lower is better)") */
  if (o.label || o.better) {
    const lab = (o.label || '') + (o.better ? (o.label ? ' ' : '') + '(' + o.better + ' is better)' : '');
    const la = o.align === 'right' || o.align === 'center' ? o.align : 'left';   /* the label keeps to the row's side */
    text(lab, la === 'left' ? x0 : x, y - size * 0.78 - 26, { role: 'label', size: 22, color: C.mute, alpha: a0, maxW: o.maxW || Math.max(total, 640), align: la });
  }
  /* a unit run for a figure of size z, k of the way from the big figure's style (0) to the old value's (1) */
  const unitRun = (z, k, col, grad) => u ? { s: u, font: 'disp', size: Math.max(21, Math.round(z * lerp(uK, tight ? 0.6 : 0.5, k))), weight: 700, color: col, grad, gap: uGap(z), caps: false } : null;
  /* the old value's copy: with morph it starts exactly over the big figure and flies left, shrinking and greying, to its
     struck place; without morph it waits there, small and grey, from the start */
  if (!morph || km > 0.001) {
    const grey = TH ? '#8A8983' : '#6E6D68', bs = lerp(size, bS, km), col = mix(TH ? '#111111' : '#F3F2EE', grey, km), ucol = mix(C.mute, grey, km);
    rich([{ s: sOld, role: 'd1', size: bs, weight: 800, track: lerp(-0.03, -0.02, km), color: col, tnum: true }, unitRun(bs, km, ucol)], lerp(xBig, x0, km), y, { alpha: a0 });
  }
  if (ks > 0) line(x0 - 4, y - bS * 0.34, x0 - 4 + (wOld + 8) * ks, y - bS * 0.34, { color: C.mute, w: Math.max(2.5, bS * 0.06), alpha: a0 });
  if (kar > 0) arrow(x0 + wOld + g1, y - bS * 0.36, x0 + wOld + g1 + arW, y - bS * 0.36, { color: C.faint, w: Math.max(2.5, size * 0.022), hs: Math.max(12, size * 0.09), p: kar, alpha: a0 });
  /* the big figure: the old value until the count starts, then counting to the new one; ink until it lands, then
     Theseus's gradient, cross-faded so the colour arrives rather than switching */
  { const sv = fmt(lerp(f0, f1, kc)), runs = c => [{ s: sv, role: 'd1', size, weight: 800, track: -0.03, color: c ? C.heroText : C.ink, grad: c ? C.heroGrad : null, tnum: true }, unitRun(size, 0, c ? C.heroText : C.mute, c ? C.heroGrad : null)];
    /* with morph it hands over to the peeling copy at c0 (the two are the same frame there) and comes back, counting from
       the old value, once the copy has cleared: it never stands under the moving copy (no doubled digits or units, b08) */
    const kb = !morph || t < c0 ? 1 : ep(t, cs, cs + 0.18);
    if (kg < 1 && kb > 0) rich(runs(false), xBig, y, { alpha: a0 * kb * (1 - kg) });
    if (kg > 0 && kb > 0) rich(runs(true), xBig, y, { alpha: a0 * kb * kg }); }
  /* under the row: whose each value is, then the net in Theseus's colour */
  let yy = y + Math.round(size * 0.06) + 34;
  if (o.who) {
    const kw = ep(t, cs, cs + 0.4), wst = { role: 'label', size: 19 }, room = xBig - x0 - 20;
    /* the rival's name keeps to its own column, left of the new value: wrapped to two lines when it is longer than the old
       value and the arrow; only a single word too long for that moves Theseus's name right, so the two never overlap */
    let l0 = o.who[0] ? [String(o.who[0])] : [];
    if (l0.length && tw(l0[0], wst) > room) {                          /* two lines, split where they come out most even */
      const ws = l0[0].split(' '); let bw = Infinity;
      for (let i = 1; i < ws.length; i++) { const a = ws.slice(0, i).join(' '), b = ws.slice(i).join(' '), m = Math.max(tw(a, wst), tw(b, wst)); if (m < bw) { bw = m; l0 = [a, b]; } }
    }
    const w0 = l0.reduce((m, l) => Math.max(m, tw(l, wst)), 0), x1 = l0.length && x0 + w0 + 20 > xBig ? x0 + w0 + 24 : xBig;
    l0.forEach((l, i) => text(l, x0, yy + i * 23, Object.assign({ color: o.rivalCol === 'grey' ? C.faint : C.secondText, alpha: kw * a0 }, wst)));
    if (o.who[1]) text(o.who[1], x1, yy, Object.assign({ color: C.heroText, alpha: kg * a0 }, wst));
    yy += 52;
  } else yy += 10;
  if (net && kn > 0) {
    G.save(); G.translate(0, (1 - kn) * 10);
    rich([{ s: net, font: 'disp', size: Math.max(30, Math.round(size * 0.24)), weight: 800, color: C.heroText, caps: false }, o.netWord ? { s: o.netWord, role: 'small', size: 26, weight: 650, color: C.ink2, gap: 12, sentence: false } : null], o.who ? xBig : x0, yy, { alpha: kn * a0 });
    G.restore();
  }
  return { w: total, h: size + (yy - y), x0 };
}

/* ================================ the shot (used sparingly) ================================ */

/**
 * The missed or made shot, small and crisp: a crosshair flicks onto a target, the click lands at t0 + at; on the rival
 * (miss: true) its fault pulls the crosshair off by drift px at that moment and the shot lands wide (MISS, red); on
 * Theseus it holds (HIT, blue). Use it only where a missed shot is the strongest case for the feature (common.md, F33.6).
 * o = { miss, drift (px, h * 0.16), dir (radians the fault pulls, 0.35), at (1.0 s), label (a few words under it: what
 *   caused it), result (true: MISS / HIT word) }. Returns { hit }.
 * e.g. shotInset(t, 2.0, 1500, 300, 300, 200, { miss: true, label: 'The click twists your aim' })
 */
function shotInset(t, t0, x, y, w, h, o = {}) {
  const a = ep(t, t0, t0 + 0.4, E.snap); if (a <= 0.003) return { hit: !o.miss };
  const miss = !!o.miss, at = o.at == null ? 1.0 : o.at, drift = o.drift == null ? h * 0.16 : o.drift, dir = o.dir == null ? 0.35 : o.dir;
  const tc = t0 + at, ts = tc + 0.07;
  demoWindow(x, y, w, h, a, { fill: TH ? '#E9E8E3' : '#0B0C0D' });
  const tx = x + w * 0.6, ty = y + h * 0.44, tr = Math.max(6, Math.min(w, h) * 0.06), sx = x + w * 0.2, sy = y + h * 0.74;
  const kf = spring(t, tc - 0.75, { f: 2.2, z: 0.7 }), pull = miss ? spring(t, tc, { f: 9, z: 0.55 }) : 0;
  const cx = lerp(sx, tx, kf) + Math.cos(dir) * drift * pull, cy = lerp(sy, ty, kf) + Math.sin(dir) * drift * pull;
  const shot = t >= ts ? [lerp(sx, tx, spring(ts, tc - 0.75, { f: 2.2, z: 0.7 })) + (miss ? Math.cos(dir) * drift * spring(ts, tc, { f: 9, z: 0.55 }) : 0),
    lerp(sy, ty, spring(ts, tc - 0.75, { f: 2.2, z: 0.7 })) + (miss ? Math.sin(dir) * drift * spring(ts, tc, { f: 9, z: 0.55 }) : 0)] : null;
  clipped(x, y, w, h, () => {
    G.save(); G.globalAlpha = a;
    const tgt = TH ? '#111111' : '#F3F2EE';
    circle(tx, ty, tr * 2.4, { color: inkA(0.18), w: 1.5 }); circle(tx, ty, tr, { fill: tgt });
    if (shot) {
      const kh = prog(t, ts, ts + 0.35);
      if (!miss) { circle(tx, ty, tr * (1.4 + 1.6 * E.out3(kh)), { color: C.hero, w: 3 * (1 - kh) + 0.5, alpha: 1 - kh }); circle(shot[0], shot[1], tr * 0.42, { fill: C.hero }); }
      else { const r = tr * 0.55; line(shot[0] - r, shot[1] - r, shot[0] + r, shot[1] + r, { color: C.red, w: 3 }); line(shot[0] - r, shot[1] + r, shot[0] + r, shot[1] - r, { color: C.red, w: 3 }); }
    }
    /* the crosshair: four strokes round a gap and a centre dot, the colour of the type */
    const g = tr * 0.9, l2 = tr * 1.5, ch = TH ? '#111111' : '#FFFFFF';
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) line(cx + dx * g, cy + dy * g, cx + dx * (g + l2), cy + dy * (g + l2), { color: ch, w: 2.5 });
    circle(cx, cy, 1.8, { fill: ch });
    G.restore();
  });
  if (o.result !== false && shot) { const kr = ep(t, ts, ts + 0.25); text(miss ? 'Miss' : 'Hit', x + w - 18, y + 36, { role: 'label', size: 22, color: miss ? C.red : C.heroText, align: 'right', alpha: kr * a }); }
  if (o.label) text(o.label, x + 18, y + h - 18, { role: 'label', size: 19, color: C.mute, alpha: a, maxW: w - 36 });
  return { hit: !miss };
}

/* ================================ teaching ================================ */

/**
 * A quiet frame for a classroom demonstration (F33.8): a hairline drawn round rect from t0, a small label at its top left
 * ('The classroom version'), the teaching source at its top right ('Gordon 1978'). Returns the inner rect [x, y, w, h].
 * o = { label, src, pad (28) }. e.g. const r = demoPanel(t, 0.3, [80, 280, 700, 560], { src: 'Feynman Lectures 1964' })
 */
function demoPanel(t, t0, area, o = {}) {
  const [x, y, w, h] = area, k = ep(t, t0, t0 + 0.8, E.cam), pad = o.pad == null ? 28 : o.pad;
  if (k > 0) {
    const per = 2 * (w + h); G.save(); G.globalAlpha = clamp(k * 2); rrPath(x, y, w, h, 6); G.fillStyle = C.bg; G.fill(); G.globalAlpha = 1;
    G.setLineDash([per * k, per]); G.strokeStyle = C.hair; G.lineWidth = 1.5; rrPath(x + 0.75, y + 0.75, w - 1.5, h - 1.5, 6); G.stroke(); G.restore();
  }
  const ka = ep(t, t0 + 0.15, t0 + 0.55);
  text(o.label || 'The classroom version', x + pad, y + pad + 18, { role: 'label', size: 21, color: C.mute, alpha: ka });
  if (o.src) text(o.src, x + w - pad, y + pad + 18, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ka, caps: false, forceCaps: false });
  return [x + pad, y + pad + 44, w - pad * 2, h - pad * 2 - 44];
}
/**
 * One quiet line of human scale (M5, G2): a short rule, then the line. s = 'about the weight of a 56 g egg'; o.lead = a
 * bold first part ('0.55 N'). o = { lead, t, t0 (types it in), align, maxW, color, size (25) }. Returns its width.
 * e.g. scaleNote(120, 900, 'about the weight of a 56 g egg', { lead: '0.55 N', t, t0: 2.0 })
 */
function scaleNote(x, y, s, o = {}) {
  const a = o.t0 != null ? ep(o.t, o.t0, o.t0 + 0.3) : 1; if (a <= 0.003) return 0;
  const kn = o.knock == null ? y > 935 : o.knock;   /* at the foot, on the bare paper: knock the grid's + out from under it */
  const size = o.size || 25, runs = [o.lead ? { s: o.lead, role: 'small', size, weight: 750, color: C.ink2, knock: kn } : null, { s, role: 'small', size, weight: 600, color: o.color || C.mute, gap: o.lead ? 10 : 0, sentence: !o.lead, knock: kn }];
  const r = rich(runs, x + 34, y, { alpha: a, align: 'left' });
  line(x, y - size * 0.32, x + 22, y - size * 0.32, { color: C.faint, w: 1.5, alpha: a });
  return r.w + 34;
}
/** Sizes and forces people know, with where each comes from, for scaleNote (M5). Add to it in your own file if you need
   more; cite the source on the slide where it matters. */
const SCALE = {
  hair: { mm: 0.07, say: 'a human hair (about 0.07 mm)', src: 'Ley 1999, The Physics Factbook: 17 to 181 µm' },
  paper: { mm: 0.1, say: 'a sheet of copy paper (0.1 mm)', src: '80 g/m² office paper' },
  card: { mm: 0.76, say: 'a credit card (0.76 mm thick)', src: 'ISO/IEC 7810 ID-1' },
  penny: { mm: 1.52, d: 19.05, g: 2.5, say: 'a US penny (1.52 mm thick, 2.5 g)', src: 'US Mint coin specifications' },
  quarter: { mm: 1.75, d: 24.26, g: 5.67, say: 'a US quarter (24.26 mm across, 5.67 g)', src: 'US Mint coin specifications' },
  click: { N: 0.54, say: 'a GT01 click: 55 gf, the weight of 55 g', src: 'Gateron claim (55 ± 5 gf)' },
  egg: { g: 57, N: 0.56, say: 'a large egg (about 57 g)', src: 'USDA egg size classes (large: at least 24 oz a dozen)' }
};

/* ================================ flow: the compromise ledger and the chapter card ================================
   The film's thread (common.md, "Clips and flow"): every flagship gives something up; each chapter opens on the compromise
   most mice make in its area and answers it; the close answers them all. A first draft of the words: the chapter builders
   may propose better ones (short: they set in one line at 25 to 40 px). */
const LEDGER = [
  { ch: 'intro', name: 'Weight', comp: 'Light or long-lasting: pick one', ans: THS.massG + ', ' + THS.hours + ' of battery' },
  { ch: 'click', name: 'Clicks', comp: 'A click that changes with where you press, or costs battery', ans: 'Lands the same, every time' },
  { ch: 'glide', name: 'Glide', comp: 'Skates and sensors that cost your aim', ans: 'Aim that goes where you put it' },
  { ch: 'shell', name: 'Shell', comp: 'Light shells that flex, creak and crack', ans: 'Light, without the flex, creak or crack' },
  { ch: 'surface', name: 'Surface', comp: 'Tape that peels, coatings that wear', ans: 'Grip that holds, and stays' },
  { ch: 'elec', name: 'Electronics', comp: 'Wireless that costs latency, battery or weight', ans: 'Wireless with no penalty' },
  { ch: 'shape', name: 'Shape', comp: 'Shapes cut down for weight, or chosen by taste', ans: 'A shape measured on hands' },
  { ch: 'own', name: 'Ownership', comp: 'Glued, soldered, thrown away', ans: 'Made to last, and to open' }
];
function ledgerOf(ch) { return LEDGER.find(e => e.ch === ch) || null; }
/* The flagships b01_compromise names, each under the chapter whose compromise it makes (FILM F1, 2026-11-06): read live
   from b01's B01_TRADES, so the intro, the chapter cards and the close can't drift apart. Glide, surface and ownership
   have no flagship ("most mice"). Returns a sentence, or null when there is none (or b01's file isn't in the build). */
function ledgerFlag(ch) {
  const T = id => (typeof B01_TRADES !== 'undefined' && B01_TRADES.find(x => x.id === id)) || null;
  const lc = s => s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
  const say = {
    intro: () => { const a = T('logitech-x3'), b = T('gw-hts-ultra'); return a && b ? 'Like the ' + a.name + ' at ' + a.fig + ', or the ' + b.name + ' at ' + b.fig + ' of battery' : null; },
    click: () => { const a = T('razer-viper-v4-pro'); return a ? 'Like the ' + a.name + ': ' + a.fig + ' of its battery to its clicks (derived)' : null; },
    shell: () => { const a = T('finalmouse-ulx'); return a ? 'Like the ' + a.name + ': flexes and creaks (' + a.tag + ')' : null; },
    shape: () => { const a = T('pulsar-x2f-crazylight'); return a ? 'Like the ' + a.name + ': ' + lc(a.fig) : null; },
    elec: () => { const a = T('xbab-xa25'); return a ? 'Like the ' + a.name + ': ' + lc(a.fig) : null; }
  }[ch];
  return say ? say() : null;
}
/** the set of chapters answered: o.answered = 'all' | 'before' (every chapter before o.focus) | [keys] | 'none' */
function ledgerAnswered(o) {
  if (o.answered === 'all') return new Set(LEDGER.map(e => e.ch));
  if (Array.isArray(o.answered)) return new Set(o.answered);
  if (o.answered === 'before' || (o.answered == null && o.focus)) { const i = LEDGER.findIndex(e => e.ch === o.focus); return new Set(LEDGER.slice(0, Math.max(0, i)).map(e => e.ch)); }
  return new Set();
}
/**
 * The ledger as a list: each chapter's name, the compromise most mice make, and Theseus's answer. Open compromises are set
 * in ink with a red mark; the focused one in red; answered ones struck, with the answer in blue beside them. A row whose
 * answer lands at a given time animates: the strike draws, the answer types in.
 * o = { focus (a chapter key), answered ('all' | 'before' | [keys] | 'none'), turn (when the focused or, with 'all', every
 *   row turns: a time or { key: time }), turnStep (0.12: rows turning one after another), rh (row height, 64), nameW (210),
 *   rows (chapter keys to show, in order) }.
 * e.g. ledger(t, 0.6, [80, 300, 1760, 560], { answered: 'all', turn: 2.0 })
 */
function ledger(t, t0, area, o = {}) {
  const [x, y, w, h] = area, rows = (o.rows || LEDGER.map(e => e.ch)).map(ledgerOf).filter(Boolean), n = rows.length;
  const rh = Math.min(o.rh || 64, h / Math.max(1, n)), nameW = o.nameW || 210, cw = (w - nameW - 40) / 2, ans = ledgerAnswered(o);
  const step = o.turnStep == null ? 0.12 : o.turnStep;
  rows.forEach((e, i) => {
    const yy = y + i * rh, by = yy + rh * 0.62, a = stagger(t, t0, i, 0.07, 0.45), isF = e.ch === o.focus;
    if (a <= 0.003) return;
    if (i) line(x, yy, x + w * a, yy, { color: C.hair, w: 1.2 });
    /* when this row's answer lands: its own time, the focus's turn, or (answered: 'all') one row after another */
    let tt = null;
    if (o.turn != null && typeof o.turn === 'object') tt = o.turn[e.ch] == null ? null : o.turn[e.ch];
    else if (o.turn != null) tt = isF ? o.turn : o.answered === 'all' ? o.turn + i * step : null;
    const kt = tt != null ? ep(t, tt, tt + 0.5) : ans.has(e.ch) ? 1 : 0;
    text(e.name, x, by, { role: 'label', size: 22, color: isF ? C.ink : C.mute, alpha: a });
    const cx = x + nameW, cSt = { role: 'small', size: 25, weight: 650 };
    const open = isF ? C.red : C.ink2, cc = kt > 0 ? mix(isF ? C.red : TH ? '#2E2E2C' : '#CFCEC9', TH ? '#8A8983' : '#6E6D68', kt) : open;
    if (!isF && kt < 1) rect(cx - 16, by - 18, 4, 18, { fill: C.red, alpha: a * 0.9 * (1 - kt) });
    text(e.comp, cx, by, Object.assign({ color: cc, alpha: a, maxW: cw - 24 }, cSt));
    if (kt > 0) {
      const cwid = Math.min(cw - 24, tw(e.comp, cSt)), ax = cx + cw + 40;
      line(cx - 3, by - 9, cx - 3 + (cwid + 6) * clamp(kt * 1.6), by - 9, { color: C.mute, w: 2, alpha: a });
      text('→', ax - 34, by, { font: 'disp', size: 26, weight: 700, color: C.faint, alpha: a * clamp(kt * 2) });
      text(e.ans, ax, by, { role: 'small', size: 25, weight: 750, color: C.heroText, alpha: a, t, t0: tt != null ? tt + 0.15 : null, cps: 80, maxW: cw - 24 });
    }
  });
}
/**
 * The ledger as a strip, for a chapter card: one short bar per chapter with its name under it; red for the compromise
 * still open, blue once answered, grey ahead. The focused chapter's bar starts red and Theseus's blue fills it from the
 * left at o.turn. (x, y) = the bars' top left, w their width. o = { focus, answered ('before'), turn (time) }.
 * e.g. ledgerStrip(t, 0.8, 80, 900, 1760, { focus: 'click', turn: 2.2 })
 */
function ledgerStrip(t, t0, x, y, w, o = {}) {
  const n = LEDGER.length, gap = 16, cw = (w - gap * (n - 1)) / n, ans = ledgerAnswered(Object.assign({ answered: 'before' }, o));
  LEDGER.forEach((e, i) => {
    const xx = x + i * (cw + gap), a = stagger(t, t0, i, 0.05, 0.4); if (a <= 0.003) return;
    const isF = e.ch === o.focus, done = ans.has(e.ch);
    rect(xx, y, cw, 4, { fill: done ? C.hero : isF ? C.red : C.track, alpha: a });
    if (isF && o.turn != null) { const kt = ep(t, o.turn, o.turn + 0.6, E.cam); if (kt > 0) rect(xx, y, cw * kt, 4, { fill: C.hero, alpha: a }); }
    text(e.name, xx, y + 32, { role: 'label', size: 21, color: isF ? C.ink : done ? C.ink2 : C.faint, alpha: a });
  });
}
/**
 * The chapter opener, the same family for every chapter and a clip on its own: the chapter's number and name; the
 * compromise most mice make in its area, in red (the problem first); then Theseus's answer in its blue as the compromise
 * is struck; the ledger strip along the foot (this chapter turning from red to blue); the ideas in the chapter; and a
 * simplified part on the right. Use with S({ ..., card: true, first: true, settle: 5.5, draw: t => chapterCard2(t, {...}) }).
 * o = { ch (default the slide's), name (the chapter's display name), compromise, answer (default from LEDGER), list
 *   ([[ideas, 'what'], ...], up to 9), part ({ view, hi } for the simplified mouse with the part lit, or a function
 *   (t, box, k) that draws its own part in box; k: 0 before the answer, 1 after), turn (2.1 s: when the answer lands),
 *   count (the number of ideas, default chapterIdeaCount), flag (the flagship line under the compromise: default
 *   ledgerFlag(ch), a string to override, false to hide) }.
 * e.g. draw: t => chapterCard2(t, { ch: 'click', part: { view: 'top', hi: ['triggers'] }, list: [[17, 'Straight rear cutouts']] })
 */
/* what each chapter card's part last drew of the simplified mouse (F0c): while chapterCard2 draws its part, every
   mouseSimple call is recorded (view, transform, options), and CARD2.rec[slide id] keeps the last frame's. The player's
   chapter flight reads it to land exactly on the card's own mouse, and to leave from it going back. Nothing to do in a
   slide: a part drawn with mouseSimple or mouseFit (as { view, hi } or in your own function) is seen; a part drawn some
   other way gets a soft hand-off instead, or the slide can say where its mouse sits with flight: { view, box, pad }.
   While the flight is on screen it sets CARD2.hide: the card's part still runs (so it is seen) but its kit mouse is left to
   the flight, which draws the same mouse, so there is only ever one */
const CARD2 = { cap: null, rec: {}, hide: false, skip: null };
function chapterCard2(t, o = {}) {
  const key = o.ch || (typeof curSlide === 'function' && curSlide() ? curSlide().ch : 'click'), L = ledgerOf(key) || { name: key, comp: '', ans: '' };
  const chs = typeof DECK !== 'undefined' ? DECK.chapters : [], ci = chs.findIndex(c => c.key === key), nCh = Math.max(1, chs.length - 2);
  const name = o.name || (ci >= 0 ? chs[ci].name : L.name), comp = o.compromise || L.comp, ans = o.answer || L.ans, turn = o.turn == null ? 2.1 : o.turn;
  /* frame one is the clip's thumbnail (FILM F12, as header() since 2026-11-06): the label row, the name, the rule and the
     compromise in red are fully set at t = 0; in the film the flight is their entrance. The motion is the payoff: the
     strike, Theseus's answer, the ideas, the ledger turning blue, the part lighting */
  /* the label row: the chapter's icon and number, and the idea count at the right (XBAB's TOTAL) */
  chapterIcon(key, LM, LAY.labelY - 19, 22, C.ink, 1);
  rich([{ s: 'Chapter ' + pad2(Math.max(0, ci)), role: 'label', size: 22, color: C.ink }, { s: '/ ' + pad2(nCh), role: 'label', size: 22, color: C.faint, gap: 12 }], LM + 36, LAY.labelY, { t });
  const n = o.count != null ? o.count : typeof chapterIdeaCount === 'function' ? chapterIdeaCount(key) : (o.list || []).length;
  if (n) {
    text('Ideas in this chapter', RM, LAY.labelY, { role: 'label', size: 21, color: C.mute, align: 'right' });
    rich([{ s: String(n), role: 'd1', size: 110, color: C.ink, tnum: true }], RM, LAY.labelY + 112, { t, align: 'right' });
  }
  /* the name, as big as the left column allows */
  const colW = 840, nm = caps(name), size = Math.min(150, colW / Math.max(1, tw(nm, { role: 'd2', size: 1, caps: false })));
  text(nm, LM - size * 0.04, 318, { role: 'd2', size, weight: 900, color: C.ink, t });
  line(LM, 362, LM + colW, 362, { color: C.hair, w: 1.5 });
  /* the problem first: what most mice give up here, in red; then struck as Theseus's answer lands */
  const kt = ep(t, turn, turn + 0.45), cSt = { role: 'h3', size: 36, weight: 700 };
  text('Most mice', LM, 430, { role: 'label', size: 22, color: C.mute });
  const cr = text(comp, LM, 482, Object.assign({ color: mix(C.red, TH ? '#8A8983' : '#6E6D68', kt), t, maxW: colW, lh: 1.18 }, cSt));
  if (kt > 0) { const lines = wrap(sentence(comp), cSt, colW); lines.forEach((l, i) => { const lw2 = tw(l, cSt), kl = clamp(kt * lines.length - i); if (kl > 0) line(LM - 3, 482 + i * 36 * 1.18 - 11, LM - 3 + (lw2 + 6) * kl, 482 + i * 36 * 1.18 - 11, { color: C.mute, w: 2.5 }); }); }
  /* which flagship makes this compromise (FILM F1): small, under it, so the card carries the intro's six trades */
  const flag = o.flag === false ? null : (o.flag || ledgerFlag(key)), fy = 482 + Math.max(1, cr.lines.length) * 36 * 1.18 + 8;
  if (flag) text(flag, LM, fy, { role: 'small', size: 22, weight: 600, color: C.mute, maxW: colW });
  const ay = 482 + Math.max(1, cr.lines.length) * 36 * 1.18 + 62 + (flag ? 34 : 0);
  text('Theseus', LM, ay, { role: 'label', size: 22, color: C.heroText, alpha: ep(t, turn, turn + 0.3) });
  text(ans, LM - 2, ay + 58, { font: 'disp', size: 48, weight: 800, track: -0.01, color: C.heroText, grad: C.heroGrad, t, rise: [turn + 0.05, 0.75], maxW: colW, lh: 1.05, caps: false });
  /* the ideas, in columns along the bottom */
  const list = (o.list || []).slice(0, 9);
  if (list.length) {
    const cols = list.length > 6 ? 3 : 2, rows = Math.ceil(list.length / cols), cwid = (RM - LM - 40 * (cols - 1)) / cols, y0 = 760, rh = Math.min(44, 112 / Math.max(1, rows - 1) || 44);
    list.forEach((l, i) => {
      const c = Math.floor(i / rows), r = i % rows, xx = LM + c * (cwid + 40), yy = y0 + r * rh, k = stagger(t, turn + 0.6, i, 0.07, 0.4);
      if (k <= 0.003) return;
      text(pad2(i + 1), xx, yy, { role: 'tick', size: 21, color: C.faint, alpha: k });
      text(l[1], xx + 46, yy, { role: 'small', size: 25, weight: 600, color: C.ink, alpha: k, maxW: cwid - 46 - 120 });
      text(typeof l[0] === 'number' ? '#' + l[0] : String(l[0]), xx + cwid, yy, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: k });
    });
  }
  /* the ledger along the foot */
  ledgerStrip(t, -2, LM, 900, RM - LM, { focus: key, turn: turn + 0.1 });
  /* the part, on the right: frame one shows it (M6); lit neutral while the problem stands, Theseus's blue once answered */
  const box = [1000, 200, 840, 500], ka = 1;
  /* the player's chapter flight lands on this mouse: every mouseSimple drawn for the part is seen (CARD2) */
  CARD2.cap = [];
  try { chapterCardPart(t, o, box, ka, kt); }
  finally { CARD2.rec[typeof curSlide === 'function' && curSlide() ? curSlide().id : key] = { box, caps: CARD2.cap, t }; CARD2.cap = null; }
}
/** chapterCard2's part (its own drawing, or the simplified mouse with the part lit) */
function chapterCardPart(t, o, box, ka, kt) {
  if (typeof o.part === 'function') o.part(t, box, kt);
  else if (o.part) {
    const pv = o.part.view || 'top', hi = o.part.hi || [], lit = ep(t, 0.15, 0.55), col = mix(TH ? '#111111' : '#F3F2EE', HU.hero[TH ? 0 : 1], kt);   /* the part lights as establish's does */
    const hiMap = {}; (Array.isArray(hi) ? hi : [hi]).forEach(h => (hiMap[h] = col));
    mouseFit(box, pv, { hi: hiMap, lit, alpha: ka, pad: o.part.pad == null ? 0.04 : o.part.pad, show: o.part.show });
  }
}
