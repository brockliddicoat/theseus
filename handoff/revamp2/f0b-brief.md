# F0b: the player, the flow between slides, and clips for social media

Read /home/claude/theseus/handoff/revamp2/common.md first (especially "Clips and flow" and Brock's words on the audience),
then deck/DESIGN.md, then deck/src/20-app.js (the player: transitions, the bar, autoplay, the rating and edit panels, QA
hooks `?cap=1&s=<id>&t=<seconds>`), deck/src/08-v2d.js and deck/src/08-r3d.js (the 2D / 3D setting).

Brock: "it's mostly clips that will be used on social media and for parts of the website, but the flow between clips has
to be extremely good ... the pacing also has to be amazing to keep people invested for when they watch the whole thing."
And on 3D: "mostly drop the 3d version, but don't delete its assets". Work folder: /home/claude/work/f0b/ (PROGRESS.md).

## Deliverables
1. **2D only in the film.** The film always draws the 2D twins; the 2D / 3D pill and the `D` key go away from the bar,
   `?2d=0` no longer turns 3D on in the film build, and tools/build.py stops embedding the 3D bundle in `main` (keep the
   bundle code and the `three` test target working for development; delete no asset). Keep the edit-text and rate
   tools exactly as they work today (Brock uses them on his iPhone 16 Pro Max: the bar wraps, panels at the top, F23).
2. **Transitions that flow.** Study the current transitions and make slide-to-slide changes feel like one film:
   quick, premium, never a jarring cut, never slow enough to lose a viewer. A chapter boundary may get a distinct, slightly
   longer move. Respect that every slide's first frame is its header and subject (G9).
3. **Pacing in autoplay.** Each slide plays through its settle, holds long enough to read what's on screen (scale the hold
   with the amount of text, within sensible bounds), then moves on. Manual stepping still works as now.
4. **Clip mode**: `?clip=<slide id>` plays that one slide alone, once, from its first frame to its settle plus a short
   hold, with no progress tick, page counter or bar, and a small, tasteful THESEUS mark so a clip carries the brand when
   shared. It ends on the settled frame.
5. **A clip exporter**: `node tools/clip.js <abs html> <slide id> <out.mp4> [--fps=30] [--hold=1.5] [--size=1920x1080]`
   renders the slide frame by frame through the capture hook (`?cap=1&s=<id>&t=<t>`, deterministic) and encodes it with
   ffmpeg (H.264, yuv420p, `-preset veryfast`, faststart). Also `--vertical` (1080 × 1920: the stage letterboxed with the
   header kept readable, for phone feeds) if you can do it well. Check one exported clip by extracting a few frames.
6. Report what you changed and how to use it. Update deck/DESIGN.md §7 (the 2D setting) and add a short "Clips" section.

## Rules
- Your files: deck/src/20-app.js, deck/src/08-v2d.js (only what the 2D-only change needs), deck/src/00-head.html (CSS for
  the bar only), deck/tools/build.py (the 3D bundle out of `main`; don't touch the --own logic, the 05-f27.js / 06-motion.js
  lines or another builder's target), deck/tools/clip.js (new), deck/DESIGN.md (§7 and the new Clips section).
- Don't break: the QA hooks (`?cap=1`, `?qa=1`, `__ready`), the rating panel (including `F27R` and `s.replaces`), the edit
  tool, the phone layout. Test the panels with a mocked `window.claude` the way handoff/briefs/revamp-claude-2026-11-05 and
  the old repltest did (see INTEGRATOR-NOTES.md in handoff/).
- Build: `python3 tools/build.py main --out=f0b --own=20-app.js,08-v2d.js,00-head.html` and check with tools/errs.js,
  tools/shoot.js and a short clip export.
- Don't commit, push or publish.
