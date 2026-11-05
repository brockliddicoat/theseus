/* Theseus Codex revamp — electronics. No WebGL or bitmap illustration.
   Diagrams are proposals; models never become hardware test results. */
Object.assign(SRC,{
 rv_batteryPouch:{t:"EEMB LP702030 bare pouch: 3.7V,350mAh nominal,330mAh minimum,approx7g; not a protected finished pack. Verified2026-11-05.",u:"https://www.eemb.com/product-220"},
 rv_batteryCylinder:{t:"Boying 10440: 3.7V,350mAh nominal,320mAh minimum,approx9g. Protection/lead pack mass not documented. Verified2026-11-05.",u:"https://www.boyingcable.com/10440-electric-toothbrush-rechargeable-lithium-battery-37v/"},
 rv_raytac:{t:"Raytac AN54LM-P20A: PCB trace antenna,nRF54LM20A,9.9×13.3×2mm; module certification targets not final end-product approval. Live verified2026-11-05.",u:"https://www.raytac.com/product/ins.php?index_id=181"},
 rv_pmic:{t:"Nordic nPM1300 product specifications: charger,power regulation,fuel gauge support,ship mode and thermal/battery-temperature management. Live verified2026-11-05.",u:"https://www.nordicsemi.com/Products/nPM1300"},
 rv_brockTiming:{t:"Brock FEEDBACK F26.10 and F22.2: Viper V4 Pro FrameSync202µs vs XA25 SensorLock42µs, Theseus target42µs frame-to-USB. Attributed via Brock, not independently measured Theseus results.",u:""},
 rv_firmwareTarget:{t:"Theseus design targets via Brock:70µs wired electrical click,0.14ms wireless motion on Piaknow's method,full16-bit reports,no post-lift smoothing,dual8khz. Not verified prototype performance.",u:""},
 rv_webTarget:{t:"Brock proposed firmware/UI: web configuration,0.1mm lift-off increments,debounce,angle tuning,profiles and settings on mouse; feature targets not implemented product firmware.",u:""},
 rv_conformal:{t:'HumiSeal1B31 manufacturer datasheet:25–75micron recommended conformal coating for moisture/environmental protection. Dry-film mass is not given; liquid density cannot be used as cured-film density.',u:'https://chasecorp.com/humiseal1/wp-content/uploads/sites/12/2018/10/1B31-TDS.pdf'},
 rv_layoutTarget:{t:"Brock F26/F30 approved PCB design direction: one populated board1mm/5.6g target; consistent fillets and gaps, rear-pull battery connector,switch pocket and overhang variants. Procedural illustration, not release fabrication files.",u:""},
 rv_boardReview:{t:'Current local board review, handoff/codex/HARDWARE.md:718 electrical DRC issues; rear board outline overlaps the old battery-front plan envelope by3.720mm². A/B drawings are presentation layouts, not released manufacture-ready boards; routing and battery fit remain under review.5.6g populated/1mm thickness remain targets.',u:''},
 rv_gt01Review:{t:'GT01 housing/profile drawing and render evidence is in handoff/codex/MECHANICS-MOTION.md and HARDWARE.md. Current0.80mm wall thickness is inferred from the supplied reference render, not a published or physically measured final component dimension.',u:''},
 rv_wires:{t:"NASA Langley TEM cell testing of cable noise reduction: twisting is context-dependent; dedicated return placement is decisive and twisting did not universally improve every frequency. Qualitative demonstration only.",u:"https://ntrs.nasa.gov/api/citations/20080021261/downloads/20080021261.pdf"}
});
const rve_gold='#c6a266';
function rve_chip(x,y,w,h,label,col='#252932'){
 rvRect(x-w/2,y-h/2,w,h,col,5,rve_gold,1.3);
 const n=Math.max(3,Math.floor(w/14));
 for(let i=0;i<n;i++){const xx=x-w/2+8+i*(w-16)/(n-1);rvRect(xx-2,y-h/2-6,4,7,rve_gold,0);rvRect(xx-2,y+h/2-1,4,7,rve_gold,0);}
 if(label)rvTxt(label,x,y+6,22,{align:'center',color:'#e5e9ee',weight:650});
}
function rve_pouch(x,y,w,h,col=C.hero,o={}){
 rvRect(x,y,w,h,'#c6cbd1',8,'#747b84',2);rvRect(x+8,y+7,w-16,h-14,'#dfe2e5',5,'#a6adb4',1);
 for(let i=0;i<5;i++)rvLine([[x+12,y+17+i*9],[x+w-12,y+17+i*9]],'#b0b7bf',1,.25);
 rvRect(x+w*.2,y-11,12,16,'#b7bdc5',1);rvRect(x+w*.65,y-11,12,16,'#b7bdc5',1);
 if(o.fill){const inset=h<80?8:18,top=h<80?9:25;rvRect(x+inset,y+top,(w-inset*2)*o.fill,Math.max(4,h-top*2),col,3);}
}
function rve_plan(cx,cy,s,variant='A',t=0){
 if(typeof RVHardware!=='undefined' && typeof RVHardware.board==='function'){return RVHardware.board(cx,cy,s,{variant,t});}
 G.save();G.translate(cx,cy);G.scale(s,s);
 const p=[[-18,-30],[-18,-12],[-20,-9],[-20,29],[-12,37],[12,37],[20,29],[20,-9],[18,-12],[18,-30],[8,-30],[6,-34],[-6,-34],[-8,-30]];
 G.beginPath();p.forEach((q,i)=>i?G.lineTo(...q):G.moveTo(...q));G.closePath();G.fillStyle='#171b20';G.fill();G.strokeStyle='#8b969f';G.lineWidth=1/s;G.stroke();
 /* Mechanical sketches are flat plan symbols: consistent repeated components, no QR/synthetic markings. */
 const pad=(x,y,w,h,fill='#303740')=>rvRect(x,y,w,h,fill,1/s,rve_gold,.7/s);
 [[-17,-26],[8,-26]].forEach(([x,y])=>{
  if(variant==='A'){pad(x-1,y-1,10,17,'#080b0d');}
  else {pad(x-1,y-5,10,6,'#080b0d');}
  pad(x,y,8,14,'#343a42');pad(x+2,y+3,4,4,'#adb5bc');
 });
 pad(-4,-35,8,5,'#9da6b0');
 pad(-2.5,-25,5,12,'#59626b');pad(-9,-22,5,6,'#ab9979');
 for(let i=0;i<6;i++)rvLine([[-2.2,-23+i*1.6],[2.2,-23+i*1.6]],'#cad0d3',.35/s);
 pad(-5,-7,10,9,'#22272b');pad(-4,5,8,12,'#20262d');
 pad(-3,24,7,5,'#d9dbe0');
 [[-12,27],[12,27]].forEach(([x,y])=>{rvCircle(x,y,2.2,rve_gold);rvCircle(x,y,1.05,'#111');});
 const paths=[[[0,-3],[0,5]],[[4,10],[11,10],[11,18]],[[0,17],[0,24]],[[-4,10],[-11,10],[-11,-14]]];
 paths.forEach(a=>rvLine(a,C.hero,.45/s,.6));
 for(let i=0;i<8;i++){pad(-14+i%2*3,-3+Math.floor(i/2)*4,1.8,2.5,i%2?'#6e6556':'#323942');}
 G.restore();
}
function rve_section(x,y,w=700,o={}){
 const heat=o.heat||0,pass=o.pass||1;
 rvRect(x,y,w,16,'#26353b',2,'#7c8b8e',1.5);
 const count=Math.min(7,Math.max(1,Math.floor(w/100)));
 for(let i=0;i<count;i++){
  const xx=count===1?x+w/2-27:x+45+i*(w-90)/(count-1);
  rvRect(xx,y-43,54,40,'#343b43',3);
  rvLine([[xx-5,y],[xx+5,y-8]],heat>i/7?rve_gold:C.mute,5);
  rvLine([[xx+49,y-8],[xx+59,y]],heat>i/7?rve_gold:C.mute,5);
  if(pass===2){rvRect(xx,y+16,54,40,'#343b43',3);}
 }
 if(heat>0 && heat<1){const hx=x+w*heat;rvRect(hx-20,y-92,40,198,rgba(C.hero,.12),5);rvLine([[hx,y-83],[hx,y+94]],C.hero,3);}
}
function rve_point(points,k){
 const d=[0];for(let i=1;i<points.length;i++)d.push(d[i-1]+Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]));
 const at=clamp(k)*d[d.length-1];for(let i=1;i<points.length;i++)if(at<=d[i]){const u=(at-d[i-1])/(d[i]-d[i-1]||1);return[lerp(points[i-1][0],points[i][0],u),lerp(points[i-1][1],points[i][1],u)];}return points[points.length-1];
}
function rve_packet(x,y,label,col=C.hero,o={}){rvRect(x-24,y-15,48,30,C.bg,4,col,2);if(label)rvTxt(label,x,y+7,20,{align:'center',color:col,weight:750});if(o.bad){rvLine([[x-12,y-10],[x+12,y+10]],C.bad,3);rvLine([[x+12,y-10],[x-12,y+10]],C.bad,3);}}
function rve_drop(x,y,r=11){G.save();G.fillStyle=C.hero;G.beginPath();G.moveTo(x,y-r);G.bezierCurveTo(x-r*1.4,y+r*.5,x-r*.8,y+r*1.3,x,y+r*1.3);G.bezierCurveTo(x+r*.8,y+r*1.3,x+r*1.4,y+r*.5,x,y-r);G.fill();G.restore();}
RV.add({id:'rv_board',ch:'elec',theme:'night',title:'One board. No assembly maze.',settle:18,
 from:['eleccard','onechip','elc_oneside','elecsheet1','ownboard'],feedback:['F27','F26','F30'],src:['rv_layoutTarget','rv_boardReview','dsReflow','rv_conformal','rv_budget'],
 draw:t=>{
  rvHeader(t,'ONE BOARD. NO ASSEMBLY MAZE.','Fewer boards and connectors. One populated side. Fewer opportunities to turn one bad joint into a bad mouse.');
  const merge=rvEase(t,1.8,4.5),heat=rvEase(t,5.3,8.4),coat=rvEase(t,9.2,11.4);
  rvLabel('BEFORE: MORE BOARDS, MORE JOINTS',80,316);
  /* The architecture changes in front of the viewer: the daughterboard's function moves
     to the main board, the connector disappears, then only one populated side is heated. */
  G.save();G.globalAlpha=1-merge*.78;rve_section(95,414,530,{pass:2});rve_section(704,414,177,{pass:1});
  rvLine([[625,421],[654,421],[654,460],[684,460],[684,421],[704,421]],C.mute,5);G.restore();
  const by=lerp(706,622,merge),dw=lerp(190,0,merge);
  G.save();G.globalAlpha=1-merge;rve_section(687-merge*320,by-130*merge,dw+1,{pass:1});rvLine([[654,by+8],[684-merge*320,by+8]],C.mute,5);G.restore();
  rve_section(95,by,lerp(530,790,merge),{heat,pass:1});
  const stages=['CONSOLIDATE','ONE REFLOW PASS','PROTECT AFTER REFLOW'];
  const stage=t<5.3?0:t<9.2?1:2;
  stages.forEach((s,i)=>{const x=95+i*273;rvLabel((i+1)+' / '+s,x,508,{size:20,color:i===stage?C.heroText:C.mute});rvLine([[x,525],[x+237,525]],i<=stage?C.hero:C.hair,i===stage?4:2);});
  rvLabel('THESEUS: ONE POPULATED SIDE',95,753,{color:C.heroText,size:26});
  const P=[[95,by-6]];for(let i=0;i<7;i++){const xx=140+i*700/6;P.push([xx-5,by-6],[xx-5,by-49],[xx+59,by-49],[xx+59,by-6]);}P.push([885,by-6]);
  if(coat>0)rvi_path(P,coat,C.hero,3.5);
  if(t>11.5){const d=clamp((t-11.5)/2.7),route=[[745,by-174],[745,by-60],[784,by-60],[784,by-17],[829,by-17],[829,by-60],[905,by-60],[905,by-17],[929,by+31]],p=rve_point(route,d);rve_drop(p[0],p[1]);rvTxt('splash follows the barrier',95,808,27,{color:C.heroText});}
  else rvTxt(t<5.3?'Move the function. Remove the extra connection.':t<9.2?'Solder joints form as the heat front passes.':'Coat components. Leave connectors serviceable.',95,808,27,{color:C.heroText,maxW:810});
  rvLabel('PLAN A, SWITCH POCKETS',1080,316,{size:23});rvLabel('PLAN B, EDGE OVERHANG',1490,316,{size:23});
  rve_plan(1230,566,5.5,'A',t);rve_plan(1652,566,5.5,'B',t);
  rvTxt(THESEUS.pcb.toFixed(1)+'g',1080,811,60,{color:C.heroText,weight:800});rvTxt('populated target',1080,848,24,{color:C.mute});
  rvTxt('1.0mm',1490,811,60,{color:C.heroText,weight:800});rvTxt('board thickness target',1490,848,24,{color:C.mute});
  rvWin('Less to connect. Less to go wrong.','A light conformal layer is proposed against splashes; connectors stay serviceable. It is not a waterproof rating.');
  rvFoot('Presentation layout; routing and battery fit remain under review. Motion schematic;5.6g/1mm targets. Coating25–75µm example; mass unweighed; no waterproof rating.');
 }});
RV.add({id:'rv_power',ch:'elec',theme:'paper',title:'Keep the battery. Lose the baggage.',settle:18,
 from:['cells','power','elc_pmic','elc_charge','elc_safe','frontier'],feedback:['F27','F33.7'],src:['rv_batteryPouch','rv_batteryCylinder','rv_pmic','rv_targets'],
 draw:t=>{
  rvHeader(t,'KEEP THE BATTERY. LOSE THE BAGGAGE.','Compare mouse-sized batteries at the same capacity—not a tiny pouch against a laptop-sized cylinder.');
  rvLabel('350mAh, 3.7V, BOTH EXAMPLES',80,312,{color:C.ink});
  /* The battery fill is the integral of the same current shown in the CC/CV plot.
     Charge voltage/current here are stated example assumptions, not selected-pack limits. */
  const u=clamp((t-1.5)/10.5),knee=.62,tail=7;
  const amps=q=>q<knee?175:175*Math.exp(-(q-knee)*tail);
  const area=q=>175*Math.min(q,knee)+(q>knee?175/tail*(1-Math.exp(-(q-knee)*tail)):0);
  const fill=area(u)/area(1),current=amps(u),voltage=u<knee?3.25+.95*u/knee:4.2;
  /* Cylinder and pouch are deliberately recognizable packaging, with drawn terminal ends. */
  rvRect(120,431,405,112,'#737570',45,'#a1a49e',2);rvCircle(520,487,55,'#b8bbb5','#696c67',2);rvCircle(520,487,37,'#62655f','#d1d4ce',2);
  G.save();G.beginPath();G.roundRect(134,443,362,88,36);G.clip();rvRect(134,443,362*fill,88,C.hero,0);G.restore();
  rvRect(104,464,24,45,'#c3c6c0',5);
  rvTxt('10440 cylinder',80,603,30,{color:C.ink,weight:750});
  rvNum('9.0g',80,698,90,{color:C.ink2,grad:null});rvTxt('Boying, maker example',80,738,25,{color:C.mute});
  rve_pouch(702,403,310,176,C.hero,{fill:Math.max(.001,fill)});
  rvTxt('LP702030 pouch',670,603,30,{color:C.heroText,weight:750});
  rvNum('7.0g',670,698,90);rvTxt('EEMB, bare battery',670,738,25,{color:C.mute});
  rvArrow([569,486],[651,486],C.hero,4);rvTxt('−2.0g',607,386,35,{align:'center',weight:800,color:C.heroText});
  rvLine([[1135,322],[1135,824]],C.hair,2);
  rvLabel('THESEUS RUNTIME TARGET',1210,346,{color:C.heroText});
  rvNum(THESEUS.hours+'h',1210,460,103);rvTxt('at 1khz',1210,530,30,{color:C.ink,weight:750});
  rvTxt('350mAh ÷ 200h = 1.75mA',1210,580,30,{color:C.heroText,weight:750});
  rvTxt('ideal average budget for this example capacity',1210,617,23,{color:C.mute});
  rvLabel(u<knee?'CONSTANT CURRENT':'CONSTANT VOLTAGE',1210,656,{color:C.heroText,size:24});
  const gx=1250,gy=815,gw=540,gh=114,VI=q=>3.25+.95*Math.min(q/knee,1),ypI=q=>gy-gh*amps(q)/175,ypV=q=>gy-gh*(VI(q)-3.25)/.95;
  rvLine([[gx,gy-gh],[gx,gy],[gx+gw,gy]],C.mute,1.5);
  rvLine([[gx+gw*knee,gy-gh-7],[gx+gw*knee,gy]],C.faint,1.2,1,[4,5]);
  const ip=[],vp=[];for(let q=0;q<=u+.001;q+=.01){ip.push([gx+gw*q,ypI(q)]);vp.push([gx+gw*q,ypV(q)]);}if(ip.length>1){rvLine(ip,C.hero,4);rvLine(vp,C.ink2,3);}
  rvCircle(gx+gw*u,ypI(u),5,C.hero);rvCircle(gx+gw*u,ypV(u),4,C.ink2);
  rvTxt(Math.round(current)+'mA',1210,690,24,{color:C.heroText,weight:750});rvTxt(voltage.toFixed(2)+'V',1830,690,24,{align:'right',color:C.ink2,weight:750});
  rvTxt('CC → CV / illustrative profile',1250,848,22,{color:C.mute});
  rvRect(95,783,70,39,'#a9aca6',7);rve_chip(483,803,123,59,'nPM1300');rve_pouch(836,781,98,47,C.hero,{fill:Math.max(.001,fill)});
  rvArrow([180,803],[400,803],C.hero,3);rvArrow([564,803],[808,803],C.hero,3);
  for(let j=0;j<4;j++){const ph=((t*.45+j/4)%1);if(ph<current/175){rvCircle(180+220*ph,803,4,C.hero);rvCircle(564+244*ph,803,4,C.hero);}}
  rvTxt(Math.round(fill*100)+'% charge, both examples',80,847,24,{color:C.heroText,weight:750});
  rvWin('Save package mass before cutting endurance.','Set charge limits to the chosen battery. Pouches are also lithium-ion; these two formats are examples, not a universal ranking.');
  rvFoot('Maker examples, not selected packs; minimum330/320mAh; leads/protection add mass. CC175mA/CV4.20V assumed only to illustrate charge; follow selected-battery limits.1.75mA ideal excludes reserve/losses.8khz runtime unknown.');
 }});
RV.add({id:'rv_radio',ch:'elec',theme:'night',title:'Give the antenna room to work.',settle:17,
 from:['elc_module','antenna','onechip'],feedback:['F27','F17','F30'],src:['rv_raytac','rv_pmic','antDetune','rv_layoutTarget'],
 draw:t=>{
  rvHeader(t,'GIVE THE ANTENNA ROOM TO WORK.','A fast radio is not enough when nearby metal and carbon-filled ribs crowd its antenna.');
  rvLabel('NOSE / WHEEL',827,309,{align:'center'});
  rvRect(798,329,62,100,'#555e67',22,'#a7afb6',2);for(let i=0;i<8;i++)rvLine([[802,343+i*9],[856,343+i*9]],'#8f99a2',1.5);
  rvLine([[740,378],[798,378]],C.mute,4);rvLine([[860,378],[918,378]],C.mute,4);
  /* The known Raytac helper draws the real 9.9×13.3 module proportions and long meander. Antenna is rotated away from wheel. */
  const turn=rvEase(t,1.8,5.1),rot=turn*Math.PI;
  const p=elc_module(830,574,24,rot,{flow:turn>.98?.85:0,t,mark:false});
  rvTxt('AN54LM-P20A',150,414,46,{color:C.heroText,weight:800});
  rvBody('Black module. Long PCB antenna. nRF54LM20A inside.',150,464,470,{size:31});
  rvTxt('9.9 × 13.3 × 2.0mm',150,613,30,{color:C.ink2});
  rvTxt('Not a decorative chip antenna.',150,664,26,{color:C.mute});
  rvLine([[644,480],[700,480],[747,526]],C.mute,1.5);
  G.save();G.globalAlpha=turn;rvRect(671,674,318,138,null,9,C.hero,2);rvTxt('ANTENNA KEEP-OUT',830,792,23,{align:'center',color:C.heroText,weight:800});G.restore();
  rvLine([[1009,429],[1025,429],[1025,p.ant[1]],[1009,p.ant[1]]],turn>.5?C.hero:C.bad,2.5);
  rvTxt(turn>.98?'antenna away from wheel':'turn the antenna away',1060,590,25,{color:turn>.98?C.heroText:C.mute,maxW:250});
  if(turn>0&&turn<1)rvCursor(t,830+170*Math.cos(rot-Math.PI/2),574+170*Math.sin(rot-Math.PI/2),1);
  const pmx=lerp(1140,1540,turn);rve_chip(pmx,410,144,118,'nPM1300');
  rvTxt('POWER MANAGEMENT',1540,517,25,{align:'center',color:C.mute});
  rvLine([[1140,475],[1540,475]],C.hair,1.5,1,[5,5]);rvArrow([1172,475],[pmx,475],C.mute,2);
  rvBody('Separate the PMIC and switching parts. Do not crowd the antenna.',1360,570,455,{size:28});
  rvRect(1495,695,278,90,C.panel,6,C.mute,2);rvTxt('RECEIVER → PC',1634,748,25,{align:'center',color:C.ink,weight:800});
  const path=[p.ant,[1110,728],[1459,728]];
  if(turn>.98){
   rvLine(path,C.hair,2);const ph=clamp((t-5.5)/5.4)*2;
   if(ph<1){const q=rve_point(path,ph);rve_packet(q[0],q[1],'01');}
   else{const q=rve_point(path,2-ph);rve_packet(q[0],q[1],'ACK',C.ink2);}
   rvTxt('report out / acknowledgement back',1165,833,23,{color:C.heroText});
  }else{rvLine([p.ant,[830,430]],C.bad,2,1,[4,6]);if(t<1.8)rve_packet(830,451,'',C.bad,{bad:true});}
  rvWin('More layout discipline. Fewer wireless surprises.','The proposed placement keeps the long antenna away from the wheel; PMIC and its switching parts stay separated.');
  rvFoot('Actual Raytac module proportions. Rotation, keep-out and report/ACK flow explain layout intent—not measured signal gain or a released RF layout. Module approvals do not replace product certification or assembled RF testing.');
 }});
RV.add({id:'rv_firmware',ch:'elec',theme:'paper',title:'A fresh position, not an old packet.',settle:18,
 from:['motion','framesync','secondshot','elc_rate','latency','clk_methods','clk_wait'],feedback:['F27','F26.10','F33'],src:['rv_brockTiming','rv_firmwareTarget','exPiaknow','clk_xbabClick'],
 draw:t=>{
  rvHeader(t,'A FRESH POSITION, NOT AN OLD PACKET.','The sensor, radio and USB need to agree on when “now” is. A fast report can still carry old motion.');
  const clock=clamp((t-1.2)/7.5)*500,x0=340,x1=1170,X=us=>x0+(x1-x0)*us/500,deadline=375;
  rvLabel('ONE USB DEADLINE. DIFFERENT SAMPLE AGE.',80,311,{size:25});
  [0,125,250,375,500].forEach(us=>{rvLine([[X(us),353],[X(us),637]],C.hair,1.3);rvTxt(us+'µs',X(us),670,21,{align:'center',color:C.mute});});
  rvTxt('8khz USB polls / 125µs apart',80,713,25,{color:C.mute});
  const lanes=[{y:435,at:173,n:'OLDER',v:'202µs',col:C.ink2},{y:592,at:333,n:'FRESHER',v:'42µs',col:C.hero}];
  lanes.forEach((p,i)=>{
   rvLabel(p.n,80,p.y-16,{color:i?C.heroText:C.mute});rvTxt(p.v,80,p.y+43,45,{color:i?C.heroText:C.ink2,weight:800});
   rvLine([[x0,p.y],[x1,p.y]],C.hair,3);
   rvLine([[X(p.at),p.y],[X(deadline),p.y]],p.col,10);
   rvCircle(X(p.at),p.y,8,p.col);rvTxt('frame',X(p.at),p.y-36,22,{align:'center',color:i?C.heroText:C.mute});
   if(clock>=p.at){const xx=X(Math.min(clock,deadline));rve_packet(xx,p.y,i?'new':'old',p.col);}
   const by=p.y+(i?42:64);rvTxt(i?'XA25 SensorLock / Theseus target to match':'Viper V4 Pro FrameSync',340,by,25,{color:i?C.heroText:C.mute});
  });
  rvLine([[X(deadline),342],[X(deadline),635]],C.ink2,2,1,[4,6]);rvTxt('USB',X(deadline),333,23,{align:'center',color:C.ink,weight:800});
  /* The target and reported positions share one world-coordinate function. A packet
     preserves its capture position while time advances; it does not chase the target. */
  const P=us=>1355+380*us/500,worldY=423;
  rvLabel('POSITION AT THE PC',1320,311,{size:25});
  rvLine([[1315,worldY],[1815,worldY]],C.hair,2);rvSmallShot(P(Math.min(clock,deadline)),worldY,27,C.ink);
  if(clock>=deadline){rvCircle(P(173),worldY,21,null,C.mute,3);rvCircle(P(333),worldY,12,C.hero);rvLine([[P(173),462],[P(deadline),462]],C.mute,2);rvLine([[P(333),492],[P(deadline),492]],C.hero,3);}
  rvTxt('old sample',1320,553,26,{color:C.mute});rvTxt('fresh sample',1585,553,26,{color:C.heroText});
  rvBody('Same report time. Less motion missing from the packet.',1320,614,500,{size:30});
  rvLine([[80,747],[1840,747]],C.hair,1.5);
  rvLabel('PLANNED RECOVERY',80,793,{color:C.heroText,size:23});
  rvRect(420,770,105,70,C.panel,5,C.mute,1.5);rvTxt('MOUSE',473,813,22,{align:'center',color:C.mute,weight:750});
  rvRect(1320,770,115,70,C.panel,5,C.mute,1.5);rvTxt('RADIO',1377,813,22,{align:'center',color:C.mute,weight:750});
  rvLine([[550,804],[1290,804]],C.hair,2);
  const recover=clamp((t-9.3)/7.2),leg=recover<.28?0:recover<.66?1:2;
  if(leg===0){const q=rve_point([[550,804],[850,804]],recover/.28);rve_packet(q[0],q[1],'17',recover>.21?C.bad:C.ink2,{bad:recover>.21});}
  if(leg===1){const q=rve_point([[550,804],[1280,804]],(recover-.28)/.38);rve_packet(q[0]-29,q[1],'17',C.ink2);rve_packet(q[0]+29,q[1],'18');}
  if(leg===2){const q=rve_point([[1280,804],[550,804]],(recover-.66)/.34);rve_packet(q[0],q[1],'ACK',C.ink2);}
  rvTxt('17 lost',1570,788,23,{color:C.bad});rvTxt('retry17 + new18 → ACK',1570,831,23,{color:C.heroText});
  rvWin('Keep fresh input moving toward the PC.','70µs electrical-click target. 0.14ms motion target. Planned packet recovery should not hold the next input hostage.');
  rvFoot('202/42µs via Brock, not Theseus measured; aligned report deadline is an illustration. Recovery sequence is a firmware proposal.70µs begins at electrical actuation.0.14ms method-specific target; full16-bit/no post-lift smoothing proposed.');
 }});
RV.add({id:'rv_web',ch:'elec',theme:'night',title:'Set the mouse. Close the tab.',settle:17,
 from:['software','gld_soft','motion','elc_sheet2'],feedback:['F27','F30.20'],src:['rv_webTarget','rv_targets'],
 draw:t=>{
  rvHeader(t,'SET THE MOUSE. CLOSE THE TAB.','No installer to keep running. The controls should explain what changes in your hand.');
  const x=80,y=302,w=1060,h=526;
  rvRect(x,y,w,h,'#171817',12,'#50524e',1.5);rvRect(x,y,w,54,'#242623',12);
  [0,1,2].forEach(i=>rvCircle(x+24+i*20,y+26,4,'#74766f'));
  rvRect(x+115,y+11,695,31,'#0d0e0d',7);rvTxt('theseus.local / settings',x+139,y+34,21,{color:'#c4c6be'});
  rvLabel('LIFT-OFF DISTANCE',x+38,y+119,{color:'#bdc0b6',size:24});
  const setting=rvEase(t,4.8,6.5),dist=.9-.1*Math.round(setting*3),knob=d=>x+45+(d-.6)/.4*(w-90),kx=knob(dist);
  rvTxt(dist.toFixed(1)+'mm',x+w-38,y+119,37,{color:C.heroText,weight:800,align:'right'});
  rvLine([[x+45,y+175],[x+w-45,y+175]],'#53564f',8);
  for(let i=0;i<=4;i++){const xx=x+45+i*(w-90)/4;rvCircle(xx,y+175,3,'#a3a79b');}
  rvCircle(kx,y+175,12,C.hero);
  const rows=[['Polling','Dual 8khz wired / wireless'],['Debounce','Your setting, including double-click play'],['Sensor angle','Match your natural grip'],['Profiles','Save on the mouse']];
  rows.forEach((r,i)=>{const yy=y+258+i*63;rvTxt(r[0],x+38,yy,27,{color:'#a4a79c'});rvTxt(r[1],x+w-38,yy,27,{align:'right',color:'#e1e3dc'});if(i<3)rvLine([[x+38,yy+23],[x+w-38,yy+23]],'#33362f',1);});
  const pass=t<6.8?0:1,z=pass?t-7.1:t-.9,lift=.8*rvEase(z,0,1.25)*(1-rvEase(z,3.1,4.1)),move=rvEase(z,1.2,2.8),base=746,sy=base-lift*110,mx=1410+move*135;
  const beamOn=lift<=dist,drift=pass?0:move*190;
  rvLabel('BEFORE 0.9mm → AFTER 0.6mm',1210,347,{color:C.heroText,size:25});
  rvTxt('Same 0.8mm lift. Same sideways move.',1210,396,25,{color:C.mute});
  rvLabel('ON SCREEN',1210,446,{size:21});rvLine([[1250,493],[1810,493]],C.hair,2);rvSmallShot(1740,493,26,C.mute);
  rvCursor(t,1300+drift,493,0);
  if(!pass&&drift>0)rvLine([[1300,517],[1300+drift,517]],C.bad,3);
  rvTxt(pass?'Aim stays still during the lift.':'A high cut-off can drag your aim.',1210,566,27,{color:pass?C.heroText:C.mute});
  rvLine([[1240,base],[1828,base]],C.mute,4);
  rvLine([[mx-160,sy],[mx+160,sy]],C.ink2,17);rvRect(mx-35,sy-39,70,34,'#383c34',4);rvCircle(mx,sy+7,5,C.hero);
  rvLine([[mx,sy+14],[mx-43,base],[mx+43,base],[mx,sy+14]],beamOn?C.hero:C.faint,2);
  rvLine([[1790,base],[1805,base],[1805,sy],[1790,sy]],beamOn?C.mute:C.hero,2);
  rvTxt(lift.toFixed(1)+'mm',1815,(base+sy)/2+7,22,{color:C.mute});
  rvTxt(beamOn?'TRACKING': 'CUT OFF',mx,sy-66,25,{align:'center',color:beamOn?C.mute:C.heroText,weight:800});
  rvTxt('0.1mm STEPS / SAVE ON THE MOUSE',1210,825,26,{color:C.heroText,weight:800});
  if(t>=4.2&&t<7){const cx=t<4.8?lerp(1220,knob(.9),rvEase(t,4.2,4.8)):knob(lerp(.9,.6,setting));rvCursor(t,cx,y+181,t>=4.8?1:0);}
  rvRect(878,783,220,31,t>13.2?C.hero:'#34372f',4);rvTxt(t>13.2?'SAVED ON MOUSE':'SAVE PROFILE',988,806,22,{align:'center',color:t>13.2?'#11120f':'#dfE2d8',weight:800});
  if(t>=12.3&&t<14.2){const q=rvEase(t,12.3,13.2);rvCursor(t,lerp(1290,988,q),lerp(830,798,q),t>13.1?1:0);}
  rvWin('Your mouse keeps the setting. Not a background app.','Fine lift-off adjustment is proposed, subject to the selected sensor’s actual support and calibration.');
  rvFoot('Illustrated software/firmware concept—not an implemented web application. Lift heights and beam width exaggerated. No claim that every sensor exposes0.1mm hardware steps.');
 }});
RV.add({id:'rv_no_lights',ch:'elec',theme:'paper',title:'Spend power on the input.',settle:18,
 from:['srf_encoder','clk_switch','elc_sheet2'],feedback:['F27','F30.20','F31.1'],src:['rv_tiHall','rv_ti3d','rv_razerV4','rv_gt01Review','rv_webTarget','rv_targets'],
 draw:t=>{
  rvHeader(t,'SPEND POWER ON THE INPUT.','Mechanical clicks. A magnetic scroll encoder. No RGB. The settings live on screen, where you can read them.');
  rvLabel('OPTICAL',80,310);rvLabel('MAGNETIC, PROPOSED',1010,310,{color:C.heroText});
  /* A familiar scroll wheel, axle and sensing path—not an unexplained circuitry block. */
  const turning=(t>2&&t<5)||(t>8&&t<11),ang=TAU*(.7*rvEase(t,2,5)+.7*rvEase(t,8,11)),pulse=(t*1.8)%1<.10,hallOn=turning||(t*1.8)%1<50/1050;
  [470,1430].forEach((xx,j)=>{
   const r=97;if(j)rvRect(xx+94,425,163,114,rgba(C.ink,.035),12,C.mute,1.2);rvCircle(xx,480,r,'#30332e','#858b7e',3);
   for(let i=0;i<6;i++){const a=ang+i*TAU/6;rvLine([[xx,480],[xx+Math.cos(a)*82,480+Math.sin(a)*82]],'#8998a6',8);}
   rvCircle(xx,480,20,'#a7b3bd');
   rvLine([[xx+20,480],[xx+143,480]],'#a7b3bd',13);
   if(!j){rvRect(xx+94,425,163,114,rgba(C.ink,.035),12,C.mute,1.2);rvRect(xx+158,438,37,85,'#30342b',5);rvRect(xx+94,459,21,38,'#30342b',4);
    rvCircle(xx+136,478,29,'#5c6257',C.mute,1.5);for(let n=0;n<10;n++){const a=ang+n*TAU/10;rvLine([[xx+136+Math.cos(a)*17,478+Math.sin(a)*17],[xx+136+Math.cos(a)*27,478+Math.sin(a)*27]],C.bg,4);}
    rvCircle(xx+176,478,8,pulse?C.hero:C.mute);if(pulse)rvLine([[xx+158,478],[xx+115,478]],C.hero,3);
    rvTxt('emitter + detector',xx,624,29,{align:'center',color:C.mute});
   }else{rvRect(xx+114,463,42,34,'#c6cbbf',3);rvRect(xx+114,463,21,34,'#6f7865',3);rve_chip(xx+213,480,50,51,'Hall',hallOn?'#656c47':'#252922');
    for(let i=0;i<3;i++){G.save();G.strokeStyle=C.hero;G.lineWidth=1.5;G.globalAlpha=.5;G.beginPath();G.ellipse(xx+161,480,24+i*10,38+i*8,0,-Math.PI/2,Math.PI/2);G.stroke();G.restore();}
    rvTxt('magnet + Hall sensor',xx,624,29,{align:'center',color:C.heroText});
   }
  });
  rvTxt(turning?'WHEEL TURNING / SAMPLE THE INPUT':'WHEEL STILL / PERIODIC CHECKS',1430,671,23,{align:'center',color:C.heroText,weight:800});
  rvLine([[80,695],[1840,695]],C.hair,1.5);
  rvTxt('Hypothetical: −17.6% draw → +21.4% runtime',80,739,28,{color:C.mute,weight:750});
  rvTxt('2mA awake / 90.5µA periodic',1010,739,31,{color:C.heroText,weight:800});
  const wave=(x,w,duty,continuous,col)=>{const y=795,period=143,shift=(t*1.8*period)%period,P=[];for(let dx=0;dx<=w;dx+=2){const on=continuous||((dx+shift)%period)<period*duty;P.push([x+dx,y-(on?45:0)]);}rvLine([[x,y],[x+w,y]],C.hair,1.5);rvLine(P,col,2.7);};
  wave(80,780,.10,false,C.ink2);wave(1010,780,50/1050,turning,C.hero);
  rvTxt('No LED ≠ no current. Input sensing still costs power.',80,831,24,{color:C.mute});
  rvTxt(turning?'Active sampling, not zero energy.':'50µs on / 1ms off / wake path also uses power',1010,831,23,{color:C.mute});
  rvWin('Nothing lights up but the sensor.','No dust-blocked light path in the encoder. Real runtime still depends on sampling, radio, sensor, battery and firmware.');
  rvFoot('Hypothetical runtime math:1/(1−0.176)−1≈21.4%, not measured Viper or Theseus. Optical drive qualitative. TI TMAG5253 at1.8V example, not selected encoder. Razer “almost half”: staff online via Brock, unverified.');
 }});
RV.add({id:'rv_cable',ch:'elec',theme:'night',title:'Charging should not change the glide.',settle:17,
 from:['cable','elc_tear','elc_twist','elc_lay','elc_flex'],feedback:['F27','F2','F33.6'],src:['elcXa25','rv_wires','elcNasaTem','elcAlexander','elcKapton','rv_layoutTarget'],
 draw:t=>{
  rvHeader(t,'CHARGING SHOULD NOT CHANGE THE GLIDE.','A soft woven cable and an angled plug keep the charging lead up off the pad. Inside, serviceable wires follow the shape.');
  rvLabel('STRAIGHT EXIT, DRAGS LOW',80,308);rvLabel('ANGLED EXIT, PROPOSED',1030,308,{color:C.heroText});
  const padY=595,travel=q=>130*(rvEase(q,1.4,3.6)-rvEase(q,5.0,7.2)),dx=travel(t),velocity=(travel(t+.02)-travel(t-.02))/.04;
  [0,1].forEach(j=>{
   const bx=j?1030:80;
   rvLine([[bx,padY],[bx+760,padY]],C.mute,3);
   rvLine([[bx+40+dx,padY-15],[bx+125+dx,padY-25],[bx+215+dx,padY-65],[bx+245+dx,padY-65]],C.ink2,6);
   rvLine([[bx+215+dx,padY-65],[bx+245+dx,padY-65]],'#bfc2ba',13);
   const p=elc_plugSide(bx+247+dx,padY-65,7,1,!!j,1),touch=bx+630;
   const end=[bx+735,padY+(j?-110:-9)];
   const pts=j?elc_bez(p.p,[p.p[0],p.p[1]-130],[end[0]-120,end[1]],end,70):elc_bez(p.p,[p.p[0]+70,p.p[1]],[touch-80,padY-9],[touch,padY-9],55).concat([end]);
   elc_paracord(pts,17,{slide:0,c1:'#30342e',c2:'#b8beb0'});
   rvArrow([bx+90+dx,padY-104],[bx+90+dx+(Math.abs(velocity)>3?Math.sign(velocity):1)*88,padY-104],C.mute,3);
   if(!j){rvLine([[touch-20,padY-1],[bx+735,padY-1]],C.bad,4);if(Math.abs(velocity)>3)rvArrow([touch+42,padY+28],[touch+42-Math.sign(velocity)*78,padY+28],C.bad,3);rvTxt('pad contact / opposing drag',bx+420,padY+66,25,{color:C.mute});}
   else{rvArrow([bx+630,padY-18],[bx+630,padY-89],C.hero,3);rvTxt('same move / cable stays clear',bx+400,padY+66,25,{color:C.heroText});}
  });
  rvLine([[80,695],[1840,695]],C.hair,1.5);
  const colors=['#bd6f63','#9ab4c8','#728d9c'];
  const lay=rvEase(t,2,3.5);
  for(let n=0;n<3;n++){const pts=[];for(let x=0;x<=490;x+=4)pts.push([92+x,770+Math.sin(x/27+n*TAU/3)*15*lay]);rvLine(pts,colors[n],6);}
  rvTxt('THREE INTERNAL WIRES',80,840,24,{color:C.heroText,weight:800});
  rvBody('Repair: one nick need not tear a whole film.',670,755,360,{size:27});
  rvBody('Flex: fine strands share repeated bending.',1100,755,350,{size:27});
  rvBody('Noise: controlled signal / return geometry.',1515,755,320,{size:27});
  rvWin('Soft outside. Deliberate routing inside.','The braid keeps the cable flexible and serviceable. Twisting is a tool—not automatic noise immunity.');
  rvFoot('Cable/plug geometry proposed. Motion and failure behavior illustrated, not lifetime tests. Twisting can add length/mass; signal integrity and bend life require matched tests.');
 }});

RV.add({id:'rv_wiring',ch:'elec',theme:'paper',title:'Three wires. Three reasons.',settle:18,
 from:['elc_tear','elc_twist','elc_lay','elc_flex','ownsheet1'],feedback:['F27','F2','F33.8'],src:['elcKapton','elcNasaTem','elcAlexander','rv_wires'],
 draw:t=>{
  rvHeader(t,'THREE WIRES. THREE REASONS.','Inside the mouse, a harness should tolerate routing, movement and repair—not just photograph well.');
  const k=rvEase(t,1.6,5.1),split=rvEase(t,4.5,5.6)*12,field=Math.sin((t-5.8)*2)*rvEase(t,5.8,7)*(1-rvEase(t,11,12));
  rvLabel('1 / A NICK DOES NOT UNZIP A FILM',80,320,{size:24});
  rvLabel('2 / CONTROL THE RETURN PATH',700,320,{size:24});
  rvLabel('3 / SPREAD THE BEND',1315,320,{size:24});
  /* A film tears from the existing nick; individual insulated wires are independent mechanical members.
     No claim that a broken electrical conductor continues functioning. */
  rvRect(105-split,405,220,70,'#d6bf80',4,'#9c8653',1.5);rvRect(325+split,405,245,70,'#d6bf80',4,'#9c8653',1.5);
  for(let i=0;i<4;i++){const yy=420+i*13,broken=k>(yy-405)/70;rvLine([[111-split,yy],[323-split,yy]],'#a87549',3);rvLine([[327+(broken?split:0),yy],[565+split,yy]],broken?C.bad:'#a87549',3);}
  rvi_path([[325-split,405],[321-split,412],[329-split,423],[319-split,436],[332-split,450],[322-split,463],[326-split,477]],Math.max(.06,k),C.ink2,3.5);
  rvArrow([121,383],[87,383],C.mute,2);rvArrow([554,383],[588,383],C.mute,2);
  const cols=['#b8675a','#6088ac','#7a9b9d'];
  cols.forEach((c,i)=>{const y=566+i*28;
   rvLine([[108,y],[316,y]],c,9);
   rvLine([[338+(i===0?split:0),y+(i===0?k*24:0)],[568,y]],c,9);
   if(i!==0)rvLine([[314,y],[340,y]],c,9);
  });
  rvTxt('FILM',105,516,23,{color:C.mute});rvTxt('INDEPENDENT WIRES',105,700,23,{color:C.heroText,weight:800});
  rvBody('A damaged conductor still fails. It need not pull a tear through every neighbor.',80,757,500,{size:27});
  /* Parallel pair: a large loop. Twisted pair: alternating signed loops. */
  rvLine([[739,415],[1175,415],[1175,490],[739,490]],C.mute,5);
  for(let i=0;i<4;i++){const x=795+i*102;rvArrow([x,452+field*22],[x,452-field*22],C.mute,2);}
  const pickup=[];for(let x=0;x<=436;x+=5)pickup.push([739+x,452+field*16*Math.sin(x/12)]);rvLine(pickup,C.bad,2.4);
  rvTxt('one large pickup loop',739,534,25,{color:C.mute});
  for(let n=0;n<2;n++){
   const pts=[];for(let x=0;x<=450;x+=3)pts.push([725+x,618+Math.sin(x/34+n*Math.PI)*25]);rvLine(pts,n?C.ink2:C.hero,5);
  }
  for(let i=0;i<4;i++){const x=775+i*107,sign=i%2===0?1:-1;rvArrow([x,618+field*22*sign],[x,618-field*22*sign],C.hero,2);}
  rvLine([[1177,618],[1210,618+field*1.5]],C.hero,3);
  rvTxt('+',777,698,30,{color:C.heroText});rvTxt('−',883,698,30,{color:C.heroText});rvTxt('+',991,698,30,{color:C.heroText});rvTxt('−',1098,698,30,{color:C.heroText});
  rvBody('Alternating loops can cancel pickup. Keep a return beside each signal; tighter twist costs copper.',700,757,490,{size:27});
  /* Folded flat conductor vs a broad fine-strand bend. No fictitious fatigue ratio. */
  const fk=t<1.5?0:t<7.5?.5-.5*Math.cos((t-1.5)/3*TAU):rvEase(t,7.5,9),drop=65*fk;
  rvLine([[1341,430],[1500,430],[1520,430-32*fk],[1540,430+drop],[1778,430+drop]],C.mute,15);
  rvLine([[1500,430],[1520,430-32*fk],[1540,430+drop]],C.bad,5,fk);
  rvRect(1770,410+drop,45,40,C.panel,3,C.mute,2);rvArrow([1810,385],[1810,430+drop],C.mute,2);rvTxt('localized crease',1520,548,25,{align:'center',color:C.mute});
  for(let i=0;i<7;i++){
   /* Explicit cubic samples keep the flex radius smooth across each thin strand. */
   const pp=[];for(let z=0;z<=1;z+=.025){const q=1-z;pp.push([q*q*q*1340+3*q*q*z*1460+3*q*z*z*1660+z*z*z*1790,q*q*q*(610+i*2)+3*q*q*z*(610+i*2)+3*q*z*z*(610+drop+i*2)+z*z*z*(610+drop+i*2)]);}
   rvLine(pp,i%2?C.ink2:C.hero,1.7);
  }
  rvRect(1770,598+drop,45,40,C.panel,3,C.hero,2);rvTxt('same endpoint move / broad radius',1315,726,24,{color:C.heroText});
  rvBody('More small strands can share flex. Bend life still needs a harness test at the actual radius.',1315,757,500,{size:27});
  rvWin('Choose the failure mode before choosing the wire.','A 6mm twist lay is a proposal. Do not trade a neat braid for unnecessary mass or untested signal integrity.');
  rvFoot('Qualitative diagrams, motion exaggerated. Kapton tear tests are not finished FFC tests; historical strand tests are not a prediction of this harness lifetime. NASA finds twist benefits context-dependent.');
 }});


