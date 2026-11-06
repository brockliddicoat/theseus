# B03: Clicks II: the switch and the signal

Read /home/claude/theseus/handoff/revamp2/common.md first, then this. Then FEEDBACK.md: every STANDING and DECIDED item
(`grep -n -E "STANDING|DECIDED" FEEDBACK.md`), F32 to F35, and every item this brief names. Never regress a decision.

Your file: deck/src/30-b03-switch.js. Your work folder: /home/claude/work/b03/ (PROGRESS.md, CHECKPOINT1.md, shots/).
Build: `cd /home/claude/theseus/deck && python3 tools/build.py main --out=b03 --own=30-b03-switch.js`.

## Where your slides sit in the film
- Before your first slide: `b02_pom` (b02): POM pads set the tolerance.
- After your last slide: `b04_card` (b04): Aim that goes where you put it.
- Within your file the slides play in the order below; hand each one to the next (common.md, M9 and "Clips and flow").

## Your slides, in film order, with the old slides each replaces and Brock's rating and note on each, verbatim

### `b03_switch` (chapter `click`): A mechanical switch, for the battery
The GT01 drawn accurately (H1 thickens its bottom-housing walls; use clk_gt01MM). The rival: optical switches that hold a light on all the time. Razer staff's "almost half the battery" for the Viper V4 Pro's optical switches and encoder, as a claim from Razer staff online via Brock (F31.1), beside the derived 18 % → +21 % battery for two switches. The magnetic encoder ties in (it moved to Electronics' "nothing lights up" slide: point there).

- replaces `clk_switch` (“A mechanical switch: Gateron GT01”) **5/10**: "bottom housing doesn’t look very accurate at all, i’ll attach a new reference when you ask, show the effect on battery life, razer says their optical encoder and switched account for almost half the battery life in the viper v4 pro (find quote), also i’d like to switch to using a halling effect/ magnetic encoder so we can say we should have double the battery luce efficiency as razer"
  - FEEDBACK items that name it: F28.1, F31.1 (read them)

### `b03_binning` (chapter `click`): Provable switch binning
His note: a lot of companies lie about their binning; Theseus can commit to bins it can prove (possibly with Hall-effect testing: say it is a proposal). Show a spread of switches' operating force, a rival's claimed bin against the measured spread, and Theseus's tested, narrow bin. We don't yet know if it is the GT01 itself or only its bottom-housing style (his note): say "GT01-style".

- replaces `clk_switch2` (“Operating force and rated life”) **2/10**: "largely irrelevant, we don’t even know if we’re going with the gt01 switch or just their style for the bottom housing, if you want to keep this you’d have to group it in with better binning practices, a lot of companies lie about their binning practices for switches, whereas we could commit to proveable bins (potentially using galling effect tech)"

### `b03_spdt` (chapter `click`): Single pole, double throw
"Difficult to understand" (his note). SPDT spelled out in big letters (F9.4), and the animation that makes it obvious: one pole, two throws; the pole leaves NC and lands on NO; the mouse sees both, so a bounce on one contact can't fake a click. Like a railway switch: one track, two destinations (or any better classroom image you find).

- replaces `clk_spdt` (“SPDT”) **5/10**: "difficult to understand"
  - FEEDBACK items that name it: F9.4 (read them)

### `b03_timing` (chapter `click`): Counted at first contact
One simple slide for the click timing (G10): a rival waits out a debounce window after the first contact; Theseus registers the moment the pole leaves NC, never waiting for motion. 72 → 70 µs at a glance (F18.5), every number with its method in one quiet line. What the player gets: the shot leaves when the finger says.

- replaces `latency` (“Counted at first contact”) **6/10**: "difficult to understand, i like that it sells something though, its hard to tell what is changing"
- replaces `clk_wait` (“Clicks that never wait for motion”) **3/10**: "hard to understand, probably can be combined somewhere else"
- replaces `clk_methods` (“Every click number has a method”) **3/10**: "probably can be combined somewhere else or removed"

### `b03_debounce` (chapter `click`): Debounce: low, and yours to set
His note: low debounce is good and important to most players, but some (Minecraft players) want it longer to count more double clicks. So: low by default, adjustable. Show a double click registering with a long window and a short one.

- replaces `clk_debounce` (“Debounce costs milliseconds”) **3/10**: "weak slide, also minecraft kids want to be able to adjust their debounce to count more double clicks, so i’m not sure how to feel about how this is being sold, low debounce is good and important though to most people, there is just a sub group of people who really dislike it"

### `b03_hotswap` (chapter `click`): Swap a switch in a minute
Why it matters first (his note: "there also is no argument"): a double-clicking switch ends most mice. Then the claw clips (Mill-Max 3305) large and clear, a pin entering the socket, no solder, 1,000 swaps. The player keeps the mouse, swaps the switch.

- replaces `clk_hotswap` (“Hot-swap switches on claw sockets”) **4/10**: "demonstration is plane and it’s hard to see the claw clips, there also is no argument as to why this is important"

### `b03_side` (chapter `click`): Dual rail side buttons
The same post and POM pads as the main buttons (uniformity), a guide that fits over a full-size SPDT switch (he wanted to see it before deciding the guide, F31.4), held by the shell (F12.4). "0 mice ship SPDT side buttons" (F11.4) and full-size switches at 29.31 g as proof of weight without compromise (F9.17). The rival made accurate, not lazy (his note): mini switches on a hinge. Not overbuilt.

- replaces `sidebuttons` (“Dual rail side buttons”) **5/10**: "left visualization fells lazy, right visualization doesn’t match the other dial rail plungers with prfe and it’s way overbuilt, important information though, it gets the point across okay, it just feels lazy"
  - FEEDBACK items that name it: F2.07, F9.16, F9.17, F12.4, F17.3, F31.4, F33.5 (read them)

## Also
K1's v22 clk_switch and sidebuttons are in deck/src/10-b-click.js: reuse their drawings.

