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
