/* ============================================================================================
   7 · OWNERSHIP. Opening it, fixing it, unboxing it, and the number on it that is yours.
   Main slides: owncard, repair, ownscrew, ownbatt, ownboard, box, serial. Idea sheets: 12-50-own.js.
   Every new top-level name here starts with own_ (chapter code 'own').
   ============================================================================================ */
Object.assign(SRC, {
  ownIfixit: { t: 'iFixit survey of more than 13,200 users, via HotHardware: 93% say repairability matters when they buy; 95% say a successful repair makes them likelier to buy from that maker again', u: 'https://amp.hothardware.com/news/survey-suggests-repairability-of-electronics-gadgets-affects-brand-loyalty', n: 'Self-selected: iFixit\'s own readers, people who already repair.' },
  ownEuBatt: { t: 'European Commission, guidelines on Regulation (EU) 2023/1542 Art. 11 (C/2025/214): from 18 Feb 2027 a portable battery must be removable by the end-user with commercially available tools; specialised tools only if supplied free with the product; no proprietary tools, thermal energy or solvents', u: 'https://eur-lex.europa.eu/eli/C/2025/214/oj/eng' },
  ownJstSh: { t: 'JST SH series (1.0 mm pitch) catalogue: top-entry BM..B-SRSS-TB and side-entry SM..B-SRSS-TB headers; AWG #32 to #28 wire; 1.0 A', u: 'https://www.mouser.com/datasheet/2/564/eSH-3480477.pdf' },
  ownTpuV4: { t: 'TechPowerUp, Razer Viper V4 Pro review: 306 mAh pack on a 3-pin JST plug (per the research pass of 2026-11-03)', u: 'https://www.techpowerup.com/review/razer-viper-v4-pro/' },
  ownB2gSlx: { t: 'Back2Gaming, Finalmouse Starlight X review: 15 graphite-coated titanium screws, about 0.02 g each (about 0.3 g); accessories: a puck receiver and a sleeved USB-A to C cable', u: 'https://www.back2gaming.com/review/finalmouse-starlight-x-nightfall-wireless-mouse/' },
  ownIso7045: { t: 'DIN EN ISO 7045:2011 pan head screw, type H or Z cross recess: M2 head dk 4.0 mm, k 1.6 mm (max)', u: 'https://www.globalfastener.com/standards/detail_5235.html' },
  ownPsV4: { t: 'ProSettings, Razer Viper V4 Pro review (14 Apr 2026): "V3 Pro skate sets will not perfectly fit on the V4 Pro"; in the box: cable, dongle, guides, stickers, precut grip tape; "I do miss a set of replacement mouse feet"', u: 'https://prosettings.net/reviews/razer-viper-v4-pro/' },
  ownLogiBox: { t: 'Logitech, G Pro X Superlight 2 setup guide, package contents: mouse, optional grip tape, receiver in an extension adapter, USB cable, surface preparation cloth, optional POWERPLAY aperture door with PTFE foot', u: 'https://logitech.com/assets/66332/logitech-g-pro-x-superlight-2-lightspeed-gaming-mouse.pdf' },
  ownSoraBox: { t: 'AusModShop, Ninjutso Sora V3 packing list (retailer): 8K receiver, braided cable, PTFE foot pads, HyperSkates dot pads, stickers', u: 'https://ausmodshop.com/products/ninjutso-sora-v3-wireless-gaming-mouse' },
  ownX2Box: { t: 'AusModShop, Pulsar X2 CrazyLight package contents (retailer): 8K dongle, USB-C cable, 16 UHMW-PE 6.6 mm dot skates', u: 'https://ausmodshop.com/products/pulsar-x2-crazylight-wireless-gaming-mouse' },
  ownTrOp1Box: { t: 'TechRadar, Endgame Gear OP1 8K review: "A small screwdriver is included, so you can open up the base and swap out the main button switches"; larger PTFE skates in the box', u: 'https://www.techradar.com/computing/peripherals-accessories/mice/endgame-gear-op1-8k-review' }
});

/* ---------- small drawing helpers ---------- */
/** a card with a Kunai head (mono label left, pills right); returns the y under the head */
function own_card(t, t0, x, y, w, h, label, ev, o = {}) {
  demoWindow(x, y, w, h, ep(t, t0, t0 + 0.4), o.win || {});
  return cardHead(t, t0 + 0.15, x, y, w, label, ev, o);
}
/** a drawn tick (yes) or dash (no); s = size in px */
function own_tick(x, y, s, col, a = 1) { if (a <= 0.003) return; poly([[x - s * 0.45, y], [x - s * 0.12, y + s * 0.33], [x + s * 0.5, y - s * 0.38]], { color: col, w: Math.max(2.5, s * 0.16), alpha: a, cap: 'round' }); }
function own_dash(x, y, s, col, a = 1) { line(x - s * 0.32, y, x + s * 0.32, y, { color: col, w: 2.5, alpha: a, cap: 'round' }); }
/** an idea chip inline, mono caps, faint */
const own_ref = (s, x, y, a, col) => text(s, x, y, { role: 'label', size: 21, color: col || C.faint, alpha: a, align: 'right' });

/* ============================== chapter card ============================== */
S({
  id: 'owncard', ch: 'own', card: true, theme: 'night', title: 'Ownership', settle: 6, three: ['screw'],
  draw: t => {
    chapterCard(t, {
      name: 'Ownership', gloss: 'Built to be opened, fixed and kept, with a number on it that is yours.', list: [
        ['#9 #73', 'One screw type, and the driver for it in the box'],
        ['#71', 'A battery that unplugs, held by two silicone bands'],
        ['#51 #69', 'Twisted wires where others run ribbon cables'],
        ['#54', 'Board screws you reach from below'],
        ['#63', 'Art and a QR code under the board'],
        ['#72 #74', 'An envelope, a trifold and a thin battery cover'],
        ['#13', 'Colourways matched to GMK keycap sets'],
        ['#35 #36', 'Your serial, large, on the right click']
      ]
    });
    /* the chapter's part in the iris: the M2 joint, the screw driving home */
    const cx = 1380, cy = 580, k = ep(t, 0.9, 1.6), drive = t < 8 ? kf(t, [[1.4, 0], [4.4, 0.45]], E.io3) : 0.45 + 0.55 * pingpong(t - 8, 8);
    view3D('screw', t, cx - 330, cy - 370, 660, 680, { view: 'threeQuarter', drive, zoom: 1.2, yaw: 0.35 - 0.25 * ep(t, 0.6, 6), target: [0, 0.2, 0] }, { alpha: k });
    const kl = ep(t, 2.2, 2.6);
    rich([{ s: 'Fig.', role: 'label', size: 21, color: acc() }, { s: 'An M2 machine screw into a brass insert', role: 'small', size: 25, color: C.mute, gap: 14 }], cx, cy + 352, { align: 'center', alpha: kl });
  }
});

/* ============================== made to be opened ============================== */
/** the four things an owner replaces, each with a small drawing and the tool it takes */
function own_partIcon(i, x, y, a, A) {
  if (i === 0) { rr(x - 30, y - 18, 52, 36, 5, TH ? '#E7E6E1' : '#2a2b2e', inkA(0.55), 1.5, a); rect(x + 22, y - 6, 8, 12, { fill: A, alpha: a }); for (const dx of [-14, 6]) rr(x + dx - 4, y - 21, 8, 42, 3, null, A, 2, a); }
  else if (i === 1) drawSwitch(x - 6.4 * 3.6, y + 12, 3.6, { press: 0, alpha: a });
  else if (i === 2) { for (const [dx, dy] of [[-14, -8], [10, -10], [-6, 12], [16, 10]]) { circle(x + dx, y + dy, 8, { fill: TH ? '#FFFFFF' : '#E7E6E1', alpha: a }); circle(x + dx, y + dy, 8, { color: inkA(0.5), w: 1.5, alpha: a }); } }
  else part(x, y, 9, () => screwHeadMM(), { alpha: a });
}
S({
  id: 'repair', ch: 'own', theme: 'paper', title: 'Made to be opened', settle: 10, ideas: ['repair'], three: ['claw'],
  src: ['ownIfixit', 'ikea', 'millmax', 'trOp1'],
  draw: t => {
    header(t, 'Made to be opened');
    captions(t, [[0.6, 'People value a thing they fixed themselves, but only when the fix works. So every part that wears is chosen to come out easily.'], [5.6, 'Each one comes out by hand, or with the one driver that ships in the box.']]);
    const A = acc(), y0 = LAY.top, hh = 690;
    /* A · why: three numbers, each with how we know it */
    const ax = LM, aw = 560;
    let hy = own_card(t, 0.3, ax, y0, aw, hh, 'Why it pays', ['survey', 'study']);
    const rows = [
      { n: '93', u: '%', l: 'say repairability matters when they buy a device', s: 'iFixit, 13,200+ of its readers', ev: 'survey' },
      { n: '95', u: '%', l: 'would buy from a maker again after a repair that worked', s: 'Same survey; self-selected', ev: 'survey' },
      { n: '+63', u: '%', l: 'higher bids for a box people built themselves: the IKEA effect', s: 'Norton, Mochon & Ariely 2012', ev: 'study' }
    ];
    rows.forEach((r, i) => {
      const r0 = hy + 12 + i * 192, t0 = 0.9 + i * 0.5, a = ep(t, t0, t0 + 0.4);
      if (i) line(ax + 26, r0 - 10, ax + aw - 26, r0 - 10, { color: C.hair, w: 1.2, alpha: a });
      rich([{ s: r.n, role: 'd1', size: 80, color: C.ink, tnum: true, count: [t0, 1.0] }, { s: r.u, font: 'mono', size: 30, weight: 600, color: C.mute, gap: 8 }], ax + 26, r0 + 62, { t, alpha: a });
      evDot(ax + aw - 34, r0 + 30, r.ev, 6, a);
      text(r.l, ax + 26, r0 + 100, { role: 'small', color: C.ink2, maxW: aw - 52, lh: 1.3, alpha: a });
      text(r.s, ax + 26, r0 + 168, { role: 'label', size: 21, color: C.faint, alpha: a });
    });
    /* B · the first repair most owners make: a switch, out of its claw socket by hand */
    const bx = ax + aw + 40, bw = 600;
    hy = own_card(t, 0.5, bx, y0, bw, hh, 'A switch comes out by hand', []);
    own_ref('#14, in Clicks', bx + bw - 26, y0 + 46, ep(t, 0.8, 1.2));
    const ins = t < 10 ? kf(t, [[1.6, 0], [3.4, 1]]) : 1 - pingpong(t - 10, 6);
    view3D('claw', t, bx + 20, hy + 6, bw - 40, 420, { view: 'threeQuarter', view2d: 'front', insert: ins, zoom: in2D(1.75, 1.5), yaw: -0.25 + 0.2 * ep(t, 0.6, 8), pitch: -0.12 }, { alpha: ep(t, 0.6, 1.2) });
    const kb = ep(t, 3.6, 4.0);
    text('Mill-Max 3305 claw socket', bx + 26, hy + 470, { role: 'h3', size: 30, color: C.ink, alpha: kb });
    rich([{ s: '1,000', font: 'mono', size: 28, weight: 700, color: C.ink }, { s: 'insertions, minimum', role: 'small', sentence: false, color: C.ink2, gap: 12 }], bx + 26, hy + 516, { alpha: kb });
    pill(bx + bw - 26 - pillW('datasheet'), hy + 516, 'datasheet', kb);
    text('Six beryllium-copper fingers grip the leg: out and back in, no solder.', bx + 26, hy + 560, { role: 'small', color: C.ink2, maxW: bw - 52, lh: 1.32, t, t0: 4.0, cps: 120 });
    /* C · what an owner can change, and the tool it takes */
    const cx = bx + bw + 40, cw = RM - cx;
    hy = own_card(t, 0.7, cx, y0, cw, hh, 'What comes out', ['proposal']);
    const parts = [['Battery', 'Unplug it, slide it out', 'No tool', '#71'], ['Main switches', 'Pull it, push a new one in', 'No tool', '#14'], ['Skates', 'Peel, then fit a spare', 'No tool', 'DXF'], ['Plate and board', 'M2 screws, from below', 'Driver in the box', '#9 #73']];
    parts.forEach((p, i) => {
      const y = hy + 30 + i * 146, t0 = 1.4 + i * 0.35, a = ep(t, t0, t0 + 0.4);
      if (i) line(cx + 26, y - 28, cx + cw - 26, y - 28, { color: C.hair, w: 1.2, alpha: a });
      own_partIcon(i, cx + 60, y + 40, a, A);
      text(p[0], cx + 116, y + 22, { role: 'h3', size: 30, color: C.ink, alpha: a });
      own_ref(p[3], cx + cw - 26, y + 22, a);
      text(p[1], cx + 116, y + 58, { role: 'small', color: C.ink2, maxW: cw - 140, alpha: a });
      const tool = p[2] === 'No tool';
      rich([{ s: p[2], role: 'label', size: 21, color: tool ? C.ink : '#111111', chip: tool ? null : C.hero }], cx + 116, y + 100, { alpha: a });
    });
    source(t, 'iFixit\'s sample is its own readers, people who already repair. The IKEA effect disappeared when the build failed (Norton et al.).', { t0: 5.0 });
  }
});

/* ownscrew, own_insert, own_wear and own_mass (the screw, the insert, thread wear, fastener mass) are in 10-h2-own.js */

/* ============================== #71 a battery that unplugs, held by bands ============================== */
/** the pull on a plug, in section: a top-entry header peels its pads; a side-entry one pulls along them */
function own_plugPull(t, x, y, w, h, A) {
  const k = ep(t, 1.4, 1.9), ph = cyc(t, 0, 4), pull = ph < 0 ? 0 : ph < 0.35 ? E.io3(ph / 0.35) : ph < 0.7 ? 1 : 1 - E.io3((ph - 0.7) / 0.3);
  const half = w / 2;
  [[0, 'Top entry', 'A pull peels the pads up', C.red], [1, 'Side entry', 'A pull runs along the pads', A]].forEach(([i, name, note, col]) => {
    const cx = x + half * i + half / 2, by = y + h - 64, kk = ep(t, 1.4 + i * 0.3, 1.9 + i * 0.3);
    text(name, cx, y + 26, { role: 'label', size: 21, color: C.ink, align: 'center', alpha: kk });
    /* the board */
    rect(cx - 120, by, 240, 14, { fill: TH ? '#2b3a2f' : '#1f2b23', alpha: kk });
    rect(cx - 120, by, 240, 3, { fill: '#c9a227', alpha: kk * 0.9 });
    const nylon = TH ? '#F3F1EA' : '#DCDAD3', edge = inkA(0.55);
    if (i === 0) {
      /* header on top, plug from above; the pull lifts the whole header off its pads */
      const lift = pull * 7 * (0.6 + 0.4 * Math.sin(t * 30) * (pull > 0.9 ? 1 : 0));
      rr(cx - 34, by - 40 - lift * 0.4, 68, 40, 4, nylon, edge, 1.5, kk);
      rr(cx - 26, by - 76 - pull * 20, 52, 48, 4, nylon, edge, 1.5, kk);
      for (const dx of [-12, 0, 12]) line(cx + dx, by - 76 - pull * 20, cx + dx, by - 96 - pull * 20, { color: [C.red, '#222', '#ddd'][(dx + 12) / 12], w: 3, alpha: kk });
      for (const dx of [-30, 30]) { circle(cx + dx, by - 2, 7, { fill: pull > 0.6 ? C.red : '#c9a227', alpha: kk }); }
      arrow(cx + 70, by - 60, cx + 70, by - 130, { color: col, w: 3, hs: 12, alpha: kk * (0.3 + 0.7 * pull) });
    } else {
      /* header lying on the board, opening to the left; plug slides out along the board */
      rr(cx + 6, by - 30, 70, 30, 4, nylon, edge, 1.5, kk);
      rect(cx + 2, by - 16, 8, 16, { fill: '#b9bcc2', alpha: kk });
      rect(cx + 72, by - 16, 8, 16, { fill: '#b9bcc2', alpha: kk });
      const px = cx - 52 - pull * 46;
      rr(px, by - 27, 58, 24, 4, nylon, edge, 1.5, kk);
      for (const dy of [-21, -15, -9]) line(px, by + dy, px - 44, by + dy, { color: [C.red, '#222', '#ddd'][(dy + 21) / 6], w: 3, alpha: kk });
      for (const dx of [6, 76]) circle(cx + dx, by - 2, 7, { fill: A, alpha: kk });
      arrow(px - 50, by - 50, px - 120, by - 50, { color: col, w: 3, hs: 12, alpha: kk * (0.3 + 0.7 * pull) });
    }
    text(note, cx, y + h - 14, { role: 'small', size: 25, color: i ? C.ink : C.red, align: 'center', alpha: kk });
  });
}
S({
  id: 'ownbatt', ch: 'own', theme: 'paper', title: 'A battery that unplugs', settle: 10, ideas: [71, 'bands'], three: ['battery'],
  src: ['ownEuBatt', 'ownJstSh', 'ownTpuV4'],
  draw: t => {
    header(t, 'A battery that unplugs');
    captions(t, [[0.6, 'The cell sits in two silicone bands instead of adhesive, and its plug slides out sideways, along the board.'], [5.4, 'That is also the EU\'s test from February 2027: out with ordinary tools, no heat, no solvent.']]);
    const A = acc(), y0 = LAY.top, h0 = 580;
    const lx = LM, lw0 = 980;
    let hy = own_card(t, 0.3, lx, y0, lw0, h0, 'The cell, the bands, the plug', ['proposal']);
    const ex = t < 11 ? kf(t, [[2.2, 0], [4.2, 1]], E.io3) : 1 - pingpong(t - 11, 8);
    const bst = { view: 'threeQuarter', view2d: 'front', explode: ex, zoom: in2D(1.5, 1.9), yaw: 0.15 - 0.2 * ep(t, 0.5, 4.2), target: in2D([4, 5, 4], [3, 4, 4]) }, bb = [lx + 10, hy - 20, lw0 - 20, h0 - (hy - y0) + 14];
    view3D('battery', t, bb[0], bb[1], bb[2], bb[3], bst, { alpha: ep(t, 0.4, 1.0) });
    const kc = ep(t, 4.4, 4.8);
    if (kc > 0) {
      /* in 2D the drawing is a plan from above: the leaders find the bands, the header and the lead on it */
      const at = (re, f, p) => (V2D.on && v2dAt('battery', bst, bb, re, f)) || p;
      const pB = at(/bands\/band$/, [0.15, 1, 0.5], [470, 432]), pJ = at(/headerShell$/, [0.5, 1, 0.5], [956, 690]), pW = at(/wires\/wire0$/, [0.5, 0.5, 0.5], [762, 662]);
      callout(t, 4.4, pB, 'Two silicone bands, no adhesive', { to: in2D([pB[0] - 50, hy + 76], [560, 384]), side: in2D('l', 'r'), color: C.ink2, tcolor: C.ink, prose: true, maxW: 300 });
      callout(t, 4.7, pJ, 'Side-entry JST SH', { to: in2D([pJ[0] + 40, hy + 76], [930, 812]), side: in2D('r', 'l'), color: C.ink2, tcolor: C.ink });
      callout(t, 5.0, pW, 'Twisted lead (#69)', { to: in2D([pW[0] + 70, y0 + h0 - 70], [610, 770]), side: in2D('r', 'l'), color: C.ink2, tcolor: C.ink });
    }
    /* right top: which way the plug pulls */
    const rx = lx + lw0 + 40, rw = RM - rx, rh1 = 300;
    hy = own_card(t, 0.5, rx, y0, rw, rh1, 'Which way the plug pulls', ['datasheet']);
    own_plugPull(t, rx + 20, hy - 20, rw - 40, rh1 - (hy - y0) + 4, A);
    /* right bottom: the EU rule, row by row */
    const y1 = y0 + rh1 + 20, rh2 = h0 - rh1 - 20;
    hy = own_card(t, 0.7, rx, y1, rw, rh2, 'EU rule from 18 Feb 2027', ['datasheet']);
    const rules = [['Ordinary tools', 'No tool at all'], ['No heat, no solvent', 'No adhesive: two bands'], ['Special tool only if free', 'Driver in the box']];
    rules.forEach(([r, th], i) => {
      const yy = hy + 26 + i * 58, k = ep(t, 5.6 + i * 0.3, 6.0 + i * 0.3);
      text(r, rx + 26, yy, { role: 'small', color: C.ink2, alpha: k });
      own_tick(rx + rw * 0.52, yy - 8, 26, A, k);
      text(th, rx + rw * 0.52 + 30, yy, { role: 'small', weight: 700, color: C.ink, alpha: k });
    });
    gloss(t, 2.8, 'Side-entry header', 'The socket faces sideways, so the plug goes in along the board. A pull runs along the pads instead of peeling them up.');
    featureCard(t, 6.6, 'Two bands, one plug', ['datasheet', 'proposal'], 'Nothing to heat, soften or pry. JST makes the same SH header in top and side entry; the Viper V4 Pro uses a 3-pin JST.');
  }
});

/* ============================== #54 #63 #100 the underside is on show ============================== */
/** where the settled board's features sit on stage (read off the render at t = settle) */
const own_BOARDPT = { qr: [752, 762], sw: [412, 580], gold: [440, 792] };
S({
  id: 'ownboard', ch: 'own', theme: 'night', title: 'The underside is on show', settle: 10, ideas: [63, 54, 100], three: ['pcb'],
  src: ['tpuUlx9', 'webhid'],
  draw: t => {
    header(t, 'The underside is on show');
    captions(t, [[0.6, 'With the bottom plate off, the underside of the board is what you see, so I treat it as a face.'], [5.4, 'The board hangs from the top shell on screws driven from below: it comes out without splitting the shell.']]);
    const A = acc(), y0 = LAY.top, h0 = 690;
    const lx = LM, lw0 = 980;
    let hy = own_card(t, 0.3, lx, y0, lw0, h0, 'The board, from below', ['proposal']);
    /* the camera turns from a low three-quarter to straight up at the board */
    const turn = ep(t, 0.8, 3.6, E.cam);
    view3D('pcb', t, lx + 10, hy - 20, lw0 - 20, h0 - (hy - y0) + 6, { view: 'bottom', zoom: 1.6 + 0.5 * turn, target: [0, 0, 12 * turn], pitch: -0.6 * (1 - turn), yaw: 0.5 * (1 - turn) }, { alpha: ep(t, 0.4, 1.0) });
    const kc = ep(t, 4.0, 4.4);
    if (kc > 0) {
      callout(t, 4.0, own_BOARDPT.qr, 'QR to the web software', { to: [850, 690], side: 'r', color: C.ink2, tcolor: C.ink, maxW: 200 });
      callout(t, 4.3, own_BOARDPT.sw, 'ON and OFF at the switch (#100)', { to: [300, 512], side: 'l', color: C.ink2, tcolor: C.ink, prose: true, maxW: 200 });
      callout(t, 4.6, own_BOARDPT.gold, 'Gold triangles (#63)', { to: [300, 872], side: 'l', color: C.ink2, tcolor: C.ink, prose: true, maxW: 200 });
    }
    /* right top: the screws from below (#54), in section */
    const rx = lx + lw0 + 40, rw = RM - rx, rh1 = 330;
    hy = own_card(t, 0.5, rx, y0, rw, rh1, 'Screws from below (#54)', ['proposal']);
    const k5 = ep(t, 1.2, 1.7), out = t < 9 ? kf(t, [[2.0, 0], [3.2, 1]]) : pingpong(t - 9, 7);
    const o = part(rx + 190, hy + 140, 23, () => insertMM({ k: 1 - out * 0.85, accent: A, hole: C.panel }), { alpha: k5 }) || {};
    if (o.head) {
      const kl = ep(t, 3.0, 3.4);
      const lab = (s2, y, col) => { text(s2, rx + 390, y + 7, { role: 'label', size: 21, color: col, alpha: kl }); line(rx + 340, y, rx + 380, y, { color: C.mute, w: 1.2, alpha: kl }); };
      lab('Top shell', o.boss[1], C.ink); lab('Board', o.plate[1], C.ink); lab('Driver from below', o.head[1] + 40, A);
      arrow(o.head[0] - 40, o.head[1] + 70, o.head[0] - 40, o.head[1] + 12, { color: A, w: 3, hs: 12, alpha: kl });
    }
    /* right bottom: the web software, a step past XPanel */
    const y1 = y0 + rh1 + 20, rh2 = h0 - rh1 - 20;
    hy = own_card(t, 0.7, rx, y1, rw, rh2, 'The web software', ['measured', 'proposal']);
    const cols = [rx + 26, rx + rw * 0.55, rx + rw * 0.8];
    const kh = ep(t, 5.4, 5.8);
    text('XPanel', cols[1], hy + 18, { role: 'label', size: 21, color: C.ink, alpha: kh });
    rich([{ s: 'Theseus', role: 'label', size: 21, color: C.onHero, chip: C.heroChip }], cols[2], hy + 18, { alpha: kh });
    const rows = [['Works without the dongle', 'No', 'Yes'], ['Opens from the board', 'No', 'QR'], ['Updates both ends at once', 'Not stated', 'Yes']];
    rows.forEach((r, i) => {
      const yy = hy + 74 + i * 54, k = ep(t, 5.6 + i * 0.2, 6.0 + i * 0.2);
      line(rx + 26, yy - 38, rx + rw - 26, yy - 38, { color: C.hair, w: 1, alpha: k });
      text(r[0], cols[0], yy, { role: 'small', color: C.ink2, alpha: k });
      text(r[1], cols[1], yy, { font: 'mono', size: 25, weight: 500, color: C.ink2, alpha: k });
      text(r[2], cols[2], yy, { font: 'mono', size: 25, weight: 800, color: C.ink, alpha: k });
    });
    source(t, 'XPanel talks only through the dongle (TechPowerUp, ULX). WebHID runs in Chrome and Edge 89+ only, so other browsers need a download.', { t0: 6.0 });
  }
});

/* ============================== #72 #73 the box ============================== */
/** the envelope opens, the trifold slides out and unfolds into a standing display */
function own_trifold(t, x, y, w, h, A) {
  const k = ep(t, 0.6, 1.2), flap = ep(t, 1.2, 2.0, E.io3), lift = ep(t, 2.0, 2.9, E.cam), open = ep(t, 2.9, 4.2, E.io3);
  const cx = x + w / 2, ey = y + h - 150, ew = Math.min(600, w - 80), eh = 160, pw = 222, ph = 270, ty0 = ey - ph / 2 + 34 - lift * 262;
  const paperC = TH ? '#ffffff' : '#1f2024', envC = TH ? '#e7e6e1' : '#2b2c31';
  rr(cx - ew / 2, ey - eh / 2, ew, eh, 8, envC, inkA(0.25), 1.5, k);
  const face = (x0, x1, yc, fill, draw) => { G.save(); G.globalAlpha = k; G.beginPath(); G.moveTo(x0[0], yc - x0[1] / 2); G.lineTo(x1[0], yc - x1[1] / 2); G.lineTo(x1[0], yc + x1[1] / 2); G.lineTo(x0[0], yc + x0[1] / 2); G.closePath(); G.fillStyle = fill; G.fill(); G.strokeStyle = inkA(0.3); G.lineWidth = 1.5; G.stroke(); G.clip(); if (draw) draw(); G.restore(); };
  const yc = ty0 + ph / 2, sw = open, outerH = ph * (1 - 0.16 * (1 - sw));
  const flapPath = fy => { G.beginPath(); G.moveTo(cx - ew / 2, ey - eh / 2); G.lineTo(cx, fy); G.lineTo(cx + ew / 2, ey - eh / 2); G.closePath(); };
  const fyy = lerp(ey + 24, ey - eh / 2 - 100, flap);
  if (flap >= 0.5) { G.save(); G.globalAlpha = k; flapPath(fyy); G.fillStyle = TH ? '#d9d8d3' : '#25262a'; G.fill(); G.strokeStyle = inkA(0.25); G.lineWidth = 1.5; G.stroke(); G.restore(); }
  G.save(); if (lift < 1) { G.beginPath(); G.rect(x, y, w, ey + eh / 2 - 4 - y); G.clip(); }
  const ca = clamp((open - 0.75) / 0.25);
  /* centre panel: the spares, held in die-cut slots */
  face([cx - pw / 2, ph], [cx + pw / 2, ph], yc, paperC, () => {
    text('Spares', cx, yc - 96, { role: 'label', size: 21, color: A, align: 'center', alpha: k });
    for (let i = 0; i < 8; i++) { const sx = cx - 63 + (i % 4) * 42, sy = yc - 52 + Math.floor(i / 4) * 40; circle(sx, sy, 13, { fill: i < 4 ? (TH ? '#ffffff' : '#E7E6E1') : (TH ? '#F3EFE2' : '#CFC9B8'), alpha: k }); circle(sx, sy, 13, { color: inkA(0.4), w: 1.5, alpha: k }); }
    text('POM, PTFE', cx, yc + 26, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: k });
    rr(cx - 70, yc + 46, 140, 44, 6, inkA(0.08), inkA(0.3), 1.5, k);
    text('Grip tape', cx, yc + 76, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: k });
  });
  if (sw > 0.01) {
    face([cx - pw / 2, ph], [cx - pw / 2 - pw * sw, outerH], yc, paperC, ca > 0 ? () => {
      const lx = cx - pw / 2 - pw * 0.5;
      text('Setup', lx, yc - 96, { role: 'label', size: 21, color: A, align: 'center', alpha: k * ca });
      const qr = rng(42); for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) { const fin = (i < 3 && j < 3) || (i > 5 && j < 3) || (i < 3 && j > 5); if (fin ? !((i % 6 === 1 || i === 1) && (j % 6 === 1 || j === 1)) : qr() < 0.5) rect(lx - 41 + i * 9, yc - 72 + j * 9, 8, 8, { fill: C.ink, alpha: k * ca }); }
      ['Plug in both', 'Then scan'].forEach((l2, i) => text(l2, lx, yc + 52 + i * 36, { role: 'label', size: 21, color: C.ink2, align: 'center', alpha: k * ca }));
    } : null);
    face([cx + pw / 2, ph], [cx + pw / 2 + pw * sw, outerH], yc, paperC, ca > 0 ? () => {
      const rx2 = cx + pw / 2 + pw * 0.5;
      text('Repair', rx2, yc - 96, { role: 'label', size: 21, color: A, align: 'center', alpha: k * ca });
      part(rx2 - 36, yc - 40, 9, () => screwHeadMM(), { alpha: k * ca });
      rr(rx2 + 4, yc - 52, 60, 24, 4, inkA(0.1), inkA(0.4), 1.5, k * ca);
      ['One driver', 'Unplug cell', 'Lift bands'].forEach((l2, i) => text(l2, rx2, yc + 16 + i * 36, { role: 'label', size: 21, color: C.ink2, align: 'center', alpha: k * ca }));
    } : null);
  }
  G.restore();
  /* the envelope's front and its flap, over the trifold until it has slid out */
  G.save(); G.globalAlpha = k;
  G.beginPath(); G.moveTo(cx - ew / 2, ey - eh / 2 + 10); G.lineTo(cx, ey + 16); G.lineTo(cx + ew / 2, ey - eh / 2 + 10); G.lineTo(cx + ew / 2, ey + eh / 2 - 8); G.quadraticCurveTo(cx + ew / 2, ey + eh / 2, cx + ew / 2 - 8, ey + eh / 2); G.lineTo(cx - ew / 2 + 8, ey + eh / 2); G.quadraticCurveTo(cx - ew / 2, ey + eh / 2, cx - ew / 2, ey + eh / 2 - 8); G.closePath();
  G.fillStyle = envC; G.fill(); G.strokeStyle = inkA(0.25); G.lineWidth = 1.5; G.stroke();
  if (flap < 0.5) { flapPath(fyy); G.fillStyle = TH ? '#efeeea' : '#323338'; G.fill(); G.stroke(); }
  G.restore();
}
/** what ships in the box: per mouse, per item. 1 = listed by the source, 0 = not listed, -1 = does not apply */
const own_BOX = {
  items: ['Receiver', 'Cable', 'Grip tape', 'Spare skates', 'Screw driver', 'Repair steps'],
  mice: [
    { name: 'Viper V4 Pro', ev: 'measured', v: [1, 1, 1, 0, 0, 0] },
    { name: 'GPX2', ev: 'datasheet', v: [1, 1, 1, 0, 0, 0] },
    { name: 'Starlight X', ev: 'measured', v: [1, 1, 0, 0, 0, 0] },
    { name: 'Sora V3', ev: 'claim', v: [1, 1, 0, 1, 0, 0] },
    { name: 'X2 CrazyLight', ev: 'claim', v: [1, 1, 0, 1, 0, 0] },
    { name: 'OP1 8K', ev: 'measured', v: [-1, -1, 0, 1, 1, 0], ref: true },
    { name: 'Theseus', ev: 'proposal', v: [1, 1, 1, 1, 1, 1], hero: true }
  ]
};
S({
  id: 'box', ch: 'own', theme: 'paper', title: 'The box is the first thing they open', settle: 10, ideas: [72, 73],
  src: ['ownPsV4', 'ownLogiBox', 'ownB2gSlx', 'ownSoraBox', 'ownX2Box', 'ownTrOp1Box', 'dotcom'],
  draw: t => {
    header(t, 'The box is the first thing they open');
    captions(t, [[0.6, 'An envelope, and in it a trifold: closed it holds the spares, opened it stands up, with setup and repair printed on it.'], [5.4, 'Endgame Gear puts a screwdriver in the OP1 8K box. None of the wireless flagships I checked lists one.']]);
    const A = acc(), y0 = LAY.top, h0 = 580;
    const lx = LM, lw0 = 760;
    own_card(t, 0.3, lx, y0, lw0, h0, 'Envelope and trifold (#72)', ['proposal']);
    own_trifold(t, lx, y0 + 60, lw0, h0 - 60, A);
    text('Paper only: no plastic tray, no foam', lx + lw0 / 2, y0 + h0 - 24, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: ep(t, 4.4, 4.8) });
    /* the table: what ships in the box, a row per mouse */
    const rx = lx + lw0 + 40, rw = RM - rx;
    const hy = own_card(t, 0.5, rx, y0, rw, h0, 'What ships in the box', ['measured', 'claim']);
    const D = own_BOX, nw = 230, ncw = 60, cw = (rw - 52 - nw - ncw) / D.items.length, gx = j => rx + 26 + nw + cw * (j + 0.5), rh = 58, ty = hy + 74;
    D.items.forEach((it, j) => { const a = ep(t, 0.9 + j * 0.08, 1.3 + j * 0.08), words = it.split(' '); words.forEach((wd, wi) => text(wd, gx(j), ty - 30 + wi * 24 - (words.length - 1) * 24 + 12, { role: 'label', size: 19, color: it === 'Screw driver' ? C.ink : C.mute, align: 'center', alpha: a })); });
    text('Of 6', rx + rw - 26, ty - 18, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ep(t, 0.9, 1.3) });
    D.mice.forEach((m, i) => {
      const y = ty + 30 + i * rh, a = ep(t, 1.1 + i * 0.1, 1.5 + i * 0.1);
      line(rx + 26, y - rh / 2 - 2, rx + rw - 26, y - rh / 2 - 2, { color: C.hair, w: 1, alpha: a });
      if (m.hero) { const kk = ep(t, 2.6, 3.0, E.snap); rect(rx + 14, y - rh / 2 + 2, rw - 28, rh - 6, { fill: rgba(C.hero, TH ? 0.14 : 0.1), alpha: kk }); rect(rx + 14, y - rh / 2 + 2, 6, rh - 6, { fill: C.hero, alpha: kk }); }
      if (m.ref) rect(rx + 14, y - rh / 2 + 2, 6, rh - 6, { fill: C.ink, alpha: a });
      evDot(rx + 36, y, m.ev, 5.5, a);
      text(m.name, rx + 54, y + 9, { role: 'small', weight: m.hero || m.ref ? 800 : 500, color: C.ink, alpha: a });
      m.v.forEach((v, j) => {
        const X = gx(j), kk = ep(t, 1.4 + i * 0.1 + j * 0.05, 1.8 + i * 0.1 + j * 0.05);
        if (v === 1) own_tick(X, y, 24, m.hero && !TH ? C.hero : C.ink, kk);
        else if (v === 0) own_dash(X, y, 24, C.faint, kk);
        else text('n/a', X, y + 7, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: kk });
      });
      const n = m.v.filter(v => v === 1).length;
      text(String(n), rx + rw - 26, y + 10, { font: 'mono', size: 28, weight: m.hero ? 800 : 600, color: C.ink, align: 'right', alpha: ep(t, 2.4 + i * 0.06, 2.8 + i * 0.06) });
    });
    gloss(t, 3.0, 'Not listed', 'A dash means the source did not list it, and a review or a retailer page can miss an item. The OP1 8K is wired.');
    featureCard(t, 6.4, 'The driver in the box (#73)', ['measured', 'proposal'], 'The OP1 8K ships a small screwdriver. Mine fits every screw in the mouse, cross or slot, beside POM and PTFE spares.');
  }
});

/* ============================== #36 a number that's yours ============================== */
/** claimed against measured weight: a diverging bar per mouse from 0 %, the gap at its end */
function own_gapRows() {
  const pick = ['scyrox-v8', 'finalmouse-slx', 'keychron-g3', 'ninjutso-sora-v3', 'hitscan-hyperlight', 'ninjutso-sora-v2', 'wlmouse-huan', 'lamzu-maya', 'wlmouse-beast-x', 'razer-viper-v4-pro', 'logitech-gpx2', 'pulsar-x2-crazylight-m'];
  return pick.map(id => { const m = exMouse(id); if (!m) return null; const c = rv(m.weight_claimed_g), me = rv(m.weight_measured_g); if (c == null || me == null) return null; return { name: exShort(m.name).replace('Finalmouse ', '').replace('Logitech ', '').replace('Ninjutso ', '').replace('Hitscan ', '').replace(' (Medium)', ''), c, m: me, g: (me - c) / c * 100 }; }).filter(Boolean).sort((a, b) => b.g - a.g);
}
S({
  id: 'serial', ch: 'own', theme: 'night', title: 'A number that is yours', settle: 10, ideas: [36],
  src: ['exRtings', 'exEloshapes', 'slxB2g', 'ulxComp'],
  draw: t => {
    header(t, 'A number that is yours');
    captions(t, [[0.6, 'Three digits, lasered large on the right click under the clear coat, so you see it and cannot feel it.'], [5.4, 'Each card also carries that unit\'s measured weight. Some weigh up to 12% more than claimed; Razer and Logitech land within 1%.']]);
    const A = acc(), y0 = LAY.top, h0 = 580;
    const lx = LM, lw0 = 820;
    own_card(t, 0.3, lx, y0, lw0, h0, 'Lasered under the clear coat', ['proposal']);
    /* the right click, a patch of it from above, with the serial lasered in */
    const k = ep(t, 0.5, 1.0), px = lx + 40, py = y0 + 80, pw2 = 520, ph2 = 250;
    part(0, 0, 1, () => { solid(() => pathRR(px, py, pw2, ph2, 24), { g: ['#3b3c42', '#2a2b30'], dark: 1 }, [px, py, pw2, ph2], { lw: 1.4 }); G.save(); pathRR(px, py, pw2, ph2, 24); G.clip(); const r = rng(9); G.fillStyle = 'rgba(255,255,255,0.035)'; for (let i = 0; i < 2200; i++) G.fillRect(px + r() * pw2, py + r() * ph2, 1.4, 1.4); G.restore(); }, { alpha: k });
    const lc = t >= 10 ? (t - 10) % 6 : -1, idx = lc >= 0 ? Math.floor((t - 10) / 6) + 1 : 0, sn = i => String(42 + (i % 9)).padStart(3, '0');
    const engr = lc >= 0 ? ep(lc, 0.7, 2.1, E.lin) : ep(t, 1.2, 2.8, E.lin), num = sn(idx);
    G.save(); setFont({ font: 'disp', size: 150, weight: 800 }); G.textAlign = 'center';
    const glyph = (s2, a2) => { G.save(); G.globalAlpha = k * a2; G.fillStyle = 'rgba(236,235,231,0.16)'; G.fillText(s2, px + pw2 / 2, py + 180); G.fillStyle = 'rgba(0,0,0,0.25)'; G.fillText(s2, px + pw2 / 2 + 2, py + 182); G.fillStyle = 'rgba(236,235,231,0.10)'; G.fillText(s2, px + pw2 / 2, py + 180); G.restore(); };
    if (lc >= 0 && lc < 0.6) glyph(sn(idx - 1), 1 - ep(lc, 0, 0.55));
    G.save(); G.beginPath(); G.rect(px, py, pw2 * engr + 1, ph2); G.clip(); glyph(num, 1); G.restore();
    if (engr > 0 && engr < 1) { const ex = px + pw2 * engr, ey = py + 120 + 50 * Math.sin(t * 38); warm(ex, ey, 46, '#ffffff', 0.35); warm(ex, ey, 18, C.hero, 0.9); line(ex, py, ex, py + ph2, { color: C.hero, w: 1.5, alpha: 0.5 }); const rs = rng(Math.floor(t * 30)); for (let i = 0; i < 7; i++) { const ang = -Math.PI / 2 + (rs() - 0.5) * 2.2, d = 6 + rs() * 26; circle(ex + Math.cos(ang) * d, ey + Math.sin(ang) * d, 1.6, { fill: '#ffe7b0', alpha: 0.8 * (1 - d / 34) }); } }
    G.restore();
    keyPlan(t, 1.0, lx + lw0 - 120, y0 + 190, { s: 0.62, hi: 'trigR', label: 'Right click' });
    /* the section: the engraving, filled flush by the clear coat */
    const ks = ep(t, 3.0, 3.4), sx0 = lx + 40, sy0 = y0 + 420;
    part(sx0, sy0, 24, () => {
      solid(() => { G.beginPath(); G.moveTo(0, 0); G.lineTo(7, 0); G.lineTo(7.4, 0.6); G.lineTo(9.6, 0.6); G.lineTo(10, 0); G.lineTo(18, 0); G.lineTo(18, 1.6); G.lineTo(0, 1.6); G.closePath(); }, MT.shell, [0, 0, 18, 1.6], { hatch: true });
      G.beginPath(); G.moveTo(0, 0); G.lineTo(7, 0); G.lineTo(7.4, 0.6); G.lineTo(9.6, 0.6); G.lineTo(10, 0); G.lineTo(18, 0); G.lineTo(18, -0.35); G.lineTo(0, -0.35); G.closePath(); G.fillStyle = 'rgba(200,215,232,0.45)'; G.fill(); G.strokeStyle = inkA(0.5); G.lineWidth = lw(1); G.stroke();
    }, { alpha: ks });
    text('Clear coat fills the engraving flush', sx0 + 18 * 24 + 30, sy0 + 10, { role: 'small', color: C.ink, maxW: 300, lh: 1.3, alpha: ep(t, 3.2, 3.6) });
    text('Section, depth exaggerated', sx0, sy0 + 82, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 3.2, 3.6) });
    /* right: claimed against measured weight */
    const rx = lx + lw0 + 40, rw = RM - rx;
    const hy = own_card(t, 0.5, rx, y0, rw, h0, 'Weighed against claimed', ['measured', 'claim', 'derived']);
    const R = own_gapRows(), x0 = rx + 300, x1 = rx + rw - 120, gmin = -4, gmax = 12, X = g => x0 + (x1 - x0) * (g - gmin) / (gmax - gmin), rh = 31, ty = hy + 30;
    const a0 = ep(t, 1.0, 1.4);
    for (const g of [0, 4, 8, 12]) { line(X(g), ty - 14, X(g), ty + rh * R.length - 12, { color: g ? C.hair : C.mute, w: g ? 1 : 1.5, alpha: a0 }); text((g > 0 ? '+' : '') + g + '%', X(g), ty - 22, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: a0 }); }
    R.forEach((r, i) => {
      const y = ty + 8 + i * rh, kk = ep(t, 1.3 + i * 0.07, 2.1 + i * 0.07, E.snap), a = ep(t, 1.2 + i * 0.07, 1.5 + i * 0.07);
      text(r.name, rx + 26, y + 8, { role: 'small', size: 25, color: C.ink, alpha: a });
      const xa = X(0), xb = X(r.g * kk);
      rect(Math.min(xa, xb), y - 7, Math.abs(xb - xa), 14, { fill: C.comp, alpha: a });
      text((r.g > 0 ? '+' : '') + fmtN(r.g, 1) + '%', r.g >= 0 ? xb + 10 : xa + 10, y + 7, { font: 'mono', size: 21, weight: 700, color: C.ink, alpha: clamp(kk * 1.4 - 0.3) });
    });
    /* Theseus: the card prints the measured weight, so its gap is zero by construction */
    const yT = ty + 8 + R.length * rh + 14, kT = ep(t, 3.0, 3.5);
    heroMark(X(0), yT, 12, kT);
    rich([{ s: 'Theseus', role: 'label', size: 21, color: C.onHero, chip: C.heroChip }], rx + 26, yT + 8, { alpha: kT });
    text('0%: measured, printed', X(0) + 24, yT + 8, { font: 'mono', size: 21, weight: 700, color: C.ink, alpha: kT });
    text('Gap = (measured − claimed) ÷ claimed, RTINGS scale', rx + 26, y0 + h0 - 22, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 3.4, 3.8) });
    gloss(t, 4.0, 'Step further', 'Finalmouse numbered 10,000 ULX Competition units. I put the number on top, where you see it, and print the unit\'s measured weight on its card.');
    featureCard(t, 6.4, 'The serial card', ['measured', 'proposal'], 'Serial and measured weight per unit, to 0.1 g. Excluded: ULX (size tested not stated), MCHOSE L7 Ultra (variant mismatch).');
  }
});
