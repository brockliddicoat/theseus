# FINGER notes (drafts, to append to /home/claude/work/review/<code>.md once the kit's finger is rebuilt)

Header for each: `## FINGER (FG, the fingertip redesign, F49.1), 2026-11-06 HH:MM: what to change in <file>`
Common preamble (each note):
The kit's `finger()` is rebuilt from one anatomical model (Brock's pick: STYLE). Same signature; every call already draws
the new finger. New options: `surf` (the surface's direction on the stage, side view: the fingertip meets it at ang - surf
and its pad flattens ON it; without it the pad flattens along ang, as before), `digit: 'thumb'`, `floor` + `floorKey`
(a surface that isn't flat: the pad drapes over a step), `mark: [X0, X1, colour]` (a stretch of the pad, mm along the
surface from the contact), `ghost` (0..1, see-through), `flex`, `pitch`, `yaw`; it returns `{ contact: [p0, p1], tip }`
(stage px). `s` is px per mm: pass the part's own scale so the finger is to scale with what it presses (G3). `len` under
about 24 mm shows only the fingertip; 30 to 40 shows the joint, which is what makes it read as a finger. Frames to judge
it: /home/claude/work/fg/sheets/fg_options.png.

## b01 (P3): 30-b01-intro.js
- b01_tradeIcon, kind 'flex' (`finger(pz[0], pz[1], 2.55, { s: s * 0.62, press: clamp(d / 3.4), alpha: ..., len: 26 })`):
  -> `finger(pz[0], pz[1], 2.55, { s, surf: 0, press: clamp(d / 3.4), alpha: ..., len: 26 })`. surf: 0 lays the pad on the
  hump (level there) instead of on a line tilted 34° into the shell; s (not s * 0.62) keeps it to scale with the mouse.
- b01_bigFlex (`finger(pz[0], pz[1], 2.15, { s: s * 0.7, press: clamp(d / 3.0), len: 34 })`):
  -> `finger(pz[0], pz[1], 2.15, { s, surf: 0, press: clamp(d / 3.0), len: 34 })`. Check the "Pressed at the top" label
  (pz + 150, -120) still clears the finger at full scale.

## b02 (P2): 30-b02-clicks.js
- b02_cutouts, b02_seams (top views), b02_rails, b02_direct, b02_wedge: no change needed (they draw the new finger as
  called). Could: len 22/24 -> 30 on b02_cutouts, b02_direct and b02_wedge, so the joint and its creases show.
- b02_seamLoupe: replace `b02_fingerEndMM({ cx: 4.0, base: -dd, sink: 0.35, surf, w: 15.5, h: 12.5, mark: mk })` with the
  kit's end view, in the same part() (mm, canvas y down, so heights are -surf):
  `finger(4.0, -surf(4.0), 0, { view: 'end', s: 1, press: 0.23, floor: X => surf(4.0 + X) - surf(4.0), floorKey: 'loupe' + k.toFixed(2) + dd.toFixed(3), mark: mk && [mk[0] - 4.0, mk[1] - 4.0, mk[2]], yaw: 0 })`
  (press 0.23 = b02's 0.35 mm sink; the kit's press 1 is 1.5 mm). The pad drapes into the seam's step from the floor; the
  red pinch is `mark`. Inside part() pass s: 1: the kit reads the true scale from the transform.
- b02_flush: the same swap for the middle finger's pad (`b02_fingerEndMM({ cx: Q.fu, base: S0.top(Q.fu), sink: 0.3,
  surf: S0.top, ... mark: mk })` inside `G.scale(-1, 1)`): `finger(Q.fu, -S0.top(Q.fu), 0, { view: 'end', s: 1, press: 0.2,
  floor: X => S0.top(Q.fu + X) - S0.top(Q.fu), floorKey: ..., mark: ..., yaw: 0 })`. The ring finger's call
  (`finger(pS[0], pS[1], -Math.PI / 2, { s, ..., view: 'end' })`) needs no change: the new end view turns the pad to the
  wall and the finger rises up behind it.
- b02_fingerEndMM, b02_fingerFront: delete once swapped (b02_fingerFront is already unused; the kit's end view draws the
  finger rising behind the tip that it was for).

## b03 (P2): 30-b03-switch.js
- b03_side (`finger(fp[0], fp[1], -Math.PI / 2, { s: est.s, press: pr.d, alpha: ia * 0.96, len: 40 })`): add
  `digit: 'thumb'` (today the index finger scaled up: the thumb is 20.7 mm at its joint with a broad nail).
- b03_debounce, the drag (`finger(fx, by, 0.16, { s: 2.2, press: 1, view: 'side', alpha: kd })`): add `surf: 0` (the
  button is level; without it the pad flattens on a line 9° off it).

## b05 (P4): 30-b05-shell.js
All four presses tilt the finger 24° onto a level strip; add `surf: 0` so the pad lands flat on it, and drop the glow.
- b05_material: `finger(st.top[0], st.top[1] - 2, 0.42, { s: 4.5, press: kp, len: 16, alpha })` ->
  `finger(st.top[0], st.top[1], 0.42, { s: 4.5, surf: 0, press: kp, len: 30, alpha })`.
- b05_cubed: remove `G.save(); G.shadowColor = rgba(C.ink, 0.6); G.shadowBlur = 10;` ... `G.restore()` round the call
  (the night finger is lit now; the glow was R-b05-2's stopgap) and add `surf: 0`.
- b05_nopick: the same (glow out, `surf: 0`); len 13 -> 24 if the frame allows.
- b05_hotspot: add `surf: 0`; `s: c.s * 0.62` -> `s: c.s` (to scale) unless it hides the hot spot.

## b06 (P4): 30-b06-lattice.js
Fingers pointing straight down (PI/2) poke with their very end. A press is the pad at a slant:
- b06_press, b06_light's press, b06_arch, b06_thrust: `finger(c[0], c[1], Math.PI / 2, { s, press, len: 15 or 16 })` ->
  `finger(c[0], c[1], Math.PI / 2 - 0.45, { s, surf: 0, press, len: 30 })` (the arch's crown is level).
- b06_lattice's classroom straws (`finger(D[0] - 9, D[1], 0, { s: 4.2, ... })`, twice): pushing a corner sideways is a
  poke: `finger(D[0], D[1], 0, { s: 4.2, surf: Math.PI / 2, ... })`.
- b06_egg ("squeezed end to end between thumb and finger"): `finger(cx, cy - H / 2, Math.PI / 2 + 0.6, { s: 4.6, surf: 0,
  press: k, len: 30, alpha: a })` and `finger(cx, cy + H / 2, -Math.PI / 2 + 0.6, { s: 4.6, surf: 0, digit: 'thumb',
  press: k, len: 30, alpha: a })` (no flip needed: with surf the kit puts the pad on the egg).

## b07 (P4): 30-b07-board-shape.js
- b07_arms (`finger(pl, 0, { view: 'top', ... })`, `finger(pr, Math.PI, { view: 'top', ... })`): a squeeze is the thumb
  and ring finger lying along the sides, pads in, not two fingertips poking the edges nail-up:
  `finger(pl[0], pl[1], -Math.PI / 2, { s: est.s, digit: 'thumb', press: 0.6, alpha: kf, len: 30 })` and
  `finger(pr[0], pr[1], -Math.PI / 2, { s: est.s, flip: true, press: 0.6, alpha: kf, len: 30 })`.
- b07_secHands: `fing = 0` ("end-on fingertips read as ear muffs") can come back to 1: the new end view turns the pad to
  the side and rises behind; check at the slide's size.
- b07_seamInset (1.6 px/mm): no change needed. Could: `floor: X => (X > (mid - xf) / 1.6 ? -st / 1.6 : 0)` so the pad
  drops at the step.
- b07_newtTile: "a fingertip sliding over a mouse is that ball": draw the fingertip there (the ball stays in the classroom
  panel): `finger(fx, fy, angN, { s: 7.6, view: 'end', press: 0.3, len: 28 })` with angN the profile's normal turned so
  the pad faces it (ang = atan2 of the tangent), riding the profile, leaving along the tangent where it flies off.

## b08 (P2): 30-b08-surface.js
- b08_grip: the fingertip fades out as the push lands and only its print is left. Keep it, seen through:
  `finger(home[0], home[1], -Math.PI / 2, { s, view: 'top', press: 0.6, ghost: ep(t, 1.3, 1.7) * 0.8 })` (no alpha fade).
- b08_uv: no change.
- b08_tape's b08_tip: its front is a 1.6 mm round with an S-kink (a blob). Use the kit's pad profile for the front:
  `fingerPad(u)` = the pad's height above its lowest point at u mm back from the tip (index; 0 at 7.2 mm back).
- b08_print, b08_gripmap: the print is the contact, keep it. Could: the thumb as a ghost over b08_gripmap's print.
