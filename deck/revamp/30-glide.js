/* F27: one camera story, then the support that keeps the story true. */
const rvgWeaveCache=new Map();
function rvgWeave(x,y,s=12,offset=0,blur=0,w=326,h=230){
 // Blur a single code-drawn exposure, not hundreds of individual yarn primitives.
 // This keeps the temporal review responsive without changing the pattern or using an image asset.
 const key=[s,C.panel,C.comp,C.hair,C.faint].join('|');let cv=rvgWeaveCache.get(key);
 if(!cv){cv=document.createElement('canvas');cv.width=640;cv.height=320;const c=cv.getContext('2d');c.fillStyle=C.panel;c.fillRect(0,0,640,320);
  for(let j=-2;j<20;j++)for(let i=-2;i<38;i++){const hash=((i*31+j*17+i*j*7)%13+13)%13,xx=(i+2)*s,yy=(j+2)*s;c.fillStyle=hash<4?C.comp:hash<8?C.hair:C.faint;c.fillRect(xx,yy,s*.78,s*.78);c.strokeStyle=C.faint;c.lineWidth=.9;c.beginPath();c.moveTo(xx+2,yy+2);c.lineTo(xx+s*.55,yy+s*.55);c.stroke();}rvgWeaveCache.set(key,cv);
 }
 G.save();G.beginPath();G.rect(x,y,w,h);G.clip();if(blur)G.filter='blur('+blur+'px)';G.drawImage(cv,x-2*s+offset,y-2*s);G.restore();
}
RV.add({id:'rv_sensor_camera',ch:'glide',theme:'night',title:'Your sensor is a camera',settle:22,
 from:['glide','gld_camera','gld_corr','gld_blur','focus'],feedback:['F2.02','F2.03','F14.4','F27'],
 draw:t=>{
 rvHeader(t,'YOUR SENSOR IS A CAMERA','It compares pictures of the pad. Blur takes away the detail it needs to tell one movement from another.');
 const fit=rvcRamp(t,1.1,3.2),lift=42*rvcBeat(t,4,5.8,7.7,9.8)-34*rvcBeat(t,15,16.8,18.5,20.6),k=fit*(1-Math.min(1,Math.abs(lift)/42)),move=40*rvcRamp(t,11,13.6),s=38;
 rvLabel('SIDE VIEW, ENLARGED',100,312);
 const X=z=>430+z*s+move,Y=y=>699-y*s-lift,padY=699-GLDS.pad*s;
 gld_boardSec(X,Y,-8,9,1);gld_moduleSec(X,Y,s,1);gld_lensSec(X,y=>Y(y)+34*(1-fit),s,1);
 const ray=k>.8?C.hero:C.bad,spot=[X(GLDS.axis),padY];
 rvcAlpha(fit,()=>{for(const a of [-1.1,0,1.1])rvLine([spot,[X(GLDS.axis+a),Y(GLDS.ref)],[X(2.22),Y(4.7)]],ray,2,.6);});
 rvLine([[110,padY],[875,padY]],C.mute,4);
 for(let i=0;i<42;i++){const x=110+i*18;rvLine([[x,padY+3],[x+9,padY+12],[x+18,padY+3]],C.comp,1.5);}
 rvLabel('CASTELLATED SENSOR MODULE',100,378);rvLine([[600,390],[600,Y(5.7)],[X(5),Y(5.7)]],C.faint,2);
 rvLabel('SNAP-ON LENS',100,678);rvLabel(fit<.99?'CLIP THE LENS INTO THE BOARD':lift>12?'TOO FAR: DETAIL BLURS':lift<-12?'TOO CLOSE: DETAIL BLURS':'CALIBRATED: DETAIL RETURNS',442,814,{align:'center',color:k>.8?C.heroText:C.bad,size:24});
 rvLabel('FRAME A',1030,312);rvLabel('FRAME B / NEXT EXPOSURE',1435,312);
 rvgWeave(1030,350,16,0,5*(1-k));rvgWeave(1435,350,16,-move,5*(1-k));
 // The same outlined patch really translates in B: this is a correspondence, not a decorative arrow.
 rvRect(1126,414,64,64,null,0,k>.8?C.hero:C.bad,3);rvRect(1531-move,414,64,64,null,0,k>.8?C.hero:C.bad,3);
 rvcAlpha(rvcRamp(t,10.5,11),()=>{rvArrow([1155,626],[1575,626],C.hero,4);rvTxt('Detail shifts left. The mouse moved right.',1030,682,31,{color:C.heroText,maxW:750});});
 rvcAlpha(rvcRamp(t,3.6,4),()=>{const lx=890;rvLine([[lx,Y(GLDS.ref)],[lx,padY]],ray,2);rvLine([[lx-7,Y(GLDS.ref)],[lx+7,Y(GLDS.ref)]],ray,2);rvLine([[lx-7,padY],[lx+7,padY]],ray,2);});
 if(t<3.5)rvcPointer(t,[840,360],[X(7.5),Y(3.5)+34*(1-fit)],.3,1.1,fit);
 else rvcPointer(t,[840,360],[X(2.2),Y(5.7)-12],3.3,4,Math.abs(lift)/42);
 rvBa(1030,748,'0.4 mm','0.2 mm','TIGHTER DESIGN WINDOW');
 rvWin('Keep the image sharp before adding DPI.','The camera cannot refocus like a phone. The lens, shell and skates have to hold its distance to the pad.');
 rvFoot('Pattern, blur and lens rays are explanatory drawings, not sensor imagery. The 0.2 mm preferred window is the design brief; lens height follows the chosen PixArt implementation.');
 }});
function rvgBase(cx,cy,t,good=true,state={corner:1,lens:1}){
 const col=good?C.hero:C.mute;
 rvMouse(cx,cy,4.8,{color:col,seams:false,fill:C.panel,rot:-Math.PI/2,draw:()=>{
  G.save();keyPath();G.clip();
  for(const y of [-42,42])for(const side of [-1,1]){
   const x=side*20;
   if(good){
    // Joined to the rim and clipped to its actual silhouette; the inner end is a filleted 23-mm ledge.
    rvRect(side<0?-36:x-6.8,y-11.5,22.8,23,rgba(C.hero,.18),2.5);
    for(const yy of [y-5.5,y+5.5])rvCircle(x-side*8*(1-state.corner),yy,2.75,C.hero);
    rvCircle(x,y,2.75,null,rgba(C.hero,.45),.35);
   }else{rvRect(x-8,y-12,16,24,C.comp,4);}
  }
  const actualSy=-16.57,sy=actualSy+(good?10*(1-state.lens):0);
  if(good){
   rvRect(-2.6,actualSy-7.1,5.2,14.2,null,.7,C.faint,.4);
   rvcAlpha(state.lens,()=>{rvRect(-11.5,sy-1.7,23,3.4,rgba(C.hero,.22),.4);
    for(const side of [-1,1]){rvCircle(side*11.5,sy,3.6,rgba(C.hero,.2));rvCircle(side*11.5,sy,2.75,C.hero);}});
  }
  rvRect(-2.6,sy-7.1,5.2,14.2,C.bg,.7,col,.45);
  for(const yy of [sy-3,sy+.8])rvCircle(0,yy,yy<sy?1.05:.75,C.ink);
  for(const yy of [sy-8,sy+8]){rvRect(-1,yy-.9,2,1.8,C.comp,.3);rvLine([[0,yy-.8],[0,yy+.8]],C.faint,.25);}
  G.restore();
 }});
}
function rvgSagSection(x,y,good,p){
 const col=good?C.hero:C.bad,span=good?45:290,sag=p*(good?3:25),Y=u=>y+sag*Math.max(0,1-Math.pow((u-310)/span,2));
 const beam=Array.from({length:63},(_,i)=>[x+i*10,Y(i*10)]);
 G.beginPath();beam.forEach((q,i)=>i?G.lineTo(...q):G.moveTo(...q));beam.slice().reverse().forEach(q=>G.lineTo(q[0],q[1]+13));G.closePath();G.fillStyle=C.panel;G.fill();G.strokeStyle=col;G.lineWidth=3;G.stroke();
 const pad=y+60;rvLine([[x,pad],[x+620,pad]],C.mute,3);
 const supports=good?[20,265,355,600]:[20,600];
 for(const u of supports){rvRect(x+u-15,pad-10,30,10,C.comp,3);rvLine([[x+u,Y(u)+13],[x+u,pad-10]],C.comp,5);}
 rvRect(x+287,Y(310)+13,46,16,C.comp,3);rvLine([[x+298,Y(310)+29],[x+322,Y(310)+29]],C.ink,3);
 rvcAlpha(p,()=>{rvArrow([x+310,y-29],[x+310,Y(310)-7],col,4);for(const end of good?[265,355]:[20,600])rvcTrace([[x+310,Y(310)+6],[x+end,Y(end)+6],[x+end,pad-10]],p,col,3);});
}
RV.add({id:'rv_sensor_support',ch:'glide',theme:'paper',title:'Support the lens, not just the corners',settle:22,
 from:['gld_under','dots','gld_sag','gld_module','gld_sheet'],feedback:['F9.20','F18.2','F20.2','F27','F33.5'],
 draw:t=>{
 rvHeader(t,'SUPPORT THE LENS, NOT JUST THE CORNERS','Wide skates spread pressure. A support beside the lens also shortens the span that can bend under your hand.');
 rvCompareLabels(t,'WIDE PATCHES, LENS SPAN UNSUPPORTED','EIGHT CORNER DOTS + TWO ON THE LENS CLIP');
 const bad=rvcRamp(t,1.7,3.5),good=rvcRamp(t,11.4,13.3),state={corner:rvcRamp(t,4.9,7),lens:rvcRamp(t,7.6,10.2)},show=rvcRamp(t,4,4.9);
 rvgBase(420,525,t,false);rvcAlpha(show,()=>rvgBase(1230,525,t,true,state));
 rvLabel('LOADED SECTION / SAG ENLARGED',80,715,{size:21});rvgSagSection(110,758,false,bad);rvcAlpha(show,()=>rvgSagSection(950,758,true,good));
 if(t<4)rvcPointer(t,[762,370],[420,731],.3,1.7,bad);
 else if(t<10.8)rvcPointer(t,[1730,370],[1230+(-16.57+10*(1-state.lens))*4.8,525-11.5*4.8],5,7.6,state.lens);
 else rvcPointer(t,[1740,370],[1260,731],10.2,11.4,good);
 rvcAlpha(show,()=>{rvLabel('INTEGRAL LEDGES',1580,362,{color:C.heroText,size:23});rvBody('23 mm long, joined to the rim. Two dots fitted; room for a third.',1580,404,245,{size:27});});
 rvcAlpha(state.lens,()=>{rvLabel('SNAP-ON LENS',1580,627,{color:C.heroText,size:23});rvBody('5.2 mm: one dot wide. The ±11.5 mm supports move with the lens.',1580,668,245,{size:27});});
 rvWin('Less skate material. Support where it matters.','Same material and thickness: less footprint means less skate mass. Smaller dots raise pad pressure; the lens gains support.');
 rvFoot('Ø5.5 mm dots, 0.65 mm nominal height. Sag exaggerated, not measured. Wide-patch comparison is schematic, not a Viper V4 measurement. Bottom-cover choices are deferred.');
 }});
RV.add({id:'rv_sensor_choice',ch:'glide',theme:'night',title:'The sensor is only the start',settle:21,
 from:['sensor','gld_reports'],feedback:['F21.6','F27','F33.4'],
 draw:t=>{
 rvHeader(t,'THE SENSOR IS ONLY THE START','High DPI cannot fix blurred frames, clipped counts, or a report that arrives late. The whole path has to preserve the movement.');
 const burst=rvcRamp(t,6.5,9.2),raw=Math.round(1000+2200*burst),clipped=Math.min(2047,raw),lost=raw-clipped;
 rvPart(442,537,24,()=>sensorMM({accent:C.hero,glow:false}));
 rvLabel('PAW3970, PLANNED',100,322,{color:C.heroText});
 rvBody('Suspected underlying Viper V4 Pro sensor. Planned after exclusivity; access is not confirmed.',100,704,650,{size:28});
 rvTxt('50,000 DPI     930 IPS     90 G     8khz',100,820,28,{color:C.mute,weight:700});
 rvLabel('ONE MOVEMENT BURST',1000,322,{size:25});rvNum('+'+raw.toLocaleString('en-US'),1000,414,84);rvLabel('RAW COUNTS IN THIS REPORT',1410,406,{size:22,maxW:360});
 const x=1000,w=740,limit=x+w*2047/4096,end=x+w*raw/4096;
 rvBar(x,466,w,raw,4096,C.ink2,20);rvLine([[limit,454],[limit,504]],C.mute,2);
 rvLabel('12-BIT LIMIT: +2,047',limit,535,{size:22,align:'center'});
 // Both report outputs consume the same growing burst, on the same display scale.
 rvLabel('12-BIT SIGNED REPORT',x,582,{size:24});rvTxt('+'+clipped.toLocaleString('en-US'),1780,605,60,{font:'disp',weight:800,color:lost?C.bad:C.mute,align:'right'});
 rvRect(x,622,w,20,C.track,3);rvRect(x,622,w*raw/4096,20,inkA(.11),3);rvRect(x,622,w*clipped/4096,20,lost?C.bad:C.comp,3);
 if(lost){rvLine([[limit,612],[limit,654]],C.bad,3);rvLine([[limit+7,632],[end,632]],C.bad,3,.75,[5,6]);}
 rvTxt(lost?lost.toLocaleString('en-US')+' counts lost at the limit':'Below the limit: all counts fit.',x,680,29,{color:lost?C.bad:C.mute});
 rvLabel('16-BIT SIGNED REPORT',x,731,{size:24});rvTxt('+'+raw.toLocaleString('en-US'),1780,754,60,{font:'disp',weight:800,color:C.heroText,align:'right'});
 rvBar(x,771,w,raw,4096,C.hero,20);rvTxt('All '+raw.toLocaleString('en-US')+' counts preserved.',x,835,29,{color:C.heroText});
 rvcPointer(t,[855,353],[lerp(1000+w*1000/4096,end,burst),459],.5,2,burst);
 rvWin('Track the movement you actually made.','Full-width reports, no added smoothing, and a calibrated lens height. Each one protects information the next stage cannot recreate.');
 rvFoot('Both bars show 0–4,096 counts. Positive limits: 12-bit +2,047 / 16-bit +32,767. Illustrative burst, not a rival fault. Specs: Razer maker claims, not a PAW3970 datasheet.');
 }});
