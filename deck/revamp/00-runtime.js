/* Codex mirror, F27 / F32 / F33. The old film is evidence, not the new story. */
const RV_LEGACY = DECK.slides.slice();
/* Rejected/hidden concepts stay out of both films, but their feedback links must
   still open the preserved source scene when Brock explicitly requests it. */
const RV_ARCHIVE = RV_LEGACY.concat([
  HIDDEN_map,HIDDEN_gld_position,HIDDEN_shlLattice3d,HIDDEN_sealed,
  HIDDEN_shlGrams,HIDDEN_shbGates,SHB_DOME_SLIDE,HIDDEN_pltPlate,
  HIDDEN_pltSim,HIDDEN_pltOptions,HIDDEN_srf_marks,HIDDEN_details,
  HIDDEN_serial,HIDDEN_elc_sheet2
]);
/* Brock's latest direction: blue Theseus, yellow comparisons, neutral chapters.
   Original-slide mode keeps its historical palette for a fair comparison. */
if (!new URLSearchParams(location.search).has('legacy') && new URLSearchParams(location.search).get('film') !== 'original') {
  HU.hero = ['#1267D8', '#3B86F5'];
  HU.text = ['#0959C4', '#78B6FF'];
  HU.grad = [['#5398EA', '#0F5CC2'], ['#9CCFFF', '#458EF1']];
  HU.second = ['#C7A20D', '#E1BE3E'];
  HU.secondText = ['#7B6300', '#E5C34B'];
  HU.bad = ['#B94646', '#D96B6B'];
  C.heroChip = '#1267D8';
  for (const k of Object.keys(ACCENTS)) ACCENTS[k] = ['#676763', '#A5A5A0'];
}
const RV = {
  legacy: RV_LEGACY, slides: [], version: 'codex-1',
  add(s) {
    s.rev = s.rev || 1; s.settle = s.settle || 14; s.chrome = false; s.paper = 0.22;
    s.from = s.from || []; s.feedback = s.feedback || [];
    s.ideas = [...new Set(s.from.flatMap(id => (RV_ARCHIVE.find(x => x.id === id) || {}).ideas || []))];
    s.src = [...new Set(s.src || s.from.flatMap(id => (RV_ARCHIVE.find(x => x.id === id) || {}).src || []))];
    this.slides.push(s); return s;
  },
  finish() {
    const q = new URLSearchParams(location.search);
    const legacy = q.get('legacy');
    for (const s of this.slides.slice()) if (s.before || s.after) {
      const from = this.slides.indexOf(s), target = this.slides.findIndex(x => x.id === (s.before || s.after));
      if (target >= 0 && target !== from) { this.slides.splice(from, 1); const at = this.slides.findIndex(x => x.id === (s.before || s.after)); this.slides.splice(at + (s.after ? 1 : 0), 0, s); }
    }
    const requested = legacy && RV_ARCHIVE.find(x => x.id === legacy);
    const historical = requested && !RV_LEGACY.includes(requested) ? RV_LEGACY.concat(requested) : RV_LEGACY;
    DECK.slides.length = 0;
    DECK.slides.push(...(legacy ? historical : q.get('film') === 'original' ? RV_LEGACY : this.slides));
    if (legacy) { q.set('s', legacy); history.replaceState(null, '', '?' + q.toString()); }
    if (!q.has('2d')) V2D.on = true;
    window.RV = RV;
  }
};
const rvEase = (t, a = 0.5, b = 1.5) => ep(t, a, b, E.cam);
const rvCycle = (t, start = 1.8, per = 4.8) => {
  const x = cyc(t, start, per); return x < 0 ? 0 : x < 0.18 ? E.io3(x / 0.18) : x < 0.45 ? 1 : x < 0.72 ? 1 - E.io3((x - 0.45) / 0.27) : 0;
};
function rvTxt(s, x, y, size = 30, o = {}) { return text(s, x, y, {font:'sans', size, weight:600, caps:false, sentence:false, track:0, ...o}); }
function rvLabel(s,x,y,o={}) { return rvTxt(s,x,y,23,{weight:700,caps:true,color:C.mute,...o}); }
function rvBody(s,x,y,w=600,o={}) { return rvTxt(s,x,y,30,{maxW:w,lh:1.34,color:C.ink2,...o}); }
function rvNum(s,x,y,size=92,o={}) { return rvTxt(s,x,y,size,{font:'disp',weight:800,track:-0.035,tnum:true,color:C.heroText,grad:C.heroGrad,...o}); }
function rvLine(points,col=C.ink,w=3,a=1,dash=null) {
  G.save(); G.globalAlpha=a; G.strokeStyle=col; G.lineWidth=w; G.lineCap='round';G.lineJoin='round';
  G.setLineDash(dash || []); G.beginPath();points.forEach((p,i)=>i?G.lineTo(...p):G.moveTo(...p));G.stroke();G.restore();
}
function rvRect(x,y,w,h,fill=C.panel,r=6,stroke=null,lw0=2) {
  G.save();G.beginPath();G.roundRect(x,y,w,h,r);if(fill){G.fillStyle=fill;G.fill();}if(stroke){G.strokeStyle=stroke;G.lineWidth=lw0;G.stroke();}G.restore();
}
function rvCircle(x,y,r,fill=C.ink,stroke=null,w=2) { G.save();G.beginPath();G.arc(x,y,r,0,TAU);if(fill){G.fillStyle=fill;G.fill();}if(stroke){G.strokeStyle=stroke;G.lineWidth=w;G.stroke();}G.restore(); }
function rvArrow(a,b,col=C.hero,w=4) {
  rvLine([a,b],col,w); const ang=Math.atan2(b[1]-a[1],b[0]-a[0]),l=12;
  rvLine([[b[0]-l*Math.cos(ang-.5),b[1]-l*Math.sin(ang-.5)],b,[b[0]-l*Math.cos(ang+.5),b[1]-l*Math.sin(ang+.5)]],col,w);
}
function rvHeader(t,title,lead,o={}) {
  const s=curSlide(); chapterIcon(s.ch,80,44,24,acc(s.ch));
  rvLabel(o.kicker || ((DECK.chapters.find(c=>c.key===s.ch)||{}).name || s.ch),122,65,{color:acc(s.ch)});
  rvLabel('THESEUS',1840,65,{align:'right',color:C.faint});
  rvTxt(title,77,159,o.size || 66,{font:'disp',weight:800,track:-.025,caps:true,maxW:1760,lh:1.02});
  if(lead) rvBody(lead,80,222,1720,{size:31,color:C.ink2});
  rvLine([[80,1008],[1840,1008]],C.hair,1.5);
  rvLabel((APP.i+1).toString().padStart(2,'0')+' / '+DECK.slides.length,1840,1046,{align:'right',size:20,color:C.faint});
  rvLabel('ZERO COMPROMISES',80,1046,{size:20,color:C.faint});
}
function rvFoot(s) { rvTxt(s,80,986,20,{color:C.mute,maxW:1760,lh:1.15}); }
function rvWin(head,body,o={}) {
  const x=o.x||80,y=o.y||881,w=o.w||1760;
  rvTxt(head,x,y, o.size||43,{font:'disp',weight:780,track:-.02,color:C.heroText});
  if(body)rvBody(body,x,y+45,w,{size:27,color:C.ink2,maxW:w});
}
function rvCompareLabels(t,left='WHAT SHIPS',right='THESEUS',o={}) {
  rvLabel(left,o.x0||100,o.y||294,{color:C.mute});
  rvLabel(right,o.x1||1020,o.y||294,{color:C.heroText,alpha:Math.max(.25,rvEase(t,4.0,5.2))});
}
function rvGhost(t,fn,start=4.0) { G.save();G.globalAlpha=rvEase(t,start,start+1.2);fn();G.restore(); }
function rvMouse(cx,cy,scale=3,o={}) {
  G.save();G.translate(cx,cy);G.scale(scale,scale);G.rotate(o.rot||0);
  keyPath();if(o.fill){G.fillStyle=o.fill;G.fill();} G.strokeStyle=o.color||C.ink;G.lineWidth=(o.lw||2.5)/scale;G.stroke();
  if(o.seams!==false) {const sy=KEY.seam;rvLine([[0,KEY.nose+1],[0,sy]],o.color||C.ink,1.6/scale);rvLine([[-keyHalfW(sy),sy],[keyHalfW(sy),sy]],o.color||C.ink,1.6/scale);G.beginPath();G.roundRect(-3.3,-45,6.6,14,2);G.fillStyle=o.color||C.ink;G.fill();}
  if(o.draw)o.draw();G.restore();
}
function rvCursor(t,x,y,press=0) {cursorPtr(x,y,{s:1.3,press});}
function rvFinger(x,y,rot=0,o={}) {
  G.save();G.translate(x,y);G.rotate(rot);G.beginPath();G.moveTo(-24,105);G.lineTo(-24,0);G.bezierCurveTo(-24,-34,24,-34,24,0);G.lineTo(24,105);G.closePath();
  G.fillStyle=o.fill|| (TH?'#dededb':'#2b2d31');G.fill();G.strokeStyle=o.color||C.mute;G.lineWidth=2;G.stroke();
  rvLine([[-13,26],[13,26]],C.faint,1.5);G.restore();
}
function rvBar(x,y,w,v,max,col=C.hero,h=16) {rvRect(x,y,w,h,C.track,h/2);rvRect(x,y,Math.max(1,w*clamp(v/max)),h,col,h/2);}
function rvBa(x,y,before,after,label,o={}) {
  rvLabel(label,x,y,{size:22}); rvTxt(before,x,y+55,39,{color:C.mute,weight:650});
  const bw=tw(before,{font:'sans',size:39,weight:650});rvLine([[x,y+43],[x+bw,y+43]],C.faint,2);
  rvTxt(after,x+bw+28,y+55,51,{font:'disp',weight:800,color:C.heroText});
}
function rvPart(cx,cy,scale,fn,o={}) {G.save();const a=part(cx,cy,scale,fn,o);G.restore();return a;}
function rvTick(t,t0=1.0) {return ep(t,t0,t0+1.4,E.out3);}
function rvStageNote(label,x,y,w=550) {rvTxt(label,x,y,23,{color:C.mute,maxW:w,lh:1.25});}
function rvSmallShot(cx,cy,rad=32,col=C.ink) {rvCircle(cx,cy,rad,null,col,2);rvLine([[cx-rad-10,cy],[cx-12,cy]],col,2);rvLine([[cx+12,cy],[cx+rad+10,cy]],col,2);rvLine([[cx,cy-rad-10],[cx,cy-12]],col,2);rvLine([[cx,cy+12],[cx,cy+rad+10]],col,2);}
function rvLattice(x,y,w,h,tri=true,bend=0,col=C.ink,o={}) {
  const step=o.step||70, rows=Math.floor(h/step),cols=Math.floor(w/step),P=(i,j)=>[x+i*step+(j%2?step/2:0)+bend*(j/Math.max(1,rows)),y+j*step];
  for(let j=0;j<=rows;j++)for(let i=0;i<cols;i++){
    if(i+1<cols)rvLine([P(i,j),P(i+1,j)],col,o.lw||5);
    if(j<rows){rvLine([P(i,j),P(i,j+1)],col,o.lw||5);if(tri&&i>0)rvLine([P(i,j),P(i-1,j+1)],col,o.lw||5);}
  }
}
