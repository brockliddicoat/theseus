# F0b progress (player, flow, clips): DONE 2026-11-06, report sent

Brief: /home/claude/theseus/handoff/revamp2/f0b-brief.md. Build:
`cd /home/claude/theseus/deck && python3 tools/build.py main --out=f0b --own=20-app.js,08-v2d.js,00-head.html`
Scripts (mine, not shipped) in /home/claude/work/f0b/scripts/: slides.js, textamt.js, trshot.js (transition frames via
__seek + trClock), clipshot.js, determ.js, mockclaude.js (+ phone.js, paneltest.js, autotest.js), gate.js, holds.js,
livetest.js, perf.js.

## Done
- D1 2D film: 08-v2d gate (3D only with R3D && window.R3D_DEV); pill markup+CSS out of 00-head; D/2/3 keys and the
  #2d/#3d hash handler out; build.py build(..., r3d=True), main r3d='--with3d' in args, r3d_tag sets R3D_DEV.
- D2 transitions: dissolve 0.55 (straight crossfade, E.io5: shared content holds still), wipe 0.7 (10° edge, feather
  3 % of width via a band-sized canvas + gradient, rest clipped), chapter 1.1 (recede into black, card from 1.03, clock
  held 38 %), iris (opt-in, irisAt), push (legacy), cut. Edit mode: no transition. Reduced motion: 0.25 s dissolve.
- D3 autoplay: HOLD {base .5, cps 250, small .3, min 1.2, max 4}; measured on the first frame past settle via QA.text;
  s.hold overrides; panels/notes block + 1.5 s grace; pause; hidden tab pauses; ?auto=0; seg progress counts the hold.
- D4 clip mode: ?clip=<id> (+&vertical=1), clipMark, composeVert, chapterInfo override (no "03 / 12"), tap/Space/R replay.
- D5 tools/clip.js (+--vertical, --size, --fps, --hold, --crf); BT.709 tags, faststart verified.
- D6 DESIGN.md: §7 2D setting rewritten, §1 rows, §10 checks line, new §11 "Clips and the flow".
- Body margin 0 in 00-head (captures were 8 px low; phone bar 16 px narrower).
- CHECKPOINT1.md + message to main; integrator accepted all three; header() now set at t = 0 (04-ui, snapshot):
  clip first frame checked from the MP4 (clips/c_sheet.png).

## Checks run (all pass)
errs (23 + 13 slides, rec/comps/parts/kit/three pages), qa settle+mid, qa in clip mode, determinism, gate cases,
panels on 440x956@3 and desktop with mocked window.claude, autoplay cases, live clip, exports h+v with frames pulled out.
