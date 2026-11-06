# L2 PROGRESS: kagome vs true triangles, one comparison sheet for Brock

Brief (main, 2026-11-06 ~13:15): one dated PNG (~2600 px wide), kagome left, true triangles right, same scale and lighting:
(1) top shell from below, ribs as moulded, shaded 3D; (2) from above, skin translucent; (3) node close-ups ~x20, plan + section,
largest circle in each junction vs the 0.60 skin, plus a cored triangle knot (look + cost); (4) numbers table; (5) one film line.
Rules: true greys, blue only for the current pick; plain words; no invented numbers; one heavy job at a time; no repo changes.

## Status
- [x] 1. Read L1 (PROGRESS, l1geo/l1fe, results-final.json, cache, shots/final), S2 PROGRESS, b06 review, deck b06_lattice
- [x] 2. Geometry: scripts/geo.py (L1's lattice_segments; crease = S2's 1.75 deg line via env.py patch), 3D ribs, node prisms, fillets, rails
- [x] 3. Renders: scripts/render.py + rast.py (numpy z-buffer), from below (elev 62, azim 22), rib contact shadows, true greys
- [x] 4. Nodes: scripts/nodes.py (plan circle 2D EDT, junction ball 3D EDT 0.01 mm), nodedraw.py (true sections)
- [x] 5. Main's 13:5x format change (max 3 images, ~1600 px, big labels; top-down translucent view dropped). DONE 14:01:
      l2_kagome_vs_triangles_1_inside_1401.png (renders + numbers + film lines), l2_kagome_vs_triangles_2_nodes_1400.png
      (plan + section, balls, cored knot cost). Drafts never reported: drafts/. Reported to main by SubagentHandback.

## Facts gathered (with sources)
- LABELS: l1geo 'tri' (phases .5,.5,.5) = KAGOME; 'kagome' (.5,.5,0) = TRUE TRIANGLES (l1geo docstring + shots/check_tri_kagome.png).
- Final designs (out/results-final.json, cache): kagome = G-win-h0.55 (code tri, lam 0.2382, line spacing 3/lam = 12.59 mm,
  skin 0.598); triangles = H-kagome-t0.60 (code kagome, lam 0.2398 -> 12.51 mm, skin 0.596). Both 9.35 g (t solved from the
  budget at each build). Stage F planner (stageF.py, lam_for_t) solved lam so t = 0.60 at h 0.9 for each pattern.
- Crease used by L1: y = 8.56 - 0.04837 (z + 59.58) (l1geo.y_crease 'slope'; 2.77 deg). S2's 1.75 deg line NOT posted at 13:30
  (only crease_line_2deg.json). Use L1's line, say so on the sheet; re-check before finishing.
- Peaks (cache use[]): kagome skin 14.6 % (grid press, at (7.5, 34.6, 4.7) = the rear cutout's edge), ribs 12.9 %;
  triangles skin 20.7 % (side squeeze, at (16.9, 8.4, -54.3) = on the crease near the tail), ribs 13.7 %.
- L1 weight budget: V_nodefil = 0 (closing minus end losses clipped at 0) and root fillets at 0.18 (0.3 t), not 0.24/0.22.
  Same for both patterns; size of the gap to be computed (small).
- Root junction (L1 tjunction, r 0.24): largest circle 0.758 mm = 1.26 skins (RapidDirect: past ~0.75 t sink risk).
- b06 film: b06_lattice "Triangles, not hexagons" (open strips, honeycomb mice's holes); P4 caveat: b06_fibres/fillet/filletsize/
  mold model a six-arm node; the kagome crosses two ribs at a time.
- STALE elsewhere: S2 PROGRESS quotes L1 "10.7 mm apart, 6.2 mm side" and b06_arches "10.8/10.7"; L1 final is 12.6 / 7.3.

## Results (14:00)
- Junction balls (3D EDT): kagome crossing 0.88 mm (1.47 skins), triangle knot 1.22 (2.03), cored knot 0.82 (1.37), one rib 0.77
  (L1 2D: 0.758). Plan circles: 0.627 / 1.161 (brief's 0.63 / 1.16 confirmed).
- 1.75 deg crease: A_lat 7868 -> 8142 mm2 (+3.5 %); ribs +0.059 g (kagome) / +0.051 g (triangles) at L1's spacings; nodes 121 / 42.
- Triangles' spacing at 9.35 g: 12.51 mm (L1 lam 0.2398), sides 14.45 mm; same skin as kagome -> ~12.65-12.72 mm.
- L1's budget: V_nodefil = 0 and root 0.18; with 0.24/0.22 both gain ~0.045 g (same for both).
- Coring: 42 pins 0.44 x 1.80 (4.1 d; Envalior holes: d < 5 mm -> depth <= 2 d), weld line per knot (Wang 2023 via deck shbWang),
  saves 0.011 g.
## Next step if resumed
- If main wants the side walls: cutaway render (render.py inside ... 35 90 - 0.3) as a third image; L1 re-solve on the 1.75 line.
- 14:04 S2's full candidate arrived after the handback: /home/claude/work/s2/build/shell-s2-full.glb (+ .json; arch seam K3,
  nose as scanned, rim crease on the 1.75 line). Not used: the images stay on the repo's original shell-theseus-1seam.glb (geo.py
  line 302), which is what the live deck shows. To draw on it: rebuild L1's chart (l1geo) on that mesh first (the ribs sit on L1's
  chart; the crease moved up to 1.6 mm at the tail), then swap geo.py line 302's path and rerun geo.py, render.py, sheet1/2.py.
