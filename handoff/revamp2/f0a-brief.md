# F0a: the motion kit, the simplified mouse, the chapter card and the compromise ledger

Read /home/claude/theseus/handoff/revamp2/common.md first (all of it: you are writing the tools that make its standard
easy to meet), then deck/DESIGN.md (all), then the APIs you build on: deck/src/01-core.js (colour, `text`, `rich`,
easing `E`, `ep`, drawing primitives), deck/src/04-ui.js (`header`, `captions`, `bento`, `statTile`, `demoWindow`,
`cursorAt`, `callout`, `chapterCard`, `countUp`), deck/src/03-parts.js (`keyPlanMM`, `SORA_HALF`, `part`, `boardMM`), and
deck/src/08-v2d.js (how a 3D scene's flat twin is drawn from deck/geo2d, e.g. the shell's side outline).

Eleven slide builders are planning right now and will start building the moment your kit lands, so it sets the visual
language of 104 slides. Make it premium, small and obvious to use. Work folder: /home/claude/work/f0a/ (PROGRESS.md).

## Deliverables (in this order; the first three unblock everyone)
1. **deck/src/06-motion.js**, the kit. The build already includes it (tools/build.py adds it after 06-audio.js when it
   exists). Functions (you may refine names and signatures, but keep these jobs, and document every function in a comment
   above it with a one-line example):
   - time: `spring(t, t0, { f, z })` (damped step 0 → 1 with natural overshoot, for snaps and rebounds),
     `pressCurve(t, t0, { down, hold, up })` (a press's depth 0 → 1 → 0 over time), `beats(t, [[t0, dur], ...])` (which
     beat is active and its local progress), plus whatever small helpers the rest needs.
   - camera: `cam(t, keys)` (keyframes `[t, cx, cy, s]` eased with E.cam), `withCam(c, box, fn)` (draw fn in a camera
     transform clipped to a box), so a slide can push in from the whole mouse to a part in one continuous move.
   - **`mouseSimple(view, o)`**: the deck's one simplified mouse, in mm, views `top`, `side`, `front` (and `bottom` if you
     can), drawn as clean outlines with only a few key lines: the Sora's one seam split from the nose to the straight rear
     seam with the wheel in it (F9.28, F11.3), the triggers and their straight rear cutout, the wheel, the side buttons, the
     sensor window, skates. Parts can be lit by name (`hi: ['triggers', 'wheel', ...]`) in Theseus blue or a rival yellow,
     and dimmed otherwise. Base it on the real outlines (keyPlanMM's SORA_HALF for the top, the shell's flat twin in
     deck/geo2d for the side and front), smoothed and simplified so it reads clearly as an illustration, not the final
     product (Brock: "a mouse that is clearly slightly simplified ... only showing the parts of the design that matter").
     Dimensions 119.3 × 62.4 × 39.9 mm (F12.11). Skin and hands never peach (F9.24).
   - `establish(t, t0, box, { view, hi, focus: [x, y, w, h in mm], dur })`: draws mouseSimple with the part lit, then pushes
     the camera in to `focus`; returns what the slide needs to draw its detail in that camera (mm → px), and leaves a small
     locator (`locator(...)`: the mouse outline with a box on the part) in a corner once pushed in.
   - agents and forces: `finger(x, y, ang, { press, s, alpha })` (a clean, mono-grey fingertip seen from the side or from
     above, pressing), `forceArrow(x, y, ang, len, { N, label, t, t0 })` (grows in, labelled in newtons), and use the
     existing pointer (`cursorAt`) for anything moved or dragged.
   - comparison: `abSplit(t, t0, rect, { left: 'MOST MICE', right: 'THESEUS', rival })` (two panels on one scale, labelled
     in type, the rival's name in quiet yellow or grey), `wipeTo(t, t0, dur, rect, drawRival, drawTheseus)` (in place, the
     rival becomes Theseus behind a thin wipe line), and **`verdict(t, t0, x, y, { from, to, unit, label, better, size })`**:
     the one headline for every before → after in the deck (the old value struck and grey, an arrow, the new value in
     Theseus's gradient counting from the old, a short label with which way is better). It replaces the per-chapter
     versions (clk_hl/clk_ba, gld_head/gld_ba, shellHL/shellBA, srf_hl/srf_ba, own_ba): look at them and do better.
   - the shot: `shotInset(t, t0, x, y, w, h, { miss, drift, label })`: a small, crisp crosshair over a target; the rival's
     fault pulls it off target at the moment that matters (MISS), Theseus holds (HIT). Tasteful, used sparingly.
   - teaching: `demoPanel(t, t0, rect, { label })` (a quiet frame for a classroom demonstration: a hairline and a small
     label such as "THE CLASSROOM VERSION", nothing heavy), and `scaleNote(x, y, text)` (one quiet line of human scale).
   - flow: **the compromise ledger**. A shared `LEDGER` (chapter → the compromise most mice make, in a few words, and
     Theseus's answer, in a few words) and `ledger(t, t0, rect, { focus, answered })` that draws it as a compact list or
     strip, the focused chapter's compromise in red turning to Theseus's answer in blue. Write a strong first draft of the
     text for every chapter (clicks, glide, shell, surface, electronics, shape, ownership) from REVAMP.md; the chapter
     builders may propose changes. And **`chapterCard2(t, { ch, compromise, answer, list, part })`**, the chapter opener:
     the chapter's name, the compromise most mice make in its area as the problem, the ledger strip, the ideas in the
     chapter, a simplified part drawing. Every chapter card uses it, so the cards read as one family and every one works
     as a standalone clip.
2. **handoff/revamp2/KIT.md**: the API reference, one short example per function, and the rules of use (when to use
   `shotInset`, how long a push-in takes, the beat timings in common.md M6). Write it so a builder can use the kit
   without reading 06-motion.js.
3. **A kit test page**: add a `kit` target to tools/build.py (like `comps`, building a test file `deck/src/19-kit-test.js`)
   that shows each element animating, including one complete little demonstration in the standard's shape: establish on
   the mouse, push in to a part, the rival failing under a press, the wipe to Theseus holding under the same press, the
   verdict landing. Screenshot its frames and judge them hard against common.md's bar. This page is the exemplar every
   builder will look at.
4. Then tell the integrator by finishing with your report (what each function does, the timings you chose, anything in
   the shared files you'd change and why). Don't edit the shared files yourself except tools/build.py (the kit target).

## Rules
- Your files: deck/src/06-motion.js, deck/src/19-kit-test.js, handoff/revamp2/KIT.md, and the `kit` target in
  deck/tools/build.py. Nothing else.
- Every frame a pure function of t. No state between frames except caches keyed by inputs.
- Performance matters: these run on every frame of every slide on phones. Cache paths you build from outlines.
- Build and check like the builders (common.md): `python3 tools/build.py kit`, errs, frames at several times, downscaled.
- Don't commit, push or publish.
