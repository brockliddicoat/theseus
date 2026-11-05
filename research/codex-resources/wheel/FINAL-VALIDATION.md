# wheel — MAX final validation

reviewed 2026-11-05 as the MAX continuation/final reviewer for the completed wheel package. this was a bounded evidence and JSON review; the original 39-query search was not repeated.

**result: the package is suitable for integration as qualified source evidence and a proposed weighing protocol. the matched plastic-plus-rubber test group is still unresolved.** no substantive correction to `wheel-evidence.md` or `wheel-test-group.json` was needed, and both files were preserved.

checks performed:

- read the independent-review brief, both wheel deliverables and the live wheel scene in the implementation checkout, read only.
- parsed the JSON with duplicate-key rejection and checked all six report masses, nine source IDs, four comparison controls, 39 distinct recorded queries, source references and eligibility flags. all checks passed. zero reports qualify for the matched group; mean, median, range and savings percentage remain null. the uncertain A5 value remains excluded from usable quantitative leads.
- selectively reopened the primary [M3 owner report](https://www.reddit.com/r/MouseReview/comments/1c2eerg/darmoshark_m3_449g/), [Ghero Pro owner report](https://www.reddit.com/r/MouseReview/comments/1dl1rkj/incott_ghero_pro_weight_reduction_mod_5266g/), [forky OP1 listing](https://forkymods.com/products/lightweight-scroll-wheel-op1), [PMM specification](https://pmm.gg/products/magnesium-scroll-wheel-op1-8k-op1w-4k-pulse-cyber-op-for-modkit) and [G502X mod report](https://www.reddit.com/r/G502MasterRace/comments/1q0anxv/tutorial_g502x_chonkster_scroll_wheel_mod/). their text supports the recorded component reports: M3 3.2 g; Ghero Pro 3.77 g; X11 approximately 2.5 g; OP1 seller claim 1.8 g; A5 explicitly uncertain “1.5g?”; G502X 6.9 g with unresolved larger-subassembly scope; PMM maker claim 1.0 g. forky also states approximately 0.5 g for its replacement. none of these page checks establishes calibrated weighing or a shared assembly boundary.
- rechecked the live source accounting: `deck/revamp/60-surface.js:94` computes `508.5 mm³ × 1.77 g/cm³ / 1000 = 0.900045 g`. the current POM axle/bushing label is at line 87 and its explanatory copy at line 93. the magnesium-volume formula does not separately account for the depicted POM component or any rotating magnet, adhesive or finish. the package correctly treats this as an accounting gap, without claiming a measured error.
- checked that the proposed protocol fixes the rotating-assembly boundary, preserves intact rubber, distinguishes repeated readings from independent samples and forbids a target mass from entering a measured comparison.

material/construction leads not independently reopened in this final pass retain their original evidence labels. no image or scale photograph was newly inspected, no physical part was weighed and no measurement uncertainty was invented. the G502X mass must stay separate from bare rotating-wheel comparisons. the M3/Ghero/X11 reports share one author and are not independent replication.

integration remains: preserve owner-report/seller-claim/approximate labels; keep Theseus 0.9 g visibly a design target; resolve its complete rotating-assembly budget before comparison; keep F27.wheel.1 and F27.wheel.2 pending until matched, material-qualified measurements exist.

the implementation files, git index, branches and hosting were not changed. no external messaging, publication, AI images or delegated work was performed in this review.
