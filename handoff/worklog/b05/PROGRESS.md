# B05 PROGRESS: Shell I, materials and strength

Brief: /home/claude/theseus/handoff/revamp2/b05-brief.md (+ common.md). File: deck/src/30-b05-shell.js (prefix `b05_`).
Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b05 --own=30-b05-shell.js` (add `,06-motion.js` to
--own until the integrator snapshots the kit: f0a found 06-motion.js is not in deck/.snapshot).
Checks: `export NODE_PATH=/opt/npm-tools/node_modules; Q='&2d=1'` then errs.js / qa.js (T=settle, T=mid) / shoot.js (PAR=1).
Work: /home/claude/work/b05/ (scripts/harness.js + scripts/numbers.js reproduce every number below from the deck's own models).

## Status
- [x] Read common.md, b05-brief.md, FEEDBACK (all STANDING / DECIDED, F27 notes, F32 to F35, F38, F2.09/10/11, F9.23, F12.12,
      F14.5/6/7/8/9/10, F16.1, F33.5), REVAMP.md, DESIGN.md, f0a brief, audit brief, b06 brief and plan, b04 plan
- [x] Read the old slides in 10-d-shell.js (shellcard, materials, shlSpecific, thinwall, shlScatter, shlPick, shlNoPick,
      shlHotspot, shlMargin, shlWork, shlShell3d), 07-sim.js, 10-d-0-meter.js; ran their models in node
- [x] Research (sources below, every one fetched and quoted this session; the turn's web-search budget ran out after them)
- [x] Storyboard every slide (below)
- [x] Phase B started 08:05 (KIT.md landed). Data, sources, models, drawing helpers written in 30-b05-shell.js
- [x] Build order: ALL TEN BUILT (local clock ~10:00) and put in film order in the file (card, material, specific, wall,
      cubed, fallacy, nopick, hotspot, margin, work; card first:true). Final errs/qa sweep of all ten running.
      Applied: review M-b05-1..5, R-b05-1..10, M 09:15 heat key, F41.1 two strengths, FILM F4 (b06's B06_STRIP + 10 N),
      BROADCAST-0945 (Sora V2 replaces the ULX on fallacy; specific one tensile basis, labelled; "a hard press").
      Local build needs b06's file: --own=30-b05-shell.js,30-b06-lattice.js (B06_STRIP is read inside draw()).
      Later: F45 (b05_cubed rebuilt around the film's one ruler demonstration: 10 × 3.3 mm carbon PP, 60 mm, 2.00 g, 10 N,
      111 → 12 µm, 9.1× on edge; numbers sent to L1 a9f2c61d4b05664d7); F44.2 (no b05 slide quotes the shell's budget: the
      wall slide's 10 g per 100 cm² is a per-area basis). All ten: errs ok, qa settle + mid clean, frame one checked.
- [x] Integrator feedback acted on (09:15 F41.1, 09:30 F4/F17, 09:45 research decisions, F44.2, F45).
- [ ] Checks per slide: errs, qa settle + mid, shots 0.6 / mid / settle, phone 0.44x
- [x] CHECKPOINT1.md after b05_nopick (done ~08:40)
- [ ] Integrator feedback acted on
- [ ] Final report (SubagentHandback)

## Sources (all fetched this session; key → what it says)
- `b05Tpu` TechPowerUp, Logitech G Pro X Superlight 2 review (2023), build quality page: "When applying lateral pressure,
  some creaking but no flexing of the shell can be observed." https://techpowerup.com/review/logitech-g-pro-x-superlight-2/4.html
- `b05TpuUlx` TechPowerUp, Finalmouse UltralightX review (first batches): "minor creaking and significant flexing of the
  shell" under lateral pressure. https://techpowerup.com/review/finalmouse-ultralightx/4.html
- `b05Peri` Periview, Finalmouse ULX Competition review: "The sides are solid, which feels like a significant improvement over
  the more flexible, creaky bodies of previous models", "The overall construction feels sturdier, with less flex".
  https://periview.gg/?p=3024
- `shlRtingsUlxcGpx2` (exists) RTINGS compare: the ULX Competition "suffers from inconsistent quality control"; "we experienced
  noticeable creaking, popping, and flexibility on our unit". (RTINGS also calls the GPX 2's build "better and much more
  consistent": that line is NOT used (his note), and the fallacy slide never claims the ULX is built better overall.)
- RTINGS measured weights (research/data/mice.json): GPX 2 59.4 g, ULX Competition 37.9 g, Sora V2 40.9 g.
- `b05Fm` Finalmouse, ULX Competition page: "The strength to weight ratio of our unique carbon fiber composite is over three
  times better than ABS" and "a third better than magnesium"; "now features solid sides". https://finalmouse.com/products/ulx-competition-overview
- `b05Razer` Razer newsroom, 2023-02-02, Viper Mini Signature Edition: magnesium alloy chosen "for its strength-to-weight
  properties"; "injection-molded exoskeleton that is then CNC machined"; 49 g.
  https://www.razer.com/newsroom/product-news/razer-unveils-the-viper-mini-signature-edition-a-magnesium-alloy-gaming-masterpiece
- `b05Johnson` Johnson, Hagberg, Wigaeus Hjelm & Rempel 2000, Scand J Work Environ Health 26(5):398-405: mean force on the
  mouse's sides 0.43 N (0.6 % of maximum voluntary), on the button 0.35 N (0.8 %). Derived: the hardest side squeeze is
  about 0.43 / 0.006 = 72 N, the hardest button press about 44 N. https://www.sjweh.fi/article/560
- Click: GT01-class switches about 70 gf = 0.69 N (Brock's doc: "gpx 2 switches and bspd are 70gf"; his figure, no tag).
- `b05Bates` Bates & Dean 2024, "A total rip-off: crack propagation in paper", Physics Education 59 035010: 25 mm strips of
  70 gsm printer paper (0.095 mm); uncut they need 95 N (40 MPa); students pulled 25 to 35 N; "All students easily broke the
  paper with a 5 mm cut ... none were able to break a 3 mm cut"; a 5 mm edge cut leaves 80 % of the area (76 N by area)
  but the crack predicts 33 N. https://eprints.whiterose.ac.uk/210831/1/Bates_2024_Phys._Educ._59_035010.pdf
- `b05SciOly` Science Olympiad, New Mexico Bridges rules (2021-22): "Score of a team = (Load score in grams)/(Mass of the
  structure in grams)": the classroom version of strength per weight. https://www.nmt.edu/stem/olympiad/2021-2022%20Bridges.pdf
- `b05Mit` MIT 2.008 Design and Manufacturing II (S. Kim, 2004), polymer processing: solidification time grows with thickness²
  over diffusivity; short shot: "the molten plastics becomes solid before it flows to the end of the mold"; flow path ratio
  L/T: PP 280 to 150, ABS 280 to 120, PC 160 to 90. https://ocw.mit.edu/courses/2-008-design-and-manufacturing-ii-spring-2004/4affb4ea315d9aaf3b38353bede9b660_05polymer_2_6f1.pdf
- `protoWall` (exists) Protolabs: polypropylene walls 0.889 to 3.81 mm (ABS 1.143, PC 1.016 minimum, same guide).
- `thixoDN` (exists) Design News: thixomolded magnesium 0.7 mm in the Toshiba Libretto, 0.5 mm on small parts.
- `b05ProtoTol` Protolabs blog "Understanding Injection Molding Tolerances", 2023-02-07: mold machining tolerance ±0.003 in
  (0.076 mm), resin tolerance no less than ±0.002 in/in. https://www.protolabs.com/resources/blog/injection-molding-tolerances/
- `b05Ji` Ji, Bell & Ellis, Understanding and Using Structural Concepts (2nd ed., CRC Press 2016), and Ji's Manchester
  (UMIST) teaching notes: "a 1-metre wood ruler that has a weight attached to its free end ... turned 90 degrees ...
  significantly smaller displacement". https://personalpages.manchester.ac.uk/staff/tianjian.ji/teaching/ucasdis.pdf ,
  https://www.routledge.com/products/9780429172151
- `b05Ucsb` UCSB lecture demonstration 32.30, bending wood beams: stiffness with the cube of thickness (two boards, 8.3 and
  14.6 mm). https://web.physics.ucsb.edu/~lecturedemonstrations/Composer/Pages/32.30.html
- Datasheets (exist in 10-d-shell.js SRC): shlPyrofil (1.01 g/cm³, 13.5 GPa flexural, 120 MPa tensile break), shlAbs (1.05,
  2.55 GPa, 50 MPa yield), shlPc (1.20, 2.35 GPa, 65 MPa yield), shlMg (AZ91D 1.81, 44.8 GPa, 230 MPa UTS, 150 yield), shlAl
  (6061-T6 2.70, 68.9 GPa, 310 UTS, 276 yield), shlFr4 (1.85, 20 GPa, 430 MPa lengthwise). Metals at UTS (generous to them).
- Models: shlHot2d (2D frames, 07-sim.js), shlLattice (3D study, 15.18 g body: not the final shell, F21.1).

## Numbers (scripts/numbers.js; every one derived from the sources above)
- Strip: 60 mm span, 10 mm wide, 1 mm thick (a mouse wall), 2 N in the middle (a firm press, about a phone's weight).
  ABS sags 4.24 mm, PP-C-20A 0.80 mm: 5.3× stiffer. Weights 0.630 g / 0.606 g. ABS gives at 5.6 N, PP holds to 13.3 N (2.4×).
  PP as stiff as the ABS strip: 0.574 mm, 0.348 g (−45 %).
- Same weight (0.606 g each, = 10.1 g per 100 cm² of wall): thickness PP 1.00, ABS 0.96, PC 0.84, Mg 0.56, Al 0.37, FR4 0.55 mm.
  Sag at 2 N: PP 0.80, Mg 1.39, Al 2.99, FR4 3.32, ABS 4.76, PC 7.71 mm. Holds: FR4 14.2, PP 13.3, Mg 8.0, ABS 5.1, PC 5.1,
  Al 4.8 N. Ranks: raw strength FR4 Al Mg PP PC ABS (PP 4th); raw stiffness Al Mg FR4 PP ABS PC (PP 4th); same weight,
  bends least PP Mg Al FR4 ABS PC (PP 1st); same weight, holds most FR4 PP Mg ABS PC Al (PP 2nd, 1st of the moldable five).
  PP vs Mg at the same weight: 1.7× stiffer, 1.7× the load.
- Wall, 10 g per 100 cm²: PP 0.99 mm (floor 0.89: fills), Mg 0.55 mm (floor 0.70: short). Mg at 0.70 mm weighs 12.7 g (+27 %).
  Fill model: reach ∝ (t / floor)² (freeze time ∝ t², MIT 2.008), calibrated to each floor: Mg reaches 62 % of the flow.
- Cubed: ruler 30 × 2 mm on edge vs flat: 225×. 10 % thinner = 27 % softer; 10 % thicker = 33 % stiffer.
  ±0.076 mm (Protolabs) on a 0.70 mm wall: −29 % to +36 % stiffness; on 1.00 mm: −21 % to +25 %: 1.4× narrower.
- 2D frames (60 mm span, 10 N middle, PP-C-20A): solid plane 0.276 g, peak 17.8 MPa, cracks at 67.5 N (244 N per g); triangles
  one size 13.3 MPa, 90 N; triangles sized to their force 9.53 MPa (−46 %), 126 N (455 N per g). Same strength at 0.536× the
  weight (−46 %). At 0.8× the weight: 11.9 MPa (−33 %). Working share (≥ half its own peak): 17.6 / 24.5 / 90.5 %.
  At 67.5 N (the plane cracks) the triangles' peak is 64 MPa: 46 % margin.
- Human scale: a click 0.35 N average (Johnson 2000), a switch about 0.69 N; a grip 0.43 N average; the hardest squeeze about
  72 N (derived from the same study).

## Themes and order (alternating; the chapter card on night)
b05_card night, b05_material paper, b05_specific night, b05_wall paper, b05_cubed night, b05_fallacy paper, b05_nopick night,
b05_hotspot paper, b05_margin night, b05_work paper. (b04_reports before, b06_lattice after: themes to confirm with them.)

---

## b05_card (shell, chapter card, night, settle 6): "Light, without the flex, creak or crack"
- Problem (the compromise): lighter shells flex, creak and crack (TechPowerUp: the first ULX "minor creaking and significant
  flexing of the shell"; the GPX 2 still "some creaking" at 59.4 g).
- Kit: chapterCard2({ ch: 'shell', compromise: 'Lighter shells flex, creak and crack', answer: 'Light, without the flex, creak
  or crack', list, part }), the ledger strip with shell in focus (red compromise turning blue).
- Part: the simplified mouse (mouseSimple side), the top shell lit; a palm squeeze: a hairline flex on a ghost rival outline
  (red creak ticks at the seam), then Theseus's shell holding. Small, quiet, causal (the press moves it).
- List (the chapter's ideas, film order): Carbon-filled polypropylene; Strength per gram; Walls a mold can fill; Wall
  tolerance, cubed; The strength–weight fallacy; Stress hotspots; The peak decides the break; Weight that works; Triangles,
  arches, fibres, fillets (b06); The board as a tie (b07).
- Beats: 0 s chapter name + compromise in red; ~1 s the squeeze on the light shell, the creak; ~3 s the ledger turns the shell
  row blue; ~4 s the list; settle 6.
- Hand-off in: b04_reports ends on the cursor following the hand; the card opens on the hand on the mouse (the force the
  shell carries). Out: the lit top shell is where b05_material's establish starts.
- Answers: shellcard rated 7, no note (say so); F33.7 (the compromise named), F38.8 (simplified mouse).

## b05_material (paper, settle 10.5): "Carbon-filled polypropylene"
- Problem: ABS, what most mice are made of, bends under a hand. Rival named in type: "ABS, the plastic most mice use".
- Establish (M4): mouseSimple side, the main-button wall lit; a 60 × 10 mm strip is lifted out of the wall and laid flat on two
  supports; the label "A strip of the wall, laid flat: just the material, no curve helping" (his note); locator in the corner.
- Demonstration (M1, M3 same input): one strip, ABS, under a fingertip pressing 2 N ("2 N: about a phone's weight; a click is
  0.35 N, the hardest squeeze about 72 N", Johnson 2000); it sags 4.2 mm, drawn to scale (no exaggeration). Then the wipe:
  under the SAME finger and press the strip becomes PP-C-20A and springs back (damped spring) to 0.8 mm; the ABS sag stays as
  a grey ghost and a struck "4.2 mm".
- Weights (his note): under the strip, each strip's weight: ABS 0.63 g → PP-C-20A 0.61 g ("the same strip, 4 % lighter");
  then the projected beam: "as stiff as the ABS strip: 0.57 mm thick, 0.35 g (−45 %)" drawn as a thin ghost strip beside it.
- Headline: verdict 4.2 → 0.8 mm, "5.3× STIFFER, same weight"; quiet tile: "2.4× as strong: ABS gives at 5.6 N, PP holds to
  13 N"; gloss: flexural modulus.
- Beats: 0 s header + mouse + lit wall; 0.6 to 2.2 s strip lifts out and flattens; 2.4 s finger lands, ABS sags (problem by
  ~2.5 s: the mouse establish takes the first second, the strip already visible at 1 s); 4.5 s wipe to PP, spring back;
  6.0 s weights; 7.0 s verdict; 8.0 s projected 0.35 g; settle 10.5.
- Hand-off: ends with both strips' weights on screen; b05_specific opens on the same two strips, four more joining.
- Answers (materials, 6/10): "explain that this is just on a flat plane" → the strip lifted out of the wall and laid flat, the
  label says just the material, no curve helping (the curves' gain is b06_arch); "scale the force to what a mouse would
  experience from a hand and note that" → 2 N, said on the slide with a click and a squeeze for scale (Johnson 2000);
  "do that more throughout the presentation" → every b05 slide with a force says its human scale; "add the projected
  weights of these 2 beams" → 0.63 g and 0.61 g on the strips, and the PP strip as stiff as ABS, 0.35 g.

## b05_specific (night, settle 12): "Specific strength and specific stiffness"
- Problem: picking a shell material by its datasheet. On paper aluminium is 5× as stiff and 2.6× as strong as carbon PP, and
  rivals sell metal "for its strength-to-weight" (Razer 2023, magnesium Viper Mini SE).
- Classroom (F33.8): the bridge contest scores load held ÷ the bridge's own weight (Science Olympiad); demoPanel label.
- Demonstration: six strips (PP-C-20A, ABS, PC, magnesium AZ91D, aluminium 6061, FR4), rows in datasheet-strength order
  (FR4, Al, Mg, PP, PC, ABS), all 1 mm at first; they re-size to ONE weight (0.61 g each, the 1 mm PP strip's): aluminium thins
  to 0.37 mm, PP stays 1.00 (thickness drawn to scale, ×12). Test 1, the same 2 N press on all six: sags to scale; PP least.
  Test 2, the press climbs until each gives: aluminium at 4.8 N, PC and ABS at 5.1, magnesium 8.0, PP holds to 13.3,
  FR4 14.2. Each failure: the strip kinks or cracks, red, "held 4.8 N".
- The graphic he liked, now explained by the demo: two small bump charts beside the strips, filled by the tests: Stiffness
  (datasheet → same weight: PP 4th → 1st) and Strength (datasheet → same weight: PP 4th → 2nd, FR4 1st).
- Headline: verdict "4th → 1st" (stiffness per gram), with "1.7× magnesium's stiffness and load, the same weight". FR4's line:
  "FR4 is flat board, it can't be molded into a shell: Theseus uses it as the board (#94)" (hand-off to b07_board).
- Beats: 0 s header + six 1 mm strips + datasheet ranks (problem: carbon PP 4th); 1.0 to 2.6 s re-size to one weight;
  2.8 to 4.8 s the 2 N press, the stiffness bump draws; 5.0 to 8.4 s press until it gives, the strength bump draws;
  8.6 s verdict; settle 12.
- Hand-off: in from b05_material's two strips; out: the same-weight walls (PP 1.00 mm, Mg 0.56 mm) are b05_wall's opening.
- Answers (shlSpecific, 4/10): "doesn't show how higher specific strength is better" → the same-weight strips pressed until
  they give: the higher strength per gram holds more press, shown; "just feels like a graphic which is quite convoluted" →
  the slide leads with the test, the chart follows it; "i like the graphic" → kept, as two plain bump charts that the tests
  fill in; "the explanation for it needs to be so much better" → the bridge contest, the strips re-sized to one weight on
  screen, each result read off the test. F14.6 (value per gram; not who has the highest tensile strength or modulus; the
  six materials), F33.5 (important idea, rebuilt).

## b05_wall (paper, settle 11): "How thin a wall can go"
- Problem: a dense material can't make a light wall a mold can fill. At 10 g per 100 cm², magnesium is a 0.55 mm wall; the
  typical thixomolded floor is 0.7 mm (Design News). Rival named: magnesium shells (Razer's injection-molded magnesium
  exoskeleton, 2023, full of holes).
- Establish: locator, mouseSimple side with the wall section lit (the gate under the crown, F13.3/F19.1).
- Demonstration (M1): two mold cavities in section, same weight per area: magnesium 0.55 mm (top), PP-C-20A 0.99 mm (bottom),
  drawn to scale (×40). Melt is injected at the gate (hot colour, functional); a frozen skin grows from both cold mold walls
  (grey), thickness ∝ √time; in the thin cavity the skins meet at 62 % of the flow: SHORT SHOT, the unfilled end hatched red.
  The PP melt reaches the end.
- Floors: dashed lines, PP 0.89 mm (Protolabs), magnesium 0.7 mm typical (Design News; 0.5 mm only on small parts).
- Payoff: to mold, magnesium needs 0.7 mm: 12.7 g where carbon PP needs 10 g (+27 %), or holes. Headline verdict "0.55 → 0.99
  mm, 1.8× THE WALL, same weight"; a line: "and stiffness goes with thickness cubed (next)".
- Beats: 0 s header + both cavities + gate; 0.6 s melt starts (problem visible ~1.2 s as the thin cavity's skin closes);
  3.6 s short shot lands; 4.6 s floors; 6.4 s the +27 % / holes line; 7.6 s verdict; settle 11.
- Hand-off: in: b05_specific's same-weight strips are these walls; out: "thickness cubed" → b05_cubed's ruler.
- Answers (thinwall, 3/10): "confusing and lazy graphic" → a molding demonstration (the melt freezing short in the thin
  wall); "hard to understand at a glance and with longer analysis" → at a glance: one cavity fills, one doesn't, 1.8× the wall;
  longer: floors, the +27 %; "super important concept though" → given its own demonstration and the most motion of the
  chapter's molding ideas (F33.5).

## b05_cubed (night, settle 11): "Wall tolerance, cubed"
- Problem: thin walls make mice that differ unit to unit. Rival symptom: two ULX Competitions, two verdicts (Periview: "the
  sides are solid ... less flex"; RTINGS: "noticeable creaking, popping, and flexibility on our unit", "inconsistent quality
  control"). Said as the symptom; the cube law is the mechanism a thin wall adds (no claim about the ULX's own walls).
- Classroom (F33.8): a ruler clamped at one end with a weight on its tip: flat, it droops; a hand turns it on edge and it
  springs nearly straight: "the same ruler, on edge: 225× stiffer" (Ji, Manchester; UCSB demo).
- Then the wall: "10 % thinner, 27 % softer; 10 % thicker, 33 % stiffer". A row of 9 shells from 9 cavities, each pressed by
  the same finger (2 N), each wall off by up to ±0.076 mm (Protolabs mold tolerance): their sag readouts scatter. Two rows:
  a 0.70 mm wall (magnesium at its floor) and Theseus's 1.00 mm. Stiffness spread: 0.70 mm −29 to +36 %, 1.00 mm −21 to +25 %.
- Headline (no "points"): verdict "−29 % to +36 % → −21 % to +25 %", "1.4× MORE ALIKE"; payoff "the Theseus you get feels like
  the one in the review".
- Beats: 0 s header + ruler flat drooping; 1.0 to 2.4 s the hand turns it, it springs up; 3.0 s the cube line; 4.0 to 7.0 s
  the two rows pressed in sequence, readouts landing; 7.4 s the ULX symptom quotes; 8.4 s verdict; settle 11.
- Hand-off: in from b05_wall's "cubed"; out: the plain wall that only gets stiffer by getting thicker, which is heavier:
  b05_fallacy's trade-off.
- Answers (shlScatter, 7/10): "don't use points" → no points anywhere: the stiffness range in % per wall and "1.4× more alike";
  "a little more intuitive" → the classroom ruler first, then shells pressed by a finger; "but still quite lazy" → a real
  demonstration: the ruler turned by hand, nine shells pressed, the scatter landing.

## b05_fallacy (paper, settle 11): "The strength–weight fallacy"
- Problem (F2.11): most mice make you pick: light flexes and creaks, solid is heavy. The fallacy: heavier is stronger.
- Demonstration: a balance with two mice (simple generic side outlines, named): the GPX 2 (59.4 g, RTINGS) and the ULX
  Competition (37.9 g, RTINGS); the beam tips toward the GPX 2 (damped spring), "+21 g". Then the same side squeeze (two grey
  fingertips) on both: the GPX 2 creaks (red ticks at its joint; TechPowerUp 2023: "some creaking" under lateral pressure),
  the ULX Competition holds (Periview: "the sides are solid"). Never "the GPX 2 has good build quality".
- Chart (his note: y strength, higher is better; x weight; area reads right): a plain solid wall, the press it takes to crack
  against its weight: a straight line up and to the right (2D frame, 244 N per g), "Light: it cracks" low-left, "Strong: it's
  heavy" high-right; the pointer drags the wall's weight along it (the wall in oblique view thickens).
- Payoff (alludes to the correction, F14.5): "21 g heavier, still creaks: weight isn't what makes a shell solid. Where the
  material goes is." Big type line in ink with "STILL CREAKS" in red; no Theseus number on this slide (no win claimed).
- Beats: 0 s header + scale + both mice; 0.8 s the beam tips (+21 g, problem at ~1 s); 2.0 to 4.2 s squeeze, creak, quotes;
  4.8 to 8.0 s the line and the drag; 8.4 s payoff line; settle 11.
- Hand-off: the chart's plain-wall line is where b05_nopick starts (its own clip: it redraws the line in its first second).
- Answers (shlPick, 7/10): "gpx 2 has worse build quality than the ulx even though it was heavier, this demonstrates the
  fallacy" → the scale and the squeeze: heavier, and it creaks (TechPowerUp), the ULX's solid sides (Periview); "i dont like
  that it says the gpx 2 has good build quality" → nothing says it; RTINGS' line praising it is not used; "the line might be
  unintuitive at a glance" → one straight line, labelled at both ends in words; "the axes need to be formatted and labeled
  differently" → y "Press it takes to crack (higher is better)", x "Weight"; "you expect the right to mean weaker and lighter
  ... because it has the least area under the curve" → y is now strength, so the area grows to the right with the strength;
  "maybe y should measure strength not flex" → it does. F2.11 (the pick, and the transition: the payoff line hands to "You
  don't have to pick"), F14.5 (title says fallacy).

## b05_nopick (night, settle 11): "You don't have to pick"  [most important: CHECKPOINT1]
- First frame (G9): the header YOU DON'T HAVE TO PICK and the chart with the plain wall's line already drawn: never the
  question alone.
- Problem (one beat, same comparison as the fallacy): the plain wall's line: strength only by adding weight.
- Demonstration (M1, M3): two parts that hold the same press, side by side: a solid plane and triangles sized to their force
  (filleted, F9.27). A press bar loads both to 67 N (the solid plane's break, about the hardest squeeze a hand gives); both
  hold exactly that (the same strength). They hang on a balance (callback to the fallacy's scale): the solid plane 0.28 g,
  the triangles 0.15 g: the beam tips to the plain wall. Then Theseus's own line (blue) draws on the chart through the
  triangles' point: at every weight, about twice the press per gram (455 against 244 N per g).
- The pointer drags the weight: both parts' sheets thicken and thin in oblique view, both points ride their lines, the gap
  holding: "at every weight".
- Headline: verdict "0.28 g → 0.15 g", "−46 % WEIGHT, SAME STRENGTH"; a line "or 1.9× the press at the same weight".
- Beats: 0 s header + chart with the grey line + both parts unloaded; 0.8 to 3.0 s the press loads both to 67 N (stress colours
  grow with the load; the plane's peak red, the triangles calm); 3.2 to 4.6 s the balance tips; 4.8 to 6.2 s Theseus's line
  draws; 6.4 to 8.0 s the drag; 8.2 s verdict; settle 11.
- Hand-off: in from the fallacy's line; out: the solid plane's red peak, unexplained here, is b05_hotspot's subject.
- Answers (shlNoPick, 3/10): "shouldn't be the only thing on the screen for a start animation, it should just be the header"
  → the title is the header on frame one, with the chart under it; "it makes me worry you're missing my other feedback" →
  every note on the slides this replaces is answered clause by clause here and on its neighbours; "i have all the same
  comparisons here as the last slide" → it keeps the fallacy slide's comparison (the plain wall's line) and adds what the
  fallacy slide doesn't have: Theseus's method; "this graph feels even more intuitive at a glance" → the graph is rebuilt
  (read as "less intuitive"): two straight lines, strength up, weight across; "our method should have a separate line" →
  Theseus's own blue line; "i genuinely have no idea what it's show graphically" → the demonstration says it before the
  chart: same strength, the balance tips, 46 % less weight. shlShell3d (2/10): "hard to understand" → the 3D study is not on
  this slide (2D frames, plain); "cut the strength graphs that last multiple slides" → the shell meter is gone from the
  chapter; no chart recurs (the fallacy line is redrawn as this clip's own first beat). F2.09: the meter part is cut per his
  later note; "triangles help more on a lighter mouse" is b06_light. F2.11, F14.5, F33.5.

## b05_hotspot (paper, settle 11): "Stress hotspots"
- Problem: a solid flat panel piles the press into one hot spot under the finger; it cracks there while the rest idles.
  Rival: a plain solid wall.
- Demonstration: the solid plane, pressed by a fingertip (the press growing to 67 N); its stress grows with the load
  (heat colours, the peak red); the camera pushes into the hot spot (ink ring, "one hot spot"); a crack opens there.
  Then milling (M2 causal): a thicker blank (0.96 mm sheet against the plane's 0.44 mm, end views drawn) has triangles cut
  out of it, the weight counter falling 0.60 → 0.22 g; the same fingertip, the same 67 N: the stress spreads through every
  member, peak 33 % lower, it holds.
- Weights (his note): "Solid: 0.28 g. Milled out: 0.22 g (−20 %), and 33 % lower peak": a milled-out part stronger than a
  solid one, said in a sentence on the slide ("cut material out, and it gets stronger").
- Headline: verdict "17.8 → 11.9 MPa" Peak experienced stress (lower is better), "−33 % PEAK, −20 % WEIGHT".
- Beats: 0 s header + the solid plane under the finger; 0.6 to 3.0 s the press, the hot spot grows (problem ~1 s); 3.2 to 4.4 s
  the push-in, the crack; 4.8 to 6.4 s the milling; 6.6 to 8.0 s the same press on the milled part; 8.2 s verdict; settle 11.
- Answers (shlHotspot, 8/10): "show the weight of the 2 parts" → 0.28 g and 0.22 g on the parts, the counter falling as it is
  milled; "to tie into how a milled out part can be stronger a solid part, point this out" → the sentence on the slide and
  the verdict. F2.10 (hotspots, one break point, the rest wasted).

## b05_margin (night, settle 12): "The peak decides the break"
- Problem: a part breaks where its peak reaches the material's strength (120 MPa, F12.12), not at its average: the solid
  wall's hot spot spends its margin while the rest idles.
- Classroom (F33.8): Bates & Dean 2024: a 25 mm strip of printer paper; two hands pull, the gauge climbs to 35 N (as hard as
  students could pull): it holds (it needs 95 N). A 5 mm nick is cut at the edge (80 % of the paper left): the same pull
  tears it at about 33 N, from the nick. The stress drawn in the paper: even when whole, piled red at the nick's tip.
- Then the mouse: "the solid wall's hot spot is the nick": both parts at the same weight under a press that climbs; each has a
  gauge, peak against 120 MPa, with the margin left in words ("left before it breaks"). At 67 N the solid plane's gauge hits
  the line and it cracks; the triangles' gauge reads 64 MPa: 46 % left. "Peak experienced stress (lower is better)".
- Headline: verdict "0 % → 46 % margin left" at the press that breaks the solid wall; line "holds to 126 N, 1.9×".
- Beats: 0 s header + the paper strip in two hands, gauge; 0.4 to 2.0 s the pull to 35 N, holds; 2.2 s the nick; 2.6 to 3.8 s
  the pull, tear at 33 N; 4.4 to 7.6 s the press on both parts, gauges climbing, the crack; 8.0 s verdict; settle 12.
- Answers (shlMargin, 2/10): "really hard to understand" → taught with paper first (a nick, a tear), then the same idea in the
  part with two gauges and plain words; "probably important" → given the classroom demonstration and the margin in a
  headline (F33.5). F2.10, F9.23 (the risk of breakage shown: the margin), F12.12 (120 MPa).

## b05_work (paper, settle 12): "Putting that weight to work"
- Problem: in a solid part most of the weight idles: press it, and only 18 % of it carries the load.
- Demonstration: the three parts at the same weight (solid plane, triangles all one size, triangles sized to their force),
  the same press; every gram stood up by how hard it works (the 52-cell bars from the old slide, kept: he rated it 8), the
  cut at half its own peak: 18 %, 25 %, 90 %. The levers between them drawn as steps: "triangles: the press runs along the
  members" (18 → 25 %), "size each member to its force" (25 → 90 %).
- More information (his note): the design choices this reasoning drives, each a small drawing with where the film shows it:
  triangles, not hexagons (b06_lattice); arches (b06_arch); fillets, so no corner idles the rest (b06_filletsize); fibres
  along the load (b06_fibres); walls thicker near the bottom where the force is (#93); the whole board as a tie (b07_board).
  In weight: "of every 10 g: 1.8 g works in a solid plane, 9 g in sized triangles".
- Headline: verdict "18 % → 90 %", "5× THE WEIGHT AT WORK".
- Beats: 0 s header + three parts + empty bars; 0.6 to 4.0 s the press, the bars rise row by row; 4.4 to 6.0 s the two levers;
  6.4 s verdict; 7.0 to 9.6 s the design choices; settle 12. The last frame lights "Triangles, not hexagons" as the first
  choice: b06_lattice is next.
- Answers (shlWork, 8/10): "tie this into how we designed the structure more" → the six design choices it drives, each with
  its drawing; "this page could be sized to have more information" → the choices strip and the 10 g line; "this example is
  part of the reasoning for a lot of design choices" → said on the slide, each choice linked to its slide. F2.10 (the grams a
  force acts on), F14.7 (his title), F33.5.

## Shared bits I write in 30-b05-shell.js (kit gaps, under b05_)
- b05_strip(…): a strip on two supports bent as a beam (Hermite), with thickness, fill colour, heat optional.
- b05_balance(…): a beam balance with two pans that tips by weight difference (damped spring).
- b05_oblique(…): a 2D frame drawn with a little depth (sheet thickness visible): front face + offset back edges.
- b05_cavity(…): the mold cavity section with melt front and frozen skins.
- b05_paperStrip(…): the paper with stress field and a nick, tearing.
- b05_ruler(…): the ruler cantilever, flat or on edge.
- b05_bump(…): a small bump chart.
Everything else from the kit (verdict, finger, forceArrow, spring, establish, mouseSimple, demoPanel, scaleNote, abSplit,
wipeTo, chapterCard2, ledger) once KIT.md lands.

## Questions for Brock (to put in the report as options)
- Fallacy pair: RTINGS calls the GPX 2's build "better and much more consistent" than its ULX Competition unit; the slide shows
  TechPowerUp's GPX 2 creak and Periview's ULX solid sides, and never claims the ULX is better built overall. OK / also show
  RTINGS' unit / drop the ULX and use the Sora V2 ("feels solid", RTINGS) as the light mouse.
- Cubed: the ULX's two verdicts as the symptom of unit-to-unit scatter: keep / anonymise / drop.

## Research gaps (web-search budget spent at ~08:00; each: the query to run, and the slide it feeds)
- G1, feeds b05_material (scale note for 2 N): "about a phone's weight" is common knowledge, unsourced.
  Query: "iPhone 16 Pro weight 199 g tech specs site:apple.com".
- G2, feeds b05_material (rival line "ABS, what most mice are made of"): now framed as Brock's baseline (his doc #5, F2.01) with
  Finalmouse's own benchmark against ABS (b05Fm). Query: "gaming mouse shell material ABS polycarbonate survey list of mice".
- G3, feeds b05_margin / b05_nopick (a lighter human scale): "a resting palm, about 4 N" needs hand mass as % of body mass.
  Query: "hand segment mass percent of body mass Dempster Winter biomechanics 0.6 %".
- G4, feeds b05_nopick / b05_margin / b05_hotspot scale notes: gaming grip forces (peak squeeze in FPS play) to replace the
  office figures (Johnson 2000: 0.43 N mean, about 72 N max derived). Query: "gaming mouse grip force newtons FPS measured".
- G5, feeds b05_hotspot (real-world "milled out of a thick plate is stronger"): NASA isogrid handbook CR-124075 (McDonnell
  Douglas 1973) could not be fetched. Query: "NASA CR-124075 isogrid design handbook pdf ntrs".

## Models and conventions checked (08:50, per common.md "Added 08:45")
- **FILM F4, the shared test strip (b06's B06_STRIP, 60 mm, ribs 1.0 × 2.0 mm, zoned joints) at 10 N:** scripts/f4-strip.js
  reads b06's own code. Triangles 0.4606 g: flex 0.0352 mm, break 156.5 N; solid plane same weight (0.731 mm thick): flex
  0.0487 mm, break 181.7 N (the plane is stronger under F41.1: 0.86×); triangles 1.38× stiffer, same flex at 0.723× weight
  (−27 %); press to flex 0.1 mm: plane 20.5 N, triangles 28.4 N (b06_light's 28 N chains). Sized (same weight, b06_zones):
  break 236.4 N (1.30×), at the plane's break uses 76.8 % (23 % left), at 0.85× weight 90 %; mean use / peak: 25.0 / 46.0 /
  69.5 %. The page computes the same in b05_fr() (B05_INFO kept off b06's shared objects).
- **F41.1 two strengths (Brock, 08:58; integrator 09:15):** every member judged by σ_axial/120 + σ_bending/207 (M's
  t-crit.js). scripts/fix-f41.js: plane 109.0 N, one size 93.9 N (0.86×: loses), sized 147.8 N (1.356×; same press at
  0.737× weight). Mean share used / peak share: plane 25.0 %, one size 45.9 %, sized 72.3 %. Stiffness: sized 1.26×, one
  size 1.06× the plane. Strips use bending strengths: PP 207, ABS 82 (Denka, ISO 178), PC 97 (Makrolon 2405, ISO 178), FR4
  552 (Gund/NEMA), Mg 230 / Al 310 (ultimate; yields 150 / 276). Ranking at one weight in strength: PP 23.0, FR4 18.3,
  ABS 8.4, Mg 8.0, PC 7.6, Al 4.8 N.
- **Review M-b05-1 to 5 and B05_W/B05_C (review/b05.md, 08:45), acted on (replies under each finding):** crack force from
  r.smax (63 / 89 / 120 N); Theseus = one-size triangles (89 N, 1.4×, −29 %); "a solid plane", "pressed on its edge", the
  principle in 2D, no hand-squeeze tie; specific: "bent, at one weight", Mg gives at 5.2 N / cracks at 8.0 N; wall: both Mg
  floors named (0.7 typical, 0.5 small parts), 12.6 g / +26 %. Script: scripts/fix-m1.js. Still to do: b05_work (mean
  stress share 25 / 42 / 56 %, no feEngaged), b05_cubed ("a mold's tolerance (Protolabs)").
- **2D frames, shlHot (10-d-shell.js, 07-sim.js)** used by nopick, hotspot, margin, work. Units mm / N / MPa / g: checked.
  Physics: Euler-Bernoulli frames, rigid joints, linear, small deflection; load 10 N at the top-middle node; pin + roller.
  - The plane is one line of beam elements at mid-depth (span/depth 5.8: a deep beam, shear flex ignored, ~10 % too stiff;
    the same simplification as the truss's members, so the comparison is fair). Its peak is sampled at 15/16 of the half
    depth: 17.8 MPa against beam theory's 19.0 (−6 %): the model favours the plain wall slightly. Verdict: usable, conservative
    for Theseus.
  - Masses: truss Σ ρ·b·h·L with equal member lengths, sizing keeps Σh: equal mass (0.2763 g) confirmed in node; the plane's
    out-of-page width 0.439 mm set to the same mass. Verdict: equal weight holds.
  - Break press = 120 MPa ÷ peak × 10 N (linear, F12.12 tensile strength). Buckling checked by hand: the top chord at 126 N
    carries ~182 N; in-plane Euler (K 0.7) ~900+ N; out-of-plane, as a free 1.2 mm sheet, 279 N: fine at the solved weight.
    BUT at 0.536× weight (the "same strength at 46 % less weight" point) a free-standing 0.64 mm sheet would buckle out of
    plane at ~43 N, below 67 N. In the shell the ribs are carried by the wall, so out-of-plane buckling is not the failure
    mode; the 2D model's out-of-page width is a scale on the section, not a free sheet. Verdict: the −46 % line is valid as a
    lattice wall's section; nopick labels the model "2D frames" and must not draw the lighter part as a free sheet (it doesn't).
  - "Weight that works" = share of material ≥ half its own peak (old shlWork's definition): a convention, said on b05_work.
  - The old captions said "1.9×"; the true ratio is 1.865: printed "1.8×" (rounded toward zero, DESIGN §9).
- **Beam formulas** (b05_sag, b05_gives, b05_stress): three-point bending, δ = PL³/48EI, σ = PLc/4I; checked against
  numbers.js. Large-deflection error: PC's 7.7 mm sag on a 60 mm span (13 %) is over the small-deflection range (shows PC a
  little worse than reality); PC appears only as a value in the bump chart. Verdict: fine; noted.
- **Material data** (B05_MAT): each value re-read from the SRC entry it cites (shlPyrofil, shlAbs, shlPc, shlMg, shlAl,
  shlFr4). Convention: the plastics' flexural modulus vs the metals' elastic modulus (equivalent for isotropic metals; a
  flexural modulus is close to the tensile one for these resins); strength: PP-C-20A and FR4 at break, ABS and PC at yield,
  the metals at their UTS (their yield is lower), so the comparison is generous to the rivals; PP-C-20A at its tensile 120
  MPa, not its 207 MPa bending strength (F12.12). Verdict: fair, rivals favoured.
- **Old shlSpecific's 5-column bump and its E^(1/3)/ρ column**: replaced by the same-weight strip test, which gives the same
  ranking (E·t³ at fixed weight ∝ (E^⅓/ρ)³; σ·t² ∝ (σ^½/ρ)²): checked equal orders in numbers.js. Verdict: consistent.
- **Old thinwall's "σ/ρ² bending strength at equal mass" and SHL_TOLDOTS (±0.05 mm at 3σ, unsourced)**: not reused. The
  tolerance now is Protolabs' ±0.076 mm (sourced); the stiffness swing uses the cube, which is the upper bound (a wall
  bending under a finger); a whole shell's stiffness grows with mass^2.37 (the 3D study), so the slide says "a wall's".
- **The old shell meter (10-d-0-meter.js)**: not used (his note). shellHL / shellBA: not used (the kit's verdict).
- **Johnson 2000 → "hardest squeeze ≈ 72 N"**: derived as mean ÷ %MVC (0.43 N ÷ 0.006); valid if the MVC was the same side
  grip (the study reports it per force type). Labelled "derived" on the slide.
- **RTINGS weights** (mice.json): measured, cited as RTINGS; GPX 2 59.4 g, ULX Competition 37.9 g.
- **Old shlPick's mice list** called the GPX 2's build "much more consistent" (RTINGS): not reused (his note).
