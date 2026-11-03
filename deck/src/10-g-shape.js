/* ============================== shape ============================== */
S({
  id: 'shapecard', ch: 'shape', card: true, theme: 'night', title: 'shape', settle: 5,
  draw: t => {
    chapterCard(t, { name: 'shape', gloss: 'the shape will keep changing until it ships, so this chapter is about the rules it has to follow, not the outline.', list: [['newton', 'curves that push the hand on, not off'], ['#47', 'shallow grooves near the front'], ['#42', 'rounded, defined shoulders'], ['#40', 'a lower front'], ['#38', 'a straighter, pointier front'], ['size', 'sized against real hands'], ['#45', 'EMG to check every iteration']] });
    const ks = ep(t, 1.0, 1.7); part(1440, 600, 24, () => groovePart(t), { alpha: ks });
    if (t > 2.2) { const a4 = ep(t, 2.2, 2.7), xm = 6.5 * Math.sin((t - 2.2) * 0.7), ym = -0.035 * xm * xm, nl = Math.hypot(0.07 * xm, 1), ux = -0.07 * xm / nl, uy = -1 / nl, R = 2.2; fingerAt(1440 + (xm + ux * R) * 24, 600 + (ym + uy * R) * 24, R * 24, a4 * 0.95); }
    figLabel(t, 2.0, 1130, 920, 13, 'A slice through a grip surface');
  }
});
function fingerAt(x, y, r, a) { G.save(); G.globalAlpha = a; const g = G.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r); g.addColorStop(0, '#e2b39b'); g.addColorStop(1, '#c48a72'); G.beginPath(); G.arc(x, y, r, 0, TAU); G.fillStyle = g; G.fill(); G.strokeStyle = 'rgba(120,70,50,0.8)'; G.lineWidth = 1.5; G.stroke(); G.restore(); }
S({
  id: 'grooves', ch: 'shape', theme: 'night', title: 'curves that push the hand on, not off', settle: 9, ideas: ['newton', 47, 42], src: ['kuijt'],
  draw: t => {
    header(t, 'curves that push the hand on, not off');
    const wx = LM, wy = 272, ww = 1100, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    const panel = (cx, sign, label, col, t0) => {
      /* a generic surface slice: convex (sign -1) or concave (sign +1) */
      const sc = 24, k = ep(t, t0, t0 + 0.6), y0 = wy + 330;
      const f = x => sign * 0.035 * x * x;
      part(cx, y0, sc, () => solid(() => { G.beginPath(); for (let x = -10; x <= 10; x += 0.2) G.lineTo(x, f(x)); for (let x = 10; x >= -10; x -= 0.2) G.lineTo(x, f(x) + 1.4); G.closePath(); }, MT.shell, [-10, -4, 20, 6], { hatch: true }), { alpha: k });
      /* a fingertip that settles where the surface sends it */
      /* after the first pass the finger is set down again every 6 s and the surface decides again */
      const lc = t >= 9 ? (t - 9) % 6 : -1, fk = lc >= 0 ? ep(lc, 0, 0.35) * (1 - ep(lc, 5.5, 6)) : 1 - ep(t, 8.6, 9);
      const u0 = 3.2, tt = lc >= 0 ? Math.max(0, lc - 0.6) : Math.max(0, t - t0 - 1.2), u = sign < 0 ? u0 * Math.exp(-tt * 1.1) * Math.cos(tt * 2.2) : Math.min(8.6, u0 * Math.exp(tt * 0.45));
      const slope = 2 * sign * 0.035 * u, nx = -slope, ny = 1, nl = Math.hypot(nx, ny), r = 2.4;
      const fx = cx + (u - nx / nl * r) * sc, fy = y0 + (f(u) - ny / nl * r) * sc - (lc >= 0 ? (1 - ep(lc, 0, 0.5, E.out3)) * 40 : 0);
      fingerAt(fx, fy, r * sc, k * fk);
      const px = cx + u * sc, py = y0 + f(u) * sc, Ln = 110;
      arrow(px, py, px - nx / nl * Ln * 0.01 - nx / nl * Ln, py - ny / nl * Ln, { color: col, w: 3.5, hs: 13, alpha: ep(t, t0 + 0.8, t0 + 1.2) * fk });
      const side = -nx / nl * Ln; arrow(px, py - 4, px + side, py - 4, { color: col, w: 3, hs: 11, alpha: ep(t, t0 + 1.0, t0 + 1.4) * (Math.abs(side) > 6 ? 1 : 0) * fk });
      text(label, cx, wy + 76, { role: 'label', color: col, align: 'center', t, t0, cps: 60, maxW: 420 });
    };
    panel(wx + 290, 1, 'convex: the push points outward', C.red, 0.6);
    panel(wx + 810, -1, 'concave: the push points to the middle', A, 1.0);
    text('Sideways share of the push: N · sin θ, θ the tilt under the finger', wx + ww / 2, wy + wh - 26, { role: 'small', size: 22, color: C.mute, align: 'center', alpha: ep(t, 3.0, 3.4) });
    const rx = 1230, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('what follows from it', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['derived'], ep(t, 1.0, 1.4));
    const notes = [['a convex side sheds the finger in a lift. a shallow groove holds it, like a ball in a bowl.', C.ink], ['grooves stay shallow near the front, so the front cutouts can stay flat (#47).', C.ink2], ['shoulders rounded but defined, so the ring finger has a place to rest (#42).', C.ink2], ['the counterpoint: hand-tool research asks for smooth grips without finger holes, since one shape won\'t suit every hand, so wide and shallow beats deep.', C.mute]];
    let ny2 = wy + 130; notes.forEach(([s2, col], i) => { const r = text(s2, rx + 28, ny2, { role: 'label', color: col, t, t0: 1.8 + i * 0.8, cps: 90, maxW: rw - 56, lh: 1.42 }); ny2 += Math.max(r.h, 22) + 20; });
    gloss(t, 2.6, 'normal force', 'a surface can only push straight out of itself. tilt the surface and part of that push turns sideways, toward or away from the middle.');
    featureCard(t, 4.6, 'curves checked by their forces', ['derived', 'proposal'], 'a Newtonian check on every surface the fingers rest on, shallow front grooves (#47), defined shoulders (#42).');
    captions(t, [[0.6, 'every surface the finger presses on pushes back at a right angle to itself. that push decides where the finger ends up.'], [3.4, 'on a convex curve, part of it points outward, so in a fast lift the finger slides off. in a shallow groove it points to the middle and the finger settles.']]);
  }
});
S({
  id: 'size', ch: 'shape', theme: 'paper', title: 'sized against real hands', settle: 9, ideas: ['size', 40, 38, 39, 43], src: ['ansur', 'elo', 'tpuGpx2front', 'mzl', 'coelho'],
  draw: t => {
    header(t, 'sized against real hands');
    const wx = LM, wy = 272, ww = 1060, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('mouse length as a share of the average male hand (193.7 mm, ANSUR II)', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(wx, wy, ww, ['derived'], ep(t, 1.0, 1.4));
    const m = axes(t, { x: wx + 80, y: wy + 120, w: ww - 140, h: 230, xr: [112, 130], yr: [0, 1], xticks: [112, 115, 118, 121, 124, 127, 130], yticks: [], xfmt: v => v + ' mm', xlabel: 'length', t0: 1.0 });
    const band = ep(t, 3.2, 3.8); rect(m.X(120.0), wy + 120, (m.X(122.5) - m.X(120.0)) * band, 230, { fill: rgba(A, 0.18) });
    if (band > 0.5) text('target: 2 to 4% under the benchmarks', m.X(121.25), wy + 140, { role: 'label', color: A, align: 'center' });
    const mice = [['G Pro X Superlight 2', 125.0, C.ink, 0.72], ['Viper V3 Pro', 127.1, C.ink, 0.52], ['UltralightX M', 121.3, C.gray, 0.34], ['60% rule (a heuristic)', 116.2, C.mute, 0.6]];
    mice.forEach(([l, v, col, h], i) => { const k = ep(t, 1.6 + i * 0.3, 2.0 + i * 0.3, E.snap), x = m.X(v), y1 = m.Y(0), y0 = m.Y(h); line(x, y1, x, lerp(y1, y0, k), { color: col, w: 3, dash: i === 3 ? [6, 5] : null }); circle(x, y0, 6, { fill: col, alpha: k }); text(l, x + 10, y0 - 4, { role: 'label', size: 20, color: col, alpha: k }); text((v / 193.7 * 100).toFixed(1) + '%', x + 10, y0 + 20, { role: 'num', size: 21, color: C.mute, alpha: k }); });
    rule(wx + 28, wy + 430, wx + ww - 28, ep(t, 4.0, 4.4));
    text('front height (#40): G Pro X Superlight 2 12 mm, Xtrfy MZ1 11 mm. a lower front puts the fingers closer to the pad and lets a small mouse fit a big hand.', wx + 28, wy + 470, { role: 'label', color: C.ink, t, t0: 4.2, cps: 90, maxW: ww - 56, lh: 1.45 });
    const rx = 1190, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('the shape rules, in words', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['proposal'], ep(t, 1.0, 1.4));
    const notes = [['#38', 'a straighter, pointier front'], ['#39', 'less front flare, sides straight from above'], ['#43', 'the hump a touch wider, the grip width thinner underneath'], ['brainstorm', 'sides tapered on their own, semi-symmetric, like the MZ1']];
    notes.forEach(([n, s2], i) => { const y = wy + 140 + i * 74, k = ep(t, 1.6 + i * 0.3, 2.0 + i * 0.3); text(n, rx + 28, y, { role: 'label', color: A, alpha: k }); text(s2, rx + 28, y + 24, { role: 'label', color: C.ink2, alpha: k, maxW: rw - 56, lh: 1.35 }); });
    text('hand size changed muscle activity more than mouse geometry did (Coelho 2021), so the size is the first decision.', rx + 28, wy + 470, { role: 'small', color: C.mute, t, t0: 4.6, cps: 100, maxW: rw - 56, lh: 1.45 });
    gloss(t, 2.8, 'ANSUR II', 'the US Army\'s anthropometric survey: thousands of measured bodies, including hand length and breadth.');
    featureCard(t, 5.4, 'sized to the hand', ['derived', 'proposal'], '2 to 4% smaller than the popular benchmarks, a lower front (#40), and the shape rules (#38, #39, #43).');
    captions(t, [[0.6, 'the popular flagships run between 62 and 66% of the average male hand. the target sits just under them.'], [4.2, 'and since the outline will change, what stays fixed are the rules: a lower front, less flare, a straighter nose.']]);
  }
});
S({
  id: 'emg', ch: 'shape', theme: 'night', title: 'measure the strain, then the shape', settle: 9, ideas: [45], src: ['wang23', 'liwang', 'tang23'],
  draw: t => {
    header(t, 'measure the strain, then the shape');
    const wx = LM, wy = 272, ww = 1000, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    text('surface EMG, two forearm muscles, a flick task', wx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    text('signal illustrative', wx + ww - 28, wy + 44, { role: 'small', color: C.faint, align: 'right', alpha: ep(t, 1.0, 1.4) });
    const traces = [['extensor digitorum', C.red, 1.0], ['extensor carpi radialis', A, 0.7]];
    traces.forEach(([l, col, amp], i) => {
      const y0 = wy + 150 + i * 150, x0 = wx + 230, x1 = wx + ww - 40, k = ep(t, 1.0 + i * 0.3, 1.4 + i * 0.3);
      text(l, wx + 28, y0 + 6, { role: 'label', color: col, alpha: k });
      G.save(); G.globalAlpha = k; G.beginPath(); G.strokeStyle = col; G.lineWidth = 1.5;
      for (let x = x0; x <= x1; x += 1.5) { const u = (x - x0) / (x1 - x0), tt = u * 6 + t * 0.8, burst = Math.pow(Math.max(0, Math.sin(tt * 2.1)), 6), n = Math.sin(x * 12.9898 + Math.floor(t * 30) * 0.7) * 43758.5453 % 1, v = (0.15 + burst) * amp * n * 46; x === x0 ? G.moveTo(x, y0 + v) : G.lineTo(x, y0 + v); }
      G.stroke(); G.restore();
    });
    rule(wx + 28, wy + 400, wx + ww - 28, ep(t, 2.6, 3.0));
    text('in pro Overwatch players, those two muscles carried over 5% of their maximum force the whole time they played. 6 of the 10 muscles measured sat above 2% (Wang 2023, n = 16).', wx + 28, wy + 440, { role: 'label', color: C.ink, t, t0: 2.8, cps: 90, maxW: ww - 56, lh: 1.45 });
    const rx = 1130, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('a test that can actually rank shapes', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['study'], ep(t, 1.0, 1.4));
    const steps = [['16 players or more', 'split by hand size and grip, since medium hands are the most sensitive to shape'], ['EMG on the forearm', 'static load and fatigue across a session'], ['aim: Fitts throughput', 'bits per second on a fixed task, about 6.9 for pros'], ['a comfort rating', 'because EMG alone missed 5 mm hump changes that comfort scores caught (Li & Wang 2025, n = 10)']];
    steps.forEach(([a, b], i) => { const y = wy + 120 + i * 98, k = ep(t, 1.6 + i * 0.4, 2.0 + i * 0.4); rr(rx + 28, y, rw - 56, 80, 10, inkA(0.05), inkA(0.15), 1.2, k); text(a, rx + 46, y + 28, { role: 'label', color: A, alpha: k }); text(b, rx + 46, y + 52, { role: 'small', color: C.ink2, alpha: k, maxW: rw - 92, lh: 1.3 }); });
    gloss(t, 2.4, 'EMG', 'electromyography: electrodes on the skin read the electrical activity of the muscle underneath. the doc said EKG, which reads the heart.');
    featureCard(t, 4.6, 'EMG on every iteration', ['study', 'proposal'], 'muscle strain measured on each shape revision (#45), with comfort and aim scored alongside it.');
    captions(t, [[0.6, 'the forearm extensors work the hardest when you aim, and they do it without a break.'], [3.0, 'so every shape revision gets measured on real players, with enough of them to see a difference, and with comfort and aim scored next to the EMG.']]);
  }
});

