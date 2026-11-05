/* ============================================================================================
   idea sheet: glide and tracking. Three details under the mouse: the skate material (#8), where the screws go (#52) and
   how tall the skates are (Brock's 0.65 mm). Sources are added in 10-c-glide.js and 10-c2-glide.js (gld_* keys).
   The sheet closes the chapter (13-sort.js puts sheets last). Each panel leads with its number, in Theseus's colour.
   ============================================================================================ */
/** a panel's headline: a big figure in Theseus's gradient and a few words under it */
function gld_pHead(x, y, v, unit, lab, a) {
  rich([{ s: v, role: 'd1', size: 64, weight: 800, color: C.heroText, grad: C.heroGrad, tnum: true }, unit ? { s: unit, font: 'disp', size: 26, weight: 800, color: C.heroText, grad: C.heroGrad, gap: 6, caps: false } : null], x, y, { alpha: a });
  text(lab, x, y + 30, { role: 'label', size: 19, color: C.mute, alpha: a });
}
ideaSheet({
  id: 'gld_sheet', ch: 'glide', theme: 'paper', title: 'Three details under the mouse', src: ['delrin150', 'gld_ptfe', 'obsidianDots', 'tpuUlx', 'gld_shell3d', 'gld_doc65', 'gld_zowie', 'gld_brock'],
  panels: [
    {
      n: 8, ev: ['derived'], title: 'POM by default, PTFE in the box',
      body: 'POM matches the axle and the pads beside the plungers, and a POM dot weighs a third less than a PTFE one. PTFE ships in the box for anyone who prefers it.',
      note: 'Delrin 150 slides at μ 0.20 on steel. A pad is not steel, so each set\'s μ on cloth and glass goes on its card.',
      draw: (lt, x, y, w, h, A, a) => {
        const v = 10 * Math.PI * 3.25 * 3.25 * 0.65 / 1000, gP = v * 1.42, gT = v * 2.16, cut = Math.round((1 - gP / gT) * 100);
        gld_pHead(x + 24, y + 84, '−' + cut, '%', 'Skate weight, ten dots', a);
        /* the two sets' weight, side by side */
        const by = y + 176, bx = x + 120, bw = w - 120 - 110;
        [['POM', gP, true], ['PTFE', gT, false]].forEach(([nm, g, hero], i) => {
          const yy = by + i * 46, kk = ep(lt, 0.3 + i * 0.2, 1.1 + i * 0.2, E.snap);
          dLabel(nm, x + 24, yy + 7, { color: hero ? C.heroText : C.mute, alpha: a, size: 21 });
          rr(bx, yy - 7, Math.max(14, bw * g / 0.5 * kk), 14, 7, hero ? C.hero : C.comp, null, 0, a);
          text(fmtN(g, 2) + ' g', bx + Math.max(14, bw * g / 0.5 * kk) + 12, yy + 8, { role: 'num', size: 23, weight: 700, color: hero ? C.heroText : C.ink, alpha: a });
        });
        dLabel('Ten 6.5 × 0.65 mm dots. Lower is better', x + 24, y + h - 22, { color: C.faint, alpha: a, size: 19 });
      }
    },
    {
      n: 52, ev: [], title: 'Screws clear of the skates',
      body: 'The Finalmouse ULX keeps its rear screws under the skates, so opening it costs a set of skates. Every Theseus screw sits clear of the dots, at least 1.5 mm from any of them.',
      note: 'ULX: TechPowerUp. Clearance: the layout rule in this deck\'s 3D model.',
      draw: (lt, x, y, w, h, A, a) => {
        gld_pHead(x + 24, y + 84, '0', null, 'Skates lost to open it', a);
        const ph = cyc(lt, 0, 7.0), hw = (w - 24) / 2, s = 4.6;
        /* left: a big skate over a screw, peeled back to reach it */
        { const cx = x + 8 + hw / 2, cy = y + 214, peel = ph < 0.08 ? 0 : ph < 0.32 ? E.io3((ph - 0.08) / 0.24) : ph < 0.5 ? 1 : ph < 0.62 ? 1 - E.io3((ph - 0.5) / 0.12) : 0;
          part(cx, cy, s, () => screwHeadMM(), { alpha: a });
          G.save(); G.globalAlpha = a * (1 - 0.25 * peel); G.translate(cx - 12 * s, cy); G.rotate(-0.55 * peel); G.translate(0, -peel * 6);
          pathRR(0, -5 * s, 24 * s, 10 * s, 5 * s); G.fillStyle = TH ? '#FFFFFF' : '#D9D7D0'; G.fill(); G.strokeStyle = 'rgba(0,0,0,0.35)'; G.lineWidth = 1.5; G.stroke(); G.restore();
          dLabel(peel > 0.5 ? 'New skates needed' : 'ULX: skate over screw', cx, y + 292, { align: 'center', color: peel > 0.5 ? C.red : C.mute, alpha: a, size: 19 }); }
        /* right: two dots, the screw clear of them, a driver reaches it */
        { const cx = x + 16 + hw * 1.5, cy = y + 196, turn = ph < 0.62 ? 0 : E.io3(clamp((ph - 0.62) / 0.3)) * Math.PI * 2;
          for (const [dx, dy] of [[-12, -4], [-1.5, -10.5]]) circle(cx + dx * s, cy + dy * s + 30, 3.25 * s, { fill: TH ? '#FFFFFF' : '#D9D7D0', color: 'rgba(0,0,0,0.3)', w: 1.5, alpha: a });
          const sx = cx + 7 * s, sy = cy + 7 * s;
          part(sx, sy, s, () => { xturn(turn); screwHeadMM(); }, { alpha: a });
          circle(sx, sy, (2 + 1.5) * s, { color: C.heroText, w: 1.5, dash: [4, 4], alpha: a });
          if (ph >= 0.55) { const kd = ep(ph, 0.55, 0.62); line(sx + 40, sy - 96, sx + 3, sy - 6, { color: C.ink2, w: 6, cap: 'round', alpha: a * kd }); }
          dLabel(ph >= 0.62 ? 'Skates untouched' : 'Theseus: screw clear', cx, y + 292, { align: 'center', color: ph >= 0.62 ? C.heroText : C.mute, alpha: a, size: 19 }); }
      }
    },
    {
      n: 11, ev: [], title: 'Skates 0.65 mm tall',
      body: 'The lens sits 2.4 mm over the pad only if the skates are the height it was designed for. I set them at 0.65 mm: taller and the lift-off grows, swap them and the focus moves.',
      note: 'ZOWIE warns that skates thicker than its 0.5 mm originals can bring lag or tracking issues.',
      draw: (lt, x, y, w, h, A, a) => {
        gld_pHead(x + 24, y + 84, '0.65', 'mm', 'Skate height, set to the lens', a);
        /* a skate in section under the base, and the lens's height on the window's gauge: a taller skate lifts the lens */
        const k = pingpong(lt, 5.0), extra = 0.2 * k, sc = 110, padY = y + h - 30, skH = (0.65 + extra) * sc, baseY = padY - skH, zL = 2.4 + extra, zn = zL <= 2.5 + 1e-6 ? 0 : zL <= 2.6 + 1e-6 ? 1 : 2;
        /* the pad and the base stop short of the lens readout (its number and label sit left of the gauge) */
        line(x + 20, padY, x + w - 220, padY, { color: C.ink2, w: 2, alpha: a });
        rr(x + 20, baseY - 20, w - 240, 20, 4, TH ? '#3A3B40' : '#4A4B52', null, 0, a);
        rr(x + 60, baseY, 150, skH, 12, extra < 0.02 ? C.hero : GLD_SKC(), extra < 0.02 ? null : inkA(0.45), 1.5, a);
        text(fmtN(0.65 + extra, 2) + ' mm', x + 135, baseY + skH / 2 + 9, { role: 'num', size: 24, weight: 800, color: extra < 0.02 ? '#FFFFFF' : C.ink, align: 'center', alpha: a });
        dLabel('Skate', x + 230, baseY + skH / 2 + 7, { color: C.mute, alpha: a, size: 19 });
        const gx = x + w - 70, gc = y + 232, gk = 300;
        rr(gx - 10, gc - 0.2 * gk, 20, 0.4 * gk, 4, rgba(C.second, 0.45), null, 0, a);
        rr(gx - 10, gc - 0.1 * gk, 20, 0.2 * gk, 4, C.hero, null, 0, a);
        const ly = gc - extra * gk; gld_shape(() => { G.moveTo(gx - 30, ly); G.lineTo(gx - 16, ly - 8); G.lineTo(gx - 16, ly + 8); G.closePath(); }, zn === 0 ? C.hero : zn === 1 ? C.second : C.bad, null, 0, a);
        text(fmtN(zL, 2), gx - 38, ly + 9, { role: 'num', size: 24, weight: 800, color: zn === 0 ? C.heroText : zn === 1 ? C.secondText : C.bad, align: 'right', alpha: a });
        dLabel('Lens, mm', gx - 38, ly - 20, { color: C.mute, alpha: a, size: 19, align: 'right' });
      }
    }
  ],
  captions: [[0.6, 'What the skates are made of, where the screws go, and how tall the skates stand.']]
});
