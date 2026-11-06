/* ============================== B08: Surface, a finish that grips and lasts (revamp v2, 2026-11-06) ==============================
   Nine slides, in film order: b08_card, b08_coating, b08_film, b08_uv, b08_grip, b08_gripmap, b08_tape, b08_twotone,
   b08_wheel. Before them: b07_sheet (the rest of the shell); after them: b09_card (wireless with no penalty).
   Every slide runs problem → fix → payoff under one input (handoff/revamp2/common.md, M1 to M10), and replaces the old
   surface slides (10-e-surface.js, 10-e2-surface.js), answering each clause of Brock's notes on them (FEEDBACK F27).
   Helpers here are prefixed b08_. The old chapter's macro engine (srf_field, srf_macro, srf_shade, srf_genFilm, srf_fbm,
   srf_vn, srf_hash, srf_fibres, srf_tip) and its SRC entries stay in the build and are called, not copied.
   Numbers: every figure is sourced (SRC below) or derived here in a comment; Brock's own figures carry no tag. */

Object.assign(SRC, {
  /* the coat: Cerakote's coverage convention, read from its own sheets (the old 0.49 g read F-110's coverage at the wrong film) */
  b08_c299: { t: 'Cerakote C-299 (C-Series, air cure) technical data: 1 mil recommended; theoretical coverage 924 ft² (58 % solids, 1604 × 0.58 at 1 mil); 1.28 g/mL; pencil hardness gouge 3H, scratch 3H (ASTM D3363); air cure: tack free 45 to 60 minutes, full cure 5 days; results on blasted steel', u: 'https://www.cerakoteeu.com/wp-content/uploads/2025/07/C-299.pdf' },
  b08_c192: { t: 'Cerakote C-192 Armor Black technical data: 1 mil recommended; 48 % solids; 772 ft² per gallon (1604 × 0.48 at 1 mil); 1.35 g/mL', u: 'https://www.cerakoteeu.com/?p=1120' },
  b08_coverage: { t: 'Derived here from Cerakote\'s own sheets: its theoretical coverage is per gallon at 1.0 mil (the H-167 sheet labels it "per Gallon at 1.0 Mil", 606 ft² at 38 % solids by weight; C-192 772 ft² at 48 %; C-299 924 ft² at 58 %: each is 1604 ft² × solids). So F-110\'s 604 ft² is a 1 mil figure: 3.785 L × 1.44 g/mL × 38 % = 2.07 kg of solids over 56.1 m² = 36.9 g/m² per mil, 27.7 g/m² at the 0.75 mil standard film, 0.37 g over the shell\'s 133 cm². The old slide read 604 ft² as a 0.75 mil figure and got 0.49 g.', u: '', n: 'Cerakote counts its solids by weight in the coverage formula; a weighed shell would settle the last digit (open with Brock since F21.10).' },
  b08_iso15184: { t: 'ISO 15184:1998, paints and varnishes, scratch hardness by pencil test: the lead squared flat, held at (45 ± 1)°, the tip loaded with (750 ± 10) g, pushed at least 7 mm at 0.5 to 1 mm/s; the pencil hardness is the hardest pencil that does not mark the coating', u: 'https://cdn.standards.iteh.ai/samples/25759/9e1251dca2bf4d5ca72a4e7bafb2bcb7/ISO-15184-1998.pdf' },
  b08_clay: { t: 'The Pottery Wheel, "What Happens to Clay When it is Fired in a Kiln?": unfired greenware "will dissolve, or \'slake down\' in the water"; "Bisque ware does not dissolve in water"; clay is "often bisque fired up to 1823F (995C), which is referred to as cone 06", by which point it "has been turned from clay to ceramic material"', u: 'https://thepotterywheel.com/what-happens-to-clay-when-it-is-fired/' },
  b08_pur: { t: 'Cultural Heritage Agency of the Netherlands, plastics identification tool, polyurethane ester: "Soft PUR esters undergo mainly hydrolysis"; esters "become tacky and lose their flexibility"', u: 'https://plastic-en.tool.cultureelerfgoed.nl/plastics/detail/PUR%20ester%20soft', n: 'The tool describes foams; soft-touch coatings are polyurethanes too, and the same hydrolysis is why they turn sticky.' },
  b08_doc16: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse", idea 16: a "baked ceramic coating" against PMM\'s "air dry ceramic coating", which "despite being extremely grippy, had durability issues"; "a dried clay pot is weaker than a pot put in a kiln"; the rubberized coating\'s "susceptibility to being rubbed off"; on polypropylene Cerakote "relies on how the surface is sanded rather than the material composition for its bond"', u: '', n: 'Brock\'s own document.' },
  /* directional grip */
  b08_zhang17: { t: 'Zhang, Zeng, Igartua, Rodriguez-Vidal & van der Heide 2017, Tribology Letters 65(3): laser-textured stainless steel against a fingertip (right index, one subject, dry skin, 17 mm/s). Grooves 20 µm wide, 10 µm deep, 25 µm apart: friction across them 0.51, 0.50, 0.50, 0.51, 0.53 and along them 0.41, 0.47, 0.44, 0.42, 0.42 at 0.2 to 1.0 N; at 45° 0.50 to 0.41. A pillar grid gave 0.23 to 0.27 every way ("orientation independent")', u: 'https://research.utwente.nl/files/17961970/Zhang2017texture.pdf', n: 'At 1 N: across 0.53, along 0.42, diagonal 0.41 (+26 %); over 0.2 to 1 N across beats along by 6 to 26 %. A coarser groove on tool steel (Zhang 2015) gripped more along: the direction is set by the groove\'s size, which is why the etch is specified, not just "grooved".' },
  b08_zhang15: { t: 'Zhang, Rodriguez Urribarri, Morales Hurtado, Zeng & van der Heide 2015, International Journal of Solids and Structures 56-57: 53-61: a grooved channel texture on tool steel; there, sliding parallel to the grooves gave the higher friction', u: 'https://research.utwente.nl/en/publications/the-role-of-the-sliding-direction-against-a-grooved-channel-textu/' },
  /* grip tape: thickness, and what it does in use */
  b08_tape05: { t: 'Mouse grip tapes at 0.5 mm: Lizard Skins DSP, Pulsar SuperGrip, Pwnage UltraGrip, TalonGames (NerdTechy roundup of mouse grip tapes; "Ultra-thin 0.5 mm tapes preserve your natural hand movement"; advice to "keep edges slightly curved to prevent lifting")', u: 'https://nerdtechy.com/?p=82833' },
  b08_tape03: { t: 'TalonGames PU-0 universal grip tape: "only 0.3 mm of high-quality polyurethane", on a 3M adhesive (MaxGaming listing); Keychron pre-cut universal mouse grip tape: an "ultra-thin 0.3 mm profile" on a "substrate-free double-sided adhesive"', u: 'https://www.maxgaming.com/en/mouse-skates/talongames-pu-0-universal-03mm-ultra-thin-mouse-grip-tape' },
  b08_peel: { t: 'Best Buy owner review of the Razer Universal Grip Tape (2 stars): "This stuff looses its stick and becomes unpeeled after a month of use."', u: 'https://www.bestbuy.com/site/reviews/razer-universal-grip-tape-clear/6460398', n: 'An owner\'s report, not a measurement.' },
  /* yellowing */
  b08_ulx: { t: 'r/FinalMouse, "ULX Clix" (2025, owners comparing white and pale editions): yellowing "was a huge problem with the aceu"; a Tarik Pro Series "was known to yellow very badly"; owners blame sweat, lotions and the Pro Series\' "different more grippy coating"', u: 'https://reddit.birdcat.cafe/r/FinalMouse/comments/1kbw8sj/ulx_clix', n: 'Owner reports, not a measurement; the stain is as much sweat and skin products as sunlight.' }
});

/* ---------- the numbers, in one place ---------- */
const B08 = {
  /* Cerakote F-110 at its standard 0.75 mil (19.05 µm): 36.9 g/m² per mil (b08_coverage) × 0.75 = 27.7 g/m²; the shell's
     coated area 133 cm² (srf_scan) → 0.368 g. Soft-touch: RadTech's 2 mil (51 µm) test film at 1.0 g/cm³ or more → 0.68 g. */
  film: { um: 19, mil: 0.75, gm2: 36.914 * 0.75, cm2: 133, softUm: 51, softRho: 1.0, oldG: 0.49 },
  /* fingertip friction on laser grooves, Zhang 2017 at 1 N: across, along, diagonal */
  mu: { across: 0.53, along: 0.42, diag: 0.41, load: 1.0 },
  /* Derler 2012, skin on glass, wet: smooth 0.61, roughened 1.43 */
  wet: { smooth: 0.61, rough: 1.43 },
  /* tapes, thinnest first is the chase */
  tapes: [{ who: 'Lizard Skins DSP', mm: 0.5 }, { who: 'Pulsar SuperGrip', mm: 0.5 }, { who: 'TalonGames PU-0', mm: 0.3 }, { who: 'Keychron', mm: 0.3 }],
  /* pencil grades, softest first (ASTM D3363 / ISO 15184 scale) */
  grades: ['6B', '5B', '4B', '3B', '2B', 'B', 'HB', 'F', 'H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H'],
  wheel: { g: 0.9, pmm: 1.0 }
};
B08.film.g = B08.film.gm2 * B08.film.cm2 / 1e4;                          /* 0.368 g */
B08.film.softG = B08.film.softUm * B08.film.softRho * B08.film.cm2 / 1e4;  /* 0.678 g */
B08.mu.gain = B08.mu.across / B08.mu.along - 1;                            /* +0.262 */
B08.lift = (() => { const mg = 0.02931 * 9.81; return { smooth: mg / (2 * B08.wet.smooth), rough: mg / (2 * B08.wet.rough), mg }; })();

/* ============================== shared helpers (b08_) ============================== */
/** dev slides (a lab for the helpers) register only with ?b08lab=1, so no other build ever sees them */
const B08LAB = (() => { try { return /[?&]b08lab=1\b/.test(location.search); } catch (e) { return false; } })();
/** an arrow for a force, with its value beside the head: (x, y) the tail, ang the direction, len px.
   o = { a, col, w, label, lcol, side (1 | -1: which side of the shaft the label sits), size } */
function b08_force(x, y, ang, len, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003 || len < 2) return;
  const c = Math.cos(ang), s = Math.sin(ang), x2 = x + c * len, y2 = y + s * len, col = o.col || C.hero, w = o.w || 5;
  arrow(x, y, x2, y2, { color: col, w, hs: Math.min(o.hs || 20, len * 0.6), alpha: a });
  if (o.label) {
    const sd = o.side || 1, nx = -s * sd, ny = c * sd, lx = (x + x2) / 2 + nx * (o.off || 26), ly = (y + y2) / 2 + ny * (o.off || 26) + 8;
    text(o.label, lx, ly, { role: 'label', size: o.size || 21, color: o.lcol || col, align: Math.abs(nx) < 0.3 ? 'center' : nx > 0 ? 'left' : 'right', alpha: a });
  }
}
/** a coil spring between two points (a pull you can see): n coils, amplitude amp px. Drawn flat, in ink */
function b08_spring(x1, y1, x2, y2, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const L = Math.hypot(x2 - x1, y2 - y1); if (L < 2) return;
  const ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = -uy, ny = ux, n = o.n || 7, amp = o.amp || 9, lead = Math.min(14, L * 0.18);
  G.save(); G.globalAlpha = a; G.strokeStyle = o.col || C.ink2; G.lineWidth = o.w || 2.4; G.lineJoin = 'round'; G.lineCap = 'round';
  G.beginPath(); G.moveTo(x1, y1); G.lineTo(x1 + ux * lead, y1 + uy * lead);
  const body = L - 2 * lead, steps = n * 2;
  for (let i = 1; i <= steps; i++) { const d = lead + body * (i - 0.5) / steps, sd = i % 2 ? 1 : -1; G.lineTo(x1 + ux * d + nx * amp * sd, y1 + uy * d + ny * amp * sd); }
  G.lineTo(x2 - ux * lead, y2 - uy * lead); G.lineTo(x2, y2); G.stroke();
  G.restore();
}
/** a fingertip's contact patch from above, drawn as its print: a whorl of papillary ridges inside the patch, mono grey
   (Brock, F9.24: skin is never peach). (x, y) the centre, r its half-width. o = { a, rot (the finger's long axis),
   shear: [dx, dy] px (skin dragged by a pull it resists: the patch leans toward the pull), slide (0..1: a smear
   behind a sliding patch, toward -dir), dir (radians), ink } */
function b08_print(x, y, r, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const ink = o.ink || (TH ? '#2E2E2C' : '#F3F2EE'), sh = o.shear || [0, 0], ry = r * 0.78;
  G.save(); G.globalAlpha = a; G.translate(x, y);
  /* the shear: the far side of the patch held by friction, the near side carried by the finger */
  G.transform(1, 0, sh[0] / (2 * ry), 1 + sh[1] / (2 * ry), 0, 0);
  G.rotate(o.rot || 0);
  const patch = () => { G.beginPath(); G.ellipse(0, 0, r, ry, 0, 0, TAU); };
  patch(); G.fillStyle = rgba(ink, TH ? 0.12 : 0.13); G.fill();
  G.save(); patch(); G.clip();
  /* a loop pattern, as most fingertips have: the innermost ridges are horseshoes round a core above the centre, open
     toward the finger's tip (down here); outside them the ridges run round the whole pad, so no ridge crosses another */
  G.strokeStyle = rgba(ink, TH ? 0.42 : 0.38); G.lineWidth = Math.max(1.1, r / 60); G.lineCap = 'round';
  const sp = r / 11.5, cx0 = r * 0.05, cy0 = -ry * 0.1;
  G.beginPath();
  for (let i = 1; i <= 16; i++) {
    const rr = sp * i, open = i <= 4 ? 0.62 - 0.1 * i : 0, k1 = 56;
    for (let k = 0; k <= k1; k++) { const th = Math.PI / 2 + open + (TAU - 2 * open) * k / k1, px = cx0 + rr * 1.06 * Math.cos(th), py = cy0 + rr * 0.9 * Math.sin(th); k ? G.lineTo(px, py) : G.moveTo(px, py); }
  }
  G.stroke();
  G.restore();
  patch(); G.strokeStyle = rgba(ink, 0.88); G.lineWidth = 2.2; G.stroke();
  G.restore();
  if (o.slide > 0.003) {
    const d = o.dir || 0, bx = -Math.cos(d), by = -Math.sin(d);
    G.save(); G.globalAlpha = a * o.slide * 0.5; G.strokeStyle = rgba(ink, 0.6); G.lineWidth = 1.6; G.lineCap = 'round';
    for (let i = -3; i <= 3; i++) { const px = x - Math.sin(d) * i * r * 0.22, py = y + Math.cos(d) * i * r * 0.22, L = r * (0.5 + 0.3 * Math.cos(i)); G.beginPath(); G.moveTo(px + bx * r * 0.95, py + by * ry * 0.95); G.lineTo(px + bx * (r * 0.95 + L), py + by * (ry * 0.95 + L)); G.stroke(); }
    G.restore();
  }
}
/** grip tape as a height field: raised triangles of soft rubber between three families of channels at 60° (Lizard Skins
   DSP's pattern: owners find "dead skin does get stuck in the triangles"), with a matte grain. o = { pitch, width, seed } */
function b08_genTape(f, o = {}) {
  const { w, h } = f, P = o.pitch || 24, Wd = o.width || 5.5, seed = o.seed || 6, col = o.col || [52, 53, 58];
  const fam = [0, Math.PI / 3, 2 * Math.PI / 3].map(a => [Math.cos(a), Math.sin(a)]);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x, i = p * 3;
    let ch = 0;
    /* three families of channels through the same lattice points (lines at c = kP), so the plateaus are triangles */
    for (const [ca, sa] of fam) { const c = -x * sa + y * ca, q = ((c % P) + P) % P, d = Math.min(q, P - q), hw = Wd / 2; ch = Math.max(ch, d < hw * 1.6 ? clamp(1 - (d - hw * 0.6) / hw) : 0); }
    const k = ch * ch * (3 - 2 * ch), grain = 0.55 * srf_fbm(x / 5, y / 5, seed, 2) + 0.25 * (srf_hash(x, y, seed + 2) - 0.5);
    f.z0[p] = 3.2 * (1 - k) + grain;
    const v = 5 * srf_vn(x / 4, y / 4, seed + 9) - 9 * k;
    for (let j = 0; j < 3; j++) f.a0[i + j] = col[j] + v;
    f.g0[p] = 0.1 + 0.06 * (1 - k);
  }
  Object.assign(f.mat, { amb: 0.15, kd: 1.05, ks: 0.22, sh: 10, rz: 1.25, aoR: 4, aoK: 0.3, kf: 0.22 });
}

/* ============================== lab (dev only, ?b08lab=1) ============================== */
if (B08LAB) S({
  id: 'b08_lab', ch: 'surface', theme: 'night', title: 'B08 lab', settle: 6,
  draw: t => {
    header(t, 'B08 lab: macro fields');
    const tf = srf_field('b08:tape', 520, 400, f => b08_genTape(f, { pitch: 30, width: 7 }));
    const rf = srf_field('b08:ridge', 520, 400, f => srf_genFilm(f, { pat: 'ridge', pitch: 22, width: 12, depth: 4.2, ang: 0, seed: 5, col: [40, 41, 46], ecol: [92, 94, 102] }));
    const L = { p: [520 * 0.2, -400 * 0.4, 400 * 0.5] };
    srf_macro(t, tf, 80, 300, 820, 620, { light: L, vignette: true });
    srf_macro(t, rf, 1000, 300, 840, 620, { light: L, vignette: true });
    b08_print(490, 610, 130, { a: 1, rot: 0.1, shear: [0, 26] });
    b08_print(1420, 640, 130, { a: 1, rot: 0.1, slide: 1, dir: 0 });
    b08_spring(490, 610 + 102, 490, 610 + 230, { a: 1 });
    b08_force(1420, 640, Math.PI, 90, { a: 1, label: '0.42 N' });
  }
});

/* ---------- evenly spaced streamlines of a direction field (Jobard & Lefer 1997), for the grip map ----------
   The etch's ridges run across the slip each zone must stop, so the ridge direction is a field over the shell: it turns
   smoothly from zone to zone, and the spacing and the dash (line → dashes → dots) change with it. Lines are traced in mm
   from seeds, kept a local spacing apart, and cached by key. dom = { x0, y0, x1, y1, inside(x, y) }; field(x, y) →
   { ang (the ridge direction, radians, a line, so ang and ang + π are the same), sep (mm), on (0..1, 0 = smooth) }.
   Returns [{ pts: [[x, y, on, dot], ...] }]. */
const B08_SL = new Map();
function b08_streams(key, dom, field, o = {}) {
  if (B08_SL.has(key)) return B08_SL.get(key);
  const lines = [], cell = o.cell || 0.6, grid = new Map(), dtest = o.dtest || 0.55, maxN = o.maxPts || 1200;
  const gk = (x, y) => Math.floor(x / cell) + ',' + Math.floor(y / cell);
  const add = (x, y, li) => { const k = gk(x, y); let c = grid.get(k); if (!c) grid.set(k, c = []); c.push([x, y, li]); };
  /* the nearest sample of any line but `skip` (the line being traced ignores its own recent points) */
  const near = (x, y, r, li, ownFrom) => {
    const n = Math.ceil(r / cell), cx = Math.floor(x / cell), cy = Math.floor(y / cell);
    for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) { const c = grid.get((cx + i) + ',' + (cy + j)); if (!c) continue;
      for (const q of c) { if (q[2] === li && (ownFrom == null || q[3] == null)) continue; if (Math.hypot(q[0] - x, q[1] - y) < r) return true; } }
    return false;
  };
  /* direction at a point, kept consistent with the previous step (the field is a line field) */
  const dirAt = (x, y, px, py) => { const f = field(x, y); let dx = Math.cos(f.ang), dy = Math.sin(f.ang); if (dx * px + dy * py < 0) { dx = -dx; dy = -dy; } return [dx, dy, f]; };
  const trace = (sx, sy, li) => {
    const f0 = field(sx, sy); if (!(f0.on > 0.02) || !dom.inside(sx, sy)) return null;
    const out = [];
    for (const sg of [1, -1]) {
      let x = sx, y = sy, px = Math.cos(f0.ang) * sg, py = Math.sin(f0.ang) * sg; const run = [];
      for (let n = 0; n < maxN; n++) {
        const h = Math.max(0.12, field(x, y).sep * 0.22);
        const [d1x, d1y] = dirAt(x, y, px, py), mx = x + d1x * h / 2, my = y + d1y * h / 2, [d2x, d2y] = dirAt(mx, my, d1x, d1y);
        const nx = x + d2x * h, ny = y + d2y * h, f = field(nx, ny);
        if (!dom.inside(nx, ny) || !(f.on > 0.02) || near(nx, ny, f.sep * dtest, li)) break;
        run.push([nx, ny, f.on, f.dot || 0]); x = nx; y = ny; px = d2x; py = d2y;
      }
      if (sg > 0) out.push(...run); else out.unshift(...run.reverse());
      if (sg > 0) out.unshift([sx, sy, f0.on, f0.dot || 0]);
    }
    return out.length > 3 ? out : null;
  };
  const queue = [];
  const seeds = o.seeds || [[(dom.x0 + dom.x1) / 2, (dom.y0 + dom.y1) / 2]];
  const start = (sx, sy) => {
    /* a seed one spacing off its parent line must pass a test a little looser than that spacing, or a field whose
       spacing grows away from the parent never fills (the spacing at the seed is larger than the offset that placed it) */
    const f = field(sx, sy); if (!(f.on > 0.02) || !dom.inside(sx, sy) || near(sx, sy, f.sep * 0.82, -1)) return;
    const li = lines.length, pts = trace(sx, sy, li); if (!pts) return;
    lines.push({ pts }); for (const q of pts) add(q[0], q[1], li); queue.push(li);
  };
  for (const s0 of seeds) start(s0[0], s0[1]);
  for (let guard = 0; guard < 6000; guard++) {
    if (!queue.length) {
      /* a field cut into islands: scan for an unfilled spot */
      let found = false;
      for (let y = dom.y0; y <= dom.y1 && !found; y += 1.2) for (let x = dom.x0; x <= dom.x1 && !found; x += 1.2) { const f = field(x, y); if (f.on > 0.02 && dom.inside(x, y) && !near(x, y, f.sep * 1.4, -1)) { start(x, y); found = queue.length > 0; } }
      if (!found) break;
      continue;
    }
    const li = queue.shift(), pts = lines[li].pts;
    for (let i = 0; i < pts.length; i += 2) {
      const [x, y] = pts[i], j = Math.min(pts.length - 1, i + 1), tx = pts[j][0] - pts[Math.max(0, j - 1)][0], ty = pts[j][1] - pts[Math.max(0, j - 1)][1], tl = Math.hypot(tx, ty) || 1;
      const sep = field(x, y).sep;
      for (const sd of [1, -1]) start(x - ty / tl * sep * sd, y + tx / tl * sep * sd);
    }
  }
  B08_SL.set(key, lines);
  return lines;
}
/** draw streamlines through a mm → stage transform M (a 2D affine [a, b, c, d, e, f]): each line dashed by its points'
   dot value (0 = a solid line, 1 = dots), its width and alpha by `on`. reveal(x, y) → 0..1 lets a laser write them.
   o = { col, w (px at on = 1), dashMM (a dash's length when dot = 0.6), alpha } */
function b08_drawStreams(lines, M, o = {}) {
  const P = (x, y) => [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]], col = o.col || C.hero, w0 = o.w || 2.2, a0 = o.alpha == null ? 1 : o.alpha;
  if (a0 <= 0.003) return;
  const sc = Math.hypot(M[0], M[1]), rev = o.reveal || null;
  G.save(); G.strokeStyle = col; G.lineCap = 'round'; G.lineJoin = 'round';
  for (const L of lines) {
    const pts = L.pts; let inDash = true, left = Infinity;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1], p1 = pts[i], dot = (p0[3] + p1[3]) / 2, on = (p0[2] + p1[2]) / 2, seg = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
      const rv = rev ? rev((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2) : 1; if (rv <= 0.001 || on < 0.03) { inDash = true; left = Infinity; continue; }
      /* solid below dot 0.15; above it dashes that shorten to points (a zero-length dash with round caps is a dot) */
      const dashL = dot < 0.15 ? Infinity : (o.dashMM || 1.5) * Math.pow(1 - dot, 1.7), gapL = (o.gapMM || 0.95) * (0.55 + 0.6 * dot);
      if (inDash) left = Math.min(left, dashL); else if (dot < 0.15) { inDash = true; left = Infinity; } else left = Math.min(left, gapL);
      let s0 = 0, guard = 0;
      while (s0 < seg - 1e-6 && guard++ < 400) {
        const step = Math.min(seg - s0, left);
        if (inDash) {
          const ka = s0 / seg, kb = (s0 + step) / seg, qa = P(lerp(p0[0], p1[0], ka), lerp(p0[1], p1[1], ka)), qb = P(lerp(p0[0], p1[0], kb), lerp(p0[1], p1[1], kb));
          G.globalAlpha = a0 * clamp(on * 1.15) * rv; G.lineWidth = Math.max(0.8, w0 * (0.55 + 0.45 * on) * (1 + 0.75 * dot));
          G.beginPath(); G.moveTo(qa[0], qa[1]); G.lineTo(qb[0] + (step < 1e-3 ? 0.01 : 0), qb[1]); G.stroke();
        }
        s0 += step; left -= step;
        if (left <= 1e-6) { inDash = !inDash; left = inDash ? dashL : gapL; }
      }
    }
  }
  G.restore();
}

/* ---------- the grip map's two fields: the top (key-plan mm: x across, y = −Z, nose up) and the thumb side (the shell twin's
   side plane: u = Z, nose +, v = Y up). Each returns { ang, sep, on, dot } ---------- */
/** the top: side-to-side ridges on the buttons where the fingertips pull the mouse back, bending to run front to back as
   they wrap over the shoulders onto the sides (the lift's ridges), opening up and fading out toward the palm */
function b08_fieldTop(x, y) {
  const hw = Math.max(1, keyHalfW(y)), e = smooth(clamp((Math.abs(x) / hw - 0.66) / 0.3));
  const ang = Math.sign(x || 1) * e * Math.PI / 2;
  const tip = Math.exp(-Math.pow((y + 34) / 15, 2));                               /* where the fingertips rest */
  const sep = lerp(1.55, 0.95, tip) + 0.9 * smooth(clamp((y + 2) / 26));
  const on = 1 - smooth(clamp((y - 2) / 20)) * (1 - 0.85 * e);                        /* the palm goes smooth; the sides keep theirs */
  return { ang, sep, on, dot: 0 };
}
function b08_insideTop(x, y) {
  if (Math.abs(x) > keyHalfW(y) - 1.2) return false;
  if (y < KEY.seam && Math.abs(x) < 0.9) return false;                               /* the centre split */
  const W = KEY.wheel; if (x > W[0] - 1.4 && x < W[0] + W[2] + 1.4 && y > W[1] - 1.4 && y < W[1] + W[3] + 1.4) return false;
  return true;
}
/** the thumb side: the thumb's rest is a field of dots (it pushes, lifts and pulls: it needs grip every way); round it the
   dots stretch into dashes and then into the front-to-back ridges that carry the lift up the side */
function b08_fieldSide(u, v) {
  const d = Math.hypot((u + 8) / 1.5, v - 11) / 13, dot = 1 - smooth(clamp(d * 1.1 - 0.35));
  const ang = 0.06 * Math.sin(u / 18) + 0.18 * smooth(clamp((v - 20) / 10)) * Math.sign(u - 10);
  const sep = lerp(1.45, 1.75, dot) + 0.5 * smooth(clamp((v - 24) / 8));
  const on = (1 - smooth(clamp((u + 46) / -8))) * (1 - smooth(clamp((u - 44) / 10))) * (1 - 0.0 * dot);
  return { ang, sep, on, dot };
}
if (B08LAB) S({
  id: 'b08_lab2', ch: 'surface', theme: 'night', title: 'B08 lab 2', settle: 6,
  draw: t => {
    header(t, 'B08 lab: grip map streams');
    /* top view, key plan mm, 6 px/mm */
    const s = 6.2, cx = 520, cy = 620, M = [s, 0, 0, s, cx, cy];
    part(cx, cy, s, () => { keyPath(); G.fillStyle = '#26272B'; G.fill(); G.strokeStyle = 'rgba(243,242,238,0.5)'; G.lineWidth = lw(1.5); G.stroke(); });
    const domT = { x0: -31, y0: -59, x1: 31, y1: 59, inside: b08_insideTop };
    const LT = b08_streams('lab:top', domT, b08_fieldTop, { seeds: [[13, -34], [-13, -34]] });
    b08_drawStreams(LT, M, { w: 2.0 });
    /* side view from the twin */
    const V = srf_shellView('left', 1380, 660, 7.0); if (!V) return;
    srf_vFill(V, V.path(/^body\/body$/), '#26272B', 'rgba(243,242,238,0.5)', 1.6, 1);
    const sideP = V.path(/^body\/body$/), cv = document.createElement('canvas').getContext('2d');
    const domS = { x0: -60, y0: 0, x1: 60, y1: 40, inside: (u, v) => cv.isPointInPath(sideP, u, v) && cv.isPointInPath(sideP, u + 1.4, v) && cv.isPointInPath(sideP, u - 1.4, v) && cv.isPointInPath(sideP, u, v + 1.4) && cv.isPointInPath(sideP, u, v - 1.4) };
    const LS = b08_streams('lab:side', domS, b08_fieldSide, { seeds: [[-8, 11], [10, 20]] });
    b08_drawStreams(LS, V.M, { w: 2.0 });
    text(LT.length + ' top lines, ' + LS.length + ' side lines', 80, 1000 - 20, { role: 'label', color: C.mute });
  }
});

/* ============================== the bake: pots, a kiln, flames, water, a pencil test ============================== */
/* A neck amphora's profile, radius against height, both as fractions of its height (foot, waist, belly, shoulder, neck,
   flared lip): a wheel-thrown pot of the kind Greek potters fired in updraft kilns (Theseus's own era's ware) */
const B08_AMP = [[0, 0.118], [0.022, 0.125], [0.045, 0.116], [0.06, 0.104], [0.1, 0.142], [0.2, 0.213], [0.32, 0.268], [0.45, 0.303],
  [0.56, 0.316], [0.65, 0.304], [0.72, 0.268], [0.77, 0.205], [0.8, 0.152], [0.86, 0.128], [0.92, 0.125], [0.95, 0.134], [0.975, 0.158], [1, 0.156]];
/** the profile's radius at height fraction u, interpolated smoothly (Catmull-Rom through B08_AMP) */
function b08_ampR(u) {
  const P = B08_AMP; u = clamp(u);
  let i = 1; while (i < P.length - 1 && P[i][0] < u) i++;
  const p0 = P[Math.max(0, i - 2)], p1 = P[i - 1], p2 = P[i], p3 = P[Math.min(P.length - 1, i + 1)], k = (u - p1[0]) / Math.max(1e-6, p2[0] - p1[0]);
  const k2 = k * k, k3 = k2 * k;
  return 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * k + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * k2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * k3);
}
/**
 * A pot in elevation, base centre (cx, by), H px tall. o = { a, fired (0 unfired clay, matte and pale → 1 fired, a dark
 * gloss), heat (0..1, the kiln's light on it from below), slake (0..1: unfired clay in water slumps back to mud), wet (0..1:
 * water running off a fired pot), t, key (a meander band round the belly, default true) }. Mono greys (no terracotta:
 * the deck's palette is neutral); the fire's light is the only warm colour on it.
 */
function b08_amphora(cx, by, H, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const f = clamp(o.fired || 0), sl = clamp(o.slake || 0), heat = clamp(o.heat || 0), t = o.t || 0;
  /* slaking: the pot loses height and spreads at the foot, its outline eroding into a mound of mud */
  /* slaking: the profile relaxes toward a low mound of mud (a dome on a wide foot) and loses height; its edge erodes */
  const ks = E.io3(clamp((sl - 0.08) / 0.92)), hk = lerp(1, 0.3, ks), spread = 1 + 0.5 * ks;
  const ero = (u, s) => sl > 0 ? sl * H * 0.016 * (srf_vn(u * 9 + s * 3, t * 0.6, 41) + 0.6 * srf_vn(u * 23, s * 5, 43)) : 0;
  const mound = u => 0.31 * H * Math.pow(Math.max(0, 1 - Math.pow(u, 1.4)), 0.6);
  const R = (u, side) => Math.max(0, lerp(b08_ampR(u) * H, mound(u), ks) + ero(u, side));
  const Y = u => by - u * H * hk;
  const steps = 60, out = [];
  for (let i = 0; i <= steps; i++) { const u = i / steps; out.push([cx + R(u, 1), Y(u)]); }
  for (let i = steps; i >= 0; i--) { const u = i / steps; out.push([cx - R(u, -1), Y(u)]); }
  const body = () => { G.beginPath(); out.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.closePath(); };
  const Rm = 0.318 * H * spread;
  G.save(); G.globalAlpha = a;
  /* its shadow on the ground */
  { const sr = Math.max(R(0, 1), R(0.03, 1)) * 1.25, sg = G.createRadialGradient(cx, by + 1, 0, cx, by + 1, sr); sg.addColorStop(0, `rgba(0,0,0,${TH ? 0.22 : 0.4})`); sg.addColorStop(1, 'rgba(0,0,0,0)');
    G.save(); G.translate(0, by + 1); G.scale(1, 0.16); G.translate(0, -(by + 1)); G.fillStyle = sg; G.fillRect(cx - sr, by + 1 - sr, sr * 2, sr * 2); G.restore(); }
  /* the handles, behind the body's outline where they meet it: a thick loop from the neck to the shoulder */
  if (sl < 0.5) {
    const ha = a * (1 - sl * 2);
    for (const sd of [-1, 1]) {
      const p0 = [cx + sd * R(0.9, sd) * 0.92, Y(0.9)], p1 = [cx + sd * H * 0.255, Y(0.94)], p2 = [cx + sd * H * 0.282, Y(0.8)], p3 = [cx + sd * R(0.72, sd) * 0.96, Y(0.72)];
      G.save(); G.globalAlpha = ha; G.lineCap = 'round';
      G.beginPath(); G.moveTo(p0[0], p0[1]); G.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
      G.strokeStyle = mix('#8C8A83', '#1C1D21', f); G.lineWidth = H * 0.034; G.stroke();
      G.strokeStyle = mix('#C2BFB8', '#4A4C53', f); G.lineWidth = H * 0.012; G.stroke();
      G.restore();
    }
  }
  /* the body: clay (pale, matte) to fired gloss (dark), turned by the light across its width */
  const c0 = mix(mix('#BEBBB4', '#6E6B65', sl * 0.7), '#2A2B30', f), cS = mix(mix('#8A8781', '#4F4C47', sl * 0.7), '#121316', f), cH = mix(mix('#D4D1CA', '#85827C', sl * 0.7), '#5A5C64', f);
  const g = G.createLinearGradient(cx - Rm, 0, cx + Rm, 0);
  g.addColorStop(0, cS); g.addColorStop(0.18, c0); g.addColorStop(0.34, cH); g.addColorStop(0.62, c0); g.addColorStop(1, cS);
  body(); G.fillStyle = g; G.fill();
  G.save(); body(); G.clip();
  /* light from above: the shoulder catches it, the lower body turns away */
  const gv = G.createLinearGradient(0, Y(1), 0, by); gv.addColorStop(0, 'rgba(255,255,255,0.05)'); gv.addColorStop(0.3, 'rgba(255,255,255,0.08)'); gv.addColorStop(0.5, 'rgba(0,0,0,0)'); gv.addColorStop(1, 'rgba(0,0,0,0.28)');
  G.fillStyle = gv; G.fillRect(cx - Rm * 1.6, Y(1) - 4, Rm * 3.2, by - Y(1) + 8);
  /* throwing rings: the potter's fingers left shallow rings as the wheel turned */
  if (sl < 0.6) { G.strokeStyle = f > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(40,38,34,0.12)'; G.lineWidth = Math.max(1, H * 0.004);
    for (let u = 0.12; u < 0.76; u += 0.034) { const r0 = R(u, 1), yy = Y(u); G.beginPath(); G.ellipse(cx, yy, r0, r0 * 0.07, 0, 0, Math.PI); G.stroke(); } }
  /* a meander band round the belly, foreshortened as it wraps the curve (the labyrinth: Theseus's) */
  if (o.key !== false && sl < 0.7) {
    const u0 = 0.49, u1 = 0.56, kc = mix('#8E8B85', '#B8B6B0', f), n = 9, ka = (1 - sl / 0.7);
    G.strokeStyle = kc; G.globalAlpha = a * ka * (f > 0.5 ? 0.85 : 0.6); G.lineWidth = Math.max(1.2, H * 0.006); G.lineJoin = 'miter';
    const at = (ph, u) => { const r0 = R(u, 1), x = cx + r0 * Math.sin(ph), yy = Y(u) + r0 * 0.07 * Math.cos(ph); return [x, yy]; };
    for (const u of [u0 - 0.012, u1 + 0.012]) { G.beginPath(); for (let ph = -1.5; ph <= 1.5; ph += 0.05) { const q = at(ph, u); ph === -1.5 ? G.moveTo(q[0], q[1]) : G.lineTo(q[0], q[1]); } G.stroke(); }
    /* one meander unit: a square spiral, repeated round the band */
    const unit = [[0, 0], [0, 1], [0.8, 1], [0.8, 0.25], [0.3, 0.25], [0.3, 0.65], [0.55, 0.65], [0.55, 0.45]];
    for (let k = -n; k <= n; k++) {
      G.beginPath(); let st = false;
      for (const [px, py] of unit) { const ph = (k + px) * (Math.PI / n), u = lerp(u0, u1, py); if (Math.abs(ph) > 1.52) { st = false; continue; } const q = at(ph, u); st ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); st = true; }
      G.stroke();
    }
    G.globalAlpha = a;
  }
  /* the fired gloss: a sharp highlight down one side */
  /* the fired gloss: a highlight that follows the body's curve down one side (the window's reflection) */
  if (f > 0.02) {
    G.save(); G.lineCap = 'round';
    for (const [wd, al] of [[0.09, 0.1], [0.045, 0.22], [0.016, 0.5]]) {
      G.beginPath(); for (let u = 0.08; u <= 0.78; u += 0.02) { const xx = cx - R(u, -1) * 0.5, yy = Y(u); u === 0.08 ? G.moveTo(xx, yy) : G.lineTo(xx, yy); }
      G.strokeStyle = `rgba(255,255,255,${al * f})`; G.lineWidth = Rm * wd * 2; G.stroke();
    }
    G.restore();
  }
  /* unfired: dust specks; slaking: wet mud streaks running down */
  if (f < 0.98 && sl < 0.9) { const r = rng(17); G.fillStyle = `rgba(70,68,62,${0.22 * (1 - f)})`; for (let i = 0; i < 160; i++) { const u = r(), s2 = r() * 2 - 1; G.fillRect(cx + s2 * R(u, 1) * 0.95, Y(u), 1.6, 1.6); } }
  if (sl > 0) { const r = rng(23); G.strokeStyle = `rgba(60,57,52,${0.5 * sl})`; G.lineWidth = 2; for (let i = 0; i < 14; i++) { const s2 = r() * 1.8 - 0.9, u = 0.3 + r() * 0.6, L = H * (0.1 + r() * 0.3) * sl; const x0 = cx + s2 * R(u, 1); G.beginPath(); G.moveTo(x0, Y(u)); G.lineTo(x0 + s2 * 3, Y(u) + L); G.stroke(); } }
  /* red heat: at a bisque firing's 995 °C the ware itself glows orange (incandescence), most where the flames reach */
  if (o.glow > 0.01) { const gg = G.createLinearGradient(0, by, 0, Y(1)); gg.addColorStop(0, rgba('#FF8A3D', 0.85 * o.glow)); gg.addColorStop(0.6, rgba('#E8622C', 0.55 * o.glow)); gg.addColorStop(1, rgba('#B8402A', 0.35 * o.glow)); G.fillStyle = gg; G.fillRect(cx - Rm * 1.6, Y(1) - 2, Rm * 3.2, by - Y(1) + 4); }
  /* the kiln's light from below, warm (heat colour), on the side facing the flames */
  if (heat > 0.01) { const hg = G.createLinearGradient(0, by, 0, Y(0.8)); hg.addColorStop(0, rgba(C.heatL, 0.55 * heat)); hg.addColorStop(1, rgba(C.heat, 0)); G.globalCompositeOperation = TH ? 'multiply' : 'lighter'; G.fillStyle = hg; G.fillRect(cx - Rm * 1.6, Y(1), Rm * 3.2, by - Y(1) + 4); G.globalCompositeOperation = 'source-over'; }
  /* water on the fired pot: beads that run down and off */
  /* water on the fired pot: it runs off in rivulets and beads; nothing of the pot goes with it */
  if (o.wet > 0.01 && f > 0.5) {
    const r = rng(31);
    for (let i = 0; i < 9; i++) {
      const s2 = r() * 1.4 - 0.7, sp = 0.5 + r() * 0.4, ph = clamp((o.wetT == null ? 1 : o.wetT) * sp * 1.6 - r() * 0.3), u1 = 0.92, u2 = lerp(0.92, 0.05, ph);
      if (ph <= 0) continue;
      G.globalAlpha = a * o.wet * 0.32; G.strokeStyle = 'rgba(205,220,236,0.8)'; G.lineWidth = 1.4;
      G.beginPath(); for (let u = u1; u >= u2; u -= 0.02) { const xx = cx + s2 * R(u, 1), yy = Y(u); u === u1 ? G.moveTo(xx, yy) : G.lineTo(xx, yy); } G.stroke();
      const q = [cx + s2 * R(u2, 1), Y(u2)]; G.globalAlpha = a * o.wet * 0.9; G.fillStyle = 'rgba(225,236,248,0.9)'; G.beginPath(); G.ellipse(q[0], q[1] + 2, 2.6, 3.8, 0, 0, TAU); G.fill();
    }
    G.globalAlpha = a;
  }
  G.restore();
  /* the mouth: a dark ellipse with its rim */
  if (sl < 0.4) { const rt = R(1, 1), yt = Y(1); G.beginPath(); G.ellipse(cx, yt, rt, rt * 0.22, 0, 0, TAU); G.fillStyle = mix('#5E5C57', '#0B0C0E', f); G.fill(); G.strokeStyle = mix('#D2CFC8', '#6A6C73', f); G.lineWidth = Math.max(1.2, H * 0.006); G.stroke(); }
  body(); G.strokeStyle = TH ? 'rgba(17,17,17,0.55)' : 'rgba(243,242,238,0.32)'; G.lineWidth = 1.4; G.stroke();
  G.restore();
}
/**
 * Flames: tongues rising from a bed (cx, by), w wide, h high at full heat. o = { a, k (0..1, how far the fire has caught:
 * height and brightness), t, n (tongues), seed }. Each tongue sways with the draught (a sum of sines of t: a pure
 * function of time) in the heat colours: an amber core, orange, a pale base.
 */
function b08_flames(cx, by, w, h, o = {}) {
  const a = o.a == null ? 1 : o.a, k = clamp(o.k == null ? 1 : o.k); if (a * k <= 0.003) return;
  const t = o.t || 0, n = o.n || 7, r = rng(o.seed || 3);
  const tongues = []; for (let i = 0; i < n; i++) tongues.push({ x: (i + 0.5) / n - 0.5 + (r() - 0.5) * 0.06, hf: 0.55 + r() * 0.45, ph: r() * 10, wf: 0.75 + r() * 0.5 });
  G.save(); G.globalCompositeOperation = TH ? 'source-over' : 'lighter';
  const layers = [[1.0, C.heat, 0.5], [0.72, C.heatL, 0.7], [0.42, TH ? '#FFE3A3' : '#FFF0C8', 0.85]];
  for (const [sc, col, al] of layers) {
    for (const q of tongues) {
      const sway = Math.sin(t * 5.3 + q.ph) * 0.5 + Math.sin(t * 8.9 + q.ph * 1.7) * 0.3 + Math.sin(t * 13.7 + q.ph * 0.6) * 0.2;
      const lift = 0.85 + 0.15 * Math.sin(t * 7.1 + q.ph * 2.3);
      const fh = h * k * q.hf * lift * sc, fw = (w / n) * 1.25 * q.wf * sc, x0 = cx + q.x * w, tipX = x0 + sway * fw * 0.6 * (1 - sc * 0.3), tipY = by - fh;
      if (fh < 2) continue;
      G.beginPath(); G.moveTo(x0 - fw / 2, by);
      G.bezierCurveTo(x0 - fw * 0.62, by - fh * 0.35, tipX - fw * 0.18, by - fh * 0.7, tipX, tipY);
      G.bezierCurveTo(tipX + fw * 0.18, by - fh * 0.7, x0 + fw * 0.62, by - fh * 0.35, x0 + fw / 2, by);
      G.closePath(); G.fillStyle = rgba(col, al * a * clamp(k * 1.4)); G.fill();
    }
  }
  G.restore();
}
/**
 * An updraft kiln, cut away: a firebox under a perforated floor, a domed chamber over it, a flue at the top. The near half
 * of the dome is cut off so the ware shows; the cut faces show the brick courses. (x, y) top left of its box, w × h.
 * o = { a, heat (0..1: the chamber's glow), fire (0..1: the flames), t }. Returns { floorY, cx, chamberTop, holes: [x...],
 * mouth: [x, y] } for placing the pot and the stoke-hole's logs.
 */
function b08_kiln(x, y, w, h, o = {}) {
  const a = o.a == null ? 1 : o.a, heat = clamp(o.heat || 0), fire = clamp(o.fire || 0), t = o.t || 0;
  const cx = x + w / 2, gy = y + h, wall = w * 0.075, fbH = h * 0.24, floorY = gy - fbH, floorT = h * 0.035, domeTop = y + h * 0.06, flueW = w * 0.12;
  const out = { floorY: floorY - floorT, cx, chamberTop: domeTop + wall, holes: [], mouth: [x + wall * 0.5, gy - fbH * 0.45] };
  if (a <= 0.003) return out;
  const brick = TH ? '#9A9790' : '#4A4945', brickD = TH ? '#7C7A73' : '#3A3936', mortar = TH ? 'rgba(17,17,17,0.18)' : 'rgba(0,0,0,0.35)', inner = TH ? '#2C2C2E' : '#141416';
  G.save(); G.globalAlpha = a;
  /* the outer shape: a dome on a base, as one silhouette */
  const outer = () => { G.beginPath(); G.moveTo(x, gy); G.lineTo(x, floorY - h * 0.06); G.bezierCurveTo(x, y + h * 0.18, cx - w * 0.3, domeTop - 2, cx - flueW / 2, domeTop); G.lineTo(cx + flueW / 2, domeTop); G.bezierCurveTo(cx + w * 0.3, domeTop - 2, x + w, y + h * 0.18, x + w, floorY - h * 0.06); G.lineTo(x + w, gy); G.closePath(); };
  const xi = x + wall, wi = w - 2 * wall, inner0 = () => { G.beginPath(); G.moveTo(xi, gy - 3); G.lineTo(xi, floorY - h * 0.06); G.bezierCurveTo(xi, y + h * 0.2 + wall, cx - wi * 0.3, domeTop + wall, cx - flueW / 2, domeTop + wall * 0.9); G.lineTo(cx + flueW / 2, domeTop + wall * 0.9); G.bezierCurveTo(cx + wi * 0.3, domeTop + wall, xi + wi, y + h * 0.2 + wall, xi + wi, floorY - h * 0.06); G.lineTo(xi + wi, gy - 3); G.closePath(); };
  outer(); G.fillStyle = brick; G.fill();
  /* brick courses in the cut wall */
  G.save(); outer(); G.clip(); G.strokeStyle = mortar; G.lineWidth = 1.2;
  const bh = h * 0.035; for (let yy = gy - bh, row = 0; yy > y; yy -= bh, row++) { G.beginPath(); G.moveTo(x, yy); G.lineTo(x + w, yy); G.stroke(); const bw = bh * 2.2, off = (row % 2) * bw / 2; G.beginPath(); for (let xx = x - bw + off; xx < x + w; xx += bw) { G.moveTo(xx, yy); G.lineTo(xx, yy + bh); } G.stroke(); }
  G.restore();
  /* the inside, dark, lit by the fire from below as the heat rises */
  inner0(); G.fillStyle = inner; G.fill();
  if (heat > 0.003) {
    G.save(); inner0(); G.clip();
    const gl = G.createRadialGradient(cx, floorY, wi * 0.05, cx, floorY - h * 0.1, h * 0.85);
    gl.addColorStop(0, rgba(TH ? '#F7C068' : '#FFD08A', 0.95 * heat)); gl.addColorStop(0.35, rgba(C.heatL, 0.55 * heat)); gl.addColorStop(0.75, rgba(C.heat, 0.22 * heat)); gl.addColorStop(1, rgba(C.heat, 0));
    G.fillStyle = gl; G.fillRect(x, y, w, h);
    G.restore();
  }
  /* the floor, with flame holes */
  const fx0 = xi, fw = wi, nH = 6; G.fillStyle = brickD; G.fillRect(fx0, floorY - floorT, fw, floorT);
  for (let i = 0; i < nH; i++) { const hx = fx0 + fw * (i + 0.5) / nH; out.holes.push(hx); G.fillStyle = heat > 0.05 ? rgba(C.heatL, 0.4 + 0.6 * heat) : inner; G.fillRect(hx - fw * 0.025, floorY - floorT, fw * 0.05, floorT); }
  /* the firebox: logs and their flames; the stoke-hole on the left */
  G.fillStyle = inner; G.fillRect(x, gy - fbH * 0.62, wall + 2, fbH * 0.5);
  const logs = [[0.3, 0.12], [0.5, 0.1], [0.68, 0.13], [0.42, 0.22], [0.6, 0.21]];
  for (const [lx, ly] of logs) { const px = xi + wi * lx, py = gy - fbH * ly - 6; G.save(); G.translate(px, py); G.rotate(0.08); rrPath(-wi * 0.1, -7, wi * 0.2, 14, 7); G.fillStyle = '#26221F'; G.fill(); if (fire > 0.05) { G.strokeStyle = rgba(C.heatL, 0.7 * fire); G.lineWidth = 2; G.stroke(); } G.restore(); }
  if (fire > 0.003) {
    G.save(); G.beginPath(); G.rect(xi, floorY, wi, fbH - 2); G.clip();
    b08_flames(cx, gy - fbH * 0.08, wi * 0.86, fbH * 0.95, { k: fire, t, n: 9, seed: 5 });
    G.restore();
    /* tongues through the floor's holes, licking up into the chamber */
    for (const hx of out.holes) b08_flames(hx, floorY - floorT, fw * 0.07, h * 0.16, { k: fire * heat, t: t + hx * 0.01, n: 2, seed: Math.round(hx) });
  }
  /* the flue: hot air shimmering up (the draught that pulls the fire) */
  if (heat > 0.05) { for (let i = 0; i < 4; i++) { const ph = ((t * 0.55 + i / 4) % 1), yy = domeTop - ph * h * 0.12; G.save(); G.globalAlpha = a * heat * (1 - ph) * 0.45; G.strokeStyle = TH ? 'rgba(80,78,72,0.6)' : 'rgba(220,220,215,0.55)'; G.lineWidth = 2; G.beginPath(); for (let s = 0; s <= 1; s += 0.1) G.lineTo(cx - flueW * 0.25 + i * flueW * 0.17 + 3 * Math.sin(s * 7 + t * 4 + i), yy - s * 22); G.stroke(); G.restore(); } }
  outer(); G.strokeStyle = TH ? 'rgba(17,17,17,0.5)' : 'rgba(243,242,238,0.32)'; G.lineWidth = 1.5; G.stroke();
  inner0(); G.strokeStyle = TH ? 'rgba(17,17,17,0.35)' : 'rgba(243,242,238,0.22)'; G.lineWidth = 1.2; G.stroke();
  G.restore();
  return out;
}
if (B08LAB) S({
  id: 'b08_lab3', ch: 'surface', theme: 'night', title: 'B08 lab 3', settle: 6,
  draw: t => {
    header(t, 'B08 lab: pots and the kiln');
    b08_amphora(260, 900, 420, { fired: 0, t });
    const K = b08_kiln(560, 330, 560, 600, { heat: 1, fire: 1, t });
    b08_amphora(K.cx, K.floorY, 300, { fired: 0.8, heat: 1, glow: 0.8, t });
    b08_amphora(1400, 900, 420, { fired: 0, slake: 0.6, t }); b08_amphora(1400, 960, 420, { fired: 0, slake: 1, t, a: 0.5 });
    b08_amphora(1720, 900, 300, { fired: 1, wet: 1, t });
  }
});
/**
 * The pencil hardness test (ISO 15184; ASTM D3363): a carriage holds a pencil at 45° with 750 g on its tip and rolls it
 * 7 mm across a coated panel. A coat softer than the lead is scratched (material torn out: the bright groove behind the
 * tip); a harder one keeps nothing but a faint grey trace that wipes off. (x, y, w, h) the panel. o = { a, k (0..1, the
 * stroke), hard (true: no mark), grade ('6H'), coat (the panel's colour), mm (px per mm of travel), x0 (the stroke's start,
 * a fraction of w) }. Returns { tip: [x, y] }.
 */
function b08_pencilTest(x, y, w, h, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return { tip: [x, y] };
  const k = clamp(o.k || 0), mm = o.mm || w / 11, sx = x + w * (o.x0 == null ? 0.2 : o.x0), sy = y + h * 0.46, tx = sx + 7 * mm * k, coat = o.coat || '#2C2D32';
  G.save(); G.globalAlpha = a;
  /* the panel: a slab of coated shell, its edge cut to show the coat on the plastic */
  rrPath(x, y, w, h, 6); G.fillStyle = coat; G.fill();
  G.save(); rrPath(x, y, w, h, 6); G.clip();
  const r = rng(9); G.fillStyle = 'rgba(255,255,255,0.05)'; for (let i = 0; i < w * h / 90; i++) G.fillRect(x + r() * w, y + r() * h, 1.4, 1.4);
  const sh = G.createLinearGradient(0, y, 0, y + h); sh.addColorStop(0, 'rgba(255,255,255,0.06)'); sh.addColorStop(1, 'rgba(0,0,0,0.18)'); G.fillStyle = sh; G.fillRect(x, y, w, h);
  /* the mark behind the tip */
  if (k > 0.01) {
    if (!o.hard) {
      /* a scratch: the coat torn out down to the plastic, ragged edges, chips thrown beside it */
      const L = tx - sx; G.lineCap = 'round';
      G.strokeStyle = 'rgba(205,207,212,0.85)'; G.lineWidth = 5; G.beginPath(); G.moveTo(sx, sy); G.lineTo(tx, sy); G.stroke();
      G.strokeStyle = 'rgba(120,122,128,0.9)'; G.lineWidth = 1.6; G.beginPath(); G.moveTo(sx, sy + 1.2); G.lineTo(tx, sy + 1.2); G.stroke();
      const rr = rng(13); G.fillStyle = 'rgba(214,216,220,0.8)';
      for (let i = 0; i < L / 3; i++) { const px = sx + rr() * L, py = sy + (rr() - 0.5) * 12; G.beginPath(); G.ellipse(px, py, 1 + rr() * 1.6, 0.8 + rr(), rr() * 3, 0, TAU); G.fill(); }
    } else {
      /* graphite, rubbed off the lead: a faint trace on the surface that wipes away; nothing cut */
      G.strokeStyle = 'rgba(160,162,168,0.16)'; G.lineWidth = 4; G.lineCap = 'round'; G.beginPath(); G.moveTo(sx, sy); G.lineTo(tx, sy); G.stroke();
    }
  }
  G.restore();
  rrPath(x, y, w, h, 6); G.strokeStyle = TH ? 'rgba(17,17,17,0.2)' : 'rgba(243,242,238,0.16)'; G.lineWidth = 1.2; G.stroke();
  /* the pencil at 45°, its lead squared flat on the panel; the carriage over it carries the 750 g */
  const ang = -Math.PI / 4 * 3, ux = Math.cos(ang), uy = Math.sin(ang), Lp = Math.min(h * 2.2, 330), wp = 18;   /* up and to the left of the tip */
  G.save(); G.translate(tx, sy); G.rotate(ang);
  /* lead, cone of bare wood, then the hexagonal barrel in two greys (no colour), the grade printed on it */
  G.fillStyle = '#3B3D42'; G.fillRect(0, -2.6, 12, 5.2);
  G.beginPath(); G.moveTo(12, -3); G.lineTo(34, -wp / 2); G.lineTo(34, wp / 2); G.lineTo(12, 3); G.closePath(); G.fillStyle = '#C9C6BE'; G.fill();
  G.fillStyle = '#7C7E84'; G.fillRect(34, -wp / 2, Lp - 34, wp); G.fillStyle = '#9A9CA2'; G.fillRect(34, -wp / 2, Lp - 34, wp * 0.32); G.fillStyle = '#5C5E64'; G.fillRect(34, wp * 0.22, Lp - 34, wp * 0.28);
  G.restore();
  /* the carriage: a block clamped round the barrel, two wheels on the panel, the load on top */
  const cx = tx + ux * Lp * 0.55, cy = sy + uy * Lp * 0.55, bw = 150, bh = 74;
  G.save(); G.translate(cx, cy);
  rrPath(-bw / 2, -bh / 2, bw, bh, 8); G.fillStyle = TH ? '#D8D7D2' : '#3C3E44'; G.fill(); G.strokeStyle = TH ? 'rgba(17,17,17,0.4)' : 'rgba(243,242,238,0.3)'; G.lineWidth = 1.4; G.stroke();
  text('750 g', 0, 9, { role: 'label', size: 22, color: TH ? C.ink : '#F3F2EE', align: 'center' });
  G.restore();
  for (const dx of [-1, 1]) { const wx = cx + dx * bw * 0.36, wy = sy - 12; line(wx, cy + bh / 2, wx, wy, { color: TH ? '#8A8983' : '#6E6D68', w: 3 }); circle(wx, wy + 1, 11, { fill: TH ? '#B9B8B2' : '#55554F' }); circle(wx, wy + 1, 3.4, { fill: TH ? '#66655F' : '#96958F' }); }
  /* the grade, on the barrel near the carriage */
  if (o.grade) { const gx = tx + ux * Lp * 0.9, gy = sy + uy * Lp * 0.9; text(o.grade, gx, gy - 24, { role: 'label', size: 22, color: C.ink, align: 'center' }); }
  G.restore();
  return { tip: [tx, sy], carriage: [cx, cy] };
}
if (B08LAB) S({
  id: 'b08_lab4', ch: 'surface', theme: 'night', title: 'B08 lab 4', settle: 6,
  draw: t => {
    header(t, 'B08 lab: the pencil test');
    b08_pencilTest(120, 640, 760, 220, { k: 1, hard: false, grade: '6H' });
    b08_pencilTest(1000, 640, 760, 220, { k: 1, hard: true, grade: '6H' });
    b08_amphora(1500, 560, 300, { fired: 0, slake: 0.5, t });
    b08_amphora(1750, 560, 300, { fired: 0, slake: 1, t });
  }
});

/* ============================== the film: a section through the shell's skin, to scale ==============================
   PP-C-20A with short carbon fibres 7 µm across lying along the flow near the surface (Höftberger 2022, Yamaguchi 2024:
   srf_fibres draws them); the as-moulded surface as a dashed line; the blast takes a skin off and roughens what is left
   (drawn, not measured: Brock's "almost as much as it adds", F2.22, unnumbered by his choice, F21.10); the 19 µm film
   (Cerakote F-Series' 0.75 mil) fills the roughness and levels back to about the moulded line. Units: s px per µm. */
/** the blasted profile's depth below the moulded line at stage x, µm (rough: two octaves of noise round a mean) */
const b08_blastProf = (u, mean) => mean + 0.62 * mean * srf_fbm(u / 9, 0.5, 21, 3) + 0.3 * mean * srf_fbm(u / 2.2, 1.5, 22, 2);
/**
 * B = [x, y, w, h] stage px; o = { s (px per µm, 3), top (the moulded line, a fraction of h, 0.3), blast (0..1), coat (0..1),
 * mean (µm the blast takes off on average, drawn, 13), film (µm, 19), seed, soft (0..1: draw soft-touch's 51 µm on an
 * unblasted surface instead), coatCol, t }. Returns { ys (the moulded line's y), top(px) (the surface's y at stage x),
 * prof(px), filmTop(px) }.
 */
function b08_section(B, o = {}) {
  const [x, y, w, h] = B, s = o.s || 3, ys = y + (o.top == null ? 0.3 : o.top) * h, kb = clamp(o.blast || 0), kc = clamp(o.coat || 0), mean = o.mean || 13, film = o.film || 19;
  const Wu = w / s, Du = (y + h - ys) / s + 20, fib = srf_fibres(o.seed || 7, Wu, Du), step = 2, N = Math.ceil(w / step);
  const P = i => ys + kb * b08_blastProf(i * step / s, mean) * s;                                  /* the blasted surface */
  const mean0 = ys + kb * mean * s;
  const F = i => Math.min(P(i), mean0 - kc * film * s + 0.22 * kc * (P(i) - mean0));             /* the film's top: levels over the peaks */
  G.save(); rrPath(x, y, w, h, o.r == null ? 6 : o.r); G.clip();
  G.fillStyle = TH ? '#E9E8E3' : '#111214'; G.fillRect(x, y, w, h);
  /* what the blast took: the skin between the moulded line and the new surface, ghosted, with grit lifting off it */
  if (kb > 0.003) {
    G.beginPath(); G.moveTo(x, ys); G.lineTo(x + w, ys); for (let i = N; i >= 0; i--) G.lineTo(x + i * step, P(i)); G.closePath();
    G.save(); G.fillStyle = TH ? 'rgba(17,17,17,0.06)' : 'rgba(243,242,238,0.06)'; G.fill(); G.clip();
    G.strokeStyle = TH ? 'rgba(17,17,17,0.16)' : 'rgba(243,242,238,0.14)'; G.lineWidth = 1; G.beginPath(); for (let xx = x - h; xx < x + w; xx += 9) { G.moveTo(xx, y + h); G.lineTo(xx + h, y); } G.stroke();
    G.restore();
  }
  /* the shell: PP with its fibres */
  G.beginPath(); G.moveTo(x, y + h); for (let i = 0; i <= N; i++) G.lineTo(x + i * step, P(i)); G.lineTo(x + w, y + h); G.closePath();
  G.save(); G.fillStyle = '#2A2B30'; G.fill(); G.clip();
  for (const f of fib) {
    const cx = x + f.x * s, cy = ys + f.d * s, L = f.L * s, d = 7 * s;
    G.save(); G.translate(cx, cy); G.rotate(f.ang); rrPath(-L / 2, -d / 2, L, d, Math.min(d / 2, L / 2)); G.fillStyle = '#4E5057'; G.fill();
    G.fillStyle = 'rgba(160,164,172,0.35)'; G.fillRect(-L / 2 + d * 0.3, -d * 0.32, Math.max(0, L - d * 0.6), d * 0.18); G.restore();
  }
  G.restore();
  /* the film: fills the valleys, levels over the peaks; ceramic specks in it */
  if (kc > 0.003) {
    G.beginPath(); G.moveTo(x, P(0)); for (let i = 0; i <= N; i++) G.lineTo(x + i * step, F(i)); for (let i = N; i >= 0; i--) G.lineTo(x + i * step, P(i)); G.closePath();
    G.save(); G.fillStyle = o.coatCol || '#5C5E66'; G.fill(); G.clip();
    const r = rng(77); G.fillStyle = 'rgba(220,222,228,0.45)'; for (let i = 0; i < w * 0.7; i++) G.fillRect(x + r() * w, mean0 - r() * (film + 10) * s, 1.6, 1.6);
    G.restore();
    G.beginPath(); for (let i = 0; i <= N; i++) { const yy = F(i); i ? G.lineTo(x + i * step, yy) : G.moveTo(x, yy); } G.strokeStyle = 'rgba(235,236,240,0.6)'; G.lineWidth = 1.5; G.stroke();
  }
  G.restore();
  return { ys, top: px => (kc > 0.003 ? F : P)(clamp(Math.round((px - x) / step), 0, N)), prof: px => P(clamp(Math.round((px - x) / step), 0, N)), filmTop: px => F(clamp(Math.round((px - x) / step), 0, N)), mean: mean0, s, film };
}
/** soft-touch on the same scale: the moulded surface left smooth (it bonds through a primer), the rubbery film over it.
   B as b08_section; o = { s, top, k (0..1: the film sprayed on), um (51) }. Returns { ys, top } */
function b08_softSection(B, o = {}) {
  const [x, y, w, h] = B, s = o.s || 3, ys = y + (o.top == null ? 0.3 : o.top) * h, k = clamp(o.k || 0), um = o.um || 51;
  const fib = srf_fibres(o.seed || 11, w / s, (y + h - ys) / s + 20);
  G.save(); rrPath(x, y, w, h, 6); G.clip();
  G.fillStyle = TH ? '#E9E8E3' : '#111214'; G.fillRect(x, y, w, h);
  G.fillStyle = '#2A2B30'; G.fillRect(x, ys, w, y + h - ys);
  G.save(); G.beginPath(); G.rect(x, ys, w, y + h - ys); G.clip();
  for (const f of fib) { const cx = x + f.x * s, cy = ys + f.d * s, L = f.L * s, d = 7 * s; G.save(); G.translate(cx, cy); G.rotate(f.ang); rrPath(-L / 2, -d / 2, L, d, Math.min(d / 2, L / 2)); G.fillStyle = '#4E5057'; G.fill(); G.restore(); }
  G.restore();
  if (k > 0.003) { const tt = ys - um * s * k; G.fillStyle = '#45464C'; G.fillRect(x, tt, w, ys - tt); G.strokeStyle = 'rgba(235,236,240,0.5)'; G.lineWidth = 1.5; G.beginPath(); G.moveTo(x, tt); for (let xx = x; xx <= x + w; xx += 6) G.lineTo(xx, tt + 0.6 * Math.sin(xx * 0.08)); G.stroke(); }
  G.restore();
  return { ys, top: ys - um * s * k };
}
if (B08LAB) S({
  id: 'b08_lab5', ch: 'surface', theme: 'night', title: 'B08 lab 5', settle: 6,
  draw: t => {
    header(t, 'B08 lab: the film in section');
    const sec = b08_section([80, 300, 1100, 520], { s: 3, top: 0.36, blast: 1, coat: 1, seed: 11 });
    line(80, sec.ys, 1180, sec.ys, { color: C.ink, w: 1.5, dash: [8, 6] });
    const soft = b08_softSection([1240, 300, 600, 520], { s: 3, top: 0.36, k: 1 });
    line(1240, soft.ys, 1840, soft.ys, { color: C.ink, w: 1.5, dash: [8, 6] });
  }
});

/* ============================== tape: a section through grip tape on a button, to scale ==============================
   Grip tape is a polyurethane or rubber sheet on a pressure-sensitive adhesive: 0.5 mm (Lizard Skins DSP, Pulsar, Pwnage)
   or 0.3 mm (TalonGames PU-0, Keychron). The section is drawn at s px per mm; the coat (19 µm) and its etch (10 µm deep)
   are drawn at the same scale, so at this magnification they are a line: that is the point. Ageing (drawn from owners'
   reports and the adhesive patent, not measured): the glue creeps out of the cut edge (US 6,686,014), skin and lint stick
   to it and in the texture (Lizard Skins owners), the edge lifts (a Razer tape owner: "unpeeled after a month"). */
/**
 * B = [x, y, w, h] stage px; o = { s (px per mm), base (y of the shell's surface), mm (the tape's thickness; 0 = none),
 * glue (mm, 0.05), edge (x of the tape's cut edge; it covers the left), age (0..1), etch (0..1: the etched grooves in
 * the coat), t }. Returns { top(px) (the surface a finger meets at x), edge, glueY }.
 */
function b08_tapeSection(B, o = {}) {
  const [x, y, w, h] = B, s = o.s || 400, base = o.base || y + h * 0.62, mm = Math.max(0, o.mm == null ? 0.5 : o.mm), glue = (o.glue == null ? 0.05 : o.glue) * s * Math.min(1, mm / 0.3);
  const age = clamp(o.age || 0), ex = o.edge || x + w * 0.62, coat = 0.019 * s, tapeH = mm * s, lift = E.io3(clamp((age - 0.35) / 0.65)), ooze = 26 * E.out3(age);
  const out = { edge: ex, glueY: base - coat - glue };
  G.save(); rrPath(x, y, w, h, 6); G.clip();
  G.fillStyle = TH ? '#E9E8E3' : '#111214'; G.fillRect(x, y, w, h);
  /* the shell, the coat on it (a line at this scale), and the etch in the coat */
  G.fillStyle = '#2A2B30'; G.fillRect(x, base, w, y + h - base);
  G.fillStyle = '#5C5E66'; G.fillRect(x, base - coat, w, coat);
  if (o.etch > 0.01) { G.save(); G.globalAlpha = o.etch; G.fillStyle = TH ? '#E9E8E3' : '#111214'; const p = Math.max(3, 0.045 * s), dw = 0.02 * s, dd = 0.01 * s; for (let xx = x; xx < x + w; xx += p) G.fillRect(xx, base - coat, dw, dd); G.restore(); }
  /* the glue: under the tape, then creeping out past the edge as a bead */
  const tTop = (xx) => { const d = xx - (ex - 150); return base - coat - glue - tapeH - (xx > ex - 150 && lift > 0 ? Math.max(0, d) * 0.16 * lift : 0); };
  if (mm > 0.001) {
    G.fillStyle = 'rgba(206,203,192,0.92)'; G.fillRect(x, base - coat - glue, ex - x, glue);
    if (ooze > 0.5) { G.beginPath(); G.moveTo(ex - 2, base - coat - glue); G.quadraticCurveTo(ex + ooze * 0.9, base - coat - glue * 0.9, ex + ooze, base - coat); G.lineTo(ex - 2, base - coat); G.closePath(); G.fill(); }
    /* the tape: a sheet with a pebbled top that wears smoother; its last stretch peels up off the glue */
    const bump = Math.min(tapeH * 0.12, 9) * (1 - 0.6 * age), per = Math.max(10, tapeH * 0.22);
    G.beginPath(); G.moveTo(x, base - coat - glue);
    for (let xx = x; xx <= ex; xx += 2) { const yt = tTop(xx) + bump * (0.5 + 0.5 * Math.cos((xx - x) / per * TAU)); G.lineTo(xx, yt); }
    G.lineTo(ex, base - coat - glue - (lift > 0 ? 150 * 0.16 * lift : 0)); G.lineTo(ex - 150, base - coat - glue); G.closePath();
    G.fillStyle = mix('#4A4B51', '#2E2E31', 0.25 * age); G.fill();
    if (lift > 0.02) { G.strokeStyle = 'rgba(206,203,192,0.85)'; G.lineWidth = 2; for (let i = 0; i < 6; i++) { const xx = ex - 140 + i * 24, yy = tTop(xx) + tapeH; G.beginPath(); G.moveTo(xx, base - coat - glue); G.lineTo(xx + 3, yy); G.stroke(); } }
    /* gunk: lint and skin caught on the bead and in the texture, a fault, in red */
    const r = rng(41), nG = Math.round(40 * clamp((age - 0.15) / 0.85));
    for (let i = 0; i < nG; i++) { const u = r(), v = r(), sz = 2 + r() * 4, inBead = i % 3 !== 0;
      const gx = inBead ? ex + u * ooze * 1.1 - 6 : x + 30 + u * (ex - 190 - x), gy = inBead ? base - coat - 4 - v * 8 : tTop(gx) + 3 + v * 4;
      G.fillStyle = rgba(C.red, 0.85); G.beginPath(); G.ellipse(gx, gy, sz, sz * 0.6, u * 3, 0, TAU); G.fill(); }
  }
  G.restore();
  out.top = xx => mm > 0.001 && xx <= ex ? tTop(xx) : base - coat;
  return out;
}
/**
 * A fingertip's pad in section, at the same scale: skin with its papillary ridges (about 0.45 mm apart) along the bottom,
 * mono grey (F9.24), resting on a surface given by top(x) (it follows the surface's height under it, so a step lifts it).
 * (x0, x1) its span on the stage; o = { a, s (px per mm), top(x), lift (px), ridge (mm, 0.45), t }.
 */
function b08_padSection(x0, x1, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const s = o.s || 400, sp = (o.ridge || 0.45) * s, amp = Math.min(0.06 * s, 18), top = o.top, N = Math.ceil((x1 - x0) / 3);
  /* the pad's underside: the ridges' crests sit on the highest point of the surface beneath them (it can't sink into a step) */
  const yb = []; for (let i = 0; i <= N; i++) { const xx = x0 + i * 3; let m = Infinity; for (let d = -sp * 0.6; d <= sp * 0.6; d += 6) m = Math.min(m, top(xx + d)); yb.push(m - (o.lift || 0)); }
  const rid = i => { const xx = x0 + i * 3; return amp * (0.5 - 0.5 * Math.cos((xx - x0) / sp * TAU)); };
  G.save(); G.globalAlpha = a;
  G.beginPath(); G.moveTo(x0, yb[0] - rid(0)); for (let i = 1; i <= N; i++) G.lineTo(x0 + i * 3, yb[i] - rid(i)); G.lineTo(x1, yb[N] - s * 3); G.lineTo(x0, yb[0] - s * 3); G.closePath();
  G.fillStyle = TH ? '#C9C8C2' : '#5F5E59'; G.fill(); G.strokeStyle = TH ? 'rgba(40,40,38,0.6)' : 'rgba(230,230,225,0.45)'; G.lineWidth = 1.5; G.stroke();
  G.restore();
}
if (B08LAB) S({
  id: 'b08_lab6', ch: 'surface', theme: 'night', title: 'B08 lab 6', settle: 6,
  draw: t => {
    header(t, 'B08 lab: tape in section');
    const T1 = b08_tapeSection([80, 300, 840, 600], { s: 400, mm: 0.5, age: 0, t });
    b08_padSection(200, 700, { s: 400, top: T1.top });
    const T2 = b08_tapeSection([1000, 300, 840, 600], { s: 400, mm: 0.5, age: 1, t, etch: 0 });
    const T3 = b08_tapeSection([1000, 300, 840, 600], { s: 400, mm: 0, age: 0, t, etch: 1 });
  }
});

/* ============================== 5. b08_grip: directional grip (most important: F33.5) ==============================
   Brock (F2.14): "grip in exactly the right places in exactly the right directions, curation that grip tape doesn't allow
   for, because you need extra grip in a specific direction everywhere on the mouse, while allowing mobility in every other
   direction". His note on the old slide (8/10): "really good visualization but needs to be more intuitive".
   The demonstration: the index fingertip on the left button, where a fingertip grip pulls the mouse back. The same pull
   (0.47 N, through a spring you can see) in three directions, on grip tape (the rival: the same grip every way) and then,
   in place, on laser-etched ridges that run side to side. With a 1 N press the grip in newtons is the friction coefficient,
   so everything reads in newtons: across the ridges 0.53 N holds the 0.47 N pull; along them 0.42 N and diagonally
   0.41 N let it slide (Zhang 2017, a fingertip at 1 N on grooves 20 µm wide, 10 µm deep). The tape's grip is drawn the
   same every way and unnumbered: no paper measures it. */
const B08G = {
  c: [-14, -34],                                 /* the fingertip's contact, top view mm (the left button's front) */
  focus: [-29, -44, 30, 20],                     /* the push-in's frame, mm */
  tape: [-28.2, -53, 26.4, 33],                  /* the pre-cut tape on the left button, mm (x, y, w, h) */
  pull: 0.47,                                    /* N, between the two grips */
  pxN: 400,                                      /* px per newton for the arrows */
  moves: [{ t: 1.8, ang: Math.PI / 2, name: 'Back' }, { t: 2.55, ang: Math.PI, name: 'Sideways' }, { t: 3.3, ang: Math.PI / 4, name: 'Diagonal' }],
  wipe: [4.1, 0.8], etch: 4.95, step: 0.8       /* the etch's moves start at 4.95 s, one every 0.8 s */
};
/** where the print is and what it is doing at time t on one surface: moves = [{ t, ang, hold }] → { off: [dx, dy] mm, act
   (the move in play or null), k (0..1 of it), slid (the print is sliding now) } */
function b08_gripState(t, moves, d = 3.0) {
  let off = [0, 0], act = null, k = 0, slid = false;
  for (const m of moves) {
    const kk = ep(t, m.t, m.t + 0.55, E.io3);
    if (t >= m.t && t < m.t + 0.85) { act = m; k = kk; }
    if (!m.hold && kk > 0) { off = [off[0] + Math.cos(m.ang) * d * kk, off[1] + Math.sin(m.ang) * d * kk]; if (t >= m.t && kk < 1) slid = true; }
  }
  return { off, act, k, slid };
}
S({
  id: 'b08_grip', ch: 'surface', theme: 'night', title: 'Directional grip', settle: 10.5, ideas: [60],
  replaces: ['grip'],
  src: ['b08_zhang17', 'b08_zhang15', 'srf_serg22', 'srf_lizard', 'srf_f110', 'srf_doc'],
  answers: [
    ['"really good visualization"', 'Kept what worked: the lit, magnified laser grooves under a fingertip print, and the pointer dragging it (F2.43)'],
    ['"but needs to be more intuitive"', 'It now starts on the mouse: the index fingertip on the left button, where a fingertip grip pulls the mouse back, then one push-in to the fingertip (a locator stays in the corner)'],
    ['"needs to be more intuitive" (the demonstration)', 'One input, shown: the same 0.47 N pull through a spring, back, sideways and diagonally. Tape holds every way, so it drags the sideways and diagonal pulls; the etch holds the pull back (0.53 N) and lets the other two slide (0.42 N, 0.41 N)'],
    ['"needs to be more intuitive" (the abstractions)', 'No μ and no polar chart: every grip is an arrow on the fingertip in newtons at a 1 N touch, set against the pull drawn as a ring, and only Zhang 2017\'s measured values (the old ellipse interpolated values the paper doesn\'t give)'],
    ['F2.14 "grip in exactly the right directions ... while allowing mobility in every other direction"', 'Said and shown: grip across the ridges only; along and diagonally the fingertip moves'],
    ['F33.5 (an important idea, executed better)', 'Problem first (tape drags), the fix in place by a wipe, the payoff +26 % with what the player gets']
  ],
  draw: t => {
    header(t, 'Directional grip');
    captions(t, [[0.6, 'Your fingertips pull the mouse back. Grip tape grips the same every way, so it fights your adjustments too.'],
      [4.7, 'Laser-etched ridges grip across them, where you pull, and let your fingertip slide along them.']]);
    const box = [LM, 272, 1080, 688], G0 = B08G, [cxm, cym] = G0.c;
    /* the tape on the left button, in mm, under the establishing camera; its edge in the rival's yellow */
    const tapePath = () => { const [x, y, w, h] = G0.tape; pathRR(x, y, w, h, 3.2); };
    const est = establish(t, 0, box, { view: 'top', hi: ['trigL'], col: 'ink', focus: G0.focus, hold: 0.55, dur: 1.15, locator: 'tl', fade: 0.35,
      draw: (P, c, k) => {
        G.save(); tapePath(); G.fillStyle = rgba(C.second, TH ? 0.16 : 0.12); G.fill();
        G.clip(); srf_lines([-40, -60, 10, -10], 1.2, Math.PI / 3, rgba(C.second, 0.5), lw(1), 1); srf_lines([-40, -60, 10, -10], 1.2, -Math.PI / 3, rgba(C.second, 0.5), lw(1), 1); G.restore();
        /* tape has an edge you can feel and see; the etch, after the wipe, has none */
        const ke = 1 - ep(t, G0.wipe[0], G0.wipe[0] + G0.wipe[1]);
        if (ke > 0.003) { G.save(); G.globalAlpha *= ke; tapePath(); G.strokeStyle = C.second; G.lineWidth = lw(2); G.stroke(); G.restore(); }
      } });
    const P = est.P, s = est.s, kd = est.kd, home = P(cxm, cym), R = 6 * s;
    /* the surface under the fingertip, magnified: grip tape, then (in place) the etched ridges; clipped to the tape's piece */
    const tf = srf_field('b08g:tape', 900, 574, f => b08_genTape(f, { pitch: 30, width: 7, seed: 6 }));
    const rf = srf_field('b08g:ridge', 900, 574, f => srf_genFilm(f, { pat: 'ridge', pitch: 24, width: 13, depth: 4.4, ang: 0, seed: 5, col: [40, 41, 46], ecol: [96, 98, 106] }));
    const light = { az: 2.35, el: 0.5 };
    const clipPiece = fn => { G.save(); G.beginPath(); const [x, y, w, h] = G0.tape, a = P(x, y), b = P(x + w, y + h); rrPath(a[0], a[1], b[0] - a[0], b[1] - a[1], 3.2 * s); G.clip(); G.beginPath(); G.rect(box[0], box[1], box[2], box[3]); G.clip(); fn(); G.restore(); };
    if (kd > 0.003) {
      wipeTo(t, G0.wipe[0], G0.wipe[1], box,
        () => clipPiece(() => srf_macro(t, tf, box[0], box[1], box[2], box[3], { light, alpha: kd, vignette: true, r: 0 })),
        () => clipPiece(() => srf_macro(t, rf, box[0], box[1], box[2], box[3], { light, alpha: kd, vignette: true, r: 0 })),
        { rival: 'Grip tape', ly: box[1] + box[3] - 24 });
    }
    /* the fingertip: from above before the push lands, then (seen through) its print where it touches */
    const fa = 1 - ep(t, 1.3, 1.7);
    if (fa > 0.003) clipped(box[0], box[1], box[2], box[3], () => finger(home[0], home[1], -Math.PI / 2, { s, view: 'top', press: 0.6, alpha: fa }));
    /* the moves: the same three pulls on each surface; on tape every one holds, on the etch only the pull back does */
    const etchT = G0.etch, tapeMoves = G0.moves.map(m => ({ t: m.t, ang: m.ang, hold: true, name: m.name })), etchMoves = G0.moves.map((m, i) => ({ t: etchT + i * G0.step, ang: m.ang, hold: i === 0, name: m.name }));
    const onEtch = t >= G0.wipe[0] + G0.wipe[1] * 0.5, moves = onEtch ? etchMoves : tapeMoves, st = b08_gripState(t, moves, 2.6);
    const pc = [home[0] + st.off[0] * s, home[1] + st.off[1] * s], kp = ep(t, 1.25, 1.6), halo = { glow: 'rgba(0,0,0,0.95)', glowR: 12 };
    if (kp > 0.003) {
      const m = st.act, hold = m && m.hold, ang = m ? m.ang : 0, k = st.k, ux = Math.cos(ang), uy = Math.sin(ang);
      /* the skin shears toward a pull it resists; a sliding print smears behind */
      const shear = hold ? [ux * 14 * k, uy * 14 * k] : [0, 0];
      b08_print(pc[0], pc[1], R, { a: kp, rot: 0.06, shear, slide: m && !hold ? Math.sin(Math.PI * clamp(k)) : 0, dir: ang });
      if (m) {
        const ry = R * 0.78, er = Math.hypot(ux * R, uy * ry) > 0 ? 1 / Math.hypot(ux / R, uy / ry) : R, edge = [pc[0] + ux * er, pc[1] + uy * er];
        /* the pointer pulls through a spring (the pull you can see): holding, the spring stretches; sliding, it stays at the
           grip's force and the print follows */
        const L = 2.6 * s, stretch = hold ? lerp(0.3, 1, k) * L : lerp(0.3, 0.8, Math.min(1, k * 3)) * L, ptr = [edge[0] + ux * stretch, edge[1] + uy * stretch];
        const ka = ep(t, m.t, m.t + 0.12) * (1 - ep(t, m.t + 0.66, m.t + 0.78));
        b08_spring(edge[0], edge[1], ptr[0], ptr[1], { a: ka, n: 6, amp: 9, col: '#F3F2EE', w: 2.6 });
        cursorPtr(ptr[0], ptr[1], { a: ka, grab: true, fill: '#FFFFFF', edge: '#111111' });
        const kf = ka * ep(t, m.t + 0.05, m.t + 0.3);
        if (kf > 0.5) { const vert = Math.abs(uy) > 0.7, lp = vert ? [edge[0] + 30, edge[1] + uy * stretch * 0.45 + 8] : [edge[0] + ux * stretch * 0.5, edge[1] + uy * stretch * 0.5 - 30]; text(fmtN(B08G.pull, 2) + ' N pull', lp[0], lp[1], Object.assign({ role: 'label', size: 22, color: '#F3F2EE', align: vert ? 'left' : 'center', alpha: kf }, halo)); }
        /* the grip that answers it, opposite: yellow on tape (unnumbered: no paper measures it), blue on the etch */
        const mu = onEtch ? (m.name === 'Back' ? B08.mu.across : m.name === 'Sideways' ? B08.mu.along : B08.mu.diag) : 0.56;
        const gl = mu * B08G.pxN * kf, tip = [pc[0] - ux * gl, pc[1] - uy * gl];
        if (gl > 2) arrow(pc[0], pc[1], tip[0], tip[1], { color: onEtch ? C.hero : C.second, w: 6, hs: 22, alpha: kf });
        if (kf > 0.6) text(onEtch ? fmtN(mu, 2) + ' N grip' : 'Grip', tip[0] - ux * 22 + (Math.abs(uy) > 0.7 ? 14 : 0), tip[1] - uy * 22 + 8 + (Math.abs(uy) > 0.7 ? 0 : -20), Object.assign({ role: 'label', size: 22, color: onEtch ? C.heroText : C.secondText, align: Math.abs(uy) > 0.7 ? 'left' : ux > 0 ? 'right' : 'left', alpha: kf }, halo));
      }
      /* the settled frame: every grip at once, against the pull as a ring: an arrow past the ring holds */
      const kr = ep(t, 7.45, 8.05);
      if (kr > 0.003 && !m) {
        const rr0 = B08G.pull * B08G.pxN;
        circle(pc[0], pc[1], rr0, { color: '#F3F2EE', w: 2, dash: [7, 6], alpha: kr * 0.8 });
        for (const [ang2, mu2] of [[-Math.PI / 2, B08.mu.across], [Math.PI / 2, B08.mu.across], [0, B08.mu.along], [Math.PI, B08.mu.along], [Math.PI / 4, B08.mu.diag], [-Math.PI / 4, B08.mu.diag], [Math.PI * 0.75, B08.mu.diag], [-Math.PI * 0.75, B08.mu.diag]]) {
          const L2 = mu2 * B08G.pxN * E.out3(kr); arrow(pc[0], pc[1], pc[0] + Math.cos(ang2) * L2, pc[1] + Math.sin(ang2) * L2, { color: mu2 > B08G.pull ? C.hero : rgba(C.hero, 0.55), w: mu2 > B08G.pull ? 6 : 4, hs: 18, alpha: kr });
        }
        text('0.53 N: holds', pc[0] + 16, pc[1] - B08.mu.across * B08G.pxN - 6, Object.assign({ role: 'label', size: 22, color: C.heroText, alpha: kr }, halo));
        text('0.42 N: slides', pc[0] + B08.mu.along * B08G.pxN + 18, pc[1] + 8, Object.assign({ role: 'label', size: 22, color: C.heroText, alpha: kr }, halo));
        text('The 0.47 N pull', pc[0] - rr0 * 0.72 - 12, pc[1] + rr0 * 0.72 + 30, Object.assign({ role: 'label', size: 20, color: '#F3F2EE', align: 'right', alpha: kr }, halo));
      }
    }
    /* the right column: the same three pulls on both surfaces, as they happen; then the headline */
    const rx = 1240, cw = [rx + 220, rx + 340, rx + 470], ty = 330, ka0 = ep(t, 0.7, 1.1);
    if (ka0 > 0.003) {
      text('The same 0.47 N pull', rx, ty, { role: 'label', size: 21, color: C.mute, alpha: ka0 });
      ['Back', 'Sideways', 'Diagonal'].forEach((nm, i) => text(nm, cw[i], ty + 46, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: ka0 }));
      const rows = [{ name: 'Grip tape', col: C.secondText, ms: tapeMoves, et: false, y: ty + 98 }, { name: 'Etched ridges', col: C.heroText, ms: etchMoves, et: true, y: ty + 156 }];
      for (const r of rows) {
        const kr0 = r.et ? ep(t, G0.wipe[0] + 0.5, G0.wipe[0] + 0.9) : ka0; if (kr0 <= 0.003) continue;
        text(r.name, rx, r.y, { role: 'small', size: 25, weight: 750, color: r.col, alpha: kr0 });
        r.ms.forEach((m, i) => {
          const kc = ep(t, m.t + 0.4, m.t + 0.6); if (kc <= 0.003) return;
          const word = r.et ? (m.hold ? 'Holds' : 'Slides') : (i === 0 ? 'Holds' : 'Drags'), col = r.et ? C.heroText : i === 0 ? C.ink2 : C.red;
          text(word, cw[i], r.y, { role: 'small', size: 25, weight: 750, color: col, align: 'center', alpha: kc });
        });
      }
      line(rx, ty + 66, RM, ty + 66, { color: C.hair, w: 1.2, alpha: ka0 });
    }
    verdict(t, 6.4, rx, 690, { from: B08.mu.along, to: B08.mu.across, dec: 2, unit: 'N', label: 'Grip, along → across the ridges', better: 'higher', who: ['Along', 'Across'], rivalCol: 'grey', size: 132, netWord: 'grip where you pull' });
    scaleNote(rx, 900, 'a light touch, about two eggs\' weight', { lead: '1 N press', t, t0: 8.1 });
    { const a = ep(t, 8.3, 8.7); pill(rx, 946, 'study', a, { by: 'Zhang 2017' }); text('Ridges drawn far coarser than life', rx + pillW('study', { by: 'Zhang 2017' }) + 20, 946, { role: 'small', size: 22, weight: 600, color: C.faint, alpha: a }); }
  }
});

/* ============================== 6. b08_gripmap: a grip map for the hand ==============================
   Brock's note on the old slide (5/10): "grip designs need massive optimizations to look cool, and blend between there
   different textures better"; F2.14 (grip in the right places and directions); F21.9 (he wants to see the map before
   deciding it, so it is labelled a proposal). The pattern is generated, not drawn: ridge lines are streamlines of a
   direction field over the shell (b08_streams), so the ridges turn smoothly from the buttons' side-to-side (the fingertips
   pull the mouse back) to the sides' front-to-back (the lift), break into dashes and then dots where the thumb rests (it
   pushes, lifts and pulls), and open up and fade to smooth under the palm. The rival is the one smooth finish most mice
   ship: sweat floats the skin on it (Derler 2012: skin on glass, wet, μ 0.61 smooth against 1.43 roughened), so a sweaty
   lift needs 0.24 N of squeeze per side where the etch needs 0.10 N (derived: m g / 2μ for 29.31 g). */
const B08M = {
  box: [LM, 272, 1160, 688],
  top: { x: 270, y: 616, s: 5.2 },               /* where the top view settles: its centre (stage px) and scale */
  side: { x: 892, y: 680, s: 6.0 },              /* the side view's pad point (x = 0 under the sensor) */
  pull: [0, 1.3], laser: [2.9, 3.0], lift0: 1.75, lift1: 6.05
};
/** the map's top field: etched only where the hand works. The fingertips' zones on the buttons' fronts (side-to-side ridges,
   the finest), the shoulders' bands that wrap down onto the sides (front to back: the lift), and a faint run of ridges
   joining them across the buttons; the hump and the palm stay smooth */
function b08_fieldTopMap(x, y) {
  const hw = Math.max(1, keyHalfW(y)), e = smooth(clamp((Math.abs(x) / hw - 0.62) / 0.3));
  const ang = Math.sign(x || 1) * e * Math.PI / 2;
  const tip = Math.exp(-(Math.pow((Math.abs(x) - 13) / 11.5, 2) + Math.pow((y + 35) / 16, 2)));
  const band = e * (1 - smooth(clamp((y - 24) / 18))) * (1 - smooth(clamp((-y - 46) / 8)));
  const front = y < -8 ? 0.42 * (1 - smooth(clamp((y + 18) / 10))) : 0;
  const on = clamp(Math.max(tip * 1.3, band, front));
  const sep = lerp(1.55, 1.05, clamp(tip * 1.2)) + 0.35 * (1 - Math.max(tip, e));
  return { ang, sep, on, dot: 0 };
}
/** the top view's map in key-plan mm, cached */
function b08_mapTop() { return b08_streams('b08:mapTop2', { x0: -31, y0: -59.5, x1: 31, y1: 59.5, inside: b08_insideTop }, b08_fieldTopMap, { seeds: [[13, -35], [-13, -35], [27, 0], [-27, 0]] }); }
/** the side view's map in its (u = z forward, v = height) mm; inside the shell's side outline (the kit's), above the skirt,
   clear of the side buttons */
function b08_mapSide() {
  if (B08_SL.has('b08:mapSide2')) return B08_SL.get('b08:mapSide2');
  const V = msView('left'), cx = document.createElement('canvas').getContext('2d'), btn = MS_SIDE_BTN.map(b => msPath(b.map(([z, y]) => [-z, -y])));
  const ins = (u, v) => cx.isPointInPath(V.out, -u, -v);
  const inside = (u, v) => v > MS_SKIRT + 0.6 && ins(u, v) && ins(u + 1.2, v) && ins(u - 1.2, v) && ins(u, v + 1.2) && !btn.some(p => cx.isPointInPath(p, -u, -v) || cx.isPointInPath(p, -u, -v - 1.0) || cx.isPointInPath(p, -u, -v + 1.0));
  return b08_streams('b08:mapSide2', { x0: -60, y0: 0, x1: 60, y1: 41, inside }, b08_fieldSideMap, { seeds: [[4, 13.4], [24, 14], [-20, 16]] });
}
/** the side view's field: dots where the thumb rests (below the side buttons, at the middle), stretching into dashes and then
   the front-to-back ridges of the lift; fading out at the nose and the tail */
function b08_fieldSideMap(u, v) {
  const d = Math.hypot((u - 4) / 15, (v - 13.4) / 5.0), dot = 1 - smooth(clamp((d - 0.5) / 0.85));
  const ang = 0.05 * Math.sin(u / 16) - 0.12 * smooth(clamp((v - 26) / 10)) * Math.sign(u - 6);
  const sep = lerp(1.5, 1.85, dot);
  const on = (1 - smooth(clamp((Math.abs(u - 2) - 34) / 14))) * (1 - smooth(clamp((v - 29) / 6)));
  return { ang, sep, on, dot };
}
/** sweat beads on a contact zone, in stage px: n beads round (x, y) in an ellipse rx × ry; k (0..1) how wet; drain (0..1:
   the etch takes them into its grooves) */
function b08_sweat(x, y, rx, ry, k, o = {}) {
  if (k <= 0.003) return;
  const r = rng(o.seed || 5), n = o.n || 14, dr = clamp(o.drain || 0);
  G.save();
  for (let i = 0; i < n; i++) {
    const a = r() * TAU, rr = Math.sqrt(r()), px = x + Math.cos(a) * rx * rr, py = y + Math.sin(a) * ry * rr, sz = (2.2 + r() * 3.2) * (1 - dr * 0.85), ki = clamp(k * 1.6 - r() * 0.6);
    if (ki <= 0.01 || sz < 0.4) continue;
    G.globalAlpha = ki * (1 - dr * 0.6); G.fillStyle = 'rgba(168,196,224,0.55)'; G.beginPath(); G.ellipse(px, py, sz, sz * 0.85, 0, 0, TAU); G.fill();
    G.fillStyle = 'rgba(255,255,255,0.7)'; G.beginPath(); G.arc(px - sz * 0.3, py - sz * 0.3, sz * 0.32, 0, TAU); G.fill();
  }
  G.restore();
}
S({
  id: 'b08_gripmap', ch: 'surface', theme: 'night', title: 'A grip map for the hand', settle: 11, ideas: [60],
  replaces: ['srf_gripmap'],
  src: ['srf_derler', 'b08_zhang17', 'srf_f110', 'srf_doc'],
  answers: [
    ['"grip designs need massive optimizations to look cool"', 'The map is generated, not drawn: every ridge is a streamline of one direction field over the shell, evenly spaced, so the pattern flows over the buttons and wraps the shoulders like a single designed surface'],
    ['"and blend between there different textures better"', 'No borders between textures: the ridges turn continuously from side to side (the buttons) to front to back (the sides), break into dashes and then dots where the thumb rests, and open up and fade to smooth under the palm'],
    ['F2.14 "grip in exactly the right places in exactly the right directions"', 'Each zone is etched across the slip it must stop: pull on the buttons, lift on the sides, every way under the thumb, none under the palm; each named on the map'],
    ['F21.9 (he wants to see the map before deciding it)', 'Labelled as the proposed map, to be tuned on hands; the question is in the report'],
    ['(problem first, G1)', 'The rival is the one smooth finish most mice ship: a sweaty lift slips out of the fingers; the same lift holds once the map is etched']
  ],
  draw: t => {
    header(t, 'A grip map for the hand');
    captions(t, [[0.5, 'Most mice have one finish everywhere. When your hand sweats, the skin floats on it and the mouse slips.'],
      [3.0, 'A laser etches each zone for its job: ridges across your pull and your lift, dots under the thumb, nothing under the palm.']]);
    const M0 = B08M, box = M0.box, hand = { a: 1 };
    /* the camera: it opens where the last slide ended (pushed in on the left button's ridges, b08_grip's establish shot in its
       1080 px box) and pulls back until the whole top view sits at M0.top */
    const gBox = [LM, 272, 1080, 688], A = camFit(B08G.focus, gBox, 0.06), sT = M0.top.s, ox = box[0] + box[2] / 2, oy = box[1] + box[3] / 2;
    const A2 = { cx: A.cx + (ox - (gBox[0] + gBox[2] / 2)) / A.s, cy: A.cy + (oy - (gBox[1] + gBox[3] / 2)) / A.s, s: A.s };
    const Bc = { cx: (ox - M0.top.x) / sT, cy: (oy - M0.top.y) / sT, s: sT };
    const c = cam(t, [[M0.pull[0] + 0.15, A2.cx, A2.cy, A2.s], [M0.pull[1], Bc.cx, Bc.cy, Bc.s]]);
    const kz = 1 - c.k;                                               /* 1 while pushed in */
    const PT = (mx, my) => [ox + (mx - c.cx) * c.s, oy + (my - c.cy) * c.s];
    /* the laser: a line sweeping left to right over the map area; the etch appears behind it */
    const kl = ep(t, M0.laser[0], M0.laser[0] + M0.laser[1], E.lin), lx = lerp(box[0] - 10, box[0] + box[2] + 10, kl), lasering = kl > 0 && kl < 1;
    const reveal = px => t >= M0.laser[0] + M0.laser[1] ? 1 : clamp((lx - px) / 60);
    /* the side view lifts with the hand: the rival's lift slips back, the etched lift holds */
    const liftAt = (t0, holds) => { const up = ep(t, t0, t0 + 0.45, E.io3), down = ep(t, t0 + 0.95, t0 + 1.35, E.io3), hand2 = 10 * (up - down);
      const slip = holds ? 0 : 10 * up * E.in3(clamp((t - t0 - 0.15) / 0.5)) * (1 - down); return { hand: hand2, mouse: Math.max(0, hand2 - slip) }; };
    const L0 = liftAt(M0.lift0, false), L1 = liftAt(M0.lift1, true), lift = t < M0.lift1 - 0.2 ? L0 : L1;   /* mm */
    /* the top view, in the camera; then its map, in key-plan mm (× MS_K), revealed by the laser. Before the laser only the
       left button's patch from the last slide is etched; it fades as the camera pulls back */
    withCam(c, box, () => mouseSimple('top', { lw: 2, fill: '#1A1B1E' }));
    const MT0 = [c.s * MS_K.x, 0, 0, c.s * MS_K.y, PT(0, 0)[0], PT(0, 0)[1]];
    clipped(box[0], box[1], box[2], box[3], () => {
      const tp = B08G.tape, pre = (x, y) => (x * MS_K.x > tp[0] && x * MS_K.x < tp[0] + tp[2] && y * MS_K.y > tp[1] && y * MS_K.y < tp[1] + tp[3] ? 1 : 0) * (1 - ep(t, M0.pull[1] - 0.2, M0.pull[1] + 0.5));
      b08_drawStreams(b08_mapTop(), MT0, { w: lerp(1.6, 2.8, kz), reveal: (x, y) => Math.max(pre(x, y), reveal(PT(x * MS_K.x, y * MS_K.y)[0])) });
    });
    /* the ridges macro exactly as the last slide framed it, dissolving as the camera pulls back */
    if (kz > 0.01) {
      const rf = srf_field('b08g:ridge', 900, 574, f => srf_genFilm(f, { pat: 'ridge', pitch: 24, width: 13, depth: 4.4, ang: 0, seed: 5, col: [40, 41, 46], ecol: [96, 98, 106] }));
      const tp = B08G.tape, p0 = PT(tp[0], tp[1]), p1 = PT(tp[0] + tp[2], tp[1] + tp[3]);
      G.save(); rrPath(p0[0], p0[1], p1[0] - p0[0], p1[1] - p0[1], 3.2 * c.s); G.clip(); G.beginPath(); G.rect(gBox[0], gBox[1], gBox[2], gBox[3]); G.clip();
      srf_macro(t, rf, gBox[0], gBox[1], gBox[2], gBox[3], { light: { az: 2.35, el: 0.5 }, alpha: smooth(clamp((kz - 0.3) / 0.7)), vignette: true, r: 0 });
      G.restore();
    }
    /* sweat on the fingertips' zones (top) and the thumb's (side); the etch drains it into its grooves */
    const wet = ep(t, 1.0, 1.6), drn = q => clamp(ep(t, M0.laser[0], M0.laser[0] + M0.laser[1] + 0.6) * 1.0 + 0) * clamp((lx - q[0]) / 60 + (kl >= 1 ? 1 : 0));
    if (c.k > 0.6) for (const [mx, my, sd] of [[-13, -35, 3], [13, -35, 4]]) { const q = PT(mx * MS_K.x, my * MS_K.y); b08_sweat(q[0], q[1], 30, 22, wet * clamp((c.k - 0.6) / 0.4), { seed: sd, drain: drn(q) }); }
    /* the side view: the thumb's side, the hand lifting it */
    const ks = ep(t, 0.9, 1.5), S0 = M0.side, sS = S0.s, by = S0.y - lift.mouse * sS;
    if (ks > 0.003) {
      part(S0.x, by, sS, () => mouseSimple('left', { lw: 2, fill: '#1A1B1E' }), { alpha: ks });
      b08_drawStreams(b08_mapSide(), [-sS, 0, 0, -sS, S0.x, by], { w: 1.7, alpha: ks, reveal: (u, v) => reveal(S0.x - u * sS) });
      /* the thumb's contact on the side; the hand rises 10 mm; on the smooth coat the mouse comes part way, then slips back */
      const th = [S0.x - 4 * sS, S0.y - 13.4 * sS - lift.hand * sS];
      const slipping = t > M0.lift0 + 0.2 && t < M0.lift0 + 1.0;
      b08_print(th[0], th[1], 4.6 * sS, { a: ks * 0.95, rot: 0, slide: slipping ? clamp((t - M0.lift0 - 0.2) / 0.3) : 0, dir: -Math.PI / 2 });
      b08_sweat(th[0], th[1], 24, 16, wet * ks, { seed: 9, drain: drn(th) });
      const kL0 = env(t, M0.lift0 - 0.05, M0.lift0 + 0.15, M0.lift0 + 1.1, M0.lift0 + 1.35), kL1 = env(t, M0.lift1 - 0.05, M0.lift1 + 0.15, M0.lift1 + 1.1, M0.lift1 + 1.35), kL = Math.max(kL0, kL1);
      if (kL > 0.003) {
        arrow(th[0], th[1] - 4.6 * sS * 0.82, th[0], th[1] - 4.6 * sS * 0.82 - 74, { color: '#F3F2EE', w: 4, hs: 16, alpha: kL });
        text('The hand lifts', th[0] + 16, th[1] - 4.6 * sS * 0.82 - 50, { role: 'label', size: 20, color: C.mute, alpha: kL });
        /* the mouse's weight, 0.29 N, pulling it down: on the smooth coat it wins */
        const wp = [S0.x + 22 * sS, by - 2], wl = kL0 > 0.003 ? 70 : 70;
        arrow(wp[0], wp[1] - 40, wp[0], wp[1] - 40 + wl, { color: kL0 > kL1 ? C.red : C.mute, w: 3.5, hs: 14, alpha: kL });
        text('0.29 N', wp[0] + 14, wp[1] - 40 + wl * 0.6, { role: 'label', size: 20, color: kL0 > kL1 ? C.red : C.mute, alpha: kL });
      }
      const r0 = env(t, M0.lift0 + 0.55, M0.lift0 + 0.7, M0.lift0 + 1.6, M0.lift0 + 1.9), r1 = ep(t, M0.lift1 + 0.5, M0.lift1 + 0.65);
      /* what wins: the weight (it slips) or the grip (it holds), named at the mouse's foot */
      const wq = [S0.x + 22 * sS, by + 2];
      if (r0 > 0.003) faultTag(t, M0.lift0 + 0.55, wq, 'Slips out of a sweaty grip', { to: [wq[0] + 40, S0.y + 76], side: 'r', alpha: r0 });
      if (r1 > 0.003) fixTag(t, M0.lift1 + 0.5, wq, 'Holds, sweaty', { to: [wq[0] + 40, S0.y + 76], side: 'r' });
    }
    /* the laser line */
    if (lasering) { line(lx, box[1] + 6, lx, box[1] + box[3] - 6, { color: C.hero, w: 2.5 }); G.save(); G.globalAlpha = 0.18; G.fillStyle = C.hero; G.fillRect(lx - 16, box[1] + 6, 16, box[3] - 12); G.restore(); }
    /* each zone's job, named on the map */
    if (t > 7.0) {
      const q1 = PT(-13 * MS_K.x, -40 * MS_K.y), q2 = PT(0, 34 * MS_K.y), q4 = [S0.x + 26 * sS, S0.y - 20 * sS];
      fixTag(t, 7.0, q1, 'Pull', { to: [q1[0] + 230, q1[1] - 44], side: 'r' });
      callout(t, 7.15, q2, 'Glide: smooth', { to: [q2[0] + 200, q2[1] + 56], side: 'r', color: C.mute, tcolor: C.mute });
      fixTag(t, 7.3, [S0.x - 9 * sS, S0.y - 11.5 * sS], 'Thumb: dots', { to: [S0.x - 30, S0.y + 128], side: 'l' });
      fixTag(t, 7.45, q4, 'Lift', { to: [q4[0] + 40, q4[1] - 130], side: 'r' });
    }
    text('Proposed map, to be tuned on hands. Ridges drawn far coarser than life.', box[0], box[1] + box[3] + 2, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 8.2, 8.6) });
    /* the right column: one pattern with no borders (it blends), then the payoff */
    const rx = 1320, kb = ep(t, 3.6, 4.1);
    if (kb > 0.003) {
      text('One pattern, no borders', rx, 330, { role: 'label', size: 21, color: C.mute, alpha: kb });
      const sx = rx, sy = 356, sw = RM - rx, sh = 96, U = 46, Vh = 8.5, sc0 = sw / U;
      demoWindow(sx, sy, sw, sh, kb, { fill: '#1A1B1E' });
      const LB = b08_streams('b08:blend2', { x0: 0, y0: 0, x1: U, y1: Vh, inside: (u, v) => u > 0.6 && u < U - 0.6 && v > 0.7 && v < Vh - 0.7 },
        (u, v) => ({ ang: 0, sep: 1.2, on: 1 - smooth(clamp((u - 35) / 8)), dot: smooth(clamp((u - 7) / 22)) }), { seeds: [[3, 4.25]] });
      clipped(sx, sy, sw * clamp((t - 3.6) / 1.2), sh, () => b08_drawStreams(LB, [sc0, 0, 0, sc0, sx, sy], { w: 1.8, alpha: kb }));
      [['Ridges', 0.08], ['Dashes', 0.38], ['Dots', 0.62], ['Smooth', 0.9]].forEach(([nm, f], i) => text(nm, sx + sw * f, sy + sh + 30, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: stagger(t, 4.0, i, 0.15, 0.4) }));
    }
    verdict(t, 6.6, rx, 690, { from: B08.lift.smooth, to: B08.lift.rough, dec: 2, unit: 'N', label: 'Squeeze to lift, sweaty fingers', better: 'lower', who: ['Smooth coat', 'Etched'], rivalCol: 'grey', size: 128, maxW: RM - rx });
    scaleNote(rx, 880, 'per side, to lift the 29.31 g mouse', { t, t0: 8.3 });
    { const a = ep(t, 8.5, 8.9), w0 = pillW('study', { by: 'Derler 2012' }); pill(rx, 926, 'study', a, { by: 'Derler 2012' }); pill(rx + w0 + 20, 926, 'derived', a); text('Skin on glass, wet: sweat floats it on smooth, drains into rough', rx, 962, { role: 'small', size: 22, weight: 600, color: C.faint, alpha: a, maxW: RM - rx }); }
  }
});
