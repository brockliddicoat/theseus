# editable X2F CrazyLight reference geometry

the top and side contours were recovered directly from the live [EloShapes comparison](https://www.eloshapes.com/mouse/compare?p=pulsar-x2f-vs.-pulsar-x2f-crazylight), not traced from a raster image. both named mouse layers currently use the same `outline-690` data. [Pulsar's official listing](https://us.pulsar.gg/products/pulsar-lab-x2f-crazylight-gaming-mouse) supplies the nominal 87.5 × 61.1 × 31.6 mm dimensions. verified 2026-11-05.

use `x2f-crazylight-top.mm.svg` and `x2f-crazylight-side.mm.svg` for the nominal size comparison in `ntr_sizewt` / `ntr_density`. both use `currentColor`, an unfilled outline and editable path commands. the sensor-position dots from the reference UI were omitted. the top faces forward at the top; the side faces forward to the left. the separate reference sheet uses black, grey, white and yellow.

the `*.raw.svg` files preserve the original contour coordinates and source viewBox aspect. they are exact copies of the **published paths**, not certified manufacturer CAD. the top source viewBox is 614.646 × 875; treating its units isotropically as 0.1 mm yields a 61.4646 mm width, whereas the official nominal width is 61.1 mm. the `*.mm.svg` files reduce that top-view width by about 0.5932% to fit the official box. the side viewBox, 875 × 316, already matches 87.5 × 31.6 mm at 0.1 mm/unit. no outline uncertainty or manufacturing tolerance is known.

`x2f-crazylight.normalized.json` contains normalized SVG commands and a normalized `d` string for each view, plus the source-to-mm affine transform. to render the normalized path, scale x by the desired displayed width and y by the desired displayed height. for physical coordinates use the view's `nominal_axis_mm`. relative deltas, control points and arc radii need not individually lie in 0–1; the normalization defines the coordinate axes. this is two 2D projections and does not define a 3D surface or volume.

reproduce all six derived geometry files with Python 3.10 or later, standard library only:

```powershell
python generate_geometry.py
python generate_geometry.py --check
```

run these from this folder, or give the script's absolute path. the generator reads only its sibling `source-capture.json`, uses no network and does not access the implementation checkout. the check validates source path character counts and FNV fingerprints recorded directly in the browser, normalized-command round trips, SVG/XML structure, absence of raster/script/external-link content, and deterministic equality with the expected outputs. raw path SHA256 values are also included in the normalized JSON.

`mechanical-reference-gaps.json`, `measurement-protocol.md` and the empty measurement CSV document the unresolved actual competitor clearances and missing G-Wolves personal-photo geometry. no invented PCB/arm reference or measured competitor clearance has been substituted. the public source page itself was visually inspected; the generated local sheet has structural/coordinate validation but has not been opened in a browser for visual QA.
