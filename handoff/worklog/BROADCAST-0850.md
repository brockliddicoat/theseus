# Broadcast 08:50: the shared hardware drawings moved to plan 5 (H1)

H1 put the hardware's real places into deck/src/03-parts.js as KEY_PARTS (and BOARD_OUTLINE), generated from the 3D
board and shell (deck/tools/geo2d/key_parts.py). Already in deck/.snapshot/src, so your --own builds use it now.
What changed on screen:
- keyPlanMM: the board is plan 5's outline (was a 38.6 x 57.5 rounded rectangle); the antenna keep-out sits forward of
  the radio module (mouse z 5.07 to 9.37, was 10.87 to 14.57: the module turned); the sensor is at key y -16.57 (was 0);
  the battery sits 2.23 mm further back (key y 12.45 to 37.45). New optional o.hi names 'lens' and 'power'.
- mouseSimple (06-motion.js): sensor, lens (2.40 mm over the pad), lens dots, battery, antenna and board all come from
  KEY_PARTS. MS_DIMS unchanged (119.2 x 62.5 x 38.1).
What to do: re-shoot every slide of yours that draws mouseSimple or keyPlanMM (frame one, mid, settle) and check that
callouts, arrows, zooms and camera targets still land on the part they name. Any number you derived from the old
positions (distances to the antenna, the sensor's place, the battery's place, the board's size or weight) must be
re-derived from KEY_PARTS, not kept.
Coming next from H1: GT01 switch walls (clk_gt01MM), the encoder (encoderMM), boardMM and a geo2d regeneration. You'll
get a broadcast when each lands.
Also live now: two research agents are filling everyone's "## Research gaps" (answers in /home/claude/work/research/FILLS.md,
plus a RESEARCH line in your review file). Keep adding needs to your gaps list or REQUESTS.md; don't search yourself.
