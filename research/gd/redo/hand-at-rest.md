# The hand at rest: research redo (RA, 2026-11-09)

Brock, 2026-11-09 13:50: "j also want you to redo your research using fable 5.2 max". This is the hand's half of that redo for
"Shape, by gradient descent": its rest posture, its sizes, the thumb, how a hand sits on a mouse, and an audit of
`deck/tools/gd/hand.py` and the two placements. RB has the contact side (touch, friction, forces, stiffness, the optimisation).

How to read it. Every figure is marked: **verified** (read in the primary; "2 reads" means two differently worded reads agreed),
**partly verified** (a secondary source, or an abstract only), **unverified**, **derived** (computed here; the script is named) or
**estimate**. Nothing in `deck/` was changed. Files beside this one:

- `hand-at-rest.json`: the recommended values, keyed as `hand.py`'s inputs, each with source and status.
- `hand-sizes.json`: the outside dimensions of a man's hand with each survey's definition, the bones, the joint centres, the thumb.
- `hand-variant.json` and `variant/hand.py`: the corrected thumb, before and after, for three values of its knuckle.
- `scripts/`: `ansur_check.py`, `sizes.py`, `audit_hand.py`, `rest_pose.py`, `hand_sizes.py`, `hand_variant.py`, `osim_joints.py`,
  `mjcf_joints.py`, `glb_nodes.py`, with their outputs (`*_out.json`).

## What changed

1. **The palm-lifted grip has no rule for where it sits along the mouse.** Its two fingertips cannot both touch the buttons (they
   miss by 4.9 mm each way), the fit is almost equally good from index tip z 10 to z 45, and the answer, z 30.0, follows the
   solver's starting guess. The thumb's z −4, the pinky's z 4, the 28 mm palm gap, both slides and the 278 mm radius all hang on it:
   move the index tip 10 mm and the thumb moves 13 mm and each slide 10 mm.
2. **The palm-on-hump grip rests on a 15° wrist tilt that nobody measured.** People using a mouse hold the wrist back 15 to 30°
   (97 of 100 users), 31° on a mouse the Sora's size. In the study's own model 5° more tilt moves the fingertips 14 mm back: at 20°
   the middle fingertip no longer passes the nose, and the thumb's slide falls from 16.7 mm to 1.3 mm.
3. **So the slide, and the radius set from it, are not yet anchored.** Slide = one placement minus the other; radius = slide / 0.060.
4. **The thumb: its base holds up, its first bone was 10 mm too long, and its knuckle's rest angle is open.** A second source puts
   the base 58 mm behind the index knuckle (the study: 53; now 56). The source was mislabelled: it is one specimen measured by
   Goislard de Monsabert's group, not Veeger 1997. Between joint centres the first link is 37 mm, not 46.9. The knuckle's 39° comes
   from skin markers with no stated reference; 10 to 15° is only a description. With the knuckle at 12.5° the corrected thumb lands
   where it did (z −4.4 against −3.8); at 25°, z −7.0; at 39°, z −11.5.
5. **A unit slip.** Buryanov & Kotiuk's "web heights" (15.52, 15.33, 18.49, 24.72) are per cent of the finger's length, not
   millimetres (they are 11.0, 12.3, 13.8, 14.0 mm). The bone scale it fed is still right by other routes (1.052; 1.04 to 1.09). The
   little finger's knuckle is 13 mm behind the middle's, not 9.4, so the pinky sits 3.8 mm further back.
6. **Lee & Jung's numbers are right; the reason for choosing them was wrong.** Their "forearm neutral" figures average four arm
   positions with the elbow straight; the wrist ran from 16° bent back to 24° bent forward (mean 10° forward), not "near straight".
   They remain the best ground stand-in, with a doubt of about ±10° at each knuckle and middle joint and ±5° at each tip joint.
7. **NASA's orbit data are thinner than the slides suggest.** One number per hand, never defined, on six crew on one day; one crew
   member's two hands read 21° and 57°. The ISS study measured no hand angle. Skylab's source could not be obtained.
8. **New: measurements of a hand on a mouse.** 100 hands "holding a mouse": index 24° / 9° / 4°, flatter than the rest cascade;
   thumb pad 60 mm (SD 11) from the index pad; index and middle pads 21 mm apart. 30 users on a 121 mm mouse: index knuckle 25°,
   wrist 31° back. 100 users watched: 19% rest with the index lifted, 30% with the middle finger lifted.
9. **Sizes are now sourced end to end.** ANSUR II recomputed from the data; Buryanov & Kotiuk read in the primary, thumb included;
   hand thickness 32.9 mm, every joint's breadth and depth (Garrett 1970), digit lengths and heights (Greiner 1991).
10. **What cannot be supported.** How far apart the fingers lie at rest (no measurement found). The palm's skin 20 mm under the
    knuckle line (only the knuckle's own thickness is measured). The 5th to 95th percentile "spread" (it counts hand length only;
    posture differs between people three times as much). What Lee & Jung's thumb base angle is measured from.

## Verdicts on what was recorded

| Recorded (shape-gd.json, hand.py, slides) | Verdict | Now |
|---|---|---|
| STS-57 Table 1: finger flexion 42, 60, 30, 21, 57, 55, 47, 25, 35; mean 41.3 | verified, 2 reads | mean 41.3 by hand (SD 14.4), 42.0 by crew member; six crew, nine hands |
| STS-57: wrist extension 0 in all but one (3); ulnar bend 0 (two hands 9 and 3) | verified, 2 reads | same |
| STS-57: MSIS column wrist 0 / 0, elbow 90, shoulder flexion 36, finger flexion 0 | verified (the TM's column); the MSIS itself not readable | same |
| STS-57: "which joint is not stated" | verified | no definition, no figure, no accuracy figure anywhere in the TM |
| ISS Body Measures: no hand angles | verified (five NTRS items) | plus Kim, Young & Rajulu 2019: 12 whole-body angles, 3 of 9 crew analysed, no hand |
| Lee & Jung: index 29 / 29 / 10, middle 32 / 30 / 11, ring 25 / 34 / 9, little 32 / 37 / 13; thumb 45 / 39 / 10 | verified, 2 reads | same; they are means over four arm positions |
| Lee & Jung: "forearm neutral, whose wrist is closest to the 0° in orbit"; wrist 10 (SD 18) | **corrected** | 10° of flexion, the mean of −16, 16, 17, 24; no condition has a straight wrist |
| Lee & Jung: 40 participants, Vicon; angle definition; CMC reference not stated; no spread | verified | 20 men, 20 women; 25 skin markers; elbow straight; hand length 177.8 mm |
| Varghese 2020: 27.08 / 38.74 / 13.76 etc., n 250, supinated, wrist 15 to 20° back | verified | same; finger goniometer, hand supported |
| ANSUR II men: hand 193.3 (SD 9.9; 177 to 210), palm 116.5, breadth 88.3 (SD 4.4), n 4,082 | verified (data recomputed; report pages read) | 193.28 (9.95), 116.46 (6.23), 88.26 (4.39) |
| Buryanov & Kotiuk finger bones (via arXiv 2003.11598) | verified in the primary, 2 reads | same; the primary also has the thumb, the metacarpals and the tips' soft tissue |
| Buryanov "web height" 15.52 / 15.33 / 18.49 / 24.72 mm | **corrected** | per cent of the finger from web to tip; 11.0 / 12.3 / 13.8 / 14.0 mm (derived) |
| SCALE 1.052 = 76.8 / (88.36 − 15.33) | derivation **wrong**, value stands | 1.04 to 1.09 by three routes (sizes.py) |
| KNUCKLE_BACK index 0.19, ring 3.16, little 9.39 (web-height differences) | **replaced** | index 0, ring 5, little 13 (three sources) |
| Thumb base 0.275 hand lengths behind the index knuckle, "Veeger 1997 via Goislard 2018" | figures verified, 2 reads; attribution **corrected**; value stands | the supplement's own specimen (203 mm hand); second source 58.0 mm (MyoHand); recommended 0.29 (0.275 to 0.34) |
| Thumb base 10 mm under the knuckle line (estimate) | now sourced | 11.5 (specimen 9.9, MyoHand 13.1) |
| Thumb metacarpal 46.9 (Haeri 2022, abstract) | **replaced** | whole bone 46.22 mm, SD 3.94 (Buryanov, Table I); as a link between joint centres 37 mm (36 to 39) |
| Thumb phalanges 33.1, 23.4 (Freivalds via a secondary; page blocked) | **replaced** | 31.57 and 21.67 mm (Buryanov, Table I), 33.2 and 22.8 scaled; as links 35 and 26 |
| Thumb MCP 39, IP 10 at rest (Lee & Jung) | IP supported by two more sources; MCP **open** | knuckle 39 (measured, reference undefined), 25 (estimate) or 12.5 (described); tip joint 10 |
| PALM_SKIN 20 mm (estimate) | still an estimate, now bounded | hand 32.9 mm thick at the middle knuckle (Garrett 1970): skin 16 to 19 mm under the joint's centre there |
| GRIP_HEEL_DEG 15 ("Brock's trial ... derived") | an assumption | measured in use: 15 to 30° (97%), 31° median; professional players' peak 9 to 12° |
| Lifted placement: index tip z 30.0, palm gap 28.3 | **an artefact of the solver's start** | needs a stated rule |
| Fingertip x ±16 mm (trials.place) | estimate | 21 mm (SD 3) between index and middle pads with the fingers together (Rogers); the Sora's buttons centre at ±14.7 |
| CONTACT_Y 15 (band 12 to 18) | consistent with the shell | the Sora's side buttons start at y 16.4 (front) and 19.6 (rear) |
| Chords 45.2 / 49.0 / 44.1 / 53.9°; placements; slides; 5th to 95th table; thumb_g5 | recomputed, all reproduce | audit_hand.py |
| Buchholz & Armstrong 1992 thumb grasp angles 29.9 / 36.2 (slide_checks.py) | not re-read (the table's OCR was noisy) | unverified |
| Film fingertip sizes (AIST, Ha 2015) | not re-read (item pages unreachable) | U.S. Air Force men are about 15% broader: 18.4 x 15.5 mm at the index's tip joint |

## 1. The rest posture in zero gravity

### What has been measured in orbit

| Source | Hand data | How, on whom | Status |
|---|---|---|---|
| Skylab 4 (Jackson, Bond & Gundersen 1975, JSC-09551, "Bulletin 17") | not known | outlines traced from front and side photographs (as Kim 2019 describes it). The MSIS figure's note says 12 subjects; the STS-57 TM's conclusions say three men | **unobtainable**: JSC-internal. Gundersen & Bond 1976 (NTRS 19790011996) failed to download twice |
| MSIS / NASA-STD-3000 Fig. 3.3.4.3-1 | the STS-57 TM lists its column as wrist 0 / 0, finger flexion 0 | from Skylab | partly verified (through the TM; the MSIS site refuses robots) |
| STS-57 (Mount, Whitmore & Stealey, NASA/TM-2003-104805) | wrist extension, wrist ulnar bend, forearm rotation, one "finger flexion" per hand | six crew, flight day 6, blindfolded, relaxed, turned through 360°; video and stills; cameras only about 30° apart; angles "identified from the data" with NASA software; no accuracy stated | verified, 2 reads |
| ISS Body Measures (Rajulu, Young, Kim and others, 2014 to 2019) | none | two calibrated cameras, a body template posed by hand on each frame; 9 crew recorded, 3 analysed; 12 whole-body angles, 7 differ from NASA-STD-3000 | verified (five NTRS items) |
| Neutral buoyancy, parabolic flight, glove neutral posture | none found | one search; the only NTRS hit is a data-glove design report without angles | not found |

STS-57's hand rows (Table 1, p. 8 to 9, degrees; left - right where two were read):

| | MSIS | Crew 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| Wrist extension | 0 | 0 | 3 - 0 | 0 | 0 | 0 | 0 |
| Wrist ulnar bend | 0 | 0 | 0 | 0 | 0 - 9 | 0 - 3 | 0 |
| Forearm pronation | n/a | n/a | 26 | 20 - n/a | n/a - 2 | 16 - n/a | n/a - 5 |
| Forearm supination | 30 | 7 - 10 | n/a | n/a - 30 | 15 - n/a | n/a - 4 | 14 - n/a |
| Finger flexion | 0 | 42 | 60 | 30 | 21 - 57 | 55 - 47 | 25 - 35 |

- The mean 41.3° is read correctly: it is the mean of the nine printed values (SD 14.4, range 21 to 60). Averaging each crew
  member's two hands first gives 42.0°.
- What the row measures is not said anywhere: no definition, no figure, no appendix (Appendix 1 is crew sizes, Appendix 2
  photographs). The one clue is crew 2, described "with the fingers curled at the knuckles", who has the largest value (60). It is
  most likely the fingers as one piece against the hand, at the knuckles. That cannot be verified.
- The crew's hands: 184, 190, 186, 185, 175, 171 mm long (Appendix 1), mean 181.8.
- How loose the measure is: crew 4's left and right hands read 21° and 57°.

### Relaxed hands on the ground

**Lee & Jung 2014** (JOSE 20(1):91-101; full paper, tables read twice). 20 men and 20 women, right-handed, hand length 177.8 mm
(SD 11.8). Seated, **elbow straight**, the arm at four heights (shoulder flexed 0, 45, 90, 135°) with the forearm neutral (palm
toward the body), pronated or supinated: 12 conditions, 5 s each, the hand free, the posture "subjectively posed" as resting. 25
hemispheric markers of 4 mm on the back of the hand and forearm: fingertips, heads of the middle and first phalanges, heads of
the metacarpals, the thumb's tip, first-phalanx head and metacarpal head, the bases of metacarpals 2 and 5, the styloids. Each
angle is the angle between a bone's long axis and its projection on the frontal plane, in ISB axes; "Flexion was positive and
extension was negative". The paper does not say which segment each joint is measured against, how the "virtual markers" of its
Figure 2 were made, or anything specific to the thumb.

- Do the three angles of a finger add along it? The paper does not say so. The values behave as bends from the bone before (a tip
  joint of 10° cannot be a tilt from the palm when the middle joint is 29°), and the study uses them so. Status: consistent with
  the numbers, not stated by the authors.
- The figures the study uses are the forearm-neutral means over the four arm heights. By arm height (0 / 45 / 90 / 135), M (SD):

| Forearm neutral | MCP | PIP | DIP |
|---|---|---|---|
| Index | 27 (4) / 28 (4) / 28 (10) / 32 (11), mean 29 (8) | 26 (8) / 28 (8) / 29 (8) / 31 (10), mean 29 (8) | 10 (5) / 10 (5) / 9 (4) / 11 (5), mean 10 (5) |
| Middle | 32 (4) / 31 (6) / 32 (8) / 33 (10), mean 32 (7) | 27 (11) / 31 (10) / 30 (11) / 30 (11), mean 30 (11) | 10 (5) / 11 (5) / 11 (6) / 11 (6), mean 11 (5) |
| Ring | 24 (5) / 25 (4) / 23 (8) / 28 (7), mean 25 (6) | 32 (9) / 33 (10) / 35 (11) / 38 (11), mean 34 (10) | 8 (4) / 9 (5) / 10 (5) / 10 (5), mean 9 (5) |
| Little | 29 (7) / 31 (5) / 31 (9) / 36 (5), mean 32 (7) | 34 (11) / 37 (6) / 38 (7) / 39 (8), mean 37 (8) | 12 (7) / 13 (6) / 13 (7) / 14 (8), mean 13 (7) |
| Thumb (CMC / MCP / IP) | 47 (10) / 50 (7) / 48 (6) / 35 (16), mean 45 (12) | 43 (10) / 41 (11) / 38 (13) / 34 (14), mean 39 (12) | 9 (6) / 9 (5) / 10 (6) / 11 (8), mean 10 (6) |
| Wrist | −16 (6) / 16 (8) / 17 (7) / 24 (14), mean 10 (18) | | |

  Other forearm means: pronated, index 26 / 23 / 9, wrist 8 (19); supinated, index 28 / 41 / 14, wrist −28 (12).

**Varghese 2020** (JCDR 14(5):YC01-07): 250 software workers (188 men), a finger goniometer, shoulder at the side, forearm
supinated, wrist 15 to 20° back, hand supported: index 27.1 / 38.7 / 13.8, middle 33.2 / 40.7 / 14.2, ring 29.3 / 44.8 / 14.3,
little 26.2 / 43.1 / 16.1 (SDs 4 to 10). No thumb, no spread. Verified.

**Su and others 2005** (Clin Biomech 20:491-7; abstract only): 50 adults, skin markers. With the hand relaxed the fingers follow
the wrist about linearly: from wrist 60° forward to 60° back the knuckle goes from 27 to 63°, the middle joint from 19 to 70°, the
tip joint from 12 to 31°. Slopes (derived): 0.30, 0.43 and 0.16° per degree of wrist. At a straight wrist that interpolates to
about 45 / 45 / 22, more curled than Lee & Jung. Partly verified.

**Other kinds of source.** Hand surgery's "position of rest" gives no measured table that I could reach. No usable anaesthetised
or sleeping series was found (one search). Data-glove and hand-model mean poses: not pursued (MANO's licence; uncalibrated glove
data). Rogers 2008 and Oude Hengel 2008 measure a hand on a mouse, not at rest (section 4).

### How far the ground stands in for orbit

- **Gravity.** With the arm hanging it pulls along the hand; with the arm forward and the forearm neutral (thumb up) it pulls across
  the fingers and has no part in their bending; palm down it bends them, palm up it straightens them. An estimate from one
  specimen's finger masses (index 13.3 + 6.7 + about 5 g; Mirakhorlo 2016, Table 1) against the knuckle's passive stiffness
  (0.039 N m/rad, RB's area): about 8 N mm palm down, enough to move the knuckle 12° (2° to 29° over the published stiffness range;
  rest_pose.py). Lee & Jung's own palm-down, thumb-up and palm-up knuckles are 26, 28 and 30°: gravity's effect is at the low end.
- **The wrist** (tendons crossing it). By Su's slopes, bringing the wrist from Lee & Jung's 16° back to straight takes 5° off the
  knuckle, 7° off the middle joint and 2.5° off the tip joint; from their 17° forward it adds the same. Their own two conditions
  (wrist −16 and +17) differ by only 1 to 3° per joint, so the effect is not seen within their data.
- **Skin markers.** Against a goniometer, 4 mm markers read the index and middle knuckles 4.1° (SD 4.6) and 4.6° (SD 4.8) more
  flexed at about 30°, and the middle joints within 2° (Cook and others 2007, J Appl Biomech 23:70-78, Table 2, 5 people). Geometry
  agrees: a marker on the knuckle stands about 3 mm higher above the bone than the next one. So Lee & Jung's finger knuckles are
  probably 4 to 5° high; the two measurements on a mouse (24° and 25°) fit that.
- **Between sources.** Knuckle 26 to 45°, middle joint 23 to 45°, tip joint 9 to 22° across Lee & Jung's conditions, Varghese and Su.
- **Between people.** SD 4 to 11° at the knuckle, 8 to 11° at the middle joint, 4 to 7° at the tip joint (Lee & Jung).

**Best ground stand-in:** Lee & Jung, forearm neutral. The cleanest single condition is the arm forward at 90° (gravity across the
fingers): index 28 / 29 / 9, middle 32 / 30 / 11, ring 23 / 35 / 10, little 31 / 38 / 13. It differs from the four-height mean the
study uses by 2° at most, so the study's values can stay. **Doubt left for orbit: about ±10° at each knuckle and middle joint,
±5° at each tip joint**, systematic, on top of the spread between people. NASA's 41° fits either reading of it within that doubt.

### The thumb at rest

| Joint | Figure | What it is | Status |
|---|---|---|---|
| Base (CMC) | 45° (SD 12) | Lee & Jung, skin markers; the paper does not say what it is measured from. Most likely the first bone's tilt out of the plane of the palm | figure verified, meaning unverified |
| Base (CMC) | first bone on the trapezium: 20.5° flexed (SD 10), 23.2° adducted (SD 5), 13.6° pronated (SD 9) | Cooney, Lucca, Chao & Linscheid 1981 (JBJS 63-A:1371-81), Table III, rest position, 19 adults; from metal markers taped to the skin, on two-plane X-rays | verified, 3 reads |
| Trapezium to third metacarpal | 46° flexed, 35° abducted, 82° pronated (medians 48 / 38 / 80) | Cooney 1981, Table I, 10 cadaver hands | verified, 2 reads |
| Knuckle (MCP) | 39° (SD 12) | Lee & Jung, skin markers, reference undefined | verified figure; the only measurement on relaxed hands found |
| Knuckle (MCP) | 10 to 15° | Cooney 1981: how the authors describe their rest position, the thumb "held comfortably" against the thumb side of the index's end bone, as for a key pinch. No mean, no SD, no table | **described, not measured** |
| Tip joint (IP) | 10° (SD 6) | Lee & Jung | verified |
| Tip joint (IP) | 6° (SD 15) relaxed round a large ball; 17° (SD 16) on a mouse | Rogers and others 2008, Table 4, 100 hands, landmarks on the palm side | verified, 2 reads |

The tip joint is settled at about 10°. The knuckle is not. The three values now before Brock:

- **39°, measured.** Lee & Jung, 40 relaxed hands. Its weakness: markers on the back of the thumb, and no stated line of reference.
- **12.5°, described.** The middle of Cooney's 10 to 15°. Its weakness: a description of a posed position by hand surgeons, not a
  result. (An earlier note of mine called it an X-ray value; a third reading of the paper corrected that.)
- **25°, an estimate.** 39° less the over-read of skin markers, which I put at 6 to 24°, so 15 to 33°. How: a marker sits on the
  skin above the bone; the line from one marker to the next is not the bone's line when the two stand at different heights. Taking
  the thumb's knuckle marker 14 mm above the bone's axis (half of a knuckle about 24 mm deep, plus the marker), the tip joint's
  12 mm (half of 20.2 mm, Garrett 1970, plus the marker), and links of 37 and 35 mm: the second link's marker line drops 3°; the
  first's rises 21° if the base's "virtual marker" sat at the joint's centre and 3° if it sat at skin height. A straight thumb
  would then read 6 to 24° bent. The paper does not say where the virtual marker was, hence the width.

Palande & Gilbie 1981 ("The deformity of thumb in ulnar paralysis") measured both joints at rest on 25 normal thumbs as controls;
the figures are not in the abstract and the full text could not be reached. That paper, or any goniometer series on relaxed
thumbs, would settle it.

### How far apart the fingers lie at rest

No measurement was found, in orbit or on the ground (two searches; Lee & Jung, Varghese, Su and STS-57 measured bending only).
What exists: with the fingers together on a mouse, the index and middle pad centres are about 21 mm apart (SD 3; Rogers 2008,
hands of 178 mm, 22 mm scaled); knuckle centres are about 22 mm apart (66 mm from index to little, derived from the one specimen).
So fingers lying side by side are close to parallel. **Estimate: 0 to 5° between neighbours at rest.** The model's fingertips
at x ±16 (32 mm apart) are set by the buttons, not by the hand: that is about 10° of spread between index and middle.

### Recommended rest-pose table

Degrees of bend from the bone before. "Doubt" is the systematic doubt for orbit, not the spread between people.

| Joint | Value | Spread (SD) | n | Condition | Source | Flag | Doubt |
|---|---|---|---|---|---|---|---|
| Wrist, bend | 0 | 0 to 3 | 6 crew | relaxed, blindfolded, flight day 6 | STS-57 TM Table 1, p. 8-9 | **orbit** (coarse) | a few degrees |
| Wrist, side bend | 0 | 0 to 9 | 6 crew | same | same | **orbit** | a few degrees |
| Fingers as a whole | 41 | 14 (21 to 60) | 9 hands | same | same, "finger flexion" | **orbit**, joint not defined | cannot be assigned to a joint |
| Index knuckle / middle / tip | 29 / 29 / 10 | 8 / 8 / 5 | 40 | forearm neutral, arm straight, four heights | Lee & Jung Table 4 | ground | ±10 / ±10 / ±5 |
| Middle | 32 / 30 / 11 | 7 / 11 / 5 | 40 | same | Table 5 | ground | same |
| Ring | 25 / 34 / 9 | 6 / 10 / 5 | 40 | same | Table 6 | ground | same |
| Little | 32 / 37 / 13 | 7 / 8 / 7 | 40 | same | Table 7 | ground | same |
| Thumb base | 45 from the palm's plane | 12 | 40 | same | Lee & Jung Table 3 | ground; reference not stated | ±15 |
| Thumb knuckle | 39, 25 or 12.5 (Brock's choice) | 12 for the 39 | 40 / none / 19 | see above | Lee & Jung / estimate / Cooney 1981 | ground; measured / estimate / described | 10 to 39 |
| Thumb tip joint | 10 | 6 | 40 (+100) | relaxed | Lee & Jung Table 3; Rogers Table 4 | ground | ±5 |
| Spread at each knuckle | 0 to 5 between neighbours | none | none | none | none | **estimate** | unknown |

## 2. Sizes

Full tables, definitions and scaled values are in `hand-sizes.json` (81 survey rows, 50 recommended targets).

- **ANSUR II men** (n 4,082): hand length 193.28 (SD 9.95; 5th 177, 95th 210), palm length 116.46 (SD 6.23; 107 to 127), hand
  breadth 88.26 (SD 4.39; 81 to 96). Recomputed from the public CSV (ansur_check.py) and read in NATICK/TR-15/007 (dimensions 42, 44,
  65). Hand length runs from the stylion to the middle fingertip; palm length from the stylion to the crease at the base of the
  middle finger; breadth between the outermost points of the index and little knuckle joints. Verified.
- **Scaling by hand length.** Across ANSUR II's men, finger length (hand minus palm) rises 0.50 mm per mm of hand length against
  0.40 if hands scaled as one piece, and breadth 0.26 against 0.46: long hands have slightly longer fingers and are much less
  broad than one-piece scaling says. For the 5th and 95th percentile fingers the error is under 2 mm. Derived (ansur_check.py).
- **Buryanov & Kotiuk 2010** (Int. J. Morphol. 28(3):755-758; 66 adults aged 19 to 78, X-rays, right hands, lengths between joint
  surfaces; sex split not given), Table I, 2 reads, mm (SD):

| | Tip soft tissue | Distal | Middle | Proximal | Metacarpal |
|---|---|---|---|---|---|
| Thumb | 5.67 (0.61) | 21.67 (1.60) | | 31.57 (3.13) | 46.22 (3.94) |
| Index | 3.84 (0.59) | 15.82 (2.26) | 22.38 (2.51) | 39.78 (4.94) | 68.12 (6.27) |
| Middle | 3.95 (0.61) | 17.40 (1.85) | 26.33 (3.00) | 44.63 (3.81) | 64.60 (5.38) |
| Ring | 3.95 (0.60) | 17.30 (2.22) | 25.65 (3.29) | 41.37 (3.87) | 58.00 (5.06) |
| Little | 3.73 (0.62) | 15.96 (2.45) | 18.11 (2.54) | 32.74 (2.77) | 53.69 (4.36) |

  Table III gives lengths "in percents to the entire finger length", measured from the web to the skin's tip; its last row, the
  knuckle joint's distance behind the web, is 15.52 / 15.33 / 18.49 / 24.72 **per cent**. The secondary the study read (a 2017
  thesis, arXiv 2003.11598, Table 2.1) prints that row with no unit beside millimetre columns. In mm: 11.0, 12.3, 13.8, 14.0.
- **The scale to the ANSUR II mean hand** (sizes.py). The study's 1.052 came from (hand − palm) / (middle bones − 15.33), which
  mixes the unit slip with a missing fingertip. Three sounder routes: stylion to fingertip = carpus (about 26 mm, estimate) +
  metacarpal + three bones + tip gives 1.066 (1.047 to 1.085); Greiner's middle finger over this sample's gives 1.047; crease-based
  finger lengths with the crease 14.4 to 19.6 mm beyond the knuckle give 0.99 to 1.12, because ANSUR II and Greiner place the base
  crease 6.5 mm apart. **1.052 stands; range 1.04 to 1.09.** A 1.4% longer hand moves the hump grip's index tip 3 mm.
- **Greiner 1991** (NATICK/TR-92/011, men n 1,003, photographed palm down; read twice, except the crotch heights and the two
  stylion lengths, read once): digit lengths from
  the base crease 69.7 / 75.3 / 83.8 / 79.2 / 64.7 (thumb to little), fingertip heights above the wrist crease 100.3 / 180.0 / 194.1 /
  180.2 / 145.4, tip to wrist crease along the digit 137.9 / 185.2 / 194.5 / 185.0 / 159.9, crotch heights 69.1 / 110.4 / 109.9 / 96.6,
  stylion to thumb tip 124.5 and to index tip 181.0, hand 194.1, palm 110.5, breadth 90.4. Its "link lengths" run between crease
  landmarks, not joint centres (its thumb "metacarpal link" is 82.3 mm), so they are not used.
- **Garrett 1970** (AMRL-TR-69-42, 148 U.S. Air Force men, calipers): hand thickness at the middle knuckle 32.9 (SD 2.0; 29.8 to
  36.1); wrist breadth 67.8; thenar depth about 61 (the page's mean unreadable); thumb tip joint 22.9 broad, 20.2 deep; index tip
  joint 18.4 by 15.5, middle joint 21.5 by 19.4; middle finger 18.4 by 16.0 and 21.8 by 20.1; ring 17.2 by 15.1 and 20.2 by 18.9;
  little 15.7 by 13.7 and 17.7 by 16.7; fingertip to crotch 58.7 (see the note in hand-sizes.json) / 75.3 / 85.7 / 80.5 / 61.4.
- **Palm thickness.** The hand is 32.9 mm thick at the middle knuckle, so the palm's skin is 16 to 19 mm under that joint's
  centre (centre taken near mid-thickness, estimate). The model's 20 mm is at the top of that, for a line running 100 mm back
  under the palm where no survey measures. Still an estimate; the hump grip moves 2.6 mm for each millimetre of it.
- **Joint centres against the skin's creases and webs.** The crease at a finger's base lies 14.4 to 19.6 mm beyond the knuckle
  joint, the middle crease 1.6 to 2.6 mm short of the middle joint, the end crease 7 to 7.8 mm short of the tip joint; the thumb's
  tip-joint crease 2.2 mm short, its knuckle crease over the joint (Bugbee & Botte 1993 as cited through Doyle & Botte 2003 in
  Kosif and others 2015, and on a hand-surgery reference site: partly verified). On X-rays the knuckle joints lie 11.0 to 14.0 mm
  behind the webs (Buryanov). A joint's centre of rotation lies about 6.5 mm (knuckle), 4 mm (middle joint) and 3 mm (tip joint)
  behind its joint line: estimates, not read in a source in this pass.
- **Knuckles behind the middle finger's** (mm, mean hand; sizes.py): the one specimen, scaled: index 0.8, ring 4.7, little 13.4;
  MyoHand: −1.3, 3.0, 12.8; Greiner's heights less Buryanov's fingers: 0.7, 7.4, 18.9. **Recommended 0 / 5 / 13.** The ring and
  little knuckles also sit 5 to 6 and 9 to 14 mm toward the palm (the arch across the knuckles), which the flat model leaves out.
- **Fingertips and nails.** Not re-read (the AIST item pages could not be reached). The film's index, 14.3 to 16 mm broad, follows
  Japanese men; Garrett's Americans measure 18.4 mm across and 15.5 mm deep at the tip joint.

## 3. The thumb's base

| Source | Behind the index knuckle | Toward the palm | Toward the thumb side | Notes |
|---|---|---|---|---|
| Goislard de Monsabert and others 2018 (Ann Biomed Eng 46:71-85), ESM Table S3b-c | 56.0 mm (0.276 hand lengths; 53.3 scaled) | 9.9 | 2.6 | ONE specimen, hand 203 mm crease to tip, the group's own measurements. Each row is "a point on the axis"; the paper gives a position variation of 7.2 mm (flexion axis) and 14.1 mm (abduction axis). The flexion axis runs 93% along the hand, so its point is free to slide along it. Verified, 2 reads |
| MyoHand model (MyoHub/myo_sim, Apache-2.0; from the MoBL OpenSim model and the 2nd-Hand model), mjcf_joints.py | 58.0 mm | 13.1 | 8.1 | wrist centre to middle knuckle 81.5 mm, to the middle's tip joint 155.3: a hand of about 185 to 190 mm (estimate). Verified (read from the model file) |
| OpenSim wrist model (Gonzalez, Buchanan & Delp 1997), osim_joints.py | 79.7 mm | | | the outlier: its index is 82.1 mm from knuckle to tip joint against MyoHand's 67.7; not used |
| Greiner's thumb in a flat photograph less Buryanov's thumb (derived) | 70 uncorrected, about 58 corrected | | | the first bone dips out of the picture and reads short; weak |

**Recommended:** the base's centre 56 mm behind the index knuckle's centre for the mean hand, **0.29 hand lengths (range 0.275 to
0.34)**; **11.5 mm toward the palm (10 to 13); 5 mm toward the thumb side (3 to 8)**. From the wrist's centre it is 25 to 26 mm
toward the fingers in both sources, and about 33 to 35 mm beyond the wrist crease (estimate). The study's 0.275 and 10 mm stand
inside these ranges. (Which way is "toward the palm" in the specimen's frame is inferred from its knuckles' arch; the supplement
does not name the pose.)

**Axes** (unit vectors as toward the fingers / toward the thumb side / toward the palm):

| | Flexion axis | Abduction axis | Angle between |
|---|---|---|---|
| Specimen (direction variation 34° and 47°) | 0.93 / −0.02 / −0.36 | −0.24 / 0.90 / −0.38 | 84° |
| MyoHand | 0.76 / −0.11 / −0.64 | −0.63 / 0.51 / −0.58 | 81° |

The flexion axis runs roughly along the hand, tilted 21 to 40° toward its back, so bending the base swings the thumb across the
palm. The abduction axis runs across the hand, and the two sources disagree on it by about 40°. In both neutral poses the first
bone points about 30° toward the thumb side and 14° (specimen) or 27° (MyoHand) toward the palm.

**The thumb's links.** Between joint centres: base to knuckle 38.6 mm (specimen) and 35.9 mm (MyoHand); knuckle to tip joint
42.0 (specimen, noisy) and 31.1 (MyoHand). Buryanov's whole first bone is 46.2 mm between its joint surfaces (48.6 scaled): the
base turns about a point inside the bone's near end, so a chain that starts at that point must use about 37 mm. **Recommended
links 37 (36 to 39) / 35 (31 to 36) / 26 to the bone's tip, 32 to the skin's.** The study's 46.9 / 33.1 / 23.4 is 6 mm long overall.

## 4. The hand on a mouse

| Study | Who, how | What it measured |
|---|---|---|
| Rogers, Barr, Kasemsontitum & Rempel 2008 (Ergonomics 51(4):511-526) | 100 hands (50 men, 50 women; length 178.1, SD 13.5; breadth 84.5), 66 landmarks on the palm side touched with a probe, wrist supported about 15° back. Posture B: fingers relaxed and together, "holding a mouse" (the mouse not described) | Table 4 as bend: index 24.4 (6.2) / 8.6 (6.4) / 4.4 (4.8); middle 27.3 (6.2) / 12.9 (9.6) / 4.8 (4.9); ring 22.0 (7.0) / 12.9 (10.5) / 5.6 (6.2); little 20.5 (7.5) / 4.1 (7.4) / 6.8 (6.3); thumb tip joint 17.1 (16.2). Thumb pad centre to index pad centre 60.1 mm (SD 10.6); index pad to middle pad about 21 (SD 3). Verified, 2 reads |
| Oude Hengel, Houwink, Odell, van Dieen & Dennerlein 2008 (Clin Biomech 23:727-734) | 30 adults, hand 182 mm (160 to 210); electromagnetic sensors on the index's first bone, the third metacarpal and the forearm, zeroed with the hand flat; six mice | on the 121 x 64 x 38 mm mouse: index knuckle 25.1° (22.0 to 27.9 over the task), wrist 31.2° back (28.8 to 33.3), index turned 10.5° at the knuckle, forearm pronated 86°. Small hands hold the wrist further back than large (33.8 against 28.3°). Verified, 2 reads |
| Lee, McLoone & Dennerlein 2008 (Appl Ergon 39:107-113) | 100 students watched for 5 minutes each on one office mouse | wrist 15 to 30° back in 97%; forearm and wrist fully on the desk in 77%; a finger lifted off the button while still: index 19%, middle 30%, ring 4%, little 0%; index middle joint under 15° in 20%, between 15 and 60° in 78%. No thumb, no hand sizes. Verified, 1 read |
| Wang, Li, Arippa, Barr, Xue & Harris-Adamson 2023 (Int J Ind Ergon 97:103493) | 16 professional players, inertial sensors | peak wrist extension about 9 to 12°, ulnar deviation about 18°; no finger, thumb or contact data. Verified, 1 read |

- **Where the thumb sits.** No study measures the thumb against the index knuckle or along a mouse; none gives finger positions by
  palm, claw and fingertip grip (only makers' blogs do). Rogers's pad-to-pad distance bounds it: scaled to the mean hand it is
  65.2 mm (SD 11.5), and with Rogers's flat index (its pad centre 65 mm ahead of the knuckle) the thumb's tip comes out **14 to
  19 mm ahead of the index knuckle (2 to 33 for ±1 SD)**, depending on how far apart the two pads are sideways and in height
  (rest_pose.py). Derived from a measurement.
- **The Sora's own side buttons** (glb_nodes.py on `3d/shell/shell-sora.glb`): rear button z −9.8 to 5.7, front button z 8.2 to
  23.5. A thumb that can press both without re-gripping rests near the rear button.
- **Against these.** The study's thumb: 21.5 mm ahead of the knuckle, z −3.8, under the rear button: inside the band. Corrected
  thumb: 20.8 / 18.3 / 13.8 mm ahead for a knuckle of 12.5 / 25 / 39°, z −4.4 / −7.0 / −11.5: all inside the band; the last sits
  just behind the rear button. G1's old placement (49 mm ahead, z 24) is far outside. Brock's "the thumb never goes that far
  forward, that's unnatural" is borne out.
- **The slide.** No measurement of a thumb or finger sliding along a mouse as the hand takes hold was found. It remains a
  construct of the model.
- **The rest cascade against a hand on a mouse.** The knuckle agrees (24 to 25° against 26 to 29°, or about 24 once the markers'
  over-read is taken off). The middle and tip joints are much straighter on a mouse (9 to 13° and 4 to 7° against 29 to 37° and 9
  to 13°). The study's premise, a rest pose set on the mouse, is Brock's; this is the measured contrast to it.

## 5. Audit of hand.py and the placements

Reproduced exactly (audit_hand.py): scale 1.0516; chords 78.5 mm at 45.2°, 88.6 at 49.0°, 83.8 at 44.1°, 65.1 at 53.9°; thumb span
96.0 mm. Lifted: knuckle at z −25.1, height 85.3, palm gap 28.3, tips at z 30.0 / 33.1 / 31.9 / 3.9, thumb −3.8. Hump: knuckle z
−12.8, height 61.0, tips 54.8 / 60.6 / 57.3 / 28.8, thumb 12.9. Slides 16.7 and 24.9 mm. 5th / 50th / 95th: thumb grip −1.6 / −3.8 /
−6.0, landing 5.6 / 12.9 / 23.5, slide 7.2 / 16.7 / 29.5; pinky 6.1 / 3.9 / 1.6, 20.8 / 28.8 / 40.1, 14.7 / 24.9 / 38.4.

**A. The palm-lifted placement is not determined.** `trials.place('lifted')` asks both fingertips to touch the buttons with two
unknowns. They cannot: the middle fingertip hangs about 10 mm lower than the index's, so the best fit leaves them 4.9 mm above and
below. Along the mouse that fit is nearly flat, and the top surface is read at measured stations joined by straight lines, so the
solver stops at a kink near its start. From 18 starting guesses it ends with the index tip at z −4.9 (1), 10.0 (3), 30.0 (7), 45.0 (4) and 50.1 (3); the cost at
45 is slightly lower than at 30. The recorded z 30.0 comes from the start [−25, 85]. Other hand sizes are then anchored to that
z 30. Effect of the anchor, everything else fixed:

| Index tip at z | Thumb grip z | Pinky grip z | Palm gap | Thumb slide | Pinky slide | Radius = thumb slide / 0.060 |
|---|---|---|---|---|---|---|
| 20 | −17.3 | −6.1 | 36.1 | 26.7 | 34.9 | 445 |
| 30 (recorded) | −3.8 | 3.9 | 28.3 | 16.7 | 24.9 | 278 |
| 40 | 9.6 | 13.9 | 22.7 | 6.7 | 14.9 | 112 |

**B. The palm-on-hump placement is very sensitive.** The buttons slope gently, so a small change in fingertip height moves the
whole hand a long way along the mouse:

| Change | Hump: index tip z | Thumb landing z | Thumb slide | Pinky slide |
|---|---|---|---|---|
| as recorded (wrist 15°, palm skin 20 mm) | 54.8 | 12.9 | 16.7 | 24.9 |
| wrist 10° | 63.9 | 23.9 | 27.7 | 33.8 |
| wrist 20° | 40.4 | −2.5 | 1.3 | 11.0 |
| wrist 25° | 33.4 | −9.5 | −5.7 | 4.6 |
| wrist 31° (measured in use) | 26.1 | −15.7 | −11.9 | −1.7 |
| palm skin 15 mm / 25 mm | 67.6 / 41.6 | 25.7 / −0.3 | 29.5 / 3.5 | 37.7 / 11.7 |
| every knuckle −5° / +5° | 41.0 / 63.9 | −0.1 / 21.5 | 4.3 / 24.4 | 11.5 / 33.7 |
| every middle joint −10° / +10° | 43.5 / 62.1 | 0.0 / 23.3 | 6.6 / 23.1 | 14.1 / 31.8 |
| cascade: Lee & Jung arm hanging | 47.5 | 4.2 | 10.3 | 17.7 |
| cascade: Varghese | 62.7 | 22.7 | 24.1 | 31.6 |
| cascade: Rogers, holding a mouse | 31.5 | −11.5 | −2.1 | −1.0 |

  About 3 mm per degree of wrist tilt, 2.6 mm per mm of palm skin, 2 to 3 mm per degree at the knuckles. "The relaxed fingertips
  reach past the front" holds at 15° and stops holding by 20°.

**C. The slide and the radius** inherit A and B. With the anchor between z 20 and z 40 and the tilt between 15 and 20°, the
thumb's slide runs from nothing (or backwards) to about 27 mm, and the radius with it, up to about 445 mm.

**D. The thumb rule.** The base's distance and depth stand (section 3). The first link was a whole bone used from a joint centre
(46.9 for 37). The knuckle's 39° is the weak figure. The two errors cancelled: see the variant below.

**E. The unit slip** (section 2): the scale's size survives; the knuckle setbacks change (pinky 3.8 mm further back).

**F. The 5th to 95th percentile spread.** It scales the whole hand by hand length. That is fair for finger length (under 2 mm
off). But it is the smaller spread: one SD of posture (Lee & Jung's SDs, joints taken as independent) moves the index tip 9.3 mm
along the hand and the middle's 11.6 mm, against 2.9 mm for one SD of hand length (±4.7 mm from the 5th to the 95th percentile).

**G. Smaller points.** The chains end at the bones' tips: the skin's contact is about 1 mm behind and 4 mm below (estimate), so
the hand sits about 4 mm higher than modelled. The model is flat: it leaves out the 9 to 14 mm that the little knuckle sits
toward the palm, and the little fingertip's z is its chain's end (33 mm above the pad in the lifted grip), not a contact with the
side. Lee & Jung's knuckle angles are probably 4 to 5° high (markers). The thumb's contact height 15 mm sits under the side buttons.

### How far each input moves the results

Index tip anchored at z 30; mm; one input at a time (audit_hand.py):

| Input changed | Thumb grip | Thumb landing | Pinky grip | Hump index tip | Thumb slide | Pinky slide |
|---|---|---|---|---|---|---|
| Lifted anchor z 20 / z 40 | −13.5 / +13.4 | −3.5 / +3.4 | −10.0 / +10.0 | 0 | +10.0 / −10.0 | +10.0 / −10.0 |
| Wrist tilt 20° / 25° / 31° | 0 | −15.3 / −22.4 / −28.6 | 0 | −14.4 / −21.4 / −28.7 | −15.3 / −22.4 / −28.6 | −14.0 / −20.4 / −26.6 |
| Palm skin 15 / 25 mm | 0 | +12.8 / −13.2 | 0 | +12.8 / −13.2 | +12.8 / −13.2 | +12.8 / −13.2 |
| Every knuckle −10° / −5° / +5° | −1.0 / −0.6 / +0.8 | −19.0 / −13.0 / +8.6 | −0.3 / −0.2 / +0.3 | −21.0 / −13.9 / +9.1 | −18.0 / −12.4 / +7.8 | −20.2 / −13.5 / +8.7 |
| Thumb base 0.30 / 0.35 hand lengths | −4.8 / −14.4 | −4.6 / −13.9 | 0 | 0 | +0.2 / +0.5 | 0 |
| Thumb knuckle 12.5° (was 39°) | +7.4 | +7.4 | 0 | 0 | 0 | 0 |
| Thumb links 37 / 35 / 26 | −6.1 | −6.1 | 0 | 0 | 0 | 0 |
| Thumb base 5 / 15 / 20 mm under | −4.3 / +3.8 / +7.1 | −5.6 / +5.1 / +9.7 | 0 | 0 | −1.3 / +1.3 / +2.6 | 0 |
| Bones x 1.04 / 1.066 / 1.09 | +1.1 / −1.4 / −3.9 | −1.3 / +1.6 / +4.2 | +0.2 / −0.2 / −0.6 | −2.6 / +3.2 / +8.5 | −2.4 / +3.0 / +8.1 | −2.6 / +3.2 / +8.5 |
| Knuckles 0 / 5 / 13 (little 13 to 19) | +0.1 | −0.2 | −3.1 (to −9.1) | −0.2 | −0.2 | 0 |

### The corrected thumb, before and after (hand-variant.json)

Links 37 / 35 / 26, base 0.29 hand lengths behind and 11.5 mm under, tip joint 10°; everything else as the model has it. The thumb
touches at height 15 mm in every case (the model's rule). 5th / 50th / 95th percentile hands (177.0 / 193.3 / 210.0 mm):

| | Grip z | On the hump z | Slide | Ahead of the index knuckle, grip | on the hump | Overlap with the pinky's path | Shortest hand with an overlap |
|---|---|---|---|---|---|---|---|
| Before | −1.6 / −3.8 / −6.0 | 5.6 / 12.9 / 23.5 | 7.2 / 16.7 / 29.5 | 19.0 / 21.5 / 24.0 | 23.0 / 25.9 / 28.8 | −0.5 / 9.0 / 21.8 | 178.3 mm |
| Knuckle 39° | −8.7 / −11.5 / −14.4 | −1.0 / 5.7 / 15.7 | 7.6 / 17.2 / 30.0 | 12.0 / 13.8 / 15.7 | 16.4 / 18.7 / 21.0 | −7.1 / 1.8 / 14.1 | 190.8 mm |
| Knuckle 25° | −4.5 / −7.0 / −9.5 | 3.1 / 10.2 / 20.5 | 7.6 / 17.2 / 30.0 | 16.1 / 18.3 / 20.6 | 20.6 / 23.2 / 25.9 | −3.0 / 6.3 / 18.9 | 184.9 mm |
| Knuckle 12.5° | −2.2 / −4.4 / −6.8 | 5.5 / 12.7 / 23.2 | 7.6 / 17.2 / 30.0 | 18.5 / 20.8 / 23.3 | 22.9 / 25.7 / 28.6 | −0.6 / 8.9 / 21.6 | 178.6 mm |

The slide hardly changes, so the radius goes from 278 to 286 mm whatever the knuckle. The overlap is what the knuckle changes. With
the knuckles set back as recommended (pinky 3.8 mm further back) the mean hand's overlap becomes 5.7 / 10.2 / 12.7 mm for 39 /
25 / 12.5° and the shortest overlapping hand 185.7 / 175.6 / 168.1 mm (the file's `after_with_recommended_knuckles`). By the
model's own rule trial 3's mirrored valley sits at the rear end of the overlap, which is the pinky's grip z: 3.9 now, 0.1 with the
knuckles corrected. That is a consequence read off the rule, not a rerun.

## Proposed changes, ranked by how much they move the results or the claims

1. **Give the palm-lifted grip a stated rule for where it sits along the mouse, and show what the choice does.** Now: index tip z
   30.0 by the solver's start. Options: keep z 30 and say it is chosen (it is the section where the grooves are measured), or tie
   it to a feature of the shell. Before and after: none if z 30 is kept; ±13 mm on the thumb and ±10 mm on each slide per 10 mm.
   Slide wording, gd_rest caption 3, now: "Lift the palm instead, as in orbit, and the fingertips land on the buttons with the palm
   28 mm over the hump: trial N's grip." Proposed: "Lift the palm instead, as in orbit, with the index fingertip set 30 mm ahead of
   the mouse's middle: the palm then floats 28 mm over the hump. Trial N's grip."
2. **Treat the hump grip's wrist tilt as an assumption with a measured range, and rerun at 20 to 30°.** Now 15°. At 20°: index
   tip z 40.4 (was 54.8), middle 47.1 (was 60.6, past the nose), thumb landing −2.5 (was 12.9), thumb slide 1.3 (was 16.7), pinky
   slide 11.0 (was 24.9). gd_rest caption 2, now: "Tilt the wrist back 15° to rest the palm on the hump, and the relaxed fingertips
   reach past the front of a mouse this long." Proposed, if 15° is kept: "Rest the palm on the hump with the wrist tilted back 15°
   (people using a mouse hold it back 15 to 30°), and the relaxed fingertips reach past the front of a mouse this long. At 20° they
   land on the buttons." The radius "felt over the slide" needs the same care wherever it is quoted: it is the slide divided by 0.060.
3. **Correct the thumb** (variant/hand.py): links 37 / 35 / 26, base 0.29 and 11.5 mm, tip joint 10°, knuckle as Brock chooses.
   Before and after in the table above. gd_rest caption 4, now: "The thumb hangs from its own base and reaches the side 21 mm ahead
   of the index knuckle, at z −4, not up by the fingertips." After: unchanged for 12.5°; "18 mm ... at z −7" for 25°; "14 mm ... at
   z −11.5" for 39°. gd_rest source line, now: "Thumb base 53 mm behind the index knuckle (Veeger 1997), bones Haeri, Freivalds."
   Proposed: "Thumb base 56 mm behind the index knuckle (one specimen, Goislard de Monsabert 2018; 58 mm in the MyoHand model);
   links between joint centres 37 / 35 / 26 mm (the same two sources and Buryanov & Kotiuk 2010)."
   gd_joints caption 3, now: "... knuckle and tip joint: 39° + 10° = 49°." For 12.5°: "... knuckle and tip joint: about 12° + 10° =
   22°. The knuckle is as hand surgeons describe a resting thumb; skin markers read 39°." For 39°: keep, and add to the source line
   "the thumb's knuckle by skin markers, from a line the study does not name". A ready source line is in hand-sizes.json
   (`thumb.relaxed.for_the_slide_source_line`).
4. **Set the knuckles back as measured:** index 0, ring 5, little 13 mm behind the middle's (was 0.19 / 3.16 / 9.39). Pinky grip
   3.9 → 0.1, landing 28.8 → 25.2; slides unchanged.
5. **Correct the sources' wording** (deck/src/40-gd-00-core.js):
   - gdLeeJung: add "means over four arm positions with the elbow straight (arm hanging to raised 135°); the wrist from 16° bent
     back to 24° bent forward". In hand.py and shape-gd.json remove "the closest of the study's conditions to the 0 deg in orbit".
   - gdVeeger: replace by "Joint axes measured on one specimen (hand 203 mm) by B. Goislard de Monsabert and others, Annals of
     Biomedical Engineering 46 (2018) 71-85, ESM Table S3: the thumb's base 56.0 mm behind the index knuckle, 0.276 hand lengths;
     each axis point varies by 7 and 14 mm. The open MyoHand model (MyoHub/myo_sim) has 58.0 mm."
   - gdBuryanov: cite the primary, Table I, with the thumb (46.22 / 31.57 / 21.67 mm), and "scaled by 1.052 to the ANSUR II mean
     hand (derived; 1.04 to 1.09 by three routes)". Drop the arXiv table.
   - gdHaeri and gdFreivalds: drop.
   - gdSts57: may add "six crew, flight day 6; one crew member's two hands read 21 and 57".
   - shape-gd.json: `buryanov.web_height_mm` is per cent; `leejung.wrist_neutral_deg` is flexion; `veeger1997_via_goislard2018`
     is the supplement's own specimen.
6. **Say what the 5th to 95th percentile range is:** "hand length only". Or add posture: ±9 to 12 mm per SD at the fingertips.
7. **gd_joints caption 1** ("Each joint's bend is measured from the bone before it, so the bends add up"): keep; it is how the
   numbers behave, though the paper does not spell it out. gd_joints caption 4 and the wrist's "0°, measured in orbit": keep, verified.
8. **Palm skin:** keep 20 mm as an estimate and say so, or use 18; show the ±13 mm it carries.

## Open questions, and what could settle each

- **What STS-57's "finger flexion" measures.** The authors or NASA JSC's anthropometry group; the mission's stills (Appendix 2).
- **Skylab's hand data.** JSC-09551 and Gundersen & Bond 1976 (NTRS 19790011996, download failed here): a request to NTRS or JSC.
- **The thumb's knuckle at rest.** Palande & Gilbie 1981 (25 normal thumbs, at rest); a 2024 paper in Indian J Plast Surg 57(4):248-255
  (doi 10.1055/s-0044-1788593, PMC11571519), found by a search on the hand's resting cascade and not opened (bot walls on both
  hosts), may hold resting angles; or ten relaxed hands and a goniometer.
- **Finger spread at rest.** A hand-model data set's mean relaxed pose (MANO, licence permitting), or the same ten hands.
- **Where the thumb and fingertips sit on a mouse.** Five hands on the Sora photographed from above and the side with a ruler, or
  pressure film on its sides: the thumb's z, the index tip's z, the wrist's tilt, the palm's gap. This one measurement would
  anchor items 1, 2 and 3 at once.
- **Joint positions from more than one specimen.** Mirakhorlo and others 2016's supplement (Tables S2 to S4: a second specimen);
  Buchholz, Armstrong & Goldstein 1992 (Ergonomics 35:261-273: six hands, coefficients of hand length; paywalled).
- **Hand thickness under the palm** and **hand breadth across the thumb**: White 1980 (NATICK/TR-81/010) has both; its tables
  were unreadable in the scan. AIST's item pages (D10 to D15) have Japanese men's.
- **Centres of rotation behind the joint lines** (6.5 / 4 / 3 mm here, estimates): Unsworth & Alexander 1979 and similar.

## Appendix: what could not be read, and reads that failed

Skylab's JSC-09551 (JSC-internal). Gundersen & Bond 1976 (two failed downloads). The MSIS page (robots refused; the web archive
blocked). Buchholz, Armstrong & Goldstein 1992's coefficients (the open companion paper, Buchholz & Armstrong 1992, defers them to
a 1989 dissertation). `core.ac.uk/download/11151516.pdf`, the Freivalds table (permission prompt unanswered): superseded by
Buryanov's Table I. Haeri 2022: not re-read; superseded. Bugbee & Botte 1993 itself (PubMed page not rendered): read through two
secondaries. Domalain 2010 on the thumb base's passive rest (bot wall). Mirakhorlo 2016's supplement. AIST's item pages. White
1980's tables (OCR). PubMed Central pages (browser check). Thieme's 2024 paper on the hand's resting cascade (bot wall). WebFetch
answers through a small model: every figure used above was either read twice with different wording or is marked "1 read".
Web searches used: about 42.
