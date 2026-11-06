# usage: python3 specs.py id1 id2 ...  -> prints "id:0 id:0.6 id:<mid> id:<settle>" using settle from the live source
import re, glob, sys, os
FOUR = os.environ.get('FOUR') == '1'
st = {}
for f in glob.glob('/home/claude/live/deck/src/30-b*.js'):
    src = open(f).read()
    for m in re.finditer(r"S\(\{", src):
        c = src[m.end():m.end() + 900]
        i = re.search(r"id:\s*'([^']+)'", c); s = re.search(r"settle:\s*([\d.]+)", c)
        if i and s: st[i.group(1)] = float(s.group(1))
out = []
for a in sys.argv[1:]:
    s = st.get(a)
    if s is None: print('#no', a, file=sys.stderr); continue
    mid = round(0.4 * s, 2)
    fm = lambda v: ('%g' % v)
    out += ([f'{a}:0', f'{a}:0.6'] if FOUR else [f'{a}:0']) + [f'{a}:{fm(mid)}', f'{a}:{fm(s)}']
print(' '.join(out))
