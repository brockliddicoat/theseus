# Integrator notes (read after any compaction; keep working: "make sure to keep working after your compactions")

## State at 08:35 Chicago, 2026-11-04
- Every note Brock gave is in /home/claude/theseus/FEEDBACK.md with IDs and statuses: keep it updated, commit it.
- DESIGN.md is updated for the 07:20 and 07:35 notes (v4). BRIEF-V4.md (scratchpad) has the 07:35 decisions on top.
- Live link: https://claude.ai/artifact/HH8yRD9aYxCvvgcT1jUkyv, published from deck/dist/main.html (assets already
  uploaded, unchanged since 03:36). To republish:
  1. Run `bash scratchpad/livebuild.sh`. It builds the live files; any file that doesn't parse comes from the snapshot
     instead, and FALLBACK="a.js b.js" forces others.
  2. Run allcheck.js (2D, about 6 min).
  3. Publish with the Artifact tool, using url plus file_path.
  
  If r3d rebuilds vendor/r3d.js or the assets, re-pack the assets and send them in the files map (see PUBLISHING.md),
  or build with VENDOR=snap GEO=snap.
- Git: branch claude/review-notes-rework, last commit b1d102d. 3d/shell/shell-theseus-1seam.glb is excluded locally (.git/info/exclude) until r3d is final.
- Until r3d reports, publish with `VENDOR=snap GEO=snap bash livebuild.sh` (its new bundle and 1seam asset aren't uploaded). Live link v5 at 09:55: intro, clicks, Shell A, real dimensions, no 3D shell on cover or close.
  - Push is blocked with a 403. add_repo with push access was denied by the permission classifier, so don't retry.
    Brock knows.
  - Commit at checkpoints, with the attribution lines.

## Pacing (Brock F10.1): the 5-hour window runs 07:00 to 12:00, then 12:00 to 17:00
- Run `python3 scratchpad/budget.py` for the % used and the projection. It's calibrated so that the 02:00 to 05:15
  window, which hit the limit, equals 100 %.
- At 08:17: 27.8 % used.
  - Resumed agents with 650k-token contexts burn about 0.22 %/min each. Fresh agents are much cheaper.
  - My own share is about 0.1 to 0.2 %/min while active.
- **Rule:**
  - At most 2 builders at once.
  - Prefer FRESH agents with a hand-off, rather than resuming the old 450k to 560k-context ones.
  - Me: few calls, no polling, end turns while waiting.
- Hand-off kit: `scratchpad/handoff/<code>-brief.md` holds the original brief, and `<code>-last.md` holds the last
  words and tool calls. `extract.py` makes them. The fresh-agent prompt template is the Shell A prompt (see below).
- A self-scheduled pace check fires at 08:46 (send_later).

## Builders
| code | chapter | status |
|---|---|---|
| ntr | Intro + close | DONE 08:09 (report: 15+1 slides; questions sent to Brock) |
| clk | Clicks | DONE 08:15 (18 slides; questions sent to Brock) |
| r3d | 3D models (ae4a3ff537c29ada5, resumed 07:45, 673k ctx) | RUNNING |
| shl | Shell A (fresh a78c3260ffa685909) | DONE 09:04 (22 slides; meter API unchanged, returns height) |
| shb | Shell B: FRESH agent a4be6d65c38e4ae98, started 09:10 | RUNNING |
| shc | Shell C (10-d3-board.js) | waiting: fresh |
| gld | Glide | waiting: fresh |
| srf | Surface | waiting: fresh |
| elc | Electronics | waiting: fresh |
| own | Ownership + Shape | waiting: fresh |

## State at ~10:55
- Done: ntr, clk, shl, shb, r3d.
  - r3d's report has the GT01 geometry, the seam (KEY.seam -4.84, applied), the plate pipeline facts (pasted into
    handoff/plate-prompt.md), and notes for srf and elc (below).
- 10:59: that Glide agent (a252999856cccc771) was STOPPED from Brock's side by accident. Nothing ran 11:00 to
  11:43 and I didn't notice. LESSON: during idle waits, confirm each running agent's share is growing (budget.py).
- 11:45, running: fixA (a1e844218640e6667; Intro and Clicks at-a-glance, the GT01 2D redraw with r3d's geometry)
  and Glide (a0ab0bc0476844b54, restarted because Brock said "No, restart Glide").
- The live link is v7 (10:55): the new 3D bundle and twins. Upload the new assets via files when they change
  (assets/shell-theseus-1seam.glb.gz.b64.txt and .json were uploaded in v7).
  - It also has the slide-rating feature: the db capability `{db:{rules:[{path:"ratings",read:"view",write:"admin"}]},
    user:{}}`.
  - Ratings are in collection "ratings" (docs per slide id: value 1-10, note, title, n). Read them with
    ArtifactData list.
  - From now on, publish WITHOUT a capabilities param, which keeps the stored set. Passing {} would clear it.
- Notes for the later builders:
  - **srf:** srf_encoder's 3D callouts miss the new encoder. Use `v3At('wheel', ev, eb, re, f)` (r3d's helper), or the
    points at t=10: emitter (521, 644), disc (491, 663), detectors (470, 650), axle (617, 546). The IR emitter and Code
    disc leaders cross their labels.
  - **elc:** the 'Chip antenna' / 'Keep-out' callouts and "Antenna end, toward the nose" describe the old orientation.
    The module is now turned 180°, antenna to the REAR, keep-out at board z 13.75-17.45. Brock F17.1: keep the name
    AN54LM-20A and draw the long meander antenna. The elc_module qa: "No copper under the antenna" crosses its card.
  - **fixB:** `fillet` qa: "Wall, cut" crosses its card by 63 px.
  - **Lattice study assets** put the trigger cutout at z about 6.0 (1.16 mm off the new 4.84). Minor; note at
    integration.

## State at ~13:15
- DONE: fixA (Intro and Clicks at-a-glance; its helpers are clk_hl/clk_ba, ntr_hl/ntr_ba) and Glide (14 slides).
- RUNNING:
  - fixB acdc067a1d785e6ab: Shell A and B at-a-glance, plus F13 and F14.
  - plt a55a01172fd69125a: the GT01 tongue fix in 3D, then the bottom plate (2D and 3D), then the side switches with
    the glove in 3D. It has the F18.1, F18.2 and F18.7 answers by message.
- QUEUED NEXT: fixC (handoff/fixC-prompt.md): Intro flagships price back on the chart, the click target at 70 µs, the
  tensioner heat back to peak plus the bridge connecting, the Glide sensor unnamed. Then shc, srf, elc, own.
- The live link is v8 (13:15). Publish without capabilities (it keeps db+user). Ratings: none yet as of 13:15.
- Glide notes for later:
  - `ideaTags` (12-00-ideas.js) can't take {ev, by};
  - gld_head and gld_ba could become shared;
  - the 3D shell and skates scenes show 8 dots until plt adds the pills, ring and lens dots.

## State at ~15:25
- DONE: fixB (Shell at a glance) and plt (the plate v1, the GT01 tongue, the 3D side switches).
  - The container restarted ~15:03; the repo and scratchpad survived.
- RUNNING:
  - fixC a0d5efab64a7b6728: flagships price, the 70 µs target, the tensioner heat to peak plus the bridge connection,
    the Glide sensor unnamed, the 3D side-switch shot. Told to SKIP the Glide dot move.
  - shc a3e392e139ac4d830: Shell C, the board as reinforcement, and mass near the fingers.
- QUEUED NEXT: plt2 (handoff/plate2-prompt.md). Brock's F20: half-circle skates like the Viper V4 Pro's rear one, with
  cutouts for the dots, inboard on the plate; the lens dots part of the clip-on lens (G-Wolves style); a 0.6 mm skin
  with the FE rerun. It edits Glide files only after fixC is done; tell it when.
  Then srf, elc, own, and the final integration.
- The live link is v10 (15:15): the plate slides and the new bundle. Assets unchanged since v9.

## State at ~17:35
- DONE: fixC, shc, plt2.
  - The container restarted ~17:13. plt2 ended without a report.
  - Its 3D plus Shell slides were done. Its prepared Glide patch (scratchpad/plt2/tools/glide_patch.py) was applied by
    me and checked.
- The live link is v11 (17:25): everything except srf, elc and own. New assets were uploaded.
- 17:51: srf (ad7161dbbb7d444d4) and elc (a19ea3395ce5e7b1c) were killed by a container restart before writing
  anything. The container restarted again ~18:12.
- 18:15, RELAUNCHED: srf a7b6e6f2fe8d0af48 and elc a7d9f1dc08b263707. Prompts are in handoff/srf2-prompt.md and
  elc2-prompt.md, and each keeps scratchpad/<code>/PROGRESS.md.
- LESSON: restarts kill running builders. At every check, compare each builder's transcript mtime with now.
- Brock's AskUserQuestion was interrupted twice (17:5x, 18:1x); he may be away. The questions are pending in
  INTEGRATOR-NOTES 'Open for Brock'. Ask again when he's back.
- NEXT: own (Ownership + Shape, with handoff/own-brief.md), then the FINAL INTEGRATION:
  - dupscan, a full build, errs 2D+3D, qa;
  - contact sheets of every slide at 384 px, checked at a glance;
  - FEEDBACK final check;
  - HANDOFF.md, PUBLISHING.md, the patch;
  - the final publish.
- Open for Brock: the shell weight (the intro's 10.62 g against Shell A's 15.2 g study), grip height, board thickness,
  the arms squeeze slide, 70 µs at NC release only, the PAW3395 floor, and the plate. With the 0.6 mm skin a plain grid
  is 10 % stiffer in flex; ours has a 12 % lower peak.

## Queue (as slots free up; at most 2 builders at once)
- Next when a slot frees: fixB, then plt (plate plus 3D side
  switches, F17.3), shc, srf, elc, own.
1. **fixA** (handoff/fixA-prompt.md: intro and clicks) and **fixB** (handoff/fixB-prompt.md: Shell A and B). Both are
   fresh agents with an at-a-glance pass (F14.10) and the F12 to F14 fixes. They SUPERSEDE handoff/fixes-prompt.md.
   Start them when the pace allows: one now if r3d finishes, both at 12:00.
   (Old: a fresh agent with handoff/fixes-prompt.md.) Its F12 fixes are in intro densrank (XA25 shown, not ranked),
   clicks sidebuttons (the shell holds the switch), #59 removal, the GT01's 4th pin, and the cutouts notch and overlaps.
   When it reports: copy 03-parts.js to the snapshot.
2. **plt**: AFTER r3d reports. A fresh agent with handoff/plate-prompt.md, with r3d's final report pasted at the end.
   The optional bottom plate: solid outside, fine triangle lattice inside, Viper V4 Pro-size skates (F12.10).
3. **KEY.seam:** when r3d reports, move the shared key plan's straight rear seam to the Sora smile's deepest point
   (F12.9), using r3d's number.
4. After 12:00, in the new window: shc, gld, srf, elc, own. Glide must know about the Viper V4 Pro-size skates
   (plate design) and the dot skates by the sensor (F9.20).
- **STANDING F12.8:** ask Brock with AskUserQuestion, not in plain text.
- **BRIEF-V5.md** has the 09:28 and 10:17 notes and decisions for every builder. Add it to every new builder's
  reading list. Its first rule is better at a glance.

Order after shl and r3d: shb, shc, gld, srf, elc, own. Shell B and C use the meter API from Shell A, so pass on any
change Shell A reports.

## Integration TODO (as builders land)
- **Intro:** `targets` and `targets2` are still two dense tables back to back; rework them for space (F2.36).
- **Clicks:** the GT01's housing is drawn olive/khaki in 2D and 3D. Check that it doesn't read as the shape chapter's
  olive or as the "green" Brock dislikes.
- **Shared part drawings** (03-parts.js: swMM, plateMM, frontStopMM, flushMM, wheel, pads) still use material gradients.
  Decide whether to flatten them (F8.1 says "very sparingly"). Look at a slide before and after.
- **Magnetic clicks:** grep every chapter for magnetic mentions (F9.9).
- **The seam (F9.28):** check every top view.
- **Fillets (F9.27):** check every lattice drawing.
- **Peach (F9.24):** check skin everywhere.
- **Dots (F9.5):** grep for ' · ' in strings.
- **The full integration pass:**
  - dupscan, a full build, slide order;
  - errs in 2D and 3D, with READY_MS for 3D;
  - qa at settle and mid, and contact sheets;
  - geo2d rebuilt if the 3D builder didn't;
  - a commit, the patch, HANDOFF.md, PUBLISHING.md and a republish;
  - finally, check against every item in FEEDBACK.md.

## State at ~19:45
- DONE: elc (a7d9f1dc08b263707): 23 slides; dongle and syncpower removed. The live link is v12 at 19:40.
- RUNNING: srf a7b6e6f2fe8d0af48, and own a8861846ca2c2be38 (started 19:36).
- Integration items from elc:
  - keyPlanMM's "antenna" highlight and wheel position are the OLD ones; update the shared key plan to the flipped
    module (antenna to the rear).
  - 3d/pcb/pcb-layout.json still has the old keep-out, and U1 is labelled "chip antenna"; pcb.js flips it at load.
  - callout() with side 'r' draws its leader through the label when the point is to the label's right; add a guard.
  - The headline and before -> after helpers live in three chapters (clk_hl/clk_ba, gld_head/gld_ba, elc's, plus
    shellHL/shellBA); could share.
- Open for Brock: the elc questions.
  - -20A vs -P20A (the long antenna is listed on the -P20A);
  - the PMIC beside the antenna end;
  - the cell LP402535JU, 370 mAh;
  - syncpower folded into power;
  - the braid: three 32 AWG wires of 40 AWG strands.
  
  Plus the earlier ones: the shell weight 10.62 against 15.2 g, the plate against the grid, grip height, board
  thickness, the arms squeeze slide, 70 µs at NC only, and the PAW3395 floor.

## State at ~20:15
- DONE: srf (a7b6e6f2fe8d0af48), integrated: 13 slides; live link v13 (19:5x), commit 47b3dba.
- Shared fixes done: key plan (wheel opening, antenna keep-out, board, sensor, dot skates) = the 3D layout; encoderMM and
  shlEncoderMM have TTC's 5 pins (Brock's photo 6bfbfc5f); callout() guard (a forced side that points back across the
  leader flips); `anchors` callouts re-placed; bandBlock 560 (fontStr clamps anyway).
- RUNNING (resumed 20:34 after a container restart at ~20:32): own a8861846ca2c2be38 (since 19:36), plate3 aea86e8790c792502 (since 20:15, handoff/plate3-prompt.md: beat
  the grid on flex at equal weight, or stop after the FE and report; align the lens window with the board's sensor,
  which sits 1.12 mm forward of shell meta.sensor).
- Ratings collection: empty at 20:15.
- Open for Brock, new from srf: blast/coat weighings; two-tone method (etch to carbon vs Laser Imaging vs base+top);
  the grip map; 9H "on Cerakote's test panels"; (answered from his photo: TTC's optical encoder has 5 pins).
- Container root has a stray empty dir /anch (my shoot.js run with an empty $SP); the safety check refused rmdir. Harmless.

## State at ~21:02
- DONE: own (a8861846ca2c2be38) integrated, 16 slides; live link v14 (20:5x); commits b3dc6a9, 80d68fe (screwHeadMM ->
  own_headTopMM). 143 slides.
- Fixed: the anchors callouts threw before their points existed (my 17d8389 edit); guarded with `if (o.edge)`.
- RUNNING: plate3 aea86e8790c792502 (told at 20:59: stop after the FE if lens flex still loses; put the corrected
  solver into the deck anyway; report rule relaxations with numbers). reviewer ac51845685398b312 (handoff/review-prompt.md:
  report-only at-a-glance review of every slide except pltPlate, pltSim, shlsheet2; works from a copy of dist/main.html).
- NEXT: when the review lands, fix its CONFIRMED items (a fixer agent per chapter group, or me for one-liners);
  integrate plate3; ask Brock the top questions with AskUserQuestion; HANDOFF.md, PUBLISHING.md, the patch; final publish.

## State at ~21:30
- DONE: reviewer (ac51845685398b312): 23 ranked findings, saved as review/REPORT.md.
- READY TO LAUNCH at the 22:00 window reset (pace: 67 % at 21:26): fixI (handoff/fixI-prompt.md: Intro, Electronics,
  Ownership items) and fixK (handoff/fixK-prompt.md: Clicks and Shell items; its two 10-c-glide.js items only after
  plate3 is done: message it). Both read handoff/fix-common.md.
- RUNNING: plate3 aea86e8790c792502 (at 21:24 doing qa and screenshots, then its report; it ran 3D errs on pltPlate,
  so it rebuilt assets: upload them at the next publish).
- Item 13 (the budget uses the XA25's 0.93 g wheel, but the deck's magnesium wheel is 1.46 g; inserts missing) shrinks
  the derived shell-and-skates remainder: add to Brock's questions with the new figure from fixI.

## State at ~21:52
- DONE: plate3 integrated (a33747b): plate v3 beats the grid (lens 89 vs 103 um, front 327 vs 368, twist 4555 vs 10688,
  peak 12.5 vs 17.5 MPa; grid wins back skate 234 vs 292, disclosed in plt_fe's note); FE errors fixed with switches;
  sensor meta [0, 1.12]. Live link v15 with the new shell asset (files map: assets/shell-theseus-1seam.glb.gz.b64.txt and
  assets/shell-theseus-1seam.json; the host wanted a read of the old ones first). Snapshot vendor + geo2d refreshed.
- RUNNING (launched 21:51): fixI ab4d59c9f204cb9f4 and fixK a0b0b396b852070c4 (fixK may edit 10-c-glide.js now).
- The 22:01 send_later (launch the fixers) is superseded: they are launched.
- NEXT: integrate both fixers (dupscan, build, allcheck, 3D errs, contact sheets of the touched slides); a last look at
  the whole deck at 384 px; FEEDBACK; HANDOFF/PUBLISHING (v-number); the patch file (git format-patch or diff against
  the base); AskUserQuestion with the top questions; final publish.

## State at ~22:17
- Brock answered everything (F21 in FEEDBACK.md). Messages sent: fixI (P20A module; plain words "battery"; PAW3970 with
  the V4 Pro specs; inserts CF 70 % in 10-h2-own.js; size slide quote in 10-g-shape.js), fixK (plain words incl.
  10-d3-board.js; PAW3970 on sensor + 10-c2-glide.js), plate3 resumed (pltSim five charts; new pltOptions A/B/C;
  battery placement for the centre of mass; option D if the tail is free).
- Follow-ups for me: key plan battery once plate3 reports; the 3D module still prints "AN54LM-20A" and models a chip
  antenna (pcb pipeline needs trimesh; deferred to the PCB redesign Brock plans, say so); ask the grip map again after
  the final publish (F21.9).

## State at ~22:58
- Real usage windows run 17:20-22:20 and 22:20-03:20 (the limit hit at 22:19); use budget.py 2026-11-05T04:20:00Z.
- v16 published 22:3x from the agents' WIP (all 144 slides pass 2D; 3D spot checks ok).
- DONE: plate3 (pltSim five charts; pltOptions A/B/C/D; battery: centre x -0.41, y 7.46, z -22.72, 35 across x 25 along,
  CoM (0, 12.0, 1.12) plate off; needs a holder in the shell). Key plan battery moved to the tail (03-parts.js, snapshot).
- RUNNING: fixI ab4d59c9f204cb9f4 (checks), fixK a0b0b396b852070c4 (Shell, Glide, wording; told to rework the `mass`
  slide: battery in the tail at board height, not on the board).
- Then: integrate, full checks, last look, FEEDBACK, PUBLISHING (v-number), patch, final publish; ask grip map (F21.9).

## 2026-11-05 04:15 Chicago: v20 published (1793873254-4a5b), commit 305acc1; K1 and K2 launched
- K1 click mechanics (agent a725cab98205b136f), K2 board/encoder/elec (agent a7ae89543725fd4e8). Briefs: handoff/k-common.md,
  k1-prompt.md, k2-prompt.md. Progress: scratchpad/k1/PROGRESS.md, k2/PROGRESS.md. Resume a stopped one with SendMessage.
- Next pairs (briefs written: handoff/k3..k8-prompt.md): K3 click clarity (10-b-click.js, shares it with K1 by slide: can
  start beside K1), K4 glide, K5 shell strength, K6 arches/build (shares 10-d-shell.js with K5 by slide), K7 intro, K8
  surface/own. When K3 starts while K1 runs: tell K1 that notchMM, frontStopMM, flushMM are K3's.
- geo2d/build.sh takes R3D=<code> now (its own deck and raw folder), so two builders can rebuild twins at once.
- Integration per package: snapshot refresh, livebuild, allcheck (2D), errs 3D on the 19 3D slides, publish without
  capabilities, commit, FEEDBACK statuses, PUBLISHING.md.
- At the end: the word sweep (decimals, pts/points, Piaknow, Dual 8khz, cell → battery), the bundle for Brock
  (main..claude/review-notes-rework).
- 04:2x: pip and npm can't install here now (pypi.org: no DNS direct, 403 via the proxy; npm the same). shapely and
  mapbox_earcut are gone since a container restart. K2 is writing a shapely stand-in in 3d/pcb/tools/shim/ (SDF grid,
  numpy/skimage; three's earcut), checked against today's pcb.glb; fallback: the outline built in three.js.
- 04:2x: K1 told #59 (taller fulcrum) is abandoned (F12.6), and given Brock's best GT01 reference (8e779cef-image.jpg,
  F28.1): side profile first; K1 writes scratchpad/k1/GT01-PLUNGER.md with the outline for K2's board switches.
- First-frame check of all 131 slides (scratchpad/first/sheet_*.jpg): only shlNoPick opens without its header (K5).
- 07:15: K2 paused (its report: scratchpad/k2/PROGRESS.md). Brock's answers on plan 5 (FEEDBACK F30.25): USB-C back 1.05 mm
  (my call), mirror-pair holes, wheel bay chamfered + filleted, rear notch as long as the side notches, then BUILD (A and
  B). Resume K2 with exactly that at 08:22, plus srf_knurlStrip straight. K2's slides done so far (rev 1 + answers):
  srf_encoder ("Nothing lights up but the sensor", after software), elc_sheet2 hidden, cells (10440), elecsheet1, cable,
  wheel tread straight. Its slide work then goes into the revamp (F32).
- 07:10: full revamp decided (F32): new story, fewer slides, build directly, as many builders as it takes. Scheduled task
  at 08:22 starts it.
