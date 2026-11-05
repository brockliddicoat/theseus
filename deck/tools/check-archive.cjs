// Rejected scenes must stay out of the film while their preserved-source links work.
const {chromium}=require('playwright');
const {pageUrl}=require('./serve.js');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
let activeBrowser;
(async()=>{
 const file=process.argv[2]||'deck/dist/final-candidate.html',out=process.argv[3]||'deck/qa/final-archive';fs.mkdirSync(out,{recursive:true});
 const sha=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
 const browser=activeBrowser=await chromium.launch(),p=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[],results=[];
 p.on('pageerror',e=>errors.push(e.message));const base=await pageUrl(path.resolve(file));
 await p.goto(base+'?2d=1&cap=1&t=0.02');await p.waitForFunction(()=>window.__ready===true);
 const hidden=await p.evaluate(()=>RV_ARCHIVE.filter(s=>!RV_LEGACY.includes(s)).map(s=>s.id));
 assert.equal(hidden.length,14);
 for(const id of hidden){
  await p.goto(base+'?2d=1&cap=1&t=0.02&legacy='+encodeURIComponent(id));await p.waitForFunction(()=>window.__ready===true);
  const actual=await p.evaluate(()=>{APP.frozenT=curSlide().settle||14;frame();return{id:curSlide().id,archive:RV_ARCHIVE.map(s=>s.id),activeFilm:RV.slides.map(s=>s.id)};});
  assert.equal(actual.id,id,'archive route must open exact source scene, not silently fall back to cover');assert(!actual.activeFilm.includes(id),'rejected legacy scene must not be in new film');
  results.push({id,pass:true});
 }
 await browser.close();assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({htmlSha256:sha,at:new Date().toISOString(),results,errors},null,2));console.log(JSON.stringify({archiveRoutes:results.length,errors:errors.length}));
})().catch(async e=>{console.error(e);if(activeBrowser)await activeBrowser.close();process.exitCode=1;});
