/* ============================================================================================
   idea sheets: shell and structure. Six ideas without a full slide of their own, three to a sheet:
   #6 PPS carbon triggers, #26 a film-thin bottom sticker (now the plate-off cover: the plate itself is solid), #58 no cutout
   above the wheel; #31 the solid bottom plate you can leave off (10-d4-plate.js has its own two slides), #93 walls graded
   thicker toward the rim, #55 front struts joined into arches.
   Built with S() and ideaPanel() (not ideaSheet) so each sheet can carry a source line.
   ============================================================================================ */

/* trigger pair masses: the study shell's triggers (3.88 g of Pyrofil PP-C-20A, 3d/lattice) at each material's density */
const SHL_TRIG = [
  { nm: 'PPS, 30% carbon', E: 17, rho: 1.4, hero: true },
  { nm: 'Carbon PP, 20%', E: 13.5, rho: 1.01 },
  { nm: 'Magnesium AZ91D', E: 46, rho: 1.81, ref: true }
].map(m => Object.assign(m, { g: 3.88 * m.rho / 1.01, d: 13.5 / m.E }));

/* #93: an arch slice of the same mass with even walls or walls graded thicker toward the rim, clamped at the rim,
   squeezed at the grip and pressed at the crown; solved as frames (frameSolve, 10-d-shell.js) */
const SHL_GRADE = (function () {
  const N = 40, nodes = [];
  for (let i = 0; i <= N; i++) { const th = Math.PI * (1 - i / N), c = Math.cos(th), s = Math.sin(th); nodes.push([30 * Math.sign(c) * Math.pow(Math.abs(c), 0.6), -34 * Math.pow(s, 0.7)]); }
  const near = (side, y) => { let best = 0, bd = 1e9; nodes.forEach((p, i) => { if (Math.sign(p[0]) !== side) return; const d = Math.abs(p[1] - y); if (d < bd) { bd = d; best = i; } }); return best; };
  const L = i => Math.hypot(nodes[i + 1][0] - nodes[i][0], nodes[i + 1][1] - nodes[i][1]);
  const raw = y => 0.7 + 0.6 * (1 + y / 34); let num = 0, den = 0; for (let i = 0; i < N; i++) { const y = (nodes[i][1] + nodes[i + 1][1]) / 2; num += 1.2 * L(i); den += raw(y) * L(i); }
  const even = () => 1.2, graded = y => raw(y) * num / den, sqL = near(-1, -15), sqR = near(1, -15), crown = N / 2;
  const run = (th, load) => {
    const els = []; for (let i = 0; i < N; i++) { const t2 = th((nodes[i][1] + nodes[i + 1][1]) / 2); els.push({ n: [i, i + 1], A: t2, I: t2 ** 3 / 12, t: t2 }); }
    const U = frameSolve(nodes, els, [0, N], load === 'press' ? [[crown, 0, 1]] : [[sqL, 1, 0], [sqR, -1, 0]]);
    return { els, U, d: load === 'press' ? U[crown * 3 + 1] : (U[sqL * 3] - U[sqR * 3]) / 2 };
  };
  const r = { nodes, N, sqL, sqR, crown, ev: run(even, 'squeeze'), gr: run(graded, 'squeeze'), evP: run(even, 'press'), grP: run(graded, 'press') };
  r.squeeze = r.gr.d / r.ev.d - 1; r.press = r.grP.d / r.evP.d - 1;
  return r;
})();

S({
  id: 'shlsheet1', ch: 'shell', theme: 'paper', title: 'PPS triggers, film sticker, closed wheel well', settle: 10, sheet: true, ideas: [6, 26, 58],
  src: ['cfpps', 'shlPyrofil', 'az91d', 'shlLattice', 'shlMylar', 'shlB2gSlx', 'shlDoc'],
  sfx: [[0.45, 'tick'], [1.15, 'tick'], [1.85, 'tick']],
  draw: t => {
    header(t, 'PPS triggers, film sticker, closed wheel well');
    /* #6: the same trigger in three materials, pressed by the same finger */
    ideaPanel(t, 0, 3, {
      n: 6, ev: ['datasheet', 'derived', 'proposal'], title: 'PPS carbon triggers on the pro model',
      body: '26% stiffer than carbon PP for 1.5 g more a pair, and lighter than magnesium with no metal near the antenna. The click is crisper too.',
      note: 'Bend: tip deflection at the same shape. Pair: the study shell\'s triggers at each density.',
      draw: (lt, x, y, w, h, A, a) => {
        const p = pingpong(lt, 3.2), L = w - 270, x0 = x + 34;
        SHL_TRIG.forEach((m, i) => {
          const yy = y + 78 + i * 92, col = m.hero ? C.hero : m.ref ? C.ink : C.comp, tip = 26 * m.d * p;
          dLabel(m.nm, x0, yy - 34, { color: m.hero ? C.heroText : C.ink2, alpha: a });
          rect(x0 - 16, yy - 14, 16, 28, { fill: C.mute, alpha: a });
          G.save(); G.globalAlpha = a; G.strokeStyle = col; G.lineWidth = 7; G.lineCap = 'round'; G.beginPath();
          for (let k = 0; k <= 30; k++) { const xi = k / 30, v = xi * xi * (3 - xi) / 2; const px = x0 + L * xi, py = yy + tip * v; k ? G.lineTo(px, py) : G.moveTo(px, py); }
          G.stroke(); G.restore();
          arrow(x0 + L, yy - 40 + tip, x0 + L, yy - 8 + tip, { color: C.ink, w: 2.5, hs: 9, alpha: a * (0.4 + 0.6 * p) });
          text(m.d.toFixed(2) + '×', x + w - 112, yy - 4, { font: 'mono', size: 24, weight: 800, color: C.ink, align: 'right', alpha: a });
          text(m.g.toFixed(1) + ' g', x + w - 18, yy - 4, { font: 'mono', size: 24, weight: 600, color: C.mute, align: 'right', alpha: a });
        });
        dLabel('Bend', x + w - 112, y + 30, { align: 'right', alpha: a }); dLabel('Pair', x + w - 18, y + 30, { align: 'right', alpha: a });
      }
    });
    /* #26: the film covers the open bottom of the plate-off build (the plate itself is solid): liquid that fell onto the board now beads off */
    ideaPanel(t, 1, 3, {
      n: 26, ev: ['derived', 'claim'], title: 'A film-thin bottom sticker',
      body: 'G-Wolves did it on the HTS Plus, per my notes. My plate is already solid, so the film is for the plate-off build: it closes the open bottom and keeps liquid off the board.',
      note: '0.13 g = 1.39 g/cm³ × 23 µm × the 40 cm² opening.',
      draw: (lt, x, y, w, h, A, a) => {
        const per = 8, c = ((lt + 4) % per) / per, film = c < 0.4 ? 0 : c < 0.55 ? E.io3((c - 0.4) / 0.15) : c < 0.92 ? 1 : 1 - E.io3((c - 0.92) / 0.08);
        const cx = x + w * 0.36, cy = y + h / 2 + 4, s = 2.35;
        part(cx, cy, s, () => {
          G.save(); keyPath(); G.fillStyle = inkA(TH ? 0.1 : 0.12); G.fill(); G.clip();
          /* plate off: the rim and its corner ledges, the board open behind them */
          G.save(); G.scale(0.86, 0.9); keyPath(); G.fillStyle = TH ? '#F7F6F2' : '#0D0E0F'; G.fill(); G.restore();
          G.fillStyle = TH ? '#3A3B40' : '#2B2C31'; pathRR(-15, -36, 30, 70, 3); G.fill();
          /* plate off: two dots at each corner on the rim's ledges (F14.1), at the shell's own positions (key plan y = -z) */
          for (const [dx, dz] of PLT_GEO.dots) { G.beginPath(); G.arc(dx, -dz, 4.55, 0, TAU); G.fillStyle = inkA(TH ? 0.1 : 0.12); G.fill(); }
          for (const [dx, dz] of PLT_GEO.dots) { G.beginPath(); G.arc(dx, -dz, 3.25, 0, TAU); G.fillStyle = TH ? '#CFCEC8' : '#4A4B50'; G.fill(); }
          /* the film, wiping on from the tail */
          if (film > 0) { G.fillStyle = rgba(TH ? '#2E2E2C' : '#CFCEC9', 0.55); G.fillRect(-40, 60 - 130 * film, 80, 130 * film); G.strokeStyle = rgba(C.hero, 0.9); G.lineWidth = lw(2.5); G.beginPath(); G.moveTo(-40, 60 - 130 * film); G.lineTo(40, 60 - 130 * film); G.stroke(); }
          /* the clip-on lens carries the two dots by the sensor (F20.2), on pads at its own two ends; the film is cut round it */
          G.fillStyle = TH ? '#9FA6AE' : '#5C636B';
          for (const z of [6.3, -6.7]) { G.beginPath(); G.arc(0, -z, 3.65, 0, TAU); G.fill(); }
          pathRR(-2.6, -7.1, 5.2, 14.2, 2.6); G.fill();
          G.fillStyle = TH ? '#CFCEC8' : '#4A4B50'; for (const z of [6.3, -6.7]) { G.beginPath(); G.arc(0, -z, 3.25, 0, TAU); G.fill(); }
          G.fillStyle = TH ? '#2A2B30' : '#0D0E10'; G.beginPath(); G.arc(0, -1.1, 1.1, 0, TAU); G.fill();
          G.restore();
          keyPath(); G.strokeStyle = inkA(0.6); G.lineWidth = lw(1.6); G.stroke();
        }, { alpha: a });
        /* drops: through a hole before the film, beading and rolling off after */
        for (let i = 0; i < 3; i++) {
          const ph = ((lt * 0.7 + i / 3) % 1), dx = cx + (i - 1) * 34, sealed = film > 0.98, dy = cy - 120 + ph * 150;
          if (!sealed) circle(dx, dy, 6, { fill: rgba(C.mute, 0.8 * (1 - clamp((ph - 0.8) / 0.2))), alpha: a });
          else { const yy = Math.min(dy, cy + 20); circle(dx + (dy > cy + 20 ? (dy - cy - 20) * 0.8 : 0), yy, 6, { fill: rgba(C.mute, 0.8 * (1 - clamp((ph - 0.85) / 0.15))), alpha: a }); }
        }
        const rx = x + w * 0.62;
        dLabel(film > 0.98 ? 'Sealed' : 'Plate off: open', rx, y + 64, { color: film > 0.98 ? C.ink : C.red, alpha: a, size: 21 });
        text('0.13', rx, y + 150, { font: 'disp', size: 64, weight: 800, color: C.ink, alpha: a, tnum: true });
        dLabel('g of film', rx + 4, y + 182, { alpha: a });
        dLabel('Mylar, 23 µm', rx + 4, y + 214, { alpha: a });
      }
    });
    /* #58: the front of the shell from above: a cutout ahead of the wheel (two edges), or the one split the Sora has, nose to rear seam with the wheel in it */
    ideaPanel(t, 2, 3, {
      n: 58, ev: ['claim', 'proposal'], title: 'No cutout above the wheel',
      body: 'In a 1-3-1 grip a finger rests on the inner edge of a trigger. One split ahead of the wheel, not a cutout, leaves one seam to catch it instead of two.',
      note: 'The Starlight X keeps cutouts flanking the wheel (Back2Gaming).',
      draw: (lt, x, y, w, h, A, a) => {
        const p = pingpong(lt, 3.0), s = 3.3;
        [[x + w * 0.27, true, 'Cutout ahead'], [x + w * 0.73, false, 'One seam']].forEach(([cx, split, lab]) => {
          const cy = y + 214;
          G.save(); G.beginPath(); G.rect(cx - 120, y + 34, 240, h - 60); G.clip();
          part(cx, cy, s, () => {
            G.save(); keyPath(); G.fillStyle = inkA(TH ? 0.08 : 0.1); G.fill(); G.restore();
            keyPath(); G.strokeStyle = inkA(0.55); G.lineWidth = lw(1.5); G.stroke();
            const [wx0, wy0, ww0, wh0] = KEY.wheel;
            /* the wheel slot */
            G.beginPath(); pathRR(wx0, wy0, ww0, wh0, 3.6); G.fillStyle = TH ? '#E7E6E1' : '#1F2023'; G.fill(); G.strokeStyle = inkA(0.5); G.lineWidth = lw(1.1); G.stroke();
            if (split) { /* a cutout from the wheel to the nose, two edges */ G.beginPath(); G.rect(-3.0, KEY.nose + 1.5, 6.0, wy0 - KEY.nose - 1.5); G.fillStyle = TH ? '#E7E6E1' : '#1F2023'; G.fill(); mmLine([[-3.0, KEY.nose + 1.5], [-3.0, wy0]], C.red, 2.2); mmLine([[3.0, KEY.nose + 1.5], [3.0, wy0]], C.red, 2.2); }
            else mmLine([[0, KEY.nose + 0.8], [0, wy0]], inkA(0.5), 1.2);
            mmLine([[0, wy0 + wh0], [0, KEY.seam]], inkA(0.5), 1.2);
          }, { alpha: a });
          G.restore();
          /* the fingertip on the left trigger's inner edge, pressing */
          const fx = cx + (split ? -5.2 : -6.5) * s, fy = cy - 44 * s, sink = split ? p : 0;
          G.save(); G.globalAlpha = a * 0.85; G.fillStyle = split && p > 0.5 ? rgba(C.red, 0.5) : rgba(C.comp, 0.75); G.beginPath(); G.ellipse(fx, fy + sink * 6, 15, 21, 0, 0, TAU); G.fill(); G.restore();
          dLabel(lab, cx, y + 30, { align: 'center', color: split ? C.red : C.ink, alpha: a, size: 21 });
          dLabel(split ? '2 gaps' : '1 gap', cx, y + h - 16, { align: 'center', color: split ? C.red : C.ink, alpha: a, size: 21 });
        });
      }
    });
  }
});

S({
  id: 'shlsheet2', ch: 'shell', theme: 'night', title: 'Optional base, graded walls, joined struts', settle: 10, sheet: true, ideas: [31, 93, 55],
  src: ['shlZkM1k', 'shlDoc', 'shlLattice'],
  sfx: [[0.45, 'tick'], [1.15, 'tick'], [1.85, 'tick']],
  draw: t => {
    header(t, 'Optional base, graded walls, joined struts');
    /* #31: the base comes off and the mouse still works */
    ideaPanel(t, 0, 3, {
      n: 31, ev: ['claim', 'derived'], title: 'A solid plate you can leave off',
      body: 'Four screws hold it, and it keeps the slide-in rim in place (#97). Solid outside; inside, an X over a triangle lattice, ' + (PLT_FE.plain.lens / PLT_FE.theseus.lens).toFixed(1) + '× as stiff as a solid plate of its weight. The mouse runs without it (#94).',
      note: 'Mine: ' + PLT_GEO.mass.toFixed(2) + ' g. Zaunkoenig M1K bases: 5.7 g, or 4.1 g light (maker figures).',
      draw: (lt, x, y, w, h, A, a) => {
        /* the plate itself (10-d4-plate.js), turning over: solid outside, then the X and the triangles inside */
        const per = 7, c = ((lt + 1.2) % per) / per, turn = c < 0.4 ? 0 : c < 0.5 ? E.io3((c - 0.4) / 0.1) : c < 0.9 ? 1 : 1 - E.io3((c - 0.9) / 0.1);
        const s = Math.min(1.9, (h - 40) / 108), cx = x + w * 0.3, cy = y + h / 2 + 10, sx = Math.cos(Math.PI * turn), inside = turn > 0.5;
        G.save(); G.translate(cx, 0); G.scale(Math.max(0.03, Math.abs(sx)), 1); G.translate(-cx, 0);
        if (inside) plt_inner(cx, cy, s, a, { hi: C.hero, hk: 1 }); else plt_outer(cx, cy, s, a, { rim: 1 });
        G.restore();
        const rx = x + w * 0.54;
        dLabel(inside ? 'Inside' : 'Outside', rx, y + 64, { color: inside ? C.heroText : C.ink2, alpha: a, size: 21 });
        dLabel(inside ? 'X and triangles' : 'Solid, no holes', rx, y + 92, { alpha: a });
        text((PLT_FE.plain.lens / PLT_FE.theseus.lens).toFixed(1) + '×', rx, y + 170, { font: 'disp', size: 64, weight: 800, color: C.heroText, grad: C.heroGrad, alpha: a, tnum: true });
        dLabel('Stiffer than', rx + 4, y + 202, { alpha: a });
        dLabel('a solid plate', rx + 4, y + 230, { alpha: a });
      }
    });
    /* #93: the same weight of wall, even or graded toward the rim, squeezed */
    ideaPanel(t, 1, 3, {
      n: 93, ev: ['derived', 'proposal'], title: 'Walls thicker near the bottom',
      body: 'At the same weight, walls graded toward the rim cut the squeeze deflection by ' + Math.round(-SHL_GRADE.squeeze * 100) + '% and soften the crown by ' + Math.round(SHL_GRADE.press * 100) + '%. So the crown gets arches and the sides get wall.',
      note: 'Arch slice solved as frames in this page; clamped at the rim.',
      draw: (lt, x, y, w, h, A, a) => {
        const G2 = SHL_GRADE, p = pingpong(lt, 3.0), mag = 5 / G2.ev.d, sc = 3.6;
        [[G2.ev, x + w * 0.27, 'Even, 1.2 mm', false], [G2.gr, x + w * 0.73, 'Graded', true]].forEach(([R, ox, lab, gr]) => {
          const oy = y + h - 48, P = (i, f) => [ox + (G2.nodes[i][0] + R.U[i * 3] * mag * f) * sc, oy + (G2.nodes[i][1] + R.U[i * 3 + 1] * mag * f) * sc];
          G.save(); G.globalAlpha = a; G.lineCap = 'round';
          for (const e of R.els) { const q0 = P(e.n[0], p), q1 = P(e.n[1], p); G.lineWidth = e.t * sc * 1.5; G.strokeStyle = gr ? C.hero : (TH ? '#5F5E59' : '#B9B8B2'); G.beginPath(); G.moveTo(q0[0], q0[1]); G.lineTo(q1[0], q1[1]); G.stroke(); }
          G.restore();
          line(ox - 34 * sc, oy + 6, ox + 34 * sc, oy + 6, { color: C.faint, w: 2, alpha: a });
          const l = P(G2.sqL, p), r = P(G2.sqR, p);
          arrow(l[0] - 46, l[1], l[0] - 8, l[1], { color: C.ink, w: 2.5, hs: 9, alpha: a * (0.4 + 0.6 * p) }); arrow(r[0] + 46, r[1], r[0] + 8, r[1], { color: C.ink, w: 2.5, hs: 9, alpha: a * (0.4 + 0.6 * p) });
          dLabel(lab, ox, y + 30, { align: 'center', color: gr ? C.hero : C.ink2, alpha: a, size: 21 });
          text((R.d / G2.ev.d).toFixed(2) + '×', ox, y + 66, { font: 'mono', size: 24, weight: 800, color: C.ink, align: 'center', alpha: a });
        });
        dLabel('Squeeze deflection, same weight', x + w / 2, y + h - 12, { align: 'center', alpha: a });
      }
    });
    /* #55: separate front struts, then the same material joined into an arch on the trigger underside */
    ideaPanel(t, 2, 3, {
      n: 55, ev: ['claim', 'proposal'], title: 'Front struts, joined',
      body: 'The front is the lowest, weakest part of the shell. The Lamzu Maya props it on struts tied to the trigger underside; I join them into arches and publish front deflection at 5 N.',
      note: 'Section through the low front. Load path drawn, not solved.',
      draw: (lt, x, y, w, h, A, a) => {
        const p = (lt % 2.4) / 2.4, s = 3.0;
        [[x + w * 0.27, false, 'Separate struts'], [x + w * 0.73, true, 'Joined arch']].forEach(([ox, arch, lab]) => {
          const oy = y + h - 70, roof = xx => -22 + 0.012 * xx * xx, X = v => ox + v * s, Y = v => oy + v * s;
          /* the low front in section: a shallow roof between the side walls, the trigger underside */
          const pts = []; for (let xx = -30; xx <= 30; xx += 2) pts.push([X(xx), Y(roof(xx))]);
          poly(pts, { color: TH ? C.ink2 : '#CFCEC9', w: 4, alpha: a });
          line(X(-30), Y(roof(-30)), X(-30), Y(0), { color: TH ? C.ink2 : '#CFCEC9', w: 4, alpha: a }); line(X(30), Y(roof(30)), X(30), Y(0), { color: TH ? C.ink2 : '#CFCEC9', w: 4, alpha: a });
          line(X(-34), Y(0), X(34), Y(0), { color: C.faint, w: 2, alpha: a });
          const col = arch ? C.hero : C.comp;
          if (!arch) for (const sx of [-12, 12]) line(X(sx), Y(roof(sx)), X(sx), Y(0), { color: col, w: 4, alpha: a });
          else { const ap = []; for (let xx = -30; xx <= 30; xx += 2) ap.push([X(xx), Y(-17 * (1 - (xx / 30) ** 2) + 0.6)]); poly(ap, { color: col, w: 4, alpha: a }); for (const sx of [-18, -6, 6, 18]) line(X(sx), Y(roof(sx)), X(sx), Y(-17 * (1 - (sx / 30) ** 2) + 0.6), { color: col, w: 2.5, alpha: a }); }
          /* the load path: a pulse from the press to the floor */
          const fx = 0, py0 = roof(0);
          arrow(X(fx), Y(py0) - 44, X(fx), Y(py0) - 6, { color: C.ink, w: 2.5, hs: 9, alpha: a });
          const path = arch ? [[0, py0], [0, -16.4], [-15, -12.8], [-30, 0]] : [[0, py0], [-12, roof(-12)], [-12, 0]];
          const L2 = path.slice(1).reduce((acc2, q, i) => acc2 + Math.hypot(q[0] - path[i][0], q[1] - path[i][1]), 0); let d = p * L2;
          for (let i = 1; i < path.length; i++) { const sl = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); if (d <= sl) { const k = d / sl; circle(X(lerp(path[i - 1][0], path[i][0], k)), Y(lerp(path[i - 1][1], path[i][1], k)), 6, { fill: arch ? C.hero : C.ink2, alpha: a }); break; } d -= sl; }
          dLabel(lab, ox, y + 30, { align: 'center', color: arch ? C.hero : C.ink2, alpha: a, size: 21 });
        });
      }
    });
  }
});
