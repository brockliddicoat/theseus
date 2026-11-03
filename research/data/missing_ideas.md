# Missing ideas for a 2026–2027 flagship (beyond the validation report's list)

The report already lists: raw-count width and smoothing test, asymmetric lift-off in fine steps, firmware sensor-angle tuning, a dual-sensor virtual position, PMIC ship mode/NTC/OVP, a weighted dongle, titanium fasteners and a public skate template. Everything below is new. Evidence labels: IM, DS, MC, CA, DV. Proposals are [PR].

## A. Publish measured numbers nobody else publishes

1. **Print each unit's measured weight on its serial card [PR].** Claimed-vs-measured gaps (RTINGS measured vs spec, mice.json):
   - Big brands come in at or under spec: Viper V4 Pro −0.2%, GPX2 −1.0%, GPX2 2c −1.2%, DA V4 Pro +0.2%.
   - Boutique mice run heavy: Starlight X +9.7% (38 → 41.7 g; Back2Gaming 41.58 g), Sora V3 +7.5%, Keychron G3 +7.7%, Hitscan Hyperlight +6.7%, Scyrox V8 +11.7%. MCHOSE L7 Ultra shows +17.7%, but that row looks like a variant mismatch, so check it before use.
   - Hardware Busters weighed an Epomaker Carbonis at 53.0 g vs 50 g spec (+6%) [IM].
   - A guaranteed, measured 29.0 g is a differentiator on its own.
2. **Publish motion latency at 1/2/4/8 kHz, wired and wireless, measured with piaknow's method.** The chart has 52 rows. Only XBAB markets a third-party motion-latency number. Razer quotes its own 0.36 ms.
3. **Publish click latency with 95% confidence intervals, still and moving (XBAB style).** XBAB's chart shows an OP1 8k v2 click arrives ~121–125 µs later when the sensor is moving; the XA25 shows no penalty [MC/DV].
   - The idea: "a click never waits for motion", verified on an analyzer.
   - Nobody else shows the moving case.
4. **Publish battery hours at every polling rate, measured.**
   - ZOWIE lists 80 / 30 / 24 h at 1 / 2 / 4 kHz [MC].
   - Razer lists the V3 Pro at 95 / 62 / 40 / 17 h at 1 / 2 / 4 / 8 kHz [MC].
   - Finalmouse publishes no hour rating for the SLX.
   - Add a measured run-down, with the method, next to the claim.
5. **State the real sensor power cost of 8 kHz.** PixArt's PAW3395 datasheet: 1.7 mA in HP mode at 1 ms polling vs 10 mA in Corded Gaming mode at 0.125 ms polling [DS]. That explains the battery cliff better than any marketing line, and justifies FrameSync/SensorLock-style timing and frame-rate management.
6. **Publish coating mass and on-substrate hardness.** A 1-mil Cerakote coat on a Sora-size shell is ≈0.34–0.46 g [DV]. Cerakote's 8H was measured on steel cured at 250 °F; plastics cure at 150–180 °F [DS]. Measure hardness on the CF-PP shell.

## B. Link and power

7. **Packet-loss rescue on a second channel.** Pre-production Kunai (tekkusai, private guide):
   - Sends a spare copy of each report one 125 µs slot early, ≥8 MHz away.
   - "99 to 100%" of lost reports rescued at 4 kHz with a headset nearby; about 92% in the worst room [MC, unreleased].
   - Theseus should match it and publish loss vs distance.
8. **Speed-adaptive frame rate in firmware.** Logitech's HERO "continuously adjust[s] frame-rate processing based on mouse speeds", which gives the G305 250 h on one AA [MC]. Most PixArt-based boutique mice don't advertise anything similar.
9. **Finger-presence sleep.** The Kunai guide uses its button sensors to sleep 10 s after the hand leaves and wake on touch [MC, unreleased]. With TMR or analog buttons this is nearly free and saves idle drain.
10. **Head start at low polling rates.** Kunai sends the first movement after rest in the next 0.125 ms slot at 1–2 kHz instead of waiting up to 1 ms [MC, unreleased].
11. **One firmware update for both ends, plus wired use without the dongle.**
    - TechPowerUp: the ULX's XPanel talks only through the dongle (deck source).
    - The Kunai app updates mouse and dongle together [MC].
12. **Pick a 1C-rated cell, or don't advertise fast charge.** The Jauch 250 mAh pack (same capacity as the SLX's Jauch cell) is rated 0.5C max charge [DS]. The nPM1300 can do 800 mA, but the cell sets the ceiling.
13. **Ship at 30% state of charge and say why.** Jauch packs ship at "max. 30%" [DS], and the deck's IATA source cites 30%. Brock's "come almost fully charged" idea conflicts with this. Instead, top up on first plug-in and show time-to-full on the dongle.

## C. Weight and structure

14. **Plan the weight budget around the battery.** Built like the XBAB XA25 (24.94 g wired, part-weighed), a 29 g wireless Theseus has ≈4.9 g left for a battery before any radio hardware [DV, weights.json]:
    - That is a ~140 mAh-class pack: ~18 h at an 8 kHz load, ~79 h at 1 kHz.
    - A 250 mAh pack needs ~2.6 g cut elsewhere, most likely from the 12.2 g shell + skates.
    - Show this tradeoff on a slide.
15. **Solid shell at 29 g has a precedent.** Vaidemi's DIY Nimbus:
    - 29 g including skates and paint, with no holes.
    - SLA resin over an internal skeleton; survived 30+ kg [CA, via Notebookcheck].
    - Pulsar's 29 g X2F gets there by cutting off the rear half of the shell instead.
16. **Move the battery to cut yaw inertia, not just to lower the centre of mass.** The Zeromouse V35 relocates the battery "to reduce the moment arm" [CA, via Notebookcheck]. Publish the mouse's centre of mass and its moment of inertia about the vertical axis (g·cm²).
17. **Use a snap-on or small lens.** Zaunkoenig's M1K lens weighed 0.8 g, more than the PMW3360 sensor (0.6 g) [MC]. Razer's Focus Pro Gen-3 moved to a new package with a snap-on lens (TPU and Brock).
18. **Count PCB area as mass.** Zaunkoenig: each D2F footprint costs 0.21 g of FR4 at 1.55 mm, and 14 capacitors (0.04 g) occupy 0.39 g of board [MC/DV]. This supports single-sided, top-side-only, minimal-area boards (#92) and counts against extra buttons.
19. **Specify the cable by numbers.** The XA25 cable is 1.9 mm thick, 6.9 g/m, and passes the USB 2.0 high-speed eye-pattern test [MC]. Use it as Theseus's spec: diameter, g/m, bend force, eye-pattern pass.

## D. Evidence and positioning

20. **Run the mouse-mass study nobody has.** Published studies stop at 40 g (Yan 2022, n=12), with 50 g as the lightest in the large study (Conroy 2022, n=72).
    - Run a 20–60 g Fitts/aim-trainer study, ideally with Conroy's group or a university lab.
    - Publish whatever it finds, including "no difference below X g".
21. **Lead the wireless-vs-wired case with data.** Wang et al. 2023 (IJIE, 16 pros): wireless had a lower error rate (p = 0.05) and higher comfort (p = 0.01); 80 g vs 87 g made no difference [IM].
22. **Pro adoption is concentrated.** On ProSettings (2,448 pros):
    - Top six: GPX2 11.9%, Viper V3 Pro 10.5%, Viper V4 Pro 10.2%, GPX 8.8%, Superstrike 7.4%, DA V4 Pro 6.7% [CA]. Together that is 55.5% of pros [DV: 11.93 + 10.46 + 10.21 + 8.82 + 7.43 + 6.66].
    - Lamzu Maya X is 1.63%, ULX 0.78%, Sora V3 0.04%.
    - A seeding plan with a few pros is worth a line in the business section.
23. **Price with the left digit.** $179 rather than $180, since the left digit changes (Thomas & Morwitz 2005; Anderson & Simester 2003 field tests) [IM]. Competitor anchors:
    - SLX $179, ULX $189, XA25 $169 (wired).
    - V4 Pro $159.99, GPX2 2c $160, Sora V3 $119.99, Pulsar X2F $149.95.
24. **Show the screen on the dongle, not the mouse.** Pulsar's eS series already puts an OLED on the underside of the mouse, showing LOD, debounce, motion sync, polling, DPI and battery [MC]. Theseus's version should live on the dongle so it adds 0 g to the mouse, and it is visible while playing.
25. **State click-latency methods on every comparison.** End-to-end with finger travel (Finalmouse: SLX 2.0 ms vs V4 Pro 7.5 ms), electrical (XBAB: 65–72 µs; TPU: 79 µs) and RTINGS are not comparable. A small "method" tag on each bar heads off criticism.
