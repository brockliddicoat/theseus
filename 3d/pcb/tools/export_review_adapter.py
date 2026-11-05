"""Bake the actual approved A/B vector layouts into the revamp's synchronous, no-fetch 2D adapter."""
import sys,os,json,subprocess
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import layout,board,board_geo
from shapely.geometry import box,Point
from shapely import affinity
from shapely.ops import unary_union

def rings(g):
 out=[]
 for p in getattr(g,'geoms',[g]):
  if p.geom_type!='Polygon' or p.is_empty:continue
  out.append([[[round(x,4),round(y,4)] for x,y in r.coords] for r in [p.exterior,*p.interiors]])
 return out

def data():
 L=layout.build();B=board_geo.build_board(L)
 parts=[]
 for c,fp in L['comps']:
  if c['fp'] in ('TP','FID','TPTHT'):continue
  w,h=fp['body'];g=affinity.translate(affinity.rotate(box(-w/2,-h/2,w/2,h/2),c['rot'],origin=(0,0)),c['x'],c['z'])
  parts.append(dict(ref=c['ref'],shape=rings(g),x=c['x'],z=c['z'],fp=c['fp']))
 return dict(core=rings(B['core']),trim=rings(B['trim_top']),pads=rings(B['pads_top']),
             holes=rings(unary_union([g for g in B['tht_holes']])),traces=rings(B['nongnd_tr']),parts=parts,
             variant=board.POWER_VARIANT,revision='F30.25-plan5-approved')
if '--data' in sys.argv:
 print(json.dumps(data(),separators=(',',':')));sys.exit()
A=data();env=dict(os.environ,PCB_VARIANT='B');B=json.loads(subprocess.check_output([sys.executable,'-X','utf8',__file__,'--data'],env=env,text=True,encoding='utf-8'))
out=Path(__file__).resolve().parents[3]/'deck/revamp/05-hardware.js'
code='''/* Generated from approved PCB vector geometry by 3d/pcb/tools/export_review_adapter.py.
   Synchronous 2D: no fetch, no WebGL, no AI image. Layout view, not manufacturing routing approval.
   3D selection uses the actual updated A model; B remains its independently generated 2D layout. */
(function(){
 const DATA=__DATA__,cache={};
 function shape(poly){const p=new Path2D();for(const rings of poly)for(const r of rings){r.forEach((v,i)=>i?p.lineTo(v[0],v[1]):p.moveTo(v[0],v[1]));p.closePath();}return p;}
 function prepared(v){if(cache[v])return cache[v];const d=DATA[v];return cache[v]={...d,coreP:shape(d.core),trimP:shape(d.trim),padsP:shape(d.pads),holesP:shape(d.holes),tracesP:shape(d.traces),parts:d.parts.map(p=>({...p,p:shape(p.shape)}))};}
 function board(cx,cy,s,{variant='A',t=0}={}){
  variant=variant==='B'?'B':'A';
  if(variant==='A' && typeof V2D!=='undefined' && !V2D.on && typeof view3D==='function'){
   return view3D('pcb',t,cx-28*s,cy-34*s,56*s,68*s,{view:'top',view2d:'top',margin:1.15});
  }
  const d=prepared(variant),gold='#c6a561';G.save();G.translate(cx,cy+22*s);G.scale(s,-s);
  G.fillStyle='#171a1d';G.fill(d.coreP,'evenodd');G.strokeStyle=gold;G.lineWidth=.18;G.stroke(d.coreP);
  G.save();G.clip(d.coreP,'evenodd');G.fillStyle='#272b2e';G.fill(d.tracesP,'evenodd');G.restore();
  G.fillStyle=gold;G.fill(d.trimP,'evenodd');G.fill(d.padsP,'evenodd');G.fillStyle=(typeof C!=='undefined'?C.bg:'#f7f6f2');G.fill(d.holesP,'evenodd');
  for(const p of d.parts){G.fillStyle=p.ref==='U2'?'#695137':p.ref==='U3'?'#394d58':p.fp==='GT01'?'#424449':p.fp==='JSTSH3'?'#acb0ac':p.fp==='USBC'?'#b6babc':'#33393d';G.fill(p.p);G.strokeStyle='#858a89';G.lineWidth=.075;G.stroke(p.p);
   if(['U1','U2','U3','J1','J2','J3','SW3'].includes(p.ref)){G.save();G.translate(p.x,p.z);G.scale(1,-1);G.fillStyle=p.fp==='JSTSH3'?'#1b2023':'#efeee8';G.textAlign='center';G.textBaseline='middle';G.font='600 1.35px Inter, sans-serif';G.fillText(p.ref,0,0);G.restore();}
  }
  // Explicit edge actuator belongs only to B; its actual board has no access window.
  if(variant==='B'){G.fillStyle='#111518';G.fillRect(15.15,18.995,1.0,.9);}
  G.restore();return {mode:'approved-layout',variant,revision:d.revision};
 }
 window.RVHardware={board,revision:'F30.25-plan5-approved',units:'s = pixels per millimetre',knownFits:{centreGaps_mm:[1.6,1.6,1.6],usbLegWeb_mm:.44,batteryEnvelopeOverlap_mm2:3.719677,routing:'concept only, 718 DRC issues'}};
})();
'''.replace('__DATA__',json.dumps({'A':A,'B':B},separators=(',',':')))
out.write_text(code,encoding='utf-8');print(out,len(code),'bytes')
