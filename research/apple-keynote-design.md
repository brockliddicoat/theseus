# How Apple designs its keynote graphics (research notes, 2026-11-04)

Brock asked for the deck to move toward Apple's keynote design ("research how apple does the graphic design of its
keynotes") after sending four references: the M1 Pro / M1 Max summary grid, the M1 launch wall (Craig Federighi in
front of it), the MacBook Air M1 summary grid, and the iPhone 11 Pro display wall (Phil Schiller). These notes are what
the deck's design system (deck/DESIGN.md §0) takes from them.

## What the references show
- **Bento summary grids.** Rounded rectangles in a tight grid with even gutters, light grey tiles on white (or dark
  grey on black). Each tile holds one thing: a stat ("Up to / 3.5x / faster CPU", "Up to / 20 hours / battery life"), a
  feature name with a simple line icon ("Secure Enclave", "Wi-Fi 6"), or an image (the product, the chip, the
  wallpaper). One or two big tiles hold the product, shown small, or the chip, lit by a colourful glow.
- **Type as the hierarchy.** A small qualifier in regular weight ("Up to"), a huge number in heavy weight with a
  gradient fill (blue to purple, orange to pink, yellow to orange), a short label in medium weight. No bullets, no
  boxes round labels, no badges.
- **Subtle gradients everywhere, never loud.** Gradient text on the hero figures, gradient strokes on the icons, a
  coloured glow behind the chip; flat, quiet tile surfaces.
- **Colour reused with intent.** The M1 Pro grid is blue, the M1 Max grid purple: the colour names the product.
- **Little of the product.** The product appears small, or as a close-up of the part in question (the chip, the
  display's edge, the keyboard), and the rest of the slide is the claim.

## What designers who have analysed Apple's keynotes say
- One idea per slide; few words; big type; many sparse slides rather than a few crowded ones; builds only when they
  serve the narrative ([This is how we make slides at Apple](https://medium.com/adventures-in-consumer-technology/this-is-how-we-make-slides-at-apple-b8a84352bf6d)).
- Colours used with intent and consistently across the deck; elements animate in when they are talked about; no
  bullets, generous spacing instead; symmetry ([Iconic Slides: 7 rules Apple's slide decks teach us](https://medium.com/iconic-slides/iconic-slides-7-rules-apples-slide-decks-teach-us-about-creating-insanely-great-presentations-65bc45051c72)).
- Charts reduced to the message (axes named "Performance", "Power consumption", with the direction of better); the
  chip's gradient reused as the chart line so the line reads as the chip without a legend; glow and gradient give
  plain hardware an identity; few numbers at a time, framed against something familiar ("3×"); modular summary slides
  with the product in the centre ([Learn from Apple's art of tech explanation](https://uxdesign.cc/learn-from-apples-art-of-tech-explanation-11b22d616563)).
- Infographic grids instead of bullet lists; vary the kind of visual every few slides; show the product in use
  ([What we can learn from Apple's September 2019 keynote](https://medium.com/@adriennestiles/what-we-can-learn-about-great-presentation-design-from-apples-september-2019-keynote-816ea544bb63)).
- Black grounds for focus, white for clarity, accent colours only for emphasis; strategic empty space
  ([Apple keynote presentation analysis](https://speechmirror.pages.dev/speech-examples/apple-keynote-presentation-analysis)).
- Bento grids: even gutters of 16 to 24 px, never under 16; a hero tile 2 × 2, highlight tiles 2 × 1, the rest 1 × 1;
  two or three accent colours at most ([Bento grid layouts](https://studiomeyer.io/en/blog/bento-grid-layouts)).
  Apple has used summary grids in its keynotes since 2020 ([Bring to Front: summary grids](https://btf.beehiiv.com/p/summary-grids-10)).
- apple.com's own tokens, as a third party extracted them: cards with a 28 px radius and 28 to 40 px padding, no shadows
  ("relies on background alternation and radii"), ink #1d1d1f on #f5f5f7, blue #0071e3 on light and #2997ff on dark,
  display type at -1.2 to -1.44 px tracking ([Apple DESIGN.md tokens](https://designmd.fun/apple/design-md)).

## What the deck takes (and where it differs)
- Tiles: radius 28, padding about 32, gutters 24, no shadows, a soft top light; Theseus's tile lit from inside.
- Theseus is blue (Brock: red reads as bad; green is Razer's), with a cyan-blue-indigo gradient like Apple's chip art,
  reused on its numbers, bars, line and glows. The next best is the deck's first yellow; a problem is red.
- Labels are type: no capsules, dots or lower-third boxes.
- More data than Apple: every number keeps its evidence tag and its source; charts keep their values; simulations get
  big tiles. The deck keeps its fonts (Inter Display, Inter, JetBrains Mono) and its caps titles.
- Motion: entrances that settle, count-ups, a light passing once over a new tile, slow camera pushes, flows of force
  and light; no gratuitous loops.
