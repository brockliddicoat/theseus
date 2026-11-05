# wheel evidence — F27 independent package

**result: published individual component reports recovered; the requested matched plastic-plus-rubber test group remains unresolved.** no wheel was physically weighed in this lane. the JSON preserves real reported numbers, their sources and exact gaps; it deliberately leaves the group mean and savings percentage null.

**first correction for integration: reconcile the 0.90 g scope.** the live scene computes AZ31B body mass while showing a POM axle; a comparison with intact retail wheels needs the full rotating assembly mass, including the pin and any rotating magnet/adhesive/finish. the exact source observation is below.

F27 asks for average plastic wheels with substantial rubber, rather than a PMM-only comparison. the current geometry/density illustration cannot answer that empirical request. these resources support a qualified source comparison now and a reproducible physical comparison next.

## published component reports

these are component values, not whole-mouse weights. “not documented” below means the inspected source does not establish the detail; it does not assert that the author used a bad method.

| product / configuration | published mass | method and source | material / assembly boundary | permitted use |
|---|---:|---|---|---|
| Darmoshark M3 stock wheel | 3.2 g | firsthand owner removes/replaces wheel; no scale, calibration or repeated measurements documented. [owner mod report](https://www.reddit.com/r/MouseReview/comments/1c2eerg/darmoshark_m3_449g/) | a separate firsthand review describes a rubber tread, but does not establish the measured sample’s hub material. axle/encoder inclusion not enumerated. [material review](https://sizusei.com/darmoshark-m3-review/) was checked through indexed text only. | named owner-reported component value; plastic-plus-rubber eligibility pending |
| Incott Ghero Pro stock wheel | 3.77 g | firsthand owner component comparison; no instrument or uncertainty documented. [owner mod report](https://www.reddit.com/r/MouseReview/comments/1dl1rkj/incott_ghero_pro_weight_reduction_mod_5266g/) | the same author explicitly calls the stock wheel rubberized and discusses axle fit. neither the plastic-core material nor exact weighed boundary is established. | strong firsthand lead; material/boundary qualification pending |
| Attack Shark X11 donor wheel | approximately 2.5 g | the Ghero owner reports this replacement mass approximately. [same report](https://www.reddit.com/r/MouseReview/comments/1dl1rkj/incott_ghero_pro_weight_reduction_mod_5266g/) | exact X11 revision, donor materials and included axle not specified. | approximate donor-wheel lead, not a tested model mean |
| Endgame Gear OP1 stock wheel | 1.8 g | the replacement-wheel designer/seller states the stock comparison mass. no weighing method or stock variant specified. [forky mods](https://forkymods.com/products/lightweight-scroll-wheel-op1) | a buyer on the same seller’s listing describes the original rubber wheel; that does not establish its hub material. replacement fits into the existing encoder, but the stock weighing boundary is not itemized. [seller listing / buyer observation](https://www.etsy.com/listing/4385359373/lightweight-scroll-wheel-op1) | designer/seller component claim, with commercial interest visible |
| Mchose A5 donor wheel | “1.5g?” | the M3 author includes a question mark. [owner report](https://www.reddit.com/r/MouseReview/comments/1c2eerg/darmoshark_m3_449g/) | materials, variant and scope unresolved. | search lead only; exclude from quantitative group |
| Logitech G502X Plus Wireless removable wheel subassembly | 6.9 g | firsthand teardown/mod report, with embedded images not inspected in this pass. [author report](https://www.reddit.com/r/G502MasterRace/comments/1q0anxv/tutorial_g502x_chonkster_scroll_wheel_mod/) | author explicitly describes a plastic wheel with rubber strip and a self-contained tilt/free-scroll subassembly. the exact scale payload is not accessible in extracted text. | separate assembly-scope example; never pool with bare rotating wheels |

the M3, Ghero and X11 reports come from **the same modder**, so they are not independent laboratory replication. no numeric ± uncertainty can be assigned from these posts. 3.77 g’s extra digits establish reporting precision only. a fair display may round it to 3.8 g while retaining the original value in data.

## useful controls and exclusions

[PMM’s actual product page](https://pmm.gg/products/magnesium-scroll-wheel-op1-8k-op1w-4k-pulse-cyber-op-for-modkit) states **1.0 g**, magnesium alloy, UltraGrip 3.0 coating and a **polymer pin**. this is a maker specification; its weighing method is not supplied. it is a useful secondary reference and is outside the requested plastic-plus-rubber group.

[forky’s alternative OP1 replacement](https://forkymods.com/products/lightweight-scroll-wheel-op1) is approximately **0.5 g** by seller claim. retain this uncomfortable alternative if making a broader “lightest wheel” argument; this evidence does not establish magnesium as uniquely lightest.

the G502X report also gives **16.3 g** for its G502 Hero donor. that metal-wheel subassembly is outside the requested material class. comparing its mass with a bare Theseus wheel would exaggerate the benefit by including different mechanisms.

the [Pro Intellimouse teardown lead](https://www.reddit.com/r/MouseReview/comments/d3596p/) mentions scale values in album descriptions and an integrated wheel/encoder construction. its page/album was not recovered; no wheel mass was extracted or invented.

Theseus’s **0.9 g** remains the F22.1/F25.2 design target; F30.8 restores straight tread. check the integrator’s latest total for axle, rotating magnet, adhesive and finish before any physical comparison. no Theseus scale result is available here.

**live source boundary to resolve:** `deck/revamp/60-surface.js:94` derives 0.90 g from **508.5 mm³ × AZ31B 1.77 g/cm³**, while lines 86/93 depict/name a POM axle/bushing. that footnote formula does not separately account for the POM part or rotating magnet, adhesive and finish. this is a source-accounting gap, not a measured mass-error finding: publish the component breakdown and full rotating-assembly total, or label 0.90 g as magnesium-body-only if that is its actual scope.

## exact search boundary

searched on **2026-11-05**: 39 quoted web queries, including broad mass/teardown/scale searches, precise gram values, G305/M3/Ghero/OP1/X11 construction, and PMM/forky/MouseClub/TJ Exclusives/Enncoo/FacFox supplier searches. the JSON contains every query verbatim, opened sources, indexed-only sources, exclusions and fetch failures.

coverage includes publicly indexed English results plus Japanese/Chinese construction leads. it excludes private groups, author contact, purchasing, physical tests, paywalled content and frame-by-frame video inspection. generic wheel ranges, whole-mouse weights, ballast weights, gram-force detents, shipping weights and geometry/density calculations were excluded. no claim that measurements do not exist elsewhere is made.

## reproducible weighing protocol

1. **pre-register the samples.** choose at least five named stock gaming-mouse models and exact revisions before seeing their masses. use three physical examples per model when possible. the JSON suggests M3, Ghero Pro, OP1, GPX2 and Viper V3 Pro as candidates; their wheel material eligibility still needs verification. include lightweight designs instead of selecting only heavy examples.
2. **fix one component boundary.** include the rotating rim/hub/spokes, complete tyre, axle/pin, any rotating insert/magnet, adhesive and finish. exclude the stationary encoder body, carrier/tilt cradle, detent spring, PCB and middle-click switch. photograph both sides and list every item. if inseparable, retain the larger assembly in a separate subgroup.
3. **establish balance performance.** prefer 0.001 g readability; 0.01 g may suffice only when repeatability and documented uncertainty support the intended precision. warm up/level per maker, shield from drafts/static and check known small masses bracketing the wheel loads, for example certified 1 g and 5 g masses, before and after. retain certificate tolerance, scale ID, readings and drift. readability is not accuracy.
4. **weigh intact.** do not remove rubber, shave, solvent-strip, drill or change lubricant before the primary reading. tare a clean tray, centre the part, wait for stability, record the full display and photo ID. lift off, verify zero and reposition for five readings. five repeated readings of one wheel are still **one sample**.
5. **separate tyre only afterward, if reversible.** secondary tyre and hub/axle masses can explain the result; intact mass is authoritative. note adhesive/lubricant loss and check reassembled mass. weigh actual PMM and Theseus parts with the same boundary.
6. **publish the raw table and uncertainty.** retain every reading, sample/revision/condition, materials evidence, included parts, calibration checks and photo IDs. report sample mean and repeat SD, then physical-sample variation per model. instrument uncertainty and unit variability remain separate.
7. **name the average honestly.** if qualified data exist, average the pre-registered model means with equal weight per model, list all values and n, and call it “our tested group average.” it is not an industry average. only compare with a measured Theseus prototype at the same boundary; propagate actual measurement uncertainty.

the JSON supplies all raw-table field names and formulas. this protocol is a proposed test plan, not a test performed here.

## minimal integration action

- keep `F27.wheel.1` and `F27.wheel.2` pending.
- if these reports appear now, use individual labelled source cards with **owner-reported / seller claim / approximate** visible. do not label them “our test group” or compute their average.
- keep the 0.9 g Theseus bar visibly **design target**. PMM stays a secondary maker-spec reference.
- defer a percentage headline until several material-qualified, common-boundary assemblies and the prototype are actually weighed.
- a useful proposal line now: **“a thin, open six-arm wheel. 0.9 g design target.”** mass alone does not establish better grip, durability, feel or rotational inertia.

files: `wheel-test-group.json` and `wheel-evidence.md`. no implementation checkout, index, branch, hosting or source was changed.

