const {chromium}=require('playwright'),fs=require('fs'),crypto=require('crypto');
(async()=>{
 const b=await chromium.launch(),p=await b.newPage({viewport:{width:1440,height:1000}}),errors=[],expectedBuild=process.argv[2]||null;
 p.on('pageerror',e=>errors.push(e.message));
 const response=await p.goto('https://brockliddicoat.github.io/theseus-codex-preview/?v='+Date.now(),{waitUntil:'domcontentloaded',timeout:120000});
 await p.waitForFunction(()=>typeof DECK!=='undefined'&&typeof APP!=='undefined'&&APP.i>=0,{timeout:90000});await p.waitForTimeout(1000);
 const state=await p.evaluate(()=>({title:document.title,slides:DECK.slides.length,primary:C.hero,secondary:C.second,count:document.getElementById('count').textContent,status:document.getElementById('reviewStatus').textContent,build:typeof RV_BUILD!=='undefined'?RV_BUILD:null}));
 const manifestResponse=await p.request.get('https://brockliddicoat.github.io/theseus-codex-preview/preview-version.json?t='+Date.now(),{headers:{'Cache-Control':'no-cache'}}),manifest=await manifestResponse.json(),bytes=await response.body();
 const proof={at:new Date().toISOString(),url:response.url(),httpStatus:response.status(),htmlSha256:crypto.createHash('sha256').update(bytes).digest('hex'),expectedBuild,state,manifest,errors};
 console.log(JSON.stringify(proof));fs.mkdirSync('deck/qa/live',{recursive:true});fs.writeFileSync('deck/qa/live/live-state.json',JSON.stringify(proof,null,2));fs.writeFileSync('deck/qa/live/public-html.html',bytes);await p.screenshot({path:'deck/qa/live/live.png'});await b.close();
 if(errors.length||response.status()!==200||manifest.buildId!==state.build.id||manifest.scenes!==state.slides||(expectedBuild&&state.build.id!==expectedBuild))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
