# B08 progress (Surface: a finish that grips and lasts)

File: deck/src/30-b08-surface.js. Build: cd /home/claude/theseus/deck && python3 tools/build.py main --out=b08 --own=30-b08-surface.js
Started 2026-11-06 ~07:40 (Chicago). Fresh start (no earlier PROGRESS.md).
Prefix for helpers: b08_. Old helpers I may CALL (they stay in the build from the snapshot): srf_field, srf_macro, srf_shade,
srf_genFilm, srf_cut, srf_fbm, srf_vn, srf_hash, srf_layer1, srf_section, srf_fibres, srf_prof, srf_balance, srf_shellView,
srf_vFill, srf_vClip, srf_lines, srf_dots, srf_knurlField (diamond: don't use), srf_pot (old pot: replace), SRC keys srf_*.

## Status
- [x] Read common.md, b08-brief.md, FEEDBACK.md (all), REVAMP.md, DESIGN.md, f0a/f0b/h1 briefs, b07/b09 briefs
- [x] Read old slides: 10-e-surface.js (surfacecard, coating, grip, wheel) and 10-e2-surface.js (srf_gripmap, srf_tape,
      srf_twotone, srf_weight, srf_texture, srf_uv)
- [x] Phase A research (web search budget for the turn ran out at ~07:45: see PENDING)
- [x] Phase A storyboard, all 9 slides (below)
- [x] Phase A code that needs no kit: SRC, data, b08_ helpers (print, spring, tape texture, streamlines + grip-map fields,
      amphora, flames, kiln, pencil test, film section, soft-touch section, tape section, pad section). Lab slides
      b08_lab..b08_lab6 behind ?b08lab=1 (REMOVE before finishing).
- [x] KIT.md landed 08:03; phase B started ~08:10.
- [x] b08_grip DONE (errs ok, qa clean settle+mid, phone view read). CHECKPOINT1.md written ~08:45.
- [x] 08:45 broadcast read (review file, model checks, true greys, frame one). No review/b08.md yet (checked 08:35).
      Greys: 40 warm literals in my file turned true grey / tokens (tools/greys.py). Frame one: grip and gripmap show
      their subject at t = 0 (shots/f0_sheet.png).
- [x] b08_gripmap DONE ~08:40, REBUILT on Zhang 2017 after the model check (sweat/Derler numbers dropped, thumb dots
      dropped): errs ok, qa clean settle + mid, frames read (shots/map7_sheet.png).
- [x] 08:50 broadcast (mouseSimple draws plan-5 parts from KEY_PARTS): rebuilt 08:45 on the 08:42 snapshot, re-shot grip
      (0, 2.7, 10.5) and gripmap (0, 4.4, 11): shots/kp5_sheet.png. My views draw no internals; the tape piece, the
      fingertip, the zone tags and both cameras still land on their parts. Nothing of mine was derived from the sensor,
      battery, antenna or board positions.
- [x] b08_coating DONE 08:52 (paper): classroom kiln/pots/rain + Cerakote pencil test 4H at 750 g, verdict 3H -> 9H
      "+6 grades"; errs ok, qa clean settle + mid, frame one shows pots, kiln and both coat panels; shots/coat3, coat4.
- [x] review/b08.md (critic, 08:46) on b08_grip: R-b08-1 and -2 (musts) FIXED, -3 and -4 FIXED, -5 partly; replies written
      under each finding 08:58. Grip rebuilt: Zhang 0.2/0.4 N means at a 0.3 N press; pull 0.14 N; two moves; held pulls
      move the mouse; verdict "extra grip where you pull" 0 % -> 14 %. errs ok, qa clean settle + mid (shots/grip8).
- [x] b08_film DONE 09:02 (night): section to scale (4.5 px/µm), dashed as-moulded line, soft-touch 51 µm first, blast
      (drawn ~13 µm), coat 19 µm back to about the line; verdict 51 -> 19 µm (−62 %); weights 0.68 g or more vs 0.37 g
      "before the blast takes its share" (net unnumbered, F21.10). errs ok, qa clean settle + mid; shots/film2.
- [x] b08_uv DONE 09:10 (paper): left, a white ULX Pro under two fingertips through "months in use" (no numbers), the
      fingers lift and show the stains, owners' quotes as fault tags; right, a QUV chamber, masked strip, 0 -> 1,000 h,
      the foil peels: "No visible change"; verdict UV testing published 0 -> 1,000 h; chemicals line; errs ok, qa clean.
- [x] b08_tape DONE 09:16 (paper, title = his line): section at 150 px/mm, fingertip drops off a 0.5 mm edge; a month on
      (glue ooze, gunk, lifting edge; tags to the right, ~1.5 s each); the chase 0.5 -> 0.3 -> 0 mm (bars: Lizard Skins,
      Pulsar, TalonGames, Keychron, Theseus); etch; the fingertip slides back with no step; verdict 0.5 -> 0.0 mm "added
      for grip". errs ok, qa clean settle + mid.
- [x] b08_twotone DONE 09:20 (night): old loved macro kept (srf_genTwoTone, light sweep clamped: no idle drift); Prophecy
      3-layer stack chipped by a coin edge first, then the etch, then the same scuff on the etched coat; verdict 3 -> 1
      layers; "A colourway option, not the default design". errs ok, qa clean, phone view read (shots/tt2_phone.png).
- [x] b08_wheel DONE 09:25 (paper): test group row (OP1 1.8 g, Zeromouse kit 1.5 g: sellers' figures; two "to weigh" under the
      placeholder stamp); a jeweller's scale from above weighs the OP1 stock wheel 1.80 g, PMM 1.00 g, Theseus 0.90 g; the 2D
      twin wheel with "Six thin arms" / "Six triangles with the rim"; the tread unrolled (straight grooves); verdict OP1 stock
      1.8 -> 0.9 g (−50 %).
- [x] b08_card DONE 09:28 (night): chapterCard2 with the LEDGER words; part = an etched swatch (satin coat; at the answer a
      laser writes ridges -> dots -> smooth). Re-shot after BROADCAST-0930 (no flagship for surface).
- [x] Lab slides removed (6) and B08LAB gone; film order fixed with before: 'b08_grip' on coating, film, uv (verified:
      card, coating, film, uv, grip, gripmap, tape, twotone, wheel).
- [x] BROADCAST-0930/0945 and research fills applied (review/b08.md replies 09:35-09:40): coating payoff a plain stat (no
      strike of Cerakote's own air cure); film weight 0.37 to 0.43 g; soft-touch named as RadTech's test film + Covestro
      caveat; gripmap sweaty-hand plain stat (Derler verified); uv Huntsman contrast; wheel stock weights.
- [x] FINAL 09:40: errs ok on all nine; qa settle + mid TOTAL 0 on all nine; contact sheets shots/final_settle.png and
      shots/final_frame1.png. Report next.
## PENDING (needs web search, budget exhausted this turn)
- b08_wheel test group: measured weights of stock plastic wheels with rubber tyres (Brock: "average plastic wheels with
  heavy rubber, a test group"). Nothing in the repo (only XBAB XA25 wheel 0.931 g, a light wheel; PMM Mg 1.0 g).
  Until found: rows built from a data table, marked placeholder; ask Brock (weigh 3+ stock wheels) in the report.
- UV classroom/real-world example source (yellowed retro consoles / Retrobright, or newspaper in the sun): unsourced now.

## Research findings (with sources)
### Coating (Cerakote)
- F-110 Black Ink (cerakoteeu.com/?p=20046): recommended 0.75 mil; "theoretical coverage 604 ft²/gal"; 38 % solids;
  1.44 g/mL; pencil 9H gouge / 7H scratch (ASTM D3363); UV "Excellent"; chemical "Excellent" = ΔE < 2.5 (CIE76); oven
  15 min @ 250 °F, or 82 °C for 1 h; results on blasted steel.
- Cerakote's coverage figures are per gallon at 1.0 mil = 1604 × solids%: H-167 TDS says "Theoretical Coverage (per
  Gallon at 1.0 Mil) 606 ft²" with "Theoretical Solid by Weight 38 ±2%", 1.36 g/mL, 8H, 250 °F 2 h (nicindustries PDF);
  C-192 48 % → 772 ft² at 1 mil (cerakoteeu.com/?p=1120); C-299 58 % → 924 ft² at 1 mil.
- => THE OLD 0.49 g WAS WRONG: it read F-110's 604 ft²/gal as if at 0.75 mil. Correct: 3.785 L × 1.44 × 0.38 = 2.071 kg
  of solids per gal over 604 ft² (56.1 m²) = 36.9 g/m² PER MIL -> 27.7 g/m² at 0.75 mil (19 µm) -> × 133 cm² = 0.37 g
  (−25 %). Dry film ≈ 1.45 g/cm³ (vs soft-touch ≥ 1.0), so 37 % of soft-touch's thickness is ~54 % of its weight
  (soft-touch 51 µm × 1.0 × 133 cm² ≥ 0.68 g). Caveat for the report: Cerakote's coverage uses weight solids as if
  volume; if true volume solids are lower the film could be up to ~0.5 g; a weighing settles it ("blast/coat weighings",
  the F21.10 question he answered "keep it unnumbered").
- C-299 air cure (cerakoteeu PDF): 3H gouge and scratch; tack free 45-60 min, full cure 5 days; 1 mil.
- Pencil test ISO 15184: lead squared flat, held at 45°, load 750 ± 10 g, pushed ≥ 7 mm at 0.5-1 mm/s; pencil hardness
  = hardest pencil that doesn't mark. (750 g ≈ a full 750 mL water bottle.) ASTM D3363 adds gouge vs scratch hardness.
- Soft-touch (SRC srf_soft, RadTech 2016): 2 mil (51 µm) film; pencil 7B to H; RCA abrasion 31 to 300+ cycles.
- Polyester urethanes "become tacky" with hydrolysis (Cultural Heritage Agency NL plastics tool, PUR ester page:
  plastic-en.tool.cultureelerfgoed.nl/plastics/detail/PUR%20ester%20soft): soft-touch going sticky.
- Brock's doc, idea 16 (research/brock-doc-in-pursuit.txt l.50): "baked ceramic coating" vs PMM's "air dry ceramic
  coating" which "despite being extremely grippy, had durability issues"; HIS analogy: "a dried clay pot is weaker than a
  pot put in a kiln, the PMM coating in this analogy is the pot that has not been put in a kiln"; "the current rubberized
  coating ... susceptibility to being rubbed off"; PP's low surface energy: Cerakote "relies on how the surface is sanded
  rather than the material composition for its bond" (why the blast). (Don't repeat his "only diamond can rub it off".)
- PMM's coating = "UltraGrip", "a ceramic-based finish" (EloShapes PMM AIM 8K review); periview.gg says durable. Air-dry
  is Brock's statement -> attribute to him.
- Clay: unfired greenware "will dissolve, or 'slake down' in the water"; "Bisque ware does not dissolve in water";
  bisque fired ~995 °C (cone 06); "turned from clay to ceramic material" (thepotterywheel.com, "What Happens to Clay When
  it is Fired in a Kiln?").
- F-Series plastics cure 82 °C / 1 h (srf_fManual); PP-C-20A HDT 155 °C @ 1.8 MPa (srf_ppc20): the bake is far below
  what the shell takes.
### Grip
- Zhang, Zeng, Igartua, Rodriguez-Vidal, van der Heide 2017, Tribology Letters 65(3), doi 10.1007/s11249-017-0869-x
  (full text research.utwente.nl/files/17961970/Zhang2017texture.pdf): stainless steel, pulsed laser; grooved channel
  Z001 W 20 µm, D 10 µm, spacing 25 µm. Fingertip (right index, one 32-year-old male, dry skin, 17 mm/s) COF:
  load 0.2/0.4/0.6/0.8/1.0 N: perpendicular 0.51/0.50/0.50/0.51/0.53; parallel 0.41/0.47/0.44/0.42/0.42;
  45° 0.50/0.44/0.43/0.42/0.41. Untextured reference 0.48-0.69. Pillar grid Z003 (orientation independent) 0.23-0.27.
  => across/along +26 % at 1 N (+6 to +26 % over 0.2-1 N). Grip peaks only ACROSS (45° ≈ along).
  CAUTION: Zhang 2015 (IJSS 56-57: 53-61, tool steel grooves) found PARALLEL higher: the direction depends on the
  groove geometry. Claim only for this geometry; the etch is designed to it.
- Sergachev, Matthews & van der Heide 2022 (srf_serg22): elongated micro-asperities, friction higher across, up to 2×.
- Derler & Gerhardt 2012 (srf_derler): skin on glass: smooth dry 2.18, smooth wet 0.61; rough (Rz 45 µm) dry 0.53,
  wet 1.43 => sweaty-finger squeeze per side to lift 29.31 g: mg/(2μ) 0.236 -> 0.101 N, −57 % (derived).
### Tape
- 0.5 mm: Lizard Skins DSP (srf_lizard), Pulsar SuperGrip, Pwnage UltraGrip, TalonGames (nerdtechy roundup);
  0.3 mm: TalonGames PU-0 "only 0.3 mm of high-quality polyurethane", 3M adhesive (maxgaming.com listing);
  Keychron pre-cut "ultra-thin 0.3 mm profile", "substrate-free double-sided adhesive" (keychron.com).
- Peels: Best Buy review of Razer Universal Grip Tape (2★): "This stuff looses its stick and becomes unpeeled after a
  month of use." Gunk: Lizard Skins owners "dead skin does get stuck in the triangles" (srf_lizard). Glue creep/ooze:
  US 6,686,014 (srf_ooze). Edge lifting is a known fault (roundup advice "keep edges slightly curved to prevent lifting").
- Credit card 0.76 mm (ISO/IEC 7810 ID-1), copy paper ~0.1 mm (human scale).
### UV / chemicals
- Cerakote photopolymer QUV 1,000 h ASTM D4587: "no visible sign of degradation" (srf_quv; visual, no ΔE).
- Cerakote chemical: Elite unaffected by 13 chemicals in 24 h soaks, H-Series slight change in two (srf_chem); F-110
  "Excellent" defined ΔE < 2.5.
- ULX owners (reddit.birdcat.cafe mirror of r/FinalMouse "ULX Clix"): yellowing "was a huge problem with the aceu"; a
  Tarik Pro Series "was known to yellow very badly"; blamed on sweat, lotions, the Pro Series' "different more grippy
  coating". => the ULX Pros' yellowing is largely CHEMICAL staining; the slide shows UV and sweat/oils.
### Two-tone
- Prophecy: "applied using a new satin undercoat process", "paint protected by our new ULX competition UV matte top
  coat" (srf_prophecy) -> 3 layers. DROP the old "33 g painted, 29 g plain" line: Finalmouse never says the 4 g is paint
  (a coat weighs well under half a gram): it implied a false cause.
- Cerakote Laser Imaging / etch to substrate (srf_laserImg). F21.7: etch through to the carbon.
### Wheel
- PMM magnesium wheel 1.0 g, "the magnesium wheel only" (srf_pmm, maker). XBAB XA25 wheel 0.931 g (weights.json, MC).
- Ours 0.900 g AZ31B, 508.4 mm³ (srf_wheel3d; H1 re-doing tread straight F30.8, arms thinner F25.2).
- Brock's doc: six spokes "fits 6 equilateral triangles ... allowing for the outer shell of the scroll wheel to be the
  thinnest" (l.335); comments: "rubberized scroll wheels feel really cheap and impermanent to me ... i also want it to
  last practically indefinitely"; "brands with metal wheels are adding rubber inserts". Sora V2 wheel (his photo) =
  rubber-tyred plastic wheel: the rival in his own placeholder mouse.
- Test group: PENDING (see above).

## Storyboards (times: 0 s header+subject; ~1 s problem visible; ~5-7 s fix; ~8 s payoff; settle held)
(Kit calls named as in the f0a brief; adapt to KIT.md when it lands.)

### 1. b08_card (surface, first: true) "Grip that holds, and stays" — replaces surfacecard
- Compromise (ledger, red): tape peels, soft-touch wears, paint chips. Answer (blue): one baked coat, etched for grip.
- Visual: chapterCard2 with a `part` = a lit macro swatch of the finish (srf_macro height field: satin ceramic, a zone of
  etched ridges blending to smooth, raking light sweeping once: light is the only mover). Optional: three small rival
  swatches fail at once (tape edge lifts, soft-touch worn shiny, paint chips) then wipe into the one coat.
- 0 s chapter + compromise text; 0.6-2.6 s rival swatches fail; 2.6-3.6 wipe to the coat; settle 5.5.
- Answer: "surfaces looks bad in 2d and 3d visualization" -> no 3D, no whole-shell render (F38.8): the finish itself,
  a crisp lit close-up drawn as a height field, plus the three finishes it replaces visibly failing.
- Hand-off in: b07_sheet (the rest of the shell) -> the shell gets its skin. Out: the coat swatch -> b08_coating.

### 2. b08_coating "Baked ceramic coat" — replaces coating (5/10 "lazy visualizations, show flames and more realistic pots")
- Rival: air-dried ceramic (Brock: PMM's air-dry ceramic was grippy but wore) and soft-touch (7B-H). Fix: F-Series
  baked. Brock's own analogy: the unfired pot vs the kiln pot.
- Classroom (demoPanel): two wheel-thrown pots drawn properly (Greek amphora form: foot, belly, shoulder, neck, lip,
  handles, throwing rings, shading; mono grey: greenware pale matte, fired darker with sheen). A cutaway updraft kiln
  (firebox with real flames: layered tongues driven by the fuel, heat-scale colours; perforated floor; chamber glow
  rising). Then the test: both into water: greenware slakes down (slumps, clouds), fired pot unchanged
  (thepotterywheel.com).
- Real: push from the fired pot's skin to the coat on a trigger: a pencil at 45° with 750 g (ISO 15184, "a full water
  bottle") pushed across air-cured (3H, Cerakote C-299) -> it gouges; across the baked F-Series -> no mark.
- Payoff: "9H on Cerakote's tests" (F21.10) huge; verdict 3H -> 9H "harder is better" (+6 grades); small ladder
  (soft-touch 7B-H, air-cured 3H, oven H-167 8H, baked F 9H). Player: no shiny worn patches where fingers rest.
  One quiet line: baked at 82 °C for an hour, far below the 155 °C the shell takes.
- Times: 0 pots+kiln on screen; 0.5 flames catch; 1-3.5 fire (pot darkens, glow); 3.5-5 water test; 5-5.8 push to
  coat; 5.8-8 pencil strokes (same pencil, same load); 8-9 verdict; settle 11.
- Answers: "lazy visualizations" -> a demonstration with cause and effect (fire, then water test, then pencil test);
  "show flames" -> a firebox with flames that drive the heat; "more realistic pots" -> wheel-thrown pots drawn with
  foot, belly, neck, lip, handles, throwing rings and fired sheen.
- Hand-off: from the card's coat swatch; out: the coat on the shell -> b08_film's section.

### 3. b08_film "A film too thin to weigh" — replaces srf_texture (6/10) + srf_weight (4/10); F2.13, F2.22, F21.10
- Section through the shell skin, to scale (µm): PP-C-20A with 7 µm carbon fibres along the flow (Höftberger 2022,
  Yamaguchi 2024), the AS-MOULDED HEIGHT as a dashed line.
- 0 s section on screen; 0.8-3 s blast: grit visibly strikes, a skin comes off (hatched "blasted off"), the profile
  roughens below the dashed line (why: PP is hard to stick to; the blast gives the coat its grip, Brock's doc);
  3-5 s coat: spray lands, film fills the valleys and levels 19 µm over them, ending back at about the dashed line;
  5-6.5 s soft-touch drawn on the same scale beside it (51 µm, RadTech) standing far above the line;
  6.5-8 s the balance: blasted off vs coated on, ending about level (unnumbered, F21.10).
- Headline: "19 µm" + "a fifth of a sheet of paper"; verdict 51 -> 19 µm (thinner is better, soft-touch -> Cerakote).
- Weight row (derived, small): film before the blast 0.37 g (CORRECTED from 0.49) vs soft-touch ≥ 0.68 g; net unnumbered.
- Answers: "show previous height before sanding and coat" -> dashed as-moulded line, the blast taking it down, the coat
  bringing it back to about that line; "i like the comparisons to soft touch" -> kept, same scale, thickness and weight;
  "can be combined with previous slide" -> combined; "film numbers before sand blasting look way too heavy, 0.49g is a
  lot" -> checked: the old figure read Cerakote's 1-mil coverage as 0.75-mil; corrected 0.37 g; "especially with how much
  thinner cerakote is to soft touch" -> the ceramic film is denser (≈1.45 vs ≈1.0 g/cm³): 37 % of the thickness, about
  half the weight; shown side by side. F2.13 fibres 7 µm, film texture top-view macro kept.

### 4. b08_uv "No yellowing" — replaces srf_uv (7/10, no note); F2.23
- Chamber (QUV, UVA lamps) with two white panels, each keeping a "before" strip; hours count to 1,000.
- Rival: a white coat with no published data (drawn from ULX Pro owners' reports, no rate implied) yellows; then sweat,
  skin oil, lotion drops: the rival stains (owners blamed sweat, lotions, the grippier coating). Cerakote: 1,000 h, no
  visible change (QUV, ASTM D4587); chemicals ΔE < 2.5 (F-110).
- Headline "1,000 h" / "no visible change"; a "published data" table: Cerakote UV ✓ chemicals ✓, ULX Pro none.
- Theme night (white panels pop). Hand-off out: the coat stays -> the coat also grips (b08_grip).

### 5. b08_grip "Directional grip" — replaces grip (8/10 "really good visualization but needs to be more intuitive");
###    F2.14, F33.5 (one of his important ideas) — MOST IMPORTANT, BUILD FIRST, CHECKPOINT1
- Establish: mouseSimple side view (thumb side), the thumb on the side's grip zone, ridges running front to back.
- Rival first: grip tape: the same grip every way. Lift: holds. Shift the thumb forward: it drags (equal friction
  arrows). "To hold the lift, tape drags every shift."
- Push in to the zone (locator in a corner): the etched ridges (srf_macro, raking light), the thumb pad pressing.
- Lift = slip across the ridges: the skin catches on the ridge edges, friction arrow long: 0.53. Shift = along the
  ridges: glides, arrow short: 0.42 (diagonal 0.41). Plain labels: "Holds the lift", "Frees the shift".
- Payoff: "+26 %" grip across vs along (Zhang 2017, fingertip, 1 N; a light touch); the lift needs 21 % less squeeze
  than ridges laid the wrong way. Player: the mouse holds in a fast lift, your thumb still moves.
- No polar plot (abstract): arrows sized by the measured friction instead.
- Answers: "really good visualization" -> kept the lit macro of laser grooves and the dragged fingertip;
  "needs to be more intuitive" -> on the mouse first (where and which finger), then the push-in; the two moves a
  player makes (lift, shift) with friction drawn as arrows, plain words, measured numbers only (the old ellipse
  interpolated values the paper doesn't have).
- Hand-off out: ends pushed in on the side zone -> b08_gripmap pulls back from that zone to the whole map.

### 6. b08_gripmap "A grip map for the hand" — replaces srf_gripmap (5/10 "grip designs need massive optimizations to
###    look cool, and blend between there different textures better"); F2.14, F21.9
- Opens pushed in on the side zone, pulls back to mouseSimple top + thumb side.
- Rival: grip tape cut to fit: one texture, hard edges, the same every way.
- A laser pass writes the map: a generative pattern: ridge lines are streamlines of a direction field that rotates
  smoothly from zone to zone (buttons: side-to-side ridges for the fingertips' pull; sides: front-to-back for the
  lift; thumb rest: lines break into dashes then dots; palm: thins to smooth). Pitch and line width blend continuously.
- AS BUILT (08:40): rival = the naive etch, the button's ridges run one way over the whole grip (grey): down the sides they
  run up and down, so a lift slides along them. Side view: the same 0.30 N squeeze; grip arrow 0.26 N (along) vs weight
  0.29 N (red): slips. The laser sweeps; the map (blue) turns the side ridges front to back; same squeeze: 0.30 N grip:
  holds. Verdict: least squeeze to lift a side 0.33 -> 0.28 N (−12 %, kit rounds toward zero), Zhang 2017 at 0.2-0.4 N,
  derived. Blend strip "One pattern, no borders". Zone tags: Pull / Palm: smooth / Lift. (The sweat and Derler payoff
  was dropped: see Models and conventions checked.)
- Proposal, labelled; ask Brock which map (F21.9) in the report.

### 7. b08_tape "The best thickness is no thickness" (his line) — replaces srf_tape (8/10); F2.15
- Rival: tapes chase thin: 0.5 mm (Lizard Skins DSP, Pulsar, Pwnage) -> 0.3 mm (TalonGames PU-0, Keychron): a section
  to scale under a sliding fingertip: the edge is a step it feels (0.5 mm ≈ two-thirds of a credit card); a month on:
  the glue creeps out (US 6,686,014), skin and lint stick (Lizard Skins owners), the edge lifts ("becomes unpeeled after
  a month", Best Buy owner of Razer's tape).
- The chase animates: 0.5 -> 0.3 -> 0 mm: the tape thins away into the etch (no glue, no edge).
- Headline "0 mm" + his line; verdict 0.5 -> 0 mm added per side.

### 8. b08_twotone "Two-tone in one coat" — replaces srf_twotone (6/10 "not a universal dah of the design, but i love how
###    realistic it is"); F2.21, F21.7
- Keep and polish the realistic macro: a laser rasters a Greek key (the labyrinth: Theseus) through a white coat to the
  dark carbon shell. Then the same scuff on painted art (Prophecy: satin undercoat, paint, UV top coat: 3 layers) chips
  it; on the etch there is nothing on top to chip. Headline "1 coat" vs 3 layers.
- "not universal": said on the slide: an option for a colourway, not the default design.

### 9. b08_wheel "A 0.9 g magnesium wheel" — replaces wheel (5/10 "poor comparison figure, we should be comparing ti
###    average plastic wheels with heavy rubber, a test group"); F22.1, F25.2, F30.8
- Rival first: a test group of stock plastic wheels with rubber tyres (the Sora V2's own is one), each set on a
  jeweller's scale (pan dips on a damped spring, display counts and settles): their mean. PMM magnesium 1.0 g (yellow,
  next best). Theseus 0.9 g (blue). Data: PENDING test group.
- The wheel from the shared wheel twin (view2D 'wheel', side): six thin arms (triangles with the rim: callback to the
  shell's triangles), the straight-line tread (F30.8) as a lit strip; no rubber ring to wear or gunk (his words on
  rubber wheels).
- Hand-off out to b09_card: the wheel in place in the mouse.

## Theme rhythm (draft)
card (kit) / coating paper or night (flames in a dark tile) / film paper / uv night / grip paper / gripmap night /
tape paper / twotone night / wheel paper.

## Kit notes (06-motion.js read at ~08:05; KIT.md not out yet; build with --own=30-b08-surface.js,06-motion.js until the
## snapshot has the kit)
- mouseSimple(view, o) / mouseFit(box, view, o) / establish(t, t0, box, { view, hi, focus, hold .55, dur 1.1, locator })
  -> { P, s, k, kd, cam, draw(fn) }; msBox(view, name), msAt(view, name), msView(view) {box, parts, at, outPts, out}.
- Frames: 'top' = key plan × MS_K (x user's right, nose up, y = -Z); 'left' = shell twin side: x = -z (nose left), y = -height.
  My grip-map fields: top field in key coords -> multiply by MS_K when drawing; side field (u = z, v = height) -> x = -u, y = -v.
- finger(x, y, ang, { s, press, view 'top'|'side' }), forceArrow(x, y, ang, len, { N, label, k|t,t0, color }),
  abSplit, wipeTo(t, t0, dur, area, drawRival(k), drawTheseus(k), { rival }), verdict(t, t0, x, y, { from, to, unit, label,
  better, net, who, size }), betterTag, faultTag, fixTag, shotInset, demoPanel(t, t0, area, { label, src }) -> inner,
  scaleNote(x, y, s, { lead }), SCALE.{hair, paper, card, ...}, LEDGER surface = 'Tape that peels, coatings that wear' ->
  'Grip that holds, and stays'; chapterCard2(t, { compromise, answer, list, part: fn(t, box, k), turn 2.1 }).
- Lab slides gated by ?b08lab=1; shoot them with /home/claude/work/b08/tools/shoot-lab.js (Q applied to every load).

## Models and conventions checked (08:45 rule: nothing reused unchecked)
| What | Where | Check | Verdict |
|---|---|---|---|
| Derler & Gerhardt 2012 skin on glass: smooth dry 2.18 / wet 0.61, rough dry 0.53 / wet 1.43 (srf_derler) | old srf_gripmap's sweat payoff; my first gripmap | The review's general finding is that moisture RAISES skin friction; the old entry has wetting lower it on smooth glass but raise it on rough, and the "sweat floats it / drains" story reads as written to fit. Smooth's dry/wet look swapped. Could not reopen the PDF (WebFetch needs approval; searches spent). If swapped, a wet smooth coat grips MORE than rough and the old payoff inverts | UPDATE 09:05: research fill b08-7 VERIFIED the old entry (2.18 dry, 0.61 wet on smooth; 0.53 dry, 1.43 wet on rough); my doubt was wrong. Used since 09:38 as a plain stat on the gripmap (sweaty hand) |
| Zhang 2017 laser grooves on steel, fingertip: across 0.51/0.50/0.50/0.51/0.53, along 0.41/0.47/0.44/0.42/0.42 at 0.2-1.0 N; pillars 0.23-0.27 every way (b08_zhang17; old srf_zhang17 had the 1 N pair only) | b08_grip, b08_gripmap | Re-read the paper's table (research.utwente.nl PDF). One subject, dry, 17 mm/s, 20 µm wide 10 µm deep grooves. Zhang 2015 (coarser grooves) gave the opposite direction | Reused within limits: claims tied to this groove size (SRC note). "Dots under the thumb" DROPPED: Zhang's pillars grip about half as much as grooves; dots now only the blend from ridges to smooth |
| Test pull and press (b08_grip) | b08_grip | Was 0.47 N at a 1 N press from Zhang's 1 N row; the critic (R-b08-1) and Johnson 2000 (0.35 N on a button) put a resting fingertip near 0.3 N, so the 0.2 and 0.4 N rows apply: grips 0.152 / 0.132 N, 45° 0.141 N | Now 0.14 N pull at 0.3 N press; diagonal dropped (it sits on the pull at these rows); gain +14 % |
| Lift squeeze = m g / 2μ a side | b08_gripmap | Static two-sided pinch; m = THESEUS.mass (05-data.js, 29.31 g); μ taken at the pinch's own load (0.2 and 0.4 N rows: 0.505 across, 0.44 along), not the 1 N row (that would claim −21 %). A fast lift's acceleration raises both, same ratio | 0.33 -> 0.28 N, shown "Derived" with Zhang 2017 |
| Kit verdict rounds the net toward zero (−12.9 % shown −12 %) | all verdicts | DESIGN §9: never round a claim up | Accepted |
| Cerakote film weight 0.49 g (old srf_weight) | b08_film | Old read F-110's 604 ft²/gal as a 0.75 mil figure; Cerakote's sheets give coverage per gallon at 1.0 mil (H-167: "per Gallon at 1.0 Mil", 606 ft² = 1604 × 38 %). Consistent use: 36.9 g/m² per mil, 27.7 g/m² at 0.75 mil, 0.37 g on 133 cm². Caveat: 1604 × solids is a volume-solids formula and Cerakote states weight solids; 38 % by weight at 1.36-1.44 g/mL needs a solvent of ≥ about 1.06 g/mL (possible, e.g. PCBTF; unverified); a dry film near 2 g/cm³ would make 19 µm about 0.5 g | UPDATE 09:24 (fill b08-8): solvent is PCBTF (1.33-1.35 g/mL); dry film 1.60-1.71 g/cm3 for F-110 at 1.44-1.48 g/mL; on screen "0.37 to 0.43 g" (Derived); the 0.5 g end is ruled out |
| Coated area 133 cm² (srf_scan) | b08_film | From Brock's scan; not watertight, areas approximate | Reuse, rounded |
| Soft-touch 51 µm (RadTech 2016 test film) at ≥ 1.0 g/cm³ -> ≥ 0.68 g | b08_film | A test-panel film from a UV soft-touch paper, not a measured mouse; PU soft-touch is about 1.05-1.2 g/cm³, so 1.0 is a floor | UPDATE (fill b08-4): soft-touch can be 2-3 µm (Covestro 2021); the slide names RadTech's test film as the rival and says so in a foot line |
| F-110 pencil 9H gouge / 7H scratch (srf_f110), C-299 3H/3H, H-167 8H | b08_coating | ASTM D3363 on blasted steel, not plastic; gouge and scratch are different ratings | Compare gouge with gouge; say "on Cerakote's tests" (F21.10) |
| QUV 1,000 h "no visible sign of degradation" (srf_quv) | b08_uv | It is C-7300 on a COR Alpha photopolymer, a visual rating, no ΔE; not F-110 | Say "a Cerakote coat on 3D-printed plastic", visual, no number invented |
| Old twotone "33 g painted, 29 g plain" | b08_twotone | Finalmouse does not say what the 4 g is (srf_prophecyW note) | Dropped: implied a false cause |
| Wheel 0.900 g (srf_wheel3d) | b08_wheel | 508.5 mm³ × 1.77 g/cm³ (AZ31B) = 0.900 g; × 2.70 (6061) = 1.373 g: both check | Reuse; PMM 1.0 g is the maker's figure |

## Research gaps (web-search budget used up at ~07:45; per BROADCAST-search.md, for the next run to fill in one pass)
1. b08_wheel, the test group Brock asked for: measured weights of stock plastic scroll wheels with rubber tyres (wheel
   alone, no axle). Queries: "stock scroll wheel weight grams rubber" ; "Logitech G Pro X Superlight scroll wheel weight
   grams" ; "Razer Viper V2 Pro scroll wheel weight" ; "Pulsar X2 scroll wheel weight grams" ; "Ninjutso Sora scroll wheel
   weight" ; "aftermarket aluminium scroll wheel weight stock wheel comparison" ; r/MouseReview "weighed my scroll wheel".
   Need n ≥ 4 wheels, each with its source. Until then the slide shows the test group as a labelled placeholder.
2. b08_uv, a real-world/classroom yellowing example with a source: "Retrobright ABS yellowing bromine flame retardant"
   (Wikipedia "Retr0bright"), or "newspaper yellows in sunlight lignin classroom experiment". Optional; the slide stands
   without it.
3. b08_uv, a measured colour shift for an unprotected white coating or ABS after QUV exposure (ΔE or ΔYI at 500 to 1,000 h):
   "ABS QUV 1000 hours yellowness index" ; "white polyurethane coating QUV-A 1000 h delta E". Today the rival panel is
   drawn from ULX Pro owners' reports, no rate implied.
4. b08_film, the soft-touch film actually used on mice (the slide uses RadTech 2016's 2 mil test film): "soft touch coating
   thickness microns consumer electronics mouse".
5. b08_film, blast removal on polypropylene: "abrasive blast material removal depth polypropylene 220 grit 30 psi micron"
   or Cerakote's plastics blasting guidance. Brock's "almost as much as it adds" stays his claim, unnumbered (F21.10).
6. b08_twotone, owner reports of painted two-tone wear on mice: "Finalmouse Prophecy paint chipping" / "ULX Prophecy paint
   wear". The slide shows the mechanism (layers on top can chip), not a claim about Prophecy units.
7. b08_gripmap (and any later sweat claim): reopen Derler & Gerhardt 2012, Tribology Letters 45: 1-27,
   https://doc.rero.ch/record/315296/files/11249_2011_Article_9854.pdf (and Derler et al. 2009, Tribology International 42:
   1565-1574, "Friction of human skin against smooth and rough glass as a function of the contact pressure"): which of
   2.18 / 0.61 is dry and which wet on smooth glass. If wetting lowers friction on smooth glass and raises it on rough,
   a sweat panel can come back to the gripmap; if not, the old slide's claim was inverted.
   Queries: "Derler Gerhardt 2012 tribology of skin friction coefficient smooth glass wet dry 2.18" ; "Derler 2009 friction
   human skin smooth rough glass contact pressure wet dry coefficient".
8. b08_film: Cerakote F-110 or H-series SDS (solvent and its density) or a measured dry-film density, to pin the film's
   weight between 0.37 and about 0.5 g. URL in hand: https://www.cerakoteeu.com/?p=20046 (the TDS).
   Queries: "Cerakote F-110 SDS" ; "Cerakote H-series safety data sheet parachlorobenzotrifluoride" ; "Cerakote dry film
   density g/cm3" ; "Cerakote solids by volume".
Status of the gaps after the research run (09:05-09:24): 1 wheels n = 2 (OP1 1.8 g, Zeromouse kit 1.5 g, sellers'); 2
Retr0bright found (unused); 3 QUV Huntsman 2024 (used on b08_uv); 4 soft-touch: no mouse figure, Covestro 2-3 µm (used); 5
blasting: none (stays drawn); 6 Prophecy wear: none (mechanism only); 7 Derler verified (used); 8 film density (used).
