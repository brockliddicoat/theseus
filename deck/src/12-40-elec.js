/* ============================================================================================
   idea sheet: electronics, the coat and the switch (#98, #100). Follows the one-side, one-reflow slide. (#51, wires
   instead of ribbon cables, is the braid slides' now: 10-f2-elec.js.)
   Sources are in 10-f-elec.js (SRC: elcBrock, elcCoat, elcNpm, elcLayout).
   ============================================================================================ */
const elc_sheet1 = ideaSheet({
  id: 'elecsheet1', ch: 'elec', theme: 'paper', title: 'Conformal coat, readable switch', src: ['elcBrock', 'elcCoat', 'elcNpm', 'elcLayout'],
  panels: [
    {
      n: 98, ev: ['datasheet', 'derived', 'proposal'], title: 'A thin conformal coat',
      body: 'A urethane coat over the board and black epoxy on the most sensitive parts, connectors masked. Coats like this run 30 to 130 µm: about 0.06 to 0.24 g on this board.',
      note: 'Mass assumes about 1 g/cm³ over the 18.6 cm² top side; not yet weighed.',
      draw: (lt, x, y, w, h, A, a) => {
        const ph = cyc(lt, 0, 7), sweep = clamp(ph / 0.55), s = 8.2, bx = x + w / 2, by = y + 196;
        dLabel('Board, in section', x + 18, y + 32, { color: C.ink2, alpha: a });
        part(bx, by, s, () => { pcbSec(-30, 30, 0, 1.2, {}); for (const [px, k] of [[-24, 'res'], [-15, 'qfn'], [-5, 'cap'], [2, 'res'], [9, 'xtal']]) smdMM(px, k); smdMM(21, 'conn'); }, { alpha: a });
        /* the coat: a film over everything the nozzle has passed, except the masked connector */
        const xs = x + 20 + (w - 40) * sweep, film = [];
        const top = px => { const parts = [[-24, 1.0, 0.35], [-15, 7, 0.85], [-5, 1.6, 0.8], [2, 1.0, 0.35], [9, 2.0, 0.6]]; for (const [c, wd, hh] of parts) if (Math.abs(px - c) <= wd / 2 + 0.15) return hh + 0.25; return 0.25; };
        for (let px = -30; px <= 15.5; px += 0.25) { const sx = bx + px * s; if (sx > xs) break; film.push([sx, by - top(px) * s]); }
        if (film.length > 1) poly(film, { color: rgba(A, 0.9), w: 3, alpha: a });
        G.save(); G.globalAlpha = a; G.setLineDash([4, 3]); G.strokeStyle = C.ink2; G.lineWidth = 1.5; G.strokeRect(bx + 16.8 * s, by - 3.7 * s, 8.4 * s, 3.9 * s); G.restore();
        dLabel('Masked', bx + 21 * s, by - 4.3 * s, { align: 'center', color: C.ink2, alpha: a });
        if (sweep < 1) { const nx = xs, ny = y + 70; G.save(); G.globalAlpha = a; G.fillStyle = C.ink2; G.beginPath(); G.moveTo(nx - 12, ny - 26); G.lineTo(nx + 12, ny - 26); G.lineTo(nx + 5, ny); G.lineTo(nx - 5, ny); G.closePath(); G.fill(); G.restore(); for (let i = -2; i <= 2; i++) line(nx, ny + 4, nx + i * 10, by - 40, { color: rgba(A, 0.5), w: 1.5, alpha: a }); }
        /* a drop lands on the coated board and beads up */
        const dk = clamp((ph - 0.62) / 0.2), dx = bx - 9 * s;
        if (dk > 0) { const dy = lerp(y + 60, by - 2.2 * s, Math.min(1, dk * 1.4)); G.save(); G.globalAlpha = a; G.beginPath(); G.ellipse(dx, dy - 8, dk >= 0.7 ? 14 : 8, dk >= 0.7 ? 8 : 11, 0, 0, TAU); G.fillStyle = 'rgba(120,190,255,0.75)'; G.fill(); G.restore(); if (dk >= 0.7) dLabel('Beads up', dx, by - 4 * s, { align: 'center', color: A, weight: 800, alpha: a }); }
        dLabel('Coat drawn thicker than scale', x + w - 18, y + h - 16, { align: 'right', alpha: a });
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
