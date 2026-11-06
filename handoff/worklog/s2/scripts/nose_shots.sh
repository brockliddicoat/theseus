#!/bin/bash
# real-material nose shots (grey colorway, paper theme, no shadows), ~40 px/mm: side, front, top, 3/4 front
# usage: nose_shots.sh <name> <glb query part, e.g. "glb=/shell/work/s2nose/C_proud.glb" or "variant=sora">
cd /home/claude/theseus/3d || exit 1
N=$1; G=$2; O=/home/claude/work/s2/nose/real; mkdir -p $O
B="theme=paper&colorway=grey&shadows=0&$G"
node tools/shot.mjs shell/test.html $O/${N}_side.png  --w=1120 --h=880  --q="$B&cam=600,13,48&target=0,13,48&up=0,1,0&fov=2.10" 2>&1 | grep -v "GPU stall\|^saved" | head -2
node tools/shot.mjs shell/test.html $O/${N}_front.png --w=1440 --h=880  --q="$B&cam=16,13,650&target=16,13,50&up=0,1,0&fov=2.12" 2>&1 | grep -v "GPU stall\|^saved" | head -2
node tools/shot.mjs shell/test.html $O/${N}_top.png   --w=1440 --h=960  --q="$B&cam=16,600,50&target=16,0,50&up=0,0,1&fov=2.34" 2>&1 | grep -v "GPU stall\|^saved" | head -2
node tools/shot.mjs shell/test.html $O/${N}_34.png    --w=1400 --h=1100 --q="$B&cam=353,254,482&target=16,10,50&up=0,1,0&fov=3.25" 2>&1 | grep -v "GPU stall\|^saved" | head -2
echo "done $N"
