/* ============================================================================================
   7 · OWNERSHIP, the joint an owner opens: the screw (#9), the brass heat-set insert it runs in (#101), what a thread
   in plastic does when it is opened and closed again, and what the joints weigh.
   Slides: ownscrew (combination drive), own_insert (inserts against plastic: Brock's estimates), own_wear (thread wear,
   the published tests), own_mass (fastener mass). They follow 'repair' (after:).
   The drawings are in mm in the drafting style of 03-parts.js (part(), solid(), hatching for cut material, fasteners in
   view), zoomed in on the part that matters: the recess, the flank, the knurl. Every top-level name starts with own_.
   ============================================================================================ */
Object.assign(SRC, {
  ownIso7045w: { t: 'fasten.it, DIN EN ISO 7045 table: M2 pan head with cross recess, dk 4 mm, k 1.6 mm, recess No. 0, m 1.9 mm (type H); M2 × 5 in steel about 0.215 kg per 1,000 pieces (7.85 kg/dm³)', u: 'https://fasten.it/Norms/Norm/DIN_EN_ISO_7045' },
  ownIso1580: { t: 'fasten.it, DIN EN ISO 1580 table: M2 slotted pan head, slot width n 0.5 mm, slot depth t 0.5 mm minimum', u: 'https://fasten.it/Norms/Norm/DIN_EN_ISO_1580' },
  ownIso68: { t: 'ISO 68-1 basic profile of metric threads, as given in "ISO metric screw thread" (Wikipedia): 60° flanks, H = 0.866P, d2 = d − 0.6495P, d1 = d − 1.0825P', u: 'https://en.wikipedia.org/wiki/ISO_metric_screw_thread' },
  ownCumbicus: { t: 'Cumbicus, Estrems, Arizmendi & Jiménez 2023, Int. J. Adv. Manuf. Technol. 126: 5163–5178: thread-forming screws (PF-30 and Delta PT, 5 mm) in glass-fibre PEI bosses, ten assemblies each; loosening torque down 11.95% by the 3rd, 15.31% by the 5th and 17.16% by the 10th (PF-30); down 56.73% at the 5th and 41.93% at the 10th (Delta PT)', u: 'https://doi.org/10.1007/s00170-023-11422-0' },
  ownCovestro: { t: 'Covestro, Self-tapping screws for thermoplastics: cutting screws suit "once-only assembly" or a few re-assemblies; "repeated assembly is only possible if the screw is carefully reinserted into the original thread (by hand)"; VDE 0700 asks for ten assemblies; tighten to at least 1.2 × the insertion torque, at most 0.5 × the stripping torque', u: 'https://solutions.covestro.com/-/media/covestro/solution-center/whitepapers/self-tapping-screws-for-thermoplastics.pdf' },
  ownPemM2: { t: 'PEM (PennEngineering), IUTFA / IUTFB / IUTFC-M2 heat-staking insert, performance data: 255 N pull-out and 0.5 N·m torque-out in ABS; 578 N and 0.9 N·m in polycarbonate; hole 3.23 mm', u: 'https://www.pemnet.com/products/product-finder/iutfc-m2/' },
  ownHios: { t: 'HIOS, DELTA PT product page: repeat assembly, DELTA PT "40 times: less damage", another company\'s tapping screw "7 times: damage easily" (plastic, size and method not stated)', u: 'https://hios.com/EN/products/screw/DELTAPT/' },
  ownAtfEvo: { t: 'ATF Inc. (T. Kalife), "EVO PT", SPE Automotive 2023: "minimum 10 repeat assemblies" (conditions not stated)', u: 'https://speautomotive.com/wp-content/uploads/2023/09/EVO-PT%C2%AE-The-Self-Tapping-Evolution-in-Clamp-Load-Generation-for-Highly-Engineered-Plastics_Kalife_Thiago.pdf' },
  ownAmtec: { t: 'Böllhoff AMTEC thread inserts for plastics (trade listing): "the joint can be detached as often as required without damaging the thread"; no cycle count given', u: 'https://www.advancedmanufacturingmadrid.com/en/products/amtec-highly-wear-resistant-thread-inserts-for-plastic-parts-117733/' },
  ownSpirol: { t: 'SPIROL, Performance expectations of threaded inserts in plastic assemblies: "as much as 75% of the insert\'s performance is a direct result of how well it was installed"', u: 'https://pdf.directindustry.com/pdf/spirol/performance-expectations-threaded-inserts-plastic-assemblies/5446-1030265.html' },
  ownBrock: { t: 'Brock Liddicoat, In Pursuit of an Objectively Better Mouse: #9 (combination drive, M2, brass-plated carbon-steel core, machine screws), #101 (brass heat-set inserts, far from the antenna), M2 inserts 0.16 to 0.18 g, a gummy o-ring for friction, metal on plastic re-cuts its thread; and his estimate of 2026-11-04: 90% of screws driven straight into ABS feel different after they are unscrewed and screwed back, carbon-filled plastic a bit fewer', u: '', n: 'His judgement, shown as ESTIMATE by Brock.' }
});

/** Brock's estimate (2026-11-04): the chance a joint feels different after it has been unscrewed and screwed back in,
   for a screw driven straight into the plastic. ABS 90 %; carbon-filled "a bit lower": one constant, easy to change. */
const OWN_FEEL = { abs: 90, cf: 85 };
/** the screw: an ISO 7045 pan head envelope, M2 × 0.4 × 5 (ISO 68-1), the combination recess of ISO 7045 type H No. 0 and
   the slot of ISO 1580 */
const OWN_M2 = { dk: 4.0, k: 1.6, rf: 3.2, side: 0.9, m: 1.9, pen: 1.05, n: 0.5, t: 0.55, P: 0.4, d: 2.0, len: 5 };
/** threads, as radii in mm: a machine M2 × 0.4 (crest d/2, root d3/2, flats P/8 and P/4) and a generic thread-forming
   screw for plastic (sharp 30° flanks on a wide pitch). cw / rw = crest and root flats as fractions of the pitch */
const OWN_TH = {
  m2: { P: 0.4, rc: 1.0, rr: 0.7546, cw: 1 / 8, rw: 1 / 4, tipR: 0.62, tipL: 0.38 },
  tf: { P: 0.9, rc: 1.1, rr: 0.72, cw: 0.06, rw: 0.714, tipR: 0.5, tipL: 0.9 }
};
/** a periodic tooth: 1 on the crest flat, 0 on the root flat, straight flanks between. u in pitches */
function own_tooth(u, cw, rw) {
  let f = ((u % 1) + 1) % 1; if (f > 0.5) f = 1 - f;
  const c = cw / 2, r0 = 0.5 - rw / 2;
  return f <= c ? 1 : f >= r0 ? 0 : 1 - (f - c) / (r0 - c);
}
/** the thread's radius at axial position z (mm from the top of the boss, along the screw), on side sd (+1 right, -1 left).
   The helix is the same in every section, so a screw turning in its own thread shows a still profile: only its ends move */
function own_r(T, z, ph, sd) { return T.rr + (T.rc - T.rr) * own_tooth((z - ph) / T.P + (sd < 0 ? 0.5 : 0), T.cw, T.rw); }
/** the screw's own radius at z, with its tip chamfer: zt is where the tip is */
function own_rs(T, z, ph, sd, zt) { const r = own_r(T, z, ph, sd); return Math.min(r, T.tipR + Math.max(0, zt - z) * (T.rc - T.tipR) / T.tipL); }

/** the bore in a plain plastic boss after one or two drives of a thread-forming screw. Each drive cuts the screw's helix
   into the wall down to how far its tip reached; the second may come in at a slight angle and on another phase, and
   cuts a second helix beside the first. Returns the wall (x on each side, per 0.01 mm of depth) after the first drive
   and after both, so the slivers the second drive shaved off can be shown */
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

/* ---------- the pan head: in view, from the side (bearing face at y = 0, head up), and its outline from above ---------- */
const own_domeY = x => -OWN_M2.k + OWN_M2.rf - Math.sqrt(OWN_M2.rf * OWN_M2.rf - x * x);
function own_headPath(y0) {
  const R = OWN_M2.dk / 2, ys = own_domeY(R - 0.08);
  G.moveTo(-R, y0); G.lineTo(-R, y0 + ys + 0.08); G.quadraticCurveTo(-R, y0 + ys, -R + 0.08, y0 + ys);
  for (let x = -R + 0.08; x <= R - 0.08 + 1e-6; x += 0.08) G.lineTo(x, y0 + own_domeY(x));
  G.quadraticCurveTo(R, y0 + ys, R, y0 + ys + 0.08); G.lineTo(R, y0);
}
/** a metal finish across a cylinder seen from the side: a gradient from x0 to x1 */
const OWN_FIN = { plated: ['#6f5a24', '#f6e8b4', '#dcc277', '#9b7c33', '#6a5420'], zinc: ['#5d646c', '#f2f4f6', '#c3c9cf', '#868e96', '#5a6169'], brass: ['#7c5d1c', '#f4dc96', '#d3ac4f', '#b48b2c', '#6e5218'] };
function own_finish(name, x0, x1) { const g = G.createLinearGradient(x0, 0, x1, 0), c = OWN_FIN[name] || OWN_FIN.zinc; c.forEach((s, i) => g.addColorStop([0, 0.28, 0.5, 0.78, 1][i], s)); return g; }

/** a screw in view (not hatched: a fastener), its axis along y. kind 'm2' or 'tf'; zb = bearing face, the thread runs to
   zb + len; ph = the helix phase (anchored to the boss, see own_r). The head carries the recess (the slot faces the viewer). */
function own_screwMM(kind, zb, ph, o = {}) {
  const T = OWN_TH[kind], len = OWN_M2.len, zt = zb + len, fin = o.finish || (kind === 'm2' ? 'plated' : 'zinc'), step = 0.01;
  const edge = 'rgba(16,17,20,0.75)';
  const path = () => {
    G.beginPath(); G.moveTo(-own_rs(T, zb, ph, -1, zt), zb);
    for (let z = zb; z <= zt + 1e-6; z += step) G.lineTo(-own_rs(T, z, ph, -1, zt), z);
    for (let z = zt; z >= zb - 1e-6; z -= step) G.lineTo(own_rs(T, z, ph, 1, zt), z);
    G.closePath();
  };
  path(); G.fillStyle = own_finish(fin, -T.rc, T.rc); G.fill();
  /* the visible crests: each runs from a crest on the right to the one half a pitch lower on the left (the helix in front) */
  G.save(); path(); G.clip();
  G.strokeStyle = 'rgba(20,20,24,0.34)'; G.lineWidth = lw(1.2); G.beginPath();
  const k0 = Math.floor((zb - ph) / T.P) - 1, k1 = Math.ceil((zt - ph) / T.P) + 1;
  for (let k = k0; k <= k1; k++) { const zc = ph + k * T.P; G.moveTo(T.rc, zc); G.lineTo(-T.rc, zc + T.P / 2); }
  G.stroke();
  G.strokeStyle = 'rgba(255,255,255,0.28)'; G.lineWidth = lw(1); G.beginPath();
  for (let k = k0; k <= k1; k++) { const zr = ph + (k + 0.5) * T.P; G.moveTo(T.rc, zr); G.lineTo(-T.rc, zr + T.P / 2); }
  G.stroke(); G.restore();
  path(); G.strokeStyle = edge; G.lineWidth = lw(1.1); G.lineJoin = 'round'; G.stroke();
  /* the head, in view: a slot facing us, the cross behind it in hidden lines */
  const hp = () => { G.beginPath(); own_headPath(zb); G.closePath(); };
  hp(); G.fillStyle = own_finish(fin, -OWN_M2.dk / 2, OWN_M2.dk / 2); G.fill();
  const top = zb + own_domeY(0), n2 = OWN_M2.n / 2;
  G.beginPath(); G.rect(-n2, top - 0.05, 2 * n2, OWN_M2.t + 0.05); G.fillStyle = 'rgba(24,20,12,0.82)'; G.fill();
  hp(); G.strokeStyle = edge; G.lineWidth = lw(1.1); G.stroke();
  if (o.hidden !== false) { G.setLineDash([lw(5), lw(4)]); G.strokeStyle = 'rgba(20,20,24,0.45)'; G.lineWidth = lw(1); G.beginPath(); G.moveTo(-OWN_M2.m / 2, zb + own_domeY(OWN_M2.m / 2)); G.lineTo(0, zb - OWN_M2.k + OWN_M2.pen); G.lineTo(OWN_M2.m / 2, zb + own_domeY(OWN_M2.m / 2)); G.stroke(); G.setLineDash([]); }
  return { head: SP(OWN_M2.dk / 2, zb - 0.6), top: SP(0, top), tip: SP(0, zt), flankR: SP(T.rc, zb + len * 0.62) };
}

/** a break line across a part: an S from (x0, y) to (x1, y), drawn from the current point */
function own_brkH(x0, x1, y, amp) { const w = x1 - x0; G.bezierCurveTo(x0 + w * 0.32, y + amp, x0 + w * 0.68, y - amp, x1, y); }

/* ---------- the service joint, in section: plate, boss, the bore (plain, or a brass insert), the screw in view ---------- */
const OWN_MAT = {
  abs: { g: ['#dad9d3', '#b7b6b0'], hatch: { color: 'rgba(0,0,0,0.22)' } },
  cf: { g: ['#3a3b41', '#25262b'], dark: 1 },
  insert: { g: ['#3a3b41', '#25262b'], dark: 1 }
};
/** o = { kind 'abs' | 'cf' | 'insert', z (where the screw's bearing face is), pass (1 | 2), reach1, reach2 (how deep each
   drive's tip went), tilt (rad, the second drive), ph2 (mm, its phase), hole (the colour of empty space), fw (floor
   half-width), recut (0..1: show the slivers the second drive shaved off), driver ({ turn, a }) }. Returns stage points */
function own_jointMM(o = {}) {
  const kind = o.kind || 'insert', ins = kind === 'insert', T = OWN_TH[ins ? 'm2' : 'tf'], hole = o.hole || C.panel, out = {};
  const fw = o.fw || 4.4, bossM = OWN_MAT[kind], rB = 2.65, hB = o.crop || 5.3;
  /* the boss, cut: hatched; it goes on down into the shell, so it ends in a break line */
  const bossPath = () => {
    G.beginPath(); G.moveTo(-rB, hB); G.lineTo(-rB, 0.25); G.arcTo(-rB, 0, -rB + 0.25, 0, 0.25);
    G.lineTo(rB - 0.25, 0); G.arcTo(rB, 0, rB, 0.25, 0.25); G.lineTo(rB, hB); own_brkH(rB, -rB, hB, 0.28); G.closePath();
  };
  solid(bossPath, bossM, [-rB, 0, 2 * rB, hB], { hatch: Object.assign({ sp: o.hatchSp || 9 }, bossM.hatch || {}) });
  /* the bore */
  let W = null;
  if (ins) {
    /* below the insert: a clearance hole with a drill point; in the insert: the internal thread (the screw's helix, plus a hair) */
    G.beginPath(); G.moveTo(-1.1, 2.95); G.lineTo(-1.1, 4.4); G.lineTo(0, 4.85); G.lineTo(1.1, 4.4); G.lineTo(1.1, 2.95); G.fillStyle = hole; G.fill(); G.strokeStyle = edgeCol(bossM); G.lineWidth = lw(1); G.stroke();
    const inner = sd => { const pts = []; for (let z = 0; z <= 3.0001; z += OWN_DY) { const lead = Math.max(0, 0.16 - z) * 1.1; pts.push([sd * (Math.max(0.7835, own_r(T, z, 0, sd)) + 0.014 + lead), z]); } return pts; };
    const IL = inner(-1), IR = inner(1);
    G.beginPath(); IL.forEach(([x, y], i) => i ? G.lineTo(x, y) : G.moveTo(x, y)); for (let i = IR.length - 1; i >= 0; i--) G.lineTo(IR[i][0], IR[i][1]); G.closePath(); G.fillStyle = hole; G.fill();
    /* the insert, two halves: knurls bite the boss (the plastic flowed into them); hatched the other way */
    for (const sd of [-1, 1]) {
      const P = sd < 0 ? IL : IR, kn = (y0, y1, dir) => { const n = Math.max(2, Math.round((y1 - y0) / 0.21)), h = (y1 - y0) / n; for (let i = 0; i < n; i++) { const ya = y0 + i * h; G.lineTo(sd * 1.75, ya + h * (dir > 0 ? 0.72 : 0.28)); G.lineTo(sd * 1.55, ya + h); } };
      const half = () => {
        G.beginPath(); G.moveTo(P[0][0], 0); G.lineTo(sd * 1.63, 0); G.quadraticCurveTo(sd * 1.69, 0, sd * 1.69, 0.08); G.lineTo(sd * 1.69, 0.14); G.lineTo(sd * 1.55, 0.2);
        kn(0.2, 1.26, 1); G.lineTo(sd * 1.37, 1.34); G.lineTo(sd * 1.37, 1.58); G.lineTo(sd * 1.55, 1.66); kn(1.66, 2.5, -1);
        G.lineTo(sd * 1.55, 2.86); G.lineTo(sd * 1.42, 3.0); G.lineTo(P[P.length - 1][0], 3.0);
        for (let i = P.length - 1; i >= 0; i--) G.lineTo(P[i][0], P[i][1]);
        G.closePath();
      };
      solid(half, MT.brass, [-1.8, 0, 3.6, 3], { hatch: { dir: -1, sp: 6, color: 'rgba(80,55,10,0.34)' }, lw: 0.9 });
    }
    out.insert = SP(1.75, 1.0); out.knurl = SP(-1.75, 0.75);
  } else {
    W = own_wallTF(o.reach1 || 0, o.reach2 || 0, o.tilt || 0, o.ph2 || 0);
    const N = W.N, poly2 = (L, R, open) => { G.beginPath(); G.moveTo(L[0], 0); for (let i = 1; i <= N; i++) G.lineTo(L[i], i * OWN_DY); G.lineTo(0, OWN_HOLE + 0.35); for (let i = N; i >= 0; i--) G.lineTo(R[i], i * OWN_DY); if (!open) G.closePath(); };
    poly2(W.L2, W.R2); G.fillStyle = hole; G.fill();
    /* the first drive's thread, which the second (on another helix) leaves empty beside its own: the joint is loose there.
       Tinted in the problem colour under the screw, so only the empty part shows */
    const rc = clamp(o.recut || 0);
    if (rc > 0.01) {
      G.save(); ga(rc * 0.8); G.fillStyle = C.bad;
      for (const [A, sg] of [[W.L1, -1], [W.R1, 1]]) { G.beginPath(); G.moveTo(sg * OWN_RP, 0); for (let i = 0; i <= N; i++) G.lineTo(A[i], i * OWN_DY); G.lineTo(sg * OWN_RP, N * OWN_DY); G.closePath(); G.fill(); }
      G.restore(); ga(1);
    }
    poly2(W.L2, W.R2, true); G.strokeStyle = edgeCol(bossM); G.lineWidth = lw(1); G.stroke();
    out.mouth = SP(OWN_RP, 0.6);
  }
  /* the plate: a board, clamped */
  pcbSec(-fw, -1.2, -1.0, 1.0, { brk: [1, 0] }); pcbSec(1.2, fw, -1.0, 1.0, { brk: [0, 1] });
  /* the screw, in view, on its pass: the second pass comes in tilted about the mouth of the bore */
  const pass2 = o.pass === 2, a = pass2 ? (o.tilt || 0) : 0;
  xsave(); xturn(a);
  const s = own_screwMM(ins ? 'm2' : 'tf', o.z == null ? -1 : o.z, pass2 ? (o.ph2 || 0) : 0, {});
  if (o.driver && o.driver.a > 0.003) own_driverMM((o.z == null ? -1 : o.z) - OWN_M2.k + OWN_M2.pen - 0.15, Object.assign({ bg: hole }, o.driver));
  xrest();
  Object.assign(out, s, { boss: SP(-rB, 2.6), plate: SP(fw - 0.6, -0.5), floor: SP(0, hB + 0.6), axisTop: SP(0, (o.z == null ? -1 : o.z) - OWN_M2.k) });
  if (W) { let best = 0, bi = 0; for (let i = 0; i <= W.N; i++) { const d = W.R2[i] - W.R1[i]; if (d > best) { best = d; bi = i; } } out.recutPt = SP(W.R2[bi], bi * OWN_DY); out.recutMax = best; }
  return out;
}
/** a Phillips bit (or a flat blade) from the side, its tip at y = ty on the axis, the shank going up and fading into the
   tile. o = { turn, a, flat, fade (mm above the tip where it has gone), bg (the tile's colour) } */
function own_driverMM(ty, o = {}) {
  ga(o.a == null ? 1 : o.a);
  const rS = 1.0, flat = !!o.flat, tl = flat ? 1.0 : 1.9, top = ty - 9;
  const path = () => {
    G.beginPath();
    if (flat) { G.moveTo(-1.55, ty); G.lineTo(1.55, ty); G.lineTo(1.3, ty - 0.35); G.lineTo(rS, ty - tl); G.lineTo(rS, top); G.lineTo(-rS, top); G.lineTo(-rS, ty - tl); G.lineTo(-1.3, ty - 0.35); }
    else { G.moveTo(-0.1, ty); G.lineTo(0.1, ty); G.lineTo(0.86, ty - 0.95); G.lineTo(rS, ty - tl); G.lineTo(rS, top); G.lineTo(-rS, top); G.lineTo(-rS, ty - tl); G.lineTo(-0.86, ty - 0.95); }
    G.closePath();
  };
  path(); G.fillStyle = own_finish('zinc', -rS, rS); G.fill();
  G.save(); path(); G.clip();
  G.strokeStyle = 'rgba(20,22,26,0.42)'; G.lineWidth = lw(1.2); G.beginPath();
  if (!flat) { G.moveTo(0, ty); G.lineTo(-0.34, ty - tl); G.moveTo(0, ty); G.lineTo(0.34, ty - tl); }
  const ph = ((o.turn || 0) % 1 + 1) % 1;
  for (let i = -5; i <= 5; i++) { const x = (i + ph) * 0.42; G.moveTo(x - 0.25, ty - tl - 0.5); G.lineTo(x + 0.25, ty - tl - 3.0); }
  G.stroke();
  /* the shank fades into the tile, so the bit reads as coming from above */
  const fz = o.fade || 4.2, fg = G.createLinearGradient(0, ty - fz + 2.2, 0, ty - fz);
  fg.addColorStop(0, rgba(o.bg || C.panel, 0)); fg.addColorStop(1, rgba(o.bg || C.panel, 1)); G.fillStyle = fg; G.fillRect(-2, top - 1, 4, (ty - fz + 2.2) - top + 1);
  G.restore();
  G.save(); G.beginPath(); G.rect(-3, ty - fz + 1.6, 6, fz + 1); G.clip(); path(); G.strokeStyle = 'rgba(16,17,20,0.6)'; G.lineWidth = lw(1); G.stroke(); G.restore();
  ga(1);
}

/* ---------- the head cut along its slot (section A-A), and the head from above ---------- */
/** origin at the centre of the bearing face, head up. The cut face is hatched steel; the brass plating is the gold line
   round it (its thickness exaggerated). o.bit: { kind: 'ph' | 'flat', lift (mm above seated), turn, a }. Returns points */
function own_headCutMM(o = {}) {
  const R = OWN_M2.dk / 2, T = OWN_TH.m2, yF = -OWN_M2.k + OWN_M2.t, yC = -OWN_M2.k + OWN_M2.pen, xV = (OWN_M2.m / 2) * (yF - yC) / (own_domeY(OWN_M2.m / 2) - yC);
  const xS = Math.sqrt(OWN_M2.rf * OWN_M2.rf - Math.pow(OWN_M2.rf - OWN_M2.t, 2)), shank = o.shank || 2.4, out = {};
  const outline = (closeBreak) => {
    G.beginPath(); G.moveTo(-own_r(T, shank, 0, -1), shank);
    for (let z = shank; z >= 0; z -= 0.01) G.lineTo(-own_r(T, z, 0, -1), z);
    G.lineTo(-R, 0); G.lineTo(-R, own_domeY(R - 0.08) + 0.08); G.quadraticCurveTo(-R, own_domeY(R - 0.08), -R + 0.08, own_domeY(R - 0.08));
    for (let x = -R + 0.08; x < -xS; x += 0.02) G.lineTo(x, own_domeY(x));
    G.lineTo(-xS, yF); G.lineTo(-xV, yF); G.lineTo(0, yC); G.lineTo(xV, yF); G.lineTo(xS, yF);
    for (let x = xS; x <= R - 0.08; x += 0.02) G.lineTo(x, own_domeY(x));
    G.quadraticCurveTo(R, own_domeY(R - 0.08), R, own_domeY(R - 0.08) + 0.08); G.lineTo(R, 0);
    for (let z = 0; z <= shank; z += 0.01) G.lineTo(own_r(T, z, 0, 1), z);
    if (closeBreak) brk(own_r(T, shank, 0, 1), shank, shank, 0);
  };
  /* the cut face: steel, hatched; the thread's break line at the foot */
  outline(true); G.lineTo(-own_r(T, shank, 0, -1), shank); G.closePath();
  G.fillStyle = grad(MT.steel, -R, -2, R, 0); G.fill();
  G.save(); G.clip(); hatchBox([-R, -2, 2 * R, shank + 2], { sp: o.hatchSp || 10, color: 'rgba(30,34,40,0.34)' }, MT.steel); G.restore();
  /* the plating, round every face that is a surface (not the break) */
  outline(false); G.strokeStyle = '#E2BE5A'; G.lineWidth = lw(o.plate || 3.2); G.lineJoin = 'round'; G.stroke();
  outline(false); G.strokeStyle = 'rgba(70,50,10,0.55)'; G.lineWidth = lw(1); G.stroke();
  /* the dome the slot cut away, as a phantom */
  G.setLineDash([lw(6), lw(5)]); G.beginPath(); for (let x = -xS; x <= xS; x += 0.02) x === -xS ? G.moveTo(x, own_domeY(x)) : G.lineTo(x, own_domeY(x)); G.strokeStyle = inkA(0.4); G.lineWidth = lw(1.2); G.stroke(); G.setLineDash([]);
  out.crown = SP(0, -OWN_M2.k); out.floor = SP(xS * 0.7, yF); out.floorL = SP(-xS, yF); out.cone = SP(0, yC); out.vL = SP(-xV, yF); out.vR = SP(xV, yF);
  out.edgeL = SP(-R, 0); out.edgeR = SP(R, 0); out.topL = SP(-R, -OWN_M2.k); out.topR = SP(R, -OWN_M2.k); out.side = SP(R, own_domeY(R)); out.bear = SP(R, 0);
  out.plating = SP(-R, -0.45); out.thread = SP(T.rc, 1.4);
  if (o.bit && o.bit.a > 0.003) {
    const b = o.bit, ty = (b.kind === 'flat' ? yF : yC) - (b.lift || 0);
    own_driverMM(ty, { flat: b.kind === 'flat', turn: b.turn, a: b.a, bg: o.bg, fade: 4.4 });
    out.bitTip = SP(0, ty); out.bitTop = SP(0, ty - 3.2);
  }
  return out;
}
/** the head from above: plated, the slot across it and the cross (type H, No. 0) at its centre. o.rot turns the recess,
   o.hi = 'cross' | 'slot' outlines the one a driver is in */
function own_headTopMM(o = {}) {
  const R = OWN_M2.dk / 2, n2 = OWN_M2.n / 2, m2 = OWN_M2.m / 2, b = 0.21, out = {};
  const g = G.createRadialGradient(-0.7, -0.8, 0.1, 0, 0, R * 1.05);
  g.addColorStop(0, '#fbedc0'); g.addColorStop(0.55, '#d8b45f'); g.addColorStop(1, '#8a6a26');
  G.beginPath(); G.arc(0, 0, R, 0, TAU); G.fillStyle = g; G.fill(); G.strokeStyle = 'rgba(70,52,12,0.85)'; G.lineWidth = lw(1.2); G.stroke();
  G.beginPath(); G.arc(0, 0, R * 0.88, 0, TAU); G.strokeStyle = 'rgba(90,66,18,0.22)'; G.lineWidth = lw(1); G.stroke();
  xsave(); xturn(o.rot || 0);
  G.save(); G.beginPath(); G.arc(0, 0, R - 0.03, 0, TAU); G.clip();
  const slot = () => { G.beginPath(); G.rect(-R - 0.2, -n2, 2 * R + 0.4, 2 * n2); };
  const cross = () => { G.beginPath(); G.rect(-m2, -b, 2 * m2, 2 * b); G.rect(-b, -m2, 2 * b, 2 * m2); G.moveTo(0, -0.46); G.lineTo(0.46, 0); G.lineTo(0, 0.46); G.lineTo(-0.46, 0); G.closePath(); };
  slot(); G.fillStyle = '#2c2414'; G.fill(); cross(); G.fill();
  /* the walls catch the light on the far side; the cone's point is darkest */
  G.fillStyle = 'rgba(255,236,190,0.30)'; G.fillRect(-R, n2 - 0.07, 2 * R, 0.07); G.fillRect(b - 0.06, -m2, 0.06, 2 * m2);
  const cg = G.createRadialGradient(0, 0, 0, 0, 0, 0.5); cg.addColorStop(0, 'rgba(0,0,0,0.6)'); cg.addColorStop(1, 'rgba(0,0,0,0)'); G.fillStyle = cg; G.beginPath(); G.arc(0, 0, 0.5, 0, TAU); G.fill();
  G.restore();
  if (o.hi) { const A = o.accent || C.hero; (o.hi === 'cross' ? cross : slot)(); G.strokeStyle = A; G.lineWidth = lw(3); G.lineJoin = 'round'; G.stroke(); }
  out.slotEnd = SP(R * 0.78, 0); out.crossEnd = SP(0, -m2 * 0.9); out.center = SP(0, 0);
  xrest();
  out.rim = SP(R * 0.71, R * 0.71); out.edgeL = SP(-R, 0); out.edgeR = SP(R, 0);
  return out;
}

/* ---------- the flank, close up: the ISO 60° basic profile in brass and steel; a plastic flank cut twice ---------- */
/** the ISO 68-1 basic profile, its axis horizontal: steel below the line, brass above, both hatched (a section).
   Origin on the pitch line at a crest of the screw; x along the axis (mm), y outward is up. n = pitches shown */
function own_isoMM(o = {}) {
  const P = OWN_M2.P, H = 0.866025 * P, n = o.n || 2.5, x0 = -n * P / 2, x1 = n * P / 2, out = {};
  const prof = x => { const f = own_tooth(x / P, 1 / 8, 1 / 4); return -(-H / 4 + f * (5 * H / 8)); };   /* y of the basic profile (up = −) */
  const top = -H * 1.35, bot = H * 1.1;
  const steel = () => { G.beginPath(); G.moveTo(x0, bot); for (let x = x0; x <= x1 + 1e-6; x += P / 200) G.lineTo(x, prof(x)); G.lineTo(x1, bot); G.closePath(); };
  const brass = () => { G.beginPath(); G.moveTo(x0, top); for (let x = x0; x <= x1 + 1e-6; x += P / 200) G.lineTo(x, prof(x) - (o.gap || 0.006)); G.lineTo(x1, top); G.closePath(); };
  solid(steel, MT.steel, [x0, -H, x1 - x0, bot + H], { hatch: { sp: 12, color: 'rgba(30,34,40,0.3)' }, edge: false });
  solid(brass, MT.brass, [x0, top, x1 - x0, H * 2], { hatch: { dir: -1, sp: 12, color: 'rgba(80,55,10,0.32)' }, edge: false });
  G.beginPath(); for (let x = x0; x <= x1 + 1e-6; x += P / 200) x === x0 ? G.moveTo(x, prof(x)) : G.lineTo(x, prof(x)); G.strokeStyle = o.line || 'rgba(16,17,20,0.85)'; G.lineWidth = lw(1.6); G.stroke();
  /* the fundamental triangle, dashed, on the crest at 0 and the roots either side */
  G.setLineDash([lw(6), lw(5)]); G.strokeStyle = inkA(0.55); G.lineWidth = lw(1.2); G.beginPath();
  G.moveTo(-P / 2, H / 2); G.lineTo(0, -H / 2); G.lineTo(P / 2, H / 2); G.closePath(); G.stroke(); G.setLineDash([]);
  out.apex = SP(0, -H / 2); out.base = [SP(-P / 2, H / 2), SP(P / 2, H / 2)]; out.crest = SP(0, -3 * H / 8); out.root = SP(P / 2, H / 4);
  out.flank = SP(P * 0.22, prof(P * 0.22)); out.pitch = [SP(0, -3 * H / 8), SP(P, -3 * H / 8)]; out.H = H; out.P = P;
  out.left = SP(x0, 0); out.right = SP(x1, 0); out.topY = SP(0, top)[1]; out.botY = SP(0, bot)[1];
  return out;
}
/** a plastic flank seen close (the wall of a plain boss, cut): the thread a first drive formed, and what a second drive
   on another phase cut beside it. The sliver it shaved off is drawn in the problem colour; the first surface stays as a
   dashed phantom. x along the axis (mm), the plastic below its surface (y down). k = how far the second cut has gone */
function own_flankTFMM(k, o = {}) {
  const T = OWN_TH.tf, P = T.P, n = o.n || 1.2, x0 = -P * n, x1 = P * n, depth = T.rc - OWN_RP, bot = o.bot || 0.5, st = P / 300;
  const cut = (x, ph) => own_tooth((x - ph) / P, T.cw, T.rw) * depth;
  const ph2 = o.ph2 == null ? P * 0.34 : o.ph2, wall = x => Math.max(cut(x, 0), cut(x, ph2) * k);
  const mat = o.mat || OWN_MAT.abs;
  const surf = f => { G.beginPath(); for (let x = x0; x <= x1 + 1e-6; x += st) { const y = f(x); x === x0 ? G.moveTo(x, y) : G.lineTo(x, y); } };
  const body = () => { surf(wall); G.lineTo(x1, bot); G.lineTo(x0, bot); G.closePath(); };
  body(); G.fillStyle = grad(mat, x0, 0, x0, bot); G.fill();
  G.save(); body(); G.clip(); hatchBox([x0, -0.1, x1 - x0, bot + 0.2], Object.assign({ sp: 14 }, mat.hatch || {}), mat); G.restore();
  if (k > 0.01) {
    surf(x => cut(x, 0)); for (let x = x1; x >= x0 - 1e-6; x -= st) G.lineTo(x, wall(x)); G.closePath();
    G.fillStyle = C.bad; ga(0.9 * clamp(k * 1.4)); G.fill(); ga(1);
    G.setLineDash([lw(6), lw(5)]); surf(x => cut(x, 0)); G.strokeStyle = inkA(0.65); G.lineWidth = lw(1.3); G.stroke(); G.setLineDash([]);
  }
  surf(wall); G.strokeStyle = edgeCol(mat); G.lineWidth = lw(1.6); G.stroke();
  /* where the sliver is thickest, for a label */
  let bx = 0, bd = 0; for (let x = x0; x <= x1; x += st) { const d = wall(x) - cut(x, 0); if (d > bd) { bd = d; bx = x; } }
  return { sliver: SP(bx, (cut(bx, 0) + wall(bx)) / 2), first: SP(x0 + P * 0.5, cut(x0 + P * 0.5, 0)), bottom: SP(0, bot), left: SP(x0, 0), right: SP(x1, 0), depth };
}

