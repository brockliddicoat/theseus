# B10: Electronics II: power, the board, the wires

Read /home/claude/theseus/handoff/revamp2/common.md first, then this. Then FEEDBACK.md: every STANDING and DECIDED item
(`grep -n -E "STANDING|DECIDED" FEEDBACK.md`), F32 to F35, and every item this brief names. Never regress a decision.

Your file: deck/src/30-b10-power.js. Your work folder: /home/claude/work/b10/ (PROGRESS.md, CHECKPOINT1.md, shots/).
Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b10 --own=30-b10-power.js`.

## Where your slides sit in the film
- Before your first slide: `b09_life` (b09): Battery life at every polling rate.
- After your last slide: `b07_shcard` (b07): A shape measured on hands.
- Within your file the slides play in the order below; hand each one to the next (common.md, M9 and "Clips and flow").

## Your slides, in film order, with the old slides each replaces and Brock's rating and note on each, verbatim

### `b10_pmic` (chapter `elec`): One chip runs the power
The PMIC (nPM1300) replacing a handful of power parts, fewer passives; on the new board it sits far from the MCU (F30.1, F30.3).

- replaces `elc_pmic` (“PMIC: one chip runs the power”), not rated

### `b10_charge` (chapter `elec`): Fast charging, safely
Charging at the battery's 1C, and the four guards (temperature, over-voltage, short, the ship mode).

- replaces `elc_charge` (“Fast charging at the battery's 1C”), not rated
- replaces `elc_safe` (“A safer battery: four guards”), not rated

### `b10_battery` (chapter `elec`): The battery, per gram
His note: the lithium-ion numbers were way off; look at smaller batteries; Li-ion is usually a gram or two heavier than Li-po of the same capacity for mice. Call it a battery, never a cell (F21.8). The LP402535JU is the example battery.

- replaces `cells` (“The pouch battery, per gram”) **4/10**: "lithium ion numbers are way off, look at smaller batteries, you’re probably looking at too big of ones, lithium ion batteries are a usually a gram or two heavier than their lithium polymer counterparts if the same capacity for mice"

### `b10_board` (chapter `elec`): One board, one side, one reflow
Good, but he wished it were even better visualized: a two-sided board's second pass hanging parts upside down through the oven, against one side, one pass. 5.6 g, one board (F2.29).

- replaces `elc_oneside` (“One board, one side, one reflow”) **7/10**: "good but i wish it was even better visualized"
  - FEEDBACK items that name it: F2.29 (read them)

### `b10_sealed` (chapter `elec`): A coat that keeps water out
Show how the conformal coat protects against water (sweat, a spill) for very little weight, something few makers do (his note).

- replaces `elecsheet1` (“Conformal coat, readable switch”) **7/10**: "show joe this protects against water for very little weight, something few might do"

### `b10_wires` (chapter `elec`): Braided, not ribbon
A ribbon cable tears and creases; braided wires take 200× the pull and flex without creasing (keep what he rated 8 and 7).

- replaces `elc_tear` (“Braided wires, not ribbon cables”) **8/10** (rated, no note)
  - FEEDBACK items that name it: F2.38 (read them)
- replaces `elc_flex` (“Flex life: fine strands, no crease”) **7/10** (rated, no note)
  - FEEDBACK items that name it: F2.38 (read them)

### `b10_twist` (chapter `elec`): Twisted pairs, a quiet radio
Twisting cancels the noise the wires would put into the antenna; the lay (twists per length) against noise and weight.

- replaces `elc_twist` (“Twisted pairs cancel radio noise”), not rated
  - FEEDBACK items that name it: F2.38 (read them)
- replaces `elc_lay` (“Braid lay: noise against weight”), not rated
  - FEEDBACK items that name it: F2.38 (read them)

### `b10_cable` (chapter `elec`): An angled plug, a paracord cable
"Extremely lazy visualizations, paracord needs better assets" (his note): the paracord drawn properly (woven sheath, strands), the angled plug on the shell, the drag it removes.

- replaces `cable` (“Angled plug, paracord cable”) **3/10**: "extremely lazy visualizations, paracord needs better assets"

### `b10_lights` (chapter `elec`): Nothing lights up but the sensor
The magnetic (Hall-effect) encoder, unaffected by dust, with a transparent top housing so a failure can be seen (his note on sealed), the mechanical switches, no RGB LED, each with its battery figure. It sits next to the web software slide (F30.20).

- replaces `srf_encoder` (“Nothing lights up but the sensor”) **2/10** (rated, no note)
  - FEEDBACK items that name it: F2.08, F9.21, F30.20 (read them)

### `b10_software` (chapter `elec`): Set it once, in the browser
Web software with nothing to install, and the lift-off distance set in 0.1 mm steps, sold properly (from gld_soft: "better sell the importance of liftoff distance being 0.1mm configurable").

- replaces `software` (“Web software, nothing to install”) **6/10** (rated, no note)
- replaces `gld_soft` (“Set in the mouse: lift-off, position, X and Y”) **7/10**: "place near web software, better sell the importance of liftoff distance being 0.1mm configurable"

## Also
K2 improved cells, elecsheet1, cable and srf_encoder (they are in the old files): reuse them. The board is being rebuilt to plan 5 (H1): draw it with the shared helpers so your slides follow it.

