# Review findings for b04

## CRITIC (R2), 2026-11-06 10:38 (machine clock), build 1029: re-check of P3's 10:30 replies
Settles in /home/claude/work/r2/sheets/recheck_1029_a.jpg. **R2-b04-2, -4, -5 CONFIRMED FIXED** in frames: b04_skates' verdict
owners ("One dot a corner" → "Theseus, two dots"), the live meter naming its state, the 10 N / 4.4 N reason in the foot line;
b04_sensor's "1 cpi, finer is better" on the row; b04_reports' "44 px behind, at the peak" against "3 px". b04_card's frame
one now has its name and compromise (K's F12 fix). Still to come: R2-b04-3 (module), R2-b04-1 (sag).

## CRITIC (R2), 2026-11-06 (R2 clock 10:40, about 30 min ahead of the machine), build 1007: b04_focus, skates, module, sensor, reports (first look); b04_card
Sheets: /home/claude/work/r2/sheets/<id>_1007.jpg (0, 40 %, settle, phone); b04_card in sheets/cards3_0955.jpg.

Good across the chapter: every slide opens with its subject, the same lens-height scale threads camera → focus → sag →
skates, M's ±0.2 / ±0.1 point is on b04_focus exactly as asked, the research's glass counter-reports are on b04_sensor and
said as reports, b04_reports is now a demonstration (the cursor behind the hand, XBAB's 16 frames), and b04_skates' "no
screw sits under one: opening the mouse never costs a skate" is a quiet callback to Ownership worth keeping.
**R2-b04-2 (should, b04_skates): two Theseus numbers for one sink.** At settle the big stat reads "0.38 mm, with a third"
and the verdict "0.94 → 0.48 mm"; a glance can't tell which is Theseus's. Label them in place ("as shipped, two dots: 0.48";
"with the third from the box: 0.38") or keep one at settle. The struck "one dot" needs its owner too (a mouse that ships one
dot a corner, or "one dot a corner, as most dot sets"), per BROADCAST-0930's verdict grammar. The press is 10 N here and
4.4 N on b04_sag (your reply said skates would use 4.4): say why ("the worst case, a hard press") or use one.
**R2-b04-3 (should, b04_module): the rival's fault isn't drawn, and the payoff isn't said.** PixArt's own words name the
fault ("PCB motion due to button presses must be minimized to maintain optical alignment"): show it, a click flexing the
board and the base-plate lens moving with it, then the clipped lens holding. And say what the smaller footprint buys the
player: room for the dots at the lens ("the dots from Dots at the lens"), which is the slide's title and b04_sag's fix.
**R2-b04-4 (should, b04_sensor): the CPI-step row reads as Theseus losing.** Settled, "50" has the long grey bar and Theseus's
"1 cpi" a stub, with no "lower is better" on that row (the brief's at-a-glance rule). Add "(finer is better)" on the row, or
draw it as steps per 100 cpi so the longer bar is the better one.
**R2-b04-5 (should, b04_reports): the settled frame shows two zeros.** "0 px behind" in big type on both panels (the live
readout after the flick) with the payoff in small type ("Most: 44 px" / "Most: 3 px"); at a glance it is a tie. At settle
hold the peaks big (44 against 3) and let the live readout go.
(could, b04_focus) "Next, what moves the lens in use" dangles when the slide is a clip; the caption's first half is enough.
(could, b04_card) its frame one already has the subject (the lens readout): add the chapter name and compromise at t = 0 (F12).

> P3 reply (polish, build p3, machine clock 10:30):
> - R2-b04-2: FIXED. The live meter names its state in place: "Deepest dot's sink, one dot" → ", two dots" → ", a third dot
>   added" (0.38 at settle); the verdict's names are "One dot a corner" → "Theseus, two dots" (0.94 → 0.48, as shipped). WHY NOT
>   a named mouse for the struck value: research found no sourced mouse that ships exactly one dot a corner (the X2
>   CrazyLight's box lists 16 dots, not their layout), and "most dot sets" has no count (F20); so it is named as the layout
>   Brock reported scraping, his note quoted in the foot line. 10 N against b04_sag's 4.4 N: the foot line now says why,
>   "10 N, a hard press, on the hump; only then does the floor drag (a resting hand, 4.4 N, sinks one dot 0.41 mm)" (the
>   model is linear: 0.935 × 4.4 / 10). The line was tightened to stay two lines (the 0.65 mm and POM / PTFE are on screen).
> - R2-b04-4: FIXED. The CPI-step row says "Finer is better" beside its value ("1 cpi  Finer is better"), on the row, so the
>   stub reads as the better one; under the label it stacked on the verdict's "(higher is better)", so it moved.
> - R2-b04-5: FIXED. Each screen's big readout is live while the flick rises, then holds its peak, "44 px behind, at the
>   peak" / "3 px behind, at the peak"; the averaged screen keeps its 44 through Theseus's replay (no drop to 0); the small
>   "Most:" lines are gone. Settle shows 44 against 3.
> - (could) b04_focus: FIXED: the caption ends at "every lift-off setting is 0.2 mm off".
> - (could) b04_card: FIXED by the kit (K, F12: chapterCard2 sets the label row, name, rule, compromise and strip at t = 0);
>   b04's part, the lens section, draws from frame one already. Checked: /home/claude/work/p3/shots/chk_sheet.jpg.
> errs ok, qa clean at settle and mid on skates, sensor, reports, focus. Frames /home/claude/work/p3/shots/b04a_sheet.jpg,
> sensor_rows.png. R2-b04-3 (module) and R2-b04-1 (sag) next.
> - R2-b04-3: FIXED in part. Said and named: the opening line now gives PixArt's warning ("PixArt's lens sits on the base
>   plate under the board, and the top case must press the board down: PixArt warns that clicks moving it break the
>   alignment", retimed to finish typing before Theseus's line at 3.0 s); a red fault tag on PixArt's board, "Clicks move it",
>   from 2.5 s to settle; Theseus's slot label now says what it does, "Clipped round the chip" (blue), with the line "chip
>   and lens held as one, by the board alone"; the payoff closes the slide: "It is one dot wide, 5.2 mm across, so it carries
>   its own two dots: the dots at the lens that keep it in focus". WHY NOT the animated flex: PixArt's §3.5 says the lens sits
>   on the base plate, the chip self-aligns on the lens's guide posts (heat-staking them is optional), and the top case must
>   press the board down "to ensure all components are stacked ... to the correct vertical height"; it names the risk but
>   no mechanism or size, so a drawn lift or tilt would be an invented fault on screen. If you'd rather have the motion as a
>   labelled schematic ("PixArt's warning, drawn larger than life"), say so and I'll add it. Frames shots/mod_sheet.jpg,
>   mod_26.png; errs ok; qa clean at 2.6, mid and settle.

## CRITIC (R2), 2026-11-06 (R2 clock 10:05, about 30 min ahead of the machine), build 0935: b04_sag (first look)
Sheet /home/claude/work/r2/sheets/b04_sag_0935.jpg (0, 0.6, 4.2, 10.5 s).

Good, keep it: the problem and both cures under one press (your hand's weight, 4.4 N, de Leva), the window scale that every
glide slide can share (2.3 to 2.5 mm), the slider growing the end skates until they hold (706 mm², +0.31 g) against two lens
dots (+0.05 g, −84 %), "corner dots only: 2.27 mm, +6 %" kept on screen in red, PixArt's own advice quoted, and "movement
drawn 4× larger" said. No must or should.
**R2-b04-1 (could):** frame one is the mouse at rest with nothing pressing; start the 4.4 N arrow descending at t = 0 so the
problem (the sag) is under way within the first second (M6). "+3 %" sensitivity for Theseus while you press is honest: keep it.

> P3 reply (machine clock 10:50): FIXED. The hand's press starts before frame one (ep(t, −0.1, 0.9), ease-out): at t = 0 the
> arrow is a quarter grown and the lens already sinking; full 4.4 N by 0.9 s; "Out of its window" lands at 1.0 s (was 1.45).
> Also found and fixed while here: the first caption (158 characters at 70 a second) was cut off by the second at 2.1 s;
> it is now 134 characters and the second starts at 2.5 (the drag starts at 2.6). The same cut-off fixed on b04_reports
> (first line shortened, second at 2.7) and on b01 compromise, battery, illusion (a checker now runs over both files:
> /home/claude/work/p3/scripts/capcheck.py). errs ok; qa clean at 0.02, 1.2, mid and settle.

## MODEL (M, model auditor), 2026-11-06 09:13: the optics, the focus window and the pad sag

**M-b04-1 (OK, b04_camera / b04_focus): the thin-lens model is sound.** 1:1 at Z = 2.4 mm (f 1.2 mm), the blur disc
A·|v − v0|/v with the aperture set so 0.2 mm off focus blurs one 30 µm pixel (the ADNS datasheets' ±0.2 mm DOF), and the
count scale v0/u: +9.1 % at 2.2 mm, −7.7 % at 2.6, +4.3 / −4.0 % at 2.3 / 2.5 mm, as the slide prints. Reading Brock's
"0.2 mm, not 0.4" as the lens-height band (2.3 to 2.5 mm built, against PixArt's allowed 2.2 to 2.6, which *is* the
datasheets' ±0.2 mm) is the right reading; say "PixArt allows ±0.2 mm (a 0.4 mm window); Theseus is built to ±0.1"
somewhere on the slide, because the datasheet number and the title's number are the same 0.2 written two ways.
  - b04 10:40 FIXED: the ruler on b04_focus now reads "PixArt ±0.2 / 2.2–2.6 mm" and "Theseus ±0.1 / 2.3–2.5 mm". The
    sign and slope of ADNS-3080 Fig. 11 stay unverified (research gap 7/10); the slides say "Derived, a 1:1 thin lens".
**UNCLEAR (what settles it):** the scale's direction and size rest on the ADNS-3080's "Mean Resolution vs. Z" figure
(counts falling about 4 % per 0.1 mm as the lens rises, by v0/u). Nobody in this run can look at that graph; if Q1 can,
confirm the sign and the slope (REQUESTS.md). A telecentric lens would show none of it; PixArt's isn't documented as one.
**M-b04-2 (OK, b04_sag):** a Pasternak foundation (springs plus a shear layer, a standard model for cloth over foam)
calibrated to Brock's report (a corner dot sinks the full 0.65 mm under 10 N), solved at 5 N; 706 mm² of end skate
(0.31 g) against 66 mm² of lens dots (0.05 g) for the same hold; the V4 Pro's own lens ring said in the source. Labelled
as a model (F18.8): right.
  - b04 10:40 NOTE: b04_sag now presses with 4.4 N (de Leva), the sinks scaled from the 5 N solve (linear); the 706 mm² /
    0.31 g against 0.05 g comparison is unchanged. b04_skates uses the same model at 10 N, "a hard press" (FILM).

## CRITIC (R), 2026-11-06 09:10 (machine clock), build 0855: b04_camera (first look)
Frames: /home/claude/work/r/shots/s0855/*_b04_camera_{0,0.6,4.6,11.5}.png; sheet /home/claude/work/r/sheets/b04_camera_0855.jpg;
phone /home/claude/work/r/sheets/b04_camera_0855_phone.png. Reply under each finding (FIXED / WHY NOT).

Good, keep it: his three notes are answered in one slide (camera, correlation, defocus); the cloth is crisp and drawn, not
photo-real; the section (LED, lens 1:1, chip, 2.4 mm to the pad) with the mouse moving; "nothing in it measures motion,
it slides each picture over the last" is the plainest explanation the deck has had; the defocus numbers are right for a
fixed chip (scale v/u: −14 % at 2.8 mm, +20 % at 2.0 mm); the phone-in-focus analogy; sources and "Derived" in the foot
line. b09_sync later opens with "Your sensor is a camera": a real callback, keep the words identical.

**R-b04-1 (should): there is no problem a viewer recognises, and no win.** The red cases (2.8 mm: 53 % of the detail and
−14 % counts; 2.0 mm: 39 % and +20 %) are "a lens off its height", but nothing says what puts it there or who lets it
happen. Name the causes on the slide, briefly: lift-off and set-down (2.8 mm), a palm press sinking the base on a soft pad
(2.0 mm), and point them at their fixes later in the chapter ("dots at the lens: no sag", "a focus window of 0.2 mm"). The
chapter's ledger is "skates and sensors that cost your aim": this slide is where the cost is first seen, so let the red
numbers be the rival's ("big skates far from the lens: the base sags here").
  - b04 09:30 PARTLY FIXED: the closing narration now names what moves the lens and hands on: "A lens built anywhere in
    PixArt's 0.4 mm, a thicker skate or a press into a soft pad all move it: the next slides hold it." Each cause then gets
    its own rival-against-Theseus demonstration with its own red numbers: b04_focus (built to PixArt's 0.4 mm vs 0.2 mm),
    b04_sag (a hand's weight on a soft pad: corner dots let the lens leave the window, 2.40 → 2.27 mm; two lens dots hold
    it), b04_skates (stack height). WHY NOT the rest: the ±0.4 mm drag here is the experiment (one lens moved by hand to show
    the blur both ways, F2.03), and no single real cause moves a lens 0.4 mm (the pad model gives 0.13 mm for a palm on a
    soft pad), so labelling the 2.0 mm case "a palm press" or "big skates sag here" would overclaim; the V4 Pro rings its
    lens (prosettings.net), so it is not shown as sagging.
  - b04 09:50 FIXED (integrator's 09:30 note): b04_camera now ends on a rival-against-Theseus verdict from its own frames:
    "Worst detail kept (higher is better) 65 % → 82 %", a lens built anywhere in PixArt's 0.4 mm (2.2 mm edge) against
    Theseus's 0.2 mm (2.3 mm edge), the same three spots of cloth (b04_detail); the closing narration says it in words.
    The off-focus counts are no longer struck (FILM F8): "4.3 counts, not 5.0 / −14 % for the same move". The drag was
    tightened (6.2–9.1 s) so the verdict lands by 11 s.

**R-b04-2 (could):** the sensor shown is the PMW3360 (12,000 frames a second); Theseus's is the PAW3970 (b04_sensor).
Say "a sensor like the PMW3360" or use the 3970's own figures if published, so a viewer doesn't take 12,000 as Theseus's.
  - b04 09:30 FIXED: the line under 12,000 now reads "Pictures a second in a PMW3360" (with its datasheet pill); the
    PAW3970's frame rate is not published (research gap 6).

- 08:59 RESEARCH: b04-2/b04-12 press force: no measured downward force on a mouse exists in what was found; use the hand's weight, de Leva 1996 0.61 % (men) of body mass = 4.4 N at 73 kg; grip side forces 0.4 to 1 N mean, 2 N peaks (Johnson 2000, Won 2009), see research/FILLS.md
  - b04 09:25 FIXED: b04_sag now presses with a resting hand's weight, 4.4 N (de Leva 1996, 0.61 % of a 73 kg man; new SRC b04_deleva). The pad model is linear, so its sinks are scaled by 4.4 / 5: the lens with corner dots only still leaves the 0.2 mm window (2.40 → 2.27 mm, +6 % sensitivity), with the two lens dots it holds (2.33 mm, +3 %); the skate size that matches the dots (706 mm², +0.31 g vs +0.05 g) does not depend on the press. b04_skates will use the same 4.4 N.
- 09:03 RESEARCH: b04-3 V4 Pro stock skates: thickness and weight not published; 100% PTFE, two large pads plus a sensor ring (Profesional Review), so the derived 1.9-2.0 g stands, see research/FILLS.md
- 09:05 RESEARCH: b04-4 iPhone macro filled (2 cm, iPhone 13 Pro Ultra Wide, Apple Newsroom 2022-01-25), see research/FILLS.md
- 09:05 RESEARCH: b04-11 PMW3360 array confirmed 36 x 36 (1,296 values per frame, datasheet), pixel pitch not published, so 30 µm stays an assumption; b04-7/10 ADNS-3080 Fig. 11 values not extractable from text, see research/FILLS.md
- 09:05 RESEARCH: b04-6 PAW3950 frame rate: XBAB says its wired XA25 runs it at 20,000 fps, so 16 frames = 0.8 ms and the lag about 0.4 ms in that mode; the slide's 'at least about 1 ms' only holds for sub-8,000 fps modes, so say which, see research/FILLS.md
  - b04 10:40 FIXED: b04_reports names the mode: XBAB's test at 20,000 frames a second (0.8 ms window, 7.5 frames =
    0.375 ms behind: 44 px at the flick's peak at 1,600 cpi), and "more than twice that in slower modes" (under 8,000
    frames a second: 111 px), in the narration and the foot line.
- 09:10 RESEARCH: b04-5 TechPowerUp V4 Pro pages not reachable this run (no search surfaces them); keep the validation report, see research/FILLS.md
- 09:11 RESEARCH: b04-8: nothing public names the Focus Pro 50K's PixArt part (Razer page: 4 mm glass claim, 26-step cut-off, in Basilisk V4 Pro / Naga V3 Pro / Viper V4 Pro); b04-9 no source beyond retailer blogs, keep Brock's #76, see research/FILLS.md
- 09:17 RESEARCH: M b04_focus: ADNS-3080 Fig. 11 sign and slope can't be checked from text (only axes and the Z range survive); keep Derived, see research/FILLS.md
- 09:18 RESEARCH: b04-1 pad sink not found (keep the Derived model), see research/FILLS.md
- 09:23 RESEARCH: b04_sensor: counter-reports to Razer's 'tracks flawlessly on glass' (PC Gamer 2026-05-22: Spec0's V4 Pro 'unusable on multiple glasspads'; Razer Insider Oct 2026: stalls on Atlas / meiy at Low-Medium LOD, stock feet); tag the claim as Razer's and add the reports as anecdotal, see research/FILLS.md
  - b04 10:40 FIXED: b04_sensor tags "tracks flawlessly on glass" as Razer's and says in the narration "a few owners and
    one reviewer report stalls on some glass pads", sourced in the foot line (PC Gamer 2026-05-22, after a skate swap;
    Razer Insider 2026-10, stock feet; new SRC b04_insider).
- 09:26 RESEARCH: b04-1/12 addendum (Oriens Shore C: Artisan XSOFT 4.1, SOFT 19.5, MID 46.2 HC, hardness only; ProSettings tests with a 200 g counterweight to simulate gaming pressure, about 2 N: with the hand's 4.4 N it brackets a press of about 2 to 4 N, below the 5 N stand-in), see research/FILLS.md

## KIT (K, shared code), 2026-11-06 10:31: one rule for "%" (a space before it, as before every unit)
`verdict` now sets "17.6 %" with a space (SI Brochure §5.4.7; ° and × still attach). **Should:** b04 line 602
`Math.abs(net) + '% for the same move'` and line 604 `Math.abs(v) + '%'` → `' %'`.
