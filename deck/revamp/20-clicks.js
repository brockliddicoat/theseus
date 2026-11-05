/* F27 / C5: finite causal demonstrations. Each press has an approach, load and hold.
   The comparison stays loaded at settle: the viewer never has to remember the bad case. */
const rvcRamp=(t,a,b)=>rvEase(t,a,b);
const rvcBeat=(t,a,b,c=1e6,d=c+1)=>clamp(rvcRamp(t,a,b)-rvcRamp(t,c,d));
function rvcAlpha(a,fn){if(a<=.002)return;G.save();G.globalAlpha*=a;fn();G.restore();}
function rvcPointer(t,from,to,a,b,press=0){const k=rvcRamp(t,a,b);rvCursor(t,lerp(from[0],to[0],k),lerp(from[1],to[1],k),press);}
function rvcTrace(points,k,col=C.hero,w=4){
 if(k<=0)return;const lens=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1])),total=lens.reduce((a,b)=>a+b,0);let left=total*clamp(k),out=[points[0]];
 for(let i=0;i<lens.length;i++){if(left>=lens[i]){out.push(points[i+1]);left-=lens[i];}else{out.push([lerp(points[i][0],points[i+1][0],left/lens[i]),lerp(points[i][1],points[i+1][1],left/lens[i])]);break;}}rvLine(out,col,w);
}
function rvcStep(t,items,x=100,y=840,w=1720){
 const gap=w/items.length;items.forEach(([at,label],i)=>{const k=rvcRamp(t,at,at+.5);rvLine([[x+i*gap,y-19],[x+(i+1)*gap-26,y-19]],k>.5?C.hero:C.hair,k>.5?3:2);rvTxt(label,x+i*gap,y+15,27,{color:k>.5?C.heroText:C.faint,weight:700});});
}
function rvcMechanism(x,y,s,tilt,p,rotation=1){
 return rvPart(x,y,s,()=>clickMM({tilt,press:p,clear:true,accent:tilt?C.hero:C.mute,arc:1,pivot:1,gt01:pr=>{
  // The accurate housing rotates as a part during assembly, then its flat foot lands on the same fixed PCB.
  xsave();xabout(-CKG.gtApex[0],-CKG.gtApex[1],(1-rotation)*20*Math.PI/180);xmove(0,-2.4*(1-rotation));const o=clk_gt01MM({press:pr,clear:true,board:false});xrest();return o;
 },glow:false}));
}
RV.add({id:'rv_direct_drive',ch:'click',theme:'paper',title:'Direct Drive Actuation',settle:21,
 from:['clicks','arc','clk_wedge'],feedback:['F2.04','F26.1','F28.1','F30.24','F31.2','F33.5'],
 draw:t=>{
 rvHeader(t,'DIRECT DRIVE ACTUATION','Your finger moves on an arc. An upright switch makes its guide absorb the sideways part.');
 rvCompareLabels(t,'UPRIGHT SWITCH','ALIGNED SWITCH, ONE FLAT BOARD');
 const bad=rvcRamp(t,1.6,3.2),align=rvcRamp(t,7.6,10),good=rvcRamp(t,11.5,13.4),arrive=rvcRamp(t,5.6,6.8);
 const b=rvcMechanism(245,488,10,0,bad);let g;rvcAlpha(arrive,()=>{g=rvcMechanism(1160,488,10,1,good,align);});
 if(b.footW){rvcAlpha(bad,()=>{rvArrow([b.footW[0]-25,b.footW[1]-65],b.footW,C.mute,4);rvArrow(b.footW,[b.footW[0]+42,b.footW[1]],C.bad,5);rvLine([[b.footW[0]+7,b.footW[1]-12],[b.footW[0]+17,b.footW[1]-5],[b.footW[0]+7,b.footW[1]+2]],C.bad,2);});}
 rvcAlpha(bad,()=>rvLabel('SIDE LOAD / GUIDE SCRAPE',620,481,{color:C.bad,size:23}));
 rvcAlpha(good,()=>{if(g&&g.footW)rvArrow([g.footW[0]-35,g.footW[1]-90],g.footW,C.hero,5);rvLabel('ON AXIS',1610,602,{color:C.heroText,size:24});});
 // The rejected added-part route exists before the housing lands, then is taken away.
 rvcAlpha(rvcBeat(t,4.2,4.8,7,7.7),()=>{const xx=1110+180*rvcRamp(t,7,7.7);rvLine([[xx,384],[xx+160,384],[xx+160,345],[xx,384]],C.mute,3);rvRect(xx,333,170,10,C.comp,1);rvTxt('A wedge adds another fit.',1340,375,29,{color:C.mute});});
 if(t<6)rvcPointer(t,[750,367],b.trigTop(29),.3,1.5,bad);
 else if(g)rvcPointer(t,[1740,389],g.trigTop(29),10.2,11.4,good);
 rvTxt('34.2%',120,752,76,{font:'disp',weight:800,color:C.mute});rvLabel('SIDEWAYS COMPONENT',120,795);
 rvcAlpha(align,()=>{rvNum((100*Math.sin((1-align)*20*Math.PI/180)).toFixed(1)+'%',1030,752,92);rvLabel('SIDEWAYS COMPONENT',1030,795,{color:C.heroText});});
 rvLine([[935,338],[935,806]],C.hair,2);
 rvcAlpha(good,()=>{rvNum('6% SOONER',1470,764,43);rvLabel('IDEAL TRAVEL ESTIMATE',1470,802,{size:20});});
 rvcStep(t,[[1.6,'Press the upright switch'],[7.6,'Turn the housing, not the board'],[11.5,'Load the aligned switch']],100,327);
 rvWin('The press goes into the click.','A wedge or second board adds parts to align. The angled housing does the same job on one flat board.');
 rvFoot('20° ideal geometry: sin20° = 34.2% sideways, cos20° = 94.0% axial. “6% sooner” is the approved ideal-travel estimate, not measured PC latency.');
 }});
function rvcRearPlan(cx,cy,s,straight,p,side=1){
 G.save();G.translate(cx,cy);G.scale(s,s);
 keyPath();G.fillStyle=C.panel;G.fill();G.strokeStyle=C.mute;G.lineWidth=.7;G.stroke();
 G.save();keyPath();G.clip();
 const seam=[[-29,lerp(3,-5,straight)],[-19,-5],[0,lerp(-9,-5,straight)],[19,-5],[29,lerp(3,-5,straight)]];
 G.save();G.translate(0,p*.8);G.rotate(side*.025*p*(1-straight));
 G.beginPath();G.moveTo(-40,-61);G.lineTo(40,-61);G.lineTo(40,seam[4][1]);seam.slice().reverse().forEach(q=>G.lineTo(...q));G.closePath();G.fillStyle=straight>.9?rgba(C.hero,.18):inkA(.1);G.fill();
 rvLine(seam,straight>.9?C.hero:C.bad,1.15);rvLine([[0,-59],[0,-5]],C.mute,.5);
 for(const sg of [-1,1]){const x=sg*12;rvRect(x-4,-37,8,13,C.comp,1);rvRect(x-1,-38,2,2,C.mute,.35);}
 G.restore();
 rvRect(-3.3,-46.4,6.6,18,C.comp,1);for(let yy=-44;yy<-29;yy+=2)rvLine([[-3,yy],[3,yy]],C.faint,.25);
 for(const sg of [-1,1]){const x=sg*lerp(18,12,straight),bx=sg*12;
  rvRect(x-4,0,8,10,C.comp,0);rvCircle(x,5,1.4,C.bg,C.mute,.5);
  // This is the physical clamped arm from the screw block to the trigger, not an arbitrary axis glyph.
  rvLine([[x,10],[x,18],[bx,18],[bx,-5]],straight>.9?C.hero:C.mute,1.4);
  rvLine([[bx,-40],[bx,20]],straight>.9?C.hero:C.faint,.45,.7,[1.5,1]);
 }
 G.restore();G.restore();
}
RV.add({id:'rv_rear_cutouts',ch:'click',theme:'night',title:'Straight rear trigger cutouts',settle:21,
 from:['cutouts','shlsheet1'],feedback:['F12.9','F27','F33.5'],
 draw:t=>{
 rvHeader(t,'STRAIGHT REAR TRIGGER CUTOUTS','If the two sides flex around different points, the trigger twists before the switch ever sees the press.');
 rvCompareLabels(t,'CURVED CUTOUT, OFF-AXIS SUPPORT','STRAIGHT CUTOUT, SUPPORT ON THE SWITCH');
 const bad=rvcRamp(t,1.6,3),zoom=rvcRamp(t,4,6.6),fix=rvcRamp(t,7.3,9.6),good=rvcRamp(t,11.3,13),side=-1;
 [420,1310].forEach((cx,i)=>{
  const s=lerp(3.35,5.6,zoom),cy=lerp(550,610,zoom),p=i?good:bad;
  G.save();G.beginPath();G.rect(cx-335,333,670,450);G.clip();rvcRearPlan(cx,cy,s,i?fix:0,p,side);G.restore();
  const yy=cy-32*s,roll=i?0:p*26;
  rvcAlpha(p,()=>{rvArrow([cx-12*s,yy-30],[cx-12*s,yy+27+p*17+roll],i?C.hero:C.bad,4);rvArrow([cx+12*s,yy-30],[cx+12*s,yy+27+p*17-roll],i?C.hero:C.bad,4);});
  rvLabel(i?'SQUARE TO THE PRESS':'ONE EDGE GIVES FIRST',cx,802,{align:'center',color:i?C.heroText:C.mute});
 });
 rvcAlpha(zoom,()=>{rvMouse(906,648,.87,{color:C.faint});rvRect(880,615,52,44,null,0,C.hero,2);rvLine([[880,635],[792,635]],C.faint,2,.7,[5,5]);rvLine([[932,635],[1018,635]],C.faint,2,.7,[5,5]);rvLabel('SAME REAR HINGE',906,741,{size:20,align:'center'});});
 rvLabel(t<4?'TOP VIEW: WHEEL, SPLIT, REAR CUT':'ZOOM INTO THE CLAMPED TRIGGER ARMS',100,332,{size:23});
 rvcAlpha(zoom,()=>{rvLabel('SCREW BLOCKS',100,692,{size:23});rvLine([[270,682],[310,682],[319,638]],C.faint,2);});
 rvcAlpha(fix,()=>{rvLabel('BEND / SWITCH AXES ALIGN',1590,573,{size:23,color:C.heroText,maxW:250});rvLine([[1580,560],[1390,560]],C.hero,2);});
 if(t<7)rvcPointer(t,[710,355],[420-12*lerp(3.35,5.6,zoom),lerp(550,610,zoom)-32*lerp(3.35,5.6,zoom)],.4,1.6,bad);
 else rvcPointer(t,[1705,351],[1310-12*lerp(3.35,5.6,zoom),lerp(550,610,zoom)-32*lerp(3.35,5.6,zoom)],10,11.3,good);
 rvWin('A click that stays square.','The rear cut runs straight back to the Sora smile’s deepest point. One centre split, no fork around the wheel.');
 rvFoot('Trigger geometry from Brock’s Sora-based design and supplied tensioner references. Motion is exaggerated to show the twist; not a measured rival deformation.');
 }});
function rvcNose(cx,cy,good,p,side,morph=1){
 // A solid trigger surface, rear to nose; groove depth fades along its LENGTH, not just in section.
 const col=good?C.hero:C.mute,roll=good?0:side*.18*p;
 const contactU=good?0:roll*245*245/76,rockGain=good?0:roll*contactU-38*Math.pow(contactU/245,2);
 const drop=good?3.96*p:27.96*p-rockGain;
 const H=(u,v)=> (24+38*Math.pow(u/245,2))*(good?lerp(1,Math.pow((160-v)/310,.8),morph):1);
 const S=(u,v,h=0)=>[cx+u*.91+v*.40,cy+v*.48-h];
 const P=(u,v,h=0)=>{const q=S(u,v,h);return [q[0],q[1]+drop+u*roll];};
 const poly=(pts,fill,stroke=null,w=2)=>{G.beginPath();pts.forEach((q,i)=>i?G.lineTo(...q):G.moveTo(...q));G.closePath();G.fillStyle=fill;G.fill();if(stroke){G.strokeStyle=stroke;G.lineWidth=w;G.stroke();}};
 const stop=[S(-245,162,-25),S(245,162,-25),S(245,183,-25),S(-245,183,-25)];
 poly(stop,C.comp); // the shell lip is fixed while the trigger moves
 for(let v=-150;v<160;v+=31){const pts=[];for(let u=-245;u<=245;u+=24.5)pts.push(P(u,v,H(u,v)));for(let u=245;u>=-245;u-=24.5)pts.push(P(u,v+31,H(u,v+31)));poly(pts,good?rgba(C.hero,.12):inkA(.08));}
 for(const v of [-150,-88,-26,36,98,160])rvLine(Array.from({length:21},(_,i)=>{const u=-245+i*24.5;return P(u,v,H(u,v));}),v===160?col:C.faint,v===160?3.5:1.5);
 for(const u of [-245,-150,0,150,245])rvLine(Array.from({length:21},(_,i)=>{const v=-150+i*15.5;return P(u,v,H(u,v));}),Math.abs(u)===245?col:C.faint,Math.abs(u)===245?2.5:1.2);
 const front=[];for(let u=-245;u<=245;u+=24.5)front.push(P(u,160,H(u,160)));for(let u=245;u>=-245;u-=24.5)front.push(P(u,160,H(u,160)-22));poly(front,good?rgba(C.hero,.24):inkA(.16),col,2);
 const hit=P(contactU,160,H(contactU,160)-22);if(p>.8){if(!good)rvCircle(...hit,8,C.bad);else rvLine([P(-235,160,-22),P(235,160,-22)],C.hero,6);}
 const at=P(side*135,-55,H(side*135,-55));rvFinger(at[0],at[1]-103-18*(1-p),0);rvcAlpha(p,()=>rvArrow([at[0],at[1]-170],[at[0],at[1]-128],good?C.hero:C.bad,3));
 rvLabel('REAR',cx-270,cy-112,{size:20});rvLabel('NOSE / SHELL STOP',cx+60,cy+145,{size:20,align:'center'});
 return {at,hit,front:[P(-235,160,H(-235,160)-22),P(235,160,H(235,160)-22)]};
}
RV.add({id:'rv_front_contact',ch:'click',theme:'paper',title:'A flat front stop. A steady click.',settle:21,
 from:['clk_front','grooves'],feedback:['F27','F33.5'],
 draw:t=>{
 rvHeader(t,'A FLAT FRONT STOP. A STEADY CLICK.','Deep grooves at the nose let one edge land first. Where you press changes how the trigger rocks.');
 rvCompareLabels(t,'DEEP GROOVES REACH THE FRONT','GROOVES SHALLOW INTO A FLAT FRONT');
 const bad=rvcBeat(t,1.6,3,4.1,5.1)+rvcRamp(t,6.1,7.6),side=lerp(-1,1,rvcRamp(t,5.1,6.1)),morph=rvcRamp(t,8.4,10.8),good=rvcRamp(t,12,13.8),goodSide=lerp(-1,1,rvcRamp(t,15.3,17));
 const b=rvcNose(440,550,false,bad,side);let g;rvcAlpha(rvcRamp(t,7.7,8.3),()=>{g=rvcNose(1330,550,true,good,goodSide,morph);});
 // Follow the receding groove along its length, so the shape change is seen rather than just labelled.
 rvcAlpha(rvcBeat(t,8.4,8.8,11,11.7),()=>{const v=lerp(-140,156,morph),u=0,h=24*lerp(1,Math.pow((160-v)/310,.8),morph);rvCursor(t,1330+v*.4,550+v*.48-h,.2);});
 if(t<7.7)rvcPointer(t,[755,365],[b.at[0]+30,b.at[1]-66],.3,1.5,bad);
 else if(t>11.7&&g)rvcPointer(t,[1740,368],[g.at[0]+30,g.at[1]-66],11,12,good);
 rvLabel('LOOKING DOWN TOWARD THE NOSE',80,803,{size:21});
 rvLabel(side<0?'PRESS LEFT: LEFT EDGE LANDS FIRST':'PRESS RIGHT: RIGHT EDGE LANDS FIRST',440,752,{align:'center',color:C.bad,size:23});
 rvcAlpha(morph,()=>rvLabel(good>.8?'PRESS EITHER SIDE: THE SAME FLAT STOP':'GROOVE SHALLOWS TOWARD THE NOSE',1330,752,{align:'center',color:C.heroText,size:23}));
 rvWin('A steady stop. More finger contact.','The rear groove holds your finger sideways; the broad, shallow nose supports more of it. No cheap-feeling rock or repeated edge wear.');
 rvFoot('Mechanical illustration, deformation exaggerated. Rear cutout controls the bend; the front controls where the trigger stops. These are different jobs.');
 }});
RV.add({id:'rv_shoulder_seams',ch:'click',theme:'night',title:'Keep seams out of your grip',settle:20,
 from:['clk_front','shlsheet1'],feedback:['F1.1','F9.28','F11.3','F27','F33.5'],
 draw:t=>{
 rvHeader(t,'KEEP SEAMS OUT OF YOUR GRIP','A side-facing gap can catch skin as the button drops. A wall that meets the pressed trigger avoids the step.');
 rvCompareLabels(t,'SIDE-FACING GAP, PROUD WALL','CEILING-FACING CUTOUT, FLUSH WHEN PRESSED');
 const bad=rvcRamp(t,2.4,4.3),moveWall=rvcRamp(t,7,9.3),good=rvcRamp(t,11.1,13),show=rvcRamp(t,5.5,6.5);
 const b=rvPart(390,480,30,()=>flushMM({press:bad,flush:0,ref:0,accent:C.bad}));let g;
 rvcAlpha(show,()=>{g=rvPart(1260,480,30,()=>flushMM({press:good,flush:moveWall,ref:.5,accent:C.hero}));});
 // The grip stays on the wall while the trigger moves past it. It does not float with the trigger.
 const gripX=lerp(b.step[0]+150,b.step[0]+38,rvcRamp(t,.5,2));rvFinger(gripX,b.wall[1]+20,-Math.PI/2);
 rvcAlpha(show,()=>rvFinger(lerp(1260+6.85*30+150,1260+6.85*30+38,rvcRamp(t,9.6,10.9)),480+(-.0764)*30+20,-Math.PI/2));
 rvcAlpha(bad,()=>{rvCircle(...b.step,9,null,C.bad,4);rvLine([[b.step[0]+15,b.step[1]+5],[b.step[0]+33,b.step[1]-4],[b.step[0]+48,b.step[1]+1]],C.bad,3);});
 rvcAlpha(good,()=>{if(g)rvcTrace([[g.edge[0]-67,g.wall[1]],[g.wall[0]+10,g.wall[1]]],good,C.hero,5);});
 if(t<5.5)rvcPointer(t,[735,363],[b.edge[0]-80,b.edge[1]],1.1,2.4,bad);
 else if(g)rvcPointer(t,[1740,362],[g.edge[0]-80,g.edge[1]],9.8,11.1,good);
 rvMouse(850,533,.85,{seams:true,color:C.faint});rvLine([[850,501],[877,501]],C.hero,3);rvLabel('SECTION',850,617,{size:20,align:'center'});
 rvBody('Further out, the seam is easier to catch with your grip.',80,778,740,{size:28});
 rvcAlpha(moveWall,()=>rvBody('Put the opening on top. Let the grip meet a smooth wall.',1020,778,720,{size:28,color:C.heroText}));
 rvcAlpha(bad,()=>rvLabel('THE BUTTON DROPS. THE EDGE CATCHES.',110,728,{size:23,color:C.bad}));
 rvcAlpha(good,()=>rvLabel('THE BUTTON DROPS. THE GRIP STAYS SMOOTH.',1020,728,{size:23,color:C.heroText}));
 rvWin('The edge should disappear under your finger.','A flush shoulder and one centre split keep the grip continuous. No extra strip beside the wheel.');
 rvFoot('Concept section from the shared shell drawing. The later side-seam redesign remains open; this slide teaches the intended clearance, not a finished tool-ready seam.');
 }});
RV.add({id:'rv_tensioner',ch:'click',theme:'paper',title:'Bridge click tensioning',settle:21,
 from:['tensioner','clk_tenmat'],feedback:['F2.04','F26.1','F28.2','F31.3','F33.5'],
 draw:t=>{
 rvHeader(t,'BRIDGE CLICK TENSIONING','A stiff trigger is good at holding its shape. It needs a deliberate place to bend, or your finger pays for that stiffness.');
 const bad=rvcRamp(t,1.8,3.6),crown=rvcRamp(t,6.7,9.1),good=rvcRamp(t,11.4,13.4),clampIn=rvcRamp(t,9.3,10.7);
 rvLabel('AS SEEN IN STARLIGHT X: NO BRIDGE',100,310);
 rvLabel('PROPOSED: A THIN CROWN, ON THE SWITCH AXIS',100,576,{color:C.heroText});
 for(let i=0;i<2;i++){
  const y=360+i*266,p=i?good:bad,dy=p*(i?35:9),col=i?C.hero:C.mute,arch=i?crown:0;
  rvRect(120,y,140,64,C.comp,4);rvCircle(190,y+32,11,C.bg,C.mute,2);
  rvRect(178,y+9,24,71,C.ink,2);for(let yy=y+17;yy<y+76;yy+=9)rvLine([[179,yy],[200,yy-5]],C.faint,1.5);
  const screwDrop=i?lerp(43,0,clampIn):0;rvRect(167,y+76+screwDrop,46,13,C.mute,4);rvLine([[180,y+82+screwDrop],[200,y+82+screwDrop]],C.ink,2);
  rvRect(600,y+dy,300,24,i?rgba(C.hero,.20):inkA(.1),3,col);
  G.beginPath();G.moveTo(260,y+24);G.bezierCurveTo(330,y+24-62*arch,490,y+24-62*arch+dy,600,y+24+dy);
  G.lineTo(600,y+36+dy);G.bezierCurveTo(490,y+36-68*arch+dy,330,y+36-68*arch,260,y+36);G.closePath();G.fillStyle=col;G.fill();
  rvcAlpha(p,()=>rvArrow([770,y-42],[770,y-3+dy],col,4));
  if(i){rvcAlpha(crown,()=>{rvLine([[422,y-62],[422,y+54]],C.hero,2,.45,[6,6]);rvcTrace([[280,y+19],[360,y-18],[422,y-24],[500,y-10],[580,y+23+dy]],good,C.hero,3);});}
 }
 if(t<6)rvcPointer(t,[956,354],[780,357+bad*9],.5,1.8,bad);
 else if(t<10.9)rvcPointer(t,[800,520],[422,604],6,9.1,crown);
 else rvcPointer(t,[958,591],[780,623+good*35],10.2,11.4,good);
 rvLabel('MODELLED FORCE, SAME TRAVEL',1090,333);
 const vals=[['ABS, FLAT',8.1,C.comp],['STIFF COMPOSITE, FLAT',26.9,C.comp],['COMPOSITE + BRIDGE',7.7,C.hero]];
 vals.forEach((r,i)=>{const y=415+i*129,k=rvcRamp(t,i===2?11.4:1.8+i*.6,i===2?13.4:3.6+i*.6);rvLabel(r[0],1090,y,{color:r[2]===C.hero?C.heroText:C.mute,size:22});rvBar(1090,y+22,600,r[1]*k,30,r[2]);rvTxt((r[1]*k).toFixed(1)+' gf',1740,y+57,34,{align:'right',color:r[2]===C.hero?C.heroText:C.ink});});
 rvcAlpha(good,()=>rvBa(1090,782,'26.9 gf','7.7 gf','STIFF COMPOSITE: FLAT → BRIDGE'));
 rvWin('Stiff where you grip. Light where you click.','The bridge controls where and how easily it bends. One screw holds each block; square bridge roots, aligned with its switch.');
 rvFoot('Illustrative 0.8/0.4 mm bridge model from the original deck, not a production force test. Real tensioner size remains unknown (F12.5). Lower force is better here.');
 }});
function rvcRail(cx,cy,good,p,side,assembly={wall:1,pad:1,post:1}){
 G.save();G.translate(cx,cy);
 rvRect(-295,120,590,22,C.comp,3); // fixed lower shell, not free-floating guide blocks
 rvRect(-155,67,110,53,C.panel,6,C.mute,2);rvRect(-116,47+18*p,32,21,C.ink,7); // full-size switch, end-on
 for(const x of good?[-100,130]:[-100])for(const s of [-1,1]){
  const shift=good?s*84*(1-assembly.wall):0;rvRect(x+s*47-12+shift,-48,24,168,C.comp,5);
  if(good)rvcAlpha(assembly.pad,()=>rvRect(x+(s<0?-36:24)+s*90*(1-assembly.pad),-40,12,80,C.hero,4));
 }
 G.save();G.translate(0,18*p-(good?65*(1-assembly.post):0));if(!good){G.translate(-100,0);G.rotate(side*.065*p);G.translate(100,0);}
 G.beginPath();G.moveTo(-280,-110);G.bezierCurveTo(-100,-145,150,-128,280,-105);G.lineTo(280,-81);G.lineTo(-280,-81);G.closePath();G.fillStyle=good?rgba(C.hero,.18):inkA(.12);G.fill();G.strokeStyle=good?C.hero:C.mute;G.lineWidth=3;G.stroke();
 for(const x of good?[-100,130]:[-100])rvRect(x-24,-83,48,130,good?C.panel:C.comp,8,C.mute,2); // truly identical 2.4-mm posts
 G.restore();
 rvcAlpha(good?assembly.post:1,()=>{rvFinger(side*150,-215+18*p,0);rvcAlpha(p,()=>rvArrow([side*150,-267],[side*150,-240+18*p],good?C.hero:C.bad,4));});
 G.restore();
}
RV.add({id:'rv_dual_rail',ch:'click',theme:'night',title:'Dual rail main clicks',settle:22,
 from:['anchors','clk_pomtune'],feedback:['F2.06','F26.2','F31.3','F33.5'],
 draw:t=>{
 rvHeader(t,'DUAL RAIL MAIN CLICKS','One post lets an off-centre press roll the trigger. Two identical guides keep the press in one plane.');
 rvCompareLabels(t,'ONE GUIDE: ROOM TO ROLL','TWO GUIDES: THE SAME POST, TWICE');
 const bad=rvcRamp(t,1.7,3.3),side=lerp(-1,1,rvcRamp(t,4.4,5.9)),good=rvcRamp(t,12.1,14),goodSide=lerp(-1,1,rvcRamp(t,15.5,17.2));
 const assembly={wall:rvcRamp(t,6.3,7.7),pad:rvcRamp(t,7.9,9.3),post:rvcRamp(t,9.7,11.1)};
 rvcRail(440,555,false,bad,side);rvcAlpha(rvcRamp(t,5.8,6.3),()=>rvcRail(1330,555,true,good,goodSide,assembly));
 rvLabel('FRONT SECTION',800,388,{size:20,align:'center'});rvMouse(800,487,.7,{seams:true,color:C.faint});rvLine([[777,460],[823,460]],C.hero,3);
 rvcAlpha(assembly.pad,()=>{rvLabel('POM',1660,520,{color:C.heroText,size:23});rvLine([[1650,510],[1513,510],[1496,530]],C.hero,2);});
 rvBody('Loose movement feels cheap. Every sideways scrape works the guide again.',110,722,690,{size:28});
 rvcAlpha(assembly.pad,()=>{rvLabel('POM PAD THICKNESS SETS THE FIT',1030,707,{color:C.heroText});for(let i=0;i<4;i++){rvRect(1050+i*157,744,65,13+i*3,i===2?C.hero:C.comp,4);rvTxt((.25+i*.05).toFixed(2)+' mm',1082+i*157,802,27,{align:'center',color:C.mute});}rvTxt('example steps',1690,779,23,{maxW:140,color:C.mute});});
 if(t<6)rvcPointer(t,[760,367],[440+side*150,444+bad*18],.4,1.7,bad);
 else if(t<9.7)rvcPointer(t,[1730,380],[1498,516],6.3,7.9,assembly.pad);
 else rvcPointer(t,[1730,368],[1330+goodSide*150,444+good*18],10.8,12.1,good);
 rvcAlpha(assembly.post,()=>rvLabel('2.4 mm = 2.4 mm',1330,375,{align:'center',size:27,color:C.heroText}));
 rvWin('One direction to move. No room to rock.','Both posts and both pad pairs match. Adjust the replaceable POM pads at the factory, rather than re-cutting the tool.');
 rvFoot('Front section, travel and looseness exaggerated. The pad ladder is a manufacturing example, not measured final clearances or a rival tolerance claim.');
 }});
// Detailed swMM geometry; only the slowed contact state is continuous.
function rvcSpdtMM(o = {}) {
  const Q = SWG, d = clamp(o.press || 0) * Q.TT, contact = clamp(o.contact == null ? (d >= Q.OP ? 1 : 0) : o.contact), no = contact > 0.5, A = o.accent || acc(), clear = !!o.clear;
  const plm = o.plunger || MT.pom, out = {};
  if (o.board) pcbSec(o.boardX ? o.boardX[0] : -2.2, o.boardX ? o.boardX[1] : 15.0, 0.2, 1.2, { holes: Q.pins });
  for (const x of Q.pins) solid(() => { G.beginPath(); G.moveTo(x - 0.5, -0.3); G.lineTo(x + 0.5, -0.3); G.lineTo(x + 0.5, 0.45); G.lineTo(x + 0.26, 0.68); G.lineTo(x + 0.26, 3.2); G.lineTo(x + 0.1, 3.5); G.lineTo(x - 0.1, 3.5); G.lineTo(x - 0.26, 3.2); G.lineTo(x - 0.26, 0.68); G.lineTo(x - 0.5, 0.45); G.closePath(); }, MT.tin, [x - 0.5, 0, 1, 3.5], { horiz: true, lw: 0.85 });
  if (o.board) for (const x of Q.pins) { solderFillet(x, 1.4, 1); solderFillet(x, 0.2, -1); }
  const base = () => { G.beginPath(); G.moveTo(0, Q.base); G.lineTo(12.8, Q.base); G.lineTo(12.8, -0.3); G.quadraticCurveTo(12.8, 0, 12.5, 0); G.lineTo(0.3, 0); G.quadraticCurveTo(0, 0, 0, -0.3); G.closePath(); };
  for (const fx of [0.45, 11.55]) solid(() => { G.beginPath(); G.rect(fx, -0.1, 0.8, 0.3); }, MT.black, [fx, 0, 0.8, 0.2], { lw: 0.7 });
  solid(base, MT.black, [0, Q.base, 12.8, -Q.base], {});
  const pt = Q.top + d, x0 = Q.px - 0.75, x1 = Q.px + 0.75;
  const Ax = 1.85, Ay = -4.08, Bx = Q.px, By = -4.06 + d, Fx = 10.3, Fy = lerp(-4.015, -3.185, contact);
  const u = (Bx - Ax) / (Fx - Ax), Cx = (Bx - (1 - u) * (1 - u) * Ax - u * u * Fx) / (2 * u * (1 - u)), Cy = (By - (1 - u) * (1 - u) * Ay - u * u * Fy) / (2 * u * (1 - u));
  const qb = s => [(1 - s) * (1 - s) * Ax + 2 * s * (1 - s) * Cx + s * s * Fx, (1 - s) * (1 - s) * Ay + 2 * s * (1 - s) * Cy + s * s * Fy];
  if (clear) {
    /* COM support: carries the leaf at the top and the tongue in a notch below */
    solid(() => { G.beginPath(); G.moveTo(1.15, Q.base); G.lineTo(1.15, -3.78); G.lineTo(0.72, -3.78); G.lineTo(0.72, -4.02); G.lineTo(2.4, -4.02); G.lineTo(2.4, -3.78); G.lineTo(1.65, -3.78); G.lineTo(1.65, -3.12); G.lineTo(2.32, -3.12); G.lineTo(2.32, -2.97); G.lineTo(2.06, -2.88); G.lineTo(2.32, -2.79); G.lineTo(2.32, -2.64); G.lineTo(1.65, -2.64); G.lineTo(1.65, Q.base); G.closePath(); }, MT.copper, [0.72, -4.02, 1.7, 2.3], { horiz: true, lw: 0.8 });
    /* NO contact on a pad, wired to the middle leg */
    solid(() => { G.beginPath(); G.moveTo(6.15, Q.base); G.lineTo(6.15, -1.92); G.lineTo(9.55, -1.92); G.lineTo(9.55, -2.6); G.lineTo(11.05, -2.6); G.lineTo(11.05, Q.base); G.closePath(); }, MT.copper, [6.15, -2.6, 4.9, 0.9], { lw: 0.8 });
    /* NC contact on a strip that runs down the right wall to the right leg */
    solid(() => { G.beginPath(); G.moveTo(9.25, -4.9); G.lineTo(12.08, -4.9); G.lineTo(12.08, Q.base); G.lineTo(11.76, Q.base); G.lineTo(11.76, -4.6); G.lineTo(9.25, -4.6); G.closePath(); }, MT.copper, [9.25, -4.9, 2.83, 3.2], { lw: 0.8 });
    const dome = (cx, cy, up) => { G.beginPath(); G.ellipse(cx, cy, 0.34, 0.26, 0, up ? Math.PI : 0, up ? TAU : Math.PI); G.closePath(); };
    solid(() => dome(10.3, -4.6, false), MT.silver, [9.96, -4.6, 0.68, 0.26], { lw: 0.7 });
    solid(() => dome(10.3, -2.6, true), MT.silver, [9.96, -2.86, 0.68, 0.26], { lw: 0.7 });
    /* the tongue: a compressed strip from the notch to the leaf; it pushes the leaf end over centre */
    const T = qb(0.8), mx = (2.06 + T[0]) / 2, my = (-2.88 + T[1]) / 2 + lerp(0.46, -0.36, contact);
    G.beginPath(); G.moveTo(2.06, -2.88); G.quadraticCurveTo(mx, my, T[0], T[1]); G.strokeStyle = '#b88a3c'; G.lineWidth = 0.1; G.lineCap = 'round'; G.stroke();
    /* the leaf */
    G.beginPath(); G.moveTo(Ax, Ay); G.quadraticCurveTo(Cx, Cy, Fx, Fy); G.strokeStyle = '#cf9f48'; G.lineWidth = 0.13; G.lineCap = 'butt'; G.stroke();
    G.save(); G.translate(0, -0.035); G.beginPath(); G.moveTo(Ax + 0.2, Ay); G.quadraticCurveTo(Cx, Cy, Fx - 0.25, Fy); G.strokeStyle = 'rgba(255,236,190,0.75)'; G.lineWidth = 0.035; G.stroke(); G.restore();
    G.beginPath(); G.ellipse(1.42, -4.1, 0.34, 0.22, 0, Math.PI, TAU); G.closePath(); G.fillStyle = grad(MT.silver, 1.1, -4.3, 1.1, -4.1); G.fill(); G.strokeStyle = edgeCol(MT.silver); G.lineWidth = lw(0.7); G.stroke();
    /* the moving contact, a rivet through the leaf end */
    solid(() => { G.beginPath(); G.ellipse(Fx, Fy - 0.065, 0.32, 0.26, 0, Math.PI, TAU); G.closePath(); }, MT.silver, [Fx - 0.32, Fy - 0.33, 0.64, 0.26], { lw: 0.7 });
    solid(() => { G.beginPath(); G.ellipse(Fx, Fy + 0.065, 0.32, 0.26, 0, 0, Math.PI); G.closePath(); }, MT.silver, [Fx - 0.32, Fy + 0.065, 0.64, 0.26], { lw: 0.7 });
    const cp = [10.3, lerp(-4.34, -2.86, contact)];
    if (o.glow !== false) glow(cp[0], cp[1], 0.95, A, 0.6);
    out.nc = SP(10.3, -4.75); out.no = SP(10.3, -2.45); out.com = SP(1.4, -3.3); out.leaf = SP(7.6, qb(0.68)[1]); out.tongue = SP(mx, my); out.contact = SP(cp[0], cp[1]);
    /* plunger stem and its captive flange */
    solid(() => { G.beginPath(); G.moveTo(x0 + 0.12, -6.5); G.lineTo(x1 - 0.12, -6.5); G.lineTo(x1 - 0.12, By - 0.32); G.quadraticCurveTo(x1 - 0.12, By - 0.065, Q.px, By - 0.065); G.quadraticCurveTo(x0 + 0.12, By - 0.065, x0 + 0.12, By - 0.32); G.closePath(); }, plm, [x0, -6.5, 1.5, 2.4], { horiz: true, lw: 0.8 });
    solid(() => { G.beginPath(); G.rect(x0 - 0.42, -6.04 + d, 2.34, 0.34); }, plm, [x0 - 0.42, -6.04 + d, 2.34, 0.34], { lw: 0.8 });
  }
  const cover = () => { G.beginPath(); G.moveTo(0, Q.base); G.lineTo(0, -6.0); G.quadraticCurveTo(0, -6.5, 0.5, -6.5); G.lineTo(12.3, -6.5); G.quadraticCurveTo(12.8, -6.5, 12.8, -6.0); G.lineTo(12.8, Q.base); G.closePath(); };
  if (clear) {
    cover(); G.fillStyle = TH ? 'rgba(40,60,80,0.05)' : 'rgba(200,215,232,0.06)'; G.fill();
    G.beginPath(); G.moveTo(0.45, Q.base); G.lineTo(0.45, -5.7); G.quadraticCurveTo(0.45, -6.05, 0.8, -6.05); G.lineTo(4.62, -6.05); G.moveTo(6.58, -6.05); G.lineTo(12.0, -6.05); G.quadraticCurveTo(12.35, -6.05, 12.35, -5.7); G.lineTo(12.35, Q.base);
    G.strokeStyle = inkA(0.22); G.lineWidth = lw(1); G.stroke();
    for (const gx of [4.62, 6.38]) { G.beginPath(); G.rect(gx, -6.05, 0.2, 0.95); G.fillStyle = inkA(0.06); G.fill(); G.strokeStyle = inkA(0.2); G.lineWidth = lw(0.8); G.stroke(); }
    cover(); G.strokeStyle = inkA(0.62); G.lineWidth = lw(1.25); G.stroke();
    const sh = G.createLinearGradient(0, -6.5, 6, 0); sh.addColorStop(0, 'rgba(255,255,255,0.10)'); sh.addColorStop(0.35, 'rgba(255,255,255,0)'); cover(); G.fillStyle = sh; G.fill();
  } else {
    solid(cover, MT.black, [0, -6.5, 12.8, 4.8], {});
    const sh = G.createLinearGradient(0, 0, 12.8, 0); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(0.28, 'rgba(255,255,255,0.06)'); sh.addColorStop(0.4, 'rgba(255,255,255,0)'); cover(); G.fillStyle = sh; G.fill();
    for (const [ex, ey] of [[2.4, -4.2], [10.4, -4.2]]) { G.beginPath(); G.arc(ex, ey, 0.55, 0, TAU); G.fillStyle = 'rgba(0,0,0,0.16)'; G.fill(); G.strokeStyle = 'rgba(255,255,255,0.07)'; G.lineWidth = lw(1); G.stroke(); }
    G.beginPath(); G.moveTo(0.55, -6.42); G.lineTo(12.25, -6.42); G.strokeStyle = 'rgba(255,255,255,0.16)'; G.lineWidth = lw(1); G.stroke();
    G.fillStyle = '#0a0a0b'; G.fillRect(x0 - 0.05, -6.52, 1.6, 0.1);
  }
  G.beginPath(); G.moveTo(0, Q.base); G.lineTo(12.8, Q.base); G.strokeStyle = 'rgba(0,0,0,0.55)'; G.lineWidth = lw(1.2); G.stroke();
  solid(() => { G.beginPath(); G.moveTo(x0, -6.5); G.lineTo(x0, pt + 0.38); G.quadraticCurveTo(x0, pt, x0 + 0.38, pt); G.lineTo(x1 - 0.38, pt); G.quadraticCurveTo(x1, pt, x1, pt + 0.38); G.lineTo(x1, -6.5); G.closePath(); }, plm, [x0, pt, 1.5, 1], { horiz: true, lw: 1 });
  out.plunger = SP(Q.px, pt); out.body = SP(6.4, -3.6); out.top = SP(6.4, -6.5); out.right = SP(12.8, -3.6); out.left = SP(0, -3.6); out.legs = Q.pins.map(x => SP(x, 3.5)); out.contactProgress = contact; out.isNO = no; out.d = d;
  return out;
}
RV.add({id:'rv_spdt',ch:'click',theme:'paper',title:'Single pole, double throw',settle:20,
 from:['clk_spdt','latency','clk_debounce','clk_wait','clk_methods','clk_switch2','clk_switch'],feedback:['F9.4','F9.9','F27','F31.1','F33.5'],
 draw:t=>{
 rvHeader(t,'SINGLE POLE, DOUBLE THROW','A normal contact tells you when it lands. SPDT also tells you when it leaves the other contact.');
 const pr=kf(t,[[0,0],[1.8,0],[3.8,.37],[4.6,.39],[6.8,.69],[7.5,.72],[9,1]]),contact=clamp((pr-.38)/.32),nc=contact===0,no=contact===1;
 const physical=rvPart(140,665,44,()=>rvcSpdtMM({press:pr,contact,clear:true,accent:C.hero,glow:false}));
 rvLabel('ONE POLE = THIS MOVING LEAF',120,308,{size:24});rvLabel('TWO THROWS = TWO CONTACTS',1010,308,{size:24});
 rvLabel('NC',1050,391,{size:27});rvLabel('NO',1050,557,{size:27});
 const y=lerp(382,548,contact);rvCircle(1170,382,12,nc?C.hero:C.comp);rvCircle(1170,548,12,no?C.hero:C.comp);rvCircle(1600,465,14,C.ink);
 rvLine([[1600,465],[1183,y]],C.hero,8);rvLabel('COMMON',1650,474,{size:25});
 rvTxt(nc?'1  REST: NC CLOSED':no?'3  NO LANDS LATER':'2  NC OPENS: COUNT THE CLICK',1010,627,32,{color:nc?C.mute:C.heroText,weight:800});
 const x0=1010,x1=1780,trackY=718,edge=lerp(x0,x1,.38),land=lerp(x0,x1,.70);
 rvLine([[x0,trackY],[x1,trackY]],C.hair,4);rvcTrace([[x0,trackY],[x1,trackY]],pr,C.hero,5);
 rvLabel('PRESS STARTS',x0,682,{size:22});rvLabel('NC RELEASE',edge,777,{align:'center',color:C.heroText,size:22});rvLabel('NO LANDS',land,777,{align:'center',color:C.mute,size:22});
 rvCircle(edge,trackY,8,C.hero);rvCircle(land,trackY,7,C.comp);rvCircle(lerp(x0,x1,pr),trackY,13,C.panel,C.hero,4);
 rvcAlpha(rvcRamp(t,4.1,4.6),()=>{rvArrow([edge,802],[land,802],C.hero,3);rvTxt('Opening is already an input.',1010,844,30,{color:C.heroText});});
 rvcPointer(t,[850,340],physical.plunger,.3,1.8,pr);
 // The same physical rivet drives the magnified leaf, state label and travel marker in one frame.
 rvcAlpha(rvcBeat(t,3.8,4.2,7.5,8.2),()=>{rvCircle(...physical.contact,22,null,C.hero,3);rvLine([[physical.contact[0]+26,physical.contact[1]],[902,physical.contact[1]],[985,465]],C.faint,2,.8,[6,5]);});
 rvWin('Count the intentional edge.','No forced millisecond wait. Adjustable debounce keeps deliberate double-click play available.');
 rvFoot('Contact sequence slowed, not a timing trace. Electrical target: 70 µs; mechanical travel adds time before PC input. Normal SPDT internals; final switch SKU undecided.');
 }});
RV.add({id:'rv_hotswap',ch:'click',theme:'night',title:'A switch should be replaceable',settle:20,
 from:['clk_hotswap'],feedback:['F2.08','F27','F33.6'],
 draw:t=>{
 rvHeader(t,'A SWITCH SHOULD BE REPLACEABLE','A worn switch should cost a switch. Soldering it to the board turns a small repair into a specialist job.');
 const heat=rvcRamp(t,1.3,3.1),release=rvcRamp(t,7,8.6),lift=rvcRamp(t,9,12.1),show=rvcRamp(t,5,6.1);
 rvCompareLabels(t,'SOLDERED TO THE BOARD','CLAW CONTACTS HOLD THE PINS');
 rvPart(300,588,28,()=>swMM({press:0,clear:true,board:true,accent:C.mute,glow:false}));
 rvcAlpha(heat,()=>{const tip=[300+SWG.pins[1]*28,627],off=55*(1-heat);rvLine([[770,521-off],[658,568-off]],C.comp,25);rvLine([[658,568-off],[tip[0]+22,tip[1]-8-off]],C.mute,10);rvLine([[tip[0]+22,tip[1]-8-off],[tip[0],tip[1]-off]],C.ink2,4);rvCircle(tip[0],tip[1],12,null,C.bad,3);});
 rvcAlpha(show,()=>{
  rvRect(1040,691,720,24,C.comp,4);
  const sy=603-120*lift,origin=1254;rvPart(origin,sy,24,()=>swMM({press:0,clear:true,board:false,accent:C.hero,glow:false}));
  for(const pin of SWG.pins){const x=origin+pin*24,jaw=lerp(7,24,release);
   // All three insertion axes and their jaw centers use the switch's actual pin positions.
   rvLine([[x,530],[x,690]],C.faint,1.5,.7,[4,5]);
   rvLine([[x-21,692],[x-21,654],[x-jaw-7,632],[x-jaw,622],[x-jaw,663]],C.hero,6);
   rvLine([[x+21,692],[x+21,654],[x+jaw+7,632],[x+jaw,622],[x+jaw,663]],C.hero,6);
   rvRect(x-19,689,38,17,C.comp,3);
  }
  rvcAlpha(lift,()=>rvArrow([1715,665],[1715,452],C.hero,4));
  rvTxt(lift>.96?'Pin clear. Spring contact stays on the board.':release>.96?'The jaws open before the pin clears.':'Spring jaws grip each pin.',1040,764,28,{maxW:750,color:C.heroText});
 });
 if(t<5)rvcPointer(t,[802,395],[480,627],.3,1.3,heat);
 else rvcPointer(t,[1735,372],[1408,489-120*lift],5.5,7,lift);
 rvLabel('HEAT, TOOLS, RISK TO THE BOARD',110,812);rvcAlpha(lift,()=>rvLabel('REPLACE THE PART. KEEP THE MOUSE.',1040,812,{color:C.heroText}));
 rvWin('A repair you can actually do.','Visible spring contacts grip each pin. Pull the switch, push in another. The claw is drawn large enough to see how it releases.');
 rvFoot('Mill-Max 3305 contact reference: 1,000 insertion cycles minimum under its specified lead sizes. The Theseus socket design still needs its own fit and endurance validation.');
 }});
RV.add({id:'rv_sidebuttons',ch:'click',theme:'paper',title:'Main-switch feel. On the side.',settle:21,
 from:['sidebuttons'],feedback:['F9.16','F9.17','F12.4','F26.2','F31.3','F31.4','F33.5'],
 draw:t=>{
 rvHeader(t,'MAIN-SWITCH FEEL. ON THE SIDE.','Tiny side switches and a long bending button are an easy place to save weight. They are also easy to feel.');
 rvCompareLabels(t,'SMALL SWITCH, LONG LEVER','FULL-SIZE SPDT, SHELL-HELD GUIDE');
 const bad=rvcRamp(t,1.8,4),good=rvcRamp(t,11.8,14),match=rvcRamp(t,7.6,10.1),show=rvcRamp(t,6.3,7.4);
 const b=rvPart(430,420,24,()=>clk_hingeMM({press:bad,accent:C.bad}));let g;
 rvcAlpha(show,()=>{g=rvPart(1370,420,24,()=>clk_gloveMM({press:good,accent:C.hero}));});
 rvcAlpha(bad,()=>{rvArrow([b.press[0],b.press[1]-92],b.press,C.bad,4);rvCircle(...b.hinge,12,null,C.bad,3);});
 rvcAlpha(good,()=>{if(g){rvArrow([g.press[0],g.press[1]-92],g.press,C.hero,4);rvLine([[g.arm[0],g.arm[1]],[g.arm[0]+126,g.arm[1]]],C.hero,3);}});
 // Match-cut the contact end from the main guide into the side guide. 2.4 mm and 0.6 mm stay fixed.
 rvcAlpha(rvcBeat(t,5,5.7,10.3,11),()=>{
  const x=lerp(1010,1370,match),y=lerp(390,420,match),sc=24;
  rvRect(x-1.2*sc,y+1.4*sc,2.4*sc,1.5*sc,C.hero,sc*.3);
  for(const sg of [-1,1])rvRect(x+(sg<0?-1.86:1.26)*sc,y+2.6*sc,.6*sc,.65*sc,C.hero,2);
  rvLine([[x-25.2,y+12],[x+25.2,y+12]],C.mute,2);rvLine([[x-25.2,y+5],[x-25.2,y+19]],C.mute,2);rvLine([[x+25.2,y+5],[x+25.2,y+19]],C.mute,2);
  rvTxt('2.4 mm',x,y-1,27,{align:'center',color:C.heroText});
 });
 rvcAlpha(rvcBeat(t,5,5.7,7.2,8),()=>rvBody('Main post + POM\nSame size on the side.',810,595,280,{size:27,color:C.heroText}));
 if(t<5)rvcPointer(t,[760,361],b.press,.3,1.8,bad);
 else if(t<10.5)rvcPointer(t,[1740,345],[lerp(1010,1370,match),lerp(430,465,match)],5,7.6,match);
 else if(g)rvcPointer(t,[1740,361],g.press,10.5,11.8,good);
 rvBody('The cap keeps bending after the switch clicks.',110,774,680,{size:28});
 rvcAlpha(match,()=>rvBody('Same 2.4 mm post. Same POM pads. No separate side board.',1030,774,720,{size:28,color:C.heroText}));
 rvWin('Four full-size switches. Still 29.31 g.','The shell holds the side switches. One guide design carries the tolerance work from the main buttons to the side.');
 rvFoot('29.31 g is the full-mouse target. No shipping SPDT side-button mouse, per Brock’s survey. Fixed guide shown for review; its final form is still open (F31.4).');
 }});
