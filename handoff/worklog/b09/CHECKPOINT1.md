# b09 CHECKPOINT 1: `b09_chip` (One chip, 8 khz)

Frames (2D, 1920 × 1080): /home/claude/work/b09/shots/110_b09_chip_0.6.png, 110_b09_chip_2.4.png, 110_b09_chip_4.2.png,
110_b09_chip_6.png, 110_b09_chip_10.5.png (settle). Phone view: /home/claude/work/b09/shots/phone_chip.png (older layout).

What it does: the pointer plugs a cable into a Scyrox V8 (nRF52840, full-speed USB: 1000 Hz on its cable, TechPowerUp): its
reports fall from eight a millisecond to one, its cursor trail turns coarse, its latency re-counts 0.51 → 1.52 ms (piaknow).
The same plug on Theseus (one nRF54LM20A: radio and high-speed USB) keeps eight a millisecond (0.14 → 0.13 ms, targets);
verdict 1 → 8 khz on the cable, "Dual 8khz wired and wireless", and the two-chip route named (MCHOSE AX5 Pro Max).

Checks: errs ok; qa clean at settle and mid (2D). Built against deck/src/06-motion.js as it stood at 07:56 (KIT.md not yet
landed): mouseSimple('top', { hi: { board } }), verdict(..., { net: '8× the reports' }).
Build: `python3 tools/build.py main --out=b09 --own=30-b09-signal.js,06-motion.js`.

## 08:5x revision after the integrator's review (three points)
1. Frame one: the Scyrox V8 is on screen at t = 0 with its radio stream already flowing; Theseus's row sits dimmed (0.28)
   until its turn at 3.9 s, so the stage is full from the first frame and the same input is visibly coming.
2. Scale: mice at 2.25 px/mm (268 px long), lanes with a 1 ms ruler so eight blocks against one can be counted, cursor-trail
   panels 456 × 262 px with 4 px trails.
3. Headline: verdict at size 124 in the right column (x 1290) where the eye lands after the second plug; its net line is
   "Dual 8khz wired and wireless"; "Plug in mid-match and nothing changes." under it.
Frames: /home/claude/work/b09/shots/cp1/*b09_chip_{0,2.6,4.2,6.5,10.5}.png; phone: shots/cp1/phone_chip.png. errs ok, qa clean settle+mid.
