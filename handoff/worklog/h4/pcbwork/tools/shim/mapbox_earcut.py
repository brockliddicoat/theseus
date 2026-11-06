"""Stand-in for mapbox_earcut: the same earcut, three.js's (ShapeUtils.triangulateShape), run by node over a pipe."""
import json, os, subprocess, atexit
import numpy as np
_HERE = os.path.dirname(os.path.abspath(__file__))
_P = None


def _proc():
    global _P
    if _P is None or _P.poll() is not None:
        env = dict(os.environ)
        nm = os.path.abspath(os.path.join(_HERE, '..', '..', '..', 'node_modules'))   # 3d/node_modules (three)
        env['NODE_PATH'] = nm + (os.pathsep + env['NODE_PATH'] if env.get('NODE_PATH') else '')
        # ESM ignores NODE_PATH, so run the server from a copy that imports three by path
        src = open(os.path.join(_HERE, 'earcut_server.mjs')).read().replace("from 'three'", "from '%s'" % os.path.join(nm, 'three', 'build', 'three.module.js'))
        import tempfile
        tmp = os.path.join(tempfile.gettempdir(), 'pcb_shim_earcut_server.mjs')
        if not os.path.exists(tmp) or open(tmp).read() != src:
            open(tmp, 'w').write(src)
        _P = subprocess.Popen(['node', tmp], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True, bufsize=1, env=env)
        atexit.register(lambda: _P and _P.poll() is None and _P.kill())
    return _P


def triangulate_float64(verts, ring_ends):
    v = np.asarray(verts, float).reshape(-1, 2)
    e = [int(x) for x in np.asarray(ring_ends).ravel()]
    p = _proc()
    p.stdin.write(json.dumps({'v': [round(float(x), 9) for x in v.ravel()], 'e': e}) + '\n'); p.stdin.flush()
    return np.array(json.loads(p.stdout.readline()), np.uint32)


triangulate_float32 = triangulate_float64
