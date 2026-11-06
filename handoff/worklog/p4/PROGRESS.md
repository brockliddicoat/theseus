# P4 PROGRESS: polish b05, b06, b07 (Shell I, II, III + Shape)

Brief: /home/claude/theseus/handoff/revamp2/p4-brief.md. Files I own: deck/src/30-b05-shell.js, 30-b06-lattice.js,
30-b07-board-shape.js. Work folder: /home/claude/work/p4/.
Started 10:02 (machine clock CST).

## Read (done)
- [x] p4-brief, POLISH.md (b05/b06/b07), review/b05.md b06.md b07.md, b05/b06/b07 PROGRESS.md, FEEDBACK F41-F45,
      BROADCAST-0930 / 0945 / CPU, INTEGRATOR.md, common.md, KIT.md

## Open items (POLISH.md + review files)
b05:
- [x] P-b05-1 already fixed by the builder (no 'firm' left; 2 N 'about the hardest grip measured at a desk (Won 2009)', 10 N 'a hard press')
- [x] P-b05-2 checked, unchanged: Codex's lines are its caption 1/2 and label; numbers 2.00 g, 111 -> 12 µm, 9.18 floored 9.1x verified
- [x] R2-b05-1 answers of nopick/hotspot/margin/work are getters built from b05_fr() (b05_live); nopick and margin were stale too
- [x] R2-b05-2 hotspot: press 0.2 -> 1.25 s to 182 N, crack 1.25-1.5, push-in 1.4-2.1; milled use rounded up (91 %)
- [ ] R-b05-4 (could, NOT YET) nopick foot line "weight added by thickness out of the page"
b06:
- [ ] L1 LATTICE STUDY -> B06_STRIP + arch models (pending, watch review/b06.md)
- [ ] R2-b06-1 (should) b06_arch settle shows buckled arch: press to buckle then fall back to 10 N, hold
- [ ] R2-b06-2 (could) b06_arch two verdicts: stiffness lead, strength as small stat
- [ ] R2-b06-3 (should) b06_thrust one precision (55.60 -> 56 -> 0.9 MPa) and one headline (palm 65x lead, fingertip 3.8x second)
- [ ] R2-b06-4 (could) b06_thrust palm drawn as a hand
b07:
- [x] Battery from KEY_PARTS (z -26.98, 7.46), H2's parts (side switches x2, posts x2 est., screws/inserts at the holes, board 23.44/6.51): CoM 0.00/12.60, scales 14.7/14.6, lever 4.0 -> 0.7 mm (rounded against Theseus), live answers (b07_live)
- [x] Rib-foot joint options sheet IMAGE (F44.1): /home/claude/work/p4/sheet/rib-foot-joint-options.png, sent to main 10:2x
- [x] SRC dups: b07GwPlusPro->b01GwPlusPro+b01GwWarg, b07GwHtsU->b01TpuHtsU, b07Fr4Flex->shlFr4, b07X2f->b01X2f+b01X2fWt; b07Fr4Wiki kept (no other FR-4 entry). Also b07_size X2F 29.5 -> 29 g (Pulsar, BROADCAST-0945)
- [ ] R2-b07-1 (should) b07_board verdict who-labels ("Rim alone" / "Tied to the board"); rod's flex beside if in model
- [ ] R2-b07-2 (could) "my HTS Ultra 8K" -> third person
- [x] R2-b07-3 who: ['Battery in the hump', 'Theseus'] + GPX Superlight's battery glued to its top shell (iFixit, b11GpxBatt)
- [x] R2-b07-4 captions at 0.2 / 3.4 / 4.5 / 7.2

## New findings queued (10:2x)
b05: R2-b05-3 material 'pull test' wording; R2-b05-4 cubed ULX quote vs magnesium wall; R2-b05-5 work 69 % label; R2-b05-6
     hotspot/margin chain the sized triangles; F22 card list; R-b05-4 nopick 'weight added out of the page'.
b06: R2-b06-5 fibres colours; R2-b06-6 fillet/filletsize one headline, mold only band; R2-b06-7 arches 7.2; R2-b06-8 'Mine:';
     FILM F26 order; KIT % spacing (lines 293, 356, 857x2, 1017, 1093, 1127 at 10:31).
b07: R2-b07-5 MUST emg blue on rivals; -6 emg payoff; -7 newton window; -8 size demo/verdict/frame one; -9 sheet PPS; -10 poron
     '5 slips' modelled + locator; -11 sides labels/key; FILM shape order; b07_arms answers: feet hold both ways (joint study).

## Log
- 10:05 baseline build: dist/main-p4.html (--own all three). Backups of the three files: /home/claude/work/p4/backup/.
- 10:1x rib-foot sheet: sheet/joint.js (a private slide p4_joint, injected by sheet/make.py into pages/joint.html; never in src).
  Model facts (b07's plan model, 'whole'): squeeze at z 4: rear row −0.77 feet push 5.6 N, front row 41.16 pull 1.4 N; over the
  sweep: max push 11.6 N (z −8 @ row −0.77), max pull 2.2 N (z −8 @ 9.17). PUSH-ONLY feet (plain slot, tension feet let go,
  iterated): softest spot along the board 42.35 -> 54.44 µm (arms 50.84): b07_arms' verdict would flip, so the slot must be keyed.
  Section model (b07_board): the tie is in compression under the squeeze (−6.34 N), tension under the crown press (+0.88 N).
  Sources: 3M AC77 primer page ("difficult-to-bond low surface energy plastics such as polypropylene"); PP-C-20A strain at break 3 %.
- 10:2x b05: b05_live() helper; nopick/hotspot/margin/work answers live; hotspot crack on screen. errs ok, qa clean settle+mid,
  frames shots/hot (0, 0.8, 1.45, 2.3, 4.2, 10.5) + phone. Answers printed with tools/answers.js.
- 10:3x b07: H2 HARDWARE mirrored (B07_POS, b07_cg, b07_balParts, b07_battZ/Y read KEY_PARTS); b07_live(); balance labels,
  captions, source; SRC dedup; X2F 29 g. errs ok; qa clean settle, mid, 6.6; frames shots/bal + phone.
- 10:4x b05 batch: F30 owners (material, cubed, hotspot, margin, work), R2-b05-3 (material + specific: bent on pull-test
  strengths, bending figures 9.1/23.0 N, 'ultimate'), R2-b05-4 (ULX = carbon-composite shell, b05Fm), R2-b05-5 (next step #93),
  R2-b05-6 (chained words), F22 (card indexes the whole chapter), R-b05-4 (nopick x axis). Layouts re-fit (nopick no owners;
  margin y 928; hotspot y 908 size 84; cubed owners short, scale note shorter). errs ok; qa clean settle+mid on all b05.
- 10:4x b07 batch: R2-b07-5 MUST emg colours; -1 board owners + rod model b07_rodTie (0.20 mm, +0.22 g); -2 voice; arms owners;
  -7 newton window wording; -8 size partly (bars full from frame one, 'Full length at about 29 g', note moved); -9 sheet same
  shape + stiffness note + headline sizes; -10 poron '(modelled)'; -11 sides owners. Layouts re-fit. errs ok; qa clean.
  Replies posted in review/b05.md and b07.md (tools/reply.py). POLISH.md b05 P1/P2 and b07 three items ticked (tools/polish.py).
- STILL OPEN: b06 all (R2-b06-1..8, F26 order, F28 fillet trio, KIT %, LATTICE STUDY pending), b07 R2-b07-6 emg payoff,
  F27 shape order, b07_size hand drawing, b07_arms answers note (feet both ways), final sweep (frames 0/mid/settle + phone).
- 10:4x INTEGRATOR (F47.3/F47.4): sheet not in the film (only pages/joint.html); re-shot on the 0.6 mm board (push 11.4,
  pull 2.0 N; push-only 55.7 vs arms 53.2 vs both ways 44.4 µm). b07: B07_PLAN.bt = 0.6 (plate + arms), B07_BRD by/bt follow
  (top at 5.03); FR4 18 GPa (K). b07_board: kW 586 vs 8.5 N/mm, sides 0.2078 mm (0.21, -67 % unchanged); b07_arms 53.2 -> 44.4
  µm shown 53 -> 45 (against Theseus); arms source says feet tied both ways (joint open). Answers rows F47.3/F47.4 added.
  G-Wolves' edge-on tab kept at its own est. 1.0 mm (0.38 mm to snap). b07_balance: waiting for H3's board CoM.
  SendMessage to main FAILED (session message limit): put the F47 summary in the final report.
- 11:0x b06 batch: F26 order (b06_arches after: b06_thrust); R2-b06-1 arch unloads to 10 N at settle; -2 stiffness leads
  (56 px press stat); -3 thrust one precision (55.5 -> 0.9, 64x; 101 -> 27, 3.8x small); -5 fibres judged against their rib
  past the junction (grey/blue in line, red across, neutral turning); -6/F28 fillet ends on the Comet pair (neutral) + node's
  problem, mold plots the drift tolerance (b06_tolCurve), owners on mold; -7 arches 7.2 -> 121.7 one precision + callback;
  -8 'Theseus:'; KIT % spacing; rounding against Theseus throughout (b06_dn). errs ok, qa clean settle+mid all b06 touched.
  Replies posted in review/b06.md. NOT DONE: R2-b06-4 palm drawing (no kit palm).

## Resumed 11:15 (new P4 after the server restart)
- 11:16 integrity: node --check ok (all three); --own build of all three on the 11:03 snapshot: dist/main-p4.html; errs ok on all
  30 slides (b05 x10, b06 x9, b07 x11; batches of 3, the checker crashes past ~45 navigations). All staged replies / POLISH
  edits (tools/*.json) had landed. b05_card/b05_material handoff declared both sides; p4_joint in no src file (pages/ only).
- NEW since the restart: K 11:01 (one value per material: b05 B05_MAT, b06 B06_FT_AX/BEND + feBreakAt, b07 B07_PULL/B07_ARM,
  "FR4 19 GPa, 1.0 mm" in b07Fe); K 11:16 heatKey (MUST on b05's heat slides; should on b06's keys + colour by use);
  R2 10:46 b07_emg verdict proposal; R2 10:55 b06_lattice 1.2x / 38 % comparison to check with L1.
- 11:4x b07 (K 11:01, F47.4, rounding): B07_PLAN.bt = BOARD_T, B07_BRD.by = BOARD_TOP - bt/2; B07_PULL / B07_ARM / b07_sheet mg
  from SIM_MAT/matOf; b07Fe written from SIM_MAT + BOARD_T (was "19 GPa, 1.0 mm"); b07Mass3d written from B07_POS + KEY_PARTS
  (was board z 19.1 / 5 up). Against-Theseus rounding: b07_board 0.64 -> 0.63 (struck), readout floored too, net -66 %;
  pull panel Mg 2,350 -> 2,360 (10 N, rival up); peak rise 9 -> 9.3 %. b07_board + b07_arms answers live (b07_live).
  Arms robustness (tools/armsrob.js): GW arms on 1.0 mm board 51.02 vs whole on 0.6 mm 44.41 -> verdict holds; push-only
  55.73 (co.js re-run at 18 GPa). Source lines trimmed to 2 lines (b07_arms' covered the rim). errs ok, qa clean settle+mid
  (board, arms, sheet). Frames: shots/b07r/*_sheet.jpg. Replies posted (review/b07.md: K 11:01, R2-b07-6 WHY NOT target).
- 11:5x b05 (K 11:16 MUST, K 11:01 shoulds): heatKey (use mode, SHL_GAMMA, title 'Strength used, colour squared') on nopick
  (770,630 from 1.0), hotspot (LM+100,836 from 0.3), margin (480,884 from press 4.9), work (1330,716 from 0.6); b05_heatKey
  (never drawn) deleted. B05_MAT -> SIM_MAT (pp, abs, mg, fr4 EL/fbL), PC/Al private; b05Fr4Flex/AbsFlex/PcFlex removed
  (uncited); b05_fr use = feUse(r, FT, FB). b05_specific FR4 line says 'ranked along its weave'. Answers diffed: identical.
  errs ok all 10; qa clean settle+mid all 10. Replies posted (review/b05.md).
- 12:0x R3 (b05_material could): readout names one material (sagNow), 4.2 s agrees with 2.0 N. Rounding against Theseus:
  material 4.24 -> 4.23 (readout + verdict), tMatch 0.57 -> 0.58, ABS bend 9.1 -> 9.2; b05_specific ranking via b05_rv()
  (rivals toward their advantage). FILM F40: no IDs on screen (b07 board/arms/newton sources; b05_work choices -> live
  'Slide N' sorted in film order; 'The test strip'). Replies: review/b05.md (R3), FILM.md (F40). b05 reply on FR4 corrected
  (strength ranking is on pull-test ft 430, along the weave; across only changes stiffness 3.32 -> 3.69 mm, still 4th).
- 12:0x b06 (K 11:01, K 11:16, rounding): B06_FT from SIM_MAT; b06_use = feUse, b06_breakAt = feBreakAt (answers diffed:
  identical). Keys -> heatKey: arch (680,456, use), fillet node (peak), filletsize (peak, -55 px), lattice (mpa, 260 px).
  Rounding against Theseus: lattice 0.302->0.036 mm, 8.5x, 58.9->8.1 MPa, -86 %; light 3.4/0.39 N (rival up), 28/12 N,
  12.8 N, 8.5x/33x (b06_rv). Lattice tag moved off the left margin. R2 10:55 checked: old 3D tri/hex both had rails, 3.79 g
  ribs each; 1.21x / 38.4 % -> line stays until L1. errs ok, qa clean settle+mid all 9. Replies posted (review/b06.md).
- 12:1x R3 11:54/11:55 re-checks: R3-b07-1 (poron note into verdict label) FIXED (note under the Poron panel, RM-601, 846,
  lead 'PORON 4701-30'); newton ID already gone; R3's b06 line on the old study answered in my 12:0x reply (tri vs hex both
  had rails). Reply posted (review/b07.md).
- 12:1x b07 rounding audit (all verdicts): tolerance 4.81 -> 0.55 % (+ panel tallies 2 dec, '1 in 184'), sheet 0.279 ->
  0.175 mm and 35.6 -> 29.8 um, sides 0.110 -> 0.082 mm. b07_sides heatKey (peak, linear) at (1530,420) from 2.8 s.
  errs ok, qa clean settle+mid. Reply appended under R3-b07-1 (review/b07.md).
- 12:2x b05 verdict audit: wall Mg 0.55 -> 0.56 (caption, readout, note, verdict, answers), hotspot 0.460 -> 0.392 g (3 dec,
  readout + verdict + live answers). Others already against Theseus. errs ok, qa clean. Note posted (review/b05.md).
- 12:3x FILM F42 (coordinator 12:2x, Brock ~12:10 "Skin: 0.60 mm, to be proven") + L1's LATTICE STUDY / kagome message:
  b05_wall on flow length (B05_FLOW L 105, PP 150-280; pp 107 walls; Mg held to Design News 0.7/0.5, no melt, no short
  shot; skin caption at 8.4 = L1's wording; b05Fill rewritten; protoWall named as rule of thumb). Mg flow ratio searched
  (PlasticsToday 1999, Phillips Medisize MAG, CWM die casting): none. b05_cubed 'typical floor' -> 'typical wall'.
  b06: no floor (filletsize band/red/captions; mold B06_FLOOR gone, curve kept inside the study, rib rule line, src
  b12Proto/b12Beall); Theseus sizes from L1 (fibres, filletsize box, mold label/owner/line, arches crown + source,
  lattice caption + foot line with kagome). Snapshot changed 12:25/12:32 (06-motion, 03-parts): errs ok all 30, qa clean
  settle+mid all 30 after it. Notes: review/b05.md, b06.md (12:3x tops), FILM.md F42; POLISH LATTICE item ticked.
  OPEN: b05_cubed 1.00 mm wall vs 0.60 skin + ribs (re-derive); six-arm node drawings vs kagome crossings; b07_balance
  waits for H3's boardCom; R2-b06-4 palm and R2-b07-8 hand outline need a kit hand.
