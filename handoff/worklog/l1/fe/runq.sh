#!/bin/bash
# run the stage lists one after another (one solver process at a time)
cd /home/claude/work/l1/fe
while pgrep -f "sweep.py stageA.json" > /dev/null; do sleep 10; done
nice -n 5 python3 sweep.py stageB.json > stageB.out 2>&1
