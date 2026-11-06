import json
D = json.load(open('/home/claude/theseus/research/data/mice.json'))
def v(x):
    if x is None: return None
    if isinstance(x, list): return v(x[0]) if x else None
    if isinstance(x, dict) and 'value' in x: return x['value']
    return x
def lab(x):
    if isinstance(x, list): x = x[0] if x else None
    return x.get('label', '') if isinstance(x, dict) else ''
TH = dict(name='Theseus', g=29.31, L=119.3, W=62.4, H=39.9)
rows = []
for m in D['mice']:
    if m['connection'] == 'wired' or m['id'] in ('finalmouse-ulx', 'mchose-l7-ultra'): continue
    L, W, H = v(m['length_mm']), v(m['width_mm']), v(m['height_mm'])
    me, cl = v(m.get('weight_measured_g')), v(m.get('weight_claimed_g'))
    g, ev = (me, 'RTINGS') if me is not None and lab(m.get('weight_measured_g')) == 'IM' else (cl, 'maker')
    rows.append(dict(name=m['name'], g=g, ev=ev, L=L, W=W, H=H))
# G-Wolves wireless, maker pages (shop.g-wolves.com), black or lightest listed
GW = [('G-Wolves HTS Plus Pro 8K', 28.0, 117, 61, 40, 'solid, carbon rod'), ('G-Wolves Warg 8K', 28.9, 117, 61, 40, 'solid, carbon rod'),
      ('G-Wolves Lycan 8K', 28.8, 119, 63, 37, 'solid'), ('G-Wolves HTS Ultra 8K', 31.0, 113, 61, 40, 'honeycomb; TPU scale 31 g'),
      ('G-Wolves HTX Ultra 8K', 32.1, 119.7, 64.1, 37.1, '?'), ('G-Wolves VUK 8K', 35.0, 124.8, 64.6, 38.1, '?'),
      ('G-Wolves HTM Plus 8K', 33.47, 127, 64, 37, '?'), ('G-Wolves HT-S2 Pro 8K', 28.4, 112, 61, 37, '?'),
      ('G-Wolves HT-S2 8K', 32.9, 110, 61, 37, '?'), ('G-Wolves HTX Mini 8K', 26.9, 109, 60, 35, 'golf-ball, 250 mAh 80 h'),
      ('G-Wolves HTR Pro 8K', 25.0, 92, 57, 33, 'TPU scale 25 g'), ('G-Wolves HTR 8K', 28.0, 92, 57, 35, ''),
      ('G-Wolves Fenrir Pro 8K', 18.9, 81.7, 61.2, 28.3, ''), ('G-Wolves Fenrir Max 8K', 22.4, 75, 61, 31, ''),
      ('G-Wolves HSK Pro v2.0 8K', 26.8, 73.7, 56, 29, ''), ('G-Wolves HTS Plus 8K', 46.0, 117, 61, 40, '')]
for n, g, L, W, H, note in GW: rows.append(dict(name=n, g=g, ev='G-Wolves' if 'TPU' not in note else 'TPU', L=L, W=W, H=H))
for r in rows:
    if r['name'].startswith('Pulsar X2F'): r['g'], r['ev'] = 29.5, 'reported'
rows.append(dict(name='Theseus', g=TH['g'], ev='target', L=TH['L'], W=TH['W'], H=TH['H']))
for r in rows: r['v'] = r['L'] * r['W'] * r['H'] / 1000; r['rho'] = r['g'] / r['v']
byW = sorted(rows, key=lambda r: r['g']); byD = sorted(rows, key=lambda r: r['rho'])
print('n =', len(rows))
print('%-36s %6s %-9s %7s %7s  wRank dRank' % ('mouse', 'g', 'src', 'cm3', 'g/cm3'))
for i, r in enumerate(byD):
    print('%-36s %6.1f %-9s %7.1f %7.3f  %4d %4d' % (r['name'][:36], r['g'], r['ev'], r['v'], r['rho'], byW.index(r) + 1, i + 1))
