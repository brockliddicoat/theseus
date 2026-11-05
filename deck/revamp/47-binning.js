/* F27.clk_switch2: keep the useful binning idea, lose the premature SKU-selection slide. */
RV.add({id:'rv_binning',ch:'click',theme:'night',title:'Provable switch binning',settle:20,after:'rv_spdt',
 from:['clk_switch2'],feedback:['F27','F31.3'],src:['clk_gt01','clk_brock'],
 draw:t=>{
  rvHeader(t,'PROVABLE SWITCH BINNING','Two switches can pass the same label and still feel different. The useful promise is a pair you can check.');
  const down=rvqLoad(t,1.6,3.7,5,6.6),trace=rvEase(t,2,6.6),match=rvEase(t,8,11.2),record=rvEase(t,11,13.5);
  rvLabel('MEASURE THE SWITCH, THEN MATCH THE PAIR',100,316);
  const anchors=rvPart(266,660,22,()=>swMM({clear:true,press:down,glow:false,accent:C.hero}));
  const pl=anchors.plunger;
  rvRect(pl[0]-17,pl[1]-98,34,72,C.comp,3);rvLine([[pl[0],pl[1]-25],[pl[0],pl[1]-4]],C.hero,7);
  rvRect(pl[0]-75,pl[1]-155,150,40,C.panel,4,C.mute,1.5);rvTxt('force',pl[0],pl[1]-127,25,{align:'center',color:C.ink2});
  rvRect(242,752,350,14,C.comp,3);
  rvCursor(t,pl[0]+35,pl[1]-120,down);
  const ox=1040,oy=620,w=685,h=245;
  rvLabel('PAIR RESPONSE, EXPLANATORY CURVES',ox,316,{color:C.mute});
  rvLine([[ox,350],[ox,oy],[ox+w,oy]],C.faint,2);rvLabel('FORCE',ox+8,350,{size:21});rvLabel('TRAVEL',ox+w,oy+40,{align:'right',size:21});
  const curve=(spread,col,a,progress=1)=>{
   const pts=[];for(let i=0;i<=100*progress;i++){
    const u=i/100,peak=.48+spread,base=u<peak?.12+u*.92:.26+(u-peak)*.34;
    pts.push([ox+w*u,oy-h*(base+spread*.6)]);
   }rvLine(pts,col,3,a);
  };
  curve(-.12,C.comp,.7,trace);curve(.12,C.comp,.7,trace);
  if(match>0){curve(-.009,C.hero,match,match);curve(.009,C.heroText,match,match);}
  rvLabel('SAME LABEL',ox,708);rvLabel('PUBLISHED PAIR',ox+390,708,{color:C.heroText,alpha:match});
  const rows=['Raw force and travel','Actual bin limits','Left/right matching','Tester settings'];
  rows.forEach((s,i)=>{const x=1030+(i%2)*390,y=766+Math.floor(i/2)*53;rvTxt(s,x,y,25,{color:record>.95?C.ink2:C.mute});if(record>i*.22)rvLine([[x-24,y-8],[x-18,y-1],[x-7,y-15]],C.hero,2.5);});
  rvLabel('TEST-RIG PROPOSAL',100,799,{color:C.heroText});
  rvWin('Publish the match, not just the word “binned”.','The switch SKU can change. The test standard should stay clear: measure the actuation, match the pair, keep the record.');
  rvFoot('Curves illustrate the proposed test, not measured Theseus batches. A Hall-based travel gauge is a tester option; the product clicks remain mechanical SPDT.');
 }});
