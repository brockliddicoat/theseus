/* Deterministic causal-state checks plus actual transition images. No new empirical claims. */
const {chromium}=require('playwright');
const {pageUrl}=require('./serve.js');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const plans={
 rv_thin_wall:[0,2.8,6,10.8,18],rv_specific:[0,2.2,6,18],
 rv_hotspots:[0,3,6,9,14,22],rv_triangles:[0,3,7,13,21],
 rv_light_structure:[0,3,7,12.6,21],rv_arches:[0,2.2,4.65,6.2,10.5,15,22],
 rv_fibres_fillets:[0,3,7,13,23],rv_whole_pcb:[0,2.9,7,10,14,23],
 rv_coating:[0,3.5,7,11,15,23],rv_grip:[0,3,6.5,11,22],
 rv_wheel:[0,2,5.8,8.6,13,22],rv_inserts:[0,4.8,7,10.8,13,21],
 rv_screws:[0,2,5.7,8,12,21],rv_repair:[0,3,8.2,11.2,15,18.5,19.5,24],
 rv_close:[0,2.8,5.2,9,18]
};
const near=(a,b,eps=1e-8)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
const finite=x=>{if(typeof x==='number')assert.ok(Number.isFinite(x),'non-finite state');else if(x&&typeof x==='object')Object.values(x).forEach(finite);};
(async()=>{
 const file=process.argv[2]||'deck/dist/motion-structure.html',out=path.resolve(process.argv[3]||'deck/qa/structure-motion-recheck'),browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}),p=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];
 fs.mkdirSync(out,{recursive:true});
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('Failed to load resource'))errors.push(m.text());});
 const bytes=fs.readFileSync(file),snap=path.join(out,'motion-tested.html');fs.writeFileSync(snap,bytes);
 await p.goto((await pageUrl(snap))+'?cap=1&qa=1&2d=1&t=0',{waitUntil:'domcontentloaded',timeout:120000});await p.waitForFunction('window.__ready===true');
 const result={htmlSha256:crypto.createHash('sha256').update(bytes).digest('hex'),at:new Date().toISOString(),frames:[],assertions:[]};
 const states={};
 for(const [id,times] of Object.entries(plans)){
  states[id]=[];
  for(const t of times){
   const s=await p.evaluate(({id,t})=>{APP.i=DECK.slides.findIndex(s=>s.id===id);APP.frozenT=t;APP.trStart=-1;frame();return {state:window.__structureMotion[id],title:DECK.slides[APP.i].title,text:QA.text.map(x=>x.s)};},{id,t});
   finite(s.state);assert.ok(s.text.some(x=>x.toUpperCase()===s.title.toUpperCase()),`${id} missing full header at ${t}`);
   const name=`motion_${id}_${String(t).replace('.','-')}.png`;const img=await p.screenshot({path:path.join(out,name)});result.frames.push({id,t,image:name,state:s.state,sha256:crypto.createHash('sha256').update(img).digest('hex')});states[id].push(s.state);
  }
  assert.ok(new Set(result.frames.filter(f=>f.id===id).map(f=>f.sha256)).size>=3,`${id} does not change across its event frames`);
 }
 const end=id=>states[id].at(-1),at=(id,t)=>states[id].find(s=>s.t===t),all=(id,fn)=>states[id].forEach(fn),check=(name,fn)=>{fn();result.assertions.push({name,pass:true});};
 check('ruler: mass conserved, 90-degree turn happens unloaded, reload is identical10N',()=>{all('rv_thin_wall',s=>near(s.massBefore,s.massAfter));near(at('rv_thin_wall',6).loadN,0);assert.ok(at('rv_thin_wall',6).angleDeg>0&&at('rv_thin_wall',6).angleDeg<90);near(end('rv_thin_wall').angleDeg,90);near(end('rv_thin_wall').loadN,10);});
 check('six material beams each carry2g and receive the same10N',()=>{all('rv_specific',s=>s.beams.forEach(b=>near(b.massG,2)));near(end('rv_specific').loadN,10);});
 check('three stress-path models have equal total mass',()=>all('rv_hotspots',s=>s.massesG.forEach(g=>near(g,s.massesG[0]))));
 check('straw rack conserves side length and inserts a brace before the final load',()=>{all('rv_triangles',s=>{near(s.strawSidePx,s.strawMeasuredSidePx);near(s.strawWidthPx,s.strawSidePx);});near(at('rv_triangles',3).rackPx,115);near(end('rv_triangles').braceInsertion,1);near(end('rv_triangles').loadN,10);});
 check('declining mass stays equal in both FE panels and makes the stiffness gap larger',()=>{all('rv_light_structure',s=>near(s.triangleMassG,s.hexMassG,1e-7));assert.ok(end('rv_light_structure').massG<at('rv_light_structure',3).massG);assert.ok(end('rv_light_structure').stiffnessRatio>at('rv_light_structure',3).stiffnessRatio*5);near(end('rv_light_structure').loadN,10);});
 check('chain inverts180degrees; FE arch and flat strip have equal mass at equal force',()=>{near(end('rv_arches').chainTurnDeg,180);all('rv_arches',s=>{near(s.flatMassG,s.archMassG);assert.ok(s.chainYBounds[0]>=320&&s.chainYBounds[1]<=810);});assert.ok(end('rv_arches').archDeflectionMm<end('rv_arches').flatDeflectionMm);near(end('rv_arches').loadN,10);});
 check('fillet grows before the circular cutter finishes its path',()=>{near(at('rv_fibres_fillets',0).radiusMm,.05);near(end('rv_fibres_fillets').radiusMm,.75);near(end('rv_fibres_fillets').cutterProgress,1);});
 check('the already-budgeted board moves while unloaded, then joins before reloading',()=>{all('rv_whole_pcb',s=>{near(s.boardBudgetG,5.6);near(s.extraReinforcementParts,0);});near(at('rv_whole_pcb',7).loadN,0);assert.ok(at('rv_whole_pcb',7).boardMove>0&&at('rv_whole_pcb',7).boardMove<1);near(end('rv_whole_pcb').connection,1);near(end('rv_whole_pcb').loadN,10);});
 check('blast precedes coating, coating precedes oven, transfer precedes cure',()=>all('rv_coating',s=>{if(s.coatingProgress>0)near(s.blastProgress,1);if(s.ovenTransfer>0)near(s.coatingProgress,1);if(s.cureProgress>0)near(s.ovenTransfer,1);assert.equal(s.netMassClaim,null);}));
 check('finger changes zone and drag direction, without a final-map approval claim',()=>{assert.equal(at('rv_grip',3).dragDirection,'vertical');assert.equal(end('rv_grip').dragDirection,'horizontal');assert.ok(end('rv_grip').alongTravelPx>200);assert.equal(end('rv_grip').finalMapApproved,false);});
 check('wheel builds all six arms and seats a rim before the144-groove finished turn',()=>{near(end('rv_wheel').armBuild,1);near(end('rv_wheel').rimSeat,1);near(end('rv_wheel').grooveCount,144);assert.ok(end('rv_wheel').wheelRotationRad>1);});
 check('brass retains its path, both screws leave and return, estimates stay attributed',()=>{near(at('rv_inserts',7).brass.lift,165);near(end('rv_inserts').brass.lift,0);all('rv_inserts',s=>{near(s.brass.offset,0);assert.equal(s.numericalWearSimulation,false);});assert.ok(end('rv_inserts').plastic.offset>0);});
 check('the driver seats, deforms the illustrative soft recess, withdraws and uses the backup',()=>{near(end('rv_screws').softRecessDamage,1);assert.ok(at('rv_screws',12).flatBackup>.9);near(end('rv_screws').screwSetTargetG,.42);});
 check('repair order: screws, plug, battery, old switch, new switch',()=>all('rv_repair',s=>{if(s.battery.plugPull>0)s.screwRemoval.forEach(v=>near(v,1));if(s.battery.batteryLift>0)near(s.battery.plugPull,1);if(s.socket.newInsertion>0){near(s.socket.oldExtraction,1);const a=s.socket.oldBounds,b=s.socket.newBounds;assert.ok(Math.min(a[2],b[2])<=Math.max(a[0],b[0])||Math.min(a[3],b[3])<=Math.max(a[1],b[1]),'old/new switches overlap');}assert.equal(s.finalBottomCover,false);}));
 check('close adds a complete conserved29.31g design budget',()=>{near(end('rv_close').budgetComponentsG.reduce((a,b)=>a+b,0),29.31);near(end('rv_close').assembledTargetG,29.31);});
 result.errors=[...new Set(errors)];assert.equal(result.errors.length,0,result.errors.join('\n'));
 fs.writeFileSync(path.join(out,'causal-motion-report.json'),JSON.stringify(result,null,2));await browser.close();console.log(JSON.stringify({scenes:Object.keys(plans).length,frames:result.frames.length,assertions:result.assertions.length,errors:result.errors.length}));
})().catch(e=>{console.error(e);process.exitCode=1;});
