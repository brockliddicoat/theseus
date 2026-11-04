#!/bin/sh
# Rebuild the 2D twins (deck/geo2d/*.json) from the 3D assets.
# Run from deck/ after building the 3D bundle (cd ../3d && node integration/build.mjs).
# Needs playwright (NODE_PATH pointing at a node_modules that has it), python3 with numpy and opencv.
#
# It builds its own deck (dist/main-r3d.html, from 08-r3d.js, 08-v2d.js, the live bundle and the live twins; every other
# file from the snapshot), never dist/main.html or dist/rec.html, and writes each twin through a temp file.
# Feature lines (sharp edges, hidden lines removed) go into the encoder's, the screw's, the switch's and the claw's
# twins, and into the board's wheel, module and sensor: LINES below.
set -e
OWN=08-r3d.js,08-v2d.js,vendor,geo2d
mkdir -p dev/geo2d-raw geo2d
python3 tools/build.py main --out=r3d --own=$OWN
node tools/geo2d/export.js "$PWD/dist/main-r3d.html" dev/geo2d-raw ${SCENES:-}
for k in ${SCENES:-shell shell-sora pcb gt01 wheel claw screw skates battery}; do
  case $k in
    wheel|screw|gt01|claw) LINES='--lines=.' ;;
    pcb) LINES='--lines=(WHEEL|U1|U3|LENS|SW[12])/' ;;
    *) LINES='' ;;
  esac
  python3 tools/geo2d/silhouettes.py dev/geo2d-raw/$k.json geo2d/$k.json $LINES
done
case " ${SCENES:-pcb} " in *" pcb "*) python3 tools/geo2d/extras.py ../3d/pcb/pcb-layout.json geo2d/pcb.json ;; esac
[ -n "${SCENES:-}" ] || python3 tools/geo2d/lattice2d.py ../3d/lattice/assets geo2d/lattice.json
python3 tools/build.py main --out=r3d --own=$OWN
