/* ============================== ownership ============================== */
S({
  id: 'owncard', ch: 'own', card: true, theme: 'night', title: 'ownership', settle: 5,
  draw: t => {
    chapterCard(t, { name: 'ownership', gloss: 'opening it, fixing it, unboxing it, and the number on it that is yours.', list: [['#9', 'one screw type, any driver'], ['#73', 'the right driver in the box'], ['#71', 'a battery you can swap'], ['#51', 'wires instead of ribbon cables'], ['#31', 'a modular bottom plate'], ['#72', 'an envelope and a trifold'], ['#36', 'your serial on the right click']] });
    const turn = t < 2 ? 0 : (t - 2) * 0.7 + 0.25 * Math.sin((t - 2) * 2.2), ko = ep(t, 1.0, 1.6);
    part(1500, 600, 56, () => screwHeadMM(), { alpha: ko, rot: turn });
    if (t > 2) { const a3 = ep(t, 2.0, 2.5), ang = turn % TAU; G.save(); G.globalAlpha = a3 * 0.8; G.strokeStyle = acc(); G.lineWidth = 3; G.beginPath(); G.arc(1500, 600, 190, ang - 0.9, ang + 0.2); G.stroke(); const ex2 = 1500 + Math.cos(ang + 0.2) * 190, ey2 = 600 + Math.sin(ang + 0.2) * 190, tx = -Math.sin(ang + 0.2), ty2 = Math.cos(ang + 0.2); G.fillStyle = acc(); G.beginPath(); G.moveTo(ex2 + tx * 14, ey2 + ty2 * 14); G.lineTo(ex2 - ty2 * 8, ey2 + tx * 8); G.lineTo(ex2 + ty2 * 8, ey2 - tx * 8); G.closePath(); G.fill(); G.restore(); }
    figLabel(t, 2.0, 1130, 920, 14, 'An M2 screw head');
  }
});
S({
  id: 'repair', ch: 'own', theme: 'paper', title: 'made to be opened', settle: 9, ideas: [9, 73, 71, 51, 69, 31, 100, 54], src: ['ikea', 'ifixit', 'dfma', 'gremlin'],
  draw: t => {
    header(t, 'made to be opened');
    const wx = LM, wy = 272, ww = 860, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    part(wx + 240, wy + 330, 30, () => insertMM({ k: t < 3.4 ? ep(t, 0.8, 2.2, E.io3) : 1 - 0.7 * pingpong(t - 3.4, 6) }), { alpha: ep(t, 0.4, 0.9) });
    part(wx + 620, wy + 200, 48, () => screwHeadMM(), { alpha: ep(t, 0.8, 1.2) });
    text('Machine screw into brass (#9, #101)', wx + 70, wy + 480, { role: 'label', size: 20, color: A, alpha: ep(t, 1.4, 1.8) });
    text('Opens and closes without wearing the plastic', wx + 70, wy + 514, { role: 'small', size: 22, color: C.mute, alpha: ep(t, 1.6, 2.0) });
    text('cross and slot', wx + 620, wy + 330, { role: 'label', color: A, align: 'center', alpha: ep(t, 1.4, 1.8) });
    text('The driver in the box matches it (#73)', wx + 620, wy + 372, { role: 'small', size: 22, color: C.mute, align: 'center', maxW: 300, alpha: ep(t, 1.6, 2.0) });
    const rx = 990, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('why it\'s worth designing for', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    const bars = [['IKEA effect: what builders would pay for what they built', 63, '+63%', A, 'study'], ['would buy the brand again after a successful repair', 95, '95%', C.ink, 'survey'], ['say repairability matters when they buy', 93, '93%', C.ink, 'survey']];
    bars.forEach(([l, v, lab, col, ev], i) => { const y = wy + 120 + i * 88, k = ep(t, 1.4 + i * 0.3, 2.2 + i * 0.3, E.snap); text(l, rx + 28, y, { role: 'label', color: C.ink2, alpha: ep(t, 1.2 + i * 0.3, 1.6 + i * 0.3), maxW: rw - 160 }); rect(rx + 28, y + 16, (rw - 190) * v / 100 * k, 18, { fill: col }); text(lab, rx + 28 + (rw - 190) * v / 100 * k + 10, y + 31, { role: 'label', color: col, alpha: k }); });
    text('the IKEA effect only holds when the job succeeds, so the mod has to be hard to fail: wires instead of ribbon cables that tear (#51, #69), the battery plug turned sideways (#71), ON and OFF printed on the switch (#100).', rx + 28, wy + 400, { role: 'label', color: C.ink, t, t0: 3.4, cps: 100, maxW: rw - 56, lh: 1.45 });
    text('iFixit\'s sample is self-selected: people who already repair.', rx + 28, wy + 536, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 4.4, 4.8), maxW: rw - 56 });
    gloss(t, 2.6, 'IKEA effect', 'people value things they built themselves more than the same thing built for them. it disappears if the build fails.');
    featureCard(t, 5.2, 'built to come apart', ['study', 'survey', 'proposal'], 'one screw type (#9), the driver included (#73), a modular bottom plate (#31), the board mounted to the top shell with screws from below (#54).');
    captions(t, [[0.6, 'a mouse you can open is a mouse you can keep. the cost is in the details: screws, connectors, and what tears when the shell comes off.'], [3.6, 'people value what they fixed themselves, but only when the fix works. so everything inside is chosen so the first repair goes right.']]);
  }
});
S({
  id: 'box', ch: 'own', theme: 'night', title: 'the box is the first thing they open', settle: 9, ideas: [72, 74, 13, 62, 63], src: ['knight', 'dotcom', 'gmk'],
  draw: t => {
    header(t, 'the box is the first thing they open');
    const wx = LM, wy = 272, ww = 860, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    /* an envelope opens, the trifold slides out, and unfolds into a standing display */
    const k = ep(t, 0.6, 1.2), flap = ep(t, 1.2, 2.0, E.io3), lift = ep(t, 2.0, 2.9, E.cam), open = ep(t, 2.9, 4.2, E.io3);
    const cx = wx + ww / 2, ey = wy + 400, ew = 560, eh = 150, pw = 176, ph = 236, ty0 = ey - ph / 2 + 30 - lift * 236;
    const paperC = TH ? '#ffffff' : '#1f2024', ink3 = inkA(0.5), envC = TH ? '#e7e6e1' : '#2b2c31';
    /* the envelope's back */
    rr(cx - ew / 2, ey - eh / 2, ew, eh, 8, envC, inkA(0.25), 1.5, k);
    /* the trifold: three panels on two hinges; the outer two swing open in perspective */
    const face = (x0, x1, yc, hh, fill, draw) => { G.save(); G.globalAlpha = k; G.beginPath(); G.moveTo(x0[0], yc - x0[1] / 2); G.lineTo(x1[0], yc - x1[1] / 2); G.lineTo(x1[0], yc + x1[1] / 2); G.lineTo(x0[0], yc + x0[1] / 2); G.closePath(); G.fillStyle = fill; G.fill(); G.strokeStyle = inkA(0.3); G.lineWidth = 1.5; G.stroke(); G.clip(); if (draw) draw(); G.restore(); };
    const yc = ty0 + ph / 2, sw = open, outerH = ph * (1 - 0.16 * (1 - sw));
    const flapPath = fy => { G.beginPath(); G.moveTo(cx - ew / 2, ey - eh / 2); G.lineTo(cx, fy); G.lineTo(cx + ew / 2, ey - eh / 2); G.closePath(); };
    const fyy = lerp(ey + 24, ey - eh / 2 - 96, flap);
    if (flap >= 0.5) { G.save(); G.globalAlpha = k; flapPath(fyy); G.fillStyle = TH ? '#d9d8d3' : '#25262a'; G.fill(); G.strokeStyle = inkA(0.25); G.lineWidth = 1.5; G.stroke(); G.restore(); }
    G.save(); if (lift < 1) { G.beginPath(); G.rect(wx, wy, ww, ey + eh / 2 - 4 - wy); G.clip(); }
    const ca = clamp((open - 0.75) / 0.25);
    face([cx - pw / 2, ph], [cx + pw / 2, ph], yc, ph, paperC, () => {
      text('the mouse', cx, yc - 74, { role: 'label', color: A, align: 'center', alpha: k });
      rr(cx - 52, yc - 50, 104, 120, 30, inkA(0.06), inkA(0.25), 1.2, k);
      text('in its tray', cx, yc + 14, { role: 'small', color: C.mute, align: 'center', alpha: k });
      for (let i = 0; i < 4; i++) circle(cx - 36 + i * 24, yc + 96, 6, { fill: TH ? '#ffffff' : '#e7e6e1', color: inkA(0.3), w: 1, alpha: k });
      text('spare dots', cx, yc + 116, { role: 'small', color: C.mute, align: 'center', alpha: k });
    });
    if (sw > 0.01) {
      face([cx - pw / 2, ph], [cx - pw / 2 - pw * sw, outerH], yc, ph, paperC, ca > 0 ? () => {
        const lx = cx - pw / 2 - pw * 0.5; G.globalAlpha = k * ca;
        text('setup', lx, yc - 84, { role: 'label', color: A, align: 'center', alpha: k * ca });
        const qr = rng(42); for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) { const fin = (i < 3 && j < 3) || (i > 5 && j < 3) || (i < 3 && j > 5); if (fin ? !((i % 6 === 1 || i === 1) && (j % 6 === 1 || j === 1)) : qr() < 0.5) rect(lx - 36 + i * 8, yc - 66 + j * 8, 7, 7, { fill: C.ink, alpha: k * ca }); }
        ['1  plug both in', '2  open the web app', '3  done'].forEach((l2, i) => text(l2, lx - 66, yc + 30 + i * 22, { role: 'label', color: C.ink2, alpha: k * ca }));
      } : null);
      face([cx + pw / 2, ph], [cx + pw / 2 + pw * sw, outerH], yc, ph, paperC, ca > 0 ? () => {
        const rx2 = cx + pw / 2 + pw * 0.5;
        text('inside', rx2, yc - 84, { role: 'label', color: A, align: 'center', alpha: k * ca });
        for (let i = 0; i < 6; i++) { const sx = rx2 - 44 + (i % 3) * 44, sy = yc - 44 + Math.floor(i / 3) * 52; part(sx, sy, 5.2, () => screwHeadMM(), { alpha: k * ca }); text(String(i + 1), sx + 14, sy - 10, { role: 'label', color: A, alpha: k * ca }); }
        ['M2 × 6, one driver', 'Battery: slide, lift', 'Rim: slides off'].forEach((l2, i) => text(l2, rx2 - 66, yc + 62 + i * 24, { role: 'label', size: 19, color: C.ink2, alpha: k * ca }));
      } : null);
    }
    G.restore();
    /* the envelope's front and its flap, drawn over the trifold until it has slid out */
    G.save(); G.globalAlpha = k;
    G.beginPath(); G.moveTo(cx - ew / 2, ey - eh / 2 + 10); G.lineTo(cx, ey + 16); G.lineTo(cx + ew / 2, ey - eh / 2 + 10); G.lineTo(cx + ew / 2, ey + eh / 2 - 8); G.quadraticCurveTo(cx + ew / 2, ey + eh / 2, cx + ew / 2 - 8, ey + eh / 2); G.lineTo(cx - ew / 2 + 8, ey + eh / 2); G.quadraticCurveTo(cx - ew / 2, ey + eh / 2, cx - ew / 2, ey + eh / 2 - 8); G.closePath();
    G.fillStyle = envC; G.fill(); G.strokeStyle = inkA(0.25); G.lineWidth = 1.5; G.stroke();
    if (flap < 0.5) { flapPath(fyy); G.fillStyle = TH ? '#efeeea' : '#323338'; G.fill(); G.stroke(); }
    G.restore();
    text('paper only: no plastic tray, no foam', cx, ey + eh / 2 + 30, { role: 'label', color: C.mute, align: 'center', alpha: ep(t, 4.4, 4.8) });
    text('an envelope, and a trifold that is the display and the manual (#72)', wx + 28, wy + wh - 24, { role: 'label', color: C.ink2, alpha: ep(t, 2.6, 3.0) });
    const rx = 990, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('a workspace you arranged yourself', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['study'], ep(t, 1.0, 1.4)); text('Knight & Haslam 2010, 2,000+ office workers', rx + 28, wy + 86, { role: 'small', size: 22, maxW: rw - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const bars = [['lean office', 0, C.gray], ['decorated for you', 17, C.ink], ['decorated by you', 32, A]];
    bars.forEach(([l, v, col], i) => { const y = wy + 130 + i * 60, kk = ep(t, 1.4 + i * 0.3, 2.2 + i * 0.3, E.snap); text(l, rx + 28, y + 6, { role: 'label', color: C.ink2, alpha: kk }); rect(rx + 250, y - 9, Math.max(3, (rw - 380) * v / 35) * kk, 18, { fill: col }); text(v ? '+' + v + '%' : 'Baseline', rx + 250 + (rw - 380) * v / 35 * kk + 10, y + 8, { role: 'num', size: 22, color: col, alpha: kk }); });
    text('choosing your setup mattered more than decoration. colorways matched to GMK keycap sets (#13) let people build the desk they want; those sets run about $200.', rx + 28, wy + 340, { role: 'label', color: C.ink, t, t0: 3.2, cps: 100, maxW: rw - 56, lh: 1.45 });
    text('packaging survey (a vendor\'s, sample not given): 52% likelier to buy again with premium packaging, 60% care that it\'s sustainable. paper, not a plastic tray.', rx + 28, wy + 450, { role: 'small', color: C.mute, t, t0: 4.4, cps: 110, maxW: rw - 56, lh: 1.45 });
    gloss(t, 2.8, 'trifold', 'a card folded in three. closed it holds the mouse in place; opened it stands up as a display, with the setup and repair steps printed inside.');
    featureCard(t, 5.4, 'packaging that keeps', ['study', 'survey', 'proposal'], 'envelope and trifold (#72), a thin custom battery cover (#74), GMK-matched colorways (#13), LT and RT legends (#62), art on the PCB (#63).');
    captions(t, [[0.6, 'the first thing anyone touches is the box, so it should be as considered as the mouse.'], [3.4, 'and the best-supported finding on desks is about choice: people did better in a space they arranged themselves.']]);
  }
});
S({
  id: 'serial', ch: 'own', theme: 'paper', title: 'a number that\'s yours', settle: 9, ideas: [36], src: ['scarcity', 'ladeira', 'ulxComp'],
  draw: t => {
    header(t, 'a number that\'s yours');
    const wx = LM, wy = 272, ww = 860, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    /* the right click, a patch of it from above, with the serial lasered in */
    const k = ep(t, 0.5, 1.0), px = wx + 120, py = wy + 70, pw2 = 620, ph2 = 260;
    part(0, 0, 1, () => { solid(() => pathRR(px, py, pw2, ph2, 24), { g: ['#3b3c42', '#2a2b30'], dark: 1 }, [px, py, pw2, ph2], { lw: 1.4 }); G.save(); pathRR(px, py, pw2, ph2, 24); G.clip(); const r = rng(9); G.fillStyle = 'rgba(255,255,255,0.035)'; for (let i = 0; i < 2600; i++) G.fillRect(px + r() * pw2, py + r() * ph2, 1.4, 1.4); G.restore(); }, { alpha: k });
    /* after the first one, the next units come off the line: the last number clears and the laser writes the next */
    const lc = t >= 9 ? (t - 9) % 6 : -1, idx = lc >= 0 ? Math.floor((t - 9) / 6) + 1 : 0, sn = i => String(42 + (i % 9)).padStart(3, '0');
    const engr = lc >= 0 ? ep(lc, 0.7, 2.1, E.lin) : ep(t, 1.2, 2.6, E.lin), num = sn(idx);
    G.save(); G.globalAlpha = k; setFont({ size: 150, weight: 800 }); G.textAlign = 'center';
    const glyph = (s2, a2) => { G.save(); G.globalAlpha = k * a2; G.fillStyle = 'rgba(236,235,231,0.16)'; G.fillText(s2, px + pw2 / 2, py + 190); G.fillStyle = 'rgba(0,0,0,0.25)'; G.fillText(s2, px + pw2 / 2 + 2, py + 192); G.fillStyle = 'rgba(236,235,231,0.10)'; G.fillText(s2, px + pw2 / 2, py + 190); G.restore(); };
    if (lc >= 0 && lc < 0.6) glyph(sn(idx - 1), 1 - ep(lc, 0, 0.55));
    G.save(); G.beginPath(); G.rect(px, py, pw2 * engr + 1, ph2); G.clip(); glyph(num, 1); G.restore();
    if (lc >= 0) text('unit ' + num, px + pw2 - 24, py + 40, { role: 'label', color: 'rgba(236,235,231,0.55)', align: 'right', alpha: k * ep(lc, 2.0, 2.4) * (1 - ep(lc, 5.4, 5.9)) });
    if (engr > 0 && engr < 1) { const lx = px + pw2 * engr, ly = py + 128 + 52 * Math.sin(t * 38); warm(lx, ly, 46, '#ffffff', 0.35); warm(lx, ly, 18, A, 0.9); line(lx, py, lx, py + ph2, { color: A, w: 1.5, alpha: 0.5 }); const rs = rng(Math.floor(t * 30)); for (let i = 0; i < 7; i++) { const ang = -Math.PI / 2 + (rs() - 0.5) * 2.2, d = 6 + rs() * 26; circle(lx + Math.cos(ang) * d, ly + Math.sin(ang) * d, 1.6, { fill: '#ffe7b0', alpha: 0.8 * (1 - d / 34) }); } }
    G.restore();
    text('Illustration: lasered under the clear coat, so it can\'t be felt', wx + 28, wy + wh - 24, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 2.6, 3.0), maxW: ww - 56 });
    /* the section: engraving filled flush by the clear coat */
    part(wx + 230, wy + 430, 22, () => { solid(() => { G.beginPath(); G.moveTo(0, 0); G.lineTo(7, 0); G.lineTo(7.4, 0.6); G.lineTo(9.6, 0.6); G.lineTo(10, 0); G.lineTo(18, 0); G.lineTo(18, 1.6); G.lineTo(0, 1.6); G.closePath(); }, MT.shell, [0, 0, 18, 1.6], { hatch: true }); G.beginPath(); G.moveTo(0, 0); G.lineTo(7, 0); G.lineTo(7.4, 0.6); G.lineTo(9.6, 0.6); G.lineTo(10, 0); G.lineTo(18, 0); G.lineTo(18, -0.35); G.lineTo(0, -0.35); G.closePath(); G.fillStyle = 'rgba(200,215,232,0.45)'; G.fill(); G.strokeStyle = inkA(0.5); G.lineWidth = lw(1); G.stroke(); }, { alpha: ep(t, 3.0, 3.4) });
    text('clear coat fills the engraving flush', wx + 640, wy + 440, { role: 'label', color: A, alpha: ep(t, 3.2, 3.6), maxW: 200 });
    const rx = 990, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('scarcity and wanting it, meta-analyses', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['study'], ep(t, 1.0, 1.4)); text('effect size on purchase intention', rx + 28, wy + 86, { role: 'small', size: 22, maxW: rw - 56, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const bars = [['all scarcity cues, 131 studies', 0.31, C.ink], ['limited supply, for things you enjoy', 0.55, A], ['scarce because others bought it', 0.17, C.gray], ['with a visible social signal', 0.46, A]];
    bars.forEach(([l, v, col], i) => { const y = wy + 130 + i * 70, kk = ep(t, 1.4 + i * 0.25, 2.2 + i * 0.25, E.snap); text(l, rx + 28, y, { role: 'label', color: C.ink2, alpha: ep(t, 1.2 + i * 0.25, 1.6 + i * 0.25), maxW: rw - 56 }); rect(rx + 28, y + 14, (rw - 180) * v / 0.6 * kk, 18, { fill: col }); glint(rx + 28, y + 14, (rw - 180) * v / 0.6 * kk, 18, t, 5 + i * 0.25, 8); text('d = ' + v.toFixed(2), rx + 28 + (rw - 180) * v / 0.6 * kk + 10, y + 29, { role: 'label', color: col, alpha: kk }); });
    text('a serial marks a numbered run, and it shows. the same research warns it backfires when it reads as hype, so the numbers are for owners, not for scalpers.', rx + 28, wy + 440, { role: 'label', color: C.ink, t, t0: 3.6, cps: 100, maxW: rw - 56, lh: 1.45 });
    keyPlan(t, 1.0, wx + ww - 80, wy + 140, { s: 0.5, hi: 'trigR', label: 'Right click' });
    gloss(t, 2.8, 'effect size', 'how big a difference is, in standard deviations. 0.2 is small, 0.5 is medium. a limited run for a product you enjoy lands around medium.');
    featureCard(t, 5.0, 'a lasered serial', ['study', 'proposal'], 'three digits, laser-engraved large on the right click (#36), sealed under the clear coat.');
    captions(t, [[0.6, 'a numbered run is a small thing that makes one mouse yours instead of one of many.'], [3.6, 'the research supports it for things people enjoy owning, as long as it stays honest.']]);
  }
});

