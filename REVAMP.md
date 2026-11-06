# REVAMP v2: the new film (2026-11-06)

Brock: "pick back up with the revamp that was planned for yesterday ... you should still have well over 100 slides, every
animation should be vastly improved and more intuitive ... set the bar for this new presentation 10x higher". The spine is
ZERO compromises; every slide shows the rival's fault, then Theseus's fix, then what the player gets; every slide works as a
standalone silent clip and the whole film flows. The common brief is handoff/revamp2/common.md; the per-builder briefs and
the outline (outline2.py) are beside it. Yesterday's 76-slide plan is in handoff/briefs/revamp-claude-2026-11-05/.

130 visible old slides become 104 new ones. Each new slide `replaces` the old slides it absorbs and `answers`
every clause of Brock's notes on them (FEEDBACK F27), shown in the rating panel.


## Film order

1. `b01_cover` (intro, b01) Theseus: zero compromises
2. `b01_compromise` (intro, b01) Every flagship compromises
3. `b01_battery` (intro, b01) Battery life, traded for weight
4. `b01_targets` (intro, b01) The targets
5. `b01_lighter` (intro, b01) Why lighter wins
6. `b01_listed` (intro, b01) Listed against weighed
7. `b01_density` (intro, b01) Density, not weight
8. `b01_illusion` (intro, b01) The size–weight illusion
9. `b01_rank` (intro, b01) Ranked by density
10. `b01_price` (intro, b01) Price against weight
11. `b01_budget` (intro, b01) Where 29.31 g goes
12. `b02_card` (click, b02) Clicks that land the same, every time
13. `b02_cutouts` (click, b02) Straight rear cutouts
14. `b02_seams` (click, b02) Seams that keep your fingers out
15. `b02_front` (click, b02) A flat front: no wobble
16. `b02_grooves` (click, b02) Grooves that lock your fingers in
17. `b02_flush` (click, b02) Flush walls, small gaps
18. `b02_direct` (click, b02) Direct Drive Actuation
19. `b02_wedge` (click, b02) One flat board, fewer parts
20. `b02_tensioner` (click, b02) The bridge tensioner
21. `b02_stiff` (click, b02) A stiff trigger, a light click
22. `b02_rails` (click, b02) Dual rail main clicks
23. `b02_pom` (click, b02) POM pads set the tolerance
24. `b03_switch` (click, b03) A mechanical switch, for the battery
25. `b03_binning` (click, b03) Provable switch binning
26. `b03_spdt` (click, b03) Single pole, double throw
27. `b03_timing` (click, b03) Counted at first contact
28. `b03_debounce` (click, b03) Debounce: low, and yours to set
29. `b03_hotswap` (click, b03) Swap a switch in a minute
30. `b03_side` (click, b03) Dual rail side buttons
31. `b04_card` (glide, b04) Aim that goes where you put it
32. `b04_camera` (glide, b04) Your sensor is a camera
33. `b04_focus` (glide, b04) A focus window of 0.2 mm, not 0.4
34. `b04_sag` (glide, b04) Dots at the lens: no sag
35. `b04_skates` (glide, b04) Skates where they count
36. `b04_module` (glide, b04) Snap-on lens: one dot wide
37. `b04_sensor` (glide, b04) The PAW3970
38. `b04_reports` (glide, b04) Full 16-bit reports, no smoothing
39. `b05_card` (shell, b05) Light, without the flex, creak or crack
40. `b05_material` (shell, b05) Carbon-filled polypropylene
41. `b05_specific` (shell, b05) Specific strength and specific stiffness
42. `b05_wall` (shell, b05) How thin a wall can go
43. `b05_cubed` (shell, b05) Wall tolerance, cubed
44. `b05_fallacy` (shell, b05) The strength–weight fallacy
45. `b05_nopick` (shell, b05) You don't have to pick
46. `b05_hotspot` (shell, b05) Stress hotspots
47. `b05_margin` (shell, b05) The peak decides the break
48. `b05_work` (shell, b05) Putting that weight to work
49. `b06_lattice` (shell, b06) Triangles, not hexagons
50. `b06_light` (shell, b06) Triangles win more on a light mouse
51. `b06_arches` (shell, b06) Interwoven arches form triangles
52. `b06_arch` (shell, b06) Why an arch holds
53. `b06_thrust` (shell, b06) The thrust line
54. `b06_fibres` (shell, b06) Fibres along the load
55. `b06_fillet` (shell, b06) Why corners get fillets
56. `b06_filletsize` (shell, b06) Fillet size, solved at equal mass
57. `b06_mold` (shell, b06) What a fillet buys the mold
58. `b07_board` (shell, b07) The board you already carry
59. `b07_arms` (shell, b07) Small arms snap, the whole board holds
60. `b07_tolerance` (shell, b07) Tolerance stack-up
61. `b07_poron` (shell, b07) Poron pads, not grease
62. `b07_sheet` (shell, b07) The rest of the shell
63. `b08_card` (surface, b08) Grip that holds, and stays
64. `b08_coating` (surface, b08) A baked ceramic coat
65. `b08_film` (surface, b08) A film too thin to weigh
66. `b08_uv` (surface, b08) No yellowing
67. `b08_grip` (surface, b08) Directional grip
68. `b08_gripmap` (surface, b08) A grip map for the hand
69. `b08_tape` (surface, b08) The best thickness is no thickness
70. `b08_twotone` (surface, b08) Two-tone in one coat
71. `b08_wheel` (surface, b08) A 0.9 g magnesium wheel
72. `b09_card` (elec, b09) Wireless with no penalty
73. `b09_chip` (elec, b09) One chip, 8 khz
74. `b09_radio` (elec, b09) The radio, clear of the wheel
75. `b09_latency` (elec, b09) Motion latency, ranked
76. `b09_penalty` (elec, b09) No wireless penalty
77. `b09_sync` (elec, b09) Frame sync: 202 → 42 µs
78. `b09_second` (elec, b09) Second Shot
79. `b09_life` (elec, b09) Battery life at every polling rate
80. `b10_pmic` (elec, b10) One chip runs the power
81. `b10_charge` (elec, b10) Fast charging, safely
82. `b10_battery` (elec, b10) The battery, per gram
83. `b10_board` (elec, b10) One board, one side, one reflow
84. `b10_sealed` (elec, b10) A coat that keeps water out
85. `b10_wires` (elec, b10) Braided, not ribbon
86. `b10_twist` (elec, b10) Twisted pairs, a quiet radio
87. `b10_cable` (elec, b10) An angled plug, a paracord cable
88. `b10_lights` (elec, b10) Nothing lights up but the sensor
89. `b10_software` (elec, b10) Set it once, in the browser
90. `b07_shcard` (shape, b07) A shape measured on hands
91. `b07_newton` (shape, b07) Newtonian shape analysis
92. `b07_sides` (shape, b07) Flat low sides, held the same on both
93. `b07_size` (shape, b07) Sized against real hands
94. `b07_emg` (shape, b07) EMG on every shape revision
95. `b07_balance` (shape, b07) Balance at the centre
96. `b11_card` (own, b11) Made to last, and to open
97. `b11_repair` (own, b11) Made to be opened
98. `b11_screws` (own, b11) Titanium screws
99. `b11_inserts` (own, b11) Brass inserts: the same fit every time
100. `b11_wear` (own, b11) Thread wear
101. `b11_battplug` (own, b11) A battery you can unplug
102. `b11_board` (own, b11) Screws from below, art on the board
103. `b11_box` (own, b11) In the box
104. `b01_close` (end, b01) Zero compromises

## B01: Intro and close: every flagship compromises (deck/src/30-b01-intro.js, 12 slides)

- `b01_cover` (intro) **Theseus: zero compromises**: Keep the cover's form, which he called very good and said not to stray from (F9.11): only the content changes, and no 2D mouse. PIAKNOW'S in capitals; "ZERO COMPROMISES" where 8 khz was (8 khz is standard now); density (0.099 g/cm³) where "100+ ideas" was. Motion: a premium entrance (the name rises out of its mask, the figures count), nothing busy. Replaces: `cover`.
- `b01_compromise` (intro) **Every flagship compromises**: The problem the whole film answers. A grid of named flagships (Superstrike X3 counts as one; the GPX 2 less so), each lighting the one thing it trades away, in red, sourced: battery for weight, durability for weight, an optical switch's battery, a shape, the price. Then Theseus's row: every cell blue, nothing traded. Derive every blank (G5), one precision per column. The thesis's message ("optimization over opinion") can close it. Replaces: `flagships`, `thesis`.
- `b01_battery` (intro) **Battery life, traded for weight**: One of his important ideas (F33.5): most mice give up battery life to hit a weight. Battery hours against weight for the wireless flagships, the frontier they sit on, and Theseus past it. Research hard for missing weights and hours, or derive them (his note). Animate the trade: as a mouse gets lighter its battery shrinks along the frontier; Theseus leaves the curve. Replaces: `market`.
- `b01_targets` (intro) **The targets**: What zero compromises means in numbers, on one dense, calm slide: "Dual 8khz wired and wireless", press to PC (shorter: the click work cuts mechanical latency), the weight headlined against the Starlight X. Set-down and idle sleep stay out this early (his note). Replaces: `targets`, `targets2`.
- `b01_lighter` (intro) **Why lighter wins**: One of his important ideas, argued properly (F9.26, F33.5): theoretical ease of control and how fast you change targets, from F = m·a, not "overall speed". Classroom demonstration first (two carts or pucks given the same push: the lighter one stops and reverses sooner), then a flick-and-stop on a target: same hand force, less mass, a shorter overshoot and a quicker reversal, shown with a crosshair landing on a target. A higher skill ceiling (F33.7) is the payoff. Before → after visible. Replaces: `zerograms`.
- `b01_listed` (intro) **Listed against weighed**: Rated 10/10: keep its data and honesty, raise the motion (each mouse's listed weight slides to its weighed weight; the gap fills red; Theseus weighed, printed, 0.00). It also carries the thesis's message, as he asked: the weight on the card is the scale's. Replaces: `weightgap`.
- `b01_density` (intro) **Density, not weight**: Problem first (his note): the X2F's wrong idea, getting light by getting small, so the solution doesn't feel useless. Then density as the measure that matters: the box L × W × H, the weight inside it, Pwnage's way. Outlines or silhouettes only, never detailed drawings (EloShapes outlines where they exist). Sell why low density matters to the player. Replaces: `ntr_density`.
- `b01_illusion` (intro) **The size–weight illusion**: Keep what worked (9/10): the X2F's outline in the box (find one), Theseus as an outline only. The illusion demonstrated: two objects of the same weight, the bigger feels lighter (Charpentier 1891, Buckingham 2014). Replaces: `ntr_sizewt`.
- `b01_rank` (intro) **Ranked by density**: Honest ranking among wireless mice (9/10): the X2F CrazyLight at its best-reported weight (reports say at least 29.5 g), one precision for every mouse (Theseus too), G-Wolves mice from EloShapes even where Theseus looks worse (his words: "its more honest"), the XA25 shown but not ranked (wired). Animate the re-ranking from weight order to density order. Replaces: `ntr_densrank`.
- `b01_price` (intro) **Price against weight**: The Pareto front never kinks: it continues its trajectory (his note), drawn as a smooth monotone curve. Add the Viper Mini Signature Edition, the Zaunkoenig mice and the Superstrike X3. Theseus at $189. Replaces: `pricefront`.
- `b01_budget` (intro) **Where 29.31 g goes**: The weight budget computed from the deck's own data so it updates itself (his note: "a lot of work to keep updating"): every part, Theseus's own screws (titanium), wires, the 0.9 g wheel, the board, the battery, what is left for the shell and skates. The ntr_stats facts that belong here go here; the rest go to their own slides (his note on ntr_stats). Replaces: `budget`, `ntr_stats`.
- `b01_close` (end) **Zero compromises**: The close: every compromise from b01_compromise, answered, in one frame; the film's last word. In 3D mode no shell on the close (F12.2). Replaces: `close`.

  You own the intro's data: research is much of your work (EloShapes, RTINGS, reviews, maker pages). Every number sourced or derived and marked, one precision per comparison. Research data lives in research/data/*.json (RDATA) and the helpers in 14-b-intro-ex.js; reuse them, add to them in your own file.

## B02: Clicks I: the mechanics that matter most (deck/src/30-b02-clicks.js, 12 slides)

- `b02_card` (click) **Clicks that land the same, every time**: The chapter card as the compromise most mice make: a click that changes with where and how you press. Use the kit's chapter card. The GT01 on it drawn right (the plunger above the housing turned 90°, his note on `clicks`). Replaces: `clicks`.
- `b02_cutouts` (click) **Straight rear cutouts**: Among his most important ideas, and the worst executed slide in the old deck. Establish first: the whole mouse from above, the rear trigger cutouts highlighted, then a continuous push-in to them, so the viewer always knows where they are. The rival: the Sora V2's curved "smile" cutout (and Razer's change from the V2 Pro's to the V3 Pro's straight one): an off-centre finger press twists the trigger, the bend line leans, the plunger sees a sideways push. Same press on Theseus's straight cutout, centred on its switch: the trigger travels straight down. Payoff: the click feels the same wherever the finger lands; before → after numbers (sideways, lean, offset). Sell the benefit to the player. Replaces: `cutouts`.
- `b02_seams` (click) **Seams that keep your fingers out**: From his shell-sheet note: the further a seam sits from the centre, the easier it catches your fingers. Show a finger sliding across rival seam layouts (seams far out on the grip) catching, then Theseus's Sora seam (one split, F11.3) staying clear of the finger's path. The pro model and the sticker are not part of this slide. Replaces: `shlsheet1`.
- `b02_front` (click) **A flat front: no wobble**: His clk_front note, left half: a front with heavy comfort grooves never bottoms out in the same spot, so where it lands first depends on where you press; it rocks side to side, feels cheap and wears faster. Show it: two presses at two finger positions on a grooved front, the trigger tilting differently each time, contact points marked. Then Theseus's flat front cutout: it lands flat, in the same place, every press. Not cross-sections. Replaces: `clk_front`.
- `b02_grooves` (click) **Grooves that lock your fingers in**: His clk_front note again: the comfort grooves get shallower toward the front, they lock the fingers in across another plane of motion and add contact area (the front has more surface area too). Show a fingertip sliding sideways on a flat trigger versus held in the groove (the old shape slide's 23 % → 15 % sideways push). Not cross-sections: show it on the button seen in perspective or from the front. Replaces: `grooves`.
- `b02_flush` (click) **Flush walls, small gaps**: His clk_front note, right half (he said it took him long to see it wasn't an alternative to the left half): how some mice make the gaps bigger than they should be, and how Theseus does it right, walls flush with the pressed triggers (#48). Use it to show why the cutouts face the ceiling or the wall (what the gap lets in, what a finger feels). Rival first, then Theseus. Replaces: (new).
- `b02_direct` (click) **Direct Drive Actuation**: K1's v22 rebuild is the starting point (10-b-click.js `arc`). The rival first: a flat switch under an arcing trigger, the plunger scraping its guide, part of the press going sideways. Theseus: the GT01 housing turns the switch 20° onto the arc, the whole press goes down the plunger. Keep "6 % sooner" with why it isn't 20 % (F31.2), 34 % sideways → 0 % as the headline; the tensioner drawn accurately; no "pts". Replaces: `arc`.
- `b02_wedge` (click) **One flat board, fewer parts**: Important concept, very poor execution (his words). Show the problem with more parts first: tilted sub-boards, wedges and brackets, each a tolerance that stacks and a part that can shift. Then the GT01's angled bottom housing on one flat board: the angle lives in the switch. Close to the "less parts is better" demonstration; link to the tolerance stack-up slide (b07). Replaces: `clk_wedge`.
- `b02_tensioner` (click) **The bridge tensioner**: K1's v22 tensioner is the starting point. Top row "As seen in Starlight X": the stiff composite plane with no bridge, a stiff click. Bottom row "Proposed solution": the bridge sets where it bends and how easily. No fillets where the bridge meets the trigger: square joints (his note). Drawn as it sits in a mouse, accurate to the real tensioners in his photos (one screw per block, aligned with the switch, stripped to what the load needs). Payoff in click force before → after. Replaces: `tensioner`.
- `b02_stiff` (click) **A stiff trigger, a light click**: "Hard to understand, and stiffer is better doesn't seem right" (his note). Make the logic plain: two separate jobs. The trigger body must be stiff (it doesn't flex under the finger, so the click is crisp and immediate); the bridge alone sets how much force the click takes. A rival trigger that is soft everywhere: the finger's press is spent bending the button before the switch trips (mushy). Theseus: stiff body, light bridge. A classroom demonstration helps (a diving board: a stiff board, the hinge sets the bend). Replaces: `clk_tenmat`.
- `b02_rails` (click) **Dual rail main clicks**: Locking the motion to one plane, explained plainly and drawn so you can tell what you're looking at (his note). Rival: one post, the button rocks and rubs, feels cheap and wears over time. Theseus: two identical posts on identical POM pads (uniformity is the claim, F26.2, G8), riding in a guide; the press goes straight down. Sell the benefit. Replaces: `anchors`.
- `b02_pom` (click) **POM pads set the tolerance**: Compare directly with another mouse's tolerances (his note): the play a rival leaves, against a POM pad whose thickness the factory tunes to take the play out, pad by pad. More corners rounded (his note). Show the pad being swapped for a thicker one and the gap closing. Replaces: `clk_pomtune`.

  K1 rebuilt several of these slides for v22 (deck/src/10-b-click.js): reuse its drawings, data and numbers by calling them or copying them into your file under your prefix. Brock's tensioner photos are in refs/photos/brock-2026-11-06/ (g305-top-shell-tensioners.jpg, lamzu-white-shell-top-and-tensioners.jpg, white-shell-tensioners-side-rail.png; INDEX.md says what each shows); the GT01 references are refs/photos/gateron-gt01-*.jpg. H1 is thickening the GT01's walls: draw the switch with clk_gt01MM so the fix reaches you.

## B03: Clicks II: the switch and the signal (deck/src/30-b03-switch.js, 7 slides)

- `b03_switch` (click) **A mechanical switch, for the battery**: The GT01 drawn accurately (H1 thickens its bottom-housing walls; use clk_gt01MM). The rival: optical switches that hold a light on all the time. Razer staff's "almost half the battery" for the Viper V4 Pro's optical switches and encoder, as a claim from Razer staff online via Brock (F31.1), beside the derived 18 % → +21 % battery for two switches. The magnetic encoder ties in (it moved to Electronics' "nothing lights up" slide: point there). Replaces: `clk_switch`.
- `b03_binning` (click) **Provable switch binning**: His note: a lot of companies lie about their binning; Theseus can commit to bins it can prove (possibly with Hall-effect testing: say it is a proposal). Show a spread of switches' operating force, a rival's claimed bin against the measured spread, and Theseus's tested, narrow bin. We don't yet know if it is the GT01 itself or only its bottom-housing style (his note): say "GT01-style". Replaces: `clk_switch2`.
- `b03_spdt` (click) **Single pole, double throw**: "Difficult to understand" (his note). SPDT spelled out in big letters (F9.4), and the animation that makes it obvious: one pole, two throws; the pole leaves NC and lands on NO; the mouse sees both, so a bounce on one contact can't fake a click. Like a railway switch: one track, two destinations (or any better classroom image you find). Replaces: `clk_spdt`.
- `b03_timing` (click) **Counted at first contact**: One simple slide for the click timing (G10): a rival waits out a debounce window after the first contact; Theseus registers the moment the pole leaves NC, never waiting for motion. 72 → 70 µs at a glance (F18.5), every number with its method in one quiet line. What the player gets: the shot leaves when the finger says. Replaces: `latency`, `clk_wait`, `clk_methods`.
- `b03_debounce` (click) **Debounce: low, and yours to set**: His note: low debounce is good and important to most players, but some (Minecraft players) want it longer to count more double clicks. So: low by default, adjustable. Show a double click registering with a long window and a short one. Replaces: `clk_debounce`.
- `b03_hotswap` (click) **Swap a switch in a minute**: Why it matters first (his note: "there also is no argument"): a double-clicking switch ends most mice. Then the claw clips (Mill-Max 3305) large and clear, a pin entering the socket, no solder, 1,000 swaps. The player keeps the mouse, swaps the switch. Replaces: `clk_hotswap`.
- `b03_side` (click) **Dual rail side buttons**: The same post and POM pads as the main buttons (uniformity), a guide that fits over a full-size SPDT switch (he wanted to see it before deciding the guide, F31.4), held by the shell (F12.4). "0 mice ship SPDT side buttons" (F11.4) and full-size switches at 29.31 g as proof of weight without compromise (F9.17). The rival made accurate, not lazy (his note): mini switches on a hinge. Not overbuilt. Replaces: `sidebuttons`.

  K1's v22 clk_switch and sidebuttons are in deck/src/10-b-click.js: reuse their drawings.

## B04: Glide: aim that goes where you put it (deck/src/30-b04-glide.js, 8 slides)

- `b04_card` (glide) **Aim that goes where you put it**: The glide chapter card as the compromise: the sensor and skates most mice ship and what they cost your aim. Replaces: `glide`.
- `b04_camera` (glide) **Your sensor is a camera**: One slide for camera, correlation and defocus (his notes: combine them). The sensor as a tiny camera taking thousands of pictures of the pad; two frames compared, the shift found; lift it and the picture blurs like a phone camera too close. Drawn like the rest of the deck: no photo-real pad (it was uncanny); a crisp procedural cloth. Replaces: `gld_camera`, `gld_corr`, `gld_blur`.
- `b04_focus` (glide) **A focus window of 0.2 mm, not 0.4**: Most makers optimise for 0.4 mm; the sensor's best window is 0.2 mm (F2.02). What goes wrong: tracking drifts when the lens sits off focus (a heavy press, a soft pad). Tie it to the lift-off the player sets (on the software slide). Replaces: `focus`.
- `b04_sag` (glide) **Dots at the lens: no sag**: More detail than the lazy old drawing. Rival: big skates far from the lens (Viper V4 style): the base sags at the lens under a palm press, the lens drops out of focus. Theseus: one or two dots beside the lens, carried by the clip-on lens (F20.2), holding focus. Compare with bigger skates and their weight: targeted dots win for less weight (his note on dots). Replaces: `gld_sag`, `dots`.
- `b04_skates` (glide) **Skates where they count**: Plate off only (the bottom cover is for later). The corner dot ledges as long as the sensor skate ledge (room for up to 3 skates), no gap between ledge and shell, a fillet where the skate ledge meets the shell, uniform and finished (his note on gld_under). Fold in the useful points of "three details under the mouse". Replaces: `gld_under`, `gld_sheet`.
- `b04_module` (glide) **Snap-on lens: one dot wide**: He liked it (8/10): keep, re-framed problem-first. The sensor module and the clip-on lens accurate (F9.14). Replaces: `gld_module`.
- `b04_sensor` (glide) **The PAW3970**: Say plainly it is the suspected sensor inside the Viper V4 Pro and that it is the plan after Razer's exclusivity expires (his note, F21.6). The Viper V4 Pro's published specs (50,000 DPI, 930 IPS, 90 G, 8,000 Hz, Frame Sync): 650 → 930 IPS against the PAW3395 most rivals use. Replaces: `sensor`.
- `b04_reports` (glide) **Full 16-bit reports, no smoothing**: "I don't understand what is being demonstrated this slide, it's a graphic but it's not a demonstration" (his note). Make it a demonstration: a fast flick traced by a rival that smooths or clips its reports (the cursor lags and rounds the corner) against Theseus's full reports (the cursor follows the hand exactly). Simple (G10). Replaces: `gld_reports`.

  The sensor moves forward on the new board (H1 is placing it): draw lens positions from the shared helpers, not from the old board. References in refs/photos/brock-2026-11-06/: viper-v3pro-vs-v4pro-undersides.png (the V4 Pro's big half-moon skates, his F20.4 shape), razer-fp3-sensor-viper-v4-pro.jpg (the V4 Pro's sensor, marked RAZER FP-3), arye-fcc1-fe-sensor-position.jpg, sora-v2-pcb-and-wheel.jpg.

## B05: Shell I: materials and strength (deck/src/30-b05-shell.js, 10 slides)

- `b05_card` (shell) **Light, without the flex, creak or crack**: The shell chapter card as the compromise: lighter shells flex, creak and crack. Replaces: `shellcard`.
- `b05_material` (shell) **Carbon-filled polypropylene**: ABS against PP-C-20A on a flat test beam, said plainly (his note: "explain that this is just on a flat plane"), with the force scaled to what a hand puts on a mouse and said on the slide, and the projected weights of both beams. Replaces: `materials`.
- `b05_specific` (shell) **Specific strength and specific stiffness**: One of his important ideas. Show why higher specific strength is better, not a convoluted graphic (his note): what each material buys per gram. A classroom demonstration (two bridges of the same weight; or the same beam in each material, scaled to one weight) loaded until it yields; the ranking reshuffles when you divide by density (PP-C-20A 4th → 1st for a thin shell). Materials: PP-C-20A, ABS, PC, magnesium alloy, aluminium, FR4 (F14.6). Replaces: `shlSpecific`.
- `b05_wall` (shell) **How thin a wall can go**: "Super important concept" and the old slide was confusing and lazy. Show molding: melt flowing into a thin wall cavity, freezing before it fills when the wall is too thin. Each material's floor (PP's 0.89 mm, thixomolded magnesium's 0.7 mm typical): at the same weight, the lighter resin gets the thicker wall, and stiffness goes with thickness cubed. At a glance. Replaces: `thinwall`.
- `b05_cubed` (shell) **Wall tolerance, cubed**: Stiffness goes with the cube of thickness: the classroom ruler, bent flat and then on edge. Then a wall a little too thin or too thick from mold scatter: the stiffness swings by the cube. No "points" (his note), more intuitive. Replaces: `shlScatter`.
- `b05_fallacy` (shell) **The strength–weight fallacy**: Title says fallacy (F14.5). The GPX 2 is heavier than the ULX and built worse (his note: never call the GPX 2's build quality good): heavier is not stronger. Axes that read at a glance: y is strength (higher is better), x is weight (lighter to the right reads as better only if labelled), the area under the curve must not mislead (his note). Replaces: `shlPick`.
- `b05_nopick` (shell) **You don't have to pick**: The header on the first frame, never the question alone (G9, his repeated note). The same comparisons as the fallacy slide, and Theseus's method as its own line that breaks the trade-off. "A really important concept but I genuinely have no idea what it's showing graphically": make the graphic obvious. No strength graphs carried across slides (his note on shlShell3d). Replaces: `shlNoPick`, `shlShell3d`.
- `b05_hotspot` (shell) **Stress hotspots**: A press on a solid flat panel builds one red hotspot that breaks while the rest idles; the same press on a milled-out, ribbed part of LESS weight spreads the load and holds. Show the weight of both parts (his note): a milled-out part stronger than a solid one. Replaces: `shlHotspot`.
- `b05_margin` (shell) **The peak decides the break**: "Really hard to understand, probably important." Teach it with a classroom demonstration: a sheet of paper that won't tear until you nick it, then tears at the nick. A part breaks where its peak stress reaches the material's strength (120 MPa, F12.12), however much material is idle. Show the margin left before break for the rival and for Theseus. Replaces: `shlMargin`.
- `b05_work` (shell) **Putting that weight to work**: His title (F14.7). Tie it to how the structure is designed: this example is the reasoning behind many design choices (his note), so give it more information: 18, 25 and 90 % of the weight working, and which choices move it. Replaces: `shlWork`.

  Cut the strength meter that ran across several slides ("they were a bad idea", his note on shlShell3d). The FE numbers come from 07-sim.js and the shell data in 10-d-shell.js: reuse them.

## B06: Shell II: triangles, arches, fibres, fillets (deck/src/30-b06-lattice.js, 9 slides)

- `b06_lattice` (shell) **Triangles, not hexagons**: Human force on the mouse, said (his note); hexagons bending a lot more (his note); statically determinate triangles taught with the classroom demonstration: a square of straws racks and sags, a triangle holds. The 3D note's lesson too: triangles show less red, the force spread out. Replaces: `lattice`, `shlDeterminate`.
- `b06_light` (shell) **Triangles win more on a light mouse**: The fact he loves, made compelling: as the mouse gets lighter the triangle's lead grows. Max load before it bends past a limit, against weight, triangles against hexagons, the gap widening as weight drops. Replaces: `shlThin`.
- `b06_arches` (shell) **Interwoven arches form triangles**: Arches drawn as continuous lines that form triangles where they cross (F2.16). His note reads "arches shojdkne be on the photon rim and for some reason sole of the lines look wobbly": most likely "arches shouldn't be on the bottom rim, and some lines look wobbly". Fix both: no wobble, arches spanning the dome, not sitting on the base rim. Replaces: `shbArches`.
- `b06_arch` (shell) **Why an arch holds**: "Hard to understand, need real world examples, unintuitive for a social media brain." An egg squeezed end to end in a fist that won't break; a Roman arch; then the arch against a flat plate under the same hand press: the plate cracks at 12 N, the arch holds to 45 N. Thrust cancelling bending, shown, not described. Replaces: `shbPress`, `shbBend`.
- `b06_thrust` (shell) **The thrust line**: The hanging chain flipped upright (Gaudí's hanging models, F33.8): a chain hangs in pure tension; flip it and it is the arch that stands in pure compression. Then the thrust line through Theseus's arch. Replaces: `shbThrust`.
- `b06_fibres` (shell) **Fibres along the load**: Wood splits along its grain (classroom demonstration). Fibre-filled plastic is strongest along its fibres (Krenchel; the research figures), and continuous arches let the melt lay fibres along the load. The flow through a filleted node aligns them; a sharp node tangles them. Replaces: `shbFibres`, `shbFlow`.
- `b06_fillet` (shell) **Why corners get fillets**: The Comet airliner's square windows (classroom demonstration): cracks started at the corners. A sharp node concentrates stress; a fillet spreads it. No shell study shown here (his note); the rest of the old slide merged. Replaces: `fillet`.
- `b06_filletsize` (shell) **Fillet size, solved at equal mass**: Rated 10/10: keep its content and simulation. Raise the motion to the new bar (the radius sweeping, the struts thinning to hold the mass, the peak falling, the pick landing). Replaces: `filletsize`.
- `b06_mold` (shell) **What a fillet buys the mold**: One dense slide for what the old deck spread over four thin ones ("doesn't need its own slide"): one rib width, a cutter that fits the corner (no knife edges of steel), and a looser tightest tolerance. His note on shbWidth: it read as contradicting earlier slides at a glance; make sure it doesn't. The mold method is undecided (F13.2): the advantage holds either way. Replaces: `shbWidth`, `shbMill`, `shbMillDirect`, `shbTol`.

  Every lattice filleted (F9.27), peaks red (F9.23), "Peak experienced stress (lower is better)". The FE solver is 07-sim.js; the shell and arch models are in 10-d-shell.js and 10-d2-arches.js: reuse them.

## B07: Shell III and Shape: the board, the build, the hand (deck/src/30-b07-board-shape.js, 11 slides)

- `b07_board` (shell) **The board you already carry**: FR4 is a woven composite like carbon fibre (his note), so the board itself can stiffen the shell instead of carbon rods, with no extra parts and no extra tolerances: use what you already carry. FR4 against magnesium at the same weight. Fold in the published deflection test only if you can set it up so a viewer knows what the spec means (his note on shlStructs), else leave it out and say so. Replaces: `shlPcbRib`, `shcCarry`, `shlStructs`.
- `b07_arms` (shell) **Small arms snap, the whole board holds**: Draw what G-Wolves' FR4 arms and board really look like (his photos, described in F28.3; his own HTS Ultra's arms broke in shipping): a drop or squeeze snaps an arm; Theseus uses the whole board. Replaces: `shcArms`.
- `b07_tolerance` (shell) **Tolerance stack-up**: With the law behind it for validity (worst-case and root-sum-square stack-up, sourced), stacked coins as the classroom demonstration, the drops drawn as simplified mouse parts, no Theseus teardown. One badly toleranced part ruins the whole mouse: more important than it looks (his note). Replaces: `tolerance`.
- `b07_poron` (shell) **Poron pads, not grease**: Factory Poron pads where the board meets the shell: players already mod their G-Wolves mice with these to stop creaking (his note). Show the creak (board rubbing its post under a squeeze), then the pad. Replaces: `grind`.
- `b07_sheet` (shell) **The rest of the shell**: The shell ideas that belong nowhere else, each one dense and specific: PPS triggers, a closed wheel well, graded walls, joined struts. The film sticker only if he wants it (he was unsure: say so). No pro model, no bottom plate (later). Replaces: `shlsheet2`.
- `b07_shcard` (shape) **A shape measured on hands**: The shape chapter card as the compromise: shapes chosen by taste, not measured. Replaces: `shapecard`.
- `b07_newton` (shape) **Newtonian shape analysis**: The concept name in the title (F2.44). Keep the analysis (three illustrative profiles until the shape is final, F21.12), problem-first. Replaces: `shp_newton`.
- `b07_sides` (shape) **Flat low sides, held the same on both**: In the Shape chapter now (his note). Equal pressure on both sides, just for show; no asymmetry (it looked bad). The flat low sides take the peak, so the lattice runs thicker there, the same on both sides (F13.4, F19.2), with the thumb rest on the left. Replaces: `shbSides`.
- `b07_size` (shape) **Sized against real hands**: Quote his flatter-mouse line word for word (F21.13): "for a flatter mouse, its better to be too small than too big, because big hands will still be able to fingertip grip". 119.3 mm against the flagships and the average hand. Replaces: `size`.
- `b07_emg` (shape) **EMG on every shape revision**: Muscle activity measured on players for every revision: what the electrodes read, and the revision that wins. Replaces: `emg`.
- `b07_balance` (shape) **Balance at the centre**: Research why some people push for a higher battery placement and show both sides honestly (his note on mass). His decision: the balance stays at the centre of the mouse (F30.10), and the battery is the heavy part that sets it (F21.15). Show the centre of mass moving as parts move. Replaces: `mass`.

  Brock's G-Wolves photos are in refs/photos/brock-2026-11-06/ (gwolves-board-in-lattice-shell.png, gwolves-lattice-part-with-arm.jpg). Draw the board with the shared board helpers (H1 is rebuilding it to plan 5).

## B08: Surface: a finish that grips and lasts (deck/src/30-b08-surface.js, 9 slides)

- `b08_card` (surface) **Grip that holds, and stays**: The surface chapter card as the compromise: tape that peels, soft-touch that wears, paint that chips. The surfaces must look good (his note: "surfaces looks bad in 2d and 3d visualization"). Replaces: `surfacecard`.
- `b08_coating` (surface) **A baked ceramic coat**: "Lazy visualizations, show flames and more realistic pots" (his note): the bake drawn properly. 9H shown as "9H on Cerakote's tests" (F21.10). Replaces: `coating`.
- `b08_film` (surface) **A film too thin to weigh**: The height before sanding and coating shown (his note), the blast taking off almost what the coat adds. His note: the film numbers before blasting looked far too heavy (0.49 g is a lot for a film thinner than soft-touch): check them, and keep the soft-touch comparison he liked. The net figure stays unnumbered (F21.10). Replaces: `srf_texture`, `srf_weight`.
- `b08_uv` (surface) **No yellowing**: Most coatings: you can't tell if they will yellow (the ULX Pros yellowed). Cerakote's chemical and UV resistance among the industry's best. A UV chamber, the hours, the colour shift. Replaces: `srf_uv`.
- `b08_grip` (surface) **Directional grip**: "Really good visualization but needs to be more intuitive": a fingertip dragging across etched ridges, grip where the finger needs it, freedom elsewhere. Replaces: `grip`.
- `b08_gripmap` (surface) **A grip map for the hand**: The designs optimised to look good, blending between textures (his note). He asked to see it before deciding the map (F21.9). Replaces: `srf_gripmap`.
- `b08_tape` (surface) **The best thickness is no thickness**: His line. Players chase ever thinner grip tape; this has none: no adhesive to wear or gunk. Replaces: `srf_tape`.
- `b08_twotone` (surface) **Two-tone in one coat**: Etched through to the carbon (F21.7). Not universal to the design, but he loves how realistic it is. Replaces: `srf_twotone`.
- `b08_wheel` (surface) **A 0.9 g magnesium wheel**: Compare with average plastic wheels with heavy rubber, as a test group (his note), sourced. Six thin arms, the straight-line tread (F30.8, his preference over the diamond knurl), 0.9 g against PMM's 1.0 g. Replaces: `wheel`.

## B09: Electronics I: wireless with no penalty (deck/src/30-b09-signal.js, 8 slides)

- `b09_card` (elec) **Wireless with no penalty**: The electronics chapter card as the compromise: wireless that costs latency, battery or weight. Replaces: `eleccard`.
- `b09_chip` (elec) **One chip, 8 khz**: Single-chip 8 khz polling: the rival's two-chip path against one chip. "Dual 8khz wired and wireless". Replaces: `onechip`.
- `b09_radio` (elec) **The radio, clear of the wheel**: The Raytac AN54LM-P20A with the long antenna (F21.4), black (F9.25), turned 180° so the antenna points away from the wheel's metal (F9.13). The rival: an antenna beside metal, its signal pulled down. Replaces: `elc_module`, `antenna`.
- `b09_latency` (elec) **Motion latency, ranked**: Simple (G10). The ranking at a glance, Theseus's target among measured mice, the method in one line. Replaces: `motion`.
- `b09_penalty` (elec) **No wireless penalty**: Simple (G10). What wireless costs most mice, and what it costs Theseus. Replaces: `elc_rate`.
- `b09_sync` (elec) **Frame sync: 202 → 42 µs**: Simple. The Viper V4 Pro at 202 µs frame to USB; the XA25 at 42 µs with SensorLock on an older PAW3950 with better software (his figures, F26.10); Theseus's target 42 µs. Show what jitter does to the cursor. Replaces: `framesync`.
- `b09_second` (elec) **Second Shot**: A spare for each report: when a packet is lost, the next carries it. Show the lost packet and the recovery. Replaces: `secondshot`.
- `b09_life` (elec) **Battery life at every polling rate**: Battery life against polling rate and the Pareto frontier: the zero-compromise case, at a glance. Replaces: `power`, `frontier`.

  Software and latency slides must be simple (G10): "mosr of them are confusing". The board is being rebuilt (H1): draw it with the shared helpers. The long-antenna Raytac module he wants: refs/photos/brock-2026-11-06/raytac-mdbt50q-long-antenna.jpg.

## B10: Electronics II: power, the board, the wires (deck/src/30-b10-power.js, 10 slides)

- `b10_pmic` (elec) **One chip runs the power**: The PMIC (nPM1300) replacing a handful of power parts, fewer passives; on the new board it sits far from the MCU (F30.1, F30.3). Replaces: `elc_pmic`.
- `b10_charge` (elec) **Fast charging, safely**: Charging at the battery's 1C, and the four guards (temperature, over-voltage, short, the ship mode). Replaces: `elc_charge`, `elc_safe`.
- `b10_battery` (elec) **The battery, per gram**: His note: the lithium-ion numbers were way off; look at smaller batteries; Li-ion is usually a gram or two heavier than Li-po of the same capacity for mice. Call it a battery, never a cell (F21.8). The LP402535JU is the example battery. Replaces: `cells`.
- `b10_board` (elec) **One board, one side, one reflow**: Good, but he wished it were even better visualized: a two-sided board's second pass hanging parts upside down through the oven, against one side, one pass. 5.6 g, one board (F2.29). Replaces: `elc_oneside`.
- `b10_sealed` (elec) **A coat that keeps water out**: Show how the conformal coat protects against water (sweat, a spill) for very little weight, something few makers do (his note). Replaces: `elecsheet1`.
- `b10_wires` (elec) **Braided, not ribbon**: A ribbon cable tears and creases; braided wires take 200× the pull and flex without creasing (keep what he rated 8 and 7). Replaces: `elc_tear`, `elc_flex`.
- `b10_twist` (elec) **Twisted pairs, a quiet radio**: Twisting cancels the noise the wires would put into the antenna; the lay (twists per length) against noise and weight. Replaces: `elc_twist`, `elc_lay`.
- `b10_cable` (elec) **An angled plug, a paracord cable**: "Extremely lazy visualizations, paracord needs better assets" (his note): the paracord drawn properly (woven sheath, strands), the angled plug on the shell, the drag it removes. Replaces: `cable`.
- `b10_lights` (elec) **Nothing lights up but the sensor**: The magnetic (Hall-effect) encoder, unaffected by dust, with a transparent top housing so a failure can be seen (his note on sealed), the mechanical switches, no RGB LED, each with its battery figure. It sits next to the web software slide (F30.20). Replaces: `srf_encoder`.
- `b10_software` (elec) **Set it once, in the browser**: Web software with nothing to install, and the lift-off distance set in 0.1 mm steps, sold properly (from gld_soft: "better sell the importance of liftoff distance being 0.1mm configurable"). Replaces: `software`, `gld_soft`.

  K2 improved cells, elecsheet1, cable and srf_encoder (they are in the old files): reuse them. The board is being rebuilt to plan 5 (H1): draw it with the shared helpers so your slides follow it.

## B11: Ownership: made to last, and to open (deck/src/30-b11-own.js, 8 slides)

- `b11_card` (own) **Made to last, and to open**: The ownership chapter card as the compromise: glued, soldered, thrown away. Replaces: `owncard`.
- `b11_repair` (own) **Made to be opened**: Rated 8: keep, problem-first. What breaks, and what you need to fix it: a driver, no heat, no solder. Replaces: `repair`.
- `b11_screws` (own) **Titanium screws**: M2 grade 5 titanium combination-drive screws: harder heads that resist cam-out (220 → 349 HV against class 4.8, sourced, F25.5), lighter, no magnetic pickup; thread stripping lives in the insert, said plainly. Replaces: `ownscrew`.
- `b11_inserts` (own) **Brass inserts: the same fit every time**: The second drive in plastic cuts a new thread; in brass it follows the same one: 70 % → 0 % chance the joint feels different (F21.5). First assembly in words (F21.12). Replaces: `own_insert`.
- `b11_wear` (own) **Thread wear**: Brass keeps 98.6 % of its hold after 20 heavy loads; screws straight into plastic keep 82.8 % and 43.3 % after re-assembly: both tests, labelled (F21.12). Replaces: `own_life`.
- `b11_battplug` (own) **A battery you can unplug**: The side-entry battery plug, turned to face the back so it can be pulled out properly (F26.4): no tools, no heat. Replaces: `ownbatt`.
- `b11_board` (own) **Screws from below, art on the board**: The board comes out from below; its underside artwork (the old design's, adapted, F30.15). Replaces: `ownboard`.
- `b11_box` (own) **In the box**: The trifold box with the driver. ownsheet1 "feels redundant, most of this should be moved to other slides": move each of its points to the slide it belongs on (say where in your answers) and keep the rest here, with ownsheet2's colourways and paper cover. Replaces: `box`, `ownsheet1`, `ownsheet2`.

  Serials and engravings stay hidden (F26.11).
