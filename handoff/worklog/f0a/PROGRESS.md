# F0a progress (motion kit)

## Status (update as I go)
- [x] Read common.md, f0a-brief.md, DESIGN.md, 01-core, 04-ui, 03-parts (keyPlanMM, SORA_HALF, part/XF), 08-v2d,
      20-app (S(), themes, cap hooks), build.py, tools (shoot/errs/qa), the per-chapter before→after helpers
      (clk_hl/clk_ba, shellHL/shellBA, gld_head/gld_ba, srf_hl/srf_ba, own_ba), REVAMP.md, FEEDBACK top + G1-G10,
      b01/b02 briefs, refs (sora side/top, ARYE line drawing).
- [x] deck/src/06-motion.js written (first full version; spliced from work/f0a/06-motion.src.js + ms_consts.js)
- [x] 08:01 snapshot copy (authorized) + handoff/revamp2/KIT.md written; integrator told (SendMessage main)
- RULE NOW: API frozen (add only). Every kit change: cp deck/src/06-motion.js deck/.snapshot/src/06-motion.js + dated line in KIT.md Changes.
- [x] tools/build.py `kit` target added (after comps; r3d=False). Build: python3 tools/build.py kit --own=06-motion.js,19-kit-test.js
- [x] deck/src/19-kit-test.js: element slides (kit_mouse_n/p, kit_establish, kit_agents, kit_compare, kit_shot, kit_teach, kit_ledger, kit_card_n/p)
- [x] exemplar kit_demo done (front view: establish trigL, pointer press, roll vs level, wipe under held press, top-view cause panel, verdict). CHECKPOINT1.md written.
- [x] kit_zoom test slide (close-ups) added
- [x] shots judged: r4 phone sheets, demo_final, d5 (mid-wipe). errs ok x12, qa clean settle+mid.
- [ ] report via SubagentHandback (everything else done; snapshot current; KIT.md Changes logged)

## Key facts found
- build.py: non-owned files come from deck/.snapshot/src; 06-motion.js is NOT in the snapshot yet, so builders
  using --own=<their file> get '' for the kit until the integrator snapshots it, or until they add 06-motion.js to
  --own. Must tell the integrator (and say it in KIT.md).
- 06-motion.js loads after 01-core, 03-parts, 04-ui, 07-charts, 07-sim, 08-r3d, 08-v2d, 05-data, 06-audio, 05-f27:
  can use all of them. Test pages define their own DECK + S (see 19-components-test.js).
- part()/XF: xsave/xmove/xscale keep XF.m so lw(px), SP(), mmpx() work. withCam must use them (reset XF.m when not
  nested, as part() does).
- Shell flat twin GEO2D.shell: body/body rings per axis (0: (Z,Y) side, 1: (X,Z) top, 2: (X,Y) front). Scene +X =
  user's left. +Z = nose. Body bbox X ±31.28, Y 0.65..38.12, Z -59.61..59.54. Triggers Z 4.76..59.78 (rear cutout at
  z 4.84 = KEY.seam -4.84). sideFront Z 8.93..23.48, sideRear Z -9.78..5.08, X 25..31, Y 16..26. Lens window
  X ±2.6, Z -5.98..8.22. wheelBay Z 26.8..48, Y 5.8..26.74.
- Key plan coords: x = -X (user's left on the left), y = -Z (nose up).
- F12.11: 119.3 x 62.4 x 39.9 mm (the scan is 119.2 x 62.6 x 38.1: "use the numbers only" for the 3D shell).
- Sora photo convention: side view from the user's left (side buttons visible), nose LEFT. clickMM sections have the
  front RIGHT.

## Design decisions
- Views: top (nose up, user's left on the left, = key plan), bottom (nose up, user's left on the right),
  left/side (from the side-button side, nose left), right (nose right, no side buttons), front (nose at viewer,
  user's left on the right). Outlines from SORA_HALF and the shell flat twin, scaled to 119.3 x 62.4 x 39.9,
  smoothed, baked as constants (+ live lens window from GEO2D so H1's sensor move follows).
- Style: ARYE-like line drawing: flat body fill one step off the ground, 2 px outline, 1.3 px key lines, constant
  screen width under the camera (lw()). Lit parts: soft fill + outline in hero (or C.second for a rival); the rest
  dimmed (M7).
- cam(): between keys, a zoom about the one fixed point (scale interpolated geometrically), eased E.cam.
- spring(): damped step, default f 2.4 Hz, z 0.6 (≈10 % overshoot, settles ≈0.45 s).
- pressCurve(): down (hit easing), bottom-out micro rebound, hold, spring return.
- verdict(): old value struck grey → new value counting from old in heroGrad; label + (lower|higher is better);
  net derived and never rounded up (floor of magnitude); one precision for both values (G5).
- Ledger: 8 rows (weight + 7 chapters), comp (red) → answer (blue); strip form for chapter cards.

## Integrator message (07:5x)
- AUTHORIZED: right before creating handoff/revamp2/KIT.md, copy deck/src/06-motion.js to deck/.snapshot/src/06-motion.js.
- After that: API stable (add, don't rename/change signatures). Every improvement: re-copy to the snapshot + a dated
  line in a "Changes" section at the end of KIT.md.
- Exemplar: the rear-cutout twist is right, but b02 owns the slide: keep it on the kit test page only, generic enough
  that b02 builds its own better version.

## Exemplar (decide after kit)
- Candidates: rear-cutout twist (derived 4.6 mm smile over 40 mm pair → 19.5° lean, 33 % sideways; b02's slide),
  trigger flex (ABS vs PP-C-20A, 81 % less flex), dual rails roll. Pick the one that reads in one view.

## Fixes done after the first shots (r1 → r3)
- param named `rect` shadowed global rect() (ledger/abSplit/wipeTo/demoPanel) → renamed `area`.
- focus boxes made generous (context stays in frame); line parts (rear, seam) lit as a 4 px line, no band.
- verdict: old value peels off first (identical copy), count starts after it clears (no overlapping digits); unit sizes
  interpolate with the morph; net under Theseus's value; tight units %, °, × larger; no net for × comparisons.
- scaleNote / forceArrow continuation not sentence-cased; abSplit note inside its rect; demoPanel masks the grid;
  chapterCard2 name rises from 0, part visible from frame one.

## Kit changes after release (all re-copied to .snapshot, logged in KIT.md Changes)
- 08:14 establish defaults hold 0.4 / dur 1.0; finger view 'end'; mouseSimple hide; kit_demo.
- 08:18 LEDGER click/shell answers = card titles; finger side profile; wipeTo trims QA records.
## Next
- final report (SubagentHandback) with: functions, timings, shared-file suggestions, questions for Brock.
- optional if time: mouseSimple press state for side views? (not needed by any brief yet)
- 08:20 LEDGER glide/elec/shape words from the briefs; kit_card_e, kit_zoom; KIT.md skeleton generic. Final checks: errs/qa clean on 13 kit slides; main + rec builds ok.
