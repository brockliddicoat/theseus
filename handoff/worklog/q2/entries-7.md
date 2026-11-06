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
