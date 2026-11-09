"""Re-derive the ANSUR II men's (and women's) hand figures from the public CSV.
Usage: python3 -I ansur_check.py /path/to/male.csv [/path/to/female.csv]
The CSV is the public ANSUR II file (tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv). Values are in mm."""
import csv, sys, statistics as st, math, json

def load(p):
    with open(p, newline='', encoding='latin-1') as f:
        return list(csv.DictReader(f))

def pct(a, q):
    a = sorted(a); k = (len(a) - 1) * q; f = int(k); c = min(f + 1, len(a) - 1)
    return a[f] + (a[c] - a[f]) * (k - f)

def corr(x, y):
    mx, my = st.mean(x), st.mean(y)
    return sum((a - mx) * (b - my) for a, b in zip(x, y)) / math.sqrt(sum((a - mx) ** 2 for a in x) * sum((b - my) ** 2 for b in y))

out = {}
for path in sys.argv[1:]:
    rows = load(path)
    cols = [c for c in rows[0].keys() if any(k in c.lower() for k in ('hand', 'palm', 'thumb', 'wrist', 'finger'))]
    print(path, 'n', len(rows), 'hand-related columns:', cols)
    res = {'n': len(rows)}
    for c in ('handlength', 'palmlength', 'handbreadth', 'handcircumference', 'wristcircumference', 'thumbtipreach', 'stature'):
        if c not in rows[0]: continue
        v = [float(r[c]) for r in rows if r.get(c)]
        res[c] = {'mean': st.mean(v), 'sd': st.stdev(v), 'p5': pct(v, .05), 'p50': pct(v, .5), 'p95': pct(v, .95), 'min': min(v), 'max': max(v), 'n': len(v)}
        print('  %-20s n %d mean %.2f sd %.2f p5 %.1f p50 %.1f p95 %.1f min %.0f max %.0f' % (c, len(v), res[c]['mean'], res[c]['sd'], res[c]['p5'], res[c]['p50'], res[c]['p95'], min(v), max(v)))
    hl = [float(r['handlength']) for r in rows]; pl = [float(r['palmlength']) for r in rows]; hb = [float(r['handbreadth']) for r in rows]
    d3 = [a - b for a, b in zip(hl, pl)]   # middle finger from the proximal palm... (hand length minus palm length)
    res['hand_minus_palm'] = {'mean': st.mean(d3), 'sd': st.stdev(d3), 'p5': pct(d3, .05), 'p95': pct(d3, .95)}
    res['corr'] = {'hand_palm': corr(hl, pl), 'hand_breadth': corr(hl, hb), 'hand_finger': corr(hl, d3), 'palm_finger': corr(pl, d3)}
    res['ratios'] = {'palm_over_hand': st.mean(p / h for p, h in zip(pl, hl)), 'breadth_over_hand': st.mean(b / h for b, h in zip(hb, hl)),
                     'breadth_over_hand_sd': st.stdev(b / h for b, h in zip(hb, hl)), 'finger_over_hand': st.mean(d / h for d, h in zip(d3, hl)), 'finger_over_hand_sd': st.stdev(d / h for d, h in zip(d3, hl))}
    print('  hand - palm (digit 3 from its crease): mean %.2f sd %.2f p5 %.1f p95 %.1f' % (res['hand_minus_palm']['mean'], res['hand_minus_palm']['sd'], res['hand_minus_palm']['p5'], res['hand_minus_palm']['p95']))
    print('  correlations:', {k: round(v, 3) for k, v in res['corr'].items()})
    print('  ratios:', {k: round(v, 4) for k, v in res['ratios'].items()})
    # hand breadth at the 5th / 95th hand LENGTH (regression), to see whether scaling everything by k is fair
    mx, my = st.mean(hl), st.mean(hb); b = sum((a - mx) * (c - my) for a, c in zip(hl, hb)) / sum((a - mx) ** 2 for a in hl)
    print('  breadth on length regression: slope %.3f mm/mm; isometric slope would be %.3f' % (b, my / mx))
    mp = st.mean(d3); b2 = sum((a - mx) * (c - mp) for a, c in zip(hl, d3)) / sum((a - mx) ** 2 for a in hl)
    print('  finger (hand-palm) on length regression: slope %.3f; isometric %.3f' % (b2, mp / mx))
    out[path.split('/')[-1]] = res
print(json.dumps(out, indent=1)[:0])
