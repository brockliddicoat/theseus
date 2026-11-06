#!/usr/bin/env bash
# job 3, F27: every rated slide at settle, from v19 and v18 (exact published pages from git), one browser at a time
set -u
ids=$(python3 -c "import json; print(' '.join(x['id']+':settle' for x in json.load(open('/home/claude/work/fa/f27-rated.json'))))")
cd /home/claude/theseus
for v in v19 v18; do
  echo "=== $v $(date +%H:%M:%S)"
  nice -n 15 node feedback/snap.js /home/claude/work/fa/old/$v.html /home/claude/work/fa/f27/$v $ids > /home/claude/work/fa/f27/$v.jsonl 2> /home/claude/work/fa/f27/$v.err
  echo "rc $? lines $(wc -l < /home/claude/work/fa/f27/$v.jsonl)"
done
echo "=== done $(date +%H:%M:%S)"
