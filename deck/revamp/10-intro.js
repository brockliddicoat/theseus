/* Theseus Codex revamp — intro. Independent film; code-only 2D.
   All new top-level names are rvi_. Evidence stays attached to its exact configuration. */
const rvi_evidence = RDATA['codex-verified'] || { sources:{}, mice:[] };
for (const [k,s] of Object.entries(rvi_evidence.sources))
  SRC['rv_'+k]={t:s.title+', verified '+s.verified_date+', '+s.kind,u:s.url};
Object.assign(SRC,{
 rv_targets:{t:"Brock Liddicoat, Theseus concept targets: 29.31g / 119.3×62.4×39.9mm / $189 / 200h at 1khz. Proposal, not built-product results.",u:""},
 rv_force:{t:"Newton's second law F=ma. This film's constant-force, equal-initial-speed reversal is an ideal mechanics illustration, not a player test.",u:"https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law"},
 rv_x2fShape:{t:'EloShapes published X2F CrazyLight top/side SVG paths, recovered2026-11-05; fitted to maker87.5x61.1x31.6mm nominal axes. Top width fit -0.5932percent from source viewBox; not measured shell CAD.',u:'https://www.eloshapes.com/mouse/compare?p=pulsar-x2f-vs.-pulsar-x2f-crazylight'},
 rv_budget:{t:"Theseus target weight budget, research/data/weights.json and deck target data. Shell10.35g, single populated board5.6g are design targets, not prototype weighing.",u:""}
});
const rvi_mass=THESEUS.mass, rvi_dims=THESEUS.dims, rvi_vol=rvi_dims.reduce((a,b)=>a*b,1)/1000, rvi_rho=rvi_mass/rvi_vol;
/* EloShapes published vectors, independently recovered2026-11-05. The source viewBox is fitted to the maker nominal box; not measured shell CAD. */
const rvi_x2fSource={"source":"https://www.eloshapes.com/mouse/compare?p=pulsar-x2f-vs.-pulsar-x2f-crazylight","maker":"https://us.pulsar.gg/products/pulsar-lab-x2f-crazylight-gaming-mouse","verified":"2026-11-05","topD":"M0.4206827995301 0.0001382857142857 c-0.001524454726786 0.0001188571428571 -0.009112562352964 0.0006811428571429 -0.0168649922069 0.001251428571429 c-0.1300228098776 0.00956 -0.2366467853041 0.03636685714286 -0.2956173146819 0.07432457142857 c-0.009898380531233 0.006371428571429 -0.01757597055866 0.01854285714286 -0.0253967324281 0.04026628571429 c-0.002830897785067 0.007859428571429 -0.002196386212552 0.007610285714286 -0.01117228453451 0.004392 c-0.02029135469848 -0.007273142857143 -0.03249024641826 0.006705142857143 -0.03925836985842 0.044984 c-0.006533842244154 0.03695542857143 -0.01365013357282 0.16304 -0.01378679760382 0.2443051428571 l-1.138866925027e-05 0.006946285714286 l-0.003284817602327 0.001152 c-0.01644849230289 0.005769142857143 -0.01724244524491 0.01253485714286 -0.01334263950306 0.1134102857143 C0.00427075096885 0.5913028571429 0.003110733658073 0.5872114285714 0.01951692518946 0.5931428571429 l0.005440529996128 0.001968 l0.0004799510612613 0.0056 c0.0002651932982562 0.00308 0.0003741991325088 0.006942857142857 0.0002440429125057 0.008582857142857 l-0.0002407890070057 0.002979428571429 l-0.006865740605161 0.003022857142857 c-0.003776157332839 0.001661714285714 -0.008113613364441 0.003860571428571 -0.009636441138476 0.004888 c-0.005230653091373 0.003525714285714 -0.005035418761368 0.001420571428571 -0.003026132115071 0.03269257142857 c0.0009940681302734 0.01543885714286 0.003097718036073 0.04851885714286 0.00467586220361 0.07351085714286 c0.003950241277093 0.06257257142857 0.003481678885082 0.05985942857143 0.01131220247102 0.065536 l0.002505507235059 0.001817142857143 l-0.001498423482785 0.008845714285714 a5.312972019667 3.732110857143 0 0 1 -0.003979526426594 0.02255314285714 C0.00297569657982 0.9133645714286 0.002329796338055 0.9807817142857 0.01071836471725 0.9969028571429 c0.0009599021225226 0.001848 0.004788121943363 0.003098285714286 0.007610884964679 0.003098285714286 h0.00338894257833 c0.002329796338055 0 0.005870045522138 -0.0006765714285714 0.007570211145928 -0.001792 a0.02041988396573 0.014344 0 0 0 0.005630883467882 -0.006325714285714 c0.001361759451782 -0.003150857142857 0.002660067746313 -0.005857142857143 0.002882960273068 -0.006014857142857 c0.0005580447932631 -0.0003908571428571 0.9295561998288 -0.0003657142857143 0.9301126176694 2.628571428571e-05 c0.0002440429125057 0.0001714285714286 0.001504931293785 0.002851428571429 0.002801612635566 0.005954285714286 c0.001724569915041 0.004129142857143 0.002923634091819 0.006059428571429 0.004470866157105 0.007193142857143 l0.0001041249760024 7.657142857143e-05 a0.004073889686096 0.002861714285714 0 0 0 0.002941530572069 0.0008822857142857 h0.0126511845843 a0.003162796146074 0.002221714285714 0 0 0 0.002733280620064 -0.001102857142857 l0.0001464257475034 -0.000176 c0.003881909261591 -0.004676571428571 0.005455172570878 -0.01578742857143 0.006101072812643 -0.04309714285714 c0.0008818083905207 -0.03722628571429 -0.002440429125057 -0.07011771428571 -0.01315065907856 -0.1302285714286 c-0.004200792000599 -0.02358628571429 -0.007627154492179 -0.04470514285714 -0.009058872912213 -0.05585028571429 c-0.001607429317038 -0.01250628571429 -0.0003449139830081 -0.07198971428571 0.002928514950069 -0.1380994285714 c0.0006670506275157 -0.01347428571429 0.001176286838278 -0.02522857142857 0.003621596821585 -0.08377485714286 c0.005388467508127 -0.129008 0.001945835489046 -0.2746742857143 -0.008691181590704 -0.3675908571429 c-0.00552025068088 -0.04823428571429 -0.0190662592777 -0.06773714285714 -0.04146614474022 -0.05970742857143 c-0.008975898321961 0.003217142857143 -0.008341386749446 0.003467428571429 -0.01117065758176 -0.004392 c-0.004028335009095 -0.01118514285714 -0.01141632744702 -0.025984 -0.01651194346014 -0.03307428571429 c-0.004500151306606 -0.006259428571429 -0.03261877568552 -0.02179428571429 -0.05793253352336 -0.03200228571429 c-0.06188928261145 -0.02496228571429 -0.1458904800487 -0.04187428571429 -0.2458488300583 -0.049496 c-0.02627691386587 -0.002003428571429 -0.02329470947505 -0.004925714285714 -0.02302951617679 0.02254857142857 l0.000211503857505 0.021832 l-0.005396602271877 -0.0001428571428571 c-0.00723668583217 -0.0001908571428571 -0.007200892871669 -0.0001771428571429 -0.007200892871669 -0.00308 c0 -0.003866285714286 -0.0002245194795053 -0.003891428571429 -0.04210228326549 -0.004845714285714 l-0.01066304832375 -0.0002434285714286 v0.001236571428571 c0 0.00076 -0.0004164999040098 0.001236571428571 -0.001083550531525 0.001236571428571 c-0.000595464706514 0 -0.001083550531525 -0.0002285714285714 -0.001083550531525 -0.0005085714285714 c0 -0.000312 -0.003613462057835 -0.0005074285714286 -0.009395652131471 -0.0005074285714286 c-0.005782190073636 0 -0.009397279084221 0.0001942857142857 -0.009397279084221 0.0005074285714286 c0 0.0002788571428571 -0.0004880858250115 0.0005085714285714 -0.001083550531525 0.0005085714285714 c-0.0006621697692656 0 -0.001085177484276 -0.0004742857142857 -0.001085177484276 -0.001217142857143 v-0.001216 l-0.01065979441825 0.0002217142857143 c-0.04106754131647 0.0008537142857143 -0.04210391021824 0.0009714285714286 -0.04210391021824 0.004827428571429 c0 0.002904 3.741991325088e-05 0.002889142857143 -0.00722367021017 0.00308 l-0.005417752657627 0.0001428571428571 l0.000257058534506 -0.02190285714286 c0.0002928514950069 -0.02496228571429 0.000466935439261 -0.02420571428571 -0.005443783901628 -0.02374742857143 z","sideD":"M0.5124594285714 0 c-0.002235428571429 0.0001044303797468 -0.006929142857143 0.001794303797468 -0.01093942857143 0.004215189873418 c-0.02140571428571 0.01293037974684 -0.08885942857143 0.07883544303797 -0.1558125714286 0.1522341772152 l-0.004566857142857 0.005575949367089 a0.1301108571429 0.3602753164557 0 0 0 -0.05202285714286 -0.03016139240506 c-0.05552 0.0003544303797468 -0.1048411428571 0.09822784810127 -0.1228057142857 0.2436898734177 l-0.009769142857143 0.01193037974684 c-0.03482285714286 0.04589556962025 -0.09069142857143 0.1253797468354 -0.1334331428571 0.1898291139241 c-0.01849371428571 0.02788607594937 -0.020216 0.03108860759494 -0.02181257142857 0.04058860759494 c-0.005109714285714 0.03037974683544 0.005481142857143 0.05591772151899 0.021216 0.05115189873418 c0.002485714285714 -0.000753164556962 0.006961142857143 -0.001655063291139 0.009944 -0.002003164556962 l0.005424 -0.0006360759493671 v0.07353797468354 h0.04173485714286 l-0.000328 0.005825949367089 c-0.0001817142857143 0.00320253164557 -0.0004571428571429 0.04830379746835 -0.0006114285714286 0.1002246835443 l-0.0002811428571429 0.09439873417722 l-0.004870857142857 0.0002563291139241 c-0.026168 0.001424050632911 -0.02877714285714 0.002905063291139 -0.02574514285714 0.02035443037975 l0.005093714285714 0.02287974683544 a0.01224228571429 0.03389873417722 0 0 0 0.01042057142857 0.01610759493671 H0.9630971428571 c0.005427428571429 0 0.01314742857143 -0.008037974683544 0.01685714285714 -0.019 c0.010728 -0.03170253164557 0.01960457142857 -0.07167088607595 0.02004571428571 -0.1097784810127 c2.628571428571e-05 -0.03657594936709 -0.03067885714286 -0.3639398734177 -0.04254742857143 -0.4536044303797 c-0.01502857142857 -0.1135506329114 -0.04640342857143 -0.1831930379747 -0.09638171428571 -0.2139556962025 c-0.06688 -0.0411582278481 -0.1539702857143 -0.0363164556962 -0.2636114285714 0.01466772151899 l-0.009149714285714 0.004259493670886 h-0.04324342857143 l-0.01383428571429 -0.03826898734177 l-0.01383657142857 -0.03826582278481 l-2.4e-05 -0.06563291139241 c-2.514285714286e-05 -0.06521518987342 0.001794285714286 -0.08072784810127 -0.004910857142857 -0.08041455696203 z","topSourceSHA256":"dd28fcf9f0fc01e001af4c8968f426930c22ac31f4f870fdbe38e631b2ee2ad8","sideSourceSHA256":"eb19848fd2b846dafbffaeb7863e52470640969f9d9adf37f18365e909691e65","nominal":[61.1,87.5,31.6],"nominalWidthFitPercent":-0.5931869726639283};
const rvi_x2fTop=new Path2D(),rvi_x2fSide=new Path2D();
rvi_x2fTop.addPath(new Path2D(rvi_x2fSource.topD),new DOMMatrix([61.1,0,0,87.5,-30.55,-43.75]));
rvi_x2fSide.addPath(new Path2D(rvi_x2fSource.sideD),new DOMMatrix([87.5,0,0,31.6,-43.75,-31.6]));
function rvi_outline(cx,cy,length=119.3,width=62.4,s=3,col=C.ink,half=false) {
 G.save();G.translate(cx,cy);
 if(half){G.scale(width/61.1*s,length/87.5*s);G.strokeStyle=col;G.lineWidth=3/s;G.stroke(rvi_x2fTop);}
 else{G.scale(width/62.38*s,length/118.99*s);keyPath();G.strokeStyle=col;G.lineWidth=3/s;G.stroke();}
 G.restore();
}
function rvi_x2fSideView(cx,base,s,col=C.ink2){G.save();G.translate(cx,base);G.scale(s,s);G.strokeStyle=col;G.lineWidth=2/s;G.stroke(rvi_x2fSide);G.restore();}
/* Draw a real geometric path progressively, not a changing-opacity decoration. */
function rvi_path(points,k,col=C.hero,w=3){
 const lengths=[0];for(let i=1;i<points.length;i++)lengths.push(lengths[i-1]+Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]));
 const d=clamp(k)*lengths[lengths.length-1],out=[points[0]];let end=points[0];
 for(let i=1;i<points.length;i++){if(d>=lengths[i]){out.push(points[i]);end=points[i];}else{const f=clamp((d-lengths[i-1])/(lengths[i]-lengths[i-1]||1));end=[lerp(points[i-1][0],points[i][0],f),lerp(points[i-1][1],points[i][1],f)];out.push(end);break;}}
 if(k>0)rvLine(out,col,w);return end;
}
function rvi_dim(x,y,x2,y2,label,col=C.mute){
 rvLine([[x,y],[x2,y2]],col,1.8);
 const dx=x2-x,dy=y2-y,l=Math.hypot(dx,dy),nx=-dy/l*6,ny=dx/l*6;
 rvLine([[x+nx,y+ny],[x-nx,y-ny]],col,1.8);rvLine([[x2+nx,y2+ny],[x2-nx,y2-ny]],col,1.8);
 rvTxt(label,(x+x2)/2+(!dx?16:0),(y+y2)/2+(!dy?30:0),22,{align:!dy?'center':'left',color:col});
}
function rvi_marker(x,y,col=C.hero,open=false,r=7){rvCircle(x,y,r,open?C.bg:col,col,2);}
RV.add({id:'rv_cover',ch:'intro',theme:'paper',title:'Zero compromises.',settle:16,
 from:['cover','targets','targets2','ntr_stats'],feedback:['F27','F32','F33'],src:['rv_targets','exPiaknow','exXbabWeight'],
 draw:t=>{
  rvHeader(t,'ZERO COMPROMISES.','A mouse should disappear in your hand. Its compromises should not.',{kicker:'IN PURSUIT OF AN OBJECTIVELY BETTER MOUSE'});
  const word=rvEase(t,.15,1.5),numbers=rvEase(t,1.0,3.4);
  G.save();G.translate(0,18*(1-word));G.beginPath();G.rect(60,286,1805,285);G.clip();rvNum('THESEUS',63,548,247,{maxW:1780});G.restore();
  rvLine([[80,606],[1840,606]],C.hair,2);
  rvLabel('FULL-SIZE WIRELESS',80,664,{size:25,color:C.heroText});
  rvNum((rvi_mass*numbers).toFixed(2)+'g',80,790,112);
  rvTxt('design mass target',80,837,28,{color:C.mute});
  rvNum((rvi_rho*numbers).toFixed(3),790,790,112);
  rvTxt('g/cm³, bounding-box target',790,837,28,{color:C.mute});
  rvNum('$'+Math.round(THESEUS.price*numbers),1475,790,112);
  rvTxt('proposed price',1475,837,28,{color:C.mute});
  rvWin("PIAKNOW'S BENCHMARK. OUR WIRELESS AMBITION.",'Dual 8khz wired and wireless. A reason for every part. Proof where it exists; honest targets where it does not.');
  rvFoot('Theseus: design targets, not prototype measurements. 0.099 = 29.31g ÷ 297.0cm³ bounding box. Benchmark data: Piaknow; not a Theseus test.');
 }});
RV.add({id:'rv_tradeoffs',ch:'intro',theme:'night',title:'Flagships still ask you to choose.',settle:18,
 from:['flagships','market','pricefront'],feedback:['F27','F33.7'],src:['rv_logiX3','rv_logiX3Launch','rv_razerVmse','rv_zaunM3k','rv_slxPdf','rv_slxReview','rv_gwHtx','rv_pulsarX2f','rv_targets'],
 draw:t=>{
  rvHeader(t,'FLAGSHIPS STILL ASK YOU TO CHOOSE.','Less weight. More battery. A full shape. Why should one have to pay for the others?',{size:62});
  const x0=136,y0=750,w=875,h=365,X=p=>x0+(p-100)/340*w,Y=g=>y0-(g-20)/50*h;
  rvLabel('BODY MASS, LOWER IS LIGHTER',126,317);
  [20,40,60].forEach(g=>{rvLine([[x0,Y(g)],[x0+w,Y(g)]],C.hair,1);rvTxt(g+'g',x0-20,Y(g)+8,22,{align:'right',color:C.mute});});
  [150,250,350].forEach(p=>rvTxt('$'+p,X(p),y0+42,23,{align:'center',color:C.mute}));
  rvLine([[x0,y0],[x0+w,y0]],C.mute,2);
  rvLabel('USD, PRICE BASIS DIFFERS',x0+w,y0+86,{align:'right',size:20});
  /* C1 monotone visual guide through the actual non-dominated shipping points.
     Wired M3K stays identified; curve is not an assertion that intermediate products exist. */
  const frontier=[{p:149.95,g:29.5},{p:159,g:26.9},{p:396,g:24}].map(p=>({x:X(p.p),y:Y(p.g)}));
  const h0=frontier[1].x-frontier[0].x,h1=frontier[2].x-frontier[1].x;
  const d0=(frontier[1].y-frontier[0].y)/h0,d1=(frontier[2].y-frontier[1].y)/h1;
  const tangent=(3*(h0+h1))/((2*h1+h0)/d0+(h1+2*h0)/d1);
  G.save();G.beginPath();G.rect(x0-3,300,(w+6)*rvEase(t,1,4.6),525);G.clip();G.strokeStyle=C.mute;G.globalAlpha=.55;G.lineWidth=2.3;G.beginPath();
  G.moveTo(frontier[0].x,frontier[0].y);
  G.bezierCurveTo(frontier[0].x+h0/3,frontier[0].y+d0*h0/3,frontier[1].x-h0/3,frontier[1].y-tangent*h0/3,frontier[1].x,frontier[1].y);
  G.bezierCurveTo(frontier[1].x+h1/3,frontier[1].y+tangent*h1/3,frontier[2].x-h1/3,frontier[2].y-d1*h1/3,frontier[2].x,frontier[2].y);G.stroke();G.restore();
  rvTxt('Shipping price/mass guide, wired included',136,361,22,{color:C.mute});
  const pts=[
   {n:'X2F',p:149.95,g:29.5,dx:-20,dy:-25,ev:'sample'},
   {n:'HTX Mini',p:159,g:26.9,dx:18,dy:35,ev:'maker'},
   {n:'SLX',p:179,g:41.58,dx:12,dy:32,ev:'sample'},
   {n:'X3 SUPERSTRIKE',p:199.99,g:59,dx:14,dy:-14,ev:'maker'},
   {n:'VIPER MINI SE',p:279.99,g:49,dx:12,dy:-18,ev:'launch'},
   {n:'M3K, WIRED',p:396,g:24,dx:-10,dy:-24,ev:'FX*'},
   {n:'THESEUS TARGET',p:189,g:rvi_mass,dx:15,dy:-38,hero:true}
  ];
  const beat=Math.min(4,Math.max(0,Math.floor((t-1.5)/3.1))),visit=[3,4,5,1,6][beat],within=clamp((t-(1.5+beat*3.1))/.85);
  pts.forEach((p,i)=>{const x=X(p.p),y=Y(p.g);rvi_marker(x,y,p.hero?C.heroText:C.ink2,p.hero||p.ev==='FX*',p.hero?11:7);rvTxt(p.n,x+p.dx,y+p.dy,p.hero?25:22,{color:p.hero?C.heroText:C.ink2,align:p.n.includes('M3K')?'right':'left',weight:p.hero?800:600});if(i===visit&&t>1.5)rvCircle(x,y,18,null,C.hero,2.5);});
  rvLabel('THE TRADE-OFF YOU CAN FEEL',1120,317);
  const rows=[
   ['X3 SUPERSTRIKE','59.0g, 135+h','Tunable analog clicks; more mass.'],
   ['VIPER MINI SE','49.0g, up to 60h','Magnesium; $279.99 launch MSRP.'],
   ['M3K','24.0g, no battery','A fingertip shape—and a cable.'],
   ['G-WOLVES HTX MINI','26.9g, about 80h','Already lighter. A real rival.']
  ];
  rows.forEach((r,i)=>{const y=375+i*108;if(i===beat&&t>1.5)rvRect(1101,y-32,755,90,C.panel,4);rvTxt(r[0],1120,y,26,{weight:800,color:i===3?C.secondText:C.ink});rvTxt(r[1],1840,y,26,{align:'right',color:C.secondText,weight:750});rvBody(r[2],1120,y+39,720,{size:27});if(i<3)rvLine([[1120,y+67],[1840,y+67]],C.hair,1);});
  if(t>1.5){const p=pts[visit],yy=beat<4?375+beat*108:847,route=[[X(p.p),Y(p.g)],[1046,Y(p.g)],[1070,yy],[1090,yy]];const q=rvi_path(route,within,C.hero,2.5);rvCursor(t,q[0]-10,q[1]+9,within<.12?1:0);}
  rvWin('The target is the whole package.','29.31g  /  a complete shape  /  200h at 1khz  /  $189. All proposed—not four separately proven achievements.');
  rvFoot('Maker runtime, not matched tests. X2F/SLX are samples; others maker mass. M3K maker US$396≈€340, FX date unspecified. Curve is a smooth visual guide through non-dominated plotted products, not intermediate products. Price bases differ.');
 }});
RV.add({id:'rv_density',ch:'intro',theme:'paper',title:"Less mouse isn't the only way.",settle:17,
 from:['ntr_density','ntr_sizewt'],feedback:['F27','F33.3'],src:['rv_pulsarX2f','rv_x2fScale','rv_x2fShape','rv_targets','ntrSwi'],
 draw:t=>{
  rvHeader(t,"LESS MOUSE ISN'T THE ONLY WAY.",'A low weight can come from deleting the part your hand rests on. We want to keep the shape.');
  const grow=rvEase(t,4.3,6.4),box=rvEase(t,7.5,9.6),calc=rvEase(t,10.2,11.5),cy=529,s=2.65;
  const shapes=[{cx:420,L:87.5,W:61.1,H:31.6,m:29.5,rho:.175,col:C.ink2,half:true},{cx:1320,L:lerp(87.5,119.3,grow),W:lerp(61.1,62.4,grow),H:lerp(31.6,39.9,grow),m:rvi_mass,rho:rvi_rho,col:C.hero,half:false}];
  rvLabel('PULSAR X2F CRAZYLIGHT',80,312);rvLabel('THESEUS, FULL-SIZE TARGET',1040,312,{color:C.heroText});
  shapes.forEach((p,i)=>{
   const w=p.W*s,h=p.L*s,x=p.cx-w/2,y=cy-h/2,depth=p.H*.7*box;
   if(!i||t>4.2){rvi_outline(p.cx,cy,p.L,p.W,s,p.col,p.half);}
   const rect=[[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]];
   if(box>0){rvi_path(rect,box,p.col,1.8);rvLine([[x,y],[x+depth,y-depth],[x+w+depth,y-depth],[x+w,y]],C.mute,1.2,box);rvLine([[x+w+depth,y-depth],[x+w+depth,y+h-depth],[x+w,y+h]],C.mute,1.2,box);}
   rvi_dim(x,y-48,x+w,y-48,p.W.toFixed(1)+'mm wide',i?C.heroText:C.mute);
   rvTxt(p.L.toFixed(1)+'mm',p.cx+133,i?cy-93:cy+3,25,{color:i?C.heroText:C.mute});
   rvTxt((i?'39.9':'31.6')+'mm high',p.cx+133,i?cy-49:cy+45,23,{color:C.mute,alpha:box});
   rvNum(p.m.toFixed(1)+'g',p.cx,765,67,{align:'center',color:i?C.heroText:C.ink2,grad:i?C.heroGrad:null});
   rvTxt(i?'design target':'owner sample / four dots',p.cx,807,24,{align:'center',color:C.mute});
   if(calc>0){const vol=p.L*p.W*p.H/1000;rvTxt(p.m.toFixed(1)+'g ÷ '+vol.toFixed(1)+'cm³',p.cx,841,25,{align:'center',color:C.mute,alpha:calc});rvNum(p.rho.toFixed(3),i?1740:80,566,66,{align:i?'right':'left',color:i?C.heroText:C.ink2,grad:null,alpha:calc});rvTxt('g/cm³'+(i?' target':''),i?1740:80,606,23,{align:i?'right':'left',color:C.mute,alpha:calc});}
  });
  if(t<7.5){const q=rvEase(t,1.8,3);rvLine([[420,643],[420,676],[680,676]],C.mute,2,q);rvBody('The rear is gone. The weight is not.',600,713,350,{size:27,color:C.mute,alpha:q});}
  rvi_x2fSideView(198,700,1.7);rvTxt('published side outline',198,731,20,{align:'center',color:C.mute});
  rvArrow([796,527],[1004,527],C.hero,3);rvTxt('KEEP THE',900,475,27,{align:'center',weight:800,color:C.heroText});rvTxt('HAND SUPPORT',900,586,25,{align:'center',color:C.mute});
  rvWin('Low mass without shrinking the hand support.','Density here = grams ÷ bounding-box cm³. It explains size for weight—not comfort, strength or proven aim.');
  rvFoot('X2F: EloShapes top/side vectors, fitted0.59% in width to maker nominal box, not measured CAD. Boxes: Theseus297.0cm³ / X2F168.9cm³. X2F29±2g official /29.5g sample. Density does not establish fit or strength.');
 }});
RV.add({id:'rv_density_rank',ch:'intro',theme:'night',title:'Keep the rivals that beat the story.',settle:17,
 from:['ntr_densrank'],feedback:['F27','F33.7'],src:['rv_gwHtx','rv_eloHtx','rv_gwHts','rv_eloHts','rv_gwHtr','rv_eloHtr','rv_gwHsk','rv_eloHsk','rv_pulsarX2f','rv_x2fScale','rv_razerVmse','rv_targets','exXbabWeight'],
 draw:t=>{
  rvHeader(t,'KEEP THE RIVALS THAT BEAT THE STORY.','G-Wolves already makes mice lighter than our target. A fair comparison leaves them in.',{size:62});
  rvLabel('WIRELESS, LOWER BOUNDING-BOX DENSITY IS LIGHTER FOR ITS SIZE',80,306,{size:24});
  rvLabel('MASS',1625,306,{align:'right'});rvLabel('g/cm³',1840,306,{align:'right',size:24});
  const items=[{n:'Theseus, target',g:rvi_mass,rho:rvi_rho,e:'proposal',hero:true},...rvi_evidence.mice.filter(m=>m.bounding_box_density_g_cm3).map(m=>({n:m.name.replace('G-Wolves ','G-Wolves ').replace('Pulsar X2F CrazyLight','Pulsar X2F CrazyLight').replace('Razer Viper Mini Signature Edition','Razer Viper Mini SE'),g:(m.weight_measured_g||m.weight_g).value,rho:m.bounding_box_density_g_cm3.value,e:m.weight_measured_g?'owner sample':'maker'}))].sort((a,b)=>a.rho-b.rho);
  items.forEach((p,i)=>{const y=368+i*63,w=700*p.rho/.23,k=rvEase(t,.8+i*.10,2.0+i*.10),col=p.hero?C.heroText:C.ink2;
   rvTxt(p.n,80,y,27,{color:col,weight:p.hero?800:650});
   rvRect(710,y-20,700,16,C.track,8);rvRect(710,y-20,w*k,16,col,8);
   rvTxt(p.g.toFixed(1)+'g',1625,y,29,{align:'right',color:col,weight:700});rvTxt(p.rho.toFixed(3),1840,y,33,{align:'right',color:col,weight:800});
   rvTxt(p.e,710,y+24,19,{color:C.mute});
  });
  rvLine([[80,800],[1840,800]],C.hair,1);rvTxt('UNRANKED: XBAB XA25, 25.0g, WIRED',80,827,24,{color:C.mute});rvTxt('Selected comparison, not the whole market.',1840,827,23,{align:'right',color:C.mute});
  rvWin('Lightest is not the same as lowest density.','Theseus targets a full shape at low mass. Competitors remain real options—not straw men.');
  rvFoot('Derived proxy: g/(L×W×H/1000). Maker dimensions/weights except X2F owner sample. HTX26.9g; HTR25.3g official variants; EloShapes alternatives in sources.');
 }});
RV.add({id:'rv_inertia',ch:'intro',theme:'paper',title:'The part you have to stop.',settle:16,
 from:['zerograms','targets2'],feedback:['F27','F33.6'],src:['rv_force','exZk','exYan','rv_slxReview','rv_targets'],
 draw:t=>{
  rvHeader(t,'THE PART YOU HAVE TO STOP.','Target changes begin by cancelling the motion you already have. Less mass means less momentum to reverse.');
  const rows=[{n:'STARLIGHT X',m:41.58,col:C.ink2,y:424},{n:'THESEUS TARGET',m:rvi_mass,col:C.hero,y:650}];
  /* One shared physical clock. x=x0+v0*t-F*t²/(2m), v=v0-F*t/m.
     Presentation time is 40x slower; both bodies receive the same force from the same instant. */
  const v0=1.25,F=.5,tau=clamp((t-2)/40,0,.24),xStart=1110,pxPerM=1800;
  rvLabel('NEW TARGET',625,303,{align:'center',color:C.heroText});
  rvLine([[625,330],[625,719]],C.hair,1.5,1,[5,7]);
  rvLabel('SAME 0.5 N LEFTWARD FORCE',1230,303,{align:'center'});
  rows.forEach(p=>{
   const mass=p.m/1000,reversal=2*mass*v0/F,stop=mass*v0/F;
   const xx=xStart+(v0*tau-F*tau*tau/(2*mass))*pxPerM,velocity=v0-F*tau/mass;
   rvLabel(p.n,80,p.y-55,{color:p.col});rvNum(p.m.toFixed(1)+'g',80,p.y+30,76,{color:p.col,grad:null});
   rvLine([[560,p.y+60],[1500,p.y+60]],C.hair,2);
   rvSmallShot(625,p.y,22,C.hero);
   rvLine([[xStart,p.y-62],[xStart,p.y+60]],C.faint,1.4,1,[5,6]);
   const stopX=xStart+v0*stop/2*pxPerM;
   rvLine([[xStart,p.y+60],[stopX,p.y+60]],C.mute,4);
   if(tau>stop)rvLine([[stopX,p.y+60],[xx,p.y+60]],p.col,4);
   rvi_outline(xx,p.y,119.3,62.4,.83,p.col);
   rvArrow([xx-15,p.y-72],[xx-115,p.y-72],p.col,4);
   if(Math.abs(velocity)>.035)rvArrow([xx,p.y+101],[xx+velocity*91,p.y+101],p.col,4);
   rvTxt(velocity>0.04?'still moving right':velocity<-.04?'now moving left':'momentarily stopped',860,p.y+114,25,{align:'right',color:velocity<=0?C.heroText:C.mute});
   rvTxt((reversal*1000).toFixed(0)+' ms',1790,p.y+10,46,{align:'right',color:p.col,weight:800});rvTxt('ideal reversal',1790,p.y+44,23,{align:'right',color:C.mute});
  });
  rvTxt('F = m × a',80,819,44,{weight:800,color:C.ink});
  const tx=675,tw0=790,mark=ms=>tx+tw0*ms/240;
  rvLine([[tx,804],[tx+tw0,804]],C.hair,3);
  rvLine([[tx,804],[mark(tau*1000),804]],C.ink2,3);
  [0,100,200].forEach(ms=>rvTxt(ms+'ms',mark(ms),844,21,{align:'center',color:C.mute}));
  rows.forEach((p,i)=>{const ms=2*(p.m/1000)*v0/F*1000,x=mark(ms);rvLine([[x,781],[x,816]],p.col,3);rvTxt(Math.round(ms)+'ms',x,775-i*30,23,{align:'center',color:p.col,weight:750});});
  rvTxt('1.25m/s initial speed / 40× slow motion',1515,815,23,{color:C.mute,maxW:320});
  rvWin('Less inertia. More room for your corrections.','This is a mechanics illustration—not a promise of faster aim. “Zero grams” is the ideal limit, not a research result.');
  rvFoot('Ideal reversal time=2mv/F. Hand mass, friction, force variation and skill excluded. Studies cited here did not test a 29g mouse; no universal optimal mass established.');
 }});
RV.add({id:'rv_weight_truth',ch:'intro',theme:'night',title:'A weight you can actually buy.',settle:18,
 from:['weightgap','thesis','budget','targets2'],feedback:['F27','F33.7'],src:['rv_slxPdf','rv_slxReview','rv_pulsarX2f','rv_x2fScale','rv_targets','rv_budget'],
 draw:t=>{
  rvHeader(t,'A WEIGHT YOU CAN ACTUALLY BUY.','A headline weight is useful only when it describes the mouse that arrives on your desk.');
  rvLabel('STARLIGHT X, RATED vs ONE REVIEW SAMPLE',80,316);
  const load=rvEase(t,2,4.5),gap=rvEase(t,5.5,8),tilt=.085*gap;
  rvTxt('38.0g',80,413,62,{color:C.mute,weight:750});rvTxt('maker rated',80,455,26,{color:C.mute});
  rvTxt('41.6g',80,546,62,{color:C.ink,weight:800});rvTxt('one measured sample',80,588,26,{color:C.mute});
  const pivot=[834,451],left=[pivot[0]-210*Math.cos(tilt),pivot[1]-210*Math.sin(tilt)],right=[pivot[0]+210*Math.cos(tilt),pivot[1]+210*Math.sin(tilt)];
  rvLine([[834,451],[834,582],[733,582],[935,582]],C.mute,8);
  rvLine([left,right],C.ink2,7);
  [left,right].forEach(p=>{rvLine([[p[0],p[1]],[p[0]-92,p[1]+87],[p[0]+92,p[1]+87],[p[0],p[1]]],C.mute,2);rvLine([[p[0]-92,p[1]+87],[p[0]+92,p[1]+87]],C.ink2,5);});
  rvRect(left[0]-39,left[1]+20,78,60,C.track,4,C.mute,2);rvTxt('38.0',left[0],left[1]+63,25,{align:'center',color:C.ink2,weight:750});
  const drop=lerp(-97,0,load);rvi_outline(right[0],right[1]+31+drop,119.3,62.4,.8,C.ink2);rvLine([[right[0]-20,right[1]+80+drop],[right[0]+20,right[1]+80+drop]],C.ink2,3);
  rvTxt('rated reference',left[0],365,24,{align:'center',color:C.mute});rvTxt('review sample',right[0],365,24,{align:'center',color:C.mute});
  rvNum('+'+(9.421*gap).toFixed(1)+'%',1510,468,100,{align:'center'});rvTxt('sample vs rated',1510,512,26,{align:'center',color:C.mute});
  rvTxt('+3.6g on this sample',1510,567,30,{align:'center',color:C.heroText,weight:750});
  rvLine([[80,616],[1840,616]],C.hair,2);
  rvLabel('THESEUS, DESIGN BUDGET',80,665,{color:C.heroText});
  rvNum(rvi_mass.toFixed(2)+'g',80,782,114);rvTxt('29.5% less than the SLX sample',80,828,30,{color:C.heroText});
  rvLabel(ntr_budget().shell.toFixed(2)+'g',945,708,{size:34,color:C.heroText});rvTxt('shell + skates target',945,749,27,{color:C.mute});
  rvLabel(THESEUS.hours+'h',1290,708,{size:34,color:C.heroText});rvTxt('at 1khz, target',1290,749,27,{color:C.mute});
  rvLabel('EVERY UNIT',1625,708,{size:29,color:C.heroText});rvBody('weighed before shipping, proposed',1625,749,215,{size:25});
  rvWin('The commitment: show the finished weight.','A stated tolerance, a defined skate/battery configuration, and your unit’s mass—not a convenient bare-shell figure.');
  rvFoot('SLX38g maker / Back2Gaming41.58g sample. Balance motion illustrates the difference, not a new weighing test. X2F29±2g /29.5g sample is within tolerance. Theseus remains targets; 8khz runtime unknown.');
 }});

