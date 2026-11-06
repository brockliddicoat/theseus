# B07: Shell III and Shape: the board, the build, the hand

Read /home/claude/theseus/handoff/revamp2/common.md first, then this. Then FEEDBACK.md: every STANDING and DECIDED item
(`grep -n -E "STANDING|DECIDED" FEEDBACK.md`), F32 to F35, and every item this brief names. Never regress a decision.

Your file: deck/src/30-b07-board-shape.js. Your work folder: /home/claude/work/b07/ (PROGRESS.md, CHECKPOINT1.md, shots/).
Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b07 --own=30-b07-board-shape.js`.

## Where your slides sit in the film
- Before your first slide: `b06_mold` (b06): What a fillet buys the mold.
- After your last slide: `b11_card` (b11): Made to last, and to open.
- Within your file the slides play in the order below; hand each one to the next (common.md, M9 and "Clips and flow").

## Your slides, in film order, with the old slides each replaces and Brock's rating and note on each, verbatim

### `b07_board` (chapter `shell`): The board you already carry
FR4 is a woven composite like carbon fibre (his note), so the board itself can stiffen the shell instead of carbon rods, with no extra parts and no extra tolerances: use what you already carry. FR4 against magnesium at the same weight. Fold in the published deflection test only if you can set it up so a viewer knows what the spec means (his note on shlStructs), else leave it out and say so.

- replaces `shlPcbRib` (“FR4 vs magnesium alloy”) **6/10**: "unintuitive, explain how fr4 is like carbon fiber because it’s also a woven composite, using the pcb is an alternative to having carbon fiber rods in your mouse that doesn’t require extra parts with extra tolerancing, you’re just using what you already have"
  - FEEDBACK items that name it: F2.26 (read them)
- replaces `shcCarry` (“Use the weight you already carry”) **5/10**: "meg slide"
  - FEEDBACK items that name it: F2.26 (read them)
- replaces `shlStructs` (“A published deflection test”) **3/10**: "viewer will have no idea what that spec means in big blue poor setup"

### `b07_arms` (chapter `shell`): Small arms snap, the whole board holds
Draw what G-Wolves' FR4 arms and board really look like (his photos, described in F28.3; his own HTS Ultra's arms broke in shipping): a drop or squeeze snaps an arm; Theseus uses the whole board.

- replaces `shcArms` (“Small FR4 arms vs the whole board”) **6/10**: "these aren’t what the arms or pcb would look like, important idea tho"
  - FEEDBACK items that name it: F2.26, F28.3, F33.5 (read them)

### `b07_tolerance` (chapter `shell`): Tolerance stack-up
With the law behind it for validity (worst-case and root-sum-square stack-up, sourced), stacked coins as the classroom demonstration, the drops drawn as simplified mouse parts, no Theseus teardown. One badly toleranced part ruins the whole mouse: more important than it looks (his note).

- replaces `tolerance` (“Tolerance stack-up”) **7/10**: "needs to be explained with some sort of law for more validity, don’t show the theseus teardown, improve the diagram, the little drops should be simplified mouse parts, explain how one incorrectly tolerances mouse part ruins a whole mouse so this is more important than it looks, you’re on the right track here you just need to improve your execution."
  - FEEDBACK items that name it: F33.5, F33.8 (read them)

### `b07_poron` (chapter `shell`): Poron pads, not grease
Factory Poron pads where the board meets the shell: players already mod their G-Wolves mice with these to stop creaking (his note). Show the creak (board rubbing its post under a squeeze), then the pad.

- replaces `grind` (“Poron pads, not grease”) **7/10**: "factory poron pads, many people already mod there g wolves mice with these for where it hits the pcb to reduce creaking"

### `b07_sheet` (chapter `shell`): The rest of the shell
The shell ideas that belong nowhere else, each one dense and specific: PPS triggers, a closed wheel well, graded walls, joined struts. The film sticker only if he wants it (he was unsure: say so). No pro model, no bottom plate (later).

- replaces `shlsheet2` (“Optional base, graded walls, joined struts”) **5/10** (rated, no note)
  - FEEDBACK items that name it: F12.10 (read them)

### `b07_shcard` (chapter `shape`): A shape measured on hands
The shape chapter card as the compromise: shapes chosen by taste, not measured.

- replaces `shapecard` (“Shape”), not rated

### `b07_newton` (chapter `shape`): Newtonian shape analysis
The concept name in the title (F2.44). Keep the analysis (three illustrative profiles until the shape is final, F21.12), problem-first.

- replaces `shp_newton` (“Newtonian shape analysis”), not rated
  - FEEDBACK items that name it: F2.44 (read them)

### `b07_sides` (chapter `shape`): Flat low sides, held the same on both
In the Shape chapter now (his note). Equal pressure on both sides, just for show; no asymmetry (it looked bad). The flat low sides take the peak, so the lattice runs thicker there, the same on both sides (F13.4, F19.2), with the thumb rest on the left.

- replaces `shbSides` (“Flat low sides need a thicker lattice”) **4/10**: "show equal pressure on both sides, just for show. the asymmetry looks bad, this should be in the shape category"
  - FEEDBACK items that name it: F2.20, F13.4 (read them)

### `b07_size` (chapter `shape`): Sized against real hands
Quote his flatter-mouse line word for word (F21.13): "for a flatter mouse, its better to be too small than too big, because big hands will still be able to fingertip grip". 119.3 mm against the flagships and the average hand.

- replaces `size` (“Sized against real hands”), not rated

### `b07_emg` (chapter `shape`): EMG on every shape revision
Muscle activity measured on players for every revision: what the electrodes read, and the revision that wins.

- replaces `emg` (“EMG on every shape revision”), not rated

### `b07_balance` (chapter `shape`): Balance at the centre
Research why some people push for a higher battery placement and show both sides honestly (his note on mass). His decision: the balance stays at the centre of the mouse (F30.10), and the battery is the heavy part that sets it (F21.15). Show the centre of mass moving as parts move.

- replaces `mass` (“Keep the mass low, near the fingers”) **5/10**: "in review, research why some people are pushing for higher battery placement"
  - FEEDBACK items that name it: F2.40, F21.15 (read them)

## Also
Brock's G-Wolves photos are in refs/photos/brock-2026-11-06/ (gwolves-board-in-lattice-shell.png, gwolves-lattice-part-with-arm.jpg). Draw the board with the shared board helpers (H1 is rebuilding it to plan 5).

