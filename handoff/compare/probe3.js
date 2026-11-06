const {chromium}=require("playwright");const {pageUrl}=require("/home/claude/live/deck/tools/serve.js");
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
 await p.goto((await pageUrl("decks/astra.html"))+"?scene=a_inertia&t=0",{waitUntil:"domcontentloaded"}); await p.waitForTimeout(3000);
 const r=await p.evaluate(()=>JSON.stringify(FilmAPI.state()).slice(0,400)); console.log(r);
 const src=await p.evaluate(()=>FilmAPI.select.toString().slice(0,300)+' || '+FilmAPI.pause.toString().slice(0,200)+' || '+FilmAPI.state.toString().slice(0,300)); console.log(src);
 await b.close();})();
