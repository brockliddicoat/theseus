# V3: moves 2 and 3 of the v23 refinement ("A light, stiff shell", "Use the weight you already carry"). Progress log

Started 2026-11-06 ~17:05. Branch claude/v23-refine-2026-11-06 (no commits; main commits). Build: `python3 tools/build.py main --out=v3`.

## Step 1: compare (v23 in the film vs the revamp's replacements, ?film=0)
- [ ] sheets of both at settle (work/v3/cmp/)

## 17:10 Brock's 17:04 fix (first): rivals use Theseus's own silhouette; half a Theseus for fingertip mice  DONE
- 25-film.js: film_rival(view, dims) (mouseSimple scaled to the rival's L × W, grey), film_halfTop/film_half (the outline
  cut at the mouse's length, corners r 4 mm, width scaled), film_halfPts (top/side/end points for the box views).
- loadouts (lo_sil): every flagship = film_rival at its L × W (HTS Ultra 8K, HTS Plus Pro 8K, XA25 full size, tags as
  before); X2F = film_half (87.5 mm); XA25's cable from the scaled nose.
- b01_battery: the frontier's rival = film_rival (V4 Pro to HTX Mini 8K), its battery scaled with it.
- ntr_sizewt (14-d-intro.js ntr_boxSils): the X2F's side and end = half a Theseus (were the kit's generic rival); its lid keeps
  the trace from Pulsar's photo (his F27 ask; the half-Theseus lid reads the same: ?x2fhalf=1). Source line updated.
- Checked: loadouts, ntr_sizewt, b01_battery, ntr_density, rule, mv1: ok. Close-up: out/v3_giants_loadout_silhouettes_2026-11-06.png

## 17:40 the choice (sheets: cmp/v23_*.png, cmp/rv_*.png; pair strips: strips/pair_*.png)
Rule: v23's peaks kept with his fixes unless the revamp's replacement IS that slide with those fixes; <= 6 "hard to
understand" -> the revamp's replacement; what doesn't feed light+stiff (move 2) or the board tie (move 3) is cut.
MOVE 2 (14 + card): mv2, b05_fallacy (problem; swap shlPick 7), [upgrade 1 material] b05_material (swap materials 6),
b05_wall (swap thinwall 3), [2 lattice] shlHotspot (8, keep + weights fix), shlWork (8, keep + "choices it drives"),
b06_lattice (swap lattice 7 + shlDeterminate 5: his two fixes + straws), b06_light (swap shlThin 7: "max load to bend"),
b12_latopt (both candidates, F61.1), [3 arches] b06_arches (swap shbArches 7: rim plain, clean lines, flat lattice turns
into arches), b06_arch (swap shbPress 3 + shbBend 3: Pont du Gard), [4 fillets] filletsize (10, keep + 0.22 mm text),
[5 mould] b06_mold (swap shbWidth/shbMill/shbMillDirect/shbTol), b12_ribs (ruler, 1.80 steel-safe), shellup (NEW: the
five upgrades stacked, the ledger).
Cut: shlSpecific 4, shlScatter 7 (unit scatter: not light+stiff), shlNoPick 3, shlMargin 2, shlShell3d 2, shbThrust 3,
shbFibres 3, shbFlow -, fillet 4 ("can be combined"), b05_specific, b05_cubed, b05_nopick, b06_thrust, b06_fibres, b06_fillet.
MOVE 3 (5 + card): mv3, b07_board (swap shlPcbRib 6 + shcCarry 5 + shlStructs 3), b07_arms (swap shcArms 6), b07_tolerance
(swap tolerance 7: the law, no teardown, one bad part), b07_poron (swap grind 7: pads at the board, G-Wolves owners),
b07_balance (swap mass 5: why some want the battery high). Cut: shlsheet1 4 (cutouts -> move 4), shlsheet2 5.
Compounding devices: label "Move 2, upgrade n of 5: ..." + a 5-segment meter (filmChrome); FILM.link lines; shellup.
Literals: b07_balance's 8 g / 5.6 g / 29.31 g -> from ntr_budget()/THESEUS (B07_BUD getters).

## DONE (handed back to main)
- Files: 25-film.js (order, moves 2-3 text, links, FILM.steps + filmStep/filmStepMeter, FILM.chOf, ledger line 3, mv3 stat,
  film_rival/film_half/film_halfPts, lo_sil, shellup), 10-d-shell.js (shlHotspot weights + milled panel + "The point";
  shlWork "The choices it drives", grams of its 0.28 g; filletsize 0.22/0.24 mm from B12 via shlThsFil, no 0.89 floor),
  30-b12-latopt.js (b12_latopt both candidates: split mouse, both rings, caption, tag; b12_ribs "Try it with a ruler"),
  30-b06-lattice.js (b06_archShape L: fixes a throw at 3.6-4.0 s in b06_arch), 30-b07-board-shape.js (B07_BUD board/batt
  getters, b07_gTxt, caption/label/source), 14-d-intro.js (X2F box views half a Theseus), 30-b01-intro.js (b01_battery
  rival = film_rival; NOTE main's commit 6722755 already took this file: film_rival is defined in 25-film.js, uncommitted).
- Checks: film.js check all 111 slides (8 batches): 0 errors; every reel frame of moves 2-3 (+ into mv4): 0 errors;
  qa.js settle (12 slides) and mid (12): clean. Motion profile: tools/motion.py.
- Deliverables: clips/moves23_v3_2026-11-06.mp4 (243.8 s, 12 fps, 960 px; marks .json), out/v3_moves23_settled_2026-11-06.png,
  out/v3_peak1_five_upgrades, v3_peak2_lattice_to_arches, v3_peak3_milled_out, v3_q1_ladder_measure, v3_q2_rebuilt_sevens,
  v3_giants_loadout_silhouettes (all _2026-11-06.png). Build copy: main-v3.html.
