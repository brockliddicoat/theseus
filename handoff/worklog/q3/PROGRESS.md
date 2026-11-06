# Q3 progress (wheels, POM friction, leftovers)

WebSearch tally: 28 / 30 (stopped; 2 kept in reserve)

## Plan (priority order)
1. b08_wheel: stock scroll-wheel weights, wheel alone (have n = 2 sellers' figures: OP1 1.8 g, Zeromouse kit 1.5 g). Need >= 2 more.
2. b03_side rail: POM-on-POM static and kinetic mu, dry and greased; PTFE-filled POM; silicone grease.
3. Leftovers: default LOD mm (Viper V3/V4 Pro, GPX2, Pulsar X2); measured stock cable diameter.

## Q1/Q2 queries already tried (don't repeat)
- b08-1: "stock scroll wheel weight grams weighed rubber wheel aluminum scroll wheel mod comparison mouse"; "mouse weight
  breakdown teardown grams each part scroll wheel shell PCB battery skates"; aftermarket wheel listings (Forky OP1,
  AusModShop GPX 2.7 g, Zeromouse carbon); "\"stock wheel\" OR \"stock scroll wheel\" weighs \"g\" Superlight OR Viper OR
  Pulsar mod lighter scroll wheel grams"; r/MouseReview under-10 g thread; TechPowerUp X2 CrazyLight; Printables V2 Pro modkit.
- b10-9: "Razer Synapse asymmetric cut-off default lift-off distance level mm Viper V3 Pro"; TPU GPX2 page 5 (3 levels, no default).
- b10-1: "gaming mouse stock cable diameter mm thickness Superlight Viper paracord cable 3 mm measured"; TPU pages: lengths only.
- POM: nothing on friction yet (Q2 did shim tolerance only).

## Done
- 10:18 b10_software LOD + b10_cable diameter -> FILLS + review/b10.md
- 10:12 b08_wheel sixth pass -> FILLS + review/b08.md
- 10:09 b03_side POM friction -> FILLS (entry "b03_side-POM friction") + review/b03.md

## In flight
- none. Final report delivered. 28 / 30 searches used; 2 left in reserve.

## Notes for a resumed run
- Wheels: n = 2 lightweight stock wheels with a source (OP1 1.8 g Forky; Viper V2 Pro 1.5 g Zeromouse, identified via
  PC Gamer / Notebookcheck / Boing Boing). Old metal wheels: G502 13 g, G500 11 g (owner, Overclock.net). 21 searches across
  Q1 + Q3 found nothing else; the honest next step is an owner weighing (0.01 g scale), not more searching.
- Fetch failures: makerworld.com, quasarzone.com, specialchem.com, tweaktown news, bohrium (JS), scribd (no body), RTINGS
  (no test values). TechPowerUp single-page reviews truncate before the sensor section; the V3 Pro sensor page (p5) never
  came up in a search.
- POM: no maker prints a static POM-on-POM value that I could reach; DuPont prints kinetic against itself (0.35 to 0.40)
  and static against steel (0.20). Next query if needed: a Mitsubishi Iupital or Asahi Tenac technical guide.

## Searches log
- 1 (std) "マウス 軽量化 ホイール 重さ 分解 g スケール Superlight OR Viper": Japanese news pages only (inside-games, gamespark, ascii, ifixit topic); nothing weighed
- 2 (std) "aftermarket scroll wheel Viper V3 Pro lighter than stock wheel grams": fetched xiaomitoday PMM Zen 2.0 (V3 Pro 60 g -> 33 g, no wheel figure); r/MouseReview "its_done" mirror (G903 mod, no part weights). Leads: lethal.gg / zerkgamingmods base mods (not wheels)
- 3 (std) "PMM lightweight scroll wheel mouse mod grams stock wheel": FOUND overclock.net/posts/25137867 (ManPhalanges G502 mod: "G502 wheel is 13g, G500 wheel is 11g", "Cheap OEM wheels ... are just 1 gram"; axle not stated; scale not stated). Notebookcheck OP1 8K PMM mod (whole-mouse only), makerworld 1592061 fetch failed (client_error), instructables G305 (no weights in fetched text)
- 4 (std) "\"weighed every part\" OR \"weight of each part\" mouse scroll wheel battery shell grams Superlight teardown": HWBusters part-analysis pages (Q1: whole mouse only), ifixit device pages, makerworld 1909122 (makerworld fails to fetch); nothing new
- 5 (std) "鼠标 滚轮 重量 克 拆解 原装滚轮 轻量化 GPW OR 毒蝰 OR X2": fetched gcores 130887 (GPW / GPX article, whole-mouse only) and bilibili cv51022677 (V4 Pro 49/50 g, no parts); nothing
- 6 (std) "printables OR thingiverse lightweight scroll wheel mouse \"stock wheel\" weighs grams": fetched 3dgo.app/models/makerworld/1909122 (GPX Ultralight shell, 27 g, wheel unweighed); r/MouseReview G305-to-G-Pro comment links (post only, no wheel figure); nothing
- 7 (std) "MouseReview scroll wheel weighed stock vs 3D printed wheel grams Superlight OR \"G Pro Wireless\" OR Viper": fetched r/MouseReview 1d0vznt (ULX Tarik custom Taobao wheel, no grams) and nlhw7q (55 g printed G Pro: shell 30 g only); nothing
- 8 (std) "forkymods lightweight scroll wheel": Forky range did not surface (ifixit GPX wheel guide, hackaday MX wheel, kep modules); fetched zeromouse carbon-scroll again: original 1.5 g is the V34/V35 mod kit wheel, 22.5 mm dia (carbon 0.7 g, 17.25 mm); no retail mouse named
- 9 (std) "\"component weights\" OR \"parts weight\" gaming mouse \"scroll wheel\" grams battery PCB shell reddit": fetched Notebookcheck 876113 (Optimum's 16 g Zeromouse V35 build: donor Razer Viper V2 Pro; "nary a scroll wheel or side buttons remaining from its Razer Viper V2 Pro donor" -> implies the V35 kit reuses the donor's wheel, so Zeromouse's "original 1.5 g" may be the Viper V2 Pro stock wheel: INFERENCE); overclock.net/posts/25138673 (same G502 13 g / G500 11 g text); r/MouseReview 1hr0vwp (MCHOSE L7 Pro mod 18 g total, no wheel figure)
- 10 (std) "\"scroll wheel weighs\" grams gaming mouse": G502/G900 pages; fetched level1techs 150411 (G502 Lightspeed: "full, heavy metal wheel ... swapped for a much lighter wheel with a ribbed rubber band", no grams), legitreviews G900 p2 ("Logitech claims a 47% reduction in the wheel weight", vs G502 Proteus Spectrum; with 13 g -> ~6.9 g DERIVED), evetech G502 X (whole mouse 89 g only)
- PAUSED wheels at 10; moving to POM friction, then back to wheels
- 11 (std) "Delrin design guide coefficient of friction Delrin on Delrin static dynamic table": FOUND DuPont brochure L-12259 04.01 (emcoplastics PDF): dynamic mu against itself (reciprocating, ~0.08 m/s, 0.196 MPa): Delrin 100 0.4, 500 0.35, 100AF (20 % PTFE fibre) 0.18, 500AF 0.22, 520MP (20 % PTFE powder) 0.19, 100AL 0.23, 500AL 0.16, 500CL 0.36, 900SP 0.1, 500SC MB 0.13-0.15; vs steel (block-on-ring 0.5 m/s, 10 N): 100 0.30, 500 0.33, 100AF 0.19, 520MP 0.18. No static values. professionalplastics AF Blend sheet (static .18-.19, dynamic .19-.20, pair not stated). hpceurope "Properties of delrin 150" (D1894): vs steel dry 0.10-0.30, water-lub 0.10-0.20, oil-lub 0.05-0.10, against polyacetal 0.35 (dynamic). Scribd Module III copies: no body text.
- 12 (std) "Hostaform OR Celcon acetal copolymer coefficient of friction against itself static dynamic design guide Celanese": UL Prospector lists, specialchem (fetch failed), salesplastics C 9021 G dossier (qualitative only); nothing
- 13 (std) "polyoxymethylene POM against POM self-mated static and kinetic friction coefficient dry and grease lubricated tribology": FOUND (trends, no numbers): Sabet et al. 2019 Minho conf. paper "Friction properties of POM materials in dry and lubricated conditions" (rcaap record: lubrication "does not seem to influence the static coefficient", dynamic "increases ... by two-fold"; counterface not stated); Ptak et al. 2023 Aviation 27(4):272-278 (POM-POM static, inclined plane, pin-on-plate, 0.64-1.82 MPa; HLP 68 oil raised static mu 31 % at top load; "POM - POM pair had the lowest coefficient of friction under dry conditions"; values in figures only); Li et al. 2024 IEEE TIM 73 doi 10.1109/TIM.2024.3400329 (POM pin on POM disk 40-50 MPa, 0.1/0.5 m/s, grease "can reduce adhesion"; abstract has no numbers; bohrium needs JS)
- 14 (std) "silicone grease plastic lubricant POM on POM coefficient of friction data sheet Klüber OR Nye OR Molykote": FOUND Molykote PG-54 Plastislip TDS (Form 80-3212B-01, 10/20; silicone oil + lithium complex): steel ball 12.7 mm on POM, 6.3 N, 10 mm/s, 24 h: mu < 0.04; PG-75 TDS (71-0171D-01, 07/19; mineral oil/PAO, Li soap, solids): steel ball on POM, 5 N, 10 cm/s, 24 h: mu = 0.02. No POM/POM, no dry comparison.
- 15 (std) "Duracon POM coefficient of static friction dynamic friction against itself same material Polyplastics technical sliding": Duracon SW-01 datasheet (sushengpolymer PDF; POM + PE + lubricant, 10 % CaCO3; JIS K7218): dynamic 0.21 and with steel 0.14 (footnote digits fused; counterpart M90-44 vs C-steel not cleanly paired: MEDIUM); Xiong et al. 2018 ILT 70(2):273-281 (POM vs steel pin-on-disc, trends only); msp-2022-0040 PDF binary
- 16 (std) "DuPont Delrin acetal resin design guide module III pdf coefficients of friction static dynamic": FOUND LBL copy of Design Guide Module III (www-eng.lbl.gov/~shuman/.../delrin_props.pdf), Table 2, ASTM D3702 thrust washer, no lubricant, 50 mm/s, 2 MPa, vs AISI carbon steel: standard grades static 0.20 / dynamic 0.35; 100AF/500AF 0.08 / 0.14; 500CL 0.10 / 0.20; Delrin P dyn 0.30; no Delrin-on-Delrin row. Plastics Intl Delrin 150 sheet: dynamic 0.2 (D3702, 40 psi, 50 fpm, counterface unstated); 100AF sheet: dynamic dry vs steel 0.19.
- 17 (std) "Viper V2 Pro scroll wheel weight grams weighed stock wheel": reviews only; fetched LanOC V2 Pro (Razer's savings: side buttons 2.9 g, RGB 2.7 g, grips 3.2 g, trigger covers 0.6 g; no wheel), Tom's Hardware (58 g, no parts). Free fetches: Logitech MicroGear brief (redirects to logitechg.com home), Hackaday tag page (Engineer Bo wheel, no mass)
- 18 (std) "Pulsar X2 CrazyLight weight reduction breakdown scroll wheel grams lighter components": fetched PC Gamer X2F (29 g total, no parts); TweakTown X2F fetch failed; nothing
- 19 (std) "drilled scroll wheel holes mouse mod grams before after stock wheel weight Superlight OR Viper OR \"G Pro\"": repeats (overclock G502, makerworld, zerk base mods); fetched r/MouseReview eufylg 2020 (no part weights); nothing
- 20 (std) "마우스 휠 무게 g 경량화 순정 휠 교체 지슈라 OR 바이퍼 OR 펄사": two Quasarzone threads (qf_input 417727, qc_qsz 2200553): both fetches fail (client_error); rest irrelevant. WHEELS: 14 searches so far, stopping new-wheel hunting
- 21 (std) "Zeromouse V35 OR V34 kit Viper V2 Pro donor parts reused scroll wheel encoder what you need": FOUND PC Gamer V34 ("you can reassemble the scroll wheel, insert the battery" after harvesting the Viper V2 Pro PCB) + Boing Boing V35 (kit contents: shell, Supergrips, X-raypad skates, battery sticker, screwdrivers; no wheel) -> Zeromouse "original" 1.5 g / 22.5 mm wheel = Viper V2 Pro stock wheel (MEDIUM, by inference)
- free fetches: TPU V3 Pro single-page and X2 V2 single-page: extraction truncated, no LOD section
- 22 (std) "techpowerup \"lift-off distance\" \"1 DVD\" default Viper V3 Pro OR \"Pulsar X2\" sensor performance": TPU page-5s of other mice; fetched Pulsar Xlite V3 eS p5 (PAW3395, "two pre-defined LOD levels": 1 mm no track at 1 DVD (<1.2 mm), 2 mm tracks at 1 DVD not 2 (1.2-2.4 mm); default not stated); Viper Ultimate p5 (1/2/3 mm; 1 mm no track at 1 DVD, 2 and 3 mm do; none at 2 DVDs; default = automatic calibration, LOD default not stated)
- 23 (std) "\"default\" lift-off distance mm Viper V3 Pro OR \"Superlight 2\" OR \"Pulsar X2\" LOD measured review out of the box": FOUND Logitech support 16193588399511 (GPX2 HERO 2: "a low, medium or high Lift off distance for each DPI slot" via G HUB Advanced; no mm, no default); RTINGS compare V3 Pro vs X2 CrazyLight: no test values in fetched HTML
- 24 (std) "Pulsar X2 V2 lift off distance 0.7mm 1mm 2mm default setting Pulsar Fusion software LOD": FOUND github packerlschupfer/pulsar-mouse-linux release v0.1.23: Pulsar X3 "factory 1 mm" (register 02 0a); 0.7/1/2 mm on cable, dongle list 1 and 2 mm (third-party tool, one model: MEDIUM); attackshark/evezone blogs (no defaults)
- 25 (std) "\"cable diameter\" gaming mouse specifications mm paracord USB-C charging cable flagship": fetched Pulsar USB-C Paracord (1.8 m, "X2, X2H, X2A, Xlite"), Pulsar Superflex (1.8 m, X2 V2 / Xlite V3), Glorious Ascended (2 m): NO diameters. Cable: not published (as Q1)
- 26 (std) "\"滚轮仅重\" 鼠标 克": ITHome DeathAdder V4 Pro launch (867/293, 2025-07-10: "Razer's first optical scroll wheel", 56 g whole mouse, no wheel grams); ITHome M2K (no wheel); nothing. WHEELS STOPPED (16 Q3 searches)
- 27 (std) "acetal against acetal static coefficient of friction kinetic plastic on plastic friction table POM-POM 0.2": UL Prospector / Polyplastics "Greaseless Solutions for Unique POM Applications" (2017, sponsored: POM squeaking index from mu_s and mu_d, values in a figure only); Hu 1998 Tribol. Lett. 5:313 (POM vs MC nylon, trends); no POM-POM static number. POM STOPPED.
- 28 (std) "techpowerup Razer Viper V3 Pro review sensor and performance lift-off distance asymmetric cut-off DVD": TPU V3 Pro p4 (Build Quality; sensor is on p5, not returned); razer.com V3 Pro (Smart Tracking "Auto-calibrates to maintain a consistent lift-off distance on all surfaces"; Asymmetric Cut-Off "up to 26 levels"; no mm, no default); Tom's Hardware V3 Pro (asymmetric cut-off mentioned, no default; cable "6-foot (1.8m)", "sturdy and braided", "heavier and stiffer" than SpeedFlex, no diameter)
- STOPPED SEARCHING at 28 (2 left in reserve for the integrator)
