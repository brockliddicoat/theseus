"""Forward kinematics of an OpenSim 4 model (.osim, XML) in its default pose, to read where its joints sit.
Usage: python3 -I osim_joints.py /path/to/model.osim
Reads the XML only (no OpenSim needed). Prints every joint's centre in ground and selected offsets.
Handles CustomJoint (SpatialTransform with Constant / LinearFunction / SimmSpline / PiecewiseLinear / MultiplierFunction),
WeldJoint and PinJoint. Orientation convention: OpenSim body-fixed X-Y-Z Euler angles."""
import sys, xml.etree.ElementTree as ET
import numpy as np

def Rx(a): c, s = np.cos(a), np.sin(a); return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])
def Ry(a): c, s = np.cos(a), np.sin(a); return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])
def Rz(a): c, s = np.cos(a), np.sin(a); return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])
def euler(o): return Rx(o[0]) @ Ry(o[1]) @ Rz(o[2])
def T(R, p): M = np.eye(4); M[:3, :3] = R; M[:3, 3] = p; return M
def vec(s): return np.array([float(x) for x in s.split()])
def axis_rot(ax, ang):
    a = np.asarray(ax, float); a = a / np.linalg.norm(a); c, s = np.cos(ang), np.sin(ang)
    K = np.array([[0, -a[2], a[1]], [a[2], 0, -a[0]], [-a[1], a[0], 0]]); return np.eye(3) + s * K + (1 - c) * K @ K

def feval(fn, x):
    """evaluate an OpenSim Function element at x"""
    if fn is None: return 0.0
    tag = fn.tag
    if tag == 'Constant': return float(fn.findtext('value'))
    if tag == 'LinearFunction':
        c = vec(fn.findtext('coefficients')); return c[0] * x + c[1]
    if tag in ('SimmSpline', 'NaturalCubicSpline', 'PiecewiseLinearFunction', 'GCVSpline'):
        xs, ys = vec(fn.findtext('x')), vec(fn.findtext('y'))
        return float(np.interp(x, xs, ys))          # linear interpolation: exact at the knots, close between
    if tag == 'MultiplierFunction':
        inner = [c for c in fn.find('function')][0]; return float(fn.findtext('scale')) * feval(inner, x)
    if tag == 'function':
        return feval([c for c in fn][0], x)
    raise ValueError('function ' + tag)

def main(path):
    root = ET.parse(path).getroot(); model = root.find('Model')
    coords = {}
    for c in model.iter('Coordinate'):
        coords[c.get('name')] = float(c.findtext('default_value') or 0.0)
    joints = []
    js = model.find('JointSet').find('objects')
    for j in js:
        frames = {}
        for f in j.find('frames'):
            frames[f.get('name')] = (f.findtext('socket_parent').split('/')[-1], vec(f.findtext('translation')), vec(f.findtext('orientation')))
        pf = j.findtext('socket_parent_frame'); cf = j.findtext('socket_child_frame')
        joints.append((j, frames[pf], frames[cf]))
    world = {'ground': np.eye(4)}; out = {}
    pending = list(joints); guard = 0
    while pending and guard < 10000:
        guard += 1; j, (pb, pt, po), (cb, ct, co) = pending.pop(0)
        if pb not in world: pending.append((j, (pb, pt, po), (cb, ct, co))); continue
        P = world[pb] @ T(euler(po), pt)                      # the joint's parent frame in ground
        X = np.eye(4)
        st = j.find('SpatialTransform')
        if st is not None:
            Rm = np.eye(3); p = np.zeros(3)
            axes = list(st)
            for ta in axes[:3]:
                cn = (ta.findtext('coordinates') or '').split(); q = coords.get(cn[0], 0.0) if cn else 0.0
                fn = [c for c in ta if c.tag not in ('coordinates', 'axis')]
                val = feval(fn[0], q) if fn else 0.0
                Rm = Rm @ axis_rot(vec(ta.findtext('axis')), val)
            for ta in axes[3:6]:
                cn = (ta.findtext('coordinates') or '').split(); q = coords.get(cn[0], 0.0) if cn else 0.0
                fn = [c for c in ta if c.tag not in ('coordinates', 'axis')]
                val = feval(fn[0], q) if fn else 0.0
                p = p + val * vec(ta.findtext('axis'))
            X = T(Rm, p)
        elif j.tag == 'PinJoint':
            cs = j.find('coordinates'); q = 0.0
            if cs is not None and len(cs): q = float(cs[0].findtext('default_value') or 0.0)
            X = T(Rz(q), np.zeros(3))
        C = P @ X                                             # the joint's child frame in ground
        world[cb] = C @ np.linalg.inv(T(euler(co), ct))
        axes_g = []
        if st is not None:
            for ta in list(st)[:3]:
                cn = (ta.findtext('coordinates') or '').split()
                if cn: axes_g.append((cn[0], (P[:3, :3] @ vec(ta.findtext('axis'))).round(3).tolist()))
        out[j.get('name')] = {'parent': pb, 'child': cb, 'centre': P[:3, 3] * 1000, 'axes': axes_g}
    return out, world, coords

if __name__ == '__main__':
    out, world, coords = main(sys.argv[1])
    for n, d in out.items():
        print('%-18s %-12s -> %-12s centre(mm) %s  axes %s' % (n, d['parent'], d['child'], np.round(d['centre'], 1).tolist(), d['axes']))
