# Post-completion fixes (for polish agents; a finished builder can't be resumed)

Each item: slide, the change, why (source of the decision). A polish agent owns the finished builder's file, reads the
builder's PROGRESS.md and review file first, makes the changes, re-checks (errs, qa at settle and mid, phone), and logs
a reply under the item here.

## b11 (Ownership; builder finished 09:12, file deck/src/30-b11-own.js)
- [x] b11_repair: label the third column as a callback, e.g. "Claw sockets, as in Clicks" (integrator, on R-b11-1 / FILM F5:
      keep the full job, but the switch step reads as a reminder of b03_hotswap, not a repeat).
      > P1: Theseus's step-3 line now reads "Claw sockets, as in Clicks" (was "Claw sockets: it pulls straight out"; the
      > caption still says it pulls straight out). errs ok, qa clean settle + mid, frames 0 / 4.8 / 12.
- [x] b11_battplug: the verdict's own label says "tools and supplies" (iFixit's list), not "tools" (honest count).
      > P1: already so in the builder's last file ("Tools and supplies to change the battery", 7 → 1: iFixit's seven, the
      > iOpener, alcohol and tape among them); checked in the settle frame, no change.
- [x] b11_inserts, b11_wear: the plastic joint is the rival's way, so its board is grey (M's board-colour rule, C.comp);
      give own_jointMM a mask option (in the file) and use grey on the plastic side, black on the brass side.
      > P1: b11_jointMM (30-b11-own.js) is own_jointMM line for line with o.rival: pcbSec's rival board (grey mask, grey
      > rings) and grey pads under the head; Theseus's keeps pcbSec's black mask and gold (#d9b25a). Used on both slides
      > (rival: the 'cf' joint). In section the difference is the mask skin and the pads (H1's section convention: the cut
      > face is FR4 on both), so it reads quietly. Also b11_plugMM's rival pads grey (were gold).
- [x] b11_box: add the Pro X3 Superstrike row once research/FILLS.md has Logitech's own in-the-box list ("not listed"
      only for what Logitech doesn't list).
      > P1: added, with a caveat: Logitech publishes no X3 list (its X3 pages show an empty "In the box"; FILLS
      > INT-b11_box), so the row is ProSettings' X3 list with the cable taken from Logitech's own X2 Superstrike list (counted,
      > not dashed: never undercount a rival). Row: receiver, cable, grip tape ✓; spare skates, driver, repair steps — (the
      > POWERPLAY door's one foot is not spare skates). 3 of 6, so the verdict's "next best 3 of 6" stands. New SRC
      > b11LogiX2Box; rows 44 → 36 px to make room. Say if you'd rather hold the row until Logitech lists the X3.
- [x] b11_card, b11_repair: re-shoot after H1's clk_gt01MM change lands (they draw it mirrored with b11_flipX).
      > P1: re-shot on the snapshot's clk_gt01MM (0.70 mm walls): card 0 / 2.2 / 5.5, repair 0 / 4.8 / 12; the mirrored GT01
      > sits right on its sockets in the side cut and the claw cell. No change needed.
- [x] Shared-code notes from b11: verdict `who` labels collide when the old value is short (kit); source() sentence-case
      turns "iFixit" into "IFixit" (04-ui.js sentence()): fix both centrally (integrator).
      > P1: K's items 2 and 3, not in my files. Nothing in b11 renders "IFixit" today (no line starts with it). b11's
      > verdicts carry no `who` (the builder dropped them over the collision); when K's fix lands I'll add who pairs.
      > P1 11:5x: K's fix landed (10:30); all six b11 verdicts carry names (repair "G Pro Wireless", screws "Steel", inserts
      > "Straight into carbon-filled", battplug "Superlight", board "Viper V3 Pro", box "Next best"); qa clean settle + mid.
- [x] b11_wear (M #16): the verdict arrow 82.8 → 98.6 % joins two different tests (torque kept after re-screwing into
      plastic vs pull-out strength kept by a brass insert under repeated load). Show them as two measured results, each named,
      not as one before → after; or find a like-for-like pair (research).
      > P1: no like-for-like pair exists (FILLS b11-1). The verdict and the bars are replaced by two named results under
      > "Hold kept, two different tests (higher is better)": STRAIGHT IN, screw in plastic 82.9 % ("torque to undo it, after
      > 10 re-assemblies (the better of two screws; the other kept 43.3 % by the 5th)"), then THESEUS, brass insert 98.6 %
      > (larger, in Theseus's gradient: "pull strength, after 20 pulls to 80 % of what breaks it"). No arrow, nothing struck.
      > 82.84 now shows 82.9 (the rival's figure was rounded down, our way); the source quotes Cumbicus's own losses.
- [x] (optional, G2) b11_repair or b11_box: PC Gamer (2026-05-22): Razer first refused a reviewer's V4 Pro RMA because its
      original feet had been removed: a real-world example of most mice punishing repair (FILLS, Q1 #10).
      > P1: on b11_box, with the skate file: "The skate file (DXF) is published: cut your own, keep the warranty. Razer at
      > first refused a reviewer's V4 Pro claim over changed feet (PC Gamer, May 2026)." src ownPcgSkates.
- [x] b11_repair rival switch: pass `rival: true` to H1's pcbSec so the rival's board is grey (and check own_jointMM).
      > P1: b11_switchSoldered and b11_plugMM('top') pass rival: true (grey rings too; mask: C.comp left them gold);
      > Theseus's b11_switchClaws / plugMM('side') take pcbSec's default black and gold. own_jointMM: see above.

## b09 (Electronics I; builder finished ~09:15, file deck/src/30-b09-signal.js)
- [x] b09_radio: re-shoot after H1's geo2d regeneration (pcb twin = plan 5 A); b09's hide2d filter hides the twin's U1, U3
      and LENS so only its own module and sensor show: confirm, and confirm the 11.9 → 27.6 mm figures still hold.
      > P1: re-shot on the 10:20 pcb.json; the filter still hides U1, U3 and LENS (only the module and sensor show). The
      > 11.9 → 27.6 mm figures do NOT hold as a Taoglas comparison: they were axle-to-antenna distances, not clearance. On
      > the integrator's 10:1x decision the verdict is now clearance to the nearest metal, 4.0 → 17.2 mm (4.3×; plan 5's
      > nearest is the wheel rim, battery 19.5 mm with H2's 10:20 place), both metals drawn. FEEDBACK F40.4 needs updating.
- [x] b09_chip (and any whole rival mouse): draw rivals with the kit's neutral rival outline when K lands `mouseRival`
      (FILM F9; b09's question 6, decided: one neutral rival outline across the film).
      > P1: b09_chip's Scyrox V8 (scaled to its own 118 × 63 mm, RDATA.mice) and b09_second's "most mice" row use
      > mouseRival (show board); plug and lanes start at the rival's nose. b10_lights and b10_cable too (below).
- [x] b09_card: re-shoot for the flagship line ("Like the XA25: wired only") and check the layout; the three b10 topics
      listed (pmic, board, cable) are fine as listed.
      > P1: re-shot with b01's file in the build (B01_TRADES present): the line lays out clean, qa clean at 2.2 and 5.5 s.
- [x] FEEDBACK F40.4: updated to 11.9 → 27.6 mm, 2.3× (integrator, 09:40).
- [x] b09_radio (Q2, FILLS): Taoglas recommends 20 mm between a chip antenna and metal: the first layout's 11.9 mm sits
      inside it, plan 5's 27.6 mm clears it. Show the 20 mm line on the distance readout (a sourced threshold, G2).
      > P1: done as clearance (integrator's correction): a 0 to 25 mm gauge under the readout marks Taoglas's 4 mm minimum
      > and 20 mm best-efficiency band (APN-13-8-001.A, new SRC b09Taoglas); the caption says plainly plan 5 is still short
      > of 20 mm. Options to clear 20 mm sent to the integrator (opts/b09_radio_clearance_options.png): a question for Brock.
- [x] Decided (no change needed): Second Shot numbers stay as carried from Brock's Kunai guide; Theseus 50 h at 8 khz stays
      (derived, labelled); wired target 0.13 ms stays, labelled a target; J2/J3 near the antenna go to H1 to check against
      the AN54LM-P20A keep-out when Q1 finds the datasheet.
      > P1: checked, no change: b09_life's source says "derived" and its chart/verdict say "Theseus, target"; b09_chip says
      > "PLUGGED IN, TARGET". J2/J3 (about 6 to 7 mm from the antenna) are not counted in b09_radio's clearance (signal pins,
      > not a large metal mass); left to H1's keep-out check.

## b10 (Electronics II; builder finished ~09:20, file deck/src/30-b10-power.js)
- [x] BROADCAST-0945 decision 1: the V4 Pro's optical switches take 13.6 % (0.116 mA a switch, from Logitech's own GPX2
      hours), not 17.6 %; recompute b10_lights' share (switches + optical wheel) and its verdict (+30 % becomes about +23 %),
      reading B03's constants where they exist; check the G703 figures are 32 h off / 24 h RGB (original) as Q1 found.
      > P1: done. b10_lights reads B03.optMA / v4MA / mechUA / omronMA when B03 exists (same derivation as fallback): rows
      > 6.8 % a switch, wheel 5.8 %, verdict 19.5 → 0.6 %, "+23 % hours" (23.49 %, Theseus's own 9 µA counted), caption
      > "about a fifth", source cites Logitech's 96 / 104 h (new SRC b10Gpx2Hours) with Omron's 0.15 mA as the upper one.
      > G703 already 32 h / 24 h (SRC b10G703). errs ok, qa clean settle + mid.
- [x] The Viper V4 Pro at 8 khz is Razer's 45 h (claim; like-for-like with Theseus's derivation; BROADCAST-0930), not
      TechPowerUp's 40 h: change the one constant; b10_charge's figures become 4.1 → 8.7 h (b10's own arithmetic); TPU's 40 h
      may stay as corroboration in the source line.
      > P1: done (B10.w8 = 1.184 Wh / 45 h). True values 4.14 → 8.67 h; shown 4.2 → 8.6 h, each rounded against Theseus
      > (b10's 4.1 → 8.7 rounded both our way); net 2.0×. TPU's ~40 h kept in the source line. b10_pmic's hours axis follows.
- [x] b10_lights, b10_cable: rivals drawn with the kit's neutral rival outline when K lands `mouseRival` (FILM F9).
      > P1: b10_lights cross-fades rivalFit → mouseFit; b10_cable draws the rival with mouseRival and measures the rival's
      > own outline (b10_geo: plug at 60 mm, 7.8 mm up, front skate edge 51.3 mm), so its lift is 1.62 mm (verdict 1.6 → 0).
- [x] b10_cable: use the stock cable diameters when research/FILLS.md has them (now a 3 mm illustration).
      > P1: WHY NOT: FILLS b10-1 found none published (TechPowerUp, makers, PCGamesN give lengths only). The 3 mm stays an
      > illustration; the source line now says "no maker or reviewer publishes a diameter" (was "unmeasured").
- [x] FILM F18/F19: b10_lights' verdict stays the film's derived +30 % (switches and wheel); if it quotes Razer staff's
      "almost half", only as their attributed remark.
      > P1: the verdict is the film's derived figure, now +23 % (BROADCAST-0945 supersedes +30 %). "Almost half" is not on
      > screen; the answers row names it as Razer staff's remark only.
- [x] Decided (no change): the wheel sensor stays an always-on TMR at about 3 µA; the conformal coat stays 50 µm both faces.
      > P1: checked, no change (b10_lights: TMR 1.5 µA an axis; b10_sealed: 50 µm both faces, about 0.2 g).

## b11 (addition)
- [x] b11_card: add `flight: { view: 'left', box: [1020, 230, 800, 440], pad: 0.05 }` to its S({...}) so F0c's chapter
      flight lands exactly on the card's mouse (it draws the left outline by hand today, so the flight can only cross-fade).
      > P1: added (checked: msBox('left') is msView('left').box, and the box is chapterCard2's part box less b11_cardPart's
      > margins at pad 0.05, so the flight's camera equals the card's). errs ok.

## b02 (Clicks I; builder finished ~10:00, file deck/src/30-b02-clicks.js)
- [x] b02_wedge: move it to right after b07_tolerance (Brock's own notes (b) and (c) ask for it there: every part removed is
      a tolerance not stacked); set its chapter to the one b07_tolerance is in, re-word its first beat as the callback from
      the tolerance slide, and fix the hand-offs either side (the clicks chapter now goes b02_direct → b02_tensioner).
      > P2 10:5x: b02_wedge is `ch: 'shell', after: 'b07_tolerance'` (verified in a b02+b07 build: b07_tolerance → b02_wedge → b07_poron; the clicks chapter goes b02_flush → b02_direct → b02_tensioner). First caption is the callback: "Every part you remove is one less tolerance in the stack. To angle its switches, the OP1 8K puts each on its own board." Its last ("one board, assembled in one pass") hands to b07_poron's "Where a shell post meets the board"; b02_direct's "the crown of its spring" leads into b02_tensioner. The Clicks card's list item reads "Direct Drive Actuation" (was "Direct Drive, one flat board"). errs ok; qa clean settle + mid. Themes: night → paper → paper in the shell chapter, night → night in clicks (same-ground dissolves; left as built).
- [x] (review, P2 after the restart) R2-b02-1 (the film's last must) and R2-b02-2..8, R3-b02-1, KIT's ' %' and card notes.
      > P2 (12:08): b02_tensioner and b02_stiff draw their subject from t = 0; tensioner: two-strength key and margin (207 MPa bent,
      > 20.1×, feUse), one number on both rows while the press is the same, the GT01's 41.3 gf added once, "The felt click (lower
      > is better)"; stiff: "a hard click" only at 2 N, the payoff says 9 µm not 45, rows re-spaced off the foot line; grooves:
      > signed verdict −22.7 % → 15.4 %; rails: Theseus's 0.0435 mm shown 0.05 (was 0.04, rounded our way), foot line off the mouse;
      > pom: frame one named and located, chained to the rails' gain, the misattributed "friction 0.20" removed; card: nine items,
      > both halves; wedge: one 0. R3-b02-1 (red on the bridge) kept by F18.6 and put to Brock. Replies in review/b02.md.
- [x] Decided, no change: trigger cutouts ceiling-facing (Brock's doc, "flat base 1"); the #48 wall level with the pressed
      button; Direct Drive "6 % sooner"; dual rails one behind the other; POM pads fitted per trigger (F44.3); the cutouts
      headline is the click force spread (FILM F3).
      > P2: checked on the built slides, all as decided; nothing changed.

## b03 (Clicks II; builder finished ~10:00, file deck/src/30-b03-switch.js)
- [x] b03_side and the rail (F44.1, Brock: "show all 3, it's hard to visualize these things with text, that is the point of
      this presentation"): show all three side-rail designs as a demonstration: a guide at least 14 mm long, two posts (one
      at each end of the button), and a 5 mm guide in greased POM; for each, the same off-centre thumb press at the tip, the
      post tilting in its guide (drawn larger than life, said so), the friction at the guide's two contact points, and the
      force the click then needs at the tip (×1.2, about ×1.0 for two posts if the model says so, ×1.85 dry / the greased
      figure once research has POM-on-POM μ with grease). Either inside b03_side after the rail lands, or as its own slide
      right after it (your call; keep b03_side's verdict). Remove "friction aside" once friction is shown.
      > P2 10:3x: NEW slide b03_rail right after b03_side: one row of four designs under the same tip press (14 mm guide, two loose posts, 5 mm guide dry then greased, and the tied pair the model needs for ×1.0), tilt drawn 5× (said), contacts, friction and the counted force; μ from Q3 (POM on POM dry 0.35 to 0.40: 74-78 / 195-306 / 195-306 → 58-60 / 56-59 gf). Two loose posts tilt together, so they don't reach ×1.0 on their own. b03_side keeps "friction aside" (integrator) and flags its ~2 mm guide as a placeholder. Options sent to the integrator.
      > P2 11:0x, F48.1 (Brock: "Tied posts (wire)"): b03_side redrawn as the tied pair (two posts in 5 mm POM-padded guides, the stabiliser wire under them with its two pivot clips); readouts 59 / 55 / 59 gf (the wire's pivots dry, its size assumed, said in the foot line); verdict 125 → 4 gf, "friction aside" and the placeholder gone; b03_rail keeps all four, the tied column "Theseus: a wire ties them". errs ok, qa clean settle + mid, phone read.
- [x] b03_debounce (or b03_timing): one line that a safe mode counting at the far contact (NO) is offered for players who'd
      rather (integrator's decision on b03's question 7: a slam or a drop can trip the near contact).
      > P2 10:4x: b03_debounce's Click mode panel gains "Double throw, safe: counted when the pole lands on NO, 1.4 ms later: a drop or a slam can't click".
- [x] (review, P2 after the restart) H3's 0.6 mm board (must), R2-b03-1..8, R3-b03-1/-2, FILM F36.
      > P2 (12:08): Theseus's board is BOARD_T in b03_switch / spdt / timing and b03_clawMM (B03_SW.yB = −BOARD_TOP); debounce: the
      > drag click drawn (a finger dragged along a button, the switch flashing at each NO closing), "Wait to count a click",
      > "Fnatic's advice" → "Theseus default", neutral doubles; binning: binned against binned, Endgame Gear 5.0 → 3.0 gf; spdt:
      > "Clicks from one press" only; timing: "When the click counts, from the switch closing" 0.0 → −1.4 ms, the 70 µs target
      > (XA25 72) under it; rail: the greased guide in ink; b03_rail plays before b03_side (F36). Replies in review/b03.md.
- [x] Decided, no change: bin ±1.5 gf; debounce range 0–20 ms; the title "Negative latency" (Brock's own idea #79: "Implementing
      negative latency via SPDT"); +15 % only, Razer staff's remark attributed; "0 side boards, held by the shell" framing;
      "29.31 g with four full-size SPDT switches" is now true (F44.2: the side switches come out of the shell's allowance).
      > P2: checked on the built slides, all as decided; nothing changed.

## b08 (Surface; builder finished ~10:00, file deck/src/30-b08-surface.js)
- [x] b08_wheel (F44.4, "research more"): replace the two "to weigh" slots with stock wheels' weights found by research
      (research/FILLS.md, Q3); if fewer than two more are found, drop the empty slots rather than show placeholders.
      > P2 10:5x: per Brock F47.5 ("Show the two found"): the "to weigh" slots and the placeholder stamp are gone; the row shows Endgame Gear OP1 1.8 g and Razer Viper V2 Pro 1.5 g, said as weighed by sellers of lighter wheels (Forky Mods; Zeromouse, whose kit reuses the V2 Pro's wheel); the scale weighs the lighter stock wheel (V2 Pro 1.50 g), then PMM 1.00 g, then Theseus 0.90 g; verdict 1.5 → 0.9 g (−40 %), against the lighter stock wheel so nothing rounds our way. errs ok, qa clean settle + mid.
- [x] (review, P2 after the restart) R3-b08-1: b08_gripmap struck Theseus's own one-way ridges.
      > P2 (12:08): two plain stats, "Least squeeze to lift, per side (lower is better)": 0.327 N ridges one way, 0.285 N the map,
      > 12 % less (three decimals: the old 0.33 → 0.28 rounded both ends our way). The predecessor's b08 R2 fixes (uv, tape,
      > twotone, wheel) re-checked after the restart: errs ok on all nine, qa settle + mid clean, frames shots/b8v/; R3 confirmed
      > them in frames at 11:58.
- [x] Decided, no change: film 0.37–0.43 g derived; the grip map as drawn (labelled proposed); two-tone a colourway option;
      RadTech's 51 µm film labelled; PMM named as in his doc; Zhang's light-touch rows; LEDGER's surface words kept.
      > P2: checked, unchanged. Also done from review/b08.md (R2): b08_uv (chemicals on the panel, Huntsman's two clear coats in the chamber, the payoff by ~8 s, "ULX Pro: none"), b08_tape (frame-one names + a side-view locator), b08_twotone (the scuff as a mechanism, no claim that Prophecy chips; verdict at the kit size), b08_wheel (stock average 1.65 → 0.90 g, PMM's count settled by the 40 % frame, the lattice callback).

## b01 (Intro and close; builder finished ~10:10, file deck/src/30-b01-intro.js)
- [x] Keep B01_TRADES' six ids stable (ledgerFlag and the close read them).
      > P3: kept: ids, figs and order unchanged (only the drawings changed: each icon now passes its trade's dims to mouseRival).
- [x] Decided, no change: X2F at Pulsar's 29 g ± 2; press-to-PC target under 2.0 ms (labelled a target); density rank with the
      HTS Plus Pro 8K ahead, marked unweighed; makers' weights to 0.1 g (Brock's one-precision rule, G5); the honest price
      line. Act on R2's findings as they land in review/b01.md.
      > P3: all kept except the press-to-PC target: R2-b01-2 (must) showed "under 2.0" contradicts b03's snap physics; the
      > integrator approved (c), now "Under 4.2 ms, derived" (5.7 less B03.flightMs, the assumption and Direct Drive said in the
      > foot line), against mechanical switches with the magnetic Starlight X as a labelled tick. R2's findings acted on: the
      > cover's targets, the counter 8 → 0 on cover and close, targets frame one, budget's 2.8 g handed to Shell, rank's ruler;
      > K: mouseRival for every rival, verdict maxW. Replies in review/b01.md.

## b04 (Glide; builder finished ~10:10, file deck/src/30-b04-glide.js)
- [ ] The corner ledges: b04_skates draws Brock's spec (19.5 mm ledges, three slots, default dots at the ends 13 mm apart);
      S1 and H2 are bringing the 3D shell and KEY_PARTS to the same spec: when KEY_PARTS changes, switch b04's drawings to
      read it (one source) and re-check b04_sag's and b04_skates' numbers.
      > P3 (10:55): still waiting: KEY_PARTS.skates holds the 7.94 mm corner pairs (S1/H2 not landed). b04's ledges already read
      > the corner pairs' centres and directions from KEY_PARTS (b04_ledges); the dots' places on them and the sinks (B04SK, from
      > work/b04/model/skates_model.py) are Brock's spec. When KEY_PARTS changes I re-run the model at the new places.
      > P3 (11:43, resumed): still waiting: KEY_PARTS.skates unchanged in the 11:03 snapshot (eight corner points); the ledges are
      > S2's job 2 (not started at 11:09, s2/PROGRESS.md). Separately done: H3's 0.6 mm board in b04's lens section (review/b04.md).
      > P5 (14:0x): still waiting: KEY_PARTS.skates still holds the eight corner points (S2 step 2/3 open at 13:4x). When it
      > lands: re-run work/b04/model sink.py (CORN), sag_final.py, skates_model.py at the new places, update B04SK / B04SP.
- [x] Decided, no change: 4.4 N resting hand on b04_sag; PixArt's trim lens as the module's rival; "Theseus's firmware turns it
      off" as a plan with the test published; "The PAW3970: the plan". Act on R2's findings in review/b04.md.
      > P3: all kept. R2-b04-1..5 acted on (sag press from frame one; skates labelled in place + why 10 N; module: PixArt's
      > warning named + payoff said, the flex not animated, WHY NOT in the review; sensor "finer is better"; reports' peaks held),
      > R2 confirmed -2, -4, -5. Also: K's "%" spacing; five cut-off captions fixed across b01 and b04.

## b05 (Shell I; builder finished ~10:10, file deck/src/30-b05-shell.js)
- [x] 30-b05-shell.js:522 still calls 2 N "a firm press": use the hard-press convention (BROADCAST-0945 §3; 2 N is "about
      the hardest grip measured at a desk, Won 2009", 10 N "a hard press").
      > P4: already fixed in the builder's final file (no "firm" left in b05/b06/b07; 2 N and 10 N worded as decided).
- [x] b05_cubed is the film's one full ruler demonstration (F45): check its wording against Codex's ("Shape buys more than
      thinning." / "On edge. Same weight.") and L1's callback; keep the numbers L1 was given (10 × 3.3 mm, 60 mm, 2.00 g,
      10 N, 111 → 12 µm, 9.1×).
      > P4: checked, kept: Codex's lines are its caption and label; numbers verified (1.9998 g, 111.3 / 12.1 µm, 9.18 → 9.1×).
      > Changed only the ULX line (R2-b05-4) and the verdict's owners; L1's callback numbers are untouched.
- [x] Decided, no change: b05_fallacy's light mouse is the Sora V2 (the ULX's build is disputed); stiffness on fallacy and
      nopick; sized triangles as the further step; the ULX's two verdicts on b05_cubed as the symptom of scatter; one
      pull-test basis on b05_specific, labelled; hotspot and margin pressed to 182 N, labelled as a strength test.

## b06 (Shell II; builder finished ~10:10, file deck/src/30-b06-lattice.js)
- [x] L1's LATTICE STUDY (review/b06.md when it lands): put its rib and arch-beam sizes into B06_STRIP / the arch models (one
      place each, as b06 set them up) and re-run what depends on them; quote the numbers where the slides state sizes.
      > P4 (12:3x): applied as wording, WHY NOT the strip: L1's study says B06_STRIP's 1.0 mm is the 2D teaching strip's, not the
      > shell's rib (0.36 × 1.80 mm), so the strip and its chain stay; every "Theseus" size in b06 now quotes the study (0.36 mm
      > ribs, 0.22 mm node fillets, 10.7 mm apart, kagome) or names the proportion (60 % of the rib). SHB_A is shared code (not
      > mine). F42 applied too (no 0.89 mm floor). review/b06.md 12:3x.
      > P4 (11:1x): not landed yet (L1 at its stage A). Ready for it: B06_STRIP (ribs 2.0 × 1.0 mm, 12 mm cells), SHB_A (the arch),
      > FILLET are the one place each; b05's four strip slides and their answers read B06_STRIP live (b05_live).
- [x] Decided, no change: both the strip's 8.6× and the 3D shell's 1.2× shown; ribs stop at the shoulder (F43.6); b06_light
      measures stiffness; the Comet's tall oval of the same width.

## b07 (Shell III and Shape; builder finished ~10:10, file deck/src/30-b07-board-shape.js)
- [x] Battery (F42.1, corrected by H2): switch B07_BATT_F42 (hard-coded z -19.05) to read KEY_PARTS.battery once H2 has
      regenerated it (H2's corrected place: centre about z -21.94, 1.5 mm up; the balance at z 0 with the side switches
      and the posts in); update screwsH1 and boardCom from H2's numbers (review/b07.md "HARDWARE"); b07_balance's verdict
      follows the solved balance.
      > P4: done. b07_battZ/Y read KEY_PARTS (z −26.98, 7.46 mm up; the −21 test and B07_BATT_F42 gone); b07_cg mirrors H2's
      > model part for part (side switches ×2, posts ×2 estimated, screws and inserts at the board's holes, board 23.44 / 6.51):
      > CoM z 0.00, 12.60 mm up, scales 14.7 / 14.6 g, battery in the hump 16.03 mm: verdict 4.0 → 0.7 mm (each rounded against
      > Theseus), owners "Battery in the hump" / "Theseus"; "set where the mouse balances" replaces "over the board's rear edge".
- [x] The rib feet's joint to the board (b07's question 1): make a small options sheet IMAGE for Brock (F44.1: pictures, not
      text): (a) slots in the board's edge, a sliding fit; (b) bonded; (c) screwed or clipped; each drawn in the deck's style
      at the rib's real size (1.1 × 1.2 mm carbon PP) with what it costs (parts, assembly, strength in a drop if modelled);
      send the path to the integrator. Until he answers, b07_arms makes no drop claim (as now).
      > P4: sent 10:2x: /home/claude/work/p4/sheet/rib-foot-joint-options.png (A keyed slots, B bonded, C screwed or clipped;
      > costs; forces from b07's plan model: push up to 11.6 N, pull up to 2.2 N). A plain push-only slot would make the softest
      > spot 42 → 54 µm, worse than the arms' 51: the slot must be keyed.
- [x] SRC keys: b07Fr4Wiki, b07Fr4Flex, b07GwPlusPro, b07GwHtsU, b07X2f duplicate b01's and b05's keys: point at the
      originals (or keep one definition) so the film has one source per fact.
      > P4: b07GwPlusPro → b01GwPlusPro + b01GwWarg, b07GwHtsU → b01TpuHtsU, b07Fr4Flex → shlFr4 (Gund, both ways), b07X2f →
      > b01X2f + b01X2fWt. b07Fr4Wiki kept: no other file defines the Wikipedia FR-4 entry. Also b07_size's X2F 29.5 → 29 g (Pulsar).
- [x] Decided, no change: the film sticker left out; the ±0.10 mm seam allowance as a labelled example; his size rule beside
      Oude Hengel 2008.

## b05, b06, b07, b12 (P6 takes over P4's files and L1's b12, 12:40 to 13:5x; log /home/claude/work/p6/PROGRESS.md)
- [x] FG's finger notes (F49.1, F54.2 "To scale", F54.3 "Turned 13°"): b05's four presses `surf: 0`, to scale, glow gone; b06's presses
      at a slant and to scale (bridges 8 px/mm, arches 10 px/mm, so a finger fits under the captions); the egg pinched between finger
      and thumb; b07_arms the thumb and ring finger along the sides, pads in.
      > P6: done; frames /home/claude/work/p6/shots/f4/, final/. b07_board's end-on pads tried and left off (they still read as
      > ear muffs at that size); b07_newton's tile and b07_tolerance's seam inset left as they are (WHY NOT in review/b07.md).
- [x] b05_cubed (decided A, else B): plan A FAILS on the lattice study's own 3D model (±0.076 mm on every moulded size: Theseus's
      ribbed shell swings 44 %, a plain wall of its weight 30 %); plan B is applied: a generic 1.00 mm wall in neutral ink, two plain stats,
      and one line that Theseus's skin is ribbed, its tolerances proven at first shots.
      > P6: the ruler is untouched; the finding is in review/b05.md (top) for the critic and Brock's archive.
- [ ] b06 node drawings (fibres, fillet, filletsize, mold) on the kagome's two-rib crossing: ON HOLD (main 13:3x) until Brock picks
      kagome or true triangles; then re-solve the node at the shell's proportions (not the dense strip).
- [x] FILM F34 (the ruler on b05_cubed or b05_fallacy): kept on b05_cubed; b05_fallacy's thesis caption calls it back (FILM.md 13:5x).
- [x] b07_emg's payoff: Brock's answer (F55.4) keeps the default, the rule. No change.
- [ ] b07_balance against H3's new board centre of mass after S2's screw posts: WAITING for main's relay (H3's 12:35 figures move
      nothing at the printed precision).
- [x] CRITIC (R3) items without a reply: R3 12:08 (b06_lattice's whole-shell line: the converged numbers), R2-b06-4 (palm: WHY NOT),
      R3-b12-5 (the steel-safe line): replied in review/b06.md, b12.md.
- [x] FILM F38 (main 12:5x): one ground per shared-subject run: b05_nopick → work on night, b06_fillet → filletsize on paper, and
      b12_latopt with b12_ribs on night; qa and frames on the new grounds; the seams either side flip at changes of idea.
- [x] L1's converged numbers (main 12:5x): b06_lattice's whole-shell line (all within 6 %, the hexagons' hottest rib about twice as
      hard), b06_arches' spacing words (about 12.6 mm); wording agreed with L1.
- [x] b12 (main 13:3x): (a) the steel-safe tooling line; (b) "sloped", not "final", crease; (c) the pattern untouched; (d) the rib and the
      skin note kept.
- [ ] b12 (b), the re-solve at Brock's 1.75° crease: WAITING for S2's line (main relays); then the winner and the plain wall at h 0.55.
- [x] Found: b06_filletsize's and b06_mold's `answers` lists were missing a comma, so each indexed itself to [undefined]; fixed and
      checked in the page (every b05/b06/b07/b12 answers list is clean string pairs).

## All polish agents (P1 to P4), from F0c's report (10:15)
- [x] In-chapter hand-offs (FILM M9; DESIGN §7): where one of your slides ends on the whole simplified mouse and the next
      opens on it, and the slide visibly hands that part on, declare `handoff: { out: d }` on the first and
      `handoff: { in: d }` on the second (d = the mouseFit / establish call as made: { view, box, pad, focus }); the player
      moves the one mouse between them and falls back to a dissolve if the declarations don't match. Only where it's real.
      > P4 (b05-b07): one real case, declared: b05_card (out: left, [1000, 200, 840, 500], pad 0.04, as chapterCard2 draws its part)
      > → b05_material (in: left, [LM, 280, 340, 220], pad 0.06): the lit shell goes on to have a strip cut from its wall; both
      > flPlace() resolve in the page. No other seam in b05-b07 ends and opens on the whole simplified mouse.
      > P3 (b01, b04): no real case, none declared. b04_sag opens on the whole mouse (side, s 5) but b04_focus ends on the lens
      > section and its ruler (its two small mice are the flick's icons, elsewhere and smaller); b04_camera's establish opens on
      > the whole mouse but b04_card ends on the lens section; b04_skates' underside follows b04_sag's side view. In b01 the
      > only slides ending on Theseus's whole mouse (compromise: top, big; battery: top) are followed by side-view lanes and a
      > table. The chapter flight b04_reports → b05_card is the player's (K checked it, pixel-exact).
      > P1 (b09-b11): no real case, none declared. Checked every seam's settle against the next slide's t = 0: b09_chip ends on
      > two rows (Theseus's mouse turned and small, beside a rival) and b09_radio establishes the whole mouse from above to reach
      > the radio module (another part); b10_lights ends on Theseus from above and b10_software opens on its settings panel;
      > b10_cable ends on the side view and b10_lights opens on the rival; in b11 every slide that opens on the whole mouse
      > (b11_screws, b11_inserts, b11_board) follows one that ends on panels or a table. The chapter cards' flights are the player's.
      > P2 (b02, b03, b08; 12:08): no real case, none declared. b08_grip → b08_gripmap is already continuous inside b08_gripmap (it
      > opens on b08_grip's last camera with its ridges macro and pulls back itself; there the mouse lies under the macro, not as
      > the subject). b02_cutouts ends pushed in on the trigger under its overlay, and b02_cutouts → b02_seams changes ground
      > (paper → night: FILM F38, the integrator's); every other seam in the three files ends on a section, a chart or a verdict.
- [x] P2, b02_card: the switch fades in at 0.8 to 1.6 s; show it from frame one (M6), so the chapter flight cross-fades
      straight into it.
      > P2 (12:08): done (10:52, re-checked after the restart): the GT01 and its label are drawn from t = 0 (a = 1), its own slow
      > press the motion; the card also lists both halves of the chapter now (nine items, R2-b02-8 / FILM F22).

## b09-b11 (P1, from the review files and the 11:15 messages)
- [x] The 0.6 mm board (F47.4; H3's HARDWARE notes in review/b09, b10, b11; the integrator's urgent b11_inserts).
      > P1 11:4x: b11_jointMM: Theseus's joint on BOARD_T, seated OWN_SEAT (4.4 mm); the rival's plastic joint on most mice's
      > 1.0 mm, seated 4.0 (so b11_inserts' "0.14 mm at the tip" stays true); b11_inPose per joint; b11_wear's rows the same;
      > B11_SIDE Theseus BOARD_TOP / BOARD_TOP - BOARD_T, the rival its own 5.05 / 4.0; b11_plugMM('side') and b11_switchClaws
      > th null. b10_board: b10_boardSideMM o.th (the Cougar's 1.0, Theseus's BOARD_T); lane "Board target: 5.6 g" (F42.2,
      > R3-b10-1). b09: B09C and the twin's camera read BOARD_TOP. The kit's dashed board meets the joint's on b11_inserts.
- [x] b09_radio, K's 11:20 convention (never strike Theseus's own first layout) and R2-b09-1.
      > P1 11:4x: two plain stats (17.2 mm "Plan 5" big, 4.0 mm "Our first board" in ink, "4.3× the clearance / A steadier
      > link"); readouts "To the wheel's rim"; title "The radio, four times further from metal" (B09C's ratio, floored; card
      > entry "The radio, further from metal"); answers row says Brock accepted plan 5 (F48.2). FEEDBACK F40.4 (11.9 → 27.6 mm
      > to the axle) should be marked SUPERSEDED by F48.2 (FA / integrator).
- [x] The antenna options page (?p1opts=1, opts_slide.js): never in any src, snapshot or dist file; nothing to gate.
- [x] R2-b11-5 / FILM F35 (grip tape in the box against b08_tape): Brock's call, in P1's report as options.
      > P5 (14:0x): Brock decided (F52.2, "Drop it from the box"). b11_box: Theseus's tape cell reads "Etched", and the verdict
      > counts the five other items ("tape aside": 3 → 5 of 5, "Next best wireless"). own_trifold's Spares panel shows skates only.
      > No other on-screen string says Theseus ships tape (grep; the old `box` slide is not in the film). Frame: p5/shots/a4/112_b11_box_11.png.
