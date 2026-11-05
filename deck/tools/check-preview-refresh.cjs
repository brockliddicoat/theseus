// Actual Chromium update-flow fixture. All document/version responses are fulfilled from disk.
// node deck/tools/check-preview-refresh.cjs [HTML] [QA directory] [fixed|before]
const fs=require('fs'),path=require('path'),assert=require('assert'),{chromium}=require('playwright');
(async()=>{
 const [file='deck/dist/index.html',output='deck/qa/preview-refresh',mode='fixed']=process.argv.slice(2),fixed=mode==='fixed';
 const html=fs.readFileSync(file,'utf8'),out=path.resolve(output);fs.mkdirSync(out,{recursive:true});
 const originalBuild=JSON.parse(html.match(/const RV_BUILD=(\{[^\n]+\});/)[1]).id;
 const browser=await chromium.launch({headless:true}),report={fixture:'actual browser; all document/version responses intercepted from disk; no socket or deployment test',htmlSha256:require('crypto').createHash('sha256').update(html).digest('hex'),fixed,cases:[],errors:[]};
 const save=()=>fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(report,null,2));
 try{
 for(const spec of [
  {id:'auto-to-manual-review',openAuto:true,toggle:true,pause:true,manual:true,note:true},
  {id:'manual-to-auto-seek',openAuto:false,toggle:true,pause:true,manual:true},
  {id:'settled-auto-paused-refresh',openAuto:true,toggle:false,pause:true,manual:false},
  {id:'playing-auto-refresh',openAuto:true,toggle:false,pause:false,manual:false}
 ]){
  const ctx=await browser.newContext({viewport:{width:440,height:956},isMobile:true,hasTouch:true}),page=await ctx.newPage();page.setDefaultTimeout(12000);
  let available=false;const next='review-fixture-'+spec.id;
  await page.route('**/*',route=>{
   const u=new URL(route.request().url());
   if(u.pathname.endsWith('preview-version.json'))return route.fulfill({contentType:'application/json',body:JSON.stringify({buildId:available?next:originalBuild,scenes:47})});
   if(route.request().isNavigationRequest()){
    let content=html;if(u.searchParams.get('v')===next)content=content.replace(/const RV_BUILD=(\{[^\n]+\});/,(_,raw)=>'const RV_BUILD='+JSON.stringify({...JSON.parse(raw),id:next})+';');
    return route.fulfill({contentType:'text/html',body:content});
   }
   return route.fulfill({status:404,body:'review fixture: no remote asset'});
  });
  page.on('pageerror',e=>report.errors.push(spec.id+': '+e.message));
  await page.goto('https://theseus-review.test/index.html?2d=1'+(spec.openAuto?'&auto=1':'')+'#rv_cover',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof RATE!=='undefined'&&RATE.ready&&document.querySelector('#next').onclick&&document.querySelector('#autoBtn'));
  if(spec.toggle)await page.locator('#autoBtn').click();
  if(spec.pause){await page.locator('#seek').evaluate((el,t)=>{el.value=t;el.dispatchEvent(new Event('input',{bubbles:true}));el.blur()},spec.manual?5:17);}
  else await page.evaluate(()=>{APP.t0=performance.now()-(curSlide().settle+1)*1000;APP.playing=true;document.activeElement.blur()});
  if(spec.note){await page.locator('#rateBtn').click();await page.locator('#rate textarea').fill('pending cycle4 refresh note');}
  const before=await page.evaluate(()=>({enabled:RV_AUTO.enabled,playing:APP.playing,t:slideT(),scene:curSlide().id,rateDirty:RATE.dirty,url:location.href}));
  available=true;
  if(spec.manual){
   await page.evaluate(()=>RVcheckUpdate());assert(await page.locator('#previewUpdate').isVisible());assert(!new URL(page.url()).searchParams.has('v'));
   await page.screenshot({path:path.join(out,spec.id+'-before.png')});
   await Promise.all([page.waitForURL(u=>u.searchParams.get('v')===next),page.locator('#previewUpdate button').click()]);
  }else await Promise.all([page.waitForURL(u=>u.searchParams.get('v')===next),page.evaluate(()=>RVcheckUpdate()).catch(e=>{if(!/context was destroyed/i.test(e.message))throw e;})]);
  await page.waitForFunction(()=>typeof RATE!=='undefined'&&RATE.ready&&document.querySelector('#next').onclick&&document.querySelector('#autoBtn'));
  const after=await page.evaluate(()=>({enabled:RV_AUTO.enabled,playing:APP.playing,t:slideT(),scene:curSlide().id,build:RV_BUILD.id,url:location.href,note:RATE.all.rv_cover&&RATE.all.rv_cover.note,playLabel:document.getElementById('play').getAttribute('aria-label')}));
  const row={spec,before,after,modePreserved:before.enabled===after.enabled,pausePreserved:before.playing===after.playing};report.cases.push(row);save();
  await page.screenshot({path:path.join(out,spec.id+'-after.png')});
  assert.equal(after.scene,before.scene);assert.equal(after.build,next);if(spec.note)assert.equal(after.note,'pending cycle4 refresh note');
  if(fixed){assert(row.modePreserved,spec.id+' mode changed');assert(row.pausePreserved,spec.id+' pause changed');assert.equal(after.playLabel,spec.pause?'Play':'Pause');}
  await ctx.close();
 }
 assert.deepStrictEqual(report.errors,[]);
 if(!fixed){assert(report.cases.slice(0,2).every(c=>!c.modePreserved));assert(report.cases.filter(c=>c.spec.pause).every(c=>!c.pausePreserved));}
 report.pass=true;save();console.log(JSON.stringify({pass:true,fixed,errors:report.errors,cases:report.cases.map(c=>({id:c.spec.id,modePreserved:c.modePreserved,pausePreserved:c.pausePreserved}))}));
 }catch(e){report.failure=e.stack;save();throw e}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
