# usage: H=<built html> python3 specs.py id1 id2 ...  -> "id:0 id:0.6 id:<mid> id:<settle>" (FOUR=0: "id:0 id:<mid> id:<settle>")
# settle read from the built html's S({...}) blocks (H), else from the live source
import re, glob, sys, os
FOUR = os.environ.get('FOUR', '1') == '1'
st = {}
srcs = [open(os.environ['H'], encoding='utf-8', errors='replace').read()] if os.environ.get('H') else [open(f).read() for f in glob.glob('/home/claude/live/deck/src/30-b*.js')]
for src in srcs:
    for m in re.finditer(r"S\((?:\w+\()?\{", src):
        c = src[m.end():m.end() + 900]
        i = re.search(r"id:\s*'([^']+)'", c); s = re.search(r"settle:\s*([\d.]+)", c)
        if i and s and i.group(1) not in st: st[i.group(1)] = float(s.group(1))
out = []
for a in sys.argv[1:]:
    s = st.get(a)
    if s is None: print('#no', a, file=sys.stderr); continue
    mid = round(0.4 * s, 2)
    fm = lambda v: ('%g' % v)
    out += ([f'{a}:0', f'{a}:0.6'] if FOUR else [f'{a}:0']) + [f'{a}:{fm(mid)}', f'{a}:{fm(s)}']
print(' '.join(out))
