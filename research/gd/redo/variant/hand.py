"""VARIANT COPY of deck/tools/gd/hand.py (RA research redo, 2026-11-09): the thumb corrected, everything else as the model has it.
Four inputs differ from the original, each marked VARIANT below: THUMB (its knuckle and tip joint at rest), THUMB_CMC_BACK,
THUMB_CMC_PALMAR and THUMB_BONES (links between joint centres). Sources and statuses: research/gd/redo/hand-variant.json,
hand-sizes.json and hand-at-rest.md. To rerun the trials on it, put this folder ahead of deck/tools/gd on sys.path (see
research/gd/redo/scripts/hand_variant.py). The original's text follows.

The reference hand at rest, and where its fingertips land on the Sora. Every number is sourced in
research/data/shape-gd.json (keys in brackets) or marked as an estimate here.

Frame: the mouse's (mm; +Y up, +Z nose, +X the user's left). A finger is a planar chain in a vertical plane at its x,
flexing down from its knuckle (MCP); angles are flexion (deg) relative to the metacarpal line."""
import numpy as np

ANSUR = {'hand': 193.3, 'palm': 116.5, 'breadth': 88.3}                       # [ansur2]
BONES_RAW = {'index': (39.78, 22.38, 15.82), 'middle': (44.63, 26.33, 17.40),   # [buryanov] via arXiv 2003.11598
             'ring': (41.37, 25.65, 17.30), 'little': (32.74, 18.11, 15.96)}
WEB = {'index': 15.52, 'middle': 15.33, 'ring': 18.49, 'little': 24.72}         # [buryanov] web height
# scale the sample's bones to the ANSUR II mean hand: middle finger from the web = hand length - palm length
SCALE = (ANSUR['hand'] - ANSUR['palm']) / (sum(BONES_RAW['middle']) - WEB['middle'])   # derived
BONES = {k: tuple(SCALE * b for b in v) for k, v in BONES_RAW.items()}
# the relaxed cascade, forearm neutral (wrist 10 deg, the closest of the study's conditions to the 0 deg in orbit) [leejung]
CASCADE = {'index': (29, 29, 10), 'middle': (32, 30, 11), 'ring': (25, 34, 9), 'little': (32, 37, 13)}
# VARIANT: the thumb's knuckle at rest is open between three values (Brock chooses, 2026-11-09): 39 deg measured with skin markers (Lee &
# Jung 2014, 40 hands; what it is measured from is not defined), 25 deg an estimate (39 less a marker over-read of 6 to 24 deg), 12.5 deg as
# Cooney et al. 1981 describe the resting thumb (10 to 15 deg; a posed rest, not a measured mean). Set it here, or in the environment
# variable GD_THUMB_KNUCKLE. The tip joint stays 10 deg (measured: Lee & Jung 2014; Rogers et al. 2008: 6 and 17 deg). cmc 45 is not used.
import os as _os
THUMB_KNUCKLE_DEG = float(_os.environ.get('GD_THUMB_KNUCKLE', 12.5))
THUMB = {'cmc': 45, 'mcp': THUMB_KNUCKLE_DEG, 'ip': 10}
ORBIT_FINGER_FLEX = [42, 60, 30, 21, 57, 55, 47, 25, 35]                        # [sts57] Table 1, 9 hands
# estimates (no source; Brock can correct): where each knuckle sits behind the middle's (from the web heights) and
# how far the palm's skin lies under the knuckle line
KNUCKLE_BACK = {k: WEB[k] - WEB['middle'] for k in WEB}                         # estimate: web-height differences
PALM_SKIN = 20.0                                                                 # estimate, mm

# ---- the thumb, placed from its base (G5, after Brock 2026-11-08 07:21: "actually no, the thumb never goes that far forward,
# that's unnatural"). G1 put the thumb's tip level with the index's DIP joint on the mouse (an estimate, no source): that rides
# 49 mm ahead of the index knuckle, z 24 at the grip and z 45 with the palm on the hump. Now the thumb starts at its own base,
# the CMC joint, and reaches the side with its relaxed span.
THUMB_CMC_BACK = 0.29             # VARIANT (was 55.9 / 203 = 0.275): the base's centre 56 mm behind the index knuckle's for the mean hand.
                                  # One specimen of 203 mm (Goislard de Monsabert et al. 2018, ESM Table S3, its own measurements, not
                                  # Veeger's): 56.0 mm; the open MyoHand model: 58.0 mm for a hand of about 185 to 190 mm. Range 0.275 to 0.34.
                                  # The original's comment: of hand length: the CMC behind the index MCP along the hand (Veeger et al. 1997 hand model,
                                  # joint points as tabulated by Goislard de Monsabert et al. 2018, ESM Table S3: 55.9 mm, 203 mm hand)
THUMB_CMC_PALMAR = 11.5           # VARIANT (was 10.0, an estimate): mm under the knuckle line (mean hand); the specimen 9.9, MyoHand 13.1
THUMB_BONES = (37.0,                              # VARIANT (was 46.9, 33.1, 23.4: whole bones): links between joint CENTRES, mean hand.
               35.0,                              #   base to knuckle 37 (specimen 38.6, MyoHand 35.9; the whole bone is 46 to 49 between its
               26.0)                              #   joint surfaces, but the base turns about a point inside the bone's near end); knuckle to tip
                                                  #   joint 35 (Buryanov's 31.57 x 1.052 + about 2); tip joint to the BONE's tip 26 (21.67 x 1.052
                                                  #   + about 3). The skin's tip is 6 mm further (32); the chain ends at the bone, as the fingers' do
CONTACT_Y = 15.0                  # mm: the thumb's pad on the side, the middle of the grip band (y 12 to 18, sora_sections.py); estimate

def thumb_span(k=1.0):
    """the relaxed thumb from its CMC to its tip (mm): its bones flexed at rest, MCP 39 and IP 10 deg (Lee & Jung); derived"""
    a1, a2 = np.radians(THUMB['mcp']), np.radians(THUMB['mcp'] + THUMB['ip']); Lm, Lp, Ld = (k * b for b in THUMB_BONES)
    return float(np.hypot(Lm + Lp * np.cos(a1) + Ld * np.cos(a2), Lp * np.sin(a1) + Ld * np.sin(a2)))

def thumb_cmc(mcp2, gamma, k=1.0):
    """the thumb's CMC (z, y) from the index MCP (z, y) and the metacarpal line's tilt gamma (rad): THUMB_CMC_BACK hand lengths
    back along the line, THUMB_CMC_PALMAR under it"""
    tdir = np.array([np.cos(gamma), np.sin(gamma)]); n = np.array([np.sin(gamma), -np.cos(gamma)])
    return np.asarray(mcp2, float) - THUMB_CMC_BACK * ANSUR['hand'] * k * tdir + THUMB_CMC_PALMAR * k * n

def thumb_reach(cmc_y, k=1.0, contact_y=CONTACT_Y):
    """how far along the mouse the relaxed thumb reaches from its base when it rests on the side: its span, less the drop from
    the CMC to the pad's contact band (the base over the side: its sideways offset changes this by under 0.2 mm); derived"""
    s = thumb_span(k); dy = cmc_y - contact_y
    return float(np.sqrt(max(s * s - dy * dy, 0.0)))

def chain(f, gamma=0.0):
    """joint points of finger f from its knuckle at the origin, the metacarpal line at gamma (rad above horizontal,
    pointing forward); returns (4, 2) in (z, y)"""
    p = np.zeros(2); out = [p.copy()]; c = 0.0
    for L, a in zip(BONES[f], CASCADE[f]):
        c += np.radians(a); d = gamma - c; p = p + L * np.array([np.cos(d), np.sin(d)]); out.append(p.copy())
    return np.array(out)

def chord(f):
    P = chain(f, 0.0); v = P[-1]
    return float(np.hypot(*v)), float(np.degrees(np.arctan2(-v[1], v[0]))), float(v[0])   # length, angle below the metacarpal line, reach along it

def summary():
    out = {'scale': SCALE, 'bones_mm': BONES, 'orbit_finger_flex_mean': float(np.mean(ORBIT_FINGER_FLEX)),
           'orbit_finger_flex_range': [min(ORBIT_FINGER_FLEX), max(ORBIT_FINGER_FLEX)], 'chords': {}}
    for f in BONES:
        L, ang, reach = chord(f); out['chords'][f] = {'len': L, 'angle_deg': ang, 'reach_along_metacarpal': reach}
    return out

if __name__ == '__main__':
    import json; print(json.dumps(summary(), indent=1))
