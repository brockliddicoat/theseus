# B04: Glide: aim that goes where you put it

Read /home/claude/theseus/handoff/revamp2/common.md first, then this. Then FEEDBACK.md: every STANDING and DECIDED item
(`grep -n -E "STANDING|DECIDED" FEEDBACK.md`), F32 to F35, and every item this brief names. Never regress a decision.

Your file: deck/src/30-b04-glide.js. Your work folder: /home/claude/work/b04/ (PROGRESS.md, CHECKPOINT1.md, shots/).
Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b04 --own=30-b04-glide.js`.

## Where your slides sit in the film
- Before your first slide: `b03_side` (b03): Dual rail side buttons.
- After your last slide: `b05_card` (b05): Light, without the flex, creak or crack.
- Within your file the slides play in the order below; hand each one to the next (common.md, M9 and "Clips and flow").

## Your slides, in film order, with the old slides each replaces and Brock's rating and note on each, verbatim

### `b04_card` (chapter `glide`): Aim that goes where you put it
The glide chapter card as the compromise: the sensor and skates most mice ship and what they cost your aim.

- replaces `glide` (“Glide and tracking”) **7/10** (rated, no note)

### `b04_camera` (chapter `glide`): Your sensor is a camera
One slide for camera, correlation and defocus (his notes: combine them). The sensor as a tiny camera taking thousands of pictures of the pad; two frames compared, the shift found; lift it and the picture blurs like a phone camera too close. Drawn like the rest of the deck: no photo-real pad (it was uncanny); a crisp procedural cloth.

- replaces `gld_camera` (“Optical sensor: just a camera”) **4/10**: "execution still feels lazy here for the visualization, the pad looks so realistic it’s uncanny, it’s weird irs not drawn like everything else, and this slide could probably be combined with something else, like the next slide"
  - FEEDBACK items that name it: F2.03, F9.14 (read them)
- replaces `gld_corr` (“Frame correlation: how a sensor sees motion”) **5/10**: "cool slide but it should probability be combined with the last slide"
- replaces `gld_blur` (“Defocus: like a phone camera”) **2/10**: "probably could be combined with the last 2 slides"
  - FEEDBACK items that name it: F2.03 (read them)

### `b04_focus` (chapter `glide`): A focus window of 0.2 mm, not 0.4
Most makers optimise for 0.4 mm; the sensor's best window is 0.2 mm (F2.02). What goes wrong: tracking drifts when the lens sits off focus (a heavy press, a soft pad). Tie it to the lift-off the player sets (on the software slide).

- replaces `focus` (“Focus window: 0.2 mm, not 0.4”), not rated
  - FEEDBACK items that name it: F2.02 (read them)

### `b04_sag` (chapter `glide`): Dots at the lens: no sag
More detail than the lazy old drawing. Rival: big skates far from the lens (Viper V4 style): the base sags at the lens under a palm press, the lens drops out of focus. Theseus: one or two dots beside the lens, carried by the clip-on lens (F20.2), holding focus. Compare with bigger skates and their weight: targeted dots win for less weight (his note on dots).

- replaces `gld_sag` (“Sensor dots: no sag at the lens”) **5/10**: "visualization feels lazy and needs more detail, this could also be group with a comparison to bigger skates and weight efficiency"
  - FEEDBACK items that name it: F9.20 (read them)
- replaces `dots` (“Dot skates: more area, less sink”) **6/10**: "show how this is targeted and more weight efficient compared to how big of skates it takes to reduce the sink that aren’t placed in the most optimal possible spots (viper v4 style)"
  - FEEDBACK items that name it: F9.20 (read them)

### `b04_skates` (chapter `glide`): Skates where they count
Plate off only (the bottom cover is for later). The corner dot ledges as long as the sensor skate ledge (room for up to 3 skates), no gap between ledge and shell, a fillet where the skate ledge meets the shell, uniform and finished (his note on gld_under). Fold in the useful points of "three details under the mouse".

- replaces `gld_under` (“Skate sets: ten dots, or half-moons and a ring”) **4/10**: "corner dots ledges should be the sable length as the sensor distance between the sensor skate ledge (possible to fit up to 3 skates), and they shouldn’t have a gap between themselves and the shell, we need filet where the skate pills hit the shell, the current execution looks vegetation lazy and not uniform, the right visualization is not what i wanted at all"
  - FEEDBACK items that name it: F14.1, F18.7 (read them)
- replaces `gld_sheet` (“Three details under the mouse”) **4/10**: "visualizations feel lazy"

### `b04_module` (chapter `glide`): Snap-on lens: one dot wide
He liked it (8/10): keep, re-framed problem-first. The sensor module and the clip-on lens accurate (F9.14).

- replaces `gld_module` (“Snap-on lens: one dot wide”) **8/10**: "i like this slide, it feels like a good slide, just your normal above average slide right here"
  - FEEDBACK items that name it: F9.14 (read them)

### `b04_sensor` (chapter `glide`): The PAW3970
Say plainly it is the suspected sensor inside the Viper V4 Pro and that it is the plan after Razer's exclusivity expires (his note, F21.6). The Viper V4 Pro's published specs (50,000 DPI, 930 IPS, 90 G, 8,000 Hz, Frame Sync): 650 → 930 IPS against the PAW3395 most rivals use.

- replaces `sensor` (“Next-gen sensor: PixArt PAW3970”) **6/10**: "says it’s the “suspected” sensor inside the viper v4 pro and that this is the plan, AFTER exclusivity expires"

### `b04_reports` (chapter `glide`): Full 16-bit reports, no smoothing
"I don't understand what is being demonstrated this slide, it's a graphic but it's not a demonstration" (his note). Make it a demonstration: a fast flick traced by a rival that smooths or clips its reports (the cursor lags and rounds the corner) against Theseus's full reports (the cursor follows the hand exactly). Simple (G10).

- replaces `gld_reports` (“Full 16-bit reports, no smoothing”) **3/10**: "i don’t understand what is being demonstrated this slide, it’s a graphic but it’s not a demonstration. i would have to understand it to know if the information is good or not"

## Also
The sensor moves forward on the new board (H1 is placing it): draw lens positions from the shared helpers, not from the old board. References in refs/photos/brock-2026-11-06/: viper-v3pro-vs-v4pro-undersides.png (the V4 Pro's big half-moon skates, his F20.4 shape), razer-fp3-sensor-viper-v4-pro.jpg (the V4 Pro's sensor, marked RAZER FP-3), arye-fcc1-fe-sensor-position.jpg, sora-v2-pcb-and-wheel.jpg.

