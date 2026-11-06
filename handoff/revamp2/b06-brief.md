# B06: Shell II: triangles, arches, fibres, fillets

Read /home/claude/theseus/handoff/revamp2/common.md first, then this. Then FEEDBACK.md: every STANDING and DECIDED item
(`grep -n -E "STANDING|DECIDED" FEEDBACK.md`), F32 to F35, and every item this brief names. Never regress a decision.

Your file: deck/src/30-b06-lattice.js. Your work folder: /home/claude/work/b06/ (PROGRESS.md, CHECKPOINT1.md, shots/).
Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b06 --own=30-b06-lattice.js`.

## Where your slides sit in the film
- Before your first slide: `b05_work` (b05): Putting that weight to work.
- After your last slide: `b07_board` (b07): The board you already carry.
- Within your file the slides play in the order below; hand each one to the next (common.md, M9 and "Clips and flow").

## Your slides, in film order, with the old slides each replaces and Brock's rating and note on each, verbatim

### `b06_lattice` (chapter `shell`): Triangles, not hexagons
Human force on the mouse, said (his note); hexagons bending a lot more (his note); statically determinate triangles taught with the classroom demonstration: a square of straws racks and sags, a triangle holds. The 3D note's lesson too: triangles show less red, the force spread out.

- replaces `lattice` (“Triangle vs hexagon lattices”) **7/10**: "use human force that would be exerted on a mouse and point that out make hexagons bend a lot more"
  - FEEDBACK items that name it: F2.37 (read them)
- replaces `shlDeterminate` (“Statically determinate triangles”) **5/10**: "could be combined with another slide"
  - FEEDBACK items that name it: F2.37 (read them)

### `b06_light` (chapter `shell`): Triangles win more on a light mouse
The fact he loves, made compelling: as the mouse gets lighter the triangle's lead grows. Max load before it bends past a limit, against weight, triangles against hexagons, the gap widening as weight drops.

- replaces `shlThin` (“Triangles on a light mouse”) **7/10**: "needs a better explanation and more information to be more inituitive, i really like the fact that triangles win more as the mouse gets lighter, this really just isn’t as compelling as it should be sits hard ti understand. max load to bend maybe?"
  - FEEDBACK items that name it: F2.09, F33.5 (read them)

### `b06_arches` (chapter `shell`): Interwoven arches form triangles
Arches drawn as continuous lines that form triangles where they cross (F2.16). His note reads "arches shojdkne be on the photon rim and for some reason sole of the lines look wobbly": most likely "arches shouldn't be on the bottom rim, and some lines look wobbly". Fix both: no wobble, arches spanning the dome, not sitting on the base rim.

- replaces `shbArches` (“Interwoven arches form triangles”) **7/10**: "arches shojdkne be on the photon rim and for some reason sole of the lines look wobbly, cool animation other than the poor execution"
  - FEEDBACK items that name it: F2.16 (read them)

### `b06_arch` (chapter `shell`): Why an arch holds
"Hard to understand, need real world examples, unintuitive for a social media brain." An egg squeezed end to end in a fist that won't break; a Roman arch; then the arch against a flat plate under the same hand press: the plate cracks at 12 N, the arch holds to 45 N. Thrust cancelling bending, shown, not described.

- replaces `shbPress` (“Arch action vs a flat plate”) **3/10**: "hard to understand, need real world examples and it’s just unintuitive for a social media brain"
  - FEEDBACK items that name it: F2.24 (read them)
- replaces `shbBend` (“Arch thrust cancels bending”) **3/10**: "hard to understand, need real world examples and it’s just unintuitive for a social media brain"
  - FEEDBACK items that name it: F2.24 (read them)

### `b06_thrust` (chapter `shell`): The thrust line
The hanging chain flipped upright (Gaudí's hanging models, F33.8): a chain hangs in pure tension; flip it and it is the arch that stands in pure compression. Then the thrust line through Theseus's arch.

- replaces `shbThrust` (“The thrust line”) **3/10**: "hard to understand, need real world examples and it’s just unintuitive for a social media brain"
  - FEEDBACK items that name it: F2.24 (read them)

### `b06_fibres` (chapter `shell`): Fibres along the load
Wood splits along its grain (classroom demonstration). Fibre-filled plastic is strongest along its fibres (Krenchel; the research figures), and continuous arches let the melt lay fibres along the load. The flow through a filleted node aligns them; a sharp node tangles them.

- replaces `shbFibres` (“Fibre alignment”) **3/10**: "hard to understand, need real world examples and it’s just unintuitive for a social media brain"
  - FEEDBACK items that name it: F2.17 (read them)
- replaces `shbFlow` (“Fibre orientation through a node”), not rated
  - FEEDBACK items that name it: F2.18 (read them)

### `b06_fillet` (chapter `shell`): Why corners get fillets
The Comet airliner's square windows (classroom demonstration): cracks started at the corners. A sharp node concentrates stress; a fillet spreads it. No shell study shown here (his note); the rest of the old slide merged.

- replaces `fillet` (“Fillets at every node”) **4/10**: "she’ll study isn’t needed to be shoes here, rest can be combined with other slides"

### `b06_filletsize` (chapter `shell`): Fillet size, solved at equal mass
Rated 10/10: keep its content and simulation. Raise the motion to the new bar (the radius sweeping, the struts thinning to hold the mass, the peak falling, the pick landing).

- replaces `filletsize` (“Fillet size, solved at equal mass”) **10/10** (rated, no note)

### `b06_mold` (chapter `shell`): What a fillet buys the mold
One dense slide for what the old deck spread over four thin ones ("doesn't need its own slide"): one rib width, a cutter that fits the corner (no knife edges of steel), and a looser tightest tolerance. His note on shbWidth: it read as contradicting earlier slides at a glance; make sure it doesn't. The mold method is undecided (F13.2): the advantage holds either way.

- replaces `shbWidth` (“One rib width, a fillet at every node”) **3/10**: "hard to understand, feels contradictory to things we’ve says before at a glance"
- replaces `shbMill` (“Fillets make the mold easier to cut”) **2/10**: "doesn’t need its own slide"
  - FEEDBACK items that name it: F2.25, F13.2 (read them)
- replaces `shbMillDirect` (“A milled core: no knife edges of steel”) **2/10**: "doesnt need its own slide"
  - FEEDBACK items that name it: F13.2 (read them)
- replaces `shbTol` (“A fillet loosens the tightest tolerance”) **3/10**: "unintuitive, better visualization needed, mediocre idea"
  - FEEDBACK items that name it: F2.25 (read them)

## Also
Every lattice filleted (F9.27), peaks red (F9.23), "Peak experienced stress (lower is better)". The FE solver is 07-sim.js; the shell and arch models are in 10-d-shell.js and 10-d2-arches.js: reuse them.

