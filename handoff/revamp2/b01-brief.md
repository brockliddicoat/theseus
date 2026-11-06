# B01: Intro and close: every flagship compromises

Read /home/claude/theseus/handoff/revamp2/common.md first, then this. Then FEEDBACK.md: every STANDING and DECIDED item
(`grep -n -E "STANDING|DECIDED" FEEDBACK.md`), F32 to F35, and every item this brief names. Never regress a decision.

Your file: deck/src/30-b01-intro.js. Your work folder: /home/claude/work/b01/ (PROGRESS.md, CHECKPOINT1.md, shots/).
Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b01 --own=30-b01-intro.js`.

## Where your slides sit in the film
- Your first slide opens the film.
- Your last slide closes the film.
- Within your file the slides play in the order below; hand each one to the next (common.md, M9 and "Clips and flow").

## Your slides, in film order, with the old slides each replaces and Brock's rating and note on each, verbatim

### `b01_cover` (chapter `intro`): Theseus: zero compromises
Keep the cover's form, which he called very good and said not to stray from (F9.11): only the content changes, and no 2D mouse. PIAKNOW'S in capitals; "ZERO COMPROMISES" where 8 khz was (8 khz is standard now); density (0.099 g/cm³) where "100+ ideas" was. Motion: a premium entrance (the name rises out of its mask, the figures count), nothing busy.

- replaces `cover` (“Theseus: in pursuit of an objectively better mouse”) **8/10**: "PIAKNOW’S should be all capital, also instead of 8kh it should say something a lot there being zero compromises, 8khz is pretty much standard now"
  - FEEDBACK items that name it: F29.2 (read them)

### `b01_compromise` (chapter `intro`): Every flagship compromises
The problem the whole film answers. A grid of named flagships (Superstrike X3 counts as one; the GPX 2 less so), each lighting the one thing it trades away, in red, sourced: battery for weight, durability for weight, an optical switch's battery, a shape, the price. Then Theseus's row: every cell blue, nothing traded. Derive every blank (G5), one precision per column. The thesis's message ("optimization over opinion") can close it.

- replaces `flagships` (“Theseus against the flagships”) **6/10**: "need to derive all empty data, also it bothers me when one number has more decimal places than others, superstrike x3 is more id a flagship than gpx2"
  - FEEDBACK items that name it: F18.4 (read them)
- replaces `thesis` (“Optimization over opinion”) **3/10**: "all of these numbers feel very random, they’d message is good but you can add it to the slide about other companies misadvertising weights"
  - FEEDBACK items that name it: F24.1 (read them)

### `b01_battery` (chapter `intro`): Battery life, traded for weight
One of his important ideas (F33.5): most mice give up battery life to hit a weight. Battery hours against weight for the wireless flagships, the frontier they sit on, and Theseus past it. Research hard for missing weights and hours, or derive them (his note). Animate the trade: as a mouse gets lighter its battery shrinks along the frontier; Theseus leaves the curve.

- replaces `market` (“Battery life against weight”) **8/10**: "we need to man’s a bigger argument here how most mice compromise battery life for weight, research harder to find missing weights or derive"
  - FEEDBACK items that name it: F33.5 (read them)

### `b01_targets` (chapter `intro`): The targets
What zero compromises means in numbers, on one dense, calm slide: "Dual 8khz wired and wireless", press to PC (shorter: the click work cuts mechanical latency), the weight headlined against the Starlight X. Set-down and idle sleep stay out this early (his note).

- replaces `targets` (“Targets, part one: speed”) **8/10**: "marker it as dual 8khz, press to pc should be shorter, we’ve done numerous things to optimize mechanical latency"
- replaces `targets2` (“Targets, part two: everything else”) **7/10**: "compare to starlight x weight for the headline value. set down and idle sleep settings are not important enough to talk about this early"

### `b01_lighter` (chapter `intro`): Why lighter wins
One of his important ideas, argued properly (F9.26, F33.5): theoretical ease of control and how fast you change targets, from F = m·a, not "overall speed". Classroom demonstration first (two carts or pucks given the same push: the lighter one stops and reverses sooner), then a flick-and-stop on a target: same hand force, less mass, a shorter overshoot and a quicker reversal, shown with a crosshair landing on a target. A higher skill ceiling (F33.7) is the payoff. Before → after visible.

- replaces `zerograms` (“The optimal weight is zero grams”) **5/10**: "needs more reasoning, argument feels weak here, it should be more about theoretical ease of control and target changing speed, overall speed feels outlandish"
  - FEEDBACK items that name it: F9.26, F33.5 (read them)

### `b01_listed` (chapter `intro`): Listed against weighed
Rated 10/10: keep its data and honesty, raise the motion (each mouse's listed weight slides to its weighed weight; the gap fills red; Theseus weighed, printed, 0.00). It also carries the thesis's message, as he asked: the weight on the card is the scale's.

- replaces `weightgap` (“Listed against weighed”) **10/10**: "no comment"

### `b01_density` (chapter `intro`): Density, not weight
Problem first (his note): the X2F's wrong idea, getting light by getting small, so the solution doesn't feel useless. Then density as the measure that matters: the box L × W × H, the weight inside it, Pwnage's way. Outlines or silhouettes only, never detailed drawings (EloShapes outlines where they exist). Sell why low density matters to the player.

- replaces `ntr_density` (“Density, not weight”) **9/10**: "only use the outline or the shape/silhouete instead of something so detailed, good understandable demonstration, but you need to sell why low density is important a little better, the x2f having the wrong idea should come first, show the problem first, then sell the solution so the solution doesn’t feel useless"
  - FEEDBACK items that name it: F2.45, F33.5 (read them)

### `b01_illusion` (chapter `intro`): The size–weight illusion
Keep what worked (9/10): the X2F's outline in the box (find one), Theseus as an outline only. The illusion demonstrated: two objects of the same weight, the bigger feels lighter (Charpentier 1891, Buckingham 2014).

- replaces `ntr_sizewt` (“The size–weight illusion”) **9/10**: "find an outline of the x2f to add to the box, and same thing as last slide, the theseus should only be the shape outline"
  - FEEDBACK items that name it: F2.45 (read them)

### `b01_rank` (chapter `intro`): Ranked by density
Honest ranking among wireless mice (9/10): the X2F CrazyLight at its best-reported weight (reports say at least 29.5 g), one precision for every mouse (Theseus too), G-Wolves mice from EloShapes even where Theseus looks worse (his words: "its more honest"), the XA25 shown but not ranked (wired). Animate the re-ranking from weight order to density order.

- replaces `ntr_densrank` (“Ranked by density”) **9/10**: "it bother me the the x2f is lighter and lacks decimal points, this probably isn’t the most exact weight available for the x2f crazylight (reports online say it’s at least 29.5g), i also don’t like how the theseus has an extra decimal point. you also need to use eloshapes to take g wolves mice into account for there weights and density, yes this will make the theseus look worse, but its more honest"
  - FEEDBACK items that name it: F2.45, F12.3 (read them)

### `b01_price` (chapter `intro`): Price against weight
The Pareto front never kinks: it continues its trajectory (his note), drawn as a smooth monotone curve. Add the Viper Mini Signature Edition, the Zaunkoenig mice and the Superstrike X3. Theseus at $189.

- replaces `pricefront` (“Price against weight”) **7/10**: "the bottom pareto lineinstantly going straight bothers me a lot i should continue on the trajectory it was at for a little but bit, there should never be a kink in a pareto line, i think the viper mini signature edition and zaunkoenig mice need to be on this table as well, and the x3 superstrike"

### `b01_budget` (chapter `intro`): Where 29.31 g goes
The weight budget computed from the deck's own data so it updates itself (his note: "a lot of work to keep updating"): every part, Theseus's own screws (titanium), wires, the 0.9 g wheel, the board, the battery, what is left for the shell and skates. The ntr_stats facts that belong here go here; the rest go to their own slides (his note on ntr_stats).

- replaces `budget` (“Weight budget: 29.31 g, 200 h”) **6/10**: "it’s a lot of work to keep updating this one"
- replaces `ntr_stats` (“Theseus, by the numbers”) **4/10**: "density is so important it could be on the cover instead of the 100+ ideas, capitalize the P in Piaknow, it’s a name, all of this information is important but would fit better in other slides. also 8khz wired and wireless is better market as Dual 8khz wired and wireless. don’t capitalize the H in khz"
  - FEEDBACK items that name it: F2.28 (read them)

### `b01_close` (chapter `end`): Zero compromises
The close: every compromise from b01_compromise, answered, in one frame; the film's last word. In 3D mode no shell on the close (F12.2).

- replaces `close` (“Close”), not rated

## Also
You own the intro's data: research is much of your work (EloShapes, RTINGS, reviews, maker pages). Every number sourced or derived and marked, one precision per comparison. Research data lives in research/data/*.json (RDATA) and the helpers in 14-b-intro-ex.js; reuse them, add to them in your own file.

