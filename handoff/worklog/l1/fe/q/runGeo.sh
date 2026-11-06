#!/bin/bash
# the final model's patterns in top view, once the planner has written all five
while pgrep -f "stageF.py" > /dev/null; do sleep 5; done
cd /home/claude/work/l1/tools && L1_CREASE=slope nice -n 19 python3 b12_geo.py > /home/claude/work/l1/out/b12_geo_F.log 2>&1
