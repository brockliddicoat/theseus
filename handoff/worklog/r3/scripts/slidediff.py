# usage: python3 slidediff.py <old.html> <new.html> : lists slide ids whose code changed: each slide's block runs from the end of
# the previous slide's S(...) call (so the helpers defined before it count as its own) to the end of its own S(...) call
import re, sys, hashlib
def blocks(p):
    t = open(p, encoding='utf-8', errors='replace').read()
    ms = list(re.finditer(r"S\((?:\w+\()?\{\s*id:\s*'([^']+)'", t))
    out, prev = {}, None
    for k, m in enumerate(ms):
        nxt = ms[k + 1].start() if k + 1 < len(ms) else min(len(t), m.start() + 200000)
        c = re.compile(r"\n\}\)+;").search(t, m.start(), nxt)
        end = c.end() if c else nxt
        start = prev if prev is not None and m.start() - prev < 400000 else m.start()
        out[m.group(1)] = hashlib.md5(t[start:end].encode()).hexdigest()
        prev = end
    return out
a, b = blocks(sys.argv[1]), blocks(sys.argv[2])
ch = [i for i in b if i in a and a[i] != b[i]]
print('changed:', ' '.join(i for i in ch if i[:1] == 'b' and i[3:4] == '_'))
print('added:', ' '.join(i for i in b if i not in a)); print('removed:', ' '.join(i for i in a if i not in b))
