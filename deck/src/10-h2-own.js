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
    /* what the second drive shaved off the first one's thread: a problem, in the problem colour */
    const rc = clamp(o.recut || 0);
    if (rc > 0.01) {
      G.save(); ga(rc * 0.9); G.fillStyle = C.bad;
      for (const [A, B] of [[W.L1, W.L2], [W.R1, W.R2]]) { G.beginPath(); G.moveTo(A[0], 0); for (let i = 1; i <= N; i++) G.lineTo(A[i], i * OWN_DY); for (let i = N; i >= 0; i--) G.lineTo(B[i], i * OWN_DY); G.closePath(); G.fill(); }
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
  if (o.driver && o.driver.a > 0.003) own_driverMM((o.z == null ? -1 : o.z) - OWN_M2.k + OWN_M2.pen - 0.15, o.driver);
  xrest();
  Object.assign(out, s, { boss: SP(-rB, 2.6), plate: SP(fw - 0.6, -0.5), floor: SP(0, hB + 0.6), axisTop: SP(0, (o.z == null ? -1 : o.z) - OWN_M2.k) });
  if (W) { let best = 0, bi = 0; for (let i = 0; i <= W.N; i++) { const d = W.R2[i] - W.R1[i]; if (d > best) { best = d; bi = i; } } out.recutPt = SP(W.R2[bi], bi * OWN_DY); out.recutMax = best; }
  return out;
}
/** a Phillips bit in a driver, from the side, its tip at y = ty (on the axis), going up off the drawing. o = { turn, a, flat } */
function own_driverMM(ty, o = {}) {
  ga(o.a == null ? 1 : o.a);
  const rS = 1.25, tl = o.flat ? 1.2 : 2.2, flat = !!o.flat;
  const path = () => {
    G.beginPath();
    if (flat) { G.moveTo(-1.55, ty); G.lineTo(1.55, ty); G.lineTo(rS, ty - tl); G.lineTo(rS, ty - 40); G.lineTo(-rS, ty - 40); G.lineTo(-rS, ty - tl); }
    else { G.moveTo(0, ty); G.lineTo(0.95, ty - 1.0); G.lineTo(rS, ty - tl); G.lineTo(rS, ty - 40); G.lineTo(-rS, ty - 40); G.lineTo(-rS, ty - tl); G.lineTo(-0.95, ty - 1.0); }
    G.closePath();
  };
  path(); G.fillStyle = own_finish('zinc', -rS, rS); G.fill();
  /* flutes (or the blade's grind) and a band of knurl that runs round as it turns */
  G.save(); path(); G.clip();
  G.strokeStyle = 'rgba(20,22,26,0.4)'; G.lineWidth = lw(1.2); G.beginPath();
  if (!flat) { G.moveTo(0, ty); G.lineTo(-0.4, ty - tl); G.moveTo(0, ty); G.lineTo(0.4, ty - tl); }
  const ph = ((o.turn || 0) % 1 + 1) % 1;
  for (let i = -6; i <= 6; i++) { const x = (i + ph) * 0.5; G.moveTo(x - 0.3, ty - tl - 0.4); G.lineTo(x + 0.3, ty - tl - 3.4); }
  G.stroke(); G.restore();
  path(); G.strokeStyle = 'rgba(16,17,20,0.7)'; G.lineWidth = lw(1); G.stroke();
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
    own_driverMM(ty, { flat: b.kind === 'flat', turn: b.turn, a: b.a });
    out.bitTip = SP(0, ty); out.bitTop = SP(0, ty - 6);
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

/* ---------- small slide helpers ---------- */
/** a bit's state on a timeline of phases [{ kind, t0, stay }]: it comes down (0.7 s), turns (0.8 s), and goes back up */
function own_bitAt(t, phases) {
  for (let i = phases.length - 1; i >= 0; i--) {
    const p = phases[i]; if (t < p.t0) continue;
    const u = t - p.t0, out = p.stay ? 0 : ep(u, 1.75, 2.25, E.cam);
    if (!p.stay && u > 2.3) return null;
    return { kind: p.kind, lift: 2.0 * (1 - ep(u, 0.05, 0.75, E.cam)) + 2.0 * out, turn: 1.6 * ep(u, 0.8, 1.6), a: ep(u, 0, 0.3) * (1 - ep(u, 2.0, 2.3)) + (p.stay ? ep(u, 2.0, 2.3) : 0), seat: u > 0.75 && u < 1.75, u };
  }
  return null;
}
/** a short label with a hairline leader from a point (stage px), right or left of it */
function own_tagLine(t, t0, p, to, s, o = {}) {
  const k = ep(t, t0, t0 + 0.45, E.snap); if (k <= 0 || !p) return;
  const right = to[0] >= p[0], col = o.color || C.mute;
  circle(p[0], p[1], 4 * k, { fill: o.dot || C.ink2, alpha: k });
  poly([[p[0], p[1]], [to[0], to[1]]], { color: col, w: 1.4, p: k, alpha: 0.8 });
  text(s, to[0] + (right ? 10 : -10), to[1] + 7, { role: o.role || 'label', size: o.size || 21, color: o.tcolor || C.ink2, align: right ? 'left' : 'right', alpha: k, maxW: o.maxW, lh: 1.3, sentence: o.role === 'small' });
}

/* ============================== #9 combination drive screws ============================== */
S({
  id: 'ownscrew', ch: 'own', theme: 'night', title: 'Combination drive screws', settle: 10, ideas: [9], after: 'repair',
  src: ['ownIso7045w', 'ownIso1580', 'ownBrock', 'gremlin'],
  draw: t => {
    header(t, 'Combination drive screws');
    captions(t, [[0.6, 'Every screw an owner turns is the same M2 pan head, with a cross for a Phillips bit and a slot for any flat blade.'], [5.6, 'The cross centres the bit on a small, low-torque screw. If it ever strips, the slot still turns it.']]);
    const y0 = LAY.top, h0 = 688, g = golden(LM, RM - LM, 48), [ax, aw] = g.a, [bx, bw] = g.b;
    /* which driver is in the head: the cross first, the slot as the fallback, then the cross again, and so on */
    const lt = t < 10 ? t : 10 + ((t - 10) % 9.2);
    const bit = own_bitAt(lt, t < 10 ? [{ kind: 'ph', t0: 2.2 }, { kind: 'flat', t0: 4.6 }, { kind: 'ph', t0: 7.0, stay: true }] : [{ kind: 'ph', t0: 7.0, stay: true }, { kind: 'flat', t0: 10.4 }, { kind: 'ph', t0: 13.0 }, { kind: 'ph', t0: 15.6, stay: true }]);
    const hi = bit && bit.a > 0.5 && bit.lift < 0.6 ? (bit.kind === 'ph' ? 'cross' : 'slot') : null;
    /* A · the head cut along its slot; the camera pushes in on the recess */
    demoWindow(ax, y0, aw, h0, ep(t, 0.2, 0.7), { grid: true });
    cardHead(t, 0.35, ax, y0, aw, 'Section A–A, along the slot', [{ ev: 'datasheet', by: 'ISO 7045' }]);
    const push = ep(t, 0.5, 2.4, E.cam), s = lerp(66, 116, push), fx = ax + aw * 0.43, fy = y0 + 330, ox = fx, oy = fy + 0.55 * s;
    let P = {};
    clipped(ax + 2, y0 + 80, aw - 4, h0 - 82, () => { P = part(ox, oy, s, () => own_headCutMM({ shank: 1.9, bit, hatchSp: 9 }), { alpha: ep(t, 0.4, 1.1) }) || {}; });
    if (bit && P.bitTip) {
      /* the pointer holds the driver; a ring when it seats */
      const py = Math.max(y0 + 104, P.bitTip[1] - 250), px = P.bitTip[0] + 30;
      cursorPtr(px, py, { grab: true, a: bit.a, press: bit.seat ? clamp((bit.u - 0.75) / 0.45) : 0, color: acc() });
    }
    const kc = ep(t, 7.4, 7.9);
    if (kc > 0 && P.cone) {
      own_tagLine(t, 7.4, P.cone, [ax + 150, P.cone[1] + 60], 'Cone, 1.05 mm deep');
      own_tagLine(t, 7.6, P.floorL, [ax + 150, P.floorL[1] - 70], 'Slot floor, 0.55 mm');
      own_tagLine(t, 7.8, P.plating, [ax + 150, P.plating[1] + 150], 'Brass plating');
      own_tagLine(t, 8.0, P.side, [ax + aw - 250, P.side[1] + 40], 'Ø 4.0 × 1.6 mm');
      own_tagLine(t, 8.2, P.thread, [ax + aw - 250, P.thread[1] + 40], 'M2 × 0.4, steel');
    }
    sourceBox(t, 6.4, ax + aw - 384, y0 + 96, 356, 'BikeGremlin', 'A Phillips bit in a JIS or Pozidriv head cams out and strips it. So the driver in the box is the one that fits.', { size: 25 });
    /* B · the head from above; the recess the driver is in lights up */
    const bh = 320;
    demoWindow(bx, y0, bw, bh, ep(t, 0.4, 0.9));
    cardHead(t, 0.55, bx, y0, bw, 'From above', [{ ev: 'datasheet', by: 'ISO 7045' }]);
    const tx = bx + 160, ty = y0 + 190, T0 = part(tx, ty, 56, () => own_headTopMM({ hi, accent: C.hero }), { alpha: ep(t, 0.8, 1.4) }) || {};
    const kb = ep(t, 1.4, 1.9);
    if (T0.crossEnd) {
      rich([{ s: 'Cross', role: 'label', size: 21, color: hi === 'cross' ? C.heroText : C.ink }, { s: 'Phillips H, No. 0, 1.9 mm', role: 'small', size: 25, color: C.ink2, gap: 14 }], bx + 296, y0 + 160, { alpha: kb });
      rich([{ s: 'Slot', role: 'label', size: 21, color: hi === 'slot' ? C.heroText : C.ink }, { s: 'any flat blade, 0.5 mm', role: 'small', size: 25, color: C.ink2, gap: 14 }], bx + 296, y0 + 226, { alpha: ep(t, 1.6, 2.1) });
      line(bx + 296, y0 + 190, bx + bw - 28, y0 + 190, { color: C.hair, w: 1.2, alpha: kb });
    }
    glossBox(t, 2.8, bx, y0 + bh + 40, bw, 'Combination drive', 'A cross for a Phillips bit and a slot for a flat blade, in one head. The cross centres the bit; the slot takes a blade of any width, so a stripped cross is not the end of the screw.');
  }
});

/* ============================== #101 brass heat-set inserts, against screwing straight into plastic ============================== */
/** one joint's in, out and in again, on its own clock lt: the screw's bearing face, which pass it is on, how deep each went */
function own_cycle(lt) {
  const k1 = ep(lt, 0.2, 1.0, E.io3), kOut = ep(lt, 1.15, 1.65, E.io3), k2 = ep(lt, 1.8, 2.7, E.io3);
  const pass = lt < 1.72 ? 1 : 2, k = pass === 1 ? k1 * (1 - kOut) : k2;
  return { k, pass, z: -1 - (1 - k) * 4.0, reach1: 4.0 * k1, reach2: pass === 2 ? 4.0 * k2 : 0, k2, active: lt > -0.2 && lt < 3.0, turn: (pass === 1 ? (k1 + kOut) : 2 + k2) * 4.0 / 0.4 };
}
S({
  id: 'own_insert', ch: 'own', theme: 'paper', title: 'Brass heat-set inserts', settle: 11, ideas: [101, 9], after: 'ownscrew',
  src: ['ownBrock', 'ownCovestro', 'ownAmtec', 'ownSpirol'],
  draw: t => {
    header(t, 'Brass heat-set inserts');
    captions(t, [[0.6, 'A screw driven into plastic cuts its own thread. Take it out and drive it back at the slightest angle, and it cuts another.'], [6.4, 'Brass is harder than anything the screw can cut, so it runs back down the same thread, every time.']]);
    const y0 = LAY.top, h0 = 688, g = golden(LM, RM - LM, 48), [ax, aw] = g.a, [bx, bw] = g.b;
    demoWindow(ax, y0, aw, h0, ep(t, 0.2, 0.7));
    const cols = [
      { kind: 'abs', name: 'Straight into ABS', v: OWN_FEEL.abs, tilt: 0.052, ph2: 0.3 },
      { kind: 'cf', name: 'Straight into carbon-filled PP', v: OWN_FEEL.cf, tilt: 0.052, ph2: 0.3 },
      { kind: 'insert', name: 'Brass insert', hero: true, tilt: 0.052, ph2: 0 }
    ];
    const cw = aw / 3, s = 38, jy = y0 + 352, T0 = 1.2, DT = 2.95;
    let ptr = null;
    cols.forEach((c, i) => {
      const cx = ax + cw * (i + 0.5), lt = t - (T0 + i * DT), cy = own_cycle(Math.max(-1, lt)), ka = ep(t, 0.5 + i * 0.15, 1.0 + i * 0.15);
      if (i) line(ax + cw * i, y0 + 36, ax + cw * i, y0 + h0 - 36, { color: C.hair, w: 1.2, alpha: ka });
      const lr = rich([{ s: c.name, role: 'label', size: 21, color: c.hero ? C.heroText : C.ink }], cx, y0 + 50, { align: 'center', alpha: ka });
      /* the second drive comes in tilted; in brass the thread steers it straight again */
      const tilt = c.kind === 'insert' ? c.tilt * (1 - ep(cy.k2, 0.04, 0.22)) : c.tilt, dA = cy.active ? ep(lt, -0.2, 0.15) * (1 - ep(lt, 2.75, 3.0)) : 0;
      let J = {};
      clipped(ax + cw * i + 6, y0 + 74, cw - 12, 520, () => {
        J = part(cx, jy, s, () => own_jointMM({ kind: c.kind, z: cy.z, pass: cy.pass, reach1: cy.reach1, reach2: cy.reach2, tilt, ph2: c.ph2, fw: 3.5, recut: clamp((cy.reach2 - 0.6) / 1.2), hole: C.panel, driver: { a: dA, turn: cy.turn } }), { alpha: ka }) || {};
      });
      if (dA > 0.02 && J.axisTop) ptr = { x: J.axisTop[0] + 34, y: Math.max(y0 + 96, J.axisTop[1] - 150), a: dA, press: cy.k > 0.97 && cy.pass === 1 ? 1 - ep(lt, 1.0, 1.4) : 0 };
      /* what happened: a re-cut thread in plastic; the same thread in brass */
      const done = ep(lt, 2.75, 3.15);
      if (done > 0) {
        if (c.kind !== 'insert') own_tagLine(t, T0 + i * DT + 2.75, J.recutPt, [cx + cw * 0.36, jy - 30], 'Re-cut', { tcolor: C.bad, dot: C.bad });
        else own_tagLine(t, T0 + i * DT + 2.75, J.insert, [cx + cw * 0.36, jy - 30], 'Same thread', { tcolor: C.heroText, dot: C.hero });
      }
      /* Brock's estimate under each joint, as it finishes; the insert's has no published figure */
      const ny = y0 + 600, kn = ep(lt, 2.9, 3.4);
      if (c.v != null) {
        rich([{ s: String(c.v), role: 'stat', size: 76, color: C.ink, tnum: true, count: [T0 + i * DT + 2.9, 0.9] }, { s: '%', font: 'mono', size: 30, weight: 600, color: C.mute, gap: 6 }], cx - 112, ny, { t, alpha: kn });
        pill(cx + 30, ny - 30, 'estimate', kn, { by: 'Brock' });
        text('Feel different after one re-assembly', cx - 112, ny + 44, { role: 'small', size: 25, color: C.ink2, maxW: cw - 40, alpha: kn });
      } else {
        text('No published figure', cx - 130, ny - 20, { role: 'h3', size: 30, color: C.ink, alpha: kn });
        pill(cx - 130, ny + 18, 'placeholder', kn, { text: 'Gap' });
        text('Makers say "as often as required" (Böllhoff, a claim)', cx - 130, ny + 62, { role: 'small', size: 25, color: C.ink2, maxW: cw - 30, alpha: kn, lh: 1.3 });
      }
    });
    if (ptr) cursorPtr(ptr.x, ptr.y, { grab: true, a: ptr.a, press: ptr.press, color: acc() });
    /* the right column: what an insert is, what the guides say, and the measure nobody publishes */
    const gb = glossBox(t, 1.6, bx, y0, bw, 'Heat-set insert', 'A knurled brass sleeve pressed into its boss hot. The plastic melts into the knurls and sets round them, so the screw\'s thread is brass, not plastic.');
    const sb = sourceBox(t, 3.6, bx, y0 + gb.h + 40, bw, 'Covestro guide', 'A screw that cuts its own thread suits once-only assembly, or a few re-assemblies, and then only if it is run back into its own thread carefully, by hand.');
    noteBox(t, 9.6, bx, y0 + gb.h + sb.h + 80, bw, { kind: 'placeholder', label: 'Gap', head: 'Right on the first assembly', body: 'No one publishes this rate, for any of the three. An insert moves the risk to the factory: up to 75% of its hold comes from how it was put in (SPIROL, a maker\'s claim).' });
  }
});

/* ============================== thread wear: the published tests ============================== */
S({
  id: 'own_wear', ch: 'own', theme: 'night', title: 'Thread wear in plastic bosses', settle: 10, ideas: [101], after: 'own_insert',
  src: ['ownCumbicus', 'ownHios', 'ownCovestro', 'ownAmtec', 'ownPemM2', 'ownIso68', 'ownBrock'],
  draw: t => {
    header(t, 'Thread wear in plastic bosses');
    captions(t, [[0.6, 'Each time a screw goes back into plastic it trims the thread it left. Measured, the joint loses torque from the third assembly on.'], [5.8, 'No maker publishes a count for brass; they say "as often as required". I\'ll publish mine: torque logged over 50 cycles.']]);
    const y0 = LAY.top, g = golden(LM, RM - LM, 48), [ax, aw] = g.a, [bx, bw] = g.b, r1 = 392, y1 = y0 + r1 + 40, r2 = 688 - r1 - 40;
    /* A · the flank, close up: plastic after one re-assembly, and brass */
    demoWindow(ax, y0, aw, r1, ep(t, 0.2, 0.7), { grid: true });
    cardHead(t, 0.35, ax, y0, aw, 'The flank, close up', []);
    const push = ep(t, 0.5, 2.3, E.cam), half = aw / 2, kcut = ep(t, 2.6, 4.4, E.io3);
    clipped(ax + 2, y0 + 70, half - 4, r1 - 72, () => {
      const F = part(ax + half / 2, y0 + 210, lerp(130, 190, push), () => own_flankTFMM(kcut, { mat: OWN_MAT.abs, n: 1.25 }), { alpha: ep(t, 0.5, 1.0) }) || {};
      if (F.sliver && kcut > 0.5) own_tagLine(t, 4.4, F.sliver, [F.sliver[0] + 120, y0 + 120], 'Shaved off', { tcolor: C.bad, dot: C.bad });
    });
    text('ABS, after one re-assembly', ax + half / 2, y0 + r1 - 30, { role: 'small', size: 25, color: C.ink2, align: 'center', alpha: ep(t, 1.0, 1.4) });
    line(ax + half, y0 + 70, ax + half, y0 + r1 - 26, { color: C.hair, w: 1.2, alpha: ep(t, 0.6, 1.0) });
    let I = {};
    clipped(ax + half + 2, y0 + 70, half - 4, r1 - 72, () => {
      I = part(ax + half * 1.5, y0 + 208, lerp(300, 440, push), () => own_isoMM({ n: 2.6 }), { alpha: ep(t, 0.7, 1.2) }) || {};
      /* a light passes along the brass, once, when it has settled */
      const ls = ep(t, 4.6, 5.8, E.io3);
      if (ls > 0 && ls < 1) { const lx = ax + half + 2 + (half - 4) * ls, lg = G.createLinearGradient(lx - 70, 0, lx + 70, 0); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(0.5, 'rgba(255,248,225,0.22)'); lg.addColorStop(1, 'rgba(255,255,255,0)'); G.fillStyle = lg; G.fillRect(lx - 70, y0 + 70, 140, r1 - 72); }
    });
    if (I.apex) {
      const ki = ep(t, 3.0, 3.5);
      text('60°', I.apex[0], I.apex[1] - 14, { font: 'mono', size: 24, weight: 700, color: C.ink, align: 'center', alpha: ki });
      text('P 0.4 mm', I.pitch[1][0] + 16, I.pitch[1][1] - 12, { font: 'mono', size: 22, weight: 600, color: C.ink2, alpha: ki });
    }
    text('Brass and steel, ISO 60° thread, after any number', ax + half * 1.5, y0 + r1 - 30, { role: 'small', size: 25, color: C.ink2, align: 'center', alpha: ep(t, 1.2, 1.6) });
    /* B · measured: loosening torque kept over ten assemblies (Cumbicus et al. 2023) */
    demoWindow(bx, y0, bw, r1, ep(t, 0.4, 0.9));
    cardHead(t, 0.55, bx, y0, bw, 'Torque kept, 10 assemblies', [{ ev: 'measured', by: 'Cumbicus 2023' }]);
    const m = axes(t, { x: bx + 96, y: y0 + 100, w: bw - 150, h: r1 - 196, xr: [1, 10], yr: [40, 100], xticks: [1, 3, 5, 10], yticks: [40, 70, 100], yfmt: v => v + '%', t0: 0.9 });
    const ser = [{ name: 'PF-30', pts: [[1, 100], [3, 88.05], [5, 84.69], [10, 82.84]], col: C.ink, ring: false }, { name: 'Delta PT', pts: [[1, 100], [5, 43.27], [10, 58.07]], col: C.comp, ring: true }];
    ser.forEach((sr, si) => {
      const k = ep(t, 1.4 + si * 0.5, 2.6 + si * 0.5, E.io3), P2 = sr.pts.map(([x, y]) => [m.X(x), m.Y(y)]);
      poly(P2, { color: sr.col, w: 2.5, p: k, dash: si ? [7, 6] : null });
      sr.pts.forEach(([x, y], j) => { const kk = ep(t, 1.4 + si * 0.5 + j * 0.25, 1.7 + si * 0.5 + j * 0.25); if (sr.ring) circle(m.X(x), m.Y(y), 7 * kk, { color: sr.col, w: 2.5, fill: C.panel }); else circle(m.X(x), m.Y(y), 7 * kk, { fill: sr.col }); if (j) text(fmtN(y, 0) + '%', m.X(x) + (j === sr.pts.length - 1 ? -10 : 12), m.Y(y) + (si ? 30 : -14), { font: 'mono', size: 21, weight: 700, color: C.ink, align: j === sr.pts.length - 1 ? 'right' : 'left', alpha: kk }); });
      const last = P2[P2.length - 1];
      text(sr.name, last[0] + 12, last[1] + 7, { role: 'label', size: 21, color: sr.col === C.comp ? C.mute : C.ink, alpha: ep(t, 2.6 + si * 0.5, 3.0 + si * 0.5) });
    });
    text('Assembly', bx + bw - 54, y0 + r1 - 26, { role: 'label', size: 19, color: C.mute, align: 'right', alpha: ep(t, 1.0, 1.4) });
    text('5 mm screws in glass-filled PEI', bx + 28, y0 + r1 - 26, { role: 'label', size: 19, color: C.faint, alpha: ep(t, 1.0, 1.4) });
    /* C · how many times, by the makers' own counts; brass has none */
    demoWindow(ax, y1, aw, r2, ep(t, 0.6, 1.1));
    cardHead(t, 0.75, ax, y1, aw, 'Assemblies before damage', [{ ev: 'claim' }]);
    const rows = [['Another maker\'s tapping screw', 7, 'HIOS'], ['VDE 0700 asks for', 10, 'Covestro'], ['DELTA PT', 40, 'HIOS'], ['Brass insert', null, 'Böllhoff: "as often as required"']];
    const lx2 = ax + 28, bx2 = ax + 330, bw2 = aw - 330 - 210;
    rows.forEach(([name, v, who], i) => {
      const yy = y1 + 86 + i * 36, k = ep(t, 1.2 + i * 0.15, 2.0 + i * 0.15, E.snap), a = ep(t, 1.1 + i * 0.15, 1.4 + i * 0.15);
      text(name, lx2, yy + 8, { role: 'small', size: 25, color: v == null ? C.heroText : C.ink, weight: v == null ? 700 : 500, alpha: a });
      if (v != null) { rect(bx2, yy - 7, bw2 * v / 40 * k, 14, { fill: name === 'VDE 0700 asks for' ? C.ink2 : C.comp, alpha: a }); text(String(v), bx2 + bw2 * v / 40 * k + 10, yy + 8, { font: 'mono', size: 23, weight: 700, color: C.ink, alpha: a }); text(who, ax + aw - 28, yy + 8, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: a }); }
      else { G.save(); G.globalAlpha = a; G.setLineDash([7, 6]); G.strokeStyle = C.hero; G.lineWidth = 1.8; G.strokeRect(bx2, yy - 7, bw2 * k, 14); G.restore(); text(who, ax + aw - 28, yy + 8, { role: 'small', size: 25, color: C.ink2, align: 'right', alpha: a }); }
    });
    /* D · what a brass insert holds in ABS, and Brock's way to keep the screw from backing out */
    const sw = (bw - 40) / 2;
    statCard(t, 1.8, bx, y1, bw, r2, { label: 'PEM M2 insert, in ABS', ev: 'claim', value: '255', unit: 'N', body: 'To pull it out; 0.5 N·m to turn it.', size: 72 });
  }
});

/* ============================== what the joints weigh ============================== */
/** horizontal bars for fastener masses: name, qualifier, a bar on a track, the value and its evidence mark */
function own_massBars(t, t0, x, y, w, rows, o = {}) {
  const lw0 = o.labelW || 300, vw = o.valW || 150, bx = x + lw0, bw = w - lw0 - vw, max = o.max, rh = o.rh || 62;
  rows.forEach((r, i) => {
    const yy = y + i * rh, a = ep(t, t0 + i * 0.12, t0 + 0.35 + i * 0.12), k = ep(t, t0 + 0.2 + i * 0.12, t0 + 1.0 + i * 0.12, E.snap);
    if (i) line(x, yy - rh * 0.5, x + w, yy - rh * 0.5, { color: C.hair, w: 1, alpha: a * 0.8 });
    text(r.name, x, yy, { role: 'small', weight: r.hero ? 800 : r.ref ? 700 : 500, color: C.ink, alpha: a });
    text(r.qual, x, yy + 28, { role: 'label', size: 19, color: r.hero ? C.heroText : C.faint, alpha: a });
    const lo = Array.isArray(r.v) ? r.v[0] : r.v, hi = Array.isArray(r.v) ? r.v[1] : r.v, by = yy - 4, bh = 14;
    rr(bx, by - bh / 2, bw, bh, bh / 2, C.track, null, 0, a);
    const col = r.hero ? C.hero : r.ref ? C.ref : C.comp;
    if (hi !== lo) rr(bx, by - bh / 2, Math.max(bh, bw * hi / max * k), bh, bh / 2, rgba(col, 0.42), null, 0, a);
    rr(bx, by - bh / 2, Math.max(bh, bw * lo / max * k), bh, bh / 2, col, null, 0, a);
    const vs = { font: 'mono', size: 25, weight: r.hero ? 800 : 600 };
    text(r.label, x + w, yy + 2, Object.assign({ color: C.ink, align: 'right', alpha: a }, vs));
    evDot(x + w - tw(r.label, vs) - 16, yy - 6, r.ev, 5.5, a);
  });
  return y + rows.length * rh;
}
S({
  id: 'own_mass', ch: 'own', theme: 'paper', title: 'Fastener mass', settle: 10, ideas: [9, 101], after: 'own_wear',
  src: ['ownB2gSlx', 'exXbabWeight', 'exZkM1k', 'ownIso7045w', 'ownBrock'],
  draw: t => {
    header(t, 'Fastener mass');
    captions(t, [[0.6, 'Brass and steel cost mass. The Starlight X holds its whole frame together with 0.30 g of titanium.'], [5.6, 'So M2 and brass go only where an owner opens the mouse, as far from the antenna as the layout allows.']]);
    const y0 = LAY.top, h0 = 688, g = golden(LM, RM - LM, 48), [ax, aw] = g.a, [bx, bw] = g.b;
    demoWindow(ax, y0, aw, h0, ep(t, 0.2, 0.7));
    cardHead(t, 0.35, ax, y0, aw, 'Mass per fastener', ['claim', 'datasheet', { ev: 'estimate', by: 'Brock' }, 'derived']);
    const rows = [
      { name: 'Finalmouse Starlight X', qual: 'Titanium, 15 per mouse', v: 0.02, label: '0.02 g', ev: 'claim', ref: true },
      { name: 'XBAB XA25', qual: 'Thread-forming, 0.708 g ÷ 11', v: 0.064, label: '0.064 g', ev: 'derived' },
      { name: 'Zaunkoenig M1K', qual: '1.5 g ÷ 9', v: 0.167, label: '0.167 g', ev: 'derived' },
      { name: 'M2 × 5 pan head', qual: 'Steel, ISO 7045 table', v: 0.215, label: '0.215 g', ev: 'datasheet', hero: true },
      { name: 'M2 brass insert', qual: 'Brock\'s figure', v: [0.16, 0.18], label: '0.16–0.18 g', ev: 'estimate', hero: true },
      { name: 'One Theseus joint', qual: 'Screw + insert', v: [0.375, 0.395], label: '0.38–0.40 g', ev: 'derived', hero: true }
    ];
    own_massBars(t, 0.9, ax + 28, y0 + 136, aw - 56, rows, { max: 0.42, labelW: 330, valW: 200, rh: 84 });
    /* the total, if six joints are serviceable (an assumption) */
    const n = 6, lo = n * 0.375, hiM = n * 0.395, mid = (lo + hiM) / 2, pct = mid / THESEUS.mass * 100;
    statCard(t, 5.2, bx, y0, bw, 300, { label: 'Six service joints', ev: 'derived', value: fmtN(mid, 1), unit: 'g', body: fmtN(pct, 1) + '% of ' + THS.massG + ' (6 assumed × 0.385 g)', hero: true, size: 84 });
    /* where they go: far from the antenna (#101) */
    const ky = y0 + 340, kh = h0 - 340;
    demoWindow(bx, ky, bw, kh, ep(t, 5.6, 6.1));
    cardHead(t, 5.75, bx, ky, bw, 'Away from the antenna (#101)', ['proposal']);
    const kx = bx + 170, kcy = ky + kh / 2 + 18, ks = 2.3, kk = ep(t, 6.0, 6.5);
    part(kx, kcy, ks, () => {
      keyPlanMM({ hi: ['antenna'], accent: C.bad });
      for (const [x, y] of [[-20, 40], [20, 40], [-24, 8], [24, 8], [-13, 26], [13, 26]]) { G.beginPath(); G.arc(x, y, 2.6, 0, TAU); G.fillStyle = C.hero; G.fill(); }
    }, { alpha: kk });
    rich([{ s: 'Antenna', role: 'label', size: 21, color: C.bad }], kx + 120, ky + 120, { alpha: kk });
    text('At the nose. Metal near it detunes it, so the six inserts sit in the rear two thirds.', kx + 120, ky + 158, { role: 'small', size: 25, color: C.ink2, maxW: bw - 310, lh: 1.32, alpha: kk });
    text('Positions are illustrative', kx + 120, ky + kh - 30, { role: 'label', size: 19, color: C.faint, alpha: kk });
  }
});
