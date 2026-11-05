# K3: the click slides, clear (code `k3`)

Read /tmp/claude-0/-home-claude/17d0b892-9041-5973-afc8-9659df39052b/scratchpad/handoff/k-common.md first.

## Your slides, with Brock's rating and his note, verbatim (F27)
- `cutouts` **3/10**: "everything here is among the most important concepts, but probably has the worst graphic design in the entire deck, it’s super unintuitive to understand because you can hardly tell which part of the mouse you’re looking at it’s so abstract, also the benefit to the player isn’t really sold"
- `clk_front` **8/10**: "this slide has second worst execution in the deck. it fails to intuitively communicate what is going on. if they were not my ideas i’d be very lost.  the left needs to compare to what happens when you don’t have a straight front, like when there is heavy front comfort grooves, and how that can cause wobble side to side, because the front will never reach the bottom in the same spot at the same, and where it reaches the bottom first will depend on where you press it, create wobble which makes the parts feel cheap and wear out faster.  i don’t think cross sections are the best way to communicate the comfort grooves that get shallower near the front. also it needs to be explained that these help lock your fingers in across another plane of motion and increase surface area contact since the front has more surface area too.  for the right visualization, it genuinely took me so long to realize that you weren’t demonstrating an alternative to the the left demonstration, you need to show how some mice do that concept wrong to create larger gaps than there should be and how we do it right. this is also an amazing opportunity to demonstrate why the cutouts are ceiling or wall facing.  these are all very important concepts and probably should be spread out over multiple slides, but still dense in information, not too many slides."
- `clk_wedge` **4/10**: "important concept, very poor execution, could be closer to the less parts is better demonstration, show after youve shown the problem with having more parts"
- `clk_pomtune` **6/10**: "more cornered should be rounded here in the visualization, this one also just feels lazy compare to another mouse’s tolerances directly"
- `clk_hotswap` **4/10**: "demonstration is plane and it’s hard to see the claw clips, there also is no argument as to why this is important"
- `clk_switch2` **2/10**: "largely irrelevant, we don’t even know if we’re going with the gt01 switch or just their style for the bottom housing, if you want to keep this you’d have to group it in with better binning practices, a lot of companies lie about their binning practices for switches, whereas we could commit to proveable bins (potentially using galling effect tech)"
- `clk_spdt` **5/10**: "difficult to understand"
- `latency` **6/10**: "difficult to understand, i like that it sells something though, its hard to tell what is changing"
- `clk_debounce` **3/10**: "weak slide, also minecraft kids want to be able to adjust their debounce to count more double clicks, so i’m not sure how to feel about how this is being sold, low debounce is good and important though to most people, there is just a sub group of people who really dislike it"
- `clk_wait` **3/10**: "hard to understand, probably can be combined somewhere else"
- `clk_methods` **3/10**: "probably can be combined somewhere else or removed"

## What that means here
- **`cutouts` and `clk_front` first:** he calls them among the most important ideas and the worst executed. Draw the part of
  the mouse being shown so a viewer knows where they're looking (the whole mouse, then the zoom), show the problem in rival
  mice first, then Theseus's fix, then what the player feels (G1, G7). `clk_front` may become two slides ("spread out over
  multiple slides, but still dense in information, not too many slides").
- **Also yours, from `shlsheet1`** (the shell's idea sheet; the shell builder removes it there): "most important thing here
  is the right cutouts thing, and it should be back by the other cutouts slides and it meds a lot more detail, especially
  how the further the seams are from the center the easier they are to get your fingers caught in them". Put it in the
  cutouts slides.
- **The timing slides** (`clk_spdt`, `latency`, `clk_debounce`, `clk_wait`, `clk_methods`): simple (G10), merged where he
  says so. Debounce: low by default for most players, adjustable for the players who want it longer (his Minecraft point).
- **`clk_switch2`:** either out of the film, or regrouped as provable switch binning (his note); if you keep it, the
  binning commitment is a proposal, said as one.
- **Order:** `clk_wedge` after the slide that shows the problem with more parts (his note): reorder with `after:` on your
  own slides.

## Also yours (small, from the click builder's round, F31)
- **`clk_switch`:** Brock says Razer's "almost half the battery" figure came from "Razer staff online" (no public source).
  Put it on the slide as a claim, attributed that way ("Razer staff, online, per Brock"), beside the derived 18 % → +21 %
  for the two switches, and update that slide's answer (keep its `rev`).
- **`sidebuttons`:** he confirmed "POM everywhere": drop "say if you want PTFE" from its answer (keep its `rev`).
- The click builder (K1) has finished: 10-b-click.js is yours alone now. Its slides (`clicks`, `arc`, `clk_switch`,
  `tensioner`, `clk_tenmat`, `anchors`, `sidebuttons`) are done and revised; leave them as they are apart from the two
  items above. Its report on `cutouts`: the plan view is now accurate (each trigger's own arm, a block, one screw, a
  10 mm bridge; the "before" from his photos; the lean readout 19.5°; no "pts"); the rest of his note is yours.
- Brock's tensioner photos (F28.2) are references for `cutouts` too: /mnt/user-data/attachments/17d0b892-9041-5973-afc8-
  9659df39052b/0300b3c2-image.jpg, c82f85d5-image.jpg, 1fce7c7f-image.png.

## Your files
deck/src/10-b-click.js (yours alone now); in deck/src/03-parts.js `notchMM`, `frontStopMM`, `flushMM`, the click helpers if a slide of yours needs them (`swMM`, `clickGeo`, `clickMM`, `drawClick`, `railMM`, `tensionerPlanMM`, `guideMM`), and new helpers named `k3_…`; K2 changes the board and encoder functions in the same file at the same time, so edit it with small scripts that replace your function's exact text, re-reading before each edit; deck/geo2d via its tool for scenes only you change.
