// NODE_PATH=<runtime node_modules> node deck/tools/check-wheel-contact.cjs [candidate.html] [out]
// Only rv_wheel is rendered. Observe real wheel/spoke drawing transforms and the fingertip parent
// transform; do not trust __structureMotion or repeat the animation's interpolation formula.
const {chromium}=require('playwright');
const {pageUrl}=require('./serve.js');
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const angleDelta=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));

(async()=>{
 const file=path.resolve(process.argv[2]||'deck/dist/index.html');
 const out=path.resolve(process.argv[3]||'deck/qa/wheel-contact');
 fs.mkdirSync(out,{recursive:true});
 const bytes=fs.readFileSync(file),testedHtml=path.join(out,'tested-wheel.html');
 fs.writeFileSync(testedHtml,bytes);
 const report={schemaVersion:1,file,testedHtml,htmlSha256:sha(bytes),at:new Date().toISOString(),scope:'rv_wheel only; stylized angular coupling, not measured friction/contact physics',identity:null,samples:[],checks:[],errors:[]};
 const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const p=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  p.on('pageerror',e=>report.errors.push(e.message));
  p.on('console',m=>{if(m.type()==='error'&&!m.text().includes('Failed to load resource'))report.errors.push(m.text());});
  await p.goto((await pageUrl(testedHtml))+'?cap=1&qa=1&2d=1&s=rv_wheel&t=10.9',{waitUntil:'domcontentloaded',timeout:120000});
  await p.waitForFunction('window.__ready===true',null,{timeout:90000});
  report.identity=await p.evaluate(()=>({build:typeof RV_BUILD==='undefined'?null:RV_BUILD.id,sceneCount:DECK.slides.length,scene:curSlide().id}));
  await p.evaluate(()=>{
   const wheel=rvs_wheel,finger=rvFinger,line=rvLine,txt=rvTxt;
   window.__wheelProbe={wheels:[],fingers:[],fullText:[]};let active=null;
   const matrix=()=>{const m=G.getTransform(),s=APP.scale*APP.dpr||1;return {a:m.a/s,b:m.b/s,c:m.c/s,d:m.d/s,e:m.e/s,f:m.f/s};};
   rvs_wheel=function(...args){const before=active,record={cx:args[0],cy:args[1],r:args[2],rot:args[3],tyre:args[4]||0,options:args[5]||{},spokes:[]};window.__wheelProbe.wheels.push(record);active=record;try{return wheel(...args);}finally{active=before;}};
   rvLine=function(points,...args){
    // Finished arms are the helper's actual22px-to-(r-16) radial segments. Side/tread lines do not match.
    if(active&&points.length===2&&Math.abs(Math.hypot(...points[0])-22)<1e-5&&Math.abs(Math.hypot(...points[1])-(active.r-16))<1e-5){const m=matrix();active.spokes.push({points,angle:Math.atan2(m.b,m.a),matrix:m});}
    return line(points,...args);
   };
   rvFinger=function(...args){const m=matrix();window.__wheelProbe.fingers.push({args:args.slice(0,3),parentAngle:Math.atan2(m.b,m.a),matrix:m});return finger(...args);};
   rvTxt=function(s,...args){window.__wheelProbe.fullText.push(String(s));return txt(s,...args);};
  });
  const contactTimes=Array.from({length:21},(_,i)=>11.301+(15-11.301)*i/20);
  const shots=new Map([[10.9,'before-contact'],[11.3,'contact-start'],[12.225,'contact-quarter'],[13.15,'contact-mid'],[14.075,'contact-three-quarter'],[15,'contact-end'],[15.201,'released']]);
  const times=[...new Set([10.9,11.1,11.3,...contactTimes,...shots.keys(),15.199,22])].sort((a,b)=>a-b);
  for(const t of times){
   const q=await p.evaluate(t=>{
    APP.i=DECK.slides.findIndex(s=>s.id==='rv_wheel');APP.frozenT=t;APP.trStart=-1;
    window.__wheelProbe={wheels:[],fingers:[],fullText:[]};frame();
    const T=QA.text.filter(r=>r.a>.25&&r.s.trim()),issues=[];
    for(const r of T){if(r.x0<2||r.x1>1918||r.y0<2||r.y1>1078)issues.push('OFFSTAGE '+r.s);if(r.px<19)issues.push('SMALL '+r.s);}
    for(let i=0;i<T.length;i++)for(let j=i+1;j<T.length;j++){const a=T[i],b=T[j],ix=Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0),iy=Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0),ar=Math.min((a.x1-a.x0)*(a.y1-a.y0),(b.x1-b.x0)*(b.y1-b.y0));if(ix>3&&iy>3&&ix*iy>.12*ar)issues.push('OVERLAP '+a.s+' / '+b.s);}
    return {trace:window.__wheelProbe,layoutIssues:[...new Set(issues)]};
   },t);
   const main=q.trace.wheels.filter(w=>w.r>100),body=main.find(w=>w.options.rim===1),finger=q.trace.fingers[0];
   const sample={t,...q,metrics:null,image:null};
   if(body&&body.spokes.length&&finger){
    const m=body.spokes[0].matrix,dx=finger.matrix.e-m.e,dy=finger.matrix.f-m.f;
    const bodyAngle=body.spokes[0].angle,radialAngle=Math.atan2(dx,-dy);
    sample.metrics={bodyAngle,fingerParentAngle:finger.parentAngle,fingerRadialAngle:radialAngle,angularPhaseErrorRad:angleDelta(bodyAngle,radialAngle),parentFrameErrorRad:angleDelta(bodyAngle,finger.parentAngle),fingerOriginRadiusPx:Math.hypot(dx,dy)};
   }
   if(shots.has(t)){sample.image=shots.get(t)+'.png';const png=await p.screenshot({path:path.join(out,sample.image)});sample.imageSha256=sha(png);}
   report.samples.push(sample);
  }
  const check=(name,pass,detail)=>report.checks.push({name,pass:!!pass,...(detail?{detail}:{} )});
  const all=report.samples,contact=all.filter(s=>s.t>=11.301&&s.t<=15),tol=1e-6;
  check('only the wheel scene was selected',report.identity.scene==='rv_wheel');
  check('actual two main-wheel and three control-wheel draws observed',all.every(s=>s.trace.wheels.filter(w=>w.r>100).length===2&&s.trace.wheels.filter(w=>w.r<100).length===3));
  check('actual finished main wheel has six arms and144 straight-groove drawing input',all.every(s=>s.trace.wheels.filter(w=>w.r>100).every(w=>w.spokes.length===6)&&s.trace.wheels.some(w=>w.r>100&&w.options.rim===1&&w.options.grooves===144)));
  check('wheel-helper rotation is actually used by the drawn spokes',all.every(s=>s.trace.wheels.every(w=>w.spokes.length===6&&w.spokes.every(p=>Math.abs(angleDelta(p.angle,w.rot))<tol))));
  check('all three control wheels retain the same displayed rotation',all.every(s=>s.trace.wheels.every(w=>Math.abs(angleDelta(w.rot,s.trace.wheels[0].rot))<tol)));
  check('fingertip is absent before placement and after release',all.filter(s=>s.t===10.9||s.t>=15.201).every(s=>s.trace.fingers.length===0));
  check('one actual fingertip draw is present throughout the stroke',contact.length>=21&&contact.every(s=>s.trace.fingers.length===1&&s.metrics));
  const measured=contact.filter(s=>s.metrics),maxPhase=Math.max(0,...measured.map(s=>Math.abs(s.metrics.angularPhaseErrorRad))),maxParent=Math.max(0,...measured.map(s=>Math.abs(s.metrics.parentFrameErrorRad)));
  check('drawn wheel and rim-following fingertip share angular phase',measured.length===contact.length&&maxPhase<tol&&maxParent<tol,{maxAngularPhaseErrorRad:maxPhase,maxParentFrameErrorRad:maxParent,toleranceRad:tol});
  let maxTravelError=0;for(let i=1;i<measured.length;i++){const a=measured[i-1].metrics,b=measured[i].metrics;maxTravelError=Math.max(maxTravelError,Math.abs(angleDelta(b.bodyAngle,a.bodyAngle)-angleDelta(b.fingerRadialAngle,a.fingerRadialAngle)));}
  check('observed per-step angular travel remains coupled',measured.length>=21&&maxTravelError<tol,{maxAngularTravelDifferenceRad:maxTravelError});
  const end=all.find(s=>s.t===15),stroke=end&&end.metrics?end.metrics.bodyAngle:null;
  check('finite visible stroke ends in a hold without extra wheel spin',stroke>.25&&all.filter(s=>s.t>=15).every(s=>s.trace.wheels.every(w=>Math.abs(angleDelta(w.rot,stroke))<tol)),{observedStrokeRad:stroke});
  check('metal-wheel-only mass scope and illustrative control wording stay visible',all.every(s=>{const text=s.trace.fullText.join(' ');return text.includes('0.90 g')&&text.includes('Metal wheel only; axle separate')&&text.includes('Illustrative designs; not retail weighings')&&text.includes('excludes POM axle/bushing');}));
  check('all observed text-layout frames are clean',all.every(s=>s.layoutIssues.length===0));
  report.metrics={contactSamples:contact.length,maxAngularPhaseErrorRad:maxPhase,maxParentFrameErrorRad:maxParent,maxAngularTravelDifferenceRad:maxTravelError,observedStrokeRad:stroke};
 }catch(e){report.errors.push(e.stack||e.message);}finally{await browser.close();}
 report.errors=[...new Set(report.errors)];report.passed=report.errors.length===0&&report.checks.length>0&&report.checks.every(c=>c.pass);
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({passed:report.passed,identity:report.identity,htmlSha256:report.htmlSha256,samples:report.samples.length,checks:report.checks.length,failed:report.checks.filter(c=>!c.pass).map(c=>c.name),errors:report.errors.length,metrics:report.metrics},null,2));
 if(!report.passed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
