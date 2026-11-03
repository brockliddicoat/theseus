/* ============================== glide and tracking ============================== */
S({
  id: 'glide', ch: 'glide', card: true, theme: 'night', title: 'glide and tracking', settle: 5,
  draw: t => {
    chapterCard(t, { name: 'glide', gloss: 'what touches the pad, and how the sensor sees what is under it.', list: [['#10', 'two dot skates per corner'], ['#8', 'POM and PTFE both in the box'], ['#11', 'no cutouts under the skates'], ['#52', 'screws clear of the skates'], ['#37', 'a smaller sensor lens'], ['#76', 'a current sensor, set up properly'], ['lod', 'lift-off in 0.1 mm steps']] });
    const sink = 0.18 + 0.14 * (0.5 + 0.5 * Math.sin(t * 1.4));
    drawSkate(1440, 600, 34, { sink: sink * ep(t, 1.4, 2.2), alpha: ep(t, 1.0, 1.7) });
    figLabel(t, 2.0, 1130, 920, 5, 'A dot skate on a cloth pad');
  }
});
S({
  id: 'dots', ch: 'glide', theme: 'paper', title: 'eight dots, half the pressure', settle: 9, ideas: [10, 8], src: ['obsidianDots', 'plasticsFric', 'wieleba09', 'delrin150'],
  draw: t => {
    header(t, 'eight dots, half the pressure');
    const wx = LM, wy = 272, ww = 700, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    /* the hand's load rises and falls as it would in a session; both skates follow it, and the ratio never changes */
    const sk = ep(t, 2.6, 3.6, E.io3), load = 1 + 0.3 * Math.sin(Math.max(0, t - 4.4) * 1.5) * ep(t, 4.4, 5.4);
    const rows = [[wy + 52, 0.5, '4 dots of 6.5 mm', '133 mm² of contact', C.red], [wy + 318, 0.25, '8 dots of 6.5 mm', '265 mm²: half the pressure', A]];
    rows.forEach(([y0, d, l1, l2, col], i) => {
      const t0 = 0.6 + i * 0.4;
      text(l1, wx + 28, y0, { role: 'label', color: C.ink, t, t0, cps: 70 });
      text(l2, wx + 28, y0 + 30, { role: 'small', size: 24, weight: 600, color: col, t, t0: t0 + 0.3, cps: 90, alpha: ep(t, 1.6, 2.0) });
      const o = drawSkate(wx + ww / 2, y0 + 112, 28, { sink: d * sk * load, alpha: ep(t, t0, t0 + 0.5) });
      if (sk > 0.05) arrow(wx + ww / 2, y0 + 72 - 32 * load, wx + ww / 2, y0 + 72, { color: C.ink, w: 1.6 + 1.4 * load, hs: 8 + 3 * load, alpha: ep(t, 2.4, 2.8) });
      if (t > 4.6) text(i ? 'Same load, half the sink' : 'Hand load ' + load.toFixed(2) + '×', wx + 28, y0 + 64, { role: 'label', size: 20, color: i ? col : C.mute, alpha: ep(t, 4.6, 5.0) });
    });
    /* friction of skate materials */
    const cx = 840, cw = W - LM - cx;
    demoWindow(cx, wy, cw, wh, ep(t, 0.5, 0.9));
    text('friction coefficient, by material', cx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(cx, wy, cw, ['datasheet'], ep(t, 1.0, 1.4));
    hbars(t, { x: cx + 28, y: wy + 150, w: cw - 500, labelW: 290, rowH: 74, min: 0, max: 0.4, t0: 1.2, grid: [0, 0.1, 0.2, 0.3, 0.4], gridFmt: v => v.toFixed(1), rows: [
      { label: 'PTFE', v0: 0.05, v: 0.10, color: A, text: '0.05 to 0.10', sub: 'Fastest start' },
      { label: 'UHMW-PE', v0: 0.12, v: 0.25, color: C.gray, text: '0.12 to 0.25', sub: 'In between' },
      { label: 'POM (acetal)', v0: 0.11, v: 0.35, color: C.ink, text: '0.11 to 0.35', sub: 'Delrin 150: 0.20' }
    ] });
    text('Static, on steel, one rig (Wieleba 2009): PTFE 0.07 to 0.14, POM 0.14 to 0.18.', cx + 28, wy + 430, { role: 'small', size: 23, color: C.ink2, t, t0: 2.6, cps: 110, maxW: cw - 56, lh: 1.34 });
    text('PTFE for speed, POM for control and wear. Both ship in the box.', cx + 28, wy + 516, { role: 'small', weight: 700, color: A, t, t0: 3.6, cps: 60, maxW: cw - 56, lh: 1.34 });
    keyPlan(t, 1.0, wx + ww - 60, wy + 92, { s: 0.42, hi: 'skates', label: 'Skates' });
    gloss(t, 3.0, 'Static friction', 'The force to start a still mouse moving. Much above the moving friction, and small corrections jump.');
    featureCard(t, 4.0, 'Two dots per corner', ['derived', 'datasheet'], 'Round dots have no corners to catch (#10). POM and PTFE both in the box (#8).');
    source(t, 'Pad sink drawn to show the ratio, not measured. Friction: plastics datasheets, Wieleba 2009, Delrin 150.', { t0: 3 });
    captions(t, [[0.6, 'two dots in each corner doubles the contact area, so the same hand pressure is spread over twice the plastic.'], [3.0, 'on soft pads that is the difference between gliding over the cloth and sinking into it.'], [5.6, 'and since materials trade speed for control, the mouse ships with both instead of picking for you.']]);
  }
});
S({
  id: 'focus', ch: 'glide', theme: 'night', title: 'the sensor\'s 0.4 mm window', settle: 10, ideas: [11, 52, 37, 'lod'], src: ['paw3395', 'zowieSkates', 'huanLod', 'mkb3955', 'tpuUlx', 'tpuUlxLod'],
  draw: t => {
    header(t, 'the sensor\'s 0.4 mm window');
    const wx = LM, wy = 272, ww = 1060, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    figLabel(t, 0.6, wx + 28, wy + 44, 6, 'sensor and lens in section, 34 px per mm');
    const lift = 0.42 * Math.sin(Math.max(0, t - 3.4) * 0.9) * ep(t, 3.4, 4.0), s = 30;
    const o = drawSensor(wx + 560, wy + 318, s, { lift, accent: A, band: ep(t, 1.4, 1.9) > 0.5, alpha: ep(t, 0.4, 1.0) });
    const dist = 2.4 + lift;
    callout(t, 1.0, o.led, 'LED', { to: [wx + 300, wy + 128], side: 'l', color: C.ink2, tcolor: C.ink2 });
    callout(t, 1.2, o.pipe, 'Light pipe', { to: [wx + 170, wy + 300], side: 'l', color: C.ink2, tcolor: C.ink2 });
    callout(t, 1.4, o.array, 'Sensor array, through a hole in the board', { to: [wx + 600, wy + 128], side: 'r', color: C.ink2, tcolor: C.ink2, maxW: 300 });
    text('Window: lens to surface, 2.2 to 2.6 mm (PAW3395)', wx + 28, wy + wh - 28, { role: 'label', size: 21, color: A, alpha: ep(t, 1.6, 2.0) });
    if (o.spot) { text(`${dist.toFixed(2)} mm`, o.spot[0] + 22, o.spot[1] + 40, { role: 'h3', size: 30, color: o.inWin ? A : C.red, alpha: ep(t, 2.0, 2.4) }); text(o.inWin ? 'Tracking' : 'Outside: errors', o.spot[0] + 22, o.spot[1] + 64, { role: 'label', size: 20, color: o.inWin ? C.mute : C.red, alpha: ep(t, 2.0, 2.4) }); }
    
    /* right: LOD steps, and screws clear of the dots */
    const rx = 1196, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('lift-off settings', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const lx = rx + 40, lw2 = rw - 80;
    for (let i = 0; i <= 10; i++) { const x = lx + lw2 * i / 10, k = ep(t, 1.4 + i * 0.05, 1.7 + i * 0.05); line(x, wy + 110, x, wy + 140, { color: A, w: 2.5, alpha: k }); }
    text('0.1 mm steps, 0.7 to 1.7 mm: native on the PAW3955', lx, wy + 176, { role: 'small', size: 23, weight: 600, color: A, maxW: lw2, lh: 1.32, alpha: ep(t, 1.8, 2.2) });
    for (const v of [1, 2]) { const x = lx + lw2 * (v - 0.7) / 1.0; if (x < lx + lw2) line(x, wy + 236, x, wy + 266, { color: C.gray, w: 3, alpha: ep(t, 2.2, 2.6) }); }
    text('PAW3395: 1 and 2 mm presets', lx, wy + 298, { role: 'small', size: 23, weight: 600, color: C.mute, alpha: ep(t, 2.4, 2.8) });
    rule(rx + 28, wy + 330, rx + rw - 28, ep(t, 4.4, 4.8));
    /* a patch of base plate: two dots and the screw between them */
    const px0 = rx + rw / 2, py0 = wy + 430, kk = ep(t, 4.6, 5.0);
    part(px0, py0, 11, () => {
      solid(() => pathRR(-13, -6.5, 26, 13, 2.2), MT.shell, [-13, -6.5, 26, 13], {});
      for (const dx of [-7.6, 7.6]) { G.beginPath(); G.arc(dx, 0, 3.25, 0, TAU); G.fillStyle = grad(MT.ptfe, dx - 3, -3, dx + 3, 3); G.fill(); G.strokeStyle = edgeCol(MT.ptfe); G.lineWidth = lw(1); G.stroke(); G.beginPath(); G.arc(dx, 0, 2.9, 0, TAU); G.strokeStyle = 'rgba(0,0,0,0.12)'; G.lineWidth = lw(1); G.stroke(); }
      xsave(); xscale(0.8); screwHeadMM(); xrest();
    }, { alpha: kk });
    text('Screws between the dots (#52)', rx + 28, wy + wh - 28, { role: 'label', size: 21, color: A, alpha: ep(t, 5.0, 5.4), maxW: rw - 56 });
    keyPlan(t, 1.0, wx + ww - 80, wy + 380, { s: 0.6, hi: 'sensor', cut: { type: 'cross', y: 4, label: 'C' }, label: 'Section C' });
    gloss(t, 2.6, 'Lift-off distance', 'How high the mouse lifts before tracking stops. Fine steps let you set it just above your pad.');
    featureCard(t, 5.6, 'A 0.4 mm window', ['datasheet', 'derived'], 'Skates, pockets and lens height stack inside it (#11). A smaller lens (#37), 0.1 mm LOD steps.');
    captions(t, [[0.6, 'the sensor only sees the surface clearly between 2.2 and 2.6 mm from its lens. everything under the mouse stacks up inside that.'], [3.4, 'change the skate thickness by a few tenths and the surface leaves the window.'], [6.4, 'and the screws sit between the dots, so opening the mouse never costs you a set of skates.']]);
  }
});
S({
  id: 'sensor', ch: 'glide', theme: 'paper', title: 'fill every 8 kHz report', settle: 9, ideas: [76, 87, 'xy dpi'], src: ['tpu8k', 'paw3395', 'paw3950', 'eps3395', 'eps3950', 'kc3955', 'mkb3955', 'jisaku3395'],
  draw: t => {
    header(t, 'fill every 8 kHz report');
    const wx = LM, wy = 272, ww = 1000, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('Slowest hand that fills every report', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 1.0, 1.4));
    const m = axes(t, { x: wx + 110, y: wy + 120, w: ww - 170, h: 330, xr: [400, 6400], yr: [0, 21], xlog: true, xticks: [400, 800, 1600, 3200, 6400], yticks: [0, 5, 10, 15, 20], yfmt: v => v + ' in/s', xlabel: 'CPI', t0: 1.0 });
    const pts = []; for (let c = 400; c <= 6400; c *= 1.05) pts.push([c, 8000 / c]);
    series(m, pts, { color: A, w: 3.5, p: ep(t, 1.4, 2.6, E.lin) });
    for (const c of [800, 1600, 3200]) { const k = ep(t, 2.6 + c / 4000, 3.0 + c / 4000); circle(m.X(c), m.Y(8000 / c), 6, { fill: A, alpha: k }); text(`${(8000 / c).toFixed(1)} in/s`, m.X(c) + 14, m.Y(8000 / c) - 12, { role: 'num', size: 22, color: A, alpha: k }); }
    text('Below the line, some reports go out empty', m.X(450), m.Y(1.6), { role: 'small', size: 23, weight: 600, color: C.red, alpha: ep(t, 3.6, 4.0) });
    /* a probe sweeps the CPI; at a steady 4 in/s, sixteen reports show which ones carry a count */
    if (t > 6) {
      const pk = ep(t, 6, 6.6), u = 0.5 - 0.5 * Math.cos((t - 6) * TAU / 10), c = 400 * Math.pow(16, u), v = 8000 / c, cpr = 4 * c / 8000;
      line(m.X(c), m.Y(0), m.X(c), m.Y(Math.min(21, v)), { color: C.ink, w: 1.2, dash: [4, 4], alpha: pk * 0.5 });
      if (v <= 21) { circle(m.X(c), m.Y(v), 13, { color: C.ink, w: 1.5, alpha: pk * 0.35 }); circle(m.X(c), m.Y(v), 6, { fill: C.ink, alpha: pk }); }
      const sx = wx + ww - 40 - 16 * 19, sy = wy + 168;
      text(fmt(Math.round(c / 10) * 10) + ' CPI at 4 in/s', wx + ww - 40, wy + 150, { role: 'label', size: 21, color: C.ink, align: 'right', alpha: pk });
      let empty = 0;
      for (let i = 0; i < 16; i++) { const full = Math.floor((i + 1) * cpr + 1e-9) > Math.floor(i * cpr + 1e-9); if (!full) empty++; rr(sx + i * 19, sy, 15, 22, 3, full ? A : null, full ? null : C.red, 1.4, pk); }
      text(empty ? empty + ' of 16 reports empty' : 'Every report carries a count', wx + ww - 40, sy + 46, { role: 'label', size: 21, color: empty ? C.red : A, align: 'right', alpha: pk });
    }
    const rx = 1140, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('sensor generations', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['datasheet'], ep(t, 1.0, 1.4));
    const rows = [['', 'PAW3395', 'PAW3950', 'PAW3955'], ['out', '2022', '2024', '2026'], ['max speed', '650 IPS', '750 IPS', '750 IPS'], ['acceleration', '50 G', '50 G', '60 G'], ['CPI steps', '50', '50', '1'], ['run current', '2.4 mA', '1.3 mA', 'not public'], ['glass', 'no mode', 'glass mode', 'glass mode']];
    const cx = [rx + 28, rx + 200, rx + 360, rx + 520];
    rows.forEach((r, i) => { const y = wy + 120 + i * 44, k = ep(t, 1.6 + i * 0.12, 2.0 + i * 0.12); if (i) rule(rx + 28, y - 30, rx + rw - 28, k); r.forEach((c, j) => text(c, cx[j], y, j === 0 || !i ? { role: 'label', size: 19, color: j === 3 ? A : C.mute, alpha: k } : { font: 'mono', size: 22, weight: j === 3 ? 800 : 600, color: j === 3 ? A : C.ink2, alpha: k })); });
    
    text('The 3955 adds 1-CPI steps and 0.7 mm lift-off. Its LGA package solders flat, so the board sets its height.', rx + 28, wy + 470, { role: 'small', size: 24, color: C.ink, t, t0: 3.4, cps: 90, maxW: rw - 56, lh: 1.34 });
    gloss(t, 2.8, 'CPI', 'Counts per inch: movement steps reported per inch. At 8000 reports a second, each one needs a count.');
    featureCard(t, 4.2, 'A current sensor, set up right', ['datasheet', 'derived'], 'PAW3955 class, LGA package (#76). X and Y CPI apart, sensor angle in software (#87).');
    captions(t, [[0.6, 'at 8000 reports a second, the sensor has to have moved at least one count between reports, or the report goes out empty.'], [3.6, 'that sets a minimum hand speed for every CPI. the higher the CPI, the slower you can move and still use the full rate.'], [6.0, 'a newer sensor runs on about half the current, and the newest reports in single counts.']]);
  }
});

