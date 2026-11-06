### b08-8 (b08_film): Cerakote's solvent and dry-film density, to pin the film's weight  [Q2]
- **Solvent confirmed:** Cerakote F-118 (F-series) SDS, section 3: **p-chlorobenzotrifluoride (PCBTF, CAS 98-56-6) 50 to < 75 wt %**;
  "Ambient Curable Refractory Resin" 10 to < 25 %; two "Performance Ceramic" fillers 5 to < 10 % and 1 to < 5 %; liquid
  density **1.48 g/mL**. https://images.nicindustries.com/cerakote/documents/7090/cerakote-f-118-shale-dt20250219191608571971.pdf
  PCBTF's own SDS (Univar): density **1.33 to 1.35**, boiling point about 139 °C.
  https://www.univarsolutions.com/documents/file/view/code/sds_file/id/21588/
- **Check that Cerakote's coverage is volume solids:** H-167 TDS: 38 ± 2 % solids by weight, 1.36 g/mL, 606 ft² per
  gallon at 1.0 mil. Volume solids from coverage = 606 / 1604 = 37.8 %. With PCBTF at 1.34 g/mL filling the rest, the
  solids weigh 1.36 − 0.622 × 1.34 = 0.526 g per mL of paint = **38.7 % by weight**, matching the sheet's 38 ± 2 %. So the
  sheets are self-consistent and H-167's dry film is 0.526 / 0.378 = **1.39 g/cm³** (Derived).
  https://images.nicindustries.com/cerakote/documents/4979/h-167-usmc-red-tds-dt20231127204218354071.pdf
- **For F-110 (the slide's coat):** dry density = (ρ_liquid − (1 − φ) × 1.34) / φ, with φ = 604 / 1604 = 37.7 %. At
  F-118's 1.48 g/mL it is **1.71 g/cm³**; at 1.44 g/mL, 1.60 g/cm³. A 0.75 mil (19.05 µm) film on 133 cm² then weighs
  **0.41 to 0.43 g** (0.37 g at the slide's 1.45 g/cm³). Read F-110's own liquid density off its TDS
  (https://www.cerakoteeu.com/?p=20046, in b08's hands) and put it in the formula. A 2 g/cm³ film (the "about 0.5 g" end)
  would need a liquid of about 1.59 g/mL, denser than any sheet seen, so the range is **0.37 to about 0.43 g**.
- Assumptions: volumes add; all volatiles are PCBTF (the SDS lists no other solvent). Confidence: medium-high (derived,
  but checked against H-167's stated solids). Replaces: the 0.37 to 0.5 g range.

### R-b08_grip (nice to have): fingertip friction on grip materials  [Q2]
- No measured values for named grip tapes were searched (Lizard Skins DSP, Pulsar SuperGrip are products: Q1's if needed).
  The science, from Derler & Gerhardt 2012 (Tribology Letters 45:1-27), finger pads:
  dry, all materials: typically **0.2 to 1** (mean 0.60 ± 0.38, median 0.45); wet or moist: **above 1** (mean 1.28 ± 0.67);
  rubber glove 0.7 ± 0.08 dry, 1.2 ± 0.05 wet (Roberts); rubber 0.4 to 1.3 (Seo); smooth and textured polycarbonate 0.64 to
  2.22 dry, 0.61 to 1.23 wet in saltwater (Bobjer); nylon, PMMA, PC, PTFE 0.09 to 0.61 dry (Dinç; PTFE the lowest of any
  dry material); textiles 0.28 to 0.62; "smooth surfaces and elastomers tended to higher values". Dry finger friction is
  nearly load-independent (exponent −0.10; Tomlinson: no pronounced change up to 40 N); wet friction rises as pressure falls.
  https://doc.rero.ch/record/315296/files/11249_2011_Article_9854.pdf
- Use: "a dry fingertip grips plastics at about 0.2 to 1 and rubbery surfaces at the top of that range; sweat lifts most
  above 1 (Derler 2012)". No figure for soft-touch coatings as such. Confidence: high (review of measured data).

### b07-10 (b07_board, nice to have): a pultruded carbon-fibre rod's stiffness and mass  [Q2]
- TAP Plastics, pultruded carbon rods (standard modulus): 0.070 in and 0.125 in rods **tensile modulus 134 GPa (19.5 msi)**,
  tensile strength 2.34 GPa, 67 % fibre; the 0.240 in rod 138 GPa, 1.72 GPa, flexural 1.83 GPa and 131 GPa, **1.5 g/cm³**.
  https://www.tapplastics.com/image/pdf/Pultruded_Carbon_Rods__Tubes.pdf
- Derived: a 2 mm rod weighs π × 1² mm² × 1.5 g/cm³ = **0.47 g per 100 mm**; its bending stiffness EI = 134 GPa × π·2⁴/64 mm⁴
  = 134,000 × 0.785 = **1.05 × 10⁵ N·mm²**. Confidence: high (maker's typical values). No 2 mm size on that sheet.

### b06 (b06_lattice, b06_light, b06_arch): compressive strength of 20 % carbon-fibre polypropylene  [Q2]
- **Not published** in the sheets found: RTP 183 (PP homopolymer, 20 % carbon fibre; "limited issue", preliminary data):
  tensile 34.5 MPa, flexural 55.2 MPa, flexural modulus 6.89 GPa, SG 0.998, no compressive value; Carbonele PP-CF20: tensile
  ≥ 60, flexural ≥ 85 MPa, no compressive value. https://sushengpolymer.com/media/pdf/CFOghI_RTP-183.pdf ;
  https://www.carbonele.com/pp-cf20-polypropylene-reinforced-carbon-fiber
- Note for b05/b06: grades called "20 % CF-PP" differ by 3× (RTP 183 tensile 34.5 MPa vs Pyrofil PP-C-20A's 120 MPa), so
  always name the grade. Keep compression claims out, as now. Query: "20% carbon fiber reinforced polypropylene
  compressive strength MPa datasheet injection molding grade".

### b03_spdt (optional): a teaching source for the SPDT knife switch  [Q2]
- A university physics lab handout, "Physics Lab: Switches and Motors" (hosted by Loyola University Maryland's physics
  department; the handout names no institution): "A more complicated switch is a single pole, double throw switch (spdt)";
  "This switch can complete two different circuits" (a toggle in the exercise, not a knife switch).
  https://www.loyola.edu/_media/academics/physics/documents/students/robot-lab/exercise-switches.doc
- School-lab knife switches, single pole double throw, are stock education items (Thomas Scientific lists one under
  Education > Physics > Electricity: https://thomassci.com/Equipment-E-through-K-Education-Education-Physics-Electricity/_/Knife-Switch-Single-Pole-Double-Throw ;
  Ward's Science: https://www.wardsci.com/us/en/product/NA4200808/knife-switches ; not fetched).
- Use: demoPanel src "a school physics lab's SPDT switch" (no textbook found). Confidence: medium.
