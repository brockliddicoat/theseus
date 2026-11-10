# Feel and forces: the contact-and-forces research behind "Shape, by gradient descent", redone

RB, 2026-11-09, for Brock Liddicoat's instruction of 13:50 ("redo your research using fable 5.2 max"). This covers the contact
between a finger and the shell, the forces, and the optimisation. The hand (rest posture, sizes, the thumb, how a hand sits on a
mouse) is RA's; where a conclusion here leans on the hand model it says so.

Nothing in the deck, the model the deck uses, or `research/gd/shape-gd.json` was changed. Scripts, a variant copy of the model
and their outputs are beside this file (`README.md` says how to rerun them).

Marks: **verified** = read in the primary source, in two readings that agreed (or one reading that agreed with the earlier
record); **partly** = abstract only, a secondary source, or one reading; **unverified** = could not be read. **Derived** =
computed here from the inputs named, by the script named.

---

## What changed

- **The stored results are real.** Rerun from an untouched copy of the code, all four trials come out the same to the last
  digit. The optimiser is not the problem. What it is asked to do is.
- **The descent does not find the two headline radii.** The waist's R 278 mm and the groove's R 224 mm are the felt rule's own
  numbers (the slide, or the landing zone, divided by 0.060). The loss pulls each arc onto its number from both sides. The
  descent only decides where the waist sits, and that is whichever end of a free 9 mm band is nearest to where it starts.
- **The felt rule reads its source correctly, but 3.4° is one point in a band.** Fingertips stroking a strip detect a turn of
  about 2° to 5° (two labs). 3.4° is in the middle. For the same 17 mm thumb slide that is R 180 to 464 mm, not "278". And it
  was measured on a fingertip stroking glass or PVC strips, never on a thumb sliding along a mouse as the hand closes.
- **The grooves come out too gentle to feel.** The rule counts the turn over 13 mm, which includes the spread between
  different people's hands. One fingertip touches about 9 mm, and across that the R 224 groove turns 2.2°, under the study's
  own 3.4°. Measured directly, a still fingertip tells a hollow from flat only when it is tighter than about R 185 mm. The
  Sora's own groove is R 50. Corrected, the groove is R 140 mm and 0.36 mm deep (it was R 224 and 0.23 mm; the Sora's is 0.34).
- **The model leaves a crease.** In every trial the shoulder arc beside the groove shrinks to 0.6 mm long at a radius of
  1.35 mm, a sharp line where the Sora has a 7 mm arc of R 104. No rule forbids it and the ring finger's check does not see
  it. With a minimum-radius rule it is gone.
- **"Felt over the whole slide" holds for the thumb only.** The mirrored waist arc lies under all of the thumb's slide and
  under 12 of the pinky's 25 mm; the rest of the pinky's slide runs over the front arc, which curves the other way. Made to lie
  under both slides, the waist becomes 54 to 64 mm long and 1.3 to 1.8 mm deep, with 1.5 mm of front rise, and runs into the
  normal-mouse limits (the UltralightX's 2.5 mm pocket in one run, the narrowest real mouse's width in the other). This
  rests on the hand model's slides, which RA is correcting.
- **Friction decides everything at these loads.** "About 0.5" is right for dry skin on matte or textured plastic at mouse
  loads (0.41 to 0.53 measured). On smooth plastic it climbs to 1.1 to 1.5 within a minute as the skin sweats. Either way,
  10 mm from the valley's bottom friction can hold 0.22 N where the pocket pulls with 0.016 N and the finger's own spring
  with 0.09 N. A pressed fingertip stays wherever it lands. A pocket this gentle can be felt; it cannot hold a finger or
  move one.
- **So the first estimate (R 47 and R 29) had no physical basis,** as Brock's eye said. Two strengths do mean something:
  *felt* (R = slide ÷ turn) and *catching* (a slipping finger stopped within its own width, R under about 50 to 115 mm). The
  sides can afford only the first without leaving normal mice. The grooves can afford both.
- **Forces.** Johnson's 0.43 N (sides) and 0.35 N (buttons) check out, with the abstract's misprint as recorded. They are
  office figures. Theseus's weight needs a squeeze of 0.27 N a side to lift and 0.8 to 2.3 N a side for flicks and all-out
  swipes (derived). No measured grip force for gaming, lifting or swiping was found anywhere I could read.
- **What cannot be supported:** the knuckle's side-to-side stiffness (no figure for a living hand), any thumb stiffness,
  whether a gripping thumb feels what a stroking fingertip feels, and any measured benefit of pockets or grooves at this
  scale on a mouse. Each is listed under open questions with what would settle it.

---

## Verdict table

Every source, number and rule in this area as recorded in `research/gd/shape-gd.json` and on the slides.

### Sources

| Recorded | Verdict | What was read, and where |
|---|---|---|
| Gordon & Morison 1982: threshold 0.09 mm base-to-peak over 20 mm (SD 0.03); gradient about 0.009 over 20, 30, 40 mm | **verified** | Tables 1 and 2 of the paper (Springer open PDF), two readings. Gradient 0.009 with SD 0.003, 0.005, 0.003 at 20, 30, 40 mm. Added: the strips were convex glass lenses with a raised paper edge, stroked twice in about a second with talc on the finger; the paper does not print its percent-correct criterion |
| The same, "mean + 2 SD = gradient 0.015 = a turn of 3.44°" | **verified as arithmetic; relabel** | A circular arc turns 4 × (height ÷ half length), so 4 × 0.015 rad = 3.44°. It is "97.5 % of people at Gordon & Morison's own criterion" (75 % correct, as Pont 1999 reads it), which is also "the average person at about 87 % correct". Not "reliably" without that qualifier |
| Pont, Kappers & Koenderink 1999: dynamic 3.3 to 5.3°, not changing with length; static 1.6 to 2.8° | **verified; one correction** | pp. 884, 889-890, two readings. The dynamic range is three subjects at 84 % correct, index finger swept by the forearm over 5 to 20 cm. Corrected: "1.6 to 2.8°" is not a range across people; it is two averages (2.8° when one end of the strip is tilted, 1.6° when both are) |
| Goodwin, John & Marceglia 1991: concave 5.4 /m (R 185 mm), convex 4.9 /m (R 204 mm) told from flat at 75 % | **partly** (abstract, read on two pages that agree) | Spherical surfaces pressed onto fingerpads held still. The contact force is not in the abstract |
| Derler & Gerhardt 2012: dry skin over 0.2, typically about 0.5 | **verified; narrow its use** | Abstract, two readings. It is a summary over all skin sites and loads. For fingers on flat surfaces the review gives dry 0.60 ± 0.38 (median 0.45) and moist 1.28 ± 0.67 (Sect. 3.2.1), mostly under 5 N |
| The slide's source line: "on two plastics 0.16 to 0.31 at 20 N (Lewis)" | **corrected** | The review's Table 3 row is glossy paper, two plastics and two lacquered aluminiums together, 0.16 to 0.31 dry at 20 N |
| Johnson et al. 2000: sides 0.43 N (SD 0.13), 0.92 N simulated | **verified** | Results text p. 402, three readings: 0.43 (SD 0.13) against 0.92 (SD 0.35) N |
| Johnson et al. 2000: button 0.35 N (SD 0.06), mean peak 1.41 N | **partly** | Table 2. The PDF's text layer scrambles the table; the column is the button's by a consistency check (see section 3) |
| Johnson et al. 2000: MVC 79.5 N sides, 52.8 N button; n = 16 | **verified** | p. 401; 8 men, 8 women |
| Johnson et al. 2000, the note that the abstract swaps sides and button | **verified** | The PDF's abstract prints 0.6 % (0.35 N) and 0.8 % (0.43 N); the journal's web page prints 0.43 N for the sides and 0.35 N for the button, as the results text does |
| Shi et al. 2020: healthy index knuckle 0.0377, 0.0328, 0.0466, 0.0393 N m/rad; resting 45, 46, 40, 58°; Table 4 ranges | **verified** | Table 2 and Table 4. Flexion and extension only, the two finger joints splinted straight, moved in 10° steps with 30 s holds, four men of 24 and 25 |
| Kuo & Deshpande 2012: 0.016 to 0.210 N m/rad; capsule and ligaments give most of the stiffness | **partly** | Abstract: ten subjects, the muscle-tendon units did under half the passive work. The range is Shi's estimate from their data (Table 4), not a figure in the abstract |
| Milner & Franklin 1998: "max eigenvalue at 20 % MVC 9.7 N/cm (SD 1.9)" | **corrected** | 9.7 N/cm (SD 1.9) is the stiffness along one direction (near the least stiff) at about 10 N of fingertip force, in the comparison with an earlier study. "20 % MVC gives two to four times the relaxed finger's" is verified. The relaxed values are in tables whose numbers could not be read |
| Serhat, Vardar & Kuchenbecker 2022: A = 98.6 F^0.50 mm² | **verified; note what it is** | Table 1 (TU Delft copy). It is a fit to a 2-D finite-element model's contact (line length × an assumed 10 mm), up to 1 N, not a measurement. Measured areas on glass are larger (Delhaye 2014: 83 to 116 mm² at 0.5 N against the fit's 70) |
| TechPowerUp, UltralightX widths 61.6 / 56.6 / 58.8 mm: 2.5 mm pocket, 1.1 mm flare | **arithmetic verified, source not re-read** | (61.6 − 56.6) ÷ 2 = 2.5; (58.8 − 56.6) ÷ 2 = 1.1 |
| mice.json: widths 60.5 to 70 mm | **verified against the file** | 35 mice, 60.5 (Endgame Gear OP1 8k v2) to 70.0 (ELECOM VM800L). The file's own sources not re-read |

### Derived numbers

| Recorded | Verdict |
|---|---|
| First estimate: R 46.66 mm sides, 28.75 mm grooves (pocket stiffness = finger stiffness) | **recomputed, the same; the rule is replaced** (section 6) |
| Circle check: R 47 over 30 mm = 2.46 mm | **verified** |
| Friction angle 11° to 27° for μ 0.2 to 0.5 | **verified** (11.3°, 26.6°) |
| Contact patch 9.07 mm (0.43 N), 8.62 mm (0.35 N) | **arithmetic verified; likely 10 to 20 % low** (measured areas give about 10.8 and 10.3 mm) |
| Sideways spread of a fingertip between hands, 2.41 mm | **arithmetic verified** (1.645 × 4.4 ÷ 3); the ÷ 3 is the study's estimate, RA's side |
| Felt radius 278 mm (thumb), 415 mm (pinky), 224 mm (groove) | **arithmetic verified**; the groove's is built on the wrong stretch (see the rules) |
| The four trials' results (loss, radii, positions) | **reproduced exactly** (`scripts/repro.py`) |
| "The most the outline moves: 0.52 mm" | **verified** (0.515 mm, measured normal to the outline; 0.58 mm measured across the width, at the rear corner) |

### Rules

| Rule | Verdict |
|---|---|
| Strength: pocket stiffness equal to the finger's, κ* = k_tip ÷ N | **Replaced.** Under friction neither stiffness moves a pressed finger. Two strengths have a meaning: felt and catching (section 6) |
| Felt: the arc turns at least 3.44° over the stretch the finger crosses | **Stands in form; the number is a band.** 2.1° to 5.3°, 3.4° the middle. Not measured for a thumb in a grip. Must be scored along each finger's own slide, not from the arc's radius alone |
| Felt, for the grooves: 3.44° over 13.4 mm (contact plus the spread between hands) | **Needs a new number.** One fingertip crosses only its own contact: R ≤ 144 mm (8.6 mm patch) to 172 mm (10.3 mm patch); a still fingerpad's measured limit is R 185 mm |
| "Felt, and no more" (the pull onto the threshold from both sides) | **A design choice, not a finding.** It fixes the radii before the descent starts. Fair for the sides (Brock's eye); for the grooves it flattens the Sora's own R 50 groove fourfold |
| Cover: the waist's chord at least the slide plus the contact patch | **Needs a position check.** It scores length only. In the result the pinky's slide is half off the arc |
| Path: each side valley's bottom anywhere on its finger's slide at no cost | **Stands as Brock's ruling allows, with two notes.** Its 9 mm free band leaves the position to the starting point; and the thumb then grips 7.7 mm behind its valley's bottom |
| One minimum per finger | **Stands.** Counted with a 4 µm tolerance, far finer than touch |
| The ring finger: slope and rate of turn checked on the shoulder | **Not a check as coded.** It reads a corner arc whose curvature the model fixes to the Sora's, so it gives 11.7 °/mm in every trial whatever the shape does 0.5 mm away |
| Normal-mouse bounds (width 60.5 to 70 mm, 2.5 mm under the hump, 2.5 mm from the Sora, 2.0 mm on the section) | **Stand; none is active in the result.** One is missing: a smallest radius |
| Friction "must be in the strength estimate" | **Stands, and goes further than recorded.** Friction is why the pocket cannot hold or move a finger; it is not in the loss at all, and need not be |

---

## 1. What a finger can feel

### What the papers measured

| Paper | Stimulus and touch | Task and criterion | Threshold | Spread between people |
|---|---|---|---|---|
| Gordon & Morison 1982 (P&P 31, 446-450). **Verified**, Tables 1-2 | Convex glass lenses masked to 10 × 20, 30, 40 mm; one fingertip stroked twice across, about 1 s, wrist and fingers moving, talc on the skin | Curved against flat, forced choice; criterion not printed (75 % per Pont 1999) | 0.09 mm high over 20 mm; as height ÷ half length, 0.009 at every length = a 2.06° turn end to end | SD 0.003 on 0.009 at 20 and 40 mm (n = 20 and 6), 0.005 at 30 mm (n = 6): a third to a half |
| Same, Experiment 4 (staircase, 10 × 40 mm) | Spherical and cylindrical lenses | Staircase | Gradient 0.011 (sphere), 0.012 (cylinder): 2.5° and 2.8° | SD about 45 % |
| Pont, Kappers & Koenderink 1999 (P&P 61, 874-894). **Verified**, pp. 884-890 | PVC strips 20 mm wide, arcs up to ±4 /m, convex and concave; index finger swept to and fro twice over 5 to 20 cm, the forearm moving | Which of two is more convex, flat reference; 84 % point | 3.3° to 5.3° of turn, the same at every length | Three subjects, a factor of 1.6 |
| Same, static | Three fingers resting on the strip, about 8 s | Same | 2.8° with one end tilted, 1.6° with both | Three or four subjects |
| Pont, Kappers & Koenderink 1997 (P&P 59, 1225-1240). **Partly** (one reading) | Strips 20 cm long under the still hand, along or across the fingers | 84 % point, about a flat reference | Along the fingers 0.43 to 0.55 /m (the three subjects' means); across them 0.77 to 1.07 /m | Three subjects; single placements from 0.27 to 1.48 /m |
| Goodwin, John & Marceglia 1991 (Exp Brain Res 86, 663-672). **Partly** (abstract) | Spheres pressed on a fingerpad held still | Curved against flat, 75 % | Concave 5.4 /m (R 185 mm); convex 4.9 /m (R 204 mm) | Not in the abstract |
| Louw, Kappers & Koenderink 2000, 2002. **Partly** (abstracts) | Gaussian bumps and dents 0.15 to 240 mm wide, explored freely | Shape against flat | Height from 1 µm to 8 mm, rising as width^1.3 above 1 mm; dents the same as bumps; telling two apart takes two to four times the detection height | Not in the abstracts |
| Wijntjes et al. 2009 (IEEE Trans. Haptics 2). **Partly** (abstract) | A device that sets the surface's height and tilt under a moving finger separately | Curvature discrimination | The tilt under the finger dominates; height adds little | No numbers in the abstract |

Could not be read: the Kappers 2011 review (PubMed Central behind a browser check, Europe PMC rate-limited both times, the
Utrecht copy failed), Kappers & Koenderink 1996, and van der Horst & Kappers. The Kappers 2011 abstract does say that touching
a curved shape leaves an after-effect, strongest straight after contact.

### What they agree on

One rule fits all of them: **a curve is detected when the surface's tilt changes by a couple of degrees across the stretch
the skin crosses.** Height and radius are not the cue (Gordon & Morison; Pont 1997 and 1999; Wijntjes 2009).

- A stroking fingertip, 20 to 40 mm: 2.06° on average at 75 % (Gordon & Morison); Pont et al. convert that to 2.8° at 84 %.
- An index finger swept 5 to 20 cm by the forearm: 3.3° to 5.3° at 84 % (Pont 1999).
- Fingers resting still on a strip: 1.6° to 2.8° at 84 % (Pont 1999).
- One still fingerpad: R 185 mm concave at 75 % (Goodwin). Across a 10 mm contact that is 3.1° (derived), the same size again.

So the study's rule has the right form. Its number, 3.44°, is Gordon & Morison's average plus two standard deviations of
people. Other fair readings of "reliably":

| Reading | Turn | Gentlest R for the 16.7 mm thumb slide |
|---|---|---|
| The average person, 75 % correct (Gordon & Morison) | 2.06° | 464 mm |
| The average person, 84 % (Pont's conversion) | 2.8° | 342 mm |
| Pont's most sensitive subject, 84 % | 3.3° | 290 mm |
| **The study: average + 2 SD of people, 75 %** | **3.44°** | **278 mm** |
| The same moved to 84 % (derived, assumes a straight psychometric line through zero) | 5.1° | 188 mm |
| Pont's least sensitive subject, 84 % | 5.3° | 180 mm |

Derived, `scripts/newton.py`. The slide itself runs 7.2 to 29.5 mm from the 5th to the 95th percentile hand (the hand model),
so across hands and thresholds together the "felt" radius spans about 80 to 820 mm. The Sora's own waist (R 381 mm) turns 2.5°
over the mean thumb slide: above the average threshold, below the study's.

### Does it transfer to a thumb sliding along a mouse's side?

Not established. Nothing found measures it. What differs from the laboratory:

- **The task.** The subjects stroked on purpose, lightly, twice or more, compared against a flat strip a moment earlier, and
  attended to nothing else. As the hand closes on a mouse the thumb slides once, under grip load, with no flat to compare.
- **The digit and the load.** Index fingertip at a light touch (talc in one study) against a thumb pad pressing 0.4 N or more.
- **The reference.** The cue is the surface's tilt relative to the finger. In the laboratory the finger's own attitude is
  steady. In a grip the thumb swings about its base by far more than 3° while it slides.
- **The surface.** Strips curved one way against a flat ground. A mouse's side is also curved top to bottom.
- **Adaptation.** A curve held against the skin leaves an after-effect (Kappers 2011, abstract): what is held for a while
  stops reading as curved. The cue is there when the hand takes hold, not through a long hold.
- In the thumb's favour: it lies along the side over more than a fingertip's length, and resting fingers detect smaller
  turns (1.6° to 2.8°) than sweeping ones.

A mechanical cross-check points the same way. Sliding through a 3.44° turn changes the sideways force on the pad by the press
times 0.060: 0.026 N at a 0.43 N press, against a friction drag of 0.215 N (μ 0.5). That is a 12 % change in drag. People tell
two forces apart at about 7 % (5 to 10 %; Pang, Tan & Durlach 1991, 2.5 to 10 N, one reading). So 3.4° is a
threshold-sized signal by force as well: just noticeable, not obvious.

### Better-founded rules

**(a) A long side arc under a sliding thumb or pinky.** Keep the form. Change three things:

1. Score it along each finger's own slide: the part of the slide that lies on the valley must turn at least α. The code
   scores the arc's radius against the shorter slide and never checks where the arc sits (section 7).
2. Give α as a band, 2.1° to 5.3°, with 3.4° as the working middle, and carry the band into the radius: R 180 to 464 mm for
   the mean slide.
3. Say on the slide that it is a stroking fingertip's figure applied to a gripping thumb.

**(b) A button groove under a fingertip that mostly stays put.** The stretch is the fingertip's own contact, about 8.6 mm at
0.35 N by the study's figure (10.3 mm by measured areas). Two independent limits agree:

- the study's own 3.44° across one contact: R ≤ 144 mm (8.6 mm) to 172 mm (10.3 mm), derived;
- a still fingerpad's measured limit: R ≤ 185 mm concave at 75 % (Goodwin 1991).

The result's groove (R 224 mm, 4.5 /m) fails both: it turns 2.2° across one fingertip. The Sora's own groove (R 50 mm) turns
9.9° and passes three times over.

---

## 2. Friction

### What was read

| Source | Conditions | Coefficient |
|---|---|---|
| Derler & Gerhardt 2012 (review). **Verified** | All skin, all loads | Dry: "greater than 0.2 and typically around 0.5"; wet typically above 1 |
| Same, Sect. 3.2.1 | Fingers on flat surfaces, mostly under 5 N | Dry 0.60 ± 0.38 (median 0.45); moist or wet 1.28 ± 0.67 (median 1.25) |
| Same | Static against sliding | Static 10 to 40 % higher in several studies |
| Same | Roughness of the surface | Dry friction falls as the surface gets rougher, to a minimum near Ra 3 µm, then rises |
| Dzidek et al. 2014 (EuroHaptics). **Verified**, Table 1 | One subject, index finger washed and dried, 0.02 to 2 N, sliding 24 mm/s; F = k W^n | Smooth polypropylene: n 1.10, k 0.43 at first touch; n 0.80, k 1.08 after the skin sweats against it (time constant 16 ± 3 s). Smooth glass: 0.86, 0.34 to 0.63, 1.21 (18 ± 5 s). Polypropylene roughened to Rq 6 µm: n 0.98, k 0.53, no change with time |
| Delhaye, Lefèvre & Thonnard 2014 (J R Soc Interface 11). **Verified**, Table 1 | Four subjects, smooth glass, 0.5, 1, 2 N, natural moisture | Sliding: 1.92 to 2.41 at 0.5 N; 1.60 to 1.92 at 1 N; 1.29 to 1.54 at 2 N. Static 0.31 lower on average |
| Zhang et al. 2017 (as the main film already cites it; not re-read here) | One subject, laser-grooved steel, 0.2 to 1 N | 0.41 to 0.47 along the grooves, 0.50 to 0.53 across |
| Adams et al. 2013 (J R Soc Interface 10). **Partly** (abstract) | Review | On smooth glass friction can rise tenfold in tens of seconds; on paper it falls |

Derived from Dzidek's fits at a 0.4 N press: smooth polypropylene 0.39 at first touch and 1.30 once sweated in; roughened
polypropylene 0.54 throughout.

### What it means for a mouse at 0.2 to 2 N

- **Finish matters more than material.** A matte or textured shell behaves like the roughened plastic: about 0.5 and steady,
  whatever the load and however long the finger has been there. A smooth, glossy shell starts near 0.4 and climbs past 1
  within a minute of contact (time constant 16 to 18 s).
- **Load.** On matte surfaces friction is proportional to the press (n about 1). On smooth ones the coefficient falls as the
  press rises (n 0.6 to 0.8), so the lightest touches grip best.
- **Moisture.** Moist fingers on smooth surfaces: 1.2 to 2.4. A very dry fingertip on a rough surface: down to 0.2.
- **The study's "typically about 0.5".** Right for Theseus's textured coat (the main film's own figure for it is 0.41 to
  0.53). The range "0.2 to 0.5" on the slide is the dry range only. For a smooth shell the range is 0.4 to 1.5 or more.

### What slope a resting fingertip holds

A pressed fingertip stays put on any slope below atan μ (derived): 11.3° at μ 0.2, 22.3° at 0.41, 26.6° at 0.5, 52° at 1.3.
The steepest slope under any resting finger in trial 3 is 2.0° (the 95th percentile thumb). Friction holds it with a margin of
five to twenty-five times.

### Repeated small loads: partial slip and creep

- **Before it slides, the pad shears.** The skin stays stuck while the bone moves 2 mm (along the finger) to 3 mm (across
  it) before full slip; the stuck area shrinks steadily as the sideways force rises, from its edge inward (Delhaye 2014,
  verified). The pad's shear stiffness is about 1 N/mm along the finger and 0.5 N/mm across (Nakazawa 2000, as cited there).
- **So small loads do not move the contact.** A sideways load under the friction limit rocks the finger on its pad and
  returns. Nothing accumulates.
- **Creep needs a slip, and a slip prefers downhill.** On a slope θ the finger slips uphill only above N tan(φ + θ) and
  downhill above N tan(φ − θ), φ = atan μ. Every slip is therefore a little likelier toward the valley's bottom, and a slip
  away from it is stopped once the slope has risen enough. That is the one way a valley gathers a finger over time. Its
  strength is the slope divided by μ: 5 mm up an R 278 arc it is 3.6 % of μ 0.5; 2.4 mm up the Sora's R 50 groove, 10 %.
  (Derived; no measurement of creep on a mouse was found.)
- **Fingers also leave and land again.** In office use 19 to 30 % of people held the index or middle finger off its button
  while the mouse sat still, and 28 to 45 % while moving it (Lee, McLoone & Dennerlein 2008, 100 people observed, one
  reading). A finger that lands again lands where the hand puts it, with no load on it: at its own rest, not at the valley.

---

## 3. Forces

### Johnson et al. 2000, verified

- 16 office workers, a force-sensing Apple mouse of unstated weight, one working day.
- **Sides, regular work: 0.43 N (SD 0.13).** Results text, p. 402. Asked to squeeze as they thought they did: 0.92 N
  (SD 0.35), with almost no correlation (r = 0.16). People overestimate their own grip twofold.
- **Button, regular work: 0.35 N (SD 0.06) mean, 1.41 N (SD 0.24) mean peak.** Table 2. The table's text is scrambled in
  the PDF, so the column was identified by a check: the same column's task rows (dragging 0.90, pointing 0.30, text editing
  0.63) differ from 0.35 by 0.55, 0.05 and 0.28, the centres of the confidence intervals printed second in each row.
- Strongest squeeze: 79.5 N (sides), 52.8 N (button). The working forces are 0.5 to 0.8 % of that.
- **The discrepancy stands as recorded.** The PDF's abstract attaches 0.35 N to the sides and 0.43 N to the button. The
  journal's web page has them the other way, matching the results text. The study's use (0.43 sides, 0.35 button) is right.
- Office work only. Nothing on lifting, fast swipes or games.

### Other measurements

None usable. What was found and read:

- Sanchis-Sanchis et al. 2024 (Applied Sciences 14, 7112): 22 players, palm, claw and fingertip grips, a 90 g mouse tracked
  by cameras. Grip type changed neither score nor kinematics. No forces. Mean speeds only (0.03 m/s over a minute, filtered
  at 6 Hz), so no peaks.
- Tang 2023 (icSPORTS): 16 e-sport players, five Zowie shapes, finger pressure sensors worn but no force reported.
- de Haan et al. 2000 (Measuring Behavior): a "squeeze mouse" that could not be calibrated to newtons.
- Donovan et al. 2022 (Frontiers Hum. Neurosci.): 32 professional players, crosshair kinematics only.
- Hiramatsu et al. 2015 (PLoS ONE, abstract): holding objects of 6 to 200 g in a precision grip, grip force follows the load
  down to about 30 g and then stops falling; below 30 g the grip-to-load ratio climbs. Theseus's weight is just under that
  line: its grip is set by how lightly a hand can hold at all, not by its weight.
- One measured hand speed: a TechPowerUp reviewer reached 4.5 m/s on a Cooler Master MM711 (one reading). Sensor ratings
  (10 m/s, 50 to 88 g) are limits of the sensor, not of the hand.

### Newton's laws for Theseus (derived, `scripts/newton.py`)

Theseus's weight with the coat is 27.95 g, 0.274 N.

**Lifting.** Held between two opposed pads, each must squeeze P = W (1 + a ÷ g) ÷ (2 tan(φ + β)), with φ = atan μ, a the
upward acceleration and β any inward lean of the walls toward the base.

| μ | Holding still | Snatched up at 1 g | Holding, walls leaning in 5° | 10° |
|---|---|---|---|---|
| 0.2 (driest skin) | 0.69 N | 1.37 N | 0.47 N | 0.35 N |
| 0.41 (textured coat, along its ridges) | 0.33 N | 0.67 N | 0.27 N | 0.22 N |
| 0.5 (matte plastic) | 0.27 N | 0.55 N | 0.22 N | 0.19 N |
| 1.3 (smooth plastic, sweated in) | 0.11 N | 0.21 N | 0.09 N | 0.07 N |

The ordinary office squeeze (0.43 N) already holds Theseus's weight with a margin of 1.6 at μ 0.5. It would not at μ 0.2.

**Swiping.** The force is F = m a. Sideways, the wall on the pushing side carries it directly and friction is not needed.
Fore and aft it goes through friction at the sides: P = m a ÷ (2 μ) a side, less whatever the fingertips on the buttons add
(up to 2 × μ × 0.35 N).

| Movement | Acceleration (derived) | F = m a | Squeeze a side at μ 0.2 / 0.41 / 0.5 / 1.3 |
|---|---|---|---|
| Aiming flick, 5 cm in 0.1 s | 29 m/s², 2.9 g | 0.81 N | 2.0 / 0.98 / 0.81 / 0.31 N |
| Fast flick, 10 cm in 0.1 s | 58 m/s², 5.9 g | 1.61 N | 4.0 / 2.0 / 1.6 / 0.62 N |
| All-out swipe, 4.5 m/s reached over 12.5 cm | 81 m/s², 8.3 g | 2.26 N | 5.7 / 2.8 / 2.3 / 0.87 N |

The accelerations are kinematics, not measurements: the smoothest path between two points peaks at 5.77 × distance ÷ time²,
and the swipe assumes steady acceleration to the one measured speed.

**Help from the shell's shape.** A slope θ under a pad, facing the load, multiplies what friction carries by
tan(φ + θ) ÷ tan φ (μ 0.5):

| Slope under the pad | Against the load | With it |
|---|---|---|
| 1.6° (trial 3's thumb at rest) | +7 % | −7 % |
| 2.1° (the Sora's thumb at rest) | +9 % | −9 % |
| 4° | +18 % | −17 % |
| 10° | +48 % | −41 % |

Three things follow. A valley's curvature gives a finger sitting at its bottom no help at all, because the slope there is
zero. What helps is a slope under the finger facing the load, and it costs as much in the other direction. And a waist is
curved in the top view, so it does nothing for lifting, which needs walls that lean in toward the base.

---

## 4. The finger as a spring

### What was read

| Source | What it measured | Figure |
|---|---|---|
| Shi et al. 2020. **Verified** | Index knuckle, flexion and extension, relaxed, slow steps with 30 s holds; four men | 0.0377, 0.0328, 0.0466, 0.0393 N m/rad (mean 0.0391) |
| Same, Table 4 (their estimates from the older papers) | Same joint, between straight and the resting angle | Kuo & Deshpande 2012: 0.016 to 0.210 (n = 10). Esteki & Mansour 1996: 0.025 to 0.058 (n = 3) |
| Kuo & Deshpande 2012. **Partly** (abstract) | Where the stiffness comes from | The capsule and ligaments do more than half the passive work at every angle; the long muscles do most of the rest |
| Milner & Franklin 1998. **Partly** (text; the tables could not be read) | Index fingertip, flexion plane only, pushed 4 mm in 50 ms, force read 130 to 150 ms later | 9.7 N/cm (SD 1.9) at about 10 N of fingertip force; at 20 % of full effort the stiffest direction is two to four times the relaxed finger's |
| Hajian & Howe 1997. **Partly** (abstract) | Index fingertip, extension (2 to 20 N) and sideways (2 to 8 N), fast taps | Stiffness rises in proportion to the force; no figures in the abstract |
| Nakazawa et al. 2000, as cited by Delhaye 2014. **Partly** | The fingertip pad in shear | About 1 N/mm along the finger, 0.5 N/mm across |

Not found for a living hand: the knuckle's side-to-side stiffness when relaxed, and any stiffness of the thumb's joints
(Domalain et al. 2010 on the thumb's base was blocked; Werner et al. 2003 is a cadaver study and only its title could be
read). Esteki & Mansour 1996 and Kamper's papers were not read; their figures here are Shi's.

### The fingertip's stiffness (derived, `scripts/newton.py`)

Slowly, relaxed, from the knuckle alone: k = K ÷ r², with r the distance from the knuckle's axis to the tip.

| Finger, direction | Lever | Stiffness | Range across Shi's four men | Range across the literature |
|---|---|---|---|---|
| Index, in its own plane (curling) | 78.5 mm (knuckle to tip) | 0.0064 N/mm | 0.0053 to 0.0076 | 0.0026 to 0.034 |
| Index, sideways across the button | 55.3 mm (reach along the hand) | 0.0128 N/mm | 0.0107 to 0.0152 | 0.0052 to 0.069 |
| Middle, sideways | 58.2 mm | 0.0116 N/mm | 0.0097 to 0.0138 | 0.0047 to 0.062 |
| Little, in its own plane (along the side) | 65.1 mm | 0.0092 N/mm | 0.0077 to 0.0110 | 0.0038 to 0.050 |

- **The sideways rows assume the knuckle is as stiff sideways as in curling.** No figure for a living hand was found. The
  assumption stays an assumption. It matters less than it looks, because the result no longer uses it (section 6).
- **The thumb** is given the little finger's row in the study, an estimate with no source.
- **These are slow, resting figures.** They say how hard a finger pulls back toward its rest over seconds: about 0.01 N for
  each millimetre. Against a quick push the finger is far stiffer: 9.7 N/cm at a 10 N press (Milner & Franklin), and the pad
  itself 0.5 to 1 N/mm in shear. So there are three springs in series and in time: the pad (stiff, always), the muscles
  (stiff when working, in proportion to force), and the resting joint (40 to 150 times softer than the pad).

---

## 5. What contours do for a hand

### What was read

- **Handles, guideline.** NIOSH and Cal/OSHA 2004 (publication 2004-164), tip 6, p. 9, and checklist item 6, p. 14: choose a
  tool "without sharp edges or finger grooves on the handle". The guide gives no reason beside its definition of contact
  pressure (p. 2). One reading.
- **Handles, experiment.** Harih & Dolšak 2014 (Applied Ergonomics 45; abstract): handles shaped from a model of each
  subject's own hand in a power grasp were rated considerably more comfortable than cylinders on almost every measure, by
  ten subjects. So a contour that fits the hand it was made for helps; the guideline is about contours that do not.
- **Handles, size.** Kong & Lowe 2005 (Int. J. Ind. Ergonomics 35): the comfortable cylinder is 23 % of hand length across
  (37 to 44 mm for women, 41 to 48 mm for men). Fit scales with the hand. Cylinders only; no grooves tested.
- **Mice, whole form.** Odell & Johnson 2015 (Work 52; one reading): 12 users, five mouse bodies. A taller, angled top cut
  forearm twist by 13° and sideways wrist bend by 7°, with no loss of pointing speed; people still ranked the flat, familiar
  mouse first.
- **Mice, hump.** Tang 2023 (icSPORTS, a four-page paper with inconsistencies between its abstract and results): 16
  players, five Zowie shapes differing in hump height and place. Click rate the same; wrist angle and forearm muscle
  activity differed after a 30 s burst. No side curvature, no grooves, no hand-size analysis.
- **Mice, grip.** Sanchis-Sanchis et al. 2024: grip type changed neither score nor kinematics on one fixed shape.

### What was not found

No study that varies a mouse's side curvature, pocket depth or groove depth and measures force, pressure, muscle activity,
performance or preference. No pressure maps of a hand on a mouse with numbers. The previous record's "no direct source"
stands, for contours as for the thumb's slide.

### Gentle and long, or deep and short?

The evidence does not answer it directly. Three things point the way Brock's eye does:

1. The one experiment that found contours better used contours made for each hand. A fixed shape is a misfit for most
   hands, and the guideline against finger grooves is the practical form of that.
2. The price of a misfit is the slope under the finger, the misfit divided by the radius. A fingertip 10 mm off the bottom
   of an R 278 arc sits on 2°. On an R 47 arc it sits on 12°, right at the friction angle of the driest skin (derived,
   section 6). Gentle arcs forgive hand size; tight ones do not.
3. A short pocket has rims. A finger that misses sits on a ridge, which is the "pressure from the raised edges" that the
   guidelines warn of, and it is a second dip in Brock's sense.

Against that: a gentle arc buys nothing mechanical (section 6). So the honest summary is that gentle, long pockets are the
safe choice across hand sizes, and that no measurement shows they are better for the hand they fit.

---

## 6. What "optimal gradient strength" should mean

### The analysis

One finger, one direction s along the surface (along a side, or across a button). The surface's height above its own
chord is h(s): slope h′ (the tangent of θ), curvature κ = 1 ÷ R. The finger presses with N square to the chord. Friction
is μ, with φ = atan μ. The relaxed finger's tip is tied to its rest s_r by its slow spring k.

Three forces act along s on the tip:

- the slope: N h′(s), toward lower ground;
- the finger's spring: k (s − s_r), toward its rest;
- friction: whatever is needed to cancel the other two, up to μN.

**When friction holds.** The tip stays where it is while

    | h′(s) + (k ÷ N)(s − s_r) |  ≤  μ.

On a slope alone it holds below θ = φ: 11° to 27° dry, 52° on smooth plastic sweated in. In a valley with its bottom at s_v,
h′ = κ (s − s_v). The two springs would balance at

    s* = (Nκ s_v + k s_r) ÷ (Nκ + k),

and friction holds the tip anywhere within μN ÷ (Nκ + k) of s*.

**When a slope moves a finger.** Only when it beats friction: θ above φ. The slope's push and friction both scale with the
press, so pressing harder or lighter changes nothing. No arc in this study comes near.

**When the finger's own spring moves it.** Only when the press is light: N below k × (the offset) ÷ μ. For a tip 10 mm
from its rest that is 0.18 N at μ 0.5 (0.46 N at μ 0.2). So a finger creeps home when it barely touches. The pocket never
gets that chance, because its push fades with the press exactly as friction does.

### Worked example with Theseus's numbers (derived, `scripts/newton.py`)

Press 0.43 N on a side (0.35 N on a button); spring 0.0092 N/mm (0.0128 across a button).

| Pocket | Pocket's pull, N per mm off the bottom | Finger's pull, N per mm off its rest | Ratio | Friction available at μ 0.2 / 0.5 / 1.3 | Tip held within, at μ 0.2 / 0.5 / 1.3 |
|---|---|---|---|---|---|
| Side arc, the result (R 278) | 0.0015 | 0.0092 | 0.17 | 0.09 / 0.22 / 0.56 N | ±8 / 20 / 52 mm |
| Side arc, the Sora (R 381) | 0.0011 | 0.0092 | 0.12 | same | ±8 / 21 / 54 mm |
| Side arc, first estimate (R 47) | 0.0092 | 0.0092 | 1.00 | same | ±5 / 12 / 30 mm |
| Groove, the result (R 224) | 0.0016 | 0.0128 | 0.12 | 0.07 / 0.18 / 0.46 N | ±5 / 12 / 32 mm |
| Groove, the Sora (R 50) | 0.0070 | 0.0128 | 0.55 | same | ±4 / 9 / 23 mm |
| Groove, first estimate (R 29) | 0.0122 | 0.0128 | 0.95 | same | ±3 / 7 / 18 mm |

A pressed fingertip in trial 3 stays where it lands anywhere within 20 mm of balance (μ 0.5). The pocket pulls a sixth as
hard as the finger's own spring. Ten millimetres off, the pocket pulls with 0.016 N and the finger with 0.09 N, against the
0.22 N friction can hold. Even the first estimate's pocket, built to match the finger, could not move a finger 12 mm off.

### What a pocket's curvature does that friction does not

| What | Formula | Result (R 278 sides, R 224 grooves) | A tight pocket (R 50) |
|---|---|---|---|
| **Is felt** when the finger slides | turn = stretch ÷ R | 3.4° over the thumb's 17 mm; 2.2° across one fingertip in the groove | 9.9° across one fingertip |
| The same as a force: drag changes by | turn ÷ μ | 12 % at μ 0.5 (5 % at 1.3) | — |
| **Catches** a slipping finger: it travels | R × (atan(1.1 μ) − atan μ) for a load 10 % over its friction | 11 mm (26 mm for 25 % over) | 2.0 mm (4.8 mm) |
| **Gathers** the finger over many slips: uphill and downhill limits differ by | ±(offset ÷ R) ÷ μ | ±3.6 % at 5 mm off | ±20 % at 5 mm off |
| **Seats** the mouse: pads behind the bottom push it back into the palm with | P × offset ÷ R each | 0.012 N for the thumb 7.7 mm behind | — |
| **Spreads pressure**: the contact grows about as | (1 − r_pad ÷ R)^(−2/3), r_pad about 10 mm (an estimate) | +3 % | +16 % |

Being felt is the only one of these a gentle arc delivers. Catching, gathering and spreading all need a radius several
times tighter than any side arc Brock would accept.

### What gets worse as the gradient grows

| What | Formula | Result | First estimate (R 47, R 29) |
|---|---|---|---|
| **Hands of other sizes.** A finger resting e from the bottom sits on a slope e ÷ R and spends (e ÷ R) ÷ μ of its friction staying there | — | 95th percentile thumb, 9.9 mm off: 2.0°, 7 % of its friction at μ 0.5, 18 % at μ 0.2 | 12°: 42 % at μ 0.5, and over 100 % at μ 0.2 (it slides) |
| The same, across a groove (2.4 mm sideways spread between hands) | — | 0.6°, 2 % | 4.8°, 17 % (42 % at μ 0.2) |
| **Depth**, so the look | c² ÷ 8R over a chord c | 0.78 mm over 41.5 mm | 4.9 mm over 41.5 mm; 10.9 mm over 60 mm |
| **Help turns into hindrance**: a slope that helps one way costs the other | tan(φ ± θ) | ±7 % | ±40 % |

### So what should "optimal" mean

There is no balance of forces to find. The first estimate looked for one (pocket stiffness equal to finger stiffness) and
the worked example shows why it means nothing: friction holds the finger wherever the two would balance, and well to
either side.

What the physics gives is two thresholds on one axis, and two bounds:

| | Meaning | Formula | Sides (thumb's 16.7 mm slide; e = 9.9 mm) | Grooves (one fingertip's 8.6 mm; e = 2.4 mm) |
|---|---|---|---|---|
| **Felt** | The gentlest arc a sliding (or resting) finger detects | R_felt = stretch ÷ α | 278 mm at 3.44° (180 to 464 across the band) | 144 mm (185 mm measured on a still pad) |
| **Catching** | The gentlest arc that stops a slip within the pad's own half-width | R_catch = (pad ÷ 2) ÷ (atan(1.1 μ) − atan μ) | about 115 mm (10 % overload, μ 0.5) | about 110 mm |
| **Held for every hand** | The tightest arc on which no resting finger spends more than a share X of its friction | R_hold = e ÷ (X μ) | 198 mm at X 10 %, μ 0.5; 99 mm at 20 %; 50 mm is the hard limit (X 100 %, μ 0.2) | 48 mm at 10 %; 12 mm hard limit |
| **Normal** | No deeper than normal mice | below the hump ≤ 2.5 mm; within 2.5 mm of the Sora | reached near R 115 mm with the stock waist (sensitivity run), or at once if the waist must cover both slides | not binding |

- **For the sides** the window between "felt" and the bounds is narrow or empty. Felt needs R ≤ 278 (or ≤ 188 by the
  stricter reading); every hand held within a tenth of its friction needs R ≥ 198. A side pocket that also catches (R 115)
  would cost the 95th percentile thumb 17 % of its friction at μ 0.5 and sit at the normal-mouse limit. So on the sides the
  only strength on offer is "felt", and "the gentlest arc that is felt" is the right rule. It stands. It is a choice of the
  weaker of two meaningful strengths, forced by the normal-mouse rule, not an optimum the forces pick.
- **For the grooves** the window is wide: from R 48 mm (or 12) up to R 144 to 185 mm. The Sora's own groove (R 50) sits at
  the strong end: felt three times over, and it stops a slip in 2 mm. The result's R 224 is outside the window on the weak
  side. Nothing in the physics says to flatten a groove to the edge of feeling; the "felt, and no more" pull does that.
- **An interior optimum needs one number nobody has measured:** how much of its friction (grip) a player will give up for
  a firmer pocket, the X above. With it, the strength is R = e ÷ (X μ), set by the hand-size spread and friction, and
  checked against felt. Without it, the honest output is the window and the price of each point in it, which the tables
  above give.

### The rules, one by one

| Rule | Verdict | Why, and what to do |
|---|---|---|
| **Strength** (κ* = k_tip ÷ N; R 47 sides, R 29 grooves) | **Replace** | Recomputed exactly (46.66 and 28.75 mm). But it balances two forces that friction dwarfs, it equates two normalised costs with no reason for equal weight, its stiffness is one joint in one direction (sideways assumed), and its press is an office average. Replace with the two thresholds and two bounds above. Keep it on the slide only as the first estimate that Brock's eye rejected |
| **Felt** (turn ≥ 3.44° over the slide) | **Stands; new framing; score it on the path** | Form supported by four papers. Number: the middle of 2.1° to 5.3°. Transfer to a gripping thumb unmeasured. As coded it is satisfied by the arc's radius alone (section 7) |
| **Felt for the grooves** (3.44° over 13.4 mm) | **New number** | Count one fingertip's own contact: R ≤ 144 mm. Goodwin's still-fingerpad limit, R 185 mm, is the cross-check |
| **Cover** (chord ≥ slide + contact) | **Stands in intent; add position** | The arc must lie under the slide, not merely be as long. Whether it can for both fingers on a mirrored shell is section 8's variant D |
| **Path** (bottom anywhere on the slide at no cost) | **Stands, with its consequences stated** | Start-dependent within a 9 mm band; the thumb grips 5.5 to 9.9 mm behind the bottom on a 1.1° to 2.0° slope. Write the tie-break down (the variant's small pull toward the grip rests gives z 3.7 from any start) |
| **One minimum per finger** | **Stands** | A geometric rule and Brock's ruling. A second dip is a second landmark and, if tight, a ridge |
| **Normal-mouse bounds** | **Stand; add one** | None binds in the result. Add a smallest radius (the Sora's own shoulder corner, 4.9 mm), or the crease returns |
| **Symmetry, the average hand, true scale** | Brock's rulings | Not judged here. Their cost is stated: the mirrored waist cannot sit under both fingers' rests (they are 7.7 mm apart) nor under both slides |

### A better-founded objective, precisely

For each pocket i (two sides, the grooves), with ℓ_i the stretch its finger crosses on the valley, e_i the farthest any
5th-to-95th-percentile finger rests from its bottom, and a_i the contact's half-width:

1. **Place** the bottom at the finger's grip rest; on a mirrored shell, at the point on both slides nearest both rests.
2. **Felt**, a floor: κ_i × ℓ_i ≥ α, where ℓ_i is measured on the finished shape as the length of the finger's slide that
   lies on the concave arc (sides), or the contact patch (grooves). α = 0.060 rad, reported with its band 0.036 to 0.092.
3. **Held for every hand**, a ceiling: κ_i × e_i ≤ X μ. μ = 0.5 for Theseus's coat (0.41 to 0.53); X is the designer's
   number until measured; X = 0.1 is used in the tables.
4. **Normal**, ceilings: the existing bounds, plus no radius under the Sora's own tightest (4.9 mm) on the button's top.
5. **Inside the window**, the declared choice: the gentlest (κ_i at its floor) for the sides; for the grooves either the
   Sora's own, or the catching strength κ_i = (atan(1.1 μ) − atan μ) ÷ a_i, whichever Brock prefers by eye.
6. **Report with every result** the three prices: the turn on each finger's own slide, the catch distance, and the share of
   friction the least-fitting hand spends.

Steps 1, 2, 4 and the gentlest choice are implemented in `model/longarcs_v.py` (options `rest_tie`, `groove_zone='pad'`,
`cover_path`, `rmin`). Step 3 is a one-line bound that the gentlest choice never reaches.

---

## 7. Audit of the optimisation

### Reproduction

`scripts/repro.py` reran the four trials from a byte-for-byte copy of the code, one at a time.

| Trial | Loss, rerun | Loss, stored | Lowest at step | Largest difference in any final parameter |
|---|---|---|---|---|
| 1, palm on the hump, mirrored | 51.611177 | 51.611177 | 500 of 500 | 0 |
| 2, palm on the hump, apart | 51.592973 | 51.592973 | 498 | 0 |
| 3, palm lifted, mirrored | 0.041675 | 0.041675 | 500 | 0 |
| 4, palm lifted, apart | 0.036297 | 0.036297 | 321 | 0 |

`strength.py` gives R 46.66 and 28.75 mm, as recorded. The Sora's own arcs rebuild the Sora to 0.01 mm.

### The loss, term by term (trial 3)

| Term | Definition | Weight | At the start | At the end |
|---|---|---|---|---|
| level | (mm off each finger's slide ÷ 2)², plus (groove bottom − 16 mm)² | 1 | 3.95 | 0.00004 |
| reach | index and middle tips past z 48 | 1 | 0 | 0 |
| felt | 4 × (shortfall of curvature below the felt value, as a fraction)², each arc | **25** | 0.584 (14.6 weighted) | 0 |
| gentle | 0.25 × (difference from the felt value, as a fraction)², each arc, **both ways** | 1 | 0.040 | 0.000001 |
| cover | (shortfall of the waist's chord below slide + contact ÷ 2)² | 1 | 0 | 0 |
| one_min | (minima − 1)² per finger; ring: minima² | 2 | 0 | 0 |
| normal | depth under the hump over 2.5 mm, width outside 60.5 to 70, over 2.5 mm from the Sora, over 2 mm on the section | 1 | 0 | 0 |
| closure | 100 × (gaps where the arcs fail to meet)² | 1 | **14.49** | 0 |
| base | 0.01 × (each parameter's move from the start, in its own unit)² | 1 | 0 | 0.031 |
| stay | 0.1 × mean square distance from the Sora's outline | 1 | 0.033 | 0.011 |
| **Total** | | | **33.12** | **0.0417** |

Findings:

1. **The radii are inputs, not outputs.** "felt" pushes each arc up to its felt curvature; "gentle" pulls it back down to
   the same value; base and stay pull toward the Sora's gentler arc. The only resting point is the felt value itself. The
   result's waist is R 278.15 against the rule's 278.19; the groove 223.7 against 224.1. Switching "gentle" off changes
   nothing (R 274.9 against 275.7 at 300 steps): starting from the Sora's gentler waist, the felt term alone lands on the
   threshold. So "the descent found R 278" should read "the felt rule says R 278 and the descent complied".
2. **44 % of the starting loss is the model's own start not closing.** The starting groove (20 mm long, 0.25 mm deep, at
   x 16: a designer's guess, not the Sora's 8 mm groove) cannot reach the side wall, and the closure term charges 14.49 for
   it. Another 44 % is the felt term at weight 25. The "33 to 0.04" on the slide is mostly the start repairing itself and
   the arcs being moved onto the rule.
3. **Friction is not in the loss.** μ appears only in a caption. Nor are the press, the finger's stiffness or any force.
   That is consistent with section 6 (they should not set the strength), but the slides' "Newtonian" framing describes the
   argument around the loss, not the loss.
4. **The felt and cover rules never look at where the arc is.** Felt uses the waist's radius against the shorter of the
   two slides. Cover uses the chord's length. Neither checks that a finger's slide lies on the arc.
5. **The ring finger's check cannot fail.** It reads the curvature at x 28.5 mm, which lies on the shoulder corner arc,
   and the model fixes that arc's curvature to the Sora's. It returns 11.7 °/mm for every trial and every step.
6. **No smallest radius.** The earlier notch model had one (2 mm on the section, 5 mm in the top view). The long-arc model
   dropped it.

### The optimiser

- Adam, rates 0.9 and 0.999, step 0.05, gradients by central differences (±0.002 in each parameter's own unit), 500 steps,
  the lowest point kept. That is what the slide's source line says.
- **It does not stop "where nothing improves".** Trial 3's lowest point is its last step; the loss is still falling by
  0.0000025 a step. See the 1,500-step run below for what is left.
- **Parameters:** 14 (9 free when mirrored). Each is scaled by a hand-set unit (8 mm for a chord, 0.4 mm for a depth,
  0.08 mm for the groove's depth and so on). The "light pull to the start" is light or heavy according to those units.
- **500 steps is enough only when the rules ask for little.** Stock trial 3 run to 1,500 steps: loss 0.0406 (lowest at step
  1,414) against 0.0417; the waist unchanged (R 278.1, chord 41.6 mm, depth 0.777 mm, narrowest at z 3.85). The button's top
  is still moving: the shoulder crease is 1.16 mm at R 2.0 where it was 0.63 mm at R 1.35, and the section is 0.51 mm from the
  Sora's where it was 0.43. With the stricter 5.1° threshold the waist was still 8 % tighter than its rule at step 500
  (R 172.6 against 187.6) and reached it by step 1,500 (R 186.7).

### How far trial 3 is from the untouched Sora V2 (`scripts/audit_geometry.py`)

| | Sora V2 | Trial 3 | Change |
|---|---|---|---|
| Waist arc: radius | 381.2 mm | 278.2 mm | −27 % |
| Waist arc: chord, depth over it | 43.9 mm, 0.63 mm | 41.5 mm, 0.78 mm | −2.4 mm, +0.14 mm |
| Waist arc: from, to | z −22.9 to 21.0 | z −25.7 to 15.8 | 5 mm further back at the front |
| Narrowest point | z 10.1 | z 3.9 | 6.3 mm back |
| Side under the hump | 1.56 mm | 1.72 mm | +0.15 mm |
| Front rise from the narrowest point | 0.25 mm | 0.48 mm | +0.23 mm |
| Width at the rear, z −40 | 57.17 mm | 58.25 mm | **+1.08 mm** |
| Width at the hump, z −26 | 62.88 mm | 62.56 mm | −0.32 mm |
| Width at z 3.9 | 59.86 mm | 59.36 mm | −0.50 mm |
| Width at the front crest, z 26 | 60.25 mm | 60.33 mm | +0.08 mm |
| Hump arc, rear corner arc | 26.4 mm and 25.5 mm | **3.1 mm** and 46.3 mm | the hump arc all but gone |
| Groove arc: radius, length | 50.1 mm, 8.0 mm | 223.7 mm, 21.2 mm | 4.5 times gentler, 2.7 times longer |
| Groove: depth against the button's chord | 0.336 mm | 0.230 mm | **−0.11 mm, shallower** |
| Groove: lowest point | x 15.57 | x 16.00 | 0.43 mm outward |
| Shoulder arc beside the groove | 7.3 mm at R 104 | **0.63 mm at R 1.35** | a crease |
| Button top, x 20 to 24 | — | 0.35 to 0.43 mm lower | |

Half-width, trial 3 minus Sora, along the side (mm):

| z | −45 | −40 | −30 | −26 | −20 | −10 | −3.8 | 0 | 3.9 | 10.1 | 20 | 26 | 35 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| | +0.58 | +0.54 | +0.14 | −0.16 | −0.37 | −0.39 | −0.35 | −0.31 | −0.25 | −0.13 | +0.07 | +0.04 | +0.01 |

- The largest move, 0.58 mm a side, is at the rear corner (z −44). No rule asks for it: it is how the hump and corner arcs
  close the outline after the waist moves. The slide's 0.52 mm is the same thing measured square to the outline.
- Where the fingers are, the side moves in by 0.25 to 0.39 mm.
- The grooves end up shallower than the Sora's own.

### The turn along each finger's own slide

The felt rule as written, measured on the finished shapes (net turn, then total turning, in degrees):

| Shape | Thumb, 5th | Thumb, mean hand | Thumb, 95th | Pinky, 5th | Pinky, mean hand | Pinky, 95th |
|---|---|---|---|---|---|---|
| Sora V2 | 1.07 | 2.50 | 3.44 (4.68) | 2.20 | 0.59 (4.54) | −1.96 (7.77) |
| Trial 3 | 1.47 | **3.42** | 2.69 (6.28) | 0.83 (3.15) | **−0.60 (5.49)** | −2.80 (8.62) |
| Trial 4 | 1.47 | 1.55 (3.27) | 0.14 (5.60) | 0.36 (2.31) | −0.93 (4.20) | −2.86 (6.76) |

- The mean hand's thumb gets its 3.4° in trial 3. That is the one cell the rule guarantees.
- The pinky's slide (z 28.8 back to 3.9) starts on the front arc, which is convex, and reaches the waist arc at z 15.8.
  It crosses 2.5° of valley after 3.1° of crest: a net turn of −0.6°. Only 12 of its 25 mm are on the valley.
- The 5th percentile hand's thumb slides 7.2 mm and gets 1.5°. Brock's ruling for the average hand accepts that.
- Trial 4's mean-hand thumb gets 1.55° net: its valley's bottom is at the thumb's grip rest, the rear end of the slide, and
  the arc ends 12 mm ahead.

### Under each finger at rest in the grip (palm lifted)

| Shape | Thumb: distance from the bottom, slope | Pinky |
|---|---|---|
| Sora V2 | 13.9 mm behind, 2.1° (11.8 to 16.2 mm, 5th to 95th) | 6.3 mm behind, 0.9° |
| Trial 3 | **7.7 mm behind, 1.6°** (5.5 to 9.9 mm; 1.1° to 2.0°) | at the bottom, 0° (±2.2 mm) |
| Trial 4 | 0.3 mm behind, 0.1° | 1.0 mm behind, 0.1° |

Trial 3 halves the thumb's distance from its valley and puts the pinky on its. The thumb still does not rest in a minimum;
it rests on the valley's rear wall. Only trial 4, which Brock rejected as lopsided, puts both fingers in theirs. These
positions are the hand model's (RA).

### What moves the result (stock rules, trial 3; `scripts/variants.py`, 300 steps unless said)

| Input changed | Range tried | Waist R | Waist depth over its chord | Narrowest point | Groove R |
|---|---|---|---|---|---|
| Nothing (300 steps) | — | 275.7 | 0.78 mm | z 3.85 | 223.8 |
| Start 8 mm further forward | | 262.3 | 0.80 | **z 6.33** | 223.8 |
| Start 16 mm further forward | | 256.8 | 0.80 | **z 11.42** | 223.8 |
| Start 8 mm further back | | 278.2 | 0.67 | z 3.84 | 223.8 |
| "gentle" switched off | | 274.9 | 0.78 | z 3.85 | 224.0 |
| base and stay switched off | | 272.7 | 0.79 | z 3.94 | 223.9 |
| Felt turn 2.06° (the average person) | | **434.5** | 0.58 | z 5.19 | **345.6** |
| Felt turn 5.3° (Pont's least sensitive) | | **167.6** | 0.97 | z 3.85 | **138.1** |
| Slides of the 5th percentile hand (7.2, 14.7 mm) | | **115.0** | 1.08 | z 4.06 | 223.8 |
| Slides of the 95th percentile hand (29.5, 38.4 mm) | | **466.4** | 0.63 | z 5.76 | 223.9 |
| Friction μ | 0.2 to 1.3 | no effect: not in the loss | | | |
| Press on the sides and buttons | 0.35 to 0.92 N | only through the contact patch in the cover rule | | | |
| Knuckle stiffness | 0.016 to 0.21 N m/rad | no effect: the long-arc model does not use it | | | |

- **The radius follows its two inputs one for one**: the slide (a factor of 4 across hands) and the threshold (a factor of
  2.6 across the measured band). The 5th percentile run reaches the 2.5 mm normal-mouse bound.
- **The narrowest point's place is the start's.** Anywhere from z 3.9 to 12.9 costs nothing, so it stays near where it
  began: z 3.85, 6.3 or 11.4 according to the start.
- **The weights hardly matter**, because nothing competes: every rule can be met at once.

### Where the slides say more than the code does

| Slide | Says | The code |
|---|---|---|
| gd_descent | "It stops where nothing improves" | Stops at 500 steps; trial 3 is still falling slowly |
| gd_descent | "Descent starts from the Sora's waist" | From the Sora's waist slid 10 mm back, and from a groove that is not the Sora's |
| gd_number | Loss from 33.12 to 0.04 | 14.5 of the 33 is the starting section failing to close |
| gd_landscape | "Normals turn 3.4° across the 13 mm where fingertips land" | 13 mm is one contact plus the spread between hands; across one fingertip the turn is 2.2° |
| gd_landscape | "Ring: 11.7 °/mm ... In the 6 to 22 °/mm band" | A fixed number; 0.5 mm inboard the shape turns at 42 °/mm |
| gd_trials | "Felt: each waist turns 3.4° over the slide" | True of the mean thumb. The pinky's slide nets −0.6° |
| gd_after | "Every curve now has a reason ... and nothing anywhere else" | The largest change is at the rear corner, with no reason; the crease has none either |
| gd_after | "a valley under each finger" | The thumb grips 7.7 mm behind its valley's bottom |
| gd_strength | "the gentlest arc a fingertip reliably feels is R 278 mm" | A stroking fingertip's figure with a population margin, applied to a gripping thumb |

---

## 8. The rerun with the corrections

`model/longarcs_v.py`, run by `scripts/variants.py`. Variant **A** applies the corrections that follow from sections 1 and
7 and changes nothing else:

- the groove's turn counted across one fingertip's own contact (8.62 mm), with Goodwin's still-touch limit as a floor;
- no arc of the button's top tighter than the Sora's own shoulder corner (4.88 mm);
- the path rule's tie-break written down (a small pull of the bottom toward the two grip rests).

### Trial 3, before and after

| | Stock (the deck) | **A: corrected rules** | C: A, grooves kept the Sora's | B: A at the stricter 5.1° (1,500 steps) | D: A, waist under both slides | D2: as D, started 12 mm further forward |
|---|---|---|---|---|---|---|
| Waist radius | 278.2 mm | **277.6** | 277.6 | 186.7 | 278.8 | 278.6 |
| Waist chord | 41.5 mm | **41.2** | 41.2 | 35.7 | **63.8** | **54.1** |
| Waist depth over its chord | 0.775 mm | **0.765** | 0.765 | 0.854 | **1.833** | **1.316** |
| Narrowest point | z 3.86 | **z 3.71** | z 3.71 | z 3.71 | z 6.0 | z 6.3 |
| Waist arc from, to | z −25.7 to 15.8 | −25.5 to 15.7 | same | −20.0 to 15.7 | **−30.6 to 33.2** | **−20.8 to 33.2** |
| Side under the hump | 1.72 mm | **1.71** | 1.71 | 1.90 | **2.50** (the limit) | 1.96 |
| Front rise | 0.48 mm | 0.48 | 0.48 | 0.79 | **1.57** | **1.52** |
| Groove radius | 223.7 mm | **139.6** | 42.7 | 97.0 | 139.5 | 139.5 |
| Groove chord | 21.2 mm | **19.3** | 7.4 | 18.2 | 19.3 | 19.3 |
| Groove depth against the button's chord | 0.230 mm | **0.364** | 0.307 | 0.500 | 0.364 | 0.364 |
| Groove lowest point | x 16.00 | 15.99 | 16.00 | 16.03 | 15.99 | 16.00 |
| Tightest radius on the button's top | **1.35 mm** | **4.55** | 4.88 | 4.82 | 4.54 | 4.55 |
| Outline from the Sora, at most | 0.52 mm | **0.51** | 0.51 | 0.68 | **1.73** | **1.66** |
| Section from the Sora, at most | 0.43 mm | **0.40** | 0.11 | 0.36 | 0.40 | 0.40 |
| Widest | 62.79 mm | 62.78 | 62.78 | 62.41 | 61.48 | 60.48 (the limit) |

- **A** moves only the grooves and removes the crease. The waist is the stock one (its 0.15 mm shift back is the tie-break).
  The groove goes from R 224 to R 140 and from 0.23 to 0.36 mm deep, a little deeper than the Sora's own 0.34 mm and still
  2.8 times gentler than the Sora's R 50.
- **C** shows the other reading: leave the Sora's groove alone and only centre it under the finger (0.43 mm outward). The
  section then stays within 0.11 mm of the Sora's.
- **B** shows what the stricter reading of "reliably" costs: a waist a third tighter (R 187), 6 mm shorter and 1.90 mm in
  under the hump, and a groove at R 97 and 0.50 mm deep. It needed 1,500 steps to settle.
- **D and D2** are the rule as Brock stated it (F65.6: felt over the whole slide, both side arcs) made to hold on the
  finished shape. The mirrored waist has to reach forward to z 33, where the pinky lands. From the stock start it becomes
  64 mm long and 1.83 mm deep and takes the side 2.5 mm in under the hump, the UltralightX's pocket and the model's limit.
  From a start further forward it settles shorter (54 mm, 1.32 mm deep, 1.96 mm under the hump) and narrows the hump to
  60.5 mm, the narrowest of the 35 real mice. Both have about 1.5 mm of front rise (the UltralightX's flare is 1.1 mm) and sit
  1.7 mm from the Sora at most, inside the 2.5 mm bound but no longer "0.5 mm from the Sora". Two starts, two answers: the
  result is start-dependent here too.

### The other three trials under A, and the longer runs

| Trial | | Loss | Thumb's waist: R, chord, depth, narrowest at | Pinky's waist: R, chord, depth, narrowest at | Groove: R, depth |
|---|---|---|---|---|---|
| 1, palm on the hump, mirrored | stock | 51.61 | 254.4 mm, 40.5 mm, 0.81 mm, z 12.3 | the same arc | 223.7 mm, 0.23 mm |
| | A | 52.89 | 243.7, 39.4, 0.80, z 13.2 | the same arc | 139.5, 0.36 |
| 2, palm on the hump, apart | stock | 51.59 | 278.1, 41.6, 0.78, z 10.4 | 415.0, 44.5, 0.60, z 27.3 | 223.7, 0.23 |
| | A | 51.64 | 278.1, 42.1, 0.80, z 12.6 | 394.3, 42.0, 0.56, z 28.6 | 139.5, 0.36 |
| **3, palm lifted, mirrored** | stock | 0.042 | 278.2, 41.5, 0.78, z 3.9 | the same arc | 223.7, 0.23 |
| | **A** | 0.364 | **277.6, 41.2, 0.77, z 3.7** | the same arc | **139.6, 0.36** |
| 4, palm lifted, apart | stock | 0.036 | 278.2, 40.7, 0.75, z −3.5 | 415.2, 44.8, 0.60, z 4.9 | 223.8, 0.23 |
| | A | 0.070 | 268.5, 39.7, 0.74, z −3.7 | 408.0, 41.5, 0.53, z 4.0 | 139.5, 0.36 |

- Trials 1 and 2 still fail where they failed: the index and middle tips past the grooves' front end (51.57 of the loss).
- **Trial 3 is still the lowest mirrored loss**, so it is still the result. Its loss is higher under A (0.36 against 0.04)
  because the written-down tie-break charges 0.28 for what the stock path rule let pass at no cost: the thumb gripping
  7.5 mm from the valley's bottom. That is the price of mirroring, now visible in the number.
- In trial 4 the tie-break puts each valley's bottom under its finger's grip rest (z −3.7 and 4.0 against rests of −3.8 and
  3.9), where the stock run left the pinky's 1 mm off.
- A run to 1,500 steps (`A_fixes_1500`) is in `out/variants.json`; see the note under the table for what it changed.

---

## Proposed changes, ranked

Ranked by how much each moves the result or what the slides claim. None has been applied to the deck.

### 1. The grooves: count one fingertip's own contact, and forbid the crease

The change with the largest certain effect on the result.

- **Code.** In `longarcs.py`, `zones()`: the groove's stretch is the contact patch alone (`dB`), not `dB + 2 * lat`, with
  Goodwin's 5.4 per metre as a floor on its curvature; add a term that charges any arc of the button's top tighter than the
  Sora's own shoulder corner (4.88 mm). Both are in `model/longarcs_v.py` (`groove_zone='pad'`, `groove_kmin`, `rmin`).
- **Result, trial 3, before and after.** Groove radius 223.7 to 139.6 mm; chord 21.2 to 19.3 mm; depth against the button's
  chord 0.230 to 0.364 mm (the Sora's own: 0.336 mm at R 50); tightest radius on the button's top 1.35 to 4.55 mm; section's
  distance from the Sora 0.43 to 0.40 mm. The waist does not move.
- **Slide wording.**
  - gd_landscape, the three lines under the section: "Normals turn 3.4°" / "across the 13 mm where" / "fingertips land;
    felt from 3.4°" becomes "Normals turn 3.4°" / "across the 9 mm one" / "fingertip touches; felt from 3.4°".
  - gd_landscape, inset: "One valley: 0.23 mm deep, at x 16" becomes "One valley: 0.36 mm deep, at x 16" (computed).
  - gd_landscape, source line: add "A still fingertip tells a hollow from flat below about R 185 mm (Goodwin 1991)."
  - gd_arcs: "Felt from R 224 mm" becomes "Felt from R 144 mm"; rows "Groove depth 0.25 mm", "Length 21 mm", "Radius
    224 mm" become "0.33 mm", "19 mm", "140 mm" (computed). Source line: "the grooves over where the fingertip lands
    (Serhat 2022, ANSUR II)" becomes "the grooves across one fingertip's own contact (Serhat 2022; a still fingertip's
    limit is R 185 mm, Goodwin 1991)".
  - gd_trials, each tile: "x ±16, R 224, 1 valley each" becomes "x ±16, R 140, 1 valley each" (computed).
  - gd_after: "Grooves" row "R 224, felt where the tip lands, x ±16" becomes "R 140, felt across one fingertip, x ±16".
    Source line: "on the buttons over where the fingertip lands" becomes "on the buttons across one fingertip's own contact".
- **The alternative, for Brock to choose.** Leave the Sora's groove as it is and only centre it under the finger
  (variant C): R 42.7 mm, 0.307 mm deep, the section within 0.11 mm of the Sora's. The physics allows anything from about
  R 50 to R 144; "felt, and no more" picks the gentle end, the Sora's designer picked the firm end.

### 2. Decide what "felt over the whole slide" means for the pinky on a mirrored shell

The change with the largest possible effect. It waits on RA's corrected slides and on Brock.

- **As the deck stands:** the mean thumb's slide turns 3.42°; the pinky's slide has 12 of its 25 mm on the valley and nets
  −0.6°.
- **If the rule is to hold on the finished shape for both fingers** (variants D and D2): waist chord 41.5 to 54 or 64 mm;
  depth 0.78 to 1.32 or 1.83 mm; side under the hump 1.72 to 1.96 or 2.50 mm; front rise 0.48 to 1.5 mm; outline from the
  Sora 0.52 to 1.7 mm; narrowest point z 3.9 to z 6.
- **If it is kept as it is,** say so. gd_trials, source line: "Felt: each waist turns 3.4° over the slide." becomes "Felt:
  each waist is curved to turn 3.4° over the thumb's slide; half of the pinky's slide lies on it." gd_after, "Side waists,
  mirrored" row: "R 278, felt over the 17 mm thumb slide; bottom at z 4, on both fingers' slides" gains "; the thumb grips
  8 mm behind it".

### 3. Say what the descent decides and what the rules decide

No number changes. These are the slides' claims.

- gd_descent, third caption: "It stops where nothing improves: one mirrored valley on both fingers' slides, just deep enough
  to be felt over the slide." becomes "After 500 steps every rule is met: one mirrored valley on both fingers' slides, curved
  exactly as the felt rule asks."
- gd_descent, second caption: "Descent starts from the Sora's waist and steps downhill." becomes "Descent starts from the
  Sora's waist, slid back under the fingers, and steps downhill."
- gd_after, second caption: "Every curve now has a reason: a valley under each finger, just deep enough to be felt, and
  nothing anywhere else." becomes "Each valley has a reason: it sits on its finger's slide and is curved just enough to be
  felt. Elsewhere the outline stays within 0.6 mm of the Sora's."
- gd_number, the loss counter (33.12 down to 0.04): start the groove from one that closes onto the side wall (the Sora's
  own), so the first figure is all rules and none of it the model repairing its own start. The counter would then start
  near 19.
- gd_landscape, "Ring: 11.7 °/mm, slope 42°" and "In the 6 to 22 °/mm band. No valley.": measure the rate of turn over the
  finger's contact (a few millimetres either side of x 28.5) instead of at one point, so it can fail. Under A it reads
  12.6 °/mm.
- gd_after, "Front flare" row: "Lifting is not modelled yet; there flare would have to earn its place." becomes "Flare gives
  no lift of its own: lifting hangs on friction, or on side walls that lean in toward the base. Neither is modelled yet."
  (Derived: walls leaning in 5° cut the squeeze that holds Theseus's weight from 0.27 to 0.22 N a side at μ 0.5.)

### 4. Give the felt figure as what it is

- gd_strength, third caption: "Its job is to be felt. Over the 17 mm the thumb slides as you grip, the gentlest arc a
  fingertip reliably feels is R 278 mm." becomes "Its job is to be felt. A stroking fingertip detects a curve once the
  surface turns 2° to 5° under it. At 3.4° over the thumb's 17 mm slide, that is R 278 mm."
- gd_strength, the steps tile: "Turn felt reliably" / "3.4°" / "Gordon 1982" becomes "Turn a fingertip detects (2.1° to
  5.3°)" / "3.4°" / "Gordon 1982, Pont 1999".
- gd_strength, the radius axis: shade R 180 to 464 mm behind the "Felt over the slide" dot.
- gd_strength, source line: "Felt: Gordon & Morison 1982, mean + 2 SD = 3.4°; Pont 1999." becomes "Felt: a fingertip
  stroking convex strips 20 to 40 mm long detects a 2.1° turn on average (Gordon & Morison 1982), 3.4° with two standard
  deviations of people added; an index finger swept along 5 to 20 cm, 3.3° to 5.3° (Pont 1999). Not measured for a thumb in
  a grip."
- If the stricter reading were adopted (5.1°, variant B): waist radius 278 to 187 mm; chord 41.5 to 35.7 mm; depth 0.78 to
  0.85 mm; side under the hump 1.72 to 1.90 mm; groove radius to 97 mm, 0.50 mm deep. I do not recommend adopting it without
  the test in open question 1; I recommend showing the band.

### 5. Friction: name the finish

- gd_strength, second tile: "μ 0.2 to 0.5" / "dry skin on plastic" becomes "μ 0.2 to 0.5" / "dry skin on matte plastic",
  with a line under it: "Smooth plastic climbs past 1 as the skin sweats".
- gd_strength, second caption: "The pocket never has to hold it." becomes "A pocket this gentle never has to hold it, and
  could not move it."
- gd_strength, source line: "Friction: Derler & Gerhardt 2012." becomes "Friction: dry skin over 0.2, typically 0.5 (Derler
  & Gerhardt 2012); a fingertip on roughened plastic 0.53 at 0.02 to 2 N, on smooth plastic 0.4 rising to 1.1 to 1.5 as it
  sweats (Dzidek 2014)."

### 6. The first estimate: say why it fails, and name the two strengths that mean something

Optional, one sentence on gd_strength or a line in the notes.

- Proposed line: "A pocket can be felt, or it can catch. Felt takes R 278 mm here. Catching a slipping finger within its
  own width takes R 115 mm or tighter, which the sides of a normal mouse cannot carry and the grooves can."
- Numbers behind it (derived): catch distance for a load 10 % over friction at μ 0.5: 10.9 mm at R 278, 5.6 mm at R 144,
  2.0 mm at R 50. Share of friction the 95th percentile thumb spends resting 9.9 mm off: 7 % at R 278, 17 % at R 115, 42 % at
  R 47.

### 7. Write the path rule's tie-break down

- **Code:** a small pull of each valley's bottom toward its finger's grip rest (`rest_tie`, weight 0.02).
- **Result:** narrowest point z 3.86 to 3.71. From any start, where the stock run gives z 3.85, 6.3 or 11.4 according to
  the start.
- **Claim it supports:** the waist's position is a rule's, not the starting point's. It also makes trial 3's loss show the
  cost of mirroring (0.36 against 0.07 for trial 4).

### 8. Corrections to `research/gd/shape-gd.json` (the record)

- `milner1998.figures.max_eigenvalue_20pct_mvc`: 9.7 N/cm (SD 1.9) is the stiffness along one direction at about 10 N of
  fingertip force, not the largest at 20 % of full effort.
- `pont1999.figures.static`: "1.6 to 2.8 deg" are two averages (both ends tilted, one end tilted), 84 % point. Add: the
  dynamic range is three subjects at 84 %, and the paper puts Gordon & Morison at 2.8° on the same footing.
- `gordon1982`: add the stimulus (convex lenses with a raised edge, talc, two strokes), n = 20, the SD at each length, and
  that the criterion is not printed (75 % per Pont 1999).
- `goodwin1991`: mark as read in the abstract; spheres on a still fingerpad.
- `serhat2022`: the fit is to a finite-element model; add Delhaye 2014's measured areas (83 to 116 mm² at 0.5 N, 124 to
  151 mm² at 1 N).
- `johnson2000.note`: the journal's web abstract prints the values the right way round.
- `derler2012`: add the finger rows (dry 0.60 ± 0.38, median 0.45; moist 1.28 ± 0.67).
- `derived.strength.rule`: superseded; note why (section 6).
- New sources to record: Pont 1997; Dzidek 2014; Delhaye 2014; Pang 1991; Lee, McLoone & Dennerlein 2008; Hiramatsu 2015;
  NIOSH 2004-164; Harih & Dolšak 2014; Odell & Johnson 2015.
- The deck's source line `gdDerler` (in `40-gd-00-core.js`): "on two plastics 0.16 to 0.31 at 20 N (Lewis)" becomes "on
  glossy paper, plastics and lacquered aluminium 0.16 to 0.31 at 20 N (Lewis)".

---

## Open questions, and what would settle each

1. **Does a gripping thumb feel a 3.4° turn?** Everything on the sides rests on it and nothing measures it. A blind test
   would settle it: printed side inserts on one shell, flat and R 150, 200, 280, 400 mm; ten people take hold and say which of
   two was curved. It gives the threshold for the real task and whether the 2° to 5° band carries over.
2. **How much grip will a player trade for a firmer pocket (the X of section 6), and how hard do players squeeze?** No
   measurement exists. A shell with thin force sensors under both sides and both buttons, logged through flicks, lifts and
   tracking, gives the squeeze, the overload at which fingers slip, and the safety margin. With X the strength has an
   optimum, R = e ÷ (X μ), instead of a window.
3. **Where do the thumb and pinky land, and how far do they slide?** RA's side. The cover and felt rules, the waist's
   length and the mirrored valley's place all follow the slides one for one. Video from above of hands taking hold, or
   pressure film on the sides, would replace the model's estimate.
4. **Does the pinky's slide have to lie on the valley?** Brock's call (F65.6 says both side arcs). The answer changes the
   waist from 41 mm to 54 or 64 mm.
5. **Should the grooves be as gentle as can be felt, or as firm as the Sora's?** Brock's call. The physics allows R 50 to
   144 mm.
6. **Friction of Theseus's own coat against skin at 0.2 to 2 N, dry and after a minute's contact.** A pull test on a
   coated coupon with five people would replace the borrowed 0.41 to 0.53.
7. **Peak accelerations in play.** The sensor's own reports, logged at its full rate through a session and differenced,
   would replace the kinematic estimates (3 to 8 g).
8. **The contact patch at mouse loads on a curved shell.** 8.6 mm (a model) or 10.3 mm (measured areas on flat glass); an
   ink print at a known press settles it. It moves the groove's felt radius between 144 and 172 mm.
9. **The knuckle's side-to-side stiffness and the thumb's.** Unmeasured in a living hand as far as I could find. They
   matter only if a force-balance rule returns; under section 6 they do not set anything.
10. **Papers not read in full** (Kappers 2011, Louw 2000 and 2002, Hajian & Howe 1997, Westling & Johansson 1984, Esteki &
    Mansour 1996, Hiramatsu 2015): a library copy would turn six "partly" marks into "verified" and might add the
    between-people spread for still touch, which the abstracts do not give.

---

## Reading log

What was read where, and what could not be.

### Read in full or in the full text's body

- Gordon & Morison 1982, Perception & Psychophysics 31(5) 446-450: Springer's open PDF, two readings.
- Pont, Kappers & Koenderink 1999, P&P 61(5) 874-894: a SciSpace copy of the paper, two readings (Springer's PDF was
  blocked from this session).
- Pont, Kappers & Koenderink 1997, P&P 59(8) 1225-1240: Springer's open PDF, one reading.
- Johnson, Hagberg, Wigaeus Hjelm & Rempel 2000, Scand J Work Environ Health 26(5) 398-405: the journal's PDF, three
  readings, and its web abstract.
- Derler & Gerhardt 2012, Tribology Letters 45, 1-27: the RERO copy, two readings of the first 100,000 characters (the
  conclusions beyond that were not read).
- Dzidek, Adams, Zhang, Johnson, Bochereau & Hayward 2014, "Role of occlusion in non-Coulombic slip of the finger pad",
  EuroHaptics 2014 (LNCS 8618) 109-116: an author copy on SciSpace, two readings.
- Delhaye, Lefèvre & Thonnard 2014, J R Soc Interface 11, 20140698: UCLouvain's repository copy, two readings.
- Shi, Heung, Tang, Tong & Li 2020, Front. Bioeng. Biotechnol. 8, 592637: the journal's page, one reading, matching the record.
- Milner & Franklin 1998, IEEE Trans. Biomed. Eng. 45(11) 1363-1375: an author copy (TU Munich), two readings of the text;
  Tables I to IV have captions but no numbers in the text layer.
- Serhat, Vardar & Kuchenbecker 2022, PLoS ONE 17(7) e0269722: TU Delft's copy, one reading, matching the record.
- Pang, Tan & Durlach 1991, P&P 49, 531-540: a SciSpace copy, one reading.
- Lee, McLoone & Dennerlein 2008, Applied Ergonomics 39, 107-113: the CDC's author manuscript, one reading.
- Odell & Johnson 2015, Work 52, 245-253: the CDC's author manuscript, one reading.
- Kong & Lowe 2005, Int. J. Ind. Ergonomics 35, 1073-1084: the CDC's copy, one reading.
- Sanchis-Sanchis et al. 2024, Applied Sciences 14(16), 7112: the journal's page, one reading.
- Tang 2023, icSPORTS 2023, 169-172: SciTePress's PDF, one reading.
- Donovan et al. 2022, Front. Hum. Neurosci. 16, 979293: the journal's page, one reading.
- NIOSH and Cal/OSHA 2004, "Easy Ergonomics: A Guide to Selecting Non-Powered Hand Tools", publication 2004-164: the CDC's
  PDF, one reading.
- TechPowerUp, Cooler Master MM711 review, p. 5: one reading.

### Abstract or record only

- Goodwin, John & Marceglia 1991 (two pages carrying the abstract, agreeing).
- Louw, Kappers & Koenderink 2000 and 2002; Wijntjes, Sato, Hayward & Kappers 2009; Kappers 2011 (abstract only).
- Kuo & Deshpande 2012; Hajian & Howe 1997; Westling & Johansson 1984 (no figures in its abstract).
- Hiramatsu, Kimura, Kadota, Ito & Kinoshita 2015 (via DOAJ); Harih & Dolšak 2014 (PubMed); Adams et al. 2013.
- de Haan, van de Ven & van Galen 2000 (a conference abstract).

### Could not be read

- Kappers 2011 in full: PubMed Central shows a browser check; Europe PMC refused three times as rate-limited; Utrecht's PDF
  failed.
- Louw 2000 and 2002 in full, Kappers & Koenderink 1996, van der Horst & Kappers 2007 and 2008, Esteki & Mansour 1996,
  Kamper's papers, Werner et al. 2003, Domalain et al. 2010 (blocked or paywalled).
- Hiramatsu 2015 in full: PLoS's own page was refused by the fetch tool's permission step, as was the DOI.
- The trade article read on finger grooves (Occupational Health & Safety, November 2008) is not used as evidence.
