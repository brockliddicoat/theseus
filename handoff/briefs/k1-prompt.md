# K1: the click mechanics, accurate (code `k1`)

Read /tmp/claude-0/-home-claude/17d0b892-9041-5973-afc8-9659df39052b/scratchpad/handoff/k-common.md first.

## Your items
1. **F26.1, the click tensioning mechanism** ("isn't anywhere near as accurate as it should be, i almost feel like it's
   potentially wrong as well, it needs a lot more effort"; asked what to build from: "Research real mice").
   - Research how real mice tension their triggers, with sources and photos where you can reach them: the Finalmouse ULX
     (one flat, single-screw central tensioner), ARYE FCC-1 against RCC-1 (the split upgrade), the Lamzu Atlantis (its
     tensioner offset 10 mm from the peak, his #59), the Viper V2 Pro against V3 Pro (angled vs straight rear cutouts,
     #17), plus teardowns of others.
   - His design: split, one per trigger (#4), aligned with the switches (#18), one screw each (#49), a bridge, an arch
     with thinner material at the centre, so it bends where we choose (#50), a taller fulcrum (#59), straight rear
     cutouts (#17). Read those ideas in /home/claude/theseus/research/brock-doc-in-pursuit.txt.
   - Then redraw the mechanism accurately wherever it appears: `tensioner`, `arc`, `clk_tenmat` and any other drawing of
     it. His notes on them (F27): tensioner "reference the starlight x's stufd clicks from using such a stiff composite
     material with no bridge, market top as 'as seen in starlight x' ... and bottom as proposed solution. also the
     rounding where the bridges meets the trigger looks bad, ie needs to connect without filets"; arc "tensioner doesn't
     look accurate, i dont like the use of the metrics 'pts' or 'points' anywhere ... direct drive means the peak
     theoretical reaction time should be 20% faster because 20% more of the force goes where you actually intend it";
     clk_tenmat "hard to understand, and stiffer is better doesn't seem right".
2. **F26.2, uniform plungers:** "the second of the dual plungers need to be shown as exactly the same size as the one for
   the switch and the one for the side button, this helps show our uniformity claim. right now the plunger without a
   switch sticks done further and looks different". Fix it in every drawing (`anchors`, `sidebuttons` and any other) and
   in 3D where the plungers exist. His notes: anchors "locking the motion to one plane/direction needs to be better
   explained ... too abstract ... dislike how the dual plungers and pads aren't uniform ... sell the benefit ... the bad
   version feels cheap and causes more wear over time"; sidebuttons "left visualization fells lazy, right visualization
   doesn't match the other dual rail plungers with ptfe and it's way overbuilt".
3. **`clicks`, the GT01's plunger:** "switch plunger on the gt01s is still turned vertical, bottom part looks fine but the
   part that actually sticks out above the housing looks like it needs to be turned 90 degrees". Fix the 3D (3d/parts/
   gt01.js) and the 2D drawing, against Gateron's photos (/mnt/user-data/attachments/17d0b892-9041-5973-afc8-9659df39052b/
   4de29879-image.jpg, 416482d1-image.jpg, 0e4e9ea4-image.jpg).
4. **`clk_switch`:** "bottom housing doesn't look very accurate at all, i'll attach a new reference when you ask, show the
   effect on battery life, razer says their optical encoder and switches account for almost half the battery life in the
   viper v4 pro (find quote), also i'd like to switch to using a halling effect/ magnetic encoder so we can say we should
   have double the battery life efficiency as razer". Find Razer's quote (with its source); make the battery claim only as
   far as the quote supports (derive it, say how). Theseus uses a magnetic (Hall-effect) encoder now (decided). Ask
   Brock for the bottom-housing reference in your report (and use the GT01 photos above meanwhile).

## Your files
deck/src/10-b-click.js; 3d/parts/gt01.js and the plunger/trigger parts in 3d/ (3d/shell/shell.js only for the side-switch
plungers); deck/geo2d via its tool for the scenes you change; the 3D bundle (3d/integration/build.mjs). List every asset.
Another builder (K2) has 3d/pcb, 3d/parts/scrollwheel.js and the Electronics files at the same time: don't touch those.

## Shared with K2, who works at the same time
- **deck/src/03-parts.js:** you may change only `swMM`, `drawSwitch`, `clickGeo`, `clickMM`, `drawClick`, `railMM`,
  `tensionerPlanMM`, `frontStopMM`, `flushMM` and `guideMM`, and add new helpers at the end of the file, named `k1_…`.
  K2 changes other functions in it. Edit it with a small script that reads the file, replaces your function's exact text
  and writes the file back, re-reading before every edit (never write it back from an old copy); keep it parsing at every
  moment. Build with it in `--own`.
- **The 3D tree and the bundle** are shared: K2 changes the board (3d/pcb) and the scroll encoder while you change the GT01 and the plungers. Either of you may rebuild the bundle (`cd 3d && node
  integration/build.mjs`; it bundles every 3D file as it is on disk and replaces deck/vendor/r3d.js only when it builds),
  so keep your 3D files building at every moment: edit a copy, and move it into place once it builds. Rebuild your 2D
  twins with `R3D=k1 SCENES="gt01 …" sh tools/geo2d/build.sh` from deck/ (R3D keeps your deck apart from the
  other builder's).
- **The GT01 on the board** (3d/pcb/tools/components.py) is K2's. As soon as you've settled the plunger's shape and
  orientation, write it down (sizes, orientation, the photo it's from) in scratchpad/k1/GT01-PLUNGER.md: K2 copies it
  onto the board's switches.
