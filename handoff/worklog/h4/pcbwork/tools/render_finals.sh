#!/bin/bash
# Final 2x renders for the deck -> 3d/pcb/shots/. Skips files that already exist (delete one to re-render it).
#   bash pcb/tools/render_finals.sh            (run from anywhere; ~4 min per shot under SwiftShader)
cd /home/claude/theseus/3d
S=pcb/shots
shot() {  # name w h query [extra flags]
  local out="$S/$1.png"
  if [ -s "$out" ]; then echo "skip $1"; return; fi
  local t0=$(date +%s)
  bash pcb/tools/shot.sh "$out" "$2" "$3" "$4" --scale=2 ${5:-} | tail -1
  echo "  $1: $(( $(date +%s) - t0 ))s"
}
TOP="ortho=1&view=top&halfh=31.5"
EXPL="view=exploded&explode=1&dir=-0.9,0.9,0.8&margin=0.7"
ANT="view=antenna&hide=WHEEL,U1&xray=0.85"
shot top_transparent      1200 1400 "$TOP&theme=paper&transparent=1" --transparent
shot top_paper            1200 1400 "$TOP&theme=paper"
shot top_night            1200 1400 "$TOP&theme=night"
shot hero_paper           1600 1000 "view=hero&theme=paper"
shot hero_night           1600 1000 "view=hero&theme=night"
shot exploded_night       1600 1100 "$EXPL&theme=night&ground=0"
shot exploded_paper       1600 1100 "$EXPL&theme=paper"
shot module_night         1600 1100 "view=module&theme=night"
shot module_paper         1600 1100 "view=module&theme=paper"
shot antenna_keepout_night 1400 960 "$ANT&theme=night"
shot antenna_keepout_paper 1400 960 "$ANT&theme=paper"
shot pmic_paper           1400 960 "view=pmic&theme=paper"
shot pmic_night           1400 960 "view=pmic&theme=night"
shot power_charge_night   1050 1225 "$TOP&theme=night&power=1&mode=charge&t=0.35"
shot power_run_night      1050 1225 "$TOP&theme=night&power=1&mode=run&t=0.35"
shot xray_night           1050 1225 "$TOP&theme=night&xray=1"
shot xray_paper           1050 1225 "$TOP&theme=paper&xray=1"
shot reflow_night         1400 875 "view=hero&theme=night&reflow=0.68"
shot reflow_pmic_night    1400 960 "view=pmic&theme=night&reflow=0.69"
shot bottom_night         1050 1225 "ortho=1&view=bottom&halfh=31.5&theme=night"
shot bottom_paper         1050 1225 "ortho=1&view=bottom&halfh=31.5&theme=paper"
shot side_paper           1400 700  "view=side&theme=paper"
shot side_night           1400 700  "view=side&theme=night"
shot switch_hotswap_night 1400 1000 "view=switch&theme=night&lift=SW1:5.5"
shot switch_hotswap_paper 1400 1000 "view=switch&theme=paper&lift=SW1:5.5"
shot power_charge_paper   1050 1225 "$TOP&theme=paper&power=1&mode=charge&t=0.35"
shot power_run_paper      1050 1225 "$TOP&theme=paper&power=1&mode=run&t=0.35"
shot reflow_paper         1400 875 "view=hero&theme=paper&reflow=0.68"
shot xray_hero_night      1400 875 "view=hero&theme=night&xray=1&explode=0.6"
echo ALL DONE
