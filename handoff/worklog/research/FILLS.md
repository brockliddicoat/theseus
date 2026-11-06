# Research fills

Answers to builders' research gaps and REQUESTS.md, newest first. Each entry: gap id (builder and number), the answer, the source URL(s), confidence, and which slide it feeds.

### b10_software-rivals' default lift-off, and b10_cable-stock cable diameter: third look  [Q3]
- **Pulsar: factory setting 1 mm**, on the Pulsar X3 (release notes of a third-party Linux tool,
  packerlschupfer/pulsar-mouse-linux v0.1.23: "An X3 on its factory 1 mm", register `02 0a`; on its cable 0.7, 1 and 2 mm;
  "The dongle's own list is still 1 and 2 mm"). That's one model, read from the mouse by a reverse-engineered tool, not
  Pulsar's own statement. TechPowerUp, Pulsar Xlite V3 eS (PAW3395, the slide's rival sensor): "two pre-defined LOD levels".
  On "1 mm" the sensor "will not track at a height of one DVD (<1.2 mm)"; on "2 mm" it tracks at one DVD but not two
  (1.2 to 2.4 mm). No default stated.
- **Logitech (PRO X SUPERLIGHT 2, HERO 2): Low, Medium or High** "for each DPI slot", set under G HUB's Advanced checkbox or
  the Onboard Memory Manager (Logitech support). No mm values and no default stated. TechPowerUp (Q1, b10-9 part): Low
  and Medium don't track at 1 DVD; High tracks at 1 DVD, not 2.
- **Razer (Viper V3 Pro):** Smart Tracking "Auto-calibrates to maintain a consistent lift-off distance on all surfaces".
  Asymmetric Cut-Off: "Individually set a lift-off and landing distance from up to 26 levels" (Razer's V3 Pro page). No mm
  and no default. For the pattern only, TechPowerUp's older Viper Ultimate: automatic calibration is the default, with
  settings of 1, 2 and 3 mm; at 1 DVD it "does not track on the 1 mm setting, but it does on the 2 mm and 3 mm settings";
  at 2 DVDs, none. Tom's Hardware's V3 Pro review gives no default and no measurement.
- **For b10_software (R2-b10-9):** a PAW3395 rival most likely ships at 1 mm (Pulsar's X3 does), not 2 mm. On the slide's
  own model (drift = 1.5 × lift-off) the fair comparison is **1.5 → 1.2 mm** at the rival's factory setting. Or keep 2 mm and
  say whose pad needs it (a player who needs a little over 1 mm is pushed to 2 mm on a 1-or-2 sensor). Razer's and
  Logitech's defaults aren't published in mm, so don't put a number on them; say "auto-calibrated" (Razer) or "Low /
  Medium / High" (Logitech).
- **b10_cable: still no published stock-cable diameter** (Q1 found none either). These give lengths only: Pulsar's own
  USB-C Paracord ("Compatible with X2, X2H, X2A, Xlite Series") and Superflex ("X2 v2, X2H, X2A, Xlite v3") cables, 1.8 m
  each; Glorious's Ascended charging cable, 2 m; Razer's V3 Pro page ("USB Type C Rechargeable"); Tom's Hardware's V3 Pro
  review ("a 6-foot (1.8m) USB-C to USB-A cable", "sturdy and braided", "heavier and stiffer" than SpeedFlex). The 3 mm
  stays an illustration, said as one. A caliper on two stock cables would settle it.
- Sources: https://github.com/packerlschupfer/pulsar-mouse-linux/releases/tag/v0.1.23 ;
  https://techpowerup.com/review/pulsar-xlite-v3-es/5.html ; https://techpowerup.com/review/razer-viper-ultimate/5.html ;
  https://support.logi.com/hc/en-ph/articles/16193588399511-How-do-I-adjust-the-HERO-2-sensor-Lift-off-distance-LOD-on-my-PRO-X-SUPERLIGHT-2 ;
  https://www.razer.com/mena-en/gaming-mice/razer-viper-v3-pro ;
  https://www.tomshardware.com/peripherals/gaming-mice/razer-viper-v3-pro-review ; https://us.pulsar.gg/products/usb-c-cable ;
  https://us.pulsar.gg/products/usb-c-cable-for-pulsar-mice-and-keyboards ;
  https://overclockers.co.uk/glorious-ascended-charging-cable-black-glo-ascc-ms-b-kb-02n-gr.html
- Confidence: high that Logitech and Razer publish no default in mm. Medium for Pulsar's 1 mm (one model, third-party
  tool). High that no stock-cable diameter is published.
- Queries (5): "techpowerup \"lift-off distance\" \"1 DVD\" default Viper V3 Pro OR \"Pulsar X2\" sensor performance";
  "\"default\" lift-off distance mm Viper V3 Pro OR \"Superlight 2\" OR \"Pulsar X2\" LOD measured review out of the box";
  "Pulsar X2 V2 lift off distance 0.7mm 1mm 2mm default setting Pulsar Fusion software LOD"; "techpowerup Razer Viper V3
  Pro review sensor and performance lift-off distance asymmetric cut-off DVD"; "\"cable diameter\" gaming mouse
  specifications mm paracord USB-C charging cable flagship". TechPowerUp's V3 Pro page 5 (its sensor page) never came up
  in a search, and RTINGS' compare pages serve no test values to this fetcher.

### b08_wheel-stock wheels, sixth pass: Zeromouse's 1.5 g is the Viper V2 Pro's wheel; two old metal wheels; no new flagship figure  [Q3]
- **Razer Viper V2 Pro, stock wheel: 1.5 g, 22.5 mm across.** This is Zeromouse's own comparison table on its carbon wheel
  ("original" 1.5 g, 22.5 mm; carbon 0.7 g, 17.25 mm; "over 50% lighter"). The page names only "our V34 and V35 mod-kit",
  but those kits are built from a Viper V2 Pro. PC Gamer's V34 write-up has you harvest the Viper's PCB, then "reassemble
  the scroll wheel, insert the battery" in the kit's frame. Notebookcheck says Optimum's 16 g build has "nary a scroll
  wheel or side buttons remaining from its Razer Viper V2 Pro donor". The kit's contents (Boing Boing, V35: shell,
  Supergrips, skates, battery sticker, screwdrivers) include no wheel. So the "original" wheel is the donor's. It's a
  seller's figure; tyre and axle not stated. Confidence medium: the identification is an inference across three pages.
  - **Replaces** "the Zeromouse kit's original wheel" (FILLS b08-1 fourth pass) with "Razer Viper V2 Pro stock wheel,
    1.5 g (Zeromouse's figure)".
- **Logitech G502: 13 g; Logitech G500: 11 g.** These come from an owner, ManPhalanges, lightening a G502 on Overclock.net:
  "G502 wheel is 13g, G500 wheel is 11g." "Cheap OEM wheels ... are just 1 gram", and with a rubber ring from a cheap
  mouse "we go from 13g to 2g". No scale is shown and the axle isn't mentioned. These are older heavy metal free-spin wheels,
  not a lightweight flagship's rubber-tyred wheel, so they aren't like-for-like in "Stock wheels in rubber tyres". At most
  they're a contrast.
- **Logitech G900: Logitech claims "a 47% reduction in the wheel weight"** against the G502 Proteus Spectrum's (Legit
  Reviews, G900 review, p. 2). With the owner's 13 g that's about 6.9 g, but that's Derived across two sources, not weighed.
  The G502 Lightspeed swapped the "full, heavy metal wheel ... for a much lighter wheel with a ribbed rubber band"
  (HardwareTracker, Level1Techs, 2019); no grams given.
- **Total for lightweight stock wheels with a source: still n = 2:** Endgame Gear OP1 1.8 g (Forky Mods) and Razer Viper V2
  Pro 1.5 g (Zeromouse). Both are sellers of replacement wheels. Per POLISH (b08_wheel), fewer than two more were found, so
  **drop the two "to weigh" slots**. If a contrast is wanted, a foot line could read "Older metal free-spin wheels: 11 to 13 g
  (G500, G502; an owner's weighing)".
- Dead ends this pass: Japanese, Chinese and Korean modding searches (gcores GPW/GPX article, Bilibili V4 Pro column: whole
  mouse only; Quasarzone threads don't fetch); PMM's V3 Pro Zen 2.0 and OP1 8K shells (whole mouse only); MakerWorld (doesn't
  fetch; the 3dgo mirror of 1909122, a 27 g GPX shell, weighs no wheel); r/MouseReview custom-wheel post for the ULX Tarik
  (Taobao wheel, no grams); LanOC's V2 Pro review (Razer's savings by part: side buttons 2.9 g, RGB 2.7 g, grips 3.2 g,
  trigger covers 0.6 g; no wheel); Pulsar X2F CrazyLight launch coverage (29 g total, no parts).
- Sources: https://zeromouse.co/products/carbon-scroll ;
  https://pcgamer.com/hardware/gaming-mice/want-to-destroy-a-perfectly-good-razer-mouse-the-zeromouse-v34-has-you-covered-for-some-reason ;
  https://www.notebookcheck.net/YouTuber-builds-16-g-gaming-mouse-and-you-can-buy-one-sort-of.876113.0.html ;
  https://boingboing.net/2024/08/16/meet-the-zeromouse-v35-the-lightest-gaming-mouse.html ;
  https://www.overclock.net/posts/25137867 ; https://legitreviews.com/logitech-g900-chaos-spectrum-wireless-gaming-mouse-review_196258/2 ;
  https://forum.level1techs.com/t/logitech-g502-lightspeed-wireless-gaming-mouse/150411 ;
  https://lanoc.org/review/input-devices/razer-viper-v2-pro?showall=1
- Queries (Q3, 15, all standard): "マウス 軽量化 ホイール 重さ 分解 g スケール Superlight OR Viper"; "aftermarket scroll wheel Viper
  V3 Pro lighter than stock wheel grams"; "PMM lightweight scroll wheel mouse mod grams stock wheel"; "\"weighed every
  part\" OR \"weight of each part\" mouse scroll wheel battery shell grams Superlight teardown"; "鼠标 滚轮 重量 克 拆解 原装滚轮
  轻量化 GPW OR 毒蝰 OR X2"; "printables OR thingiverse lightweight scroll wheel mouse \"stock wheel\" weighs grams";
  "MouseReview scroll wheel weighed stock vs 3D printed wheel grams Superlight OR \"G Pro Wireless\" OR Viper"; "forkymods
  lightweight scroll wheel"; "\"component weights\" OR \"parts weight\" gaming mouse \"scroll wheel\" grams battery PCB shell
  reddit"; "\"scroll wheel weighs\" grams gaming mouse"; "Viper V2 Pro scroll wheel weight grams weighed stock wheel"; "Pulsar
  X2 CrazyLight weight reduction breakdown scroll wheel grams lighter components"; "drilled scroll wheel holes mouse mod
  grams before after stock wheel weight Superlight OR Viper OR \"G Pro\""; "마우스 휠 무게 g 경량화 순정 휠 교체 지슈라 OR 바이퍼 OR
  펄사"; "Zeromouse V35 OR V34 kit Viper V2 Pro donor parts reused scroll wheel encoder what you need".
- With Q1's six b08-1 queries, 21 searches have now gone into this gap. Two more weighings would take an owner's kitchen scale
  (0.01 g) and two stock wheels, e.g. a Superlight's and an X2's: the wheel off its axle, tyre on, said as such.

### b03_side-POM friction (the rail's pads): POM on POM dry, PTFE-filled, greased  [Q3]
- **Dry POM on POM, kinetic: 0.35 to 0.40.** DuPont's Delrin "low wear / low friction" brochure (print code L-12259
  04.01), table "Properties of DELRIN®", with the same grade on both surfaces, reciprocating at about 0.08 m/s and 0.196 MPa:
  **Delrin 100 0.4, Delrin 500 0.35** (dynamic). A Delrin 150 property sheet (hpceurope) lists 0.35 "against polyacetal"
  (dynamic, ASTM D1894; the sheet's labels and values are run together, so the pairing is as extracted, medium).
- **Static, dry: no maker publishes a POM-on-POM figure that I could find.** The nearest is DuPont's Delrin Design Guide
  Module III, Table 2 (ASTM D3702 thrust washer, "no lubricant", 50 mm/s, 2 MPa, against AISI carbon steel): standard
  Delrin **static 0.20, dynamic 0.35**. So against steel, POM's static coefficient is *below* its kinetic one. If that
  holds against itself too (an inference), breaking away from rest isn't the worst moment; sliding is.
- **PTFE-filled POM roughly halves it.** Against itself (brochure): **100AF (20 % PTFE fibre) 0.18**, 500AF 0.22, **520MP
  (20 % PTFE micropowder) 0.19**, 500AL ("advanced lubrication") 0.16, 900SP 0.1. Against steel (Module III): 100AF / 500AF
  **static 0.08, dynamic 0.14**; 500CL (chemically lubricated) 0.10 / 0.20. Delrin AF Blend sheet: static 0.18 to 0.19,
  dynamic 0.19 to 0.20 (pair not stated). Polyplastics Duracon SW-01 (POM + PE sliding grade, JIS K7218): 0.14 and 0.21
  (one against steel, one against standard POM M90-44; the extraction doesn't say which is which).
- **Grease: about 0.02 to 0.04 in steady sliding, but measured steel on POM, not POM on POM** (lubricant makers' figures):
  Molykote **PG-54 Plastislip** (silicone oil, lithium-complex thickener), steel ball 12.7 mm on POM, 6.3 N, 10 mm/s, 24 h:
  **μ < 0.04**. Molykote PG-75 (mineral oil / PAO), steel ball on POM, 5 N, 10 cm/s, 24 h: **μ = 0.02**. The Delrin 150
  sheet: oil-lubricated against steel 0.05 to 0.10, water-lubricated 0.10 to 0.20.
- **Conflict: lubrication may not lower POM's *static* friction.** Sabet et al. 2019 (Univ. Minho conference paper,
  "Friction properties of polyoxymethylene (POM) materials in dry and lubricated conditions"; abstract only, counterface
  not stated): lubrication "does not seem to influence the static coefficient of friction" and doubled the dynamic one.
  Ptak et al. 2023 (Aviation 27(4):272-278), POM pin on POM plate, inclined plane, 0.64 to 1.82 MPa: with HLP 68 hydraulic
  oil the static coefficient was *higher* than dry (+31 % at the highest load); dry POM-POM had the lowest static friction
  of the pairs tested; values in figures only. Li et al. 2024 (IEEE Trans. Instrum. Meas. 73, POM pin on POM disk, 40 to
  50 MPa): grease "can reduce adhesion"; no numbers in the abstract. So "greased 0.02 to 0.04" holds for a grease made for
  plastics, in steady sliding. A post that has sat still may need more to break away, and only a test on the real pads
  settles it.
- **What it does to b03's rail model** (Derived; the builder's own formula F = S / (1 − 2μe/Lg), e = 5.75 mm at the tip as
  in b03's reply; it jams when μ ≥ Lg / 2e):
  - Lg 14 mm: dry POM/POM (0.35 to 0.40) **×1.40 to ×1.49**; PTFE-filled (0.18 to 0.22) ×1.17 to ×1.22; greased (0.02 to
    0.04) ×1.02 to ×1.03.
  - Lg 5 mm (jams at μ 0.435): dry POM/POM **×5.1 to ×12.5**; PTFE-filled ×1.71 to ×2.02; **greased ×1.05 to ×1.10**.
  - Lg 3 mm (jams at μ 0.26): dry POM/POM jams; PTFE-filled ×3.2 to ×6.4; greased ×1.08 to ×1.18.
  - If the tip offset e has changed since (b03_side's tip spot moved), recompute with the same formula.
- **Replaces:** the assumed μ 0.2 (it is DuPont's *static* figure against *steel*). For POM on POM, dry, say 0.35 to 0.40
  (kinetic, DuPont), so the dry 5 mm guide is ×5 or worse, not ×1.85, and the 14 mm guide ×1.4, not ×1.2. For the POLISH
  "5 mm guide in greased POM" panel: ×1.05 to ×1.10, said as "with a plastics grease, steady sliding (grease makers' steel-
  on-POM figures)". A PTFE-filled pad (100AF / 520MP) is the sourced middle option, ×1.7 to ×2.0 at 5 mm.
- **Confidence:** high that the values are as the makers print them. Medium for applying them to a button: the tests run at
  0.2 to 2 MPa and 0.01 to 0.5 m/s, far above a button pad's load, and friction of POM falls with pressure and depends on
  speed (Xiong et al. 2018, ILT 70(2):273-281, POM on steel).
- Sources: https://www.emcoplastics.com/assets/pdf/delrin/Delrin%20Low%20Wear%20Low%20Friction%20Brochure%20Dupont.pdf ;
  https://www-eng.lbl.gov/~shuman/NEXT/CURRENT_DESIGN/TP/MATERIALS/delrin_props.pdf (Design Guide Module III, Table 2 and
  footnote f) ; https://www.hpceurope.com/docFichesTechniques/DelrinPlastic.pdf ;
  https://www.professionalplastics.com/professionalplastics/content/downloads/DelrinAFBlendversesDelrin100AF.pdf ;
  https://sushengpolymer.com/media/pdf/gngKzI_DURACON-SW-01.pdf ;
  https://www.galindberg.se/storage/5503E2D447B4878532676CBA04101A2B663229447657A82E5F862D723267693C/bcd8587c0b18459681f9fd489851556f/pdf/media/52728b3000b8446cb0c9eaa45fd8b2ce/MOLYKOTE%20PG-54%20Plastislip%2080-3212B-01.pdf
  (Form 80-3212B-01) ; https://www.dupont.com/content/dam/Dupont2.0/Products/transportation/Literature/Downloaded-TDS/MOLYKOTE%20PG-75%20High%20Performance%20Grease%2071-0171D-01.pdf ;
  https://www.rcaap.pt/vufind/PublicationRecord/rum_3f99bbffdc000434a1bf89383b3b3ddb/Description (Sabet 2019) ;
  https://jest.vgtu.lt/index.php/Aviation/article/download/20650/12095 (Ptak 2023) ;
  https://vufind-test.katalog.k.utb.cz/SummonRecord/FETCH-LOGICAL-c283t-f321b3b7dcfdbd7ee5d39ccf008df89ccb89843ab51caf36f15b44c1ceef79bf3
  (Li 2024, doi 10.1109/TIM.2024.3400329) ; https://www.emeraldinsight.com/doi/full/10.1108/ILT-05-2016-0120 (Xiong 2018).
- Queries (6): "Delrin design guide coefficient of friction Delrin on Delrin static dynamic table"; "Hostaform OR Celcon
  acetal copolymer coefficient of friction against itself static dynamic design guide Celanese" (nothing); "polyoxymethylene
  POM against POM self-mated static and kinetic friction coefficient dry and grease lubricated tribology"; "silicone grease
  plastic lubricant POM on POM coefficient of friction data sheet Klüber OR Nye OR Molykote"; "Duracon POM coefficient of
  static friction dynamic friction against itself same material Polyplastics technical sliding"; "DuPont Delrin acetal
  resin design guide module III pdf coefficients of friction static dynamic". Scribd copies of Module III serve no text;
  Celanese and Ensinger pages gave no POM-on-POM numbers.

### Grip-force addendum (b04, b05, b06, b07): two more searches, still no gaming-mouse newtons  [Q2]
- Botzer, Sahar, Wagner & Elbaum 2021, "Analyzing individuals' grip force over short intervals in a joystick-controlled
  task with and without a stress manipulation", Behaviour & Information Technology 40(5):476-482 (14 participants):
  grip force rose under stress, but only in some people; in about 31 % of comparisons it was significantly higher
  after 5 s, others took up to 30 s, and "not all participants" gripped harder. Relative only, a joystick, not a mouse.
  https://ideas.repec.org/a/taf/tbitxx/v40y2021i5p476-482.html
- Informal: a studio's FSR on an Xbox 360 pad saw grip peaks in firefights (Collier, Game Developer opinion piece; no
  numbers, no sample). https://gamedeveloper.com/business/opinion-force-sensitive-resistor---a-new-biometric-technique
- So "you squeeze harder when it counts" holds on average (Visser 2004: +51 % while aiming under pressure) but varies by
  person; no study reports newtons on a gaming mouse. The office figures (0.4 to 1 N mean, 2 N peaks) remain the only
  measured magnitudes.
- Queries (in total 7 for this gap): the four in the main entry plus "instrumented mouse force sensitive resistors
  esports players grip pressure during aiming study 2023 2024 2025" (extended) and "video game playing grip force mouse
  controller newtons stress arousal squeeze harder study". Also seen: Jang & Sung 2018 (AHFE: wrist motion and EMG in
  games, no forces reported); a 2024 Sci Rep study of grip pressure in seven sports (not mice).

### INT note on common.md M5 ("a grip squeeze several N")  [Q2]
- The house rule's own figure is above what has been measured. Measured squeezes on a mouse in computer work: mean
  0.4 to 1 N, peaks about 2 N (Johnson 2000; Won 2009, entry below). "Several N" is a hard squeeze, not a normal grip. A
  click under 1 N holds (GT01 0.54 N, Gateron claim). A palm resting its weight: about 4 N (de Leva 1996). Suggest M5 read
  "a click is under 1 N; a normal squeeze about 1 N, a hard one several N; a resting hand about 4 N".

### b04-1 / b04-12 addendum: pad softness and a test convention for the press  [Q2]
- Pad hardness, measured (a pad maker's own test, Shore C durometer, 5 readings averaged, ±0.5 HC): Artisan Zero **XSOFT
  4.1 HC, SOFT 19.5 HC, MID 46.2 HC**; FreeFall SV Base Control+ v2 82.7 HC; Pulsar PD170 69.4 HC. Hardness only, no mm of
  sink. https://oriens.gg/docs/bases-hardness/ . Shows how far apart "soft" pads are (XSOFT about a fifth of SOFT's
  reading), but gives no compression under load, so the Pasternak model stays calibrated on Brock's report (Derived).
- A press convention, not a measurement: ProSettings' pad tests put "a 200 gram counterweight ... on top of the mouse" to
  simulate gaming pressure (about 2 N). https://prosettings.net/blog/how-we-test-mousepads/ . Together with the hand's
  weight (4.4 N, de Leva) it brackets a plausible press: about 2 to 4 N, below the slide's 5 N stand-in.
- Confidence: medium (maker and reviewer methods, not peer-reviewed). Query: "mousepad softness measured compression depth
  mm under weight review soft vs firm base foam durometer" (extended).

### b07-7 addendum and b10-7: still no peak g, still no friction coefficient  [Q2]
- Drop peak acceleration: no measured figure found for a small device or box (Kelly, Punch & Goyal 2006, ASME IMECE,
  phone-like test vehicles: values not in the abstract, which stresses their wide scatter; Wang et al., arXiv 2406.07834:
  plots only). Query: "smartphone drop test peak acceleration g measured 1 m drop onto concrete accelerometer study".
  Keep "10 drops from 760 mm, 3.9 m/s at impact" without a g figure.
- PTFE on cloth: a third query ("computer mouse on mouse pad coefficient of friction incline plane experiment measured
  static kinetic physics lab") found only generic friction labs and a forum thread with no numbers. ProSettings measures
  static friction (force gauge; tilt angle) but stopped publishing numbers in May 2026.

### b10-8 (b10_cable): bending stiffness of a stock cable vs a paracord cable  [Q2, taken from Q1's P3 list: no product named]
- **Not found.** Query: "paracord mouse cable vs rubber cable stiffness bending measured flexural rigidity drag test":
  makers' and retailers' guides only (Glorious, Pulsar, Fantech, RAWM, Evetech "deep dives": qualitative, "stiff, rubbery"
  vs "light and flexible"; Evetech's only g/m figures are unsourced FAQ ranges). The stiffness beat stays dropped.

### Q1 closing note: Q1 items not searched this run (so nobody assumes they were done)  [Q1]
- **b03_binning (b)** RTINGS' measured click forces: not fillable from this session. RTINGS renders its pages and tables in the browser, and WebFetch gets only meta text (tried on several RTINGS reviews today).
- **b02-8** front comfort-groove depth; **b10-8** stock vs paracord cable bending stiffness; **b03_switch (c)** Razer's optical-switch LED drive (but see the Logitech optical-only vs hybrid cross-check); **GPX2c** battery mAh: not searched, budget kept for the on-screen items.
- **R-b08_grip** fingertip friction on grip tape and soft-touch coating: skin tribology, nearer Q2's Derler entries. Not taken by Q1.
- **M-b02_pom** POM shim tolerance: Q2's (materials).
- Search log: 82 of Q1's 85 searches used. The queries tried are listed in each entry above.

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

### b04_sensor / b11_repair: Viper V4 Pro on glass, and Razer's warranty on swapped skates (b04_sensor, b04-9, b11_repair, b11_box)  [Q1]
**Counter-reports to Razer's "TRACKS FLAWLESSLY ON GLASS" (≥ 4 mm clear glass) exist; put them beside the claim.**
- **PC Gamer, 2026-05-22:** peripheral reviewer Spec0 found his Viper V4 Pro "unusable on multiple glasspads" (his post, 2026-05-15). Razer first refused the RMA because "We noticed that the mouse's original feet have been removed" and "the limited warranty does not cover issues resulting from improper use or handling of the product". After a call, Razer agreed to replace the unit and said it was "working to define their warranty terms better and look into this sensor issue". PC Gamer's own unit showed no issue on glass, and the author doubts the problem is widespread.
- **Razer Insider, 2026-09-29 to 10-03, owners:** tracking "stops tracking and stutters sometimes" on a Pulsar meiy glass pad and on a white Razer Atlas, at Low or Medium Smart Tracking. "High works better". The unit had stock feet, on firmware v1.04.01_r1. A service centre "confirmed a defect", and the replacement showed the same. No Razer staff reply in the thread.
- **Razer staff on swapping skates (Razer Insider, Razer.Aero):** Razer "may treat that as damage caused by non‑Razer accessories/unauthorized modification", so "keep the mouse completely stock so there's no question about coverage".
**Use:** b04_sensor can keep Razer's glass claim tagged as Razer's, with "owners and one reviewer report stalls on some glass pads (PC Gamer 2026-05; Razer Insider 2026-10)". That's anecdotal, n of a few, not a measured rate. b11 gains a real rival fact: a skate swap can cost the Razer warranty, against Theseus's user-serviceable design.
Sources: https://pcgamer.com/hardware/gaming-mice/replacing-the-viper-v4-pros-skates-gave-one-reviewer-some-razer-warranty-trouble-after-glass-pad-sensor-issues ; https://insider.razer.com/razer-support-45/viper-v4-pro-tracking-issues-on-glass-mousepad-91843 ; https://insider.razer.com/razer-support-45/razer-viper-v4-pro-skates-change-88874 . Queries: "Razer Viper V4 Pro teardown disassembly screws under skates inside PCB battery" (no teardown found; this story came up); "Viper V4 Pro skates warranty glass pad sensor issues reviewer Razer pcgamer". Confidence: high that these reports exist; low on how common the issue is.

### b01-3 addendum: X2F CrazyLight, Japanese-language search (b01_compromise etc.)  [Q1]
Also no measured weight in Japanese sources. Query: "Pulsar X2F CrazyLight 実測 重量 g レビュー". Gaming-ST (2026-09-29) lists Pulsar's "29g ±2g" against the old X2F's "約38g ±1g": the "9 g lighter" is a difference between two claims. It gives ¥19,800 (official store), $149.95, a Japan release of **2026-09-28**, 210 mAh (from Pulsar's pre-launch post, which wrote "210mA"), no battery life on either the Japanese or the US store, and the same 87.5 × 61.1 × 31.6 mm as the old X2F. **The verdict stands: show 29 g ± 2 g, Pulsar's claim.**
Source: https://gaming-st.com/peripherals/pulsar-x2f-crazylight-29g-vs-x2f/

### M-b07_arms / b05_specific: flexural strengths of FR4, ABS GR-2000, Makrolon 2405, AZ91D, 6061-T6 (b05_specific, b07_arms)  [Q1 took the named grades; FR4 is Q2's b07-3]
Q1 ran these because Q2's queue didn't have them. All are makers' typical values, not design minimums.
| Material | Flexural strength | Flexural or tensile modulus | Other strength | Density | Source |
|---|---|---|---|---|---|
| FR4, Gund NEMA FR4 | **LW 552 MPa, CW 483 MPa** (ASTM D790, 0.062 in) | flex LW 20 GPa, CW 18 GPa | tensile LW 430 MPa | 1.85 g/cm³ | Q2's b07-3 entry (Gund PDF) |
| ABS, Denka GR-2000 | **82 MPa** (ISO 178, 2 mm/min); 75 MPa (ASTM D790, 15 mm/min) | flex 2,550 MPa (ISO) | tensile 50 MPa at yield, 35 MPa at break | 1,050 kg/m³ | Denka ABS grade list |
| PC, Covestro Makrolon 2405 | **97 MPa** (ISO 178, 2 mm/min) | flex 2,350 MPa; tensile 2,400 MPa | tensile yield 65 MPa (ISO 527) | 1,200 kg/m³ | Covestro sheet (OKW copy) |
| Magnesium AZ91D-F, cast | **not listed** | E 44.8 GPa | UTS 230 MPa, yield 150 MPa, 3 % elongation | 1.81 g/cm³ | MatWeb sheet (Teko copy) |
| Aluminium 6061-T6 | **not listed** | E 68.9 GPa | UTS 310 MPa, yield 276 MPa, shear 207 MPa | 2.70 g/cm³ | Aerospace Metals (Aluminum Association data, "NOT FOR DESIGN") |
**b07's 483 MPa crosswise is right:** it's Gund's CW flexural figure (Q2's b07-3), so cite that entry for it.
**The ranking caveat (matters for b05_specific):** metals have no flexural strength in these sheets, and for a ductile metal the comparable onset of a permanent bend is the **yield** strength. Plastics' ISO 178 flexural strength is the peak stress at break or 5 % strain, so ranking ABS's 82 MPa flexural against magnesium's 150 MPa yield mixes two definitions. Specific values (strength ÷ density, MPa per g/cm³): FR4 298 (LW) / 261 (CW) flexural; Makrolon 2405 80.8 flexural; GR-2000 78.1 flexural (71.4 by ASTM); AZ91D 82.9 yield / 127 UTS; 6061-T6 102 yield / 115 UTS. On yield, AZ91D (82.9) sits level with PC (80.8) and ABS (78.1), and 6061-T6 above them. On UTS both metals lead the plastics. Say which measure each bar uses.
Sources: https://www.denka.co.kr/pdf/DENKA-ABS_grade_English.pdf ; https://www.okw.ch/it/PC/RW_Makrolon_2405_en.pdf ; https://www.tekogehause.de/uploads/manuali/materiali/AZ91D.pdf ; https://www.aerospacemetals.com/wp-content/uploads/2023/06/Aluminum-6061-T6-6061-T651.pdf ; Gund via Q2 (https://thegundcompany.com/wp-content/uploads/2024/03/NEMA-FR4-Glass-Epoxy-Laminate-by-The-Gund-Co.pdf). Confidence: high for each sheet; the cross-definition comparison is the risk.

### M-b07_arms / M-b05_specific: the "two strengths" of each material, checked against datasheets  [Q2]
- **All plastics' and FR4's values on the slides match their datasheets** (typical values, not specifications):
  - Gund NEMA FR4: flexural strength **LW 80 ksi (552 MPa), CW 70 ksi (483 MPa)** (ASTM D790, 0.062 in); flexural modulus
    LW 20 GPa, CW 18 GPa; tensile LW 430 MPa (D638); density 1.85. So b07's 483 MPa crosswise is in the Gund sheet (cite it
    from there). https://thegundcompany.com/wp-content/uploads/2024/03/NEMA-FR4-Glass-Epoxy-Laminate-by-The-Gund-Co.pdf
  - Denka ABS GR-2000: flexural strength **82 MPa (ISO 178)** (75 MPa by ASTM D790); flexural modulus 2,550 MPa (ISO 178);
    tensile stress at yield 50 MPa (ISO 527); 1,050 kg/m³. https://www.denka.co.kr/pdf/DENKA-ABS_grade_English.pdf
  - Covestro Makrolon 2405: flexural strength **97.0 MPa (ISO 178)** (73.0 MPa at 3.5 % strain); flexural modulus
    2,350 MPa; tensile modulus 2,400 MPa; tensile yield 65.0 MPa at 6.0 %; 1.20 g/cm³.
    https://protolabs.com/media/t1on53hr/makrolon-2405.pdf
  - Magnesium AZ91D-F, cast (MatWeb MMAZ96, read via a maker's copy): UTS **230 MPa**, yield 150 MPa (0.2 %), elongation 3 %,
    E 44.8 GPa, compressive yield 165 MPa, 1.81 g/cm³. https://www.tekogehause.de/uploads/manuali/materiali/AZ91D.pdf
  - Aluminium 6061-T6 (Aluminum Association typical, "NOT FOR DESIGN"): UTS **310 MPa**, yield 276 MPa, E 68.9 GPa, elongation
    12 to 17 %, 2.70 g/cm³. https://www.aerospacemetals.com/wp-content/uploads/2023/06/Aluminum-6061-T6-6061-T651.pdf
- **Conflict in the deck's own sources:** `az91d` (05-data.js, makeitfrom) says "160 to 220 MPa UTS, 46 GPa"; b05's Mg row
  uses 230 MPa and 44.8 GPa (MatWeb). Pick one and cite it; MatWeb's cast AZ91D-F is the usual reference.
- **Convention to fix (no datasheet gives a metal a flexural strength):** b05 sets the metals' bent strength fb = UTS
  (230, 310). The plastics' ISO 178 figures are outer-fibre stresses at peak load, and they exceed their tensile yields
  (ABS 82 vs 50, ×1.6; PC 97 vs 65, ×1.5; PP-C-20A 207 vs 120, ×1.7; FR4 552 vs 430, ×1.3), partly because a bent part
  yields from the surface in. A ductile metal does the same: past first yield a bent bar carries up to 1.5 times its
  first-yield moment (rectangular section, the textbook plastic shape factor). So fb = UTS **understates the metals
  against the plastics, in Theseus's favour.** Honest options: (a) rank by tensile strength for every material (one
  convention); (b) for metals use first yield in bending = tensile yield (150, 276) and say "first yield", and for
  plastics the ISO 178 stress at 3.5 % strain where given (PC 73); or (c) keep the plastics' ISO 178 and mark the metals
  "no bend figure published; tensile shown". Don't mix peak-load plastics with tensile metals unlabelled.
- Confidence: high for every datasheet value; the shape-factor point is textbook mechanics, given as a reason, not a number
  to print. Replaces: unverified entries; flags one source conflict and one convention.

### M-b02_pom: thickness tolerance of precision POM shim sheet, 0.55 to 0.85 mm  [Q2]
- **No published tolerance for POM at 0.55 to 0.85 mm found.** Nearest:
  - Acetal copolymer sheet (Simply Plastics): **1 mm ±0.10 mm**, 1.5 mm ±0.15, 2 mm ±0.15 (thinnest row 1 mm, "on request").
    https://www.simplyplastics.com/media/14blubcl/acetal-copolymer-sheet-thickness-tolerance.pdf
  - Precision Brand plastic shim stock (polyester and vinyl, not POM; 0.0005 to 0.060 in): **±5 %** of thickness for every
    code. https://static.datasheets.com/doc/26728027-precision-brand-77-644-105-ds.pdf
  - Boker's stamps acetal shims 0.005 to 0.125 in; no tolerance published.
- Derived: at 0.55 to 0.85 mm, ±5 % is ±0.03 to ±0.04 mm (shim stock); ±10 % (sheet, as at 1 mm) is ±0.06 to ±0.09 mm.
  Say "about ±5 to ±10 %" if a figure is needed, labelled. Confidence: medium (adjacent products).

### b05-G2 A survey source for "ABS, what most mice are made of" (b05_material rival line)  [Q1]
**No survey found.** The nearest thing is Keeb-Finder's mouse database (2026): "Found 43 products" under ABS and "Found 58 products" under "Plastic", with no total and no counts for PC, PBT, magnesium or carbon shown. Overlapping tags and no denominator mean it can't support "most". Retailer and blog pages (Alibaba, Evetech, Attack Shark) aren't sources. Keep the line framed as Brock's baseline (#5, F2.01) with Finalmouse's own benchmark against ABS, as now. Or soften it to "ABS, the common mouse plastic" if "most" should go.
Sources: https://keeb-finder.com/mice/filter/abs ; https://keeb-finder.com/mice/filter/plastic . Query: "gaming mouse shell material ABS plastic most mice made of ABS PBT PC survey". Confidence: high that no survey turned up.

### M-b02_tensioner Starlight X shell or trigger composite modulus (b02_tensioner)  [Q1]
**Not published.** Finalmouse's "Innovations" page covers its carbon work in words only ("the inherent brittleness of carbon fiber", "RF reflectivity issues"), with no modulus, strength or test data. Launch coverage (Back2Gaming, Basic-Tutorials, Gadget Pilipinas, XiaomiToday) gives 38 g, the carbon build and TMR-DS, and no material figures. Keep the rival modelled in PP-C-20A, said as an assumption.
Source: https://finalmouse.com/pages/innovations . Query: "Finalmouse Starlight X carbon composite shell modulus technical overview TMR-DS".

### b03_binning (c) A published operating-force spread for a lot of microswitches (b03_binning)  [Q1]
**Not found.** "microswitch operating force distribution measured histogram lot mouse switches gf variation tested" returned datasheets with ± bands only (Omron D2LS-21: 0.6 ± 0.2 N; Kailh GM 4.0: 65 ± 15 gf), a DigiKey forum question and a keyboard force-curve tool. No n ≥ 20 distribution for mouse switches is published in what search reaches. The maker's ± band is the honest anchor: a "65 ± 15 gf" switch may be anywhere from 50 to 80 gf. Keep the illustrative spread, labelled as such.

### b10-9 (rest) Razer's default lift-off (b10_cable)  [Q1]
**Not found.** Razer's Focus Pro page gives "26 granular levels" of asymmetric cut-off but no default. The Gaming Setup's explainer uses 0.5 and 1.0 mm only as examples, and a Razer Insider thread reports a calibration bug, not a default. Query: "Razer Synapse asymmetric cut-off default lift-off distance level mm Viper V3 Pro". Keep "1 mm, the PAW3395's lower setting", said as the deck's own choice.

### b08-1 fifth pass (b08_wheel)  [Q1]
No more stock-wheel weights. TechPowerUp's X2 CrazyLight page lists only "Wheel Encoder: Pulsar Blue (9 mm)" and 37 g; a Printables Viper V2 Pro modkit gives its own 3 to 3.25 g only; Pulsar's CrazyLight weight-saving breakdown didn't come up. **The total is n = 2** (OP1 1.8 g, Zeromouse kit 1.5 g). Queries tried for b08-1: six (listed across the passes). Brock's n ≥ 4 group needs owner weighings (a kitchen scale on two more stock wheels) or a lab.

### b11-5 G Pro X Superlight battery connector (b11_battplug)  [Q1]
For the **GPX2**, TechPowerUp says the 290 mAh battery "utilizes a 3-pin JST connector". It doesn't say whether it's top entry. No search spent. The slide is fine as it is; naming top entry still needs the iFixit photo (170154) the builder cites.
Source: https://techpowerup.com/review/logitech-g-pro-x-superlight-2/7.html

### b09-1 (b09_radio): how much nearby metal costs a 2.4 GHz PCB antenna  [Q2]
- **No dB-vs-distance figure found** (the Casado EuCAP 2012 paper stays closed). What a maker does publish, usable on screen:
  Taoglas PCB Antenna Application Note APN-13-8-001.A: "clearances of minimum 4mm are kept from other metal components";
  "We recommend **20mm or more for best gain and radiation efficiency**"; "clearance of 20mm in all directions from the
  board/housing for maximum efficiency"; closer metal absorbs or reflects radiation and shifts the tuned frequency
  ("shift in tuned frequency will be observed if these clearances are not adhered to"). The note spans 450 MHz to 6 GHz
  and gives no measured loss figures.
  https://www.taoglas.com/wp-content/uploads/pdf/PCB-Antenna-Application-Note-APN-13-8-001.A.pdf
- For the slide: the move from 12.4 to 28.2 mm takes the antenna **from under the 20 mm a maker recommends to over it**
  (Taoglas). Say that, not a dB figure. Confidence: high (a maker's design rule, not a measurement). Replaces: "distance
  only" (now distance against a published rule).
- Queries: "2.4 GHz PCB antenna metal object proximity distance efficiency loss dB measured clearance mm application note"
  (also seen: Johanson 2450AT42E0100E and Taoglas CBD01 datasheets, keep-outs only).

### b08-3 (b08_uv): a measured colour shift under QUV  [Q2]
- **Coatings, measured, QUV-A** (Buchanan, Huntsman, "UV-resistant epoxies", Coatings Trends & Technologies 2024; clear
  coats on glass panels, QUV-A per ASTM G53): a solvent-borne **polyurethane clear coat ΔE 0.13 at 500 h, 0.19 at 1000 h**
  (YI 0.63 / 0.68); **aromatic (BADGE) epoxies ΔE 16.3 to 21.8 at 500 h** (YI 24 to 30), 14.8 to 25.1 at 1000 h, "failure
  before 1000 hours"; hydrogenated or cycloaliphatic epoxies ΔE 2.9 to 11.2 at 500 h.
  https://pcimag.com/ext/resources/Events/CTT/presentations/MitchBuchanan_Huntsman_UV-Resistant-Epoxies_2024-CTT-_New-Format.pdf
- Use: "UV-unstable chemistry yellows in weeks of sun-equivalent: an aromatic resin ΔE 16 at 500 h QUV-A, a UV-stable
  polyurethane 0.13 (Huntsman 2024)". It shows the mechanism (chemistry decides), not a figure for any mouse's coating.
  ΔE about 1 is the usual just-visible difference (not from this source; omit unless sourced).
- **ABS** (weaker data, not QUV): Güzel 2009, "Photo-oxidative degradation of ABS copolymer", MSc thesis, METU: pure ABS
  under a 100 W mercury lamp at 2.8 mW/cm² went from b* −1.97 (100 h) to +1.45 (500 h), faster at higher intensity;
  stabilisers slowed it. https://etd.lib.metu.edu.tr/upload/12610895/index.pdf
- Confidence: high for the Huntsman numbers as clear-coat data; low as a stand-in for a white mouse coating. Replaces: no
  rate implied (now a sourced contrast if wanted). Query: "ABS QUV accelerated weathering yellowness index delta E 500
  1000 hours white ABS UV exposure data"; "white polyurethane coating QUV-A 1000 hours delta E yellowing aromatic vs
  aliphatic polyurethane weathering data".

### b08-2 (b08_uv): a real-world yellowing example (Retr0bright)  [Q2]
- Old computers and consoles yellow because of the **brominated flame retardant** in their ABS; UV light speeds it up.
  Make, "Un-Yellow Old Plastics - Retr0brite!" (2 Mar 2009): it "un-yellows the flame retardants found in ABS plastic", by
  "causing hydrogen to bond with bromine free radicals"; hydrogen peroxide plus an oxygen booster, activated by UV or
  sunlight. https://makezine.com/article/science/unyellow-old-plastics-retr0brite/
  Recalbox blog, 8 Dec 2025 (secondary, no study): bromine added to ABS for 1980s-90s fire rules; UV "accelerates it
  dramatically"; oxygen alone can start it; Nintendo confirmed flame-retardant plastic in the SNES (some batches yellowed);
  first noticed by the CBM museum in Wuppertal, 2008.
  https://www.recalbox.com/it/blog/2025-12-08-consoles-jaunissement-retrogaming-retrobrighting/
- Use: "the yellowed Super Nintendo: flame retardant in its ABS, turned by sunlight". Confidence: medium (hobbyist and
  press sources; the chemistry is widely repeated). Optional for the slide, per b08.

### b08-4 (b08_film): soft-touch film thickness  [Q2]
- **No figure for the film actually used on mice is published.** Covestro, "Soft touch waterborne polyurethane coatings:
  control of optic and haptic properties" (white paper, July 2021): the haptic effect "can already be obtained in coatings
  of only a few micrometer thickness", matt soft-touch "even ... at very low film thickness (2 to 3 µm)".
  https://solutions.covestro.com/-/media/covestro/solution-center/brands/downloads/imported/1652424150.pdf
  RadTech 2016 (already on the slide) tests at 2 mil (51 µm). PPG Velvecron (soft-touch PU for phones, tablets, e-readers)
  publishes no thickness.
- Use: keep RadTech's 2 mil as a test film, and say films can be as thin as 2 to 3 µm (Covestro 2021); don't claim a
  mouse's. Confidence: medium. Query: "soft touch coating dry film thickness microns consumer electronics plastic housings
  polyurethane".

### b08-5 (b08_film): blast removal depth on polypropylene  [Q2]
- **Not found.** Query: "abrasive blasting polypropylene surface roughness material removal depth microns plastic media
  blasting pressure grit" returned forum threads (eng-tips, physicsforums) and media catalogues only. Brock's "almost as
  much as it adds" stays his claim, unnumbered. A Cerakote plastics-prep guide would be a product page (Q1's).

### b10-7 (b10_cable): static friction of PTFE skates on a cloth pad  [Q2]
- **Not found as a published measurement.** Queries: "PTFE mouse skates friction coefficient measured static kinetic cloth
  mousepad test"; "mousepad friction coefficient measured static kinetic values incline angle PTFE feet cloth pad glass pad
  measurement" (extended). Found only: retailer blogs (attackshark), Wallhack's tester description (no values), an
  unreadable community sheet ("Viscose's Mousepad Friction Sheet", Google Sheets, renders client-side:
  https://docs.google.com/spreadsheets/u/0/d/1Ix0RN4WDgRIn9uSUMy2smG_vWR3FTnZHgNpumChfHM0/htmlview) and an overclock.net
  "Friction Measurements" thread that would not load. Brock's #20 stays unquantified, or use a stated assumption.

### b04-1 (b04_sag, b04_skates): soft cloth pad sink under load  [Q2]
- **Not found.** Query: "mouse pad foam compression thickness under load measured mm soft cloth pad sink skates": retailer
  blogs and a patent only. The Pasternak model stays calibrated on Brock's report, marked Derived. (A foam stiffness, e.g.
  ASTM D1056 sponge-rubber grades by compression at 25 %, would let it be derived; not searched.)

### b01-8, b01-13 (b01_lighter) and b03_timing: flick speeds and the crosshair's speed at the shot  [Q2]
- **No study gives a peak mouse speed for a flick, a fingertip correction's speed, or the crosshair's angular speed at the
  click** in readable text. Checked: Sanchis-Sanchis et al. 2024 (Applied Sciences 14:7112: 60 s averages only, 0.026 to
  0.028 m/s), Donovan et al. 2022 (Frontiers Hum Neurosci 16:979293, 32 pros in Aim Lab: speeds z-scored, no values; max
  target distance 5.60 cm of mouse travel), Boudaoud, Spjut & Kim (NVIDIA, arXiv 2203.12050: completion times "0.4 -
  0.8 s"; optimal sensitivity 20 to 80 cm/360°, many prefer 30 cm/360° = 1.2°/mm), Yoon et al. 2025 (IJHCS, model, no
  speeds on the page), Logitech "science of flick shots" (no numbers).
- Derived bound (label it): a 5.6 cm target switch in 0.4 s averages 0.14 m/s; a bell-shaped move peaks at about 1.9× its
  mean, about **0.26 m/s**. At 30 cm/360° (1.2°/mm) that is about **315°/s** of crosshair. So b03_timing's 300°/s is a plausible
  *peak* for a fast target switch, not a measured speed at the click (the crosshair slows before most clicks).
  b01_lighter's 0.5 m/s is about twice that peak and far above a fingertip correction: the slide's ms scale with v (stop
  time m·v/F), so at 0.25 m/s they halve (66 → 33 ms, 132 → 66 ms); the ratio between the mice does not change.
- Queries: "FPS aiming flick mouse peak velocity m/s kinematics study gamers hand movement speed"; "computer mouse
  pointing movements peak velocity cm/s Fitts task kinematics Walker Meyer Smelcer submovements"; "first-person shooter
  flick shot crosshair angular velocity at time of click degrees per second players fire while moving".
- Confidence: low (derived from two studies' bounds). Replaces: nothing yet; the stand-ins stay labelled examples.

### b08-1 Stock scroll-wheel weights, fourth pass: n = 2 (b08_wheel)  [Q1]
1. **Endgame Gear OP1, stock wheel: 1.8 g** (Forky Mods, seller of a ~0.5 g replacement: "which is 1.8g").
2. **Zeromouse V34 / V35 mod kit, original wheel: 1.5 g** (Zeromouse's carbon scroll wheel listing: carbon 0.7 g against the original 1.5 g, "over 50% lighter"). Zeromouse's own figure. The "original" is the kit's standard wheel, and which donor mouse it matches isn't stated.
Neither source says whether the tyre or axle is included. Both are sellers' figures for parts they sell replacements for, so not independent. For contrast, an aftermarket aluminium Superlight wheel is 2.7 g (AusModShop). **Still short of Brock's n ≥ 4**, so the test group stays a labelled placeholder, or shows these two marked as sellers' figures. Dead ends this pass: r/MouseReview "gaming mice under 10g" (LSP_R gives whole-build figures only, e.g. removing the wheel, encoder and MMB takes the build to ~7.5 g); makerworld model 1592061 wasn't read.
Sources: https://forkymods.com/products/lightweight-scroll-wheel-op1 ; https://zeromouse.co/products/carbon-scroll ; https://red.127.pp.ua/r/MouseReview/comments/1jg27lf/gaming_mice_under_10g_how_low_can_we_go . Queries so far: four (see the earlier b08-1 passes) plus "\"stock wheel\" OR \"stock scroll wheel\" weighs \"g\" Superlight OR Viper OR Pulsar mod lighter scroll wheel grams". Confidence: medium.

### b10-1 Stock charging-cable diameters (b10_cable)  [Q1]
**Not published.** TechPowerUp's "Packaging, Weight, Cable and Feet" pages give length and feel, never diameter. Viper V2 Pro: "soft and flexible braided", "1.80 m long" (scale: around 58 g). Viper V3 Pro: "1.80 m, braided". Viper V4 Pro: 1.8 m, fabric-sheathed, "stiff" (b10-1 part). The UltralightX's is 1.7 m and "supremely stiff" (deck tpuUlx). Makers don't list diameters either. The 3 mm cable stays an illustration and should be said as one. Query: "gaming mouse stock cable diameter mm thickness Superlight Viper paracord cable 3 mm measured".
Source: https://techpowerup.com/review/razer-viper-v2-pro/2.html . Confidence: high that it isn't published.

### b07-2 Players fitting foam where a G-Wolves board meets the shell (b07_poron)  [Q1]
**Not found.** "G-Wolves Hati creaking fix foam tape PCB mod" returned only keyboard tape and foam mods (KeebTalk, Thock). Keep Brock's note (F9.5) and the keyboard world's PCB gaskets, as now.

### b07-4 Why some push for a higher battery (b07_balance)  [Q1, Zeromouse named]
**Not found.** The one relevant source, Periview on the Zeromouse, describes a "battery holder positioned at the rear" that "makes the mouse feel lighter when pivoting" (a reviewer's preference). It says nothing about a higher battery or a moment arm. Retailer blogs (Attack Shark) aren't sources. Keep the physics stated plainly and attributed to no one, as now.
Source: https://periview.gg/?p=1375 . Query: "Optimum Zeromouse battery placement higher center of gravity moment explanation".

### b08-6 Owner reports of painted two-tone wear (Prophecy) (b08_twotone)  [Q1]
**Not found.** "Finalmouse ULX Prophecy paint chipping wear two-tone" returned store listings only. Keep the slide on the mechanism (layers on top can chip), with no claim about Prophecy units.

### M-b03_switch nRF54L15 / nRF54LM20A GPIO pull-up resistance (b03_switch)  [Q1]
**The nRF54 value isn't reachable.** Nordic's nRF54L15 and nRF54LM20A docs pages that came up are the GPIO intro, PIN_CNF and TWIM "Pull-up resistor" pages ("1 kΩ pull-up resistor" for 1000 kbps I²C, an external part). None shows the GPIO electrical table, and Ezurio's BL54L15 excerpt has none either. **For scale only, Nordic's earlier parts: R_PU 11 / 13 / 16 kΩ min / typ / max** (nRF51822 / nRF51422 Product Specification §8.23, as quoted on Nordic DevZone). If the nRF54 is similar, a pull-up held against a closed NC contact draws V/R = **0.14 mA at 1.8 V or 0.23 mA at 3.0 V** at 13 kΩ, and 0.11 to 0.27 mA across 11 to 16 kΩ and 1.8 to 3.0 V. That's comparable to an optical switch's draw (0.12 to 0.15 mA, see the optical-cost entry). So an always-on NC pull-up isn't free; a pulsed read or a high-value external pull-up would be needed. Mark it Derived from the nRF51 figure until the nRF54 table is read.
Sources: https://devzone.nordicsemi.com/f/nordic-q-a/3830/what-is-the-value-of-the-gpio-pull-up-and-pull-down-resistor ; https://docs.nordicsemi.com/r/bundle/ps_nrf54l15/page/gpio.html ; https://docs.nordicsemi.com/r/09E6cV_58cJ3mJAVA8IpZA/brpu0hsv2yjxq9WSgFxWIA . Queries: "nRF54L15 GPIO pull-up resistance RPU kΩ electrical specification"; "nRF54L15 datasheet \"Electrical specification\" GPIO \"Pull-up resistance\" RPU". Confidence: high for nRF51; nRF54 unconfirmed.

### M-b04_focus ADNS-3080 Fig. 11 sign and size (b04_focus)  [Q1]
Covered by "b04-7 / b04-10" below: the figure's curve values don't survive text extraction (dtsheet). The axes are "Resolution (counts/inch)" against "Distance from Nominal Focus (mm)", about −1.0 to +1.0 mm, and the recommended Z is 2.3 to 2.5 mm, "±0.2 mm DOF". **The sign and the ~4 % per 0.1 mm can't be checked from text.** Reading the plotted curve needs the PDF image (Brock or a browser). Until then the thin-lens numbers stay Derived and should say so.

### M-b02_pom POM shim tolerance  [left to Q2]  (the flexural strengths are now Q1's: see the materials table above)
POM (acetal) shim thickness tolerance is materials data, in Q2's remit. Q1 hasn't searched it. (The flexural strengths M asked for are answered in Q1's materials table, with FR4 from Q2's b07-3.)

### R-b03_timing Default debounce on mechanical-switch flagships (b03_timing "most mice read NO, then wait out the bounce")  [Q1]
**TechPowerUp's pages give the settings and their latency, not the shipping defaults.** What they show:
- **VAXEE XE Wireless:** settings of 2, 3 and 4 ms; wired latency 2.9 / 3.9 / 4.9 ms, wireless 3.3 / 4.3 / 5.3 ms ("competitive firmware"; the default firmware about 0.2 ms higher). Each ms of debounce adds a ms of latency, so it **waits out the bounce on press** (deferred).
- **Pulsar X2 V2:** a 0 ms setting that "is actually 0 ms". Latency is 2.4 ms at 0 ms and 5.4 ms at 3 ms, and TechPowerUp advises "increase debounce time to at least 3 ms" to get rid of an issue at low settings. Deferred, with 0 ms available.
- **Lamzu Maya X:** "click latency will be 0.5 ms" at 0 ms "Regardless of wired or wireless, or polling rate", with "slam-click prevention" and a "defer-type debounce time of roughly 18 ms added upon lift-off". That's **eager on press, deferred on release**: it doesn't wait out the bounce before the click.
**So "most mice wait out the bounce" is true of VAXEE and of Pulsar at non-zero settings, and not of Lamzu's Maya X.** The defaults stay unknown. Suggested wording: "many mice wait out the bounce (VAXEE: 2 to 4 ms, each ms added to the click)". With 16 to 19 of 35 flagships optical (b03_switch), "most mice" would also be wrong by count.
Sources: https://techpowerup.com/review/vaxee-xe-wireless/5.html ; https://techpowerup.com/review/pulsar-x2v2/8.html ; https://techpowerup.com/review/lamzu-maya-x/8.html . Query: "\"debounce\" default ms mouse review Pulsar X2 V2 OR VAXEE XE OR ZOWIE EC2-DW OR Lamzu Maya click latency techpowerup". Confidence: high on what TechPowerUp measured; the defaults weren't found.

### b10-2 (G HUB part) Logitech G HUB install size (b10_software)  [Q1]
Logitech's G HUB support article gives "File Size: 40.2 MB" for an installer, with "OS: Windows 10". That's an older release ("the final G HUB release with support for Windows 7, Windows 8/8.1, and macOS 10.13"), and probably the download stub, not the installed size. No disk space, RAM or footprint is published by Logitech or (see above) Razer. **Keep "no size claimed".** Don't print 40.2 MB as G HUB's size.
Source: https://logitech1640183673.zendesk.com/hc/en-ca/articles/4422097826327-Logitech-G-HUB . Query: "Logitech G HUB system requirements disk space MB install size".

### b08-1 Stock scroll-wheel weights, third pass (b08_wheel)  [Q1]
**One stock wheel found (n = 1, not yet the n ≥ 4 Brock asked for):**
- **Endgame Gear OP1, stock wheel: 1.8 g**, from Forky Mods (a seller of a ~0.5 g replacement): "The mod wheel weighs ~0.5g", against the stock "which is 1.8g", "around 1.3g lighter". It doesn't say whether the tyre or axle is included. A modder's figure, not a lab's.
- For contrast, an aftermarket aluminium wheel for the G Pro X Superlight / Superlight 2 weighs "only 2.7g" (AusModShop), with the stock part not given. Metal wheels aren't automatically lighter.
- Dead ends: HWBusters teardowns give the whole mouse only; r/MouseReview's metal-wheel thread has no numbers; Thingiverse's G203 lightweight wheel page wouldn't load.
**Next query, if budget allows:** "stock scroll wheel 1.8g" or modder listings for the Superlight, Viper and X2 stock wheels.
Sources: https://forkymods.com/products/lightweight-scroll-wheel-op1 ; https://ausmodshop.com/products/aluminium-scroll-wheel-for-logitech-g-pro-x-superlight-superlight-2-dex . Confidence: medium (one modder's figure).

### b01 (09:0x request) battery capacities, part 3: Keychron G3 (b01_battery)  [Q1]
**Keychron G3: 500 mAh** (Keychron: "Housed with a large battery of 500 mAh"). "Up to 140 hours at 1K Hz polling rate (2.4 GHz Mode)", "Up to 37 hours at 8K Hz", "Up to 160 hours at 125 Hz polling rate (Bluetooth Mode)", 44 g, PixArt 3950, $109.99. These are Keychron's claims.
Source: https://www.keychron.com/products/keychron-g3-wireless-mouse . Confidence: high.

### REQ-H1 C&K PCM12SMTR dimensions, second try (board variant B)  [Q1]
**Still not filled.** dtsheet's text of the ITT/C&K PCM12 sheet confirms "Ultraminiature surface mount" and SPDT (position 1 connects 1-2, position 2 connects 2-3), but its dimension drawing doesn't survive text extraction. Other URLs that came up and might carry the drawing: https://www.tme.eu/html/EN/switch-slide-c-k/ramka_19945_EN_pelny.html and RS 7931721 ("SPDT Latching 300 mA @ 6 V dc"). Variant B's drawn 6.7 × 2.6 × 1.4 mm with a 1.5 mm actuator stays unverified. The board renders only, so the risk is low.
Source: https://dtsheet.com/model/2964213 . Query: "C&K PCM12 series slide switch datasheet pdf dimensions".

### b02-4 (part) ARYE RCC-1 cutouts (b02_flush)  [Q1]
**Not confirmed.** Lethal.gg's RCC-1 listing says nothing about the trigger cutouts or the FCC-1. It gives "Weight: 46g" (one buyer reports "around 49-50g with 4 dot skates"), $99.99 (struck through from $169.99), "Size: 117*61.6*35mm", and a batch run ("only 2000 of these were made", per a reviewer). Keep Brock's doc for the FCC-1 → RCC-1 change.
Source: https://www.lethal.gg/products/arye-rcc1-gaming-mouse . Query: "ARYE RCC-1 trigger cutouts FCC-1 mouse".

### R-b10_lights Logitech G703 hours, lighting off vs RGB (b10_lights)  [Q1]
**The slide's "30 h off, 22 h with RGB cycling" matches neither of Logitech's figures. Must change.** Logitech publishes two sets:
- **Original G703 LIGHTSPEED (2017):** Logitech's spec sheet says "up to 32 hours non-stop gaming at 1ms report rate with lights off" and "24 hours non-stop gaming at 1ms report rate with RGB color cycling on".
- **G703 LIGHTSPEED with HERO (current page):** "Default lighting : 35 Hrs", "No lighting : up to 60 Hrs".
For the lighting-cost point, use the original's **32 h vs 24 h** (RGB cycling costs 25 % of the life, as Logitech's own 1 ms-report-rate figures) or the HERO's **60 vs 35 h** (default lighting costs 42 %). Name which G703. Both are Logitech's claims.
Sources: https://logitech.com/assets/65259/2/g703-lightspeed-wireless-gaming-mouse.pdf ; https://www.logitechg.com/en-qa/shop/p/g703-hero-wireless-gaming-mouse . Confidence: high.

### R-b01/b05 ULX Competition build: RTINGS vs Periview (b01_compromise, b05_fallacy)  [Q1]
**The sources disagree about the same model, so neither slide should state a clean verdict.**
- RTINGS (its "UltralightX Competition" review, id 78570, via the deck's quote): "noticeable flexibility, popping, and creaking".
- Periview (ULX Competition review): "The sides are solid"; "sturdier, with less flex" than "the more flexible, creaky bodies of previous models" (Tarik and Aceu).
- Finalmouse: "now features solid sides specfically designed for the competitive player".
- Owners on r/FinalMouse ("Is the ULX Competition worth it", 2025-02-13) are split: u/ethanlaidlaw "it creaks on the back", u/OpportunityNo1834 "it'll creak, flex", against u/ski009_ "Surprisingly the build quality was great on my copy" and u/Bryanhorn "QC was better for me" than the original ULX Phantom.
- No TechPowerUp review of the ULX Competition came up (query: "Finalmouse ULX Competition review build quality creak flex solid sides techpowerup OR rtings").
**Reading:** unit-to-unit variation, with Finalmouse's own "solid sides" change sitting between the two. Honest options: b01 keeps "flexes, creaks" tagged "RTINGS' unit", and **b05_fallacy drops the ULX Competition as its "light mouse built better" example**, or carries "(RTINGS found creaking in its unit)". The fix to "one must change": b05_fallacy, since its claim is the stronger one (built better than the GPX 2) and rests on one review.
Sources: https://periview.gg/?p=3024 ; https://finalmouse.com/products/ulx-competition-overview ; https://reddit.birdcat.cafe/r/FinalMouse/comments/1ioptzz/is_the_ulx_competition_worth ; RTINGS compare page in deck b01RtUlx. Confidence: high that the sources conflict.

### b03_switch (a) Publish date of Logitech's LIGHTFORCE hybrid / optical-only article (b03_switch)  [Q1]
**Not readable.** The article (support.logi.com/hc/en-us/articles/16237236344727) shows only an unrendered "Edited {[{ formattedDate }]}" template to this fetcher, with no created or updated date. Its wording is confirmed: "Hybrid mode uses the galvanic contact to turn on the Infrared (IR) LED and optical sensor"; "Optical-only mode runs the IR LED and optical sensor full time, and can reduce battery life". Cite it undated, "Logitech support, accessed 2026-11-06". The LIGHTFORCE switch itself launched with the G502 X (Logitech press release, 2022-08-30, ir.logitech.com), so the article is from 2022 or later.
Sources: https://support.logi.com/hc/en-us/articles/16237236344727-What-is-the-difference-between-Hybrid-and-optical-only-mode-of-the-LIGHTFORCE-switch ; https://ir.logitech.com/press-releases/press-release-details/2022/An-Icon-Reinvented-Logitech-Introduces-the-G502-X-Gaming-Mouse-in-Wired-Wireless-and-PLUS-Versions/ (the 2022-08-30 date is from the press release's URL and its BusinessWire copy, businesswire.com/news/home/20220830005355). Confidence: high on the wording; date unknown.

### b01 (09:0x request) battery capacities, part 2 (b01_battery)  [Q1]
- **Razer DeathAdder V4 Pro: mAh not published** in the reviews read (Basic-Tutorials, Tom's Hardware). Hours: "Up to 150 hours" at 1 khz after a firmware update (Tom's: "Razer originally rated it at 120 hours"), and 22 h at 8 khz (Basic-Tutorials). $169.99 MSRP, 56 g (57 g white), 128 × 68 × 44 mm (Tom's; Basic-Tutorials' table says 129 × 72 × 44).
- **ZOWIE EC2-DW: mAh not published** (ProSettings: "around 24 hours of in-game time", no polling rate; 60 g). No TechPowerUp review came up.
- Still to try if budget allows: Keychron G3, GPX2c.
Sources: https://basic-tutorials.com/reviews/peripherals/razer-deathadder-v4-pro-review/ ; https://www.tomshardware.com/peripherals/gaming-mice/razer-deathadder-v4-pro-review ; https://prosettings.net/reviews/zowie-ec2-dw/ . Queries: "techpowerup Razer DeathAdder V4 Pro review \"battery has a capacity\" mAh"; "techpowerup ZOWIE EC2-DW review battery capacity mAh".

### b07-3 (b07_board, pull test 1.8×): FR4 tensile strength check  [Q2]
- **Confirmed: 430 MPa lengthwise.** The Gund Company, "NEMA FR4 Glass Epoxy Laminate" data sheet (typical values, not
  specification minimums): tensile strength LW **62 ksi (430 MPa)**, ASTM D638, 0.125 in sheet; flexural LW 80 ksi (552 MPa)
  and CW 70 ksi (483 MPa), ASTM D790, 0.062 in; compressive flatwise 66 ksi (455 MPa), D695; flexural modulus LW 2,900 ksi
  (20 GPa), CW 2,600 ksi (18 GPa); density 1.85 g/cm³. (The fetched text was garbled; values matched to properties by
  order and they agree with the deck's `shlFr4`; CW tensile not listed.)
  https://thegundcompany.com/wp-content/uploads/2024/03/NEMA-FR4-Glass-Epoxy-Laminate-by-The-Gund-Co.pdf
- Confidence: high (matches shlFr4 and Wikipedia's flexural > 415 MPa LW). Replaces: the unverified fetch; no change on screen.

### b07-6 (b07_tolerance) and b02-7 (b02_cutouts headline): coin tolerances, and the US nickel  [Q2]
- **No mint publishes a thickness tolerance.** US Mint coin specifications list nominal values only, no tolerances
  (archived 2020-12-18): nickel "Cupro-Nickel 25% Ni | **5.000 g** | 0.835 in. **21.21 mm** | **1.95 mm** | Plain"; cent 2.500 g,
  19.05 mm, 1.52 mm; dime 2.268 g, 17.91 mm, 1.35 mm; quarter 5.670 g, 24.26 mm, 1.75 mm.
  https://webarchive.library.unt.edu/web/20201218003308/https://www.usmint.gov/learn/coin-and-medal-programs/coin-specifications
  (fills b02-7: the nickel's 5.000 g is the Mint's own figure).
- The UK's Royal Proclamations (the legal coin standards) give weight and diameter "remedies" but no thickness: e.g.
  cupro-nickel 50p 8 g ± 0.336 g per coin (4.2 %), diameter 27.3 mm ± 0.125 mm per coin (0.46 %); proclamation of
  9 Nov 2022. https://thegazette.co.uk/London/issue/63873/page/21641/data.pdf
- For b07_tolerance: keep the relative stand-in ("coins drawn thick"), or say "a coin's legal weight may vary by about 4 %
  (Royal Mint 50p: ± 0.336 g of 8 g)". Derived proxy, only if needed: at a fixed diameter and alloy, thickness varies
  with weight, so a 50p may be about ± 4 % thick or thin; label it Derived (no thickness was fetched for the 50p).
- Confidence: high (primary documents). Replaces: "US Mint publishes nominal only" (now: nor does the Royal Mint, for thickness).

### b07-7 (b07_arms): shipping-drop heights (ISTA 1A)  [Q2]
- ISTA Procedure 1A (2014 edition; packaged products of 150 lb / 68 kg or less): free-fall drops by packaged weight:
  **0 to 21 lb (0 to 10 kg): 30 in (760 mm)**; 21 to 40 lb: 24 in (610 mm); 40 to 60 lb: 18 in (460 mm); 60 to 100 lb:
  12 in (310 mm); 100 to 150 lb: 8 in (200 mm). **10 drops**: one corner, three edges, six faces. Vibration first, 1 in
  (25 mm) peak to peak. https://webstore.ansi.org/preview-pages/ANSI/preview_ISTA+Procedure+1A.pdf (edition and scope);
  table from https://hqts.com/all-you-need-to-know-about-ista-1a-package-testing and
  https://www.atlanticpkg.com/wp-content/uploads/2025/07/ISTA-Drop-Testing-Info-Sheet.pdf (secondary; they agree).
- Derived: a boxed mouse (under 1 kg) hits at √(2 × 9.81 × 0.76) = **3.9 m/s**. The peak g inside the box depends on the
  packaging (no source found for a figure); don't state one.
- Confidence: high for the heights (two summaries agree, the ISTA preview confirms scope and edition). Replaces: "no drop
  load claimed" (still none; the height and impact speed can now be said).

### b07-8 (b07_size): a mouse-length to hand-length rule  [Q2]
- **No research-based ratio rule found** (buying guides' "about 60 % of hand length" has no study behind it that this
  search turned up). The nearest
  measured evidence: Oude Hengel, Houwink, Odell, van Dieën & Dennerlein 2008, "Smaller external notebook mice have
  different effects on posture and muscle activity", Clinical Biomechanics 23:727-734: 30 adults (hand length mean
  18.2 cm, 16.0 to 21.0); a 121 × 64 mm desktop mouse against five smaller ones (105 × 64 to 75 × 35 mm). The smallest
  raised wrist-extensor activity by up to 4.1 % MVC and wrist extension by up to 2.3°; larger hands on a small mouse
  (87 × 36 mm) up to 5.5 % MVC more extensor activity; the smallest were "not optimal to use, particularly for
  participants with larger hands"; the 105 × 64 mm mouse ranked most comfortable.
  https://stacks.cdc.gov/view/cdc/223122/cdc_223122_DS1.pdf
- Use: "too small a mouse makes the wrist work harder, more so for big hands (Oude Hengel 2008)"; no ratio.
- Confidence: high for the study; it is office/notebook mice, not gaming grips. Replaces: none claimed (still none).
- Query: "computer mouse length relative to hand length study optimal mouse size hand size grip ergonomics" (otherwise
  retailer blogs).

### b11-1 (b11_wear, b11_inserts): re-driving a screw into its own hole holds less each time  [Q2]
- **No study with per-insertion withdrawal figures for wood or particleboard found** (two searches). The closest
  statement, peer-reviewed: Uysal, Tasdemir & Memis 2023, "Effect of epoxy resin reinforcement on screw withdrawal
  strength of fiberboard and particleboard used in furniture industry", Drvna industrija 74(4):491-500: "every effort to
  disassemble furniture construction enlarges the pilot hole", lowering joint strength after re-assembly; a disassembled
  joint's hole is "close to 100 % of or larger than the screw diameter". https://hrcak.srce.hr/file/449501
- Use (if a classroom panel is wanted): "Take flat-pack furniture apart and the screw holes grow (Uysal 2023)"; no number.
  The plastic data stays Cumbicus 2023.
- Seen, not about repeated insertion: Sydor et al. 2024 (feed rate, particleboard), Joščák et al. 2014 (single
  withdrawal), Birinci & Kaymakci 2023 (freeze-thaw, plywood).
- Queries: "repeated screw insertion withdrawal resistance reinsertion same hole particleboard MDF strength loss percent";
  "screw withdrawal resistance repeated assembly disassembly cycles reinsertion furniture joint particleboard decrease".
- Confidence: medium (mechanism stated, not measured per cycle). Replaces: no classroom panel (a citable line now exists).

### b01 (09:0x request) battery capacities, part 1 (b01_battery)  [Q1]
- **Razer Viper V3 Pro: 306 mAh (3.87 V), 3-pin JST** (TechPowerUp: "The battery has a capacity of 306 mAh (3.87 V) and utilizes a 3-pin JST connector"). Constant-current charge 0.158 A lifted, 0.150 A on the pad. Razer claims up to 95 h at 1000 Hz and 17 h at 8000 Hz. TechPowerUp's scale: "around 54 g (+/- 1 g)"; $159.99; cable "1.80 m, braided". That's the same 306 mAh / 3.87 V the validation report gives for the V4 Pro.
- **Logitech G Pro X Superlight 2: 290 mAh (3.8 V), 3-pin JST** (TechPowerUp: "The battery has a capacity of 290 mAh (3.8 V)"); CC charge around 0.285 A.
- **Pro X3 Superstrike:** not published (see b01-2).
- Keychron G3, DeathAdder V4 Pro, GPX2c, ZOWIE EC2-DW / U2-DW: not looked up yet.
Sources: https://techpowerup.com/review/razer-viper-v3-pro/7.html ; https://techpowerup.com/review/razer-viper-v3-pro/single-page.html ; https://techpowerup.com/review/logitech-g-pro-x-superlight-2/7.html . Confidence: high (TechPowerUp teardowns).

### b03_switch / b01_compromise (V4 Pro row): what optical switches cost in battery, from Logitech's own figures  [Q1]
**A sourced check on the derived 17.6 %.** TechPowerUp, on the GPX2's LIGHTFORCE switches (Logitech's figures as TechPowerUp reports them): "if set to 1000 Hz, battery life will be 96 hours in optical switch mode and 104 hours in hybrid switch mode". At 2000 Hz it's 55 vs 61 h, at 4000 Hz 42 vs 48 h. Logitech's support page (b03_logiHybrid) explains the gap: optical-only "runs the IR LED and optical sensor full time", while hybrid switches it on from the galvanic contact.
Worked, on a 290 mAh cell: average draw is 290/96 = 3.02 mA optical-only and 290/104 = 2.79 mA hybrid, so **running the two main switches' optics full time costs about 0.23 mA, 7.7 % of the GPX2's draw at 1 khz** (12.5 % at 4 khz: 42 vs 48 h). That's about 0.12 mA a switch, against the deck's Omron-derived **0.15 mA**: the same order, and the deck's figure is about 29 % higher (0.15 against 0.116). Put on the Viper V4 Pro's 1.70 mA (306 mAh over 180 h), 0.23 mA would be **13.7 %** (0.232 / 1.70), against the derived **17.6 %**. Hybrid mode still lights the LED on each press, so 0.23 mA is a lower bound on what the optics cost.
**Suggestion:** keep 17.6 % as Derived, but cite Logitech's 96 vs 104 h as a maker's own measurement that full-time optical sensing costs about 8 % at 1 khz. Or show the range "about 14 to 18 % (Logitech's figures to Omron's pulse)". Razer publishes nothing comparable.
Sources: https://techpowerup.com/review/logitech-g-pro-x-superlight-2/7.html ; deck b03_logiHybrid (support.logi.com). Confidence: high on the hours. The per-switch split assumes both main switches account for the whole difference.

### b02-6 GPX2 post-travel (b02_stiff)  [Q1]
**TechPowerUp: "Both buttons have some pre-travel along with low post-travel."** The right button is "sharp and defined", the left "muted and hollow". So "GPX-level post-travel" means *low* post-travel, against the ULX's "high post-travel" (tpuUlx). Side buttons: the back button is subpar ("noticeable pre-travel, uneven actuation", mushy), the forward one good.
Source: https://techpowerup.com/review/logitech-g-pro-x-superlight-2/4.html (now fetchable: it came up in a search). Confidence: high.

### b11-3 (part) G Pro X Superlight 2 disassembly (b11_repair, b11_board)  [Q1]
**Screws under the skates: "After removing the top and bottom skates, no less than six screws need to unscrewed."** The main PCB is "connected to the main-button PCB through an FFC (flat flexible cable)", and "Another three screws affix the main PCB to the bottom". The scroll-wheel encoder is TTC (white, "Silver"), 8 mm high. So the GPX2 can now be named as a rival on b11_repair: skates off, 6 screws, then 3 more for the board, and an FFC to the button board. Viper V4 Pro: still no teardown reachable.
Source: https://techpowerup.com/review/logitech-g-pro-x-superlight-2/4.html . Confidence: high.

### b04-8 PAW3970 / Razer exclusivity (b04_sensor)  [Q1]
**Nothing public ties the Focus Pro 50K Gen-3 to a PixArt part.** Razer's Focus Pro page names no PixArt part and says nothing on exclusivity. It lists "Razer Focus Pro 50K Optical Sensor Gen-3", 930 IPS, 90 G, Asymmetric Cut-off with "26 granular levels", "TRACKS FLAWLESSLY ON GLASS" (footnote: "at least 4mm thick clear glass"), and it ships in the Basilisk V4 Pro, Naga V3 Pro and Viper V4 Pro. Search for "PixArt PAW3970 sensor Razer Focus Pro 50K exclusive" found no PixArt or press source naming a PAW3970. Keep "suspected" and "the plan", as now.
Source: https://www.razer.com/mena-en/technology/razer-focus-pro-sensor . Confidence: high that nothing public exists in what search reaches.

### b04-9 PAW3395 on glass pads (b04_sensor)  [Q1]
**No primary or review source found.** The query "PAW3395 glass mousepad tracking issues spin out" returned only retailer blogs (Attack Shark, MonsGeek, Akko), which aren't sources. Razer's own glass claim for the Focus Pro 50K Gen-3 is above. Keep Brock's doc #76 ("can struggle on certain glass pads"), said as his.

### b09-6 piaknow chart newer than 2026-09-15 (b09_latency, b09_penalty)  [Q1]
**Not found.** "piaknow motion latency chart 8000Hz wireless mice 2026" returned TechPowerUp reviews and retailer blogs, no piaknow page. Keep the 2026-09-15 chart in research/data/latency.json.

### b02-3 Why Razer straightened the rear cutout, V2 Pro to V3 Pro (b02_cutouts caption 3)  [Q1]
**No source states the reason.** An r/MouseReview first-impressions post (2024-04-22, u/CursedSk1y) says the V3 Pro's "Clicks feel very good, with slight pre and post travel", with "very little side to side play". It doesn't mention the cutout or compare it with the V2 Pro. TechPowerUp's V3 Pro single page names the switches (Optical Gen-3, 90 M) but not the button split. Keep the caption as the design change only. Query: "Viper V3 Pro button cutout straight vs Viper V2 Pro click feel complaints rear".
Sources: https://lr.in.psf.lt/r/MouseReview/comments/1c9xb9s/razer_viper_v3_pro_first_impressions_and ; https://techpowerup.com/review/razer-viper-v3-pro/single-page.html

### b03_side: a teaching source for the door / torque demonstration  [Q2]
- OpenStax, University Physics Volume 1, §10.6 Torque, **Fig. 10.31**: "Torque is the turning or twisting effectiveness of
  a force, illustrated here for door rotation on its hinges"; text: "a door opens slowly if we push too close to its
  hinges" and "it is more efficient to rotate a door open if we push far from the hinges". Formula |τ| = r F sin θ =
  r⊥ F (lever arm r⊥, the perpendicular distance from the pivot to the force's line).
  Read at a CC mirror: https://oer.xyzhomework.com/ebooks/html/university-physics-volume-1/ch10/10-6-torque.html
  (OpenStax's own page: openstax.org/books/university-physics-volume-1/pages/10-6-torque, not fetched here).
- Use: demoPanel src "OpenStax University Physics 1, §10.6" (the deck already cites OpenStax College Physics 2e for b01).
- Confidence: high. Replaces: src "Torque = F × d".

### b06_lattice: PBS Building Big "Straw Shapes": its date  [Q2]
- "Activity: Straw Shapes" (handout and educator pages), PBS / WGBH **Building Big**: partners join 7 straws with 14 paper
  clips into a triangle and a square, stand each on a table and press down on its top corner, then compare "Which shape is
  more stable, a triangle or a square?" (stability = "changes shape less"); the follow-up asks them to reinforce the less
  stable shape with at most 2 more straws. The page states no result (students find it). Site line: **"Web site © 2000-2001
  WGBH Educational Foundation."**
  https://www.pbs.org/wgbh/buildingbig/educator/act_straw_ho.html ; https://www.pbs.org/wgbh/buildingbig/educator/act_straw_ei.html
- Print: "PBS Building Big (WGBH, 2000)". Confidence: high (the series aired in 2000; the site's own copyright line).
  Replaces: "PBS Building Big", no year.

### b05-G5 (b05_hotspot): NASA's isogrid handbook, "milled out of a plate"  [Q2]
- Meyer, Harwood & Orlando, **Isogrid Design Handbook**, NASA CR-124075 (MDC G4295A), McDonnell Douglas Astronautics,
  Huntington Beach, for NASA Marshall, 1 Feb 1973: "triangular integral stiffened structures"; tested on the Delta program
  and an isogrid tank programme. https://ntrs.nasa.gov/citations/19730011184 ; NASA Tech Brief B73-10395 (Oct 1973):
  https://ntrs.nasa.gov/api/citations/19730000395/downloads/19730000395.pdf
- The "machined from one plate" wording is not in the NTRS abstract; it is in the encyclopedia summary: "The stiffeners of an
  isogrid are generally machined from one face of a single sheet of material", "formed usually from a single metal plate
  with integral triangular stiffening"; used on Delta and Atlas boosters, Skylab's workshop, the SLS core stage, Starliner
  and Crew Dragon. https://en.wikipedia.org/wiki/Isogrid
- Use: "Rockets do it: isogrid, triangles milled out of one plate (NASA isogrid handbook, 1973)". No weight-saving number
  is quotable from what could be read (the handbook's table 1-1 was not reachable).
- Confidence: high that the handbook exists and describes integral triangular stiffening; medium for quoting the
  machining detail (from Wikipedia, consistent with the handbook's "integral"). Replaces: the uncited real-world example.

### b10-4 (b10_lights): "a magnet acts through card"  [Q2]
- Oak National Academy (England's national curriculum lessons), Year 3 Science, unit "Simple forces including magnets",
  lesson **"Blocking magnetic force"**: key learning point "Magnetic forces can act at a distance when some materials are
  placed between the magnet and the magnetic material"; pupils test which materials let the force through (the exit quiz:
  a fork is still pulled through thin wood). It lists as a misconception "Magnets can exert a force through paper, but not
  wood, a table, or other thick materials." © Oak National Academy 2026, OGL v3.
  https://thenational.academy/teachers/programmes/science-primary-ks2/units/simple-forces-including-magnets/lessons/blocking-magnetic-force
- Also seen (not read): NSTA "Magnetic force through objects" https://www.nsta.org/resources/magnetic-force-through-objects ;
  IOP Spark "Magnet strength and action distance" https://spark.iop.org/magnet-strength-and-action-distance
- The "light does not" half is everyday (card is opaque); no source fetched for it.
- Use: demoPanel src "Oak National Academy, Year 3: Blocking magnetic force". Confidence: high. Replaces: uncited panel.

### b10-5 (b10_pmic): the school internal-resistance practical  [Q2]
- AQA A-level Physics (7408), required practical "Investigating EMF and internal resistance": a cell with a series
  resistor standing in for its internal resistance, a variable load (0 to 100 Ω), an ammeter and a voltmeter across the load;
  ε = I(R + r), so **V = ε − I r**: plot V against I, "The y-intercept of the V against I graph is the e.m.f, and the gradient
  is minus the internal resistance" (worked example ε 1.60 V, r 22.7 Ω). It is number 6 in AQA's list of twelve (from the
  specification; the fetched page does not print the number, so cite it without a number if unsure).
  https://www.savemyexams.com/a-level/physics/aqa/17/revision-notes/5-electricity/5-4-electromotive-force-and-internal-resistance/5-4-2-required-practical-investigating-emf-and-internal-resistance/
  (Edexcel's version is Core Practical 3; OCR's "determining internal resistance".)
- Use: demoPanel src "AQA A-level required practical: EMF and internal resistance". Confidence: high (the practical is on
  every A-level board; the source is a revision site, not AQA's own handbook). Replaces: the uncited voltmeter demo.

### b11-4 Box contents of the six flagships: tools or spare screws? (b11_box)  [Q1]
**Only the Endgame Gear OP1 8K ships a screwdriver.** TechRadar (deck ownTrOp1Box): "A small screwdriver is included, so you can open up the base and swap out the main button switches". No other flagship in the table ships a tool or spare screws:
- **Ninjutso Sora V3** (AusModShop packing list, re-read today): "8K receiver × 1", "Braided data cable × 1", "Original PTFE large foot pads × 1", "HyperSkates dot foot pads × 1", "Brand stickers × 1", plus the drawer box with a one-time seal sticker and the mouse with protective film. No grip tape, screwdriver or screws. The same page: "40g, excluding foot pads"; battery "3.5 weeks", while Ninjutso's own page says "up to 3 weeks". The two disagree.
- **Pulsar X2 CrazyLight** (AusModShop, deck ownX2Box): 8K dongle, USB-C cable, 16 UHMW-PE 6.6 mm dot skates. No tools.
- **Finalmouse Starlight X** (Back2Gaming, deck ownB2gSlx; XiaomiToday agrees): puck receiver, braided USB-A to C cable. No tools.
- **Razer Viper V4 Pro** (TweakTown, Profesional Review): dongle, cable, grip tape, stickers, docs. No tools, no spare skates.
- **Logitech Pro X3 Superstrike** (ProSettings, plus Logitech's X2 list): see "INT-b11_box". No tools or screws, and only the POWERPLAY door carries a spare foot.
Sources: https://ausmodshop.com/products/ninjutso-sora-v3-wireless-gaming-mouse ; the deck's own ownTrOp1Box, ownX2Box and ownB2gSlx URLs ; https://www.tweaktown.com/reviews/11398/razer-viper-v4-pro-wireless-gaming-mouse-built-for-competition/index.html ; https://prosettings.net/reviews/logitech-g-pro-x3-superstrike/ . Confidence: high, except that the X3's cable is inferred (see the INT entry).

### b07-9 A shipping mouse that stiffens its shell with a carbon rod (b07_board)  [Q1]
**Yes, in the deck's own sources: G-Wolves.** The **HTS Plus Pro 8K** is described by G-Wolves as "Single-shell + carbon rod", "no hole pattern", ~28 g, $159 (deck b01GwPlusPro, shop.g-wolves.com/products/hts-plus-pro-8k-wireless-gaming-mouse-28g). The **Warg 8K** is "Single-shell, no holes", with a carbon rod, ~28.9 g, $149 (deck b01GwWarg). So b07_board can name its rival: "G-Wolves HTS Plus Pro 8K and Warg 8K: a single shell braced by a carbon rod". These are the maker's descriptions. No teardown showing the rod was searched for.
Confidence: high that G-Wolves says it; nothing independent looked for.

### b01 (09:0x request) RTINGS' "Finalmouse UltralightX": which variant and size (b01_compromise)  [Q1]
**RTINGS' variant and size can't be read here.** RTINGS review pages render in the browser, and WebFetch returns only the meta description: "a lightweight, wireless gaming mouse" with "honeycomb-shaped cutouts". Search results carry titles and URLs only, no text. **TechPowerUp's review is fully readable and settles the row:** "the medium size" (Lion), $189.00, "My scale shows around 38 g (+/- 1 g)", hexagonal holes across back, sides and bottom. So "UltralightX, $189, 38.0 g" is a medium UltralightX on TechPowerUp's scale. Re-tag the weight TechPowerUp (or "TechPowerUp, RTINGS" if RTINGS' 38.0 g in research/data/mice.json is kept). RTINGS' review URL slug is "ultralightx" (id 38603), a different page from "ultralightx-competition" (id 78570). The flex quote comes from the Competition page; see "INT-b01_compromise" item 4.
Sources: https://techpowerup.com/review/finalmouse-ultralightx/single-page.html ; https://www.rtings.com/mouse/reviews/finalmouse/ultralightx . Query: "RTINGS Finalmouse UltralightX review medium size tested weight 38.0 g Lion". Confidence: high on TechPowerUp. RTINGS can't be checked here.

### b01-4 EloShapes G-Wolves data and X2F outline (b01_rank, b01_density, b01_illusion)  [Q1]
Not fillable from this session: EloShapes loads its database in the browser, and WebFetch gets no data (as b01 found). No search spent. Keep G-Wolves' own pages (b01Gw*) and the traced X2F outline, said as such.

### b04-5 TechPowerUp Viper V4 Pro review pages 2, 5, 7, 8 (b04_reports)  [Q1]
Not reachable this run. The review never comes up in search (two queries tried; see b09-3 / b09-4), and this fetcher only opens URLs that a search has returned. Keep the 2026-11-03 validation report as the record.

### b09-5 Kunai tester guide, Second Shot section (b09_second)  [Q1]
Not fillable by search: it's Brock's private document. A question for Brock.

### b03_switch (b) Razer staff's "almost half" (b01_compromise optical row, b03_switch)  [Q1]
No public source was found by the builders, and none was searched for here. Keep the derived 17.6 %, with Brock's report named as his.

### INT-b11_box Pro X3 Superstrike, in the box, item by item (b11_box)  [Q1]
**X3 (ProSettings' review, 2026-10-06, "Inside the box ... you will get:"):** (1) "The mouse itself", (2) "Grip tape", (3) "A USB receiver", (4) "A USB-C-to-USB-A dongle" (an adapter), (5) "User documentation", (6) "An additional 'POWERPLAY hatch puck' which is covered in mouse feet material".
**Logitech's own list, for the PRO X2 SUPERSTRIKE** (setup guide, AMR, "package contents"): "Mouse", "Optional grip tape", "Receiver (installed in extension adapter)", "USB charging and data cable", "Surface preparation cloth", "Optional POWERPLAY aperture door with foot".
**Gaps and conflicts:** Logitech's X3 product pages (en-au, cs-cz) show an "In the Box" heading with an empty list (it loads in the browser), and the X3's own setup guide didn't come up in search. ProSettings lists **no charging cable**. The X2's official list has one, so ProSettings has probably just left it out, but that's an inference. **No tools, no spare screws, no separate spare skates** in either list. The only spare foot is the one on the POWERPLAY aperture door or puck. The cs-cz page says there's no charger in the box ("neobsahuje nabíjecí zařízení") and that POWERPLAY is "prodává se samostatně" (sold separately).
Suggested table row: X3 Superstrike: receiver + USB-C-to-A adapter, cable (per Logitech's X2 list), grip tape, POWERPLAY door with a foot, (X2 list: a prep cloth); no tools. Tag: ProSettings 2026, Logitech X2 guide.
Sources: https://prosettings.net/reviews/logitech-g-pro-x3-superstrike/ ; https://www.logitech.com/content/dam/support/g-mice/pro-x-superstrike/user-manual/pro-x2-superstrike-setup-guide-amr.pdf ; https://www.logitechg.com/en-au/shop/p/pro-x3-superstrike-mouse ; https://www.logitech.com/cs-cz/shop/p/pro-x3-superstrike-mouse . Query: "\"X3 SUPERSTRIKE\" \"in the box\" LIGHTSPEED receiver USB-C cable grip tape POWERPLAY aperture door". Confidence: medium. One review lists the X3; Logitech's official list is the X2's.

### b06_fillet: the de Havilland Comet 1's real window size and corner radius  [Q2]
- **Changes an illustration on screen.** The Comet 1's "square" cabin windows had large rounded corners. From the RAE's
  fatigue test of a whole Comet I cabin: "Window: 16.6 in. wide x 14 in. high, corner radii 3 in." (= **422 × 356 mm,
  r 76 mm**, so r is 18 % of the width); escape hatch 19.0 × 21.5 in, r 4 in. Skin round the windows 20 s.w.g.
  (0.036 in, 0.91 mm); elsewhere 22 s.w.g. (0.028 in). Cabin cycled 0 to 8.25 psi (57 kPa).
  Stresses at 8.25 psi: about 20,000 psi at the outer rivet row; edge-extrapolated 47,700 psi (329 MPa) at a window's top
  rear corner and 40,000 psi at an escape hatch's; "the general level of stress there is some two to three times that
  found elsewhere in the fuselage". First crack at 5,248 cycles (third port window); cracks at nine windows and two
  hatches in 11,319 cycles; none at the A.D.F. aerial hatches in this test.
  Atkinson, Winkworth & Norris, ARC R&M 3248 (communicated 1960, printed 1962), "Behaviour of skin fatigue cracks at the
  corners of windows in a Comet I fuselage".
  https://aerade.cranfield.ac.uk/bitstream/handle/1826.2/3823/arc-rm-3248.pdf?sequence=1&isAllowed=y
- For the FE: the illustrative "squarish 100 × 110 mm, r 6 mm" (r 6 % of width) is much sharper than the real window. At
  the real proportions a 100 mm wide window is 84 mm high with r 18 mm. Either draw the Comet at those proportions or keep
  the sharp one labelled "illustrative, sharper than the Comet's". Honest story: the corners were rounded but still
  concentrated stress two to three times the general level, at rivet holes, cycle after cycle; today's windows are
  rounder still (ovals).
- Note: the in-service break-up (G-ALYP, Elba 1954) is usually traced to the roof's ADF window cut-out; this test's
  cracks were at passenger windows and hatches. Don't name the ADF window if you show a passenger window.
- Confidence: high (the primary RAE report, measured). Replaces: the illustrative window.

### b06_arch: a whole hen egg's breaking force, end to end  [Q2]
- Sutanto, Abu-Qbeitah, Jeselsohn, Unikewicz, Bonavia, Rudolph, Borja da Rocha, Naghibzadeh & Cohen 2025, "Challenging
  common notions on how eggs break and the role of strength versus toughness", Communications Physics 8:182 (MIT):
  quasi-static compression of whole eggs between plates, 30 each way: **46.0 ± 6.6 N end to end (on the poles)** and
  **45.2 ± 5.5 N on the side**; displacement at cracking 0.161 vs 0.213 mm; the side absorbs about 30 % more energy before
  failure. "the peak forces are found to be similar". Measured.
  https://fermatslibrary.com/s/challenging-common-notions-on-how-eggs-break-and-the-role-of-strength-versus-toughness
  (DOI 10.1038/s42005-025-02087-0); MIT news 2025-05-08: https://news.mit.edu/2025/mit-engineering-students-crack-egg-dilemma-sideways-stronger-0508
- **Watch the classroom story.** The usual demonstration says an egg is strongest end-on. These data say the force to crack
  is the same end-on and on the side (46 vs 45 N); the dome is what makes either strong. Safe wording: "an egg's thin
  dome takes about 46 N end to end, the weight of a 4.7 kg mass (Sutanto 2025)"; don't claim end-on beats the side.
  For scale: 46 N is about 85 times a 0.54 N click, and more than 20 times the 2 N peak squeeze of computer work.
- Supporting: Hahn et al. 2017, J R Soc Interface 14:20160804 ("Nature's technical ceramic"): chicken eggs compressed on
  the poles fail by "axial splitting"; shell strength 18 to 31 MPa; forces only plotted.
- Confidence: high (n = 30 per orientation, peer-reviewed). Replaces: the qualitative IOP Spark / Science World demo, no number.

### b01-9 (b01_illusion): size-weight illusion magnitude near a 1.76× volume ratio  [Q2]
- **No study measures the illusion at a mouse's weight (29 g) or at a 1.76× volume ratio.** The nearest measured figures:
  - Wolf, Bergmann Tiest & Drewing 2018, "A mass-density model can account for the size-weight illusion", PLOS ONE
    13(2):e0190624: equal 200 g objects, small 32 cm³ vs big 596 cm³ (18.6× the volume). In weight matching the big one
    felt like **161 g against the small one's 211 g in a precision grip (24 % lighter)** and **134 g against 202 g grasped
    in the whole hand (34 % lighter)**. Model: perceived heaviness = (1 − w)·(mass estimate) + w·(density estimate), the
    density estimate ∝ ρ^y; fitted haptic y = 0.74, w 0.35 (precision) to 0.47 (enclosure); vision y = 0.54, w up to 0.29.
    https://rcastoragev2.blob.core.windows.net/6e90f943965cdc9e1d491c1d1455be3f/PMC5813910.pdf
  - Plaisier & Smeets 2015, Sci Rep 5:17719: 180 g objects 4 to 6 cm wide felt about **10 to 12 g lighter per cm of width**
    (about 13 % lighter from 4 to 6 cm). https://personal.fbw.vu.nl/~jsmeets/2015/Volume_weight-SRP15.pdf
- Derived (label it): with Wolf 2018's model, taking the two estimates equal for the smaller mouse, the bigger one at 1.76×
  feels 1 − w(1 − 1.76^−y) as heavy: 12 to 16 % lighter by hand, 6 to 8 % by sight. The same shortcut predicts 31 to 42 %
  at 18.6× against the 24 to 34 % measured (it overstates by about a fifth), so **roughly a tenth lighter** is the honest
  size of it, unmeasured for mice.
- Suggested wording: "Same weight, more mouse: a bigger object of the same weight feels lighter (Wolf 2018)"; if a number:
  "roughly a tenth lighter (Derived from Wolf 2018)". Show the balance needle tilting modestly, not dramatically.
- Confidence: high for the direction; low for the number (extrapolated from 180 to 200 g objects). Replaces: "feels
  lighter" with no number. Seen, no magnitude: Buckingham & Goodale 2013 PLoS ONE (z-scores; SWI about three times the
  material-weight illusion), Buckingham 2014 review (no grams or percentages).

### b02-5 update (b02_flush): a single bump under a sliding fingertip  [Q2]
- Better fit than Skedung's ripples for a step at a seam: a single 550 µm dot on a smooth plate moved across the fingerpad
  at 10 mm/s is detected at **1 to 3 µm high** by human observers (LaMotte & Whitehouse's dot studies; abstract shown at
  the record for Johansson & LaMotte 1983, Somatosensory Research 1:21-31, DOI 10.3109/07367228309144538). Slower
  strokes raise the threshold. https://www.sciencegate.app/document/10.3109/07367228309144538
- Wording: "a fingertip sliding over a bump feels it at 1 to 3 µm high, a few per cent of a hair's width" (SCALE.hair
  0.07 mm = 70 µm; 2 µm is about a 35th of it).
- Confidence: medium-high (classic, replicated result; the page's title and abstract may be for two related papers of the
  same group). Replaces: nothing on screen yet.

### b01-10 Press to PC for a mechanical switch on Finalmouse's rig (b01_targets)  [Q1, product named]
**Endgame Gear OP1 8K V2, "high-speed mechanical switch": 5.7 ms**, mean of 50 presses, on Finalmouse's own rig. On the same rig: Starlight X 2.0 ms (TMR-DS), PRO X2 SUPERSTRIKE 3.0 ms (HITS), Viper V4 Pro 7.5 ms (optical). Method, from Gaming-ST's write-up: copper tape on the button, a press device touches it, and an XLat times from that contact to the USB packet at the PC. So it **includes pre-travel**, unlike earlier XLat tests that started at electrical actuation. The Starlight X tested was a pre-production sample. It's a maker testing its own mouse and its rivals, so present it as Finalmouse's figures (the deck's b01FmClick already does). Note the Superstrike on that rig is the **X2**, not the X3. Gaming-ST: Razer lists 0.204 ms for the V4 Pro at 8000 Hz, measured from a different start point, so the two can't be compared. RTINGS' method (a solenoid on copper tape, a USB analyser) is "close to Finalmouse's". No source gives a pre-travel time in ms.
Source: https://gaming-st.com/peripherals/finalmouse-starlight-x-click-latency-measurement/ (PC Gamer original in b01FmClick). Confidence: high on the numbers as Finalmouse's claims.

### b01-11 addendum: Starlight X hours conflict (b01_battery)  [Q1]
One review, XiaomiToday ("Finalmouse Starlight X Review: A 38g Wireless Mouse With New TMR-DS Clicks"), says "At 1,000Hz, battery life is rated for up to 200 hours" and "around 20 hours at 4,000Hz", without saying who rated it. The launch coverage (Gadget Pilipinas 2026-06-03, IT之家 2026-05-26) gives only 250 mAh and "Finalmouse claims SLX delivers their best battery life yet", with no hours, and the deck's Finalmouse technical overview has no rating either (b01SlxBatt). **Don't use the 200 h**: it's unattributed and may be confused with the UltralightX. Keep the Starlight X derived. If Brock wants to check, the Finalmouse store page is the place.
Sources: https://xiaomitoday.com/?p=41976 ; https://www.gadgetpilipinas.net/?p=204250 ; https://www.ithome.com/0/955/163.htm . Query tried: "Finalmouse Starlight X battery life \"200 hours\" 1000Hz 250mAh". The same review lists the box as: mouse, "PerfectPolling 8K Puck-Style Receiver", "Type-C to Type-A Braided USB Cable" (for b11-4).

### b02-2 A review calling the Starlight X's clicks stiff or heavy (b02_tensioner)  [Q1]
**None found.** XiaomiToday's review describes the clicks only as "the Huano Blue Shell Pink Dot switches provide the mechanical click feel", with 40 actuation steps "as fine as 0.01mm", and calls them neither stiff nor heavy. RTINGS' Starlight X review is early-access and renders in the browser. Query tried: "Finalmouse Starlight X review clicks stiff heavy main buttons" (returned launch news, PC Gamer's click-latency story, RTINGS early access). Keep it as Brock's own observation (F27), untagged, as now.

### b02-4 Peripheral Awards trigger-cutout poll, ARYE FCC-1 → RCC-1 (b02_flush)  [Q1]
**Nothing found for the poll.** Query: "Peripheral Awards 2024 trigger cutouts poll ceiling facing side facing mouse" returned only PC Gamer's hardware awards, KitGuru and unrelated pages. The vote probably lives on Discord, X or Reddit, which search doesn't index well. The ARYE RCC-1 query hasn't been run. Keep Brock's doc (clk_brock) as the source, said as his.

### b03_binning (a): a maker claiming binned or sorted switches (b03_binning)  [Q1]
Public examples, all of which give a force *band* and no measured spread:
- **Endgame Gear**: TechPowerUp's OP1we review: "Kailh GO switches binned for an actuation force of 60-65 gf, which are available for separate purchase", and "lighter-binned switches". Overclockers UK sells Endgame Gear "OP1 alt switch set" packs by band: Huano 80M 55-60 gf, Kailh GX 50-55 gf, Zippy DF3-P1L0 50-80 gf, Huano 100M 50-55 gf, HNCHK 150M 60-70 gf.
- **Endgame Gear XM1r**: TechPowerUp: "A set of pre-sorted Kailh GM 8.0 (80 M) switches with an operating force of 55–60 gf is used".
These fit "claims you can't check" (a band, no distribution, no n), so the slide can keep naming no one or name Endgame Gear's "binned 60-65 gf" as the example.
Sources: https://techpowerup.com/review/endgame-gear-op1we/4.html ; https://techpowerup.com/review/endgame-gear-xm1r/4.html ; https://www.overclockers.co.uk/endgame-gear-op1-alt-switch-set-kailh-gx-50-55gf-per-egg-01640.html . Query: "mouse \"binned switches\" OR \"pre-sorted switches\" OR \"hand-picked switches\" operating force gaming mouse". Confidence: high.

### b03_side addendum: a possible second SPDT-side mouse  [Q1]
TechPowerUp's OP1we review: "A set of Kailh GM 2.0 (20 M) switches is used for these" (the side buttons). If the GM 2.0 is the same full-size 3-pin form as the GM 4.0 and 8.0, the Endgame Gear OP1 family is a second, current example. **Unverified:** the pin count isn't stated, so don't print it without a photo.

### b10-3 LED current of an optical scroll-wheel encoder (b10_lights)  [Q1]
**No mouse maker publishes its wheel encoder's drive current.** For scale, a generic slotted interrupter sold for mice: Everlight **ITR9707** (applications list "Mouse Copier"), IF absolute max **50 mA**; characteristics tested at **IF = 20 mA**, VF 1.2 V typ / 1.5 V max; peak pulse 1 A at ≤ 100 µs and 1 % duty. That's a rating, not what a mouse drives it at. With ADNK-3043's 40 µs every 2 ms (2 % duty), 20 mA pulsed would average 0.4 mA, and 5 mA continuous would be 5 mA. The slide's 5 mA assumption should say whether it's continuous or pulsed. Razer's optical wheel (V4 Pro) is proprietary, with no figure.
Source: https://dtsheet.com/doc/565896/everlight-itr9707 . Query: "optical scroll wheel encoder mouse IR LED forward current mA datasheet slotted interrupter". Confidence: high for the datasheet, which bounds the current but doesn't give a mouse's drive.

### b10-6 USB-C mid-mount receptacle mass and pads (b10_board)  [Q1]
**The GCT USB4105-GF-A isn't mid-mount.** DigiKey lists it as "Surface Mount, Right Angle; Through Hole", "24 (16+8 Dummy) Position", a top-mounted USB 2.0 receptacle. No mass is listed. Either name a true mid-mount part (GCT's mid-mount USB-C family, or Molex or Amphenol mid-mounts) or call the 0.40 g and 6.5 mm² "an estimate for a USB-C receptacle", as now. Not filled.
Source: https://www.digikey.jp/en/products/detail/gct/USB4105-GF-A/11198510 . Query: "GCT USB4105-GF-A datasheet USB Type-C receptacle mid mount weight".

### b08-1 Stock scroll-wheel weights, second pass (b08_wheel)  [Q1]
Still **no numeric wheel weights**. Query: "mouse weight breakdown teardown grams each part scroll wheel shell PCB battery skates". HWBusters' Epomaker Carbon X teardown gives the whole mouse only ("My scale clocked it at exactly 46g", 300 mAh / 1.11 Wh battery). One query left in the plan: aftermarket wheel listings that state the stock part.

### b04-4 iPhone macro minimum focus, 2 cm (b04_camera phone analogy)  [Q1]
**2 cm, iPhone 13 Pro and 13 Pro Max, Ultra Wide camera.** Apple Newsroom, updated January 25, 2022: "for the first time users can capture sharp, stunning images with a minimum focus distance of 2 centimeters", and "as close as 2 centimeters (about an inch) away". It credits autofocus in the Ultra Wide. The URL now fetches, because it came up in a search result. Apple's iPhone 16 Pro spec page lists "48MP macro photography" but no distance (support.apple.com/121031), so attribute the 2 cm to the 13 Pro announcement, or say "iPhone Pro macro, from 2 cm (Apple, 2022)".
Source: https://www.apple.com/newsroom/2022/01/share-your-best-iphone-macro-photos-for-apples-shot-on-iphone-challenge . Confidence: high.

### b04-11 Pixel pitch of PixArt gaming sensors (b04_camera "about 1 mm of cloth")  [Q1]
**Array confirmed, pitch not published.** The PixArt PMW3360 datasheet (v1.50, 2016-09-26) says Raw_Data_Sum covers "1,296 raw data values per frame", which is a **36 × 36 array**. It gives no pixel pitch or field of view. The same sheet: "Frame Rate Up to 12000 fps"; Z (lens reference plane to surface) 2.2 / 2.4 / 2.6 mm min / typ / max; lens flange to surface 7.40 mm; lift detection "nominal height + 2 mm (default value)" or + 3 mm, or manual calibration; supply-current test conditions "LED current at 12mA". So "36 × 36" can be printed as PixArt's figure. "30 µm, about 1.08 mm of cloth" stays an assumption and should say so. (ADNS-3080 for comparison: 900 pixels per frame, 30 × 30; see b04-7.)
Source: PMW3360DM-T2QU datasheet via LCSC: https://datasheet.lcsc.com/datasheet/pdf/c018c3e1d470821feefadd37e2f785d5.pdf?productCode=C20612443 . Confidence: high on what the sheet says.

### b04-7 / b04-10 ADNS-3080 Fig. 11, resolution vs Z (b04_focus, b04_camera, b04_sag)  [Q1]
**The curve values can't be extracted from text.** The figure exists: "Mean Resolution vs. Z (White Paper)", y-axis "Resolution (counts/inch)" with ticks 200 to 2000, x-axis "Distance from Nominal Focus (mm)" over about −1.0 to +1.0 mm, curves for White Paper, Manila, Burl, Black Walnut and Black Copy, and an "OPERATING REGION" marker. The text gives no numbers on the curve. Recommended Z is 2.3 to 2.5 mm ("Results in ±0.2 mm DOF"), Figure 9 labels 2.40 mm, frame rate is 2000 to 6469 frames/s, and there are 900 pixels per frame. Figure 12 plots path error against lens-to-surface distance (1.6 to 3.0 mm at 1600 cpi), also without numbers. Reading values off the plot needs the PDF image (Brock or a browser). The thin-lens stand-in stays Derived.
Source: https://dtsheet.com/doc/729170/avago-adns-3080 (also datasheetspdf.com/pdf/915349/PixArt/ADNS-3080/1, not tried). Confidence: high that the numbers aren't in text form.

### b04-6 PAW3950 frame rate (b04_reports smoothing lag)  [Q1]
**XBAB, on its own XA25 (wired): "Pixart PAW3950, running at 20000 frames per second"** (XBAB's blog post introducing the XA25, 2026-05-02). That's a maker's statement about its own setting, not a PixArt datasheet; PixArt publishes none for the PAW3950. **This may change b04_reports' bound.** At 20,000 fps a 16-frame window is 0.8 ms and the moving-average lag (N − 1)/2 = 7.5 frames is 0.375 ms. The slide's stand-in (under 8,000 fps, so at least 2 ms and about 1 ms of lag) only holds if the mouse runs the slower high-performance mode XBAB mentions. State which mode the slide means; for a wired 20 kfps PAW3950 the lag is about 0.4 ms. Retail blogs (Keychron AU, Attack Shark) give no frame rates.
Source: https://xbabtech-site.pages.dev/blog/intro . Confidence: medium (one maker's figure, its own firmware).

### b10-9 (part) Default lift-off settings of rivals (b10_cable)  [Q1]
Logitech G Pro X Superlight 2 (TechPowerUp, 8000 Hz update): "three pre-defined LOD levels", Low, Medium and High. At Low or Medium "the sensor does not track at a height of 1 DVD" (1.2 mm); at High it tracks at 1 DVD but not at 2 (1.2 to 2.4 mm). TechPowerUp doesn't say which level is the default. PixArt's PMW3360 default is "nominal height + 2 mm" (datasheet). Razer's V3/V4 Pro default: not found yet (RTINGS compare pages render in the browser). The slide's "1 mm, the PAW3395's lower setting" stays as stated.
Source: https://techpowerup.com/review/logitech-g-pro-x-superlight-2/5.html . Same page, wired click latency 0.54 ms (sd 0.25); wireless 1.4 / 0.96 / 0.87 / 0.87 ms at 1 / 2 / 4 / 8 khz.

### b08-1 Stock scroll-wheel weights, first pass (b08_wheel)  [Q1]
First query, "stock scroll wheel weight grams weighed rubber wheel aluminum scroll wheel mod comparison mouse": **no numeric wheel weights.** The r/MouseReview thread on AliExpress metal wheels (Wlmouse Beast X) has only "light af" and "I don't notice any difference". Second pass still to run (product listings for aftermarket wheels that state the stock wheel's weight).

### b08-7 (b08_gripmap, any sweat claim): which Derler figure is dry and which wet on smooth glass  [Q2]
- **2.18 is dry, 0.61 is wet.** Derler & Gerhardt 2012, "Tribology of skin: review and analysis of experimental results
  for the friction coefficient of human skin", Tribology Letters 45:1-27: dry skin (finger, edge of hand) on smooth glass
  (Rz 0.05 µm) **2.18 ± 1.09** (range 0.39 to 5); finger pads on wet smooth glass **0.61 ± 0.37** (range 0.07 to 2.12).
  On rough glass (Rz 45 µm) the order flips: **wet 1.43 ± 0.57 vs dry 0.53 ± 0.22**.
  "Under wet conditions ... the friction coefficients were found to be low due to hydrodynamic lubrication" (smooth).
  On rough glass the wet rise comes from hydrated, softened skin enlarging the contact; the wet-dry difference is
  "especially pronounced for contact pressures below 20 kPa".
  https://doc.rero.ch/record/315296/files/11249_2011_Article_9854.pdf
- So the brief's test passes: **wetting lowers friction on smooth glass and raises it on rough**, and a sweat panel can
  come back to the gripmap: a glossy, smooth surface gets slippery when the hand sweats; a textured one grips better.
  Say "smooth" and "rough" as the paper does (Rz 0.05 vs 45 µm), and keep the pressure caveat (light grips, under 20 kPa).
- Confidence: high (review of measured data, the authors' own experiments). Conflict: none; wide ranges (0.39 to 5 dry).
  Replaces: the open question; no stand-in on screen.

### b02-9 (b02_cutouts): just-noticeable difference for fingertip force  [Q2]
- Pang, Tan & Durlach 1991, "Manual discrimination of force using active finger motion", Perception & Psychophysics
  49:531-540: thumb and forefinger squeezing two plates along a track; 5 subjects; **JND about 7 % of the reference force**
  ("roughly 6-8%" in the NASA report version) for **reference forces 2.5 to 10 N**, independent of pushing distance (5 to
  30 mm), finger span (45 to 125 mm) and speed (25 to 160 mm/s). Measured.
  https://link.springer.com/article/10.3758/BF03212187 ; https://ntrs.nasa.gov/api/citations/19950007644/downloads/19950007644.pdf
- For b02_cutouts (5.3 gf extra on the outer side = 11 % of a 0.54 N click): 11 % is above the 7 % JND, but a click is
  **below the tested range** (0.54 N vs 2.5 to 10 N), where Weber fractions usually grow. Honest wording: "11 % more force:
  more than the 7 % a finger can tell apart at firmer forces (Pang 1991)"; don't claim it is felt at 0.54 N.
- Confidence: high for the JND at 2.5 to 10 N; low as applied to 0.5 N. Replaces: "not claimed as noticeable until checked".

### b02-5 (b02_flush): tactile threshold for a step under a sliding fingertip  [Q2]
- Skedung, Arvidsson, Chung, Stafford, Berglund & Rutland 2013, "Feeling small: exploring the tactile perception limits",
  Scientific Reports 3:2617 (NIST, KTH): naïve participants told apart wrinkled surfaces by active touch; amplitudes
  7 nm to 4.5 µm, wavelengths 300 nm to 90 µm; "the amplitude of the features so discriminated is approximately 10 nm".
  https://www.nist.gov/node/577666 (NIST summary; paper: Sci Rep 3:2617)
- Caveat: this is **texture discrimination of periodic wrinkles** (sensed through friction and vibration while sliding), not
  the detection of a single step or ridge. For a single edge it overstates sensitivity; don't write "a 10 nm step is felt".
  Honest wording for b02_flush: "a sliding fingertip can tell apart ripples about 10 nm deep (Skedung 2013), so any step at
  a seam is felt". A single-dot or step threshold is in the next entry if found.
- Confidence: high for the 10 nm wrinkle figure; medium for its use as a step threshold. Replaces: "not on a slide until checked".

### b05-G1 iPhone 16 Pro weight (b05_material scale note)  [Q1]
**199 g** (Apple Support, iPhone 16 Pro Tech Specs: "7.03 ounces (199 grams)"; 149.6 × 71.5 × 8.25 mm). That's the maker's figure, which is all a "phone's weight" human scale needs. 2 N is 204 g, so "about a phone's weight" holds (2 % off).
Source: https://support.apple.com/121031 . Confidence: high.

### b10-2 Razer Synapse 4 install size (b10_software)  [Q1]
**Razer publishes no disk space or RAM figure.** Razer's Synapse 4 requirements page lists only "Windows 10 or 11 64-bit Operating System", an internet connection "to activate full features and software updates", a Razer ID, and notes the install "may take a few minutes to complete". So no install size can be printed from Razer. G HUB: not looked up yet (one query: "Logitech G HUB system requirements disk space"). Keep the slide as now (the apps named, no size claimed), or add "Razer lists no size".
Source: https://mysupport.razer.com/app/answers/detail/a_id/1834 . Query tried: "Razer Synapse 4 system requirements disk space MB install size". Confidence: high that Razer doesn't publish one.

### b11-2 JST SH unmating force per contact (b11_battplug)  [Q1]
**Not published in any JST SH document I reached.** SparkFun's copy of the JST SH sheet gives 1.0 A (AWG #28), 50 V, insulation 100 MΩ min, withstanding 500 VAC/minute, −25 to +85 °C, AWG #32 to #28 and insulation O.D. 0.4 to 0.8 mm, but no insertion or withdrawal force. Farnell's SH cable-assembly sheet has none either, nor does the JST NSH sheet ("low insertion force type", no number). The force lives in JST's product specification sheet, which is supplied on request. Keep the plug without a newton figure.
Sources: https://cdn.sparkfun.com/assets/0/e/1/5/8/JST-SH_right_angle_PRT-25271.pdf ; https://www.farnell.com/datasheets/4788979.pdf ; https://static.chipdip.ru/lib/836/DOC031836274.pdf . Query tried: "JST SH connector SHR-03V-S withdrawal force per contact N specification". Confidence: high that it isn't in the public catalogues.

### REQ-H1 C&K PCM12SMTR dims (board variant B)  [Q1]
**Partial:** DigiKey confirms "Slide Switch SPDT Surface Mount, Right Angle" (C&K PCM12SMTR, DigiKey 1640112). Its page shows no dimensions to this fetcher, and the C&K PCM datasheet PDF hasn't come up in a search result yet. Next query, if budget allows: "C&K PCM12 series datasheet pdf actuator length". Variant B's drawn 6.7 × 2.6 × 1.4 mm with a 1.5 mm actuator stays unverified.
Source: https://www.digikey.co.uk/en/products/detail/c-k/PCM12SMTR/1640112

### REQ-H1 Raytac AN54LM-P20A size, antenna and keep-out (3d/pcb plan 5; b07, b09 board slides) and b09-2  [Q1]
- **Body: 9.9 × 13.3 × 2.0 mm** (Raytac's AN54LM-P20A page: "9.9 x 13.3 x 2.0mm (0.39 x 0.52 x 0.07 inches)", PCB antenna, nRF54LM20A). The series press release (2026-03-25) gives the same size for all three: AN54LM-20 (ceramic chip antenna), AN54LM-P20 (PCB trace antenna) and AN54LM-U20 (u.FL). **So H1's 9.9 × 13.3 footprint is right for the P20A too**, and the board can drop the "from the AN54LM-20A" caveat. Height is 2.0 mm.
- **Keep-out and antenna section length: not public.** Raytac's page says "Preliminary datasheets, desgin guide, and samples available via project registration". The Preliminary Spec Ver. 0.7 link (raytac.com/download/index.php?index_id=99) is blocked to this fetcher by robots.txt, and the "Footprint & Design Guide (261104)" is behind registration. Status: "Coming Soon, Est. Q4 2026"; samples were due "Q2 2026" (press release). **H1's 4.3 mm keep-out stays a stand-in.** Label it as one, or derive it from the MDBT50Q spec ver. K §2.3, which b09 already cites.
Sources: https://www.raytac.com/product/ins.php?index_id=181 ; https://raytaccorp.blogspot.com/2026/03/raytac-abietec-announce-new-an54lm.html . Confidence: high on size; the keep-out can't be filled without registration (a question for Brock or Raytac sales).

### b09-3 / b09-4 Viper V4 Pro battery hours at 2000 / 4000 Hz, and measured at 8 khz (b09_life)  [Q1]
- **2000 and 4000 Hz: Razer doesn't publish them.** Every spec table I read lists only "Up to 180 hours with 1000 Hz" and "Up to 45 hours with 8000 Hz": Basic-Tutorials, TweakTown ("Up to 180 hours at 1000 Hz, Up to 45 hours at 8000 Hz"), Profesional Review, PCGamesN, Scan, Notebookcheck. Keep the derived 126 h and 79 h, drawn hollow and marked Derived. No search can fill this until Razer posts a support FAQ. Query tried: "Razer Viper V4 Pro battery life 2000 Hz 4000 Hz hours support" (retailers only).
- **Measured at 8 khz (TechPowerUp's ~40 h): not reachable.** TechPowerUp's V4 Pro review doesn't come up in search ("techpowerup Razer Viper V4 Pro review battery life skates cable disassembly"; "\"Razer Viper V4 Pro Review\" techpowerup.com"), and this tool won't fetch URLs that haven't appeared in a search. No other review measured hours: PCGamesN only says "two weeks of use between charges" at 1 khz. Keep the ~40 h as recorded in validation-report-2026-11-03, or fall back to Razer's 45 h claim, labelled as such.
Sources: https://basic-tutorials.com/reviews/peripherals/razer-viper-v4-pro-review/ ; https://www.tweaktown.com/reviews/11398/razer-viper-v4-pro-wireless-gaming-mouse-built-for-competition/index.html ; https://www.profesionalreview.com/?p=609879 ; https://www.pcgamesn.com/razer/viper-v4-pro-review . Confidence: high that 2000 and 4000 Hz figures aren't public.

### b04-3 Viper V4 Pro stock skates (b04_sag)  [Q1]
**Thickness and weight aren't published anywhere I could reach.** What's known: "100% PTFE" feet (Basic-Tutorials, TweakTown), described as "dos patines 100% de PTFE" with curved edges plus a "deslizador alrededor del sensor" (two pads plus a ring around the sensor; Profesional Review); "very large" (EloShapes review); no spare set in the box (Profesional Review, TweakTown). That matches the builder's photo-measured layout (two pads plus a ring), so keep the derived 1.9 to 2.0 g at 0.65 mm, marked Derived. One more query could fill the thickness: third-party replacement listings that state the stock thickness ("Viper V4 Pro replacement skates thickness stock mm"). Not run.
Sources: https://www.profesionalreview.com/?p=609879 ; https://www.eloshapes.com/mouse/review/razer-viper-v4-pro . Confidence: high on material and layout; thickness unknown.

### b10-1 (part) Viper V4 Pro stock cable (b10_cable)  [Q1]
V4 Pro: **1.8 m** ("1.8 meters, with fabric sheathing", USB-A to USB-C; Basic-Tutorials). Profesional Review lists 2 m and PCGamesN "6ft long (just over 180cm)", braided and "fairly thick", stiff and heavy enough to hurt wired use while charging; TweakTown also calls it "stiff". **No reviewer publishes a diameter.** Other cables: see the b10-1 entry when it's filled. Until then the 3 mm illustration stands, said as one.
Sources: https://basic-tutorials.com/reviews/peripherals/razer-viper-v4-pro-review/ ; https://www.pcgamesn.com/razer/viper-v4-pro-review ; https://www.tweaktown.com/reviews/11398/razer-viper-v4-pro-wireless-gaming-mouse-built-for-competition/index.html

### b11-4 (part) Viper V4 Pro box contents (b11_box)  [Q1]
Mouse, HyperSpeed Wireless Gen-2 dongle, a USB-C to USB-A cable (2 m per Profesional Review), a grip-tape set, stickers and documentation. **No screwdriver, no spare screws, no spare skates** (TweakTown's list: mouse, dongle, cable, grip tape, product information; Profesional Review: "receptor hemisférico", "juego de grips adhesivos", "pegatinas", "documentación").
Sources: https://www.tweaktown.com/reviews/11398/razer-viper-v4-pro-wireless-gaming-mouse-built-for-competition/index.html ; https://www.profesionalreview.com/?p=609879 . Confidence: high.

### Viper V4 Pro dimensions (any slide drawing the V4 Pro)  [Q1]
**127.1 × 63.9 × 39.9 mm** (Razer's figure, printed by Basic-Tutorials, TweakTown, Scan and EloShapes). Claimed 49 g in black, 50 g in white.

### b07-5 G-Wolves "HTS Ultra" exists? (b07_arms; also b01_compromise)  [Q1]
**Yes.** G-Wolves sells the **HTS Ultra 8K** (store URL in deck SRC b01GwHtsU: shop.g-wolves.com/products/hts-ultra-8k-wireless-gaming-mouse-29g-usb-type-c-port), and TechPowerUp reviews it as the **"G-Wolves Hati-S Ultra 8K"** (HTS = Hati-S). Use the full name "HTS Ultra 8K" (G-Wolves) or "Hati-S Ultra 8K" (TechPowerUp). TechPowerUp's facts: a scale weight of around 31 g (± 1 g), 113 × 61 × 40 mm, "a pattern consisting of hexagonal holes across the entire shell", Huano main switches (blue transparent shell, pink plunger), side buttons on the left only, and "up to 80 hours of battery life at 1000 Hz" (G-Wolves' claim). Its price is given as $149.00 in the spec table and $119.00 for the Standard edition in the text.
Source: https://techpowerup.com/review/g-wolves-hati-s-ultra-8k/single-page.html . Confidence: high.

### b01-12 Pulsar X2 length (b01_compromise, b01_density)  [Q1]
**Pulsar X2 V2 (medium): 120.4 × 63 × 38 mm, 53 g ± 1 g, "Up to 100 hours battery life, ±10% at 1000Hz polling rate"** (Pulsar's own Founder's Edition X2 V2 page; maker's figures). So the X2F's 87.5 mm is 73 % of the 120.4 mm X2 V2. The trace's "about 120 mm" is right. Use 120.4 for the full outline if you want it exact.
Source: https://pulsar.gg/products/founders-edition-x2v2-gaming-mouse . Confidence: high (maker page). Pulsar doesn't say which X2 body the X2F was cut from, so "the X2 cut short" stays a description of the shape.

### b01-11 Finalmouse Starlight X battery hours (b01_battery)  [Q1]
Not fillable by search, as the builder noted: Finalmouse publishes no hours (Back2Gaming). No search spent. Keep the hours derived from its 250 mAh, marked Derived.

### b01-7 Zaunkoenig M2K price, weight, dims (b01_price)  [Q1]
- **Price €299** (TechPowerUp: "€299, which converts to roughly $342"; Club386, 2022-06-15: €299 sandblasted; The FPS Review, 2022-06-11: 299 EUR "about $314"). It's sold in euros, so print €299 and give any dollar figure as a conversion.
- **Weight:** Zaunkoenig claims **24 g**. **TechPowerUp's scale: "around 23 g (+/- 1 g)"**. Some news headlines say 23 g, which is TechPowerUp's measurement, not the claim.
- **Wired** only, PMW3360, 1000 Hz default with 8000 Hz selectable; TPU-sheathed cable measured at 1.60 m (TechPowerUp).
- **Dims:** only "length 79 mm" (The FPS Review). No width or height found on any page I read. Queries tried: "Zaunkoenig M2K price weight grams dimensions mm". TechPowerUp pages 2 and 8 have none, and RTINGS' compare pages render in the browser.
Sources: https://techpowerup.com/review/zaunkoenig-m2k/2.html ; https://techpowerup.com/review/zaunkoenig-m2k/8.html ; https://www.club386.com/zaunkoenig-m2k-claims-to-be-worlds-lightest-mouse ; https://www.thefpsreview.com/?p=74211 . Confidence: high on price and weights, low on dims.

### b01-6 Ninjutso Sora V2 / V3 battery (b01_battery)  [Q1]
- **Sora V2:** no maker hours figure I could read; ninjutso.com/products/sora-v2 needed a permission that wasn't granted. MaxGaming's listing contradicts itself: spec table "80 h" at "1000 Hz", summary "90 hours"; it also lists 39 g, 59 × 119.2 × 37.3 mm and an nRF52840. No mAh anywhere.
- **Sora V3 (Ninjutso's own page):** $119.99, "Weighs at 40 grams", "battery lasts up to 3 weeks on a single charge, 3x longer than V2's", AIMNINJA 2 PRO 45K sensor ("up to 52% more power efficiency compared to PAW3950"). No hours, no mAh, no polling rate given for the 3 weeks.
- Use: Sora V2 "80 to 90 h (retailer listing; Ninjutso's own figure not reached)", tagged as a retailer claim. The V3 can't be put on an hours axis without assuming hours of use a day. Don't convert "3 weeks" to hours.
Sources: https://www.maxgaming.com/en/wireless-mouses/ninjutso-sora-v2-8k-superlight-wireless-gaming-mouse-black ; https://ninjutso.com/products/sora-v3-wireless-ultralight-gaming-mouse . Queries tried: "Ninjutso Sora V2 8K battery life hours 1000Hz mAh specifications"; "Ninjutso Sora V3 battery life hours 1000Hz 8000Hz mAh specs". Confidence: low for V2 hours (retailer, self-contradicting), high for the V3 wording.

### b01-5 G-Wolves HTS Plus Pro 8K independent scale weight (b01_rank)  [Q1]
**None found.** Only retail listings came back. MaxGaming lists "27,7 g" ("approximately 28 grams"), 117 × 61 × 40 mm, PAW3955, €169.90; G-Wolves says ~28 g (deck b01GwPlusPro). No TechPowerUp, RTINGS or EloShapes review of the Plus Pro turned up (TechPowerUp has reviews of the Hati-R Pro 8K and Hati-S Ultra 8K, not this one). Query tried: "G-Wolves HTS Plus Pro 8K review weight grams". Keep it on b01_rank as the maker's claim. Ranking it first on density rests on a claim, and 27.7 vs 28 g already moves its density by about 1 %.
Source: https://www.maxgaming.com/en/wireless-mouses/g-wolves-hts-plus-pro-8k-wireless-gaming-mouse-black . Confidence: high that no independent figure is published in what search reaches.

### b01-3 Pulsar X2F CrazyLight scale weight (b01_compromise, b01_density, b01_illusion, b01_rank, b01_price)  [Q1]
**No independent scale weight is published (2026-11-06).** Use Pulsar's claim, **29 g ± 2 g**, tagged as a claim, wherever 29.5 g appears. Details, the other specs and the queries tried are in "INT-b01_compromise" below. Also confirmed: $149.95 (lethal.gg), 87.5 × 61.1 × 31.6 mm, ABS/Nylon, 210 mAh (Prisjakt, quoting Pulsar), no battery life published.

### b01-2 Logitech Pro X3 Superstrike: scale weight, mAh, dims conflict (b01_compromise, b01_battery, b01_price)  [Q1]
- **Dims conflict resolved for EloShapes / Logitech:** LDLC's listing of the PRO X2 SUPERSTRIKE gives "Dimensions: 125 x 63.5 x 40 mm" ("Depth: 125 mm", "Width: 63.5 mm", "Height: 40 mm") and 61 g (EU), and Notebookcheck says the X3 keeps the X2 Superstrike's shape and dimensions. So **125.0 × 63.5 × 40.0 mm** stands, and ProSettings' 118 × 62 × 39 is the outlier (no unit or method given).
- **Scale weight:** none found. Logitech claims 59 g (61 g EU); details are in "INT-b01_compromise".
- **Battery mAh:** not published. Logitech's pages, Notebookcheck, ProSettings and TheShortcut give hours only ("135+ hours"; TheShortcut: "90 to 135 hours depending on your settings"). No teardown found. For reference, the X2 Superstrike's listing reads "60 to 90 hours" and "up to 90 hours in constant motion" (LDLC); Eurogamer.de, quoted on digitec, says 80 to 90 h at 1000 Hz.
Sources: https://www.ldlc.com/en/product/PB00726304.html ; https://www.digitec.ch/en/s1/product/logitech-g-pro-x-2-superstrike-cable-wireless-mouse-66205067 ; plus the INT entry's sources. Confidence: high on dims, high that no mAh is published.

### b01-1 Razer Viper Mini Signature Edition: price, hours, dims (b01_price)  [Q1]
- **$279.99**: confirmed, but the launch year is **2023**, not 2022 (KitGuru 2023-02-02: "$279.99 USD", €319.99, UK price not announced; TechSpot: on sale February 11, Razer.com only). Fix "2022" in SRC.b01MiniSe.
- **Battery: "Up to 60 hours" with HyperSpeed wireless** (KitGuru, TechSpot; Razer's claim). Neither says at which polling rate.
- **Dims: "approximately 119 mm (length) x 62 mm (width) x 39 mm (height)"** (KitGuru; TechSpot gives the same, Razer's figures rounded). Razer's product page now shows only "< 49 g" and 8000 Hz HyperPolling, with no dims or hours. At launch it was 4000 Hz with the HyperPolling dongle (KitGuru).
- Weight: "49 g", excluding the cable (KitGuru, TechSpot); "< 49 g" (Razer page).
Sources: https://www.kitguru.net/blog/2023/02/02/the-razer-viper-mini-signature-edition-arrives-with-eye-watering-price-tag/ ; https://www.techspot.com/news/97479-razer-viper-mini-signature-edition-jaw-droppingly-gorgeous.html ; https://www.razer.com/gaming-mice/razer-viper-mini-signature-edition . Confidence: high. RTINGS' review page (rtings.com/mouse/reviews/razer/viper-mini-signature-edition) renders in the browser, so its measured weight couldn't be read.

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

### INT-b06 "MOST MICE" on the hexagon lattice (b06_lattice, b06_light)  [Q1]
**Answer: "most mice" would be wrong for 2026 flagships. Keep "Honeycomb mice", which the live 30-b06-lattice.js already prints (both abSplit calls, lines 283 and 391).** Honeycomb shells are a minority among current lightweight mice, and the trend in 2026 is solid shells at similar weights.
Honeycomb (hexagonal holes), with sources:
- Finalmouse UltralightX (2023, medium, $189). TechPowerUp: "hexagonal holes being used across the back, sides, and bottom". RTINGS' review meta text: "honeycomb-shaped cutouts".
- G-Wolves HTS Ultra 8K (Hati-S Ultra 8K). TechPowerUp: "a pattern consisting of hexagonal holes across the entire shell". G-Wolves calls it a "honeycomb semi-solid shell" (deck b01GwHtsU).
- Finalmouse's patent US 10,983,609: hexagonal openings "forming a honeycomb framework" (deck b06FmPatent).
Solid, no holes:
- Finalmouse's own newer ULX Competition "now features solid sides" (finalmouse.com/products/ulx-competition-overview; Periview: "The sides are solid").
- G-Wolves HTS Plus Pro 8K ("no hole pattern"), Warg 8K ("Single-shell, no holes") and Lycan 8K (PC Gamer: ~28.8 g without "poking holes in the shell"), all deck SRC b01GwPlusPro / b01GwWarg / b01GwLycan.
- XBAB XA25: no holes (XBAB blog).
- Logitech Pro X3 Superstrike, Razer Viper V4 Pro and the Pulsar X2F CrazyLight's front half (ABS/Nylon) are solid shells (the deck's own shell field; the X2F from lethal.gg).
Sources: https://techpowerup.com/review/finalmouse-ultralightx/single-page.html ; https://www.rtings.com/mouse/reviews/finalmouse/ultralightx ; https://techpowerup.com/review/g-wolves-hati-s-ultra-8k/single-page.html ; https://finalmouse.com/products/ulx-competition-overview ; https://periview.gg/?p=3024 ; https://xbabtech-site.pages.dev/blog/intro
Confidence: high for each named mouse. No survey counts honeycomb vs solid across the market, so a share ("most" or "few") can't be printed. "Honeycomb mice" with two named examples is the sourced form. The b06 source line could add "honeycomb mice: Finalmouse UltralightX, G-Wolves HTS Ultra 8K (TechPowerUp)".

### INT-b03_side "0 other mice with SPDT side buttons", and b03_side 2-pin side switch force (b03_side)  [Q1]
**Counterexample found: the slide's "0" doesn't hold as worded.** TechPowerUp's teardowns of the **Gamesense MVP Wireless** and **MVP Wired** say of the side buttons: "Another pair of Kailh GM 4.0 (60 M) switches is used for these". That's the same full-size switch as their main buttons, on a side PCB "connected through a 3-pin connector". Kailh's GM family is the full-size 3-terminal (COM / NO / NC) mouse microswitch. Meckeys' page for its sibling, the GM 8.0, says "3pin Micro switch", and stores sell the GM 4.0 and GM 8.0 together as one family. No page I read says *GM 4.0* is 3-pin in words, so that step is an inference (medium-high confidence). Not known: whether the MVP's firmware reads the NC contact (true SPDT debounce) or only NO. A teardown photo can show the third pad.
Other side buttons checked on TechPowerUp's build pages, none called 3-pin: Hitscan Hyperlight ("2-pin low-profile switches from TTC", already in SRC), Razer Viper V3 Pro (surface-mounted CF, beige plunger), Endgame Gear XM1r (TTC, mint plunger), Zowie EC3-C (unbranded, likely Huano), Lamzu Atlantis (Kailh red plunger, later Huano), SPC Gear LIX Plus Wireless (Huano white), AQIRYS T.G.A. Alpha (Huano green), Glorious Model I (Huano green), SteelSeries Rival 5 (unbranded tactile), Cougar Surpassion (Kailh, as its middle button), ASUS ROG Gladius III Wireless (Kailh grey shell red plunger), Mionix Naos Pro (TTC red). TechPowerUp rarely gives pin counts, so this list can't prove that others are 2-pin.
**Suggested wording:** "Full-size SPDT side switches are rare: the only mouse found, the Gamesense MVP, puts Kailh GM 4.0s on a side board", or scope the 0 to 2026 flagships. Theseus's other side-button facts (held by the shell, no side board) aren't contradicted by anything found.
**The 2-pin side switch's force (replaces "the same 55 gf as the rail's"):** Omron **D2LS-21** is a 2-terminal **SPST-NO** surface-mount switch (element14: "SPST-NO", 8.6 × 4.8 × 3.0 mm W × D × H, 1 mA at 6 VDC). Datasheet: operating force **0.6 ± 0.2 N (61 ± 20 gf)**, release force 0.15 N min, overtravel 0.1 mm min, movement differential 0.12 mm max, operating position 3.5 ± 0.2 mm. The stiffer D2LS-11 is 1.2 ± 0.4 N (122 ± 41 gf). That's the maker's spec, not a measurement. TTC publishes no datasheet I could reach for its 2-pin side switches, so for the Hyperlight's own switch the honest line is still "a 2-pin side switch, e.g. Omron's D2LS-21, is specified at 0.6 N ± 0.2". 55 gf sits inside the D2LS-21's band.
Sources: https://techpowerup.com/review/gamesense-mvp-wireless/4.html ; https://techpowerup.com/review/gamesense-mvp-wired/4.html ; https://meckeys.com/?p=36427 ; https://www.alldatasheet.jp/html-pdf/1056449/OMRON/D2LS/349/2/D2LS.html ; https://sg.element14.com/omron/d2ls-21/microswitch-plunger-spst-0-001a/dp/2523216 ; the TechPowerUp build pages listed above (…/review/<model>/4.html).
Queries tried: "mouse side buttons \"3-pin\" switches teardown side switch SPDT"; "techpowerup mouse review \"side buttons\" \"3-pin\" switches"; "\"SPDT\" \"side buttons\" gaming mouse" (only listicles); "Kailh GM 4.0 micro switch 3 pin SPDT specification"; "\"GM 4.0\" Kailh switch \"3 pins\" …" (stores only).
Confidence: high that the MVP uses GM 4.0s on its side buttons (TechPowerUp, both versions). Medium-high that a GM 4.0 is 3-pin. Unknown whether the MVP wires them as SPDT.

### INT-b01_compromise: every rival line checked (b01_compromise; also b01_price, b01_rank, b01_density)  [Q1]
Line by line, as printed in 30-b01-intro.js (rows 160-165):
1. **Pro X3 Superstrike, Logitech, $199.99, haptic triggers, 59.0 g.** It's the X3, not the X2: the X3 was announced 2026-09-23 and was due in stock by 2026-10-06 (Notebookcheck); the PRO X2 SUPERSTRIKE came out earlier in 2026 at $179.99 (ProSettings). $199.99 MSRP (Notebookcheck, ProSettings, TheShortcut). Weight is **Logitech's claim, 59 g** (logitechg.com en-au page: "59 g"); the EU version is **61 g** (Logitech cs-cz page: "HMOTNOST MYŠI 61 g"). I found **no scale weight** (query: "X3 Superstrike" techpowerup review "my scale" came back empty). The trade holds: Logitech's page says the Haptic Inductive Trigger System (HITS) "replaces traditional microswitches". Battery: Logitech says "135+ hours" and gives no conditions (PC Gamer's leak story puts it at 1,000 Hz: b01X3Pcg). Dimensions: Logitech's X3 pages list none; Notebookcheck says they're unchanged from the X2 Superstrike. **Note:** "59.0 g" shows a decimal Logitech doesn't give. The honest reading is "59 g, Logitech's claim (61 g in the EU)".
2. **HTS Ultra 8K, G-Wolves, $119, 31.0 g, 80 h.** The model exists: TechPowerUp reviews it as the "G-Wolves Hati-S Ultra 8K" (HTS = Hati-S). It reads "My scale shows around 31 g (+/- 1 g)", says G-Wolves cites 31 g, gives 113 × 61 × 40 mm, "up to 80 hours of battery life at 1000 Hz" (G-Wolves' claim) and "hexagonal holes across the entire shell". **Conflict, should fix:** TechPowerUp's spec table gives "$149.00", while its intro says the Standard edition "costs $119.00", and it never says which edition it weighed. The G-Wolves store (deck SRC b01GwHtsU) lists the Standard at ~32.9 g and the Deluxe at ~29.5 or ~30.5 g. So "$119, 31.0 g" puts the Standard's price beside a weight that's probably the $149 unit's. Two honest pairings: "$149, 31 g (TechPowerUp's scale, ±1 g)" or "$119, 32.9 g (G-Wolves, Standard)". "31.0" also adds a decimal TechPowerUp doesn't claim (±1 g).
3. **Viper V4 Pro, Razer, $159.99, optical switches.** Confirmed: $159.99 (Notebookcheck 2026-03-24; PCGamesN review: "$159.99"). The switches are "Razer Optical Mouse Switches Gen-4" (PCGamesN). Claimed 49 g in black, 50 g in white; 180 h at 1 khz; PCGamesN says "Even at 8 kHz, you can play for up to 45 hours" (Razer's claim).
4. **UltralightX, Finalmouse, $189, 38.0 g.** Confirmed for the medium. TechPowerUp's UltralightX review covers "the medium size" (Lion): spec table $189.00, "My scale shows around 38 g (+/- 1 g)", which it calls "a bit more than the weight cited by Finalmouse", and "hexagonal holes being used across the back, sides, and bottom". Notebookcheck at launch (deck nbcUlx): $189, 29/33/35 g by size. **Conflict on the trade "Flexes, creaks":** the RTINGS quote in b01RtUlx is about the *UltralightX Competition*, a later model. Finalmouse says that one "now features solid sides" (finalmouse.com/products/ulx-competition-overview), and Periview's ULX Competition review calls it "sturdier, with less flex" than the earlier Pro Series (Tarik, Aceu). TechPowerUp's UltralightX review reports no flex or creak. The price and weight are the 2023 UltralightX's while the flex quote is a different model's: cite each against the model it describes, or name the row "UltralightX family".
5. **X2F CrazyLight, Pulsar, $149.95, 29.5 g.** The price is confirmed: $149.95 (lethal.gg store page). The weight is **Pulsar's claim, 29 g ± 2 g** (lethal.gg: "29g ±2g"). Prisjakt's review (Kay Tomas Bertheussen, 2026-10-15) quotes Pulsar ("Pulsar oppgir 29 gram") and weighs nothing. Also confirmed: 87.5 × 61.1 × 31.6 mm, "ABS/Nylon composite", 210 mAh, no battery life published (Prisjakt). **No independent scale weight exists that I can find.** Queries tried: "Pulsar X2F CrazyLight review weighed grams scale" (standard) and "\"X2F CrazyLight\" weight scale measured actual grams reddit OR review" (extended). Only launch news and stores came back (TweakTown, Guru3D, PC Gamer, ThinkComputers, Shazoo, Terabyte). **Must:** the on-screen 29.5 g has no source. Show "29 g" tagged as Pulsar's claim (± 2 g) unless Brock can point to the report he means. (29.5 g does sit inside Pulsar's ±2 g.)
6. **XA25, XBAB, $169, 24.9 g, wired only.** Confirmed wired. XBAB's own blog: "The XA25 is a 25-gram, wired, 8000 Hz gaming mouse", 117 × 63 × 36 mm, PAW3950, no holes in the shell. Pause Hardware (2026-08-28): battery dropped "au profit d'un câble ultra-flexible", from $169, pre-orders from September 22, Nuvoton M483 MCU, MJF-printed shell. 24.9 g is XBAB's own 9-part breakdown (24.94 g, deck exXbabWeight) against an announced 25 g: a maker's claim, correctly tagged.
Sources: https://www.notebookcheck.net/Logitech-G-Pro-X3-Superstrike-haptic-gaming-mouse-launches-with-boosted-battery-life.1404956.0.html ; https://www.logitechg.com/en-au/shop/p/pro-x3-superstrike-mouse ; https://www.logitech.com/cs-cz/shop/p/pro-x3-superstrike-mouse ; https://prosettings.net/reviews/logitech-g-pro-x3-superstrike/ ; https://theshortcut.com/p/logitech-g-pro-x3-superstrike-review ; https://techpowerup.com/review/g-wolves-hati-s-ultra-8k/single-page.html ; https://www.notebookcheck.net/Razer-Viper-V4-Pro-arrives-as-a-lighter-wireless-gaming-mouse-with-50K-optical-sensor.1257228.0.html ; https://www.pcgamesn.com/razer/viper-v4-pro-review ; https://techpowerup.com/review/finalmouse-ultralightx/single-page.html ; https://finalmouse.com/products/ulx-competition-overview ; https://periview.gg/?p=3024 ; https://lethal.gg/products/pulsar-lab-x2f-crazylight-gaming-mouse ; https://www.prisjakt.no/tester/pulsar-x2f-crazylight ; https://xbabtech-site.pages.dev/blog/intro ; https://pausehardware.com/xbab-xa25-souris-gaming-25g/
Confidence: high on names, prices and claims (maker pages plus two outlets each). Medium on the HTS Ultra edition question (TechPowerUp's page contradicts itself). High that no X2F scale weight is published as of 2026-11-06 in what search reaches. RTINGS pages render in the browser, so WebFetch returns only their meta text.
Replaces: the X2F's 29.5 g (unsourced, b01X2fWt). It also flags the HTS Ultra's price and weight pairing and the ULX flex quote's model.

