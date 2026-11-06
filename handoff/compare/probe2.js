const {chromium}=require("playwright");const {pageUrl}=require("/home/claude/live/deck/tools/serve.js");
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
 await p.goto(await pageUrl("decks/astra.html"),{waitUntil:"domcontentloaded"}); await p.waitForTimeout(6000);
 const r=await p.evaluate(()=>{const A=window.FilmAPI;const o={type:typeof A,keys:Object.keys(A||{})};
   for(const k of o.keys){const v=A[k];o[k]=typeof v==='function'?'fn('+v.length+')':Array.isArray(v)?'array '+v.length:typeof v;}
   try{const s=A.scenes||A.getScenes&&A.getScenes()||A.list&&A.list();if(s){o.n=s.length;o.first=s.slice(0,5).map(x=>typeof x==='object'?JSON.stringify(x).slice(0,160):String(x));}}catch(e){o.err=e.message}
   return o;});
 console.log(JSON.stringify(r,null,1).slice(0,3000)); await b.close();})();
