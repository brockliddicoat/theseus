# shim: stand-ins for the PCB tools' missing packages

The board pipeline (`../build_pcb.py`, `../layout.py`, `../mass.py`) needs **shapely**, **mapbox_earcut**,
**HersheyFonts** and **segno**. On a machine without them (this container cannot install packages: pypi.org is refused),
`../deps.py` appends this folder to `sys.path`, and only for the packages that are missing; installed ones always win.
Nothing changes when the real packages are there.

| Stand-in | What it is |
|---|---|
| `shapely/` over `sdfgeom.py` | The shapely calls the tools make. Geometry stays vector: points, boxes, circles, polygons and the affine transforms are exact. Booleans and buffers go through a signed-distance grid: each operand's exact distance to its own boundary (point to segment, sign from the nearest feature) in a narrow band, fields combined (min, max, max(a, -b), minus r), the zero level traced back with marching squares (skimage) and simplified. Grid step `SHIM_H` (default 0.01 mm: about 0.005 mm of error at a sharp corner, far less on curves), ring tolerance `SHIM_TOL` (0.002 mm). Joins are always round (a mitre buffer comes out round); flat and square line ends are exact. |
| `mapbox_earcut.py` | The same earcut, three.js's `ShapeUtils.triangulateShape`, run by node over a pipe (`earcut_server.mjs`, three from `3d/node_modules`). |
| `HersheyFonts.py` | OpenCV 5 draws its "Hershey" font as a filled sans glyph, so the text is that glyph grown (or thinned) through its distance field to the stroke width, with round ends. Fitted to the old board: caps are 0.75 of the given height, a space is 16/21 of a cap, letters 0.11 cap tighter than OpenCV's advances ('MAIN  PCB  V1.0' at 0.5 mm: 4.83 x 0.47 mm against the real package's 4.69 x 0.46). The zero is slashed. |
| `segno.py` | OpenCV's QR encoder, decoded back before it is used. Same content, error level M; OpenCV picks version 4 where segno picked 3, so the module pattern differs (both scan). |

Checked on 2026-11-05 against the board built with the real packages (Nov 4): same DRC (0 issues), 141,233 triangles
against 141.8k, 5.51 against 5.45 MB, and the renders match except the silkscreen font's letter shapes. A build takes
about 2.5 minutes (10 s with shapely).
