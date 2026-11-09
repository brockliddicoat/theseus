"""Q7, step 1: reproduce the stored long-arc trials from an untouched copy of the code and compare them with
deck/tools/gd/out/longarcs.json (the file the deck embeds through export_deck.py).

Runs the four trials one after another (no pool), from research/gd/redo/model (a byte-for-byte copy of deck/tools/gd).
Writes research/gd/redo/out/repro_longarcs.json and prints the differences.
Run: nice -n 10 python3 research/gd/redo/scripts/repro.py
"""
import json, os, sys, time
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..'))
sys.path.insert(0, os.path.join(ROOT, 'model'))
import longarcs as LA

STORED = json.load(open(os.path.abspath(os.path.join(ROOT, '..', '..', '..', 'deck', 'tools', 'gd', 'out', 'longarcs.json'))))
out = {'trials': {}}
keys = [g + '_' + pk for g in ('heel', 'lifted') for pk in ('sym', 'fwd')]
if len(sys.argv) > 1: keys = [k for k in keys if k in sys.argv[1:]]
for key in keys:
    t0 = time.time(); k, o = LA.run_one(key); out['trials'][k] = o
    s = STORED['trials'][k]; e, se = o['end'], s['end']
    print('%-10s %5.0f s | loss %.6f (stored %.6f) at step %d (stored %d) | final max|dp| vs stored %.2e | R thumb %.3f (%.3f) pinky %.3f (%.3f) groove %.3f (%.3f) | z_bottom %.3f (%.3f) | dev %.4f (%.4f)' % (
        k, time.time() - t0, o['loss'][-1], s['loss'][-1], len(o['loss']), len(s['loss']), float(np.abs(np.array(o['final']) - np.array(s['final'])).max()),
        e['R']['thumb'], se['R']['thumb'], e['R']['pinky'], se['R']['pinky'], e['R']['groove'], se['R']['groove'], e['thumb']['z_bottom'], se['thumb']['z_bottom'], e['dev']['plan'], se['dev']['plan']), flush=True)
    json.dump(LA.clean(out), open(os.path.join(ROOT, 'out', 'repro_longarcs.json'), 'w'))
print('done')
