#!/bin/bash
# the fine mesh (h 0.55) for the four other patterns and the winner's depth family (the winner at 0.55 is G-win-h0.55)
cd /home/claude/work/l1/fe
L1_CREASE=slope nice -n 5 python3 sweep.py stageH.json > stageH.out 2>&1
