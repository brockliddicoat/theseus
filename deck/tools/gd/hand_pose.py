"""The study's hand on the open hand model (WebXR generic hand, MIT, (c) 2019 Amazon): fitted to the study's hand and posed at
rest, in numpy (linear blend skinning on the rest mesh from hand_export.py). Fit: the whole model scaled so the hand (wrist joint
to the middle fingertip's skin, along the hand) is the ANSUR II men's mean, 193.3 mm; each finger's three bones then stretched
along themselves to the study's lengths (GD.hand.bones: Buryanov & Kotiuk, scaled), the thumb's two (Freivalds). Pose: every
finger joint set to Lee & Jung's resting flexion about its own axis, measured from the bone before it (the knuckle from the
metacarpal), as the study does; the thumb's knuckle 39 and tip joint 10 the same way; the thumb's metacarpal (its base angle has no
named reference in the study) turned in toward the palm, an estimate, until the relaxed thumb hangs under the index finger."""
import json, os
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
FING = {'index': 'index-finger', 'middle': 'middle-finger', 'ring': 'ring-finger', 'little': 'pinky-finger'}
SEG = ('metacarpal', 'phalanx-proximal', 'phalanx-intermediate', 'phalanx-distal', 'tip')
TSEG = ('metacarpal', 'phalanx-proximal', 'phalanx-distal', 'tip')
THUMB_STRETCH = False   # (G13) see Hand.fit: the thumb is the model's own


def rot(axis, deg):
    a = np.asarray(axis, float); a = a / np.linalg.norm(a); t = np.radians(deg); c, s = np.cos(t), np.sin(t)
    K = np.array([[0, -a[2], a[1]], [a[2], 0, -a[0]], [-a[1], a[0], 0]])
    return np.eye(3) + s * K + (1 - c) * K @ K


def aff(A, about):
    """a 4x4 for the linear map A about the point `about`"""
    M = np.eye(4); M[:3, :3] = A; M[:3, 3] = about - A @ about; return M


class Hand:
    def __init__(self, npz, deck_json):
        d = np.load(npz)
        self.V0, self.F, self.W, self.FR = d['V'].astype(float), d['F'], d['W'].astype(float), d['FR'].astype(float)
        self.names = [str(n) for n in d['names']]
        self.ix = {n: i for i, n in enumerate(self.names)}
        self.M = np.repeat(np.eye(4)[None], len(self.names), 0)      # each bone's world transform from rest
        self.H = json.load(open(deck_json))['hand']
        self.log = []

    # ---- joints ----
    def pos(self, n):
        i = self.ix[n]; return (self.M[i] @ np.r_[self.FR[i, :3, 3], 1])[:3]

    def axis(self, n, k=0):
        """the joint frame's axis k (0: X, the flexion axis; 1: Y, the back of the finger; 2: Z) as it is now"""
        i = self.ix[n]; v = self.M[i, :3, :3] @ self.FR[i, :3, k]; return v / np.linalg.norm(v)

    def chain(self, digit, k):
        if digit == 'thumb': return ['thumb-' + s for s in TSEG[k:]]
        return [FING[digit] + '-' + s for s in SEG[k:]]

    def apply(self, names, T):
        for n in names: self.M[self.ix[n]] = T @ self.M[self.ix[n]]

    # ---- fit ----
    def fit(self):
        H = self.H
        # 1. the whole model to the ANSUR II mean hand: wrist joint to the middle fingertip's skin, along the hand (straight)
        wr = self.pos('wrist'); mt = self.pos('middle-finger-tip'); ax = (mt - wr) / np.linalg.norm(mt - wr)
        mid = self.W[:, [self.ix['middle-finger-phalanx-distal'], self.ix['middle-finger-tip']]].sum(1) > 0.5
        reach = ((self.V0[mid] - wr) @ ax).max()
        k = H['ansur']['hand'] / reach
        self.V0 = (self.V0 - wr) * k + wr; self.FR[:, :3, 3] = (self.FR[:, :3, 3] - wr) * k + wr
        self.log.append(f'uniform scale {k:.4f} (model hand {reach:.1f} mm -> {H["ansur"]["hand"]})')
        # 2. each bone along itself to the study's length; what lies beyond moves with its end
        targets = {f: H['bones'][f][:2] for f in FING}      # the last bone keeps the model's own fingertip (see the note)
        # (G13, Brock 2026-11-09 20:44: "the thumb doesn't look right here ... it looks like it's sticking out too much, make sure
        # all the dimensions are right") The thumb is the model's own. G10 had stretched its metacarpal from 33.2 to the study's
        # 46.9 mm (and set its two phalanges to Freivalds') so the drawn thumb reached the study's contact point on the mouse:
        # that pushed the whole thumb 13.7 mm out of the hand. The rule now: the skin is fitted to measured outside dimensions of
        # the average hand (hand_measure.py) and to nothing else, never to a contact point or a bone chain; where the thumb then
        # cannot reach the study's contact, it is drawn where it truly reaches and the gap is reported (hand_draw.pose_thumb)
        if THUMB_STRETCH:
            tb = H['thumbBase']['bones']; targets['thumb'] = [tb[0], tb[1], tb[2]]
        for f, L in targets.items():
            ch = self.chain(f, 0 if f == 'thumb' else 1)   # the fingers: proximal, ..., tip; the thumb: metacarpal, ..., tip
            for j in range(len(L)):
                a, b = self.pos(ch[j]), self.pos(ch[j + 1]); d = b - a; l = np.linalg.norm(d); u = d / l
                last = f == 'thumb' and j == len(L) - 1     # only the thumb's list ends at its last bone (the fingers keep theirs)
                if last:
                    # the last bone: the study ends it where the fingertip touches (trials.place), so its joint to the skin's front
                    sel = self.W[:, [self.ix[ch[j]], self.ix[ch[j + 1]]]].sum(1) > 0.5
                    Vn = self.skin_now(sel)
                    l = float(((Vn - a) @ u).max())
                r = L[j] / l
                S = np.eye(3) + (r - 1) * np.outer(u, u)
                if last: self.apply(ch[j:], aff(S, a))
                else:
                    self.apply([ch[j]], aff(S, a))
                    T = np.eye(4); T[:3, 3] = (r - 1) * d
                    self.apply(ch[j + 1:], T)
                self.log.append(f'{f} bone {j}: {l:.1f} -> {L[j]:.2f} mm' + (' (joint to the skin\'s front)' if last else ''))
        return self

    # ---- pose ----
    def flexion(self, digit, k):
        """joint k's flexion now (deg, + toward the palm): the turn from the bone before to the bone after, about its axis"""
        ch = self.chain(digit, k - 1)
        a = self.pos(ch[1]) - self.pos(ch[0]); b = self.pos(ch[2]) - self.pos(ch[1]); X = self.axis(ch[1], 0)
        a = a - X * (a @ X); b = b - X * (b @ X)
        s = np.degrees(np.arctan2(X @ np.cross(a, b), a @ b))
        palm = -self.axis(ch[1], 1); t = rot(X, 5) @ b
        sense = 1 if t @ palm > b @ palm else -1
        return s * sense, sense, X

    def set_flex(self, digit, k, target):
        cur, sense, X = self.flexion(digit, k)
        ch = self.chain(digit, k)
        self.apply(ch, aff(rot(X, (target - cur) * sense), self.pos(ch[0])))
        return cur

    def pose_rest(self, thumb_turn=None):
        H = self.H
        for f in FING:
            for k, tgt in zip((1, 2, 3), H['cascade'][f]):
                was = self.set_flex(f, k, tgt); self.log.append(f'{f} joint {k}: {was:.1f} -> {tgt}')
        if thumb_turn:     # the thumb's metacarpal about its base (an estimate: no named reference in the study)
            base = self.pos('thumb-metacarpal')
            for ax_, deg in thumb_turn:
                A = self.resolve_axis(ax_)
                self.apply(self.chain('thumb', 0), aff(rot(A, deg), base))
        for k, tgt in ((1, H['thumb']['mcp']), (2, H['thumb']['ip'])):
            was = self.set_flex('thumb', k, tgt); self.log.append(f'thumb joint {k}: {was:.1f} -> {tgt}')
        return self

    def resolve_axis(self, a):
        if isinstance(a, str):
            n, k = a.split(':'); return self.axis(n, int(k))
        return np.asarray(a, float)

    # ---- the skin ----
    def skin_now(self, sel):
        V = np.c_[self.V0[sel], np.ones(int(sel.sum()))]; W = self.W[sel]
        out = np.zeros((len(V), 3))
        for i in range(len(self.names)):
            w = W[:, i]; m = w > 0
            if m.any(): out[m] += w[m, None] * (V[m] @ self.M[i].T)[:, :3]
        return out

    def skin(self):
        V = np.c_[self.V0, np.ones(len(self.V0))]
        out = np.zeros((len(V), 3))
        for i in range(len(self.names)):
            w = self.W[:, i]; m = w > 0
            if m.any(): out[m] += w[m, None] * (V[m] @ self.M[i].T)[:, :3]
        return out

    def joints(self):
        return {n: self.pos(n) for n in self.names}

    def parts(self):
        """each vertex's share of: body (wrist and the four metacarpals), thumb (all its bones), index, middle, ring, little"""
        P = np.zeros((len(self.V0), 6))
        for i, n in enumerate(self.names):
            if n.startswith('thumb'): c = 1
            elif n == 'wrist' or n.endswith('metacarpal'): c = 0
            else: c = 2 + [k for k, v in enumerate(FING.values()) if n.startswith(v)][0]
            P[:, c] += self.W[:, i]
        return P
