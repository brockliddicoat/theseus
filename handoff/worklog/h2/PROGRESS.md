# H2 PROGRESS (hardware, round two)

Brief: /home/claude/theseus/handoff/revamp2/h2-brief.md (+ common.md). Started 2026-11-06 ~09:50.
Resume rule: read this file top to bottom, then continue at "Exact next step".
Backups of every file I touch: /home/claude/work/h2/*.before.* and geo2d.before/.

## Status
- [x] 0. Reading (brief, H1 PROGRESS/SHARED-CHANGES, KIT §4, FEEDBACK F42/F30/F25/F26/F21.11, common.md, b07/b11 code)
- [x] 1a. Balance model checked and corrected: 3d/pcb/tools/balance.py rewritten (H1's model kept: --h1). Tools:
      work/h2/tools/clear.py (clearances), decompose.py (each correction), bosses_est.py (unmodelled posts).
- [x] 1b. Integrator told (heads-up 10:0x): 3.01 mm forward, not 5.9; why; b07 knock-ons; bosses for S1.
- [x] 1c. Integrator (10:1x): add the side switches (F44.2, 0.5 g x 2, out of the shell) and the boss-post estimate
      (~1.3 g at MH1-4), solve z 0, regenerate, then the "what moved" note; b07 numbers to review/b07.md (HARDWARE). DONE:
      balance.py has both (posts from the shell meshes: _first_above/posts); RESULT battery 2.03 mm BEHIND H1's place.
      review/b07.md HARDWARE note written (10:14).
- [x] 2. Applied: board.py BATTERY (z -36.60..-11.60, yMid 7.46: no rise), build_pcb note, components.py BATLEAD (follows
      BATTERY; inboard of MH4's post, axis 3.51 mm from the hole), A + B rebuilt (scratch work/h2/pcbA, pcbB) DRC 0 + 0,
      installed; 3D bundle rebuilt (identical JS + the wheel default + new pcb assets); key_parts.py --write (lock: only
      the battery line); 03-parts.js comment + k2_encMagFront 12; geo2d SCENES="pcb wheel" (lock); extras.py pins the pcb
      twin's camera frame to its 09:17 value (else every 2D board view moved up to ~15 px). Snapshot copies + KIT §4: TODO.
- [x] 3. F42.2: mass.py target section (prints + work/mass.json 'target'); README "5.6 g is the target" table.
- [x] 4. Axle height one value: scrollwheel.js default 11 -> 12 (pcb.js, shell.js, stand-in already 12) + README; 2D
      k2_encMagFront board 11 -> 12 (pins, feet, housing, anchors). b10_lights' encoder (py+172, 12 px/mm) now reaches 10 px
      into its step ticks -> tell the integrator (b10: py + 160). J2/J3: 4.65/4.50 mm from the keep-out, 6.30/6.15 from the
      antenna: over Taoglas's 4 mm minimum, kept. Found: R1 2.48 mm and C35 3.81 mm from the antenna (under 4 mm if the rule
      covers passives): README "Metal near the antenna"; question.
- [ ] 5. errs + frames on battery / key plan / simplified-mouse slides; one paragraph to the integrator
- [ ] 6. Report (SubagentHandback)

## Decisions / numbers (job 1)
- FRAMES: layout x = user's right, z = nose; mouse X = -layout x, Z = layout z - 2.88; board top mouse y 5.03 (1.0 thick).
  KEY_PARTS key plan: x = layout x, y = -(mouse z).
- H1's model reproduced exactly (balance.py --h1): battery for CoM 0 at mouse z -19.049 = 5.901 fwd of H1's place.
- Corrections (decompose.py, battery at H1's place): screws + inserts at the board holes +0.454; bare board (mass.py
  3.905 g) at the core centroid (layout z 19.99, not the outline's 21.65) -0.154; Mill-Max x6 + solder +0.075; encoder 1.0 +
  support 0.26 inside the 5.6 g (F42.2) +0.413; total +0.788 mm. Board CoM now mouse (+0.83, 6.51, 23.44), 7.92 g scaled to 5.6.
- RESULT: battery centre mouse z -21.936 (3.014 fwd of H1's place; 0.78 fwd of the old key-plan place), yMid 8.96 (up 1.5).
  Layout box x -17.09..17.91, z -31.56..-6.56. Front edge 1.05 mm over the rear lobes (they end at layout -7.61).
  Brock's literal 5.9/1.5 in the corrected model: CoM +0.79 (ahead) and the front 1.23 mm into the rear posts -> FAILS.
- Clearances at the result (clear_fwd3.014_up1.5.json): shell nearest 6.64 (tail, the rim ledge at X -17.4 y 1.8 z -38.6);
  roof 15.05; sides 7.27; board under it 13.7 mm2 (bare lobes: no parts), 1.93 mm over the board top; posts over MH3/MH4
  1.66 (Ø5.3 fasteners.js stand-in) / 2.11 (b11's 4.4-wide drawing); screw heads under the board (#54) 2.93 below the
  battery; antenna keep-out 14.51, the antenna itself 14.55 (was 17.52 at H1's place, 15.29 at the old place; literal
  5.9 would be 11.67). Taoglas: >= 4 mm minimum, 20 mm best (FILLS b09-1).
  Without the rise (up 0): 0.43 over the board, shell 5.55, roof 16.55: the rise kept (Brock's "up"; room for swelling).
- Unmodelled: boss posts (bosses_est.py: MH1/2 posts would hang from triggerL/R (moving parts!), 20.6 mm; MH3/4 from the
  body, 29.3 mm; ~1.32 g at mean z +7.98 inside the shell's 10.35 g -> about +0.83 mm if modelled). LP402535JU pack length
  37 (Endrich, with PCM) vs the drawings' 35; its tabs exit a 25 mm edge (the side in this orientation) while BATLEAD ends
  at the front edge (H1's convention, kept). Jauch matd 246497: "2 wire 50mm" (no NTC wire; J2 is 3-pin with NTC).

## Shared changes (for KIT.md §4 and the integrator)
- (pending)

## Final numbers (job 1, after the integrator's 10:1x additions)
- Battery layout box x -17.09..17.91, z -36.60..-11.60; mouse centre z -26.98, yMid 7.46 (bottom 5.46, top 9.46).
  Offset: 2.03 mm BACK of H1's place (4.26 back of the old key plan's), no rise. KEY_PARTS.battery y 12.45 -> 14.48.
- CoM: X +0.70, Y 12.60, Z 0.000 (balance.py). Without the posts (side switches in) the place would be 1.00 fwd of H1's;
  without both, 3.01 fwd; H1's model 5.90 fwd.
- Clearances (clear_back2.029_up0.json): shell 3.61 mm (the rim ledge under its rear corners, y 1.85 at z -39.4); roof
  12.85; tail 3.61; sides 3.61 (same ledge points); no board under it (front 3.99 behind the lobes); rear posts 6.70
  (Ø5.3) / 7.15; screw heads under the board 1.43 below the battery; antenna 19.55 (keep-out 19.55). With the rise:
  shell 5.11, roof 11.35.
- How it is held: the two band stations (at 0.28 / 0.72 of its 25 mm length, as b11 draws them) both lie behind the board
  (the front one 11 mm behind its edge), nothing at the new place is in their way (shell 3.6 mm under/behind, posts 6.7 ahead),
  the plug J2 still pulls straight back 2.9 mm before MH4's post (unchanged), and the battery comes out down through the open
  bottom once unplugged (it can't slide 25 mm fore or aft inside: 6.7 mm to the posts, 3.6 mm to the tail).

- [x] 5. errs (Q=&2d=1, TIMES 0.5,4,10): all 104 film slides ok (errs_all.txt 64 + errs_rest.txt 40; one transient page
      crash on b08_film, clean on rerun). Shots before/after from identical 30-*.js (work/h2/shots/{h2,h2old}, cmp/).
      Snapshot 10:20 (03-parts.js, geo2d/pcb.json, wheel.json; both equal to my backups before). KIT.md §4 entry.
      "What moved" sent to main (10:2x). clear.py --now [--shell X.glb] for S1's re-check.

## Models and conventions checked (F39.2)
| what | where | check | verdict |
|---|---|---|---|
| balance model | 3d/pcb/tools/balance.py (H1), b07 B07_POS | each mass's place against the film's design | FIXED: screws + inserts were at the optional plate's screws (film: no plate, #54/b11) +0.45; bare board at the outline's centroid (bay is a hole) -0.15; encoder + support missing from both board and wheel (F42.2 puts them in the 5.6 g) +0.41; Mill-Max + solder +0.08. ADDED (integrator): side switches F44.2 +0.55; posts (estimate) +0.83. --h1 reproduces H1 exactly (5.901 mm) |
| shell set for clearances | clear.py | which meshes are structure | 'core' is a black light-blocker stand-in (shell README): excluded; 'plate' excluded (no plate in the film) |
| "screw heads" under the battery | brief, H1 notes | #54 / b11: screws driven from below | heads are UNDER the board; above MH3/MH4 stand the shell's posts (b11 draws them; fasteners.js boss Ø5.3): the real constraint |
| battery lead (BATLEAD) | components.py | path vs the MH4 post | passed 2.29 mm from MH4's centre (inside a Ø5.3 post): re-routed, axis 3.51 mm, follows BATTERY |
| board 2D twin camera frame | geo2d/pcb.json, 08-v2d.js | does the lead's length move the board views? | yes (r and centre from the whole scene): pinned in extras.py to the 09:17 frame |
| encoder axle height | scrollwheel.js default 11, 2D k2_encMagFront 11, mouse 12 | one value | 12 everywhere (shell wheel centre 17.03 - board top 5.03) |
| board mass model at a thinner board | mass.py | dielectric = finished thickness - copper | kept (mass.py's own model); consequence: 4->2 layers saves only 0.13 g at the same thickness |
| battery size 35 x 25 x 4.0 | KEY_PARTS, board.py | Endrich listing (research/data/batteries.json): width 25, length 37 | NOT changed: question (the pack with its protection board is 2 mm longer) |
| Taoglas 4 mm / 20 mm | research FILLS b09-1 | applies to J2/J3? to passives? | J2/J3 over 4 mm (kept); R1/C35 under if passives count: question |
| kit focus boxes for 'battery' | 06-motion.js msView boxes | still frame the battery after the move | top [-24,4,48,38]: margins 10.5 / 2.5; side: rear edge 0.52 mm inside: OK, not touched |

## Research gaps
- Raytac AN54LM-P20A keep-out drawing (behind project registration; raytac.com product page / datasheet): feeds the
  board's antennaKeepout and the R1/C35 question.
- Jauch LP402535JU drawing (datasheet matd 246497 has no dimensions; ask batterytechnology@jauch.com): length with the PCM,
  which edge the wires leave, max thickness / swelling; "2 wire 50mm" (no NTC) vs J2's 3-pin NTC.
- The shell's internal structure: the four posts (#54) and the band anchors are not in the 3D shell (S1); the front posts
  would hang from the triggers.

## Questions for Brock (multiple choice; my default in brackets)
1. Battery place (F42.1): [a] where it balances: 2.03 mm back, same height | b] the same, plus your 1.5 mm rise (balance
   point 0.41 mm higher) | c] leave it at today's place until the shell's posts are modelled (0.55 mm ahead of centre).
2. Metal near the antenna: a] move R1 (2.48 mm) and C35 (3.81 mm) out to Taoglas's 4 mm at the next board round | [b] leave
   them (outside the keep-out) | c] ask Raytac for the real keep-out first.
3. Board to 5.6 g: a] 0.8 mm + lighter encoder and support (6.51 g) | [b] 0.6 mm, 2 layers, half-ounce outer copper, lighter
   encoder and support (5.63 g) | c] keep 1.0 mm, find grams elsewhere.
4. Battery drawing: a] draw the pack, 37 x 25 (with its protection board) | [b] keep 35 x 25.
5. Sideways balance (X +0.70 toward the side buttons, from the side switches): a] shift the battery 2.6 mm right | [b] leave it.

## Exact next step
- Final report (SubagentHandback). If the integrator writes, act on it first.
