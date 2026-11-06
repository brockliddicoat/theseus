const {chromium}=require("playwright");const http=require('http');const fs=require('fs');const path=require('path');
const root='/home/claude/compare/site';
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';const f=path.join(root,p);
 fs.readFile(f,(e,b)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'content-type':f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.json')?'application/json':'text/plain'});r.end(b);});}).listen(0,async()=>{
 const port=srv.address().port;const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-webgl']});const p=await b.newPage({viewport:{width:1280,height:900}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,150)));
 const out=[];
 for (const h of ['t02-v23','t02-today','t02-sol','t02-astra','t21-v23','t30-sol']){
   await p.goto(`http://127.0.0.1:${port}/index.html#${h}`,{waitUntil:'domcontentloaded'});await p.waitForTimeout(9000);
   const fr=p.frames().find(f=>f.url().includes('/decks/'));
   let st=null; if(fr){ st=await fr.evaluate(()=>{ if(typeof DECK!=='undefined'&&typeof APP!=='undefined') return {id:DECK.slides[APP.i].id, playing:APP.playing, v2d: typeof V2D!=='undefined'?V2D.on:null}; if(window.FilmAPI){const s=FilmAPI.state();return {scene:s.scene,t:+s.t.toFixed(1),playing:s.playing};} return null;}).catch(e=>'err '+e.message.slice(0,80)); }
   await p.screenshot({path:`/tmp/cmp_${h}.png`});
   out.push([h, fr?fr.url().split('/decks/')[1].slice(0,60):null, st]);
 }
 console.log(JSON.stringify(out,null,0)); console.log('errs',JSON.stringify(errs.slice(0,5)));
 await b.close(); srv.close();});
