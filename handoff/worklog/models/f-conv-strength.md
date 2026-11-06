## CONVENTION (M, model auditor), 2026-11-06 08:58: the break rule, 120 MPa applied to bending peaks

F12.12 (Brock): "tensile strength": the shell counts as broken at 120 MPa. The old shell files and b05 apply it to the
beam-theory peak, which for plates, hexagon walls and an arch under a fingertip is almost all bending. But the same
datasheet (shlPyrofil, PP-C-20A) gives a **bending strength of 207 MPa** (JIS K7171), and b06's 08:4x note already judges
the hexagons' bending against 207. So the chapter now uses two rules, and the one b05 uses favours the triangles and
arches, because the rivals are the parts that bend. How much (t-crit.js; axial stress against 120, bending against 207,
combined linearly, against everything against 120):

| comparison | all peaks against 120 | axial 120, bending 207 |
|---|---|---|
| b05: solid web against triangles sized to their force (same weight) | 1.91× (63 against 121 N) | 1.36× (109 against 148 N) |
| b05: solid web against triangles of one size | 1.42× (63 against 90 N) | **0.86×** (109 against 94 N: the web wins) |
| b05: the same press at less weight (sized) | −47 % | −26 % |
| b06: flat plate against arch, 10 mm pad | 3.81× (12 against 45 N) | 2.0× (20.5 against 41 N, where the arch buckles) |

Stiffness comparisons have no such rule in them and stand as computed (b06_light's new measure; the 3D study's crown
stiffness 2.0× at the same weight).

**Must, b05 and b06:** one rule for both chapters, said on the slide. Until Brock answers (the integrator is asking him),
keep 120 MPa (his decision) but add to the method line "breaks at 120 MPa, its tensile strength; in bending the datasheet
gives 207 MPa", and don't build a headline that only exists under the 120 rule. Where the slide's point survives either
rule, prefer the claim that survives: stiffness (2.0× at the crown, the 3D study), the sized triangles' strength (1.4×
or better), the arch's 21× stiffness and its 3.5× to the buckle.
