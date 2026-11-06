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
  b08_coverage: { t: 'Derived here from Cerakote\'s own sheets: coverage is per gallon at 1.0 mil (H-167: "per Gallon at 1.0 Mil", 606 ft² = 1604 ft² × 37.8 % volume solids). The F-Series solvent is PCBTF, 1.33 to 1.35 g/mL (F-118 SDS: 50 to < 75 wt %), so a dry film\'s density is (liquid − (1 − φ) × 1.34) / φ: H-167 1.39 g/cm³ (which reproduces its stated 38 % weight solids), F-110 (φ = 604 / 1604 = 37.7 %) 1.60 to 1.71 g/cm³ at 1.44 to 1.48 g/mL; reading F-110\'s 38 % as weight solids gives 1.45. The 0.75 mil (19.05 µm) film over the shell\'s 133 cm² then weighs 0.37 to 0.43 g. The old slide read 604 ft² as a 0.75 mil figure and got 0.49 g.', u: 'https://images.nicindustries.com/cerakote/documents/7090/cerakote-f-118-shale-dt20250219191608571971.pdf', n: 'Research fill b08-8 (Q2, 09:24). A weighed shell before and after coating would settle the last digit.' },
  b08_iso15184: { t: 'ISO 15184:1998, paints and varnishes, scratch hardness by pencil test: the lead squared flat, held at (45 ± 1)°, the tip loaded with (750 ± 10) g, pushed at least 7 mm at 0.5 to 1 mm/s; the pencil hardness is the hardest pencil that does not mark the coating', u: 'https://cdn.standards.iteh.ai/samples/25759/9e1251dca2bf4d5ca72a4e7bafb2bcb7/ISO-15184-1998.pdf' },
  b08_clay: { t: 'The Pottery Wheel, "What Happens to Clay When it is Fired in a Kiln?": unfired greenware "will dissolve, or \'slake down\' in the water"; "Bisque ware does not dissolve in water"; clay is "often bisque fired up to 1823F (995C), which is referred to as cone 06", by which point it "has been turned from clay to ceramic material"', u: 'https://thepotterywheel.com/what-happens-to-clay-when-it-is-fired/' },
  b08_pur: { t: 'Cultural Heritage Agency of the Netherlands, plastics identification tool, polyurethane ester: "Soft PUR esters undergo mainly hydrolysis"; esters "become tacky and lose their flexibility"', u: 'https://plastic-en.tool.cultureelerfgoed.nl/plastics/detail/PUR%20ester%20soft', n: 'The tool describes foams; soft-touch coatings are polyurethanes too, and the same hydrolysis is why they turn sticky.' },
  b08_doc16: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse", idea 16: a "baked ceramic coating" against PMM\'s "air dry ceramic coating", which "despite being extremely grippy, had durability issues"; "a dried clay pot is weaker than a pot put in a kiln"; the rubberized coating\'s "susceptibility to being rubbed off"; on polypropylene Cerakote "relies on how the surface is sanded rather than the material composition for its bond"', u: '', n: 'Brock\'s own document.' },
  /* directional grip */
  b08_zhang17: { t: 'Zhang, Zeng, Igartua, Rodriguez-Vidal & van der Heide 2017, Tribology Letters 65(3): laser-textured stainless steel against a fingertip (right index, one subject, dry skin, 17 mm/s). Grooves 20 µm wide, 10 µm deep, 25 µm apart: friction across them 0.51, 0.50, 0.50, 0.51, 0.53 and along them 0.41, 0.47, 0.44, 0.42, 0.42 at 0.2 to 1.0 N; at 45° 0.50 to 0.41. A pillar grid gave 0.23 to 0.27 every way ("orientation independent")', u: 'https://research.utwente.nl/files/17961970/Zhang2017texture.pdf', n: 'At 1 N: across 0.53, along 0.42, diagonal 0.41 (+26 %); over 0.2 to 1 N across beats along by 6 to 26 %. A coarser groove on tool steel (Zhang 2015) gripped more along: the direction is set by the groove\'s size, which is why the etch is specified, not just "grooved".' },
  b08_johnson: { t: 'Johnson, Hagberg, Wigaeus Hjelm & Rempel 2000, Measuring and characterizing force exposures during computer mouse use, Scand J Work Environ Health 26(5): 398-405: mean force on the button 0.35 N, on the sides 0.43 N', u: 'https://www.sjweh.fi/article/560' },
  b08_covestro: { t: 'Covestro, "Soft touch waterborne polyurethane coatings: control of optic and haptic properties" (white paper, July 2021): the haptic effect "can already be obtained in coatings of only a few micrometer thickness", matt soft-touch "even ... at very low film thickness (2 to 3 µm)"', u: 'https://solutions.covestro.com/-/media/covestro/solution-center/brands/downloads/imported/1652424150.pdf', n: 'No maker publishes the soft-touch film on a mouse; RadTech 2016 tested at 2 mil (51 µm).' },
  b08_huntsman: { t: 'Buchanan (Huntsman), "UV-resistant epoxies", Coatings Trends & Technologies 2024: clear coats on glass under QUV-A (ASTM G53): a polyurethane clear coat ΔE 0.13 at 500 h and 0.19 at 1,000 h; aromatic (BADGE) epoxies ΔE 16.3 to 21.8 at 500 h, "failure before 1000 hours"', u: 'https://pcimag.com/ext/resources/Events/CTT/presentations/MitchBuchanan_Huntsman_UV-Resistant-Epoxies_2024-CTT-_New-Format.pdf', n: 'The chemistry decides; not a figure for any mouse coating.' },
  b08_wheels: { t: 'Stock scroll wheels, the weights published by sellers of lighter replacements: Endgame Gear OP1 stock wheel "1.8g" (Forky Mods); Razer Viper V2 Pro stock wheel 1.5 g, 22.5 mm across: Zeromouse\'s "original" wheel beside its 0.7 g carbon one; its V34 and V35 kits are built from a Viper V2 Pro (PC Gamer, Notebookcheck), so the original is that mouse\'s (an identification by inference, FILLS Q3)', u: 'https://forkymods.com/products/lightweight-scroll-wheel-op1', n: 'Neither says whether the tyre or axle is included. Zeromouse: https://zeromouse.co/products/carbon-scroll . Brock (F47.5): "Show the two found"; 21 searches found no other stock wheel weighed.' },
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
     coated area 133 cm² (srf_scan) → 0.368 g; with the dry film's density from its PCBTF solvent (1.60 to 1.71 g/cm³,
     b08_coverage) 0.41 to 0.43 g: the slide gives the range. Soft-touch: RadTech's 2 mil (51 µm) test film at 1.0 g/cm³ or
     more → 0.68 g. */
  film: { um: 19, mil: 0.75, gm2: 36.914 * 0.75, cm2: 133, softUm: 51, softRho: 1.0, oldG: 0.49 },
  /* fingertip friction on laser grooves, Zhang 2017: the means of its 0.2 and 0.4 N rows (a resting fingertip presses about
     0.3 N; Johnson 2000 measured 0.35 N on a button in use): across 0.51/0.50, along 0.41/0.47, at 45° 0.50/0.44 */
  mu: { across: 0.505, along: 0.44, diag: 0.47, load: 0.3 },
  /* tapes, thinnest first is the chase */
  tapes: [{ who: 'Lizard Skins DSP', mm: 0.5 }, { who: 'Pulsar SuperGrip', mm: 0.5 }, { who: 'TalonGames PU-0', mm: 0.3 }, { who: 'Keychron', mm: 0.3 }],
  /* pencil grades, softest first (ASTM D3363 / ISO 15184 scale) */
  grades: ['7B', '6B', '5B', '4B', '3B', '2B', 'B', 'HB', 'F', 'H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H'],
  wheel: { g: 0.9, pmm: 1.0 }
};
B08.film.g = B08.film.gm2 * B08.film.cm2 / 1e4;                          /* 0.368 g */
B08.film.gHi = 1.71 * 19.05e-4 * B08.film.cm2;                            /* 0.433 g: the densest reading (F-118's 1.48 g/mL) */
B08.film.softG = B08.film.softUm * B08.film.softRho * B08.film.cm2 / 1e4;  /* 0.678 g */
B08.mu.gain = B08.mu.across / B08.mu.along - 1;                            /* +0.148: shown +14 % (never rounded up) */
/* the lift: a pinch of thumb against ring finger holds the mouse up when 2 μ N ≥ m g. A pinch is about 0.3 N a side, so
   Zhang 2017's grip at 0.2 and 0.4 N applies: across the ridges 0.51 and 0.50, along them 0.41 and 0.47 (means 0.505, 0.44).
   Least squeeze a side: one direction everywhere (the sides' ridges run up and down: the lift slides along them) 0.327 N;
   the map (the sides' ridges run front to back: the lift crosses them) 0.285 N, −13 %. At the same 0.30 N squeeze the grip
   is 0.264 N along (below the 0.288 N weight: it slips) and 0.303 N across (above it: it holds). */
B08.lift = (() => { const mg = THESEUS.mass / 1000 * 9.81, across = B08.mu.across, along = B08.mu.along, sq = 0.30;
  return { mg, across, along, one: mg / (2 * along), map: mg / (2 * across), sq, gripOne: 2 * along * sq, gripMap: 2 * across * sq }; })();

/* ============================== shared helpers (b08_) ============================== */
/** dev slides (a lab for the helpers) register only with ?b08lab=1, so no other build ever sees them */
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
  const ink = o.ink || (TH ? C.ink2 : C.ink), sh = o.shear || [0, 0], ry = r * 0.78;
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
          G.globalAlpha = a0 * clamp(on * 1.15 + 0.35 * dot) * rv; G.lineWidth = Math.max(0.8, w0 * (0.55 + 0.45 * on) * (1 + 0.75 * dot));
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
      G.strokeStyle = mix('#8A8A8A', '#1C1D21', f); G.lineWidth = H * 0.034; G.stroke();
      G.strokeStyle = mix('#BFBFBF', '#4A4C53', f); G.lineWidth = H * 0.012; G.stroke();
      G.restore();
    }
  }
  /* the body: clay (pale, matte) to fired gloss (dark), turned by the light across its width */
  const c0 = mix(mix('#BBBBBB', '#6B6B6B', sl * 0.7), '#2A2B30', f), cS = mix(mix('#878787', '#4C4C4C', sl * 0.7), '#121316', f), cH = mix(mix('#D1D1D1', '#828282', sl * 0.7), '#5A5C64', f);
  const g = G.createLinearGradient(cx - Rm, 0, cx + Rm, 0);
  g.addColorStop(0, cS); g.addColorStop(0.18, c0); g.addColorStop(0.34, cH); g.addColorStop(0.62, c0); g.addColorStop(1, cS);
  body(); G.fillStyle = g; G.fill();
  G.save(); body(); G.clip();
  /* light from above: the shoulder catches it, the lower body turns away */
  const gv = G.createLinearGradient(0, Y(1), 0, by); gv.addColorStop(0, 'rgba(255,255,255,0.05)'); gv.addColorStop(0.3, 'rgba(255,255,255,0.08)'); gv.addColorStop(0.5, 'rgba(0,0,0,0)'); gv.addColorStop(1, 'rgba(0,0,0,0.28)');
  G.fillStyle = gv; G.fillRect(cx - Rm * 1.6, Y(1) - 4, Rm * 3.2, by - Y(1) + 8);
  /* throwing rings: the potter's fingers left shallow rings as the wheel turned */
  if (sl < 0.6) { G.strokeStyle = f > 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(38,38,38,0.12)'; G.lineWidth = Math.max(1, H * 0.004);
    for (let u = 0.12; u < 0.76; u += 0.034) { const r0 = R(u, 1), yy = Y(u); G.beginPath(); G.ellipse(cx, yy, r0, r0 * 0.07, 0, 0, Math.PI); G.stroke(); } }
  /* a meander band round the belly, foreshortened as it wraps the curve (the labyrinth: Theseus's) */
  if (o.key !== false && sl < 0.7) {
    const u0 = 0.49, u1 = 0.56, kc = mix('#8B8B8B', '#B6B6B6', f), n = 9, ka = (1 - sl / 0.7);
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
  if (f < 0.98 && sl < 0.9) { const r = rng(17); G.fillStyle = `rgba(68,68,68,${0.22 * (1 - f)})`; for (let i = 0; i < 160; i++) { const u = r(), s2 = r() * 2 - 1; G.fillRect(cx + s2 * R(u, 1) * 0.95, Y(u), 1.6, 1.6); } }
  if (sl > 0) { const r = rng(23); G.strokeStyle = `rgba(57,57,57,${0.5 * sl})`; G.lineWidth = 2; for (let i = 0; i < 14; i++) { const s2 = r() * 1.8 - 0.9, u = 0.3 + r() * 0.6, L = H * (0.1 + r() * 0.3) * sl; const x0 = cx + s2 * R(u, 1); G.beginPath(); G.moveTo(x0, Y(u)); G.lineTo(x0 + s2 * 3, Y(u) + L); G.stroke(); } }
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
      G.globalAlpha = a * o.wet * 0.32; G.strokeStyle = 'rgba(222,222,224,0.8)'; G.lineWidth = 1.4;
      G.beginPath(); for (let u = u1; u >= u2; u -= 0.02) { const xx = cx + s2 * R(u, 1), yy = Y(u); u === u1 ? G.moveTo(xx, yy) : G.lineTo(xx, yy); } G.stroke();
      const q = [cx + s2 * R(u2, 1), Y(u2)]; G.globalAlpha = a * o.wet * 0.9; G.fillStyle = 'rgba(238,238,240,0.9)'; G.beginPath(); G.ellipse(q[0], q[1] + 2, 2.6, 3.8, 0, 0, TAU); G.fill();
    }
    G.globalAlpha = a;
  }
  G.restore();
  /* the mouth: a dark ellipse with its rim */
  if (sl < 0.4) { const rt = R(1, 1), yt = Y(1); G.beginPath(); G.ellipse(cx, yt, rt, rt * 0.22, 0, 0, TAU); G.fillStyle = mix('#5C5C5C', '#0B0C0E', f); G.fill(); G.strokeStyle = mix('#CFCFCF', '#6A6C73', f); G.lineWidth = Math.max(1.2, H * 0.006); G.stroke(); }
  body(); G.strokeStyle = rgba(C.ink, TH ? 0.55 : 0.32); G.lineWidth = 1.4; G.stroke();
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
  const brick = TH ? '#979797' : '#494949', brickD = TH ? '#7A7A7A' : '#393939', mortar = TH ? 'rgba(17,17,17,0.18)' : 'rgba(0,0,0,0.35)', inner = TH ? '#2C2C2E' : '#141416';
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
  for (const [lx, ly] of logs) { const px = xi + wi * lx, py = gy - fbH * ly - 6; G.save(); G.translate(px, py); G.rotate(0.08); rrPath(-wi * 0.1, -7, wi * 0.2, 14, 7); G.fillStyle = '#232323'; G.fill(); if (fire > 0.05) { G.strokeStyle = rgba(C.heatL, 0.7 * fire); G.lineWidth = 2; G.stroke(); } G.restore(); }
  if (fire > 0.003) {
    G.save(); G.beginPath(); G.rect(xi, floorY, wi, fbH - 2); G.clip();
    b08_flames(cx, gy - fbH * 0.08, wi * 0.86, fbH * 0.95, { k: fire, t, n: 9, seed: 5 });
    G.restore();
    /* tongues through the floor's holes, licking up into the chamber */
    for (const hx of out.holes) b08_flames(hx, floorY - floorT, fw * 0.07, h * 0.16, { k: fire * heat, t: t + hx * 0.01, n: 2, seed: Math.round(hx) });
  }
  /* the flue: hot air shimmering up (the draught that pulls the fire) */
  if (heat > 0.05) { for (let i = 0; i < 4; i++) { const ph = ((t * 0.55 + i / 4) % 1), yy = domeTop - ph * h * 0.12; G.save(); G.globalAlpha = a * heat * (1 - ph) * 0.45; G.strokeStyle = TH ? 'rgba(78,78,78,0.6)' : 'rgba(219,219,219,0.55)'; G.lineWidth = 2; G.beginPath(); for (let s = 0; s <= 1; s += 0.1) G.lineTo(cx - flueW * 0.25 + i * flueW * 0.17 + 3 * Math.sin(s * 7 + t * 4 + i), yy - s * 22); G.stroke(); G.restore(); } }
  outer(); G.strokeStyle = rgba(C.ink, TH ? 0.5 : 0.32); G.lineWidth = 1.5; G.stroke();
  inner0(); G.strokeStyle = rgba(C.ink, TH ? 0.35 : 0.22); G.lineWidth = 1.2; G.stroke();
  G.restore();
  return out;
}
/**
 * The pencil hardness test (ISO 15184; ASTM D3363): a carriage holds a pencil at 45° with 750 g on its tip and rolls it
 * 7 mm across a coated panel. A coat softer than the lead is scratched (material torn out: the bright groove behind the
 * tip); a harder one keeps nothing but a faint grey trace that wipes off. (x, y, w, h) the panel. o = { a, k (0..1, the
 * stroke), hard (true: no mark), grade ('6H'), coat (the panel's colour), mm (px per mm of travel), x0 (the stroke's start,
 * a fraction of w) }. Returns { tip: [x, y] }.
 */
function b08_pencilTest(x, y, w, h, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return { tip: [x, y] };
  const k = clamp(o.k || 0), mm = o.mm || w / 11, sx = x + w * (o.x0 == null ? 0.2 : o.x0), sy = y + h * (o.sy == null ? 0.46 : o.sy), tx = sx + 7 * mm * k, coat = o.coat || '#2C2D32';
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
  rrPath(x, y, w, h, 6); G.strokeStyle = rgba(C.ink, TH ? 0.2 : 0.16); G.lineWidth = 1.2; G.stroke();
  /* the pencil at 45°, its lead squared flat on the panel; the carriage over it carries the 750 g */
  G.globalAlpha = a * (o.pa == null ? 1 : o.pa);
  const ang = -Math.PI / 4 * 3, ux = Math.cos(ang), uy = Math.sin(ang), Lp = o.len || Math.min(h * 2.2, 330), wp = 18;   /* up and to the left of the tip */
  G.save(); G.translate(tx, sy); G.rotate(ang);
  /* lead, cone of bare wood, then the hexagonal barrel in two greys (no colour), the grade printed on it */
  G.fillStyle = '#3B3D42'; G.fillRect(0, -2.6, 12, 5.2);
  G.beginPath(); G.moveTo(12, -3); G.lineTo(34, -wp / 2); G.lineTo(34, wp / 2); G.lineTo(12, 3); G.closePath(); G.fillStyle = '#C6C6C6'; G.fill();
  G.fillStyle = '#7C7E84'; G.fillRect(34, -wp / 2, Lp - 34, wp); G.fillStyle = '#9A9CA2'; G.fillRect(34, -wp / 2, Lp - 34, wp * 0.32); G.fillStyle = '#5C5E64'; G.fillRect(34, wp * 0.22, Lp - 34, wp * 0.28);
  G.restore();
  /* the carriage: a block clamped round the barrel, two wheels on the panel, the load on top */
  const cx = tx + ux * Lp * 0.55, cy = sy + uy * Lp * 0.55, bw = o.bw || 150, bh = o.bh || 74;
  G.save(); G.translate(cx, cy);
  rrPath(-bw / 2, -bh / 2, bw, bh, 8); G.fillStyle = TH ? '#D7D7D7' : '#3C3E44'; G.fill(); G.strokeStyle = rgba(C.ink, TH ? 0.4 : 0.3); G.lineWidth = 1.4; G.stroke();
  text('750 g', 0, 9, { role: 'label', size: 22, color: C.ink, align: 'center', alpha: a * (o.pa == null ? 1 : o.pa) });
  G.restore();
  if (o.wheels !== false) for (const dx of [-1, 1]) { const wx = cx + dx * bw * 0.36, wy = sy - 12; line(wx, cy + bh / 2, wx, wy, { color: TH ? '#898989' : '#6D6D6D', w: 3 }); circle(wx, wy + 1, 11, { fill: TH ? '#B8B8B8' : '#545454' }); circle(wx, wy + 1, 3.4, { fill: TH ? '#656565' : '#959595' }); }
  /* the grade, on the barrel near the carriage */
  if (o.grade) { const gx = tx + ux * Lp * 0.9, gy = sy + uy * Lp * 0.9; text(o.grade, gx, gy - 24, { role: 'label', size: 22, color: C.ink, align: 'center', alpha: a * (o.pa == null ? 1 : o.pa) }); }
  G.restore();
  return { tip: [tx, sy], carriage: [cx, cy] };
}

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
  G.fillStyle = TH ? '#E8E8E8' : '#111214'; G.fillRect(x, y, w, h);
  /* what the blast took: the skin between the moulded line and the new surface, ghosted, with grit lifting off it */
  if (kb > 0.003) {
    G.beginPath(); G.moveTo(x, ys); G.lineTo(x + w, ys); for (let i = N; i >= 0; i--) G.lineTo(x + i * step, P(i)); G.closePath();
    G.save(); G.fillStyle = rgba(C.ink, TH ? 0.06 : 0.06); G.fill(); G.clip();
    G.strokeStyle = rgba(C.ink, TH ? 0.16 : 0.14); G.lineWidth = 1; G.beginPath(); for (let xx = x - h; xx < x + w; xx += 9) { G.moveTo(xx, y + h); G.lineTo(xx + h, y); } G.stroke();
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
  G.fillStyle = TH ? '#E8E8E8' : '#111214'; G.fillRect(x, y, w, h);
  G.fillStyle = '#2A2B30'; G.fillRect(x, ys, w, y + h - ys);
  G.save(); G.beginPath(); G.rect(x, ys, w, y + h - ys); G.clip();
  for (const f of fib) { const cx = x + f.x * s, cy = ys + f.d * s, L = f.L * s, d = 7 * s; G.save(); G.translate(cx, cy); G.rotate(f.ang); rrPath(-L / 2, -d / 2, L, d, Math.min(d / 2, L / 2)); G.fillStyle = '#4E5057'; G.fill(); G.restore(); }
  G.restore();
  if (k > 0.003) { const tt = ys - um * s * k; G.fillStyle = '#45464C'; G.fillRect(x, tt, w, ys - tt); G.strokeStyle = 'rgba(235,236,240,0.5)'; G.lineWidth = 1.5; G.beginPath(); G.moveTo(x, tt); for (let xx = x; xx <= x + w; xx += 6) G.lineTo(xx, tt + 0.6 * Math.sin(xx * 0.08)); G.stroke(); }
  G.restore();
  return { ys, top: ys - um * s * k };
}

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
  G.fillStyle = TH ? '#E8E8E8' : '#111214'; G.fillRect(x, y, w, h);
  /* the shell, the coat on it (a line at this scale), and the etch in the coat */
  G.fillStyle = '#2A2B30'; G.fillRect(x, base, w, y + h - base);
  G.fillStyle = '#5C5E66'; G.fillRect(x, base - coat, w, coat);
  if (o.etch > 0.01) { G.save(); G.globalAlpha = o.etch; G.fillStyle = TH ? '#E8E8E8' : '#111214'; const p = Math.max(3, 0.045 * s), dw = 0.02 * s, dd = 0.01 * s; for (let xx = x; xx < x + w; xx += p) G.fillRect(xx, base - coat, dw, dd); G.restore(); }
  /* the glue: under the tape, then creeping out past the edge as a bead */
  const tTop = (xx) => { const d = xx - (ex - 150); return base - coat - glue - tapeH - (xx > ex - 150 && lift > 0 ? Math.max(0, d) * 0.16 * lift : 0); };
  if (mm > 0.001) {
    G.fillStyle = 'rgba(203,203,203,0.92)'; G.fillRect(x, base - coat - glue, ex - x, glue);
    if (ooze > 0.5) { G.beginPath(); G.moveTo(ex - 2, base - coat - glue); G.quadraticCurveTo(ex + ooze * 0.9, base - coat - glue * 0.9, ex + ooze, base - coat); G.lineTo(ex - 2, base - coat); G.closePath(); G.fill(); }
    /* the tape: a sheet with a pebbled top that wears smoother; its last stretch peels up off the glue */
    const bump = Math.min(tapeH * 0.12, 9) * (1 - 0.6 * age), per = Math.max(10, tapeH * 0.22);
    G.beginPath(); G.moveTo(x, base - coat - glue);
    for (let xx = x; xx <= ex; xx += 2) { const yt = tTop(xx) + bump * (0.5 + 0.5 * Math.cos((xx - x) / per * TAU)); G.lineTo(xx, yt); }
    G.lineTo(ex, base - coat - glue - (lift > 0 ? 150 * 0.16 * lift : 0)); G.lineTo(ex - 150, base - coat - glue); G.closePath();
    G.fillStyle = mix('#4A4B51', '#2E2E31', 0.25 * age); G.fill();
    if (lift > 0.02) { G.strokeStyle = 'rgba(203,203,203,0.85)'; G.lineWidth = 2; for (let i = 0; i < 6; i++) { const xx = ex - 140 + i * 24, yy = tTop(xx) + tapeH; G.beginPath(); G.moveTo(xx, base - coat - glue); G.lineTo(xx + 3, yy); G.stroke(); } }
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
  G.fillStyle = TH ? '#C8C8C8' : '#5E5E5E'; G.fill(); G.strokeStyle = TH ? 'rgba(40,40,40,0.6)' : 'rgba(229,229,229,0.45)'; G.lineWidth = 1.5; G.stroke();
  G.restore();
}

/* ============================== 5. b08_grip: directional grip (most important: F33.5) ==============================
   Brock (F2.14): "grip in exactly the right places in exactly the right directions, curation that grip tape doesn't allow
   for, because you need extra grip in a specific direction everywhere on the mouse, while allowing mobility in every other
   direction". His note on the old slide (8/10): "really good visualization but needs to be more intuitive".
   The demonstration: the index fingertip resting on the left button (0.3 N: Zhang 2017's 0.2 and 0.4 N rows, about what a
   resting fingertip presses, Johnson 2000), where a fingertip grip pulls the mouse back. The same 0.14 N pull (a force
   arrow) back, then sideways, on grip tape (the rival: no direction, so the same grip every way) and then, in place, on
   laser-etched ridges that run side to side. When the grip holds, the mouse moves with the finger (the camera stays on
   the desk); when it slides, the fingertip crosses a still surface and leaves a trail. Across the ridges 0.15 N of grip
   holds the pull; along them 0.13 N lets it slide. Tape holds both, so an adjustment drags the mouse. Verdict: the extra
   grip where you pull over where you adjust, 0 % (tape: no direction, as Zhang's pillar grid) → 14 % (0.505 / 0.44). */
const B08G = {
  c: [-14, -34],                                 /* the fingertip's contact, top view mm (the left button's front) */
  focus: [-31.1, -42.8, 30, 20],                 /* the push-in's frame, mm: the fingertip starts up and right of centre and
                                                    ends as far down and left, after the mouse has moved under it */
  tape: [-28.2, -53, 26.4, 33],                  /* the pre-cut tape on the left button, mm (x, y, w, h) */
  pull: 0.14,                                    /* N: between the two grips at a 0.3 N press (0.132 along, 0.152 across) */
  pxN: 1300,                                     /* px per newton for the arrows */
  d: 1.2, dSlide: 3.0,                           /* mm a held pull carries the mouse; mm a fingertip slides */
  moves: [{ t: 1.8, ang: Math.PI / 2, name: 'Back' }, { t: 2.9, ang: Math.PI, name: 'Sideways' }],
  wipe: [4.1, 0.8], etch: 5.0, step: 1.1         /* the etch's moves start at 5.0 s, one every 1.1 s */
};
/** where the print and the surface are at time t: moves = [{ t, ang, hold }] → { off: the print's slide over the surface (mm,
   mouse frame), surf: the mouse's own travel on the desk (mm: a held pull carries it), act (the move in play or null), k
   (0..1 of it), slid (sliding now) } */
function b08_gripState(t, moves, d, dS = d) {
  let off = [0, 0], surf = [0, 0], act = null, k = 0, slid = false;
  for (const m of moves) {
    const kk = ep(t, m.t, m.t + 0.55, E.io3);
    if (t >= m.t && t < m.t + 0.9) { act = m; k = kk; }
    const dd = m.hold ? d : dS, dv = [Math.cos(m.ang) * dd * kk, Math.sin(m.ang) * dd * kk];
    if (m.hold) surf = [surf[0] + dv[0], surf[1] + dv[1]];
    else { off = [off[0] + dv[0], off[1] + dv[1]]; if (t >= m.t && kk < 1) slid = true; }
  }
  return { off, surf, act, k, slid };
}
S({
  id: 'b08_grip', ch: 'surface', theme: 'night', title: 'Directional grip', settle: 10.5, ideas: [60],
  replaces: ['grip'],
  src: ['b08_zhang17', 'b08_zhang15', 'b08_johnson', 'srf_serg22', 'srf_lizard', 'srf_doc'],
  answers: [
    ['"really good visualization"', 'Kept what worked: the lit, magnified laser grooves under a fingertip print, pulled across them (F2.43)'],
    ['"but needs to be more intuitive"', 'It starts on the mouse: the index fingertip on the left button, where a fingertip grip pulls the mouse back, then one push-in to the fingertip (a locator stays in the corner)'],
    ['"needs to be more intuitive" (the demonstration)', 'One input, shown as a force arrow: the same 0.14 N pull, back and then sideways. When the grip holds, the mouse moves with the finger; when it slides, the fingertip crosses a still surface and leaves a trail. Tape holds both, so the sideways adjustment drags the mouse; the etch holds the pull back (0.15 N of grip) and lets the sideways one slide (0.13 N)'],
    ['"needs to be more intuitive" (the abstractions)', 'No μ and no polar chart: every grip is an arrow in newtons at a 0.3 N touch (Zhang 2017\'s 0.2 and 0.4 N rows, where a resting fingertip presses), set against the pull drawn as a ring'],
    ['F2.14 "grip in exactly the right directions ... while allowing mobility in every other direction"', 'Said and shown: grip across the ridges, where you pull; along them the fingertip moves and the mouse stays'],
    ['F33.5 (an important idea, executed better)', 'Problem first (tape drags the mouse when you adjust), the fix in place by a wipe, the payoff: 14 % more grip where you pull than where you adjust, against none on tape']
  ],
  draw: t => {
    header(t, 'Directional grip');
    captions(t, [[0.6, 'Your fingertips pull the mouse back. Grip tape grips the same every way, so it fights your adjustments too.'],
      [4.7, 'Laser-etched ridges grip across them, where you pull, and let your fingertip slide along them.']]);
    const box = [LM, 272, 1080, 688], G0 = B08G, [cxm, cym] = G0.c, F = B08.mu.load;
    /* the moves: the same two pulls on each surface; on tape both hold (the second drags the mouse), on the etch the pull
       back holds and the sideways one slides */
    const tapeMoves = G0.moves.map(m => ({ t: m.t, ang: m.ang, hold: true, name: m.name })), etchMoves = G0.moves.map((m, i) => ({ t: G0.etch + i * G0.step, ang: m.ang, hold: i === 0, name: m.name }));
    const onEtch = t >= G0.wipe[0] + G0.wipe[1] * 0.5;
    const s0 = b08_gripState(t, tapeMoves, G0.d, G0.dSlide), s1 = b08_gripState(t, etchMoves, G0.d, G0.dSlide);
    const st = onEtch ? s1 : s0, surf = [s0.surf[0] + s1.surf[0], s0.surf[1] + s1.surf[1]];
    /* the camera stays on the desk: a held pull carries the mouse, so the camera's frame on the mouse moves the other way */
    const fo = [G0.focus[0] - surf[0], G0.focus[1] - surf[1], G0.focus[2], G0.focus[3]];
    const tapePath = () => { const [x, y, w, h] = G0.tape; pathRR(x, y, w, h, 3.2); };
    const est = establish(t, 0, box, { view: 'top', hi: ['trigL'], col: 'ink', focus: fo, hold: 0.55, dur: 1.15, locator: 'tl', fade: 0.35,
      draw: (P, c, k) => {
        G.save(); tapePath(); G.fillStyle = rgba(C.second, TH ? 0.16 : 0.12); G.fill();
        G.clip(); srf_lines([-40, -60, 10, -10], 1.2, Math.PI / 3, rgba(C.second, 0.5), lw(1), 1); srf_lines([-40, -60, 10, -10], 1.2, -Math.PI / 3, rgba(C.second, 0.5), lw(1), 1); G.restore();
        /* tape has an edge you can feel and see; the etch, after the wipe, has none */
        const ke = 1 - ep(t, G0.wipe[0], G0.wipe[0] + G0.wipe[1]);
        if (ke > 0.003) { G.save(); G.globalAlpha *= ke; tapePath(); G.strokeStyle = C.second; G.lineWidth = lw(2); G.stroke(); G.restore(); }
      } });
    const P = est.P, s = est.s, kd = est.kd, R = 6 * s;
    /* the surface under the fingertip, magnified, moving with the mouse: grip tape, then (in place) the etched ridges */
    const tf = srf_field('b08g:tape', 900, 574, f => b08_genTape(f, { pitch: 30, width: 7, seed: 6 }));
    const rf = srf_field('b08g:ridge', 900, 574, f => srf_genFilm(f, { pat: 'ridge', pitch: 24, width: 13, depth: 4.4, ang: 0, seed: 5, col: [40, 41, 46], ecol: [96, 98, 106] }));
    const light = { az: 2.35, el: 0.5 }, sx = surf[0] * s, sy = surf[1] * s;
    const clipPiece = fn => { G.save(); G.beginPath(); const [x, y, w, h] = G0.tape, a = P(x, y), b = P(x + w, y + h); rrPath(a[0], a[1], b[0] - a[0], b[1] - a[1], 3.2 * s); G.clip(); G.beginPath(); G.rect(box[0], box[1], box[2], box[3]); G.clip(); fn(); G.restore(); };
    if (kd > 0.003) {
      wipeTo(t, G0.wipe[0], G0.wipe[1], box,
        () => clipPiece(() => srf_macro(t, tf, box[0] + sx - 60, box[1] + sy - 120, box[2] + 120, box[3] + 240, { light, alpha: kd, vignette: true, r: 0 })),
        () => clipPiece(() => srf_macro(t, rf, box[0] + sx - 60, box[1] + sy - 120, box[2] + 120, box[3] + 240, { light, alpha: kd, vignette: true, r: 0 })),
        { rival: 'Grip tape', ly: box[1] + box[3] - 24 });
    }
    /* the fingertip from above, to scale (F52.1), on its print: solid until the push lands, then seen through (the kit's
       ghost) so the print under it shows and stays a fingertip's; it travels with the print when the print slides */
    const pc = P(cxm + st.off[0], cym + st.off[1]), kp = ep(t, 1.25, 1.6), halo = { glow: 'rgba(0,0,0,0.95)', glowR: 12 };
    const tip = () => clipped(box[0], box[1], box[2], box[3], () => finger(pc[0], pc[1], -Math.PI / 2, { s, view: 'top', press: 0.6, ghost: 0.8 * ep(t, 1.3, 1.7) }));
    if (kp <= 0.003) tip();
    if (kp > 0.003) {
      const m = st.act, hold = m && m.hold, ang = m ? m.ang : 0, k = st.k, ux = Math.cos(ang), uy = Math.sin(ang);
      /* a sliding print leaves a short trail on the still surface behind it */
      if (onEtch && (st.off[0] || st.off[1])) {
        const q0 = P(cxm, cym), ka = 1 - ep(t, 7.2, 7.6);
        G.save(); G.globalAlpha = 0.5 * ka; G.strokeStyle = C.heroText; G.lineWidth = R * 1.1; G.lineCap = 'round'; G.setLineDash([]);
        const gr = G.createLinearGradient(q0[0], q0[1], pc[0], pc[1]); gr.addColorStop(0, rgba(C.hero, 0)); gr.addColorStop(1, rgba(C.hero, 0.35)); G.strokeStyle = gr;
        G.beginPath(); G.moveTo(q0[0], q0[1]); G.lineTo(pc[0], pc[1]); G.stroke(); G.restore();
      }
      /* the skin shears toward a pull it resists; a sliding print smears */
      const shear = hold ? [ux * 10 * k, uy * 10 * k] : [0, 0];
      b08_print(pc[0], pc[1], R, { a: kp, rot: 0.06, shear, slide: m && !hold ? Math.sin(Math.PI * clamp(k)) : 0, dir: ang });
      tip();
      if (m) {
        const ka = ep(t, m.t, m.t + 0.12) * (1 - ep(t, m.t + 0.72, m.t + 0.86)), L = G0.pull * G0.pxN;
        /* the pull: a force arrow from the fingertip, the way the finger pulls */
        const vert = Math.abs(uy) > 0.7, tipP = [pc[0] + ux * L, pc[1] + uy * L];
        forceArrow(tipP[0], tipP[1], ang, L, { k: ka, color: C.ink, w: 5, hs: 20 });
        if (ka > 0.02) text(fmtN(G0.pull, 2) + ' N pull', vert ? tipP[0] : tipP[0] + ux * 18, vert ? tipP[1] + uy * 34 + 8 : tipP[1] + 8, Object.assign({ role: 'label', size: 22, color: C.ink, align: vert ? 'center' : ux < 0 ? 'right' : 'left', alpha: ka }, halo));
        /* the grip that answers it, opposite: yellow on tape (unnumbered: no paper measures tape), blue on the etch */
        const kf = ka * ep(t, m.t + 0.1, m.t + 0.35), mu = onEtch ? (m.name === 'Back' ? B08.mu.across : B08.mu.along) : B08.mu.across;
        const gl = mu * F * G0.pxN * kf, tip = [pc[0] - ux * gl, pc[1] - uy * gl];
        if (gl > 2) arrow(pc[0], pc[1], tip[0], tip[1], { color: onEtch ? C.hero : C.second, w: 6, hs: 22, alpha: kf });
        if (kf > 0.6) text(onEtch ? fmtN(mu * F, 2) + ' N grip' : 'Grip', tip[0] - ux * 22 + (Math.abs(uy) > 0.7 ? 14 : 0), tip[1] - uy * 22 + 8 + (Math.abs(uy) > 0.7 ? 0 : -20), Object.assign({ role: 'label', size: 22, color: onEtch ? C.heroText : C.secondText, align: Math.abs(uy) > 0.7 ? 'left' : ux > 0 ? 'right' : 'left', alpha: kf }, halo));
        /* what happened, at the fingertip: the mouse came with it, or the finger moved on alone */
        const kw = ep(t, m.t + 0.45, m.t + 0.6) * (1 - ep(t, m.t + 0.8, m.t + 0.95));
        const word = onEtch ? (hold ? 'Holds: the mouse comes back' : 'Slides: the mouse stays') : (hold && m.name === 'Back' ? 'Holds: the mouse comes back' : 'Drags the mouse');
        if (kw > 0.003) text(word, pc[0], vert ? tipP[1] + 84 : pc[1] + R * 0.78 + 52, Object.assign({ role: 'label', size: 24, color: !onEtch && m.name !== 'Back' ? C.red : onEtch ? C.heroText : C.ink, align: 'center', alpha: kw }, halo));
      }
      /* the settled frame: every grip at once, against the pull as a ring: an arrow past the ring holds */
      const kr = ep(t, 7.6, 8.2);
      if (kr > 0.003 && !m) {
        const rr0 = G0.pull * G0.pxN;
        circle(pc[0], pc[1], rr0, { color: C.ink, w: 2, dash: [7, 6], alpha: kr * 0.8 });
        for (const [ang2, mu2] of [[-Math.PI / 2, B08.mu.across], [Math.PI / 2, B08.mu.across], [0, B08.mu.along], [Math.PI, B08.mu.along], [Math.PI / 4, B08.mu.diag], [-Math.PI / 4, B08.mu.diag], [Math.PI * 0.75, B08.mu.diag], [-Math.PI * 0.75, B08.mu.diag]]) {
          const f2 = mu2 * F, L2 = f2 * G0.pxN * E.out3(kr); arrow(pc[0], pc[1], pc[0] + Math.cos(ang2) * L2, pc[1] + Math.sin(ang2) * L2, { color: f2 > G0.pull ? C.hero : rgba(C.hero, 0.55), w: f2 > G0.pull ? 6 : 4, hs: 18, alpha: kr });
        }
        text(fmtN(B08.mu.across * F, 2) + ' N: holds', pc[0] + 16, pc[1] - B08.mu.across * F * G0.pxN - 6, Object.assign({ role: 'label', size: 22, color: C.heroText, alpha: kr }, halo));
        text(fmtN(B08.mu.along * F, 2) + ' N: slides', pc[0] + B08.mu.along * F * G0.pxN + 18, pc[1] + 8, Object.assign({ role: 'label', size: 22, color: C.heroText, alpha: kr }, halo));
        text('The ' + fmtN(G0.pull, 2) + ' N pull', pc[0] - rr0 * 0.72 - 12, pc[1] + rr0 * 0.72 + 30, Object.assign({ role: 'label', size: 20, color: C.ink, align: 'right', alpha: kr }, halo));
      }
    }
    /* the right column: the same two pulls on both surfaces, as they happen; then the headline */
    const rx = 1240, cw = [rx + 300, rx + 470], ty = 330, ka0 = ep(t, 0.7, 1.1);
    if (ka0 > 0.003) {
      text('The same ' + fmtN(G0.pull, 2) + ' N pull', rx, ty, { role: 'label', size: 21, color: C.mute, alpha: ka0 });
      ['Back', 'Sideways'].forEach((nm, i) => text(nm, cw[i], ty + 46, { role: 'label', size: 20, color: C.faint, align: 'center', alpha: ka0 }));
      const rows = [{ name: 'Grip tape', col: C.secondText, ms: tapeMoves, et: false, y: ty + 102 }, { name: 'Etched ridges', col: C.heroText, ms: etchMoves, et: true, y: ty + 164 }];
      for (const r of rows) {
        const kr0 = r.et ? ep(t, G0.wipe[0] + 0.5, G0.wipe[0] + 0.9) : ka0; if (kr0 <= 0.003) continue;
        text(r.name, rx, r.y, { role: 'small', size: 27, weight: 750, color: r.col, alpha: kr0 });
        r.ms.forEach((m, i) => {
          const kc = ep(t, m.t + 0.4, m.t + 0.6); if (kc <= 0.003) return;
          const word = r.et ? (m.hold ? 'Holds' : 'Slides') : (i === 0 ? 'Holds' : 'Drags'), col = r.et ? C.heroText : i === 0 ? C.ink2 : C.red;
          text(word, cw[i], r.y, { role: 'small', size: 27, weight: 750, color: col, align: 'center', alpha: kc });
        });
      }
      line(rx, ty + 66, RM, ty + 66, { color: C.hair, w: 1.2, alpha: ka0 });
    }
    verdict(t, 6.9, rx, 700, { from: 0, to: Math.floor(B08.mu.gain * 100), unit: '%', dec: 0, label: 'Extra grip where you pull, over where you adjust', better: 'higher', who: ['Grip tape', 'Etched ridges'], size: 132, maxW: RM - rx });
    scaleNote(rx, 832, "a light touch, about half an egg's weight", { lead: '0.3 N press', t, t0: 8.1 });
    { const a = ep(t, 8.3, 8.7); pill(rx, 880, 'study', a, { by: 'Zhang 2017' }); text('Laser grooves in steel, one fingertip; the etch copies their size (20 µm wide, 10 deep, 25 apart). Tape has no direction, so it grips the same every way (as Zhang\'s pillar grid did). Ridges drawn far coarser than life.', rx, 916, { role: 'small', size: 21, weight: 600, color: C.faint, alpha: a, maxW: RM - rx }); }
  }
});

/* ============================== 6. b08_gripmap: a grip map for the hand ==============================
   Brock's note on the old slide (5/10): "grip designs need massive optimizations to look cool, and blend between there
   different textures better"; F2.14 (grip in the right places and directions); F21.9 (he wants to see the map before
   deciding it, so it is labelled a proposal). The pattern is generated, not drawn: ridge lines are streamlines of a
   direction field over the shell (b08_streams), so the ridges turn smoothly from the buttons' side-to-side (the fingertips
   pull the mouse back) to the sides' front-to-back (the lift), and where a zone ends they break into dashes, then dots, then
   smooth (the palm). The rival is the naive etch: the button's ridges run one way over the whole grip, so down the sides
   they run up and down and a lift slides along them. Zhang 2017's grip across against along at a pinch's load gives the
   least squeeze to lift: 0.33 N a side against 0.28 N (B08.lift, derived). Sweat is left out: the old slide's wet-skin
   numbers (Derler) could not be re-checked, and dry, the textures in Zhang 2017 grip less than smooth would (PROGRESS.md,
   "Models and conventions checked"). */
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
  return { ang, sep, on, dot: smooth(clamp((0.8 - on) / 0.6)) };
}
/** the rival: the same zones etched, the ridges all one way (side to side, as on the button) */
function b08_fieldTopUni(x, y) { const f = b08_fieldTopMap(x, y); return { ang: 0, sep: 1.35, on: f.on, dot: f.dot }; }
function b08_uniTop() { return b08_streams('b08:uniTop', { x0: -31, y0: -59.5, x1: 31, y1: 59.5, inside: b08_insideTop }, b08_fieldTopUni, { seeds: [[13, -35], [-13, -35], [27, 0], [-27, 0]] }); }
/** the top view's map in key-plan mm, cached */
function b08_mapTop() { return b08_streams('b08:mapTop2', { x0: -31, y0: -59.5, x1: 31, y1: 59.5, inside: b08_insideTop }, b08_fieldTopMap, { seeds: [[13, -35], [-13, -35], [27, 0], [-27, 0]] }); }
/** the side view's map in its (u = z forward, v = height) mm; inside the shell's side outline (the kit's), above the skirt,
   clear of the side buttons */
function b08_mapSide(uni) {
  const key = uni ? 'b08:uniSide' : 'b08:mapSide3';
  if (B08_SL.has(key)) return B08_SL.get(key);
  const V = msView('left'), cx = document.createElement('canvas').getContext('2d'), btn = MS_SIDE_BTN.map(b => msPath(b.map(([z, y]) => [-z, -y])));
  const ins = (u, v) => cx.isPointInPath(V.out, -u, -v);
  const inside = (u, v) => v > MS_SKIRT + 0.6 && ins(u, v) && ins(u + 1.2, v) && ins(u - 1.2, v) && ins(u, v + 1.2) && !btn.some(p => cx.isPointInPath(p, -u, -v) || cx.isPointInPath(p, -u, -v - 1.0) || cx.isPointInPath(p, -u, -v + 1.0));
  return b08_streams(key, { x0: -60, y0: 0, x1: 60, y1: 41, inside }, uni ? b08_fieldSideUni : b08_fieldSideMap, { seeds: [[4, 13.4], [24, 14], [-20, 16]] });
}
/** the side view's field: front-to-back ridges where the thumb and the ring finger pinch (across the lift), following the
   shell; toward the nose, the tail and the top they break into dashes, then dots, then smooth */
function b08_fieldSideMap(u, v) {
  const ang = 0.05 * Math.sin(u / 16) - 0.12 * smooth(clamp((v - 26) / 10)) * Math.sign(u - 6);
  const on = (1 - smooth(clamp((Math.abs(u - 2) - 30) / 16))) * (1 - smooth(clamp((v - 27) / 7)));
  return { ang, sep: 1.5, on, dot: smooth(clamp((0.85 - on) / 0.6)) };
}
/** the rival's side: the same zone, the ridges running up and down (the side-to-side lines wrapped down the wall) */
function b08_fieldSideUni(u, v) { const f = b08_fieldSideMap(u, v); return { ang: Math.PI / 2, sep: 1.5, on: f.on, dot: f.dot }; }
S({
  id: 'b08_gripmap', ch: 'surface', theme: 'night', title: 'A grip map for the hand', settle: 11, ideas: [60],
  replaces: ['srf_gripmap'],
  src: ['b08_zhang17', 'srf_derler', 'srf_doc'],
  answers: [
    ['"grip designs need massive optimizations to look cool"', 'The map is generated, not drawn: every ridge is a streamline of one direction field over the shell, evenly spaced, so the pattern flows over the buttons and wraps the shoulders like one designed surface'],
    ['"and blend between there different textures better"', 'No borders between textures: the ridges turn continuously from side to side (the buttons) to front to back (the sides), and where a zone ends they break into dashes, then dots, then smooth; a strip beside the map shows the blend on its own'],
    ['F2.14 "grip in exactly the right places in exactly the right directions"', 'Each zone is etched across the slip it must stop: the pull on the buttons, the lift on the sides, smooth under the palm; each named on the map'],
    ['F21.9 (he wants to see the map before deciding it)', 'Labelled as the proposed map, to be tuned on hands; the question is in the report'],
    ['(why texture at all: a sweaty hand)', 'A plain stat under the side view, from Derler 2012 (skin on glass, wet): smooth 0.61, rough 1.43 grip per newton of squeeze; sweat floats skin on smooth, and roughness keeps it gripping'],
    ['(problem first, G1)', 'The problem is the naive etch, the button\'s ridges run one way over the whole grip: down the sides they run up and down, and at the same 0.30 N squeeze the lift slips; the laser turns them across the lift and the same squeeze holds. One-way ridges are Theseus\'s own simpler etch, so the payoff is two plain stats, nothing struck (R3-b08-1): least squeeze to lift 0.33 against 0.29 N a side (0.327 and 0.285 to two decimals, the map\'s rounded up), 12 % less (derived from Zhang 2017)']
  ],
  draw: t => {
    header(t, 'A grip map for the hand');
    captions(t, [[0.5, 'Etch the button\'s ridges one way over the whole grip, and down the sides they run up and down: a lift slides along them.'],
      [3.0, 'A laser turns each zone\'s ridges across its job: across the pull on the buttons, across the lift on the sides, smooth under the palm.']]);
    const M0 = B08M, box = M0.box, LF = B08.lift, pxN = 250;
    /* the camera: it opens where the last slide ended (pushed in on the left button's ridges, b08_grip's establish shot in its
       1080 px box) and pulls back until the whole top view sits at M0.top */
    const gBox = [LM, 272, 1080, 688], A = camFit(B08G.focus, gBox, 0.06), sT = M0.top.s, ox = box[0] + box[2] / 2, oy = box[1] + box[3] / 2;
    const A2 = { cx: A.cx + (ox - (gBox[0] + gBox[2] / 2)) / A.s, cy: A.cy + (oy - (gBox[1] + gBox[3] / 2)) / A.s, s: A.s };
    const Bc = { cx: (ox - M0.top.x) / sT, cy: (oy - M0.top.y) / sT, s: sT };
    const c = cam(t, [[M0.pull[0] + 0.15, A2.cx, A2.cy, A2.s], [M0.pull[1], Bc.cx, Bc.cy, Bc.s]]);
    const kz = 1 - c.k;                                               /* 1 while pushed in */
    const PT = (mx, my) => [ox + (mx - c.cx) * c.s, oy + (my - c.cy) * c.s];
    /* the laser: a line sweeping left to right over the map area; the map replaces the one-way ridges behind it */
    const kl = ep(t, M0.laser[0], M0.laser[0] + M0.laser[1], E.lin), lx = lerp(box[0] - 10, box[0] + box[2] + 10, kl), lasering = kl > 0 && kl < 1;
    const reveal = px => t >= M0.laser[0] + M0.laser[1] ? 1 : clamp((lx - px) / 60);
    /* the side view lifts with the hand: the one-way lift slips back, the mapped lift holds */
    const liftAt = (t0, holds) => { const up = ep(t, t0, t0 + 0.45, E.io3), down = ep(t, t0 + 0.95, t0 + 1.35, E.io3), hand2 = 10 * (up - down);
      const slip = holds ? 0 : 10 * up * E.in3(clamp((t - t0 - 0.15) / 0.5)) * (1 - down); return { hand: hand2, mouse: Math.max(0, hand2 - slip) }; };
    const L0 = liftAt(M0.lift0, false), L1 = liftAt(M0.lift1, true), lift = t < M0.lift1 - 0.2 ? L0 : L1;   /* mm */
    /* the top view, in the camera; the one-way ridges spread from the button over the whole grip as the camera pulls back,
       and the laser writes the map over them */
    withCam(c, box, () => mouseSimple('top', { lw: 2, fill: C.panel }));
    const MT0 = [c.s * MS_K.x, 0, 0, c.s * MS_K.y, PT(0, 0)[0], PT(0, 0)[1]], wT = lerp(1.6, 2.8, kz);
    clipped(box[0], box[1], box[2], box[3], () => {
      const tp = B08G.tape, inPatch = (x, y) => x * MS_K.x > tp[0] && x * MS_K.x < tp[0] + tp[2] && y * MS_K.y > tp[1] && y * MS_K.y < tp[1] + tp[3], grow = ep(t, 0.55, 1.35);
      b08_drawStreams(b08_uniTop(), MT0, { w: wT, col: C.mute, reveal: (x, y) => (inPatch(x, y) ? 1 : grow) * (1 - reveal(PT(x * MS_K.x, y * MS_K.y)[0])) });
      b08_drawStreams(b08_mapTop(), MT0, { w: wT, reveal: (x, y) => reveal(PT(x * MS_K.x, y * MS_K.y)[0]) });
    });
    /* the ridges macro exactly as the last slide framed it, dissolving as the camera pulls back */
    if (kz > 0.01) {
      const rf = srf_field('b08g:ridge', 900, 574, f => srf_genFilm(f, { pat: 'ridge', pitch: 24, width: 13, depth: 4.4, ang: 0, seed: 5, col: [40, 41, 46], ecol: [96, 98, 106] }));
      const tp = B08G.tape, p0 = PT(tp[0], tp[1]), p1 = PT(tp[0] + tp[2], tp[1] + tp[3]);
      G.save(); rrPath(p0[0], p0[1], p1[0] - p0[0], p1[1] - p0[1], 3.2 * c.s); G.clip(); G.beginPath(); G.rect(gBox[0], gBox[1], gBox[2], gBox[3]); G.clip();
      srf_macro(t, rf, gBox[0], gBox[1], gBox[2], gBox[3], { light: { az: 2.35, el: 0.5 }, alpha: smooth(clamp((kz - 0.3) / 0.7)), vignette: true, r: 0 });
      G.restore();
    }
    /* the side view: the thumb's side, the hand lifting it */
    const ks = ep(t, 0.9, 1.5), S0 = M0.side, sS = S0.s, by = S0.y - lift.mouse * sS;
    if (ks > 0.003) {
      part(S0.x, by, sS, () => mouseSimple('left', { lw: 2, fill: C.panel }), { alpha: ks });
      const MSd = [-sS, 0, 0, -sS, S0.x, by];
      b08_drawStreams(b08_mapSide(true), MSd, { w: 1.7, col: C.mute, alpha: ks, reveal: (u, v) => 1 - reveal(S0.x - u * sS) });
      b08_drawStreams(b08_mapSide(), MSd, { w: 1.7, alpha: ks, reveal: (u, v) => reveal(S0.x - u * sS) });
      /* the thumb's contact on the side; the hand rises 10 mm; along the one-way ridges the mouse comes part way, then slips */
      const th = [S0.x - 4 * sS, S0.y - 13.4 * sS - lift.hand * sS], rT = 4.6 * sS;
      const slipping = t > M0.lift0 + 0.2 && t < M0.lift0 + 1.0;
      b08_print(th[0], th[1], rT, { a: ks * 0.95, rot: 0, slide: slipping ? clamp((t - M0.lift0 - 0.2) / 0.3) : 0, dir: -Math.PI / 2 });
      if (t > 1.4) callout(t, 1.4, th, 'The same 0.30 N squeeze', { to: [th[0] - 60, S0.y + 84], side: 'l', color: C.mute, tcolor: C.mute });
      const kL0 = env(t, M0.lift0 - 0.05, M0.lift0 + 0.15, M0.lift0 + 1.1, M0.lift0 + 1.35), kL1 = env(t, M0.lift1 - 0.05, M0.lift1 + 0.15, M0.lift1 + 1.1, M0.lift1 + 1.35);
      if (kL0 + kL1 > 0.003) {
        /* grip up at the thumb against the weight down: the longer arrow wins */
        const one = kL0 > kL1, kL = Math.max(kL0, kL1), g = one ? LF.gripOne : LF.gripMap, gc = one ? C.mute : C.heroText;
        arrow(th[0], th[1] - rT * 0.85, th[0], th[1] - rT * 0.85 - g * pxN, { color: one ? C.mute : C.hero, w: 4, hs: 16, alpha: kL });
        text(fmtN(g, 2) + ' N grip', th[0] + 16, th[1] - rT * 0.85 - g * pxN + 18, { role: 'label', size: 20, color: gc, alpha: kL });
        const wp = [S0.x + 22 * sS, by + 6], wl = LF.mg * pxN;
        arrow(wp[0], wp[1], wp[0], wp[1] + wl, { color: one ? C.red : C.mute, w: 3.5, hs: 14, alpha: kL });
        text(fmtN(LF.mg, 2) + ' N weight', wp[0] + 14, wp[1] + wl * 0.7, { role: 'label', size: 20, color: one ? C.red : C.mute, alpha: kL });
      }
      const r0 = env(t, M0.lift0 + 0.55, M0.lift0 + 0.7, M0.lift0 + 1.6, M0.lift0 + 1.9);
      const tq = [th[0] - 80, S0.y - 242];
      if (r0 > 0.003) faultTag(t, M0.lift0 + 0.55, th, 'Slips: lift runs along the ridges', { to: tq, side: 'l', alpha: r0 });
      if (t > M0.lift1 + 0.5) fixTag(t, M0.lift1 + 0.5, th, 'Holds', { to: tq, side: 'l' });
    }
    /* the laser line */
    if (lasering) { line(lx, box[1] + 6, lx, box[1] + box[3] - 6, { color: C.hero, w: 2.5 }); G.save(); G.globalAlpha = 0.18; G.fillStyle = C.hero; G.fillRect(lx - 16, box[1] + 6, 16, box[3] - 12); G.restore(); }
    /* each zone's job, named on the map */
    if (t > 7.0) {
      const q1 = PT(-13 * MS_K.x, -40 * MS_K.y), q2 = PT(0, 34 * MS_K.y), q4 = [S0.x + 30 * sS, S0.y - 18 * sS];
      fixTag(t, 7.0, q1, 'Pull: ridges across', { to: [q1[0] + 230, q1[1] - 44], side: 'r' });
      callout(t, 7.15, q2, 'Palm: smooth', { to: [q2[0] + 200, q2[1] + 56], side: 'r', color: C.mute, tcolor: C.mute });
      fixTag(t, 7.3, q4, 'Lift: ridges across', { to: [q4[0] - 10, S0.y - 288], side: 'l' });
    }
    /* why texture at all: a sweaty hand on smooth against rough (a plain stat, nothing struck) */
    { const a = ep(t, 8.9, 9.3), x0 = 700, y0 = 846, sc = 230;
      if (a > 0.003) {
        text('When the hand sweats: skin on wet glass, grip per newton', x0, y0, { role: 'label', size: 19, color: C.mute, alpha: a });
        [['Smooth', 0.61, C.comp, C.ink2], ['Rough', 1.43, C.hero, C.heroText]].forEach(([nm, v, col, tcol], i) => {
          const yy = y0 + 34 + i * 34; text(nm, x0, yy, { role: 'small', size: 21, weight: 700, color: tcol, alpha: a });
          G.save(); G.globalAlpha = a; G.fillStyle = col; G.fillRect(x0 + 100, yy - 15, v * sc * ep(t, 9.0 + i * 0.15, 9.5 + i * 0.15, E.out3), 16); G.restore();
          text(fmtN(v, 2), x0 + 112 + v * sc, yy, { role: 'small', size: 21, weight: 750, color: tcol, alpha: a * ep(t, 9.4 + i * 0.15, 9.6 + i * 0.15) });
        });
        pill(x0 + 330, y0 + 34, 'study', a, { by: 'Derler 2012' });
      } }
    text('Proposed map, to be tuned on hands. Ridges drawn far coarser than life.', box[0], box[1] + box[3] + 2, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 8.2, 8.6) });
    /* the right column: one pattern with no borders (it blends), then the payoff */
    const rx = 1320, kb = ep(t, 3.6, 4.1);
    if (kb > 0.003) {
      text('One pattern, no borders', rx, 330, { role: 'label', size: 21, color: C.mute, alpha: kb });
      const sx = rx, sy = 356, sw = RM - rx, sh = 96, U = 46, Vh = 8.5, sc0 = sw / U;
      demoWindow(sx, sy, sw, sh, kb, { fill: C.panel });
      const LB = b08_streams('b08:blend2', { x0: 0, y0: 0, x1: U, y1: Vh, inside: (u, v) => u > 0.6 && u < U - 0.6 && v > 0.7 && v < Vh - 0.7 },
        (u, v) => ({ ang: 0, sep: 1.2, on: 1 - smooth(clamp((u - 35) / 8)), dot: smooth(clamp((u - 7) / 22)) }), { seeds: [[3, 4.25]] });
      clipped(sx, sy, sw * clamp((t - 3.6) / 1.2), sh, () => b08_drawStreams(LB, [sc0, 0, 0, sc0, sx, sy], { w: 1.8, alpha: kb }));
      [['Ridges', 0.08], ['Dashes', 0.38], ['Dots', 0.62], ['Smooth', 0.9]].forEach(([nm, f], i) => text(nm, sx + sw * f, sy + sh + 30, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: stagger(t, 4.0, i, 0.15, 0.4) }));
    }
    /* two plain stats, not a struck verdict (R3-b08-1; the film's grammar, common.md 11:20): ridges one way are Theseus's own
       simpler etch, so nothing is struck. Two decimals (R3's could: a modelled figure reads better so): the map rounded up
       (lower is better, so against it), the one-way ridges to the nearest unless that would show a wider gap than the true
       one (0.33 and 0.29 N: a 0.04 N gap shown against 0.042 true; the old 0.33 → 0.28 widened it); the net from the true
       values, rounded toward zero (12.8 % → 12 %) */
    const mapS = Math.ceil(LF.map * 100 - 1e-9) / 100, oneN = Math.round(LF.one * 100) / 100, oneS = oneN - mapS > LF.one - LF.map + 1e-9 ? Math.floor(LF.one * 100 + 1e-9) / 100 : oneN;
    { const a1 = ep(t, 6.6, 7.0), a2 = ep(t, 7.1, 7.6), dy = k => (1 - E.out3(k)) * 14, less = Math.floor((1 - LF.map / LF.one) * 100 + 1e-9);
      text('Least squeeze to lift, per side (lower is better)', rx, 616, { role: 'label', size: 21, color: C.mute, alpha: a1, maxW: RM - rx });
      G.save(); G.translate(0, dy(a1));
      rich([{ s: fmtN(oneS, 2), role: 'd1', size: 60, weight: 800, color: C.ink2, tnum: true }, { s: 'N', font: 'sans', size: 24, weight: 650, color: C.mute, gap: 8 }], rx, 692, { alpha: a1 });
      text('Ridges one way', rx + 220, 684, { role: 'small', size: 23, weight: 700, color: C.ink2, alpha: a1 });
      G.restore();
      G.save(); G.translate(0, dy(a2));
      const wM = rich([{ s: fmtN(mapS, 2), role: 'd1', size: 88, weight: 800, color: C.heroText, grad: C.heroGrad, tnum: true }, { s: 'N', font: 'sans', size: 30, weight: 650, color: C.mute, gap: 10 }], rx, 806, { alpha: a2 }).w || 270;
      text('The map', rx + wM + 22, 772, { role: 'small', size: 23, weight: 700, color: C.heroText, alpha: a2 });
      text(less + ' % less squeeze', rx + wM + 22, 804, { role: 'small', size: 23, weight: 700, color: C.heroText, alpha: a2 });
      G.restore(); }
    scaleNote(rx, 880, "about half an egg's weight", { lead: '0.3 N', t, t0: 8.3 });
    { const a = ep(t, 8.5, 8.9), w0 = pillW('study', { by: 'Zhang 2017' }); pill(rx, 926, 'study', a, { by: 'Zhang 2017' }); pill(rx + w0 + 20, 926, 'derived', a); text('Laser grooves in steel, one fingertip, 0.2 to 0.4 N: grip 0.50 to 0.51 of the squeeze across the ridges, 0.41 to 0.47 along', rx, 962, { role: 'small', size: 22, weight: 600, color: C.faint, alpha: a, maxW: RM - rx }); }
  }
});

/* ---------- b08_coating: the bake ----------
   Brock's note on the old slide (5/10): "lazy visualizations, show flames and more realistic pots". His analogy (idea 16):
   PMM's "air dry ceramic coating" is the pot that never went in the kiln. The classroom version (The Pottery Wheel): two
   identical wheel-thrown pots; one fired in a cut-away updraft kiln (flames in the firebox under the perforated floor, the
   chamber glowing, the ware glowing orange at cone 06, 995 °C), then rain on both: the dried pot slakes back to mud, the
   fired one sheds it. The real version, on Cerakote's own sheets and the ISO 15184 pencil test: the same 4H pencil under
   750 g pushed across an air-cured coat (C-299: 3H, cured 5 days) gouges it; across the baked coat (F-110: 9H, 82 °C for an
   hour) it leaves no mark. Verdict 3H → 9H "on Cerakote's tests" (F21.10), gouge against gouge, both on blasted steel. */
const B08C = {
  panel: [LM, 272, 900, 664], ground: 754,
  potA: { x: 270, H: 240 }, kiln: { x: 492, w: 440, h: 500 },
  fire: [0.25, 0.9, 2.6, 3.1], heat: [0.6, 2.2, 2.8, 3.4], kilnOut: [3.0, 3.5],
  rain: [3.5, 3.8, 5.0, 5.4], slake: [3.8, 5.3],
  test: { x: 1040, y: 350, w: 380, h: 250, gap: 40, stroke: [5.6, 6.8] },
  verdict: 7.1
};
/** rain over a box: short slanted streaks falling at a steady speed (positions a pure function of t), k its strength */
function b08_rain(t, x, y, w, h, k, o = {}) {
  if (k <= 0.003) return;
  const r = rng(o.seed || 71), n = o.n || 90, slant = 0.18;
  G.save(); G.beginPath(); G.rect(x, y, w, h); G.clip(); G.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const x0 = x + r() * (w + h * slant), ph = r(), spd = 1.25 + r() * 0.5, L = 14 + r() * 14, al = 0.35 + r() * 0.4;
    const f = (ph + t * spd) % 1, yy = y + f * (h + L) - L, xx = x0 - (yy - y) * slant;
    G.globalAlpha = k * al; G.strokeStyle = C.mute; G.lineWidth = 1.6;
    G.beginPath(); G.moveTo(xx, yy); G.lineTo(xx - L * slant, yy + L); G.stroke();
  }
  G.restore();
}
S({
  id: 'b08_coating', ch: 'surface', theme: 'paper', title: 'A baked ceramic coat', settle: 11.5, ideas: [16], before: 'b08_grip',
  replaces: ['coating'],
  src: ['b08_clay', 'b08_doc16', 'b08_c299', 'srf_f110', 'b08_iso15184', 'srf_soft', 'srf_fManual', 'srf_ppc20'],
  answers: [
    ['"lazy visualizations"', 'Two demonstrations with cause and effect: a kiln fires one of two identical pots and rain takes the air-dried one back to mud; then the same 4H pencil under 750 g gouges an air-cured coat and leaves no mark on the baked one'],
    ['"show flames"', 'A cut-away updraft kiln: flames in the firebox under the floor lick up through its holes, the chamber glows, the pot glows orange as a readout counts to 995 °C, then the fire dies and it cools'],
    ['"and more realistic pots"', 'Wheel-thrown amphorae drawn from a real profile: foot, belly, shoulder, neck, flared lip, handles, throwing rings and a meander band; the dried pot pale and matte, the fired one dark with a gloss'],
    ['F21.10 ("9H on Cerakote\'s tests")', 'The payoff says exactly that: 9H "on Cerakote\'s tests", gouge rating, as a plain stat beside the air-cured coat\'s 3H and soft-touch\'s 7B to H. Nothing is struck: the two cures are both Cerakote\'s, so they are not a rival against Theseus (FILM F8/F15)'],
    ['Idea 16, "a dried clay pot is weaker than a pot put in a kiln"', 'His analogy is the classroom version, with its source: unfired greenware slakes in water, bisque ware does not']
  ],
  draw: t => {
    header(t, 'A baked ceramic coat');
    captions(t, [[0.4, 'A pot dried in air is still clay, and rain turns it back to mud. Fired in a kiln, it turns to ceramic and the rain runs off.'],
      [5.2, 'Coats work the same way. PMM\'s ceramic coat is air-dried; the pencil that gouges an air-cured coat leaves no mark on a baked one.']]);
    const K0 = B08C, gy = K0.ground;
    /* the classroom version: two identical pots, one in a kiln dug into the ground */
    const ir = demoPanel(t, 0, K0.panel, { src: 'The Pottery Wheel' });
    const fire = env(t, K0.fire[0], K0.fire[1], K0.fire[2], K0.fire[3]), heat = env(t, K0.heat[0], K0.heat[1], K0.heat[2], K0.heat[3]);
    const Tpk = 20 + 975 * ep(t, K0.heat[0], K0.heat[1]), T = 20 + 975 * heat, fired = clamp((Tpk - 500) / 495), glow = clamp((T - 560) / 435);
    const ka = 1 - ep(t, K0.kilnOut[0], K0.kilnOut[1]);
    clipped(ir[0], ir[1], ir[2], ir[3], () => {
      /* the ground and the earth under it, cut away */
      G.save(); G.beginPath(); G.rect(ir[0], gy, ir[2], ir[1] + ir[3] - gy); G.clip(); G.strokeStyle = C.hair; G.lineWidth = 1.2; G.beginPath();
      for (let xx = ir[0] - 200; xx < ir[0] + ir[2]; xx += 14) { G.moveTo(xx, ir[1] + ir[3]); G.lineTo(xx + 200, ir[1] + ir[3] - 200); } G.stroke(); G.restore();
      line(ir[0], gy, ir[0] + ir[2], gy, { color: C.mute, w: 1.6 });
      const Kn = K0.kiln, Kh = Kn.h, kgy = gy + 0.275 * Kh;
      const KK = b08_kiln(Kn.x, kgy - Kh, Kn.w, Kh, { a: ka, heat, fire, t });
      /* the rain, behind the pots */
      const kr = env(t, K0.rain[0], K0.rain[1], K0.rain[2], K0.rain[3]);
      b08_rain(t, ir[0], ir[1], ir[2], gy - ir[1], kr * 0.7, { seed: 71 });
      const sl = ep(t, K0.slake[0], K0.slake[1], E.io3);
      b08_amphora(K0.potA.x, gy, K0.potA.H, { fired: 0, slake: sl, t });
      b08_amphora(KK.cx, KK.floorY, K0.potA.H, { fired, heat: heat * ka, glow: glow * ka, wet: kr > 0 ? 1 : 0, wetT: clamp((t - K0.rain[0]) / 1.3), t });
      b08_rain(t, ir[0], ir[1], ir[2], gy - ir[1], kr * 0.45, { seed: 72, n: 40 });
      /* the kiln's thermometer: it reads what the fire does */
      if (ka > 0.01 && T > 25) text(Math.round(T) + ' °C', Kn.x + Kn.w - 6, kgy - Kh + 40, { role: 'label', size: 22, color: T > 900 ? C.heat : C.mute, align: 'right', alpha: ka * ep(t, 0.6, 0.9), caps: false });
      /* the pots' names on the ground under them; the fired pot's once its kiln has gone */
      text('Dried in air', K0.potA.x, gy + 34, { role: 'label', size: 20, color: C.secondText, align: 'center', alpha: ep(t, 0.2, 0.6) });
      text('Fired in a kiln', KK.cx, gy + 34, { role: 'label', size: 20, color: C.heroText, align: 'center', alpha: ep(t, 3.3, 3.7) });
      if (t > 4.9) faultTag(t, 4.9, [K0.potA.x + 24, gy - 28], 'Back to mud', { to: [K0.potA.x + 100, gy - 200], side: 'r' });
      if (t > 5.2) fixTag(t, 5.2, [KK.cx - 50, gy - 150], 'Rain runs off', { to: [KK.cx - 120, gy - 270], side: 'l' });
    });
    /* the real version: Cerakote's test, the same pencil and load on both coats */
    /* the two coats are on screen from the start; the pencil comes at 5 s */
    const TS = K0.test, kp = ep(t, 5.0, 5.4), ks = ep(t, TS.stroke[0], TS.stroke[1], E.io3);
    text("Cerakote's test: the same 4H pencil, 750 g on its tip", TS.x, 304, { role: 'label', size: 21, color: C.mute, alpha: kp });
    [[false, 'Air-cured, 5 days', C.secondText], [true, 'Baked, 82 °C for an hour', C.heroText]].forEach(([hard, nm, col], i) => {
      const px = TS.x + i * (TS.w + TS.gap), mm = 26, x0 = 0.38, sy = 0.76;
      text(nm, px, 340, { role: 'label', size: 20, color: col });
      b08_pencilTest(px, TS.y, TS.w, TS.h, { a: 1, k: ks, hard, coat: C.ink2, mm, x0, sy, len: 205, bw: 118, bh: 56, wheels: false, pa: kp });
      const gx = px + TS.w * x0 + 3.5 * mm, gyy = TS.y + TS.h * sy;
      if (!hard && t > 6.9) faultTag(t, 6.9, [gx, gyy], 'Gouged', { to: [gx + 40, TS.y + TS.h + 34], side: 'r' });
      if (hard && t > 7.0) fixTag(t, 7.0, [gx, gyy], 'No mark', { to: [gx + 40, TS.y + TS.h + 34], side: 'r' });
    });
    scaleNote(TS.x, 688, "about a full water bottle's weight, on a pencil's tip", { lead: '750 g', t, t0: 6.0 });
    text("Baked at 82 °C: the shell's plastic holds its shape to 155 °C", TS.x, 726, { role: 'small', size: 21, weight: 600, color: C.faint, alpha: ep(t, 8.6, 9.0), maxW: RM - TS.x });
    /* the result as a plain stat (FILM F8/F15): the baked coat's grade big, the air-cured coat's and soft-touch's beside it, nothing struck */
    { const k = ep(t, K0.verdict, K0.verdict + 0.5), x0 = TS.x, y0 = 890, kb = ep(t, K0.verdict + 0.3, K0.verdict + 0.9);
      text('Pencil hardness (harder is better)', x0, y0 - 132, { role: 'label', size: 22, color: C.mute, alpha: k });
      rich([{ s: '9H', role: 'd1', size: 130, weight: 800, track: -0.03, color: C.heroText, grad: C.heroGrad, tnum: true }], x0, y0, { alpha: kb });
      text("Baked F-Series, on Cerakote's tests", x0, y0 + 40, { role: 'label', size: 19, color: C.heroText, alpha: kb });
      [['3H', "Air-cured C-Series, Cerakote's tests", C.secondText], ['7B to H', "Soft-touch, RadTech's test films", C.mute]].forEach(([g, nm, col], i) => {
        const yy = y0 - 62 + i * 62, a = ep(t, K0.verdict + 0.2 + i * 0.15, K0.verdict + 0.6 + i * 0.15);
        text(g, x0 + 250, yy, { role: 'small', size: 34, weight: 800, color: C.ink2, alpha: a });
        text(nm, x0 + 400, yy - 2, { role: 'small', size: 20, weight: 600, color: col, alpha: a, maxW: RM - x0 - 400 });
      }); }
  }
});

/* ---------- b08_film: a fifth of a sheet of paper ----------
   Replaces srf_texture (6/10: "needs to show previous height before sanding and coat, i like the comparisons to soft
   touch") and srf_weight (4/10: "can be combined with previous slide, cerakote film numbers before sand blasting look way
   too heavy, 0.49g is a lot, especially with how much thinner cerakote is to soft touch"). F2.13 (the fibres, to scale),
   F2.22 (his claim: the blast takes off almost as much as the coat adds), F21.10 (the net weight stays unnumbered).
   One section to scale (s px per µm), the moulded height dashed across both halves. The rival first: soft-touch sprayed over
   the smooth moulded shell, 51 µm (RadTech 2016's test film) standing above the line. Then Theseus's shell: the blast takes
   a skin off (its depth drawn, not measured) and the 19 µm F-Series film fills the roughness and levels back to about the
   moulded height. Weights on the shell's 133 cm² (derived, B08.film): the film 0.37 to 0.43 g before the blast takes its share
   (the old 0.49 g read Cerakote's 1 mil coverage as 0.75 mil), soft-touch at least 0.68 g. */
const B08F = {
  s: 4.5, y: 336, h: 580, top: 0.44,
  L: [LM, 760], R: [880, 320],                  /* the two halves: x, w (px) */
  soft: [0.8, 2.6], blast: [3.0, 4.5], coat: [4.7, 6.2], verdict: 6.6
};
S({
  id: 'b08_film', ch: 'surface', theme: 'night', title: 'A fifth of a sheet of paper', settle: 11, ideas: [16], before: 'b08_grip',
  replaces: ['srf_texture', 'srf_weight'],
  src: ['srf_fManual', 'srf_f110', 'b08_coverage', 'srf_soft', 'b08_covestro', 'srf_hoft22', 'srf_yama24', 'srf_ppc20', 'srf_scan', 'b08_doc16'],
  answers: [
    ['"needs to show previous height before sanding and coat"', 'The moulded height is a dashed line across the whole section from the first frame; the blast takes the surface below it, and the coat brings it back to about that line'],
    ['"i like the comparisons to soft touch"', 'Kept and made the rival: soft-touch sprayed over the same moulded shell on the same scale, 51 µm standing above the line, against 19 µm that ends about on it; thickness and weight both compared'],
    ['"can be combined with previous slide"', 'Combined: one slide for the section (srf_texture) and the weight (srf_weight)'],
    ['"cerakote film numbers before sand blasting look way too heavy, 0.49g is a lot"', 'Checked and corrected: the old figure read Cerakote\'s coverage (given per gallon at 1.0 mil) as a 0.75 mil figure. With the solvent found (PCBTF), the 0.75 mil standard film weighs 0.37 to 0.43 g over the shell\'s 133 cm², before the blast takes its share (derived; a weighed shell would settle it, question in the report)'],
    ['"especially with how much thinner cerakote is to soft touch"', 'Shown both ways against RadTech\'s soft-touch test film: 19 µm against 51 µm (−62 %), and 0.37 to 0.43 g against at least 0.68 g on the same shell; the ceramic film is denser, so it weighs about 60 %, not 37 %. Said too: soft-touch can be sprayed as thin as 2 to 3 µm (Covestro 2021), and no mouse\'s film is published'],
    ['F2.22 / F21.10 (the blast takes off almost what the coat adds; the net unnumbered)', 'The blast\'s skin is drawn hatched, "blasted off", against the film that replaces it; the net is said in words only ("the blast takes its share"), no number']
  ],
  draw: t => {
    header(t, 'A fifth of a sheet of paper');
    captions(t, [[0.5, 'Soft-touch is sprayed over the moulded shell: RadTech\'s test film is 51 µm thick, standing above it.'],
      [3.0, 'Cerakote starts with a blast that takes a skin off. Its 19 µm coat fills that back to about the height the shell was moulded at.']]);
    const F0 = B08F, sc = F0.s, ys = F0.y + F0.top * F0.h;
    const kSoft = 1, kb = ep(t, F0.blast[0], F0.blast[1], E.io3), kc = ep(t, F0.coat[0], F0.coat[1], E.io3);   /* soft-touch is on from frame one */
    /* Theseus's half: the blast, then the coat */
    const BL = [F0.L[0], F0.y, F0.L[1], F0.h], BR = [F0.R[0], F0.y, F0.R[1], F0.h];
    const sec = b08_section(BL, { s: sc, top: F0.top, blast: kb, coat: kc, seed: 11 });
    const soft = b08_softSection(BR, { s: sc, top: F0.top, k: kSoft, seed: 13 });
    /* grit, then spray: what moves the surface, seen arriving */
    const particles = (B, t0, t1, n, seed, fn) => { if (t < t0 || t > t1 + 0.4) return; const r = rng(seed);
      clipped(B[0], B[1], B[2], B[3], () => { for (let i = 0; i < n; i++) { const x0 = B[0] + r() * B[2], ph = r(), tt = t0 + ph * (t1 - t0); const f = (t - tt) / 0.35; if (f < 0 || f > 1) continue; fn(x0, B[1] + f * (ys - B[1] + 20), f, r); } }); };
    particles(BL, F0.blast[0], F0.blast[1], 120, 5, (x, y, f, r) => { G.save(); G.translate(x, y); G.rotate(r() * 3); G.fillStyle = rgba(C.ink, 0.75 * (1 - f * 0.5)); G.fillRect(-3, -2, 6, 4.5); G.restore(); });
    particles(BL, F0.coat[0], F0.coat[1], 140, 6, (x, y, f, r) => circle(x, y, 2.6, { fill: rgba(C.ink, 0.55 * (1 - f * 0.4)) }));
    /* the moulded height, across both halves, from the first frame */
    line(F0.L[0], ys, F0.R[0] + F0.R[1], ys, { color: C.ink, w: 1.8, dash: [10, 7] });
    text('As moulded', F0.L[0] + 12, ys - 12, Object.assign({ role: 'label', size: 20, color: C.ink }, { glow: 'rgba(0,0,0,0.9)', glowR: 10 }));
    /* names over each half */
    text('Soft-touch, a test film', F0.R[0], F0.y - 14, { role: 'label', size: 20, color: C.secondText });
    text('Theseus: blast, then coat', F0.L[0], F0.y - 14, { role: 'label', size: 20, color: C.heroText });
    /* dimensions, each as its layer arrives */
    const dim = (x, y0, y1, label, col, a, side = 1) => { if (a <= 0.003) return; line(x, y0, x, y1, { color: col, w: 2, alpha: a }); line(x - 8, y0, x + 8, y0, { color: col, w: 2, alpha: a }); line(x - 8, y1, x + 8, y1, { color: col, w: 2, alpha: a });
      text(label, x + side * 14, (y0 + y1) / 2 + 8, Object.assign({ role: 'label', size: 22, color: col, align: side > 0 ? 'left' : 'right', alpha: a }, { glow: 'rgba(0,0,0,0.9)', glowR: 10 })); };
    dim(F0.R[0] + F0.R[1] - 46, ys, soft.top, '51 µm', C.secondText, ep(t, 0.3, 0.6), -1);
    { const xb = F0.L[0] + F0.L[1] * 0.08, yb = sec.mean; if (kb > 0.02) { dim(xb, ys, yb, 'Blasted off: about 13 µm (drawn)', C.mute, ep(t, F0.blast[0] + 0.3, F0.blast[0] + 0.6)); } }
    { const xf = F0.L[0] + F0.L[1] * 0.86, y0 = sec.mean, y1 = sec.mean - 19 * sc * kc; if (kc > 0.02) dim(xf, y0, y1, Math.round(19 * kc) + ' µm', C.heroText, ep(t, F0.coat[0] + 0.2, F0.coat[0] + 0.5)); }
    /* a fibre named once: 7 µm across, along the flow */
    text('Carbon fibres, 7 µm across', F0.L[0] + 12, F0.y + F0.h - 18, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 0.3, 0.7) });
    /* the right column: the headline, then the weight on the whole shell */
    const rx = 1260;
    verdict(t, F0.verdict, rx, 560, { from: 51, to: 19, unit: 'µm', dec: 0, label: "Coat thickness: RadTech's soft-touch test film, Cerakote's standard film", better: 'lower', who: ['Soft-touch', 'Cerakote'], size: 120, maxW: RM - rx });
    scaleNote(rx, 712, 'about a fifth of a sheet of copy paper', { lead: '19 µm', t, t0: 7.6 });
    const kw = ep(t, 8.0, 8.4);
    if (kw > 0.003) {
      text("On the shell's 133 cm²", rx, 786, { role: 'label', size: 20, color: C.mute, alpha: kw });
      text('Soft-touch, 51 µm', rx, 828, { role: 'small', size: 25, weight: 700, color: C.secondText, alpha: kw });
      text('0.68 g or more', RM, 828, { role: 'small', size: 25, weight: 750, color: C.ink, align: 'right', alpha: kw });
      text('Cerakote, 19 µm', rx, 868, { role: 'small', size: 25, weight: 700, color: C.heroText, alpha: kw });
      text(fmtN(B08.film.g, 2) + ' to ' + fmtN(B08.film.gHi, 2) + ' g', RM, 868, { role: 'small', size: 25, weight: 750, color: C.heroText, align: 'right', alpha: kw });
      text('before the blast takes its share', RM, 900, { role: 'small', size: 20, weight: 600, color: C.mute, align: 'right', alpha: kw });
      line(rx, 800, RM, 800, { color: C.hair, w: 1.2, alpha: kw });
      const a2 = ep(t, 8.5, 8.9); pill(rx, 936, 'derived', a2); text("Cerakote's sheets; RadTech's test film", rx + pillW('derived') + 16, 936, { role: 'small', size: 19, weight: 600, color: C.faint, alpha: a2, maxW: RM - rx - pillW('derived') - 16 });
      text('Soft-touch can be sprayed as thin as 2 to 3 µm (Covestro 2021); no mouse\'s film is published', rx, 972, { role: 'small', size: 19, weight: 600, color: C.faint, alpha: a2, maxW: RM - rx });
    }
  }
});

/* ---------- b08_uv: no yellowing ----------
   Replaces srf_uv (7/10, rated, no note). F2.23: "with most coatings it's very hard to tell if they will yellow over time,
   but cerakote is by far one of the safest because of its industry leading chemical and uv resistance (like how the ulx
   pros yellowed)". Two halves, the rival first. Left: a white mouse under two fingertips as the months pass: the coat
   yellows most where the fingers rest (drawn from ULX Pro owners' reports: no rate implied, and owners blame sweat,
   lotions and the grippier coat as much as light); the maker published no UV or chemical test, so owners found out after
   buying. Right: Cerakote's published test: a white panel in a UV chamber (ASTM D4587), one strip masked as the
   reference, the hours counting to 1,000; the mask comes off: no visible change (Cerakote's photopolymer test, a C-Series
   coat on 3D-printed plastic). Verdict: UV test hours published, 0 → 1,000 h. Chemicals in a line: F-Series is rated
   "Excellent", a colour change under ΔE 2.5 (CIE76) after a day in each chemical. */
/* the beats overlap so the number lands by 8 s (R2-b08-3): the lamps come on as the fingers lift; then the chemicals (R2-b08-1) */
const B08U = { use: [0.8, 3.4], lift: [3.4, 3.9], tags: [3.9, 4.2], lamps: 3.4, hours: [3.6, 6.0], peel: [6.0, 6.6], verdict: 6.4, drops: [6.9, 7.4], day: [7.4, 8.2], wipe: [8.2, 8.8] };
/** a UV weathering chamber, cut open: its lamps, Cerakote's white panel on the rack with a masked strip, two clear-coated
   strips beside it (Huntsman 2024's two clear coats under the same kind of lamps: an aromatic epoxy yellows, a UV-stable
   polyurethane doesn't; R2-b08-2), an hours readout; then a drop each of sweat, sunscreen and skin oil on the panel, left a
   day and wiped (R2-b08-1: the owners blame those as much as light). (x, y, w, h); o = { on (0..1: the lamps), hours,
   peel (0..1: the mask comes off), drops (0..1: they land), day (0..1), wipe (0..1) }. Returns the panel's rect. */
function b08_quv(x, y, w, h, o = {}) {
  const on = clamp(o.on || 0), peel = clamp(o.peel || 0), hrs = o.hours || 0;
  /* the cabinet */
  rrPath(x, y, w, h, 14); G.fillStyle = TH ? '#D9D9DB' : '#2A2B2F'; G.fill(); G.strokeStyle = rgba(C.ink, 0.35); G.lineWidth = 1.5; G.stroke();
  const ix = x + 26, iy = y + 26, iw = w - 52, ih = h - 96;
  rrPath(ix, iy, iw, ih, 8); G.fillStyle = TH ? '#3A3B3F' : '#121316'; G.fill();
  /* the lamps: four long tubes across the top of the chamber, glowing when on */
  for (let i = 0; i < 3; i++) {
    const ly = iy + 20 + i * 22;
    if (on > 0.01) { G.save(); G.globalAlpha = on * 0.55; G.fillStyle = '#FFFFFF'; G.shadowColor = 'rgba(255,255,255,0.9)'; G.shadowBlur = 18; rrPath(ix + 30, ly - 5, iw - 60, 10, 5); G.fill(); G.restore(); }
    rrPath(ix + 30, ly - 5, iw - 60, 10, 5); G.fillStyle = mix(TH ? '#8E8E92' : '#5A5B60', '#FFFFFF', on); G.fill();
  }
  /* the light falling on the rack */
  if (on > 0.01) { const gl = G.createLinearGradient(0, iy, 0, iy + ih); gl.addColorStop(0, `rgba(255,255,255,${0.32 * on})`); gl.addColorStop(1, 'rgba(255,255,255,0)'); G.fillStyle = gl; G.fillRect(ix, iy, iw, ih); }
  /* Cerakote's panel: white coat, its left strip under foil until the test is done */
  const pw = 360, ph = 150, px = ix + 30, py = iy + 108;
  rrPath(px, py, pw, ph, 4); G.fillStyle = '#F7F7F8'; G.fill(); G.strokeStyle = 'rgba(0,0,0,0.25)'; G.lineWidth = 1.2; G.stroke();
  const mw = pw * 0.24;
  if (peel < 1) {
    const hh = ph * (1 - peel), cy0 = py;
    G.save(); G.beginPath(); G.rect(px, cy0, mw, hh); G.fillStyle = '#9A9A9E'; G.fill();
    G.clip(); G.strokeStyle = 'rgba(255,255,255,0.35)'; G.lineWidth = 1; G.beginPath(); for (let xx = px - ph; xx < px + mw; xx += 7) { G.moveTo(xx, cy0 + ph); G.lineTo(xx + ph, cy0); } G.stroke(); G.restore();
    if (peel > 0.01) { G.beginPath(); G.ellipse(px + mw / 2, cy0 + hh, mw / 2, 7, 0, 0, TAU); G.fillStyle = '#B4B4B8'; G.fill(); }
  }
  /* the chemicals: three drops on the exposed coat, a day, then a cloth wipes them off */
  const dr = clamp(o.drops || 0), dy = clamp(o.day || 0), wp = clamp(o.wipe || 0), ex0 = px + mw, ew = pw - mw;
  const drops = [[0.22, 'Sweat', 'rgba(205,220,236,0.9)'], [0.52, 'Sunscreen', 'rgba(252,252,248,1)'], [0.8, 'Skin oil', 'rgba(226,210,150,0.92)']];
  if (dr > 0.01 && wp < 1) {
    const wx = ex0 + ew * wp;
    drops.forEach(([u, nm, col], i) => {
      const k = clamp((dr - i * 0.18) / 0.5), dx = ex0 + ew * u, dcy = py + ph * 0.5; if (k <= 0 || dx < wx) return;
      G.save(); G.beginPath(); G.ellipse(dx, dcy, 17 * k, 11 * k, 0, 0, TAU); G.fillStyle = col; G.fill(); G.strokeStyle = 'rgba(0,0,0,0.3)'; G.lineWidth = 1.2; G.stroke();
      G.beginPath(); G.ellipse(dx - 5 * k, dcy - 4 * k, 5 * k, 2.6 * k, -0.4, 0, TAU); G.fillStyle = 'rgba(255,255,255,0.8)'; G.fill(); G.restore();
      text(nm, dx, i === 1 ? dcy - 24 : dcy + 38, { role: 'label', size: 19, color: 'rgba(17,17,17,0.75)', align: 'center', alpha: k });
    });
    if (dy > 0.01 && wp <= 0) text('A day', ex0 + ew / 2, py + ph - 14, { role: 'label', size: 19, color: 'rgba(17,17,17,0.7)', align: 'center', alpha: Math.min(dy * 4, 1) });
    if (wp > 0) { G.save(); rrPath(wx - 26, py - 10, 40, ph + 20, 8); G.fillStyle = '#B9B9BE'; G.fill(); G.strokeStyle = 'rgba(0,0,0,0.3)'; G.lineWidth = 1.2; G.stroke(); G.restore(); }
  }
  /* Huntsman's two clear coats, the same kind of lamps: the epoxy ambers with the hours (ΔE 16 by 500 h), the polyurethane holds */
  const sw = 56, sx1 = px + pw + 52, sx2 = sx1 + 170, amb = clamp(hrs / 500);
  rrPath(sx1, py, sw, ph, 4); G.fillStyle = mix('#F5F5F3', '#C9902F', 0.82 * amb); G.fill(); G.strokeStyle = 'rgba(0,0,0,0.25)'; G.lineWidth = 1.2; G.stroke();
  rrPath(sx2, py, sw, ph, 4); G.fillStyle = '#F6F6F7'; G.fill(); G.strokeStyle = 'rgba(0,0,0,0.25)'; G.lineWidth = 1.2; G.stroke();
  text('Clear coats, Huntsman 2024', sx1 - 6, py - 16, { role: 'label', size: 19, color: '#E6E6E9' });
  text('Epoxy', sx1 + sw / 2, py + ph + 26, { role: 'label', size: 19, color: '#E6E6E9', align: 'center' });
  text('Polyurethane', sx2 + sw / 2, py + ph + 26, { role: 'label', size: 19, color: '#E6E6E9', align: 'center' });
  if (hrs >= 500) { const ka = clamp((hrs - 500) / 120);
    text('ΔE 16 by 500 h', sx1 + sw / 2, py + ph + 52, { role: 'small', size: 19, weight: 700, color: '#E3B866', align: 'center', alpha: ka });
    text('ΔE 0.13', sx2 + sw / 2, py + ph + 52, { role: 'small', size: 19, weight: 700, color: '#E6E6E9', align: 'center', alpha: ka }); }
  /* the hours readout */
  const hr = Math.round(hrs);
  rrPath(x + w - 210, y + h - 58, 184, 40, 6); G.fillStyle = TH ? '#1E1F22' : '#0B0C0D'; G.fill();
  text(String(hr).padStart(4, '0') + ' h', x + w - 40, y + h - 30, { role: 'num', size: 26, weight: 750, color: on > 0.05 ? '#FFFFFF' : '#8A8A8E', align: 'right', tnum: true, caps: false });
  text('UV lamps, ASTM D4587', x + 26, y + h - 30, { role: 'label', size: 19, color: C.mute });
  return { px, py, pw, ph, mw };
}
S({
  id: 'b08_uv', ch: 'surface', theme: 'paper', title: 'No yellowing', settle: 11.5, ideas: [16], before: 'b08_grip',
  replaces: ['srf_uv'],
  src: ['b08_ulx', 'srf_rdUlx', 'b08_huntsman', 'srf_quv', 'srf_f110', 'srf_chem', 'b08_doc16'],
  answers: [
    ['(rated 7/10, no note): kept what worked', 'Still a UV chamber, the hours and what each maker publishes; now a demonstration: the panel in the chamber with a masked reference strip that comes off at 1,000 h'],
    ['F2.23 "with most coatings it\'s very hard to tell if they will yellow over time"', 'The rival first: a white mouse whose maker published no UV or chemical test, yellowing where the fingers rest as the months pass; its owners found out after buying'],
    ['F2.23 "(like how the ulx pros yellowed)"', 'The rival is the white ULX Pro Series, with its owners\' own words ("known to yellow very badly"; the Aceu "a huge problem"), drawn from reports, no rate implied'],
    ['F2.23 "cerakote is by far one of the safest because of its industry leading chemical and uv resistance"', 'Cerakote publishes both, and the chamber shows both: 1,000 h under UV lamps with no visible change, then a drop each of sweat, sunscreen and skin oil left a day and wiped: the F-Series is rated Excellent (a colour change under ΔE 2.5); beside it, two clear coats under the same kind of lamps (Huntsman 2024): the epoxy yellows (ΔE 16 at 500 h), the polyurethane holds (0.13): the chemistry decides. Verdict 0 → 1,000 h of published UV testing']
  ],
  draw: t => {
    header(t, 'No yellowing');
    captions(t, [[0.4, 'Finalmouse publishes no UV or chemical test for the ULX Pro\'s coat, so owners found out after buying: white ULX Pros yellowed where the fingers rest.'],
      [4.3, 'Cerakote publishes its tests: a white panel under UV lamps for 1,000 hours, one strip covered to compare. Nothing changed.'],
      [B08U.drops[0], 'Then a day under sweat, sunscreen and skin oil: Cerakote rates the F-Series Excellent, a colour change under ΔE 2.5.']]);
    const U0 = B08U;
    /* the left half: the rival in use */
    const lx = LM, cx0 = 330, cy0 = 640, sM = 4.4;
    text('ULX Pro Series, white', lx, 312, { role: 'label', size: 20, color: C.secondText });
    text('No published UV or chemical test', lx, 340, { role: 'label', size: 19, color: C.faint });
    const km = ep(t, U0.use[0], U0.use[1], E.lin), stain = E.io3(km);
    part(cx0, cy0, sM, () => {
      const V = msView('top');
      mouseSimple('top', { lw: 1.6, fill: '#FCFCFD' });
      /* the yellowing: a little over the whole coat, most under the fingertips (drawn from owners' reports, not measured) */
      G.save(); G.clip(V.out);
      G.fillStyle = `rgba(214,178,74,${0.16 * stain})`; G.fillRect(-40, -70, 80, 140);
      for (const [fx, fy, rr] of [[-14, -36, 13], [14, -36, 13], [-26, 8, 10]]) {
        const q = [fx * MS_K.x, fy * MS_K.y], g = G.createRadialGradient(q[0], q[1], 0, q[0], q[1], rr);
        g.addColorStop(0, `rgba(188,146,52,${0.62 * stain})`); g.addColorStop(0.6, `rgba(204,166,64,${0.34 * stain})`); g.addColorStop(1, 'rgba(214,178,74,0)');
        G.fillStyle = g; G.fillRect(q[0] - rr, q[1] - rr, rr * 2, rr * 2);
      }
      G.restore();
      mouseSimple('top', { lw: 1.6, fill: 'rgba(0,0,0,0)' });
    });
    /* the hand that does it: two fingertips on the buttons through the months; then they lift off and show what they left */
    { const kl = ep(t, U0.lift[0], U0.lift[1], E.io3);
      for (const [fx, fy, ang] of [[-14, -36, -Math.PI / 2], [14, -36, -Math.PI / 2]]) { const q = [cx0 + fx * MS_K.x * sM, cy0 + fy * MS_K.y * sM]; finger(q[0], q[1] + 40 + 70 * kl, ang, { s: sM, view: 'top', press: 0.3 * (1 - kl), alpha: 0.9 * (1 - kl) }); } }
    /* the months: a bar, no numbers on it (owners give none) */
    { const bx = lx, by = 930, bw = 500; line(bx, by, bx + bw, by, { color: C.hair, w: 6 }); line(bx, by, bx + bw * km, by, { color: C.secondText, w: 6 }); text('Months in use', bx, by - 16, { role: 'label', size: 19, color: C.mute }); }
    if (t > U0.tags[0]) faultTag(t, U0.tags[0], [cx0 - 14 * MS_K.x * sM + 10, cy0 - 36 * MS_K.y * sM - 20], '"Known to yellow very badly"', { to: [cx0 + 170, 420], side: 'r', prose: true, maxW: 300 });
    if (t > U0.tags[1]) faultTag(t, U0.tags[1], [cx0 + 14 * MS_K.x * sM - 4, cy0 - 36 * MS_K.y * sM + 30], '"A huge problem" (Aceu edition)', { to: [cx0 + 190, 560], side: 'r', prose: true, maxW: 300 });
    text("Owners' reports, drawn: no rate given. They blame sweat, lotions and the grippier coat as much as light.", lx, 978, { role: 'small', size: 19, weight: 600, color: C.faint, alpha: ep(t, 3.0, 3.4), maxW: 860 });
    /* the right half: Cerakote's test */
    const qx = 1000, qy = 296, qw = 840, qh = 420;
    const on = ep(t, U0.lamps, U0.lamps + 0.3), hrs = 1000 * ep(t, U0.hours[0], U0.hours[1], E.io3), pk = ep(t, U0.peel[0], U0.peel[1], E.io3);
    text('Cerakote, white', qx, 284, { role: 'label', size: 20, color: C.heroText });
    const Q = b08_quv(qx, qy + 10, qw, qh, { on, hours: hrs, peel: pk, drops: ep(t, U0.drops[0], U0.drops[1]), day: ep(t, U0.day[0], U0.day[1], E.lin), wipe: ep(t, U0.wipe[0], U0.wipe[1], E.io3) });
    if (pk > 0.6) {
      const a = ep(t, U0.peel[0] + 0.4, U0.peel[0] + 0.8);
      text('Covered', Q.px + Q.mw / 2, Q.py + Q.ph + 18, { role: 'label', size: 19, color: '#F3F3F5', align: 'center', alpha: a });
      text('1,000 h of UV', Q.px + Q.mw + (Q.pw - Q.mw) / 2, Q.py + Q.ph + 18, { role: 'label', size: 19, color: '#F3F3F5', align: 'center', alpha: a });
      const kw = ep(t, U0.wipe[1], U0.wipe[1] + 0.3), cxm = Q.px + Q.mw + (Q.pw - Q.mw) / 2;
      text('No visible change', cxm, Q.py + Q.ph / 2 + 9 - 14 * kw, { role: 'label', size: 24, color: C.heroText, align: 'center', alpha: ep(t, U0.peel[1], U0.peel[1] + 0.3) * Math.max(1 - ep(t, U0.drops[0] - 0.2, U0.drops[0]), kw) });
      text('Chemicals: Excellent', cxm, Q.py + Q.ph / 2 + 30, { role: 'label', size: 19, color: C.heroText, align: 'center', alpha: kw });
    }
    verdict(t, U0.verdict, qx, 870, { from: 0, to: 1000, unit: 'h', dec: 0, label: 'UV testing published', better: 'higher', who: ['ULX Pro: none', 'Cerakote'], size: 112, maxW: 560 });
    scaleNote(qx, 962, 'six weeks without a break', { lead: '1,000 h', t, t0: 8.4 });
  }
});

/* ---------- b08_tape: the best thickness is no thickness ----------
   Replaces srf_tape (8/10: "the best thickness is no thickness, people have been chasing really thin grip tape for a while
   now, this is a better solution"); F2.15 ("the solid state solution that doesn't need adhesives that wear down over time
   or collect gunk"). A section to scale (s px per mm) under a fingertip: grip tape on its glue, 0.5 mm, the edge a step
   the fingertip drops off (two-thirds of a credit card). A month on (drawn from owners' reports and the adhesive patent,
   not measured): the glue creeps out of the cut edge, skin and lint stick to it, the edge lifts. Then the chase: a thinner
   tape (0.3 mm: TalonGames PU-0, Keychron), then none: the grip etched into the coat that is there anyway, so nothing is
   added, no glue, no edge; the fingertip slides back across with no step. */
const B08T = { box: [LM, 300, 1100, 600], s: 150, slide1: [0.6, 2.0], age: [2.2, 3.4], tags: [1.5, 2.6, 2.9], tagsOut: [4.0, 4.4], new03: [4.4, 4.9], thin1: [4.4, 5.2], thin2: [5.6, 6.4], slide2: [6.6, 7.8], verdict: 7.8 };
/** a fingertip in section, its front end at x1 (stage px): skin with papillary ridges along the underside, which rests on
   the highest surface beneath it (a step drops it). The front is the kit's own pad profile (fingerPad, F52.1: the pad's
   height u mm back from the tip), pressed o.sink mm onto the surface (0.2: a light touch, about a 7 mm contact), so it
   rounds up over about 5 mm as a real fingertip does. o = { a, s, top(x), x0, ridge (mm), sink (mm) } */
const B08_TIP_SINK = 0.2;
/** how far back from the tip the pad meets the surface, mm, at that sink (where fingerPad falls to it) */
const B08_TIP_REACH = {};
function b08_tipReach(sink = B08_TIP_SINK) { if (B08_TIP_REACH[sink] == null) { let u = 0; while (u < 12 && fingerPad(u) > sink) u += 0.01; B08_TIP_REACH[sink] = u; } return B08_TIP_REACH[sink]; }
function b08_tip(x1, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const s = o.s || 150, sp = (o.ridge || 0.45) * s, amp = Math.min(0.06 * s, 10), x0 = o.x0, top = o.top, sink = o.sink == null ? B08_TIP_SINK : o.sink, N = Math.ceil((x1 - x0) / 3);
  /* where the pad meets the surface, and the level its lifted front hangs from: the surface under the contact's front end,
     averaged over its last millimetre, so the front drops with the pad as the contact crosses a step (not in one frame) */
  const xc = x1 - b08_tipReach(sink) * s; let mc = 0, nc = 0; for (let d = -s; d <= 0; d += 5) { mc += top(xc + d); nc++; } mc /= nc;
  const base = [];
  for (let i = 0; i <= N; i++) {
    const xx = Math.min(x0 + i * 3, x1); let m = Infinity; for (let d = -sp * 0.5; d <= sp * 0.5; d += 6) m = Math.min(m, top(xx + d));
    const up = Math.max(0, fingerPad((x1 - xx) / s) - sink) * s;     /* the kit's pad, pressed sink mm flat */
    base.push([xx, up > 0 ? Math.min(m, mc - up) : m]);               /* in contact it rests on the surface; lifted, it hangs, never through */
  }
  /* the papillary ridges along the skin (crests on the line, valleys up into the pad), spaced along the curve */
  let arc = 0;
  const pts = base.map((p, i) => {
    if (i) arc += Math.hypot(p[0] - base[i - 1][0], p[1] - base[i - 1][1]);
    const q = base[Math.min(i + 1, N)], r = base[Math.max(i - 1, 0)], tx = q[0] - r[0], ty = q[1] - r[1], tl = Math.hypot(tx, ty) || 1, k = amp * (0.5 - 0.5 * Math.cos(arc / sp * TAU));
    return [p[0] + ty / tl * k, p[1] - tx / tl * k];
  });
  G.save(); G.globalAlpha = a;
  G.beginPath(); G.moveTo(pts[0][0], pts[0][1] - 8 * s); pts.forEach(p => G.lineTo(p[0], p[1])); G.lineTo(x1, pts[N][1] - 8 * s); G.closePath();
  G.fillStyle = TH ? '#C8C8C8' : '#5E5E5E'; G.fill();
  G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.strokeStyle = TH ? 'rgba(40,40,40,0.6)' : 'rgba(229,229,229,0.45)'; G.lineWidth = 1.5; G.stroke();
  G.restore();
}
S({
  id: 'b08_tape', ch: 'surface', theme: 'paper', title: 'The best thickness is no thickness', settle: 11.5, ideas: [60],
  replaces: ['srf_tape'],
  src: ['b08_tape05', 'b08_tape03', 'srf_lizard', 'srf_ooze', 'b08_peel', 'srf_f110'],
  answers: [
    ['"the best thickness is no thickness"', 'His line is the title, and the payoff: added for grip, 0.5 mm of tape → 0 mm, the grip cut into the coat that is there anyway'],
    ['"people have been chasing really thin grip tape for a while now"', 'The chase is on screen: 0.5 mm tapes (Lizard Skins DSP, Pulsar SuperGrip), then 0.3 mm (TalonGames PU-0, Keychron), each a thinner sheet still on glue with an edge'],
    ['"this is a better solution"', 'Shown on the same fingertip: the tape\'s edge is a step it drops off; after the etch it slides across the same place with no step'],
    ['(R2-b08-5) where is this?', 'From frame one: "Fingertip, in section" and "Grip tape on its glue" named on the drawing, and the kit\'s locator under it, the left button from the side; at 150 px a mm the fingertip\'s nail sits far above the box, so it reads by its name'],
    ['F2.15 "doesn\'t need adhesives that wear down over time or collect gunk"', 'A month on: the glue creeps out of the cut edge (US 6,686,014), skin and lint stick to it, the edge lifts ("unpeeled after a month"); the etch has no glue and no edge']
  ],
  draw: t => {
    header(t, 'The best thickness is no thickness');
    captions(t, [[0.4, 'Grip tape is a sheet on glue. At 0.5 mm its edge is a step your fingertip drops off: two-thirds of a credit card.'],
      [2.2, 'A month on, the glue creeps out of the edge and catches skin and lint, and the edge starts to lift.'],
      [4.4, 'So tapes chase thin, 0.5 mm, then 0.3 mm. The etch ends the chase: nothing on top, no glue, no edge.']]);
    const T0 = B08T, [bx, by, bw, bh] = T0.box, sc = T0.s, base = by + bh * 0.66, ex = bx + bw * 0.58;
    const age = ep(t, T0.age[0], T0.age[1], E.lin), kN = ep(t, T0.new03[0], T0.new03[1]);
    const mm = t < T0.thin1[0] ? 0.5 : t < T0.thin2[0] ? lerp(0.5, 0.3, ep(t, T0.thin1[0], T0.thin1[1], E.io3)) : lerp(0.3, 0, ep(t, T0.thin2[0], T0.thin2[1], E.io3));
    const etch = ep(t, T0.thin2[0] + 0.3, T0.thin2[1]);
    /* the aged 0.5 mm tape, then (dissolving over it) a new, thinner one, then none */
    const A = b08_tapeSection(T0.box, { s: sc, base, mm: 0.5, age, edge: ex, t });
    let top = A.top;
    if (kN > 0.003) { G.save(); G.globalAlpha = kN; const B2 = b08_tapeSection(T0.box, { s: sc, base, mm, age: 0, edge: ex, t, etch }); G.restore(); if (kN > 0.5) top = B2.top; }
    /* the fingertip: slides right across the edge, rests, then (after the etch) slides back across where the edge was */
    /* the pad's contact (its front end, xc) starts on the tape, crosses the edge (1.5 mm past it) and, after the etch, comes
       back across where the edge was; the fingertip's front rounds up b08_tipReach() mm ahead of it, so it leaves the box
       on the right while the pad lies across the step */
    const xc = t < T0.slide2[0] ? lerp(bx + bw * 0.12, ex + 1.5 * sc, ep(t, T0.slide1[0], T0.slide1[1], E.io3)) : lerp(ex + 1.5 * sc, bx + bw * 0.2, ep(t, T0.slide2[0], T0.slide2[1], E.io3));
    const x1 = xc + b08_tipReach() * sc;
    clipped(bx, by, bw, bh, () => b08_tip(x1, { s: sc, top, x0: bx - 40 }));
    rrPath(bx, by, bw, bh, 6); G.strokeStyle = C.hair; G.lineWidth = 1.2; G.stroke();
    /* the layers named, quietly; and, from frame one, what the grey and the strip are (R2-b08-5: "where" at t = 0) */
    text('Fingertip, in section', bx + 24, by + 44, { role: 'label', size: 20, color: C.ink2 });
    text('Grip tape on its glue', ex - 10, base - 0.5 * sc - 26, { role: 'label', size: 20, color: C.ink2, align: 'right', alpha: 1 - ep(t, T0.thin1[0] - 0.3, T0.thin1[0]) });
    text('Shell', bx + 16, by + bh - 20, { role: 'label', size: 19, color: '#E8E8EA' });
    text('Coat, 19 µm: a line at this scale', bx + 16, base + 30, { role: 'label', size: 19, color: '#E8E8EA' });
    /* the tape's thickness, counted as it thins */
    if (mm > 0.12) { const xd = bx + 40, y0 = base - 0.019 * sc, y1 = y0 - (mm + 0.05) * sc; line(xd, y0, xd, y1, { color: '#FFFFFF', w: 2 }); line(xd - 7, y1, xd + 7, y1, { color: '#FFFFFF', w: 2 });
      text(fmtN(mm, 2) + ' mm', xd + 14, (y0 + y1) / 2 + 8, { role: 'label', size: 22, color: '#FFFFFF' }); }
    /* what goes wrong, named where it happens */
    { const ko = 1 - ep(t, T0.tagsOut[0], T0.tagsOut[1]), tx = bx + bw + 30;
      if (t > T0.tags[0] && ko > 0.003) faultTag(t, T0.tags[0], [ex + 6, base - 0.55 * sc * 0.5], 'A step at the edge', { to: [tx, by + 60], side: 'r', alpha: ko });
      if (t > T0.tags[1] && ko > 0.003) faultTag(t, T0.tags[1], [ex - 60, base - (0.55 * sc) - 14], '"Unpeeled after a month"', { to: [tx, by + 170], side: 'r', alpha: ko });
      if (t > T0.tags[2] && ko > 0.003) faultTag(t, T0.tags[2], [ex + 22, base - 6], 'Glue creeps out, gunk sticks', { to: [tx, base + 20], side: 'r', alpha: ko }); }
    if (t > T0.slide2[1] - 0.3) fixTag(t, T0.slide2[1] - 0.3, [ex, base - 0.019 * sc], 'No step, no glue', { to: [bx + bw - 225, base - 118], side: 'r' });   /* in the clear wedge under the fingertip's rising front */
    /* the right column: the chase, then the payoff */
    const rx = 1240, kc = ep(t, 4.5, 4.9);
    if (kc > 0.003) {
      text('The chase for thinner tape', rx, 320, { role: 'label', size: 21, color: C.mute, alpha: kc });
      const rows = [['Lizard Skins DSP', 0.5], ['Pulsar SuperGrip', 0.5], ['TalonGames PU-0', 0.3], ['Keychron', 0.3], ['Theseus: etched', 0]], pxmm = 560;
      rows.forEach(([nm, v], i) => {
        const a = stagger(t, 4.6, i, i < 4 ? 0.18 : 1.4, 0.35), yy = 366 + i * 44, th = i === 4;
        text(nm, rx, yy, { role: 'small', size: 22, weight: 650, color: th ? C.heroText : C.ink2, alpha: a });
        if (v > 0) { G.save(); G.globalAlpha = a; G.fillStyle = C.comp; G.fillRect(rx + 250, yy - 15, v * pxmm * 0.6, 16); G.restore(); }
        text(v > 0 ? fmtN(v, 1) + ' mm' : '0 mm', rx + 250 + (v > 0 ? v * pxmm * 0.6 + 12 : 0), yy, { role: 'small', size: 22, weight: 750, color: th ? C.heroText : C.ink, alpha: a });
      });
    }
    verdict(t, T0.verdict, rx, 760, { from: 0.5, to: 0, unit: 'mm', dec: 1, label: 'Added for grip', better: 'lower', who: ['Grip tape', 'Theseus'], size: 120, maxW: RM - rx });
    /* where this is: the left button from the side (the kit's locator), under the section */
    locator(t, -1, bx + 18, by + bh + 26, 104, 'left', msBox('left', 'trigL'), { hi: ['trigL'] });
    text('The left button, seen from the side; the section cuts across the tape\'s edge', bx + 168, by + bh + 52, { role: 'small', size: 20, weight: 600, color: C.mute, maxW: 900 });
    scaleNote(rx, 880, 'two-thirds of a credit card', { lead: '0.5 mm', t, t0: 8.6 });
    text("Ageing drawn from owners' reports and the adhesive patent, not measured", rx, 926, { role: 'small', size: 19, weight: 600, color: C.faint, alpha: ep(t, 8.8, 9.2), maxW: RM - rx });
  }
});

/* ---------- b08_twotone: two tones in one coat ----------
   Replaces srf_twotone (6/10: "not a universal dah of the design, but i love how realistic it is"); F2.21 ("2 tone designs
   without having to worry about a second coat adding weight or coming off (as seen in the finalmouse prophecy series)");
   F21.7 (etch through to carbon). The realistic macro is kept as it was loved (srf_genTwoTone, srf_macro): a laser rasters
   a Greek key out of a white coat down to the carbon shell. The rival first: painted art on Prophecy (an undercoat, the
   paint and a UV top coat on the shell: Finalmouse's own description) under a scuff, which takes the top layers off (the
   mechanism, drawn; not a report about Prophecy units). Then the etch, then the same scuff on one coat with its second tone
   cut out: nothing on top to chip. Verdict 3 → 1 layers on the shell. Said once: a colourway option, not the default. */
const B08W = { scuff0: [1.0, 2.2], laser: [2.8, 6.6], sweep: [6.4, 2.6], scuff1: [6.9, 8.1], verdict: 8.1 };
/** a stack of layers on the shell in section (not to scale): layers = [{ h, col }] from the shell up; o = { a, chip (0..1:
   a scuff has taken the top `chipN` layers off in a ragged notch), chipN, cut ([x0, x1]: a window etched through the top
   layer to the shell) }. Returns the y of the top. */
function b08_stack(x, y, w, layers, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return y;
  G.save(); G.globalAlpha *= a;
  const sh = 64; rrPath(x, y - sh, w, sh, 4); G.fillStyle = '#2E2F33'; G.fill();
  let yy = y - sh; const tops = [];
  for (const L of layers) { G.fillStyle = L.col; G.fillRect(x, yy - L.h, w, L.h); tops.push([yy, L.h]); yy -= L.h; }
  if (o.cut) { G.fillStyle = '#2E2F33'; const [c0, c1] = o.cut, Lt = tops[tops.length - 1]; G.fillRect(x + c0 * w, Lt[0] - Lt[1] - 1, (c1 - c0) * w, Lt[1] + 1); }
  const ch = clamp(o.chip || 0);
  if (ch > 0.01) {
    /* a ragged notch where the scuff tore the top layers away, down to the undercoat */
    const n = o.chipN || 2, yTop = yy, yBot = tops[tops.length - n][0] - tops[tops.length - n][1] + tops[tops.length - n][1], x0 = x + w * 0.3, x1 = x0 + w * 0.42 * ch, r = rng(19);
    G.beginPath(); G.moveTo(x0, yTop - 1); for (let xx = x0; xx <= x1; xx += 10) G.lineTo(xx, yBot - 2 - r() * 4); G.lineTo(x1, yTop - 1); G.closePath();
    G.fillStyle = C.bg; G.fill(); G.strokeStyle = C.red; G.lineWidth = 2; G.stroke();
    /* flakes thrown off ahead of it */
    for (let i = 0; i < 9; i++) { const fx = x1 + 6 + r() * 40 * ch, fy = yTop - 6 - r() * 26 * ch; G.save(); G.translate(fx, fy); G.rotate(r() * 3); G.fillStyle = layers[layers.length - 1 - (i % n)].col; G.fillRect(-4, -2, 8, 4); G.restore(); }
  }
  G.restore();
  return yy;
}
/** a coin's edge dragged across a stack: a tilted grey blade from (x, y), its tip on the surface */
function b08_scuffer(x, y, a) { if (a <= 0.003) return; G.save(); G.globalAlpha = a; G.translate(x, y); G.rotate(-0.5); rrPath(-6, -90, 12, 90, 5); G.fillStyle = '#9C9CA0'; G.fill(); G.strokeStyle = 'rgba(255,255,255,0.4)'; G.lineWidth = 1.2; G.stroke(); G.restore(); }
S({
  id: 'b08_twotone', ch: 'surface', theme: 'night', title: 'Two tones in one coat', settle: 11, ideas: [60, 16],
  replaces: ['srf_twotone'],
  src: ['srf_laserImg', 'srf_prophecy', 'srf_prophecyW', 'srf_f110', 'b08_doc16'],
  answers: [
    ['"i love how realistic it is"', 'Kept: the same lit macro of a laser rastering the key band out of a white coat down to the carbon shell, with one light sweep over the finished relief'],
    ['"not a universal dah of the design"', 'Said on the slide: a colourway option, not the default design'],
    ['F2.21 "without having to worry about a second coat adding weight or coming off (as seen in the finalmouse prophecy series)"', 'The rival first: Prophecy\'s painted art is three layers on the shell (undercoat, paint, UV top coat, Finalmouse\'s words); a scuff that gets through the top coat reaches the paint (shown as the mechanism: no owner reports of Prophecy wear were found, so the slide does not say its paint chips), and finds nothing on top to reach on the etched coat. Verdict 3 → 1 layers. The old "33 g painted, 29 g plain" is dropped: Finalmouse does not say what the 4 g is'],
    ['F21.7 "Etch through to carbon"', 'As drawn: the second tone is the carbon shell itself']
  ],
  draw: t => {
    header(t, 'Two tones in one coat');
    captions(t, [[0.5, 'Painted art sits on top of the shell: an undercoat, the paint and a top coat. A scuff that gets through the top coat reaches the paint.'],
      [2.8, 'Etched art is cut out of one coat: the laser takes the white off, and the carbon shell under it is the second tone.']]);
    const W0 = B08W;
    /* the macro: a white coat; the laser rasters the key band out of it; one studio light sweep over the finished relief */
    const T0 = [LM, 290, 1080, 640];
    demoWindow(T0[0], T0[1], T0[2], T0[3], 1, { r: SRF.r });
    const f = srf_field('twotone', SRF_TT.w, SRF_TT.h, srf_genTwoTone), kL = ep(t, W0.laser[0], W0.laser[1], E.lin);
    const M = srf_macro(t, f, T0[0], T0[1], T0[2], T0[3], { light: srf_sweep(Math.min(t, W0.sweep[0] + W0.sweep[1]), f, W0.sweep[0], W0.sweep[1], { y: -0.4 }), k: kL, alpha: 1 });
    if (kL > 0 && kL < 1) {
      const row = Math.min(SRF_TT.rows - 1, Math.floor(kL * SRF_TT.rows)), u = kL * SRF_TT.rows - row, rh = (f.band[1] - f.band[0]) / SRF_TT.rows;
      const q = M.map(u * f.w, f.band[0] + (row + 0.5) * rh);
      G.save(); rrPath(T0[0], T0[1], T0[2], T0[3], SRF.r); G.clip(); glow(q[0], q[1], 34, C.hero, 0.6); circle(q[0], q[1], 4, { fill: '#FFFFFF' }); G.restore();
    }
    text('White coat', T0[0] + 32, T0[1] + 52, { role: 'label', size: 21, color: 'rgba(17,17,17,0.72)' });
    text('Etched through: the carbon shell is the second tone', T0[0] + 32, T0[1] + T0[3] - 32, { role: 'small', size: 24, weight: 700, color: 'rgba(17,17,17,0.85)', alpha: ep(t, 4.6, 5.0) });
    /* the right column: the two stacks under the same scuff */
    const rx = 1220, sw = 380, yA = 452, yB = 662;
    text('Prophecy: painted art', rx, 316, { role: 'label', size: 20, color: C.secondText });
    const chipA = ep(t, W0.scuff0[0] + 0.25, W0.scuff0[1], E.io3);
    const topA = b08_stack(rx, yA, sw, [{ h: 12, col: '#7C7C80' }, { h: 18, col: C.second }, { h: 10, col: 'rgba(235,235,238,0.6)' }], { chip: chipA, chipN: 2 });
    text('Shell', rx + 14, yA - 22, { role: 'label', size: 19, color: '#C8C8CC' });
    text('Undercoat, paint, top coat: 3 layers', rx, yA + 32, { role: 'label', size: 19, color: C.mute });
    text('Theseus: one coat, etched', rx, 540, { role: 'label', size: 20, color: C.heroText });
    const topB = b08_stack(rx, yB, sw, [{ h: 12, col: '#E6E6E8' }], { cut: [0.52, 0.78] });
    text('Shell', rx + 14, yB - 22, { role: 'label', size: 19, color: '#C8C8CC' });
    text('1 coat; the dark tone is the shell', rx, yB + 32, { role: 'label', size: 19, color: C.mute });
    /* the scuff: a coin's edge dragged across each, the same way */
    const sA = ep(t, W0.scuff0[0], W0.scuff0[1], E.io3), sB = ep(t, W0.scuff1[0], W0.scuff1[1], E.io3);
    if (sA > 0 && sA < 1) b08_scuffer(lerp(rx + sw * 0.25, rx + sw * 0.95, sA), topA, 1);
    if (sB > 0 && sB < 1) b08_scuffer(lerp(rx + sw * 0.25, rx + sw * 0.95, sB), topB, 1);
    if (t > W0.scuff0[1] - 0.2) faultTag(t, W0.scuff0[1] - 0.2, [rx + sw * 0.5, topA + 8], 'A scuff reaches the paint', { to: [rx + sw + 30, topA - 24], side: 'r', maxW: 200 });   /* the mechanism, not a report: no owner reports of Prophecy paint wear were found (FILLS b08-6; R2-b08-6) */
    if (t > W0.scuff1[1] - 0.1) fixTag(t, W0.scuff1[1] - 0.1, [rx + sw * 0.65, topB + 4], 'Nothing to chip', { to: [rx + sw + 30, topB - 24], side: 'r' });
    verdict(t, W0.verdict, rx, 880, { from: 3, to: 1, unit: '', dec: 0, label: 'Layers on the shell', better: 'lower', who: ['Painted', 'Etched'], size: 150, maxW: RM - rx, net: false });
    text('A colourway option, not the default design', T0[0], T0[1] + T0[3] + 30, { role: 'small', size: 21, weight: 600, color: C.faint, alpha: ep(t, 8.6, 9.0) });
  }
});

/* ---------- b08_wheel: a 0.9 g magnesium wheel ----------
   Replaces wheel (5/10: "poor comparison figure, we should be comparing ti average plastic wheels with heavy rubber, a
   test group"); F22.1 (PMM's wheel is 1.0 g, ours 0.9 g, six arms), F25.2 (thinner arms, 0.55 mm), F30.8 (the straight-line
   tread); F47.5 (Brock: "Show the two found"). The test group is the two stock wheels in rubber tyres whose weights are
   published, both by sellers of lighter wheels: Endgame Gear's OP1 1.8 g (Forky Mods) and Razer's Viper V2 Pro 1.5 g
   (Zeromouse's "original", the wheel its kit reuses; FILLS Q3); 21 searches found no others. The verdict takes their average
   (1.65 g), as he asked. A jeweller's scale from above weighs the V2 Pro's wheel (1.50 g), PMM's magnesium wheel (1.00 g,
   PMM's own figure), then Theseus's (0.90 g, derived: 508.5 mm³ of AZ31B at 1.77 g/cm³, the deck's 3D wheel). The wheel from
   the side (the shared 2D twin): six thin arms that make six triangles with the rim, and the straight-grooved tread. */
const B08H = { seq: [['stock', 1.0, 2.45, 1.5], ['pmm', 3.1, 4.7, 1.0], ['ths', 5.4, 99, 0.9]], dur: 0.9, off: 0.6, count: 0.35, verdict: 7.4,
  stock: [1.8, 1.5] };   /* the two stock wheels found (OP1, Viper V2 Pro); the verdict takes their average, as Brock asked ("average plastic wheels"),
                           1.65 g (R2-b08-9); each count lands within 0.35 s, so the 40 % frame reads a settled 1.00 g (R2-b08-10) */
/** a wheel face-on (lying flat on a pan), centre (x, y), radius R px: kind 'stock' (a plastic wheel in a black rubber tyre),
   'pmm' (a plain metal disc: its design is not drawn, only its size), 'ths' (six thin arms, an open hub, a thin rim) */
function b08_wheelFace(x, y, R, kind, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  G.save(); G.globalAlpha = a; G.translate(x, y); G.rotate(o.rot || 0);
  if (kind === 'stock') {
    circle(0, 0, R, { fill: '#232326' }); circle(0, 0, R * 0.74, { fill: '#BDBDC1' });
    G.strokeStyle = 'rgba(255,255,255,0.18)'; G.lineWidth = 1.2; for (let i = 0; i < 36; i++) { const an = i / 36 * TAU; G.beginPath(); G.moveTo(Math.cos(an) * R * 0.8, Math.sin(an) * R * 0.8); G.lineTo(Math.cos(an) * R * 0.97, Math.sin(an) * R * 0.97); G.stroke(); }
    circle(0, 0, R * 0.2, { fill: '#8E8E92' }); circle(0, 0, R * 0.07, { fill: '#3A3A3E' });
  } else if (kind === 'pmm') {
    circle(0, 0, R, { fill: '#A9A9AE' }); circle(0, 0, R, { color: 'rgba(0,0,0,0.35)', w: 1.5 }); circle(0, 0, R * 0.16, { fill: '#7D7D82' });
  } else {
    const rimW = R * 0.1, hub = R * 0.2, col = '#B6B6BB';
    G.beginPath(); G.arc(0, 0, R, 0, TAU); G.arc(0, 0, R - rimW, 0, TAU, true); G.fillStyle = col; G.fill();
    for (let i = 0; i < 6; i++) { G.save(); G.rotate(i * TAU / 6); G.beginPath(); G.moveTo(-R * 0.045, hub * 0.9); G.lineTo(-R * 0.026, R - rimW * 0.6); G.lineTo(R * 0.026, R - rimW * 0.6); G.lineTo(R * 0.045, hub * 0.9); G.closePath(); G.fill(); G.restore(); }
    G.beginPath(); G.arc(0, 0, hub, 0, TAU); G.arc(0, 0, hub * 0.55, 0, TAU, true); G.fill();
    circle(0, 0, R, { color: C.hero, w: 2 });
  }
  G.restore();
}
/** tweezers holding a wheel at (x, y) from the upper left; open (0..1) */
function b08_tweezers(x, y, R, open, a) {
  if (a <= 0.003) return; const ang = -2.85, ux = Math.cos(ang), uy = Math.sin(ang), gap = R * (0.22 + 0.5 * open), L = 260;
  G.save(); G.globalAlpha = a; G.lineCap = 'round';
  for (const sd of [-1, 1]) { const px = -uy * sd, py = ux * sd, t0 = [x + ux * R * 0.9 + px * gap, y + uy * R * 0.9 + py * gap], t1 = [x + ux * (R + L) + px * 6, y + uy * (R + L) + py * 6]; line(t0[0], t0[1], t1[0], t1[1], { color: '#6E6E73', w: 6 }); }
  G.restore();
}
S({
  id: 'b08_wheel', ch: 'surface', theme: 'paper', title: 'A 0.9 g magnesium wheel', settle: 11.5, ideas: [84, 30],
  replaces: ['wheel'],
  src: ['b08_wheels', 'srf_pmm', 'srf_wheel3d', 'srf_az31b', 'srf_doc'],
  answers: [
    ['"poor comparison figure"', 'A weighing instead of a figure: a jeweller\'s scale from above, each wheel set on its pan by tweezers and the display settling: the Viper V2 Pro\'s stock wheel 1.50 g, PMM\'s magnesium wheel 1.00 g, then Theseus\'s 0.90 g; the verdict against the two stock wheels\' average, as he asked (1.65 → 0.90 g, −45 %)'],
    ['"we should be comparing ti average plastic wheels with heavy rubber, a test group"', 'The two stock wheels in rubber tyres with published weights are on screen: Endgame Gear\'s OP1 1.8 g (Forky Mods) and Razer\'s Viper V2 Pro 1.5 g (Zeromouse\'s figure for the wheel its kit reuses), both from sellers of lighter wheels, said on the slide; the "to weigh" slots are gone (Brock, F47.5: "Show the two found"); 21 searches found no others'],
    ['F22.1 / F25.2 (six arms, thinner, 0.9 g against PMM\'s 1.0 g)', 'The wheel from the side (the shared 2D twin): six thin arms, 0.55 mm at the rim, six triangles with it; verdict 1.0 → 0.9 g'],
    ['F30.8 (the straight-line tread)', 'The tread unrolled under the wheel: straight grooves across it, no rubber']
  ],
  draw: t => {
    header(t, 'A 0.9 g magnesium wheel');
    captions(t, [[0.4, 'Stock plastic wheels in rubber tyres: OP1 1.8 g, Viper V2 Pro 1.5 g. PMM\'s magnesium wheel: 1.0 g.'],
      [5.4, 'Theseus\'s is magnesium too: six thin arms, six triangles with the rim, 0.9 g, on a straight-grooved tread.']]);
    const H0 = B08H, R = 104;
    /* the stock wheels in rubber tyres with published weights: the two found (Brock, F47.5: "Show the two found") */
    text('Stock wheels in rubber tyres: the two weights published', LM, 298, { role: 'label', size: 20, color: C.mute });
    [[184, 'Endgame Gear OP1', '1.8 g'], [446, 'Razer Viper V2 Pro', '1.5 g']].forEach(([x, nm, g]) => {
      b08_wheelFace(x, 384, 46, 'stock');
      text(nm, x, 456, { role: 'label', size: 19, color: C.mute, align: 'center' });
      text(g, x, 482, { role: 'small', size: 22, weight: 750, color: C.ink2, align: 'center' });
    });
    text('Both weighed by sellers of lighter wheels: Forky Mods (OP1) and Zeromouse, whose kit reuses the Viper V2 Pro\'s wheel. Tyre and axle not stated.', 590, 362, { role: 'small', size: 20, weight: 600, color: C.mute, maxW: 345, lh: 1.3 });
    text('Average 1.65 g', 315, 512, { role: 'small', size: 21, weight: 700, color: C.ink2, align: 'center' });
    line(184, 494, 446, 494, { color: C.faint, w: 1.5 }); line(184, 488, 184, 494, { color: C.faint, w: 1.5 }); line(446, 488, 446, 494, { color: C.faint, w: 1.5 });
    /* the scale, from above: its pan, its display */
    const bx = LM + 30, by = 520, bw = 820, bh = 380, pc = [bx + 230, by + bh / 2];
    rrPath(bx, by, bw, bh, 28); G.fillStyle = TH ? '#E2E2E5' : '#2A2B2F'; G.fill(); G.strokeStyle = rgba(C.ink, 0.3); G.lineWidth = 1.5; G.stroke();
    circle(pc[0], pc[1], 160, { fill: TH ? '#F1F1F3' : '#3A3B40' }); circle(pc[0], pc[1], 160, { color: rgba(C.ink, 0.25), w: 1.5 });
    /* the wheels, one at a time: set on the pan by tweezers, read, taken off */
    const from = [bx - 260, by + 40];
    let val = 0, who = null;
    clipped(bx - 40, by - 200, bw + 80, bh + 240, () => {
      for (const [kind, t0, t1, g] of H0.seq) {
        const kin = ep(t, t0, t0 + H0.dur, E.io3), kout = ep(t, t1, t1 + H0.off, E.io3); if (kin <= 0 || kout >= 1) continue;
        const at = kout > 0 ? [lerp(pc[0], from[0], kout), lerp(pc[1], from[1], kout)] : [lerp(from[0], pc[0], kin), lerp(from[1], pc[1], kin)];
        b08_wheelFace(at[0], at[1], R, kind);
        const held = kin < 1 || kout > 0, rel = ep(t, t0 + H0.dur, t0 + H0.dur + 0.3), grab = ep(t, t1 - 0.3, t1);
        b08_tweezers(at[0], at[1], R, held ? 0 : 1, held ? 1 : Math.max(1 - rel, grab));
        if (kin >= 1 && kout <= 0) { val = g * ep(t, t0 + H0.dur, t0 + H0.dur + H0.count, E.out3); who = kind; }
        else if (kout > 0) { val = g * (1 - ep(t, t1, t1 + 0.25)); who = kout < 0.4 ? kind : null; }
      }
    });
    /* the display: it reads what is on the pan, counting up as the pan settles */
    const dx = bx + 470, dy = by + 120, dw = 300, dh = 140;
    rrPath(dx, dy, dw, dh, 12); G.fillStyle = '#1C1D20'; G.fill();
    text(val.toFixed(2) + ' g', dx + dw - 24, dy + dh / 2 + 26, { role: 'num', size: 72, weight: 750, color: '#EDEDEF', align: 'right', tnum: true, caps: false });
    const names = { stock: ['Viper V2 Pro stock wheel', C.ink2], pmm: ['PMM magnesium', C.secondText], ths: ['Theseus', C.heroText] };
    if (who) text(names[who][0], dx, dy + dh + 40, { role: 'label', size: 22, color: names[who][1] });
    /* the wheel from the side: the shared 2D twin, with its two features named */
    const sb = [1010, 286, 460, 366], sv = { view: [0.8, 0.48, 0.4], zoom: 2.05, target: [0, 11, 0], scroll: 0, xray: 0, explode: 0, view2d: 'right', hide2d: /encoder|support/, ground2d: false };
    srf_3d(t, -1, 'wheel', sb[0], sb[1], sb[2], sb[3], sv);
    const K = SRF_WH, D2R = Math.PI / 180, wp = (r, al, x = 0) => v2dAt('wheel', sv, sb, /wheel\/tread$/, [(x + K.band) / (2 * K.band), (r * Math.cos(al) + K.R) / (2 * K.R), (r * Math.sin(al) + K.R) / (2 * K.R)]);
    const pArm = wp(6.2, -60 * D2R, 0.5) || [sb[0] + 300, sb[1] + 160], pRim = wp(10.45, -125 * D2R, 3.5) || [sb[0] + 360, sb[1] + 260];
    if (t > 5.4) callout(t, 5.4, pArm, 'Six thin arms', { to: [1510, 350], side: 'r', color: C.hero, tcolor: C.heroText, sub: '0.55 mm wide at the rim', maxW: 260 });
    if (t > 5.8) callout(t, 5.8, pRim, 'Six triangles with the rim', { to: [1510, 500], side: 'r', color: C.hero, tcolor: C.heroText, prose: true, maxW: 260, sub: 'as in the shell\'s lattice', scolor: C.mute });
    /* the tread, unrolled: straight grooves across it (F30.8) */
    { const tx = 1010, ty = 688, tw = 460, th = 44, ka = ep(t, 6.0, 6.4);
      if (ka > 0.003) { const tf = srf_field('b08w:tread', 460, 44, f => srf_genFilm(f, { pat: 'ridge', pitch: 12, width: 6, depth: 3, ang: Math.PI / 2, seed: 3, col: [176, 176, 182], ecol: [120, 120, 126] }));
        G.save(); rrPath(tx, ty, tw, th, 6); G.clip(); srf_macro(t, tf, tx, ty, tw, th, { light: { az: 2.35, el: 0.6 }, alpha: ka, r: 0 }); G.restore();
        text('Tread, unrolled: straight grooves', tx, ty - 12, { role: 'label', size: 19, color: C.mute, alpha: ka }); } }
    verdict(t, H0.verdict, 1010, 872, { from: (H0.stock[0] + H0.stock[1]) / 2, to: 0.9, unit: 'g', dec: 2, label: 'Wheel weight', better: 'lower', who: ['Stock average (n = 2)', 'Theseus'], rivalCol: 'grey', size: 100, maxW: 460 });
    { const a = ep(t, 8.6, 9.0); text("Stock wheels: sellers' figures; PMM's: its own (tyre and axle not stated). Theseus's derived: the 3D wheel's 508.5 mm³ of AZ31B at 1.77 g/cm³", 1510, 790, { role: 'small', size: 19, weight: 600, color: C.faint, alpha: a, maxW: RM - 1510 }); }
  }
});

/* ---------- b08_card: the surface chapter ----------
   Replaces surfacecard (4/10: "surfaces looks bad in 2d and 3d visualization"). The kit's chapter card with the ledger's
   words; the part is the finish itself, as a lit height field (no 3D, no whole-shell render): a satin baked coat, and at the
   answer a laser writes the grip into it, left to right: ridges that break into dots and then fade to smooth (the chapter's
   grip map, in one swatch). The light rakes across once while the problem stands, then holds. */
function b08_genSwatch(f) {
  const { w, h } = f, seed = 7, col = [34, 35, 39], ecol = [96, 98, 106], D = 3.8, P = 18;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x, i = p * 3;
    f.z0[p] = 1.0 * srf_fbm(x / 44, y / 44, seed, 3) + 0.42 * srf_fbm(x / 8, y / 8, seed + 7, 2) + 0.16 * (srf_hash(x, y, seed + 3) - 0.5);
    const sparkle = srf_hash(x, y, seed + 11) > 0.988, v = 5 * srf_vn(x / 3, y / 3, seed + 5);
    for (let j = 0; j < 3; j++) f.a0[i + j] = col[j] + v + (sparkle ? 26 : 0);
    f.g0[p] = sparkle ? 1 : 0.39;
  }
  srf_layer1(f, true); f.ramp = 0.02;
  const shape = c0 => { let c = c0 > 0 ? Math.min(1, c0 / 0.42) : 0; return c * c * (3 - 2 * c); };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x, i = p * 3, u = x / w;
    const wR = 1 - smooth(clamp((u - 0.4) / 0.18)), wD = smooth(clamp((u - 0.34) / 0.12)) * (1 - smooth(clamp((u - 0.7) / 0.16)));
    const jx = 0.9 * srf_vn(x / 37, y / 37, seed + 21), [cr, rimR] = srf_cut('ridge', x + jx, y + jx, P, 9, 0), [cd, rimD] = srf_cut('dots', x + jx, y + jx, P * 0.9, 8, 0);
    const c = Math.max(shape(cr) * wR, shape(cd) * wD), rim = Math.max(rimR * wR, rimD * wD);
    f.z1[p] = f.z0[p] - D * c + 0.3 * D * rim * (1 - c) * (0.6 + 0.8 * Math.max(0, srf_vn(x / 3.4, y / 3.4, seed + 8)));
    for (let j = 0; j < 3; j++) f.a1[i + j] = f.a0[i + j] + (ecol[j] - col[j]) * c;
    f.g1[p] = f.g0[p] * (1 - c) + 0.05 * c;
    f.th[p] = u * 0.96 + 0.04 * srf_hash(x, y, 5);
  }
  Object.assign(f.mat, { amb: 0.14, kd: 1.1, ks: 0.6, sh: 26, rz: 1.35, aoR: 5, aoK: 0.24, kf: 0.22 });
}
function b08_cardPart(t, box, kt, turn) {
  const [x, y, w, h] = box, f = srf_field('b08c:swatch', 700, 416, b08_genSwatch);
  const kE = ep(t, turn + 0.1, turn + 1.5, E.lin), lt = srf_sweep(Math.min(t, 2.0), f, 0, 1.9, { y: -0.45, from: 0.08, to: 0.66 });
  srf_macro(t, f, x, y, w, h, { light: lt, k: kE, r: 18, vignette: true });
  if (kE > 0 && kE < 1) { const lx = x + w * kE; G.save(); rrPath(x, y, w, h, 18); G.clip(); line(lx, y, lx, y + h, { color: C.hero, w: 2.5 }); G.globalAlpha = 0.16; G.fillStyle = C.hero; G.fillRect(lx - 14, y, 14, h); G.restore(); }
  text('Baked ceramic coat', x + 24, y + 40, { role: 'label', size: 20, color: '#E8E8EA', alpha: ep(t, 0.3, 0.7) });
  [['Ridges', 0.14], ['Dots', 0.52], ['Smooth', 0.86]].forEach(([nm, u], i) => text(nm, x + w * u, y + h - 22, { role: 'label', size: 19, color: '#E8E8EA', align: 'center', alpha: ep(t, turn + 0.4 + i * 0.4, turn + 0.8 + i * 0.4) }));
}
S({
  id: 'b08_card', ch: 'surface', card: true, first: true, theme: 'night', title: 'Grip that holds, and stays', settle: 5.5,
  replaces: ['surfacecard'],
  answers: [
    ['"surfaces looks bad in 2d and 3d visualization"', 'No 3D and no whole-shell render: the card shows the finish itself, a lit height field of the satin baked coat, and at the answer a laser writes the grip into it (ridges breaking into dots, then smooth), the light raking once'],
    ['surfacecard (the chapter opener)', 'Rebuilt in the kit\'s chapter-card family: the ledger\'s compromise for surfaces in red, struck as the answer lands in blue; the chapter\'s eight slides in film order along the bottom; the ledger strip']
  ],
  draw: t => {
    const turn = 2.1;
    chapterCard2(t, {
      ch: 'surface', turn,
      list: [[16, 'A baked ceramic coat'], [16, 'A fifth of a sheet of paper'], [16, 'No yellowing'], [60, 'Directional grip'], [60, 'A grip map for the hand'], [60, 'No thickness'], [60, 'Two tones in one coat'], [84, 'A 0.9 g magnesium wheel']],
      part: (tt, box, kt) => b08_cardPart(tt, box, kt, turn)
    });
  }
});

