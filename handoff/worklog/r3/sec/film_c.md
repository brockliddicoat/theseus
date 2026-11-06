## 2026-11-06 12:06 (machine clock), critic R3, build 1203 (107 slides: L1's b12_latopt and b12_ribs after b06_filletsize; b03_rail now before b03_side)

**FILM F36 APPLIED** (b03_rail plays before b03_side: Clicks now ends on the tied posts' 125 → 4 gf). **FILM F29 is now a must:**

**FILM F42 (must, integrator with L1 and P4): the lattice's dimensions are told three ways, and the winner breaks the film's own
moulding floor.** Brock asked for "the perfect lattice and lattice beam dimension and filet size" and how it was found (F43.4);
L1's study answers it, but the slides around it disagree:
1. **The floor.** b05_wall's argument is "carbon PP fills down to 0.89 mm (Protolabs); magnesium at the same weight's 0.55 mm
   freezes short". b06_filletsize and b06_mold shade "struts under 0.89 mm, too thin to mold". L1's winner (b12_ribs) is a
   0.60 mm skin with 0.36 mm ribs: under that floor by the film's own rule, two slides later. L1 flagged the conflict (Protolabs
   gives 0.889 mm in its design guide and 0.635 mm on its Injection Molding Basics page; at 9.35 g even a plain wall is 0.744).
2. **The rib.** b06 prints Theseus's ribs as 1.0 mm (top) and 1.2 mm (low) with 0.6 / 0.75 mm fillets (b06_filletsize; "Filleted,
   0.6 mm: Theseus" on b06_fibres; "Theseus, r 0.6" on b06_mold), cells 12.5 mm (b06_arches); b12_ribs prints 0.36 × 1.80 mm
   ribs, a 0.18 mm root fillet, 12.3 mm cells. The fillets are different joints (b06's in plan, at a node; L1's in section, at
   the skin), but nothing says so, and b06's own rule (about 60 % of the strut's width) gives about 0.22 mm for a 0.36 mm rib.
**Proposal.** (a) The study is the source of truth for every number labelled "Theseus" in Shell II; b06's 2D strip keeps its
1.0 mm ribs only as the test strip ("on the test strip"), and its "Theseus: ..." lines quote L1 (P4). (b) One floor rule, said
once with its source: if a rib's limit is depth and sink (the guides' 40 to 60 % of the wall, three walls deep) and the 0.89 mm
is a nominal wall over a flow length, b06_filletsize's and b06_mold's strut shading must say "wall" not "strut" and b05_wall
must not imply PP can't go under 0.89; if the floor does bind, the study must re-run with skin and ribs at or above it (more
weight or fewer ribs). This is Brock's call with a picture (F44.1): the three thicknesses on one ruler, the two Protolabs
floors, and the weight each option costs. (c) b12_ribs' depth sweep has one data point (R3-b12-1, must, L1): until stage D
lands it can't show "the flex falls as it deepens".
