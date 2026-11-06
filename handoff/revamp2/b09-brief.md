# B09: Electronics I: wireless with no penalty

Read /home/claude/theseus/handoff/revamp2/common.md first, then this. Then FEEDBACK.md: every STANDING and DECIDED item
(`grep -n -E "STANDING|DECIDED" FEEDBACK.md`), F32 to F35, and every item this brief names. Never regress a decision.

Your file: deck/src/30-b09-signal.js. Your work folder: /home/claude/work/b09/ (PROGRESS.md, CHECKPOINT1.md, shots/).
Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b09 --own=30-b09-signal.js`.

## Where your slides sit in the film
- Before your first slide: `b08_wheel` (b08): A 0.9 g magnesium wheel.
- After your last slide: `b10_pmic` (b10): One chip runs the power.
- Within your file the slides play in the order below; hand each one to the next (common.md, M9 and "Clips and flow").

## Your slides, in film order, with the old slides each replaces and Brock's rating and note on each, verbatim

### `b09_card` (chapter `elec`): Wireless with no penalty
The electronics chapter card as the compromise: wireless that costs latency, battery or weight.

- replaces `eleccard` (“Electronics”) **7/10** (rated, no note)

### `b09_chip` (chapter `elec`): One chip, 8 khz
Single-chip 8 khz polling: the rival's two-chip path against one chip. "Dual 8khz wired and wireless".

- replaces `onechip` (“Single-chip 8 khz polling”), not rated

### `b09_radio` (chapter `elec`): The radio, clear of the wheel
The Raytac AN54LM-P20A with the long antenna (F21.4), black (F9.25), turned 180° so the antenna points away from the wheel's metal (F9.13). The rival: an antenna beside metal, its signal pulled down.

- replaces `elc_module` (“The Raytac radio module”), not rated
  - FEEDBACK items that name it: F9.25 (read them)
- replaces `antenna` (“Antenna turned away from the wheel”), not rated
  - FEEDBACK items that name it: F9.13 (read them)

### `b09_latency` (chapter `elec`): Motion latency, ranked
Simple (G10). The ranking at a glance, Theseus's target among measured mice, the method in one line.

- replaces `motion` (“Motion latency, ranked”), not rated

### `b09_penalty` (chapter `elec`): No wireless penalty
Simple (G10). What wireless costs most mice, and what it costs Theseus.

- replaces `elc_rate` (“The wireless penalty”), not rated

### `b09_sync` (chapter `elec`): Frame sync: 202 → 42 µs
Simple. The Viper V4 Pro at 202 µs frame to USB; the XA25 at 42 µs with SensorLock on an older PAW3950 with better software (his figures, F26.10); Theseus's target 42 µs. Show what jitter does to the cursor.

- replaces `framesync` (“Frame sync: no jitter”), not rated
  - FEEDBACK items that name it: F22.2 (read them)

### `b09_second` (chapter `elec`): Second Shot
A spare for each report: when a packet is lost, the next carries it. Show the lost packet and the recovery.

- replaces `secondshot` (“Second Shot: a spare for each report”), not rated

### `b09_life` (chapter `elec`): Battery life at every polling rate
Battery life against polling rate and the Pareto frontier: the zero-compromise case, at a glance.

- replaces `power` (“Battery life against polling rate”), not rated
- replaces `frontier` (“Past the Pareto frontier”), not rated

## Also
Software and latency slides must be simple (G10): "mosr of them are confusing". The board is being rebuilt (H1): draw it with the shared helpers. The long-antenna Raytac module he wants: refs/photos/brock-2026-11-06/raytac-mdbt50q-long-antenna.jpg.

