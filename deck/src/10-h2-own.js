/* ============================================================================================
   7 · OWNERSHIP, the joint an owner opens: the M2 combination-drive screw (#9), the brass heat-set insert it runs in
   (#101), and what a thread in plastic does when it is opened and closed again (F2.01, decided in F3.3 and F6.1).
   Slides: ownscrew, own_insert, own_life. They follow 'repair'.
   The drawings are in mm, to the 3D models' geometry (3d/parts/lib/panhead.js, 3d/parts/fasteners.js): the ISO 7045
   pan head with its cross recess No. 0 and ISO 1580 slot, the M2 × 0.4 ISO 68-1 thread, the knurled M2 × 3 insert,
   the carbon-filled boss and the 1 mm board. Every top-level name starts with own_ / OWN_.
   ============================================================================================ */
Object.assign(SRC, {
  ownIso7045w: { t: 'fasten.it, DIN EN ISO 7045 table: M2 pan head with cross recess, dk 4 mm, k 1.6 mm, recess No. 0, m 1.9 mm (type H)', u: 'https://fasten.it/Norms/Norm/DIN_EN_ISO_7045' },
  ownIso1580: { t: 'fasten.it, DIN EN ISO 1580 table: M2 slotted pan head, slot width n 0.5 mm, slot depth t 0.5 mm minimum', u: 'https://fasten.it/Norms/Norm/DIN_EN_ISO_1580' },
  ownIso68: { t: 'ISO 68-1 basic profile of metric threads, as given in "ISO metric screw thread" (Wikipedia): 60° flanks, H = 0.866P, d2 = d − 0.6495P', u: 'https://en.wikipedia.org/wiki/ISO_metric_screw_thread' },
  ownIso898: { t: 'ISO 898-1:2013, tensile stress area of a metric thread: As = π/4 · ((d2 + d3)/2)², d2 = d − 0.6495P, d3 = d − 1.2269P. M1.6 × 0.35: 1.27 mm²; M2 × 0.4: 2.07 mm² (derived)', u: 'https://www.iso.org/standard/60963.html' },
  ownTi: { t: 'ASM Aerospace Specification Metals, titanium Ti-6Al-4V (grade 5), annealed: density 4.43 g/cc; hardness 36 HRC (349 HV, converted); ultimate tensile strength 950 MPa, yield 880 MPa; magnetic permeability 1.00005; "tends to seize when in sliding contact with itself and other metals"', u: 'https://www.aerospacemetals.com/wp-content/uploads/2023/07/Titanium-Ti-6Al-4V-Grade-5-Annealed.pdf' },
  ownSteelRho: { t: 'MakeItFrom, SAE-AISI 1022 (G10220) carbon steel: density 7.9 g/cm³ (the steel screw the titanium one replaces)', u: 'https://makeitfrom.com/material-properties/SAE-AISI-1022-G10220-Carbon-Steel' },
  ownTiMin: { t: 'ASTM B348 grade 5 (6Al-4V) bar, minimum tensile properties as Performance Titanium lists them: tensile strength 130 ksi (896 MPa), yield 120 ksi (827 MPa), elongation 10%', u: 'https://performancetitanium.com/?p=391' },
  ownIso7045m: { t: 'ISO 7045:2011 (pan head screws with type H or Z cross recess), Table 2: steel, property class 4.8 (ISO 898-1); stainless steel, A2-50 or A2-70 (ISO 3506-1); electroplating to ISO 4042', u: 'https://cdn.standards.iteh.ai/samples/57372/fafe91d8504049fc8953281401736c79/ISO-7045-2011.pdf' },
  ownIso898p: { t: 'ISO 898-1 mechanical properties, as TR Fastenings tabulates them: property class 4.8: tensile strength 400 MPa nominal, 420 minimum, lower yield 340 minimum, Vickers hardness 130 to 220 HV (71 to 95 HRB); class 8.8: 830 MPa minimum, 255 to 336 HV. Stainless A2-70: 700 N/mm² minimum (Bossard, ISO 3506)', u: 'https://www.trfastenings.com/knowledge-base/metric-screws/screws-and-bolts-mechanical-properties' },
  ownStrip: { t: 'EngineerExcel, Thread stripping explained: "If the bolt has a higher shear strength than the nut, failure will likely occur at the root of the nut threads"; the stripping force is the shear area times the shear strength of the weaker material', u: 'https://engineerexcel.com/thread-stripping/' },
  ownTwi: { t: 'TWI, What is galling?: two surfaces seize by cold welding, "most commonly seen when tightening bolts made from materials such as stainless steel, aluminium or titanium"; prevented by lubricating the threads and by using different materials for the two parts', u: 'https://www.twi-global.com/technical-knowledge/faqs/what-is-galling' },
  ownTiCorr: { t: 'AZoM, Titanium alloys: corrosion and erosion resistance (from The Institute of Materials\' design guide, The Selection and Use of Titanium): "A stable, substantially inert oxide film provides the material with outstanding resistance to corrosion"', u: 'https://www.azom.com/article.aspx?ArticleID=1336' },
  ownRecess: { t: 'Čada, Frydrýšek, Sejda et al. 2017, J. Med. Biol. Eng. 37: 612–625, titanium-alloy locking bone screws: the drive recess fails when the bit deforms the head, the hexagon "was worn by plastic strains caused by the edges of the hexagonal bit", at 2.5 and 3.1 N·m. (The slide infers from this that a harder head dents less: hardness is resistance to that plastic strain.)', u: 'https://link.springer.com/article/10.1007/s40846-017-0279-4' },
  ownCumbicus: { t: 'Cumbicus, Estrems, Arizmendi & Jiménez 2023, Int. J. Adv. Manuf. Technol. 126: 5163–5178: 5 mm thread-forming screws in 30% glass-fibre PEI bosses, re-assembled ten times; loosening torque lost against the first tightening: PF-30 11.95% by the 3rd assembly, 15.31% by the 5th, 17.16% by the 10th; DELTA PT 56.73% at the 5th, 41.93% at the 10th', u: 'https://doi.org/10.1007/s00170-023-11422-0' },
  ownCovestro: { t: 'Covestro, Self-tapping screws for thermoplastics: thread-cutting screws suit "once-only assembly" or a few re-assemblies; "repeated assembly is only possible if the screw is carefully reinserted into the original thread (by hand)"; VDE 0700 asks for ten assemblies; tighten to at least 1.2 × the insertion torque, at most 0.5 × the stripping torque', u: 'https://solutions.covestro.com/-/media/covestro/solution-center/whitepapers/self-tapping-screws-for-thermoplastics.pdf' },
  ownPemM2: { t: 'PEM (PennEngineering), IUTFA / IUTFB / IUTFC-M2 heat-staking insert, installation and performance data: 255 N pull-out and 0.5 N·m torque-out in ABS; 578 N and 0.9 N·m in polycarbonate; hole 3.23 mm (+0.08)', u: 'https://www.pemnet.com/products/product-finder/iutfc-m2/' },
  own3dp: { t: '3D People, Threaded inserts white paper v1.0 (2022): brass heat-set inserts, M2 to M5, in SLS PA12, FDM PLA, Onyx and PETG; M2 pull strength 629.2 N; after 20 load cycles at 80% of the failure force the pull strength changed by 24.15 N on average (1.37%)', u: 'https://felix-manley-n4jm.squarespace.com/s/Threaded-Inserts-White-Paper-V1.pdf' },
  ownBrock: { t: 'Brock Liddicoat, In Pursuit of an Objectively Better Mouse: #9 (combination drive: Phillips self-centres, any flat blade as a fallback; M2; machine screws, not self-tapping), titanium screws (F25.4, 2026-11-05: "Titanium", in place of brass-plated carbon steel), #101 (brass heat-set inserts; Finalmouse uses M1.6 × 5 mm with a T5 head), M2 inserts 0.16 to 0.18 g, one screw size for everything, and "with metal on plastic even the tiniest difference in the angle you screw it will turn the screw into a bore ... if you have metal on metal you\'d need the force needed to deform the metal". His estimate of 2026-11-04: a joint screwed straight into ABS feels different after it is unscrewed and screwed back 90% of the time, carbon-filled plastic 70%', u: '', n: 'His judgement: no tag.' }
});

/** Brock's estimate (F6.1): the chance a joint feels different after it is unscrewed and screwed back in, screwed straight
   into the plastic: ABS 90 %, carbon-filled 70 % (Brock, 22:05: "lower than 85 %"; change it here). The insert's 0 follows from his doc
   (#101, line 731): a machine screw has no cutting flank, so in brass it can only follow the thread it came out of. */
const OWN_FEEL = { abs: 90, cf: 70, insert: 0 };

/* ---------- the pan head, exactly as the 3D model builds it (panhead.js): heights above the bearing face, in mm ---------- */
const OWN_M2 = { dk: 4.0, k: 1.6, rf: 3.2, fil: 0.32, uf: 0.1, blank: 0.87, n: 0.5, ts: 0.8, m: 1.9, wing: 0.42, tc: 1.0, xb: 0.3, rc: 0.18, cd: 0.16, P: 0.4, len: 5 };
const OWN_HD = (() => {
  const M = OWN_M2, R = M.dk / 2, dc = M.k - M.rf, fcx = R - M.fil, fcy = dc + Math.sqrt((M.rf - M.fil) ** 2 - fcx * fcx), rt = M.rf * fcx / (M.rf - M.fil);
  const H0 = r => r <= rt ? dc + Math.sqrt(Math.max(0, M.rf * M.rf - r * r)) : r <= R ? fcy + Math.sqrt(Math.max(0, M.fil * M.fil - (r - fcx) ** 2)) : 0;
  const ys = M.k - M.ts, yc = M.k - M.tc, m2 = M.m / 2, slope = (H0(m2) + 1e-3 - yc) / (m2 - M.xb);
  let lo = 0, hi = R; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (H0(mid) > ys) lo = mid; else hi = mid; }
  return { R, dc, fcx, fcy, rt, H0, ys, yc, slope, m2, rs: (lo + hi) / 2, F: s => yc + Math.max(0, s - M.xb) * slope, cone: r => yc - M.cd + M.cd * r / M.rc };
})();
/** the head's top surface at (x, z), the recess cut in: the slot runs along x, the cross arms along x and z, the cone at
   the centre. Returns the height above the bearing face, or -1 off the head */
function own_top(x, z) {
  const D = OWN_HD, M = OWN_M2, r = Math.hypot(x, z); if (r > D.R) return -1;
  const ax = Math.abs(x), az = Math.abs(z), w2 = M.wing / 2;
  let h = D.H0(r);
  if (az <= M.n / 2) h = Math.min(h, D.ys);
  if (az <= w2 && ax <= D.m2) h = Math.min(h, D.F(ax));
  if (ax <= w2 && az <= D.m2) h = Math.min(h, D.F(az));
  if (r < M.rc) h = Math.min(h, D.cone(r));
  return h;
}

/* ---------- threads, as radii in mm ----------
   m2: the 3D model's M2 × 0.4 (crest 0.985, root 0.752, ISO 68-1 flats P/8 and P/4). tf: a thread-forming screw for
   plastics (30° flanks on a wide pitch, PT style). cw / rw = crest and root flats as fractions of the pitch */
const OWN_TH = {
  m2: { P: 0.4, rc: 0.985, rr: 0.752, cw: 1 / 8, rw: 1 / 4, tipR: 0.62, tipL: 0.38 },
  tf: { P: 0.9, rc: 1.1, rr: 0.72, cw: 0.06, rw: 0.714, tipR: 0.5, tipL: 0.9 }
};
/** a periodic tooth: 1 on the crest flat, 0 on the root flat, straight flanks between; u in pitches */
function own_tooth(u, cw, rw) {
  let f = ((u % 1) + 1) % 1; if (f > 0.5) f = 1 - f;
  const c = cw / 2, r0 = 0.5 - rw / 2;
  return f <= c ? 1 : f >= r0 ? 0 : 1 - (f - c) / (r0 - c);
}
/** the thread's radius at axial position z (mm, down the screw), side sd (+1 right, -1 left: half a pitch apart). The
   helix is anchored to the part it runs in, so a screw turning in its own thread shows a still profile */
function own_r(T, z, ph, sd) { return T.rr + (T.rc - T.rr) * own_tooth((z - ph) / T.P + (sd < 0 ? 0.5 : 0), T.cw, T.rw); }
/** the screw's radius at z with its point: zt is where the tip is */
function own_rs(T, z, ph, sd, zt) { const r = own_r(T, z, ph, sd); return Math.min(r, T.tipR + Math.max(0, zt - z) * (T.rc - T.tipR) / T.tipL); }

/** the bore of a plain plastic boss after one or two drives of a thread-forming screw. Each drive cuts the screw's
   helix into the wall as deep as its tip reached; the second comes in tilted (rad, about the bore's mouth) and on
   another phase (mm), and cuts its own helix beside the first. Returns the wall (x each side, per OWN_DY of depth)
   after the first drive and after both */
const OWN_RP = 0.85, OWN_DY = 0.01, OWN_HOLE = 4.55;
function own_wallTF(reach1, reach2, tilt, ph2) {
  const T = OWN_TH.tf, N = Math.round(OWN_HOLE / OWN_DY);
  const R1 = new Float32Array(N + 1).fill(OWN_RP), L1 = new Float32Array(N + 1).fill(-OWN_RP);
  const pass = (R, L, reach, a, ph) => {
    if (reach <= 0.001) return;
    const c = Math.cos(a), s = Math.sin(a);
    for (let z = 0; z <= reach; z += 0.004) for (const sd of [1, -1]) {
      const r = own_rs(T, z, ph, sd, reach), xl = sd * r, X = xl * c - z * s, Y = xl * s + z * c, i = Math.round(Y / OWN_DY);
      if (i < 0 || i > N) continue;
      if (sd > 0) { if (X > R[i]) R[i] = X; } else if (X < L[i]) L[i] = X;
    }
  };
  pass(R1, L1, reach1, 0, 0);
  const R2 = R1.slice(), L2 = L1.slice();
  pass(R2, L2, reach2, tilt, ph2);
  return { R1, L1, R2, L2, N };
}

/* ---------- metal finishes across a cylinder seen from the side ---------- */
/* titanium (F25.4): the screw is bare Ti-6Al-4V grade 5, a warm mid grey; OWN_TIM is its cut face, for the hatched sections */
const OWN_TIM = { g: ['#e4e1db', '#8f8b84', '#c7c3bc'] };
const OWN_FIN = { titanium: ['#4b4945', '#ebe8e2', '#bdb9b1', '#7f7b75', '#484642'], zinc: ['#5d646c', '#f2f4f6', '#c3c9cf', '#868e96', '#5a6169'], brass: ['#7c5d1c', '#f4dc96', '#d3ac4f', '#b48b2c', '#6e5218'] };
function own_finish(name, x0, x1) { const g = G.createLinearGradient(x0, 0, x1, 0), c = OWN_FIN[name] || OWN_FIN.zinc; c.forEach((s, i) => g.addColorStop([0, 0.28, 0.5, 0.78, 1][i], s)); return g; }
const OWN_EDGE = 'rgba(16,17,20,0.75)';

/** the head's silhouette from the side as a path (bearing face at y = zb, head up): the side, the 0.32 fillet, the
   R 3.2 dome. o.notch: the slot faces the viewer */
function own_headSil(zb, o = {}) {
  const D = OWN_HD, R = D.R, n2 = OWN_M2.n / 2, xs = [];
  for (let i = 0; i <= 140; i++) xs.push(-R + 2 * R * i / 140);
  if (o.notch) xs.push(-n2 - 1e-4, -n2, n2, n2 + 1e-4);
  xs.sort((a, b) => a - b);
  G.moveTo(-R, zb); G.lineTo(-R, zb - D.fcy);
  for (const x of xs) { let h = D.H0(Math.abs(x)); if (o.notch && Math.abs(x) <= n2) h = Math.min(h, D.ys); G.lineTo(x, zb - h); }
  G.lineTo(R, zb - D.fcy); G.lineTo(R, zb);
}
/** a screw in view (a fastener: not hatched), its axis along y: kind 'm2' or 'tf'; zb = the bearing face; ph = the helix
   phase (anchored to what it runs in). Returns stage points */
function own_screwMM(kind, zb, ph, o = {}) {
  const T = OWN_TH[kind], len = OWN_M2.len, zt = zb + len, fin = o.finish || (kind === 'm2' ? 'titanium' : 'zinc'), step = 0.01;
  const r0 = kind === 'm2' ? OWN_M2.blank : 0.82, R = side => z => { const u = z - zb; return u < 0.1 ? r0 : Math.min(own_rs(T, z, ph, side, zt), lerp(r0, T.rc, clamp((u - 0.1) / 0.35))); };
  const rl = R(-1), rr0 = R(1);
  const path = () => {
    G.beginPath(); G.moveTo(-rl(zb), zb);
    for (let z = zb; z <= zt + 1e-6; z += step) G.lineTo(-rl(z), z);
    for (let z = zt; z >= zb - 1e-6; z -= step) G.lineTo(rr0(z), z);
    G.closePath();
  };
  path(); G.fillStyle = own_finish(fin, -T.rc, T.rc); G.fill();
  /* the crests in front: each runs from a crest on the right to the one half a pitch lower on the left */
  G.save(); path(); G.clip();
  G.strokeStyle = 'rgba(20,20,24,0.34)'; G.lineWidth = lw(1.2); G.beginPath();
  const k0 = Math.floor((zb - ph) / T.P) - 1, k1 = Math.ceil((zt - ph) / T.P) + 1;
  for (let k = k0; k <= k1; k++) { const zc = ph + k * T.P; if (zc < zb + 0.25) continue; G.moveTo(T.rc, zc); G.lineTo(-T.rc, zc + T.P / 2); }
  G.stroke();
  G.strokeStyle = 'rgba(255,255,255,0.28)'; G.lineWidth = lw(1); G.beginPath();
  for (let k = k0; k <= k1; k++) { const zr = ph + (k + 0.5) * T.P; if (zr < zb + 0.25) continue; G.moveTo(T.rc, zr); G.lineTo(-T.rc, zr + T.P / 2); }
  G.stroke(); G.restore();
  path(); G.strokeStyle = OWN_EDGE; G.lineWidth = lw(1.1); G.lineJoin = 'round'; G.stroke();
  /* the head in view */
  G.beginPath(); own_headSil(zb, { notch: o.notch }); G.closePath(); G.fillStyle = own_finish(fin, -OWN_HD.R, OWN_HD.R); G.fill();
  G.strokeStyle = OWN_EDGE; G.lineWidth = lw(1.1); G.stroke();
  if (o.hidden) { G.setLineDash([lw(5), lw(4)]); G.strokeStyle = 'rgba(20,20,24,0.5)'; G.lineWidth = lw(1); G.beginPath(); const D = OWN_HD; G.moveTo(-D.m2, zb - D.F(D.m2)); G.lineTo(-OWN_M2.xb, zb - D.yc); G.lineTo(-OWN_M2.rc, zb - D.yc); G.lineTo(0, zb - D.cone(0)); G.lineTo(OWN_M2.rc, zb - D.yc); G.lineTo(OWN_M2.xb, zb - D.yc); G.lineTo(D.m2, zb - D.F(D.m2)); G.stroke(); G.setLineDash([]); }
  return { head: SP(OWN_HD.R, zb - 0.5), top: SP(0, zb - OWN_M2.k), tip: SP(0, zt), flankR: SP(T.rc, zb + len * 0.62), bear: SP(OWN_HD.R, zb) };
}

/* ---------- the bits: a Phillips #0 (its wings follow the recess's ramps) and a flat blade ----------
   (0, tipY) = where the bit's point sits; o = { dx, turn (turns, for the flutes), a, bg (the tile's colour, for the fade),
   fade (mm above the point where the shank has gone), edge (a blade seen edge-on) } */
function own_bitMM(kind, tipY, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  ga(a); xsave(); G.translate(o.dx || 0, 0);
  const D = OWN_HD, M = OWN_M2, rS = 1.25, fz = o.fade || 4.6, yF = tipY - fz, top = yF - 0.05, g = 0.03;
  const path = () => {
    G.beginPath();
    if (kind === 'flat') {
      const b = o.edge ? 0.2 : 1.3, b1 = o.edge ? 0.55 : 1.6;
      G.moveTo(-b, tipY); G.lineTo(b, tipY); G.lineTo(b1, tipY - 1.8); G.lineTo(rS, tipY - 2.6); G.lineTo(rS, top); G.lineTo(-rS, top); G.lineTo(-rS, tipY - 2.6); G.lineTo(-b1, tipY - 1.8);
    } else {
      /* the wing profile: flat across the floor, then parallel to the recess's ramps a hairline inside them, out to the shank */
      const xr = M.xb - g, yS = tipY - (rS - xr) * D.slope;
      G.moveTo(-xr, tipY); G.lineTo(xr, tipY); G.lineTo(rS, yS); G.lineTo(rS, top); G.lineTo(-rS, top); G.lineTo(-rS, yS);
    }
    G.closePath();
  };
  path(); G.fillStyle = own_finish('zinc', -rS, rS); G.fill();
  G.save(); path(); G.clip();
  G.strokeStyle = 'rgba(20,22,26,0.42)'; G.lineWidth = lw(1.2); G.beginPath();
  if (kind !== 'flat') { G.moveTo(0, tipY); G.lineTo(0, tipY - 2.2); }
  const ph = ((o.turn || 0) % 1 + 1) % 1;
  for (let i = -5; i <= 5; i++) { const x = (i + ph) * 0.5; G.moveTo(x - 0.25, tipY - 2.9); G.lineTo(x + 0.25, tipY - 5.0); }
  G.stroke();
  G.restore();
  /* the shank fades into the tile, so the bit reads as coming from above */
  const fg = G.createLinearGradient(0, yF + 2.0, 0, yF);
  fg.addColorStop(0, rgba(o.bg || C.panel, 0)); fg.addColorStop(1, rgba(o.bg || C.panel, 1)); G.fillStyle = fg; G.fillRect(-rS - 0.05, yF - 0.1, 2 * rS + 0.1, 2.1);
  G.save(); G.beginPath(); G.rect(-3, yF + 1.6, 6, fz + 1); G.clip(); path(); G.strokeStyle = 'rgba(16,17,20,0.6)'; G.lineWidth = lw(1); G.stroke(); G.restore();
  xrest(); ga(1);
}

/* ---------- the head in section, B-B (through the cross arm, across the slot) or A-A (along the slot) ----------
   origin at the centre of the bearing face, head up. What lies beyond the cut is drawn in view: the far half's
   silhouette, the recess walls in shadow, and, across the slot, the open slot itself (you see through it). The cut face
   is hatched titanium, solid through (no plating). o = { cut: 'B' | 'A', shank (mm below), bit: { kind, lift,
   dx, turn, a }, bg }. Returns stage points */
function own_headSecMM(o = {}) {
  const D = OWN_HD, M = OWN_M2, R = D.R, T = OWN_TH.m2, B = o.cut !== 'A', shank = o.shank || 1.3, out = {}, N = 220, n2 = M.n / 2, w2 = M.wing / 2;
  const cut = u => B ? own_top(0, u) : own_top(u, 0);
  const sil = u => { let m = cut(u); for (let v = 0.01; v <= R; v += 0.01) { const h = B ? own_top(-v, u) : own_top(u, -v); if (h > m) m = h; } return m; };
  const wallTop = u => { const au = Math.abs(u); return B ? (au <= n2 ? D.ys : au <= D.m2 ? D.H0(Math.hypot(w2, au)) : cut(u)) : (au <= w2 ? D.F(D.m2) : au <= D.rs ? D.H0(Math.hypot(au, n2)) : cut(u)); };
  const us = []; for (let i = 0; i <= N; i++) us.push(-R + 2 * R * i / N);
  const Hc = us.map(cut), Hs = us.map(sil), Hw = us.map((u, i) => Math.max(Hc[i], Math.min(Hs[i], wallTop(u))));
  /* beyond the cut: the far half in view (lit titanium), then the recess walls in shadow */
  G.beginPath(); G.moveTo(-R, 0); us.forEach((u, i) => G.lineTo(u, -Hs[i])); G.lineTo(R, 0); G.closePath();
  G.fillStyle = own_finish('titanium', -R, R); G.fill(); G.strokeStyle = OWN_EDGE; G.lineWidth = lw(1); G.stroke();
  G.beginPath(); us.forEach((u, i) => i ? G.lineTo(u, -Hw[i]) : G.moveTo(u, -Hw[i])); for (let i = N; i >= 0; i--) G.lineTo(us[i], -Hc[i]); G.closePath();
  G.fillStyle = 'rgba(30,29,27,0.78)'; G.fill();
  /* the slot's far-wall edge and the arm walls: crisp lines */
  G.beginPath(); let on = false; us.forEach((u, i) => { if (Hw[i] - Hc[i] > 0.02) { on ? G.lineTo(u, -Hw[i]) : G.moveTo(u, -Hw[i]); on = true; } else on = false; });
  G.strokeStyle = 'rgba(22,21,20,0.9)'; G.lineWidth = lw(1); G.stroke();
  /* the bit, in the recess: in front of what lies beyond, behind the cut face */
  if (o.bit && o.bit.a > 0.003) {
    const b = o.bit, tipY = -(b.kind === 'flat' ? D.ys : D.yc) - (b.lift || 0);
    own_bitMM(b.kind, tipY, { dx: b.dx, turn: b.turn, a: b.a, bg: o.bg, fade: 4.8, edge: B });
    out.bitTip = SP(b.dx || 0, tipY); out.bitTop = SP(b.dx || 0, tipY - 3.0);
  }
  /* the cut face: titanium, hatched; a short shank in section under it, ending in a break */
  const face = () => {
    G.beginPath(); G.moveTo(-own_r(T, shank, 0, -1), shank);
    for (let z = shank; z >= M.uf; z -= 0.01) G.lineTo(-Math.min(own_r(T, z, 0, -1), lerp(M.blank, T.rc, clamp((z - 0.1) / 0.35))), z);
    G.lineTo(-M.blank, M.uf); G.quadraticCurveTo(-M.blank, 0, -M.blank - M.uf, 0);
    G.lineTo(-R, 0); G.lineTo(-R, -D.fcy);
    us.forEach((u, i) => G.lineTo(u, -Hc[i]));
    G.lineTo(R, -D.fcy); G.lineTo(R, 0); G.lineTo(M.blank + M.uf, 0); G.quadraticCurveTo(M.blank, 0, M.blank, M.uf);
    for (let z = M.uf; z <= shank; z += 0.01) G.lineTo(Math.min(own_r(T, z, 0, 1), lerp(M.blank, T.rc, clamp((z - 0.1) / 0.35))), z);
  };
  face(); brk(own_r(T, shank, 0, 1), shank, shank, 0); G.closePath();
  G.fillStyle = grad(OWN_TIM, -R, -2, R, 0); G.fill();
  G.save(); G.clip(); hatchBox([-R, -2, 2 * R, shank + 2], { sp: o.hatchSp || 10, color: 'rgba(30,30,32,0.34)' }, OWN_TIM); G.restore();
  face(); G.strokeStyle = 'rgba(28,27,26,0.7)'; G.lineWidth = lw(1.2); G.lineJoin = 'round'; G.stroke();
  out.crown = SP(0, -M.k); out.cone = SP(0, -D.cone(0)); out.floor = SP(B ? 0.62 : 1.2, -(B ? D.F(0.62) : D.ys)); out.rampR = SP(0.7, -D.F(0.7));
  out.edgeL = SP(-R, 0); out.edgeR = SP(R, 0); out.topL = SP(-R, -M.k); out.topR = SP(R, -M.k); out.side = SP(R, -D.fcy); out.slotL = SP(-n2, -D.ys); out.slotR = SP(n2, -D.ys);
  out.thread = SP(T.rc, shank * 0.7); out.shankY = SP(0, shank)[1];
  return out;
}
/** the head from above, shaded once from the exact surface (own_top): bare titanium lit from the upper left, the recess
   darkening with depth. 120 px per mm, cached */
const OWN_TOPCV = { cv: null };
function own_topCanvas() {
  if (OWN_TOPCV.cv) return OWN_TOPCV.cv;
  const N = 480, R = OWN_HD.R, px = 2 * R / N, cv = document.createElement('canvas'); cv.width = cv.height = N;
  const c = cv.getContext('2d'), img = c.createImageData(N, N), d = img.data, L = [-0.42, -0.5, 0.76], ll = Math.hypot(L[0], L[1], L[2]);
  for (let k = 0; k < 3; k++) L[k] /= ll;
  const Hh = (x, z) => { const h = own_top(x, z); return h < 0 ? 0 : h; }, e = px * 0.8;
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const x = -R + (i + 0.5) * px, z = -R + (j + 0.5) * px, r = Math.hypot(x, z), o = (j * N + i) * 4;
    if (r > R) { d[o + 3] = 0; continue; }
    const h = Hh(x, z), hx = (Hh(x + e, z) - Hh(x - e, z)) / (2 * e), hz = (Hh(x, z + e) - Hh(x, z - e)) / (2 * e), nl = Math.hypot(hx, hz, 1);
    const nx = -hx / nl, nz = -hz / nl, ny = 1 / nl, dif = Math.max(0, nx * L[0] + nz * L[1] + ny * L[2]);
    const rz = 2 * dif * ny - L[2], spec = Math.pow(Math.max(0, rz), 46), occ = clamp((OWN_HD.H0(r) - h) / 1.1);
    const sh = (0.30 + 0.78 * dif) * (1 - 0.72 * Math.pow(occ, 0.7)), al = clamp((R - r) / px);
    d[o] = clamp((198 * sh + 255 * spec * 0.3) / 255) * 255; d[o + 1] = clamp((194 * sh + 253 * spec * 0.3) / 255) * 255; d[o + 2] = clamp((186 * sh + 248 * spec * 0.3) / 255) * 255; d[o + 3] = 255 * al;
  }
  c.putImageData(img, 0, 0); OWN_TOPCV.cv = cv; return cv;
}
/** the head from above: titanium, the slot across it, the cross (No. 0) and its cone at the centre. o = { hi: 'cross' |
   'slot' (outlined in Theseus's colour), bit: { kind, dx, dy, a } (its footprint, dashed), cutLine } */
function own_headTopMM(o = {}) {
  const D = OWN_HD, M = OWN_M2, R = D.R, n2 = M.n / 2, w2 = M.wing / 2, m2 = D.m2, xs = Math.sqrt(D.rs * D.rs - n2 * n2), out = {};
  G.drawImage(own_topCanvas(), -R, -R, 2 * R, 2 * R);
  G.beginPath(); G.arc(0, 0, R, 0, TAU); G.strokeStyle = 'rgba(70,52,12,0.85)'; G.lineWidth = lw(1.2); G.stroke();
  const slot = () => { G.beginPath(); G.rect(-xs, -n2, 2 * xs, 2 * n2); };
  const arms = () => { G.beginPath(); G.rect(-m2, -w2, 2 * m2, 2 * w2); G.rect(-w2, -m2, 2 * w2, 2 * m2); };
  const union = () => { G.beginPath(); G.moveTo(-xs, -n2); G.lineTo(-w2, -n2); G.lineTo(-w2, -m2); G.lineTo(w2, -m2); G.lineTo(w2, -n2); G.lineTo(xs, -n2); G.lineTo(xs, n2); G.lineTo(w2, n2); G.lineTo(w2, m2); G.lineTo(-w2, m2); G.lineTo(-w2, n2); G.lineTo(-xs, n2); G.closePath(); };
  union(); G.strokeStyle = 'rgba(40,30,10,0.75)'; G.lineWidth = lw(0.9); G.stroke();
  void slot;
  if (o.hi) { const A = o.accent || C.hero; (o.hi === 'cross' ? arms : slot)(); if (o.hi === 'cross') { G.beginPath(); G.moveTo(-m2, -w2); G.lineTo(-w2, -w2); G.lineTo(-w2, -m2); G.lineTo(w2, -m2); G.lineTo(w2, -w2); G.lineTo(m2, -w2); G.lineTo(m2, w2); G.lineTo(w2, w2); G.lineTo(w2, m2); G.lineTo(-w2, m2); G.lineTo(-w2, w2); G.lineTo(-m2, w2); G.closePath(); } G.strokeStyle = A; G.lineWidth = lw(3); G.lineJoin = 'round'; G.stroke(); }
  if (o.bit && o.bit.a > 0.003) {
    const b = o.bit; ga(b.a); G.setLineDash([lw(6), lw(5)]); G.strokeStyle = TH ? 'rgba(16,17,20,0.75)' : 'rgba(236,235,231,0.8)'; G.lineWidth = lw(1.6);
    xsave(); G.translate(b.dx || 0, b.dy || 0);
    G.beginPath(); if (b.kind === 'flat') G.rect(-1.3, -0.2, 2.6, 0.4); else { const q = 0.17, L = 0.9; G.moveTo(-L, -q); G.lineTo(-q, -q); G.lineTo(-q, -L); G.lineTo(q, -L); G.lineTo(q, -q); G.lineTo(L, -q); G.lineTo(L, q); G.lineTo(q, q); G.lineTo(q, L); G.lineTo(-q, L); G.lineTo(-q, q); G.lineTo(-L, q); G.closePath(); }
    G.stroke(); xrest(); G.setLineDash([]); ga(1);
  }
  if (o.cutLine) {
    /* the cutting plane of section B-B: a chain line across the slot, arrows looking along it */
    G.setLineDash([lw(14), lw(4), lw(3), lw(4)]); G.strokeStyle = TH ? 'rgba(16,17,20,0.6)' : 'rgba(236,235,231,0.6)'; G.lineWidth = lw(1.3);
    G.beginPath(); G.moveTo(0, -R - 0.55); G.lineTo(0, R + 0.55); G.stroke(); G.setLineDash([]);
    out.cutA = SP(0, -R - 0.55); out.cutB = SP(0, R + 0.55);
  }
  out.slotEnd = SP(xs * 0.82, 0); out.armEnd = SP(0, -m2 * 0.9); out.armSide = SP(w2, -m2 * 0.62); out.center = SP(0, 0); out.rim = SP(R * 0.71, R * 0.71); out.edgeL = SP(-R, 0); out.edgeR = SP(R, 0); out.top = SP(0, -R); out.bot = SP(0, R);
  return out;
}

/* ---------- the joint in section: board, boss, the bore (plain, or a brass insert), the screw in view ----------
   origin at the top of the boss, on the axis, y down. The insert (fasteners.js): M2 × 3.0, Ø3.5, knurl tips r 1.75 and
   roots r 1.5 in two bands of opposed helix, a groove between them (r 1.38), a pilot (r 1.42), a 90° countersink; its
   thread crest r 0.80, groove r 1.02. The boss: carbon-filled PP, r 2.65; under the insert a clearance hole with a drill
   point. The board: 1.0 mm, black mask, a gold pad under the head and a plated hole. */
const OWN_INS = { L: 3.0, R: 1.75, rRoot: 1.5, rGroove: 1.38, rPilot: 1.42, gTop: 1.30, gBot: 1.62, pTop: 2.52, cMin: 0.80, cMaj: 1.02 };
const OWN_MAT = {
  abs: { g: ['#dad9d3', '#b7b6b0'], hatch: { color: 'rgba(0,0,0,0.22)' } },
  cf: { g: ['#3a3b41', '#25262b'], dark: 1 }
};
/** the insert's thread surface radius at depth z: the screw's own profile plus a hairline, between crest and groove,
   with the countersink at the top and a chamfer at the foot */
function own_insR(z, sd, ph) { const I = OWN_INS, T = OWN_TH.m2; let r = clamp(own_r(T, z, ph, sd) + 0.035, I.cMin, I.cMaj); r = Math.max(r, I.cMin + Math.max(0, 0.3 - z), I.cMin + Math.max(0, z - (I.L - 0.16)) * 1.6); return r; }
/** one cut half of the insert (sd = -1 left, +1 right), as a path: the knurl teeth where the plastic flowed in */
function own_insHalf(sd, ph) {
  const I = OWN_INS, teeth = (y0, y1, dir) => { const n = Math.max(2, Math.round((y1 - y0) / 0.24)), h = (y1 - y0) / n; for (let i = 0; i < n; i++) { const ya = y0 + i * h; G.lineTo(sd * I.R, ya + h * (dir > 0 ? 0.7 : 0.3)); G.lineTo(sd * I.rRoot, ya + h); } };
  G.beginPath(); G.moveTo(sd * own_insR(0, sd, ph), 0); G.lineTo(sd * (I.R - 0.08), 0); G.lineTo(sd * I.R, 0.08); G.lineTo(sd * I.rRoot, 0.16);
  teeth(0.16, I.gTop, 1); G.lineTo(sd * I.rGroove, I.gTop); G.lineTo(sd * I.rGroove, I.gBot); G.lineTo(sd * I.rRoot, I.gBot);
  teeth(I.gBot, I.pTop, -1); G.lineTo(sd * I.rPilot, I.pTop); G.lineTo(sd * I.rPilot, I.L - 0.12); G.lineTo(sd * (I.rPilot - 0.12), I.L);
  G.lineTo(sd * own_insR(I.L, sd, ph), I.L);
  for (let z = I.L; z >= 0; z -= 0.01) G.lineTo(sd * own_insR(z, sd, ph), z);
  G.closePath();
}
/** o = { kind 'cf' | 'abs' | 'insert', tip (mm the screw's tip is below the boss top), pass (1 | 2), reach1, reach2, tilt
   (rad), ph2 (mm), recut (0..1: the first thread's voids in the problem colour), bit ({ a, turn }), hole (the colour of
   empty space), crop (the boss's depth shown) }. Returns stage points */
function own_jointMM(o = {}) {
  const kind = o.kind || 'insert', ins = kind === 'insert', T = OWN_TH[ins ? 'm2' : 'tf'], hole = o.hole || C.panel, out = {};
  const fw = 4.6, bossM = OWN_MAT[ins ? 'cf' : kind], rB = 2.65, hB = o.crop || 5.4, I = OWN_INS;
  const pass2 = o.pass === 2, ph = pass2 ? (o.ph2 || 0) : (ins ? 0.2 : 0), tip = o.tip == null ? 4.0 : o.tip, zb = tip - OWN_M2.len;
  /* the boss, cut and hatched; it runs on down into the shell, so it ends in a break line */
  const bossPath = () => { G.beginPath(); G.moveTo(-rB, hB); G.lineTo(-rB, 0.25); G.arcTo(-rB, 0, -rB + 0.25, 0, 0.25); G.lineTo(rB - 0.25, 0); G.arcTo(rB, 0, rB, 0.25, 0.25); G.lineTo(rB, hB); G.bezierCurveTo(rB * 0.36, hB + 0.3, -rB * 0.36, hB - 0.3, -rB, hB); G.closePath(); };
  solid(bossPath, bossM, [-rB, 0, 2 * rB, hB], { hatch: Object.assign({ sp: 9 }, bossM.hatch || {}) });
  let W = null;
  if (ins) {
    /* under the insert: the clearance hole and its drill point */
    G.beginPath(); G.moveTo(-1.12, 3.0); G.lineTo(-1.12, 4.6); G.lineTo(-0.7, 4.95); G.lineTo(0.7, 4.95); G.lineTo(1.12, 4.6); G.lineTo(1.12, 3.0); G.closePath(); G.fillStyle = hole; G.fill();
    G.beginPath(); G.moveTo(-1.12, 3.02); G.lineTo(-1.12, 4.6); G.lineTo(-0.7, 4.95); G.lineTo(0.7, 4.95); G.lineTo(1.12, 4.6); G.lineTo(1.12, 3.02); G.strokeStyle = edgeCol(bossM); G.lineWidth = lw(1); G.stroke();
    /* the bore inside the insert's thread */
    G.beginPath(); for (let z = 0; z <= I.L + 1e-6; z += 0.01) { const x = -own_insR(z, -1, 0.2); z ? G.lineTo(x, z) : G.moveTo(x, z); } for (let z = I.L; z >= 0; z -= 0.01) G.lineTo(own_insR(z, 1, 0.2), z); G.closePath(); G.fillStyle = hole; G.fill();
    /* the insert's two cut halves, hatched the other way from the boss */
    for (const sd of [-1, 1]) solid(() => own_insHalf(sd, 0.2), MT.brass, [-1.8, 0, 3.6, 3], { hatch: { dir: -1, sp: 6, color: 'rgba(80,55,10,0.34)' }, lw: 0.9 });
    out.insert = SP(I.R, 0.9); out.knurl = SP(-I.R, 0.7); out.groove = SP(I.rGroove, (I.gTop + I.gBot) / 2);
  } else {
    W = own_wallTF(o.reach1 || 0, o.reach2 || 0, o.tilt || 0, o.ph2 || 0);
    const N = W.N, poly2 = (L, R, open) => { G.beginPath(); G.moveTo(L[0], 0); for (let i = 1; i <= N; i++) G.lineTo(L[i], i * OWN_DY); G.lineTo(-0.45, OWN_HOLE + 0.3); G.lineTo(0.45, OWN_HOLE + 0.3); for (let i = N; i >= 0; i--) G.lineTo(R[i], i * OWN_DY); if (!open) G.closePath(); };
    poly2(W.L2, W.R2); G.fillStyle = hole; G.fill();
    /* the bore tinted in the problem colour where the screw reached: the screw covers its own thread, so what stays
       visible is the room the first thread left round it, loose */
    const rc = clamp(o.recut || 0);
    if (rc > 0.01) {
      const zr = Math.max(0, (o.reach2 || 0) - 0.12), n2 = Math.round(zr / OWN_DY);
      G.save(); ga(rc * 0.9); G.fillStyle = C.bad; G.beginPath(); G.moveTo(W.L2[0], 0); for (let i = 1; i <= n2; i++) G.lineTo(W.L2[i], i * OWN_DY); for (let i = n2; i >= 0; i--) G.lineTo(W.R2[i], i * OWN_DY); G.closePath(); G.fill(); G.restore(); ga(1);
    }
    poly2(W.L2, W.R2, true); G.strokeStyle = edgeCol(bossM); G.lineWidth = lw(1); G.stroke();
  }
  /* the board, clamped: black mask both faces, the gold pad under the head, the plated hole */
  for (const [x0, x1, b] of [[-fw, -1.15, [1, 0]], [1.15, fw, [0, 1]]]) pcbSec(x0, x1, -1.0, 1.0, { brk: b, mask: '#141518' });
  G.fillStyle = '#C9A15C'; G.fillRect(-2.25, -1.03, 1.1, 0.04); G.fillRect(1.15, -1.03, 1.1, 0.04); G.fillRect(-1.19, -1.0, 0.04, 1.0); G.fillRect(1.15, -1.0, 0.04, 1.0);
  /* the screw in view, and the bit in its head; the second drive comes in tilted about the boss's mouth */
  const a = pass2 ? (o.tilt || 0) : 0;
  xsave(); xturn(a);
  if (o.bit && o.bit.a > 0.003) own_bitMM('ph', zb - OWN_HD.yc, { a: o.bit.a, turn: o.bit.turn, bg: hole, fade: 4.2 });
  const s = own_screwMM(ins ? 'm2' : 'tf', zb, ph, {});
  xrest();
  Object.assign(out, s, { boss: SP(-rB, 2.6), plate: SP(fw - 0.6, -0.5), axisTop: SP(0, zb - OWN_M2.k), bossTop: SP(0, 0), bossR: SP(rB, 1.4), bossL: SP(-rB, 1.4) });
  if (W) { let best = 0, bi = 0; for (let i = 0; i <= W.N; i++) { const d = W.R2[i] - W.R1[i]; if (d > best) { best = d; bi = i; } } out.recutPt = SP(W.R2[bi], bi * OWN_DY); out.recutMax = best; out.mouth = SP(OWN_RP, 0.5); }
  return out;
}

/* ---------- the insert alone, zoomed: half in section (left: the thread, the countersink), half in view (right: the
   knurl teeth on their opposed helices, the groove, the pilot). Origin at its top face, on the axis ---------- */
function own_insertPartMM(o = {}) {
  const I = OWN_INS, out = {}, ph = 0.2;
  /* the view half: the body, then the teeth as helical lines across each band, foreshortened round the cylinder */
  const viewPath = () => { G.beginPath(); G.moveTo(0, 0); G.lineTo(I.R - 0.08, 0); G.lineTo(I.R, 0.08); G.lineTo(I.R, I.gTop); G.lineTo(I.rGroove, I.gTop); G.lineTo(I.rGroove, I.gBot); G.lineTo(I.R, I.gBot); G.lineTo(I.R, I.pTop); G.lineTo(I.rPilot, I.pTop); G.lineTo(I.rPilot, I.L - 0.12); G.lineTo(I.rPilot - 0.12, I.L); G.lineTo(0, I.L); G.closePath(); };
  viewPath(); G.fillStyle = own_finish('brass', -I.R, I.R); G.fill();
  G.save(); viewPath(); G.clip();
  for (const [y0, y1, dir] of [[0.1, I.gTop, 1], [I.gBot, I.pTop, -1]]) {
    const lead = 19.6 * dir, n = 18, ph0 = (o.turn || 0) * TAU;
    for (let k = 0; k < n * 2; k++) {
      const pts = []; for (let y = y0; y <= y1 + 1e-6; y += 0.02) { const f = ph0 + TAU * k / n + TAU * (y - y0) / lead; if (Math.cos(f) < 0) { pts.push(null); continue; } pts.push([I.R * Math.sin(f), y, Math.cos(f)]); }
      G.beginPath(); let on = false; for (const p of pts) { if (!p || p[0] < 0) { on = false; continue; } on ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1]); on = true; }
      G.strokeStyle = 'rgba(60,40,8,0.55)'; G.lineWidth = lw(1.6); G.stroke();
      G.beginPath(); on = false; for (const p of pts) { if (!p || p[0] < 0) { on = false; continue; } on ? G.lineTo(p[0] + 0.035, p[1]) : G.moveTo(p[0] + 0.035, p[1]); on = true; }
      G.strokeStyle = 'rgba(255,240,200,0.35)'; G.lineWidth = lw(1); G.stroke();
    }
  }
  G.restore();
  viewPath(); G.strokeStyle = 'rgba(60,40,8,0.85)'; G.lineWidth = lw(1.1); G.stroke();
  /* the section half, hatched; the bore empty; the screw's thread in it, in view */
  const hole = o.hole || C.panel;
  G.save(); G.beginPath(); G.rect(-3, -1, 3, 6); G.clip();
  solid(() => own_insHalf(-1, ph), MT.brass, [-1.8, 0, 3.6, 3], { hatch: { dir: -1, sp: 7, color: 'rgba(80,55,10,0.36)' }, lw: 1 });
  G.restore();
  G.beginPath(); for (let z = 0; z <= I.L + 1e-6; z += 0.01) { const x = -own_insR(z, -1, ph); z ? G.lineTo(x, z) : G.moveTo(x, z); } G.lineTo(0, I.L); G.lineTo(0, 0); G.closePath(); G.fillStyle = hole; G.fill();
  if (o.screw !== false) {
    const T = OWN_TH.m2;
    G.save(); G.beginPath(); G.rect(-3, -0.6, 3, I.L + 1.2); G.clip();
    G.beginPath(); G.moveTo(0, -0.6); for (let z = -0.6; z <= I.L + 0.6; z += 0.01) G.lineTo(-own_r(T, z, ph, -1), z); G.lineTo(0, I.L + 0.6); G.closePath();
    G.fillStyle = own_finish('titanium', -T.rc, T.rc); G.fill(); G.strokeStyle = OWN_EDGE; G.lineWidth = lw(1); G.stroke(); G.restore();
  }
  /* the centre line */
  G.setLineDash([lw(14), lw(4), lw(3), lw(4)]); G.strokeStyle = TH ? 'rgba(16,17,20,0.55)' : 'rgba(236,235,231,0.55)'; G.lineWidth = lw(1.2); G.beginPath(); G.moveTo(0, -0.7); G.lineTo(0, I.L + 0.7); G.stroke(); G.setLineDash([]);
  out.teeth = SP(I.R, 0.7); out.teeth2 = SP(I.R, 2.1); out.groove = SP(I.rGroove, (I.gTop + I.gBot) / 2); out.pilot = SP(I.rPilot, 2.8); out.thread = SP(-own_insR(1.5, -1, ph), 1.5);
  out.topL = SP(-I.R, 0); out.topR = SP(I.R, 0); out.botR = SP(I.R, I.L); out.botL = SP(-I.R, I.L); out.sink = SP(-1.0, 0.15); out.flank = SP(-0.9, 1.9);
  return out;
}

/* ---------- the flank, close up: ISO 68-1's 60° profile, titanium in brass (both cut) ---------- */
function own_isoMM(o = {}) {
  const P = OWN_M2.P, H = 0.866025 * P, n = o.n || 2.2, x0 = -n * P / 2, x1 = n * P / 2, out = {};
  const prof = x => -(-H / 4 + own_tooth(x / P, 1 / 8, 1 / 4) * (5 * H / 8));
  const top = -H * 1.3, bot = H * 1.05;
  const steel = () => { G.beginPath(); G.moveTo(x0, bot); for (let x = x0; x <= x1 + 1e-6; x += P / 200) G.lineTo(x, prof(x)); G.lineTo(x1, bot); G.closePath(); };
  const brass = () => { G.beginPath(); G.moveTo(x0, top); for (let x = x0; x <= x1 + 1e-6; x += P / 200) G.lineTo(x, prof(x) - 0.006); G.lineTo(x1, top); G.closePath(); };
  solid(steel, OWN_TIM, [x0, -H, x1 - x0, bot + H], { hatch: { sp: 12, color: 'rgba(30,30,32,0.3)' }, edge: false });
  solid(brass, MT.brass, [x0, top, x1 - x0, H * 2], { hatch: { dir: -1, sp: 12, color: 'rgba(80,55,10,0.32)' }, edge: false });
  G.beginPath(); for (let x = x0; x <= x1 + 1e-6; x += P / 200) x === x0 ? G.moveTo(x, prof(x)) : G.lineTo(x, prof(x)); G.strokeStyle = o.line || 'rgba(16,17,20,0.85)'; G.lineWidth = lw(1.6); G.stroke();
  /* the fundamental triangle, dashed */
  G.setLineDash([lw(6), lw(5)]); G.strokeStyle = 'rgba(16,17,20,0.55)'; G.lineWidth = lw(1.2); G.beginPath(); G.moveTo(-P / 2, H / 2); G.lineTo(0, -H / 2); G.lineTo(P / 2, H / 2); G.closePath(); G.stroke(); G.setLineDash([]);
  out.apex = SP(0, -H / 2); out.base = [SP(-P / 2, H / 2), SP(P / 2, H / 2)]; out.crest = SP(0, -3 * H / 8); out.flank = SP(P * 0.22, prof(P * 0.22));
  out.p0 = SP(0, -3 * H / 8); out.p1 = SP(P, -3 * H / 8); out.left = SP(x0, 0); out.right = SP(x1, 0); out.topY = SP(0, top)[1]; out.botY = SP(0, bot)[1];
  return out;
}
/** a plastic flank close up (the wall of a plain boss, cut): the thread the first drive formed and the sliver a second
   drive on another phase shaved off it (in the problem colour), the first surface dashed. k = how far the second cut has
   gone. x along the axis, the plastic below its surface (y down) */
function own_flankTFMM(k, o = {}) {
  const T = OWN_TH.tf, P = T.P, n = o.n || 1.2, x0 = -P * n, x1 = P * n, depth = T.rc - OWN_RP, bot = o.bot || 0.5, st = P / 300;
  const cut = (x, ph) => own_tooth((x - ph) / P, T.cw, T.rw) * depth;
  const ph2 = o.ph2 == null ? P * 0.2 : o.ph2, wall = x => Math.max(cut(x, 0), cut(x, ph2) * k);
  const mat = o.mat || OWN_MAT.cf;
  const surf = f => { G.beginPath(); for (let x = x0; x <= x1 + 1e-6; x += st) { const y = f(x); x === x0 ? G.moveTo(x, y) : G.lineTo(x, y); } };
  const body = () => { surf(wall); G.lineTo(x1, bot); G.lineTo(x0, bot); G.closePath(); };
  body(); G.fillStyle = grad(mat, x0, 0, x0, bot); G.fill();
  G.save(); body(); G.clip(); hatchBox([x0, -0.1, x1 - x0, bot + 0.2], Object.assign({ sp: 14 }, mat.hatch || {}), mat); G.restore();
  if (k > 0.01) {
    surf(x => cut(x, 0)); for (let x = x1; x >= x0 - 1e-6; x -= st) G.lineTo(x, wall(x)); G.closePath();
    G.fillStyle = C.bad; ga(0.9 * clamp(k * 1.4)); G.fill(); ga(1);
    G.setLineDash([lw(6), lw(5)]); surf(x => cut(x, 0)); G.strokeStyle = TH ? 'rgba(16,17,20,0.65)' : 'rgba(236,235,231,0.65)'; G.lineWidth = lw(1.3); G.stroke(); G.setLineDash([]);
  }
  surf(wall); G.strokeStyle = edgeCol(mat); G.lineWidth = lw(1.6); G.stroke();
  let bx = 0, bd = 0; for (let x = x0; x <= x1; x += st) { const d = wall(x) - cut(x, 0); if (d > bd) { bd = d; bx = x; } }
  return { sliver: SP(bx, (cut(bx, 0) + wall(bx)) / 2), left: SP(x0, 0), right: SP(x1, 0), bottom: SP(0, bot) };
}

/* ---------- the glance (F14.10, F16.1): the old value struck in grey, an arrow, the new one huge in Theseus's
   gradient, the net change under it ----------
   (x, y) = left edge and the big number's baseline. o = { label (over it), sb, sa (sizes), unit, net, maxW } */
function own_ba(t, t0, x, y, before, after, o = {}) {
  const a = ep(t, t0, t0 + 0.5); if (a <= 0.003) return 0;
  const sB = o.sb || 84, sA = o.sa || 172, stB = { role: 'd1', size: sB, weight: 800, color: C.faint, tnum: true };
  if (o.label) text(o.label, x, y - sA * 0.78 - 30, { role: 'label', size: 22, color: C.heroText, alpha: a, maxW: o.maxW || 620 });
  let xx = x;
  if (before != null) {
    const wB = tw(before, stB), ym = y - sB * 0.34;
    text(before, xx, y, Object.assign({ alpha: a * 0.95 }, stB));
    line(xx - 4, ym, xx + wB + 4, ym, { color: C.faint, w: Math.max(3, sB * 0.055), alpha: a * ep(t, t0 + 0.3, t0 + 0.7) });
    xx += wB + sB * 0.26;
    arrow(xx, ym, xx + sB * 0.6, ym, { color: C.mute, w: 3, hs: Math.max(14, sB * 0.2), alpha: a, p: ep(t, t0 + 0.2, t0 + 0.7) });
    xx += sB * 0.6 + sB * 0.3;
  }
  const k = ep(t, t0 + 0.45, t0 + 1.0);
  const r = rich([{ s: after, role: 'd1', size: sA, weight: 800, track: -0.035, color: C.heroText, grad: C.heroGrad, tnum: true },
    o.unit ? { s: o.unit, font: 'disp', size: Math.round(sA * 0.32), weight: 800, color: C.heroText, grad: C.heroGrad, gap: Math.round(sA * 0.06), caps: false } : null], xx, y, { t, alpha: a * k });
  if (o.net) text(o.net, x, y + 58, { role: 'small', size: 27, weight: 800, color: C.heroText, alpha: a * ep(t, t0 + 0.9, t0 + 1.3), maxW: o.maxW || 620, lh: 1.3 });
  return xx - x + r.w;
}
/** bars where Theseus's row is blue and the next best yellow, with which way is better written on the chart. Each row:
   its name over a round-ended bar, the value at the right. rows = [{ label, v, s, kind ('hero' | 'second' | 'comp'), ev,
   by }]; o = { max, better, title, rh, valW }. Returns the height used */
function own_bars(t, t0, x, y, w, rows, o = {}) {
  const vw = o.valW || 150, bw = w - vw - 24, rh = o.rh || 82, max = o.max || 100, a0 = ep(t, t0, t0 + 0.4);
  if (o.title) text(o.title, x, y, { role: 'label', size: 21, color: C.mute, alpha: a0, maxW: w - 220 });
  if (o.better) text(o.better, x + w, y, { role: 'label', size: 21, color: C.ink, align: 'right', alpha: a0 });
  rows.forEach((r, i) => {
    const yy = y + 52 + i * rh, a = ep(t, t0 + 0.15 + i * 0.12, t0 + 0.55 + i * 0.12), k = ep(t, t0 + 0.3 + i * 0.12, t0 + 1.2 + i * 0.12, E.snap);
    const hero = r.kind === 'hero', col = hero ? C.hero : r.kind === 'second' ? C.second : C.comp;
    const lr = text(r.label, x, yy, { role: 'small', size: 25, weight: hero ? 800 : 600, color: hero ? C.heroText : C.ink, alpha: a, maxW: bw });
    if (r.ev) pill(x + Math.min(lr.w, bw) + 16, yy, r.ev, a, { by: r.by });
    const by = yy + 22;
    rr(x, by, bw, 16, 8, C.track, null, 0, a);
    const L = bw * clamp(r.v / max) * k;
    if (L > 1) rr(x, by, Math.max(16, L), 16, 8, col, null, 0, a); else if (hero) heroMark(x + 9, by + 8, 11, a);
    text(r.s != null ? r.s : String(r.v), x + w, by + 16, { font: 'disp', size: hero ? 40 : 34, weight: 800, color: hero ? C.heroText : r.kind === 'second' ? C.secondText : C.ink2, align: 'right', alpha: a, tnum: true });
  });
  return 52 + rows.length * rh;
}
/** a small yes / no table: which drivers open which head. rows = [[label, ...cells]], cells true / false; cols = names */
function own_ticks(t, t0, x, y, w, cols, rows, o = {}) {
  const cw = o.cw || 150, lw0 = w - cw * cols.length, rh = o.rh || 52, a0 = ep(t, t0, t0 + 0.4);
  cols.forEach((c, j) => { const hero = j === cols.length - 1; text(c, x + lw0 + cw * (j + 0.5), y, { role: 'label', size: 20, color: hero ? C.heroText : C.mute, align: 'center', alpha: a0, maxW: cw - 8 }); });
  rows.forEach((r, i) => {
    const yy = y + 46 + i * rh, a = ep(t, t0 + 0.1 + i * 0.1, t0 + 0.5 + i * 0.1);
    line(x, yy - 34, x + w, yy - 34, { color: C.hair, w: 1, alpha: a });
    text(r[0], x, yy, { role: 'small', size: 25, color: C.ink, alpha: a });
    r.slice(1).forEach((v, j) => {
      const cx = x + lw0 + cw * (j + 0.5), cy = yy - 9, hero = j === cols.length - 1;
      if (v) poly([[cx - 11, cy], [cx - 3, cy + 8], [cx + 12, cy - 9]], { color: hero ? C.hero : C.ink2, w: 4, alpha: a, cap: 'round' });
      else line(cx - 9, cy, cx + 9, cy, { color: C.faint, w: 3, alpha: a, cap: 'round' });
    });
  });
  return 46 + rows.length * rh;
}

/* the titanium screw against the steel one it replaces (F25.4, F25.5): ISO 7045's steel screws are property class 4.8 (ownIso7045m),
   130 to 220 HV (ownIso898p; the comparison takes the top of the range); grade 5 titanium 349 HV (ownTi). The M2 × 4 the shell uses
   is 23.59 mm³ (3d/parts/fasteners.js, spec.volume_mm3): 0.186 g in carbon steel at 7.9 g/cm³, 0.105 g in titanium at 4.43 */
const OWN_TIW = { hv48: 220, hvTi: 349, mm3: 23.59, gSteel: 23.59 * 7.9 / 1000, gTi: 23.59 * 4.43 / 1000 };
/* ============================== #9 M2 combination drive ============================== */
/* the Phillips bit comes down a little off centre and the recess's ramps steer it to the middle; it turns; it lifts out;
   a flat blade drops into the slot. The section is B-B, through the cross arm and across the slot */
const OWN_SC = { ph: [[1.0, [0.3, 1.8]], [2.0, [0.3, 0.7]], [2.8, [0, 0]], [4.6, [0, 0]], [5.3, [0, 2.0]]], fl: [[5.6, 2.2], [6.6, 0]] };
S({
  id: 'ownscrew', ch: 'own', theme: 'night', title: 'M2 combination drive screws', settle: 9, after: 'repair', ideas: [9, 101],
  src: ['ownBrock', 'ownTi', 'ownIso898p', 'ownIso7045m', 'ownRecess', 'ownTiMin', 'ownSteelRho', 'ownStrip', 'ownTwi', 'ownTiCorr', 'ownIso7045w', 'ownIso1580', 'ownIso898'],
  draw: t => {
    header(t, 'M2 combination drive screws');
    captions(t, [[0.6, 'One titanium M2 for the whole mouse: 1.6× the thread of the M1.6 Finalmouse uses, with a Phillips cross and a slot in the same head.'], [4.8, 'The Phillips bit steers itself to the centre of the cross, and grade 5 titanium is harder than the steel such screws are made of, so the cross dents less. If it ever strips, any flat blade turns the slot.']]);
    const x0 = LM, y0 = 280, w0 = 1120, h0 = 640, kw = tileA(t, 0.15, 0);
    demoWindow(x0, y0, w0, h0, kw);
    cardHead(t, 0.35, x0, y0, w0, 'The head, from above and in section B-B', []);
    const ph = kf(t, OWN_SC.ph, E.io3), phA = ep(t, 0.9, 1.2) * (1 - ep(t, 5.2, 5.5)), fl = kf(t, OWN_SC.fl, E.io3), flA = ep(t, 5.5, 5.8);
    const turn = t > 2.8 && t < 4.6 ? (t - 2.8) * 0.8 : t >= 4.6 ? 1.44 : 0, inPh = t > 2.6 && t < 5.2, inFl = t > 6.5;
    /* the top view */
    const tv = part(x0 + 290, y0 + 360, 70, () => own_headTopMM({ hi: inFl ? 'slot' : inPh ? 'cross' : null, cutLine: true, bit: inFl ? { kind: 'flat', a: flA } : { kind: 'ph', dx: ph[0], a: phA * clamp(1 - ph[1] / 1.2) } }), { alpha: ep(t, 0.4, 0.9) }) || {};
    if (tv.cutA) { const kb = ep(t, 1.0, 1.4); text('B', tv.cutA[0] + 14, tv.cutA[1] + 8, { role: 'label', size: 22, color: C.ink, alpha: kb }); text('B', tv.cutB[0] + 14, tv.cutB[1] + 8, { role: 'label', size: 22, color: C.ink, alpha: kb }); }
    if (tv.center) {
      callout(t, 1.6, tv.armSide, 'Cross recess No. 0', { to: [x0 + 300, y0 + 150], side: 'l', color: C.ink2, tcolor: C.ink });
      callout(t, 1.9, tv.slotEnd, 'Slot 0.5 × 0.8 mm', { to: [x0 + 330, y0 + 592], side: 'l', color: C.ink2, tcolor: C.ink });
    }
    /* section B-B, with the bit */
    const sx = x0 + 820, sy = y0 + 410, ss = 100;
    G.save(); G.beginPath(); G.rect(x0, y0, w0, h0); G.clip();
    const sec = part(sx, sy, ss, () => own_headSecMM({ cut: 'B', shank: 1.3, bg: C.panel, bit: inFl || t > 5.5 ? { kind: 'flat', lift: fl, a: flA, turn: 0 } : { kind: 'ph', lift: ph[1], dx: ph[0], turn, a: phA } }), { alpha: ep(t, 0.5, 1.0) }) || {};
    G.restore();
    if (sec.edgeL) {
      const kd = ep(t, 1.2, 1.6);
      dim(t, 1.2, [sec.edgeL[0], sec.edgeL[1] + 2], [sec.edgeR[0], sec.edgeR[1] + 2], 'Ø4.0', 150, { tcolor: C.ink });
      dim(t, 1.4, [sec.edgeR[0] + 2, sec.edgeR[1]], [sec.topR[0] + 2, sec.topR[1]], '1.6', 52, { tcolor: C.ink });
      text('M2 × 0.4', sec.thread[0] + 44, sec.thread[1] + 8, { role: 'label', size: 21, color: C.ink2, alpha: kd });
      line(sec.thread[0] + 6, sec.thread[1], sec.thread[0] + 36, sec.thread[1], { color: C.mute, w: 1.2, alpha: kd });
      /* the pointer on the bit, pushing it down and turning it */
      if (sec.bitTip) { const q = [sec.bitTip[0] + 70, Math.max(sec.bitTip[1] - 210, y0 + 80)]; cursorAt(t, [[1.0, q], [1.2, q]], [2.85], { a: ep(t, 0.9, 1.2) * (1 - ep(t, 8.4, 8.8)) }); }
    }
    /* right: the glance (F25.4, F25.5). Against the screw it replaces: ISO 7045's steel is property class 4.8, at most 220 HV
       (ISO 898-1); grade 5 titanium is 349 HV (36 HRC, ASM). Hardness is what a slipping bit has to dent, so the win is the
       cross (the recess), not the thread: a thread strips in the softer part, and here that is the brass insert either way */
    const rx = 1240, rw = RM - rx, OT = OWN_TIW;
    own_ba(t, 1.2, rx, 452, String(OT.hv48), String(OT.hvTi), { unit: 'HV', sb: 70, sa: 124, label: 'Head hardness, steel → titanium', net: fmtN(OT.hvTi / OT.hv48, 1) + '× as hard: a slipping bit dents it less', maxW: rw });
    pill(rx + rw - pillW('datasheet'), 452 - 124 * 0.78 - 30, 'datasheet', ep(t, 1.6, 2.0));
    own_ba(t, 2.2, rx, 642, fmtN(OT.gSteel, 2), fmtN(OT.gTi, 2), { unit: 'g', sb: 44, sa: 72, label: 'Each M2 × 4 screw, steel → titanium', net: '−' + Math.round(100 * (1 - OT.gTi / OT.gSteel)) + ' %: ' + fmtN(4 * OT.gSteel, 2) + ' → ' + fmtN(4 * OT.gTi, 2) + ' g for the four', maxW: rw });
    { const k1 = ep(t, 3.2, 3.6), k2 = ep(t, 3.6, 4.0), y1 = 752;
      text('What it gives', rx, y1, { role: 'label', size: 20, color: C.heroText, alpha: k1 });
      text('No plating: its own oxide film keeps it from corroding.', rx, y1 + 30, { role: 'small', size: 23, weight: 600, color: C.ink2, maxW: rw, lh: 1.26, alpha: k1 });
      text('What it costs', rx, y1 + 78, { role: 'label', size: 20, color: C.mute, alpha: k2 });
      text('No magnet pickup on the driver, and it can gall, so it goes in with anti-seize. A thread still strips in the softer brass first.', rx, y1 + 108, { role: 'small', size: 23, weight: 600, color: C.ink2, maxW: rw, lh: 1.26, alpha: k2 }); }
    source(t, 'Class 4.8 steel, as ISO 7045 names it: at most 220 HV (ISO 898-1). Grade 5 titanium: 349 HV (ASM). 23.6 mm³ at 7.9 and 4.43 g/cm³. Thread area: 1.27 → 2.07 mm² (ISO 898-1).', { t0: 2 });
  }
});

/* ============================== #101 brass heat-set inserts: the joint after a re-screw (F2.01) ============================== */
/* both joints are driven in, backed out and driven in again, together. The second drive into plastic comes in 2° off and
   a fifth of a pitch out of phase, as a hand does: it cuts its own thread beside the first. In brass it can only follow */
const OWN_IN = { d1: [1.2, 3.6], out: [4.0, 5.4], d2: [6.0, 8.4], tilt: 2 * Math.PI / 180, ph2: 0.18 };
function own_inPose(t) {
  const P = OWN_IN, d = 4.0;
  if (t < P.out[0]) { const k = ep(t, P.d1[0], P.d1[1], E.io3); return { pass: 1, tip: d * k, reach1: d * k, reach2: 0, dir: t > P.d1[0] && t < P.d1[1] ? 1 : 0, step: 0 }; }
  if (t < P.d2[0]) { const k = ep(t, P.out[0], P.out[1], E.io3); return { pass: 1, tip: d * (1 - k), reach1: d, reach2: 0, dir: t < P.out[1] ? -1 : 0, step: 1 }; }
  const k = ep(t, P.d2[0], P.d2[1], E.io3); return { pass: 2, tip: d * k, reach1: d, reach2: d * k, dir: t < P.d2[1] ? 1 : 0, step: 2 };
}
S({
  id: 'own_insert', ch: 'own', theme: 'paper', title: 'Brass heat-set inserts', settle: 11, after: 'ownscrew', ideas: [101, 9],
  src: ['ownBrock', 'ownCovestro', 'ownCumbicus', 'ownPemM2'],
  draw: t => {
    header(t, 'Brass heat-set inserts');
    captions(t, [[0.6, 'Screwed straight into plastic, the first drive cuts the thread at whatever angle the hand holds it. A brass insert arrives with the thread finished.'], [4.2, 'Back the screw out and drive it in again a hair off that angle, and in plastic it cuts a new thread, at a new tension.'], [6.8, 'In brass the screw can only follow the thread it came out of, so the joint is right the first time and closes the same every time.']]);
    const x0 = LM, y0 = 280, w0 = 1080, h0 = 640, P = own_inPose(t), s = 40, by = y0 + 320;
    demoWindow(x0, y0, w0, h0, tileA(t, 0.15, 0));
    const turn = t * 0.9, bitA = ep(t, 0.6, 1.0);
    const J = [{ kind: 'cf', cx: x0 + 290, name: 'Straight into carbon-filled plastic' }, { kind: 'insert', cx: x0 + 790, name: 'Brass heat-set insert' }];
    G.save(); G.beginPath(); G.rect(x0, y0, w0, h0); G.clip();
    const pts = J.map(j => part(j.cx, by, s, () => own_jointMM({ kind: j.kind, tip: P.tip, pass: P.pass, reach1: P.reach1, reach2: P.reach2, tilt: OWN_IN.tilt, ph2: OWN_IN.ph2, recut: j.kind === 'cf' ? ep(t, 7.4, 8.6) : 0, bit: { a: bitA, turn: P.dir ? turn * P.dir : 0 }, hole: C.panel }), { alpha: ep(t, 0.3, 0.8) }) || {});
    G.restore();
    J.forEach((j, i) => {
      const kN = ep(t, 0.6, 1.0), hero = j.kind === 'insert';
      text(j.name, j.cx, y0 + h0 - 78, { role: 'label', size: 21, color: hero ? C.heroText : C.ink, align: 'center', alpha: kN });
      const msg = P.step === 0 ? (hero ? 'A finished thread: right first time' : 'The first drive cuts the thread') : P.step === 1 ? (hero ? 'The thread stays in the brass' : 'The thread it cut stays behind') : (hero ? 'The same thread, the same joint' : 'A new thread, cut beside the first');
      const bad = !hero && P.step === 2 && P.reach2 > 1.0;
      text(msg, j.cx, y0 + h0 - 40, { role: 'small', size: 25, weight: 700, color: bad ? C.bad : hero && P.step === 2 ? C.heroText : C.ink2, align: 'center', alpha: kN * ep(t, 1.0, 1.4) });
      /* which way the bit turns: along the front of the shank, leftward driving in */
      const p = pts[i];
      if (p.axisTop && P.dir) {
        const cx = j.cx, cy = p.axisTop[1] - 64, ka = bitA, a0 = P.dir > 0 ? 0.35 : Math.PI - 0.35, a1 = P.dir > 0 ? Math.PI - 0.35 : 0.35;
        G.save(); G.globalAlpha = ka; G.strokeStyle = C.mute; G.lineWidth = 2.5; G.beginPath(); G.ellipse(cx, cy, 58, 15, 0, a0, a1, P.dir < 0); G.stroke(); G.restore();
        const ex = cx + 58 * Math.cos(a1), ey = cy + 15 * Math.sin(a1); arrow(ex + (P.dir > 0 ? 12 : -12), ey - 5, ex, ey, { color: C.mute, w: 2.5, hs: 12, alpha: ka });
      }
    });
    /* the pointer on the plastic joint's bit, riding down and up with it */
    const p0 = pts[0];
    if (p0.axisTop) { const q = [p0.axisTop[0] + 20, p0.axisTop[1] - 92]; cursorAt(t, [[0.7, [q[0] + 70, q[1] - 60]], [1.1, q], [20, q]], [1.15, 6.05], { a: ep(t, 0.6, 0.9) }); }
    /* right: the glance */
    const rx = 1200, rw = RM - rx;
    own_ba(t, 1.0, rx, 500, OWN_FEEL.cf + ' %', OWN_FEEL.insert + ' %', { label: 'Chance it feels different after a re-screw', net: '−' + (OWN_FEEL.cf - OWN_FEEL.insert) + ' points against the same boss, screwed straight in' });
    own_bars(t, 1.8, rx, 640, rw, [
      { label: 'Straight into ABS', v: OWN_FEEL.abs, s: OWN_FEEL.abs + ' %', kind: 'comp' },
      { label: 'Straight into carbon-filled', v: OWN_FEEL.cf, s: OWN_FEEL.cf + ' %', kind: 'second' },
      { label: 'Brass heat-set insert', v: OWN_FEEL.insert, s: OWN_FEEL.insert + ' %', kind: 'hero', ev: 'derived', by: 'Brock' }
    ], { max: 100, title: 'After one re-screw', better: 'Lower is better', rh: 80 });
    source(t, 'Plastic: Brock\'s estimates. Brass: a machine screw has no cutting edge, so it can only follow the brass thread (Brock\'s doc). Covestro: a screw re-assembled into plastic holds only if it is reinserted into its original thread, by hand.', { t0: 2, maxW: 1760 });
  }
});

/* ============================== thread wear: what repeated use costs each joint ============================== */
S({
  id: 'own_life', ch: 'own', theme: 'night', title: 'Thread wear: brass, not plastic', settle: 10, after: 'own_insert', ideas: [101],
  src: ['own3dp', 'ownCumbicus', 'ownPemM2', 'ownBrock', 'ownIso68'],
  draw: t => {
    header(t, 'Thread wear: brass, not plastic');
    captions(t, [[0.6, 'Every re-assembly re-forms a thread in plastic, and it holds a little less each time. Brass keeps its thread.'], [5.6, 'The plastic only grips the knurls, and they never move again: the screw turns in brass, titanium on brass.']]);
    const x0 = LM, y0 = 280, w0 = 1080, h0 = 640;
    demoWindow(x0, y0, w0, h0, tileA(t, 0.15, 0));
    cardHead(t, 0.35, x0, y0, w0, 'The M2 insert, half in section', []);
    /* the insert, zoomed: section left, view right; it turns slowly so the knurl reads */
    const ip = part(x0 + 300, y0 + 170, 112, () => own_insertPartMM({ turn: 0.02 * Math.sin(t * 0.5), hole: C.panel }), { alpha: ep(t, 0.4, 0.9) }) || {};
    if (ip.teeth) {
      callout(t, 1.4, ip.teeth, 'Knurls on opposed helices', { to: [x0 + 560, y0 + 212], side: 'r', color: C.ink2, tcolor: C.ink, sub: 'The plastic melts round them and sets: 255 N pull-out in ABS (PEM)', maxW: 420 });
      callout(t, 1.8, ip.groove, 'Groove', { to: [x0 + 560, y0 + 326], side: 'r', color: C.ink2, tcolor: C.ink });
      callout(t, 2.1, ip.thread, 'M2 × 0.4, cut in brass', { to: [x0 + 214, y0 + 592], side: 'r', color: C.ink2, tcolor: C.ink });
      dim(t, 1.6, [ip.topL[0], ip.topL[1] - 2], [ip.topR[0], ip.topR[1] - 2], 'Ø3.5', -44, { tcolor: C.ink });
      dim(t, 1.8, [ip.topL[0] - 2, ip.topL[1]], [ip.botL[0] - 2, ip.botL[1]], '3.0', 46, { tcolor: C.ink });
    }
    /* the two flanks, close up, after repeated use */
    const fy = y0 + 486, kA = ep(t, 3.0, 3.5);
    part(x0 + 660, fy, 250, () => own_isoMM({ n: 1.6 }), { alpha: kA });
    part(x0 + 900, fy - 20, 150, () => own_flankTFMM(ep(t, 4.2, 5.6), { n: 0.7, ph2: OWN_TH.tf.P * 0.2 }), { alpha: ep(t, 3.4, 3.9) });
    text('Titanium on brass', x0 + 660, y0 + h0 - 34, { role: 'label', size: 20, color: C.heroText, align: 'center', alpha: kA });
    text('Re-cut plastic', x0 + 900, y0 + h0 - 34, { role: 'label', size: 20, color: C.bad, align: 'center', alpha: ep(t, 3.4, 3.9) });
    /* right: the glance */
    const rx = 1200, rw = RM - rx;
    own_ba(t, 1.0, rx, 480, null, '98.6', { unit: '%', sa: 170, label: 'Hold kept after 20 heavy loads', net: 'A brass insert, loaded 20 times to 80 % of its failure force (3D People 2022)' });
    own_bars(t, 1.8, rx, 650, rw, [
      { label: 'Brass insert, 20 heavy loads', v: 98.6, s: '98.6 %', kind: 'hero', ev: 'measured', by: '3D People' },
      { label: 'Better of two screws, 10 re-screws', v: 82.8, s: '82.8 %', kind: 'second', ev: 'measured', by: 'Cumbicus 2023' },
      { label: 'The other screw, 5 re-screws', v: 43.3, s: '43.3 %', kind: 'comp' }
    ], { max: 100, title: 'Hold kept after repeated use', better: 'Higher is better', rh: 80 });
    source(t, 'Insert: 3D People 2022, brass M2 to M5 in four printed plastics, 1.37 % average change. Plastic: Cumbicus et al. 2023, 5 mm thread-forming screws in glass-filled PEI, loosening torque against the first tightening. Pull-out: PEM, M2 in ABS.', { t0: 2, maxW: 1760 });
  }
});
