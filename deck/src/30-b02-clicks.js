/* ============================================================================================
   B02 · CLICKS I: THE MECHANICS THAT MATTER MOST (revamp v2, 2026-11-06)
   Twelve slides, in film order: the chapter card, straight rear cutouts, seams, a flat front, grooves, flush walls, Direct
   Drive Actuation, one flat board, the bridge tensioner, a stiff trigger, dual rail main clicks, POM pads.
   Every slide runs the rival's fault first, drawn mechanically and named, then the same input on Theseus's part, then what
   the player gets (common.md M1 to M10). Every top-level name here starts with b02_ / B02_. Parts come from the shared
   drawings (clk_gt01MM, clickMM, clk_ten / clk_ribbon / clk_lever, the 3D twins in GEO2D) and the motion kit (06-motion.js).
   ============================================================================================ */
Object.assign(SRC, {
  b02_scan: { t: 'The deck\'s 3D model of the Ninjutso Sora V2 (from Brock\'s scan) and of Theseus, top view of the left trigger (deck/geo2d shell-sora and shell): the Sora\'s rear cutout rises 4.8 mm from the centre to the outer corner; at the switch line (16 mm out, board plan 5) a 10 mm tensioner along it leans 13.2°', u: '', n: 'Derived from the 3D model; the raw scan is not published (F0.6).' },
  b02_tpuV3: { t: 'TechPowerUp, Razer Viper V3 Pro review: "the main buttons no longer extend across the entire width of the mouse, and are now framed by ledges"', u: 'https://techpowerup.com/review/razer-viper-v3-pro/3.html' },
  b02_tpuV2: { t: 'TechPowerUp, Razer Viper V2 Pro review: "lateral button movement is minimal and must be provoked to become noticeable"', u: 'https://techpowerup.com/review/razer-viper-v2-pro/4.html' },
  b02_tpuOp1: { t: 'TechPowerUp, Endgame Gear OP1 8K review: "The main and side buttons sit on their own PCBs screwed into the top shell", the former "connected through a 3-pin connector"; "The left button has low pre and moderate post-travel", the right "moderate pre and post-travel"', u: 'https://techpowerup.com/review/endgame-gear-op1-8k/4.html' },
  b02_osWork: { t: 'OpenStax, College Physics, §7.1 "Work: The Scientific Definition", Figure 7.2: "The work done by the force F on this lawn mower is Fd cos θ"; "F cos θ is the component of the force in the direction of motion"', u: 'https://openstax.org/books/college-physics/pages/7-1-work-the-scientific-definition' },
  b02_osStab: { t: 'OpenStax, College Physics for AP Courses, §9.3 "Stability": a marble at the bottom of a bowl is pushed back (stable equilibrium); a ball on top of a hill runs away once nudged (unstable)', u: 'https://openstax.org/books/college-physics-ap-courses/pages/9-3-stability' },
  b02_radwin: { t: 'Radwin & Jeng 1997, Human Factors 39(1): 130–140, "Activation force and travel effects on overexertion in repetitive key tapping": "Peak force during keying has been measured to be as much as 2.5 to 4.6 times the required activation force"', u: 'https://ergo.wisc.edu/wp-content/uploads/sites/901/2020/04/Radwin-and-Jeng-1997.pdf' },
  b02_johnson: { t: 'Johnson, Hagberg, Wigaeus Hjelm & Rempel 2000, Scand J Work Environ Health 26(5): 398–405: mean force on the mouse button 0.35 N, on the sides 0.43 N, over mouse use', u: 'https://www.sjweh.fi/article/560' },
  b02_dias: { t: 'Dias, Dudte, Mahadevan & Santangelo 2012, "Geometric Mechanics of Curved Crease Origami", Physical Review Letters: a closed curved crease "is frustrated by geometry, forcing it to buckle"', u: 'https://arxiv.org/abs/1206.0461' },
  b02_nickel: { t: 'US Mint, coin specifications: the 5-cent nickel, "Cupro-Nickel 25% Ni | 5.000 g | 21.21 mm | 1.95 mm" (archived 2020-12-18)', u: 'https://webarchive.library.unt.edu/web/20201218003308/https://www.usmint.gov/learn/coin-and-medal-programs/coin-specifications' },
  b02_lamotte: { t: 'Johansson & LaMotte 1983, Somatosensory Research 1: 21–31 (LaMotte & Whitehouse\'s dot studies): a single 550 µm dot moved across the fingerpad at 10 mm/s is detected at 1 to 3 µm high', u: 'https://doi.org/10.3109/07367228309144538' },
  b02_dandekar: { t: 'Dandekar, Raju & Srinivasan 2003, J Biomech Eng 125(5): 682–691 (MIT Touch Lab): "human fingertips are typically 16–20 mm in diameter"', u: 'https://core.ac.uk/download/4402363.pdf' },
  b02_tpuGpx2: { t: 'TechPowerUp, Logitech G Pro X Superlight 2 review: "Both buttons have some pre-travel along with low post-travel"', u: 'https://techpowerup.com/review/logitech-g-pro-x-superlight-2/4.html' },
  b02_albers: { t: 'Erik Demaine, History of Curved Origami Sculpture: Josef Albers\' preliminary course at the Bauhaus, 1927–28: paper folded along concentric circles "will automatically twist into a saddle curve"', u: 'https://erikdemaine.org/curved/history/' }
});

/* ============================== shared geometry ==============================
   World frame for every b02 drawing in mm: x to the right as seen from above with the nose up (x = -X of the 3D scene, so
   the user's left trigger has x < 0), y up from the desk, z forward (the scene's +Z, the nose). */
const B02 = {
  sw: { x: 16.0, z: 36.72 },        /* the GT01s on board plan 5: x ±16.0, board z 39.6, board offset -2.88 (3d/pcb plan5.py) */
  seam: -KEY.seam,                  /* Theseus's straight rear cutout, z 4.84 (F12.9) */
  smile: [0.0059, 0.0461, 4.718],   /* the Sora V2's rear cutout, fitted to the 3D twin's left trigger: z = a x² + b|x| + c */
  arc: 20 * Math.PI / 180,          /* the post's arc at the plunger, off upright (clickGeo: crown (-1.4, 0.2), foot (30, 11.63)) */
  tw: 10,                           /* the tensioner's width along its bend line (CLK_TN.b) */
  gf: 55,                           /* the GT01's operating force, gf (Gateron via MechKeys, clk_gt01) */
  ex: 14                            /* motion drawn this many times its size in the 3D views */
};
const b02_smileZ = x => { const a = Math.abs(x), [p, q, r] = B02.smile; return p * a * a + q * a + r; };
/* true greys only (Brock, 08:18): the ramp's tokens for parts, and the kit's own body fill where an overlay has to cover
   mouseSimple's lines exactly (keep in step with mouseSimple's bodyF) */
const b02_bodyF = () => (TH ? '#FFFFFF' : '#1A1B1E');
const b02_partF = () => (TH ? C.track : C.hair);      /* a part a step off the body: a trigger */
const b02_shellF = () => (TH ? C.hair : C.comp2);     /* a step further: the shell under it */

/** the 3D twin's outline of a part seen from above, in world mm [[x, z], ...], decoded once (GEO2D rings, axis '1'). */
const B02_RING = new Map();
function b02_ring(scene, re) {
  const key = scene + '|' + re.source; if (B02_RING.has(key)) return B02_RING.get(key);
  let out = null;
  const D = typeof GEO2D !== 'undefined' && GEO2D[scene];
  if (D) {
    const q = 1 / D.q, m = D.meshes.find(mm => re.test(mm.path));
    const rings = m && m.rings && m.rings['1'];
    if (rings && rings.length) {
      let best = null;
      for (const r of rings) { if (r.h) continue; let u = 0, v = 0; const pts = []; for (let i = 0; i < r.d.length; i += 2) { u += r.d[i]; v += r.d[i + 1]; pts.push([-u * q, v * q]); } if (!best || pts.length > best.length) best = pts; }
      out = best;
    }
  }
  B02_RING.set(key, out);
  return out;
}

/* ---------- the left trigger, from above: its outline from the 3D model, with the rear edge as a morph ----------
   Theseus's trigger and the Sora's share every edge but the rear one (the Theseus shell is the scanned Sora with a straight
   rear cutout, F12.9), so the outline is built once: the inner, front and outer edges from Theseus's twin, and the rear edge
   sampled from the outer joint (x -28.1, z 12.0) to the inner corner (x -0.15) as a curve that blends from Theseus's straight
   edge and rounded corner (k 0) to the Sora's smile (k 1). Both rear curves are parameterised by arc length, so the morph
   slides point for point. */
let B02_TRIG = null;
function b02_trigBase() {
  if (B02_TRIG) return B02_TRIG;
  const P = b02_ring('shell', /explodeL\/triggerL\/Group\/triggerL$/);
  const S = b02_ring('shell-sora', /explodeL\/triggerL\/Group\/triggerL$/);
  /* fall back to a generic trigger if the twins are missing (the drawing still reads) */
  const fallback = () => { const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([-0.15, 5 + u * 54.8]); } for (let i = 0; i <= 30; i++) { const u = i / 30; pts.push([-0.15 - 29 * Math.sin(u * Math.PI / 2), 59.8 - 8 * (1 - Math.cos(u * Math.PI / 2))]); } for (let i = 1; i <= 30; i++) { const u = i / 30; pts.push([-29.2 + 1.1 * u, 51.8 - 39.8 * u]); } return pts; };
  const src = P || fallback();
  /* walk the outline from the inner-rear corner up the inner edge, round the front, down the outer edge to the joint */
  const near = (pts, x, z) => pts.reduce((b, p, i) => { const d = Math.hypot(p[0] - x, p[1] - z); return d < b.d ? { d, i } : b; }, { d: 1e9, i: 0 }).i;
  const n = src.length, i0 = near(src, -0.15, 5.6), i1 = near(src, -28.1, 12.6);
  /* the outline runs inner edge → front → outer edge in one direction round the ring: pick the direction that reaches the
     front (z max) before the joint */
  const walk = dir => { const out = []; for (let k = 0, i = i0; k < n; k++, i = (i + dir + n) % n) { out.push(src[i]); if (i === i1) break; } return out; };
  let fixed = walk(1); if (Math.max(...fixed.map(p => p[1])) < 50) fixed = walk(-1);
  /* light smoothing (the twin is quantised to 0.05 mm) */
  const sm = fixed.map((p, i) => { if (!i || i === fixed.length - 1) return p.slice(); const a = fixed[i - 1], b = fixed[i + 1]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4]; });
  /* the two rear curves, from the joint to the inner corner, N points each by arc length */
  const N = 48;
  const resample = pts => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); const T = L[L.length - 1], out = []; let j = 1; for (let k = 0; k < N; k++) { const s = T * k / (N - 1); while (j < L.length - 1 && L[j] < s) j++; const u = (s - L[j - 1]) / ((L[j] - L[j - 1]) || 1); out.push([lerp(pts[j - 1][0], pts[j][0], u), lerp(pts[j - 1][1], pts[j][1], u)]); } return out; };
  const joint = sm[sm.length - 1];
  /* Theseus: the twin's own corner and straight rear edge, walking on from the joint to the inner corner */
  const rest = []; { const dir = fixed.length > 1 && src.indexOf(fixed[1]) === (i0 + 1) % n ? 1 : -1; for (let k = 0, i = i1; k < n; k++, i = (i + dir + n) % n) { rest.push(src[i]); if (i === i0) break; } }
  const thR = rest.length > 4 ? rest : [joint, [-23.6, B02.seam], [-0.15, B02.seam]];
  /* the Sora: from the joint along its outer corner to the smile's end at x -24.9, then the smile to the centre */
  const so = [[joint[0], joint[1]], [-27.2, 10.3], [-26.3, 9.76]]; for (let k = 0; k <= 30; k++) { const x = lerp(-24.9, -0.15, k / 30); so.push([x, b02_smileZ(x)]); }
  B02_TRIG = { fixed: sm, rearT: resample(thR), rearS: resample(so), twin: !!P, sora: !!S };
  return B02_TRIG;
}
/** the left trigger's outline, from above, world mm: k = 0 Theseus (straight), 1 the Sora's smile. Closed, CCW-agnostic */
function b02_trigOutline(k = 0) {
  const T = b02_trigBase(), rear = T.rearT.map((p, i) => [lerp(p[0], T.rearS[i][0], k), lerp(p[1], T.rearS[i][1], k)]);
  return T.fixed.concat(rear.slice(1, -1));
}
/** the rear edge alone, from the outer joint to the inner corner, world mm */
function b02_trigRear(k = 0) { const T = b02_trigBase(); return T.rearT.map((p, i) => [lerp(p[0], T.rearS[i][0], k), lerp(p[1], T.rearS[i][1], k)]); }
/** the rear cutout's z at x for a blend k (0 straight, 1 smile) */
const b02_rearZ = (x, k) => lerp(B02.seam, b02_smileZ(x), k);

/** the top surface's height (y, mm) at (x, z), simplified from the 3D twin: the crown falls 0.3 mm per mm forward of the rear
   cutout (curving down to the nose) and 0.0113 x² across; behind the cutout the shell climbs to the hump at z -12. Fits the
   twin's side silhouette within about 1 mm, which is all a drawing this size needs */
function b02_h(x, z) {
  const c = z >= 5 ? 35.7 - 0.3 * (z - 5) - 0.0025 * (z - 5) * (z - 5) : 38.1 - 0.0082 * (z + 12) * (z + 12);
  return c - 0.0113 * x * x;
}

/* ---------- the trigger's hinge: the bend line the tensioner takes, and what a press does about it ----------
   A rigid trigger turns about its bend line. Its tensioner (10 mm wide, centred on the switch line, #18) bends along the rear
   cutout (#17), so the bend line is the cutout's chord over the tensioner's width. Straight cutout: square across. The
   Sora's smile: it leans. The physics is the hinge's: a press at P clicks when F·d(P) = F_switch·d(S) + M_spring, where d is
   the distance from the bend line in the plan (lever arms); the post's foot swings perpendicular to the line. */
function b02_hinge(k) {
  const xc = -B02.sw.x, a = xc + B02.tw / 2, b = xc - B02.tw / 2;              /* the tensioner spans x -11 .. -21 */
  const za = b02_rearZ(a, k), zb = b02_rearZ(b, k), zc = (za + zb) / 2;
  const ux = b - a, uz = zb - za, L = Math.hypot(ux, uz);                        /* along the line, inner → outer */
  return { a: [a, za], b: [b, zb], c: [xc, zc], u: [ux / L, uz / L], lean: Math.atan2(uz, Math.abs(ux)) };
}
/** the lever arm (mm) from the bend line to a point (x, z) in plan, on the trigger's side of it */
function b02_arm(H, x, z) { const dx = x - H.c[0], dz = z - H.c[1]; return Math.abs(dx * H.u[1] - dz * H.u[0]); }
/** the spring's own moment at the click, gf·mm: K1's bridge (clk_ten) clicks with 7.7 gf at 40 mm on its own */
function b02_springM() { try { const c = clk_ten('bridge', 'ppcf').clk; return c.gf * CLK_TN.XP; } catch (e) { return 7.7 * 40; } }
/** the finger force (gf) that clicks the switch, pressed at (x, z) on a trigger whose cutout blend is k */
function b02_clickGf(k, x, z) {
  const H = b02_hinge(k), dS = b02_arm(H, -B02.sw.x, B02.sw.z), dP = b02_arm(H, x, z);
  return (B02.gf * dS + b02_springM()) / dP;
}
/** the share of the post foot's travel that goes sideways (across the switch), for a bend line leaning `lean` and the post's
   20° arc: its swing is perpendicular to the bend line, so sin(lean) of its fore-aft part goes across */
const b02_sideShare = lean => { const r = Math.tan(B02.arc); return r * Math.sin(lean) / Math.hypot(r, Math.cos(lean)); };
/* the spring's moment scales with the turn the click needs (0.35 mm at the plunger over its lever), so it is taken at the
   model's 30 mm lever and scaled by 30 / d(S) */
function b02_clickGf2(k, x, z) {
  const H = b02_hinge(k), dS = b02_arm(H, -B02.sw.x, B02.sw.z), dP = b02_arm(H, x, z);
  return (B02.gf * dS + b02_springM() * CLK_TN.XS / dS) / dP;
}

/* ============================== a small 3D view for the drawings that need one ==============================
   Orthographic, as the deck's flat twins are, with a camera that can start straight overhead (matching the top view the kit
   establishes on) and tip back into a three-quarter view in one continuous move. */
/** a camera on a target T (world mm): yaw ψ about the vertical, pitch φ above the desk (π/2 = straight down, nose up on
   screen), s px per mm, the target at (cx, cy) on the stage. P(p) → [sx, sy, depth] (depth: larger is nearer) */
function b02_cam3(T, yaw, pitch, s, cx, cy) {
  const cp = Math.cos(pitch), sp = Math.sin(pitch), cs = Math.cos(yaw), sn = Math.sin(yaw);
  const R = [cs, 0, -sn], c = [-sn * cp, sp, -cs * cp];
  const U = [R[1] * c[2] - R[2] * c[1], R[2] * c[0] - R[0] * c[2], R[0] * c[1] - R[1] * c[0]];
  const P = p => { const d = [p[0] - T[0], p[1] - T[1], p[2] - T[2]]; return [cx + s * (d[0] * R[0] + d[1] * R[1] + d[2] * R[2]), cy - s * (d[0] * U[0] + d[1] * U[1] + d[2] * U[2]), d[0] * c[0] + d[1] * c[1] + d[2] * c[2]]; };
  return { P, R, U, c, s, T };
}
/** rotate p about the axis through A along unit k by angle a (Rodrigues) */
function b02_rot(p, A, k, a) {
  if (!a) return p;
  const v = [p[0] - A[0], p[1] - A[1], p[2] - A[2]], ca = Math.cos(a), sa = Math.sin(a), kv = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];
  const x = [k[1] * v[2] - k[2] * v[1], k[2] * v[0] - k[0] * v[2], k[0] * v[1] - k[1] * v[0]];
  return [A[0] + v[0] * ca + x[0] * sa + k[0] * kv * (1 - ca), A[1] + v[1] * ca + x[1] * sa + k[1] * kv * (1 - ca), A[2] + v[2] * ca + x[2] * sa + k[2] * kv * (1 - ca)];
}
/** the hinge in 3D for a cutout blend k: a point on the bend line at the switch line, under the skin, and its direction;
   turn(p, a) rotates a trigger point by a press of angle a (positive a always takes the front down) */
function b02_hinge3(k) {
  const H = b02_hinge(k), A = [H.c[0], b02_h(H.c[0], H.c[1]) - 1.2, H.c[1]];
  let K = [H.u[0], 0, H.u[1]];
  if (b02_rot([A[0], A[1], A[2] + 10], A, K, 0.1)[1] > A[1]) K = K.map(v => -v);
  return { H, A, K, turn: (p, a) => b02_rot(p, A, K, a) };
}
/** the x range of the trigger's outline at depth z (its inner and outer edges), from a closed outline */
function b02_spanAt(pts, z) {
  const xs = [];
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[1] - z) * (b[1] - z) <= 0 && a[1] !== b[1]) xs.push(a[0] + (b[0] - a[0]) * (z - a[1]) / (b[1] - a[1])); }
  return xs.length >= 2 ? [Math.min(...xs), Math.max(...xs)] : null;
}
/** the plate a trigger's top makes, lifted onto the crown (b02_h), turned by a press about its hinge, projected */
function b02_lift(pts, cam, turn, a, dy = 0) { return pts.map(([x, z]) => { const p = turn ? turn([x, b02_h(x, z) + dy, z], a) : [x, b02_h(x, z) + dy, z]; return cam.P(p); }); }
const b02_pathOf = (q, close = true) => { G.beginPath(); q.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); if (close) G.closePath(); };
/** the left trigger in the 3D view. o = { k (0 straight .. 1 smile), a (press angle, rad), cam, alpha, fill, edge, lit (the
   rear edge's colour), litW, iso (alpha of the lines across), ghost (alpha of the outline at rest), mirror (the right
   trigger: x → -x, not pressed) }. Returns { rear: [stage pts of the rear edge], at(x, z) → stage point on the plate } */
function b02_plate(o) {
  const k = o.k || 0, cam = o.cam, a = o.a || 0, al = o.alpha == null ? 1 : o.alpha, mir = o.mirror ? -1 : 1;
  if (al <= 0.003) return {};
  const hg = b02_hinge3(k), turn = mir < 0 ? null : hg.turn;
  const out2 = b02_trigOutline(k).map(([x, z]) => [x * mir, z]);
  const q = b02_lift(out2, cam, turn, a);
  G.save(); G.globalAlpha = al;
  /* the rest outline, faint and dashed, once it has moved */
  if (o.ghost > 0 && a) { const q0 = b02_lift(out2, cam, null, 0); b02_pathOf(q0); G.setLineDash([7, 6]); G.strokeStyle = inkA(0.35 * o.ghost); G.lineWidth = 1.5; G.stroke(); G.setLineDash([]); }
  /* the surface: flat, one step off the ground, a touch lighter toward the rear (the light is behind the camera's left) */
  b02_pathOf(q);
  const ys = q.map(p => p[1]), g = G.createLinearGradient(0, Math.min(...ys), 0, Math.max(...ys));
  const f0 = o.fill || (TH ? C.track : C.hair), f1 = o.fill2 || (TH ? C.hair : C.track);
  g.addColorStop(0, f0); g.addColorStop(1, f1); G.fillStyle = g; G.fill();
  /* the lines across: constant z every 5 mm, so a tilt or a twist shows as the lines tipping */
  if (o.iso > 0) {
    G.save(); b02_pathOf(q); G.clip();
    G.strokeStyle = inkA((TH ? 0.16 : 0.14) * o.iso); G.lineWidth = 1.2;
    for (let z = 10; z <= 56; z += 5) {
      const sp = b02_spanAt(out2, z); if (!sp) continue;
      const row = []; for (let i = 0; i <= 18; i++) row.push([lerp(sp[0], sp[1], i / 18), z]);
      b02_pathOf(b02_lift(row, cam, turn, a), false); G.stroke();
    }
    G.restore();
  }
  b02_pathOf(q); G.strokeStyle = o.edge || inkA(TH ? 0.55 : 0.5); G.lineWidth = o.edgeW || 1.8; G.lineJoin = 'round'; G.stroke();
  /* the rear edge: the cutout, drawn in its own colour */
  const rear = b02_trigRear(k).map(([x, z]) => [x * mir, z]), qr = b02_lift(rear, cam, turn, a);
  if (o.lit) { b02_pathOf(qr, false); G.strokeStyle = o.lit; G.lineWidth = o.litW || 4; G.lineCap = 'round'; G.stroke(); }
  G.restore();
  return { rear: qr, at: (x, z, dy = 0) => cam.P(turn ? turn([x, b02_h(x, z) + dy, z], a) : [x, b02_h(x, z) + dy, z]), hinge: hg };
}
/** the shell behind the rear cutout, both halves, as one fixed plate from the cutout (0.35 mm back: the gap) to z -18 */
function b02_rearShell(o) {
  const k = o.k || 0, cam = o.cam, al = o.alpha == null ? 1 : o.alpha; if (al <= 0.003) return;
  const gap = 0.45, hw = z => keyHalfW(-z) - 0.2, edge = [];
  for (let i = 0; i <= 40; i++) { const x = lerp(-hw(b02_rearZ(-29, k)), hw(b02_rearZ(29, k)), i / 40); edge.push([x, b02_rearZ(x, k) - gap]); }
  const side = s => { const pts = []; for (let i = 0; i <= 12; i++) { const z = lerp(b02_rearZ(29, k) - gap, -18, i / 12); pts.push([s * hw(z), z]); } return pts; };
  const poly2 = edge.concat(side(1), side(-1).reverse());
  const q = b02_lift(poly2, cam, null, 0);
  G.save(); G.globalAlpha = al;
  b02_pathOf(q); const ys = q.map(p => p[1]), g = G.createLinearGradient(0, Math.min(...ys), 0, Math.max(...ys));
  g.addColorStop(0, rgba(TH ? C.hair : C.track, 0)); g.addColorStop(0.55, TH ? C.hair : C.track); g.addColorStop(1, TH ? C.track : C.hair);
  G.fillStyle = g; G.fill();
  b02_pathOf(b02_lift(edge, cam, null, 0), false); G.strokeStyle = o.edge || inkA(TH ? 0.5 : 0.45); G.lineWidth = 1.8; G.stroke();
  G.restore();
}

/* ============================== the left trigger from above (plan), for the cutouts slide ==============================
   Drawn in key-plan mm (x right, y = -z, the nose up), so it lies exactly over the kit's top view of the mouse.
   o = { k (0 straight .. 1 the Sora's smile), press (0..1 of the click), field (0..1: the travel shading and its contours),
         xray (0..1: the tensioner, the switch and the post seen through the shell), axis (0..1: the bend line drawn across the
         trigger, with its lean), lit (the rear cutout's colour), axisCol, alpha }
   Returns stage points: { cut (the cutout at the switch line), sw (the switch), post, bend: [a, b], at(x, z), axisEnd } */
const b02_K = () => (typeof MS_K !== 'undefined' ? MS_K : { x: 1, y: 1 });
const b02_P = (x, z) => { const k = b02_K(); return [x * k.x, -z * k.y]; };
function b02_trigTopMM(o = {}) {
  const k = o.k || 0, press = clamp(o.press || 0), H = b02_hinge(k), out = {};
  const outline = b02_trigOutline(k).map(([x, z]) => b02_P(x, z));
  const path = () => b02_pathOf(outline);
  /* the travel at the click, mm, at a plan point: the hinge's turn times the lever. The switch's plunger travels its 0.35 mm
     along its 20° axis, so the post's foot moves 0.35 / cos 20° there; everything else scales with its lever */
  const dS = b02_arm(H, -B02.sw.x, B02.sw.z), per = 0.35 / Math.cos(B02.arc) / dS;
  /* the trigger: a flat panel, the travel shading over it, its contours, the outline */
  path(); G.fillStyle = o.fill || b02_partF(); G.fill();
  if (o.field > 0 && press > 0) {
    G.save(); path(); G.clip();
    /* the shading runs perpendicular to the bend line: unmoved at the line, deepest at the far front */
    const nx = -H.u[1], nz = H.u[0], sg = (0 - H.c[0]) * nx + (60 - H.c[1]) * nz > 0 ? 1 : -1, N = [nx * sg, nz * sg];
    const p0 = b02_P(H.c[0], H.c[1]), dMax = 62, p1 = b02_P(H.c[0] + N[0] * dMax, H.c[1] + N[1] * dMax);
    const g = G.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
    const col = o.fieldCol || (TH ? '17,17,17' : '243,243,245'), A = 0.15 * o.field * press;
    g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${A})`);
    G.fillStyle = g; G.fillRect(-60, -80, 120, 120);
    /* contours: the lines of equal travel, every 0.1 mm at the click, parallel to the bend line */
    G.strokeStyle = `rgba(${col},${0.34 * o.field})`; G.lineWidth = lw(1.3);
    for (let mm = 0.1; mm < 0.75; mm += 0.1) {
      const d = mm / per, c0 = [H.c[0] + N[0] * d, H.c[1] + N[1] * d], u = H.u;
      const a = b02_P(c0[0] - u[0] * 80, c0[1] - u[1] * 80), b = b02_P(c0[0] + u[0] * 80, c0[1] + u[1] * 80);
      G.beginPath(); G.moveTo(a[0], a[1]); G.lineTo(b[0], b[1]); G.setLineDash([lw(2), lw(5)]); G.stroke(); G.setLineDash([]);
    }
    G.restore();
  }
  path(); G.strokeStyle = o.edge || inkA(TH ? 0.6 : 0.55); G.lineWidth = lw(1.8); G.lineJoin = 'round'; G.stroke();
  /* the rear cutout: the edge the tensioner bends along */
  const rear = b02_trigRear(k).map(([x, z]) => b02_P(x, z));
  if (o.lit) { b02_pathOf(rear, false); G.strokeStyle = o.lit; G.lineWidth = lw(o.litW || 4); G.lineCap = 'round'; G.stroke(); }
  /* seen through the shell: the tensioner (10 mm wide, centred on the switch line, #18), its bend line, the switch, the post */
  if (o.xray > 0) {
    xsave(); ga(o.xray);
    const t0 = [H.a[0], H.a[1]], t1 = [H.b[0], H.b[1]], back = 3.2, fwd = 2.4, nrm = [-H.u[1], H.u[0]];
    const sgn = nrm[1] > 0 ? 1 : -1, nf = [nrm[0] * sgn, nrm[1] * sgn];
    const band = [[t0[0] - nf[0] * back, t0[1] - nf[1] * back], [t1[0] - nf[0] * back, t1[1] - nf[1] * back], [t1[0] + nf[0] * fwd, t1[1] + nf[1] * fwd], [t0[0] + nf[0] * fwd, t0[1] + nf[1] * fwd]].map(p => b02_P(p[0], p[1]));
    b02_pathOf(band); G.fillStyle = rgba(o.axisCol || C.ink, 0.10); G.fill(); G.setLineDash([lw(5), lw(4)]); G.strokeStyle = o.axisCol || inkA(0.6); G.lineWidth = lw(1.6); G.stroke(); G.setLineDash([]);
    /* the bend line itself, along the cutout over the tensioner */
    const ba = b02_P(t0[0], t0[1]), bb = b02_P(t1[0], t1[1]);
    G.beginPath(); G.moveTo(ba[0], ba[1]); G.lineTo(bb[0], bb[1]); G.strokeStyle = o.axisCol || C.ink; G.lineWidth = lw(3.2); G.lineCap = 'round'; G.stroke();
    out.bend = [SP(ba[0], ba[1]), SP(bb[0], bb[1])];
    /* the GT01 under the trigger: its footprint, 5.8 × 12.8 mm, its long axis fore-aft; the post over its plunger */
    const sx = -B02.sw.x, sz = B02.sw.z, f0 = b02_P(sx - 2.9, sz + 6.4);
    G.setLineDash([lw(4), lw(3)]); pathRR(f0[0], f0[1], 5.8, 12.8, 0.6); G.strokeStyle = inkA(0.5); G.lineWidth = lw(1.3); G.stroke(); G.setLineDash([]);
    const pp = b02_P(sx, sz); G.beginPath(); G.arc(pp[0], pp[1], 1.05, 0, TAU); G.fillStyle = inkA(0.75); G.fill();
    out.sw = SP(pp[0] + 2.9, pp[1]); out.post = SP(pp[0], pp[1]);
    xrest();
  }
  /* the bend line carried across the trigger: the axis the whole trigger turns about, and its lean against square */
  if (o.axis > 0) {
    xsave(); ga(o.axis);
    const c = H.c, u = H.u, e0 = b02_P(c[0] - u[0] * 14, c[1] - u[1] * 14), e1 = b02_P(c[0] + u[0] * 16, c[1] + u[1] * 16);
    G.beginPath(); G.moveTo(e0[0], e0[1]); G.lineTo(e1[0], e1[1]); G.setLineDash([lw(9), lw(6)]); G.strokeStyle = o.axisCol || C.ink; G.lineWidth = lw(2.2); G.stroke(); G.setLineDash([]);
    out.axisEnd = SP(e1[0], e1[1]); out.axisC = SP(...b02_P(c[0], c[1]));
    xrest();
  }
  out.cut = SP(...b02_P(-B02.sw.x, b02_rearZ(-B02.sw.x, k)));
  const M = XF.m.slice(); out.at = (x, z) => SPm(M, ...b02_P(x, z)); out.H = H; out.per = per;
  return out;
}

/* ============================== the front of the trigger, head-on (b02_front) ==============================
   Seen from the nose, in the kit's front frame (mouseSimple 'front': mm, x toward the user's left, y up from the pad, drawn
   y down), so the left trigger is on the viewer's right and u = x. Its front lip lands on a ledge in the shell's nose (#46:
   "the trigger cutouts which the triggers rest on and that are only visible when looking at the front/chin of the mouse
   head-on"). The outline is the kit's (MS_FRONT_TRIG: flat underneath to 17.06 mm, then curving up the side). Heavy comfort
   grooves that run to the front edge dip the lip and its ledge together; two molded curves never match (Protolabs: tools
   ±0.076 mm), here the lip's dip is 0.1 mm deeper than the ledge's, so the lip touches at one spot and can roll on it, like a
   rocker. Run the grooves out before the front (#47) and the lip and the ledge are flat and parallel to the ground: the
   whole lip lands at once. The groove, the gap and the mismatch are drawn ex times; the roll follows from them. */
const B02_FR = { uc: 12, hw: 10, d: 0.9, mis: 0.1, gap: 0.7, face: 3.2, ex: 4, flat: 17.06 };
/** the groove's valley across the lip, 0..1: a cos² centred on the button (uc), hw either side; and its slope per mm */
const b02_c = u => { const F = B02_FR, x = (Math.abs(u) - F.uc) / F.hw; return Math.abs(x) >= 1 ? 0 : Math.pow(Math.cos(x * Math.PI / 2), 2); };
const b02_cd = u => { const F = B02_FR, x = (Math.abs(u) - F.uc) / F.hw; return Math.abs(x) >= 1 ? 0 : -Math.PI / (2 * F.hw) * Math.sin(x * Math.PI) * Math.sign(u || 1); };
/** the trigger's underside and its top seen from the front (the kit's outline, x ≥ 0), as functions of u */
const B02_FO = (() => {
  const P = MS_FRONT_TRIG, bot = P.filter(([x, y]) => x > 16.5 && y < 24.5).sort((a, b) => a[0] - b[0]);
  const top = P.filter(([x, y]) => x >= -0.01 && y >= 24.46).sort((a, b) => b[0] - a[0]);
  const at = (pts, u) => { if (u <= pts[0][0]) return pts[0][1]; for (let i = 1; i < pts.length; i++) if (u <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return y0 + (y1 - y0) * (u - x0) / (x1 - x0); } return pts[pts.length - 1][1]; };
  return { bot, top: top.concat([[0, 37.375]]), base: u => (Math.abs(u) <= 17.06 ? 10.84 : at(bot, Math.abs(u))), uMax: bot[bot.length - 1][0] };
})();
/** the lip (at rest) and the ledge, in drawn model mm (y up): k 1 grooves to the front .. 0 a flat front */
function b02_frontY(k, ex, misX = 1) {
  const F = Object.assign({}, B02_FR, { mis: B02_FR.mis * misX }), base = B02_FO.base;
  const clr = u => 1.4 * ex / 5 * smooth(clamp((Math.abs(u) - lerp(F.flat, 23, k)) / 4));           /* the shell falls away past the ledge */
  return {
    lip: u => base(u) + (-F.d * b02_c(u) + F.mis) * k * ex,
    ledge: u => base(u) - F.gap * ex - (F.d - F.mis) * k * ex * b02_c(u) - clr(u),
    dlip: u => -F.d * k * ex * b02_cd(u), dledge: u => -(F.d - F.mis) * k * ex * b02_cd(u)
  };
}
/** the pose of the pressed lip: dropped by drop (0..1) of its gap and, once landed, rolled onto the ledge at contact cu
   (the lip turns about its own point at cu until it is tangent to the ledge there, then sits on it). Returns { th (radians,
   counter-clockwise in the model), map(u, y) → [u, y] (model, y up) } */
function b02_frontPose(k, ex, drop, cu, misX = 1) {
  const Y = b02_frontY(k, ex, misX), c0 = [cu, Y.lip(cu)];
  const th = k > 0.001 ? Math.atan(Y.dledge(cu)) - Math.atan(Y.dlip(cu)) : 0, D = (Y.lip(cu) - Y.ledge(cu)) * clamp(drop);
  const cs = Math.cos(th), sn = Math.sin(th);
  return { th, map: (u, y) => { const dx = u - c0[0], dy = y - c0[1]; return [c0[0] + dx * cs - dy * sn, c0[1] + dx * sn + dy * cs - D]; } };
}
/** where the lip rolls to under a press at u: under the press, within the reach of the roll (the valley's two inflections) */
const b02_frontReach = u => clamp(u, B02_FR.uc - B02_FR.hw / 2, B02_FR.uc + B02_FR.hw / 2);
/** the front of the mouse's triggers, head-on, drawn over mouseSimple('front') in its frame (inside establish's draw).
   o = { k, drop (0..1), cu (the contact the lip has rolled to; uc before it rolls), hit (0..1), hitCol, wear: [[u, a], ...]
   (marks left where the lip has landed), lit (0..1: the pressed trigger outlined in ink), ex (heights drawn ×, B02_FR.ex) }. Returns stage points: top(u) (the front
   edge's top, where a finger presses), contact, corner, and th (radians, drawn) */
function b02_frontMM(o = {}) {
  const F = B02_FR, k = o.k == null ? 1 : o.k, ex = o.ex == null ? F.ex : o.ex, mx = o.misX || 1, Y = b02_frontY(k, ex, mx), drop = clamp(o.drop || 0), cu = o.cu == null ? F.uc : o.cu;
  const pose = b02_frontPose(k, ex, drop, cu, mx), M = XF.m.slice(), SPc = (x, y) => SPm(M, x, -y), out = { th: pose.th };
  const body = b02_bodyF(), trig = b02_partF(), edge = inkA(TH ? 0.55 : 0.5), U = B02_FO.uMax, n = 0.25;
  const poly = (pts, fill, stroke, w) => { G.beginPath(); pts.forEach(([u, y], i) => i ? G.lineTo(u, -y) : G.moveTo(u, -y)); G.closePath(); if (fill) { G.fillStyle = fill; G.fill(); } if (stroke) { G.strokeStyle = stroke; G.lineWidth = lw(w || 1.6); G.lineJoin = 'round'; G.stroke(); } };
  const run = (pts, col, w, cap) => { G.beginPath(); pts.forEach(([u, y], i) => i ? G.lineTo(u, -y) : G.moveTo(u, -y)); G.strokeStyle = col; G.lineWidth = lw(w); G.lineCap = cap || 'round'; G.lineJoin = 'round'; G.stroke(); };
  G.save(); G.clip(msView('front').out);
  /* cover the kit's triggers, its split and its wheel down past the ledge: this drawing replaces them */
  { const ring = []; for (let u = -U; u <= U + 1e-9; u += n) ring.push([u, Y.ledge(u) - 2.5]);
    const tp = B02_FO.top.map(([x, y]) => [x, y + 0.6]); for (const p of tp) ring.push(p); for (let i = tp.length - 1; i >= 0; i--) ring.push([-tp[i][0], tp[i][1]]);
    poly(ring, body); }
  /* the slot under the lips: what shows between a lip and its ledge */
  { const sl = []; for (let u = -U; u <= U + 1e-9; u += n) sl.push([u, Y.ledge(u)]); for (let u = U; u >= -U - 1e-9; u -= n) sl.push([u, Y.lip(u) + 1.2]); poly(sl, inkA(lerp(0.12, TH ? 0.42 : 0.5, clamp((ex - 1) / Math.max(1e-6, F.ex - 1))))); }
  /* the ledge: the shell's edge the lips land on */
  { const lg = []; for (let u = -U; u <= U + 1e-9; u += n) lg.push([u, Y.ledge(u)]); run(lg, edge, 1.6); }
  /* wear: where the lip has landed before */
  for (const [wu, wa] of (o.wear || [])) if (wa > 0.01) { G.save(); G.globalAlpha *= wa; const y0 = Y.ledge(wu); run([[wu - 1.1, y0], [wu + 1.1, y0]], C.red, 4.2, 'butt'); G.restore(); }
  /* a trigger: its underside (the lip), up the side and over the top, mapped by its pose */
  const shape = (side, map) => {
    const pts = [];
    for (let u = 0.3; u <= U + 1e-9; u += n) pts.push(map(u, Y.lip(u)));
    for (const [x, y] of B02_FO.top) if (x >= 0.3) pts.push(map(x, y)); pts.push(map(0.3, 37.375));
    return pts.map(([u, y]) => [u * side, y]);
  };
  const frontTop = (side, map) => { const pts = []; for (let u = 0.3; u <= F.flat + 6 + 1e-9; u += n) { const y0 = Y.lip(u) + F.face; if (y0 > B02_FO.base(u) + F.face + 0.01 && u > F.flat) break; pts.push(map(u, Y.lip(u) + F.face)); } return pts.map(([u, y]) => [u * side, y]); };
  const still = (u, y) => [u, y];
  /* the user's right trigger (viewer's left), still; then the pressed one */
  poly(shape(-1, still), trig, edge, 1.6);
  poly(shape(1, pose.map), TH ? C.hair : C.comp2, edge, 1.8);
  if (o.lit > 0.003) { G.save(); G.globalAlpha *= o.lit; poly(shape(1, pose.map), rgba(C.ink, TH ? 0.06 : 0.1), C.ink, 2.4); G.restore(); }
  /* the centre split, and the wheel in it, over both */
  { const V = msView('front'), w = V.parts.wheel && V.parts.wheel.solid; line(0, -Y.ledge(0), 0, -37.4, { color: edge, w: lw(1.3) });
    if (w) { G.fillStyle = TH ? C.track : C.hair; G.fill(w); G.strokeStyle = inkA(TH ? 0.5 : 0.45); G.lineWidth = lw(1.2); G.stroke(w); } }
  G.restore();
  /* a level line through the landing, dashed, to read the tilt against */
  if (o.level > 0.003) { const yy = Y.ledge(cu) + (Y.lip(F.flat + 6) - Y.ledge(F.flat + 6)) * 0 + 0; G.save(); G.globalAlpha *= o.level; G.setLineDash([lw(7), lw(5)]); G.beginPath(); G.moveTo(cu - 14, -(Y.lip(cu) - (Y.lip(cu) - Y.ledge(cu)) * drop + 4.2)); G.lineTo(cu + 22, -(Y.lip(cu) - (Y.lip(cu) - Y.ledge(cu)) * drop + 4.2)); G.strokeStyle = inkA(0.55); G.lineWidth = lw(1.6); G.stroke(); G.setLineDash([]); G.restore(); }
  /* where it lands: one red spot on the grooved front; the whole flat on Theseus */
  if (o.hit > 0.003) {
    xsave(); ga(o.hit);
    if (k > 0.5) { const yy = Y.ledge(cu); G.beginPath(); G.arc(cu, -yy, 0.55, 0, TAU); G.fillStyle = o.hitCol || C.red; G.fill(); G.beginPath(); G.arc(cu, -yy, 1.15, 0, TAU); G.strokeStyle = o.hitCol || C.red; G.lineWidth = lw(2); G.stroke(); }
    else { const pts = []; for (let u = 0.6; u <= F.flat - 0.4 + 1e-9; u += n) pts.push([u, Y.ledge(u)]); run(pts, o.hitCol || C.hero, 4.4); }
    xrest();
  }
  out.top = u => { const [x, y] = pose.map(u, Y.lip(u) + F.face); return SPc(x, y); };
  out.lipAt = u => { const [x, y] = pose.map(u, Y.lip(u)); return SPc(x, y); };
  out.ledgeAt = u => SPc(u, Y.ledge(u));
  out.corner = (() => { const [x, y] = pose.map(29.12, 24.46); return SPc(x, y); })();
  out.P = (x, y) => SPc(x, y);
  return out;
}

/* ============================== a fingertip seen end-on (the kit draws it from the side and from above) ==============================
   For the front views (flush walls, grooves, seams): the fingertip's cross-section near the pad, mono grey (F9.24), 16 mm
   across (the kit's FINGER.top), its nail on top. Its pad lies on the surface it presses: where the pad's resting curve,
   pushed down by sink, would pass below the surface, it flattens onto it (skin conforms), so the contact patch and any skin
   that drapes into a step come out of the geometry. In mm, y up in the model; drawn with y down. o = { cx (the finger's
   centre u), base (the pad's lowest point at rest, y), sink (mm the pad is pushed into the surface), surf(u) → y (the surface
   under it; default flat at base), tilt (radians: the finger leaning), w (16), h (13), alpha, mark: [u0, u1, colour] (a stretch
   of the pad to colour: a pinch) }. Returns { contact: [u0, u1] (where the pad touches), top: [u, y], pad: [u, y] } (model mm) */
function b02_fingerEndMM(o = {}) {
  const w = o.w || 16, hh = o.h || 13, a = w / 2, cx = o.cx || 0, base = o.base || 0, sink = o.sink || 0, surf = o.surf || (() => base - 9);
  const skin = C.comp, edge = inkA(TH ? 0.6 : 0.45), nail = TH ? C.hair : C.faint;
  /* the pad's resting underside: a flattened ellipse 16 mm wide, its lowest point at base; pushed down by sink */
  const rest = u => { const x = (u - cx) / a; return Math.abs(x) >= 1 ? base + hh * 0.42 : base + hh * 0.42 * (1 - Math.sqrt(1 - x * x)) * 1.0; };
  const bot = [], cont = [];
  for (let u = cx - a; u <= cx + a + 1e-9; u += 0.1) { const y0 = rest(u) - sink, ys = surf(u), y = Math.max(y0, ys); bot.push([u, y]); if (y0 <= ys + 1e-3 && Math.abs(u - cx) < a - 0.3) cont.push(u); }
  const topY = base + hh - sink * 0.15;
  G.save(); G.globalAlpha *= (o.alpha == null ? 1 : o.alpha); G.translate(cx, 0); G.rotate(-(o.tilt || 0)); G.translate(-cx, 0);
  G.beginPath(); bot.forEach(([u, y], i) => i ? G.lineTo(u, -y) : G.moveTo(u, -y));
  G.bezierCurveTo(cx + a * 1.04, -(base + hh * 0.55), cx + a * 0.86, -topY, cx, -topY);
  G.bezierCurveTo(cx - a * 0.86, -topY, cx - a * 1.04, -(base + hh * 0.55), bot[0][0], -bot[0][1]); G.closePath();
  G.fillStyle = skin; G.fill(); G.strokeStyle = edge; G.lineWidth = lw(1.4); G.lineJoin = 'round'; G.stroke();
  /* the nail on top, end-on: a shallow arch */
  G.beginPath(); G.moveTo(cx - a * 0.62, -(topY - 1.7)); G.quadraticCurveTo(cx, -(topY + 1.0), cx + a * 0.62, -(topY - 1.7)); G.quadraticCurveTo(cx, -(topY - 0.4), cx - a * 0.62, -(topY - 1.7)); G.closePath();
  G.fillStyle = nail; G.fill(); G.strokeStyle = edge; G.lineWidth = lw(1.1); G.stroke();
  if (o.mark) { const [u0, u1, col] = o.mark; G.beginPath(); bot.filter(([u]) => u >= u0 && u <= u1).forEach(([u, y], i) => i ? G.lineTo(u, -y) : G.moveTo(u, -y)); G.strokeStyle = col || C.red; G.lineWidth = lw(4); G.lineCap = 'round'; G.stroke(); }
  G.restore();
  return { contact: cont.length ? [Math.min(...cont), Math.max(...cont)] : null, top: [cx, topY], pad: [cx, Math.max(rest(cx) - sink, surf(cx))] };
}

/** a finger seen from the front (the nose): the kit's end-on fingertip, and behind it the finger's back rising toward the
   knuckle (in a claw or relaxed grip it climbs steeply, so from the front it stands above the tip as a column that fades).
   (x, y) the pad's contact, stage px; s px per mm; ang tilts it with the button; press flattens the pad */
function b02_fingerFront(x, y, ang, o = {}) {
  const a = o.alpha == null ? 1 : o.alpha; if (a <= 0.003) return;
  const s = o.s || 3.2, skin = TH ? '#C3C3C3' : '#5E5E5E', edge = TH ? 'rgba(40,40,40,0.6)' : 'rgba(230,230,230,0.45)';   /* the kit's finger greys, neutral */
  G.save(); G.globalAlpha = a; G.translate(x, y); G.rotate(ang); G.scale(s, s);
  const y0 = -7, y1 = -(o.rise || 30), g = G.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, rgba(skin, 1)); g.addColorStop(0.55, rgba(skin, 0.85)); g.addColorStop(1, rgba(skin, 0));
  const ge = G.createLinearGradient(0, y0, 0, y1); ge.addColorStop(0, edge); ge.addColorStop(1, 'rgba(128,128,128,0)');
  G.beginPath(); G.moveTo(-7.6, y0); G.bezierCurveTo(-7.5, y0 - 8, -7.1, y1 + 6, -6.9, y1); G.lineTo(6.9, y1); G.bezierCurveTo(7.1, y1 + 6, 7.5, y0 - 8, 7.6, y0); G.closePath();
  G.fillStyle = g; G.fill();
  G.beginPath(); G.moveTo(-7.6, y0); G.bezierCurveTo(-7.5, y0 - 8, -7.1, y1 + 6, -6.9, y1); G.moveTo(7.6, y0); G.bezierCurveTo(7.5, y0 - 8, 7.1, y1 + 6, 6.9, y1);
  G.strokeStyle = ge; G.lineWidth = 1.3 / s; G.stroke();
  G.restore();
  finger(x, y, ang, { s, press: o.press || 0, view: 'end', alpha: a });
}

/* ============================== flush walls (#48) and which way the cutout faces ==============================
   A cut across the user's right half of the mouse at the fingertips, seen from the front (so it sits on the viewer's left
   in the kit's front frame: x = -u). u is the distance out from the centre, y up from the pad, mm. The shell's outside is
   a rounded section (a superellipse, 57 mm across and 21 mm tall here), 1.3 mm thick. Where the button ends, the cut can
   face the wall (it runs down the side: the gap opens sideways, across the way the button moves, so a click closes it)
   or the ceiling (it runs on top: the gap opens upward and a click slides the button down past the shell's wall). With
   the cut on top, the wall's edge is set level with the button at rest (the default way, #48) or with the button
   pressed (Theseus, #48). Travel, gaps and the wall's offset are drawn ex times. */
const B02_FL = { a: 28.5, b: 19.0, y0: 2, skin: 1.3, uE: 19.0, gap: 0.35, slot: 0.6, ySeam: 9.0, tr: 0.46, ex: 4 };
/** a point on the section's outside (k = 0) or inside (k = 1) at parameter t (0: the side at the pad, π/2: the top) */
function b02_flP(t, inner) { const F = B02_FL, d = inner ? F.skin : 0, c = Math.max(0, Math.cos(t)), sn = Math.max(0, Math.sin(t)); return [(F.a - d) * Math.pow(c, 2 / 3), F.y0 + (F.b - d) * Math.pow(sn, 2 / 3)]; }
/** the section's outside (or inside) between u0 and u1 on top, or down the side to y = yEnd; as points (u, y) */
function b02_flRun(inner, u0, uEnd, yEnd) {
  const pts = []; for (let i = 0; i <= 400; i++) { const t = Math.PI / 2 * (1 - i / 400), p = b02_flP(t, inner); if (p[0] < u0) continue; if (uEnd != null && p[0] > uEnd) break; if (yEnd != null && p[1] < yEnd) break; pts.push(p); }
  return pts;
}
/** the outside's height at u on top, and where the outside crosses height y on the side */
const b02_flYat = (u, inner) => { const F = B02_FL, d = inner ? F.skin : 0, x = clamp(u / (F.a - d)); return F.y0 + (F.b - d) * Math.pow(Math.max(0, 1 - x * x * x), 1 / 3); };
const b02_flUat = (y, inner) => { const F = B02_FL, d = inner ? F.skin : 0, q = clamp((y - F.y0) / (F.b - d)); return (F.a - d) * Math.pow(Math.max(0, 1 - q * q * q), 1 / 3); };
/** the section, drawn in the kit's front frame. o = { face 'wall' | 'ceiling', wall (0: level with the button at rest ..
   1: level with it pressed), press (0..1 of the travel at the click), ex, lit (the button's outline colour), shellA (the
   shell's alpha, for the wall-to-ceiling cross-fade) }. Returns { top(u) the surface under a finger (y, model), seam
   (the slot's mouth on the side, [u, y]), gap (the slot's width now, mm true), step (mm true, the wall above the pressed
   button), edge [u, y] (the button's outer top corner), wallTop [u, y] } */
function b02_flushMM(o = {}) {
  const F = B02_FL, ex = o.ex == null ? F.ex : o.ex, d = clamp(o.press || 0) * F.tr, dy = -d * ex, face = o.face || 'ceiling', out = {};
  const trig = mix(C.ink, C.bg, TH ? 0.62 : 0.55), shell = TH ? C.panel : C.comp2, hollow = TH ? C.track : C.hair, edge = inkA(TH ? 0.62 : 0.55);
  const poly = (pts, fill, stroke, w, a) => { G.save(); if (a != null) G.globalAlpha *= a; G.beginPath(); pts.forEach(([u, y], i) => i ? G.lineTo(-u, -y) : G.moveTo(-u, -y)); G.closePath(); if (fill) { G.fillStyle = fill; G.fill(); } if (stroke) { G.strokeStyle = stroke; G.lineWidth = lw(w || 1.6); G.lineJoin = 'round'; G.stroke(); } G.restore(); };
  const down = (pts, by) => pts.map(([u, y]) => [u, y + by]);
  /* the hollow inside the shell, under everything */
  { const inn = b02_flRun(true, 0); poly([...inn, [0, F.y0]], hollow); }
  if (face === 'wall') {
    /* the button runs over the shoulder and down the side to its edge at ySeam; the side shell starts slot·ex below it */
    const yS = F.ySeam, yT = yS - F.slot * ex;
    const tOut = b02_flRun(false, 0.3, null, yS), tIn = b02_flRun(true, 0.3, null, yS);
    const sOut = b02_flRun(false, b02_flUat(yT), null, F.y0 + 0.2), sIn = b02_flRun(true, b02_flUat(yT, true), null, F.y0 + 0.2);
    poly([...sOut, ...sIn.slice().reverse()], shell, edge, 1.6, o.shellA);
    poly(down([...tOut, [b02_flUat(yS, true), yS], ...tIn.slice().reverse()], dy), trig, o.lit || edge, o.lit ? 2.4 : 1.8);
    out.seam = [b02_flUat(yS) + 0.2, yS + dy]; out.seamLow = [b02_flUat(yT) + 0.2, yT]; out.gap = Math.max(0, F.slot - d);
    out.top = u => b02_flYat(u) + dy; out.edge = [b02_flUat(yS), yS + dy];
  } else {
    /* the button ends on top at uE; the shell's wall begins gap·ex further out, its edge level with the button at rest
       (wall 0) or pressed (wall 1); the offset fades out over the shoulder */
    const uE = F.uE, uW = uE + F.gap * ex, wo = -clamp(o.wall || 0) * F.tr * ex, wf = u => wo * (1 - smooth(clamp((u - uW) / 5.5)));
    const tOut = b02_flRun(false, 0.3, uE), tIn = b02_flRun(true, 0.3, uE);
    const sOut = b02_flRun(false, uW, null, F.y0 + 0.2).map(([u, y]) => [u, y + wf(u)]), sIn = b02_flRun(true, uW, null, F.y0 + 0.2).map(([u, y]) => [u, y + wf(u)]);
    const wTop = b02_flYat(uW) + wo, wIn = b02_flYat(uW, true) + wo;
    poly([[uW, wTop], ...sOut, ...sIn.slice().reverse(), [uW, wIn]], shell, edge, 1.6, o.shellA);
    poly(down([...tOut, [uE, b02_flYat(uE, true)], ...tIn.slice().reverse()], dy), trig, o.lit || edge, o.lit ? 2.4 : 1.8);
    out.top = u => (u <= uE ? b02_flYat(u) + dy : u < uW ? Math.min(b02_flYat(uE) + dy, wTop) - 3 : b02_flYat(u) + wf(u));
    out.edge = [uE, b02_flYat(uE) + dy]; out.wallTop = [uW, wTop]; out.level = [uW, b02_flYat(uW) + dy]; out.step = (wo - dy) / ex;
  }
  return out;
}

/* ============================== b02_cutouts: the readouts ============================== */
/** the switch from above in a loupe: the GT01's footprint (its long axis fore-aft, the plane its 20° tilt lies in), the
   post's foot and the way it swings when the trigger turns: along that plane (fine: the tilt meets it, Direct Drive) and,
   when the bend line leans, across it (red: no switch tilt can meet that). (x, y) the centre, r the radius, o = { lean
   (radians), k (0..1 how far it has swung), a, col (the along arrow's colour) } */
function b02_swingLoupe(t, x, y, r, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const lean = o.lean || 0, k = o.k == null ? 1 : o.k, s = r / 9.5;
  G.save(); G.globalAlpha = a;
  circle(x, y, r, { fill: C.panel }); circle(x, y, r, { color: inkA(0.5), w: 1.5 });
  G.save(); G.beginPath(); G.arc(x, y, r - 1.5, 0, TAU); G.clip();
  /* the switch's footprint and its plunger cap (turned 90°: 2.1 mm across, 1.5 mm along), seen through the trigger */
  G.setLineDash([6, 5]); rrPath(x - 2.9 * s, y - 6.4 * s, 5.8 * s, 12.8 * s, 0.6 * s); G.strokeStyle = inkA(0.55); G.lineWidth = 1.5; G.stroke(); G.setLineDash([]);
  rrPath(x - 1.05 * s, y - 2.0 * s - 0.75 * s, 2.1 * s, 1.5 * s, 0.4 * s); G.fillStyle = inkA(0.6); G.fill();
  /* the plane the GT01's tilt lies in: fore-aft through the plunger */
  line(x, y - r, x, y + r, { color: inkA(0.25), w: 1.5, dash: [3, 6] });
  /* the foot's swing in plan: back (down on screen), turned by the lean; its across part in red */
  const L = r * 0.66 * k, ang = Math.PI / 2 + lean * (o.side || -1), ex = x + Math.cos(ang) * L, ey = y - 2.0 * s + Math.sin(ang) * L, py = y - 2.0 * s;
  if (k > 0.02) {
    arrow(x, py, x, py + Math.sin(ang) * L, { color: o.col || C.ink, w: 3.5, hs: 13 });
    if (Math.abs(lean) > 0.005) { line(x, py + Math.sin(ang) * L, ex, ey, { color: C.red, w: 4 }); arrow(x, py, ex, ey, { color: C.red, w: 2, hs: 11, alpha: 0.75 }); }
  }
  G.restore();
  G.restore();
  return { tip: [ex, ey], cross: [(x + ex) / 2, ey] };
}

/* ============================== 2. b02_cutouts: Straight rear cutouts (#17, #18) ==============================
   His most important idea in this chapter (F33.5), the old slide his worst rated (3/10: "you can hardly tell which part of
   the mouse you're looking at", "the benefit to the player isn't really sold"). So: the whole mouse first, the cutout lit;
   one push-in to the left trigger; the bend line the spring takes, drawn on the trigger; the same two presses on the Sora's
   smile and on Theseus's straight cutout; what the switch and the finger get. */
const B02_CT = { press: { down: 0.16, hold: 0.55, up: 0.22 }, p1: 1.65, p2: 2.7, mo: [3.7, 0.95], p3: 4.85, p4: 5.9, v: 6.2, zP: B02.sw.z + 10, dx: 9 };
/** the overlay on the kit's top view, in its camera (mm): both triggers with the rear cutout blended k (1 smile .. 0
   straight), the body's outline restroked over them, the lit rear edge, then the left trigger's own drawing */
function b02_cutOverlay(k, o = {}) {
  const V = msView('top'), bodyF = b02_bodyF(), ink = TH ? '17,17,17' : '243,243,245';
  G.save(); G.clip(V.out);
  /* cover the kit's straight rear line where the smile leaves it, then lay both triggers over the body */
  G.fillStyle = bodyF; G.fillRect(-34, -14 * b02_K().y, 68, 12.4);
  for (const m of [1, -1]) { b02_pathOf(b02_trigOutline(k).map(([x, z]) => b02_P(x * m, z))); G.fillStyle = bodyF; G.fill(); }
  G.restore();
  G.save(); G.lineJoin = 'round'; G.lineCap = 'round';
  /* the split between the triggers (the wheel sits in it) and each trigger's inner edges, as the kit draws its key lines */
  for (const m of [1, -1]) { b02_pathOf(b02_trigOutline(k).map(([x, z]) => b02_P(x * m, z))); G.save(); G.clip(V.out); G.strokeStyle = `rgba(${ink},${TH ? 0.42 : 0.4})`; G.lineWidth = lw(1.3); G.stroke(); G.restore(); }
  /* the rear cutout across both triggers, lit */
  for (const m of [1, -1]) { b02_pathOf(b02_trigRear(k).map(([x, z]) => b02_P(x * m, z)), false); G.strokeStyle = o.lit || C.second; G.lineWidth = lw(o.litW || 3.2); G.globalAlpha = o.litA == null ? 1 : o.litA; G.stroke(); G.globalAlpha = 1; }
  G.strokeStyle = `rgba(${ink},${TH ? 0.78 : 0.7})`; G.lineWidth = lw(2); G.stroke(V.out);
  G.restore();
}
/** the classroom version: a sheet with a flap folded along a crease, in a small 3D view. slant (radians): the crease's lean
   off square; f (0..1): how far the flap has folded (to 160°). The flap's far corner traces its path: straight back over a
   square crease, swung off to the side over a slanted one. (cx, cy) the sheet's centre on the stage, s px per mm */
function b02_fold(cx, cy, s, slant, f, o = {}) {
  const cam = b02_cam3([0, 0, 0], -0.12, 1.12, s, cx, cy), W2 = 14, L0 = -20, L1 = 20, cz = 0;
  const ax = [Math.cos(slant), 0, Math.sin(slant)], A = [0, 0, cz];
  const creaseZ = x => cz + Math.tan(slant) * x;
  const base = [[-W2, L0], [W2, L0], [W2, creaseZ(W2)], [-W2, creaseZ(-W2)]].map(([x, z]) => cam.P([x, 0, z]));
  const flap0 = [[-W2, creaseZ(-W2)], [W2, creaseZ(W2)], [W2, L1], [-W2, L1]];
  let K = ax; if (b02_rot([0, 0, cz + 5], A, K, 0.2)[1] < 0) K = K.map(v => -v);
  const ang = 2.8 * clamp(f), flap = flap0.map(([x, z]) => cam.P(b02_rot([x, 0, z], A, K, ang)));
  const paperC = TH ? C.panel : C.hair, backC = TH ? C.hair : C.comp2, ed = inkA(TH ? 0.5 : 0.45);
  const al = G.globalAlpha * (o.alpha == null ? 1 : o.alpha); if (al <= 0.003) return { tip: cam.P([0, 0, L1]), crease: [] };
  G.save(); G.globalAlpha = al; G.lineJoin = 'round';
  b02_pathOf(base); G.fillStyle = paperC; G.fill(); G.strokeStyle = ed; G.lineWidth = 1.5; G.stroke();
  /* the crease */
  const c0 = cam.P([-W2, 0, creaseZ(-W2)]), c1 = cam.P([W2, 0, creaseZ(W2)]);
  line(c0[0], c0[1], c1[0], c1[1], { color: o.col || C.ink, w: 2.5, dash: [6, 4], alpha: al }); G.globalAlpha = al;
  /* where the flap started, faint; where its far corner goes */
  b02_pathOf(flap0.map(([x, z]) => cam.P([x, 0, z]))); G.setLineDash([4, 4]); G.strokeStyle = inkA(0.3); G.lineWidth = 1.2; G.stroke(); G.setLineDash([]);
  const facing = ang > Math.PI / 2;
  b02_pathOf(flap); G.fillStyle = facing ? backC : paperC; G.fill(); G.strokeStyle = ed; G.lineWidth = 1.5; G.stroke();
  const tip = cam.P(b02_rot([0, 0, L1], A, K, ang));
  circle(tip[0], tip[1], 5, { fill: o.col || C.ink, alpha: al });
  G.restore();
  return { tip, crease: [c0, c1] };
}
/** a click force at a press point: the value, and once Theseus's press lands the rival's value struck before it (F16.1) */
function b02_gfTag(x, y, a, val, o = {}) {
  if (a <= 0.003) return;
  const al = o.align || 'left', runs = [];
  if (o.before != null) runs.push({ s: o.before, role: 'num', size: 26, weight: 700, color: C.faint, tnum: true }, { s: '→', font: 'disp', size: 24, weight: 700, color: C.faint, gap: 10 });
  runs.push({ s: val, role: 'num', size: o.size || 34, weight: 800, color: o.col || C.ink, tnum: true, gap: o.before != null ? 10 : 0 }, { s: 'gf', role: 'label', size: 20, color: C.mute, gap: 6 });
  const r = rich(runs, x, y, { alpha: a, align: al });
  if (o.before != null) { const w0 = tw(o.before, { role: 'num', size: 26, weight: 700, tnum: true }), x0 = r.x0; line(x0 - 2, y - 9, x0 + w0 + 2, y - 9, { color: C.mute, w: 2.2, alpha: a }); }
  return r;
}
S({
  id: 'b02_cutouts', ch: 'click', theme: 'paper', title: 'Straight rear cutouts', settle: 10.5, ideas: [17, 18],
  replaces: ['cutouts'],
  src: ['b02_scan', 'clk_gt01', 'clk_brock', 'b02_tpuV3', 'b02_nickel'],
  answers: [
    ['everything here is among the most important concepts', 'It leads the chapter right after the card, with the most care: the whole mouse, one push-in, the same two presses on the smile and on the straight cutout, and the numbers that come out of the hinge'],
    ['but probably has the worst graphic design in the entire deck', 'Rebuilt from nothing: the abstract grey blocks are gone; the trigger is the trigger, traced from the 3D model, and it is pressed by a finger'],
    ['it\'s super unintuitive to understand because you can hardly tell which part of the mouse you\'re looking at it\'s so abstract', 'It opens on the whole simplified mouse from above with the rear cutout lit, pushes in to the left trigger in one move and keeps a locator in the corner; the spring, the switch and the bend line are drawn through the shell where they really sit'],
    ['also the benefit to the player isn\'t really sold', 'Sold as what the finger feels and shown at two presses: the click weighs the same wherever your finger lands across the button (47.0 or 52.3 gf on the smile, 48.8 gf either way straight; the headline is the outer side\'s extra 5.3 gf, a US nickel, going to 0), and none of the travel at the switch goes sideways (8.0 % → 0.0 %, in the loupe). The old slide\'s "33.4 % sideways" (sin of the lean: the share of the motion that is a roll) is not carried forward'],
    ['(F33.5) important ideas executed wrong get vastly improved, with more importance', 'It is this chapter\'s lead slide and its checkpoint'],
    ['(#18) the tensioner aligned with the switch', 'Each spring is drawn centred on its switch\'s line, and the caption says so; the Sora\'s own spring position is not public, so no before number is claimed for it']
  ],
  sfx: [[pressCross(B02_CT.p1, B02_CT.press, 0.7), 'click'], [pressCross(B02_CT.p2, B02_CT.press, 0.7), 'click'], [pressCross(B02_CT.p3, B02_CT.press, 0.7), 'click'], [pressCross(B02_CT.p4, B02_CT.press, 0.7), 'click']],
  draw: t => {
    const Q = B02_CT, H1 = b02_hinge(1);
    header(t, 'Straight rear cutouts');
    captions(t, [[0.5, 'The spring under each trigger bends along the rear cutout. Most mice curve that cutout into a smile, as on the Sora V2.'],
      [Q.p1 - 0.1, 'So the trigger turns about a line 13.2° off square: the outer side clicks heavier than the inner, and some of the travel at the switch goes sideways.'],
      [Q.mo[0], 'Cut it straight, with each spring centred on its own switch, and the trigger turns square to the press. Razer did the same from the Viper V2 Pro to the V3 Pro.'],
      [Q.v + 0.4, 'The click weighs the same wherever your finger lands, and nothing at the switch goes sideways.']]);
    const km = 1 - ep(t, Q.mo[0], Q.mo[0] + Q.mo[1], E.io3), lean = H1.lean * km, rival = km > 0.02;
    const prs = [Q.p1, Q.p2, Q.p3, Q.p4].map(p => pressCurve(t, p, Q.press)), dNow = Math.max(...prs);
    const pts = [[-B02.sw.x + Q.dx, Q.zP], [-B02.sw.x - Q.dx, Q.zP]];
    const xr = ep(t, 1.05, 1.45), ax = ep(t, 0.3, 0.7), litC = rival ? C.second : C.hero, axC = rival ? C.red : C.hero;
    const box = [80, 270, 860, 650];
    let A = null;
    const est = establish(t, 0, box, { view: 'top', focus: [-34, -60.5, 44, 66], hold: 0.4, dur: 1.0, locator: 'tl', locW: 64,
      draw: () => {
        b02_cutOverlay(km, { lit: litC });
        G.save(); G.clip(msView('top').out);
        A = b02_trigTopMM({ k: km, press: dNow, field: 1, xray: xr, axis: ax, lit: litC, axisCol: axC, fill: rgba(litC, TH ? 0.07 : 0.1), edge: inkA(0.001) });
        G.restore();
      } });
    /* the lean, measured against square at the spring: a dashed square reference, an arc to the bend line, the angle */
    if (A && A.bend && xr > 0) {
      const [b0, b1] = A.bend, c = [(b0[0] + b1[0]) / 2, (b0[1] + b1[1]) / 2], R = 64;
      let aOut = Math.atan2(b1[1] - c[1], b1[0] - c[0]); if (aOut < 0) aOut += TAU;
      line(c[0] - R * 1.3, c[1], c[0] - 8, c[1], { color: C.faint, w: 1.5, dash: [4, 5], alpha: xr });
      if (aOut - Math.PI > 0.004) { G.save(); G.globalAlpha = xr; G.beginPath(); G.arc(c[0], c[1], R, Math.PI, aOut, false); G.strokeStyle = C.red; G.lineWidth = 2.5; G.stroke(); G.restore(); }
      const deg = Math.abs(lean) * 180 / Math.PI;
      const lxx = Math.min(c[0] - R * 1.45, est.P(-msHalfW(-6.5), -6.5)[0] - 18);
      const sq = km < 0.02, mor = !sq && km < 0.98;
      text(deg.toFixed(1) + '°', lxx, c[1] + 8, { role: 'num', size: 34, weight: 800, color: sq ? C.heroText : mor ? C.ink : C.red, align: 'right', alpha: xr });
      text(sq ? 'Bend line, square' : 'Bend line, off square', lxx, c[1] + 38, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: xr, maxW: 300 });
    }
    /* whose cutout this is, on the drawing, while it fails (M3); then Theseus's */
    { const pS = est.P(...b02_P(-23, b02_rearZ(-23, km)));
      callout(t, 0.6, pS, 'Sora V2\'s smile cutout', { to: [pS[0] - 70, pS[1] - 96], side: 'l', color: C.second, tcolor: C.secondText, alpha: 1 - ep(t, Q.mo[0] - 0.1, Q.mo[0] + 0.2) });
      if (t > Q.mo[0] + Q.mo[1]) fixTag(t, Q.mo[0] + Q.mo[1], pS, 'Theseus: straight', { to: [pS[0] - 70, pS[1] - 96], side: 'l' }); }
    /* name what the x-ray shows: the spring on the switch's line, the switch under the trigger */
    if (A && A.bend && A.sw) {
      const bc = [(A.bend[0][0] + A.bend[1][0]) / 2, (A.bend[0][1] + A.bend[1][1]) / 2];
      callout(t, 1.2, [bc[0] + 30, bc[1] + 14], 'The spring', { to: [bc[0] + 150, bc[1] + 92], side: 'r', color: C.ink2, tcolor: C.ink2, alpha: 1 - ep(t, Q.v - 0.3, Q.v) * 0 });
    }
    /* the finger: arrives over the inner point, presses, moves out, presses; lifts for the cut to straighten; again */
    if (A && A.at) {
      const P1 = A.at(...pts[0]), P2 = A.at(...pts[1]);
      const fx = kf(t, [[0.9, [P1[0] + 60, P1[1] + 260]], [Q.p1 - 0.05, P1], [Q.p2 - 0.45, P1], [Q.p2 - 0.05, P2], [Q.mo[0] + 0.1, P2], [Q.mo[0] + 0.7, [P2[0] - 30, P2[1] + 200]], [Q.p3 - 0.5, [P1[0] + 40, P1[1] + 160]], [Q.p3 - 0.05, P1], [Q.p4 - 0.45, P1], [Q.p4 - 0.05, P2]], E.cam);
      const fa = ep(t, 0.9, 1.2) * (1 - 0.65 * ep(t, Q.mo[0] + 0.1, Q.mo[0] + 0.5)) + 0.65 * ep(t, Q.p3 - 0.7, Q.p3 - 0.3);
      finger(fx[0], fx[1], -Math.PI / 2 - 0.12, { s: est.s, press: dNow, view: 'top', alpha: clamp(fa), len: 22 });
      /* the click force at each point, once its press lands */
      const gf = pts.map(([x, z]) => [b02_clickGf2(1, x, z), b02_clickGf2(0, x, z)]);
      const kA = [Q.p1, Q.p2].map(p => ep(t, p + 0.15, p + 0.4)), kB = [Q.p3, Q.p4].map(p => ep(t, p + 0.15, p + 0.4));
      [P1, P2].forEach((pp, j) => {
        const right = j === 0, x = pp[0] + (right ? 150 : -96), y = pp[1] + (right ? 12 : 120);
        if (kB[j] > 0) b02_gfTag(x, y, kB[j], gf[j][1].toFixed(1), { before: gf[j][0].toFixed(1), col: C.heroText, align: right ? 'left' : 'right' });
        else b02_gfTag(x, y, kA[j] * (1 - ep(t, Q.mo[0], Q.mo[0] + 0.4) * 0), gf[j][0].toFixed(1), { col: C.ink, align: right ? 'left' : 'right' });
        if (kA[j] > 0) text(right ? 'Inner side' : 'Outer side', x, y + 32, { role: 'label', size: 21, color: C.mute, align: right ? 'left' : 'right', alpha: Math.max(kA[j], kB[j]) });
        /* the outer side's extra weight, in a coin, where the finger feels it; then the same as the inner side */
        if (!right && kA[1] > 0) {
          const dg = gf[1][0] - gf[0][0], kx = ep(t, Q.p2 + 0.5, Q.p2 + 0.8) * (1 - ep(t, Q.mo[0], Q.mo[0] + 0.3)), ks = ep(t, Q.p4 + 0.4, Q.p4 + 0.7);
          if (kx > 0) text('+' + dg.toFixed(1) + ' gf: about a US nickel', x, y + 62, { role: 'small', size: 22, weight: 650, color: C.red, align: 'right', alpha: kx });
          if (ks > 0) text('Same as the inner side', x, y + 62, { role: 'small', size: 22, weight: 650, color: C.heroText, align: 'right', alpha: ks });
        }
      });
    }
    /* the classroom version, top right: fold a page on a square crease and on a slanted one */
    { const r = demoPanel(t, 0.15, [1320, 280, 520, 340], { label: 'The classroom version' }), kf0 = ep(t, 0.45, 1.45, E.io3), ka = ep(t, 0.3, 0.6);
      const half = r[2] / 2;
      b02_fold(r[0] + half * 0.5, r[1] + r[3] * 0.44, 4.0, 0, kf0, { alpha: ka, col: C.ink });
      b02_fold(r[0] + half * 1.5, r[1] + r[3] * 0.44, 4.0, 0.42, kf0, { alpha: ka, col: C.red });
      text('Square crease', r[0] + half * 0.5, r[1] + r[3] - 22, { role: 'label', size: 21, color: C.ink2, align: 'center', alpha: ka });
      text('Lands on itself', r[0] + half * 0.5, r[1] + r[3] + 6, { role: 'small', size: 22, weight: 600, color: C.mute, align: 'center', alpha: ka });
      text('Slanted crease', r[0] + half * 1.5, r[1] + r[3] - 22, { role: 'label', size: 21, color: C.red, align: 'center', alpha: ka });
      text('Swings to the side', r[0] + half * 1.5, r[1] + r[3] + 6, { role: 'small', size: 22, weight: 600, color: C.mute, align: 'center', alpha: ka }); }
    /* right: at the switch, from above */
    const lx = 1120, ly = 450, lr = 124, kl = ep(t, Q.p1 - 0.3, Q.p1 + 0.2);
    if (A && A.post && kl > 0) { const sp = A.post; line(sp[0] + 12, sp[1], lx - lr * 0.98, ly, { color: C.faint, w: 1.2, dash: [4, 4], alpha: kl }); }
    text('At the switch', lx, ly - lr - 22, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: kl });
    const swing = Math.max(dNow, ep(t, Q.p1, Q.p1 + 0.3) * 0.55 * (1 - ep(t, Q.mo[0] - 0.2, Q.mo[0])) + ep(t, Q.p3, Q.p3 + 0.3) * 0.55);
    b02_swingLoupe(t, lx, ly, lr, { lean, k: clamp(swing), a: kl, col: rival ? C.ink : C.hero, side: -1 });
    const share = b02_sideShare(lean) * 100;
    if (kl > 0) {
      text(share.toFixed(1) + '%', lx, ly + lr + 50, { role: 'num', size: 34, weight: 800, color: share > 0.05 ? C.red : C.heroText, align: 'center', alpha: kl });
      text('of the travel there, sideways', lx, ly + lr + 80, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: kl });
    }
    /* what the player gets, in words, beside the headline */
    const gIn = b02_clickGf2(1, ...pts[0]), gOut = b02_clickGf2(1, ...pts[1]), dG = gOut - gIn;
    { const g0 = b02_clickGf2(0, ...pts[0]);
      noteBox(t, Q.v + 1.3, 1480, 650, 360, { label: 'What you feel', value: null, head: 'The same click, either side', body: `${g0.toFixed(1)} gf, a little under an egg's weight, wherever your finger lands across it. Nothing at the switch goes sideways.` }); }
    /* the verdict: what the finger feels (the click's weight across the button); the switch's share is in the loupe */
    verdict(t, Q.v, 980, 862, { from: dG.toFixed(1), to: '0.0', unit: 'gf', label: 'Click force spread across the button', better: 'lower', who: ['Sora V2', 'Theseus'], size: 112, maxW: 490 });
    source(t, 'Derived for the example 10 mm spring on the switch\'s line: the trigger turns about the chord of its rear cutout there (the Sora V2\'s, from Brock\'s scan, leans 13.2°). Click = (GT01 55 gf × switch lever + bridge 7.7 gf × 40 mm) ÷ finger lever; presses 10 mm ahead of the switch, ' + B02_CT.dx + ' mm either side.', { t0: 1.6, maxW: 1380, y: 977 });
  }
});

/* ============================== 3. b02_seams: One split, between your fingers (#58) ==============================
   His note on shlsheet1 (4/10): the right cutouts idea is what matters there, it belongs with the other cutout slides,
   it needs a lot more detail, "especially how the further the seams are from the center the easier they are to get
   your fingers caught in them"; no pro model, no sticker. #58: a cutout round the wheel makes two splits at the
   triggers' inner edges, "a common spot to rest your finger"; one split down the middle is "a much less common resting
   spot". From above: the front half, two fingertips resting at the inner edges; the seams under skin light red; a loupe
   shows the step a press opens under the pad. */
const B02_SM = { press: { down: 0.2, hold: 0.75, up: 0.25 }, p1: 2.3, mo: [3.75, 0.9], p2: 5.05, v: 5.7, xI: 5.6, zI: 22.5, gap: 0.35, fx: 11.0, fz: 47.0 };
/** the seams on the kit's top view, in its frame (mm): k 1 the cutout round the wheel (two slots at ±xI from the nose to
   zI, joined behind the wheel), 0 the one split down the middle; lit colours for the slots (rival) and the split (Theseus) */
function b02_seamsTop(k, o = {}) {
  const Q = B02_SM, K = b02_K(), nose = 60.5, x = Q.xI * k, P = (xx, z) => [xx * K.x, -z * K.y];
  G.save(); G.lineCap = 'round'; G.lineJoin = 'round';
  /* the island's fill (the strip of shell round the wheel), only while it is there */
  if (k > 0.02) { G.save(); G.clip(msView('top').out); G.beginPath(); const a = P(-x, Q.zI), b = P(x, Q.zI), c = P(x, nose), d = P(-x, nose); G.moveTo(...a); G.lineTo(...b); G.lineTo(...c); G.lineTo(...d); G.closePath(); G.fillStyle = rgba(o.islandCol || C.second, (TH ? 0.16 : 0.2) * k); G.fill(); G.restore(); }
  /* the seams: two slots that close into one */
  G.save(); G.clip(msView('top').out);
  const col = k > 0.02 ? (o.col || C.second) : (o.col0 || C.ink);
  for (const sg of [-1, 1]) { const a = P(sg * x, Q.zI - (k > 0.02 ? 0 : 18)), b = P(sg * x, nose); line(a[0], a[1], b[0], b[1], { color: col, w: lw(o.w || 2.6), alpha: o.a == null ? 1 : o.a }); }
  if (k > 0.02) { const a = P(-x, Q.zI), b = P(x, Q.zI); line(a[0], a[1], b[0], b[1], { color: col, w: lw(o.w || 2.6), alpha: o.a == null ? 1 : o.a }); }
  G.restore();
  G.restore();
}
/** the loupe's section: the seam under the left fingertip, seen from the front, magnified. The strip (fixed, round the
   wheel) on the viewer's left, the trigger on the right; pressed, the trigger drops; the pad drapes into the step.
   k 1 rival (a seam there) .. 0 Theseus (the trigger runs on under the pad: no seam) */
function b02_seamLoupe(t, x, y, r, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  const Q = B02_SM, k = o.k, d = (o.press || 0) * 0.46, ex = 4, g = Q.gap * ex, s = r / 9;
  G.save(); G.globalAlpha = a; G.beginPath(); G.arc(x, y, r, 0, TAU); G.fillStyle = C.bg; G.fill(); G.clip();
  part(x, y + r * 0.18, s, () => {
    const fill = mix(C.ink, C.bg, TH ? 0.62 : 0.55), shell = TH ? C.panel : C.comp2, edge = inkA(0.6);
    /* canvas y is down here: the surface at 0, the plastic below it; a press drops the button by d (drawn ex times) */
    const dd = d * ex, strip = [[-14, 0], [-g / 2, 0], [-g / 2, 3], [-14, 3]], trig = [[g / 2, dd], [14, dd], [14, 3 + dd], [g / 2, 3 + dd]];
    const poly = (pts, f) => { G.beginPath(); pts.forEach(([u, yy], i) => i ? G.lineTo(u, yy) : G.moveTo(u, yy)); G.closePath(); G.fillStyle = f; G.fill(); G.strokeStyle = edge; G.lineWidth = lw(1.6); G.stroke(); };
    if (k > 0.5) { poly(strip, shell); poly(trig, fill); }
    else poly([[-14, dd], [14, dd], [14, 3 + dd], [-14, 3 + dd]], fill);
    /* the pad (b02_fingerEndMM works y up), wrapping whatever is under it: on the strip it stays up, over the button it
       rides down; a press with a seam under it folds skin into the step */
    const surf = u => k > 0.5 ? (u < -g / 2 ? 0 : u < g / 2 ? -2.6 : -dd) : -dd;
    const mk = k > 0.5 && (o.press || 0) > 0.5 ? [-g / 2 - 1.2, g / 2 + 1.6, C.red] : null;
    b02_fingerEndMM({ cx: 4.0, base: -dd, sink: 0.35, surf, w: 15.5, h: 12.5, mark: mk });
  });
  G.restore();
  circle(x, y, r, { color: inkA(0.5), w: 1.5, alpha: a });
}
S({
  id: 'b02_seams', ch: 'click', theme: 'night', title: 'One split, between your fingers', settle: 10, ideas: [58],
  replaces: ['shlsheet1'],
  src: ['clk_brock', 'shlB2gSlx', 'b02_dandekar'],
  answers: [
    ['most important thing here is the right cutouts thing', '#58 is the whole slide (the other two ideas on shlsheet1 are not here)'],
    ['and it should be back by the other cutouts slides', 'It comes right after the straight rear cutouts, before the flat front and the flush walls'],
    ['and it needs a lot more detail', 'From above: where fingertips rest, which seams run under skin (red), and a loupe at the seam: the pressed button drops 0.46 mm below the strip round the wheel and the pad drapes into the step'],
    ['especially how the further the seams are from the center the easier they are to get your fingers caught in them', 'Shown with two fingertips resting side by side: the seams 5.6 mm out run under both pads; the one split at the centre runs in the gap between them'],
    ['we don\'t have to talk about the pro model yet', 'Not on the slide (the PPS triggers are gone from this chapter)'],
    ['and i\'m unsure about the the sticker', 'Not on the slide']
  ],
  sfx: [[pressCross(B02_SM.p1, B02_SM.press, 0.7), 'click'], [pressCross(B02_SM.p2, B02_SM.press, 0.7), 'click']],
  draw: t => {
    const Q = B02_SM, K = b02_K();
    header(t, 'One split, between your fingers');
    captions(t, [[0.5, 'A cutout round the scroll wheel splits the top twice, as on the Starlight X: each button\'s inner edge becomes a seam.'],
      [1.7, 'Those edges are where fingertips rest. Press, and the button drops below the strip beside it: the skin catches in the step.'],
      [Q.mo[0], 'Theseus keeps one split, down the middle with the wheel in it. It runs between your fingers, not under them.'],
      [Q.v + 0.4, 'Nothing under your fingertips to catch, whether you press, rest or flick.']]);
    const k = 1 - ep(t, Q.mo[0], Q.mo[0] + Q.mo[1], E.io3), pr = Math.max(pressCurve(t, Q.p1, Q.press), pressCurve(t, Q.p2, Q.press));
    const box = [80, 270, 1000, 650];
    const est = establish(t, 0, box, { view: 'top', hi: ['seam'], col: 'ink', focus: [-26, -64, 52, 44], hold: 0.4, dur: 1.0, locator: 'tl', locW: 64,
      mouse: { hide: ['seam'] },
      draw: () => { b02_seamsTop(k, { col: C.second, col0: C.hero, a: 1 }); } });
    const P = (x, z) => est.P(x * K.x, -z * K.y);
    /* two fingertips resting side by side at the buttons' inner edges */
    const fa = ep(t, 0.9, 1.3), slide = ep(t, Q.p1 + 0.1, Q.p1 + 0.5) * (1 - ep(t, Q.p1 + 1.0, Q.p1 + 1.3)) * 1.5;
    for (const sg of [-1, 1]) { const p = P(sg * Q.fx + (sg < 0 ? slide : 0), Q.fz); finger(p[0], p[1] + (1 - ep(t, 0.9, 1.4, E.out3)) * 200, -Math.PI / 2, { s: est.s, press: sg < 0 ? pr : 0, view: 'top', alpha: fa, len: 30 }); }
    /* the seams under skin, red, where a pad crosses one */
    const under = k > 0.5 ? 2 : 0, ku = ep(t, 1.7, 2.0) * (k > 0.5 ? 1 : 0);
    if (ku > 0) for (const sg of [-1, 1]) { const a = P(sg * Q.xI, Q.fz - 6.5), b = P(sg * Q.xI, Q.fz + 6.5); line(a[0], a[1], b[0], b[1], { color: C.red, w: 5, alpha: ku * k }); }
    if (k > 0.5) faultTag(t, 1.9, P(-Q.xI, Q.fz - 8), 'Under both fingertips', { to: [P(-Q.xI, Q.fz - 8)[0] - 140, P(-Q.xI, Q.fz - 8)[1] + 150], side: 'l', alpha: 1 - ep(t, Q.mo[0] - 0.3, Q.mo[0]) });
    if (k < 0.02) fixTag(t, Q.mo[0] + Q.mo[1] + 0.1, P(0, Q.fz + 9), 'Between them', { to: [P(0, Q.fz + 9)[0] + 160, P(0, Q.fz + 9)[1] - 70], side: 'r' });
    /* the loupe at the left fingertip's seam */
    const lx = 1360, ly = 470, lr = 150, la = ep(t, 1.9, 2.3);
    if (la > 0) { const pS = P(-Q.xI, Q.fz); line(pS[0], pS[1], lx - lr, ly, { color: C.faint, w: 1.2, dash: [4, 4], alpha: la }); }
    b02_seamLoupe(t, lx, ly, lr, { a: la, k, press: pr });
    text(k > 0.5 ? 'At the seam, from the front' : 'Under the fingertip, from the front', lx, ly - lr - 24, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: la });
    if (la > 0) { const kr = ep(pr, 0.6, 0.95);
      if (k > 0.5) text('Skin caught in a 0.46 mm step', lx, ly + lr + 46, { role: 'small', size: 25, weight: 700, color: C.red, align: 'center', alpha: kr * la });
      else text('One surface under the pad', lx, ly + lr + 46, { role: 'small', size: 25, weight: 700, color: C.heroText, align: 'center', alpha: kr * la }); }
    scaleNote(lx - 120, ly + lr + 92, 'Step and gap drawn 4×', { t, t0: 2.4, size: 21 });
    verdict(t, Q.v, 1160, 935, { from: '2', to: '0', unit: 'seams', label: 'Under your fingertips', better: 'lower', who: ['Starlight X', 'Theseus'], size: 140, maxW: 640, net: false });
    source(t, 'Starlight X: "cutouts flanking the scroll wheel and the inner edges of the main buttons" (Back2Gaming). Derived: fingertips (16 to 20 mm across, Dandekar 2003; drawn 16) resting side by side at the buttons\' inner edges; the strip\'s seams 5.6 mm out; the button\'s travel at the fingertip at the click 0.46 mm.', { t0: 1.6, maxW: 1000, y: 977 });
  }
});

/* ============================== 4. b02_front: A flat front: no wobble (#46, #47) ==============================
   His note on clk_front, left half: "the left needs to compare to what happens when you don't have a straight front, like
   when there is heavy front comfort grooves, and how that can cause wobble side to side, because the front will never reach
   the bottom in the same spot at the same, and where it reaches the bottom first will depend on where you press it, create
   wobble which makes the parts feel cheap and wear out faster". Not a section: the front of the mouse, head-on. */
const B02_FT = { press: { down: 0.18, hold: 0.62, up: 0.24 }, p1: 1.7, p2: 3.05, mo: [4.2, 0.9], p3: 5.35, p4: 6.55, v: 6.0, u: [8.0, 16.5], misX: 2.5 };
/** the classroom version: a rocker (a half-round bottom) and a flat block on a floor, pressed on one side, then the other.
   The rocker rolls onto a new spot each time (rolling without slipping: its centre moves R·φ); the block stays put */
function b02_rockers(t, r, roll, pressAt, a) {
  const [x, y, w, h] = r, fy = y + h - 30, s = Math.min(w / 260, h / 150), R = 34 * s, c1 = x + w * 0.28, c2 = x + w * 0.74;
  if (a <= 0.003) return { c1, c2, fy, R };
  G.save();
  line(x + 10, fy, x + w - 10, fy, { color: inkA(0.45), w: 2, alpha: a });
  const body = TH ? C.panel : C.hair, ed = inkA(TH ? 0.6 : 0.55);
  /* the rocker */
  { const cx = c1 + R * roll, cy = fy - R; G.save(); G.globalAlpha = a; G.translate(cx, cy); G.rotate(roll);
    G.beginPath(); G.moveTo(-R, 0); G.arc(0, 0, R, Math.PI, 0, true); G.lineTo(R, -R * 1.1); G.lineTo(-R, -R * 1.1); G.closePath(); G.fillStyle = body; G.fill(); G.strokeStyle = ed; G.lineWidth = 2; G.stroke(); G.restore();
    circle(cx, fy, 5, { fill: C.red, alpha: a }); }
  /* the flat block */
  { const bw = R * 2, bh = R * 2.1; rr(c2 - bw / 2, fy - bh, bw, bh, 4, body, ed, 2, a); line(c2 - bw / 2 + 3, fy, c2 + bw / 2 - 3, fy, { color: C.hero, w: 4, alpha: a }); }
  /* the press, on one side or the other, the same on both */
  if (pressAt) { const [side, k] = pressAt; for (const [cx, top] of [[c1, fy - R * 2.1], [c2, fy - R * 2.1]]) { const px = cx + side * R * 0.7; arrow(px, top - 26, px, top - 4, { color: C.ink, w: 3, hs: 9, alpha: k * a }); } }
  G.restore();
  return { c1, c2, fy, R };
}
S({
  id: 'b02_front', ch: 'click', theme: 'paper', title: 'A flat front, no wobble', settle: 10.5, ideas: [46, 47],
  replaces: ['clk_front'],
  src: ['clk_brock', 'clk_protolabs'],
  answers: [
    ['this slide has second worst execution in the deck', 'Rebuilt as three slides (this one, b02_grooves, b02_flush), each a demonstration on the simplified mouse; this one shows the front edge itself, head-on, pressed by a finger'],
    ['it fails to intuitively communicate what is going on. if they were not my ideas i\'d be very lost', 'One idea per slide, one view: the whole mouse from the front, one push-in to the left trigger\'s front edge (locator kept), the same two presses on a grooved front and on Theseus\'s flat one, and a rocker beside it'],
    ['the left needs to compare to what happens when you don\'t have a straight front, like when there is heavy front comfort grooves', 'The rival is a front with heavy comfort grooves running to the edge: its lip and the ledge under it dip together, 0.1 mm out of step (inside two ±0.076 mm molds); then the grooves run out and the front is flat'],
    ['and how that can cause wobble side to side, because the front will never reach the bottom in the same spot at the same, and where it reaches the bottom first will depend on where you press it', 'Shown: pressed on the inner side the lip lands and rolls in, on the outer side it rolls out; the red landing spot moves 8.5 mm with the finger and the button tips about 0.8° each way'],
    ['create wobble which makes the parts feel cheap and wear out faster', 'The rock is measured at the button\'s outer edge (0.42 mm between the two presses, the headline), each landing leaves a red mark on its one spot, and the note says it: no wobble, no one spot hammered by every click. On the flat front the whole edge lands, blue'],
    ['these are all very important concepts and probably should be spread out over multiple slides, but still dense in information, not too many slides', 'Three slides: the flat front (here), the grooves that lock the finger in (b02_grooves), flush walls and ceiling-facing cutouts (b02_flush)'],
    ['i don\'t think cross sections are the best way to communicate the comfort grooves that get shallower near the front', 'On b02_grooves (no sections: the button\'s surface in 3/4)'],
    ['also it needs to be explained that these help lock your fingers in across another plane of motion and increase surface area contact since the front has more surface area too', 'On b02_grooves'],
    ['for the right visualization, it genuinely took me so long to realize that you weren\'t demonstrating an alternative to the the left demonstration', 'On b02_flush, its own slide with its own rival'],
    ['you need to show how some mice do that concept wrong to create larger gaps than there should be and how we do it right', 'On b02_flush'],
    ['this is also an amazing opportunity to demonstrate why the cutouts are ceiling or wall facing', 'On b02_flush']
  ],
  sfx: [[pressCross(B02_FT.p1, B02_FT.press, 0.7), 'click'], [pressCross(B02_FT.p2, B02_FT.press, 0.7), 'click'], [pressCross(B02_FT.p3, B02_FT.press, 0.7), 'click'], [pressCross(B02_FT.p4, B02_FT.press, 0.7), 'click']],
  draw: t => {
    const Q = B02_FT, F = B02_FR, D = Q.press;
    header(t, 'A flat front, no wobble');
    captions(t, [[0.5, 'Heavy comfort grooves that run to the front edge curve the trigger\'s front, and the ledge in the shell it lands on.'],
      [Q.p1 - 0.1, 'Two molded curves never match exactly. The front lands on one spot and rocks on it, and which spot depends on where you press.'],
      [Q.mo[0] - 0.5, 'Theseus\'s grooves run out before the front, so the front and its ledge are flat and parallel to the ground.'],
      [Q.v + 0.4, 'The whole front lands at once, the same way wherever you press: no wobble, and no one spot taking every hit.']]);
    const k = 1 - ep(t, Q.mo[0], Q.mo[0] + Q.mo[1], E.io3), rival = k > 0.5;
    /* the four presses: inner, outer on the grooved front; inner, outer on the flat one */
    const P = [Q.p1, Q.p2, Q.p3, Q.p4], Uf = [Q.u[0], Q.u[1], Q.u[0], Q.u[1]];
    const Dl = Object.assign({}, D, { hold: 99 }), Di = i => (i === 3 ? Dl : D);
    let drop = 0, act = -1; P.forEach((p, i) => { const d = pressCurve(t, p, Di(i)); if (d > drop + 1e-9) { drop = d; act = i; } });
    const roll = act < 0 ? 0 : ep(t, P[act] + D.down, P[act] + D.down + 0.3) * (1 - ep(t, P[act] + D.down + Di(act).hold, P[act] + D.down + Di(act).hold + D.up * 0.55));
    const cu = act < 0 ? F.uc : lerp(F.uc, b02_frontReach(Uf[act]), roll), hit = act < 0 ? 0 : clamp((drop - 0.95) / 0.05);
    const wA = 1 - ep(t, Q.mo[0], Q.mo[0] + 0.45);
    const wear = [[b02_frontReach(Q.u[0]), ep(t, Q.p1 + 0.5, Q.p1 + 0.75) * wA], [b02_frontReach(Q.u[1]), ep(t, Q.p2 + 0.5, Q.p2 + 0.75) * wA]];
    const box = [80, 270, 1000, 610], exK = lerp(1, F.ex, ep(t, 0.95, 1.55));
    let A = null;
    const est = establish(t, 0, box, { view: 'front', hi: ['trigL'], col: 'ink', focus: [-3, -22, 34, 22], hold: 0.4, dur: 1.0, locator: 'tl',
      mouse: { hide: ['triggers', 'seam', 'wheel', 'usb'] },
      draw: () => { A = b02_frontMM({ k, drop, cu, hit, wear, ex: exK, misX: lerp(1, Q.misX, ep(t, 0.95, 1.55)), level: ep(t, Q.p1, Q.p1 + 0.3) * (1 - ep(t, Q.mo[0], Q.mo[0] + 0.3)), lit: ep(t, 0.12, 0.55) * (1 - ep(t, 1.3, 1.8)) }); } });
    /* the press, as the kit advises for a front view: an arrow onto the button where the finger is, sliding between presses */
    if (A) {
      const uF = kf(t, [[0.9, Q.u[0]], [Q.p1 + 1.05, Q.u[0]], [Q.p2 - 0.05, Q.u[1]], [Q.mo[0] + 0.15, Q.u[1]], [Q.p3 - 0.35, Q.u[0]], [Q.p3 + 1.05, Q.u[0]], [Q.p4 - 0.05, Q.u[1]]], E.cam);
      const p = A.top(uF), fa = ep(t, 1.3, 1.6), kp = Math.max(0.35, drop);
      G.save(); G.beginPath(); G.rect(box[0], box[1], box[2], box[3]); G.clip();
      forceArrow(p[0], p[1] - 4, Math.PI / 2 - A.th, 120, { k: fa * kp, color: C.ink, w: 5, hs: 18 });
      G.restore();
      if (fa > 0) text('Your press', p[0] + 16, Math.max(box[1] + 30, p[1] - 96), { role: 'label', size: 20, color: C.mute, alpha: fa });
      /* name the parts once the camera is in */
      callout(t, 1.5, A.lipAt(23), 'The trigger\'s front', { to: [A.lipAt(23)[0] + 40, A.lipAt(23)[1] - 150], side: 'r', color: C.ink2, tcolor: C.ink2, alpha: 1 - ep(t, Q.p2 - 0.2, Q.p2) });
      callout(t, 1.7, A.ledgeAt(21), 'The ledge it lands on', { to: [A.ledgeAt(21)[0] + 40, A.ledgeAt(21)[1] + 80], side: 'r', color: C.ink2, tcolor: C.ink2, alpha: 1 - ep(t, Q.p2 - 0.2, Q.p2) });
    }
    /* on the grooved front: the landing spot, named; and how far the corner rocks between the two presses */
    const tr = F.ex, uE = 26, yE = ex => b02_frontY(1, ex).lip(uE), poseT = u => b02_frontPose(1, 1, 1, b02_frontReach(u)), cA = poseT(Q.u[0]).map(uE, yE(1)), cB = poseT(Q.u[1]).map(uE, yE(1));
    const rock = Math.abs(cA[1] - cB[1]), deg = Math.abs(poseT(Q.u[0]).th) * 180 / Math.PI;
    if (A) {
      { const c1 = A.ledgeAt(b02_frontReach(Q.u[0])); faultTag(t, Q.p1 + 0.45, c1, 'Lands on one spot', { to: [c1[0] - 40, c1[1] + 96], side: 'l', alpha: wA }); }
      const pd = u => { const q = b02_frontPose(1, tr, 1, b02_frontReach(u)).map(uE, yE(tr)); return est.P(q[0], -q[1]); };
      const yA = pd(Q.u[0]), yB = pd(Q.u[1]), kr = ep(t, Q.p2 + 0.55, Q.p2 + 0.85) * wA, x0 = Math.max(yA[0], yB[0]) + 34;
      if (kr > 0) {
        arrow(x0, (yA[1] + yB[1]) / 2, x0, Math.min(yA[1], yB[1]) - 2, { color: C.red, w: 2.5, hs: 10, alpha: kr });
        arrow(x0, (yA[1] + yB[1]) / 2, x0, Math.max(yA[1], yB[1]) + 2, { color: C.red, w: 2.5, hs: 10, alpha: kr });
        const ly = A.ledgeAt(uE)[1] + 150;
        text('Rocks ' + rock.toFixed(2) + ' mm', x0 + 10, ly, { role: 'num', size: 30, weight: 800, color: C.red, align: 'right', alpha: kr });
        text('at the edge, ' + deg.toFixed(1) + '° each way', x0 + 10, ly + 28, { role: 'label', size: 20, color: C.mute, align: 'right', alpha: kr });
      }
      /* on Theseus: the whole front lands, the same line both times */
      const kf1 = ep(t, Q.p3 + 0.2, Q.p3 + 0.45);
      if (kf1 > 0) { const c2 = A.ledgeAt(F.flat * 0.75); fixTag(t, Q.p3 + 0.2, c2, 'Lands along the whole front', { to: [c2[0] + 60, c2[1] + 74], side: 'r' }); }
      scaleNote(box[0], box[1] + box[3] + 34, 'Heights and gaps drawn ' + F.ex + '×, the mismatch ' + (F.ex * Q.misX) + '×', { t, t0: 1.6, size: 21 });
    }
    /* the classroom version: a rocker and a flat block, pressed with the finger, side by side */
    { const r = demoPanel(t, 0.15, [1120, 280, 720, 250], { label: 'The classroom version' }), ka = ep(t, 0.3, 0.6);
      const side = act < 0 ? 0 : (Uf[act] < F.uc ? -1 : 1), rk = act < 0 ? 0 : roll * side * 0.3;
      const g = b02_rockers(t, [r[0], r[1] + 14, r[2], r[3] - 50], rk, act < 0 ? null : [side, ep(drop, 0.2, 0.9)], ka);
      text('Round bottom', g.c1, g.fy + 34, { role: 'label', size: 21, color: C.red, align: 'center', alpha: ka });
      text('Rocks to where you press', g.c1, g.fy + 62, { role: 'small', size: 22, weight: 600, color: C.mute, align: 'center', alpha: ka });
      text('Flat bottom', g.c2, g.fy + 34, { role: 'label', size: 21, color: C.ink2, align: 'center', alpha: ka });
      text('Lands the same way', g.c2, g.fy + 62, { role: 'small', size: 22, weight: 600, color: C.mute, align: 'center', alpha: ka }); }
    noteBox(t, Q.v + 1.3, 1120, 556, 720, { label: 'What you feel', head: 'A solid landing, every press', body: 'No wobble wherever your finger sits, no one spot hammered by every click, and a flat ledge is easy to recut to tune the travel.' });
    verdict(t, Q.v, 1120, 925, { from: rock.toFixed(2), to: '0.00', unit: 'mm', label: 'Rock at the button\'s outer edge', better: 'lower', who: ['Grooved', 'Theseus'], rivalCol: 'grey', size: 112, maxW: 700 });
    source(t, 'Derived for an example groove: 0.9 mm deep across the front, the lip\'s dip 0.1 mm deeper than the ledge\'s (molds hold ±0.076 mm: Protolabs); the lip rolls onto the ledge under the press. Theseus: both flat. Presses ' + Q.u[0] + ' and ' + Q.u[1] + ' mm out from the split.', { t0: 1.6, maxW: 1000 });
  }
});

/* ============================== 5. b02_grooves: Grooves that hold your finger (#47) ==============================
   Replaces grooves (not rated). Answers clk_front's (f) "i don't think cross sections are the best way to communicate the
   comfort grooves that get shallower near the front" and (g) "these help lock your fingers in across another plane of
   motion and increase surface area contact since the front has more surface area too". The model, checked (SHP_GR, the
   shape chapter's): on a plain crown (R 30 mm across) the surface under the pad's edge (7 mm out) leans, so 22.7 % of the
   push there points outward; a groove (R 18 mm) cut into the crown leaves a net hollow (R 45 mm), so 15.4 % points inward,
   from both sides: the finger is held (a marble in a bowl). Contact width for the same press: the pad (R 8 mm across) on
   a crown vs in the hollow: √((1/8 + 1/30) / (1/8 − 1/45)) = 1.24, so 24 % wider (the old slide's 51 % used the groove
   alone, without the crown it is cut into). No sections: the button in 3D, the groove shading in and running out before
   the front. */
const B02_GV = { Rc: 30, Rg: 18, Rf: 8, pad: 7, xc: -16, W: 8.2, d: 0.9, ex: 3, zRun: [44, 54], fz: 44, nudge: [2.1, 1.2], mo: [3.7, 1.0], nudge2: [5.1, 1.2], v: 6.6 };
const b02_gvSide = cg => { const s = B02_GV.pad * (1 / B02_GV.Rc - cg); return s / Math.hypot(1, s); };
const b02_gvWide = () => { const Q = B02_GV, a = 1 / Q.Rf + 1 / Q.Rc, b = 1 / Q.Rf - (1 / Q.Rg - 1 / Q.Rc); return Math.sqrt(a / b); };
/** the button's top in 3D (world mm: x across, the user's left negative; y up; z forward), k the groove's depth (0..1),
   which shallows to nothing between zRun[0] and zRun[1] (the flat front of b02_front); heights drawn ex× for the groove */
function b02_gvY(x, z, k) {
  const Q = B02_GV, u = (x - Q.xc) / Q.W, run = 1 - smooth(clamp((z - Q.zRun[0]) / (Q.zRun[1] - Q.zRun[0])));
  /* the groove as the model has it (SHP_GR): a hollow of radius Rg cut W either side of the pad's centre, softened at its rim */
  const du = x - Q.xc, sp = v => 0.25 * Math.log(1 + Math.exp(v / 0.25)), g = sp((Q.W * Q.W - du * du) / (2 * Q.Rg));
  return b02_h(Q.xc, z) - du * du / (2 * Q.Rc) - k * Q.ex * g * run;
}
/** draw the left button as a shaded surface (quads back to front, lit from the front left), in camera cam */
function b02_gvSurf(cam, k, a) {
  if (a <= 0.003) return;
  const nx = 28, nz = 34, x0 = -29, x1 = -1.5, z0 = 22, z1 = 58.5, L = [0.45, 0.8, 0.4], Ln = Math.hypot(...L);
  const quads = [];
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    const xa = lerp(x0, x1, i / nx), xb = lerp(x0, x1, (i + 1) / nx), za = lerp(z0, z1, j / nz), zb = lerp(z0, z1, (j + 1) / nz);
    const p = [[xa, za], [xb, za], [xb, zb], [xa, zb]].map(([x, z]) => [x, b02_gvY(x, z, k), z]);
    const ux = [p[1][0] - p[0][0], p[1][1] - p[0][1], p[1][2] - p[0][2]], uz = [p[3][0] - p[0][0], p[3][1] - p[0][1], p[3][2] - p[0][2]];
    const n = [uz[1] * ux[2] - uz[2] * ux[1], uz[2] * ux[0] - uz[0] * ux[2], uz[0] * ux[1] - uz[1] * ux[0]], nl = Math.hypot(...n) || 1;
    const lam = Math.max(0, (n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / (nl * Ln) * Math.sign(n[1] || 1));
    const q = p.map(pt => cam.P(pt)), depth = q.reduce((s2, v) => s2 + v[2], 0) / 4;
    quads.push({ q, lam, depth });
  }
  quads.sort((A2, B2) => B2.depth - A2.depth);
  const dark = TH ? [196, 196, 200] : [38, 39, 42], light = TH ? [246, 246, 248] : [112, 112, 118];
  G.save(); G.globalAlpha *= a;
  for (const { q, lam } of quads) {
    const c = dark.map((v, i2) => Math.round(lerp(v, light[i2], Math.pow(lam, 1.4))));
    G.beginPath(); q.forEach((v, i2) => i2 ? G.lineTo(v[0], v[1]) : G.moveTo(v[0], v[1])); G.closePath();
    G.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`; G.fill(); G.strokeStyle = `rgb(${c[0]},${c[1]},${c[2]})`; G.lineWidth = 0.8; G.stroke();
  }
  G.restore();
}
/** the pad on the surface (an ellipse 2·pad across, 18 mm along), the pushes at its two edges (the surface's normal there,
   its sideways part coloured: red outward, blue inward) */
function b02_gvPad(cam, k, xf, zf, a, wide) {
  const Q = B02_GV, pts = [], ax = Q.pad * (wide || 1), az = 8;
  for (let i = 0; i <= 48; i++) { const th = i / 48 * TAU, x = xf + Math.cos(th) * ax, z = zf + Math.sin(th) * az; pts.push(cam.P([x, b02_gvY(x, z, k) + 0.1, z])); }
  G.save(); G.globalAlpha *= a; b02_pathOf(pts); G.fillStyle = rgba(TH ? '#8A8A8F' : '#C3C3C3', 0.42); G.fill(); G.strokeStyle = inkA(0.75); G.lineWidth = 2; G.setLineDash([6, 4]); G.stroke(); G.setLineDash([]); G.restore();
  const out = [];
  for (const sg of [-1, 1]) {
    const x = xf + sg * Q.pad, z = zf, e = 0.25, gx = (b02_gvY(x + e, z, k) - b02_gvY(x - e, z, k)) / (2 * e);
    const side = (-gx / Math.hypot(gx, 1)) * sg;   /* + : the push there leans away from the pad's middle */
    const y = b02_gvY(x, z, k) + 2.2, L = 10 * Math.sign(side) * sg;
    const P0 = cam.P([x, y, z]), P1 = cam.P([x + L, y, z]);
    arrow(P0[0], P0[1], P1[0], P1[1], { color: side > 0 ? C.red : C.hero, w: 4, hs: 13, alpha: a });
    out.push({ at: P1, from: P0, out: side });
  }
  return out;
}
/** the classroom version (OpenStax §9.3): a ball on a hill and a marble in a bowl, nudged */
function b02_bowls(r, nudge, a) {
  if (a <= 0.003) return;
  const [x, y, w, h] = r, ed = inkA(TH ? 0.6 : 0.55), base = y + h - 10, R = 60;
  /* the hill: the ball runs off */
  { const cx = x + w * 0.25; G.save(); G.globalAlpha = a; G.beginPath(); G.moveTo(cx - R * 1.6, base); G.quadraticCurveTo(cx, base - R * 1.2, cx + R * 1.6, base); G.strokeStyle = ed; G.lineWidth = 2; G.stroke(); G.restore();
    const bx = cx + nudge * 70, by = base - R * 0.6 + Math.pow(nudge, 2) * R * 0.5; circle(bx, by - 11, 11, { fill: C.red, alpha: a }); }
  /* the bowl: the marble comes back */
  { const cx = x + w * 0.75; G.save(); G.globalAlpha = a; G.beginPath(); G.moveTo(cx - R * 1.6, base - R * 1.2); G.quadraticCurveTo(cx, base + R * 0.9, cx + R * 1.6, base - R * 1.2); G.strokeStyle = ed; G.lineWidth = 2; G.stroke(); G.restore();
    const back = Math.sin(nudge * Math.PI) * 0.35, bx = cx + back * 50, by = base - R * 0.15 - Math.abs(back) * 10; circle(bx, by - 11, 11, { fill: C.hero, alpha: a }); }
}
S({
  id: 'b02_grooves', ch: 'click', theme: 'night', title: 'Grooves that hold your finger', settle: 10.5, ideas: [47],
  replaces: ['grooves'],
  src: ['clk_brock', 'b02_osStab'],
  answers: [
    ['(clk_front f) i don\'t think cross sections are the best way to communicate the comfort grooves that get shallower near the front', 'No sections: the button in 3D, shaded; the groove fades in and runs out before the front edge, where b02_front needs the front flat'],
    ['(clk_front g) also it needs to be explained that these help lock your fingers in across another plane of motion and increase surface area contact since the front has more surface area too', 'Shown: a sideways nudge slides the pad toward the edge on a plain crown, and the same nudge is pushed back in the groove (the pushes at the pad\'s edges turn from outward to inward); the pad\'s contact widens by 24 % in the groove, and the caption says the front of the fingertip, the widest part, is cradled'],
    ['(grooves, not rated) the old model', 'Kept and checked: 22.7 % out on the crown, 15.4 % in with the groove (SHP_GR); the contact-width figure corrected from 51 % to 24 % (the groove is cut into the crown)']
  ],
  sfx: [],
  draw: t => {
    const Q = B02_GV;
    header(t, 'Grooves that hold your finger');
    captions(t, [[0.5, 'On a plain crown, the button falls away under both edges of your fingertip, so a sideways nudge slides it off the middle.'],
      [Q.mo[0], 'A comfort groove hollows the button under the pad: now both edges push back toward the middle. It runs out before the front edge.'],
      [Q.v + 0.4, 'Your finger is held across the button as well as along it, with more of the fingertip in contact.']]);
    const k = ep(t, Q.mo[0], Q.mo[0] + Q.mo[1], E.io3);
    const nd1 = Math.sin(Math.PI * clamp((t - Q.nudge[0]) / Q.nudge[1])) * (t > Q.nudge[0] && t < Q.nudge[0] + Q.nudge[1] ? 1 : 0);
    const nd2 = Math.sin(Math.PI * clamp((t - Q.nudge2[0]) / Q.nudge2[1])) * (t > Q.nudge2[0] && t < Q.nudge2[0] + Q.nudge2[1] ? 1 : 0);
    /* on the crown the pad slides off and stays off; in the groove it is pushed back */
    const drift = k < 0.5 ? -3.2 * ep(t, Q.nudge[0], Q.nudge[0] + Q.nudge[1] * 0.6) * (1 - ep(t, Q.mo[0] - 0.4, Q.mo[0])) : -1.4 * nd2;
    const box = [80, 270, 1080, 650], kd = ep(t, 0.95, 1.5);
    establish(t, 0, box, { view: 'top', hi: ['trigL'], col: 'ink', focus: [-34, -62, 44, 40], hold: 0.4, dur: 1.0, locator: 'tl', locW: 64, dimFill: 1, fade: 0.1,
      mouse: { lit: ep(t, 0.12, 0.55) * (1 - kd), alpha: 1 - 0.96 * kd } });
    const cam = b02_cam3([-16, 22, 40], 0.42, 0.78, 15.5, box[0] + 540, box[1] + 330);
    b02_gvSurf(cam, k, kd);
    const wide = lerp(1, b02_gvWide(), k), P = b02_gvPad(cam, k, Q.xc + drift, Q.fz, kd * ep(t, 1.4, 1.8), wide);
    /* the nudge, as an arrow beside the pad */
    const nn = Math.max(nd1 * (k < 0.5 ? 1 : 0), nd2 * (k > 0.5 ? 1 : 0));
    if (nn > 0.02) { const pc = cam.P([Q.xc + drift + 9, b02_gvY(Q.xc + drift + 9, Q.fz, k) + 6, Q.fz]); const pe = cam.P([Q.xc + drift + 2, b02_gvY(Q.xc + drift + 2, Q.fz, k) + 6, Q.fz]); arrow(pc[0], pc[1], pe[0], pe[1], { color: C.ink, w: 3.5, hs: 12, alpha: nn * kd }); }
    if (P && P[0] && kd > 0.5) {
      const side = b02_gvSide(k > 0.5 ? 1 / Q.Rg : 0) * 100;
      const pA = P[0].at;
      callout(t, 1.8, pA, Math.abs(side).toFixed(1) + ' % of the push at the pad\'s edge: ' + (side > 0 ? 'outward' : 'inward'), { to: [pA[0] - 40, pA[1] - 120], side: 'l', color: side > 0 ? C.red : C.hero, tcolor: side > 0 ? C.red : C.heroText, prose: true, maxW: 320 });
    }
    text('The left button, from the front left; the groove drawn ' + Q.ex + '× deep', box[0] + 30, box[1] + box[3] - 20, { role: 'small', size: 21, color: C.faint, alpha: kd });
    { const r = demoPanel(t, 0.2, [1200, 290, 640, 270], { label: 'The classroom version', src: 'OpenStax §9.3' }), ka = ep(t, 0.4, 0.8);
      const nb = Math.max(nd1, nd2);
      b02_bowls([r[0], r[1], r[2], r[3] - 34], nb, ka);
      text('A ball on a hill runs off', r[0] + r[2] * 0.25, r[1] + r[3] + 12, { role: 'small', size: 21, weight: 600, color: C.red, align: 'center', alpha: ka });
      text('A marble in a bowl comes back', r[0] + r[2] * 0.75, r[1] + r[3] + 12, { role: 'small', size: 21, weight: 600, color: C.heroText, align: 'center', alpha: ka }); }
    noteBox(t, Q.v + 1.2, 1200, 600, 640, { label: 'What you feel', head: 'Held, not pushed', body: 'Your fingertip settles into the middle of the button and stays there under a flick, with ' + Math.round((b02_gvWide() - 1) * 100) + ' % more of it in contact.' });
    verdict(t, Q.v, 1200, 935, { from: (b02_gvSide(0) * 100).toFixed(1), to: (-b02_gvSide(1 / Q.Rg) * 100).toFixed(1), unit: '%', label: 'Push at the pad\'s edge: outward → inward', who: ['Out', 'In'], rivalCol: 'grey', size: 100, maxW: 640, net: false });
    source(t, 'Derived (the shape chapter\'s model): crown R 30 mm across, groove R 18 mm cut into it, pad edge 7 mm out: sin of the surface\'s lean there, 22.7 % out vs 15.4 % in. Contact width for the same press, pad R 8 mm: √(0.158 / 0.103) = 1.24.', { t0: 1.6, maxW: 1080, y: 977 });
  }
});

/* ============================== 6. b02_flush: Ceiling-facing cutouts, flush walls (#48; flat-base #1) ==============================
   His notes on clk_front's right half: (i) it wasn't clear it was a second demonstration, not an alternative to the
   left; (j) show how some mice get it wrong, with larger gaps than there should be, and how we get it right; (k) show
   why the cutouts face the ceiling or the wall. One cut across the right half at the fingertips, three ways to finish
   the button's edge, the same press on each. */
const B02_FX = { press: { down: 0.2, hold: 0.7, up: 0.25 }, p1: 1.9, mo1: [3.25, 0.7], p2: 4.4, mo2: [5.55, 0.7], p3: 6.45, v: 6.6, fu: 15.0 };
S({
  id: 'b02_flush', ch: 'click', theme: 'paper', title: 'Ceiling-facing cutouts, flush walls', settle: 11, ideas: [48],
  replaces: [],
  src: ['clk_brock', 'clk_gt01', 'b02_lamotte'],
  answers: [
    ['for the right visualization, it genuinely took me so long to realize that you weren\'t demonstrating an alternative to the the left demonstration', 'Its own slide now, after the flat front, with its own rivals: the three ways to finish the button\'s edge are listed on the right and light up as each is pressed, the first two marked as faults'],
    ['you need to show how some mice do that concept wrong to create larger gaps than there should be and how we do it right', 'Two wrong ways with the same press: a cut down the side whose gap closes on the ring finger, and a cut on top with the wall level with the button at rest, so a click opens a 0.46 mm step and a gap under the finger; then Theseus\'s wall, level with the pressed button: flush at the click'],
    ['this is also an amazing opportunity to demonstrate why the cutouts are ceiling or wall facing', 'The cut moves from the side to the top in place: on the side its gap faces across the button\'s motion and every click closes it; on top it faces along the motion and nothing closes (Brock\'s doc: ceiling-facing was voted 3× more popular than sideways at last year\'s Peripheral Awards)'],
    ['(#48) shoulder walls flush to the triggers when actuated; a happy medium, raised too high is as bad', 'The wall is set to the pressed height at the fingertips (0.46 mm under the button\'s rest height), so at the click it is flush; the footnote says the button stands that much proud at rest (a question for Brock in the report: pressed height or halfway)']
  ],
  sfx: [[pressCross(B02_FX.p1, B02_FX.press, 0.7), 'click'], [pressCross(B02_FX.p2, B02_FX.press, 0.7), 'click'], [pressCross(B02_FX.p3, B02_FX.press, 0.7), 'click']],
  draw: t => {
    const Q = B02_FX, F = B02_FL, D = Q.press, Dl = Object.assign({}, D, { hold: 99 });
    header(t, 'Ceiling-facing cutouts, flush walls');
    captions(t, [[0.5, 'Cut the button\'s edge down the side of the mouse and its gap faces the wall, across the way the button moves.'],
      [Q.p1 - 0.1, 'So every click closes it, and a ring finger resting across it gets pinched.'],
      [Q.mo1[0], 'Cut it on top and nothing closes. But the default way sets the wall level with the button at rest, so a click sinks the button below it.'],
      [Q.mo2[0], 'Theseus sets the wall level with the button pressed: at the click, the surface under your finger is flush.']]);
    const kC = ep(t, Q.mo1[0], Q.mo1[0] + Q.mo1[1]), kW = ep(t, Q.mo2[0], Q.mo2[0] + Q.mo2[1], E.io3);
    const pr = Math.max(pressCurve(t, Q.p1, D), pressCurve(t, Q.p2, D), pressCurve(t, Q.p3, Dl));
    const box = [80, 270, 1120, 620], kd = ep(t, 0.85, 1.45);
    let R = null, RW = null;
    const est = establish(t, 0, box, { view: 'front', hi: ['trigR'], col: 'ink', focus: [-44, -30, 40, 28], hold: 0.4, dur: 1.0, locator: 'tr', dimFill: 1, fade: 0.15,
      mouse: { lit: ep(t, 0.12, 0.55) * (1 - kd), alpha: 1 - 0.94 * kd },
      draw: () => {
        G.save(); G.globalAlpha *= kd;
        if (kC < 1) RW = b02_flushMM({ face: 'wall', press: pr, shellA: 1 - kC, lit: C.ink });
        if (kC > 0) { G.save(); G.globalAlpha *= kC; R = b02_flushMM({ face: 'ceiling', wall: kW, press: pr, lit: C.ink }); G.restore(); }
        /* the middle finger's pad across the button's outer edge: it rides the button down and wraps any step */
        const S0 = kC < 0.5 ? RW : R, mk = S0 && S0.step != null && S0.step > 0.05 && pr > 0.6 ? [F.uE - 0.8, F.uE + F.gap * F.ex + 2.4, C.red] : null;
        if (S0) { G.save(); G.scale(-1, 1); b02_fingerEndMM({ cx: Q.fu, base: S0.top(Q.fu), sink: 0.3, surf: S0.top, w: 15.5, h: 12.5, mark: mk }); G.restore(); }
        G.restore();
      } });
    const P = (u, y) => est.P(-u, -y), s = est.s;
    /* the ring finger, lying against the side across the seam */
    { const uS = b02_flUat(F.ySeam) + 0.15, pS = P(uS, F.ySeam - 0.3);
      G.save(); G.beginPath(); G.rect(box[0], box[1], box[2], box[3]); G.clip();
      finger(pS[0], pS[1], -Math.PI / 2, { s, press: kC < 0.5 ? pr * 0.6 : 0.2, view: 'end', alpha: kd });
      G.restore();
      /* the pinch: the slot closing on the skin */
      if (RW && kC < 0.5) {
        const kp = ep(pr, 0.55, 0.95) * (1 - kC * 2), a = P(...RW.seam), b = P(...RW.seamLow);
        if (kp > 0) { line(a[0] - 18, a[1], a[0] + 4, a[1], { color: C.red, w: 4, alpha: kp }); line(b[0] - 18, b[1], b[0] + 4, b[1], { color: C.red, w: 4, alpha: kp }); }
        faultTag(t, Q.p1 + 0.35, [a[0] - 8, (a[1] + b[1]) / 2], 'Closes on your ring finger', { to: [a[0] + 150, a[1] + 46], side: 'r', alpha: 1 - ep(t, Q.mo1[0] - 0.2, Q.mo1[0]) });
      }
      text('Cut across the mouse at your fingertips', box[0] + 36, box[1] + 44, { role: 'label', size: 20, color: C.mute, alpha: kd }); }
    /* the step at the click, measured between the pressed button's edge and the wall's */
    if (R && kC > 0.5) {
      const e = P(...R.edge), w = P(...R.wallTop), lv = P(...R.level), step = Math.max(0, R.step), ks = ep(pr, 0.6, 0.95), theseus = kW > 0.98;
      if (ks > 0 && t > Q.p2) {
        /* the pressed button's surface carried across the gap, dashed: the wall stands above it by the step, or meets it */
        const ext = P(F.uE + F.gap * F.ex + 2.0, b02_flYat(F.uE + F.gap * F.ex + 2.0) - F.tr * F.ex * clamp(pr));
        line(e[0], e[1], ext[0], ext[1], { color: theseus ? C.hero : C.red, w: 1.8, dash: [5, 4], alpha: ks });
        if (!theseus || t < Q.mo2[0]) {
          const xd = w[0] - 26;
          arrow(xd, (w[1] + lv[1]) / 2, xd, w[1] + 1, { color: C.red, w: 2, hs: 8, alpha: ks }); arrow(xd, (w[1] + lv[1]) / 2, xd, lv[1] - 1, { color: C.red, w: 2, hs: 8, alpha: ks });
          text(step.toFixed(2) + ' mm step', xd - 14, w[1] - 26, { role: 'num', size: 28, weight: 800, color: C.red, align: 'right', alpha: ks });
        } else text('Flush at the click', w[0] - 40, w[1] - 30, { role: 'num', size: 28, weight: 800, color: C.heroText, align: 'right', alpha: ks });
      }
    }
    scaleNote(box[0] + 36, box[1] + 80, 'Travel and gaps drawn ' + F.ex + '×', { t, t0: 1.6, size: 21 });
    if (R && kC > 0.5) { const kl = 1 - ep(t, Q.mo2[0] + 1.2, Q.mo2[0] + 1.5), bt = P(F.uE - 6, b02_flYat(F.uE - 6) - F.tr * F.ex * pr), wl = P(F.uE + F.gap * F.ex + 4.5, b02_flYat(F.uE + F.gap * F.ex + 4.5) - 1.0);
      callout(t, Q.mo1[0] + 0.5, bt, 'The button', { to: [bt[0] + 110, bt[1] + 110], side: 'r', color: C.ink2, tcolor: C.ink2, alpha: kl });
      callout(t, Q.mo1[0] + 0.7, wl, 'The wall', { to: [wl[0] - 90, wl[1] + 160], side: 'l', color: C.ink2, tcolor: C.ink2, alpha: kl }); }
    /* the three ways to finish the edge, lit as each is pressed */
    { const x = 1290, y = 300, w = 550, ka = ep(t, 0.3, 0.7);
      text('Three ways to finish the edge', x, y, { role: 'label', size: 21, color: C.mute, alpha: ka });
      const rows = [['Cut down the side', 'Pinches your ring finger', Q.p1, 0, Q.mo1[0], C.red],
        ['Cut on top, wall level at rest', F.tr.toFixed(2) + ' mm step at the click', Q.p2, Q.mo1[0], Q.mo2[0], C.red],
        ['Cut on top, wall level when pressed', 'Flush at the click: Theseus', Q.p3, Q.mo2[0], 99, C.heroText]];
      rows.forEach(([h, r, tp, t0, t1, col], i) => {
        const yy = y + 52 + i * 98, on = t >= t0 && t < t1, kr = ep(t, tp + 0.45, tp + 0.8);
        if (on) rr(x - 16, yy - 34, w, 88, 6, null, i === 2 ? C.hero : C.hair, i === 2 ? 2 : 1.5, ka);
        text((i + 1) + '  ' + h, x, yy, { role: 'small', size: 25, weight: 700, color: on ? C.ink : C.mute, alpha: ka, maxW: w - 30 });
        if (kr > 0) text(r, x + 30, yy + 34, { role: 'small', size: 24, weight: 600, color: col, alpha: kr, maxW: w - 60 });
      }); }
    text('A sliding fingertip feels a bump only 1 to 3 µm high (LaMotte). This step is ' + Math.round(F.tr * 1000) + ' µm.', 1290, 660, { role: 'small', size: 22, weight: 600, color: C.mute, alpha: ep(t, Q.p2 + 0.8, Q.p2 + 1.2), maxW: 540 });
    verdict(t, Q.v, 1290, 925, { from: F.tr.toFixed(2), to: '0.00', unit: 'mm', label: 'Step under your finger at the click', better: 'lower', who: ['Level at rest', 'Theseus'], rivalCol: 'grey', size: 112, maxW: 550 });
    source(t, 'Derived: the travel at your fingertip at the click = 0.35 mm at the switch (GT01) × 41.9 / 31.9 mm from the bend line = 0.46 mm, so Theseus\'s wall sits 0.46 mm under the button at rest. Gaps 0.35 mm on top, 0.6 mm on the side; section simplified. Ceiling-facing: Brock\'s doc.', { t0: 1.6, maxW: 1160, y: 977 });
  }
});

/* ============================== 7. b02_direct: Direct Drive Actuation (#2) ==============================
   His notes on arc (7/10): the tensioner didn't look accurate; no "pts" anywhere; important, demonstrate and sell it
   better; he thinks it should be 20 % faster. The model, checked (PROGRESS, Models): the trigger turns about the crown of
   its bridge, so the post's foot moves on an arc that is 20.0° off upright at the plunger (clickGeo: crown (-1.4, 0.2),
   foot (30, 11.63)). An upright switch takes the part of that travel along its axis, cos 20° = 94.0 %; the rest, sin 20° =
   34.2 % of the travel, runs across its axis: the post scrubs over the plunger's cap (a share of travel, not of force).
   The GT01's housing turns the switch 20°, onto the arc: 100 % along, 0 % across, and the click comes 1 − cos 20° = 6.0 %
   sooner at the same press speed. Not 20 %: the across part is at right angles to the axis, so turning the switch only
   lifts the along part from 94 % to 100 %. */
const B02_DD = { press: { down: 0.22, hold: 0.55, up: 0.25 }, p1: 2.0, p2: 3.15, mo: [4.3, 1.0], p3: 5.75, p4: 6.9, v: 7.45, pk: 0.68 };
/** the classroom version (OpenStax §7.1, Fig. 7.2): a lawn mower pushed along its handle; only F cos θ moves it */
function b02_mower(x, y, s, th, push, a) {
  if (a <= 0.003) return;
  const ed = inkA(TH ? 0.6 : 0.55), body = TH ? C.panel : C.hair, mx = x + push * 18 * s;
  line(x - 190 * s, y, x + 90 * s, y, { color: inkA(0.4), w: 2, alpha: a });
  rr(mx - 34 * s, y - 34 * s, 68 * s, 22 * s, 5, body, ed, 2, a);
  for (const wx of [mx - 22 * s, mx + 22 * s]) circle(wx, y - 9 * s, 9 * s, { fill: body, color: ed, w: 2, alpha: a });
  const hx = mx - 30 * s, hy = y - 30 * s, L = 110 * s, gx = hx - Math.cos(th) * L, gy = hy - Math.sin(th) * L;
  line(gx, gy, hx, hy, { color: ed, w: 4, alpha: a });
  /* the push along the handle (ink), its part along the ground (blue: moves it), its part into the ground (red: wasted) */
  const F = 70 * s, fx = Math.cos(th) * F, fy = Math.sin(th) * F, ax = gx - 8 * s, ay = gy - 26 * s;
  arrow(ax, ay, ax + fx, ay + fy, { color: C.ink, w: 3, hs: 10, alpha: a });
  arrow(ax, ay, ax + fx, ay, { color: C.hero, w: 3, hs: 10, alpha: a });
  arrow(ax + fx, ay, ax + fx, ay + fy, { color: C.red, w: 3, hs: 10, alpha: a });
}
/** the post's travel at the plunger, split along the switch's axis and across it, in a loupe. dirM: the travel's
   direction (stage, unit); dirA: the switch's axis (stage, unit, toward the plunger's travel) */
function b02_splitLoupe(t, x, y, r, dirM, dirA, o = {}) {
  const a = o.a == null ? 1 : o.a; if (a <= 0.003) return;
  circle(x, y, r, { fill: C.panel, color: inkA(0.5), w: 1.5, alpha: a });
  const L = r * 1.35 * (o.k == null ? 1 : o.k), al = dirM[0] * dirA[0] + dirM[1] * dirA[1];
  const P0 = [x - dirM[0] * L * 0.45, y - dirM[1] * L * 0.45], P1 = [P0[0] + dirM[0] * L, P0[1] + dirM[1] * L], Pa = [P0[0] + dirA[0] * L * al, P0[1] + dirA[1] * L * al];
  G.save(); G.beginPath(); G.arc(x, y, r - 2, 0, TAU); G.clip();
  /* the switch's axis, dashed through the loupe */
  line(x - dirA[0] * r, y - dirA[1] * r, x + dirA[0] * r, y + dirA[1] * r, { color: inkA(0.35), w: 1.5, dash: [5, 5], alpha: a });
  if (L > 4) {
    arrow(P0[0], P0[1], P1[0], P1[1], { color: C.ink, w: 3.5, hs: 13, alpha: a });
    if (Math.abs(1 - al) > 0.004) { arrow(P0[0], P0[1], Pa[0], Pa[1], { color: o.alongCol || C.ink2, w: 3, hs: 11, alpha: a * 0.9 }); arrow(Pa[0], Pa[1], P1[0], P1[1], { color: C.red, w: 3, hs: 11, alpha: a }); }
  }
  G.restore();
  return { mid: [(Pa[0] + P1[0]) / 2, (Pa[1] + P1[1]) / 2], al };
}
S({
  id: 'b02_direct', ch: 'click', theme: 'night', title: 'Direct Drive Actuation', settle: 11, ideas: [2],
  replaces: ['arc'],
  src: ['clk_gt01', 'omronD2f', 'b02_osWork', 'clk_brock'],
  answers: [
    ['tensioner doesn\'t look accurate', 'The shared click section (clickMM, K1 after Brock\'s photos): the trigger\'s own arm clamped by one screw into a brass insert, the bridge thinning to its crown, square joints'],
    ['i dont like the use of the metrics "pts" or "points" anywhere', 'No pts or points anywhere: percentages of the travel, and the click\'s timing in percent'],
    ['this is a really important slide the concept is good but it needs to be demonstrated and sold better', 'Demonstrated: the finger presses the same trigger on an upright switch and on the GT01; the loupe splits the travel at the plunger along and across the switch, the across part scrubbing red; the lawn mower beside it. Sold in What you feel: no scrub, no wear in the guide, the click 6 % sooner'],
    ['i think direct drive means the peak theoretical reaction time should be 20% faster because 20% more of the force goes where you actually intend it', 'The slide says 6 % sooner and why not 20 %: the across part is at right angles to the axis, so turning the switch lifts the along part from cos 20° = 94 % to 100 %, not by 20 % (F31.2)'],
    ['(F39.2 check) the old "34.2 % sideways" as a share of force', 'Re-labelled as what it is: 34.2 % of the travel at the switch runs across its axis (sin 20°), a scrub over the plunger\'s cap; no claim of 34 % of the force']
  ],
  sfx: [B02_DD.p1, B02_DD.p2, B02_DD.p3, B02_DD.p4].map(p => [pressCross(p, B02_DD.press, 0.7), 'click']),
  draw: t => {
    const Q = B02_DD, D = Q.press;
    header(t, 'Direct Drive Actuation');
    captions(t, [[0.5, 'The trigger turns about the crown of its spring, so at the switch it moves on an arc, 20° off upright.'],
      [Q.p1 - 0.1, 'An upright switch only takes the part of that travel along its axis. A third of it runs across, scrubbing the post over the plunger.'],
      [Q.mo[0], 'The GT01\'s housing turns the switch 20°, onto the arc: all of the travel drives the plunger. That is Direct Drive Actuation.'],
      [Q.v + 0.4, 'Nothing scrubs the plunger, and the click lands 6 % sooner at the same press speed.']]);
    const tilt = ep(t, Q.mo[0], Q.mo[0] + Q.mo[1], E.io3), pr = Math.max(...[Q.p1, Q.p2, Q.p3, Q.p4].map(p => pressCurve(t, p, D))) * Q.pk;
    const box = [80, 270, 1080, 600], kd = ep(t, 0.95, 1.5);
    const est = establish(t, 0, box, { view: 'right', hi: ['trigL'], col: 'ink', focus: 'trigL', hold: 0.4, dur: 1.0, locator: 'tl', locW: 150, dimFill: 1, fade: 0.1,
      mouse: { lit: ep(t, 0.12, 0.55) * (1 - kd), alpha: 1 - 0.96 * kd } });
    /* the detail: the shared click section, at its own scale, as the camera arrives */
    const s = 12.5, ox = box[0] + 120 + 16 * s, oy = box[1] + 230;
    const o = drawClick(ox, oy, s, { press: pr, tilt, ghost: ep(t, Q.mo[0], Q.mo[0] + 0.5) * (tilt > 0.02 ? 1 : 0), pivot: ep(t, 1.4, 1.8) * kd, arc: ep(t, 1.6, 2.1) * kd, accent: C.ink2, alpha: Math.max(0.004, kd),
      gt01: p => clk_gt01MM({ press: p, clear: false, board: false }) });
    if (kd > 0.5) callout(t, 1.5, o.rc, 'Turns about the crown', { to: [o.rc[0] - 30, o.rc[1] + 100], side: 'l', elbow: o.rc[0], color: C.ink2, tcolor: C.ink2 });
    /* the finger presses the front of the trigger, riding it down */
    if (o.trigTop) { const tp = o.trigTop(37), tq = o.trigTop(38), ang = Math.atan2(tq[1] - tp[1], tq[0] - tp[0]) - 0.05, fa = ep(t, 1.5, 1.9);
      finger(tp[0], tp[1] + (1 - ep(t, 1.5, 1.95, E.out3)) * -110, ang, { s, press: pr / Q.pk, view: 'side', alpha: fa * kd, len: 24 }); }
    /* at the plunger: the travel split along the switch's axis and across it (the numbers from the arc's angle at rest) */
    const lx = 1400, ly = 420, lr = 110, kl = ep(t, Q.p1 - 0.2, Q.p1 + 0.2) * kd, mis = (o.geo && o.geo.mis) || 0;
    if (o.footW && kl > 0) {
      line(o.footW[0], o.footW[1], lx - lr, ly + 20, { color: C.faint, w: 1.2, dash: [4, 4], alpha: kl });
      const ax = o.axisDir, cm = Math.cos(mis), sm = Math.sin(mis), mvd = [ax[0] * cm + ax[1] * sm, -ax[0] * sm + ax[1] * cm];
      b02_splitLoupe(t, lx, ly, lr, mvd, [ax[0], ax[1]], { a: kl, k: 0.35 + 0.65 * ep(pr / Q.pk, 0.1, 0.8) });
      text('At the plunger', lx, ly - lr - 22, { role: 'label', size: 21, color: C.mute, align: 'center', alpha: kl });
      const across = Math.abs(Math.sin(mis)) * 100, along = Math.cos(mis) * 100, rv = across > 0.05;
      text(across.toFixed(1) + ' %', lx, ly + lr + 48, { role: 'num', size: 34, weight: 800, color: rv ? C.red : C.heroText, align: 'center', alpha: kl });
      text('of the travel, across the switch', lx, ly + lr + 78, { role: 'label', size: 20, color: C.mute, align: 'center', alpha: kl, maxW: 600 });
      text(along.toFixed(1) + ' % along it' + (rv ? '' : ': the click 6 % sooner'), lx, ly + lr + 108, { role: 'label', size: 20, color: rv ? C.mute : C.heroText, align: 'center', alpha: kl, maxW: 520 });
    }
    /* the classroom version: the lawn mower (OpenStax §7.1, Fig. 7.2) */
    { const r = demoPanel(t, 0.2, [1200, 668, 640, 170], { label: 'The classroom version', src: 'OpenStax §7.1', pad: 22 }), ka = ep(t, 0.4, 0.8);
      const push = (pressCurve(t, Q.p1, D) + pressCurve(t, Q.p2, D) + pressCurve(t, Q.p3, D) + pressCurve(t, Q.p4, D)) * 0.5;
      b02_mower(r[0] + 420, r[1] + r[3] + 6, 0.62, 0.62, push, ka);
      text('Push along the handle:', r[0], r[1] + 26, { role: 'small', size: 22, weight: 600, color: C.ink2, alpha: ka });
      text('only F cos θ moves it', r[0], r[1] + 56, { role: 'small', size: 22, weight: 700, color: C.heroText, alpha: ka }); }
    verdict(t, Q.v, 1200, 950, { from: '34.2', to: '0.0', unit: '%', label: 'Travel at the switch running across it', better: 'lower', who: ['Upright', 'Theseus'], rivalCol: 'grey', size: 96, maxW: 640 });
    source(t, 'Derived from the shared click section: the post\'s arc at the plunger is 20.0° off upright (crown to post foot 31.4 mm forward, 11.4 mm down): across = sin 20° = 34.2 % of the travel, along = cos 20° = 94.0 %, so turning the switch makes the click 6 % sooner, not 20 %. Upright switches mount flat (Omron D2F).', { t0: 1.6, maxW: 1080, y: 977 });
  }
});

/* ============================== 8. b02_wedge: One flat board, no extra parts (#2, the GT01 style) ==============================
   His note on clk_wedge (4/10): important concept, very poor execution; it could sit closer to the less-parts-is-better
   demonstration (b07_tolerance) and come after the problem with more parts is shown. Brock's own reason: "ideally gateron
   gt01 style so the pcb can still just one piece (as that helps with design, assembly strength and cost massively)". The
   rival is the mouse #2 names: Endgame Gear angles its switches by putting them "on their own PCBs screwed into the top
   shell", "connected through a 3-pin connector" (TechPowerUp, OP1 8K). Shown in the shared click section: that switch's
   own board, its screw into the shell and its connector and cable come in one by one; then they go, and the GT01's housing
   holds the 20° on the one flat board. No tolerance figures are claimed here: the stack-up law is b07's slide. */
const B02_WG = { press: { down: 0.22, hold: 0.55, up: 0.25 }, adds: [1.5, 2.3, 3.1], p1: 3.85, mo: [5.0, 1.1], p2: 6.5, v: 7.1 };
/** the rival's extra parts in clickMM's frame (mm, y down, front right): the switch on its own small board, turned 20°
   onto the arc, hung from the top shell by a boss and a screw, and a cable down to the main board. k: [board, screw,
   cable] 0..1 each (dropping in); press: the switch's own travel */
function b02_subBoardMM(k, press, a) {
  const K = CKG, F0 = K.foot, rad = Math.atan2(F0[1] - K.rc[1], F0[0] - K.rc[0]), yB0 = F0[1] + K.gtApex[1], yB = yB0 + 6.5, red = C.red;
  G.save(); G.globalAlpha *= a;
  /* the shared section's flat board is Theseus's; the rival's main board sits lower, under its switch board */
  G.fillStyle = C.bg; G.fillRect(F0[0] - 13.6, yB0 - 0.4, 25.2, 2.2);
  pcbSec(F0[0] - 13, F0[0] + 11, yB, 1.2, { brk: [1, 1], rival: true });
  /* the switch and its board, turned with the arc, the plunger under the post */
  xsave(); xmove(F0[0], F0[1]); xturn(rad); xmove(-SWG.px, -SWG.top);
  if (k[0] > 0.003) {
    xsave(); xmove(0, -(1 - k[0]) * 9); ga(a * k[0]);
    swMM({ press, accent: C.ink2 });
    pcbSec(-3.0, 15.8, 1.7, 1.2, { brk: [0, 0], rival: true });
    xrest();
  }
  /* the boss and screw holding that board up to the shell (behind the section: dashed) */
  if (k[1] > 0.003) {
    xsave(); xmove(0, -(1 - k[1]) * 9); ga(a * k[1]);
    G.setLineDash([lw(5), lw(4)]); G.beginPath(); G.rect(14.4, -12.5, 2.6, 14.2); G.strokeStyle = inkA(0.55); G.lineWidth = lw(1.4); G.stroke(); G.setLineDash([]);
    G.beginPath(); G.rect(15.1, -3.0, 1.2, 6.6); G.fillStyle = TH ? C.comp : C.faint; G.fill(); G.strokeStyle = inkA(0.6); G.lineWidth = lw(1); G.stroke();
    G.beginPath(); G.rect(14.5, 2.9, 2.4, 0.9); G.fill(); G.stroke();
    xrest();
  }
  const tip = SP(15.7, -12.5), conn = SP(-1.5, 3.4);
  xrest();
  /* the connector under the small board and the cable down to the main board */
  if (k[2] > 0.003) {
    const c0 = conn, P = (x, y) => SP(x, y);
    xsave(); ga(a * k[2]);
    const cx = F0[0] - 7.6, cy = F0[1] + 4.3;
    G.beginPath(); G.moveTo(cx, cy); G.bezierCurveTo(cx - 4, cy + 3, cx - 7, yB - 4, cx - 9, yB); G.strokeStyle = TH ? '#3a3a3c' : '#c8c8cc'; G.lineWidth = lw(3.2); G.stroke();
    G.beginPath(); G.rect(cx - 1.2, cy - 0.6, 2.6, 1.6); G.rect(cx - 10.6, yB - 1.6, 3.2, 1.6); G.fillStyle = TH ? C.comp : C.faint; G.fill(); G.strokeStyle = inkA(0.6); G.lineWidth = lw(1); G.stroke();
    xrest();
  }
  G.restore();
  return { board: SP(F0[0] + 6, F0[1] + 6), screw: tip, cable: SP(F0[0] - 13, yB - 3) };
}
S({
  id: 'b02_wedge', ch: 'click', theme: 'paper', title: 'One flat board, no extra parts', settle: 10.5, ideas: [2],
  replaces: ['clk_wedge'],
  src: ['b02_tpuOp1', 'clk_gt01', 'clk_brock'],
  answers: [
    ['important concept, very poor execution', 'Rebuilt as a demonstration in the shared click section: the parts another mouse needs to angle its switch come in one by one, then go'],
    ['could be closer to the less parts is better demonstration', 'It makes the same case as b07_tolerance (fewer parts), and says so; I recommend the integrator places it right after b07_tolerance (hand-off in the report)'],
    ['show after youve shown the problem with having more parts', 'Within the slide the problem comes first (the OP1 8K\'s own board, screw, connector and cable); the one-board answer after. Placed after b07_tolerance the law comes first too'],
    ['(clk_wedge\'s old claim "I will publish both")', 'Dropped; and no tolerance numbers are claimed here (the law and its numbers are b07\'s)']
  ],
  sfx: [[B02_WG.adds[0] + 0.25, 'tick'], [B02_WG.adds[1] + 0.25, 'tick'], [B02_WG.adds[2] + 0.25, 'tick'], [pressCross(B02_WG.p1, B02_WG.press, 0.7), 'click'], [pressCross(B02_WG.p2, B02_WG.press, 0.7), 'click']],
  draw: t => {
    const Q = B02_WG, D = Q.press;
    header(t, 'One flat board, no extra parts');
    captions(t, [[0.5, 'To turn its switches onto the arc, the OP1 8K puts each on its own board in the top shell.'],
      [Q.adds[0] - 0.1, 'That takes a second board, a screw into the shell, and a connector with a cable down to the main board.'],
      [Q.mo[0], 'The GT01\'s housing holds the 20° itself, so it solders straight onto Theseus\'s one flat board.'],
      [Q.v + 0.4, 'Fewer parts to build, align and come loose: one board, assembled in one pass.']]);
    const kG = ep(t, Q.mo[0], Q.mo[0] + Q.mo[1], E.io3), kx = Q.adds.map(a => ep(t, a, a + 0.45, E.out3)), out = 1 - ep(t, Q.mo[0], Q.mo[0] + 0.6);
    const pr = Math.max(pressCurve(t, Q.p1, D), pressCurve(t, Q.p2, D)) * 0.68;
    const box = [80, 270, 1080, 610], kd = ep(t, 0.95, 1.5);
    establish(t, 0, box, { view: 'right', hi: ['board'], col: 'ink', focus: 'trigL', hold: 0.4, dur: 1.0, locator: 'tl', locW: 150, dimFill: 1, fade: 0.1,
      mouse: { show: ['board'], lit: ep(t, 0.12, 0.55) * (1 - kd), alpha: 1 - 0.96 * kd } });
    const s = 12.5, ox = box[0] + 130 + 16 * s, oy = box[1] + 200;
    let R = null;
    const o = drawClick(ox, oy, s, { press: kG > 0.5 ? pr : 0, tilt: kG > 0.5 ? 1 : 0.9999, accent: C.ink2, alpha: Math.max(0.004, kd),
      gt01: kG > 0.001 ? (p => { xsave(); xmove(0, -(1 - kG) * 14); ga(kG * kd); clk_gt01MM({ press: p, clear: false, board: false }); xrest(); }) : null });
    /* the rival's extra parts, in the same frame, dropping in one by one; going when the GT01 arrives */
    part(ox, oy, s, () => { R = b02_subBoardMM(kx, kG > 0.5 ? 0 : pr, kd * out); });
    /* the finger on the trigger */
    if (o.trigTop) { const tp = o.trigTop(37), tq = o.trigTop(38), ang = Math.atan2(tq[1] - tp[1], tq[0] - tp[0]) - 0.05, fa = ep(t, 1.4, 1.8);
      finger(tp[0], tp[1] + (1 - ep(t, 1.4, 1.85, E.out3)) * -110, ang, { s, press: pr / 0.68, view: 'side', alpha: fa * kd, len: 24 }); }
    /* each extra part named as it lands, with its count */
    if (R) {
      const names = ['Its own board', 'A screw into the shell', 'A connector and cable'], at = [R.board, R.screw, R.cable], to = [[R.board[0] + 170, R.board[1] + 40], [R.screw[0] + 190, R.screw[1] - 30], [R.cable[0] - 120, R.cable[1] + 120]];
      names.forEach((nm, i) => { if (kx[i] > 0.02 && out > 0.01) faultTag(t, Q.adds[i] + 0.2, at[i], (i + 1) + '  ' + nm, { to: to[i], side: i === 2 ? 'l' : 'r', alpha: out }); });
    }
    if (kG > 0.98) fixTag(t, Q.mo[0] + Q.mo[1], o.footW || [ox + 30 * s, oy + 14 * s], 'The GT01: 20° in its own housing', { to: [ox + 52 * s, oy + 4 * s], side: 'r' });
    /* the count, as it builds, then gone */
    { const n = kx.filter(v => v > 0.5).length * (kG > 0.5 ? 0 : 1), x = 1220, y = 380, a = ep(t, Q.adds[0], Q.adds[0] + 0.3);
      text('Extra parts to angle one switch', x, y, { role: 'label', size: 21, color: C.mute, alpha: a });
      text(String(n), x, y + 112, { role: 'd1', size: 120, weight: 800, color: n ? C.red : C.heroText, alpha: a });
      text(kG > 0.5 ? 'Theseus: the switch on the one board' : 'OP1 8K: per its teardown', x + 110, y + 100, { role: 'small', size: 24, weight: 600, color: kG > 0.5 ? C.heroText : C.mute, alpha: a, maxW: 480 }); }
    noteBox(t, Q.v + 1.3, 1220, 560, 600, { label: 'What it buys', head: 'One board, one pass', body: 'Nothing between the switch and the board to align, loosen or fail: lighter, stronger and cheaper to build.' });
    verdict(t, Q.v, 1220, 950, { from: '3', to: '0', label: 'Extra parts per switch', better: 'lower', who: ['OP1 8K', 'Theseus'], size: 110, maxW: 600, net: false });
    source(t, 'OP1 8K: "The main and side buttons sit on their own PCBs screwed into the top shell", the main board "connected through a 3-pin connector" (TechPowerUp). Counted per switch as three kinds: a board, its screws, the connector and cable. The GT01 render: Gateron.', { t0: 1.6, maxW: 1080, y: 977 });
  }
});

/* ============================== 9. b02_tensioner: The bridge tensioner (#50, #4) ==============================
   The old slide (8/10) carried over with its demonstration (K1's frame model, clk_lever / clk_ribbon, square joints), and
   the model auditor's three musts (M-b02-3): (a) 26.9 → 7.7 gf is the spring's part only: the GT01's 55 gf at the plunger
   adds 41.3 gf at the fingertip (30 / 40), so the click the finger feels goes 68.2 → 49.0 gf (−28 %), the verdict; (b) the
   top row is the Starlight X's layout (a flat plane, no bridge) modelled in the same resin, said on the row and in the
   foot line (its own composite is stiffer and unpublished); (c) the dimensions are the example tensioner. Brock's three
   notes stand answered: "as seen in Starlight X" on top, "proposed solution" below, square joints, no fillets. */
const B02_TN = { sw: 55 * CLK_TN.XS / CLK_TN.XP, v: 8.6 };
S({
  id: 'b02_tensioner', ch: 'click', theme: 'night', title: 'The bridge tensioner', settle: 11, ideas: [50, 4],
  replaces: ['tensioner'],
  src: [SIM_MAT.ppcf.src, 'clk_gt01', 'clk_brock'],
  answers: [
    ['reference the starlight x\'s stufd clicks from using such a stiff composite materiak with no bridge', 'The top row is the Starlight X\'s layout, a flat tensioner with no bridge in a stiff composite, and the first caption says its clicks come stiff (Brock\'s observation: no review found saying so, FILLS b02-2)'],
    ['market top as "as seen in starlight x" or something like that, and bottom as proposed solution', 'Top: "As seen in Starlight X"; bottom: "Proposed solution"'],
    ['also the rounding where the bridges meets the trigger looks bad, ie needs to connect without filets', 'The shared clk_ribbon meets the block and the trigger square, with mitred joints and no fillet'],
    ['(M-b02-3) the spring\'s part vs the click the finger feels; the Starlight X\'s resin; the example dimensions', 'The readouts say "the spring\'s part"; the verdict is the felt click, 68.2 → 49.0 gf, GT01 included; the row and the foot line say same resin, Starlight X\'s own is stiffer and unpublished; "the example tensioner" in the foot line']
  ],
  sfx: [[CLK_TT.p1, 'click'], [CLK_TT.f1, 'click']],
  draw: t => {
    const rF = clk_ten('flat', 'ppcf'), rB = clk_ten('bridge', 'ppcf'), cF = rF.clk, cB = rB.clk, TT = CLK_TT;
    const sameF = cF.cS * cB.F, ratio = cF.F / cB.F;
    header(t, 'The bridge tensioner');
    captions(t, [[0.6, 'As seen in Starlight X: a flat tensioner with no bridge in a stiff composite, so it bends all along and the click comes stiff.'],
      [3.0, `The same ${cB.gf.toFixed(1)} gf on both: the bridge reaches the click. The flat plane has moved ${sameF.toFixed(2)} of 0.35 mm.`],
      [5.0, `To reach the click the flat plane needs ${cF.gf.toFixed(1)} gf, ${ratio.toFixed(1)} times as much, and it bends hardest at its screw.`],
      [8.0, `The bridge: an arch that thins at its crown, so it bends there, and the click your finger feels drops from ${(cF.gf + B02_TN.sw).toFixed(1)} to ${(cB.gf + B02_TN.sw).toFixed(1)} gf.`]]);
    const wy = CLK_TOP, wh = CLK_BOT - wy, rowH = wh / 2, X0 = LM, XW = 1360, xr = 1480, kc = ep(t, TT.c0, TT.c1, E.cam);
    demoWindow(LM, wy, RM - LM, wh, ep(t, 0.2, 0.7), {});
    line(LM + 24, wy + rowH, RM - 24, wy + rowH, { color: C.hair, w: 1.2, alpha: ep(t, 0.6, 1.0) });
    /* the camera: the crown (x = 4 mm) slides from 380 to 720 px while the scale grows from 25 to 62 px per mm */
    const s = 25 * Math.pow(62 / 25, kc), X4 = lerp(X0 + 300, X0 + 640, kc);
    /* stress is coloured against the hotter of the two peaks, each at its own click (Brock, F18.6: "scale to peak"), so the
       peak reads red; the scale says where PP-C-20A breaks (120 MPa, F12.12), more than ten times higher (F9.23) */
    const sref = Math.max(cF.sig, cB.sig), kref = cB.kmax * cB.F;
    const rows = [
      { r: rF, c: cF, name: 'As seen in Starlight X', spec: 'Flat, no bridge, same resin', F: cB.F * ep(t, TT.p0, TT.p1) + (cF.F - cB.F) * ep(t, TT.f0, TT.f1), hero: false, t0: 0.5 },
      { r: rB, c: cB, name: 'Proposed solution', spec: 'A bridge, 0.8 to 0.4 mm', F: cB.F * ep(t, TT.p0, TT.p1), hero: true, t0: 0.8 }
    ];
    rows.forEach((R, i) => {
      const top = wy + i * rowH, cy = top + 200, P = p => [X4 + (p[0] - 4) * s, cy - p[1] * s], ka = ep(t, R.t0, R.t0 + 0.7); P.s = s;
      const sc = R.F * TT.ex, tr = R.c.cS * R.F, clicked = tr >= CLK_TN.pre - 1e-6;
      clipped(X0 + 2, top + 2, XW, rowH - 4, () => {
        G.save(); G.translate((1 - E.out3(ka)) * -30, 0);
        /* the parts round it, the tensioner (stress-coloured), then the block and the screw over its clamped end: the band meets
           the block and the trigger square, with no fillet (Brock, F27 tensioner) */
        const L = clk_lever(R.r, P, sc, { alpha: ka, part: 'back' });
        clk_ribbon(R.r, P, sc, R.F / sref, { alpha: ka });
        Object.assign(L, clk_lever(R.r, P, sc, { alpha: ka, part: 'front' }));
        /* wide-shot labels, the click lamp, the pointer on the fingertip */
        const kw = ka * (1 - ep(t, TT.c0, TT.c0 + 0.5));
        if (kw > 0.01 && L.sw) {
          text('One screw', L.screw[0], L.screw[1] + 34, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: kw });
          if (!i && L.cut) text('Rear cutout', L.cut[0], L.cut[1] - 16, { role: 'label', size: 19, color: C.faint, align: 'center', alpha: kw });
          clk_lamp(L.sw[0] + 26, L.sw[1] - 4, 'Click', clicked, R.hero ? C.hero : C.ink, kw);
        }
        if (L.tip) {
          const kp = ep(t, 1.5, 2.2, E.cam), st = [L.tip[0] + 150, L.tip[1] - 130];
          cursorPtr(lerp(st[0], L.tip[0], kp), lerp(st[1], L.tip[1], kp), { a: ep(t, 1.3, 1.7), s: 1.1, press: prog(t, 2.25, 2.75) > 0 && prog(t, 2.25, 2.75) < 1 ? prog(t, 2.25, 2.75) : 0 });
        }
        /* up close: where it bends. Curvature along the tensioner, both rows on one scale, so equal areas mean an equal bend */
        const kk = ep(t, TT.kap, TT.kap + 0.8);
        if (kk > 0) {
          const base = cy + 116, H = 60, n = R.r.model.nStrip, pts = [];
          for (let e = 0; e < n; e++) { const xm = CLK_TN.S * (e + 0.5) / n; pts.push([P([xm, 0])[0], base - H * R.c.kap[e] * R.F / kref * kk]); }
          const x0 = P([0, 0])[0], x1 = P([CLK_TN.S, 0])[0], col = R.hero ? C.hero : C.ink2;
          G.save(); G.beginPath(); G.moveTo(x0, base); pts.forEach(p => G.lineTo(p[0], p[1])); G.lineTo(x1, base); G.closePath(); G.fillStyle = rgba(R.hero ? C.hero : '#9a9993', R.hero ? 0.28 : 0.22); G.fill(); G.restore();
          poly([[x0, base]].concat(pts, [[x1, base]]), { color: col, w: 2.5, alpha: kk });
          line(x0, base, x1, base, { color: C.faint, w: 1.2, alpha: kk });
          const ha = P([R.c.half.a, 0])[0], hb = P([R.c.half.b, 0])[0];
          line(ha, base + 12, hb, base + 12, { color: col, w: 3, alpha: kk }); line(ha, base + 6, ha, base + 18, { color: col, w: 2, alpha: kk }); line(hb, base + 6, hb, base + 18, { color: col, w: 2, alpha: kk });
          text('Bend along the tensioner', x0 - 18, base + 6, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kk });
          const hot = R.hero ? P([R.c.at, CLK_TN.rise + 0.2]) : P([0.25, 0.4]);
          callout(t, TT.kap + 0.3, hot, R.hero ? 'Bends at the crown' : 'Hardest at the screw', { to: [R.hero ? P([CLK_TN.S, 0])[0] + 70 : hot[0] + 110, cy - 96], side: 'r', color: col, tcolor: R.hero ? C.heroText : C.ink });
        }
        G.restore();
      });
      /* the readout: force at the fingertip, live, and the travel to the click */
      const kr = ep(t, R.t0 + 0.4, R.t0 + 0.9);
      G.save(); G.translate(0, (1 - E.out3(kr)) * 14);
      text(R.name, xr, cy - 118, { role: 'label', size: 22, color: R.hero ? C.heroText : C.ink, alpha: kr });
      text(R.spec, xr, cy - 84, { role: 'small', size: 25, color: C.mute, alpha: kr });
      /* the bridge keeps the flat plane's force beside its own once both have clicked (F16.1: before → after) */
      if (R.hero) clk_ba(t, xr, cy - 10, { before: (cF.F * CLK_GF + B02_TN.sw).toFixed(1), after: (R.F * CLK_GF + B02_TN.sw * clamp(tr / CLK_TN.pre)).toFixed(1), unit: 'gf', net: 'the felt click, GT01 included', netSize: 22, size: 72, k: ep(t, TT.f1, TT.f1 + 0.5), a: kr, hero: true });
      else clk_big(t, xr, cy + 4, null, (R.F * CLK_GF + B02_TN.sw * clamp(tr / CLK_TN.pre)).toFixed(1), 'gf', { size: 56, color: C.ink2, alpha: kr });
      if (!R.hero || t < TT.f1) text('At the fingertip, GT01 included', xr, cy + 40, { role: 'small', size: 21, weight: 600, color: C.faint, alpha: kr * (R.hero ? 1 - ep(t, TT.f1, TT.f1 + 0.3) : 1) });
      const by = cy + 70, bw = 330, kh = ep(t, TT.kap, TT.kap + 0.6);
      rr(xr, by, bw, 10, 5, C.track, null, 0, kr * (1 - kh)); rr(xr, by, Math.max(10, bw * clamp(tr / CLK_TN.pre)), 10, 5, clicked ? (R.hero ? C.hero : C.ink) : C.comp, null, 0, kr * (1 - kh));
      text(tr.toFixed(2) + ' of 0.35 mm to the click', xr, by + 40, { role: 'small', size: 25, color: C.mute, alpha: kr * (1 - kh) });
      /* up close, what the bridge wins: where it bends, and its margin to the break. Each tensioner's peak is taken at its own
         click, and the bridge's (it does all its bending in its thin crown) sits a little above the flat plane's, so no
         stress line is set side by side (review item 2): the bridge states its margin, the peak against PP-C-20A's 120 MPa
         (F12.12), rounded down */
      const uy = R.hero ? by - 12 : by + 10;
      text('Half the bend in ' + R.c.half.len.toFixed(1) + ' mm', xr, uy, { role: 'small', size: 25, weight: 700, color: R.hero ? C.heroText : C.ink, alpha: kh, maxW: RM - xr });
      if (R.hero) {
        const mg = Math.floor(CLK_BREAK / R.c.sig * 10) / 10;
        text(`Peak: ${mg.toFixed(1)}× under the break`, xr, uy + 34, { role: 'small', size: 23, weight: 600, color: C.mute, alpha: kh, maxW: RM - xr });
      }
      G.restore();
    });
    /* where this is: the rear of the trigger, from the side */
    locator(t, 0.4, LM + 30, CLK_TOP + 24, 150, 'right', msBox('right', 'rear'), { hi: ['rear'], col: 'ink' });
    /* the heat scale, and the model in one line */
    const lx = X0 + XW - 430, ly = wy + 40, kl = ep(t, 1.2, 1.6);
    rr(lx - 56, ly - 26, 488, 72, 6, C.panel, null, 0, kl);
    text('Stress', lx - 40, ly + 6, { role: 'label', size: 19, color: C.faint, alpha: kl });
    for (let i = 0; i < 40; i++) rect(lx + 50 + i * 4, ly - 6, 4.5, 12, { fill: heatCol(i / 39), alpha: kl });
    text('0', lx + 50, ly + 32, { role: 'label', size: 19, color: C.faint, alpha: kl }); text(sref.toFixed(1) + ' MPa', lx + 210, ly + 32, { role: 'label', size: 19, color: C.faint, align: 'right', alpha: kl });
    text('Red: the peak', lx + 226, ly + 6, { role: 'label', size: 19, color: C.faint, alpha: kl }); text('Breaks at ' + CLK_BREAK + ' MPa', lx + 226, ly + 32, { role: 'label', size: 19, color: C.faint, alpha: kl });
    pill(RM - 24 - pillW('derived'), ly + 6, 'derived', kl);
    text(`2D frame model (K1), the example tensioner: ${SIM_MAT.ppcf.name} at ${(SIM_MAT.ppcf.E / 1000).toFixed(1)} GPa for both, 10 mm wide over an 8 mm span, pressed 40 mm out, plunger at 30 mm; the GT01's 55 gf adds ${B02_TN.sw.toFixed(1)} gf at the fingertip. Starlight X's own composite is stiffer (not published). Motion drawn ${CLK_TT.ex}×.`, LM, 994, { role: 'foot', color: C.faint, alpha: ep(t, 1.0, 1.6), maxW: RM - LM });
  }
});

/* ============================== 10. b02_stiff: A stiff button, a light click (#50 with PP-C-20A) ==============================
   His notes on clk_tenmat (4/10): hard to understand; "stiffer is better" doesn't seem right. Said plainly here: a button has
   two jobs. Its body should not bend (a body that bends under the finger feels mushy and adds travel after the click); its
   spring sets how hard it clicks. A stiff material is right for the first and wrong for the second, so the bridge (the
   previous slide) does the second. The same firm press (2 N, Radwin & Jeng: fingers peak at 2.5 to 4.6× the activation
   force) on the example button: the switch holds the post, and the body bends between the post and the fingertip
   (an overhanging beam, 20 × 2.4 mm, the same shape in both): δ = F a² (L + a) / 3EI with L 30, a 10 mm. ABS (2.55 GPa)
   against PP-C-20A (13.5 GPa): 5.3× less bend for the same shape. */
const B02_ST = { F: 2.0, L: 30, a: 10, b: 20, h: 2.4, ex: 40, press: { down: 0.35, hold: 0.9, up: 0.35 }, p1: 1.9, p2: 4.3, v: 5.9 };
const b02_stBend = E => { const Q = B02_ST, I = Q.b * Q.h * Q.h * Q.h / 12; return Q.F * Q.a * Q.a * (Q.L + Q.a) / (3 * E * I); };
/** one button from the side, simply: the spring at the rear, the body as a bar, the switch under the post at 30 mm, the
   fingertip at 40 mm. bend: the tip's drop from the body's own bend (mm, drawn ex×), k: the press 0..1 */
function b02_stBeam(x, y, s, bend, k, o = {}) {
  const Q = B02_ST, ed = inkA(TH ? 0.62 : 0.55), body = o.fill || (TH ? C.track : C.hair), ex = Q.ex, a = o.alpha == null ? 1 : o.alpha;
  if (a <= 0.003) return {};
  const X = u => x + u * s, w = u => { if (u <= Q.L) return -bend * ex * k * 0; const v = u - Q.L; return bend * ex * k * (v * v * (3 * Q.a - v)) / (2 * Q.a * Q.a * Q.a); };
  /* the overhang's elastic line (cantilever from the post, scaled so the tip moves by the beam formula); the span before the
     post stays on its line (its own small bend omitted, said in the foot line) */
  G.save(); G.globalAlpha = a;
  rr(X(-8), y - 6, 9 * s, 12 + Q.h * s, 3, TH ? C.comp : C.comp2, ed, 1.5, a); G.globalAlpha = a;
  const top = [], bot = [];
  for (let u = 0; u <= Q.L + Q.a + 1e-9; u += 0.5) { const yy = y + w(u) * s; top.push([X(u), yy]); bot.push([X(u), yy + Q.h * s]); }
  G.beginPath(); top.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); for (let i = bot.length - 1; i >= 0; i--) G.lineTo(bot[i][0], bot[i][1]); G.closePath();
  G.fillStyle = body; G.fill(); G.strokeStyle = ed; G.lineWidth = 1.8; G.stroke();
  /* the post and the switch under it */
  const py = y + Q.h * s; rr(X(Q.L) - 0.9 * s, py, 1.8 * s, 3.2 * s, 2, TH ? C.comp : C.comp2, ed, 1.4, a);
  rr(X(Q.L) - 6.4 * s, py + 3.2 * s, 12.8 * s, 6.5 * s, 4, TH ? '#2B2B2E' : '#0E0E10', ed, 1.4, a);
  G.globalAlpha = a; line(X(-10), py + 9.7 * s, X(Q.L + 16), py + 9.7 * s, { color: inkA(0.4), w: 2, alpha: a });
  /* a dashed straight line from the post: where the tip would be if the body did not bend */
  if (k > 0.05) line(X(Q.L), y, X(Q.L + Q.a + 4), y, { color: inkA(0.45), w: 1.5, dash: [6, 5], alpha: a * k });
  G.restore();
  return { tip: [X(Q.L + Q.a), y + w(Q.L + Q.a) * s], tip0: [X(Q.L + Q.a), y], post: [X(Q.L), py] };
}
/** the classroom version: a door from above on its hinge, pushed at its far edge: a floppy door bends before it swings, a
   stiff one swings straight; the hinge's spring sets how hard */
function b02_doors(r, push, a) {
  if (a <= 0.003) return;
  const [x, y, w, h] = r, ed = inkA(TH ? 0.6 : 0.55);
  [[x + 30, true], [x + w / 2 + 30, false]].forEach(([hx, floppy]) => {
    const L = w / 2 - 80, hy = y + h * 0.35, ang = push * 0.22, bend = floppy ? push * 0.5 : 0;
    circle(hx, hy, 6, { fill: ed, alpha: a });
    const pts = []; for (let i = 0; i <= 20; i++) { const u = i / 20, d = u * L, off = bend * L * 0.25 * u * u; pts.push([hx + Math.cos(ang) * d - Math.sin(ang) * off, hy + Math.sin(ang) * d + Math.cos(ang) * off]); }
    G.save(); G.globalAlpha = a; G.beginPath(); pts.forEach((p, i) => i ? G.lineTo(p[0], p[1]) : G.moveTo(p[0], p[1])); G.strokeStyle = floppy ? C.red : C.ink2; G.lineWidth = 7; G.lineCap = 'round'; G.stroke(); G.restore();
    const e = pts[pts.length - 1]; arrow(e[0] + 0, e[1] - 46, e[0], e[1] - 8, { color: C.ink, w: 3, hs: 10, alpha: a * (0.4 + 0.6 * push) });
  });
}
S({
  id: 'b02_stiff', ch: 'click', theme: 'paper', title: 'A stiff button, a light click', settle: 10, ideas: [50],
  replaces: ['clk_tenmat'],
  src: [SIM_MAT.ppcf.src, SIM_MAT.abs.src, 'b02_radwin', 'b02_tpuGpx2', 'clk_brock'],
  answers: [
    ['hard to understand', 'One idea, one demonstration: the same firm press on the same button in ABS and in PP-C-20A, side by side; the ABS body visibly bends past the switch, the PP-C-20A one stays on its line; a door and its hinge as the classroom version'],
    ['and stiffer is better doesn\'t seem right', 'Said plainly: stiff is right for the body (it should not bend) and wrong for the spring (the bridge on the previous slide keeps the click light, 49.0 gf); the headline is the body\'s bend, lower is better, not "stiffer"']
  ],
  sfx: [[pressCross(B02_ST.p1, B02_ST.press, 0.5), 'click'], [pressCross(B02_ST.p2, B02_ST.press, 0.5), 'click']],
  draw: t => {
    const Q = B02_ST, bA = b02_stBend(SIM_MAT.abs.E), bP = b02_stBend(SIM_MAT.ppcf.E), k = Math.max(pressCurve(t, Q.p1, Q.press), pressCurve(t, Q.p2, Object.assign({}, Q.press, { hold: 99 })));
    header(t, 'A stiff button, a light click');
    captions(t, [[0.5, 'A button has two jobs. Its spring sets how hard it clicks. Its body should not bend at all.'],
      [Q.p1, 'Press firmly and the switch holds the post: a body that bends lets your finger sink on past it, a mushy end to every click.'],
      [Q.p2 - 0.2, 'The same press on the same shape in PP-C-20A: 5.3 times stiffer, it stays on its line. The bridge keeps the click light.'],
      [Q.v + 0.4, 'Stiff where it should be, light where it should be: a crisp click with low post-travel, as TechPowerUp found on the G Pro X Superlight 2.']]);
    /* where this is: the button from the side */
    locator(t, 0.3, LM, 286, 150, 'right', msBox('right', 'trigL'), { hi: ['trigL'], col: 'ink' });
    const rows = [['ABS', bA, false, 0.4], ['PP-C-20A, Theseus', bP, true, 0.6]], s = 13;
    rows.forEach(([nm, bend, hero, t0], i) => {
      const y0 = 520 + i * 230, x0 = 330, ka = ep(t, t0, t0 + 0.5);
      text(nm, x0 - 120, y0 - 70, { role: 'label', size: 22, color: hero ? C.heroText : C.ink2, alpha: ka });
      const B = b02_stBeam(x0, y0, s, bend, k, { alpha: ka, fill: hero ? rgba(C.hero, 0.18) : null });
      if (B.tip) {
        /* the same firm press on both, at the fingertip's place */
        forceArrow(B.tip[0] - 3, B.tip[1] - 4, Math.PI / 2, 80, { k: Math.max(0.25, k) * ka, N: i === 0 ? Q.F : null, label: i === 0 ? 'a firm press' : null, color: C.ink, side: 'r' });
        const kr = ep(k, 0.6, 0.95);
        if (kr > 0) { text((bend * 1000).toFixed(0) + ' µm', B.tip[0] + 60, y0 + 64, { role: 'num', size: 30, weight: 800, color: hero ? C.heroText : C.red, alpha: kr * ka });
          text('bend at the fingertip', B.tip[0] + 60, y0 + 92, { role: 'label', size: 19, color: C.mute, alpha: kr * ka }); }
      }
    });
    text('Bend drawn ' + Q.ex + '×', LM + 200, 300, { role: 'small', size: 21, color: C.faint, alpha: ep(t, 1.0, 1.4) });
    { const r = demoPanel(t, 0.2, [1240, 290, 600, 260], { label: 'The classroom version' }), ka = ep(t, 0.4, 0.8);
      b02_doors([r[0], r[1], r[2], r[3] - 40], k, ka);
      text('A floppy door bends first', r[0] + r[2] * 0.22, r[1] + r[3] + 4, { role: 'small', size: 21, weight: 600, color: C.red, align: 'center', alpha: ka });
      text('A stiff door swings true', r[0] + r[2] * 0.72, r[1] + r[3] + 4, { role: 'small', size: 21, weight: 600, color: C.ink2, align: 'center', alpha: ka }); }
    noteBox(t, Q.v + 1.2, 1240, 590, 600, { label: 'Two jobs, two parts', head: 'The body: stiff. The spring: light.', body: 'PP-C-20A keeps the body from bending; the bridge keeps the click at 49.0 gf, a little under an egg\'s weight.' });
    verdict(t, Q.v, 1240, 950, { from: (bA * 1000).toFixed(0), to: (bP * 1000).toFixed(0), unit: 'µm', label: 'The body\'s bend under a firm press', better: 'lower', who: ['ABS', 'PP-C-20A'], rivalCol: 'grey', size: 96, maxW: 600, net: false });
    source(t, 'Derived for the example button (a 20 × 2.4 mm body, the switch 30 mm and the fingertip 40 mm from the spring): after the click the switch holds the post, and the body bends past it, δ = F a² (L + a) / 3EI; F = 2 N, a firm press (fingers peak at 2.5 to 4.6× the activation force: Radwin & Jeng 1997), about a 200 g phone\'s weight. E: ABS 2.55, PP-C-20A 13.5 GPa (datasheets).', { t0: 1.6, maxW: 1100, y: 977 });
  }
});

/* ============================== 11. b02_rails: Dual rail main clicks (#3, #28) ==============================
   His notes on anchors (7/10): explain locking the motion to one plane better; too abstract to tell what you're looking at;
   the posts and pads weren't uniform; sell it: the bad version feels cheap and wears over time; medium improvement. #3:
   a second post "as far away from the first one as possible ... to resolve the issue of horizontal trigger jiggle/sway".
   The model, checked: with one post, the trigger can swing sideways about its spring as far as the post's guide lets it;
   the play at the fingertip is the guide's gap times the lever (fingertip / post, from the spring). A second post near the
   front, in a guide with POM pads fitted to the gap (#28), holds the front. From above, like the rear-cutout slide. Two
   posts side by side would not stop a roll (each post's own guide sets that), so they sit one behind the other here. */
const B02_RL = { flick: { down: 0.25, hold: 0.6, up: 0.3 }, f1: 1.9, f2: 3.1, mo: [4.2, 1.0], f3: 5.6, f4: 6.8, v: 7.3,
  pA: 36.72, pB: 53.0, fz: 46.72, gapBare: 0.15, gapPom: 0.025, ex: 14, post: 2.4, pad: 0.6 };
/** the left trigger from above, swung by phi (radians, about its spring) in the kit's top frame, with its posts and guides
   seen through the shell. k: 0 one bare guide .. 1 two padded guides (the second post and the pads come in with k);
   wear: 0..1 the rub marks on the bare guide */
function b02_railsTop(phi, k, o = {}) {
  const Q = B02_RL, H = b02_hinge(0), hc = H.c, P = (x, z) => b02_P(x, z);
  const rot = ([x, z]) => { const dx = x - hc[0], dz = z - hc[1], c = Math.cos(phi), sn = Math.sin(phi); return [hc[0] + dx * c - dz * sn, hc[1] + dx * sn + dz * c]; };
  const V = msView('top'), bodyF = b02_bodyF(), ink = TH ? '17,17,17' : '243,243,245', sx = -B02.sw.x;
  /* cover the kit's left trigger, then draw it swung */
  G.save(); G.clip(V.out); b02_pathOf(b02_trigOutline(0).map(p => P(...p))); G.fillStyle = bodyF; G.fill(); G.restore();
  G.save(); G.clip(V.out);
  const out = b02_trigOutline(0).map(p => P(...rot(p)));
  b02_pathOf(out); G.fillStyle = o.fill || rgba(C.ink, TH ? 0.06 : 0.1); G.fill(); G.strokeStyle = `rgba(${ink},0.6)`; G.lineWidth = lw(1.8); G.lineJoin = 'round'; G.stroke();
  G.restore();
  /* seen through: the spring at the rear, the guides (fixed), the posts (with the trigger) */
  const sq = (c, w, h, fill, stroke, dash) => { const a = P(c[0] - w / 2, c[1] + h / 2); G.beginPath(); G.rect(a[0], a[1], w * b02_K().x, h * b02_K().y); if (fill) { G.fillStyle = fill; G.fill(); } if (stroke) { if (dash) G.setLineDash([lw(4), lw(3)]); G.strokeStyle = stroke; G.lineWidth = lw(1.3); G.stroke(); G.setLineDash([]); } };
  sq([sx, hc[1] + 0.6], 10, 5.6, rgba(C.ink, 0.08), `rgba(${ink},0.5)`, true);
  const guide = (z, padded, a) => {
    const gp = (padded ? Q.gapPom : Q.gapBare) * Q.ex, half = Q.post / 2 + gp + (padded ? Q.pad : 0);
    G.save(); G.globalAlpha *= a;
    for (const sg of [-1, 1]) {
      sq([sx + sg * (half + 0.7), z], 1.4, 4.0, TH ? C.comp : C.comp2, `rgba(${ink},0.55)`);
      if (padded) sq([sx + sg * (half - Q.pad / 2), z], Q.pad, 3.4, C.panel, `rgba(${ink},0.5)`);
    }
    G.restore();
    return half;
  };
  const hA = guide(Q.pA, k > 0.5, 1), hB = k > 0.01 ? guide(Q.pB, true, k) : 0;
  /* the rub marks on the bare guide's walls */
  if (o.wear > 0.01 && k < 0.5) { for (const sg of [-1, 1]) { const a = P(sx + sg * (hA + 0.05), Q.pA - 1.4), b = P(sx + sg * (hA + 0.05), Q.pA + 1.4); line(a[0], a[1], b[0], b[1], { color: C.red, w: lw(3.5), alpha: o.wear }); } }
  const postAt = z => { const c = rot([sx, z]); sq(c, Q.post, Q.post, `rgba(${ink},0.82)`, null); return c; };
  const cA = postAt(Q.pA); let cB = null; if (k > 0.01) { G.save(); G.globalAlpha *= k; cB = postAt(Q.pB); G.restore(); }
  const M = XF.m.slice();
  return { at: (x, z) => SPm(M, ...P(...rot([x, z]))), fix: (x, z) => SPm(M, ...P(x, z)), postA: SPm(M, ...P(...cA)), postB: cB ? SPm(M, ...P(...cB)) : null, hinge: SPm(M, ...P(hc[0], hc[1])) };
}
/** the classroom version: a drawer from above on one runner (centre) and on two (its sides), pushed at a corner; the one-
   runner drawer twists in its opening, the two-runner one goes straight */
function b02_drawers(r, push, a) {
  if (a <= 0.003) return;
  const [x, y, w, h] = r, ed = inkA(TH ? 0.6 : 0.55), body = TH ? C.panel : C.hair;
  [[x + w * 0.25, true], [x + w * 0.75, false]].forEach(([cx, one]) => {
    const fw = w * 0.36, fh = h * 0.74, top = y + 6;
    /* the cabinet's opening and the runners */
    rr(cx - fw / 2 - 8, top, fw + 16, fh, 4, null, ed, 1.6, a);
    for (const rx of one ? [cx] : [cx - fw / 2 + 6, cx + fw / 2 - 6]) line(rx, top + 4, rx, top + fh - 4, { color: inkA(0.35), w: 2, dash: [5, 4], alpha: a });
    /* the drawer, pushed in at its left front corner */
    const tw = one ? 0.13 * push : 0, dy = push * fh * 0.25;
    G.save(); G.globalAlpha = a; G.translate(cx, top + fh * 0.55 - dy); G.rotate(tw);
    G.beginPath(); G.rect(-fw / 2, -fh * 0.32, fw, fh * 0.64); G.fillStyle = body; G.fill(); G.strokeStyle = one ? C.red : ed; G.lineWidth = 2; G.stroke(); G.restore();
    arrow(cx - fw / 2 + 10, top + fh + 40 - dy, cx - fw / 2 + 10, top + fh + 6 - dy, { color: C.ink, w: 3, hs: 10, alpha: a * (0.4 + 0.6 * push) });
  });
}
S({
  id: 'b02_rails', ch: 'click', theme: 'night', title: 'Dual rail main clicks', settle: 11, ideas: [3, 28],
  replaces: ['anchors'],
  src: ['tpuUlx', 'delrin150', 'clk_protolabs', 'clk_brock'],
  answers: [
    ['locking the motion to one plane/ direction needs to be better explained', 'Shown, not said: the same sideways nudge swings a one-post trigger about its spring (its front sways, the post grinds its guide); with the second post near the front it can only go down and up. The caption names it: one plane'],
    ['and the visualization here is too abstract and difficult to tell what you\'re looking at', 'The whole mouse from above first, then one push-in to the left trigger (locator kept); the posts and guides drawn through the shell where they sit, the finger on the button'],
    ['i also dislike how the dual plungers and pads aren\'t uniform', 'Both posts are the same 2.4 mm square, both guides the same, both with the same POM pads (G8, F26.2)'],
    ['and you need to sell the benefit here a little better, talk about how the bad version feels cheap and causes more wear over time fork being losing', 'What you feel: no sideways wobble under the finger (the cheap feel), and nothing grinding the guide wider every click (red rub marks build on the bare guide; POM pads take the rub on Theseus)'],
    ['good information, execution just need medium improvement', 'The information kept (one post, a second post, POM pads), the execution rebuilt as a demonstration with one number']
  ],
  sfx: [[B02_RL.f1 + 0.2, 'click'], [B02_RL.f2 + 0.2, 'click'], [B02_RL.f3 + 0.2, 'click'], [B02_RL.f4 + 0.2, 'click']],
  draw: t => {
    const Q = B02_RL, F = Q.flick;
    header(t, 'Dual rail main clicks');
    captions(t, [[0.5, 'Under each button, a post rides in a guide. With one post, a sideways push in a flick swings the button about its spring.'],
      [Q.f1 + 0.1, 'Its front sways as far as the guide allows, and the post grinds the guide wider with every click.'],
      [Q.mo[0], 'Theseus adds a second post near the front, the same as the first, both guides lined with POM pads fitted to the gap.'],
      [Q.v + 0.4, 'The button now moves in one plane only: straight down and back up, wherever and however you press.']]);
    const k = ep(t, Q.mo[0], Q.mo[0] + Q.mo[1], E.io3);
    const fl = [Q.f1, Q.f2, Q.f3, Q.f4].map((f, i) => pressCurve(t, f, F) * (i % 2 ? 1 : -1));
    const nudge = fl.reduce((a, b) => Math.abs(b) > Math.abs(a) ? b : a, 0), H = b02_hinge(0), Lp = Q.pA - H.c[1], LB = Q.pB - H.c[1];
    const gapNow = k > 0.5 ? Q.gapPom : Q.gapBare, Lnow = k > 0.5 ? LB : Lp;
    const phi = nudge * gapNow * Q.ex / Lnow, wear = ep(t, Q.f1 + 0.3, Q.f1 + 0.6) * 0.5 + ep(t, Q.f2 + 0.3, Q.f2 + 0.6) * 0.5;
    const box = [80, 270, 1000, 650];
    let A = null;
    const est = establish(t, 0, box, { view: 'top', hi: ['trigL'], col: 'ink', focus: [-34, -62, 44, 66], hold: 0.4, dur: 1.0, locator: 'tl', locW: 64,
      draw: () => { b02_cutOverlay(0, { lit: inkA(0.001), litW: 0.1 }); A = b02_railsTop(phi, k, { wear: wear * (1 - k) }); } });
    /* the finger on the button, pushing down and a little sideways */
    if (A) {
      const fp = A.at(-B02.sw.x, Q.fz), fa = ep(t, 0.9, 1.3);
      finger(fp[0], fp[1] + (1 - ep(t, 0.9, 1.4, E.out3)) * 220, -Math.PI / 2 - 0.08, { s: est.s, press: Math.abs(nudge), view: 'top', alpha: fa, len: 22 });
      if (Math.abs(nudge) > 0.02) forceArrow(fp[0] + Math.sign(nudge) * 70, fp[1] + 60, nudge > 0 ? 0 : Math.PI, 60, { k: Math.abs(nudge), color: C.ink, w: 3 });
      if (k < 0.5) faultTag(t, Q.f1 + 0.4, A.postA, 'One post: swings about it', { to: [A.postA[0] + 170, A.postA[1] + 70], side: 'r', alpha: 1 - ep(t, Q.mo[0] - 0.2, Q.mo[0]) });
      if (A.postB && k > 0.98) fixTag(t, Q.mo[0] + Q.mo[1], A.postB, 'A second post, the same', { to: [A.postB[0] + 170, A.postB[1] - 40], side: 'r' });
      scaleNote(box[0] + 20, box[1] + 200, 'Sideways play drawn ' + Q.ex + '×', { t, t0: 1.6, size: 21 });
    }
    /* the play at the fingertip, measured: the guide's gap times the lever */
    const play = g => 2 * g * (Q.fz - H.c[1]) / (g === Q.gapPom ? LB : Lp);
    { const x = 1180, y = 330, a = ep(t, Q.f1 + 0.3, Q.f1 + 0.6);
      text('Side to side at your fingertip', x, y, { role: 'label', size: 21, color: C.mute, alpha: a });
      const v = k > 0.98 ? play(Q.gapPom) : play(Q.gapBare);
      text(v.toFixed(2) + ' mm', x, y + 64, { role: 'num', size: 52, weight: 800, color: k > 0.98 ? C.heroText : C.red, alpha: a });
      text(k > 0.98 ? 'two posts, POM pads fitted to the gap' : 'one post in a bare guide', x, y + 100, { role: 'small', size: 23, weight: 600, color: C.mute, alpha: a }); }
    { const r = demoPanel(t, 0.25, [1180, 470, 660, 250], { label: 'The classroom version' }), ka = ep(t, 0.45, 0.85);
      const push = Math.max(...[Q.f1, Q.f2, Q.f3, Q.f4].map(f => pressCurve(t, f, F)));
      b02_drawers([r[0], r[1] + 4, r[2], r[3] - 40], push, ka);
      text('One runner: it twists', r[0] + r[2] * 0.25, r[1] + r[3] + 16, { role: 'small', size: 21, weight: 600, color: C.red, align: 'center', alpha: ka });
      text('Two runners: straight in', r[0] + r[2] * 0.75, r[1] + r[3] + 16, { role: 'small', size: 21, weight: 600, color: C.ink2, align: 'center', alpha: ka }); }
    verdict(t, Q.v, 1180, 905, { from: play(Q.gapBare).toFixed(2), to: play(Q.gapPom).toFixed(2), unit: 'mm', label: 'Side-to-side play at your fingertip', better: 'lower', who: ['One post, bare', 'Theseus'], rivalCol: 'grey', size: 104, maxW: 660 });
    source(t, 'Derived: the button swings about its spring as far as a post\'s guide gap allows; play at the fingertip = gap × lever (fingertip ' + (Q.fz - H.c[1]).toFixed(1) + ' mm from the spring; posts at ' + Lp.toFixed(1) + ' and ' + LB.toFixed(1) + ' mm). Gaps: ±0.15 mm bare (molds ±0.076 mm a face, Protolabs), ±0.025 mm with pads fitted in 0.05 mm steps (#28). ULX: lateral play (TechPowerUp).', { t0: 1.6, maxW: 1000, y: 977 });
  }
});

/* ============================== 12. b02_pom: POM pads set the fit (#28) ==============================
   His notes on clk_pomtune (6/10): rounder corners in the drawing; it felt lazy: compare with another mouse's tolerances
   directly. #28: POM pads beside the plungers stop the grinding of carbon-filled plastic, fix the alignment issue on mice
   like the ULX, and changing their thickness "should theoretically allow for an easy iteration of the tolerances". The
   model, checked (M-b02-6): a molded guide must clear its post in every unit, so with ±0.076 mm a face (Protolabs) its
   gap lands anywhere up to 0.30 mm; with pads, the gap is closed to the nearest pad (0.05 mm steps), measured pads assumed
   (stock POM shim holds about ±5 %, ±0.04 mm at this size: unmeasured pads would add that). Same numbers as b02_rails. */
const B02_PM = { pads: [0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85], gap: 0.78, s: 150, post: 2.4, sway: [1.2, 3.2], mo: [3.6, 0.6], pick: [4.3, 1.1], v: 6.6 };
S({
  id: 'b02_pom', ch: 'click', theme: 'paper', title: 'POM pads set the fit', settle: 10.5, ideas: [28],
  replaces: ['clk_pomtune'],
  src: ['clk_protolabs', 'delrin150', 'tpuUlx', 'clk_brock'],
  answers: [
    ['more cornered should be rounded here in the visualization', 'Every corner rounded: the guide\'s walls, the post, the pads, the tray, the gauge'],
    ['this one also just feels lazy compare to another mouse\'s tolerances directly', 'Compared directly: a bare molded guide has to clear its post in every unit, up to 0.30 mm of play (the ULX\'s "lateral play", TechPowerUp; the LA-1\'s pads ground until sanded, Brock\'s notes) against 0.05 mm with pads fitted to the gap; shown as the same post swaying in each'],
    ['(M-b02-6) the pad\'s own tolerance', 'Said in the foot line: fitted to the nearest pad (0.05 mm), pads measured; unmeasured stock pads would add about ±0.04 mm each']
  ],
  sfx: [[B02_PM.pick[0] + B02_PM.pick[1], 'seat']],
  draw: t => {
    const Q = B02_PM, S2 = Q.s;
    header(t, 'POM pads set the fit');
    captions(t, [[0.5, 'A post rides in a guide molded into the shell. Molds hold about ±0.076 mm a face, so the gap must leave room for the worst one.'],
      [Q.sway[0] + 0.3, 'That leaves up to 0.30 mm of play, and the post grinds the carbon-filled wall it knocks against.'],
      [Q.mo[0], 'Theseus lines both walls with POM pads: measure the gap, fit the pad that fills it, in 0.05 mm steps. No steel recut.'],
      [Q.v + 0.4, 'The post slides on POM, straight and quiet, with no more play than the nearest pad leaves.']]);
    const kP = ep(t, Q.mo[0], Q.mo[0] + Q.mo[1], E.io3), kPick = ep(t, Q.pick[0], Q.pick[0] + Q.pick[1], E.cam);
    const wx = 120, wy = 290, ww = 1000, wh = 480, cx = wx + ww / 2, mouth = wy + 130, y1 = wy + wh - 50, pw = Q.post * S2;
    const gapTot = lerp(0.30, 0.05, kPick), sway = Math.sin((t - Q.sway[0]) * 5.2) * (t > Q.sway[0] && t < Q.mo[0] ? 1 : 0) * (1 - kP);
    demoWindow(wx, wy, ww, wh, ep(t, 0.1, 0.5), {});
    text('Cut across one post and its guide, from above, close up', wx + 30, wy + 46, { role: 'label', size: 20, color: C.mute, alpha: ep(t, 0.3, 0.7) });
    const wallW = 120, pad0 = 0.75, padTh = lerp(0, pad0, kP), halfGap = (lerp(0.30, gapTot, kP)) / 2;
    const xL = cx - pw / 2 - halfGap * S2 - padTh * S2, xR = cx + pw / 2 + halfGap * S2 + padTh * S2;
    /* the guide's walls: carbon-filled plastic, rounded, hatched; grind marks build on the bare ones */
    for (const [x0, sg] of [[xL - wallW, -1], [xR, 1]]) {
      rr(x0, mouth, wallW, y1 - mouth, 14, TH ? C.comp2 : C.comp, inkA(0.5), 1.5);
      G.save(); rrPath(x0, mouth, wallW, y1 - mouth, 14); G.clip(); G.strokeStyle = inkA(0.14); G.lineWidth = 1.2; G.beginPath(); for (let k = -400; k < 800; k += 18) { G.moveTo(x0 + k, y1); G.lineTo(x0 + k + 300, mouth); } G.stroke(); G.restore();
      const gr = ep(t, Q.sway[0] + 0.6, Q.mo[0]) * (1 - kP);
      if (gr > 0) { const gx = sg < 0 ? x0 + wallW - 4 : x0 + 4; line(gx, mouth + 40, gx, y1 - 40, { color: C.red, w: 6, alpha: gr }); }
    }
    /* the pads, sliding in, rounded */
    if (kP > 0.003) for (const [x0] of [[xL], [xR - padTh * S2]]) rr(x0, mouth + 10, Math.max(2, padTh * S2), y1 - mouth - 20, 10, C.panel, C.hero, 2, kP);
    /* the post, swaying in the bare guide; held in the padded one */
    const px = cx - pw / 2 + sway * halfGap * S2;
    rr(px, mouth - 20, pw, y1 - mouth + 40, 22, TH ? '#2E2E30' : C.ink2, inkA(0.6), 1.5);
    /* the gap, measured */
    const ka = ep(t, 1.0, 1.4), gy = wy + 96;
    text('Gap ' + (k02 => k02.toFixed(2))(kP > 0.5 ? gapTot : 0.30) + ' mm, both sides', cx, gy, { role: 'num', size: 30, weight: 800, color: kP > 0.5 && kPick > 0.95 ? C.heroText : C.red, align: 'center', alpha: ka });
    if (kP < 0.5) faultTag(t, Q.sway[0] + 0.7, [xR + 4, (mouth + y1) / 2], 'Grinds the wall', { to: [xR + 60, y1 + 10], side: 'r', alpha: 1 - kP });
    /* the tray: pads in 0.05 mm steps; the one that fills the gap is picked */
    { const ty = wy + wh + 34, a = ep(t, Q.mo[0] - 0.3, Q.mo[0] + 0.2); let x = wx + 40;
      text('Pads, 0.55 to 0.85 mm in 0.05 mm steps', wx + 40, ty - 4, { role: 'label', size: 19, color: C.mute, alpha: a });
      Q.pads.forEach(v => { const on = Math.abs(v - pad0) < 1e-6; rr(x, ty + 10, v * 60, 26, 6, on ? rgba(C.hero, 0.25) : C.panel, on ? C.hero : inkA(0.4), 1.5, a * (on ? 1 - kPick * 0.6 : 1)); text(v.toFixed(2), x + v * 30, ty + 62, { role: 'label', size: 19, color: on ? C.heroText : C.faint, align: 'center', alpha: a }); x += v * 60 + 26; }); }
    /* another mouse's guides, directly */
    { const x = 1200, y = 330, a = ep(t, Q.sway[0] + 0.6, Q.sway[0] + 1.0);
      text('Other mice', x, y, { role: 'label', size: 21, color: C.mute, alpha: a });
      text('UltralightX: "lateral play" (TechPowerUp)', x, y + 40, { role: 'small', size: 23, weight: 600, color: C.secondText, alpha: a, maxW: 640 });
      text('LA-1: POM pads, but it still ground until the post was sanded (Brock\'s notes)', x, y + 76, { role: 'small', size: 23, weight: 600, color: C.ink2, alpha: a, maxW: 640 });
      text('Theseus: pads fitted to the gap, POM on the post (friction 0.20, Delrin 150)', x, y + 150, { role: 'small', size: 23, weight: 700, color: C.heroText, alpha: ep(t, Q.pick[0] + Q.pick[1], Q.pick[0] + Q.pick[1] + 0.4), maxW: 640 }); }
    verdict(t, Q.v, 1200, 900, { from: '0.30', to: '0.05', unit: 'mm', label: 'Play at the post, side to side', better: 'lower', who: ['Bare guide', 'Theseus'], rivalCol: 'grey', size: 112, maxW: 640, net: false });
    source(t, 'Derived: molds hold ±0.076 mm a face (Protolabs), so a bare guide clears its post by up to 0.30 mm; with pads the gap closes to the nearest pad, 0.05 mm (pads measured: stock POM shim holds about ±5 %, ±0.04 mm here, which would add). ULX: TechPowerUp. Drawn 150 px per mm.', { t0: 1.6, maxW: 1080, y: 977 });
  }
});

/* the lab: helpers on one page for checking; registers only with ?b02lab=1, so the film and the critic never see it */
const B02LAB = (() => { try { return /[?&]b02lab=1\b/.test(location.search); } catch (e) { return false; } })();
if (B02LAB) S({ id: 'b02_dev', ch: 'click', theme: 'paper', title: 'dev', settle: 4, draw: t => {
  header(t, 'b02 lab: flush painter');
  [['wall', 0, 560], ['ceiling', 0, 1160], ['ceiling', 1, 1760]].forEach(([face, wall, x0]) => {
    part(x0, 860, 16, () => { b02_flushMM({ face, wall, press: ep(t, 1, 2) }); });
    text(face + ' / wall ' + wall, x0 - 300, 330, { role: 'label' });
  });
} });
