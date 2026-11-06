#!/bin/bash
# after stage C: the winner with the fillet SCF element by element, then the root fillet on the winning section
while pgrep -f "runC.sh" > /dev/null; do sleep 5; done
cd /home/claude/work/l1/fe && nice -n 5 python3 winK.py 1.51 > /home/claude/work/l1/out/winK.log 2>&1
cd /home/claude/work/l1/fillet && nice -n 5 python3 tjunction.py 0.60 0.36 1.80 > /home/claude/work/l1/out/fillet_root_win.log 2>&1
