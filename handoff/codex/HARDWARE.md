# hardware / build handoff — 2026-11-05

## Implemented in the actual source and generated assets

- Approved F30.25 plan5, not only the handoff drawing: one mirrored outline,38.06×59.06 mm; notch depth3.61 mm; side/rear notch flats13.09 mm; common35.24-degree chamfers and equal1 mm tangent setbacks.
- Wheel bay mirror-symmetric, same chamfer angle and apparent fillets;0.35 mm ENIG trim on top/bottom and plated bay walls. USB moved back1.05 mm to z49.38;0.44 mm leg-slot board web,1.605 mm shell overhang.
- Mirrored mounting-hole pairs (+/-10.10,29.50) and (+/-14.59,-2.25); obsolete locating/small holes removed.
- Sensor layoutz19.45, rear-facing MCU modulez4.80, PMIC(-10.20,19.45); all three real package/courtyard gaps1.60 mm. PMIC-to-MCU centre distance17.851 mm.
- J2 moved to(14.5,8.5),opening backward; J3(-14.5,8.5). Plugs and leads follow their relocated connectors.
- Both power switch versions actually built: A window, B waist-edge (x14.57), no window. B files in3d/pcb/variant-b; A is the deck default.
- Original dark/gold triangle artwork retained/adapted, per-triangle0.15 mm fillets; wordmark relocated clear of the moved lens; trace relief retained. PAW3970DM-T5QU is a proposed suffix/marking, not a verified production SKU.
- GT01 bottom walls0.80 mm estimated from the supplied Gateron image, not datasheet dimensions. Outside traced straight profile retained; clear cover0.45 mm. Cap remains2.1 mm across×1.5 along,0.80 proud. Python stand-in now follows the traced profile too.
- Existing wheel is already144 straight grooves/0.12 mm depth, six thin spokes; re-exported2D wheel was byte-identical.
- Sensor, lens, aperture and lens-carried dots coherently move+15.45 mm to mousez16.57. Optional plate regenerated for relocation only. No bottom-cover power aperture or side seam solution invented; former plate FE figures do not validate the relocated plate.

## Revamp adapter

`deck/revamp/05-hardware.js` exposes `RVHardware.board(cx,cy,s,{variant,t})`; s is pixels/mm. It synchronously draws the actual vector generator output in default2D, no asset fetch; selected3D A calls the actual PCB model through view3D. B stays its independently generated exact2D layout. Reproduce with3d/pcb/tools/export_review_adapter.py. Standalone adapter smoke: both variants return approved revision, zero exceptions, zero requests. Review image3d/pcb/revamp-adapter-review.png.

## Current verification and boundaries

- Real Shapely2.1.2 / mapbox-earcut used, not Claude shim.
- A GLB built6.69 MB /169,679 triangles; B6.73 MB /170,653 triangles. Bundle/esbuild and meshopt-compressed asset generation pass.
- Outline/bay symmetry error ~1e-14 mm2. No component-body plan overlaps except intentional wheel bracket over middle-click switch.
- Actual A/B top and A underside browser renders succeeded without console/page errors. GT01 side render succeeded after using supported explicit direction (the test page has no view=side alias).
- Five2D twins exported/rebuilt: PCB,GT01,shell,skates changed; wheel unchanged. Current PCB twin derives from the immediately previous cosmetic silk revision (mechanical geometry/placements current); actual GLB and revamp adapter are latest. Keep-out was corrected manually to the authored rear location. Shared extras.py should guard its legacy keep-out mirror for designRevision F30.25-plan5-approved.
- IMPORTANT: detailed routing is relocated old topology, not a complete reroute. Electrical DRC reports718 issues; not fabrication-ready. Results preserved in3d/pcb/electrical-review.txt and approved-review.json. Do not repeat historical README DRC0 as current.
- Requested shorter rear notch overlaps the old20 mm-wide battery-front plan envelope by3.720 mm2. Battery was not shifted silently; fit resolution remains open. Centre balance is still a target, not measured.

## Reproducible artifacts

- 3d/pcb/approved-review.json — exact outline, datums, component coordinates, fit/error results
- 3d/pcb/approved-board-review.png — source-generated mechanical review, A/B/underside
- 3d/pcb/review-top.png,review-bottom.png,variant-b/review-top.png — actual3D browser screenshots (latest cosmetic underside wordmark was moved after these snapshots)
- 3d/parts/gt01-review.png — actual thicker-wall side profile
- 3d/pcb/tools/review_approved.py — dimensional, body-overlap, electrical review generator
- 3d/pcb/tools/requirements.txt +3d/pnpm-lock.yaml — reproducible tool dependencies

No commits, pushes or raw scan publication from the hardware checkout.

## Separate authorized Pages task

Root assigned deploymentdebug in sibling pages-preview after the hardware work. Verified remote main70fc408e39e28c0b7641e194732fa2023105d1aa, enabled main/root Pages and requested a build. Workflow42046406936 succeeded; Pages built/errornull. https://brockliddicoat.github.io/theseus-codex-preview/ returnedHTTP200 and browser rendered onecanvas, titleTHESEUS — ZERO COMPROMISES, INTRO1/9, no page/console errors. No preview source/history mutation needed. This is the9-scene WIP commit, not automatically later hardware or deck updates. Screenshot3d/review-live-preview.png.
