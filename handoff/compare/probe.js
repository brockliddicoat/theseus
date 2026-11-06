const {chromium}=require("playwright");const {pageUrl}=require("/home/claude/live/deck/tools/serve.js");
(async()=>{const b=await chromium.launch();
for (const f of process.argv.slice(2)){const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on("pageerror",e=>errs.push(e.message.slice(0,120)));
 await p.goto(await pageUrl(f),{waitUntil:"domcontentloaded"}); await p.waitForTimeout(6000);
 const r=await p.evaluate(()=>{const o={};o.DECK=typeof DECK!=="undefined";o.go=typeof go;o.APP=typeof APP!=="undefined";
   if(o.DECK){o.n=DECK.slides.length;o.first=DECK.slides.slice(0,4).map(s=>[s.id,s.ch,(s.title||'').slice(0,50),s.settle]);}
   const ks=Object.keys(window).filter(k=>/scene|SCENE|slide|SLIDE|DECK|FILM|film/i.test(k)).slice(0,20);o.keys=ks;return o;});
 console.log(f, JSON.stringify(r), 'errs:', JSON.stringify(errs.slice(0,3))); await p.close();}
await b.close();})();
