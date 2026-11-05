/* Reopening is an action: the screw leaves, the original path remains, and the replacement returns. */
Object.assign(SRC,{
 rv_ownService:{t:'Theseus design commitments from Brock: common M2 combination drive, Mill-Max hot-swap, supplied screwdriver, spares, printed repair/setup guide and brass inserts. Targets/proposals, not shipped claims.',u:''},
 rv_ownEstimates:{t:'Brock F6.1/F21.5 estimates chance joint feels different after re-screw: ABS90%,carbon-filled70%,brass0%. Owner judgement, not measured distributions or guaranteed zero wear. Numerical first-fit/rethread simulation deferred F21.12.',u:''}
});
function rvo_thread(cx,y,len,t,insert=false){
 const out=rvstP(t,3,6.8),back=rvstP(t,8.4,12.8),lift=165*(out-back),sy=y-10-lift,dx=insert?0:10*rvstP(t,9,11.5),pitch=23,outer=77,inner=36;
 rvRect(cx-outer,y,outer*2,len,C.panel,4,C.mute,2);if(insert){rvRect(cx-59,y+6,118,len-12,'#a18e62',3);for(let j=0;j<7;j++){const yy=y+17+j*24;rvLine([[cx-66,yy-5],[cx-57,yy+5]],C.ink2,3);rvLine([[cx+57,yy-5],[cx+66,yy+5]],C.ink2,3);}}
 rvRect(cx-inner,y-2,inner*2,len+4,C.bg,0);
 for(const side of [-1,1]){const old=[];for(let z=0;z<=len;z+=pitch/2)old.push([cx+side*(inner+(Math.round(z/(pitch/2))%2?9:0)),y+z]);rvLine(old,insert?C.hero:C.mute,3,.9);if(!insert&&back>0){const cut=old.map(p=>[p[0]+dx,p[1]+8*back]);G.save();G.beginPath();G.rect(cx-outer,y,outer*2,len*back+5);G.clip();rvLine(cut,C.bad,3,back);G.restore();}}
 rvRect(cx-51+dx,sy-22,102,23,C.ink2,6);const ang=lift/pitch*TAU;rvLine([[cx-28*Math.cos(ang)+dx,sy-11],[cx+28*Math.cos(ang)+dx,sy-11]],C.bg,4);
 const left=[],right=[];for(let z=0;z<=len*.88;z+=pitch/2){const off=Math.round(z/(pitch/2))%2?29:37;left.push([cx-off+dx,sy+z]);right.push([cx+off+dx,sy+z]);}rvLine(left,C.ink2,3);rvLine(right,C.ink2,3);for(let z=12;z<len*.84;z+=pitch)rvLine([[cx-31+dx,sy+z],[cx+31+dx,sy+z-12]],C.mute,2);
 // The rotating slot and axial feed share the thread pitch. The driver follows the head instead of floating beside it.
 if(t>2.5&&t<13.2){rvLine([[cx+dx,sy-25],[cx+dx,sy-61]],C.ink2,5);rvRect(cx-15+dx,sy-74,30,17,C.panel,4,C.ink2,2);rvCursor(t,cx+dx+25,sy-51,.8);}
 if(!insert&&t>9&&t<13.8)for(let j=0;j<7;j++){const u=clamp((t-9-j*.25)/1.7);rvCircle(cx+54+u*37,y+30+j*17+u*u*33,2.4,C.mute);}
 return {lift,returnProgress:back,offset:dx,turnRad:ang};
}
RV.add({id:'rv_inserts',ch:'own',theme:'night',title:'Open it. Keep the same fit.',settle:21,
 from:['own_insert','own_life','ownsheet1'],feedback:['F2.01','F3.3','F6.1','F21.3','F21.5','F21.12','F27','C5'],src:['ownCovestro','ownPemM2','ownBrock','rv_ownEstimates'],
 draw:t=>{
  rvHeader(t,'OPEN IT. KEEP THE SAME FIT.','Drive the screw out. Put it back. Plastic can make a second path; a machine thread guides it along the first.');
  rvLabel('PLASTIC: THE SCREW CUTS THE THREAD',105,327,{size:21});rvLabel('BRASS: AN EXISTING MACHINE THREAD',681,327,{size:21,color:C.heroText});
  const a=rvo_thread(338,580,180,t,false),b=rvo_thread(901,580,180,t,true);rvLabel(t<3?'ASSEMBLED':t<7.4?'01 / DRIVE OUT':t<13?'02 / DRIVE BACK IN':'THE ORIGINAL PATH IS STILL THERE',105,382,{size:20,color:C.ink2});
  rvBody('Old path stays grey. New cut stays red.',105,810,480,{size:27});rvBody('The same thread receives the screw again.',681,810,465,{size:27,color:C.heroText});
  rvLabel('CHANCE THE JOINT FEELS DIFFERENT',1250,327,{size:22});rvTxt('After opening and reassembly',1250,372,27,{color:C.mute});
  [['ABS',90],['Carbon-filled',70],['Brass insert',0]].forEach((r,i)=>{const yy=460+i*112;rvTxt(r[0],1250,yy,30,{weight:700,color:i===2?C.heroText:C.ink2});rvTxt(r[1]+'%',1785,yy,41,{align:'right',weight:800,color:i===2?C.heroText:C.ink2});rvBar(1250,yy+23,535,r[1],100,i===2?C.hero:C.mute,15);});rvTxt('Brock’s estimates; not measured failure rates.',1250,811,25,{maxW:550,color:C.mute});
  rvWin('Repairable means repeatably repairable.','An existing metal thread also makes the first assembly less dependent on a screw cutting its own way into the plastic.');
  rvFoot('Mechanism illustration, not a thread-wear/first-fit simulation; those remain deferred. ABS90%,carbon-filled70%,brass0% are owner estimates, not a lifetime guarantee. Motion does not derive those odds.');
  rvstReport('rv_inserts',t,{phase:t<3?'assembled':t<7.4?'drive-out':t<13?'drive-back-in':'compare-retained-paths',plastic:a,brass:b,ownerEstimatesPct:[90,70,0],numericalWearSimulation:false});
 }});
function rvo_head(cx,cy,r,dent=0,turn=0){rvCircle(cx,cy,r,C.panel,C.ink2,3);rvCircle(cx,cy,r*.83,null,C.faint,2);G.save();G.translate(cx,cy);G.rotate(turn);rvRect(-r*.65,-r*.10,r*1.3,r*.20,C.ink2,2);rvRect(-r*.12,-r*.55,r*.24,r*1.1,C.ink2,2);if(dent){rvLine([[r*.13,-r*.45],[r*.34,-r*.17],[r*.57,-r*.05]],C.bad,2+dent*6);rvLine([[-r*.14,r*.41],[-r*.35,r*.13],[-r*.52,0]],C.bad,2+dent*5);}G.restore();}
function rvo_screw(x,y,s=1,turn=0){G.save();G.translate(x,y);G.scale(s,s);rvRect(-24,0,48,14,C.ink2,7);rvLine([[-14*Math.cos(turn),7],[14*Math.cos(turn),7]],C.bg,3);rvLine([[-10,14],[-10,92],[0,100],[10,92],[10,14]],C.ink2,3);for(let i=22;i<91;i+=10)rvLine([[-10,i],[10,i-7]],C.mute,2);G.restore();}
function rvoBit(cx,cy,angle,flat=false,slip=0){G.save();G.translate(cx+slip,cy-slip*.7);G.rotate(angle);rvRect(-17,-65,34,130,C.bg,4,C.ink2,2.5);if(!flat)rvRect(-57,-13,114,26,C.bg,3,C.ink2,2.5);rvLine([[-10,-55],[-10,55]],C.mute,1.5);G.restore();}
RV.add({id:'rv_screws',ch:'own',theme:'paper',title:'A head worth reopening.',settle:21,
 from:['ownscrew','ownsheet1'],feedback:['F25.4','F25.5','F27','C5'],src:['ownTi','ownIso898p','ownRecess','ownTwi','ownBrock'],
 draw:t=>{
  rvHeader(t,'A HEAD WORTH REOPENING.','A serviceable screw needs a durable drive and a common bit. Saving weight is not a reason to make the joint disposable.');
  const seat=rvstP(t,.8,2.7),drive=rvstP(t,3.3,6.8),withdraw=rvstP(t,7.2,8.8),backup=rvstLoad(t,10,11.5,14,15),turn=drive*Math.PI*.4,slip=rvstP(t,4.8,6.8),dent=slip;
  rvLabel('A SOFT RECESS CAN DEFORM',105,327);rvLabel('ONE COMMON COMBINATION DRIVE',727,327,{color:C.heroText,size:21});
  rvo_head(337,548,127,dent,turn*.45);rvo_head(969,548,127,0,turn);if(withdraw<1){const yy=548-(1-seat)*116-withdraw*127;rvoBit(337,yy,turn+slip*.45,false,slip*30);rvoBit(969,yy,turn,false,0);if(t<8.7)rvCursor(t,1020,yy-58,.8);}if(backup>0){rvoBit(969,548-(1-backup)*122,turn+backup*.3,true,0);if(t<15)rvCursor(t,1010,495-(1-backup)*122,.7);}
  rvBody('The bit pushes on the recess. A damaged flank lets it slip.',105,751,483,{size:29});rvBody('Phillips to centre. A flat blade as backup.',727,751,470,{size:29,color:C.heroText});
  rvLabel('HEAD MATERIAL HARDNESS',1325,327,{size:22});rvTxt('Class 4.8 steel',1325,427,29);rvTxt('≤220 HV',1774,427,36,{align:'right',weight:750});rvBar(1325,450,449,220,400,C.mute,18);rvTxt('Grade 5 titanium',1325,539,29,{color:C.heroText});rvTxt('349 HV',1774,539,36,{align:'right',weight:750,color:C.heroText});rvBar(1325,562,449,349,400,C.hero,18);
  rvTxt('From 36 HRC. Not harder or stronger than every steel grade.',1325,624,27,{maxW:480,color:C.mute,lh:1.25});for(let j=0;j<4;j++){const k=rvstP(t,14+j*.4,16+j*.4);rvo_screw(1358+j*96+(1-k)*190,713,.65,k*TAU);}
  rvTxt('4 × M2 × 4 mm = 0.42 g',1325,832,36,{weight:780,color:C.heroText});
  rvWin('One size. A supplied driver. Fewer damaged heads.','Titanium screws run in brass inserts. Over-tighten the joint and the softer internal brass thread can still strip.');
  rvFoot('ASM:Ti-6Al-4V36 HRC→349 HV; TR Fastenings:class4.8≤220 HV. Bit/recess motion is illustrative, not a torque or comparative wear test.0.42 g is a model-derived target.');
  rvstReport('rv_screws',t,{phase:t<3.3?'seat-bit':t<7.2?'drive-and-show-recess-deformation':t<10?'withdraw-bit':t<15?'use-flat-blade-backup':'retain-four-service-screws',driverSeat:seat,driverTurnRad:turn,softRecessDamage:dent,driverWithdrawal:withdraw,flatBackup:backup,hardnessHV:[220,349],screwSetTargetG:.42});
 }});
function rvo_battery(x,y,t){
 const pull=rvstP(t,6.7,9.6),lift=rvstP(t,10.2,12.4),yy=y-lift*67;rvRect(x,yy,225,104,C.panel,9,C.mute,3);rvRect(x+11,yy+12,203,79,null,6,C.faint,1.5);rvTxt('BATTERY',x+112,yy+63,26,{align:'center',weight:750});
 const px=x+282-pull*72,py=y+59;for(let j=0;j<3;j++){const off=(j-1)*7;G.save();G.beginPath();G.moveTo(x+225,yy+49+off);G.bezierCurveTo(x+254,yy+49+off,px-26,py+off,px,py+off);G.strokeStyle=j===1?C.hero:C.ink2;G.lineWidth=2.8;G.stroke();G.restore();}
 rvRect(px,py-18,39,36,C.panel,3,C.ink2,2);rvRect(x+323,py-20,42,40,C.panel,3,C.mute,2);for(let j=0;j<3;j++)rvLine([[px+39,py+(j-1)*7],[px+48,py+(j-1)*7]],C.mute,2);if(t>6.3&&t<10)rvCursor(t,px+19,py+30,.85);if(t>10&&t<12.8)rvCursor(t,x+110,yy+30,.85);
 return {plugPull:pull,batteryLift:lift,plugPosition:[px,py]};
}
function rvo_socket(x,y,t){
 const extract=rvstP(t,13.5,16.6),clear=rvstP(t,16.8,18.1),replace=rvstP(t,18.3,21),open=Math.sin(Math.PI*extract)*7;
 rvRect(x-11,y+78,215,25,C.panel,3,C.mute,2);for(let j=0;j<3;j++){const xx=x+30+j*65;rvLine([[xx-10,y+79],[xx-15-open,y+48],[xx-6-open,y+23]],C.ink2,5);rvLine([[xx+10,y+79],[xx+15+open,y+48],[xx+6+open,y+23]],C.ink2,5);rvCircle(xx,y+48,3,C.hero);}
 const drawSwitch=(xx,yy,col)=>{rvRect(xx,yy,190,76,C.panel,5,col,3);rvRect(xx+72,yy-13,45,15,C.ink2,3);rvLine([[xx+15,yy+13],[xx+171,yy+13]],C.faint,1.5);for(let j=0;j<3;j++)rvLine([[xx+30+j*65,yy+76],[xx+30+j*65,yy+112]],col,4);};
 const ox=x+clear*211,oy=y-90-extract*141;drawSwitch(ox,oy,C.mute);if(replace>0)drawSwitch(x-(1-replace)*160,y-90-(1-replace)*141,C.hero);if(t>13&&t<18)rvCursor(t,ox+92,oy+25,.9);if(t>18&&t<21.3)rvCursor(t,x-(1-replace)*160+93,y-90-(1-replace)*141+25,.9);
 return {oldExtraction:extract,oldMoveAside:clear,newInsertion:replace,oldBounds:[ox,oy,ox+190,oy+112],newBounds:replace>0?[x-(1-replace)*160,y-90-(1-replace)*141,x-(1-replace)*160+190,y+22-(1-replace)*141]:null};
}
RV.add({id:'rv_repair',ch:'own',theme:'night',title:'Replace the part. Not the mouse.',settle:24,
 from:['repair','ownbatt','ownboard','box','clk_hotswap','ownsheet1','owncard'],feedback:['F2.42','F21.8','F25.3','F26.11','F27','F33.7','C5'],src:['rv_ownService','ownJstSh','ownBrock','srf_doc','ownPsV4'],
 draw:t=>{
  rvHeader(t,'REPLACE THE PART. NOT THE MOUSE.','Open the accessible screws. Unplug the battery. Pull a worn switch and seat a new one. Keep the board and the mouse.');
  rvLabel('01 / SCREWS CLEAR OF THE SKATES',105,327,{color:C.heroText,size:21});rvLabel('02 / UNPLUG, THEN LIFT',823,327,{size:21});rvLabel('03 / OLD OUT. NEW IN.',1372,327,{size:21});
  rvMouse(374,549,3.15,{color:C.ink2,seams:false});const screw=[];[[-19,-34],[19,-34],[-19,34],[19,34]].forEach(([xx,yy],i)=>{const sx=374+xx*3.15,sy=549+yy*3.15,u=rvstP(t,.8+i*.85,2.6+i*.85),x=lerp(sx,133+i*91,u),y=lerp(sy,729,u)-Math.sin(Math.PI*u)*60;rvCircle(sx,sy,8,null,C.faint,2);rvCircle(x,y,10,C.panel,C.hero,2.5);const an=u*TAU*3;rvLine([[x-Math.cos(an)*6,y-Math.sin(an)*6],[x+Math.cos(an)*6,y+Math.sin(an)*6]],C.hero,2);if(u>0&&u<1)rvCursor(t,x+17,y+17,.8);screw.push(u);});
  rvBody('Not hidden under the skates.',105,800,570,{size:29});rvTxt('Access schematic; not the final bottom cover.',105,841,23,{color:C.mute});
  const battery=rvo_battery(824,501,t),socket=rvo_socket(1437,596,t);
  rvBody('Three wires. A plug. No soldering iron.',823,731,432,{size:29});rvBody('Claw contacts release the part. The board stays.',1372,731,438,{size:29});
  rvLine([[823,805],[1810,805]],C.hair,1.5);rvLine([[834,838],[916,838]],C.ink2,9);rvRect(918,826,66,24,C.panel,4,C.mute,2);rvTxt('Driver + spares',1002,847,25,{color:C.ink2});rvTxt('Printed steps + skate templates',1338,847,25,{color:C.ink2});
  rvWin('A small repair. Not a whole replacement.','Common screws, a supplied driver, replaceable switches and battery, spare skates, and clear printed repair steps belong in the box.');
  rvFoot('Service commitments, not final bottom-cover geometry. Example battery; socket/plug simplified. Old part remains visible as new switch seats. Repair kit and downloadable skate templates are proposed availability.');
  rvstReport('rv_repair',t,{phase:t<6.3?'remove-accessible-screws':t<10?'unplug-battery':t<13?'lift-battery':t<18.3?'extract-old-switch':'seat-new-switch',screwRemoval:screw,battery,socket,finalBottomCover:false});
 }});
