/* ============================================================================================
   7 · OWNERSHIP. Opening it, fixing it, unboxing it, and the number on it that is yours.
   Main slides: owncard, repair, ownbatt, ownboard, box, serial (the screw and insert slides are in 10-h2-own.js, the idea
   sheets in 12-50-own.js). Every new top-level name here starts with own_ (chapter code 'own').
   ============================================================================================ */
Object.assign(SRC, {
  ownIfixit: { t: 'iFixit survey of more than 13,200 users, via HotHardware: 93% say repairability matters when they buy; 95% say a successful repair makes them likelier to buy from that maker again', u: 'https://amp.hothardware.com/news/survey-suggests-repairability-of-electronics-gadgets-affects-brand-loyalty', n: 'Self-selected: iFixit\'s own readers, people who already repair.' },
  ownEuBatt: { t: 'European Commission, guidelines on Regulation (EU) 2023/1542 Art. 11 (C/2025/214): from 18 Feb 2027 a portable battery must be removable by the end-user with commercially available tools; specialised tools only if supplied free with the product; no proprietary tools, thermal energy or solvents', u: 'https://eur-lex.europa.eu/eli/C/2025/214/oj/eng' },
  ownJstSh: { t: 'JST SH series (1.0 mm pitch) catalogue: top-entry BM..B-SRSS-TB and side-entry SM..B-SRSS-TB headers; AWG #32 to #28 wire; 1.0 A', u: 'https://www.mouser.com/datasheet/2/564/eSH-3480477.pdf' },
  ownTpuV4: { t: 'TechPowerUp, Razer Viper V4 Pro review: 306 mAh pack on a 3-pin JST plug (per the research pass of 2026-11-03)', u: 'https://www.techpowerup.com/review/razer-viper-v4-pro/' },
  ownB2gSlx: { t: 'Back2Gaming, Finalmouse Starlight X review: 15 graphite-coated titanium screws, about 0.02 g each (about 0.3 g); accessories: a puck receiver and a sleeved USB-A to C cable', u: 'https://www.back2gaming.com/review/finalmouse-starlight-x-nightfall-wireless-mouse/' },
  ownPsV4: { t: 'ProSettings, Razer Viper V4 Pro review (14 Apr 2026): "V3 Pro skate sets will not perfectly fit on the V4 Pro"; in the box: cable, dongle, guides, stickers, precut grip tape; "I do miss a set of replacement mouse feet"', u: 'https://prosettings.net/reviews/razer-viper-v4-pro/' },
  ownLogiBox: { t: 'Logitech, G Pro X Superlight 2 setup guide, package contents: mouse, optional grip tape, receiver in an extension adapter, USB cable, surface preparation cloth, optional POWERPLAY aperture door with PTFE foot', u: 'https://logitech.com/assets/66332/logitech-g-pro-x-superlight-2-lightspeed-gaming-mouse.pdf' },
  ownSoraBox: { t: 'AusModShop, Ninjutso Sora V3 packing list (retailer): 8K receiver, braided cable, PTFE foot pads, HyperSkates dot pads, stickers', u: 'https://ausmodshop.com/products/ninjutso-sora-v3-wireless-gaming-mouse' },
  ownX2Box: { t: 'AusModShop, Pulsar X2 CrazyLight package contents (retailer): 8K dongle, USB-C cable, 16 UHMW-PE 6.6 mm dot skates', u: 'https://ausmodshop.com/products/pulsar-x2-crazylight-wireless-gaming-mouse' },
  ownTrOp1Box: { t: 'TechRadar, Endgame Gear OP1 8K review: "A small screwdriver is included, so you can open up the base and swap out the main button switches"; larger PTFE skates in the box', u: 'https://www.techradar.com/computing/peripherals-accessories/mice/endgame-gear-op1-8k-review' }
});

/* ---------- small drawing helpers ---------- */
/** a drawn tick (yes) or dash (no); s = size in px */
function own_tick(x, y, s, col, a = 1) { if (a <= 0.003) return; poly([[x - s * 0.45, y], [x - s * 0.12, y + s * 0.33], [x + s * 0.5, y - s * 0.38]], { color: col, w: Math.max(2.5, s * 0.16), alpha: a, cap: 'round' }); }
function own_dash(x, y, s, col, a = 1) { line(x - s * 0.32, y, x + s * 0.32, y, { color: col, w: 2.5, alpha: a, cap: 'round' }); }
const OWN_WIRE = ['#B03A2E', '#26272B', '#E4E3DE'];   /* a battery lead's wires: plus, minus, thermistor (material colours) */

/* ============================== chapter card ============================== */
S({
  id: 'owncard', ch: 'own', card: true, theme: 'night', title: 'Ownership', settle: 6, three: ['screw'],
  draw: t => {
    chapterCard(t, {
      name: 'Ownership', gloss: 'Built to be opened, fixed and kept, with a number on it that is yours.', list: [
        ['#9', 'One titanium M2 screw, Phillips or flat blade'], ['#101', 'Brass heat-set inserts: the same joint every time'],
        ['#71', 'A battery that unplugs, held by two silicone bands'], ['#54', 'Board screws you reach from below'],
        ['#63', 'Art and a QR code under the board'], ['#72 #73', 'A trifold box, and the driver in it'],
        ['#13', 'Colourways matched to GMK keycap sets'], ['#36', 'Your serial, large, on the right click']
      ]
    });
    /* the chapter's part in the iris: the M2 joint, the screw driving home into its insert */
    const cx = 1380, cy = 580, k = ep(t, 0.9, 1.6), drive = t < 8 ? kf(t, [[1.4, 0], [4.4, 0.45]], E.io3) : 0.45 + 0.55 * pingpong(t - 8, 8);
    if (V2D.on) {
      const tip = 4.0 * clamp(kf(t, [[1.4, 0], [4.4, 1]], E.io3) - (t > 8 ? 0.6 * pingpong(t - 8, 8) : 0));
      G.save(); G.beginPath(); G.arc(cx, cy, 392, 0, TAU); G.clip();
      part(cx, cy + 40, 56, () => own_jointMM({ kind: 'insert', tip, bit: { a: 1, turn: t * 0.9 }, hole: C.bg }), { alpha: k });
      G.restore();
    } else view3D('screw', t, cx - 330, cy - 370, 660, 680, { view: 'threeQuarter', drive, zoom: 1.2, yaw: 0.35 - 0.25 * ep(t, 0.6, 6), target: [0, 0.2, 0] }, { alpha: k });
    figLabel(t, 2.2, 1130, 960, 15, 'A titanium M2 screw in a brass heat-set insert');
  }
});

/* ============================== repairability ============================== */
/** the four things an owner replaces, each with a small drawing and the tool it takes */
function own_partIcon(i, x, y, a) {
  if (i === 0) { rr(x - 30, y - 18, 52, 36, 5, TH ? '#D6D5D0' : '#2a2b2e', inkA(0.55), 1.5, a); rect(x + 22, y - 6, 8, 12, { fill: inkA(0.6), alpha: a }); for (const dx of [-14, 6]) rr(x + dx - 4, y - 21, 8, 42, 3, null, C.ink2, 2, a); }
  else if (i === 1) drawSwitch(x - 6.4 * 3.6, y + 12, 3.6, { press: 0, alpha: a });
  else if (i === 2) { for (const [dx, dy] of [[-14, -8], [10, -10], [-6, 12], [16, 10]]) { circle(x + dx, y + dy, 8, { fill: TH ? '#FFFFFF' : '#E7E6E1', alpha: a }); circle(x + dx, y + dy, 8, { color: inkA(0.5), w: 1.5, alpha: a }); } }
  else part(x, y, 9.5, () => own_headTopMM({}), { alpha: a });
}
S({
  id: 'repair', ch: 'own', theme: 'paper', title: 'Repairability: made to be opened', settle: 10, ideas: ['repair', 14], three: ['claw'],
  src: ['ownIfixit', 'ikea', 'millmax'],
  draw: t => {
    header(t, 'Repairability: made to be opened');
    captions(t, [[0.6, 'People value a thing they fixed themselves, when the fix works. So every part that wears comes out by hand or with one driver.'], [5.6, 'The main switches sit in claw sockets: pull one, push a new one in, no solder. That is a thousand swaps, at the least.']]);
    /* left: the glance */
    own_ba(t, 1.0, LM, 470, null, '1,000', { unit: 'swaps', sa: 150, label: 'A main switch, pulled and replaced', net: 'Mill-Max\'s minimum for the claw socket. A soldered switch takes an iron every time.' });
    const cell = bento(LM, 680, 520, 280, 2, 1);
    statTile(t, 1.8, cell(0, 0), { value: '93', unit: '%', label: 'Say it matters', ev: 'measured', by: 'iFixit survey', quiet: true });
    statTile(t, 1.95, cell(1, 0), { value: '95', unit: '%', label: 'Buy again', ev: 'measured', by: 'iFixit survey', quiet: true });
    /* middle: the switch out of its claw socket */
    const bx = 680, by = 280, bw = 600, bh = 680;
    demoWindow(bx, by, bw, bh, tileA(t, 0.3, 0));
    cardHead(t, 0.5, bx, by, bw, 'Out by hand', [{ ev: 'datasheet', by: 'Mill-Max' }]);
    const ins = t < 10 ? kf(t, [[1.6, 0], [3.4, 1]]) : 1 - pingpong(t - 10, 6);
    view3D('claw', t, bx + 20, by + 70, bw - 40, 430, { view: 'threeQuarter', view2d: 'front', insert: ins, zoom: in2D(1.75, 1.5), yaw: -0.25 + 0.2 * ep(t, 0.6, 8), pitch: -0.12 }, { alpha: ep(t, 0.6, 1.2) });
    const kb = ep(t, 3.6, 4.0);
    text('Mill-Max 3305 claw socket', bx + 32, by + 560, { role: 'h3', size: 30, color: C.ink, alpha: kb });
    text('Six beryllium-copper fingers grip each leg: out and back in, no solder (#14, in Clicks).', bx + 32, by + 604, { role: 'small', color: C.ink2, maxW: bw - 64, lh: 1.32, t, t0: 4.0, cps: 120 });
    /* right: what an owner can change, and the tool it takes */
    const cx = 1320, cw = RM - cx;
    demoWindow(cx, by, cw, bh, tileA(t, 0.4, 1));
    cardHead(t, 0.6, cx, by, cw, 'What comes out, and the tool', []);
    const parts = [['Battery', 'Unplug it, slide it out', 'No tool'], ['Main switches', 'Pull it, push a new one in', 'No tool'], ['Skates', 'Peel, then fit a spare', 'No tool'], ['Plate and board', 'M2 screws, from below', 'The driver in the box']];
    parts.forEach((p, i) => {
      const y = by + 130 + i * 136, t0 = 1.4 + i * 0.35, a = ep(t, t0, t0 + 0.4);
      if (i) line(cx + 32, y - 46, cx + cw - 32, y - 46, { color: C.hair, w: 1.2, alpha: a });
      own_partIcon(i, cx + 70, y + 8, a);
      text(p[0], cx + 128, y, { role: 'h3', size: 30, color: C.ink, alpha: a });
      text(p[1], cx + 128, y + 36, { role: 'small', color: C.ink2, maxW: cw - 160, alpha: a });
      text(p[2], cx + 128, y + 72, { role: 'label', size: 21, color: C.heroText, alpha: a });
    });
    source(t, 'iFixit survey of 13,200+ of its own readers, people who already repair. Norton, Mochon & Ariely 2012 (the IKEA effect): bids 63 % higher for a box people built themselves.', { t0: 5.0 });
  }
});

/* ============================== #71 a battery that unplugs, held by bands ============================== */
/** the pull on a plug, in section: a top-entry header peels its pads; a side-entry one pulls along them */
function own_plugPull(t, x, y, w, h) {
  const ph = cyc(t, 1.4, 4), pull = ph < 0 ? 0 : ph < 0.35 ? E.io3(ph / 0.35) : ph < 0.7 ? 1 : 1 - E.io3((ph - 0.7) / 0.3);
  const half = w / 2;
  [[0, 'Top entry', 'A pull peels the pads up', C.bad], [1, 'Side entry: Theseus', 'A pull runs along the pads', C.hero]].forEach(([i, name, note, col]) => {
    const cx = x + half * i + half / 2, by = y + h - 70, kk = ep(t, 1.4 + i * 0.3, 1.9 + i * 0.3);
    text(name, cx, y + 30, { role: 'label', size: 21, color: i ? C.heroText : C.ink, align: 'center', alpha: kk });
    rect(cx - 120, by, 240, 14, { fill: TH ? '#2b3a2f' : '#1f2b23', alpha: kk });
    rect(cx - 120, by, 240, 3, { fill: '#c9a227', alpha: kk * 0.9 });
    const nylon = TH ? '#F3F1EA' : '#DCDAD3', edge = inkA(0.55);
    if (i === 0) {
      const lift = pull * 7 * (0.6 + 0.4 * Math.sin(t * 30) * (pull > 0.9 ? 1 : 0));
      rr(cx - 34, by - 40 - lift * 0.4, 68, 40, 4, nylon, edge, 1.5, kk);
      rr(cx - 26, by - 76 - pull * 20, 52, 48, 4, nylon, edge, 1.5, kk);
      [-12, 0, 12].forEach((dx, j) => line(cx + dx, by - 76 - pull * 20, cx + dx, by - 96 - pull * 20, { color: OWN_WIRE[j], w: 3, alpha: kk }));
      for (const dx of [-30, 30]) circle(cx + dx, by - 2, 7, { fill: pull > 0.6 ? C.bad : '#c9a227', alpha: kk });
      arrow(cx + 70, by - 60, cx + 70, by - 130, { color: col, w: 3, hs: 12, alpha: kk * (0.3 + 0.7 * pull) });
    } else {
      rr(cx + 6, by - 30, 70, 30, 4, nylon, edge, 1.5, kk);
      rect(cx + 2, by - 16, 8, 16, { fill: '#b9bcc2', alpha: kk }); rect(cx + 72, by - 16, 8, 16, { fill: '#b9bcc2', alpha: kk });
      const px = cx - 52 - pull * 46;
      rr(px, by - 27, 58, 24, 4, nylon, edge, 1.5, kk);
      [-21, -15, -9].forEach((dy, j) => line(px, by + dy, px - 44, by + dy, { color: OWN_WIRE[j], w: 3, alpha: kk }));
      for (const dx of [6, 76]) circle(cx + dx, by - 2, 7, { fill: '#c9a227', alpha: kk });
      arrow(px - 50, by - 50, px - 120, by - 50, { color: col, w: 3, hs: 12, alpha: kk * (0.3 + 0.7 * pull) });
    }
    text(note, cx, y + h - 18, { role: 'small', size: 25, weight: 700, color: i ? C.heroText : C.bad, align: 'center', alpha: kk });
  });
}
S({
  id: 'ownbatt', ch: 'own', theme: 'paper', title: 'Side-entry battery plug', settle: 10, ideas: [71, 'bands'], three: ['battery'],
  src: ['ownEuBatt', 'ownJstSh', 'ownTpuV4'],
  draw: t => {
    header(t, 'Side-entry battery plug');
    captions(t, [[0.6, 'The battery sits in two silicone bands instead of adhesive, and its plug slides out sideways, along the board.'], [5.4, 'That already passes the EU\'s rule for February 2027: out with ordinary tools, no heat, no solvent. Here, no tool at all.']]);
    /* left: the cell, the bands, the plug */
    const lx = LM, y0 = 280, lw0 = 1040, h0 = 680;
    demoWindow(lx, y0, lw0, h0, tileA(t, 0.15, 0));
    cardHead(t, 0.35, lx, y0, lw0, 'The battery, the bands, the plug', []);
    const ex = t < 11 ? kf(t, [[2.2, 0], [4.2, 1]], E.io3) : 1 - pingpong(t - 11, 8);
    const bst = { view: 'threeQuarter', view2d: 'front', explode: ex, zoom: in2D(2.3, 1.9), yaw: 0.15 - 0.2 * ep(t, 0.5, 4.2), target: in2D([4, 5, 4], [3, 4, 4]) }, bb = [lx + 20, y0 + 60, lw0 - 40, 500];
    view3D('battery', t, bb[0], bb[1], bb[2], bb[3], bst, { alpha: ep(t, 0.4, 1.0) });
    const kc = ep(t, 4.4, 4.8);
    if (kc > 0) {
      const at = (re, f, p) => (V2D.on && v2dAt('battery', bst, bb, re, f)) || p;
      const pB = at(/bands\/band$/, [0.15, 1, 0.5], [470, 432]), pJ = at(/headerShell$/, [0.5, 1, 0.5], [956, 690]), pW = at(/wires\/wire0$/, [0.5, 0.5, 0.5], [762, 662]);
      const lab = (p, s2, dx, ty, t0) => callout(t, t0, p, s2, { to: [clamp(p[0] + dx, lx + 300, lx + lw0 - 320), ty], color: C.ink2, tcolor: C.ink, prose: true, maxW: 280 });
      lab(pB, 'Two silicone bands, no adhesive', -60, y0 + 620, 4.4); lab(pJ, 'Side-entry JST SH', 40, y0 + 590, 4.7); lab(pW, 'Twisted lead (#69)', 60, y0 + 650, 5.0);
    }
    /* right: the glance, the EU rule, and which way the plug pulls */
    const rx = lx + lw0 + 40, rw = RM - rx;
    own_ba(t, 1.0, rx, 440, null, '0', { unit: 'tools', sa: 150, label: 'To change the battery', net: 'Unplug it and lift it out of its bands.' });
    const rules = [['Ordinary tools only', 'No tool at all'], ['No heat, no solvent', 'Bands, not glue'], ['Special tools only if free', 'The driver is in the box']];
    text('EU battery rule, from 18 Feb 2027', rx, 572, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 2.0, 2.4) });
    rules.forEach(([r, th], i) => {
      const yy = 618 + i * 46, k = ep(t, 2.2 + i * 0.25, 2.6 + i * 0.25);
      text(r, rx, yy, { role: 'small', color: C.ink2, alpha: k });
      own_tick(rx + rw * 0.52, yy - 8, 26, C.hero, k);
      text(th, rx + rw * 0.52 + 30, yy, { role: 'small', weight: 700, color: C.ink, alpha: k });
    });
    const py = 740;
    demoWindow(rx, py, rw, 220, tileA(t, 1.2, 0));
    own_plugPull(t, rx + 10, py + 4, rw - 20, 216);
    source(t, 'EU Regulation 2023/1542, Art. 11 guidelines (C/2025/214). JST SH headers come in top and side entry. The Viper V4 Pro\'s pack plugs into a 3-pin JST (TechPowerUp).', { t0: 6.0 });
  }
});

/* ============================== #54 #63 #100 screws from below, art on the board ============================== */
/** where the settled board's features sit on stage (read off the render at t = settle) */
const own_BOARDPT = { qr: [752, 762], sw: [412, 580], gold: [440, 792] };
S({
  id: 'ownboard', ch: 'own', theme: 'night', title: 'Screws from below, art on the board', settle: 10, ideas: [54, 63, 100], three: ['pcb'],
  src: ['tpuUlx9', 'webhid'],
  draw: t => {
    header(t, 'Screws from below, art on the board');
    captions(t, [[0.6, 'With the bottom plate off, the underside of the board is what you see, so it is treated as a face.'], [5.4, 'The board hangs from the top shell on screws driven from below: it comes out without splitting the shell.']]);
    const lx = LM, y0 = 280, lw0 = 1000, h0 = 680;
    demoWindow(lx, y0, lw0, h0, tileA(t, 0.15, 0));
    cardHead(t, 0.35, lx, y0, lw0, 'The board, from below', []);
    const turn = ep(t, 0.8, 3.6, E.cam);
    view3D('pcb', t, lx + 10, y0 + 50, lw0 - 20, h0 - 60, { view: 'bottom', zoom: 1.6 + 0.5 * turn, target: [0, 0, 12 * turn], pitch: -0.6 * (1 - turn), yaw: 0.5 * (1 - turn) }, { alpha: ep(t, 0.4, 1.0) });
    if (ep(t, 4.0, 4.4) > 0) {
      callout(t, 4.0, own_BOARDPT.qr, 'QR to the web software', { to: [850, 690], side: 'r', color: C.ink2, tcolor: C.ink, maxW: 200 });
      callout(t, 4.3, own_BOARDPT.sw, 'ON and OFF at the switch (#100)', { to: [300, 512], side: 'l', color: C.ink2, tcolor: C.ink, prose: true, maxW: 200 });
      callout(t, 4.6, own_BOARDPT.gold, 'Gold triangles (#63)', { to: [300, 872], side: 'l', color: C.ink2, tcolor: C.ink, prose: true, maxW: 200 });
    }
    /* right top: the screws from below (#54), the joint turned over: shell boss above, board, head below */
    const rx = lx + lw0 + 40, rw = RM - rx, rh1 = 360;
    demoWindow(rx, y0, rw, rh1, tileA(t, 0.3, 1));
    cardHead(t, 0.5, rx, y0, rw, 'Screws from below (#54)', []);
    const k5 = ep(t, 1.2, 1.7), tip = 4.0 * (t < 9 ? kf(t, [[2.0, 0], [3.6, 1]]) : 1 - 0.5 * pingpong(t - 9, 7));
    const o = part(rx + 200, y0 + 196, 24, () => own_jointMM({ kind: 'insert', tip, bit: { a: 1, turn: t }, hole: C.panel, crop: 4.0 }), { alpha: k5, rot: Math.PI }) || {};
    if (o.bossTop) {
      const kl = ep(t, 3.0, 3.4), lab = (s2, y, col) => { text(s2, rx + 380, y + 7, { role: 'label', size: 21, color: col, alpha: kl }); line(rx + 336, y, rx + 370, y, { color: C.mute, w: 1.2, alpha: kl }); };
      lab('Shell boss, insert', y0 + 140, C.ink); lab('Board', y0 + 214, C.ink); lab('Driver from below', y0 + 300, C.heroText);
    }
    /* right bottom: the web software, a step past XPanel */
    const y1 = y0 + rh1 + 40, rh2 = h0 - rh1 - 40;
    demoWindow(rx, y1, rw, rh2, tileA(t, 0.45, 2));
    cardHead(t, 0.65, rx, y1, rw, 'The web software', [{ ev: 'measured', by: 'TechPowerUp' }]);
    own_ticks(t, 5.4, rx + 32, y1 + 104, rw - 64, ['XPanel', 'Theseus'], [['Works without the dongle', false, true], ['Opens from the board', false, true], ['Updates both ends at once', false, true]], { cw: 130, rh: 48 });
    source(t, 'XPanel talks only through the dongle (TechPowerUp, ULX). WebHID runs in Chrome and Edge 89 and later; other browsers need a download. Theseus\'s software: the plan.', { t0: 6.0 });
  }
});

/* ============================== #72 #73 the box ============================== */
/** the envelope opens, the trifold slides out and unfolds into a standing display */
function own_trifold(t, x, y, w, h) {
  const A = C.heroText, k = ep(t, 0.6, 1.2), flap = ep(t, 1.2, 2.0, E.io3), lift = ep(t, 2.0, 2.9, E.cam), open = ep(t, 2.9, 4.2, E.io3);
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
  face([cx - pw / 2, ph], [cx + pw / 2, ph], yc, paperC, () => {
    text('Spares', cx, yc - 96, { role: 'label', size: 21, color: A, align: 'center', alpha: k });
    for (let i = 0; i < 8; i++) { const sx = cx - 63 + (i % 4) * 42, sy = yc - 52 + Math.floor(i / 4) * 40; circle(sx, sy, 13, { fill: i < 4 ? (TH ? '#ffffff' : '#E7E6E1') : (TH ? '#F1F0EC' : '#CFCEC9'), alpha: k }); circle(sx, sy, 13, { color: inkA(0.4), w: 1.5, alpha: k }); }
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
      part(rx2 - 36, yc - 40, 9.5, () => own_headTopMM({}), { alpha: k * ca });
      rr(rx2 + 4, yc - 52, 60, 24, 4, inkA(0.1), inkA(0.4), 1.5, k * ca);
      ['One driver', 'Unplug battery', 'Lift bands'].forEach((l2, i) => text(l2, rx2, yc + 16 + i * 36, { role: 'label', size: 21, color: C.ink2, align: 'center', alpha: k * ca }));
    } : null);
  }
  G.restore();
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
    { name: 'OP1 8K', ev: 'measured', v: [-1, -1, 0, 1, 1, 0] },
    { name: 'Theseus', ev: 'proposal', v: [1, 1, 1, 1, 1, 1], hero: true }
  ]
};
S({
  id: 'box', ch: 'own', theme: 'paper', title: 'A trifold box, with the driver', settle: 10, ideas: [72, 73],
  src: ['ownPsV4', 'ownLogiBox', 'ownB2gSlx', 'ownSoraBox', 'ownX2Box', 'ownTrOp1Box'],
  draw: t => {
    header(t, 'A trifold box, with the driver');
    captions(t, [[0.6, 'An envelope, and in it a trifold: closed it holds the spares, opened it stands up with setup and repair printed on it.'], [5.4, 'Endgame Gear puts a screwdriver in the OP1 8K box. None of the wireless flagships checked here lists one.']]);
    /* left: the table, led by the glance */
    const D = own_BOX, lx = LM, lw0 = 1000, y0 = 280, h0 = 680;
    /* the next best is whoever lists the most: four mice tie at 3 of 6; the OP1 8K is the one with a driver, at 2 of the 4 that
       apply to a wired mouse. The tied totals are yellow, the next best's colour */
    const cnt = m => m.v.filter(v => v === 1).length, nb = Math.max(...D.mice.filter(m => !m.hero).map(cnt)), nTie = D.mice.filter(m => !m.hero && cnt(m) === nb).length;
    own_ba(t, 0.8, lx, 420, nb + ' of 6', '6 of 6', { sb: 66, sa: 126, label: 'What ships in the box', net: 'Next best: ' + nb + ' of 6, ' + (['', 'one mouse', 'two mice', 'three mice', 'four mice', 'five mice'][nTie] || nTie + ' mice') + '. Only the wired OP1 8K adds a driver' });
    const ty = 600;
    demoWindow(lx, 540, lw0, 400, tileA(t, 0.3, 0));
    const nw = 230, cw = (lw0 - 64 - nw - 60) / D.items.length, gx = j => lx + 32 + nw + cw * (j + 0.5), rh = 46;
    D.items.forEach((it, j) => { const a = ep(t, 0.9 + j * 0.08, 1.3 + j * 0.08); text(it, gx(j), ty - 12, { role: 'label', size: 19, color: it === 'Screw driver' ? C.ink : C.mute, align: 'center', alpha: a, maxW: cw - 6 }); });
    D.mice.forEach((m, i) => {
      const y = ty + 30 + i * rh, a = ep(t, 1.1 + i * 0.1, 1.5 + i * 0.1);
      if (i) line(lx + 32, y - rh / 2 - 2, lx + lw0 - 32, y - rh / 2 - 2, { color: C.hair, w: 1, alpha: a });
      if (m.hero) rect(lx + 20, y - rh / 2 + 1, lw0 - 40, rh - 4, { fill: C.heroSoft, alpha: ep(t, 2.6, 3.0, E.snap) });
      text(m.name, lx + 40, y + 8, { role: 'small', weight: m.hero || m.ref ? 800 : 600, color: m.hero ? C.heroText : m.ref ? C.secondText : C.ink, alpha: a });
      m.v.forEach((v, j) => {
        const X = gx(j), kk = ep(t, 1.4 + i * 0.1 + j * 0.05, 1.8 + i * 0.1 + j * 0.05);
        if (v === 1) own_tick(X, y, 22, m.hero ? C.hero : C.ink2, kk); else if (v === 0) own_dash(X, y, 22, C.faint, kk);
        else text('n/a', X, y + 7, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: kk });
      });
      const n = cnt(m);
      text(String(n), lx + lw0 - 40, y + 10, { font: 'disp', size: 30, weight: 800, color: m.hero ? C.heroText : n === nb ? C.secondText : C.ink2, align: 'right', alpha: ep(t, 2.4 + i * 0.06, 2.8 + i * 0.06) });
    });
    /* right: the envelope and the trifold */
    const rx = lx + lw0 + 40, rw = RM - rx;
    demoWindow(rx, y0, rw, h0, tileA(t, 0.2, 1));
    cardHead(t, 0.4, rx, y0, rw, 'Envelope and trifold (#72)', []);
    own_trifold(t, rx, y0 + 90, rw, h0 - 90);
    text('Paper only: no plastic tray, no foam', rx + rw / 2, y0 + h0 - 30, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: ep(t, 4.4, 4.8) });
    source(t, 'Box lists: setup guides, reviews and retailer pages; a dash: the source did not list it. Theseus\'s driver fits every screw in it, cross or slot (#73).', { t0: 3.0, maxW: 1760 });
  }
});

/* ============================== #36 a number that's yours ============================== */
/** claimed against measured weight: a bar per mouse from 0 %, the gap at its end */
function own_gapRows() {
  const pick = ['scyrox-v8', 'finalmouse-slx', 'keychron-g3', 'ninjutso-sora-v3', 'hitscan-hyperlight', 'ninjutso-sora-v2', 'wlmouse-huan', 'lamzu-maya', 'wlmouse-beast-x', 'razer-viper-v4-pro', 'logitech-gpx2', 'pulsar-x2-crazylight-m'];
  return pick.map(id => { const m = exMouse(id); if (!m) return null; const c = rv(m.weight_claimed_g), me = rv(m.weight_measured_g); if (c == null || me == null) return null; return { name: exShort(m.name).replace('Finalmouse ', '').replace('Logitech ', '').replace('Ninjutso ', '').replace('Hitscan ', '').replace(' (Medium)', ''), c, m: me, g: (me - c) / c * 100 }; }).filter(Boolean).sort((a, b) => b.g - a.g);
}
S({
  id: 'serial', ch: 'own', theme: 'night', title: 'A serial on the right click', settle: 10, ideas: [36],
  src: ['exRtings', 'exEloshapes', 'slxB2g', 'ulxComp'],
  draw: t => {
    header(t, 'A serial on the right click');
    captions(t, [[0.6, 'Three digits, lasered large on the right click under the clear coat, so you see it and cannot feel it.'], [5.4, 'Each card carries that unit\'s measured weight. Some mice weigh up to 12 % more than claimed; a Theseus card cannot.']]);
    const R = own_gapRows(), worst = R.length ? R[0].g : 0;
    /* left: the right click, lasered */
    const lx = LM, y0 = 280, lw0 = 760, h0 = 680;
    demoWindow(lx, y0, lw0, h0, tileA(t, 0.15, 0));
    cardHead(t, 0.35, lx, y0, lw0, 'Lasered under the clear coat', []);
    const k = ep(t, 0.5, 1.0), px = lx + 40, py = y0 + 90, pw2 = 520, ph2 = 250;
    part(0, 0, 1, () => { solid(() => pathRR(px, py, pw2, ph2, 24), { g: ['#3b3c42', '#2a2b30'], dark: 1 }, [px, py, pw2, ph2], { lw: 1.4 }); G.save(); pathRR(px, py, pw2, ph2, 24); G.clip(); const r = rng(9); G.fillStyle = 'rgba(255,255,255,0.035)'; for (let i = 0; i < 2200; i++) G.fillRect(px + r() * pw2, py + r() * ph2, 1.4, 1.4); G.restore(); }, { alpha: k });
    const lc = t >= 10 ? (t - 10) % 6 : -1, idx = lc >= 0 ? Math.floor((t - 10) / 6) + 1 : 0, sn = i => String(42 + (i % 9)).padStart(3, '0');
    const engr = lc >= 0 ? ep(lc, 0.7, 2.1, E.lin) : ep(t, 1.2, 2.8, E.lin), num = sn(idx);
    G.save(); setFont({ font: 'disp', size: 150, weight: 800 }); G.textAlign = 'center';
    const glyph = (s2, a2) => { G.save(); G.globalAlpha = k * a2; G.fillStyle = 'rgba(236,235,231,0.16)'; G.fillText(s2, px + pw2 / 2, py + 180); G.fillStyle = 'rgba(0,0,0,0.25)'; G.fillText(s2, px + pw2 / 2 + 2, py + 182); G.fillStyle = 'rgba(236,235,231,0.10)'; G.fillText(s2, px + pw2 / 2, py + 180); G.restore(); };
    if (lc >= 0 && lc < 0.6) glyph(sn(idx - 1), 1 - ep(lc, 0, 0.55));
    G.save(); G.beginPath(); G.rect(px, py, pw2 * engr + 1, ph2); G.clip(); glyph(num, 1); G.restore();
    if (engr > 0 && engr < 1) { const ex = px + pw2 * engr, ey = py + 120 + 50 * Math.sin(t * 38); warm(ex, ey, 46, '#ffffff', 0.35); warm(ex, ey, 18, C.hero, 0.9); line(ex, py, ex, py + ph2, { color: C.hero, w: 1.5, alpha: 0.5 }); }
    G.restore();
    keyPlan(t, 1.0, lx + lw0 - 100, y0 + 220, { s: 0.6, hi: 'trigR', label: 'Right click' });
    const ks = ep(t, 3.0, 3.4), sx0 = lx + 40, sy0 = y0 + 460;
    part(sx0, sy0, 24, () => {
      solid(() => { G.beginPath(); G.moveTo(0, 0); G.lineTo(7, 0); G.lineTo(7.4, 0.6); G.lineTo(9.6, 0.6); G.lineTo(10, 0); G.lineTo(18, 0); G.lineTo(18, 1.6); G.lineTo(0, 1.6); G.closePath(); }, MT.shell, [0, 0, 18, 1.6], { hatch: true });
      G.beginPath(); G.moveTo(0, 0); G.lineTo(7, 0); G.lineTo(7.4, 0.6); G.lineTo(9.6, 0.6); G.lineTo(10, 0); G.lineTo(18, 0); G.lineTo(18, -0.35); G.lineTo(0, -0.35); G.closePath(); G.fillStyle = 'rgba(200,215,232,0.45)'; G.fill(); G.strokeStyle = inkA(0.5); G.lineWidth = lw(1); G.stroke();
    }, { alpha: ks });
    text('Clear coat fills the engraving flush', sx0 + 18 * 24 + 28, sy0 + 10, { role: 'small', color: C.ink, maxW: 220, lh: 1.3, alpha: ep(t, 3.2, 3.6) });
    text('Section, depth drawn larger', sx0, sy0 + 90, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 3.2, 3.6) });
    /* right: the glance, then claimed against measured */
    const rx = lx + lw0 + 40, rw = RM - rx;
    own_ba(t, 1.0, rx, 420, '+' + fmtN(worst, 1) + ' %', '0 %', { sb: 70, sa: 140, label: 'Weight on the card against the scale', net: 'Each card prints its own unit\'s measured weight, to 0.1 g' });
    const by = 520, bh = 440;
    demoWindow(rx, by, rw, bh, tileA(t, 0.5, 1));
    cardHead(t, 0.7, rx, by, rw, 'Measured against claimed', []);
    const x0 = rx + 260, x1 = rx + rw - 110, gmin = -4, gmax = 12, X = g => x0 + (x1 - x0) * (g - gmin) / (gmax - gmin), rh = 26, ty = by + 104;
    const a0 = ep(t, 1.0, 1.4);
    text('Closest to 0 is best', rx + rw - 32, by + 52, { role: 'label', size: 20, color: C.ink, align: 'right', alpha: a0 });
    for (const g of [0, 4, 8, 12]) { line(X(g), ty - 12, X(g), ty + rh * (R.length + 1), { color: g ? C.hair : C.mute, w: g ? 1 : 1.5, alpha: a0 }); text((g > 0 ? '+' : '') + g + ' %', X(g), ty - 20, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: a0 }); }
    /* Theseus first: its card is the scale's weight, a gap of zero, the best a card can do */
    const yT = ty + 8, kT = ep(t, 3.0, 3.5);
    rect(rx + 20, yT - rh / 2 + 1, rw - 40, rh - 2, { fill: C.heroSoft, alpha: kT });
    heroMark(X(0), yT, 11, kT);
    text('Theseus', rx + 32, yT + 7, { role: 'small', size: 21, weight: 800, color: C.heroText, alpha: kT });
    text('0 %: weighed, printed', X(0) + 22, yT + 7, { role: 'tick', size: 19, color: C.heroText, alpha: kT });
    R.forEach((r, i) => {
      const y = ty + 8 + (i + 1) * rh, kk = ep(t, 1.3 + i * 0.07, 2.1 + i * 0.07, E.snap), a = ep(t, 1.2 + i * 0.07, 1.5 + i * 0.07);
      text(r.name, rx + 32, y + 7, { role: 'small', size: 21, weight: 600, color: C.ink2, alpha: a });
      const xa = X(0), xb = X(r.g * kk);
      rect(Math.min(xa, xb), y - 6, Math.abs(xb - xa), 12, { fill: i === 0 ? C.bad : C.comp, alpha: a });
      text((r.g > 0 ? '+' : '') + fmtN(r.g, 1) + ' %', r.g >= 0 ? xb + 10 : xa + 10, y + 7, { role: 'tick', size: 19, color: C.ink2, alpha: clamp(kk * 1.4 - 0.3) });
    });
    source(t, 'Gap = (measured − claimed) ÷ claimed; measured weights from RTINGS. Finalmouse numbered 10,000 ULX Competition units; Theseus puts the number on top, where you see it.', { t0: 3.4, maxW: 1760 });
  }
});
