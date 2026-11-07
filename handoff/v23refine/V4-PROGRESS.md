# V4: the 300 mAh battery, carried through the film (Brock 17:08-17:10). Progress log

Started 2026-11-06 ~17:50. Branch claude/v23-refine-2026-11-06 (no commits; main commits). Build: `python3 tools/build.py main --out=v4`.

## Decisions
- Pack: EEMB LP402535 (eemb.com/product-214 + its specification PDF, ZJQM-RD-SPC-H2310, 2022-10-25): 3.7 V, 300 mAh min /
  320 typ, approx. 6.4 g, <= 4.3 x 25.5 x 36 mm (page: 37.0 long), max charge 320 mA (1.0C), charging 0 to 45 C, >= 500
  cycles at 0.5C. Energy at the minimum (the deck uses the lower figure, as for Jauch's 370 not 380): 1.110 Wh, derived.
- Hours, the deck's method (ntr_hours: energy over the V4 Pro's power draw, 1.184 Wh / 180 h = 6.58 mW), now less the
  V4 Pro's two optical switches (B03.optShare 13.67 %) plus Theseus's mechanical ones (B03.mechShare 0.35 %), as b03:
  1.110 / (6.578 mW x 0.8668) = 194.7 h at 1 khz; 8 khz (TechPowerUp's 40 h, the film's basis): 43.3 h.
  Main's 204 h scaled by mAh (300/306); the deck scales by energy (V4 Pro 3.87 V, EEMB 3.7 V). Doesn't clear 200 h.
  At EEMB's typical 320 mAh (1.184 Wh, the V4 Pro's own energy): 207.6 h. -> THESEUS.hours 200 -> 194 (floored), flagged.
  25-film.js checks at startup that THESEUS.hours = floor(derivation), THS agrees, and the shell allowance is unchanged.
- KEY_PARTS.battery footprint left at 35 x 25 x 4.0 (feeds b07_balance's live model via b07_battZ/Y; 3D twins): follow-up.
  The mass change alone moves the balance 1.56 mm ahead of the middle (front 14.4 g / rear 13.3 g): b07_balance now says so
  in red ("its place is to be re-run"); H4's balance re-run is the follow-up.
- Story: move 6 "More hours from the same battery"; edges 2->6 and 3->6 'Weight' -> 'Density' (the 1.6 g finishes the
  density moves 2-3 began: 97 % -> 102.5 % of the XA25's line), new 4->6 'No opticals'; density bar earn [2,3,7,8] -> [2,3,6].
- b01_battery: Theseus lands first at the same draw as every ring (168 h, like for like: the verdict 141 -> 168 h), then
  climbs to 194 h "no optical switches, +15 %".

## State
- [x] batteries.json EEMB row (eemb_lipo); ntr_pack reads both families; THESEUS.pack; ntr_thsPack / ntr_oldPack / ntr_swKeep
- [x] 05-data THESEUS / THS (27.71 g, 194 h)
- [x] battery functions (ntr_hours, ntr_budget, b01_thsBatt, elc_cell, SHC.bud; B10 via elc_cell)
- [x] slides: literals (b01, 14-b, 14-d, b07, elec, cells, frontier, power, elc_charge, elc_safe)
- [x] FILM: move 4 unlocks, move 6, edges, links, ledger, LO earn, shellup unlocks, card stat
- [x] checks: film.js all 116 slides (8 batches of <= 15) on the final build (with main's 294c539): 0 errors. qa settle on
  17 changed slides: clean but cells' source line EDGE (pre-existing: same in v3ab); qa mid on 7: clean.
- [x] close-ups (out/v4_ba_*.png, 1600 px): cover, density ranking, giants' loadouts, Theseus's bars at move 9 (+ move 6),
  budget/ledger (shellup + b07_balance), move 6's card, b01_battery, power. Before = live v3ab (pre-294c539 cover tile).
- [x] PLAN.md move 6. Build copy: work/v4/main-v4.html.

## DONE (handed back to main ~18:45)
