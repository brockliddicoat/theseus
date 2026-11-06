# B02: Clicks I: the mechanics that matter most

Read /home/claude/theseus/handoff/revamp2/common.md first, then this. Then FEEDBACK.md: every STANDING and DECIDED item
(`grep -n -E "STANDING|DECIDED" FEEDBACK.md`), F32 to F35, and every item this brief names. Never regress a decision.

Your file: deck/src/30-b02-clicks.js. Your work folder: /home/claude/work/b02/ (PROGRESS.md, CHECKPOINT1.md, shots/).
Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b02 --own=30-b02-clicks.js`.

## Where your slides sit in the film
- Before your first slide: `b01_budget` (b01): Where 29.31 g goes.
- After your last slide: `b03_switch` (b03): A mechanical switch, for the battery.
- Within your file the slides play in the order below; hand each one to the next (common.md, M9 and "Clips and flow").

## Your slides, in film order, with the old slides each replaces and Brock's rating and note on each, verbatim

### `b02_card` (chapter `click`): Clicks that land the same, every time
The chapter card as the compromise most mice make: a click that changes with where and how you press. Use the kit's chapter card. The GT01 on it drawn right (the plunger above the housing turned 90°, his note on `clicks`).

- replaces `clicks` (“Clicks”) **7/10**: "switch plunger on the gt01s is still turned vertical, bottom part looks fine but the part that actually sticks out above the housing looks like it needs to be turned 90 degrees"
  - FEEDBACK items that name it: F32.1 (read them)

### `b02_cutouts` (chapter `click`): Straight rear cutouts
Among his most important ideas, and the worst executed slide in the old deck. Establish first: the whole mouse from above, the rear trigger cutouts highlighted, then a continuous push-in to them, so the viewer always knows where they are. The rival: the Sora V2's curved "smile" cutout (and Razer's change from the V2 Pro's to the V3 Pro's straight one): an off-centre finger press twists the trigger, the bend line leans, the plunger sees a sideways push. Same press on Theseus's straight cutout, centred on its switch: the trigger travels straight down. Payoff: the click feels the same wherever the finger lands; before → after numbers (sideways, lean, offset). Sell the benefit to the player.

- replaces `cutouts` (“Straight rear cutouts”) **3/10**: "everything here is among the most important concepts, but probably has the worst graphic design in the entire deck, it’s super unintuitive to understand because you can hardly tell which part of the mouse you’re looking at it’s so abstract, also the benefit to the player isn’t really sold"
  - FEEDBACK items that name it: F33.5 (read them)

### `b02_seams` (chapter `click`): Seams that keep your fingers out
From his shell-sheet note: the further a seam sits from the centre, the easier it catches your fingers. Show a finger sliding across rival seam layouts (seams far out on the grip) catching, then Theseus's Sora seam (one split, F11.3) staying clear of the finger's path. The pro model and the sticker are not part of this slide.

- replaces `shlsheet1` (“PPS triggers, film sticker, closed wheel well”) **4/10**: "most important thing here is the right cutouts thing, and it should be back by the other cutouts slides and it meds a lot more detail, especially how the further the seams are from the center the easier they are to get your fingers caught in them. we don’t have to talk about the pro model yet. and i’m unsure about the the sticker"
  - FEEDBACK items that name it: F33.5 (read them)

### `b02_front` (chapter `click`): A flat front: no wobble
His clk_front note, left half: a front with heavy comfort grooves never bottoms out in the same spot, so where it lands first depends on where you press; it rocks side to side, feels cheap and wears faster. Show it: two presses at two finger positions on a grooved front, the trigger tilting differently each time, contact points marked. Then Theseus's flat front cutout: it lands flat, in the same place, every press. Not cross-sections.

- replaces `clk_front` (“Flat front cutouts, flush walls”) **8/10**: "this slide has second worst execution in the deck. it fails to intuitively communicate what is going on. if they were not my ideas i’d be very lost.  the left needs to compare to what happens when you don’t have a straight front, like when there is heavy front comfort grooves, and how that can cause wobble side to side, because the front will never reach the bottom in the same spot at the same, and where it reaches the bottom first will depend on where you press it, create wobble which makes the parts feel cheap and wear out faster.  i don’t think cross sections are the best way to communicate the comfort grooves that get shallower near the front. also it needs to be explained that these help lock your fingers in across another plane of motion and increase surface area contact since the front has more surface area too.  for the right visualization, it genuinely took me so long to realize that you weren’t demonstrating an alternative to the the left demonstration, you need to show how some mice do that concept wrong to create larger gaps than there should be and how we do it right. this is also an amazing opportunity to demonstrate why the cutouts are ceiling or wall facing.  these are all very important concepts and probably should be spread out over multiple slides, but still dense in information, not too many slides."
  - FEEDBACK items that name it: F33.5 (read them)

### `b02_grooves` (chapter `click`): Grooves that lock your fingers in
His clk_front note again: the comfort grooves get shallower toward the front, they lock the fingers in across another plane of motion and add contact area (the front has more surface area too). Show a fingertip sliding sideways on a flat trigger versus held in the groove (the old shape slide's 23 % → 15 % sideways push). Not cross-sections: show it on the button seen in perspective or from the front.

- replaces `grooves` (“Comfort grooves”), not rated

### `b02_flush` (chapter `click`): Flush walls, small gaps
His clk_front note, right half (he said it took him long to see it wasn't an alternative to the left half): how some mice make the gaps bigger than they should be, and how Theseus does it right, walls flush with the pressed triggers (#48). Use it to show why the cutouts face the ceiling or the wall (what the gap lets in, what a finger feels). Rival first, then Theseus.

- a new slide (it replaces nothing); its notes come from the slide named in the direction

### `b02_direct` (chapter `click`): Direct Drive Actuation
K1's v22 rebuild is the starting point (10-b-click.js `arc`). The rival first: a flat switch under an arcing trigger, the plunger scraping its guide, part of the press going sideways. Theseus: the GT01 housing turns the switch 20° onto the arc, the whole press goes down the plunger. Keep "6 % sooner" with why it isn't 20 % (F31.2), 34 % sideways → 0 % as the headline; the tensioner drawn accurately; no "pts".

- replaces `arc` (“Direct Drive Actuation”) **7/10**: "tensioner doesn’t look accurate, i dont like the use of the metrics “pts” or “points” anywhere. this is a really important slide the concept is good but it needs to be demonstrated and sold better, i think direct drive means the peak theoretical reaction time should be 20% faster because 20% more of the force goes where you actually intend it."
  - FEEDBACK items that name it: F15.1, F16.1, F33.5 (read them)

### `b02_wedge` (chapter `click`): One flat board, fewer parts
Important concept, very poor execution (his words). Show the problem with more parts first: tilted sub-boards, wedges and brackets, each a tolerance that stacks and a part that can shift. Then the GT01's angled bottom housing on one flat board: the angle lives in the switch. Close to the "less parts is better" demonstration; link to the tolerance stack-up slide (b07).

- replaces `clk_wedge` (“A switch wedge, one flat board”) **4/10**: "important concept, very poor execution, could be closer to the less parts is better demonstration, show after youve shown the problem with having more parts"
  - FEEDBACK items that name it: F33.5 (read them)

### `b02_tensioner` (chapter `click`): The bridge tensioner
K1's v22 tensioner is the starting point. Top row "As seen in Starlight X": the stiff composite plane with no bridge, a stiff click. Bottom row "Proposed solution": the bridge sets where it bends and how easily. No fillets where the bridge meets the trigger: square joints (his note). Drawn as it sits in a mouse, accurate to the real tensioners in his photos (one screw per block, aligned with the switch, stripped to what the load needs). Payoff in click force before → after.

- replaces `tensioner` (“Bridge tensioner: where it bends, how easily”) **8/10**: "reference the starlight x’s stufd clicks from using such a stiff composite materiak with no bridge, market top as “as seen in starlight x” or something like that, and bottom as proposed solution. also the rounding where the bridges meets the trigger looks bad, ie needs to connect without filets"
  - FEEDBACK items that name it: F2.04 (read them)

### `b02_stiff` (chapter `click`): A stiff trigger, a light click
"Hard to understand, and stiffer is better doesn't seem right" (his note). Make the logic plain: two separate jobs. The trigger body must be stiff (it doesn't flex under the finger, so the click is crisp and immediate); the bridge alone sets how much force the click takes. A rival trigger that is soft everywhere: the finger's press is spent bending the button before the switch trips (mushy). Theseus: stiff body, light bridge. A classroom demonstration helps (a diving board: a stiff board, the hinge sets the bend).

- replaces `clk_tenmat` (“A stiff trigger with a light click”) **4/10**: "hard to understand, and stiffer is better doesn’t seem right"
  - FEEDBACK items that name it: F2.04 (read them)

### `b02_rails` (chapter `click`): Dual rail main clicks
Locking the motion to one plane, explained plainly and drawn so you can tell what you're looking at (his note). Rival: one post, the button rocks and rubs, feels cheap and wears over time. Theseus: two identical posts on identical POM pads (uniformity is the claim, F26.2, G8), riding in a guide; the press goes straight down. Sell the benefit.

- replaces `anchors` (“Dual rail main clicks”) **7/10**: "locking the motion to one plane/ direction needs to be better explained, and the visualization here is too abstract and difficult to tell what you’re looking at, i also dislike how the dual plungers and pads aren’t uniform, and you need to sell the benefit here a little better, talk about how the bad version feels cheap and causes more wear over time fork being losing, good information, execution just need medium improvement"
  - FEEDBACK items that name it: F2.06, F33.5 (read them)

### `b02_pom` (chapter `click`): POM pads set the tolerance
Compare directly with another mouse's tolerances (his note): the play a rival leaves, against a POM pad whose thickness the factory tunes to take the play out, pad by pad. More corners rounded (his note). Show the pad being swapped for a thicker one and the gap closing.

- replaces `clk_pomtune` (“POM pad thickness sets the tolerance”) **6/10**: "more cornered should be rounded here in the visualization, this one also just feels lazy compare to another mouse’s tolerances directly"
  - FEEDBACK items that name it: F2.06 (read them)

## Also
K1 rebuilt several of these slides for v22 (deck/src/10-b-click.js): reuse its drawings, data and numbers by calling them or copying them into your file under your prefix. Brock's tensioner photos are in refs/photos/brock-2026-11-06/ (g305-top-shell-tensioners.jpg, lamzu-white-shell-top-and-tensioners.jpg, white-shell-tensioners-side-rail.png; INDEX.md says what each shows); the GT01 references are refs/photos/gateron-gt01-*.jpg. H1 is thickening the GT01's walls: draw the switch with clk_gt01MM so the fix reaches you.

