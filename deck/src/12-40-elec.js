/* ============================================================================================
   idea sheet: electronics, built not to fail (#51, #98, #100). Follows the one-side, one-reflow slide.
   Sources are in 10-f-elec.js (SRC: elcBrock, elcCoat, elcNpm, elcLayout).
   ============================================================================================ */
const elc_sheet1 = ideaSheet({
  id: 'elecsheet1', ch: 'elec', theme: 'night', title: 'Built not to fail', src: ['elcBrock', 'elcCoat', 'elcNpm', 'elcLayout'],
  panels: [
    {
      n: 51, ev: ['claim', 'proposal'], title: 'Wires instead of ribbon cables',
      body: 'A ribbon tears at its latch when a board comes out; a wire on a JST plug can be pulled and pushed back. That is my experience and a tester\'s, not a study.',
      note: 'Unverified as a failure rate. The DeathAdder V4 Pro still uses a branching ribbon.',
      draw: (lt, x, y, w, h, A, a) => {
        const tug = pingpong(lt, 3.2), boardA = (bx, by) => { G.save(); G.globalAlpha = a; rrPath(bx, by, 96, 64, 6); G.fillStyle = '#121316'; G.fill(); G.strokeStyle = 'rgba(217,178,90,0.8)'; G.lineWidth = 1.5; G.stroke(); G.restore(); };
        /* the ribbon: a thin amber strip into a latch; tugged, it creases at the latch and tears */
        const y1 = y + 92, bx2 = x + w - 140 + tug * 30;
        dLabel('Ribbon cable', x + 18, y + 32, { color: C.ink2, alpha: a });
        boardA(x + 24, y1 - 32); boardA(bx2, y1 - 32);
        rr(x + 106, y1 - 16, 26, 32, 3, '#e9e4d8', null, 1, a); rr(x + 98, y1 - 20, 10, 40, 2, '#2a2b30', null, 1, a);
        const crease = clamp((tug - 0.55) / 0.3);
        G.save(); G.globalAlpha = a; G.fillStyle = '#d18a1c'; G.beginPath(); G.moveTo(x + 132, y1 - 7); const cx0 = x + 146;
        G.lineTo(cx0, y1 - 7 - 4 * crease); G.lineTo(cx0 + 8, y1 - 7 + 3 * crease); G.lineTo(bx2, y1 - 7); G.lineTo(bx2, y1 + 7); G.lineTo(cx0 + 8, y1 + 7 + 3 * crease); G.lineTo(cx0, y1 + 7 - 4 * crease); G.lineTo(x + 132, y1 + 7); G.closePath(); G.fill(); G.restore();
        for (let i = 0; i < 6; i++) line(x + 134, y1 - 5 + i * 2, bx2, y1 - 5 + i * 2, { color: 'rgba(120,70,10,0.5)', w: 0.8, alpha: a });
        if (crease > 0.6) { line(cx0 + 2, y1 - 9, cx0 + 6, y1 + 9, { color: C.red, w: 3, alpha: a }); dLabel('Tears at the latch', cx0 - 4, y1 + 42, { color: C.red, weight: 800, alpha: a }); }
        /* the wires: a twisted pair into a JST plug; tugged, they straighten and the plug holds */
        const y2 = y + 230, bx3 = x + w - 140 + tug * 30;
        dLabel('Wires and a JST plug', x + 18, y + 170, { color: C.ink2, alpha: a });
        boardA(x + 24, y2 - 32); boardA(bx3, y2 - 32);
        rr(x + 104, y2 - 13, 30, 26, 3, '#e9e4d8', null, 1, a);
        const amp = 6 * (1 - 0.6 * tug);
        for (const [ph0, col] of [[0, '#9e1510'], [Math.PI, '#18181a']]) { const pts = []; for (let u = 0; u <= 1.0001; u += 0.02) pts.push([lerp(x + 134, bx3, u), y2 + Math.sin(u * 22 + ph0) * amp]); poly(pts, { color: col, w: 4, alpha: a }); }
        if (tug > 0.7) dLabel('Pulls out, plugs back in', x + w - 18, y2 + 54, { align: 'right', color: A, weight: 800, alpha: a });
      }
    },
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
  captions: [[0.6, 'Three small things that keep a board alive: connections that survive a repair, a coat against sweat and spills, and a switch nobody has to guess.']]
});
elc_sheet1.after = 'elc_oneside';
