# usage: python3 reply.py <file> <anchor text> <reply file> : inserts the reply's lines after the line containing the anchor
# (the anchor must occur exactly once); the reply is inserted as-is (callers write the "> P1 ..." prefix themselves)
import sys
f, anchor, rf = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(f).read(); r = open(rf).read().rstrip('\n') + '\n'
n = s.count(anchor)
if n != 1: sys.exit(f'anchor found {n} times: {anchor!r}')
i = s.index(anchor); j = s.find('\n', i)
j = len(s) if j < 0 else j + 1
open(f, 'w').write(s[:j] + r + s[j:])
print('inserted after', repr(s[i:s.find(chr(10), i)][:80]))
