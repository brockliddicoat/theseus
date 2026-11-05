/* ============================== surface and details (chapter code srf) ==============================
   #16 the baked ceramic coat (its film, its weight, its colour), #60 laser-etched directional grip (the grip map, no
   adhesive, two-tone), #36 #62 #61 #33 #32 the marks, #34 #82 engravings and gates, #84 #30 the magnesium wheel and its
   tread, #7 the optical encoder on a POM axle. New slides are in 10-e2-surface.js, placed with `after`.
   The close-ups are height fields lit by a raking light (srf_field / srf_macro, below), drawn in their own canvas.
   Scan-derived numbers (Brock's Sora scan) are measured in this deck; competitor numbers carry their source. */
Object.assign(SRC, {
  /* the coat: Cerakote's own data (a maker's test of its own product is a claim; a published spec is a datasheet) */
  srf_f110: { t: 'Cerakote F-110 Black Ink, F-Series (oven cure) technical data: recommended film 0.75 mil; theoretical coverage 604 ft²/gal at that film; 38% solids; 1.44 g/mL; pencil hardness 9H gouge, 7H scratch (ASTM D3363); crosscut 5B (D3359); impact 160/160 in-lb; UV stability "Excellent"; chemical resistance "Excellent", defined as a colour change under ΔE 2.5 (CIE76); results on blasted steel; cure 15 min at 250 °F, or 180 °F for 1 h', u: 'https://www.cerakoteeu.com/?p=20046', n: 'Mass per area derived here: 1.44 g/mL × 3.785 L × 38% ÷ 604 ft² (56.1 m²) = 36.9 g/m², taking the solids by weight (by volume, the coverage would be 813 ft²/gal, not 604).' },
  srf_f130: { t: 'Cerakote F-130 Stainless, F-Series technical data: 0.75 mil recommended; 589 ft²/gal at that film; 28% solids; 1.39 g/mL; pencil 9H gouge and scratch; crosscut 5B; oven cure 15 min at 250 °F, or 180 °F for 1 h', u: 'https://www.cerakote.com/shop/cerakote-coating/F-130' },
  srf_fManual: { t: 'Cerakote F-Series training manual: "The standard coating thickness for F-Series will be 0.75 mils"; metal is blasted with #100 aluminium oxide at 80 to 100 psi, while "carbon fiber, fiberglass, plastics, or polymers" get a light etch blast at 30 to 40 psi; plastics and polymers cure at 180 °F (82 °C) for 1 hour', u: 'https://images.nicindustries.com/cerakote/documents/7028/f-series-training-manual-dt20250115230026281906.pdf' },
  srf_fNews: { t: 'Cerakote, F-Series launch: "Engineered for high-volume production, F-Series is a two-part, oven cure coating applied directly to substrate", with a fast cure and a low-temperature schedule', u: 'https://cerakote.com/news/136/cerakote-launches-new-game-changing-f-series' },
  srf_micron: { t: 'Cerakote Europe, micron thickness of ceramic coatings: H-Series and F-Series thin films are "usually around 10 to 25 microns"', u: 'https://cerakoteeu.com/understanding-the-micron-thickness-of-ceramic-coatings-and-why-it-matters' },
  srf_h167: { t: 'Cerakote H-167 technical data sheet: 1 mil recommended; 606 ft²/gal at 1.0 mil; 38% solids by weight; 1.36 g/mL; pencil 8H (ASTM D3363); UV stability (ASTM D4587) "Excellent"; chemical resistance (ASTM D4752) 100%; results on blasted steel cured at 250 °F for 2 h', u: 'https://images.nicindustries.com/cerakote/documents/4979/h-167-usmc-red-tds-dt20231127204218354071.pdf' },
  srf_chem: { t: 'Cerakote testing, chemical resistance: coated panels soaked 24 h, rated by the average colour change; Elite was unaffected by all 13 chemicals, H-Series changed slightly in two', u: 'https://images.nicindustries.com/cerakote/documents/62/chemical-resistance-dt20200107192517592.pdf' },
  srf_quv: { t: 'Cerakote testing, photopolymers: ASTM D4587, 1,000 h in a QUV accelerated-weathering chamber, C-7300 on COR Alpha: "no visible sign of degradation to the substrate material or coating" (a visual rating; no ΔE given)', u: 'https://images.nicindustries.com/cerakote/documents/1956/photopolymers-dt20220805212237648307.pdf' },
  srf_laserImg: { t: 'Cerakote, Laser Imaging: three ways to laser a coat: remove it to reveal the substrate, remove a top layer to reveal a base layer, or Laser Imaging, which "produces varying color tones from a single color" and "does not etch, ablate or remove coating"; a 20 to 60 W fibre laser is recommended', u: 'https://www.cerakoteeu.com/cerakote-laser-imaging/' },
  srf_soft: { t: 'RadTech 2016, UV-curable soft-touch coatings: tested at a final film of 2 mils (51 µm); pencil hardness 7B to H; RCA abrasion 31 to 300+ cycles', u: 'https://radtech.org/proceedings/2016/papers/technical-conference/Low-Gloss%20-%20Haptic%20Coatings/How%20does%20it%20feel%20-%20Recent%20Advances%20in%20UV-curable%20Soft%20Touch%20Coatings.pdf' },
  /* the shell under it */
  srf_ppc20: { t: 'Mitsubishi Chemical Pyrofil PP-C-20A datasheet (plabase): 20% carbon fibre, 1.01 g/cm³; mould shrinkage 0.1% along the flow, 0.4% across; thermal expansion 0.5 × 10⁻⁵/°C along, 12.6 × 10⁻⁵/°C across; heat deflection 155 °C at 1.8 MPa', u: 'https://en.plabase.com/plastic/items/6577ab7a86df1821ce54dafc' },
  srf_hoft22: { t: 'Höftberger, Dietrich, Zitzenbacher & Burgstaller 2022, Polymers 14(22) 4877: short carbon fibre in PP, fibres about 7 µm across; after injection moulding the weight-average fibre length fell from 500 to 250 µm as the fibre content rose', u: 'https://www.mdpi.com/2073-4360/14/22/4877' },
  srf_yama24: { t: 'Yamaguchi, Uematsu, Sakaguchi & Hashimoto 2024, Polymer Journal 56: 205-214: injection-moulded PP with 7 µm short carbon fibres; "the fibers were more oriented along the flow direction near the surface than in the central region"', u: 'https://www.nature.com/articles/s41428-023-00856-8' },
  /* directional grip */
  srf_zhang17: { t: 'Zhang, Zeng, Igartua, Rodriguez-Vidal & van der Heide 2017, Tribology Letters 65: 89: a fingertip on picosecond-laser-textured steel; grooves 20 µm wide and 10 µm deep gave μ 0.41 to 0.47 sliding along them and 0.50 to 0.53 across (0.42 and 0.53 at 1 N); a pillar texture was orientation-independent', u: 'https://link.springer.com/article/10.1007/s11249-017-0869-x' },
  srf_serg22: { t: 'Sergachev, Matthews & van der Heide 2022, Friction 10: 762-771: skin in vivo on ellipsoidal micro-asperities (200 µm apart, 30 to 50 µm high): friction was higher sliding across their long axis, "up to a factor of 2" for the larger ones', u: 'https://link.springer.com/article/10.1007/s40544-021-0527-z' },
  srf_ooze: { t: 'US 6,686,014 B1 (Standard Register, 2004): pressure-sensitive adhesives "cold flow, or ooze" under heat and pressure; the adhesive "creeps out from under the cut edges", and things stick to what comes out', u: 'https://patents.google.com/patent/US6686014B1/en' },
  srf_lizard: { t: 'Lizard Skins DSP mouse grip, retailer listing: "a thickness of just 0.5mm", self-adhesive; owner reviews: "dead skin does get stuck in the triangles", and it absorbs skin oil over time', u: 'https://www.desertcart.co.za/products/223901387-lizard-skins-dsp-computer-mouse-grip-for-pc-gaming-compatible' },
  /* two-tone and yellowing */
  srf_prophecy: { t: 'Finalmouse ULX Prophecy (Finalmouse\'s text, Computer Lounge listing): "Specially formulated colors were developed exclusively for each Prophecy design"; the artwork is "applied using a new satin undercoat process", "with the paint protected by our new ULX competition UV matte top coat"; 33 g', u: 'https://computerlounge.co.nz/products/finalmouse-ulx-prophecy-tfue-small-wireless-gaming-mouse' },
  srf_rdClix: { t: 'r/FinalMouse, "ULX Clix" (2025), owners comparing white editions: the Aceu "was a huge problem" for yellowing; a Tarik Pro Series "was known to yellow very badly"; one blames the staining on the Pro Series\' "grippier coating"', u: 'https://www.reddit.com/r/FinalMouse/comments/1kbw8sj/ulx_clix/', n: 'Owner reports, not a measurement.' },
  srf_rdUlx: { t: 'r/FinalMouse, "Thoughts on the ULX?" (September 2024): "the staining of the coating" is the Pro Series\' one con; owners put grip tape on the main buttons "to avoid any discoloration"', u: 'https://www.reddit.com/r/FinalMouse/comments/1f6bl7h/', n: 'Owner reports, not a measurement.' },
  /* the encoder */
  srf_heds: { t: 'Avago HEDS-9700 optical encoder module datasheet: "a lensed LED source and a detector IC enclosed in a small C-shaped plastic package"; the codewheel "moves between the emitter and detector, causing the light beam to be interrupted"; channel A is in quadrature with B, 90° electrical, 4 states per cycle', u: 'https://docs.broadcom.com/doc/AV02-0511EN' },
  srf_doc: { t: 'Brock Liddicoat, "In Pursuit of an Objectively Better Mouse": numbered ideas, reasoning and brainstorm notes (private document, with its comment thread)', u: '', n: 'Brock\'s own statements and community reports: claim-level evidence, not measurements.' },
  srf_scan: { t: 'Brock Liddicoat\'s 3D scan of a Ninjutso Sora V3 (the Sora V2 shape), 119.2 × 62.5 × 38.1 mm: sections, widths, heights and areas measured from it in this deck', u: '', n: 'Measured here from the normalized scan (refs/scan). The scan is not watertight, so areas are approximate; lengths are good to about ±0.3 mm.' },
  srf_eloPmm: { t: 'EloShapes, PMM AIM 8K review: "a ceramic-based finish designed to enhance grip on their 3D-printed plastic"; "improves grip significantly"; 20 g', u: 'https://www.eloshapes.com/mouse/review/pmm-aim-8k' },
  srf_razerScroll: { t: 'Razer scroll wheel technologies: the optical scroll wheel is "3.3 times more reliable than traditional mechanical designs" (no measure given); Viper V4 Pro, DeathAdder V4 Pro, Cobra HyperSpeed', u: 'https://www.razer.com/mena-en/technology/razer-scroll-wheels' },
  srf_tpuV4: { t: 'TechPowerUp, Razer Viper V4 Pro review: the optical scroll encoder is "arguably the best one currently available" (quoted in the deck\'s validation report)', u: 'https://www.techpowerup.com/review/razer-viper-v4-pro/' },
  srf_az31b: { t: 'Tech Steel & Materials, magnesium AZ31B-H24 plate and sheet: density 1.77 g/cc', u: 'https://www.techsteel.net/alloy/az31b-h24' },
  srf_al6061: { t: 'Protolabs CNC material data sheet, aluminum 6061-T651/T6: nominal density 2.70 Mg/m³', u: 'https://www.protolabs.com/media/h54d0gnp/2026-026-cnc-material-data-sheet_aluminum-6061-t651_t6.pdf' },
  srf_ss304: { t: 'Protolabs CNC material data sheet, stainless steel 304: density 0.285 lb/in³ (7.89 g/cm³)', u: 'https://www.protolabs.com/media/tltj24um/2026-026-cnc-material-data-sheet_stainless-steel-304.pdf' },
  srf_delrin: { t: 'Delrin 150 data sheet (Plastics International): specific gravity 1.42; water absorption 0.25% in 24 h, 0.9% at saturation; dynamic μ 0.20 (ASTM D3702)', u: 'https://www.plasticsintl.com/media/05oith4t/delrin-150-data-sheet.pdf' },
  srf_wheel3d: { t: 'This deck\'s 3D scroll wheel (3d/parts/scrollwheel.js): Ø22 × 7 mm, six spokes, 48 curved grousers, 825 mm³ of wheel, 24-slot code disc; axle held 10.8 mm apart at the encoder boss and the support', u: '', n: 'A design model built for the deck, not a measured part.' },
  srf_register: { t: 'The Register: NASA\'s Perseverance wheels have 48 gently curved treads, double Curiosity\'s 24 chevrons, to better withstand sharp rocks', u: 'https://www.theregister.com/2020/04/06/nasa_reveals_perserverance_rover_grouser_wheel_design/' },
  srf_eloEnc: { t: 'EloShapes spec sheets via research/data/mice.json: encoder type of 35 mice (optical: Razer Viper V4 Pro, DeathAdder V4 Pro; ZOWIE EC2-DW, U2-DW)', u: 'https://www.eloshapes.com/' },
  srf_ttc: { t: 'TTC (@TTCswitch on X, 09/03/2026, shared on r/MouseReview): "TTC optical encoder is ready! Built for speed, precision, and durability"; renders show a normal encoder\'s black housing in a stamped steel frame with a bushing, pins and bent legs, and inside an emitter and receiver with a slotted wheel between (the picture Brock attached, F9.21)', u: '', n: 'Brock\'s reference picture; the internal dimensions are this deck\'s 3D model, not TTC\'s drawing.' },
  srf_fmSupport: { t: 'Finalmouse support staff, as Brock reports (F12.13): the encoder is the number one failure point in a mouse', u: '', n: 'Reported by Brock, not a published figure.' }
});

/* ---------- at a glance (Brock, F14.10, F15.1, F16.1) ----------
   The eye lands first on a huge number in Theseus's colour that says by how much, and on a chart where Theseus visibly
   wins with the better direction written on it. A number that improves keeps its bad value beside it, struck (before → after). */
/** the headline: a quiet label over a huge figure in Theseus's gradient, an optional word under or beside it, a line under.
   (x, y) = the figure's baseline (left, or o.align). o = { size, label, word, wordBelow, sub, maxW, count, from, a } */
function srf_hl(t, t0, x, y, num, o = {}) {
  const a = (o.a == null ? 1 : o.a) * ep(t, t0, t0 + 0.5); if (a <= 0.003) return { w: 0, h: 0 };
  const sz = o.size || 160, k = E.out3(ep(t, t0, t0 + 0.75)), al = o.align || 'left';
  G.save(); G.translate(0, (1 - k) * 16);
  if (o.label) text(o.label, x, y - sz * 0.74 - 22, { role: 'label', size: 22, color: C.heroText, alpha: a, align: al, maxW: o.maxW || 720 });
  const r = rich([{ s: num, role: 'd1', size: sz, weight: 800, track: -0.03, color: C.heroText, grad: C.heroGrad, tnum: true, count: o.count ? [t0, 1.0, o.from || 0] : null },
    o.word && !o.wordBelow ? { s: o.word, role: 'd2', size: Math.round(sz * 0.3), color: C.heroText, grad: C.heroGrad, gap: Math.round(sz * 0.08) } : null], x, y, { t, alpha: a, align: al });
  let yy = y;
  if (o.word && o.wordBelow) { yy += Math.round(sz * 0.36) + 8; text(o.word, x, yy, { role: 'd2', size: o.wordSize || Math.round(sz * 0.34), color: C.heroText, grad: C.heroGrad, align: al, alpha: a }); }
  if (o.sub) text(o.sub, x, yy + 52, { role: 'small', size: 25, weight: 600, color: C.ink2, align: al, alpha: a * ep(t, t0 + 0.3, t0 + 0.8), maxW: o.maxW || 620, lh: 1.32 });
  G.restore();
  return { w: r.w, h: yy - y };
}
/** before → after on one baseline: the old value struck in grey, an arrow, the new one in Theseus's colour, and the net
   change under them in Theseus's colour. o = { size, label, net, who: [before's name, after's name], unit } */
function srf_ba(t, t0, x, y, before, after, o = {}) {
  const a = ep(t, t0, t0 + 0.5) * (o.alpha == null ? 1 : o.alpha); if (a <= 0.003) return 0;
  const size = o.size || 72, st0 = { role: 'd1', size, weight: 800, color: C.faint, tnum: true }, wB = tw(before, st0);
  if (o.label) text(o.label, x, y - size * 0.8 - 18, { role: 'label', size: 21, color: C.mute, alpha: a, maxW: o.maxW || 700 });
  text(before, x, y, Object.assign({ alpha: a * 0.95 }, st0));
  line(x - 4, y - size * 0.31, x + wB + 4, y - size * 0.31, { color: C.mute, w: Math.max(3, size * 0.055), alpha: a * ep(t, t0 + 0.35, t0 + 0.7) });
  const ax = x + wB + size * 0.3;
  arrow(ax, y - size * 0.32, ax + size * 0.6, y - size * 0.32, { color: C.mute, w: Math.max(2.5, size * 0.05), hs: size * 0.2, alpha: a, p: ep(t, t0 + 0.2, t0 + 0.7) });
  const k = ep(t, t0 + 0.45, t0 + 0.95), x2 = ax + size * 0.9;
  const r = rich([{ s: after, role: 'd1', size, weight: 800, color: C.heroText, grad: C.heroGrad, tnum: true }, o.unit ? { s: o.unit, font: 'sans', size: Math.max(24, Math.round(size * 0.32)), weight: 700, color: C.heroText, gap: 10 } : null], x2, y, { t, alpha: a * k });
  if (o.who) { text(o.who[0], x, y + 34, { role: 'label', size: 19, color: C.faint, alpha: a }); text(o.who[1], x2, y + 34, { role: 'label', size: 19, color: C.heroText, alpha: a * k }); }
  if (o.net) text(o.net, x, y + (o.who ? 80 : 48), { role: 'small', size: o.netSize || 27, weight: 800, color: C.heroText, alpha: a * ep(t, t0 + 0.8, t0 + 1.2), maxW: o.maxW || 700, lh: 1.25 });
  return x2 + r.w - x;
}
/** which way is better, written on a chart: an arrow and quiet caps ('Lower is better'). dir: 'l' | 'r' | 'u' | 'd' */
function srf_better(t, t0, x, y, s, dir = 'l', o = {}) {
  const a = ep(t, t0, t0 + 0.4) * (o.alpha == null ? 1 : o.alpha); if (a <= 0.003) return 0;
  const g = { l: '←', r: '→', u: '↑', d: '↓' }[dir], str = dir === 'r' ? s + '  ' + g : g + '  ' + s;
  return text(str, x, y, { role: 'label', size: o.size || 21, color: o.color || C.mute, align: o.align || 'left', alpha: a }).w;
}
/** where a part sits in the shot view3D just drew into box: on the render (R3D.anchor) when the render was drawn, else on its
   flat twin. drawn = view3D's return value. (The shared v3At does this, but the build's 08-r3d.js may predate it.) */
function srf_at3(key, st, box, drawn, re, f = [0.5, 0.5, 0.5]) {
  if (typeof v3At === 'function') return v3At(key, st, box, re, f);
  if (drawn && !V2D.on && !V3.proj && typeof R3D !== 'undefined' && R3D.anchor) {
    const uv = R3D.anchor(key, re, f, TH ? 'paper' : 'night');
    if (uv) return [box[0] + uv[0] * box[2], box[1] + uv[1] * box[3]];
  }
  return typeof v2dAt === 'function' ? v2dAt(key, st, box, re, f) : null;
}

/* ---------- shared helpers (chapter code srf) ---------- */
/** a 3D shot clipped to a rounded tile */
function srf_3d(t, t0, key, x, y, w, h, st, o = {}) {
  const a = ep(t, t0, t0 + 0.5) * (o.alpha == null ? 1 : o.alpha); if (a <= 0.003) return false;
  G.save(); rrPath(x, y, w, h, o.r == null ? 12 : o.r); G.clip();
  const ok = view3D(key, t, x, y, w, h, st, { alpha: a });
  G.restore();
  return ok;
}
/* the bridge camera (3d/integration/entry.js cameraFor), replicated so 2D callouts land on the 3D: (X, Y, Z) mm → stage px.
   r is the scene's framing radius (half its bounding-box diagonal), measured from renders: shell 71.4 mm. */
const SRF_VIEWS = { top: [0, 1, 0.0001], bottom: [0, -1, 0.0001], front: [0, 0.12, 1], back: [0, 0.12, -1], left: [-1, 0.08, 0], right: [1, 0.08, 0], threeQuarter: [-0.78, 0.62, 0.95], threeQuarterRight: [0.78, 0.62, 0.95], low: [-0.9, 0.22, 0.75] };
function srf_proj(x, y, w, h, st, r, margin = 1.12) {
  if (V2D.on) { const P2 = v2dProj(st.key2d || 'shell', st, [x, y, w, h]); return (X, Y, Z) => P2([X, Y, Z]); }
  const nrm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  let d = nrm(Array.isArray(st.view) ? st.view : SRF_VIEWS[st.view || 'threeQuarter']);
  const yw = st.yaw || 0; d = [d[0] * Math.cos(yw) + d[2] * Math.sin(yw), d[1], -d[0] * Math.sin(yw) + d[2] * Math.cos(yw)];
  const fov = (st.fov || 22) * Math.PI / 180, asp = w / h, T = st.target || [0, 19, 0];
  const dist = r * margin / Math.sin(fov / 2) / Math.min(1, asp) / (st.zoom || 1);
  const P = [T[0] + d[0] * dist, T[1] + d[1] * dist, T[2] + d[2] * dist];
  const up = Math.abs(d[1]) > 0.99 ? [0, 0, -Math.sign(d[1])] : [0, 1, 0], xa = nrm(cross(up, d)), ya = cross(d, xa), tf = Math.tan(fov / 2);
  return (X, Y, Z) => { const v = [X - P[0], Y - P[1], Z - P[2]], vz = -dot(v, d); return [x + w / 2 + dot(v, xa) / (vz * tf * asp) * w / 2, y + h / 2 - dot(v, ya) / (vz * tf) * h / 2]; };
}
/** horizontal bars with the value at the end. rows: [{ name, sub, v, lo, hi (a range), err (± whisker), hero, ref, color, dash, ev, label }] */
function srf_bars(t, t0, o) {
  const { x, y, w } = o, rh = o.rowH || 56, lw = o.labelW || 300, vw = o.valW || 120, bx = x + lw, bw = w - lw - vw, [lo, hi] = o.xr;
  const X = v => bx + bw * clamp((v - lo) / (hi - lo)), a0 = ep(t, t0, t0 + 0.4);
  if (o.ticks) for (const v of o.ticks) { line(X(v), y - 24, X(v), y + rh * o.rows.length - 26, { color: C.hair, w: 1.2, alpha: a0 }); text(o.tfmt ? o.tfmt(v) : String(v), X(v), y + rh * o.rows.length + 4, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: a0 }); }
  o.rows.forEach((r, i) => {
    const yy = y + i * rh, d = t0 + 0.15 + i * (o.stagger || 0.12), k = ep(t, d, d + 0.8, E.snap), a = ep(t, d - 0.1, d + 0.3), bh = o.barH || 16;
    const nm = text(r.name, x, yy + 7, { role: 'small', size: o.nsize || 24, weight: r.hero || r.ref ? 800 : 600, color: C.ink, alpha: a, maxW: lw - 14 });
    if (r.sub) text(r.sub, x, yy + 32, { role: 'label', size: 19, color: r.hero ? C.heroText : C.mute, alpha: a, maxW: lw - 14 });
    rr(bx, yy - bh / 2, bw, bh, bh / 2, C.track, null, 0, a);
    const col = r.color || (r.hero ? C.hero : r.ref ? C.ink : C.comp);
    if (r.dash) { G.save(); G.globalAlpha = a; G.setLineDash([6, 5]); rrPath(bx, yy - bh / 2, (X(r.v) - bx) * k, bh, bh / 2); G.strokeStyle = r.hero ? C.heroText : C.ink2; G.lineWidth = 2; G.stroke(); G.restore(); }
    else if (r.lo != null) { const xa = X(r.lo), xb = X(lo + (r.hi - lo) * k); rr(Math.min(xa, xb), yy - bh / 2, Math.max(bh, Math.abs(xb - xa)), bh, bh / 2, col, null, 0, a); }
    else { const L = Math.max(bh, (X(r.v) - bx) * k); rr(bx, yy - bh / 2, L, bh, bh / 2, col, null, 0, a); }
    if (r.err && k > 0.95) { const xa = X(r.v - r.err), xb = X(r.v + r.err), ka = ep(t, d + 0.8, d + 1.1); line(xa, yy, xb, yy, { color: C.ink, w: 2, alpha: ka }); line(xa, yy - 9, xa, yy + 9, { color: C.ink, w: 2, alpha: ka }); line(xb, yy - 9, xb, yy + 9, { color: C.ink, w: 2, alpha: ka }); }
    const vs = r.label != null ? r.label : fmtN(r.v, o.dec == null ? 1 : o.dec) + (o.unit ? ' ' + o.unit : '');
    const cu = r.label == null && !r.dash ? (countUp(vs, k, lo) || vs) : vs;
    text(cu, x + w, yy + 9, { font: 'mono', size: 25, weight: r.hero || r.ref ? 800 : 600, color: r.hero ? C.heroText : C.ink, align: 'right', alpha: a, tnum: true });
    if (r.ev) evDot(x + w - tw(vs, { font: 'mono', size: 25, weight: 700 }) - 16, yy, r.ev, 5, a);
  });
  return y + rh * o.rows.length;
}
/** a vessel in elevation: base centre (cx, by), height h. fired = 0 (dried clay, matte grey) to 1 (fired, dark and glazed) */
function srf_pot(cx, by, h, fired, a) {
  if (a <= 0.003) return;
  const s = h / 180, P = [[24, -180], [20, -168], [26, -150], [58, -112], [70, -74], [64, -38], [46, -8], [40, 0]];
  const path = () => { G.beginPath(); G.moveTo(cx - P[0][0] * s, by + P[0][1] * s); for (let i = 1; i < P.length; i++) G.lineTo(cx - P[i][0] * s, by + P[i][1] * s); for (let i = P.length - 1; i >= 0; i--) G.lineTo(cx + P[i][0] * s, by + P[i][1] * s); G.closePath(); };
  const smooth = () => { G.beginPath(); const L = P.map(p => [cx - p[0] * s, by + p[1] * s]), R = P.map(p => [cx + p[0] * s, by + p[1] * s]).reverse(), Q = L.concat(R); G.moveTo(Q[0][0], Q[0][1]); for (let i = 1; i < Q.length - 1; i++) { const m = [(Q[i][0] + Q[i + 1][0]) / 2, (Q[i][1] + Q[i + 1][1]) / 2]; G.quadraticCurveTo(Q[i][0], Q[i][1], m[0], m[1]); } G.lineTo(Q[Q.length - 1][0], Q[Q.length - 1][1]); G.closePath(); };
  G.save(); G.globalAlpha = a;
  const g = G.createLinearGradient(cx - 70 * s, 0, cx + 70 * s, 0);
  const c0 = mix('#C9C8C3', '#3A3B40', fired), c1 = mix('#A9A8A2', '#16171A', fired);
  g.addColorStop(0, c1); g.addColorStop(0.35, c0); g.addColorStop(1, c1);
  smooth(); G.fillStyle = g; G.fill();
  /* unfired: a dusty grain. fired: a glaze highlight down one side */
  G.save(); smooth(); G.clip();
  if (fired < 1) { const r = rng(5); G.fillStyle = `rgba(80,80,76,${0.25 * (1 - fired)})`; for (let i = 0; i < 260; i++) G.fillRect(cx - 70 * s + r() * 140 * s, by - 180 * s + r() * 180 * s, 1.6, 1.6); }
  if (fired > 0) { const hg = G.createLinearGradient(cx - 40 * s, 0, cx - 18 * s, 0); hg.addColorStop(0, 'rgba(255,255,255,0)'); hg.addColorStop(0.5, `rgba(255,255,255,${0.38 * fired})`); hg.addColorStop(1, 'rgba(255,255,255,0)'); G.fillStyle = hg; G.fillRect(cx - 44 * s, by - 160 * s, 30 * s, 150 * s); }
  G.restore();
  smooth(); G.strokeStyle = inkA(0.55); G.lineWidth = 1.5; G.stroke();
  G.beginPath(); G.ellipse(cx, by - 180 * s, 24 * s, 5 * s, 0, 0, TAU); G.fillStyle = mix('#7F7E78', '#0D0E10', fired); G.fill(); G.stroke();
  G.restore();
}
/** a graphite pencil at 45°, its tip at (x, y), drawn up and to the right */
function srf_pencil(x, y, grade, a) {
  if (a <= 0.003) return;
  G.save(); G.globalAlpha = a; G.translate(x, y); G.rotate(-Math.PI / 4);
  G.fillStyle = '#2A2B2F'; G.beginPath(); G.moveTo(0, 0); G.lineTo(14, -5); G.lineTo(14, 5); G.closePath(); G.fill();
  G.fillStyle = '#D9D8D2'; G.beginPath(); G.moveTo(14, -5); G.lineTo(34, -11); G.lineTo(34, 11); G.lineTo(14, 5); G.closePath(); G.fill();
  rr(34, -11, 150, 22, 2, '#4A4B50', null, 0, 1); rr(184, -11, 18, 22, 2, '#9DA3AE', null, 0, 1);
  G.restore();
  text(grade, x + 70, y - 82, { role: 'label', size: 21, color: C.ink2, alpha: a });
}

/* ============================== macro close-ups: a height field under a raking light ==============================
   The chapter's close-ups (the coat, the etch, the tape, the two-tone) are height fields lit by one light: built once
   from seeded noise, shaded per pixel into a small canvas when the light or the state moves, drawn scaled into a rounded
   tile. Units are the field's own pixels; z is in the same units. Layer 1 (z1, a1, g1) is what the surface becomes:
   k mixes toward it everywhere, or pixel by pixel as k passes th[p] (a laser scan, wear spreading) when th is set. */
const SRF = { r: 22 };
const SRF_F = new Map();
function srf_hash(x, y, s) { let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1442695041)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; }
function srf_vn(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), u = x - xi, v = y - yi, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v);
  const a = srf_hash(xi, yi, s), b = srf_hash(xi + 1, yi, s), c = srf_hash(xi, yi + 1, s), d = srf_hash(xi + 1, yi + 1, s);
  return (a + (b - a) * su + (c - a) * sv + (a - b - c + d) * su * sv) * 2 - 1;
}
function srf_fbm(x, y, s, oct = 4) { let a = 0, f = 1, amp = 1, n = 0; for (let i = 0; i < oct; i++) { a += amp * srf_vn(x * f, y * f, s + i * 31); n += amp; f *= 2.03; amp *= 0.5; } return a / n; }
/** a field, built once by gen(f) and kept: f = { w, h, n, z0, a0 (RGB), g0 (gloss 0..1), mat: { amb, kd, ks, sh, rz, aoR, aoK } } */
function srf_field(key, w, h, gen) {
  let f = SRF_F.get(key);
  if (!f) { f = { key, w, h, n: w * h, z0: new Float32Array(w * h), a0: new Uint8ClampedArray(w * h * 3), g0: new Float32Array(w * h), mat: {} }; gen(f); SRF_F.set(key, f); }
  return f;
}
/** give a field its second state, a copy of the first to edit; th = true adds per-pixel switch times */
function srf_layer1(f, th) { f.z1 = new Float32Array(f.z0); f.a1 = new Uint8ClampedArray(f.a0); f.g1 = new Float32Array(f.g0); if (th) f.th = new Float32Array(f.n).fill(9); }
function srf_blur(src, dst, tmp, w, h, r) {
  const d = 2 * r + 1;
  for (let y = 0; y < h; y++) { const o = y * w; let s = 0; for (let i = -r; i <= r; i++) s += src[o + Math.min(w - 1, Math.max(0, i))]; for (let x = 0; x < w; x++) { tmp[o + x] = s / d; s += src[o + Math.min(w - 1, x + r + 1)] - src[o + Math.max(0, x - r)]; } }
  for (let x = 0; x < w; x++) { let s = 0; for (let i = -r; i <= r; i++) s += tmp[Math.min(h - 1, Math.max(0, i)) * w + x]; for (let y = 0; y < h; y++) { dst[y * w + x] = s / d; s += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x]; } }
}
/** shade a field. lt = { p: [x, y, z] } a point light in field px (a studio light that can sweep), or { az, el } a far light
   (az 0 = from the right, π/2 = from the top); a cool fill light comes from the other side. k = the field's state.
   returns its canvas, kept while nothing changes */
function srf_shade(f, lt, k = 0) {
  const pt = lt.p, q = (pt ? 'p' + Math.round(pt[0] * 3) + ',' + Math.round(pt[1] * 3) + ',' + Math.round(pt[2] * 3) : 'd' + Math.round(lt.az * 600) + ',' + Math.round(lt.el * 600)) + ',' + Math.round(k * 1200);
  if (f.q === q && f.cv) return f.cv;
  const { w, h, n } = f, M = f.mat;
  if (!f.cv) { f.cv = document.createElement('canvas'); f.cv.width = w; f.cv.height = h; f.ctx = f.cv.getContext('2d'); f.img = f.ctx.createImageData(w, h); f.zz = new Float32Array(n); f.bl = new Float32Array(n); f.tm = new Float32Array(n); f.mm = new Float32Array(n); }
  const zz = f.zz, mm = f.mm, two = !!f.z1;
  if (two) { const ramp = f.ramp || 0.01; for (let p = 0; p < n; p++) { const m = f.th ? clamp((k - f.th[p]) / ramp) : k; mm[p] = m; zz[p] = f.z0[p] + (f.z1[p] - f.z0[p]) * m; } }
  else zz.set(f.z0);
  srf_blur(zz, f.bl, f.tm, w, h, M.aoR || 6);
  const el = pt ? 0.5 : lt.el, az = pt ? 0 : lt.az, ce = Math.cos(el);
  let Lx = ce * Math.cos(az), Ly = -ce * Math.sin(az), Lz = Math.sin(el);
  /* the fill: from the opposite side, high and cool */
  const fa = pt ? Math.atan2(-(pt[1] - h / 2), pt[0] - w / 2) + Math.PI : az + Math.PI, Fx = 0.55 * Math.cos(fa), Fy = -0.55 * Math.sin(fa), Fz = 0.83;
  const rz = M.rz || 1, amb = M.amb == null ? 0.16 : M.amb, kd = M.kd == null ? 1.05 : M.kd, ks = M.ks == null ? 0.55 : M.ks, sh = M.sh || 28, aoK = M.aoK == null ? 0.16 : M.aoK, kf = M.kf == null ? 0.2 : M.kf;
  const fall = M.fall || Math.max(w, h) * 0.85, d = f.img.data, a0 = f.a0, a1 = f.a1, g0 = f.g0, g1 = f.g1, bl = f.bl;
  for (let y = 0; y < h; y++) {
    const r0 = (y > 0 ? y - 1 : 0) * w, r1 = (y < h - 1 ? y + 1 : h - 1) * w, ro = y * w;
    for (let x = 0; x < w; x++) {
      const p = ro + x, dx = (zz[x < w - 1 ? p + 1 : p] - zz[x > 0 ? p - 1 : p]) * 0.5 * rz, dy = (zz[r1 + x] - zz[r0 + x]) * 0.5 * rz;
      const il = 1 / Math.sqrt(dx * dx + dy * dy + 1), nx = -dx * il, ny = -dy * il, nz = il;
      let I = 1;
      if (pt) { const lx = pt[0] - x, ly = pt[1] - y, lz = pt[2] - zz[p], dd = Math.sqrt(lx * lx + ly * ly + lz * lz); Lx = lx / dd; Ly = ly / dd; Lz = lz / dd; I = 1.5 / (1 + (dd / fall) * (dd / fall)); }
      let Hx = Lx, Hy = Ly, Hz = Lz + 1; const hl = 1 / Math.sqrt(Hx * Hx + Hy * Hy + Hz * Hz); Hx *= hl; Hy *= hl; Hz *= hl;
      const nl = nx * Lx + ny * Ly + nz * Lz, nf = nx * Fx + ny * Fy + nz * Fz, nh = nx * Hx + ny * Hy + nz * Hz, m = two ? mm[p] : 0;
      const gl = two ? g0[p] + (g1[p] - g0[p]) * m : g0[p];
      const sp = nh > 0 ? Math.pow(nh, sh) * ks * gl * 255 * I : 0;
      let ao = 1 + (zz[p] - bl[p]) * aoK; ao = ao < 0.4 ? 0.4 : ao > 1.3 ? 1.3 : ao;
      const key = kd * (nl > 0 ? nl : 0) * I, fill = kf * (nf > 0 ? nf : 0), i3 = p * 3, i4 = p * 4;
      const lr = (amb + key + fill * 0.85) * ao, lg = (amb + key * 0.98 + fill * 0.92) * ao, lb = (amb + key * 0.94 + fill * 1.05) * ao;
      if (two && m > 0) { d[i4] = (a0[i3] + (a1[i3] - a0[i3]) * m) * lr + sp; d[i4 + 1] = (a0[i3 + 1] + (a1[i3 + 1] - a0[i3 + 1]) * m) * lg + sp; d[i4 + 2] = (a0[i3 + 2] + (a1[i3 + 2] - a0[i3 + 2]) * m) * lb + sp; }
      else { d[i4] = a0[i3] * lr + sp; d[i4 + 1] = a0[i3 + 1] * lg + sp; d[i4 + 2] = a0[i3 + 2] * lb + sp; }
      d[i4 + 3] = 255;
    }
  }
  f.ctx.putImageData(f.img, 0, 0); f.q = q;
  return f.cv;
}
/** a field drawn into a rounded tile, filling it (cover). o = { light: { p } or { az, el } (default: a far light from the upper
   left), k, zoom (≥ 1, a push in), at: [u, v] (the centre, 0..1), r, alpha, vignette }. returns { map(fx, fy) → stage px, inv, sc } */
function srf_macro(t, f, x, y, w, h, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha;
  const z = Math.max(1, o.zoom || 1), [u, v] = o.at || [0.5, 0.5];
  const sc = Math.max(w / f.w, h / f.h) * z, sw = w / sc, sh = h / sc;
  const sx = clamp(u * f.w - sw / 2, 0, f.w - sw), sy = clamp(v * f.h - sh / 2, 0, f.h - sh);
  const out = { sc, sx, sy, map: (fx, fy) => [x + (fx - sx) * sc, y + (fy - sy) * sc], inv: (px, py) => [(px - x) / sc + sx, (py - y) / sc + sy] };
  if (a <= 0.003) return out;
  const cv = srf_shade(f, o.light || { az: o.az == null ? 2.5 : o.az, el: o.el == null ? 0.42 : o.el }, o.k || 0);
  G.save(); rrPath(x, y, w, h, o.r == null ? SRF.r : o.r); G.clip(); G.globalAlpha = a;
  G.imageSmoothingEnabled = true; G.imageSmoothingQuality = 'high';
  G.drawImage(cv, sx, sy, sw, sh, x, y, w, h);
  if (o.vignette !== false) { const g = G.createRadialGradient(x + w / 2, y + h * 0.45, Math.min(w, h) * 0.3, x + w / 2, y + h / 2, Math.hypot(w, h) * 0.6); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.55)'); G.fillStyle = g; G.fillRect(x, y, w, h); }
  G.restore();
  return out;
}
/** a studio light that sweeps once across a field (left to right, above its top edge), then drifts: a point light in field px */
function srf_sweep(t, f, t0 = 0.5, dur = 3.2, o = {}) {
  const k = ep(t, t0, t0 + dur, E.io3), drift = Math.sin(Math.max(0, t - t0 - dur) * 0.35) * 0.08;
  return { p: [f.w * (lerp(o.from == null ? -0.25 : o.from, o.to == null ? 0.62 : o.to, k) + drift), f.h * (o.y == null ? -0.35 : o.y), f.h * (o.z == null ? 0.42 : o.z)] };
}
/** the light's azimuth for a slide: it rakes in from the upper left and drifts slowly, so a still surface still moves */
const srf_az = (t, t0 = 0.4, base = 2.35) => base + 0.55 * (1 - ep(t, t0, t0 + 2.6, E.out3)) + 0.16 * Math.sin(Math.max(0, t - t0 - 2.6) * 0.42);

/** where a laser has cut at field px (x, y): [cut 0..1, rim 0..1]. Patterns: 'ridge' (grooves along ang), 'cross', 'chevron',
   'dots' (a hex lattice of dimples), 'none'. P = pitch, Wd = cut width, both in field px */
function srf_cut(pat, x, y, P, Wd, ang) {
  if (pat === 'none') return [0, 0];
  const ca = Math.cos(ang), sa = Math.sin(ang), across = -x * sa + y * ca, along = x * ca + y * sa;
  const g = c => { const q = ((c % P) + P) % P - P / 2, hw = Wd / 2, dd = Math.abs(q); return [dd < hw ? 1 - (dd / hw) * (dd / hw) : 0, Math.exp(-Math.pow((dd - hw) / (0.2 * Wd + 0.7), 2))]; };
  if (pat === 'ridge') return g(across);
  if (pat === 'cross') { const A = g(across), B = g(along); return [Math.max(A[0], B[0]), Math.max(A[1], B[1])]; }
  if (pat === 'chevron') { const L = P * 3.2, q = ((along % L) + L) % L; return g(across + Math.abs(q - L / 2) * 0.75); }
  if (pat === 'dots') {
    const py = P * 0.866, row = Math.round(y / py); let best = 1e9;
    for (let r = row - 1; r <= row + 1; r++) { const xo = (r & 1) ? P / 2 : 0, c = Math.round((x - xo) / P); for (let cc = c - 1; cc <= c + 1; cc++) best = Math.min(best, Math.hypot(x - (cc * P + xo), y - r * py)); }
    const hw = Wd / 2; return [best < hw ? 1 - (best / hw) * (best / hw) : 0, Math.exp(-Math.pow((best - hw) / (0.2 * Wd + 0.7), 2))];
  }
  return [0, 0];
}
/** a ceramic film, blasted then levelled, optionally laser-cut. o = { pat, pitch, width, depth, ang, col, ecol, seed, rough, mat } */
function srf_genFilm(f, o = {}) {
  const { w, h } = f, col = o.col || [25, 26, 30], ecol = o.ecol || [120, 122, 128], seed = o.seed || 3, D = o.depth == null ? 3 : o.depth, rough = o.rough == null ? 1 : o.rough;
  const ang = o.ang || 0, ca = Math.cos(ang), sa = Math.sin(ang), P = o.pitch || 20;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x, i = p * 3;
    /* the film: a soft orange peel over the blast, and a fine grain */
    let z = rough * (1.0 * srf_fbm(x / 44, y / 44, seed, 3) + 0.42 * srf_fbm(x / 8, y / 8, seed + 7, 2) + 0.16 * (srf_hash(x, y, seed + 3) - 0.5));
    /* the laser: a cut with steep walls and a flat floor, a beaded recast rim, pulse marks along the floor */
    const jx = 0.9 * srf_vn(x / 37, y / 37, seed + 21), [c0, rim] = srf_cut(o.pat || 'none', x + jx, y + jx, P, o.width || 9, ang);
    let c = c0 > 0 ? Math.min(1, c0 / 0.42) : 0; c = c * c * (3 - 2 * c);
    const along = x * ca + y * sa, pulse = 0.5 + 0.5 * Math.sin(along / 3.1 * TAU);
    z += -D * c * (0.92 + 0.08 * pulse) + 0.3 * D * rim * (1 - c) * (0.6 + 0.8 * Math.max(0, srf_vn(x / 3.4, y / 3.4, seed + 8)));
    if (o.bend) { const v2 = (y - h / 2) / (h / 2); z += o.bend * (1 - v2 * v2); }
    f.z0[p] = z;
    const sparkle = srf_hash(x, y, seed + 11) > 0.988, v = 5 * srf_vn(x / 3, y / 3, seed + 5);
    for (let j = 0; j < 3; j++) f.a0[i + j] = col[j] + v + (sparkle ? 26 : 0) + (ecol[j] - col[j]) * c * (0.78 + 0.22 * pulse);
    f.g0[p] = sparkle ? 1 : 0.34 * (1 - c) + 0.05;
  }
  Object.assign(f.mat, { amb: 0.14, kd: 1.1, ks: 0.6, sh: 26, rz: 1.35, aoR: 5, aoK: 0.24, kf: 0.22 }, o.mat || {});
}
/** a fingertip's contact patch seen from above, drawn as its print (abstract, not skin-coloured). (x, y) its centre, r px.
   o = { a, rot, stretch (a drag that stretches it along rot), col } */
function srf_tip(x, y, r, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const col = o.col || '#FFFFFF', st = o.stretch || 0;
  G.save(); G.globalAlpha = a; G.translate(x, y); G.rotate(o.rot || 0); G.scale(1 + st, 1 - st * 0.35);
  G.beginPath(); G.ellipse(0, 0, r, r * 0.8, 0, 0, TAU); G.fillStyle = rgba(col, 0.1); G.fill();
  G.save(); G.clip(); G.strokeStyle = rgba(col, 0.46); G.lineWidth = 1.6;
  for (let i = 1; i < 13; i++) { G.beginPath(); G.ellipse(r * 0.08, -r * 0.04, r * 0.085 * i, r * 0.07 * i, 0.25, 0, TAU); G.stroke(); }
  G.restore();
  G.beginPath(); G.ellipse(0, 0, r, r * 0.8, 0, 0, TAU); G.strokeStyle = rgba(col, 0.9); G.lineWidth = 2.2; G.stroke();
  G.restore();
}
/** friction by direction: the friction ellipse between μ along the ridges (a) and across them (b), at angle th from along */
const srf_mu = (a, b, th) => a * b / Math.sqrt(Math.pow(b * Math.cos(th), 2) + Math.pow(a * Math.sin(th), 2));
/* ============================== chapter card ============================== */
S({
  id: 'surfacecard', ch: 'surface', card: true, theme: 'night', title: 'Surface and details', settle: 5, three: ['shell'],
  draw: t => {
    /* the shell in the forged colourway (#12) turns slowly inside the iris */
    const cx = 1380, cy = 580, R = ep(t, 0.2, 1.4, E.cam) * 400;
    if (R > 6) {
      G.save(); G.beginPath(); G.arc(cx, cy, R - 3, 0, TAU); G.clip();
      view3D('shell', t, cx - 420, cy - 300, 840, 600, { view: 'threeQuarterRight', view2d: 'right', yaw: -0.25 + 0.22 * Math.sin(t * 0.32), zoom: in2D(1.42, 1.25), target: in2D([0, 19, 0], [0, 17, 2]), colorway: 'forged', xray: 0, explode: 0 }, { alpha: ep(t, 0.5, 1.3) });
      G.restore();
    }
    chapterCard(t, {
      name: 'surface', gloss: 'What your hand touches, and the small marks that make a mouse look finished.',
      list: [['#16', 'A baked ceramic coat, 19 µm thin'], ['#16', 'No added weight, no yellowing'], ['#60', 'Laser-etched directional grip'], ['#60', 'No adhesive, two tones in one coat'], ['#36', 'Your serial, lasered on the right click'], ['#34', 'Engravings half as deep'], ['#84', 'A magnesium wheel, a rover\'s tread'], ['Encoder', 'An optical encoder in TTC\'s form']]
    });
    figLabel(t, 2.2, 1040, 1000 - 22, 8, 'Forged colourway, satin clear over raw carbon');
  }
});

/* ============================== #16 bake the coating ============================== */
const srf_GRADES = ['7B', '6B', '5B', '4B', '3B', '2B', 'B', 'HB', 'F', 'H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H'];
S({
  id: 'coating', ch: 'surface', theme: 'paper', title: 'Baked ceramic coating', settle: 10, ideas: [16],
  src: ['srf_f110', 'cerakoteC', 'cerakoteH', 'srf_soft', 'srf_eloPmm', 'srf_fManual', 'srf_doc'],
  draw: t => {
    header(t, 'Baked ceramic coating');
    captions(t, [[0.6, 'A ceramic needs heat to reach its strength. Clay dried in air stays weak; the same clay fired in a kiln does not.'], [5.8, 'PMM\'s air-dried ceramic gripped well and wore. Cerakote\'s F-Series is baked: 9H on its test panels, against 3H air-cured.']]);
    /* left: dried in air or fired, and a pencil across both */
    const lx = LM, ly = 280, lw = 680, lh = 680, by = ly + 330, P1 = lx + 170, P2 = lx + lw - 170;
    demoWindow(lx, ly, lw, lh, tileA(t, 0.2, 0));
    const fire = ep(t, 1.2, 3.0);
    [[P1, 0], [P2, fire]].forEach(([px, f], i) => {
      const a = ep(t, 0.6 + i * 0.2, 1.1 + i * 0.2);
      if (i === 1 && t > 1.0) {
        /* the kiln: a bed of heat, the air shimmering above it while the pot fires */
        const hk = ep(t, 1.0, 1.4) * (1 - ep(t, 3.0, 3.8)), hc = heatCol(0.6);
        G.save(); G.globalAlpha = hk; const g = G.createRadialGradient(px, by + 4, 8, px, by + 4, 130); g.addColorStop(0, rgba(hc, 0.5)); g.addColorStop(1, rgba(hc, 0)); G.fillStyle = g; G.fillRect(px - 140, by - 120, 280, 140); G.restore();
        for (let k = 0; k < 5; k++) { const ph = (t * 0.7 + k / 5) % 1, xx = px - 56 + k * 28; G.save(); G.globalAlpha = hk * (1 - ph) * 0.7; G.strokeStyle = hc; G.lineWidth = 2; G.beginPath(); for (let s2 = 0; s2 <= 1; s2 += 0.1) G.lineTo(xx + 5 * Math.sin(s2 * 6 + t * 3 + k), by - 8 - ph * 140 - s2 * 30); G.stroke(); G.restore(); }
      }
      srf_pot(px, by, 170, f, a);
      line(px - 120, by + 2, px + 120, by + 2, { color: C.hair, w: 2, alpha: a });
      text(i ? 'Fired in a kiln' : 'Dried in air', px, ly + 80, { role: 'label', size: 22, color: C.ink, align: 'center', alpha: a });
    });
    /* the pencil test: a 4H lead marks the air-cured film (3H) and not the baked one (9H) */
    const loop = t >= 11 ? ((t - 11) % 7) / 7 : -1, pk = loop >= 0 ? env(loop, 0, 0.06, 0.62, 0.72) : env(t, 3.4, 3.7, 8.2, 8.6);
    const pc = loop >= 0 ? clamp(loop / 0.6) : clamp((t - 3.7) / 4.4);
    [[P1, 1], [P2, 0]].forEach(([px, marks], i) => {
      const u = clamp(pc * 2 - i), path = s2 => [px - 56 + 112 * E.io3(s2), by - 76 + 10 * Math.sin(s2 * Math.PI)];
      const done = loop >= 0 ? 1 : (i === 0 ? u : 0);
      if (marks && done > 0) { G.save(); G.globalAlpha = 0.9; G.strokeStyle = '#6C6B66'; G.lineWidth = 3; G.lineCap = 'round'; G.beginPath(); for (let s2 = 0; s2 <= done + 1e-6; s2 += 0.02) { const q = path(Math.min(s2, done)); G.lineTo(q[0], q[1]); } G.stroke(); G.restore(); }
      if (u > 0 && u < 1) { const q = path(u); srf_pencil(q[0], q[1], i ? '' : '4H', pk); }
      const kr = ep(t, 4.6 + i * 2.2, 5.0 + i * 2.2);
      text(marks ? '4H marks it' : '4H leaves no mark', px, by + 44, { role: 'label', size: 22, color: marks ? C.red : C.heroText, align: 'center', alpha: kr });
    });
    [['Air-cured C-299: 3H', P1, C.ink2], ['Baked F-Series: 9H', P2, C.heroText]].forEach(([s2, px, col], i) => text(s2, px, by + 82, { role: 'small', size: 25, weight: 800, color: col, align: 'center', alpha: ep(t, 5.2 + i * 0.3, 5.6 + i * 0.3) }));
    sourceBox(t, 6.2, lx + 40, ly + 500, lw - 80, 'EloShapes, PMM AIM 8K', 'PMM\'s air-dried ceramic "improves grip significantly". Brock: it wore.', { size: 25 });
    /* right: the glance, then the hardness ladder (harder is better) */
    const rx = 800;
    srf_hl(t, 1.0, rx, 448, '9H', { size: 150, label: 'Pencil hardness, baked', sub: 'Cerakote F-Series, on its test panels.', maxW: 460 });
    srf_ba(t, 5.4, 1320, 448, '3H', '9H', { size: 72, label: 'Air-dried → baked ceramic', net: '+6 grades harder' });
    pill(RM - pillW('datasheet', { by: 'Cerakote' }), 330, 'datasheet', ep(t, 1.4, 1.8), { by: 'Cerakote' });
    const gx0 = rx + 300, gw = RM - gx0 - 70, GX = i => gx0 + gw * i / 17, a0 = ep(t, 0.9, 1.4), y0 = 640, rg = 66, yb = y0 + 3 * rg + 34;
    srf_GRADES.forEach((g, i) => { line(GX(i), y0 - 30, GX(i), yb - 4, { color: C.hair, w: 1, alpha: a0 }); if (i % 2 === 1) text(g, GX(i), yb + 24, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: a0 }); });
    const rows = [['Soft-touch rubber', 'RadTech 2016', 0, 9, '7B–H'], ['Air-cured ceramic', 'Cerakote C-299', 0, 11, '3H'], ['Oven-cured, H-Series', 'Cerakote H-167', 0, 16, '8H'], ['Baked F-Series', 'Theseus\'s coat', 0, 17, '9H', true]];
    rows.forEach(([l, sub, b0, b, lab, hero], i) => {
      const y = y0 + i * rg, k = ep(t, 1.2 + i * 0.25, 2.0 + i * 0.25, E.snap), al = ep(t, 1.0 + i * 0.25, 1.4 + i * 0.25);
      if (hero) rect(rx, y - 26, 6, 56, { fill: C.hero, alpha: al });
      text(l, rx + (hero ? 22 : 0), y + 2, { role: 'small', size: 24, weight: hero ? 800 : 700, color: C.ink, alpha: al });
      text(sub, rx + (hero ? 22 : 0), y + 28, { role: 'label', size: 19, color: hero ? C.heroText : C.mute, alpha: al });
      rr(GX(b0), y - 9, Math.max(18, (GX(b) - GX(b0)) * k), 18, 9, hero ? C.hero : C.comp, null, 0, al);
      text(lab, Math.max(GX(b0) + 18, GX(b0) + (GX(b) - GX(b0)) * k) + 14, y + 9, { font: 'disp', size: 26, weight: 800, color: hero ? C.heroText : C.ink2, alpha: ep(t, 1.8 + i * 0.25, 2.2 + i * 0.25), tnum: true });
    });
    srf_better(t, 2.4, RM, yb + 64, 'Harder is better', 'r', { align: 'right' });
    text('Pencil grades, ASTM D3363, on steel', gx0, yb + 64, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 2.4, 2.8) });
  }
});

/* ============================== #60 directional grip: anisotropic friction ============================== */
/** the drag on the grip slide, in the macro tile B = [x, y, w, h]: across the ridges, along them, then a full turn.
   returns { p (the pointer), dir (the direction of motion, screen radians), mv (0..1, moving), ph ('in'|'across'|'along'|'turn'|'rest'), turn (0..1) } */
function srf_gripPath(t, B) {
  const [x, y, w, h] = B, S = [x + w * 0.3, y + h * 0.25], D = [x + w * 0.3, y + h * 0.75], E2 = [x + w * 0.68, y + h * 0.75], Cc = [x + w * 0.56, y + h * 0.5], rad = h * 0.25;
  const Q0 = [Cc[0] + rad, Cc[1]], L = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  if (t < 2.4) return { p: L([x + w * 0.62, y + h * 0.06], S, ep(t, 1.7, 2.3, E.cam)), dir: Math.PI / 2, mv: 0, ph: 'in', turn: 0 };
  if (t < 4.4) { const k = ep(t, 2.5, 4.3); return { p: L(S, D, k), dir: Math.PI / 2, mv: k > 0 && k < 1 ? 1 : 0, ph: 'across', turn: 0 }; }
  if (t < 6.6) { const k = ep(t, 4.7, 6.5); return { p: L(D, E2, k), dir: 0, mv: k > 0 && k < 1 ? 1 : 0, ph: t < 4.7 ? 'across' : 'along', turn: 0 }; }
  if (t < 7.3) { const k = ep(t, 6.7, 7.3); return { p: L(E2, Q0, k), dir: Math.atan2(Q0[1] - E2[1], Q0[0] - E2[0]), mv: 0, ph: 'along', turn: 0 }; }
  const k = ep(t, 7.3, 10.3, E.io3), ps = TAU * k;
  return { p: [Cc[0] + rad * Math.cos(ps), Cc[1] + rad * Math.sin(ps)], dir: ps + Math.PI / 2, mv: k > 0 && k < 1 ? 1 : 0, ph: k < 1 ? 'turn' : 'rest', turn: k };
}
const SRF_MU = { along: 0.42, across: 0.53 };   /* Zhang 2017, fingertip at 1 N on laser grooves 20 µm wide, 10 µm deep */
S({
  id: 'grip', ch: 'surface', theme: 'paper', title: 'Directional grip', settle: 11.5, ideas: [60],
  src: ['srf_zhang17', 'srf_f110', 'srf_doc'],
  draw: t => {
    header(t, 'Directional grip');
    captions(t, [[0.6, 'Laser-etched grooves hold a fingertip hardest when it slides across them, and let it glide along them.'], [6.4, 'Grip tape grips the same every way. An etch grips one way and leaves every other way free.']]);
    const B = [LM, 280, 1120, 560], [mx, top, mw, mh] = B, W1 = 'rgba(255,255,255,0.88)', W2 = 'rgba(255,255,255,0.6)';
    /* the simulation: laser-cut grooves in the coat under a sweeping light; the pointer drags a fingertip across, along, round */
    demoWindow(mx, top, mw, mh, tileA(t, 0.2, 0), { r: SRF.r });
    const f = srf_field('grip:ridge', 1000, 450, ff => srf_genFilm(ff, { pat: 'ridge', pitch: 40, width: 22, depth: 6, ang: 0, seed: 5, bend: 120 }));
    srf_macro(t, f, mx, top, mw, mh, { light: srf_sweep(t, f, 0.5, 3.4), zoom: 1 + 0.06 * ep(t, 0.5, 11.5, E.io3), alpha: ep(t, 0.35, 1.1) });
    text('Laser-cut grooves, 10 µm deep, inside the 19 µm coat (magnified)', mx + 32, top + mh - 30, { role: 'small', size: 24, weight: 600, color: W2, alpha: ep(t, 1.0, 1.4) });
    const gp = srf_gripPath(t, [mx, top, mw * 0.78, mh]), th = gp.dir, mu = srf_mu(SRF_MU.along, SRF_MU.across, th), ux = Math.cos(th), uy = Math.sin(th);
    const lag = gp.mv * (8 + 18 * mu), tp = [gp.p[0] - ux * lag, gp.p[1] - uy * lag];
    G.save(); rrPath(mx, top, mw, mh, SRF.r); G.clip();
    srf_tip(tp[0], tp[1], 58, { a: ep(t, 1.9, 2.3), rot: th, stretch: gp.mv * 0.05 * mu / 0.5 });
    if (gp.mv > 0) { const L = 104 * mu / 0.5; arrow(tp[0] - ux * 64, tp[1] - uy * 64, tp[0] - ux * (64 + L), tp[1] - uy * (64 + L), { color: C.hero, w: 5, hs: 18, alpha: 0.95 }); }
    cursorPtr(gp.p[0] + 6, gp.p[1] + 6, { a: ep(t, 1.6, 1.9) * (1 - ep(t, 10.6, 11.0)), grab: gp.mv > 0, fill: '#FFFFFF', edge: '#111111' });
    G.restore();
    /* the live reading, top left of the tile */
    const kr = ep(t, 2.5, 2.9), live = gp.ph === 'across' ? SRF_MU.across : gp.ph === 'along' ? SRF_MU.along : gp.ph === 'turn' ? mu : null;
    if (live != null) {
      rich([{ s: 'μ', role: 'stat', size: 64, color: W1 }, { s: live.toFixed(2), role: 'stat', size: 64, color: '#FFFFFF', gap: 12, tnum: true }], mx + 32, top + 92, { alpha: kr });
      text(gp.ph === 'across' ? 'Across the ridges' : gp.ph === 'along' ? 'Along the ridges' : 'Turning', mx + 32, top + 130, { role: 'label', size: 21, color: W2, alpha: kr });
    }
    /* friction by direction, over the tile's right side: tape is a circle, the etch reaches out across the ridges */
    /* each curve is drawn against its own glide direction (along = 1), so tape is a circle and the etch reaches past it across */
    const pc = [mx + mw - 200, top + mh / 2 + 20], R = 110, RA = 160, fine = { a: 1, b: SRF_MU.across / SRF_MU.along }, kp = ep(t, 0.8, 1.4);
    if (kp > 0.003) {
      G.save(); G.globalAlpha = kp;
      circle(pc[0], pc[1], R * 0.5, { color: 'rgba(255,255,255,0.18)', w: 1.5 });
      line(pc[0] - RA, pc[1], pc[0] + 188, pc[1], { color: 'rgba(255,255,255,0.22)', w: 1.5 }); line(pc[0], pc[1] - RA, pc[0], pc[1] + RA, { color: 'rgba(255,255,255,0.22)', w: 1.5 });
      text('Along', pc[0] + 188, pc[1] + 28, { role: 'label', size: 19, color: W2, align: 'right' });
      text('Across', pc[0] + 10, pc[1] - RA + 14, { role: 'label', size: 19, color: W2 });
      G.restore();
      const curve = (c, col, w, p, th0, cw) => { if (p <= 0) return; G.save(); G.globalAlpha = kp; G.beginPath(); for (let i = 0; i <= 120 * p; i++) { const a2 = th0 + (cw ? -1 : 1) * TAU * i / 120, r = srf_mu(c.a, c.b, a2) * R; const q = [pc[0] + r * Math.cos(a2), pc[1] - r * Math.sin(a2)]; i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]); } G.strokeStyle = col; G.lineWidth = w; G.lineJoin = 'round'; G.stroke(); G.restore(); };
      curve({ a: 1, b: 1 }, C.second, 3, 1, 0, false);
      curve(fine, C.hero, 5, gp.ph === 'turn' ? gp.turn : gp.ph === 'rest' ? 1 : 0, -(Math.PI / 2), true);
      if (live != null) { const r = srf_mu(fine.a, fine.b, th) * R, q = [pc[0] + r * ux, pc[1] + r * uy]; line(pc[0], pc[1], q[0], q[1], { color: C.hero, w: 2.5, alpha: kr }); circle(q[0], q[1], 7, { fill: C.hero, alpha: kr }); }
      [[C.hero, 'Etched grooves', 0.9], [C.second, 'Grip tape', 0.9]].forEach(([c, nm, t0], i) => { const k = ep(t, t0, t0 + 0.4), yy = top + 52 + i * 34; line(pc[0] - 40, yy - 7, pc[0] - 10, yy - 7, { color: c, w: 4, alpha: k }); text(nm, pc[0] + 2, yy, { role: 'label', size: 19, color: W1, alpha: k }); });
      text('Friction by direction', pc[0], pc[1] + RA + 34, { role: 'label', size: 19, color: W2, align: 'center', alpha: kp });
    }
    /* the glance: by how much, and the before → after */
    const rx = 1240;
    srf_hl(t, 1.0, rx, 448, '+26 %', { size: 150, label: 'Grip across against along', sub: 'Grip where you push, glide where you slide.', maxW: 600 });
    srf_ba(t, 2.4, rx, 650, '0.42', '0.53', { size: 64, label: 'Fingertip friction, μ', who: ['Along the ridges', 'Across'] });
    pill(RM - pillW('study', { by: 'Zhang 2017' }), 580, 'study', ep(t, 2.6, 3.0), { by: 'Zhang 2017' });
    glossBox(t, 3.4, rx, 760, RM - rx, 'Anisotropic friction', 'Friction that depends on the direction of the slide.');
  }
});

/* ============================== #36 #62 #61 #33 #32 the marks ============================== */
S({
  id: 'srf_marks', ch: 'surface', theme: 'paper', title: 'Laser-marked details', settle: 10, ideas: [36, 62, 61, 33, 32], three: ['shell', 'shell-sora'],
  src: ['srf_doc', 'ulxComp', 'gmk', 'srf_scan'],
  draw: t => {
    header(t, 'Laser-marked details');
    captions(t, [[0.6, 'Every mark is lasered after moulding, so it cuts no groove into the wall, and a new colourway is a new file, not a new tool.'], [5.6, 'And none of them sits where a fingertip rests: the serial at the back of the right click, the legends at the front corners.']]);
    const base = { colorway: 'black', xray: 0, explode: 0 };
    /* left: the top view, the Sora base wiping into Theseus */
    const lx = LM, ly = LAY.top, lw = 700, lh = 580, tv = Object.assign({ view: [0, 1, -0.15], fov: 10, zoom: 1.2, target: [0, 19, 0] }, base);
    demoWindow(lx, ly, lw, lh, ep(t, 0.3, 0.7));
    const wp = ep(t, 1.0, 3.2, E.io3), wx = lx + lw * wp;
    if (wp < 1) srf_3d(t, 0.4, 'shell-sora', lx, ly, lw, lh, tv);
    if (wp > 0) { G.save(); G.beginPath(); G.rect(lx, ly, wx - lx, lh); G.clip(); srf_3d(t, 0.4, 'shell', lx, ly, lw, lh, tv); G.restore(); }
    if (wp > 0 && wp < 1) {
      line(wx, ly + 8, wx, ly + lh - 8, { color: C.ink, w: 2 });
      rich([{ s: 'Theseus', role: 'label', size: 21, color: C.onHero, chip: C.heroChip }], wx - 14, ly + 50, { align: 'right' });
      text('Sora V2 base', wx + 14, ly + 50, { role: 'label', size: 21, color: C.mute });
    }
    const pj = srf_proj(lx, ly, lw, lh, tv, 71.4), kz = ep(t, 3.4, 3.9);
    if (kz > 0) {
      /* where the fingertips rest: the trigger centres (#32) */
      for (const sx of [1, -1]) {
        const c = pj(sx * 13, 23, 36), e1 = pj(sx * 13, 23, 50), e2 = pj(sx * 13 + 8.5, 23, 36);
        G.save(); G.globalAlpha = kz; G.setLineDash([7, 6]); G.strokeStyle = acc(); G.lineWidth = 2.5; G.beginPath(); G.ellipse(c[0], c[1], Math.abs(e2[0] - c[0]), Math.abs(e1[1] - c[1]), 0, 0, TAU); G.stroke(); G.setLineDash([]); G.fillStyle = rgba(acc(), 0.12); G.fill(); G.restore();
      }
      const fa = pj(13, 23, 36), fr = Math.abs(pj(21.5, 23, 36)[0] - fa[0]);
      callout(t, 3.6, [fa[0] - fr, fa[1]], 'Fingertips', { to: [fa[0] - fr - 44, fa[1] + 70], side: 'l', color: acc(), tcolor: acc(), sub: 'Rest here' });
    }
    const pS = pj(-15.9, 31, 13.5), pL = pj(19.2, 14.8, 50.5), pR = pj(-19.2, 14.8, 50.5);
    callout(t, 4.0, [pS[0] + 4, pS[1] + 10], 'Serial (#36)', { to: [pS[0] + 56, ly + lh - 90], side: 'r', color: C.ink, elbow: pS[0] + 24 });
    callout(t, 4.3, [pL[0], pL[1] - 6], 'LT (#62)', { to: [pL[0] - 44, ly + 70], side: 'l', color: C.ink, elbow: pL[0] - 12 });
    callout(t, 4.5, [pR[0], pR[1] - 6], 'RT (#62)', { to: [pR[0] + 44, ly + 70], side: 'r', color: C.ink, elbow: pR[0] + 12 });
    /* right top: the serial up close, a laser spot running over it */
    const sx0 = 810, sw = 600, sh = 300, sv = Object.assign({ view: [0, 1, -0.15], fov: 10, zoom: 6.2, target: [-15.9, 31, 14.0] }, base);
    demoWindow(sx0, ly, sw, sh, ep(t, 0.6, 1.0));
    srf_3d(t, 0.7, 'shell', sx0, ly, sw, sh, sv);
    const ps = srf_proj(sx0, ly, sw, sh, sv, 71.4), d0 = ps(-7.7, 31, 13.5), d1 = ps(-24.2, 31, 13.5), lz = (t >= 3.6 && t < 5.4) ? (t - 3.6) / 1.8 : (t >= 11 ? (((t - 11) % 8) < 1.8 ? ((t - 11) % 8) / 1.8 : -1) : -1);
    if (lz >= 0) {
      const lxp = lerp(Math.min(d0[0], d1[0]) - 6, Math.max(d0[0], d1[0]) + 6, E.io3(lz)), lyp = (d0[1] + d1[1]) / 2 + 22 * Math.sin(lz * 34);
      line(lxp, ly + 6, lxp, lyp, { color: rgba(acc(), 0.5), w: 2 });
      glow(lxp, lyp, 26, acc(), 0.55); circle(lxp, lyp, 4, { fill: '#ffffff' });
    }
    rr(sx0 + 18, ly + 18, 300, 40, 8, rgba('#FFFFFF', 0.86), null, 0, ep(t, 1.0, 1.4));
    text('Serial, right click', sx0 + 32, ly + 46, { role: 'label', size: 21, color: C.ink, alpha: ep(t, 1.0, 1.4) });
    const nw = tw('3 digits, 6.4 mm tall', { role: 'label', size: 19 }), kn = ep(t, 4.6, 5.0);
    rr(sx0 + sw - 34 - nw, ly + sh - 50, nw + 24, 38, 8, rgba('#FFFFFF', 0.86), null, 0, kn);
    text('3 digits, 6.4 mm tall', sx0 + sw - 22, ly + sh - 24, { role: 'label', size: 19, color: '#2E2E2C', align: 'right', alpha: kn });
    /* right top: the side mark, wiped in, then carried through every colourway */
    const mx0 = 1434, mw = RM - mx0, cyc0 = t >= 7 ? Math.floor((t - 7) / 1.6) % 4 : -1, cws = ['white', 'grey', 'forged', 'black'], cw = cyc0 < 0 ? 'black' : cws[cyc0];
    const mv = Object.assign({}, base, { view: 'right', fov: 10, zoom: 6.4, target: [29, 11.6, 40.5], colorway: cw });
    demoWindow(mx0, ly, mw, sh, ep(t, 0.9, 1.3));
    const mwp = ep(t, 4.6, 5.8, E.io3), mxw = mx0 + mw * mwp;
    if (mwp < 1) srf_3d(t, 1.0, 'shell-sora', mx0, ly, mw, sh, Object.assign({}, mv, { colorway: 'black' }));
    if (mwp > 0) { G.save(); G.beginPath(); G.rect(mx0, ly, mxw - mx0, sh); G.clip(); srf_3d(t, 1.0, 'shell', mx0, ly, mw, sh, mv); G.restore(); }
    if (mwp > 0 && mwp < 1) line(mxw, ly + 8, mxw, ly + sh - 8, { color: C.ink, w: 2 });
    rr(mx0 + 18, ly + 18, 220, 40, 8, rgba('#FFFFFF', 0.86), null, 0, ep(t, 1.3, 1.7));
    text('Side mark', mx0 + 32, ly + 46, { role: 'label', size: 21, color: C.ink, alpha: ep(t, 1.3, 1.7) });
    if (cyc0 >= 0) text(caps(cw) + ' colourway', mx0 + mw - 22, ly + sh - 22, { role: 'label', size: 19, color: cw === 'white' || cw === 'grey' ? C.ink : C.ink2, align: 'right' });
    /* right bottom: the step further, as a table */
    const ty = ly + sh + 24, th = LAY.bottom - ty;
    demoWindow(sx0, ty, RM - sx0, th, ep(t, 4.8, 5.2));
    compareTable(t, { x: sx0 + 26, y: ty + 46, w: RM - sx0 - 52, t0: 5.0, rowH: 82,
      cols: [{ key: 'm', label: 'Mark', w: 0.62 }, { key: 'b', label: 'Best today', w: 1.5, mono: false }, { key: 'th', label: 'Theseus', w: 1.5, mono: false, hero: true }],
      rows: [{ cells: { m: 'Serial', b: 'ULX Competition: a run of 10,000 numbered units', th: 'Three digits, lasered big on the right click' }, ev: { th: 'proposal' } },
        { cells: { m: 'Side mark', b: 'Waizowl Triaina: side engravings (per Brock)', th: 'A lasered mark per colourway, same mould' }, ev: { th: 'proposal' } }] });
    gloss(t, 6.6, 'Laser marking', 'A laser changes the colour or texture of the surface itself. A moulded engraving is a groove cut into the tool, and into every shell it makes.');
    featureCard(t, 7.0, 'Lasered marks, off the finger rests', ['proposal'], 'Serial (#36), LT and RT legends (#62), a side mark that can change per colourway (#61, #33), none on the trigger centres (#32).');
  }
});

/* ============================== #34 #82 engravings and gates ============================== */
S({
  id: 'details', ch: 'surface', theme: 'night', title: 'Engrave half as deep', settle: 10, ideas: [34, 82],
  src: ['inglis', 'fracMech', 'vernier', 'srf_doc'],
  draw: t => {
    header(t, 'Engrave half as deep');
    captions(t, [[0.6, 'An engraving is a notch, and a notch multiplies stress at its tip. Half the depth takes the peak from 5 times the wall\'s stress to 3.8.'], [5.4, 'The eye is sharper still at edges: it catches a step of 0.012 mm. So the gate mark goes on a face you never see.']]);
    const A = acc(), lx = LM, ly = 280, lw = 1080, lh = 680, rho = 0.15;
    demoWindow(lx, ly, lw, lh, tileA(t, 0.2, 0));
    text('A notch in a 1.6 mm wall, under load', lx + 40, ly + 56, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 0.4, 0.8) });
    pill(lx + lw - 40 - pillW('derived'), ly + 56, 'derived', ep(t, 0.6, 1.0));
    /* the notch: 0.6 mm deep, then half that; it breathes back and forth after the slide has settled */
    const a = t < 11 ? lerp(0.6, 0.3, ep(t, 3.2, 4.4, E.io3)) : lerp(0.3, 0.6, 0.5 - 0.5 * Math.cos((t - 11) * TAU / 8)), kt = 1 + 2 * Math.sqrt(a / rho), sN = 50, nx = lx + (lw - 18 * sN) / 2, ny = ly + 116;
    part(nx, ny, sN, () => notchMM({ depth: a, rho, accent: A }), { alpha: ep(t, 0.4, 0.9) });
    for (const dx of [0, 1]) { const x = dx ? nx + 18 * sN + 12 : nx - 12; arrow(x, ny + 40, x + (dx ? 44 : -44), ny + 40, { color: C.ink2, w: 3, hs: 11, alpha: ep(t, 1.0, 1.4) }); }
    text(`Depth ${a.toFixed(2)} mm, tip radius ${rho} mm`, nx, ny + 132, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    text('{Kt = 1 + 2√(a/ρ)}', nx + 18 * sN, ny + 132, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: ep(t, 1.2, 1.6) });
    /* the chart: peak stress against depth, lower is better */
    const m = axes(t, { x: lx + 150, y: ly + 330, w: lw - 260, h: 220, xr: [0, 0.8], yr: [1, 6], xticks: [0, 0.2, 0.4, 0.6, 0.8], yticks: [1, 2, 3, 4, 5, 6], xfmt: v => v.toFixed(1) + ' mm', yfmt: v => v + '×', xlabel: 'Engraving depth', ylabel: 'Peak experienced stress, × the wall\'s (lower is better)', t0: 1.6 });
    const pts = []; for (let d = 0; d <= 0.8; d += 0.01) pts.push([d, 1 + 2 * Math.sqrt(d / rho)]);
    series(m, pts, { color: C.ink2, w: 3, p: ep(t, 2.0, 3.0, E.lin) });
    for (const [d, col, t0] of [[0.6, C.red, 3.0], [0.3, C.hero, 4.4]]) { const k = ep(t, t0, t0 + 0.4), v = 1 + 2 * Math.sqrt(d / rho); circle(m.X(d), m.Y(v), 9, { fill: col, alpha: k }); text(v.toFixed(2) + '×', m.X(d) + 16, m.Y(v) + (d < 0.5 ? 30 : -14), { font: 'disp', size: 26, weight: 800, color: d < 0.5 ? C.heroText : C.red, alpha: k }); }
    circle(m.X(a), m.Y(kt), 14, { color: C.ink, w: 1.5, alpha: ep(t, 3.0, 3.4) * 0.6 });
    /* the glance */
    const rx = 1200;
    srf_hl(t, 1.0, rx, 448, '−23 %', { size: 150, label: 'Peak experienced stress', sub: 'Half the depth, the same 0.15 mm tip.', maxW: RM - rx });
    srf_ba(t, 4.4, rx, 640, '5.00×', '3.83×', { size: 64, label: 'Peak, lower is better' });
    /* the gate mark (#82): hidden, not shrunk */
    const gy = 720, gh = 240; demoWindow(rx, gy, RM - rx, gh, tileA(t, 5.2, 1));
    const kg = ep(t, 5.4, 5.8), ex0 = rx + 32, ex1 = rx + 420, ey = gy + 92, st = 0.012 * 400;
    text('Gate marks: hidden, not shrunk', rx + 32, gy + 48, { role: 'label', size: 21, color: C.ink, alpha: kg });
    line(ex0, ey, (ex0 + ex1) / 2, ey, { color: C.ink, w: 3, alpha: kg }); line((ex0 + ex1) / 2, ey + st, ex1, ey + st, { color: C.ink, w: 3, alpha: kg });
    text('A 0.012 mm step, drawn 400×', ex0, ey + 40, { role: 'label', size: 19, color: C.mute, alpha: kg });
    text('The eye sees it at 50 cm, so the gate goes where no eye looks.', rx + 32, gy + 178, { role: 'small', size: 25, weight: 600, color: C.ink2, maxW: 400, lh: 1.3, alpha: ep(t, 5.8, 6.2) });
    keyPlan(t, 5.6, RM - 80, gy + 124, { s: 0.36, hi: ['trigL', 'trigR'], detail: { x: -13, y: -36, r: 9 }, label: 'Not here' });
  }
});

/* ============================== #84 #30 a magnesium wheel with a rover's tread ============================== */
/** one strip of tread, unrolled: n grousers round the wheel, `kind` 'chevron' or 'curve', scrolled by off (0..1 of a pitch) */
function srf_tread(x, y, w, h, n, kind, off, col, a) {
  if (a <= 0.003) return;
  const pitch = w / (n / 4);   /* a quarter of the wheel shows */
  G.save(); G.globalAlpha = a; rrPath(x, y, w, h, 6); G.clip();
  G.fillStyle = TH ? '#E2E1DC' : '#25262A'; G.fillRect(x, y, w, h);
  G.strokeStyle = col; G.lineWidth = kind === 'chevron' ? 5 : 4; G.lineCap = 'round';
  for (let i = -2; i < n / 4 + 2; i++) {
    const x0 = x + (i + off) * pitch;
    G.beginPath();
    if (kind === 'chevron') { G.moveTo(x0, y + 6); G.lineTo(x0 + pitch * 0.42, y + h / 2); G.lineTo(x0, y + h - 6); }
    else { G.moveTo(x0, y + 6); G.quadraticCurveTo(x0 + pitch * 0.32, y + h / 2, x0, y + h - 6); }
    G.stroke();
  }
  G.restore();
  rr(x, y, w, h, 6, null, inkA(0.25), 1.2, a);
}
S({
  id: 'wheel', ch: 'surface', theme: 'paper', title: 'Magnesium, with a rover\'s tread', settle: 10, ideas: [84, 30], three: ['wheel'],
  src: ['srf_register', 'curiosity', 'srf_wheel3d', 'srf_az31b', 'srf_al6061', 'srf_ss304', 'srf_doc'],
  draw: t => {
    header(t, 'Magnesium, with a rover\'s tread');
    captions(t, [[0.6, 'Magnesium is the lightest metal for the wheel: the same wheel in aluminium weighs 53 % more, in stainless steel four times as much.'], [5.6, 'Curiosity\'s 24 chevron treads cracked on sharp rock. Perseverance rolls on 48 gently curved ones, and so does this wheel.']]);
    const lx = LM, ly = 280, lw = 900, lh = 680;
    demoWindow(lx, ly, lw, lh, tileA(t, 0.2, 0));
    const wv = { view: [0.55, 0.45, 0.9], zoom: 1.75, scroll: 0.22 * t, xray: 0, explode: 0.3 * env(t, 1.6, 2.6, 4.2, 5.2) };
    const pt = { g: [lx + 520, ly + 180], sp: [lx + 470, ly + 360], cr: [lx + 400, ly + 250], ax: [lx + 560, ly + 300] };
    if (V2D.on) {
      /* two views of one wheel: from the side (the spokes and the treads, turning) and from the front (the crown, the axle) */
      const sb = [lx + 24, ly + 80, 380, 396], fb = [lx + 396, ly + 80, 236, 396];
      const sv = Object.assign({}, wv, { view2d: 'right', zoom: 1.34, target: [0, 11, 0], explode: 0, hide2d: /encoder|support/ }), fv = Object.assign({}, wv, { view2d: 'front', zoom: 1.32, target: [-1.85, 11, 0] });
      srf_3d(t, 0.4, 'wheel', sb[0], sb[1], sb[2], sb[3], sv);
      srf_3d(t, 0.6, 'wheel', fb[0], fb[1], fb[2], fb[3], fv);
      const k = ep(t, 0.6, 1.0);
      text('Side', sb[0] + sb[2] / 2, sb[1] + sb[3] + 22, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: k });
      text('Front', fb[0] + fb[2] / 2, fb[1] + fb[3] + 22, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: k });
      pt.g = v2dAt('wheel', sv, sb, /wheel\/grousers$/, [0.5, 1, 0.5]) || pt.g; pt.sp = v2dAt('wheel', sv, sb, /wheel\/web$/, [0.5, 0.3, 0.5]) || pt.sp;
      pt.cr = v2dAt('wheel', fv, fb, /wheel\/tread$/, [0.5, 1, 0.5]) || pt.cr; pt.ax = v2dAt('wheel', fv, fb, /axle\/axleR$/, [0.5, 0.5, 0.5]) || pt.ax;
    } else {
      const box = [lx, ly, lw, 500], drawn = srf_3d(t, 0.4, 'wheel', box[0], box[1], box[2], box[3], wv);
      pt.g = srf_at3('wheel', wv, box, drawn, /wheel\/grousers$/, [0.5, 0.62, 1]) || pt.g; pt.sp = srf_at3('wheel', wv, box, drawn, /wheel\/web$/, [0.5, 0.3, 0.6]) || pt.sp;
      pt.cr = srf_at3('wheel', wv, box, drawn, /wheel\/tread$/, [0.62, 0.86, 0.9]) || pt.cr; pt.ax = srf_at3('wheel', wv, box, drawn, /axle\/axleR$/, [0.5, 0.5, 0.5]) || pt.ax;
    }
    rich([{ s: 'Fig. 01', role: 'label', size: 21, color: C.mute }, { s: V2D.on ? 'Magnesium wheel and POM axle, two views' : 'Magnesium wheel, POM axle, optical encoder (render)', role: 'small', size: 24, weight: 600, color: C.faint, gap: 16 }], lx + 26, ly + 46, { alpha: ep(t, 0.6, 1.0) });
    callout(t, 2.0, pt.g, '48 curved grousers', { to: [lx + 596, ly + 120], side: 'r', color: C.ink });
    callout(t, 2.4, pt.sp, 'Six spokes', { to: [lx + 660, ly + 420], side: 'r', color: C.ink, sub: 'Triangular windows' });
    callout(t, 2.8, pt.cr, 'Crown, R 11 mm both ways', { to: [lx + 660, ly + 220], side: 'r', color: C.ink, prose: true, maxW: 220 });
    callout(t, 3.2, pt.ax, 'POM axle', { to: [lx + 660, ly + 330], side: 'r', color: C.ink });
    /* rover treads, unrolled, along the foot of the tile */
    const sx = lx + 250, swd = lw - 290, rowsT = [['Curiosity', '24 chevrons', 24, 'chevron', C.comp], ['Perseverance', '48 curved', 48, 'curve', C.ink2], ['Theseus wheel', '48 curved', 48, 'curve', C.hero]];
    rowsT.forEach(([nm, sub, n, kind, col], i) => {
      const y = ly + 532 + i * 50, a = ep(t, 5.6 + i * 0.3, 6.0 + i * 0.3);
      text(nm, lx + 32, y + 18, { role: 'small', size: 24, weight: i === 2 ? 800 : 700, color: C.ink, alpha: a });
      text(sub, lx + 32, y + 40, { role: 'label', size: 19, color: i === 2 ? C.heroText : C.mute, alpha: a });
      srf_tread(sx, y, swd, 40, n, kind, (t * 0.35) % 1, i === 2 ? C.hero : col, a);
    });
    /* the glance: the weight against aluminium, before → after, and the metals by weight */
    const rx = 1020, V = 0.825, mg = V * 1.77, al = V * 2.70;
    srf_hl(t, 1.0, rx, 448, '−34 %', { size: 150, label: 'Wheel weight against aluminium', sub: 'The same 825 mm³ wheel in each metal.', maxW: RM - rx });
    srf_ba(t, 2.2, rx, 650, fmtN(al, 2), fmtN(mg, 2), { size: 64, unit: 'g', label: 'Aluminium 6061 → magnesium AZ31B' });
    srf_bars(t, 2.8, { x: rx, y: 764, w: RM - rx, xr: [0, 7], labelW: 300, valW: 110, rowH: 46, dec: 2, unit: 'g', nsize: 24,
      rows: [['Magnesium AZ31B', 1.77, true], ['Aluminium 6061', 2.70], ['Stainless 304', 7.89]].map(([n, d, hero]) => ({ name: n, v: V * d, hero, label: fmtN(V * d, 2) + ' g' })) });
    srf_better(t, 3.4, rx, 916, 'Lower is better');
    pill(RM - pillW('derived'), 916, 'derived', ep(t, 3.4, 3.8));
  }
});

/* ============================== the optical encoder, in TTC's form ==============================
   Brock (F9.21): "optical encoders look no different than normal mouse encoders". Drawn after TTC's optical encoder and this
   deck's 3D model of it (scene 'wheel'): a black housing in a stamped steel frame, the axle 11 mm up, a 24-slot code disc of
   radius 4, a U-shaped light gate straddling its lower rim with windows A and B 1¼ slots apart (quadrature), five pins.
   Front view, mm: x = -Z, y = 11 - Y (down), origin the axle. The housing is drawn 0.6 mm taller than the model, as Brock says
   the real ones are ("usually they're a little taller"). */
/** wheel angle (rad) over time: up for 6 s, back down for 6 s */
const srf_scrollAt = t => { const p = ((t % 12) + 12) % 12; return 0.55 * (p < 6 ? p : 12 - p); };
const SRF_ENC = { slots: 24, rIn: 2.95, rOut: 3.72, rA: 3.38, wA: [0, 3.38], wB: [-1.09, 3.2] };
/** is light reaching window w (front-view mm from the axle) at wheel angle th? (a slot spans half a pitch) */
function srf_gate(w, th) { const P = TAU / SRF_ENC.slots, an = Math.atan2(w[1], w[0]) - th; return (((an % P) + P) % P) < P / 2; }
/** the encoder from the front with its face plate cut away. o = { th (wheel angle) }. Returns anchors in stage px */
function srf_encFront(o = {}) {
  const th = o.th || 0, out = {}, P = TAU / SRF_ENC.slots;
  const steel = TH ? '#C3C8CF' : '#A9AFB7', tin = TH ? '#B4B9C0' : '#9AA0A8', housing = TH ? '#2A2B30' : '#202125', cavity = TH ? '#141518' : '#0F1012';
  const disc = TH ? '#45474E' : '#3A3C43', hub = TH ? '#5A5C63' : '#4E5057', ec = TH ? 'rgba(10,10,12,0.85)' : 'rgba(236,235,231,0.42)';
  const fp = (f, col, st, w) => { f(); if (col) { G.fillStyle = col; G.fill('evenodd'); } if (st) { G.strokeStyle = st; G.lineWidth = lw(w || 1.1); G.lineJoin = 'round'; G.stroke(); } };
  /* five pins, and the frame's two bent legs */
  for (const px of [-2.5, -1.25, 0, 1.25, 2.5]) fp(() => { G.beginPath(); G.rect(px - 0.25, 10.9, 0.5, 2.3); }, tin, ec, 0.8);
  for (const sx of [-1, 1]) fp(() => { G.beginPath(); G.moveTo(sx * 4.3, 10.8); G.lineTo(sx * 5.45, 10.8); G.lineTo(sx * 5.45, 11.6); G.quadraticCurveTo(sx * 5.6, 12.7, sx * 6.45, 13.0); G.lineTo(sx * 6.15, 13.45); G.quadraticCurveTo(sx * 4.75, 13.0, sx * 4.3, 11.7); G.closePath(); }, steel, ec, 0.8);
  /* the black housing, open at the face: its walls round a dark cavity (the top corner chamfered, as on TTC's) */
  fp(() => { G.beginPath(); G.moveTo(-5.05, -4.6); G.lineTo(3.6, -4.6); G.lineTo(5.5, -2.7); G.lineTo(5.5, 11); G.lineTo(-5.5, 11); G.lineTo(-5.5, -4.15); G.quadraticCurveTo(-5.5, -4.6, -5.05, -4.6); G.closePath(); }, housing, ec, 1.1);
  fp(() => { G.beginPath(); G.moveTo(-4.95, -4.08); G.lineTo(3.4, -4.08); G.lineTo(4.95, -2.5); G.lineTo(4.95, 10.4); G.lineTo(-4.95, 10.4); G.closePath(); }, cavity, null);
  /* the steel face plate, cut away (a phantom), with its collar round the axle; its top tabs and side clips stay */
  G.save(); G.setLineDash([lw(6), lw(5)]); fp(() => { G.beginPath(); G.rect(-5.5, -4.6, 11, 15.6); G.moveTo(2.4, 0); G.arc(0, 0, 2.4, 0, TAU); }, null, rgba(steel, 0.6), 1.3); G.restore();
  for (const [x0, x1] of [[2.0, 3.6], [-1.9, -0.6]]) fp(() => { G.beginPath(); G.rect(x0, -5.05, x1 - x0, 0.55); }, steel, ec, 0.8);
  for (const sx of [-1, 1]) fp(() => { G.beginPath(); G.rect(sx > 0 ? 5.5 : -5.78, 2.2, 0.28, 1.5); }, steel, ec, 0.8);
  /* the code disc: 24 slots near its rim, turning with the wheel; a slot over a window passes the light */
  fp(() => { G.beginPath(); G.arc(0, 0, 4.0, 0, TAU); for (let i = 0; i < SRF_ENC.slots; i++) { const a0 = th + i * P, a1 = a0 + P / 2; G.moveTo(SRF_ENC.rOut * Math.cos(a0), SRF_ENC.rOut * Math.sin(a0)); G.arc(0, 0, SRF_ENC.rOut, a0, a1); G.lineTo(SRF_ENC.rIn * Math.cos(a1), SRF_ENC.rIn * Math.sin(a1)); G.arc(0, 0, SRF_ENC.rIn, a1, a0, true); G.closePath(); } }, disc, ec, 0.9);
  fp(() => { G.beginPath(); G.arc(0, 0, 1.65, 0, TAU); }, hub, ec, 1);
  fp(() => { G.beginPath(); G.arc(0, 0, 1.2, th - Math.PI * 0.8, th + Math.PI * 0.8); G.closePath(); }, TH ? '#D4D8DD' : '#B9BEC5', ec, 0.9);
  /* the light gate: a U holder straddling the rim (its near arm drawn see-through), the emitter in it */
  const hold = TH ? '#33353B' : '#2E3035';
  fp(() => { G.beginPath(); G.rect(-2.54, 4.4, 4.0, 0.55); }, hold, ec, 0.9);
  G.save(); G.globalAlpha = PA * 0.45; fp(() => pathRR(-2.54, 2.35, 4.0, 2.6, 0.22), hold, null); G.restore();
  fp(() => pathRR(-2.54, 2.35, 4.0, 2.6, 0.22), null, ec, 0.9);
  for (const w of [SRF_ENC.wA, SRF_ENC.wB]) if (srf_gate(w, th)) { G.beginPath(); G.arc(w[0], w[1], 0.34, 0, TAU); G.fillStyle = rgba(C.hero, 0.95); G.fill(); G.beginPath(); G.arc(w[0], w[1], 0.62, 0, TAU); G.fillStyle = rgba(C.hero, 0.25); G.fill(); }
  out.disc = SP(4.0 * Math.cos(-2.4), 4.0 * Math.sin(-2.4)); out.axle = SP(-0.5, -0.9); out.frame = SP(-5.64, 2.95); out.pins = SP(-2.5, 12.6);
  out.gate = SP(-0.54, 3.4); out.top = SP(0, -5.05); out.base = SP(0, 13.45); out.s = SP(1, 0)[0] - SP(0, 0)[0];
  return out;
}
/** the light gate, magnified and unrolled: the emitter above, the slotted rim, the two windows (A, B) below, and their
   signals over the last few seconds. (x, y, w, h) its box; th(tt) the wheel angle at slide time tt */
function srf_gateDetail(t, x, y, w, h, thAt, a) {
  if (a <= 0.003) return;
  const M = 56, P = SRF_ENC.rA * TAU / SRF_ENC.slots, th = thAt(t), cx = x + w / 2;
  const sA = SRF_ENC.rA * Math.atan2(SRF_ENC.wA[1], SRF_ENC.wA[0]), sB = SRF_ENC.rA * Math.atan2(SRF_ENC.wB[1], SRF_ENC.wB[0]), sM = (sA + sB) / 2;
  const X = s => cx + (s - sM) * M, xA = X(sA), xB = X(sB), litA = srf_gate(SRF_ENC.wA, th), litB = srf_gate(SRF_ENC.wB, th);
  const yE = y + 64, yS = y + 176, hS = (SRF_ENC.rOut - SRF_ENC.rIn) * M, yD = yS + hS + 56;
  G.save(); G.globalAlpha = a;
  /* the emitter: a small block with its lens facing down; light fills the gap down to the rim */
  const lx0 = Math.min(xA, xB) - 0.16 * M, lx1 = Math.max(xA, xB) + 0.16 * M;
  rr(lx0 - 26, yE - 46, lx1 - lx0 + 52, 46, 6, TH ? '#2E3035' : '#2A2C31', null, 0, 1);
  rr(lx0, yE - 8, lx1 - lx0, 8, 3, rgba(C.hero, 0.9), null, 0, 1);
  G.fillStyle = rgba(C.hero, 0.16); G.fillRect(lx0, yE, lx1 - lx0, yS - yE);
  /* the rim, unrolled: slots move under the light as the wheel turns */
  const x0 = x + 30, x1 = x + w - 30;
  G.save(); G.beginPath(); G.rect(x0, yS - 2, x1 - x0, hS + 4); G.clip();
  G.fillStyle = TH ? '#45474E' : '#3A3C43'; G.fillRect(x0, yS, x1 - x0, hS);
  const s0 = SRF_ENC.rA * th, k0 = Math.floor((sM - (cx - x0) / M - s0) / P) - 1, k1 = Math.ceil((sM + (x1 - cx) / M - s0) / P) + 1;
  for (let k = k0; k <= k1; k++) { const sa = s0 + k * P, xa = X(sa), xb = X(sa + P / 2); G.fillStyle = TH ? '#141518' : '#0F1012'; G.fillRect(xa, yS, xb - xa, hS);
    /* light through a slot that sits under the lens */
    const la = Math.max(xa, lx0), lb = Math.min(xb, lx1); if (lb > la) { G.fillStyle = rgba(C.hero, 0.5); G.fillRect(la, yS, lb - la, hS); } }
  G.restore();
  /* below the rim: light only where a slot lets it through, down to the detector */
  for (let k = k0; k <= k1; k++) { const sa = s0 + k * P, la = Math.max(X(sa), lx0), lb = Math.min(X(sa + P / 2), lx1); if (lb > la) { G.fillStyle = rgba(C.hero, 0.16); G.fillRect(la, yS + hS, lb - la, yD - yS - hS); } }
  rr(lx0 - 26, yD, lx1 - lx0 + 52, 46, 6, TH ? '#2E3035' : '#2A2C31', null, 0, 1);
  for (const [xx, lit, nm] of [[xA, litA, 'A'], [xB, litB, 'B']]) {
    const ww = 0.26 * M; rr(xx - ww / 2, yD, ww, 8, 2, lit ? C.hero : (TH ? '#6E7077' : '#5A5C62'), null, 0, 1);
    if (lit) { G.fillStyle = rgba(C.hero, 0.22); G.beginPath(); G.arc(xx, yD + 4, 22, 0, TAU); G.fill(); }
    text(nm, xx, yD + 82, { role: 'label', size: 22, color: lit ? C.heroText : C.mute, align: 'center' });
  }
  /* a 1 mm scale bar */
  line(x1 - M, yD + 112, x1, yD + 112, { color: C.mute, w: 2 }); line(x1 - M, yD + 104, x1 - M, yD + 120, { color: C.mute, w: 2 }); line(x1, yD + 104, x1, yD + 120, { color: C.mute, w: 2 });
  text('1 mm', x1, yD + 146, { role: 'label', size: 19, color: C.mute, align: 'right' });
  G.restore();
  return { yE, yS, hS, yD, xA, xB, lx1, x0, x1 };
}
S({
  id: 'srf_encoder', ch: 'surface', theme: 'night', title: 'Optical encoder', settle: 10, ideas: ['encoder', 84],
  src: ['srf_razerScroll', 'srf_tpuV4', 'srf_eloEnc', 'srf_ttc', 'srf_wheel3d', 'srf_fmSupport', 'srf_doc'],
  draw: t => {
    header(t, 'Optical encoder');
    captions(t, [[0.6, 'TTC\'s optical encoder looks like any mouse encoder: the same steel frame, bushing and pins. Inside, light counts the steps.'], [5.6, 'Nothing touches, so nothing wears. Only 4 of the 35 mice in my data count with light, and the solid shell keeps dust out of it too.']]);
    /* the glance: Razer's figure, big, then the chart and the contacts that go away */
    const hx = LM;
    srf_hl(t, 0.5, hx, 450, '3.3×', { size: 150, label: 'Optical against mechanical', word: 'More reliable', wordBelow: true, wordSize: 50, sub: 'Razer\'s figure for its optical scroll wheel.', maxW: 440 });
    pill(hx, 646, 'claim', ep(t, 1.0, 1.4), { by: 'Razer' });
    const bx = hx + 196, bw = 160, kb = ep(t, 1.4, 2.4, E.snap);
    [['Mechanical', 1, C.comp, C.ink2], ['Optical', 3.3, C.hero, C.heroText]].forEach(([nm, v, col, tc], i) => {
      const yy = 700 + i * 50, ka = ep(t, 1.2 + i * 0.2, 1.6 + i * 0.2);
      text(nm, hx, yy + 8, { role: 'small', size: 25, weight: i ? 800 : 600, color: i ? C.ink : C.ink2, alpha: ka });
      rr(bx, yy - 9, Math.max(18, bw * v / 3.3 * kb), 18, 9, col, null, 0, ka);
      text(v === 1 ? '1×' : '3.3×', bx + bw * v / 3.3 * kb + 14, yy + 9, { font: 'disp', size: 28, weight: 800, color: tc, alpha: ka * kb, tnum: true });
    });
    srf_better(t, 2.0, hx, 794, 'Reliability, higher is better', 'r');
    srf_ba(t, 3.0, hx, 900, '3', '0', { size: 64, label: 'Sliding contacts that wear', net: 'Nothing touches the code disc', maxW: 440 });
    /* the drawing: the encoder from the front, cut open; the light gate magnified beside it */
    const D = [560, 280, 1280, 680]; demoWindow(D[0], D[1], D[2], D[3], tileA(t, 0.2, 0));
    const th = srf_scrollAt(t), ka = ep(t, 0.5, 1.1), cx = 1010, cy = 498;
    const E1 = part(cx, cy, 30, () => srf_encFront({ th }), { alpha: ka });
    text('Front, face plate cut away', D[0] + 40, D[1] + 56, { role: 'label', size: 21, color: C.mute, alpha: ka });
    callout(t, 1.6, E1.disc, 'Code disc', { to: [790, 390], side: 'l', color: C.ink, sub: '24 slots' });
    callout(t, 1.9, E1.axle, 'Axle', { to: [790, 488], side: 'l', color: C.ink, sub: 'D-shaped end' });
    callout(t, 2.2, E1.frame, 'Steel frame', { to: [790, 600], side: 'l', color: C.ink, sub: 'Tabs and legs' });
    callout(t, 2.5, E1.pins, 'Five pins', { to: [790, 880], side: 'l', color: C.ink });
    /* the detail: a ring round the light gate, a leader to its magnified view */
    const kd = ep(t, 2.8, 3.3), gx = 1260, gw = 540;
    if (kd > 0.003) {
      circle(E1.gate[0], E1.gate[1], 2.5 * E1.s * E.out3(kd), { color: C.heroText, w: 2, alpha: kd });
      line(E1.gate[0] + 2.5 * E1.s, E1.gate[1], gx, E1.gate[1], { color: C.heroText, w: 1.5, alpha: kd * 0.7, dash: [6, 5] });
    }
    const gd = srf_gateDetail(t, gx, 330, gw, 560, srf_scrollAt, kd);
    if (gd) {
      text('Light gate, magnified', gx + 30, 350, { role: 'label', size: 21, color: C.mute, alpha: kd });
      text('IR emitter', gd.lx1 + 44, gd.yE - 14, { role: 'label', size: 21, color: C.ink, alpha: kd });
      text('Slotted rim', gd.x0, gd.yS - 16, { role: 'label', size: 21, color: C.ink, alpha: kd });
      text('Detectors', gd.lx1 + 44, gd.yD + 30, { role: 'label', size: 21, color: C.ink, alpha: kd });
      /* the two signals: square waves a quarter-cycle apart; which one leads gives the direction */
      const x0 = gx + 70, x1 = gx + gw - 30, N = 160, win = 3.0, ty = gd.yD + 200;
      [['A', SRF_ENC.wA, 0], ['B', SRF_ENC.wB, 1]].forEach(([nm, wv, i]) => {
        const yb = ty + i * 66, hh = 34;
        text(nm, gx + 30, yb - 6, { font: 'disp', size: 26, weight: 800, color: C.ink, alpha: kd });
        G.save(); G.globalAlpha = kd; G.strokeStyle = C.hero; G.lineWidth = 3; G.lineJoin = 'round'; G.beginPath();
        for (let j = 0; j <= N; j++) { const tt = Math.max(0, t - win + win * j / N), v = srf_gate(wv, srf_scrollAt(tt)) ? 1 : 0, xx = lerp(x0, x1, j / N), yy = yb - v * hh; j ? G.lineTo(xx, yy) : G.moveTo(xx, yy); }
        G.stroke(); G.restore();
      });
      const up = ((t % 12) + 12) % 12 < 6;
      text(up ? 'A leads: scrolling up' : 'B leads: scrolling down', gx + 30, ty + 120, { role: 'small', size: 25, weight: 700, color: C.heroText, alpha: kd });
    }
  }
});
