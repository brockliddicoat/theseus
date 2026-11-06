import re, sys
p = sys.argv[1]; s = open(p).read(); n0 = s
def warm(r, g, b):
    mx, mn = max(r, g, b), min(r, g, b)
    return mx - mn <= 18 and r - b >= 2 and mx > mn
def L(r, g, b): return round(0.299 * r + 0.587 * g + 0.114 * b)
# token patterns first
s = re.sub(r"TH \? 'rgba\(17,17,17,([\d.]+)\)' : 'rgba\(243,242,238,([\d.]+)\)'", r"rgba(C.ink, TH ? \1 : \2)", s)
s = s.replace("TH ? '#2E2E2C' : '#F3F2EE'", "TH ? C.ink2 : C.ink")
s = s.replace("color: TH ? C.ink : '#F3F2EE'", "color: C.ink")
s = s.replace("'rgba(243,242,238,0.5)'", "rgba(C.ink, 0.5)")
s = s.replace("{ lw: 2, fill: '#1A1B1E' }", "{ lw: 2, fill: C.panel }").replace("{ fill: '#1A1B1E' }", "{ fill: C.panel }")
for nm in ["col: '#F3F2EE'", "color: '#F3F2EE'"]:
    s = s.replace(nm, nm.split(':')[0] + ': C.ink')
cnt = [0]
def hexrep(m):
    h = m.group(1); r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    if not warm(r, g, b): return m.group(0)
    v = L(r, g, b); cnt[0] += 1
    return "'#%02X%02X%02X'" % (v, v, v)
s = re.sub(r"'#([0-9A-Fa-f]{6})'", hexrep, s)
def rgbrep(m):
    r, g, b = int(m.group(1)), int(m.group(2)), int(m.group(3))
    if not warm(r, g, b): return m.group(0)
    v = L(r, g, b); cnt[0] += 1
    return 'rgba(%d,%d,%d,' % (v, v, v)
s = re.sub(r"rgba\((\d+),\s*(\d+),\s*(\d+),", rgbrep, s)
# water and sweat: colourless (blue is Theseus only)
s = s.replace("'rgba(205,220,236,0.8)'", "'rgba(222,222,224,0.8)'").replace("'rgba(225,236,248,0.9)'", "'rgba(238,238,240,0.9)'").replace("'rgba(168,196,224,0.55)'", "'rgba(200,200,204,0.5)'")
open(p, 'w').write(s)
print('warm literals converted:', cnt[0], 'changed' if s != n0 else 'same')
