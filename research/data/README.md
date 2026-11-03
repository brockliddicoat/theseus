# Theseus research data (pass of 2026-11-03)

Every value is an object `{value, unit, source_url, source_title, label}`. Derived values add a `formula`, and many add a `note`. Labels: **IM** independent measurement, **DS** datasheet or official spec, **MC** manufacturer claim (including a maker's own measurements), **CA** community or social, **DV** derived. Local evidence is referenced as `file:` paths (Brock's doc, refs/). Proposals are plain text, never labelled values; tag them [PR] in the deck. Nulls mean "not found". Nothing was estimated to fill a gap.

## Files

| File | What it holds | Size of dataset |
|---|---|---|
| `batteries.json` | Li-ion (NCR18650B), Li-polymer pouch (Jauch LP502030JH, 250 mAh), alkaline AA (Energizer E91), NiMH AA (eneloop BK-3MCC), lithium AA (Energizer L91). For each: Wh/kg, Wh/L, cycles, charge C-rate and time, self-discharge, internal resistance. Also: E91 capacity-vs-drain and energy-vs-power curves (digitised), eneloop high-drain curve, Battery University rated-vs-1C chart, the Jauch LiPo family (12 packs, capacity vs mass), mouse power draw, and a worked 29 g example | 145 labelled values |
| `weight-science.json` | Zaunkoenig zero-gram quote (original 2018 blog, exact text, method), Conroy 2022, Yan 2022, Wang 2023, Chen 2012, hand-mass physics | 4 studies |
| `mice.json` | 35 mice (2023–2026, a few older references): EloShapes dimensions, claimed weight, sensor, MCU, switches, encoder and polling; RTINGS measured weight; prices and release dates; battery claims, capacity, charge current, click and motion latency; ProSettings pro usage; claimed-vs-measured weight gap | 467 labelled values |
| `latency.json` | piaknow's full 2026-09-15 motion-latency chart (52 rows × 1/2/4/8 kHz, firmware, sync flags, footnotes, method), XBAB XA25 vs OP1 8k v2 click chart (4 panels, means, 95% CI, n), other click/motion claims, T/2 floor | 52 + 8 + 15 |
| `weights.json` | XBAB XA25 9-part breakdown (24.94 g); Zaunkoenig M1K breakdown with PCB sub-breakdown; candidate part masses; reference whole-mouse weights; derived 29 g budget scenarios | 2 breakdowns, 19 parts |
| `step_further.json` | 30 existing features. For each: best current implementation, evidence, complaints, the Theseus step beyond, the number to publish, and an animation beat | 30 features |
| `claims_check.md` | Verdicts on the report's [UV] items plus 13 other deck facts | 25 rows |
| `missing_ideas.md` | 25 new improvements with evidence | 25 |

## Coverage

- **Mice.**
  - Fully covered (35/35): dimensions, claimed weight, sensor, MCU, switches, encoder.
  - RTINGS measured weight: 24 mice (plus Back2Gaming for the SLX, PC Gamer for the X2 CrazyLight, XBAB's own for the XA25).
  - USD price: 18 mice. Xiaomi is null, with CNY 349 in the unit note, because Notebookcheck's USD figure doesn't match.
  - Release or listing date: 12 mice. Pro usage: 12.
  - Claimed hours at 1 kHz: 10. At 8 kHz: 2 (Razer only).
  - Battery mAh: 4 (V4 Pro 306, SLX 250, Beast X family 300, Xiaomi 530); Beast X Mini Pro 220 is in weights.json.
  - Charge current: 3 (V4 Pro, ULX, X2H, TechPowerUp values via the deck and report). Measured battery life: V4 Pro only.
  - Motion latency: 11 mice (plus 52 piaknow rows in latency.json, many of them older mice). Click latency: 7 mice, mixed methods.
- **Batteries.** All five chemistries come from manufacturer datasheets. Generic ranges come from Battery University (filed as DS and flagged as a reference handbook). Curves were pixel-digitised from 300 dpi renders: ±1.5–3% on E91, ±30 mAh on eneloop.
- **Latency.** Read from piaknow's original image at full resolution. All 8 kHz values match the Kunai redraw. The XBAB chart was read from Brock's PNG, and its text confirmed against the X post.
- **X posts.** WebFetch refused x.com (robots), but the public embed/syndication endpoints returned the post text and image URLs for the two XBAB links Brock sent, piaknow's chart post and the SensorLock post. Brock's links are:
  - `2071972219211985258`: click-latency post, 30 Jun 2026.
  - `2076835183723245671`: weight-breakdown post, 14 Jul 2026.

## Gaps (could not be filled in this session)

- **TechPowerUp is blocked** (HTTP 403 to curl and WebFetch; search returns no snippets). Missing:
  - Battery mAh, voltage, measured hours and charge current for most mice.
  - TPU click-latency tables.
  - TPU numbers here are only those already in the deck or the validation report.
- **RTINGS test values are paywalled** ("Locked") apart from measured weight. Their click latency and battery figures were not used.
- **Reddit returns 403.** Community complaints come from Brock's doc comment thread, reviews (PC Gamer, Back2Gaming, TechRadar, Hardware Busters, Periview, RTINGS blurbs) and X posts. r/MouseReview and Bilibili were not reachable or not searched.
- **Not re-fetched:** Design News (thixomolding), Plastics Today (Beall), makeitfrom (AZ91D, CF-PPS), Denka ABS, Wieleba 2009, the UVA friction table (TLS failure). Those deck items stay [UV], with substitutes noted in claims_check.md.
- **No datasheet mass found** for M2 heat-set inserts (0.16–0.18 g) or the Mill-Max 3305 (~0.11 g). Both stay Brock's numbers [CA]. Weigh ten of each.
- **Unverified features, kept [CA]:** Arye FCC-1 dongle screen, G-Wolves dual plungers, Lamzu Maya front struts, Viper V3 Pro side-button divider, Gilmouse hollow plungers. They rest on Brock's doc only.
- **No published radio masses** (antenna, RF passives, PMIC inductors). The 29 g budget scenarios are lower bounds.

## Conflicts found (the deck should pick one or show both)

| Topic | Source A | Source B | Note |
|---|---|---|---|
| PAW3395 run current | PixArt datasheet: HP 1.7 mA, LP 1.3 mA, Corded Gaming (8 kHz) 10 mA | Deck's EPS Global: 2.4 mA HP, 1.7 mA LP | Use PixArt. |
| E91 capacity at 25 mA | Datasheet EBC-1102Q: ~2,960 mAh | Older revision: ~2,600 mAh | High-drain points agree. Battery University's generic AA alkaline range is 1,800–2,600 mAh. |
| Alkaline shelf life | Energizer: 10 years at 21 °C | Battery University: 7 years (Table 4), 7–10 years (BU-802b) | Use the datasheet for E91. |
| SLX weight | 38 g claimed | 41.58 g (Back2Gaming), 41.7 g (RTINGS) | +9.5–9.7%. |
| SLX width | 58.9 mm (Finalmouse; Back2Gaming says "across the grip") | 62.8 mm (EloShapes) | Grip width vs max width. |
| ULX weight | 29/33/35 g S/M/L (Notebookcheck) | 36 g "ULX Prophecy Medium" (EloShapes, ProSettings); RTINGS 35.9–38.0 g | RTINGS doesn't state the size it tested. |
| MCHOSE L7 Ultra | 39 g (EloShapes) | 45.9 g (RTINGS) | Likely a variant mismatch. Don't chart until resolved. |
| GPX2 price | $159 (PC Gamer 2023; Logitech page JSON) | Notebookcheck implies a $180 MSRP (2025) | Price changed over time. Date the figure. |
| Pulsar X2 CrazyLight | 39 g dots / 41 g PTFE (Pulsar, Medium) | 35 g on EloShapes' plain "x2-crazylight" entry (probably the Mini); reviewer scale 42 g | mice.json uses the Medium. |
| Jauch LP402535JU | 370 mAh (Endrich) | 380 mAh (Farnell) | Likely min vs typical. |
| Xiaomi Gaming Mouse 2 price | CNY 349 | Notebookcheck's "about $31" | The conversion doesn't match CNY 349. Use CNY. |
| Cerakote 8H | Measured on steel at 250 °F | Plastics cure at 150–180 °F | Re-test on CF-PP. |
| Zaunkoenig vs studies | "Optimal weight is zero grams" (argument) | Yan 2022: 40 g had the highest error rate, 60 g preferred (n=12) | No study below 40 g. |

## Best comparisons for charts (computed from the files)

1. **Weight vs price, Pareto frontier (lighter and cheaper).**
   - All mice: XA25 (25 g, $169, wired) → X2F CrazyLight (29 g, $149.95) → X2 CrazyLight M (38.3 g, $130) → Sora V2 (40.9 g, $99.99) → Lamzu Maya (46.4 g, $93.99) → OP1 8k v2 (46.6 g, $89.99, wired) → Keychron G3 (47.4 g, $84.99).
   - Wireless only: X2F → X2 CrazyLight → Sora V2 → Maya → G3.
   - Off the frontier: SLX ($179, 41.7 g) and ULX ($189, 38 g) are dominated by the X2 CrazyLight; V4 Pro, DA V4 Pro and GPX2 are dominated by cheaper, lighter mice.
   - Shade the region left of 29 g as the target zone. Only the X2F (half shell) and the wired XA25 are there.
2. **Weight vs claimed 1 kHz battery hours (lighter and longer).** Frontier: Keychron G3 (47.4 g, 160 h) and Viper V4 Pro (48.9 g, 180 h). No mouse under 45 g in the set publishes an hour rating: SLX none; X2 CrazyLight "a few days of heavy use at 1 kHz"; ULX and Sora none. A published, measured rating at 29 g would have that corner to itself.
3. **Motion latency at 8 kHz vs weight (piaknow).**
   - Wireless frontier: Beast X 8K (39.4 g, 0.68 ms) → Scyrox V8 (40.2 g, 0.51 ms) → Viper V4 Pro (48.9 g, 0.34 ms).
   - The wired XA25 (25 g, 0.13 ms) dominates everything.
   - Plot the wired-to-wireless gap on the same mouse: V4 Pro +0.08 ms, ELECOM +0.23 ms, VAXEE NP01-S V3 +0.45 ms.
4. **Report rate vs motion latency** (log x, piaknow): V4 Pro wireless falls from 1.35 ms (1 kHz) to 0.34 ms (8 kHz), a 1.01 ms drop. The report-interval floor (T/2) drops only 0.44 ms, so the radio and timing stages scale too. Overlay the T/2 floor and shade below the best curve.
5. **Click latency, XBAB vs OP1 8k v2** (grouped bars with 95% CI). The moving-vs-still penalty (OP1 +121–125 µs, XA25 ≈0) is the story. Keep end-to-end tests (Finalmouse: SLX 2.0 / Superstrike 3 / OP1 5.7 / V4 Pro 7.5 ms) on a separate chart, labelled vendor-run.
6. **Claimed vs measured weight** (diverging bar): Razer and Logitech within ±3%; SLX +9.7%, Scyrox +11.7%, Sora V3 +7.5%, G3 +7.7%, Hyperlight +6.7%.
7. **Battery slide.**
   - Wh/kg bars: NCR18650B 243; E91 at 25 mW 163 vs at 1 W 40; Jauch pouch 95–183 across the family (123–128 for the 250 mAh); eneloop 84.
   - E91 energy vs power curve with the mouse load band (6.6–29.6 mW) shaded.
   - "Share of a 29 g mouse" bars: LiPo 26%, L91 52%, alkaline AA 79%, eneloop 93%.
   - Battery University rated vs 1C bars: alkaline 210 → 35 Wh/kg.
8. **Pro usage** (ProSettings, 2,448 pros): GPX2 11.9%, V3 Pro 10.5%, V4 Pro 10.2%, GPX 8.8%, Superstrike 7.4%, DA V4 Pro 6.7%; Maya X 1.6%, ULX 0.8%, Sora V3 0.04%.
9. **Weight waterfall**: XA25 24.94 g → minus the 0.83 g interior cable → plus battery (5 g / 7.5 g / 8 g) → 29.1 / 31.6 / 32.1 g vs the 29 g line.

## Biggest corrections for the deck

1. **Battery slide honesty.** At mouse-level drain an alkaline AA is not lower in energy per gram than a small LiPo pack (163 vs 123–153 Wh/kg for Jauch 250–330 mAh packs). The real arguments: the 23 g single lump (79% of 29 g), single use, collapse under load (25% of the energy at 1 W), and the boost converter needed below the nRF54's 1.7 V minimum.
2. **Zaunkoenig's zero-gram line is an argument, not research.** Quote it as their position (2018 blog). The data covers only 40–190 g, and the 40 g mouse had the highest error rate in Yan 2022.
3. **PAW3395 current.** Replace EPS Global's 2.4/1.7 mA with PixArt's 1.7/1.3 mA, and add the 10 mA corded/8 kHz figure.
4. **29 g budget.** Built like the XA25, a 29 g wireless mouse has ~4.9 g for a battery before radio parts (~140 mAh). A 250 mAh pack needs ~2.6 g cut elsewhere.
5. **Coating.** "Virtually no weight" → "≈0.35–0.46 g per 1-mil coat". "Diamond hardness" → drop it. Cerakote's 8H was measured on steel at 250 °F, not on plastic.
6. **Material wording.** FR4 is stronger than AZ91D in tension but less than half as stiff. KyronMAX tensile goes above 414 MPa for some grades. The SLX shell is claimed below 0.9 g/cm³, lighter than Pyrofil PP-C-10A (0.96).
7. **Superstrike battery.** Use Logitech's 90 h, not the retailer's 60–90 h.
8. **Pricing papers.** They support $179 over $180. They do not support "serials ending in 9".
9. **Shipping charge.** Jauch packs ship at ≤30% charge, consistent with the deck's IATA source. "Comes fully charged" conflicts with that rule, so check the current IATA DGR before promising it.

## New sources added in this pass (not in 05-data.js)

piaknow chart image (pbs.twimg.com/media/HSPkG6fboAAFQJ8.png); XBAB X posts 2071972219211985258 and 2076835183723245671; xbabtech.com; Zaunkoenig blogs (optimal weight; M1K weight in review; lightest PCB); Conroy (pure.ul.ie); Yan, Wang (coeh.berkeley.edu); Chen 2012 (NTU scholars); Energizer E91 and L91 datasheets; Panasonic eneloop BK-3MCC/BK-3MCCF; eneloop 2015 press release; Panasonic NCR18650B; Jauch LP502030JH + Endrich listing; Battery University BU-106/107/206/409/802b; Logitech G305 page; Razer V4 Pro / V3 Pro / DA V4 Pro pages; Logitech GPX2 and 2c pages; PC Gamer GPX2, X2 CrazyLight and Finalmouse click-test articles; Notebookcheck (Superlight 2c, Xiaomi GM2, Vaidemi Nimbus, Zeromouse V35); Back2Gaming SLX review; Hardware Busters Epomaker Carbonis teardown; ZOWIE EC2-DW / U2-DW pages; Shopify product feeds (Finalmouse, Ninjutso, Lamzu, Pulsar, WLMOUSE, Endgame Gear, Keychron); EloShapes compare pages; RTINGS review pages (measured weight); ProSettings mice list; Omron D2F and D2FP (mirror); PixArt PAW3395; Pyrofil PP-C-10A/20A (PlaBase); Gund FR4; Cerakote H-167, C-299, cure table and product guide; Delrin 150 / AF100; Xometry PTFE; Envalior radii guidance; Protolabs; Yizumi thixomolding; Mitsubishi Chemical KyronMAX; Mill-Max 3305 page; Pulsar X2H v3 eS page.
