const {chromium}=require("playwright");const {pageUrl}=require("/home/claude/live/deck/tools/serve.js");const fs=require('fs');
(async()=>{const b=await chromium.launch();const out={};
for (const [k,f] of [['v23','decks/v23.html'],['today','decks/today.html'],['sol','decks/sol.html'],['astra','decks/astra.html']]){
 const p=await b.newPage({viewport:{width:1280,height:720}});await p.goto(await pageUrl(f),{waitUntil:"domcontentloaded"});await p.waitForTimeout(5000);
 out[k]=await p.evaluate(()=>{ if(typeof DECK!=='undefined') return DECK.slides.map(s=>({id:s.id,ch:s.ch,title:s.title||'',settle:s.settle||null,replaces:s.replaces||[],theme:s.theme||null}));
   return FilmAPI.scenes.map(s=>({id:s.id,ch:s.chapter||s.ch||null,title:s.title||'',settle:s.duration||null,replaces:s.old||[]}));});
 await p.close();}
fs.writeFileSync('slides.json',JSON.stringify(out,null,1));
for(const k in out) console.log(k,out[k].length,'with replaces:',out[k].filter(s=>s.replaces.length).length);
await b.close();})();
