# F0c: chapter transitions with real motion, longer holds (the player, round two)

Read /home/claude/theseus/handoff/revamp2/common.md (the bar, "Clips and flow"), handoff/revamp2/KIT.md (the motion kit:
mouseSimple, cam, withCam, establish, chapterCard2, LEDGER), deck/DESIGN.md §7 and §11 (the 2D-only player and clips, written
by F0b), then deck/src/20-app.js (the player: `drawSlide`, `compose(k)` with its `dissolve`, `wipe` and chapter transitions,
`APP.trans`, autoplay holds, `?clip=`), deck/tools/clip.js. F0b built all of that this morning and has finished; its notes
are in /home/claude/work/f0b/ (PROGRESS.md, CHECKPOINT1.md). Work folder: /home/claude/work/f0c/ (PROGRESS.md).

## Brock's answers (2026-11-06 ~09:00, FEEDBACK F40)
1. Autoplay hold after a slide settles: "Longer, 2–6 s". Scale it by reading load as now, within 2 to 6 s.
2. Chapter openings: "advanced motion transitions" (he declined the pass through black). Suggested direction, refine it
   if you find better: the film's one simplified mouse is the through-line. On a chapter change the outgoing slide recedes,
   the kit's mouseSimple fades up with the previous chapter's part lit, and the camera flies across the mouse (one
   continuous eased move, turning between views if needed, top to side and so on) to the new chapter's part (clicks: the
   triggers; glide: the sensor and skates; shell: the shell and hump; surface: the sides; electronics: the board; shape: the
   side profile; ownership: the base and screws), which lights as chapterCard2's words land. One camera, premium and quick
   (about 1.2 to 1.8 s), causal, nothing blue but Theseus's lit part, no decorative flourish. A chapter card must still work
   as a standalone clip (its own first frame is unaffected), and stepping backwards must play a sensible reverse.
   Where consecutive slides in a chapter share an element (a part one slide hands to the next, M9), a general, robust
   hand-off is welcome (for instance a slide may declare `handoff: { out, in }` anchors and the dissolve aligns them), but
   only if it is robust; don't build something fragile.
3. Vertical clips: "allow for both letterboxed and the same as before as options": keep both the horizontal export and the
   letterboxed `--vertical`, both documented.

## Rules
- Your files: deck/src/20-app.js, deck/src/00-head.html (the bar's CSS only), deck/tools/clip.js, deck/DESIGN.md (§7, §11).
  You may add to deck/src/06-motion.js if the flight needs it, without changing any existing signature; then copy it to
  deck/.snapshot/src/ and log it under "Changes" at the end of handoff/revamp2/KIT.md. When your 20-app.js passes its
  checks, copy it to deck/.snapshot/src/ too, so builders see the new player.
- Don't break the QA hooks (`?cap=1`, `?qa=1`, `__ready`), the rating panel (`F27R`, `s.replaces`, "not done"), the edit tool
  or the phone layout (Brock uses an iPhone 16 Pro Max: the bar wraps, panels at the top).
- Check: tools/errs.js across chapters; frames through a chapter change at several k (forward and back); a clip export of a
  chapter card and of a dense slide (frames pulled back out of the MP4s); the panels with a mocked `window.claude`.
- Brock's standing rule (F39.2): if you reuse anything of F0b's (an easing, a timing, a convention), check it rather than
  assume it is right.
- Don't commit, push or publish. Report what changed, how to use it, and any question for Brock as multiple-choice options.
