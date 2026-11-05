# K6: the shell: arches, fillets, the board and the build (code `k6`)

Read /tmp/claude-0/-home-claude/17d0b892-9041-5973-afc8-9659df39052b/scratchpad/handoff/k-common.md first.

## Your slides, with Brock's rating and his note, verbatim (F27)
- `shbArches` **7/10**: "arches shojdkne be on the photon rim and for some reason sole of the lines look wobbly, cool animation other than the poor execution"
- `shbPress` **3/10**: "hard to understand, need real world examples and it’s just unintuitive for a social media brain"
- `shbThrust` **3/10**: "hard to understand, need real world examples and it’s just unintuitive for a social media brain"
- `shbBend` **3/10**: "hard to understand, need real world examples and it’s just unintuitive for a social media brain"
- `shbFibres` **3/10**: "hard to understand, need real world examples and it’s just unintuitive for a social media brain"
- `fillet` **4/10**: "she’ll study isn’t needed to be shoes here, rest can be combined with other slides"
- `filletsize` **10/10**
- `shbWidth` **3/10**: "hard to understand, feels contradictory to things we’ve says before at a glance"
- `shbMill` **2/10**: "doesn’t need its own slide"
- `shbMillDirect` **2/10**: "doesnt need its own slide"
- `shbTol` **3/10**: "unintuitive, better visualization needed, mediocre idea"
- `shbSides` **4/10**: "show equal pressure on both sides, just for show. the asymmetry looks bad, this should be in the shape category"
- `shlPcbRib` **6/10**: "unintuitive, explain how fr4 is like carbon fiber because it’s also a woven composite, using the pcb is an alternative to having carbon fiber rods in your mouse that doesn’t require extra parts with extra tolerancing, you’re just using what you already have"
- `shcCarry` **5/10**: "meg slide"
- `shcArms` **6/10**: "these aren’t what the arms or pcb would look like, important idea tho"
- `shlStructs` **3/10**: "viewer will have no idea what that spec means in big blue poor setup"
- `tolerance` **7/10**: "needs to be explained with some sort of law for more validity, don’t show the theseus teardown, improve the diagram, the little drops should be simplified mouse parts, explain how one incorrectly tolerances mouse part ruins a whole mouse so this is more important than it looks, you’re on the right track here you just need to improve your execution."
- `mass` **5/10**: "in review, research why some people are pushing for higher battery placement"
- `grind` **7/10**: "factory poron pads, many people already mod there g wolves mice with these for where it hits the pcb to reduce creaking"
- `shlsheet1` **4/10**: "most important thing here is the right cutouts thing, and it should be back by the other cutouts slides and it meds a lot more detail, especially how the further the seams are from the center the easier they are to get your fingers caught in them. we don’t have to talk about the pro model yet. and i’m unsure about the the sticker"
- `shlsheet2` **5/10**

## What that means here
- **The four arch slides** (`shbPress`, `shbThrust`, `shbBend`, `shbFibres`) all got "hard to understand, need real world
  examples and it's just unintuitive for a social media brain": real-world arches and forces you can feel (G2), fewer and
  denser slides (G4).
- **Merges:** `shbMill` and `shbMillDirect` into one ("doesn't need its own slide"); `fillet`'s rest into other slides
  ("shell study isn't needed to be shown here").
- **`shbSides`:** move it into the Shape chapter (`ch: 'shape'`, with an `after:`), pressures equal on both sides.
- **`shlsheet1`:** the cutouts point moves to the click builder's cutouts slides (remove it here); the rest: "we don't have
  to talk about the pro model yet. and i'm unsure about the sticker".
- **`shcArms`** ("these aren't what the arms or pcb would look like, important idea tho"): Brock sent the real thing (F28.3),
  a G-Wolves board whose arms reinforce its lattice shell, and the part that broke in shipping:
  /mnt/user-data/attachments/17d0b892-9041-5973-afc8-9659df39052b/d2ae72fe-image.png and 80f31ed6-image.jpg ("the pcb with
  arms from g wolves that are used as a reinforcement that i had break during shipping"). Draw the arms and the board as
  they look there; the break in shipping is part of the argument for using the whole board.
- **`tolerance`:** a law behind it (tolerance stack-up, sourced), simplified mouse parts for the drops, no Theseus
  teardown; one bad part ruins the whole mouse.
- **`mass`:** research why some people push for a higher battery placement, sourced, and show it honestly.
- **`grind`:** factory Poron pads where the board meets the shell (players already mod G-Wolves mice this way to stop
  creaking).

## Your files
deck/src/10-d2-arches.js, 12-20-shell.js, and in 10-d-shell.js only `fillet`, `filletsize`, `shlPcbRib`, `shlStructs`, `tolerance`, `mass` and `grind` (edit with small scripts that replace your slide's exact text, re-reading before each edit); deck/src/10-g-shape.js only to place `shbSides`; deck/geo2d via its tool for scenes only you change.
