# Power animation follows the CURRENT generated route polylines; never stale pre-redesign coordinates.
def paths(L):
    def segments(nets):
        return [dict(layer=t['layer'],w=t['w'],pts=[list(p) for p in t['pts']]) for t in L['routes'] if t['net'] in nets]
    C={c['ref']:c for c,fp in L['comps']}
    return dict(charge=dict(label='USB-C -> PMIC -> battery (concept route topology)',segments=segments({'VBUS','VBAT'})),
        run=dict(label='battery -> PMIC -> two bucks -> radio and sensor (concept route topology)',segments=segments({'VBAT','SW_B1','SW_B2','VDD_1V8','VDD_SNS'})),
        nodes={k:[C[r]['x'],C[r]['z']] for k,r in dict(usb='J1',pmic='U2',battery='J2',module='U1',sensor='U3',l1='L1',l2='L2').items()})
