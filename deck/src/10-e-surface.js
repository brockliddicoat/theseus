/* ============================== surface and details ============================== */
S({
  id: 'surfacecard', ch: 'surface', card: true, theme: 'night', title: 'surface and details', settle: 5,
  draw: t => {
    chapterCard(t, { name: 'surface', gloss: 'what your hand touches, and the small details that make a mouse look finished.', list: [['#16', 'a baked ceramic coating'], ['#60', 'a laser-etched grip texture'], ['#12', 'satin clear over carbon'], ['#34', 'shallower engravings'], ['#32', 'engravings off the trigger centres'], ['#82', 'no visible gate marks'], ['#7', 'a POM scroll wheel axle']] });
    part(1190, 500, 10, () => coatMM({ etch: ep(t, 2.4, 3.4), film: ep(t, 1.2, 2.2, E.io3) }), { alpha: ep(t, 1.0, 1.6) });
    if (t > 3.4) { const ph3 = ((t - 3.4) % 4.5) / 4.5, gx = lerp(1100, 1880, ph3), g3 = G.createLinearGradient(gx - 70, 524, gx + 70, 752); g3.addColorStop(0, 'rgba(255,255,255,0)'); g3.addColorStop(0.5, 'rgba(255,255,255,0.09)'); g3.addColorStop(1, 'rgba(255,255,255,0)'); G.save(); G.beginPath(); G.rect(1192, 524, 598, 228); G.clip(); G.globalCompositeOperation = 'lighter'; G.fillStyle = g3; G.fillRect(1192, 524, 598, 228); G.restore(); }
    figLabel(t, 2.2, 1190, 800, 8, 'ceramic film on carbon-filled plastic, magnified');
  }
});
const GRADES = ['7B', '6B', '5B', '4B', '3B', '2B', 'B', 'HB', 'F', 'H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H'];
S({
  id: 'coating', ch: 'surface', theme: 'paper', title: 'bake the coating', settle: 9, ideas: [16, 12], src: ['cerakoteH', 'cerakoteC', 'cerakoteGuide', 'cerakoteCure', 'radtech'],
  draw: t => {
    header(t, 'bake the coating');
    const wx = LM, wy = 272, ww = 860, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    figLabel(t, 0.6, wx + 28, wy + 44, 8, 'the shell surface, magnified (layers not to scale)');
    const s = 11.5, ox = wx + 85, oy = wy + 150;
    const o = part(ox, oy, s, () => coatMM({ film: ep(t, 0.8, 2.2, E.io3) }), { alpha: ep(t, 0.4, 0.9) });
    /* the pencil test: a lead at 45 degrees dragged across the film */
    const cp = t >= 8.6 ? (t - 8.6) % 7 : -1;
    const pk = cp >= 0 ? ep(cp, 0, 0.4) * (1 - ep(cp, 3.4, 3.8)) : ep(t, 4.0, 4.4) * (1 - ep(t, 7.4, 7.8)), px = cp >= 0 ? lerp(16, 46, ep(cp, 0.4, 2.8, E.io3)) : lerp(16, 46, ep(t, 4.4, 6.8, E.io3));
    G.save(); rrPath(wx, wy, ww, wh, 14); G.clip();
    if (pk > 0) part(ox, oy, s, () => { solid(() => { G.beginPath(); G.moveTo(px - 3, 2.2); G.lineTo(px + 3, 2.2); G.lineTo(px + 21, -15.8); G.lineTo(px + 15, -15.8); G.closePath(); }, { g: ['#4a4b50', '#2a2b2f'], dark: 1 }, [px - 3, -16, 24, 18], { lw: 1 }); G.fillStyle = 'rgba(255,255,255,0.12)'; G.beginPath(); G.moveTo(px - 1.4, 2.2); G.lineTo(px, 2.2); G.lineTo(px + 18, -15.8); G.lineTo(px + 16.6, -15.8); G.closePath(); G.fill(); }, { alpha: pk });
    G.restore();
    if (pk > 0) text('8H at 45°: no mark', Math.max(wx + 300, ox + (px - 4) * s), oy + 0.6 * s, { role: 'label', size: 20, color: A, alpha: pk, align: 'right' });
    callout(t, 1.6, o.film, 'ceramic-filled resin, 23 to 30 µm', { to: [wx + ww - 40, wy + 300], side: 'l', color: A, role: 'small', maxW: 170 });
    callout(t, 2.0, o.iface, 'a blasted surface for the bond', { to: [wx + 490, wy + 470], side: 'r', color: C.ink2, tcolor: C.ink2, role: 'small', maxW: 300 });
    callout(t, 2.3, o.sub, 'carbon-filled polypropylene', { to: [wx + 330, wy + 470], side: 'l', color: C.ink2, tcolor: C.ink2, role: 'small', maxW: 240 });
    text('About 0.35 g per 100 cm²: 0.3 to 0.7 g for a shell (derived).', wx + 28, wy + wh - 24, { role: 'small', size: 22, color: C.mute, t, t0: 2.8, cps: 110, maxW: ww - 220 });
    /* pencil hardness ladder */
    const rx = 990, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('pencil hardness, ASTM D3363', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['datasheet'], ep(t, 1.0, 1.4));
    const gx0 = rx + 250, gw = rw - 290, GX = i => gx0 + gw * i / 17, a0 = ep(t, 1.0, 1.5);
    GRADES.forEach((g, i) => { line(GX(i), wy + 120, GX(i), wy + 380, { color: C.hair, w: 1, alpha: a0 }); if (i % 2 === 0 || i === 17) text(g, GX(i), wy + 404, { role: 'label', color: C.mute, align: 'center', alpha: a0 }); });
    const rows = [['soft-touch rubber', 0, 4, C.red, '7B to 3B'], ['air-cured ceramic', 0, 11, C.gray, '3H'], ['oven-cured ceramic', 0, 16, C.ink, '8H'], ['top grade, oven-cured', 0, 17, A, '9H']];
    rows.forEach(([l, a, b, col, lab], i) => { const y = wy + 150 + i * 62, k = ep(t, 1.4 + i * 0.25, 2.2 + i * 0.25, E.snap); text(l, rx + 28, y + 6, { role: 'label', color: C.ink2, alpha: ep(t, 1.2 + i * 0.25, 1.6 + i * 0.25), maxW: 210 }); rect(GX(a), y - 9, (GX(b) - GX(a)) * k, 18, { fill: col }); glint(GX(a), y - 9, (GX(b) - GX(a)) * k, 18, t, 5 + i * 0.25, 8); text(lab, GX(b) + 10, y + 6, { role: 'label', color: col, alpha: k }); });
    text('soft-touch wore through in 31 to 300+ abrasion cycles, depending on the formulation (RadTech 2016).', rx + 28, wy + 450, { role: 'small', color: C.ink2, t, t0: 3.2, cps: 110, maxW: rw - 56, lh: 1.45 });
    text('same coating family: baked tests five grades harder than air-dried.', rx + 28, wy + 516, { role: 'label', color: A, t, t0: 4.2, cps: 80, maxW: rw - 56 });
    keyPlan(t, 1.0, wx + ww - 80, wy + 380, { s: 0.5, hi: 'shell', label: 'Whole shell' });
    gloss(t, 2.4, 'pencil hardness', 'graded pencils pushed across the film at 45 degrees. the hardest one that leaves no mark is the rating. 9H is the top of the scale.');
    featureCard(t, 5.0, 'a baked ceramic coating', ['datasheet', 'proposal'], 'oven-cured, not air-dried (#16). satin clear over the carbon-filled plastic: black, with the carbon showing in light (#12).');
    captions(t, [[0.6, 'a mouse coating takes sweat, skin oil and thousands of hours of hand contact. soft-touch rubber is the usual finish, and it wears through.'], [3.6, 'a ceramic-filled coating that is baked crosslinks harder. the air-dried version of the same family tests five pencil grades softer.'], [6.6, 'those figures were measured on blasted steel, and plastics cure cooler, so 8H on the shell itself is what we test for.']]);
  }
});
S({
  id: 'grip', ch: 'surface', theme: 'night', title: 'the same grip, dry or sweaty', settle: 9, ideas: [60, 'sides'], src: ['derler'],
  draw: t => {
    header(t, 'the same grip, dry or sweaty');
    const wx = LM, wy = 272, ww = 1000, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    /* after the first pass the hands keep warming and drying, and the chart follows the two fingertips live */
    const live = ep(t, 9.0, 9.6), wet = t < 9 ? ep(t, 2.2, 3.2) : 0.5 + 0.5 * Math.cos((t - 9) * TAU / 8), s = 7.2;
    const L = part(wx + 40, wy + 150, s, () => gripMM({ etch: 0, wet, accent: A }), { alpha: ep(t, 0.4, 0.9) });
    const R = part(wx + 530, wy + 150, s, () => gripMM({ etch: 1, wet, accent: A }), { alpha: ep(t, 0.6, 1.1) });
    text('smooth film', wx + 40, wy + 64, { role: 'label', color: C.ink, t, t0: 0.6, cps: 70 });
    text('laser-etched film', wx + 530, wy + 64, { role: 'label', color: A, t, t0: 0.8, cps: 70 });
    text(wet > 0.5 ? 'Sweat makes a film' : 'Dry: ridges on the film', wx + 40, wy + 238, { role: 'label', size: 20, color: wet > 0.5 ? C.red : C.mute, alpha: ep(t, 1.2, 1.6) });
    text(wet > 0.5 ? 'Sweat drains into the pits' : 'Dry: ridges on the peaks', wx + 530, wy + 238, { role: 'label', size: 20, color: wet > 0.5 ? A : C.mute, alpha: ep(t, 1.2, 1.6) });
    /* measured friction of skin: smooth vs rough, dry vs wet */
    rule(wx + 28, wy + 272, wx + ww - 28, ep(t, 3.2, 3.6));
    text('Fingertip friction, dry and wet', wx + 28, wy + 312, { role: 'label', color: C.ink, t, t0: 3.4, cps: 80 });
    pill(wx + ww - 24 - pillW('study'), wy + 314, 'study', ep(t, 3.6, 4.0));
    const bx0 = wx + 230, bw = ww - 330, BX = v => bx0 + bw * v / 2.4;
    [['smooth, dry', 2.18, C.gray], ['smooth, wet', 0.61, C.red], ['rough, dry', 0.53, C.gray], ['rough, wet', 1.43, A]].forEach(([l, v, col], i) => {
      const y = wy + 346 + i * 40 + (i > 1 ? 14 : 0), k = ep(t, 3.8 + i * 0.2, 4.4 + i * 0.2, E.snap);
      text(l, wx + 28, y + 6, { role: 'label', color: C.ink2, alpha: ep(t, 3.6 + i * 0.2, 4.0 + i * 0.2) });
      rect(bx0, y - 9, (BX(v) - bx0) * k, 18, { fill: col }); glint(bx0, y - 9, (BX(v) - bx0) * k, 18, t, 6 + i * 0.25, 8); text('μ ' + v.toFixed(2), BX(v) + 10, y + 6, { role: 'label', color: col, alpha: k });
    });
    text('Derler & Gerhardt 2012 review: glass, smooth vs rough', wx + ww - 28, wy + wh - 18, { role: 'small', color: C.faint, align: 'right', alpha: ep(t, 4.4, 4.8) });
    /* pinch force to lift */
    const cx = 1130, cw = W - LM - cx;
    demoWindow(cx, wy, cw, wh, ep(t, 0.5, 0.9));
    text('squeeze needed to lift a 35 g mouse', cx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(cx, wy, cw, ['derived'], ep(t, 1.0, 1.4));
    text('per finger, two fingers: N = m g / 2μ', cx + 150, wy + 76, { role: 'small', color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const m = axes(t, { x: cx + 96, y: wy + 120, w: cw - 140, h: 290, xr: [0.25, 2.25], yr: [0, 0.7], xticks: [0.5, 1, 1.5, 2], yticks: [0, 0.2, 0.4, 0.6], xfmt: v => 'μ ' + v, yfmt: v => v.toFixed(1) + ' N', xlabel: 'friction coefficient', t0: 1.0 });
    const pts = []; for (let u = 0.25; u <= 2.25; u += 0.02) pts.push([u, 0.035 * 9.81 / (2 * u)]);
    series(m, pts, { color: A, w: 3, p: ep(t, 1.4, 2.6, E.lin) });
    [[0.61, C.red, 'smooth, wet'], [1.43, A, 'rough, wet']].forEach(([u, col, l], i) => { const k = ep(t, 4.6 + i * 0.3, 5.0 + i * 0.3) * (1 - 0.65 * live), v = 0.035 * 9.81 / (2 * u); circle(m.X(u), m.Y(v), 7, { fill: col, alpha: k }); text(`${l}: ${v.toFixed(2)} N`, m.X(u) + (i ? -12 : 12), m.Y(v) - 14, { role: 'label', size: 20, color: col, align: i ? 'right' : 'left', alpha: k }); });
    if (live > 0) [[lerp(2.18, 0.61, wet), C.red, 'smooth'], [lerp(0.53, 1.43, wet), A, 'etched']].forEach(([u, col, l], i) => {
      const v = 0.035 * 9.81 / (2 * u), X = m.X(u), Y = m.Y(v);
      line(X, Y, X, m.Y(0), { color: col, w: 1.2, dash: [3, 4], alpha: live * 0.6 }); circle(X, Y, 13, { color: col, w: 1.5, alpha: live * 0.35 }); circle(X, Y, 6.5, { fill: col, alpha: live });
      text(`${l} now: ${v.toFixed(2)} N`, cx + cw - 40, wy + 150 + i * 24, { role: 'label', color: col, align: 'right', alpha: live });
    });
    if (live > 0) text(wet > 0.5 ? 'hands warm: wet' : 'hands cool: dry', cx + cw - 40, wy + 206, { role: 'label', color: C.mute, align: 'right', alpha: live });
    text('The sides do the lifting, so the texture goes there first.', cx + 28, wy + 516, { role: 'small', size: 23, weight: 700, color: C.ink, t, t0: 5.4, cps: 70, maxW: cw - 56, lh: 1.3 });
    keyPlan(t, 1.0, wx + ww - 80, wy + 130, { s: 0.45, hi: 'sides', label: 'Sides first' });
    gloss(t, 2.8, 'friction coefficient', 'the sideways force a surface can hold before it slips, divided by how hard you press into it. higher means you squeeze less.');
    featureCard(t, 6.0, 'a laser-etched texture', ['study', 'proposal'], 'etched into the coating (#60), grippier on the sides than on the hump.');
    captions(t, [[0.6, 'on a smooth surface, sweat spreads into a film and the fingertip floats on it. that is when a glossy mouse goes slippery.'], [3.6, 'a texture gives the moisture somewhere to go. in the lab, rough glass was less grippy dry but more than twice as grippy wet.'], [6.4, 'so the point of etching isn\'t maximum grip. it\'s grip that stays closer to the same as your hands warm up.']]);
  }
});
S({
  id: 'details', ch: 'surface', theme: 'paper', title: 'engrave shallow, away from the bend', settle: 9, ideas: [34, 32, 82, 33, 61, 62], src: ['inglis', 'vernier', 'curiosity', 'fracMech'],
  draw: t => {
    header(t, 'engrave shallow, away from the bend');
    const wx = LM, wy = 272, ww = 900, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    figLabel(t, 0.6, wx + 28, wy + 44, 9, 'an engraving in a 1.6 mm wall, under load');
    /* after the first pass the depth keeps sweeping between the two, with the stress readout following */
    const a = t < 9 ? lerp(0.6, 0.3, ep(t, 3.4, 4.6, E.io3)) : lerp(0.3, 0.6, 0.5 - 0.5 * Math.cos((t - 9) * TAU / 8)), rho = 0.15;
    const o = part(wx + 54, wy + 96, 44, () => notchMM({ depth: a, rho, accent: A }), { alpha: ep(t, 0.4, 0.9) });
    for (const dx of [0, 1]) { const x = dx ? wx + 54 + 18 * 44 + 6 : wx + 48; arrow(x + (dx ? 0 : -6), wy + 96 + 35, x + (dx ? 46 : -46), wy + 96 + 35, { color: C.ink, w: 3, hs: 10, alpha: ep(t, 1.0, 1.4) }); }
    const kt = 1 + 2 * Math.sqrt(a / rho);
    text(`depth ${a.toFixed(2)} mm, tip radius ${rho} mm`, wx + 54, wy + 214, { role: 'label', color: C.mute, alpha: ep(t, 1.2, 1.6) });
    text(`Kt = 1 + 2√(a/ρ) = ${kt.toFixed(2)}`, wx + ww - 40, wy + 214, { role: 'h3', size: 30, color: kt > 4.5 ? C.red : A, align: 'right', alpha: ep(t, 1.4, 1.8) });
    const m = axes(t, { x: wx + 110, y: wy + 262, w: ww - 170, h: 190, xr: [0, 0.8], yr: [1, 6], xticks: [0, 0.2, 0.4, 0.6, 0.8], yticks: [1, 2, 3, 4, 5, 6], xfmt: v => v.toFixed(1) + ' mm', yfmt: v => v + '×', xlabel: 'engraving depth, tip radius 0.15 mm', t0: 1.6 });
    const pts = []; for (let d = 0; d <= 0.8; d += 0.01) pts.push([d, 1 + 2 * Math.sqrt(d / rho)]);
    series(m, pts, { color: A, w: 3, p: ep(t, 2.0, 3.0, E.lin) });
    circle(m.X(a), m.Y(kt), 8, { fill: kt > 4.5 ? C.red : A, alpha: ep(t, 3.0, 3.4) });
    text('Half the depth: 23% less peak stress', m.X(0.3) + 14, m.Y(3.83) + 32, { role: 'small', size: 23, weight: 700, color: A, alpha: ep(t, 4.6, 5.0) });
    /* what the eye catches */
    const rx = 1030, rw = W - LM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    text('what the eye catches at 50 cm', rx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(rx, wy, rw, ['study'], ep(t, 1.0, 1.4));
    text('drawn 400× life size', rx + rw - 28, wy + 76, { role: 'small', color: C.faint, align: 'right', alpha: ep(t, 1.2, 1.6) });
    const ex0 = rx + 60, ex1 = rx + rw - 60, ey = wy + 170, k1 = ep(t, 1.6, 2.2), step = 0.012 * 400;
    line(ex0, ey, lerp(ex0, (ex0 + ex1) / 2, k1), ey, { color: C.ink, w: 3 });
    if (k1 >= 1) line((ex0 + ex1) / 2, ey + step, lerp((ex0 + ex1) / 2, ex1, ep(t, 2.2, 2.8)), ey + step, { color: C.ink, w: 3 });
    text('a break in an edge, 0.012 mm: seen', rx + 60, ey + 44, { role: 'label', color: A, alpha: ep(t, 2.6, 3.0) });
    text('vernier acuity: 2 to 5 arcseconds', rx + 60, ey + 68, { role: 'small', color: C.mute, alpha: ep(t, 2.8, 3.2) });
    const d = 0.145 * 400, dk = ep(t, 3.4, 3.9, E.snap);
    circle(rx + 60 + d / 2, wy + 330, d / 2 * dk, { fill: C.ink });
    text('Smallest dot you can see: 0.145 mm', rx + 90 + d, wy + 318, { role: 'small', size: 23, weight: 700, color: C.ink, alpha: dk, maxW: rw - 150 - d });
    text('Acuity: about 60 arcseconds', rx + 90 + d, wy + 352, { role: 'small', size: 21, color: C.mute, alpha: dk });
    text('a gate mark breaks an edge, so it shows at a twelfth of the size detail needs. gates go where no edge runs (#82).', rx + 28, wy + 470, { role: 'label', color: C.ink, t, t0: 4.6, cps: 80, maxW: rw - 56, lh: 1.45 });
    keyPlan(t, 1.0, wx + ww - 70, wy + 118, { s: 0.36, hi: ['trigL', 'trigR'], detail: { x: -13, y: -36, r: 9 }, label: 'Not here' });
    gloss(t, 2.6, 'stress concentration', 'load crowds around the tip of a notch. a sharp, deep notch multiplies the local stress several times over, and that is where cracks start.');
    featureCard(t, 5.4, 'Shallow, off-centre, lasered', ['derived', 'study', 'proposal'], 'Shallower engravings (#34) off the trigger centres (#32), on the sides (#33), lasered per colorway (#61, #62).');
    captions(t, [[0.6, 'an engraving is a notch, and a notch multiplies stress at its tip. Curiosity\'s wheels cracked at exactly those tips.'], [3.4, 'halving the depth at the same tip radius takes the peak from 5 times the average stress to 3.8.'], [5.8, 'and the eye is far more sensitive to a broken edge than to small detail, so gate marks go where no edge runs. making them small doesn\'t hide them.']]);
  }
});
S({
  id: 'wheel', ch: 'surface', theme: 'night', title: 'a wheel that turns the same in a year', settle: 9, ideas: [7, 67, 'six spokes'], src: ['delrin150', 'delrinAF'],
  draw: t => {
    header(t, 'a wheel that turns the same in a year');
    const wx = LM, wy = 272, ww = 980, wh = 568, A = acc();
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    figLabel(t, 0.6, wx + 28, wy + 44, 10, 'the wheel from the front, cut through the axle');
    const rot = t * 0.6;
    const f = part(wx + 300, wy + 300, 14, () => wheelFrontMM({ rot }), { alpha: ep(t, 0.4, 0.9) });
    const sd = part(wx + 770, wy + 270, 9.6, () => wheelSideMM({ rot: rot * 0.5, hiBush: ep(t, 2.6, 3.0) > 0.5 }), { alpha: ep(t, 0.8, 1.3) });
    callout(t, 1.2, f.bush, 'POM bushing', { to: [wx + 560, wy + 120], side: 'r', color: A, role: 'small', sub: 'runs dry, doesn\'t stick (#7)', maxW: 200 });
    callout(t, 1.5, f.encoder, 'Encoder', { to: [wx + 160, wy + 120], side: 'l', color: C.ink2, tcolor: C.ink2 });
    callout(t, 1.8, f.bracket, 'Aligner, held tighter (#67)', { to: [wx + 540, wy + 500], side: 'r', color: A, maxW: 300, prose: true });
    callout(t, 2.2, sd.spoke, 'six spokes', { to: [wx + ww - 40, wy + 430], side: 'l', color: A, role: 'small', sub: 'an even load on a thin rim', maxW: 200 });
    /* wobble at the rim from clearance at the axle */
    const cx = 1110, cw = W - LM - cx;
    demoWindow(cx, wy, cw, wh, ep(t, 0.5, 0.9));
    text('side-to-side play at the rim', cx + 28, wy + 44, { role: 'label', color: C.ink, t, t0: 0.9, cps: 70 });
    cardPills(cx, wy, cw, ['derived'], ep(t, 1.0, 1.4));
    text('Play = clearance × 2R / bushing length', cx + 28, wy + 86, { role: 'small', size: 22, color: C.mute, alpha: ep(t, 1.2, 1.6), maxW: cw - 56 });
    const m = axes(t, { x: cx + 104, y: wy + 120, w: cw - 140, h: 200, xr: [0, 0.08], yr: [0, 0.5], xticks: [0, 0.02, 0.04, 0.06, 0.08], yticks: [0, 0.1, 0.2, 0.3, 0.4, 0.5], xfmt: v => v.toFixed(2), yfmt: v => v.toFixed(1) + ' mm', xlabel: 'Radial clearance, {mm}', t0: 1.0 });
    series(m, [[0, 0], [0.08, 0.08 * 2 * 10.5 / 3.5]], { color: A, w: 3, p: ep(t, 1.4, 2.2, E.lin) });
    for (const c of [0.02, 0.05]) { const k = ep(t, 2.4 + c * 10, 2.8 + c * 10), v = c * 2 * 10.5 / 3.5; circle(m.X(c), m.Y(v), 6, { fill: A, alpha: k }); text(v.toFixed(2) + ' mm', m.X(c) + 10, m.Y(v) - 10, { role: 'label', color: A, alpha: k }); }
    text('POM on steel: μ 0.20 (Delrin 150). PTFE-filled: 0.19 (AF100), so the filled grade buys nothing.', cx + 28, wy + 430, { role: 'small', size: 23, color: C.ink2, t, t0: 3.4, cps: 110, maxW: cw - 56, lh: 1.32 });
    text('0.25% water uptake in 24 h: no swelling.', cx + 28, wy + 530, { role: 'small', size: 23, weight: 700, color: A, t, t0: 4.4, cps: 90, maxW: cw - 56 });
    keyPlan(t, 1.0, wx + 60, wy + 460, { s: 0.6, hi: 'wheel', label: 'wheel' });
    gloss(t, 2.8, 'radial clearance', 'the gap between the axle and the hole it turns in. any gap lets the wheel tilt, and the rim multiplies the tilt.');
    featureCard(t, 5.0, 'a POM axle, a tighter aligner', ['datasheet', 'derived', 'proposal'], 'POM bushing that runs dry (#7), the aligner redesigned and toleranced tighter (#67), six spokes.');
    captions(t, [[0.6, 'a scroll wheel turns on its axle hundreds of thousands of times. if the bearing surface wears or binds, the wheel starts to feel gritty or loose.'], [3.4, 'POM runs dry on steel and barely takes up water, so it keeps turning the same way.'], [5.6, 'and the play you feel at the rim is the clearance at the axle, multiplied. tighten the aligner and the wobble shrinks with it.']]);
  }
});

