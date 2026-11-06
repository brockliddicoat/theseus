### b09-1 (b09_radio): how much nearby metal costs a 2.4 GHz PCB antenna  [Q2]
- **No dB-vs-distance figure found** (the Casado EuCAP 2012 paper stays closed). What a maker does publish, usable on screen:
  Taoglas PCB Antenna Application Note APN-13-8-001.A: "clearances of minimum 4mm are kept from other metal components";
  "We recommend **20mm or more for best gain and radiation efficiency**"; "clearance of 20mm in all directions from the
  board/housing for maximum efficiency"; closer metal absorbs or reflects radiation and shifts the tuned frequency
  ("shift in tuned frequency will be observed if these clearances are not adhered to"). The note spans 450 MHz to 6 GHz
  and gives no measured loss figures.
  https://www.taoglas.com/wp-content/uploads/pdf/PCB-Antenna-Application-Note-APN-13-8-001.A.pdf
- For the slide: the move from 12.4 to 28.2 mm takes the antenna **from under the 20 mm a maker recommends to over it**
  (Taoglas). Say that, not a dB figure. Confidence: high (a maker's design rule, not a measurement). Replaces: "distance
  only" (now distance against a published rule).
- Queries: "2.4 GHz PCB antenna metal object proximity distance efficiency loss dB measured clearance mm application note"
  (also seen: Johanson 2450AT42E0100E and Taoglas CBD01 datasheets, keep-outs only).

### b08-3 (b08_uv): a measured colour shift under QUV  [Q2]
- **Coatings, measured, QUV-A** (Buchanan, Huntsman, "UV-resistant epoxies", Coatings Trends & Technologies 2024; clear
  coats on glass panels, QUV-A per ASTM G53): a solvent-borne **polyurethane clear coat ΔE 0.13 at 500 h, 0.19 at 1000 h**
  (YI 0.63 / 0.68); **aromatic (BADGE) epoxies ΔE 16.3 to 21.8 at 500 h** (YI 24 to 30), 14.8 to 25.1 at 1000 h, "failure
  before 1000 hours"; hydrogenated or cycloaliphatic epoxies ΔE 2.9 to 11.2 at 500 h.
  https://pcimag.com/ext/resources/Events/CTT/presentations/MitchBuchanan_Huntsman_UV-Resistant-Epoxies_2024-CTT-_New-Format.pdf
- Use: "UV-unstable chemistry yellows in weeks of sun-equivalent: an aromatic resin ΔE 16 at 500 h QUV-A, a UV-stable
  polyurethane 0.13 (Huntsman 2024)". It shows the mechanism (chemistry decides), not a figure for any mouse's coating.
  ΔE about 1 is the usual just-visible difference (not from this source; omit unless sourced).
- **ABS** (weaker data, not QUV): Güzel 2009, "Photo-oxidative degradation of ABS copolymer", MSc thesis, METU: pure ABS
  under a 100 W mercury lamp at 2.8 mW/cm² went from b* −1.97 (100 h) to +1.45 (500 h), faster at higher intensity;
  stabilisers slowed it. https://etd.lib.metu.edu.tr/upload/12610895/index.pdf
- Confidence: high for the Huntsman numbers as clear-coat data; low as a stand-in for a white mouse coating. Replaces: no
  rate implied (now a sourced contrast if wanted). Query: "ABS QUV accelerated weathering yellowness index delta E 500
  1000 hours white ABS UV exposure data"; "white polyurethane coating QUV-A 1000 hours delta E yellowing aromatic vs
  aliphatic polyurethane weathering data".

### b08-2 (b08_uv): a real-world yellowing example (Retr0bright)  [Q2]
- Old computers and consoles yellow because of the **brominated flame retardant** in their ABS; UV light speeds it up.
  Make, "Un-Yellow Old Plastics - Retr0brite!" (2 Mar 2009): it "un-yellows the flame retardants found in ABS plastic", by
  "causing hydrogen to bond with bromine free radicals"; hydrogen peroxide plus an oxygen booster, activated by UV or
  sunlight. https://makezine.com/article/science/unyellow-old-plastics-retr0brite/
  Recalbox blog, 8 Dec 2025 (secondary, no study): bromine added to ABS for 1980s-90s fire rules; UV "accelerates it
  dramatically"; oxygen alone can start it; Nintendo confirmed flame-retardant plastic in the SNES (some batches yellowed);
  first noticed by the CBM museum in Wuppertal, 2008.
  https://www.recalbox.com/it/blog/2025-12-08-consoles-jaunissement-retrogaming-retrobrighting/
- Use: "the yellowed Super Nintendo: flame retardant in its ABS, turned by sunlight". Confidence: medium (hobbyist and
  press sources; the chemistry is widely repeated). Optional for the slide, per b08.

### b08-4 (b08_film): soft-touch film thickness  [Q2]
- **No figure for the film actually used on mice is published.** Covestro, "Soft touch waterborne polyurethane coatings:
  control of optic and haptic properties" (white paper, July 2021): the haptic effect "can already be obtained in coatings
  of only a few micrometer thickness", matt soft-touch "even ... at very low film thickness (2 to 3 µm)".
  https://solutions.covestro.com/-/media/covestro/solution-center/brands/downloads/imported/1652424150.pdf
  RadTech 2016 (already on the slide) tests at 2 mil (51 µm). PPG Velvecron (soft-touch PU for phones, tablets, e-readers)
  publishes no thickness.
- Use: keep RadTech's 2 mil as a test film, and say films can be as thin as 2 to 3 µm (Covestro 2021); don't claim a
  mouse's. Confidence: medium. Query: "soft touch coating dry film thickness microns consumer electronics plastic housings
  polyurethane".

### b08-5 (b08_film): blast removal depth on polypropylene  [Q2]
- **Not found.** Query: "abrasive blasting polypropylene surface roughness material removal depth microns plastic media
  blasting pressure grit" returned forum threads (eng-tips, physicsforums) and media catalogues only. Brock's "almost as
  much as it adds" stays his claim, unnumbered. A Cerakote plastics-prep guide would be a product page (Q1's).

### b10-7 (b10_cable): static friction of PTFE skates on a cloth pad  [Q2]
- **Not found as a published measurement.** Queries: "PTFE mouse skates friction coefficient measured static kinetic cloth
  mousepad test"; "mousepad friction coefficient measured static kinetic values incline angle PTFE feet cloth pad glass pad
  measurement" (extended). Found only: retailer blogs (attackshark), Wallhack's tester description (no values), an
  unreadable community sheet ("Viscose's Mousepad Friction Sheet", Google Sheets, renders client-side:
  https://docs.google.com/spreadsheets/u/0/d/1Ix0RN4WDgRIn9uSUMy2smG_vWR3FTnZHgNpumChfHM0/htmlview) and an overclock.net
  "Friction Measurements" thread that would not load. Brock's #20 stays unquantified, or use a stated assumption.

### b04-1 (b04_sag, b04_skates): soft cloth pad sink under load  [Q2]
- **Not found.** Query: "mouse pad foam compression thickness under load measured mm soft cloth pad sink skates": retailer
  blogs and a patent only. The Pasternak model stays calibrated on Brock's report, marked Derived. (A foam stiffness, e.g.
  ASTM D1056 sponge-rubber grades by compression at 25 %, would let it be derived; not searched.)

### b01-8, b01-13 (b01_lighter) and b03_timing: flick speeds and the crosshair's speed at the shot  [Q2]
- **No study gives a peak mouse speed for a flick, a fingertip correction's speed, or the crosshair's angular speed at the
  click** in readable text. Checked: Sanchis-Sanchis et al. 2024 (Applied Sciences 14:7112: 60 s averages only, 0.026 to
  0.028 m/s), Donovan et al. 2022 (Frontiers Hum Neurosci 16:979293, 32 pros in Aim Lab: speeds z-scored, no values; max
  target distance 5.60 cm of mouse travel), Boudaoud, Spjut & Kim (NVIDIA, arXiv 2203.12050: completion times "0.4 -
  0.8 s"; optimal sensitivity 20 to 80 cm/360°, many prefer 30 cm/360° = 1.2°/mm), Yoon et al. 2025 (IJHCS, model, no
  speeds on the page), Logitech "science of flick shots" (no numbers).
- Derived bound (label it): a 5.6 cm target switch in 0.4 s averages 0.14 m/s; a bell-shaped move peaks at about 1.9× its
  mean, about **0.26 m/s**. At 30 cm/360° (1.2°/mm) that is about **315°/s** of crosshair. So b03_timing's 300°/s is a plausible
  *peak* for a fast target switch, not a measured speed at the click (the crosshair slows before most clicks).
  b01_lighter's 0.5 m/s is about twice that peak and far above a fingertip correction: the slide's ms scale with v (stop
  time m·v/F), so at 0.25 m/s they halve (66 → 33 ms, 132 → 66 ms); the ratio between the mice does not change.
- Queries: "FPS aiming flick mouse peak velocity m/s kinematics study gamers hand movement speed"; "computer mouse
  pointing movements peak velocity cm/s Fitts task kinematics Walker Meyer Smelcer submovements"; "first-person shooter
  flick shot crosshair angular velocity at time of click degrees per second players fire while moving".
- Confidence: low (derived from two studies' bounds). Replaces: nothing yet; the stand-ins stay labelled examples.
