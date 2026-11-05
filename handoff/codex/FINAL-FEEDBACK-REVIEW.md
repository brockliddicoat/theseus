# final independent feedback-accountability review

reviewed 2026-11-05, Codex mirror `codex/theseus-revamp-2026-11-05`. source-only independent review; no source edits, new renders, commits, pushes, publication, Claude contact or delegated work. only this report was written. source lines below refer to the hashes at the end, not an unspecified future build.

## verdict

**the revamp is substantive, but “all feedback fully addressed” is not supported.** the 47 new scenes preserve the major mechanical story, and the 283 rated clauses all have a destination in merged coverage. that is traceability, not acceptance. two P1 accountability defects were found and remediated during this review: a missing/overclaimed failure-margin lesson and incorrect pending classification in the notes UI. the P2 source/ledger mismatches below are also reconciled in the frozen source. **no unresolved source-level P1 from this review remains.** final combined-build QA/publication acceptance is a separate root responsibility, and the genuine evidence/design boundaries below remain open. these fixes do not require invented physical data or reopening Brock’s deferred bottom-cover work.

scope: read FEEDBACK F0–F35 and the final F36 live-publication steer, the imported audit including all seven archived click entries, all 13 `deck/revamp/*.js` files, the coverage files, and the relevant actual board/GT01 source and hardware review. counted 114 ratings / 100 note records / 283 unique rated clauses; zero unmapped rated clauses. the audit’s 269 noted + 14 no-note clause split is retained. this does **not** assert every older standing-feedback clause has passed independent visual QA. the lane owners’ render/test evidence remains separate.

## actionable findings

### P1 found → remedied — the important `shlMargin` lesson was marked addressed but was not actually taught

- **requirement:** F33.5 explicitly prioritizes `shlMargin`; F12.12 chooses a 120 MPa failure criterion. original coverage said the criterion, load-to-criterion and allowable-load meaning were visible, but the scene showed only masses, peak stress and own-peak participation. own-peak participation is not a safety margin. the original reviewed defective `40-structure.js` hash was `ea28b54405184119a905370255f329a79bc11d47b9fb5a60d2db874d352d165c`.
- **final remedy independently re-read:** `40-structure.js:62,77–87` now adds a later beat with `120/peak`, `10 N×120/peak`, a higher-is-better load bar and plain explanation. the footer explicitly says linear extrapolation, excludes buckling/contact, and rejects product-capacity interpretation. the three illustrative criterion loads are 67.5 / 90.2 / 125.9 N; this is not a physical failure test.
- **evidence boundary:** the structure owner’s [CLOSURE-HANDBACK.md](../../deck/qa/structure-motion/hotspot-margin/CLOSURE-HANDBACK.md) records 20 clean layout checks, 15 captured events and 11 passed assertions on HTML `f749181243182b79e986c6e3eb3316d36e6f6e6bdae97d964c478557f7b92828`, source `14c57f2329b9c3e0a43176028e2a748c0575655fd5643839cc54022aa071c48d`. the final source hash below differs because root subsequently restored the ULX/GPX2 attribution in another scene’s lead; the margin/whole-PCB code was re-read unchanged. current final combined-build acceptance remains separate. the reviewer did not perform a broad re-render.

### P1 found → source-remediated — false-open and false-responded clause state in the feedback panel

- **defects found:** the initial implementation searched only the current scene’s coverage, falsely opening clauses answered elsewhere, for example `clk_front.10/.11` and binning/no-lights clauses. its partial/prose-pending logic could also mark `F27.shlPick.1` and `F27.shcArms.1/.3` responded without a visible open reason.
- **final remedy independently re-read:** `99-review.js:57–69` now searches all scenes, cross-links “Addressed in”, recognizes partial/open/conditional/review-pending statuses, safely matches clause-ID prose prefixes and keeps reopened state authoritative. it also renders structured verification objects as readable evidence text rather than `[object Object]`.
- **targeted independent check on final frozen source:** executed the actual matching/classification/verification functions against current merged coverage without browser rendering or file writes. six expected cases passed: `shlPick.1`, `shcArms.1/.3`, `wheel.1` and `clk_pomtune.3` stay pending; `clk_front.10` resolves to the shoulder scene without false pending. a `front.10` entry does not accidentally match `front.1`; nested verification evidence formats correctly.
- **remaining acceptance boundary, not a known source defect:** root is running final UI navigation, displayed-reason, panel and persistence checks on immutable `final-candidate.html`. this source review does not substitute for those results. “responded” is not final user/design acceptance.

### P2 found → reconciled — stale structure coverage after the motion rewrite

| discrepancy found | final disposition independently re-read | genuine open boundary |
|---|---|---|
| coverage said “Left is lighter”, opposite the real axis | coverage now correctly says **right is lighter**, up is stiffer; actual transform/label at `40-structure.js:113–115` is unchanged | no invented rival strength curve. |
| coverage said the owner’s GPX2/ULX assessment was in the footer, but it was absent | root restored it explicitly in the **lead**, `40-structure.js:109`: “Brock rates the lighter ULX above GPX2 for build feel.” coverage now matches that location and attribution | `F27.shlPick.1` remains partial: no independently matched rigidity dataset. the panel curves are frame models, not rival-product measurements. |
| coverage claimed the carbon-rod alternative / extra fit-and-tolerance argument was visible but the scene omitted it | `40-structure.js:173` explicitly contrasts the existing FR4 core with separate carbon-fibre rods and extra parts to fit/tolerance; owner coverage is corrected | no unqualified old **1.8× magnesium** figure was restored. the material/structure principle remains; generic efficiency belongs in `rv_specific`. |
| coverage said Brock’s shipping-break account was retained but the scene only mentioned a missing photo | `40-structure.js:174` now explicitly attributes his HTS Ultra reinforcement-arm shipping break; corrected coverage links the two-scene evidence | precise photo-faithful redraw remains partial because the original images are unavailable. |

### P2 found → corrected — electronics wording and replacement lineage

- `50-electronics.js:13` initially called the 3.720 mm² interference a **battery-connector** overlap. the check is `outline.intersection(bat)` (`3d/pcb/tools/review_approved.py:27–28`), and `approved-review.json:2389–2394` identifies the old battery-front envelope / shortened rear board notch, with 718 DRC issues separately. final source correctly says **rear board outline overlaps the old battery-front plan envelope**. no design change was requested.
- two `from` aliases named nonexistent original scenes: `elc_methods` and `elec_sheet2`. root corrected them to **`clk_methods`** in `rv_firmware` (`50-electronics.js:176`) and **`elc_sheet2`** in `rv_web` (`:215`). all other replacement IDs existed in the original source scan. this restores truthful note/idea lineage without requiring a visual redraw.

## seven historically archived click slides: source disposition, not blanket acceptance

| old slide | current substantive answer | what is still not accepted/proven |
|---|---|---|
| `clicks` | `rv_direct_drive`; `20-clicks.js:14–40` reuses the actual GT01 helper. cap is 1.5 mm along / 2.1 mm across; current lower wall is 0.80 mm (`deck/src/10-b-click.js:333`; `3d/parts/gt01.js:62–64`). | reference-inferred dimensions, not a Gateron drawing or selected production SKU. |
| `arc` | upright load/scrape, housing rotation onto the same board, then aligned press (`20-clicks.js:20–40`); 34.2% side component and approved **6% ideal-travel** wording. | not 20% reaction-time improvement; not measured press-to-PC latency; real tensioner dimensions still unknown. |
| `clk_switch` | housing mechanism in the click lane; magnetic/no-emitter power story in `rv_no_lights` (`50-electronics.js:251–281`); Razer “almost half” attributed via Brock and marked unverified, no 2× runtime claim. | no public exact quotation or matched Razer current breakdown; Hall is not zero-power. coverage still points the housing clause at a lane boundary rather than definitive acceptance. |
| `tensioner` | explicitly “AS SEEN IN STARLIGHT X: NO BRIDGE” vs proposed thin crown; square join roots and one screw (`20-clicks.js:143–169`). | illustrative 8.1/26.9/7.7 gf model; actual width/span/crown unknown. exact F28.2 personal photos are not imported. |
| `clk_tenmat` | distinct load, crown formation, clamp and second press; stiffness for grip separated from low bending force for clicking (`:146–169`). | no measured finished-mouse force comparison or universally “stiffer is better” claim. |
| `anchors` | two identical posts/pad pairs, fixed shell, off-centre roll before two-guide assembly and press (`:171–203`). | pad steps explicitly examples; matched rival guide clearances still unavailable. |
| `sidebuttons` | actual old hinge/mini-switch vs shell-held full-size SPDT guide; match-cut 2.4 mm contact end and POM pads (`:315–340`). | F31.4 fixed guide final form remains for Brock’s review; 29.31 g is explicitly the whole-mouse target; no independently exhaustive SPDT market survey. |

other F33.5 priorities are visibly retained at source level: rear cuts (`20-clicks.js:61–81`), front grooves/contact (`:103–118`), shoulder gaps/seams (`:120–141`), material/ruler/specific-property lessons (`40-structure.js:24–55`), triangle/light-structure lessons (`:89–119`), tolerance stack-up (`45-fit-and-assembly.js:15–34`), density/inertia/market story (`10-intro.js:56–177`) and directional grip (`60-surface.js:38–57`). **the missing margin teaching was the important exception and is now restored with narrow owner QA; none of these source-preservation checks is fresh user acceptance.** the new film is not a superficial khz-only edit or automatic low-score deletion.

## old conflicts and boundaries that must remain open

- **current precedence is largely preserved:** blue Theseus / yellow secondary / neutral chapters (F35); magnetic encoder rather than the old optical sealing pitch (F27); straight wheel grooves rather than F25’s diamond tread (F30.8); POM rather than the obsolete PTFE question (F31.3); 70% carbon-filled re-screw estimate rather than the old 85% (F21.5); AN54LM-**P20A**; conditional PAW3970 access rather than asserting exclusivity has ended; no SLX battery-hour figure invented. optional-cover and decorative QR/serial/engraving showcases stay out of the default film. explicit legacy routes preserve comparison history only (`00-runtime.js:5–9,39–43`); they do not approve those designs.
- **F30 plan / GT01 implementation exists, but manufacture does not:** approved-plan adapter, symmetric A/B board geometry, current centreline gaps, relocated sensor/lens/dots and thicker reference-inferred GT01 walls are actual source changes, not only a promise. `05-hardware.js:24` exposes the revision and known fits. the review retains **718 DRC issues**, **3.719677 mm²** old battery-envelope overlap, unverified complete-mouse mass properties and centre-balance target. do not reuse old DRC=0 or old plate FE as current acceptance. the B edge-switch alternative and the final shell power aperture are different decisions.
- **mass / aim / timing:** current cover, weight truth and close mark 29.31 g / 200 h at 1khz / $189 as targets; the shell budget is residual design budget, not a weighing. `rv_inertia` names a constant-force ideal mechanics model and explicitly does not promise faster aim (`10-intro.js:145–177`). `rv_spdt` and firmware distinguish 70 µs electrical from preceding physical travel (`20-clicks.js:286`; `50-electronics.js:211–212`). no extra physical claim needs to be fabricated to make the deck sell.
- **genuine open work:** independent GPX2/ULX rigidity evidence (owner build-feel attribution is now visible); retail rubber/plastic wheel test group (the three controls are calculated designs, not retail measurements); matched rival guide clearance; final grip-map approval F21.9; F31.4 side-guide acceptance; final battery/lead/protection selection and fit/COM; production bin limits and raw records; actual RF/runtime/latency/endurance; finished conformal-coat mass. a proposed method can be shown without being called a validated product.
- **explicitly deferred, do not reopen as a review demand:** bottom-cover design and power-switch shell notch; side seam by the trigger; first-fit/rethread numerical simulations; real tensioner size until known; final switch SKU. `rv_shoulder_seams`, repair access and balance label their concept/example boundaries. no bottom-cover redesign is required to close this source review.

### exact missing personal references

| feedback | unavailable imported attachments | honest limit / available substitute |
|---|---|---|
| F28.2 | `0300b3c2`, `c82f85d5`, `1fce7c7f` — white shells / G305 / Lamzu tensioners | cannot certify exact photo-faithful reconstruction. preserved code and other teardown-informed geometry remain usable as labelled examples; this does not supply the unknown real dimensions. |
| F28.3 | `d2ae72fe-image.png`, `80f31ed6-image.jpg` — G-Wolves board and broken-arm part | whole-PCB diagram is a structural schematic, not an exact trace. do not silently close the photo-accuracy clauses. |
| F30.11 | `c2c68601` — marked intermediate board plan | final `handoff/plan-images/board-plan-5.jpg` and plan5 generator are present, so this missing intermediate image does not undo the later approved plan. |

named GT01 copies **are** available (`refs/photos/gateron-gt01-{render,exploded,vertical-push}.jpg`), though not verified byte-identical to old attachment IDs. raw Sora scan / Kunai guide are intentionally private or unavailable, not a reason to publish private assets. these are reference limits, not excuses to represent unmapped or partial feedback as accepted.

## final-source / artifact boundary

F36 requires a served build/version/browser-runtime match and safe preservation of unsaved reviews before a live update can be called successful. root owns the final immutable 47-scene combined QA, artifact hashes and publication acceptance. this review neither publishes nor asserts those running checks have already passed. earlier lane render evidence, current source completion, physical validation and Brock’s design approval are different claims.

## exact reviewed source hashes

snapshot capture: **2026-11-05T10:01:36-06:00**, after owner freeze and narrow final re-read. these are the actual reviewed scene bytes, not a claim about a later combined HTML/deployment. coverage/feedback hashes identify the exact ledger snapshot; later acceptance updates may legitimately change it.

| file | SHA-256 |
|---|---|
| `deck/revamp/00-runtime.js` | `b64d3b30d8f708d8139bf8ee75801cd903a4e52aeb2b37f8cc8a5e91d0609c29` |
| `deck/revamp/05-hardware.js` | `a7b5be07e05f2b94a2e55a3aa9e522c8c8ecfe7b654bf4b66fd370e008f69ca1` |
| `deck/revamp/10-intro.js` | `b25462d4c05de251ab485c0978f30ab15818f07e9576efdfdae222163d9976fa` |
| `deck/revamp/20-clicks.js` | `2f8624c511c0b76f53e254fc7948c96f920d3e6a95fd94065263bd650712670f` |
| `deck/revamp/30-glide.js` | `90ea58893a71b10c1763c706c966a8130bba277aa22bffef106d411f1efb72d6` |
| `deck/revamp/40-structure.js` | `dbeaab21b60bd61c01a4d98cf851d63a41152515674d814fdc9f76a4eb3f5b81` |
| `deck/revamp/45-fit-and-assembly.js` | `429b44e22aa522dfcdb100e44306e57107a255e0bc689301fdecefb243f841d1` |
| `deck/revamp/47-binning.js` | `ba7467ae93cc3a88728fdfb92ce5b1d43f4d547cf6880e69c9ba2c4d549ab29a` |
| `deck/revamp/50-electronics.js` | `78274589ccf5902b78fa8e1c0c8f87ca855c4b3700ca31e7754e41cdccb1d0da` |
| `deck/revamp/60-surface.js` | `c8a8621fc26622e8525974c5bf99775b493eb1f6179ce00419ae218c357a4267` |
| `deck/revamp/70-ownership.js` | `11f4765de13d67556cb380cb3cb4bdd6990df57ac33326162f7435620faae5e1` |
| `deck/revamp/80-close.js` | `e9ad946e583cb8d39f1e7c9ee8b550f331610748e73c9bb5a54e67e9b8193960` |
| `deck/revamp/99-review.js` | `54db4b13a43d631b62ca31a5fdc03e3ed2f4176d71bce0cf587ed84ef97a4e8c` |
| `deck/revamp/coverage-evidence.json` | `4abb71b0db53ead9a22926923089df3b4624756c0b918e5fd470e9fbb204f1ab` |
| `deck/revamp/coverage-integrator.json` | `5e528fa053866eb04ae29902a244ae66dbdd4c405a7f101e086a4e941d6223c7` |
| `deck/revamp/coverage-mechanics.json` | `553047745bc9278e92df8dada2294b9891b3070a11e4d262cf430c4445004eb2` |
| `deck/revamp/coverage-structure.json` | `6a79ce9f56988673f1827ba828357b97d0763d51d7c3d93fd7b906097a0e0fa1` |
| `deck/revamp/coverage-surface-own.json` | `5f7c52ade018e1a060d67139eab8bf98a2099cddabec69fcc6516f37360c3a98` |
| `deck/revamp/coverage.json` | `1ec287c551ebc3d917f749b23abce174731411b0eecddc983c80ae592a1ab7a7` |
| `FEEDBACK.md` | `40b1e36c44e37728a5cf507d7b5b3a4bf8f9d3914c89ed0f3f1a7d1a5ecd8cbe` |
| `handoff/codex/feedback-audit.json` | `a7140b2a0c98a60f48c43c6529f2ec58034dbb86420cb59c15e2abb3e7bc02d6` |
