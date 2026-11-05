/* ============================================================================================
   idea sheet: electronics, two more (#99, #89). The last slide of the chapter.
   (#25, pairing through the receiver, left with the receiver slides: Brock, F2.42.)
   Sources are in 10-f-elec.js and 05-data.js (logiRgb, logiSuperstrike).
   ============================================================================================ */
ideaSheet({
  id: 'elc_sheet2', ch: 'elec', theme: 'night', title: 'No RGB LED, optional haptics', src: ['logiRgb', 'logiSuperstrike', 'elcBrock'],
  panels: [
    {
      n: 99, ev: ['claim', 'derived', 'proposal'], title: 'No RGB LED on the mouse',
      body: 'On Logitech\'s G703, RGB cycling cuts battery life from 30 h to 22 h, 27% of it. Theseus has no LED at all: its battery and settings show in the web software.',
      draw: (lt, x, y, w, h, A, a) => {
        const ph = cyc(lt, 0, 6), led = 1 - ep(ph, 0.25, 0.45), pix = ep(ph, 0.45, 0.6) * (1 - ep(ph, 0.92, 1));
        const mx = x + 110, my = y + 150;
        part(mx, my, 1.45, () => keyPlanMM({ hi: [] }), { alpha: a });
        const lp = [mx, my + 30 * 1.45];
        if (led > 0.01) { warm(lp[0], lp[1], 46, '#ff3cac', 0.55 * led * a); warm(lp[0], lp[1], 26, '#3cc8ff', 0.5 * led * a); circle(lp[0], lp[1], 6, { fill: '#ffffff', alpha: led * a }); }
        dLabel(led > 0.5 ? 'RGB LED' : 'No LED', mx, y + 290, { align: 'center', color: led > 0.5 ? C.ink2 : C.heroText, weight: 800, alpha: a });
        /* the status moves to the web software: a small browser window */
        const sx = x + 300, sy = y + 40, sw = 270, sh = 100;
        G.save(); G.globalAlpha = a; rrPath(sx, sy, sw, sh, 8); G.fillStyle = TH ? '#ffffff' : '#18191c'; G.fill(); G.strokeStyle = inkA(0.25); G.lineWidth = 1.5; G.stroke(); G.restore();
        rr(sx, sy, sw, 24, 8, inkA(0.06), null, 1, a);
        for (let i = 0; i < 3; i++) circle(sx + 14 + i * 13, sy + 12, 4, { fill: inkA(0.3), alpha: a });
        text('Battery', sx + 18, sy + 62, { role: 'label', size: 20, color: C.mute, alpha: a });
        text('73%', sx + 18, sy + 90, { font: 'mono', size: 24, weight: 800, color: C.ink, alpha: a * Math.max(0.3, pix) });
        rr(sx + 110, sy + 70, 130, 18, 9, C.track, null, 1, a); rr(sx + 110, sy + 70, 130 * 0.73 * Math.max(0.3, pix), 18, 9, A, null, 1, a);
        dLabel('In the web software', sx + sw / 2, sy + sh + 28, { align: 'center', color: C.ink2, alpha: a });
        if (pix > 0.05) arrow(mx + 64, my - 40, sx - 12, sy + sh / 2, { color: A, w: 2.5, hs: 10, alpha: a * pix });
        /* what the LED costs */
        const bx = x + 460, bw = w - 500, b0 = y + 236, X = v => bx + bw * v / 32;
        dLabel('Logitech G703, 1 ms, hours', x + 308, b0 - 44, { color: C.mute, alpha: a });
        [['Lighting off', 30, C.comp], ['RGB cycling', 22, C.bad]].forEach(([l, v, col], i) => { const yy = b0 + i * 36; dLabel(l, bx - 14, yy + 8, { align: 'right', color: C.ink2, alpha: a }); rect(bx, yy - 9, X(v) - bx, 18, { fill: col, alpha: a }); text(v + ' h', X(v) + 10, yy + 8, { font: 'mono', size: 22, weight: 700, color: C.ink, alpha: a }); });
      }
    },
    {
      n: 89, ev: ['claim', 'proposal'], title: 'Haptics, as an option',
      body: 'Bass in the fingertips, as console controllers have. Logitech\'s Superstrike already clicks with haptics at 61 g; here it would be a separate module, so the ' + THS.massG + ' mouse carries none of it.',
      note: 'Unverified: no module weight or battery cost yet.',
      draw: (lt, x, y, w, h, A, a) => {
        const ph = cyc(lt, 0, 6), ins = ep(ph, 0.05, 0.3, E.out3), buzz = ph > 0.32 ? Math.exp(-((ph - 0.32) % 0.22) * 18) : 0;
        /* a slot in the base, and the module sliding in */
        const sx = x + 80, sy = y + 70, slotW = 170;
        G.save(); G.globalAlpha = a; G.setLineDash([6, 4]); G.strokeStyle = inkA(0.5); G.lineWidth = 1.5; G.strokeRect(sx, sy, slotW, 100); G.restore();
        dLabel('Optional bay', sx, sy - 14, { color: C.mute, alpha: a });
        const px = lerp(sx + slotW + 200, sx + slotW / 2, ins), py = sy + 50 + Math.sin(lt * 90) * 3 * buzz;
        circle(px, py, 36, { fill: TH ? '#cfcdc7' : '#3a3b41', alpha: a }); circle(px, py, 36, { color: inkA(0.5), w: 1.5, alpha: a }); circle(px, py, 19, { color: inkA(0.45), w: 1.5, alpha: a }); circle(px, py, 5, { fill: A, alpha: a });
        dLabel('Haptic module', px, py + 62, { align: 'center', color: C.ink2, weight: 800, alpha: a });
        for (let i = 0; i < 3; i++) if (buzz > 0.05) circle(px, py, 42 + i * 12, { color: A, w: 2, alpha: a * buzz * (0.8 - i * 0.25), a0: -0.7, a1: 0.7 });
        /* the signal: low notes only */
        const gx = x + 30, gy = y + 262, gw = w - 60;
        line(gx, gy, gx + gw, gy, { color: C.faint, w: 1.2, alpha: a });
        const pts = []; for (let u = 0; u <= 1; u += 0.003) { const tt = u * 1.2, env2 = Math.exp(-((tt * 3) % 0.6) * 5); pts.push([gx + u * gw, gy - Math.sin(tt * TAU * 9) * 34 * env2]); }
        poly(pts, { color: A, w: 2.5, alpha: a, p: clamp((ph - 0.3) / 0.4) });
        dLabel('Bass only', gx + gw, gy + 34, { align: 'right', color: C.ink2, alpha: a });
      }
    }
  ],
  captions: [[0.6, 'Two last ones: the LED that costs a quarter of the battery, and haptics that stay optional so the mouse carries none of their weight.']]
});
