import csv, sys, statistics as st
def load(p):
    with open(p, newline='', encoding='latin-1') as f:
        r = csv.DictReader(f); rows = list(r)
    return rows
for name in ['male', 'female']:
    rows = load(sys.argv[1] + '/' + name + '.csv')
    hl = sorted(float(x['handlength']) for x in rows if x.get('handlength'))
    hb = sorted(float(x['handbreadth']) for x in rows if x.get('handbreadth'))
    n = len(hl)
    def pct(a, q): 
        k = (len(a) - 1) * q; f = int(k); c = min(f + 1, len(a) - 1); return a[f] + (a[c] - a[f]) * (k - f)
    print(name, 'n', n, 'hand length mm: mean %.1f sd %.1f p5 %.1f p50 %.1f p95 %.1f min %.0f max %.0f' % (st.mean(hl), st.stdev(hl), pct(hl, .05), pct(hl, .5), pct(hl, .95), hl[0], hl[-1]))
    print(name, 'hand breadth mm: mean %.1f sd %.1f p5 %.1f p50 %.1f p95 %.1f' % (st.mean(hb), st.stdev(hb), pct(hb, .05), pct(hb, .5), pct(hb, .95)))
