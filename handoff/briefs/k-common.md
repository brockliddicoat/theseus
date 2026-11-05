# Acting on Brock's slide ratings: the common part of every K brief

You're improving slides of Brock Liddicoat's Theseus deck: a 131-slide canvas film pitching his 29.31 g gaming mouse. The
repo is /home/claude/theseus, with the deck in deck/ and the 3D pipeline in 3d/. He has just rated the slides 1 to 10
with notes. Your brief names the slides and items that are yours.

## Read first
1. /home/claude/theseus/FEEDBACK.md, all of it. **F27** holds his rating and his note for every slide, verbatim, and
   the lessons drawn from them (G1 to G10). **F26** holds his 01:43 notes. The STANDING items apply to every slide. A
   DECIDED item beats a lesson where they differ.
2. /tmp/claude-0/-home-claude/17d0b892-9041-5973-afc8-9659df39052b/scratchpad/BRIEF-V5.md and BRIEF-COMMON.md.
3. /home/claude/theseus/deck/DESIGN.md, section 0 (items 9 to 12) and section 2b.
4. Each slide's code: grep for its id in deck/src (slides are `S({ id, ... })`).

## The lessons, short (F27 has them in full)
G1 the problem first, then Theseus's fix, then what the player feels · G2 real-world examples and human-scale forces,
said on the slide · G3 accurate, finished drawings in one style, researched, nothing lazy or photo-real · G4 fewer,
denser slides · G5 honest, complete numbers, one precision per comparison, rivals included even when Theseus looks worse
· G6 no "pts"/"points"; "khz"; Piaknow capitalized; "Dual 8khz wired and wireless"; "battery", never "cell"; plain
words · G7 sell what the player gets, at a glance (F14.10, before → after F16.1) · G8 uniform parts where uniformity is
the claim · G9 the opening frame is the header, never a lone phrase · G10 software and latency slides simple.

## How to work
- **Read his note for each of your slides twice, and act on every clause.** He said he worries we miss feedback (G9).
  Before you report, tick each clause off in your PROGRESS.md.
- **Research** where a note asks for it, or where accuracy depends on it: sources on screen, derived numbers marked.
- **Merging or removing a slide:** merge the content into the slide named, keep the removed slide's code as a
  `const HIDDEN_<id> = ({...})` (not registered), and re-anchor any slide that sat `after:` or `before:` it.
- **Ratings (changed 05:15; this replaces any earlier rule):** his old score is archived only when you raise the slide's
  `rev` (`rev: 1`, or one above what's there), never by a code or wording change. Raise it only once you've acted on
  every clause of his note on that slide, and in the same edit give the slide `answers: [['his clause, in his words,
  short', 'what you changed, one line'], ...]`: one pair per clause, including any you couldn't do (say why). The rating
  panel shows him his archived note beside your answers, with a "not done" button that brings the note back. A slide you
  only touched in passing keeps its rev.
- **Honesty:** every number sourced or derived and marked; never invent, never weaken a rival.

## Rules
- **Scratchpad** means /tmp/claude-0/-home-claude/17d0b892-9041-5973-afc8-9659df39052b/scratchpad: your notes, shots and
  progress go in scratchpad/<code>/.
- **Files:** only those your brief names. Shared files (01-core.js, 03-parts.js, 04-ui.js, 05-data.js, 07-*.js, 08-*.js,
  20-app.js): describe needed changes in your report.
- **Git and publishing:** don't commit, push or publish.
- **Build:** `cd /home/claude/theseus/deck && python3 tools/build.py main --out=<code> --own=<your files>` (add `vendor`
  and `geo2d` if you rebuild them); the rest comes from deck/.snapshot, which is current.
- **Check** with `NODE_PATH=/opt/npm-tools/node_modules`: `tools/errs.js` in 2D (`Q='&2d=1'`) and 3D (`Q='&2d=0'
  READY_MS=60000`) on every slide you touched; `tools/qa.js` at `T=settle` and `T=mid`; screenshots with `Q='&2d=1'`,
  downscaled before you look, and a 384 px contact sheet of your slides, looked at for two seconds each.
- **Progress:** keep scratchpad/<code>/PROGRESS.md as you go (the container restarts sometimes).
- **Pace:** Brock: "i don't want them to chew through my limits before accomplishing anything". Finish slide by slide,
  most important first, and keep each slide working as you go. Be economical with tokens, never with quality.
- **Processes:** never `pkill` Chromium broadly.

## Report
Per slide: what changed (before → after, one line), every note clause addressed or why not; sources added; files and
assets changed; checks; questions for Brock as choices (he answers with a multiple-choice tool).
