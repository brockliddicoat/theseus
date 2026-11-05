/* Interfaces are where a promising part becomes a good mouse. F27 / F33. */
Object.assign(SRC,{
 rv_series:{t:'NIST Engineering Statistics Handbook, series-system model. The illustrated fit-yield example assumes independent interfaces with equal pass probabilities; not a Theseus manufacturing yield.',u:'https://www.itl.nist.gov/div898/handbook/apr/section1/apr182.htm'},
 rv_torque:{t:'OpenStax University Physics, torque: the moment depends on force and perpendicular distance from the line of action.',u:'https://openstax.org/books/university-physics-volume-1/pages/10-6-torque'}
});
function rvqPart(x,y,w,kind,col=C.comp){
 G.save();G.translate(x,y);G.beginPath();
 if(kind==='shell'){G.moveTo(0,22);G.bezierCurveTo(w*.1,-8,w*.9,-8,w,22);G.lineTo(w,34);G.bezierCurveTo(w*.8,4,w*.2,4,0,34);G.closePath();}
 else if(kind==='button'){G.moveTo(0,6);G.lineTo(w*.8,6);G.lineTo(w,19);G.lineTo(w,28);G.lineTo(0,18);G.closePath();}
 else if(kind==='switch'){G.roundRect(w*.28,-1,w*.44,28,3);G.rect(w*.45,-9,w*.1,8);}
 else{G.roundRect(0,5,w,12,3);}
 G.fillStyle=col;G.fill();G.restore();
}
function rvqLoad(t,a=1.8,b=2.8,c=5.2,d=6.2){return Math.min(ep(t,a,b,E.io3),1-ep(t,c,d,E.io3));}
RV.add({id:'rv_tolerance',ch:'shell',theme:'paper',title:'Tolerance stack-up',settle:21,
 from:['tolerance'],feedback:['F2.36','F14.10','F27','F33.5'],src:['rv_series','clk_protolabs','shpBrock'],
 draw:t=>{
 rvHeader(t,'TOLERANCE STACK-UP','A stack of coins leans when the errors add up. A stack of mouse parts can turn one bad fit into a loose click.');
 const assembly=rvEase(t,.8,2.2),fault=rvEase(t,2.5,3.5),merge=rvEase(t,5.2,8.3),press=rvqLoad(t,9.2,10.5,13.1,14),labels=['Upper shell','Trigger mount','Wedge','Switch bracket','Switch','Board support','PCB','Lower shell'];
 rvCompareLabels(t,'EIGHT FITS TO GET RIGHT','THREE INTEGRATED INTERFACES');
 for(let i=0;i<8;i++){
  const yy=355+i*48+(i-3.5)*10*(1-assembly),off=i>3?fault*14:0;rvqPart(135+off,yy,370,['shell','button','plate','plate','switch','plate','plate','shell'][i],i===3?C.bad:C.comp);
  rvTxt(labels[i],560,yy+24,27,{color:i===3?C.bad:C.ink2});
 }rvArrow([950,543],[1030,543],C.hero,4);
 if(t>2.4){const fy=lerp(350,530,rvEase(t,2.4,3.7));rvArrow([110,fy-40],[110,fy],C.bad,4);rvCursor(t,160,fy-34,fault);}
 rvGhost(t,()=>{
  const l=['Shell and trigger support','Switch housing sets the angle','One populated PCB'];
  l.forEach((s,i)=>{const x=lerp(600,1090,merge),y=395+i*133-45*(1-merge)*(i-1)+press*(2-i)*4;rvqPart(x,y,330,['shell','switch','plate'][i],C.hero);rvBody(s,1490,420+i*133,310,{size:28,color:C.heroText,alpha:merge});});
  if(t>8.8){rvArrow([1050,340],[1050,390+press*8],C.hero,4);rvCursor(t,1110,350+press*12,press);}
 },4.7);
 rvBa(115,746,'92.3%','97.0%','EXAMPLE: 99% PASS RATE PER FIT');
 rvBody('The interfaces multiply. Fewer separate pieces mean fewer ways for the whole assembly to miss.',1090,785,700,{size:28});
 rvWin('Design out the fit before trying to inspect it out.','Integrated structure removes interfaces. The remaining critical fits get adjustable pads and a deliberate assembly process.');
 rvFoot('Illustrated independent-interface example: 0.99⁸ = 92.3%, 0.99³ = 97.0%. Not measured manufacturing yield. First-assembly fit simulation remains a later iteration.');
 }});
RV.add({id:'rv_contact',ch:'shell',theme:'night',title:'Stop the creak at the contact',settle:20,
 from:['grind'],feedback:['F27','F33.6'],
 draw:t=>{
 rvHeader(t,'STOP THE CREAK AT THE CONTACT','A rigid shell can still sound cheap if its contact with the board rubs. Reinforcement needs a quiet interface.');
 const bare=rvqLoad(t,1.7,2.6,4.0,4.8),grease=rvqLoad(t,5.0,5.8,7.6,8.4),place=rvEase(t,8.8,11.0),final=rvqLoad(t,11.6,12.5,15,15.8),rows=[['BARE CONTACT','Hard edges rub.',C.bad],['GREASE','Moves the problem into maintenance.',C.mute],['FACTORY PORON PADS','A controlled contact, without loose lubricant.',C.hero]];
 rows.forEach((r,i)=>{
  const p=[bare,grease,final][i],x=95+i*597,y=470;rvLabel(r[0],x,316,{color:i===2?C.heroText:C.mute});
  rvRect(x+15+p*(i===2?2:9),y-42,485,28,C.comp,4);
  rvRect(x,y+60,520,18,TH?'#48494d':'#585b62',3);
  if(i===0){rvLine([[x+200,y-14],[x+200,y+60]],C.comp,32);for(let z=0;z<3;z++)rvLine([[x+225+z*15,y+10],[x+235+z*15,y+20],[x+225+z*15,y+30]],C.bad,2);}
  if(i===1){rvRect(x+175-grease*20,y+42,80+grease*40,18,C.comp,7);for(let z=0;z<7;z++)rvCircle(x+161+z*18+grease*(z-3)*7,y+41+Math.sin(z)*3,3,C.faint);rvLine([[x+215,y-14],[x+215,y+40]],C.comp,32);}
  if(i===2){const py=y+37-(1-place)*155;rvRect(x+170,py,88,23-final*2,C.hero,3);for(let j=0;j<4;j++)for(let z=0;z<8;z++)rvCircle(x+176+z*10,py+5+j*4,1.4,C.bg);rvLine([[x+215,y-14],[x+215,y+36]],C.comp,32);if(place<1&&t>8.5)rvCursor(t,x+264,py+9,1);}
  if(p>0){rvArrow([x+215,y-130],[x+215,y-58+p*8],i===2?C.hero:C.mute,4);rvCursor(t,x+268,y-110+p*9,p);}
  rvBody(r[1],x,y+155,510,{size:30,color:i===2?C.heroText:C.ink2});
  rvLabel(i===2?'SHELL LOAD MEETS PCB':'SAME PRESS, SAME BOARD',x,y+295,{size:21,color:C.mute});
 });
 rvWin('A solid feel includes the sound.','Poron at the designed contact takes care of rubbing. It is a factory version of a familiar G-Wolves mod, not a substitute for a strong shell.');
 rvFoot('Contact and acoustic behavior illustrated, not a measured dB reduction. Factory pad thickness and compression still need assembly validation.');
 }});
function rvqProfile(cx,cy,mode,t){
 G.save();G.translate(cx,cy);
 const k=rvqLoad(t,1.5+mode*3.5,2.4+mode*3.5,4+mode*3.5,4.8+mode*3.5),col=mode===2?C.hero:C.mute;
 const pts=mode===0?[[-200,80],[-180,40],[-100,20],[0,10],[100,20],[180,40],[200,80]]:
 mode===1?[[-200,80],[-180,20],[-90,-20],[0,-36],[90,-20],[180,20],[200,80]]:
 [[-200,80],[-190,-5],[-140,-35],[0,-50],[140,-35],[190,-5],[200,80]];
 G.beginPath();G.moveTo(...pts[0]);for(let i=1;i<pts.length;i++)G.lineTo(...pts[i]);G.lineTo(200,90);G.lineTo(-200,90);G.closePath();G.fillStyle=mode===2?rgba(C.hero,.13):C.panel;G.fill();rvLine(pts,col,4);
 const fx=mode===0?190:mode===1?172:148,fy=mode===0?49:mode===1?18:-20;
 const normal=mode===0?[55,-28]:mode===1?[62,-68]:[68,-5];
 for(const side of [-1,1]){
  const driftX=mode===0?k*26:0,driftY=mode===1?-k*40:0;
  G.save();G.translate(side*(fx+48+driftX),fy+5+driftY);G.scale(.72,.72);rvFinger(0,0,-side*Math.PI/2);G.restore();
  rvArrow([side*fx,fy],[side*(fx+normal[0]*(.5+.5*k)),fy+normal[1]*(.5+.5*k)],col,3+2*k);
  rvArrow([side*(fx+75),fy-4],[side*(fx+15),fy-4],C.ink,3);
  if(mode<2)rvArrow([side*(fx+25),fy-45],[side*(fx+25),fy-92],C.bad,3);
 }
 G.restore();
}
RV.add({id:'rv_shape',ch:'shape',theme:'paper',title:'Newtonian shape analysis',settle:20,
 from:['shapecard','shp_newton','grooves','shbSides'],feedback:['F2.44','F13.4','F19.2','F27','F33.8'],src:['shpBrock','shbSideModel'],
 draw:t=>{
 rvHeader(t,'NEWTONIAN SHAPE ANALYSIS','A surface pushes back square to itself. The shoulder and the groove decide whether that force supports your finger or moves it.');
 const names=['TOO FLAT','ROUND, WITHOUT A SHOULDER','A DEFINED SHOULDER'];
 [380,980,1560].forEach((cx,i)=>{rvLabel(names[i],cx,318,{align:'center',color:i===2?C.heroText:C.mute});rvqProfile(cx,529,i,t);rvBody(['Your finger runs off the edge.','Part of the reaction pushes the finger upward.','More reaction holds the finger where it rests.'][i],cx-250,720,500,{size:28,color:i===2?C.heroText:C.ink2});});
 rvLabel('FRONT SECTION',80,822,{size:21});
 rvWin('The shape should help you hold it.','A clear shoulder, shallow front grooves and a stronger band on both low sides work together. Grip support is deliberate, not an accidental curve.');
 rvFoot('Explanatory surface-normal diagrams, not measured contact forces or a universal grip rule. Equal pressure is shown on both sides; the final shape still needs user testing.');
 }});
RV.add({id:'rv_fit',ch:'shape',theme:'night',title:'Fit comes before a weight record',settle:20,
 from:['size','emg'],feedback:['F12.11','F21.13','F33.6'],
 draw:t=>{
 rvHeader(t,'FIT COMES BEFORE A WEIGHT RECORD','A smaller number means little if the shape makes your hand tense up. Choose the shape around the grip, then measure the effort.');
 const fit=rvEase(t,.8,2.8),flick=rvqLoad(t,4.4,5.1,5.4,6.2)-rvqLoad(t,6.3,7,7.3,8.1),dx=flick*52;
 rvMouse(415+dx,548,3.3,{color:C.hero,fill:C.panel});
 for(const side of [-1,1]){G.save();G.translate(415+dx+side*(126+(1-fit)*140),560);G.rotate(side*Math.PI/2);G.scale(.8,.8);rvFinger(0,0,0);G.restore();}
 if(t>4.1&&t<8.6){rvArrow([330+dx,332],[460+dx,332],C.hero,4);rvCursor(t,455+dx,386,Math.abs(flick));}
 rvLabel('119.3 × 62.4 × 39.9 mm',130,806,{color:C.heroText,size:31});
 rvLabel('BROCK’S FLATTER-MOUSE RULE',905,323);
 rvBody('“For a flatter mouse, it’s better to be too small than too big, because big hands will still be able to fingertip grip.”',905,390,865,{size:38,weight:700,color:C.ink});
 rvLine([[905,552],[1770,552]],C.hair,2);
 rvLabel('MEASURE EVERY SHAPE REVISION',905,602,{color:C.heroText});
 for(let j=0;j<2;j++){
  const y=680+j*85,pts=[],end=520*rvEase(t,5.2+j*.4,10+j*.4);for(let x=0;x<end;x+=3){const z=x/35,amp=(x>120&&x<280?.8:.15)*(j?.6:1);pts.push([1180+x,y+Math.sin(z*9)*Math.sin(z*13)*25*amp]);}rvLine(pts,j?C.mute:C.hero,2);rvTxt(j?'comfort and aim':'muscle activity',905,y+9,27,{color:C.ink2});
 }
 rvWin('Keep the shape. Lose the strain.','Group the tests by hand size and grip. Pair forearm EMG with aim performance and comfort rather than letting one signal make the decision.');
 rvFoot('Profile is the Sora-based placeholder; dimensions are Theseus’s target dimensions. EMG signals illustrated, not participant data. Research: Wang 2023, Li & Wang 2025, Tang 2023.');
 }});
RV.add({id:'rv_balance',ch:'shape',theme:'paper',title:'Balance the mass around the grip',settle:21,
 from:['mass'],feedback:['F2.40','F21.10','F21.15','F27','F30.10'],src:['rv_torque','shcMassModel'],
 draw:t=>{
 rvHeader(t,'BALANCE THE MASS AROUND THE GRIP','The heavy battery is a balancing tool. Put the whole mouse’s mass where the hand can move it without adding a twisting lever.');
 const k=rvEase(t,5.3,8.2),padY=716,s=13,gripY=padY-12*s,batteryHeight=lerp(20,7.5,k),batteryY=padY-batteryHeight*s,cmHeight=(21.31*14+8*batteryHeight)/29.31,now=padY-cmHeight*s,highY=padY-((21.31*14+8*20)/29.31)*s;
 const load=rvqLoad(t,1.9,2.7,3.4,4.3)+rvqLoad(t,9.5,10.3,11,11.9),lever=cmHeight-12;
 G.beginPath();G.moveTo(190,716);G.bezierCurveTo(205,520,290,390,530,380);G.bezierCurveTo(750,390,815,520,860,716);G.strokeStyle=C.mute;G.lineWidth=4;G.stroke();
 rvLine([[120,gripY],[925,gripY]],C.mute,2,.7,[8,8]);rvLabel('GRIP LINE, 12 mm ABOVE THE PAD',120,778);
 rvRect(390,batteryY-18,250,36,C.comp,5);rvTxt('battery',515,batteryY+9,26,{align:'center',color:C.bg});
 rvCircle(514,highY,14,null,C.faint,2);rvCircle(514,now,12,C.hero);rvLine([[514,gripY],[514,now]],k<.8?C.bad:C.hero,5);
 rvArrow([170,gripY],[270+60*load,gripY],C.hero,4+load);rvFinger(155+load*7,gripY+2,-Math.PI/2);
 if(t>4.7&&t<8.8)rvCursor(t,655,batteryY-13,k>.02&&k<.99?1:0);
 if(load>.01){G.save();G.translate(515,gripY);G.rotate(-.15*lever/3.64*load);G.beginPath();G.arc(0,0,97,-2.5,-.7);G.strokeStyle=C.bad;G.lineWidth=3;G.stroke();G.restore();}
 rvLabel('CENTRE OF MASS',1030,327);rvNum('τ = F × d',1030,445,85);
 rvBody('The gap between the grip and centre of mass is a lever. Make that gap smaller.',1030,510,720,{size:32});
 rvBa(1030,611,'3.64 mm',(Math.abs(lever)).toFixed(2)+' mm','ILLUSTRATED TWISTING LEVER');
 rvBody('Raising a battery can also help if it brings the mass closer to the grip. The target is alignment, not simply “as low as possible.”',1030,750,720,{size:29});
 rvWin('Weight balanced for the hand, not the sensor’s new position.','The sensor and lens move forward. The balance target stays at the mouse’s centre, with the grip 12 mm above the pad.');
 rvFoot('Illustrative model: 8 g battery at 20 → 7.5 mm, other 21.31 g at 14 mm; grip 12 mm. Not verified mass properties or a measured flick benefit. Final battery fit and balance remain open.');
 }});
