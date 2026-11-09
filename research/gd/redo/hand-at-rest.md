# The hand at rest: research redo (RA, 2026-11-09)

Status: IN PROGRESS (interim notes; the final layout follows). Everything below was read in the primary source through
WebFetch (two differently worded reads for each figure that matters) or recomputed with the scripts in `scripts/`.

## Interim findings (verified so far)

1. **Buryanov & Kotiuk 2010, primary (Int. J. Morphol. 28(3):755-758, SciELO PDF), Table I, two reads.** The finger
   phalanx lengths the study uses are right (index 39.78 / 22.38 / 15.82; middle 44.63 / 26.33 / 17.40; ring 41.37 /
   25.65 / 17.30; little 32.74 / 18.11 / 15.96 mm; n = 66 adults, 19 to 78 years, AP X-rays, right hands, sex split
   not given). The same table has the thumb (metacarpal 46.22 SD 3.94, proximal 31.57 SD 3.13, distal 21.67 SD 1.60),
   the finger metacarpals (68.12, 64.60, 58.00, 53.69) and the fingertip soft tissue (thumb 5.67, fingers 3.84, 3.95,
   3.95, 3.73 mm).
2. **The "web heights" 15.52 / 15.33 / 18.49 / 24.72 are per cent, not millimetres.** Table III: "in percents to the
   entire finger length"; the formula in the text is pp* = (tip + d - de) x 100 % / de, de the finger from the web to
   the skin's tip. The secondary table (a 2017 thesis, arXiv 2003.11598, Table 2.1) prints them with no unit beside
   millimetre columns. In millimetres they are about 11.0, 12.3, 13.8 and 14.0 (derived). hand.py uses them as mm in
   SCALE and in KNUCKLE_BACK.
3. **ANSUR II men, recomputed from the public CSV (n = 4,082) and read in NATICK/TR-15/007:** hand length 193.28
   (SD 9.95; 5th 177, 95th 210), palm length 116.46 (SD 6.23), hand breadth 88.26 (SD 4.39). Hand length runs from
   the stylion to the middle fingertip; palm length from the stylion to the crease at the base of the middle finger.
4. **Lee & Jung 2014, full paper read.** 20 men + 20 women, right hands, 25 skin markers, 12 conditions: shoulder
   flexion 0 / 45 / 90 / 135 deg x forearm neutral / pronated / supinated, ELBOW STRAIGHT, hand free. The study's
   29 / 29 / 10 etc. are the forearm-neutral means over the four shoulder angles. Flexion is positive: the "wrist
   10 (SD 18)" is 10 deg of FLEXION, the mean of -16, 16, 17 and 24, not a wrist near straight.
5. **STS-57 (NASA/TM-2003-104805) Table 1, two reads:** finger flexion 42, 60, 30, 21-57, 55-47, 25-35 (six crew,
   nine hands; mean 41.3); MSIS column 0; no definition of the angle; no accuracy figure; flight day 6, blindfolded.
6. **The thumb-base source is mislabelled.** ESM Table S3 of Goislard de Monsabert et al. 2018 is that paper's own
   specimen (hand length 203 mm), not Veeger 1997 (cited only for the method). Each row is "a point on the axis" with
   a stated position variation of 7.2 mm (flexion axis) and 14.1 mm (abduction axis).
