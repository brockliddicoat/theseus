/* ============================================================================================
   idea sheets: electronics
   ============================================================================================ */
Object.assign(SRC, {
  dsReflow: { t: 'ALLPCB: double-sided reflow; the second pass remelts the first side upside down, parts over about 5 g need adhesive', u: 'https://www.allpcb.com/allelectrohub/the-art-of-double-sided-reflow-preventing-component-fallout-in-second-pass-soldering' },
  antDetune: { t: 'Antenova: nearby metal (batteries, shields) absorbs or reflects RF and moves an antenna off its band', u: 'https://blog.antenova.com/designing-around-detuning-how-to-avoid-nearby-component-interference-in-crowded-pcbs' }
});

ideaSheet({
  id: 'elecsheet1', ch: 'elec', theme: 'paper', title: 'three electronics details', src: ['dsReflow', 'antDetune', 'wiz', 'kunai'],
  panels: [
    {
      n: 92, ev: ['derived', 'proposal'], title: 'parts on one side of the board',
      body: 'with every part on top, the board is printed, placed and reflowed once. a second side means a second oven pass, and the first side\'s joints melt again upside down, where parts over about 5 g may need glue.',
      draw: (lt, x, y, w, h, A, a) => {
        const ph = cyc(lt, 0, 7), cx = x + w / 2;
        /* top: one side, close up. paste is matte until the heat front passes, then it melts into bright fillets */
        dLabel('one side', x + 18, y + 28, { color: C.ink2, alpha: a }); dLabel('1 oven pass', x + w - 18, y + 28, { align: 'right', color: A, alpha: a, weight: 800 });
        const s = 9, by = y + 96, sweep = clamp(ph / 0.42), hx = x - 30 + 420 * E.io3(sweep), bx0 = x + 172;
        const parts = [[-14.5, 'res'], [-11, 'res'], [-3.5, 'qfn'], [4.6, 'xtal'], [9, 'cap'], [14, 'res']];
        G.save(); G.beginPath(); G.rect(x, y, 350, h); G.clip();
        part(bx0, by, s, () => { pcbSec(-18, 18, 0, 1.2, { brk: [1, 1] }); for (const [px, k] of parts) smdMM(px, k); }, { alpha: a });
        if (sweep > 0 && sweep < 1) { const g = G.createLinearGradient(hx - 50, 0, hx + 50, 0); g.addColorStop(0, rgba(C.orange, 0)); g.addColorStop(0.5, rgba(C.orange, 0.4)); g.addColorStop(1, rgba(C.orange, 0)); G.fillStyle = g; G.fillRect(hx - 50, by - 46, 100, 70); dLabel('reflow', hx, by - 52, { align: 'center', color: C.orange, weight: 800, alpha: a }); }
        G.restore();
        /* a magnified joint: the paste print melts into a bright fillet as the heat passes */
        const jx = bx0 + (14 + 0.5) * s, jy = by, ix = x + w - 86, iy = y + 92, R = 62, melt = ph > 0.42 ? 1 : clamp((hx - jx) / 36);
        line(jx + 3, jy - 2, ix - R * 0.72, iy + R * 0.3, { color: C.faint, w: 1.2, alpha: a }); circle(jx, jy - 1, 6, { color: C.faint, w: 1.2, alpha: a });
        G.save(); G.beginPath(); G.arc(ix, iy, R, 0, TAU); G.clip(); G.globalAlpha = a; G.fillStyle = TH ? '#f6f5f1' : '#1b1c20'; G.fillRect(ix - R, iy - R, 2 * R, 2 * R);
        part(ix + 6, iy + 22, 52, () => {
          solid(() => { G.beginPath(); G.rect(-2.2, 0, 4.4, 0.9); }, MT.fr4, [-2.2, 0, 4.4, 0.9], { hatch: true });
          solid(() => { G.beginPath(); G.rect(-0.9, -0.05, 1.5, 0.05); }, MT.copper, [-0.9, -0.05, 1.5, 0.05], { lw: 0.4 });
          solid(() => { G.beginPath(); G.moveTo(-2.4, -0.42); G.lineTo(-0.2, -0.42); G.lineTo(-0.2, -0.07); G.lineTo(-2.4, -0.07); brk(-2.4, -0.07, -0.42, 0.06); G.closePath(); }, MT.black, [-2.4, -0.42, 2.2, 0.35], { lw: 0.6 });
          solid(() => { G.beginPath(); G.rect(-0.62, -0.44, 0.42, 0.39); }, MT.tin, [-0.62, -0.44, 0.42, 0.39], { horiz: true, lw: 0.5 });
          if (melt < 1) { xsave(); ga(1 - melt); G.fillStyle = '#9fa3aa'; G.fillRect(-0.85, -0.17, 1.35, 0.12); const rg = rng(4); G.fillStyle = 'rgba(255,255,255,0.45)'; for (let q = 0; q < 26; q++) { G.beginPath(); G.arc(-0.83 + rg() * 1.3, -0.15 + rg() * 0.08, 0.018, 0, TAU); G.fill(); } xrest(); }
          if (melt > 0) { xsave(); ga(melt); G.beginPath(); G.moveTo(-0.2, -0.44 * melt); G.quadraticCurveTo(-0.12, -0.08, 0.55, -0.05); G.lineTo(-0.2, -0.05); G.closePath(); G.fillStyle = grad(MT.tin, -0.2, -0.45, 0.55, 0); G.fill(); G.strokeStyle = 'rgba(40,40,46,0.6)'; G.lineWidth = lw(0.6); G.stroke(); xrest(); }
        }, { alpha: a });
        G.restore();
        circle(ix, iy, R, { color: inkA(0.35), w: 1.5, alpha: a });
        dLabel(melt < 1 ? 'Paste' : 'Joint, reflowed', ix - 4, iy + R + 18, { align: 'center', color: melt < 1 ? C.mute : A, weight: 800, alpha: a });
        /* bottom: both sides. the board flips for side two and its first-side joints melt again, upside down */
        const by2 = y + 290, s2 = 6.2, flip = ph < 0.5 ? 0 : ph < 0.7 ? E.io3((ph - 0.5) / 0.2) : 1, sy = Math.cos(flip * Math.PI);
        dLabel('both sides', x + 18, y + 214, { color: C.ink2, alpha: a }); dLabel(flip > 0.5 ? '2 oven passes' : '1 oven pass', x + w - 18, y + 214, { align: 'right', color: flip > 0.5 ? C.red : C.mute, alpha: a, weight: 800 });
        const sweep2 = clamp((ph - 0.72) / 0.24), hx2 = x - 40 + (w + 80) * E.io3(sweep2), sag = flip >= 1 ? 0.9 * clamp((hx2 - (cx + 13 * s2)) / 120) : 0;
        G.save(); G.translate(0, by2); G.scale(1, sy); G.translate(0, -by2);
        part(cx, by2, s2, () => { pcbSec(-30, 30, 0, 1.2, {}); for (const [px, k] of [[-22, 'res'], [-14, 'qfn'], [-4, 'cap'], [4, 'res'], [22, 'res']]) smdMM(px, k); xsave(); xmove(0, -sag); smdMM(13, 'conn'); xrest(); for (const [px, k] of [[-18, 'res'], [-8, 'cap'], [6, 'res'], [24, 'cap']]) smdMM(px, k, { under: true }); }, { alpha: a });
        G.restore();
        if (sweep2 > 0 && sweep2 < 1) { const g = G.createLinearGradient(hx2 - 46, 0, hx2 + 46, 0); g.addColorStop(0, rgba(C.orange, 0)); g.addColorStop(0.5, rgba(C.orange, 0.42)); g.addColorStop(1, rgba(C.orange, 0)); G.fillStyle = g; G.fillRect(hx2 - 46, by2 - 46, 92, 74); }
        if (sag > 0.05) { circle(cx + 13 * s2, by2 + 24 + sag * s2, 26, { color: C.red, w: 2, alpha: a * clamp(sag * 2) }); dLabel('the heavy part sags', cx + 13 * s2 - 34, by2 + 44, { align: 'right', color: C.red, weight: 800, alpha: a * clamp(sag * 2) }); }
        if (flip > 0.02 && flip < 0.98) dLabel('flipped for side two', cx, by2 - 40, { align: 'center', color: C.ink2, alpha: a });
      }
    },
    {
      n: 101, ev: ['claim', 'derived'], title: 'brass inserts kept away from the antenna',
      body: 'metal near an antenna absorbs and reflects the signal and pulls its tuning off the band, so less of the signal gets out, and at worst the link drops. the antenna sits forward (#68); the inserts stay at the back.',
      note: 'tuning curve is an illustration of the effect, not a measurement.',
      draw: (lt, x, y, w, h, A, a) => {
        const k = pingpong(lt, 7), ax = x + 120, ay = y + 92;
        /* board corner with an inverted-F trace antenna and its keep-out */
        G.save(); G.globalAlpha = a; rrPath(x + 24, y + 30, w - 48, 150, 8); G.fillStyle = TH ? '#1d2a22' : '#16201a'; G.fill(); G.restore();
        G.save(); G.globalAlpha = a; G.setLineDash([5, 4]); G.strokeStyle = rgba(A, 0.9); G.lineWidth = 1.5; G.strokeRect(x + 40, y + 46, 170, 112); G.restore();
        dLabel('keep-out', x + 46, y + 172, { color: A, weight: 800, alpha: a });
        poly([[ax - 60, ay + 50], [ax - 60, ay - 30], [ax + 70, ay - 30], [ax + 70, ay - 6], [ax - 30, ay - 6], [ax - 30, ay + 14], [ax + 70, ay + 14]], { color: '#c98a4e', w: 5, alpha: a, cap: 'square' });
        line(ax - 40, ay - 30, ax - 40, ay + 50, { color: '#c98a4e', w: 5, alpha: a });
        for (let i = 0; i < 5; i++) { const p = (lt * 0.45 + i / 5) % 1, r = 30 + p * 230, fade = (1 - p) * (1 - 0.75 * k * clamp((r - 60) / 120)); circle(ax, ay, r, { color: A, w: 2, alpha: a * fade * 0.7, a0: -1.3, a1: 0.9 }); }
        /* the insert walks in from the back of the mouse */
        const ix = lerp(x + w - 60, ax + 120, k), iy = ay + 6;
        part(ix, iy, 6.5, () => { G.beginPath(); G.arc(0, 0, 2.4, 0, TAU); G.fillStyle = grad(MT.brass, -2.4, -2.4, 2.4, 2.4); G.fill(); G.strokeStyle = 'rgba(80,60,10,0.8)'; G.lineWidth = lw(1); G.stroke(); for (let j = 0; j < 18; j++) { const t2 = j / 18 * TAU; mmLine([[Math.cos(t2) * 1.9, Math.sin(t2) * 1.9], [Math.cos(t2) * 2.4, Math.sin(t2) * 2.4]], 'rgba(90,65,15,0.7)', 1); } G.beginPath(); G.arc(0, 0, 1.0, 0, TAU); G.fillStyle = '#2a2316'; G.fill(); }, { alpha: a });
        dLabel('brass insert', ix, iy + 34, { align: 'center', color: '#e7e6e1', alpha: a });
        /* the tuning curve: the dip slides off the 2.4 GHz band as the metal comes close */
        const m = miniAxes(x + 70, y + 214, w - 110, 96, { xr: [2.30, 2.60], yr: [-25, 0], xticks: [2.3, 2.4, 2.5, 2.6], xfmt: v => v.toFixed(1), yticks: [-20, -10, 0], alpha: a });
        G.save(); G.globalAlpha = a * 0.18; G.fillStyle = A; G.fillRect(m.X(2.400), y + 214, m.X(2.4835) - m.X(2.400), 96); G.restore();
        const f0 = 2.44 - 0.085 * k, dep = 22 - 9 * k, bw = 0.028 + 0.01 * k, pts = [];
        for (let f = 2.30; f <= 2.60; f += 0.003) pts.push([m.X(f), m.Y(-dep / (1 + Math.pow((f - f0) / bw, 2)))]);
        const off = k > 0.55; poly(pts, { color: off ? C.red : A, w: 2.5, alpha: a });
        line(m.X(2.30), m.Y(-10), m.X(2.60), m.Y(-10), { color: C.faint, w: 1, dash: [3, 3], alpha: a });
        dLabel('Return loss, dB', x + 70, y + 236, { role: 'small', alpha: a }); dLabel('GHz', x + w - 14, y + 316, { role: 'small', alpha: a, align: 'right' });
        dLabel(off ? 'Detuned' : 'In tune', x + w - 40, y + 206, { align: 'right', role: 'label', color: off ? C.red : A, alpha: a });
      }
    },
    {
      n: 25, ev: ['claim', 'proposal'], title: 'pair by plugging both in',
      body: 'plug the mouse and the receiver into the same PC and they pair over USB, the way a DualSense pairs with a PS5. one random key goes to both and is read back, so there\'s no button combination to remember.',
      note: 'As in the Kunai guide',
      draw: (lt, x, y, w, h, A, a) => {
        const ph = cyc(lt, 0, 8), plug = ph < 0.1 ? E.out3(ph / 0.1) : ph < 0.62 ? 1 : ph < 0.72 ? 1 - E.io3((ph - 0.62) / 0.1) : 0;
        /* the PC, two ports */
        const px = x + w - 150, py = y + 70;
        G.save(); G.globalAlpha = a; rrPath(px, py, 120, 210, 10); G.fillStyle = TH ? '#e7e5df' : '#24252a'; G.fill(); G.strokeStyle = inkA(0.3); G.lineWidth = 1.5; G.stroke(); G.restore();
        dLabel('PC', px + 60, py + 196, { align: 'center', weight: 800, color: C.ink2, alpha: a });
        const port = [py + 60, py + 130];
        for (const yy of port) { G.save(); G.globalAlpha = a; rrPath(px + 14, yy - 8, 36, 16, 8); G.fillStyle = '#0b0c0e'; G.fill(); G.restore(); }
        /* receiver in port 2 */
        G.save(); G.globalAlpha = a; rrPath(px - 46, port[1] - 14, 62, 28, 7); G.fillStyle = TH ? '#2b2c31' : '#3a3b41'; G.fill(); G.restore();
        dLabel('receiver', px - 16, port[1] + 34, { align: 'center', color: C.ink2, alpha: a });
        /* the mouse, as the generic key plan, and its cable to port 1 */
        const mx = x + 92, my = y + 190;
        part(mx, my, 1.35, () => keyPlanMM({ hi: [] }), { alpha: a, rot: Math.PI / 2 });
        dLabel('mouse', mx, my + 62, { align: 'center', color: C.ink2, alpha: a });
        const plugX = lerp(px - 80, px + 14, plug), cyY = port[0];
        poly([[mx + 82, my], [mx + 140, my], [mx + 170, cyY], [plugX - 26, cyY]], { color: C.ink2, w: 5, alpha: a });
        G.save(); G.globalAlpha = a; rrPath(plugX - 28, cyY - 9, 34, 18, 5); G.fillStyle = C.ink2; G.fill(); G.restore();
        /* the key travels mouse → PC → receiver, then both read it back */
        const kt = clamp((ph - 0.12) / 0.3), key = (kx, ky, kk) => { G.save(); G.globalAlpha = a * kk; G.strokeStyle = A; G.lineWidth = 3; G.beginPath(); G.arc(kx - 8, ky, 7, 0, TAU); G.stroke(); G.beginPath(); G.moveTo(kx - 1, ky); G.lineTo(kx + 16, ky); G.moveTo(kx + 10, ky); G.lineTo(kx + 10, ky + 7); G.moveTo(kx + 15, ky); G.lineTo(kx + 15, ky + 6); G.stroke(); G.restore(); };
        if (ph > 0.12 && ph < 0.44) { const path = [[mx + 82, my], [mx + 170, cyY], [px + 30, cyY], [px + 30, port[1]], [px - 20, port[1]]]; const seg = kt * (path.length - 1), i = Math.min(path.length - 2, Math.floor(seg)), f = seg - i; key(lerp(path[i][0], path[i + 1][0], f), lerp(path[i][1], path[i + 1][1], f) - 16, 1); }
        if (ph >= 0.42 && ph < 0.72) { const kk = ep(ph, 0.42, 0.46); dLabel('one random key, written to both, read back', x + 24, y + 34, { color: A, weight: 800, alpha: a * kk }); for (const [cx2, cy2] of [[mx, my - 70], [px - 16, port[1] - 34]]) { G.save(); G.globalAlpha = a * kk; G.strokeStyle = A; G.lineWidth = 3.5; G.beginPath(); G.moveTo(cx2 - 9, cy2); G.lineTo(cx2 - 2, cy2 + 7); G.lineTo(cx2 + 11, cy2 - 8); G.stroke(); G.restore(); } }
        if (ph >= 0.74) { const kk = ep(ph, 0.74, 0.78); dLabel('unplugged: paired, on the radio', x + 24, y + 34, { color: A, weight: 800, alpha: a * kk }); for (let i = 0; i < 4; i++) { const p = ((ph - 0.74) * 6 + i / 4) % 1; circle(lerp(mx + 70, px - 50, p), lerp(my - 30, port[1] - 20, p), 4, { fill: A, alpha: a * kk }); } }
      }
    }
  ],
  captions: [[0.6, 'three small ones from the electronics: how the board is built, where the metal goes, and how the receiver finds the mouse.']]
});
