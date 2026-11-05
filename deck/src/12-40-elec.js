/* ============================================================================================
   idea sheet: electronics, the coat and the switch (#98, #100). Follows the one-side, one-reflow slide. (#51, wires
   instead of ribbon cables, is the braid slides' now: 10-f2-elec.js.)
   Sources are in 10-f-elec.js (SRC: elcBrock, elcCoat, elcNpm, elcLayout).
   ============================================================================================ */
const elc_sheet1 = ideaSheet({
  id: 'elecsheet1', ch: 'elec', theme: 'paper', title: 'Conformal coat, readable switch', src: ['elcBrock', 'elcCoat', 'elcNpm', 'elcLayout'],
  panels: [
    {
      n: 98, ev: ['datasheet', 'derived', 'proposal'], title: 'A coat that keeps water off the board',
      body: 'Sweat or a spilled drink bridges two pads on a bare board, and it shorts or corrodes. A 30 to 130 µm urethane coat seals the board, connectors masked, for 0.06 to 0.24 g: under 1 % of the mouse. Few mice do it.',
      note: 'Mass assumes about 1 g/cm³ over the 18.6 cm² top side; not yet weighed. Coat drawn thicker than scale.',
      draw: (lt, x, y, w, h, A, a) => {
        const ph = cyc(lt, 0, 6), fall = clamp((ph - 0.08) / 0.22), wet = clamp((ph - 0.3) / 0.12), s = 17, by = y + 176;
        const parts = [[-6.5, 'qfn'], [1.5, 'res'], [6.2, 'cap']], hTop = { qfn: 0.85, res: 0.35, cap: 0.8 };
        [[x + w * 0.26, false], [x + w * 0.74, true]].forEach(([bx, coated]) => {
          dLabel(coated ? 'Coated' : 'Bare board', bx, y + 34, { align: 'center', color: coated ? C.heroText : C.ink2, weight: 800, alpha: a });
          part(bx, by, s, () => { pcbSec(-11, 11, 0, 1.2, {}); for (const [px, k] of parts) smdMM(px, k); }, { alpha: a });
          /* the coat: one film over the board and every part on it */
          if (coated) {
            const top = px => { for (const [c, k] of parts) { const wd = { qfn: 7, res: 1.0, cap: 1.6 }[k]; if (Math.abs(px - c) <= wd / 2 + 0.12) return hTop[k] + 0.22; } return 0.22; };
            const film = []; for (let px = -11; px <= 11; px += 0.2) film.push([bx + px * s, by - top(px) * s]);
            poly(film, { color: rgba(A, 0.95), w: 3, alpha: a });
          }
          /* the drop: it falls onto the resistor's two pads */
          const rx = bx + 1.5 * s, ry = by - (coated ? 0.57 : 0.35) * s;
          if (fall > 0 && fall < 1) { G.save(); G.globalAlpha = a; G.beginPath(); G.ellipse(rx, lerp(y + 50, ry - 13, E.in3(fall)), 9, 13, 0, 0, TAU); G.fillStyle = 'rgba(120,190,255,0.85)'; G.fill(); G.restore(); }
          if (fall >= 1) {
            G.save(); G.globalAlpha = a; G.beginPath();
            if (coated) G.ellipse(rx, ry - 11, 14, 11, 0, 0, TAU); else G.ellipse(rx, ry + 1, lerp(10, 22, wet), lerp(10, 5, wet), 0, 0, TAU);
            G.fillStyle = 'rgba(120,190,255,0.8)'; G.fill(); G.restore();
            if (!coated && wet > 0.5) { const fl = 0.6 + 0.4 * Math.sin(lt * 18); warm(rx, ry, 30, C.bad, 0.45 * fl * a); }
            dLabel(coated ? 'Beads up: dry underneath' : 'Bridges the pads: a short', bx, by + 3.2 * s, { align: 'center', color: coated ? C.heroText : C.bad, weight: 700, alpha: a * clamp(wet * 2) });
          }
        });
        /* what it costs */
        const ky = y + h - 40;
        rich([{ s: '+0.06 to 0.24 g', font: 'mono', size: 30, weight: 800, color: C.heroText }, { s: 'under 1 % of the ' + THS.massG + ' mouse', role: 'small', size: 22, color: C.ink2, gap: 14 }], x + w / 2, ky, { align: 'center', alpha: a });
      }
    },
    {
      n: 100, ev: ['datasheet', 'proposal'], title: 'An ON and an OFF you can read',
      body: 'The power switch sits in the base window with ON and OFF printed beside it. OFF puts the PMIC in ship mode: 370 nA, so a mouse left in a drawer keeps its charge.',
      draw: (lt, x, y, w, h, A, a) => {
        const on = pingpong(lt, 5, E.io5), cx = x + w * 0.36, cy = y + h / 2 + 6;
        G.save(); G.globalAlpha = a; rrPath(x + 22, y + 22, w * 0.62, h - 44, 10); G.fillStyle = '#0f1012'; G.fill(); G.restore();
        G.save(); G.globalAlpha = a; G.setLineDash([6, 4]); G.strokeStyle = 'rgba(243,242,238,0.45)'; G.lineWidth = 1.5; G.strokeRect(cx - 78, cy - 104, 156, 208); G.restore();
        dLabel('Base window', cx - 78, cy - 116, { color: C.mute, alpha: a });
        rr(cx - 22, cy - 66, 44, 132, 6, '#c9cbce', null, 1, a); rr(cx - 16, cy - 60, 32, 120, 4, '#2a2b30', null, 1, a);
        const ky = lerp(cy + 28, cy - 28, on); rr(cx - 14, ky - 22, 28, 44, 4, '#e9e4d8', null, 1, a);
        const tri = (tx, ty, up) => { G.save(); G.globalAlpha = a; G.fillStyle = '#f3f2ee'; G.beginPath(); G.moveTo(tx, ty + (up ? -8 : 8)); G.lineTo(tx - 7, ty + (up ? 4 : -4)); G.lineTo(tx + 7, ty + (up ? 4 : -4)); G.closePath(); G.fill(); G.restore(); };
        text('ON', cx + 40, cy - 34, { font: 'mono', size: 24, weight: 800, color: '#f3f2ee', alpha: a }); tri(cx + 96, cy - 42, true);
        text('OFF', cx + 40, cy + 50, { font: 'mono', size: 24, weight: 800, color: '#f3f2ee', alpha: a }); tri(cx + 108, cy + 42, false);
        const rx = x + w * 0.66 + 14;
        dLabel(on > 0.5 ? 'Awake' : 'Ship mode', rx, cy - 12, { color: on > 0.5 ? A : C.ink, weight: 800, alpha: a });
        text(on > 0.5 ? 'running' : '370 nA', rx, cy + 22, { font: 'mono', size: 25, weight: 700, color: C.ink, alpha: a });
        dLabel('Print shown white on the mask', x + 26, y + h - 30, { color: C.mute, alpha: a });
      }
    }
  ],
  captions: [[0.6, 'Two small things that keep the one board alive: a coat against sweat and spills, and a power switch nobody has to guess.']]
});
elc_sheet1.after = 'elc_oneside';
/* Brock (F27, 7/10): "show how this protects against water for very little weight, something few might do" */
elc_sheet1.rev = 1;
elc_sheet1.answers = [['show how this protects against water', 'The coat panel now drops water on a bare board (it shorts) and a coated one (it beads up)'],
  ['for very little weight', '+0.06 to 0.24 g, under 1 % of the mouse, set large under the boards'], ['something few might do', 'Said in the panel: few mice do it']];
