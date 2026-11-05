// Offline JS execution with a minimal inert DOM: no browser, no egress, no GUI.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(path.join(__dirname,'direct-drive-demo.html'),'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
assert.equal(new Set(ids).size,ids.length,'duplicate HTML ID');
const elements = new Map(ids.map(id=>[id,{
  id, textContent:'', value:'', style:{}, attrs:{}, listeners:{}, classes:new Set(),
  setAttribute(name,value){this.attrs[name]=String(value);},
  addEventListener(name,callback){this.listeners[name]=callback;},
  querySelector(){return {setAttribute(){}};},
  classList:{toggle(name,on){if(on)elements.get(id).classes.add(name);else elements.get(id).classes.delete(name);}}
}]));
const element=id=>{assert.ok(elements.has(id),'unknown DOM id '+id);return elements.get(id);};
let raf;
const sandbox={document:{getElementById:element},window:{},requestAnimationFrame:callback=>{raf=callback;},Math};
vm.createContext(sandbox);
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script,{filename:'direct-drive-demo.inline.js'}).runInContext(sandbox);
const api=sandbox.window.TheseusDirectDrive;
let checks=2;
function near(actual,expected,label,tolerance=1e-10){assert.ok(Math.abs(actual-expected)<tolerance,label+': '+actual+' versus '+expected);checks++;}
function click(id){element(id).listeners.click({target:element(id)});}
function input(id,value){element(id).value=String(value);element(id).listeners.input({target:element(id)});}
assert.equal(element('gain').textContent,'6.0307% sooner');checks++;
assert.equal(element('aligned-time').textContent,'3.5000 ms');checks++;
assert.equal(element('angled-time').textContent,'3.7246 ms');checks++;
for(const mode of ['speed','force'])for(const angle of [0,20,45])for(const travel of [.2,.35,.7]){
  const m=api.model(mode,angle,travel);
  const after=api.displacement(mode,m.c,m.aligned);
  const before=api.displacement(mode,m.c,m.angled);
  near(after.aligned,travel,'aligned threshold');
  near(before.angled,travel,'angled threshold');
  near(m.aligned/m.angled,mode==='speed'?m.c:Math.sqrt(m.c),'model ratio');
  const sameTime=api.displacement(mode,m.c,(m.aligned+m.angled)/2);
  near(sameTime.angled/sameTime.aligned,m.c,'shared physical time');
  assert.ok(110+85*api.displacement(mode,m.c,m.end).aligned/travel+7<290,'cap stays above housing');checks++;
}
click('between');
assert.equal(element('aligned-state').textContent,'actuated');checks++;
assert.equal(element('angled-state').textContent,'not actuated');checks++;
click('force');
assert.equal(element('gain').textContent,'3.0623% sooner');checks++;
click('between');
assert.equal(element('aligned-state').textContent,'actuated');checks++;
assert.equal(element('angled-state').textContent,'not actuated');checks++;
input('angle',0);click('between');
assert.equal(element('aligned-state').textContent,'actuated');checks++;
assert.equal(element('angled-state').textContent,'actuated');checks++;
input('angle',20);click('speed');click('play');
raf(1000);raf(1400);
assert.equal(element('clock').textContent,'1.0000 ms');checks++;
near(Number(element('aligned-x').textContent.split(' ')[0]),.1,'400x clock and travel');
click('play');raf(1800);
assert.equal(element('clock').textContent,'1.0000 ms');checks++;
click('reset');
assert.equal(element('clock').textContent,'0.0000 ms');checks++;
assert.ok(!/<script[^>]+src=|<link[^>]+href=|@import|url\((?!\s*["']?#)/i.test(html),'no automatic external resource loads');checks++;
const result={status:'pass',offline_js_assertions:checks,browser_render_performed:false,method:'Inert offline DOM; model thresholds, shared physical clock, pause/reset, both modes, zero-angle identity, endpoint geometry, no external resource tags'};
console.log(JSON.stringify(result,null,2));
