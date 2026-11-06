# B01 progress: intro and close (deck/src/30-b01-intro.js)

Resume here after a restart. Phase A = this plan (done 2026-11-06 ~08:00). Phase B = build, most important first.

## Status (updated 2026-11-06, integrator checkpoint)
- [x] Phase A: read common.md, b01-brief.md, FEEDBACK.md (all), REVAMP.md, DESIGN.md, the old slides (14-b-intro-ex.js,
      14-d-intro.js, 10-i-close.js), 01-core.js, 04-ui.js, 13-sort.js, build.py, research/data; research; storyboards (below).
- [x] KIT.md landed 08:03; build with `cd deck && python3 tools/build.py main --out=b01 --own=30-b01-intro.js`.
- [x] Standing rules of 08:45 read (review file, models checked, true greys, frame one). Review file
      /home/claude/work/review/b01.md: none yet (checked before b01_lighter and again now).
- Build order (most important first): b01_compromise -> CHECKPOINT1 -> b01_lighter -> b01_battery -> b01_density ->
  b01_cover -> b01_illusion -> b01_rank -> b01_listed -> b01_price -> b01_budget -> b01_targets -> b01_close.
- Slides DONE (errs ok, qa clean at settle and mid and the beats, frames judged at full and phone size):
  - b01_compromise: rebuilt as a stage on the integrator's review (one flagship big at a time, each compromise happening,
    shrinking into the ledger list; Theseus lands whole in blue with its six answers). CHECKPOINT1.md rewritten.
    Later fix: the X2F's trade now reads "Cut to 87.5 mm" (was "Half a shell": 87.5 of the X2's ~120 mm is 73 %, not half).
  - b01_lighter: F = m · a classroom panel (two carts, same push) + two flick lanes (X3 59.0 g vs Theseus 29.3 g, 0.54 N,
    slowed 20×, moves 5×), scopes MISS/HIT at the 70 ms shot, verdict 132 -> 66 ms, payoff lines. qa clean 0.02 to 10.5.
- Models and conventions checked: written (below, 14 entries).
- BROADCAST-0850 (plan 5 in KEY_PARTS): rebuilt and re-shot b01_compromise (0.02, 1.6, 2.6, 9) and b01_lighter: the
  battery fill and the optical current path read MS_BATTERY (now key y 12.45 to 37.45) and land on the battery; the V4 Pro's
  switch boxes (key -11/+11, -34) are a generic placement for a rival's switches (KEY_PARTS has no main switches yet; revisit
  when clk_gt01MM lands). No number of mine was derived from the old positions. errs ok, qa clean.
- Review round 1 (review/b01.md, 08:44 to 08:50) acted on, replies in the file: R-b01-1..7 on b01_compromise (X2F "Cut to
  87.5 mm"; Theseus "0.4 %" from B03.mechShare via b01_mechPct(); the counterweight labelled Theseus in blue; "Battery life
  at 1 khz"; the ULX row is now "UltralightX" with RTINGS's words, variant asked of Q1; b03's derived wording in the foot;
  "Battery spent on clicks"). M-b01-1..3 and the integrator's note on b01_lighter: the slide now claims only the mouse's
  own part of a correction (additive, exact for any finger mass): lanes "The mouse's own part", time bars, verdict "The
  time the mouse itself adds to a correction" 132 -> 66 ms, payoff "Half the force spent on the mouse", no 70 ms shot,
  foot line says no pad friction. Waiting on Q2 (finger masses) to add the m_eff ratio.
- Film-level (review/FILM.md): F1 (fold the six trades into the kit's eight-bar ledger at the end of b01_compromise; the
  close answers both) is the integrator's call; I can do (a) and (c). F11 (intro order cover, compromise, lighter,
  battery, listed, density, illusion, rank, price, targets, budget): adopting it (file order) as I build; themes re-set to
  alternate.
- b01_battery DONE (paper; film position after b01_lighter per F11): drag along the listed frontier (V4 Pro 48.9 g /
  306 mAh / 180 h -> HTX Mini 26.9 g / 250 mAh / 80 h) with the battery drawn to scale inside the film's mouse; five light
  mice with no hours shown with their batteries; Theseus 370 mAh, 29.3 g, 200 h (derived pill); verdict 80 -> 200 h;
  "a charge every 33 days, not every 13" at 6 h a day. errs ok; qa clean 0.02/2.8/5/7.4/11; phone checked.
- ALL 12 SLIDES BUILT (10:15). File order = film order (F11, adopted by the integrator): b01_cover (first, night),
  b01_compromise (paper), b01_lighter (night), b01_battery (paper), b01_listed (night), b01_density (paper), b01_illusion
  (night), b01_rank (paper), b01_price (night), b01_targets (paper), b01_budget (night), b01_close (ch 'end', night).
  errs ok at several times each; qa clean at 0.02, mid and settle for all 12.
- Applied since: BROADCAST-0930 (F1 fold into the eight-chapter strip; F11 order; battery on one basis; F17 named unit),
  BROADCAST-0945 (V4 Pro share 13.6 % from Logitech's hours, rounded down; UltralightX = TechPowerUp's 2023 medium only;
  X2F at Pulsar's 29.0 g; HTS Ultra one unit $149 / 31 g), F44.2 (side switches 2 × 0.5 g typical, shell allowance about
  9.3 g, computed), F42.2 (board "a target"), every RESEARCH line (replies in review/b01.md).
- Models-checked list: #1 shell allowance now about 9.3 g (F44.2); #3 is now 13.6 % (Logitech's own hours) not 17.6 %.
- Data layer in 30-b01-intro.js: SRC b01*, B01_MICE (X3, G-Wolves x16, Mini SE, M3K), B01_MORE, b01_all/b01_dens/
  b01_battPts/b01_front/b01_frontCurve/b01_budget, B01_TRADES, B01_X2_HALF + b01_outline, b01_tradeIcon, B01_OPT,
  B01_STAGE/b01_ledgerList (answer mode for b01_close), B01_LT/b01_flick* (lighter physics).
- Checks: scripts/evalpage.js evaluates expressions in the built page; tools/errs.js, tools/qa.js, tools/shoot.js (PAR=1).

## Film position and seams
Film: 1 cover, 2 compromise, 3 battery, 4 targets, 5 lighter, 6 listed, 7 density, 8 illusion, 9 rank, 10 price,
11 budget, [b02_card: "Clicks that land the same, every time"] ... [b11_box: "In the box"], 104 close.
Themes alternate: cover night, compromise paper, battery night, targets paper, lighter night, listed paper, density night,
illusion paper, rank night, price paper, budget night (b02_card follows), close night.
Hand-offs (M9):
- cover -> compromise: the cover's "0 compromises" figure; compromise opens counting the trades the flagships make.
- compromise -> battery: the ledger's battery row (G-Wolves HTS Ultra, 80 h) is the first trade examined up close.
- battery -> targets: Theseus's 200 h at 29.31 g carries into the targets' battery and weight rows.
- targets -> lighter: the weight target (29.31 g against the Starlight X's 41.7 g) -> "why lighter wins".
- lighter -> listed: the weight only helps if it is real: listed against weighed.
- listed -> density: "Theseus, weighed: 29.31 g" -> but weight alone rewards a small mouse (the X2F).
- density -> illusion: the X2F box and the Theseus box, same weight -> which feels lighter.
- illusion -> rank: the two boxes -> ranked by density (the X2F falls, Theseus climbs).
- rank -> price: the density leader board -> what a gram costs.
- price -> budget: $189 for 29.31 g -> where the 29.31 g goes.
- budget -> b02_card: the budget's buttons row lights last ("the triggers") -> clicks chapter.
- b11_box -> close: the box -> the ledger answered, THESEUS.

## Research findings (sources to add to SRC)
- Logitech PRO X3 SUPERSTRIKE (launched Sep 23 2026, shipping Oct 6): 59 g global (61 g EU), up to 135 h at 1 khz (PC Gamer
  leak article: "+50% battery life, up to 135 hours from the original Superstrike's 90 hours at 1,000 Hz polling"), $199.99,
  HITS haptic inductive triggers, HERO 2. Notebookcheck 1404956; ProSettings review 2026-10-06 ("costs an eye-watering
  $199.99"; "weight saving of 2 grams"; "side of the shell can technically flex a little bit"). Dims: Notebookcheck says
  identical to the X2 (EloShapes X2 Superstrike 125.0 x 63.5 x 40.0).
- Pulsar X2F CrazyLight: Pulsar 29 g +/-2 (prisjakt review quoting Pulsar; EveZone), 210 mAh (gaming-st.com, prisjakt),
  no battery life published ("Pulsar oppgir ikke batteritid"), 87.5 x 61.1 x 31.6 mm, $149.95, Pulsar optical switches,
  nRF54L15. No independent scale weight found: use Brock's "at least 29.5 g" (F27 note) labelled "reported".
- G-Wolves (maker pages shop.g-wolves.com, the figures EloShapes aggregates; EloShapes itself loads its data client-side and
  could not be read): HTS Plus Pro 8K ~28 g 117x61x40 solid "no hole pattern" + carbon rod $159; Warg 8K ~28.9 g 117x61x40
  solid + carbon rod $149; Lycan 8K ~28.8 g 119x63x37 solid $132 (PC Gamer: "without poking holes"); HTS Ultra 8K
  Deluxe ~29.5 g / Standard 32.9 g 113x61x40 honeycomb, TechPowerUp scale ~31 g, "G-Wolves advertises up to 80 hours of
  battery life at 1000 Hz"; HTX Ultra 8K ~32.1 g 119.7x64.1x37.1; VUK 8K ~35 g 124.8x64.6x38.1; HTM Plus 8K ~33.47 g
  127x64x37; HT-S2 Pro 8K ~28.4 g 112x61x37; HT-S2 8K ~32.9 g 110x61x37; HTX Mini 8K ~26.9 g 109x60x35, 250 mAh, ~80 h at
  1K; HTR Pro 8K TPU scale ~25 g 92x57x33, 250 mAh (TPU); HTR 8K ~28 g 92x57x35; Fenrir Pro 18.9 g 81.7x61.2x28.3; Fenrir
  Max 22.4 g 75x61x31; HSK Pro v2.0 26.8 g 73.7x56x29; HTS Plus 8K ~46 g 117x61x40.
- Density ranking (scripts/tables.py, 47 wireless): Theseus 0.099 is 2nd, behind G-Wolves HTS Plus Pro 8K 0.098 (maker's
  ~28 g); Theseus is 11th by weight. Warg 0.101, Lycan 0.104 next. X2F 0.175 (33rd). XA25 wired 0.093 (shown, not ranked).
- Finalmouse ULX: TechPowerUp: 250 mAh (3.87 V), "up to two months" claimed, ~20 h at 4000 Hz observed, 38 g scale.
  RTINGS: ULX "flexes and creaks with pressure" (validation report line 14).
- Finalmouse Starlight X: Jauch 250 mAh, no hour rating (tech sheet, validation report); 41.7 g RTINGS, 38 g listed.
- Razer Viper Mini Signature Edition: Razer page: 49 g, magnesium alloy chassis, optical switches Gen-3, 8000 Hz. Price NOT
  fetched (Razer page shows none; search budget gone). Launch price $279.99 (2022) from memory: flag it, ask.
- Zaunkoenig M3K: 24 g, wired 8 khz, EUR 340 (~396 USD) (zaunkoenig.co/m3k). M1K 23.4 g mean (blog). M2K page failed.
- Finalmouse click rig (PC Gamer Sept 2026): end-to-end from start of press: SLX 2.0 ms (TMR at its shallowest, 0.01 mm
  steps), Superstrike 3.0, OP1 8K V2 5.7, V4 Pro 7.5 ms; vendor-run.
- Teaching source for F = m.a: OpenStax College Physics 2e, 4.3, Fig. 4.6: "The same force exerted on systems of different
  masses produces different accelerations"; "acceleration is exactly inversely proportional to mass".
- Click force for human scale: Omron D2FP 0.59 N (SRC omronD2fp). Hand ~0.6 % of body mass (weight-science.json).
- Optical switches: the click chapter derives two optical mains = 18 % of a Viper V4 Pro's battery (+21 % for mechanical).
- X2-family outline: traced from Brock's photo pulsar-x2h-crazylight-base.png (scripts/trace_x2.py), widest 64.9 mm at
  ~87 mm from the nose; scale to the X2F's 61.1 mm and cut at 87.5 mm.

## Storyboards (t in s; settle = held frame)

### 1. b01_cover (night, intro, first, chrome off) settle 7. Replaces `cover` 8/10.
Form kept (F9.11): studio row, THESEUS rising letter by letter out of masks, the gram scale under it with 29.31 g in blue, the
subtitle in three voices, four figures across the foot, the byline. No mouse drawing.
- 0: studio row + rule draw; THESEUS letters rise 0.25 to 1.5 (frame one shows the name starting: G9 header + subject).
- 1.0 to 2.1: the gram scale draws, the blue bar fills to 29.31.
- 2.1 to 3.4: four figures count, one after another: WEIGHT 29.31 g "Weighed, every unit" / MOTION LATENCY, WIRELESS
  0.14 ms "On PIAKNOW'S rig" / COMPROMISES 0 (counts 6 -> 0 with the 6 struck: the six flagships' trades, a callback the
  next slide pays) "Every flagship makes one" / DENSITY 0.099 g/cm3 "Weight per cm3 of its box".
- settle 7: held. Subtitle: "Zero compromises" replaces "objectively better"? NO: keep "In pursuit of an objectively better
  mouse" (his form) and put ZERO COMPROMISES in the third figure (his note says the figure, not the subtitle).
Answers: "PIAKNOW'S should be all capital" -> "On PIAKNOW'S rig" (caps, braces); "instead of 8kh it should say something
about there being zero compromises" -> third figure is now "0 compromises"; "8khz is pretty much standard now" -> 8 khz off
the cover (it lives on b01_targets as Dual 8khz). ntr_stats clause "density ... could be on the cover instead of the 100+
ideas" -> fourth figure is density 0.099 g/cm3. F29.2: rev and answers.

### 2. b01_compromise (paper, intro) settle 10. Replaces `flagships` 6/10, `thesis` 3/10. MOST IMPORTANT.
Problem the film answers (F33.7). A ledger: six flagships, each with what it gave up (red) for what it got; Theseus: nothing.
Rows (sourced):
 1 Logitech Pro X3 Superstrike  gives up WEIGHT: 59.0 g          for haptic, inductive triggers   (Logitech 2026; $199.99)
 2 G-Wolves HTS Ultra 8K        gives up BATTERY: 80 h at 1 khz  for 31.0 g                       (G-Wolves; TPU scale 31 g)
 3 Razer Viper V4 Pro           gives up 18 % of its battery     for optical switches             (derived, as the click chapter)
 4 Finalmouse ULX               gives up STRENGTH: flexes, creaks for 38.0 g                      (RTINGS)
 5 Pulsar X2F CrazyLight        gives up the SHAPE: half a shell, 87.5 mm  for 29.5 g             (Pulsar; reported weight)
 6 XBAB XA25                    gives up WIRELESS: wired only    for 24.9 g                       (XBAB)
 7 THESEUS                      gives up NOTHING  29.3 g, 200 h, mechanical SPDT, solid, 119.3 mm, Dual 8khz
Layout: full width. Each row: a small outline icon of the trade (drawn, causal micro-motion: the weight needle, a battery
draining, a switch pulsing its LED into a battery, a shell flexing under a finger, the back half sliding away, a cable
plugging in), the name, GIVES UP (red), FOR (ink). One precision per column (weights 1 dp).
Beats: 0 header + row frame + first name; 0.6 to 5.0 the six trades light in turn (0.7 s each, one focal point); 5.2
Theseus's row wipes in blue, every trade answered; 6.4 the count lands: "6 flagships, 6 trades" -> "THESEUS: 0" (verdict);
7.4 the thesis line: "Optimization over opinion: every trade measured, then designed out." settle 10.
Answers: flagships "need to derive all empty data" -> no blanks: every row has a sourced value (derived ones say so);
"one number has more decimal places than others" -> one precision per column (g to 1 dp, h whole); "superstrike x3 is more
of a flagship than gpx2" -> the X3 replaces the GPX2. thesis "all of these numbers feel very random" -> the specimen tiles are
gone; every number here belongs to a named mouse's trade; "the message is good but you can add it to the slide about other
companies misadvertising weights" -> the message goes on b01_listed ("the weight on the card is the scale's") and closes this
slide as one line. F18.4 (keep price charted) -> price is charted on b01_price (with the Mini SE, M3K, X3); each name here
carries its price under it. F24.1: thesis's note was saved by the bug; answered as written.

### 3. b01_battery (night, intro) settle 11. Replaces `market` 8/10. Important idea (F33.5).
Problem: lighter mice give up hours. Rival named: G-Wolves HTS Ultra 8K (31 g, 80 h listed), HTX Mini 8K (26.9 g, 80 h),
Viper V4 Pro (48.9 g, 180 h).
Stage (>= 60 %): left 1100 px: hours at 1 khz (listed) against weight, the frontier (smooth monotone, ink) through the listed
frontier points; unlisted light mice derived from their battery at the Viper V4 Pro's draw as hollow points (upper bounds),
named. Right: a mouseSimple top view with its battery drawn to scale inside (rect sized by mAh at 3.5 to 4 mm thick).
Beats: 0 header + chart frame + the V4 Pro point (180 h, 306 mAh battery drawn); 1.0 to 4.6 the pointer drags the weight
lighter: the marker rides down the frontier, the battery inside shrinks (306 -> 250 mAh), hours count down 180 -> 80
(causal: the pointer moves the mouse's weight; the battery follows); 5.0 Theseus at 29.31 g: the same weight, a 370 mAh
battery: its marker leaves the curve and rises to 200 h; 7.0 verdict "80 -> 200 h" (+150 %, the lightest that list hours
against Theseus), "Higher is better"; 8.0 player line: "A charge every four weeks at 6 h a day, not every two." settle 11.
Answers: "make a bigger argument how most mice compromise battery life for weight" -> the trade is animated along the
frontier with the battery shrinking inside the mouse; "research harder to find missing weights" -> G-Wolves (TPU 31 g, 25 g),
X3 59 g, X2F 29.5 g reported, Sora V2; "or derive" -> unlisted hours derived from each battery at the V4 Pro's draw, marked.

### 4. b01_targets (paper, intro) settle 10. Replaces `targets` 8/10, `targets2` 7/10.
One dense calm slide: the target sheet. Headline: weight against the Starlight X: 41.7 g -> 29.31 g, -30 % (verdict).
Rows (best shown -> Theseus target, which way is better): Weight 41.7 (SLX, RTINGS) -> 29.31; Report rate: "Dual 8khz
wired and wireless" (most do one or the other at 8 khz: V4 Pro wired 8 / wireless 8? keep as a quiet tile); Motion latency
wireless 0.34 (V4 Pro, PIAKNOW) -> 0.14 ms; Click latency 72 (XA25, XBAB) -> 70 us; Press to PC: SLX 2.0 ms (Finalmouse rig)
-> target under 2.0 ms with the reasons (no free play, Direct Drive, NC release) [ASK Brock: physics note below]; Battery
180 h (V4 Pro) -> 200 h; Frame sync 42 us (matches SensorLock); Sensor PAW3970 (the V4 Pro's). Set-down and idle sleep OUT.
Demonstration: each latency row is a race (a pulse runs press -> PC on a time track; Theseus's arrives first); weight row a
balance. Rows race in turn (one focal point).
Answers: "mark it as dual 8khz" -> "Dual 8khz wired and wireless"; "press to pc should be shorter ... mechanical latency" ->
target now under the SLX's 2.0 ms, with the mechanical-latency work named; "compare to starlight x weight for the headline"
-> headline 41.7 -> 29.31 g; "set down and idle sleep ... not important enough this early" -> both removed.

### 5. b01_lighter (night, intro) settle 12. Replaces `zerograms` 5/10. Important idea (F33.5, F9.26).
Argument: theoretical ease of control and target-change speed from F = m.a, the mouse's own inertia. Rival: Pro X3
Superstrike, 59.0 g (callback to the ledger's weight trade).
- 0 header + classroom panel (demoPanel "THE CLASSROOM VERSION", OpenStax 2e 4.3): two carts on a track rolling right at
  the same speed, one 2m, one m; the same push back (forceArrow, same length, "same push").
- 0.8 to 3.4: both brake, the light cart stops in half the time and half the distance and reverses first (strobe ghosts every
  50 ms, stop marks). Caption under: "Same push, half the mass: it stops and turns in half the time."
- 3.8: camera to the mouse: two lanes (Pro X3 Superstrike 59.0 g, Theseus 29.3 g), a flick right at 0.5 m/s, the same finger
  push 0.6 N (one click's force, Omron D2FP 0.59 N) to stop and reverse onto the target; shotInset crosshair over a target:
  the X3 overshoots (MISS at the moment of the shot), Theseus lands (HIT).
- 7.0 verdict: reversal 98 -> 49 ms (-50 %); stop overshoot 12.3 -> 6.1 mm; "the same push turns it twice as fast".
- 8.2 payoff: "Half the push for the same flick: a higher skill ceiling" (F33.7). settle 12.
Math: t_stop = m v / F; d = m v^2 / 2F; reversal 2 t_stop. 59 g, 0.5 m/s, 0.6 N: 49 ms, 12.3 mm; Theseus 24 ms, 6.1 mm.
"The mouse's share: your hand's own mass comes on top" in the source line (honest, weight-science.json).
Answers: "needs more reasoning, argument feels weak" -> F = m.a worked on screen with a classroom demo then the mouse;
"more about theoretical ease of control and target changing speed" -> the slide measures stop-and-reverse time and the force
for the same correction; "overall speed feels outlandish" -> no end-to-end speed claim; only the mouse's own inertia.

### 6. b01_listed (paper, intro) settle 10. Replaces `weightgap` 10/10 (keep data and honesty, raise the motion).
Each mouse's listed weight slides to its weighed weight (a scale needle per row, or the bar grows from 0 to the gap); the gap
fills red; Theseus last: weighed, printed, 0.00 %. Thesis message line: "The weight on the card is the scale's."
Beats: 0 header + list frame; 0.5 to 4.5 rows resolve (listed figure -> scale figure, gap bar in red where over 3 %);
5.0 Theseus: a scale reads 29.31, the card prints 29.31, gap 0.00 %; 6.4 verdict: worst listed gap -> 0.00 %; settle 10.
Answer: "no comment" -> kept, motion raised; plus the thesis's message, as he asked on `thesis`.

### 7. b01_density (night, intro) settle 11. Replaces `ntr_density` 9/10. Important idea (F33.5).
Problem first: the X2F's wrong idea. 0: header + a full X2-family outline (top view, outline only); 0.6 to 2.6: the cut:
the rear half slides off (87.5 mm left), "29 g ... by being less mouse" (the palm has nothing to rest on: a palm silhouette
drops onto empty pad). 3.0: the fix: density. Both outlines get their box (L x W x H drawn as a box around each, cabinet
projection, outlines only); volume counts; weight / volume: X2F 29.5 / 168.9 = 0.175; Theseus 29.31 / 297.0 = 0.099;
6.0 verdict 0.175 -> 0.099 g/cm3 (-43 %, lower is better); 7.5 why it matters to the player: "a full hand of mouse: palm,
fingers and grip, at a half shell's weight"; Pwnage's average 0.30 g/cm3 as context. settle 11.
Answers: "only use the outline or silhouette" -> outlines only, both; "good understandable demonstration" -> the box stays;
"sell why low density is important a little better" -> the payoff names what the player keeps (palm support, grip,
control) and the next slide proves it feels lighter; "the x2f having the wrong idea should come first, show the problem
first" -> the cut opens the slide.

### 8. b01_illusion (paper, intro) settle 10. Replaces `ntr_sizewt` 9/10.
Classroom demonstration: Charpentier's two objects of equal mass (a small block and a big block on a balance: level), a
grey hand lifts each: a "felt weight" needle says the small one feels heavier (Charpentier 1891 via Murray et al. 1999;
Buckingham 2014). Then the two mice in their boxes (X2F outline, Theseus outline only), the same weight on the balance
(29.5 / 29.3), the bigger feels lighter. Payoff: "Same weight, more mouse: Theseus feels lighter than its 29.31 g."
Answers: "find an outline of the x2f to add to the box" -> the X2 family outline traced from Pulsar's own photo, cut to
the X2F's 87.5 mm and 61.1 mm, in the box; "the theseus should only be the shape outline" -> outline only.

### 9. b01_rank (night, intro) settle 11. Replaces `ntr_densrank` 9/10.
Re-rank race: the 12 lightest wireless mice by weight (left) re-sort to their density ranks among all 47 (right).
Theseus 11th -> 2nd. G-Wolves included (maker figures; TechPowerUp scale where weighed). X2F at 29.5 g (reported) 12th ->
33rd. XA25 shown above, wired, not ranked (F12.3). One precision for every mouse: weight 1 dp, density 3 dp.
Headline: "11th -> 2nd". Honest note: the one ahead, G-Wolves HTS Plus Pro 8K, at its maker's ~28 g.
Answers: "x2f is lighter and lacks decimal points" -> 29.5 g (reported, at least), 1 dp like every other; "theseus has an
extra decimal point" -> 29.3 g; "use eloshapes to take g wolves mice into account ... more honest" -> 16 G-Wolves wireless
mice ranked (maker figures as EloShapes lists them; EloShapes itself could not be read from this session), Theseus 2nd.

### 10. b01_price (paper, intro) settle 10. Replaces `pricefront` 7/10.
Price against weight, wireless full shells' Pareto front drawn as a smooth monotone curve that continues its trajectory past
both ends (no kink, no flat run). Added: X3 Superstrike $199.99 59 g; Viper Mini SE 49 g ($279.99: source to confirm);
Zaunkoenig M3K 24 g EUR 340 (~$396, wired, ringed); XA25 wired ringed. Theseus $189 at 29.31 g past the front.
Demonstration: the pointer slides a "lighter" handle along the front: the price climbs as the weight falls (what a gram
costs); the front ends; Theseus sits beyond it. Headline: "-23 % weight at the ULX's $189" or the gap to the front at $189.
Answers: "the bottom pareto line instantly going straight ... continue on the trajectory ... never a kink" -> the curve's end
tangents continue and fade; "viper mini signature edition and zaunkoenig mice need to be on this table" -> both plotted;
"and the x3 superstrike" -> plotted.

### 11. b01_budget (night, intro) settle 11. Replaces `budget` 6/10, `ntr_stats` 4/10.
A scale: parts drop onto the pan one by one (battery, board, buttons, wheel and axle, inserts, screws, wires), the display
counting up; the remainder for the shell and skates drawn last (computed, 10.35 g). Every number computed at draw time from
THESEUS, RDATA (Jauch), the deck's constants (wheel 0.9 g, titanium screws, wires), so a change anywhere updates it.
Battery's hours (200 h) and density on it as the stats that belong here. Hand-off: the buttons row lights last.
Answers: budget "a lot of work to keep updating" -> computed live from the shared data, no hand-typed totals. ntr_stats:
"density ... on the cover" -> cover; "capitalize the P in Piaknow" -> PIAKNOW'S on the cover; "all of this information is
important but would fit better in other slides" -> weight and hours here, density on cover/density, price on price, motion
latency on targets; "Dual 8khz wired and wireless" -> targets; "don't capitalize the H in khz" -> khz everywhere.

### 12. b01_close (night, end, chrome off) settle 9. Replaces `close` (not rated).
The ledger from b01_compromise, all six trades in red, each struck and answered in blue by Theseus (59.0 g -> 29.31 g;
80 h -> 200 h; 18 % of the battery -> 0 %: mechanical SPDT; flexes and creaks -> solid arched shell; half a shell -> a full
119.3 mm; wired only -> Dual 8khz wired and wireless); then THESEUS rising, "Zero compromises", the byline. No shell drawing
(F12.2, 2D film). Brock's quote kept small? (decide at build; it was his).

## Open questions for Brock (multiple choice, report)
1. Press to PC target: (a) "under 2.0 ms" as now (his "shorter"), (b) drop until a prototype is measured, (c) a number he
   gives. Physics: Finalmouse's 2.0 ms is the SLX's TMR at 0.01 mm; a mechanical switch needs its pre-travel first.
2. Density rank: G-Wolves HTS Plus Pro 8K at its maker's ~28 g puts Theseus 2nd (0.098 vs 0.099). Keep (honest, his words)?
3. Viper Mini SE price $279.99 (2022 launch, not fetched this session): confirm.
4. X2F at 29.5 g: confirm the source he saw.

## Research gaps (search budget used up 07:50; each: what is missing, the query or URL that fills it, the slide it feeds)
1. Razer Viper Mini Signature Edition: US price (using $279.99, Razer's 2022 launch price, from memory, flagged in SRC.b01MiniSe),
   battery hours, L x W x H. Query: "Razer Viper Mini Signature Edition price $ battery life hours dimensions mm"; URLs: Razer's
   2022 press release, rtings.com/mouse/reviews/razer/viper-mini-signature-edition (full data), techpowerup.com review (robots).
   Feeds b01_price.
2. Logitech Pro X3 Superstrike: a scale weight (RTINGS or TechPowerUp), battery capacity (mAh), and the dims conflict (EloShapes
   X2 Superstrike 125.0 x 63.5 x 40.0 vs ProSettings 118 x 62 x 39). Query: "Logitech G Pro X3 Superstrike RTINGS default weight",
   "Pro X3 Superstrike teardown battery mAh". Feeds b01_compromise, b01_battery, b01_price.
3. Pulsar X2F CrazyLight: an independent scale weight (Brock: reports say at least 29.5 g; Pulsar lists 29 g +/- 2). Query:
   "Pulsar X2F CrazyLight weighed grams review scale" (RTINGS when published, YouTube/Reddit reviewers). Feeds b01_compromise,
   b01_density, b01_illusion, b01_rank, b01_price.
4. EloShapes: the G-Wolves wireless line's weights and L x W x H as EloShapes lists them (used G-Wolves's own pages), and
   EloShapes top outlines of the X2F (used a trace of Pulsar's X2H base photo). URL: https://www.eloshapes.com/mouse/compare?p=
   g-wolves-hts-plus-pro-8k (data loads client-side; this session could not read it). Feeds b01_rank, b01_density, b01_illusion.
5. G-Wolves HTS Plus Pro 8K: an independent scale weight (it tops the density ranking at its maker's ~28 g: 0.098 vs Theseus
   0.099). Query: "G-Wolves HTS Plus Pro 8K review weight grams". Feeds b01_rank.
6. Ninjutso Sora V2 / V3: maker-listed hours at 1 khz and battery mAh (a retailer lists 80 or 90 h). Query: "Ninjutso Sora V2 8K
   battery life hours 1000 Hz mAh". Feeds b01_battery.
7. Zaunkoenig M2K: price, weight, dims (zaunkoenig.co/m2k failed to load). Query: "Zaunkoenig M2K price weight grams dimensions".
   Feeds b01_price.
8. Flick kinematics for b01_lighter's worked example (uses 0.5 m/s and a click's force as an illustration). Query: "gaming mouse
   flick peak velocity deceleration study FPS aiming kinematics". Feeds b01_lighter.
9. Size-weight illusion magnitude at a 1.76x volume ratio (to put a number on "feels lighter"). Query: "size-weight illusion
   magnitude volume ratio heaviness rating Buckingham 2014". Feeds b01_illusion.
10. Press to PC for a mechanical switch on Finalmouse's rig (to set Theseus's target honestly against the SLX's TMR 2.0 ms).
   Query: "end-to-end click latency finger press mechanical switch pre-travel ms". Feeds b01_targets.
11. Finalmouse Starlight X hours: Finalmouse publishes none (Back2Gaming). Not fillable by search; derived from its 250 mAh.
12. Pulsar X2 (full size, V2/H) length, to say on b01_compromise and b01_density that the X2F's 87.5 mm is the X2 cut short
   (the trace puts the X2 at about 120 mm). Query: "Pulsar X2 V2 dimensions length mm 120". Feeds b01_compromise, b01_density.
13. Gaming flick speeds for a fingertip correction (to cite the 0.5 m/s of b01_lighter rather than call it an illustration).
   Query: "mouse aiming micro-correction velocity m/s fingertip study". Feeds b01_lighter (see 8).

## Models and conventions checked (08:45 rule: what, where, the check, the verdict)
1. Theseus's 29.31 g (THESEUS.mass, 05-data.js). Check: a target (Brock, 2026-11-04), not a weighing; ntr_budget()
   (14-b-intro-ex.js) takes it as given and backs the shell out as the remainder (shell = 29.31 - parts = 10.35 g), so the
   budget cannot "prove" 29.31 g. Verdict: kept as Brock decided (F21.1 "Budget is the target"). On my slides it is the target
   weight; b01_budget labels the shell "what the budget leaves", never as derived; b01_listed must not show Theseus "weighed"
   (no unit exists): it shows the promise (the card will print the scale's weight), not a measurement.
2. 200 h (THESEUS.hours). Check: LP402535JU 370 mAh x 3.7 V = 1.369 Wh (Endrich listing; Farnell says 380 mAh, lower used);
   the V4 Pro's 1 khz draw = 306 mAh x 3.87 V / 180 h = 1.184 Wh / 180 h = 6.58 mW; 1.369 / 0.00658 = 208.1 h; shown as
   200 h (rounded down). Assumes Theseus draws what a V4 Pro draws; the V4 Pro's optical switches take ~17.6 % of that and
   Theseus has none, so the true figure is likely higher. Verdict: sound, conservative, labelled derived.
3. 17.6 % to the clicks (b01Optical; B03.optShare in 30-b03-switch.js). Check: 5 mA x 30 us per 1 ms = 0.15 mA a switch
   (Omron D2FP's test pulse, a proxy: Razer's pulse is unpublished), x2 = 0.30 mA over 306 mAh / 180 h = 1.70 mA = 17.6 %.
   The old slide said "18 %" (rounded up, against a rival). Verdict: shown as 17.6 %, labelled derived, same as b03.
4. Density = grams / (L x W x H / 1000), g/cm3 (old ntr_density, "Pwnage's way"). Check: the bounding box, the same rule for
   every mouse (humps and waists count as volume for all). Theseus 29.31 / 297.03 = 0.0987 (the old slide's 278.6 cm3 was
   stale; F12.11 fixed the dims); shown 0.099, which rounds Theseus UP (against it); ranks use unrounded values.
   Verdict: kept; the slide says "the box it fits in".
5. One precision per column (Brock, F27 on ntr_densrank). Check: weights at 0.1 g, Theseus 29.3 g in tables (29.31 only as
   the budget's sum). A maker's whole-gram figure then shows as "59.0 g", more precision than the maker gave; the foot line
   names each figure's origin. Verdict: kept per Brock; noted.
6. Rival weights: a scale over the maker (exWeight, 14-a-exdata.js). Check per mouse: HTS Ultra TPU scale 31 +/- 1 g (maker
   29.5 Deluxe); HTS Plus Pro / Warg / Lycan maker "~" figures, no scale found (likely optimistic, which only hurts Theseus's
   rank: honest); X2F 29.5 g "reported" (Pulsar 29 +/- 2); X3 59 g maker (61 g EU); ULX 38 g TPU scale. Verdict: kept, evidence
   per figure.
7. The flick (b01_lighter). Check: stop t = m v / F, overshoot d = m v^2 / 2F, back 2 sqrt(d m / F) (push, then brake), total
   (1 + sqrt 2) m v / F: linear in m, so the 2:1 ratio holds for any v and F. v = 0.5 m/s (an illustration, gap 8/13),
   F = 0.54 N (GT01 55 gf x 9.807, SCALE.click, clk_gt01). X3 0.059 kg: 54.6 ms, 13.66 mm, 131.9 ms -> "132"; Theseus
   0.02931 kg: 27.1 ms, 6.78 mm, 65.5 ms -> "66" (rounded against Theseus); net -50.3 % shown "-50 %" (toward zero). The shot
   at 70 ms: X3 12.6 mm past (miss), Theseus home (hit). Counts the mouse's own inertia only; the fingers and hand move too
   (the hand ~0.6 % of body mass), the same for both, so a whole-arm flick's gap is smaller. Verdict: kept (F9.26 asks for the
   F = m a argument); the foot line says "The mouse's own inertia only"; drawn 5x / slowed 20x stated on screen.
8. The classroom carts (b01_lighter). Check: masses 2:1, the same push; a = F/m, stop time v/a and distance v^2/2a halve
   (OpenStax 2e 4.3). Verdict: correct.
9. Battery chart (b01_battery, next). Check: the storyboard called hours derived from a battery at the V4 Pro's draw "upper
   bounds": wrong, another mouse may draw more or less (sensor, MCU, radio, switches). Verdict: hollow points labelled
   "estimated at the V4 Pro's draw", never "up to"; listed hours stay the maker's claims at 1 khz.
10. Pareto frontiers (b01_battery, b01_price). Check: drawn as a monotone curve through the non-dominated points with tangent
   extensions (no kink, F27 pricefront); between points the curve is a guide, not a product. Verdict: kept; dominance logic in
   b01_front to be re-checked on build.
11. Budget parts (ntr_budget, NTR_BUD). Check: wheel 0.9 g (F22.1) + POM axle 84.3 mm3 x 1.42 = 0.12 g; inserts 4 x 15.23 mm3
   x 8.47 = 0.516 g; titanium screws 4 x 23.59 mm3 x 4.43 = 0.418 g (F25.4); wire 109.1 mm x 0.729 mg/mm = 0.080 g (0.49 lb
   per 1,000 ft = 0.729 g/m); arithmetic all correct. The buttons (3.328 g) are the XA25's as XBAB weighed them, a stand-in;
   if Theseus's triggers are cut from the shell they double-count. Verdict: kept, "stand-in" on the slide; flagged.
12. "Half a shell" (my own b01_compromise label). Check: the X2F is 87.5 mm of the X2's ~120 mm, 73 %. Verdict: wrong,
   replaced by "Cut to 87.5 mm".
13. The X2F outline (B01_X2_HALF): traced from Pulsar's photo of the X2H base (the same family), scaled to 61.1 mm wide, cut
   at 87.5 mm. Verdict: an approximation, labelled "traced from Pulsar's photo" in SRC.b01X2Trace; outline only.
14. Prices: ULX $189 (Notebookcheck launch 2023; Finalmouse store feed), X3 $199.99 (Notebookcheck), Mini SE $279.99 (memory,
   flagged, gap 1), M3K EUR 340 ~ $396. Verdict: the Mini SE price stays flagged until filled.
