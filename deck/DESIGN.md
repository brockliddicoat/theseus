# THESEUS deck: design system

The deck is a canvas film: 1920 × 1080, every frame a pure function of slide time `t`. It reads as one
system built from three sources:

- **XBAB promo material**: light grey paper `#F7F6F2`, heavy grotesk headlines in caps, one word in the hero colour
  (blue now: Theseus is blue, the next best yellow), bar charts that show every sample as a jittered dot with a 95 % CI,
  and the weight breakdown.
- **The film**: the 40 px grid with `+` marks, paper and night themes, iris, sweep and push transitions, one
  accent per chapter, typed narration, part drawings, the glossary and feature band.
- **The Kunai guide**: Inter and JetBrains Mono, mono section labels with icons, stat cards, accent dashes, lollipop
  rankings, segmented bars, two-column text, page counters.
- **Apple's keynotes** (Brock's references, 2026-11-04: the M1 / M1 Pro / M1 Max summary grids, the iPhone 11 Pro
  wall): rounded tiles in a bento grid with even gutters, one big number per tile with a few words of small type round
  it, subtle gradients (on the numbers, inside the tiles, as glows behind the part), and the product shown small or as
  a zoomed-in, abstract, beautiful close-up of the one part in question. See section 0.

It has to be read on a phone, where the stage is shown about 844 px wide (0.44 ×). Most of the rules below
follow from that.

---

## 0. Direction (Brock, 2026-11-04): Apple's keynote design, with more data

What Brock asked for, after a first pass he called "a massive step backwards" (sharp boxes, a "super straight
aesthetic", red for Theseus): go the Apple direction without straying far from the deck's first, vibrant colours;
**blue is Theseus**; "LOTS of premium motion design"; keep giving simulations the screen; show a little more data than
Apple does. What Apple does, from its keynotes and its own design tokens (research notes: `research/apple-keynote-design.md`):

1. **One idea per slide, and room round it.** A few words of type, large; an image or a number carries the slide.
   Many sparse slides beat a few crowded ones.
2. **Bento summaries.** A grid of rounded tiles (Apple's cards: radius 28, padding 28 to 40, even gutters of 16 to 24
   px, no shadows; tiles one shade off the ground). One or two tiles are big (2 × 2) and hold the product, small or
   abstract; the rest hold one stat each: a small "Up to" over a huge number, a short label under it. Here: `bento()`,
   `statTile()`, `demoWindow()` (the tile), `tileA()` (tiles coming in one after another).
3. **Colour with intent, reused.** Theseus is blue everywhere it appears (`C.hero`): its bars, its line, its mark, its
   tile's rim, its words. Competitors are grey; the one to beat is yellow; a problem is red.
4. **Gradients live in the type** (Brock, 05:12: "gradients make the most sense in the font, you need to use them
   everywhere else very sparingly ... so the presentation doesn't look too vibe coded"). Theseus's big numbers and
   its name carry `C.heroGrad` (`text(..., { grad })`, `rich` runs with `grad`, `statTile`, `heroTag`). Everything else
   is flat colour: tiles, bars, marks, the stage, transitions. `glowField` exists for one or two hero moments in the
   whole deck, no more.
5. **Show little of the product.** A zoomed-in, abstract, well-lit close-up of the part in question (the node of a
   lattice, a code disc with light through its slots, the thread's flank) does more than a full diagram. Use the 3D
   camera close, or draw the part large and simple, lit by `glowField`.
6. **Charts reduced to the message.** Few labels, the direction of "better" written on the axis, Theseus's line or bar
   in its gradient with a soft glow, the rest grey; comparisons in relatable terms (2.4× stiffer, half the flex). We
   keep our values on the chart and our evidence on every number: that is the "little more data".
7. **Motion that serves the story.** Things appear when the narration reaches them; tiles settle in one after another
   (a hair larger and lower, to place); numbers count up; a light passes once over a new tile; the camera pushes in
   slowly on the part; force, current and light visibly flow. Smooth, confident easing (`E.snap`, `E.cam`, `E.io3`),
   nothing bouncy, nothing that loops for no reason. Premium means slow enough to read and never static for long.
8. **Type as the label.** No capsules, no dots, no boxes round labels: small mono caps in the kind's colour say how we
   know a number (`pill`), a quiet label sits over or beside a value (`ltag`). The deck keeps its own fonts.

---

## 1. Files

| File | What it holds |
|---|---|
| `src/00-head.html` | Page shell, CSS, and the three embedded fonts (base64 woff2) |
| `src/01-core.js` | Palette (`RAMP`, `C`, `YEL`, `ACCENTS`, `acc()`), fonts (`FONT`), type roles (`T`), `text()`, `rich()`, `caps()`, `sentence()`, drawing primitives, `demoWindow()` |
| `src/03-parts.js` | Part drawings in mm (`part()`, materials `MT`), and the Sora V2 key plan (`keyPlan`, `keyPlanMM`) |
| `src/04-ui.js` | Layout constants (`LM`, `RM`, `LAY`), `PHI`, `golden()`, slide furniture: `header`, `captions`, `source`, tags (`ltag`, `pill`, `heroTag`, `secondTag`, `tagRow`), `cardHead`, boxes (`noteBox`, `glossBox`, `sourceBox`), the pointer (`cursorPtr`, `cursorAt`), `callout`, band blocks, `chapterCard`, `slideChrome`, `hbars`, `axes`, `dim`, `countUp` |
| `src/07-charts.js` | Charts: `barChart`, `breakdown`, `lollipop`, `scatter` (rounded Pareto frontier, `monoCurve`), `lineChart`, `compareTable`, `statCard`, `legend`, `heroMark`, `placeholderStamp` |
| `src/07-sim.js` | Force simulations: a 2D frame solver (`feSolve`, `simSolve` caches a load case), `feDraw` (the bent frame coloured by stress), `feFlow` (force running through the members), `feEngaged` (grams of material that work), `feLattice`, `feChain`, `feSupport`, `heatCol`, materials `SIM_MAT` with their sources |
| `src/10-d-0-meter.js` | The shell chapter's running meter: `shellStep()` registers a strength step, `shellMeter()` draws the strip (flex and peak stress at the same press and mass; a plain thin wall, no ribbing, = 100 %) |
| `src/08-r3d.js` | `view3D()`: a 3D shot from the bundle (`vendor/r3d.js`, scenes in `3d/integration/entry.js`), composited into the stage |
| `src/08-v2d.js` | 2D mode: `view2D()`, the flat twin of every 3D shot, drawn from `geo2d/*.json`; the setting (`setView2D`, the 2D / 3D pill, `D`, `?2d=1`) |
| `geo2d/*.json` | Outlines traced off the 3D scenes, per part and per axis, with how each state key moves them (`tools/geo2d/build.sh`) |
| `src/10-slides-main.js` | The film's slides; `S()` registers a slide |
| `src/12-*.js` | Idea sheets (`12-00-ideas.js` is their framework: `ideaPanel`, `IDEA`, `dLabel`, `miniAxes`) |
| `src/14-exemplars.js` | Data-driven slides that show the system: cover, zero grams, 29 g budget, what a gram costs, the cell, the frontier, the fastest mice |
| `src/13-sort.js` | Puts slides in chapter order; honours `after`, `before`, `first`, `replaces` |
| `src/11-slides-rec.js` | The companion "Recommendations" deck (`dist/rec.html`). Shares the core, but its slides still use the old small type |
| `src/19-components-test.js` | Test page for the charts and cards no film slide uses yet (`python3 tools/build.py comps`) |
| `src/20-app.js` | Player: font gating, transitions, chrome, QA hooks |
| `tools/build.py` | Concatenates `src/` into `dist/main.html` and `dist/rec.html`, and embeds `../research/data/*.json` as `RDATA` |
| `tools/errs.js`, `tools/qa.js`, `tools/shoot.js`, `tools/sheet.py` | Checks and screenshots (section 10) |
| `tools/fonts/` | Font build (section 3) |

---

## 2. Slide anatomy

```
 76   ◆ CHAPTER 03 / 13                                         [#12] [#14]   section label row (LAY.labelY)
150   SLIDE TITLE IN CAPS                                                     h1 (LAY.titleY)
206   The narration, typed, one or two lines.                                 lead (LAY.leadY)
272   ┌ content ───────────────────────────────────────────────────────────┐  LAY.top
      │ cards, charts, drawings                                            │
852   └────────────────────────────────────────────────────────────────────┘  LAY.bottom
880   ─ WHAT THAT MEANS                        ─ THE FEATURE  [PILL][PILL]   band (LAY.bandY), optional
      Term. Definition, two or three lines.    Feature. One line on it.
990   Source line, mono, faint (wraps upward)
1008  ─────────────────────────────────────────────────────────────────────   rule (LAY.ruleY), progress tick on it
1046  THESEUS / CHAPTER                                              07 / 61   footer (LAY.footY), drawn by the app
```

- Margins: `LM = 80`, `RM = 1840`. Everything aligns to them; the grid is 40 px.
- The footer, rule and progress tick are drawn by `slideChrome()` for every slide. Set `chrome: false` on
  a slide to drop them (the cover does). Never put text below `LAY.ruleY`.
- Content lives between `LAY.top` and `LAY.bottom` (to about 960 when a slide has no band).
- The diagram above is the frame, not a template. The band at the foot (gloss + feature card) is one option among
  several, and no longer the default: see section 2b.

## 2b. Space and composition (Brock's notes, 2026-11-04)

This is an animation, so it can take its time: **don't be afraid of black space.** A slide that feels full is two
slides.

1. **One idea per slide, and room round it.** At least 40 px between any two blocks, 28 px of padding inside a box,
   and no more than about half the content area covered by text. When a slide gets crowded, split it.
2. **Simulations and big drawings get the stage.** A force, bending, fluid or optics simulation takes at least 60 % of
   the content area, often the full width (1760 px) or a 1100+ px panel, with the words beside or under it. A lot of
   work goes into them and they are the most convincing thing in the deck.
3. **Move things round.** The vocabulary (`glossBox`) and the research (`sourceBox`) sit inside the slide, next to
   what they explain, and not in the same place every time: left column, right column, over the empty corner of a
   drawing, under a chart. Two slides in a row never share a layout (drawing left / text right, then text left /
   drawing right, then a full-width drawing with a strip of boxes under it, then a 3-up, ...).
4. **The golden ratio** sets the splits: `golden(x, w, gap)` returns a big part (w / φ) and a small part; `golden2(h)`
   does the same for heights. Boxes are rounded (r 16) with 28 px padding (`noteBox`, `glossBox`, `sourceBox`).
5. **Titles name the concept.** "Dual rail main clicks", "Newtonian shape analysis", "Statically determinate
   triangles", "Density, not weight": the name a reader can repeat, not a riddle round it.
6. **Nothing overlaps that shouldn't.** Text never runs over a drawing's lines, a dot, another label or a card edge.
   `qa.js` catches text against text and cards; look at the screenshot for text against drawings.
7. **The pointer.** When something is moved, pressed or dragged, show the pointer doing it (`cursorAt`): it reads
   instantly, and Brock likes it.
8. **The shell's running meter.** Every structural gain in the shell chapter shows the strip (`shellMeter`): flex and
   peak stress at the same press and the same mass, against a plain thin wall (no ribbing) as 100 %, so the gains add up
   from slide to slide.

---

## 3. Fonts

Three faces, embedded in `src/00-head.html` so every machine and every headless capture renders the same:

| Family | What it is | Used for |
|---|---|---|
| `Inter Display` | Inter 4 variable pinned at opsz 32, wght 400 to 900, case-sensitive forms baked into the cmap | Display: titles, chapter names, big numbers |
| `Inter` | Inter 4 variable pinned at opsz 14, wght 300 to 800 | Reading text: leads, body, cards |
| `JetBrains Mono` | Variable, latin subset, wght 300 to 800 | Labels, tags, ticks, values in tables, sources |

`20-app.js` waits on `document.fonts.load()` for all three before the first frame, so nothing is drawn in a
fallback face. There is no system-font substitution any more.

Rebuild: `cd tools/fonts && npm install && python3 build_fonts.py` (needs `fonttools` and `brotli`). The script
instances and subsets the fonts, then rewrites the three `@font-face` lines in `src/00-head.html`. Then run
`python3 tools/build.py`.

---

## 4. Type

### Roles (`T` in `01-core.js`)

Set type by role, not by size. A role fixes font, size, weight, tracking, line height and case.

| Role | Font | Size | Weight | Case | Use |
|---|---|---|---|---|---|
| `hero` | disp | 300 | 900 | CAPS | The cover word |
| `d1` | disp | 200 | 800 | as written | A number that is the slide |
| `d2` | disp | 120 | 800 | CAPS | Chapter names, big stats |
| `h1` | disp | 62 | 800 | CAPS | Slide titles (`header()`) |
| `h2` | disp | 44 | 800 | CAPS | A title inside a slide |
| `stat` | disp | 84 | 800 | as written | Stat-card numbers |
| `h3` | sans | 32 | 700 | Sentence | Card titles |
| `lead` | sans | 31 | 500 | Sentence | The narration under a title |
| `body` | sans | 28 | 450 | Sentence | Reading text |
| `small` | sans | 25 | 500 | Sentence | The smallest reading text |
| `labelL` | mono | 26 | 600 | CAPS, +0.08 em | Section labels |
| `label` | mono | 22 | 600 | CAPS, +0.10 em | Every other label, tags, card heads |
| `num` / `numS` | mono | 28 / 24 | 700 / 600 | as written | Values in tables and charts |
| `tick` | mono | 21 | 500 | as written | Axis ticks |
| `foot` | mono | 19 | 500 | Sentence | Sources and the footer only |

Floors (`TYPE_MIN`): reading text 25 px, labels 21 px (19 in dense charts), footnotes 19 px. At the phone's
0.44 × that is 11, 9 and 8 px. Below that, cut words; do not shrink.

### Case

- Display roles and labels are set in caps by `caps()`. Units stay as written (`29 g`, `0.14 ms`, `8 kHz`,
  `µs`, `mAh`), Greek stays Greek. Wrap anything else that must keep its case in braces:
  `'{nRF52840}'`, `'{piaknow}'`, `'Mouse mass, {g}'`. The braces are removed before drawing.
- Reading roles are set in sentence case by `sentence()`, which only raises a letter after `.`, `!`, `?` or a
  line break. Brand names keep their case.
- No lowercase titles or labels anywhere.

### Numbers and runs

- `GLUE` joins a number to its unit with a no-break space, so `29 g` never splits across lines.
- `tnum: true` sets tabular figures (every digit the same width), so a counting number does not jitter.
  Display numbers get it automatically.
- Counting up: `rich([{ s: '0.14', count: [t0, dur, from] }])` or `countUp(s, k, from)`.
- Mixed size and colour on one baseline: `rich(runs, x, y, o)`. Each run takes a role or font settings plus
  `color`, `gap`, `dy`, `valign: 'cap' | 'mid'`, `chip` (a colour block behind it: `C.heroChip` with `color: C.onHero` for the red word),
  `count`, `rise`, `alpha`.
- Run-in paragraphs (a bold lead-in, then the text): `para(runs, x, y, { maxW, lh, maxLines, t, t0, cps })`.

### `text(s, x, y, o)`

`o = { role, size, weight, font ('sans' | 'disp' | 'mono'), color, alpha, align, track (em) or ls (px), caps,
sentence, forceCaps, tnum, maxW, lh, t, t0, cps, caret, wipe, rise: [t0, dur] }`. Returns `{ w, h, lines }`.

- `t` + `t0` + `cps` types the text in. Lines are laid out first, so typed text never shifts.
- `rise: [t0, dur]` lifts each line out of a mask (titles, the cover).
- Two automatic rules keep old call sites in the system: a `label` longer than 48 characters is set as a
  `small` sentence instead (long caps are hard to read; pass `forceCaps: true` to keep it), and an unroled
  size ≥ 36, weight ≥ 700 call is set in the display face with tabular figures.

---

## 5. Colour

| Token | Paper | Night | Use |
|---|---|---|---|
| `C.bg` | `#F7F6F2` | `#0D0E0F` | Stage. No tan or beige anywhere |
| `C.ink` | `#111111` | `#F3F2EE` | Titles, hero numbers |
| `C.ink2` | `#2E2E2C` | `#CFCEC9` | Body text |
| `C.mute` | `#66655F` | `#96958F` | Secondary text, labels |
| `C.faint` | `#8A8983` | `#6E6D68` | Ticks, notes, sources |
| `C.hair` | `#DDDCD6` | `#26272A` | Rules, gridlines |
| `C.track` | `#E7E6E1` | `#1F2023` | The empty part of a bar |
| `C.panel` | `#FFFFFF` | `#141517` | Card surface |
| `C.comp` / `C.comp2` | `#B9B8B2` / `#D3D2CC` | `#55554F` / `#3A3A37` | Competitors / dimmed competitors |
| `C.hero` (`HERO_P` / `HERO`) | `#0A6CFF` | `#2F8CFF` | **Theseus, only Theseus**: its bar, point, line, column, the hero word |
| `C.heroGrad` | `#1F9BFF → #0A6CFF → #3D4FE0` | `#7AD4FF → #2F8CFF → #6A63FF` | Theseus's gradient, for its type only: big numbers, its name |
| `C.heroText` | `#0058D6` | `#64B0FF` | Theseus blue as small text or a thin line |
| `C.heroSoft` | blue at 12 % | blue at 16 % | A blue field behind something (a sweet spot) |
| `C.second` / `C.ref` | `#E3A800` | `#FDC316` | **The next best**, the one to beat: the second highlight (the deck's first yellow) |
| `C.secondText` | `#8F6A00` | `#FDC316` | The next best as small text |
| `C.red` / `C.bad` | `#E5484D` | `#E5484D` | A problem: a failure, a gap, a breakage, placeholder data |
| `heatCol(k)` / `C.heat` | grey → amber → orange → red | grey → amber → orange → red | Stress and load in a drawing (07-sim.js) |

Rules:

1. **Theseus is blue in every chart, and only Theseus is blue** (red read as bad; green is Razer's). Its bar, point
   (`heroMark`, a diamond), column (`compareTable` with `hero: true`), target line (`targetX`), tag
   (`heroTag`) and tile (`demoWindow(..., { hero: true })`). The hero word in a headline is the same claim.
   `C.yellow` and `C.gold` are old names that answer with the hero colour; true yellow is `C.yel` / `C.second`.
2. **The next best is yellow** (`C.second`, `C.ref`, `secondTag`), and smaller or darker than Theseus: on the stats
   slide the next best sits in a smaller, darker figure under ours. Other competitors are grey; dominated or
   out-of-scope points fade to `C.comp2`.
3. **One chapter accent** (`acc()`, from `ACCENTS`, the old vibrant set: clicks orange, glide green, shell purple,
   surface magenta, electronics teal, shape olive, ownership slate) for the section label, drawing highlights and the
   progress tick. Intro and close use ink. No chapter accent is blue.
4. **Evidence colours belong to evidence tags**, nowhere else (section 6).
5. **A problem is red** (`C.red`, `C.bad`): a gap no one has filled, a failure, a crack, placeholder data. Heat in a
   stress drawing runs amber, orange, red (`heatCol`).

---

## 6. Evidence and tags

Every number carries how we know it, as a **tag set in type**: the kind in small mono caps in its colour, and whose
number it is when the slide says (`by`), quieter, after a dot: `MEASURED · RTINGS`, `MAKER CLAIM · RAZER`,
`ESTIMATE · BROCK`. No capsule, no dot, no box (Brock disliked both the dot pills and the sharp lower-thirds).

| Kind | Tag | Colour | Research label |
|---|---|---|---|
| `measured` (`study`) | MEASURED | green | `IM` |
| `datasheet` | DATASHEET | teal | `DS` |
| `claim` (`survey`) | MAKER CLAIM | orange | `MC`, `CA` |
| `derived` | DERIVED | violet | `DV` |
| `estimate` | ESTIMATE | pink | Brock's own estimate (`by: 'Brock'`): his judgement, not a measurement |
| `proposal` | PROPOSAL | Theseus blue | `PR` |
| `projected` | PROJECTED | Theseus blue | (our own forecasts) |
| `placeholder` | PLACEHOLDER DATA | red | (no data yet) |

`EVMAP` and `evOf(field)` in `14-b-intro-ex.js` turn a research field's label into a kind. A maker's own test of its
own product is a `claim`, even when the maker calls it measured. A number Brock states from experience is an
`estimate` with `by: 'Brock'`.

API (`04-ui.js`):

- `ltag(x, y, label, value, o)`: a quiet label and a stronger value side by side, in type; (x, y) = left edge and text
  baseline (`o.right`: x is the right edge); either may be null. `o = { a, size (20), color, vcolor, vgrad }`. Returns
  its width; `ltagW()` measures first; `tagRow(xr, y, items)` sets several right-aligned.
- `pill(x, y, kind, a, { by, text })`: an evidence tag; `pillW(kind, o)` measures it. `tag()` and `cardPills()` are old
  names for the same thing. `evDot(x, y, kind)` is the kind's mark alone (a small soft square), for table cells.
- `cardHead(t, t0, x, y, w, label, kinds, o)`: a mono label on the left of a tile, tags on the right (a kind may be
  `{ ev, by }`). Returns the y below it.
- `heroTag(x, y, label, value)`: Theseus's own, `THESEUS 29.31 g`, the value in its gradient. `secondTag(...)` is the
  next best's, in yellow and quieter.
- Idea numbers in the header are type: `IDEAS 12 · 14` (`chips()`).

---

## 7. Components

Every component takes `t` (slide time) and a start time `t0` and animates itself; the settled frame is the
design. `ep(t, a, b, ease)` is the eased progress used everywhere.

### Slide

```js
S({
  id: 'pricefront', ch: 'intro', theme: 'night', title: 'What a gram costs', settle: 10,
  after: 'budget',                    // or before: 'id', first: true, replaces: 'id'
  ideas: ['weight'],                  // idea chips on the header row
  src: ['exRtings', 'exPrices'],      // keys into SRC, listed in the sources panel
  draw: t => { header(t, 'What a gram costs'); captions(t, [[0.6, '...'], [5.4, '...']]); /* ... */ }
});
```

`settle` is the time the slide is designed to be read at (screenshots and QA use it). Alternate `paper` and
`night` with the slide before when you can.

### Furniture (`04-ui.js`)

| Call | What it does |
|---|---|
| `header(t, title, { eyebrow, sub, size, maxW, noIdeas })` | Section label row (chapter icon, `CHAPTER nn / NN`, idea chips) and the `h1` title. Returns the y under the title |
| `captions(t, [[t0, text], ...], o)` | The narration, typed under the title, one step at a time. Keep each step to two lines at 31 px |
| `source(t, text, { t0, maxW, align })` | Mono footnote above the rule, wrapping upward |
| `bento(x, y, w, h, cols, rows, gap)` → `cell(c, r, cs, rs)` | Apple's grid of tiles: a tile's `[x, y, w, h]`, spanning cs columns and rs rows |
| `statTile(t, t0, rect, { pre, value, unit, label, ev, by, hero, next: { value, unit, who }, align })` | A bento stat tile: evidence at the top, "Up to", the number (Theseus's in its gradient, counting up), its label, the next best smaller and darker at the foot. About 300 px tall for all of that |
| `tileA(t, t0, i)` | The entrance of tile i of a set, one after another |
| `glowField(t, x, y, r, { a, cols })` | A soft light in Theseus's colours behind a part, slowly turning. Rare: one or two moments in the deck |
| `glossBox(t, t0, x, y, w, term, def, o)` | What a word means, in a rounded tile anywhere on the slide: `VOCAB TERM` and the definition. Returns `{ h }` |
| `sourceBox(t, t0, x, y, w, who, finding, { kind })` | Where a finding comes from, in a tile: `RESEARCH · WHO, YEAR` (or the evidence tag with `kind`) and what it found |
| `noteBox(t, t0, x, y, w, { label, value, kind, head, body, h })` | The base of both: a tag and a run-in paragraph in a padded box |
| `golden(x, w, gap, flip)` / `golden2(h, gap)` | Golden-ratio splits: `{ a: [x, w], b: [x, w] }` / `[big, small]` |
| `cursorPtr(x, y, { s, press })` / `cursorAt(t, keys, clicks)` | The on-screen pointer; `cursorAt` moves it along keyframes and rings each click |
| `gloss(t, t0, term, def)` / `featureCard(t, t0, name, kinds, line)` | The old band at the foot: what a word means (left), the feature (right). Use it sometimes, not on every slide |
| `callout(t, t0, [x, y], label, { to, side, elbow, sub, prose, color })` | A dot on a point, an elbow leader and a label. Short names are set as mono caps, phrases as sentences |
| `chapterCard(t, { name, list, gloss, cx, cy, r })` | Chapter opener: name in `d2`, an XBAB-style idea count, the ideas as a numbered list, an iris round the chapter's part |
| `slam(t, t0, x, y, num, unit, o)` / `bignum(...)` | A key number that drops in, or one that counts up |
| `hbars(t, { x, y, w, rows: [{ label, v, hero, sub }], max, unit })` | Simple horizontal bars with round ends; the `hero` row is Theseus blue |
| `axes(t, o)` + `series(m, pts, o)` | A plain x-y frame for drawings that are not one of the charts below |
| `dim(t, t0, a, b, label, off)` | A drafting dimension |
| `regMark(x, y, a, s, col)` | A registration `+`, for the corners of a composition |
| `demoWindow(x, y, w, h, a, { hero, plain, grid, fill, r })` | A tile: radius 28, flat, one step off the ground, no hard border, an entrance that settles; `hero` gives it a thin blue rim |

### Charts (`07-charts.js`)

All charts take one options object; each documents it in a comment above the function.

- **`barChart(t, o)`**, the XBAB bar chart. Bars with every sample as a jittered dot, 95 % CI whiskers, the
  value above, `n` and the CI below. `dir: 'v' | 'h'`, `bars: [{ name, sub, v, ci, n, samples, hero, ref, dim }]`.
  Give `samples` real values when they exist; `{ n, sd, seed }` synthesises dots only for a sketch, and the
  slide must then say so. The value sits above the highest dot. A vertical chart needs about 130 px under its
  frame for names and the CI foot; a horizontal one writes names right-aligned to the left of `x`. No film
  slide uses it yet: no dataset has per-run samples (see `src/19-components-test.js` for a working call).
- **`breakdown(t, o)`**, the XBAB weight breakdown. One row per part: icon, name, a bar on a shared scale, grams
  and share of the total, an evidence tag; the total underneath. `was` draws a ghost bar for a part's weight
  before a change.
- **`lollipop(t, o)`**, the Kunai ranking. Sorted rows, a stem and a dot each, value at the end; `target: { v }`
  draws Theseus's target as a red line through the ranking. Wireless rows can be hollow.
- **`scatter(t, o)`**, XY with a sweet spot and a Pareto frontier. `better: { x, y }` sets which corner is
  better, `sweet` draws a red field toward it, `frontier: true` draws the frontier of points no other point
  beats on both axes, as a rounded curve through them (`monoCurve`: it never overshoots a point), and hatches the region it closes off. Theseus is `target: { x, y, name }` (a point) or
  `targetX: { x, name, sub }` (known on x only: a dashed line, e.g. a weight with no price yet). Labels are
  placed so they never cover a dot, a line or another label; a dominated point with no free spot goes unnamed,
  and the call returns `{ unnamed }` so the slide can list them. `label: false` leaves a point unnamed on
  purpose.
- **`lineChart(t, o)`**, series with end labels, `bands` (shaded x ranges, e.g. a sweet spot) and `markers`.
  An end label with no room past the line sits above its end instead.
- **`compareTable(t, o)`**, rows of specs, one column per mouse or per field; a `hero` column gets the red
  cap and rule; cells take `{ v, sub }`; `ev` puts an evidence dot by a value; `best` sets a cell in bold.
- **`statCard(t, t0, x, y, w, h, o)`**, the Kunai stat card: mono label, tag, a big number with its unit,
  one or two lines of body. `hero: true` adds the red edge. About 170 px tall for a label and a value, 240
  with a line of body; keep the label to one line beside its tag.
- **`legend(t, t0, x, y, items, { align })`**, kinds `hero`, `ref`, `comp`, `dim`, `ring`, `line`, `dash`, `area`.
- **`placeholderStamp(t, x, y, w, h)`**, a red PLACEHOLDER DATA stamp over a chart whose data is missing. Every
  chart takes `placeholder: true` and draws it.

### Simulations (`07-sim.js`)

A 2D frame solver (linear, Euler-Bernoulli beams with rigid joints, or bars with `truss: true`), in mm, N and MPa.
Build a model, solve it once per load case with `simSolve(key, () => model)`, and animate the result: the model is
linear, so a load scaled by k scales every displacement, force and stress by k (`feDraw(r, P, { load: k })`).

- `feLattice('tri' | 'hex' | 'sq', x0, y0, w, h, s, sec)` and `feChain(nodes, pts, sec)` build models; `sec` is
  `{ w, h, E, rho }` (section width out of the plane, depth in the plane, MPa, g/mm³). `SIM_MAT` holds the deck's
  materials with their source keys (PP-C-20A, ABS, Mg AZ91D, FR4).
- `feDraw(r, P, o)` draws the bent frame, members coloured by stress (`heatCol`, amber, never red), `feFlow(r, P, t)`
  runs dashes along each member at a speed set by its force, `feSupport(p, kind)` draws a pin, a roller or a wall.
- `feEngaged(r, frac)` is the grams of material stressed above `frac` of the peak: the "how much of the mouse works"
  number. A frame that cannot carry the load (a pin-jointed hexagon) comes back with `mech: true`.
- Every number from it is `derived`, and the slide names the model in a line: "2D frame, PP-C-20A (13.5 GPa),
  0.9 mm ribs, 10 N at the crown".

### Drawings

- `part(x, y, s, fn, { alpha, rot })` draws a part defined in mm at scale `s` px per mm.
- `keyPlan(t, t0, x, y, { s, hi, label, cut, detail })` places the top-view key plan; `keyPlanMM(o)` draws it
  in mm. The outline is the Ninjutso Sora V2 top silhouette, smoothed from the scan (`SORA_HALF`), with its
  seams: the centre split between the main buttons, the straight rear seam of the triggers (`KEY.seam`), and
  the wheel slot (`KEY.wheel`). `hi` highlights any of `shell`, `rim`, `sides`, `side`, `hump`, `rear`,
  `wheel`, `sensor`, `battery`, `board`, `antenna`, `skates`. Its front is a flatter curve and its sides run
  nearly straight, which is what makes it read as that mouse and not a generic one.

### 3D shots and their 2D twins

`view3D(key, t, x, y, w, h, state, o)` draws a scene into a box (scenes, state keys and camera keys are listed in
`08-r3d.js`). A scene applies its full rest state under each call, so a key a slide leaves out returns to rest; set
the keys the shot needs and nothing else. Scenes frame themselves at rest when built, so `zoom: 1` always means the
same thing.

Every 3D shot has a flat twin, drawn instead when the deck is in 2D mode, when the browser has no WebGL, or when a
scene fails to build (assets missing). It is the same parts, traced off the same assets, as an orthographic
elevation along the world axis nearest the shot's camera, filled flat and outlined in the ink of the ground; a
camera between two axes cross-fades the two views. In a slide:

- `in2D(a, b)` picks a value for 2D or 3D: a tighter `zoom`, another `target`, another callout position.
- `view2d: 'top' | 'bottom' | 'left' | 'right' | 'front' | 'back'` names the flat view (the scene's +X is the
  user's left, so `right` is the side-button side). Name it whenever the camera turns across an axis.
- `hi2d: { re, color, w }` outlines the parts whose path matches `re` in a colour (the triggers on the cutout slide).
  `hide2d: re` leaves parts out of the flat view.
- Callouts: `V3.proj` (after a `view3D` call) or `v2dProj(key, state, box)` maps mm to stage px on the flat view;
  `v2dAt(key, state, box, re, f)` finds a point on a named part (`f` = fractions of its box, or `'c'` for the
  centre of its outline in that view). `elc_v3`, `srf_proj` and `shlProj` already switch.
- Parts that move straight toward the viewer fade instead; x-ray, cutaway and section states turn the covering
  parts into dashed phantoms; the board's current and the reflow front are drawn on top.

After changing a 3D asset, rebuild the twins: `sh tools/geo2d/build.sh` (needs the 3D bundle built first).

### Data

`RDATA` holds every `research/data/*.json` file. Read it through the helpers in `14-exemplars.js`:
`rv(field)` (the value of a `{ value, label, source_url }` object, a list of them, or a plain value),
`evOf(field)`, `exMouse(id)`, `exWeight(id)` (RTINGS weight when there is one, else the maker's, with its
kind), `exShort(name)`, `exPricePoints()`. Add every source a slide uses to `SRC` with `{ t, u, n }` and list
its key in the slide's `src`.

---

## 8. Mobile rules

1. Read every slide at 844 px wide before calling it done (`tools/sheet.py` tiles at 384 px, which is
   harsher still).
2. Reading text ≥ 25 px, labels ≥ 21 px (19 in the densest charts), footnotes 19 px. Hairlines are 1.5 px.
3. When text does not fit, cut words. Do not shrink the type, do not squeeze the tracking.
4. One idea per slide. A lead of one or two lines; a band paragraph of three lines at most.
5. Never tell two things apart by colour alone: dots are filled or ringed, lines are solid or dashed, the
   Theseus mark is a diamond, the frontier is ink.
6. Values on charts are written on the chart (on the bar, at the end of the stem, in the table), not left for
   the reader to estimate against an axis.

---

## 9. Do and don't

Do:

- Show the comparison. A Theseus number appears next to the best shipping number, or on the same axis.
- Label the evidence on every number. Keep a maker's self-test as a claim.
- Say what is not known: a target line with "not measured yet", a dull gap where nothing light publishes hours,
  a placeholder stamp where data is missing.
- Name the source of every number in `src` and, where it matters on the slide, in a `sourceBox` or the source line.
- Keep blue for Theseus, yellow for the next best and red for a problem.
- Print Theseus's own numbers from `THS` (`THS.massG` = '29.31 g', `THS.price` = '$189', `THS.pcb` = '5.6 g').

Don't:

- Don't use lowercase titles or labels, or set long sentences in mono caps.
- Don't add a third highlight colour or drop shadows under tiles. Don't put gradients anywhere but type (big numbers,
  Theseus's name); a glow behind a part is for one or two moments in the whole deck.
- Don't put tags in capsules, dots or boxes: a tag is type (section 6). Don't use sharp-cornered boxes for anything;
  tiles are rounded.
- Don't round a claim up, or print a projected number without the PROJECTED tag.
- Don't place text under the footer rule, or let a label run over a dot, a line or another label.
- Don't use tan, beige or cream. The paper is `#F7F6F2`.

---

## 10. Checks

```sh
python3 tools/build.py                              # dist/main.html and dist/rec.html
python3 tools/build.py comps                        # dist/components.html: bar charts, line chart, stat cards, both themes
node tools/errs.js $PWD/dist/main.html cover budget # render each slide at several times; prints errors (20 slides a run at most)
T=settle node tools/qa.js $PWD/dist/main.html       # text off stage, text over text, text across a card edge, text under the floor
T=mid node tools/qa.js $PWD/dist/main.html          # the same mid-animation (0.4 × settle)
node tools/shoot.js $PWD/dist/main.html shots/x settle [ids]   # screenshots; DSF=2 PAR=1 for 2×
python3 tools/sheet.py sheet.png 5 384 shots/x/*.png           # contact sheet
```

Every checker takes `Q='&2d=1'` to run in 2D mode (`Q='&2d=0'` forces 3D). Check a slide with a 3D shot in both.

`?qa=1` makes `text()` and `demoWindow()` record their boxes in `window.__qa`; `qa.js` reads them. It cannot
see a label over a dot or a line, so look at the screenshots too. A slide is done when `errs.js` prints `ok`,
`qa.js` reports nothing at settle and mid, and the 384 px contact sheet reads.
