"""Reproducible dimensional review, not manufacturing sign-off. Run from repo root."""
import json,os,sys,math
from pathlib import Path
import numpy as np
import matplotlib;matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon as Patch,Rectangle,Circle,PathPatch
from matplotlib.path import Path as MPath
from shapely.geometry.polygon import orient
sys.path.insert(0,str(Path(__file__).resolve().parent))
import board,layout,board_geo,silk
from shapely.geometry import Point,box
from shapely import affinity
from shapely.ops import unary_union
root=Path(__file__).resolve().parents[1]
L=layout.build();B=board_geo.build_board(L);SB=silk.build_bottom(L,B,board_geo.QR_URL)
P={c['ref']:c for c,fp in L['comps']}
outline=L['outline']; bay=board.wheel_cut_poly()
mir=lambda p:affinity.scale(p,xfact=-1,yfact=1,origin=(0,0))
errs=layout.drc(L,False)
bodies=[]
for c,fp in L['comps']:
 if c['fp'] in ('TP','FID','TPTHT'):continue
 w,h=fp['body'];g=affinity.translate(affinity.rotate(box(-w/2,-h/2,w/2,h/2),c['rot'],origin=(0,0)),c['x'],c['z'])
 bodies.append((c['ref'],g))
clashes=[dict(a=a,b=n,area_mm2=round(p.intersection(q).area,4),intentional=(a,n)==('WB1','SW4')) for i,(a,p) in enumerate(bodies) for n,q in bodies[i+1:] if p.intersection(q).area>.01]
# Occupancy envelope from the approved plan: battery 20 mm wide, its front at layout z -4.82.
bat=box(-10,-40.02,10,-4.82); overlap=outline.intersection(bat)
C=board.MCU_Z; S=board.SENSOR_Z
gaps=[C-7.2-board.REAR_NOTCH_Z,(S-6.4)-(C+6.65),board.WHEEL_CUT['z0']-(S+6.4)]
usbslots=[layout.drill_poly(p) for p in L['pads'] if p['ref']=='J1' and p.get('slot')]
report=dict(revision='F30.25-plan5-approved',variant=board.POWER_VARIANT,units='mm',frame="layout: +x user right, +z nose; exported mouse x is negated; mouse z=layout z-2.88",
 outline=list(outline.exterior.coords),outline_bounds=list(outline.bounds),outline_area_mm2=round(outline.area,4),
 symmetry_outline_area_error_mm2=outline.symmetric_difference(mir(outline)).area,
 symmetry_bay_area_error_mm2=bay.symmetric_difference(mir(bay)).area,
 bay=list(bay.exterior.coords),notch_depth_mm=board.NOTCH_DEPTH,side_and_rear_flat_length_mm=board.NOTCH_LENGTH,
 chamfer_angle_deg=math.degrees(board.CHAMFER_ANGLE),fillet_tangent_setback_mm=1.,gold_trim_mm=.35,
 centreline_gaps_mm=gaps,sensor_move_mm=15.45,sensor_mouse_z_mm=S-2.88,pmic_mcu_centre_distance_mm=math.hypot(P['U2']['x']-P['U1']['x'],P['U2']['z']-P['U1']['z']),
 usb_leg_min_board_web_mm=min(g.distance(outline.exterior) for g in usbslots),usb_shell_overhang_mm=board.USB_Z+7.35/2-board.FRONT_Z,
 mounting_holes=board.SORA_HOLES,components=[dict(ref=c['ref'],x=c['x'],z=c['z'],rot=c['rot'],footprint=c['fp']) for c,fp in L['comps']],
 body_overlaps=clashes,battery_front_envelope_overlap_mm2=overlap.area,
 battery_fit_status='unresolved: requested shorter rear notch overlaps old battery envelope' if overlap.area>.01 else 'no plan envelope overlap',
 balance='centre of mouse remains target; no measured mass properties / balance verification',
 electrical=dict(status='NOT fabrication validated; relocated pre-redesign route topology only',drc_issues=len(errs),issues=errs),
 deferred=['bottom-cover power-switch aperture/position','trigger-cutout side seam','electrical rerouting and SI/EMI','battery/board fit resolution','FE revalidation after lens movement'])
(root/'approved-review.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
(root/'electrical-review.txt').write_text('Concept routing: not fabrication validated.\n'+'\n'.join(errs),encoding='utf-8')
# Human-review drawing, made directly from the vector source geometries, never an AI image.
fig,axes=plt.subplots(1,3,figsize=(17,9),dpi=140,facecolor='#f7f6f2')
ink='#17191b';gold='#c7a55c'
def draw(ax,g,fc,ec='none',lw=.5):
 for p in getattr(g,'geoms',[g]):
  if p.geom_type!='Polygon' or p.is_empty:continue
  p=orient(p,sign=1.);vs=[];cs=[]
  for r in [p.exterior,*p.interiors]:
   v=np.asarray(r.coords);vs.extend(v);cs.extend([MPath.MOVETO]+[MPath.LINETO]*(len(v)-2)+[MPath.CLOSEPOLY])
  ax.add_patch(PathPatch(MPath(np.asarray(vs),cs),facecolor=fc,edgecolor=ec,lw=lw))

for ax in axes:
 ax.set_aspect('equal');ax.set_xlim(-22,22);ax.set_ylim(-11,57);ax.axis('off');ax.set_facecolor('#f7f6f2')
for ax in axes[:2]:
 draw(ax,L['board'],ink,gold,1.2);draw(ax,B['trim_top'],gold);draw(ax,SB['tht_rings'],gold)
 for p in L['pads']:
  draw(ax,layout.pad_poly(p),gold)
 for h in L['npth']:draw(ax,Point(h['x'],h['z']).buffer(h['d']/2),'#f7f6f2')
 for c,fp in L['comps']:
  if c['fp'] in ('TP','FID','TPTHT'):continue
  w,h=fp['body'];color='#8b6740' if c['ref']=='U2' else '#364957' if c['ref']=='U3' else '#343639'
  g=affinity.translate(affinity.rotate(box(-w/2,-h/2,w/2,h/2),c['rot'],origin=(0,0)),c['x'],c['z'])
  draw(ax,g,color,'#777874',.4)
  if c['ref'] in ('U1','U2','U3','J1','J2','J3','SW3'):ax.text(c['x'],c['z'],c['ref'],color='white',fontsize=8,ha='center',va='center')
 ax.axvline(0,color='#3586a6',lw=.6,alpha=.7,ls='--')
 # Equal actual package/courtyard gaps, not centre-to-centre spacing.
 for z0,z1 in [(board.REAR_NOTCH_Z,C-7.2),(C+6.65,S-6.4),(S+6.4,board.WHEEL_CUT['z0'])]:
  ax.annotate('',(0,z1),(0,z0),arrowprops=dict(arrowstyle='<->',color='#f3cc67',lw=1));ax.text(.6,(z0+z1)/2,f'{z1-z0:.2f}',color='#f3cc67',fontsize=7,va='center')
axes[0].set_title('A / window switch',loc='left',fontweight='bold',fontsize=13)
axes[1].set_title('B / edge switch',loc='left',fontweight='bold',fontsize=13)
# B mechanical alternative: fill A window, erase its switch, place edge switch (second GLB is independently built).
draw(axes[1],board.power_window_reference(),ink)
axes[1].add_patch(Rectangle((9.0,S-3.2),2.0,6.4,fc=ink,ec='none'))
axes[1].add_patch(Rectangle((board.WAIST_X-1.75,S-2.3),1.8,4.6,fc='#a7aaa8',ec='#333333',lw=.4))
axes[1].add_patch(Rectangle((board.WAIST_X-.2,S-.45),1.1,.9,fc='#111111',ec='none'))
axes[1].text(board.WAIST_X-2.6,S,'SW3',ha='right',va='center',fontsize=7,color='white')
ax=axes[2];draw(ax,outline,gold);draw(ax,outline.buffer(-.35),ink)
draw(ax,SB['l4'],'#2a2c2f');draw(ax,SB['gold'],gold);draw(ax,SB['silk'],'#dddcd5')
draw(ax,bay,'#f7f6f2');draw(ax,board.square_cut_poly(),'#f7f6f2')
for h in L['npth']:draw(ax,Point(h['x'],h['z']).buffer(h['d']/2),'#f7f6f2')
ax.invert_xaxis()
ax.set_title('underside / original triangle artwork adapted',loc='left',fontweight='bold',fontsize=11)
fig.suptitle('approved board geometry / plan 5 + final changes',x=.09,ha='left',fontsize=21,fontweight='bold',color=ink,y=.97)
fig.text(.09,.045,'38.06 × 59.06 mm  /  one 35.24° chamfer angle  /  T 1.00 mm fillets  /  mirrored holes\n3.61 mm notch depth  /  13.09 mm side + rear flats  /  1.60 mm centreline gaps',fontsize=10,color=ink)
fig.text(.58,.045,'design review, not manufacturing sign-off\nbattery-front fit + electrical routing remain unresolved',fontsize=10,color='#8a4434')
fig.subplots_adjust(left=.06,right=.97,top=.90,bottom=.13,wspace=.17)
fig.savefig(root/'approved-board-review.png',facecolor=fig.get_facecolor());plt.close(fig)
print(json.dumps({k:report[k] for k in ['outline_bounds','centreline_gaps_mm','symmetry_outline_area_error_mm2','symmetry_bay_area_error_mm2','usb_leg_min_board_web_mm','pmic_mcu_centre_distance_mm','battery_front_envelope_overlap_mm2','body_overlaps']},indent=2));print('DRC',len(errs))
