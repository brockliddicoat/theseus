#!/bin/sh
# Final shots at 2x on both themes:  sh lattice/tools/shots.sh [filter]   (run from 3d/)
cd "$(dirname "$0")/../.." || exit 1
S="node lattice/tools/shot.mjs lattice/test.html"
shot() { name=$1; q=$2; for th in paper night; do
  case "$name" in *$FILTER*) ;; *) continue;; esac
  $S lattice/shots/${name}_${th}.png --w=1600 --h=900 --scale=2 --wait=600000 --q="$q&theme=$th" | tail -1; done; }
FILTER=${1:-}
shot hero_cutaway   "cut=1&cutmode=quarter&view=-0.9:0.52:0.62&margin=0.74&pcb=0.85"
shot section_side   "cut=1&view=-1:0.22:0.12&margin=0.7&pcb=0"
shot underside      "view=-0.32:-0.82:0.48&margin=0.82&pcb=0&under=1"
shot fillet_macro   "cut=1&fillet=1&pcb=0"
shot tri_vs_hex     "compare=both&view=0:-1:0.0001&margin=0.92&pcb=0&under=1&labels=1&lblz=-67"
shot stress_press   "cut=1&view=-1:0.22:0.12&margin=0.7&pcb=0&stress=1&flow=1&case=press&legend=1&t=0.35"
shot stress_compare "compare=both&view=0:-1:0.0001&margin=0.92&pcb=0&under=1&stress=1&case=press&legend=1&legendpos=top&labels=1&lblz=-67"
shot stress_squeeze "cut=1&view=-1:0.22:0.12&margin=0.7&pcb=0&stress=1&flow=1&case=squeeze&legend=1&t=0.35"
shot build_mid      "cut=1&view=-1:0.22:0.12&margin=0.7&pcb=0&build=0.45"
