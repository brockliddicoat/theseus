# Theseus revamp — evidence handoff

verified: **2026-11-05**. scope: targeted F27 / F31 / F33 verification, not an audit of every inherited slide. machine-readable companion: [codex-verified.json](../../research/data/codex-verified.json).

## decisive edits for the new story

- **keep the uncomfortable rivals.** G-Wolves HTS Ultra Deluxe and HTX Mini are legitimate light, relatively full-size wireless comparators. The honest claim is not “nobody else can do 29 g”; it is the specific package Theseus proposes without the particular compromises demonstrated.
- **density is a proxy, not fit or material density.** Define the chart quantity as mass / bounding-box volume. Use maximum width consistently, not grip width. Show silhouette and dimensions so viewers see what the number means. A low number cannot prove good ergonomics, strong construction, or universal superiority.
- **X2F: 29.5 g is one measured sample, not “at least 29.5 g.”** Its official 29 ±2 g tolerance includes that sample. It is evidence of actual fitted weight, not evidence of dishonest advertising.
- **do not promise 2× battery life from “magnetic.”** A Hall sensor consumes current while awake. Its duty cycle, conversion time, number of channels, MCU overhead, regulator losses and acceptable missed-scroll/latency rate decide energy.
- **94% → 100% axial force is defensible geometry. “6% sooner” is not a measured latency result.** Preserve F31.2 as an explicitly labelled ideal-model phrase only if its motion assumptions are visible; the stronger primary headline is the actual force-axis alignment.
- **do not invent missing battery hours.** “Not published” is useful information. Capacity alone cannot derive runtime.
- **an honest Pareto front can have corners.** F27 objects to an ugly kink, but smoothing a discrete frontier into a false continuous claim is not the fix. Plot non-dominated points; optional connecting line is a labelled visual guide, with wired and wireless distinguished.

## 1. classroom demonstrations ready for code-only 2D

Each scene should teach the principle with a familiar object first, then carry the same animated load/path into the mouse. Their exaggerated displacements must be labelled illustration, not a Theseus simulation or test.

| principle | researched teaching example | exact lesson and mouse transition |
|---|---|---|
| section geometry | [Open University, Design §6.5 Activity 1](https://www.open.edu/openlearn/science-maths-technology/design-innovation/design/content-section-6.5) explicitly asks students to bend a ruler around both axes | Same ruler, same mass, radically different bending stiffness when rotated. Show a 20 × 2 mm end-on rectangle; ideal rectangular-beam stiffness ratio = (20/2)² = **100×**, derived example. Transition from flat wall to deeper rib. It is **not** a 100× measured shell improvement. |
| triangulation | [University of Colorado Boulder ITL, Straw Bridges](https://www.teachengineering.org/activities/cub_brid_lesson01_activity2) has the instructor press taped straw squares and triangles | Pin-jointed square shears; one diagonal prevents that mechanism. Show equal applied force, then load carried along triangle members. Do not say all triangles are indestructible or prove a whole lattice wins under every load. |
| arches and ties | [University of Innsbruck, “Upside Down” course](https://www.uibk.ac.at/en/design/lsu/teaching/847410-ag-kurzentwerfen-1/) describes students hanging chains, fixing joints and inverting them | Flip the loaded hanging form to show compression, then demonstrate why supports spread and a tie is useful. Carry that tie into the PCB. Funicular behavior depends on the corresponding load and support conditions; arbitrary hand forces on a mouse do not guarantee pure compression. |
| fiber direction | [Cornell SimScience, isotropic / anisotropic](https://sethna.lassp.cornell.edu/SimScience/cracks/glossary/isotropic.html) uses wood grain as its directional-strength example | A bundle of fibers is strong when pulled along fibers but can split between them. Draw load arrows and crack direction separately. Then show intended load paths / molding flow. Molded short fibers are not continuous unidirectional laminate, and wood is an analogy, not material data. |
| tolerance stack | [NASA NTRS tolerance report 19920023212](https://ntrs.nasa.gov/api/citations/19920023212/downloads/19920023212.pdf) works worst-case and root-sum-square cases | Draw recognizable shell, guide, switch and PCB layers accumulating toward a fixed clearance. Illustrative four dimensions at ±0.05 mm: **±0.20 mm worst case**; **±0.10 mm RSS** only for independent centered errors at the same statistical coverage. Show the lost gap, not abstract drops. |
| whole-product reliability | [NIST Engineering Statistics Handbook, series model](https://www.itl.nist.gov/div898/handbook/apr/section1/apr182.htm) states first-failure / independence assumptions | One essential failed component can block a whole input chain. R_system = product(R_i), conditional on independent essential components. This supports a simple link animation; it does not turn part count into measured mouse yield or replace stack-up analysis. |

For human-scale forces, use a **stated illustrative load** (for example “same 5 N squeeze, illustration”) until a defensible measured hand-load distribution or actual prototype test exists. Do not present an invented 5 N as a universal gaming grip force.

## 2. comparison dataset: live values and caveats

The JSON keeps per-field labels and exact source keys. The table below is a handoff summary; every displayed chart should preserve the evidence distinction.

| mouse / configuration | dimensions mm | mass | bbox proxy g/cm³ | connection / battery / price |
|---|---:|---:|---:|---|
| G-Wolves HTX Mini 8K current official | 109 × 60 × 35 | ~26.9 g maker | **0.118** derived | wireless + USB-C; **250 mAh / about 80 h at 1khz** maker; **$159** selected listing |
| G-Wolves HTS Ultra 8K Deluxe | 113 × 61 × 40 | ~29.5 g maker | **0.107** derived | wireless + USB-C; runtime unknown; price of this lightest variant not verified |
| G-Wolves HTR Pro 8K current official | 91 × 57 × 33 | ~25.3 g maker | **0.148** derived | wireless + USB-C; runtime unknown; **$159** selected Strawberry listing |
| G-Wolves HSK Pro ACE official | 73.7 × 56 × 29 | ~26.0 g maker | **0.217** derived | wireless, ACE is **1khz**, not 8khz |
| Pulsar X2F CrazyLight | 87.5 × 61.1 × 31.6 official | **29.5 g owner sample** with four dots; official 29 ±2 g | **0.175** derived from sample | wireless; 210 mAh reported by reviewer; standardized runtime unknown |
| Razer Viper Mini Signature Edition | 119 × 62 × 39 official | 49.0 g maker | **0.170** derived | wireless + USB-C; up to 60 h launch claim; **$279.99 launch MSRP**, not current street price |
| Zaunkoenig M3K | not needed for mass/price comparison | 24.0 g maker, mouse body | not calculated | **wired only, no battery**; **€340** current maker listing; maker prints ~US$396 but FX date is unknown |
| Logitech G PRO X3 SUPERSTRIKE US | not needed here | 59.0 g maker | not calculated | wireless + USB-C; **135+ h** maker; **$199.99** current US listing; dual wired/wireless8khz |
| Logitech G PRO X2 SUPERSTRIKE (predecessor) | not reverified here | 61.0 g maker | not calculated | retained in JSON for provenance; up to90h maker; $179.99 current US listing |
| Finalmouse Starlight X Nightfall | 124.8 × **58.9 grip width** × 39.5 official | 38.0 g claimed / **41.58 g review sample** | do not use grip width as bbox | wireless; **250 mAh** official; no quantified hour claim found in the live technical overview/review; **$179** maker price as observed by reviewer |

G-Wolves sources: [HTX Mini official](https://shop.g-wolves.com/products/htx-mini-8k-wireless-gaming-mouse-1), [EloShapes HTX Mini](https://www.eloshapes.com/mouse/compare?p=g-wolves-htx-mini-8k); [HTS Ultra official](https://shop.g-wolves.com/products/hts-ultra-8k-wireless-gaming-mouse-29g-usb-type-c-port), [EloShapes HTS Ultra](https://www.eloshapes.com/mouse/compare?p=g-wolves-hts-ultra-8k); [HTR Pro official](https://shop.g-wolves.com/products/g-wolves-htr-pro-8k-wireless-mouse), [EloShapes HTR Pro](https://www.eloshapes.com/mouse/compare?p=g-wolves-htr-pro-8k); [HSK ACE official](https://shop.g-wolves.com/products/g-wolves-hsk-pro-ace), [EloShapes browse table](https://www.eloshapes.com/mouse/browse?sort=width-ascending&view=table).

Other sources: [Pulsar official](https://us.pulsar.gg/products/pulsar-lab-x2f-crazylight-gaming-mouse), [X2F firsthand measurement](https://www.reddit.com/r/MouseReview/comments/1xf3ff0/pulsar_x2f_crazylight_review/); [Razer launch specifications](https://www.razer.com/newsroom/product-news/razer-unveils-the-viper-mini-signature-edition-a-magnesium-alloy-gaming-masterpiece); [Zaunkoenig M3K](https://zaunkoenig.co/m3k); [Logitech US price](https://www.logitechg.com/en-us/shop/p/pro-x2-superstrike-mouse), [Logitech comparison for mass/runtime](https://www-gaming.logitech.com/en-gb/discover/learn/superstrike-vs-superlight-2); [Finalmouse technical overview](https://cdn.shopify.com/s/files/1/2377/4861/files/26.5.27_Starlight_X_Technical_Overview.pdf?v=1779939240), [Back2Gaming scale sample](https://www.back2gaming.com/review/finalmouse-starlight-x-nightfall-wireless-mouse/).

### source conflicts to preserve

- HTX Mini: EloShapes says **27.0 g, PAW3395**; current official **26.9 g, PAW3950**, but its detail specs still list 26k/650ips. This looks revision/configuration dependent. Use weight/dimensions with provenance; don't synthesize sensor specs.
- HTR Pro: EloShapes **92 × 57 × 33 / 24.0 g** versus official **91 × 57 × 33 / 25.3 g**. Keep each complete source row; do not mix the lighter weight with different dimensions.
- HSK ACE: EloShapes **73.3 mm / 25.0 g**, official **73.7 mm / ~26.0 g**. It remains in the honesty set.
- HTS Ultra listing displays **$119 for Standard 32.9 g**; that is not verified as the price of the 29.5 g Deluxe. Do not combine them into a fabricated Pareto point.
- M3K maker confirms M2K also weighs 24 g. M2K's older €299 launch price was found only in secondary results this pass, not reverified in accessible maker content; omit the extra historical price point unless clearly labelled historical and sourced separately.
- **X3 resolved in final primary pass:** [official US X3 product](https://www.logitechg.com/en-us/shop/p/pro-x3-superstrike-mouse) gives59g,135+hours,$199.99,and8khz wired/wireless; [Logitech September23 2026 launch newsroom](https://news.logitech.com/press-releases/news-details/2026/From-New-PRO-Gear-to-the-Iconic-Yeti-2-Mic---Logitech-G-Unveils-Fifteen-New-Products-at-Logitech-G-PLAY-2026/) confirms the new generation. The tradeoff chart now usesX3US, not X2 values renamed. X2 remains as a distinct predecessor in JSON. Runtime is maker claim, not matched measured result; chipset efficiency wording is not used to derive whole-device power.
- SLX measured-vs-rated gap: (41.58 / 38 − 1) × 100 = **9.4%** to one decimal. Do not pair 41.58 with the earlier 9.7% derived from RTINGS 41.7 without updating the calculation.

## 3. optical, mechanical and magnetic power

### what is verified

[TI TMAG5253 Rev E, April 2026](https://www.ti.com/lit/ds/symlink/tmag5253.pdf) is a concrete counterexample to “Hall draws nothing”: at 1.8 V / 25°C it lists **2 mA active**, **<20 nA shutdown**, and fast startup. Its worked duty-cycle table uses **50 µs active** and lists:

| sleep interval | average current, one sensor |
|---:|---:|
| 1 ms | 90.5 µA |
| 10 ms | 9.4 µA |
| 50 ms | 1.9 µA |
| 100 ms | 0.9 µA |
| 1,000 ms | 0.1 µA |

Those are component examples, not a selected Theseus encoder. Startup/settling, ADC/MCU work and possibly multiple channels must be counted. Long blind intervals can miss fast rotation. [TI TMAG3001](https://www.ti.com/product/TMAG3001) independently lists **2.1 mA active / 0.45 µA wake-and-sleep / 40 nA sleep**, further illustrating mode dependence.

“No emitter to keep lit” is a good, intuitive magnetic-encoder advantage. “Zero power,” “no possible dust failure,” and “twice Razer’s runtime” are not established. Contactless sensing avoids one contact-wear / optical-path failure mechanism; bearings, detents, mechanical supports, magnets, electronics and firmware remain.

### correction needed in inherited deck

The inherited `clk_switch` computes:

- Omron **5 mA × 30 µs / 1 ms = 0.15 mA per switch**;
- two switches **0.30 mA**;
- Viper nominal average **306 mAh / 180 h = 1.70 mA**;
- fraction **17.65%**, ideal recovered runtime **21.43%**.

This is **not a measured Razer power breakdown**. A datasheet test pulse is not proof of deployed pulse timing, and comparing currents across different voltage rails without power conversion is invalid. Use it only as an expressly hypothetical worked example after rail voltages/losses are accounted for, or remove the percentage. Mechanical switch contact itself needs no light emitter, but sensing circuitry does consume power.

F31.1 records Brock’s attribution: **“Razer staff online,” via Brock, no public quotation located**. The original “almost half” can be shown as that attributed unverified claim if needed to honor the feedback; it cannot support a guaranteed 2× Theseus efficiency claim. A component-level replacement also does not prove whole-product runtime.

[Razer’s current V4 newsroom](https://www.razer.com/newsroom/product-news/viper-v4-pro-arrives-in-esports-green) does publish optical encoder / switches and up to **180 h** battery life. Thus optical does not mean poor absolute runtime; the user benefit to sell is avoiding unnecessary consumption at a given package and workload, pending prototype tests.

## 4. Direct Drive — keep geometry and timing separate

For 20° misalignment:

- axial component = **cos(20°) = 0.93969**, or **94.0%**;
- side component = **sin(20°) = 0.34202**, or **34.2%**;
- alignment gives **100% axial component**, a **6.4% relative increase**;
- these components are perpendicular, so they do not add as scalar percentages. “20% wasted” is incorrect.

The existing **“6% sooner”** is user-approved in F31.2, but vector projection alone cannot establish a time reduction. A specified constant-speed kinematic projection can yield about 6%; a constant-net-force acceleration model with identical travel instead gives a different result, and friction, compliance, pre-travel, spring force and finger motion all matter. A real press-to-PC improvement needs a matched test. Suggested spoken line: **“The switch follows the press, instead of making the press fight the guide.”** Put **“94% → 100% force along the axis · ideal geometry”** on screen.

## 5. reusable data / gaps

### matched mouse-sized battery examples (additional live verification)

[EEMB LP702030](https://www.eemb.com/product-220) is a **350mAh, 3.7V, ~7g bare pouch** (330mAh minimum). [Boying 10440](https://www.boyingcable.com/10440-electric-toothbrush-rechargeable-lithium-battery-37v/) is a **350mAh, 3.7V, ~9g cylinder** (320mAh minimum). That is a concrete **2g** difference at equal nominal capacity/voltage, not a normalized imaginary battery. Different makers, minimum capacities differ, and protection/NTC/leads must be added for a finished-pack comparison. Neither is declared the selected Theseus battery. JSON updated with both sources and explicit package boundaries.

- `research/data/codex-verified.json`: source registry, labelled rival values, density formulas, six demonstration briefs, Hall duty cycle, direct-drive boundary, runtime rule.
- `research/data/mice.json`, `latency.json`, `batteries.json`, `weights.json`: inherited comprehensive datasets, **not automatically reverified by this pass**. Existing measurement-method distinctions still apply.
- `research/validation-report-2026-11-03.md`: corrections for sensor naming, Raytac, PMIC, and electrical vs end-to-end latency. Still use as a correction map, not blanket live verification.
- Missing values stay null. A proposal stays “target” / “proposed.” Do not round a computed 29.31 g budget to an achieved 29 g prototype.
- Current Theseus geometry/mass should come from the integrator’s authoritative local model; it is intentionally not copied into this source dataset.


### conformal coating visual / mass boundary

[HumiSeal1B31 manufacturer datasheet](https://chasecorp.com/humiseal1/wp-content/uploads/sites/12/2018/10/1B31-TDS.pdf) gives25–75µm recommended film and moisture/environmental protection. The new board scene now animates a droplet deflecting around a thin conformal contour after reflow; thickness/motion are exaggerated and waterproof certification is not claimed. Finished coating mass remains unweighed. Do **not** multiply dry-film thickness by the datasheet liquid density0.91g/cm³: solvent loss means these are different states.
