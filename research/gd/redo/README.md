# research/gd/redo: the contact-and-forces research, redone (RB, 2026-11-09)

The report is `feel-and-forces.md`. Everything here is separate from the deck: nothing in `deck/` or in
`research/gd/shape-gd.json` was changed.

## What is here

| Path | What it is |
|---|---|
| `feel-and-forces.md` | the report: what changed, the verdict table, the findings, the analysis, the audit, the rerun, the proposals |
| `model/` | a byte-for-byte copy of `deck/tools/gd/` as it stood at commit 70e2a00 (`arcs.py`, `hand.py`, `strength.py`, `trials.py`, `descend.py`, `longarcs.py`, `slide_checks.py`, and the two input files in `model/out/`) |
| `model/longarcs_v.py` | the variant model: `longarcs.py` plus optional rule changes, each marked `(RB)`. With no options it gives the stock result to the last digit |
| `scripts/repro.py` | reruns the four stored trials from the untouched copy and compares them with `deck/tools/gd/out/longarcs.json` |
| `scripts/audit_geometry.py` | measures the stored result directly: every arc, trial 3 against the Sora, the turn along each finger's slide, the slope under each resting finger |
| `scripts/newton.py` | the Newtonian numbers for Theseus: friction angle, lift and swipe forces, the finger's spring, felt radii, catch distances |
| `scripts/variants.py` | the named variant and sensitivity runs (the rerun for question 8) |
| `out/` | what the scripts wrote: `repro_longarcs.json`, `audit_geometry.json`, `newton.json`, `variants.json`, `variants.txt` |

## How to rerun

From the worktree's root, with Python 3, numpy and scipy:

```
nice -n 10 python3 research/gd/redo/scripts/repro.py            # about 10 minutes; prints stored against rerun
python3 research/gd/redo/scripts/audit_geometry.py              # seconds
python3 research/gd/redo/scripts/newton.py                      # seconds
nice -n 10 python3 research/gd/redo/scripts/variants.py         # runs whatever is not yet in out/variants.json, one at a time
nice -n 10 python3 research/gd/redo/scripts/variants.py A_fixes # or one run by name (it overwrites that entry)
```

A 500-step mirrored trial takes about two minutes on this machine, a lopsided one about three. `variants.py` writes
each run to `out/variants.json` as it finishes, so a run that is cut off loses only itself.

## The variant model's options

`longarcs_v.trial(grip, pockets, steps, opt={...})`:

| Option | What it does | Stock behaviour |
|---|---|---|
| `turn`, `turn_groove` | the turn that counts as felt, in radians | 0.060 (3.44°) |
| `groove_zone='pad'` | the groove's turn is counted across one fingertip's own contact patch | across the patch plus the spread between hands (13.4 mm) |
| `groove_kmin` | a floor on the groove's curvature from still touch (Goodwin 1991: 5.4e-3 per mm) | none |
| `gentle_groove=False` | the groove is not pulled toward the felt threshold; the threshold is a floor only | pulled to it from both sides |
| `start_groove='sora'` | the groove starts from the Sora's own (8 mm, R 50) | starts from 20 mm long, 0.25 mm deep, at x 16 |
| `rmin` | no arc of the button's top tighter than this radius | no rule (the shoulder arc shrinks to R 1.35 mm) |
| `rest_tie` | a small pull of each valley's bottom toward its finger's grip rest | none (the position is the nearest end of the zero-cost band from the start) |
| `cover_path=True` | the waist arc itself must lie under each finger's whole slide | only the chord's length is checked |
| `slide`, `start_dz`, `W` | replace the slides, shift the start, override the loss weights | the hand model's, 0, the stock weights |
