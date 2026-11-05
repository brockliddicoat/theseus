// One isolated page, many deterministic frames. Avoid recompiling the entire film for every frame.
// NODE_PATH=<runtime node_modules> node deck/tools/check-film.cjs [html] [out] [ids...]
const {chromium}=require('playwright');
const {pageUrl}=require('./serve.js');
const fs=require('fs'),path=require('path'),crypto=require('crypto');
(async()=>{
 const file=process.argv[2]||'deck/dist/index.html',out=process.argv[3]||'deck/qa/film-check',want=process.argv.slice(4);
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('Failed to load resource'))errors.push(m.text());});
 const testedHtml=path.join(out,'tested-index.html');
 const sourceBytes=fs.readFileSync(file);fs.writeFileSync(testedHtml,sourceBytes);
 const htmlSha256=crypto.createHash('sha256').update(sourceBytes).digest('hex');
 await page.goto((await pageUrl(testedHtml))+'?cap=1&qa=1&2d=1&t=0.02',{waitUntil:'domcontentloaded',timeout:120000});
 await page.waitForFunction('window.__ready===true',null,{timeout:90000});
 const slides=await page.evaluate(()=>DECK.slides.map((s,i)=>({id:s.id,i,title:s.title,settle:s.settle||14,from:s.from||[],src:s.src||[]})));
 const selected=slides.filter(s=>!want.length||want.includes(s.id));
 const report={file:path.resolve(file),testedHtml:path.resolve(testedHtml),htmlSha256,at:new Date().toISOString(),slideCount:slides.length,manifest:slides,selected:selected.length,errors:[],slides:[]};
 for(const s of selected){
  const times=[.02,1.5,3,5,7,9,12,s.settle*.4,s.settle,s.settle+2].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b),frames=[];
  for(const t of times){
   const start=errors.length;
   const q=await page.evaluate(({i,t})=>{
    APP.i=i;APP.frozenT=t;APP.trStart=-1;frame();
    const T=QA.text.filter(r=>r.a>.25&&r.s.trim().length),B=QA.boxes,out=[];
    for(const r of T){
     if(r.x0<2||r.x1>1918||r.y0<2||r.y1>1078)out.push('OFFSTAGE '+r.s);
     if(r.px<19)out.push('SMALL '+r.px+' '+r.s);
     for(const c of B){const ix=Math.min(r.x1,c.x1)-Math.max(r.x0,c.x0),iy=Math.min(r.y1,c.y1)-Math.max(r.y0,c.y0),inside=r.x0>=c.x0-1&&r.x1<=c.x1+1&&r.y0>=c.y0-1&&r.y1<=c.y1+1,over=Math.max(c.x0-r.x0,r.x1-c.x1,c.y0-r.y0,r.y1-c.y1);if(ix>0&&iy>0&&!inside&&over>6&&ix*iy>.15*(r.x1-r.x0)*(r.y1-r.y0))out.push('EDGE '+r.s);}
    }
    for(let i=0;i<T.length;i++)for(let j=i+1;j<T.length;j++){
     const a=T[i],b=T[j],ix=Math.min(a.x1,b.x1)-Math.max(a.x0,b.x0),iy=Math.min(a.y1,b.y1)-Math.max(a.y0,b.y0),ar=Math.min((a.x1-a.x0)*(a.y1-a.y0),(b.x1-b.x0)*(b.y1-b.y0));
     if(ix>3&&iy>3&&ix*iy>.12*ar&&!(a.s===b.s&&Math.abs(a.x0-b.x0)<3))out.push('OVERLAP '+a.s+' / '+b.s);
    }
    return {issues:[...new Set(out)],text:T.map(x=>x.s),pending:V3.pending};
   },{i:s.i,t});
   // Store actual frames at start/mid/settle; hashes distinguish frames, not motion quality.
   let imageFile=null,sha256=null;
   if(t===.02||t===s.settle*.4||t===s.settle){imageFile=path.join(out,`${String(s.i).padStart(2,'0')}_${s.id}_${t.toFixed(2)}.png`);const b=await page.screenshot({path:imageFile});sha256=crypto.createHash('sha256').update(b).digest('hex');}
   const e=errors.slice(start);frames.push({t,...q,errors:e,image:imageFile,sha256});
  }
  report.slides.push({...s,frames});
  const bad=frames.filter(f=>f.issues.length||f.errors.length);
  console.log(s.id,bad.length?JSON.stringify(bad.map(f=>({t:f.t,issues:f.issues.slice(0,8),errors:f.errors}))).slice(0,1800):'clean');
 }
 report.errors=[...new Set(errors)];
 report.issueFrames=report.slides.reduce((n,s)=>n+s.frames.filter(f=>f.issues.length||f.errors.length).length,0);
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));
 await browser.close();console.log('SUMMARY',JSON.stringify({scenes:report.selected,issueFrames:report.issueFrames,errors:report.errors.length}));
 process.exitCode=report.issueFrames||report.errors.length?1:0;
})().catch(e=>{console.error(e);process.exitCode=1;});
