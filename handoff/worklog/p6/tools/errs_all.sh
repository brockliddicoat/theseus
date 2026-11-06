#!/bin/bash
# P6: errs on all 32 of my slides against the live shared files (dist/main-p6live.html), 5 slides (35 page loads) per batch, one batch at a time
cd /home/claude/theseus/deck
export NODE_PATH=/opt/npm-tools/node_modules Q='&2d=1'
F=/home/claude/theseus/deck/dist/main-p6live.html
for B in "b12_latopt b12_ribs b05_card b05_specific b05_wall" "b05_material b05_cubed b05_fallacy b05_nopick b05_hotspot" \
         "b05_margin b05_work b06_lattice b06_light b06_arch" "b06_thrust b06_arches b06_fibres b06_fillet b06_filletsize" \
         "b06_mold b07_shcard b07_size b07_sides b07_arms" "b07_board b07_balance b07_newton b07_tolerance b07_poron" "b07_sheet b07_emg"; do
  echo "== batch $(date +%H:%M:%S): $B"
  node tools/errs.js $F $B 2>&1 | tail -6
done
echo "== done $(date +%H:%M:%S)"
