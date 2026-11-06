#!/bin/bash
# one solver process at a time: wait for the planner, then the FE on stage C
cd /home/claude/work/l1/fe
while pgrep -f "stageC.py" > /dev/null; do sleep 5; done
nice -n 5 python3 sweep.py stageC.json > stageC.out 2>&1
