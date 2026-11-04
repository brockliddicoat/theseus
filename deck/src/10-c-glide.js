/* ============================================================================================
   chapter 02, glide and tracking: what touches the pad, and what sees it.
   card · under the mouse (3D, every idea placed on it) · eight dots (contact and pressure) · the 0.4 mm window
   (no cutouts) · the sensor table · full reports (the V4 Pro step) · where the sensor sits (Kim et al. 2020) ·
   set in the mouse (#87, lift-off, X/Y). The idea sheet for #8, #52 and #37 is in 12-15-glide.js.
   Every number carries its evidence; competitors first, the Theseus step after.
   ============================================================================================ */
Object.assign(SRC, {
  gld_kim20: { t: 'Kim, Lee, van Gemert & Oulasvirta, "Optimal Sensor Position for a Computer Mouse", CHI 2020: 14 gamers; throughput 5.77 bits/s at the centre, 5.16 at the front (10.7% lower), 4.97 at the rear (14.0% lower); path deviation 18.0, 22.1 and 21.6 px; each player\'s own best position 6.034 against 5.798 bits/s at the centre (+4.1%)', u: 'https://arxiv.org/abs/2001.03352', n: 'Positions 14.4 mm apart (20% steps). A two-sensor mouse emulates any position in 1% steps: x = (1 − p)·front + p·rear. Their calibration took about an hour.' },
  gld_baek26: { t: 'Baek & Kim, arXiv 2608.03168 (4 Aug 2026): a dual-sensor mouse simulates the path for every sensor position, to "reduce the calibration time from an hour to just five minutes" (preliminary)', u: 'https://arxiv.org/abs/2608.03168' },
  gld_paw3395: { t: 'PixArt PAW3395DM-T6QU datasheet v1.2 (15 Nov 2022): up to 26,000 cpi in 50-cpi steps; 650 ips, 50 g (HP mode); run current 1.7 mA HP and 1.3 mA LP at 1 ms polling, 10 mA in Corded Gaming mode at 0.125 ms (LED included); lift cut-off 1 mm or 2 mm, plus manual calibration; angle snapping and angle tunability; VDD 1.8 to 2.1 V; lens to surface 2.2 / 2.4 / 2.6 mm; round lens LM19-LSI (assembled 18.85 × 21.15 mm) or trim lens L0AE-LSI1 (10.90 × 16.80 mm)', u: 'https://atta.szlcsc.com/upload/public/pdf/source/20251201/5A54B75DA77586FABF8CEFBD8F21947D.pdf' },
  gld_eps3950: { t: 'EPS Global listing, PAW3950DM-T5QU: up to 30,000 cpi in 50-cpi steps; 750 ips and 50 g (HP mode); 1.3 mA typical run current, LED included; selectable lift height with manual calibration', u: 'https://www.epsglobal.com/products/semiconductors/sensing-and-haptics/optical-navigation/paw3950dm-t5qu-optical-gaming-navigation-chip', n: 'A distributor listing. Its PAW3395 currents (2.4 / 1.7 mA) did not match PixArt\'s datasheet (1.7 / 1.3 mA), so the 1.3 mA here is not confirmed.' },
  gld_nbcXm: { t: 'Notebookcheck, Xiaomi Gaming Mouse 2 (11 May 2026): "PixArt PAW3955XM sensor", 750 IPS, 60G', u: 'https://www.notebookcheck.net/Xiaomi-launches-new-affordable-8K-wireless-gaming-mouse-with-flagship-PixArt-sensor.1293650.0.html' },
  gld_akko3955: { t: 'IT Home, Akko V9 Master (7 May 2026): PAW3955, native 40,000 cpi, 750 ips, 60 G, 11 lift-off levels', u: 'https://www.ithome.com/0/947/389.htm' },
  gld_3955gen: { t: 'PAW3955 "generic" figures, 40,000 DPI / 850 IPS / 75 G, as compiled by mousemetric and EloShapes (validation report 2026-11-03; not re-opened in this pass)', u: 'https://mousemetric.com/', n: 'PAW3955 figures disagree by variant and by vendor: Xiaomi\'s XM and most retail listings give 750 IPS / 60 G. PixArt publishes no PAW3955 datasheet.' },
  gld_razerFocus: { t: 'Razer, Focus Pro 50K Gen-3: 50,000 DPI, 930 IPS, 90 G, 1-DPI steps, FrameSync; lift-off and landing set separately in "26 granular levels ... compared to only 3 in the previous version" (no millimetres given)', u: 'https://www.razer.com/mena-en/technology/razer-focus-pro-sensor' },
  gld_ninjaV3: { t: 'Ninjutso store, Sora V3 (published 11 Jun 2026): AIMNINJA 2 PRO 45K, "dual-optical engine sensor with gen-2 motionsync and up to 52% more power efficiency compared to PAW3950"', u: 'https://ninjutso.com/products/sora-v3-wireless-ultralight-gaming-mouse' },
  gld_ithomeAim: { t: 'IT Home (6 May 2026): PixArt says the AIMNINJA 2 is a custom sensor, not on its Next-Gen Sensor Platform and without FrameSync hardware; Ninjutso apologised for using the term "FrameSync"', u: 'https://www.ithome.com/0/946/904.htm' },
  gld_maxgV3: { t: 'MaxGaming listing, Ninjutso Sora V3: AIMNINJA 2, 45,000 dpi, 50 G maximum acceleration (retailer listing)', u: 'https://us.maxgaming.com/us/wireless-mouses/ninjutso-sora-v3-8k-superlight-wireless-gaming-mouse-black' },
  gld_tpuV4: { t: 'TechPowerUp, Razer Viper V4 Pro review: the Focus Pro 50K Gen-3 is "a completely different package and a new tracking engine"; wireless counts capped at 12 bits (±2,047 per report); at least 2 (perhaps 16) frames of smoothing for about 1.5 s after a lift-off; new skate sizes, so Viper V3 Pro skates do not fit', u: 'https://www.techpowerup.com/review/razer-viper-v4-pro/', n: 'As recorded in research/validation-report-2026-11-03.md; TechPowerUp refused this session\'s fetches.' },
  gld_pcgX2: { t: 'PC Gamer, Pulsar X2 CrazyLight Medium review: 39 g with dot skates, 41 g with PTFE skates (Pulsar spec, ±1 g)', u: 'https://www.pcgamer.com/hardware/gaming-mice/pulsar-x2-crazylight-medium-review/' },
  gld_ptfe: { t: 'Xometry, PTFE datasheet: density 2.16 g/cm³', u: 'https://xometry.asia/wp-content/uploads/2021/03/PTFE.pdf' },
  gld_zkLens: { t: 'Zaunkoenig, "M1K weight in review": the PMW3360\'s lens weighed 0.8 g, more than the sensor (0.6 g)', u: 'https://zaunkoenig.co/blog/m1k-weight-in-review' },
  gld_brock: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse", ideas #8, #10, #11, #27, #37, #52, #76, #87: skate cutouts caused tracking trouble on the WLMOUSE Huan and Ying and the G-Wolves HTM Plus; the V4 Pro\'s lens snaps on', u: '', n: 'research/brock-doc-in-pursuit.txt and its comment threads' },
  gld_shell3d: { t: 'This deck\'s 3D shell (3d/shell): Brock\'s Sora V2/V3 scan with eight 6.5 mm dots, four M2 screws and the lens at the middle of the length', u: '', n: 'Skate, screw and lens positions are read from assets/shell-theseus.json.' }
});

/* ---------- the underside, as the 3D shell has it (refreshed from assets/shell-theseus.json when the deck is served) ---------- */
const GLD = {
  dot: 6.5,                                                     /* mm: Brock's dot skate, the size of X-Raypad's Obsidian dots */
  skates: [[13.72, 47.29], [19.97, 42.39], [17.2, -43.18], [10.82, -47.93], [-19.92, 42.53], [-13.49, 47.37], [-11.11, -47.83], [-17.4, -42.91]],
  screws: [[21.52, 17.0], [-21.52, 17.0], [25.22, -24.0], [-25.22, -24.0]],
  sensor: [0, 0],
  R: 71.8                                                       /* mm: the radius view3D frames the shell by, read off a render */
};
(function () {
  try {
    if (typeof fetch !== 'function' || typeof location === 'undefined' || !/^https?:$/.test(location.protocol)) return;
    fetch('assets/shell-theseus.json').then(r => (r.ok ? r.json() : null)).then(j => {
      if (j && Array.isArray(j.skates) && j.skates.length === 8 && Array.isArray(j.screws)) { GLD.skates = j.skates; GLD.screws = j.screws; if (Array.isArray(j.sensor)) GLD.sensor = j.sensor; }
    }).catch(() => { });
  } catch (e) { /* file:// or no fetch: keep the copy above */ }
})();
const gld_area = n => n * Math.PI * GLD.dot * GLD.dot / 4;      /* mm², n dots */
/** px per mm in a view3D('shell', …, { view: 'bottom', target: [0, 0, 0], zoom }) box, and where a point (X, Z mm) lands.
   From below, the user's left (+X) is on the right and the nose (+Z) is up. */
function gld_scale(box, zoom) { return Math.min(box[2], box[3]) * zoom / (2 * GLD.R * 1.12 / Math.cos(11 * Math.PI / 180)); }
function gld_bot(box, zoom, X, Z) { const s = gld_scale(box, zoom); return [box[0] + box[2] / 2 + X * s, box[1] + box[3] / 2 - Z * s]; }
/** a leader from a point on a drawing to a line of text: a dot and a ring on the point, an elbow, a tail ending at `to` */
function gld_lead(t, t0, p, to, o = {}) {
  const k = ep(t, t0, t0 + 0.55, E.snap); if (k <= 0) return 0;
  const col = o.color || acc(), a = o.alpha == null ? 1 : o.alpha;
  circle(p[0], p[1], 4.5 * k, { fill: col, alpha: a });
  if (o.ring !== false) circle(p[0], p[1], (o.r || 11) * k, { color: col, w: 1.5, alpha: 0.6 * a });
  const ex = o.elbow != null ? o.elbow : to[0] - 36;
  poly([p, [ex, to[1]], to], { color: col, w: 1.5, p: k, alpha: 0.9 * a });
  return k;
}
/** a ring that keeps running out from a point, so a settled frame still shows where to look */
function gld_pulse(t, t0, p, r, col, per = 2.4) { if (t < t0) return; const ph = ((t - t0) % per) / per; circle(p[0], p[1], r + ph * r * 1.4, { color: col, w: 1.5, alpha: 0.45 * (1 - ph) }); }
/** a horizontal bar row in the 'cells' style: track, bar, value above its left end, an evidence dot at the right */
function gld_bar(t, t0, x, y, w, v, max, o = {}) {
  const k = ep(t, t0, t0 + 0.8, E.snap), a = ep(t, t0 - 0.1, t0 + 0.3) * (o.alpha == null ? 1 : o.alpha), bh = o.bh || 14;
  rr(x, y - bh / 2, w, bh, bh / 2, C.track, null, 0, a);
  if (v != null) {
    const col = o.hero ? C.hero : o.color || (o.ref ? C.ink : C.comp), wv = Math.max(bh, w * clamp(v / max) * k);
    if (o.v2 != null) rr(x, y - bh / 2, Math.max(bh, w * clamp(o.v2 / max) * k), bh, bh / 2, rgba(o.hero ? C.hero : TH ? '#111111' : '#F3F2EE', o.hero ? 0.4 : 0.16), null, 0, a);
    if (o.dash) { G.save(); G.globalAlpha = a; G.setLineDash([5, 4]); rrPath(x, y - bh / 2, wv, bh, bh / 2); G.strokeStyle = o.hero ? C.heroText : col; G.lineWidth = 2; G.stroke(); G.restore(); }
    else rr(x, y - bh / 2, wv, bh, bh / 2, col, o.hero && TH ? '#111111' : null, 1.3, a);
  }
  if (o.label != null) text(o.label, x, y - bh / 2 - 12, { font: 'mono', size: o.lsize || 24, weight: o.hero ? 800 : 600, color: o.lcolor || C.ink, alpha: a, tnum: true });
  if (o.note) text(o.note, x + w, y - bh / 2 - 12, { role: 'label', size: 19, color: o.ncolor || C.faint, align: 'right', alpha: a });
  if (o.ev) evDot(x + w + 16, y, o.ev, 5, a);
  return k;
}
/** the step-further strip in the band: BEST TODAY, THE CATCH, THESEUS, each a mono head, a pill and two lines */
function gld_steps(t, t0, cols, o = {}) {
  const y = o.y || LAY.bandY, n = cols.length, gap = 40, w = (RM - LM - gap * (n - 1)) / n;
  cols.forEach((c, i) => {
    const x = LM + i * (w + gap), tt = t0 + i * 0.35, a = ep(t, tt, tt + 0.45); if (a <= 0.003) return;
    const hero = i === n - 1;
    rect(x, y - 26, 28 * E.out3(a), 3, { fill: hero ? C.hero : acc(), alpha: a });
    const lw0 = text(c[0], x + 40, y - 14, { role: 'label', size: 21, color: hero ? C.heroText : C.faint, alpha: a });
    pill(x + w - pillW(c[2]), y - 13, c[2], a);
    text(c[1], x, y + 24, { role: 'small', size: 25, weight: hero ? 700 : 500, color: hero ? C.ink : C.ink2, maxW: w, lh: 1.3, t, t0: tt + 0.15, cps: 120, alpha: a });
  });
}

/** a small status lamp: a ring that fills when on, and its label */
function gld_lamp(x, y, label, on, col, a = 1) { circle(x, y, 8, { fill: on ? col : null, color: on ? null : C.faint, w: 2, alpha: a }); if (on) circle(x, y, 15, { color: col, w: 1.5, alpha: 0.35 * a }); text(label, x + 20, y + 8, { role: 'label', size: 21, color: on ? col : C.faint, alpha: a }); }
/** a label on top of a 3D render: a panel-coloured plate under mono caps (or a sentence), so it reads over any pixels */
function gld_tag(x, y, s, o = {}) {
  const st = o.prose ? { role: 'small', size: 25, weight: 600 } : { role: 'label', size: 21 }, w0 = tw(s, st), a = o.alpha == null ? 1 : o.alpha, x0 = o.align === 'right' ? x - w0 : x;
  if (a <= 0.003) return;
  rr(x0 - 10, y - 24, w0 + 20, 34, 6, rgba(TH ? '#FFFFFF' : '#141517', 0.88), inkA(0.18), 1, a);
  text(s, x0, y, Object.assign({}, st, { color: o.color || C.ink, alpha: a }));
}

/* ============================== the chapter card ============================== */
S({
  id: 'glide', ch: 'glide', card: true, theme: 'night', title: 'Glide and tracking', settle: 5, three: ['shell'],
  draw: t => {
    chapterCard(t, {
      name: 'glide', gloss: 'What touches the pad, and what sees it.', list: [
        [10, 'Two dot skates in every corner'], [8, 'POM by default, PTFE in the box'], [11, 'Solid pads under the skates'], [52, 'Screws clear of the skates'],
        [37, 'A smaller, clip-on lens'], [76, 'A next-gen sensor, on its numbers'], [27, 'Sensor at your measured optimum'], [87, 'Virtual position and rotation'],
        ['lod', 'Lift-off in fine steps, set apart'], ['{XY CPI}', 'X and Y counts set apart']
      ]
    });
    /* inside the iris: the underside, seen from below, turning slowly */
    const k = ep(t, 0.9, 1.9);
    view3D('shell', t, 1380 - 350, 580 - 350, 700, 700, { view: [-0.42, -1, 0.52], yaw: -0.25 + 0.5 * ep(t, 0.6, 5.0, E.io3) + 0.06 * Math.sin(t * 0.5), zoom: 1.06, explode: 0, xray: 0 }, { alpha: k });
    rich([{ s: '3D', role: 'label', size: 21, color: acc() }, { s: 'The underside: eight dots, four screws, one lens', role: 'small', size: 25, weight: 500, color: C.mute, gap: 16 }], 1380, 940, { align: 'center', alpha: ep(t, 2.0, 2.4) });
  }
});

/* ============================== under the mouse: every idea, placed ============================== */
const GLD_UNDER = [
  { n: 10, head: 'Two dots in every corner, eight in all', other: 'Pulsar sells the X2 CrazyLight with dots as an option: 39 g, against 41 g with PTFE.', ev: 'claim', at: () => [(GLD.skates[0][0] + GLD.skates[1][0]) / 2, (GLD.skates[0][1] + GLD.skates[1][1]) / 2], r: 30 },
  { n: 52, head: 'Every screw inside the dots, clear of them', other: 'The Finalmouse ULX hides its rear screws under the skates.', ev: 'measured', at: () => GLD.screws[0] },
  { n: 37, head: 'A lens window sized for one dot', other: 'Razer\'s new lens snaps on, and only Razer has it.', ev: 'measured', at: () => [GLD.sensor[0], GLD.sensor[1] + 3.4] },
  { n: 27, head: 'The sensor at the middle of the length', other: 'In a 14-gamer study the centre beat the front and the rear by 11 to 14%.', ev: 'study', at: () => GLD.sensor, ring: false },
  { n: 11, head: 'Solid plastic under every dot, no cutouts', other: 'Skate cutouts cost focus on the WLMOUSE Huan and Ying and the G-Wolves HTM Plus.', ev: 'claim', evText: 'Community', at: () => GLD.skates[2] },
  { n: 'dxf', head: 'The skate outlines, as a DXF on day one', other: 'Razer changed the V4 Pro\'s skate sizes, so V3 Pro skates no longer fit.', ev: 'measured', at: () => GLD.skates[3] }
];
S({
  id: 'gld_under', ch: 'glide', theme: 'paper', title: 'Under the mouse', settle: 9, three: ['shell'], ideas: [10, 52, 37, 27, 11],
  src: ['gld_shell3d', 'gld_pcgX2', 'tpuUlx', 'gld_tpuV4', 'gld_kim20', 'gld_brock'],
  draw: t => {
    header(t, 'Under the mouse');
    captions(t, [[0.6, 'Everything in this chapter touches the pad or looks at it. This is where each part sits, seen from below.'], [5.2, 'Each row says what the best mice do in that spot today. The slides after this take the rows one at a time.']]);
    const A = acc(), box = [LM + 10, 266, 690, 712], zoom = lerp(1.08, 1.27, ep(t, 0.2, 2.3, E.cam));
    view3D('shell', t, box[0], box[1], box[2], box[3], { view: 'bottom', target: [0, 0, 0], zoom, explode: 0, xray: 0 });
    const P = (X, Z) => gld_bot(box, zoom, X, Z), s = gld_scale(box, zoom), ka = ep(t, 2.2, 2.8);
    /* the length, nose to tail, with the middle marked: where the sensor sits by default (#27) */
    if (ka > 0) {
      const n = P(0, 59.4), tl = P(0, -59.6), c = P(GLD.sensor[0], GLD.sensor[1]), xd = box[0] + 34;
      line(xd, n[1], xd, tl[1], { color: C.mute, w: 1.5, alpha: ka });
      for (const yy of [n[1], tl[1]]) line(xd - 8, yy, xd + 8, yy, { color: C.mute, w: 1.5, alpha: ka });
      line(xd - 12, c[1], c[0] - 3.4 * s, c[1], { color: A, w: 1.5, dash: [5, 4], alpha: ka });
      text('50%', xd - 8, c[1] - 12, { role: 'label', size: 21, color: A, alpha: ka });
      text('Nose', xd - 8, n[1] - 12, { role: 'label', size: 19, color: C.mute, alpha: ka });
      text('Tail', xd + 14, tl[1] - 10, { role: 'label', size: 19, color: C.mute, alpha: ka });
    }
    /* the rows, each with a leader to its spot */
    const rx = 870, y0 = 318, rh = 108;
    GLD_UNDER.forEach((r, i) => {
      const y = y0 + i * rh, t0 = 2.3 + i * 0.42, a = ep(t, t0, t0 + 0.4), p = P(...r.at());
      if (a <= 0.003) return;
      gld_lead(t, t0, p, [rx - 14, y - 9], { color: A, ring: r.ring !== false, r: r.r ? r.r * s / 5.5 : 11, elbow: rx - 70 - (i % 2) * 18 });
      if (r.n === 'dxf') { /* the outline of a dot, drawn as a dashed path that walks round it */ const k = ep(t, t0 + 0.4, t0 + 1.4); G.save(); G.globalAlpha = a; G.setLineDash([6, 5]); G.lineDashOffset = -t * 18; G.strokeStyle = A; G.lineWidth = 2; G.beginPath(); G.arc(p[0], p[1], (GLD.dot / 2 + 0.9) * s, -Math.PI / 2, -Math.PI / 2 + TAU * k); G.stroke(); G.restore(); }
      if (r.n === 11) { const k = ep(t, t0 + 0.4, t0 + 1.0); circle(p[0], p[1], (GLD.dot / 2 + 1.6) * s, { color: A, w: 2.5, alpha: a * k }); }
      if (r.n === 27) { line(p[0] - 14, p[1], p[0] + 14, p[1], { color: A, w: 2, alpha: a }); line(p[0], p[1] - 14, p[0], p[1] + 14, { color: A, w: 2, alpha: a }); }
      gld_pulse(t, t0 + 0.8 + i * 0.13, p, r.n === 10 ? 26 : 12, A);
      text(typeof r.n === 'number' ? '#' + r.n : caps(r.n), rx, y, { role: 'label', size: 22, color: A, alpha: a });
      text(r.head, rx + 86, y, { role: 'h3', size: 30, color: C.ink, t, t0: t0 + 0.15, cps: 70, alpha: a });
      const pw = pill(rx + 86, y + 39, r.ev, a, r.evText ? { text: r.evText } : {});
      text(r.other, rx + 86 + pw + 14, y + 38, { role: 'small', size: 25, color: C.mute, maxW: RM - (rx + 86 + pw + 14), lh: 1.28, t, t0: t0 + 0.4, cps: 150, alpha: a });
    });
    source(t, 'This deck\'s 3D shell, from Brock\'s Sora scan. Pulsar via PC Gamer; TechPowerUp (ULX, V4 Pro); Kim et al., CHI 2020; my own testing.', { t0: 3 });
  }
});

/* ============================== eight dots, half the pressure (#10) ============================== */
S({
  id: 'dots', ch: 'glide', theme: 'night', title: 'Eight dots, half the pressure', settle: 9, three: ['skates'], ideas: [10],
  src: ['obsidianDots', 'gld_pcgX2', 'gld_tpuV4', 'gld_brock', 'gld_paw3395'],
  draw: t => {
    header(t, 'Eight dots, half the pressure');
    captions(t, [[0.6, 'With one dot per corner, a soft pad lets the dots sink until the base scrapes. Two per corner double the area the same hand pushes on.'], [5.0, 'Dots already ship as an option. The step further is a default set, and the drawing of it, published on day one.']]);
    const A = acc(), lx = LM, ly = LAY.top, lw0 = 820, lh0 = 568;
    /* left: the eight-dot set, dropping into place, and two dots in section on a soft pad */
    demoWindow(lx, ly, lw0, lh0, ep(t, 0.2, 0.6));
    cardHead(t, 0.4, lx, ly, lw0, 'Eight dots, 6.5 mm, two per corner', ['proposal']);
    const drop = 1 - ep(t, 0.7, 2.3, E.out3);
    view3D('skates', t, lx + 10, ly + 64, lw0 - 20, 318, { view: [-0.8, -1, 0.06], view2d: 'bottom', yaw: 0.1 * Math.sin(t * 0.45), zoom: 1.9, explode: drop }, { alpha: ep(t, 0.4, 0.9) });
    text('Base plate: a stand-in', lx + lw0 - 26, ly + 390, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ep(t, 2.4, 2.8) });
    /* the same load on one dot per corner and on two: the pad gives twice as much under the first (drawn to the ratio) */
    const sk = ep(t, 2.6, 3.4, E.io3), load = 1 + 0.25 * Math.sin(Math.max(0, t - 3.6) * 1.6) * ep(t, 3.6, 4.4), sy = ly + 516;
    line(lx + 26, ly + 404, lx + lw0 - 26, ly + 404, { color: C.hair, w: 1.5, alpha: ep(t, 2.4, 2.8) });
    [[lx + 205, 0.9, '1 per corner', 'Twice the sink', C.red], [lx + 615, 0.45, '2 per corner', 'Half the sink', A]].forEach(([cx, d, l1, l2, col], i) => {
      const a = ep(t, 2.5 + i * 0.2, 2.9 + i * 0.2);
      drawSkate(cx, sy, 12, { sink: d * sk * load, alpha: a, w: 13 });
      if (sk > 0.05) arrow(cx + 112, sy - 72 - 10 * load, cx + 112, sy - 26, { color: C.ink2, w: 2 + load, hs: 10, alpha: a });
      text(l1, cx - 156, ly + 440, { role: 'label', size: 21, color: C.ink, alpha: a });
      text(l2, cx - 156, ly + 468, { role: 'label', size: 21, color: col, alpha: a * ep(t, 3.2, 3.6) });
    });
    /* right: contact area, then pressure, both derived from the dot size */
    const rx = LM + lw0 + 40, rw = RM - rx, bw = rw - 330;
    const card = (y, h, t0, label, f) => { demoWindow(rx, y, rw, h, ep(t, t0, t0 + 0.4)); cardHead(t, t0 + 0.1, rx, y, rw, label, ['derived']); f(y); };
    card(ly, 274, 0.6, 'Contact area', y => {
      text('A = n · π d² ÷ 4, with d = 6.5 mm', rx + 26, y + 100, { font: 'mono', size: 23, weight: 500, color: C.mute, alpha: ep(t, 1.0, 1.4) });
      [[4, '1 per corner', false], [8, '2 per corner, Theseus', true]].forEach(([n, nm, hero], i) => {
        const yy = y + 168 + i * 68, a = ep(t, 1.2 + i * 0.3, 1.6 + i * 0.3);
        text(nm, rx + 26, yy + 8, { role: 'small', size: 25, weight: hero ? 700 : 500, color: C.ink, alpha: a });
        gld_bar(t, 1.3 + i * 0.3, rx + 300, yy, bw, gld_area(n), 300, { hero, label: fmtN(gld_area(n), 0) + ' mm²', note: n + ' dots', ev: 'derived' });
      });
    });
    card(ly + 294, 274, 1.4, 'Pressure on the pad, per newton of load', y => {
      text('p = F ÷ A.  The mouse alone, 29 g, is 0.28 N', rx + 26, y + 100, { font: 'mono', size: 23, weight: 500, color: C.mute, alpha: ep(t, 1.8, 2.2) });
      [[4, '1 per corner', false], [8, '2 per corner, Theseus', true]].forEach(([n, nm, hero], i) => {
        const yy = y + 168 + i * 68, a = ep(t, 2.0 + i * 0.3, 2.4 + i * 0.3), kp = 1000 / gld_area(n), km = 0.029 * 9.81 * 1000 / gld_area(n);
        text(nm, rx + 26, yy + 8, { role: 'small', size: 25, weight: hero ? 700 : 500, color: C.ink, alpha: a });
        gld_bar(t, 2.1 + i * 0.3, rx + 300, yy, bw, kp, 8, { hero, color: hero ? null : C.red, label: fmtN(kp, 2) + ' kPa', note: 'Mouse alone ' + fmtN(km, 2) + ' kPa', ev: 'derived' });
      });
    });
    gld_steps(t, 5.0, [
      ['Best today', 'Pulsar X2 CrazyLight: dots as an option, 39 g against 41 g with full PTFE skates.', 'claim'],
      ['The catch', 'Skate sizes change between models: Viper V3 Pro skates do not fit the V4 Pro.', 'measured'],
      ['Theseus', 'Eight dots by default, and the skate DXF and dot height published on day one.', 'proposal']
    ]);
    source(t, 'Dot: X-Raypad Obsidian, 6.5 × 0.8 mm. Pulsar weights: PC Gamer. Skate sizes: TechPowerUp. Sink drawn to the ratio, not measured.', { t0: 3 });
  }
});

/* ============================== the 0.4 mm window (#11) ============================== */
S({
  id: 'focus', ch: 'glide', theme: 'paper', title: 'The sensor\'s 0.4 mm window', settle: 10, ideas: [11],
  src: ['gld_paw3395', 'obsidianDots', 'zowieSkates', 'gld_brock'],
  draw: t => {
    header(t, 'The sensor\'s 0.4 mm window');
    captions(t, [[0.6, 'The sensor sees the pad sharply only from 2.2 to 2.6 mm below its lens. Everything under the mouse stacks up inside that 0.4 mm.'], [2.8, 'Fill in the pockets under the skates without moving the lens, and the pad drops out of the window.'], [5.0, 'So the base is drawn around flat pads: the lens moves down by the pocket\'s depth and lands back at 2.4 mm.']]);
    const A = acc(), wx = LM, wy = LAY.top, ww = 1000, wh = 568;
    demoWindow(wx, wy, ww, wh, ep(t, 0.3, 0.7));
    /* three states: A, the skate sits in a 0.4 mm pocket; B, the pocket is filled and the lens stays; C, the lens comes down 0.4 mm */
    const stB = ep(t, 2.9, 3.8, E.io3), stC = ep(t, 5.1, 6.0, E.io3), lift = 0.4 * stB * (1 - stC), z = 2.4 + lift;
    const st = t < 2.9 ? 0 : t < 5.1 ? 1 : 2;
    const heads = ['A · skate in a 0.4 mm pocket', 'B · pocket filled, lens left in place', 'C · Theseus: flat pads, lens 0.4 mm lower'];
    cardHead(t, 0.5, wx, wy, ww, heads[st], [st === 2 ? 'proposal' : 'derived']);
    for (let i = 0; i < 3; i++) { const x = wx + ww - 110 + i * 34, on = i === st, a = ep(t, 0.8, 1.2); circle(x, wy + 104, on ? 8 : 6, { fill: on ? (i === 1 ? C.red : A) : null, color: on ? null : C.faint, w: 1.5, alpha: a }); text('ABC'[i], x, wy + 138, { role: 'label', size: 19, color: on ? C.ink : C.faint, align: 'center', alpha: a }); }
    const o = drawSensor(wx + 610, wy + 330, 26, { lift, accent: A, alpha: ep(t, 0.4, 1.0) });
    callout(t, 1.2, o.lens, 'Lens', { to: [wx + 330, wy + wh - 40], side: 'l', color: C.ink2, tcolor: C.ink2 });
    callout(t, 1.4, o.skate, 'Dot skate', { to: [wx + ww - 40, wy + wh - 40], side: 'l', color: C.ink2, tcolor: C.ink2 });
    { const inW = z <= 2.6 + 1e-6, col = inW ? A : C.red, a = ep(t, 1.6, 2.0);
      text('Lens to pad', wx + 26, wy + 214, { role: 'label', size: 21, color: C.mute, alpha: a });
      rich([{ s: fmtN(z, 2), role: 'stat', size: 64, color: col, tnum: true }, { s: 'mm', font: 'mono', size: 26, weight: 600, color: C.mute, gap: 10 }], wx + 22, wy + 284, { alpha: a });
      text(inW ? 'In focus' : 'Out of focus', wx + 26, wy + 320, { role: 'label', size: 21, color: inW ? A : C.red, alpha: a }); }
    text('Window 2.2 to 2.6 mm, PAW3395 datasheet', wx + 26, wy + wh - 84, { role: 'label', size: 19, color: A, alpha: ep(t, 1.6, 2.0) });
    /* right: the stack-up, each case's lens-to-pad distance against the window */
    const rx = wx + ww + 40, rw = RM - rx;
    demoWindow(rx, wy, rw, wh, ep(t, 0.5, 0.9));
    cardHead(t, 0.6, rx, wy, rw, 'Lens to pad, mm', ['datasheet', 'derived']);
    const bx = rx + 26, bw = rw - 52 - 150, X = v => bx + bw * v / 3.0, top = wy + 156, rh = 88, kw = ep(t, 1.0, 1.6);
    const rows = [{ nm: 'Skate in a 0.4 mm pocket', v: 2.4, t0: 1.4 }, { nm: 'Pocket filled, same lens', v: 2.8, bad: true, t0: 3.0 }, { nm: 'Skate 0.2 mm thicker', v: 2.6, edge: true, t0: 4.0 }, { nm: 'Theseus: flat pads, lens lowered', v: 2.4, hero: true, t0: 5.2 }];
    G.save(); G.globalAlpha = kw; G.fillStyle = rgba(A, 0.14); G.fillRect(X(2.2), top - 30, X(2.6) - X(2.2), rh * rows.length + 6); G.restore();
    for (const v of [2.2, 2.6]) line(X(v), top - 30, X(v), top - 24 + rh * rows.length, { color: A, w: 1.5, dash: [5, 4], alpha: kw });
    for (const v of [0, 1, 2, 3]) text(String(v), X(v), top + rh * rows.length + 10, { role: 'tick', size: 21, color: C.mute, align: 'center', alpha: kw });
    text('Window', (X(2.2) + X(2.6)) / 2, top - 40, { role: 'label', size: 19, color: A, align: 'center', alpha: kw });
    rows.forEach((r, i) => {
      if (t < r.t0) return;
      const y = top + i * rh, a = ep(t, r.t0, r.t0 + 0.4), k = ep(t, r.t0, r.t0 + 0.9, E.snap);
      text(r.nm, bx, y + 4, { role: 'small', size: 25, weight: r.hero ? 700 : 500, color: C.ink, alpha: a });
      const col = r.hero ? C.hero : r.bad ? C.red : C.comp, bh = 16, yb = y + 32;
      rr(bx, yb - bh / 2, Math.max(bh, (X(r.v) - bx) * k), bh, bh / 2, col, r.hero && TH ? '#111111' : null, 1.3, a);
      text(fmtN(r.v, 2), X(3.0) + 18, yb + 9, { font: 'mono', size: 25, weight: 700, color: r.bad ? C.red : C.ink, alpha: ep(t, r.t0 + 0.6, r.t0 + 1.0) });
      if (r.bad || r.edge) text(r.bad ? 'Out' : 'Edge', RM - 26, yb + 9, { role: 'label', size: 19, color: r.bad ? C.red : C.mute, align: 'right', alpha: ep(t, r.t0 + 0.6, r.t0 + 1.0) });
    });
    gloss(t, 6.4, 'Lens reference plane', 'The lens\'s lowest face. PixArt puts the pad 2.2 to 2.6 mm below it, 2.4 mm nominal.');
    featureCard(t, 6.8, 'No cutouts under the skates', ['proposal'], 'Dust stays off the adhesive, and each skate set\'s lens-to-pad distance is measured and printed.');
    source(t, 'Window: PixArt PAW3395 datasheet. Example stack: a 0.8 mm dot. ZOWIE warns thicker third-party skates can upset tracking.', { t0: 3 });
  }
});

/* ============================== the sensor table (#76) ============================== */
const GLD_SENS = [
  { name: 'PAW3395', sub: 'PixArt, 2022', ev: 'datasheet', ips: 650, g: 50, step: '50', mA: 1.7, mA8: 10, mAtx: '1.7; 10 at 8 kHz', lod: 2, lodTx: '1 or 2 mm' },
  { name: 'PAW3950', sub: 'PixArt, 2024, EPS listing', ev: 'datasheet', ips: 750, g: 50, step: '50', mA: 1.3, mAtx: '1.3', lod: null, lodTx: 'Not listed' },
  { name: 'PAW3955XM', sub: 'Xiaomi; Akko lists the same', ev: 'claim', ips: 750, g: 60, step: '1', mA: null, mAtx: 'Not public', lod: 11, lodTx: '11, 0.7 to 1.7 mm' },
  { name: 'PAW3955', sub: 'Generic listing, unverified', ev: 'claim', ips: 850, g: 75, step: '1', mA: null, mAtx: 'Not public', lod: null, lodTx: 'Not listed' },
  { name: 'Focus Pro 50K Gen-3', sub: 'Razer only, no PAW number', ev: 'claim', ips: 930, g: 90, step: '1', mA: null, mAtx: 'Not public', lod: 26, lodTx: '26, no mm given' },
  { name: 'AIMNINJA 2 Pro 45K', sub: 'Ninjutso custom part', ev: 'claim', ips: null, g: 50, step: null, mA: null, mAtx: '52% better, claimed', lod: null, lodTx: 'Not listed' }
];
S({
  id: 'sensor', ch: 'glide', theme: 'paper', title: 'What each sensor publishes', settle: 10, ideas: [76],
  src: ['gld_paw3395', 'gld_eps3950', 'gld_nbcXm', 'gld_akko3955', 'gld_3955gen', 'kc3955', 'mkb3955', 'gld_razerFocus', 'gld_tpuV4', 'gld_ninjaV3', 'gld_ithomeAim', 'gld_maxgV3'],
  draw: t => {
    header(t, 'What each sensor publishes');
    captions(t, [[0.6, 'Each row is what a sensor\'s maker has published. Where a cell says not public, nobody has put a number on it.'], [5.4, 'Theseus takes PixArt\'s next FrameSync-class part. Its row fills in when PixArt publishes the numbers, not before.']]);
    const x = LM, y0 = 352, rh = 68, lw0 = 430, gap = 34, cols = [
      { lab: 'Max speed', unit: 'IPS', max: 1000, val: r => r.ips, fmt: v => fmt(v) },
      { lab: 'Acceleration', unit: 'G', max: 100, val: r => r.g, fmt: v => String(v) },
      { lab: 'CPI step', unit: 'Counts', val: r => r.step, text: true },
      { lab: 'Run current', unit: 'mA, 1 kHz', max: 10.5, val: r => r.mA, cur: true },
      { lab: 'Lift-off', unit: 'Settings', max: 30, val: r => r.lod, lod: true }
    ], cw = (RM - x - lw0 - gap * (cols.length - 1)) / cols.length, a0 = ep(t, 0.6, 1.0);
    cols.forEach((c, j) => { const cx = x + lw0 + j * (cw + gap); text(c.lab, cx, y0 - 52, { role: 'label', size: 21, color: C.ink, alpha: a0 }); text(c.unit, cx, y0 - 24, { role: 'label', size: 19, color: C.faint, alpha: a0 }); });
    line(x, y0 - 8, RM, y0 - 8, { color: C.hair, w: 1.5, alpha: a0 });
    const rowsAll = GLD_SENS.concat([{ name: 'Theseus', sub: 'FrameSync-class, proposal', hero: true }]);
    rowsAll.forEach((r, i) => {
      const y = y0 + i * rh, t0 = r.hero ? 4.6 : 0.9 + i * 0.16, a = ep(t, t0, t0 + 0.4);
      if (a <= 0.003) return;
      if (r.hero) rect(x - 18, y + 4, 6, rh - 10, { fill: C.hero, alpha: a });
      line(x, y + rh - 3, RM, y + rh - 3, { color: C.hair, w: 1, alpha: a });
      text(r.name, x, y + 32, { role: 'h3', size: 29, color: C.ink, alpha: a });
      text(r.sub, x, y + 58, { role: 'label', size: 19, color: r.hero ? C.heroText : C.mute, alpha: a });
      cols.forEach((c, j) => {
        const cx = x + lw0 + j * (cw + gap), by = y + 46, tt = t0 + 0.1 + j * 0.08, ac = ep(t, tt, tt + 0.4);
        if (r.hero) { text(c.text ? '1, target' : c.lod ? 'Lift, land apart' : c.cur ? 'Measured' : 'Not public yet', cx, by + 4, { role: 'label', size: 19, color: C.ink, alpha: ac }); return; }
        const v = c.val(r);
        if (c.text) { text(v == null ? 'Not listed' : v, cx, by + 6, v == null ? { role: 'label', size: 19, color: C.faint, alpha: ac } : { font: 'mono', size: 26, weight: 700, color: C.ink, alpha: ac }); if (v != null) evDot(cx + 70, by - 2, r.ev, 5, ac); return; }
        if (v == null) {
          rr(cx, by - 7, cw, 14, 7, C.track, null, 0, ac);
          const claimed = c.cur && /claimed/.test(r.mAtx);
          text(c.cur ? r.mAtx : c.lod ? r.lodTx : 'Not public', cx, by - 19, { role: 'label', size: 19, color: claimed ? C.ink2 : C.faint, alpha: ac });
          if (claimed) evDot(cx + cw + 14, by, 'claim', 5, ac);
          return;
        }
        gld_bar(t, tt, cx, by, cw, v, c.max, { v2: c.cur ? r.mA8 : null, label: c.cur ? r.mAtx : c.lod ? r.lodTx : c.fmt(v), lsize: c.cur || c.lod ? 21 : 24 });
        evDot(cx + cw + 14, by, r.ev, 5, ac);
      });
    });
    legend(t, 1.6, RM, LAY.top - 6, [{ kind: 'dot', color: evCol('datasheet'), label: 'Datasheet' }, { kind: 'ring', color: evCol('claim'), label: 'Maker claim' }], { size: 19, gap: 26, align: 'right' });
    gloss(t, 5.8, 'Undervolting', 'The PAW3395 runs at 1.8 to 2.1 V. Power ∝ V to V², so 1.9 → 1.8 V saves 5 to 10%; a 40% cut needs 1.47 V.');
    featureCard(t, 6.2, 'A next-gen sensor', ['datasheet', 'claim', 'proposal'], 'Ninjutso\'s 52% comes from design, not voltage, and PixArt says that part has no FrameSync hardware.');
    source(t, 'PixArt (PAW3395); EPS Global (PAW3950); Notebookcheck, IT Home, MathewKB (PAW3955); Razer; Ninjutso, MaxGaming, IT Home (AIMNINJA 2).', { t0: 3 });
  }
});

/* ============================== full reports, no smoothing (the V4 Pro step for #76) ============================== */
S({
  id: 'gld_reports', ch: 'glide', theme: 'night', title: 'Full reports, no smoothing', settle: 10, three: ['pcb'], ideas: [76, 37],
  src: ['gld_tpuV4', 'xbabSmooth', 'gld_razerFocus', 'gld_paw3395'],
  draw: t => {
    header(t, 'Full reports, no smoothing');
    captions(t, [[0.6, 'TechPowerUp found the Viper V4 Pro sends its wireless counts in 12 bits, and smooths motion for about 1.5 s after each lift.'], [5.4, 'Theseus sends full 16-bit counts and stops smoothing the moment the lens lands. I\'ll publish the test that shows both.']]);
    const A = acc(), lx = LM, ly = LAY.top, lw0 = 700, lh0 = 568;
    demoWindow(lx, ly, lw0, lh0, ep(t, 0.2, 0.6));
    cardHead(t, 0.3, lx, ly, lw0, 'From above: the sensor', ['proposal']);
    /* the sensor lifts off its pads and settles back; below the board, the clip-on lens drops and returns */
    const sep = 0.3 * env(t, 1.6, 2.6, 3.6, 4.6) + 0.3 * env(t, 6.2, 7.2, 8.0, 9.0);
    const b1 = [lx + 10, ly + 74, lw0 - 20, 276], b2 = [lx + 10, ly + 404, lw0 - 20, 156];
    view3D('pcb', t, b1[0], b1[1], b1[2], b1[3], { view: 'threeQuarter', view2d: 'top', target: [0, 6.2, 1.12], zoom: in2D(5.6, 8.2), yaw: 0.12 * Math.sin(t * 0.35), explode: sep, xray: 0 }, { alpha: ep(t, 0.4, 0.9) });
    view3D('pcb', t, b2[0], b2[1], b2[2], b2[3], { view: [-0.3, -1, 0.42], target: [0, 3.2, 1.12], zoom: 7.0, explode: sep, xray: 0 }, { alpha: ep(t, 0.8, 1.3) });
    gld_tag(lx + lw0 - 30, ly + 334, 'FrameSync-class, package not final', { align: 'right', alpha: ep(t, 1.4, 1.8) });
    line(lx + 26, ly + 360, lx + lw0 - 26, ly + 360, { color: C.hair, w: 1.5, alpha: ep(t, 0.8, 1.2) });
    text('From below: the clip-on lens, #37', lx + 26, ly + 394, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    /* right top: how fast a hand can move before a report runs out of digits */
    const rx = lx + lw0 + 40, rw = RM - rx, ch = 340;
    demoWindow(rx, ly, rw, ch, ep(t, 0.4, 0.8));
    cardHead(t, 0.5, rx, ly, rw, 'Fastest hand a report can carry', ['measured', 'derived']);
    const cx0 = rx + 110, cw0 = rw - 400, cy0 = ly + 92, ch0 = 150, xs = [400, 51200], ys = [10, 100000];
    const pts = (bits, hz) => { const out = []; for (let c = 400; c <= 51200 * 1.0001; c *= 1.12) out.push([c, Math.min(1e5, ((1 << (bits - 1)) - 1) * hz / c)]); out.push([51200, ((1 << (bits - 1)) - 1) * hz / 51200]); return out; };
    lineChart(t, {
      x: cx0, y: cy0, w: cw0, h: ch0, t0: 0.8, xr: xs, yr: ys, xlog: true, ylog: true, xticks: [400, 1600, 6400, 25600], yticks: [10, 100, 1000, 10000, 100000], xfmt: v => fmt(v), yfmt: v => (v >= 1000 ? fmt(v / 1000) + 'k' : String(v)),
      series: [
        { name: 'Rated 930 ips', pts: [[400, 930], [51200, 930]], color: C.comp, dash: [6, 5], w: 2, labelAt: 400, ldy: 26 },
        { name: '12-bit, V4 Pro', pts: pts(12, 1000), ref: true },
        { name: '16-bit, Theseus', pts: pts(16, 1000), hero: true }
      ]
    });
    text('CPI', cx0 + cw0 + 18, cy0 + ch0 + 34, { role: 'label', size: 19, color: C.mute, alpha: ep(t, 1.0, 1.4) });
    text('ips', cx0 - 14, cy0 - 16, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ep(t, 1.0, 1.4) });
    { const k = ep(t, 3.0, 3.5), xc = cx0 + cw0 * Math.log10(2201 / 400) / Math.log10(51200 / 400), yc = cy0 + ch0 - ch0 * Math.log10(930 / 10) / 4;
      circle(xc, yc, 7 * k, { fill: C.red }); circle(xc, yc, 14 * k, { color: C.red, w: 1.5, alpha: 0.5 * k });
      circle(rx + 34, ly + ch - 30, 6 * k, { fill: C.red });
      text('Above 2,201 CPI, a 12-bit report at 1 kHz can\'t carry 930 ips.', rx + 50, ly + ch - 22, { role: 'small', size: 25, weight: 600, color: C.red, alpha: k }); }
    /* right bottom: smoothing after the mouse lands */
    const sy = ly + ch + 16, sh = lh0 - ch - 16;
    demoWindow(rx, sy, rw, sh, ep(t, 0.7, 1.1));
    cardHead(t, 0.8, rx, sy, rw, 'Smoothing after a lift, ms', ['measured', 'claim', 'proposal']);
    [['Viper V4 Pro, wireless', 'TechPowerUp', 1500, false, true], ['PAW3950 and 3955 default', 'XBAB, 16 frames', 450, false, false], ['XBAB XA25', 'XBAB, 2 frames', 12, false, false], ['Theseus', 'Target', 0, true, false]].forEach(([nm, sub, v, hero, ref], i) => {
      const yy = sy + 86 + i * 32, tt = hero ? 5.4 : 1.2 + i * 0.2, a = ep(t, tt, tt + 0.4), bx = rx + 360, bw = rw - 360 - 430;
      if (a <= 0.003) return;
      text(nm, rx + 26, yy + 8, { role: 'small', size: 25, weight: hero ? 800 : 600, color: C.ink, alpha: a });
      const k = ep(t, tt + 0.1, tt + 0.9, E.snap), bl = Math.max(12, bw * v / 1500 * k);
      if (v > 0) rr(bx, yy - 6, bl, 12, 6, ref ? C.ink : C.comp, null, 0, a); else heroMark(bx + 8, yy, 10, a);
      text(fmt(Math.round(v * k)) + ' ms', bx + (v > 0 ? bl + 14 : 26), yy + 8, { font: 'mono', size: 23, weight: 700, color: hero ? C.heroText : C.ink, alpha: a });
      text(sub, RM - 26, yy + 7, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: a });
    });
    gloss(t, 6.0, '12-bit report', 'At most ±2,047 counts per report: at 1 kHz and 3,200 CPI, 2,047 × 1,000 ÷ 3,200 = 640 ips.');
    featureCard(t, 6.4, 'Full reports, no post-lift smoothing', ['proposal'], 'Report width and a smoothing test, published with the mouse. Nobody publishes either today.');
    source(t, 'TechPowerUp, Viper V4 Pro review (12-bit counts, smoothing). XBAB blog on PAW3950 and 3955 smoothing. Razer: 930 IPS. Curves derived on screen.', { t0: 3 });
  }
});

/* ============================== where the sensor sits (#27) ============================== */
S({
  id: 'gld_position', ch: 'glide', theme: 'paper', title: 'Where the sensor sits', settle: 10, ideas: [27],
  src: ['gld_kim20', 'chi2020', 'gld_baek26', 'gld_shell3d', 'gld_brock'],
  draw: t => {
    header(t, 'Where the sensor sits');
    captions(t, [[0.6, 'I wanted the sensor further forward. The best study of it found the centre beat both the front and the rear, across 14 gamers.'], [5.6, 'Setting each player\'s own best spot added about 4% more. So Theseus defaults to the centre, and the software can find yours.']]);
    const A = acc(), lx = LM, ly = LAY.top, lw0 = 560, lh0 = 568;
    demoWindow(lx, ly, lw0, lh0, ep(t, 0.2, 0.6), { grid: true });
    cardHead(t, 0.3, lx, ly, lw0, 'Positions tested', ['study']);
    /* the key plan, nose up, with the positions the study tested: 14.4 mm apart, front (0%) to rear (100%) */
    const kx = lx + 230, ky = ly + 312, s = 3.3, Y = z => ky - z * s;
    keyPlan(t, 0.4, kx, ky, { s: s / 1.18, hi: [], label: 'Sora V2 outline, to scale' });
    const ps = [[0, 36], [20, 21.6], [40, 7.2], [50, 0], [60, -7.2], [80, -21.6], [100, -36]];
    ps.forEach(([pc, z], i) => {
      const a = ep(t, 0.9 + i * 0.06, 1.2 + i * 0.06), main = pc === 0 || pc === 50 || pc === 100;
      line(kx - 24, Y(z), kx + 24, Y(z), { color: main ? C.ink2 : C.faint, w: main ? 2 : 1.2, alpha: a });
      if (main) text(pc === 0 ? 'Front, 0%' : pc === 50 ? 'Centre, 50%' : 'Rear, 100%', kx + 130, Y(z) + 8, { role: 'label', size: 21, color: C.ink2, alpha: a });
    });
    dim(t, 1.6, [kx + 40, Y(21.6)], [kx + 40, Y(7.2)], '14.4 mm', -16, { size: 22 });
    /* the sensor walks front → rear → centre; the chart on the right lights the same bar */
    const zNow = kf(t, [[1.3, 36], [2.0, 36], [2.7, -36], [3.3, -36], [4.0, 0]], E.io3), mk = ep(t, 1.0, 1.4);
    const cur = Math.abs(zNow - 36) < 2 ? 0 : Math.abs(zNow + 36) < 2 ? 2 : Math.abs(zNow) < 2 ? 1 : -1;
    circle(kx, Y(zNow), 12 * mk, { fill: A }); circle(kx, Y(zNow), 21 * mk, { color: A, w: 1.5, alpha: 0.5 * mk });
    gld_pulse(t, 4.4, [kx, Y(0)], 18, A);
    /* right: throughput and path deviation, the study's own numbers */
    const rx = lx + lw0 + 40, rw = RM - rx, cw = (rw - 40) / 2;
    [[rx, 'Throughput, bits/s', 'Higher is better', [5.16, 5.77, 4.97], [0, 6.5], [0, 2, 4, 6], ['−10.7%', 'Best', '−14.0%'], 2], [rx + cw + 40, 'Path deviation, px', 'Lower is better', [22.1, 18.0, 21.6], [0, 25], [0, 10, 20], ['+22.5%', 'Best', '+19.9%'], 1]].forEach(([x, lab, sub, vals, yr, ticks, deltas, dec], j) => {
      demoWindow(x, ly, cw, 396, ep(t, 0.4 + j * 0.2, 0.8 + j * 0.2));
      cardHead(t, 0.5 + j * 0.2, x, ly, cw, lab, ['study']);
      text(sub, x + 26, ly + 106, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 0.9, 1.3) });
      barChart(t, { x: x + 90, y: ly + 136, w: cw - 120, h: 160, t0: 0.9 + j * 0.3, yr, ticks, dec, frame: false, foot: false, vsize: 30, nsize: 26, barW: 0.5,
        bars: ['Front', 'Centre', 'Rear'].map((nm, i) => ({ name: nm, sub: deltas[i], v: vals[i], ref: i === 1, dim: t > 1.3 && cur >= 0 && cur !== i && i !== 1, color: i !== 1 && cur === i ? A : null })) });
    });
    /* each player's own best position: +4.1% over the centre */
    const cy = ly + 412, chh = lh0 - 412;
    demoWindow(rx, cy, rw, chh, ep(t, 0.9, 1.3));
    cardHead(t, 1.0, rx, cy, rw, 'Each player\'s own best spot', ['study']);
    [['At the centre', 5.798, false, 4.8], ['At their own best position', 6.034, true, 5.6]].forEach(([nm, v, hero, t0], i) => {
      const yy = cy + 86 + i * 34, a = ep(t, t0, t0 + 0.4), bx = rx + 400, bw = rw - 400 - 300;
      text(nm, rx + 26, yy + 8, { role: 'small', size: 25, weight: hero ? 800 : 600, color: C.ink, alpha: a });
      gld_bar(t, t0 + 0.1, bx, yy, bw, v, 6.5, { hero, ref: !hero, bh: 12, alpha: a });
      text(fmtN(v, 3) + ' bits/s' + (hero ? ', +4.1%' : ''), RM - 26, yy + 8, { font: 'mono', size: 23, weight: 700, color: hero ? C.heroText : C.ink, align: 'right', alpha: a });
    });
    gloss(t, 6.4, 'Throughput', 'Fitts\'s law speed, in bits per second: how hard the targets were, over how long they took.');
    featureCard(t, 6.8, 'Your optimum, centre by default', ['study', 'proposal'], 'The sensor sits at 50% of the length; finding yours takes the two-sensor option (#87).');
    source(t, 'Kim, Lee, van Gemert & Oulasvirta, "Optimal Sensor Position for a Computer Mouse", CHI 2020: 14 gamers, a mouse with a sliding sensor.', { t0: 3 });
  }
});

/* ============================== set in the mouse: virtual position and rotation, lift-off, X and Y (#87) ============================== */
S({
  id: 'gld_soft', ch: 'glide', theme: 'night', title: 'Set in the mouse', settle: 10, ideas: [87, 'lod', '{XY CPI}'],
  src: ['gld_kim20', 'gld_baek26', 'gld_paw3395', 'mkb3955', 'gld_razerFocus', 'tpu8k', 'gld_brock'],
  draw: t => {
    header(t, 'Set in the mouse');
    captions(t, [[0.6, 'Three settings that live in the mouse, not the PC: where the sensor seems to sit, when it stops tracking, and how each axis counts.'], [5.6, 'Rotation and lift-off already exist inside the sensor. Moving the sensor needs a second one, so that is an option, not a default.']]);
    const A = acc(), y = LAY.top, h = 568, gap = 24, w = (RM - LM - 2 * gap) / 3;
    const X0 = i => LM + i * (w + gap);
    /* 1. virtual position: the mouse turns about the wrist, so a point further forward moves further */
    { const x = X0(0); demoWindow(x, y, w, h, ep(t, 0.2, 0.6));
      cardHead(t, 0.3, x, y, w, '#87 · Virtual position', ['study']);
      const ang = 0.2 * Math.sin(Math.max(0, t - 1.0) * 1.1) * ep(t, 1.0, 1.6), kpS = 1.9, px = x + w / 2 - 20, py = y + 418;
      const rot = (dx, dy) => [px + dx * Math.cos(ang) - dy * Math.sin(ang), py + dx * Math.sin(ang) + dy * Math.cos(ang)];
      const L0 = 104 * kpS, mc = rot(0, -L0);      /* the mouse's centre 104 mm ahead of the wrist: an illustration */
      part(mc[0], mc[1], kpS, () => keyPlanMM({ hi: [] }), { alpha: ep(t, 0.4, 0.9), rot: ang });
      circle(px, py, 6, { fill: C.ink2, alpha: ep(t, 0.6, 1.0) }); text('Wrist', px + 14, py + 8, { role: 'label', size: 19, color: C.mute, alpha: ep(t, 0.6, 1.0) });
      line(px, py, mc[0], mc[1], { color: C.faint, w: 1.2, dash: [4, 4], alpha: ep(t, 0.6, 1.0) });
      const om = 0.22 * Math.cos(Math.max(0, t - 1.0) * 1.1) * ep(t, 1.0, 1.6), pp = kf(t, [[2.6, 0.5], [3.6, 0.0], [5.2, 1.0], [6.6, 0.5]]);
      [[36, 'Front'], [-36, 'Rear']].forEach(([dz, nm]) => {
        const r = L0 + dz * kpS, q = rot(0, -r), v = om * r * 0.6;
        circle(q[0], q[1], 7, { fill: C.ink2, alpha: ep(t, 1.0, 1.4) });
        arrow(q[0], q[1], q[0] + Math.cos(ang) * v, q[1] + Math.sin(ang) * v, { color: C.ink2, w: 2.5, hs: 10, alpha: ep(t, 1.2, 1.6) * clamp(Math.abs(v) / 8) });
        text(nm, q[0] - 76, q[1] + 7, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ep(t, 1.0, 1.4) });
      });
      { const r = L0 + (36 - 72 * pp) * kpS, q = rot(0, -r), v = om * r * 0.6, k = ep(t, 2.6, 3.0);
        circle(q[0], q[1], 9 * k, { fill: A }); arrow(q[0], q[1], q[0] + Math.cos(ang) * v, q[1] + Math.sin(ang) * v, { color: A, w: 3, hs: 11, alpha: k * clamp(Math.abs(v) / 8) });
        text('p ' + Math.round(pp * 100) + '%', q[0] + 76, q[1] + 8, { role: 'label', size: 21, color: A, alpha: k }); }
      text('x(p) = (1 − p)·x_front + p·x_rear', x + 26, y + 470, { font: 'mono', size: 23, weight: 600, color: C.ink, alpha: ep(t, 3.0, 3.4) });
      text('One sensor can\'t see the turn; two can. Calibration: 1 h → 5 min.', x + 26, y + 506, { role: 'small', size: 25, color: C.mute, maxW: w - 52, lh: 1.28, alpha: ep(t, 3.3, 3.7) });
    }
    /* 2. lift-off: one threshold going up, another coming down, set in fine steps */
    { const x = X0(1); demoWindow(x, y, w, h, ep(t, 0.4, 0.8));
      cardHead(t, 0.5, x, y, w, 'Lift-off, set apart', ['proposal']);
      const padY = y + 300, S2 = 70, up = 1.15, dn = 0.75, ph = cyc(t, 1.2, 4.0), hgt = ph < 0 ? 0 : 1.6 * Math.pow(Math.sin(Math.PI * ph), 2), rising = ph >= 0 && ph < 0.5;
      const tracking = rising ? hgt < up : hgt < dn;
      line(x + 26, padY, x + w - 26, padY, { color: C.ink2, w: 2, alpha: ep(t, 0.7, 1.1) });
      text('Pad', x + w - 26, padY + 26, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ep(t, 0.7, 1.1) });
      [[up, 'Lift-off'], [dn, 'Landing']].forEach(([v, nm], i) => { const yy = padY - v * S2, a = ep(t, 1.0 + i * 0.2, 1.4 + i * 0.2); line(x + 90, yy, x + w - 26, yy, { color: A, w: 1.5, dash: [6, 5], alpha: a }); text(nm + ' ' + fmtN(v, 2) + ' mm', x + w - 26, yy - 9, { role: 'label', size: 19, color: A, align: 'right', alpha: a }); });
      for (let k2 = 0; k2 <= 20; k2++) { const yy = padY - (0.7 + k2 * 0.05) * S2; line(x + 40, yy, x + (k2 % 2 ? 52 : 62), yy, { color: C.faint, w: 1.2, alpha: ep(t, 1.4, 1.8) }); }
      const mx = x + w / 2 - 30, my = padY - hgt * S2, ka = ep(t, 0.8, 1.2);
      rr(mx - 70, my - 40, 140, 34, 8, TH ? '#2a2b2e' : '#3a3b41', null, 0, ka);
      rr(mx - 64, my - 6, 128, 6, 3, '#d9d7d0', null, 0, ka);
      gld_lamp(x + 34, y + 112, tracking ? 'Tracking' : 'Stopped', tracking, tracking ? A : C.red, ep(t, 1.2, 1.6));
      text('Ticks: 0.05 mm', x + 34, y + 150, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 1.4, 1.8) });
      /* steps against the others: millimetres per step, shorter is finer */
      const by = y + 360, rowsL = [['PAW3395', 1.0, 'datasheet'], ['PAW3955', 0.1, 'claim'], ['Focus Pro Gen-3', null, 'claim'], ['Theseus', 0.05, 'proposal']];
      text('Step size, mm', x + 26, by, { role: 'label', size: 21, color: C.ink, alpha: ep(t, 2.0, 2.4) });
      text('Shorter is finer', x + w - 26, by, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ep(t, 2.0, 2.4) });
      rowsL.forEach(([nm, v, ev], i) => {
        const yy = by + 46 + i * 44, a = ep(t, 2.2 + i * 0.2, 2.6 + i * 0.2), hero = nm === 'Theseus', bx = x + 236, bw = w - 236 - 110;
        text(nm, x + 26, yy + 8, { role: 'small', size: 25, weight: hero ? 800 : 600, color: C.ink, alpha: a });
        if (v == null) { G.save(); G.globalAlpha = a; G.setLineDash([5, 4]); rrPath(bx, yy - 6, bw * 0.5, 12, 6); G.strokeStyle = C.faint; G.lineWidth = 1.5; G.stroke(); G.restore(); text('26 levels', bx + bw * 0.5 + 12, yy + 7, { role: 'label', size: 19, color: C.faint, alpha: a }); }
        else { const bl = Math.max(10, bw * v * ep(t, 2.3 + i * 0.2, 3.0 + i * 0.2, E.snap)); rr(bx, yy - 6, bl, 12, 6, hero ? C.hero : C.comp, null, 0, a); text(fmtN(v, v < 0.1 ? 2 : 1), bx + bl + 12, yy + 8, { font: 'mono', size: 23, weight: 700, color: hero ? C.heroText : C.ink, alpha: a }); }
        evDot(x + w - 30, yy, ev, 5, a);
      });
    }
    /* 3. X and Y apart: a round hand path turns into an oval when the axes count differently */
    { const x = X0(2); demoWindow(x, y, w, h, ep(t, 0.6, 1.0));
      cardHead(t, 0.7, x, y, w, 'X and Y apart', ['derived']);
      const cxL = x + 150, cxR = x + w - 170, cyy = y + 226, R = 78, ang = (t - 1.0) * 1.4, k = ep(t, 1.0, 1.5), cx = 800, cyc2 = lerp(800, 640, ep(t, 2.0, 3.0, E.io3));
      circle(cxL, cyy, R, { color: C.faint, w: 1.5, dash: [4, 4], alpha: k });
      G.save(); G.globalAlpha = k; G.beginPath(); G.ellipse(cxR, cyy, R * cx / 800, R * cyc2 / 800, 0, 0, TAU); G.setLineDash([4, 4]); G.strokeStyle = A; G.lineWidth = 1.5; G.stroke(); G.restore();
      circle(cxL + R * Math.cos(ang), cyy + R * Math.sin(ang), 8, { fill: C.ink2, alpha: k });
      circle(cxR + R * cx / 800 * Math.cos(ang), cyy + R * cyc2 / 800 * Math.sin(ang), 8, { fill: A, alpha: k });
      arrow(cxL + R + 20, cyy, cxR - R - 16, cyy, { color: C.mute, w: 2, hs: 10, alpha: k });
      text('Hand', cxL, cyy + R + 40, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: k });
      text('Cursor', cxR, cyy + R + 40, { role: 'label', size: 19, color: A, align: 'center', alpha: k });
      rich([{ s: 'X', role: 'label', size: 21, color: C.mute }, { s: '800', font: 'mono', size: 30, weight: 700, color: C.ink, gap: 10 }, { s: 'Y', role: 'label', size: 21, color: C.mute, gap: 26 }, { s: String(Math.round(cyc2)), font: 'mono', size: 30, weight: 700, color: A, gap: 10, tnum: true }, { s: 'CPI', role: 'label', size: 21, color: C.mute, gap: 12 }], x + 26, y + 392, { alpha: ep(t, 2.0, 2.4) });
      text('Each axis on its own, in 1-count steps, as the PAW3955 and Focus Pro allow.', x + 26, y + 436, { role: 'small', size: 25, color: C.ink2, maxW: w - 52, lh: 1.28, alpha: ep(t, 2.6, 3.0) });
      text('At 8 kHz, a report gets a count only above 8,000 ÷ CPI ips: X ' + fmtN(8000 / cx, 0) + ', Y ' + fmtN(8000 / cyc2, 1) + '.', x + 26, y + 520, { role: 'small', size: 25, color: C.mute, maxW: w - 52, lh: 1.28, alpha: ep(t, 3.2, 3.6) });
    }
    gloss(t, 6.2, 'Sensor rotation', 'Turning the X and Y axes a few degrees, so a straight sweep reads straight. The PAW3395 does it on chip.');
    featureCard(t, 6.6, 'Set in the mouse', ['proposal'], 'Rotation, lift, landing and each axis\'s count live on board, so they follow the mouse to any PC.');
    source(t, 'Kim et al., CHI 2020; Baek & Kim 2026 (calibration); PixArt (angle tunability); MathewKB; Razer. Lift and landing heights are illustrative.', { t0: 3 });
  }
});
