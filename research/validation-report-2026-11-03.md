# Validation report (research pass, 2026-11-03)

Condensed from the deep-research report run for this deck. Evidence labels: **[IM]** independent measurement · **[DS]** datasheet/official spec · **[MC]** manufacturer claim · **[CA]** community anecdote/social media · **[DV]** derived/computed · **[PR]** proposal · **[UV]** not re-verified in this pass (keep existing source, don't upgrade its label).

## Must-fix before publishing
1. **Sensor:** the Viper V4 Pro's Focus Pro 50K Gen-3 is Razer-exclusive with no public PixArt part number. TechPowerUp: "a completely different package and a new tracking engine" [IM]. Ninjutso's AIMNINJA 2 Pro 45K (Sora V3) is a FrameSync sibling ("next-gen sensor from Pixart", "FrameSync – the next-gen MotionSync", up to 87% better glass tracking, up to 52% less power [MC]); no source says it's the same die. **On screen: "next-gen PixArt FrameSync-class sensor (proposal)", generic package, not a named part.** No general-availability date anywhere. Historical pattern (Focus+ → PAW3395, Focus Pro 30K → PAW3950) is an analogy only [CA].
2. **Kim et al., CHI 2020:** center placement is "the best compromise"; center beats front and rear by "11-14%" throughput and "20–23%" path deviation; individual calibration adds only "an added 4%" (≈0.236 bits/s) over center. Reframe idea #27 as "sensor at the user's measured optimum, defaulting near center". The old "up to 14% / 23% from customizable position" wording is contradicted.
3. **Finalmouse Starlight X has no published battery-hour rating** (Back2Gaming: Finalmouse "does not publish an hour rating"). Drop "up to 200 h at 1 kHz".
4. **Single-sided SMT still reflows once.** Corrected wording: "Single-sided assemblies go through reflow once. Double-sided boards need a second pass, during which first-side parts hang upside down and re-melt — a source of dropped parts and re-flowed joints." (yield numbers [UV])

## Hardware facts
### Ninjutso Sora V2 / V3
- Dimensions: EloShapes 119.2 × 62.0 × 37.7 mm, 39 g [DS-aggregator]; retail spec 119.2 × 59 × 37.3 mm [MC]; RTINGS 120 × 63 × 38 mm, 40.9 g, grip width 61 mm [IM]. 59 vs 62–63 mm is grip width vs max width. RTINGS: V2 and V3 have "identical symmetrical shapes".
- RTINGS: Sora V2 "feels solid" while the ULX "flexes and creaks with pressure" [IM].
- V2 internals: PAW3395, Nordic nRF52840, Omron optical D2FP-FN2 mains, USB-C front charging, TTC Gold 24-step encoder [MC-reseller/EloShapes]. 8.29 g PCB + wheel is Brock's own measurement [IM-own].
- V3 (¥599 CN launch 7 Feb 2026; $119.99): AIMNINJA 2 Pro 45K, SPDT HyperSwitch mains, PixArt PAR2862 MCU, "SnappyFire × Pixart 8K"; internal skeleton claimed +1 g for "200%" strength [MC].
- Moving from optical Omron mains to GT01 mechanical switches is a footprint change, not a drop-in swap.

### Razer Viper V4 Pro (2026)
| Item | Value | Label |
|---|---|---|
| Sensor | Focus Pro 50K Gen-3: 50,000 DPI, 930 IPS, 90 G, 1-DPI steps, Frame Sync, 26-step asymmetric cut-off | [MC] |
| Package | "completely different package and a new tracking engine"; no PAW number | [IM] TPU |
| Lift-off | high setting tracks at 1 DVD, not 2 | [IM] |
| MCU | Airoha AB1623MN; wireless counts capped at 12-bit (±2047/report); ≥2 (maybe 16) frames smoothing for 1.5 s after lift-off | [IM] |
| Battery | 306 mAh, 3.87 V, 3-pin JST; CC charge 0.169 A (≈0.55C); ~40 h at 8 kHz measured; fuel gauge IC present | [IM] |
| Claimed life | 180 h at 1 kHz / 45 h at 8 kHz | [MC] |
| Mass / size | 49 g; 127.1 × 63.9 × 39.9 mm | [MC] |
| Switches / encoder | Gen-4 optical mains; optical scroll encoder ("3.3× more reliable" [MC]; TPU "arguably the best one currently available" [IM]) | |
| Wired click latency | 79 µs at 8 kHz | [IM] |
| Price | $159.99 / €179.99 | [MC] |
Razer changed skate sizes, so V3 Pro aftermarket skates don't fit [IM].

### Gateron GT01 (representative model only)
55 ± 5 gf; travel 0.35 ± 0.10 mm; 100 million clicks; "Zero Preload and Zero Delay"; "Special Shape for Vertical Pressing" [MC, MechKeys/ZFX Shenzhen]. No public datasheet: footprint, pins, pin cover, contacts are [UV]. No shipping mouse found using it. Label the model "representative".

### Raytac nRF54LM20A modules [DS]
| Part | Antenna | GPIO | Size (mm) |
|---|---|---|---|
| AN54LM-20A | chip | 66 | 9.9 × 13.3 × 2.0 |
| AN54LM-P20A | PCB trace | 66 | 9.9 × 13.3 × 2.0 |
| AN54LM-U20A | u.FL | 66 | 9.9 × 13.6 × 2.05 |
| AN54LMQ-P20A | PCB trace | 32 | 10.5 × 14.5 × 2.0 (Coming soon, est. Q4 2026) |
| AN54LMQ-20A | chip | 32 | — |
| AN54LMQ-U20A | u.FL | 32 | 10.5 × 14.8 × 2.05 |
All list high-speed USB, 2.0 MB flash / 512 KB RAM, "Intended Certifications: FCC, IC, CE, Telec (MIC), KC, SRRC, NCC, RCM, WPC" — say "pre-certified (intended …)" until FCC IDs exist. **Use AN54LM-20A (chip antenna) in the animation.** Integrated passives and price [UV].

### nRF54LM20A [DS]
128 MHz Cortex-M33 + 128 MHz RISC-V coprocessor; 2036 KB RRAM + 512 KB RAM (no external flash needed); USB high-speed host/device; radio 3.3 mA RX / 5.0 mA TX at 0 dBm (3 V), up to +8 dBm, 4 Mbps proprietary; 1.7–3.5 V; CSP98 3.9 × 3.7 mm or QFN52 6 × 6 mm. "No 32 kHz crystal" is [UV]. SLX runs nRF54LM20 at both ends [MC].

### PMIC: nPM1300 (not nPM1304, which tops out at 100 mA) [DS]
32–800 mA charge in 2 mA steps; 3.5–4.45 V termination; JEITA + NTC; 2 × 200 mA buck, 2 × 50 mA LDO / 100 mA load switch; fuel gauge (with nRF host), watchdog, power-loss warning, hard reset, failed-boot recovery, ship & hibernate; 4.0–5.5 V input with 22 V transient OVP; USB-C 100/500/1500 mA limit; 3.1 × 2.4 mm WLCSP or 5 × 5 mm QFN; supports batteries up to 1000 mAh. Nordic: algorithmic gauge 8 µA active, 0 in sleep vs "up to 50 µA" active / 7 µA sleep for dedicated gauge ICs [MC]. Each buck needs an inductor (Isat > 350 mA).
Honest slide wording:
- Faster charging: V4 Pro charges at 0.169 A ≈ 0.55C on 306 mAh [DV]; at 1C (~300 mA) the CC phase roughly halves *if the cell is rated for 1C*. The PMIC is not the limit; the cell datasheet is.
- Heat: linear charger dissipates (V_in − V_bat) × I; 5 V, 3.7 V, 0.3 A → ≈ 0.39 W [DV]. Thermal regulation and die-temperature limits are why it's safer.
- Fewer passives: "replaces 4–6 support ICs with one, and adds JEITA, a gauge and a watchdog" — true vs discrete charger + LDO + gauge + sense resistor + reset IC + watchdog; NOT true vs a bare TP4054 + LDO.
- Cleaner RF: don't claim without a spur plot; bucks are switchers — keep inductors away from the antenna feed.

### Other
- Starlight X tech sheet [MC]: nRF54LM20 in mouse and receiver, PerfectSync, PerfectPolling, TMR-DS 40 steps × 0.01 mm, Jauch 250 mAh, 223 µs end-to-end latency, 38 g, 124.8 × 58.9 × 39.5 mm, 15 titanium screws ~0.02 g each, ceramic chip antenna repositioned "northward". No hour rating.
- Mill-Max 3305 [DS]: 1,000 cycles min, 10 mΩ max, BeCu C17200 (Cu 98.1 / Be 1.9), 30 µ" gold over nickel on the contact only; shell tin over nickel. Drop "unpatentable" (legal claim).
- PAW3955 variant conflict: generic 40,000 DPI / 850 IPS / 75 G; "Master" 50,000/850/75; "Max" 52,000/850/75; Xiaomi PAW3955XM 40,000/750/60 G [MC]. The deck's "60 G" is the XM variant — name it.
- CF-PP vs ABS: deck's own moduli 13.5 vs 2.55 GPa → 5.3× stiffer [DV]; say "≈5× stiffer (datasheet modulus)"; strength ratio [UV].

## Claim verdicts (ideas)
| # | Idea | Verdict | Note |
|---|---|---|---|
| 1 | ceiling-facing cutouts "3× more popular" | unverifiable | label [CA], show the vote |
| 2 | rotated switches / award | partly | physics plausible; GT01 designed for vertical pressing [MC]; award [UV]; "aligns plunger force with the switch axis (proposal)" |
| 5 | CF-PP ≥3× stronger/stiffer | partly | ≈5× stiffer [DV]; strength [UV] |
| 14 | Mill-Max 3305 | supported | drop "unpatentable" |
| 15 | solid shell | supported | RTINGS Sora V2 vs ULX [IM] |
| 27 | sensor forward 14%/23% | contradicted as worded | see Kim fix |
| 37 | smaller lens for LGA | partly | LGA only claimed by a secondary outlet [UV] |
| 51 | wires beat ribbons | unverifiable | DeathAdder V4 Pro uses a branching FFC |
| 68 | antenna forward | supported (precedent) | SLX ceramic chip antenna moved "northward" [MC] |
| 76 | undervolting 40% | unverifiable | Ninjutso claims 52% lower sensor power by architecture |
| 77 | nRF54LM20A | supported; crystal [UV] | "better latency" needs measurement |
| 81 | optical encoders | supported as MC | |
| 86/88 | dongle battery estimate | partly exists | V4 Pro dongle LEDs show level; nobody shows time-to-full |
| 90 | single-MCU 8K wired | exists | V4 Pro |
| 101 | Finalmouse M1.6 brass inserts | superseded | SLX uses titanium screws 15 × ~0.02 g |
| 102 | Raytac certification | supported w/ caveat | "intended"; LMQ parts Q4 2026 |
All other ideas: [UV] — keep existing citations/labels; proposals stay [PR].

## Step further over the best shipping implementation [PR]
| Feature | Best today | Limitation | One step beyond |
|---|---|---|---|
| Next-gen sensor + FrameSync | Viper V4 Pro, Sora V3 | 12-bit wireless counts; post-lift smoothing [IM] | full 16-bit reports, zero post-lift smoothing, verified on screen |
| Fuel gauge | Viper V4 Pro (gauge IC) | percentage only | PMIC gauge with state of health + time-to-full + runtime on the dongle |
| Charging | Viper V4 Pro 0.169 A | ~0.55C | 1C (cell permitting) with JEITA and die-temperature limits shown live |
| Antenna | SLX ceramic chip moved north | unquantified | module antenna at the nose, keep-out free of CF ribs, published RSSI test |
| Hot-swap | Endgame Gear OP1 8K | sockets exposed | Mill-Max 3305 + molded pin cover + keyed orientation |
| Analog click | SLX TMR-DS | hidden magnet mass | same idea on rotated GT01-class switches, actuation shown in mm |
| Structure | SLX 3-part unibody; Sora V3 skeleton | claims only | publish a deflection test (N/mm) against both |
| Encoder | Razer optical | proprietary | optical encoder + magnesium wheel + sealed wheel bay |
| Skates | Razer changed sizes | aftermarket incompatibility | publish a skate DXF on day one |

## Missing ideas
- Publish raw-count width and a smoothing test.
- Asymmetric lift-off cut-off in fine steps (Razer: 26 steps) [MC].
- Sensor-angle tuning in firmware (Sora V3 reviewer flagged it missing).
- Software virtual sensor position via dual sensors (arXiv 2608.03168: calibration "only takes about five minutes" vs "approximately an hour").
- PMIC ship mode for shelf storage, battery NTC, 22 V input OVP.
- Weighted dongle with raised antenna (SLX puck has a steel weight) [MC].
- Titanium fasteners as a mass benchmark (~0.02 g each) [MC].
- Public skate template.

## Key sources
TechPowerUp Viper V4 Pro review (pages 2, 5, 7, 8); Razer Focus Pro sensor page; Ninjutso AIMNINJA 2 Pro post (x.com/ninjutso_ninjas/status/2047135043362107783); Finalmouse Starlight X technical overview PDF; Back2Gaming SLX review; Mill-Max 3305 spec (Mouser); EloShapes Sora V2 / Viper V4 Pro; RTINGS Sora V2 vs V3, Sora V2 vs ULX Pro; Toronto Keyboard Man Sora V3 specs; Windows Central V4 Pro; Notebookcheck V4 Pro; MechKeys GT01 launch; Raytac product pages (index_id 180, 181, 182, 199, 201); Nordic nRF54LM20A page and preliminary datasheet v0.8; nPM1300 datasheet and product brief; nPM1304 product brief; mousemetric/EloShapes PAW3955 variants; Xiaomi PAW3955XM (biggo); All About Circuits nRF54LM20A.
Caveats: TechPowerUp's teardown page, RTINGS detail pages and PixArt datasheets were seen only as snippets; V4 Pro antenna type, PCB layout, sensor markings remain unverified.
