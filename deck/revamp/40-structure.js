/* C5: causal engineering lessons. Every pose is a pure function of slide time. */
Object.assign(SRC,{
 rv_stBeam:{t:'Euler-Bernoulli simply supported beam,10 N centre force,60 mm span. PP-C-20A E13500 MPa,density1.01 g/cm³. Rectangular section10×3.3 mm:1.9998 g. Deflection PL³/(48EI),I=bh³/12. Turn section90deg: same mass,9.18× stiffness. Linear elastic illustration, not mouse testing.',u:'https://openstax.org/books/university-physics-volume-1/pages/12-3-stress-strain-and-elastic-modulus'},
 rv_stLimits:{t:'Original Theseus2D beam/frame/flow and equal-mass fillet models. Outputs computed from original functions, not measurements or validated prototype strength. Material-parcel relocation and straw motion explain mechanisms, not extra FE results.',u:''}
});
const RV_ST_MOTION={};
function rvstReport(id,t,state){RV_ST_MOTION[id]={t,...state};window.__structureMotion=RV_ST_MOTION;}
const rvstP=(t,a,b)=>{const u=clamp((t-a)/(b-a));return u*u*(3-2*u);};
const rvstLoad=(t,a,b,c,d)=>rvstP(t,a,b)*(1-rvstP(t,c,d));
function rvstPoly(pts,fill,stroke=null,w=2,a=1){G.save();G.globalAlpha=a;G.beginPath();pts.forEach((p,i)=>i?G.lineTo(...p):G.moveTo(...p));G.closePath();if(fill){G.fillStyle=fill;G.fill();}if(stroke){G.strokeStyle=stroke;G.lineWidth=w;G.stroke();}G.restore();}
function rvstTrim(pts,k,col=C.hero,w=4,a=1){if(k<=0||pts.length<2)return;const v=clamp(k)*(pts.length-1),n=Math.floor(v),out=pts.slice(0,n+1);if(n<pts.length-1)out.push([lerp(pts[n][0],pts[n+1][0],v-n),lerp(pts[n][1],pts[n+1][1],v-n)]);rvLine(out,col,w,a);return out[out.length-1];}
function rvstPoint(pts,k){const f=clamp(k)*(pts.length-1),i=Math.min(pts.length-2,Math.floor(f));return [lerp(pts[i][0],pts[i+1][0],f-i),lerp(pts[i][1],pts[i+1][1],f-i)];}
function rvstMixResult(a,b,u){const r={...a,model:{...a.model,els:a.model.els.map((e,i)=>({...e,h:lerp(e.h,b.model.els[i].h,u)}))}};for(const key of ['d','N','M1','M2','V','sig','U','mass','L'])r[key]=Array.from(a[key],(v,i)=>lerp(v,b[key][i],u));r.dmax=lerp(a.dmax,b.dmax,u);r.smax=Math.max(...r.sig);return r;}
function rvstPress(x,y,k,label='10 N hand-load example',col=C.ink2){rvArrow([x,y-52],[x,y-12],col,3);G.save();G.translate(x,y-43);G.scale(.62,.36);rvFinger(0,0,Math.PI,{fill:C.panel});G.restore();rvTxt(label,x+38,y-43,25,{color:col});}
function rvst_beam(x,y,w,drop,col=C.ink,h=11){const p=[];for(let i=0;i<=48;i++){const u=i/48;p.push([x+w*u,y+drop*4*u*(1-u)]);}rvLine(p,col,h);feSupport([x,y+12],'pin');feSupport([x+w,y+12],'roll');return p;}
function rvst_frame(r,cx,cy,s,k,t,sc=1,col=null){const P=p=>[cx+p[0]*s,cy-p[1]*s];feDraw(r,P,{scale:sc,load:k,w:3,fillet:6,ghost:true,heat:!col,color:col});feFlow(r,P,t,{scale:sc,load:k,alpha:.7,color:col||C.ink2});return P;}
function rvstRuler(x,y,w,theta,drop,col){
 const sec=[[-5,-1.65],[5,-1.65],[5,1.65],[-5,1.65]].map(([z,h])=>[(z*Math.cos(theta)-h*Math.sin(theta))*2.9,(z*Math.sin(theta)+h*Math.cos(theta))*4.2]);
 const edge=off=>Array.from({length:49},(_,i)=>{const u=i/48;return [x+w*u+off[0],y+drop*4*u*(1-u)+off[1]];});
 [2,1,0].forEach(i=>rvstPoly([...edge(sec[i]),...edge(sec[(i+1)%4]).reverse()],i===1?C.panel:C.bg,col,2.5));
 for(let i=0;i<=30;i++){const u=i/30,q=sec[0],r=sec[1],a=[x+w*u+q[0],y+drop*4*u*(1-u)+q[1]],f=i%5===0?.55:.3;rvLine([a,[lerp(a[0],x+w*u+r[0],f),lerp(a[1],y+drop*4*u*(1-u)+r[1],f)]],col,1.5);}
 feSupport([x,y+24],'pin');feSupport([x+w,y+24],'roll');
}
RV.add({id:'rv_thin_wall',ch:'shell',theme:'paper',title:'Shape buys more than thinning.',settle:18,
 from:['materials','thinwall','shlScatter'],feedback:['F2.09','F14.6','F27','F33.5','F33.8','C5'],src:['rv_stBeam','rv_ouRuler','shlPyrofil','shlAbs','protoWall'],
 draw:t=>{
  rvHeader(t,'SHAPE BUYS MORE THAN THINNING.','Try bending a ruler flat. Release it. Turn it on its edge. Press again. The weight did not change.');
  const L=60,b=10,h=3.3,E0=13500,P=10,g=L*b*h*1.01/1000,If=b*h**3/12,Ie=h*b**3/12,df=P*L**3/(48*E0*If),turn=rvstP(t,4.8,7.5),theta=turn*Math.PI/2,load=rvstLoad(t,.8,2.6,3.4,4.3)+rvstP(t,8.6,10.8),I=If*Math.cos(theta)**2+Ie*Math.sin(theta)**2,d=P*L**3/(48*E0*I),base=rvstP(t,.8,2.6);
  rvLabel('FLAT: THE BASELINE',107,327);rvLabel(turn<.05?'SAME RULER':turn<.98?'TURN THE SECTION':'ON EDGE. SAME WEIGHT.',1002,327,{color:C.heroText});
  rvstRuler(144,480,594,0,df*800*base,C.mute);rvstRuler(1034,480,650,theta,d*800*load,C.hero);
  rvstPress(441,480+df*800*base-8,base,'10 N');rvstPress(1359,480+d*800*load-22,load,(10*load).toFixed(0)+' N');
  rvTxt('FLAT',109,657,27,{weight:750});rvTxt((df*1000).toFixed(0)+' µm actual bend',109,704,31,{color:C.mute});
  const cx=1120,cy=681;G.save();G.translate(cx,cy);G.rotate(theta);rvRect(-75,-24.75,150,49.5,C.panel,0,C.hero,3);G.restore();
  rvLine([[cx-91,cy+69],[cx+91,cy+69]],C.faint,1.5);rvTxt(turn<.5?'10 × 3.3 mm':'3.3 × 10 mm',1250,693,30,{color:C.ink2});
  if(t>4.2&&t<8.2){const aa=theta+.35;rvCursor(t,cx+Math.cos(aa)*104,cy+Math.sin(aa)*104,.7);}
  rvTxt(g.toFixed(2)+' g → '+g.toFixed(2)+' g',106,806,55,{font:'disp',weight:800,color:C.ink2});rvNum((Ie/If).toFixed(1)+'× stiffer',1246,807,65);
  rvWin('Half the thickness. One-eighth the bending stiffness.','Support the wall before you thin it. Even ±10% thickness changes bending stiffness by about −27% / +33%.');
  rvFoot('Classroom beam:60 mm span,10 N hand-load example,PP-C-20A13.5 GPa. Both2.00 g calculated. Bend exaggerated800×, same scale; section enlarged separately. Not a mouse test.');
  rvstReport('rv_thin_wall',t,{phase:turn<.01?'flat-load':turn<.99?'unload-and-turn':'edge-reload',angleDeg:theta*180/Math.PI,loadN:10*load,massBefore:g,massAfter:g,deflectionMm:d*load,flatDeflectionMm:df});
 }});
RV.add({id:'rv_specific',ch:'shell',theme:'night',title:'Choose the material for the job.',settle:18,
 from:['shlSpecific'],feedback:['F14.6','F27','F33.5','F33.8','C5'],src:['shlPyrofil','shlMg','shlAl','shlFr4','shlAbs','shlPc','ashby06','rv_stBeam'],
 draw:t=>{
  rvHeader(t,'CHOOSE THE MATERIAL FOR THE JOB.','Give every material the same weight. A lighter material buys a thicker beam; thickness changes the result.');
  const shape=rvstP(t,.6,3.7),load=rvstP(t,4.7,7.7),best=[Math.max(...SHL_SPEC.map(m=>m.s/m.rho)),Math.max(...SHL_SPEC.map(m=>m.E/m.rho)),Math.max(...SHL_SPEC.map(m=>Math.cbrt(m.E)/m.rho))];
  rvLabel('2 g EACH / 60 mm SPAN / 10 N HAND-LOAD EXAMPLE',104,327,{size:21});
  ['STRETCH A TIE','KEEP ITS SHAPE','MAKE A LIGHT SHELL'].forEach((s,i)=>rvLabel(s,[1050,1320,1577][i],327,{size:19,color:C.ink2}));
  ['Strength / ρ','E / ρ','E⅓ / ρ'].forEach((s,i)=>rvTxt(s,[1050,1320,1577][i],376,28,{color:C.heroText}));
  const bends=[];SHL_SPEC.forEach((m,i)=>{const yy=431+i*66,hh=2000/(m.rho*60*10),I=10*hh**3/12,d=10*60**3/(48*m.E*1000*I),col=m.hero?C.hero:C.mute;rvTxt(m.name,104,yy,28,{color:m.hero?C.heroText:C.ink2,weight:m.hero?780:600});
   rvst_beam(337,yy-8,445,d*35*load,col,lerp(5,Math.max(5,hh*4),shape));rvTxt(hh.toFixed(2)+' mm',813,yy+2,22,{color:C.mute});
   if(load>0){const px=560,py=yy-8+d*35*load;rvArrow([px,py-38],[px,py-7],col,2.4);}
   [m.s/m.rho,m.E/m.rho,Math.cbrt(m.E)/m.rho].forEach((v,j)=>{const xx=[1050,1320,1577][j],win=Math.abs(v-best[j])<1e-7;rvBar(xx,yy+8,181,v,best[j],win?C.hero:C.faint,8);rvTxt(v.toFixed(j===2?2:1),xx,yy-4,29,{color:win?C.heroText:C.ink2,weight:win?800:600});});bends.push({material:m.name,thicknessMm:hh,massG:2,deflectionMm:d*load});});
  rvTxt('Higher index = more performance for the weight.',1050,803,26,{color:C.heroText,maxW:745});rvTxt('Fixed width. Thickness follows density.',104,841,25,{color:C.mute});
  rvWin('FR4 for a tie. Carbon-filled PP for a light shell.','“Strongest” depends on the job. The light-shell index includes the extra thickness that low density lets you keep.');
  rvFoot('Datasheet indices, not measured mouse rankings. Six2 g beams; fixed10 mm width; thickness chosen by density.10 N; bend35×. Plastics/FR4 flexural modulus; metals elastic modulus.');
  rvstReport('rv_specific',t,{phase:load===0?'same-mass-section-build':'equal-force-bend',loadN:10*load,sectionBuild:shape,beams:bends});
 }});
RV.add({id:'rv_hotspots',ch:'shell',theme:'paper',title:'Putting that weight to work',settle:22,
 from:['shlHotspot','shlMargin','shlWork'],feedback:['F2.10','F9.23','F12.12','F14.7','F14.8','F27','F33.5','C5'],src:['shlHot2d','shlPyrofil','rv_stLimits'],
 draw:t=>{
  rvHeader(t,'PUTTING THAT WEIGHT TO WORK','An overloaded corner can fail while the rest barely helps. Move material into the paths that carry the load.');
  const H=shlHot(),cases=[['SOLID PLANE',H.plate],['CUT INTO EQUAL RIBS',H.uni],['THICKEN THE BUSY PATHS',H.sized]],maxd=Math.max(...cases.map(a=>a[1].dmax)),sc=48/(8*maxd),oldLoad=rvstP(t,1,3),cut=rvstP(t,4,7),redistribute=rvstP(t,8,11),load=rvstP(t,12,15),criterion=120,marginProgress=rvstP(t,16,19.5),maxCriterionLoad=Math.max(...cases.map(c=>10*criterion/c[1].peak));
  cases.forEach(([name,r],i)=>{const x=104+i*590,cx=x+252,P=p=>[cx+p[0]*8,615-p[1]*8],kk=i?load:oldLoad;
   rvLabel(name,x,329,{size:21,color:i===2?C.heroText:C.mute});rvstPress(cx,490,kk,(10*kk).toFixed(0)+' N',i===2?C.heroText:C.ink2);
   if(!i)shlPlateField(r,P,kk,sc,H.plate.peak,1,{gamma:1,crack:0});
   else if(i===1&&cut<1){
    rvstPoly([P([-30,0]),P([30,0]),P([30,SHL_HOT.H]),P([-30,SHL_HOT.H])],C.panel,C.mute,2);
    for(let q=0;q<9;q++){const xx=-30+q*6,up=q%2===0,raw=up?[[xx,0],[xx+12,0],[xx+6,SHL_HOT.H]]:[[xx,SHL_HOT.H],[xx+12,SHL_HOT.H],[xx+6,0]],cc=[xx+6,up?SHL_HOT.H/3:SHL_HOT.H*2/3],grow=rvstP(t,4+q*.19,5.2+q*.19),hole=raw.map(v=>P([lerp(cc[0],v[0],.76*grow),lerp(cc[1],v[1],.76*grow)]));rvstPoly(hole,C.bg,null);}
    if(t>4&&t<7.1){const tool=P([-30+60*cut,SHL_HOT.H/2]);rvLine([[tool[0],tool[1]-31],[tool[0],tool[1]+31]],C.ink2,2);rvCursor(t,tool[0]+14,tool[1]-20,.8);}
   }else if(i===2&&redistribute<1){
    feDraw(r,P,{scale:sc,load:0,w:1.1,fillet:6,heat:false,color:C.faint});
    r.model.els.forEach((el,e)=>{const u=rvstP(t,8+e*.035,9.9+e*.035);rvstTrim(feElPts(r,e,0).map(P),u,C.hero,Math.max(3,el.h*8));});
   }else{feDraw(r,P,{scale:sc,load:kk,w:8,fillet:7,smax:H.plate.peak,ghost:true});feFlow(r,P,t,{scale:sc,load:kk,alpha:.65});}
   feSupport(P([-30,0]),'pin');feSupport(P([30,0]),'roll');
   rvTxt(r.mass.reduce((a,b)=>a+b,0).toFixed(3)+' g',x,678,32,{weight:760});rvTxt(Math.round(r.work*100)+'% of material working',x+182,678,23,{color:C.ink2});
   rvLabel('PEAK EXPERIENCED STRESS AT 10 N: LOWER IS BETTER',x,713,{size:19});rvNum(r.peak.toFixed(1)+' MPa',x,762,48,{color:i===2?C.heroText:C.ink2,grad:i===2?C.heroGrad:null});
   if(t>=16){
    const factor=criterion/r.peak,linearN=lerp(10,10*factor,marginProgress),col=i===2?C.hero:C.mute;
    rvLabel('LINEAR LOAD TO 120 MPa: HIGHER IS BETTER',x,796,{size:19,color:i===2?C.heroText:C.mute});
    rvTxt(linearN.toFixed(1)+' N',x,833,32,{weight:780,color:i===2?C.heroText:C.ink2});rvBar(x+190,818,152,linearN,maxCriterionLoad,col,10);rvTxt(lerp(1,factor,marginProgress).toFixed(1)+'× margin',x+505,833,24,{align:'right',weight:760,color:i===2?C.heroText:C.ink2});
   }
  });
  // Equal-size material parcels relocate. They explain conservation, not extra stress measurements.
  if(t>4&&t<12){for(let j=0;j<48;j++){const e=j%H.sized.model.els.length,el=H.sized.model.els[e],a=H.sized.model.nodes[el.i],b=H.sized.model.nodes[el.j],f=.18+.64*((j*.618)%1),q=[lerp(a[0],b[0],f),lerp(a[1],b[1],f)],u=rvstP(t,4+j*.035,8.9+j*.035),sx=729+(j%12)*38,sy=535+Math.floor(j/12)*15,tx=1536+q[0]*8,ty=615-q[1]*8;rvRect(lerp(sx,tx,u)-3,lerp(sy,ty,u)-3-Math.sin(Math.PI*u)*90,6,6,C.hero,1);}const xx=lerp(780,1650,rvstP(t,4,10));rvCursor(t,xx,550-Math.sin(Math.PI*rvstP(t,4,10))*100,.7);}
  rvWin('Same weight. More of it doing useful work.',t<16?'To match the optimized frame’s peak stress, this solid-plane model needs '+(H.mass*H.match).toFixed(3)+'g instead of '+H.mass.toFixed(3)+'g. Keep the material; change the job it does.':'Higher means more load before the same 120 MPa material-stress limit in this linear model; not a mouse failure rating.');
  rvFoot('60 mm equal-mass PP-C-20A frames at10 N. Work=mass stressed≥half its own peak.120 MPa criterion; load-to-criterion=10 N×120/peak. Linear extrapolation only: buckling/contact not included. Not product capacity.');
  rvstReport('rv_hotspots',t,{phase:t<4?'solid-load':t<8?'cut-ribs':t<12?'redistribute-material':t<16?'reload-three-cases':'extrapolate-material-limit',cut,redistribute,loadN:10*load,massesG:cases.map(c=>c[1].mass.reduce((a,b)=>a+b,0)),peaksMPa:cases.map(c=>c[1].peak),criterionMPa:criterion,marginProgress,marginFactors:cases.map(c=>criterion/c[1].peak),loadsToCriterionN:cases.map(c=>10*criterion/c[1].peak),displayedCriterionLoadsN:cases.map(c=>lerp(10,10*criterion/c[1].peak,marginProgress)),productFailureRating:false});
 }});
RV.add({id:'rv_triangles',ch:'shell',theme:'night',title:'A triangle cannot fold like a hexagon.',settle:21,
 from:['lattice','shlDeterminate'],feedback:['F2.37','F27','F33.8','C5'],src:['shlLat2d','shlMaxwell','mitHoney','rv_coloradoStraws'],
 draw:t=>{
  rvHeader(t,'A TRIANGLE CANNOT FOLD LIKE A HEXAGON.','Push a hinged square of straws. It racks. Insert one diagonal, then push again. The motion needs a straw to stretch.');
  const collapse=rvstLoad(t,1,3,4.4,5.5),brace=rvstP(t,5.8,8),test=rvstP(t,8.8,11),dx=115*collapse+3*test,side=239,hh=Math.sqrt(side**2-dx**2),sq=[[125,690],[364,690],[364+dx,690-hh],[125+dx,690-hh]];
  rvLabel('THE STRAW TEST',104,328);rvLine([...sq,sq[0]],C.ink2,11);sq.forEach(p=>rvCircle(...p,9,C.panel,C.ink2,2));
  const old=[[125,690],[364,690],[479,690-Math.sqrt(side**2-115**2)],[240,690-Math.sqrt(side**2-115**2)]];if(t>4)rvLine([...old,old[0]],C.faint,3,.7,[8,8]);
  const ba=[lerp(480,sq[0][0],brace),lerp(795,sq[0][1],brace)],bb=[lerp(719,sq[2][0],brace),lerp(556,sq[2][1],brace)];rvLine([ba,bb],C.hero,9);if(brace>0&&brace<1)rvCursor(t,bb[0]+10,bb[1]+10,.8);
  if(brace>.99){rvCircle(...sq[0],8,C.panel,C.hero,3);rvCircle(...sq[2],8,C.panel,C.hero,3);}rvArrow([135,404],[135+110*(collapse+test),404],C.hero,4);
  rvTxt(t<5.5?'Four sides. One free folding motion.':t<8.5?'Add a diagonal.':'The square becomes two triangles.',104,754,29,{color:t>8?C.heroText:C.ink2,maxW:580});rvTxt('Straw lengths stay fixed while the joints turn.',104,819,24,{color:C.mute,maxW:590});
  const L=shlLat(),pr=L.modes.press,scale=94/(4.7*Math.max(pr.hex.dmax,pr.tri.dmax)),load=rvstP(t,10.8,14.2);
  [['hex',821,'HEXAGONS'],['tri',1334,'TRIANGLES']].forEach(([kind,x,name])=>{rvLabel(name,x,328,{color:kind==='tri'?C.heroText:C.mute});shlLatDraw(pr[kind],x,691,4.7,{scale,load,flow:.85,t,fillet:7,smax:Math.max(pr.hex.smax,pr.tri.smax)});rvstPress(x+198,450,load,(10*load).toFixed(0)+' N',kind==='tri'?C.heroText:C.ink2);});
  rvTxt('Same '+L.mass.toFixed(2)+' g. Same 10 N hand-load example.',821,753,29,{color:C.ink2});rvNum(pr.ratio.toFixed(1)+'× stiffer',1260,836,67);
  rvWin('Triangles carry load by stretching. Hexagons spend more of it bending.','The brace removes a folding mode. The real shell still depends on its joints, thickness, supports and the paths between them.');
  rvFoot('Straw motion is a hinged-mechanism illustration. Lattices: original equal-mass2D beam-frame press solves; shared94 px maximum exaggerated bend. No hanging edge members. Not a product test.');
  rvstReport('rv_triangles',t,{phase:t<5.5?'rack-square':t<8.5?'insert-brace':'load-lattices',strawSidePx:side,strawWidthPx:sq[1][0]-sq[0][0],strawMeasuredSidePx:Math.hypot(dx,hh),rackPx:dx,braceInsertion:brace,loadN:10*load,equalMassG:L.mass,hexDeflectionMm:shlLatD(pr.hex)*load,triangleDeflectionMm:shlLatD(pr.tri)*load});
 }});
RV.add({id:'rv_light_structure',ch:'shell',theme:'paper',title:'The lighter it gets, the more shape matters.',settle:21,
 from:['shlThin','shlPick','shlNoPick','shlShell3d','shlLattice3d'],feedback:['F2.11','F14.5','F27','F33.5','C5'],src:['shlLat2d','shlRtingsSoraUlx','mitHoney','shlPyrofil'],
 draw:t=>{
  rvHeader(t,'THE LIGHTER IT GETS, THE MORE SHAPE MATTERS.','Brock rates the lighter ULX above GPX2 for build feel. Weight alone is not build quality. Keep the same hand load as both panels get lighter.',{size:59});
  const L=shlLat(),A=L.sweep,z=rvstP(t,3.6,12.6)*(A.length-1),ii=Math.min(A.length-2,Math.floor(z)),ff=z-ii,a=A[ii],b=A[ii+1],tri=rvstMixResult(a.tri,b.tri,ff),hex=rvstMixResult(a.hex,b.hex,ff),g=lerp(a.g,b.g,ff),rib=lerp(a.t,b.t,ff),load=rvstP(t,.8,2.8),last=A[A.length-1],sc=109/(6.7*last.hex.dmax);
  [['HEXAGONS',hex,110],['TRIANGLES',tri,1110]].forEach(([name,r,x])=>{rvLabel(name,x,326,{color:r===tri?C.heroText:C.mute});shlLatDraw(r,x,677,6.7,{scale:sc,load,t,flow:.8,fillet:8,smax:Math.max(hex.smax,tri.smax)});rvstPress(x+293,399,load,'10 N');rvTxt(g.toFixed(2)+' g',x+800,724,43,{font:'disp',weight:780,align:'right',color:r===tri?C.heroText:C.ink2});});
  rvTxt('Same weight at every step.',110,723,27,{color:C.ink2});rvTxt(rib.toFixed(2)+' mm triangle ribs',1110,723,28,{color:C.heroText});
  const x0=110,y0=809,w=760,h=71,lo=Math.log10(Math.min(...A.map(q=>q.kh))),hi=Math.log10(Math.max(...A.map(q=>q.kt))),X=q=>x0+(A[0].g-q)/(A[0].g-last.g)*w,Y=v=>y0-(Math.log10(v)-lo)/(hi-lo)*h;
  rvLine([[x0,y0],[x0+w,y0]],C.hair,1.5);[['kt',C.hero],['kh',C.mute]].forEach(([key,col])=>{rvLine(A.map(q=>[X(q.g),Y(q[key])]),col,3);const kval=10/(key==='kt'?shlLatD(tri):shlLatD(hex));rvCircle(X(g),Y(kval),6,col);});
  rvTxt('Less structural weight →',x0,837,21,{color:C.mute});rvTxt('Stiffness ↑ / log scale',x0+w,837,21,{align:'right',color:C.mute});
  rvNum((shlLatD(hex)/shlLatD(tri)).toFixed(0)+'× stiffer',1105,824,74);rvTxt('at this equal-weight pair',1735,850,23,{align:'right',color:C.mute});
  rvWin('Light does not have to mean flimsy.','Bending stiffness falls cubed as a rib thins. A load path that mainly stretches its ribs loses stiffness much more slowly.');
  rvFoot('Original equal-mass10 N press sweep; interpolated between six linear solves. One exaggeration scale. Plot stiffnessN/mm, logarithmic. Panels, not fabricated GPX2/ULX strength data.');
  rvstReport('rv_light_structure',t,{phase:t<3.6?'apply-load':'remove-equal-mass',loadN:10*load,massG:g,triangleMassG:tri.mass.reduce((s,v)=>s+v,0),hexMassG:hex.mass.reduce((s,v)=>s+v,0),triangleRibMm:rib,hexDeflectionMm:shlLatD(hex)*load,triangleDeflectionMm:shlLatD(tri)*load,stiffnessRatio:shlLatD(hex)/shlLatD(tri)});
 }});
function rvstDomeArch(cx,base,R,phi,tilt,k,col=C.hero){const no=Math.hypot(1,tilt),a=[-Math.sin(phi),0,Math.cos(phi)],b=[tilt*Math.cos(phi)/no,1/no,tilt*Math.sin(phi)/no],pts=[];for(let j=0;j<=100;j++){const u=j/100*Math.PI,v=a.map((q,i)=>R*(q*Math.cos(u)+b[i]*Math.sin(u)));pts.push([cx+v[0]+v[2]*.54,base-v[1]*.81+v[2]*.19]);}return rvstTrim(pts,k,col,3.4);}
RV.add({id:'rv_arches',ch:'shell',theme:'night',title:'Turn a hanging chain upside down.',settle:22,
 from:['shbArches','shbPress','shbThrust','shbBend'],feedback:['F2.16','F2.24','F13.4','F27','F33.8','C5'],src:['shbHooke','shbFuller','shbModel','rv_innsbruckChain'],
 draw:t=>{
  rvHeader(t,'TURN A HANGING CHAIN UPSIDE DOWN.','A chain finds a path for tension. Turn that path upside down: an arch carries compression around the load.');
  const hang=rvstP(t,.4,2.2),turn=rvstP(t,3.1,6.2),move=rvstP(t,6.6,8.9),base=lerp(550,686,move),R=258,pts=[];
  rvLabel(t<6.6?'THE HANGING-CHAIN TEST':'INTERWOVEN ARCHES MAKE TRIANGLES',104,327,{color:C.heroText,size:21});
  for(let j=0;j<=48;j++){const u=j/48,xx=-1+2*u,yy=(Math.cosh(1)-Math.cosh(xx))/(Math.cosh(1)-1);pts.push([403+xx*R,base+170*yy*hang*Math.cos(turn*Math.PI)]);}rvLine(pts,C.hero,6);pts.forEach((p,i)=>{if(i%2===0&&move<1)rvCircle(...p,4.2,C.bg,C.hero,2);});
  if(t>2.6&&t<6.5)rvCursor(t,403+Math.sin(turn*Math.PI)*88,base+170*Math.cos(turn*Math.PI)+22,.7);
  if(t>6.6)for(let j=0;j<6;j++){const tip=rvstDomeArch(403,686,R,j*Math.PI/3,.62,rvstP(t,7+j*.55,10.3+j*.55),C.ink2);if(tip&&t<12.4&&j===Math.min(5,Math.floor((t-7)/.55)))rvCursor(t,...tip,.4);}
  [145,661].forEach((x,i)=>{feSupport([x,base+9],'pin');if(turn>.95)rvArrow([x,base+43],[x+(i?52:-52),base+43],C.hero,3);});
  rvBody(t<6.6?'Same links. Same path. Opposite force.':'Each line is one continuous arch. The crossings create the triangles.',105,781,602,{size:28,color:C.ink2});
  const flat=shbArch('flat'),arch=shbArch('para'),sc=78/(6.4*Math.max(flat.dmax,arch.dmax)),load=rvstP(t,11.6,14.8);
  [['FLAT STRIP',flat,1046],['ARCH: SAME WEIGHT',arch,1583]].forEach(([n,r,cx])=>{rvLabel(n,cx-193,328,{size:21,color:r===arch?C.heroText:C.mute});rvst_frame(r,cx,643,6.4,load,t,sc,r===arch?C.hero:C.mute);feSupport([cx-192,653],'pin');feSupport([cx+192,653],'pin');rvstPress(cx,r===arch?476:579,load,(10*load).toFixed(0)+' N');rvTxt(r.mass.reduce((a,b)=>a+b,0).toFixed(2)+' g',cx-190,729,33,{color:r===arch?C.heroText:C.ink2});});
  rvNum((flat.dmax/arch.dmax).toFixed(0)+'× stiffer',1310,821,71);rvTxt('The feet must not spread.',859,795,29,{color:C.ink2});
  rvWin('Carry the hand load around the shell. Do not bend a flat patch.','That outward push at the feet needs a tie. The rim and the board complete the structure; a dome alone is not the whole answer.');
  rvFoot('Chain/dome: classroom geometry, not final mouse shape. Flat/arch:60 mm span,equal mass,10 N fingertip-pad linear frame solves; shared exaggerated bend. No Mars-base example.');
  rvstReport('rv_arches',t,{phase:t<3.1?'hang-chain':t<6.6?'invert-chain':t<11.6?'interweave-continuous-arches':'load-flat-and-arch',chainTurnDeg:turn*180,chainYBounds:[Math.min(...pts.map(p=>p[1])),Math.max(...pts.map(p=>p[1]))],archCount:1+Math.min(6,Math.floor(Math.max(0,t-7)/.55)),loadN:10*load,flatMassG:flat.mass.reduce((a,b)=>a+b,0),archMassG:arch.mass.reduce((a,b)=>a+b,0),flatDeflectionMm:flat.dmax*load,archDeflectionMm:arch.dmax*load});
 }});
function rvstFlow(c0,c1,k,cx,cy,s,ft){const F=c0.F,r=lerp(c0.F.r,c1.F.r,k),angs=[0,1,2,3,4,5].map(j=>j*Math.PI/3),P=p=>[cx+p[0]*s,cy-p[1]*s],outline=shbNodeOutline(angs,F.W,F.Lr+.5,r);G.save();shbFill(outline,P,C.panel,1);G.beginPath();outline.forEach((p,i)=>i?G.lineTo(...P(p)):G.moveTo(...P(p)));G.closePath();G.clip();
 c0.fb.forEach((f,i)=>{const b=c1.fb[i],ph=((i*.6180339887)%1)*8,u=(ft-ph)/7;if(u<0)return;const z=u-Math.floor(u),p0=rvstPoint(f.smp,z),p1=rvstPoint(b.smp,z),q0=f.smp[Math.min(f.smp.length-1,Math.floor(z*(f.smp.length-1)))],q1=b.smp[Math.min(b.smp.length-1,Math.floor(z*(b.smp.length-1)))],an=q0[2]+Math.atan2(Math.sin((q1[2]-q0[2])*2),Math.cos((q1[2]-q0[2])*2))/2*k,x=cx+lerp(p0[0],p1[0],k)*s,y=cy-lerp(p0[1],p1[1],k)*s;rvLine([[x-Math.cos(an)*9,y+Math.sin(an)*9],[x+Math.cos(an)*9,y-Math.sin(an)*9]],k>.7?C.hero:C.ink2,2.5,.9);});G.restore();rvLine([...outline.map(P),P(outline[0])],C.mute,2);}
RV.add({id:'rv_fibres_fillets',ch:'shell',theme:'paper',title:'Give the fibres a clean path.',settle:23,
 from:['shbFibres','fillet','filletsize','shbFlow','shbWidth','shbMill','shbMillDirect','shbTol'],feedback:['F2.17','F2.18','F2.25','F9.27','F27','F33.8','C5'],src:['shbChoi','shbKrenchel','shbMoldflow','shbJeffery','filletFE','shlEnvalior','shbProtoCorner','rv_cornellGrain'],
 draw:t=>{
  rvHeader(t,'GIVE THE FIBRES A CLEAN PATH.','Wood splits along its grain. Fibre-filled plastic cares about direction too. Round the turn for the load, the melt and the tool.');
  const a=shbFlowCase(.05),b=shbFlowCase(.75),grow=rvstP(t,5,9),cutter=rvstP(t,11,16);
  rvLabel('SHARP: THE FIBRES TURN ABRUPTLY',105,328,{size:20});rvLabel('GROW THE FILLET',697,328,{color:C.heroText});rvLabel('RADIUS AT EQUAL MASS',1338,328,{size:21});
  rvstFlow(a,a,0,363,550,46,Math.max(0,t-1));rvstFlow(a,b,grow,939,550,46,Math.max(0,t-1));rvArrow([116,548],[181,548],C.ink2,3);rvArrow([692,548],[756,548],C.hero,3);
  if(t>4.4&&t<9.7)rvCursor(t,939+34+grow*38,550-34-grow*38,.75);
  rvTxt('Simulated melt flow + short fibre rotation',105,789,27,{color:C.mute});rvTxt(lerp(.05,.75,grow).toFixed(2)+' mm radius',698,789,35,{color:C.heroText,weight:780});
  const x=1364,y=594,w=406,h=180,X=v=>x+v/1.25*w,Y=v=>y-(v-5)/12*h;rvRect(X(.6),y-h,X(.75)-X(.6),h,C.heroSoft,0);rvLine(FILLET.rs.map((q,i)=>[X(q),Y(FILLET.scfM[i])]),C.hero,3);rvLine([[x,y-h],[x,y],[x+w,y]],C.mute,2);[0,.6,1.2].forEach(v=>rvTxt(v.toFixed(1),X(v),y+30,22,{align:'center',color:C.mute}));rvTxt('Peak stress ↓ / equal mass',x,380,24,{color:C.ink2});rvTxt('0.60–0.75 mm selected band',x,660,28,{color:C.heroText,weight:750});
  rvstPoly([[1350,787],[1530,787],[1611,706],[1611,707],[1780,707],[1780,803],[1350,803]],C.panel);G.save();G.beginPath();G.moveTo(1350,787);G.lineTo(1530,787);G.arcTo(1611,787,1611,706,81);G.lineTo(1611,707);G.strokeStyle=C.mute;G.lineWidth=2;G.stroke();G.restore();const tool=[];for(let j=0;j<=24;j++)tool.push([1370+j/24*160,759]);for(let j=1;j<=28;j++){const an=Math.PI/2-j/28*Math.PI/2;tool.push([1530+53*Math.cos(an),706+53*Math.sin(an)]);}rvLine(tool,C.faint,2,.9,[6,6]);rvstTrim(tool,cutter,C.hero,4);const tp=rvstPoint(tool,cutter);rvCircle(...tp,28,C.panel,C.ink2,2.5);for(let j=0;j<8;j++){const aa=j*TAU/8+cutter*TAU*3;rvLine([[tp[0]+Math.cos(aa)*19,tp[1]+Math.sin(aa)*19],[tp[0]+Math.cos(aa)*27,tp[1]+Math.sin(aa)*27]],C.mute,2);}if(t>10.5&&t<16.3)rvCursor(t,tp[0]+35,tp[1]+24,.4);
  rvTxt('A round cutter needs a round turn.',1338,823,25,{color:C.ink2});rvTxt('1.7× along-flow strength in a carbon-nylon study',105,840,28,{color:C.heroText});
  rvWin('A useful fillet. Not the biggest possible fillet.','At equal weight, an oversized fillet steals width from the ribs. Keep the smoother path without starving the rest of the structure.');
  rvFoot('Original Stokes/Jeffery field; trajectories interpolated as radius grows, not validated mold fill. Original equal-mass FE radius study. Choi2024 nylon result is not PP-C-20A or Theseus strength.');
  rvstReport('rv_fibres_fillets',t,{phase:t<5?'sharp-flow':t<10?'grow-fillet-and-align':'trace-cutter-path',radiusMm:lerp(.05,.75,grow),fibreAlignmentBlend:grow,cutterProgress:cutter,cutterPosition:tp,flowTime:Math.max(0,t-1)});
 }});
function rvstBoardPart(x,y,w,t,col=C.ink2){rvRect(x-w/2,y,w,20,C.panel,4,col,2);for(let j=0;j<9;j++){const xx=x-w*.42+j*w*.1;rvRect(xx,y-15,w*.055,15,C.ink2,2);rvLine([[xx+3,y+8],[xx+w*.065,y+8]],C.mute,1.3);}rvLine([[x-w*.43,y+12],[x+w*.43,y+12]],C.hero,2);}
RV.add({id:'rv_whole_pcb',ch:'shell',theme:'night',title:'Use the structure you already carry.',settle:23,
 from:['shlPcbRib','shcCarry','shcArms','shlStructs'],feedback:['F2.26','F6.3','F12.1','F28.3','F27','F33.5','C5'],src:['shcFr4Flex','shcTpuHati','shcTpuHatiR','shcBrock','shcBoardFE','shlMg'],
 draw:t=>{
  rvHeader(t,'USE THE STRUCTURE YOU ALREADY CARRY.','FR4 is woven glass in epoxy. Like carbon fibre, it can carry load; not just components. Use the whole board as the arch’s tie.');
  const B=shcBoard(),a=B.cases.arms,b=B.cases.whole,n=B.cases.none,move=rvstP(t,5,9),join=rvstP(t,8.6,10.8),load=rvstLoad(t,.8,2.9,3.6,4.6)+rvstP(t,11.5,14.5),rr0=rvstMixResult(n.a,b.a,join),sc=65/(8.5*n.a.dmax),P=p=>[1255+p[0]*10.4,687-p[1]*8.5];
  rvLabel('THE BOARD IS ALREADY IN THE WEIGHT BUDGET',105,328,{size:21});rvLabel(join<.99?'LET THE ARCH FEET SPREAD':'TIE THE FEET WITH THE WHOLE BOARD',927,328,{color:C.heroText,size:21});
  if(move<1){rvRect(107,403,430,106,C.panel,4);for(let j=0;j<8;j++)rvLine([[110,410+j*12],[535,410+j*12]],C.mute,5);for(let j=0;j<13;j++)rvLine([[119+j*33,403],[119+j*33,507]],C.ink2,4);}
  rvNum('5.6 g',105,752,78);rvTxt('Populated board. No new reinforcement part.',105,800,27,{maxW:660,color:C.ink2});
  feDraw(rr0,P,{scale:sc,load,w:5,heat:false,color:join>.8?C.hero:C.ink2,fillet:6,ghost:true,hide:e=>rr0.model.els[e].part==='tie'});feFlow(rr0,P,t,{scale:sc,load,alpha:.75});feDraw(n.a,P,{scale:sc,load:1,w:1.5,heat:false,color:C.faint,alpha:.65,hide:e=>n.a.model.els[e].part==='tie'});
  rvstPress(1255,409+(-rr0.d[rr0.model.crown*3+1])*sc*8.5*load,load,(10*load).toFixed(0)+' N crown load');
  const by=lerp(555,695,move)-Math.sin(move*Math.PI)*104,bx=lerp(323,1255,move),bw=lerp(420,565,move);rvstBoardPart(bx,by,bw,t,join>.8?C.hero:C.ink2);if(t>4.5&&t<10.9)rvCursor(t,bx+18,by-17,.85);
  if(join>0){for(const sd of [-1,1]){const fp=P([sd*27.28,0]);rvCircle(...fp,8,C.panel,C.hero,3);rvArrow([fp[0]+sd*52,fp[1]+48],[fp[0]+sd*4,fp[1]+48],C.hero,4);}rvLine([[963,715],[1547,715]],C.hero,4,join);}
  if(move>.15){const aa=rvstP(t,6,8),cx=350,P0=p=>[cx+p[0]*2.1,605-p[1]*2.1];G.save();G.globalAlpha=aa;feDraw(a.r,P0,{scale:1,load:1,w:1.2,heat:false,color:C.mute,fillet:4});a.r.model.links.forEach(l=>{const e=a.r.model.els[l.e],p=P0(a.r.model.nodes[e.i]),q=P0(a.r.model.nodes[e.j]);rvLine([p,q],C.bad,4);});G.restore();rvLabel('SMALL ARMS: LOAD AT FRAGILE ROOTS',105,386,{size:19});}
  rvLabel('PEAK EXPERIENCED FR4 STRESS: LOWER IS BETTER',930,761,{size:19});rvTxt(a.fr4.toFixed(1)+' → '+b.fr4.toFixed(1)+' MPa',930,819,36,{font:'disp',weight:780,color:C.ink2});rvNum(B.fr4X.toFixed(1)+'× lower peak',1360,819,46);
  rvWin('The board becomes part of the load path. It is not extra baggage.','Use the whole FR4 core instead of separate carbon-fibre rods—no extra parts to fit and tolerance. Small arms load a few fragile roots.');
  rvFoot('Owner report: Brock’s HTS Ultra reinforcement arms broke in shipping. Conceptual10 N model; exaggerated bend;5.6 g includes components. Original photos unavailable: schematic, not traced geometry.');
  rvstReport('rv_whole_pcb',t,{phase:t<5?'untied-load':t<10.8?'move-existing-board-and-connect':'reload-with-board-tie',boardMove:move,connection:join,boardPosition:[bx,by],loadN:10*load,boardBudgetG:5.6,extraReinforcementParts:0,armPeakMPa:a.fr4,wholePeakMPa:b.fr4});
 }});
