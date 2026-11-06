# H3 PROGRESS (hardware, round three: the 0.6 mm board)

Brief: /home/claude/theseus/handoff/revamp2/h3-brief.md (+ common.md). Started 2026-11-06 ~10:45. The server restart stopped
the first H3 at ~11:05; resumed 11:15 (H3b). Resume rule: read this file top to bottom, then continue at "Exact next step".
Backups of every file I touch are in /home/claude/work/h3/ (*.before*.py/js/md, pcb.before/, geo2d.before/, snap.before/).
Tools are in /home/claude/work/h3/tools. Pictures are in /home/claude/work/h3/shots.

## Status (true state, 13:02)
- [x] 0. Reading.
- [x] 1. Film drawings: every 2D Theseus board reads BOARD_T (0.6) and BOARD_TOP (5.03): pcbSec, mouseSimple, clk_gt01MM,
      clickMM, own_jointMM. Snapshot is equal to src. KIT.md §4 11:05. HARDWARE notes: b01-b04 (11:05), b07/b10/b11
      (11:30-11:32), addenda b02/b04/b09 (11:34). The twins were regenerated in job 3.
- [x] 1b. "What moved" sent to main at 11:37.
- [x] 2. Numbers.
  - mass.py runs at 0.6 mm, two layers, 17.5 um. The encoder and support are as drawn (3d/parts/tools/wheel-mass.json).
  - The path table runs 7.92 -> 5.68, with each step's grams. Stiffness: bending 21.6 %, in-plane 60 %.
  - 3d/pcb/README.md: header, Stack/Routing/Silk, "Two layers: what it costs", mass table, path, options, balance, files.
  - 3d/parts/README.md: the magnetic, lighter encoder; the cored support; the lens; an H3 section.
  - **The build lands at 5.68 g, not 5.63**: the encoder and support as drawn weigh 0.475 and 0.202 g, against the 0.45
    and 0.16 estimated. This is said in the README and in b01.md (12:46, a must for P3, now the polish owner:
    `B01_PCB_PATH.g` 5.63 -> 5.68).
- [x] 3. 3D board. Plan 5 A and B are at 0.6 mm, 2 layers, 0.5 oz, re-routed:
  - DRC 0 on both, every net routed. GND is one piece (gnd.py: A 4 repair vias, B 5). No via-in-pad.
  - Installed pcb.glb, pcb-b.glb and both layout JSONs (12:30). The bundle is rebuilt.
  - Lighter encoder 0.475 g and cored support 0.202 g are in scrollwheel.js; the lens is referenced to the board's top.
  - Twins pcb, wheel and board2d were regenerated under the lock (12:33) and are in the snapshot. KIT.md §4 12:33.
  - Balance: the board as built puts the mouse's CoM at z +0.13. Z 0 wants the battery 0.47 mm back. Not moved: S2's
    posts first, then one move for both (main agreed 12:47).
- [x] 4. errs (Q=&2d=1): all 28 slides that draw the board are ok on main-h3g (12:49 build with BOARD_G).
      b11_wear's page crashed once (checker memory) and was clean on rerun.
      The five frames before/after: shots/final_before_after.jpg (h3old vs final). Job 3's twins: shots/zoom_*.png, cmp_*.png.
- [x] Main's 12:47 asks:
  - (1) BOARD_G = KEY_PARTS.board.g = 5.68 in 03-parts.js. Source: mass.py -> 3d/pcb/pcb-mass.json (new, committed) ->
    key_parts.py. In the snapshot 12:49; KIT.md §4 12:50; main messaged 12:5x.
  - (2) Options with grams and pictures: shots/mass_options.png and mass_opt_B..H.png. Grams come from the builder
    re-run (whatif/run2.mjs -> whatif/options.json). Nothing applied.
  - (3) Battery after S2's posts.
- [ ] 5. Report (SubagentHandback).

## Numbers
| what | value |
|---|---|
| bare board (0.6 mm, 2L, 17.5 um) | 2.25 g (laminate 1.78, copper 0.37 with barrels, mask 0.10) |
| board + on-board parts | 5.01 g |
| + encoder 0.475 + support 0.202 (the 5.6 g target's scope) | **5.68 g** (target 5.60; Brock's path 5.63) |
| + wheel 0.900 + axle 0.116 = total vs Sora's 8.29 | 6.70 g (7.18 with Brock's Mill-Max) |
| bending / in-plane stiffness vs 1.0 mm | 21.6 % / 60 % |
| vias A / B | 120 / 120 (GND 70 / 71) |
| USB pair (0.13 mm, gap 0.15-0.87) | ~121 ohm single, 152-216 ohm diff (IPC-2141, er 4.3); ~0.55/0.15 mm gives ~91 |
| magnet field at the Hall IC | ~110 mT at 0.4 mm; 0.3-0.6 mT 12 mm under the magnet (main-board option) |
| balance | board CoM (+0.39, 6.58, +24.11); mouse z +0.13; battery to -27.45 (0.47 back) for z 0 |

## Options to win back the 0.08 g (builder re-run; none applied)
| option | g | board |
|---|---:|---:|
| B encoder walls 0.40 -> 0.35 | -0.032 | 5.65 |
| C sensor board 0.5 -> 0.4 | -0.013 | 5.67 |
| D post walls 0.55 -> 0.45 | -0.011 | 5.67 |
| E foot 2.4 -> 1.8 tall | -0.013 | 5.67 |
| F seat 0.6 shorter | -0.010 | 5.67 |
| B+C+D | -0.056 | 5.63 |
| B..F | -0.080 | 5.60 |
| G Hall IC on main board (not recommended: 0.3-0.6 mT) | -0.097 | 5.59 |
| H board 0.5 mm (12.5 % bending) | -0.32 | 5.37 |

## Questions for Brock (multiple choice; my default in brackets)
- Q1 mass (shots/mass_options.png): [A accept 5.68 as built] / B+C+D -> 5.63 / B..F -> 5.60 / H 0.5 mm board.
  G is not offered as a choice.
- Q2 USB pair (shots/q_usb.png): [A widen to ~0.55/0.15 over unbroken copper] / B coplanar / C keep 0.13 representative.
- Q3 B3 (shots/q_b3.png): [A keep C10/C11 moved, plain via] / B via-in-pad (filled, capped).
- Notes, no choice needed: the Mill-Max 3305 is soldered ("No Tail Solder"), so it has 0.6 mm of barrel to solder to,
  and it protrudes 1.81 mm below; its tip height is unchanged. The battery move waits for S2's posts.

## Shared changes (KIT.md §4)
- 11:05 BOARD_T / BOARD_TOP, pcbSec default, mouseSimple side view, clk_gt01MM, clickMM, own_jointMM.
- 12:33 twins pcb / wheel / board2d, k2_encMagFront / encoderMM (lighter encoder), boardMM far layer + bottom routes.
- 12:50 BOARD_G (KEY_PARTS.board.g, 5.68).

## Exact next step
- Send the final report via SubagentHandback.
