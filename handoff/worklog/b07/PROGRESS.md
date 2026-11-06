# b07 PROGRESS (Shell III and Shape: the board, the build, the hand)

File: deck/src/30-b07-board-shape.js. Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b07 --own=30-b07-board-shape.js`
Check: `export NODE_PATH=/opt/npm-tools/node_modules; Q='&2d=1'` then errs.js / qa.js (T=settle, T=mid) / shoot.js (PAR=1).
Neighbours: `b06_mold` → **b07_board, b07_arms, b07_tolerance, b07_poron, b07_sheet** → `b08_card` … `b10_software` →
**b07_shcard, b07_newton, b07_sides, b07_size, b07_emg, b07_balance** → `b11_card`.
My scripts: /home/claude/work/b07/tools/evalpage.js (evaluate JS in the built deck), scripts/glbcom.py (GLB centroids),
scripts/ansur.py (ANSUR II percentiles; data in dl_ansur/).

## Status
- [x] Phase A reading: common.md, b07-brief, FEEDBACK (all), REVAMP, DESIGN, the old slides (10-d3-board.js shlPcbRib/
      shcCarry/shcArms/mass; 10-d-shell.js shlPcbRib(orig)/shlStructs/tolerance/mass(orig)/grind; 10-d2-arches.js shbSides;
      12-20-shell.js shlsheet2; 10-g-shape.js shapecard/shp_newton/size/emg), Brock's doc + comments, the G-Wolves photos.
- [x] Phase A research (below). Web-search budget for the turn ran out at the end; enough was gathered.
- [x] Storyboards (below)
- [x] KIT.md landed 08:03. Phase B running.
- [x] b07_tolerance built and checked (errs ok, qa clean settle+mid, frames looked at incl. phone): CHECKPOINT1.md written.
- [x] b07_arms built and checked (errs ok, qa clean settle+mid, frames 3.4/4.4/11 looked at: arms_f.jpg). Snapped arm
      detaches at 3.35 s; scale note and verdict re-laid out in the right column; source one line.
- [x] b07_board built and checked (errs ok, qa clean settle+mid, frames 0/1.2/3/4.9/6.8/8.2/11 and phone looked at:
      board_c.jpg, board_phone.jpg). PHYSICS CORRECTION found while building: under the grip squeeze the feet slide
      INWARD (−0.68 mm, the soft rim lets them come closer; the crown rises 0.26), they do not spread (spreading is the
      crown press). Narration, tags and labels say "feet slide inward", "the sides come in"; the board holds the feet
      apart (anchored ribs). Fingers dropped (end-on they read as ear muffs); 10 N arrows carry the squeeze.
- [x] File order fixed: b07_board, b07_arms, b07_tolerance blocks now in film order in the file (poron, sheet next; shape
      slides after; b07_shcard will get first: true). b07_arms ideas now [94] (91 is the side-button board, not shown).
- [x] Standing rules (08:45 broadcast) applied so far: no hard-coded greys left in my file (tokens + MT palette);
      b07_tolerance frame one now shows the gauge with two coins (t0 −1); b07_arms frame one shows the mouse (establish
      at 0). Review file /home/claude/work/review/b07.md: not present yet (checked 08:4x); re-check before each slide.
- [x] b07_balance built and checked (errs ok, qa clean settle+mid, frames 0/2.4/4.4/6.8/7.2/9.2/12: bal_b/c/d.jpg). Two
      kitchen scales under the skates; parts land with their weights, the balance point moves with a trail; battery last
      evens the scales 14.6 / 14.7 g (0.4 mm behind the middle, F30.10); then the battery dragged into the hump: lever
      3.48 mm, it rocks; back down: 0.06 mm, stays flat; verdict 3.48 → 0.06 mm, −98 % twist. Battery from KEY_PARTS.
- [x] b07_newton built and checked (McCloskey tube in the classroom panel from frame one; three illustrative profiles,
      a fingertip following each; rate-of-turn plots with the 25 °/mm line (ℓ = m·v²/F, 10 g, 0.5 m/s, 1.1 N, 2.27 mm,
      illustrative); verdict 66 → 14 °/mm "Under the 25 °/mm a finger follows"). qa clean.
- [x] b07_sides built and checked (Bhatia sheet demo; real hump section mirror-averaged; 10 N each side mirrored; heat on
      the plain wall; band on both low sides; top view with both bands; verdict flex 0.11 → 0.08 mm "against spreading it
      evenly", same added weight). qa clean.
- [x] Audit/critic fixes (09:0x–09:2x): arms reworked to lead with stiffness (squeeze walked along the board, chart, verdict
      softest spot 51 → 42 µm; no squeeze strength claim; "A drop isn't modelled"); one arm length 6.5 mm in both models;
      tab FR4 crosswise 18 GPa / 483 MPa (Gund, b07Fr4Flex): 0.38 mm; balance one decimal, "At the grip, within half a
      millimetre"; board source "Stiffness only"; tolerance per-part wording (scatter); shared boardMM (Theseus) / grey
      plate (rival) and pcbSec for the section; F20 wording ("Makers stiffen..."); G-Wolves HTS Plus Pro / Warg rod named.
- [x] b07_poron built and checked (TU Delft tray on a spring, one-mass stick-slip sim; three contacts magnified: dry
      sawtooth with creak bursts, grease smooth then "months later" sawtooth again, Poron pad shears, smooth; verdict 5 → 0
      slips "Silent for a few square millimetres of foam"; PORON 4701-30 scale note; shared pcbSec board). qa clean.
- [x] b07_size, b07_emg, b07_sheet, b07_shcard built and checked (qa clean settle+mid). b07_size answers the chapter's
      flagship (X2F CrazyLight cut to 87.5 mm) with one ruler (ANSUR II hands, flagships' lengths), his rule verbatim,
      Oude Hengel 2008 (an 87 mm mouse raised big hands' extensor load up to 5.5 % MVC), verdict 87.5 → 119.3 mm.
      b07_emg: Wang 2023 levels vs Jonsson, Tang 2023 ranking (no invented bar heights), the three-measure protocol.
      b07_sheet: PPS triggers (−22 % weight vs Mg, densities), graded walls (−37 % flex, same weight), joined struts
      (−16 % sink, peak +13 % said). b07_shcard: chapterCard2 (LEDGER compromise, flagship line from b01 in the full build).
- [x] F42.1/F42.2/F44.2 applied: balance on H1's model (board CoM from parts 21.69/4.93, whole shell at the body
      centroid), battery at the decided place (z −19.05, 1.5 mm up) until H2 moves KEY_PARTS (then it follows), side
      switches 1.0 g out of the shell (9.35 g): CoM 0.6 mm ahead of the middle, 0.6 mm above the grip → "within a
      millimetre"; board printed as a 5.6 g target. 10 N = "a hard press" wording (BROADCAST-0945).
- [x] FINAL CHECK (all 11): errs ok; qa clean at settle and mid; frame one shows the subject on every slide
      (frame0_all.jpg); settle sheet settle_all.jpg.
- Then: report (SubagentHandback). → b07_sides → b07_poron → b07_size → b07_emg → b07_sheet → b07_shcard. Check
      /home/claude/work/research/FILLS.md before each slide that needs a number (gaps below).
- KIT changes seen 08:25: establish faster defaults; finger view 'end'; mouseSimple option hide; LEDGER shape compromise
  "Shapes chosen by taste, not measured"; (integrator 08:40) mouseSimple at the scan's proportions 119.2 × 62.5 × 38.1
  (MS_DIMS): use msAt/msBox/MS_DIMS, never literal heights; say Theseus's 119.3 × 62.4 × 39.9 in words (THS.dims). H1 will
  add KEY_PARTS in 03-parts.js (mouseSimple reads it; MS_BATTERY may go): b07_battZ must read KEY_PARTS first.
- (old note) KIT.md landed? — was NOT YET at 08:1x (06-motion.js exists, API read: mouseSimple,
      establish/locator, finger, forceArrow, abSplit/wipeTo, verdict, demoPanel, scaleNote, SCALE, LEDGER, chapterCard2)
- [x] Models written in deck/src/30-b07-board-shape.js and checked in page (tools/evalpage.js): see "Model results".
- [ ] Phase B. Order (most important first, F33.5 lists `tolerance` and `shcArms`): b07_tolerance → b07_arms → b07_board →
      b07_balance → b07_newton → b07_sides → b07_poron → b07_size → b07_emg → b07_sheet → b07_shcard. CHECKPOINT1.md after
      b07_tolerance.

## Research (sources to add to SRC, with keys)
- **FR-4 is a woven composite**: Wikipedia "FR-4": "a NEMA grade designation for glass-reinforced epoxy laminate material";
  "a composite material composed of woven fiberglass cloth with an epoxy resin binder that is flame resistant"; NEMA LI 1-1998;
  1.850 g/cm³; flexural > 415 MPa LW; E 24 GPa LW. Carbon fibre (CFRP) = the same recipe with carbon cloth. (b07Fr4Wiki)
- FR4 tensile 430 MPa LW, 1.85 g/cm³ (deck's `shlFr4`, Gund; the Gund PDF fetch was blocked today, keep the vetted entry).
  AZ91D-F 230 MPa UTS, 150 yield, 44.8 GPa, 1.81 (`shlMg`). Same-weight pull, 50 mm strips: FR4 4,300 N vs Mg 2,351 N = 1.83×.
- **Carbon fibre in mice costs money and parts**: Corsair Sabre v2 Pro Wireless CF, top shell + buttons + sides carbon fibre,
  55 g, $199.99, "roughly half as much" for the plastic Sabre v2 Pro (~$100) (Tom's Hardware review); Mg version $150.
  ROG Harpe Ace Extreme: carbon fibre composite shell, 47 g vs 54 g, "crafting them from individual pieces of carbon fibre"
  (PC Gamer). No shipping mouse with bonded carbon *rods* was found: the rod is Brock's own example of the added-stiffener
  approach; shown generically, not attributed to a brand.
- **G-Wolves arms**: TechPowerUp Hati-S Plus 4K (2023) "the main PCB, which has been extended at the sides to help with shell
  rigidity"; Hati-R 8K (2024) "extended such that it supports structural rigidity of the shell" (deck `shcTpuHati`,
  `shcTpuHatiR`). Brock's photo (gwolves-board-in-lattice-shell.png, cropped): blue board in a black hexagon-lattice shell,
  ~6 narrow rectangular FR4 tabs (≈3.5–4 mm wide, 5–8 mm long) on both long edges reaching under the shell rim, **square
  (unfilleted) roots**, white silkscreen corner marks at the tips, some with a small locating hole near the tip; the rear of
  the board is a frame round the battery (YJ601530 250 mAh) with big round lightening holes and four screw bosses. Second
  photo: a black lattice part with a slender arm (screw eye, ring, windowed box, two gussets). Brock: arms on his HTS Ultra
  broke in shipping (F6.3).
- **Old FE (10-d3-board.js shcBoard, solved in page)**: crown press 10 N: crown flex none 0.141 / arms 0.103 / whole 0.101 mm
  (whole −29 %); arch-feet spread none 0.192 / arms 0.0108 / whole 0.0015 mm; FR4 peak arms 2.87 MPa (at a root) vs whole
  0.160 MPa = **17.9×**; one 8.7 mm arm, fixed-guided: 757 MPa per mm of tip movement, snaps at 0.64–0.73 mm (483–552 MPa).
- **Tolerance stack-up law**: F. Scholz, "Tolerance Stack Analysis Methods: A Critical Review", Boeing, Nov 1995 (UW
  faculty page): worst case T = Σ|aᵢ|Tᵢ ("a straight sum ... arithmetic tolerance stacking", "every assembly ... will fit
  with mathematical certainty"); RSS T = √(Σ aᵢ²Tᵢ²) ("the well known RSS-formula"); assumptions: random, independent ("the
  most essential corner stone"), normal, centred, Tᵢ = 3σᵢ; "99.73 % ... only .27 % of all assemblies will fail". Shraim &
  Littell, ASEE 2019 (capstone teaching): "% contribution of variation by each component" (the share Tᵢ²/ΣTⱼ²).
- Real tolerances in a mouse: Omron D2F-F operating position 5.5 ± 0.3 mm (datasheet); FR4 board ±10 % (≥1.0 mm) / ±0.1 mm
  (<1.0 mm) (JLCPCB capabilities; Eurocircuits: base material ±10 %, IPC-A-600); Protolabs mould tolerance ±0.003 in
  (0.076 mm) plus resin ≥ ±0.002 in/in. Starlight X: "three components instead of the previous four-part assembly"
  (`shlB2gSlx`). Brock #57: rim, hump and sides one part, "vastly reducing the amount of crucial tolerance points and
  panel gaps". Coins: US Mint publishes nominal thickness only (quarter 1.75 mm, no tolerance), so the coin demo uses
  relative error, not a coin spec.
- **Stick-slip (creak)**: TU Delft ShowingPhysics, demo 17.5 "Stick-slip motion" (Ineke Frederik): a tray pulled by a
  spring "will jump ahead, stand still, jump ahead"; "Kinetic friction is smaller than the static friction"; examples: chalk
  screech, brakes, violin bow, earthquakes. Rogers PORON gap filling: "fill gaps caused by variations in manufacturing
  tolerances"; low compression set; "a very consistent level of force across a range of compressions". PORON 4701-30:
  240–400 kg/m³, 21–62 kPa at 25 % (`poron4701`). Creak complaints: Razer Insider threads (Viper Ultimate, DeathAdder V2
  Pro); RTINGS ULX "flexes and creaks with pressure" (`shlRtingsSoraUlx`). Brock's comments: Josh: a very thin Poron layer
  at the contact points "would add maybe half a gram ... a force break much better than a lubricant"; Brock: "lube ... just
  makes them less noticeable by quieting the scraping. a small poron pads would ... mechanically solve the issue". Brock
  #96: newer ULX batches lubed with Krytox 205. No public source for the G-Wolves Poron mod: Brock's own note (no tag, F9.5).
- **Newton**: McCloskey, Caramazza & Green (1980) "Curvilinear motion in the absence of external forces", Science 210:
  1139–1141: the curved-tube problem; the Newtonian answer is a straight line on exit (most people draw a curve). Brock's
  doc: "you can take the derivative of the line at the edge and see if it points off the mouse or not".
- **Curvature stiffens a sheet**: Aatish Bhatia, "How a 19th Century Math Genius Taught Us the Best Way to Hold a Pizza
  Slice", Empirical Zeal (Wired), 5 Sep 2014: "Dangle a sheet of paper and it flops over, but give it a fold and it becomes
  stiff"; "By curving a sheet in one direction, you force it to become stiff in the other direction" (Gauss).
- **Hands**: ANSUR II public data (US Army 2012), full public sample: men n 4,082, hand length mean 193.3 mm (SD 9.9; 5th
  177, 50th 193, 95th 210), breadth 88.3; women n 1,986, 181.1 mm (5th 165, 95th 199), breadth 78.2. Matches Brock's
  "average male hand size is 19.3x8.9". Lengths (makers): Viper V4 Pro 127.1, GPX2 125.0, SLX 124.8, ULX 121.3, Sora V2
  119.2, Theseus 119.3 (shortest flagship). Note Theseus is 39.9 mm tall (as tall as the V4 Pro): the flatter-mouse line is
  quoted as his hypothesis, not as a claim that Theseus is flatter.
- **EMG**: Wang et al. 2023, Int J Ind Ergon 97:103493 (16 pro gamers, Overwatch 10 min): static (APDF10) %MVC ED 5.09/5.41,
  ECR 5.89/5.44 (wireless/wired); median ED 8.0/8.6, ECR 9.3/9.2; Jonsson: static load "should not exceed 2% MVC and must
  not exceed 5% MVC" for an hour or more; ED and ECR above 5 %. Tang 2023 (icSPORTS, NTSU): 16 elite players, five ZOWIE
  shapes (FK1, FK1+, FK2, S1, S2), click rate the same (6.35–6.37 clicks/s, p > .05), wrist-extensor EMG "S2 and F1 is lower
  than S1 (p<.05)". Li & Wang 2025 (AHFE): peak moved 5 mm four ways on a scanned GPW3, FDI/ED/ECRL iEMG no significant
  difference, comfort ratings differed. ZOWIE U2 page: EMG and motion capture; thumb angle affects firing rate; force
  difference between the hand's two sides "less than 10%". Brock #45: "Currently Zowie is the only company to take the
  Sports Science of shape design seriously enough to do this."
- **Balance**: Brock #95 "There is consensus among enthusiasts that a lower vertical center of mass is better". Higher-battery
  arguments found are weak (retailer blogs; periview.gg: Zeromouse's rear battery "makes the mouse feel lighter when
  pivoting"; Notebookcheck: V35 "relocates the battery to reduce the moment arm"). The honest physics, used on the slide:
  twist in a flick = m·a·(h_CoM − h_grip): the best CoM height is where the hand holds. A palm grip high on the hump argues
  for a higher battery; a grip on low sides (Theseus's flat low sides, 12 mm) argues for a low one.
  3D-derived mass model (scripts/glbcom.py on 3d/shell/shell-theseus-1seam.glb, frame +X user-left, +Y up, +Z forward):
  body vol 12,166 mm³, centroid z −10.41, y 16.44; triggers z 31.97, y 22.05; wheel bay z 36.0, y 13.2; wheel centre z 34.87,
  y 17.03; screws z ±17/−24. Plan-5 board (3d/pcb/plans/outline_v5.json): x ±19.03, z −7.61…51.45, area 1,968 mm², centroid
  z 21.97; sensor z 19.45 (was 1.12), MCU 4.8. Budget (shcBudget): shell 10.35, buttons 3.33, board 5.6, battery 8 (LP402535JU),
  wheel 1.02, screws 0.42, inserts 0.52, wires 0.08 = 29.31 g.
  Plan CoM z: battery at its old place (z −22.7) → +0.7 mm; moved back 2.23 mm (H1 plan) → +0.1 mm: **at the centre**.
  Height: battery at board height in the tail (7.46) → CoM 12.06 mm (grip 12): lever 0.06; battery in the hump (20) → 15.48:
  lever 3.48 → **−98 % twist**. (To recompute in-page from shared positions when H1 lands.)
- Blocked/unavailable: the Gund FR4 PDF (fetch refused); web search budget exhausted near the end of phase A.

## Storyboards (beats in s; settle = the held finished frame)

### 1. b07_board (shell, night) "The board you already carry" — settle 11
Problem: a light shell flexes under a press; most flagships stiffen it with added stiff material: a carbon fibre or magnesium
shell (Sabre v2 Pro CF $199.99 vs ~$100 plastic), or a bonded carbon rod (Brock's example): one more part, more weight, and
more joints to tolerance. The board (5.6 g, every mouse carries one) sits there as dead weight.
- 0.0: header + lead; the section across the hump (front view, real section SHB_SEC/SHC_SEC, kit style) with the board seen
  edge-on at its foot, lit; small locator (kit) showing where the cut is.
- 0.6–2.4: a hand press (finger/palm, `forceArrow` 10 N, "about a 1 kg bag of sugar") on the crown: the arch's feet spread
  (arrows at the feet, drawn ×exaggeration), the crown sinks: a dial reads the sink.
- 2.4–4.0: the rival's fix: a carbon rod drops in across the feet (grey, "added part"): two bonded joints flagged (their gap
  tolerance, ±), "+1 part"; caption names the paid route (CF/Mg shells, Tom's Hardware).
- 4.0–6.0: "FR4 is the same kind of material": push in to the board's edge, the edge opens into its layers: woven glass
  cloth in epoxy; beside it the carbon cloth (same weave, black): "the same recipe" (Wikipedia FR-4). Inset (`demoPanel`):
  the same weight of each, pulled: magnesium snaps at 2,350 N, FR4 holds to 4,300 N: 1.8× (Gund; MatWeb).
- 6.0–8.0: the rod fades out (wipe), the side ribs land on the board's edge (blue ties, filleted): the same press: the feet
  stay put, the crown sinks less: dial 0.141 → 0.101 (model). Verdict: −29 % flex, "+0 g, no added part".
- 8–11: hold; source line names the model (2D frames, CF-PP 13.5 GPa, FR4 19 GPa, 10 N crown).
Headline: −29 % FLEX (+0 g, no added part). Secondary: 1.8× magnesium's strength at the same weight.
Deflection test (shlStructs): folded in only as the dial under a named human load (10 N, a 1 kg bag of sugar), in mm of sink;
no "N/mm" in big blue. If it doesn't read cleanly at phone size, drop it and say so in answers.
Hand-off in: b06_mold ends on ribs and fillets; I open on the ribs' feet ("ribs need something to hold their feet").
Hand-off out: ends on the board tied by every rib, top locator → b07_arms opens on the same board from above.
Answers (shlPcbRib 6/10): "unintuitive" → one demonstration on the real section, press → spread → tie; "explain how fr4 is
like carbon fiber because it's also a woven composite" → the edge opens into woven glass in epoxy beside carbon's weave,
words "the same recipe"; "using the pcb is an alternative to having carbon fiber rods" → the rod is shown as the rival fix,
then replaced in place by the board; "doesn't require extra parts with extra tolerancing" → the rod's two joints flagged
with ±, Theseus "no added part, no added tolerance"; "you're just using what you already have" → title, "+0 g". shcCarry
("meg slide", read as "meh") → the square-per-gram grid is gone; its point (5.6 g already carried, +0 g) lives in the
verdict. shlStructs ("viewer will have no idea what that spec means in big blue", "poor setup") → no N/mm in big type; the
measurement is shown as what it is (a press of 10 N, the crown's sink in mm on a dial). F2.26 → strength vs magnesium,
"draw on what you have", the whole board (b07_arms).

### 2. b07_arms (shell, paper) "Small arms snap, the whole board holds" — settle 11
Problem (named, sourced): G-Wolves extends its boards with small FR4 arms to stiffen the shell (TechPowerUp); every load goes
through a few small roots with square corners; Brock's arms broke in shipping.
- 0.0: header + lead; top view: the kit's simplified shell outline with a G-Wolves-style board drawn from his photo (dark
  board, rival yellow arms: 3 narrow tabs per side, square roots, a locating hole in the tip of some, the battery frame with
  round lightening holes). Label "G-Wolves: board extended at the sides" + TechPowerUp line.
- 0.6–3.0: the same press as b07_board (crown, 10 N): stress heat in the plan frame: the arm roots go amber → red; the rest
  of the board cool. Pointer/finger visible.
- 3.0–4.5: a jolt (a drop: the outline shakes, impact ring), the hottest arm's root cracks and the arm snaps (crack line red,
  arm tip falls away). Caption: "My HTS Ultra's arms broke in shipping." Push-in inset on the root: the square corner,
  callback "the Comet's square corners" (b06_fillet).
- 5.0–7.0: wipe to Theseus in place: the plan-5 board outline (shared drawing), every side rib lands along its edge (16 blue
  ties, filleted); the same press; heat stays cool along the whole edge.
- 7.0–8.5: verdict: 18× lower peak (FR4 peak at the root 2.87 → 0.16 MPa per 10 N, "Peak experienced stress (lower is
  better)"); "no arm to snap off".
- 8.5–11 hold.
Model: my own copy of the plan frame (b07_plan), arms where the photo has them (3 per side), 1.0 mm FR4, square roots noted.
Hand-off in: same top view and board as b07_board's end. Out: "no extra part, no extra tolerance" → b07_tolerance.
Answers (shcArms 6/10): "these aren't what the arms or pcb would look like" → drawn from his two photos (narrow square-rooted
tabs on both long edges, tip holes, battery frame with lightening holes, lattice shell round it), described in the source
line; "important idea tho" → kept, led with the failure he lived (shipping break), given the stage. F28.3 → drawn from the
photos, the shipping break shown. F33.5 → one of his important ideas: full demonstration, problem first.

### 3. b07_tolerance (shell, night) "Tolerance stack-up" — settle 13 (most important; CHECKPOINT1)
Problem: every part is a little off its drawing, and a gap adds up the error of every part between its two edges; one badly
made part pushes the whole mouse out (a seam you feel, a creak, a rattle). Most shells are several parts (the Starlight was
four; the Starlight X three). Theseus: rim, hump and sides one body (#57).
- 0.0: header + lead; left `demoPanel` "The classroom version": a slot gauge and a stack of coins already started.
- 0.4–3.0: coins drop one by one (each a slightly different thickness, exaggerated; a ± tick per coin); the stack top wanders
  in the slot; the law types in under it: worst case T = T₁ + T₂ + … + Tₙ (every part at its limit); likely (RSS)
  T = √(T₁² + … + Tₙ²) (Scholz 1995); brackets on the stack show both.
- 3.0–4.6: one bad coin: a coin three times as sloppy replaces one; the likely bracket balloons; "one part, 78 % of the
  error" (its Tᵢ²/ΣTⱼ²).
- 4.6–5.4: the coins morph into simplified mouse parts (kit `mouseSimple` pieces: top shell, bottom shell, side, rim): the
  same stack, now a seam's chain; "every joint is a coin".
- 5.4–9.0: the build line (right, the stage): 2,400 mice built: each one drops as a tiny simplified mouse into the histogram
  of the seam's gap; out-of-allowance ones land red. Rival four-part shell: x % red; one sloppy part among them: y % red.
  Then a wipe: Theseus, two parts in the chain (trigger + one-piece body): the histogram narrows, red ~0.
- 9.0–10.5: verdict: worst case ±0.30 → ±0.15 mm (before → after), out of spec 4.9 % → 0.5 % (example allowance ±0.10 mm,
  each part ±0.076 mm, Protolabs). "And one part's error I can correct once, in the steel."
- 10.5–13 hold.
Numbers (closed form, normal, Tᵢ = 3σ): T = 0.076 mm/part; allowance ±0.10 (example, said so). 4 parts: WC ±0.30, RSS ±0.15,
out 4.9 %; 2 parts: WC ±0.15, RSS ±0.11, out 0.53 %; 1 part: 0.008 %; 4 parts with one at ±0.25: RSS ±0.28, out 29 %, its
share 78 %. Monte Carlo seeded for the drops (2,400 per build) matches.
Hand-off in: b07_arms' "no extra part, no extra tolerance". Out: "the gap that's left is where it rubs" → b07_poron (Rogers:
PORON fills gaps caused by manufacturing tolerances).
Answers (tolerance 7/10): "needs to be explained with some sort of law for more validity" → worst-case and RSS written and
drawn on the coin stack, sourced to Scholz 1995 (Boeing), with the assumptions; "don't show the theseus teardown" → no
exploded Theseus: only coins and simplified generic parts; "improve the diagram" → one stack that becomes the mouse's chain,
one histogram per build on one scale; "the little drops should be simplified mouse parts" → each drop is a tiny simplified
mouse (and the stack is made of simplified parts); "explain how one incorrectly toleranced mouse part ruins a whole mouse"
→ the sloppy coin/part beat: 78 % of the error, 29 % of mice out; "you're on the right track" → kept the seam and the
part-count argument (#57), executed as a demonstration. F33.5, F33.8 (stacked coins).

### 4. b07_poron (shell, paper) "Poron pads, not grease" — settle 11
Problem: where the board meets the shell's post, a squeeze makes them rub: stick-slip, heard as a creak. The common fix,
grease (Krytox on newer ULX batches, Brock), only quiets it until it wears.
- 0.0: header + lead; establish: simplified mouse with the board-to-post contact lit, push in to a section of the board edge
  resting on a shell post (the contact visible), locator in the corner.
- 0.6–3.0: a squeeze (finger + `forceArrow`): the shell flexes, the post drags along the board: it sticks, then slips
  (jumps), a creak mark on each slip; a friction-force trace under it: sawtooth.
- 3.0–4.4: inset `demoPanel`: TU Delft's tray on a spring: jump, stand still, jump (stick-slip; chalk, violin).
- 4.4–5.8: grease: the trace calms; a time-lapse ("months later") brings the slips back as it wears and gathers dust.
- 5.8–8.0: wipe to Theseus: a Poron pad between board and post: the same squeeze: the foam shears and compresses (cells
  squash), nothing slides: the trace flat. The pad also takes up the leftover gap (callback to b07_tolerance; Rogers).
- 8.0–11: verdict: creak → silent, +0.03 g (pads, derived); "factory-fitted: players already add these to their G-Wolves".
Hand-off in: b07_tolerance's leftover gap. Out: → b07_sheet ("the rest of the shell").
Answers (grind 7/10): "factory poron pads" → pads fitted at the factory, title and verdict; "many people already mod there g
wolves mice with these" → said on the slide (his note, no tag); "for where it hits the pcb" → the demonstration is exactly the
board-to-post contact; "to reduce creaking" → the creak (stick-slip) shown, and its absence with the pad.

### 5. b07_sheet (shell, night) "The rest of the shell" — settle 13
Three dense panels, each problem → same input → payoff, focus moving left to right (at most two animate):
(1) PPS triggers (#6): rival magnesium triggers (Starlight's crisp clicks, heavy, the metal shadows the 2.4 GHz radio); CF
    PPS (17 GPa, 1.40 g/cm³): the same trigger shape weighs 23 % less than magnesium, radio passes; vs the shell's CF-PP it is
    26 % stiffer. Demo: the same finger press on both, tip deflection; a radio wave from the antenna stopped by Mg, passing
    PPS; a balance tips.
(2) Graded walls (#93): rival even wall; the same weight graded thicker toward the rim; the same squeeze: deflection −X %
    (SHL_GRADE model copied); "costs nothing to mould, only harder to CAD" (Brock); callback forward to b07_sides.
(3) Joined struts (#53, #55): rival separate floor-to-ceiling struts (Lamzu Maya's front, Brock); joined into an arch to the
    trigger underside; the same press on the low front: solved (feSolve), peak/flex −Y %.
Not on it: the optional plate (later, F27/F12.10), the pro model, the film sticker (he was unsure: asked in the report), the
closed wheel well (#58: Brock asked for it with the other cutout slides; b02_seams carries it — said in answers/report).
Answers (shlsheet2 5/10, no note): rebuilt as three demonstrations; F12.10: the plate panel is out (bottom cover later).

### 6. b07_shcard (shape, night) "A shape measured on hands" — settle 6
Kit `chapterCard2`: compromise "Shapes chosen by taste, not measured" → answer "Measured on hands"; the ledger strip; list:
Newtonian shape analysis; flat low sides, held the same on both; sized against real hands; EMG on every revision; balance at
the centre. Part: the shoulder profile with the push at right angles (the old card's idea), kit style.
Hand-off in from b10_software: "Every setting changes in the browser. The shape can't, so it has to be measured."

### 7. b07_newton (shape, paper) "Newtonian shape analysis" — settle 11
- 0.0: header; `demoPanel` "The classroom version": a curved channel seen from above, a marble rolling in.
- 0.4–2.4: the marble exits straight, along the last direction of the curve (McCloskey 1980); the derivative arrow at the exit.
- 2.4–3.2: establish: mouseSimple front, the shoulder lit, push in to the profile (three illustrative profiles, F21.12).
- 3.2–6.5: a finger follows each profile 1:1: the sharp shoulder (rival: "sharp for looks", Brock #42) throws it off along
  the tangent (red dashed, "off the mouse"); too gentle: nowhere to rest; round but defined: onto the side (blue).
- 6.5–8.5: under each, the rate of change of the slope with the zones (too extreme, defined, too low); peaks in °/mm.
- 8.5–11: verdict "Onto the side, not off it"; "profiles illustrative until the shape is final".
Hand-off out: the finger lands on the side → b07_sides opens on the low sides.

### 8. b07_sides (shape, night) "Flat low sides, held the same on both" — settle 11
- 0.0: header; the real section across the hump (SHB_SEC, from the Theseus shell), sides lit; locator.
- 0.4–2.2: `demoPanel`: a sheet of paper held flat droops; curved, it holds (Bhatia 2014).
- 2.2–3.4: the section: the hump is an arch (rise over span), the low sides nearly flat (bulge over chord).
- 3.4–5.6: thumb and fingers squeeze, equal 10 N each side, mirrored arrows (just for show): the plain wall flexes, red peaks
  on both low sides, symmetric.
- 5.6–7.6: the band: lattice thicker on both low sides (same on both, +10 % weight): the same squeeze: flex and peak drop.
- 7.6–11: verdict: the flex cut per gram vs spreading it evenly (×); from above, both bands, the thumb rest on the left.
Answers (shbSides 4/10): "show equal pressure on both sides, just for show" → 10 N each side, mirrored; "the asymmetry looks
bad" → everything drawn and solved symmetric (band on both sides, F13.4, F19.2), only the thumb-rest label on the left;
"this should be in the shape category" → it is (ch 'shape'). F2.20.

### 9. b07_size (shape, paper) "Sized against real hands" — settle 10
- 0.0: header; top view to scale: a small hand (ANSUR II women 5th pct, 165 mm) on a long flagship (Viper V4 Pro 127.1).
- 0.4–2.6: claw grip, palm at the tail: the fingertips stop short of the click zone (marked red): "too big".
- 2.6–4.6: a big hand (men 95th, 210 mm) on Theseus (119.3): fingertips past the nose; it slides into a fingertip grip, palm
  off the tail: still in control. The quote types in, word for word (F21.13).
- 4.6–7.0: lengths on one scale (V4 Pro, GPX2, SLX, ULX, Theseus) with the average man's hand 193.3 mm: Theseus 61.7 %.
- 7–10: verdict "119.3 mm, the shortest flagship"; every hand 5th→95th reaches the click (drawn rule, said).
Answers: (size not rated) F21.13 quote; ANSUR II updated to the full public sample (193.3, which is Brock's 19.3 × 8.9).

### 10. b07_emg (shape, night) "EMG on every shape revision" — settle 11
- 0.0: header; a forearm and hand (mono grey) on a mouse, two electrodes on the extensors (ED, ECR), wires to a trace.
- 0.4–2.6: a flick: the raw EMG bursts, its RMS envelope fills a %MVC gauge with Jonsson's 2 % and 5 % lines: pros sit above
  5 % even at rest between flicks (Wang 2023): the quiet, constant cost.
- 2.6–5.0: five ZOWIE shapes, the same click rate (6.35–6.37/s) but different extensor load (Tang 2023): "the score can't
  see it, the electrodes can".
- 5.0–8.0: the protocol: every revision tested: EMG, aim score, comfort (Li & Wang 2025: comfort catches what a short EMG
  test misses); revisions A, B, C: B wins (illustrative, labelled).
- 8–11: verdict "Every revision, measured"; "Zowie is the only maker doing this today (Brock)".

### 11. b07_balance (shape, paper) "Balance at the centre" — settle 12
- 0.0: header; side view (mouseSimple side, cut): shell, board, buttons, wheel, battery up in the hump; the CoM mark; fingers
  on the low sides at 12 mm (grip line).
- 0.4–2.2: a flick: the mouse slides and rocks (exaggerated, labelled): the lever between CoM and grip.
- 2.2–4.0: both sides, honestly: twist = m·a·(CoM height − grip height); "a palm on the hump holds high: there a higher battery
  lines up" (why some push for it); "Theseus grips its flat low sides (12 mm): so low".
- 4.0–5.6: the pointer drags the battery down to board height in the tail: the CoM drops to the grip line; the flick: no rock.
  Verdict: lever 3.5 → 0.1 mm, −98 % twist.
- 5.6–6.4: the view turns to the top (kit transform).
- 6.4–9.0: the sensor moves forward (plan 5, z 19.5): the CoM would follow; the battery (8 g, the heaviest part) sits in the
  tail and holds the CoM at the centre (±0.1 mm); "balance at the centre, the battery sets it".
- 9–12 hold.
Answers (mass 5/10): "in review" → rebuilt; "research why some people are pushing for higher battery placement" → the reason
(match the CoM to a higher grip, e.g. palm on the hump; perceived lightness when pivoting) shown and weighed against
Theseus's low grip; F2.40 (a better argument: the lever, drawn), F21.15 (the battery sets the balance), F30.10 (centre).

## Model results (08:1x, in page; numbers move if H1's shared positions move)
- COORDINATES: plan 5 is in the board's layout frame; mouse z = layout z − 2.88 (H1). Board in the mouse: z −10.49…48.57,
  centroid 19.09; sensor mouse z 16.57 (was 1.12); MCU 1.92. Rib rows over the board: −0.77, 9.17, 19.25, 29.76, 41.16.
  The hump's peak (z −14) is over the battery, not the board: the board stiffens the front 60 % of the shell.
- b07_board (section at the board's rear rib row z −0.77, real shape from the GLB; feet tied by the rim (k 8.5 N/mm) or rim +
  board (k 635 N/mm)): GRIP SQUEEZE 10 N each side 12 mm up: flex 0.636 → 0.207 mm (−67 %); feet move 0.685 → 0.012 mm;
  peak 15.8 → 17.3 MPa (+9 %, honest: the wall now bends against held feet; 7× under the 120 MPa break). Crown press 10 N:
  sink 0.330 → 0.322 (−2.5 %) only, feet spread −98 %. => the demonstration is the GRIP SQUEEZE, not a crown press.
  Pull test: FR4 4,300 N vs AZ91D 2,351 N at 0.925 g each (1.83×).
- b07_arms (plan frame, ring + plan-5 board; arms at G-Wolves' places, mouse z −1, 8.5, 18): squeeze 10 N each side at z 4:
  FR4 peak arm root 4.67 MPa vs whole board 0.98 MPa (4.75×); squeeze flex arms 0.0043 vs whole 0.0123 mm (arms are stiff
  links: do NOT claim more stiffness); ribs (CF-PP 1.1 × 1.2) peak 7.1 MPa. Earlier sweep (arms at z 2, 11, 21): FR4 peak
  ratio 1.8–5.5× along the board; whole board stiffer only at the front (z 36–44, 3.5–3.9× less flex). The snap: a
  fixed-guided FR4 tab 6.5 mm × 1.0 mm (est. from the photo): 1,349 MPa per mm of tip movement → 483 MPa (Gund crosswise
  flexural) at 0.36 mm, about three sheets of paper; square root makes it worse. Story: G-Wolves had the right idea (use the
  board), executed with fragile tabs; Theseus: no tab, every rib meets the board's own edge.
- b07_tolerance: T 0.076 mm/part (Protolabs), allowance ±0.10 (example, said so): 4 parts WC ±0.304, RSS ±0.152, out 4.8 %
  (MC 5.2 %); one part at ±0.25: RSS ±0.283, out 28.8 % (MC 28.3 %), its share 78 %; 2 parts WC ±0.152, RSS ±0.107, out
  0.53 % (MC 0.58 %); 1 part 0.008 %.
- b07_balance: battery from MS_BATTERY (kit; currently z −22.72 — follows H1's move): CoM z +0.17 mm (the centre), y 12.06
  (grip 12): lever 0.06 mm; battery in the hump (z −14, y 20): z +2.55, y 15.48, lever 3.48 mm: twist −98 %.
- b07_sides (z −14 section, mirror-averaged, symmetric 10 N each side): flex 0.148 → band 0.081 (−45 %) vs even 0.111 (−25 %):
  1.8× per gram; peak 16.4 → 9.5 (−42 %) vs 13.5 (−17 %): 2.4× per gram. Arch rise 26.5 over span 61.5 mm; the low side's
  bulge 0.64 mm over a 13.2 mm chord.
- b07_sheet: graded walls (same 1.31 g) squeeze flex −38 %, peak 24.5 → 17.0 MPa. Joined struts at equal strut weight: roof
  sink −17 %, peak +13 % (geometry to revisit; modest, say so or rethink). PPS/Mg/CF-PP ratios from E and ρ.
- b07_newton profiles: peak rate of change sharp 66.5 °/mm, soft 2.7, round 13.5.

## Shared code I expect to need
- Kit: mouseSimple, establish/locator, finger, forceArrow, spring, pressCurve, abSplit/wipeTo, verdict, demoPanel,
  scaleNote, chapterCard2/ledger.
- 07-sim: feSolve/simSolve/feDraw/feFlow/feSupport/feLattice/SIM_MAT. 03-parts: keyPlanMM/KEY/SORA_HALF/part/boardMM.
- Old-file helpers I will COPY under b07_ (old files may leave the build): shcPlan/shcArchModel/shcOutline/shcInset/
  shcResample/shcInside/shcBoardOutline, SHB_SEC/SHC_SEC + shbSec*, SHP profiles + shp_follow/shp_body, SHL_GRADE, SHC_PULL.

## Models and conventions checked (Brock's standing rule, 08:18; format: what, where, the check, the verdict)
- shcPlan / shcBoardOutline (10-d3-board.js): the board outline was in the board's LAYOUT frame, not the mouse's: every
  rib row and arm position was 2.88 mm off. Fixed: b07_boardOut shifts plan 5 by −2.88 (H1's frame note). Checked in page.
- shcBoard FE numbers (crown press −29 %, FR4 17.9×): the crown press on the old section is NOT the case the board helps:
  re-solved on the real section at z −0.77 (GLB slice): crown press only −2.5 %; the grip squeeze −67 %. The slide uses
  the grip squeeze; the 17.9× ratio came from a load placed at an arm; with the squeeze over the board it is 4.75×
  (sweep 1.8–5.5×). Old figures not reused.
- Old arm snap (8.7 mm arm, 757 MPa/mm, snaps at 0.64–0.73 mm): arm length re-estimated from Brock's photo (6.5 mm,
  tabs 3.5–4 mm wide): 1,349 MPa/mm, snaps at 0.36 mm (fixed-guided σ = 3Ehδ/L²; checked by hand: 3·19000·1.0/6.5² =
  1,349).
- SHB_SEC (10-d2-arches.js, the hump section used by shbSides): its two halves differ (the "asymmetry" Brock disliked):
  mirror-averaged in B07_HUMP use, so the two sides are loaded and drawn the same (his note). Rise/span checked on the
  GLB slice at z −14 (26.5 over 61.5 mm).
- SHC_PULL (old pull test): recomputed from the vetted SRC figures (FR4 430 MPa / 1.85; AZ91D 230 / 1.81) at equal mass:
  1.83×, matches.
- Old `mass` slide CoM: used the old battery and sensor places; recomputed from the GLB centroids + MS_BATTERY (kit), see
  Model results. The kit's simplified mouse is drawn at the scan's proportions (MS_DIMS 38.1 tall): heights on the
  balance slide are said in Theseus's numbers, drawn with msAt/msBox only.
- b07_board's 2D slice against the deck's 3D lattice study (3d/lattice/assets/lattice.json, fe.summary; whole shell, feet
  held, 10 N squeeze: 15.5 µm tri lattice, 40.7 µm no lattice): the slice's absolute flex (0.64 / 0.21 mm) is one 10 mm
  slice taking the whole 10 N, 13–40× the whole shell's. Verdict: keep it as the principle, labelled on screen ("One 10 mm
  slice, solved in 2D", source line), never as the mouse's flex. The rim-alone restraint (8.5 N/mm, the plan ring only)
  leaves out the shell's 3D curvature, so −67 % is likely an upper bound for a real slice; open check for the auditor: a
  3D solve with and without the board tie. Feet: 0.68 → 0.01 mm (−98 %) is robust (the board's 635 N/mm dominates).
- Shared positions (08:50 broadcast): BOARD_OUTLINE / KEY_PARTS now drive b07_boardOut, b07_boardPathKey (key frame),
  b07_battZ / b07_battY. Re-derived in page: board numbers unchanged (plan 5 copy was identical: half-width 19.03 at
  z −0.77; flex 0.636 / 0.207; arms FR4 4.67 / 0.98 MPa). Balance moved: battery z −24.95 (was −22.72) → CoM z −0.44
  (was +0.17), height 12.06, lever 0.06 mm; battery in the hump: 15.48, lever 3.48 → twist −98 %.
- Magnesium strength in the pull test: two sources in the deck disagree (az91d, makeitfrom: 160–220 MPa UTS; shlMg,
  MatWeb AZ91D-F: 230 MPa). Used 230 (the higher): the ratio 1.83× is the cautious one (makeitfrom's would give 1.9–2.6×).
  SIM_MAT.mg E 46 GPa (makeitfrom) vs MatWeb 44.8: only used for stiffness ratios on b07_sheet; difference 3 %, noted.
- PP-C-20A strength for the "+9 % peak" note: shlPyrofil tensile breaking stress 120 MPa (JIS K7162); the peak 17.3 MPa is
  stated as "17.3 of 120", not as "7× under" (6.9×: never round a margin up).
- verdict convention (kit): the net is rounded toward zero (−67.4 % → −67 %), label says which way is better: kept.
- "10 N a side ≈ a 1 kg bag of sugar": 1 kg × 9.81 = 9.81 N, said as the weight of the bag, not as a typical grip force
  (no sourced grip force: gap 1).
- Tolerance (old `tolerance`): the old slide had no law and an arbitrary per-part error; now Scholz's worst case / RSS
  with Protolabs' ±0.076 mm and a Monte Carlo check (n 24,000) that agrees with the closed form within 0.6 points.

## Research gaps (web-search budget exhausted at 08:2x; per BROADCAST-search.md)
FILLED by research/FILLS.md (09:00–09:10): gap 1 (grip force: office peak about 2 N on the sides, Won 2009; full strength
72–105 N derived; "10 N each side is honest"), gap 5 (HTS Ultra 8K = TechPowerUp's Hati-S Ultra 8K; used), gap 9
(G-Wolves HTS Plus Pro 8K "Single-shell + carbon rod" and Warg 8K: named on b07_board as the rod rival; SRC b07GwPlusPro).
Each: what is missing, the stand-in used, the query or URL that fills it, the slide it feeds.
1. A sourced grip-squeeze force on a mouse (N). Stand-in: 10 N each side, said as "a 1 kg bag of sugar's weight", not
   claimed typical. Query: "computer mouse grip force newtons study" / "gaming mouse squeeze force measured". Feeds
   b07_board, b07_arms, b07_sides (human scale, M5).
2. A public source for players fitting Poron/foam where a G-Wolves board meets the shell to stop creaking. Stand-in: Brock's
   own note (no tag, F9.5) plus the keyboard world's Poron PCB gaskets and Rogers' gap-filling page. Query: "g-wolves creak
   foam pcb mod" / "hati creaking fix foam tape". Feeds b07_poron.
3. FR4 tensile strength check: the Gund PDF fetch was refused. Stand-in: the deck's vetted `shlFr4` (Gund 430 MPa LW) and
   Wikipedia FR-4 (flexural > 415 MPa LW). URL: https://thegundcompany.com/wp-content/uploads/2024/03/NEMA-FR4-Glass-Epoxy-Laminate-by-The-Gund-Co.pdf
   Feeds b07_board (pull test 1.8×).
4. Why some people push for a higher battery: no authoritative source found (retailer blogs only; periview.gg and
   Notebookcheck on the Zeromouse's rear battery). Stand-in: the physics stated plainly (twist = m·a·(CoM height − grip
   height): a higher grip argues for a higher battery), attributed to no one. Query: "mouse battery placement higher center
   of gravity argument reddit MouseReview" / "Optimum zeromouse battery moment arm explanation". Feeds b07_balance.
5. G-Wolves "HTS Ultra": model name as Brock wrote it (F6.3), unverified. Query: "G-Wolves HTS Ultra". Feeds b07_arms.
6. Coin thickness tolerance (US Mint publishes nominal only). Stand-in: the coin demo uses relative error ("coins drawn
   thick"), mm only for mouse parts (Protolabs ±0.076). Query: "US Mint coin thickness tolerance" / "Royal Mint coin
   thickness tolerance specification". Feeds b07_tolerance.
7. Shipping-drop accelerations (ISTA 1A drop heights, peak g in a box). Stand-in: no drop load claimed; the tab's snap is
   given as tip movement (0.36 mm, fixed-guided beam, derived). Query: "ISTA 1A drop test height peak acceleration small
   package g". Feeds b07_arms.
8. A size rule (mouse length vs hand length by grip). Stand-in: none claimed; hands drawn to scale from ANSUR II. Query:
   "mouse length hand length ratio grip study". Feeds b07_size.
9. A shipping mouse (or a well-known mod) that stiffens its shell with a bonded carbon-fibre rod or strut, to name the
   rival on b07_board instead of a generic rod. Stand-in: the rod is drawn generically as Brock's example; the paid route
   (carbon or magnesium shells: Sabre v2 Pro CF $199.99 vs ~$100, ROG Harpe Ace Extreme) is named in the narration.
   Query: "gaming mouse carbon fiber rod reinforced shell" / "mouse shell carbon fiber strut stiffener". Feeds b07_board
   (sharpens a claim).
10. Typical carbon-fibre (pultruded) rod modulus and a 2 mm rod's mass, if the rod's own stiffness should be solved and
   shown. Stand-in: no number shown for the rod (its cost is shown as parts and joints only). Query: "pultruded carbon
   fiber rod 2 mm tensile modulus GPa density". Feeds b07_board (nice to have).
