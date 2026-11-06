### INT-0855 + b01-8 (b01_lighter): finger-segment masses for a fingertip flick, and mouse mass vs aiming studies  [Q2]
- **Changes a claim on screen.** The verdict "Back on target after a turn 132 → 66 ms" and "half the time" use the mouse's
  mass alone. With the fingertips that move with the mouse, the same model gives about a third less time, not half.
- Per-phalanx masses (the one source found with values per segment): Mirakhorlo et al. 2016, "Anatomical parameters for
  musculoskeletal modeling of the hand and wrist", International Biomechanics 3(1), Table 1. One fresh-frozen right arm
  (female, 87 y). Masses are **estimates** (finger segments as cylinders from bony landmarks, not weighed; hand from the
  Zatsiorsky 1990 regressions): hand 450 g, all fingers 118 g, palm 332 g.
  Index: proximal 13.31, middle 6.74 g, distal not estimated (missing landmark). Middle finger: 14.96 / 6.41 / 5.84 g.
  Ring: 9.91 / 5.77 / 4.83 g. Little: 6.50 / 3.49 / 2.66 g. Thumb: proximal 8.75, distal 10.08 g (metacarpal 18.55 g).
  https://research.tudelft.nl/files/4755868/Anatomical_parameters_for_musculoskeletal_modeling_of_the_hand_and_wrist.pdf
- Derived (say "Derived" on the slide): the distal and middle phalanges of the index and middle fingers =
  6.74 + 5.84 (index distal taken as the middle finger's) + 6.41 + 5.84 = **about 25 g**. With the thumb's distal
  (10.08 g) and the ring finger's distal and middle (10.60 g), which hold the sides: **about 45 g**.
- What it does to b01_lighter's model (stop + return time is proportional to the moving mass, since d ∝ m makes
  2√(d·m/F) ∝ m too; checked): the ratio of times is (29.3 + m_f) / (59.0 + m_f).
  Mouse alone: 0.50 (132 → 66 ms, as now). With 25 g of fingertips: 0.65 (about 188 → 122 ms, **35 % less**). With
  45 g: 0.71 (29 % less). A wrist flick moving the whole hand (445 g, below): 0.94 (6 % less).
  Caveat: this counts the fingertips as mass the same muscle effort must also move. If "the same push" means the contact
  force between finger and mouse, the mouse-only ratio is right but the hand must make more effort; either way the
  slide should not imply the player gets back on target in half the time.
- Studies of mouse mass vs aiming (already in research/data/weight-science.json, checked 2026-11-03, not re-fetched):
  Conroy, Toth & Campbell 2022 (Applied Ergonomics 99:103637; n = 72 gamers; 50, 60, 90 vs 100 g): the three lighter mice
  all about 4 % faster and 9 % more accurate than 100 g (a threshold, not a slope; lightest tested 50 g). Yan et al. 2022
  (HFES; n = 12; 40 to 140 g): 40 g had the highest error rate, 60 g preferred. Wang et al. 2023 (IJIE; n = 16 pros;
  80 vs 87 g): no significant difference. Chen, Lee & Cheng 2012 (office; 70 to 190 g): wrist motion and EMG lowest at
  130 g. No newer study or any below 40 g found (query 7 below).
- Honest framing: measured gains from lighter mice are a few per cent (Conroy 2022), so "half the time" must be labelled
  as the mouse's own inertia in the headline's label, not only in the foot line; or show the fingertip-inclusive figure
  (about 35 % less) as the headline.
- Confidence: medium. One specimen, estimated (not weighed) segments, index distal missing; but its 450 g hand matches a
  73 kg man's 445 g (de Leva 1996), so the figures are about right for an adult male hand. Real fingers rotate as well as
  translate, so their effective added mass is somewhat below their sum; 25 g is an upper estimate for two fingertips.
- Queries: "finger segment mass grams index finger distal middle proximal phalanx inertial parameters"; "index finger
  segment masses kg proximal middle distal phalanx table biomechanical model Esteki Mansour Darling Cole"; "Mirakhorlo
  anatomical parameters musculoskeletal modeling hand wrist segment mass phalanges cadaver" (found it). Also seen, no
  per-segment grams: Tsakonas et al. 2023 Healthcare Tech Letters (inertias only, cylinders, ρ 1.16 g/cm³); Sancho-Bru
  2001 J Biomech 34:1491 (method only, ρ 1.1); Lee, Jung, Mo & Min, IEA 2018 (method only).

### b04-2, b04-12, b05-G4, b06 (chapter-wide), b07-1: grip squeeze and press force on a mouse (b04_sag, b04_skates, b05_nopick, b05_margin, b05_hotspot, b06_*, b07_board, b07_arms, b07_sides)  [Q2]
- **No published measurement of grip or press force during FPS or esports play was found** (queries below). The best
  sourced figures are office computer work with force-sensing mice, plus one study of aiming under pressure:
  - Johnson, Hagberg, Hjelm & Rempel 2000, Scand J Work Environ Health 26(5):398-405 (16 office workers at their own
    workstations, 3 days): mean side (grip) force **0.43 N = 0.6 % MVC**; mean button force **0.35 N = 0.8 % MVC**.
    Measured. Derived from these: a full-strength squeeze ≈ 0.43 / 0.006 ≈ **72 N** (the deck's "about 72 N max" is this
    derivation; the abstract gives no MVC directly). https://www.sjweh.fi/article/560
  - Won, Johnson, Punnett & Dennerlein 2009, J Electromyogr Kinesiol 19:428-436, Table 3 (five computer tasks,
    force-sensing mouse; 6 women, 11 men): mean side force **0.9 N (women) / 1.0 N (men)**; mean **peak side force 2.1 / 2.0 N**
    (peak = the 95th percentile of each grip episode); button peak 1.0 / 1.0 N. Peak side as %MVC 2.6 / 1.9 %, so a
    full-strength squeeze ≈ **81 N (women) / 105 N (men)** (derived). https://stacks.cdc.gov/view/cdc/187303/cdc_187303_DS1.pdf
  - Visser, de Looze, de Graaff & van Dieën 2004, Ergonomics 47(2):202-217: under mental pressure, "During aiming, grip-
    and click-forces increased by 51% and 40% respectively." Relative only (the newton values are in the paywalled
    full text). https://informahealthcare.com/doi/full/10.1080/00140130310001617967
- **Downward (vertical) force on a mouse: no measurement found** (these mice sense side and button forces only). Honest bound:
  the hand's own weight. de Leva 1996 (J Biomech 29:1223, Table 4): hand = **0.61 % of body mass (men), 0.56 % (women)**,
  reference bodies 73.0 and 61.9 kg. Derived: 0.0061 × 73 kg × 9.81 = **4.4 N** (4.8 N at 80 kg; women 0.0056 × 61.9 ×
  9.81 = 3.4 N). A palm resting its full weight on the mouse puts about this much on it; more is an active press.
  https://ebm.ufabc.edu.br/wp-content/uploads/2013/12/Leva-1996.pdf (replaces "Dempster 0.6 %, 4.7 N"; same size).
- Suggested human-scale words: "a click, under 1 N"; "a normal squeeze about 1 N, peaks about 2 N (Won 2009)"; "a
  full-strength squeeze about 70 to 100 N (derived, Johnson 2000, Won 2009)"; "a resting hand about 4 N (de Leva 1996)".
  The 10 N test load (b06, b07) is honest as "a hard squeeze, five times the peak measured in computer work (2 N, Won
  2009)" or "about a tenth of full strength"; not as "typical". Visser 2004 supports "under pressure you squeeze harder"
  (+51 % while aiming) but gives no newtons for gaming.
- Confidence: high for the office figures (measured, peer-reviewed); low as stand-ins for FPS play (gamers likely
  higher). Conflict: Johnson 2000's mean 0.43 N vs Won 2009's 0.9 to 1.0 N (different tasks and mice); cite "about 0.4
  to 1 N".
- Replaces: "10 N, a 1 kg bag of sugar" (keep the load, change the words), "Johnson 2000 office figures" (now with Won
  2009's peaks), "the hand's weight 4.7 N, Dempster" (now de Leva 1996, 4.4 to 4.8 N).
- Queries tried for gaming: "gaming mouse grip force newtons measured study FPS players"; "esports gamers mouse grip force
  pressure sensor study claw palm fingertip newtons squeeze" (extended); "pressure mapping gaming mouse grip claw palm
  fingertip contact force distribution sensor study"; "\"grip force\" computer game playing mouse force-sensing higher
  than office tasks newtons". Results: retailer blogs (attackshark), Sanchis-Sanchis et al. 2024 Applied Sciences 14:7112
  (kinematics only, no force), Van Dyke 2018 (EMG only). Not readable here: Visser 2004 PDF (scispace, needs approval).

### b05-G3 (b05_margin, b05_nopick) and b04-2 stand-in: hand mass as a share of body mass  [Q2]
- de Leva 1996, "Adjustments to Zatsiorsky-Seluyanov's segment inertia parameters", J Biomech 29(9):1223-1230, Table 4:
  hand (wrist joint centre to 3rd metacarpale) **0.61 % of body mass for men, 0.56 % for women** (reference bodies 73.0 kg,
  174.1 cm and 61.9 kg, 173.5 cm). Measured (gamma-ray scanning of living subjects, Zatsiorsky), adjusted.
  https://ebm.ufabc.edu.br/wp-content/uploads/2013/12/Leva-1996.pdf . Dempster via Winter 2009 gives 0.006 (already in
  SRC b01HandMass); the two agree.
- Derived for slides: a 73 kg man's hand ≈ 445 g, weighing 4.4 N; "a resting palm, about 4 N" is honest.
- Confidence: high. Replaces: "about 4 N" unsourced (b05), "Dempster 0.6 %" (b04, fine to keep; de Leva is the primary).

### b02-1 (b02_seams, b02_grooves): fingertip width  [Q2]
- "human fingertips are typically 16–20 mm in diameter" (Dandekar, Raju & Srinivasan 2003, "3-D finite-element models of
  human and monkey fingertips to investigate the mechanics of tactile sense", J Biomech Eng 125(5):682-691, MIT Touch
  Lab). Geometry from epoxy replicas of fingertips; a typical range, not a measured distribution.
  https://dcmpx.remotevs.com/edu/mit/touchlab/PL/publications/2003_009.pdf (also core.ac.uk/download/4402363.pdf)
- Use: "a fingertip, 16 to 20 mm across (Dandekar 2003)". The kit's FINGER.top 16 mm is the range's low end; say "about
  16 to 20 mm" or draw 18 mm.
- Confidence: medium-high (widely cited; stated as typical). Replaces: the kit's unsourced "about 16 mm".
