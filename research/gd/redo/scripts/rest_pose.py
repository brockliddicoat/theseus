"""The rest posture: what each source's finger angles mean for the fingertip, how far gravity and the wrist can move them, and what
the measured mouse-holding posture says about the thumb. Run: python3 research/gd/redo/scripts/rest_pose.py -> rest_pose_out.json
All angles in degrees of flexion from the bone before (MCP, PIP, DIP). Sources and reads: hand-at-rest.md."""
import json, math, os
import numpy as np

S = 1.066                                                   # scale of Buryanov & Kotiuk's bones to the ANSUR II mean hand (sizes.py)
BK = {'index': (39.78, 22.38, 15.82), 'middle': (44.63, 26.33, 17.40), 'ring': (41.37, 25.65, 17.30), 'little': (32.74, 18.11, 15.96)}
BONES = {f: tuple(S * b for b in v) for f, v in BK.items()}
POSES = {
 'Lee & Jung 2014, forearm neutral, mean of four arm angles (the study)': {'index': (29, 29, 10), 'middle': (32, 30, 11), 'ring': (25, 34, 9), 'little': (32, 37, 13)},
 'Lee & Jung 2014, forearm neutral, arm forward 90 (gravity across the fingers)': {'index': (28, 29, 9), 'middle': (32, 30, 11), 'ring': (23, 35, 10), 'little': (31, 38, 13)},
 'Lee & Jung 2014, forearm neutral, arm hanging (gravity along the hand)': {'index': (27, 26, 10), 'middle': (32, 27, 10), 'ring': (24, 32, 8), 'little': (29, 34, 12)},
 'Lee & Jung 2014, forearm pronated, mean': {'index': (26, 23, 9), 'middle': (30, 26, 9), 'ring': (23, 30, 8), 'little': (31, 35, 9)},
 'Lee & Jung 2014, forearm supinated, mean (wrist 28 back)': {'index': (28, 41, 14), 'middle': (34, 42, 16), 'ring': (28, 45, 13), 'little': (31, 45, 18)},
 'Varghese 2020, software workers, supinated, wrist 15 to 20 back': {'index': (27.08, 38.74, 13.76), 'middle': (33.21, 40.67, 14.20), 'ring': (29.34, 44.83, 14.33), 'little': (26.24, 43.07, 16.08)},
 'Su 2005, relaxed fingers at a straight wrist (interpolated; which finger not stated in the abstract)': {'index': (45.0, 44.5, 21.5)},
 'Rogers 2008, holding a mouse (not a rest pose)': {'index': (24.4, 8.6, 4.4), 'middle': (27.3, 12.9, 4.8), 'ring': (22.0, 12.9, 5.6), 'little': (20.5, 4.1, 6.8)},
}
ORBIT = [42, 60, 30, 21, 57, 55, 47, 25, 35]               # STS-57 Table 1, "finger flexion", nine hands of six crew

def tip(f, ang):
    p = np.zeros(2); c = 0.0
    for L, a in zip(BONES[f], ang): c += math.radians(a); p = p + L * np.array([math.cos(c), -math.sin(c)])
    return p

def main():
    out = {'poses': {}}
    print('1. each source\'s pose: where the fingertip points (sum of the three bends) and the knuckle-to-tip line below the back of the hand')
    for nm, P in POSES.items():
        r = {}
        for f, a in P.items():
            t = tip(f, a); r[f] = {'sum': sum(a), 'chord_angle': math.degrees(math.atan2(-t[1], t[0])), 'ahead_mm': t[0], 'below_mm': -t[1]}
        out['poses'][nm] = r
        print('   %-98s %s' % (nm, '; '.join('%s %.0f (line %.0f)' % (f, v['sum'], v['chord_angle']) for f, v in r.items())))
    print('   STS-57 orbit "finger flexion": mean %.1f, SD %.1f, range %d to %d (nine hands); per crew member %.1f' % (np.mean(ORBIT), np.std(ORBIT, ddof=1), min(ORBIT), max(ORBIT), np.mean([42, 60, 30, 39, 51, 30])))

    print('2. how far the wrist moves relaxed fingers (Su 2005 abstract: wrist 60 flexed to 60 extended)')
    slope = {'MCP': (63 - 27) / 120.0, 'PIP': (70 - 19) / 120.0, 'DIP': (31 - 12) / 120.0}
    for w, lab in ((16, 'Lee & Jung arm hanging (wrist 16 back) to a straight wrist'), (-17, 'Lee & Jung arm forward (wrist 17 flexed) to a straight wrist'), (17.5, 'Varghese (wrist 15 to 20 back) to a straight wrist')):
        print('   %-62s MCP %+.1f, PIP %+.1f, DIP %+.1f' % (lab, -slope['MCP'] * w, -slope['PIP'] * w, -slope['DIP'] * w))
    out['tenodesis_slope_deg_per_deg'] = slope

    print('3. how far gravity can move a relaxed index knuckle (estimate): the finger\'s weight against the joint\'s passive stiffness')
    # masses: Mirakhorlo et al. 2016 Table 1, one female specimen: PP2 13.31 g (centre 22.4 mm from its near end), MP2 6.74 g (12.4 mm); DP2 missing, taken as 5 g at 8 mm (EST)
    m = [(13.31e-3, 22.39), (6.74e-3, 12.41), (5.0e-3, 8.0)]; ang = (29, 29, 10); L = BONES['index']
    def torque(gdir):
        """N mm about the knuckle; gdir: gravity's direction in the finger's plane as an angle below the metacarpal line (deg); 90 = palm down"""
        p = np.zeros(2); c = 0.0; T = 0.0; g = np.array([math.cos(math.radians(gdir)), -math.sin(math.radians(gdir))]) * 9.81
        for (mass, cm), Li, a in zip(m, L, ang):
            c += math.radians(a); u = np.array([math.cos(c), -math.sin(c)]); r = p + cm * u
            T += mass * (r[0] * g[1] - r[1] * g[0]); p = p + Li * u
        return -T                                            # + = toward flexion
    k_lo, k_mid, k_hi = 0.016, 0.039, 0.21                  # N m / rad: Kuo & Deshpande 2012 range and Shi 2020 mean, as recorded in shape-gd.json (RB's area)
    for lab, gd in (('palm down, hand level', 90), ('palm up, hand level', -90), ('hand hanging, fingers down', 0)):
        T = torque(gd); print('   %-28s torque %+.1f N mm -> %+.0f deg at 0.039 N m/rad (%+.0f at 0.21, %+.0f at 0.016)' % (lab, T, math.degrees(T / 1000 / k_mid), math.degrees(T / 1000 / k_hi), math.degrees(T / 1000 / k_lo)))
        out.setdefault('gravity', {})[lab] = {'torque_Nmm': T, 'deg_at_0.039': math.degrees(T / 1000 / k_mid)}
    print('   Lee & Jung measured, index knuckle, arm forward: palm down 26, thumb up 28, palm up 30 (the wrist moved 49 deg between the first and last)')

    print('4. the thumb on a mouse, from Rogers 2008 (thumb pad centre to index pad centre 60.1 mm, SD 10.6; hands 178.1 mm): the mean hand')
    k = 193.28 / 178.1; d, sd = 60.1 * k, 10.6 * k
    a = (24.4, 8.6, 4.4); L = BONES['index']; t = tip('index', a)
    # the wrist about 15 deg back in Rogers' posture: the finger's angles are to the hand, so distances along the finger's own plane are used; tilt ignored (cos within 4 %)
    pad_back, thumb_pad_back = 10.0, 11.0                      # EST: a pad's centre behind its fingertip's skin end
    tip_skin = t[0] + S * 3.84 * math.cos(math.radians(sum(a)))
    idx_pad = tip_skin - pad_back
    for lat, vert in ((14.0, 15.0), (20.0, 17.0), (25.0, 20.0)):
        res = []
        for dd in (d - sd, d, d + sd):
            dz = math.sqrt(max(dd * dd - lat * lat - vert * vert, 0.0)); res.append(idx_pad - dz + thumb_pad_back)
        print('   pads %.0f mm apart sideways and %.0f in height: the thumb\'s tip %.0f mm ahead of the index knuckle (%.0f to %.0f for 1 SD of the distance)' % (lat, vert, res[1], res[2], res[0]))
        out.setdefault('rogers_thumb_ahead_of_knuckle_mm', []).append({'lateral': lat, 'vertical': vert, 'mean': res[1], 'lo': res[2], 'hi': res[0]})
    print('   (index pad centre %.0f mm ahead of the knuckle with Rogers\' flat fingers; distance scaled to the mean hand %.1f mm, SD %.1f)' % (idx_pad, d, sd))
    out['rogers_scaled_distance_mm'] = [d, sd]
    json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'rest_pose_out.json'), 'w'), indent=1, default=float)

if __name__ == '__main__':
    main()
