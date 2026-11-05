/* Causal event capture, one isolated page. This records actual draw-helper inputs,
 * not a reconstructed animation. Pixel differences alone do not establish quality. */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const {pageUrl}=require('../../deck/tools/serve.js');
const root=path.resolve(__dirname,'../..'),file=path.resolve(root,process.argv[2]||'deck/dist/motion-intro.html'),out=path.resolve(root,'deck/qa/intro-motion-events');
const events=[
 ['rv_cover',.02,'header'],['rv_cover',1.3,'type-and-count'],['rv_cover',3.5,'numbers-arrived'],
 ['rv_tradeoffs',2.7,'X3'],['rv_tradeoffs',6.5,'Viper'],['rv_tradeoffs',9,'M3K'],['rv_tradeoffs',12,'HTX'],['rv_tradeoffs',16,'Theseus-target'],
 ['rv_density',3,'small-outline-first'],['rv_density',6,'full-support-expands'],['rv_density',11.8,'box-to-formula'],
 ['rv_inertia',2,'equal-initial-position'],['rv_inertia',4.9,'lower-mass-stops-first'],['rv_inertia',7.9,'lower-mass-reverses-first'],['rv_inertia',10.4,'both-reversed'],
 ['rv_weight_truth',2,'sample-placed'],['rv_weight_truth',6.6,'difference-tilts-balance'],
 ['rv_board',3,'consolidate'],['rv_board',6.8,'single-reflow'],['rv_board',10.4,'coating-contour'],['rv_board',13,'splash-deflects'],
 ['rv_power',4,'CC'],['rv_power',9,'CV'],
 ['rv_radio',.2,'antenna-near-wheel'],['rv_radio',3.4,'cursor-flips-module'],['rv_radio',7,'report'],['rv_radio',9.5,'ACK'],
 ['rv_firmware',4.1,'older-capture'],['rv_firmware',6.4,'fresh-capture'],['rv_firmware',7.3,'same-USB-deadline'],['rv_firmware',10.9,'report-lost'],['rv_firmware',13,'retry-and-new'],['rv_firmware',16.5,'ACK'],
 ['rv_web',3,'high-cutoff-drifts'],['rv_web',5.8,'cursor-adjusts-LOD'],['rv_web',9.3,'lower-cutoff-stops-tracking'],['rv_web',13.4,'save-on-mouse'],
 ['rv_no_lights',3.35,'wheel-turning-and-LED-pulse'],['rv_no_lights',6.68,'periodic-idle-check'],
 ['rv_cable',3.4,'same-forward-move'],['rv_cable',6.3,'return-and-opposing-drag'],
 ['rv_wiring',3,'nick-propagates'],['rv_wiring',8.2,'field-cancellation-and-flex']
];
(async()=>{
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('Failed to load resource'))errors.push(m.text());});
 await page.goto((await pageUrl(file))+'?cap=1&qa=1&2d=1&t=.02',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__ready);
 await page.evaluate(()=>{
  const outline=rvi_outline,packet=rve_packet,module=elc_module,pouch=rve_pouch,cursor=rvCursor;
  rvi_outline=(...a)=>{window.__motion.outlines.push(a);return outline(...a);};rve_packet=(...a)=>{window.__motion.packets.push(a);return packet(...a);};
  elc_module=(...a)=>{window.__motion.modules.push(a.slice(0,4));return module(...a);};rve_pouch=(...a)=>{window.__motion.pouches.push(a);return pouch(...a);};
  rvCursor=(...a)=>{window.__motion.cursors.push(a);return cursor(...a);};
 });
 const frames=[];
 for(const[id,t,event]of events){
  const state=await page.evaluate(({id,t})=>{APP.i=DECK.slides.findIndex(s=>s.id===id);APP.frozenT=t;APP.trStart=-1;window.__motion={outlines:[],packets:[],modules:[],pouches:[],cursors:[]};frame();return{motion:window.__motion,text:QA.text.filter(x=>x.a>.25).map(x=>x.s)};},{id,t});
  const name=id+'_'+String(t).replace('.','p')+'_'+event+'.png',png=await page.screenshot({path:path.join(out,name)});frames.push({id,t,event,file:name,sha256:crypto.createHash('sha256').update(png).digest('hex'),...state});
 }
 const get=(id,event)=>frames.find(f=>f.id===id&&f.event===event),has=(f,s)=>f.text.some(x=>x.includes(s));
 const i0=get('rv_inertia','equal-initial-position').motion.outlines,ir=get('rv_inertia','lower-mass-reverses-first').motion.outlines;
 assert.equal(i0[0][0],i0[1][0]);assert(ir[1][0]<ir[0][0]);
 assert(get('rv_radio','cursor-flips-module').motion.modules[0][3]>0&&get('rv_radio','cursor-flips-module').motion.modules[0][3]<Math.PI);
 assert.equal(get('rv_radio','report').motion.modules[0][3],Math.PI);
 assert(get('rv_firmware','report-lost').motion.packets.some(x=>x[4]&&x[4].bad));
 assert.deepEqual(get('rv_firmware','retry-and-new').motion.packets.map(x=>x[2]).slice(-2),['17','18']);
 assert(get('rv_firmware','ACK').motion.packets.some(x=>x[2]==='ACK'));
 assert(has(get('rv_web','high-cutoff-drifts'),'TRACKING'));assert(has(get('rv_web','lower-cutoff-stops-tracking'),'CUT OFF'));
 assert(has(get('rv_power','CC'),'CONSTANT CURRENT'));assert(has(get('rv_power','CV'),'CONSTANT VOLTAGE'));
 const cc=get('rv_power','CC').motion.pouches.find(x=>x[0]===702),cv=get('rv_power','CV').motion.pouches.find(x=>x[0]===702);assert(cv[5].fill>cc[5].fill);
 assert(has(get('rv_no_lights','wheel-turning-and-LED-pulse'),'WHEEL TURNING'));assert(has(get('rv_no_lights','periodic-idle-check'),'WHEEL STILL'));assert(has(get('rv_no_lights','periodic-idle-check'),'90.5µA periodic'));
 assert.deepEqual(errors,[]);const report={file,htmlSha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),at:new Date().toISOString(),eventFrames:frames.length,causalChecks:'pass',errors,frames};fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
 await browser.close();console.log(JSON.stringify({eventFrames:frames.length,causalChecks:'pass',errors:errors.length}));
})().catch(e=>{console.error(e);process.exitCode=1;setTimeout(()=>process.exit(1),100);});
