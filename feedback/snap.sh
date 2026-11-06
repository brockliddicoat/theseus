#!/usr/bin/env bash
# feedback/snap.sh: frames of the slides a FEEDBACK.md entry is about, as they were when Brock wrote (F50.1).
#
# usage: feedback/snap.sh <entry> <html> <slide[:t[,t...]]>...
#   <entry>   the entry's id (F43, F27, F51 ...): frames go to feedback/frames/<entry>/, with a README.md
#   <html>    the build that was live when he wrote: a saved build (/home/claude/work/int/film/main-*.html), or the
#             commit built in a worktree:  git worktree add --detach /tmp/wt <commit> && (cd /tmp/wt && python3
#             deck/tools/build.py main)  then  /tmp/wt/deck/dist/main.html  (remove the worktree afterwards)
#   slide:t   a slide id and its times: seconds, first (t = 0), mid (0.4 x the slide's settle), settle; several times
#             separated by commas; no times = first,mid,settle. The specific moment if he names one.
# env (written into the README; they are the record, so give them):
#   WHEN='2026-11-06 09:31'                    the message's time (Chicago)
#   LIVE='v1793975367-421d (published 08:29)'  the live artifact version at that time
#   COMMIT='7fb9826'                           the commit the build came from (or the nearest one, said so)
#   BUILD='...'                                how the build was made, if <html> doesn't say it
#   NOTE='...'                                 one line: why these slides and moments
#   TAG='0952'                                 a prefix for the file names, when one entry has frames from two builds
#   Q='&2d=1'                                  extra URL parameters (default &2d=1: the 2D film)
# Frames: 1920 x 1080 from the deck's capture hook (?cap=1&s=<id>&t=<t>), saved as 1280 px JPG (quality 82).
# One browser, one page, one frame at a time: the machine is shared. Then link the folder from the entry in
# FEEDBACK.md ("Frames: feedback/frames/<entry>/").
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ $# -lt 3 ]; then sed -n '2,24p' "${BASH_SOURCE[0]}"; exit 2; fi
entry="$1"; html="$(readlink -f "$2")"; shift 2
[ -f "$html" ] || { echo "no such build: $html" >&2; exit 2; }
out="$here/frames/$entry"; mkdir -p "$out"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
node "$here/snap.js" "$html" "$tmp" "$@" > "$tmp/frames.jsonl"
ENTRY="$entry" HTML="$html" OUT="$out" TMP="$tmp" python3 - <<'PY'
import json, os, datetime
from PIL import Image
e = os.environ
out, tmp, tag = e['OUT'], e['TMP'], e.get('TAG', '')
rows = [json.loads(l) for l in open(os.path.join(tmp, 'frames.jsonl')) if l.strip().startswith('{')]
if not rows: raise SystemExit('no frames rendered')
def moment(r):
    t, s = r['t'], r['settle']
    if t == 0: return 'frame one'
    if abs(t - s) < 1e-6: return 'settle'
    if abs(t - round(0.4 * s, 2)) < 1e-6: return 'mid'
    return f't = {t:g} s'
lines = []
for r in rows:
    name = (tag + '_' if tag else '') + os.path.basename(r['png'])[:-4] + '.jpg'
    im = Image.open(r['png']).convert('RGB')
    im = im.resize((1280, round(im.height * 1280 / im.width)), Image.LANCZOS)
    im.save(os.path.join(out, name), quality=82, optimize=True, progressive=True)
    lines.append(f"| [{name}]({name}) | `{r['id']}` | {r['i'] + 1} / {r['n']} | {r['title'] or ''} | {r['t']:g} | {moment(r)} |")
readme = os.path.join(out, 'README.md')
now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
head = '' if os.path.exists(readme) else (
    f"# {e['ENTRY']}: the slides as Brock saw them\n\n"
    f"Frames for FEEDBACK.md {e['ENTRY']} (F50.1): what the live film showed when he wrote. Each section is one build.\n"
    "Rendered with feedback/snap.sh: 1920 x 1080 frames from the deck's capture hook (?cap=1&s=<id>&t=<t>&2d=1),\n"
    "saved as 1280 px JPG. \"Place\" is the slide's position in that build; t is seconds into the slide.\n")
sec = [f"\n## {e.get('WHEN', '(time not given)')}: {e.get('LIVE', '(live version not given)')}\n",
       f"- Entry: {e['ENTRY']}; message time {e.get('WHEN', '(not given)')} (Chicago).",
       f"- Live artifact version then: {e.get('LIVE', '(not given)')}.",
       f"- Build: {e['HTML']}" + (f" ({e['BUILD']})" if e.get('BUILD') else '') + '.',
       f"- Git commit: {e.get('COMMIT', '(not given)')}.",
       f"- Rendered {now}." + (f" {e['NOTE']}" if e.get('NOTE') else ''),
       '', '| Frame | Slide | Place | Title | t (s) | Moment |', '|---|---|---|---|---|---|'] + lines
with open(readme, 'a') as f: f.write(head + '\n'.join(sec) + '\n')
print(f"{len(rows)} frames -> {out}")
PY
