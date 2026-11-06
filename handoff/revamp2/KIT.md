# THE MOTION KIT: deck/src/06-motion.js

One visual language for every slide of the film. Use these instead of private versions. Everything here is a pure
function of slide time `t`, works on both grounds (paper and night), and draws on the deck's own primitives (01-core,
03-parts, 04-ui). The standard it serves is common.md M1 to M10: read that first; this file is how to meet it.

**You don't need to own the kit to use it.** It is in the builders' snapshot (deck/.snapshot/src/06-motion.js), so your
usual build already includes it: `python3 tools/build.py main --out=<code> --own=<your file>`. The test page and the
exemplar: `python3 tools/build.py kit --own=06-motion.js,19-kit-test.js` → dist/kit.html (slides `kit_*`; frames with
`node tools/shoot.js $PWD/dist/kit.html <dir> 0 kit_mouse_n:3 ...`). The API is stable: functions are added, never renamed
or changed; improvements are listed under **Changes** at the end.

---

## 1. The shape of a slide (M3, M6), in kit calls

```js
S({ id: 'bNN_example', ch: 'click', theme: 'night', title: 'The concept, named', settle: 9, draw: t => {
  header(t, 'The concept, named');                                      // frame one: the header and the subject (G9)
  captions(t, [[0.3, 'Where it happens, and what most mice do there.'], [1.8, 'What goes wrong.'], [4.8, 'What Theseus does.']]);
  const box = [80, 250, 1120, 640];
  /* 0 to 1.4 s: where on the mouse (M4). Neutral ink while the rival comes first; one push-in */
  const est = establish(t, 0, box, { view: 'top', hi: ['trigL'], col: 'ink', focus: 'trigL' });
  /* one input for both (M3): pressed at 1.5 s, held through the wipe, let go, pressed again on Theseus and held */
  const d = pressCurve(t, 1.5, { hold: 2.85, up: 0.25 }) + pressCurve(t, 5.0, { hold: 99 });
  /* 1.5 to 3.3 s: the rival failing, named; 3.3 to 4.2 s: in place, it becomes Theseus behind a thin blue line.
     drawPart is your own drawing in mm, in the establish camera; stage-px things (arrows, tags, pointer) go at est.P(...) */
  wipeTo(t, 3.3, 0.9, box, () => est.draw(() => drawPart('rival', d)), () => est.draw(() => drawPart('theseus', d)), { rival: 'Most mice' });
  /* by about 7 s: the payoff, by how much, and what the player gets (rival and ours: your sourced or derived values) */
  verdict(t, 5.3, 1280, 790, { from: RIVAL, to: OURS, unit: 'mm', dec: 1, label: 'What you measure', better: 'lower', who: ['Most mice', 'Theseus'], net: 'What the player gets' });
} });
```

A complete one is on the test page: `kit_demo` (dist/kit.html), generic on purpose (b02 owns the real cutout slide): the
whole mouse from the front with the left button lit, one push-in, the rival's button rolling under a pointer's press with
its front edge tilting off a dashed level line, the wipe under the same held press to Theseus's going straight down, a
panel from above that shows the cause (the curved bend line straightening as the wipe crosses), and the verdict. Read its
code in deck/src/19-kit-test.js (`kx_*`): your detail is drawn in mm inside `est.draw`, and stage-px things (arrows, tags,
the pointer) outside it at `est.P(...)`.

The timeline the kit's defaults are tuned to (common.md M6):

| time | what is on screen | kit |
|---|---|---|
| 0 | header + the subject, already visible | `header`, `establish` (the mouse is drawn from t0), `chapterCard2` |
| 0.1 to 0.6 s | the part lights on the whole mouse | `establish` (lit 0.12 to 0.55 s after t0) |
| 0.4 to 1.4 s | one continuous push-in to the part; the locator appears | `establish` (hold 0.4, dur 1.0) |
| about 1.4 to 3.5 s | the rival's mechanism under a visible input, failing, named | `finger`, `forceArrow`, `pressCurve`, `spring`, `faultTag` |
| about 3.3 to 5 s | the same input on Theseus's, in place | `wipeTo` (0.8 to 1.0 s) or `abSplit` (side by side) |
| by about 8 s | the payoff number and the player's gain | `verdict` (lands about 1.8 s after its t0), `scaleNote` |
| settle (9 to 12 s) | the held, finished frame. Nothing important appears after it | |

A chapter card settles at 5.5 to 6 s; a dense demonstration at 11 to 13 s.

## 2. Rules of use

- **Colour (F35.1).** Neutral ink for *where* (`col: 'ink'`); yellow (`'rival'`, `C.second`) for the one rival you name;
  grey (`C.comp`) for other rivals; blue (`'hero'`, the default) only for Theseus's parts, results and marks; red (`'bad'`,
  `C.red`) only for a fault (a twist, a crack, a peak). Gradients only in type (`verdict` and `chapterCard2` do it for you).
- **Same input (M3).** Give the rival and Theseus the same press, the same load, the same camera: one `pressCurve` options
  object, one force, one `est`. `wipeTo` draws both every frame so nothing jumps; `abSplit` puts them side by side on one
  scale.
- **Establish, then push in (M4).** Every part-level view starts on `mouseSimple` with the part lit and pushes in once,
  continuously, with `E.cam` (about 1 s; never a cut, never two push-ins in a row). Start the problem as the push lands
  (about 1.4 s), so it is happening within the first second and a half (M6). The locator stays in a corner. The
  default focus boxes (`msBox(view, name)`) keep the part's surroundings in frame on purpose ("you can hardly tell which part
  of the mouse you're looking at"); pass your own `[x, y, w, h]` mm for a tighter shot only when the shot still reads.
- **Draw your detail in the same camera.** `est.draw(P => ...)` (or `establish`'s `draw` option) gives you the camera with
  mm units, so your part sits exactly on the mouse. Bring it in with `est.kd` (0 → 1 as the push lands). Inside, `lw(px)`
  keeps a line `px` wide at any zoom, and `part(mx, my, 1, () => clickMM(...))` places a 03-parts drawing at mm (mx, my).
- **Causal motion only (M2).** Everything that moves is moved by something visible: a `finger` rides the button down, a
  `forceArrow` grows with the load, a `spring` overshoots because a spring would. No pulsing, floating or idle loops.
- **Human scale (M5).** Say the force and the size in terms people know: `forceArrow(..., { N: 0.54, label: 'a click' })`,
  `scaleNote(x, y, 'about the weight of a 57 g egg', { lead: '0.56 N' })`. `SCALE` holds a few sourced references; cite
  others you add.
- **One headline per before → after (F14.10, F16.1).** `verdict` is it: the old value struck and grey, the new one counting
  from it in Theseus's gradient, which way is better written on it, the net never rounded up. One precision for both values
  (G5): pass `dec`. Never set a rival's number bigger than ours on the settled frame.
- **The shot (`shotInset`) is rare.** Only where a missed shot is the strongest case for the feature (common.md, F33.6: "what
  if this goes wrong and you miss"). At most one pair per slide, and on few slides in the whole film. Never as decoration.
- **The classroom version (F33.8).** `demoPanel` frames it quietly; cite the teaching source in `src`.
- **The ledger (flow).** Every chapter card is `chapterCard2` (it carries the ledger strip). The intro shows the ledger
  open; the close answers it (`ledger(..., { answered: 'all', turn })`). The words are a first draft in `LEDGER`: propose
  changes to the integrator rather than overriding them in your file.
- **The simplified mouse is the only whole mouse (F38.8).** Never a full detailed shell. Never peach skin (`finger` is mono
  grey, F9.24). The seam is the Sora's one split (F9.28, F11.3): `mouseSimple` already draws it right.
- **Rivals are drawn with `mouseRival` (FILM F9).** Any mouse that isn't Theseus: grey by default, yellow only for the one
  rival a slide names; never `mouseSimple`, which is Theseus alone.
- **The verdict's grammar (FILM F8, F15).** The struck grey value is always the rival's (or most mice's, or an old design's),
  the blue one Theseus's; an internal contrast (Theseus against its own simpler option) is two plain stats, each named.
- **Units.** A space before % and every unit ("17.6 %", "0.54 N"); ° and × attach. `verdict` does it for you.
- **Heat needs its key (F19.3).** Every slide that colours parts by heat draws `heatKey` beside them; where the slide talks
  about breaking, colour by the share of strength used (`feUse`, 07-sim.js).
- **Materials come from `SIM_MAT`** (07-sim.js, `matOf`): one value per material across the film; F41.1's two strengths
  (`feUse`, `feBreakAt`). The other conventions decided today (gf for clicks, the hard press, one test strip, the board's
  colours) are in common.md, "Added 11:20".

## 3. API

### Time

**`spring(t, t0, { f = 2.4, z = 0.6 })`** → a damped step 0 → 1 from t0 with a real spring's overshoot (z 0.6: about 10 %,
settled in about 0.45 s; z 0.35 snappy; z 1 none).
`const y = lerp(yUp, yDown, spring(t, 2.0, { f: 3, z: 0.45 }));`

**`springKeys(t, [[t, v], ...], o)`** → a value driven through several targets by one spring (each step keeps the motion of
the last). `const x = springKeys(t, [[0, 0], [1.2, 40], [3.0, 0]], { f: 2, z: 0.7 });`

**`pressCurve(t, t0, { down = 0.12, hold = 0.32, up = 0.16, bounce = 0.05 })`** → a press's depth 0 → 1 → 0: the finger
accelerates in, the button bottoms out with a small rebound, holds, springs back.
`const d = pressCurve(t, 2.4); finger(p[0], p[1] + d * travelPx, 0, { s: est.s, press: d });`

**`pressInfo(t, t0, o)`** → `{ d, phase: 'idle'|'down'|'hold'|'up'|'done', tBottom, tUp, tEnd }`, to time what the press causes.

**`pressCross(t0, o, frac = 0.7)`** → the time the press first reaches depth `frac` (where a switch actuates: the GT01's
0.35 mm of 0.5 mm is 0.7). `const tClick = pressCross(2.4);`

**`beats(t, [[t0, dur], ...])`** → `{ i, k, ks }`: the beat playing, its progress, every beat's progress.

**`stagger(t, t0, i, step = 0.09, dur = 0.55, e = E.snap)`** → item i of a set arriving one after another.

**`recount(t, t0, from, to, { dur = 1, dec })`** → a string re-counting from the old value to the new one, one precision.

### Camera

**`cam(t, [[t, cx, cy, s], ...])`** → `{ cx, cy, s, k, i }`: the camera centre (mm) and scale (px per mm). Between keys it
eases with `E.cam` as a zoom about the one point that stays still on screen, so a push-in travels straight at the part.

**`camFit([x, y, w, h] mm, box px, pad = 0.08)`** → `{ cx, cy, s }` that frames the rectangle in the box.

**`withCam(c, box, (P, c) => { ... })`** → draws in mm under the camera, clipped to box; `P(mx, my)` gives stage px.
`withCam(cam(t, keys), box, P => mouseSimple('left', { hi: ['side'] }));`

### The simplified mouse

**`mouseSimple(view, o)`** draws the film's one simplified Theseus in mm at the current transform (inside `part()`,
`withCam()` or `establish()`). Traced, not drawn by hand: the top is the key plan's Sora outline (SORA_HALF), the side and
the front are the 3D shell's flat twin (deck/geo2d/shell.json), smoothed and scaled to 119.3 × 62.4 × 39.9 mm (F12.11,
`MS_DIMS`). Key lines only: the one centre split with the wheel in it, the straight rear cutout, the triggers, the wheel,
the side buttons, the skirt line, the skates, the lens window. The lens window and the dots by it are read from the 3D
twins, so H1's move of the sensor reaches every slide.

- views: `'top'` (nose up, the user's left on the left: the key plan's frame), `'bottom'` (nose up, seen from below: the
  user's left on the right), `'left'` = `'side'` (from the side-button side, nose LEFT, as the Sora's product shots),
  `'right'` (the other side, nose RIGHT, as the deck's click sections), `'front'` (facing the nose; the user's left on the
  viewer's right).
- frames (mm, y down): top/bottom have the key plan's origin (the sensor near 0, 0; the rear cutout at y = -4.85, the nose
  at -59.6); the side and front views have y = 0 on the pad (the top of the hump at y = -39.9) and x = 0 under the sensor
  (side) or on the centre line (front).
- parts you can light (`hi`): `shell`, `triggers`, `trigL` (the user's left), `trigR`, `seam` (the centre split), `rear`
  (the straight rear cutout), `wheel`, `side`, `side1` (front side button), `side2`, `sensor`, `skates`, `board`,
  `battery`, `antenna`, `hump`, `sides` (the grip sides), `nose`, `tail`, `usb` (front view). Not every part exists in
  every view (the side buttons only on 'left', 'top' and 'front').
- `o = { hi: ['triggers'] or { triggers: 'rival', wheel: 'hero' }, col: 'hero' | 'rival' | 'bad' | 'ink' | a colour, lit
  (0..1: the light coming up), dim (0.42: unlit lines while something is lit), lineA (all lines' alpha), alpha, show:
  ['board', 'battery', 'sensor', 'skates', 'antenna'] (hidden parts, dashed), hide: ['rear', 'seam', 'triggers', 'skirt',
  'wheel', ...] (lines or parts left out because your own drawing replaces them, e.g. a rival's curved cutout), reveal
  (0..1: the outline drawn on), fill, lw (outline px, 2), dimFill (0..1) }`
- returns anchors in stage px: `m.at('wheel')`, `m.P(mx, my)`.

`part(960, 560, 5, () => mouseSimple('top', { hi: ['rear'], col: 'rival' }));`

**`mouseFit(box, view, o)`** → the whole mouse fitted into a stage box; returns the anchors and `s` (px per mm).
`const m = mouseFit([1040, 300, 720, 520], 'left', { hi: ['side'] }); callout(t, 1, m.at('side1'), 'Front side button');`

**`msBox(view, name)`** → a part's focus rectangle (mm) for a push-in (no name: the whole mouse). **`msAt(view, name)`** → a
named point (mm): `nose`, `tail`, `hump`, `wheel`, `trigL`, `trigR`, `seam` (top), `cut` (side: the rear cutout's top),
`trig` (side: on the trigger surface), `tip`, `side1`, `side2`, `sensor`, `base`, `skateF`, `skateR`, `usb`, `c`.

### The rival mouse (FILM F9)

The simplified mouse is Theseus, and only Theseus. **Any other mouse, named or "most mice", is drawn with `mouseRival`**: a
plain rounded body in the rival grey, sized from its dims, with no Theseus detail (no centre split, no rear cutout, no
triggers, no side buttons, nothing lit), so a viewer never mistakes whose mouse is whose. The shape is generic on purpose: it
stands for "a typical mouse", never for a named mouse's real outline (where a slide needs a real outline, say b01's X2F cut,
trace it in your file from a sourced drawing).

**`mouseRival(view, o)`** draws in mm at the current transform (inside `part()`, `withCam()`, `establish`'s draw), in
**mouseSimple's frames**, so a rival drops in where Theseus was drawn: `'top'` (nose up, the user's left on the left; the
length's middle at y = 0, the nose at −L/2), `'bottom'` (from below: the user's left on the right), `'left'` = `'side'`
(nose left) and `'right'` (nose right) with the pad at y = 0 and the length's middle at x = 0, `'front'` (facing the nose:
the user's left on the viewer's right; x = 0 on the centre line, the pad at y = 0).
- `o = { dims: [L, W, H] mm (default RV_DIMS, a typical 120 × 63 × 39), hump (0.58: where the hump peaks, a fraction of the
  length from the nose; side views), col: 'grey' (the default: C.comp's family, any rival) | 'rival' (the one rival you
  name, C.second) | 'bad' (only when the whole body is the fault) | a colour (the outline), show: ['board', 'battery',
  'switches', 'sensor', 'port'] (hidden parts dashed at a typical mouse's places; 'port' is the front view's cable port),
  hide: ['wheel', 'skates', 'sensor', 'base', 'nose'], fill, line, lw (2), alpha, lineA, reveal (0..1), dimFill }`
- it draws the body, the wheel (in the side views only its cap above the shell), the skates (side, bottom, front), the
  sensor's window from below, the base plate's edge (bottom) and the nose's front edge (front). Nothing else.
- returns `{ view, P(mx, my), at(name), box, pts, dims }`: `pts` is the outline in mm (to bow it under a press or clip to it).
- anchors (`m.at(name)`): `c`, `nose`, `tail`, `hump`, `wheel`, `sensor`, `cable` (the cable exit), `switchL`, `switchR`,
  `switches` (top, bottom, front; in the side views `switch`: the main switch's top), `btnL`, `btnR` (`btn` in the side
  views: where a finger presses; `trigL`, `trigR`, `trig` answer too, so code written against mouseSimple keeps working),
  `sideL`, `sideR`, `battery`, `board`, `skateF`, `skateR`, `base` / `pad`.

**`rivalFit(box, view, o)`** → the rival fitted into a stage box (as `mouseFit`); returns the anchors and `s`.
`const m = rivalFit([80, 300, 420, 560], 'top', { show: ['switches', 'sensor'] }); callout(t, 1, m.at('switchL'), 'Optical switch');`

**`rvBox(view, name, o)`** / **`rvAt(view, name, o)`** → a rival's focus rectangle / named point in mm (as `msBox` /
`msAt`; `o` carries `dims` and `hump`). Boxes: `nose`, `tail`, `wheel`, `cable`, `switches`, `switchL`, `switchR` (`switch`
in the side views), `sensor`, `battery`, `board`, `hump`, `skates`, and the whole mouse with no name.
`part(xm, yc, s, () => mouseRival('top', { dims: [120, 62, 38] }), { rot: Math.PI / 2 }); const nose = xm + 60 * s;   // nose right`

Rules: one rival grey across the film; yellow only for the one rival a slide names and beats (F35.1); red only when the
whole body is the fault (a whole-shell flex), otherwise mark the fault on it at an anchor (`faultTag`). Never light
Theseus's parts on a rival, and never draw a rival with `mouseSimple`. The test page shows every view: `kit_rival_n`,
`kit_rival_p`, `kit_rival_dims` (build `python3 tools/build.py kit --own=06-motion.js,19-kit-test.js --out=<you>` →
dist/kit-<you>.html).

### Place

**`establish(t, t0, box, o)`** → the opening move of a part-level slide: the whole mouse in `box` from t0, the part lit
(0.12 to 0.55 s), one push-in (from t0 + hold for dur), the locator. `o = { view, hi, col, focus (a part name or
[x, y, w, h] mm; default the first lit part), hold (0.4), dur (1.0), pad, fpad, fade (0.4: how far the mouse's lines dim as
the push lands, so your detail leads), dimFill, locator ('tr' | 'tl' | 'br' | 'bl' | false), locW, mouse (more
mouseSimple options), draw(P, c, k) }`. Returns `{ P, s, k, kd, cam, box, done, draw(fn) }`.
`const est = establish(t, 0.1, [80, 260, 1100, 700], { view: 'top', hi: ['rear'], col: 'ink', focus: 'rear' });`

**`locator(t, t0, x, y, w, view, focusRect, o)`** → the small "you are here": the mouse at width w on a small tile, the part
lit, a blue box on the focus. `establish` draws it for you.

### Agents and forces

**`finger(x, y, ang, { s = 3.2, press, view = 'side' | 'top' | 'end', len = 46, alpha, flip, surf, digit, floor, floorKey, mark, ghost, flex, pitch, yaw, lod })`**
→ a fingertip drawn from one anatomical model, to scale, in the deck's line style (F49.1, Brock's pick "A Line": outlined,
a lit and a shadow side in two flat greys), mono grey on both grounds (F9.24). (x, y) is the contact on the surface, `ang`
the way it points (0 right, PI/2 down; pointing left it mirrors so the pad stays down); move (x, y) with the part you
press. `s` is px per mm: pass the part's own scale, so the finger is to scale with what it presses (an index fingertip is
14.3 mm across at the nail and 16 mm at the joint, its nail 11.2 by 12.7 mm: AIST hand data x 1.03); inside part() or a
camera pass s in its units (1 in mm). The last joint is a little flexed, so only the fingertip's pad reaches the surface.
`press` 0..1 moves the bone and nail 1.5 mm toward the surface: the pad flattens on it (about a 10 mm contact, as at 1 N),
the skin beside bulges, the nail stays rigid and pales from its free edge.
- `view: 'side'` (default): with no `surf` it rests along `ang`, as before. **Pass `surf` (the surface's direction on the
  stage) whenever the finger meets a part at a slant**: the fingertip meets it at ang - surf and the pad lands flat ON it;
  the side the finger points into is the pad's side (a finger pressing up into an egg, or poking a wall, needs no `flip`).
- `view: 'top'`: from above, the nail toward the viewer; (x, y) the pad's centre.
- `view: 'end'`: the fingertip coming toward the viewer, pitched onto the surface (`pitch` 0.5 rad), so its nail shows
  foreshortened and the finger rises behind it (no more "grey blob"); `ang` turns it about its own axis (0 the pad down,
  -PI/2 the pad facing right, against a wall).
- `digit: 'thumb'` (20.7 mm at its joint, a broad nail and its lunula). `len` (mm shown; the far end fades over its last
  30 %, at most 12 mm): under about 24 shows only the fingertip, 30 to 40 shows the joint, which is what reads as a finger.
- `floor` (X mm along the surface from the contact → the surface's height, + toward the finger) with `floorKey` (a
  string that changes when the floor does): the pad drapes over a step. `mark: [X0, X1, colour]`: a stretch of the pad
  (a pinch). `ghost` 0..1: see-through over what is under it.
- Returns `{ contact: [p0, p1], tip }` in the caller's units. Detail follows the size on the stage (from 2.6 px/mm all of
  it; 1.2 to 2.6 the nail and the two greys; below, the silhouette and the nail).
`finger(p[0], p[1] + d * 9, -0.06, { s: est.s, press: d });` `finger(c[0], c[1], Math.PI / 2 - 0.45, { s, surf: 0, press: k, len: 30 });`

**`fingerPad(u, digit)`** → the pad's height (mm) above its lowest point, u mm back from the tip (for a section drawn at
another scale, as b08_tape's).

**`forceArrow(x, y, ang, len, { N, label, k | t + t0 + dur, color, w, dec, side })`** → a force whose tip sits on the point it
acts on and whose length grows with it, labelled in newtons as it grows (red for a fault's force, blue for Theseus's).
`forceArrow(p[0], p[1], Math.PI / 2, 120, { N: 0.54, label: 'a click', t, t0: 1.8 });`

**`faultTag(t, t0, p, label, o)`** / **`fixTag(...)`** → the rival's fault named in red / Theseus's fix in blue, on the
drawing (`callout`'s style). `faultTag(t, 2.6, est.P(-12, -6), 'Twists');`

The pointer: the deck's `cursorAt(t, keys, clicks)` for anything moved or dragged (F2.43).

### Compare

**`abSplit(t, t0, [x, y, w, h], { rival: 'Sora V2', left = 'Most mice', right = 'Theseus', note, split = 0.5, gap = 40,
rivalCol })`** → two panels on one scale with a hairline between and a label over each; returns `{ L, R }` rects.
`const { L, R } = abSplit(t, 0.4, [80, 280, 1760, 600], { rival: 'Sora V2', note: 'Same press, same scale' });`

**`wipeTo(t, t0, dur, [x, y, w, h], k => drawRival(), k => drawTheseus(), { rival, right, labels })`** → in place, the
rival becomes Theseus behind a thin blue line crossing left to right; both draw every frame with the same input. Keep both
drawings inside the rect horizontally. Returns the wipe's progress.

**`verdict(t, t0, x, y, { from, to, unit, dec, label, better: 'lower' | 'higher', who: [rival, 'Theseus'], net ('auto' |
string | false), netWord, size = 150, dur = 1, morph = true, align, maxW })`** → the one before → after headline: the old
value appears where the new one will stand, peels off to the left, greys and is struck; the big figure counts from it to the
new value and turns Theseus's gradient as it lands (t0 + about 1.8 s); the net (by how much, from the true values, rounded
toward zero) lands under Theseus's value; the label reads "Peak experienced stress (lower is better)". Units `%`, `°`, `×`
sit tight; a `×` comparison gets no extra net. (x, y) is the row's left edge and the big figure's baseline; the label sits
about 0.78 × size + 26 px above it, the names and the net about 90 px below.
`verdict(t, 6.4, 120, 860, { from: 48, to: 21.3, unit: 'MPa', label: 'Peak experienced stress', better: 'lower', who: ['Most mice', 'Theseus'] });`

**`betterTag(t, t0, x, y, 'Lower is better', 'd' | 'u' | 'l' | 'r')`** → which way is better, on a chart.

**`heatKey(t, t0, x, y, w, o)`** → the heat scale's key (M's convention; F19.3: the squared scale must be disclosed). Every
slide that colours parts by heat draws one beside them: the deck's heat colours as a bar and what they mean under it.
Where the slide talks about breaking, colour by the share of strength used (`feUse`, red at 1) and key it so (mode `'use'`,
the default: 0 · 50 % · Breaks); where it compares stress as stress, by MPa (`mode: 'mpa', max`); against a frame's own
peak, `mode: 'peak'`. Pass the slide's `gamma` (the shell chapters' squared scale: `SHL_GAMMA`, 2): each value sits at its
true place on the bar in the colour it really gets, and the title says "colour squared". `o = { mode, max, gamma, title,
ticks ([0, 0.5, 1]), dec, alpha }`; returns `{ w, h }` (about 60 px tall). Test slides `kit_heat_n`, `kit_heat_p`.
`heatKey(t, 2.0, 1580, 720, 240, { gamma: SHL_GAMMA });` (colour by use: `feDraw(Object.assign({}, r, { sig: feUse(r).map(u => Math.pow(u * k, 2) / k) }), P, { load: k, smax: 1 })`)

### The shot

**`shotInset(t, t0, x, y, w, h, { miss, drift, dir, at = 1.0, label, result })`** → a crosshair flicks onto a target and the
click lands at t0 + at; the rival's fault pulls it wide (MISS, red ×), Theseus holds (HIT, a blue ring). Use a pair, same
`at`: `shotInset(t, 2, x, y, 300, 200, { miss: true, label: 'The click twists your aim' })`.

### Teaching

**`demoPanel(t, t0, [x, y, w, h], { label = 'The classroom version', src })`** → a quiet frame drawn round a clean field (the
stage grid stops at its edge) with a small label and the teaching source; returns the inner rect.
`const r = demoPanel(t, 0.3, [80, 280, 700, 560], { src: 'Feynman Lectures 1964' });`

**`scaleNote(x, y, text, { lead, t, t0, size = 25 })`** → one quiet line of human scale after a short rule.

**`SCALE`** → sourced references: `hair` (0.07 mm), `paper` (0.1 mm), `card` (0.76 mm, ISO/IEC 7810), `penny` (1.52 mm,
2.5 g), `quarter` (24.26 mm, 5.67 g; US Mint), `click` (GT01 55 gf = 0.54 N, Gateron claim), `egg` (57 g = 0.56 N, USDA
large). Each has `say` (words for the slide) and `src`.

### Flow: the compromise ledger and the chapter card

**`LEDGER`** → `[{ ch, name, comp, ans }]` for intro (Weight), click, glide, shell, surface, elec, shape, own: the compromise
most mice make, and Theseus's answer. First draft; propose changes to the integrator.

| chapter | most mice | Theseus |
|---|---|---|
| Weight (intro) | Light, by giving up battery life | 29.31 g, 200 h of battery |
| Clicks | A click that changes with where you press | Lands the same, every time |
| Glide | Skates and sensors that cost your aim | Aim that goes where you put it |
| Shell | Light shells that flex, creak and crack | Light, without the flex, creak or crack |
| Surface | Tape that peels, coatings that wear | Grip that holds, and stays |
| Electronics | Wireless that costs latency, battery or weight | Wireless with no penalty |
| Shape | Shapes chosen by taste, not measured | A shape measured on hands |
| Ownership | Glued, soldered, thrown away | Made to last, and to open |

**`ledger(t, t0, [x, y, w, h], { focus, answered: 'all' | 'before' | [keys] | 'none', turn, turnStep, rows })`** → the
ledger as a list: open compromises in ink with a red mark (the focused one in red), answered ones struck with the answer in
blue. With `answered: 'all', turn: 2` the rows turn one after another (the close).

**`ledgerStrip(t, t0, x, y, w, { focus, turn })`** → one bar per chapter, its name under it: blue answered, red the focus
until it turns blue at `turn`, grey ahead.

**`chapterCard2(t, { ch, name, compromise, answer, list: [[ideas, 'what'], ...], part: { view, hi, show } | (t, box, k) =>
{}, turn = 2.1, count })`** → every chapter opener: the chapter's number and name; "MOST MICE" and the compromise in red,
struck as "THESEUS" and the answer land in blue at `turn`; the ideas (up to 9) along the bottom; the ledger strip; the part
on the right (the simplified mouse with it lit, neutral until the answer, then blue; or your own drawing). Use it with
`S({ id, ch, card: true, first: true, theme, title, settle: 5.5, draw: t => chapterCard2(t, {...}) })`.

## 4. Changes
- 2026-11-06 08:01: first release (the API above).
- 2026-11-06 08:14: `establish` defaults faster (hold 0.55 → 0.4 s, push 1.1 → 1.0 s), so the problem can start by about
  1.4 s (M6); pass `hold` and `dur` to keep the old pace. Added `finger` view `'end'` and `mouseSimple` option `hide`.
  The exemplar `kit_demo` is on the test page.
- 2026-11-06 08:18: LEDGER answers for Clicks and Shell now match the chapter-card titles in REVAMP.md ("Lands the same,
  every time", "Light, without the flex, creak or crack"). `finger` side view: a truer profile (the back curves over the
  nail, the pulp rounds past it). `wipeTo` trims ?qa=1 text records to each side of the line, so tools/qa.js no longer
  reports the two drawings of a wipe as overlapping.
- 2026-11-06 08:20: LEDGER compromises for Glide, Electronics and Shape now use the builders' briefs' words ("Skates and sensors
  that cost your aim", "Wireless that costs latency, battery or weight", "Shapes chosen by taste, not measured"). The test page
  has `kit_card_e` (a card with nine ideas) and `kit_zoom` (the outlines and the finger at push-in zoom).
- 2026-11-06 08:22: KIT.md only: the slide skeleton in section 1 is generic now and paced to the current defaults (no code change).
- 2026-11-06 08:40 (integrator): `mouseSimple` is drawn at the scan's own proportions, 119.2 × 62.5 × 38.1 mm (`MS_DIMS`), per Brock's F12.11 ("Use the numbers only"): the hump's top is at y = -38.1 in side and front views. Say Theseus's 119.3 × 62.4 × 39.9 in words (`THS.dims`). Use `msAt`/`msBox`/`MS_DIMS`, never literal heights.
- 2026-11-06 08:42 (H1): `mouseSimple` reads the hardware's places from `KEY_PARTS` (03-parts.js, generated from the 3D assets by
  deck/tools/geo2d/key_parts.py; `keyPlanMM` reads the same object): the board is plan 5's outline (mouse z -10.49 to 48.57,
  was a rounded box to 49.6), the sensor and lens window at mouse z 16.57 (were 1.12), the lens's two dots at z 22.87 and 9.87,
  the antenna keep-out forward of the module (z 5.07 to 9.37), the battery 2.23 mm further back (key y 12.45 to 37.45; side
  view 5.46 to 9.46 mm up). `MS_BATTERY` and `MS_CORNER_DOTS` remain, derived from `KEY_PARTS`; read `KEY_PARTS` in new code.
  No signature changed.
- 09:05 integrator (FILM F1, one ledger): LEDGER's compromises reworded so the intro's six flagship trades fit them
  (Weight: "Light or long-lasting: pick one"; Clicks: "A click that changes with where you press, or costs battery";
  Shape: "Shapes cut down for weight, or chosen by taste"). New `ledgerFlag(ch)`: the flagship sentence for a chapter,
  read live from b01's B01_TRADES (Weight: Pro X3 Superstrike and HTS Ultra 8K; Clicks: Viper V4 Pro; Shell: UltralightX;
  Shape: X2F CrazyLight; Electronics: XA25; glide, surface, ownership: none). chapterCard2 prints it small under the
  compromise (o.flag: a string to override, false to hide); the answer moves down 34 px when there is one. Snapshot updated.
- 2026-11-06 09:44 (F0c, the chapter flight; no signature changed): **`CARD2`** (new): while `chapterCard2` draws its part,
  every `mouseSimple` call is recorded (view, transform, options) in `CARD2.rec[slide id]`, so the player's chapter flight
  (20-app.js, F40.2) lands exactly on the card's own mouse and leaves from it going back; while a flight is on screen
  (`CARD2.hide`) the card's kit mouse is left to the flight, which draws the same one. Nothing to do in a card: a part given
  as `{ view, hi }`, or drawn in your own function with `mouseFit`/`mouseSimple` (as b09's is), is seen; a part drawn some
  other way (b11's hand-drawn outline) gets a soft cross-fade in the card's part box, or the slide can say where its mouse
  sits: `flight: { view, box: [x, y, w, h], pad }` on the S({...}) object. `chapterCard2`'s part now draws through a helper,
  `chapterCardPart(t, o, box, ka, kt)` (same drawing). **`mouseSimple('bottom')`**: two new parts to light, `base` (the base's
  face and its edge) and `screws` (the board's four M2 screws from below, at `KEY_PARTS.board.holes`); a part flagged
  `opt` (the screws) is drawn only when lit or in `show`, so existing bottom views are unchanged.
- 2026-11-06 09:52 (K, FILM F9; additive): **`mouseRival(view, o)`**, **`rivalFit(box, view, o)`**, **`rvBox`**, **`rvAt`**,
  `RV_DIMS`: the neutral rival mouse (§3, "The rival mouse"). Any mouse that isn't Theseus is drawn with it from now on
  (b01_compromise's trade icons, b09_chip / b09_second's rival rows, b10_lights / b10_cable's V4 Pro, and any "most mice"
  whole-mouse view): same frames as mouseSimple, so the swap is the call's name plus `dims`. Test slides `kit_rival_n`,
  `kit_rival_p`, `kit_rival_dims`. tools/build.py: the `kit` target takes `--out=<name>` (dist/kit-<name>.html), so agents
  stop overwriting one another's dist/kit.html; without it the page is still dist/kit.html.
- 2026-11-06 10:08 (F0c, the hand-off; no signature changed): `CARD2.skip` and `msSameM(a, b)` (new). While the player's
  flight or hand-off draws a slide without its ground, it can name placements (view and transform) a slide has declared
  for its simplified mouse; a `mouseSimple` call at exactly one of them (scale within 0.2 %, offset within 0.75 px) records
  that it was drawn there and leaves the drawing to the player. This is how the player checks a declaration before it
  trusts it: a slide declares `handoff: { in, out }` (in-chapter hand-off; see DESIGN §11) or `flight` with `{ view, box,
  pad, focus }`, and a declaration the slide doesn't really draw is ignored (the film then dissolves or wipes as before).
  Applied to both deck/src and deck/.snapshot/src (the snapshot copy otherwise as the integrator left it at 09:53).
- 2026-11-06 10:30 (K; no signature changed) **`verdict`**: (1) the names under the values never overlap: the rival's name keeps
  to its own column left of the new value, set on two even lines when it is longer than the old value and the arrow (b11's
  "Plastic threads, ten re-screws" under a short "0"); only a single word too long for that moves Theseus's name right.
  (2) **A space before `%`**, as the film writes "17.6 %" and before every unit (SI Brochure 9th ed. §5.4.3, §5.4.7); only
  `°` (an angle) and `×` (a factor) attach. `%` keeps its large size. (3) `maxW` is the room for the whole row now (callers
  already pass the room to the margin): a row wider than it is set smaller, whole, instead of running past the margin
  (b01_density, b08_gripmap, b09_penalty, b09_second ran 25 to 72 px past RM). (4) With `align: 'right' | 'center'` the label
  keeps to the row's side. (5) The morph no longer doubles the old value while it peels off ("0.333", "NN", b08): the big
  figure hands over to the peeling copy and comes back counting once the copy has cleared; it lands at the same time as
  before (about 1.8 s after t0). The grammar is in the doc comment: the struck grey value is always the rival's (FILM F8, F15).
  Test slide `kit_verdict`. **`sentence`** (01-core.js): a sentence's first word with a capital inside it is a name as
  written and keeps its small first letter (iFixit, iPhone, eBay, mAh). **`breakdown`** (07-charts.js): its share column
  prints "12.3 %".
- 2026-11-06 10:50 (K, FILM F12, a must; no signature changed) **`chapterCard2`'s frame one is the thumbnail**: the label row
  (icon, "Chapter NN / NN", the idea count, no count-up), the name, its rule, "Most mice" and the compromise in red with
  its flagship line, and the ledger strip are fully set at t = 0, as header() is; in the film, the flight is their entrance
  (the player fades the card's content in as the mouse lands). The motion is the payoff: the strike and Theseus's answer
  at `turn`, the ideas, the ledger turning blue. The part's mouse is fully present from frame one and its part lights
  0.15 to 0.55 s (was 0.6 to 1.1; the mouse came up from 55 %). Checked: the seven film cards at t = 0 and settle (errs,
  qa clean), the flight b04_reports → b05_card and b08_wheel → b09_card lands pixel-exact (F0c's edges.js: max 0 and 2),
  and both reverse flights. A card whose part is your own function: draw it from frame one too (b02_card's GT01 fades in
  from 0.8 s).
- 2026-11-06 10:20 (H2, F42.1): the battery is set where the mouse balances at its centre. `KEY_PARTS.battery` moves 2.03 mm
  toward the tail (key y 12.45 → 14.48 to 39.48; mouse z −14.48 to −39.48), at the same height (side view 5.46 to 9.46 mm up),
  its front 3.99 mm behind the board's rear lobes. Brock's "about 5.9 mm forward and 1.5 mm up" was H1's balance model's
  answer; that model put the four screws at a bottom plate the mouse doesn't have and left the encoder out. Corrected, and
  with the side switches (F44.2) and the shell's four screw posts (an estimate until the 3D shell has them) added, the centre
  of mass lands at z 0 (3d/pcb/tools/balance.py). `mouseSimple`'s battery, `keyPlanMM`, `MS_BATTERY` and every slide that reads
  them follow (b01_battery, b09_card, b10_battery, b11_card, b11_repair, b11_battplug, b11_board). b07_balance still draws
  its own battery until P4 switches it to `KEY_PARTS`. Also: `k2_encMagFront` / `encoderMM` draw the axle 12 mm over the board,
  the mouse's height (was 11; the drawing is 1 mm taller at its feet); the wheel twin follows. The pcb twin's camera frame is
  pinned, so 2D board views don't move when the battery lead does. No signature changed; `MS_DIMS` untouched.
- 2026-11-06 11:00 (K; the shared solver, MODELS-AUDIT §1; F41.1) **07-sim.js**: **`feUse(r, ft, fb)`** (each element's use
  of its strength, 1 = it breaks: σ_axial / ft + σ_bending / fb at its worse end; default PP-C-20A's 120 / 207 MPa; an
  element may carry `el.ft` / `el.fb`; a rigid joint zone reports its rib's use) and **`feBreakAt(r, P, ft, fb)`** (the press
  that breaks a frame solved at P N; rigid zones left out). They reproduce M's numbers exactly (shlHot: 109.0, 93.9, 147.8 N;
  b06's strip as b06_util). **One value per material** in `SIM_MAT`, every shared file reading it (no private copies):
  PP-C-20A `ft` 120, `fb` 207; ABS `ft` 50 (yield), `fb` 82; magnesium AZ91D **44.8 GPa** (MatWeb, `shlMg`; makeitfrom's 46
  retired), `ft` 230, `fy` 150; FR4 **`E` 18 GPa across the weave, `EL` 20 along it**, `fb` 483 / `fbL` 552, `ft` 430 (Gund):
  the board's models take the lower (a board's weave can run either way; the film never takes the value that flatters
  Theseus's board), a slide ranking FR4 as a material takes the higher and says which. `matOf(key)` gives them in the old
  tables' units (GPa, g/cm³, rounded as printed). The shared sources now carry the bending strengths (`shlFr4` 552 / 483,
  `shlAbs` 82, `shlPc` 97): cite them instead of private copies. 10-d-shell.js: shlHot's `peak` is the solver's fibre peak
  (`r.smax`: 18.99 MPa, was the samples' 17.79, M's −6.3 %) and the work share is measured against it; SHL_STR, SHL_PPC,
  SHL_ABS, SHL_SPEC, TW read SIM_MAT; 10-d3-board.js and 12-20-shell.js too. On screen nothing in the film moves: the
  replaced shell slides read `peak`; b07's figures are the same at the printed precision (sides in 0.64 → 0.21 mm).
- 2026-11-06 11:15 (K, M's must on F19.3) **`heatKey(t, t0, x, y, w, o)`** (new, §3 Compare): the heat scale's key, by share
  of strength used (the default: 0 · 50 % · Breaks), MPa or against the peak, honest under the squared scale (`gamma`).
- 2026-11-06 11:35 (K; the player, 20-app.js, now K's) **The dissolve answers at once**: on one ground the film now fades the
  new frame in with `E.out5` over 0.45 s (was `E.io5` over 0.55 s, which showed nothing for about 0.2 s after a tap). About
  half the change shows by 50 ms and 95 % by 0.2 s; the two frames still share the stage for only about a tenth of a second.
  Checked: capture sheets b08_grip ↔ b08_gripmap both ways; live, stepping right and left (back: 52 % of the change at
  100 ms against 14 % before) and autoplay (moves on after its hold by the 0.45 s dissolve), no errors. DESIGN §7 and §11.
- 2026-11-06 11:05 (H3, F47.4; no signature changed) **The board is 0.6 mm**: Brock's "0.6 mm, 5.63 g" (a 0.6 mm two-layer
  board, half-ounce outer copper). One value for every drawing of Theseus's board: **`BOARD_T`** (0.6) and **`BOARD_TOP`**
  (5.03, its top face over the pad) in 03-parts.js, read from `KEY_PARTS.board.t` / `.top` (new fields, generated by
  key_parts.py from 3d/pcb/tools/board_geo.py's stack-up and pcb-layout.json). The top stays where it was (the shell's posts,
  the switches, the wheel's axle 12 mm up and the lens's focus are set from it); the underside comes up from 4.03 to 4.43.
  **`pcbSec(x0, x1, y0, th, o)`**: leave `th` out (null) for Theseus's board and it draws `BOARD_T`; a rival's board passes its
  own. Now at 0.6: `mouseSimple`'s side views ('left', 'right': the board dashed from 5.03 to 4.43, was 5.05 to 4.0),
  `clk_gt01MM`'s own board (was drawn 1.2), `clickMM`'s flat board (`drawClick`, was 1.2), `own_jointMM` (the screw seats on
  the thinner board: `OWN_SEAT` = 4.4 mm reach for the M2 × 5, was 4.0). Rival and generic drawings keep their own
  (`swMM`'s o.board, `sensorMM`, `railMM`, `wheelFrontMM`, `clk_hingeMM`, `mouseRival`'s board). Builders' own copies
  (b03, b04, b07, b10, b11) are listed in their review files (HARDWARE, H3): read `BOARD_T` / `BOARD_TOP`, never a literal.
- 2026-11-06 12:25 (FG, F49.1: "the fingers look really bad right now"; Brock's pick at ~12:10, "A Line"; no signature
  changed) **`finger` rebuilt** from one anatomical model in every view: the side silhouette through measured landmarks, the
  width from above, superellipse sections between, the nail a plate on the back (its free edge, lateral folds, the thumb's
  lunula), the joint's creases; the last joint flexed 11.5° so only the pad touches; the press moves the rigid part 1.5 mm
  and lays the pad on the surface. Sizes: AIST Japanese hand dimension data (Kouchi 2012) x 1.03 and Dandekar 2003; the
  press: Jindrich 2003 (1.7 to 2.0 mm of pulp at a tap's peak), Serhat 2022 (~10 mm, ~1 cm2 at 1 N). New options `surf`,
  `digit`, `floor`/`floorKey`, `mark`, `ghost`, `flex`, `pitch`, `yaw`, `lod`; returns `{ contact, tip }`; new `fingerPad`.
  Drawn whole into a layer and set down once (a clean fade; a partial alpha never shows the pieces through). Every call
  draws the new finger with no change; the calls that tilt it onto a level part need `surf`, and b03_side wants
  `digit: 'thumb'` (FINGER notes in work/review/b01, b02, b03, b05, b06, b07, b08, b12.md). Checked: errs ok on all 25
  slides that draw a fingertip (22 call the kit) in the 12:26 live build (107 slides) and on the kit page's kit_agents,
  kit_zoom, kit_demo and the new kit_finger_p / kit_finger_n (19-kit-test.js: every view, surf, the thumb, a floor, small
  sizes); a sweep of every slide at 0.5 s steps, no errors. Sheets: /home/claude/work/fg/sheets/fg_options.png (the
  options), fg_after.png (every changed slide), fg_after_zoom.png (each finger before and after). Applied to deck/src and
  deck/.snapshot/src (identical before; old copies in /home/claude/work/fg/backup/).
- 2026-11-06 12:33 (H3, F47.4; no signature changed) **The 0.6 mm two-layer board in 3D, and what it moves in 2D.** The 3D
  board (3d/pcb, plan 5 A and B) is rebuilt at 0.6 mm, two layers, half-ounce outer copper: re-routed on two layers (the
  long runs and power crossings on the bottom, around the underside art's QR, wordmark and fab block), DRC 0, every net
  routed, the ground one piece (new 3d/pcb/tools/gnd.py). Regenerated under the lock and copied to deck/.snapshot/geo2d:
  **GEO2D.pcb** (b09_radio from above, b11_board from below: the bottom's routes now show among the triangle mosaic, whose
  corners are joined so it is one ground; its fab line reads "2L 0.6mm ENIG"; the camera frame stays pinned), **GEO2D.wheel**
  (b08_wheel: the lighter encoder; its camera frame is now pinned too, tools/geo2d/extras.py --pin-wheel, so the view didn't
  move) and **GEO2D.board2d** (`boardMM`: the new copper on both faces; b07_arms). 03-parts.js: **`k2_encMagFront` /
  `encoderMM`** draw the lighter encoder (its nickel-silver frame dropped: no side tabs, no SMD feet, no top tabs; two
  moulded pegs into the board, a clear snap hook each side; b10_lights' `cover` anchor unchanged); **`boardMM`** draws the
  far layer's routes in x-ray whatever its name (L4 on two layers) and, from below, the bottom's own routes. errs clean on
  every slide that draws them. Before / after: /home/claude/work/h3/shots/zoom_*.png, cmp_b10lights.png.
- 2026-11-06 12:50 (H3, F47.4; new constant, no signature changed) **`BOARD_G`: the board's grams as built.** 03-parts.js:
  `const BOARD_G = KEY_PARTS.board.g` = **5.68** (g), beside `BOARD_T` / `BOARD_TOP`: the 0.6 mm two-layer board with
  everything the 5.6 g target covers (its parts, the wheel's encoder 0.475 and support 0.202 g included; F42.2). The
  target stays `THESEUS.pcb` (5.60): a slide says "5.68 g as built" against "the 5.60 g target". Source: 3d/pcb/tools/mass.py
  writes 3d/pcb/pcb-mass.json (new, committed; work/mass.json is scratch), deck/tools/geo2d/key_parts.py reads it into
  `KEY_PARTS.board.g` (the generator's output differs from the block in the file by that field only). No slide reads it
  yet: b01_budget's `B01_PCB_PATH.g` (5.63), b10_board and b11 are the polish owner's to switch. Built (all 30-*.js own,
  geo2d) and checked; in deck/.snapshot/src (identical to src before).
