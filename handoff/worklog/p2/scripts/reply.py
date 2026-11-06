# usage: python3 reply.py <review file> <anchor substring (unique line)> <reply text>
# inserts "> **P2 reply (HH:MM):** text" on the line after the anchor's line (after any replies already there)
import sys, datetime, re
p, anchor, txt = sys.argv[1], sys.argv[2], sys.argv[3]
L = open(p).read().split('\n')
idx = [i for i, l in enumerate(L) if anchor in l]
if len(idx) != 1: sys.exit('anchor found %d times: %s' % (len(idx), anchor))
i = idx[0] + 1
while i < len(L) and L[i].startswith('>'): i += 1
now = datetime.datetime.now().strftime('%H:%M')
L.insert(i, '> **P2 reply (%s, polish agent):** %s' % (now, txt))
open(p, 'w').write('\n'.join(L))
print('inserted at line', i + 1)
