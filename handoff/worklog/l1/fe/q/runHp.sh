#!/bin/bash
while pgrep -f "q/runH.sh" > /dev/null; do sleep 5; done
cd /home/claude/work/l1/fe && nice -n 5 python3 sweep.py stageHp.json > stageHp.out 2>&1
