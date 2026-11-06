# b03 checkpoint 1: b03_side ("Dual rail side buttons")

Slide id: **b03_side** (deck/src/30-b03-switch.js; replaces `sidebuttons`; paper; settle 12 s). Build: `python3 tools/build.py main --out=b03 --own=30-b03-switch.js`.

Frames (1920×1080, `&2d=1`): /home/claude/work/b03/shots/side6/31_b03_side_0.6.png, _2.png, _3.95.png, _5.png, _6.1.png, _8.6.png, _12.png (settle); phone view /home/claude/work/b03/shots/side6_phone_settle.png.

What it does: it starts on the mouse's top view and pushes in to a section through the front side button. A thumb presses the usual hinged button (living hinge, 2-pin mini switch on its own side board and ribbon cable) at three spots, and the force to click reads 1.62 / 0.67 / 0.37 N, with the classroom door (torque = F × d) moving in step beside it. At the tip the button bends on past the click.
Then it wipes in place to Theseus's rail (the main buttons' 2.4 mm post on POM pads, the stop on the guide, a full-size SPDT switch held by the shell). The same three presses read 0.54 N each, and the verdict is "Force spread (lower is better) 1.25 N → 0.00 N", followed by "0 other mice with SPDT side buttons" and "29.31 g with four full-size SPDT switches".

Checks: errs.js passes at 0.5, 2, 3.95, 5, 6.1, 7.5, 8.5, 9.6 and 12 s. qa.js is clean at settle (12 s) and at mid (4.8 s).
