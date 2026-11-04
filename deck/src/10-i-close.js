/* ============================== close (chapter code ntr): Brock's line, the shell turning, THESEUS ============================== */
S({
  id: 'close', ch: 'end', theme: 'night', chrome: false, title: 'Close', settle: 9, three: ['shell'],
  src: ['ntrScan'],
  draw: t => {
    /* the hero: the shell, whole, on a slow low orbit */
    /* in 3D only: Brock dropped the flat mouse from the cover, and the close answers the cover */
    if (!V2D.on) {
      const V = [820, 70, 1100, 800];
      ntr_prime('shell', t, V[2], V[3]);
      const kc = ep(t, 0.0, 9.0, E.io3), drift = t > 9 ? Math.sin((t - 9) * 0.2) : 0;
      view3D('shell', t, V[0], V[1], V[2], V[3], { view: 'low', view2d: 'left', yaw: lerp(0.5, 0.05, kc) + 0.06 * drift, pitch: 0.04, zoom: lerp(1.42, 1.58, kc), colorway: 'black' }, { alpha: ep(t, 0.2, 1.4) });
      rich([{ s: 'Fig. 00', role: 'label', size: 21, color: C.mute }, { s: 'Sora V2 shape, a placeholder', role: 'label', size: 21, color: C.faint, gap: 16 }], RM, 800, { align: 'right', alpha: ep(t, 4.0, 4.6) });
    }
    /* top row */
    chapterIcon('intro', LM, LAY.labelY - 19, 22, C.hero, ep(t, 0.1, 0.4));
    text('Nitrite Labs', LM + 36, LAY.labelY, { role: 'label', color: C.ink2, t, t0: 0.15, cps: 40 });
    /* the line, in Brock's words: a yellow bar on its left */
    const Q = 'If there\'s something you can do to improve your product that others aren\'t doing just because it takes too much time, that\'s one of the most valuable things you can implement to show you care.';
    const qs = { role: 'h3', size: 40, weight: 700, color: C.ink, sentence: false, maxW: 760, lh: 1.3 }, qn = wrap(Q, qs, 760).length, qy = 236, qa = qy + (qn - 1) * 52 + 64;
    rect(LM, qy - 40, 6, (qa + 16 - (qy - 40)) * ep(t, 0.8, 1.4, E.out3), { fill: C.hero });
    text(Q, LM + 40, qy, Object.assign({ t, t0: 1.0, cps: 60 }, qs));
    text('Brock Liddicoat', LM + 40, qa, { role: 'label', size: 22, color: C.mute, t, t0: 4.6, cps: 60 });
    /* THESEUS, rising letter by letter, the way the film opened */
    const st = { role: 'hero', size: 230, track: -0.028 }, word = 'THESEUS', x0 = LM - 12, yb = 884;
    setFont(sty(st)); const ls = lsPx(sty(st));
    const advs = [...word].map((ch, i) => G.measureText(word.slice(0, i + 1)).width - G.measureText(word.slice(0, i)).width);
    let xx = x0;
    [...word].forEach((ch, i) => {
      const k = E.rise(prog(t, 5.2 + i * 0.07, 6.0 + i * 0.07));
      if (k > 0) { G.save(); G.beginPath(); G.rect(xx - 10, yb - st.size * 0.8, advs[i] + 20, st.size * 0.86); G.clip(); text(ch, xx, yb + (1 - k) * st.size * 0.82, Object.assign({}, st, { caps: false, color: C.ink })); G.restore(); }
      xx += advs[i] + ls;
    });
    rich([{ s: 'In pursuit of an', role: 'labelL', size: 26, color: C.mute }, { s: 'objectively better', role: 'labelL', size: 26, color: C.ink2, gap: 12 }, { s: 'mouse', role: 'labelL', size: 26, color: C.heroText, grad: C.heroGrad, gap: 12 }], LM, 964, { alpha: ep(t, 6.4, 7.0) });
    /* the byline */
    line(LM, LAY.ruleY, LM + (RM - LM) * ep(t, 0.3, 1.4, E.cam), LAY.ruleY, { color: C.hair, w: 1.5 });
    rich([{ s: 'Brock Liddicoat', role: 'foot', weight: 700, caps: true, track: 0.16, color: C.ink2 }, { s: '/', role: 'foot', color: C.faint, gap: 14 }, { s: 'Nitrite Labs', role: 'foot', caps: true, track: 0.12, color: C.mute, gap: 14 }, { s: '/', role: 'foot', color: C.faint, gap: 14 }, { s: 'Every number\'s source: the sources button, under the slide', role: 'foot', caps: true, track: 0.12, color: C.faint, gap: 14 }], LM, LAY.footY, { alpha: ep(t, 6.6, 7.2) });
    text(`${pad2(DECK.slides.length)} / ${pad2(DECK.slides.length)}`, RM, LAY.footY, { role: 'foot', weight: 600, color: C.mute, align: 'right', alpha: ep(t, 6.6, 7.2) });
  }
});
