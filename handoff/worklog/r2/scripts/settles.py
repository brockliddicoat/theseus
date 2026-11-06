# usage: python3 settles.py <ids.json> [skip ids...] : prints "id:<settle>" for every slide (settle from the live source)
import re, glob, sys, json
st = {}
for f in glob.glob('/home/claude/live/deck/src/30-b*.js'):
    src = open(f).read()
    for m in re.finditer(r"S\(\{", src):
        c = src[m.end():m.end() + 900]
        i = re.search(r"id:\s*'([^']+)'", c); s = re.search(r"settle:\s*([\d.]+)", c)
        if i and s: st[i.group(1)] = float(s.group(1))
ids = json.load(open(sys.argv[1])); skip = set(sys.argv[2:])
print(' '.join(f"{i}:{st[i]:g}" for i in ids if i in st and i not in skip))
