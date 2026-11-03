# THESEUS deck: design system

The deck is a canvas film: 1920 × 1080, every frame a pure function of slide time `t`. It reads as one
system built from three sources:

- **XBAB promo material**: light grey paper `#F7F6F2`, heavy grotesk headlines in caps, one word in yellow
  `#FDC316`, bar charts that show every sample as a jittered dot with a 95 % CI, and the weight breakdown.
- **The film**: the 40 px grid with `+` marks, paper and night themes, iris, sweep and push transitions, one
  accent per chapter, typed narration, part drawings, the glossary and feature band.
- **The Kunai guide**: Inter and JetBrains Mono, mono section labels with icons, stat cards with evidence pills,
  accent dashes, lollipop rankings, segmented bars, two-column text, page counters.

It has to be read on a phone, where the stage is shown about 844 px wide (0.44 ×). Most of the rules below
follow from that.

---

## 1. Files

| File | What it holds |
|---|---|
| `src/00-head.html` | Page shell, CSS, and the three embedded fonts (base64 woff2) |
| `src/01-core.js` | Palette (`RAMP`, `C`, `YEL`, `ACCENTS`, `acc()`), fonts (`FONT`), type roles (`T`), `text()`, `rich()`, `caps()`, `sentence()`, drawing primitives, `demoWindow()` |
| `src/03-parts.js` | Part drawings in mm (`part()`, materials `MT`), and the Sora V2 key plan (`keyPlan`, `keyPlanMM`) |
| `src/04-ui.js` | Layout constants (`LM`, `RM`, `LAY`), slide furniture: `header`, `captions`, `source`, evidence pills, `cardHead`, `callout`, band blocks, `chapterCard`, `slideChrome`, `hbars`, `axes`, `dim`, `countUp` |
| `src/07-charts.js` | Charts: `barChart`, `breakdown`, `lollipop`, `scatter`, `lineChart`, `compareTable`, `statCard`, `legend`, `heroMark`, `placeholderStamp` |
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

---

## 3. Fonts

Three faces, embedded in `src/00-head.html` so every machine and every headless capture renders the same:

| Family | What it is | Used for |
|---|---|---|
| `Inter Display` | Inter 4 variable pinned at opsz 32, wght 400 to 900, case-sensitive forms baked into the cmap | Display: titles, chapter names, big numbers |
| `Inter` | Inter 4 variable pinned at opsz 14, wght 300 to 800 | Reading text: leads, body, cards |
| `JetBrains Mono` | Variable, latin subset, wght 300 to 800 | Labels, pills, ticks, values in tables, sources |

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
| `label` | mono | 22 | 600 | CAPS, +0.10 em | Every other label, pills, card heads |
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
  `color`, `gap`, `dy`, `valign: 'cap' | 'mid'`, `chip` (a colour block behind it, used for the yellow word),
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
| `C.ref` | ink | ink | The best shipping today, the one to beat |
| `YEL` | `#FDC316` | `#FDC316` | Theseus, only Theseus |
| `C.heroText` | `#A87C00` | `#FDC316` | Yellow as small text or a thin line on paper |

Rules:

1. **Theseus is yellow in every chart, and only Theseus is yellow.** Its bar, point (`heroMark`), column
   (`compareTable` with `hero: true`), target line (`targetX`) and chip label. The cover word and the yellow
   word in a headline are the same claim.
2. **Competitors are grey.** The one to beat is ink (`ref: true`). Dominated or out-of-scope points fade to
   `C.comp2`.
3. **One chapter accent** (`acc()`, from `ACCENTS`, a light and a dark tone per theme) for the section label,
   the band dashes, drawing highlights and the progress tick. Intro and close use ink.
4. **Evidence colours belong to pills** and their dots, nowhere else (section 6).
5. **Red means a problem**: a gap no one has filled, a failure, placeholder data. Not decoration.

---

## 6. Evidence

Every number carries how we know it. The pill reads in caps; the dot shape repeats the meaning for anyone who
cannot tell the colours apart.

| Kind | Pill | Dot | Research label |
|---|---|---|---|
| `measured` (`study`) | MEASURED | filled, teal | `IM` |
| `datasheet` | DATASHEET | filled, blue | `DS` |
| `claim` (`survey`) | MAKER CLAIM | ring, orange | `MC`, `CA` |
| `derived` | DERIVED | ring, violet | `DV` |
| `proposal` | PROPOSAL | dashed, yellow | `PR` |
| `projected` | PROJECTED | half, yellow | (our own forecasts) |
| `placeholder` | PLACEHOLDER DATA | ring, red | (no data yet) |

`EVMAP` and `evOf(field)` in `14-exemplars.js` turn a research field's label into a kind. A maker's own test
of its own product is a `claim`, even when the maker calls it measured.

API:

- `pill(x, y, kind, a, o)`: a pill with its left edge at `x` and text baseline at `y`; returns its width.
  `pillW(kind)` measures one first.
- `evDot(x, y, kind, r, a)`: the dot alone, for table cells and legends.
- `cardPills(x, y, w, kinds, a)`: pills right-aligned in a card's head row.
- `cardHead(t, t0, x, y, w, label, kinds, o)`: the Kunai card head, a mono label on the left and pills on the
  right. Returns the y below it.
- `tag(x, y, kind, a)`: kept for old call sites; it is a pill.

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
| `gloss(t, t0, term, def)` / `featureCard(t, t0, name, kinds, line)` | The band: what a word means (left), the feature on screen with its pills (right) |
| `callout(t, t0, [x, y], label, { to, side, elbow, sub, prose, color })` | A dot on a point, an elbow leader and a label. Short names are set as mono caps, phrases as sentences |
| `chapterCard(t, { name, list, gloss, cx, cy, r })` | Chapter opener: name in `d2`, an XBAB-style idea count, the ideas as a numbered list, an iris round the chapter's part |
| `slam(t, t0, x, y, num, unit, o)` / `bignum(...)` | A key number that drops in, or one that counts up |
| `hbars(t, { x, y, w, rows: [{ label, v, hero, sub }], max, unit })` | Simple horizontal bars; the `hero` row is yellow |
| `axes(t, o)` + `series(m, pts, o)` | A plain x-y frame for drawings that are not one of the charts below |
| `dim(t, t0, a, b, label, off)` | A drafting dimension |
| `regMark(x, y, a, s, col)` | A registration `+`, for the corners of a composition |
| `demoWindow(x, y, w, h, a, { hero, plain, grid, fill, accent })` | A card: panel, hairline border, optional grid; `hero` adds the yellow edge |

### Charts (`07-charts.js`)

All charts take one options object; each documents it in a comment above the function.

- **`barChart(t, o)`**, the XBAB bar chart. Bars with every sample as a jittered dot, 95 % CI whiskers, the
  value above, `n` and the CI below. `dir: 'v' | 'h'`, `bars: [{ name, sub, v, ci, n, samples, hero, ref, dim }]`.
  Give `samples` real values when they exist; `{ n, sd, seed }` synthesises dots only for a sketch, and the
  slide must then say so. The value sits above the highest dot. A vertical chart needs about 130 px under its
  frame for names and the CI foot; a horizontal one writes names right-aligned to the left of `x`. No film
  slide uses it yet: no dataset has per-run samples (see `src/19-components-test.js` for a working call).
- **`breakdown(t, o)`**, the XBAB weight breakdown. One row per part: icon, name, a bar on a shared scale, grams
  and share of the total, an evidence pill; the total underneath. `was` draws a ghost bar for a part's weight
  before a change.
- **`lollipop(t, o)`**, the Kunai ranking. Sorted rows, a stem and a dot each, value at the end; `target: { v }`
  draws Theseus's target as a yellow line through the ranking. Wireless rows can be hollow.
- **`scatter(t, o)`**, XY with a sweet spot and a Pareto frontier. `better: { x, y }` sets which corner is
  better, `sweet` draws a yellow field toward it, `frontier: true` draws the staircase of points no other point
  beats on both axes and hatches the region it closes off. Theseus is `target: { x, y, name }` (a point) or
  `targetX: { x, name, sub }` (known on x only: a dashed line, e.g. a weight with no price yet). Labels are
  placed so they never cover a dot, a line or another label; a dominated point with no free spot goes unnamed,
  and the call returns `{ unnamed }` so the slide can list them. `label: false` leaves a point unnamed on
  purpose.
- **`lineChart(t, o)`**, series with end labels, `bands` (shaded x ranges, e.g. a sweet spot) and `markers`.
  An end label with no room past the line sits above its end instead.
- **`compareTable(t, o)`**, rows of specs, one column per mouse or per field; a `hero` column gets the yellow
  cap and rule; cells take `{ v, sub }`; `ev` puts an evidence dot by a value; `best` sets a cell in bold.
- **`statCard(t, t0, x, y, w, h, o)`**, the Kunai stat card: mono label, pill, a big number with its unit,
  one or two lines of body. `hero: true` adds the yellow edge. About 170 px tall for a label and a value, 240
  with a line of body; keep the label to one line beside its pill.
- **`legend(t, t0, x, y, items, { align })`**, kinds `hero`, `ref`, `comp`, `dim`, `ring`, `line`, `dash`, `area`.
- **`placeholderStamp(t, x, y, w, h)`**, a red PLACEHOLDER DATA stamp over a chart whose data is missing. Every
  chart takes `placeholder: true` and draws it.

### Drawings

- `part(x, y, s, fn, { alpha, rot })` draws a part defined in mm at scale `s` px per mm.
- `keyPlan(t, t0, x, y, { s, hi, label, cut, detail })` places the top-view key plan; `keyPlanMM(o)` draws it
  in mm. The outline is the Ninjutso Sora V2 top silhouette, smoothed from the scan (`SORA_HALF`), with its
  seams: the centre split between the main buttons, the straight rear seam of the triggers (`KEY.seam`), and
  the wheel slot (`KEY.wheel`). `hi` highlights any of `shell`, `rim`, `sides`, `side`, `hump`, `rear`,
  `wheel`, `sensor`, `battery`, `board`, `antenna`, `skates`. Its front is a flatter curve and its sides run
  nearly straight, which is what makes it read as that mouse and not a generic one.

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
- Say what is not known: a target line with "price not set", a red gap where nothing light publishes hours,
  a placeholder stamp where data is missing.
- Name the source of every number in `src` and, where it matters on the slide, in the source line.
- Keep yellow for Theseus.

Don't:

- Don't use lowercase titles or labels, or set long sentences in mono caps.
- Don't add a second hero colour, gradients behind text, drop shadows or glows.
- Don't round a claim up, or print a projected number without the PROJECTED pill.
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

`?qa=1` makes `text()` and `demoWindow()` record their boxes in `window.__qa`; `qa.js` reads them. It cannot
see a label over a dot or a line, so look at the screenshots too. A slide is done when `errs.js` prints `ok`,
`qa.js` reports nothing at settle and mid, and the 384 px contact sheet reads.
