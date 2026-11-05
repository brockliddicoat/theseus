# K2: the board, the sensor marking and the magnetic encoder (code `k2`)

Read /tmp/claude-0/-home-claude/17d0b892-9041-5973-afc8-9659df39052b/scratchpad/handoff/k-common.md first.

## Your items (his words are in FEEDBACK.md F26 and F27)
1. **The board** (3d/pcb: the layout tools and the board model; the PCB pipeline is in 3d/pcb/tools, build_pcb.py; it
   needs trimesh, which `pip install --break-system-packages trimesh` may add):
   - F26.4 turn the battery connector 90° so it pulls out toward the back (the battery sits in the tail behind the
     board, see F21.15 and the plate builder's position in FEEDBACK);
   - F26.5 more rounding on all the board's edges (extend the front slightly so the microswitches don't overhang where
     there's no board), shave off the small notches on the left and right sides, and make the back as wide as the front;
   - F26.6 proper fillets on the triangles of the board's back design;
   - F26.7 more pad around the two back holes, holes unmoved;
   - F26.8 the power switch to the middle of its notch;
   - F26.9 no QR code on the sensor; mark it "PAW3970" plus letters that look like a real PixArt SKU (derive the pattern
     from real PixArt markings, say how).
   - Then the 2D twins (`sh deck/tools/geo2d/build.sh` with the board's scenes) and every slide that draws the board in 2D
     by hand (Electronics and Ownership: check `ownboard`, `ownbatt`, `elc_*`).
2. **The magnetic encoder, everywhere** (decided: "Yes, switch everywhere"; his words in F27, `sealed` and `clk_switch`:
   "i want to use a magnetic encoder that doesn't get affected by dust and have a transparent top housing to see when it's
   broken like switches"). Research real magnetic / Hall-effect scroll encoders (with sources), model one in 3D in place
   of the TTC optical encoder (3d/parts/scrollwheel.js), with a transparent top housing, and rebuild the bundle. Then the
   `srf_encoder` slide (deck/src/10-e-surface.js, that slide only) becomes the magnetic encoder's slide, at a glance:
   what it fixes (dust, wear, power) against optical and mechanical encoders, sourced.
3. **`framesync`** already carries his F26.10 figures (Viper V4 Pro 202 µs → 42 µs, the XA25 with SensorLock on a PAW3950;
   XBAB's "163 µs lower" in the source line). Keep them; simplify the slide with the other software slides (item 4).
4. **The Electronics notes (F27):** `cells` (lithium-ion figures are off: use small cells; li-ion is usually a gram or two
   heavier than li-po of the same capacity in mice), `elc_oneside` (better visualized), `elecsheet1` (show this protects
   against water for very little weight), `cable` (the paracord assets are lazy), `elc_sheet2` (remove it; move the no-RGB
   point onto the slide about having no optical components, and put that slide next to the web software), and the
   software slides, which he found confusing (G10): `software`, `motion`, `framesync` (`latency` is another builder's, later).

## Your files
3d/pcb/**, 3d/parts/scrollwheel.js and the board parts in 3d/parts (boardparts.js), 3d/integration/build.mjs, deck/geo2d
via its tool, deck/src/10-f-elec.js, 10-f2-elec.js, 12-40-elec.js, 12-45-elec.js, 14-c-elec-ex.js, and in
10-e-surface.js only `srf_encoder`, in 10-h-own.js only `ownboard` and `ownbatt`. Another builder (K1) has 10-b-click.js,
gt01.js and shell.js at the same time: don't touch those.

## Shared with K1, who works at the same time
- **deck/src/03-parts.js:** you may change only `pcbSec`, `solderFillet`, `sensorMM`, `wheelSideMM`, `wheelFrontMM`,
  `boardMM`, `encoderMM`, `chipMM`, `cableMM`, `dongleMM`, `keyPath`, `keyHalfW`, `keyPlanMM` and `keyPlan`, and add new
  helpers at the end of the file, named `k2_…`. K1 changes other functions in it. Edit it with a small script that reads
  the file, replaces your function's exact text and writes the file back, re-reading before every edit (never write it
  back from an old copy); keep it parsing at every moment. Build with it in `--own`.
- **The 3D tree and the bundle** are shared: K1 changes the GT01 (3d/parts/gt01.js) and the plungers while you change the board and the encoder. Either of you may rebuild the bundle (`cd 3d && node
  integration/build.mjs`; it bundles every 3D file as it is on disk and replaces deck/vendor/r3d.js only when it builds),
  so keep your 3D files building at every moment: edit a copy, and move it into place once it builds. Rebuild your 2D
  twins with `R3D=k2 SCENES="pcb wheel battery …" sh tools/geo2d/build.sh` from deck/ (R3D keeps your deck apart from the
  other builder's).
- **The GT01 on the board:** K1 is turning the GT01's plunger 90° (Brock on `clicks`: "the part that actually sticks
  out above the housing looks like it needs to be turned 90 degrees"). When scratchpad/k1/GT01-PLUNGER.md appears, copy
  it onto the board's switches in components.py; if it hasn't appeared when you rebuild the board, rebuild without it
  and say so in your report.
- **The board must still fit the shell** in the assembled views (the shell isn't yours): report any clash, with numbers.
