# mechanics and energy · final independent validation

2026-11-05 · package 3 · MAX continuation

**the calculation package reproduces byte for byte, and its existing numerical results are unchanged.** the review corrected three evidence/model labels and added a standalone Direct Drive teaching demonstration. this is a usable reference package; it does not certify Theseus hardware, a whole-shell FEA model, a finished animation or a battery-life claim.

## delivered files

| file | use |
|---|---|
| `claims-review.md` | claim-by-claim corrections, ready-to-use wording, derivations and linked evidence |
| `calculate.py` | Python standard-library calculator with explicit inputs and 11 built-in checks |
| `mechanics-energy.json` | deterministic generated calculations, units, source registry and evidence boundaries |
| `direct-drive-demo.html` | standalone interactive axial-projection model; no libraries, images or automatic external resources |
| `verify.py` | standalone independent numeric/reproduction audit; Python standard library only |
| `verify-demo.cjs` | standalone offline JavaScript model/UI-wiring audit; Node.js standard library only |
| `FINAL-VALIDATION.md` | this review's scope, corrections, checks and remaining limits |

## corrections made in this continuation

1. **Rail power and battery-equivalent power now have separate fields.** at the assumed 1.8V emitter rail and 90% conversion, the hypothetical emitters use 0.54mW at the rail and 0.60mW from the battery. at 3.3V they use 0.99mW and 1.10mW respectively. the percentages were already calculated from battery-equivalent power, so their numbers did not change. the misleading JSON key `two_switch_supply_power_mw` became `battery_equivalent_two_emitter_power_mw`, with `two_emitter_rail_power_mw` added. these remain illustrative rail assumptions, not a Razer measurement.
2. **Maxwell's equality is limited to the isostatic question.** for a free planar pin-jointed frame, `b−2j+3=s−m`. a zero count is required for an isostatic candidate but is insufficient to show that both self-stress states `s` and internal infinitesimal mechanisms `m` vanish. redundant rigid frames can have `b>2j−3`. the earlier wording incorrectly made equality a requirement for every rigid frame. the full distinction was checked directly against [Ashby's primary paper, §4](https://eclass.aegean.gr/modules/document/file.php/511165/projects/foams_lattices.pdf), including its self-stress/mechanism generalization.
3. **The FR4 axial comparison now states its modulus proxy.** the inherited 20GPa FR4 value is a flexural modulus. using it as the scalar axial modulus produces the conditional 0.437 modulus/mass ratio to magnesium; it is not an independently measured axial-stiffness ratio. the tensile-strength/mass arithmetic remains 1.83. the [Gund sheet](https://thegundcompany.com/wp-content/uploads/2024/03/NEMA-FR4-Glass-Epoxy-Laminate-by-The-Gund-Co.pdf) and inherited metal values have the different test bases shown in the package.

the Hall wait-time statistics also now explicitly assume a persistent step and ideal periodic point sampling with uniform event phase. a transient movement or reversal can be missed entirely, so the maximum wait is not a guarantee that every scroll will be captured.

## numerical and reproduction checks

| check | result and practical meaning |
|---|---|
| incoming calculator reproduction | passed its 11 built-in checks and reproduced the incoming JSON byte for byte before edits |
| final calculator reproduction | passed the same 11 checks; fresh output in independent scratch matches the delivered JSON byte for byte |
| independent audit | 390 assertions passed: 85 numerical/reproduction assertions plus 305 exact incoming-number preservation assertions; the numeric audit did not import the calculator |
| Direct Drive | separately checked force denominators, prescribed-speed time, force/acceleration time and the positive-net-force boundary with resistance |
| optical/Hall energy | recomputed pulse charge, sleep-plus-enabled cycle length, two-sensor scaling, rail-to-battery conversion, runtime change and the 8h/16h illustrative session |
| beam examples | independently integrated the unit-load strain-energy field numerically for both orientations and all six equal-mass beams; recovered the delivered deflections/stiffnesses without copying the closed-form deflection formula |
| material comparisons | confirmed cubed mass-index/equal-mass-stiffness relationships, PP/Mg beam ratio, density/thickness/mass units and the same-capacity battery arithmetic |
| JSON integrity | finite JSON, complete round-trip, and exact preservation of each existing numerical value after the narrow field rename |

key results confirmed:

- at 20°, the same-speed local-travel saving is **6.0307379%**; the zero-resistance same-force saving is **3.0622560%**. the **6.4177772%** axial-force gain uses a different denominator.
- the illustrative two-emitter average is **0.30mA**, with its 3% test-pulse duty cycle unproven for Razer. the inherited 18% share /21% runtime implication remains unsupported.
- the independent 2mA, 50µs-enabled +1ms-sleep Hall rectangle is **95.2571429µA per sensor**. TI's **90.5µA** remains an estimated table value rather than this model's result.
- the 60mm, 10×3.3mm PP beam is **1.9998g**. the calculated deflections are **0.111305896mm** and **0.012121212mm**; the rotation gives **9.1827365× stiffness** and **3.0303030× equal-stress capacity**, with the deep-beam/shear caveat retained.
- the conditional PP/Mg stiffness ratio is **1.7343125×**, obtained by cubing the **1.2014595×** material-index ratio.
- the two maker battery examples are both nominal **350mAh at 3.7V**, about **7g** versus **9g**. their minimum capacities and package boundaries differ.

final generated JSON SHA-256:

```text
eb05b8e88fca72aa0f203ca04fa56118f4e5c07cb649ee2988e4f6bca27a3cc3
```

this hash identifies the file reproduced in the current Windows/Python environment. JSON serialization line endings and last-bit library math can differ across environments; the semantic values and declared tolerances are the portable verification target.

from this package directory, independently reproduce the delivered checks with:

```powershell
python .\verify.py
node .\verify-demo.cjs
```

`verify.py` runs the calculator's 11 built-in checks, reproduces its JSON in a temporary directory, compares the bytes and performs the 85 independent numerical/reproduction assertions. `verify-demo.cjs` performs the 107 offline JavaScript assertions. both copied deliverable scripts were run successfully from their delivered paths. the additional 305 preservation assertions compared against the saved incoming artifact during this review; that superseded artifact is retained in scratch and is not required by the delivered verifier.

## standalone Direct Drive demonstration

open `direct-drive-demo.html` in a local browser. at its default 20° and 0.350mm travel:

1. **Same path speed** uses the stated 0.100mm/ms input and shows **3.5000ms aligned /3.7246ms angled**, or **6.0307% sooner**.
2. **Between crossings** freezes the common physical clock where the aligned switch is actuated and the angled switch is not. there is no per-panel phase normalization or separately eased progress.
3. **Same applied force** starts from rest, uses the same stated axial effective mass and input force with zero resistance, and shows **3.0623% sooner**. the chosen `F/m=0.057142857mm/ms²` sets the illustration's absolute clock; it is not a measured part value.
4. angle and travel controls recompute thresholds and trajectories. play/pause/reset and scrubbing all operate on the same physical time variable. 400× slow motion is explicit. the moving cap's center crosses the dashed threshold at the computed event time.

the latest F35.1 branding uses neutral stage/type, Theseus blue for the aligned solution, and yellow for comparisons/secondary highlights, with muted red limited to the threshold. the blue/yellow values match the read-only main revamp palette; no chapter colors were restored.

**107 offline JavaScript assertions passed.** these exercised both model equations across 0°/20°/45° and 0.20/0.35/0.70mm, exact threshold travel, same-time projection, zero-angle identity, the between-crossings switch states, pause/reset, the slow-motion clock and cap/housing clearance. the page's script was executed against an inert local DOM stub without a browser or network. automatic external script/style/image dependencies are absent.

**Browser render/visual acceptance remains unverified.** the available browser tool rejected the local `file:` URL because its URL policy permits only HTTP/HTTPS, and explicitly prohibited alternate routes for the rejected action. no workaround was attempted. the offline checks establish equations and UI wiring; they do not establish final browser typography, spacing, screenshot quality or actual displayed animation timing. the standalone file is included as an editable teaching resource with that limit visible.

## scope retained

all edits stayed within this package and its scratch directory. no source, index, branches or hosting in the main implementation checkout were changed. no Claude interaction, outside contacts, AI images or delegation occurred during this continuation.

component values remain datasheet/listing examples. the inherited metals/ABS comparison inputs remain conditional, not a full material qualification. no Theseus sensor, battery or encoder topology was selected, no run-to-empty test was performed, and no inherited shell FEA was rerun. the approved “6% sooner” can be retained with legible same-travel/same-speed ideal-model assumptions; hardware or press-to-PC performance still needs a matched test.

scratch audit files, including the independent reproduction and machine-readable results, are retained in `work/mechanics/max-review/` in this reference workspace. they are not additional product claims.
