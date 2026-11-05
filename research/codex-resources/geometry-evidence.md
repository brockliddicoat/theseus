# geometry evidence — independent reference package

the X2F CrazyLight outline gap is closed at the **published reference path** level: editable top and side SVG paths have been recovered from the live [EloShapes X2F / X2F CrazyLight comparison](https://www.eloshapes.com/mouse/compare?p=pulsar-x2f-vs.-pulsar-x2f-crazylight). the two visible model layers share the same `outline-690` path data. the [official Pulsar listing](https://us.pulsar.gg/products/pulsar-lab-x2f-crazylight-gaming-mouse) confirms 87.5 × 61.1 × 31.6 mm nominal dimensions. both sources were verified 2026-11-05.

the acquisition used read-only rendered DOM inspection through the Chrome browser tool. it did not fetch hidden application state or trace a screenshot. the contour `d` strings were preserved exactly; only the UI's sensor marker circles and source colors were omitted. top: 1,822 characters, browser FNV-1a `97482648`; side: 801 characters, browser FNV-1a `480d4ebd`. the local generator checks those independent source fingerprints before writing an asset. this is exactness to the public path representation; the source supplies neither metrology uncertainty nor manufacturer CAD certification.

the original top viewBox is 614.646 × 875. if its units are interpreted isotropically as 0.1 mm, its width is 61.4646 mm, 0.3646 mm greater than the nominal 61.1 mm. there is no evidence establishing why the source aspect differs. the raw SVG retains it. the nominal-scale top SVG maps the viewBox to 61.1 × 87.5 mm, reducing x by about 0.5932% relative to y. the side source is 875 × 316 and maps isotropically to 87.5 × 31.6 mm. both versions and the transforms are supplied; the difference is not silently hidden.

the native SVG reference sheet and machine-readable JSON are appropriate for code-generated outline comparisons. they contain no AI image, embedded photo, raw Sora scan or Theseus teardown. use the nominal-scale outline inside the size box, label the dimensions as maker specifications, and keep this asset separate from any measured sample mass. these projections do not establish real shell volume, density, wall thickness or physical manufacturing tolerances.

| feedback requirement | delivered evidence | boundary |
|---|---|---|
| F27 `ntr_sizewt`: add X2F outline | actual published top/side paths, raw and nominal-scale SVGs, normalized coordinate JSON | reference contour, not certified shell CAD |
| F27 `ntr_density`: outline-only view | unfilled, editable contour with sensor marker omitted | no Theseus/Sora geometry was copied |
| F27 `clk_pomtune`: direct competitor tolerance comparison | bounded search record, useful primary assembly reference, measurement protocol and blank data template | actual dual-rail/POM-pad clearances remain null |
| F27 `shcArms`, F28.3: faithful board/arm forms | missing-evidence record and acquisition/trace protocol | personal photos unseen; no exact board/arm vector claimed |

for click tuning, [PMM's own PULSE assembly instructions](https://pmm.gg/pages/assembly-pulse) establish that its build can be adjusted with plunger spacers and screws. this supports a qualitative comparison about adjustable pretravel. it does not supply calibrated rail clearance, a POM identification or a measured tolerance distribution. generic POM machining tolerance pages, switch travel specifications and subjective review wording were excluded from numeric competitor evidence. eight focused queries and the inspected primary pages are recorded in `reference-geometry/mechanical-reference-gaps.json`. this was a bounded search, not an exhaustive proof that such measurements do not exist.

for the reinforcing arms, the [official G-Wolves HTS Ultra product page](https://shop.g-wolves.com/products/hts-ultra-8k-wireless-gaming-mouse-29g-usb-type-c-port) supplies external product/gallery context but no dimensioned PCB/arm model was recovered. it does not identify the mouse in Brock's missing personal photos. F28.3 names `d2ae72fe-image.png` and `80f31ed6-image.jpg`; the imported evidence audit already records them as absent. this lane has not seen either photo. the reported shipping break stays an attributed user anecdote, not a demonstrated failure mode or population failure rate. actual arm widths, lengths, board thickness, fracture location and load stay null.

reproduction and verification: `python reference-geometry/generate_geometry.py` regenerates six geometry deliverables from the preserved source; `python reference-geometry/generate_geometry.py --check` checks deterministic equality, path fingerprints, normalized command round trips and parseable SVG with no raster/script/external resources. the source page's displayed outlines were visually inspected. generated local SVG rendering has not been visually verified in a browser; no alternate route was used to work around the browser tool's local-file restriction reported in this session.

the implementation checkout was read for the assigned brief and feedback only. no files, index, branches or hosting there were changed. no outside contacts were made, and no deployment or source commit was performed.

exact package inventory:

- `reference-geometry/source-capture.json` — preserved source commands, source URLs, nominal dimensions and browser integrity fingerprints.
- `reference-geometry/generate_geometry.py` — standalone standard-library generator and verifier.
- `reference-geometry/x2f-crazylight-top.raw.svg` — unchanged source top contour and aspect.
- `reference-geometry/x2f-crazylight-side.raw.svg` — unchanged source side contour and aspect.
- `reference-geometry/x2f-crazylight-top.mm.svg` — top outline in the official 61.1 × 87.5 mm nominal box.
- `reference-geometry/x2f-crazylight-side.mm.svg` — side outline in the official 87.5 × 31.6 mm nominal box.
- `reference-geometry/x2f-crazylight.normalized.json` — normalized commands, transforms and path SHA256 values.
- `reference-geometry/x2f-crazylight-reference-sheet.svg` — neutral vector top/side inspection sheet at matching display scale.
- `reference-geometry/mechanical-reference-gaps.json` — searched sources, null actual measurements and unresolved photo identity.
- `reference-geometry/measurement-protocol.md` — reproducible acquisition, measurement and trace steps.
- `reference-geometry/measurements-template.csv` — header-only recording template; no synthetic readings.
- `reference-geometry/README.md` — integration and reproduction instructions.
- `geometry-evidence.md` — this evidence and handoff record.
