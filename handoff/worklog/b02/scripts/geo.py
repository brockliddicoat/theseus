import json, sys
def rings(path, key_sub, view='1'):
    d = json.load(open(path)); q = 1 / d['q']; out = []
    for m in d['meshes']:
        if key_sub in m['path']:
            for r in m['rings'].get(view, []):
                u = v = 0; pts = []
                dd = r['d']
                for i in range(0, len(dd), 2):
                    u += dd[i]; v += dd[i + 1]; pts.append((u * q, v * q))
                out.append((m['path'], r['h'], pts))
    return out
if __name__ == '__main__':
    for f in ['shell', 'shell-sora']:
        for p, h, pts in rings('/home/claude/theseus/deck/geo2d/%s.json' % f, sys.argv[1] if len(sys.argv) > 1 else 'trigger', sys.argv[2] if len(sys.argv) > 2 else '1'):
            xs = [a for a, b in pts]; ys = [b for a, b in pts]
            print(f, p, 'hole' if h else 'outer', len(pts), 'x', round(min(xs), 2), round(max(xs), 2), 'y', round(min(ys), 2), round(max(ys), 2))
