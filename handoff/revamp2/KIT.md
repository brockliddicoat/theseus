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

**`finger(x, y, ang, { s = 3.2, press, view = 'side' | 'top' | 'end', len = 46, alpha, flip })`** → a mono-grey fingertip
to scale: (x, y) is the contact point, `ang` the way it points (0 right, PI/2 down; pointing left it flips so the pad stays
down); `press` flattens the pad on the surface and, from above, blanches the nail. `'end'` is the fingertip end-on, as a
front view of a button sees it (`ang` then tilts it: 0 upright); end-on a fingertip is hard to recognise, so in a front view
prefer the pointer for the press and keep `'end'` for grip and groove slides where the finger's section is the point. Pass the camera's scale as `s` and move (x, y)
with the part you press. `finger(p[0], p[1] + d * 9, -0.06, { s: est.s, press: d });`

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
