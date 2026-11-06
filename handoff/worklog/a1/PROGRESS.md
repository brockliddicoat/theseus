# A1 audit progress (resume from here)

Scope: the 11 archived slides (clicks, arc, clk_switch, tensioner, clk_tenmat, anchors, sidebuttons; cells, elecsheet1, cable, srf_encoder)
Build audited: /home/claude/work/int/film/main-1253.html (ids: /home/claude/work/int/film/ids-1253.json)
Report: /home/claude/work/a1/AUDIT.md

## Checklist
- [x] read audit-brief.md
- [x] read common.md
- [x] read FEEDBACK.md (all, incl F38-F55, SUPERSEDED/OVERRULED)
- [x] read REVAMP.md
- [x] map old ids -> new slides (grep replaces: in deck/src/30-*.js)
- [x] extract F27 notes for the 11 old slides (05-f27.js F27R)

## Mapping (old -> new, file:line in /home/claude/live/deck/src = exact source of build 1253)
| old | new | settle | file |
|---|---|---|---|
| clicks | b02_card | 5.5 | 30-b02-clicks.js:494 |
| arc | b02_direct | 11 | 30-b02-clicks.js:1144 |
| tensioner | b02_tensioner | 11 | 30-b02-clicks.js:1308 |
| clk_tenmat | b02_stiff | 10 | 30-b02-clicks.js:1475 |
| anchors | b02_rails | 11 | 30-b02-clicks.js:1582 |
| clk_switch | b03_switch | 12 | 30-b03-switch.js:418 |
| sidebuttons | b03_side | 11 | 30-b03-switch.js:1068 |
| cells | b10_battery | 10 | 30-b10-power.js:1033 |
| elecsheet1 | b10_sealed | 11 | 30-b10-power.js:1152 |
| cable | b10_cable | 11 | 30-b10-power.js:1378 |
| srf_encoder | b10_lights | 12 | 30-b10-power.js:1501 (F27 note empty, 2/10; carries F30.20, F27 magnetic encoder, sealed note) |
Live src (/home/claude/live/deck/src) verified identical to the 1253 build's code; working source = /home/claude/theseus/deck/src (P5 editing b01-b04, b08-b11).
- [x] read each new slide's code (answers, replaces) [live src]
- [x] shoot frames (<=40 loads per run, one browser)
  - [x] run 1 (13:02, 34 loads): 0.6 / mid / settle for all 11 -> shots/r1
  - [x] run 2a (19 loads) + 2b (27 loads): t=0 + event frames -> shots/r2
  - [x] qa.js settle + mid (12 loads each): all clean (qa_settle.txt, qa_mid.txt)
- [x] judge clause by clause (40 clauses: 32 DONE, 3 PARTIAL, 3 OVERCLAIMED, 0 NOT DONE, 2 SUPERSEDED)
- [x] standing rules (section 3)
- [x] historical DONE (section 4)
- [x] write AUDIT.md (/home/claude/work/a1/AUDIT.md; re-diffed working source 13:19: b10_battery 33h/rounding and b10_lights red glow fixed in source; nothing else)
- [ ] handback

## Verdicts (short)
- b02_card: plunger turned DONE (z_card_plunger), bottom kept DONE.
- b02_direct: tensioner DONE, pts DONE, "demonstrated and sold better" OVERCLAIMED (answer cites a "What you feel" panel + "no wear in the guide": neither on slide), 20% SUPERSEDED F31.2.
- b03_switch: housing DONE, battery DONE, "almost half" OVERCLAIMED-minor (answer cites Logitech "can reduce battery life" line: not on screen), magnetic DONE, double SUPERSEDED.
- b02_tensioner: 3x DONE. Overlaps at push-in: heat key over top-row riser; locator over top-row insert.
- b02_stiff: 2x DONE; M8 mid (4.0 s) at rest between presses.
- b02_rails: one-plane DONE; abstract PARTIAL (finger hides posts/pads); uniform PARTIAL; sell cheap/wear OVERCLAIMED (no What-you-feel panel, "cheap" never said, pads invisible); medium improvement PARTIAL.
- b03_side: 5x DONE. Classroom heading touches "OpenStax 10.6" + door's red arrow through heading; wire tag among gf readouts.
- b10_battery: 3x DONE. "350 mAh · 9 g" dots (F9.5); 33 h vs +30 h; 144->140 rounding; "29.3 g".
- b10_sealed: 3x DONE (#100 ON/OFF deliberately dropped, F29.3).
- b10_cable: 2x DONE; idea #20 (Goldilocks thickness) listed but not on screen, nowhere else in film.
- b10_lights: 6 carried items DONE; red sensor glow on Theseus (critic could, open); yellow heavy at open (low).
- Blue misuse: b02_direct mower component + text; b10_cable rival lens marker.

## Notes
