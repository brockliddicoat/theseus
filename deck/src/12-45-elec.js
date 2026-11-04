/* ============================================================================================
   idea sheet: electronics, three more (#25, #99, #89). The last slide of the chapter.
   Sources are in 10-f-elec.js and 05-data.js (wiz, logiRgb, logiSuperstrike).
   ============================================================================================ */
ideaSheet({
  id: 'elc_sheet2', ch: 'elec', theme: 'night', title: 'Three more from the electronics', src: ['wiz', 'logiRgb', 'logiSuperstrike', 'elcBrock'],
  panels: [
    {
      n: 25, ev: ['claim', 'proposal'], title: 'Pair by plugging both in',
      body: 'Plug the mouse and the receiver into the same PC and they pair over USB, the way a DualSense pairs with a PS5. One random key goes to both and is read back.',
      draw: (lt, x, y, w, h, A, a) => {
        const ph = cyc(lt, 0, 8), plug = ph < 0.1 ? E.out3(ph / 0.1) : ph < 0.62 ? 1 : ph < 0.72 ? 1 - E.io3((ph - 0.62) / 0.1) : 0;
        const px = x + w - 150, py = y + 70;
        G.save(); G.globalAlpha = a; rrPath(px, py, 120, 210, 10); G.fillStyle = TH ? '#e7e5df' : '#24252a'; G.fill(); G.strokeStyle = inkA(0.3); G.lineWidth = 1.5; G.stroke(); G.restore();
        dLabel('PC', px + 60, py + 196, { align: 'center', weight: 800, color: C.ink2, alpha: a });
        const port = [py + 60, py + 130];
        for (const yy of port) { G.save(); G.globalAlpha = a; rrPath(px + 14, yy - 8, 36, 16, 8); G.fillStyle = '#0b0c0e'; G.fill(); G.restore(); }
        G.save(); G.globalAlpha = a; rrPath(px - 46, port[1] - 14, 62, 28, 7); G.fillStyle = TH ? '#2b2c31' : '#3a3b41'; G.fill(); G.restore();
        dLabel('Receiver', px - 16, port[1] + 40, { align: 'center', color: C.ink2, alpha: a });
        const mx = x + 92, my = y + 190;
        part(mx, my, 1.35, () => keyPlanMM({ hi: [] }), { alpha: a, rot: Math.PI / 2 });
        dLabel('Mouse', mx, my + 62, { align: 'center', color: C.ink2, alpha: a });
        const plugX = lerp(px - 80, px + 14, plug), cyY = port[0];
        poly([[mx + 82, my], [mx + 140, my], [mx + 170, cyY], [plugX - 26, cyY]], { color: C.ink2, w: 5, alpha: a });
        G.save(); G.globalAlpha = a; rrPath(plugX - 28, cyY - 9, 34, 18, 5); G.fillStyle = C.ink2; G.fill(); G.restore();
        const kt = clamp((ph - 0.12) / 0.3), key = (kx, ky, kk) => { G.save(); G.globalAlpha = a * kk; G.strokeStyle = A; G.lineWidth = 3; G.beginPath(); G.arc(kx - 8, ky, 7, 0, TAU); G.stroke(); G.beginPath(); G.moveTo(kx - 1, ky); G.lineTo(kx + 16, ky); G.moveTo(kx + 10, ky); G.lineTo(kx + 10, ky + 7); G.moveTo(kx + 15, ky); G.lineTo(kx + 15, ky + 6); G.stroke(); G.restore(); };
        if (ph > 0.12 && ph < 0.44) { const path = [[mx + 82, my], [mx + 170, cyY], [px + 30, cyY], [px + 30, port[1]], [px - 20, port[1]]]; const seg = kt * (path.length - 1), i = Math.min(path.length - 2, Math.floor(seg)), f = seg - i; key(lerp(path[i][0], path[i + 1][0], f), lerp(path[i][1], path[i + 1][1], f) - 16, 1); }
        if (ph >= 0.42 && ph < 0.72) { const kk = ep(ph, 0.42, 0.46); dLabel('One key, written to both', x + 24, y + 34, { color: A, weight: 800, alpha: a * kk }); for (const [cx2, cy2] of [[mx, my - 70], [px - 16, port[1] - 34]]) { G.save(); G.globalAlpha = a * kk; G.strokeStyle = A; G.lineWidth = 3.5; G.beginPath(); G.moveTo(cx2 - 9, cy2); G.lineTo(cx2 - 2, cy2 + 7); G.lineTo(cx2 + 11, cy2 - 8); G.stroke(); G.restore(); } }
        if (ph >= 0.74) { const kk = ep(ph, 0.74, 0.78); dLabel('Unplugged: paired, on the radio', x + 24, y + 34, { color: A, weight: 800, alpha: a * kk }); for (let i = 0; i < 4; i++) { const p = ((ph - 0.74) * 6 + i / 4) % 1; circle(lerp(mx + 70, px - 50, p), lerp(my - 30, port[1] - 20, p), 4, { fill: A, alpha: a * kk }); } }
      }
    },
    {
      n: 99, ev: ['claim', 'derived', 'proposal'], title: 'No RGB LED on the mouse',
      body: 'On Logitech\'s G703, RGB cycling cuts battery life from 30 h to 22 h, 27% of it. Theseus has no LED at all; its status lives on the receiver\'s screen.',
      draw: (lt, x, y, w, h, A, a) => {
        const ph = cyc(lt, 0, 6), led = 1 - ep(ph, 0.25, 0.45), pix = ep(ph, 0.45, 0.6) * (1 - ep(ph, 0.92, 1));
        const mx = x + 92, my = y + 130;
        part(mx, my, 1.55, () => keyPlanMM({ hi: [] }), { alpha: a });
        const lp = [mx, my + 30 * 1.55];
        if (led > 0.01) { warm(lp[0], lp[1], 46, '#ff3cac', 0.55 * led * a); warm(lp[0], lp[1], 26, '#3cc8ff', 0.5 * led * a); circle(lp[0], lp[1], 6, { fill: '#ffffff', alpha: led * a }); }
        dLabel(led > 0.5 ? 'RGB LED' : 'No LED', mx, my + 130, { align: 'center', color: led > 0.5 ? C.ink2 : A, weight: 800, alpha: a });
        /* the status moves to the receiver's screen */
        const sx = x + w - 230, sy = y + 70;
        G.save(); G.globalAlpha = a; rrPath(sx, sy, 200, 92, 10); G.fillStyle = '#18191c'; G.fill(); rrPath(sx + 10, sy + 10, 180, 72, 5); G.fillStyle = '#050606'; G.fill(); G.restore();
        text('73%', sx + 26, sy + 58, { font: 'mono', size: 26, weight: 700, color: '#ebeae6', alpha: a * Math.max(0.25, pix) });
        rr(sx + 112, sy + 34, 52, 24, 3, null, '#ebeae6', 2, a * Math.max(0.25, pix)); rr(sx + 116, sy + 38, 32 * pix, 16, 2, '#ebeae6', null, 1, a);
        dLabel('Receiver screen', sx + 100, sy + 122, { align: 'center', color: C.ink2, alpha: a });
        if (pix > 0.05) arrow(mx + 70, my - 10, sx - 14, sy + 46, { color: A, w: 2.5, hs: 10, alpha: a * pix });
        /* what the LED costs */
        const bx = x + 200, bw = w - 240, b0 = y + 246, X = v => bx + bw * v / 32;
        [['Lighting off', 30, C.comp], ['RGB cycling', 22, C.red]].forEach(([l, v, col], i) => { const yy = b0 + i * 34; dLabel(l, bx - 12, yy + 8, { align: 'right', color: C.ink2, alpha: a }); rect(bx, yy - 9, X(v) - bx, 18, { fill: col, alpha: a }); text(v + ' h', X(v) + 8, yy + 8, { font: 'mono', size: 22, weight: 700, color: C.ink, alpha: a }); });
        dLabel('Logitech G703, 1 ms', bx - 12, b0 - 26, { align: 'right', color: C.mute, alpha: a });
      }
    },
    {
      n: 89, ev: ['claim', 'proposal'], title: 'Haptics, as an option',
      body: 'Bass in the fingertips, as console controllers have. Logitech\'s Superstrike already clicks with haptics at 61 g; here it would be a separate module, so the 29 g mouse carries none of it.',
      note: 'Unverified: no module mass or battery cost yet.',
      draw: (lt, x, y, w, h, A, a) => {
        const ph = cyc(lt, 0, 6), ins = ep(ph, 0.05, 0.3, E.out3), buzz = ph > 0.32 ? Math.exp(-((ph - 0.32) % 0.22) * 18) : 0;
        /* a slot in the base, and the module sliding in */
        const sx = x + 60, sy = y + 70, slotW = 150;
        G.save(); G.globalAlpha = a; G.setLineDash([6, 4]); G.strokeStyle = inkA(0.5); G.lineWidth = 1.5; G.strokeRect(sx, sy, slotW, 96); G.restore();
        dLabel('Optional bay', sx, sy - 12, { color: C.mute, alpha: a });
        const px = lerp(sx + slotW + 140, sx + slotW / 2, ins), py = sy + 48 + Math.sin(lt * 90) * 3 * buzz;
        circle(px, py, 34, { fill: TH ? '#cfcdc7' : '#3a3b41', alpha: a }); circle(px, py, 34, { color: inkA(0.5), w: 1.5, alpha: a }); circle(px, py, 18, { color: inkA(0.45), w: 1.5, alpha: a }); circle(px, py, 5, { fill: A, alpha: a });
        dLabel('Haptic module', px, py + 58, { align: 'center', color: C.ink2, weight: 800, alpha: a });
        for (let i = 0; i < 3; i++) if (buzz > 0.05) circle(px, py, 40 + i * 12, { color: A, w: 2, alpha: a * buzz * (0.8 - i * 0.25), a0: -0.7, a1: 0.7 });
        /* the signal: low notes only */
        const gx = x + 30, gy = y + 250, gw = w - 60;
        line(gx, gy, gx + gw, gy, { color: C.faint, w: 1.2, alpha: a });
        const pts = []; for (let u = 0; u <= 1; u += 0.004) { const tt = u * 1.2, env2 = Math.exp(-((tt * 3) % 0.6) * 5); pts.push([gx + u * gw, gy - Math.sin(tt * TAU * 9) * 34 * env2]); }
        poly(pts, { color: A, w: 2.5, alpha: a, p: clamp((ph - 0.3) / 0.4) });
        dLabel('Bass only', gx + gw, gy + 30, { align: 'right', color: C.ink2, alpha: a });
      }
    }
  ],
  captions: [[0.6, 'Three last ones: pairing without a button combination, the LED that costs a quarter of the battery, and haptics that stay optional.']]
});
