# K5: the shell: materials and strength (code `k5`)

Read /tmp/claude-0/-home-claude/17d0b892-9041-5973-afc8-9659df39052b/scratchpad/handoff/k-common.md first.

## Your slides, with Brock's rating and his note, verbatim (F27)
- `materials` **6/10**: "explain that this is just on a flat plane, scale the force to what a mouse would experience from a hand and note that, do that more throughout the presentation. also add the projected weights of these 2 beams."
- `shlSpecific` **4/10**: "doesn’t shot how higher specific strength is better, just feels like a graphic which is quite convoluted. i like the graphic but the explanation for it needs to be so much better."
- `thinwall` **3/10**: "confusing and lazy graphic, hard to understand at a glance and with longer analysis, super important concept though."
- `shlScatter` **7/10**: "don’t use points, a little more intuitive, but still quite lazy."
- `shlPick` **7/10**: "gpx 2 has worse build quality than the ulx even though it was heavier, this demonstrates the fallacy, i dont like that it says the gpx 2 has good build quality, also i think the line might be unintuitive at a glance, i think the axes need to be formatted and labeled differently, also you expect the right to mean weaker and lighter at a glance be because it has the least area under the curve, not the other way around, maybe y should measure strength not flex, i feel as if that would be more intuitive to understand."
- `shlNoPick` **3/10**: "the what if uoh didn’t have to pick shouldn’t be the only thing on the screen for a start animation, it should just be the header, i’ve pointed this out before and im concerned you didn’t change it, it makes me worry you’re missing my other feedback. i have all the same comparisons here as the last slide, this graph feels even more intuitive at a glance, i feel like our method should have a separate line. this is a really important concept, but i genuinely have no idea what it’s show graphically."
- `shlHotspot` **8/10**: "show the weight of the 2 parts to tie into how a milled out part can be stronger a solid part, point this out"
- `shlMargin` **2/10**: "really hard to understand, probably important"
- `shlWork` **8/10**: "tie this into how we designed the stricter more, this page could be sized to have a more information, this example is part of the reasoning for a lot of design choices"
- `shlShell3d` **2/10**: "hard to understand, and cut the strength graphs that last multiple slides, they were a bad idea"
- `lattice` **7/10**: "use human force that would be exerted on a mouse and point that out make hexagons bend a lot more"
- `shlDeterminate` **5/10**: "could be combined with another slide"
- `shlThin` **7/10**: "needs a better explanation and more information to be more inituitive, i really like the fact that triangles win more as the mouse gets lighter, this really just isn’t as compelling as it should be sits hard ti understand. max load to bend maybe?"
- `shellcard` **7/10**

## What that means here
- **Forces a hand makes** (G2): every strength slide says what load it shows, scaled to a hand on a mouse, and says it's a
  flat test where it is one ("explain that this is just on a flat plane, scale the force to what a mouse would experience
  from a hand and note that, do that more throughout the presentation").
- **"cut the strength graphs that last multiple slides, they were a bad idea"** (on `shlShell3d`): the strength meter that
  carries across slides goes; each slide stands alone.
- **`shlNoPick`:** its opening frame is the header (G9; he has asked before, and worries we miss notes). Check every
  slide's first frame for the same fault.
- **`shlPick` and `shlNoPick`:** the GPX 2 is heavier than the ULX and built worse (his point: that's the fallacy); the y
  axis as strength, not flex, if that reads better at a glance; Theseus's method on its own line.
- **`shlDeterminate`:** merge it into the slide it fits best (G4).

## Your files
deck/src/10-d-shell.js, only these slides (another builder may have `fillet`, `filletsize`, `shlPcbRib`, `shlStructs`, `tolerance`, `mass` and `grind` in the same file: edit with small scripts that replace your slide's exact text, re-reading before each edit); the lattice and shell 2D twins via their tool if you need them changed.
