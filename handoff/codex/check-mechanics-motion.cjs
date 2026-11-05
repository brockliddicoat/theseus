// One page, exact tested HTML, event-specific temporal proof for the mechanics lane.
// NODE_PATH=<runtime node_modules> node handoff/codex/check-mechanics-motion.cjs [html] [out]
const {chromium}=require('playwright');
const {pageUrl}=require('../../deck/tools/serve.js');
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const events={
 rv_direct_drive:[['side-load',3.2],['housing-rotating',8.8],['aligned-press',13.5]],
 rv_rear_cutouts:[['whole-mouse-press',3.1],['hinge-zoom',5.2],['supports-aligned',9.5],['square-press',13.5]],
 rv_front_contact:[['left-first-contact',3.1],['right-first-contact',7.8],['groove-shallowed',10.9],['flat-front-loaded',14]],
 rv_shoulder_seams:[['side-edge-catch',4.4],['wall-moving',8.1],['flush-loaded',13.2]],
 rv_tensioner:[['stiff-flat-loaded',3.7],['crown-forming',8.5],['bridge-loaded',13.5]],
 rv_dual_rail:[['single-guide-roll',3.5],['pads-assembling',8.6],['posts-landing',10.6],['dual-guides-loaded',14.1]],
 rv_spdt:[['nc-closed',3.8],['actual-leaf-transit',5.7],['no-landed',7.8]],
 rv_hotswap:[['jaws-gripping',6.1],['jaws-released',8.6],['pins-lifted-clear',12.2]],
 rv_sidebuttons:[['hinge-overtravel',4.1],['main-post-match',6.8],['post-moving-into-side',9.1],['side-guide-loaded',14.1]],
 rv_sensor_camera:[['height-high-blur',5.9],['focus-restored',10],['matched-detail-displaced',13.8],['height-low-blur',17],['calibrated-settle',22]],
 rv_sensor_support:[['unsupported-sag',3.6],['corner-dots-landing',6.5],['lens-carrier-landing',9],['short-load-path',13.4]],
 rv_sensor_choice:[['counts-fit',3],['burst-crosses-limit',7.8],['burst-clipped-v-preserved',9.5],['preserved-settle',21]]
};
(async()=>{
 const source=process.argv[2]||'deck/dist/motion-click.html',out=process.argv[3]||'deck/qa/mechanics-motion-events';fs.mkdirSync(out,{recursive:true});
 const bytes=fs.readFileSync(source),tested=path.join(out,'tested-index.html');fs.writeFileSync(tested,bytes);
 const report={testedHtml:path.resolve(tested),htmlSha256:crypto.createHash('sha256').update(bytes).digest('hex'),at:new Date().toISOString(),events:[],errors:[]};
 const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto((await pageUrl(tested))+'?cap=1&qa=1&2d=1&t=0.02',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForFunction('window.__ready===true',null,{timeout:90000});
  const slides=await page.evaluate(()=>DECK.slides.map((s,i)=>({id:s.id,i,settle:s.settle})));
  for(const [id,shots] of Object.entries(events)){
   const s=slides.find(s=>s.id===id);if(!s)throw Error('Missing '+id);
   for(const [event,t] of shots){
    const text=await page.evaluate(({i,t})=>{APP.i=i;APP.frozenT=t;APP.trStart=-1;frame();return QA.text.filter(r=>r.a>.25&&r.s.trim()).map(r=>r.s);},{i:s.i,t});
    const file=path.join(out,`${String(s.i).padStart(2,'0')}_${id}_${t.toFixed(2)}_${event}.png`),png=await page.screenshot({path:file,timeout:60000});
    report.events.push({id,event,t,image:path.resolve(file),sha256:crypto.createHash('sha256').update(png).digest('hex'),text});
   }console.log(id,shots.length+' event frames');
  }report.errors=[...new Set(errors)];fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log('SUMMARY',JSON.stringify({events:report.events.length,errors:report.errors.length,htmlSha256:report.htmlSha256}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
