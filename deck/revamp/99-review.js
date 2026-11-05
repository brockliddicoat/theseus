/* Browser-local review tools. No account, network database or cloud-save claims. */
const RV_STORE_KEY='theseus.codex.review.v1';
const RV_DB=(()=>{
 let data={ratings:{},edits:{},coverage:{}},lastError='';
 const changed=()=>window.dispatchEvent(new CustomEvent('rv-storage-status'));
 try{const raw=JSON.parse(localStorage.getItem(RV_STORE_KEY)||'{}');for(const c of Object.keys(data))if(raw[c]&&typeof raw[c]==='object'&&!Array.isArray(raw[c]))data[c]=raw[c];}
 catch(e){lastError='Local storage unavailable. Changes stay in memory; export a backup.';}
 const subs={},snap=c=>({docs:Object.entries(data[c]||{}).map(([id,v])=>({id,data:()=>v})),metadata:{fromCache:false}});
 const emit=c=>(subs[c]||[]).forEach(fn=>fn(snap(c)));
 const persist=next=>{try{localStorage.setItem(RV_STORE_KEY,JSON.stringify(next));lastError='';changed();}catch(e){lastError='Not saved to this browser. Changes stay in memory; export a backup.';changed();const err=Error(lastError);err.code='local_storage_unavailable';throw err;}};
 const db={
  collection:c=>({onSnapshot:(fn,err)=>{(subs[c]||(subs[c]=[])).push(fn);queueMicrotask(()=>{try{fn(snap(c));}catch(e){if(err)err(e);}});return()=>{subs[c]=(subs[c]||[]).filter(x=>x!==fn);};}}),
  doc:path=>({set:async v=>{const[c,k]=path.split('/');(data[c]||(data[c]={}))[k]=v;persist(data);emit(c);},delete:async()=>{const[c,k]=path.split('/');delete(data[c]||{})[k];persist(data);emit(c);}}),
  export:()=>JSON.parse(JSON.stringify({format:'theseus-codex-review',version:1,exportedAt:new Date().toISOString(),film:RV.version,...data})),
  import:v=>{if(!v||v.format!=='theseus-codex-review'||v.version!==1)throw Error('This is not a supported Theseus review backup.');
   const next={};for(const c of ['ratings','edits','coverage']){if(v[c]!=null&&(typeof v[c]!=='object'||Array.isArray(v[c])))throw Error('Invalid '+c+' collection.');next[c]=Object.assign({},data[c],v[c]||{});}
   persist(next);data=next;Object.keys(subs).forEach(emit);},
  coverage:()=>data.coverage,status:()=>lastError
 };return db;
})();
window.RV_DB=RV_DB;
/* Autoplay is opt-in. Reading, reviewing, editing or seeking cannot advance a slide.
   Closing a panel never silently resumes: the viewer explicitly presses Play. */
const RV_AUTO={enabled:new URLSearchParams(location.search).get('auto')==='1',hold:2.5};
window.RV_AUTO=RV_AUTO;
function rvAutoBlocked(){return ['rate','edit','review','src'].some(id=>{const p=document.getElementById(id);return p&&!p.hidden;})||EDIT.on||/^(TEXTAREA|INPUT|SELECT)$/.test(document.activeElement&&document.activeElement.tagName)||!!(document.activeElement&&document.activeElement.isContentEditable);}
function rvAutoPause(){if(APP.playing&&APP.frozenT==null){APP.tPause=slideT();APP.playing=false;document.getElementById('playIcon').setAttribute('d','M7 5v14l11-7z');document.getElementById('play').setAttribute('aria-label','Play');}rvAutoStatus();}
function rvAutoStatus(){const b=document.getElementById('autoBtn');if(b){const label=RV_AUTO.enabled?(APP.playing&&!rvAutoBlocked()?'autoplay':'autoplay paused'):'manual';if(b.textContent!==label)b.textContent=label;b.setAttribute('aria-pressed',String(RV_AUTO.enabled));}}
function rvAutoTick(){
 if(RV_AUTO.enabled&&APP.playing&&APP.frozenT==null&&!rvAutoBlocked()&&document.visibilityState!=='hidden'&&curSlide()&&slideT()>=(curSlide().settle||14)+RV_AUTO.hold){
  if(APP.i<DECK.slides.length-1)go(APP.i+1);else{RV_AUTO.enabled=false;rvAutoPause();}
 }rvAutoStatus();
}
/* Explicitly local even when another host has an unrelated global named claude. */
window.claude={use:async k=>k==='db'?RV_DB:k==='user'?{canEdit:async()=>true}:null};
const rvAuditRatings=()=>Array.isArray(RV_AUDIT.ratings)?RV_AUDIT.ratings:[];
function rvReviewItems(s){return(s.from&&s.from.length?s.from:[s.id]).map(id=>rvAuditRatings().find(r=>(r.legacyId||r.id)===id)).filter(Boolean);}
function rvEl(tag,txt,cls){const e=document.createElement(tag);if(txt!=null)e.textContent=txt;if(cls)e.className=cls;return e;}
function rvStorageStatus(){const e=document.getElementById('reviewStatus'),b=typeof RV_BUILD!=='undefined'?RV_BUILD:null;if(e)e.textContent=(b?'Preview build '+b.id+(b.at?' / '+b.at:'')+'\n':'')+(RV_DB.status()||'Reviews and text edits are local to this browser. Export a backup to move or share them.');}
let rvPendingBuild=null,rvReloading=false;
function rvCanRefresh(){return !rvAutoBlocked()&&!RATE.dirty&&!Object.values(RATE.pend).some(Boolean)&&!Object.values(EDQ).some(q=>q.busy)&&!RV_DB.status()&&curSlide()&&slideT()>=(curSlide().settle||14);}
async function rvReloadPreview(manual=false){
 if(!rvPendingBuild||rvReloading||(!manual&&!rvCanRefresh()))return false;
 await rvFlushPending();
 if(RV_DB.status()||RATE.dirty||Object.values(RATE.pend).some(Boolean)||Object.values(EDQ).some(q=>q.busy)){const m=document.getElementById('previewUpdateMessage');if(m)m.textContent='New preview ready. Export a review backup before updating: browser storage did not save.';return false;}
 rvReloading=true;const u=new URL(location.href);u.searchParams.set('v',rvPendingBuild.buildId);if(curSlide())u.hash=curSlide().id;location.replace(u.href);return true;
}
async function rvCheckUpdate(){
 try{const u=new URL('preview-version.json',location.href);u.searchParams.set('t',String(Date.now()));const r=await fetch(u.href,{cache:'no-store'});if(!r.ok)return false;const b=await r.json(),now=typeof RV_BUILD!=='undefined'?RV_BUILD.id:'';if(!b)return false;b.buildId=b.buildId||b.id;if(typeof b.buildId!=='string'||!b.buildId||b.buildId===now)return false;
  rvPendingBuild=b;const p=document.getElementById('previewUpdate'),m=document.getElementById('previewUpdateMessage');if(p)p.hidden=false;if(m)m.textContent='New preview ready / '+b.buildId+(b.scenes?' / '+b.scenes+' scenes':'');await rvReloadPreview(false);return true;
 }catch(e){return false;}
}
window.RVcheckUpdate=rvCheckUpdate;
async function rvFlushPending(){rateFlush();if(EDIT.on)editSave();for(let n=0;n<30;n++){if(!Object.values(RATE.pend).some(Boolean)&&!Object.values(EDQ).some(q=>q.busy))break;await new Promise(r=>setTimeout(r,20));}}
async function rvDownload(){await rvFlushPending();const blob=new Blob([JSON.stringify(RV_DB.export(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='theseus-review-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function rvCoverageFor(s){return(RV_COVERAGE.slides||RV_COVERAGE)[s.id]||{};}
function rvPendingMatches(entry,id){if(typeof entry!=='string')return entry&&entry.id===id;const s=entry.trim();if(!s.startsWith(id))return false;const tail=s.slice(id.length);return !tail||/^[\s:;—–]/.test(tail)||/^\.(?!\d)/.test(tail);}
function rvClauseMatches(id){const out=[];for(const[sid,record]of Object.entries(RV_COVERAGE.slides||RV_COVERAGE)){if(!record||typeof record!=='object')continue;const mapped=(record.clauses||[]).find(x=>x.id===id),pending=(record.pending||[]).find(x=>rvPendingMatches(x,id));if(mapped||pending)out.push({sid,mapped,pending});}return out;}
function rvClausePending(mapped){return !!mapped&&(/^(?:partial|pending|open|conditional)\b|pending|(?:awaiting|needs|under)[- ]review/i.test(String(mapped.status||'')));}
function rvVerificationText(v){if(Array.isArray(v))return v.map(rvVerificationText).join('; ');if(v&&typeof v==='object')return Object.entries(v).map(([k,x])=>k.replace(/_/g,' ')+': '+rvVerificationText(x)).join('; ');return v==null?'':String(v);}
function rvRenderClause(c,mapped,cov,s){
 const id=c.id,li=rvEl('li'),matches=rvClauseMatches(id),fallback=!mapped&&(matches.find(x=>x.mapped&&x.mapped.answer&&!rvClausePending(x.mapped))||matches.find(x=>x.mapped&&x.mapped.answer)),answer=mapped||(fallback&&fallback.mapped);
 const pending=matches.filter(x=>x.pending||rvClausePending(x.mapped)),reopened=!!(RV_DB.coverage()[id]||{}).reopened,open=reopened||!!pending.length||!answer||rvClausePending(answer);
 li.dataset.answerFrom=fallback?fallback.sid:s.id;
 li.dataset.clauseId=id;li.dataset.status=open?'pending':'responded';li.append(rvEl('span',c.text||String(c)));
 if(answer&&answer.answer)li.append(rvEl('div','What changed: '+answer.answer,'answer'));
 if(fallback){const links=rvEl('div','Addressed in: ','verification');matches.filter(x=>x.mapped&&x.mapped.answer).forEach((x,i)=>{if(i)links.append(document.createTextNode(' / '));const dest=DECK.slides.find(z=>z.id===x.sid),a=rvEl('a',dest&&(dest.title||dest.id)||x.sid);a.href='#'+x.sid;a.dataset.addressedIn=x.sid;a.onclick=e=>{const idx=DECK.slides.findIndex(z=>z.id===x.sid);if(idx<0)return;e.preventDefault();rvAutoPause();go(idx);rvRenderReview();};links.append(a);});li.append(links);}
 if(open){const reasons=[...new Set(pending.map(x=>{const p=x.pending,reason=typeof p==='string'?p:typeof p==='object'&&(p.reason||p.text)||x.mapped&&x.mapped.status||'pending review';const owner=DECK.slides.find(z=>z.id===x.sid);return((owner&&owner.title)||x.sid)+': '+reason;}))];li.append(rvEl('div',reopened?'Still open: you marked this for another pass.':'Still open: '+(reasons.join('; ')||'this clause has not passed the implementation review.'),'pending'));}
 if(answer&&answer.verification)li.append(rvEl('div','Verification: '+rvVerificationText(answer.verification),'verification'));
 const b=rvEl('button',reopened?'marked for another pass':'this still needs work');b.type='button';b.dataset.act='reopen-clause';
 b.onclick=async()=>{try{await RV_DB.doc('coverage/'+id).set({clause:id,slide:s.id,text:c.text,reopened:true,at:new Date().toISOString()});}catch(e){rvStorageStatus();}rvRenderReview();};li.append(b);return li;
}
function rvRenderReview(){
 const p=document.getElementById('review');if(!p||p.hidden)return;const s=DECK.slides[APP.i];if(!s)return;const newSlide=p.dataset.slide!==s.id;p.dataset.slide=s.id;p.replaceChildren();
 const tb=rvEl('div',null,'toolbar'),close=rvEl('button','close feedback'),save=rvEl('button','export my reviews'),imp=rvEl('button','import reviews');
 close.dataset.act='close-review';save.dataset.act='export-review';imp.dataset.act='import-review';[close,save,imp].forEach(e=>e.type='button');
 close.onclick=()=>rvClosePanel('review');save.onclick=rvDownload;imp.onclick=()=>document.getElementById('reviewImport').click();tb.append(close,save,imp);p.append(tb);
 p.append(rvEl('h2',s.title||s.id),rvEl('p','Original feedback is preserved below. A mapped answer does not close a pending clause. New ratings and text edits are stored in this browser; export a backup to share or move them.'));
 const notes=rvReviewItems(s),cov=rvCoverageFor(s),seen=new Set();p.append(rvEl('h3','Replaces '+(s.from||[]).join(', ')));
 if(!notes.length)p.append(rvEl('p','No written rating was included for these source slides. Standing feedback still applies.'));
 notes.forEach(r=>{p.append(rvEl('h3',r.legacyId+' — '+r.score+'/10'),rvEl('blockquote',r.note||'No written note.'));const ul=rvEl('ul');(r.clauses||[]).forEach((c,i)=>{const cc={...c,id:c.id||r.legacyId+':'+(i+1)};seen.add(cc.id);ul.append(rvRenderClause(cc,(cov.clauses||[]).find(x=>x.id===cc.id),cov,s));});p.append(ul);});
 const extras=(cov.clauses||[]).filter(c=>!seen.has(c.id));if(extras.length){p.append(rvEl('h3','Additional standing feedback'));const ul=rvEl('ul');
  extras.forEach(m=>{let c;for(const row of RV_AUDIT.feedbackItems||[]){c=(row.clauses||[]).find(x=>x.id===m.id);if(c)break;}ul.append(rvRenderClause(c||{id:m.id,text:m.id},m,cov,s));});p.append(ul);}
 const listed=[...seen,...extras.map(m=>m.id)],unlisted=(cov.pending||[]).filter(x=>!listed.some(id=>rvPendingMatches(x,id)));if(unlisted.length){p.append(rvEl('h3','Deliberately left open'));unlisted.forEach(x=>p.append(rvEl('p',typeof x==='string'?x:(x.id+': '+(x.reason||x.text||'Pending review.')),'pending')));}
 const original=rvEl('a','Open the original slide for comparison');original.href='?legacy='+encodeURIComponent((s.from||[])[0]||s.id)+'&2d=1';original.target='_blank';original.rel='noopener';p.append(original);if(newSlide)p.scrollTop=0;requestAnimationFrame(rvReadingPanelsFit);
}
function rvReadingPanelsFit(){if(document.body.classList.contains('cap')||document.body.classList.contains('clean'))return;const bar=document.getElementById('bar');if(!bar)return;const bottom=bar.getBoundingClientRect().top-12;for(const id of ['rate','src','review']){const p=document.getElementById(id);if(!p||p.hidden)continue;const top=parseFloat(getComputedStyle(p).top)||12;p.style.maxHeight=Math.max(128,Math.min(innerHeight*.76,bottom-top))+'px';}}
function rvClosePanel(id){const p=document.getElementById(id);if(p)p.hidden=true;if(id==='edit'&&EDIT.on)editToggle(false);const b=document.getElementById(id==='rate'?'rateBtn':id==='review'?'reviewBtn':id==='src'?'srcBtn':'editBtn');if(b)b.setAttribute('aria-expanded','false');requestAnimationFrame(fit);}
function rvPanelClose(id,label){const p=document.getElementById(id);if(!p||p.querySelector('[data-act="close-panel"]'))return;const b=rvEl('button','close '+label,'pill rv-panel-close');b.type='button';b.dataset.act='close-panel';b.setAttribute('aria-label','Close '+label);b.onclick=()=>rvClosePanel(id);p.prepend(b);}
const rvBaseRateSync=rateSync;
rateSync=function(){rvBaseRateSync();const p=document.getElementById('rate');if(!p||p.hidden||!p.dataset.built)return;rvPanelClose('rate','rating');
 p.querySelector('textarea').setAttribute('aria-label','Slide review note');
 let box=p.querySelector('.legacy-review');if(!box){box=rvEl('details',null,'legacy-review');p.append(box);}
 const s=DECK.slides[APP.i];box.replaceChildren();box.append(rvEl('summary','Original feedback and exact clauses ('+rvReviewItems(s).length+' source slides)'));
 rvReviewItems(s).forEach(r=>{box.append(rvEl('strong',r.legacyId+' '+r.score+'/10'),rvEl('blockquote',r.note||'No written note.'));const ul=rvEl('ul');(r.clauses||[]).forEach(c=>ul.append(rvEl('li',c.text)));box.append(ul);});
 const b=rvEl('button','check every clause','pill');b.type='button';b.onclick=()=>{document.getElementById('review').hidden=false;document.getElementById('reviewBtn').setAttribute('aria-expanded','true');rvAutoPause();rvRenderReview();};box.append(b);
 rvAutoPause();requestAnimationFrame(rvReadingPanelsFit);
 if(RV_DB.status())p.querySelector('.state').textContent=RV_DB.status();
};
const rvBaseEditSync=editSync;
editSync=function(focus){rvBaseEditSync(focus);rvPanelClose('edit','text editor');if(RV_DB.status()&&!document.getElementById('edit').hidden){const state=document.querySelector('#edit .state');if(state)state.textContent=RV_DB.status();}};
const rvBaseRenderSources=renderSources;
renderSources=function(all){rvBaseRenderSources(all);rvPanelClose('src','sources');requestAnimationFrame(rvReadingPanelsFit);};
const rvBaseUpdateBar=updateBar;
updateBar=function(){rvBaseUpdateBar();rvRenderReview();const sc=document.getElementById('seek');if(sc){sc.max=(curSlide().settle||14)+3;sc.value=slideT();}};
const rvOriginalFit=fit;
fit=function(){
 if(document.body.classList.contains('cap')||document.body.classList.contains('clean')){rvOriginalFit();return;}
 const app=document.getElementById('app'),bar=document.getElementById('bar'),cs=getComputedStyle(app),n=x=>parseFloat(x)||0;
 const px=n(cs.paddingLeft)+n(cs.paddingRight),py=n(cs.paddingTop)+n(cs.paddingBottom)+10,vw=Math.max(80,innerWidth-px);
 bar.style.width=Math.min(vw,1400)+'px';const bh=getComputedStyle(bar).display==='none'?0:(bar.offsetHeight||44);
 const edit=document.getElementById('edit'),sideEditing=edit&&!edit.hidden&&innerWidth>720&&innerHeight<=540,dock=edit&&!edit.hidden&&!sideEditing?Math.min(edit.offsetHeight+24,innerHeight*.48):0;
 const w=Math.floor(Math.max(80,Math.min(vw,(innerHeight-bh-py-dock)*16/9))),h=w*9/16;
 app.style.height='calc(100% - '+dock+'px)';document.documentElement.style.setProperty('--barH',bh+'px');
 const st=document.getElementById('stage');st.style.width=w+'px';st.style.height=h+'px';APP.dpr=Math.min(2,devicePixelRatio||1);APP.scale=w/W;
 for(const c of [document.getElementById('fx'),OFF,SNAP]){const cw=Math.round(w*APP.dpr),ch=Math.round(h*APP.dpr);if(c.width!==cw||c.height!==ch){c.width=cw;c.height=ch;}}
 rvReadingPanelsFit();
};
window.addEventListener('rv-storage-status',rvStorageStatus);
window.addEventListener('DOMContentLoaded',()=>{
 const bar=document.getElementById('bar'),rev=rvEl('button','feedback','pill');rev.id='reviewBtn';rev.type='button';rev.setAttribute('aria-expanded','false');rev.setAttribute('aria-controls','review');
 rev.onclick=()=>{const p=document.getElementById('review');p.hidden=!p.hidden;rev.setAttribute('aria-expanded',String(!p.hidden));if(!p.hidden)rvAutoPause();rvRenderReview();};bar.append(rev);
 const p=rvEl('aside');p.id='review';p.hidden=true;p.setAttribute('aria-label','Original feedback and revision evidence');document.getElementById('app').append(p);
 const save=rvEl('button','export reviews','pill');save.id='reviewExportBtn';save.type='button';save.onclick=rvDownload;bar.append(save);
 const file=rvEl('input');file.type='file';file.accept='application/json,.json';file.id='reviewImport';file.hidden=true;
 file.onchange=async()=>{try{if(!file.files[0])return;await rvFlushPending();RV_DB.import(JSON.parse(await file.files[0].text()));rvRenderReview();rvStorageStatus();}catch(e){alert(e.message);}file.value='';};document.body.append(file);
 const replay=rvEl('button','replay','pill');replay.id='replayBtn';replay.type='button';replay.setAttribute('aria-label','Replay this slide');replay.onclick=()=>{if(EDIT.on)editToggle(false);APP.frozenT=null;APP.playing=true;go(APP.i,{force:true,instant:true});APP.t0=performance.now();APP.tPause=0;APP.lastT=0;document.getElementById('play').setAttribute('aria-label','Pause');document.getElementById('playIcon').setAttribute('d','M6 5h4v14H6zM14 5h4v14h-4z');};bar.append(replay);
 const auto=rvEl('button','manual','pill');auto.id='autoBtn';auto.type='button';auto.setAttribute('aria-label','Automatically advance slides after their animation and a reading hold');auto.setAttribute('aria-pressed',String(RV_AUTO.enabled));auto.onclick=()=>{RV_AUTO.enabled=!RV_AUTO.enabled;if(RV_AUTO.enabled&&!APP.playing&&!rvAutoBlocked()&&APP.frozenT==null)togglePlay();rvAutoStatus();};bar.append(auto);rvAutoStatus();
 const seek=rvEl('input');seek.id='seek';seek.type='range';seek.min='0';seek.max='20';seek.step='.01';seek.value='0';seek.setAttribute('aria-label','Animation time on this slide');
 seek.oninput=()=>{APP.playing=false;APP.frozenT=null;APP.tPause=+seek.value;APP.trStart=-1;frame();document.getElementById('play').setAttribute('aria-label','Play');document.getElementById('playIcon').setAttribute('d','M7 5v14l11-7z');rvAutoStatus();};bar.append(seek);
 const stat=rvEl('span');stat.id='reviewStatus';stat.setAttribute('aria-live','polite');bar.append(stat);rvStorageStatus();
 const update=rvEl('aside');update.id='previewUpdate';update.hidden=true;update.setAttribute('aria-live','polite');const um=rvEl('span','New preview ready');um.id='previewUpdateMessage';const ub=rvEl('button','reload preview','pill');ub.type='button';ub.onclick=()=>rvReloadPreview(true);update.append(um,ub);document.getElementById('app').append(update);
 if(location.hostname==='brockliddicoat.github.io'&&!new URLSearchParams(location.search).has('cap'))setInterval(rvCheckUpdate,20000);
 let raf=0;const scheduleFit=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{fit();if(!APP.playing)frame();});};
 new ResizeObserver(scheduleFit).observe(bar);new MutationObserver(scheduleFit).observe(document.getElementById('edit'),{attributes:true,childList:true,subtree:true});
 const counter=()=>{if(APP.playing&&APP.frozenT==null)seek.value=slideT();rvAutoTick();if(APP.frozenT==null)requestAnimationFrame(counter);};requestAnimationFrame(counter);
 ['rateBtn','editBtn','srcBtn'].forEach(id=>document.getElementById(id).addEventListener('click',()=>queueMicrotask(()=>{if(rvAutoBlocked())rvAutoPause();rvReadingPanelsFit();})));
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&RV_AUTO.enabled)rvAutoPause();});
 document.addEventListener('keydown',e=>{if(e.target.isContentEditable){e.stopImmediatePropagation();return;}if(e.key==='Escape'){rvClosePanel('review');}},true);
 document.getElementById('stage').addEventListener('touchend',e=>{if(EDIT.on)e.stopImmediatePropagation();},true);
 if(!new URLSearchParams(location.search).has('cap'))scheduleFit();
});
window.addEventListener('beforeunload',()=>{try{rateFlush();if(EDIT.on)editSave();}catch(e){}});

