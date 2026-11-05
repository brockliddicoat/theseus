# K8: the surface, the ownership sheet and the wheel (code `k8`)

Read /tmp/claude-0/-home-claude/17d0b892-9041-5973-afc8-9659df39052b/scratchpad/handoff/k-common.md first.

## Your slides, with Brock's rating and his note, verbatim (F27)
- `surfacecard` **4/10**: "surfaces looks bad in 2d and 3d visualization"
- `coating` **5/10**: "lazy visualizations, show flames and more realistic pots"
- `srf_texture` **6/10**: "needs to show previous height before sanding and coat, i like the comparisons to soft touch"
- `srf_weight` **4/10**: "can be combined with previous slide, cerakote film numbers before sand blasting look way too heavy, 0.49g is a lot, especially with how much thinner cerakote is to soft touch"
- `srf_uv` **7/10**
- `grip` **8/10**: "really good visualization but needs to be more intuitive"
- `srf_gripmap` **5/10**: "grip designs need massive optimizations to look cool, and blend between there different textures better"
- `srf_tape` **8/10**: "the best thickness is no thickness, people have been chasing really thin grip tape for a while now, this is a better solution"
- `srf_twotone` **6/10**: "not a universal dah of the design, but i love how realistic it is"
- `wheel` **5/10**: "poor comparison figure, we should be comparing ti average plastic wheels with heavy rubber, a test group"
- `ownsheet1` **2/10**: "feels redundant, most of this should be moved to other slides"
- `repair` **8/10**
- `ownscrew` **7/10**

## What that means here
- **`surfacecard`:** "surfaces looks bad in 2d and 3d visualization": the coating's look in the 2D twins and the 3D
  materials (3d/shell/shell.js materials only).
- **Merge** `srf_weight` into `srf_texture` (his note), with the height before sanding and coating, and the Cerakote film
  weight checked (0.49 g looks far too heavy for a film thinner than soft touch).
- **`srf_gripmap`:** the grip designs optimized to look good and blend between textures (and ask him about the grip map
  once he has seen it: options).
- **`wheel`:** against average plastic wheels with heavy rubber, a test group, sourced.
- **`ownsheet1`:** "feels redundant, most of this should be moved to other slides": move each point to its slide, then
  take the sheet out.

## Your files
deck/src/10-e-surface.js (not `srf_encoder`), 10-e2-surface.js, 12-50-own.js (`ownsheet1`), 10-h2-own.js; the materials in 3d/shell/shell.js; deck/geo2d via its tool for the shell scenes.
