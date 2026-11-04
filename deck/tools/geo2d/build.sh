#!/bin/sh
# Rebuild the 2D twins (deck/geo2d/*.json) from the 3D assets.
# Run from deck/ after building the 3D bundle (cd ../3d && node integration/build.mjs) and the deck (python3 tools/build.py main).
# Needs playwright (NODE_PATH pointing at a node_modules that has it), python3 with numpy and opencv.
set -e
mkdir -p dev/geo2d-raw geo2d
node tools/geo2d/export.js "$PWD/dist/main.html" dev/geo2d-raw
for k in shell shell-sora pcb gt01 wheel claw screw skates battery; do
  python3 tools/geo2d/silhouettes.py dev/geo2d-raw/$k.json geo2d/$k.json
done
python3 tools/geo2d/extras.py ../3d/pcb/pcb-layout.json geo2d/pcb.json
python3 tools/geo2d/lattice2d.py ../3d/lattice/assets geo2d/lattice.json
python3 tools/build.py main rec
