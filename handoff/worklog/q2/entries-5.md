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
