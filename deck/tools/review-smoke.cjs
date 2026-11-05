/* Local-only review/player acceptance smoke.
 * Run NODE_PATH=<runtime node_modules> node deck/tools/review-smoke.cjs
 * Never signs into a browser account; owns fresh isolated Playwright contexts.
 */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {pageUrl}=require('./serve.js');
const root=path.resolve(__dirname,'..','..'),out=path.join(root,'deck','qa','review-smoke');
const mobileOnly=process.argv.includes('--mobile-only'),panelsOnly=process.argv.includes('--panels-only'),coverageOnly=process.argv.includes('--coverage-only'),reportFile=path.join(out,coverageOnly?'coverage-report.json':panelsOnly?'panels-report.json':mobileOnly?'real-mobile-report.json':'report.json');
fs.mkdirSync(out,{recursive:true});
const report={startedAt:new Date().toISOString(),tests:[],errors:[]};
function ok(name,details={}){report.tests.push({name,pass:true,...details});console.log('PASS',name);}
const key='theseus.codex.review.v1';
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.RV_CHROME?{executablePath:process.env.RV_CHROME}:{})});
 const base=await pageUrl(process.env.RV_HTML?path.resolve(root,process.env.RV_HTML):path.join(root,'deck','dist','index.html'));
 async function ready(p,url){await p.goto(url,{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>typeof RATE!=='undefined'&&RATE.ready&&document.querySelector('#next').onclick&&document.querySelector('#reviewBtn'),null,{timeout:20000});}
 async function stored(p){return p.evaluate(k=>JSON.parse(localStorage.getItem(k)||'{}'),key);}
 async function clickClose(p,id){const el=p.locator('#'+id+' [data-act="close-panel"]');if(await el.isVisible())await el.click();}
 async function boxFit(p,label){
  const boxes=await p.evaluate(()=>{const ids=['stage','bar','prev','play','next','rateBtn','editBtn','reviewBtn','reviewExportBtn','replayBtn','autoBtn','seek','reviewStatus'];return ids.map(id=>{const e=document.getElementById(id),r=e.getBoundingClientRect();return{id,x:r.x,y:r.y,right:r.right,bottom:r.bottom,w:r.width,h:r.height,display:getComputedStyle(e).display};});});
  const vp=p.viewportSize();for(const b of boxes){if(!b.w||!b.h||b.display==='none')continue;assert(b.x>=-1&&b.y>=-1&&b.right<=vp.width+1&&b.bottom<=vp.height+1,label+' '+JSON.stringify(b));}
  ok(label,{viewport:vp});
 }
 if(coverageOnly){
  const ctx=await browser.newContext({viewport:{width:1280,height:900}}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await ready(p,base+'?2d=1#rv_spdt');await p.locator('#reviewBtn').click();
  const clause=id=>p.locator('#review [data-clause-id="'+id+'"]'),show=async id=>{await p.evaluate(id=>{go(DECK.slides.findIndex(s=>s.id===id),{instant:true});document.querySelector('#review').hidden=false;rvRenderReview();},id);};
  assert(await clause('F27.clk_switch2.3').locator('[data-addressed-in="rv_binning"]').count());await clause('F27.clk_switch2.3').locator('[data-addressed-in="rv_binning"]').click();await p.waitForFunction(()=>curSlide().id==='rv_binning');
  await show('rv_spdt');assert(await clause('F27.clk_switch.4').locator('[data-addressed-in="rv_no_lights"]').count());await clause('F27.clk_switch.4').locator('[data-addressed-in="rv_no_lights"]').click();await p.waitForFunction(()=>curSlide().id==='rv_no_lights');ok('shared SPDT feedback navigates to actual binning and no-lights responses');
  await show('rv_front_contact');assert.equal(await clause('F27.clk_front.1').getAttribute('data-answer-from'),'rv_front_contact');assert.equal(await clause('F27.clk_front.1').locator('[data-addressed-in]').count(),0);await clause('F27.clk_front.10').locator('[data-addressed-in="rv_shoulder_seams"]').click();await p.waitForFunction(()=>curSlide().id==='rv_shoulder_seams');ok('local clause answer is preferred; front-contact shared clause navigates to shoulder seam response');
  await show('rv_close');await clause('F27.ntr_stats.1').locator('[data-addressed-in="rv_cover"]').click();await p.waitForFunction(()=>curSlide().id==='rv_cover');ok('close links the shared original stats clause to its actual cover response');
  await show('rv_spdt');await clause('F27.clk_switch.4').locator('[data-act="reopen-clause"]').click();assert.equal(await clause('F27.clk_switch.4').getAttribute('data-status'),'pending');await clause('F27.clk_switch.4').locator('[data-addressed-in="rv_no_lights"]').click();await p.waitForFunction(()=>curSlide().id==='rv_no_lights');assert.equal(await clause('F27.clk_switch.4').getAttribute('data-status'),'pending');assert((await clause('F27.clk_switch.4').innerText()).includes('marked this for another pass'));ok('reopened shared clause stays pending globally after navigating to its owner');
  await show('rv_light_structure');assert.equal(await clause('F27.shlPick.1').getAttribute('data-status'),'pending');assert(/owner.*assessment/i.test(await clause('F27.shlPick.1').innerText()));assert(await p.evaluate(()=>rvClauseMatches('F27.shlPick.1').some(x=>typeof x.pending==='string')));ok('partial assessment and pending prose ID prefix remain visibly open');
  await show('rv_whole_pcb');for(const id of ['F27.shcArms.1','F27.shcArms.3']){assert.equal(await clause(id).getAttribute('data-status'),'pending');assert((await clause(id).innerText()).includes('partial-missing-original-photo'));}assert((await p.locator('#review').innerText()).includes('F28.3'));assert(!(await p.locator('#review').innerText()).includes('[object Object]'));ok('whole-PCB partial clauses stay open; scene-level boundary and structured verification are readable');
  await p.screenshot({path:path.join(out,'global-clause-partial.png')});assert.deepEqual(errors,[]);await ctx.close();await browser.close();report.finishedAt=new Date().toISOString();fs.writeFileSync(reportFile,JSON.stringify(report,null,2));console.log('REPORT',reportFile);return;
 }
 if(mobileOnly||panelsOnly){
  const viewports=panelsOnly?[{width:1920,height:1080},{width:440,height:956},{width:956,height:440}]:[{width:440,height:956},{width:956,height:440}];
  for(const viewport of viewports){
   const mobile=viewport.width!==1920,tag=(panelsOnly?'panels-':'real-mobile-')+viewport.width+'x'+viewport.height,ctx=await browser.newContext({viewport,isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?3:1,reducedMotion:'reduce'}),p=await ctx.newPage(),errors=[];
   p.on('pageerror',e=>errors.push(e.message));await ready(p,base+'?2d=1#rv_cover');
   const tap=async locator=>mobile?locator.tap():locator.click();
   async function panelFit(id){await p.waitForTimeout(100);const b=await p.locator('#'+id).boundingBox(),close=p.locator('#'+id+' [data-act="close-panel"],#'+id+' [data-act="close-review"]');assert(b&&b.x>=-1&&b.y>=-1&&b.x+b.width<=viewport.width+1&&b.y+b.height<=viewport.height+1,id+' panel '+JSON.stringify(b));await p.locator('#'+id).evaluate(e=>e.scrollTop=e.scrollHeight);await p.waitForTimeout(60);const cb=await close.boundingBox();assert(cb&&cb.x>=0&&cb.y>=0&&cb.x+cb.width<=viewport.width&&cb.y+cb.height<=viewport.height,id+' close '+JSON.stringify(cb));await close.scrollIntoViewIfNeeded();}
   const dimensions=await p.evaluate(()=>({inner:innerWidth,client:document.documentElement.clientWidth,visual:visualViewport.width,meta:document.querySelector('meta[name="viewport"]')?.content,touch:navigator.maxTouchPoints}));
   assert.equal(dimensions.inner,viewport.width);assert.equal(dimensions.client,viewport.width);assert(Math.abs(dimensions.visual-viewport.width)<1);assert.match(dimensions.meta,/width=device-width/);if(mobile)assert(dimensions.touch>0);
   await boxFit(p,tag+' actual mobile viewport and controls fit');
   await tap(p.locator('#rateBtn'));if(panelsOnly)await panelFit('rate');await tap(p.locator('#rate [data-v="8"]'));await p.locator('#rate textarea').fill('real mobile note '+tag);await tap(p.locator('#next'));await tap(p.locator('#prev'));assert.equal(await p.locator('#rate textarea').inputValue(),'real mobile note '+tag);await clickClose(p,'rate');
   await tap(p.locator('#editBtn'));await p.waitForFunction(()=>EDIT.on&&EDIT.boxes.length>0);if(panelsOnly){await panelFit('edit');const b=await p.evaluate(()=>{const s=document.querySelector('#stage').getBoundingClientRect(),e=document.querySelector('#edit').getBoundingClientRect();return{stageBottom:s.bottom,stageRight:s.right,stageWidth:s.width,editTop:e.top,editLeft:e.left};});assert(b.stageBottom<=b.editTop||b.stageRight<=b.editLeft,'editor covers stage '+JSON.stringify(b));if(mobile&&viewport.width>720)assert(b.stageWidth>viewport.width*.45,'landscape edit preview is a thumbnail '+JSON.stringify(b));}
   const pick=await p.evaluate(()=>{const b=EDIT.boxes.filter(b=>b.k==='THESEUS').sort((a,b)=>(b.x1-b.x0)*(b.y1-b.y0)-(a.x1-a.x0)*(a.y1-a.y0))[0],r=document.querySelector('#stage').getBoundingClientRect(),fx=document.querySelector('#fx');return{x:r.x+(b.x0+b.x1)/2/fx.width*r.width,y:r.y+(b.y0+b.y1)/2/fx.height*r.height};});
   if(mobile)await p.touchscreen.tap(pick.x,pick.y);else await p.mouse.click(pick.x,pick.y);await p.waitForFunction(()=>EDIT.sel?.k==='THESEUS');await p.locator('#edit textarea').fill('THESEUS+');if(panelsOnly){await panelFit('edit');await p.screenshot({path:path.join(out,tag+'-editor.png')});}await clickClose(p,'edit');await p.waitForFunction(()=>!Object.values(EDQ).some(q=>q.busy));await p.reload();await p.waitForFunction(()=>RATE.ready&&document.querySelector('#next').onclick);assert.equal(await p.evaluate(()=>EDIT.map.rv_cover.get('THESEUS')),'THESEUS+');
   if(panelsOnly){await tap(p.locator('#reviewBtn'));await panelFit('review');await p.screenshot({path:path.join(out,tag+'-feedback.png')});await p.locator('#review [data-act="close-review"]').click();await tap(p.locator('#srcBtn'));await panelFit('src');await clickClose(p,'src');}
   await boxFit(p,tag+' after actual selection and reload');assert.equal((await stored(p)).ratings.rv_cover.note,'real mobile note '+tag);assert.deepEqual(errors,[]);ok(tag+' rating/note and canvas editing; panels fit with reachable close controls',{dimensions,emulation:mobile?'Chromium isMobile + hasTouch, not physical Safari or keyboard testing':'desktop Chromium'});
   await p.screenshot({path:path.join(out,tag+'.png')});await ctx.close();
  }
  await browser.close();report.finishedAt=new Date().toISOString();fs.writeFileSync(reportFile,JSON.stringify(report,null,2));console.log('REPORT',reportFile);return;
 }
 for(const viewport of [{width:1920,height:1080},{width:440,height:956},{width:956,height:440}]){
  const tag=viewport.width+'x'+viewport.height,ctx=await browser.newContext({viewport,acceptDownloads:true,reducedMotion:'reduce'}),p=await ctx.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await ready(p,base+'?2d=1#rv_cover');await p.waitForTimeout(300);await boxFit(p,tag+' controls fit');
  await p.locator('#rateBtn').click();await p.locator('#rate textarea').fill('note before score '+tag);
  for(let v=1;v<=10;v++)await p.locator('#rate [data-v="'+v+'"]').click();
  await p.locator('#rate textarea').fill('cover note '+tag);
  const i=await p.evaluate(()=>APP.i);await p.locator('#rate textarea').press('ArrowRight');assert.equal(await p.evaluate(()=>APP.i),i);
  await p.locator('#next').click();await p.waitForFunction(()=>!Object.values(RATE.pend).some(Boolean));
  assert.equal(await p.locator('#rate textarea').inputValue(),'');
  await p.locator('#rate [data-v="4"]').click();await p.locator('#rate textarea').fill('second note '+tag);await p.locator('#prev').click();
  assert.equal(await p.locator('#rate textarea').inputValue(),'cover note '+tag);
  let db=await stored(p);assert.equal(db.ratings.rv_cover.value,10);assert.equal(db.ratings.rv_cover.note,'cover note '+tag);assert.equal(db.ratings.rv_tradeoffs.note,'second note '+tag);
  ok(tag+' rates1..10, note-before-score, flush-on-navigation, no carryover, keyboard guard');
  await p.locator('#rate .legacy-review summary').click();assert((await p.locator('#rate .legacy-review').innerText()).includes('PIAKNOW'));
  assert((await p.locator('#rate .legacy-review').innerText()).includes('replace routine'));
  await clickClose(p,'rate');
  await p.locator('#reviewBtn').click();assert((await p.locator('#review').innerText()).includes('PIAKNOW'));
  assert(await p.locator('#review [data-clause-id="F27.cover.1"]').count());
  const realPending=p.locator('#review [data-clause-id="F27.targets.2"]');assert.equal(await realPending.getAttribute('data-status'),'pending');assert((await realPending.innerText()).includes('Still open:'));
  /* Explicit state fixture verifies that a mapped answer cannot hide a pending status. */
  await p.evaluate(()=>{RV_COVERAGE.slides=RV_COVERAGE.slides||{};const c=RV_COVERAGE.slides.rv_cover||(RV_COVERAGE.slides.rv_cover={});c.clauses=c.clauses||[];if(!c.clauses.some(x=>x.id==='F27.cover.1'))c.clauses.push({id:'F27.cover.1',answer:'Smoke fixture response exists'});c.pending=[...(c.pending||[]),{id:'F27.cover.1',reason:'Smoke fixture remains pending'}];rvRenderReview();});
  const clause=p.locator('#review [data-clause-id="F27.cover.1"]');assert.equal(await clause.getAttribute('data-status'),'pending');assert((await clause.innerText()).includes('What changed:'));assert((await clause.innerText()).includes('Still open:'));
  await clause.locator('[data-act="reopen-clause"]').click();assert((await clause.innerText()).includes('marked for another pass'));
  await p.locator('#review [data-act="close-review"]').click();
  ok(tag+' original feedback, exact clauses, mapped-pending status and reopen');
  await p.locator('#editBtn').click();await p.waitForFunction(()=>EDIT.on&&EDIT.boxes.length>0);await p.waitForTimeout(250);
  const target=await p.evaluate(()=>{const bs=EDIT.boxes.filter(b=>b.k==='THESEUS').sort((a,b)=>(b.x1-b.x0)*(b.y1-b.y0)-(a.x1-a.x0)*(a.y1-a.y0));const b=bs[0];if(!b)throw Error('Missing editable THESEUS');const r=document.querySelector('#stage').getBoundingClientRect(),fx=document.querySelector('#fx');return{x:r.x+(b.x0+b.x1)/2/fx.width*r.width,y:r.y+(b.y0+b.y1)/2/fx.height*r.height};});
  await p.mouse.click(target.x,target.y);await p.waitForFunction(()=>EDIT.sel&&EDIT.sel.k==='THESEUS');
  const newText='Review words '+tag;await p.locator('#edit textarea').fill(newText);const editI=await p.evaluate(()=>APP.i);await p.locator('#edit textarea').press('ArrowRight');assert.equal(await p.evaluate(()=>APP.i),editI);
  await clickClose(p,'edit');await p.waitForFunction(()=>!Object.values(EDQ).some(q=>q.busy));db=await stored(p);assert(Object.values(db.edits).some(e=>e.slide==='rv_cover'&&e.from==='THESEUS'&&e.to===newText));
  await p.reload();await p.waitForFunction(()=>RATE.ready&&document.querySelector('#next').onclick);assert.equal(await p.evaluate(()=>EDIT.map.rv_cover.get('THESEUS')),newText);
  await p.locator('#next').click();assert.equal(await p.evaluate(()=>EDIT.map.rv_tradeoffs&&EDIT.map.rv_tradeoffs.has('THESEUS')||false),false);await p.locator('#prev').click();
  ok(tag+' tap-select, direct text editing, per-slide scope and reload persistence');
  await p.locator('#seek').evaluate(e=>{e.value='3.25';e.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.equal(await p.evaluate(()=>APP.playing),false);assert(Math.abs(await p.evaluate(()=>slideT())-3.25)<.02);
  await p.locator('#play').click();await p.waitForTimeout(120);assert(await p.evaluate(()=>APP.playing&&slideT()>3.25));await p.locator('#play').click();
  await p.locator('#replayBtn').click();assert(await p.evaluate(()=>APP.playing&&slideT()<.5));await p.locator('#play').click();await boxFit(p,tag+' controls fit after editing');
  ok(tag+' seek, pause, resume and same-slide replay');
  const dlPromise=p.waitForEvent('download');await p.locator('#reviewExportBtn').click();const dl=await dlPromise,file=path.join(out,tag+'-backup.json');await dl.saveAs(file);
  const backup=JSON.parse(fs.readFileSync(file,'utf8'));assert.equal(backup.format,'theseus-codex-review');assert.equal(backup.ratings.rv_cover.note,'cover note '+tag);assert(Object.values(backup.edits).some(e=>e.to===newText));assert(backup.coverage['F27.cover.1'].reopened);
  await p.evaluate(k=>localStorage.removeItem(k),key);await p.reload();await p.waitForFunction(()=>RATE.ready&&document.querySelector('#next').onclick);
  await p.locator('#reviewBtn').click();await p.locator('#review [data-act="import-review"]').click();
  await p.locator('#reviewImport').setInputFiles(file);await p.waitForFunction(()=>RATE.all.rv_cover&&RATE.all.rv_cover.value===10);
  assert.equal(await p.evaluate(()=>EDIT.map.rv_cover.get('THESEUS')),newText);assert(await p.evaluate(()=>RV_DB.coverage()['F27.cover.1'].reopened));
  await p.reload();await p.waitForFunction(()=>RATE.ready);assert.equal(await p.evaluate(()=>RATE.all.rv_tradeoffs.note),'second note '+tag);
  ok(tag+' actual JSON download/import roundtrip preserves ratings, edits, reopened state');
  await p.screenshot({path:path.join(out,tag+'.png')});assert.deepEqual(errors,[]);await ctx.close();
 }
 const movieCtx=await browser.newContext({viewport:{width:956,height:440}}),movie=await movieCtx.newPage();
 await ready(movie,base+'?2d=1&auto=1#rv_cover');assert.equal(await movie.evaluate(()=>RV_AUTO.enabled),true);assert.equal(await movie.evaluate(()=>RV_AUTO.hold),2.5);
 const startI=await movie.evaluate(()=>APP.i);await movie.evaluate(()=>APP.t0=performance.now()-(curSlide().settle+.1)*1000);await movie.waitForTimeout(140);assert.equal(await movie.evaluate(()=>APP.i),startI);
 await movie.evaluate(()=>APP.t0=performance.now()-(curSlide().settle+RV_AUTO.hold+.1)*1000);await movie.waitForFunction(i=>APP.i===i+1,startI);ok('autoplay query uses2.5s reading hold then actually navigates');
 await movie.locator('#rateBtn').click();await movie.locator('#rate textarea').fill('autoplay must preserve this note');const noteSlide=await movie.evaluate(()=>curSlide().id),noteI=await movie.evaluate(()=>APP.i);assert.equal(await movie.evaluate(()=>APP.playing),false);
 await movie.evaluate(()=>APP.tPause=curSlide().settle+RV_AUTO.hold+1);await movie.waitForTimeout(160);assert.equal(await movie.evaluate(()=>APP.i),noteI);
 await clickClose(movie,'rate');await movie.locator('#play').click();await movie.waitForFunction(i=>APP.i===i+1,noteI);await movie.waitForFunction(()=>!Object.values(RATE.pend).some(Boolean));assert.equal((await stored(movie)).ratings[noteSlide].note,'autoplay must preserve this note');
 await movie.locator('#reviewBtn').click();assert.equal(await movie.evaluate(()=>APP.playing),false);await movie.locator('#review [data-act="close-review"]').click();assert.equal(await movie.evaluate(()=>APP.playing),false);
 await movie.locator('#editBtn').click();assert.equal(await movie.evaluate(()=>APP.playing),false);await clickClose(movie,'edit');
 await movie.locator('#seek').evaluate(e=>{e.value='5';e.dispatchEvent(new Event('input',{bubbles:true}));});assert.equal(await movie.evaluate(()=>APP.playing),false);assert.equal(await movie.evaluate(()=>RV_AUTO.enabled),true);
 ok('autoplay pauses for notes, feedback, editing and seeking; explicit resume preserves note on correct slide');
 await movie.locator('#autoBtn').click();assert.equal(await movie.evaluate(()=>RV_AUTO.enabled),false);
 await movie.locator('#rateBtn').click();await movie.locator('#rate textarea').fill('pending note survives preview update');const updateSlide=await movie.evaluate(()=>curSlide().id);
 let build='smoke-new-preview';await movie.route('**/preview-version.json*',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({...(build==='smoke-safe-refresh'?{id:build}:{buildId:build}),at:'smoke fixture',scenes:46})}));
 await movie.evaluate(()=>RVcheckUpdate());assert(await movie.locator('#previewUpdate').isVisible());assert.equal(new URL(movie.url()).searchParams.has('v'),false);assert((await movie.locator('#previewUpdateMessage').innerText()).includes(build));
 await Promise.all([movie.waitForURL(u=>u.searchParams.get('v')===build),movie.locator('#previewUpdate button').click()]);await movie.waitForFunction(()=>RATE.ready&&document.querySelector('#next').onclick);
 assert.equal(new URL(movie.url()).hash,'#'+updateSlide);assert.equal((await stored(movie)).ratings[updateSlide].note,'pending note survives preview update');assert((await movie.locator('#reviewStatus').innerText()).includes(await movie.evaluate(()=>RV_BUILD.id)));
 ok('new-preview banner does not reload through reviewing; explicit reload flushes notes, preserves hash and shows build identity');
 build='smoke-safe-refresh';await movie.evaluate(()=>{APP.playing=false;APP.tPause=curSlide().settle+1;});
 await Promise.all([movie.waitForURL(u=>u.searchParams.get('v')===build),movie.evaluate(()=>RVcheckUpdate()).catch(e=>{if(!/context was destroyed/i.test(e.message))throw e;})]);await movie.waitForFunction(()=>RATE.ready&&document.querySelector('#next').onclick);assert.equal(new URL(movie.url()).hash,'#'+updateSlide);ok('settled idle preview safely refreshes after version check');
 await movieCtx.close();
 const ctx=await browser.newContext({viewport:{width:440,height:956}});await ctx.addInitScript(()=>{Storage.prototype.getItem=function(){throw new DOMException('Storage denied','SecurityError');};Storage.prototype.setItem=function(){throw new DOMException('Storage denied','SecurityError');};});
 const p=await ctx.newPage();await ready(p,base+'?2d=1#rv_cover');await p.locator('#rateBtn').click();await p.locator('#rate [data-v="7"]').click();await p.waitForTimeout(100);
 assert((await p.locator('#reviewStatus').innerText()).includes('Not saved'));assert((await p.locator('#rate .state').innerText()).includes('Not saved'));assert.equal(await p.evaluate(()=>RV_DB.export().ratings.rv_cover.value),7);
 ok('storage denied shows failure, retains exportable memory, never claims saved');
 await p.route('**/preview-version.json*',route=>route.fulfill({contentType:'application/json',body:JSON.stringify({buildId:'smoke-unsaved-refresh',scenes:46})}));await p.evaluate(()=>{APP.playing=false;APP.tPause=curSlide().settle+1;});await p.evaluate(()=>RVcheckUpdate());assert(await p.locator('#previewUpdate').isVisible());await p.locator('#previewUpdate button').click();await p.waitForTimeout(100);assert.equal(new URL(p.url()).searchParams.has('v'),false);assert((await p.locator('#previewUpdateMessage').innerText()).includes('Export a review backup'));
 ok('preview refresh refuses reload when browser storage failed');
 await p.screenshot({path:path.join(out,'storage-denied.png')});await ctx.close();
 const legacy=await browser.newPage({viewport:{width:956,height:440}});await ready(legacy,base+'?legacy=weightgap&2d=1');assert.equal(await legacy.evaluate(()=>curSlide().id),'weightgap');await legacy.locator('#reviewBtn').click();assert((await legacy.locator('#review').innerText()).includes('weightgap'));
 ok('legacy query opens original scene with original feedback');await legacy.close();
 await browser.close();report.finishedAt=new Date().toISOString();fs.writeFileSync(reportFile,JSON.stringify(report,null,2));console.log('REPORT',reportFile);
})().catch(e=>{report.errors.push(e.stack);fs.writeFileSync(reportFile,JSON.stringify(report,null,2));console.error(e);process.exitCode=1;setTimeout(()=>process.exit(1),100);});

