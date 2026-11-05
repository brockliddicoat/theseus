/* Surface is a process: remove, coat, cure; then control direction rather than add bulk. */
Object.assign(SRC,{
 rv_srfAbs:{t:'INEOS Styrolution TERLURAN GP-22 ABS density1.04g/cm³. Representative model material, not a retail-wheel weighing.',u:'https://www.ineos-styrolution.com/Product/Terluran-ABS-_Terluran-GP-22_SKU300600120827.html?SKU=300600120827&SelectedRegion=Region_America'},
 rv_srfRubber:{t:'Wacker ELASTOSIL R401/40S density1.12g/cm³. Representative silicone, not a named mouse-wheel tyre.',u:'https://www.wacker.com/h/en-us/medias/ELASTOSIL-R-40140-S-en-2024.06.16.pdf'},
 rv_srfGroup:{t:'Illustrative same-envelope design test group, not weighed retail products: diameter22.74mm,width7mm; ABS hub600mm³ at1.04g/cm³; silicone tyre depths0.8/1.6/2.4mm at1.12g/cm³. Mass=0.624+π(11.37²−(11.37−depth)²)×7×1.12/1000g. No retail-market average claim.',u:''},
 rv_srfF130:{t:'Cerakote F-130 technical sheet:0.75mil=19.05µm recommended film;9H pencil gouge/scratch on test panels. Product datasheet, not Theseus testing.',u:'https://www.cerakoteeu.com/wp-content/uploads/2025/07/F-130-Stainless.pdf'}
});
function rvs_profile(x,y,w,blast,coat){
 const p=[];for(let i=0;i<=100;i++){const u=i/100,old=Math.sin(u*71)*6+Math.sin(u*131)*3,now=20+Math.sin(u*71)*2.2,k=clamp(blast*1.12-u)*9;p.push([x+u*w,y+lerp(old,now,clamp(k))]);}
 rvstPoly([...p,[x+w,y+95],[x,y+95]],C.panel,C.mute,2);rvLine(p,C.ink2,3);
 for(let j=0;j<19;j++){const xx=x+14+j*(w-28)/18,yy=y+44+(j%3)*14;rvLine([[xx,yy],[xx+17,yy-2]],C.mute,3.5);if(j%4===0)rvCircle(xx+5,yy-9,3.5,C.mute);}
 if(coat>0){const pp=p.map(q=>[q[0],q[1]-19]);G.save();G.beginPath();G.rect(x-3,y-45,(w+6)*coat,160);G.clip();rvstPoly([...pp,...p.slice().reverse()],C.hero,null);rvLine(pp,C.hero,2);G.restore();}
 return p;
}
function rvsOven(x,y,w,h,t,door){
 rvRect(x,y,w,h,C.panel,10,C.mute,3);rvRect(x+17,y+17,w-34,h-58,C.bg,5,C.faint,2);rvLine([[x+29,y+h-55],[x+w-29,y+h-55]],C.mute,4);
 for(let j=0;j<5;j++){const xx=x+37+j*(w-74)/4;rvLine([[xx-12,y+h-20],[xx-6,y+h-32],[xx,y+h-19],[xx+7,y+h-33],[xx+13,y+h-20]],t>12?C.bad:C.mute,2.5,t>12?.8:.35);}
 const dw=(w-22)*(1-door);rvRect(x+11,y+10,Math.max(8,dw),h-55,null,5,C.ink2,2.5);rvRect(x+23,y+25,Math.max(2,dw-26),h-91,null,4,C.mute,1.5);rvLine([[x+dw-7,y+64],[x+dw-7,y+104]],C.ink2,4);
}
RV.add({id:'rv_coating',ch:'surface',theme:'paper',title:'Thin film. Tough surface.',settle:23,
 from:['surfacecard','coating','srf_texture','srf_weight','srf_uv','srf_twotone'],feedback:['F2.13','F2.21','F2.22','F2.23','F21.7','F21.10','F26.11','F27','F32','F33','C5'],src:['rv_srfF130','srf_fManual','srf_soft','srf_quv','srf_chem','srf_laserImg','srf_hoft22'],
 draw:t=>{
  rvHeader(t,'THIN FILM. TOUGH SURFACE.','A soft surface can feel good on day one. Blast the high spots, add a ceramic film, then cure it. Keep the shape.');
  const blast=rvstP(t,1.6,5.4),coat=rvstP(t,6,9.2),oven=rvstP(t,10,12.5),cure=rvstP(t,13,17),door=rvstLoad(t,9.2,10,12.5,13.5);
  rvLabel('ORIGINAL SURFACE',105,327);rvLabel(t<5.7?'01 / LIGHT ETCH BLAST':t<9.6?'02 / APPLY THE FILM':'03 / LOW-TEMPERATURE CURE',645,327,{color:C.heroText});rvLabel('82°C / 1 HOUR FOR POLYMERS',1345,327,{size:21});
  rvLine([[105,532],[529,532]],C.faint,1.5,.7,[6,6]);rvs_profile(105,532,423,0,0);rvTxt('Original height stays visible.',105,681,26,{color:C.mute});
  G.save();G.globalAlpha=1-oven*.7;rvs_profile(646,532,522,blast,coat);G.restore();rvLine([[646,532],[1168,532]],C.faint,1.5,.8,[6,6]);rvLabel('ORIGINAL HEIGHT',646,472,{size:20});
  if(t>1.4&&t<5.6){const nx=646+blast*522;rvLine([[nx-44,400],[nx,425]],C.ink2,13);for(let j=0;j<27;j++){const u=((j*.137+t*1.7)%1),v=((j*19)%17-8)*1.7;rvCircle(nx+v*u,425+u*116,1.6,C.mute);if(j<9)rvCircle(nx+v*2.1+u*35,548-u*(60+3*j)+u*u*90,2,C.mute);}rvCursor(t,nx-40,400,.6);}
  if(t>5.8&&t<9.5){const nx=646+coat*522;rvRect(nx-26,402,42,40,C.panel,3,C.ink2,2);rvLine([[nx-1,442],[nx-1,458]],C.mute,3);for(let j=0;j<15;j++){const u=((j*.21+t*1.1)%1);rvCircle(nx+(j%5-2)*u*7,458+u*76,1.7,C.hero);}rvCursor(t,nx-25,415,.6);}
  rvsOven(1370,419,364,228,t,door);if(oven>0){const xx=lerp(907,1552,oven),yy=lerp(562,540,oven),ww=lerp(522,244,oven);rvRect(xx-ww/2,yy,ww,18,C.panel,3,C.hero,2);rvLine([[xx-ww/2,yy-3],[xx+ww/2,yy-3]],C.hero,6);if(oven<1)rvCursor(t,xx+17,yy+25,.8);}
  rvTxt(Math.round(20+62*cure)+'°C',1346,709,65,{font:'disp',weight:800,color:C.heroText});rvTxt(Math.round(60*cure)+' min',1590,709,40,{color:C.ink2});
  rvLabel('FILM THICKNESS',105,734,{size:21});rvTxt('Soft touch 51 µm',105,776,25,{color:C.mute});rvBar(105,790,390,51,60,C.mute,12);rvTxt('Cerakote 19 µm',645,776,25,{color:C.heroText});rvBar(645,790,390,19,60,C.hero,12);
  rvTxt('Carbon fibres: about 7 µm across.',645,681,25,{color:C.mute});rvTxt('9H on Cerakote’s tests',1345,778,33,{weight:780,color:C.heroText});rvBody('Published UV + chemical tests, not a forever-white promise.',1345,821,465,{size:25,color:C.ink2});
  rvWin('Protect the surface. Keep the shape.','Etch to carbon for a second tone without a second paint layer. Net coating weight stays unnumbered until samples are weighed.');
  rvFoot('Schematic process; removed height and thickness enlarged, not a measured blast allowance. F-130:19µm,9H maker panels. F-Series polymer cure82°C/1h. Different UV/chemical tests use different formulations.');
  rvstReport('rv_coating',t,{phase:t<5.7?'remove-high-spots':t<9.6?'apply-thin-film':t<13?'load-oven':'cure',blastProgress:blast,coatingProgress:coat,ovenTransfer:oven,cureProgress:cure,originalHeight:532,blastedDatum:552,filmThicknessMicrometres:19,netMassClaim:null});
 }});
RV.add({id:'rv_grip',ch:'surface',theme:'night',title:'Grip without the grip tape.',settle:22,
 from:['grip','srf_gripmap','srf_tape'],feedback:['F2.14','F2.15','F21.9','F27','F33.5','C5'],src:['srf_zhang17','srf_serg22','srf_lizard','srf_ooze','rv_srfF130','srf_doc'],
 draw:t=>{
  rvHeader(t,'GRIP WITHOUT THE GRIP TAPE.','Resist the direction that loses your grip. Let the finger move in the direction that adjusts your aim.');
  rvLabel('TAPE ADDS A LAYER',105,327);rvLabel('ONE SURFACE. CURATED DIRECTIONS.',795,327,{color:C.heroText});
  const age=rvstP(t,2,7),lift=rvstP(t,1.2,4),transfer=rvstP(t,5,8),slide=rvstP(t,8.8,12.6);
  rvRect(107,536,490,70,C.panel,4);rvRect(107,477,490,59,C.ink2,4);rvLine([[107,539],[596,539]],C.mute,7);
  const peel=[];for(let j=0;j<=24;j++){const u=j/24;peel.push([500+u*97,477-age*60*u*u]);}rvstPoly([[500,477],...peel,[597,536-60*age],[500,536]],C.ink2);rvLine(peel,C.mute,2);
  for(let j=0;j<13;j++)rvCircle(120+j*36,544+(j%3)*4,2+age*(j%4+1),C.mute);
  rvTxt('0.5 mm + adhesive',105,420,37,{weight:750});rvBody('Edges lift. Dirt sticks. The shape changes.',105,684,525,{size:31});rvTxt('Extra thickness stays under your fingers.',105,803,25,{color:C.mute});
  const x=795,y=424,w=965,h=285;rvRect(x,y,w,h,C.panel,8);G.save();G.beginPath();G.rect(x,y,w,h);G.clip();
  for(let j=-22;j<23;j++){const pp=[];for(let q=0;q<=100;q++){const u=q/100;pp.push([x+u*w,y+144+j*17+90*Math.sin(u*Math.PI)*Math.exp(-Math.pow((u-.48)*2.5,2))]);}rvLine(pp,C.mute,2.5,.75);}G.restore();
  rvLabel('ACROSS: HOLD THE LIFT',815,385,{size:21});rvLabel('ALONG: MAKE FINE ADJUSTMENTS',1334,385,{size:20});
  const fx=lerp(1010,1430,transfer)+slide*250,fy=lerp(628-lift*31,598,transfer);rvLine([[1010,628],[1010,504]],C.faint,3,.7,[7,7]);rvArrow([1010,628],[1010,628-lift*31],C.hero,5);if(transfer>0)rvstTrim([[1010,597],[1160,582],[1300,610],[1430,598]],transfer,C.hero,3,.8);if(slide>0)rvLine([[1430,598],[fx,fy]],C.hero,5);
  rvFinger(fx,fy-9,-.48,{fill:C.bg,color:C.ink2});rvCircle(fx-4,fy+4,22,null,C.hero,2);if(t<13.3)rvCursor(t,fx+42,fy+48,.8);
  rvArrow([850,673],[850,609],C.hero,3);rvArrow([1465,673],[1715,673],C.hero,3);
  rvTxt(transfer<.9?'The finger meets the grooves.':'Turn the drag. Follow the grooves.',795,770,31,{weight:750,color:C.heroText});rvTxt('19 µm film. No adhesive. No thick rubber layer.',795,822,33,{font:'disp',weight:780,color:C.heroText});
  rvWin('Grip where you lift. Freedom where you adjust.','Choose a direction for each contact zone, instead of making every movement equally sticky. The final grip map is still for review.');
  rvFoot('Motion explains directional friction, not a Theseus friction test or numeric slip claim. Provisional smoothly blended map. Zhang2017 laser-textured steel; Sergachev2022 skin friction. Tape0.5mm; Cerakote19µm.');
  rvstReport('rv_grip',t,{phase:t<5?'drag-across-grooves':t<8.8?'change-contact-zone':'drag-along-grooves',tapeAge:age,acrossTravelPx:31*lift,zoneTransfer:transfer,alongTravelPx:250*slide,fingerPosition:[fx,fy],dragDirection:slide>0?'horizontal':'vertical',finalMapApproved:false});
 }});
function rvs_wheel(cx,cy,r,rot=0,tyre=0,o={}){
 const depth=o.depth==null?r*.24:o.depth,arms=o.arms==null?1:o.arms,rim=o.rim==null?1:o.rim,grooves=o.grooves==null?144:o.grooves;
 if(rim>0){rvCircle(cx+depth,cy-depth*.18,r,tyre?C.ink2:C.panel,C.mute,2);for(let j=0;j<=54;j++){const a=-Math.PI/2+j/54*Math.PI;rvLine([[cx+Math.cos(a)*r,cy+Math.sin(a)*r],[cx+depth+Math.cos(a)*r,cy-depth*.18+Math.sin(a)*r]],tyre?C.ink2:C.panel,Math.max(3,r*.07));}}
 G.save();G.translate(cx,cy);G.rotate(rot);if(rim>0){rvCircle(0,0,r,tyre?C.ink2:C.panel,C.ink2,2);rvCircle(0,0,r-(tyre||Math.max(8,r*.08)),C.bg,C.mute,1.5);}for(let j=0;j<6;j++){const a=j*TAU/6,k=clamp(arms*6-j),dx=(1-k)*r*1.5,dy=-(1-k)*r*.65;rvLine([[Math.cos(a)*22+dx,Math.sin(a)*22+dy],[Math.cos(a)*(r-16)+dx,Math.sin(a)*(r-16)+dy]],C.ink2,Math.max(4,r*.037));}rvCircle(0,0,r*.14,C.panel,C.ink2,2);rvCircle(0,0,r*.043,C.bg,C.mute,1.5);G.restore();
 if(rim>0&&!tyre){for(let j=0;j<Math.floor(grooves);j++){const a=j*TAU/144+rot;if(Math.cos(a)>.05)rvLine([[cx+Math.cos(a)*(r-1),cy+Math.sin(a)*(r-1)],[cx+depth+Math.cos(a)*(r-1),cy-depth*.18+Math.sin(a)*(r-1)]],C.mute,Math.max(.7,r*.006));}}
}
RV.add({id:'rv_wheel',ch:'surface',theme:'paper',title:'Less wheel. Same control.',settle:22,
 from:['wheel'],feedback:['F22.1','F25.2','F27','F30.8','F33.7','C5'],src:['srf_wheel3d','srf_az31b','srf_delrin','srf_pmm','rv_srfAbs','rv_srfRubber','rv_srfGroup'],
 draw:t=>{
  rvHeader(t,'LESS WHEEL. SAME CONTROL.','Build the grip into the wheel. Six thin arms, a light rim, and straight grooves; not a thick rubber ring.');
  const arms=rvstP(t,.5,4.5),rim=rvstP(t,4.7,7),knurl=rvstP(t,7.5,10.5),turn=rvstP(t,11.3,15),rot=turn*TAU/3;
  rvLabel(t<4.7?'01 / SIX THIN MAGNESIUM ARMS':t<7.4?'02 / SEAT THE RIM':t<11?'03 / 144 STRAIGHT GROOVES':'04 / TURN THE FINISHED WHEEL',105,327,{color:C.heroText,size:22});
  rvs_wheel(411,555,181,rot,0,{arms,rim:0,grooves:0});
  if(rim>0){const rx=411+(1-rim)*365;G.save();G.beginPath();G.arc(rx,555,181,0,TAU);G.arc(rx,555,166,0,TAU,true);G.fillStyle=C.panel;G.fill();G.strokeStyle=C.ink2;G.lineWidth=2;G.stroke();G.restore();if(rim<1)rvCursor(t,rx+140,447,.7);}
  if(rim>.995)rvs_wheel(411,555,181,rot,0,{arms:1,rim:1,grooves:knurl*144});
  rvLine([[296,555],[565,555]],C.hero,6);rvCircle(411,555,11,C.panel,C.hero,3);rvLabel('SEPARATE POM AXLE / BUSHING',106,756,{size:21});
  if(t>7.4&&t<10.8){const an=knurl*TAU;rvCursor(t,411+Math.cos(an)*195,555+Math.sin(an)*195,.5);}if(t>11&&t<15.2){const aa=-Math.PI/2+turn*.55,xx=411+Math.cos(aa)*181,yy=555+Math.sin(aa)*181;G.save();G.translate(xx,yy);G.rotate(aa+Math.PI/2);G.translate(0,-12);G.scale(.62,.36);rvFinger(0,0,Math.PI,{fill:C.panel});G.restore();rvArrow([371,350],[410+turn*90,350],C.hero,3);}
  rvNum('0.90 g',105,837,87);rvTxt('Metal wheel only; axle separate',452,812,28,{color:C.mute});
  rvLabel('SAME-SIZE MATERIAL TEST GROUP',1033,327);rvTxt('Illustrative designs; not retail weighings',1033,372,26,{color:C.mute});
  const group=[];[.8,1.6,2.4].forEach((dep,i)=>{const yy=455+i*110,m=.624+Math.PI*(11.37**2-(11.37-dep)**2)*7*1.12/1000;rvs_wheel(1060,yy-3,31,rot,dep*31/11.37,{depth:10});rvTxt(dep.toFixed(1)+' mm rubber',1128,yy-9,27,{color:C.ink2});rvBar(1128,yy+15,532,m,2,C.mute,15);rvTxt(m.toFixed(2)+' g',1783,yy+25,31,{align:'right',weight:750});group.push(m);});
  rvStageNote('Ø22.74 × 7 mm. Same600 mm³ ABS hub; only tyre depth changes. Material densities: ABS1.04; silicone1.12g/cm³.',1033,767,758);rvTxt('PMM magnesium: 1.00 g maker claim.',1033,842,26,{color:C.mute});
  rvWin('Texture without the thick rubber ring.','The grooves run straight across the rim. The POM axle supplies a self-lubricating bearing surface where the wheel turns.');
  rvFoot('0.90 g metal wheel from508.5mm³ atAZ31B1.77g/cm³; excludes POM axle/bushing. Same-envelope controls are calculated geometry, not an average of retail wheels. Exploded motion is a design explanation, not a manufacturing sequence.');
  rvstReport('rv_wheel',t,{phase:t<4.7?'build-six-arms':t<7.4?'seat-rim':t<11?'apply-straight-tread':'finger-turn',armBuild:arms,rimSeat:rim,grooveCount:Math.floor(knurl*144),wheelRotationRad:rot,metalWheelDesignMassG:.9,axleMassIncluded:false,controlMassesG:group});
 }});
