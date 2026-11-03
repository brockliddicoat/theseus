/* ============================== close ============================== */
S({
  id: 'close', ch: 'end', theme: 'night', title: 'Close', settle: 8,
  draw: t => {
    const figs = [
      (x, y) => drawSwitch(x - 6.4 * 9, y + 14, 9, { clear: true, press: clickCurve(cyc(t, 3, 3)), accent: C.blue }),
      (x, y) => drawSkate(x, y, 8, { sink: 0.22 + 0.12 * (0.5 + 0.5 * Math.sin(t * 1.5)) }),
      (x, y) => drawSensor(x, y + 4, 7.2, { accent: C.green, lift: 0.18 * Math.sin(t * 0.9) }),
      (x, y) => part(x, y + 26, 10, () => insertMM({ k: 0.55 + 0.45 * pingpong(t, 6) })),
      (x, y) => part(x, y, 5.6, () => wheelSideMM({ rot: t * 0.3 })),
      (x, y) => part(x, y, 4.2, () => boardMM({})),
      (x, y) => part(x, y, 4.6, () => dongleMM({ lines: [{ t: '8000 Hz', s: 3.4, y: 4.6 }], cables: false })),
      (x, y) => part(x, y, 30, () => screwHeadMM(), { rot: t * 0.5 })
    ];
    /* the parts, in a 4 × 2 grid of registration frames, each with its figure number */
    const names = ['Switch', 'Skate', 'Sensor', 'Insert', 'Wheel', 'Board', 'Receiver', 'Screw'];
    figs.forEach((f, i) => {
      const col = i % 4, row = Math.floor(i / 4), cw = 200, x0 = 1040 + col * cw, y0 = 250 + row * 300, x = x0 + cw / 2, y = y0 + 120 + Math.sin(t * 0.7 + i * 0.8) * 3, k = ep(t, 0.6 + i * 0.15, 1.2 + i * 0.15);
      part(0, 0, 1, () => f(x, y), { alpha: k * 0.92 });
      line(x0 + 12, y0 + 226, x0 + cw - 12, y0 + 226, { color: C.hair, w: 1.2, p: k });
      text('Fig. ' + pad2(i + 1), x0 + 12, y0 + 256, { role: 'label', size: 19, color: C.faint, alpha: k });
      text(names[i], x0 + 12, y0 + 284, { role: 'label', size: 20, color: C.ink2, alpha: k });
    });
    /* the quote, Kunai's pull-quote: a bar on its left */
    const Q = 'If there\'s something you can do to improve your product that others aren\'t doing just because it takes too much time, that\'s one of the most valuable things you can implement to show you care.';
    const qs = { role: 'h3', size: 40, weight: 700, color: C.ink, sentence: false, maxW: 820, lh: 1.3 }, qn = wrap(Q, qs, 820).length, qa = 300 + (qn - 1) * 52 + 66;
    rect(LM, 262, 6, (qa + 18 - 262) * ep(t, 1.0, 1.6, E.out3), { fill: YEL });
    text(Q, LM + 40, 300, Object.assign({ t, t0: 1.2, cps: 60 }, qs));
    text('Brock Liddicoat', LM + 40, qa, { role: 'label', size: 22, color: C.mute, t, t0: 5.0, cps: 60 });
    /* the sign-off: the name again, small and certain */
    line(LM, 800, LM + 860 * ep(t, 5.4, 6.4, E.cam), 800, { color: C.hair, w: 1.5 });
    text('Theseus', LM - 4, 912, { role: 'd2', size: 96, color: C.ink, t, rise: [5.8, 0.9] });
    text('A Nitrite Labs mouse, in development for years.', LM, 966, { role: 'small', size: 25, color: C.ink2, t, t0: 6.4, cps: 60 });
  }
});
