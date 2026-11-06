# b04 PROGRESS (Glide: aim that goes where you put it)

Brief: /home/claude/theseus/handoff/revamp2/b04-brief.md (+ common.md). File: deck/src/30-b04-glide.js (prefix `b04_`).
Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b04 --own=30-b04-glide.js` (add `06-motion.js`
to --own until the integrator snapshots the kit: f0a's note).

## Status (updated 09:05)
- [x] Phase A: read everything, research, storyboards (below), sag model (model/sag_final.json)
- [x] Phase B started (KIT.md exists; kit is in the snapshot, so build with `--own=30-b04-glide.js` only. NOTE: --own takes
      the bare file name; `--own=src/...` silently builds the snapshot's copy)
- [x] b04_camera DONE and checked (errs, qa MINPX=21 at settle/mid/7.6/9.2, frames 0/0.6/4.6/7.6/11.5, phone view);
      CHECKPOINT1.md written 08:55. Counts now exact thin-lens (5.0 → 4.3 −14 % at 2.8 mm, → 6.0 +20 % at 2.0 mm).
- [x] Broadcast 08:45 handled: no review file yet at /home/claude/work/review/b04.md (re-check before each slide);
      warm hexes made neutral; label sizes ≥ 22; frame one shows the mouse; temporary preview slide removed (lab slides
      only behind ?b04lab=1 from now on)
- [x] b04_sag DONE and checked 09:30 (errs, qa MINPX=21 settle/mid/2.2/3.5/5.0-5.4/7.5, frames 0/0.6/2.2/4.2/10.5,
      phone view). Layout: whole mouse to scale (s 5) with the hand's weight 4.4 N (de Leva, review RESEARCH line) +
      section at the lens (32 px/mm, movement ×4); gauge tile (Z, window, sensitivity, corner-dots memory); skates tile
      (area slider dragged by the pointer, V4 Pro-size tick) → verdict "Skate added to hold the lens 0.31 → 0.05 g −84 %".
      Data: model/sag_profiles.json embedded as B04SP. Shots: shots/sag/.
- [x] Critic R-b04-1/R-b04-2 on b04_camera answered in review/b04.md (closing caption names the causes; PMW3360 named).
- [x] b04_focus DONE 09:45 (night): lens section + ruler (PixArt 2.2–2.6 yellow, Theseus 2.3–2.5 blue) dragged by the
      pointer; the same flick (hand pushes the mouse 10 cm) lands +9/−8 % (0.4 window) vs +4/−4 % (0.2); verdict "Spread in
      where the same flick lands 17 % → 8 %"; detail kept live (65 % at 2.2, 82 % at 2.3); lift-off line in narration.
- [x] b04_camera reworked 09:50 for the integrator's note: verdict "Worst detail kept 65 % → 82 %" (0.4 vs 0.2 window);
      drag 6.2–9.1; counts no longer struck (FILM F8).
- [x] b04_skates DONE 10:05 (night): underside plate off (kit bottom view rotated, nose right), four 19.5 mm ledges grown
      out of the wall with 2 mm fillets, three slots each; wipe from one dot a corner (yellow, rear ledges red: the floor
      drags) to two (blue); the third slot added by the pointer (lighter: optional); rear corner in section (s 30) with the
      0.65 mm stack; verdict "Deepest sink, hard press 0.94 → 0.48 mm −48 %"; screws ringed. Model: model/skates_model.py.
- [x] b04_module DONE 10:15 (paper): PixArt's stack assembling (plate, lens, board, chip, top case pressing) vs Theseus's
      board + module with the lens snapping up through two slots (legs to its two dots, no plate); footprints to scale
      (399 / 183 / 74 mm²); verdict "Board under the lens 183 → 74 mm² −59 %" (against PixArt's smaller trim lens).
- [x] b04_sensor DONE 10:25 (night): "Razer first, then PixArt for everyone" timeline (Focus+ → PAW3395, Focus Pro 30K →
      PAW3950, each in 10 of 35 mice; Focus Pro 50K Gen-3 → PAW3970 suspected, dashed "about two years", Theseus's plan);
      spec bars (PixArt datasheet vs Razer's figures); verdict "Tracking speed 650 → 930 ips +43 %"; glass counter-reports.
- [x] b04_reports DONE 10:35 (paper): set down and flick, slowed 20× (twice: rival, then Theseus); 450 ms smoothing window
      on a timeline; two 1:1-pixel screens following the hand: 44 px vs 3 px behind at the peak (XBAB's 20,000 fps mode,
      1,600 cpi); verdict "Behind your hand at the peak 44 → 3 px −93 %".
- [x] b04_card DONE 10:35 (night): chapterCard2 with the seven slides and idea numbers; part = the section with the lens
      drifting 0.3 mm out of its window (red) and held at 2.40 (blue) as the answer lands.
- [x] All eight: errs ok; qa (MINPX=21) clean at settle and mid apart from shared 19-20 px chips/footer/sources; frames
      in shots/<slide>/ and shots/final/ (settle sheet: shots/final_sheet.png); phone views checked.
- [ ] Report via SubagentHandback.
- [ ] Final report via SubagentHandback (check /home/claude/work/review/b04.md and /home/claude/work/research/FILLS.md first)

## Sources found or verified this session (key: what I'll add to SRC as b04_*)
- PixArt PAW3395DM-T6QU datasheet v1.2 (15 Nov 2022), downloaded: lens 1:1; Z (lens reference plane to surface) 2.2 /
  2.4 / 2.6 mm; 650 ips, 50 g (HP); up to 26,000 cpi in 50-cpi steps; lift cut-off 1 or 2 mm; "optically acquiring
  sequential surface images (frames) and mathematically determining the direction and magnitude of movement"; lens
  LM19-LSI assembled 18.85 × 21.15 × 9.81 mm, L0AE-LSI1 10.90 × 16.80 × 9.81; 16-pin DIP; §3.5 assembly: "Place the lens
  onto the base plate"; "The optical position reference for the PCB is set by the base plate and lens. Note that the PCB
  motion due to button presses must be minimized to maintain optical alignment"; lens heat-staked over the chip; "a
  feature in the top case to press down onto the PCB"; "It is recommended to place mouse feet around the base plate
  opening to stabilize mouse tracking on the surface." Fig. 5/6: chip / PCB / lens / base plate stack.
- PMW3360 datasheet (LCSC): up to 12,000 fps; 1,296 raw values; lens 1:1; Z 2.2/2.4/2.6; lift = nominal + 2 mm (default).
- Agilent ADNS-2610 datasheet (MIT fab copy): 1,500 frames/s; 324 pixels (18 × 18); Z 2.3/2.4/2.5 "results in ±0.2 mm
  DOF"; pixel dump: "It takes at least 324 frames to complete an image as we can only read 1 pixel per frame", 0 (black)
  to 63 (white).
- Avago ADNS-3080 datasheet (dtsheet): Fig. 11 "Mean Resolution vs. Z"; Fig. 27 "Mean SQUAL vs Z"; "SQUAL is typically
  maximized when the navigation surface is at the optimum distance"; Z 2.3-2.5 "±0.2 mm DOF"; frame capture "read a
  total of 900 bytes"; up to 6,469 fps.
- Razer Focus Pro page: Focus Pro 50K Gen-3: 50,000 DPI, 1-DPI steps, 930 IPS, 90 G, 99.8% resolution accuracy, 26-step
  asymmetric cut-off, Frame Sync; "TRACKS FLAWLESSLY ON GLASS" (at least 4 mm clear glass); ships in Viper V4 Pro, Basilisk
  V4 Pro, Naga V3 Pro.
- igor'sLAB V4 Pro review p.2: the same specs, "true 8,000 Hz polling".
- prosettings.net V4 Pro review: "two large skates along with a sensor ring"; 49 g (V3 Pro 54 g); skates reshaped.
- PC Gamer (Jacob Fox, 22 May 2026): Spec0's V4 Pro on third-party dot skates "unusable on multiple glasspads"; Razer
  replaced it and will "look into this sensor issue". No cause given (don't claim lens height).
- PC Gamer X2 CrazyLight Medium review: "39 g dot skates, 41 g PTFE (+/- 1 g)" (Pulsar spec): big PTFE pads ≈ 2 g more.
- XBAB blog, qsxcv, "Modern sensors STILL have smoothing, at high DPI" (14 Jul 2026, upd. 19 Jul): smoothing = moving
  average, lag ≈ (N−1)/2 frame times, motion "delayed and distorted", quick back-and-forth "smaller"; PAW3950 (and 3955)
  16 frames for ~450 ms after every set-down (Corded Gaming, all DPIs); disabling smoothing cuts set-down to 2 frames,
  another register ~12 ms (XA25 minimum); PAW3395/3399 set-down 10-20 ms; PAW3395 Ripple Control on: 2-32 frames by DPI;
  HP-mode framerates < 8,000 Hz; V4 Pro: "The velocity trace suddenly jumps at 1500 ms", "quite repeatable", "a quite
  serious inaccuracy of this latest-generation sensor"; "all PixArt sensors are guilty of smoothing ... unless proven
  innocent".
- ZOWIE FAQ: original skates "approximately 0.5 mm thick"; "lag or tracking issues may occur if the new skates are
  thicker"; "the sensor height may change"; fix: LOD to Medium/High.
- Johnson, Hagberg, Hjelm & Rempel 2000 (Scand J Work Environ Health 26(5):398-405): mouse side (grip) force 0.35-0.43 N
  mean, button 0.43 N, dragging 0.90 N; peaks to ~2.5 N; MVC sides 79.5 N.
- Dempster (via Visual3D segment masses): hand = 0.006 of body mass (80 kg → 0.48 kg → 4.7 N).
- Research data (deck): mice.json sensors: PAW3395 in 10 of 35, PAW3950 in 10 (+1 HS), PAW3955 in 2; validation report:
  V4 Pro wireless counts 12-bit (±2,047), ≥2 (maybe 16) frames smoothing ~1.5 s after lift (TechPowerUp, seen as
  snippets; TPU refuses fetches; not re-verified); "Focus+ → PAW3395, Focus Pro 30K → PAW3950" pattern.
- 3D: dot stack glide 0.38 + tape 0.05 + PORON 0.17 + tape 0.05 (DOT_SKATE_SPEC); lens dots (0, +6.3), (0, −6.7) from the
  module centre; plan 5 moves the module from mouse z 1.12 to 16.57 (lens clip slots at ±6.0 on the board).
- Blocked: apple.com newsroom (iPhone 13 Pro 2 cm macro) refused by the fetch tool (provenance). The phone analogy goes on
  the slide without that figure. TechPowerUp and igor'sLAB p.1 refused by the sites.
- Not verified, not used: MIT class "mouse sensor camera" (the ADNS-2610 PDF sits in a student's camera folder, but the
  project is a CMOS camera).

## Honest-physics findings that change the plan (tell the integrator and Brock)
1. **The Viper V4 Pro has a sensor ring** (prosettings.net; Brock's own photo shows the white ring). The brief's rival
   "big skates far from the lens (Viper V4 style): the base sags at the lens" is not true of the V4 Pro. b04_sag uses
   "skates far from the lens" (corner dots alone, the common dot swap; PixArt says put feet round the opening) as the
   fault, and the V4 Pro's big pads as the "how big skates must be" comparison, with its ring stated.
2. **Pad sink, not base bow, is what moves the lens in a real mouse** (a stiff shell bows µm under 5 N; a soft pad sinks
   tenths of a mm). Model (model/sink.py, sag_final.py): rigid mouse on a Pasternak pad. Two lens dots cut the lens's
   drop toward the cloth by about half (the cloth under the lens is pressed down with them), for 0.05 g. Big pads
   (V4 Pro size, 1,980 mm² + ring) hold the lens better still, by brute area, at ~2 g of PTFE. So the slide's claim is
   "half the drop for 0.05 g; big pads need ~2 g", not "0 µm". The old "150 → 0 µm" was an assumed bow on rigid supports.
3. **Smoothing is a timing effect** (16 frames at < 8,000 frames/s = at least 2 ms averaged, ~1 ms lag) during ~450 ms after
   every set-down on the PAW3950/3955. The reports demonstration shows the lag in time (slow motion, labelled), not an
   exaggerated rounded path. Theseus's honest target: smoothing off, set-down at the sensor's floor (2 frames), the test
   published. "0 ms" is not claimable (XBAB couldn't get below 2 frames / 12 ms on the PAW3950).
4. **CPI changes with lens height** (ADNS-3080 Fig. 11; thin lens at 1:1: counts ∝ 2.4 / Z, ≈ 4 % per 0.1 mm, derived).
   This gives the focus slide a player-facing, sourced problem: a lens anywhere in PixArt's 0.4 mm makes your
   sensitivity land anywhere in a 17 % band; the middle 0.2 mm halves it.

## Slide plans (film order). Times in s. Every slide: header on frame 1 (G9), problem → fix → payoff (M3), verdict by ~8 s.

### 1. b04_card (glide) "Aim that goes where you put it" — replaces `glide` (7/10, no note). night. settle ~5.5
- chapterCard2({ ch: 'glide', compromise, answer, list, part }). Ledger glide: kit draft "A lens that sags out of focus"
  → propose **"A lens that drifts out of focus"** (sag is not the mechanism on most mice; drift covers sink, wear,
  swaps); answer "Aim that goes where you put it".
- Part (mini demonstration, 0.8–4.5): the lens over the drawn cloth: the lens drifts down 0.3 mm (red, the frame blurs),
  then rides back on its dots (blue, sharp). Same drawing the camera slide opens on (hand-off).
- List: Your sensor is a camera · A 0.2 mm focus window · Dots at the lens · Skates where they count · A snap-on lens ·
  The PAW3970 · Full reports, no smoothing (no dots between words on screen: a list).
- Hand-off in: b03_side ends on the side buttons; the card's compromise strip carries the film's thread.
- Answers: none (no note). FEEDBACK: F35.1 palette, G9 header first.

### 2. b04_camera "Your sensor is a camera" — replaces gld_camera (4/10), gld_corr (5/10), gld_blur (2/10). paper. settle ~11.5
Problem: every count rests on a sharp picture; out of focus (too close or too far) the match is lost and the cursor skips.
Beats:
- 0.0 header + establish (kit): the simplified mouse, side view, on the pad; the sensor lit blue.
- 0.4–1.6 push in to the sensor in section (board, castellated module, die, LED, snap-on lens) over the drawn cloth; locator.
- 1.4–2.8 the LED's 850 nm beam lights a 1 mm spot; the imaging lens maps it 1:1 onto the die (rays drawn, functional
  colour). The pointer moves the mouse: the cloth slides under the lens; the shutter fires: 36 × 36 frames pop into a strip
  at the right ("12,000 pictures a second", PMW3360). The frame is the drawn cloth sampled at the pixels (same drawing).
- 2.8–5.6 correlation: frame n and n+1; n+1 slides over n (ghosted), a "difference" meter falls to a sharp minimum at the
  true shift; the shift becomes counts (ΔX, ΔY) and a small cursor moves by them. Classroom: sliding two transparencies
  until they line up.
- 5.6–8.8 blur: the pointer drags the lens 0.3 mm too close, then 0.3 mm too far: the picture blurs (thin-lens disc blur),
  the meter's minimum flattens, "no match", the cursor stalls (red). Inset: a phone held too close to a page blurs the same.
- 8.8–10.2 back to 2.4 mm: sharp, match, cursor tracks. Payoff: "Sharp within 0.1 mm of 2.4 mm" + "12,000 a second".
- Hand-off: the last frame shows the lens, the cloth and a small focus ruler (2.3–2.5 blue) → b04_focus opens on it.
Answers: gld_camera "execution still feels lazy" → a live demonstration in four beats; "the pad looks so realistic it's
uncanny" / "not drawn like everything else" → the cloth is a flat drawn weave (two greys, crisp outlines), the frames are
that drawing sampled at 36 × 36; "could be combined ... like the next slide" → one slide with correlation and defocus.
gld_corr "cool slide" → its sliding-frames search kept as the middle beat; "should be combined" → done. gld_blur
"combined with the last 2" → the third beat. F2.03 (how it works, just a camera, blurs like a phone too close AND too far,
a blurriness visualization) → beats 1–3, both directions, phone inset. F9.14 → module and lens to the 3D board's
dimensions and the FP-3 photo; position from plan 5. F14.4 → drawn cloth.
Sources: PMW3360, ADNS-2610 (frames; pixel dump), PAW3395 (1:1, Z, 850 nm), ADNS-3080 (SQUAL max at focus).

### 3. b04_focus "A focus window of 0.2 mm, not 0.4" — replaces `focus` (not rated). night. settle ~11.5
Problem (rival): most makers design to PixArt's whole window, 2.2–2.6 mm (PAW3395, PMW3360 datasheets): a lens can land
anywhere in it, and wear, a skate swap (ZOWIE) or a soft pad move it further.
Demonstration: the same 10 cm swipe at three lens heights: three crosshairs on one strip: 2.2 mm overshoots +9 %, 2.4 lands,
2.6 falls short −8 % (counts ∝ 2.4/Z, derived; ADNS-3080 Fig. 11 "Mean Resolution vs. Z"); each with its frame (sharper in
the middle; SQUAL max at focus). shotInset (used once in the chapter): the flick that misses by the spread.
- 0.0 header + lens in section over the cloth + a vertical Z ruler with PixArt's 0.4 mm band (yellow, the comparison).
- 0.8–4.4 rival: the lens shown at 2.2 / 2.4 / 2.6; the hand swipes (pointer drives); crosshairs land +9 / 0 / −8 %.
- 4.4–7.2 Theseus: built to the middle 0.2 mm (blue band 2.3–2.5); the same swipe: +4 / 0 / −4 %; the 0.1 mm each side
  is margin left for wear and the press.
- 7.2–9.0 verdict: "Sensitivity spread 17 % → 8 %" (derived) + lift-off line: "Lift-off in 0.1 mm steps only means
  something if the lens holds 0.1 mm" (→ b10_software; PMW3360: lift = nominal height + 2 mm).
- Hand-off: "What moves the lens in use: your hand, on a soft pad" → b04_sag opens on the press.
Answers: F2.02 → both windows on the ruler; "most manufacturers only optimize for 0.4mm which can lead to issues" → the
issues shown: the count shifts with height, the picture softens, lift-off loses its meaning.

### 4. b04_sag (title TBD: "Dots at the lens, not big skates") — replaces gld_sag (5/10), dots (6/10). paper. settle ~12
Problem: skates far from the lens: press on a soft pad and the mouse sinks while the cloth under the lens stays put: the
lens comes down toward the cloth. PixArt: "place mouse feet around the base plate opening to stabilize mouse tracking".
Model (derived, F18.8 "keep the models"): rigid mouse on a Pasternak pad (4 mm foam, λ 2 mm), calibrated on Brock's
report (one dot a corner sinks until the cloth reaches the base) at a firm 10 N; the press = the hand's weight 5 N
(Dempster 0.6 %) on the hump. Numbers from sag_final.json.
- 0.0 header + side section (kit side view) on the pad, Theseus's corner dots only, lens window gauge.
- 0.6–2.8 the hand presses (finger/palm, forceArrow 5 N): dots sink, the cloth dishes round them, the lens comes down
  (drawn ×20, true-scale gauge); out of the window (red); frame inset softens; count +x %.
- 2.8–5.4 Brock's dots note: the pointer drags the end skates bigger toward V4 Pro size: the drop falls, the weight
  counter climbs to ~2 g of PTFE. "Big skates hold it by area" (+ the V4 Pro also rings its lens).
- 5.4–8.0 wipe: back to dots; two dots snap onto the lens (F20.2): the same press: the cloth under the lens goes down
  with them: the drop halves, inside the window, +0.05 g.
- 8.0–9.6 verdict: lens drop before → after (mm) and skates ~2 g → 0.23 g; PixArt's line as the authority.
- Hand-off: the dots seen from the side → b04_skates shows them from below.
Answers: gld_sag "visualization feels lazy and needs more detail" → a pad that dishes, a hand that presses, a gauge, the
frame; "could be grouped with a comparison to bigger skates and weight efficiency" → beats 2–3. dots "show how this is
targeted and more weight efficient compared to how big of skates it takes to reduce the sink that aren't placed in the
most optimal possible spots (viper v4 style)" → the pointer grows the skates until the lens holds and their weight is
shown; two dots at the lens do it for 0.05 g. F9.20 → the whole slide. F20.2 → the dots are on the clip-on lens.

### 5. b04_skates "Skates where they count" — replaces gld_under (4/10), gld_sheet (4/10). night. settle ~11
Problem: one dot a corner (the usual dot set) on a soft pad sinks until the cloth scrapes the base (Brock #10); screws under
skates make opening the mouse cost a skate set (ULX, TechPowerUp).
- 0.0 header + the underside, plate off (kit bottom view): four identical corner ledges, dots, the lens with its two dots.
- 0.6–3.2 push in to a corner: one dot under the hand's press on a soft pad: the cloth rises to the base: scrape (red).
  Classroom: a boot sinks in snow, a snowshoe doesn't: pressure = force ÷ area.
- 3.2–5.6 the ledge takes two (default): the pressure halves, the cloth clears the base; the pointer drops a third dot
  onto the ledge (room for 3, the softest pads): −67 %.
- 5.6–7.6 screws: the ULX's rear screws under its skates (a driver must peel one; the skate bends); Theseus's screw sits
  clear of every dot: the driver goes straight in.
- 7.6–9.6 the whole underside, uniform: verdict "pressure on the pad −50 %" + "0 skates lost to open it"; POM by default,
  PTFE in the box (#8); 0.65 mm stack; ten dots 0.23 g.
Geometry: each corner ledge follows the rim, inset under the wall with no gap, 20.5 mm long (= the lens's two-dot span,
19.5 mm, + margin: room for three 6.5 mm dots), concave fillets r 2 mm where it meets the wall, mirrored and identical.
Answers: gld_under "corner dot ledges the same length as the sensor skate ledge (up to 3 skates)" → 20.5 mm ledges = the
lens's span; "no gap between themselves and the shell" → the ledge grows out of the wall; "fillet where the skate pills hit
the shell" → r 2 fillets; "looks very lazy and not uniform" → four identical ledges, finished; "the right visualization is
not what i wanted at all" → the plate-on half-moons are gone (plate later, F27). gld_sheet "visualizations feel lazy" →
its three details are now animated beats (POM/PTFE, screws clear, 0.65 mm). F14.1 → ledges for the 8 dots + 2 on the lens.
Note for the integrator/H1: the 3D shell's ledges should get the same 3-dot length and fillets.

### 6. b04_module "Snap-on lens: one dot wide" — replaces gld_module (8/10). paper. settle ~10.5
Problem (PixArt's own assembly guide): the round lens (LM19-LSI, 18.85 × 21.15 mm) sits on the base plate, the board is
pressed onto it by the top case, the lens heat-staked; "PCB motion due to button presses must be minimized to maintain
optical alignment". It needs a solid base under the sensor; the PMW3360's lens weighed 0.8 g, more than the sensor
(Zaunkoenig).
- 0.0 header + the rival stack (chip, board, lens, base plate), drawn in the deck's style (PixArt Fig. 5).
- 0.6–3.2 the stack: a finger clicks the button: the top case presses, the board moves, the lens's alignment shifts (red).
- 3.2–6.2 Theseus: the castellated module (FP-3 style) on the board; the lens snaps up through two slots (spring); one dot
  wide (5.2 mm); its two dots; no base plate needed.
- 6.2–8.4 footprints to scale (round 399, trim 183, snap-on 74 mm²): verdict "−81 % lens footprint"; lens mass derived.
- Hand-off: the module from above → b04_sensor.
Answers: "i like this slide" → kept: module from above, lens from below, footprints to scale; "just your normal above
average slide" → raised: problem first (PixArt's stack and its click warning), the snap demonstrated. F9.14 → module and
lens from the 3D board and the FP-3 photo.

### 7. b04_sensor "The PAW3970" — replaces `sensor` (6/10). night. settle ~10.5
Problem: the PAW3395 (PixArt, 2022), in 10 of the 35 mice in our data (ULX, Sora V2, ...): 650 ips, 50 G, 50-cpi steps;
"can struggle on certain glass pads" (Brock #76).
Demonstration (camera callback): on glass the camera sees almost nothing (a frame of a few specks); the PAW3395 loses lock
(as players report) → the cursor skips; the PAW3970: Razer "tracks flawlessly on glass". Then the spec rows with old → new.
- Words: "The suspected sensor inside the Viper V4 Pro (Razer's FP-3 marking, Focus Pro 50K Gen-3). Theseus's plan, once
  Razer's exclusivity ends: about two years, as the Focus Pro 30K became the PAW3950."
- Verdict: "650 → 930 ips" (+43 %), rows 50 → 90 G, 26,000 → 50,000 CPI, 50 → 1 CPI steps.
Answers: "says it's the 'suspected' sensor inside the viper v4 pro" → that sentence on screen; "and that this is the plan,
AFTER exclusivity expires" → the plan line with the timeline.

### 8. b04_reports "Full 16-bit reports, no smoothing" — replaces gld_reports (3/10). paper. settle ~11
Problem: XBAB 2026: the PAW3950/3955 (12 of 35 mice in our data) average 16 frames for ~450 ms after every set-down; the
cursor runs behind the hand (≈7.5 frames) exactly when a low-sens player sets the mouse down and flicks. V4 Pro: 12-bit
wireless counts (TPU, via the validation report) and a velocity jump at ~1,500 ms (XBAB).
Demonstration: lift, set down, flick (the pointer/hand drives): slow motion (labelled ×N): the hand's path, the smoothed
crosshair trailing, the raw one on the hand; a click mid-flick lands behind with smoothing, on target raw. A timeline
strip: the 450 ms window after set-down. Then 16-bit: a fast flick's counts fill a 12-bit report (overflow at high CPI)
vs 16-bit: "every count fits".
- Verdict: "Smoothing after a set-down: 16 → 2 frames" (Theseus target: off at every CPI, set-down at the floor, test
  published) and "±2,047 → ±32,767 counts a report".
Answers: "i don't understand what is being demonstrated this slide" → one plain demonstration: set down, flick, the
smoothed cursor trails; "it's a graphic but it's not a demonstration" → the main visual is the event; "i would have to
understand it to know if the information is good or not" → every number sits on the event it describes, in plain words.
Hand-off: → b05_card (shell): the crosshair lands; nothing more after settle.

## Notes for later
- The kit's mouseSimple bottom view + msLive() read the lens and dot positions from GEO2D.shell (H1's move reaches me);
  my own drawings use b04_lensZ() = msLive lens centre when present, else plan 5's 16.57.
- Keep every number one precision per comparison (G5); "weight" not "grams" for the idea; "khz" lowercase.

## Research gaps (web-search budget used up at ~08:00; each with the query or URL that fills it and the slide it feeds)
1. Soft cloth pad sink under load (b04_sag, b04_skates). Query: "mousepad foam compression mm under load soft XSoft
   measurement" / "dot skates sink soft mousepad measured". Stand-in: the Pasternak model calibrated on Brock's own report
   (#10: one dot a corner lets the cloth reach the base on soft pads), taken at a firm 10 N; marked Derived.
2. Downward hand force on a gaming mouse (b04_sag, b04_skates, M5). Query: "downward force gaming mouse aiming newtons
   study force sensing". Stand-in: the hand's own weight, 0.6 % of body mass (Dempster) = 4.7 N for 80 kg; Johnson 2000
   gives grip and click forces only.
3. Viper V4 Pro stock skate thickness and weight (b04_sag). Query: "Razer Viper V4 Pro stock skates thickness mm weight
   grams". Stand-in: area measured off Brock's photo (1,980 mm² of pads + a 109 mm² ring) × the same 0.65 mm stack in
   PTFE = 1.9 to 2.0 g, Derived; corroborated by the X2 CrazyLight (Pulsar: 41 g PTFE pads vs 39 g dots).
4. iPhone macro minimum focus, 2 cm (b04_camera phone analogy). URL (fetch refused):
   https://www.apple.com/newsroom/2022/01/share-your-best-iphone-macro-photos-for-apples-shot-on-iphone-challenge/
   Stand-in: the analogy without a figure.
5. TechPowerUp Viper V4 Pro review, pages 2, 5, 7, 8 (b04_reports: 12-bit wireless counts, smoothing after lift-off).
   URL (site refuses fetches): https://www.techpowerup.com/review/razer-viper-v4-pro/ . Stand-in: the record in
   research/validation-report-2026-11-03.md.
6. PAW3950 / 3955 / 3970 frame rate in motion (b04_reports: smoothing lag in ms). Query: "PAW3950 frame rate fps corded
   gaming mode" / "PixArt PAW3950 frames per second". Stand-in: XBAB's bound (high-performance framerates under 8,000 Hz),
   so 16 frames is at least 2 ms and the lag at least about 1 ms.
7. ADNS-3080 Fig. 11 values, resolution vs Z (b04_focus). URL (TLS fails here):
   https://people.ece.cornell.edu/land/courses/ece4760/FinalProjects/s2009/ncr6_wjw27/ncr6_wjw27/docs/adns_3080.pdf
   Stand-in: the figure's existence (dtsheet text) plus the thin-lens slope, about 4 % per 0.1 mm, Derived.
8. PAW3970 public facts and Razer's exclusivity term (b04_sensor). Query: "PixArt PAW3970" / "Razer Focus Pro 50K
   exclusive PixArt how long". Stand-in: Brock (F21.6) and the validation report's pattern (Focus+ → PAW3395, Focus Pro
   30K → PAW3950), worded as "suspected" and "the plan".
9. PAW3395 on glass pads (b04_sensor). Query: "PAW3395 glass mousepad tracking issues". Stand-in: Brock's doc #76 ("can
   struggle on certain glass pads"); Razer's "tracks flawlessly on glass" for the Focus Pro 50K Gen-3.
10. Lens height vs resolution, real values (b04_camera, b04_focus, b04_sag: "sensitivity +6 % while pressing").
   Query: "ADNS-3080 mean resolution vs Z figure values" / "mouse sensor CPI change lens height lift-off distance
   measurement". Stand-in: thin lens at 1:1, counts ∝ 2.4 / Z, Derived.
11. Pixel pitch of PixArt gaming sensors (b04_camera: "about 1 mm of cloth"). Query: "PMW3360 pixel size µm field of
   view" / "PAW3395 pixel array size". Stand-in: 30 µm assumed (36 × 36 → 1.08 mm field).
12. Downward force while aiming, palm vs claw (b04_sag press 5 N). Query: "vertical force on computer mouse during use
   newtons palm grip". Stand-in: the hand's weight (Dempster 0.6 %), 4.7 N for 80 kg; the model is linear in the press.

## Models and conventions checked (what, where, the check, the verdict)
1. Thin-lens optics of the old gld_blur/gld_camera (10-c2-glide.js GLDO: f 1.2, v0 2.4, pixel 30 µm). Check: 1:1 at
   Z = 2.4 mm is PixArt's (PAW3395, PMW3360) so u = v = 2.4, f = 1.2 ✓. The old aperture was set so the blur is one
   pixel at ±0.1 mm, i.e. Brock's own window used as the optics' depth of field (circular: it assumes what b04_focus
   argues). Verdict: model kept, aperture recalibrated to the datasheets' "±0.2 mm DOF" (ADNS-2610, ADNS-3080).
2. Pixel pitch 30 µm (old: "a model value"). Check: no datasheet gives the pitch; 36 × 36 (PMW3360's 1,296 values) × 30 µm
   = a 1.08 mm field, in line with these sensors' ~1 mm field. Verdict: kept as an assumption; the slide says "About
   1 mm of cloth", not a precise figure.
3. Counts from the correlation (old gld_corr; my first cut). Check: (a) my first cut divided the shift by the
   magnification, which a real chip cannot know: fixed, the chip counts at its fixed scale; (b) the simulated sub-pixel
   estimate is biased about ±0.1 px (pixel locking), which turned the true −14 % at 2.8 mm into −20 %. Verdict: the
   readouts now use the exact thin-lens shift (counts ∝ 2.4 / Z: −14 % at 2.8 mm, +20 % at 2.0 mm); the drawn search
   still uses the frames' own match (within 0.1 px of it).
4. "Detail kept" (new metric, b04_camera). Check: RMS of the high-passed frame against the in-focus frame at the same pad
   spot; rises monotonically to 100 % at 2.4 mm; asymmetric (53 % at 2.8, 39 % at 2.0) because a thin lens defocuses
   faster on the near side (v = 3.0 vs 2.1 mm). Verdict: kept, named "derived" in the source line.
5. "12,000 pictures a second": PMW3360 datasheet "up to 12,000 frames" ✓; Theseus's chip is the PAW3970, so the number
   wears a PMW3360 pill and the caption says "thousands of pictures a second".
6. "850 nm" LED: PAW3395 datasheet ("16-pin molded lead-frame DIP package with 850nm" IR LED) ✓.
7. Old gld_sag "150 → 0 µm": an assumed bow of the base on rigid supports. Check: a stiff shell bows µm under 5 N; on a
   soft pad the skates sink tenths of a mm. Verdict: not reused; replaced by the pad model (sag_final.py), its numbers
   marked derived.
8. Old `dots` rival, "Viper V4 style" big skates far from the lens. Check: the V4 Pro has "two large skates along with a
   sensor ring" (prosettings.net; Brock's photo shows the ring). Verdict: not used as the fault; the V4 Pro appears as
   "how big skates must be", its ring stated.
9. Old sources (gld_* SRC keys). Check: each re-read this session before use (list above). gld_apple2cm (iPhone 2 cm)
   could not be re-read (fetch refused by the user): not used. TechPowerUp V4 Pro (12-bit counts) only via the validation
   report: marked as such in b04_tpu.
10. Old focus-zone convention (gld_zone: in focus ≤ 0.1 mm, "soft" ≤ 0.2): b04_camera turns red only past 0.1 mm (Brock's
   window); the drag goes to ±0.4 mm, so the label is never decided by the threshold at a held frame.
11. Kit drawing (mouseSimple 'right' view with skates): the lens dots render as bars under the lens. Verdict: the camera
   slide hides the kit's skates (its own section shows the lens); told the integrator in the report.
12. Conventions: before → after struck in grey with the fault in red; percentages whole; counts and mm to one decimal
   (one precision per comparison, G5); "weight" not "grams" for the idea.
13. Pad model (my own, b04_sag): checked units (foam E 0.193 MPa, k = E/4 mm, G = k·λ², λ 2 mm), equilibrium (force and
   two moments solved for the rigid body), calibration (4 corner dots sink 0.65 mm at 10 N, Brock #10's "the pad scrapes
   the bottom" on soft pads), linearity (all sinks ∝ press; the matched skate size is press-independent). Positions =
   KEY_PARTS (lens 16.57, axis 17.67, lens dots 22.87 / 9.87, corner dots from the shell). Press: de Leva 1996 4.4 N
   (review RESEARCH line) instead of Dempster's 4.7 N rounded to 5 N. Weights: one 0.65 mm stack for every skate (POM
   glide 0.38 + tape 0.10 + PORON 0.17), so the comparison is placement, not material. Verdict: kept, numbers derived.
14. Old `dots`/gld_sag "150 → 0 µm" and "0 µm lens drop": not reused (finding 7); the new claim is "holds inside the 0.2 mm
   window" (75 µm at 5 N, 66 µm at 4.4 N), never zero.
15. Skates model (b04_skates): the same pad, a hard press 10 N (FILM convention: "a hard press"), one dot mid-ledge vs
   two at the ledge ends vs three; ledges from KEY_PARTS corner pairs (centre, direction), 19.5 mm per Brock's note. Note:
   KEY_PARTS's corner pairs are 7.94 mm apart; Brock's 3-slot, lens-length ledges put the default two 13 mm apart (their
   sink 0.484 vs 0.513 mm at the KEY_PARTS spacing): flagged to H1/integrator.
