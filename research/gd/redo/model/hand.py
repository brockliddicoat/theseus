"""The reference hand at rest, and where its fingertips land on the Sora. Every number is sourced in
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
THUMB = {'cmc': 45, 'mcp': 39, 'ip': 10}                                         # [leejung]
ORBIT_FINGER_FLEX = [42, 60, 30, 21, 57, 55, 47, 25, 35]                        # [sts57] Table 1, 9 hands
# estimates (no source; Brock can correct): where each knuckle sits behind the middle's (from the web heights) and
# how far the palm's skin lies under the knuckle line
KNUCKLE_BACK = {k: WEB[k] - WEB['middle'] for k in WEB}                         # estimate: web-height differences
PALM_SKIN = 20.0                                                                 # estimate, mm

# ---- the thumb, placed from its base (G5, after Brock 2026-11-08 07:21: "actually no, the thumb never goes that far forward,
# that's unnatural"). G1 put the thumb's tip level with the index's DIP joint on the mouse (an estimate, no source): that rides
# 49 mm ahead of the index knuckle, z 24 at the grip and z 45 with the palm on the hump. Now the thumb starts at its own base,
# the CMC joint, and reaches the side with its relaxed span.
THUMB_CMC_BACK = 55.9 / 203.0     # of hand length: the CMC behind the index MCP along the hand (Veeger et al. 1997 hand model,
                                  # joint points as tabulated by Goislard de Monsabert et al. 2018, ESM Table S3: 55.9 mm, 203 mm hand)
THUMB_CMC_PALMAR = 10.0           # mm under the knuckle line (mean hand): half way to the palm's skin (PALM_SKIN); estimate
THUMB_BONES = (BONES['middle'][0],                # metacarpal: as long as the middle finger's proximal phalanx (Haeri et al.
               0.171 * ANSUR['hand'],             #   2022, X-rays of 80 hands: no significant difference), Buryanov's, scaled
               0.121 * ANSUR['hand'])             # proximal and distal phalanges: Freivalds, % of hand length
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
