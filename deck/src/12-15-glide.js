/* ============================================================================================
   idea sheet: glide and tracking. Three details under the mouse: the skate material (#8), where the screws go
   (#52) and the size of the lens (#37). Sources are added in 10-c-glide.js (gld_* keys).
   The sheet sits after 'focus', between two paper slides.
   ============================================================================================ */
ideaSheet({
  id: 'gld_sheet', ch: 'glide', theme: 'night', title: 'Three details under the mouse', src: ['delrin150', 'gld_ptfe', 'obsidianDots', 'tpuUlx', 'gld_shell3d', 'gld_paw3395', 'gld_zkLens', 'gld_tpuV4', 'gld_brock'],
  panels: [
    {
      n: 8, ev: ['derived', 'proposal'], title: 'POM by default, PTFE in the box',
      body: 'POM matches the axle and the pads beside the plungers, and a POM dot weighs a third less than a PTFE dot of the same size. PTFE ships in the box for anyone who prefers it.',
      note: 'Delrin 150 slides at μ 0.20 on steel. A pad is not steel, so each set\'s μ on cloth and glass goes on its card.',
      draw: (lt, x, y, w, h, A, a) => {
        /* two dots crossing a cloth pad, seen from above */
        const pad = [x + 18, y + 26, w - 36, 160], R = 28, k = pingpong(lt, 3.6);
        rr(pad[0], pad[1], pad[2], pad[3], 10, TH ? '#2c2e33' : '#1b1d21', null, 0, a);
        G.save(); G.globalAlpha = a; rrPath(pad[0], pad[1], pad[2], pad[3], 10); G.clip(); G.strokeStyle = 'rgba(255,255,255,0.07)'; G.lineWidth = 1; G.beginPath();
        for (let s = -200; s < pad[2] + 220; s += 7) { G.moveTo(pad[0] + s, pad[1]); G.lineTo(pad[0] + s - 160, pad[1] + 160); } G.stroke(); G.restore();
        [['POM', MT.pom, k, pad[1] + 48], ['PTFE', MT.ptfe, 1 - k, pad[1] + 116]].forEach(([nm, mt, kk, yy], i) => {
          const cx = pad[0] + 44 + kk * (pad[2] - 88), dir = (i ? -1 : 1) * (Math.cos(lt / 3.6 * TAU) < 0 ? 1 : -1);
          for (let j = 1; j <= 4; j++) circle(cx - dir * j * 10, yy, R - j * 2, { color: rgba('#d9d7d0', 0.18 - j * 0.03), w: 1.5, alpha: a });
          G.save(); G.globalAlpha = a; G.beginPath(); G.arc(cx, yy, R, 0, TAU); G.fillStyle = grad(mt, cx - R, yy - R, cx + R, yy + R); G.fill(); G.strokeStyle = 'rgba(0,0,0,0.4)'; G.lineWidth = 1.5; G.stroke(); G.restore();
          dLabel(nm, cx, yy + 7, { align: 'center', color: '#2a2b2e', alpha: a, size: 19 });
        });
        /* the mass of eight dots, 6.5 × 0.8 mm, in each material */
        const by = y + 226, bx = x + 140, bw = w - 140 - 120;
        dLabel('8 dots, 6.5 × 0.8 mm', x + 20, by - 26, { color: C.ink2, alpha: a });
        [['POM', 0.30, true], ['PTFE', 0.46, false]].forEach(([nm, g, hero], i) => {
          const yy = by + i * 40, kk = ep(lt, 0.3 + i * 0.2, 1.1 + i * 0.2, E.snap);
          dLabel(nm, x + 20, yy + 7, { color: hero ? C.ink : C.mute, alpha: a, size: 21 });
          rr(bx, yy - 7, bw, 14, 7, C.track, null, 0, a);
          rr(bx, yy - 7, Math.max(14, bw * g / 0.5 * kk), 14, 7, hero ? YEL : C.comp, null, 0, a);
          text(fmtN(g, 2) + ' g', bx + bw + 14, yy + 8, { font: 'mono', size: 23, weight: 700, color: hero ? C.heroText : C.ink, alpha: a });
        });
        dLabel('Density 1.42 and 2.16 g/cm³', x + 20, by + 76, { color: C.faint, alpha: a, size: 19 });
      }
    },
    {
      n: 52, ev: ['measured', 'proposal'], title: 'Screws clear of the skates',
      body: 'The Finalmouse ULX keeps its rear screws under the skates, so opening it costs a set of skates. Every Theseus screw sits inside the ring of dots, at least 1.5 mm from any of them.',
      note: 'ULX: TechPowerUp. Clearance: the layout rule in this deck\'s 3D model.',
      draw: (lt, x, y, w, h, A, a) => {
        const ph = cyc(lt, 0, 7.0), hw = (w - 24) / 2, s = 5.6;
        /* left: a big skate over a screw, peeled back to reach it */
        { const cx = x + 8 + hw / 2, cy = y + 160, peel = ph < 0.08 ? 0 : ph < 0.32 ? E.io3((ph - 0.08) / 0.24) : ph < 0.5 ? 1 : ph < 0.62 ? 1 - E.io3((ph - 0.5) / 0.12) : 0;
          rr(x + 10, y + 30, hw - 4, 250, 14, TH ? '#2a2b2e' : '#202125', null, 0, a);
          dLabel('ULX', cx, y + 66, { align: 'center', color: C.ink, alpha: a, size: 19 });
          part(cx, cy, s, () => screwHeadMM(), { alpha: a });
          G.save(); G.globalAlpha = a * (1 - 0.25 * peel); G.translate(cx - 12 * s, cy); G.rotate(-0.55 * peel); G.translate(0, -peel * 6);
          pathRR(0, -5 * s, 24 * s, 10 * s, 5 * s); G.fillStyle = grad(MT.ptfe, 0, -5 * s, 0, 5 * s); G.fill(); G.strokeStyle = 'rgba(0,0,0,0.35)'; G.lineWidth = 1.5; G.stroke(); G.restore();
          dLabel(peel > 0.5 ? 'New skates needed' : 'Skate over screw', cx, y + 262, { align: 'center', color: peel > 0.5 ? C.red : C.mute, alpha: a, size: 19 }); }
        /* right: two dots, the screw inside them, a driver reaches it */
        { const cx = x + 16 + hw * 1.5, cy = y + 150, turn = ph < 0.62 ? 0 : E.io3(clamp((ph - 0.62) / 0.3)) * Math.PI * 2;
          rr(x + 14 + hw, y + 30, hw - 4, 250, 14, TH ? '#2a2b2e' : '#202125', null, 0, a);
          dLabel('Theseus', cx, y + 66, { align: 'center', color: C.ink, alpha: a, size: 19 });
          for (const [dx, dy] of [[-12, -4], [-1.5, -10.5]]) { G.save(); G.globalAlpha = a; G.beginPath(); G.arc(cx + dx * s, cy + dy * s + 30, 3.25 * s, 0, TAU); G.fillStyle = grad(MT.pom, cx + dx * s - 18, cy + dy * s + 12, cx + dx * s + 18, cy + dy * s + 48); G.fill(); G.strokeStyle = 'rgba(0,0,0,0.35)'; G.lineWidth = 1.5; G.stroke(); G.restore(); }
          const sx = cx + 7 * s, sy = cy + 7 * s;
          part(sx, sy, s, () => { xturn(turn); screwHeadMM(); }, { alpha: a });
          circle(sx, sy, (2 + 1.5) * s, { color: A, w: 1.5, dash: [4, 4], alpha: a });
          dLabel('1.5 mm', sx - 4.4 * s, sy + 6, { align: 'right', color: A, alpha: a, size: 19 });
          if (ph >= 0.55) { const kd = ep(ph, 0.55, 0.62); line(sx + 40, sy - 96, sx + 3, sy - 6, { color: C.ink2, w: 6, cap: 'round', alpha: a * kd }); }
          dLabel(ph >= 0.62 ? 'Skates untouched' : 'Screw inside dots', cx, y + 262, { align: 'center', color: ph >= 0.62 ? A : C.mute, alpha: a, size: 19 }); }
      }
    },
    {
      n: 37, ev: ['datasheet', 'derived'], title: 'A smaller, clip-on lens',
      body: 'PixArt already sells the PAW3395 with a trim lens that covers 54% less board than its round lens. Razer\'s new lens snaps on. I want a clip-on lens about one dot wide, from PixArt.',
      note: 'Zaunkoenig weighed its M1K\'s lens at 0.8 g, more than the 0.6 g sensor under it (maker claim).',
      draw: (lt, x, y, w, h, A, a) => {
        /* footprints to scale, 8 px per mm: the round lens assembly, the trim lens, and a lens one dot wide */
        const s = 8, cx = x + 128, cy = y + 150, ph = cyc(lt, 0, 9), st = ph < 0.33 ? 0 : ph < 0.66 ? 1 : 2;
        const F = [[18.85, 21.15, 3.0], [10.9, 16.8, 1.6], [6.5, 6.5, 3.25]], u = st === 0 ? 0 : st === 1 ? ep(ph, 0.33, 0.43) : ep(ph, 0.66, 0.76);
        const from = F[Math.max(0, st - 1)], to = F[st], cur = st === 0 ? F[0] : from.map((v, i) => lerp(v, to[i], u));
        G.save(); G.globalAlpha = a; G.setLineDash([5, 4]); G.strokeStyle = C.faint; G.lineWidth = 1.5;
        for (const f of F.slice(0, 2)) { pathRR(cx - f[0] * s / 2, cy - f[1] * s / 2, f[0] * s, f[1] * s, f[2] * s); G.stroke(); }
        G.restore();
        G.save(); G.globalAlpha = a; pathRR(cx - cur[0] * s / 2, cy - cur[1] * s / 2, cur[0] * s, cur[1] * s, cur[2] * s); G.fillStyle = st === 2 ? rgba(YEL, 0.55) : 'rgba(205,235,250,0.32)'; G.fill(); G.strokeStyle = st === 2 ? YEL : 'rgba(150,200,228,0.95)'; G.lineWidth = 2; G.stroke(); G.restore();
        circle(cx, cy, 1.1 * s, { fill: 'rgba(30,40,50,0.8)', alpha: a });
        /* readout, right of the drawing */
        const tx = x + 268, labs = [['Round lens', '18.85 × 21.15 mm', '399 mm²'], ['Trim lens', '10.90 × 16.80 mm', '183 mm², −54%'], ['Clip-on target', 'One dot wide', 'Proposal']];
        labs.forEach((L, i) => {
          const yy = y + 56 + i * 80, on = i === st;
          dLabel(L[0], tx, yy, { color: on ? (i === 2 ? C.heroText : C.ink) : C.faint, alpha: a, size: 19 });
          text(L[1], tx, yy + 28, { font: 'mono', size: 22, weight: on ? 700 : 500, color: on ? C.ink : C.faint, alpha: a });
          text(L[2], tx, yy + 54, { font: 'mono', size: 21, weight: 500, color: on ? (i === 2 ? C.heroText : C.ink2) : C.faint, alpha: a });
        });
        dLabel('To scale, 8 px per mm', x + 20, y + 300, { color: C.faint, alpha: a, size: 19 });
      }
    }
  ],
  captions: [[0.6, 'What the skates are made of, where the screws go, and how big the lens has to be.']]
}).after = 'focus';
