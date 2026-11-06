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
  b02_nickel: { t: 'US Mint coin specifications: the 5-cent nickel weighs 5.000 g (the table the motion kit\'s SCALE cites for the penny and the quarter; not re-fetched this run)', u: '' },
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
    const col = o.fieldCol || (TH ? '17,17,17' : '243,242,238'), A = 0.15 * o.field * press;
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
const B02_FR = { uc: 12, hw: 10, d: 0.9, mis: 0.1, gap: 0.7, face: 3.2, ex: 5, flat: 17.06 };
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
function b02_frontY(k, ex) {
  const F = B02_FR, base = B02_FO.base;
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
function b02_frontPose(k, ex, drop, cu) {
  const Y = b02_frontY(k, ex), c0 = [cu, Y.lip(cu)];
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
  const F = B02_FR, k = o.k == null ? 1 : o.k, ex = o.ex == null ? F.ex : o.ex, Y = b02_frontY(k, ex), drop = clamp(o.drop || 0), cu = o.cu == null ? F.uc : o.cu;
  const pose = b02_frontPose(k, ex, drop, cu), M = XF.m.slice(), SPc = (x, y) => SPm(M, x, -y), out = { th: pose.th };
  const body = b02_bodyF(), trig = b02_partF(), edge = inkA(TH ? 0.55 : 0.5), U = B02_FO.uMax, n = 0.25;
  const poly = (pts, fill, stroke, w) => { G.beginPath(); pts.forEach(([u, y], i) => i ? G.lineTo(u, -y) : G.moveTo(u, -y)); G.closePath(); if (fill) { G.fillStyle = fill; G.fill(); } if (stroke) { G.strokeStyle = stroke; G.lineWidth = lw(w || 1.6); G.lineJoin = 'round'; G.stroke(); } };
  const run = (pts, col, w, cap) => { G.beginPath(); pts.forEach(([u, y], i) => i ? G.lineTo(u, -y) : G.moveTo(u, -y)); G.strokeStyle = col; G.lineWidth = lw(w); G.lineCap = cap || 'round'; G.lineJoin = 'round'; G.stroke(); };
  G.save(); G.clip(msView('front').out);
  /* cover the kit's triggers, its split and its wheel down past the ledge: this drawing replaces them */
  { const ring = []; for (let u = -U; u <= U + 1e-9; u += n) ring.push([u, Y.ledge(u) - 2.5]);
    const tp = B02_FO.top.map(([x, y]) => [x, y + 0.6]); for (const p of tp) ring.push(p); for (let i = tp.length - 1; i >= 0; i--) ring.push([-tp[i][0], tp[i][1]]);
    poly(ring, body); }
  /* the slot under the lips: what shows between a lip and its ledge */
  { const sl = []; for (let u = -U; u <= U + 1e-9; u += n) sl.push([u, Y.ledge(u)]); for (let u = U; u >= -U - 1e-9; u -= n) sl.push([u, Y.lip(u) + 1.2]); poly(sl, inkA(TH ? 0.13 : 0.2)); }
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
  poly(shape(-1, still), trig, edge, 1.6); run(frontTop(-1, still), inkA(TH ? 0.32 : 0.3), 1.3);
  poly(shape(1, pose.map), trig, edge, 1.6); run(frontTop(1, pose.map), inkA(TH ? 0.32 : 0.3), 1.3);
  if (o.lit > 0.003) { G.save(); G.globalAlpha *= o.lit; poly(shape(1, pose.map), rgba(C.ink, TH ? 0.06 : 0.1), C.ink, 2.4); G.restore(); }
  /* the centre split, and the wheel in it, over both */
  { const V = msView('front'), w = V.parts.wheel && V.parts.wheel.solid; line(0, -Y.ledge(0), 0, -37.4, { color: edge, w: lw(1.3) });
    if (w) { G.fillStyle = TH ? C.track : C.hair; G.fill(w); G.strokeStyle = inkA(TH ? 0.5 : 0.45); G.lineWidth = lw(1.2); G.stroke(w); } }
  G.restore();
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

/* ============================== flush walls (#48) and which way a cutout faces: one trigger edge, head-on ==============================
   The trigger's outer edge beside the shoulder at the wall's length, seen from the nose (the user's left trigger on the
   right), mm, y up (drawn y down). u is the distance out from the centre split. Three set-ups, morphable:
     face 'wall'    the trigger wraps over the shoulder and its seam runs along the side: the gap is under the trigger's
                    edge, in the direction it moves, so a press closes it on whatever lies across it (a pinch);
     face 'ceiling' the trigger stops on top and a wall rises beside it: the gap opens upward; a press slides the trigger
                    down past the wall and closes nothing. wall (0..1): the wall's top from level with the trigger at rest
                    (0, the default way, #48) to level with it pressed (1, Theseus).
   o = { face, wall, press (0..1 of the travel at the click), tr (that travel, mm), ex (motion drawn ex×), finger (0..1),
   fu (the finger's centre u), lit } → stage points and the step (mm, true) */
const B02_FL = { tr: 0.42, gap: 0.35, uE: 24.0, skin: 1.3, wallW: 3.4 };
function b02_flushMM(o = {}) {
  const F = B02_FL, face = o.face || 'ceiling', ex = o.ex || 6, tr = (o.tr || F.tr), d = clamp(o.press || 0) * tr, out = {};
  const top = u => 21.6 - 0.0113 * u * u;                                       /* the crown across, at the wall's length */
  const shell = b02_shellF(), trig = b02_partF(), edge = inkA(TH ? 0.55 : 0.5);
  const fill = (pts, col) => { b02_pathOf(pts.map(([u, y]) => [u, -y])); G.fillStyle = col; G.fill(); G.strokeStyle = edge; G.lineWidth = lw(1.6); G.lineJoin = 'round'; G.stroke(); };
  const dy = -d * ex;
  if (face === 'wall') {
    /* the trigger runs over the shoulder and down the side to its seam at y 12.6; the side shell continues below the gap */
    const ySeam = 12.6, tp = [];
    for (let u = 12; u <= 27.2; u += 0.25) tp.push([u, top(u) + dy]);
    const side = u => 27.2 + (top(27.2) - 0 - 0) * 0;                           /* (the side face) */
    const skinIn = []; for (let u = 27.2; u >= 12; u -= 0.25) skinIn.push([u - 0.0, top(u) - F.skin + dy]);
    const tri = [[12, top(12) + dy], ...tp, [28.6, top(27.2) - 1.6 + dy], [29.4, ySeam + F.gap * ex * 1 + dy - 0.0], [28.1, ySeam + F.gap * ex + dy], [27.2 - 0.9, top(27.2) - F.skin - 1.0 + dy], ...skinIn.slice(4)];
    fill(tri, trig);
    /* the side shell under the seam, fixed */
    fill([[29.4, ySeam], [29.9, 6], [28.5, 6], [28.0, ySeam]], shell);
    out.gapTop = SP(29.4, -(ySeam + F.gap * ex + dy)); out.gapBot = SP(29.4, -ySeam); out.seamY = ySeam; out.gap = Math.max(0, F.gap + (dy / ex) * 0) - d;
    out.edge = SP(28.6, -(top(27.2) - 1.6 + dy));
  } else {
    /* ceiling-facing: the trigger ends on top at uE with a short edge face; the shoulder wall beside it, its top at wallTop */
    const uE = F.uE, wTop = top(uE) - lerp(0, tr, clamp(o.wall || 0)) * ex;
    const tp = []; for (let u = 12; u <= uE + 1e-9; u += 0.25) tp.push([u, top(u) + dy]);
    const tri = [[12, top(12) + dy], ...tp, [uE, top(uE) - 2.0 + dy], [uE - 1.2, top(uE) - 2.0 + dy], [uE - 1.2, top(uE) - F.skin + dy]];
    for (let u = uE - 1.2; u >= 12; u -= 0.25) tri.push([u, top(u) - F.skin + dy]);
    fill(tri, trig);
    /* the wall: from the gap out and down the side */
    const w0 = uE + F.gap, wall = [[w0, wTop - 3.2], [w0, wTop], [w0 + 2.2, wTop - 0.25], [w0 + F.wallW + 1.2, wTop - 1.6], [w0 + F.wallW + 2.0, wTop - 4.4], [w0 + F.wallW + 2.4, wTop - 8], [w0 + F.wallW + 1.1, wTop - 8], [w0 + F.wallW + 0.7, wTop - 4.6], [w0 + 1.3, wTop - 1.4], [w0 + 1.3, wTop - 3.2]];
    fill(wall, shell);
    out.wallTop = SP(w0 + 0.6, -wTop); out.trigEdge = SP(uE - 0.3, -(top(uE) + dy)); out.step = (top(uE) - d) - (top(uE) - lerp(0, tr, clamp(o.wall || 0)));
    out.wTop = wTop; out.tTop = top(uE) + dy;
  }
  out.top = u => top(u) + dy; out.d = d;
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
  G.save(); G.globalAlpha *= (o.alpha == null ? 1 : o.alpha); G.lineJoin = 'round';
  b02_pathOf(base); G.fillStyle = paperC; G.fill(); G.strokeStyle = ed; G.lineWidth = 1.5; G.stroke();
  /* the crease */
  const c0 = cam.P([-W2, 0, creaseZ(-W2)]), c1 = cam.P([W2, 0, creaseZ(W2)]);
  line(c0[0], c0[1], c1[0], c1[1], { color: o.col || C.ink, w: 2.5, dash: [6, 4], alpha: G.globalAlpha });
  /* where the flap started, faint; where its far corner goes */
  b02_pathOf(flap0.map(([x, z]) => cam.P([x, 0, z]))); G.setLineDash([4, 4]); G.strokeStyle = inkA(0.3); G.lineWidth = 1.2; G.stroke(); G.setLineDash([]);
  const facing = ang > Math.PI / 2;
  b02_pathOf(flap); G.fillStyle = facing ? backC : paperC; G.fill(); G.strokeStyle = ed; G.lineWidth = 1.5; G.stroke();
  const tip = cam.P(b02_rot([0, 0, L1], A, K, ang));
  circle(tip[0], tip[1], 5, { fill: o.col || C.ink, alpha: G.globalAlpha });
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
      [Q.p1 - 0.1, 'So the trigger turns about a line 13° off square: the outer side clicks heavier than the inner, and some of the travel at the switch goes sideways.'],
      [Q.mo[0], 'Cut it straight, with each spring centred on its own switch, and the trigger turns square to the press. Razer did the same from the Viper V2 Pro to the V3 Pro.'],
      [Q.v + 0.4, 'The click weighs the same wherever your finger lands, and nothing at the switch goes sideways.']]);
    const km = 1 - ep(t, Q.mo[0], Q.mo[0] + Q.mo[1], E.io3), lean = H1.lean * km, rival = km > 0.5;
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
      text(deg.toFixed(1) + '°', lxx, c[1] + 8, { role: 'num', size: 34, weight: 800, color: rival ? C.red : C.heroText, align: 'right', alpha: xr });
      text(rival ? 'Bend line, off square' : 'Bend line, square', lxx, c[1] + 38, { role: 'label', size: 21, color: C.mute, align: 'right', alpha: xr, maxW: 300 });
    }
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
          if (kx > 0) text('+' + dg.toFixed(1) + ' gf: a US nickel', x, y + 62, { role: 'small', size: 22, weight: 650, color: C.red, align: 'right', alpha: kx });
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
    verdict(t, Q.v, 980, 880, { from: dG.toFixed(1), to: '0.0', unit: 'gf', label: 'Extra weight at the outer side', better: 'lower', who: ['Sora V2', 'Theseus'], size: 112, maxW: 490 });
    source(t, 'Derived: each trigger turns about the chord of its rear cutout over a 10 mm spring on the switch\'s line; the Sora V2\'s (Brock\'s scan) leans 13.2°. Click weight = (GT01 55 gf × switch lever + bridge 7.7 gf × 40 mm) ÷ finger lever; presses 10 mm ahead of the switch, ' + B02_CT.dx + ' mm either side.', { t0: 1.6, maxW: 1380 });
  }
});

/* ============================== 4. b02_front: A flat front: no wobble (#46, #47) ==============================
   His note on clk_front, left half: "the left needs to compare to what happens when you don't have a straight front, like
   when there is heavy front comfort grooves, and how that can cause wobble side to side, because the front will never reach
   the bottom in the same spot at the same, and where it reaches the bottom first will depend on where you press it, create
   wobble which makes the parts feel cheap and wear out faster". Not a section: the front of the mouse, head-on. */
const B02_FT = { press: { down: 0.18, hold: 0.62, up: 0.24 }, p1: 1.7, p2: 3.05, mo: [4.2, 0.9], p3: 5.35, p4: 6.55, v: 7.0, u: [8.0, 16.5] };
/** the classroom version: a rocker (a half-round bottom) and a flat block on a floor, pressed on one side, then the other.
   The rocker rolls onto a new spot each time (rolling without slipping: its centre moves R·φ); the block stays put */
function b02_rockers(t, r, roll, pressAt, a) {
  const [x, y, w, h] = r, fy = y + h - 30, s = Math.min(w / 260, h / 150), R = 34 * s, c1 = x + w * 0.28, c2 = x + w * 0.74;
  G.save(); G.globalAlpha *= a;
  line(x + 10, fy, x + w - 10, fy, { color: inkA(0.45), w: 2, alpha: a });
  const body = TH ? C.panel : C.hair, ed = inkA(TH ? 0.6 : 0.55);
  /* the rocker */
  { const cx = c1 + R * roll, cy = fy - R; G.save(); G.translate(cx, cy); G.rotate(roll);
    G.beginPath(); G.moveTo(-R, 0); G.arc(0, 0, R, Math.PI, 0, true); G.lineTo(R, -R * 1.1); G.lineTo(-R, -R * 1.1); G.closePath(); G.fillStyle = body; G.fill(); G.strokeStyle = ed; G.lineWidth = 2; G.stroke(); G.restore();
    circle(cx, fy, 5, { fill: C.red, alpha: a }); }
  /* the flat block */
  { const bw = R * 2, bh = R * 2.1; rr(c2 - bw / 2, fy - bh, bw, bh, 4, body, ed, 2, a); line(c2 - bw / 2 + 3, fy, c2 + bw / 2 - 3, fy, { color: C.hero, w: 4, alpha: a }); }
  /* the press, on one side or the other, the same on both */
  if (pressAt) { const [side, k] = pressAt; for (const [cx, top] of [[c1, fy - R * 2.1], [c2, fy - R * 2.1]]) { const px = cx + side * R * 0.7; arrow(px, top - 48, px, top - 6, { color: C.ink, w: 3, hs: 11, alpha: k * a }); } }
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
    ['and how that can cause wobble side to side, because the front will never reach the bottom in the same spot at the same, and where it reaches the bottom first will depend on where you press it', 'Shown: pressed on the inner side the lip lands and rolls in, on the outer side it rolls out; the red landing spot moves 8.5 mm with the finger and the button tips 0.9° each way'],
    ['create wobble which makes the parts feel cheap and wear out faster', 'The rock is measured where you feel it (the outer corner moves 0.5 mm between the two presses, the headline), each landing leaves a red mark on one spot, and the note says it: feels loose, wears where it lands. On the flat front the whole edge lands, blue'],
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
      [Q.mo[0], 'Theseus\'s grooves run out before the front, so the front and its ledge are flat and parallel to the ground.'],
      [Q.v + 0.4, 'The whole front lands at once, the same way wherever you press: no wobble, and no one spot taking every hit.']]);
    const k = 1 - ep(t, Q.mo[0], Q.mo[0] + Q.mo[1], E.io3), rival = k > 0.5;
    /* the four presses: inner, outer on the grooved front; inner, outer on the flat one */
    const P = [Q.p1, Q.p2, Q.p3, Q.p4], Uf = [Q.u[0], Q.u[1], Q.u[0], Q.u[1]];
    let drop = 0, act = -1; P.forEach((p, i) => { const d = pressCurve(t, p, D); if (d > drop + 1e-9) { drop = d; act = i; } });
    const roll = act < 0 ? 0 : ep(t, P[act] + D.down, P[act] + D.down + 0.3) * (1 - ep(t, P[act] + D.down + D.hold, P[act] + D.down + D.hold + D.up * 0.55));
    const cu = act < 0 ? F.uc : lerp(F.uc, b02_frontReach(Uf[act]), roll), hit = act < 0 ? 0 : clamp((drop - 0.95) / 0.05);
    const wA = 1 - ep(t, Q.mo[0], Q.mo[0] + 0.45);
    const wear = [[b02_frontReach(Q.u[0]), ep(t, Q.p1 + 0.5, Q.p1 + 0.75) * wA], [b02_frontReach(Q.u[1]), ep(t, Q.p2 + 0.5, Q.p2 + 0.75) * wA]];
    const box = [80, 270, 1000, 610], exK = lerp(1, F.ex, ep(t, 0.95, 1.55));
    let A = null;
    const est = establish(t, 0, box, { view: 'front', hi: ['trigL'], col: 'ink', focus: [-4, -26, 36, 24], hold: 0.4, dur: 1.0, locator: 'tl',
      mouse: { hide: ['triggers', 'seam', 'wheel'] },
      draw: () => { A = b02_frontMM({ k, drop, cu, hit, wear, ex: exK, lit: ep(t, 0.12, 0.55) * (1 - ep(t, 1.3, 1.8)) }); } });
    /* the finger, end-on: on the front edge's top, sliding between the presses, riding the trigger down and tipping with it */
    if (A) {
      const uF = kf(t, [[0.9, Q.u[0]], [Q.p1 + 1.05, Q.u[0]], [Q.p2 - 0.05, Q.u[1]], [Q.mo[0] + 0.15, Q.u[1]], [Q.p3 - 0.35, Q.u[0]], [Q.p3 + 1.05, Q.u[0]], [Q.p4 - 0.05, Q.u[1]]], E.cam);
      const fa = ep(t, 0.9, 1.25), dy = (1 - ep(t, 0.9, 1.45, E.out3)) * -140, p = A.top(uF);
      b02_fingerFront(p[0], p[1] + dy, -A.th, { s: est.s, press: drop, alpha: fa });
    }
    /* on the grooved front: the landing spot, named; and how far the corner rocks between the two presses */
    const tr = F.ex, uE = 26, yE = ex => b02_frontY(1, ex).lip(uE), poseT = u => b02_frontPose(1, 1, 1, b02_frontReach(u)), cA = poseT(Q.u[0]).map(uE, yE(1)), cB = poseT(Q.u[1]).map(uE, yE(1));
    const rock = Math.abs(cA[1] - cB[1]), deg = Math.abs(poseT(Q.u[0]).th) * 180 / Math.PI;
    if (A) {
      faultTag(t, Q.p1 + 0.45, A.ledgeAt(b02_frontReach(Q.u[0])), 'Lands on one spot', { to: [A.ledgeAt(b02_frontReach(Q.u[0]))[0] - 70, A.ledgeAt(0)[1] + 90], side: 'l', alpha: wA });
      const pd = u => { const q = b02_frontPose(1, tr, 1, b02_frontReach(u)).map(uE, yE(tr)); return est.P(q[0], -q[1]); };
      const yA = pd(Q.u[0]), yB = pd(Q.u[1]), kr = ep(t, Q.p2 + 0.55, Q.p2 + 0.85) * wA, x0 = Math.max(yA[0], yB[0]) + 34;
      if (kr > 0) {
        arrow(x0, (yA[1] + yB[1]) / 2, x0, Math.min(yA[1], yB[1]) - 2, { color: C.red, w: 2.5, hs: 10, alpha: kr });
        arrow(x0, (yA[1] + yB[1]) / 2, x0, Math.max(yA[1], yB[1]) + 2, { color: C.red, w: 2.5, hs: 10, alpha: kr });
        text('Rocks ' + rock.toFixed(2) + ' mm', x0 + 18, (yA[1] + yB[1]) / 2 - 4, { role: 'num', size: 30, weight: 800, color: C.red, alpha: kr });
        text(deg.toFixed(1) + '° each way', x0 + 18, (yA[1] + yB[1]) / 2 + 26, { role: 'label', size: 20, color: C.mute, alpha: kr });
      }
      /* on Theseus: the whole front lands, the same line both times */
      const kf1 = ep(t, Q.p3 + 0.2, Q.p3 + 0.45);
      if (kf1 > 0) fixTag(t, Q.p3 + 0.2, A.ledgeAt(F.flat * 0.55), 'Lands along the whole front', { to: [A.ledgeAt(F.flat * 0.55)[0] - 60, A.ledgeAt(0)[1] + 90], side: 'l' });
      scaleNote(box[0], box[1] + box[3] + 34, 'Heights and gaps drawn ' + F.ex + '×', { t, t0: 1.6, size: 21 });
    }
    /* the classroom version: a rocker and a flat block, pressed with the finger, side by side */
    { const r = demoPanel(t, 0.15, [1120, 280, 720, 280], { label: 'The classroom version' }), ka = ep(t, 0.3, 0.6);
      const side = act < 0 ? 0 : (Uf[act] < F.uc ? -1 : 1), rk = act < 0 ? 0 : roll * side * 0.3;
      const g = b02_rockers(t, [r[0], r[1] - 6, r[2], r[3] - 40], rk, act < 0 ? null : [side, ep(drop, 0.2, 0.9)], ka);
      text('Round bottom', g.c1, g.fy + 34, { role: 'label', size: 21, color: C.red, align: 'center', alpha: ka });
      text('Rocks to where you press', g.c1, g.fy + 62, { role: 'small', size: 22, weight: 600, color: C.mute, align: 'center', alpha: ka });
      text('Flat bottom', g.c2, g.fy + 34, { role: 'label', size: 21, color: C.ink2, align: 'center', alpha: ka });
      text('Lands the same way', g.c2, g.fy + 62, { role: 'small', size: 22, weight: 600, color: C.mute, align: 'center', alpha: ka }); }
    noteBox(t, Q.v + 1.3, 1120, 590, 720, { label: 'What you feel', head: 'A solid landing, every press', body: 'The front lands the same way wherever your finger sits: no wobble, and no one spot hammered by every click. A flat ledge is also easy to recut to tune the travel.' });
    verdict(t, Q.v, 1120, 905, { from: rock.toFixed(2), to: '0.00', unit: 'mm', label: 'Rock at the outer corner', better: 'lower', who: ['Grooves to the front', 'Theseus'], rivalCol: 'grey', size: 112, maxW: 700 });
    source(t, 'Derived: a 0.9 mm groove across the front, the lip\'s dip 0.1 mm deeper than the ledge\'s (molds hold ±0.076 mm: Protolabs); the lip rolls onto the ledge under the press. Theseus: both flat. Presses ' + Q.u[0] + ' and ' + Q.u[1] + ' mm out from the split.', { t0: 1.6, maxW: 1000 });
  }
});

/* the lab: helpers on one page for checking; registers only with ?b02lab=1, so the film and the critic never see it */
const B02LAB = (() => { try { return /[?&]b02lab=1\b/.test(location.search); } catch (e) { return false; } })();
if (B02LAB) S({ id: 'b02_dev', ch: 'click', theme: 'paper', title: 'dev', settle: 4, draw: t => {
  header(t, 'b02 flush preview');
  [['wall', 0, 160], ['ceiling', 0, 760], ['ceiling', 1, 1360]].forEach(([face, wall, x0]) => {
    const pr = ep(t, 1, 2);
    part(x0 - 12 * 26, 860, 26, () => {
      const r = b02_flushMM({ face, wall, press: pr });
      const surf = u => { if (face === 'wall') return u < 28.4 ? r.top(Math.min(u, 27.2)) : 0; return u < B02_FL.uE ? r.top(u) : u < B02_FL.uE + B02_FL.gap ? Math.min(r.top(B02_FL.uE), r.wTop) - 3 : r.wTop; };
      b02_fingerEndMM({ cx: face === 'wall' ? 30.5 : 24.6, base: face === 'wall' ? 12 : r.top(24) + 0.0, sink: 0.6, surf, tilt: face === 'wall' ? -1.2 : 0 });
    });
    text(face + ' wall ' + wall, x0, 330, { role: 'label', align: 'center' });
  });
} });
