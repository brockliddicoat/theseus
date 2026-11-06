#!/bin/bash
# prints what changed since the last run in the files P3 watches (line counts + newest section headers)
S=/home/claude/work/p3/watch.state; touch $S
for f in /home/claude/work/review/b01.md /home/claude/work/review/b04.md /home/claude/work/review/FILM.md /home/claude/theseus/handoff/revamp2/KIT.md /home/claude/work/POLISH.md /home/claude/theseus/FEEDBACK.md; do
  n=$(wc -l < $f); o=$(grep "^$f " $S | awk '{print $2}'); o=${o:-0}
  if [ "$n" != "$o" ]; then echo "== $f: $o -> $n lines"; grep -n "^## \|^- 2026-11-06 1[0-9]:[0-9][0-9] (K\|^- 2026-11-06 1[0-9]:[0-9][0-9] (H\|^- 2026-11-06 1[0-9]:[0-9][0-9] (S" $f | tail -3 | cut -c1-170; fi
  grep -v "^$f " $S > $S.t; echo "$f $n" >> $S.t; mv $S.t $S
done
date
