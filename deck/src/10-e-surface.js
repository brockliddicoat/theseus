/* ============================== surface and details (chapter code srf) ==============================
   #16 the baked ceramic coat (its film, its weight, its colour), #60 laser-etched directional grip (the grip map, no
   adhesive, two-tone), #36 #62 #61 #33 #32 the marks, #34 #82 engravings and gates, #84 #30 the six-arm magnesium wheel
   (0.9 g) and its knurled tread, #7 the optical encoder on a POM axle. New slides are in 10-e2-surface.js, placed with `after`.
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
  srf_wheel3d: { t: 'This deck\'s 3D scroll wheel (3d/parts/scrollwheel.js): Ø22.74 × 7.0 mm, six thin arms (0.95 → 0.55 mm wide) on an open hub, a thin crowned rim (0.55 mm at the edges), a fine straight knurl of 144 grooves, 0.5 mm pitch, 0.12 mm deep, running out before the edges; 508.5 mm³ of wheel, 0.900 g in AZ31B and 1.373 g in 6061; a magnetic encoder in TTC\'s envelope: a diametric magnet Ø3 × 0.8 mm on the rotor\'s end, a 3 × 3 mm Hall IC 0.4 mm from it on a small board, a 24-notch detent star under a bronze leaf spring, a clear polycarbonate top over a black bottom housing, a nickel-silver frame and four pins', u: '', n: 'A design model built for the deck to Brock\'s 0.9 g, not a measured part.' },
  srf_is3403: { t: 'IS 3403:1981, knurling (the DIN 82 system): straight (RAA), left- or right-hand (RBL, RBR), left-right with raised or indented points (RGE, RGV; once called diamond knurling) and crossed (RKE, RKV); a 90° profile; a 30° helix; pitches 0.5, 0.6, 0.8, 1.0, 1.2 and 1.6 mm; "no attempt has been made to correlate pitch with workpiece diameter"', u: 'https://law.resource.org/pub/in/bis/S01/is.3403.1981.pdf' },
  srf_pmm: { t: 'PMM, Magnesium Scroll Wheel [PULSE, CYBER OP, OP1 8k, OP1w 4k]: magnesium alloy, weight 1.0 g; "the magnesium wheel only" (a scroll wheel pin and a spare ship beside it)', u: 'https://pmm.gg/products/magnesium-scroll-wheel-op1-8k-op1w-4k-pulse-cyber-op-for-modkit', n: 'The maker\'s figure for its own part.' },
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
      list: [['#16', 'A baked ceramic coat, 19 µm thin'], ['#16', 'No added weight, no yellowing'], ['#60', 'Laser-etched directional grip'], ['#60', 'No adhesive, two tones in one coat'], ['#84', 'A 0.9 g magnesium wheel, six arms'], ['Encoder', 'An optical encoder in TTC\'s form']]
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
/* out of the film, 2026-11-05 (Brock, F26.11: engravings off for now). Kept, not registered. */
const HIDDEN_srf_marks = ({
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
/* out of the film, 2026-11-05 (Brock, F26.11: engravings off for now). Kept, not registered. */
const HIDDEN_details = ({
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

/* ============================== #84 #30 the six-arm magnesium wheel, 0.9 g ==============================
   Brock (F22.1): PMM's magnesium wheel "is 1.0g, ours will be 0.9g", "closer to the pmm wheel ... but with 6 arms", and not the
   rover tread; then (F25.1, F25.2) "thinners arms", and for the tread "coarse and diamond are my favorites". The 3D wheel (scene
   'wheel', 3d/parts/scrollwheel.js): six thin tapered arms on an open hub, a thin crowned rim, 508.4 mm³ of AZ31B = 0.900 g; the
   same wheel in 6061 aluminium 1.373 g. The tread is a coarse diamond knurl (the DIN 82 / IS 3403 left-right form, its points
   flattened): drawn here unrolled, as a lit height field to the 3D model's dimensions. */
/* the knurl as the 3D builds it: 72 teeth round, grooves at 30° each way (tan 30° = 0.5774), 0.215 mm deep, a 12-row band of
   half width 2.578 mm that rises out of the plain edge bands over its first row (dY 0.4296 mm) */
const SRF_WH = { mm3: 508.4, g: 0.9, pmm: 1.0, mg: 1.77, al: 2.70, n: 72, d: 0.215, tb: Math.tan(Math.PI / 6), W: 7.0, R: 11.37, band: 2.578, dY: 0.4296, yT: 3.25, fe: 0.35, steps: 24 };
SRF_WH.alG = SRF_WH.mm3 * SRF_WH.al / 1000; SRF_WH.pitch = TAU * SRF_WH.R / SRF_WH.n;
/** the wheel's turn (rad): still, then the pointer rolls it three notches (45°), then still */
const srf_whTurn = t => (Math.PI / 4) * ep(t, 6.4, 7.8, E.io3);
/** the tread unrolled into a height field, pxmm field px to the mm, len px long plus two pitches (so it scrolls by wrapping):
   across the width the crown's fall and the edge fillets; the two families of grooves at ±30°, a = (s − y tan 30°) / p and
   b = (s + y tan 30°) / p, each a 90° V a quarter pitch either side of its centre; the flattened tops between them */
function srf_knurlField(pxmm, len) {
  const K = SRF_WH, h = Math.round(K.W * pxmm), per = K.pitch * pxmm, w = Math.ceil(len + 2 * per);
  return srf_field('wheelKnurl' + pxmm.toFixed(2) + '_' + w, w, h, f => {
    f.mat = { amb: 0.2, kd: 0.92, ks: 1.15, sh: 26, rz: 1, aoR: 2, aoK: 0.32, kf: 0.26, fall: w * 0.55 };
    for (let y = 0; y < h; y++) {
      const ym = (y + 0.5) / pxmm - K.W / 2, ay = Math.abs(ym);
      let z = Math.sqrt(K.R * K.R - ym * ym) - K.R;                                       /* the crown, mm */
      if (ay > K.yT) { const u = Math.min(1, (ay - K.yT) / (K.W / 2 - K.yT)); z -= K.fe * (1 - Math.sqrt(1 - u * u)); }
      const q = clamp((K.band - ay) / K.dY), V = u => { const d = Math.abs(u - Math.round(u)); return d < 0.25 ? 1 - 4 * d : 0; };
      for (let x = 0; x < w; x++) {
        const sm = x / pxmm, va = V((sm - ym * K.tb) / K.pitch), vb = V((sm + ym * K.tb) / K.pitch), g = K.d * q * Math.max(va, vb), p = y * w + x;
        f.z0[p] = (z - g) * pxmm; f.a0[p * 3] = 176; f.a0[p * 3 + 1] = 181; f.a0[p * 3 + 2] = 188; f.g0[p] = g > 0.002 ? 0.75 : 0.95;
      }
    }
  });
}
/** the tread strip in (x, y, w, h), scrolled by the wheel's turn th (rad); the light rakes in from the upper left and settles */
function srf_knurlStrip(t, x, y, w, h, th, a) {
  if (a <= 0.003) return;
  const sc = 2, pxmm = sc * h / SRF_WH.W, f = srf_knurlField(pxmm, sc * w), per = SRF_WH.pitch * pxmm;
  /* a studio light above the strip's top edge sweeps in once and stops (so the shading is cached once it is still) */
  const k = ep(t, 0.8, 4.4, E.io3), cv = srf_shade(f, { p: [f.w * lerp(-0.2, 0.56, k), -f.h * 0.55, f.h * 1.1] });
  const off = ((th * SRF_WH.R * pxmm) % per + per) % per;
  G.save(); G.globalAlpha = a; rrPath(x, y, w, h, 6); G.clip();
  G.imageSmoothingEnabled = true; G.imageSmoothingQuality = 'high';
  G.drawImage(cv, off, 0, sc * w, f.h, x, y, w, h);
  G.restore();
}
S({
  id: 'wheel', ch: 'surface', theme: 'paper', title: 'Six-arm magnesium wheel', settle: 10, ideas: [84, 30], three: ['wheel'],
  src: ['srf_pmm', 'srf_wheel3d', 'srf_is3403', 'srf_az31b', 'srf_al6061', 'srf_doc'],
  draw: t => {
    header(t, 'Six-arm magnesium wheel');
    const K = SRF_WH, cut = Math.round(100 * (K.pmm - K.g) / K.pmm);
    captions(t, [[0.6, `Six arms on an open hub and a thin crowned rim: ${fmtN(K.g, 1)} g of magnesium, ${cut} % under PMM's ${fmtN(K.pmm, 1)} g wheel. In aluminium the same wheel would weigh ${fmtN(K.alG, 2)} g.`],
      [5.6, 'The tread is a fine straight knurl: 144 grooves round, six to every notch. They cross the way the finger pushes, so it grips, and they run out before the edges, which stay smooth.']]);
    const lx = LM, ly = 280, lw = 900, lh = 680, th = srf_whTurn(t);
    demoWindow(lx, ly, lw, lh, tileA(t, 0.2, 0));
    /* the wheel: from the side in 2D (the arms, the hub, the rim; the encoder and bracket hidden), a close render in 3D */
    /* in 3D the whole tile is the shot, the wheel framed to its left (the target 8.5 mm to the wheel's −Z, screen right here) */
    const wv = { view: [0.8, 0.48, 0.4], zoom: 1.42, target: [0, 11.2, -8.5], scroll: th, xray: 0, explode: 0 };
    /* the anchors, as points in the wheel's own frame (x along the axle, toward the camera; r out from the axle at angle al from +Y
       toward +Z), so each lands on its part and beside its label once the wheel has turned (the arms at rest sit at −120°, −60°,
       0°, 60°, 120°, 180°; the one at −60° ends 15° right of the top after the 45° turn). Each is aimed through the tread's
       bounding box, whose size is known (x ±2.9, the crown's R 11.37 round the axle at y 11): at rest in 2D, and in 3D the turned
       mesh's local box, turned, so grown by |cos| + |sin| of the turn. The 3D anchor projects that world point exactly */
    const wheelPt = (atR, inf = 1) => (r, al, x = 0) => { const q = K.R * inf;
      return atR(/wheel\/tread$/, [(x + K.band) / (2 * K.band), (r * Math.cos(al) + q) / (2 * q), (r * Math.sin(al) + q) / (2 * q)]); };
    const D2R = Math.PI / 180, place = W => { pt.arm = W(6.2, -60 * D2R + th, 0.5) || pt.arm; pt.hub = W(2.15, -95 * D2R, 1.0) || pt.hub; pt.rim = W(10.45, -125 * D2R, 3.5) || pt.rim; pt.top = W(K.R, th) || pt.top; };
    const pt = { arm: [lx + 400, ly + 200], hub: [lx + 320, ly + 280], rim: [lx + 520, ly + 280], top: [lx + 300, ly + 70] };
    if (V2D.on) {
      const sb = [lx + 40, ly + 60, 500, 440], sv = Object.assign({}, wv, { view2d: 'right', zoom: 2.05, target: [0, 11, 0], hide2d: /encoder|support/, ground2d: false });
      srf_3d(t, 0.4, 'wheel', sb[0], sb[1], sb[2], sb[3], sv);
      const sv0 = Object.assign({}, sv, { scroll: 0 });
      place(wheelPt((re, f) => v2dAt('wheel', sv0, sb, re, f)));
    } else {
      const box = [lx, ly, lw, 500], drawn = srf_3d(t, 0.4, 'wheel', box[0], box[1], box[2], box[3], wv);
      place(wheelPt((re, f) => srf_at3('wheel', wv, box, drawn, re, f), Math.abs(Math.cos(th)) + Math.abs(Math.sin(th))));
    }
    rich([{ s: 'Fig. 01', role: 'label', size: 21, color: C.mute }, { s: V2D.on ? 'Magnesium wheel from the side' : 'Magnesium wheel on its POM axle (render)', role: 'small', size: 24, weight: 600, color: C.faint, gap: 16 }], lx + 26, ly + 46, { alpha: ep(t, 0.6, 1.0) });
    const cx = lx + 610;
    callout(t, 2.0, pt.arm, 'Six thin arms', { to: [cx, ly + 130], side: 'r', color: C.ink, sub: '60° apart, 0.55 mm wide at the rim', maxW: 260 });
    callout(t, 2.5, pt.hub, 'Open hub', { to: [cx, ly + 270], side: 'r', color: C.ink, sub: 'A 4.1 mm ring on the POM axle', maxW: 260 });
    callout(t, 3.0, pt.rim, 'Thin crowned rim', { to: [cx, ly + 390], side: 'r', color: C.ink, sub: '0.55 mm at the edges, R 11.4 crown', maxW: 260 });
    /* the pointer rolls the wheel three notches, riding the tread */
    { const kp = ep(t, 5.8, 6.2) * (1 - ep(t, 8.0, 8.4)); if (kp > 0.003) cursorPtr(pt.top[0], pt.top[1], { a: kp, press: t > 6.3 && t < 6.75 ? prog(t, 6.3, 6.75) : 0, grab: t > 6.3 && t < 7.9 }); }
    /* the tread, unrolled under the wheel: the knurl, lit, turning with it */
    const sx = lx + 32, sw = lw - 64, sy = ly + 526, sh = 112, ks = ep(t, 4.6, 5.2);
    text('Tread, unrolled', sx, sy - 16, { role: 'label', size: 21, color: C.mute, alpha: ks });
    srf_knurlStrip(t, sx, sy, sw, sh, th, ks);
    rr(sx, sy, sw, sh, 6, null, inkA(0.18), 1.2, ks);
    { const ka = ep(t, 5.0, 5.5), sbx = sx + sw, mmPx = sh / K.W, yb = ly + lh - 22;
      text('Straight knurl: 144 grooves, 0.5 mm pitch, 0.12 mm deep', sx, yb, { role: 'small', size: 23, weight: 600, color: C.ink2, alpha: ka, maxW: sw - 140 });
      line(sbx - mmPx, yb - 8, sbx, yb - 8, { color: C.mute, w: 2, alpha: ka }); line(sbx - mmPx, yb - 15, sbx - mmPx, yb - 1, { color: C.mute, w: 2, alpha: ka }); line(sbx, yb - 15, sbx, yb - 1, { color: C.mute, w: 2, alpha: ka });
      text('1 mm', sbx - mmPx - 12, yb, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ka }); }
    /* the glance: the weight against PMM's wheel, before → after, and the three wheels by weight */
    const rx = 1020;
    srf_hl(t, 1.0, rx, 448, '−' + cut + ' %', { size: 150, label: 'Weight against PMM\'s magnesium wheel', maxW: RM - rx });
    srf_ba(t, 2.0, rx, 640, fmtN(K.pmm, 1), fmtN(K.g, 1), { size: 72, unit: 'g', label: 'The wheel alone, PMM\'s → mine', net: 'Six arms, and still a tenth lighter', maxW: RM - rx });
    srf_bars(t, 2.8, { x: rx, y: 772, w: RM - rx, xr: [0, 1.5], labelW: 340, valW: 110, rowH: 46, dec: 2, unit: 'g', nsize: 24,
      rows: [{ name: 'Theseus, magnesium', v: K.g, hero: true }, { name: 'PMM, magnesium', v: K.pmm }, { name: 'My wheel in aluminium', v: K.alG }].map(r => Object.assign(r, { label: fmtN(r.v, 2) + ' g' })) });
    srf_better(t, 3.4, rx, 924, 'Lower is better');
    { const kp = ep(t, 3.4, 3.8), wd = pillW('derived'), wc = pillW('claim', { by: 'PMM' }); pill(RM - wd, 924, 'derived', kp); pill(RM - wd - 24 - wc, 924, 'claim', kp, { by: 'PMM' }); }
  }
});

/* ============================== the magnetic encoder ==============================
   Brock (F27, on `sealed`): "i want to use a magnetic encoder that doesn't get affected by dust and have a transparent top
   housing to see when it's broken like switches"; decided: "Yes, switch everywhere". The part is this deck's 3D model
   (3d/parts/scrollwheel.js, scene 'wheel'): TTC's envelope kept (4.6 × 11 mm on the board, 15 mm tall, the axle 11 mm up),
   a black bottom housing up to the split at 7.85 mm and a clear polycarbonate top over it; inside, an orange POM rotor with
   a 24-notch detent star under a bronze leaf spring, a diametric magnet Ø3 × 0.8 mm on its end, and a 3 × 3 mm Hall IC on a
   small board 0.4 mm from the magnet; a nickel-silver frame on the wheel side, four pins. */
Object.assign(SRC, {
  srf_kth5791: { t: 'Conntek KTH5791, 3D Hall mouse-wheel encoder sensor (product page): AB quadrature with an index pin, 16 to 1024 counts a turn, QFN 3 × 3 mm; 0.8 mA typical and 1.5 mA maximum at 3.3 V; "寿命 10M+ 次" (life 10M+ cycles) with "无机械磨损" (no mechanical wear)', u: 'https://conntek-design-center-bu1.pages.dev/products/3d-hall/KTH5791', n: 'Maker\'s figures. The 10M+ is the sensor\'s life; the detent spring still wears.' },
  srf_mpsMag: { t: 'MPS (Sensima), application note "Using MagAlpha devices to replace optical encoders", January 2015: optical encoders "are subject to problems due to contamination (dirt) obstructing the optical path, leading to failure"; magnetic sensors\' "insensitivity to dust and dirt" is a "significant advantage"', u: 'https://media.monolithicpower.cn/document/appnote_Using%20MagAlpha%20devices%20to%20replace%20optical%20encoders.pdf', n: 'A magnetic-sensor maker\'s app note: claim-level.' },
  srf_kailhEnc: { t: 'Kailh 13 mm rotary mouse scroll-wheel encoders, Global Sources catalogue listings: "300000 life" (15 to 30 g force) and "800000 life" (25 to 40 g force)', u: 'https://www.globalsources.com/Encoder/Kailh-13mm-Rotary-Mouse-Scroll-Wheel-Encoder--1235123766p.htm', n: 'Maker\'s ratings; the 300,000 listing is 1234977385p.' },
  srf_razerAllOptical: { t: 'Razer, "Why the Razer Viper V4 Pro goes all in on optical" (blog, 2026): with contact encoders, "wear can show up over time as unwanted scroll behavior, including ghost inputs or reverse scrolling"', u: 'https://www.razer.com/blog/why-the-razer-viper-v4-pro-goes-all-in-on-optical' },
  srf_avagoWheel: { t: 'Avago ADNK-3043 wireless optical mouse design kit, user guide: the wheel encoder\'s IR LED is "pulsed on for approximately 40 µsec every 2 msec while in ACTIVE mode"', u: 'https://manualedistruzioni.it/avago/mouse/adnk-3043-nd24/guide/1vb0s', n: 'No LED current given, so no optical figure in mA.' },
  srf_mdtTmr: { t: 'TechPowerUp, "MDT unveils new tunneling magnetoresistance (TMR) sensors for gaming devices" (12 November 2024): "less than 0.3mA"; scroll-wheel sensors in development', u: 'https://techpowerup.com/328720/mdt-unveils-new-tunneling-magnetoresistance-tmr-sensors-for-gaming-devices' }
});
/** wheel angle (rad) over time: up for 6 s, back down for 6 s */
const srf_scrollAt = t => { const p = ((t % 12) + 12) % 12; return 0.55 * (p < 6 ? p : 12 - p); };
/** how each kind of encoder counts a step, small, in the box (x, y, w, h): 'mech' (contacts rub a ring of pads), 'opt' (light
   through slots, onto a detector) or 'mag' (a magnet's field, read by a Hall chip). th = the wheel's angle; dust 0..1 brings
   specks in: they block the optical one's light and leave the magnetic one counting. Stage px, drawn straight (no part()) */
function srf_encIcon(kind, x, y, w, h, th, dust, a) {
  if (a <= 0.003) return;
  const cx = x + w / 2, cy = y + h / 2, sp = 'rgba(205,190,160,0.95)', dk = '#2B2D32', ec = inkA(0.28);
  G.save(); G.globalAlpha = a;
  rrPath(x, y, w, h, 12); G.fillStyle = inkA(0.05); G.fill(); G.strokeStyle = inkA(0.12); G.lineWidth = 1.2; G.stroke();
  G.save(); rrPath(x, y, w, h, 12); G.clip();
  if (kind === 'mech') {
    /* a contact ring face-on, turning: 12 brass pads; a leaf wiper rubs it at the top, its tip worn bright */
    const R = h * 0.36, c0 = [cx + 6, cy + 4];
    G.beginPath(); G.arc(c0[0], c0[1], R, 0, TAU); G.fillStyle = '#3A3C43'; G.fill(); G.strokeStyle = ec; G.lineWidth = 1; G.stroke();
    for (let i = 0; i < 12; i++) { const a0 = th + i * TAU / 12, a1 = a0 + TAU / 24;
      G.beginPath(); G.arc(c0[0], c0[1], R * 0.94, a0, a1); G.arc(c0[0], c0[1], R * 0.58, a1, a0, true); G.closePath(); G.fillStyle = '#C79A55'; G.fill(); }
    G.beginPath(); G.arc(c0[0], c0[1], R * 0.3, 0, TAU); G.fillStyle = '#55575E'; G.fill();
    const tip = [c0[0] - 2, c0[1] - R * 0.78];
    G.beginPath(); G.moveTo(x + 10, y + 18); G.lineTo(tip[0] - 26, y + 18); G.quadraticCurveTo(tip[0] - 8, y + 18, tip[0], tip[1]);
    G.strokeStyle = '#D6DADF'; G.lineWidth = 3.2; G.lineCap = 'round'; G.stroke();
    for (let i = 0; i < 4; i++) { const ang = -Math.PI / 2 - 0.5 + i * 0.32; line(c0[0] + Math.cos(ang) * R * 0.98, c0[1] + Math.sin(ang) * R * 0.98, c0[0] + Math.cos(ang) * R * 1.12, c0[1] + Math.sin(ang) * R * 1.12, { color: '#E8C98F', w: 1.6, alpha: a * 0.7 }); }
  } else if (kind === 'opt') {
    /* emitter above, a slotted rim moving across, the detector below; light reaches it through a slot, unless a speck sits
       in the path */
    const ex = cx - 8, ew = 34, yE = y + 22, yS = cy - 4, hS = 16, yD = y + h - 26, P = 22, off = ((th * 24) % P + P) % P;
    rr(ex - ew / 2, yE - 14, ew, 14, 3, dk, null, 0, a); rr(ex - 9, yE - 4, 18, 4, 2, C.hero, null, 0, a);
    rr(ex - ew / 2, yD, ew, 14, 3, dk, null, 0, a);
    G.fillStyle = '#4A4C53'; G.fillRect(x, yS, w, hS);
    let open = false;
    for (let s = -P; s < w + P; s += P) { const sx = x + s + off; G.fillStyle = '#121316'; G.fillRect(sx, yS, P / 2, hS); if (ex >= sx + 2 && ex <= sx + P / 2 - 2) open = true; }
    const blocked = dust > 0.5, lit = open && !blocked;
    G.fillStyle = rgba(C.hero, 0.22); G.fillRect(ex - 6, yE, 12, yS - yE);
    if (open) { G.fillStyle = rgba(C.hero, 0.22); G.fillRect(ex - 6, yS + hS, 12, (blocked ? yS + hS + 10 : yD) - yS - hS); }
    rr(ex - 9, yD, 18, 4, 2, lit ? C.hero : '#6E7077', null, 0, a);
    if (dust > 0.003) { const k = clamp(dust * 2); G.globalAlpha = a * k; G.beginPath(); G.ellipse(ex + 1, yS + hS + 9, 7, 5, 0.3, 0, TAU); G.fillStyle = sp; G.fill();
      for (const [dx, dy, r] of [[22, -30, 2.2], [30, 22, 1.8], [-24, 26, 2.4], [40, -6, 1.6]]) { G.beginPath(); G.arc(cx + dx, cy + dy, r, 0, TAU); G.fill(); }
      G.globalAlpha = a; }
  } else if (kind === 'sw') {
    /* a mechanical microswitch from the side: the body, the plunger, the leaf inside; no LED (struck through, top right) */
    const bx0 = x + 22, bw0 = w * 0.56, by0 = cy - 14, bh0 = 40, press = 0.5 + 0.5 * Math.sin(th * 3);
    rr(bx0 + bw0 * 0.42, by0 - 12 + 4 * press, 16, 14, 3, '#C9CCD2', null, 0, a);
    rr(bx0, by0, bw0, bh0, 6, dk, inkA(0.3), 1, a);
    G.beginPath(); G.moveTo(bx0 + 10, by0 + 28); G.quadraticCurveTo(bx0 + bw0 * 0.5, by0 + 10 + 6 * press, bx0 + bw0 - 12, by0 + 18 + 6 * press); G.strokeStyle = '#C08F4E'; G.lineWidth = 2.6; G.lineCap = 'round'; G.stroke();
    circle(bx0 + bw0 - 12, by0 + 29, 3, { fill: '#B4B9C0', alpha: a });
    for (const px of [0.22, 0.5, 0.78]) rr(bx0 + bw0 * px - 2, by0 + bh0, 4, 14, 1, '#B4B9C0', null, 0, a);
    const lx = x + w - 34, ly = y + 30; warm(lx, ly, 18, C.hero, 0.25 * a); circle(lx, ly, 6, { fill: rgba(C.hero, 0.6), alpha: a });
    line(lx - 14, ly + 14, lx + 14, ly - 14, { color: C.ink, w: 2.4, alpha: a });
  } else if (kind === 'rgb') {
    /* an RGB LED's glow, struck through */
    const lx = cx, ly = cy - 4;
    warm(lx, ly, 44, '#ff3cac', 0.35 * a); warm(lx + 10, ly + 6, 34, '#3cc8ff', 0.3 * a); warm(lx - 8, ly + 8, 30, '#7dff6a', 0.22 * a);
    rr(lx - 9, ly - 6, 18, 12, 3, '#E8E6E0', null, 0, a);
    line(lx - 34, ly + 30, lx + 34, ly - 30, { color: C.ink, w: 3, alpha: a });
  } else {
    /* the magnet face-on, its north and south halves turning; the Hall chip beside it; the field arcs over to it, through dust */
    const R = h * 0.26, mc = [x + w * 0.36, cy], chip = [x + w * 0.76, cy];
    G.save(); G.strokeStyle = rgba(C.hero, 0.75); G.lineWidth = 1.8;
    for (const k of [1.25, 1.7, 2.2]) for (const sd of [1, -1]) { G.beginPath(); G.ellipse((mc[0] + chip[0]) / 2 - 4, cy, (chip[0] - mc[0]) / 2 + 8 * k, R * k * 0.75, 0, sd > 0 ? Math.PI : 0, sd > 0 ? TAU : Math.PI); G.stroke(); }
    G.restore();
    for (const [a0, col] of [[th, '#D8DBE0'], [th + Math.PI, '#8E939B']]) { G.beginPath(); G.moveTo(mc[0], mc[1]); G.arc(mc[0], mc[1], R, a0 - Math.PI / 2, a0 + Math.PI / 2); G.closePath(); G.fillStyle = col; G.fill(); }
    G.beginPath(); G.arc(mc[0], mc[1], R, 0, TAU); G.strokeStyle = ec; G.lineWidth = 1; G.stroke();
    rr(chip[0] - 13, cy - 13, 26, 26, 3, '#111214', inkA(0.3), 1, a); circle(chip[0], cy, 4.5, { fill: C.hero, alpha: a });
    if (dust > 0.003) { G.globalAlpha = a * clamp(dust * 2); G.fillStyle = sp;
      for (const [dx, dy, r] of [[-4, -14, 2.4], [6, 10, 2.0], [-12, 6, 1.8], [14, -4, 2.2], [-34, 28, 1.6], [30, -28, 1.8]]) { G.beginPath(); G.arc((mc[0] + chip[0]) / 2 + dx, cy + dy, r, 0, TAU); G.fill(); }
      G.globalAlpha = a; }
  }
  G.restore(); G.restore();
}
S({
  /* moved next to the web software (Brock on elc_sheet2: "add the no rgb light to the slide about having no optical
     components, and put it next to the web software"; he chose this slide as that one) */
  id: 'srf_encoder', ch: 'elec', after: 'software', theme: 'night', title: 'Nothing lights up but the sensor', settle: 10, ideas: ['encoder', 84, 99], three: ['wheel'], rev: 1,
  answers: [['2/10, no note: the optical encoder', 'Rebuilt round the magnetic encoder: what it fixes against mechanical and optical, sourced'],
    ['(sealed) "you\'re still drawing the encoder poorly"', 'The encoder is the 3D model\'s render (its flat twin in 2D), not a sketch'],
    ['(sealed) "a magnetic encoder that doesn\'t get affected by dust"', 'Magnet and Hall sensor in 3D and 2D; dust stops light, not a field (MPS)'],
    ['(sealed) "a transparent top housing to see when it\'s broken like switches"', 'Clear polycarbonate top over the rotor, magnet and spring, called out'],
    ['(elc_sheet2) "remove this slide"', 'Removed; its haptics panel went with it'],
    ['(elc_sheet2) "add the no rgb light to the slide about having no optical components"', 'Here: no RGB LED, with Logitech\'s 30 h → 22 h, beside the encoder and the switches'],
    ['(elc_sheet2) "put it next to the web software"', 'This slide now follows the web software slide']],
  src: ['srf_mpsMag', 'srf_kailhEnc', 'srf_razerAllOptical', 'srf_kth5791', 'srf_avagoWheel', 'srf_mdtTmr', 'clk_razerV4bat', 'clk_vortexV4', 'logiRgb', 'srf_wheel3d', 'srf_doc'],
  draw: t => {
    header(t, 'Nothing lights up but the sensor');
    captions(t, [[0.6, 'Light costs battery: an optical wheel and optical switches keep pulsing LEDs, and RGB runs all the time. In Theseus only the sensor lights up.'],
      [5.6, 'The wheel counts with a magnet, so dust can\'t block it, and its top is clear like a clear-top switch: you can see the spring and the magnet.']]);
    const th = srf_scrollAt(t), dust = ep(t, 3.2, 4.4);
    /* the glance: the three lights Theseus leaves out, each with what it costs a rival */
    const rows = [
      { k: 'mag', name: 'Wheel encoder: magnetic', how: 'Optical ones pulse an LED and stop when dust blocks the slot; contact ones wear out (Kailh: 0.3–0.8 M cycles). A magnet does neither.', fig: '10M+ cycles', by: 'Conntek' },
      { k: 'sw', name: 'Main switches: mechanical', how: 'Optical switches pulse an LED in each. The GT01s draw nothing until pressed (worked out on the GT01 slide, in Clicks).', fig: '18 % → 0 %', sub: 'of a V4 Pro\'s battery', by: 'derived' },
      { k: 'rgb', name: 'No RGB LED', how: 'RGB cycling cuts a Logitech G703 from 30 h to 22 h. Theseus shows its battery in the web software instead.', fig: '27 % → 0 %', sub: 'of a G703\'s hours', by: 'Logitech' }];
    const ix = LM, iw = 140, ih = 112, tx = ix + iw + 22, xr = 724, tw0 = xr - tx;
    rows.forEach((r, i) => {
      const yy = 290 + i * 172, a = ep(t, 0.9 + i * 0.35, 1.4 + i * 0.35);
      srf_encIcon(r.k, ix, yy, iw, ih, th, dust, a);
      text(r.name, tx, yy + 24, { role: 'small', size: 27, weight: 800, color: C.heroText, alpha: a, maxW: tw0 });
      text(r.how, tx, yy + 56, { role: 'small', size: 20, color: C.ink2, alpha: a, maxW: tw0, lh: 1.25 });
      const fw = text(r.fig, tx, yy + 136, { font: 'mono', size: 25, weight: 800, color: C.heroText, alpha: a, tnum: true }).w;
      let px = tx + fw + 12;
      if (r.sub) px += text(r.sub, px, yy + 136, { role: 'small', size: 20, color: C.mute, alpha: a }).w + 12;
      px += pill(px, yy + 136, r.by === 'derived' ? 'derived' : 'claim', a, r.by === 'derived' ? {} : { by: r.by }) + 14;
    });
    /* the one current the magnetic wheel adds, honestly */
    { const kp = ep(t, 6.4, 6.9), h0 = text('What the magnet costs: its Hall sensor draws 0.8 mA while awake, more than an optical wheel\'s pulsed LED, so Theseus wakes it only to read the wheel (proposal).', LM, 836, { role: 'small', size: 21, color: C.mute, alpha: kp, maxW: xr - LM, lh: 1.3 }).h;
      const pw = pill(LM, 836 + h0 + 2, 'claim', kp, { by: 'Conntek' }); pill(LM + pw + 12, 836 + h0 + 2, 'claim', kp, { by: 'Avago' }); }
    /* the part itself: the 3D model, its clear top over the rotor, magnet and spring; the wheel behind it, to the left */
    const D = [748, 272, 1092, 688]; demoWindow(D[0], D[1], D[2], D[3], tileA(t, 0.2, 0));
    const box = [D[0], D[1], 800, D[3]];
    const wv = { view: [-0.62, 0.72, -0.32], zoom: 2.6, target: [-9.0, 8.6, 0.2], scroll: th, xray: 0, explode: 0 };
    const sv = Object.assign({}, wv, { view2d: 'top', zoom: 3.7, target: [-9.0, 9, 0.6], hide2d: /support|spin\/wheel\/|spin\/axle\//, ground2d: false });
    let at;
    if (V2D.on) { srf_3d(t, 0.4, 'wheel', box[0], box[1], box[2], box[3], sv); at = (re, f) => v2dAt('wheel', sv, box, re, f); }
    else { const drawn = srf_3d(t, 0.4, 'wheel', box[0], box[1], box[2], box[3], wv); at = (re, f) => srf_at3('wheel', wv, box, drawn, re, f); }
    rich([{ s: 'Fig. 01', role: 'label', size: 21, color: C.mute }, { s: V2D.on ? 'The magnetic encoder from above, through its clear top' : 'The magnetic encoder, the wheel behind it (render)', role: 'small', size: 24, weight: 600, color: C.faint, gap: 16 }], D[0] + 26, D[1] + D[3] - 26, { alpha: ep(t, 0.6, 1.0) });
    /* the callouts, stacked down the tile's right in the order their parts sit, so no leader crosses another */
    const C0 = [D[0] + 330, D[1] + 300], items = [
      { re: /encoder\/cover$/, f: [0.78, 1, 0.86], l: 'Clear top housing', s: 'Polycarbonate: the spring and magnet in sight' },
      { re: /magnet\/magnetN$/, f: [0.5, 1, 0.5], l: 'Magnet', s: 'Ø3 × 0.8 mm, turns with the wheel' },
      { re: /hallSensor\/hallIC$/, f: [0.5, 1, 0.5], l: 'Hall sensor', s: '3 × 3 mm, 0.4 mm from the magnet' },
      { re: /encoder\/detentSpring$/, f: [0.5, 1, 0.2], l: 'Detent spring', s: 'Bronze, on a 24-notch star: the click you feel' },
      { re: /frame\/tabTop$/, f: [0.5, 1, 0.5], l: 'Nickel-silver frame', s: 'Holds it to the board, four pins' }];
    items.forEach((it, i) => { it.p = at(it.re, it.f) || [C0[0] + 30 * i, C0[1] + 40 * i]; });
    items.slice().sort((p, q) => p.p[1] - q.p[1]).forEach((it, i) => {
      callout(t, 1.6 + 0.35 * items.indexOf(it), it.p, it.l, { to: [D[0] + 772, D[1] + 84 + i * 114], side: 'r', color: C.ink, sub: it.s, maxW: 300 });
    });
  }
});
