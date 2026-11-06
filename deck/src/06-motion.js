/* ============================================================================================
   06-motion.js: THE MOTION KIT (revamp v2, F0a). One visual language for every slide of the film.
   The standard is handoff/revamp2/common.md (M1 to M10); the API with examples and the rules of use are in
   handoff/revamp2/KIT.md. Every function here is a pure function of slide time t (no state between frames
   except caches keyed by their inputs), and every one works on both grounds (paper TH = 1, night TH = 0).

     time ........ spring, springKeys, pressCurve, pressInfo, pressCross, beats, stagger, recount
     camera ...... cam, camFit, withCam
     the mouse ... mouseSimple, mouseFit, msBox, msAt, MS_DIMS   (one simplified Theseus, from the scan)
     place ....... establish, locator
     agents ...... finger, forceArrow, faultTag, fixTag   (and the deck's pointer: cursorAt)
     compare ..... abSplit, wipeTo, verdict, betterTag
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
      board: [-26, -bd[3] * MS_K.y - 6, 52, (bd[3] - bd[1]) * MS_K.y + 12], battery: [-24, 4, 48, 38], antenna: [-18, -28, 36, 30] };
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
    const bd = L.board; add('board', { dash: [msRR(Math.min(sg * bd[1], sg * bd[3]), -5.05, Math.abs(bd[3] - bd[1]), 1.05, 0.3)] });
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
      board: [Math.min(sg * -12, sg * 54), -16, 66, 18], battery: [Math.min(sg * -6, sg * -40), -16, 34, 18] };
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

const FINGER = { w: 13.5, top: 16, nail: TH => (TH ? '#DCDBD6' : '#7A7973') };
/**
 * A fingertip in mono grey (never peach, F9.24), to scale: (x, y) is the contact point on the surface it presses, ang the
 * direction it points (radians: 0 points right, PI/2 down). Put (x, y) on the surface and move it with the part: the
 * finger rides the button down. view 'side' (the default) shows it from the side, the pad under it; 'top' from above,
 * the nail up; 'end' end-on, as a front view of a button sees it (then ang tilts it: 0 upright, the pad down). o = { s (px per mm, 3.2), press (0..1: the pad flattens on the surface), view, len (mm of finger shown,
 *   46; the far end fades out), alpha, flip (put the pad on the other side) }.
 * e.g. finger(p[0], p[1] + d * 6, -0.08, { s: est.s, press: d })
 */
function finger(x, y, ang = 0, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; if (a <= 0.003) return;
  const s = o.s || 3.2, L = o.len || 46, p = clamp(o.press || 0), view = o.view || 'side';
  const skin = TH ? '#C4C3BD' : '#5F5E59', edge = TH ? 'rgba(40,40,38,0.6)' : 'rgba(230,230,225,0.45)', nail = FINGER.nail(TH);
  G.save(); G.globalAlpha = a; G.translate(x, y); G.rotate(ang);
  const flip = o.flip != null ? o.flip : view !== 'end' && Math.cos(ang) < -1e-6; if (flip) G.scale(1, -1);
  G.scale(s, s); G.lineJoin = 'round'; G.lineCap = 'round';
  const fadeFill = (col, al) => { const g = G.createLinearGradient(-L, 0, -L + 16, 0); g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, al)); return g; };
  const edgeCol0 = TH ? '#282826' : '#E6E6E1', ea = TH ? 0.6 : 0.45;
  if (view === 'end') {
    /* end-on: the fingertip's section, 15.5 mm across and 12.5 mm high, the pad under it flattening on the surface, the nail's
       arc on top (contact at 0, 0; the finger comes toward the viewer, so there is no far end to fade) */
    const hw = 7.75, ht = 12.5, af = 3.2 * p, body = new Path2D();
    body.moveTo(-af, 0); body.lineTo(af, 0);
    body.bezierCurveTo(af + 3.2, 0, hw, -2.4, hw, -5.6); body.bezierCurveTo(hw, -9.6, 4.6, -ht, 0, -ht); body.bezierCurveTo(-4.6, -ht, -hw, -9.6, -hw, -5.6); body.bezierCurveTo(-hw, -2.4, -af - 3.2, 0, -af, 0); body.closePath();
    G.fillStyle = skin; G.fill(body); G.strokeStyle = rgba(edgeCol0, ea); G.lineWidth = 1.3 / s; G.stroke(body);
    const nl = new Path2D(); nl.moveTo(-5.4, -9.4); nl.bezierCurveTo(-4.2, -11.9, 4.2, -11.9, 5.4, -9.4); nl.bezierCurveTo(4.6, -10.6, -4.6, -10.6, -5.4, -9.4); nl.closePath();
    G.fillStyle = mix(nail, TH ? '#F4F3EF' : '#9B9A93', p * 0.55); G.fill(nl); G.strokeStyle = rgba(edgeCol0, ea * 0.8); G.lineWidth = 1 / s; G.stroke(nl);
  } else if (view === 'top') {
    /* from above: the finger 16 mm across, the tip a half round, the nail with its free edge; the pad's centre (contact) at 0 */
    const hw = FINGER.top / 2, tip = 7.4, body = new Path2D();
    body.moveTo(-L, -hw * 0.94); body.lineTo(tip - hw, -hw); body.arc(tip - hw, 0, hw, -Math.PI / 2, Math.PI / 2); body.lineTo(-L, hw * 0.94); body.closePath();
    G.fillStyle = fadeFill(skin, 1); G.fill(body); G.strokeStyle = fadeFill(edgeCol0, ea); G.lineWidth = 1.3 / s; G.stroke(body);
    const nl = new Path2D(), nx0 = -6.6, nx1 = tip - 0.9, nh = 5.3;
    nl.moveTo(nx0 + 2.4, -nh); nl.lineTo(nx1 - nh, -nh); nl.arc(nx1 - nh, 0, nh, -Math.PI / 2, Math.PI / 2); nl.lineTo(nx0 + 2.4, nh); nl.quadraticCurveTo(nx0 - 0.6, 0, nx0 + 2.4, -nh); nl.closePath();
    G.fillStyle = mix(nail, TH ? '#F4F3EF' : '#9B9A93', p * 0.55); G.fill(nl); G.strokeStyle = rgba(edgeCol0, ea * 0.8); G.lineWidth = 1.1 / s; G.stroke(nl);
    G.beginPath(); G.moveTo(nx1 - 2.4, -nh * 0.78); G.quadraticCurveTo(nx1 + 0.4, 0, nx1 - 2.4, nh * 0.78); G.strokeStyle = rgba(edgeCol0, ea * 0.5); G.lineWidth = 1 / s; G.stroke();
    G.beginPath(); G.moveTo(-17, -hw * 0.96); G.quadraticCurveTo(-18.2, 0, -17, hw * 0.96); G.strokeStyle = fadeFill(edgeCol0, ea * 0.4); G.stroke();
  } else {
    /* from the side: the pad under the tip, its curve flattening on the surface with the press; the nail on top */
    const R = 9, Rb = 24, af = 3.4 * p, vb = u => { const q = Math.max(0, Math.abs(u) - af); return -(u >= 0 ? q * q / (2 * R) : Math.min(2.1, q * q / (2 * Rb))); };
    /* the pulp under and past the nail's free edge, then the back of the finger curving down over the nail to the tip */
    const body = new Path2D(); body.moveTo(-L, vb(-L));
    for (let u = -L; u <= 5.4; u += 0.4) body.lineTo(u, vb(u));
    body.bezierCurveTo(7.9, vb(5.4) - 1.2, 8.7, -7.0, 7.1, -9.5);
    body.quadraticCurveTo(5.9, -11.5, 3.3, -12.35);
    body.bezierCurveTo(-3.5, -13.45, -14, -13.2, -L, -12.5); body.closePath();
    G.fillStyle = fadeFill(skin, 1); G.fill(body); G.strokeStyle = fadeFill(edgeCol0, ea); G.lineWidth = 1.3 / s; G.stroke(body);
    const nl = new Path2D(); nl.moveTo(-9.6, -13.2); nl.quadraticCurveTo(-2.4, -13.55, 3.3, -12.4); nl.quadraticCurveTo(5.7, -11.75, 6.7, -10.0);
    nl.quadraticCurveTo(5.3, -10.9, 3.1, -11.45); nl.quadraticCurveTo(-2.4, -12.3, -9.3, -12.15); nl.quadraticCurveTo(-10.2, -12.6, -9.6, -13.2); nl.closePath();
    G.fillStyle = mix(nail, TH ? '#F4F3EF' : '#9B9A93', p * 0.55); G.fill(nl); G.strokeStyle = rgba(edgeCol0, ea * 0.8); G.lineWidth = 1 / s; G.stroke(nl);
    G.beginPath(); G.moveTo(-22, -12.4); G.quadraticCurveTo(-23.2, -7.5, -22.2, -2.6); G.strokeStyle = fadeFill(edgeCol0, ea * 0.45); G.lineWidth = 1 / s; G.stroke();
  }
  G.restore();
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
 * The one before → after headline of the deck (F14.10, F16.1). The old value appears where the new one will stand, then
 * re-counts to the new value in Theseus's gradient while a copy of the old slides left, shrinks, turns grey and is struck;
 * an arrow joins them; the net change lands under the row (by how much, never rounded up); the label says which way is better.
 * (x, y) = the row's left edge (or o.align's) and the big number's baseline.
 * o = { from, to (numbers or strings: one precision for both, G5), unit ('MPa', '%', '°', '×' attach without a space),
 *   label ('Peak experienced stress'), better ('lower' | 'higher' | null), net ('auto' | a string | false; auto: −56 %, or
 *   2.3× when higher is better and it more than doubles), netWord (after the net: 'less stress'), size (the new value, 150),
 *   dec, who: [the rival's name, 'Theseus'] (small names under the two values), dur (the count, 1.0), morph (true: the old
 *   value starts big in the new one's place; false: it waits, small and grey, from the start), align ('left' | 'right' |
 *   'center'), rivalCol ('second' | 'grey': the colour of the rival's name), maxW (the label's width) }
 * Returns { w, h, x0 } (the row's left edge and size, for layout).
 * e.g. verdict(t, 6.4, 120, 860, { from: 33.4, to: 0, unit: '%', dec: 1, label: 'Sideways at the switch', better: 'lower', who: ['Sora V2', 'Theseus'] })
 */
function verdict(t, t0, x, y, o = {}) {
  const size = o.size || 150, dur = o.dur || 1.0, num = v => typeof v === 'number' ? v : parseFloat(String(v).replace(/−/g, '-').replace(/[^\d.\-]/g, ''));
  const f0 = num(o.from), f1 = num(o.to), dec = o.dec != null ? o.dec : Math.max(kitDec(o.from), kitDec(o.to));
  const u = o.unit || '', tight = /^(%|°|×|x)$/.test(u), fmt = v => kitNum(v, dec), betterHigh = o.better === 'higher';
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
  const uGap = z => (tight ? 0.03 : 0.16) * z, stOld = { role: 'd1', size: bS, weight: 800, track: -0.02, tnum: true }, stBig = { role: 'd1', size, weight: 800, track: -0.03, tnum: true };
  const sOld = fmt(f0), sNew = fmt(f1), uw = z => (u ? uGap(z) + tw(u, { font: 'disp', size: z === size ? uS : Math.max(21, Math.round(z * (tight ? 0.6 : 0.5))), weight: 700, caps: false }) : 0);
  const wOld = tw(sOld, stOld) + uw(bS), arW = Math.round(size * 0.34), g1 = Math.round(size * 0.13), wBig = tw(sNew, stBig) + uw(size);
  const total = wOld + g1 + arW + g1 + wBig;
  const x0 = o.align === 'right' ? x - total : o.align === 'center' ? x - total / 2 : x, xBig = x0 + wOld + g1 + arW + g1;
  /* the label, with which way is better (F14.8: "Peak experienced stress (lower is better)") */
  if (o.label || o.better) {
    const lab = (o.label || '') + (o.better ? (o.label ? ' ' : '') + '(' + o.better + ' is better)' : '');
    text(lab, x0, y - size * 0.78 - 26, { role: 'label', size: 22, color: C.mute, alpha: a0, maxW: o.maxW || Math.max(total, 640) });
  }
  /* a unit run for a figure of size z, k of the way from the big figure's style (0) to the old value's (1) */
  const unitRun = (z, k, col, grad) => u ? { s: u, font: 'disp', size: Math.max(21, Math.round(z * lerp(uK, tight ? 0.6 : 0.5, k))), weight: 700, color: col, grad, gap: uGap(z), caps: false } : null;
  /* the old value's copy: with morph it starts exactly over the big figure and flies left, shrinking and greying, to its
     struck place; without morph it waits there, small and grey, from the start */
  if (!morph || km > 0.001) {
    const bs = lerp(size, bS, km), col = mix(TH ? '#111111' : '#F3F2EE', TH ? '#8A8983' : '#6E6D68', km);
    rich([{ s: sOld, role: 'd1', size: bs, weight: 800, track: lerp(-0.03, -0.02, km), color: col, tnum: true }, unitRun(bs, km, col)], lerp(xBig, x0, km), y, { alpha: a0 });
  }
  if (ks > 0) line(x0 - 4, y - bS * 0.34, x0 - 4 + (wOld + 8) * ks, y - bS * 0.34, { color: C.mute, w: Math.max(2.5, bS * 0.06), alpha: a0 });
  if (kar > 0) arrow(x0 + wOld + g1, y - bS * 0.36, x0 + wOld + g1 + arW, y - bS * 0.36, { color: C.faint, w: Math.max(2.5, size * 0.022), hs: Math.max(12, size * 0.09), p: kar, alpha: a0 });
  /* the big figure: the old value until the count starts, then counting to the new one; ink until it lands, then
     Theseus's gradient, cross-faded so the colour arrives rather than switching */
  { const sv = fmt(lerp(f0, f1, kc)), runs = c => [{ s: sv, role: 'd1', size, weight: 800, track: -0.03, color: c ? C.heroText : C.ink, grad: c ? C.heroGrad : null, tnum: true }, unitRun(size, 0, c ? C.heroText : C.mute, c ? C.heroGrad : null)];
    if (kg < 1) rich(runs(false), xBig, y, { alpha: a0 * (1 - kg) });
    if (kg > 0) rich(runs(true), xBig, y, { alpha: a0 * kg }); }
  /* under the row: whose each value is, then the net in Theseus's colour */
  let yy = y + Math.round(size * 0.06) + 34;
  if (o.who) {
    const kw = ep(t, cs, cs + 0.4);
    if (o.who[0]) text(o.who[0], x0, yy, { role: 'label', size: 19, color: o.rivalCol === 'grey' ? C.faint : C.secondText, alpha: kw * a0 });
    if (o.who[1]) text(o.who[1], xBig, yy, { role: 'label', size: 19, color: C.heroText, alpha: kg * a0 });
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
const CARD2 = { cap: null, rec: {}, hide: false };
function chapterCard2(t, o = {}) {
  const key = o.ch || (typeof curSlide === 'function' && curSlide() ? curSlide().ch : 'click'), L = ledgerOf(key) || { name: key, comp: '', ans: '' };
  const chs = typeof DECK !== 'undefined' ? DECK.chapters : [], ci = chs.findIndex(c => c.key === key), nCh = Math.max(1, chs.length - 2);
  const name = o.name || (ci >= 0 ? chs[ci].name : L.name), comp = o.compromise || L.comp, ans = o.answer || L.ans, turn = o.turn == null ? 2.1 : o.turn;
  /* the label row: the chapter's icon and number, and the idea count at the right (XBAB's TOTAL) */
  chapterIcon(key, LM, LAY.labelY - 19, 22, C.ink, ep(t, 0.0, 0.3));
  rich([{ s: 'Chapter ' + pad2(Math.max(0, ci)), role: 'label', size: 22, color: C.ink }, { s: '/ ' + pad2(nCh), role: 'label', size: 22, color: C.faint, gap: 12 }], LM + 36, LAY.labelY, { t, alpha: ep(t, 0.05, 0.35) });
  const n = o.count != null ? o.count : typeof chapterIdeaCount === 'function' ? chapterIdeaCount(key) : (o.list || []).length;
  if (n) {
    text('Ideas in this chapter', RM, LAY.labelY, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: ep(t, 0.3, 0.7) });
    rich([{ s: String(n), role: 'd1', size: 110, color: C.ink, tnum: true, count: [0.4, 0.9] }], RM, LAY.labelY + 112, { t, align: 'right', alpha: ep(t, 0.35, 0.6) });
  }
  /* the name, as big as the left column allows */
  const colW = 840, nm = caps(name), size = Math.min(150, colW / Math.max(1, tw(nm, { role: 'd2', size: 1, caps: false })));
  text(nm, LM - size * 0.04, 318, { role: 'd2', size, weight: 900, color: C.ink, t, rise: [0.0, 0.7] });
  line(LM, 362, LM + colW * ep(t, 0.4, 1.2, E.cam), 362, { color: C.hair, w: 1.5 });
  /* the problem first: what most mice give up here, in red; then struck as Theseus's answer lands */
  const kp = ep(t, 0.45, 0.85), kt = ep(t, turn, turn + 0.45), cSt = { role: 'h3', size: 36, weight: 700 };
  text('Most mice', LM, 430, { role: 'label', size: 22, color: C.mute, alpha: kp });
  const cr = text(comp, LM, 482, Object.assign({ color: mix(C.red, TH ? '#8A8983' : '#6E6D68', kt), t, t0: 0.55, cps: 75, maxW: colW, lh: 1.18 }, cSt));
  if (kt > 0) { const lines = wrap(sentence(comp), cSt, colW); lines.forEach((l, i) => { const lw2 = tw(l, cSt), kl = clamp(kt * lines.length - i); if (kl > 0) line(LM - 3, 482 + i * 36 * 1.18 - 11, LM - 3 + (lw2 + 6) * kl, 482 + i * 36 * 1.18 - 11, { color: C.mute, w: 2.5 }); }); }
  /* which flagship makes this compromise (FILM F1): small, under it, so the card carries the intro's six trades */
  const flag = o.flag === false ? null : (o.flag || ledgerFlag(key)), fy = 482 + Math.max(1, cr.lines.length) * 36 * 1.18 + 8;
  if (flag) text(flag, LM, fy, { role: 'small', size: 22, weight: 600, color: C.mute, maxW: colW, alpha: ep(t, 1.0, 1.4) });
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
  ledgerStrip(t, 0.7, LM, 900, RM - LM, { focus: key, turn: turn + 0.1 });
  /* the part, on the right: frame one shows it (M6); lit neutral while the problem stands, Theseus's blue once answered */
  const box = [1000, 200, 840, 500], ka = lerp(0.55, 1, ep(t, 0, 0.3));
  /* the player's chapter flight lands on this mouse: every mouseSimple drawn for the part is seen (CARD2) */
  CARD2.cap = [];
  try { chapterCardPart(t, o, box, ka, kt); }
  finally { CARD2.rec[typeof curSlide === 'function' && curSlide() ? curSlide().id : key] = { box, caps: CARD2.cap, t }; CARD2.cap = null; }
}
/** chapterCard2's part (its own drawing, or the simplified mouse with the part lit) */
function chapterCardPart(t, o, box, ka, kt) {
  if (typeof o.part === 'function') o.part(t, box, kt);
  else if (o.part) {
    const pv = o.part.view || 'top', hi = o.part.hi || [], lit = ep(t, 0.6, 1.1), col = mix(TH ? '#111111' : '#F3F2EE', HU.hero[TH ? 0 : 1], kt);
    const hiMap = {}; (Array.isArray(hi) ? hi : [hi]).forEach(h => (hiMap[h] = col));
    mouseFit(box, pv, { hi: hiMap, lit, alpha: ka, pad: o.part.pad == null ? 0.04 : o.part.pad, show: o.part.show });
  }
}
