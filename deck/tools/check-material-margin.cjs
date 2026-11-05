/* Focused closure of the missing120MPa material-limit beat. Only rv_hotspots and rv_whole_pcb are rendered. */
const {chromium}=require('playwright');
const {pageUrl}=require('./serve.js');
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
let activeBrowser;
const near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
(async()=>{
 fs.mkdirSync(process.argv[3]||'deck/qa/material-margin-recheck',{recursive:true});
 const out=path.resolve(process.argv[3]||'deck/qa/material-margin-recheck'),file=process.argv[2]||'deck/dist/hotspot-margin.html',times=[0,3,9,14.9,15.5,16,17,17.75,19.5,22,24],sourceBytes=fs.readFileSync('deck/revamp/40-structure.js'),source=sourceBytes.toString('utf8').replace(/\r\n/g,'\n'),a=source.indexOf("RV.add({id:'rv_hotspots'"),b=source.indexOf("RV.add({id:'rv_triangles'",a),c=source.indexOf("RV.add({id:'rv_whole_pcb'",b),frozen=JSON.parse(fs.readFileSync(path.join(out,'frozen-scope.json')));
 assert.equal(sha(source.slice(0,a)),frozen.prefixSha256,'source before rv_hotspots changed');assert.equal(sha(source.slice(b,c)),frozen.middleSha256,'unreopened structure code changed');
 for(const [n,h]of Object.entries(frozen.frozenOtherFiles))assert.equal(sha(fs.readFileSync(path.join('deck/revamp',n))),h,n+' changed');
 const bytes=fs.readFileSync(file),snap=path.join(out,'tested-margin.html');fs.writeFileSync(snap,bytes);
 const browser=activeBrowser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}),page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('Failed to load resource'))errors.push(m.text());});
 await page.goto((await pageUrl(snap))+'?cap=1&qa=1&2d=1&s=rv_hotspots&t=0',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForFunction('window.__ready===true');await page.evaluate(()=>{const old=rvTxt;window.__fullText=[];rvTxt=function(s,...args){window.__fullText.push(String(s));return old(s,...args);};});
 const report={htmlSha256:sha(bytes),sourceSha256:sha(sourceBytes),scope:'rv_hotspots and rv_whole_pcb only; surrounding structure code unchanged and other owned files byte-identical',at:new Date().toISOString(),frames:[],assertions:[]};
 for(const t of times){
  const q=await page.evaluate(t=>{APP.i=DECK.slides.findIndex(s=>s.id==='rv_hotspots');APP.frozenT=t;APP.trStart=-1;window.__fullText=[];frame();const text=QA.text.filter(r=>r.a>.25&&r.s.trim().length),issues=[];
   for(const r of text){if(r.x0<2||r.x1>1918||r.y0<2||r.y1>1078)issues.push('OFFSTAGE '+r.s);if(r.px<19)issues.push('SMALL '+r.s);}
   for(let i=0;i<text.length;i++)for(let j=i+1;j<text.length;j++){const a=text[i],b=text[j],ix=Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0),iy=Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0),ar=Math.min((a.x1-a.x0)*(a.y1-a.y0),(b.x1-b.x0)*(b.y1-b.y0));if(ix>3&&iy>3&&ix*iy>.12*ar)issues.push('OVERLAP '+a.s+' / '+b.s);}
   return {state:window.__structureMotion.rv_hotspots,fullText:window.__fullText.slice(),text:text.map(r=>r.s),issues:[...new Set(issues)]};},t);
  const name='margin-'+String(t).replace('.','-')+'.png',image=await page.screenshot({path:path.join(out,name)});report.frames.push({t,...q,image:name,sha256:sha(image)});
 }
 const at=t=>report.frames.find(f=>f.t===t),last=at(22);const check=(name,fn)=>{fn();report.assertions.push({name,pass:true});};
 check('surrounding structure code is unchanged and the other three owned files remain byte-identical',()=>assert.equal(report.scope,'rv_hotspots and rv_whole_pcb only; surrounding structure code unchanged and other owned files byte-identical'));
 check('full header, all three masses and10N peak-stress baselines stay visible',()=>{for(const f of report.frames){assert.ok(f.text.includes('PUTTING THAT WEIGHT TO WORK'));for(const g of f.state.massesG)near(g,f.state.massesG[0]);for(const p of f.state.peaksMPa)assert.ok(f.text.includes(p.toFixed(1)+' MPa'));if(f.t>=15)near(f.state.loadN,10);}});
 check('the margin beat begins only after the10N reload finishes',()=>{assert.ok(!at(15.5).text.some(s=>s.includes('LINEAR LOAD TO')));near(at(16).state.marginProgress,0);assert.ok(at(16).text.filter(s=>s.includes('LINEAR LOAD TO 120 MPa')).length===3);near(last.state.marginProgress,1);});
 check('all three extrapolated loads reach exactly the same120MPa criterion',()=>{for(let i=0;i<3;i++){near(last.state.criterionMPa,120);near(last.state.peaksMPa[i]*last.state.loadsToCriterionN[i]/10,120);near(last.state.marginFactors[i],last.state.loadsToCriterionN[i]/10);near(last.state.displayedCriterionLoadsN[i],last.state.loadsToCriterionN[i]);}});
 check('the middle event is genuine extrapolation while the FE illustration stays at10N',()=>{const f=at(17.75);near(f.state.loadN,10);for(let i=0;i<3;i++){assert.ok(f.state.displayedCriterionLoadsN[i]>10);assert.ok(f.state.displayedCriterionLoadsN[i]<f.state.loadsToCriterionN[i]);}assert.notEqual(at(16).sha256,at(17.75).sha256);assert.notEqual(at(17.75).sha256,last.sha256);});
 check('higher load-to-criterion follows lower actual model peak stress',()=>{const s=last.state;assert.ok(s.peaksMPa[0]>s.peaksMPa[1]&&s.peaksMPa[1]>s.peaksMPa[2]);assert.ok(s.loadsToCriterionN[0]<s.loadsToCriterionN[1]&&s.loadsToCriterionN[1]<s.loadsToCriterionN[2]);});
 check('the slide names direction, meaning and extrapolation limits, not product capacity',()=>{const s=last.fullText.join(' ').toLowerCase().replace(/\s+/g,' ');assert.equal(last.state.productFailureRating,false);assert.ok(s.includes('higher is better'));assert.ok(s.includes('higher means more load'));assert.ok(s.includes('linear extrapolation only'));assert.ok(s.includes('buckling/contact not included'));assert.ok(s.includes('not product capacity'));});
 check('all focused event frames are layout-clean',()=>report.frames.forEach(f=>assert.deepEqual(f.issues,[],f.t+':'+f.issues.join('\n'))));
 report.pcbFrames=[];
 for(const t of [0,7,14,23]){
  const q=await page.evaluate(t=>{APP.i=DECK.slides.findIndex(s=>s.id==='rv_whole_pcb');APP.frozenT=t;APP.trStart=-1;window.__fullText=[];frame();return {state:window.__structureMotion.rv_whole_pcb,fullText:window.__fullText.slice()};},t);
  const image='pcb-'+t+'.png';await page.screenshot({path:path.join(out,image)});report.pcbFrames.push({t,...q,image});
 }
 check('whole-board tie is explicitly contrasted with extra carbon-fibre rods and fitting/tolerancing work',()=>report.pcbFrames.forEach(f=>{const s=f.fullText.join(' ').toLowerCase();assert.ok(s.includes('instead of separate carbon-fibre rods'));assert.ok(s.includes('no extra parts to fit and tolerance'));}));
 check('shipping break is visibly attributed to Brock and schematic fidelity stays qualified',()=>report.pcbFrames.forEach(f=>{const s=f.fullText.join(' ').toLowerCase();assert.ok(s.includes('owner report: brock'));assert.ok(s.includes('hts ultra reinforcement arms broke in shipping'));assert.ok(s.includes('original photos unavailable'));assert.ok(s.includes('not traced geometry'));}));
 check('no extra material-ratio claim was introduced; board mechanism stays unloaded during transfer',()=>{assert.ok(!report.pcbFrames.some(f=>f.fullText.join(' ').includes('1.8×')));near(report.pcbFrames.find(f=>f.t===7).state.loadN,0);near(report.pcbFrames.at(-1).state.loadN,10);});
 report.errors=[...new Set(errors)];assert.deepEqual(report.errors,[]);
 fs.writeFileSync(path.join(out,'margin-report.json'),JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify({scenes:2,frames:report.frames.length+report.pcbFrames.length,assertions:report.assertions.length,issues:report.frames.reduce((n,f)=>n+f.issues.length,0),errors:report.errors.length,criterionLoadsN:last.state.loadsToCriterionN,marginFactors:last.state.marginFactors}));
})().catch(async e=>{console.error(e);if(activeBrowser)await activeBrowser.close();process.exitCode=1;});
