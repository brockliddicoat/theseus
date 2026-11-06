# B05: Shell I: materials and strength

Read /home/claude/theseus/handoff/revamp2/common.md first, then this. Then FEEDBACK.md: every STANDING and DECIDED item
(`grep -n -E "STANDING|DECIDED" FEEDBACK.md`), F32 to F35, and every item this brief names. Never regress a decision.

Your file: deck/src/30-b05-shell.js. Your work folder: /home/claude/work/b05/ (PROGRESS.md, CHECKPOINT1.md, shots/).
Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b05 --own=30-b05-shell.js`.

## Where your slides sit in the film
- Before your first slide: `b04_reports` (b04): Full 16-bit reports, no smoothing.
- After your last slide: `b06_lattice` (b06): Triangles, not hexagons.
- Within your file the slides play in the order below; hand each one to the next (common.md, M9 and "Clips and flow").

## Your slides, in film order, with the old slides each replaces and Brock's rating and note on each, verbatim

### `b05_card` (chapter `shell`): Light, without the flex, creak or crack
The shell chapter card as the compromise: lighter shells flex, creak and crack.

- replaces `shellcard` (“Shell and structure”) **7/10** (rated, no note)

### `b05_material` (chapter `shell`): Carbon-filled polypropylene
ABS against PP-C-20A on a flat test beam, said plainly (his note: "explain that this is just on a flat plane"), with the force scaled to what a hand puts on a mouse and said on the slide, and the projected weights of both beams.

- replaces `materials` (“Carbon-filled polypropylene”) **6/10**: "explain that this is just on a flat plane, scale the force to what a mouse would experience from a hand and note that, do that more throughout the presentation. also add the projected weights of these 2 beams."

### `b05_specific` (chapter `shell`): Specific strength and specific stiffness
One of his important ideas. Show why higher specific strength is better, not a convoluted graphic (his note): what each material buys per gram. A classroom demonstration (two bridges of the same weight; or the same beam in each material, scaled to one weight) loaded until it yields; the ranking reshuffles when you divide by density (PP-C-20A 4th → 1st for a thin shell). Materials: PP-C-20A, ABS, PC, magnesium alloy, aluminium, FR4 (F14.6).

- replaces `shlSpecific` (“Specific strength and specific stiffness”) **4/10**: "doesn’t shot how higher specific strength is better, just feels like a graphic which is quite convoluted. i like the graphic but the explanation for it needs to be so much better."
  - FEEDBACK items that name it: F14.6, F33.5 (read them)

### `b05_wall` (chapter `shell`): How thin a wall can go
"Super important concept" and the old slide was confusing and lazy. Show molding: melt flowing into a thin wall cavity, freezing before it fills when the wall is too thin. Each material's floor (PP's 0.89 mm, thixomolded magnesium's 0.7 mm typical): at the same weight, the lighter resin gets the thicker wall, and stiffness goes with thickness cubed. At a glance.

- replaces `thinwall` (“Minimum wall thickness”) **3/10**: "confusing and lazy graphic, hard to understand at a glance and with longer analysis, super important concept though."
  - FEEDBACK items that name it: F33.5 (read them)

### `b05_cubed` (chapter `shell`): Wall tolerance, cubed
Stiffness goes with the cube of thickness: the classroom ruler, bent flat and then on edge. Then a wall a little too thin or too thick from mold scatter: the stiffness swings by the cube. No "points" (his note), more intuitive.

- replaces `shlScatter` (“Wall tolerance, cubed”) **7/10**: "don’t use points, a little more intuitive, but still quite lazy."

### `b05_fallacy` (chapter `shell`): The strength–weight fallacy
Title says fallacy (F14.5). The GPX 2 is heavier than the ULX and built worse (his note: never call the GPX 2's build quality good): heavier is not stronger. Axes that read at a glance: y is strength (higher is better), x is weight (lighter to the right reads as better only if labelled), the area under the curve must not mislead (his note).

- replaces `shlPick` (“The strength–weight fallacy”) **7/10**: "gpx 2 has worse build quality than the ulx even though it was heavier, this demonstrates the fallacy, i dont like that it says the gpx 2 has good build quality, also i think the line might be unintuitive at a glance, i think the axes need to be formatted and labeled differently, also you expect the right to mean weaker and lighter at a glance be because it has the least area under the curve, not the other way around, maybe y should measure strength not flex, i feel as if that would be more intuitive to understand."
  - FEEDBACK items that name it: F2.11, F14.5 (read them)

### `b05_nopick` (chapter `shell`): You don't have to pick
The header on the first frame, never the question alone (G9, his repeated note). The same comparisons as the fallacy slide, and Theseus's method as its own line that breaks the trade-off. "A really important concept but I genuinely have no idea what it's showing graphically": make the graphic obvious. No strength graphs carried across slides (his note on shlShell3d).

- replaces `shlNoPick` (“What if you didn't have to pick”) **3/10**: "the what if uoh didn’t have to pick shouldn’t be the only thing on the screen for a start animation, it should just be the header, i’ve pointed this out before and im concerned you didn’t change it, it makes me worry you’re missing my other feedback. i have all the same comparisons here as the last slide, this graph feels even more intuitive at a glance, i feel like our method should have a separate line. this is a really important concept, but i genuinely have no idea what it’s show graphically."
  - FEEDBACK items that name it: F2.11, F14.5, F33.5 (read them)
- replaces `shlShell3d` (“The triangle lattice, same weight”) **2/10**: "hard to understand, and cut the strength graphs that last multiple slides, they were a bad idea"
  - FEEDBACK items that name it: F2.09 (read them)

### `b05_hotspot` (chapter `shell`): Stress hotspots
A press on a solid flat panel builds one red hotspot that breaks while the rest idles; the same press on a milled-out, ribbed part of LESS weight spreads the load and holds. Show the weight of both parts (his note): a milled-out part stronger than a solid one.

- replaces `shlHotspot` (“Stress hotspots”) **8/10**: "show the weight of the 2 parts to tie into how a milled out part can be stronger a solid part, point this out"
  - FEEDBACK items that name it: F2.10 (read them)

### `b05_margin` (chapter `shell`): The peak decides the break
"Really hard to understand, probably important." Teach it with a classroom demonstration: a sheet of paper that won't tear until you nick it, then tears at the nick. A part breaks where its peak stress reaches the material's strength (120 MPa, F12.12), however much material is idle. Show the margin left before break for the rival and for Theseus.

- replaces `shlMargin` (“Peak stress decides the break”) **2/10**: "really hard to understand, probably important"
  - FEEDBACK items that name it: F2.10, F33.5 (read them)

### `b05_work` (chapter `shell`): Putting that weight to work
His title (F14.7). Tie it to how the structure is designed: this example is the reasoning behind many design choices (his note), so give it more information: 18, 25 and 90 % of the weight working, and which choices move it.

- replaces `shlWork` (“Putting that weight to work”) **8/10**: "tie this into how we designed the stricter more, this page could be sized to have a more information, this example is part of the reasoning for a lot of design choices"
  - FEEDBACK items that name it: F2.10, F14.7, F33.5 (read them)

## Also
Cut the strength meter that ran across several slides ("they were a bad idea", his note on shlShell3d). The FE numbers come from 07-sim.js and the shell data in 10-d-shell.js: reuse them.

