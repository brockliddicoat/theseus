#!/bin/bash
# Final renders (2x) for the Theseus shell. Run from anywhere: bash render_finals.sh [subset]
# Writes 3d/shell/shots/*.png
cd /home/claude/theseus/3d || exit 1
OUT=shell/shots; mkdir -p $OUT
shot() { # name query [w h]
  local n=$1 q=$2 w=${3:-1600} h=${4:-900}
  if [ -n "$SKIP_EXISTING" ] && [ -f "$OUT/$n.png" ]; then return; fi
  node tools/shot.mjs shell/test.html $OUT/$n.png --w=$w --h=$h --scale=2 --q="$q" 2>&1 | grep -v '^saved' | head -3
  echo "  $n"
}
SET=${1:-all}
if [ "$SET" = all ] || [ "$SET" = main ]; then
  for th in paper night; do
    shot theseus-hero-$th        "view=hero&theme=$th"
    shot theseus-top-$th         "view=top&theme=$th"
    shot theseus-left-$th        "view=left&theme=$th"
    shot theseus-front-$th       "view=front&theme=$th"
    shot theseus-bottom-$th      "view=bottom&theme=$th"
    shot theseus-exploded-$th    "view=exploded&theme=$th&explode=1"
    shot theseus-cu-engraving-$th "view=cuEngrave&theme=$th"
    shot theseus-cu-chamfer-$th  "view=cuChamfer&theme=$th"
    shot theseus-cu-wheel-$th    "view=cuWheel&theme=$th&scroll=0.35"
  done
fi
if [ "$SET" = all ] || [ "$SET" = extra ]; then
  shot theseus-hero-white-paper   "view=hero&theme=paper&colorway=white"
  shot theseus-hero-forged-night  "view=hero&theme=night&colorway=forged"
  shot theseus-xray-night         "view=hero&theme=night&xray=1"
  shot theseus-xray-half-paper    "view=hero&theme=paper&xray=0.6"
  shot theseus-click-L-x6-paper   "view=left&theme=paper&click=L:1&exag=6"
  shot theseus-side-button-paper  "view=cuSide&theme=paper&side=0:1&exag=2"
  shot theseus-cu-side-mark-paper "view=cuSide&theme=paper"
  shot theseus-heroRear-paper     "view=heroRear&theme=paper"
fi
if [ "$SET" = all ] || [ "$SET" = compare ]; then
  shot sora-hero-paper   "view=hero&theme=paper&variant=sora"
  shot sora-top-paper    "view=top&theme=paper&variant=sora"
  shot sora-left-paper   "view=left&theme=paper&variant=sora"
  shot sora-front-paper  "view=front&theme=paper&variant=sora"
fi
