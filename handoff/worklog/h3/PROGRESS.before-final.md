# H3 PROGRESS (hardware, round three: the 0.6 mm board)

Brief: /home/claude/theseus/handoff/revamp2/h3-brief.md (+ common.md). Started 2026-11-06 ~10:45; the server restart stopped
the first H3 at ~11:05; resumed 11:15 (H3b). Resume rule: read this file top to bottom, then continue at "Exact next step".
Backups of every file I touch: /home/claude/work/h3/*.before.* (snap.before/ for deck/.snapshot/src; geo2d.before/ when the
twins are regenerated). Tools: /home/claude/work/h3/tools (trace.js: which slides draw the board and how, one page load).

## Status (true state, re-established 11:15-11:35 by diffing every file against its .before copy)
- [x] 0. Reading: brief, H2 PROGRESS, H1 PROGRESS + SHARED-CHANGES, KIT.md §4, common.md, FEEDBACK F30, F42, F47, F48,
      mass.py, 3d/pcb/README.md
- [x] 1. Film drawings (first H3, 10:53-11:05; checked 11:20):
  - [x] 3d/pcb/tools/board_geo.py: T 0.6, LAYERS 2 (defined, NOT yet used by the builders), CU 0.0175, Y_MASKCU/Y_PAD/Y_SILK
        derived from CU; Y_L2/Y_L3 kept (inner layers of the 4-layer build only). NOTE: build_pcb.py and mass.py import these:
        the 3D tools are half-switched until job 3 (a build now would put L3 at -0.70 under a 0.6 board).
  - [x] deck/tools/geo2d/key_parts.py: board.t (board_geo.T) and board.top (pcb-layout boardTopY_in_mouse 5.03); the
        KEY_PARTS block in 03-parts.js equals the generator's output (checked 11:24).
  - [x] 03-parts.js: BOARD_T / BOARD_TOP (from KEY_PARTS.board); pcbSec's th null → BOARD_T; clickMM's flat board BOARD_T.
  - [x] 06-motion.js: mouseSimple side view board at BOARD_TOP, BOARD_T thick (was 5.05, 1.05).
  - [x] 10-b-click.js: clk_gt01MM's own board BOARD_T (was 1.2).
  - [x] 10-h2-own.js: OWN_SEAT = OWN_M2.len - BOARD_T (4.4); own_jointMM's board BOARD_T; 10-h-own.js reads OWN_SEAT.
        (own_jointMM is used by no film slide: b11 has its own copy, b11_jointMM.)
  - [x] Snapshot: deck/.snapshot/src/{03-parts,06-motion,10-b-click,10-h-own,10-h2-own}.js == src (copied 11:03; snapshot
        and src were equal before, snap.before/ == *.before.js).
  - [x] KIT.md §4 entry "11:05 (H3, F47.4)".
  - [x] Review HARDWARE notes: b01, b02, b03, b04 (11:05, first H3); b07, b10, b11 (11:30-11:32, H3b); addenda b02 (b02_direct
        moved too), b04 (correction: the kit's side board is b04_camera's, not b04_module's; P3 already applied the must in
        src), b09 (should: BOARD_TOP literals; twin coming).
  - [x] errs (Q=&2d=1) on the affected slides (first H3: errs_job1a/b/c: b02, b03, b04, b07, b09, b10, b11 all ok; the b09_chip
        page crash in errs_job1.txt was the checker's memory, clean on rerun). Integrator: all 105 ok on its 11:12 build.
  - [ ] 2D twins: NOT regenerated. They are exported from the 3D board/wheel, so they wait for job 3's 0.6 mm two-layer build
        (then SCENES="pcb wheel" under the lock; board2d.json too, since boardMM draws the copper).
- [x] 1b. "What moved" paragraph sent to main (11:37): moved b02_card/direct/wedge, b04_camera, b11_inserts; owners' musts;
      job 3 to come (pcb + wheel twins, encoder, boardMM copper, balance).
- [ ] 2. Numbers: mass.py + README (5.63 g build, each step's grams, the new stiffness and its share, encoder + support as
      drawn); budget's board stays "5.6 g, a target" (F42.2), say the path lands at 5.63 where the budget shows the target.
- [ ] 3. 3D board: plan 5 A + B at 0.6 mm, 2 layers, 0.5 oz outer; re-route on 2 layers; DRC 0, every net routed (report
      nets two layers can't route: question for Brock); silk fab line "2L 0.6mm ENIG"; install; bundle; lighter encoder +
      cored support in 3d/parts (scrollwheel.js) and the 2D encoder (k2_encMagFront); 3D lens (boardparts.js) to the thinner
      board; balance.py re-run (does the battery move?); twins regen (pcb, wheel, board2d) under the lock; snapshot.
- [ ] 4. errs (Q='&2d=1') on every slide drawing the board / a board section; frames b03_switch, b07_board, b10_board,
      b11_board, b11_inserts (before/after).
- [ ] 5. Report (SubagentHandback).

## Which slides draw Theseus's board, and how (trace.js on the 11:22 full build, every slide at 8 times)
- Moved with the 11:03 snapshot (shared code): b02_card (GT01's board 1.2 → 0.6), b02_direct + b02_wedge (clickMM's flat
  board 1.2 → 0.6; b02_wedge's kit side board 1.05 → 0.6), b04_camera (kit side board), b11_inserts (kit side board, lit).
- Owners' own code still at 1.0/1.2 (musts in their review files): b03_switch/spdt/timing (pcbSec 1.0), b03_hotswap
  (b03_clawMM tP 1.0), b07_poron (b07_contact 1.2), b10_board (b10_boardSideMM 1.0 slab, both lanes), b11_inserts + b11_wear
  (b11_jointMM 1.0, tip 4.0), b11_battplug (b11_plugMM side 1.0), b11_repair (b11_switchClaws 1.2), b11_card + b11_repair
  (B11_SIDE 5.05/4.0). Done by owners: b04 (P3, BOARD_T in B04S), b07_board/b07_arms models (P4, 0.6).
- Plan views only (thickness invisible): kit top/bottom board on b04_skates, b07_arms, b09_card/chip/radio, b10_pmic/board/
  sealed/lights, b11_repair, b11_board. boardMM (copper from board2d.json): b07_arms. pcb twin: b09_radio, b11_board (bottom).
  wheel twin: b08_wheel. encoder drawing (k2_encMagFront): b10_lights.

## Decisions / numbers
- The board's TOP stays at 5.03 mm over the pad (posts' ends, switches, axle 12 mm up, sensor/lens focus are set from it);
  the underside rises 4.03 → 4.43. OWN_SEAT 4.4 (M2 × 5 less 0.6).
- Rivals keep their own boards (pcbSec th passed; mouseRival; b02_subBoardMM; b03 rivals; b07 G-Wolves arm; b10 rival lane;
  b11 rival joint/plug/switch).

## Shared changes (for KIT.md §4 and the integrator)
- 11:05 KIT.md §4 (H3, F47.4): BOARD_T / BOARD_TOP, pcbSec default, mouseSimple side view, clk_gt01MM, clickMM, own_jointMM.

## Models and conventions checked
| what | where | check | verdict |
|---|---|---|---|
| board thickness in 2D | pcbSec callers, kit side view, clk_gt01MM, clickMM, own_jointMM | every Theseus board drawn from one value | FIXED: BOARD_T from KEY_PARTS.board.t |
| which board face stays put | posts, switches, axle, lens focus all reference the top (5.03) | keep the top, raise the underside | top kept; underside 4.43 |
| screw reach | own_jointMM tip 4.0 = M2 × 5 less the 1.0 board | thinner board | OWN_SEAT 4.4: inside the insert's clearance hole (4.6) and a plastic boss's pilot bore (4.55) |
| tie stiffness (b07, P4) | B07_PLAN.bt 0.6 | in-plane ~t, bending ~t³ | P4's use of 60 % in-plane is right; 22 % is the bending share |
| KEY_PARTS block | key_parts.py vs 03-parts.js | regenerated output identical | OK |

## Questions for Brock (multiple choice; my default in brackets)

## Exact next step
- Job 2 (mass.py model at 0.6 mm / 2 layers / 0.5 oz) and job 3 (3D board on two layers): read layout.py, routes.py,
  autoroute.py, routes_auto.py, board_geo.py, build_pcb.py, silk.py first.
