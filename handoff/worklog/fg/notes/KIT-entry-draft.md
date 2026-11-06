### KIT.md §3 "Agents and forces": replacement text for `finger`

**`finger(x, y, ang, { s = 3.2, press, view = 'side' | 'top' | 'end', len = 46, alpha, flip, surf, digit, flex, pitch, yaw, floor, floorKey, mark, ghost, lod })`**
→ a fingertip drawn from one anatomical model, to scale and in the deck's line style (FEEDBACK F49.1, Brock's pick:
STYLE), mono grey with a lit and a shadow side on both grounds (F9.24). (x, y) is the contact on the surface; `ang` the
way the finger points (0 right, PI/2 down; pointing left it mirrors so the pad stays down). `s` is px per mm: pass the
part's own scale, so the finger is to scale with what it presses (an index fingertip is 14.3 mm across at the nail and
16 mm at the joint; its nail 11.2 by 12.7 mm: AIST hand data x 1.03). The last joint is a little flexed, so only the
fingertip's pad reaches the surface. `press` 0..1 moves the bone and nail 1.5 mm toward the surface: the pad flattens on
it (about a 10 mm contact, as at 1 N), the skin beside bulges, the nail stays rigid and pales from its free edge.
- `view: 'side'` (the default). With no `surf` it rests along `ang` as the old finger did (the pad flattens along ang).
  **Pass `surf` (the surface's direction on the stage) whenever the finger meets a part at a slant**: the fingertip then
  meets it at ang - surf and the pad lands flat on it; the side the finger points into is the pad's side, so a finger
  pressing up into an egg or poking a wall needs no `flip`. e.g. `finger(p[0], p[1], 0.42, { s, surf: 0, press: d })`.
- `view: 'top'`: from above, the nail toward the viewer; (x, y) the pad's centre.
- `view: 'end'`: the fingertip coming toward the viewer, pitched down onto the surface (`pitch`, 0.5 rad), so the nail
  shows foreshortened and the finger rises behind it; `ang` turns it about its own axis (0 the pad down, -PI/2 the pad
  facing right, against a wall). `yaw` (0.22 cos ang) shows a little of its side.
- `digit: 'thumb'`: 20.7 mm at its joint, a broad nail and its lunula.
- `len` (mm shown; the far end fades over its last 30 %, at most 12 mm): under about 24 shows only the fingertip; 30 to
  40 shows the joint, which is what makes it read as a finger.
- `floor` (a function: mm along the surface from the contact -> the surface's height, mm, + toward the finger) with
  `floorKey` (a string that changes when the floor does): the pad drapes over a step or a groove.
- `mark: [X0, X1, colour]`: a stretch of the pad, mm along the surface from the contact (a pinch, in red).
- `ghost` 0..1: see-through, to show what is under the fingertip.
- Returns `{ contact: [p0, p1] (the flattened stretch's ends), tip }` in the caller's units.
- The size on the stage sets the detail: from 2.6 px/mm everything (creases, lunula, folds), 1.2 to 2.6 the nail and the
  two tones, under 1.2 the silhouette and the nail. Inside part() or a camera, pass s in its units (1 in mm).
`finger(p[0], p[1] + d * 9, -0.06, { s: est.s, press: d })`; `finger(c[0], c[1], Math.PI / 2 - 0.45, { s, surf: 0, press: k, len: 30 })`.
**`fingerPad(u, digit)`** → the pad's height (mm) above its lowest point, u mm back from the tip (for sections drawn at
other scales, b08_tape's).

### KIT.md §4 Changes entry
- 2026-11-06 HH:MM (FG, F49.1 "the fingers look really bad right now"; Brock's pick: STYLE; same signature) **`finger`
  rebuilt** from one anatomical model in every view: the side silhouette through measured landmarks, the width from above,
  superellipse sections between, the nail a plate on the back (free edge, lateral folds, the thumb's lunula), the DIP's
  creases; the last joint flexed 11.5° so only the pad touches. Sizes: AIST Japanese hand dimension data (Kouchi 2012)
  x 1.03, Dandekar 2003; the press: Jindrich 2003 (1.7 to 2.0 mm of pulp at a tap's peak), Serhat 2022 (~10 mm, ~1 cm2 at
  1 N). New options `surf`, `digit`, `flex`, `pitch`, `yaw`, `floor`/`floorKey`, `mark`, `ghost`, `lod`; returns
  `{ contact, tip }`; new `fingerPad(u)`. Drawn whole into a layer and set down once (a clean fade, no see-through at
  partial alpha). The end view is new (pitched and rolled: no more "grey blob"). Old calls draw the new finger; the ones
  that tilt it onto a level part need `surf` (notes in work/review/b01, b02, b03, b05, b06, b07, b08.md, "FINGER").
  Checked: STATS. The options sheet: /home/claude/work/fg/sheets/fg_options.png.
