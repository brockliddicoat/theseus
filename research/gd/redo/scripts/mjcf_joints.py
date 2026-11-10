"""Joint centres of a MuJoCo XML body tree in its rest pose, to read where the hand's joints sit in the open MyoHand / MyoArm model
(MyoHub/myo_sim, Apache-2.0; derived from the MoBL upper-extremity OpenSim model, Holzbaur et al. 2005, and the 2nd-Hand model).
Usage: python3 -I mjcf_joints.py /path/to/myoarm_r_chain.xml      (reads the XML only; MuJoCo is not needed)
Each body's pos (m) and quat / euler (if any) are composed from the root; a joint's centre is its body's origin plus the joint's pos."""
import sys, xml.etree.ElementTree as ET
import numpy as np

def qmat(q):
    w, x, y, z = q; n = np.sqrt(w * w + x * x + y * y + z * z); w, x, y, z = w / n, x / n, y / n, z / n
    return np.array([[1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w)], [2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w)], [2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y)]])

def walk(el, R, p, out, rot_seen):
    for b in el.findall('body'):
        pos = np.array([float(v) for v in b.get('pos', '0 0 0').split()]); Rb = np.eye(3)
        if b.get('quat'): Rb = qmat([float(v) for v in b.get('quat').split()]); rot_seen.append(b.get('name'))
        if b.get('euler') or b.get('axisangle') or b.get('xyaxes') or b.get('zaxis'): rot_seen.append(b.get('name') + ' (unhandled rotation)')
        pw = p + R @ pos; Rw = R @ Rb
        out['body'][b.get('name')] = pw * 1000
        for j in b.findall('joint'):
            jp = np.array([float(v) for v in j.get('pos', '0 0 0').split()])
            out['joint'][j.get('name')] = {'centre': (pw + Rw @ jp) * 1000, 'axis': Rw @ np.array([float(v) for v in j.get('axis', '0 0 1').split()]), 'body': b.get('name')}
        walk(b, Rw, pw, out, rot_seen)

if __name__ == '__main__':
    root = ET.parse(sys.argv[1]).getroot(); out = {'body': {}, 'joint': {}}; rot = []
    walk(root if root.tag != 'mujoco' else root.find('worldbody'), np.eye(3), np.zeros(3), out, rot)
    for wb in root.iter('worldbody'): walk(wb, np.eye(3), np.zeros(3), out, rot)
    J = out['joint']; B = out['body']
    print('bodies with a rotation of their own:', rot if rot else 'none')
    need = ['flexion_r', 'cmc_flexion', 'cmc_abduction', 'mp_flexion_r', 'ip_flexion_r', 'mcp2_flexion_r', 'pm2_flexion_r', 'md2_flexion_r', 'mcp3_flexion_r', 'pm3_flexion_r', 'md3_flexion',
            'mcp4_flexion_r', 'pm4_flexion', 'md4_flexion_r', 'mcp5_flexion_r', 'pm5_flexion_r', 'md5_flexion_r']
    for n in need:
        if n in J: print('%-16s centre %s  axis %s' % (n, np.round(J[n]['centre'], 1).tolist(), np.round(J[n]['axis'], 3).tolist()))
    c = lambda n: J[n]['centre']
    # the hand's own axes: distal = wrist centre -> middle knuckle; radial = from the middle knuckle toward the index knuckle, squared up; palmar = the third
    wr = c('flexion_r'); m3 = c('mcp3_flexion_r'); m2 = c('mcp2_flexion_r')
    ed = (m3 - wr) / np.linalg.norm(m3 - wr); er = (m2 - m3) - ((m2 - m3) @ ed) * ed; er /= np.linalg.norm(er); ep = np.cross(ed, er)
    if (c('cmc_flexion') - m2) @ ep < 0: ep = -ep        # palmar: the side the thumb's base lies on
    rel = lambda a, b: ((a - b) @ ed, (a - b) @ er, (a - b) @ ep)
    print('hand axes in the model frame: distal %s, toward the thumb %s, palmar %s' % (np.round(ed, 3).tolist(), np.round(er, 3).tolist(), np.round(ep, 3).tolist()))
    print('wrist centre to middle knuckle %.1f mm; to middle tip joint %.1f mm' % (np.linalg.norm(m3 - wr), (c('md3_flexion') - wr) @ ed))
    d, r, p = rel(c('cmc_flexion'), m2)
    print('thumb base (CMC) relative to the index knuckle: %.1f mm behind, %.1f mm toward the thumb side, %.1f mm palmar (straight-line %.1f)' % (-d, r, p, np.linalg.norm(c('cmc_flexion') - m2)))
    d, r, p = rel(c('cmc_flexion'), wr); print('thumb base relative to the wrist centre: %.1f mm distal, %.1f toward the thumb, %.1f palmar' % (d, r, p))
    for n in (2, 4, 5):
        k = c('mcp%d_flexion_r' % n); print('knuckle %d: %.1f mm behind the middle\'s, %.1f mm toward the thumb side, %.1f mm palmar of it' % (n, -rel(k, m3)[0], rel(k, m3)[1], rel(k, m3)[2]))
    L = lambda a, b: np.linalg.norm(c(a) - c(b))
    print('thumb links: base to knuckle %.1f, knuckle to tip joint %.1f mm' % (L('mp_flexion_r', 'cmc_flexion'), L('ip_flexion_r', 'mp_flexion_r')))
    print('index links: %.1f, %.1f; middle %.1f, %.1f; ring %.1f, %.1f; little %.1f, %.1f mm' % (L('pm2_flexion_r', 'mcp2_flexion_r'), L('md2_flexion_r', 'pm2_flexion_r'), L('pm3_flexion_r', 'mcp3_flexion_r'), L('md3_flexion', 'pm3_flexion_r'),
          L('pm4_flexion', 'mcp4_flexion_r'), L('md4_flexion_r', 'pm4_flexion'), L('pm5_flexion_r', 'mcp5_flexion_r'), L('md5_flexion_r', 'pm5_flexion_r')))
    tm = c('mp_flexion_r') - c('cmc_flexion'); tm /= np.linalg.norm(tm)
    print('thumb metacarpal direction in hand axes (distal, toward the thumb, palmar): %s -> %.0f deg off the hand\'s line; %.0f deg out of the palm\'s plane' % (
        np.round([tm @ ed, tm @ er, tm @ ep], 2).tolist(), np.degrees(np.arccos(tm @ ed)), np.degrees(np.arcsin(tm @ ep))))
    for n in ('cmc_flexion', 'cmc_abduction', 'mp_flexion_r', 'ip_flexion_r', 'mcp2_flexion_r'):
        a = J[n]['axis']; print('axis %-14s in hand axes (distal, toward the thumb, palmar): %s' % (n, np.round([a @ ed, a @ er, a @ ep], 2).tolist()))
    a1, a2 = J['cmc_flexion']['axis'], J['cmc_abduction']['axis']; print('angle between the thumb base\'s two axes: %.0f deg' % np.degrees(np.arccos(abs(a1 @ a2) / np.linalg.norm(a1) / np.linalg.norm(a2))))
