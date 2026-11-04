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
  srf_eloEnc: { t: 'EloShapes spec sheets via research/data/mice.json: encoder type of 35 mice (optical: Razer Viper V4 Pro, DeathAdder V4 Pro; ZOWIE EC2-DW, U2-DW)', u: 'https://www.eloshapes.com/' }
});

/* ---------- shared helpers (chapter code srf) ---------- */
/** a card with a Kunai head row; returns the y where its content starts */
function srf_card(t, t0, x, y, w, h, label, ev, o = {}) {
  demoWindow(x, y, w, h, ep(t, t0, t0 + 0.45), { hero: o.hero, grid: o.grid });
  return cardHead(t, t0 + 0.1, x, y, w, label, ev || [], { color: o.color || C.ink });
}
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
/** the step further: the best version shipping today (a grey rule), then the Theseus step (a yellow edge). returns the y under it */
function srf_step(t, t0, x, y, w, best, step, o = {}) {
  const k1 = ep(t, t0, t0 + 0.45), k2 = ep(t, t0 + 0.9, t0 + 1.35), lh = o.lh || 33, sz = o.size || 25;
  const pillsR = (kinds, yy, a) => { let xr = x + w; for (let i = kinds.length - 1; i >= 0; i--) { xr -= pillW(kinds[i]); pill(xr, yy + 1, kinds[i], a); xr -= 10; } };
  rect(x, y - 22, 5, 30, { fill: C.comp, alpha: k1 });
  text(o.bestLabel || 'Best today', x + 20, y, { role: 'label', size: 21, color: C.mute, alpha: k1 });
  pillsR(best.ev || [], y, k1);
  const r1 = para([{ s: best.who + '. ', role: 'small', size: sz, weight: 700, color: C.ink }, { s: best.line, role: 'small', size: sz, weight: 450, color: C.ink2 }], x + 20, y + 38, { maxW: w - 20, lh, t, t0: t0 + 0.15, cps: 150, alpha: k1, maxLines: best.lines || 3 });
  const y2 = y + 38 + r1.h + (o.gap || 26);
  if (k2 > 0.003) {
    const r2l = wrap(step.line, { role: 'small', size: sz, weight: 500 }, w - 20).length;
    rect(x, y2 - 22, 5, (38 + lh * Math.min(step.lines || 3, r2l)) * E.out3(k2), { fill: C.hero });
    rich([{ s: o.stepLabel || 'Theseus', role: 'label', size: 21, color: C.onHero, chip: C.heroChip }], x + 26, y2, { alpha: k2 });
    pillsR(step.ev || ['proposal'], y2, k2);
    const r2 = para([{ s: step.line, role: 'small', size: sz, weight: 500, color: C.ink }], x + 20, y2 + 38, { maxW: w - 20, lh, t, t0: t0 + 1.05, cps: 150, alpha: k2, maxLines: step.lines || 3 });
    return y2 + 38 + r2.h;
  }
  return y2;
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
    else { const L = Math.max(bh, (X(r.v) - bx) * k); rr(bx, yy - bh / 2, L, bh, bh / 2, col, r.hero && TH ? '#111111' : null, 1.3, a); glint(bx, yy - bh / 2, L, bh, t, d + 3.5 + i * 0.2, 9); }
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
/** a polar plot of friction by direction. curves = [{ a, b, color, w, dash, p (0..1 drawn), th0, label }], R = px for r = 1.
   Along is drawn left to right, across up and down, as on the surface beside it */
function srf_polar(t, t0, cx, cy, R, curves, o = {}) {
  const k = ep(t, t0, t0 + 0.6);
  if (k <= 0.003) return;
  for (const f of [0.5, 1]) circle(cx, cy, R * f * E.out3(k), { color: C.hair, w: 1.5 });
  const lr = o.lr || 1.16;
  line(cx - R * lr, cy, cx + R * lr, cy, { color: C.hair, w: 1.5, alpha: k }); line(cx, cy - R * lr, cx, cy + R * lr, { color: C.hair, w: 1.5, alpha: k });
  text('Along', cx + R * lr, cy + 28, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: k });
  text('Across', cx, cy - R * lr - 12, { role: 'label', size: 19, color: C.mute, align: 'center', alpha: k });
  for (const c of curves) {
    const p = c.p == null ? 1 : c.p; if (p <= 0) continue;
    const th0 = c.th0 || 0, pts = [];
    for (let i = 0; i <= 120 * p; i++) { const th = th0 + (c.cw ? -1 : 1) * TAU * i / 120, r = srf_mu(c.a, c.b, th) * R / (o.norm || 1); pts.push([cx + r * Math.cos(th), cy - r * Math.sin(th)]); }
    G.save(); G.globalAlpha = k * (c.alpha == null ? 1 : c.alpha); G.beginPath(); pts.forEach((q, i) => i ? G.lineTo(q[0], q[1]) : G.moveTo(q[0], q[1]));
    if (c.fill && p >= 1) { G.closePath(); G.fillStyle = c.fill; G.fill(); }
    G.strokeStyle = c.color; G.lineWidth = c.w || 3; G.lineJoin = 'round'; G.setLineDash(c.dash || []); G.stroke(); G.setLineDash([]); G.restore();
  }
}

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
      list: [['#16', 'A baked ceramic coat'], ['#60', 'Laser-etched grip on the sides'], ['#36', 'Your serial, lasered on the right click'], ['#34', 'Engravings half as deep'], ['#84', 'A magnesium wheel, counted with light'], ['#30', 'A rover\'s tread on the wheel'], ['#12', 'Satin clear over raw carbon']]
    });
    figLabel(t, 2.2, 1040, 1000 - 22, 8, 'The forged colourway: satin clear over raw carbon-filled PP (render)');
  }
});

/* ============================== #16 bake the coating ============================== */
const srf_GRADES = ['7B', '6B', '5B', '4B', '3B', '2B', 'B', 'HB', 'F', 'H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H'];
S({
  id: 'coating', ch: 'surface', theme: 'paper', title: 'Bake the coating', settle: 10, ideas: [16],
  src: ['srf_eloPmm', 'srf_doc', 'cerakoteH', 'cerakoteC', 'cerakoteGuide', 'cerakoteCure', 'radtech', 'ppSurface', 'srf_scan'],
  draw: t => {
    header(t, 'Bake the coating');
    captions(t, [[0.6, 'Soft-touch rubber wears through. A ceramic coat needs heat to reach full strength, the way a pot does in a kiln.'], [5.8, 'Cerakote measured 8H on steel at 250 °F. Plastics cure at 150 to 180 °F, so I measure it again on the shell before I claim it.']]);
    /* left: dried in air or fired, a pencil across both, then the step further */
    const lx = LM, ly = LAY.top, lw = 860, lh = 580, by = ly + 252, P1 = lx + 215, P2 = lx + lw - 215;
    srf_card(t, 0.3, lx, ly, lw, lh, 'Dried in air, or fired', ['datasheet']);
    const fire = ep(t, 1.2, 3.0);
    [[P1, 0], [P2, fire]].forEach(([px, f], i) => {
      const a = ep(t, 0.6 + i * 0.2, 1.1 + i * 0.2);
      if (i === 1 && t > 1.0) {
        /* the kiln: a bed of heat and the air shimmering above it while the pot fires */
        const hk = ep(t, 1.0, 1.4) * (1 - ep(t, 3.0, 3.8));
        G.save(); G.globalAlpha = hk; const g = G.createRadialGradient(px, by + 4, 8, px, by + 4, 130); g.addColorStop(0, rgba(C.orange, 0.5)); g.addColorStop(1, rgba(C.orange, 0)); G.fillStyle = g; G.fillRect(px - 140, by - 120, 280, 140); G.restore();
        for (let k = 0; k < 5; k++) { const ph = (t * 0.7 + k / 5) % 1, xx = px - 56 + k * 28; G.save(); G.globalAlpha = hk * (1 - ph) * 0.7; G.strokeStyle = C.orange; G.lineWidth = 2; G.beginPath(); for (let s2 = 0; s2 <= 1; s2 += 0.1) G.lineTo(xx + 5 * Math.sin(s2 * 6 + t * 3 + k), by - 8 - ph * 140 - s2 * 30); G.stroke(); G.restore(); }
      }
      srf_pot(px, by, 140, f, a);
      line(px - 110, by + 2, px + 110, by + 2, { color: C.hair, w: 2, alpha: a });
      text(i ? 'Fired in a kiln' : 'Dried in air', px, ly + 92, { role: 'label', size: 22, color: C.ink, align: 'center', alpha: a });
    });
    /* the pencil test: a 4H lead marks the air-cured film (rated 3H) and not the baked one (rated 8H) */
    const loop = t >= 11 ? ((t - 11) % 7) / 7 : -1, pk = loop >= 0 ? env(loop, 0, 0.06, 0.62, 0.72) : env(t, 3.4, 3.7, 8.2, 8.6);
    const pc = loop >= 0 ? clamp(loop / 0.6) : clamp((t - 3.7) / 4.4);
    [[P1, 1], [P2, 0]].forEach(([px, marks], i) => {
      const u = clamp(pc * 2 - i), path = s2 => [px - 46 + 92 * E.io3(s2), by - 62 + 8 * Math.sin(s2 * Math.PI)];
      const done = loop >= 0 ? 1 : (i === 0 ? u : 0);
      if (marks && done > 0) { G.save(); G.globalAlpha = 0.9; G.strokeStyle = '#6C6B66'; G.lineWidth = 3; G.lineCap = 'round'; G.beginPath(); for (let s2 = 0; s2 <= done + 1e-6; s2 += 0.02) { const q = path(Math.min(s2, done)); G.lineTo(q[0], q[1]); } G.stroke(); G.restore(); }
      if (u > 0 && u < 1) { const q = path(u); srf_pencil(q[0], q[1], i ? '' : '4H', pk); }
      const kr = ep(t, 4.6 + i * 2.2, 5.0 + i * 2.2);
      text(marks ? '4H marks it' : '4H leaves no mark', px, by + 36, { role: 'label', size: 22, color: marks ? C.red : C.good, align: 'center', alpha: kr });
    });
    [['C-299, air-cured: 3H', P1], ['H-167, oven-cured: 8H on steel', P2]].forEach(([s2, px], i) => text(s2, px, by + 70, { role: 'small', size: 24, weight: 700, color: C.ink, align: 'center', alpha: ep(t, 5.2 + i * 0.3, 5.6 + i * 0.3) }));
    rule(lx + 26, ly + 354, lx + lw - 26, ep(t, 5.8, 6.2));
    srf_step(t, 6.2, lx + 26, ly + 388, lw - 52,
      { who: 'PMM AIM 8K', line: 'Air-dried ceramic: "improves grip significantly" (EloShapes). It wore (Brock). No hardness published.', lines: 2 },
      { line: 'Baked; hardness, adhesion and mass measured on the shell.', ev: ['proposal'], lines: 1 }, { gap: 14 });
    /* right: the pencil-hardness ladder, then wear */
    const rx = 980, rw = RM - rx, ry = LAY.top;
    srf_card(t, 0.5, rx, ry, rw, lh, 'Pencil hardness, ASTM D3363', ['study', 'datasheet', 'claim']);
    const gx0 = rx + 360, gw = rw - 500, GX = i => gx0 + gw * i / 17, a0 = ep(t, 0.9, 1.4), y0 = ry + 120, rg = 64, yb = y0 + 4 * rg + 34;
    srf_GRADES.forEach((g, i) => { line(GX(i), y0 - 26, GX(i), yb - 4, { color: C.hair, w: 1, alpha: a0 }); if (i % 2 === 1) text(g, GX(i), yb + 22, { role: 'tick', size: 19, color: C.mute, align: 'center', alpha: a0 }); });
    const rows = [['Soft-touch rubber', 'RadTech 2016', 4, C.comp, '7B–3B', 'study'], ['Air-cured ceramic', 'Cerakote C-299', 11, C.comp, '3H', 'datasheet'], ['Oven-cured, on steel', 'Cerakote H-167, 250 °F', 16, C.ink, '8H', 'datasheet'], ['Elite series', 'Cerakote', 17, C.comp, '>9H', 'claim']];
    rows.forEach(([l, sub, b, col, lab, ev], i) => {
      const y = y0 + i * rg, k = ep(t, 1.2 + i * 0.25, 2.0 + i * 0.25, E.snap), al = ep(t, 1.0 + i * 0.25, 1.4 + i * 0.25);
      evDot(rx + 30, y - 6, ev, 5, al);
      text(l, rx + 46, y + 2, { role: 'small', size: 24, weight: 700, color: C.ink, alpha: al });
      text(sub, rx + 46, y + 28, { role: 'label', size: 19, color: C.mute, alpha: al });
      rr(GX(0), y - 8, Math.max(16, (GX(b) - GX(0)) * k), 16, 8, col, null, 0, al);
      text(lab, GX(b) + 14, y + 8, { font: 'mono', size: 24, weight: 800, color: C.ink, alpha: ep(t, 1.8 + i * 0.25, 2.2 + i * 0.25) });
    });
    const ty = y0 + 4 * rg, kt = ep(t, 3.0, 3.5);
    rect(rx, ty - 26, 6, 56, { fill: C.hero, alpha: kt });
    evDot(rx + 30, ty - 6, 'proposal', 5, kt);
    text('Theseus, on CF-PP', rx + 46, ty + 2, { role: 'small', size: 24, weight: 800, color: C.ink, alpha: kt });
    text('150–180 °F cure', rx + 46, ty + 28, { role: 'label', size: 19, color: C.heroText, alpha: kt });
    G.save(); G.globalAlpha = kt; G.setLineDash([6, 5]); rrPath(GX(0), ty - 8, (GX(16) - GX(0)) * ep(t, 3.2, 4.0, E.cam), 16, 8); G.strokeStyle = C.heroText; G.lineWidth = 2; G.stroke(); G.restore();
    text('Aim 8H?', GX(16) + 14, ty + 8, { font: 'mono', size: 24, weight: 800, color: C.heroText, alpha: ep(t, 3.8, 4.2) });
    text('To measure on the shell', GX(8), ty - 18, { role: 'label', size: 19, color: C.heroText, align: 'center', alpha: ep(t, 3.8, 4.2) });
    rule(rx + 26, yb + 50, rx + rw - 26, ep(t, 4.0, 4.4));
    para([{ s: 'Wear. ', role: 'small', size: 25, weight: 700, color: C.ink }, { s: 'Soft-touch wore through in 31 to 300+ rub cycles (RadTech). Cerakote claims over 8,000 Taber cycles per mil for Elite. Different tests, so no shared axis.', role: 'small', size: 25, weight: 450, color: C.ink2 }], rx + 26, yb + 92, { maxW: rw - 52, lh: 33, t, t0: 4.2, cps: 150, maxLines: 3 });
    gloss(t, 6.8, 'Pencil hardness', 'Graded pencils are pushed across the film at 45°. The rating is the hardest one that leaves no mark; 9H is the top of the scale.');
    featureCard(t, 7.2, 'A baked ceramic coat', ['datasheet', 'derived', 'proposal'], 'Oven-cured, not air-dried (#16). One 1-mil coat: 34.7 g/m² × 133 cm² of shell, 0.35 to 0.46 g, at most 1.6% of 29 g.');
  }
});

/** the step further as the slide's band: the best shipping version on the left (grey dash), the Theseus step on the right (yellow dash) */
function srf_pillsR(xr, y, kinds, a) { for (let i = kinds.length - 1; i >= 0; i--) { xr -= pillW(kinds[i]); pill(xr, y + 1, kinds[i], a); xr -= 10; } }
function srf_stepBand(t, t0, best, step) {
  const w = 820, x2 = W / 2 + 40, w2 = RM - x2;
  bandBlock(t, t0, LM, w, 'Best today', best.who, best.line, { color: C.comp, right: (y, a) => srf_pillsR(LM + w, y, best.ev || [], a) });
  bandBlock(t, t0 + 0.7, x2, w2, 'Theseus, one step further', step.who, step.line, { color: C.hero, right: (y, a) => srf_pillsR(RM, y, step.ev || ['proposal'], a) });
}

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
const SRF_MU = { along: 0.42, across: 0.53, coarse: 2 };   /* Zhang 2017 at 1 N (laser grooves on steel); Sergachev 2022 (up to 2x) */
S({
  id: 'grip', ch: 'surface', theme: 'paper', title: 'Directional grip', settle: 11.5, ideas: [60],
  src: ['srf_zhang17', 'srf_serg22', 'srf_doc'],
  draw: t => {
    header(t, 'Directional grip');
    captions(t, [[0.6, 'Etched ridges hold a fingertip hardest when it slides across them, and let it slide along them.'], [6.4, 'Grip tape grips the same in every direction. An etch can grip one way and leave every other way free.']]);
    const top = 296, gl = golden(LM, RM - LM, 24), [mx, mw] = gl.a, [px, pw] = gl.b, mh = 476, B = [mx, top, mw, mh];
    /* the macro: laser-cut grooves in the coat; a studio light sweeps once across them; the camera pushes in slowly */
    demoWindow(mx, top, mw, mh, tileA(t, 0.2, 0), { r: SRF.r });
    const f = srf_field('grip:ridge', 1000, 450, ff => srf_genFilm(ff, { pat: 'ridge', pitch: 40, width: 22, depth: 6, ang: 0, seed: 5, bend: 120 }));
    srf_macro(t, f, mx, top, mw, mh, { light: srf_sweep(t, f, 0.5, 3.4), zoom: 1 + 0.08 * ep(t, 0.5, 11.5, E.io3), alpha: ep(t, 0.35, 1.1) });
    text('Laser-cut grooves in the coat (illustrative)', mx + 32, top + mh - 30, { role: 'small', size: 24, weight: 500, color: 'rgba(255,255,255,0.7)', alpha: ep(t, 1.0, 1.4) });
    /* the fingertip, dragged by the pointer, and the friction that holds it back */
    const gp = srf_gripPath(t, B), th = gp.dir, mu = srf_mu(SRF_MU.along, SRF_MU.across, th), ux = Math.cos(th), uy = Math.sin(th);
    const lag = gp.mv * (8 + 18 * mu), tp = [gp.p[0] - ux * lag, gp.p[1] - uy * lag];
    G.save(); rrPath(mx, top, mw, mh, SRF.r); G.clip();
    srf_tip(tp[0], tp[1], 58, { a: ep(t, 1.9, 2.3), rot: th, stretch: gp.mv * 0.05 * mu / 0.5 });
    if (gp.mv > 0) { const L = 104 * mu / 0.5; arrow(tp[0] - ux * 64, tp[1] - uy * 64, tp[0] - ux * (64 + L), tp[1] - uy * (64 + L), { color: C.hero, w: 5, hs: 18, alpha: 0.95 }); }
    cursorPtr(gp.p[0] + 6, gp.p[1] + 6, { a: ep(t, 1.6, 1.9) * (1 - ep(t, 10.6, 11.0)), grab: gp.mv > 0, fill: '#FFFFFF', edge: '#111111' });
    G.restore();
    /* friction by direction: the live value, and its polar plot traced as the finger turns */
    demoWindow(px, top, pw, mh, tileA(t, 0.2, 1), { r: SRF.r });
    cardHead(t, 0.5, px, top, pw, 'By direction', [{ ev: 'study', by: 'Zhang 2017' }]);
    const kr = ep(t, 2.5, 2.9), live = gp.ph === 'across' ? SRF_MU.across : gp.ph === 'along' ? SRF_MU.along : gp.ph === 'turn' ? mu : null;
    if (live != null) {
      rich([{ s: 'μ', role: 'stat', size: 80, color: C.ink }, { s: live.toFixed(2), role: 'stat', size: 80, color: C.heroText, grad: C.heroGrad, gap: 14, tnum: true }], px + 32, top + 168, { alpha: kr });
      text(gp.ph === 'across' ? 'Across the ridges' : gp.ph === 'along' ? 'Along the ridges' : 'Turning', px + 32, top + 210, { role: 'small', size: 25, weight: 600, color: C.ink2, alpha: kr });
    } else if (gp.ph === 'rest') {
      const k = ep(t, 10.3, 10.7);
      rich([{ s: '1.26', role: 'stat', size: 80, color: C.heroText, grad: C.heroGrad, tnum: true, count: [10.3, 0.8, 1] }, { s: '×', role: 'stat', size: 56, color: C.heroText, gap: 6 }], px + 32, top + 168, { t, alpha: k });
      text('Across against along', px + 32, top + 210, { role: 'small', size: 25, weight: 600, color: C.ink2, alpha: k });
    }
    const pc = [px + pw - 196, top + 214], R = 74, nrm = c => ({ a: 2 * c.a / (c.a + c.b), b: 2 * c.b / (c.a + c.b) });
    const fine = nrm({ a: SRF_MU.along, b: SRF_MU.across }), coarse = nrm({ a: 1, b: SRF_MU.coarse });
    glowField(t, pc[0], pc[1], 170, { a: 0.6 * ep(t, 7.3, 9.0) });
    srf_polar(t, 0.8, pc[0], pc[1], R, [
      { a: 1, b: 1, color: C.second, w: 3 },
      { a: coarse.a, b: coarse.b, color: C.heroText, w: 2.5, dash: [7, 6], alpha: ep(t, 10.4, 11.0) },
      { a: fine.a, b: fine.b, color: C.hero, w: 4.5, p: gp.ph === 'turn' ? gp.turn : gp.ph === 'rest' ? 1 : 0, th0: -(Math.PI / 2), cw: true }
    ], { lr: 1.5 });
    if (live != null) { const r = srf_mu(fine.a, fine.b, th) * R, q = [pc[0] + r * ux, pc[1] + r * uy]; line(pc[0], pc[1], q[0], q[1], { color: C.hero, w: 2.5, alpha: kr }); circle(q[0], q[1], 7, { fill: C.hero, alpha: kr }); }
    /* the legend */
    [[C.hero, null, 'Fine laser grooves', '0.42 along, 0.53 across', 2.6], [C.heroText, [7, 6], 'Coarser texture', 'Up to 2× across', 10.4], [C.second, null, 'Grip tape', 'The same every way', 0.9]].forEach(([c, dash, nm, sub, t0], i) => {
      const k = ep(t, t0, t0 + 0.4), yy = top + 344 + i * 40;
      line(px + 32, yy - 7, px + 62, yy - 7, { color: c, w: 4, dash: dash || [], alpha: k });
      rich([{ s: nm, role: 'label', size: 19, color: C.ink }, { s: sub, role: 'small', size: 24, weight: 450, color: C.mute, gap: 12, caps: false }], px + 76, yy, { alpha: k });
    });
    text('Each curve is shown ÷ its own average', px + 32, top + mh - 26, { role: 'small', size: 24, weight: 450, color: C.faint, alpha: ep(t, 1.2, 1.6) });
    /* the word, under the drawing; the research, under the plot */
    glossBox(t, 7.0, mx, top + mh + 24, mw, 'Anisotropic friction', 'Friction that changes with the direction of the slide: ridges catch a fingertip crossing them, and along them it glides.');
    sourceBox(t, 3.0, px, top + mh + 24, pw, 'Zhang et al. 2017', '20 µm laser grooves in steel: a fingertip slid at μ 0.42 along them and 0.53 across.', { kind: 'study', label: 'Measured' });
  }
});

/* ============================== #36 #62 #61 #33 #32 the marks ============================== */
S({
  id: 'srf_marks', ch: 'surface', theme: 'paper', title: 'Marks you see, not feel', settle: 10, ideas: [36, 62, 61, 33, 32], three: ['shell', 'shell-sora'],
  src: ['srf_doc', 'ulxComp', 'gmk', 'srf_scan'],
  draw: t => {
    header(t, 'Marks you see, not feel');
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
      const ft = pj(-13, 23, 36);
      text('Fingertips rest here', ft[0] + 40, ft[1] + 6, { role: 'label', size: 21, color: acc(), alpha: kz });
    }
    const pS = pj(-15.9, 31, 13.5), pL = pj(19.2, 14.8, 50.5), pR = pj(-19.2, 14.8, 50.5);
    callout(t, 4.0, [pS[0] + 4, pS[1] + 10], 'Serial (#36)', { to: [lx + lw - 30, ly + lh - 120], side: 'l', color: C.ink, elbow: pS[0] + 60 });
    callout(t, 4.3, [pL[0], pL[1] - 6], 'LT (#62)', { to: [lx + 40, ly + 120], side: 'r', color: C.ink, elbow: lx + 100 });
    callout(t, 4.5, [pR[0], pR[1] - 6], 'RT (#62)', { to: [lx + lw - 40, ly + 120], side: 'l', color: C.ink, elbow: lx + lw - 100 });
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
    text('3 digits, 6.4 mm tall', sx0 + sw - 22, ly + sh - 22, { role: 'label', size: 19, color: C.ink2, align: 'right', alpha: ep(t, 4.6, 5.0) });
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
  src: ['inglis', 'fracMech', 'vernier', 'curiosity', 'srf_doc'],
  draw: t => {
    header(t, 'Engrave half as deep');
    captions(t, [[0.6, 'An engraving is a notch, and a notch multiplies stress at its tip. Half the depth takes the peak from 5 times the wall\'s stress to 3.8.'], [5.4, 'The eye catches a broken edge at 0.012 mm, a twelfth of the smallest dot it sees. So a gate mark has to be hidden, not just made small.']]);
    const A = acc(), lx = LM, ly = LAY.top, lw = 900, lh = 580;
    srf_card(t, 0.3, lx, ly, lw, lh, 'A notch in a 1.6 mm wall, under load', ['derived']);
    const a = t < 9 ? lerp(0.6, 0.3, ep(t, 3.2, 4.4, E.io3)) : lerp(0.3, 0.6, 0.5 - 0.5 * Math.cos((t - 9) * TAU / 8)), rho = 0.15;
    part(lx + 54, ly + 118, 44, () => notchMM({ depth: a, rho, accent: A }), { alpha: ep(t, 0.4, 0.9) });
    for (const dx of [0, 1]) { const x = dx ? lx + 54 + 18 * 44 + 8 : lx + 46; arrow(x, ly + 118 + 35, x + (dx ? 40 : -40), ly + 118 + 35, { color: C.ink2, w: 3, hs: 11, alpha: ep(t, 1.0, 1.4) }); }
    const kt = 1 + 2 * Math.sqrt(a / rho);
    text(`Depth ${a.toFixed(2)} mm, tip radius ${rho} mm`, lx + 54, ly + 222, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    rich([{ s: 'Kt = 1 + 2√(a/ρ) =', font: 'mono', size: 24, weight: 600, color: C.mute }, { s: kt.toFixed(2), role: 'stat', size: 56, color: kt > 4.5 ? C.red : C.ink, gap: 14, tnum: true }], lx + lw - 30, ly + 274, { align: 'right', alpha: ep(t, 1.4, 1.8) });
    const m = axes(t, { x: lx + 110, y: ly + 306, w: lw - 170, h: 160, xr: [0, 0.8], yr: [1, 6], xticks: [0, 0.2, 0.4, 0.6, 0.8], yticks: [1, 2, 3, 4, 5, 6], xfmt: v => v.toFixed(1) + ' mm', yfmt: v => v + '×', xlabel: 'Engraving depth', t0: 1.6 });
    const pts = []; for (let d = 0; d <= 0.8; d += 0.01) pts.push([d, 1 + 2 * Math.sqrt(d / rho)]);
    series(m, pts, { color: C.ink2, w: 3, p: ep(t, 2.0, 3.0, E.lin) });
    for (const [d, col] of [[0.6, C.red], [0.3, A]]) { const k = ep(t, 3.0 + (d < 0.5 ? 1.4 : 0), 3.4 + (d < 0.5 ? 1.4 : 0)), v = 1 + 2 * Math.sqrt(d / rho); circle(m.X(d), m.Y(v), 7, { fill: col, alpha: k }); text(v.toFixed(2) + '×', m.X(d) + 12, m.Y(v) + (d < 0.5 ? 26 : -12), { font: 'mono', size: 22, weight: 700, color: col, alpha: k }); }
    circle(m.X(a), m.Y(kt), 12, { color: C.ink, w: 1.5, alpha: ep(t, 3.0, 3.4) * 0.6 });
    text('Half the depth: 23% less peak stress', m.X(0.3), m.Y(1.55), { role: 'small', size: 25, weight: 700, color: A, alpha: ep(t, 4.6, 5.0) });
    /* right: what the eye catches */
    const rx = 1004, rw = RM - rx;
    srf_card(t, 0.5, rx, ly, rw, lh, 'What the eye catches at 50 cm', ['study']);
    text('Drawn 400× life size', rx + rw - 26, ly + 88, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: ep(t, 1.2, 1.6) });
    const ex0 = rx + 60, ex1 = rx + rw - 60, ey = ly + 170, k1 = ep(t, 1.6, 2.2), step = 0.012 * 400;
    line(ex0, ey, lerp(ex0, (ex0 + ex1) / 2, k1), ey, { color: C.ink, w: 3 });
    if (k1 >= 1) line((ex0 + ex1) / 2, ey + step, lerp((ex0 + ex1) / 2, ex1, ep(t, 2.2, 2.8)), ey + step, { color: C.ink, w: 3 });
    rich([{ s: 'A break in an edge', role: 'small', size: 25, weight: 700, color: C.ink }, { s: '0.012 mm', font: 'mono', size: 25, weight: 800, color: A, gap: 14 }], rx + 60, ey + 52, { alpha: ep(t, 2.6, 3.0) });
    text('Vernier acuity: 2 to 5 arcseconds', rx + 60, ey + 86, { role: 'small', size: 25, color: C.mute, alpha: ep(t, 2.8, 3.2) });
    const dd = 0.145 * 400, dk = ep(t, 3.4, 3.9, E.snap), cyD = ly + 352;
    circle(rx + 60 + dd / 2, cyD, dd / 2 * dk, { fill: C.ink });
    rich([{ s: 'The smallest dot', role: 'small', size: 25, weight: 700, color: C.ink }, { s: '0.145 mm', font: 'mono', size: 25, weight: 800, color: C.ink, gap: 14 }], rx + 90 + dd, cyD - 4, { alpha: dk });
    text('Acuity: about 60 arcseconds', rx + 90 + dd, cyD + 30, { role: 'small', size: 25, color: C.mute, alpha: dk });
    rule(rx + 26, ly + 430, rx + rw - 26, ep(t, 4.4, 4.8));
    text('A gate mark breaks an edge, so it shows at a twelfth of the size of detail. It goes on a face you never see.', rx + 26, ly + 472, { role: 'small', size: 25, weight: 600, color: C.ink, t, t0: 4.6, cps: 110, maxW: rw - 200, lh: 1.36 });
    keyPlan(t, 1.0, rx + rw - 84, ly + 474, { s: 0.42, hi: ['trigL', 'trigR'], detail: { x: -13, y: -36, r: 9 }, label: 'Not here' });
    gloss(t, 6.2, 'Stress concentration', 'Load crowds around the tip of a notch. A deep, sharp notch multiplies the local stress several times over, and cracks start there.');
    featureCard(t, 6.6, 'Half-depth engravings, hidden gates', ['derived', 'study', 'proposal'], 'Engravings half as deep (#34), and gate marks moved to faces you never see, not just made smaller (#82).');
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
  src: ['srf_register', 'curiosity', 'srf_wheel3d', 'srf_az31b', 'srf_al6061', 'srf_ss304', 'srf_delrin', 'exXbabWeight', 'srf_doc'],
  draw: t => {
    header(t, 'Magnesium, with a rover\'s tread');
    captions(t, [[0.6, 'Curiosity\'s 24 chevron treads cracked on sharp rock. Perseverance rolls on 48 gently curved ones, and so does this wheel.'], [5.6, 'Magnesium is the lightest metal for it: the same wheel in aluminium would weigh 53% more, in stainless steel four times as much.']]);
    const lx = LM, ly = LAY.top, lw = 900, lh = 580;
    demoWindow(lx, ly, lw, lh, ep(t, 0.3, 0.7));
    const wv = { view: [0.55, 0.45, 0.9], zoom: 1.75, scroll: 0.22 * t, xray: 0, explode: 0.3 * env(t, 1.6, 2.6, 4.2, 5.2) };
    const pt = { g: [lx + 520, ly + 180], sp: [lx + 470, ly + 360], cr: [lx + 400, ly + 250], ax: [lx + 560, ly + 300] };
    if (V2D.on) {
      /* two views of one wheel: from the side (the spokes and the treads, turning) and from the front (the crown, the axle) */
      const sb = [lx + 24, ly + 84, 380, 440], fb = [lx + 396, ly + 84, 236, 440];
      const sv = Object.assign({}, wv, { view2d: 'right', zoom: 1.34, target: [0, 11, 0], explode: 0, hide2d: /encoder|support/ }), fv = Object.assign({}, wv, { view2d: 'front', zoom: 1.32, target: [-1.85, 11, 0] });
      srf_3d(t, 0.4, 'wheel', sb[0], sb[1], sb[2], sb[3], sv);
      srf_3d(t, 0.6, 'wheel', fb[0], fb[1], fb[2], fb[3], fv);
      const k = ep(t, 0.6, 1.0);
      text('Side', sb[0] + sb[2] / 2, sb[1] + sb[3] + 22, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: k });
      text('Front', fb[0] + fb[2] / 2, fb[1] + fb[3] + 22, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: k });
      pt.g = v2dAt('wheel', sv, sb, /wheel\/grousers$/, [0.5, 1, 0.5]) || pt.g; pt.sp = v2dAt('wheel', sv, sb, /wheel\/web$/, [0.5, 0.3, 0.5]) || pt.sp;
      pt.cr = v2dAt('wheel', fv, fb, /wheel\/tread$/, [0.5, 1, 0.5]) || pt.cr; pt.ax = v2dAt('wheel', fv, fb, /axle\/axleR$/, [0.5, 0.5, 0.5]) || pt.ax;
    } else srf_3d(t, 0.4, 'wheel', lx, ly, lw, lh, wv);
    rich([{ s: 'Fig. 01', role: 'label', size: 21, color: C.mute }, { s: V2D.on ? 'Magnesium wheel and POM axle, two views' : 'Magnesium wheel, POM axle, optical encoder (render)', role: 'small', size: 24, color: C.faint, gap: 16 }], lx + 26, ly + 46, { alpha: ep(t, 0.6, 1.0) });
    callout(t, 2.0, pt.g, '48 curved grousers', { to: [lx + 610, ly + 120], side: 'r', color: C.ink });
    callout(t, 2.4, pt.sp, 'Six spokes', { to: [lx + 648, ly + 420], side: 'r', color: C.ink, sub: 'Triangular windows' });
    callout(t, 2.8, pt.cr, 'Crown, R 11 mm both ways', { to: in2D([lx + 648, ly + 220], [lx + 60, ly + 140]), side: 'r', color: C.ink, prose: true, maxW: in2D(220, 260) });
    callout(t, 3.2, pt.ax, 'POM axle', { to: [lx + 648, ly + 330], side: 'r', color: C.ink });
    /* right top: rover treads, unrolled */
    const rx = 1004, rw = RM - rx, th = 262;
    srf_card(t, 0.5, rx, ly, rw, th, 'Rover treads, unrolled', ['datasheet']);
    const sx = rx + 250, swd = rw - 276, rowsT = [['Curiosity', '24 chevrons', 24, 'chevron', C.comp], ['Perseverance', '48 curved', 48, 'curve', C.ink], ['Theseus wheel', '48 curved', 48, 'curve', C.hero]];
    rowsT.forEach(([nm, sub, n, kind, col], i) => {
      const y = ly + 92 + i * 56, a = ep(t, 1.0 + i * 0.3, 1.4 + i * 0.3);
      if (i === 2) rect(rx, y - 6, 6, 50, { fill: C.hero, alpha: a });
      text(nm, rx + 26, y + 18, { role: 'small', size: 24, weight: i === 2 ? 800 : 700, color: C.ink, alpha: a });
      text(sub, rx + 26, y + 42, { role: 'label', size: 19, color: i === 2 ? C.heroText : C.mute, alpha: a });
      srf_tread(sx, y, swd, 44, n, kind, (t * 0.35) % 1, i === 2 ? (TH ? '#9A9890' : '#C9C8C2') : col, a);
      if (i === 2) rr(sx, y, swd, 44, 6, null, C.hero, 2.5, a);
    });
    /* right bottom: the same wheel in other materials */
    const my = ly + th + 24, mh = LAY.bottom - my;
    srf_card(t, 0.8, rx, my, rw, mh, 'This wheel, by material', ['derived']);
    text('825 mm³ × density', rx + 26, my + 84, { role: 'small', size: 24, color: C.mute, alpha: ep(t, 1.2, 1.6) });
    const V = 0.825, mats = [['POM', 'Delrin 150, 1.42', 1.42], ['Magnesium AZ31B', '1.77 g/cm³', 1.77, true], ['Aluminium 6061', '2.70 g/cm³', 2.70], ['Stainless 304', '7.89 g/cm³', 7.89]];
    const yEnd = srf_bars(t, 1.6, { x: rx + 26, y: my + 132, w: rw - 52, xr: [0, 7], labelW: 280, valW: 110, rowH: 44, dec: 2, unit: 'g',
      rows: mats.map(([n, s2, d, hero]) => ({ name: n, v: V * d, hero, label: fmtN(V * d, 2) + ' g' })) });
    const kx = ep(t, 3.4, 3.8), bx = rx + 26 + 280, bw = rw - 52 - 280 - 110, xx = bx + bw * 0.931 / 7;
    line(xx, my + 104, xx, yEnd - 14, { color: C.ink, w: 2, dash: [5, 4], alpha: kx });
    text('XA25 wheel, weighed: 0.931 g', xx + 10, my + 106, { role: 'label', size: 19, color: C.ink, alpha: kx });
    srf_stepBand(t, 6.4, { who: 'Metal wheels', line: 'All high-end mice have one now (Brock), and some add a rubber ring over the metal for grip.' },
      { who: 'Magnesium, tread and ceramic', line: 'The grousers and a ceramic coat grip, so there is no rubber to wear. Weighed and slip-tested wet and dry before I publish it.', ev: ['proposal'] });
  }
});

/* ============================== the optical encoder ============================== */
/** wheel angle (rad) over time: up for 6 s, back down for 6 s */
const srf_scrollAt = t => { const p = ((t % 12) + 12) % 12; return 0.55 * (p < 6 ? p : 12 - p); };
S({
  id: 'srf_encoder', ch: 'surface', theme: 'night', title: 'Count the steps with light', settle: 10, ideas: ['encoder', 84], three: ['wheel'],
  src: ['srf_razerScroll', 'srf_tpuV4', 'pulsarEnc', 'srf_eloEnc', 'srf_wheel3d'],
  draw: t => {
    header(t, 'Count the steps with light');
    captions(t, [[0.6, 'A mechanical encoder counts with sliding contacts, and dust or a spill makes them skip. An optical one counts with light, and nothing touches.'], [5.4, 'Four of the 35 mice in my data use one: two Razers, two ZOWIEs. Razer calls its own 3.3 times more reliable, without saying how it measured that.']]);
    const A = acc(), lx = LM, ly = LAY.top, lw = 1000, lh = 580, th = srf_scrollAt(t);
    demoWindow(lx, ly, lw, lh, ep(t, 0.3, 0.7));
    const ev = { view: [-0.35, 0.32, 1], target: [-5.5, 10.5, 0], zoom: 2.25, scroll: th, xray: ep(t, 0.8, 2.0), explode: 0 };
    srf_3d(t, 0.4, 'wheel', lx, ly, lw, lh, ev);
    text('X-ray, encoder side', lx + 26, ly + 46, { role: 'label', size: 21, color: C.mute, alpha: ep(t, 0.6, 1.0) });
    const eb = [lx, ly, lw, lh], ea = (re, f, p) => (V2D.on && v2dAt('wheel', ev, eb, re, f)) || p;
    callout(t, 2.2, ea(/emitter\/emitterBody$/, [0.5, 0.5, 0.5], [lx + 300, ly + 250]), 'IR emitter', { to: [lx + 120, ly + 150], side: 'r', color: C.ink });
    callout(t, 2.5, ea(/encoderRotor\/disc$/, [0.5, 0.12, 0.5], [lx + 330, ly + 330]), 'Code disc, 24 slots', { to: [lx + 90, ly + 430], side: 'r', color: C.ink });
    callout(t, 2.8, ea(/detector\/detectorBody$/, [0.5, 0.5, 0.5], [lx + 420, ly + 270]), 'Detectors A and B', { to: [lx + 560, ly + 120], side: 'r', color: C.ink });
    callout(t, 3.1, ea(/axle\/axleR$/, [0.6, 0.5, 0.5], [lx + 520, ly + 360]), 'POM axle', { to: [lx + 760, ly + 500], side: 'r', color: C.ink });
    /* right top: the two light gates, a quarter-step apart, as a logic trace */
    const rx = 1104, rw = RM - rx, sh = 270;
    srf_card(t, 0.6, rx, ly, rw, sh, 'Two light gates, a quarter-step apart', ['derived']);
    const deg = 180 / Math.PI, slot = 15, gA = a => (((a % slot) + slot) % slot) < slot / 2 ? 1 : 0, gB = a => gA(a - slot / 4);
    const x0 = rx + 76, x1 = rx + rw - 30, N = 180, win = 3.0, ka = ep(t, 1.2, 1.6);
    [['A', gA, 0], ['B', gB, 1]].forEach(([nm, fn, i]) => {
      const yb = ly + 150 + i * 70, hh = 36;
      text(nm, rx + 30, yb - 6, { font: 'mono', size: 24, weight: 800, color: i ? C.ink : A, alpha: ka });
      G.save(); G.globalAlpha = ka; G.strokeStyle = i ? C.ink : A; G.lineWidth = 3; G.beginPath();
      for (let j = 0; j <= N; j++) { const tt = t - win + win * j / N, v = fn(srf_scrollAt(Math.max(0, tt)) * deg), xx = lerp(x0, x1, j / N), yy = yb - v * hh; j ? G.lineTo(xx, yy) : G.moveTo(xx, yy); }
      G.stroke(); G.restore();
    });
    const stepN = Math.floor(th * deg / slot), up = ((t % 12) + 12) % 12 < 6;
    rich([{ s: 'Step', role: 'label', size: 21, color: C.mute }, { s: String(stepN).padStart(2, '0'), font: 'mono', size: 30, weight: 800, color: C.ink, gap: 12, tnum: true }, { s: up ? 'A leads: up' : 'B leads: down', role: 'label', size: 21, color: A, gap: 24 }], rx + 30, ly + sh - 28, { alpha: ka });
    /* right bottom: 35 mice by encoder */
    const my = ly + sh + 24, mh = LAY.bottom - my;
    srf_card(t, 0.9, rx, my, rw, mh, '35 mice, by encoder', ['datasheet']);
    const mice = ((RD.mice || {}).mice || []), opt = mice.filter(m => /optical/i.test(String(rv(m.encoder)))), n = mice.length || 35;
    const cols = 7, gx = rx + 40, gy = my + 104, sp = 34;
    for (let i = 0; i < n; i++) { const c = i % cols, r = Math.floor(i / cols), k = ep(t, 1.4 + i * 0.03, 1.8 + i * 0.03), X = gx + c * sp, Y = gy + r * sp; if (i < opt.length) circle(X, Y, 11 * k, { fill: C.ink }); else circle(X, Y, 10 * k, { color: C.comp, w: 2.5 }); }
    const tx = gx + cols * sp + 30, kt = ep(t, 2.6, 3.0);
    rich([{ s: String(opt.length || 4), font: 'mono', size: 30, weight: 800, color: C.ink }, { s: 'optical', role: 'label', size: 21, color: C.ink, gap: 12 }], tx, gy + 6, { alpha: kt });
    text(opt.map(m => exShort(m.name).replace('Razer ', '').replace('ZOWIE ', '')).join(', ') || 'Viper V4 Pro, DeathAdder V4 Pro, EC2-DW, U2-DW', tx, gy + 40, { role: 'small', size: 24, color: C.ink2, maxW: RM - tx - 26, lh: 1.3, alpha: kt });
    rich([{ s: String(n - opt.length), font: 'mono', size: 30, weight: 800, color: C.ink2 }, { s: 'mechanical', role: 'label', size: 21, color: C.mute, gap: 12 }], tx, gy + 128, { alpha: ep(t, 2.9, 3.3) });
    srf_stepBand(t, 6.2, { who: 'Razer optical wheel', line: '"3.3 times more reliable than traditional mechanical designs", with no measure given. TechPowerUp: "arguably the best one currently available".', ev: ['claim'] },
      { who: 'Optical, sealed, published', line: 'An optical encoder in a closed wheel bay on a POM axle, with its detent torque and its missed steps after a dust test published.', ev: ['proposal'] });
  }
});
