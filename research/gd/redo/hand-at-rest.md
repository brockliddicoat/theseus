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

## Interim source notes, written 20:35 after a cut-off (figures as read; to be folded into the final layout)

7. **Lee & Jung 2014, Tables 3 to 8, M (SD), degrees, flexion positive.** Rows: shoulder flexion 0 / 45 / 90 / 135, then the mean.
   - Index, forearm neutral: MCP 27 (4), 28 (4), 28 (10), 32 (11), mean 29 (8); PIP 26 (8), 28 (8), 29 (8), 31 (10), mean 29 (8);
     DIP 10 (5), 10 (5), 9 (4), 11 (5), mean 10 (5). Pronation means 26 (8) / 23 (8) / 9 (5); supination 28 (10) / 41 (13) / 14 (6).
   - Middle, neutral: MCP 32 (4), 31 (6), 32 (8), 33 (10), mean 32 (7); PIP 27 (11), 31 (10), 30 (11), 30 (11), mean 30 (11);
     DIP 10 (5), 11 (5), 11 (6), 11 (6), mean 11 (5). Pronation 30 (6) / 26 (9) / 9 (5); supination 34 (11) / 42 (16) / 16 (8).
   - Ring, neutral: MCP 24 (5), 25 (4), 23 (8), 28 (7), mean 25 (6); PIP 32 (9), 33 (10), 35 (11), 38 (11), mean 34 (10);
     DIP 8 (4), 9 (5), 10 (5), 10 (5), mean 9 (5). Pronation 23 (6) / 30 (9) / 8 (4); supination 28 (9) / 45 (17) / 13 (8).
   - Little, neutral: MCP 29 (7), 31 (5), 31 (9), 36 (5), mean 32 (7); PIP 34 (11), 37 (6), 38 (7), 39 (8), mean 37 (8);
     DIP 12 (7), 13 (6), 13 (7), 14 (8), mean 13 (7). Pronation 31 (7) / 35 (7) / 9 (5); supination 31 (10) / 45 (12) / 18 (10).
   - Thumb, neutral: CMC 47 (10), 50 (7), 48 (6), 35 (16), mean 45 (12); MCP 43 (10), 41 (11), 38 (13), 34 (14), mean 39 (12);
     IP 9 (6), 9 (5), 10 (6), 11 (8), mean 10 (6). Pronation 46 (10) / 35 (12) / 8 (4); supination 50 (13) / 43 (14) / 17 (10).
   - Wrist: neutral -16 (6), 16 (8), 17 (7), 24 (14), mean 10 (18); pronation -15 (8), 8 (5), 16 (8), 30 (14), mean 8 (19);
     supination -17 (6), -26 (7), -33 (12), -36 (12), mean -28 (12).
   - Method (p. 92 to 94): Vicon, 7 cameras, 50 Hz; 25 hemispheric markers of 4 mm on the back of the hand and forearm (fingertips, heads of
     the middle and proximal phalanges, heads of the metacarpals; thumb tip, proximal phalanx head, metacarpal head; bases of metacarpals 2
     and 5; styloids); "virtual markers" in Figure 2 not explained. Angle: between a phalanx's long axis and its projection on the frontal
     plane (ISB axes); no statement of which segment each joint is measured against; no thumb-specific definition. Seated, elbow straight,
     5 s per trial, subjects "subjectively posed" a resting posture. Hand length 17.78 (SD 1.18) cm; men 18.76, women 16.80.
8. **Greiner 1991 (NATICK/TR-92/011), men n = 1,003, cm; OCR copy at DTIC, read once per figure unless noted.**
   Digit 1: length 6.97 (0.48), height 10.03 (0.74), tip to wrist crease 13.79 (0.87), IP breadth 2.40 (0.13), functional link 12.34,
   "metacarpal link" 8.23, "proximal link" 2.11, distal link 3.45 (the links run between crease landmarks, not joint centres).
   Digit 2: length 7.53 (0.49), height 18.00 (0.95), tip to wrist crease 18.52 (0.99), PIP breadth 2.30 (0.16), DIP breadth 2.01 (0.15).
   Digit 3: length 8.38 (0.54), height 19.41 (1.03), tip to wrist crease 19.45 (1.03), PIP breadth 2.25, DIP breadth 1.98.
   Digit 4: length 7.92 (0.52), height 18.02 (1.01), tip to wrist crease 18.50 (1.02), PIP 2.14, DIP 1.85.
   Digit 5: length 6.47 (0.49), height 14.54 (0.94), tip to wrist crease 15.99 (0.98), PIP 1.92, DIP 1.74.
   Hand length 19.41 (1.03 digitised; 0.99 measured from the stylion), palm length 11.05 (0.60), hand breadth 9.04 (0.42) measured,
   crotch heights 6.91, 11.04, 10.99, 9.66, wrist to thumb tip 12.45 (0.68), wrist to index tip 18.10 (0.91).
   Digit length runs from the centre of the proximal flexion crease at the finger's base to the tip (p. 21); heights are perpendicular
   to the wrist-crease baseline (points 2 and 38, p. 26).
9. **Cooney, Lucca, Chao & Linscheid 1981 (JBJS 63-A:1371-81), two reads.** Ten cadaver hands: the trapezium sits 46 deg flexed, 35 deg
   abducted and 82 deg pronated to the third metacarpal (medians 48 / 38 / 80). Nineteen adults, biplanar X-rays, resting position (thumb
   against the middle of the index's distal phalanx; thumb MCP and IP each flexed 10 to 15 deg): first metacarpal on the trapezium
   20.5 (10) deg flexed, 23.2 (5) deg adducted, 13.6 (9) deg pronated (Table III).
10. **Su, Chou, Yang, Lin & An 2005 (Clin Biomech 20:491-7), abstract only.** Fifty adults, skin markers; relaxed fingers follow the wrist
    about linearly: wrist 60 deg flexed to 60 deg extended takes the MCP from 27 to 63, the PIP from 19 to 70 and the DIP from 12 to 31 deg.
    Slopes (derived): 0.30, 0.43 and 0.16 deg per degree of wrist.
11. **Varghese et al. 2020 (JCDR 14(5):YC01-07), read at the journal.** Non-power-grip users, dominant hand, n = 250 (188 men), finger
    goniometer, forearm supinated, wrist 15 to 20 deg extended, hand supported: index 27.08 (7.00) / 38.74 (8.74) / 13.76 (4.65); middle
    33.21 / 40.67 / 14.20; ring 29.34 / 44.83 / 14.33; little 26.24 / 43.07 / 16.08 (MCP / PIP / DIP). As recorded. No thumb, no spread.
12. **Rogers, Barr, Kasemsontitum & Rempel 2008 (Ergonomics 51(4):511-26; CDC stacks copy), two reads.** 100 hands (50 men, 50 women; hand
    length 178.1, SD 13.5; breadth 84.5), palmar landmarks digitised with a probe, wrist supported about 15 deg extended. Posture B,
    "holding a mouse", fingers relaxed and together, Table 4, joint angles with 180 = straight: thumb IP 162.9 (16.2); index MCP 155.6
    (6.2), PIP 171.4 (6.4), DIP 175.6 (4.8); middle 152.7 (6.2), 167.1 (9.6), 175.2 (4.9); ring 158.0 (7.0), 167.1 (10.5), 174.4 (6.2);
    little 159.5 (7.5), 175.9 (7.4), 173.2 (6.3). As flexion: index 24 / 9 / 4, middle 27 / 13 / 5, ring 22 / 13 / 6, little 20 / 4 / 7,
    thumb tip joint 17. Thumb pad centre to index pad centre 60.1 mm (SD 10.6); index pad to middle pad about 21 mm (SD about 3).
13. **Oude Hengel, Houwink, Odell, van Dieen & Dennerlein 2008 (Clin Biomech 23:727-34; CDC stacks copy).** 30 adults, hand length 18.2 cm
    (16.0 to 21.0), electromagnetic sensors on the index's first bone, the third metacarpal and the forearm. On the 121 x 64 x 38 mm desktop
    mouse: index MCP flexion 25.1 deg median (22.0 to 27.9, 10th to 90th percentile of the task), wrist extension 31.2 (28.8 to 33.3),
    forearm pronation 86. Small hands extend the wrist more than large ones (33.8 against 28.3 deg).
14. **Lee, McLoone & Dennerlein 2008 (Appl Ergon 39:107-13; CDC stacks copy).** 100 students watched for 5 min each on one office mouse:
    wrist extension 15 to 30 deg in 97 %; forearm and wrist fully supported in 77 %; a lifted finger while still: index 19 %, middle 30 %,
    ring 4 %, little 0 %; index middle joint under 15 deg ("extended") in 20 %. No thumb data, no hand sizes.
15. **Wang, Li, Arippa, Barr, Xue & Harris-Adamson 2023 (Int J Ind Ergon 97:103493).** 16 professional players, inertial sensors: peak wrist
    extension about 9 to 12 deg, ulnar deviation about 18 deg; no finger, thumb or contact data.
16. **ISS Body Measures: Kim, Young & Rajulu 2019 ("Neutral Body Posture in Spaceflight", NTRS 20190032496).** Nine crew recorded, three
    analysed; twelve whole-body angles against NASA-STD-3000 (seven differ); no wrist, finger or thumb angle. Four more NTRS decks of the
    same study (2014 to 2019) read: none has a hand angle.
17. **The Sora V2's side buttons (3d/shell/shell-sora.glb, glb_nodes.py):** rear button z -9.8 to 5.7 (y 19.6 to 25.7), front button
    z 8.2 to 23.5 (y 16.4 to 23.4).
18. **OpenSim wrist model (osim_joints.py):** thumb CMC 80.4 mm from the index MCP centre, 79.7 mm of it along the index's line; index
    MCP to PIP 48.9, PIP to DIP 33.2 mm.
19. **Audit, first result:** the "palm lifted" placement has no rule fixing where it sits along the mouse. trials.place solves two
    equations that cannot both be met (the tips miss by +4.9 and -4.9 mm); the cost is almost flat from index tip z 5 to z 45, and the
    answer (z 30.0) follows the solver's starting guess: other starts give z 10.0, 45.0, 50.1.
20. **Could not be read:** Skylab's JSC-09551 (JSC-internal); Gundersen & Bond 1976 on NTRS (download failed); the MSIS page (robots
    disallowed; web.archive.org blocked); Buchholz, Armstrong & Goldstein 1992 coefficients (not in the open copy of the companion paper);
    core.ac.uk/download/11151516.pdf (Freivalds table: permission prompt unanswered); Bugbee & Botte 1993 abstract (PubMed page not
    rendered); AIST item pages; Mirakhorlo 2016 supplement. WebFetch stopped at 14:49 ("weekly limit").
