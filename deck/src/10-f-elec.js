/* ============================== electronics ============================== */
S({
  id: 'eleccard', ch: 'elec', card: true, theme: 'night', title: 'electronics', settle: 5,
  draw: t => {
    chapterCard(t, { name: 'electronics', gloss: 'the radio, the power, the receiver and the software, and what each one costs in battery and latency.', list: [['#77', 'one radio chip, nRF54LM20A'], ['#90', '8 kHz wired from the same chip'], ['sync', 'each frame captured just before it\'s sent'], ['#99', 'no RGB LED'], ['pmic', 'a PMIC with a fuel gauge'], ['link', 'a spare copy of every report'], ['#68', 'the antenna forward, clear of carbon'], ['#85', 'a screen on the receiver'], ['#23', 'software in the browser']] });
    const fl = Math.sin(t * 0.8) * 4, kb = ep(t, 1.0, 1.7), bo = part(1470, 610 + fl, 12.5, () => boardMM({}), { alpha: kb });
    if (bo.mcu && bo.antArea && t > 2.2) {
      const A2 = acc(), a2 = ep(t, 2.2, 2.8);
      for (let i = 0; i < 4; i++) { const ph2 = ((t - 2.2) * 0.9 + i / 4) % 1; circle(lerp(bo.mcuR[0], bo.antArea[0], ph2), lerp(bo.mcuR[1], bo.antArea[1], ph2), 3.2, { fill: A2, alpha: a2 * Math.sin(ph2 * Math.PI) }); }
      for (let i = 0; i < 5; i++) { const ph2 = ((t - 2.2) * 0.42 + i / 5) % 1; circle(bo.antArea[0], bo.antArea[1], 24 + ph2 * 300, { color: A2, w: 2, alpha: a2 * (1 - ph2) * 0.55, a0: -2.4, a1: -0.25 }); }
    }
    figLabel(t, 2.0, 1130, 920, 11, 'The radio and MCU');
  }
});
function chipBox(t, t0, x, y, w, h, title, chips, note, col) {
  const k = ep(t, t0, t0 + 0.5);
  rr(x, y, w, h, 12, C.panel, col || inkA(0.3), 1.8, k);
  text(title, x + 18, y + 30, { role: 'label', color: C.ink, alpha: k });
  chips.forEach((c, i) => { const cx = x + 70 + i * 140; part(cx, y + h / 2 + 8, 7, () => chipMM({ w: 6, label: c.l, hi: c.hi }), { alpha: k }); text(c.s, cx, y + h - 14, { role: 'label', size: 19, color: c.hi ? acc() : C.mute, align: 'center', alpha: k }); });
  if (note) text(note, x + w + 16, y + h + 34, { role: 'label', size: 20, color: col || C.mute, alpha: k });
}
S({
  id: 'onechip', ch: 'elec', theme: 'paper', title: '8 kHz from one chip', settle: 9, ideas: [77, 90, 92], src: ['nrf54', 'nrf52', 'nrf54usb', 'tpuUlx9', 'pulsarLink', 'slxPdf'],
  draw: t => {
    header(t, '8 kHz from one chip');
    const wx = LM, wy = 272, ww = 940, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const row = (y, label, mouseChips, rxChips, wired, col, t0) => {
      text(label, wx + 28, y - 18, { role: 'label', color: col, t, t0, cps: 70 });
      chipBox(t, t0 + 0.2, wx + 28, y, 300, 150, 'mouse', mouseChips, wired, col);
      chipBox(t, t0 + 0.4, wx + 520, y, rxChips.length > 1 ? 300 : 200, 150, 'receiver', rxChips, null, col);
      const k = ep(t, t0 + 0.6, t0 + 1.0), ax = wx + 340, bx = wx + 508, ay = y + 75;
      for (let i = 0; i < 3; i++) { const r = 16 + i * 14; circle(ax + 6, ay, r, { color: col === C.red ? C.gray : A, w: 2, alpha: k * (0.8 - i * 0.2), a0: -0.7, a1: 0.7 }); }
      if (k > 0) { for (let i = 0; i < 4; i++) { const ph = ((t * 1.2 + i / 4) % 1); circle(lerp(ax + 40, bx - 10, ph), ay, 4, { fill: col === C.red ? C.gray : A, alpha: k }); } }
      arrow(wx + 520 + (rxChips.length > 1 ? 300 : 200) + 10, ay, wx + ww - 40, ay, { color: C.ink, w: 2.5, hs: 10, alpha: k }); text('PC', wx + ww - 40, ay - 14, { role: 'label', color: C.ink, align: 'right', alpha: k });
    };
    row(wy + 90, 'Most 8 kHz mice: two chips', [{ l: 'nRF52840', s: 'Full speed' }], [{ l: 'radio', s: 'Radio' }, { l: 'USB HS', s: '2nd chip' }], 'Wired 1 kHz', C.red, 0.6);
    row(wy + 350, 'One chip, both ends', [{ l: 'nRF54LM20A', s: 'High speed', hi: true }], [{ l: 'nRF54LM20A', s: 'Same chip', hi: true }], 'Wired 8 kHz', A, 1.8);
    /* the spec table, honest about where it doesn't win */
    const rx = 1070, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('the two chips', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['datasheet'], ep(t, 1.0, 1.4));
    const rows = [['', '{nRF52840}', '{nRF54LM20A}'], ['CPU', '64 MHz M4F', '128 MHz M33'], ['RAM', '256 KB', '512 KB'], ['USB', '12 Mbit/s', 'High speed'], ['RX, 0 dBm', '4.6 mA', '3.3 mA'], ['TX, 0 dBm', '4.8 mA', '5.0 mA'], ['Supply', '1.7 to 5.5 V', '1.7 to 3.6 V']];
    rows.forEach((r, i) => { const y = wy + 130 + i * 46, k = ep(t, 1.4 + i * 0.12, 1.8 + i * 0.12); if (i) rule(rx + 28, y - 30, rx + rw - 28, k); text(r[0], rx + 28, y, { role: 'small', color: C.mute, alpha: k }); text(r[1], rx + 190, y, { role: 'small', weight: i ? 700 : 800, color: C.ink2, alpha: k }); text(r[2], rx + 410, y, { font: i ? 'mono' : 'sans', size: i ? 22 : 25, weight: 700, color: i === 5 ? C.ink2 : i === 6 ? C.red : A, alpha: k }); });
    text('TX is no better; RX, the CPU and USB are. The 3.6 V limit means a PMIC, which the power slide wants anyway.', rx + 28, wy + 482, { role: 'small', size: 23, color: C.ink2, t, t0: 3.4, cps: 110, maxW: rw - 56, lh: 1.3 });
    gloss(t, 2.6, 'USB high speed', 'The USB 2.0 rate that allows 8000 reports a second. Full speed tops out at 1000, hence the second chip.');
    featureCard(t, 4.2, 'one chip for radio and USB', ['datasheet', 'proposal'], 'nRF54LM20A at both ends (#77), 8 kHz wired from the same chip (#90), parts on one side of the board (#92).');
    captions(t, [[0.6, 'most 8 kHz wireless mice pair a full-speed radio chip with a second chip in the receiver to reach 8000 reports a second.'], [3.6, 'a radio chip with high-speed USB built in does both jobs. the SLX already runs one at both ends, and it gives the mouse 8 kHz over the cable too.'], [6.2, 'where it doesn\'t win, the table says so. transmit current is the same.']]);
  }
});
/* ---------- electronics: motion latency, every 8 kHz row on piaknow's chart ---------- */
const PIAKNOW = [['XBAB XA25', 'wired', 0.13], ['Kunai', 'projected', 0.14], ['Endgame Gear OP1 8k V2', 'wired', 0.19], ['Endgame Gear XM2 8k V2', 'wired', 0.19], ['VAXEE NP01-S V3', 'wired', 0.25], ['Razer DeathAdder V3', 'wired', 0.26], ['Razer Viper V4 Pro', 'wired', 0.26], ['Endgame Gear OP1 8k', 'wired', 0.30], ['HyperX Pulsefire Haste 2', 'wired', 0.33], ['Razer Viper V4 Pro', 'wireless', 0.34], ['ELECOM VM800L', 'wired', 0.42], ['Scyrox V8', 'wireless', 0.51], ['ELECOM VM800L', 'wireless', 0.65], ['WLMOUSE Beast X 8K', 'wireless', 0.68], ['VAXEE NP01-S V3', 'wireless', 0.70], ['Razer Viper V3 Pro', 'wireless', 0.77], ['Razer Viper V2 Pro', 'wireless', 0.88], ['Logitech G Pro X2 Superstrike', 'wireless', 0.89], ['Logitech G Pro X Superlight 2', 'wireless', 0.90]];
S({
  id: 'motion', ch: 'elec', theme: 'night', title: 'the fastest mice, on one chart', settle: 10, ideas: ['latency'],
  src: ['piaknow', 'kunai', 'xbab', 'razerHs'],
  draw: t => {
    header(t, 'the fastest mice, on one chart');
    const wx = LM, wy = 272, ww = 1180, wh = 640, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('motion latency at 8000 Hz, ms. lower is faster.', wx + 28, wy + 42, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    let lx = wx + ww - 28; const leg = [['projected', C.red, true], ['wireless', A, false], ['wired', C.gray, false]];
    leg.forEach(([l, c, d]) => { const k = ep(t, 1.0, 1.4), w2 = tw(l, { role: 'label' }); text(l, lx, wy + 42, { role: 'label', color: c, align: 'right', alpha: k }); lx -= w2 + 22; if (d) { G.save(); G.globalAlpha = k; G.setLineDash([4, 3]); G.strokeStyle = c; G.lineWidth = 2; G.strokeRect(lx + 2, wy + 30, 14, 12); G.restore(); } else rect(lx + 2, wy + 30, 14, 12, { fill: c, alpha: k }); lx -= 18; });
    const bx0 = wx + 440, bw = 660, X = v => bx0 + bw * v, top = wy + 92, rh = 28.6, a0 = ep(t, 1.0, 1.4);
    for (const v of [0, 0.2, 0.4, 0.6, 0.8, 1.0]) { line(X(v), top - 22, X(v), top + rh * PIAKNOW.length - 12, { color: C.hair, w: 1, alpha: a0 }); text(v.toFixed(1), X(v), top + rh * PIAKNOW.length + 12, { role: 'small', color: C.mute, align: 'center', alpha: a0 }); }
    PIAKNOW.forEach(([name, mode, v], i) => {
      const y = top + i * rh, k = ep(t, 1.4 + i * 0.09, 2.0 + i * 0.09, E.snap), col = mode === 'wired' ? C.gray : mode === 'wireless' ? A : C.red, hi = name === 'XBAB XA25' || (name === 'Razer Viper V4 Pro' && mode === 'wireless');
      text(name + ', ' + mode, wx + 28, y + 5, { role: 'small', weight: hi || mode === 'projected' ? 800 : 600, color: hi || mode === 'projected' ? C.ink : C.ink2, alpha: ep(t, 1.2 + i * 0.09, 1.6 + i * 0.09) });
      if (mode === 'projected') { G.save(); G.globalAlpha = k; G.setLineDash([5, 4]); G.strokeStyle = col; G.lineWidth = 2; G.strokeRect(bx0, y - 8, bw * v * k, 16); G.restore(); }
      else { rect(bx0, y - 8, bw * v * k, 16, { fill: col }); glint(bx0, y - 8, bw * v * k, 16, t, 6.5 + i * 0.1, 9); }
      text(v.toFixed(2), bx0 + bw * v * k + 10, y + 5, { role: 'label', color: col, alpha: k });
    });
    const kt = ep(t, 4.2, 4.6); line(X(0.14), top - 30, X(0.14), top + rh * PIAKNOW.length - 10, { color: C.blue, w: 2, dash: [6, 5], alpha: kt });
    text('my target, wireless: 0.14', X(0.14) + 8, top - 30, { role: 'label', color: C.blue, alpha: kt });
    /* reading it */
    const rx = 1316, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('how to read it', rx + 28, wy + 42, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['measured', 'derived'], ep(t, 1.0, 1.4));
    text('piaknow times each mouse from the moment it moves to the moment the PC sees it, on one rig, so the rows compare.', rx + 28, wy + 116, { role: 'small', color: C.ink2, t, t0: 1.2, cps: 120, maxW: rw - 56, lh: 1.45 });
    bignum(t, 2.4, rx + 28, wy + 270, '0.34', 'ms', { size: 64, color: A });
    text('the fastest wireless mouse measured', rx + 28, wy + 300, { role: 'label', color: C.mute, alpha: ep(t, 2.6, 3.0) });
    text('Kunai\'s 0.14 ms is a projection: 79.6 µs from its timing model, plus 62.5 µs, half an 8 kHz report, to put it on piaknow\'s scale. it hasn\'t been on the rig yet.', rx + 28, wy + 348, { role: 'small', color: C.ink2, t, t0: 3.0, cps: 120, maxW: rw - 56, lh: 1.45 });
    text('the XA25 row is from before SensorLock, which should lower it.', rx + 28, wy + 478, { role: 'small', color: C.ink2, t, t0: 4.0, cps: 120, maxW: rw - 56, lh: 1.45 });
    text('my targets: 0.13 ms wired, 0.14 ms wireless, measured on the same rig.', rx + 28, wy + 560, { role: 'label', color: C.blue, t, t0: 5.0, cps: 90, maxW: rw - 56, lh: 1.4 });
    captions(t, [[0.6, 'every 8 kHz row on piaknow\'s chart: one rig, one method, so the mice compare.'], [4.4, 'the fastest wireless mouse measured so far takes 0.34 ms. the fastest wired one, 0.13.'], [7.2, 'a firmware still in testing projects 0.14 ms wireless. that\'s my target, measured on the same rig.']], { y: 984 });
    source(t, 'data: piaknow, "Motion Latency of Some Computer Mice 2026-09-15", 8000 Hz column, as redrawn in the Kunai tester guide. piaknow has not measured Kunai.', { y: 1058, t0: 2 });
  }
});
/* ---------- electronics: capture the frame just before it is sent (FrameSync, SensorLock, PerfectSync) ---------- */
S({
  id: 'framesync', ch: 'elec', theme: 'paper', title: 'capture each frame just in time', settle: 10, ideas: ['sync'],
  src: ['kunai', 'xbabSensorLock', 'pcgFrameSync', 'razerFocus', 'slxPdf'],
  draw: t => {
    header(t, 'capture each frame just in time');
    const wx = LM, wy = 272, ww = 1060, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('four 8 kHz reports, 500 µs', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 0.9, 1.3)); text('illustration: 12,000 frames a second against 8,000 polls, 15 µs to process a frame', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const x0 = wx + 230, x1 = wx + ww - 50, X = us => x0 + (x1 - x0) * us / 500, now = clamp((t - 1.2) / 4.0) * 500;
    const polls = [125, 250, 375, 500], lanes = [{ y: wy + 200, name: 'sensor on its own clock', frames: [10, 93.3, 176.7, 260, 343.3, 426.7], col: C.red }, { y: wy + 350, name: 'synced to the polls', frames: [105, 230, 355, 480], col: A }];
    for (const p of polls) { const k = ep(t, 1.0, 1.4); line(X(p), wy + 130, X(p), wy + 410, { color: C.ink2, w: 1.5, dash: [5, 4], alpha: k }); text('poll', X(p), wy + 428, { role: 'label', color: C.mute, align: 'center', alpha: k }); }
    lanes.forEach((L, li) => {
      const k = ep(t, 1.1 + li * 0.3, 1.5 + li * 0.3);
      text(L.name, wx + 28, L.y + 5, { role: 'label', color: L.col, alpha: k, maxW: 190 });
      line(X(0), L.y, X(500), L.y, { color: C.faint, w: 1.5, alpha: k });
      for (const f of L.frames) if (f <= now) { rect(X(f) - 3, L.y - 26, 6, 26, { fill: L.col }); circle(X(f), L.y - 30, 8, { fill: rgba(L.col, 0.25) }); }
      polls.forEach((p, pi) => { if (p > now) return; const used = L.frames.filter(f => f + 15 <= p).pop(), age = Math.round(p - used); const yb = L.y + 18 + (pi % 2) * 0; line(X(used), yb, X(p), yb, { color: L.col, w: 2.5 }); line(X(used), yb - 5, X(used), yb + 5, { color: L.col, w: 2 }); line(X(p), yb - 5, X(p), yb + 5, { color: L.col, w: 2 }); text(age + ' µs', (X(used) + X(p)) / 2, yb + 22, { role: 'label', color: L.col, align: 'center' }); });
    });
    /* once it's all drawn, a playhead keeps running the 500 µs: each frame flashes as it's captured, each poll pings as it's sent */
    if (t > 6.4) {
      const pk = ep(t, 6.4, 6.9), ph = ((t - 6.4) % 3.2) / 3.2 * 530 - 15;
      line(X(ph), wy + 118, X(ph), wy + 412, { color: C.ink, w: 1.5, alpha: 0.3 * pk });
      lanes.forEach(L => { for (const f of L.frames) { const d = Math.abs(ph - f); if (d < 16) { circle(X(f), L.y - 30, 8 + (16 - d) * 0.8, { fill: rgba(L.col, 0.4 * (1 - d / 16)), alpha: pk }); rect(X(f) - 3, L.y - 26, 6, 26, { fill: C.ink, alpha: pk * 0.5 * (1 - d / 16) }); } } });
      for (const p of polls) { const d = ph - p; if (d >= 0 && d < 34) { const q = 1 - d / 34; circle(X(p), wy + 124, 4 + 14 * (1 - q), { color: C.ink2, w: 1.6, alpha: pk * q }); } }
    }
    text('bars: a frame captured. brackets: how old the motion is when the report goes out.', wx + 28, wy + 470, { role: 'label', color: C.ink2, alpha: ep(t, 2.0, 2.4), maxW: ww - 56 });
    text('on its own clock the age jumps between reports, here 32 and 73 µs. synced, it is the same every time.', wx + 28, wy + 500, { role: 'label', color: C.ink, t, t0: 5.4, cps: 100, maxW: ww - 56 });
    /* the measured gap, and how far the trip has been cut */
    const rx = 1196, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('photon to wire, wired, 8 kHz', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['measured'], ep(t, 1.0, 1.4)); text('by SensorLock\'s developers', rx + 28, wy + 86, { role: 'small', size: 22, maxW: rw - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const bx = rx + 190, bw2 = rw - 330, BX = us => bx + bw2 * us / 210;
    [['SensorLock', 42, A, '42 µs'], ['FrameSync', 205, C.gray, '+163 µs']].forEach(([l, v, c, lab], i) => { const y = wy + 126 + i * 46, k = ep(t, 1.6 + i * 0.3, 2.4 + i * 0.3, E.snap); text(l, rx + 28, y + 6, { role: 'label', color: C.ink2, alpha: ep(t, 1.4, 1.8) }); rect(bx, y - 9, (BX(v) - bx) * k, 18, { fill: c }); text(lab, bx + (BX(v) - bx) * k + 10, y + 6, { role: 'label', color: c, alpha: k }); });
    text('SensorLock\'s 42 µs is a wired reference mouse. both mice were timed the same way.', rx + 28, wy + 226, { role: 'small', color: C.faint, alpha: ep(t, 2.6, 3.0), maxW: rw - 56, lh: 1.4 });
    rule(rx + 28, wy + 268, rx + rw - 28, ep(t, 2.8, 3.2));
    text('Kunai, light to PC, wireless, 8 kHz', rx + 28, wy + 304, { role: 'label', color: C.ink, t, t0: 3.0, cps: 70 });
    tag(rx + 28, wy + 334, 'derived', ep(t, 3.1, 3.5)); text('on paper, from measured stages', rx + 150, wy + 334, { role: 'small', color: C.mute, alpha: ep(t, 3.2, 3.6) });
    const KX = us => bx + bw2 * us / 110;
    [['Earlier builds', 100, C.gray, '~100 µs'], ['Now', 79.6, A, '79.6 µs'], ['Hardware floor', 65, C.ink, '~65 µs']].forEach(([l, v, c, lab], i) => { const y = wy + 378 + i * 40, k = ep(t, 3.4 + i * 0.25, 4.1 + i * 0.25, E.snap); text(l, rx + 28, y + 6, { role: 'label', color: C.ink2, alpha: ep(t, 3.3, 3.7) }); rect(bx, y - 8, (KX(v) - bx) * k, 16, { fill: c }); text(lab, bx + (KX(v) - bx) * k + 10, y + 6, { role: 'label', color: c, alpha: k }); });
    text('Finalmouse\'s PerfectSync does this on the SLX, "without added delay or buffering".', rx + 28, wy + 526, { role: 'small', size: 22, color: C.ink2, t, t0: 4.6, cps: 120, maxW: rw - 56, lh: 1.3 });
    gloss(t, 2.6, 'frame', 'one picture of the pad taken by the sensor\'s camera. the LED flashes once per frame, and the sensor works out movement by comparing frames.');
    featureCard(t, 6.6, 'SensorLock-class sync', ['measured', 'derived', 'proposal'], 'the frame captured just before every read, at every polling rate, wired and wireless.');
    captions(t, [[0.6, 'the sensor is a camera taking pictures of the pad. on its own clock, a finished picture waits to be read, then waits again to be sent.'], [4.2, 'sync the camera to the polls and every report carries motion that was just seen, the same age every time.'], [7.2, 'Razer calls it FrameSync. tekkusai\'s SensorLock measured 163 µs sooner, and that\'s the one I want.']]);
  }
});
S({
  id: 'power', ch: 'elec', theme: 'night', title: 'the polling tax', settle: 9, ideas: [99, 'pmic', 'gauge'], src: ['razerBatt', 'logiRgb', 'elcWs2812', 'npm1300', 'tpuVv3p', 'tpuUlx9', 'tpuX2h', 'tpuGpx2'],
  draw: t => {
    header(t, 'the polling tax');
    const wx = LM, wy = 272, ww = 940, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('battery life by polling rate, Viper V3 Pro', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['claim'], ep(t, 1.0, 1.4)); text('Razer\'s figures; average current derived from 300 mAh', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const data = [['1 kHz', 95, 3.2], ['2 kHz', 62, 4.8], ['4 kHz', 40, 7.5], ['8 kHz', 17, 17.6]];
    const bx = wx + 110, bw = 120, base = wy + 360, sc = 2.3;
    data.forEach(([l, h, ma], i) => { const x = bx + i * 170, k = ep(t, 1.4 + i * 0.25, 2.2 + i * 0.25, E.snap), col = i === 3 ? C.red : A; rect(x, base - h * sc * k, bw, h * sc * k, { fill: col }); glint(x, base - h * sc * k, bw, h * sc * k, t, 5 + i * 0.3, 7); text(h + ' h', x + bw / 2, base - h * sc * k - 12, { role: 'h3', size: 30, color: col, align: 'center', alpha: k }); text(l, x + bw / 2, base + 26, { role: 'label', color: C.ink2, align: 'center', alpha: ep(t, 1.2, 1.6) }); text(ma + ' mA', x + bw / 2, base + 50, { role: 'small', color: C.mute, align: 'center', alpha: k }); });
    line(wx + 90, base, wx + 790, base, { color: C.faint, w: 1.5, alpha: ep(t, 1.0, 1.4) });
    rule(wx + 28, wy + 440, wx + ww - 28, ep(t, 3.4, 3.8));
    text('RGB on vs off, G703 (Logitech spec): 22 h vs 30 h. The LED costs 27% of the runtime.', wx + 28, wy + 486, { role: 'small', size: 23, weight: 700, color: C.ink, t, t0: 3.6, cps: 90, maxW: ww - 56, lh: 1.3 });
    
    /* charging */
    const rx = 1070, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('charge current, measured', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['measured'], ep(t, 1.0, 1.4));
    const cr = [['UltralightX', 0.131, C.gray], ['Viper V3 Pro', 0.150, C.gray], ['Pulsar X2H', 0.28, C.ink], ['Theseus, with a PMIC', 0.30, YEL]];
    const X0 = rx + 230, XW = rw - 420, CX = v => X0 + XW * v / 0.32;
    cr.forEach(([l, v, col], i) => { const y = wy + 140 + i * 58, k = ep(t, 1.4 + i * 0.2, 2.0 + i * 0.2, E.snap); text(l, rx + 28, y + 6, { role: 'label', color: C.ink2, alpha: ep(t, 1.2 + i * 0.2, 1.6 + i * 0.2) }); rect(X0, y - 9, (CX(v) - X0) * k, 18, { fill: col }); text((v < 0.3 ? v.toFixed(3) : '0.3+') + ' A, ' + Math.round(0.3 / v * 60) + ' min', CX(v) + 10, y + 8, { role: 'num', size: 21, color: col, alpha: k }); });
    text('Minutes to fill 300 mAh, before the taper', rx + 28, wy + 396, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 2.4, 2.8), maxW: rw - 56 });
    text('nPM1300 PMIC: 32 to 800 mA charging, a fuel gauge with no extra parts, 370 nA ship mode.', rx + 28, wy + 446, { role: 'small', size: 23, weight: 700, color: C.ink, t, t0: 3.0, cps: 100, maxW: rw - 56, lh: 1.3 });
    text('Without a gauge, one flagship jumped to 60% after a power cycle (TechPowerUp).', rx + 28, wy + 526, { role: 'small', size: 22, color: C.mute, t, t0: 4.0, cps: 100, maxW: rw - 56, lh: 1.3 });
    gloss(t, 2.6, 'fuel gauge', 'a circuit that counts the charge going in and out of the battery, so the percentage you see is measured instead of guessed from the voltage.');
    featureCard(t, 5.0, 'every milliamp accounted for', ['claim', 'measured', 'proposal'], 'no RGB LED (#99), a PMIC with a fuel gauge, and the radio chip from the last slide, which spends less to receive.');
    captions(t, [[0.6, 'every report the mouse sends costs current. at 8 kHz the average draw is five times what it is at 1 kHz, and battery life falls off a cliff.'], [3.6, 'an RGB LED is a tax on top of that, and it doesn\'t stop draining when you turn it off in software.'], [6.0, 'and charging today is slow. a PMIC can set the current to what the cell can take, and count what actually went in.']]);
  }
});
/* ---------- electronics: sync saves battery too (PerfectSync, PerfectPolling, Smart sleep) ---------- */
S({
  id: 'syncpower', ch: 'elec', theme: 'paper', title: 'sync saves battery, too', settle: 9, ideas: ['sync', 'sleep'],
  src: ['razerBatt', 'nbcV4', 'slxPdf', 'slxGp', 'slxOog', 'kunai'],
  draw: t => {
    header(t, 'sync saves battery, too');
    const wx = LM, wy = 272, ww = 940, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('the Viper before and after FrameSync', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    cardPills(wx, wy, ww, ['claim'], ep(t, 0.9, 1.3)); text('Razer\'s battery figures', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const base = wy + 400, sc = 1.35, groups = [['1 kHz', 95, 180], ['8 kHz', 17, 45]];
    line(wx + 70, base, wx + ww - 60, base, { color: C.faint, w: 1.5, alpha: ep(t, 1.0, 1.4) });
    groups.forEach(([g, a, b], gi) => {
      const gx = wx + 120 + gi * 400; text(g, gx + 125, base + 30, { role: 'label', color: C.ink, align: 'center', alpha: ep(t, 1.2, 1.6) });
      [['V3 Pro', a, C.gray], ['V4 Pro', b, A]].forEach(([l, v, c], j) => { const x = gx + j * 140, k = ep(t, 1.4 + gi * 0.5 + j * 0.25, 2.2 + gi * 0.5 + j * 0.25, E.snap), h2 = v * sc * k; rect(x, base - h2, 110, h2, { fill: c }); glint(x, base - h2, 110, h2, t, 5 + gi * 0.5 + j * 0.25, 7); text(v + ' h', x + 55, base - h2 - 12, { role: 'label', color: c, align: 'center', alpha: k }); text(l, x + 55, base + 54, { role: 'label', color: C.mute, align: 'center', alpha: k }); });
      const kk = ep(t, 3.0 + gi * 0.3, 3.4 + gi * 0.3); text('×' + (b / a).toFixed(1), gx + 250, base - b * sc - 40, { role: 'h3', size: 30, color: A, alpha: kk });
    });
    text('The V4 Pro changed chips and battery too: not all of the gain is sync.', wx + 28, wy + 500, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 3.4, 3.8), maxW: ww - 56 });
    text('Finalmouse credits PerfectSync for the SLX\'s "best battery life yet", but publishes no hour rating.', wx + 28, wy + 536, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 3.8, 4.2), maxW: ww - 56 });
    /* why, and the rest of the battery work */
    const rx = 1070, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('why sync saves current', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['derived'], ep(t, 1.0, 1.4));
    text('The LED flashes once per frame. Synced, every read gets a fresh frame, so the sensor can flash less often.', rx + 28, wy + 104, { role: 'small', size: 24, color: C.ink2, t, t0: 1.2, cps: 130, maxW: rw - 56, lh: 1.32 });
    rule(rx + 28, wy + 252, rx + rw - 28, ep(t, 2.4, 2.8));
    const items = [['Smart sleep, Kunai', 'Sleeps 10 s after your hand leaves; wakes on a touch.'], ['Head start, Kunai', 'The first move after a rest goes out in the next 125 µs slot.'], ['Second Shot, Kunai', 'The spare copy runs only while packets are being lost.']];
    items.forEach(([h2, b], i) => { const y = wy + 236 + i * 92, k = ep(t, 2.6 + i * 0.4, 3.0 + i * 0.4); text(h2, rx + 28, y, { role: 'label', color: A, alpha: k }); text(b, rx + 28, y + 30, { role: 'small', size: 23, color: C.ink2, alpha: k, maxW: rw - 56, lh: 1.3 }); });
    
    text('Target: 200 h at 1 kHz, 45 h at 8 kHz, measured', rx + 28, wy + wh - 28, { role: 'label', size: 20, color: C.heroText, t, t0: 4.4, cps: 80, maxW: rw - 56 });
    featureCard(t, 5.6, 'battery from sync and sleep', ['claim', 'derived', 'proposal'], 'frames captured only when they\'re needed, sleep driven by the button sensors, a spare copy only when the room needs it.');
    captions(t, [[0.6, 'the first mouse with FrameSync also claims about twice the battery of the one before it, and nearly three times at 8 kHz.'], [3.6, 'part of that is new chips and a new battery. sync helps too: a sensor that captures at the right moment doesn\'t need to capture as often.'], [6.6, 'and a mouse that feels your hand leave can sleep ten seconds later.']]);
  }
});
S({
  id: 'antenna', ch: 'elec', theme: 'paper', title: 'keep carbon away from the antenna', settle: 9, ideas: [68, 101], src: ['cfShield', 'logiManual'],
  draw: t => {
    header(t, 'keep carbon away from the antenna');
    const wx = LM, wy = 272, ww = 980, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const o = part(wx + 300, wy + 330, 11, () => boardMM({}), { alpha: ep(t, 0.4, 0.9) });
    const ax = o.antArea ? o.antArea[0] : wx + 450, ay = o.antArea ? o.antArea[1] : wy + 220;
    /* waves leaving the antenna: through plain plastic above, through carbon to the right */
    const k = ep(t, 1.2, 1.6);
    G.save(); rrPath(wx, wy, ww, wh, 14); G.clip();
    for (let i = 0; i < 6; i++) { const ph = (t * 0.5 + i / 6) % 1, r = 30 + ph * 330; circle(ax, ay, r, { color: A, w: 2.5, alpha: k * (1 - ph) * 0.8, a0: -Math.PI * 0.95, a1: -Math.PI * 0.55 }); const fade = r > 170 ? 0.03 : 1; circle(ax, ay, r, { color: A, w: 2.5, alpha: k * (1 - ph) * 0.8 * fade, a0: -Math.PI * 0.25, a1: Math.PI * 0.05 }); }
    G.restore();
    part(0, 0, 1, () => { solid(() => { G.beginPath(); G.rect(ax + 150, ay - 160, 22, 220); }, MT.shell, [ax + 150, ay - 160, 22, 220], { hatch: true }); }, { alpha: ep(t, 1.6, 2.0) });
    text('carbon fibre wall', ax + 182, ay - 140, { role: 'label', color: C.red, alpha: ep(t, 1.8, 2.2) });
    text('30 dB: a thousandth of the power gets through', ax + 182, ay - 116, { role: 'small', color: C.mute, alpha: ep(t, 2.0, 2.4), maxW: 200 });
    callout(t, 2.4, [ax, ay], 'antenna, in a keep-out with no copper under it', { to: [wx + 40, wy + 90], side: 'r', color: A, role: 'small', maxW: 280 });
    callout(t, 2.8, o.mcu || [ax - 150, ay + 60], 'radio and MCU', { to: [wx + 40, wy + 500], side: 'r', color: C.ink2, tcolor: C.mute, role: 'small' });
    /* attenuation */
    const rx = 1110, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('signal lost through the wall', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['study'], ep(t, 1.0, 1.4));
    const bars = [['carbon-filled polymer', 30, 33, C.ink], ['continuous carbon laminate', 60, 80, C.red]];
    const X0 = rx + 28, XW = rw - 150, BXv = v => X0 + XW * v / 100;
    bars.forEach(([l, a, b, col], i) => { const y = wy + 150 + i * 80, kk = ep(t, 1.6 + i * 0.3, 2.4 + i * 0.3, E.snap); text(l, X0, y - 12, { role: 'label', color: C.ink2, alpha: kk }); rect(X0, y, (BXv(b) - X0) * kk, 18, { fill: col, alpha: 0.45 }); rect(X0, y, (BXv(a) - X0) * kk, 18, { fill: col }); text(a + ' to ' + b + ' dB', BXv(b) + 10, y + 14, { role: 'label', color: col, alpha: kk }); });
    text('shielding studies, mostly above 2.4 GHz. every 10 dB is ten times less power.', rx + 28, wy + 330, { role: 'small', color: C.faint, alpha: ep(t, 2.6, 3.0), maxW: rw - 56 });
    text('so the antenna sits as far forward as it can, behind plastic, not carbon (#68). brass inserts stay away from it too, since nearby metal detunes it (#101).', rx + 28, wy + 400, { role: 'label', color: C.ink, t, t0: 3.2, cps: 80, maxW: rw - 56, lh: 1.45 });
    text('receiver about 20 cm from the mouse (Logitech\'s manual).', rx + 28, wy + 516, { role: 'small', color: C.mute, alpha: ep(t, 4.4, 4.8) });
    keyPlan(t, 1.0, wx + ww - 46, wy + 440, { s: 0.6, hi: ['board', 'antenna'], label: 'antenna' });
    gloss(t, 2.6, 'decibel loss', 'a log scale for how much signal a wall eats. 10 dB is a tenth of the power, 30 dB a thousandth.');
    featureCard(t, 4.6, 'antenna forward, clear of carbon', ['study', 'proposal'], 'as far forward as possible (#68), with the brass inserts placed away from it (#101).');
    captions(t, [[0.6, 'carbon fibre conducts, and conductive walls shield radio. the studies put a thin carbon composite at around 30 dB.'], [3.4, 'that is a thousandth of the power. a mouse can live with it only if the antenna has a clear way out.'], [5.6, 'so the antenna goes to the front, behind plastic, with the metal kept away.']]);
  }
});
/* ---------- electronics: a spare copy of every report (Second Shot) ---------- */
S({
  id: 'secondshot', ch: 'elec', theme: 'night', title: 'a spare copy of every report', settle: 9, ideas: ['link'],
  src: ['kunai'], sfxLoop: [{ t0: 9, per: 5, cues: [[0.24, 'tick'], [0.28, 'tick']] }],
  draw: t => {
    header(t, 'a spare copy of every report');
    const wx = LM, wy = 272, ww = 1040, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('one report at 1 kHz is eight 125 µs radio slots', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.8, cps: 70 });
    cardPills(wx, wy, ww, ['claim'], ep(t, 0.9, 1.3)); text('how Second Shot works, from Kunai\'s tester guide', wx + 28, wy + 86, { role: 'small', size: 22, maxW: ww - 56, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    const sx0 = wx + 210, sw = (ww - 260) / 8, ly = [wy + 170, wy + 270];
    ['channel A: the report', 'channel B, 8 MHz or more away: the spare'].forEach((l, i) => text(l, wx + 28, ly[i] + 6, { role: 'label', color: i ? A : C.ink2, alpha: ep(t, 1.0 + i * 0.2, 1.4 + i * 0.2), maxW: 170, lh: 1.3 }));
    for (let i = 0; i < 8; i++) { const k = ep(t, 1.2 + i * 0.05, 1.5 + i * 0.05); for (const y of ly) rr(sx0 + i * sw + 3, y - 24, sw - 6, 48, 6, inkA(0.04), inkA(0.16), 1.2, k); text(String(i + 1), sx0 + i * sw + sw / 2, wy + 330, { role: 'label', color: C.mute, align: 'center', alpha: k }); }
    /* after the first pass the radio keeps running: a slot cursor walks the eight slots, and every other report is lost and covered by its spare */
    const c9 = t >= 9 ? (t - 9) % 5 : -1, lostNow = c9 < 0 || Math.floor((t - 9) / 5) % 2 === 1, fo = c9 < 0 ? 1 : 1 - ep(c9, 4.4, 4.9);
    const kSpare = c9 < 0 ? ep(t, 2.0, 2.4) : ep(c9, 1.2, 1.4) * fo, kRep = c9 < 0 ? ep(t, 2.6, 3.0) : ep(c9, 1.4, 1.6) * fo, kLost = lostNow ? (c9 < 0 ? ep(t, 3.4, 3.7) : ep(c9, 1.9, 2.2) * fo) : 0, kSave = lostNow ? (c9 < 0 ? ep(t, 4.2, 4.6) : ep(c9, 2.5, 2.9) * fo) : 0;
    if (c9 >= 0) {
      const sl = clamp(Math.floor(c9 / 0.2), 0, 7), sk = ep(t, 9, 9.3) * (1 - ep(c9, 1.6, 1.9));
      for (const y of ly) rr(sx0 + sl * sw + 1, y - 26, sw - 2, 52, 7, null, inkA(0.55), 1.6, sk);
      if (!lostNow) { const kd = ep(c9, 1.9, 2.2) * fo; text('✓ report arrives; the spare is dropped', sx0 + 8 * sw + 30, ly[0] + 44, { role: 'label', color: C.green, align: 'right', alpha: kd }); }
    }
    rr(sx0 + 6 * sw + 8, ly[1] - 18, sw - 16, 36, 5, A, null, 1, kSpare); text('spare', sx0 + 6.5 * sw, ly[1] + 5, { role: 'label', color: '#111', align: 'center', alpha: kSpare });
    rr(sx0 + 7 * sw + 8, ly[0] - 18, sw - 16, 36, 5, C.gray, null, 1, kRep * (1 - 0.6 * kLost)); text('report', sx0 + 7.5 * sw, ly[0] + 5, { role: 'label', color: '#111', align: 'center', alpha: kRep });
    if (kLost > 0) { const cx = sx0 + 7.5 * sw, cy = ly[0]; line(cx - 22, cy - 22, cx + 22, cy + 22, { color: C.red, w: 4, alpha: kLost }); line(cx + 22, cy - 22, cx - 22, cy + 22, { color: C.red, w: 4, alpha: kLost }); text('lost', cx, cy - 34, { role: 'label', color: C.red, align: 'center', alpha: kLost }); }
    if (kSave > 0) { arrow(sx0 + 7 * sw - 4, ly[1], sx0 + 8 * sw + 30, ly[1], { color: A, w: 3, hs: 10, alpha: kSave }); text('your PC gets the spare, on time', sx0 + 8 * sw + 30, ly[1] + 34, { role: 'label', color: A, align: 'right', alpha: kSave }); }
    rule(wx + 28, wy + 370, wx + ww - 28, ep(t, 4.8, 5.2));
    text('without it, a lost report at 1 kHz costs up to a full millisecond. with it, the PC gets motion about 200 µs older, right on time.', wx + 28, wy + 408, { role: 'label', color: C.ink, t, t0: 5.0, cps: 100, maxW: ww - 56, lh: 1.45 });
    text('at 8 kHz every report carries the full running count, so a lost packet\'s motion arrives 125 µs later, inside the next report. the link also hops channel every report and drops the ones losing packets.', wx + 28, wy + 476, { role: 'small', color: C.ink2, t, t0: 6.0, cps: 120, maxW: ww - 56, lh: 1.45 });
    /* the measured numbers */
    const rx = 1176, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('measured, by its developer', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['measured'], ep(t, 1.0, 1.4));
    bignum(t, 1.6, rx + 28, wy + 186, '99 to 100', '%', { size: 64, color: A });
    text('of lost reports rescued at 4 kHz, with a wireless headset in use nearby', rx + 28, wy + 222, { role: 'label', color: C.ink2, alpha: ep(t, 2.0, 2.4), maxW: rw - 56, lh: 1.4 });
    text('at the weakest signal tried, 0.67% of reports were lost, and 15 of 220,017 stayed lost.', rx + 28, wy + 300, { role: 'small', color: C.ink2, t, t0: 2.8, cps: 120, maxW: rw - 56, lh: 1.45 });
    text('the worst room: about 92%, next to a headset base station using nearly every channel.', rx + 28, wy + 370, { role: 'small', color: C.ink2, t, t0: 3.6, cps: 120, maxW: rw - 56, lh: 1.45 });
    text('no mouse maker publishes packet loss yet. this one should, at 8 kHz, in a crowded room.', rx + 28, wy + 470, { role: 'label', color: C.blue, t, t0: 4.6, cps: 90, maxW: rw - 56, lh: 1.4 });
    gloss(t, 2.8, 'packet loss', 'a report the receiver never hears, usually because something else was talking on that channel. the PC sees a missed poll.');
    featureCard(t, 6.4, 'a spare copy, one slot early', ['measured', 'proposal'], 'recover 99% or more of lost reports at every rate, and publish measured loss.');
    captions(t, [[0.6, '2.4 GHz is shared with headsets, phones and Wi-Fi, so some packets get lost. at 1 kHz, one lost report costs up to a full millisecond.'], [3.6, 'send a spare copy one radio slot early, on another channel, and a lost report is replaced on time.'], [6.4, 'in its developer\'s tests that rescued 99 to 100% of lost reports.']]);
  }
});
S({
  id: 'dongle', ch: 'elec', theme: 'night', title: 'a receiver that tells you things', settle: 9, ideas: [85, 86, 88, 21, 22, 25], src: ['pulsarLink', 'ulxLed', 'wiz', 'npm1300'],
  sfxLoop: [{ t0: 3.0, per: 2.2, cues: [[0, 'click'], [0.07, 'release']] }],
  draw: t => {
    header(t, 'a receiver that tells you things');
    const wx = LM, wy = 272, ww = 1080, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const presses = Math.max(0, Math.floor((t - 3.0) / 2.2) + 1), dpi = [800, 1600, 3200][presses % 3], pressing = t > 3.0 && ((t - 3.0) % 2.2) < 0.18;
    const pct = Math.min(100, 73 + Math.floor(Math.max(0, t - 2) * 0.6)), mins = Math.max(0, 41 - Math.floor(Math.max(0, t - 2) * 0.6));
    G.save(); rrPath(wx, wy, ww, wh, 14); G.clip();
    const o = part(wx + ww / 2, wy + 270, 15, () => dongleMM({ lines: [{ t: '8000 Hz', s: 3.4, y: 4.6 }, { t: dpi + ' dpi', s: 2.3, y: 8.2, c: pressing ? acc() : '#9b9a94' }, { t: pct + '%  ' + mins + ' min to full', s: 1.7, y: 10.6, c: '#9b9a94' }], bat: pct / 100, accent: A }), { alpha: Math.max(0.004, ep(t, 0.4, 0.9)) });
    G.restore();
    if (pressing) circle(o.b1[0], o.b1[1] - 2.35 * 15, 40, { color: A, w: 3, alpha: 0.6 });
    callout(t, 1.2, o.screen, 'a small mono screen (#85)', { to: [wx + 180, wy + 90], side: 'r', color: A, role: 'small', maxW: 260 });
    callout(t, 1.6, [o.screen[0] + 80, o.screen[1] + 150], 'battery % and time to full (#86, #88)', { to: [wx + 120, wy + 470], side: 'r', color: A, role: 'small', maxW: 300 });
    callout(t, 2.0, o.b1, 'DPI and polling buttons (#21)', { to: [wx + ww - 200, wy + 470], side: 'r', color: A, role: 'small', maxW: 170 });
    callout(t, 2.4, o.portR, 'passthrough USB-C: charge through the receiver (#22)', { to: [wx + ww - 250, wy + 92], side: 'r', color: A, role: 'small', maxW: 210 });
    text('receiver styling here is generic; the features are the point', wx + ww - 28, wy + wh - 18, { role: 'small', color: C.faint, align: 'right', alpha: ep(t, 2.6, 3.0) });
    /* what it replaces */
    const rx = 1210, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('the benchmark\'s receiver: one LED', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const bands = [['#46b35a', 'over 50%'], ['#e2c13e', 'under 50%'], ['#f0a43a', 'under 25%'], ['#e5484d', 'under 10%']];
    bands.forEach(([c, l], i) => { const y = wy + 110 + i * 44, k = ep(t, 1.2 + i * 0.15, 1.6 + i * 0.15); circle(rx + 44, y, 9, { fill: c, alpha: k }); text(l, rx + 66, y + 6, { role: 'label', color: C.ink2, alpha: k }); });
    text('a colour band can\'t say 73%, or how long the charge has left to run. a screen can, once a fuel gauge is measuring it.', rx + 28, wy + 330, { role: 'label', color: C.ink, t, t0: 3.0, cps: 90, maxW: rw - 56, lh: 1.45 });
    text('plug to pair (#25): wire both once and they pair, the way a DualSense pairs with a PS5 over its cable.', rx + 28, wy + 440, { role: 'small', color: C.mute, t, t0: 4.2, cps: 100, maxW: rw - 56, lh: 1.45 });
    gloss(t, 2.8, 'passthrough', 'a second port on the receiver. the cable from the PC goes into the receiver, and the mouse charges from it without a second cable to the computer.');
    featureCard(t, 5.2, 'a receiver with a screen', ['claim', 'proposal'], 'screen (#85), time to full and battery estimate (#86, #88), DPI and polling buttons, as on Pulsar\'s Link 8K (#21), passthrough (#22), plug to pair (#25).');
    captions(t, [[0.6, 'the receiver sits in front of you all day. it is the right place to show what the mouse is doing.'], [3.0, 'buttons on it change DPI and polling without flipping the mouse over or opening software.'], [5.6, 'and a second port lets it charge the mouse, so one cable from the PC does both jobs.']]);
  }
});
S({
  id: 'cable', ch: 'elec', theme: 'paper', title: 'a cable you can play on', settle: 8, ideas: [19, 20, 70], src: ['tpuCables'],
  draw: t => {
    header(t, 'a cable you can play on');
    const wx = LM, wy = 272, ww = 820, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    figLabel(t, 0.6, wx + 28, wy + 44, 12, 'the charging cable, cut across, about 2.4 mm');
    const o = part(wx + 300, wy + 300, 120, () => cableMM({}), { alpha: ep(t, 0.4, 0.9) });
    callout(t, 1.2, o.sheath, 'paracord sheath, branded (#70)', { to: [wx + 560, wy + 130], side: 'r', color: A, role: 'small', maxW: 220 });
    callout(t, 1.6, o.core, 'braided conductors inside', { to: [wx + 560, wy + 300], side: 'r', color: A, role: 'small', maxW: 220 });
    callout(t, 2.0, o.fill, 'soft filler, no stiff jacket', { to: [wx + 560, wy + 450], side: 'r', color: C.ink2, tcolor: C.ink2, role: 'small', maxW: 220 });
    const rx = 950, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('what reviewers said about the cables in the box', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['measured'], ep(t, 1.0, 1.4)); text('techpowerup reviews', rx + 28, wy + 86, { role: 'small', size: 22, maxW: rw - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const rows = [['G Pro X Superlight 2', '1.80 m rubber', 'below average flexibility'], ['Viper V3 Pro', '1.80 m braided', 'stiff'], ['UltralightX', '1.70 m braided', '"supremely stiff", restricts movement'], ['Maya X', '1.75 m braided', 'prevents playing while charging']];
    rows.forEach((r, i) => { const y = wy + 140 + i * 66, k = ep(t, 1.4 + i * 0.2, 1.8 + i * 0.2); if (i) rule(rx + 28, y - 36, rx + rw - 28, k); text(r[0], rx + 28, y, { role: 'label', color: C.ink, alpha: k }); text(r[1], rx + 28, y + 22, { role: 'small', color: C.mute, alpha: k }); text(r[2], rx + 330, y + 10, { role: 'label', color: C.red, alpha: k, maxW: rw - 360 }); });
    text('the plug angles up so the mouse can\'t run it over (#19), and it\'s thin enough that the receiver sits flat while it still charges at full current (#20).', rx + 28, wy + 440, { role: 'label', color: C.ink, t, t0: 3.2, cps: 80, maxW: rw - 56, lh: 1.45 });
    gloss(t, 2.6, 'cable drag', 'the pull and spring of a cable on a mouse. on a 35 g mouse a stiff cable is a noticeable part of the weight you move.');
    featureCard(t, 4.6, 'a soft, angled cable', ['measured', 'proposal'], 'angled plug (#19), sized for a flat receiver and full charging (#20), paracord with braided wires (#70).');
    captions(t, [[0.6, 'on all four flagship-class mice, reviewers called the cable in the box too stiff to play on while it charges.'], [3.4, 'a paracord sheath over braided conductors bends like rope, and an angled plug keeps it clear of the mouse.']]);
  }
});
S({
  id: 'software', ch: 'elec', theme: 'night', title: 'software in a browser tab', settle: 9, ideas: [23, 65, 66, 87, 'qr'], src: ['webhid', 'tpuUlx9'],
  sfx: [[3.0, 'click'], [3.12, 'release'], [4.2, 'click'], [4.5, 'tick'], [4.8, 'tick'], [5.1, 'release'], [6.5, 'click'], [7.5, 'release']],
  draw: t => {
    header(t, 'software in a browser tab');
    const wx = LM, wy = 272, ww = 980, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    /* a generic browser window with a configurator */
    const bx = wx + 40, by = wy + 40, bw = ww - 80, bh = wh - 80, k = ep(t, 0.5, 1.0);
    rr(bx, by, bw, bh, 12, TH ? '#ffffff' : '#101113', inkA(0.2), 1.5, k);
    rr(bx, by, bw, 44, 12, inkA(0.06), null, 1, k);
    for (let i = 0; i < 3; i++) circle(bx + 24 + i * 20, by + 22, 6, { fill: inkA(0.25), alpha: k });
    rr(bx + 100, by + 10, 360, 24, 8, inkA(0.06), null, 1, k); text('store  ›  configure', bx + 116, by + 27, { role: 'small', color: C.mute, alpha: k });
    /* a cursor works the page once: polling to 8 kHz, lift-off down to 0.7 mm, DPI down to 800; each change is written to the mouse */
    const cx = bx + 40, cy = by + 100, x0 = cx + 220, w0 = bw - 320, u = t - 2.2;
    const poll = u < 0.9 ? 0 : 3, lo = u < 2.0 ? 3 : u < 2.9 ? Math.round(lerp(3, 0, E.io3(prog(u, 2.0, 2.9)))) : 0, dpiF = u < 4.3 ? 0 : E.io3(prog(u, 4.3, 5.3)), dpi = Math.round(lerp(1600, 800, dpiF) / 50) * 50;
    const knob = (v2) => x0 + w0 * (v2 - 400) / 6000;
    const P = { rest: [bx + bw - 60, by + bh - 50], chip8: [x0 + 3 * 86 + 36, cy + 72], lo3: [x0 + 3 * 30, cy + 144], lo0: [x0, cy + 144], dpiA: [knob(1600), cy], dpiB: [knob(800), cy] };
    const cur = kf(u, [[0, P.rest], [0.8, P.chip8], [1.3, P.chip8], [1.9, P.lo3], [2.0, P.lo3], [2.9, P.lo0], [3.4, P.lo0], [4.2, P.dpiA], [4.3, P.dpiA], [5.3, P.dpiB], [5.8, P.dpiB], [6.8, P.rest]]);
    const rows = [['DPI', 'slider', dpi], ['polling', 'chips', ['1k', '2k', '4k', '8k']], ['lift-off', 'steps', (0.7 + lo * 0.1).toFixed(1) + ' mm'], ['debounce', 'value', '0 ms, SPDT'], ['sensor angle', 'value', '−2.0°']];
    rows.forEach(([l, kind, v], i) => {
      const y = cy + i * 72, kk = ep(t, 1.0 + i * 0.2, 1.4 + i * 0.2);
      text(l, cx, y + 6, { role: 'label', color: C.ink, alpha: kk });
      if (kind === 'slider') { line(x0, y, x0 + w0, y, { color: C.hair, w: 4, alpha: kk }); const f = (v - 400) / 6000; line(x0, y, x0 + w0 * f, y, { color: A, w: 4, alpha: kk }); circle(x0 + w0 * f, y, 10, { fill: A, alpha: kk }); if (u > 4.3 && u < 5.5) circle(x0 + w0 * f, y, 16, { color: A, w: 2, alpha: kk * 0.4 }); text(String(v), x0 + w0 + 16, y + 6, { role: 'label', color: A, alpha: kk }); }
      else if (kind === 'chips') v.forEach((c, j) => { const on = j === poll, fl = j === 3 ? env(u, 0.85, 0.95, 1.1, 1.6) : 0; rr(x0 + j * 86, y - 16, 72, 32, 8, on ? A : inkA(0.06), on ? null : inkA(0.2), 1.2, kk); if (fl > 0) rr(x0 + j * 86 - 5 * fl, y - 16 - 5 * fl, 72 + 10 * fl, 32 + 10 * fl, 11, null, A, 2, kk * fl * 0.6); text(c, x0 + j * 86 + 36, y + 6, { role: 'label', color: on ? (TH ? '#fff' : '#0d0e0f') : C.ink2, align: 'center', alpha: kk }); });
      else if (kind === 'steps') { for (let j = 0; j <= 10; j++) line(x0 + j * 30, y - 8, x0 + j * 30, y + 8, { color: j === lo ? A : C.faint, w: j === lo ? 3 : 1.5, alpha: kk }); circle(x0 + lo * 30, y, 7, { fill: A, alpha: kk }); text(v, x0 + 330, y + 6, { role: 'label', color: A, alpha: kk }); }
      else text(v, x0, y + 6, { role: 'label', color: A, alpha: kk });
    });
    /* each change lands in the mouse's own memory, so it carries to any computer */
    for (const tw0 of [1.0, 3.0, 5.4]) { const kt = env(u, tw0, tw0 + 0.25, tw0 + 1.3, tw0 + 1.6); if (kt <= 0) continue; const ty = by + bh - 40 + (1 - kt) * 12; rr(bx + 40, ty - 22, 252, 34, 17, rgba(C.green, 0.16), C.green, 1.4, kt); text('✓  saved on the mouse', bx + 62, ty, { role: 'label', color: C.green, alpha: kt }); }
    if (u > 0 && t > 1.6) {
      const ca = ep(t, 1.6, 2.0), down = [0.8, 2.0, 4.3].some(c0 => u > c0 && u < c0 + 0.12) || (u > 2.0 && u < 2.9) || (u > 4.3 && u < 5.3);
      for (const c0 of [0.8, 2.0, 4.3]) { const rk = prog(u, c0, c0 + 0.45); if (rk > 0 && rk < 1) circle(cur[0], cur[1], 8 + rk * 26, { color: A, w: 2, alpha: ca * (1 - rk) * 0.8 }); }
      G.save(); G.globalAlpha = ca; G.translate(cur[0], cur[1]); const sc = down ? 0.9 : 1; G.scale(sc, sc);
      G.beginPath(); G.moveTo(0, 0); G.lineTo(0, 24); G.lineTo(6, 18.5); G.lineTo(10.5, 28); G.lineTo(14.5, 26.2); G.lineTo(10, 17); G.lineTo(17.5, 17); G.closePath();
      G.fillStyle = TH ? '#141516' : '#f7f6f2'; G.fill(); G.strokeStyle = TH ? '#f7f6f2' : '#141516'; G.lineWidth = 1.6; G.lineJoin = 'round'; G.stroke(); G.restore();
    }
    text('a generic mock-up of the configurator', wx + ww - 52, wy + wh - 54, { role: 'small', color: C.faint, align: 'right', alpha: k });
    const rx = 1110, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('how it works, and its limits', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['datasheet'], ep(t, 1.0, 1.4));
    const notes = [['WebHID: Chrome and Edge 89 and up. not Firefox or Safari.', C.ink2], ['you pick the device in a browser prompt, one device at a time, and raw keyboard and mouse input stays blocked.', C.ink2], ['the benchmark\'s web panel only talks to the receiver, so nothing changes while it charges. a mouse that is a full wired device fixes that (#90).', C.ink], ['firmware with each drop: motion latency (#65) and sensor tuning with PixArt (#66), a QR code on the board that opens the configurator.', A]];
    let ny = wy + 130; notes.forEach(([s2, col], i) => { const r = text(s2, rx + 28, ny, { role: 'label', color: col, t, t0: 1.6 + i * 0.9, cps: 90, maxW: rw - 56, lh: 1.42 }); ny += Math.max(r.h, 22) + 22; });
    gloss(t, 2.6, 'WebHID', 'a browser standard that lets a web page talk to a USB device after you allow it. nothing to install, nothing running in the background.');
    featureCard(t, 4.6, 'software in the browser', ['datasheet', 'proposal'], 'a web app on the store\'s own domain (#23), sensor angle and position in software (#87), firmware that keeps improving (#65, #66).');
    captions(t, [[0.6, 'mouse software is usually a large download that runs all the time. a browser tab doesn\'t install anything, and settings live on the mouse.'], [4.0, 'the limits are real: it needs a Chromium browser, and you approve each device once.']]);
  }
});

