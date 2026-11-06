#!/bin/bash
# after stage C: the root fillet on the winning section (skin 0.60, rib 0.36 x 1.80)
while pgrep -f "runC.sh" > /dev/null; do sleep 5; done
cd /home/claude/work/l1/fillet && nice -n 5 python3 tjunction.py 0.60 0.36 1.80 > /home/claude/work/l1/out/fillet_root_win.log 2>&1
