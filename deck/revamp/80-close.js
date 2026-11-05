/* Close the weight budget without deleting the battery, the full shape, or service hardware. */
RV.add({id:'rv_close',ch:'end',theme:'paper',title:'Zero compromises.',settle:18,
 from:['close','ntr_stats','targets','targets2'],feedback:['F2.28','F12.2','F12.11','F27','F32','F33.6','F33.7','C5'],src:['rv_targets','rv_budget'],
 draw:t=>{
  rvHeader(t,'ZERO COMPROMISES.','Less weight should never mean less mouse.',{kicker:'THESEUS: OPTIMIZATION OVER OPINION'});
  const B=ntr_budget(),rows=[['Shell + skates',B.shell],['Battery',B.cell.g],['Board',THESEUS.pcb],['Everything else',29.31-B.shell-B.cell.g-THESEUS.pcb]],ph=rows.map((r,i)=>rvstP(t,1+i*1.15,3.6+i*1.15)),total=rows.reduce((s,r,i)=>s+r[1]*ph[i],0),k=rvstP(t,7.4,10.5);
  rvLabel('29.31 g / COMPLETE DESIGN TARGET',84,330,{color:C.heroText,size:24});rvNum(total.toFixed(2),70,537,190);rvTxt('g',674,529,74,{weight:800,color:C.heroText});
  rvTxt('$189',1816,530,126,{font:'disp',weight:800,align:'right',color:C.heroText});rvLabel('PROPOSED PRICE',1816,583,{align:'right',size:24});
  let x=84;rows.forEach((r,i)=>{const ww=r[1]/29.31*1030,px=lerp(84+i*270,x,ph[i]),py=lerp(633+i*16,606,ph[i]);rvRect(px,py,ww-4,24,i===0?C.hero:i===1?C.ink2:i===2?C.mute:C.faint,2);rvTxt(r[0],x,py-12,21,{color:C.mute});x+=ww;});
  rvLabel('BATTERY. FULL-SIZE SHAPE. SERVICEABLE HARDWARE.',1220,674,{size:19,color:C.ink2});
  rvLine([[84,716],[1838,716]],C.hair,2);rvNum((.098688*k).toFixed(3),80,790,80);rvTxt('g/cm³',355,788,31,{color:C.heroText});rvLabel('FULL-SIZE DENSITY',82,839,{size:22});rvNum(Math.round(200*k)+' h',780,790,80);rvLabel('AT 1khz TARGET',783,839,{size:22});rvTxt('Dual 8khz',1830,787,70,{font:'disp',weight:800,align:'right',color:C.heroText});rvLabel('WIRED AND WIRELESS',1830,839,{align:'right',size:22});
  rvWin('More room for your skill. Less room for hardware excuses.','A reason for every part; from the click under your finger to the thread you open years later.',{size:41});
  rvFoot('Concept targets, not verified prototype performance. Weight assembly uses the design budget, not a weighing. Density29.31g÷297.0cm³;200 h at1khz, not8khz. Proposed price$189.');
  rvstReport('rv_close',t,{phase:t<7.1?'assemble-complete-weight-budget':'hold-whole-product-targets',componentProgress:ph,assembledTargetG:total,completeTargetG:29.31,budgetComponentsG:rows.map(r=>r[1]),targetRuntimeHours:200,priceUSD:189});
 }});
