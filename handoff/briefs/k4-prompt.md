# K4: the glide slides (code `k4`)

Read /tmp/claude-0/-home-claude/17d0b892-9041-5973-afc8-9659df39052b/scratchpad/handoff/k-common.md first.

## Your slides, with Brock's rating and his note, verbatim (F27)
- `gld_under` **4/10**: "corner dots ledges should be the sable length as the sensor distance between the sensor skate ledge (possible to fit up to 3 skates), and they shouldn’t have a gap between themselves and the shell, we need filet where the skate pills hit the shell, the current execution looks vegetation lazy and not uniform, the right visualization is not what i wanted at all"
- `dots` **6/10**: "show how this is targeted and more weight efficient compared to how big of skates it takes to reduce the sink that aren’t placed in the most optimal possible spots (viper v4 style)"
- `gld_camera` **4/10**: "execution still feels lazy here for the visualization, the pad looks so realistic it’s uncanny, it’s weird irs not drawn like everything else, and this slide could probably be combined with something else, like the next slide"
- `gld_corr` **5/10**: "cool slide but it should probability be combined with the last slide"
- `gld_blur` **2/10**: "probably could be combined with the last 2 slides"
- `gld_sag` **5/10**: "visualization feels lazy and needs more detail, this could also be group with a comparison to bigger skates and weight efficiency"
- `sensor` **6/10**: "says it’s the “suspected” sensor inside the viper v4 pro and that this is the plan, AFTER exclusivity expires"
- `gld_reports` **3/10**: "i don’t understand what is being demonstrated this slide, it’s a graphic but it’s not a demonstration. i would have to understand it to know if the information is good or not"
- `gld_soft` **7/10**: "place near web software, better sell the importance of liftoff distance being 0.1mm configurable"
- `gld_sheet` **4/10**: "visualizations feel lazy"
- `gld_module` **8/10**: "i like this slide, it feels like a good slide, just your normal above average slide right here"
- `glide` **7/10**

## What that means here
- **Merge** `gld_camera`, `gld_corr` and `gld_blur` into one slide (two at most), drawn like the rest of the deck: no
  photo-real pad (G3).
- **`dots` and `gld_sag`** together tell one story: targeted dots against big skates placed where they aren't needed
  (Viper V4 style), with the weight each costs (his notes on both).
- **`gld_under`:** the corner dot ledges as long as the sensor skate ledge (room for up to 3 skates), no gap to the shell, a
  fillet where the skates meet it. If the ledges are 3D shell geometry, say so and draw them right in 2D; the shell model
  is not yours (report what it needs). "the right visualization is not what i wanted at all": ask him what he wants, with
  2 to 4 options, and draw your best guess meanwhile.
- **Also check (F18.2):** with the plate off, the dots by the sensor sit left and right of the lens at ±11.5 mm (his
  decision); make Glide's drawings match.
- **`sensor`:** "the suspected sensor in the Viper V4 Pro", and that the PAW3970 is the plan after its exclusivity ends.
- **`gld_soft`:** move it next to the web software slide (`software`, in Electronics): `ch: 'elec', after: 'software'`, and
  sell the 0.1 mm configurable lift-off.
- **`gld_reports`:** a demonstration, not a graphic (G10).

## Your files
deck/src/10-c-glide.js, 10-c2-glide.js and 12-15-glide.js; deck/geo2d via its tool for scenes only you change.
